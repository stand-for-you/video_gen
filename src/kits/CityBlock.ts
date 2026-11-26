// Scroll Kaos v0.5 - CityBlock. The street/alley set, navigable in first person.
// Readable objects (quality law 4c needs 5+): brick walls with mortar courses, lit windows,
// a fire escape, a dumpster, a hydrant, parked cars, overhead power lines, a lit deli front,
// street lamps, kerb + sidewalk slabs, graffiti tags, a skyline behind it all.

import * as THREE from 'three';
import { PAL, INK } from '../three/palette';
import { toon, flat, box, decal, inked, nightRig, lampPool } from '../three/toon';
import { hash2 } from '../three/noise';

export type CityBlockOpts = {
  seed?: number;
  /** 'alley' = narrow walls both sides. 'street' = one side open with parked cars. */
  shape?: 'alley' | 'street' | 'deadend';
  /** metres of walkable length down -Z */
  length?: number;
  width?: number;
  /** which side the warm lamp key comes from */
  lampSide?: -1 | 1;
  /** tags painted on the brick. Keep them short - they must stay readable. */
  tags?: string[];
  /** 'dry' | 'wet' - wet adds a reflective sheen band on the asphalt */
  ground?: 'dry' | 'wet';
  deli?: boolean;
  fireEscape?: boolean;
  wires?: boolean;
  cars?: number;
};

/** A brick face with mortar courses and scattered lit windows. */
const brickWall = (w: number, h: number, seed: number, lit: boolean): THREE.Group => {
  const g = new THREE.Group();
  const face = box(w, h, 0.3, lit ? PAL.brickLit : PAL.brick, 3.5, 2);
  g.add(face);
  // mortar courses - thin dark decals, no outline (an outlined course looks like a pipe)
  const courses = Math.max(2, Math.floor(h / 0.9));
  for (let i = 1; i < courses; i++) {
    const d = decal(w * 0.995, 0.035, PAL.brickMortar, 0.55);
    d.position.set(0, -h / 2 + (i * h) / courses, 0.17);
    g.add(d);
  }
  // windows: a dark frame with a flat lit pane inside
  const cols = Math.max(1, Math.floor(w / 2.1));
  const rows = Math.max(1, Math.floor(h / 2.6));
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const k = hash2(c * 7 + seed, r * 13 + seed);
      if (k < 0.42) continue;
      const wx = -w / 2 + (c + 0.5) * (w / cols);
      const wy = -h / 2 + (r + 0.75) * (h / rows);
      const frame = box(0.78, 1.15, 0.1, PAL.metal, 3, 2);
      frame.position.set(wx, wy, 0.2);
      g.add(frame);
      const pane = decal(0.56, 0.92, k > 0.72 ? PAL.windowLit : PAL.windowDim, k > 0.72 ? 1 : 0.7);
      pane.position.set(wx, wy, 0.27);
      g.add(pane);
    }
  }
  return g;
};

/** Painted tag. Flat letters on the wall - never outlined, never a sticker plane. */
const graffiti = (text: string, w: number, color: string): THREE.Group => {
  const g = new THREE.Group();
  const cw = w / Math.max(1, text.length);
  for (let i = 0; i < text.length; i++) {
    if (text[i] === ' ') continue;
    const d = decal(cw * 0.72, cw * 1.25, color, 0.82);
    d.position.set(-w / 2 + (i + 0.5) * cw, 0, 0);
    d.rotation.z = (hash2(i, text.length) - 0.5) * 0.14;
    g.add(d);
  }
  return g;
};

const fireEscapeRig = (h: number, seed: number): THREE.Group => {
  const g = new THREE.Group();
  const levels = 4;
  for (let i = 0; i < levels; i++) {
    const y = 2.6 + i * 2.4;
    const plat = box(2.0, 0.08, 1.1, PAL.metal, 3, 2);
    plat.position.set(0, y, 0.55);
    g.add(plat);
    // slats you can see through, which is what makes a fire escape read
    for (let s = 0; s < 6; s++) {
      const slat = box(1.9, 0.03, 0.07, PAL.metalLit, 2, 2);
      slat.position.set(0, y + 0.05, 0.1 + s * 0.17);
      g.add(slat);
    }
    const rail = box(2.0, 0.06, 0.06, PAL.metal, 2.5, 2);
    rail.position.set(0, y + 0.95, 1.08);
    g.add(rail);
    for (let b = 0; b < 5; b++) {
      const bar = box(0.05, 0.95, 0.05, PAL.metal, 2, 2);
      bar.position.set(-0.9 + b * 0.45, y + 0.48, 1.08);
      g.add(bar);
    }
    if (i < levels - 1) {
      const lad = new THREE.Group();
      for (let r = 0; r < 9; r++) {
        const rung = box(0.72, 0.035, 0.035, PAL.metalLit, 2, 2);
        rung.position.set(0, r * 0.26, 0);
        lad.add(rung);
      }
      const sideA = box(0.04, 2.35, 0.04, PAL.metal, 2, 2); sideA.position.set(-0.36, 1.17, 0);
      const sideB = box(0.04, 2.35, 0.04, PAL.metal, 2, 2); sideB.position.set(0.36, 1.17, 0);
      lad.add(sideA, sideB);
      lad.position.set(0.6, y + 0.1, 1.0);
      lad.rotation.x = -0.18;
      g.add(lad);
    }
  }
  return g;
};

const dumpster = (): THREE.Group => {
  const g = new THREE.Group();
  const bodyM = box(1.9, 1.1, 1.0, '#2e4a3a', 3, 2);
  bodyM.position.y = 0.62;
  g.add(bodyM);
  const lid = box(1.96, 0.1, 1.06, '#243b2e', 3, 2);
  lid.position.set(0, 1.21, 0);
  lid.rotation.z = 0.04;
  g.add(lid);
  for (const sx of [-1, 1]) {
    const wheel = inked(new THREE.CylinderGeometry(0.13, 0.13, 0.08, 10), toon(INK, 2), 2);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(sx * 0.75, 0.13, 0.42);
    g.add(wheel);
  }
  return g;
};

const hydrant = (): THREE.Group => {
  const g = new THREE.Group();
  const bodyM = inked(new THREE.CylinderGeometry(0.14, 0.17, 0.62, 10), toon(PAL.neonRed, 2), 2.5);
  bodyM.position.y = 0.31;
  g.add(bodyM);
  const cap = inked(new THREE.SphereGeometry(0.15, 12, 8), toon(PAL.neonRed, 2), 2);
  cap.position.y = 0.64;
  g.add(cap);
  for (const sx of [-1, 1]) {
    const arm = inked(new THREE.CylinderGeometry(0.06, 0.06, 0.14, 8), toon(PAL.neonRed, 2), 2);
    arm.rotation.z = Math.PI / 2;
    arm.position.set(sx * 0.17, 0.42, 0);
    g.add(arm);
  }
  return g;
};

const parkedCar = (seed: number): THREE.Group => {
  const g = new THREE.Group();
  const hue = ['#3a4a6a', '#5a3a3a', '#3f4a3f', '#4a4452'][Math.floor(hash2(seed, 3) * 4) % 4];
  const bodyM = box(1.78, 0.62, 4.1, hue, 3, 3);
  bodyM.position.y = 0.72;
  g.add(bodyM);
  const cabin = box(1.62, 0.56, 2.1, hue, 3, 3);
  cabin.position.set(0, 1.28, -0.1);
  g.add(cabin);
  const wind = decal(1.5, 0.5, PAL.glass, 0.85);
  wind.position.set(0, 1.3, 0.96);
  g.add(wind);
  for (const sx of [-1, 1]) for (const sz of [1.35, -1.35]) {
    const wheel = inked(new THREE.CylinderGeometry(0.33, 0.33, 0.2, 12), toon('#1b1920', 2), 2.5);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(sx * 0.88, 0.33, sz);
    g.add(wheel);
  }
  return g;
};

const streetLamp = (): THREE.Group => {
  const g = new THREE.Group();
  const post = inked(new THREE.CylinderGeometry(0.07, 0.09, 4.6, 8), toon(PAL.metal, 2), 2.5);
  post.position.y = 2.3;
  g.add(post);
  const arm = inked(new THREE.CylinderGeometry(0.055, 0.055, 1.0, 8), toon(PAL.metal, 2), 2.5);
  arm.rotation.z = Math.PI / 2;
  arm.position.set(0.5, 4.55, 0);
  g.add(arm);
  const head = box(0.44, 0.16, 0.3, PAL.metal, 2.5, 2);
  head.position.set(1.0, 4.46, 0);
  g.add(head);
  const bulb = decal(0.4, 0.26, PAL.lampCore, 1);
  bulb.rotation.x = -Math.PI / 2;
  bulb.position.set(1.0, 4.36, 0);
  g.add(bulb);
  return g;
};

const deliFront = (): THREE.Group => {
  const g = new THREE.Group();
  const shutter = box(3.4, 2.6, 0.12, '#3a3640', 3, 2);
  shutter.position.set(0, 1.3, 0);
  g.add(shutter);
  const glassPane = decal(3.0, 1.9, '#d8c27a', 0.55);
  glassPane.position.set(0, 1.35, 0.1);
  g.add(glassPane);
  const signBoard = box(3.6, 0.6, 0.14, '#1c1a24', 3, 2);
  signBoard.position.set(0, 3.0, 3);
  g.add(signBoard);
  // the lit "24HR DELI" bar - letters as flat blocks so it reads at any distance
  for (let i = 0; i < 9; i++) {
    if (i === 4) continue;
    const l = decal(0.2, 0.3, PAL.neonGreen, 0.95);
    l.position.set(-1.45 + i * 0.36, 3.0, 0.11);
    g.add(l);
  }
  const spill = decal(3.6, 2.4, PAL.windowLit, 0.14);
  spill.rotation.x = -Math.PI / 2;
  spill.position.set(0, 0.03, 1.4);
  g.add(spill);
  return g;
};

export const CITYBLOCK_READABLE = [
  'brick wall with mortar courses', 'lit apartment windows', 'fire escape',
  'dumpster', 'fire hydrant', 'parked car', 'street lamp', 'power lines',
  'deli storefront', 'kerb and sidewalk slabs', 'graffiti tag', 'city skyline',
];

export const buildCityBlock = (o: CityBlockOpts = {}): THREE.Group => {
  const seed = o.seed ?? 1;
  const shape = o.shape ?? 'alley';
  const L = o.length ?? 46;
  const W = o.width ?? (shape === 'alley' ? 4.2 : 9.0);
  const lampSide = o.lampSide ?? 1;
  const tags = o.tags ?? ['RIP', '4EVA'];
  const root = new THREE.Group();

  root.add(nightRig({ keyPos: [lampSide * 5, 7, 4], keyPower: 1.7, fill: '#36344f', fillPower: 0.66 }));

  // --- sky + skyline (never outlined; it is the backdrop, not an object) ---
  const sky = new THREE.Mesh(new THREE.SphereGeometry(140, 20, 14), flat(PAL.skyMid, { side: THREE.BackSide }));
  root.add(sky);
  const grad = decal(300, 90, PAL.skyTop, 0.75);
  grad.position.set(0, 42, -L - 36);
  root.add(grad);
  for (let i = 0; i < 16; i++) {
    const bw = 5 + hash2(i, seed) * 9;
    const bh = 9 + hash2(i + 50, seed) * 26;
    const blk = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, 4), flat(PAL.skylineBlock));
    blk.position.set(-52 + i * 7 + hash2(i, 9) * 3, bh / 2, -L - 20 - hash2(i, 3) * 16);
    root.add(blk);
    for (let k = 0; k < 7; k++) {
      if (hash2(i * 31 + k, seed) < 0.6) continue;
      const wdw = decal(0.4, 0.55, PAL.windowLit, 0.9);
      wdw.position.set(blk.position.x - bw / 2 + 0.9 + (k % 3) * (bw / 3), 2 + Math.floor(k / 3) * (bh / 4), blk.position.z + 2.05);
      root.add(wdw);
    }
  }

  // --- ground ---
  const road = new THREE.Mesh(new THREE.PlaneGeometry(W + 8, L + 24), toon(PAL.asphalt, 2));
  road.rotation.x = -Math.PI / 2;
  road.position.set(0, 0, -L / 2);
  root.add(road);
  if (o.ground === 'wet') {
    const sheen = decal(W, L, PAL.brickHot, 0.1);
    sheen.rotation.x = -Math.PI / 2;
    sheen.position.set(0, 0.012, -L / 2);
    root.add(sheen);
  }
  // sidewalk slabs down each side - the joints give the floor a readable scale
  for (const sx of shape === 'alley' ? [-1, 1] : [lampSide as number]) {
    const walk = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.14, L + 20), toon(PAL.sidewalk, 2));
    walk.position.set(sx * (W / 2 + 0.8), 0.07, -L / 2);
    root.add(walk);
    for (let i = 0; i < Math.floor((L + 20) / 1.6); i++) {
      const joint = decal(1.55, 0.03, INK, 0.5);
      joint.rotation.x = -Math.PI / 2;
      joint.position.set(sx * (W / 2 + 0.8), 0.146, 6 - i * 1.6);
      root.add(joint);
    }
    const kerb = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, L + 20), toon(PAL.kerb, 2));
    kerb.position.set(sx * (W / 2 + 0.02), 0.08, -L / 2);
    root.add(kerb);
  }

  // --- walls ---
  const wallH = 15;
  const sides: number[] = shape === 'street' ? [-1] : [-1, 1];
  for (const sx of sides) {
    const wall = brickWall(L + 20, wallH, seed + (sx > 0 ? 100 : 0), sx === lampSide);
    wall.rotation.y = sx > 0 ? -Math.PI / 2 : Math.PI / 2;
    wall.position.set(sx * (W / 2 + 1.6), wallH / 2, -L / 2);
    root.add(wall);
  }
  if (shape === 'deadend') {
    const endw = brickWall(W + 3.2, wallH, seed + 7, false);
    endw.position.set(0, wallH / 2, -L - 1.4);
    root.add(endw);
    const dead = graffiti('DEAD END', 5.0, PAL.neonGreen);
    dead.position.set(0, 3.1, -L - 1.2);
    root.add(dead);
  }

  // --- tags on the lamp-side wall ---
  tags.forEach((t, i) => {
    const gfx = graffiti(t, 1.0 + t.length * 0.46, i % 2 ? PAL.coral : PAL.neonGreen);
    gfx.rotation.y = -lampSide * (Math.PI / 2);
    gfx.position.set(lampSide * (W / 2 + 1.42), 2.2 + (i % 2) * 1.3, -7 - i * 11);
    root.add(gfx);
  });

  // --- street furniture ---
  const dmp = dumpster();
  dmp.position.set(-lampSide * (W / 2 - 0.9), 0, -11 - hash2(seed, 1) * 6);
  dmp.rotation.y = 0.12;
  root.add(dmp);

  const hyd = hydrant();
  hyd.position.set(lampSide * (W / 2 + 0.75), 0.14, -5.5);
  root.add(hyd);

  for (let i = 0; i < 3; i++) {
    const lamp = streetLamp();
    lamp.position.set(lampSide * (W / 2 + 0.6), 0.14, -4 - i * 15);
    lamp.rotation.y = lampSide > 0 ? Math.PI : 0;
    root.add(lamp);
    root.add(lampPool(lampSide * (W / 2 - 1.2), 0, -4 - i * 15, 3.9));
  }

  if (o.fireEscape !== false) {
    const fe = fireEscapeRig(wallH, seed);
    fe.rotation.y = -lampSide * (Math.PI / 2);
    fe.position.set(lampSide * (W / 2 + 1.4), 0, -18);
    root.add(fe);
  }

  if (o.deli !== false && shape !== 'alley') {
    const d = deliFront();
    d.position.set(-lampSide * (W / 2 + 1.5), 0, -24);
    d.rotation.y = lampSide * (Math.PI / 2);
    root.add(d);
  }

  const nCars = o.cars ?? (shape === 'street' ? 3 : 1);
  for (let i = 0; i < nCars; i++) {
    const c = parkedCar(seed + i * 9);
    c.position.set(lampSide * (W / 2 - 1.3), 0, -9 - i * 7.5);
    root.add(c);
  }

  // --- overhead power lines: the thing that makes a look UP shot worth taking ---
  if (o.wires !== false) {
    for (let i = 0; i < 5; i++) {
      const sag = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-(W / 2 + 2), 9.4 + i * 0.22, -6 - i * 9),
        new THREE.Vector3(0, 8.5 + i * 0.22, -6 - i * 9),
        new THREE.Vector3(W / 2 + 2, 9.4 + i * 0.22, -6 - i * 9),
      ]);
      const wire = new THREE.Mesh(new THREE.TubeGeometry(sag, 14, 0.035, 5, false), flat(INK));
      root.add(wire);
    }
  }

  return root;
};
