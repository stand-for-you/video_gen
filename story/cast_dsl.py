"""ONE SOURCE OF TRUTH for who is in a shot.

A scene names a character by KEY and never re-types a look. `A('father', ...)` reads
story/cast.json and expands it into the actor dict the engine wants, so the father cannot
drift between shot 12 and shot 90 - which is the whole point of the one-creature law and of
the cast rule in references/quality-law.md 4b.

    A('father', 'sit', (-1.05, 0, -1.15), yaw=0, state={'expr': 'shocked'})
    A('entity', 'hold_two', (0.6, 0, 0.5), yaw=30, cstate={'blood': True})

`pose` is also written at the top level for creatures, because tools/shotsig.py reads the
top-level pose when it decides whether two shots are the same picture. A creature that
changes what it is DOING is a new picture; that has to be visible to the gate.
"""
from __future__ import annotations
import json
import os

_HERE = os.path.dirname(os.path.abspath(__file__))
with open(os.path.join(_HERE, 'cast.json'), encoding='utf-8') as _f:
    CAST = json.load(_f)

HUMAN_POSES = ('stand', 'walk', 'run', 'reach', 'cower', 'point',
               'held_up', 'lie', 'fall', 'hug', 'sit', 'crawl')
CREATURE_POSES = ('loom', 'stand', 'crouch_spider', 'reach', 'hold_two', 'stride', 'lean_lens')
EXPRS = ('normal', 'scared', 'shocked', 'sad', 'angry', 'confused', 'crying')


def A(key, pose='stand', at=(0.0, 0.0, 0.0), yaw=0, state=None, cstate=None, phase=None):
    """One actor, resolved from story/cast.json."""
    assert key in CAST, 'no character %r in story/cast.json' % key
    c = CAST[key]
    is_creature = 'creature' in c
    assert pose in (CREATURE_POSES if is_creature else HUMAN_POSES), \
        '%s: %r is not a %s pose' % (key, pose, 'creature' if is_creature else 'human')
    d = {'id': key, 'at': [round(float(v), 3) for v in at], 'yaw': yaw, 'pose': pose}
    if is_creature:
        d['kind'] = 'creature'
        spec = dict(c['creature'])
        spec['pose'] = pose
        st = dict(spec.get('state') or {})
        if cstate:
            st.update(cstate)
        if st:
            spec['state'] = st
        d['creature'] = spec
    else:
        d['look'] = dict(c['look'])
        st = dict(c.get('state') or {})
        if state:
            for k, v in state.items():
                assert k != 'expr' or v in EXPRS, '%s: unknown expression %r' % (key, v)
            st.update(state)
        if st:
            d['state'] = st
    if phase is not None:
        d['phase'] = phase
    return d
