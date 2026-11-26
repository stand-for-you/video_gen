// Scroll Kaos v0.5 - the protagonist's own hands.
//
// These are parented to the CAMERA, not to the world, so they enter from the bottom of the
// lens and stay there however the rig moves. They are the single strongest signal that the
// viewer IS the protagonist - the reference shows them in roughly a third of all shots.
//
// Style note from the reference frames: the hand is a simple flat cartoon shape with a thick
// ink line and NO interior shading. Do not add knuckle detail; it reads as a glove.

import * as THREE from 'three';
import { PAL, INK } from '../three/palette';
import { toon, inked, box } from '../three/toon';

export type HandPose =
  | 'balance_wide'   // both arms out to the sides on a beam or a ledge
  | 'reach_grab'     // one arm lunging forward: a friend's hand, a knob, a headrest
  | 'brace_door'     // both palms flat on a door that is coming apart
  | 'push_punch'     // a fast jab, shove, or a swung chair
  | 'knock_open'     // knuckles to a door, or pushing it open
  | 'hold_phone'     // a lit phone screen in the lower corner
  | 'brace_fall'     // both hands thrown up while falling or being knocked back
  | 'grip_rail';     // both hands closed on a rail, a beam, a headrest

export type HandsSpec = {
  pose: HandPose;
  skin?: string;
  sleeve?: string;
  /** 0-1 along the action. Lets a shot catch a reach mid-lunge instead of at full stretch. */
  phase?: number;
  /** phone screen colour when pose is hold_phone */
  screen?: string;
};

/** One hand: palm, four fingers, a thumb, and a sleeve cuff. Flat, inked, no shading. */
const oneHand = (skin: string, sleeve: string, spread: number, curl: number): THREE.Group => {
  const g = new THREE.Group();
  const ink = 4.5;
  const palm = inked(new THREE.BoxGeometry(0.125, 0.15, 0.045), toon(skin, 2), ink);
  g.add(palm);
  const len = [0.082, 0.095, 0.09, 0.072];
  for (let i = 0; i < 4; i++) {
    const fl = len[i] * (1 - curl * 0.55);
    const fing = inked(new THREE.CapsuleGeometry(0.0155, fl, 3, 6), toon(skin, 2), ink * 0.8);
    const x = -0.045 + i * 0.03;
    fing.position.set(x + spread * x * 0.9, 0.076 + fl / 2, curl * 0.03);
    fing.rotation.x = curl * 1.15;
    fing.rotation.z = -spread * x * 3.2;
    g.add(fing);
  }
  const th = inked(new THREE.CapsuleGeometry(0.019, 0.066, 3, 6), toon(skin, 2), ink * 0.8);
  th.position.set(-0.072, 0.016, 0.02);
  th.rotation.set(0.3, 0, 1.05 - spread * 0.35);
  g.add(th);
  const cuff = inked(new THREE.CylinderGeometry(0.066, 0.058, 0.09, 10), toon(sleeve, 3), ink);
  cuff.position.set(0, -0.122, -0.005);
  g.add(cuff);
  // Keep the forearm SHORT. The reference shows hand and cuff; a long sleeve tube takes over
  // the bottom of the frame and the shot stops being about what the hand is doing.
  const fore = inked(new THREE.CapsuleGeometry(0.052, 0.17, 4, 8), toon(sleeve, 3), ink);
  fore.position.set(0, -0.255, -0.016);
  g.add(fore);
  return g;
};

/**
 * Build the hand rig. Add the returned Group to the CAMERA.
 * Local space: -Z is forward, +Y up. The camera's near plane is 0.05, so nothing may sit
 * closer than about 0.12 or it clips through.
 */
export const buildHands = (spec: HandsSpec): THREE.Group => {
  const skin = spec.skin ?? PAL.skinA;
  const sleeve = spec.sleeve ?? '#5a5f78';
  const p = Math.min(1, Math.max(0, spec.phase ?? 1));
  const root = new THREE.Group();

  const place = (
    h: THREE.Group, pos: [number, number, number], rot: [number, number, number],
  ) => { h.position.set(...pos); h.rotation.set(...rot); root.add(h); };

  switch (spec.pose) {
    case 'balance_wide': {
      const L = oneHand(skin, sleeve, 1, 0.05);
      const R = oneHand(skin, sleeve, 1, 0.05);
      const out = 0.34 + 0.12 * p;
      // palms down, fingers pointing OUT to the sides - an edge-on hand reads as a blob
      place(L, [-out, -0.26, -0.32], [-1.25, 0.2, 1.05]);
      place(R, [out, -0.26, -0.32], [-1.25, -0.2, -1.05]);
      break;
    }
    case 'reach_grab': {
      const R = oneHand(skin, sleeve, 0.7, 0.15);
      place(R, [0.1 - 0.04 * p, -0.26 + 0.14 * p, -0.36 - 0.26 * p], [-0.5 - 0.3 * p, -0.2, -0.3]);
      break;
    }
    case 'brace_door': {
      const L = oneHand(skin, sleeve, 0.9, 0.0);
      const R = oneHand(skin, sleeve, 0.9, 0.0);
      const d = -0.42 - 0.08 * p;
      place(L, [-0.17, -0.12, d], [-1.45, 0, 0.25]);
      place(R, [0.17, -0.12, d], [-1.45, 0, -0.25]);
      break;
    }
    case 'push_punch': {
      const R = oneHand(skin, sleeve, 0.0, 0.95);
      place(R, [0.08, -0.2, -0.3 - 0.4 * p], [-0.25, 0, -0.1]);
      break;
    }
    case 'knock_open': {
      const R = oneHand(skin, sleeve, 0.15, 0.85);
      place(R, [0.13, -0.17, -0.4 - 0.1 * p], [-0.3, -0.25, -0.5]);
      break;
    }
    case 'hold_phone': {
      const L = oneHand(skin, sleeve, 0.25, 0.65);
      place(L, [-0.21, -0.33, -0.36], [-0.55, 0.3, 0.45]);
      const phone = box(0.085, 0.165, 0.011, '#1a1920', 3.5, 2);
      phone.position.set(-0.19, -0.26, -0.37);
      phone.rotation.set(-0.5, 0.3, 0.42);
      root.add(phone);
      const screen = new THREE.Mesh(
        new THREE.PlaneGeometry(0.07, 0.145),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(spec.screen ?? '#cfe6ff') }),
      );
      screen.position.set(-0.186, -0.258, -0.364);
      screen.rotation.set(-0.5, 0.3, 0.42);
      root.add(screen);
      const spill = new THREE.PointLight(new THREE.Color(spec.screen ?? '#cfe6ff'), 0.9, 1.4, 2);
      spill.position.set(-0.19, -0.2, -0.36);
      root.add(spill);
      break;
    }
    case 'brace_fall': {
      const L = oneHand(skin, sleeve, 1, 0.1);
      const R = oneHand(skin, sleeve, 1, 0.1);
      place(L, [-0.26, -0.02 + 0.1 * p, -0.3], [-1.1, 0.4, 0.8]);
      place(R, [0.26, -0.02 + 0.1 * p, -0.3], [-1.1, -0.4, -0.8]);
      break;
    }
    case 'grip_rail': {
      const L = oneHand(skin, sleeve, 0.0, 1.0);
      const R = oneHand(skin, sleeve, 0.0, 1.0);
      place(L, [-0.2, -0.3, -0.33], [-0.9, 0.15, 0.2]);
      place(R, [0.2, -0.3, -0.33], [-0.9, -0.15, -0.2]);
      break;
    }
  }
  return root;
};

export const HAND_POSES: HandPose[] = [
  'balance_wide', 'reach_grab', 'brace_door', 'push_punch',
  'knock_open', 'hold_phone', 'brace_fall', 'grip_rail',
];
