"""BUILD THE PREVIEW LISTS from the real scene tables.

Stage 6 of the workflow is "LOOK at it", and the only preview worth looking at is one drawn
from the same data the render will use. This picks representative scenes out of
story/scenes_long.py and writes them in the format tools/preview/shot_preview.mjs wants:

    qa/env_shots.json   every room in every state it reaches, with the ACTORS STRIPPED
                        (environment first: a set is checked before anybody stands in it)
    qa/cast_shots.json  the scenes where somebody is in the room, exactly as they will render

Usage (work folder, after tools/build_shots.py):
    python3 tools/qa_shots.py
    node tools/preview/shot_preview.mjs qa/env_shots.json  qa/preview
    node tools/preview/shot_preview.mjs qa/cast_shots.json qa/preview
"""
from __future__ import annotations
import importlib
import json
import os
import sys

sys.path[:0] = ['story', '.']

ENV = [
    # name                   scene id   what this preview is for
    ('01_bedroom_night',      'b05_1',  'the room before anything happens: bed, clock, chair, window'),
    ('02_bedroom_door_open',  'b30_1',  'the door standing open and the warm slot it throws'),
    ('03_bedroom_wall_clean', 'b12_3',  'the right-hand wall before the masterpiece'),
    ('04_bedroom_circle',     'b44_1',  'the circle, wet, with drips'),
    ('05_bedroom_pentagram',  'b44_3',  'the inverted star inside the circle'),
    ('06_bedroom_message',    'b63_1',  'THE PAYOFF: the message must be readable at this size'),
    ('07_bedroom_dawn',       'b52_2',  'the window gone from black to grey, and the floor spill'),
    ('08_underbed_gap',       'b55_2',  'the gap under the bed, at eye level'),
    ('09_hall_clean',         'b08_1',  'the hall: carpet, doors, picture, side table, wall light'),
    ('10_hall_smear',         'b22_1',  'the drag on the carpet, from the far door to the stairs'),
    ('11_hall_pool',          'b23_3',  'the thick end of it by the parents door'),
    ('12_bath_lit',           'b19_2',  'the one lit room: basin, mirror, tiles, towel'),
    ('13_bath_dark_crack',    'b21_1',  'the light off and the door open a crack'),
    ('14_stairtop',           'b25_1',  'the twelve steps he did not take'),
]
CAST = [
    ('c1_mother_on_chair',   'b41_2',  'SHE MUST BE ON THE SEAT, not floating or sunk into it'),
    ('c2_father_propped',    'b40_3',  'he must be against the foot of the bed, facing the pillow'),
    ('c3_both_arranged',     'b00_1',  'the opening frame: both of them turned to the lens'),
    ('c4_creature_doorway',  'b31_2',  'full body, bent under a 2.6 m ceiling, in the doorway'),
    ('c5_creature_lens',     'b34_1',  'the blank face at the lens - no eyes, no mouth, nothing'),
    ('c6_creature_side',     'b34_3',  'the SECOND angle: the same creature from the side'),
    ('c7_creature_drag',     'b37_1',  'dragging both parents by the arms, one in each hand'),
    ('c8_creature_wall',     'b43_1',  'both hands flat on the wall, palms red'),
    ('c9_creature_underbed', 'b66_1',  'folded up in the under-bed gap'),
    ('c10_hands_quilt',      'b50_1',  'the POV hands on the quilt - the format lives on these'),
]


def entry(sh, name, w, h, strip_actors):
    a = sh['anchor']
    e = {
        'name': name, 'kit': sh['kit'], 'opts': sh['kitOpts'],
        'anchor': {'pos': a['pos'], 'yaw': a['yaw'], 'pitch': a.get('pitch', 0)},
        'preset': sh['preset'], 't': round((sh['e'] - sh['s']) / 30 * 0.45, 2),
        'dur': round((sh['e'] - sh['s']) / 30, 2), 'seed': (sh['s'] % 97) + 1,
        'w': w, 'h': h, 'inkRefH': 1080,
    }
    if not strip_actors:
        e['actors'] = sh['actors']
        if sh.get('hands'):
            e['hands'] = {'pose': sh['hands'], 'phase': 1}
    return e


def main() -> int:
    data = json.load(open('src/shots_long.json'))
    by_id = {s['id']: s for s in data['shots']}
    missing = [sid for _, sid, _ in ENV + CAST if sid not in by_id]
    if missing:
        sys.exit('these scene ids are in tools/qa_shots.py but not in the scene table: %s'
                 % ', '.join(missing))
    os.makedirs('qa', exist_ok=True)
    env = [entry(by_id[sid], name, 960, 540, True) for name, sid, _ in ENV]
    cast = [entry(by_id[sid], name, 960, 540, False) for name, sid, _ in CAST]
    json.dump(env, open('qa/env_shots.json', 'w'), indent=1)
    json.dump(cast, open('qa/cast_shots.json', 'w'), indent=1)
    print('qa/env_shots.json  %d sets   (actors stripped - look at the ROOM)' % len(env))
    for name, sid, why in ENV:
        print('   %-22s %-7s %s' % (name, sid, why))
    print('qa/cast_shots.json %d shots  (as they will render)' % len(cast))
    for name, sid, why in CAST:
        print('   %-22s %-7s %s' % (name, sid, why))
    return 0


if __name__ == '__main__':
    sys.exit(main())
