// Scroll Kaos v0.5 - the antagonist.
//
// THE ONE-CREATURE LAW (quality-law.md section 7): one story, one antagonist, one design,
// never drifting. The spec is written ONCE, in story/creature.json, imported here, and never
// re-typed inside a set. The only thing allowed to change between shots is a DECLARED STATE
// (dry/soaked, clean/burnt, masked/unmasked). A different design is a different monster and
// the build fails.
//
// The blueprint below is the reference's shape language, which is what the user asked the
// engine to be able to draw. It is parameterised, so a new story gets its OWN creature out of
// the same rig instead of the same creature in a new story.

import * as THREE from 'three';
import { PAL, INK } from '../three/palette';
import { toon, flat, inked, box } from '../three/toon';
import { hash2 } from '../three/noise';
import type { ActorSpec } from './Cast3D';

/**
 * The face family. The creature rig is NOT one monster - it is the shape language, and the
 * face is what makes a story's own antagonist out of it.
 *   'grin'   long stitched smile, hollow sockets, tear tracks   (the HUSH blueprint)
 *   'blank'  NO eyes at all, no mouth - a smooth featureless head. The scariest of the
 *            three on a still frame, because there is nothing to read.
 *   'maw'    no eyes, one wide open vertical mouth
 *   'glow'   burning pinpoint eyes in a dark hollow - for a scarecrow or a possessed body
 */
export type CreatureFace = 'grin' | 'blank' | 'maw' | 'glow';

export type CreatureSpec = {
  face?: CreatureFace;
  /** 'none' for a hairless entity. The reference's unknown entity is completely hairless. */
  hairStyle?: 'locks' | 'none';
  /** skull shape: 'long' is the mask, 'bulb' is the swollen cranium of the reference entity */
  skull?: 'long' | 'bulb' | 'round';
  /** burning eye colour when face is 'glow' */
  glow?: string;
  /** straw bristles at the cuffs, collar and ankles - the scarecrow build */
  straw?: string;
  hat?: 'none' | 'straw';
  /** total height as a MULTIPLE of an adult human (1.72 m). Reference reads 1.45-1.6x. */
  scale?: number;
  /** arm length as a multiple of normal. 1.0 is human; the reference is ~1.5. */
  armLong?: number;
  /** face plate colour */
  mask?: string;
  cloth?: string;
  clothDark?: string;
  hands?: string;
  hair?: string;
  hairLen?: number;
  /** mouth: how wide the grin runs, 0-1 */
  grin?: number;
  /** how many stitch marks across the grin. 0 = a smooth smile. */
  stitches?: number;
  /** black vertical tear tracks under the sockets */
  tears?: boolean;
  /** a hanging pendant - a small readable prop that proves it is the same creature */
  pendant?: string;
  /** DECLARED STATES - the only legal difference between two shots of one creature */
  state?: {
    wet?: boolean;
    burnt?: boolean;
    blood?: boolean;
    /** head tilt in degrees - unnatural angles are a behaviour, not a redesign */
    tilt?: number;
  };
  /** what it is doing */
  pose?: 'loom' | 'stand' | 'crouch_spider' | 'reach' | 'hold_two' | 'stride' | 'lean_lens';
  phase?: number;
};

const INK_C = 5.5;

/** The face plate: pale mask, hollow sockets with pinprick pupils, long jagged grin. */
const creatureFace = (R: number, s: CreatureSpec): THREE.Group => {
  const g = new THREE.Group();
  const kind = s.face ?? 'grin';

  // 'blank' is deliberately almost nothing. Resist the urge to add a hint of a feature -
  // the absence IS the design, and anything added makes it a worse version of 'grin'.
  if (kind === 'blank') {
    const shade = new THREE.Mesh(new THREE.CircleGeometry(R * 0.5, 18), flat(PAL.maskShade, { opacity: 0.4 }));
    shade.scale.set(1.25, 0.5, 1);
    shade.position.set(0, R * 0.1, R * 1.0); shade.renderOrder = 2;
    g.add(shade);
    return g;
  }

  if (kind === 'maw') {
    const z0 = R * 1.0;
    const maw = new THREE.Mesh(new THREE.CircleGeometry(R * 0.34, 18), flat('#0b0910'));
    maw.scale.set(0.52, 1.5, 1);
    maw.position.set(0, -R * 0.12, z0 + 0.01); maw.renderOrder = 3;
    g.add(maw);
    for (let i = 0; i < 9; i++) {
      const t = new THREE.Mesh(new THREE.ConeGeometry(R * 0.045, R * 0.16, 3), flat('#e8dfd0'));
      const sx = i % 2 ? 1 : -1;
      t.position.set(sx * R * 0.14, R * (0.34 - i * 0.1), z0 + 0.02);
      t.rotation.z = sx > 0 ? -1.6 : 1.6; t.renderOrder = 4;
      g.add(t);
    }
    return g;
  }

  if (kind === 'glow') {
    const col = s.glow ?? '#ffa32e';
    for (const sx of [-1, 1]) {
      const hollow = new THREE.Mesh(new THREE.CircleGeometry(R * 0.2, 14), flat('#0b0910'));
      hollow.position.set(sx * R * 0.33, R * 0.14, R * 1.0); hollow.renderOrder = 3;
      g.add(hollow);
      const ember = new THREE.Mesh(new THREE.CircleGeometry(R * 0.1, 12), flat(col));
      ember.position.set(sx * R * 0.33, R * 0.14, R * 1.02); ember.renderOrder = 4;
      g.add(ember);
      const halo = new THREE.Mesh(new THREE.CircleGeometry(R * 0.26, 14), flat(col, { opacity: 0.28 }));
      halo.position.set(sx * R * 0.33, R * 0.14, R * 1.015); halo.renderOrder = 3;
      g.add(halo);
      const lamp = new THREE.PointLight(new THREE.Color(col), 0.8, R * 9, 2);
      lamp.position.set(sx * R * 0.33, R * 0.14, R * 1.3);
      g.add(lamp);
    }
    const stitch = new THREE.Mesh(new THREE.PlaneGeometry(R * 0.8, R * 0.05), flat(INK));
    stitch.position.set(0, -R * 0.4, R * 1.01); stitch.renderOrder = 3;
    g.add(stitch);
    for (let i = 0; i < 6; i++) {
      const c = new THREE.Mesh(new THREE.PlaneGeometry(R * 0.03, R * 0.16), flat(INK));
      c.position.set(-R * 0.34 + i * R * 0.136, -R * 0.4, R * 1.015); c.renderOrder = 4;
      g.add(c);
    }
    return g;
  }

  // The plate must sit CLEAR of the skull sphere or it z-fights and the face vanishes -
  // which is exactly what the first cast preview showed.
  const z = R * 1.02;
  const mask = s.mask ?? PAL.maskPale;
  const plate = new THREE.Mesh(new THREE.CircleGeometry(R * 0.99, 24), flat(mask, { depthWrite: false }));
  plate.scale.set(0.92, 1.08, 1);
  plate.position.set(0, 0, z);
  plate.renderOrder = 2;
  g.add(plate);

  for (const sx of [-1, 1]) {
    const socket = new THREE.Mesh(new THREE.CircleGeometry(R * 0.21, 18), flat('#0d0b12'));
    socket.scale.set(0.92, 1.15, 1);
    socket.position.set(sx * R * 0.34, R * 0.18, z + 0.012); socket.renderOrder = 3;
    g.add(socket);
    const pupil = new THREE.Mesh(new THREE.CircleGeometry(R * 0.062, 12), flat('#f6f2ea'));
    pupil.position.set(sx * R * 0.34, R * 0.2, z + 0.02); pupil.renderOrder = 4;
    g.add(pupil);
    if (s.tears !== false) {
      // The track must start BELOW the socket. Overlapping it turns the eye into a lollipop
      // on a stick, which is what the first creature sheet showed.
      const top = R * 0.18 - R * 0.21 * 1.15;         // bottom edge of the socket
      // Wide enough to read as a smear running down the mask, and long enough to pass the
      // grin. A thin line the width of the pupil just makes the eye look like a lollipop.
      const len = R * 0.95;
      const tear = new THREE.Mesh(new THREE.PlaneGeometry(R * 0.17, len), flat(PAL.creatureTear));
      tear.position.set(sx * R * 0.34, top - len / 2, z + 0.016); tear.renderOrder = 3;
      g.add(tear);
      // a heavier bead where it leaves the socket, so it reads as running, not as a line
      const bead = new THREE.Mesh(new THREE.CircleGeometry(R * 0.105, 12), flat(PAL.creatureTear));
      bead.position.set(sx * R * 0.34, top - R * 0.02, z + 0.018); bead.renderOrder = 3;
      g.add(bead);
    }
  }

  // the grin: a long flat arc, with stitch marks crossing it
  const grin = Math.min(1, Math.max(0.2, s.grin ?? 0.85));
  const gw = R * 1.3 * grin;
  const mouth = new THREE.Mesh(new THREE.PlaneGeometry(gw, R * 0.2), flat(INK));
  mouth.position.set(0, -R * 0.42, z + 0.016); mouth.renderOrder = 3;
  g.add(mouth);
  for (const sx of [-1, 1]) {
    const up = new THREE.Mesh(new THREE.PlaneGeometry(R * 0.22, R * 0.17), flat(INK));
    up.position.set(sx * gw * 0.5, -R * 0.33, z + 0.016); up.renderOrder = 3;
    up.rotation.z = sx * 0.7;
    g.add(up);
  }
  const nSt = s.stitches ?? 7;
  for (let i = 0; i < nSt; i++) {
    const st = new THREE.Mesh(new THREE.PlaneGeometry(R * 0.028, R * 0.3), flat(INK));
    st.position.set(-gw * 0.46 + (i / Math.max(1, nSt - 1)) * gw * 0.92, -R * 0.42, z + 0.024); st.renderOrder = 4;
    st.rotation.z = (hash2(i, 3) - 0.5) * 0.3;
    g.add(st);
  }
  return g;
};

const POSE_C: Record<NonNullable<CreatureSpec['pose']>, (p: number) => number[]> = {
  // [shoulderL, shoulderR, elbowL, elbowR, hipL, hipR, kneeL, kneeR, spine, headPitch, headYaw]
  loom: () => [0.5, -0.5, 0.35, 0.35, 0.05, -0.05, 0.08, 0.08, -0.12, 0.34, 0],
  // The arms are the whole point of this rig, so even the neutral stand holds them clear of
  // the body. Tucked in, a 1.6x arm reads as a normal arm and the silhouette says nothing.
  stand: () => [0.1, -0.1, 0.12, 0.12, 0.03, -0.03, 0.05, 0.05, 0, 0, 0],
  crouch_spider: () => [1.5, -1.5, 2.2, 2.2, 1.5, -1.5, 1.9, 1.9, 0.9, -0.5, 0],
  // -2.0 rad swings the arm past horizontal and straight overhead, which reads as a cheer,
  // not a reach. Forward-and-slightly-down is about -1.4.
  reach: (p) => [-1.35 - 0.25 * p, -0.35, 0.12, 0.4, 0.08, -0.08, 0.1, 0.1, 0.15, -0.08, 0],
  hold_two: () => [-2.25, 2.25, 0.25, 0.25, 0.05, -0.05, 0.06, 0.06, -0.05, 0.12, 0],
  stride: (p) => { const s = Math.sin(p * Math.PI * 2); return [-s * 0.8, s * 0.8, 0.4, 0.4, s * 0.7, -s * 0.7, 0.4, 0.4, 0.05, 0, 0]; },
  lean_lens: () => [0.7, -0.7, 0.6, 0.6, 0.1, -0.1, 0.12, 0.12, 0.45, 0.5, 0.25],
};

const limbC = (r: number, len: number, color: string): THREE.Group => {
  const g = new THREE.Group();
  const seg = inked(new THREE.CapsuleGeometry(r, len, 4, 9), toon(color, 3), INK_C);
  seg.position.y = -len / 2;
  g.add(seg);
  const joint = inked(new THREE.SphereGeometry(r * 1.1, 10, 8), toon(color, 3), INK_C);
  g.add(joint);
  return g;
};

/** Long skeletal clawed fingers. The hands are what the lens sees last. */
const claw = (r: number, color: string): THREE.Group => {
  const g = new THREE.Group();
  const palm = inked(new THREE.BoxGeometry(r * 2.1, r * 2.3, r * 0.8), toon(color, 2), INK_C);
  g.add(palm);
  for (let i = 0; i < 4; i++) {
    const fl = r * (2.5 - i * 0.18);
    const f = inked(new THREE.CapsuleGeometry(r * 0.28, fl, 3, 6), toon(color, 2), INK_C * 0.8);
    f.position.set(-r * 0.85 + i * r * 0.58, -r * 1.3 - fl / 2, 0);
    f.rotation.z = (i - 1.5) * 0.1;
    g.add(f);
  }
  const th = inked(new THREE.CapsuleGeometry(r * 0.3, r * 2.0, 3, 6), toon(color, 2), INK_C * 0.8);
  th.position.set(-r * 1.5, -r * 0.6, r * 0.2);
  th.rotation.z = 1.1;
  g.add(th);
  return g;
};

/**
 * Build the creature. Feet at y=0, FACES +Z at yaw 0 - the same contract as buildCast, so a
 * scene can swap a human for the creature without touching the placement. See the note on
 * buildCast: yaw 0 faces a camera that is at +Z, yaw 180 turns its back to one.
 */
export const buildCreature = (spec: ActorSpec & { creature?: CreatureSpec }): THREE.Group => {
  const c: CreatureSpec = spec.creature ?? {};
  const st = c.state ?? {};
  const scale = c.scale ?? 1.52;
  const H = 1.72 * scale;
  const armMul = c.armLong ?? 1.5;
  const cloth = st.burnt ? '#272329' : (c.cloth ?? PAL.creatureCloth);
  const clothDark = c.clothDark ?? PAL.creatureClothDark;
  const hands = c.hands ?? PAL.creatureHand;
  const pose = c.pose ?? spec.pose as any ?? 'loom';
  const p = c.phase ?? spec.phase ?? 0.3;

  const R = H * 0.105;
  const torsoLen = H * 0.3;
  const hipY = H * 0.5;
  const shoulderY = hipY + torsoLen;
  const armLen = H * 0.2 * armMul, legLen = H * 0.245;
  const armR = H * 0.036, legR = H * 0.042;

  const a = (POSE_C[pose] ?? POSE_C.loom)(p);
  const root = new THREE.Group();
  const body = new THREE.Group();
  root.add(body);

  // A crouch folds the legs, so the hips have to come DOWN or the whole creature floats a
  // metre off the floor - which is what the first creature sheet showed.
  if (pose === 'crouch_spider') body.position.y = -H * 0.3;

  const torso = inked(new THREE.CapsuleGeometry(H * (c.face === 'blank' || c.face === 'maw' ? 0.072 : 0.088), torsoLen * 0.78, 5, 12), toon(cloth, 3), INK_C);
  torso.position.y = hipY + torsoLen * 0.5;
  torso.rotation.x = a[8];
  body.add(torso);

  // hood opening + drawstrings: the detail that makes the chest read as a garment
  const clothed = c.face !== 'blank' && c.face !== 'maw';
  if (clothed) {
    const hoodOpen = new THREE.Mesh(new THREE.CircleGeometry(H * 0.055, 16), flat(clothDark));
    hoodOpen.position.set(0, shoulderY - H * 0.02, H * 0.088);
    body.add(hoodOpen);
    for (const sx of [-1, 1]) {
      const strm = new THREE.Mesh(new THREE.PlaneGeometry(H * 0.009, H * 0.085), flat(INK));
      strm.position.set(sx * H * 0.022, shoulderY - H * 0.075, H * 0.0885);
      body.add(strm);
    }
  }
  if (c.pendant) {
    const pend = inked(new THREE.CylinderGeometry(H * 0.019, H * 0.019, H * 0.006, 12), toon(c.pendant ?? PAL.pendantGold, 2), INK_C * 0.7);
    pend.rotation.x = Math.PI / 2;
    pend.position.set(0, shoulderY - H * 0.1, H * 0.09);
    body.add(pend);
  }
  if (c.face === 'blank' || c.face === 'maw') {
    // A bare entity needs anatomy or it reads as a mannequin. Ribs you could count, a
    // sternum line, and a hollow under the ribcage - nothing more.
    for (let i = 0; i < 5; i++) {
      for (const sx of [-1, 1]) {
        const rib = inked(new THREE.TorusGeometry(H * 0.052, H * 0.0075, 5, 9, Math.PI * 0.8), toon(clothDark, 2), INK_C * 0.45);
        rib.position.set(sx * H * 0.032, shoulderY - H * 0.045 - i * H * 0.028, H * 0.062);
        rib.rotation.set(Math.PI / 2, sx > 0 ? 0.5 : Math.PI - 0.5, 0);
        body.add(rib);
      }
    }
    const sternum = new THREE.Mesh(new THREE.PlaneGeometry(H * 0.008, H * 0.14), flat(clothDark, { opacity: 0.6 }));
    sternum.position.set(0, shoulderY - H * 0.09, H * 0.089);
    body.add(sternum);
    const hollow = new THREE.Mesh(new THREE.CircleGeometry(H * 0.055, 14), flat(clothDark, { opacity: 0.45 }));
    hollow.scale.set(1.25, 0.8, 1);
    hollow.position.set(0, hipY + torsoLen * 0.34, H * 0.088);
    body.add(hollow);
  } else {
    const pocket = new THREE.Mesh(new THREE.PlaneGeometry(H * 0.12, H * 0.065), flat(clothDark));
    pocket.position.set(0, hipY + torsoLen * 0.22, H * 0.089);
    body.add(pocket);
  }

  const hips = inked(new THREE.BoxGeometry(H * 0.15, H * 0.09, H * 0.105), toon(clothDark, 3), INK_C);
  hips.position.y = hipY + H * 0.01;
  body.add(hips);

  // head
  const head = new THREE.Group();
  const skull = inked(new THREE.SphereGeometry(R, 20, 15), toon(c.mask ?? PAL.maskPale, 2), INK_C);
  // 'bulb' is the swollen smooth cranium of the reference's unknown entity: tall, heavy at
  // the top, narrow at the jaw. 'long' is the mask. 'round' is a plain head.
  if (c.skull === 'bulb') skull.scale.set(1.02, 1.32, 0.98);
  else if (c.skull === 'round') skull.scale.set(1, 1, 1);
  else skull.scale.set(1, 1.1, 0.86);
  head.add(skull);
  if (c.skull === 'bulb') {
    const jaw = inked(new THREE.SphereGeometry(R * 0.66, 14, 10), toon(c.mask ?? PAL.maskPale, 2), INK_C);
    jaw.scale.set(0.86, 0.78, 0.9);
    jaw.position.set(0, -R * 0.78, R * 0.06);
    head.add(jaw);
  }
  head.add(creatureFace(R, c));
  // long stringy hair either side of the plate
  // The hair has to FRAME the mask from the front, not hide behind the skull - it is half
  // of the silhouette. Two slabs at the sides plus two forward locks over the temples.
  const hairLen = c.hairLen ?? 1.5;
  const hairless = c.hairStyle === 'none';
  for (const sx of hairless ? [] : [-1, 1]) {
    const hr = inked(new THREE.BoxGeometry(R * 0.42, R * hairLen, R * 1.25), toon(c.hair ?? PAL.creatureHair, 2), INK_C);
    hr.position.set(sx * R * 0.92, -R * (hairLen * 0.26), -R * 0.05);
    head.add(hr);
    const lock = inked(new THREE.BoxGeometry(R * 0.26, R * hairLen * 0.72, R * 0.3), toon(c.hair ?? PAL.creatureHair, 2), INK_C);
    lock.position.set(sx * R * 0.7, -R * (hairLen * 0.12), R * 0.72);
    lock.rotation.z = sx * 0.12;
    head.add(lock);
  }
  if (!hairless) {
    const top = inked(new THREE.SphereGeometry(R * 1.05, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.46), toon(c.hair ?? PAL.creatureHair, 2), INK_C);
    top.position.y = R * 0.3;
    top.scale.set(1, 1.05, 0.95);
    head.add(top);
  }

  head.position.y = shoulderY + R * 1.0;
  head.rotation.x = a[9];
  head.rotation.y = a[10] ?? 0;
  head.rotation.z = ((st.tilt ?? 0) * Math.PI) / 180;
  body.add(head);

  const neck = inked(new THREE.CylinderGeometry(R * 0.26, R * 0.3, H * 0.06, 9), toon(c.mask ?? PAL.maskPale, 2), INK_C * 0.7);
  neck.position.y = shoulderY + R * 0.12;
  body.add(neck);

  // arms - long, thin, with the claw at the end
  for (const [i, sx] of [[0, -1], [1, 1]] as [number, number][]) {
    const upper = limbC(armR, armLen, cloth);
    upper.position.set(sx * H * 0.092, shoulderY, 0);
    upper.rotation.x = a[i];
    // swing the whole arm outward so the length is visible in silhouette
    upper.rotation.z = sx * -0.22;
    body.add(upper);
    const lower = limbC(armR * 0.88, armLen, cloth);
    lower.position.y = -armLen;
    lower.rotation.x = a[2 + i];
    upper.add(lower);
    const h = claw(armR * 0.95, hands);
    h.position.y = -armLen - armR;
    lower.add(h);
  }

  for (const [i, sx] of [[0, -1], [1, 1]] as [number, number][]) {
    const thigh = limbC(legR, legLen, clothDark);
    thigh.position.set(sx * H * 0.05, hipY, 0);
    thigh.rotation.x = a[4 + i];
    body.add(thigh);
    const shin = limbC(legR * 0.84, legLen, clothDark);
    shin.position.y = -legLen;
    shin.rotation.x = a[6 + i];
    thigh.add(shin);
    const foot = inked(new THREE.BoxGeometry(legR * 1.9, legR * 0.85, legR * 3.0), toon('#1b1920', 2), INK_C);
    foot.position.set(0, -legLen - legR * 0.4, legR * 0.8);
    shin.add(foot);
  }

  // --- straw. A scarecrow is the creature silhouette with bristles bursting out of every
  // cuff, collar and hem. The bristles are what make it read as stuffed rather than thin.
  if (c.straw) {
    const strawCol = c.straw;
    const tuftAt = (x: number, y: number, z: number, n: number, len: number, spread: number) => {
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        const b = inked(new THREE.ConeGeometry(H * 0.009, len, 3), toon(strawCol, 2), INK_C * 0.5);
        b.position.set(x + Math.cos(a) * spread, y, z + Math.sin(a) * spread);
        b.rotation.set(Math.cos(a) * 0.9, a, Math.sin(a) * 0.9);
        body.add(b);
      }
    };
    tuftAt(0, shoulderY + H * 0.01, 0, 10, H * 0.12, H * 0.06);          // collar
    tuftAt(0, hipY - H * 0.01, 0, 10, H * 0.1, H * 0.07);                // waist
    for (const sx of [-1, 1]) {
      tuftAt(sx * H * 0.095, shoulderY - armLen * 1.9, 0, 7, H * 0.1, H * 0.035);   // cuffs
      tuftAt(sx * H * 0.05, legR * 1.4, legR * 0.4, 6, H * 0.08, H * 0.03);         // ankles
    }
  }
  if (c.hat === 'straw') {
    const hatCol = c.straw ?? '#b89050';
    const crown = inked(new THREE.CylinderGeometry(R * 0.82, R * 0.98, R * 0.8, 14), toon(hatCol, 3), INK_C);
    crown.position.y = R * 0.9; head.add(crown);
    const brim = inked(new THREE.CylinderGeometry(R * 2.15, R * 2.15, R * 0.07, 18), toon(hatCol, 3), INK_C);
    brim.position.y = R * 0.5; brim.rotation.z = 0.07; head.add(brim);
    const band = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.99, R * 0.99, R * 0.14, 14), flat('#5a4330'));
    band.position.y = R * 0.56; head.add(band);
  }

  // declared states - a visible difference that is NOT a redesign
  if (st.wet) {
    const sheen = new THREE.Mesh(new THREE.PlaneGeometry(H * 0.17, torsoLen * 0.8), flat('#aeb6d8', { opacity: 0.22 }));
    sheen.position.set(0, hipY + torsoLen * 0.5, H * 0.09);
    body.add(sheen);
  }
  if (st.blood) {
    for (let i = 0; i < 4; i++) {
      const stain = new THREE.Mesh(new THREE.CircleGeometry(H * 0.03 * (0.6 + hash2(i, 3)), 10), flat(i % 2 ? PAL.blood : PAL.bloodDry, { opacity: 0.95 }));
      stain.scale.set(1, 1.7, 1);
      stain.position.set((hash2(i, 5) - 0.5) * H * 0.12, hipY + torsoLen * (0.2 + hash2(i, 7) * 0.6), H * 0.0905);
      body.add(stain);
    }
  }
  if (st.burnt) {
    for (let i = 0; i < 6; i++) {
      const ash = new THREE.Mesh(new THREE.CircleGeometry(H * 0.022 * (0.7 + hash2(i, 11)), 8), flat('#14121a', { opacity: 0.85 }));
      ash.position.set((hash2(i, 13) - 0.5) * H * 0.15, hipY + torsoLen * (0.1 + hash2(i, 17) * 0.8), H * 0.0905);
      body.add(ash);
    }
  }

  root.position.set(...(spec.at ?? [0, 0, 0]));
  root.rotation.y = ((spec.yaw ?? 0) * Math.PI) / 180;
  return root;
};

export const CREATURE_POSES = Object.keys(POSE_C);
