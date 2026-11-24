#!/usr/bin/env python3
"""Scroll Kaos quality gate: measures a finished video for the faults the user rejected.

Checks (all numbers are printed, nothing is hidden). Hard fails: wrong size, fps < 30, too few shots,
repeated shots. Warnings: long freezes and still time.
  1. Resolution and frame rate (must match the deliverable).
  2. Shot count per minute (cuts = big picture jumps). Target >= 20/min for the long video.
  3. Repeated shots: how many shots look almost the same as an EARLIER shot
     (same still reused). Target: 0 repeats of a shot within the same video.
  4. Longest freeze: longest run where the picture does not move (seconds). Target <= 2.5 s.
  5. Still-time share: share of time the picture is nearly still. Reported only (a warning above 35%).
Usage: python3 quality_gate.py VIDEO [--kind long|reel] [--sheet OUT.png]
Exit code 1 when a hard check fails.
Needs: ffmpeg, ffprobe, numpy (no other packages).
"""
import argparse, json, subprocess, sys
import numpy as np

def probe(path):
    out = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries',
                          'stream=width,height,r_frame_rate:format=duration', '-of', 'json', path],
                         capture_output=True, text=True, check=True).stdout
    d = json.loads(out)
    num, den = d['streams'][0]['r_frame_rate'].split('/')
    return int(d['streams'][0]['width']), int(d['streams'][0]['height']), float(num) / float(den), float(d['format']['duration'])

def sample(path, w, h, fps=10):
    cmd = ['ffmpeg', '-v', 'error', '-i', path, '-vf', f'fps={fps},scale=96:{int(96*h/w)//2*2},format=gray',
           '-f', 'rawvideo', '-']
    raw = subprocess.run(cmd, capture_output=True).stdout
    hh = int(96 * h / w) // 2 * 2
    return np.frombuffer(raw, np.uint8).reshape(-1, hh, 96).astype(np.float32)

def segments(frames, cut_thr=18.0):
    d = np.abs(np.diff(frames, axis=0)).mean(axis=(1, 2))
    cuts = np.where(d > cut_thr)[0] + 1
    bounds = [0] + list(cuts) + [len(frames)]
    segs = [(a, b) for a, b in zip(bounds[:-1], bounds[1:]) if b - a >= 3]
    return segs, d

def repeats(frames, segs, same_thr=1.5, min_gap_s=8, fps=10):
    """A shot is a repeat when its mean picture matches an earlier shot that started at least min_gap_s before it."""
    reps = []
    means = [frames[a:b].mean(axis=0) for a, b in segs]
    for i in range(len(segs)):
        for j in range(i):
            if segs[i][0] - segs[j][0] < min_gap_s * fps:
                continue
            if np.abs(means[i] - means[j]).mean() < same_thr:
                reps.append((i, j))
                break
    return reps

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('video'); ap.add_argument('--kind', default='long', choices=['long', 'reel'])
    ap.add_argument('--sheet', default=None)
    a = ap.parse_args()
    w, h, fps, dur = probe(a.video)
    frames = sample(a.video, w, h)
    segs, d = segments(frames)
    reps = repeats(frames, segs)
    still = d < 0.6
    longest = run = 0
    for s in still:
        run = run + 1 if s else 0
        longest = max(longest, run)
    shots_per_min = len(segs) / (dur / 60.0)
    res = {
        'file': a.video, 'resolution': f'{w}x{h}', 'fps': round(fps, 2), 'duration_s': round(dur, 1),
        'shots': len(segs), 'shots_per_min': round(shots_per_min, 1),
        'repeated_shots': len(reps), 'repeat_pairs_example': reps[:5],
        'longest_freeze_s': round(longest / 10.0, 1), 'still_time_share': round(float(still.mean()), 3),
    }
    fails = []
    want = (1920, 1080) if a.kind == 'long' else (1080, 1920)
    if (w, h) != want: fails.append(f'resolution {w}x{h} != {want[0]}x{want[1]}')
    if fps < 29.9: fails.append(f'fps {fps:.2f} < 30')
    if a.kind == 'long' and shots_per_min < 20: fails.append(f'shots/min {shots_per_min:.1f} < 20')
    if a.kind == 'reel' and shots_per_min < 18: fails.append(f'shots/min {shots_per_min:.1f} < 18')
    if reps: fails.append(f'{len(reps)} shot(s) repeat an earlier picture')
    warns = []
    if res['still_time_share'] > 0.35: warns.append('picture is still for more than 35% of the time')
    if longest / 10.0 > 2.5: warns.append(f'freeze {longest/10:.1f}s is longer than 2.5s (check it is a planned hold)')
    res['hard_fails'] = fails; res['warnings'] = warns
    print(json.dumps(res, indent=2))
    if a.sheet:
        import subprocess as sp
        sp.run(['ffmpeg', '-v', 'error', '-y', '-i', a.video, '-vf',
                f'fps=1/{max(1,int(dur/48))},scale=160:-1,tile=8x6', '-frames:v', '1', a.sheet], check=False)
    sys.exit(1 if fails else 0)

if __name__ == '__main__':
    main()
