# Bug catalogue — the faults found in "Gateway of the Mind", and what now catches each

Every row is a real fault the user found in a delivered video. "Caught by" says what stops
it happening again. Where it says **EYES**, no tool can judge it — a person or an agent
that can see images must answer the question on the review sheet.

Run everything with: `python3 tools/checkpoint.py`

| # | Fault | Caught by |
|---|---|---|
| 1 | Lying character drawn as a standing rig tipped 90°, cane still in hand, legs through the wall | `lint_poses.py` + `kits/Lying.tsx` |
| 2 | Body flips left/right between shots | `kits/Lying.tsx` (`head` is fixed, not tied to facing) |
| 3 | Ghosts standing on top of the lying body; floating red dot by his head | **EYES** — Q5 |
| 4 | Close-up sleeves float as separate blocks; offset hair halo | **EYES** — Q3, Q4 |
| 5 | Wrong costume/prop for the scene (cardigan + cane in a surgical chamber) | **EYES** — Q2 |
| 6 | Eyes open and healthy while the script says blind / screaming / crying | **EYES** — Q13 |
| 7 | Heads cut off by the top edge | **EYES** — Q6 |
| 8 | 9:16 centre-cropped from 16:9, subject pushed off-frame, empty window | **EYES** — Q7 |
| 9 | Empty room shots with no character during key narration | **EYES** — Q8 |
| 10 | **Callout labels sliced off the right edge** ("SENSES CUT" → "SENS") | `lint_tags.py` — exact arithmetic |
| 11 | **Same label repeated ~10×** ("SENSES CUT") | `lint_tags.py` — max 3 uses |
| 12 | Labels/pointers colliding with the burned-in captions | `lint_tags.py` (9:16 caption band) + Q11 |
| 13 | Pointer dot aimed at empty glass, not at the thing named | **EYES** — Q10 |
| 14 | Label appears 15–50 s away from the words it illustrates | **EYES** — Q13 |
| 15 | **Same picture reused many times** (reel looped 6 shots for 2:51) | `quality_gate.py shots` + `video` |
| 16 | Assets from a different story (wet-footprints child, green-shirt figure, forest end screen) | **EYES** — Q14 |
| 17 | Antagonist drift (3 different ghosts in one video) | `quality_gate.py shots` + `story/creature.json` |
| 18 | Chapter cards landing on a face | **EYES** — Q16 |
| 19 | Scenes that do not match the narration at that moment | **EYES** — Q13 |
| 20 | Pictures reused from an earlier video | `frame_ledger.py` |

## Why some of these are not automated

A pixel detector for "is the character actually in this frame" was built and **tested
against the broken Reel. It failed.** Measured on that video, the centre edge-density of
known-bad empty-window seconds (6.2–8.6) overlapped the known-good close-ups (7.2–12.9); a
warm-colour character detector overlapped the same way. The window frame and the burned-in
captions carry as much detail as a person does.

A gate that returns PASS on a broken video is worse than no gate — that is exactly how the
repetitive video shipped. So those checks are a **sheet plus a checklist**, not a fake
pass. `tools/frame_qa.py` builds the sheet and prints all 16 questions.

## The order that prevents all of this

```
python3 tools/checkpoint.py
```

1. **story** — script, scene table and narration timing exist and line up
2. **cast** — the antagonist is declared in `story/creature.json` and locked
3. **scenes** — enough different scenes; nothing recycled
4. **labels** — every callout fits inside the frame, none over-used
5. **shots** — the built shot list passes the quality gate
6. **look** — the review sheet is built **and actually read**
7. **deliver** — rendered files pass the video gate and the cross-video ledger

It stops at the first failing stage, because everything after it depends on that stage.
Stages 1–5 need no render at all: they run in about a second, which is the whole point.

## Lying people — the generic fix

Rows 1 and 2 came from one line in a story kit:

```tsx
<g transform={`translate(${x},${y}) rotate(-90) scale(${k})`}>
  <CloseUp s={CAST.elias} ... />     // a head-and-shoulders close-up, tipped on its side
```

The engine's own `'lie'` motion was the same shape — the standing idle rig plus `rot:-90` —
so arms hung out into the air, props stayed in the hand, and the body flipped end-for-end
whenever the facing changed. `rotate(-90)` on a character appeared in **three** story kits.

Now:

- **`src/kits/Lying.tsx` → `LyingPerson`** is the only supported way to lay a body down.
  It uses the new `'supine'` / `'supineDead'` rig (arms along the body, legs together, head
  settled back, breathing in the chest), **strips props**, seats the body on the surface you
  name, draws a sheet and a contact shadow, and takes `fit` — the usable length of the bed —
  so the body is scaled down and **can never overhang the thing it lies on**.
- **`head` is fixed per scene** and never tied to the camera facing, so a body cannot flip
  end-for-end between two shots of the same bed.
- **`tools/lint_poses.py`** fails the build on any character wrapped in a rotation past 60°,
  and on the old `'lie'` motion. A genuinely intentional rotation is allowed with the
  comment `lint-ok: rotation`.

**Honest limit:** `LyingPerson` is still a front-view figure laid flat, not a purpose-drawn
side-on supine body. It no longer reads as a statue with a cane, and it stays inside the
bed, but a truly convincing lying figure needs real character art, not a rig change. Treat
this as "correct and safe", not "finished".

## The rule behind rows 1–9

Most of those faults share one cause: **a pose or a composition that was never drawn, so
something else got reused in its place.** A lying patient became a rotated standing rig. A
vertical composition became a cropped horizontal one. An empty beat became an empty room.

When the script needs something the kit cannot draw, **draw it** — do not rotate, crop or
substitute. If there is no time to draw it, change the shot to something the kit can do
honestly, and say so.
