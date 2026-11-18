"""Turn story/plan_reel.txt into story/scenes_long.py (one list per spoken sentence - the sync law).
Run:  python3 story/expand_reel.py > story/scenes_long.py"""
import json, math, re
U = json.load(open('audio/reel/timing.json'))['units']
PLAN = [l.split() for l in open('story/plan_reel.txt') if l.strip()]
assert len(PLAN) == len(U), (len(PLAN), len(U))
SET = dict(rbd='rbedroom', rov='rover', rso='rsockets', rwi='rwindow', rya='ryard', rho='rhouse', rpo='rporch',
           rha='rhall', rki='rkitchen', rmi='rmirror', rwa='rward', rco='rcorridor', rwo='rwoods', rca='rcar',
           rse='rseat', rcm='rcamera', rfl='rflash', rcr='rcreature', rfa='rfar')
FRC = dict(w='wide', t='waist', b='bust', c='close', d='detail')
FRS = ['wide', 'waist', 'bust', 'detail', 'close']
MOVES = ['push', 'orbit', 'arc', 'truck', 'pan', 'pull', 'crane', 'tilt', 'drop', 'vertigo']
R = lambda i, *rs: any(a <= i <= b for a, b in rs)
# a set with a fixed camera cannot show the same sentence twice: show the other side of the same moment instead
FIXED = {'rsockets': [('rover', {'fr': 'waist'}), ('rcreature', {'fr': 'waist'})],
         'rcamera': [('rbedroom', {'fr': 'detail'}), ('rbedroom', {'fr': 'bust'})],
         'rflash': [('rover', {'fr': 'waist'}), ('rcreature', {'fr': 'wide'})],
         'rfar': [('rhall', {'fr': 'waist'}), ('rhall', {'fr': 'wide'})]}

def keys(st, i, fr, k=0):
    v = {}
    if fr: v['fr'] = fr
    if st == 'rbedroom':
        v['lamp'] = 0.5 if R(i, (6, 7)) else 0
        v['open'] = 0.9 if R(i, (10, 12), (19, 25), (40, 40)) else 0
        if R(i, (10, 12)): v['sit'] = True; v['expr'] = 'fear'
        if i == 40: v['mitch'] = False
    if st == 'rover':
        v['sit'] = False
    if st == 'rwindow':
        v['open'] = 0.9 if R(i, (10, 12)) else 0.15
    if st == 'ryard': v['porch'] = 0.9
    if st == 'rhouse':
        v['mitch'] = i == 29
        v['door'] = 0.7 if i == 29 else 0
    if st == 'rporch':
        v['door'] = 0.5
        v['mitch'] = True
    if st == 'rhall': v['lamp'] = 1.0
    if st == 'rkitchen':
        v['cup'] = 1; v['mirror'] = True; v['mitch'] = True; v['eexpr'] = 'shock'
    if st == 'rward':
        v['doc'] = True
        v['chart'] = R(i, (15, 18))
    if st == 'rwoods':
        v['amber'] = 0.4
        v['pose'] = 'run'
    if st == 'rseat': v['open'] = i >= 33
    if st == 'rfar': v['shake'] = 0.3
    if st == 'rcreature': v['pose'] = 'stand'
    v['cm'] = MOVES[(i * 3 + k * 7) % len(MOVES)]
    v['dir'] = 1 if (i + k) % 2 == 0 else -1
    return v

print('# Scene table for the REEL - "Eyeless Jack" (engine v0.5, 3D, sets in src/SetsR.tsx).')
print('# ONE LIST PER SPOKEN SENTENCE (the sync law). Written as story/plan_reel.txt, expanded by story/expand_reel.py.')
print('def S(st, **v): return (st, v)')
print('SC = [')
for i, u in enumerate(U):
    row = PLAN[i]; codes = row[1:]
    assert int(row[0]) == i, row
    t0 = u['start'] if i == 0 else max(u['start'] - 0.12, U[i - 1]['end'])
    t1 = U[i + 1]['start'] - 0.12 if i + 1 < len(U) else u['end']
    dur = max(0.4, t1 - t0)
    gap = 2.2 if u['beat'] <= 4 else 2.7
    want = math.ceil(dur / gap) if u['beat'] <= 4 else round(dur / gap)
    n = max(1, min(int(want), max(1, int(dur / 1.15))))
    sc = [(SET[c.partition('/')[0]], keys(SET[c.partition('/')[0]], i, FRC.get(c.partition('/')[2], ''), k))
          for k, c in enumerate(codes)]
    base = list(sc); j = 0
    while len(sc) < n:
        st, vv = base[j % len(base)]; vv = dict(vv)
        if st in FIXED:
            st2, extra = FIXED[st][j % len(FIXED[st])]
            vv = dict(keys(st2, i, extra.get('fr', ''), j + 3))
            if extra.get('fr'): vv['fr'] = extra['fr']
            st = st2
        elif 'fr' in vv:
            vv['fr'] = FRS[(FRS.index(vv['fr']) + 1 + j) % len(FRS)]
        vv['cm'] = MOVES[(i * 3 + (j + 5) * 7) % len(MOVES)]; vv['dir'] = -vv.get('dir', 1)
        sc.append((st, vv)); j += 1
    seen = set(); kk = lambda d2: repr(sorted((a, str(b)) for a, b in d2.items()))
    for q in range(len(sc)):
        st, vv = sc[q]; vv = dict(vv); g = 0
        while (st, kk(vv)) in seen and g < 24:
            vv['cm'] = MOVES[(MOVES.index(vv.get('cm', 'push')) + 1) % len(MOVES)]
            if g % len(MOVES) == len(MOVES) - 1 and 'fr' in vv: vv['fr'] = FRS[(FRS.index(vv['fr']) + 1) % len(FRS)]
            g += 1
        seen.add((st, kk(vv))); sc[q] = (st, vv)
    print(' # %3d %5.1fs [%s] %s' % (i, dur, u['who'], re.sub(r'\s+', ' ', u['text'])[:80].replace('"', "'")))
    print(' [' + ', '.join("S('%s'%s)" % (st, ''.join(', %s=%r' % (a, b) for a, b in vv.items())) for st, vv in sc) + '],')
print(']')
