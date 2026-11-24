"""FRAME LEDGER (v0.6) - the ONE-USE LAW across videos, not just inside one.

The channel law is: a picture is used once, ever. Inside a single video the quality gate
enforces that. Across videos nothing remembered what had already been shown, so a new
story could re-stage a shot the channel had already published and nobody would notice.

This keeps a small perceptual fingerprint of every delivered video in ledger/frames.json
(committed to git, a few tens of KB per video) and checks a new video against all the
earlier ones.

Usage (work folder):
  python3 tools/frame_ledger.py check <video.mp4> <story-slug>   # before delivery; exit 1 on fail
  python3 tools/frame_ledger.py add   <video.mp4> <story-slug>   # AFTER the video is approved
  python3 tools/frame_ledger.py list                             # what the channel has published

Method: one sample per second, 33x18 greyscale, 32x18 = 576-bit difference hash. Two
samples are "the same picture" at <= 40 differing bits and "a near copy" at <= 64, the
same thresholds the in-video gate uses.
"""
import sys, json, os, subprocess, datetime
import numpy as np

LEDGER = 'ledger/frames.json'
SAME, NEAR = 40, 64
FAIL_SAME_PCT = 1.5   # share of seconds allowed to match an earlier VIDEO exactly
FAIL_NEAR_PCT = 5.0   # share allowed to merely look like one


def hashes(path):
    """one dHash per second of video, as a (n, 576) bool array"""
    dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration',
                                '-of', 'csv=p=0', path], capture_output=True, text=True).stdout)
    raw = subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-i', path,
                          '-vf', 'fps=1,scale=33:18', '-f', 'rawvideo', '-pix_fmt', 'gray', '-'],
                         capture_output=True).stdout
    n = len(raw) // (18 * 33)
    if n == 0:
        raise SystemExit(f'frame ledger: {path} is {dur:.2f}s - too short to sample (need at least 1 s of video)')
    fr = np.frombuffer(raw, np.uint8)[:n * 18 * 33].reshape(n, 18, 33).astype(np.int16)
    return (fr[:, :, 1:] > fr[:, :, :-1]).reshape(n, -1), dur


def pack(h):
    return [np.packbits(row).tobytes().hex() for row in h]


def unpack(rows):
    if not rows: return np.zeros((0, 576), bool)
    return np.array([np.unpackbits(np.frombuffer(bytes.fromhex(r), np.uint8))[:576] for r in rows], bool)


def load():
    if not os.path.exists(LEDGER): return {}
    with open(LEDGER) as f: return json.load(f)


def save(d):
    os.makedirs(os.path.dirname(LEDGER), exist_ok=True)
    with open(LEDGER, 'w') as f: json.dump(d, f, indent=1)


def check(path, slug):
    led = load()
    others = {k: v for k, v in led.items() if k != slug}
    h, dur = hashes(path)
    if not others:
        print(f'frame ledger: nothing published yet, {len(h)} samples from "{slug}" are all new.')
        return 0
    old = {k: unpack(v['hashes']) for k, v in others.items()}
    same, near = [], []
    for i, row in enumerate(h):
        best, bk, bj = 10 ** 9, None, -1
        for k, arr in old.items():
            if not len(arr): continue
            d = np.count_nonzero(arr != row, axis=1)
            j = int(d.argmin())
            if int(d[j]) < best: best, bk, bj = int(d[j]), k, j
        if best <= SAME: same.append((i, bk, bj, best))
        elif best <= NEAR: near.append((i, bk, bj, best))
    sp, npc = len(same) / len(h) * 100, len(near) / len(h) * 100
    print(f'frame ledger: "{slug}" {len(h)}s checked against {len(others)} earlier video(s) '
          f'({sum(len(v["hashes"]) for v in others.values())} stored seconds)')
    ok_s, ok_n = sp <= FAIL_SAME_PCT, npc <= FAIL_NEAR_PCT
    print(f"{'PASS' if ok_s else 'FAIL'}  seconds reusing a picture from an earlier video: {sp:.1f}% ({len(same)}s)  (need <= {FAIL_SAME_PCT}%)")
    print(f"{'PASS' if ok_n else 'FAIL'}  seconds that look like an earlier video: {npc:.1f}% ({len(near)}s)  (need <= {FAIL_NEAR_PCT}%)")
    for lbl, hits in (('REUSED', same), ('NEAR-COPY', near)):
        for i, k, j, d in hits[:10]:
            print(f'        {lbl}: {i}s here looks like {j}s of "{k}" (differs {d}/576 bits)')
    if not (ok_s and ok_n):
        print('  Fix: re-stage those moments - new place, new camera angle, new time of day,\n'
              '       or new people positions. Do not ship a picture the channel has already shown.')
    return 0 if (ok_s and ok_n) else 1


def add(path, slug):
    led = load()
    h, dur = hashes(path)
    led[slug] = {'hashes': pack(h), 'seconds': len(h), 'duration': round(dur, 1),
                 'file': os.path.basename(path), 'added': datetime.date.today().isoformat()}
    save(led)
    print(f'frame ledger: stored {len(h)} seconds for "{slug}" ({len(led)} videos on record)')
    return 0


def lst():
    led = load()
    if not led:
        print('frame ledger: empty'); return 0
    print(f'frame ledger: {len(led)} video(s), {sum(v["seconds"] for v in led.values())} stored seconds')
    for k, v in sorted(led.items(), key=lambda kv: kv[1].get('added', '')):
        print(f'  {v.get("added", "?")}  {k:<34} {v["seconds"]:>5}s  {v.get("file", "")}')
    return 0


if __name__ == '__main__':
    mode = sys.argv[1] if len(sys.argv) > 1 else 'list'
    if mode == 'list': sys.exit(lst())
    if mode == 'check': sys.exit(check(sys.argv[2], sys.argv[3]))
    if mode == 'add': sys.exit(add(sys.argv[2], sys.argv[3]))
    sys.exit('usage: frame_ledger.py check|add <video.mp4> <story-slug>   |   frame_ledger.py list')
