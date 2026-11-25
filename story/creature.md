# Creature sheet — Eyeless Jack (id: `jack`)

Built word-by-word from the story text. **One design, written once, imported everywhere** — never re-typed inside a set file.

- **Build:** a humanoid figure, adult-male height, standing or leaning.
- **Clothing:** a dark (near-black navy) hoodie, hood up, sleeves loose over long arms.
- **Mask:** a dull cerulean-blue mask covering the whole face. No nose, no mouth — the lower face is smooth, featureless mask.
- **Eyes:** two cavernous, entirely black, empty eye sockets cut into the mask (not painted-on holes — true depth/void).
- **Ooze:** a black fluid drips steadily from both eye sockets down the mask (state `ooze`, 0–1, how heavy the drip is).
- **Hands:** long, pale, clawed fingers extending from the hoodie sleeves — the only skin ever shown.
- **Movement:** leans over a sleeping victim, or lunges forward with the long fingers reaching for the chest. Never runs; always a slow, deliberate creep or a single sharp lunge.
- **Allowed states (the only permitted variation):**
  - `ooze` (0–1): how much black fluid is dripping — light at rest, heavy mid-lunge.
  - `pose` ("stand" | "lean" | "lunge"): standing in a doorway, leaning over the bed, or lunging with claws extended.
  - `face` (1 | -1): left/right mirror for the one-use law.
  - `px` (number): horizontal position offset, same purpose.

No other variant is permitted — a different mask colour, a visible mouth, or a non-black eye void would be a different monster and a failure.

## Contract
`story/creature.json`:
```json
{"id": "jack", "variants": [], "min_shots": 8}
```
