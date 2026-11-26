"""SHOT-LIST GATE - every fault that is visible BEFORE rendering, in about a second.

tools/quality_gate.py measures a finished video. On a 2-core machine that video costs two
hours, so a repeated picture found there costs two hours to learn. Every repeat is already
visible in src/shots_*.json the moment it is built. This reads that file instead, and NAMES
the offending shots with their timestamps, so the fix is specific rather than guesswork.

Usage (work folder):
    python3 tools/gate_shots.py long
    python3 tools/gate_shots.py reel
Exit 1 on any FAIL. Run it after tools/build_shots.py and before any render.
"""
import sys, json, os

R = {'fail': 0}


def chk(name, ok, val, need):
    print(f"{'PASS' if ok else 'FAIL'}  {name}: {val}  (need {need})")
    if not ok: R['fail'] += 1


def main():
    name = sys.argv[1] if len(sys.argv) > 1 else 'long'
    path = f'src/shots_{name}.json'
    if not os.path.exists(path):
        sys.exit(f'{path} not found - run: python3 tools/build_shots.py {name}')
    J = json.load(open(path))
    S = J['shots']
    fps = J.get('fps', 10)          # the v0.4 shot clock is 10 fps; the video is 30
    CARDS = ('end', 'qcard', 'rqcard', 'crtoff', 'rcrtoff')
    body = [s for s in S if s['set'] not in CARDS]
    if not body:
        sys.exit('no story shots in the list')
    dur = J['frames'] / fps
    end_s = J.get('end_s') or dur

    spm = len(S) / (min(dur, end_s) / 60)
    chk('screens per minute', spm >= (20 if name == 'long' else 18), f'{spm:.1f}',
        '>= 20 long / 18 reel')

    # ---- THE ONE-USE LAW: a picture is used ONCE.
    rs = [s for s in body if s.get('close')]
    chk('re-shown scenes', not rs, f'{len(rs)} of {len(body)}',
        '0 - add a scene to each beat listed in build_shots WARN')
    seen = {}
    for s in body:
        v = {k: val for k, val in (s.get('v') or {}).items() if k not in ('alt', 'off', 'dir', 'fc')}
        seen.setdefault(json.dumps([s['set'], v], sort_keys=True), []).append(s)
    dup = {k: v for k, v in seen.items() if len(v) > 1}
    chk('identical scene specs anywhere in the video', not dup,
        sum(len(v) - 1 for v in dup.values()),
        '0 - change camera, people positions or a prop so each picture is new')
    if dup:
        print('      FIX LIST (worst first):')
        for k, v in sorted(dup.items(), key=lambda kv: -len(kv[1]))[:14]:
            print(f'        {len(v)}x  {k[:84]}')
            print('             at ' + ', '.join(f"{s['s'] / fps:.1f}s" for s in v[:8]))
        need = {}
        for v in dup.values():
            for s in v[1:]: need[s['b']] = need.get(s['b'], 0) + 1
        print('      beats needing more scenes: ' +
              ', '.join(f'beat {b} +{n}' for b, n in sorted(need.items(), key=lambda x: -x[1])[:12]))

    # ---- one place must not carry the whole video (the "rooms all look alike" fault)
    setc = {}
    for s in body: setc[s['set']] = setc.get(s['set'], 0) + 1
    cap = max(3, int(len(body) * 0.18))
    hot = {k: v for k, v in sorted(setc.items(), key=lambda kv: -kv[1]) if v > cap}
    chk('one set carrying too much of the video', not hot, hot or 'spread ok',
        f'no set in more than {cap} shots of {len(body)} (write more places)')

    # ---- pacing
    lens = [(s['e'] - s['s']) / fps for s in body]
    chk('longest story shot', max(lens) <= 4.6, f'{max(lens):.1f}s', '<= 4.6 s')
    teaser = [s for s in S if s['b'] <= J.get('teaser', 2 if name == 'long' else 0)]
    if teaser:
        tmax = max((s['e'] - s['s']) / fps for s in teaser)
        chk('teaser picture change', tmax <= 2.6, f'{tmax:.1f}s', '<= 2.6 s')
    chk('first frame is a story picture, not a card', S[0]['set'] not in CARDS, S[0]['set'],
        'the creepiest picture of the story')

    # ---- ONE-CREATURE LAW: one antagonist, one design, every shot
    cids = {}
    for s in body:
        v = s.get('v') or {}
        c = v.get('c') or v.get('creature') or v.get('ghost')
        if c: cids[str(c)] = cids.get(str(c), 0) + 1
    decl = None
    try:
        with open('story/creature.json') as fh: decl = json.load(fh)
    except (FileNotFoundError, ValueError):
        pass
    if cids or (decl and decl.get('id')):
        print('      creature shots: ' + (', '.join(f'{k} x{v}' for k, v in sorted(cids.items())) or 'none'))
        if decl and decl.get('id'):
            allowed = {decl['id']} | set(decl.get('variants') or [])
            stray = sorted(set(cids) - allowed)
            chk('creature matches story/creature.json', not stray, stray or sorted(cids),
                f'only {sorted(allowed)} - one antagonist, one design, whole video')
            n = sum(cids.get(k, 0) for k in allowed)
            need_n = int(decl.get('min_shots', 6))
            chk('shots showing the creature', n >= need_n, n, f'>= {need_n} (it must be SEEN)')
        else:
            chk('creature declared', False, sorted(cids),
                'story/creature.json has no id - declare the antagonist so its design is locked')

    print('SHOT GATE:', 'FAIL' if R['fail'] else 'PASS')
    return 1 if R['fail'] else 0


if __name__ == '__main__':
    sys.exit(main())
