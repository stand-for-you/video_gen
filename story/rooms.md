# Rooms - built FIRST, looked at, then filled with people

Kit: `src/kits/AwakeHouse.ts`, three rooms. Every room has at least 5 readable objects and
2 light sources (quality law 4c). The six option keys below are the ones the one-use
signature can see (`room`, `door`, `window`, `ground`, `shape`, `clock`), so every one of
them is both a story state AND a legal way to make a returning room a new picture.

## Shared layout
Camera convention: yaw 0 looks down -Z. The near wall is at z = +1.0, the end wall at
z = -(D - 1). Floor y = 0, ceiling y = 2.6.

## bedroom   (W 4.0 x D 4.6)
| Readable object | Where |
|---|---|
| bed, head to the end wall, bedding with six folds + turned sheet + pillow | x -1.1, z -2.35 |
| bedside table with the digital clock (red digits) | x -0.1, z -3.15 |
| wooden chair, turned to face the bed | x 1.25, z -2.0 |
| window with a curtain on the right-hand wall | x 2.0, z -2.3 |
| chest of drawers with three drawers and knobs | x 1.3, z -3.3 |
| bedroom door, near wall, handle and two sunken panels | x 0.6, z 1.0 |
| poster on the left wall above the bed | x -2.0, z -1.6 |
| floor clutter: school bag, three blocks, a shoe | around the bed |
| ceiling light fitting (never switched on in this story) | centre |
| the under-bed gap, 0.17 m of clearance | under the bed |

Light 1: the window - cool moonlight `window:'curtained'|'blind'`, pale dawn `window:'dawn'`.
Light 2: the hall, through the bedroom door - a warm slot that widens with `door`.
`lightOn:false` for the whole frame story: the room is lit by window + door only, and it must
still be readable at phone size. No near-black frames except the one planned dark beat.

States used: `clock: '2:20'|'2:40'|'3:00'|'5:30'`, `door: 'shut'|'ajar'|'open'|'wide'`,
`ground: 'clean'|'drops'|'smear'|'pool'`, `shape: 'none'|'circle'|'pentagram'|'message'`,
`window: 'curtained'|'blind'|'dawn'`.

## hall   (W 1.9 x D 8.0)
Carpet (so blood reads on it), four panelled doors with numbers off, a framed picture, a side
table with a telephone, a wall light, and the stair landing at the far end.
Light 1: the wall light, warm, half way down. Light 2: cool spill from the landing window.
States used: `ground` (the blood: clean -> drops -> smear -> pool), `door` (the far bedroom
door), `window: 'blind'|'dawn'`.

## bathroom   (W 1.9 x D 2.2)
Tiled walls with a grout grid, basin with a tap and a mirror above it, a towel on a rail, a
toilet drawn as a simple closed white form, a frosted window, a pull cord.
Light 1: the bathroom light (`lightOn:true` - this is the one lit room in the story).
Light 2: the frosted window.
States used: `door: 'shut'|'ajar'|'open'`, `ground`, `lightOn`.
