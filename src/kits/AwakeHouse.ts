// Scroll Kaos v0.5 - AwakeHouse. The three rooms of "I Know You're Awake".
//
// WHY A STORY KIT AND NOT ApartmentInterior
// This story needs four things the shared apartment kit cannot draw: a wooden chair a dead
// woman is actually sitting on, a wall that grows a circle, a pentagram and then a READABLE
// line of writing, a hall carpet that goes from clean to a dragged smear, and a bathroom.
// Faking them (a figure sitting on nothing, a message the viewer has to be told about) is
// exactly the "pose that was never drawn, so something else was reused in its place" fault
// in references/quality-law.md section 9b.
//
// THE SIX SIGNATURE OPTIONS
// tools/shotsig.py can only see these kitOpts keys: room, door, window, ground, shape, clock
// (plus lightOn and wash for the light bucket). So every state this story needs to change is
// carried on one of those keys on purpose. That is what makes a return to the bedroom a
// legally NEW picture instead of a repeat:
//   room   bedroom | hall | bathroom
//   door   shut | ajar | open | wide            (how far the room's main door stands open)
//   window curtained | blind | dawn             (black night -> grey 5:30 a.m. dawn)
//   ground clean | drops | smear | pool         (the blood, as stains and drips only)
//   shape  none | circle | pentagram | message  (the thing's "masterpiece" growing on the wall)
//   clock  off | 2:20 | 2:40 | 3:00 | 5:30      (red digits on the bedside table)
//
// Colours come from ../three/palette only. A kit that types its own hex is a style drift.

import * as THREE from 'three';
import { PAL, INK } from '../three/palette';
import { toon, flat, box, decal, inked, nightRig } from '../three/toon';
import { hash2 } from '../three/noise';

export type AwakeRoom = 'bedroom' | 'hall' | 'bathroom';
export type AwakeDoor = 'shut' | 'ajar' | 'open' | 'wide';
export type AwakeWindow = 'curtained' | 'blind' | 'dawn';
export type AwakeGround = 'clean' | 'drops' | 'smear' | 'pool';
export type AwakeShape = 'none' | 'circle' | 'pentagram' | 'message';
// The clock really does tick through the night, so it is both the strongest story prop in
// the bedroom and the strongest signature lever the props bucket has. Add a value here
// before a scene uses it, so a typo cannot silently render a blank face.
export type AwakeClock = 'off'
  // the long video's readings
  | '11:40' | '2:20' | '2:21' | '2:28' | '2:33' | '2:41' | '2:47' | '2:55' | '3:01'
  | '3:04' | '3:08' | '5:26' | '5:30' | '5:33'
  // the Reel is a separate telling and carries its own, so no Reel picture can share a
  // prop state with the long video's picture of the same moment
  | '2:22' | '2:23' | '2:30' | '2:34' | '2:44' | '2:52' | '2:56' | '3:02' | '3:06'
  | '3:09' | '5:28' | '5:31' | '5:34';

export type AwakeOpts = {
  seed?: number;
  room?: AwakeRoom;
  door?: AwakeDoor;
  window?: AwakeWindow;
  ground?: AwakeGround;
  shape?: AwakeShape;
  clock?: AwakeClock;
  /** the ceiling light. false for the whole bedroom story - window + hall light only. */
  lightOn?: boolean;
  /** how the bed is left. Not a signature key: never rely on it to make a new picture. */
  bedding?: 'made' | 'open' | 'tent' | 'held';
  /** dark red hand marks left on the wall after it paints. */
  handPrints?: boolean;
};

export const AWAKEHOUSE_READABLE = [
  'bed with folded bedding and a turned sheet', 'pillow', 'bedside table', 'digital clock with red digits',
  'wooden chair', 'curtained window', 'chest of drawers with knobs', 'panelled door with a handle',
  'poster over the bed', 'school bag and floor clutter', 'under-bed gap', 'ceiling light fitting',
  'hall carpet', 'framed picture', 'hall side table with a telephone', 'wall light', 'stair landing',
  'basin with a tap', 'bathroom mirror', 'towel on a rail', 'tiled wall with grout lines', 'pull cord',
];

// ---------------------------------------------------------------------------------------
// small shared parts
// ---------------------------------------------------------------------------------------

/** A wall panel group: children are placed in (u = along the wall, v = up) and the group
 *  turns them onto the wall. Used for the window, the poster and the masterpiece, so none of
 *  them has to do its own trigonometry (and none of them can end up facing inside a wall). */
const wallPanel = (x: number, facing: -1 | 1): THREE.Group => {
  const g = new THREE.Group();
  g.rotation.y = facing < 0 ? -Math.PI / 2 : Math.PI / 2;
  g.position.set(x, 0, 0);
  return g;
};

/** A straight stroke inside a wall panel: centre (u, v), length, thickness, angle. */
const stroke = (u: number, v: number, len: number, th: number, ang: number, color: string, op = 1) => {
  const m = decal(len, th, color, op);
  m.position.set(u, v, 0.004);
  m.rotation.z = ang;
  return m;
};

/** Stroke font, 11 glyphs - only what the message needs. Each glyph is a list of
 *  [x1, y1, x2, y2] segments in a 0..1 box, drawn as thin quads. The message is the payoff
 *  of the whole video, so it has to be genuinely readable, not a squiggle. */
const GLYPH: Record<string, number[][]> = {
  I: [[0.5, 0, 0.5, 1], [0.2, 1, 0.8, 1], [0.2, 0, 0.8, 0]],
  K: [[0.15, 0, 0.15, 1], [0.15, 0.45, 0.85, 1], [0.15, 0.45, 0.85, 0]],
  N: [[0.15, 0, 0.15, 1], [0.15, 1, 0.85, 0], [0.85, 0, 0.85, 1]],
  O: [[0.15, 0.15, 0.15, 0.85], [0.85, 0.15, 0.85, 0.85], [0.15, 0.85, 0.5, 1], [0.5, 1, 0.85, 0.85], [0.15, 0.15, 0.5, 0], [0.5, 0, 0.85, 0.15]],
  W: [[0.05, 1, 0.3, 0], [0.3, 0, 0.5, 0.6], [0.5, 0.6, 0.7, 0], [0.7, 0, 0.95, 1]],
  Y: [[0.1, 1, 0.5, 0.5], [0.9, 1, 0.5, 0.5], [0.5, 0.5, 0.5, 0]],
  U: [[0.15, 1, 0.15, 0.2], [0.15, 0.2, 0.5, 0], [0.5, 0, 0.85, 0.2], [0.85, 0.2, 0.85, 1]],
  R: [[0.15, 0, 0.15, 1], [0.15, 1, 0.75, 0.9], [0.75, 0.9, 0.75, 0.55], [0.75, 0.55, 0.15, 0.45], [0.35, 0.45, 0.85, 0]],
  E: [[0.18, 0, 0.18, 1], [0.18, 1, 0.82, 1], [0.18, 0.5, 0.7, 0.5], [0.18, 0, 0.82, 0]],
  A: [[0.05, 0, 0.5, 1], [0.5, 1, 0.95, 0], [0.22, 0.38, 0.78, 0.38]],
  "'": [[0.5, 1, 0.42, 0.62]],
};

/** Write a line of dragged finger-writing into a wall panel.
 *  Every stroke is jittered from a seed, so it reads as a finger and not as a font. */
const fingerWriting = (
  g: THREE.Group, text: string, u0: number, v0: number, h: number, color: string, seed: number, th = 0.028,
) => {
  const wGlyph = h * 0.62;
  const gap = h * 0.24;
  let u = u0;
  let k = 0;
  for (const chRaw of text.toUpperCase()) {
    if (chRaw === ' ') { u += wGlyph * 0.8; continue; }
    const segs = GLYPH[chRaw];
    if (!segs) { u += wGlyph + gap; continue; }
    for (const [x1, y1, x2, y2] of segs) {
      k++;
      const jx = (hash2(k, seed) - 0.5) * h * 0.07;
      const jy = (hash2(k + 40, seed) - 0.5) * h * 0.07;
      const ax = u + x1 * wGlyph + jx;
      const ay = v0 + y1 * h + jy;
      const bx = u + x2 * wGlyph + jx;
      const by = v0 + y2 * h + jy;
      const len = Math.hypot(bx - ax, by - ay);
      const ang = Math.atan2(by - ay, bx - ax);
      // thickness varies along the line the way a wet finger does
      const t = th * (0.72 + hash2(k + 80, seed) * 0.7);
      g.add(stroke((ax + bx) / 2, (ay + by) / 2, len + t * 0.6, t, ang, color));
    }
    u += wGlyph + gap;
  }
};

/** The circle + inverted pentagram + the line of writing, in the parents' blood.
 *  Stains only: there is no wound and no body anywhere in this group. */
const masterpiece = (state: AwakeShape, seed: number, handPrints: boolean): THREE.Group => {
  const g = wallPanel(1.975, -1);
  if (state === 'none') {
    if (handPrints) {
      for (let i = 0; i < 5; i++) {
        const p = decal(0.17, 0.21, PAL.bloodDry, 0.85);
        p.position.set(-0.35 - i * 0.2, 1.08 + hash2(i, seed) * 0.5, 0.004);
        p.rotation.z = (hash2(i + 9, seed) - 0.5) * 0.8;
        g.add(p);
      }
    }
    return g;
  }
  const cu = -0.95, cv = 1.62, R = 0.48;
  // the circle: 44 short chords, each its own weight, so the ring wobbles like a drag
  for (let i = 0; i < 44; i++) {
    const a0 = (i / 44) * Math.PI * 2;
    const a1 = ((i + 1) / 44) * Math.PI * 2;
    const rr = R * (0.965 + hash2(i, seed) * 0.07);
    const x1 = cu + Math.cos(a0) * rr, y1 = cv + Math.sin(a0) * rr;
    const x2 = cu + Math.cos(a1) * rr, y2 = cv + Math.sin(a1) * rr;
    g.add(stroke((x1 + x2) / 2, (y1 + y2) / 2, Math.hypot(x2 - x1, y2 - y1) * 1.5,
      0.032 * (0.7 + hash2(i + 7, seed) * 0.8), Math.atan2(y2 - y1, x2 - x1),
      i % 7 === 0 ? PAL.bloodWet : PAL.blood));
  }
  // drips off the bottom of the ring - blood is wet and it runs
  for (let i = 0; i < 6; i++) {
    const a = Math.PI + (i - 2.5) * 0.3;
    const len = 0.07 + hash2(i + 3, seed) * 0.26;
    g.add(stroke(cu + Math.cos(a) * R * 0.98, cv + Math.sin(a) * R * 0.98 - len / 2,
      len, 0.022, Math.PI / 2, PAL.bloodDry, 0.95));
  }
  if (state === 'pentagram' || state === 'message') {
    // inverted five-point star inside the ring: one point down, two up
    const pr = R * 0.84;
    const pts: [number, number][] = [];
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + (i * 4 * Math.PI) / 5;   // step by two points = the star
      pts.push([cu + Math.cos(a) * pr, cv - Math.sin(a) * pr]);
    }
    for (let i = 0; i < 5; i++) {
      const [x1, y1] = pts[i];
      const [x2, y2] = pts[(i + 1) % 5];
      g.add(stroke((x1 + x2) / 2, (y1 + y2) / 2, Math.hypot(x2 - x1, y2 - y1), 0.03,
        Math.atan2(y2 - y1, x2 - x1), PAL.blood));
    }
  }
  if (state === 'message') {
    fingerWriting(g, "I KNOW YOU'RE AWAKE", -2.2, 0.84, 0.15, PAL.blood, seed + 11, 0.02);
  }
  if (handPrints) {
    for (let i = 0; i < 4; i++) {
      const p = decal(0.16, 0.2, PAL.bloodDry, 0.8);
      p.position.set(cu + 0.72 + i * 0.17, 1.2 + hash2(i + 5, seed) * 0.6, 0.003);
      p.rotation.z = (hash2(i + 21, seed) - 0.5) * 0.7;
      g.add(p);
    }
  }
  return g;
};

/** A panelled door with a handle, built in its own group so a room can stand it anywhere.
 *  `open` is the swing in radians; the leaf hinges on its left edge. */
const panelDoor = (openRad: number, color = PAL.doorWood): THREE.Group => {
  const hinge = new THREE.Group();
  const w = 0.86, h = 2.03;
  const leaf = box(w, h, 0.055, color, 2.5, 3);
  leaf.position.set(w / 2, h / 2, 0);
  hinge.add(leaf);
  for (const py of [0.6, 1.4]) {
    const p = decal(w * 0.62, 0.56, '#4a301f', 0.8);
    p.position.set(w / 2, py, 0.03);
    hinge.add(p);
  }
  const handle = inked(new THREE.SphereGeometry(0.042, 10, 8), toon(PAL.metalLit, 2), 1.6);
  handle.position.set(w - 0.11, 1.0, 0.06);
  hinge.add(handle);
  hinge.rotation.y = openRad;
  return hinge;
};

const doorSwing = (d: AwakeDoor): number =>
  d === 'shut' ? 0 : d === 'ajar' ? 0.34 : d === 'open' ? 1.05 : 1.75;

/** Blood on a floor. Stains, drips and a pool - never a wound. */
const floorBlood = (state: AwakeGround, seed: number, zFar: number, zNear: number, wide: number): THREE.Group => {
  const g = new THREE.Group();
  if (state === 'clean') return g;
  const put = (w: number, h: number, x: number, z: number, col: string, op = 1, rot = 0) => {
    const m = decal(w, h, col, op);
    m.rotation.x = -Math.PI / 2;
    m.rotation.z = rot;
    m.position.set(x, 0.012 + hash2(x * 7 + z, seed) * 0.004, z);
    g.add(m);
  };
  if (state === 'drops') {
    for (let i = 0; i < 9; i++) {
      const r = 0.035 + hash2(i, seed) * 0.07;
      put(r * 2, r * 2.4, (hash2(i, seed + 2) - 0.5) * wide, zFar + (zNear - zFar) * hash2(i, seed + 5),
        i % 3 ? PAL.blood : PAL.bloodWet, 0.95, hash2(i, seed + 8) * 3);
    }
    return g;
  }
  // the drag: one long tapering streak with edge marks, pulled from the far door to the stairs
  const steps = 26;
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    const z = zFar + (zNear - zFar) * t;
    const w = wide * (0.38 - 0.17 * t) * (0.85 + hash2(i, seed) * 0.3);
    put(w, (Math.abs(zNear - zFar) / steps) * 1.9, (hash2(i, seed + 3) - 0.5) * 0.14,
      z, t < 0.3 ? PAL.bloodWet : t < 0.7 ? PAL.blood : PAL.bloodDry, 0.96);
  }
  for (let i = 0; i < 14; i++) {
    const z = zFar + (zNear - zFar) * hash2(i, seed + 11);
    const sx = hash2(i, seed + 13) > 0.5 ? 1 : -1;
    put(0.05 + hash2(i, seed + 17) * 0.1, 0.1 + hash2(i, seed + 19) * 0.22,
      sx * (wide * 0.22 + hash2(i, seed + 23) * 0.2), z, PAL.bloodDry, 0.9, hash2(i, seed + 29) * 3);
  }
  if (state === 'pool') {
    // Built from nine overlapping quads at different angles and sizes: a pool has a ragged
    // edge, and five concentric rectangles read as a red carpet (which is what the first
    // environment preview showed).
    for (let i = 0; i < 9; i++) {
      const r = 0.34 - i * 0.025;
      const a = hash2(i, seed + 41) * Math.PI;
      put(r * 1.8 * (0.7 + hash2(i, seed + 43) * 0.6), r * 1.35,
        (hash2(i, seed + 47) - 0.5) * 0.5, zFar + 0.3 + (hash2(i, seed + 53) - 0.5) * 0.7,
        i % 3 ? PAL.blood : PAL.bloodWet, 1, a);
    }
  }
  return g;
};

/** Seven-segment digits for the bedside clock. The clock is both a readable prop and how
 *  the viewer feels three hours pass, so it has to actually show the time. */
const SEG: Record<string, number[]> = {
  '0': [1, 1, 1, 1, 1, 1, 0], '1': [0, 1, 1, 0, 0, 0, 0], '2': [1, 1, 0, 1, 1, 0, 1],
  '3': [1, 1, 1, 1, 0, 0, 1], '4': [0, 1, 1, 0, 0, 1, 1], '5': [1, 0, 1, 1, 0, 1, 1],
  '6': [1, 0, 1, 1, 1, 1, 1], '7': [1, 1, 1, 0, 0, 0, 0], '8': [1, 1, 1, 1, 1, 1, 1],
  '9': [1, 1, 1, 1, 0, 1, 1],
};

/** A lit digital clock face, built flat and then stood up by the caller. */
const clockFace = (text: AwakeClock): THREE.Group => {
  const g = new THREE.Group();
  const body = box(0.19, 0.075, 0.09, PAL.dashDark, 1.6, 2);
  body.position.y = 0.037;
  g.add(body);
  if (text === 'off') return g;
  const digits = text.replace(':', '');
  const dw = 0.022, dh = 0.04, th = 0.006;
  // segment layout: a(top) b(top-right) c(bottom-right) d(bottom) e(bottom-left) f(top-left) g(middle)
  const lay: [number, number, number, number, number][] = [
    [0, dh / 2, dw, th, 0], [dw / 2, dh / 4, dh / 2, th, Math.PI / 2], [dw / 2, -dh / 4, dh / 2, th, Math.PI / 2],
    [0, -dh / 2, dw, th, 0], [-dw / 2, -dh / 4, dh / 2, th, Math.PI / 2], [-dw / 2, dh / 4, dh / 2, th, Math.PI / 2],
    [0, 0, dw, th, 0],
  ];
  let x = -0.062;
  for (let i = 0; i < digits.length; i++) {
    const on = SEG[digits[i]] ?? SEG['0'];
    for (let s = 0; s < 7; s++) {
      if (!on[s]) continue;
      const [ox, oy, len, t, ang] = lay[s];
      const m = decal(len, t, PAL.glitchRed, 1);
      m.position.set(x + ox, 0.037 + oy, 0.047);
      m.rotation.z = ang;
      g.add(m);
    }
    x += 0.034;
    if (i === 1) {
      for (const dy of [0.012, -0.012]) {
        const d = decal(0.006, 0.006, PAL.glitchRed, 1);
        d.position.set(x - 0.008, 0.037 + dy, 0.047);
        g.add(d);
      }
      x += 0.008;
    }
  }
  const glow = decal(0.2, 0.07, PAL.glitchRed, 0.1);
  glow.position.set(-0.012, 0.037, 0.05);
  g.add(glow);
  return g;
};

/** Bedding with real folds. A flat plane reads as plastic and fails the room check. */
const bedding = (w: number, l: number, mode: NonNullable<AwakeOpts['bedding']>, seed: number): THREE.Group => {
  const g = new THREE.Group();
  const quilt = box(w, 0.12, l, PAL.bedPink, 2, 3);
  quilt.position.y = 0.06;
  g.add(quilt);
  for (let i = 0; i < 7; i++) {
    const z = -l / 2 + 0.2 + (i * (l - 0.45)) / 7 + hash2(i, seed) * 0.05;
    const fold = inked(new THREE.CylinderGeometry(0.048, 0.048, w * 0.97, 7), toon(PAL.bedPinkDim, 3), 1.8);
    fold.rotation.z = Math.PI / 2;
    fold.position.set(0, 0.12, z);
    g.add(fold);
  }
  const sheet = box(w * 0.98, 0.05, l * 0.24, PAL.sheetCream, 2, 3);
  sheet.position.set(0, 0.145, -l / 2 + l * 0.12);
  g.add(sheet);
  const pillow = inked(new THREE.SphereGeometry(0.23, 12, 9), toon(PAL.sheetCream, 3), 2);
  pillow.scale.set(1.5, 0.5, 0.95);
  pillow.position.set(0, 0.2, -l / 2 + 0.28);
  g.add(pillow);
  if (mode === 'open' || mode === 'held') {
    // the quilt pulled back off the pillow: a thick rolled edge across the bed
    const roll = inked(new THREE.CylinderGeometry(0.14, 0.14, w * 0.99, 9), toon(PAL.bedPink, 3), 2.2);
    roll.rotation.z = Math.PI / 2;
    roll.position.set(0, 0.2, -l / 2 + (mode === 'held' ? 0.62 : 0.95));
    g.add(roll);
  }
  if (mode === 'tent') {
    // a boy under the sheets: the quilt tented over him, nothing of him showing
    for (let i = 0; i < 5; i++) {
      const r = 0.3 - i * 0.03;
      const hump = inked(new THREE.SphereGeometry(r, 12, 9), toon(PAL.bedPink, 3), 2.4);
      hump.scale.set(1.25, 0.72, 1.0);
      hump.position.set((hash2(i, seed) - 0.5) * 0.08, 0.14 + r * 0.42, -l / 2 + 0.5 + i * 0.3);
      g.add(hump);
    }
  }
  return g;
};

const woodChair = (): THREE.Group => {
  const g = new THREE.Group();
  const seat = box(0.46, 0.055, 0.44, PAL.doorWood, 2.2, 3);
  seat.position.y = 0.45;
  g.add(seat);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const leg = inked(new THREE.CylinderGeometry(0.023, 0.02, 0.45, 7), toon('#4a3127', 3), 1.8);
    leg.position.set(sx * 0.19, 0.225, sz * 0.18);
    g.add(leg);
  }
  // the back is at +Z, so the chair FACES -Z at rotation 0
  for (const sx of [-1, 1]) {
    const post = inked(new THREE.CylinderGeometry(0.022, 0.022, 0.56, 7), toon(PAL.doorWood, 3), 1.8);
    post.position.set(sx * 0.19, 0.73, 0.2);
    g.add(post);
  }
  for (const y of [0.62, 0.8, 0.97]) {
    const rail = box(0.42, 0.045, 0.03, PAL.doorWood, 1.8, 3);
    rail.position.set(0, y, 0.2);
    g.add(rail);
  }
  return g;
};

// ---------------------------------------------------------------------------------------
// the builder
// ---------------------------------------------------------------------------------------

export const buildAwakeHouse = (o: AwakeOpts = {}): THREE.Group => {
  const seed = o.seed ?? 7;
  const room = o.room ?? 'bedroom';
  const win = o.window ?? 'curtained';
  const doorState = o.door ?? 'shut';
  const lit = o.lightOn === true;                   // the bedroom is NEVER lit in this story
  const root = new THREE.Group();

  const dawn = win === 'dawn';
  // Two sources in every room (quality law 4c): a cool one from the window and a warm one
  // from a bulb or the hall. Nothing in this story is ever pure black.
  root.add(nightRig({
    key: lit ? '#ffd9a0' : dawn ? '#9fb6d8' : '#8d97c6',
    keyPos: room === 'bedroom' ? [5.2, 2.0, -2.2] : room === 'bathroom' ? [-3.0, 2.1, -0.8] : [0.8, 2.4, -4.3],
    keyPower: lit ? 2.6 : dawn ? 1.5 : room === 'bathroom' ? 1.6 : 1.05,
    fill: dawn ? '#4a5272' : '#3f3c5a',
    // A dark room still has to be READABLE at phone size. The unlit bathroom is lit by its
    // frosted window and by the hall through the door, and it was coming out near-black.
    fillPower: lit ? 0.72 : room === 'bathroom' ? 0.95 : 0.56,
  }));

  const W = room === 'bedroom' ? 4.0 : 1.9;
  const D = room === 'bedroom' ? 4.6 : room === 'hall' ? 8.0 : 2.2;
  const H = 2.6;
  const cz = -D / 2 + 1;                            // centre of the floor in Z
  const zEnd = -D + 1;

  const floorCol = room === 'hall' ? PAL.roomWallDim : room === 'bathroom' ? PAL.floorTile : PAL.floorWood;
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, D), toon(floorCol, 2));
  floor.rotation.x = -Math.PI / 2;
  floor.position.z = cz;
  root.add(floor);
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(W, D), toon('#6b675f', 2));
  ceil.rotation.x = Math.PI / 2;
  ceil.position.set(0, H, cz);
  root.add(ceil);
  for (const sx of [-1, 1]) {
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(D, H),
      toon(sx > 0 ? PAL.roomWall : PAL.roomWallDim, 2));
    wall.rotation.y = sx > 0 ? -Math.PI / 2 : Math.PI / 2;
    wall.position.set(sx * (W / 2), H / 2, cz);
    root.add(wall);
    const skirt = box(0.03, 0.13, D, '#8d8578', 1.8, 2);
    skirt.position.set(sx * (W / 2 - 0.015), 0.065, cz);
    root.add(skirt);
  }
  const endWall = new THREE.Mesh(new THREE.PlaneGeometry(W, H), toon(PAL.hallWall, 2));
  endWall.position.set(0, H / 2, zEnd);
  root.add(endWall);
  // The near wall, behind the lens: it is what the door is cut into, and without it the
  // frame has a hole in it the moment the head turns past 150 degrees. The HALL has no near
  // wall - its near end is the stairwell opening, and a wall there hides the twelve steps
  // down to the front door, which is the whole point of that beat.
  if (room !== 'hall') {
    const nearWall = new THREE.Mesh(new THREE.PlaneGeometry(W, H), toon(PAL.roomWallDim, 2));
    nearWall.rotation.y = Math.PI;
    nearWall.position.set(0, H / 2, 1.0);
    root.add(nearWall);
  } else {
    // a header over the opening, so the ceiling does not just stop in mid-air
    const header = box(W, 0.55, 0.12, PAL.roomWallDim, 2, 2);
    header.position.set(0, H - 0.275, 1.0);
    root.add(header);
  }

  const fitting = box(0.42, 0.055, 0.2, '#d9d2c4', 2, 2);
  fitting.position.set(0, H - 0.04, cz);
  root.add(fitting);
  if (lit) {
    const bulbPool = decal(1.9, 1.9, '#ffd9a0', 0.16);
    bulbPool.rotation.x = -Math.PI / 2;
    bulbPool.position.set(0, 0.02, cz);
    root.add(bulbPool);
  }

  // ------------------------------------------------------------------ the main door
  const swing = doorSwing(doorState);
  if (room === 'bedroom' || room === 'bathroom') {
    const hingeX = room === 'bedroom' ? 0.35 : -0.43;
    const d = panelDoor(swing);
    d.position.set(hingeX, 0, 0.97);
    root.add(d);
    for (const sx of [-1, 1]) {
      const jamb = box(0.07, 2.1, 0.09, PAL.doorWood, 2, 2);
      jamb.position.set(hingeX + (sx < 0 ? -0.035 : 0.895), 1.05, 0.99);
      root.add(jamb);
    }
    const head = box(1.0, 0.08, 0.09, PAL.doorWood, 2, 2);
    head.position.set(hingeX + 0.43, 2.1, 0.99);
    root.add(head);
    if (doorState !== 'shut') {
      // the hall beyond, and the warm slot of light it throws on the floor - the bedroom's
      // second light source for the whole middle of the story
      const beyond = decal(0.86, 2.03, room === 'bedroom' ? '#2a2334' : '#1f1b28', 1);
      beyond.position.set(hingeX + 0.43, 1.015, 1.02);
      root.add(beyond);
      const wide = doorState === 'ajar' ? 0.16 : doorState === 'open' ? 0.5 : 0.8;
      const slot = decal(wide, 2.6, PAL.lampWarm, doorState === 'ajar' ? 0.34 : 0.26);
      slot.rotation.x = -Math.PI / 2;
      slot.position.set(hingeX + 0.3, 0.015, 0.2 - 1.0);
      root.add(slot);
    }
  }

  // ================================================================== BEDROOM
  if (room === 'bedroom') {
    // --- the bed, head to the end wall, along the left wall
    const bed = new THREE.Group();
    const frame = box(1.35, 0.3, 2.1, '#5a4a3c', 2.5, 3);
    frame.position.y = 0.33;
    bed.add(frame);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      const leg = box(0.085, 0.18, 0.085, '#4a3c30', 1.8, 2);
      leg.position.set(sx * 0.6, 0.09, sz * 0.95);
      bed.add(leg);
    }
    const headBoard = box(1.4, 0.66, 0.08, '#5a4a3c', 2, 3);
    headBoard.position.set(0, 0.63, -1.05);
    bed.add(headBoard);
    const bd = bedding(1.28, 2.0, o.bedding ?? 'open', seed);
    bd.position.y = 0.48;
    bed.add(bd);
    bed.position.set(-1.1, 0, -2.35);
    root.add(bed);

    // --- bedside table + the clock
    const tbl = box(0.42, 0.5, 0.4, '#6a5440', 2.2, 3);
    tbl.position.set(-0.12, 0.25, -3.25);
    root.add(tbl);
    const drw = decal(0.36, 0.14, '#523f2f', 0.9);
    drw.position.set(-0.12, 0.36, -3.045);
    root.add(drw);
    const cl = clockFace(o.clock ?? 'off');
    cl.position.set(-0.12, 0.5, -3.1);
    root.add(cl);
    if ((o.clock ?? 'off') !== 'off') {
      const red = decal(0.5, 0.34, PAL.glitchRed, 0.07);
      red.position.set(-0.12, 0.56, -3.0);
      root.add(red);
    }

    // --- the chair by the window, turned to face the bed (the mother sits HERE)
    const ch = woodChair();
    ch.position.set(1.3, 0, -1.9);
    ch.rotation.y = 1.13;                 // front faces the pillow, so nobody sits on nothing
    root.add(ch);

    // --- the window on the right wall
    const wp = wallPanel(1.985, -1);
    const wf = box(0.06, 1.34, 1.0, '#3a3630', 2, 2);
    wf.position.set(-2.3, 1.38, 0);
    wp.add(wf);
    const pane = decal(0.96, 1.26, dawn ? '#8fa6c8' : win === 'blind' ? '#2b2a3f' : PAL.skyLow, 1);
    pane.position.set(-2.3, 1.38, 0.006);
    wp.add(pane);
    for (const u of [-2.78, -1.82]) {
      const bar = decal(0.035, 1.26, INK, 0.9);
      bar.position.set(u, 1.38, 0.01);
      wp.add(bar);
    }
    const mid = decal(0.96, 0.035, INK, 0.9);
    mid.position.set(-2.3, 1.38, 0.01);
    wp.add(mid);
    if (win === 'curtained') {
      for (const u of [-2.86, -1.74]) {
        const cur = decal(0.42, 1.5, '#5d5068', 1);
        cur.position.set(u, 1.42, 0.03);
        wp.add(cur);
        for (let i = 0; i < 4; i++) {
          const pleat = decal(0.03, 1.46, '#473c52', 0.9);
          pleat.position.set(u - 0.15 + i * 0.1, 1.42, 0.035);
          wp.add(pleat);
        }
      }
    }
    if (win === 'blind') {
      for (let i = 0; i < 11; i++) {
        const sl = decal(1.02, 0.08, '#6a6276', 1);
        sl.position.set(-2.3, 0.84 + i * 0.11, 0.028);
        wp.add(sl);
      }
    }
    root.add(wp);
    // the window's light on the floor - the second source, and the thing that tells the
    // viewer the night is ending when it turns from blue to grey
    const spill = decal(1.15, 1.5, dawn ? '#b9c6dc' : '#6d7ba8', dawn ? 0.2 : 0.12);
    spill.rotation.x = -Math.PI / 2;
    spill.position.set(1.25, 0.016, -2.3);
    root.add(spill);

    // --- the masterpiece, on the same wall, nearer the door
    root.add(masterpiece(o.shape ?? 'none', seed, o.handPrints === true));

    // --- chest of drawers against the end wall
    const dresser = box(0.92, 0.84, 0.44, '#6a5440', 2.5, 3);
    dresser.position.set(1.2, 0.42, -3.34);
    root.add(dresser);
    for (let i = 0; i < 3; i++) {
      const dr = decal(0.8, 0.21, '#523f2f', 0.9);
      dr.position.set(1.2, 0.19 + i * 0.27, -3.115);
      root.add(dr);
      for (const sx of [-1, 1]) {
        const knob = inked(new THREE.SphereGeometry(0.026, 8, 6), toon(PAL.metalLit, 2), 1.4);
        knob.position.set(1.2 + sx * 0.2, 0.19 + i * 0.27, -3.1);
        root.add(knob);
      }
    }

    // --- poster over the bed (left wall)
    const lp = wallPanel(-1.985, 1);
    const post = decal(0.84, 0.6, '#3f5f7a', 1);
    post.position.set(-1.6, 1.62, 0.005);
    lp.add(post);
    const postInk = decal(0.72, 0.48, '#2b4559', 1);
    postInk.position.set(-1.6, 1.62, 0.008);
    lp.add(postInk);
    for (let i = 0; i < 3; i++) {
      const line = decal(0.5, 0.045, '#d8cdb6', 0.9);
      line.position.set(-1.6, 1.44 + i * 0.12, 0.011);
      lp.add(line);
    }
    root.add(lp);

    // --- floor clutter: a school bag, three blocks and one shoe
    const bag = box(0.4, 0.26, 0.2, '#3f4a66', 2, 3);
    bag.position.set(0.5, 0.13, -1.0);
    root.add(bag);
    const strap = inked(new THREE.TorusGeometry(0.12, 0.016, 5, 12), toon('#2b3348', 2), 1.4);
    strap.rotation.x = Math.PI / 2;
    strap.position.set(0.5, 0.26, -1.06);
    root.add(strap);
    for (let i = 0; i < 3; i++) {
      const c = box(0.1, 0.1, 0.1, ['#d8a24a', '#5f8fb8', '#7bb85f'][i], 1.8, 2);
      c.position.set(-0.3 + hash2(i, seed) * 1.0, 0.05, -1.5 - hash2(i, seed + 3) * 1.2);
      c.rotation.y = hash2(i, seed + 7) * 3;
      root.add(c);
    }
    const shoe = box(0.24, 0.1, 0.11, '#efe9e0', 1.8, 2);
    shoe.position.set(0.1, 0.05, -0.45);
    shoe.rotation.y = 0.6;
    root.add(shoe);

    // --- blood on the bedroom floor, when the story has put it there
    root.add(floorBlood(o.ground ?? 'clean', seed + 5, -1.6, 0.7, 1.1));
  }

  // ================================================================== HALL
  if (room === 'hall') {
    const doors: [number, number, AwakeDoor][] = [
      [-1, -0.9, 'shut'], [1, -1.6, doorState], [-1, -3.6, 'shut'],
    ];
    for (const [sx, z, st] of doors) {
      const d = panelDoor(doorSwing(st));
      d.rotation.y = sx > 0 ? -Math.PI / 2 : Math.PI / 2;
      d.position.set(sx * (W / 2 - 0.04), 0, z + (sx > 0 ? 0.43 : -0.43));
      root.add(d);
      const fr = box(0.05, 2.12, 1.0, PAL.doorWood, 2, 2);
      fr.position.set(sx * (W / 2 - 0.02), 1.06, z);
      root.add(fr);
    }
    // the parents' door at the far end, where the drag starts
    const far = panelDoor(doorSwing('wide'));
    far.position.set(-0.43, 0, zEnd + 0.06);
    root.add(far);
    const farDark = decal(0.86, 2.03, '#17141f', 1);
    farDark.position.set(0, 1.015, zEnd + 0.04);
    root.add(farDark);

    const tbl = box(0.3, 0.74, 0.5, '#6a5440', 2.2, 3);
    tbl.position.set(0.76, 0.37, -3.1);
    root.add(tbl);
    const phone = box(0.2, 0.08, 0.26, '#2a2730', 1.8, 2);
    phone.position.set(0.76, 0.78, -3.1);
    root.add(phone);
    const handset = inked(new THREE.CylinderGeometry(0.035, 0.035, 0.22, 7), toon('#1d1c23', 2), 1.6);
    handset.rotation.x = Math.PI / 2;
    handset.position.set(0.76, 0.85, -3.1);
    root.add(handset);

    const lp = wallPanel(-0.94, 1);
    const frame2 = decal(0.36, 0.46, '#2b2630', 1);
    frame2.position.set(-2.4, 1.56, 0.004);
    lp.add(frame2);
    const pic = decal(0.28, 0.38, '#8d7f6a', 1);
    pic.position.set(-2.4, 1.56, 0.008);
    lp.add(pic);
    for (let i = 0; i < 3; i++) {
      const fig = decal(0.05, 0.16, '#5c5245', 1);
      fig.position.set(-2.48 + i * 0.08, 1.5, 0.012);
      lp.add(fig);
    }
    root.add(lp);

    const rp = wallPanel(0.94, -1);
    const shade = decal(0.26, 0.2, '#e2d6b4', 1);
    shade.position.set(-4.3, 1.92, 0.006);
    rp.add(shade);
    root.add(rp);
    const wallGlow = decal(1.3, 1.6, PAL.lampWarm, 0.13);
    wallGlow.rotation.y = -Math.PI / 2;
    wallGlow.position.set(0.9, 1.6, -4.3);
    root.add(wallGlow);
    const wallPool = decal(1.5, 2.2, PAL.lampWarm, 0.1);
    wallPool.rotation.x = -Math.PI / 2;
    wallPool.position.set(0.3, 0.014, -4.3);
    root.add(wallPool);

    // the stair landing at the near end - twelve steps down to the front door
    for (let i = 0; i < 4; i++) {
      const tread = box(W - 0.3, 0.07, 0.3, '#6b6459', 2, 2);
      tread.position.set(0, -0.02 - i * 0.18, 0.5 + i * 0.3);
      root.add(tread);
      const nose = decal(W - 0.32, 0.02, INK, 0.5);
      nose.rotation.x = -Math.PI / 2;
      nose.position.set(0, 0.015 - i * 0.18, 0.36 + i * 0.3);
      root.add(nose);
    }
    const rail = inked(new THREE.CylinderGeometry(0.03, 0.03, 1.5, 7), toon('#8a6a44', 3), 2);
    rail.rotation.set(0.5, 0, Math.PI / 2);
    rail.position.set(-0.7, 0.75, 0.9);
    root.add(rail);
    // Street light through the glass in the front door, two floors down. Without it the top
    // of the stairs is a black hole, and "twelve steps to the front door" has to be readable
    // as a way OUT - that is the whole point of the beat (quality law 4c: no near-black frame).
    // Down there is the front door, with street light in its glass. This is the way OUT,
    // and the beat only works if the viewer can see it from the top of the stairs.
    const downWall = decal(W - 0.2, 2.2, '#5a5f78', 1);
    downWall.position.set(0, -0.45, 1.75);
    root.add(downWall);
    const frontDoor = box(0.82, 1.95, 0.06, PAL.doorWood, 2.5, 3);
    frontDoor.position.set(0, -0.62, 1.68);
    root.add(frontDoor);
    const frontGlass = decal(0.52, 0.5, '#cfd9ef', 1);
    frontGlass.position.set(0, 0.0, 1.64);
    root.add(frontGlass);
    const frontSpill = decal(1.1, 1.3, '#aebad8', 0.5);
    frontSpill.rotation.x = -Math.PI / 2;
    frontSpill.position.set(0, -1.58, 1.15);
    root.add(frontSpill);
    const latch = inked(new THREE.SphereGeometry(0.04, 9, 7), toon(PAL.metalLit, 2), 1.5);
    latch.position.set(0.3, -0.48, 1.62);
    root.add(latch);
    for (let i = 0; i < 3; i++) {
      const lower = box(W - 0.3, 0.07, 0.3, '#6b6459', 2, 2);
      lower.position.set(0, -0.74 - i * 0.18, 1.4 + i * 0.3);
      root.add(lower);
    }

    root.add(floorBlood(o.ground ?? 'clean', seed + 2, zEnd + 0.45, 0.45, 1.5));
  }

  // ================================================================== BATHROOM
  if (room === 'bathroom') {
    // tiles: a grout grid on the end wall and both side walls
    const grid = (panel: THREE.Group, u0: number, u1: number) => {
      for (let u = u0; u <= u1; u += 0.22) {
        const v1 = decal(0.008, 1.5, '#8e95a0', 0.55);
        v1.position.set(u, 1.0, 0.004);
        panel.add(v1);
      }
      for (let v = 0.3; v <= 1.76; v += 0.22) {
        const h1 = decal(u1 - u0, 0.008, '#8e95a0', 0.55);
        h1.position.set((u0 + u1) / 2, v, 0.004);
        panel.add(h1);
      }
    };
    const tileEnd = new THREE.Mesh(new THREE.PlaneGeometry(W, 1.76), toon('#b9c2cc', 2));
    tileEnd.position.set(0, 0.88, zEnd + 0.01);
    root.add(tileEnd);
    for (let u = -W / 2 + 0.11; u < W / 2; u += 0.22) {
      const v1 = decal(0.008, 1.1, '#8e95a0', 0.55);
      v1.position.set(u, 0.55, zEnd + 0.02);
      root.add(v1);
    }
    // Only up to splashback height: run the grid across the mirror and it moires into a
    // grey mess at a grazing angle, which is what the first bathroom preview showed.
    for (let v = 0.22; v <= 1.1; v += 0.22) {
      const h1 = decal(W, 0.008, '#8e95a0', 0.55);
      h1.position.set(0, v, zEnd + 0.02);
      root.add(h1);
    }
    const rp = wallPanel(0.94, -1);
    const tileR = decal(2.2, 1.76, '#b9c2cc', 1);
    tileR.position.set(-0.1, 0.88, 0.002);
    rp.add(tileR);
    grid(rp, -1.15, 0.95);
    const railBar = inked(new THREE.CylinderGeometry(0.015, 0.015, 0.5, 7), toon(PAL.metalLit, 2), 1.4);
    railBar.rotation.x = Math.PI / 2;
    railBar.position.set(0.88, 1.25, -0.1);
    root.add(railBar);
    const towel = box(0.04, 0.5, 0.34, '#d8cdb6', 2, 3);
    towel.position.set(0.86, 1.0, -0.1);
    root.add(towel);
    root.add(rp);

    // basin, tap, mirror
    const ped = inked(new THREE.CylinderGeometry(0.1, 0.14, 0.62, 10), toon('#e4e6e8', 2), 2);
    ped.position.set(0, 0.31, zEnd + 0.26);
    root.add(ped);
    const basin = inked(new THREE.CylinderGeometry(0.26, 0.19, 0.18, 14), toon('#eef0f2', 2), 2.4);
    basin.position.set(0, 0.71, zEnd + 0.26);
    root.add(basin);
    const bowl = decal(0.4, 0.4, '#cfd4d8', 1);
    bowl.rotation.x = -Math.PI / 2;
    bowl.position.set(0, 0.79, zEnd + 0.26);
    root.add(bowl);
    const tap = inked(new THREE.CylinderGeometry(0.018, 0.018, 0.16, 7), toon(PAL.metalLit, 2), 1.4);
    tap.position.set(0, 0.86, zEnd + 0.08);
    root.add(tap);
    const spout = inked(new THREE.CylinderGeometry(0.016, 0.016, 0.1, 7), toon(PAL.metalLit, 2), 1.4);
    spout.rotation.x = Math.PI / 2;
    spout.position.set(0, 0.93, zEnd + 0.13);
    root.add(spout);
    const mirror = decal(0.56, 0.5, lit ? '#cdd8e2' : '#4a5160', 1);
    mirror.position.set(0, 1.42, zEnd + 0.07);
    root.add(mirror);
    const mFrame = box(0.62, 0.56, 0.03, '#3a3630', 2, 2);
    mFrame.position.set(0, 1.42, zEnd + 0.05);
    root.add(mFrame);

    // a closed, plain toilet form - a readable object, nothing more
    const cistern = box(0.36, 0.42, 0.16, '#e4e6e8', 2, 2);
    cistern.position.set(-0.6, 0.72, zEnd + 0.1);
    root.add(cistern);
    const pan = inked(new THREE.CylinderGeometry(0.17, 0.14, 0.4, 12), toon('#eef0f2', 2), 2.2);
    pan.position.set(-0.6, 0.2, zEnd + 0.35);
    root.add(pan);
    const lid = decal(0.36, 0.42, '#d7dadd', 1);
    lid.rotation.x = -Math.PI / 2;
    lid.position.set(-0.6, 0.41, zEnd + 0.35);
    root.add(lid);

    // frosted window on the left wall, and the pull cord
    const lp = wallPanel(-0.94, 1);
    const wf2 = box(0.05, 0.66, 0.5, '#3a3630', 2, 2);
    wf2.position.set(-0.8, 1.6, 0);
    lp.add(wf2);
    const frosted = decal(0.46, 0.58, dawn ? '#9fb0c6' : '#5d6478', 1);
    frosted.position.set(-0.8, 1.6, 0.006);
    lp.add(frosted);
    root.add(lp);
    const cord = inked(new THREE.CylinderGeometry(0.006, 0.006, 0.7, 5), toon('#e4dfd2', 2), 1.0);
    cord.position.set(0.6, 2.2, -0.2);
    root.add(cord);
    const toggle = inked(new THREE.CylinderGeometry(0.018, 0.018, 0.06, 7), toon('#e4dfd2', 2), 1.2);
    toggle.position.set(0.6, 1.82, -0.2);
    root.add(toggle);

    root.add(floorBlood(o.ground ?? 'clean', seed + 8, zEnd + 0.3, 0.9, 1.0));
  }

  return root;
};
