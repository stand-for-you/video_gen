# The POV3D look (v0.5) - measured, not guessed

Everything on this page was read off the reference video the user supplied
(`New_style_want.mp4`, 8:11, 1280x720, 30 fps, -16.5 LUFS) and off its 491 extracted frames.
Numbers here are measurements. Do not "improve" them from memory.

## 1. What the style actually is

A **first-person 3D world drawn to look hand-inked.** Not a 2D slideshow with a pan, and not
a clean 3D render either. Three layers stacked:

| Layer | What it does | Where it lives |
|---|---|---|
| real 3D geometry | gives true POV perspective, parallax and vertigo that 2D cannot fake | `src/kits/*`, `src/cast/*` |
| flat 2-3 step toon fill + a pixel-width ink shell | the cel look and the closed silhouette | `src/three/toon.ts` |
| a seeded turbulence warp over the whole frame | turns the perfect ink line into a wobbling drawn line | `src/three/Post3D.tsx` |

**Why the warp and not a per-mesh outline wobble.** The reference's line has varying weight
and a visible wobble, and the *fills* wobble with it. That is one displacement applied to the
finished picture, not a shader on each object. Warping the composite also costs the same
whether the shot has 20 objects or 2000, and it is deterministic from the frame number, which
is what lets cloud chunk rendering match frame for frame.

**The boil runs on twos** - one new wobble every 2 frames at 30 fps, i.e. 15 drawn frames a
second. Every frame looks like video noise. Never changing looks like 3D.

## 2. Measured palette

Dominant colours, from a quantiser over the reference frames:

| Use | Hex | Note |
|---|---|---|
| ink line | `#15121c` | NOT pure black - a very dark purple-black |
| card background | `#09020b` to `#1b0e2e` | radial, darkest at the corners |
| coral accent | `#fb5a70` | the one accent word in a title; the creature's caption |
| orange kicker | `#f18b51` | "END OF PART 1", "THE FULL STORY · PARTS 1-4" |
| choice green (option A) | `#2ca15c` | |
| choice orange-red (option B) | `#e2543f` | |
| gold | `#f9d261` | the chosen badge, the closing line, the recap text |
| brick | `#5c322b` / lit `#954738` / hot `#d16b55` | |
| asphalt | `#232227` | |
| night sky | `#211f30` to `#2d2842` | |
| lit window | `#f2d479` | |

## 3. Typography

One family: a heavy geometric sans with round terminals. **Montserrat**, weights 700/800,
plus 800 italic. It ships in `engine/public/fonts/` and is loaded from disk - a render must
never reach the network for type.

| Element | Size at 1920 wide | Treatment |
|---|---|---|
| title | 150 px, weight 800 | white, one coral accent word, soft dark glow |
| tagline | 40 px italic | white, one coral emphasis word |
| kicker | 23-26 px | uppercase, letter-spacing `0.22em` |
| "WHAT DO YOU DO?" | 104 px | white, soft glow |
| caption | 52 px | uppercase, 5 px hard ink stroke |
| speaker tag | 21 px | letter-spacing `0.14em`, coloured dot in front |
| comic SFX | 76 px (shout) / 42 px (whisper) | bold italic, cream `#f7eccb`, heavy stroke |

## 4. Subtitles - the two things that are easy to get wrong

1. **The speaker colour tints the CAPTION TEXT, not only the tag.** The protagonist is the
   only speaker whose caption is white. The antagonist's own lines are coral.
2. **The tag is a badge, not a bar** - about a third the caption size, directly above it,
   with a small filled dot in front, and the situational state in lowercase brackets
   (`(on the phone)`, `(in the closet)`, `(whispering)`).

Chunks are 2-6 words, at most 2 lines, cut to the voice timing.

## 5. Pacing and motion, measured

| Measure | Reference value | What v0.5 does |
|---|---|---|
| frame rate | 30 fps | 30 fps (v0.4 shipped **10**, which is most of why it looked stiff) |
| mean shot length | 3.5 s | `build_shots.py` floor 0.8 s, ceiling 9 s, held beats must be declared |
| shots under 2.5 s | 72 % in chase sections | teaser shots capped at 2.5 s |
| integrated loudness | -16.5 LUFS, LRA 9.8 LU | long video targets -16, Reel -14 |
| gap between urgent lines | 0.30 s in a beat, 0.45 s between beats | set in `story/voices.py` |

**One place the reference is worse than the standard, and v0.5 does not copy it:** around
5:00 the picture is completely still for stretches of about 3 s (85 of 119 sampled frames
with no motion at all). The rig keeps an `idle_breath` floor under every preset, so a held
beat still breathes. A truly frozen frame is a fault, not tension.

## 6. The creature blueprint

Shape language from the reference, parameterised in `src/cast/Creature3D.ts` so a new story
gets its **own** creature out of the same rig:

- 1.45-1.6x adult human height, arms about 1.5x human length
- a pale mask-like face plate on a long flattened skull
- hollow black sockets with a tiny white pinprick pupil
- black vertical tear tracks running down from the sockets
- a long jagged grin with stitch marks across it
- long stringy hair either side of the plate
- a dark hoodie with drawstrings, a pocket, and one small gold pendant
- long skeletal clawed hands

The pendant matters: it is a small readable prop that proves across shots that this is the
same creature. The **one-creature law** allows only a *declared state* to change between
shots - `wet`, `burnt`, `blood`, `tilt`. A different design is a different monster and the
build fails.

## 7. The POV hands

Visible in roughly a third of the reference's shots. Flat cartoon shape, thick ink line, no
interior shading (shading reads as a glove). **Keep the forearm short** - a long sleeve tube
takes over the bottom of the frame and the shot stops being about what the hand is doing.
Eight poses ship: `balance_wide`, `reach_grab`, `brace_door`, `push_punch`, `knock_open`,
`hold_phone`, `brace_fall`, `grip_rail`.

## 8. Faults found while building this, so they are not repeated

| Fault | Why it happened | The fix that is now in the code |
|---|---|---|
| no ink outline anywhere | the hull was scaled by a factor, so on a 60 m wall the factor rounded to 1.0 | the shell is pushed along the normal in clip space by a fixed number of PIXELS |
| outline tore open at box corners | box geometry has split normals | a baked `aInkNormal` attribute, normalised by half-extent |
| the creature's face was a blank dome | the face plate sat exactly on the skull sphere and z-fought | features pushed clear and given an explicit `renderOrder` |
| the rooftop beam ran parallel to the gap | the two buildings were placed left and right of a beam that also ran left to right | buildings are near and far; the beam crosses the gap the POV walks along |
| the closet read as giant coloured cones | coats modelled at the wrong scale, camera inside them | rebuilt at human scale, camera outside the rail, key light moved in front of the slats |
| cards rendered in a fallback face | fonts were fetched from Google at render time and the proxy blocked them | the font files ship in `public/fonts` and load from disk |
