"""Cloud compile PLAN (runs first in GitHub Actions; also works on your own computer).
Reads the work folder in this repo and prints the GitHub Actions outputs:
  prefix=<file prefix>   target=<all|long|reel|thumbs>   matrix=<JSON list of render parts>   engine=<v04|legacy>
Each matrix entry = one runner that renders one frame range of one composition into renders/<file>.
The part names and ranges match tools/render.sh exactly, so the assemble job's render.sh finds every part and only joins + encodes.
  v0.4 work folder (has engine.json): long = P parts (P = engine.json "parts", raised for long videos up to 16; written back by
       ci/prepare.sh in every job so render.sh uses the same P), reel = ceil(P / 2) parts.
  legacy work folder (no engine.json, 10 fps engine): long = 4 parts, reel = 1 part (renders/reel_raw.mp4).
Inputs (environment): IN_PREFIX (optional), IN_TARGET (optional, default all).
File prefix when IN_PREFIX is empty: the title in story/upload.json with spaces as _ (same rule as before),
then story/prefix.txt, then Scroll_Kaos_Video."""
import json, math, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

def frames(name):
    d = json.load(open(f'src/shots_{name}.json'))
    return int(d.get('frames') or d.get('total_frames'))

def prefix():
    p = (os.environ.get('IN_PREFIX') or '').strip()
    if not p and os.path.exists('story/upload.json'):
        title = str(json.load(open('story/upload.json', encoding='utf-8')).get('title') or '')
        p = re.sub(r'[^A-Za-z0-9_-]', '', title.strip().replace(' ', '_'))[:80]
    if not p and os.path.exists('story/prefix.txt'):
        p = open('story/prefix.txt').read().strip()
    if not p:
        p = 'Scroll_Kaos_Video'
    if not re.fullmatch(r'[A-Za-z0-9_-]{1,80}', p):
        sys.exit(f'bad file prefix {p!r}: use only letters, numbers, _ and - (example: I_Know_Youre_Awake)')
    return p

def plan():
    target = (os.environ.get('IN_TARGET') or 'all').strip() or 'all'
    if target not in ('all', 'long', 'reel', 'thumbs'):
        sys.exit(f'bad target {target!r}')
    v04 = os.path.exists('engine.json')
    m = []
    if v04:
        cfg = json.load(open('engine.json'))
        fps = int(cfg.get('fps', 30))
        nl = frames('long')
        # about 45 s of video per runner, at least the engine's own value, at most 16 (free plan = 20 jobs at once)
        P = max(int(cfg.get('parts', 10)), min(96, math.ceil(nl / (30 * fps))))
        flags = f"--scale={cfg.get('scale', 1.0)} --crf=14 --muted --gl=swiftshader --timeout=240000 --log=error"
        if target in ('all', 'long'):
            step = (nl + P - 1) // P
            for i in range(P):
                a, b = i * step, min(nl - 1, (i + 1) * step - 1)
                if a < nl: m.append(dict(comp='Long', i=i, a=a, b=b, file=f'long_part{i}.mp4', parts=P, flags=flags))
        if target in ('all', 'reel'):
            nr = frames('reel'); RP = (P + 1) // 2; step = (nr + RP - 1) // RP
            for i in range(RP):
                a, b = i * step, min(nr - 1, (i + 1) * step - 1)
                if a < nr: m.append(dict(comp='Reel', i=i, a=a, b=b, file=f'reel_part{i}.mp4', parts=P, flags=flags))
    else:
        flags = '--scale=0.6 --crf=22 --muted --gl=swiftshader --timeout=240000 --log=error'
        if target in ('all', 'long'):
            nl = frames('long'); step = (nl + 3) // 4
            for i in range(4):
                a, b = i * step, min(nl - 1, (i + 1) * step - 1)
                m.append(dict(comp='Long', i=i, a=a, b=b, file=f'long_part{i}.mp4', parts=4, flags=flags))
        if target in ('all', 'reel'):
            nr = frames('reel')
            m.append(dict(comp='Reel', i=0, a=0, b=nr - 1, file='reel_raw.mp4', parts=1, flags=flags))
    return target, ('v04' if v04 else 'legacy'), m

if __name__ == '__main__':
    t, eng, m = plan()
    print(f'prefix={prefix()}')
    print(f'target={t}')
    print(f'engine={eng}')
    print(f'matrix={json.dumps(m, separators=(",", ":"))}')
    if '--show' in sys.argv:
        for x in m: print(f"  {x['comp']:4} part {x['i']:2}: frames {x['a']}-{x['b']} -> renders/{x['file']}", file=sys.stderr)
