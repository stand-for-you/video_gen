"""Scroll Kaos v0.5 - prove the engine's own rules agree with each other.

Run this after ANY change to the look, the shot schema or the voice cast:
    python3 tools/selftest.py
It exits non-zero on the first disagreement. These are the checks that caught real faults
while v0.5 was being built, so they stay.
"""
from __future__ import annotations
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ENG = os.path.dirname(HERE)
sys.path.insert(0, HERE)
import shotsig  # noqa: E402

fails = []


def check(name, ok, detail=""):
    print(("PASS " if ok else "FAIL ") + name + (("  - " + detail) if detail and not ok else ""))
    if not ok:
        fails.append(name)


def read(rel):
    with open(os.path.join(ENG, rel), encoding="utf-8") as f:
        return f.read()


# 1. the fps claim and the fps in code must agree
root = read("src/Root.tsx")
check("Root renders at 30 fps", "export const FPS = 30;" in root,
      "v0.4 shipped 10 fps while its own law said 30 - do not let that come back")

# 2. subtitle roles in TS and in the voice cast must be the same set
pal = read("src/three/palette.ts")
ts_roles = set(re.findall(r"^\s{2}(\w+):\s*\{ tag:", pal, re.M))
vo = {}
exec(read("story/voices.py"), vo)
py_roles = set(vo["ROLE"].values())
check("speaker colours cover every voice tag", py_roles <= ts_roles,
      "in voices.py but not palette.ts: %s" % (py_roles - ts_roles))

# 3. the one-use signature must be coarse enough to catch a nudge
a = {"id": "a", "s": 0, "kit": "CityBlock", "preset": "walk_bob",
     "anchor": {"pos": [0, 1.6, 6], "yaw": 0}, "actors": [], "kitOpts": {"shape": "alley"}}
b = json.loads(json.dumps(a)); b["id"] = "b"; b["anchor"]["pos"] = [0, 1.6, 6.1]
check("a 10 cm camera nudge is still the same picture", shotsig.sameness(a, b) == 4,
      "got %d/4" % shotsig.sameness(a, b))
c = json.loads(json.dumps(a)); c["id"] = "c"; c["anchor"] = {"pos": [0, 1.6, -9], "yaw": 180}
check("moving AND turning alone is still a repeat", shotsig.sameness(a, c) == 3,
      "got %d/4 - only one bucket may differ before it is a fault" % shotsig.sameness(a, c))
d = json.loads(json.dumps(c)); d["id"] = "d"; d["kitOpts"] = {"shape": "deadend"}
check("changing two buckets clears the rule", shotsig.sameness(a, d) <= 2,
      "got %d/4" % shotsig.sameness(a, d))

# 4. every kit named in the DSL must exist in the registry
dsl = read("tools/scenes_dsl.py")
reg = read("src/kits/index.ts")
for k in re.findall(r'"(\w+)"', re.search(r"KITS = \(([^)]*)\)", dsl).group(1)):
    check("kit %s is registered" % k, ("%s:" % k) in reg)

# 5. every camera preset in the DSL must exist in rig.ts
rig = read("src/three/rig.ts")
for p in re.findall(r'"(\w+)"', re.search(r"PRESETS = \(([^)]*)\)", dsl, re.S).group(1)):
    check("preset %s exists in rig.ts" % p, ("'%s'" % p) in rig)

# 6. every hand pose in the DSL must exist in FPSHands.ts
hands = read("src/cast/FPSHands.ts")
for p in re.findall(r'"(\w+)"', re.search(r"HANDS = \(([^)]*)\)", dsl, re.S).group(1)):
    check("hand pose %s exists" % p, ("case '%s'" % p) in hands)

# 7. the fonts must be on disk, not fetched at render time
check("brand font ships with the engine", os.path.exists(os.path.join(ENG, "public/fonts/Montserrat.ttf")),
      "a render that fetches a font from the network fails behind a proxy")
check("no google-fonts import survives", "@remotion/google-fonts" not in root)

# 8. the epilogue camera must not be usable inside the story
bs = read("tools/build_shots.py")
check("drift_wide is blocked in the story body", "drift_wide" in bs and "epilogue roll only" in bs)

# 9. the locked character database
cast = json.loads(read("story/cast.json"))
chars = [k for k in cast if not k.startswith("_")]
check("cast.json holds characters", len(chars) >= 1, "no characters found")
REQ = ["name", "role", "appearance", "face", "hair", "clothing", "proportions",
       "personality", "voice"]
for k in chars:
    miss = [f for f in REQ if f not in cast[k]]
    check("character '%s' carries every required field" % k, not miss, "missing %s" % miss)
    check("character '%s' has a buildable rig" % k,
          ("look" in cast[k]) != ("creature" in cast[k]),
          "needs exactly one of look / creature")
    tag = (cast[k].get("voice") or {}).get("tag")
    check("character '%s' voice tag is cast" % k, tag in vo["VOICES"], "unknown tag %r" % tag)

# 10. the sheet generator covers the six required expressions
cs = read("tools/charsheet.mjs")
for e in ("normal", "scared", "shocked", "sad", "angry", "confused"):
    check("sheet generator renders '%s'" % e, "'%s'" % e in cs)

print("\n%d check(s), %d failure(s)" % (10, len(fails)))
sys.exit(1 if fails else 0)
