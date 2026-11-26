# Creature sheet - the thing under the bed

ONE-CREATURE LAW: this sheet is written once, locked into `story/cast.json` under the key
`entity` and `story/creature.json`, and imported from there by every scene. No scene re-types
a number from this page. The only legal difference between two shots of it is a declared
state (`blood`, `tilt`, `wet`, `burnt`).

## Straight from the story's own words
| The story says | The build |
|---|---|
| "It was not human, I can tell you that much." | nothing human-readable on the face at all |
| "It was hairless" | `hairStyle: 'none'` - no hair anywhere, not even brows |
| "with no eyes" | `face: 'blank'` - NO sockets, NO pinpricks, NO mouth. A smooth plate. |
| "and no clothing." | bare body; `cloth` is skin colour, not a garment |
| "It walked like a caveman, with its back slouched" | `pose: 'crouch_spider'` / `'loom'`, never upright |
| "as it dragged my dead parents" | `pose: 'hold_two'` for the drag; arms carry the weight |
| "this thing was smarter than any caveman" | it arranges, it paints, it waits. It never hurries. |
| "it propped my father... it then sat my mother down" | it poses bodies with its hands |
| "rubbing its hands along the walls" | the hands are the brush; the palms stay red after |
| "positioned itself under my bed" | the last shot of it is the under-bed gap |

## Locked numbers (from story/cast.json `entity`)
- `scale: 1.52` - about 2.6 m standing, which is why it is always bent under a 2.6 m ceiling
- `armLong: 1.62` - hands hang past the knees
- `face: 'blank'`, `skull: 'bulb'`, `hairStyle: 'none'`, `tears: false`
- `mask: #cfc7bd`, `cloth: #cfc7bd`, `clothDark: #b3aaa0`, `hands: #dcd4c9`
- declared state used in this story: `blood: true` from the moment it touches the parents
  (red palms and forearms) - the same design, a declared state, not a redesign.

## How it must be shot (quality law 4a)
- at least **6** shots, **full body**, from **two** angles, and **moving**
- the ceiling forces the slouch: at 2.6 m it cannot stand straight indoors, and that is the
  silhouette - a long back bent under the ceiling, head low, arms nearly on the floor
- it is **lit**: window light on the back, hall light on one shoulder. Never a black blob.
- the thumbnail creature is this creature.

## Why "blank" is the right face
The story gives it no eyes and no mouth to describe, so there is nothing for a viewer to
read, and a still frame of it cannot be "figured out". Resist adding a hint of a feature.
