#!/usr/bin/env python3
"""Perceptual-repeat proxy: render each shot's mid-frame as a still and DCT-pHash compare
against a lookback window, to predict the post-render quality_gate.py perceptual check
before spending ~20min on a cloud render."""
import json, subprocess, sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    subprocess.run(["pip", "install", "--break-system-packages", "-q", "pillow", "numpy"], check=True)
    from PIL import Image
import numpy as np

ROOT = Path(__file__).resolve().parent.parent

def dct2(a):
    N = a.shape[0]
    n = np.arange(N)
    k = n.reshape(-1, 1)
    C = np.cos(np.pi / N * (n + 0.5) * k)
    return C @ a @ C.T

def phash(path, bits=24):
    im = Image.open(path).convert("L").resize((bits, bits), Image.LANCZOS)
    a = np.asarray(im, dtype=np.float64)
    d = dct2(a)
    block = d[:8, :8].flatten()
    med = np.median(block[1:])
    return (block > med).astype(np.uint8)

def hamming(a, b):
    return int(np.sum(a != b))

def render_stills(comp, shots, fps, outdir):
    outdir.mkdir(parents=True, exist_ok=True)
    frames = []
    for i, sh in enumerate(shots):
        s, e = sh["s"], sh["e"]
        mid = (s + e) // 2
        png = outdir / f"{i:03d}.png"
        if not png.exists():
            # NOTE (fixed): pass the bundled OUTPUT FOLDER (serve-url mode), not
            # build/index.html — passing the html file makes remotion try to re-bundle
            # it as a source entry point and fails with "does not contain registerRoot()".
            subprocess.run(
                ["npx", "remotion", "still", str(ROOT / "build"), comp, str(png), f"--frame={mid}"],
                cwd=str(ROOT), check=True, capture_output=True, text=True,
            )
        frames.append((i, mid / fps, sh, png))
    return frames

def check(nm, comp, shots_path, outdir, lookback=12, repeat_th=42, near_th=63):
    data = json.loads(Path(shots_path).read_text())
    fps = data["fps"]
    shots = data["shots"]
    frames = render_stills(comp, shots, fps, outdir)
    hashes = []
    repeats, nears = [], []
    for i, t, sh, png in frames:
        h = phash(png)
        for j in range(max(0, i - lookback), i):
            dist = hamming(h, hashes[j])
            if dist < repeat_th:
                repeats.append((t, frames[j][1], sh.get("set"), frames[j][2].get("set"), dist))
            elif dist < near_th:
                nears.append((t, frames[j][1], sh.get("set"), frames[j][2].get("set"), dist))
        hashes.append(h)
    print(f"\n=== {nm}: {len(frames)} shots ===")
    print(f"REPEAT(<{repeat_th}): {len(repeats)}  NEAR({repeat_th}-{near_th}): {len(nears)}")
    for r in repeats:
        print(f"  REPEAT  {r[0]:.1f}s {r[2]} vs {r[1]:.1f}s {r[3]}  dist={r[4]}")
    for n in nears:
        print(f"  NEAR    {n[0]:.1f}s {n[2]} vs {n[1]:.1f}s {n[3]}  dist={n[4]}")
    return repeats, nears

if __name__ == "__main__":
    which = sys.argv[1] if len(sys.argv) > 1 else "both"
    results = {}
    if which in ("long", "both"):
        results["long"] = check("long", "Long", ROOT / "src" / "shots_long.json", ROOT / "qa" / "longf")
    if which in ("reel", "both"):
        results["reel"] = check("reel", "Reel", ROOT / "src" / "shots_reel.json", ROOT / "qa" / "reelf")
    bad = any(r[0] for r in results.values())
    sys.exit(1 if bad else 0)
