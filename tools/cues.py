"""SPEAKER-BADGED SUBTITLES for the long video (src/cues_long.json).

The reference video keeps a caption on screen for every line, with a small coloured badge
naming who is speaking (references/pov3d-style.md section 4). src/ui/Subtitles.tsx draws it
and Root.tsx reads src/cues_long.json - but nothing in v0.5 ever wrote that file, so the long
video shipped with no captions at all.

This converts audio/long/timing.json into those cues: 2-6 word chunks, at most two lines,
cut on the measured voice timing, coloured by speaker.

The REEL is left empty on purpose. Its captions are burned in by ffmpeg from
audio/reel/captions.ass (tools/subs.py), and drawing them twice would double them up.

Usage (work folder, after tools/tts.py):  python3 tools/cues.py long
"""
from __future__ import annotations
import importlib
import json
import sys

FPS = 30
name = sys.argv[1] if len(sys.argv) > 1 else 'long'
sys.path[:0] = ['story', '.']

if name != 'long':
    json.dump([], open('src/cues_reel.json', 'w'))
    print('reel captions are burned in by ffmpeg; src/cues_reel.json left empty')
    sys.exit(0)

v = importlib.import_module('voices')
ROLE = v.ROLE
NAMES = getattr(v, 'SPEAKER_NAMES', {})
STATES = getattr(v, 'SPEAKER_STATES', {})

tm = json.load(open('audio/%s/timing.json' % name))
units = tm['units']


def chunk(words, maxw=5):
    out, cur = [], []
    for w in words:
        cur.append(w)
        if len(cur) >= maxw:
            out.append(cur); cur = []
    if cur:
        if out and len(cur) == 1:
            out[-1] += cur
        else:
            out.append(cur)
    return [' '.join(c) for c in out]


cues = []
for u in units:
    who = u['who']
    text = u['text'].replace('"', '').strip()
    parts = chunk(text.split())
    if not parts:
        continue
    total = sum(len(p) for p in parts)
    t = float(u['start'])
    d = float(u['end']) - t
    for p in parts:
        dd = d * len(p) / total
        cues.append({
            's': int(round(t * FPS)),
            'e': int(round((t + dd) * FPS)),
            'who': NAMES.get(who, 'THE BOY'),
            'role': ROLE.get(who, 'you'),
            'state': STATES.get(who),
            'text': p,
        })
        t += dd
# hold each chunk until the next begins when the gap is small, so captions do not flicker
for i in range(len(cues) - 1):
    gap = cues[i + 1]['s'] - cues[i]['e']
    if 0 < gap <= int(0.5 * FPS):
        cues[i]['e'] = cues[i + 1]['s'] - 1
for c in cues:
    if c['state'] is None:
        del c['state']

json.dump(cues, open('src/cues_long.json', 'w', encoding='utf-8'), indent=0, ensure_ascii=False)
print('%d caption chunks -> src/cues_long.json (longest %d chars)'
      % (len(cues), max(len(c['text']) for c in cues)))
