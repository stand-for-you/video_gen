"""STORY LINTER - the story folder holds THIS story, and nothing left over from another.

Two faults this exists for:
  1. The engine used to ship a complete worked story (Smile Dog) in the live slots, so a new
     video began as find-and-replace. Anything missed stayed on screen.
  2. In a delivered video, a child in a yellow dress labelled "WET FOOTPRINTS" and a figure in
     a green polo shirt appeared in a story about a sealed laboratory - assets from an earlier
     story that were never cleared.

Checks:
  A. no template left unfilled   (SCROLL KAOS TEMPLATE markers, empty BEATS)
  B. no example content leaking  (names from examples/ that this story never mentions)
  C. every set named by the scene table actually exists in SetsL/SetsR
  D. every [tag] used in the script has a voice in story/voices.py

Usage:  python3 tools/lint_story.py
Exit 1 on any finding.
"""
import os, re, sys, glob, importlib.util

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
# A v0.5 scene table imports its helpers from the story folder (scenes_dsl, cast_dsl), so the
# folder has to be importable before these files are loaded - otherwise every table reports
# "WILL NOT IMPORT" and the real findings are buried.
sys.path[:0] = [os.path.join(ROOT, 'story'), ROOT]
MARKER = 'SCROLL KAOS TEMPLATE'


def load(path, name):
    spec = importlib.util.spec_from_file_location(name, path)
    m = importlib.util.module_from_spec(spec)
    sys.modules[name] = m
    spec.loader.exec_module(m)
    return m


def decomment(src):
    """drop # comments, keeping the code. Comments describe the FORMAT (they mention [tag],
    character names from the example, and so on) and must never be linted as story content."""
    return '\n'.join(re.sub(r'#.*$', '', l) for l in src.splitlines())


def story_text():
    out = []
    for n in ('long', 'reel'):
        p = f'story/script_{n}.py'
        if os.path.exists(p):
            out.append(decomment(open(p, encoding='utf-8').read()))
    return '\n'.join(out).lower()


SET_DEF_RE = re.compile(r'^\s*(?:export\s+)?const\s+(\w+)\s*:\s*React\.FC', re.M)


def previous_story_sets():
    """Set names defined by the PREVIOUS story, kept as src/Sets*.tsx.prev by new_story.py.

    This is the leak that actually reached a delivered video: a child in a yellow dress
    labelled "WET FOOTPRINTS" and a figure in a green polo shirt appeared in a story about a
    sealed laboratory, because sets from an earlier story were still reachable and got used.

    Comparing the SCRIPT against the example's wording does not work - if the active story
    is the example, or simply shares a character name, it reports itself. Comparing the new
    scene table against the previous story's set names is exact and cannot false-fire.
    """
    names = set()
    for p in glob.glob('src/Sets*.tsx.prev'):
        names |= set(SET_DEF_RE.findall(open(p, encoding='utf-8', errors='replace').read()))
    return names


def main():
    problems = []

    # ---- A. templates must be filled in
    for p in sorted(glob.glob('story/*')):
        if os.path.isdir(p): continue
        txt = open(p, encoding='utf-8', errors='replace').read()
        if MARKER in txt:
            problems.append((p, 'TEMPLATE NOT FILLED', 'still carries the template marker'))
    for n in ('long', 'reel'):
        p = f'story/script_{n}.py'
        if not os.path.exists(p):
            problems.append((p, 'MISSING', 'run tools/new_story.py'))
            continue
        try:
            beats = load(p, f'_s{n}').BEATS
        except Exception as e:
            problems.append((p, 'WILL NOT IMPORT', str(e))); continue
        empty = sum(1 for b in beats if not str(b[1]).strip())
        if empty:
            problems.append((p, 'EMPTY BEATS', f'{empty} of {len(beats)} beats have no words'))
        if n == 'long' and beats and not str(beats[-1][1]).strip().endswith('?'):
            problems.append((p, 'NO CLOSING QUESTION', 'the last line must be the closing question'))

    # ---- B. nothing left over from the previous story
    old_sets = previous_story_sets()
    if old_sets:
        for n in ('long', 'reel'):
            p = f'story/scenes_{n}.py'
            if not os.path.exists(p): continue
            try:
                SC = load(p, f'_leak{n}').SC
            except Exception:
                continue
            used = {st for beat in SC for st, _ in beat}
            leaked = sorted(used & old_sets)
            if leaked:
                problems.append((p, 'PREVIOUS STORY LEAKED',
                                 'these sets belong to the previous story: ' + ', '.join(leaked[:10])
                                 + '. Draw this story\'s own sets, or delete src/Sets*.tsx.prev once you are sure.'))

    # ---- C. every set the scene table names must exist
    sets_src = ''
    for p in ('src/SetsL.tsx', 'src/SetsR.tsx'):
        if os.path.exists(p): sets_src += open(p, encoding='utf-8').read()
    for n in ('long', 'reel'):
        p = f'story/scenes_{n}.py'
        if not os.path.exists(p) or not sets_src: continue
        try:
            SC = load(p, f'_sc{n}').SC
        except Exception as e:
            problems.append((p, 'WILL NOT IMPORT', str(e))); continue
        used = {st for beat in SC for st, _ in beat}
        for st in sorted(used):
            if not re.search(r'\b' + re.escape(st) + r'\b', sets_src):
                problems.append((p, 'SET DOES NOT EXIST', f"scene table names '{st}' but no set by that name is defined"))

    # ---- D. every voice tag must have a voice
    if os.path.exists('story/script_long.py') and os.path.exists('story/voices.py'):
        try:
            tags = set(re.findall(r'\[(\w+)\]', decomment(open('story/script_long.py', encoding='utf-8').read())))
            have = set(load('story/voices.py', '_v').VOICES)
            for t in sorted(tags - have):
                problems.append(('story/voices.py', 'VOICE TAG HAS NO VOICE', f'[{t}] is spoken but has no entry'))
        except Exception as e:
            problems.append(('story/voices.py', 'WILL NOT IMPORT', str(e)))

    if problems:
        for p, kind, msg in problems:
            print(f'FAIL  {kind:<24} {p}: {msg}')
    print('STORY LINT:', 'FAIL' if problems else 'PASS')
    return 1 if problems else 0


if __name__ == '__main__':
    sys.exit(main())
