# The house cast

> **Two rosters ship.** The six archetypes below are the generic starting roster. The
> thirteen named characters in `engine/story/cast.json` — The Boy, Father, Mother, The
> Creature, The Girl, The Old Man, The Villain, The Ghost, The Scarecrow, Police Officer,
> Doctor, Villager, Child — are the **built, locked cast** drawn from the reference sheets,
> each with a four-view turnaround and six expressions. See `character-style.md` for what the
> render style is and where it differs from a photoreal reference.

Six archetypes plus the antagonist. They are a **starting roster**, not a locked cast: a new
story renames them and swaps colours, but keeps the one rule that matters — **every character
must be tellable apart by silhouette alone, in the dark, at a distance.** Height, hair shape
and garment colour are the three levers. If two characters would read the same as shadows,
change one of them before writing a single line.

Render the whole roster any time you change the look:

```bash
node tools/preview/shot_preview.mjs qa/cast_sheet.json qa/sheet
```

## The one you play

The protagonist is **never modelled**. You only ever see their hands
(`src/cast/FPSHands.ts`). That is the format: the moment you cut to their face, the video
stops being "what would *you* do". Give them a name, a voice and a caption colour, and
nothing else.

| | |
|---|---|
| caption | white text, gold speaker tag |
| voice tag | `you` (in scene) / `nar` (telling it) |
| hands | skin + sleeve colour, set once in the scene table |
| poses | `balance_wide` `reach_grab` `brace_door` `push_punch` `knock_open` `hold_phone` `brace_fall` `grip_rail` |

## The five on screen

| Name | Height | Build cue | Hair | Top | Legs | Role in a story |
|---|---|---|---|---|---|---|
| **WREN** | 1.12 m | smallest silhouette by a clear margin | `pigtail`, `#3a2a22` | `#efa8c0` | `#d98ca6` | the one in danger; the reason a choice costs something |
| **DEX** | 1.50 m | child proportions, adult posture | `bowl`, `#2b2026` | `#4a6ea8` | `#36384a` | the younger sibling who will not stay behind |
| **MARA** | 1.63 m | tallest silhouette with a raised crown | `bun`, `#1f1a20` | `#b8683f` | `#3b3550` | the one who argues, decides, and is sometimes wrong |
| **COLE** | 1.71 m | flat-topped silhouette from the cap | `cap`, `#2b2026` | `#5f8f5f` | `#36384a` | the friend; the driver; the one who shows up |
| **IBI** | 1.76 m | widest crown, heaviest frame | `curly`, `#191419` | `#6a6370` | `#2c2b36` | the grown-up who arrives too late or not at all |

Skin tones ship varied and are set per character (`skin` + `skinShade`); they are a design
choice for the story, not a fixed property of the archetype.

**States** (`state` on any actor): `crying` paints the two bold pale cheek streaks,
`mouth` takes `rest` `open` `wide` `grit` `small` `flat`, `eyesShut` closes the eyes,
`blood` takes `none` `spots` `smear` — stains on clothing only, never an open wound.

**Poses:** `stand` `walk` `run` `reach` `cower` `point` `held_up` `lie` `fall` `hug` `sit`
`crawl`.

## HUSH — the antagonist

The shipped antagonist, and the template for every future one. Its spec lives **once**, in
`story/creature.json`, and is passed to `buildCreature()`. Never re-type its numbers inside a
set — that is how a monster drifts.

| Feature | Value | Why |
|---|---|---|
| height | **1.52×** an adult (≈ 2.6 m) | tall enough to loom in a doorway, not so tall it stops fitting in a car |
| arms | **1.5×** human length | the reach is the threat; it can take someone from further away than feels fair |
| face | long flattened pale plate, `#f2ece2` | a mask, not a face — nothing behind it reacts |
| eyes | hollow black sockets, one white pinprick each | the pinprick is what makes it *looking at you* |
| tears | wide black tracks running past the grin | the only part of it that moves like grief |
| mouth | long jagged grin, 7 stitch marks | stitches read at any distance; teeth do not |
| hair | long dark locks framing the plate, `#4a3b30` | half the silhouette — without it the head reads as a balloon |
| body | dark hoodie, drawstrings, pocket, `#413f4a` | ordinary clothes make the wrong head worse |
| pendant | small gold disc, `#e8c25c` | the continuity prop: proof across shots that this is the same creature |

**Poses:** `stand` `loom` `crouch_spider` `reach` `hold_two` `stride` `lean_lens`.

**Declared states — the ONLY thing allowed to differ between shots:** `wet` · `burnt` ·
`blood` · `tilt` (head angle in degrees). Anything else is a redesign, and a redesign fails
the build.

## Naming a new cast

Short, hard, one or two syllables, and no two starting with the same letter — speaker tags
are read in a fifth of a second at the bottom of a moving frame. `WREN / DEX / MARA / COLE /
IBI / HUSH` is six distinct first letters and six distinct shapes on the page. Keep that
discipline even when the story hands you real names.

## Faults found building this roster, so they are not found again

| Fault | Cause | Fix now in the code |
|---|---|---|
| the whole cast faced the wall | the facing convention was documented backwards — the face is drawn at **+Z**, so yaw 0 faces a camera at +Z | the comment is corrected in both rigs; check it before placing a cast |
| no ink line on anyone | the outline offset the already-projected clip-space xy by a normal that had also been run through the projection matrix, which is not a valid direction transform | the offset is now applied in **view space** by the exact world distance that covers N pixels at that vertex's depth |
| the preview under-reported line weight | the preview never called `setOutlineResolution`, so the line scaled with the preview size | the harness now pins it to the 1080 delivery height |
| hair covered the eyebrows | hemisphere caps were swept past their own equator and placed low | a shared `HAIRLINE` constant at +0.4 R, with the back of the head covered separately by `occiput()` |
| the creature's eyes read as lollipops | the tear track started inside the socket and was as narrow as the pupil | the track starts at the socket's bottom edge, is twice as wide, and runs past the grin |
| the creature floated in its crouch | a crouch folds the legs but the hips were never lowered | `crouch_spider` drops the body 0.3 × height |
| hips showed a diagonal seam | a capsule laid on its side met the torso at an angle | hips are a box |
