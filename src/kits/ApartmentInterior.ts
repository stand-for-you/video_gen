// Scroll Kaos v0.5 - ApartmentInterior. Hallways, stairs, bedrooms, closets.
// Readable objects: numbered landing, stair treads with a nosing line, handrail, apartment
// doors with numbers and peepholes, a buzzer panel, a radiator, a framed picture, a bed with
// FOLDED bedding and under-bed clearance, floor clutter, a fire-escape window.
// The closet and bedroom doors are DESTRUCTIBLE: sound -> cracked -> holed -> shattered.

import * as THREE from 'three';
import { PAL, INK } from '../three/palette';
import { toon, flat, box, decal, inked, nightRig } from '../three/toon';
import { hash2 } from '../three/noise';

export type DoorState = 'sound' | 'cracked' | 'holed' | 'shattered';

export type ApartmentOpts = {
  seed?: number;
  room?: 'hall' | 'stairwell' | 'bedroom' | 'closet';
  /** for 'hall' and 'stairwell': the number painted on the landing wall */
  floorNo?: string;
  /** state of the room's main door - the legal way to revisit this room */
  door?: DoorState;
  /** bedroom only */
  bedColor?: string;
  lightOn?: boolean;
  /** closet only: are the slats open enough to see through? */
  slats?: boolean;
  window?: 'none' | 'fireEscape' | 'curtained';
};

/** Bedding with real folds. A flat plane reads as plastic and fails the room check. */
const bedding = (w: number, l: number, color: string, dim: string, seed: number): THREE.Group => {
  const g = new THREE.Group();
  const quilt = box(w, 0.11, l, color, 2, 3);
  quilt.position.y = 0.05;
  g.add(quilt);
  // folds: low ridges across the quilt
  for (let i = 0; i < 6; i++) {
    const z = -l / 2 + 0.22 + (i * (l - 0.5)) / 6 + hash2(i, seed) * 0.06;
    const fold = inked(new THREE.CylinderGeometry(0.045, 0.045, w * 0.96, 7), toon(dim, 3), 1.8);
    fold.rotation.z = Math.PI / 2;
    fold.position.set(0, 0.11, z);
    g.add(fold);
  }
  // turned-down top sheet
  const sheet = box(w * 0.98, 0.05, l * 0.26, PAL.sheetCream, 2, 3);
  sheet.position.set(0, 0.13, -l / 2 + l * 0.13);
  g.add(sheet);
  const pillow = inked(new THREE.SphereGeometry(0.22, 12, 9), toon(PAL.sheetCream, 3), 2);
  pillow.scale.set(1.5, 0.52, 0.95);
  pillow.position.set(0, 0.2, -l / 2 + 0.3);
  g.add(pillow);
  return g;
};

/** Apartment door: number plate, peephole, handle, and four damage states. */
const apartmentDoor = (state: DoorState, no: string, seed: number): THREE.Group => {
  const g = new THREE.Group();
  const w = 0.92, h = 2.05;
  if (state !== 'shattered') {
    const leaf = box(w, h, 0.07, PAL.doorWood, 2.5, 3);
    leaf.position.y = h / 2;
    g.add(leaf);
    // two sunken panels so the door is not a slab
    for (const py of [0.62, 1.42]) {
      const p = decal(w * 0.66, 0.6, '#4a301f', 0.75);
      p.position.set(0, py, 0.038);
      g.add(p);
    }
    const handle = inked(new THREE.SphereGeometry(0.045, 10, 8), toon(PAL.metalLit, 2), 1.6);
    handle.position.set(w / 2 - 0.13, 1.0, 0.07);
    g.add(handle);
    const peep = decal(0.03, 0.03, PAL.metalLit, 1);
    peep.position.set(0, 1.56, 4);
    g.add(peep);
    if (no) {
      const plate = decal(0.16, 0.12, PAL.gold, 0.9);
      plate.position.set(0, 1.74, 4);
      g.add(plate);
    }
  }
  if (state === 'cracked' || state === 'holed') {
    const n = state === 'holed' ? 22 : 11;
    for (let i = 0; i < n; i++) {
      const a = hash2(i, seed) * Math.PI * 2;
      const len = 0.1 + hash2(i + 30, seed) * 0.5;
      const c = decal(len, 0.012, INK, 0.9);
      c.position.set(Math.cos(a) * len * 0.5, 1.15 + Math.sin(a) * len * 0.5, 0.041);
      c.rotation.z = a;
      g.add(c);
    }
  }
  if (state === 'holed') {
    const hole = decal(0.3, 0.34, '#07060a', 1);
    hole.position.set(0.02, 1.2, 0.042);
    g.add(hole);
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2;
      const sh = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.14, 3), toon(PAL.doorWood, 2));
      sh.position.set(0.02 + Math.cos(a) * 0.17, 1.2 + Math.sin(a) * 0.19, 0.06);
      sh.rotation.set(Math.PI / 2, 0, a + 1.2);
      g.add(sh);
    }
  }
  if (state === 'shattered') {
    for (let i = 0; i < 16; i++) {
      const sh = new THREE.Mesh(new THREE.ConeGeometry(0.07 + hash2(i, seed) * 0.06, 0.4 + hash2(i + 9, seed) * 0.5, 3), toon(PAL.doorWood, 2));
      sh.position.set((hash2(i, 2) - 0.5) * 0.85, 0.2 + hash2(i, 5) * 1.5, (hash2(i, 7) - 0.5) * 0.14);
      sh.rotation.set(hash2(i, 11) * 3, hash2(i, 13) * 3, hash2(i, 17) * 3);
      g.add(sh);
      const edge = new THREE.Mesh(new THREE.ConeGeometry(0.075 + hash2(i, seed) * 0.06, 0.41 + hash2(i + 9, seed) * 0.5, 3), flat(INK, { side: THREE.BackSide }));
      edge.position.copy(sh.position); edge.rotation.copy(sh.rotation);
      g.add(edge);
    }
  }
  return g;
};

export const APARTMENT_READABLE = [
  'numbered landing', 'stair treads with nosing', 'handrail', 'apartment door with number',
  'peephole', 'buzzer panel', 'radiator', 'framed picture', 'bed with folded bedding',
  'under-bed clearance', 'floor clutter', 'fire-escape window', 'ceiling light',
];

export const buildApartmentInterior = (o: ApartmentOpts = {}): THREE.Group => {
  const seed = o.seed ?? 3;
  const room = o.room ?? 'hall';
  const root = new THREE.Group();
  const lit = o.lightOn !== false;

  // In a closet the only light comes through the slats, i.e. from in FRONT of the lens.
  root.add(nightRig({
    key: lit ? '#ffd9a0' : '#7d86b8',
    keyPos: room === 'closet' ? [0.2, 1.6, 4.0] : [0.5, 3.2, 1.0],
    keyPower: lit ? (room === 'closet' ? 3.0 : 2.2) : 0.9,
    fill: '#3f3c5a',
    fillPower: lit ? 0.7 : 0.5,
  }));

  const W = room === 'closet' ? 1.6 : room === 'hall' ? 1.9 : 3.6;
  const D = room === 'closet' ? 1.4 : room === 'hall' ? 11 : 4.2;
  const H = 2.6;

  // floor / ceiling / walls - always present so a room is never an object in a void
  const floorMat = room === 'hall' || room === 'stairwell' ? PAL.floorTile : PAL.floorWood;
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, D), toon(floorMat, 2));
  floor.rotation.x = -Math.PI / 2;
  floor.position.z = -D / 2 + 1;
  root.add(floor);
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(W, D), toon('#6e6a63', 2));
  ceil.rotation.x = Math.PI / 2;
  ceil.position.set(0, H, -D / 2 + 1);
  root.add(ceil);
  for (const sx of [-1, 1]) {
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(D, H), toon(sx > 0 ? PAL.roomWall : PAL.roomWallDim, 2));
    wall.rotation.y = sx > 0 ? -Math.PI / 2 : Math.PI / 2;
    wall.position.set(sx * (W / 2), H / 2, -D / 2 + 1);
    root.add(wall);
    const skirt = box(0.03, 0.12, D, '#8d8578', 1.8, 2);
    skirt.position.set(sx * (W / 2 - 0.015), 0.06, -D / 2 + 1);
    root.add(skirt);
  }
  const endWall = new THREE.Mesh(new THREE.PlaneGeometry(W, H), toon(PAL.hallWall, 2));
  endWall.position.set(0, H / 2, -D + 1);
  root.add(endWall);

  if (lit) {
    const fitting = box(0.5, 0.06, 0.22, '#d9d2c4', 2, 2);
    fitting.position.set(0, H - 0.05, -D / 2 + 1);
    root.add(fitting);
    const glow = decal(1.7, 1.7, '#ffd9a0', 0.14);
    glow.rotation.x = -Math.PI / 2;
    glow.position.set(0, 0.02, -D / 2 + 1);
    root.add(glow);
  }

  if (room === 'hall') {
    // doors down both sides + the fittings that make a corridor a corridor
    for (let i = 0; i < 4; i++) {
      const sx = i % 2 ? 1 : -1;
      const z = -1.6 - Math.floor(i / 2) * 3.6;
      const isMain = i === 0;
      const d = apartmentDoor(isMain ? (o.door ?? 'sound') : 'sound', String(2 + i), seed + i);
      d.rotation.y = sx > 0 ? -Math.PI / 2 : Math.PI / 2;
      d.position.set(sx * (W / 2 - 0.04), 0, z);
      root.add(d);
    }
    const buzzer = box(0.2, 0.3, 0.04, '#3a3740', 1.8, 2);
    buzzer.position.set(-(W / 2 - 0.03), 1.4, -0.2);
    buzzer.rotation.y = Math.PI / 2;
    root.add(buzzer);
    for (let i = 0; i < 6; i++) {
      const b = decal(0.04, 0.03, PAL.metalLit, 1);
      b.rotation.y = Math.PI / 2;
      b.position.set(-(W / 2 - 0.05), 1.3 + (i % 3) * 0.08, -0.26 + Math.floor(i / 3) * 0.1);
      root.add(b);
    }
    const rad = box(0.1, 0.52, 0.9, '#cfc8bb', 2, 2);
    rad.position.set(W / 2 - 0.07, 0.34, -5.4);
    root.add(rad);
    for (let i = 0; i < 9; i++) {
      const fin = decal(0.5, 0.05, '#a79f92', 0.8);
      fin.rotation.y = -Math.PI / 2;
      fin.position.set(W / 2 - 0.12, 0.34, -5.82 + i * 0.1);
      root.add(fin);
    }
    const frame = box(0.03, 0.42, 0.32, '#2b2630', 1.8, 2);
    frame.position.set(-(W / 2 - 0.02), 1.55, -3.4);
    root.add(frame);
    const pic = decal(0.26, 0.34, '#8d7f6a', 1);
    pic.rotation.y = Math.PI / 2;
    pic.position.set(-(W / 2 - 0.04), 1.55, -3.4);
    root.add(pic);
  }

  if (room === 'stairwell') {
    const steps = 11;
    for (let i = 0; i < steps; i++) {
      const tread = box(W - 0.2, 0.08, 0.3, '#6b6459', 2, 2);
      tread.position.set(0, 0.18 * i + 0.04, -0.6 - i * 0.3);
      root.add(tread);
      const riser = box(W - 0.2, 0.18, 0.04, '#59534a', 1.8, 2);
      riser.position.set(0, 0.18 * i + 0.13, -0.45 - i * 0.3);
      root.add(riser);
      const nosing = decal(W - 0.22, 0.02, INK, 0.55);
      nosing.rotation.x = -Math.PI / 2;
      nosing.position.set(0, 0.18 * i + 0.085, -0.46 - i * 0.3);
      root.add(nosing);
    }
    const railCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(W / 2 - 0.18, 0.95, -0.4),
      new THREE.Vector3(W / 2 - 0.18, 1.9, -2.0),
      new THREE.Vector3(W / 2 - 0.18, 2.85, -3.7),
    ]);
    const rail = new THREE.Mesh(new THREE.TubeGeometry(railCurve, 20, 0.035, 7, false), toon('#8a6a44', 3));
    root.add(rail);
    for (let i = 0; i < 7; i++) {
      const t = i / 6;
      const p = railCurve.getPoint(t);
      const bal = inked(new THREE.CylinderGeometry(0.018, 0.018, p.y - (0.18 * i * 0.9), 6), toon(PAL.metal, 2), 1.5);
      bal.position.set(p.x, p.y / 2, p.z);
      root.add(bal);
    }
    // the big painted floor number - the thing that tells the viewer where they are
    const no = o.floorNo ?? '2';
    const num = decal(0.5, 0.78, '#6f6657', 0.95);
    num.position.set(0, 1.5, -D + 1.02);
    root.add(num);
    const inner = decal(0.2, 0.4, PAL.hallWall, 1);
    inner.position.set(0.03, 1.5, -D + 1.03);
    if (no !== '1') root.add(inner);
  }

  if (room === 'bedroom') {
    const bed = new THREE.Group();
    const framePiece = box(1.25, 0.26, 2.0, '#5a4a3c', 2.5, 3);
    framePiece.position.y = 0.3;
    bed.add(framePiece);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      const leg = box(0.08, 0.17, 0.08, '#4a3c30', 1.8, 2);
      leg.position.set(sx * 0.55, 0.085, sz * 0.9);
      bed.add(leg);
    }
    const head = box(1.3, 0.62, 0.08, '#5a4a3c', 2, 3);
    head.position.set(0, 0.6, -1.0);
    bed.add(head);
    const bd = bedding(1.2, 1.95, o.bedColor ?? PAL.bedPink, PAL.bedPinkDim, seed);
    bd.position.y = 0.42;
    bed.add(bd);
    bed.position.set(-0.75, 0, -2.4);
    root.add(bed);

    // floor clutter under and around the bed - the under-bed crawl needs something to see
    for (let i = 0; i < 7; i++) {
      const c = box(0.12 + hash2(i, seed) * 0.16, 0.07, 0.1 + hash2(i + 4, seed) * 0.14,
        ['#d8a24a', '#5f8fb8', '#b85f7a', '#7bb85f'][i % 4], 1.8, 2);
      c.position.set(-1.3 + hash2(i, 3) * 2.4, 0.04, -1.2 - hash2(i, 5) * 2.4);
      c.rotation.y = hash2(i, 7) * 3;
      root.add(c);
    }
    const dresser = box(0.9, 0.82, 0.45, '#6a5440', 2.5, 3);
    dresser.position.set(1.1, 0.41, -3.2);
    root.add(dresser);
    for (let i = 0; i < 3; i++) {
      const dr = decal(0.78, 0.2, '#523f2f', 0.9);
      dr.position.set(1.1, 0.18 + i * 0.26, -2.975);
      root.add(dr);
      const knob = inked(new THREE.SphereGeometry(0.025, 8, 6), toon(PAL.metalLit, 2), 1.4);
      knob.position.set(1.1, 0.18 + i * 0.26, -2.96);
      root.add(knob);
    }
    const closet = apartmentDoor(o.door ?? 'sound', '', seed + 5);
    closet.rotation.y = -Math.PI / 2;
    closet.position.set(W / 2 - 0.04, 0, -1.9);
    root.add(closet);
  }

  if (room === 'closet') {
    // Inside the closet looking OUT through the slats at the lit bedroom. The light that
    // comes through the slats is the whole shot, so the bright plane sits behind the slats
    // and the slats are the only thing between it and the lens.
    const outside = decal(1.9, 2.4, lit ? '#f0d2b4' : '#55507a', 1);
    outside.position.set(0, 1.2, 0.74);
    root.add(outside);
    // a hint of the bedroom through the gap, so the plane does not read as a white wall
    const bedHint = decal(0.7, 0.3, lit ? PAL.bedPink : '#3c3a58', 1);
    bedHint.position.set(-0.4, 0.55, 0.73);
    root.add(bedHint);
    const doorFrame = box(1.55, 0.09, 0.09, PAL.doorWood, 2, 2);
    doorFrame.position.set(0, 2.18, 0.7); root.add(doorFrame);
    const sillF = box(1.55, 0.09, 0.09, PAL.doorWood, 2, 2);
    sillF.position.set(0, 0.06, 0.7); root.add(sillF);
    for (const sx of [-1, 1]) {
      const jamb = box(0.09, 2.2, 0.09, PAL.doorWood, 2, 2);
      jamb.position.set(sx * 0.73, 1.12, 0.7); root.add(jamb);
    }
    // 16 louvre slats, tilted down, with a slit of light between each pair
    for (let i = 0; i < 16; i++) {
      const sl = box(1.38, 0.1, 0.022, PAL.doorWood, 1.8, 2);
      sl.position.set(0, 0.2 + i * 0.125, 0.69);
      sl.rotation.x = 0.42;
      root.add(sl);
    }
    // hanging rail and coats, at the back where they belong
    const rail = inked(new THREE.CylinderGeometry(0.016, 0.016, 1.3, 6), toon(PAL.metalLit, 2), 1.4);
    rail.rotation.z = Math.PI / 2;
    rail.position.set(0, 1.92, -0.25);
    root.add(rail);
    for (let i = 0; i < 5; i++) {
      const coatCol = ['#3f4a66', '#6a3f4a', '#3f5f4a', '#5a5340', '#45405a'][i];
      const coat = box(0.2, 0.86, 0.1, coatCol, 1.6, 3);
      coat.position.set(-0.5 + i * 0.25, 1.42, -0.25);
      root.add(coat);
      const hook = inked(new THREE.TorusGeometry(0.035, 0.008, 5, 10), toon(PAL.metalLit, 2), 1.2);
      hook.position.set(-0.5 + i * 0.25, 1.9, -0.25);
      root.add(hook);
    }
    const shelf = box(1.36, 0.05, 0.5, PAL.doorWood, 1.8, 2);
    shelf.position.set(0, 2.08, -0.25); root.add(shelf);
    const boxOnShelf = box(0.34, 0.2, 0.3, '#8d7f68', 1.6, 2);
    boxOnShelf.position.set(0.3, 2.2, -0.25); root.add(boxOnShelf);
  }

  if (o.window === 'fireEscape' || o.window === 'curtained') {
    const wf = box(0.96, 1.3, 0.06, '#3a3630', 2, 2);
    wf.position.set(0, 1.35, -D + 0.96);
    root.add(wf);
    const pane = decal(0.78, 1.12, o.window === 'curtained' ? '#cfc2a8' : PAL.skyLow, 1);
    pane.position.set(0, 1.35, -D + 0.92);
    root.add(pane);
    if (o.window === 'fireEscape') {
      for (let i = 0; i < 5; i++) {
        const bar = decal(0.76, 0.03, INK, 0.9);
        bar.position.set(0, 0.95 + i * 0.2, -D + 0.9);
        root.add(bar);
      }
      const spill = decal(1.2, 1.6, PAL.lampWarm, 0.13);
      spill.rotation.x = -Math.PI / 2;
      spill.position.set(0, 0.02, -D + 1.9);
      root.add(spill);
    }
  }

  return root;
};
