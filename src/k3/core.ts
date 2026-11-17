import * as THREE from 'three';
import ENG from '../../engine.json';
// ===== SCROLL KAOS 3D CORE (engine v0.5). Fixed engine file: do not change per story.
// TIME: every 3D part works in SECONDS (t), never in frames, so motion is the same at any frame rate (60 fps native).
// EASING LAW: every camera move, dolly, pan, zoom, tilt and every pose change uses smoothstep (ss) or smootherstep (ss2).
// Never linear movement. Secondary motion (breathing, sway, flicker) uses smooth sines and smooth value noise only.
export const FPS: number = (ENG as any).fps || 60;
export const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const ss = (x: number) => { const c = clamp(x); return c * c * (3 - 2 * c); };
export const ss2 = (x: number) => { const c = clamp(x); return c * c * c * (c * (c * 6 - 15) + 10); };
// progress from second a to second b with smoothstep
export const seg = (t: number, a: number, b: number) => ss((t - a) / Math.max(0.0001, b - a));
// slow organic sway (sum of two sines)
export const sway = (t: number, period = 4, amp = 1, seed = 0) => amp * (0.7 * Math.sin((t * Math.PI * 2) / period + seed) + 0.3 * Math.sin((t * Math.PI * 2) / (period * 0.37) + seed * 2.1));
export const rng = (seed: number) => { let s = (Math.floor(seed * 9301 + 49297) % 233280 + 233280) % 233280 || 1; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; };
// smooth value noise in [-1, 1]
export const noise1 = (x: number, seed = 1) => { const i = Math.floor(x), f = x - i; const h = (n: number) => rng(n * 7919 + seed * 104729)() * 2 - 1; const s = f * f * (3 - 2 * f); return h(i) * (1 - s) + h(i + 1) * s; };
// fire / candle flicker 0..1, smooth (no jumps)
export const flick = (t: number, seed = 1, depth = 0.3) => 1 - depth * (0.5 + 0.5 * noise1(t * 7, seed)) * (0.6 + 0.4 * (0.5 + 0.5 * noise1(t * 17, seed + 3)));
export const deg = Math.PI / 180;
export type V3 = [number, number, number];

// ===== MATERIAL LAW: every model = MeshStandardMaterial with flatShading: true (low-poly faceted look). Cached by key.
const MC = new Map<string, THREE.Material>();
export type MatOpt = { e?: string; ei?: number; r?: number; m?: number; op?: number; side?: 'double'; fog?: boolean };
const q50 = (x: number) => Math.round(Math.max(0, Math.min(1, x)) * 50) / 50; // opacity in 2 % steps: small material cache, invisible steps
export const M = (color: string, o: MatOpt = {}): THREE.MeshStandardMaterial => {
  if (o.op != null) o = { ...o, op: q50(o.op) };
  const k = color + JSON.stringify(o);
  let m = MC.get(k) as THREE.MeshStandardMaterial;
  if (!m) {
    m = new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: o.r ?? 0.92, metalness: o.m ?? 0, emissive: o.e || '#000000', emissiveIntensity: o.ei ?? 1, transparent: o.op != null && o.op < 1, opacity: o.op ?? 1, side: o.side ? THREE.DoubleSide : THREE.FrontSide, fog: o.fog ?? true });
    MC.set(k, m);
  }
  return m;
};
// unlit glow (flames, lit window panes, moon disc). Still part of the flat look.
const BC = new Map<string, THREE.Material>();
export const G = (color: string, op = 1, fog = true): THREE.MeshBasicMaterial => {
  op = q50(op); const k = color + op + fog; let m = BC.get(k) as THREE.MeshBasicMaterial;
  if (!m) { m = new THREE.MeshBasicMaterial({ color, transparent: op < 1, opacity: op, fog, depthWrite: op >= 1 }); BC.set(k, m); }
  return m;
};
// ===== PALETTE (night horror, from The Melancholy of Herbert Solomon): cool blue moonlight, warm orange windows, ONE red accent.
export const PAL = {
  sky: '#101c30', fog: '#16283e', fogWarm: '#1a1612', moon: '#a9c0ff', moonDisc: '#e8eefc', amb: '#4a5c80', ground: '#1c2620', snow: '#9aa6b4',
  grass: '#35492f', grassTip: '#4a6140', pine: '#24402f', pineDark: '#1a3024', bark: '#3a2a1c', stone: '#5c5e58', stoneDark: '#3e403c',
  cob: '#4e4e48', thatch: '#6e5c3a', wood: '#4c3a28', woodDark: '#2e2218', plank: '#5a4430', win: '#ffb056', winGlow: '#ff9a40',
  fire: '#ff8a2a', fireCore: '#ffd27a', ember: '#ff5a1a', red: '#b3221f', blood: '#5a0a0c', ink: '#0b0713', cloth: '#8c8a80', paper: '#d8ccb0',
};
