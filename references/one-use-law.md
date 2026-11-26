# The one-use law, enforced

> "never use the same frames again once you used them - I observe, even when I mention it,
> the agent makes use of the same frames or makes the same frames again and again"

That complaint is about **enforcement, not understanding**. Telling an agent a rule and
hoping does not work. v0.5 turns the rule into two locks that return a non-zero exit code.
An agent cannot argue with an exit code.

## The rule

A picture is used **once, ever** - not once per video. Returning to a room is fine; returning
to a *picture* is not. Two shots are the same picture unless at least **two** of these differ:

| Bucket | What is in it | Rounded to |
|---|---|---|
| `cam` | kit + eye position + yaw + pitch + camera preset | 0.75 m, 15 degrees |
| `cast` | the hand pose, and every actor's id + pose + ground position | 0.75 m |
| `light` | lights on/off, lamp side, lamp count, headlights, colour wash | - |
| `props` | door / windshield / roof / ground / beam / room / shape / clock / window **state** | - |

The rounding is deliberate. Nudging the camera 4 cm is not a new picture, and an agent that
"fixes" a duplicate by nudging it is doing exactly the thing the rule exists to stop.

## Lock 1 - the signature lock (before a single frame is drawn)

`tools/shotsig.py`, called by `tools/build_shots.py` and `tools/frame_ledger.py checksig`.

```
FAIL REPEAT p1_01 @0:00 <-> p1_03 @0:04 (3/4 buckets) - same cast, light, props; only cam differs
```

Three of four buckets matching means only ONE thing changed, which the rule forbids. The
message names both shots, their timestamps, and which bucket is carrying the whole difference,
so the fix is obvious: change a second one.

This lock also runs **across videos**. `frame_ledger.py addsig` records every signature from
an approved video; `checksig` on the next story refuses a shot that was already used.

## Lock 2 - the perceptual lock (on the finished mp4, before delivery)

`tools/frame_ledger.py check` samples a frame every 2 s and compares 256-bit DCT perceptual
hashes against every earlier video on the channel **and against the video itself**.

Threshold measured on 780 frame pairs from the reference video, not guessed:

| Case | Hamming distance |
|---|---|
| identical frame, re-encoded or re-graded | 0 - 8 |
| the same picture reframed by 20 px | over 100 |
| genuinely different pictures | 70 - 128 (minimum over all 780 pairs: **70**) |

There is a clean empty band between 8 and 70. The threshold sits at **24**: no false alarm on
a slow pan, no miss on a literally reused frame.

**What this lock does not catch:** a picture rebuilt at a slightly different camera angle - a
DCT hash treats a reframe as a different image. That case belongs to lock 1, which works on
the shot's numbers instead of its pixels. Neither lock covers both failure modes alone; the
pair covers both.

## The commands

```bash
python3 tools/build_shots.py long            # lock 1, inside this video. Non-zero on a repeat.
python3 tools/frame_ledger.py checksig src/shots_long.json <slug>   # lock 1, across videos
python3 tools/frame_ledger.py check final/<Prefix>_YouTube_1920x1080.mp4 <slug>   # lock 2
# ONLY after the user approves the finished video:
python3 tools/frame_ledger.py add    final/<Prefix>_YouTube_1920x1080.mp4 <slug>
python3 tools/frame_ledger.py addsig src/shots_long.json <slug>
```

The ledger lives at `$SCROLL_KAOS_LEDGER` (default `~/.scroll-kaos/ledger.json`). **Keep it.**
Losing it means the channel forgets what it has already shown and the cross-video lock
silently stops working.

## How to actually fix a flagged repeat

Do **not** nudge the camera. Change two buckets, and pick changes the viewer can see:

- a prop's declared state: `door: 'cracked'` to `door: 'holed'`, `windshield: 'clean'` to
  `'smashed'`, `roof: 'sound'` to `'torn'`
- the light: `lightOn: false`, a different `lampSide`, a colour `wash`
- who is in shot and where, including the hand pose
- the kit itself, or a different room inside it

And if a sentence needs four pictures, **write four scenes**. A gap filled by the tool is
how a duplicate gets born.
