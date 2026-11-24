"""Subtitles. long -> out/en.srt + out/hi.srt (UTF-8, CRLF, no BOM). reel -> audio/reel/captions.ass (burned-in).

Two burned-in caption styles (v0.5), both taken from the reference videos:
  Cap  - Lora serif, 2 lines, lower third. The normal storytelling caption.
  Word - one word at a time, heavy bold sans, uppercase. Used only inside the
         monster-introduction block, where the reference short puts a single
         word on screen per beat ("HAS  PERFECTLY  COPIED  YOUR  VOICE").
Declare the word-mode beats in story/script_reel.py:  WORD_BEATS = [1, 2, 3]
The .srt files are never word-split: subtitles must stay readable sentences.
"""
import sys, json, re, os, importlib
NAME = sys.argv[1]
tm = json.load(open(f'audio/{NAME}/timing.json')); units = tm['units']
sys.path[:0] = ['story', '.']
try:
    _script = importlib.import_module('script_long' if NAME == 'long' else 'script_reel')
    WORD_BEATS = set(getattr(_script, 'WORD_BEATS', []) or [])
except Exception:
    WORD_BEATS = set()
def wrap(text, width):
    words = text.split(); lines, cur = [], ''
    for w in words:
        if cur and len(cur) + 1 + len(w) > width: lines.append(cur); cur = w
        else: cur = (cur + ' ' + w).strip()
    if cur: lines.append(cur)
    return lines
def balanced(words, k):
    """split a word list into k groups of similar character length"""
    tot = sum(len(w) + 1 for w in words); out, cur, acc, j = [], [], 0, 1
    for i, w in enumerate(words):
        cur.append(w); acc += len(w) + 1
        left = len(words) - i - 1
        if j < k and (acc >= tot * j / k or left == k - j) and left >= k - j:
            out.append(cur); cur = []; j += 1
    if cur: out.append(cur)
    return out
def chunks(text, maxc, width):
    words = text.split(); k = 1
    while True:
        parts = [' '.join(g) for g in balanced(words, k)]
        if all(len(wrap(p, width)) <= 2 for p in parts) or k >= len(words): return parts
        k += 1
def fmt(t, ass=False):
    if ass:
        cs = int(round(t * 100)); h, cs = divmod(cs, 360000); m, cs = divmod(cs, 6000); s, cs = divmod(cs, 100); return f'{h}:{m:02d}:{s:02d}.{cs:02d}'
    ms = int(round(t * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000); return f'{h:02d}:{m:02d}:{s:02d},{ms:03d}'
def timed(maxc, width):
    cues = []
    for i, u in enumerate(units):
        parts = chunks(u['text'], maxc, width); tot = sum(len(p) for p in parts); t = u['start']; d = u['end'] - u['start']
        for p in parts:
            dd = d * len(p) / tot; cues.append(dict(u=i, s=t, e=t + dd, text=p)); t += dd
    # hold each cue until the next one starts (max +0.25s gap closing), min 0.9s
    for k in range(len(cues) - 1):
        nxt = cues[k + 1]['s']
        if nxt - cues[k]['e'] < 0.5: cues[k]['e'] = nxt - 0.02
    return cues
if NAME == 'long':
    hi = [l.strip() for l in open('story/hindi_long.txt', encoding='utf-8') if l.strip()]
    assert len(hi) == len(units), (len(hi), len(units))
    cues = timed(84, 42)
    os.makedirs('out', exist_ok=True)
    en_lines, hi_lines = [], []
    by_u = {}
    for c in cues: by_u.setdefault(c['u'], []).append(c)
    n = 0
    for i in range(len(units)):
        cs = by_u[i]; H = hi[i].split(); k = len(cs)
        # split Hindi sentence into k parts by the same share of characters
        parts = [' '.join(g) for g in balanced(H, k)] if k > 1 else [' '.join(H)]
        while len(parts) < k: parts.append(parts[-1])
        for c, hp in zip(cs, parts):
            n += 1
            en_lines += [str(n), f"{fmt(c['s'])} --> {fmt(c['e'])}", *wrap(c['text'], 42), '']
            hw = hp.split(); hl = [' '.join(g) for g in balanced(hw, 2)] if len(hp) > 44 and len(hw) > 1 else [hp]
            hi_lines += [str(n), f"{fmt(c['s'])} --> {fmt(c['e'])}", *hl, '']
    for fn, L in (('out/en.srt', en_lines), ('out/hi.srt', hi_lines)):
        with open(fn, 'wb') as fh: fh.write(('\r\n'.join(L) + '\r\n').encode('utf-8'))
    print('cues', n)
else:
    cues = timed(44, 22)
    head = """[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 2

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Cap,Lora,70,&H00FFFFFF,&H00FFFFFF,&H00000000,&H64000000,-1,0,0,0,100,100,1,0,1,6,2,2,70,70,430,1
Style: Word,Inter,96,&H00FFFFFF,&H00FFFFFF,&H00000000,&H78000000,-1,0,0,0,100,100,4,0,1,9,3,2,70,70,400,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    ev, nword = [], 0
    for c in cues:
        if c['u'] < len(units) and units[c['u']].get('beat') in WORD_BEATS:
            # one word at a time, each word holding its share of the cue
            ws = c['text'].split()
            if ws:
                span = (c['e'] - c['s']) / len(ws)
                for i, w in enumerate(ws):
                    a, b = c['s'] + i * span, c['s'] + (i + 1) * span
                    ev.append(f"Dialogue: 0,{fmt(a, True)},{fmt(b - 0.01, True)},Word,,0,0,0,,{w.upper()}")
                    nword += 1
            continue
        txt = '\\N'.join(wrap(c['text'], 22))
        ev.append(f"Dialogue: 0,{fmt(c['s'], True)},{fmt(c['e'], True)},Cap,,0,0,0,,{txt}")
    open('audio/reel/captions.ass', 'w', encoding='utf-8').write(head + '\n'.join(ev) + '\n')
    print('reel captions', len(cues), 'cues;', nword, 'word-mode cues (beats', sorted(WORD_BEATS) or '-', ')',
          'max line', max(len(l) for c in cues for l in wrap(c['text'], 22)))
