"""Turn story/plan_long.txt (one line per spoken sentence) into story/scenes_long.py.

The plan holds the SET for every sentence; this script adds the keys that set needs (who is in the room, what the
screen says, how bright the lamp is) and pads a long sentence with extra shots so no picture is held too long.
Run:  python3 story/expand_long.py > story/scenes_long.py
"""
import json, re

U = json.load(open('audio/long/timing.json'))['units']
PLAN = [l.split() for l in open('story/plan_long.txt') if l.strip()]
assert len(PLAN) == len(U), (len(PLAN), len(U))

SET = dict(fl='flat', sc='screen', to='tower', lo='lobby', of='office', al='allie', li='liftout', w7='window7',
           cr='crash', sh='shop', cp='carpark', ho='house', fd='frontdoor', lv='living', up='upstairs',
           dw='doorway', se='seer', st='seerTags', ga='gallery', af='after', en='end')
FRC = dict(w='wide', t='waist', b='bust', c='close', d='detail')
RNG = lambda i, *rs: any(a <= i <= b for a, b in rs)

def clean(t):
    return re.sub(r'^\[\w+\]', '', t).strip().strip('"')

def lines(t, w=34, n=3):
    out, cur = [], ''
    for word in clean(t).split():
        if len(cur) + len(word) + 1 > w:
            out.append(cur); cur = word
            if len(out) == n: return out
        else:
            cur = (cur + ' ' + word).strip()
    if cur and len(out) < n: out.append(cur)
    return out or ['...']

# the red words that are on a screen during sentence i (its own line, or the last spoken line just before it)
OWN = {10: ['Thank you.'], 11: ['Thank you.'], 387: ['Thank you.'], 388: ['Thank you.'],
       224: ['What do you want me to do next?'], 253: ['We have never helped anybody', 'before. Why now?'],
       324: ['So my reward is a pizza?'], 333: ['Are you there?'], 372: ['But why?']}
def red(i):
    if i in OWN: return OWN[i]
    for j in range(i, max(-1, i - 6), -1):
        if U[j]['who'] in ('seer', 'jack'):
            return lines(U[j]['text'])
    for j in range(i + 1, min(len(U), i + 5)):
        if U[j]['who'] == 'seer':
            return lines(U[j]['text'])
    return ['...']

MOVES = ['push', 'orbit', 'arc', 'truck', 'pan', 'pull', 'crane', 'tilt', 'drop', 'vertigo']
def keys(st, i, fr, k=0):
    u = U[i]; who = u['who']; txt = clean(u['text']).lower(); v = {}
    if fr: v['fr'] = fr
    if st == 'screen':
        v['txt'] = red(i)
        if i >= 293: v['crt'] = False
        if 'the screen died' in txt or 'sparked once' in txt: v['off'] = True
        if who == 'jack': v['typed'] = 0.9
    if st == 'flat':
        if who == 'seer' or 'red letters' in txt or 'the words kept coming' in txt: v['txt'] = red(i)
        if 'the screen died' in txt or 'went dark' in txt or 'without turning it on' in txt: v['off'] = True
        if RNG(i, (35, 42), (172, 177), (186, 188)): v['expr'] = 'fear'
        elif RNG(i, (118, 124), (181, 183), (251, 252)): v['expr'] = 'sad'
        if RNG(i, (36, 39)): v['pose'] = 'reach'
        if RNG(i, (186, 188)): v['tremble'] = 0.5
    if st == 'lobby':
        v['out'] = 1 if RNG(i, (80, 132)) else 0
        if RNG(i, (68, 69), (84, 87), (91, 91), (159, 160)): v['people'] = 4
        if i in (60, 61, 62, 120, 390): v['jack'] = False
        if i in (78, 79, 80): v['pose'] = 'crouch'
    if st == 'office':
        if RNG(i, (111, 111), (151, 151), (190, 201)): v['crowd'] = True
        if RNG(i, (113, 124), (156, 158)): v['expr'] = 'fear'
        if RNG(i, (145, 147), (197, 201)): v['expr'] = 'sad'
    if st == 'allie':
        v['aexpr'] = 'smile' if i <= 144 else 'calm'
        if RNG(i, (136, 141)): v['james'] = True
        if RNG(i, (113, 116)): v['jexpr'] = 'shock'
        if i in (166, 179, 345): v['jack'] = False; v['aexpr'] = 'smile'
    if st == 'shop':
        v['kind'] = 'tech' if i == 202 else ('food' if RNG(i, (245, 250)) else 'booze')
        if RNG(i, (230, 230), (234, 250), (255, 255), (349, 349)): v['man'] = True
        if RNG(i, (245, 250)): v['rich'] = True
        if i == 202: v['man'] = False
        if RNG(i, (240, 243), (247, 250)): v['jexpr'] = 'smile'
        if i in (244, 349): v['jexpr'] = 'sad'
        if RNG(i, (236, 237)): v['mpose'] = 'reach'
    if st == 'carpark':
        v['jack'] = True
        if i == 264: v['lights'] = True
    if st == 'living':
        v['donna'] = True; v['jack'] = True
        if RNG(i, (9, 9), (319, 332), (379, 381)): v['pizza'] = True
        if RNG(i, (329, 332)): v['dpose'] = 'sleep'; v['dexpr'] = 'calm'
        if RNG(i, (330, 331)): v['jexpr'] = 'fear'
        if i in (300, 301): v['pizza'] = False
        if i == 317: v['donna'] = False; v['jack'] = False
        v['lamp'] = 0.6
    if st == 'upstairs':
        if who == 'seer' or RNG(i, (2, 11), (293, 295), (323, 326), (333, 388)): v['txt'] = red(i)
        if who == 'jack': v['typed'] = 0.9
        if RNG(i, (1, 11), (339, 371), (382, 388)): v['expr'] = 'fear'
        if RNG(i, (3, 9), (346, 346), (372, 381)): v['expr'] = 'sad'
        if RNG(i, (3, 11), (363, 388)): v['tremble'] = 0.5
        v['lamp'] = 0.45
    if st == 'doorway':
        v['txt'] = red(i)
        if i in (382, 386): v['shake'] = 0.5
        if i in (5, 342, 377): v['bpose'] = 'idle'
    if st == 'seer':
        if RNG(i, (276, 279), (292, 292), (355, 357)): v['canvases'] = 3
        if RNG(i, (367, 371)): v['glow'] = 1.3
    if st == 'gallery':
        if i == 355: v['face'] = 0
        if i == 356: v['face'] = 2
        if i == 357: v['face'] = 4; v['seer'] = True
        if i in (347, 348): v['face'] = 1
        if i == 350: v['face'] = 3
        if i in (374, 376): v['seer'] = True
    if st == 'crash':
        if RNG(i, (161, 168)): v['jack'] = True
    if st == 'house':
        if RNG(i, (299, 318)): v['door'] = 0.8
    if st == 'gallery' and 'face' not in v: v['face'] = (i + k) % 5
    # a different camera move and direction for every single shot: the camera is never frozen and never repeats
    v['cm'] = MOVES[(i * 3 + k * 7) % len(MOVES)]
    v['dir'] = 1 if (i + k) % 2 == 0 else -1
    if st in ('crash',) and fr == 'wide': v.pop('cm', None)
    return v

FRS = ['wide', 'waist', 'bust', 'detail', 'close']
# a set whose camera is fixed cannot be re-used for a second shot of the same sentence; show the other side of the
# same moment instead (the man reading the screen, the dark room behind him, another painted face on the wall)
FIXED = {'screen': [('upstairs', {'fr': 'bust'}), ('flat', {'fr': 'bust'})],
         'after': [('doorway', {}), ('house', {'fr': 'wide'})],
         'doorway': [('upstairs', {'fr': 'bust'}), ('after', {})],
         'seerTags': [('seer', {'fr': 'wide'}), ('gallery', {})],
         'tower': [('lobby', {'fr': 'wide'}), ('office', {'fr': 'wide'})],
         'gallery': [('gallery', {}), ('gallery', {})]}
print('# Scene table for the LONG video - "The Seer of Possibilities" (engine v0.5, 3D, sets in src/SetsL.tsx).')
print('# ONE LIST PER SPOKEN SENTENCE (the sync law). Written as story/plan_long.txt, expanded by story/expand_long.py.')
print('def S(st, **v): return (st, v)')
print('SC = [')
for i, u in enumerate(U):
    row = PLAN[i]
    assert int(row[0]) == i, row
    codes = row[1:]
    # same arithmetic as tools/build_shots.py, so the table never needs a re-shown picture
    t0 = u['start'] if i == 0 else max(u['start'] - 0.12, U[i - 1]['end'])
    t1 = U[i + 1]['start'] - 0.12 if i + 1 < len(U) else u['end']
    d = max(0.4, t1 - t0)
    gap = 2.2 if u['beat'] <= 5 else 2.7
    import math as _m
    want = _m.ceil(d / gap) if u['beat'] <= 5 else round(d / gap)
    n = 1 if codes == ['en'] else max(1, min(int(want), max(1, int(d / 1.15))))
    sc = []
    for k, c in enumerate(codes):
        st, _, f = c.partition('/')
        sc.append((SET[st], keys(SET[st], i, FRC.get(f, ''), k)))
    j = 0
    base = list(sc)
    while len(sc) < n:
        st, vv = base[j % len(base)]
        vv = dict(vv)
        if st in FIXED:
            opts = FIXED[st]
            if st == 'screen' and i < 293: opts = [opts[1], opts[0]]
            st, extra = opts[j % len(opts)]
            vv = dict(keys(st, i, extra.get('fr', ''), j + 3), **{k2: x for k2, x in extra.items() if k2 != 'fr'})
            if extra.get('fr'): vv['fr'] = extra['fr']
            if st == 'gallery': vv['face'] = (i + j * 2) % 5
        elif 'fr' in vv:
            vv = dict(vv); vv['fr'] = FRS[(FRS.index(vv['fr']) + 1 + j) % len(FRS)]
            vv['cm'] = MOVES[(i * 3 + (j + 5) * 7) % len(MOVES)]; vv['dir'] = -vv.get('dir', 1)
        vv['alt'] = (j % 3) + 1
        sc.append((st, vv)); j += 1
    # no sentence ever shows the same picture twice: give a clashing shot another move and another framing
    seen = set()
    for q in range(len(sc)):
        st, vv = sc[q]; vv = dict(vv); g = 0
        while (st, repr(sorted((k2, str(x)) for k2, x in vv.items() if k2 != 'alt'))) in seen and g < 24:
            vv['cm'] = MOVES[(MOVES.index(vv.get('cm', 'push')) + 1) % len(MOVES)]
            if g % len(MOVES) == len(MOVES) - 1 and 'fr' in vv:
                vv['fr'] = FRS[(FRS.index(vv['fr']) + 1) % len(FRS)]
            g += 1
        seen.add((st, repr(sorted((k2, str(x)) for k2, x in vv.items() if k2 != 'alt'))))
        sc[q] = (st, vv)
    t = re.sub(r'\s+', ' ', u['text'])[:86].replace('"', "'")
    print(' # %3d %5.1fs [%s] %s' % (i, d, u['who'], t))
    print(' [' + ', '.join("S('%s'%s)" % (st, ''.join(', %s=%r' % (k, x) for k, x in vv.items())) for st, vv in sc) + '],')
print(']')
