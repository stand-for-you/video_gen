"""QUALITY GATE (v0.5, 3D at 60 fps). Measures the things the user complained about, with numbers, BEFORE anything is sent.
Usage (work folder):
  python3 tools/quality_gate.py shots long|reel        # after build_shots: variety, re-shows, framing mix, shot length
  python3 tools/quality_gate.py video <file.mp4> [long|reel]   # after encoding: smoothness, variety, re-shows, dark/flat, sharpness
Exit code 1 = FAIL (fix and rebuild; never send a failing video). Thresholds come from the two reference Shorts the user called
"the best" (about 21 effective fps, a new picture every 2-3 s, few repeats) and from the faults found in the other AI's video
(8.5 effective fps, 37 % re-shown pictures, face-only close-ups, dark muddy rooms).
Method: effective fps = frames that differ from the previous one (ffmpeg mpdecimate) / seconds. Distinct pictures = 1 sample per
second, 33x18 dHash, a sample is new if it differs from all earlier ones by > 40 bits. Re-shown = a sample equal to one more than
20 s earlier. Dark/flat = mean luma < 16 or contrast (std) < 9. Sharpness = median variance of the Laplacian at 640 px wide."""
import sys, json, subprocess, os
import numpy as np

R = {'fail': 0}
def chk(name, ok, val, need):
    print(f"{'PASS' if ok else 'FAIL'}  {name}: {val}  (need {need})")
    if not ok: R['fail'] += 1

def shots_gate(name):
    J = json.load(open(f'src/shots_{name}.json')); S = J['shots']; fps = J.get('fps', 60)
    chk('frame rate', fps >= 60, fps, '60 (the channel standard)')
    dur = J['frames'] / fps; body = [s for s in S if s['set'] not in ('end', 'qcard', 'rqcard')]
    end_s = J.get('end_s') or dur
    spm = len(S) / (min(dur, end_s) / 60)
    chk('screens per minute', spm >= (20 if name == 'long' else 22), f'{spm:.1f}', '>= 20 long / 22 reel')
    re = sum(1 for s in body if s.get('reuse')) / max(1, len(body)) * 100
    chk('re-shown scenes', re <= 10, f'{re:.0f}%', '<= 10% (write more scenes per beat)')
    fr = {}
    for s in body: fr[s.get('fr', 'wide')] = fr.get(s.get('fr', 'wide'), 0) + 1
    pc = {k: v / len(body) * 100 for k, v in fr.items()}
    print('      framing mix: ' + ', '.join(f'{k} {v:.0f}%' for k, v in sorted(pc.items())))
    chk('wide shots', pc.get('wide', 0) >= 25, f"{pc.get('wide', 0):.0f}%", '>= 25%')
    chk('close-ups (face fills frame)', pc.get('close', 0) <= 22, f"{pc.get('close', 0):.0f}%", '<= 22%')
    chk('no face-only framing', all(s.get('fr') in ('wide', 'waist', 'bust', 'close', 'detail') for s in body), sorted(set(s.get('fr') for s in body)), 'wide|waist|bust|close|detail only (a face alone is never allowed)')
    chk('waist + bust shots', pc.get('waist', 0) + pc.get('bust', 0) >= 15, f"{pc.get('waist', 0) + pc.get('bust', 0):.0f}%", '>= 15% (people shown chest-up / waist-up, not only faces)')
    lens = [(s['e'] - s['s']) / fps for s in body]
    chk('longest shot', max(lens) <= 4.6, f'{max(lens):.1f}s', '<= 4.6 s')
    t = [s for s in S if s['b'] <= J.get('teaser', 2 if name == 'long' else 0)]
    chk('teaser picture change', max((s['e'] - s['s']) / fps for s in t) <= 2.6, f"{max((s['e'] - s['s']) / fps for s in t):.1f}s", '<= 2.6 s')
    chk('first frame is a scene, not a card', S[0]['set'] not in ('end', 'qcard', 'rqcard'), S[0]['set'], 'a story picture')
    same = sum(1 for a, b in zip(body, body[1:]) if a['set'] == b['set'] and a.get('fr') == 'close' and b.get('fr') == 'close')
    chk('two close-ups of the same set in a row', same == 0, same, '0')
    # SYNC LAW: every shot belongs to one spoken sentence and stays inside it
    try:
        units = json.load(open(f'audio/{name}/timing.json'))['units']
        off = []
        for sh in body:
            ui = sh.get('u')
            u = units[ui] if ui is not None and ui < len(units) else None
            if u is None: off.append(sh); continue
            nxt = units[ui + 1]['start'] if ui + 1 < len(units) else 1e9
            a, b = sh['s'] / fps, sh['e'] / fps
            if a < u['start'] - 0.35 or b > nxt + 0.1: off.append(sh)
        chk('shots that leave their own sentence', len(off) <= max(1, int(len(body) * 0.05)), len(off), '<= 5% (picture must match the words: run tools/sync_check.py)')
        chk('sentences with no picture of their own', all(any(sh.get('u') == i for sh in S) for i in range(len(units) - 1)), 'checked', 'every sentence has at least one shot')
    except FileNotFoundError:
        print('      (timing.json missing: sync not checked)')

def frames(p, vf, w, h):
    raw = subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-i', p, '-vf', vf, '-f', 'rawvideo', '-pix_fmt', 'gray', '-'], capture_output=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(-1, h, w)

def video_gate(p, kind):
    dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p], capture_output=True, text=True).stdout)
    end = 20.0 if kind == 'long' else 0.0
    body = max(1.0, dur - end)
    # smoothness: frames that really change
    out = subprocess.run(['ffmpeg', '-hide_banner', '-i', p, '-t', f'{body:.2f}', '-vf', 'mpdecimate,showinfo', '-f', 'null', '-'], capture_output=True, text=True).stderr
    n = out.count('pts_time:')
    efps = n / body
    chk('effective fps (smooth motion)', efps >= 40, f'{efps:.1f}', '>= 40 at 60 fps (the camera never stops, so nearly every frame differs)')
    # variety + repeats
    fr = frames(p, f'trim=0:{body:.2f},fps=1,scale=33:18', 33, 18).astype(np.int16)
    h = (fr[:, :, 1:] > fr[:, :, :-1]).reshape(len(fr), -1)
    reps = []
    for i in range(len(h)):
        if not any((h[i] != r).sum() <= 40 for r in reps): reps.append(h[i])
    ppm = len(reps) / len(h) * 60
    chk('distinct pictures per minute', ppm >= 18, f'{ppm:.1f}', '>= 18')
    nat = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=r_frame_rate', '-of', 'csv=p=0', p], capture_output=True, text=True).stdout.strip()
    chk('file frame rate', nat.startswith('60'), nat, '60/1')
    again = sum(1 for i in range(len(h)) if any((h[i] != h[j]).sum() <= 40 for j in range(0, max(0, i - 20))))
    rp = again / len(h) * 100
    chk('seconds re-showing an earlier picture', rp <= 8, f'{rp:.0f}%', '<= 8% (other AI: 37%)')
    # dark / flat / soft
    wh = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', p], capture_output=True, text=True).stdout.strip().split(',')
    gh = int(round(640 * int(wh[1]) / int(wh[0]) / 2)) * 2
    g = frames(p, f'trim=0:{body:.2f},fps=2,scale=640:{gh}', 640, gh)
    mean = g.mean(axis=(1, 2)); std = g.std(axis=(1, 2))
    bad = ((mean < 16) | (std < 9)).mean() * 100
    chk('dark or flat (muddy) frames', bad <= 8, f'{bad:.1f}%', '<= 8%')
    k = np.array([[0, 1, 0], [1, -4, 1], [0, 1, 0]], np.float32)
    def lap(a):
        a = a.astype(np.float32); return (a[1:-1, 1:-1] * -4 + a[:-2, 1:-1] + a[2:, 1:-1] + a[1:-1, :-2] + a[1:-1, 2:]).var()
    sh = float(np.median([lap(x) for x in g[::4]]))
    chk('sharpness (median Laplacian variance at 640 px)', sh >= 25, f'{sh:.0f}', '>= 25 (soft, upscaled video is lower)')
    print(f'      duration {dur:.1f}s, checked {body:.1f}s (end screen excluded)')

if __name__ == '__main__':
    mode = sys.argv[1]
    if mode == 'shots': shots_gate(sys.argv[2])
    else: video_gate(sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else ('reel' if '1080x1920' in sys.argv[2] else 'long'))
    print('QUALITY GATE:', 'FAIL' if R['fail'] else 'PASS')
    sys.exit(1 if R['fail'] else 0)
