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
    # ---- ONE-USE LAW (v0.6). A picture is used ONCE. There is no allowance.
    rs = [s for s in body if s.get('reuse')]
    chk('re-shown scenes', len(rs) == 0, f'{len(rs)} of {len(body)}',
        '0 - every shot is a NEW picture. Add a scene to each unit named in WARN; never let a unit recycle its own scene.')
    if rs:
        for s in rs[:12]:
            print(f"        re-show: unit {s.get('u')} set '{s['set']}' at {s['s'] / fps:.1f}s")
    # the same [set, variant] appearing anywhere else in the video, in ANY unit
    seen = {}
    for s in body:
        k = json.dumps([s['set'], {kk: vv for kk, vv in (s.get('v') or {}).items() if kk not in ('alt', 'off', 'dir')}], sort_keys=True)
        seen.setdefault(k, []).append(s)
    dup = {k: v for k, v in seen.items() if len(v) > 1}
    chk('identical scene specs anywhere in the video', not dup, sum(len(v) - 1 for v in dup.values()),
        '0 - change the camera, the people positions or a prop so the picture is new')
    for k, v in list(dup.items())[:10]:
        print(f"        repeated {len(v)}x at " + ', '.join(f"{s['s'] / fps:.1f}s" for s in v[:6]) + f"  {k[:90]}")
    # the same SET used many times is allowed only if every use looks different
    setc = {}
    for s in body: setc[s['set']] = setc.get(s['set'], 0) + 1
    hot = {k: v for k, v in setc.items() if v > max(3, len(body) * 0.18)}
    chk('one set carrying too much of the video', not hot, hot or 'spread ok',
        f'no set in more than {max(3, int(len(body) * 0.18))} shots (write more places)')
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
    # ---- ONE-CREATURE LAW (v0.6). If the story has a monster or antagonist, it is the
    # SAME creature in every shot it appears in: one spec, one height, one face. A design
    # that drifts between shots reads as several different monsters and kills the fear.
    # Declare it once in story/creature.json:
    #   {"id": "listener", "variants": ["listenerLiving"], "min_shots": 6, "angles": 2}
    # 'variants' is only for the same character in another STATE (alive/burnt/wet), never
    # for a different design.
    cids = {}
    for s in body:
        c = (s.get('v') or {}).get('c')
        if c: cids[c] = cids.get(c, 0) + 1
    decl = None
    try:
        with open('story/creature.json') as fh: decl = json.load(fh)
    except FileNotFoundError:
        pass
    if decl or cids:
        if decl:
            allowed = {decl['id']} | set(decl.get('variants') or [])
            stray = sorted(set(cids) - allowed)
            chk('creature matches story/creature.json', not stray, stray or sorted(cids),
                f'only {sorted(allowed)} - one antagonist, one design, whole video')
            need = int(decl.get('min_shots', 6))
            n = sum(cids.get(k, 0) for k in allowed)
            chk('shots showing the creature', n >= need, n, f'>= {need} (it must be SEEN, not described)')
        else:
            chk('creature declared', False, sorted(cids),
                'story/creature.json is missing - declare the antagonist so its design can be locked')
        if len(cids) > 1 and not (decl and set(cids) <= ({decl['id']} | set(decl.get('variants') or []))):
            chk('one creature design', False, sorted(cids),
                'one antagonist per story; a second id is only allowed as a declared state variant')
        print('      creature shots: ' + ', '.join(f'{k} x{v}' for k, v in sorted(cids.items())))

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
    # ---- ONE-USE LAW (v0.6): a picture that already appeared may NOT come back.
    # The old check only looked more than 20 s back, so a scene repeated a few seconds
    # later was invisible - which is exactly the fault the user reported. Now every
    # sampled second is compared against EVERY earlier second, skipping only the 5 s
    # window around it (those are the same continuous shot, not a repeat).
    GAP, SAME, NEAR = 5, 40, 64
    same_hits, near_hits = [], []
    for i in range(len(h)):
        best, bj = 10 ** 9, -1
        for j in range(0, max(0, i - GAP)):
            d = int((h[i] != h[j]).sum())
            if d < best: best, bj = d, j
        if best <= SAME: same_hits.append((i, bj, best))
        elif best <= NEAR: near_hits.append((i, bj, best))
    rp = len(same_hits) / len(h) * 100
    chk('seconds re-showing an earlier picture', rp <= 2, f'{rp:.0f}% ({len(same_hits)}s)',
        '<= 2% - a picture is used ONCE (old gate allowed 8% and only looked 20 s back)')
    npc = len(near_hits) / len(h) * 100
    chk('seconds that merely LOOK like an earlier picture', npc <= 6, f'{npc:.0f}% ({len(near_hits)}s)',
        '<= 6% - near-copies count too: change angle, position or prop')
    for lbl, hits in (('REPEAT', same_hits), ('NEAR-COPY', near_hits)):
        for i, j, d in hits[:10]:
            print(f'        {lbl}: {i}s looks like {j}s (differs {d}/576 bits)')
    # the whole video must keep producing new pictures, not cycle a small pool
    chk('distinct pictures overall', len(reps) / len(h) >= 0.82, f'{len(reps)}/{len(h)}',
        '>= 82% of sampled seconds are a new picture')
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
