"""Build the shot list (JSON for Remotion) from the narration timing + the scene table (engine v0.5, 3D, 60 fps).

SYNC LAW (v0.5): the scene table has ONE LIST PER SPOKEN SENTENCE (narration unit), not one list per beat. Every shot therefore
starts and ends inside the sentence it illustrates, so the picture always shows what the narrator is saying at that moment.
Usage (work folder):  python3 tools/build_shots.py long|reel        (after tools/tts.py, before tools/sync_check.py)
  story/scenes_long.py : SC = [ [scene, scene, ...], ... ]  one list per unit of audio/long/timing.json (make it with
  tools/scaffold_scenes.py). A unit gets as many shots as it has scenes; if it has one scene and lasts longer than 2.7 s
  (teaser 2.2 s) the SAME set is used again with v.alt = 1 (a new moment: different pose, angle and camera), and that counts as
  a re-show in the quality gate, so write enough scenes.
Scene keys read by the engine: 'fr' = framing class (wide | waist | bust | close | detail; default wide; a face alone is never
allowed, see channel policy), 'cm' = camera move override, 'last' = always the final shot of its unit, 'hard' = hard cut in.
Frame rate comes from engine.json (60 fps).
"""
import sys, json, math, importlib, os, re
sys.path[:0] = ['story', '.', os.path.dirname(__file__)]
from cfg import FPS
NAME = sys.argv[1]
tm = json.load(open(f'audio/{NAME}/timing.json'))
script = importlib.import_module('script_long' if NAME == 'long' else 'script_reel')
table = importlib.import_module('scenes_long' if NAME == 'long' else 'scenes_reel').SC
BEATS = script.BEATS
units = tm['units']; dur = tm['duration']
assert len(table) == len(units), (f'scene table has {len(table)} entries but the narration has {len(units)} sentences; '
                                  f'rebuild it with: python3 tools/scaffold_scenes.py {NAME}')
TEASER = getattr(script, 'TEASER_LAST_BEAT', 2 if NAME == 'long' else 0)
ENDS = float(getattr(script, 'END_SCREEN_S', 20.0))
CARD_SETS = ('end', 'qcard', 'rqcard')
MINSHOT = 1.15  # never cut faster than this (a shorter picture cannot be read)
shots, chapters, warn, specs = [], [], [], {}
chn = 0
# the end screen (long video only) starts on the last sentence and runs ENDS seconds
end_start = max(units[-1]['start'] - 0.1, units[-1]['end'] - 3.0) if NAME == 'long' else None
for ui, u in enumerate(units):
    t0 = u['start'] if ui == 0 else max(u['start'] - 0.12, units[ui - 1]['end'])
    t1 = units[ui + 1]['start'] - 0.12 if ui + 1 < len(units) else (end_start + ENDS if NAME == 'long' else dur)
    if NAME == 'long' and ui == len(units) - 1: t0 = end_start; t1 = end_start + ENDS
    d = max(0.4, t1 - t0)
    L = list(table[ui]); gap = 2.2 if u['beat'] <= TEASER else 2.7
    if len(L) == 1 and L[0][0] in CARD_SETS:
        n = 1
    else:
        n = max(len(L), min(max(1, round(d / gap)), max(1, int(d / MINSHOT))))
    if len(L) < n: warn.append(f"unit {ui} ({d:.1f}s) has {len(L)} scene(s) for {n} shot(s) -> {n - len(L)} re-show(s): {u['text'][:60]}")
    for k in range(n):
        st, v = L[k] if k < len(L) else L[k % len(L)]
        v = dict(json.loads(json.dumps(v))); v.pop('last', None)
        key = json.dumps([st, v], sort_keys=True); specs.setdefault(key, []).append(ui)
        isc = k >= len(L)
        if isc: v['alt'] = 1
        fr = v.get('fr', 'wide'); fr = {'wide': 'waist', 'waist': 'bust', 'bust': 'wide', 'close': 'waist'}.get(fr, fr) if isc else fr
        a = t0 + d * k / n; b = t0 + d * (k + 1) / n
        shots.append(dict(b=u['beat'], u=ui, s=int(round(a * FPS)), e=int(round(b * FPS)), set=st, v=v, close=isc, fr=fr, reuse=isc,
                          dir=1 if (len(shots) % 2 == 0) else -1, off=((len(shots) * 37) % 120) * 0.1))
    if u.get('chapter'):
        ch = u['chapter']
        if ch != 'Intro':
            chn += 1; chapters.append(dict(s=int(round(t0 * FPS)) + int(0.2 * FPS), n=chn, title=ch, t=round(t0, 2)))
        else:
            chapters.append(dict(s=-999, n=0, title=ch, t=0.0))
for i in range(len(shots) - 1): shots[i]['e'] = shots[i + 1]['s']
frames = int(math.ceil(((end_start + ENDS) if NAME == 'long' else dur) * FPS)); shots[-1]['e'] = frames
dups = {k: v for k, v in specs.items() if len(set(v)) > 1}
out = dict(fps=FPS, teaser=TEASER, frames=frames, end_s=(round(end_start, 3) if NAME == 'long' else None), units=len(units),
           shots=shots, chapters=[c for c in chapters if c['s'] >= 0], chapter_times=[(c['t'], c['title']) for c in chapters])
json.dump(out, open(f'src/shots_{NAME}.json', 'w'))
lens = [s['e'] - s['s'] for s in shots]
body = min(dur, end_start or dur)
print(f'{NAME}: {dur:.1f}s, {len(units)} sentences, {len(shots)} shots, {len(specs)} unique scenes, '
      f'{len(shots) / (body / 60):.1f} screens/min, shot len min {min(lens) / FPS:.1f}s max {max(lens) / FPS:.1f}s; '
      f'teaser max {max(l for s, l in zip(shots, lens) if s["b"] <= TEASER) / FPS:.1f}s')
re_ = sum(1 for x in shots if x['reuse']); print(f'{NAME}: re-shown scenes {re_}/{len(shots)} = {re_ / len(shots) * 100:.0f}% (keep <= 10%: add scenes to the units listed in WARN)')
for w in warn: print('WARN', w)
for k, v in dups.items(): print('DUP', k[:120], 'in units', v)
