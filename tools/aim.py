"""AIM - point every camera at what its shot is actually OF.

tools/sigmap.py and the one-use law care that two cameras differ. They cannot care WHERE a
camera looks, so a scene table that has been nudged for uniqueness can end up with the
creature at the edge of frame, or out of it, while the gate still says PASS. That is the
"empty frame" fault in docs/bug-catalogue.md, and it is only ever caught by eye.

This computes, for every shot that has actors, the yaw and pitch that put those actors in the
middle of the frame, snaps them to the 15-degree grid the signature uses, and takes the
nearest slot that is still free. A shot with no actors is left alone - its subject is the room.

Usage (work folder, after tools/build_shots.py):
    python3 tools/aim.py long
    python3 tools/build_shots.py long      # rebuild with the new anchors
"""
from __future__ import annotations
import json
import math
import os
import re
import sys

sys.path[:0] = ['tools']
import shotsig  # noqa: E402

name = sys.argv[1] if len(sys.argv) > 1 else 'long'
data = json.load(open('src/shots_%s.json' % name))
S = data['shots']

# A lying protagonist can only look so far up or down before the frame is ceiling or quilt.
PITCH_BAND = [-15, 0, 15]
TORSO_Y = {'entity': 1.55, 'father': 0.95, 'mother': 1.05}      # eye-line of each, seated or bent


def ideal(sh):
    acts = [a for a in sh.get('actors', []) if a.get('at')]
    if not acts:
        return None
    ax = sum(a['at'][0] for a in acts) / len(acts)
    az = sum(a['at'][2] for a in acts) / len(acts)
    ay = sum(TORSO_Y.get(a['id'], 1.0) for a in acts) / len(acts)
    ex, ey, ez = sh['anchor']['pos']
    dx, dz = ax - ex, az - ez
    # camera forward at yaw y is (-sin y, -cos y), so the yaw that looks at (dx, dz) is:
    yaw = math.degrees(math.atan2(-dx, -dz)) % 360
    dist = math.hypot(dx, dz)
    pitch = math.degrees(math.atan2(ay - ey, dist)) if dist > 0.01 else 0
    return yaw, pitch


taken = {}
for sh in S:
    taken.setdefault(shotsig.buckets(sh)['cam'], sh['id'])


def cam_with(sh, yaw, pitch):
    t = json.loads(json.dumps(sh))
    t['anchor'] = dict(t['anchor'], yaw=yaw, pitch=pitch)
    return shotsig.buckets(t)['cam']


fix = {}
for sh in S:
    tgt = ideal(sh)
    if not tgt:
        continue
    want_yaw, want_pitch = tgt
    cur = shotsig.buckets(sh)['cam']
    off = abs(((sh['anchor']['yaw'] - want_yaw + 180) % 360) - 180)
    if off <= 10:
        continue                                   # already looking at them
    best = None
    for dy in (0, 15, -15, 30, -30, 45, -45):
        for p in sorted(PITCH_BAND, key=lambda q: abs(q - want_pitch)):
            yaw = round((want_yaw + dy) / 15) * 15
            c = cam_with(sh, yaw, p)
            if c == cur or c not in taken:
                best = (yaw, p, c)
                break
        if best:
            break
    if not best:
        continue
    yaw, pitch, c = best
    taken.pop(cur, None)
    taken[c] = sh['id']
    fix[sh['id']] = (yaw, pitch, off)

src = open('story/scenes_%s.py' % name, encoding='utf-8').read()
for sid, (yaw, pitch, off) in fix.items():
    blk = re.search(r"S\('" + sid + r"'.*?\n(?=    S\(|\]\n|CHAPTERS|\Z)", src, re.S)
    if not blk:
        continue
    t = blk.group(0)
    m = re.search(r"anchor=E\((\[[^\]]*\]|\w+), (-?\d+), (-?\d+)\)", t)
    if not m:
        continue
    src = src.replace(t, t.replace(m.group(0), "anchor=E(%s, %d, %d)" % (m.group(1), yaw, pitch)))
    print('  %-7s was %3d deg off its actors -> yaw %d pitch %d' % (sid, off, yaw, pitch))
open('story/scenes_%s.py' % name, 'w', encoding='utf-8').write(src)
print('%s: %d of %d shots re-aimed at their actors' % (name, len(fix), len(S)))
print('now run: python3 tools/build_shots.py %s' % name)
