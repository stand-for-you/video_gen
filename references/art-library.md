# Art library (what the engine already draws)

Coordinates: 16:9 sets draw on 1920x1080, 9:16 sets on 1080x1920. Draw past the edges (x from -600) because the camera zooms. Every set is `React.FC<{ f: number; v: any }>`: `f` = animation frame (already x3), `v` = the variant dict from the scene table. Use `sf(f, 3)` (stepped frame) for all motion so it moves in paper-cutout steps.

## Core (never change the drawing)
- **Kit.tsx**: `INK` (outline colour), `RED`, `rng(seed)`, `Defs` (filters), `Hatch` (painted hatching), `Hand` (x, y, s, rot, skin, shade, ext[4 finger openness], thumb, sleeve, sleeveLen, long).
- **Body.tsx**: `NOAH` look; `FullMan({ look, view: front|three|back, x, y, s, f, expr })` = Noah Reed full body (about 3000 units tall; s 0.15-0.3 for a 1080-high frame; origin = feet). `GhostWoman`, `GhostGrin`, `GhostChild` full ghosts.
- **Faces.tsx**: `FaceNoah({ expr, f, turn })`, `FaceWoman`, `FaceGrin`, `FaceChild` (face about 450 wide, origin = face centre).
- **Cast.tsx**: `CAST` (mira, elias, rose, sam, lily, dale), `Spec` type, `FullPerson({ s, x, y, k, f, expr })`, `FacePerson({ s, expr, f })` (no hair: add `HairBack` + `HairFront`). Expressions: `neutral`, `fear`, `speak` ('speak' looks like a smile: avoid it in sad or scary moments). Faces blink when f % 96 < 4.
- **CastExtra.tsx**: `LYRA`, `OLIVER`, `TERENCE` (added in later videos, same builder). Add new people here.
- **Thumbs.tsx**: `HorrorBack({ W, H, moon: [x, y, r], gy })`, `Reach` (pale hand from the ground), `Title({ a, b, sa, sb, align })` (white + glowing red Lora).
- **Room.tsx**: `Snow` (ash/snow specks), `Thread`.
- **Post.tsx**: `Stage` (boil filter, paper multiply, grain, vignette). **Player.tsx**: shots, camera (from camera.ts), chapter cards (from Card.tsx). **Gal/GalR**: set galleries.

## Helper libraries from earlier kits (reuse freely)
- **SD.tsx (kit k, Smile Dog)**: `Q` palette; `Alive({ x, y, f, mode: idle|walk|shake|lean, k })` motion wrapper; `Noah({ x, y, s, f, view, expr, mode, note })` (Noah + notebook); `Person({ s, x, y, k, f, expr, mode })`; `Face({ who: noah|mary|terence, x, y, k, f, expr, rot, tears, turn, glow })` (close-up with hair and shoulders; copy this pattern for other cast); `Shoulders`; creature `DogHead`, `DogSit`, `Beckon` (pale beckoning hand), `Picture` (the cursed photo scene); props `CRT` (552x396 screen slot), `Laptop` (740x520 screen slot), `Screen({ mode })` (bbs, users, search, fakes, chain, forum, post, letter, obit, zahir, attach, article, inbox, inboxm, picture, off), `Tower`, `Keyboard`, `Modem`, `DeskPhone`, `Floppy`, `Envelope`, `Desk`, `Lamp`, `Barrel` (fire), `City` (skyline + L train), `Wood70`, `Blocks`, `Carpet`.
- **IH.tsx (kit j, It's Inside Your House)**: `R` (full-frame rect), `Glow` (radial light), `Walls`, `Planks`, `Door`, `Blinds`, `Bed`, `Nightstand`, `Closet`, `Frame` (wall picture), `Tiles`, `Vanity`, `Mirror`, `Toilet`, `LightBar`, `Stairs`, `GClock`, `Shards`, `Sofa`, `CTable`, `Curtain`, `BrokenWin`, `Cabinets`, `Pan`, `Keys`, `Knife`, `Drawer`, `Powder`, `SpiceRack`, `SlideDoor`, `BasementDoor`, `Sedan`, `RollDoor`, `Concrete`, `Shelf`, `Dash`, `StreetLamp`, `HouseExt`, `Sky`, `Clouds`, `Rain`, `PitchPine`, `Barrens`, `Seg7`, `AlarmClock`. (`Flash`/`Bolt` exist but break the photosensitive rule if used fast: do not use repeated flashes.)
- **Beast.tsx (kit j)**: `sf`, `taper(points, w0, w1, spikes, seed)` (tapered limb/fur path), `furry(loop, spike, seed)` (hairy outline), creature `Beast`, `SkullHead`, `Sil` (black silhouette), `NoahSleep` (Noah in sleep clothes), `NFace`.

## Writing a new kit file
1. Create `src/<Kit>.tsx` with the story palette (one red accent), new props, the creature (original design, non-graphic) and costume notes (for example `const MARY = { ...CAST.mira, topC: ... }`).
2. `SetsL.tsx`: one component per place/moment; read options from `v` (positions, expressions, dark level, screen mode) so one set gives many unique scenes. End every set with a soft dark overlay (`<R c="#05030a" op={v.dark ?? 0.2} />`). Wrap every person in motion (`Person`, `Noah` or `Alive`).
3. `SetsR.tsx`: the same places drawn again for 1080x1920 (taller rooms, people larger, key content between y 180 and 1420 for the captions). No import from SetsL.tsx.
4. Required card sets: `crtoff`-style cut line (optional), `qcard` (credit card, `credit` variant), `end` (long end screen with the clear zones: two video boxes on the right at about x 1180, y 150 and y 580, 620x349 each; a subscribe circle near x 780, y 890, r 120; the closing question top-left; channel name; tiny idle hero; faint creature), and for the Reel `rqcard` (credit variant + the question variant as the very last shot).
5. `Card.tsx`: a new chapter card ornament (examples so far: LED clock slip, floppy-disk label, clipboard file, notebook paper, lace scallop). Lora font.
6. `camera.ts`: a camera habit different from the last 3 videos.
7. `ThumbsStory.tsx`: four thumbnails with HorrorBack, the giant face (cast ghost, or the creature when the story has no ghost), tiny Noah back view (`FullMan view="back"`), Reach hands, Title.

## QA reading guide (contact sheets)
Look for: cut-off hands or props at the frame edge, floating heads (close-up without shoulders), people standing on furniture or floating, doubled shapes, empty frames, the same picture twice in a row, wrong text on a screen for the moment, a smile on a crying face, text overlapping, Reel content behind the caption zone, anything flashing.
