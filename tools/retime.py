"""RE-TIME - put every picture on its own words.

A scene table is written before the narration exists, so its `secs` are estimates. After
tools/tts.py has measured the real narration, this reads audio/<name>/timing.json, works out
how long each BEAT actually takes, and writes story/retime_<name>.json. tools/build_shots.py
reads that file and scales each beat's scenes to fit, keeping their relative lengths.

That is what stops the drift that makes a video feel wrong: without it, a sentence about the
creature can land on a picture of an empty hall two beats later.

It needs the scene ids to carry their beat: b<beat>_<n>, which is how both scene tables are
written. It also writes src/chapters.json from the chapter labels in the script, because a
chapter at a guessed timestamp is worse than no chapter at all.

Usage (work folder, after tools/tts.py):
    python3 tools/retime.py long
    python3 tools/retime.py reel
Then run tools/build_shots.py again.
"""
from __future__ import annotations
import importlib
import json
import os
import sys

FPS = 30
MIN_SECS, MAX_HOLD = 0.8, 6.0
name = sys.argv[1] if len(sys.argv) > 1 else 'long'
sys.path[:0] = ['story', '.']

tm = json.load(open('audio/%s/timing.json' % name))
units = tm['units']
dur = float(tm['duration'])

# ---- when each beat starts and ends. A beat runs until the next beat opens its mouth, so
# the gaps between lines belong to the beat before them and nothing is left unaccounted for.
starts: dict[int, float] = {}
ends: dict[int, float] = {}
for u in units:
    b = u['beat']
    starts.setdefault(b, float(u['start']))
    ends[b] = float(u['end'])
order = sorted(starts)
span = {}
for i, b in enumerate(order):
    nxt = starts[order[i + 1]] if i + 1 < len(order) else dur
    span[b] = max(MIN_SECS, nxt - starts[b])

# ---- how many scenes each beat has, and what each one currently asks for
mod = importlib.import_module('scenes_%s' % name)
have: dict[str, list] = {}
for sc in mod.SCENES:
    have.setdefault(sc['id'].split('_')[0], []).append(sc)

out = {}
warn = []
for b in order:
    key = 'b%02d' % b
    if key not in have:
        warn.append('%s has %.1fs of narration and NO scene - write one' % (key, span[b]))
        continue
    out[key] = round(span[b], 3)
    n = len(have[key])
    per = span[b] / n
    if per > MAX_HOLD:
        warn.append('%s: %.1fs over %d scene(s) = %.1fs each, past the %.1fs hold limit - '
                    'write %d more scene(s) for this beat'
                    % (key, span[b], n, per, MAX_HOLD, int(span[b] / MAX_HOLD) + 1 - n))
for key in have:
    if key not in out:
        warn.append('%s has scenes but no narration - delete them or check the beat index' % key)

with open('story/retime_%s.json' % name, 'w') as f:
    json.dump(out, f, indent=1, sort_keys=True)

# ---- chapters, from the script's own labels, at measured times
if name == 'long':
    script = importlib.import_module('script_long')
    chapters = []
    for i, (label, _) in enumerate(script.BEATS):
        if label and i in starts:
            t = int(starts[i])
            chapters.append('%d:%02d %s' % (t // 60, t % 60, label))
    if chapters and not chapters[0].startswith('0:00'):
        chapters[0] = '0:00 ' + chapters[0].split(' ', 1)[1]
    with open('src/chapters.json', 'w', encoding='utf-8') as f:
        json.dump(chapters, f, indent=1, ensure_ascii=False)
    print('chapters:')
    for c in chapters:
        print('   ' + c)

for w in warn:
    print('WARN ' + w)
print('%s: %d beats, %.1fs of narration -> story/retime_%s.json' % (name, len(out), dur, name))
print('now run: python3 tools/build_shots.py %s' % name)
sys.exit(0)
