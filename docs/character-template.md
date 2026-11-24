# The character template (engine v0.6) — law change

## What changed

**Old law** (`Cast3D.ts`, v0.5): one fixed cast for the whole channel. The same seven
faces appeared in every video, and a cast member's face, hair, body and height could
never change.

**New law** (v0.6): the character sheets are a **template, not a cast**. Every story
casts **new people**. What carries across videos is the design *language*, not the faces.

The specs still in `Cast3D.ts` are now **reference examples** — worked specs that show the
house style. Read them to learn the shape of a `P3`; do not drop them into a new story.
The only exception is a character the story itself says is returning.

## How to cast a story

```ts
import { makeCast, castProblems, describeCast } from './CastGen3';

const CAST = makeCast('the-listener-1931', [
  { id: 'danny',  name: 'Danny Hale',   hint: ['lead', 'man'] },
  { id: 'mother', name: 'Ruth Hale',    hint: ['woman'] },
  { id: 'sheriff',name: 'Cal Doyle',    hint: ['official', 'big'] },
  { id: 'gran',   name: 'Edith',        hint: ['old', 'woman', 'frail'] },
  { id: 'kid',    name: 'Posy',         hint: ['child'] },
]);

console.log(castProblems(CAST));  // must be empty before you draw anything
console.log(describeCast(CAST));  // paste into story/bible.md
```

`makeCast` hashes the **story slug**, so a different story deterministically produces
different people, and the same story always rebuilds identically. That matters: the long
video renders across many parallel GitHub Actions runners, and every runner must generate
the same cast.

Hints: `lead` `old` `child` `big` `frail` `tall` `short` `woman` `man` `worker` `boss`
`official` `poor` `rich`. Anything the generator returns can be overridden afterwards —
it gives you a cast that is already varied and consistent, not one you may not touch.

## The design language it enforces

1. **Build variety is the point.** One reference scene holds a lean young lead, a huge
   round chef, a broad stocky market man, a frail stooped old man and a slim upright
   woman. Six people of the same width is a failure. The generator spreads `build` across
   0.82–1.42 and refuses to repeat a value two people running.
2. **Silhouette first.** Each person must be recognisable as a black shape alone: width,
   height, hair outline, posture. Face detail is the last thing that reads at phone size.
3. **Posture carries the role.** Boss straight, dogsbody stooped, old man hunched.
4. **Costume says the job** before the face does: apron, work shirt, uniform, good coat.
5. **One red accent per story**, on one person only. It is the channel's only saturated
   colour.

## `castProblems` — the silhouette rule as a number

Run it before drawing. It reports:

- builds too close (spread under 0.3) — the cast reads as one body shape
- heights too close (under 0.14 m) — nobody stands out in a two-shot
- fewer than three hair shapes
- more than one person carrying the red accent
- top colours repeating too often

An empty array means the cast will read. A non-empty array means fix the hints and
re-generate before you spend a render on it.
