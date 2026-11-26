// Scroll Kaos v0.5 - the stylized human cast.
//
// Proportions and face rules read off the reference frames:
//   - head is BIG: about 1/4.2 of total height, not the 1/7.5 of a real person
//   - limbs are chunky rounded capsules with a visible joint ball at shoulder, elbow, knee
//   - clothes are flat everyday streetwear: hoodie, zip jacket, tracksuit, pyjamas, sneakers
//   - the face is 2D ON the 3D head: big black ovals with one white specular dot, thick dark
//     brows, a tiny nose, and a simple mouth shape
//   - when terrified or crying, two bold pale vertical streaks run down the cheeks
//
// Every character gets a DISTINCT silhouette and clothing colour so two of them stay
// readable in a dark alley. That is the cast rule, not a style preference.

import * as THREE from 'three';
import { PAL, INK } from '../three/palette';
import { toon, flat, inked, box } from '../three/toon';
import { hash2 } from '../three/noise';

export type HairStyle = 'bowl' | 'crop' | 'curly' | 'bun' | 'pigtail' | 'long' | 'braid' | 'cap'
  | 'bald' | 'balding' | 'messy' | 'slick' | 'wild';
export type MouthShape = 'rest' | 'open' | 'wide' | 'grit' | 'small' | 'flat' | 'frown' | 'tight';

/**
 * The six expressions every character must ship with (channel character template).
 * One name sets the brows, the eyes and the mouth together, so "scared" is the same
 * scared on every character and a scene table never hand-tunes a face.
 */
export type Expression = 'normal' | 'scared' | 'shocked' | 'sad' | 'angry' | 'confused' | 'crying';

type FacePreset = { brow: number; browLift: number; eye: number; mouth: MouthShape; tears?: boolean; shut?: boolean };

const EXPR: Record<Expression, FacePreset> = {
  //        brow tilt   brow height   eye scale   mouth
  normal:   { brow: -0.10, browLift: 0.00, eye: 1.00, mouth: 'rest' },
  scared:   { brow:  0.34, browLift: 0.07, eye: 1.16, mouth: 'small' },
  shocked:  { brow:  0.10, browLift: 0.15, eye: 1.30, mouth: 'open' },
  sad:      { brow:  0.40, browLift: 0.02, eye: 0.94, mouth: 'frown' },
  angry:    { brow: -0.46, browLift: -0.07, eye: 0.86, mouth: 'grit' },
  confused: { brow:  0.26, browLift: 0.05, eye: 1.02, mouth: 'tight' },
  crying:   { brow:  0.42, browLift: 0.03, eye: 1.04, mouth: 'frown', tears: true, shut: false },
};

export type LookSpec = {
  /** total height in metres. 1.72 adult, 1.55 teen, 1.12 young child. */
  h?: number;
  /** facial hair - a main lever for telling adult men apart in a dark frame */
  facial?: Facial;
  glasses?: boolean;
  hat?: Headwear;
  hatColor?: string;
  /** an outer garment over the top: changes the SILHOUETTE, which is the point */
  coat?: 'none' | 'long' | 'lab' | 'jacket' | 'vest';
  coatColor?: string;
  /** bald / balding: set hairStyle to 'bald' or 'balding' */
  /** a spectral character: translucent, cold, and it does not touch the floor */
  spectral?: boolean;
  spectralTint?: string;
  skin?: string;
  skinShade?: string;
  hair?: string;
  hairStyle?: HairStyle;
  /** top garment */
  top?: string;
  /** trousers / skirt */
  legs?: string;
  shoes?: string;
  /** sleeve, if it differs from top */
  sleeve?: string;
};

export type PoseName =
  | 'stand' | 'walk' | 'run' | 'reach' | 'cower' | 'point'
  | 'held_up' | 'lie' | 'fall' | 'hug' | 'sit' | 'crawl';

export type ActorState = {
  /** The expression. Setting this is the normal way to drive a face. */
  expr?: Expression;
  /** pale vertical tear streaks down the cheeks. Implied by expr 'crying'. */
  crying?: boolean;
  /** bright red stains - stains, drips and pools only, never an open wound */
  blood?: 'none' | 'spots' | 'smear';
  /** override just the mouth, on top of expr */
  mouth?: MouthShape;
  /** eyes shut: used for the hug and for a body that has stopped moving */
  eyesShut?: boolean;
};

export type ActorSpec = {
  id: string;
  kind?: 'human' | 'creature';
  look?: LookSpec;
  pose?: PoseName;
  state?: ActorState;
  at?: [number, number, number];
  yaw?: number;
  /** 0-1 along the pose, so a run can be caught mid-stride */
  phase?: number;
};

const INK_BODY = 5;

/** A limb segment with a joint ball at its top - the chunky look needs the ball. */
const limb = (r: number, len: number, color: string): THREE.Group => {
  const g = new THREE.Group();
  const seg = inked(new THREE.CapsuleGeometry(r, len, 4, 9), toon(color, 3), INK_BODY);
  seg.position.y = -len / 2;
  g.add(seg);
  const joint = inked(new THREE.SphereGeometry(r * 1.12, 10, 8), toon(color, 3), INK_BODY);
  g.add(joint);
  return g;
};

/** Eyes, brows, nose, mouth and tear streaks, as flat shapes sitting on the head. */
const face = (R: number, st: ActorState, skinShade: string): THREE.Group => {
  const g = new THREE.Group();
  const e = EXPR[st.expr ?? 'normal'];
  const crying = st.crying || e.tears;
  const shut = st.eyesShut ?? e.shut ?? false;
  const mouthShape = st.mouth ?? e.mouth;
  // clear of the skull sphere, same reason as the creature's mask
  const z = R * 1.01;
  const ex = R * 0.34;
  for (const sx of [-1, 1]) {
    if (shut) {
      const lid = new THREE.Mesh(new THREE.PlaneGeometry(R * 0.34, R * 0.055), flat(INK));
      lid.position.set(sx * ex, R * 0.06, z + 0.01); lid.renderOrder = 3;
      g.add(lid);
    } else {
      // big black oval + the single white specular dot
      const eye = new THREE.Mesh(new THREE.CircleGeometry(R * 0.205 * e.eye, 18), flat(PAL.eyeInk));
      eye.scale.set(0.86, 1.14, 1);
      eye.position.set(sx * ex, R * 0.055, z); eye.renderOrder = 3;
      g.add(eye);
      const spec = new THREE.Mesh(new THREE.CircleGeometry(R * 0.058 * e.eye, 12), flat(PAL.eyeWhite));
      spec.position.set(sx * ex - R * 0.06, R * 0.13, z + 0.014); spec.renderOrder = 4;
      g.add(spec);
      const spec2 = new THREE.Mesh(new THREE.CircleGeometry(R * 0.028, 10), flat(PAL.eyeWhite));
      spec2.position.set(sx * ex + R * 0.07, R * 0.0, z + 0.014); spec2.renderOrder = 4;
      g.add(spec2);
      // a visible lower lid on a wide eye stops "shocked" reading as "dead"
      if (e.eye > 1.2) {
        const lid = new THREE.Mesh(new THREE.PlaneGeometry(R * 0.3, R * 0.03), flat(skinShade));
        lid.position.set(sx * ex, -R * 0.14, z + 0.016); lid.renderOrder = 4;
        g.add(lid);
      }
    }
    // thick dark brow. tilt and height are what carry the expression.
    const brow = new THREE.Mesh(new THREE.PlaneGeometry(R * 0.3, R * 0.07), flat(INK));
    brow.position.set(sx * ex, R * (0.33 + e.browLift), z + 0.014); brow.renderOrder = 4;
    // SIGN: a POSITIVE preset raises the INNER end (worry, fear, sadness); a negative one
    // drops it (anger). For the left brow (sx = -1) raising the inner end is a clockwise
    // turn, i.e. negative z. Getting this backwards renders "scared" as "angry", which is
    // exactly what the first expression strip showed.
    brow.rotation.z = -sx * e.brow;
    g.add(brow);
    if (crying) {
      // two bold pale streaks - the reference draws them wide and flat, not as droplets
      const streak = new THREE.Mesh(new THREE.PlaneGeometry(R * 0.085, R * 0.62), flat(PAL.tearStreak, { opacity: 0.92 }));
      streak.position.set(sx * ex, -R * 0.26, z + 0.018); streak.renderOrder = 4;
      g.add(streak);
    }
  }
  const nose = new THREE.Mesh(new THREE.CircleGeometry(R * 0.045, 10), flat(skinShade));
  nose.position.set(0, -R * 0.1, z + 0.012); nose.renderOrder = 3;
  g.add(nose);

  if (mouthShape !== 'flat') {
    const sizes: Record<MouthShape, [number, number]> = {
      rest: [0.16, 0.05], open: [0.17, 0.2], wide: [0.3, 0.26],
      grit: [0.27, 0.07], small: [0.09, 0.05], flat: [0.16, 0.02],
      frown: [0.2, 0.06], tight: [0.13, 0.04],
    };
    const [mw, mh] = sizes[mouthShape];
    const mouth = new THREE.Mesh(new THREE.CircleGeometry(R * 0.5, 18), flat(INK));
    mouth.scale.set(mw, mh, 1);
    mouth.position.set(0, -R * 0.36, z + 0.014); mouth.renderOrder = 3;
    g.add(mouth);
    if (mouthShape === 'frown') {
      // two short down-turned corners: a flat line plus corners reads as sad, a curve does not
      for (const sx of [-1, 1]) {
        const c = new THREE.Mesh(new THREE.PlaneGeometry(R * 0.09, R * 0.03), flat(INK));
        // corners DROP below the mouth line - turned up, this reads as a smile
        c.position.set(sx * R * 0.1, -R * 0.4, z + 0.014); c.renderOrder = 3;
        c.rotation.z = -sx * 0.6;
        g.add(c);
      }
    }
    if (mouthShape === 'tight') {
      const c = new THREE.Mesh(new THREE.PlaneGeometry(R * 0.07, R * 0.028), flat(INK));
      c.position.set(R * 0.09, -R * 0.4, z + 0.014); c.renderOrder = 3;
      c.rotation.z = 0.5;
      g.add(c);
    }
    if (mouthShape === 'grit') {
      const teeth = new THREE.Mesh(new THREE.PlaneGeometry(R * 0.26, R * 0.018), flat('#efe8dc'));
      teeth.position.set(0, -R * 0.36, z + 0.022); teeth.renderOrder = 4;
      g.add(teeth);
    }
  }
  return g;
};

/** Facial hair, glasses and headwear - the things that make a supporting cast tellable apart. */
export type Facial = 'none' | 'moustache' | 'stubble' | 'beard' | 'fullbeard';
export type Headwear = 'none' | 'peakedCap' | 'straw' | 'turban' | 'beanie';

const facialHair = (R: number, kind: Facial, color: string): THREE.Group => {
  const g = new THREE.Group();
  const z = R * 0.99;
  if (kind === 'moustache') {
    const m = inked(new THREE.BoxGeometry(R * 0.38, R * 0.09, R * 0.1), toon(color, 2), INK_BODY * 0.7);
    m.position.set(0, -R * 0.23, z * 0.92);
    g.add(m);
  }
  if (kind === 'stubble') {
    const s2 = new THREE.Mesh(new THREE.CircleGeometry(R * 0.46, 18), flat(color, { opacity: 0.45 }));
    s2.scale.set(1, 0.6, 1);
    s2.position.set(0, -R * 0.42, R * 1.015); s2.renderOrder = 2;
    g.add(s2);
  }
  if (kind === 'beard' || kind === 'fullbeard') {
    const len = kind === 'fullbeard' ? 1.05 : 0.62;
    const b = inked(new THREE.SphereGeometry(R * 0.82, 14, 11, 0, Math.PI * 2, Math.PI * 0.42, Math.PI * 0.58), toon(color, 2), INK_BODY);
    b.scale.set(1, len, 1.02);
    b.position.set(0, -R * 0.12, R * 0.1);
    g.add(b);
    const m = inked(new THREE.BoxGeometry(R * 0.4, R * 0.1, R * 0.12), toon(color, 2), INK_BODY * 0.7);
    m.position.set(0, -R * 0.22, z * 0.9);
    g.add(m);
  }
  return g;
};

const glassesRig = (R: number): THREE.Group => {
  const g = new THREE.Group();
  for (const sx of [-1, 1]) {
    const rim = inked(new THREE.TorusGeometry(R * 0.26, R * 0.032, 6, 16), toon('#1b1a22', 2), INK_BODY * 0.6);
    rim.position.set(sx * R * 0.34, R * 0.055, R * 1.03);
    g.add(rim);
    const lens = new THREE.Mesh(new THREE.CircleGeometry(R * 0.24, 14), flat('#cfe0ef', { opacity: 0.3 }));
    lens.position.set(sx * R * 0.34, R * 0.055, R * 1.028); lens.renderOrder = 5;
    g.add(lens);
    const arm = inked(new THREE.BoxGeometry(R * 0.05, R * 0.04, R * 0.7), toon('#1b1a22', 2), INK_BODY * 0.5);
    arm.position.set(sx * R * 0.78, R * 0.08, R * 0.62);
    g.add(arm);
  }
  const bridge = inked(new THREE.BoxGeometry(R * 0.2, R * 0.035, R * 0.05), toon('#1b1a22', 2), INK_BODY * 0.5);
  bridge.position.set(0, R * 0.09, R * 1.03);
  g.add(bridge);
  return g;
};

const headwear = (R: number, kind: Headwear, color: string): THREE.Group => {
  const g = new THREE.Group();
  if (kind === 'peakedCap') {
    const crown = inked(new THREE.CylinderGeometry(R * 1.02, R * 1.06, R * 0.5, 16), toon(color, 3), INK_BODY);
    crown.position.y = R * 0.68; g.add(crown);
    const top = inked(new THREE.CylinderGeometry(R * 1.06, R * 1.06, R * 0.05, 16), toon(color, 3), INK_BODY);
    top.position.y = R * 0.93; g.add(top);
    const peak = inked(new THREE.BoxGeometry(R * 1.5, R * 0.07, R * 0.7), toon('#15141b', 2), INK_BODY);
    peak.position.set(0, R * 0.46, R * 0.9); peak.rotation.x = -0.12; g.add(peak);
    const band = new THREE.Mesh(new THREE.CylinderGeometry(R * 1.07, R * 1.07, R * 0.14, 16), flat('#15141b'));
    band.position.y = R * 0.5; g.add(band);
  }
  if (kind === 'straw') {
    const crown = inked(new THREE.CylinderGeometry(R * 0.86, R * 1.0, R * 0.78, 14), toon(color, 3), INK_BODY);
    crown.position.y = R * 0.82; g.add(crown);
    const brim = inked(new THREE.CylinderGeometry(R * 2.1, R * 2.1, R * 0.06, 18), toon(color, 3), INK_BODY);
    brim.position.y = R * 0.46; brim.rotation.z = 0.06; g.add(brim);
  }
  if (kind === 'turban') {
    for (let i = 0; i < 4; i++) {
      const wrap = inked(new THREE.TorusGeometry(R * (1.0 - i * 0.07), R * 0.17, 8, 18), toon(color, 3), INK_BODY);
      wrap.rotation.x = Math.PI / 2;
      wrap.position.y = R * (0.46 + i * 0.22);
      wrap.rotation.z = i * 0.2;
      g.add(wrap);
    }
    const top = inked(new THREE.SphereGeometry(R * 0.68, 12, 9, 0, Math.PI * 2, 0, Math.PI * 0.5), toon(color, 3), INK_BODY);
    top.position.y = R * 1.1; g.add(top);
  }
  if (kind === 'beanie') {
    const crown = inked(new THREE.SphereGeometry(R * 1.06, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), toon(color, 3), INK_BODY);
    crown.position.y = R * 0.3; g.add(crown);
    const cuff = inked(new THREE.CylinderGeometry(R * 1.08, R * 1.08, R * 0.22, 16), toon(color, 3), INK_BODY);
    cuff.position.y = R * 0.36; g.add(cuff);
  }
  return g;
};

/**
 * Hair.
 *
 * The hairline is the fiddly part. A hemisphere swept 0.5*PI ends exactly at its own
 * equator, so the cap's front edge sits at whatever y you place it. The brows live at
 * +0.33R and are 0.07R tall, so the front edge must clear +0.40R or the hair swallows the
 * face - which is what the first character sheet showed.
 * The back of the head is covered separately by `occiput`, because a cap large enough to
 * cover the back on its own would come down over the eyes at the front.
 */
const HAIRLINE = 0.4;

const occiput = (R: number, color: string, ink: number, drop = 0.45): THREE.Group => {
  const g = new THREE.Group();
  const back = inked(new THREE.SphereGeometry(R * 1.03, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.62), toon(color, 2), ink);
  back.position.set(0, R * (HAIRLINE - drop), -R * 0.22);
  back.scale.set(0.94, 1, 0.68);
  g.add(back);
  return g;
};

const hairFor = (style: HairStyle, R: number, color: string): THREE.Group => {
  const g = new THREE.Group();
  const ink = INK_BODY;
  switch (style) {
    case 'bowl': {
      g.add(occiput(R, color, ink, 0.5));
      const cap = inked(new THREE.SphereGeometry(R * 1.07, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5), toon(color, 2), ink);
      cap.position.y = R * HAIRLINE;
      g.add(cap);
      // the straight fringe that makes a bowl cut a bowl cut - it sits ON the hairline
      const fringe = inked(new THREE.BoxGeometry(R * 1.55, R * 0.26, R * 0.5), toon(color, 2), ink);
      fringe.position.set(0, R * (HAIRLINE + 0.02), R * 0.66);
      g.add(fringe);
      break;
    }
    case 'crop': {
      g.add(occiput(R, color, ink, 0.4));
      const cap = inked(new THREE.SphereGeometry(R * 1.04, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5), toon(color, 2), ink);
      cap.position.y = R * (HAIRLINE + 0.04);
      g.add(cap);
      break;
    }
    case 'curly': {
      g.add(occiput(R, color, ink, 0.42));
      for (let i = 0; i < 11; i++) {
        const a = (i / 11) * Math.PI * 2;
        const r = R * (0.3 + hash2(i, 3) * 0.14);
        const pf = inked(new THREE.SphereGeometry(r, 9, 7), toon(color, 2), ink * 0.8);
        // puffs ride ON the hairline, never below it at the front
        const fwd = Math.sin(a);
        const y = R * (HAIRLINE + 0.14 + hash2(i, 7) * 0.22) + (fwd > 0 ? R * 0.1 * fwd : 0);
        pf.position.set(Math.cos(a) * R * 0.7, y, fwd * R * 0.66);
        g.add(pf);
      }
      break;
    }
    case 'bun': {
      g.add(occiput(R, color, ink, 0.46));
      const cap = inked(new THREE.SphereGeometry(R * 1.04, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5), toon(color, 2), ink);
      cap.position.y = R * (HAIRLINE + 0.02); g.add(cap);
      const bun = inked(new THREE.SphereGeometry(R * 0.4, 12, 9), toon(color, 2), ink);
      bun.position.set(0, R * 0.95, -R * 0.78); g.add(bun);
      break;
    }
    case 'pigtail': {
      g.add(occiput(R, color, ink, 0.5));
      const cap = inked(new THREE.SphereGeometry(R * 1.05, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5), toon(color, 2), ink);
      cap.position.y = R * HAIRLINE; g.add(cap);
      for (const sx of [-1, 1]) {
        const tail = inked(new THREE.CapsuleGeometry(R * 0.21, R * 0.5, 4, 8), toon(color, 2), ink);
        tail.position.set(sx * R * 1.0, R * 0.2, -R * 0.2);
        tail.rotation.z = sx * 0.5; g.add(tail);
        const tie = inked(new THREE.TorusGeometry(R * 0.21, R * 0.05, 6, 12), toon(PAL.coral, 2), ink * 0.7);
        tie.position.set(sx * R * 0.86, R * 0.52, -R * 0.14);
        tie.rotation.set(Math.PI / 2, 0, sx * 0.5); g.add(tie);
      }
      break;
    }
    case 'long': {
      const cap = inked(new THREE.SphereGeometry(R * 1.05, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5), toon(color, 2), ink);
      cap.position.y = R * HAIRLINE; g.add(cap);
      const fall = inked(new THREE.BoxGeometry(R * 1.75, R * 2.1, R * 0.55), toon(color, 2), ink);
      fall.position.set(0, -R * 0.65, -R * 0.62); g.add(fall);
      break;
    }
    case 'braid': {
      g.add(occiput(R, color, ink, 0.46));
      const cap = inked(new THREE.SphereGeometry(R * 1.04, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5), toon(color, 2), ink);
      cap.position.y = R * (HAIRLINE + 0.02); g.add(cap);
      for (let i = 0; i < 4; i++) {
        const seg = inked(new THREE.SphereGeometry(R * 0.2, 9, 7), toon(color, 2), ink * 0.8);
        seg.position.set(0, R * (0.3 - i * 0.36), -R * (0.8 + i * 0.07)); g.add(seg);
      }
      break;
    }
    case 'bald': break;
    case 'balding': {
      // a horseshoe of hair around the back and sides, nothing on top
      g.add(occiput(R, color, ink, 0.3));
      for (const sx of [-1, 1]) {
        // flat against the skull and set low, or it reads as a pair of headphones
        const side = inked(new THREE.SphereGeometry(R * 0.46, 10, 8), toon(color, 2), ink * 0.8);
        side.scale.set(0.34, 0.5, 0.95);
        side.position.set(sx * R * 0.88, -R * 0.02, -R * 0.14);
        g.add(side);
      }
      break;
    }
    case 'messy': {
      // the protagonist's hair in the references: a cap with spikes breaking the silhouette
      g.add(occiput(R, color, ink, 0.44));
      const cap = inked(new THREE.SphereGeometry(R * 1.06, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5), toon(color, 2), ink);
      cap.position.y = R * HAIRLINE; g.add(cap);
      // The tufts must break the CAP's own outline or they are invisible inside it: the
      // cap has radius 1.06 R, so a tuft rooted at 0.6 R simply never shows.
      for (let i = 0; i < 11; i++) {
        const a = (i / 11) * Math.PI * 2;
        const len = R * (0.5 + hash2(i, 5) * 0.55);
        const tuft = inked(new THREE.ConeGeometry(R * 0.19, len, 4), toon(color, 2), ink * 0.85);
        const lean = 0.55 + hash2(i, 9) * 0.5;
        tuft.position.set(
          Math.cos(a) * R * 0.95,
          R * (HAIRLINE + 0.62) + len * 0.22,
          Math.sin(a) * R * 0.85,
        );
        tuft.rotation.set(Math.sin(a) * lean, a, -Math.cos(a) * lean);
        g.add(tuft);
      }
      break;
    }
    case 'slick': {
      g.add(occiput(R, color, ink, 0.34));
      const cap = inked(new THREE.SphereGeometry(R * 1.03, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5), toon(color, 2), ink);
      cap.position.y = R * (HAIRLINE + 0.06);
      cap.scale.set(1, 0.86, 1.1);
      g.add(cap);
      // the swept-back widow's peak that makes a villain read as a villain
      const peak = inked(new THREE.ConeGeometry(R * 0.22, R * 0.3, 3), toon(color, 2), ink * 0.8);
      peak.position.set(0, R * (HAIRLINE + 0.02), R * 0.88);
      peak.rotation.x = Math.PI;
      g.add(peak);
      break;
    }
    case 'wild': {
      g.add(occiput(R, color, ink, 0.5));
      for (let i = 0; i < 13; i++) {
        const a = (i / 13) * Math.PI * 2;
        const len = R * (0.6 + hash2(i, 7) * 0.8);
        const lock = inked(new THREE.ConeGeometry(R * 0.17, len, 4), toon(color, 2), ink * 0.8);
        const fwd = Math.sin(a);
        lock.position.set(Math.cos(a) * R * 0.78, R * (HAIRLINE + 0.1) - len * 0.1 + (fwd > 0 ? R * 0.2 : 0), fwd * R * 0.6);
        lock.rotation.set(0.5 - hash2(i, 11), a, Math.cos(a) * 0.9);
        g.add(lock);
      }
      break;
    }
    case 'cap': {
      const cap = inked(new THREE.SphereGeometry(R * 1.06, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5), toon(color, 2), ink);
      cap.position.y = R * (HAIRLINE - 0.06); g.add(cap);
      const peak = inked(new THREE.BoxGeometry(R * 1.45, R * 0.1, R * 0.62), toon(color, 2), ink);
      peak.position.set(0, R * (HAIRLINE - 0.04), R * 0.92); g.add(peak);
      break;
    }
  }
  return g;
};

/** Joint angles per pose, in radians. [shoulderL, shoulderR, elbowL, elbowR, hipL, hipR, kneeL, kneeR, spine, headPitch] */
const POSE: Record<PoseName, (p: number) => number[]> = {
  stand: () => [0.12, -0.12, 0.2, 0.2, 0.02, -0.02, 0.05, 0.05, 0, 0],
  walk: (p) => { const s = Math.sin(p * Math.PI * 2); return [-s * 0.6, s * 0.6, 0.3, 0.3, s * 0.5, -s * 0.5, 0.25, 0.25, 0.02, 0]; },
  run: (p) => { const s = Math.sin(p * Math.PI * 2); return [-s * 1.1, s * 1.1, 1.0, 1.0, s * 0.95, -s * 0.95, 0.75, 0.75, 0.3, -0.12]; },
  reach: (p) => [-1.4 - 0.25 * p, -0.3, 0.15, 0.35, 0.1, -0.1, 0.12, 0.12, 0.12, -0.12],
  cower: () => [1.0, -1.0, 2.1, 2.1, 0.55, -0.55, 1.5, 1.5, 0.5, 0.35],
  point: () => [-1.7, -0.2, 0.05, 0.3, 0.05, -0.05, 0.08, 0.08, 0.05, 0],
  held_up: (p) => [-2.3, 2.3, 0.5, 0.5, 0.35 + 0.1 * p, -0.35 - 0.1 * p, 0.55, 0.4, -0.1, 0.1],
  lie: () => [1.3, -1.3, 0.5, 0.5, 0.1, -0.1, 0.25, 0.1, 0, 0],
  fall: (p) => [-2.4, 2.4, 0.9, 0.9, 0.9 * p, -0.7 * p, 1.1, 0.5, -0.25, -0.3],
  hug: () => [-1.3, 1.3, 1.8, 1.8, 0.05, -0.05, 0.08, 0.08, 0.18, 0.2],
  sit: () => [0.3, -0.3, 0.7, 0.7, 1.5, -1.5, 1.5, 1.5, 0.08, 0],
  crawl: (p) => { const s = Math.sin(p * Math.PI * 2); return [-1.3 - s * 0.4, -1.3 + s * 0.4, 0.5, 0.5, 1.2 + s * 0.3, 1.2 - s * 0.3, 1.3, 1.3, 1.35, -1.1]; },
};

/**
 * Build a human. Returned Group stands with its FEET at y=0 and FACES +Z at yaw 0 - the
 * face is drawn on the +Z side of the head. A camera that sits at +Z looking toward -Z
 * therefore sees the FRONT of a figure at yaw 0, and its BACK at yaw 180. Getting this
 * backwards renders a scene full of people facing the wall, so check it before placing a cast.
 */
export const buildCast = (spec: ActorSpec): THREE.Group => {
  const L = spec.look ?? {};
  const st = spec.state ?? {};
  const pose = spec.pose ?? 'stand';
  const p = spec.phase ?? 0.25;
  const H = L.h ?? 1.68;
  const skin = L.skin ?? PAL.skinB;
  const skinShade = L.skinShade ?? PAL.skinBD;
  const top = L.top ?? '#4a5a7a';
  const sleeve = L.sleeve ?? top;
  const legs = L.legs ?? '#38394a';
  const shoes = L.shoes ?? '#23222a';
  const hairCol = L.hair ?? '#2b2026';

  // proportions, as fractions of H
  const R = H * 0.118;            // head radius - big, on purpose
  const torsoLen = H * 0.3;
  const hipY = H * 0.47;
  const shoulderY = hipY + torsoLen;
  const armLen = H * 0.21, legLen = H * 0.225;
  const armR = H * 0.044, legR = H * 0.052;

  const a = POSE[pose](p);
  const root = new THREE.Group();
  const body = new THREE.Group();
  root.add(body);

  // a lying / falling figure is rotated as a WHOLE, never a standing rig tipped sideways:
  // the pose table above gives it its own joint angles too.
  if (pose === 'lie') { body.rotation.x = -Math.PI / 2; body.position.set(0, legR * 1.3, 0); }
  if (pose === 'fall') { body.rotation.x = -0.75 - 0.5 * p; body.position.y = H * 0.25; }
  if (pose === 'crawl') { body.position.y = -H * 0.3; }
  if (pose === 'sit') { body.position.y = -H * 0.18; }

  const torso = inked(new THREE.CapsuleGeometry(H * 0.1, torsoLen * 0.72, 5, 12), toon(top, 3), INK_BODY);
  torso.position.y = hipY + torsoLen * 0.5;
  torso.rotation.x = a[8];
  body.add(torso);

  // A capsule laid on its side left a visible diagonal seam where it met the torso.
  const hips = inked(new THREE.BoxGeometry(H * 0.175, H * 0.1, H * 0.125), toon(legs, 3), INK_BODY);
  hips.position.y = hipY + H * 0.012;
  body.add(hips);

  // head + hair + face, as one unit so a head turn takes the face with it
  const head = new THREE.Group();
  const skull = inked(new THREE.SphereGeometry(R, 20, 15), toon(skin, 3), INK_BODY);
  skull.scale.set(1, 1.04, 0.92);
  head.add(skull);
  head.add(hairFor(L.hairStyle ?? 'crop', R, hairCol));
  head.add(face(R, st, skinShade));
  if (L.facial && L.facial !== 'none') head.add(facialHair(R, L.facial, hairCol));
  if (L.glasses) head.add(glassesRig(R));
  if (L.hat && L.hat !== 'none') head.add(headwear(R, L.hat, L.hatColor ?? '#2f2d38'));
  head.position.y = shoulderY + R * 0.92;
  head.rotation.x = a[9];
  body.add(head);

  const neck = inked(new THREE.CylinderGeometry(R * 0.3, R * 0.34, H * 0.045, 9), toon(skin, 3), INK_BODY * 0.7);
  neck.position.y = shoulderY + R * 0.1;
  body.add(neck);

  // arms
  for (const [i, sx] of [[0, -1], [1, 1]] as [number, number][]) {
    const upper = limb(armR, armLen, sleeve);
    upper.position.set(sx * H * 0.105, shoulderY, 0);
    upper.rotation.x = a[i];
    upper.rotation.z = sx * -0.14;
    body.add(upper);
    const lower = limb(armR * 0.9, armLen, sleeve);
    lower.position.y = -armLen;
    lower.rotation.x = a[2 + i];
    upper.add(lower);
    const hand = inked(new THREE.SphereGeometry(armR * 1.15, 10, 8), toon(skin, 3), INK_BODY);
    hand.scale.set(1, 1.25, 0.8);
    hand.position.y = -armLen - armR * 0.6;
    lower.add(hand);
  }

  // legs
  for (const [i, sx] of [[0, -1], [1, 1]] as [number, number][]) {
    const thigh = limb(legR, legLen, legs);
    thigh.position.set(sx * H * 0.055, hipY, 0);
    thigh.rotation.x = a[4 + i];
    body.add(thigh);
    const shin = limb(legR * 0.86, legLen, legs);
    shin.position.y = -legLen;
    shin.rotation.x = a[6 + i];
    thigh.add(shin);
    const shoe = inked(new THREE.BoxGeometry(legR * 2.1, legR * 0.95, legR * 3.1), toon(shoes, 3), INK_BODY);
    shoe.position.set(0, -legLen - legR * 0.45, legR * 0.85);
    shin.add(shoe);
  }

  // --- outer garment. This is a SILHOUETTE tool: a long coat makes a tall thin shape, a
  // lab coat makes a bright rectangle, a vest breaks a torso into two tones. Two characters
  // of the same height stay tellable apart in the dark because their outlines differ.
  const coat = L.coat ?? 'none';
  if (coat !== 'none') {
    const cc = L.coatColor ?? '#2b2932';
    if (coat === 'long' || coat === 'lab') {
      const drop = coat === 'long' ? 0.52 : 0.4;
      const skirt = inked(new THREE.CylinderGeometry(H * 0.105, H * 0.15, H * drop, 14, 1, true), toon(cc, 3), INK_BODY);
      skirt.position.y = hipY + torsoLen * 0.18 - H * drop * 0.5;
      body.add(skirt);
      const shoulders = inked(new THREE.CapsuleGeometry(H * 0.112, torsoLen * 0.6, 5, 12), toon(cc, 3), INK_BODY);
      shoulders.position.y = hipY + torsoLen * 0.56;
      shoulders.rotation.x = a[8];
      body.add(shoulders);
      // the open front, so it reads as a coat and not a dress
      const gap = new THREE.Mesh(new THREE.PlaneGeometry(H * 0.055, H * (drop + 0.2)), flat(top));
      gap.position.set(0, hipY + torsoLen * 0.2 - H * drop * 0.3, H * 0.108);
      body.add(gap);
      for (const sx of [-1, 1]) {
        const lapel = new THREE.Mesh(new THREE.PlaneGeometry(H * 0.05, H * 0.17), flat(cc));
        lapel.position.set(sx * H * 0.05, hipY + torsoLen * 0.72, H * 0.112);
        lapel.rotation.z = sx * 0.3;
        body.add(lapel);
      }
    }
    if (coat === 'jacket') {
      const j = inked(new THREE.CapsuleGeometry(H * 0.113, torsoLen * 0.62, 5, 12), toon(cc, 3), INK_BODY);
      j.position.y = hipY + torsoLen * 0.52;
      j.rotation.x = a[8];
      body.add(j);
      const zip = new THREE.Mesh(new THREE.PlaneGeometry(H * 0.012, torsoLen * 0.7), flat(INK));
      zip.position.set(0, hipY + torsoLen * 0.52, H * 0.115);
      body.add(zip);
    }
    if (coat === 'vest') {
      const v = inked(new THREE.CapsuleGeometry(H * 0.108, torsoLen * 0.42, 5, 12), toon(cc, 3), INK_BODY);
      v.position.y = hipY + torsoLen * 0.42;
      body.add(v);
    }
  }

  // blood: stains and smears on clothing only. Never an open wound, never a cut on screen.
  if (st.blood && st.blood !== 'none') {
    // Scale off the TORSO, not off total height, and keep every mark well under the chest
    // width. Sized off H these came out as bibs covering the whole shirt.
    const chest = H * 0.1;                       // torso radius
    const n = st.blood === 'smear' ? 9 : 6;
    for (let i = 0; i < n; i++) {
      const base = chest * (st.blood === 'smear' ? 0.3 : 0.17);
      const w = base * (0.45 + hash2(i, 3) * 1.0);
      const stain = new THREE.Mesh(new THREE.CircleGeometry(w, 10), flat(i % 3 ? PAL.blood : PAL.bloodDry, { opacity: 0.92 }));
      stain.scale.set(1, st.blood === 'smear' ? 1.5 : 1.15, 1);
      stain.position.set(
        (hash2(i, 5) - 0.5) * chest * 1.35,
        hipY + torsoLen * (0.3 + hash2(i, 7) * 0.55),
        H * 0.101,
      );
      body.add(stain);
    }
    if (st.blood === 'smear') {
      // one run down from the worst of it - a smear needs direction or it is just spots
      const run = new THREE.Mesh(new THREE.PlaneGeometry(chest * 0.12, torsoLen * 0.34), flat(PAL.bloodDry, { opacity: 0.8 }));
      run.position.set(-chest * 0.3, hipY + torsoLen * 0.38, H * 0.101);
      body.add(run);
    }
  }

  // --- spectral. A ghost is not a person with low opacity: it is COLD, it is lit from
  // inside, and it does not touch the floor. All three, or it reads as a rendering bug.
  if (L.spectral) {
    const tint = new THREE.Color(L.spectralTint ?? '#a8c8ff');
    body.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.Material | undefined;
      if (!m) return;
      const anyM = m as THREE.MeshToonMaterial;
      if (anyM.color) {
        // push every surface toward the tint instead of just fading it
        const c = anyM.color.clone().lerp(tint, 0.62);
        const clone = anyM.clone();
        clone.color = c;
        clone.transparent = true;
        clone.opacity = 0.62;
        clone.depthWrite = false;
        (o as THREE.Mesh).material = clone;
      }
    });
    const glow = new THREE.PointLight(tint, 1.4, H * 2.2, 2);
    glow.position.set(0, hipY + torsoLen * 0.5, 0);
    body.add(glow);
    // feet dissolve: it hovers a little, and the legs fade out rather than ending
    body.position.y += H * 0.07;
    const fade = new THREE.Mesh(new THREE.PlaneGeometry(H * 0.4, H * 0.3), flat('#000000', { opacity: 0 }));
    fade.position.y = H * 0.12;
    body.add(fade);
  }

  root.position.set(...(spec.at ?? [0, 0, 0]));
  root.rotation.y = ((spec.yaw ?? 0) * Math.PI) / 180;
  return root;
};

export const EXPRESSIONS: Expression[] = ['normal', 'scared', 'shocked', 'sad', 'angry', 'confused'];

export const POSE_NAMES = Object.keys(POSE) as PoseName[];
