---
name: scroll-kaos-video
description: Makes a finished Scroll Kaos horror video set from a story text or a video - a 1920x1080 YouTube video with an end screen, a separately drawn 1080x1920 Reel with burned-in captions, English and Hindi .srt, three A/B thumbnails, one Reel thumbnail and one upload-details .md - using the channel's permanent cast, the bundled Remotion + Kokoro engine, and the v0.4 quality law (smooth motion, no repeated shots, full-body monsters, readable rooms, visible blood). Use when the user says /scroll-kaos-video, "make the Scroll Kaos video", "make this story into a video", "make it the same way as before", or "reel only".
---

# Scroll Kaos video maker (v0.4)

Turn the user's story (text, file or video) into the exact Scroll Kaos deliverable set. Work fully automatically: ask NO questions, decide alone, flag problems at the end. Quality first: long render time is normal; never cut quality to save time.

Reply to the user in simple English, explain hard words in (brackets), bold key terms, medium-plus length. Mark anything you could not verify with UNVERIFIED. Never send the user's email to outside services.

## The quality law comes first
Read `references/quality-law.md` BEFORE planning. It is the user's standard, written from the videos they rated best (the flight story, the monster short, the "1st (2)" long video) and the one they rejected ("I Know You're Awake"). In short:

1. **Smooth.** 30 fps. Every shot moves (camera plus a moving thing). No freeze over 2.5 s unless planned.
2. **THE ONE-USE LAW: a picture is used ONCE, ever.** Zero repeats inside a video, and no picture may repeat one from an earlier video on the channel. A near-copy counts as a copy. Returning to a room is fine; returning to a *picture* is not — change at least two of {camera position, who is in shot and where, the light, a prop's state}. Never let a tool fill a gap by recycling a scene: if a sentence needs four shots, **write four scenes**. (quality-law.md section 6)
3. **Full bodies and waist-up.** At least 50 % of shots show the body. Face-only close-ups at most 15 %.
4. **THE ONE-CREATURE LAW: one story, one antagonist, one design, never drifting.** Build the creature from `story/creature.md` word by word, write the spec **once**, and import that one spec everywhere — never re-type its numbers inside a set. The only allowed difference between shots is a **declared state** (alive/burnt, dry/soaked, dressed/bare); a different design is a different monster and is a failure. Show it in at least 6 shots, full body from two angles, moving. The thumbnail creature is the same creature. (quality-law.md section 7)
5. **Readable rooms.** At least 5 readable objects per room; blankets and sheets have folds and texture; no near-black shots except a planned dark moment.
6. **Blood is shown clearly** when the story has blood (bright red stains, drips, pools), never as an open wound or a body being cut on screen. Ask the user to confirm this limit once (see the policy note in quality-law.md 4d).

The gate script `engine/tools/quality_gate.py` measures rules 1 and 2 on the finished files. Passing the gate is required but not enough: the contact sheets must also pass rules 3 to 6.

## Where things are
- `engine/` (next to this SKILL.md) = the complete working project: permanent cast and art library (Remotion, React SVG), voice (Kokoro-onnx), shot builder, sound mix, loudness, subtitles, safe audio, render, thumbnails and QA scripts, plus the quality gate. It ships with the full **Smile Dog** story as a worked example.
- `references/quality-law.md` = the v0.4 standard with measured reference numbers. Read it first.
- `references/channel-policy.md` = ALL channel rules (deliverables, hook, cast, variety, sound, two videos, thumbnails, the .md, A/B test, pinned comment, community posts, safety, final self-check). It wins over anything else here except where it conflicts with quality-law.md 4d (blood), in which case ask the user once and flag it.
- `references/pipeline.md` = exact commands, file formats (BEATS, scene tables, voices, sfx) and lessons learned.
- `references/art-library.md` = every component the engine can already draw and how to write a new kit.
- `references/kits-used.md` = look kits already used (the new video must differ from the most recent ones).
- `references/upload-details-gold.md` = the upload .md the user approved as PERFECT. `references/upload-md-guide.md` explains how to fill `story/upload.json` and run `tools/make_upload_md.py`.

## Deliverables (nothing more, nothing less)
1. `<Prefix>_YouTube_1920x1080.mp4` 2. `<Prefix>_Reel_1080x1920.mp4` 3. `<Prefix>_English.srt` 4. `<Prefix>_Hindi.srt` 5-7. `<Prefix>_Thumb_A/B/C_1280x720.jpg` 8. `<Prefix>_Reel_Thumb_1080x1920.jpg` 9. `<Prefix>_Upload_Details.md`.
"Reel only": the Reel, the Reel thumbnail, both .srt and the .md only. Never send Hindi audio, zips, transcripts, voice files or any extra file.

## Workflow
Create a task list with these stages and tick them off. Tell the user in one line what is being made, then start.

1. **Read and check the source.** Read the whole story. If a video is given, transcribe it and retell in own words. Note the author, site and date, and any narration/permission rule on the page (story rights go in the flags). Look for graphic content to soften (sexual content, suicide method, real injuries) and for a famous image that must not be copied. Mark every blood moment in the story (quality-law 4d).
2. **Set up the work folder.** Run `bash <skill base>/engine/setup.sh ~/scroll-kaos/<story-slug>` (installs Node and Python packages, the Kokoro model from GitHub, the Lora font and textures; prints the installed voices). All later commands run inside that folder.
3. **Plan.** Write `story/bible.md` (places, people, objects, timeline, twist), `story/creature.md` (the monster or ghost, drawn from the story words only: height, eyes, limbs, skin, clothes, how it moves) and `story/rooms.md` (each room with its 5+ readable objects and its 2 light sources). Pick a NEW look kit that differs from the recent kits in `references/kits-used.md`. Cast the story from the permanent cast; a person not in the cast becomes one new Spec in `src/CastExtra.tsx`. Pick one fixed Kokoro voice per speaking character (long video only) from the printed list.
4. **Write the scripts** in `story/` (format in `references/pipeline.md`): long script with a ~30 s teaser whose first lines create fear, the cut line "Let us go back to the beginning.", the full story in order in own words, the one-sentence credit after 0:45 ("inspired by <title>, as published on <site>"), and the closing question as the very last line; a Reel retelling of 2:40-2:55 with ONE speaker; `voices.py`; optional `sfx.json`. Self-check the first 80 words: the first 2 sentences must create fear or a question.
5. **Voice.** Run `python3 tools/tts.py long` and `python3 tools/tts.py reel` (in the background for long scripts). Measure the Reel; adjust its script until it is 2:40-2:55.
6. **Draw the kit.** Write `src/<Kit>.tsx`, `src/SetsL.tsx` (16:9), `src/SetsR.tsx` (9:16, drawn again, no import from SetsL), `src/Card.tsx`, `src/camera.ts`. Reuse the art library. Every shot needs a camera move AND a moving thing (quality-law 4e); every room needs its readable objects (4c); the monster is drawn from `story/creature.md` with the full body from two angles (4a); blood is drawn as stains and drips (4d). Fill `src/gal.json` / `src/galr.json` and run `bash tools/qa_sheets.sh gal` and `galr`; LOOK at every sheet and fix the art until clean.
7. **Scene tables and shots.** Write `story/scenes_long.py` and `story/scenes_reel.py`. Every scene has a **framing tag** (`full`, `waist`, `face`) and a **motion note**. Keep `face` at 15 % or below, never two in a row, and at least 50 % `full` or `waist`. Every scene is unique (no repeated picture). The first scene is the creepiest picture; the long video's last beat = `S('end')`. Run `python3 tools/build_shots.py long` and `reel`; fix every WARN and DUP. Confirm screens/min >= 20 (long) and >= 18 (Reel), and teaser shots <= 2.5 s. Run `bash tools/qa_sheets.sh long` and `reel` and LOOK at every sheet; fix and rebuild.
8. **Sound and subtitles.** `python3 tools/mix.py long && python3 tools/mix.py reel`, `python3 tools/loud.py long && python3 tools/loud.py reel`. Write `story/hindi_long.txt` (one natural Hindi line per narration unit), then `python3 tools/subs.py long && python3 tools/subs.py reel`.
9. **Thumbnails.** Write `src/ThumbsStory.tsx` (A main, B close crop + 2-word title + smaller moon, C key object big and glowing, R vertical) and run `bash tools/thumbs.sh <Prefix>`; LOOK at `qa/thumbs_sheet.jpg` and fix.
10. **Render.** Run `bash tools/render.sh <Prefix> all` in the background and wait for it (it renders the long video in 4 resumable parts, encodes 2-pass, adds safe audio, burns Reel captions, copies the .srt files into `final/`).
11. **Upload notes (fixed format).** Never write the .md by hand. Fill `story/upload.json` following `references/upload-md-guide.md`, then run `python3 tools/make_upload_md.py <Prefix>`. Read the result once and fix the JSON if anything is wrong, then run it again.
12. **Quality gate and final QA.** Run the gate on both videos (commands below), then `bash tools/qa_final.sh` and check: exact resolutions, files < 400 MiB, LUFS about -16 (long) and -14 (Reel), encoded peak <= -1 dBFS, Reel 2:40-2:55 and one speaker, .srt UTF-8 + CRLF + no BOM, cue counts equal. Pull sample frames (first frame, a chapter card, a mid scene, the end screen, Reel frames with captions) and LOOK at them against quality-law 4a to 4e. Rebuild anything that fails. Then run the full self-check in channel policy section 8.
    `python3 engine/tools/quality_gate.py final/<Prefix>_YouTube_1920x1080.mp4 --kind long --sheet qa/long_sheet.png`
    `python3 engine/tools/quality_gate.py final/<Prefix>_Reel_1080x1920.mp4 --kind reel --sheet qa/reel_sheet.png`
    The gate must print no hard fails (exit code 0). Each warning must be explained in the final message.
    Then check the video against every earlier video on the channel (the one-use law across videos):
    `python3 tools/frame_ledger.py check final/<Prefix>_Reel_1080x1920.mp4 <story-slug>`
    Re-stage anything it flags. Only once the user approves the finished video, record it:
    `python3 tools/frame_ledger.py add final/<Prefix>_Reel_1080x1920.mp4 <story-slug>`
13. **Send** exactly the deliverables from `final/` with SendUserFile in one call.

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
