"""WORD TIMES for the bold word-by-word subtitles (engine v0.5).
Usage (work folder):  python3 tools/words.py long   /   python3 tools/words.py reel     (run after tools/tts.py)
Reads audio/<name>/timing.json (one entry per spoken unit = sentence) and writes src/words_<name>.json:
  { "units": [ { "s": start_s, "e": end_s, "who": "nar", "words": [ { "w": "The", "s": 0.0, "e": 0.21 }, ... ] } ] }
HOW THE WORD TIMES ARE MADE (IMPORTANT, say it in the flags): Kokoro gives the start and end of each SENTENCE, not of each word.
Each word gets a share of its sentence by weight = letters + 1, plus extra weight for a comma (+2) or a full stop (+3), because a
voice slows down at punctuation. So the word times are ESTIMATED, not measured: they are usually within about 0.1 s, which is
close enough for highlighting, but they are UNVERIFIED. The sentence start and end themselves are exact.
"""
import sys, json, re, os
NAME = sys.argv[1]
tm = json.load(open(f'audio/{NAME}/timing.json'))
out = []
for u in tm['units']:
    text = re.sub(r'^\[\w+\]', '', u['text']).strip()
    ws = [w for w in text.split() if w]
    if not ws:
        continue
    wt = []
    for w in ws:
        k = len(re.sub(r'[^\w]', '', w)) + 1
        if w.endswith(','): k += 2
        if re.search(r'[.?!]"?$', w): k += 3
        wt.append(k)
    tot = sum(wt); t = u['start']; d = max(0.2, u['end'] - u['start']); words = []
    for w, k in zip(ws, wt):
        dd = d * k / tot
        words.append(dict(w=w, s=round(t, 3), e=round(t + dd, 3)))
        t += dd
    out.append(dict(s=round(u['start'], 3), e=round(u['end'], 3), who=u.get('who', 'nar'), i=u['i'], words=words))
json.dump(dict(fps=None, units=out), open(f'src/words_{NAME}.json', 'w'))
print(f'{NAME}: {len(out)} units, {sum(len(u["words"]) for u in out)} words (times estimated from sentence times, UNVERIFIED)')
