"""Build the shot list (JSON for Remotion) from narration timing + the scene table.
Usage: python3 build_shots.py long|reel
n = round(beat_seconds / 2.7) shots per beat (teaser: /2.2 so the picture changes at least every 2.5 s); shot k shows scene k mod S.
A scene shown a SECOND time becomes a close-up AND a later moment (+5 s of animation, v.alt = 1 so the set can change pose/expression).
Re-shows should be rare: write at least as many scenes per beat as shots (tools/quality_gate.py shots fails above 10 % re-shows).
Scene keys read by the engine: 'fr' = framing class (wide | waist | bust | close | detail; default wide), 'cm' = camera move override
(push | pull | truck | rise | still | orbit), 'fc' = close-up focus [x, y, zoom], 'last' = always the final shot of its beat, 'hard' = hard cut in.
Frame rate comes from engine.json (30 fps)."""
import sys, json, math, importlib, os
sys.path[:0] = ['story', '.', os.path.dirname(__file__)]
from cfg import FPS
NAME = sys.argv[1]
tm = json.load(open(f'audio/{NAME}/timing.json'))
script = importlib.import_module('script_long' if NAME == 'long' else 'script_reel')
table = importlib.import_module('scenes_long' if NAME == 'long' else 'scenes_reel').SC
BEATS = script.BEATS
assert len(table) == len(BEATS), (len(table), len(BEATS))
units = tm['units']; dur = tm['duration']; nb = len(BEATS)
last = {}
for u in units: last[u['beat']] = u
bstart = [0.0] + [last[b - 1]['end'] + 0.08 for b in range(1, nb)]
if NAME == 'long': bstart[-1] = max(last[nb - 1]['start'] - 0.1, last[nb - 1]['end'] - 3.0)  # end screen starts on the closing question itself ('Now tell me.' stays on the credit card)
bend = bstart[1:] + [dur]
# story/script_*.py may set TEASER_LAST_BEAT (index of the last teaser beat; long default 2, reel default 0)
# and END_SCREEN_S (long video only, default 20 s). Card sets shown as ONE still shot: CARD_SETS.
TEASER = getattr(script, 'TEASER_LAST_BEAT', 2 if NAME == 'long' else 0)
ENDS = float(getattr(script, 'END_SCREEN_S', 20.0))
CARD_SETS = ('end', 'qcard', 'rqcard')
shots, chapters, warn, specs = [], [], [], {}
chn = 0
for b in range(nb):
    t0, t1 = bstart[b], bend[b]
    if NAME == 'long' and b == nb - 1: t1 = t0 + ENDS  # end screen: last 20 s, narration ends inside its first 3 s
    d = t1 - t0
    n = max(1, round(d / (2.2 if b <= TEASER else 2.7))); Lall = table[b]
    if len(Lall) == 1 and Lall[0][0] in CARD_SETS: n = 1
    lasts = [x for x in Lall if x[1].get('last')]; L = [x for x in Lall if not x[1].get('last')]; m = len(L)
    n = max(n, len(lasts) + 1)
    n_main = n - len(lasts)
    if m + len(lasts) < n: warn.append(f'beat {b}: {m + len(lasts)} scenes for {n} shots ({d:.1f}s) -> {n - m - len(lasts)} re-show(s)')
    ustarts = [u['start'] for u in units if u['beat'] == b]
    cuts = [t0]
    for k in range(1, n):
        ideal = t0 + d * k / n
        near = min(ustarts, key=lambda s: abs(s - 0.1 - ideal)) - 0.1 if ustarts else ideal
        c = near if b > TEASER and abs(near - ideal) < 0.7 and near - cuts[-1] > 1.4 and t1 - near > 1.4 else ideal
        cuts.append(c)
    cuts.append(t1)
    if NAME == 'reel':  # keep story order: each scene's close-up follows its wide shot
        extra = max(0, n_main - m); order = []
        for i in range(m):
            order.append((i, False))
            if i < extra: order.append((i, True))
        order = order[:n_main]
    else:
        order = [(k % m, k >= m) for k in range(n_main)]
    for k in range(n):
        if k >= n_main: st, v = lasts[k - n_main]; isc = False
        else: st, v = L[order[k][0]]; isc = order[k][1]
        v = dict(json.loads(json.dumps(v))); v.pop('last', None)
        fc = v.pop('fc', [960, 540, 1.6] if NAME == 'long' else [540, 960, 1.6])
        key = json.dumps([st, v], sort_keys=True); specs.setdefault(key, []).append(b)
        if isc: v['alt'] = 1
        fr = v.get('fr', 'wide'); fr = {'wide': 'waist', 'waist': 'bust', 'bust': 'close'}.get(fr, fr) if isc else fr
        shots.append(dict(b=b, s=int(round(cuts[k] * FPS)), e=int(round(cuts[k + 1] * FPS)), set=st, v=v, close=isc, fr=fr, reuse=isc,
                          z=fc[2], fx=fc[0], fy=fc[1], dir=1 if (len(shots) % 2 == 0) else -1, off=((len(shots) * 37) % 120) * 3 + (150 if isc else 0)))
    ch = BEATS[b][0]
    if ch is not None:
        if ch != 'Intro':
            chn += 1; chapters.append(dict(s=int(round(t0 * FPS)) + int(0.2 * FPS), n=chn, title=ch, t=round(t0, 2)))
        else:
            chapters.append(dict(s=-999, n=0, title=ch, t=0.0))
for i in range(len(shots) - 1): shots[i]['e'] = shots[i + 1]['s']
frames = int(math.ceil((bstart[-1] + ENDS if NAME == 'long' else dur) * FPS)); shots[-1]['e'] = frames
if NAME == 'long': assert last[nb - 1]['end'] - bstart[-1] <= 3.0, ('question longer than 3 s', last[nb - 1]['end'] - bstart[-1])
dups = {k: v for k, v in specs.items() if len(set(v)) > 1}
out = dict(fps=FPS, teaser=TEASER, frames=frames, end_s=(round(bstart[-1], 3) if NAME == 'long' else None), shots=shots, chapters=[c for c in chapters if c['s'] >= 0], chapter_times=[(c['t'], c['title']) for c in chapters])
json.dump(out, open(f'src/shots_{NAME}.json', 'w'))
lens = [s['e'] - s['s'] for s in shots]
print(f'{NAME}: {dur:.1f}s, {len(shots)} shots, {len(specs)} unique scenes, {len(shots) / (dur / 60):.1f} screens/min, shot len min {min(lens) / FPS:.1f}s max {max(lens) / FPS:.1f}s; teaser max {max(l for s, l in zip(shots, lens) if s["b"] <= TEASER) / FPS:.1f}s')
re = sum(1 for x in shots if x['reuse']); print(f'{NAME}: re-shown scenes {re}/{len(shots)} = {re / len(shots) * 100:.0f}% (keep <= 10%: add scenes to the beats listed in WARN)')
for w in warn: print('WARN', w)
for k, v in dups.items(): print('DUP', k[:120], v)
