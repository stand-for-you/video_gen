"""WHICH BUCKET TO CHANGE - the fix list for a one-use failure.

tools/build_shots.py tells you two shots are the same picture. This tells you WHY in a form
you can act on: it groups the shot list by each of the four buckets and prints the groups
that collide, so you can see at a glance that (say) eleven shots share one camera bucket and
that is what needs spreading out.

A pair fails when 3 or 4 of the four buckets match. So the cheapest way to a clean build is:
  1. make the CAMERA bucket unique for every shot (yaw and pitch are quantised to 15 degrees,
     position to 0.75 m, and the preset counts) - then no pair can ever match all four, and
  2. make the (cast, light, props) TRIPLE unique for every shot - then no pair can match the
     other three either.
This script lists every violation of 1 and 2.

Usage (work folder):  python3 tools/sigmap.py long
"""
from __future__ import annotations
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import shotsig  # noqa: E402

name = sys.argv[1] if len(sys.argv) > 1 else 'long'
data = json.load(open('src/shots_%s.json' % name))
shots = data['shots']
fps = data.get('fps', 30)

cam, trip = {}, {}
for sh in shots:
    b = shotsig.buckets(sh)
    cam.setdefault(b['cam'], []).append(sh['id'])
    trip.setdefault((b['cast'], b['light'], b['props']), []).append(sh['id'])

bad_cam = {k: v for k, v in cam.items() if len(v) > 1}
bad_trip = {k: v for k, v in trip.items() if len(v) > 1}

print('%s: %d shots, %d distinct cameras, %d distinct cast/light/props triples'
      % (name, len(shots), len(cam), len(trip)))
if bad_cam:
    print('\nSHARED CAMERA (same kit, position to 0.75 m, yaw+pitch to 15 deg, preset):')
    for k, v in sorted(bad_cam.items(), key=lambda kv: -len(kv[1])):
        print('  %2d shots  %s' % (len(v), k))
        print('            ' + ', '.join(v))
if bad_trip:
    print('\nSHARED CAST+LIGHT+PROPS (change who is in it, the light, or a prop state):')
    for (ca, li, pr), v in sorted(bad_trip.items(), key=lambda kv: -len(kv[1])):
        print('  %2d shots  cast=%s' % (len(v), ca or '-'))
        print('            light=%s  props=%s' % (li, pr))
        print('            ' + ', '.join(v))
if not bad_cam and not bad_trip:
    print('\nevery camera is unique AND every cast/light/props triple is unique: '
          'no pair can reach three matching buckets.')
print('\nfree 15-degree yaw slots per camera position are the cheapest fix for a shared camera.')
sys.exit(1 if (bad_cam or bad_trip) else 0)
