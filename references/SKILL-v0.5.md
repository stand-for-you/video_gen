---
name: 3d-video-making
description: Makes a finished 3D horror video set from a story text or a video - a 1920x1080 YouTube video with the 5-stage end screen, a separately drawn 1080x1920 Reel with burned-in captions, English and Hindi .srt, three A/B thumbnails, one Reel thumbnail and one upload-details .md - in the first-person POV 3D cel-shaded "What would you do?" style, using the bundled Remotion + three.js + Kokoro engine and the v0.5 quality law (30 fps, first person throughout, no repeated pictures, one creature, readable rooms, visible blood). Use when the user says /3d-video-making, "3D video making", "make 3D video", "make this story into a 3D video", or "reel only".
---

# 3D Video Maker (v0.5 - first-person POV 3D)

Turn the user's story (text, file or video) into the exact Scroll Kaos deliverable set. Work fully automatically: ask NO questions, decide alone, flag problems at the end. Quality first: long render time is normal; never cut quality to save time.

## NEVER STOP TO ASK. THESE ARE ALREADY DECIDED.

Stopping in the middle to ask a question is itself a failure. The user has said so directly. Every decision below is **settled** — apply it silently and list what you did in the **flags** at the end. The only time you stop is when a tool genuinely cannot run (no story text at all, no network for the model download).

| Question you might want to ask | The standing answer — use it, do not ask |
|---|---|
| Is this blood limit OK? | Yes. Bright red stains, drips and pools. Never an open wound, cutting on screen, or organs. |
| How should I soften self-harm (biting, clawing, begging to die)? | Keep the fear and the aftermath, move the act off-screen. Show the result (a red stain, a bandage, restraints, a person holding their arm), never the act. Same for suicide method: never show or name a method. |
| The story has no author or site — what is the credit? | Write "inspired by a story told online" and mark the credit **UNVERIFIED** in the flags. Never invent a title, author, site or date. |
| Can I use this reference image? | Use any image as a **style guide only** — palette, light, shape language. Never copy a real person, a real photo, a mask of a real face, a logo, or a famous character. If an image looks like a real person, take only the lighting and colour from it and design the face fresh. No permission question is needed for that. |
| This job is long — shall I continue? | Yes. Always. Hours of rendering is the normal cost. Start it and keep going. |
| Which cast / kit / voice / camera should I use? | You choose. The variety rules in quality-law.md decide it, not the user. |
| Should I send the files now even though a check failed? | No. Fix it and rebuild. Never ask for permission to send a failing video. |

If a genuinely new question appears that is not in this table, **still do not stop**: pick the safest option that satisfies the quality law and the channel policy, do the work, and put the decision in the flags at the end so the user can correct it next time.

### This includes the END of your message
Do not finish with "Should I continue?", "Shall I proceed?", "I can keep going — tell me", "I'll check in with you before rendering", or any other request for permission. There is no check-in at the thumbnails, no check-in at the draft, and no check-in before the render. **Finding a fault is an instruction to fix it, not a reason to report and wait.**

The run ends in exactly one of two ways:

1. **The deliverables are made and sent**, with the flags listed. This is the normal ending.
2. **A tool genuinely cannot run** (no story text at all, the model download is blocked, the machine is out of disk). Say exactly what failed, what you tried, and stop. A failing quality check is NOT this case — fix it and rebuild.

If the work is long, keep working. If a check fails, fix it and run it again. If a drawing is wrong, redraw it. Only the two endings above exist.

Reply to the user in simple English, explain hard words in (brackets), bold key terms, medium-plus length. Mark anything you could not verify with UNVERIFIED. Never send the user's email to outside services.

## BUILD IN THIS ORDER. IT IS NOT NEGOTIABLE.
**Environment -> scenes -> characters.** Build and LOOK at the sets first, then lay out the
shots, then put people in them. Building a character before there is a room to stand in is
how a figure ends up floating, mis-scaled, or inside a wall - every one of those faults was
found that way while v0.5 was built, and they are listed in `references/pov3d-style.md`
section 8 so they are not found again.

`tools/preview/shot_preview.mjs` renders any kit + camera + cast to a PNG in headless WebGL in
about a second, with the same materials and the same rig the finished video uses. Use it at
every stage. A fault found there costs a second; the same fault found after a render costs
25 minutes.

```bash
node tools/preview/shot_preview.mjs qa/env_shots.json qa/preview
```

## The look
Read `references/pov3d-style.md` BEFORE drawing anything. It holds the measured palette,
type sizes, pacing numbers, the creature blueprint and the subtitle rules, all taken off the
reference video rather than from memory. The short version:

- **100 % first person.** Every narrative shot is the eyes of ONE protagonist. The only
  exception in the whole video is the epilogue roll in end-screen stage C, which is why
  `drift_wide` is the only camera the shot builder refuses inside the story body.
- **The hands are the format.** The protagonist's sleeves and hands enter the lens in about a
  third of shots. `build_shots.py` warns below 25 %.
- **Real 3D, drawn to look inked.** Flat 2-3 step toon fill, a pixel-width ink shell, and a
  seeded turbulence warp over the whole frame that makes the line wobble like a drawn one.
  The warp steps on twos - 15 drawn frames a second.
- **30 fps.** v0.4 shipped 10 fps while its own law said 30. That is fixed; do not reopen it.

## The quality law comes first
Read `references/quality-law.md` BEFORE planning. It is the user's standard, written from the videos they rated best (the flight story, the monster short, the "1st (2)" long video) and the one they rejected ("I Know You're Awake"). In short:

1. **Smooth.** 30 fps. Every shot moves (camera plus a moving thing). No freeze over 2.5 s unless planned.
2. **THE ONE-USE LAW: a picture is used ONCE, ever.** Zero repeats inside a video, and no picture may repeat one from an earlier video on the channel. A near-copy counts as a copy. Returning to a room is fine; returning to a *picture* is not — change at least two of {camera position, who is in shot and where, the light, a prop's state}. Never let a tool fill a gap by recycling a scene: if a sentence needs four shots, **write four scenes**. (quality-law.md section 6)
3. **Full bodies and waist-up.** At least 50 % of shots show the body. Face-only close-ups at most 15 %.
4. **THE ONE-CREATURE LAW: one story, one antagonist, one design, never drifting.** Build the creature from `story/creature.md` word by word, write the spec **once**, and import that one spec everywhere — never re-type its numbers inside a set. The only allowed difference between shots is a **declared state** (alive/burnt, dry/soaked, dressed/bare); a different design is a different monster and is a failure. Show it in at least 6 shots, full body from two angles, moving. The thumbnail creature is the same creature. (quality-law.md section 7)
5. **Readable rooms.** At least 5 readable objects per room; blankets and sheets have folds and texture; no near-black shots except a planned dark moment.
6. **Blood is shown clearly** when the story has blood (bright red stains, drips, pools), never as an open wound or a body being cut on screen. This limit is already decided — never ask about it.

The gate script `engine/tools/quality_gate.py` measures rules 1 and 2 on the finished files. Passing the gate is required but not enough: the contact sheets must also pass rules 3 to 6.

## Where things are
- `engine/` (next to this SKILL.md) = the complete working project: the character template and art library (Remotion, React SVG), voice (Kokoro-onnx), shot builder, sound mix, loudness, subtitles, safe audio, render, thumbnails and QA scripts, plus the quality gate. **It ships with NO story of its own** — `tools/new_story.py` writes clean templates for whatever story you are given.
- `engine/examples/smile-dog/` = one fully worked story, kept out of the build. **Read it to learn the file formats. Never copy it into a new story.**
- `engine/tools/lint_story.py` = proves the story folder holds THIS story and nothing left over.
- `engine/tools/selftest.py` = proves the engine's own rules still agree with each other (fps, speaker colours, the one-use buckets, every kit/preset/hand pose the scene DSL offers really exists, the font ships on disk). Run it after ANY change to the look or the schema.
- `engine/tools/shotsig.py` = the one-use law as arithmetic. `tools/preview/shot_preview.mjs` = headless WebGL preview of any set, camera and cast in about a second.
- `engine/tools/checkpoint.py` = the staged board (run this constantly). `gate_shots.py` = every repeat/pacing fault visible before rendering, with timestamps. `lint_poses.py` = no character rotated in place of a drawn pose. `frame_qa.py` = builds the review sheet and prints the 16 look questions. `frame_ledger.py` = the one-use law ACROSS videos (`check` before delivery, `add` after approval).
- `references/pov3d-style.md` = THE LOOK, measured off the reference video: palette, type, pacing, creature blueprint, subtitle rules, and the eight faults found while building v0.5. **Read it first.**
- `references/one-use-law.md` = how the no-repeat rule is enforced and how to fix a flagged repeat properly.
- `references/voice-cast.md` = the voice cast and the measurements behind it.
- `references/character-style.md` = what the plugin's character style IS (stylized toon 3D) and exactly where it differs from a photoreal reference. Read before promising a look.
- `engine/story/cast.json` = the LOCKED character database: 13 characters, ten required fields each. A scene names a character by key and never re-types a look.
- `references/character-bible.md` = the house cast and the antagonist blueprint, with the silhouette rule and the seven faults found while drawing them. Render the whole roster with `node tools/preview/shot_preview.mjs qa/cast_sheet.json qa/sheet`.
- `references/quality-law.md` = the standard with measured reference numbers.
- `references/channel-policy.md` = ALL channel rules (deliverables, hook, cast, variety, sound, two videos, thumbnails, the .md, A/B test, pinned comment, community posts, safety, final self-check). It wins over anything else here except where it conflicts with quality-law.md 4d (blood), where 4d wins — do not ask, just flag it at the end.
- `references/pipeline.md` = exact commands, file formats (BEATS, scene tables, voices, sfx) and lessons learned.
- `references/art-library.md` = every component the engine can already draw and how to write a new kit.
- `references/kits-used.md` = look kits already used (the new video must differ from the most recent ones).
- `references/upload-details-gold.md` = the upload .md the user approved as PERFECT. `references/upload-md-guide.md` explains how to fill `story/upload.json` and run `tools/make_upload_md.py`.

## Deliverables (nothing more, nothing less)
1. `<Prefix>_YouTube_1920x1080.mp4` 2. `<Prefix>_Reel_1080x1920.mp4` 3. `<Prefix>_English.srt` 4. `<Prefix>_Hindi.srt` 5-7. `<Prefix>_Thumb_A/B/C_1280x720.jpg` 8. `<Prefix>_Reel_Thumb_1080x1920.jpg` 9. `<Prefix>_Upload_Details.md`.
"Reel only": the Reel, the Reel thumbnail, both .srt and the .md only. Never send Hindi audio, zips, transcripts, voice files or any extra file.

## Check the direction at every stage
Run `python3 tools/checkpoint.py` after each stage of the workflow below — not only at the end. It stops at the first failing stage. Stages 1-5 need no render and take a second; a fault found there costs seconds, the same fault found after a render costs 25 minutes.

Stage 6 ("look") is **not automatic**: `tools/frame_qa.py` builds a review sheet and prints 16 questions about bodies, framing, labels and story truth. LOOK at the sheet and answer them. Any "yes" is a rebuild. Never claim this stage passed without actually viewing the images. See `references/quality-law.md` section 9 and `docs/bug-catalogue.md` (in the engine repo) for every fault that has been found before and what catches it.

**The rule behind most past failures:** a pose or composition that was never drawn, so something else was reused in its place — a lying patient drawn as a standing rig tipped sideways, a 9:16 shot made by cropping a 16:9 one, an empty beat filled with an empty room. When the script needs something the kit cannot draw, **draw it**; never rotate, crop or substitute to fill the gap.

## Workflow
Create a task list with these stages and tick them off. Tell the user in one line what is
being made, then start.

1. **Read and check the source.** Read the whole story. If a video is given, transcribe it and
   retell it in your own words. Note author, site and date, and any narration/permission rule
   (story rights go in the flags). Look for graphic content to soften and for a famous image
   that must not be copied. Mark every blood moment.
2. **Set up the work folder, then CLEAR IT FOR THIS STORY.**
   `bash <skill base>/engine/setup.sh ~/scroll-kaos/<story-slug>` then
   `python3 tools/new_story.py "<Story Title>"`. This wipes the story slots and writes clean
   templates. The shared kits are never touched. Starting a story is a clean start, not a
   find-and-replace.
3. **Plan.** Write `story/bible.md` (places, people, objects, timeline, twist),
   `story/creature.json` (the antagonist, drawn from the story's own words: height multiple,
   arm length, mask, grin, tears, hair, pendant) and `story/rooms.md` (each room with its 5+
   readable objects and its 2 light sources). Cast the story. Pick one fixed Kokoro voice per
   speaking character from `story/voices.py` - see `references/voice-cast.md`.
4. **Write the scripts** in `story/` (format in `references/pipeline.md`): the long script with
   a cold-open flash-forward that cuts on the sharpest line, the full story in order, the
   one-sentence credit after 0:45, and the closing question as the very last line; a Reel
   retelling of 2:40-2:55 with ONE speaker. Self-check the first 80 words: the first two
   sentences must create fear or a question.
5. **Voice.** `python3 tools/tts.py long` and `python3 tools/tts.py reel` (long in the
   background). Measure the Reel and adjust until it is 2:40-2:55.

6. **ENVIRONMENT FIRST.** Choose the kits and write their options per scene. Preview them and
   **LOOK**:
   ```bash
   node tools/preview/shot_preview.mjs qa/env_shots.json qa/preview
   ```
   Every room needs its 5+ readable objects and its 2 light sources. Nothing may be an
   unreadable black region outside a planned dark beat. Fix the set before anyone stands in it.
7. **THEN THE SCENES.** Write `story/scenes_long.py` and `story/scenes_reel.py` using
   `S(...)` from `tools/scenes_dsl.py`. Every scene needs a **camera preset**, an **anchor**,
   a **framing tag** and a length. Keep `face` at 15 % or below, never two in a row, at least
   50 % `full` or `waist`, and hands visible in at least a quarter of shots. Then:
   ```bash
   python3 tools/build_shots.py long && python3 tools/build_shots.py reel
   ```
   It is non-zero on a repeat, a held beat that was not declared, a face-shot overrun, or
   `drift_wide` used inside the story. **A FAIL is an instruction to fix it and run again.**
8. **THEN THE CHARACTERS.** Add actors to the scenes - poses, positions, looks, states. The
   antagonist comes from the one spec and nothing else. Preview and **LOOK** again:
   ```bash
   node tools/preview/shot_preview.mjs qa/cast_shots.json qa/preview
   ```
   Check: feet on the floor, nobody inside furniture, the creature's mask readable, tear
   streaks where the script says someone is crying, blood as stains and drips only.
9. **Cards and screens.** Fill `src/story.json` (title, accent word, tagline, stakes lines,
   the three choice pairs with their emoji and subtext, the closer, the CTA, the teaser, the
   recap list, the epilogue rows). Render and LOOK at the cards:
   ```bash
   npx remotion still src/index.ts Title16 qa/cards/Title16.png --frame=80
   npx remotion still src/index.ts Choice1 qa/cards/Choice1.png --frame=80
   npx remotion still src/index.ts End     qa/cards/EndA.png    --frame=60
   ```
10. **Sound and subtitles.** `python3 tools/mix.py long && reel`, `python3 tools/loud.py long
    && reel`. Write `story/hindi_long.txt`, then `python3 tools/subs.py long && reel`.
11. **Thumbnails.** Edit `src/ThumbsStory.tsx`, run `bash tools/thumbs.sh <Prefix>`, LOOK at
    `qa/thumbs_sheet.jpg`.
12. **Contact sheets.** `bash tools/qa_sheets.sh long` and `reel`. LOOK at every sheet and
    answer the 16 questions `tools/frame_qa.py` prints. Any "yes" is a rebuild.
13. **Render.** `bash tools/render.sh <Prefix> all` in the background, and wait for it.
14. **Upload notes.** Fill `story/upload.json`, run `python3 tools/make_upload_md.py <Prefix>`.
15. **Gates, then deliver.**
    ```bash
    python3 tools/selftest.py
    python3 tools/frame_ledger.py checksig src/shots_long.json <story-slug>
    python3 engine/tools/quality_gate.py final/<Prefix>_YouTube_1920x1080.mp4 --kind long --sheet qa/long_sheet.png
    python3 engine/tools/quality_gate.py final/<Prefix>_Reel_1080x1920.mp4   --kind reel --sheet qa/reel_sheet.png
    python3 tools/frame_ledger.py check final/<Prefix>_YouTube_1920x1080.mp4 <story-slug>
    bash tools/qa_final.sh
    ```
    All must exit 0. Then send the deliverables from `final/` with SendUserFile in one call.
16. **Only after the user approves**, record the video so the channel never repeats it:
    ```bash
    python3 tools/frame_ledger.py add    final/<Prefix>_YouTube_1920x1080.mp4 <story-slug>
    python3 tools/frame_ledger.py addsig src/shots_long.json <story-slug>
    ```

## Final message
Keep it short and clear: what was made (lengths, sizes, loudness), the gate numbers for both videos (shots per minute, repeated shots, longest freeze), the **first 3 spoken lines** (the teaser) and the **closing question** quoted, the look kit used (add it as a new row for `references/kits-used.md`), any new cast member, what the Reel shortened, and the flags (story rights, softened content, blood limit confirmation, photosensitive safety, AI voices, every UNVERIFIED item). Add a "Sources:" list for any web page used.

## Rules that are easy to forget
- The gate and the contact sheets are both required. A pass on one is not a pass on the other.
- **A repeated picture is a failure, even when it is a good picture.** It is still a failure when it is 20 seconds later, when only the framing tag changed, and when it came from a different video. Change at least two of {camera position, who is in shot and where, the light, a prop's state}.
- **Count scenes against shots before building.** A sentence that will get 4 shots needs 4 written scenes. A gap filled by the tool is a duplicate picture.
- **Run the frame ledger before delivery** so the new video does not repeat an earlier one, and add it to the ledger only after the user approves.
- **The antagonist never drifts.** One spec, imported everywhere, never re-typed in a set.
- Faces alone are a failure. Show the body in at least half the shots.
- The monster is the story's monster. If the text says it is tall, it is tall in every shot.
- First frame = the creepiest picture; a creepy shape before 0:20; picture change every <= 2.5 s in the teaser.
- Reel = exactly one speaker (the narrator). tts.py enforces it; still check it.
- The long video ends with the 20 s end screen; the closing question is the last on-screen text in both videos, and the same words are used in 4 places.
- Never copy a famous image, character, mask or artwork.
- Long waits: run renders in the background and check logs; never `pkill -f` a pattern that matches your own command.
