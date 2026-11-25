# CREATURE SHEET — "THE BLUE-MASK THING" (id: mask)

Built word-by-word from the story: Jack after the cult's ritual. One design, one antagonist, never drifting. The only allowed change between shots is a declared STATE (see below).

## From the story text
- It is what is left of **Jack**, so it has his tall young build — human height, not a giant. Height ~ 2.0 m (a tall man), thin.
- **Eyes**: the eyes are torn out. Two empty black sockets. From the sockets runs **black tears** — thick dark tar, like ink, down the cheeks and jaw (the story: "his tears were black", "thick now, like tar").
- **Mask**: a cracked **pale-blue ritual mask** is fixed over the face (the cult "fixed a blue mask to his face"). The mask has a thin mouth slit and two eye holes; through the eye holes only the black sockets and tar show. A crack runs across it.
- **Mouth**: under / around the mask the jaw can open wrong and far (it laughs, it devours). Shown as a dark slit, never teeth-on-flesh.
- **Arms / hands**: long and thin, longer than a man's, with long fingers and dark nails (it "broke free... tearing"). 
- **Skin**: pale grey, drained, with dark veins at the neck and hands.
- **Tendrils**: **black tendrils** rise from the ground around its feet and wrap its waist and ankles (the story: "black tendrils sprouted up like demonic weeds"). They move like slow weeds.
- **Clothes**: Jack's hoodie/shirt, now dark and wet-looking.

## Engine build
- Base: Monster-kit `CreatureSpec` id `mask`: tall, slight hunch, long arms/fingers, `eyes: 'black'` (hollow black sockets), `wet` high (tar sheen), pale grey skin, dark claws, no monster hair (Jack's own hair instead).
- Over the face: a drawn **pale-blue cracked mask** overlay with two holes and a slit.
- **Black tar**: drawn as dark streaks from the eye sockets and as a dark gloss on the chin/neck — NOT red.
- **Tendrils**: drawn as black weed-like strokes rising from the base, swaying with f.

## States (the ONLY allowed differences)
- `tar`: 0 (just torn, thin streaks) → 1 (tar covers the lower face and neck). 
- `free`: false = still bound in the chair, tendrils holding it; true = standing, loose, arms long, the circle torn.
It is shown full-body from two angles (front in the chair; side when it rises and when it breaks free), moving, in at least 6 shots. The thumbnail creature is this same creature.
