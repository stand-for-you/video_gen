# Quality law (v0.4): what a finished Scroll Kaos video must look like

This file is the user's standard. It was written after comparing the videos the user rated as the best with a video the user rejected. Every rule below is either measured by `engine/tools/quality_gate.py` or checked by looking at the contact sheet. A video that fails a rule is not sent; it is fixed and rebuilt.

## 1. What the reference videos did (measured)

| Video | Size | Shots per minute | Repeated shots | Longest freeze | Why it was rated well |
|---|---|---|---|---|---|
| 3rd (flight story) | 720x1280 | 37.9 | 1 | 1.6 s | Many camera moves, lit 3D rooms, moving passengers and objects, a new shot about every 1.6 s |
| 1st short (monster story) | 1080x1920 | 32.9 | 0 | 0.5 s | A tall monster drawn in detail, labelled anatomy, moving camera around the creature, word-by-word captions |
| 1st (2) (long, flat animation) | 1920x1080 | 24.0 | 3 | 3.8 s | Full rooms and houses, phone screens, half-body characters (not only faces), many different places |
| I Know You're Awake Reel (rejected) | 1080x1920 | 21.2 | 16 | 2.6 s | Same face and blanket shot again and again; faces only; room too dark to read |
| I Know You're Awake long (rejected) | 1920x1080 | 18.2 | 51 | 9.2 s | Same frames reused; picture still for long holds; monster hardly seen |

The rejected videos did not fail on style alone. They failed on **repeated pictures, face-only framing, unreadable rooms, a monster that did not match the story, and no visible blood where the story has blood.**

## 2. Hard rules (the gate fails the video if these are broken)

1. **Frame rate 30 fps. Exact sizes:** long 1920x1080, Reel 1080x1920.
2. **Shots per minute:** long video at least 20, Reel at least 18.
3. **THE ONE-USE LAW. A picture is used once, ever.** See section 6 — this is the strictest rule on the channel and the one most often broken.
4. **Every shot moves.** Each shot has a camera move (push, pull, pan, orbit or shake) and at least one moving thing (a person, a creature, a prop, light or fog).
5. **THE ONE-CREATURE LAW.** One story, one antagonist, one design, never drifting. See section 7.

## 3. Warnings (the gate reports them; the author must justify them in the scene table)

1. **Freeze longer than 2.5 s** is allowed only as a planned hold (a title card, a phone screen or a deliberate silence) and must be listed in the scene table with its reason.
2. **Picture still for more than 35 % of the time** must be justified. The reference "1st (2)" video was still about 37 %, and the user still rated it well, so this is a warning, not a fail.

## 4. Look rules (checked on the contact sheet, by eye)

### 4a. Monster and creature
- The monster is built **from the story text**, word by word: height, number of eyes, arms, skin, hood, teeth, colour, what it does. Write a "creature sheet" in `story/creature.md` before drawing. Every drawing is checked against it.
- Show the **full body** of the monster in at least one shot every 60 s, and from **two different angles** (front and side or back).
- Show it **moving**, not only standing still: reaching, leaning, crawling, lunging. A monster that only appears as a face is a failure.
- The monster must be **clearly drawn and lit** (outline, shading, one rim light). A dark blob that cannot be read is a failure.

### 4b. People and framing
- At least **50 % of the shots** show the character **from the waist up or full body**.
- **Face-only close-ups** may be at most **15 %** of the shots, and never twice in a row.
- In every shot where the body is part of the scene, the **chest, arms and legs** are drawn. Do not crop a person to the face when the story has them doing something with their body.
- Each character keeps the same face, hair, height and clothes in every shot (the cast model is the only model).

### 4c. Rooms, props and light
- Each room has **at least 5 readable objects** (for example bed, sheet, pillow, lamp, window, door, chair, shelf, picture frame).
- **Blankets, sheets and pillows** have a shape (a fold, a crease, a shadow edge) and a texture (grain or stripes). Flat grey rectangles are a failure.
- The room must be **readable at phone size**: the main object of each shot must be visible without zooming in. No shot may be almost black except the planned dark moment (the gate's still-time warning and the contact sheet catch these).
- Use **two light sources** per room at least (for example a window and a lamp), so shapes have light and shadow.

### 4d. Blood (when the story has blood)
- Blood **must be shown clearly**, in **bright red** against the dark room: stains on sheets, clothes, the floor or the wall, drips down a surface, a pool that grows.
- Blood is drawn as paint, never as an open wound close-up, an organ, or a body being cut on screen. The story may say a person was hurt; the picture shows the result (the red stain, the bandage, the person holding their side).
- When the story has blood and the drawing does not show it clearly, the video fails the look check.
- **Policy note — SETTLED, never ask.** This rule replaced the older "no blood" line and the user has confirmed it. Bright red stains, drips and pools: yes. Open wounds, cutting on screen, organs: never. Apply it silently and note it in the final message's flags.

### 4e. Smooth motion (the most important look rule)
- A shot must not look like a slideshow of a few drawings. Each shot has **at least two moving layers**, for example a slow camera push plus a character breathing, a swinging lamp, a rising mist or a blinking eye.
- Motion is **eased** (slow start, slow end), never a jump between two positions.
- Use **parallax** (background moves slower than the front layer) in every room shot.
- Frames must not be **held more than 2.5 s** unless listed as a planned hold.

## 6. THE ONE-USE LAW (a picture is used once, ever)

**The user's words:** *"never use the frames after use it one time, and always make the new frames, and always make the frames different from any previous frames."* They also reported the exact symptom: *"you make multiple frames which are totally similar from the previous frames and you use that frames in entire video — one scene you use multiple times in a video."*

### 6a. The rule
- **Inside one video:** no picture may appear twice. Not "nearly never" — **zero**.
- **Across videos:** no picture may repeat a picture from any earlier video on the channel.
- A **near-copy counts as a copy.** If a viewer would say "I've seen this already", it is a repeat, whatever the pixel difference says.
- Re-showing a **place** is allowed. Re-showing a **picture** is not.

### 6b. Why this keeps happening (know the trap)
The shot builder used to fill a gap by recycling a unit's own scene when a sentence needed more shots than the scene table provided. It changed the framing tag and nothing else, so the same picture went out several times, silently. **Never let a tool fill a gap for you.** If a sentence needs four shots, write four scenes.

### 6c. How to make a return to a room legal
Change **at least two** of these, never framing alone:
- camera on a different wall, at a different height, or on the other side of the room
- different people in shot, or the same people in new positions
- different light (lamp on/off, fire grown, time of day, door now spilling light)
- a prop changed or in a new state (door open, drawer out, blood now present)

### 6d. What is measured
- shot list: re-shown scenes **0**; identical scene specs anywhere in the video **0**; no set carrying more than 18 % of shots
- video: every sampled second compared against **every earlier second** (not just 20 s back); exact repeats **≤ 2 %**; near-copies **≤ 6 %**; at least 82 % of seconds are a new picture
- across videos: a frame ledger of every delivered video; at most 1.5 % of seconds may match an earlier video, 5 % may resemble one

### 6e. Writing the scene table so this passes
Before building shots, count: **one scene entry per shot the sentence will get**, each visibly different from every other entry in the whole table. Read the table top to bottom and ask of each line, *"have I already made this picture?"* If yes, change it there and then — it is far cheaper than a re-render.

## 7. THE ONE-CREATURE LAW (the antagonist never drifts)

**The user's words:** *"if i give you the some monster or antagonist of the video so always make them much much similar in entire video."*

- **One story, one antagonist, one design.** Height, build, head, eyes, hands, clothes and colour are fixed the moment the creature sheet is written, and every shot obeys them.
- Build the creature spec **once** from `story/creature.md` and import that one spec everywhere. **Never re-type its numbers inside a set** — that is how a monster drifts.
- The only allowed difference between shots is **state**, declared in advance: alive/dead, dressed/bare, dry/soaked, clean/burnt. A state change is the same character. A different design is a different monster, and is a failure.
- It must be **seen**, not described: at least 6 shots, full body from **two** angles, and moving.
- The creature in the **thumbnail** is the same creature as in the video.
- A story with a creature declares it in `story/creature.json` (`id`, `variants`, `min_shots`). The gate fails any creature id that is not the declared one or a declared variant.

## 9. CHECK THE DIRECTION AT EVERY STAGE (not only at the end)

**Why:** "Gateway of the Mind" was rendered twice before anyone saw that a lying patient had been drawn as a standing rig tipped on its side, that every Reel label was sliced off, that assets from a different story were on screen, and that the Reel looped six shots for 2:51. Every one of those was visible **before** the render. Nothing checked.

Run `python3 tools/checkpoint.py` after every stage. It stops at the first failing stage, because everything after depends on it. Stages 1-5 need no render and take about a second.

| Stage | Proves | Automatic? |
|---|---|---|
| 1 story | script + scene table + narration timing line up | yes |
| 2 cast | the antagonist is declared in `story/creature.json` and locked | yes |
| 3 scenes | enough DIFFERENT scenes; nothing recycled | yes |
| 4 labels | every callout fits the frame, none over-used | yes (`lint_tags.py`) |
| 5 shots | the shot list passes the quality gate | yes |
| 6 look | the review sheet is built **and actually read** | **NO — eyes only** |
| 7 deliver | rendered files pass the video gate + frame ledger | yes |

### 9a. Stage 6 cannot be skipped or faked
A pixel detector for "is the character in this frame" was built and tested against the broken Reel, and it **failed**: known-bad empty frames overlapped known-good close-ups. A gate that returns PASS on a broken video is worse than none. So stage 6 is `tools/frame_qa.py`, which builds the sheet and prints 16 questions. **Look at the sheet and answer them.** Any "yes" is a rebuild.

### 9b. The rule behind most of these faults
Nearly all of them share one cause: **a pose or composition that was never drawn, so something else was reused in its place.** A lying patient became a rotated standing rig. A vertical shot became a cropped horizontal one. An empty beat became an empty room.

When the script needs something the kit cannot draw, **draw it**. Never rotate, crop or substitute to fill the gap. If there is no time to draw it, change the shot to something the kit can do honestly — and say so in the final message.

### 9c. Things that are now measured, so never argue with them
- callout boxes must fit the frame (`lint_tags.py` computes the exact box from the text length and tells you the x to move to)
- the same callout text at most 3 times in one video
- in 9:16, labels stay above y = 74 % so they never hit the burned-in captions
- one antagonist id per story (`story/creature.json`)

The full list of every fault found and what catches it: `docs/bug-catalogue.md`.

## 8. Process (every run)

0. **Before writing the scene table, re-read sections 6 and 7.** The one-use law and the one-creature law are the two rules this channel has actually been burned by.
1. Read the references in this order: `quality-law.md` (this file), `channel-policy.md`, `pipeline.md`, `art-library.md`.
2. Before any drawing, write `story/creature.md` (rule 4a) and `story/rooms.md` (5 readable objects per room, and the light sources).
3. Write the scene table with a **framing tag** per shot (`full`, `waist`, `face`) and a **motion note** per shot. Keep `face` at 15 % or below.
4. Build the shots, then fix every WARN and DUP from `build_shots.py`.
5. Render, then run the gate on each video:
   `python3 engine/tools/quality_gate.py final/<Prefix>_YouTube_1920x1080.mp4 --kind long --sheet qa/long_sheet.png`
   `python3 engine/tools/quality_gate.py final/<Prefix>_Reel_1080x1920.mp4 --kind reel --sheet qa/reel_sheet.png`
   Fix every hard fail and rebuild. Justify every warning in the final message.
6. **Look at the contact sheets** and check rules 4a to 4e. A video that passes the gate but fails the look check is still rebuilt.
7. Only then write the upload notes and send the files.
