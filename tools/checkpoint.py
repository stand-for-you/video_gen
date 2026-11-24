"""CHECKPOINTS - prove the work is going the right way at every stage, not only at the end.

The Gateway of the Mind videos failed because nothing checked DIRECTION until a finished
file existed. By then the faults were: a lying-down character drawn as a tipped-over
standing rig, every Reel label sliced off, assets from a different story, the same six
shots looping for three minutes, and a narration that no longer matched the pictures.

Every one of those was visible long before the render. This runs the right check at the
right moment and refuses to let the work move on.

Usage (work folder):
    python3 tools/checkpoint.py            # run every stage that is ready, show the status board
    python3 tools/checkpoint.py <stage>    # run one stage
    python3 tools/checkpoint.py --list

Stages, in order:
    1 story    the script and the scene table exist and line up with the narration
    2 cast     the antagonist is declared and locked
    3 scenes   enough DIFFERENT scenes: no recycling, no duplicate pictures
    4 labels   every callout fits inside the frame and is not over-used
    5 shots    the built shot list passes the quality gate
    6 look     the review sheet is built and the 16 questions are answered BY EYE
    7 deliver  the rendered files pass the video gate and the cross-video frame ledger

Exit 1 if the earliest unfinished stage fails. Later stages are not run until the
earlier ones pass, so the first error you see is always the one to fix.
"""
import sys, os, subprocess, json, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
PY = sys.executable or 'python3'


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    return r.returncode, (r.stdout or '') + (r.stderr or '')


def have(p):
    return os.path.exists(p)


# ---------------------------------------------------------------- stages
def st_story():
    msgs, ok = [], True
    for n in ('long', 'reel'):
        if not have(f'story/script_{n}.py'):
            msgs.append(f'story/script_{n}.py missing'); ok = False; continue
        if not have(f'story/scenes_{n}.py'):
            msgs.append(f'story/scenes_{n}.py missing'); ok = False; continue
        if not have(f'audio/{n}/timing.json'):
            msgs.append(f'audio/{n}/timing.json missing - run tools/tts.py {n} first'); ok = False; continue
        msgs.append(f'{n}: script, scene table and narration timing all present')
    return ok, msgs


def st_cast():
    if have('story/creature.json'):
        try:
            d = json.load(open('story/creature.json'))
        except ValueError as e:
            return False, [f'story/creature.json is not valid JSON: {e}']
        if 'id' not in d:
            return False, ['story/creature.json has no "id"']
        v = d.get('variants') or []
        return True, [f'antagonist locked: "{d["id"]}"' + (f' + states {v}' if v else ''),
                      'every shot must use this design; states are not new designs']
    # no creature declared: fine only if the story truly has none
    return True, ['no story/creature.json - only correct if this story has NO monster or antagonist.',
                  'If it has one, copy story/creature.example.json and fill it in, or the design will drift.']


def st_scenes():
    ok, msgs = True, []
    for n in ('long', 'reel'):
        if not have(f'story/scenes_{n}.py'): continue
        c, out = run([PY, 'tools/build_shots.py', n])
        head = [l for l in out.strip().splitlines() if l.strip()][:14]
        msgs += [f'--- {n}'] + head
        if c: ok = False
    return ok, msgs


def st_labels():
    if not have('tools/lint_tags.py'):
        return True, ['tools/lint_tags.py missing (skipped)']
    c, out = run([PY, 'tools/lint_tags.py'])
    return c == 0, out.strip().splitlines()


def st_shots():
    ok, msgs = True, []
    for n in ('long', 'reel'):
        if not have(f'src/shots_{n}.json'): continue
        c, out = run([PY, 'tools/quality_gate.py', 'shots', n])
        msgs += [f'--- {n}'] + [l for l in out.strip().splitlines() if l.startswith(('PASS', 'FAIL', '      ', '        '))][:22]
        if c: ok = False
    return ok, msgs


def st_look():
    sheets = glob.glob('qa/review_*.jpg')
    fin = glob.glob('final/*.mp4')
    if not fin:
        return True, ['nothing rendered yet - this stage runs after the render']
    missing = [f for f in fin if not any(os.path.splitext(os.path.basename(f))[0] in s for s in sheets)]
    if missing:
        return False, ['review sheet not built for: ' + ', '.join(os.path.basename(m) for m in missing),
                       'run: python3 tools/frame_qa.py <file.mp4>',
                       'then LOOK at qa/review_*.jpg and answer all 16 questions.']
    return True, ['review sheets built: ' + ', '.join(os.path.basename(s) for s in sheets),
                  'THIS STAGE CANNOT BE AUTOMATED - a person or an agent that can see images must',
                  'answer the 16 questions in tools/frame_qa.py before the files are sent.']


def st_deliver():
    fin = glob.glob('final/*.mp4')
    if not fin:
        return True, ['nothing rendered yet']
    ok, msgs = True, []
    for f in sorted(fin):
        kind = 'reel' if '1080x1920' in f else 'long'
        c, out = run([PY, 'tools/quality_gate.py', 'video', f, kind])
        msgs += [f'--- {os.path.basename(f)}'] + [l for l in out.strip().splitlines() if l.startswith(('PASS', 'FAIL'))]
        if c: ok = False
        if have('tools/frame_ledger.py') and have('ledger/frames.json'):
            slug = os.path.splitext(os.path.basename(f))[0]
            c2, out2 = run([PY, 'tools/frame_ledger.py', 'check', f, slug])
            msgs += [l for l in out2.strip().splitlines() if l.startswith(('PASS', 'FAIL'))]
            if c2: ok = False
    return ok, msgs


STAGES = [('story', 'script + scene table + narration exist', st_story),
          ('cast', 'the antagonist is declared and locked', st_cast),
          ('scenes', 'enough DIFFERENT scenes; nothing recycled', st_scenes),
          ('labels', 'every callout fits the frame', st_labels),
          ('shots', 'the shot list passes the quality gate', st_shots),
          ('look', 'the review sheet is built and read BY EYE', st_look),
          ('deliver', 'rendered files pass the video gate + ledger', st_deliver)]


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
    print('=' * 72)
    print('CHECKPOINTS')
    print('=' * 72)
    for i, key, state, desc, msgs in board:
        print(f'{state:<5} {i}. {key:<8} {desc}')
        for m in msgs: print(f'          {m}')
        print()
    if failed:
        print(f'STOP at stage "{failed}". Fix it before going further - everything after it')
        print('depends on it, and rendering now would waste the time again.')
    else:
        print('All checkpoints that can run right now PASS.')
        print('Remember stage 6 (look) is not automatic: the sheet must actually be read.')
    return 1 if failed else 0


if __name__ == '__main__':
    sys.exit(main())
