# Pipeline: exact steps, file formats and lessons learned

All commands run from the WORK folder (made by `bash <engine>/setup.sh <work folder>`). The engine needs 2 CPU cores, Node, Python 3, ffmpeg and about 1.5 GB of disk. A 12-minute long video + Reel takes roughly 1.5-2 hours of rendering on 2 cores; that is normal. Quality first, never cut steps to save time.

## Folder contract (work folder)
```
story/script_long.py   BEATS for the long video (+ QUESTION, optional TEASER_LAST_BEAT, END_SCREEN_S)
story/script_reel.py   BEATS for the Reel (narrator only)
story/scenes_long.py   SC: one list of scenes per long beat (same count as BEATS)
story/scenes_reel.py   SC for the Reel
story/voices.py        VOICES / PITCH / SAY (character voices are used in the long video only)
story/sfx.json         optional tiny sound effects
story/hindi_long.txt   one natural Hindi line per long narration UNIT (same count, same order)
story/upload.json      story text for the upload .md (tools/make_upload_md.py builds the fixed format)
src/<Kit>.tsx          this story's props, creature and new cast Spec (example: SD.tsx)
src/SetsL.tsx          16:9 sets: export SETS = { name: React.FC<{f, v}> }  (canvas 1920x1080)
src/SetsR.tsx          9:16 sets, drawn again (canvas 1080x1920). Must NOT import SetsL.tsx
src/Card.tsx           chapter card (new ornament per kit)
src/camera.ts          main camera habit (push | pull | truck | rise | still)
src/ThumbsStory.tsx    ThumbA, ThumbB, ThumbC, ThumbR
src/gal.json, galr.json  lists of [set, variant] for set galleries (QA before shots exist)
```
The engine ships with the complete Smile Dog story in these slots as a worked example. Replace every story slot for a new story; never edit the core files (Kit, Body, Faces, Cast, Room, Thumbs, Post, Player, Root, Gal, GalR) unless fixing a real bug.

## Script format (story/script_long.py)
```python
BEATS = [
  ("Intro", "Teaser sentence one. Teaser sentence two. [dog]\"Spread the word.\""),   # beat 0: first chapter MUST be "Intro"
  (None, "More teaser... What did it want from her? Let us go back to the beginning."),
  ("The Locked Door", "First real event..."),                                       # a string = a new chapter starts here
  (None, "..."),
  (None, "This story was inspired by <title>, as published on <site>."),             # credit, after 0:45 / near the end
  (None, "Now tell me. Would you have opened smile.jpg?"),                         # LAST beat = closing question
]
QUESTION = "Would you have opened smile.jpg?"
TEASER_LAST_BEAT = 2      # beats 0..2 are the teaser (cuts every <= 2.2 s)
END_SCREEN_S = 20         # long video only
```
- A beat is about 25-50 words (about 10-20 s). The builder makes round(seconds / 2.7) shots per beat (teaser: / 2.2).
- Units are split at . ? ! (not after a single capital letter, so "Mary E." stays whole). A quoted line is its own unit.
- `[tag]"quoted line"` = character voice (tag must exist in voices.py). Reel: write no tags (they are ignored anyway).
- Numbers and years are written as words ("nineteen ninety-two") so the voice reads them well. Tricky words go in SAY.
- The Reel script (2:40-2:55) keeps every main beat and the twist, starts with its own 15-20 s teaser + "Let us go back to the beginning.", ends with the short credit and the closing question.

## Scene table format (story/scenes_long.py)
```python
def S(st, **v): return (st, v)
SC = [
 [S('photo', dream=True, fc=[1080, 360, 2.2]), S('marybed', dream=True, fc=[660, 520, 2.0]), S('hand', x=760, rot=60)],   # beat 0
 [S('dogface', fc=[960, 720, 1.7]), S('dogface', talk=True, k=1.3, y=600, last=True)],                                     # beat 1
 ...
 [S('qcard', credit=True)],   # credit beat: one still card
 [S('end')],                  # last beat of the LONG video: the end screen (20 s)
]
```
- `fc=[x, y, zoom]` = the close-up focus used when the scene is shown a second time in the beat. Pick the face or key prop.
- `last=True` = always the final shot of its beat (cut lines like a CRT turning off, a talking creature).
- Give each beat at least half as many scenes as it has shots (4-5 scenes for 18 s beats). The builder warns otherwise.
- Every [set, variant] must be unique across beats (the builder prints DUP); vary position, expression, mode, screen, darkness.
- Beat 0 scene 0 = the creepiest picture (first frame rule).
- Reel table: the same idea with SetsR names and 1080x1920 coordinates; the Reel shows each scene's close-up right after its wide shot. Keep Reel close-up focus points at about y 600-900 so the zoomed face or prop stays above the burned-in captions (around y 1450).

## Steps
1. Setup (once per story): `bash <engine>/setup.sh ~/scroll-kaos/<story-slug>`; prints the installed Kokoro voices. Use only voices from that list.
2. Write story files (bible + kit + scripts + voices + scene maps). Write src/<Kit>.tsx, SetsL.tsx, SetsR.tsx, Card.tsx, camera.ts.
3. Voice: `python3 tools/tts.py long` then `python3 tools/tts.py reel` (run in the background for long scripts: about 3 s of work per unit; it caches by text, so changing one line re-makes only that line). Check `audio/reel/timing.json` duration: 160-175 s; if outside, edit script_reel.py and run again.
4. Galleries first: put every set with typical variants in src/gal.json and src/galr.json, run `bash tools/qa_sheets.sh gal` and `bash tools/qa_sheets.sh galr`, LOOK at every sheet, fix the art (cut-off hands, floating heads, empty frames, people standing on furniture, doubled shapes) and repeat.
5. Shots: `python3 tools/build_shots.py long` and `python3 tools/build_shots.py reel`. Fix every WARN and DUP. Check the printout: screens/min >= 20, teaser max <= 2.5 s.
6. Shot QA: `bash tools/qa_sheets.sh long` and `bash tools/qa_sheets.sh reel`; look at EVERY sheet. Typical fixes: wrong screen content for the moment (e.g. the inbox shows the wrong sender), an expression that reads wrong ('speak' on cast faces looks like a smile, so use 'fear' or 'neutral' for sad moments), close-ups that focus on nothing (move fc).
7. Sound: `python3 tools/mix.py long && python3 tools/mix.py reel` (the printout must show music about -25 dB vs voice in gaps), then `python3 tools/loud.py long && python3 tools/loud.py reel`.
8. Subtitles: write story/hindi_long.txt (one line per unit; list units with `python3 -c "import json;[print(i,u['text']) for i,u in enumerate(json.load(open('audio/long/timing.json'))['units'])]"`), then `python3 tools/subs.py long && python3 tools/subs.py reel`.
9. Thumbnails: write src/ThumbsStory.tsx, run `bash tools/thumbs.sh <File_Prefix>`, LOOK at qa/thumbs_sheet.jpg (moon visible, face huge, title readable at phone size, nothing like a black band across the picture). Fix and repeat.
10. Render: `bash tools/render.sh <File_Prefix> all` in the background (long jobs: check `renders/log_part*.txt`). The long video renders in 4 resumable parts.
11. Upload .md: fill story/upload.json (fields in references/upload-md-guide.md), run `python3 tools/make_upload_md.py <File_Prefix>` (writes final/<File_Prefix>_Upload_Details.md in the approved gold format), read it once.
12. Final QA: `bash tools/qa_final.sh` (sizes < 400 MiB, exact resolutions, LUFS about -16 / -14, encoded Peak at or below -1 dBFS, srt UTF-8 + CRLF + no BOM, cue counts), then pull sample frames (first frame, a chapter card, a mid scene, the end screen) with ffmpeg and LOOK at them.
13. Send exactly the 9 files from final/ with SendUserFile.

## Changing something late
- One narration line changed after rendering: re-run tts (only that unit is redone), build_shots, and compare the new src/shots_long.json with the old one; parts whose shots did not change keep their renders; delete only the affected `renders/long_partN.mp4` files, then re-run mix, loud, subs and render.sh.
- Art fix after rendering: delete the affected part files (or renders/reel_raw.mp4) and run render.sh again.

## Lessons learned (do not repeat these mistakes)
- AAC encoding pushed peaks to +2.4 / +3.5 dBFS although the WAV was at -1.5 dBTP. render.sh now runs tools/safe_audio.py; always check the encoded Peak in qa_final.sh.
- The question beat ("Now tell me. Would you have opened ...?") is longer than 3 s; build_shots starts the end screen at max(question start, question end - 3 s) so narration ends inside its first 3 s.
- FacePerson (cast) draws no hair: close-ups must use HairBack + FacePerson + HairFront + Shoulders (the Face helper in SD.tsx does this).
- Wide Beckon/Hand sleeves (sleeveLen 900) make a long black band across thumbnails; keep them out of thumbnails or off to the edge.
- A blurred shadow copy of a figure needs a blur filter; without it it reads as a ghost double.
- Do not use `pkill -f` with a pattern that matches your own command line. One heavy job at a time on 2 cores.
- A placeholder file `renders/long_partN.mp4` makes the part loop skip that part (useful to re-render one part from a new bundle).
- Network: npm, PyPI, GitHub, Hugging Face, Wikimedia, Openverse, Internet Archive and Unsplash usually work; Pexels and Pixabay are blocked.
