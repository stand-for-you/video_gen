"""Build the shot list (JSON for Remotion) from narration timing + the scene table.
Usage: python3 build_shots.py long|reel
n = round(beat_seconds / 2.7) shots per beat (teaser: /2.2 so the picture changes at least every 2.5 s); shot k shows scene k mod S,
the second showing of a scene is a close-up (push-in on its focus). Scenes flagged 'last' always close their beat."""
import sys, json, math, importlib
sys.path[:0] = ['story', '.']
NAME = sys.argv[1]
FPS = 10
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
    if m + len(lasts) < math.ceil(n / 2): warn.append(f'beat {b}: {m} scenes for {n} shots ({d:.1f}s)')
    ustarts = [u['start'] for u in units if u['beat'] == b]
    cuts = [t0]
    for k in range(1, n):
        ideal = t0 + d * k / n
        near = min(ustarts, key=lambda s: abs(s - 0.1 - ideal)) - 0.1 if ustarts else ideal
        c = near if b > TEASER and abs(near - ideal) < 0.7 and near - cuts[-1] > 1.4 and t1 - near > 1.4 else ideal
        cuts.append(c)
    cuts.append(t1)
    if NAME == 'reel':  # keep story order: each scene's close-up follows its wide shot
        order = []
        cycle = 0
        while len(order) < n_main:
            for i in range(m):
                order.append((i, cycle % 2 == 1))
                if len(order) == n_main:
                    break
            cycle += 1
    else:
        order = [(k % m, k >= m) for k in range(n_main)]
    for k in range(n):
        if k >= n_main: st, v = lasts[k - n_main]; isc = False
        else: st, v = L[order[k][0]]; isc = order[k][1]
        v = dict(json.loads(json.dumps(v))); v.pop('last', None)
        fc = v.pop('fc', [960, 540, 1.6] if NAME == 'long' else [540, 960, 1.6])
        key = json.dumps([st, v], sort_keys=True); specs.setdefault(key, []).append(b)
        shots.append(dict(b=b, s=int(round(cuts[k] * FPS)), e=int(round(cuts[k + 1] * FPS)), set=st, v=v, close=isc,
                          z=fc[2], fx=fc[0], fy=fc[1], dir=1 if (len(shots) % 2 == 0) else -1, off=(len(shots) * 37) % 120))
    ch = BEATS[b][0]
    if ch is not None:
        if ch != 'Intro':
            chn += 1; chapters.append(dict(s=int(round(t0 * FPS)) + 2, n=chn, title=ch, t=round(t0, 2)))
        else:
            chapters.append(dict(s=0, n=0, title='Intro', t=0.0))
# stats and checks
tot = shots[-1]['e'] / FPS
slens = [(s['e'] - s['s']) / FPS for s in shots]
teaser_lens = [(s['e'] - s['s']) / FPS for s in shots if s['b'] <= TEASER]
print(f"{NAME}: {tot:.1f}s, {len(shots)} shots, {len(specs)} unique scenes, {len(shots)/(tot/60):.1f} screens/min, "
      f"shot len min {min(slens):.1f}s max {max(slens):.1f}s; teaser max {max(teaser_lens):.1f}s")
for w in warn: print('WARN', w)
# DUP check: a (set, variant) should not appear in multiple non-contiguous beats
for k, bs in specs.items():
    if len(set(bs)) > 1 and max(bs) - min(bs) >= len(set(bs)):
        print('DUP', k, bs)
out = dict(total_frames=shots[-1]['e'], fps=FPS, shots=shots, chapters=chapters)
json.dump(out, open(f'src/shots_{NAME}.json', 'w'), indent=2)
