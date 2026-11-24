# The one-use law and the one-creature law (v0.6)

Two channel laws, added after the user found the same pictures repeating inside a video
and the same scenes being re-staged across videos.

---

## 1. The ONE-USE LAW — a picture is used once, ever

> Never reuse a frame after it has been used one time. Always make new frames. Always make
> a frame different from every frame of every previous video.

### What was actually wrong

Three separate mechanisms were producing repeats, and all three were silent:

| Where | What it did |
|---|---|
| `tools/build_shots.py:45` | when a sentence had fewer scenes than shots, it recycled `L[k % len(L)]` with `v.alt = 1` and a nudged framing tag — the same picture, twice |
| `tools/quality_gate.py` | allowed **10%** re-shown scenes |
| `tools/quality_gate.py` | the repeat check only compared against frames **more than 20 s earlier**, so a scene repeated 5 s later was invisible |

Measured on the already-published *Gateway of the Mind* reel, the new gate finds **30
repeated shots out of 72**, including `rchamber/wide` five times and `robs/wide` five
times. The old gate passed that video.

### What is enforced now

**At build time** (`tools/build_shots.py`) — a hard stop, not a warning:

- a unit may not recycle its own scene — add a scene per shot
- the same `[set, variant]` may not appear in two units
- draft-only override: `SK_ALLOW_RESHOW=1`, never for a delivered video

**At shot-list time** (`quality_gate.py shots long|reel`):

- `re-shown scenes` must be **0** (was ≤ 10%)
- `identical scene specs anywhere in the video` must be **0**, and offenders are printed
  with their timestamps
- no single set may carry more than 18% of the shots

**At video time** (`quality_gate.py video <file>`):

- every sampled second is compared against **every earlier second**, skipping only the 5 s
  window around it (that window is the same continuous shot, not a repeat)
- `seconds re-showing an earlier picture` ≤ **2%** (was 8%, and only looked 20 s back)
- `seconds that merely LOOK like an earlier picture` ≤ **6%** — near-copies count
- ≥ 82% of sampled seconds must be a new picture

**Across videos** (`tools/frame_ledger.py`):

```bash
python3 tools/frame_ledger.py check final/<Prefix>_Reel_1080x1920.mp4 <story-slug>  # before delivery
python3 tools/frame_ledger.py add   final/<Prefix>_Reel_1080x1920.mp4 <story-slug>  # after approval
python3 tools/frame_ledger.py list
```

`ledger/frames.json` keeps a 576-bit fingerprint per second of every delivered video
(tens of KB each, committed to git). A new video may reuse at most 1.5% of seconds from
an earlier video, and look like at most 5%.

### How to actually satisfy it

Re-showing a *place* is fine. Re-showing a *picture* is not. When you come back to a room:

- move the camera to a different wall, height or side of the room
- move the people, or change who is in the shot
- change the light (lamp on/off, time of day, fire grown)
- change a prop, or the state of one (door now open, blood now there)
- change the framing class *and* one of the above — framing alone is not enough

If a sentence needs four shots, write four scenes. Do not write one and let the builder
fill the gap.

---

## 2. The ONE-CREATURE LAW — the antagonist never drifts

> If I give you a monster or antagonist, always make them much the same through the entire
> video.

One story, one antagonist, one design. Its height, build, face, hands, clothes and colour
are fixed the moment they are written, and every shot obeys them. A monster that changes
between shots reads as several different monsters, and the fear does not carry.

### Declare it once

`story/creature.json`:

```json
{
  "id": "listener",
  "variants": ["listenerLiving"],
  "min_shots": 6,
  "angles": 2,
  "note": "2.6 m, hunched, bare skull, black eye holes, long grey coat"
}
```

`variants` is only for the **same character in another state** (alive / burnt / soaked /
dressed). It is never a second design.

### What is enforced

`quality_gate.py shots` checks:

- every creature id used in the shot list is the declared id or a declared variant
- the creature appears in at least `min_shots` shots — it must be **seen**, not described
- a second, undeclared creature id is a failure

### What the gate cannot check — your job

- the written sheet (`story/creature.md`) is the single source; build the C3 spec from it
  **once** and import that one spec everywhere
- never re-type the creature's numbers in a set; always reference the spec
- show it full body from at least two angles, and show it moving
- the same creature appears in the thumbnail as in the video
