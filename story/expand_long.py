"""Turn story/plan_long.txt into story/scenes_long.py (one list per spoken sentence - the sync law).
Run:  python3 story/expand_long.py > story/scenes_long.py"""
import json, math, re
U = json.load(open('audio/long/timing.json'))['units']
PLAN = [l.split() for l in open('story/plan_long.txt') if l.strip()]
assert len(PLAN) == len(U), (len(PLAN), len(U))
SET = dict(bd='bedroom', ov='over', so='sockets', wi='window7', ya='yard', ho='house', po='porch', ha='hall',
           ki='kitchen', mi='mirror', wa='ward', co='corridor', wo='woods', ca='car', se='seat', cm='camera',
           fl='flash', cr='creature', fa='far', en='end')
FRC = dict(w='wide', t='waist', b='bust', c='close', d='detail')
FRS = ['wide', 'waist', 'bust', 'detail', 'close']
MOVES = ['push', 'orbit', 'arc', 'truck', 'pan', 'pull', 'crane', 'tilt', 'drop', 'vertigo']
R = lambda i, *rs: any(a <= i <= b for a, b in rs)
# a set with a fixed camera cannot show the same sentence twice: show the other side of the same moment instead
FIXED = {'sockets': [('over', {'fr': 'waist'}), ('creature', {'fr': 'waist'})],
         'camera': [('bedroom', {'fr': 'detail'}), ('bedroom', {'fr': 'bust'})],
         'flash': [('over', {'fr': 'waist'}), ('creature', {'fr': 'wide'})],
         'far': [('hall', {'fr': 'waist'}), ('hall', {'fr': 'wide'})]}

def keys(st, i, fr, k=0):
    v = {}
    if fr: v['fr'] = fr
    if st == 'bedroom':
        v['lamp'] = 0.5 if R(i, (14, 20), (128, 131)) else 0
        v['open'] = 0.9 if R(i, (37, 47), (74, 74), (82, 97)) else 0
        if R(i, (39, 47), (88, 90)): v['sit'] = True; v['expr'] = 'fear'
        if R(i, (21, 24), (34, 36)): v['expr'] = 'sleepy'
    if st == 'over':
        v['sit'] = R(i, (88, 90))
        if R(i, (88, 90)): v['expr'] = 'fear'; v['tremble'] = 0.5
    if st == 'window7':
        v['open'] = 0.9 if R(i, (37, 47), (74, 74)) else 0.15
        v['lamp'] = 0.4 if i >= 128 else 0
    if st == 'yard': v['porch'] = 0.9
    if st == 'house':
        v['mitch'] = R(i, (101, 104))
        if R(i, (101, 104)): v['run'] = True; v['pose'] = 'run'; v['expr'] = 'fear'
        v['door'] = 0.7 if R(i, (97, 104)) else 0
    if st == 'porch':
        v['door'] = 0.7 if R(i, (97, 104), (126, 127)) else 0.4
        v['mitch'] = not R(i, (126, 127))
        if R(i, (11, 12)): v['expr'] = 'sad'
    if st == 'hall':
        v['mitch'] = R(i, (14, 15), (97, 100))
        v['lamp'] = 1.0
        if R(i, (97, 100)): v['pose'] = 'run'; v['expr'] = 'fear'
    if st == 'kitchen':
        v['cup'] = 1 if i >= 48 else 0
        v['mirror'] = i >= 48
        v['mitch'] = R(i, (48, 56))
        if i >= 48: v['eexpr'] = 'shock'; v['expr'] = 'calm'
    if st == 'ward':
        v['doc'] = R(i, (58, 73), (111, 119))
        v['chart'] = R(i, (58, 73))
    if st == 'corridor': v['people'] = 1 if R(i, (72, 72), (76, 76)) else 0
    if st == 'woods':
        v['amber'] = 0.5 if i <= 107 else 0.15
        v['pose'] = 'fall' if i == 110 else 'run'
    if st == 'seat': v['open'] = i >= 137
    if st == 'far': v['shake'] = 0.3
    if st == 'creature': v['pose'] = 'stand'
    v['cm'] = MOVES[(i * 3 + k * 7) % len(MOVES)]
    v['dir'] = 1 if (i + k) % 2 == 0 else -1
    return v

print('# Scene table for the LONG video - "Eyeless Jack" (engine v0.5, 3D, sets in src/SetsL.tsx).')
print('# ONE LIST PER SPOKEN SENTENCE (the sync law). Written as story/plan_long.txt, expanded by story/expand_long.py.')
print('def S(st, **v): return (st, v)')
print('SC = [')
for i, u in enumerate(U):
    row = PLAN[i]; codes = row[1:]
    assert int(row[0]) == i, row
    t0 = u['start'] if i == 0 else max(u['start'] - 0.12, U[i - 1]['end'])
    t1 = U[i + 1]['start'] - 0.12 if i + 1 < len(U) else u['end']
    dur = max(0.4, t1 - t0)
    gap = 2.2 if u['beat'] <= 7 else 2.7
    want = math.ceil(dur / gap) if u['beat'] <= 7 else round(dur / gap)
    n = 1 if codes == ['en'] else max(1, min(int(want), max(1, int(dur / 1.15))))
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
