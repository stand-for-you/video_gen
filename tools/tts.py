"""Narration with Kokoro-onnx. Usage (from the work folder): python3 tools/tts.py long|reel
Story files: story/script_long.py or story/script_reel.py (BEATS), optional story/voices.py with
  VOICES = {'nar': ('af_nicole', 1.1), '<tag>': ('<kokoro voice>', speed), ...}   # character voices, LONG video only
  PITCH  = {'<tag>': 0.8}                                                       # creature/child voices: pitch change, same length
  SAY    = [('smile.jpg', 'smile dot J P G')]                                    # how tricky words are spoken (text on screen stays the same)
A unit that starts with [tag] is spoken by that character. The REEL is always ONE speaker: every tag becomes the narrator.
Writes: audio/<name>/units/*.wav (cache by text hash), audio/<name>/voice.wav, audio/<name>/timing.json.
All voices are level-matched to the narrator (median speech RMS). Model files: $KOKORO_DIR (default ./models)."""
import sys, os, json, importlib, hashlib
import numpy as np
import soundfile as sf
sys.path[:0] = ['story', '.']

NAME = sys.argv[1]
mod = importlib.import_module('script_long' if NAME == 'long' else 'script_reel')
BEATS = mod.BEATS
OUT = f'audio/{NAME}'
os.makedirs(f'{OUT}/units', exist_ok=True)
SR = 24000
GAP, BEAT_GAP, CHAP_GAP = 0.30, 0.45, 0.60   # overridden by story/voices.py if it sets them
VOICES, PITCH, SAY = {'nar': ('af_nicole', 1.1)}, {}, []
try:
    _v = importlib.import_module('voices')
    VOICES = {**VOICES, **getattr(_v, 'VOICES', {})}; PITCH = getattr(_v, 'PITCH', {}); SAY = getattr(_v, 'SAY', [])
    GAP = getattr(_v, 'GAP', GAP); BEAT_GAP = getattr(_v, 'BEAT_GAP', BEAT_GAP); CHAP_GAP = getattr(_v, 'CHAP_GAP', CHAP_GAP)
except ModuleNotFoundError:
    pass
MODELS = os.environ.get('KOKORO_DIR', 'models')
import re, subprocess
def who_of(u):
    m = re.match(r'^\[(\w+)\]', u)
    if not m or NAME == 'reel': return 'nar'   # Reel rule: exactly one speaker (Instagram voice translation)
    assert m.group(1) in VOICES, f'voice tag [{m.group(1)}] has no entry in story/voices.py VOICES'
    return m.group(1)
def clean(u):
    return re.sub(r'^\[\w+\]', '', u)


def split_units(text):
    """Split into speakable units; a quoted thought stays one unit."""
    units, cur, inq, i, n = [], '', False, 0, len(text)
    while i < n:
        c = text[i]; cur += c
        if c == '"' :
            if inq:
                units.append(cur.strip()); cur = ''
            inq = not inq
        elif c in '.?!' and not inq and not (c == '.' and i >= 1 and text[i - 1].isupper() and (i < 2 or text[i - 2] == ' ')):
            nxt = text[i + 1] if i + 1 < n else ' '
            if nxt == ' ' or i + 1 == n:
                units.append(cur.strip()); cur = ''
        i += 1
    if cur.strip(): units.append(cur.strip())
    return [u for u in units if u]


def upath(u, who):
    return f'{OUT}/units/' + hashlib.md5((who + '|' + u).encode()).hexdigest()[:12] + f'_{who}.wav'


def speech_rms(x):
    thr = 0.05 * np.max(np.abs(x)); a = x[np.abs(x) > thr]
    return float(np.sqrt(np.mean(a.astype(np.float64) ** 2))) if len(a) else 1e-4


def main():
    from kokoro_onnx import Kokoro
    k = Kokoro(f'{MODELS}/kokoro-v1.0.onnx', f'{MODELS}/voices-v1.0.bin')
    plan = []
    for bi, (chap, text) in enumerate(BEATS):
        for ui, u in enumerate(split_units(text)):
            plan.append((bi, chap if ui == 0 else None, clean(u), who_of(u)))
    print('units', len(plan), flush=True)
    for idx, (bi, chap, u, who) in enumerate(plan):
        p = upath(u, who)
        if os.path.exists(p): continue
        spoken = u.replace('"', '')
        for a, b in SAY: spoken = spoken.replace(a, b)
        vname, sp = VOICES[who]
        samples, sr = k.create(spoken, voice=vname, speed=sp, lang='en-us')
        assert sr == SR
        samples = np.asarray(samples, dtype=np.float32)
        thr = 0.01 * np.max(np.abs(samples)); nz = np.where(np.abs(samples) > thr)[0]
        if len(nz):
            a = max(0, nz[0] - int(0.02 * SR)); b = min(len(samples), nz[-1] + int(0.06 * SR)); samples = samples[a:b]
        sf.write(p, samples, SR)
        if who in PITCH:
            r = PITCH[who]; tmp = p + '.tmp.wav'
            subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', p, '-af', f'asetrate={int(SR * r)},aresample={SR},atempo={1 / r:.4f}', tmp], check=True)
            os.replace(tmp, p)
        if idx % 10 == 0: print(f'{idx}/{len(plan)}', flush=True)
    clips = [sf.read(upath(u, w), dtype='float32')[0] for (_, _, u, w) in plan]
    rn = np.median([speech_rms(c) for c, pl in zip(clips, plan) if pl[3] == 'nar'])
    gains = {}
    for w in set(pl[3] for pl in plan):
        rr = [speech_rms(c) for c, pl in zip(clips, plan) if pl[3] == w]
        gains[w] = rn / np.median(rr)
    print('narrator rms', round(rn, 4), 'gains', {k: round(v, 2) for k, v in gains.items()}, flush=True)
    pieces, timing, t = [], [], 0.0
    for idx, ((bi, chap, u, who), c) in enumerate(zip(plan, clips)):
        c = c * gains[who]
        if idx > 0:
            g = CHAP_GAP if chap is not None else (BEAT_GAP if plan[idx - 1][0] != bi else GAP)
            pieces.append(np.zeros(int(g * SR), np.float32)); t += g
        start = t; pieces.append(c.astype(np.float32)); t += len(c) / SR
        timing.append({'i': idx, 'beat': bi, 'chapter': chap, 'text': u, 'who': who, 'start': round(start, 3), 'end': round(t, 3)})
    pieces.append(np.zeros(int(1.2 * SR), np.float32))
    voice = np.concatenate(pieces)
    sf.write(f'{OUT}/voice.wav', voice, SR)
    json.dump({'duration': len(voice) / SR, 'units': timing}, open(f'{OUT}/timing.json', 'w'), indent=1)
    print('DONE', len(voice) / SR, flush=True)


if __name__ == '__main__':
    if len(sys.argv) > 2 and sys.argv[2] == 'split':
        for bi, (c, t) in enumerate(BEATS):
            for u in split_units(t): print(bi, '|', who_of(u), '|', clean(u))
    else:
        main()
