"""Turn story/plan_reel.txt into story/scenes_reel.py (9:16 sets in src/SetsR.tsx, composed again for a tall frame).
ONE LIST PER SPOKEN SENTENCE. Run:  python3 story/expand_reel.py > story/scenes_reel.py
"""
import json, math, re
U = json.load(open('audio/reel/timing.json'))['units']
PLAN = [l.split() for l in open('story/plan_reel.txt') if l.strip()]
assert len(PLAN) == len(U), (len(PLAN), len(U))
SET = dict(rfl='rflat', rsc='rscreen', rlo='rlobby', rof='roffice', rcr='rcrash', rsh='rshop', rho='rhouse',
           rdw='rdoor', rlv='rliving', rup='rupstairs', rse='rseer', rga='rgallery', raf='rafter')
FRC = dict(w='wide', t='waist', b='bust', c='close', d='detail')
FRS = ['wide', 'waist', 'bust', 'detail', 'close']
MOVES = ['push', 'orbit', 'arc', 'truck', 'pan', 'pull', 'crane', 'tilt', 'drop', 'vertigo']
# the red words on the screen at each moment of the Reel (the Reel has one speaker, so these are shown, not spoken)
TXT = {0: ['He is coming up for you now,', 'Jack. You cannot stop him.'], 1: ['Your wife is already dead.'],
       2: ['He is coming up for you now,', 'Jack. You cannot stop him.'], 4: ['Thank you.'],
       7: ['Hello Jack.', 'I need a favour from you.'], 8: ['Move the plant by the lift.', 'Three inches to the left.'],
       9: ['Three inches to the left.'], 10: ['Nothing wrong.', 'Nothing against the law.', 'Nobody hurt.'],
       19: ['One favour, then the next.'], 22: ['I am not giving you luck.'],
       28: ['The boy was a favour too.'], 29: ['The boy was a favour too.'],
       31: ['You are one brush stroke', 'in my picture.'], 33: ['Have you nothing to say to me,', 'Jack?'],
       34: ['Have you nothing to say to me,', 'Jack?'], 35: ['Thank you.']}
R = lambda i, *rs: any(a <= i <= b for a, b in rs)

def keys(st, i, fr, k=0):
    v = {}
    if fr: v['fr'] = fr
    t = TXT.get(i) or TXT.get(max([j for j in TXT if j <= i], default=0)) or ['...']
    if st in ('rscreen', 'rupstairs', 'rflat'): v['txt'] = t
    if st == 'rscreen' and i >= 28: v['crt'] = False
    if st == 'rupstairs':
        v['lamp'] = 0.45
        if R(i, (0, 4), (32, 35)): v['expr'] = 'fear'
        if R(i, (3, 4), (34, 35)): v['tremble'] = 0.5
    if st == 'rflat':
        if R(i, (6, 7)): v['expr'] = 'fear'
    if st == 'rlobby':
        v['out'] = 1 if i >= 11 else 0
        if R(i, (12, 12)): v['people'] = 3
        if R(i, (8, 10)): v['pose'] = 'crouch'
    if st == 'roffice':
        if i >= 13: v['aexpr'] = 'smile'
    if st == 'rshop': v['man'] = True; v['kind'] = 'booze'
    if st == 'rliving':
        v['donna'] = True; v['jack'] = True; v['lamp'] = 0.6
        if R(i, (26, 27)): v['pizza'] = True
    if st == 'rdoor':
        if R(i, (27, 30)): v['boy'] = True
    if st == 'rgallery': v['face'] = (i + k) % 5
    if st == 'rcrash': v['jack'] = False
    v['cm'] = MOVES[(i * 3 + k * 7) % len(MOVES)]
    v['dir'] = 1 if (i + k) % 2 == 0 else -1
    return v

print('# Scene table for the REEL - "The Seer of Possibilities" (engine v0.5, 3D, 9:16 sets in src/SetsR.tsx).')
print('# ONE LIST PER SPOKEN SENTENCE. Written as story/plan_reel.txt, expanded by story/expand_reel.py.')
print('def S(st, **v): return (st, v)')
print('SC = [')
for i, u in enumerate(U):
    row = PLAN[i]; codes = row[1:]
    assert int(row[0]) == i, row
    t0 = u['start'] if i == 0 else max(u['start'] - 0.12, U[i - 1]['end'])
    t1 = U[i + 1]['start'] - 0.12 if i + 1 < len(U) else u['end']
    d = max(0.4, t1 - t0)
    gap = 2.2 if u['beat'] <= 2 else 2.7
    want = math.ceil(d / gap) if u['beat'] <= 2 else round(d / gap)
    n = max(1, min(int(want), max(1, int(d / 1.15))))
    sc = [(SET[c.partition('/')[0]], keys(SET[c.partition('/')[0]], i, FRC.get(c.partition('/')[2], ''), k))
          for k, c in enumerate(codes)]
    base = list(sc); j = 0
    while len(sc) < n:
        st, vv = base[j % len(base)]; vv = dict(vv)
        if 'fr' in vv: vv['fr'] = FRS[(FRS.index(vv['fr']) + 1 + j) % len(FRS)]
        vv['cm'] = MOVES[(i * 3 + (j + 5) * 7) % len(MOVES)]; vv['dir'] = -vv.get('dir', 1)
        if st == 'rgallery': vv['face'] = (i + j * 2) % 5
        vv['alt'] = (j % 3) + 1
        sc.append((st, vv)); j += 1
    seen = set()
    for q in range(len(sc)):
        st, vv = sc[q]; vv = dict(vv); g = 0
        kk = lambda d2: repr(sorted((a, str(b)) for a, b in d2.items() if a != 'alt'))
        while (st, kk(vv)) in seen and g < 24:
            vv['cm'] = MOVES[(MOVES.index(vv.get('cm', 'push')) + 1) % len(MOVES)]
            if g % len(MOVES) == len(MOVES) - 1 and 'fr' in vv: vv['fr'] = FRS[(FRS.index(vv['fr']) + 1) % len(FRS)]
            g += 1
        seen.add((st, kk(vv))); sc[q] = (st, vv)
    print(' # %2d %5.1fs %s' % (i, d, re.sub(r'\s+', ' ', u['text'])[:76].replace('"', "'")))
    print(' [' + ', '.join("S('%s'%s)" % (st, ''.join(', %s=%r' % (a, b) for a, b in vv.items())) for st, vv in sc) + '],')
print(']')
