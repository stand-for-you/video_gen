"""POSE LINTER - stops the "rotate a character instead of drawing the pose" bug class.

The fault it exists for, from "Gateway of the Mind":
    <g transform={`translate(${x},${y}) rotate(-90) scale(${k})`}>
      <CloseUp s={CAST.elias} ... />
    </g>
A man lying on a steel bed, drawn as a head-and-shoulders close-up tipped 90 degrees.
On screen it was a stiff statue on its side, still holding a walking cane in mid-air,
with parts poking through the chamber wall and the body flipping end-for-end between
shots. The engine's own 'lie' motion had the same shape (the standing idle rig + rot:-90).

THE RULE: when the script needs a pose the kit cannot draw, DRAW IT. Never rotate, crop
or substitute something else into the gap. For bodies on beds, tables or the floor use
src/kits/Lying.tsx LyingPerson, which uses the real 'supine' rig, strips props and seats
the body on the surface.

Checks:
  1. a person component wrapped in rotate(+-90) (or any rotation past 60 degrees)
  2. motion type 'lie' (superseded by 'supine' / 'supineDead')
  3. a CloseUp used with any whole-body rotation - a close-up has no body to lie down

Usage:  python3 tools/lint_poses.py [src/SetsL.tsx src/GW.tsx ...]
Default: every .tsx under src/. Exit 1 on any finding.
"""
import re, sys, os, glob

PEOPLE = (r'(?:FullPerson|FacePerson|BodyGen|CastSheet|FullMan|CloseUp|LyingPerson|Person'
          r'|GhostWoman|GhostGrin|GhostChild|Noah|Face)')
ALLOW = 'lint-ok: rotation'   # put this comment on the line to allow a deliberate rotation


def strip_comments(src):
    """blank out // and /* */ comments, keeping line numbers, so that example code inside a
    doc comment (this file's own header, for one) is never reported as a real fault"""
    out, i, n = [], 0, len(src)
    while i < n:
        if src.startswith('//', i):
            j = src.find('\n', i)
            j = n if j < 0 else j
            out.append(' ' * (j - i)); i = j
        elif src.startswith('/*', i):
            j = src.find('*/', i + 2)
            j = n if j < 0 else j + 2
            out.append(''.join(c if c == '\n' else ' ' for c in src[i:j])); i = j
        else:
            out.append(src[i]); i += 1
    return ''.join(out)


def find_blocks(src):
    """yield (line_no, transform_string, following_text) for every rotate(...) transform"""
    for m in re.finditer(r'transform=(?:\{`|")([^`"]*rotate\(\s*(-?\d+(?:\.\d+)?)[^`"]*)(?:`\}|")', src):
        yield src[:m.start()].count('\n') + 1, m.group(1), float(m.group(2)), src[m.end():m.end() + 420]


def lint(path):
    raw = open(path, encoding='utf-8').read()
    src = strip_comments(raw)
    lines = raw.splitlines()
    out = []

    for ln, tf, deg, after in find_blocks(src):
        if abs(deg) < 60:
            continue
        # the allow marker may sit on the line itself or in a comment just above it
        window = lines[max(0, ln - 5):ln]
        if any(ALLOW in w for w in window):
            continue
        who = re.search(PEOPLE, after)
        if not who:
            continue
        kind = 'ROTATED CLOSE-UP' if who.group(0) == 'CloseUp' else 'ROTATED PERSON'
        out.append((ln, kind,
                    f'<{who.group(0)}> is wrapped in rotate({deg:g}). A tipped standing figure is not a '
                    f'lying one. Use LyingPerson from src/kits/Lying.tsx (motion "supine").'))

    for m in re.finditer(r"type:\s*'lie'", src):
        ln = src[:m.start()].count('\n') + 1
        out.append((ln, 'OLD LIE MOTION',
                    "motion type 'lie' is the standing rig tipped over (arms out, props still held, "
                    "flips with the facing). Use 'supine' or 'supineDead'."))
    return out


def main():
    paths = [a for a in sys.argv[1:] if not a.startswith('-')]
    if not paths:
        paths = sorted(glob.glob('src/**/*.tsx', recursive=True))
    bad, checked = 0, 0
    for p in paths:
        if not os.path.exists(p):
            continue
        checked += 1
        found = lint(p)
        if found:
            bad = 1
            print(f'FAIL  {p}')
            for ln, kind, msg in found:
                print(f'        {kind:<18} line {ln}: {msg}')
    print(f'{"FAIL" if bad else "PASS"}  pose lint: {checked} file(s) checked')
    if bad:
        print('      A deliberate rotation (a painting on its side, a falling object) is allowed:')
        print(f'      put the comment "{ALLOW}" on that line.')
    print('POSE LINT:', 'FAIL' if bad else 'PASS')
    return bad


if __name__ == '__main__':
    sys.exit(main())
