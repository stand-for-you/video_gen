"""SYNC CHECK (engine v0.5): does every picture match the words being spoken?
Usage (work folder):  python3 tools/sync_check.py long|reel        (run after build_shots.py)
Prints every spoken sentence with the shots that are on screen while it is spoken. READ IT and fix any line where the picture
does not show what the words say. It FAILS (exit 1) when a shot is still on screen after the next sentence has started,
or when a sentence has no shot of its own, because that is exactly how a video starts to feel 'out of sync'.
"""
import sys, json, re
NAME = sys.argv[1]
J = json.load(open(f'src/shots_{NAME}.json')); fps = J['fps']
tm = json.load(open(f'audio/{NAME}/timing.json')); units = tm['units']
bad = 0
for ui, u in enumerate(units):
    nxt = units[ui + 1]['start'] if ui + 1 < len(units) else 1e9
    sh = [s for s in J['shots'] if s.get('u') == u['i']]
    txt = re.sub(r'\s+', ' ', u['text'])
    print(f"{u['start']:7.2f}-{u['end']:7.2f}  {txt[:88]}")
    if not sh and u['i'] != len(units) - 1:
        print('        !! NO SHOT FOR THIS SENTENCE'); bad += 1
    for s in sh:
        if s['set'] in ('end', 'qcard', 'rqcard'):
            print(f"        {s['s'] / fps:7.2f}-{s['e'] / fps:7.2f}  {s['set']:<14} (card / end screen, not checked)"); continue
        a, b = s['s'] / fps, s['e'] / fps
        over = max(0.0, u['start'] - 0.2 - a) + max(0.0, b - nxt - 0.08)  # a shot may hold the picture until the next sentence starts
        flag = '  << spills into another sentence' if over > 0.25 else ''
        if flag: bad += 1
        print(f"        {a:7.2f}-{b:7.2f}  {s['set']:<14} {json.dumps(s['v'])[:60]}{flag}")
print('SYNC CHECK:', 'FAIL' if bad else 'PASS', f'({bad} problem(s))')
sys.exit(1 if bad else 0)
