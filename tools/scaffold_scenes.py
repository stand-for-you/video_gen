"""Print an EMPTY scene table with one line per narration unit (engine v0.5).
Usage (work folder):  python3 tools/scaffold_scenes.py long > story/scenes_long.py   (then fill in the sets)
Every spoken sentence gets its own line, with the sentence itself in a comment, so the picture can never drift away from the words.
Long sentences (over about 5 s) get more than one scene so the picture still changes at least every 2.7 s.
"""
import sys, json, math, re
NAME = sys.argv[1]
tm = json.load(open(f'audio/{NAME}/timing.json'))
GAP = 2.2 if NAME == 'reel' else 2.7
print(f"# Scene table for the {'REEL' if NAME == 'reel' else 'LONG'} video (engine v0.5, 3D).")
print("# ONE LIST PER SPOKEN SENTENCE, in order. The picture must show what the sentence says (SYNC LAW).")
print("# Each scene = S('<set>', **keys). Keys: fr = framing (wide | waist | bust | close | detail; never a face alone),")
print("#   cm = camera move override (push | pull | orbit | arc | crane | drop | truck | tilt | pan | vertigo | follow | dolly | hold),")
print("#   plus any key your set reads (who, expr, pose, part, ...).")
print("def S(st, **v): return (st, v)")
print("SC = [")
for u in tm['units']:
    d = u['end'] - u['start']; n = max(1, round(d / GAP))
    txt = re.sub(r'\s+', ' ', u['text']).replace('"', "'")
    print(f" # {u['i']:>3}  {d:4.1f}s  {n} shot(s)  [{u.get('who', 'nar')}]  {txt}")
    print(" [" + ', '.join(["S('SET', fr='wide', cm='push')"] * n) + "],")
print("]")
