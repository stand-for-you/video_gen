"""Scroll Kaos v0.5 - the ONE-USE LAW ACROSS VIDEOS.

A picture is used once, EVER - not once per video. This file is the channel's memory.

Two independent locks, because each one alone has a hole:

  1. SIGNATURE lock (cheap, runs before rendering)
     The shot's four buckets from shotsig.py, hashed. Catches "I rebuilt the same shot in a
     new story" before a single frame is drawn.

  2. PERCEPTUAL lock (runs on the finished mp4, before delivery)
     A 16x16 DCT perceptual hash of sampled frames. Catches a picture that was built from
     different numbers but LOOKS the same - which is the failure mode a signature cannot see,
     and the one the user has been reporting.

Usage (from the work folder):
    python3 tools/frame_ledger.py check final/<Prefix>_YouTube_1920x1080.mp4 <story-slug>
    python3 tools/frame_ledger.py checksig src/shots_long.json <story-slug>
    python3 tools/frame_ledger.py add final/<Prefix>_YouTube_1920x1080.mp4 <story-slug>
`check` and `checksig` exit non-zero on a clash. `add` is run ONLY after the user approves.

The ledger lives at $SCROLL_KAOS_LEDGER (default ~/.scroll-kaos/ledger.json) so it survives
between work folders. Keep it; losing it means the channel forgets what it has already shown.
"""
from __future__ import annotations
import json
import os
import subprocess
import sys
import tempfile

LEDGER = os.environ.get("SCROLL_KAOS_LEDGER", os.path.expanduser("~/.scroll-kaos/ledger.json"))
# Hamming distance under which two 256-bit pHashes count as THE SAME PICTURE.
#
# Measured on 780 frame pairs from the reference video, not guessed:
#     identical frame, re-encoded or re-graded ....  0 -  8
#     genuinely different pictures ................ 70 - 128  (minimum over all 780 pairs: 70)
#     the same picture reframed by 20 px .......... over 100
# So there is a clean empty band between 8 and 70, and 24 sits in it with a wide margin in
# both directions: no false alarm on a slow pan, and no miss on a literally reused frame.
#
# What this lock does NOT catch: a picture rebuilt at a slightly different camera angle. That
# is deliberate - a DCT hash treats a reframe as a different image. That case belongs to the
# SIGNATURE lock in shotsig.py, which works on the shot's numbers instead of its pixels. The
# two locks together cover both failure modes; neither covers both on its own.
PHASH_NEAR = 24
SAMPLE_FPS = 0.5            # 1 frame every 2 s is enough to catch a reused shot


def _load() -> dict:
    if os.path.exists(LEDGER):
        with open(LEDGER) as f:
            return json.load(f)
    return {"videos": {}, "phash": {}, "sig": {}}


def _save(d: dict) -> None:
    os.makedirs(os.path.dirname(LEDGER), exist_ok=True)
    with open(LEDGER, "w") as f:
        json.dump(d, f, indent=1)


# ---------------------------------------------------------------- perceptual hash
def _dct_1d(v):
    import math
    n = len(v)
    return [sum(v[x] * math.cos(math.pi * u * (2 * x + 1) / (2 * n)) for x in range(n)) for u in range(n)]


def phash(path: str) -> str:
    """256-bit DCT perceptual hash, as 64 hex chars. Pillow only - no extra dependency."""
    from PIL import Image
    im = Image.open(path).convert("L").resize((32, 32), Image.Resampling.LANCZOS)
    px = list(im.getdata())
    rows = [px[r * 32:(r + 1) * 32] for r in range(32)]
    rows = [_dct_1d(r) for r in rows]
    cols = [_dct_1d([rows[r][c] for r in range(32)]) for c in range(32)]
    # keep the low-frequency 16x16 block, drop the DC term
    vals = [cols[c][r] for r in range(16) for c in range(16)]
    med = sorted(vals[1:])[len(vals[1:]) // 2]
    bits = "".join("1" if v > med else "0" for v in vals)
    return "%064x" % int(bits, 2)


def hamming(a: str, b: str) -> int:
    return bin(int(a, 16) ^ int(b, 16)).count("1")


def frames_of(video: str) -> list:
    d = tempfile.mkdtemp(prefix="skledger_")
    subprocess.run(
        ["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", video,
         "-vf", "fps=%s,scale=160:-1" % SAMPLE_FPS, os.path.join(d, "f_%05d.png")],
        check=True)
    return [os.path.join(d, n) for n in sorted(os.listdir(d)) if n.endswith(".png")]


# ---------------------------------------------------------------- commands
def cmd_check(video: str, slug: str) -> int:
    led = _load()
    mine = [(os.path.basename(p), phash(p)) for p in frames_of(video)]
    clashes = []
    # against every earlier video
    for other_slug, entries in led["phash"].items():
        if other_slug == slug:
            continue
        for name, h in mine:
            for oname, oh in entries:
                d = hamming(h, oh)
                if d <= PHASH_NEAR:
                    clashes.append((name, other_slug, oname, d))
    # and against itself - a video may not repeat its own picture either
    for i in range(len(mine)):
        for j in range(i + 1, len(mine)):
            d = hamming(mine[i][1], mine[j][1])
            # Samples 2 s apart inside one continuous move are still different pictures by
            # this measure, so no neighbour exemption is needed beyond the immediate one.
            if d <= PHASH_NEAR and j - i > 1:
                clashes.append((mine[i][0], slug + " (itself)", mine[j][0], d))
    for a, s, b, d in clashes[:60]:
        print("CLASH %s  ~=  %s/%s   (distance %d, limit %d)" % (a, s, b, d, PHASH_NEAR))
    print("%d sampled frame(s), %d clash(es)" % (len(mine), len(clashes)))
    if clashes:
        print("FAIL: re-stage the shots above. Change at least TWO of "
              "{camera position, who is in shot and where, the light, a prop's state}.")
    return 1 if clashes else 0


def cmd_checksig(shots_json: str, slug: str) -> int:
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    import shotsig
    led = _load()
    data = json.load(open(shots_json))
    mine = {sh["id"]: shotsig.sig_hash(sh) for sh in data["shots"]}
    bad = []
    for other_slug, entries in led["sig"].items():
        if other_slug == slug:
            continue
        seen = set(entries)
        for sid, h in mine.items():
            if h in seen:
                bad.append((sid, other_slug))
    # inside this build too
    inner = shotsig.find_repeats(data["shots"], data.get("fps", 30))
    for a, b, n, why in inner:
        print("REPEAT (this video) %s <-> %s  %d/4 - %s" % (a, b, n, why))
    for sid, other in bad:
        print("REPEAT (earlier video) %s was already used in '%s'" % (sid, other))
    total = len(inner) + len(bad)
    print("%d shot(s) checked, %d repeat(s)" % (len(mine), total))
    return 1 if total else 0


def cmd_add(video: str, slug: str) -> int:
    led = _load()
    led["phash"][slug] = [(os.path.basename(p), phash(p)) for p in frames_of(video)]
    led.setdefault("videos", {})[slug] = {"video": os.path.basename(video)}
    _save(led)
    print("ledger: recorded %d frame hashes for '%s'" % (len(led["phash"][slug]), slug))
    return 0


def cmd_addsig(shots_json: str, slug: str) -> int:
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    import shotsig
    led = _load()
    data = json.load(open(shots_json))
    led["sig"][slug] = sorted({shotsig.sig_hash(sh) for sh in data["shots"]})
    _save(led)
    print("ledger: recorded %d shot signatures for '%s'" % (len(led["sig"][slug]), slug))
    return 0


if __name__ == "__main__":
    if len(sys.argv) < 4:
        print(__doc__)
        sys.exit(2)
    cmd, arg, slug = sys.argv[1], sys.argv[2], sys.argv[3]
    fn = {"check": cmd_check, "checksig": cmd_checksig, "add": cmd_add, "addsig": cmd_addsig}.get(cmd)
    if not fn:
        print("unknown command", cmd)
        sys.exit(2)
    sys.exit(fn(arg, slug))
