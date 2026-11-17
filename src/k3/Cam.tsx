import React from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { ss, lerp, sway, noise1, V3 } from './core';
// ===== 3D CAMERA LAW (engine v0.5, fixed file)
// 1. The camera is NEVER frozen. Every shot has a move (default 'push'), plus a continuous breathing sway (hand-held float).
// 2. Every move is eased with smoothstep. The progress runs over the shot PLUS a small margin, so the speed is never zero at a cut
//    (the move flows from one shot into the next) and never linear.
// 3. Moves: push (dolly in), pull (dolly out), orbit (around the subject), arc (orbit + push), crane (rise), drop (lower),
//    truck (slide sideways), tilt (look from low to high), pan (turn the view), vertigo (push in while the zoom widens: reveal),
//    follow (keep the target l -> l2 in frame), dolly (explicit p -> p2, l -> l2), hold (only breathing + a tiny push).
// 4. shake = smooth noise shake for scary hits (never random jitter). roll = slow dutch angle in degrees.
export type Move = 'push' | 'pull' | 'orbit' | 'arc' | 'crane' | 'drop' | 'truck' | 'tilt' | 'pan' | 'vertigo' | 'follow' | 'dolly' | 'hold';
export type CamSpec = { p: V3; l: V3; fov?: number; move?: Move; amt?: number; dir?: number; p2?: V3; l2?: V3; shake?: number; roll?: number; breath?: number };
export type CamState = { pos: V3; look: V3; fov: number; roll: number };
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k];
const L3 = (a: V3, b: V3, t: number): V3 => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
const len3 = (a: V3) => Math.hypot(a[0], a[1], a[2]);
export const camAt = (c: CamSpec, t: number, len: number): CamState => {
  const p = ss((t + 0.35) / (len + 0.7));
  const m = c.move || 'push'; const dir = c.dir ?? 1;
  let pos: V3 = [...c.p] as V3, look: V3 = [...c.l] as V3, fov = c.fov ?? 38;
  const d = sub(pos, look), dist = len3(d);
  const amt = c.amt;
  const orbit = (a: number, k = 1): V3 => { const r = Math.hypot(d[0], d[2]) * k; const a0 = Math.atan2(d[0], d[2]) + a; return [look[0] + Math.sin(a0) * r, pos[1], look[2] + Math.cos(a0) * r]; };
  switch (m) {
    case 'push': pos = add(look, mul(d, 1 - (amt ?? 0.22) * p)); break;
    case 'pull': pos = add(look, mul(d, 1 - (amt ?? 0.22) * (1 - p))); break;
    case 'orbit': pos = orbit(dir * (amt ?? 0.38) * (p - 0.5)); break;
    case 'arc': pos = orbit(dir * (amt ?? 0.32) * (p - 0.5), 1 - 0.16 * p); pos[1] = lerp(c.p[1], look[1] + (c.p[1] - look[1]) * 0.85, p); break;
    case 'crane': pos = [pos[0], pos[1] + (amt ?? 1.2) * (p - 0.35), pos[2]]; break;
    case 'drop': pos = [pos[0], pos[1] - (amt ?? 1.0) * (p - 0.35), pos[2]]; break;
    case 'truck': { const side: V3 = [d[2] / dist, 0, -d[0] / dist]; const k = dir * (amt ?? 1.4) * (p - 0.5); pos = add(pos, mul(side, k)); look = add(look, mul(side, k * 0.85)); break; }
    case 'tilt': look = [look[0], look[1] + (amt ?? 1.2) * (p - 0.6), look[2]]; break;
    case 'pan': { const side: V3 = [d[2] / dist, 0, -d[0] / dist]; look = add(look, mul(side, dir * (amt ?? 1.6) * (p - 0.5))); break; }
    case 'vertigo': { const k = 1 - (amt ?? 0.35) * p; pos = add(look, mul(d, k)); const f0 = c.fov ?? 38; fov = (2 * Math.atan(Math.tan((f0 * Math.PI) / 360) / k) * 180) / Math.PI; break; }
    case 'follow': look = L3(c.l, c.l2 || c.l, p); pos = add(look, d); if (c.p2) pos = L3(c.p, c.p2, p); break;
    case 'dolly': pos = L3(c.p, c.p2 || c.p, p); look = L3(c.l, c.l2 || c.l, p); break;
    case 'hold': pos = add(look, mul(d, 1 - 0.05 * p)); break;
  }
  // breathing sway: never frozen. Scales with distance so close-ups float gently and wide shots still drift.
  const b = (c.breath ?? 1) * Math.min(0.09, 0.012 + dist * 0.004);
  pos = add(pos, [sway(t, 5.3, b, 1.1), sway(t, 4.2, b * 0.7, 2.3), sway(t, 6.6, b * 0.6, 3.7)]);
  look = add(look, [sway(t, 6.1, b * 0.35, 4.2), sway(t, 5.0, b * 0.3, 5.9), 0]);
  if (c.shake) { const s = c.shake * 0.05; pos = add(pos, [noise1(t * 9, 11) * s, noise1(t * 9, 12) * s, 0]); look = add(look, [noise1(t * 9, 13) * s * 0.6, noise1(t * 9, 14) * s * 0.6, 0]); }
  const roll = (c.roll ?? 0) + sway(t, 7.3, 0.25, 6.1);
  return { pos, look, fov, roll };
};
// vertical (9:16) version of a 16:9 camera when a set gives no camR: same look point, wider vertical field, slightly further back.
export const toVertical = (c: CamSpec): CamSpec => {
  const f = c.fov ?? 38; const fr = (2 * Math.atan(Math.tan((f * Math.PI) / 360) * 1.55) * 180) / Math.PI;
  const d = sub(c.p, c.l); const k = 1.08;
  return { ...c, fov: Math.min(80, fr), p: add(c.l, mul(d, k)), p2: c.p2 ? add(c.l2 || c.l, mul(sub(c.p2, c.l2 || c.l), k)) : undefined };
};
const tmp = new THREE.PerspectiveCamera();
export const applyCam = (cam: THREE.PerspectiveCamera, s: CamState, aspect: number) => {
  cam.position.set(s.pos[0], s.pos[1], s.pos[2]); cam.up.set(0, 1, 0); cam.lookAt(s.look[0], s.look[1], s.look[2]);
  cam.rotateZ((s.roll * Math.PI) / 180); cam.fov = s.fov; cam.aspect = aspect; cam.near = 0.05; cam.far = 400; cam.updateProjectionMatrix(); cam.updateMatrixWorld(true);
};
// world point -> screen pixel (for tags and labels drawn over the 3D picture)
export const project = (s: CamState, W: number, H: number, pt: V3): [number, number, boolean] => {
  applyCam(tmp, s, W / H); const v = new THREE.Vector3(pt[0], pt[1], pt[2]).project(tmp);
  return [(v.x * 0.5 + 0.5) * W, (-v.y * 0.5 + 0.5) * H, v.z < 1];
};
export const CamRig: React.FC<{ s: CamState; W: number; H: number }> = ({ s, W, H }) => {
  const cam = useThree((x) => x.camera) as THREE.PerspectiveCamera;
  applyCam(cam, s, W / H);
  return null;
};
