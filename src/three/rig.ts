// Scroll Kaos v0.5 - first-person camera rig.
// EVERY narrative shot is the eyes of ONE protagonist. There is no third-person camera in
// the story body; only the epilogue roll (EndScreen stage C) is allowed wide drifting shots.
//
// A shot supplies an ANCHOR (where those eyes stand in the set and which way they face).
// A PRESET adds the organic motion on top. Anchor and preset are separate on purpose:
// the same set with a new anchor is a genuinely new picture, which is what the one-use law
// in quality-law.md section 6 is asking for.

import { fbm, snoise, clamp, ease, easeOut, lerp } from './noise';

export type RigPreset =
  | 'idle_breath'
  | 'walk_bob'
  | 'sprint_bob'
  | 'lookback_sprint'
  | 'whip_pan'
  | 'impact_jolt'
  | 'vertigo_tilt'
  | 'crouch_peek'
  | 'backseat_car'
  | 'drift_wide';     // epilogue only

/** Where the eyes are, before the preset moves them. */
export type Anchor = {
  pos: [number, number, number];
  /** yaw/pitch in degrees. yaw 0 looks down -Z. */
  yaw: number;
  pitch?: number;
  /** eye height override; defaults to pos[1] */
  fov?: number;
};

export type CamState = { pos: [number, number, number]; rot: [number, number, number]; fov: number };

const D2R = Math.PI / 180;

/** Base field of view per preset. Chases and drops widen for speed and vertigo. */
export const baseFov = (p: RigPreset): number => {
  switch (p) {
    case 'sprint_bob':
    case 'lookback_sprint': return 92;
    case 'vertigo_tilt': return 95;
    case 'impact_jolt': return 88;
    case 'crouch_peek': return 78;
    case 'backseat_car': return 76;
    case 'drift_wide': return 60;
    default: return 80;
  }
};

/**
 * The rig. `t` is seconds into the shot; `dur` is the shot length in seconds.
 * `seed` must differ per shot so two shots with the same preset never wobble alike.
 *
 * NOTE: there is always breath. Even a "held" shot keeps `idle_breath` under it, so the
 * finished video never contains a truly frozen frame. The reference video does freeze for
 * ~3 s stretches around 5:00 and that reads as a bug, not as tension.
 */
export const rigAt = (preset: RigPreset, t: number, dur: number, seed: number, a: Anchor): CamState => {
  const p = dur > 0 ? clamp(t / dur, 0, 1) : 0;
  let [x, y, z] = a.pos;
  let yaw = a.yaw, pitch = a.pitch ?? 0, roll = 0;
  let fov = a.fov ?? baseFov(preset);

  // --- breath floor: applies to every preset, always ---
  const br = fbm(t * 0.9 + seed * 3.1, seed, 2);
  y += br * 0.012;
  yaw += fbm(t * 0.7 + seed, seed + 5, 2) * 0.5;
  pitch += br * 0.45;

  switch (preset) {
    case 'idle_breath': {
      x += fbm(t * 0.55 + seed * 2, seed + 11, 2) * 0.015;
      break;
    }
    case 'walk_bob': {
      // 1.9 steps/s. Vertical bob at 2x step rate, lateral sway at 1x - that is what a
      // real head does and it is what sells walking without animating legs.
      const s = t * 1.9 * Math.PI * 2;
      y += Math.abs(Math.sin(s)) * 0.045 - 0.022;
      x += Math.sin(s * 0.5) * 0.035;
      roll += Math.sin(s * 0.5) * 1.3;
      z -= t * 1.35;                       // forward travel, metres
      break;
    }
    case 'sprint_bob': {
      const s = t * 3.1 * Math.PI * 2;
      y += Math.abs(Math.sin(s)) * 0.085 - 0.04;
      x += Math.sin(s * 0.5) * 0.07;
      roll += Math.sin(s * 0.5) * 3.4;
      pitch += Math.sin(s) * 1.6;
      z -= t * 3.6;
      fov += 4 * ease(t / 0.6);
      break;
    }
    case 'lookback_sprint': {
      const s = t * 3.1 * Math.PI * 2;
      y += Math.abs(Math.sin(s)) * 0.08 - 0.04;
      roll += Math.sin(s * 0.5) * 3.0;
      z -= t * 3.2;
      // snap the head round over the shoulder in the middle third, then snap back
      const w = p < 0.3 ? 0 : p < 0.45 ? easeOut((p - 0.3) / 0.15) : p < 0.7 ? 1 : 1 - easeOut((p - 0.7) / 0.3);
      yaw += 152 * w;
      roll += 7 * w;
      break;
    }
    case 'whip_pan': {
      // a bang off-screen: the head snaps to it, overshoots, settles
      const w = easeOut(clamp(p / 0.22, 0, 1));
      const over = Math.exp(-(p - 0.22) * 14) * Math.sin((p - 0.22) * 46) * (p > 0.22 ? 1 : 0);
      yaw += 68 * w + 9 * over;
      roll += 4 * w + 3 * over;
      break;
    }
    case 'impact_jolt': {
      // shoved / slammed / crashed. Hard shake that decays inside 0.8 s + a Dutch roll.
      const d = Math.exp(-t * 4.2);
      x += snoise(t * 42, seed) * 0.11 * d;
      y += snoise(t * 47, seed + 3) * 0.11 * d;
      yaw += snoise(t * 39, seed + 7) * 7.5 * d;
      pitch += snoise(t * 44, seed + 9) * 6.5 * d;
      roll += (8 + snoise(t * 23, seed + 13) * 5) * d;
      fov += 6 * d;
      break;
    }
    case 'vertigo_tilt': {
      // looking down past your own arms at streets a long way below
      pitch -= lerp(22, 62, ease(p));
      roll += Math.sin(t * 1.3) * 3.2;
      fov = lerp(fov, fov + 12, ease(p));      // dolly-zoom feel
      y += Math.sin(t * 0.8) * 0.03;
      break;
    }
    case 'crouch_peek': {
      y = Math.min(y, 0.42);                    // under a bed / round a corner
      const w = ease(p);
      x += lerp(0, 0.28, w);
      yaw += lerp(0, 16, w);
      pitch += 4;
      break;
    }
    case 'backseat_car': {
      // locked between two headrests. Engine idle + road judder, never a free camera.
      y += Math.sin(t * 17.5) * 0.006 + fbm(t * 6, seed + 21, 2) * 0.008;
      x += fbm(t * 4.4, seed + 31, 2) * 0.012;
      roll += fbm(t * 3.1, seed + 41, 2) * 0.9;
      pitch += Math.sin(t * 2.2) * 0.6;
      break;
    }
    case 'drift_wide': {
      // EPILOGUE ONLY. Slow truck across the aftermath.
      x += lerp(-0.9, 0.9, ease(p));
      y += 0.06 * ease(p);
      yaw += lerp(-3, 3, ease(p));
      break;
    }
  }

  return { pos: [x, y, z], rot: [pitch * D2R, yaw * D2R, roll * D2R], fov };
};

/** Presets that are legal inside the story body (first-person law). */
export const STORY_PRESETS: RigPreset[] = [
  'idle_breath', 'walk_bob', 'sprint_bob', 'lookback_sprint',
  'whip_pan', 'impact_jolt', 'vertigo_tilt', 'crouch_peek', 'backseat_car',
];

export const isStoryPreset = (p: RigPreset) => STORY_PRESETS.indexOf(p) >= 0;
