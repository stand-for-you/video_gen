"""CHECKPOINTS - prove the work is going the right way at every stage, not only at the end.

Why: a video was built twice before anyone saw that a lying patient had been drawn as a
standing figure tipped on its side, that every vertical label was sliced off, that assets
from an older story were on screen, and that six shots looped for three minutes. All of it
was visible long before the render. Nothing checked.

This runs the right check at the right moment and refuses to let the work move on. On a
2-core machine a render costs about two hours, so a fault caught here is two hours saved.

Usage (work folder):
    python3 tools/checkpoint.py            # run every stage that is ready; show the board
    python3 tools/checkpoint.py <stage>    # one stage
    python3 tools/checkpoint.py --list

It stops at the FIRST failing stage, because everything after depends on it.
A failing stage is an instruction to fix and re-run - never a reason to ask permission.
"""
import sys, os, subprocess, json, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
PY = sys.executable or 'python3'


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    return r.returncode, ((r.stdout or '') + (r.stderr or '')).strip()


def have(p):
    return os.path.exists(p)


def tool(name):
    return have(f'tools/{name}')


# ---------------------------------------------------------------- stages
def st_story():
    if not tool('lint_story.py'):
        return True, ['tools/lint_story.py missing (skipped)']
    c, out = run([PY, 'tools/lint_story.py'])
    msgs = out.splitlines()
    for n in ('long', 'reel'):
        if not have(f'audio/{n}/timing.json'):
            msgs.append(f'audio/{n}/timing.json missing - run: python3 tools/tts.py {n}')
            c = 1
    return c == 0, msgs


def st_cast():
    if have('story/creature.json'):
        try:
            d = json.load(open('story/creature.json'))
        except ValueError as e:
            return False, [f'story/creature.json is not valid JSON: {e}']
        if not d.get('id'):
            return False, ['story/creature.json has no "id" - declare the antagonist']
        v = d.get('variants') or []
        return True, [f'antagonist locked: "{d["id"]}"' + (f' + states {v}' if v else ''),
                      'one design, every shot. States are not new designs.']
    return True, ['no story/creature.json - correct ONLY if this story has no monster or antagonist.',
                  'If it has one, fill story/creature.json or the design will drift between shots.']


def st_scenes():
    ok, msgs = True, []
    for n in ('long', 'reel'):
        if not have(f'story/scenes_{n}.py'): continue
        c, out = run([PY, 'tools/build_shots.py', n])
        msgs += [f'--- {n}'] + out.splitlines()[:14]
        if c: ok = False
    return ok, msgs


def st_look_static():
    ok, msgs = True, []
    for t in ('lint_poses.py',):
        if not tool(t):
            msgs.append(f'tools/{t} missing (skipped)'); continue
        c, out = run([PY, f'tools/{t}'])
        msgs += out.splitlines()
        if c: ok = False
    return ok, msgs


def st_shots():
    if not tool('gate_shots.py'):
        return True, ['tools/gate_shots.py missing (skipped)']
    ok, msgs = True, []
    for n in ('long', 'reel'):
        if not have(f'src/shots_{n}.json'): continue
        c, out = run([PY, 'tools/gate_shots.py', n])
        msgs += [f'--- {n}'] + out.splitlines()[:26]
        if c: ok = False
    return ok, msgs


def st_sheets():
    sheets = glob.glob('qa/*sheet*.jpg') + glob.glob('qa/*sheet*.png')
    if not sheets:
        return False, ['no contact sheets built yet.',
                       'run: bash tools/qa_sheets.sh gal && bash tools/qa_sheets.sh long && bash tools/qa_sheets.sh reel',
                       'then LOOK at every sheet. This stage cannot be automated.']
    return True, ['sheets built: ' + ', '.join(os.path.basename(s) for s in sheets[:8]),
                  'LOOK at each one. Check: heads cut off at the top, empty frames, near-black',
                  'frames, rooms that look alike, a figure not actually sitting on the chair it',
                  'is meant to sit on, props that render as plain rectangles, labels running off',
                  'the frame, and anything from an older story.',
                  'Any fault here is an instruction to redraw and rebuild - not to ask.']


def st_deliver():
    fin = sorted(glob.glob('final/*.mp4'))
    if not fin:
        return True, ['nothing rendered yet - this stage runs after tools/render.sh']
    ok, msgs = True, []
    for f in fin:
        kind = 'reel' if '1080x1920' in f else 'long'
        c, out = run([PY, 'tools/quality_gate.py', f, '--kind', kind])
        msgs += [f'--- {os.path.basename(f)}'] + [l for l in out.splitlines()
                                                  if l.startswith(('PASS', 'FAIL', 'HARD', 'WARN'))][:14]
        if c: ok = False
        if tool('frame_ledger.py') and have('ledger/frames.json'):
            slug = os.path.splitext(os.path.basename(f))[0]
            c2, out2 = run([PY, 'tools/frame_ledger.py', 'check', f, slug])
            msgs += [l for l in out2.splitlines() if l.startswith(('PASS', 'FAIL'))]
            if c2: ok = False
    return ok, msgs


STAGES = [('story', 'script, scene table and narration exist and line up', st_story),
          ('cast', 'the antagonist is declared and locked', st_cast),
          ('scenes', 'enough DIFFERENT scenes; nothing recycled', st_scenes),
          ('poses', 'no character rotated in place of a drawn pose', st_look_static),
          ('shots', 'the shot list passes the gate (repeats, spread, pacing)', st_shots),
          ('sheets', 'contact sheets built AND read by eye', st_sheets),
          ('deliver', 'rendered files pass the video gate + frame ledger', st_deliver)]


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('-')]
    if '--list' in sys.argv:
        for i, (k, d, _) in enumerate(STAGES, 1): print(f'{i}. {k:<8} {d}')
        return 0
    want = args[0] if args else None
    board, failed = [], None
    for i, (key, desc, fn) in enumerate(STAGES, 1):
        if want and key != want: continue
        if failed and not want:
            board.append((i, key, 'SKIP', desc, ['not run: fix the stage above first'])); continue
        try:
            ok, msgs = fn()
        except Exception as e:
            ok, msgs = False, [f'checkpoint crashed: {type(e).__name__}: {e}']
        board.append((i, key, 'PASS' if ok else 'FAIL', desc, msgs))
        if not ok and failed is None: failed = key
    print('=' * 74)
    print('CHECKPOINTS')
    print('=' * 74)
    for i, key, state, desc, msgs in board:
        print(f'{state:<5} {i}. {key:<8} {desc}')
        for m in msgs: print(f'          {m}')
        print()
    if failed:
        print(f'STOP at stage "{failed}". FIX IT and run this again.')
        print('Do not render past a failing stage, and do not ask whether to continue - fix it.')
    else:
        print('All checkpoints that can run right now PASS.')
        print('Stage 6 (sheets) is not automatic: the sheets must actually be looked at.')
    return 1 if failed else 0


if __name__ == '__main__':
    sys.exit(main())
