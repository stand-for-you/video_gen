"""Scroll Kaos v0.5 - the one-use law, in one place.

THE PROBLEM THIS SOLVES
The user's standing complaint is that an agent is told "never reuse a frame" and then reuses
frames anyway, or redraws the same picture with a new name. Telling an agent a rule does not
enforce it. This module turns the rule into arithmetic, and gate_shots.py refuses to build
when the arithmetic fails. An agent cannot talk its way past a non-zero exit code.

THE RULE (quality-law.md section 6)
Two shots are "the same picture" unless at least TWO of these four differ:
    cam    - kit + eye position (rounded to 0.75 m) + yaw/pitch (rounded to 15 deg) + preset
    cast   - the hand pose, and every actor's id + pose + rounded ground position
    light  - lights on/off, lamp side, lamp count, headlights, colour wash
    props  - door / windshield / roof / ground / beam / room / shape / clock / window STATE

Buckets are deliberately coarse. Nudging the camera 4 cm is not a new picture, and an agent
that "fixes" a duplicate by nudging it is doing the thing the rule exists to stop.

This file is the Python mirror of src/Shot.ts shotBuckets(). If you change one, change both -
tools/selftest.py asserts they agree.
"""
from __future__ import annotations
import hashlib
import json
from typing import Any, Dict, List, Tuple


def _q(v: Any, step: float) -> float:
    try:
        return round(float(v) / step) * step
    except (TypeError, ValueError):
        return 0.0


def buckets(sh: Dict[str, Any]) -> Dict[str, str]:
    a = sh.get("anchor", {}) or {}
    pos = a.get("pos", [0, 0, 0])
    cam = "/".join(str(x) for x in [
        sh.get("kit", "?"),
        _q(pos[0], 0.75), _q(pos[1], 0.75), _q(pos[2], 0.75),
        _q(float(a.get("yaw", 0)) % 360, 15),
        _q(a.get("pitch", 0), 15),
        sh.get("preset", "?"),
    ])

    parts = [str(sh.get("hands") or "-")]
    for act in sh.get("actors", []) or []:
        at = act.get("at", [0, 0, 0])
        parts.append("%s:%s:%s,%s" % (act.get("id", "?"), act.get("pose", "-"),
                                      _q(at[0], 0.75), _q(at[2], 0.75)))
    cast = "|".join([parts[0]] + sorted(parts[1:]))

    o = sh.get("kitOpts", {}) or {}
    light = "/".join(str(o.get(k, "-")) for k in ("lightOn", "lampSide", "alleyLamps", "headlights")) \
        + "/" + str(sh.get("wash") or "-")
    props = "/".join(str(o.get(k, "-")) for k in
                     ("door", "windshield", "roof", "ground", "beam", "room", "shape", "clock", "window"))
    return {"cam": cam, "cast": cast, "light": light, "props": props}


def signature(sh: Dict[str, Any]) -> str:
    b = buckets(sh)
    return "%s~%s~%s~%s" % (b["cam"], b["cast"], b["light"], b["props"])


def sig_hash(sh: Dict[str, Any]) -> str:
    """Short stable hash - this is what goes in the cross-video ledger."""
    return hashlib.sha1(signature(sh).encode()).hexdigest()[:16]


def sameness(a: Dict[str, Any], b: Dict[str, Any]) -> int:
    """How many of the four buckets two shots agree on. 4 = identical picture."""
    ba, bb = buckets(a), buckets(b)
    return sum(1 for k in ("cam", "cast", "light", "props") if ba[k] == bb[k])


def find_repeats(shots: List[Dict[str, Any]], fps: int = 30, limit: int = 2) -> List[Tuple[str, str, int, str]]:
    """Every pair that is too alike. `limit` = how many buckets may match before it is a fault
    (3 of 4 the same means only ONE thing changed, which the rule forbids).

    Returns (id_a, id_b, matching_buckets, human_reason) with timestamps baked into the ids.
    """
    out = []
    for i in range(len(shots)):
        for j in range(i + 1, len(shots)):
            n = sameness(shots[i], shots[j])
            if n > limit:
                ba, bb = buckets(shots[i]), buckets(shots[j])
                same = [k for k in ("cam", "cast", "light", "props") if ba[k] == bb[k]]
                diff = [k for k in ("cam", "cast", "light", "props") if ba[k] != bb[k]]
                ta = shots[i].get("s", 0) / fps
                tb = shots[j].get("s", 0) / fps
                out.append((
                    "%s @%d:%02d" % (shots[i].get("id", "?"), ta // 60, ta % 60),
                    "%s @%d:%02d" % (shots[j].get("id", "?"), tb // 60, tb % 60),
                    n,
                    "same %s; only %s differs" % (", ".join(same), ", ".join(diff) or "nothing"),
                ))
    return out


if __name__ == "__main__":
    import sys
    data = json.load(open(sys.argv[1]))
    reps = find_repeats(data["shots"], data.get("fps", 30))
    for a, b, n, why in reps:
        print("REPEAT %s <-> %s (%d/4 buckets) - %s" % (a, b, n, why))
    print("%d repeat pair(s)" % len(reps))
    sys.exit(1 if reps else 0)
