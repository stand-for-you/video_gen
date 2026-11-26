// Scroll Kaos v0.5 - the shot record. This is the ONLY contract between the Python side
// (tools/build_shots.py) and the React side (Scene.tsx). If you add a field, add it in both
// places and in the signature below, or the one-use law stops seeing the difference.

import type { KitName } from './kits';
import type { Anchor, RigPreset } from './three/rig';
import type { HandPose } from './cast/FPSHands';
import type { ActorSpec } from './cast/Cast3D';

export type Framing = 'full' | 'waist' | 'face';

export type SfxPop = {
  /** the word, with its stars: "*CRACK*" */
  t: string;
  /** frame inside the shot when it pops */
  at: number;
  /** screen position 0-1 - put it ON the thing that made the noise */
  x: number;
  y: number;
  /** small for a creak, big for a car roof coming off */
  size?: number;
};

export type Shot = {
  /** stable id, e.g. "p2_14". Used by the ledger and by every error message. */
  id: string;
  /** start / end frame in the composition */
  s: number;
  e: number;

  // --- what we are looking at ---
  kit: KitName;
  /** kit options INCLUDING prop state. A state change is what makes a revisit legal. */
  kitOpts: Record<string, unknown>;

  // --- where the eyes are ---
  anchor: Anchor;
  preset: RigPreset;

  // --- who is in it ---
  /** the protagonist's own hands, entering from the bottom of the lens */
  hands?: HandPose | null;
  actors: ActorSpec[];

  // --- how it is cut and graded ---
  framing: Framing;
  /** 0-1. Red/cyan VHS bars for a creature scare. */
  glitch?: number;
  wash?: string;
  washAmount?: number;
  boil?: number;
  sfx?: SfxPop[];

  /** filled by tools/build_shots.py - see shotSignature() */
  sig?: string;
};

export type Chapter = { s: number; n: number; title: string };

export type ShotFile = {
  fps: 30;
  w: number;
  h: number;
  frames: number;
  shots: Shot[];
  chapters: Chapter[];
  /** part boundaries for the choice cards and the recap */
  parts: { n: number; s: number; e: number; question: string; chosen: string; chosenEmoji: string; chosenSub: string; other: string; otherEmoji: string; otherSub: string }[];
};

/**
 * THE ONE-USE SIGNATURE.
 *
 * Two shots are "the same picture" when a viewer could not tell them apart. The channel
 * rule (quality-law.md section 6) says at least TWO of {camera position, who is in shot and
 * where, the light, a prop's state} must differ. This function turns a shot into the four
 * coarse buckets that rule talks about, and gate_shots.py refuses a build where two shots
 * agree on three or more of them.
 *
 * Coarse on purpose: moving the camera 4 cm is not a new picture, so positions are rounded
 * to 0.75 m and angles to 15 degrees.
 */
export const shotBuckets = (sh: Shot): { cam: string; cast: string; light: string; props: string } => {
  const q = (v: number, step: number) => Math.round(v / step) * step;
  const a = sh.anchor;
  const cam = [
    sh.kit,
    q(a.pos[0], 0.75), q(a.pos[1], 0.75), q(a.pos[2], 0.75),
    q(((a.yaw % 360) + 360) % 360, 15),
    q(a.pitch ?? 0, 15),
    sh.preset,
  ].join('/');

  const cast = [
    sh.hands ?? '-',
    ...[...sh.actors]
      .map((x) => `${x.id}:${x.pose ?? '-'}:${q(x.at?.[0] ?? 0, 0.75)},${q(x.at?.[2] ?? 0, 0.75)}`)
      .sort(),
  ].join('|');

  const o = sh.kitOpts as Record<string, unknown>;
  const light = [o.lightOn ?? '-', o.lampSide ?? '-', o.alleyLamps ?? '-', o.headlights ?? '-', sh.wash ?? '-'].join('/');
  const props = [
    o.door ?? '-', o.windshield ?? '-', o.roof ?? '-', o.ground ?? '-', o.beam ?? '-',
    o.room ?? '-', o.shape ?? '-', o.clock ?? '-', o.window ?? '-',
  ].join('/');

  return { cam, cast, light, props };
};

export const shotSignature = (sh: Shot): string => {
  const b = shotBuckets(sh);
  return `${b.cam}~${b.cast}~${b.light}~${b.props}`;
};
