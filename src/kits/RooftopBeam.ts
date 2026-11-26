// Scroll Kaos v0.5 - RooftopBeam. A narrow steel I-beam slung between two brick buildings,
// 4-12 storeys over a lit alley. This is the vertigo set: the floor is 30 m of air.
// Readable objects: the I-beam with rivets, parapet walls, roof vents, a water tank, the
// alley far below with its lamp pools, fire escapes on the far wall, the city skyline.

import * as THREE from 'three';
import { PAL, INK } from '../three/palette';
import { toon, flat, box, decal, inked, nightRig } from '../three/toon';
import { hash2 } from '../three/noise';

export type RooftopOpts = {
  seed?: number;
  /** storeys above the alley. 4 is nervous, 12 is lethal. */
  storeys?: number;
  /** beam length in metres between the two parapets */
  span?: number;
  /** beam width - 0.26 is a walkable I-beam, 0.18 is a nightmare */
  beamW?: number;
  /** 'dry' | 'wet' - wet beam reads as a worse idea */
  beam?: 'dry' | 'wet' | 'rusted';
  tank?: boolean;
  vents?: boolean;
  /** lamps burning in the alley below */
  alleyLamps?: number;
};

/** An I-beam section built from three slabs, with rivet rows. */
const iBeam = (len: number, w: number, color: string, seed: number): THREE.Group => {
  const g = new THREE.Group();
  const top = box(w, 0.035, len, color, 2, 2);
  top.position.y = 0.11;
  g.add(top);
  const bot = box(w, 0.035, len, color, 2, 2);
  bot.position.y = -0.11;
  g.add(bot);
  const web = box(w * 0.22, 0.2, len, color, 1.8, 2);
  g.add(web);
  const rivets = Math.floor(len / 0.5);
  for (let i = 0; i < rivets; i++) {
    for (const sx of [-1, 1]) {
      const r = inked(new THREE.SphereGeometry(0.018, 7, 5), toon(PAL.metalLit, 2), 1.2);
      r.position.set(sx * w * 0.32, 0.13, -len / 2 + 0.25 + i * 0.5);
      g.add(r);
    }
  }
  // flaking paint / rust patches so the beam is not a grey extrusion
  for (let i = 0; i < 18; i++) {
    const p = decal(0.06 + hash2(i, seed) * 0.12, 0.05 + hash2(i + 9, seed) * 0.09, '#6e4028', 0.5);
    p.rotation.x = -Math.PI / 2;
    p.position.set((hash2(i, 3) - 0.5) * w * 0.8, 0.129, -len / 2 + hash2(i, 5) * len);
    g.add(p);
  }
  return g;
};

const roofBlock = (w: number, d: number, h: number, seed: number, vents: boolean): THREE.Group => {
  const g = new THREE.Group();
  const bodyM = box(w, h, d, PAL.brick, 4, 2);
  bodyM.position.y = -h / 2;
  g.add(bodyM);
  // roof deck + parapet
  const deck = new THREE.Mesh(new THREE.PlaneGeometry(w, d), toon('#3b3740', 2));
  deck.rotation.x = -Math.PI / 2;
  deck.position.y = 0.01;
  g.add(deck);
  const parH = 0.95;
  for (const [sx, sz] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as [number, number][]) {
    const pw = sx ? 0.3 : w, pd = sz ? 0.3 : d;
    const par = box(pw, parH, pd, PAL.brickLit, 3, 2);
    par.position.set(sx * (w / 2 - 0.15), parH / 2, sz * (d / 2 - 0.15));
    g.add(par);
    const cap = box(pw + 0.08, 0.07, pd + 0.08, '#8d8273', 2, 2);
    cap.position.set(sx * (w / 2 - 0.15), parH + 0.03, sz * (d / 2 - 0.15));
    g.add(cap);
  }
  if (vents) {
    for (let i = 0; i < 3; i++) {
      const v = inked(new THREE.CylinderGeometry(0.19, 0.22, 0.5, 10), toon(PAL.metal, 2), 2);
      v.position.set(-w / 4 + hash2(i, seed) * w * 0.5, 0.25, -d / 4 + hash2(i + 5, seed) * d * 0.5);
      g.add(v);
      const hood = inked(new THREE.ConeGeometry(0.28, 0.16, 10), toon(PAL.metalLit, 2), 2);
      hood.position.set(v.position.x, 0.56, v.position.z);
      g.add(hood);
    }
  }
  return g;
};

/** Eye height for a figure standing ON the beam, given the same opts. */
export const beamEyeY = (o: RooftopOpts = {}) => (o.storeys ?? 8) * 3.1 + 1.62;

export const ROOFTOP_READABLE = [
  'steel I-beam with rivets', 'parapet wall and coping', 'roof vents', 'water tank',
  'alley far below', 'street lamp pools below', 'fire escape on the far wall',
  'city skyline', 'roof deck', 'drop shadow of the beam on the alley floor',
];

export const buildRooftopBeam = (o: RooftopOpts = {}): THREE.Group => {
  const seed = o.seed ?? 4;
  const storeys = o.storeys ?? 8;
  const span = o.span ?? 13;
  const beamW = o.beamW ?? 0.26;
  const H = storeys * 3.1;          // roof height above the alley
  const root = new THREE.Group();

  root.add(nightRig({ key: '#9aa6e0', keyPos: [3, 5, 2], keyPower: 1.1, fill: '#4a4766', fillPower: 1.2 }));

  // sky + skyline, seen at roof level so the skyline sits ON the horizon, not above it
  const sky = new THREE.Mesh(new THREE.SphereGeometry(230, 22, 16), flat(PAL.skyMid, { side: THREE.BackSide }));
  sky.position.y = H;
  root.add(sky);
  for (let i = 0; i < 22; i++) {
    const bw = 6 + hash2(i, seed) * 12, bh = 8 + hash2(i + 40, seed) * 30;
    const blk = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, 5), flat(PAL.skylineBlock));
    blk.position.set(-90 + i * 9 + hash2(i, 9) * 5, H - 6 + bh / 2, -70 - hash2(i, 3) * 40);
    root.add(blk);
    for (let k = 0; k < 6; k++) {
      if (hash2(i * 19 + k, seed) < 0.62) continue;
      const w = decal(0.5, 0.7, PAL.windowLit, 0.85);
      w.position.set(blk.position.x - bw / 2 + 1.2 + (k % 3) * (bw / 3), H - 2 + Math.floor(k / 3) * (bh / 3), blk.position.z + 2.6);
      root.add(w);
    }
  }

  // --- the alley floor, a long way down. This is the whole point of the set. ---
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(70, 90), toon(PAL.asphalt, 2));
  ground.rotation.x = -Math.PI / 2;
  root.add(ground);
  const lamps = o.alleyLamps ?? 3;
  for (let i = 0; i < lamps; i++) {
    const z = -16 + i * 16;
    const pool = decal(5.2, 5.2, PAL.lampWarm, 0.3);
    pool.rotation.x = -Math.PI / 2;
    pool.position.set(-3.2, 0.03, z);
    root.add(pool);
    const l = new THREE.PointLight(new THREE.Color(PAL.lampWarm), 3.4, 26, 2);
    l.position.set(-3.2, 4.4, z);
    root.add(l);
    const head = decal(0.6, 0.3, PAL.lampCore, 1);
    head.rotation.x = -Math.PI / 2;
    head.position.set(-3.2, 4.3, z);
    root.add(head);
  }
  // the beam's own shadow on the alley floor sells the height
  const shadow = decal(beamW * 6, span, '#000000', 0.34);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(0, 0.05, 0);
  root.add(shadow);

  // --- the two buildings ---
  // The POV walks forward along -Z, so the two buildings sit NEAR (+Z) and FAR (-Z) and the
  // beam bridges the gap between them. (The first build put them left and right, which left
  // the beam running parallel to the gap instead of across it.)
  const bw = 26, bd = 14;
  const near = roofBlock(bw, bd, H, seed, o.vents !== false);
  near.position.set(0, H, span / 2 + bd / 2);
  root.add(near);
  const far = roofBlock(bw, bd, H, seed + 31, o.vents !== false);
  far.position.set(0, H, -(span / 2 + bd / 2));
  root.add(far);

  // lit windows on the inward faces - what you see when you look down past your shoes
  // Lit windows on the two facing walls of the gap - this is what you see when you make the
  // mistake of looking down past your own shoes.
  for (const sz of [-1, 1]) {
    for (let fl = 1; fl < storeys; fl++) {
      for (let c = 0; c < 7; c++) {
        if (hash2(fl * 13 + c, seed + (sz > 0 ? 7 : 0)) < 0.5) continue;
        const w = decal(0.85, 1.15, hash2(fl + c, seed) > 0.5 ? PAL.windowLit : PAL.windowDim, 0.92);
        w.rotation.y = sz > 0 ? Math.PI : 0;
        w.position.set(-9 + c * 3, fl * 3.1 + 1.2, sz * (span / 2 + 0.03));
        root.add(w);
      }
    }
    // a fire escape clinging to one wall, small with distance
    for (let fl = 2; fl < storeys - 1; fl++) {
      const plat = box(1.6, 0.06, 0.9, PAL.metal, 2, 2);
      plat.position.set(-6.5, fl * 3.1, sz * (span / 2 - 0.45));
      root.add(plat);
      const rail = box(1.6, 0.5, 0.05, PAL.metal, 1.6, 2);
      rail.position.set(-6.5, fl * 3.1 + 0.28, sz * (span / 2 - 0.9));
      root.add(rail);
    }
  }

  // --- the beam ---
  // The beam must be LIGHTER than the gap behind it or the shot has no subject.
  const beamColor = o.beam === 'rusted' ? '#8a5a3e' : PAL.metalLit;
  const beam = iBeam(span + 2.8, beamW, beamColor, seed);
  beam.position.set(0, H - 0.12, 0);
  root.add(beam);
  // a dedicated light on the beam: it is the only safe ground in the shot, so it reads
  const beamLight = new THREE.PointLight(new THREE.Color('#cfd6ff'), 2.6, 16, 2);
  beamLight.position.set(0, H + 2.2, 0);
  root.add(beamLight);
  if (o.beam === 'wet') {
    const sheen = decal(beamW * 0.9, span, '#aeb6d8', 0.26);
    sheen.rotation.x = -Math.PI / 2;
    sheen.position.set(0, H - 0.005, 0);
    root.add(sheen);
  }

  if (o.tank !== false) {
    const tank = inked(new THREE.CylinderGeometry(1.25, 1.25, 2.3, 14), toon('#5a4332', 3), 3);
    tank.position.set(-7.5, H + 2.6, -(span / 2 + 5.5));
    root.add(tank);
    const lid = inked(new THREE.ConeGeometry(1.35, 0.6, 14), toon('#48352a', 3), 2.5);
    lid.position.set(-7.5, H + 4.0, -(span / 2 + 5.5));
    root.add(lid);
    for (let i = 0; i < 4; i++) {
      const leg = box(0.13, 1.45, 0.13, PAL.metal, 2, 2);
      const a = (i / 4) * Math.PI * 2 + 0.4;
      leg.position.set(-7.5 + Math.cos(a) * 0.95, H + 0.72, -(span / 2 + 5.5) + Math.sin(a) * 0.95);
      root.add(leg);
    }
    // the hoop bands - without them a water tank reads as a bin
    for (let i = 0; i < 3; i++) {
      const band = inked(new THREE.TorusGeometry(1.27, 0.035, 6, 18), toon(PAL.metal, 2), 1.5);
      band.rotation.x = Math.PI / 2;
      band.position.set(-7.5, H + 1.8 + i * 0.75, -(span / 2 + 5.5));
      root.add(band);
    }
  }

  return root;
};
