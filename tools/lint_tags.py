"""TAG LINTER - catches clipped and over-used callout labels WITHOUT rendering.

Why this exists: in "Gateway of the Mind" every single callout in the Reel was sliced off
by the right edge ("SENSES CUT" -> "SENS", "HIS DEAD WIFE" -> "HIS DE", "HE HITS THE WALL"
-> "HE"), and "SENSES CUT" was shown about ten times in one video. Both faults are pure
arithmetic on the numbers already written in SetsL.tsx / SetsR.tsx, so neither should ever
have reached a render.

The box geometry is copied from src/kits/Explain.tsx Tag():
    pad = size * 0.55
    iw  = 0 if icon none else size * 1.25
    tw  = len(text) * size * 0.66 + pad * 2 + iw
    th  = size * 1.6
    box spans [to.x, to.x + tw]   when the label sits right of the anchor (to.x >= at.x)
              [to.x - tw, to.x]   when it sits left
    vertically centred on to.y

Usage (work folder):
    python3 tools/lint_tags.py              # checks SetsL.tsx (1920x1080) and SetsR.tsx (1080x1920)
    python3 tools/lint_tags.py --margin 40  # required clear space from each edge (default 24 px)
Exit 1 if any label is clipped or any label text is over-used.
"""
import re, sys, os

FILES = [('src/SetsL.tsx', 1920, 1080), ('src/SetsR.tsx', 1080, 1920)]
MAX_USES = 3          # the same label text in one video; the reference fault showed one 10x
MARGIN = 24           # px of clear space required from every edge

NUM = r'-?\d+(?:\.\d+)?'


def attrs(frag):
    """pull the attributes we need out of one <Tag ... /> fragment"""
    out = {}
    m = re.search(r'\bat=\{\[\s*(' + NUM + r')\s*,\s*(' + NUM + r')\s*\]\}', frag)
    if m: out['at'] = (float(m.group(1)), float(m.group(2)))
    m = re.search(r'\bto=\{\[\s*(' + NUM + r')\s*,\s*(' + NUM + r')\s*\]\}', frag)
    if m: out['to'] = (float(m.group(1)), float(m.group(2)))
    m = re.search(r'\btext="([^"]*)"', frag)
    if m: out['text'] = m.group(1)
    m = re.search(r'\bquote="([^"]*)"', frag)
    if m: out['text'] = '"' + m.group(1).upper() + '"'
    m = re.search(r'\bsize=\{(' + NUM + r')\}', frag)
    out['size'] = float(m.group(1)) if m else 30.0
    out['icon'] = 'none'
    m = re.search(r'\bicon="(\w+)"', frag)
    if m: out['icon'] = m.group(1)
    if re.search(r'<SoundTag\b', frag): out['icon'] = 'wave'
    out['dynamic'] = bool(re.search(r'\btext=\{', frag) or re.search(r'\bquote=\{', frag))
    return out


def box(a):
    size = a['size']
    pad = size * 0.55
    iw = 0.0 if a['icon'] == 'none' else size * 1.25
    tw = len(a['text']) * size * 0.66 + pad * 2 + iw
    th = size * 1.6
    tox, toy = a['to']
    atx = a['at'][0]
    left = tox < atx
    x0 = tox - tw if left else tox
    return x0, toy - th / 2, x0 + tw, toy + th / 2


def lint(path, W, H, margin):
    if not os.path.exists(path):
        return 0, []
    src = open(path, encoding='utf-8').read()
    problems, uses, n = [], {}, 0
    for m in re.finditer(r'<(Tag|SoundTag)\b([^>]*?)/>', src, re.S):
        frag = m.group(0)
        line = src[:m.start()].count('\n') + 1
        a = attrs(frag)
        if a.get('dynamic') or 'text' not in a or 'to' not in a or 'at' not in a:
            problems.append((line, 'SKIP', 'label text or position is computed at runtime; check it by eye on the QA sheet'))
            continue
        n += 1
        uses[a['text']] = uses.get(a['text'], 0) + 1
        x0, y0, x1, y1 = box(a)
        if x1 > W - margin:
            problems.append((line, 'CLIPPED RIGHT', f'"{a["text"]}" box ends at x={x1:.0f} but the frame is {W} wide '
                                                    f'(over by {x1 - (W - margin):.0f} px) - move `to` left to x<={W - margin - (x1 - x0):.0f}'))
        if x0 < margin:
            problems.append((line, 'CLIPPED LEFT', f'"{a["text"]}" box starts at x={x0:.0f} (needs >= {margin})'))
        if y1 > H - margin:
            problems.append((line, 'CLIPPED BOTTOM', f'"{a["text"]}" box ends at y={y1:.0f} but the frame is {H} tall'))
        if y0 < margin:
            problems.append((line, 'CLIPPED TOP', f'"{a["text"]}" box starts at y={y0:.0f} (needs >= {margin})'))
        # the Reel burns captions near the bottom; a label there collides with them
        if H > W and y1 > H * 0.74:
            problems.append((line, 'HITS CAPTIONS', f'"{a["text"]}" sits at y={y1:.0f}; keep labels above y={H * 0.74:.0f} in 9:16'))
    for t, c in sorted(uses.items(), key=lambda kv: -kv[1]):
        if c > MAX_USES:
            problems.append((0, 'OVER-USED', f'"{t}" appears {c}x in {os.path.basename(path)} '
                                             f'(max {MAX_USES}) - a label repeated every shot stops meaning anything'))
    return n, problems


def main():
    margin = MARGIN
    if '--margin' in sys.argv:
        margin = float(sys.argv[sys.argv.index('--margin') + 1])
    bad = 0
    for path, W, H in FILES:
        n, problems = lint(path, W, H, margin)
        hard = [p for p in problems if p[1] != 'SKIP']
        tag = 'FAIL' if hard else 'PASS'
        print(f'{tag}  {path} ({W}x{H}): {n} fixed labels checked, {len(hard)} problem(s)')
        for line, kind, msg in problems:
            where = f'line {line}' if line else 'file'
            print(f'        {kind:<14} {where}: {msg}')
        if hard: bad = 1
    print('TAG LINT:', 'FAIL' if bad else 'PASS')
    return bad


if __name__ == '__main__':
    sys.exit(main())
