"""FILM LAYOUT - where the cards and the end screen sit on the finished timeline.

WHY THIS EXISTS
v0.5 renders the story body (composition "Long") and the title card, the three choice screens
and the 5-stage end screen as SEPARATE compositions. Nothing stitched them together, so the
delivered file had no title, no choices and no end screen - which also made the upload .md's
end-screen instructions untrue. This writes the layout, src/Film.tsx draws it, and
tools/render.sh renders the stitched composition.

HOW A CARD KEEPS IN SYNC WITH THE VOICE
The narration is one continuous track: it starts at frame 0 and never pauses, so a card can
never be INSERTED without pushing the picture out of step with the words. Instead each card
is pinned to a scene that already exists, by id, and plays over that scene's own frames while
the narrator reads the question out. src/story.json names the scene (b15_1, b27_1, b56_1), so
re-timing the video with tools/retime.py moves the cards with it automatically.

Usage (work folder, after tools/build_shots.py):  python3 tools/film.py
Writes src/film.json.
"""
from __future__ import annotations
import json
import os
import sys

FPS = 30
END_FRAMES = {'A': 180, 'B': 390, 'C': 540, 'D': 120, 'E': 540}   # mirrors src/ui/EndScreen.tsx
END_TOTAL = sum(END_FRAMES.values())


def layout(kind: str, story: dict) -> dict:
    path = 'src/shots_%s.json' % kind
    if not os.path.exists(path):
        return {}
    data = json.load(open(path))
    by_id = {s['id']: s for s in data['shots']}
    cards = []
    for c in (story.get('cards', {}).get(kind) or []):
        sid = c['shot']
        if sid not in by_id:
            sys.exit('src/story.json names scene %r for a %s card, but no such scene exists '
                     'in %s - fix the id or the scene table' % (sid, c['kind'], path))
        sh = by_id[sid]
        dur = int(c.get('frames') or (sh['e'] - sh['s']))
        dur = min(dur, sh['e'] - sh['s'])
        out = {'kind': c['kind'], 'from': sh['s'], 'dur': dur, 'shot': sid}
        if c['kind'] == 'choice':
            out['part'] = c['part']
        cards.append(out)
    cards.sort(key=lambda c: c['from'])
    tail = 0
    end = 0
    if kind == 'long':
        end = END_TOTAL
    else:
        tail = int((story.get('reelTail') or {}).get('frames') or 0)
    return {
        'storyFrames': data['frames'],
        'endFrames': end,
        'tailFrames': tail,
        'filmFrames': data['frames'] + end + tail,
        'cards': cards,
    }


def main() -> int:
    story = json.load(open('src/story.json', encoding='utf-8'))
    out = {'fps': FPS}
    for kind in ('long', 'reel'):
        L = layout(kind, story)
        if L:
            out[kind] = L
    with open('src/film.json', 'w', encoding='utf-8') as f:
        json.dump(out, f, indent=1)
    for kind in ('long', 'reel'):
        if kind not in out:
            continue
        L = out[kind]
        print('%s: story %d frames (%.1fs) + end %d + tail %d = %d frames (%d:%02d)'
              % (kind, L['storyFrames'], L['storyFrames'] / FPS, L['endFrames'], L['tailFrames'],
                 L['filmFrames'], L['filmFrames'] / FPS // 60, L['filmFrames'] / FPS % 60))
        for c in L['cards']:
            t = c['from'] / FPS
            print('   %-6s over %-7s at %d:%02d for %.1fs'
                  % (c['kind'], c['shot'], t // 60, t % 60, c['dur'] / FPS))
    return 0


if __name__ == '__main__':
    sys.exit(main())
