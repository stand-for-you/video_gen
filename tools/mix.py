"""Music bed + tiny sfx + mix (memory-safe, chunked). Usage (work folder): python3 tools/mix.py long|reel
One very low steady drone (55/82.5/110 Hz, no melody, no beat) + faint wind. Music about 25 dB under the voice,
ducked 60% while speech is present. The long video is padded to the end-screen length (the drone continues).
Optional story/sfx.json: a list of tiny, quiet, non-musical effects placed from the narration text, e.g.
  [{"match": "It hissed", "kind": "hiss", "at": "end", "db": -28}, {"match": "Thud.", "kind": "thud", "at": "start", "db": -8}]
  kind: rumble | thud | click | hiss ; at: start (just before the line) | end (just after) ; db: level vs the voice (keep -8 .. -30).
Writes audio/<name>/mix.wav (48 kHz stereo, before loudness normalisation)."""
import sys, json
import numpy as np, soundfile as sf
from scipy.signal import resample_poly, butter, sosfilt, sosfilt_zi
NAME = sys.argv[1]
SR = 48000; CH = SR * 10
v24, _ = sf.read(f'audio/{NAME}/voice.wav', dtype='float32')
v = (resample_poly(v24, 2, 1) * 0.8).astype(np.float32); del v24
# The bed has to cover the whole FILM, including the end screen, and the clock is 30 fps.
# v0.5 divided by 10 here (a leftover from the 10 fps v0.4 shot clock), which made the bed
# three times the length of the video.
import os as _os
if _os.path.exists('src/film.json'):
    _frames = json.load(open('src/film.json'))[NAME]['filmFrames']
else:
    _frames = json.load(open(f'src/shots_{NAME}.json'))['frames']
target = int(round(_frames / 30 * SR))
if target > len(v): v = np.concatenate([v, np.zeros(target - len(v), np.float32)])
n = len(v); dur = n / SR
tm = json.load(open(f'audio/{NAME}/timing.json'))
# speech mask at 100 Hz, smoothed, then used per chunk by interpolation
MR = 100; m = np.zeros(int(dur * MR) + 2, np.float32)
for u in tm['units']: m[int(u['start'] * MR):int(u['end'] * MR) + 1] = 1
k = 25; m = np.clip(np.convolve(m, np.ones(k) / k, mode='same') * 1.6, 0, 1).astype(np.float32)
def mask_at(a, b): return np.interp(np.arange(a, b) / SR * MR, np.arange(len(m)), m).astype(np.float32)
def rms(x): return float(np.sqrt(np.mean(np.square(x, dtype=np.float64)) + 1e-12))
# voice level over speech only
acc, cnt = 0.0, 0
for a in range(0, n, CH):
    b = min(n, a + CH); mk = mask_at(a, b) > 0.5; seg = v[a:b][mk]
    acc += float(np.sum(np.square(seg, dtype=np.float64))); cnt += len(seg)
vr = np.sqrt(acc / max(1, cnt))
sos = butter(2, [250, 1400], btype='bandpass', fs=SR, output='sos')
rng = np.random.default_rng(3)
zl = sosfilt_zi(sos) * 0; zr = sosfilt_zi(sos) * 0
def music(a, b, zl, zr):
    t = np.arange(a, b, dtype=np.float64) / SR
    dl = np.zeros(b - a); dr = np.zeros(b - a)
    for fq, amp in [(55.0, 1.0), (82.5, 0.45), (110.0, 0.35)]:
        br = 1 + 0.12 * np.sin(2 * np.pi * 0.031 * t + fq)
        dl += amp * br * np.sin(2 * np.pi * fq * t); dr += amp * br * np.sin(2 * np.pi * fq * 1.002 * t + 0.7)
    wl, zl = sosfilt(sos, rng.standard_normal(b - a), zi=zl); wr, zr = sosfilt(sos, rng.standard_normal(b - a), zi=zr)
    gust = 0.55 + 0.45 * np.sin(2 * np.pi * 0.045 * t) * np.sin(2 * np.pi * 0.013 * t + 1.1)
    return dl, dr, wl * gust, wr * gust, t, zl, zr
# calibrate drone/wind levels on the first 20 s
dl, dr, wl, wr, _, _, _ = music(0, min(n, SR * 20), zl.copy(), zr.copy())
wscale = (rms(dl) / rms(wl)) * 10 ** (-10 / 20)
mus_rms = rms((dl + dr + (wl + wr) * wscale) / 2)
g = vr * 10 ** (-25 / 20) / mus_rms
# ---- tiny sfx, placed from the narration timing (all low and short; nothing musical)
sfx = np.zeros(n, np.float32); rs = np.random.default_rng(9)
def add(t, x, gain_db):
    a = int(t * SR); b = min(n, a + len(x))
    if 0 <= a < n: sfx[a:b] += (x[:b - a] * vr * 10 ** (gain_db / 20)).astype(np.float32)
def norm(x): return x / (np.sqrt(np.mean(x.astype(np.float64) ** 2)) + 1e-9)
def rumble(sec=5.0):
    m_ = int(sec * SR); tt = np.arange(m_) / SR
    x = sosfilt(butter(2, 160, 'lowpass', fs=SR, output='sos'), rs.standard_normal(m_))
    env = np.minimum(1, tt / 0.35) * np.exp(-tt / 1.6) * (1 + 0.5 * np.sin(2 * np.pi * 1.3 * tt))
    return norm(x * env).astype(np.float32)
def thud():
    m_ = int(0.6 * SR); tt = np.arange(m_) / SR
    x = np.sin(2 * np.pi * (70 - 30 * tt) * tt) * np.exp(-tt / 0.12) + 0.3 * sosfilt(butter(2, 300, 'lowpass', fs=SR, output='sos'), rs.standard_normal(m_)) * np.exp(-tt / 0.05)
    return norm(x).astype(np.float32)
def click():
    m_ = int(0.09 * SR); tt = np.arange(m_) / SR
    x = sosfilt(butter(2, [700, 2200], 'bandpass', fs=SR, output='sos'), rs.standard_normal(m_)) * np.exp(-tt / 0.015)
    return norm(x).astype(np.float32)
def hiss(sec=1.4):
    m_ = int(sec * SR); tt = np.arange(m_) / SR
    x = sosfilt(butter(2, [2500, 7000], 'bandpass', fs=SR, output='sos'), rs.standard_normal(m_))
    env = np.minimum(1, tt / 0.08) * np.exp(-tt / 0.5)
    return norm(x * env).astype(np.float32)
KINDS = {'rumble': rumble, 'thud': thud, 'click': click, 'hiss': hiss}
import os
rules = json.load(open('story/sfx.json')) if os.path.exists('story/sfx.json') else []
for u in tm['units']:
    for r in rules:
        if r['match'] in u['text']:
            t0 = u['end'] + 0.05 if r.get('at', 'start') == 'end' else max(0, u['start'] - 0.3)
            add(t0, KINDS[r['kind']](), float(r.get('db', -24)))
out = sf.SoundFile(f'audio/{NAME}/mix.wav', 'w', SR, 2, 'PCM_16')
peak = 0.0; su, sn, gu, gn = 0.0, 0, 0.0, 0
for a in range(0, n, CH):
    b = min(n, a + CH)
    dl, dr, wl, wr, t, zl, zr = music(a, b, zl, zr)
    mk = mask_at(a, b); duck = 1 - 0.6 * mk
    fade = np.minimum(1, np.minimum(t / 2.0, (dur - t) / 2.0))
    ml = (dl + wl * wscale) * g * duck * fade; mr = (dr + wr * wscale) * g * duck * fade
    mm = (ml + mr) / 2; s1 = mk > 0.5; s0 = mk < 0.1
    su += float(np.sum(mm[s1] ** 2)); sn += int(s1.sum()); gu += float(np.sum(mm[s0] ** 2)); gn += int(s0.sum())
    blk = np.stack([v[a:b] + ml + sfx[a:b], v[a:b] + mr + sfx[a:b]], 1).astype(np.float32)
    peak = max(peak, float(np.max(np.abs(blk)))); out.write(np.clip(blk, -0.99, 0.99))
out.close()
db = lambda x: 20 * np.log10(max(x, 1e-9))
print(f'{NAME}: {dur:.1f}s voice(speech) {db(vr):.1f} dBFS | music under speech {db(np.sqrt(su / max(1, sn))):.1f} dBFS ({db(np.sqrt(su / max(1, sn))) - db(vr):.1f} dB vs voice) | music in gaps {db(np.sqrt(gu / max(1, gn))):.1f} dBFS | peak {peak:.2f}')
