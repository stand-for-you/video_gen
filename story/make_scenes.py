"""Build story/scenes_long.py for "The Seer of Possibilities" (engine v0.5).

ONE LIST PER SPOKEN SENTENCE (the sync law). This script reads audio/long/timing.json and picks the sets that show what each
sentence says: first an exact override for that sentence number, then a keyword rule, then the chapter's default rotation.
Run:  python3 story/make_scenes.py > story/scenes_long.py
Read the result with tools/sync_check.py and fix any line that does not match the words.
"""
import json, re, sys, math

U = json.load(open('audio/long/timing.json'))['units']
GAP = 2.2   # teaser
GAP2 = 2.8  # body

def S(st, **v):
    return (st, v)

# ---- the red lines that are on the screen while a Seer line is spoken (shortened for the screen)
def screen_lines(txt):
    t = re.sub(r'^\[\w+\]', '', txt).strip().strip('"')
    t = re.sub(r'\s+', ' ', t)
    words, lines, cur = t.split(' '), [], ''
    for w in words:
        if len(cur) + len(w) + 1 > 34:
            lines.append(cur); cur = w
            if len(lines) == 3: break
        else:
            cur = (cur + ' ' + w).strip()
    if cur and len(lines) < 3: lines.append(cur)
    return lines

# ---- chapter rotations: the pictures a chapter may use when no rule fires
ROT = {
 'Intro':            [S('house', fr='wide'), S('frontdoor', fr='wide'), S('upstairs', fr='waist', lamp=0.3), S('doorway'), S('seer', fr='wide')],
 'The First Favour': [S('flat', fr='wide'), S('flat', fr='waist'), S('flat', fr='bust'), S('flat', fr='detail')],
 'The Plant':        [S('lobby', fr='wide', people=0), S('office', fr='wide'), S('allie'), S('lobby', fr='waist')],
 'Allie':            [S('office', fr='wide'), S('allie'), S('window7'), S('flat', fr='waist')],
 'The Seer':         [S('office', fr='wide', crowd=True), S('flat', fr='waist'), S('seer', fr='wide'), S('flat', fr='bust')],
 'Twenty Seven':     [S('shop', fr='wide', man=True), S('flat', fr='waist'), S('seer', fr='wide'), S('shop', fr='waist', man=True)],
 'Twelve Good Years':[S('carpark', fr='wide', jack=True), S('living', fr='wide', donna=True, jack=True), S('seer', fr='wide'), S('house', fr='wide')],
 'The Pizza':        [S('upstairs', fr='waist'), S('living', fr='wide', donna=True, jack=True, pizza=True), S('frontdoor'), S('house', fr='wide')],
 'The Masterpiece':  [S('upstairs', fr='waist'), S('gallery'), S('seer', fr='wide'), S('upstairs', fr='bust')],
 'Thank You':        [S('upstairs', fr='bust'), S('doorway'), S('seer', fr='bust'), S('after')],
}
# ---- exact pictures for the sentences that must be right (sentence number -> list of scenes)
EX = {}
def ex(i, *scenes): EX[i] = list(scenes)

# keyword rules, in order: (regex, builder(txt, chapter) -> list of scenes)
def rules(i, txt, ch, who):
    low = txt.lower()
    seer_line = who == 'seer'
    # the Seer's own words: the red screen, sometimes with her in the void
    if seer_line:
        L = screen_lines(txt)
        if ch in ('Thank You',) and i > 300:
            return [S('seer', fr='bust', txt=L), S('upstairs', fr='bust', expr='sad', txt=L, tremble=0.5)]
        if ch in ('The Masterpiece',):
            return [S('screen', txt=L, crt=False), S('upstairs', fr='waist', txt=L)]
        if ch in ('The Pizza', 'Twelve Good Years'):
            return [S('upstairs', fr='waist', txt=L), S('screen', txt=L, crt=False)]
        return [S('screen', txt=L), S('flat', fr='waist', txt=L)]
    if who == 'jack':
        if ch in ('The Pizza', 'The Masterpiece', 'Thank You'):
            return [S('upstairs', fr='bust', expr='fear')]
        if ch == 'Twenty Seven':
            return [S('shop', fr='bust', man=True, jexpr='smile')]
        return [S('flat', fr='bust', expr='fear')]
    if who == 'allie':
        return [S('allie', fr='waist', aexpr='smile')]
    if who == 'james':
        return [S('liftout', fr='waist')] if 'foot' in low or 'plant' in low else [S('allie', fr='waist', james=True, aexpr='calm')]
    if who == 'diego':
        return [S('office', fr='waist', crowd=True, pose='idle', rot=2.2)]
    if who == 'man':
        return [S('shop', fr='waist', man=True, rich='won' in low or 'charm' in low, kind='food' if ('won' in low or 'charm' in low) else 'booze')]
    if who == 'donna':
        return [S('living', fr='waist', donna=True, jack=True, pizza=True)]
    # narration keywords
    if re.search(r'\bplant\b', low):
        return [S('lobby', fr='detail', out=1, pose='crouch'), S('lobby', fr='waist', out=1)]
    if re.search(r'lobby|ground floor|lift|marble', low):
        return [S('lobby', fr='wide', people=4 if 'people' in low or 'filling' in low else 0)]
    if re.search(r'cubicle|seventh floor|office floor|counsellor|company', low):
        return [S('office', fr='wide', crowd='counsellor' in low or 'cried' in low)]
    if re.search(r'\ballie\b|her desk|two cubicles', low):
        return [S('allie', fr='wide'), S('allie', fr='waist')]
    if re.search(r'lorry|truck horn|brakes|crash|junction|glass across|crowd|ambulance|sirens', low):
        return [S('crash', fr='wide'), S('crash', fr='waist', jack=True)]
    if re.search(r'window|seven floors down', low):
        return [S('window7', fr='wide'), S('window7', fr='waist')]
    if re.search(r'router|cable|internet', low):
        return [S('flat', fr='detail'), S('flat', fr='bust', expr='fear')]
    if re.search(r'red letters|screen went black|the screen|monitor|keys|typed', low):
        return [S('flat', fr='waist'), S('screen', txt=['...'])]
    if re.search(r'lottery|ticket|slip|off licence|counter', low):
        return [S('shop', fr='wide', man=True), S('shop', fr='waist', man=True)]
    if re.search(r'supermarket|cheque|gold watch|new coat', low):
        return [S('shop', fr='wide', man=True, rich=True, kind='food'), S('shop', fr='waist', man=True, rich=True, kind='food')]
    if re.search(r'space forty three|car park|county', low):
        return [S('carpark', fr='wide', jack=True), S('carpark', fr='waist', jack=True, lights=True)]
    if re.search(r'donna|married|wife|asleep on the sofa', low):
        return [S('living', fr='wide', donna=True, jack=True), S('living', fr='waist', donna=True, jack=True)]
    if re.search(r'big house|long road|country', low):
        return [S('house', fr='wide'), S('house', fr='waist')]
    if re.search(r'doorbell|delivery boy|door frame|tip|pizza box|doorway with a warm box|front door', low):
        return [S('frontdoor', fr='wide'), S('frontdoor', fr='waist')]
    if re.search(r'pizza', low):
        return [S('living', fr='wide', donna=True, jack=True, pizza=True), S('frontdoor', fr='waist')]
    if re.search(r'living room|sofa|television', low):
        return [S('living', fr='wide', donna=True, jack=True, pizza=True)]
    if re.search(r'paint|artist|king|executed|fortune teller|thousands of years', low):
        return [S('seer', fr='wide'), S('gallery')]
    if re.search(r'brush stroke|picture|masterpiece|chain|possibilities', low):
        return [S('gallery'), S('seer', fr='wide')]
    if re.search(r'knife|shape|doorway|step closer|breathing hard', low):
        return [S('doorway'), S('doorway', cm='push')]
    if re.search(r'downstairs|short sound|her head on his shoulder|she was gone', low):
        return [S('after'), S('living', fr='wide', stain=True, lamp=0.3, tv=0.8)]
    return None

# ---- the fixed moments (first frame, the end screen, the chain faces)
ex(0, S('house', fr='wide'), S('house', fr='waist'))
ex(1, S('frontdoor', fr='wide'), S('upstairs', fr='waist', lamp=0.3, expr='fear', tremble=0.5))
ex(3, S('upstairs', fr='bust', expr='sad', tremble=0.6), S('doorway'))
ex(4, S('upstairs', fr='bust', expr='sad'), S('screen', txt=['Thank you.']))
ex(5, S('seer', fr='wide'), S('seer', fr='bust'))
CH = [S('gallery', face=0), S('gallery', face=1), S('gallery', face=2), S('gallery', face=3), S('gallery', face=4)]

out = []
rot_count = {}
for i, u in enumerate(U):
    txt = u['text']; ch = u.get('chapter_name') or ''
    who = (re.match(r'^\[(\w+)\]', txt).group(1) if re.match(r'^\[(\w+)\]', txt) else 'nar')
    d = u['end'] - u['start']
    gap = GAP if u['beat'] <= 5 else GAP2
    n = max(1, min(round(d / gap), int(d / 1.2) or 1))
    sc = EX.get(i) or rules(i, txt, ch, who)
    if not sc:
        r = ROT.get(ch) or ROT['The First Favour']
        k = rot_count.get(ch, 0); rot_count[ch] = k + 1
        sc = [r[k % len(r)]]
        if n > 1: sc = sc + [r[(k + 1) % len(r)]]
    FRS = ['wide', 'waist', 'bust', 'detail', 'close']
    base = list(sc)
    j = 0
    while len(sc) < n:
        st, vv = base[j % len(base)]
        vv = dict(vv)
        vv['fr'] = FRS[(j + 1) % len(FRS)] if 'fr' in vv else vv.get('fr', 'waist')
        vv['alt'] = (j % 3) + 1
        sc.append((st, vv)); j += 1
    out.append((i, u, sc[:max(n, 1)], who))

print('# Scene table for the LONG video — "The Seer of Possibilities" (engine v0.5, 3D, sets in src/SetsL.tsx).')
print('# ONE LIST PER SPOKEN SENTENCE. Built by story/make_scenes.py, then checked with tools/sync_check.py.')
print('def S(st, **v): return (st, v)')
print('SC = [')
for i, u, sc, who in out:
    t = re.sub(r'\s+', ' ', u['text']).replace('"', "'")[:96]
    print(' # %3d  %4.1fs  [%s]  %s' % (i, u['end'] - u['start'], who, t))
    print(' [' + ', '.join("S('%s'%s)" % (st, ''.join(', %s=%r' % (k, v) for k, v in vv.items())) for st, vv in sc) + '],')
print(']')
