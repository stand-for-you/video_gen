"""FRAME QA - build the review sheet and the checklist for the faults only EYES can judge.

HONEST NOTE ON WHY THIS IS NOT A PASS/FAIL GATE
-----------------------------------------------
This started as an automatic detector for "empty frame", "subject pushed off-frame" and
"head cut off at the top". It was tested against the broken Gateway of the Mind Reel and
it DOES NOT WORK: measured on that video, the centre edge-ink of known-bad empty-window
seconds (6.2-8.6) overlaps the known-good close-ups (7.2-12.9), and a warm-colour
character detector overlaps the same way. The window frame itself and the burned-in
captions carry as much edge detail as a person does.

A quality tool that returns PASS on a broken video is worse than no tool - that is exactly
how the repetitive video got shipped. So this builds the sheet and tells you what to look
for, and a human (or an agent that can see images) makes the call.

What IS checked mechanically lives elsewhere, and those checks are proven:
    tools/lint_tags.py      clipped and over-used callout labels   (arithmetic, exact)
    tools/quality_gate.py   repeated pictures, creature drift, framing mix
    tools/frame_ledger.py   pictures reused from earlier videos

Usage:
  python3 tools/frame_qa.py <video.mp4> [--every 6] [--out qa/sheet.jpg]
"""
import sys, os, subprocess, math

CHECKLIST = """
LOOK AT THE SHEET AND ANSWER EACH ONE. Any 'yes' is a rebuild.

BODIES AND RIGS
  1. Is any character lying down drawn as a STANDING rig tipped on its side?
     (the Gateway fault: the old man rotated 90 degrees, cane still in his hand,
      legs poking through the chamber wall, body flipping left/right between shots)
  2. Does anyone hold a prop that makes no sense for the scene (a walking cane in a
     surgical chamber)? Are they dressed for the scene (patient gown, not a cardigan)?
  3. In close-ups, are the arms attached, or do the sleeves float as separate blocks?
  4. Any doubled or offset outline around hair or a body (a misaligned halo layer)?
  5. Is anyone standing ON another character, or intersecting furniture?

FRAMING
  6. Is any head cut off by the TOP edge of the frame or by a window frame?
  7. In the 9:16 sheet: is the subject centred, or pushed to an edge with an empty
     middle? (never centre-crop a 16:9 composition - re-compose it)
  8. Any frame with no subject at all while the narration is carrying the story?

LABELS AND TEXT
  9. Is every callout fully inside the frame? (lint_tags.py proves this, but LOOK too)
 10. Does each pointer dot actually touch the thing it names, not empty space?
 11. Does any label or pointer sit on top of the burned-in captions?
 12. Does the same label appear over and over (it stops meaning anything)?

STORY TRUTH
 13. Does the picture show what the narrator is saying AT THAT MOMENT?
 14. Any asset from a DIFFERENT story (a character, prop or label that this story
     never mentions)? Check the end screen too.
 15. Does the creature/antagonist look identical in every shot it appears in?
 16. Do the chapter cards land on a clean background, not on top of a face?
"""


def main():
    if len(sys.argv) < 2:
        sys.exit('usage: python3 tools/frame_qa.py <video.mp4> [--every 6] [--out qa/sheet.jpg]')
    path = sys.argv[1]
    every = 6
    if '--every' in sys.argv: every = int(sys.argv[sys.argv.index('--every') + 1])
    out = 'qa/review_' + os.path.splitext(os.path.basename(path))[0] + '.jpg'
    if '--out' in sys.argv: out = sys.argv[sys.argv.index('--out') + 1]
    os.makedirs(os.path.dirname(out) or '.', exist_ok=True)

    probe = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0',
                            '-show_entries', 'stream=width,height:format=duration',
                            '-of', 'default=noprint_wrappers=1:nokey=1', path],
                           capture_output=True, text=True).stdout.split()
    W, H, dur = int(probe[0]), int(probe[1]), float(probe[2])
    n = max(1, int(dur // every))
    cols = 6 if W >= H else 8
    rows = math.ceil(n / cols)
    tile_w = 300 if W >= H else 170
    r = subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', path,
                        '-vf', f'fps=1/{every},scale={tile_w}:-1,tile={cols}x{rows}',
                        '-frames:v', '1', out], capture_output=True, text=True)
    if r.returncode:
        sys.exit('ffmpeg failed: ' + r.stderr[-400:])
    print(f'frame_qa: {os.path.basename(path)}  {W}x{H}  {dur:.0f}s')
    print(f'          sheet -> {out}   ({n} frames, 1 every {every}s, {cols}x{rows})')
    print(CHECKLIST)
    print('This tool does not pass or fail anything. LOOK at the sheet, answer the 16 questions,')
    print('and rebuild on any "yes". Mechanical checks: tools/lint_tags.py, tools/quality_gate.py.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
