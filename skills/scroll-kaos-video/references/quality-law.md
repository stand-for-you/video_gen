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
3. **No repeated shot.** A shot is a repeat when its picture is almost the same as an earlier shot 8 s or more before it (measured threshold 1.5 on a 96 px grey image). Zero repeats allowed. If one room is used twice, the camera must show a NEW part of it, a NEW prop, or the people in NEW positions.
4. **Every shot moves.** Each shot has a camera move (push, pull, pan, orbit or shake) and at least one moving thing (a person, a creature, a prop, light or fog).

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
- **Policy note (UNVERIFIED for this channel):** this rule was written from the user's request on the day of this version. The earlier channel policy said "no blood". Ask the user to confirm the limit before the first video that uses it.

### 4e. Smooth motion (the most important look rule)
- A shot must not look like a slideshow of a few drawings. Each shot has **at least two moving layers**, for example a slow camera push plus a character breathing, a swinging lamp, a rising mist or a blinking eye.
- Motion is **eased** (slow start, slow end), never a jump between two positions.
- Use **parallax** (background moves slower than the front layer) in every room shot.
- Frames must not be **held more than 2.5 s** unless listed as a planned hold.

## 5. Process (every run)

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
