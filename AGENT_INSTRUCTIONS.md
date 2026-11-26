# I Know You're Awake — instructions for the AI agent that finishes this video

**Read this whole file before you run anything.** It is written for another AI agent (Claude,
Gemini/Antigravity, or any coding agent with a terminal). Simple English. Hard words are
explained in brackets.

---

## 0. What you are holding

This is a **complete, working Scroll Kaos v0.5 project** for the story *I Know You're Awake*.
The story, the look, the rooms, the cameras, the characters, the cards, the thumbnails, the
subtitles and the upload text are **already written and already checked**. Every automatic
gate (a gate = a script that refuses to let bad work through) passes right now.

What is **NOT** done, because it needs a long machine run:

| Not done | Why | Roughly how long |
|---|---|---|
| the narration voice | needs the Kokoro voice model downloaded and run | 10–25 min |
| the final render | 15,756 frames of 3D at 1920×1080, plus the Reel | **2–6 hours** |
| thumbnails + upload .md | they are made from the render | 2 min |

**Your job is to run the build, LOOK at the preview pictures, fix anything that looks wrong,
and deliver 9 files.** Nothing else.

### The single most important rule

> **Never ask whether to continue. A failing check is an instruction to fix it and run again.**

The owner has said this directly. Do not stop to ask about blood limits, voices, cameras,
long render times, or which option to pick. Decide, do it, and list what you decided at the
end. The only time you stop is when a tool genuinely cannot run (no network for the voice
model, out of disk). A failing gate is **not** that case.

---

## 1. One command

```bash
cd i-know-youre-awake
bash setup.sh "$PWD"      # first time only: installs packages, voice model, fonts, browser
bash BUILD.sh             # everything else, in the right order
```

`BUILD.sh` stops once, on purpose, at **stage 6** and waits for you to look at the preview
pictures. That pause is the one part that cannot be automated (section 6 explains why).

If you would rather run it by hand, `BUILD.sh` is a short readable list of the exact
commands in the exact order.

---

## 2. The five rules the whole project is built around

These come from `references/quality-law.md`. The owner rejected an earlier version of **this
same story** made by another AI, and these five rules are exactly why.

1. **30 fps, and every shot moves.** The camera rig always breathes, even on a held shot. A
   truly frozen frame is a bug, not tension.
2. **THE ONE-USE LAW — a picture is used once, ever.** Not "almost never": **zero** repeats.
   A near-copy counts as a copy. Coming back to a *room* is fine; coming back to a *picture*
   is not — at least **two** of {camera position, who is in shot and where, the light, a
   prop's state} must change.
   *Status: this project has **240 pictures, 0 repeats**, and no Reel picture repeats a long
   video picture either. Verified by `tools/sigmap.py`.*
3. **Full bodies, not faces.** At least 50 % of shots show the body; face-only shots at most
   15 %. *Status: 97 % body, 3 % face.*
4. **THE ONE-CREATURE LAW — one story, one monster, one design.** The creature spec is
   written once in `story/cast.json` (key `entity`) and imported everywhere. Only a declared
   *state* (blood on its hands, head tilt) may change. *Status: 44 creature shots, 7 poses,
   full body from many angles, one design.*
5. **Readable rooms, and visible blood.** Five or more readable objects per room, two light
   sources, no near-black frames. Blood is shown clearly in bright red as **stains, drips and
   pools** — never an open wound, never a body being cut on screen. **This blood limit is
   already decided. Do not ask about it.**

---

## 3. What is in the box

```
story/                  the story itself — this is the part that is specific to this video
  bible.md              places, people, objects, the timeline, the twist
  creature.md           the monster, built word by word from the story's own sentences
  creature.json         the locked antagonist declaration
  cast.json             THE CAST DATABASE. A scene names a character by key, never re-types a look.
  cast_dsl.py           A('father', 'sit', ...) — resolves a character from cast.json
  script_long.py        the long narration, 68 beats, ~7:46, with 3 interactive choice beats
  script_reel.py        the Reel narration, ~2:53, ONE speaker
  scenes_long.py        175 scenes — every one a different picture
  scenes_reel.py        65 scenes — drawn separately, never cropped from the long video
  voices.py             which Kokoro voice each character uses, and the subtitle badge names
  hindi_long.txt        121 Hindi lines, one per narration unit (subs.py checks this exactly)
  upload.json           every word of the upload details
  sfx.json              six tiny non-musical sounds, placed from the narration text

src/kits/AwakeHouse.ts  THE NEW SET: bedroom, hall, bathroom. Written for this story.
src/Film.tsx            NEW: stitches title card + story + choice cards + end screen
src/ThumbsStory.tsx     the four thumbnails, built from real shots of the video
src/story.json          every word that appears on a card, and where the cards sit

tools/retime.py         NEW: stretches the pictures onto the measured voice
tools/aim.py            NEW: points each camera at what its shot is actually of
tools/cues.py           NEW: speaker-badged subtitles for the long video
tools/film.py           NEW: works out where the cards and end screen go
tools/sigmap.py         NEW: tells you WHICH bucket to change when a repeat is reported
tools/qa_shots.py       NEW: builds the preview lists from the real scene tables
tools/gate_shots.py     REWRITTEN for v0.5 (the old one is kept as gate_shots_v04.py)

qa/preview/*.png        preview pictures already rendered and already checked — your reference
references/             the channel law, copied in so you have it
```

---

## 4. Engine bugs that were found and fixed — please do not "fix" them back

The v0.5 engine was mid-build. These were real faults. Each one is fixed in this copy, with
a comment in the code saying why.

| File | What was wrong | Fix |
|---|---|---|
| `tools/mix.py` | music bed length used `frames / 10` — a leftover from the old 10 fps clock. At 30 fps the bed came out **3× too long** | uses the film length at 30 fps |
| `tools/render.sh` | rendered only the story body, so the delivered file had **no title, no choice cards and no end screen** | renders the stitched film (`src/Film.tsx`) |
| `tools/make_upload_md.py` | read `chapter_times`, a key nothing writes → crash | reads `src/chapters.json`, written by `tools/retime.py` from the real narration |
| `tools/gate_shots.py` | v0.4 only — crashed with `KeyError: 'set'` on a v0.5 shot file | rewritten for v0.5; old one kept as `gate_shots_v04.py` |
| `tools/lint_story.py` | could not import a v0.5 scene table (`No module named 'cast_dsl'`) | puts `story/` on the import path |
| `src/cues_long.json` | nothing ever wrote it, so the long video had **no subtitles at all** | `tools/cues.py` writes it |
| `AwakeHouse` hall | a wall was drawn across the stairwell, hiding the front door | the hall has no near wall; the front door and its street light are now visible |

**One thing is deliberately different from the channel's older rule.** Memory says "stories
over 6:00 must be split into Part 1 and Part 2". The v0.5 reference video is **8:11 as ONE
video with parts inside it**, and that is the format this project uses: one 8:45 video with
four parts and three choice cards. Flag it to the owner; do not split the file.

---

## 5. Known numbers (so you can tell if something drifted)

Run `python3 tools/gate_shots.py long` at any time. Right now it says:

```
PASS  picture changes per minute of the delivered file: 21.1   (need >= 20)
PASS  repeated pictures: 0                                     (need 0)
PASS  distinct cameras: 175 of 175
PASS  distinct cast+light+props: 175 of 175
PASS  neighbouring shots that may not read as a cut: 0
PASS  face-only shots: 3%           PASS  shots showing the body: 97%
PASS  POV hands on screen: 37%      PASS  undeclared held beats: 0
PASS  creature "entity" is seen: 44 shots, full body, many angles, 7 poses
```

Long film **8:45** (7:46 of story + 59 s end screen). Reel **2:39** before re-timing; after
`tools/retime.py` it lands near **2:55**. If the Reel comes out over 2:55, cut one beat from
`story/script_reel.py` and run steps 2–5 again — do not speed the voice up.

---

## 6. Stage 6: LOOK AT IT. This cannot be skipped or faked.

A computer check that says PASS on a broken video is worse than no check. So this stage is
your eyes. After `tools/qa_shots.py` and the two preview commands, open every PNG in
`qa/preview/` and answer these. **Any "yes" is a rebuild, not a note.**

1. Is any frame almost black, apart from the one planned dark beat?
2. Is the camera inside the bed, inside a wall, or inside the quilt?
3. Is anybody floating, sunk into the floor, or sitting on nothing?
4. Is the creature cut off at the frame edge, or so far away it reads as a stick?
5. Does the creature look like the same creature in every shot?
6. Is the writing on the wall readable in `06_bedroom_message`?
7. Is the blood bright red and clearly blood, not a red carpet?
8. Do two pictures look like the same picture?
9. Does a room have fewer than five things you can name in it?
10. Is a head cut off at the top of the frame?

**Reference pictures are already in `qa/preview/`.** They were rendered and checked while this
project was written, and these faults were found and fixed that way:

- the lying camera was **inside the pillow and quilt** → eye heights raised above the bedding
- an inked sphere seen **from inside** renders as a solid black screen → the under-the-blanket
  camera now sits behind the quilt humps, so the quilt is a silhouette in front of the lens
- a wall was **blocking the stairwell** → removed, and the front door is now lit down there
- the bathroom grout grid **moiréd across the mirror** → grid stops at splashback height
- the blood pool was a **red rectangle** → rebuilt from nine ragged overlapping marks
- some cameras had been nudged for uniqueness until they pointed at the ceiling or the quilt
  → `tools/aim.py` now points every camera at its own actors, and the lying POV is held to a
  pitch (up/down angle) of only −15°, 0° or +15°

**One shot is still weaker than the rest and you may improve it:** `b31_2` /
`c4_creature_doorway` — the creature in the doorway reads small behind the POV hands. If you
want it stronger, move the creature about a metre closer (`DOORWAY` in `story/scenes_long.py`)
or drop `hands=` from that one scene, then re-run steps 2–4.

---

## 7. If a gate fails

| It says | Do this |
|---|---|
| `REPEAT a <-> b (3/4 buckets)` | run `python3 tools/sigmap.py long`. It names the bucket to change. Change **two** of {camera, who is in it, the light, a prop state} — never just the framing tag |
| `shots per minute … < 20` | do **not** stretch shots. Split the longest scenes into two different pictures |
| `face-only shots … > 15%` | change some `framing='face'` to `'waist'` |
| `X has N seconds of narration and NO scene` | write a scene with that beat's id (`b41_3`) — never let a tool fill the gap, that is how a duplicate is born |
| `hindi_long.txt` assert fails | the narration was edited. Re-list the units and rewrite the Hindi 1-to-1: `python3 tools/tts.py long split` |
| a render part fails | delete just `renders/long_partN.mp4` and run `tools/render.sh` again — finished parts are never redone |

---

## 8. What to deliver — exactly 9 files, nothing more

From `final/`:

1. `I_Know_Youre_Awake_YouTube_1920x1080.mp4`
2. `I_Know_Youre_Awake_Reel_1080x1920.mp4`
3. `I_Know_Youre_Awake_English.srt`
4. `I_Know_Youre_Awake_Hindi.srt`
5. `I_Know_Youre_Awake_Thumb_A_1280x720.jpg`
6. `I_Know_Youre_Awake_Thumb_B_1280x720.jpg`
7. `I_Know_Youre_Awake_Thumb_C_1280x720.jpg`
8. `I_Know_Youre_Awake_Reel_Thumb_1080x1920.jpg`
9. `I_Know_Youre_Awake_Upload_Details.md`

**Never send** Hindi audio, zips, transcripts, voice files, preview PNGs or any extra file.

After the owner approves, record the video so the channel can never repeat a picture:

```bash
python3 tools/frame_ledger.py add    final/I_Know_Youre_Awake_YouTube_1920x1080.mp4 i-know-youre-awake
python3 tools/frame_ledger.py addsig src/shots_long.json i-know-youre-awake
```

---

## 9. What to say in your final message

Short and clear: the two lengths and loudness; the gate numbers for both files; the first
three spoken lines and the closing question quoted; the look kit used (`AwakeHouse` — the row
is already added to `references/kits-used.md`); what the Reel shortened; and these flags:

- **Story rights — UNVERIFIED.** The story was supplied as text found online with no author,
  no site and no date. The credit says "inspired by a story told online" and the author and
  publisher are marked UNVERIFIED. Tell the owner to find the original page before monetising.
- **Blood is shown** (bright red stains, a dragged smear, a pool) because the story has blood.
  No wound, no cutting on screen, nothing graphic. Settled rule, applied silently.
- **Softened:** every death happens off screen before the camera arrives. The pictures show
  only the result — the stains, the arrangement, the open mouths.
- **AI voices:** Kokoro text-to-speech. Three voices in the long video, **one** in the Reel
  (Instagram refuses to translate a Reel with more than one speaker).
- **Photosensitive safety:** no strobe, no flashing. The glitch moments are a brief colour
  split on single shots.
- **Part structure:** one video with four parts inside it, not two uploads (see section 4).
- **The pentagram** is drawn because the story describes it. It is a story prop.
