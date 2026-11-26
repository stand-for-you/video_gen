"""SHOT-LIST GATE - every fault that is visible BEFORE rendering, in about a second.

tools/quality_gate.py measures a finished video. That video costs hours, so a repeated
picture found there costs hours to learn. Every one of these faults is already visible in
src/shots_<name>.json the moment it is built, and this names the offending shots with their
timestamps so the fix is specific instead of guesswork.

v0.5 shot files carry `kit` + `kitOpts`; the v0.4 files carried `set` + `v`. This reads v0.5
and hands a v0.4 file to tools/gate_shots_v04.py, which is the old gate kept intact.

Usage (work folder):
    python3 tools/gate_shots.py long
    python3 tools/gate_shots.py reel
Exit 1 on any FAIL. Run it after tools/build_shots.py and before any render.
"""
from __future__ import annotations
import json
import os
import subprocess
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import shotsig  # noqa: E402

R = {'fail': 0, 'warn': 0}


def chk(name, ok, val, need):
    print('%s  %s: %s  (need %s)' % ('PASS' if ok else 'FAIL', name, val, need))
    if not ok:
        R['fail'] += 1


def warn(name, ok, val, need):
    print('%s  %s: %s  (want %s)' % ('PASS' if ok else 'WARN', name, val, need))
    if not ok:
        R['warn'] += 1


def ts(fr, fps):
    s = fr / fps
    return '%d:%02d' % (s // 60, s % 60)


def main() -> int:
    name = sys.argv[1] if len(sys.argv) > 1 else 'long'
    path = 'src/shots_%s.json' % name
    if not os.path.exists(path):
        sys.exit('%s not found - run: python3 tools/build_shots.py %s' % (path, name))
    J = json.load(open(path))
    S = J['shots']
    if S and 'kit' not in S[0]:
        print('v0.4 shot file - handing over to tools/gate_shots_v04.py')
        return subprocess.call([sys.executable, 'tools/gate_shots_v04.py', name])
    fps = J.get('fps', 30)
    story_s = J['frames'] / fps

    # ---- the delivered file is longer than the story body: the end screen counts too, and
    # tools/quality_gate.py measures shots per minute over the WHOLE file.
    film_s = story_s
    if os.path.exists('src/film.json'):
        F = json.load(open('src/film.json')).get(name)
        if F:
            film_s = F['filmFrames'] / fps
    # What quality_gate.py will actually count is PICTURE JUMPS in the delivered file, which
    # is not the same as the length of the shot list:
    #   - a scene that sits under an opaque card is never seen, so it is not a cut
    #   - every card IS a cut, and so is every stage and every plate of the end screen
    # Counting it this way is what the finished file will measure, give or take a frame.
    hidden, cards, endseg = set(), 0, 0
    if os.path.exists('src/film.json') and os.path.exists('src/story.json'):
        F = json.load(open('src/film.json')).get(name) or {}
        ST = json.load(open('src/story.json'))
        by_id = {x['id']: x for x in S}
        for c in F.get('cards', []):
            cards += 1
            sh = by_id.get(c['shot'])
            if sh and c['dur'] >= (sh['e'] - sh['s']):
                hidden.add(c['shot'])
        if F.get('endFrames'):
            endseg = 5 + len(ST.get('recap', [])) + len(ST.get('epilogue', []))
        if F.get('tailFrames'):
            endseg += 1
    seen = len(S) - len(hidden) + cards + endseg
    need_spm = 20 if name == 'long' else 18
    spm_film = seen / (film_s / 60)
    chk('picture changes per minute of the delivered file', spm_film >= need_spm,
        '%.1f  (%d story + %d card + %d end-screen over %s; %d hidden under a card)'
        % (spm_film, len(S) - len(hidden), cards, endseg, ts(film_s * fps, fps), len(hidden)),
        '>= %d' % need_spm)
    warn('shots per minute of the story body', len(S) / (story_s / 60) >= need_spm + 1,
         '%.1f' % (len(S) / (story_s / 60)), '>= %d, for headroom' % (need_spm + 1))

    # ---- THE ONE-USE LAW
    reps = shotsig.find_repeats(S, fps)
    chk('repeated pictures', not reps, len(reps), '0')
    for a, b, n, why in reps[:14]:
        print('      REPEAT %s <-> %s (%d/4 buckets) - %s' % (a, b, n, why))

    cam, trip = {}, {}
    for sh in S:
        b = shotsig.buckets(sh)
        cam.setdefault(b['cam'], []).append(sh['id'])
        trip.setdefault((b['cast'], b['light'], b['props']), []).append(sh['id'])
    warn('distinct cameras', len(cam) == len(S), '%d of %d' % (len(cam), len(S)),
         'one per shot - see tools/sigmap.py')
    warn('distinct cast+light+props', len(trip) == len(S), '%d of %d' % (len(trip), len(S)),
         'one per shot - see tools/sigmap.py')

    # ---- WEAK CUTS. quality_gate.py counts a cut only where the picture JUMPS. Two
    # neighbours that differ in one bucket may not read as a cut at all, which quietly drops
    # the measured shots-per-minute below the floor. Changing two things fixes it.
    weak = []
    for i in range(1, len(S)):
        if shotsig.sameness(S[i], S[i - 1]) >= 3:
            weak.append((S[i - 1]['id'], S[i]['id'], ts(S[i]['s'], fps)))
    warn('neighbouring shots that may not read as a cut', not weak, len(weak),
         '0 - change two of {camera, cast, light, prop} between neighbours')
    for a, b, t in weak[:14]:
        print('      WEAK CUT %s -> %s at %s' % (a, b, t))

    # ---- framing mix, first-person law, pacing
    tot = len(S)
    face = sum(1 for s in S if s['framing'] == 'face')
    body = sum(1 for s in S if s['framing'] in ('full', 'waist'))
    hands = sum(1 for s in S if s.get('hands'))
    chk('face-only shots', face / tot <= 0.15, '%d%%' % round(100 * face / tot), '<= 15%')
    chk('shots showing the body', body / tot >= 0.50, '%d%%' % round(100 * body / tot), '>= 50%')
    chk('two face shots in a row',
        not any(S[i]['framing'] == 'face' and S[i - 1]['framing'] == 'face' for i in range(1, tot)),
        'none' if not any(S[i]['framing'] == 'face' and S[i - 1]['framing'] == 'face'
                          for i in range(1, tot)) else 'found', 'none')
    warn('POV hands on screen', hands / tot >= 0.25, '%d%%' % round(100 * hands / tot),
         '>= 25%, the reference runs about a third')
    chk('third-person cameras in the story body',
        not [s for s in S if s['preset'] == 'drift_wide'],
        len([s for s in S if s['preset'] == 'drift_wide']), '0 - drift_wide is epilogue only')

    held = [(s['id'], (s['e'] - s['s']) / fps) for s in S if (s['e'] - s['s']) / fps > 6.0]
    chk('undeclared held beats', not held, len(held), '0 - split it or mark held=True')
    for i, d in held:
        print('      HELD %s for %.1fs' % (i, d))
    teaser = [(s['id'], (s['e'] - s['s']) / fps) for s in S
              if s['s'] < 30 * fps and (s['e'] - s['s']) / fps > 2.5]
    warn('shots over 2.5s inside the first 30s', not teaser, len(teaser), '0')

    # ---- the creature, when the story declares one
    if os.path.exists('story/creature.json'):
        C = json.load(open('story/creature.json'))
        cid = C.get('id')
        if cid:
            shots_with = [s for s in S if any(a.get('id') == cid for a in s.get('actors', []))]
            full = [s for s in shots_with if s['framing'] == 'full']
            poses = {a.get('pose') for s in shots_with for a in s['actors'] if a.get('id') == cid}
            yaws = {a.get('yaw') for s in shots_with for a in s['actors'] if a.get('id') == cid}
            ids = {a.get('id') for s in S for a in s.get('actors', [])
                   if a.get('kind') == 'creature'}
            chk('creature "%s" is seen' % cid, len(shots_with) >= C.get('min_shots', 6),
                '%d shots' % len(shots_with), '>= %d' % C.get('min_shots', 6))
            chk('creature full body', len(full) >= 2, '%d shots' % len(full), '>= 2')
            chk('creature from two angles', len(yaws) >= 2, '%d distinct yaws' % len(yaws), '>= 2')
            warn('creature is moving, not just standing', len(poses) >= 3,
                 '%d poses %s' % (len(poses), sorted(p for p in poses if p)), '>= 3')
            chk('only the declared creature appears', ids <= {cid},
                ', '.join(sorted(ids)) or 'none', 'only "%s"' % cid)

    print('\n%d FAIL, %d WARN' % (R['fail'], R['warn']))
    if R['fail']:
        print('A FAIL is an instruction to fix the scene table and run this again.')
    return 1 if R['fail'] else 0


if __name__ == '__main__':
    sys.exit(main())
