"""Scroll Kaos v0.5 - turn a scene table into src/shots_long.json / shots_reel.json.

A SCENE is one line the writer wrote. A SHOT is one picture. A scene that needs four pictures
must declare four shots - the builder will NOT quietly stretch one picture to fill the time,
because that is how a duplicate gets born (quality-law.md section 6).

Scene table format (story/scenes_long.py):

    from scenes_dsl import S
    SCENES = [
      S('p1_01', kit='ApartmentInterior', opts=dict(room='bedroom', lightOn=True),
        anchor=dict(pos=[0.6,1.55,1.5], yaw=-10), preset='idle_breath',
        framing='full', secs=3.2, hands='hold_phone',
        actors=[dict(id='lily', pose='stand', at=[-0.9,0,-2.0], yaw=160,
                     look=dict(h=1.12, top='#efa8c0', hairStyle='pigtail'))],
        sfx=[dict(t='*creak*', at=40, x=0.72, y=0.44)]),
      ...
    ]

Usage:  python3 tools/build_shots.py long
        python3 tools/build_shots.py reel
"""
from __future__ import annotations
import importlib
import json
import os
import sys

sys.path[:0] = ["story", os.path.dirname(os.path.abspath(__file__)), "."]
import shotsig  # noqa: E402

FPS = 30
NAME = sys.argv[1] if len(sys.argv) > 1 else "long"
W, H = (1920, 1080) if NAME == "long" else (1080, 1920)

# Pacing law, measured off the reference video (mean shot 3.5 s, 72 % under 2.5 s in the
# chase sections). A shot longer than MAX_HOLD is a held beat and must say so.
MIN_SECS, MAX_SECS, MAX_HOLD = 0.8, 9.0, 6.0
TEASER_MAX = 2.5          # every shot in the first 30 s is at most this long
MIN_SHOTS_PER_MIN = 14    # the 3D engine moves inside a shot, so this is lower than v0.4's 20


def main() -> int:
    mod = importlib.import_module("scenes_long" if NAME == "long" else "scenes_reel")
    scenes = mod.SCENES

    # Optional: stretch each beat's scenes onto the MEASURED narration. tools/retime.py
    # writes story/retime_<name>.json from audio/<name>/timing.json after tools/tts.py has
    # run, so a picture always lands on its own words instead of on an estimate. The scenes
    # inside a beat keep their relative lengths - this scales, it never invents or drops a
    # picture, because a gap filled by a tool is how a duplicate gets born.
    rt_path = "story/retime_%s.json" % NAME
    if os.path.exists(rt_path):
        with open(rt_path) as _fh:
            rt = json.load(_fh)
        tot = {}
        for sc in scenes:
            k = sc["id"].split("_")[0]
            tot[k] = tot.get(k, 0.0) + float(sc.get("secs", 2.4))
        scaled = 0
        for sc in scenes:
            k = sc["id"].split("_")[0]
            if k in rt and tot.get(k):
                sc["secs"] = round(float(sc.get("secs", 2.4)) * rt[k] / tot[k], 3)
                scaled += 1
        print("retimed %d of %d scenes from %s" % (scaled, len(scenes), rt_path))
    shots, warn, fail = [], [], []
    f = 0
    for sc in scenes:
        secs = float(sc.get("secs", 2.4))
        if secs < MIN_SECS:
            fail.append("%s: %.2fs is below the %.1fs floor" % (sc["id"], secs, MIN_SECS))
        if secs > MAX_SECS:
            fail.append("%s: %.2fs is over the %.1fs ceiling" % (sc["id"], secs, MAX_SECS))
        if secs > MAX_HOLD and not sc.get("held"):
            fail.append("%s: %.2fs is a held beat - add held=True and say why in the scene "
                        "table, or split it into separate pictures" % (sc["id"], secs))
        if f < 30 * FPS and secs > TEASER_MAX:
            warn.append("%s: %.2fs inside the first 30s (teaser limit %.1fs)" % (sc["id"], secs, TEASER_MAX))
        n = max(1, round(secs * FPS))
        shots.append({
            "id": sc["id"], "s": f, "e": f + n,
            "kit": sc["kit"], "kitOpts": sc.get("opts", {}),
            "anchor": sc["anchor"], "preset": sc.get("preset", "idle_breath"),
            "hands": sc.get("hands"), "actors": sc.get("actors", []),
            "framing": sc.get("framing", "full"),
            "glitch": sc.get("glitch", 0), "wash": sc.get("wash"),
            "washAmount": sc.get("washAmount", 0), "boil": sc.get("boil", 2.2),
            "sfx": sc.get("sfx", []),
        })
        f += n

    for sh in shots:
        sh["sig"] = shotsig.sig_hash(sh)

    # ---- framing mix (quality law 4b) ----
    tot = len(shots)
    face = sum(1 for s in shots if s["framing"] == "face")
    body = sum(1 for s in shots if s["framing"] in ("full", "waist"))
    if tot and face / tot > 0.15:
        fail.append("face-only shots are %d%% of the video (limit 15%%)" % round(100 * face / tot))
    if tot and body / tot < 0.50:
        fail.append("only %d%% of shots show the body (floor 50%%)" % round(100 * body / tot))
    for i in range(1, tot):
        if shots[i]["framing"] == "face" and shots[i - 1]["framing"] == "face":
            fail.append("%s and %s are two face shots in a row" % (shots[i - 1]["id"], shots[i]["id"]))

    # ---- Studio is a character-sheet backdrop, not a room ----
    for s_ in shots:
        if s_["kit"] == "Studio":
            fail.append("%s uses the Studio kit - that is a character-sheet backdrop, "
                        "not a readable room" % s_["id"])

    # ---- first-person law ----
    for s in shots:
        if s["preset"] == "drift_wide":
            fail.append("%s uses drift_wide - that camera is for the epilogue roll only" % s["id"])

    # ---- the one-use law ----
    for a, b, n, why in shotsig.find_repeats(shots, FPS):
        fail.append("REPEAT %s <-> %s (%d/4 buckets) - %s" % (a, b, n, why))

    # ---- pacing ----
    mins = f / FPS / 60 or 1e-9
    spm = tot / mins
    if spm < MIN_SHOTS_PER_MIN:
        warn.append("%.1f shots/min (floor %d)" % (spm, MIN_SHOTS_PER_MIN))

    # ---- hands on screen: the first-person format lives or dies on this ----
    withhands = sum(1 for s in shots if s.get("hands"))
    if tot and withhands / tot < 0.25:
        warn.append("hands visible in only %d%% of shots - the reference runs about a third"
                    % round(100 * withhands / tot))

    out = {
        "fps": FPS, "w": W, "h": H, "frames": f, "shots": shots,
        "chapters": getattr(mod, "CHAPTERS", []), "parts": getattr(mod, "PARTS", []),
    }
    os.makedirs("src", exist_ok=True)
    with open("src/shots_%s.json" % NAME, "w") as fh:
        json.dump(out, fh, indent=1)

    for w in warn:
        print("WARN", w)
    for e in fail:
        print("FAIL", e)
    print("%s: %d shots, %.1fs, %.1f shots/min, %d%% with hands, face %d%%, body %d%%"
          % (NAME, tot, f / FPS, spm, round(100 * withhands / max(1, tot)),
             round(100 * face / max(1, tot)), round(100 * body / max(1, tot))))
    return 1 if fail else 0


if __name__ == "__main__":
    sys.exit(main())
