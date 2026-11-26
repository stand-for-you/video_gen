// Scroll Kaos v0.5 - POV3D palette.
// Every colour here was measured off the reference video ("SHOOT EM", 1280x720, 30 fps)
// with a quantiser, not guessed. Do not re-type these numbers anywhere else: import them.
// A kit that hard-codes its own hex is a style drift and gate_shots.py fails the build.

export const INK = '#15121c';        // the ink line. NOT pure black - a very dark purple-black.
export const INK_SOFT = '#241f2e';   // secondary / interior line

export const PAL = {
  // --- night exterior ---
  skyTop: '#211f30',
  skyMid: '#2d2842',
  skyLow: '#3a3450',
  skylineBlock: '#191726',
  windowLit: '#f2d479',
  windowDim: '#8f7a3c',

  // --- street ---
  asphalt: '#232227',
  asphaltLit: '#3b3942',
  kerb: '#45434d',
  sidewalk: '#3a3841',
  brick: '#5c322b',
  brickLit: '#954738',
  brickHot: '#d16b55',
  brickMortar: '#43322c',
  lampWarm: '#f2a96b',
  lampCore: '#ffc98a',
  neonGreen: '#5fd38f',
  neonRed: '#ef5661',
  metal: '#2f2929',
  metalLit: '#4a4349',

  // --- interiors ---
  roomWall: '#d0c5b3',
  roomWallDim: '#9a9183',
  hallWall: '#b9b2a2',
  floorWood: '#4a3526',
  floorTile: '#56525c',
  doorWood: '#5a3b2a',
  bedPink: '#efa8c0',
  bedPinkDim: '#c07f96',
  sheetCream: '#eadfc0',

  // --- car ---
  carSeat: '#4e4b56',
  carSeatLit: '#625e6b',
  carRoof: '#2a2832',
  dashDark: '#1d1c23',
  dashGreen: '#5fe39a',
  glass: '#39394a',
  glassCrack: '#cfd4e0',

  // --- people ---
  skinA: '#e8b893',  skinAD: '#b77867',
  skinB: '#c88c62',  skinBD: '#8e5f41',
  skinC: '#8a5a3e',  skinCD: '#5e3c28',
  eyeWhite: '#f6f2ea',
  eyeInk: '#191521',
  tearStreak: '#f3ece0',

  // --- the antagonist (one-creature law: state changes, design never) ---
  maskPale: '#f2ece2',
  maskShade: '#cdc4b6',
  creatureCloth: '#413f4a',
  creatureClothDark: '#2b2932',
  creatureHand: '#efe2d1',
  creatureHair: '#4a3b30',
  creatureTear: '#15121c',
  pendantGold: '#e8c25c',

  // --- blood (channel limit: stains, drips, pools - never an open wound) ---
  blood: '#b3171d',
  bloodWet: '#d9242b',
  bloodDry: '#6e1217',

  // --- UI / cards (exact values from the reference cards) ---
  cardBg0: '#09020b',
  cardBg1: '#1b0e2e',
  coral: '#fb5a70',
  coralSoft: '#f38d90',
  orange: '#f18b51',
  green: '#2ca15c',
  greenDark: '#1d6b3d',
  gold: '#f9d261',
  white: '#fdfdfd',
  grey: '#9e9da4',
  greyDark: '#5b5c62',
  glitchRed: '#ff3a52',
  glitchCyan: '#49e3e8',
} as const;

export type PaletteKey = keyof typeof PAL;

// Speaker colours. The reference colours BOTH the speaker tag and the caption text.
// Protagonist is the only one with a white caption; everyone else tints their own line.
export const SPEAKER = {
  you:      { tag: PAL.gold,   text: PAL.white },
  creature: { tag: PAL.coral,  text: PAL.coralSoft },
  ally:     { tag: '#7fc2ff',  text: PAL.white },
  family:   { tag: '#8fe3a8',  text: PAL.white },
  child:    { tag: '#ffa8d2',  text: PAL.white },
  stranger: { tag: PAL.grey,   text: PAL.white },
} as const;
export type SpeakerRole = keyof typeof SPEAKER;
