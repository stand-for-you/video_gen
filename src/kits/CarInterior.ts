// Scroll Kaos v0.5 - CarInterior. Backseat POV. The windshield and the roof are the stage.
// Readable objects: driver + passenger headrests, steering wheel, dashboard with a live
// green clock, rearview mirror + hanging air freshener, door cards with handles, seat belts,
// the windshield (clean / cracked / smashed) and the roof panel (sound / dented / torn).

import * as THREE from 'three';
import { PAL, INK } from '../three/palette';
import { toon, flat, box, decal, inked, nightRig } from '../three/toon';
import { hash2 } from '../three/noise';

export type CarInteriorOpts = {
  seed?: number;
  /** windshield state. A state change is the legal way to re-use this set. */
  windshield?: 'clean' | 'cracked' | 'smashed';
  /** roof state - the monster comes through it */
  roof?: 'sound' | 'dented' | 'torn';
  /** dashboard clock text, e.g. "3:12". Keep it 4-5 glyphs. */
  clock?: string;
  /** is the driver's seat occupied? (the body is added by the scene, not the kit) */
  freshener?: boolean;
  /** outside glow colour seen through the glass */
  outside?: string;
  headlights?: boolean;
};

/** Seven-segment style block digits - readable at 720p, no font needed. */
const segDigits = (text: string, h: number, color: string): THREE.Group => {
  const g = new THREE.Group();
  const cw = h * 0.62;
  // which of the 7 segments are on, per glyph
  const SEG: Record<string, number[]> = {
    '0': [1, 1, 1, 0, 1, 1, 1], '1': [0, 0, 1, 0, 0, 1, 0], '2': [1, 0, 1, 1, 1, 0, 1],
    '3': [1, 0, 1, 1, 0, 1, 1], '4': [0, 1, 1, 1, 0, 1, 0], '5': [1, 1, 0, 1, 0, 1, 1],
    '6': [1, 1, 0, 1, 1, 1, 1], '7': [1, 0, 1, 0, 0, 1, 0], '8': [1, 1, 1, 1, 1, 1, 1],
    '9': [1, 1, 1, 1, 0, 1, 1],
  };
  let x = 0;
  for (const ch of text) {
    if (ch === ':') {
      for (const dy of [h * 0.22, -h * 0.22]) {
        const d = decal(h * 0.1, h * 0.1, color, 1); d.position.set(x, dy, 0); g.add(d);
      }
      x += cw * 0.45; continue;
    }
    const on = SEG[ch] || SEG['8'];
    const bars: [number, number, number, number][] = [
      [0, h * 0.45, cw * 0.72, h * 0.1],      // top
      [-cw * 0.33, h * 0.22, h * 0.1, h * 0.38], // top-left
      [cw * 0.33, h * 0.22, h * 0.1, h * 0.38],  // top-right
      [0, 0, cw * 0.72, h * 0.1],             // middle
      [-cw * 0.33, -h * 0.22, h * 0.1, h * 0.38],
      [cw * 0.33, -h * 0.22, h * 0.1, h * 0.38],
      [0, -h * 0.45, cw * 0.72, h * 0.1],
    ];
    bars.forEach((b, i) => {
      if (!on[i]) return;
      const d = decal(b[2], b[3], color, 1);
      d.position.set(x + b[0], b[1], 0);
      g.add(d);
    });
    x += cw * 1.25;
  }
  g.position.x = -x / 2;
  const wrap = new THREE.Group(); wrap.add(g);
  return wrap;
};

const headrest = (lit: boolean): THREE.Group => {
  const g = new THREE.Group();
  const back = box(0.52, 0.82, 0.16, lit ? PAL.carSeatLit : PAL.carSeat, 2.5, 3);
  back.position.y = 0.41;
  g.add(back);
  const rest = box(0.4, 0.26, 0.15, lit ? PAL.carSeatLit : PAL.carSeat, 2.5, 3);
  rest.position.y = 1.0;
  g.add(rest);
  for (const sx of [-1, 1]) {
    const postM = inked(new THREE.CylinderGeometry(0.018, 0.018, 0.16, 6), toon(INK, 2), 1.5);
    postM.position.set(sx * 0.1, 0.86, 0);
    g.add(postM);
  }
  // stitched centre seam - tells the eye this is upholstery, not a grey slab
  const seam = decal(0.012, 0.72, INK, 0.6);
  seam.position.set(0, 0.42, 0.081);
  g.add(seam);
  return g;
};

export const CARINTERIOR_READABLE = [
  'driver headrest', 'passenger headrest', 'steering wheel', 'dashboard',
  'green digital clock', 'rearview mirror', 'hanging air freshener',
  'door card and handle', 'seat belt', 'windshield', 'roof panel',
];

export const buildCarInterior = (o: CarInteriorOpts = {}): THREE.Group => {
  const seed = o.seed ?? 2;
  const root = new THREE.Group();
  // Key comes through the windshield from the street ahead; fill is the dash glow.
  root.add(nightRig({ key: PAL.lampWarm, keyPos: [1.4, 1.9, -4], keyPower: 1.9, fill: '#3e3c5c', fillPower: 0.8 }));

  // --- shell. The camera sits at roughly (0, 1.02, 0.95), facing -Z. ---
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 3.0), toon(PAL.dashDark, 2));
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0.3, 0);
  root.add(floor);

  const roofPanel = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 3.0), toon(PAL.carRoof, 2));
  roofPanel.rotation.x = Math.PI / 2;
  roofPanel.position.set(0, 1.62, 0);
  root.add(roofPanel);
  if (o.roof === 'dented' || o.roof === 'torn') {
    const dent = decal(0.72, 0.62, INK, o.roof === 'torn' ? 1 : 0.5);
    dent.rotation.x = Math.PI / 2;
    dent.position.set(0.12, 1.61, -0.35);
    root.add(dent);
    if (o.roof === 'torn') {
      // jagged outlined shards folded inward
      for (let i = 0; i < 7; i++) {
        const a = (i / 7) * Math.PI * 2;
        const shard = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.3, 3), toon(PAL.carRoof, 2));
        shard.position.set(0.12 + Math.cos(a) * 0.3, 1.54, -0.35 + Math.sin(a) * 0.26);
        shard.rotation.set(Math.PI * 0.5 + hash2(i, seed) * 0.5, a, 0);
        root.add(shard);
      }
      const night = decal(0.66, 0.56, PAL.skyTop, 1);
      night.rotation.x = Math.PI / 2;
      night.position.set(0.12, 1.615, -0.35);
      root.add(night);
    }
  }

  for (const sx of [-1, 1]) {
    const door = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 1.32), toon(sx > 0 ? PAL.carSeatLit : PAL.carSeat, 2));
    door.rotation.y = sx > 0 ? -Math.PI / 2 : Math.PI / 2;
    door.position.set(sx * 0.85, 0.96, 0);
    root.add(door);
    const handle = box(0.17, 0.045, 0.05, PAL.metalLit, 2, 2);
    handle.position.set(sx * 0.79, 1.0, 0.1);
    root.add(handle);
    const pocket = decal(0.6, 0.2, INK, 0.45);
    pocket.rotation.y = sx > 0 ? -Math.PI / 2 : Math.PI / 2;
    pocket.position.set(sx * 0.838, 0.6, 0.2);
    root.add(pocket);
    // seat belt webbing
    const belt = decal(0.055, 1.1, '#201e28', 1);
    belt.rotation.y = sx > 0 ? -Math.PI / 2 : Math.PI / 2;
    belt.rotation.x = 0.0;
    belt.position.set(sx * 0.82, 1.05, 0.55);
    root.add(belt);
  }

  // --- front seats ---
  const dh = headrest(false); dh.position.set(-0.36, 0.3, -0.52); root.add(dh);
  const ph = headrest(true); ph.position.set(0.36, 0.3, -0.52); root.add(ph);

  // --- dashboard ---
  const dash = box(1.68, 0.3, 0.52, PAL.dashDark, 2.5, 2);
  dash.position.set(0, 1.02, -1.38);
  root.add(dash);
  const cowl = box(1.68, 0.1, 0.2, '#15141a', 2, 2);
  cowl.position.set(0, 1.2, -1.2);
  root.add(cowl);

  // the live clock. Green on black, the single brightest thing in the cabin.
  const bezel = box(0.36, 0.14, 0.03, '#0b0b0f', 1.8, 2);
  bezel.position.set(0.1, 1.06, -1.12);
  root.add(bezel);
  const clk = segDigits(o.clock ?? '3:12', 0.085, PAL.dashGreen);
  clk.position.set(0.1, 1.06, -1.1);
  root.add(clk);
  const clkGlow = decal(0.44, 0.2, PAL.dashGreen, 0.12);
  clkGlow.position.set(0.1, 1.06, -1.09);
  root.add(clkGlow);

  // steering wheel
  const wheel = inked(new THREE.TorusGeometry(0.19, 0.028, 8, 22), toon('#232128', 2), 2);
  wheel.position.set(-0.36, 0.94, -1.08);
  wheel.rotation.x = -1.15;
  root.add(wheel);
  for (let i = 0; i < 3; i++) {
    const spoke = box(0.16, 0.022, 0.02, '#232128', 1.5, 2);
    spoke.position.set(-0.36, 0.94, -1.08);
    spoke.rotation.set(-1.15, 0, (i / 3) * Math.PI * 2);
    root.add(spoke);
  }

  // --- windshield + its state ---
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(1.66, 0.82), flat(PAL.glass, { opacity: 0.4, side: THREE.DoubleSide }));
  glass.position.set(0, 1.3, -1.52);
  glass.rotation.x = 0.26;
  root.add(glass);
  const outsideGlow = decal(1.66, 0.82, o.outside ?? PAL.brickHot, 1);
  outsideGlow.position.set(0, 1.3, -1.56);
  outsideGlow.rotation.x = 0.26;
  root.add(outsideGlow);
  if (o.windshield === 'cracked' || o.windshield === 'smashed') {
    const n = o.windshield === 'smashed' ? 34 : 16;
    const cx = -0.18, cy = 1.34;
    for (let i = 0; i < n; i++) {
      const a = hash2(i, seed) * Math.PI * 2;
      const len = 0.08 + hash2(i + 40, seed) * (o.windshield === 'smashed' ? 0.5 : 0.26);
      const crack = decal(len, 0.008, PAL.glassCrack, 0.9);
      crack.position.set(cx + Math.cos(a) * len * 0.5, cy + Math.sin(a) * len * 0.5, -1.5);
      crack.rotation.set(0.26, 0, a);
      root.add(crack);
    }
    const star = decal(0.13, 0.13, PAL.glassCrack, 0.85);
    star.position.set(cx, cy, -1.498);
    star.rotation.x = 0.26;
    root.add(star);
  }

  // --- rearview mirror + air freshener (the detail that makes a cabin a real car) ---
  const mirror = box(0.26, 0.08, 0.035, '#1a1920', 1.8, 2);
  mirror.position.set(0, 1.5, -1.3);
  root.add(mirror);
  const mglass = decal(0.22, 0.055, '#6d7389', 0.9);
  mglass.position.set(0, 1.5, -1.281);
  root.add(mglass);
  if (o.freshener !== false) {
    const str = decal(0.006, 0.17, INK, 1);
    str.position.set(0.02, 1.4, -1.28);
    root.add(str);
    const tree = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.1, 3), toon('#3f9c5e', 2));
    tree.position.set(0.02, 1.3, -1.28);
    tree.rotation.y = 0.5;
    root.add(tree);
  }

  // Something to SEE through the glass. A windshield onto a flat colour reads as a wall;
  // the street beyond is what makes the cabin feel like it is moving through a city.
  const streetFar = decal(5.0, 1.5, PAL.skyTop, 1);
  streetFar.position.set(0, 1.5, -7.5); root.add(streetFar);
  for (let i = 0; i < 7; i++) {
    const w = decal(0.22, 0.3, i % 3 ? PAL.windowLit : PAL.windowDim, 0.95);
    w.position.set(-1.9 + i * 0.62, 1.55 + (i % 2) * 0.38, -7.4);
    root.add(w);
  }
  const roadAhead = decal(5.0, 6.0, PAL.asphalt, 1);
  roadAhead.rotation.x = -Math.PI / 2;
  roadAhead.position.set(0, 0.0, -4.6); root.add(roadAhead);
  const lampAhead = decal(2.4, 2.4, PAL.lampWarm, 0.3);
  lampAhead.rotation.x = -Math.PI / 2;
  lampAhead.position.set(-1.3, 0.02, -4.0); root.add(lampAhead);
  const lampLight = new THREE.PointLight(new THREE.Color(PAL.lampWarm), 2.4, 14, 2);
  lampLight.position.set(-1.3, 3.2, -4.0); root.add(lampLight);

  if (o.headlights) {
    const beam = decal(3.0, 4.0, PAL.lampCore, 0.14);
    beam.rotation.x = -Math.PI / 2;
    beam.position.set(0, 0.03, -3.6);
    root.add(beam);
  }

  return root;
};
