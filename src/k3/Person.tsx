import React from 'react';
import { M, G, PAL, rng, sway, noise1, ss, clamp, lerp, V3 } from './core';
import { Torch, Lantern, Candle } from './Fx';
import { Doll } from './Interior';
// ===== THE 3D PERMANENT CAST BUILDER (engine v0.5). Low-poly, flat shaded (MeshStandardMaterial flatShading) people with a full rig.
// One builder for every human. A cast member = one P3 spec (src/Cast3D.ts). Face, hair, body and height of a cast member never change;
// clothes may change only for a story note. Human proportions: adult about 7 heads tall, child bigger head and shorter legs.
// Facing: a person faces +z at rot 0. Their LEFT side is +x.
// SECONDARY MOTION LAW: every person always breathes (chest), blinks, shifts weight and moves the head a little, even in 'idle'.
export type P3 = {
  id: string; name: string; sex: 'm' | 'f'; age: 0 | 1 | 2 | 3; kid?: boolean; h?: number; build?: number;
  skin: string; hair: string; hairStyle: 'messy' | 'long' | 'short' | 'slick' | 'bun' | 'pigtails' | 'wavy' | 'greyshort' | 'bald' | 'cap' | 'hood';
  eyeC?: string; lip?: string; brow?: number; jaw?: 'square' | 'soft' | 'round' | 'long' | 'narrow'; nose?: 'broad' | 'straight' | 'button' | 'hook' | 'small';
  stache?: boolean; beard?: boolean; stubble?: boolean; freckles?: boolean; glasses?: boolean;
  ghost?: 'woman' | 'grin' | 'child' | null; // GHOST LAW: pale blue-white skin, huge hollow black eyes, dark tear tracks, bare feet. 'grin' also shows a wide tooth grin.
  top: 'shirt' | 'workshirt' | 'cardigan' | 'jacket' | 'coat' | 'raincoat' | 'hoodie' | 'shift' | 'dress' | 'uniform'; topC: string; inner?: string;
  bottom: 'trousers' | 'jeans' | 'skirtLong' | 'dressKnee' | 'none'; botC: string; shoeC?: string;
  acc?: ('redRibbons' | 'shawl' | 'redScarf' | 'redThread' | 'satchel' | 'cane' | 'hat' | 'apron' | 'collar' | 'badge')[]; accC?: string;
};
export type Expr = 'calm' | 'fear' | 'scream' | 'sad' | 'angry' | 'shock' | 'smile' | 'sleepy' | 'pain' | 'determined';
export type Pose = 'idle' | 'walk' | 'run' | 'point' | 'cover' | 'recoil' | 'kneel' | 'sit' | 'reach' | 'crouch' | 'lie' | 'scream' | 'raise' | 'hold' | 'cower' | 'look' | 'hug' | 'pray' | 'fall' | 'carry' | 'cheer' | 'faint' | 'sleep';
export type Hold = 'torch' | 'lantern' | 'candle' | 'pitchfork' | 'axe' | 'sword' | 'book' | 'doll' | 'vial' | 'string' | 'none';
// rig: angles in radians. fwd = forward swing (positive = toward the face side), out = away from the body, bend = elbow/knee bend.
export type Rig = {
  x: number; y: number; z: number; ry: number; rx: number; rz: number;
  spX: number; spY: number; spZ: number; breath: number;
  hdX: number; hdY: number; hdZ: number;
  shLf: number; shLo: number; elL: number; shRf: number; shRo: number; elR: number; shLt: number; shRt: number;
  hpLf: number; hpLo: number; knL: number; hpRf: number; hpRo: number; knR: number; ftL: number; ftR: number;
  hand: number; jaw: number;
};
const Z: Rig = { x: 0, y: 0, z: 0, ry: 0, rx: 0, rz: 0, spX: 0, spY: 0, spZ: 0, breath: 0, hdX: 0, hdY: 0, hdZ: 0, shLf: 0, shLo: 0.06, elL: 0.12, shRf: 0, shRo: 0.06, elR: 0.12, shLt: 0, shRt: 0, hpLf: 0, hpLo: 0.02, knL: 0.04, hpRf: 0, hpRo: 0.02, knR: 0.04, ftL: 0, ftR: 0, hand: 0.3, jaw: 0 };
export const blendRig = (a: Rig, b: Rig, k: number): Rig => { const o: any = {}; for (const key in a) o[key] = lerp((a as any)[key], (b as any)[key], k); return o; };
// ---- poses. t = seconds. p = pose progress options. Every pose includes breathing and small life motion.
export const poseRig = (pose: Pose, t: number, o: { speed?: number; seed?: number; travel?: boolean; legH?: number; tremble?: number; side?: number } = {}): Rig => {
  const sd = o.seed ?? 1; const r: Rig = { ...Z };
  const br = Math.sin((t * Math.PI * 2) / 4.2 + sd); r.breath = br;
  r.hdY = sway(t, 7.1, 0.07, sd); r.hdX = sway(t, 5.3, 0.03, sd + 1); r.hdZ = sway(t, 6.2, 0.025, sd + 2);
  r.x = sway(t, 6.5, 0.012, sd + 3); r.spZ = sway(t, 6.5, 0.012, sd + 3); r.shLf = sway(t, 4.6, 0.03, sd + 4); r.shRf = sway(t, 4.9, 0.03, sd + 5);
  const legH = o.legH ?? 0.85; const side = o.side ?? 1;
  switch (pose) {
    case 'walk': case 'run': case 'carry': {
      const run = pose === 'run'; const f = (run ? 1.45 : 0.92) * (o.speed ?? 1); const ph = t * f * Math.PI * 2 + sd; const A = run ? 0.7 : 0.42;
      r.hpLf = A * Math.sin(ph); r.hpRf = -A * Math.sin(ph);
      r.knL = 0.08 + (run ? 1.1 : 0.62) * Math.max(0, -Math.sin(ph - 0.9)); r.knR = 0.08 + (run ? 1.1 : 0.62) * Math.max(0, Math.sin(ph - 0.9));
      r.ftL = 0.2 * Math.max(0, Math.sin(ph)); r.ftR = 0.2 * Math.max(0, -Math.sin(ph));
      if (pose !== 'carry') { r.shLf = -A * 0.8 * Math.sin(ph); r.shRf = A * 0.8 * Math.sin(ph); r.elL = run ? 1.3 : 0.3 + 0.15 * Math.max(0, Math.sin(ph)); r.elR = run ? 1.3 : 0.3 + 0.15 * Math.max(0, -Math.sin(ph)); }
      r.y = (run ? 0.05 : 0.025) * Math.abs(Math.cos(ph)) - (run ? 0.03 : 0.01); r.spX = run ? 0.28 : 0.06; r.spY = 0.06 * Math.sin(ph);
      if (o.travel !== false) r.z = (run ? 3.4 : 1.25) * (o.speed ?? 1) * t;
      break;
    }
    case 'point': r.shRf = 1.45; r.shRo = 0.15; r.elR = 0.08; r.hand = 0.1; r.hdY = -0.15 + r.hdY * 0.5; r.spY = -0.12; break;
    case 'reach': r.shRf = 1.25 + 0.05 * Math.sin(t * 2); r.elR = 0.25; r.shLf = 0.9; r.elL = 0.4; r.spX = 0.18; r.hand = 0; r.hdX = -0.05; break;
    case 'cover': r.shLf = 1.0; r.shLo = 0.4; r.elL = 2.15; r.shRf = 1.0; r.shRo = 0.4; r.elR = 2.15; r.hdX = 0.25; r.spX = 0.18; r.knL = r.knR = 0.18; r.hpLf = r.hpRf = 0.1; break;
    case 'cower': r.shLf = 1.2; r.shLo = 0.5; r.elL = 1.9; r.shRf = 1.2; r.shRo = 0.5; r.elR = 1.9; r.hdX = 0.35; r.spX = 0.45; r.knL = r.knR = 1.1; r.hpLf = r.hpRf = 0.8; r.y = -0.26 * legH; break;
    case 'recoil': r.shLf = 0.9; r.shLo = 0.5; r.elL = 1.4; r.shRf = 1.1; r.shRo = 0.4; r.elR = 1.2; r.spX = -0.22; r.hdX = -0.15; r.hpLf = -0.2; r.knL = 0.25; r.hpRf = 0.25; r.knR = 0.15; r.hand = 0; break;
    case 'raise': case 'cheer': { const w = pose === 'cheer' ? 0.2 * Math.sin(t * 5 + sd) : 0; r.shRf = 2.6 + w; r.shRo = 0.25; r.elR = 0.3; if (pose === 'cheer') { r.shLf = 2.4 - w; r.shLo = 0.3; r.elL = 0.4; } r.hdX = -0.2; break; }
    case 'scream': r.shLf = 1.6; r.shLo = 0.7; r.elL = 2.3; r.shRf = 1.6; r.shRo = 0.7; r.elR = 2.3; r.hdX = -0.3; r.spX = -0.12; r.jaw = 1; break;
    case 'kneel': r.hpLf = 1.45; r.knL = 1.5; r.hpRf = -0.1; r.knR = 1.55; r.ftR = 0.6; r.y = -0.42 * legH; r.spX = 0.1; r.shLf = 0.5; r.elL = 0.9; r.shRf = 0.5; r.elR = 0.9; break;
    case 'pray': r.hpLf = 1.45; r.knL = 1.5; r.hpRf = 1.45; r.knR = 1.5; r.y = -0.42 * legH; r.shLf = 0.7; r.shLo = -0.2; r.elL = 1.9; r.shRf = 0.7; r.shRo = -0.2; r.elR = 1.9; r.hdX = 0.3; r.hand = 0; break;
    case 'sit': r.hpLf = 1.55; r.hpRf = 1.55; r.knL = 1.5; r.knR = 1.5; r.y = -0.48 * legH; r.shLf = 0.45; r.elL = 0.9; r.shRf = 0.45; r.elR = 0.9; r.spX = 0.05; break;
    case 'crouch': r.hpLf = 1.2; r.hpRf = 1.0; r.knL = 1.9; r.knR = 1.9; r.y = -0.5 * legH; r.spX = 0.45; r.shRf = 0.9; r.elR = 0.4; r.shLf = 0.5; r.elL = 0.6; r.hdX = -0.35; break;
    case 'lie': case 'sleep': case 'faint': r.rx = -Math.PI / 2; r.y = 0.12; r.shLo = 0.1; r.shRo = 0.1; r.hdY = r.hdY * 0.3; r.hdX = 0; if (pose === 'faint') { r.shLo = 0.9; r.shRo = 0.6; r.elR = 0.4; r.knL = 0.5; r.hpLf = 0.3; } break;
    case 'fall': r.rx = -1.1; r.spX = -0.3; r.shLf = 2.0; r.shLo = 0.6; r.shRf = 1.8; r.shRo = 0.7; r.hpLf = 0.5; r.knL = 0.6; r.y = -0.2; break;
    case 'hold': r.shRf = 0.85; r.elR = 0.9; r.shRt = 0.2; break;
    case 'hug': r.shLf = 1.2; r.shLo = -0.4; r.elL = 1.6; r.shRf = 1.2; r.shRo = -0.4; r.elR = 1.6; r.hdX = 0.2; break;
    case 'look': r.hdY = 0.75 * side + r.hdY * 0.3; r.spY = 0.25 * side; break;
    case 'idle': default: break;
  }
  if (o.tremble) { const k = o.tremble * 0.035; r.hdX += noise1(t * 7, sd) * k; r.hdY += noise1(t * 6, sd + 2) * k; r.elL += noise1(t * 8, sd + 4) * k; r.elR += noise1(t * 8, sd + 5) * k; r.breath = Math.sin(t * 6) ; }
  return r;
};
// ---- body measures (metres)
const measures = (s: P3) => {
  const H = s.h ?? (s.kid ? 1.22 : s.sex === 'f' ? 1.66 : 1.78) * (s.age === 3 ? 0.97 : 1);
  const kid = !!s.kid; const b = s.build ?? 1;
  return {
    H, kid, hipY: H * (kid ? 0.44 : 0.5), sh: H * (kid ? 0.72 : 0.80), headR: H * (kid ? 0.112 : 0.085), neck: H * (kid ? 0.025 : 0.032),
    shW: H * (kid ? 0.105 : s.sex === 'f' ? 0.098 : 0.112) * b, waist: H * (kid ? 0.085 : s.sex === 'f' ? 0.075 : 0.085) * b, hipW: H * (kid ? 0.055 : s.sex === 'f' ? 0.062 : 0.056) * b,
    uArm: H * (kid ? 0.155 : 0.17), lArm: H * (kid ? 0.14 : 0.152), limbR: H * (kid ? 0.03 : 0.028) * b,
  };
};
const Seg: React.FC<{ len: number; r0: number; r1?: number; c: string; n?: number }> = ({ len, r0, r1, c, n = 6 }) => <mesh position={[0, -len / 2, 0]} material={M(c)}><cylinderGeometry args={[r1 ?? r0 * 0.85, r0, len, n]} /></mesh>;
const Hand: React.FC<{ s: P3; R: number; curl: number; side: 1 | -1; hold?: Hold; t: number; seed?: number; detail: boolean; far?: boolean }> = ({ s, R, curl, side, hold, t, seed = 1, detail, far }) => far ? (<group><mesh position={[0, -R * 1.4, 0]} scale={[1, 1.6, 0.6]} material={M(s.skin)}><boxGeometry args={[R * 1.9, R * 2.2, R * 1.4]} /></mesh>{hold && hold !== 'none' && <HeldItem k={hold} t={t} R={R} seed={seed} />}</group>) : (
  <group>
    <mesh position={[0, -R * 0.9, 0]} scale={[1, 1.2, 0.5]} material={M(s.skin)}><boxGeometry args={[R * 1.9, R * 1.7, R * 1.4]} /></mesh>
    {detail ? [-1.5, -0.5, 0.5, 1.5].map((k, i) => <group key={i} position={[k * R * 0.45, -R * 1.9, 0]} rotation={[-curl * 1.2, 0, 0]}><mesh position={[0, -R * 0.55, 0]} material={M(s.skin)}><boxGeometry args={[R * 0.36, R * 1.15, R * 0.36]} /></mesh></group>) : <mesh position={[0, -R * 2.3, 0]} rotation={[-curl, 0, 0]} material={M(s.skin)}><boxGeometry args={[R * 1.8, R * 1.0, R * 0.5]} /></mesh>}
    <mesh position={[side * R * 0.95, -R * 1.1, R * 0.35]} rotation={[0, 0, side * 0.5]} material={M(s.skin)}><boxGeometry args={[R * 0.4, R * 1.0, R * 0.4]} /></mesh>
    {hold && hold !== 'none' && <HeldItem k={hold} t={t} R={R} seed={seed} />}
  </group>
);
const HeldItem: React.FC<{ k: Hold; t: number; R: number; seed: number }> = ({ k, t, R, seed }) => {
  const at: V3 = [0, -R * 2.0, R * 0.2];
  if (k === 'torch') return <Torch at={[0, -R * 1.6, 0.05]} rot={[0.15, 0, 0]} t={t} seed={seed} light={3.2} />;
  if (k === 'lantern') return <Lantern at={[0, -R * 4.8, 0]} t={t} seed={seed} />;
  if (k === 'candle') return <group position={[0, -R * 2.2, 0.08]} rotation={[Math.PI / 2, 0, 0]}><Candle t={t} seed={seed} /></group>;
  if (k === 'pitchfork') return <group position={at} rotation={[Math.PI / 2 - 0.2, 0, 0]}><mesh material={M(PAL.wood)}><cylinderGeometry args={[0.02, 0.02, 1.8, 5]} /></mesh>{[-1, 0, 1].map((i) => <mesh key={i} position={[i * 0.05, 0.98, 0]} material={M('#5a5a5a', { m: 0.6 })}><coneGeometry args={[0.012, 0.25, 4]} /></mesh>)}</group>;
  if (k === 'axe') return <group position={at} rotation={[Math.PI / 2 - 0.3, 0, 0]}><mesh material={M(PAL.wood)}><cylinderGeometry args={[0.02, 0.02, 0.9, 5]} /></mesh><mesh position={[0.07, 0.4, 0]} material={M('#6a6a6a', { m: 0.7 })}><boxGeometry args={[0.16, 0.12, 0.02]} /></mesh></group>;
  if (k === 'sword') return <group position={at} rotation={[Math.PI / 2 - 0.2, 0, 0]}><mesh position={[0, 0.5, 0]} material={M('#b8bcc4', { m: 0.8, r: 0.3 })}><boxGeometry args={[0.04, 0.9, 0.01]} /></mesh><mesh position={[0, 0.04, 0]} material={M('#3a2a1a')}><boxGeometry args={[0.18, 0.03, 0.03]} /></mesh></group>;
  if (k === 'book') return <mesh position={[0, -R * 2.2, R * 1.2]} rotation={[0.3, 0, 0]} material={M('#1a1210')}><boxGeometry args={[0.18, 0.04, 0.24]} /></mesh>;
  if (k === 'doll') return <Doll at={[0, -R * 3.4, R * 0.6]} s={0.9} />;
  if (k === 'vial') return <mesh position={[0, -R * 2.2, R * 0.5]} material={M('#9ab8d8', { op: 0.7, r: 0.2 })}><cylinderGeometry args={[0.02, 0.025, 0.1, 6]} /></mesh>;
  if (k === 'string') return <mesh position={[0, -R * 5, 0]} material={M('#cfc2a0')}><cylinderGeometry args={[0.004, 0.004, R * 6, 3]} /></mesh>;
  return null;
};
// ---- face. hr = head half height. Faces +z.
const exprOf = (e: Expr) => ({
  calm: { bi: 0, ba: 0, eye: 1, mo: 0.05, mw: 1, sm: 0 }, fear: { bi: 0.35, ba: 0.3, eye: 1.25, mo: 0.3, mw: 0.8, sm: -0.2 }, scream: { bi: 0.45, ba: 0.4, eye: 1.3, mo: 1, mw: 0.9, sm: 0 },
  sad: { bi: 0.3, ba: 0.35, eye: 0.85, mo: 0.05, mw: 0.9, sm: -0.4 }, angry: { bi: -0.35, ba: -0.4, eye: 0.85, mo: 0.15, mw: 1.1, sm: -0.3 }, shock: { bi: 0.45, ba: 0.15, eye: 1.35, mo: 0.6, mw: 0.7, sm: 0 },
  smile: { bi: 0.05, ba: 0, eye: 0.9, mo: 0.08, mw: 1.15, sm: 0.6 }, sleepy: { bi: 0, ba: 0.05, eye: 0.25, mo: 0.02, mw: 0.9, sm: 0 }, pain: { bi: 0.4, ba: 0.45, eye: 0.6, mo: 0.4, mw: 1.1, sm: -0.5 },
  determined: { bi: -0.2, ba: -0.2, eye: 0.95, mo: 0.03, mw: 1.0, sm: -0.1 },
}[e] || { bi: 0, ba: 0, eye: 1, mo: 0.05, mw: 1, sm: 0 });
export const blinkAt = (t: number, seed = 1) => { const p = 3.6 + (seed % 3) * 0.7; const ph = ((t + seed * 1.3) % p) / p; const d = 0.13 / p; return ph < d ? 1 - Math.sin((ph / d) * Math.PI) * 0.95 : 1; };
const Face: React.FC<{ s: P3; hr: number; e: Expr; t: number; seed: number; jaw: number; detail: boolean; far?: boolean }> = ({ s, hr, e, t, seed, jaw, detail, far }) => {
  const x = exprOf(e); const gh = !!s.ghost; const bl = gh ? 1 : blinkAt(t, seed); const eo = clamp(x.eye * bl, 0.08, 1.4); const q = rng(seed * 3 + 1);
  const jw = s.jaw === 'square' ? 1.05 : s.jaw === 'narrow' || s.jaw === 'long' ? 0.82 : s.jaw === 'round' ? 0.98 : 0.9; const jl = s.jaw === 'long' ? 1.15 : 1;
  const mo = Math.max(x.mo, jaw) * (s.kid ? 1 : 0.9); const eyeY = hr * 0.06, eyeX = hr * 0.33, eyeZ = hr * 0.76;
  const lip = s.lip || '#8a4a44';
  if (far) return (
    <group>
      <mesh scale={[hr * 0.86, hr * 1.02, hr * 0.88]} position={[0, hr * 0.04, 0]} material={M(s.skin)}><icosahedronGeometry args={[1, 0]} /></mesh>
      {[-1, 1].map((k) => <mesh key={k} position={[k * eyeX, eyeY, eyeZ]} scale={[hr * 0.14, hr * 0.12 * (s.ghost ? 1.6 : 1), hr * 0.05]} material={G(s.ghost ? '#030305' : '#1a1410')}><icosahedronGeometry args={[1, 0]} /></mesh>)}
      <mesh position={[0, -hr * 0.45, hr * 0.74]} material={G('#1a0a0a')}><boxGeometry args={[hr * 0.3, hr * (0.05 + 0.3 * mo), hr * 0.05]} /></mesh>
      {s.hairStyle !== 'bald' && <mesh position={[0, hr * 0.38, -hr * 0.1]} scale={[hr * 0.9, hr * 0.8, hr * 0.95]} material={M(s.hair)}><icosahedronGeometry args={[1, 0]} /></mesh>}
    </group>
  );
  return (
    <group>
      <mesh scale={[hr * 0.86, hr * 1.02, hr * 0.88]} position={[0, hr * 0.04, 0]} material={M(s.skin)}><icosahedronGeometry args={[1, 1]} /></mesh>
      <mesh scale={[hr * 0.66 * jw, hr * 0.5 * jl, hr * 0.7]} position={[0, -hr * 0.42 * jl, hr * 0.12]} material={M(s.stubble || s.beard ? mix(s.skin, s.hair, s.beard ? 0.7 : 0.25) : s.skin)}><icosahedronGeometry args={[1, 1]} /></mesh>
      {[-1, 1].map((k) => <mesh key={'ear' + k} position={[k * hr * 0.82, 0, -hr * 0.05]} scale={[hr * 0.1, hr * 0.24, hr * 0.17]} material={M(s.skin)}><icosahedronGeometry args={[1, 0]} /></mesh>)}
      {/* eyes */}
      {gh && [-1, 1].map((k) => <group key={'ge' + k} position={[k * eyeX, eyeY, eyeZ - hr * 0.04]}>
        <mesh scale={[hr * (s.ghost === 'child' ? 0.3 : 0.26), hr * (s.ghost === 'child' ? 0.3 : 0.28), hr * 0.12]} material={G('#030305')}><icosahedronGeometry args={[1, 1]} /></mesh>
        {s.ghost === 'child' && <mesh position={[k * hr * 0.06, hr * 0.06, hr * 0.1]} scale={hr * 0.055} material={G('#d8e0ea')}><icosahedronGeometry args={[1, 0]} /></mesh>}
        <mesh position={[0, -hr * 0.42, hr * 0.06]} material={M('#1a1a22')}><boxGeometry args={[hr * 0.09, hr * 0.75, hr * 0.03]} /></mesh>
        <mesh position={[k * hr * 0.06, -hr * 0.7, hr * 0.02]} material={M('#1a1a22')}><boxGeometry args={[hr * 0.06, hr * 0.5, hr * 0.03]} /></mesh>
      </group>)}
      {!gh && [-1, 1].map((k) => <group key={'eye' + k} position={[k * eyeX, eyeY, eyeZ]}>
        <mesh position={[0, hr * 0.03, -hr * 0.04]} scale={[hr * 0.2, hr * 0.12, hr * 0.06]} material={M(mix(s.skin, '#000000', 0.18))}><icosahedronGeometry args={[1, 0]} /></mesh>
        <group scale={[1, eo, 1]}>
          <mesh scale={[hr * 0.2, hr * 0.14, hr * 0.07]} material={M('#efeade')}><icosahedronGeometry args={[1, 1]} /></mesh>
          <mesh position={[0, 0, hr * 0.05]} scale={[hr * 0.095, hr * 0.095, hr * 0.035]} material={M(s.eyeC || '#3a2414')}><icosahedronGeometry args={[1, 1]} /></mesh>
          <mesh position={[0, 0, hr * 0.07]} scale={[hr * 0.05, hr * 0.05, hr * 0.022]} material={G('#050505')}><icosahedronGeometry args={[1, 0]} /></mesh>
          {detail && <mesh position={[hr * 0.025, hr * 0.03, hr * 0.075]} scale={hr * 0.012} material={G('#ffffff')}><icosahedronGeometry args={[1, 0]} /></mesh>}
        </group>
        {/* brow */}
        {!gh && <mesh position={[k * hr * 0.02, hr * (0.2 + 0.07 * x.bi), hr * 0.04]} rotation={[0, 0, k * (x.ba * 0.45)]} scale={[1, s.brow ?? 1, 1]} material={M(s.hairStyle === 'greyshort' ? mix(s.hair, '#555', 0.3) : s.hair)}><boxGeometry args={[hr * 0.4, hr * 0.075, hr * 0.07]} /></mesh>}
      </group>)}
      {/* nose */}
      <mesh position={[0, -hr * 0.1, hr * 0.88]} rotation={[-0.25, Math.PI / 4, 0]} scale={[s.nose === 'broad' ? 1.4 : s.nose === 'button' || s.nose === 'small' ? 0.75 : 1, s.nose === 'hook' ? 1.25 : 1, 1]} material={M(mix(s.skin, '#5a2a1a', 0.08))}><coneGeometry args={[hr * 0.11, hr * 0.3, 4]} /></mesh>
      {/* mouth: dark opening + lips; smile bends the corners */}
      <group position={[0, -hr * 0.45, hr * 0.78]}>
        <mesh scale={[x.mw, 1, 1]} material={G('#1a0a0a')}><boxGeometry args={[hr * 0.3, hr * (0.035 + 0.3 * mo), hr * 0.04]} /></mesh>
        {mo > 0.35 && <mesh position={[0, hr * (0.015 + 0.13 * mo), hr * 0.015]} material={M('#e8e2d0')}><boxGeometry args={[hr * 0.24 * x.mw, hr * 0.04, hr * 0.03]} /></mesh>}
        <mesh position={[0, hr * (0.03 + 0.15 * mo), hr * 0.02]} material={M(lip)}><boxGeometry args={[hr * 0.32 * x.mw, hr * 0.035, hr * 0.04]} /></mesh>
        <mesh position={[0, -hr * (0.03 + 0.15 * mo), hr * 0.02]} material={M(lip)}><boxGeometry args={[hr * 0.28 * x.mw, hr * 0.045, hr * 0.04]} /></mesh>
        {[-1, 1].map((k) => <mesh key={k} position={[k * hr * 0.16 * x.mw, hr * 0.03 * x.sm, hr * 0.02]} rotation={[0, 0, -k * x.sm * 0.6]} material={M(lip)}><boxGeometry args={[hr * 0.06, hr * 0.03, hr * 0.04]} /></mesh>)}
      </group>
      {s.ghost === 'grin' || s.ghost === 'child' ? <group position={[0, -hr * 0.45, hr * 0.74]}>
        <mesh material={G('#0a0608')}><boxGeometry args={[hr * (s.ghost === 'grin' ? 0.78 : 0.5), hr * 0.26, hr * 0.06]} /></mesh>
        {Array.from({ length: s.ghost === 'grin' ? 12 : 8 }, (_, i) => { const n = s.ghost === 'grin' ? 6 : 4, k2 = i % n, row = i < n ? 1 : -1; const xx = (k2 - (n - 1) / 2) * hr * (s.ghost === 'grin' ? 0.13 : 0.12); return <mesh key={i} position={[xx, row * hr * 0.07, hr * 0.04]} material={M('#e8e4d4')}><boxGeometry args={[hr * 0.1, hr * 0.11, hr * 0.03]} /></mesh>; })}
        {Array.from({ length: s.ghost === 'grin' ? 5 : 3 }, (_, i) => <mesh key={'l' + i} position={[(i - 2) * hr * 0.13, 0, hr * 0.06]} material={M('#0a0608')}><boxGeometry args={[hr * 0.02, hr * 0.26, hr * 0.02]} /></mesh>)}
      </group> : null}
      {s.stache && <mesh position={[0, -hr * 0.3, hr * 0.84]} material={M(s.hair)}><boxGeometry args={[hr * 0.42, hr * 0.08, hr * 0.06]} /></mesh>}
      {s.freckles && detail && Array.from({ length: 8 }, (_, i) => <mesh key={'fr' + i} position={[(i < 4 ? -1 : 1) * hr * (0.25 + q() * 0.2), -hr * (0.08 + q() * 0.12), hr * 0.78]} scale={hr * 0.018} material={M('#9a6a4a')}><icosahedronGeometry args={[1, 0]} /></mesh>)}
      {s.glasses && <group position={[0, eyeY, eyeZ + hr * 0.08]}>{[-1, 1].map((k) => <mesh key={k} position={[k * eyeX, 0, 0]} material={M('#2a2622', { m: 0.6 })}><torusGeometry args={[hr * 0.16, hr * 0.018, 4, 10]} /></mesh>)}<mesh material={M('#2a2622')}><boxGeometry args={[hr * 0.2, hr * 0.025, hr * 0.02]} /></mesh></group>}
      <Hair s={s} hr={hr} t={t} seed={seed} />
    </group>
  );
};
export const mix = (a: string, b: string, k: number) => { const p = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16)); const A = p(a), B = p(b); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], k)).toString(16).padStart(2, '0')).join(''); };
const Hair: React.FC<{ s: P3; hr: number; t: number; seed: number }> = ({ s, hr, t, seed }) => {
  const c = s.hair; const st = s.hairStyle; const q = rng(seed * 7 + 3); const sw = sway(t, 3.5, 0.04, seed);
  if (st === 'bald') return null;
  const cap = <mesh position={[0, hr * 0.38, -hr * 0.1]} scale={[hr * 0.9, hr * (st === 'slick' || st === 'short' || st === 'greyshort' ? 0.72 : 0.8), hr * 0.95]} material={M(c)}><icosahedronGeometry args={[1, 1]} /></mesh>;
  const fringe = <mesh position={[0, hr * 0.66, hr * 0.38]} rotation={[0.45, 0, 0]} scale={[hr * 0.74, hr * 0.17, hr * 0.38]} material={M(c)}><icosahedronGeometry args={[1, 1]} /></mesh>;
  if (st === 'cap') return <group>{cap}<mesh position={[0, hr * 0.62, 0]} material={M('#202838')}><cylinderGeometry args={[hr * 0.86, hr * 0.92, hr * 0.42, 8]} /></mesh><mesh position={[0, hr * 0.44, hr * 0.62]} rotation={[0.2, 0, 0]} material={M('#121620')}><boxGeometry args={[hr * 1.2, hr * 0.05, hr * 0.6]} /></mesh></group>;
  if (st === 'hood') return <mesh position={[0, hr * 0.12, -hr * 0.18]} scale={[hr * 1.08, hr * 1.12, hr * 1.1]} material={M(s.topC)}><icosahedronGeometry args={[1, 1]} /></mesh>;
  const spikes = st === 'messy' ? Array.from({ length: 11 }, (_, i) => { const a = q() * Math.PI * 2, el = 0.25 + q() * 0.9; return <mesh key={'sp' + i} position={[Math.cos(a) * hr * 0.6 * Math.cos(el), hr * (0.3 + 0.6 * Math.sin(el)), Math.sin(a) * hr * 0.6 * Math.cos(el) - hr * 0.05]} rotation={[Math.sin(a) * 1.1 + sw, 0, -Math.cos(a) * 1.1]} material={M(c)}><coneGeometry args={[hr * 0.16, hr * 0.5, 4]} /></mesh>; }) : null;
  const long = (st === 'long' || st === 'wavy') ? <group rotation={[sw * 0.5, 0, 0]}>
    <mesh position={[0, -hr * 0.55, -hr * 0.52]} rotation={[0.12, 0, 0]} material={M(c)}><boxGeometry args={[hr * 1.6, hr * 2.0, hr * 0.42]} /></mesh>
    {[-1, 1].map((k) => <mesh key={k} position={[k * hr * 0.78, -hr * 0.45, hr * 0.05]} rotation={[0, 0, k * 0.08]} material={M(c)}><boxGeometry args={[hr * 0.26, hr * 1.6, hr * 0.6]} /></mesh>)}
  </group> : null;
  const bun = st === 'bun' ? <mesh position={[0, hr * 0.7, -hr * 0.62]} scale={hr * 0.36} material={M(c)}><icosahedronGeometry args={[1, 1]} /></mesh> : null;
  const tails = st === 'pigtails' ? [-1, 1].map((k) => <group key={k} position={[k * hr * 0.88, hr * 0.15, -hr * 0.15]} rotation={[sw, 0, k * 0.3]}><mesh position={[0, -hr * 0.55, 0]} material={M(c)}><coneGeometry args={[hr * 0.24, hr * 1.2, 5]} /></mesh></group>) : null;
  const ribbons = (s.acc || []).includes('redRibbons') ? [-1, 1].map((k) => <group key={'rb' + k} position={[k * hr * 0.85, hr * (st === 'pigtails' ? 0.15 : 0.35), -hr * 0.25]}>{[-1, 1].map((j) => <mesh key={j} position={[0, 0, j * hr * 0.12]} rotation={[j * 0.5, 0, 0]} material={M(PAL.red)}><boxGeometry args={[hr * 0.08, hr * 0.16, hr * 0.2]} /></mesh>)}</group>) : null;
  return <group>{cap}{st !== 'slick' && st !== 'greyshort' && fringe}{spikes}{long}{bun}{tails}{ribbons}</group>;
};
// ---- full person
export type PersonP = { s: P3; at?: V3; rot?: number; far?: boolean; t: number; pose?: Pose; pose2?: Pose; at2?: number; blend?: number; expr?: Expr; hold?: Hold; holdL?: Hold; look?: [number, number]; seed?: number; speed?: number; travel?: boolean; tremble?: number; rig?: Partial<Rig>; detail?: boolean; side?: number; scale?: number };
export const Person: React.FC<PersonP> = ({ s, at = [0, 0, 0], rot = 0, far = false, t, pose = 'idle', pose2, at2 = 1, blend = 0.6, expr = 'calm', hold, holdL, look, seed = 1, speed, travel, tremble, rig, detail = true, side, scale = 1 }) => {
  const m = measures(s); const legH = m.hipY;
  let R = poseRig(pose, t, { speed, seed, travel, legH, tremble, side });
  if (pose2) R = blendRig(R, poseRig(pose2, t, { speed, seed, travel, legH, tremble, side }), ss((t - at2) / blend));
  if (rig) R = { ...R, ...rig };
  if (look) { R.hdY += look[0]; R.hdX += look[1]; }
  const thigh = m.hipY * 0.5, shin = m.hipY * 0.46, lr = m.limbR;
  const coatLong = ['coat', 'raincoat'].includes(s.top), dress = s.top === 'dress' || s.top === 'shift';
  const skirt = s.bottom === 'skirtLong' || s.bottom === 'dressKnee' || dress;
  const skirtLen = s.bottom === 'dressKnee' ? m.hipY * 0.55 : m.hipY * 0.9;
  const legC = s.bottom === 'dressKnee' ? s.skin : s.bottom === 'none' ? s.skin : s.botC; const shoe = s.shoeC || '#2a2018';
  const sleeveLong = !['workshirt'].includes(s.top) || s.acc?.includes('collar');
  const br = 1 + (s.ghost ? 0.016 : 0.03) * R.breath; const torsoH = m.sh - m.hipY;
  const float = s.ghost ? 0.02 + 0.02 * Math.sin(t * 0.9 + seed) : 0;
  const Leg = (k: 1 | -1) => {
    const f = k > 0 ? R.hpLf : R.hpRf, o = k > 0 ? R.hpLo : R.hpRo, kn = k > 0 ? R.knL : R.knR, ft = k > 0 ? R.ftL : R.ftR;
    return (
      <group position={[k * m.hipW * 0.75, 0, 0]} rotation={[-f, 0, k * o]}>
        <Seg len={thigh} r0={lr * 1.45} r1={lr * 1.15} c={legC} />
        <group position={[0, -thigh, 0]} rotation={[kn, 0, 0]}>
          <Seg len={shin} r0={lr * 1.1} r1={lr * 0.85} c={legC} />
          {s.bottom === 'dressKnee' && <mesh position={[0, -shin * 0.82, 0]} material={M('#d8d0bc')}><cylinderGeometry args={[lr * 0.95, lr * 0.95, shin * 0.3, 6]} /></mesh>}
          <group position={[0, -shin, 0]} rotation={[-kn * 0.3 + ft, 0, 0]}>
            {s.ghost ? <group><mesh position={[0, -m.H * 0.018, m.H * 0.022]} material={M(s.skin)}><boxGeometry args={[lr * 2.0, m.H * 0.035, m.H * 0.1]} /></mesh>{[-1, 0, 1].map((i) => <mesh key={i} position={[i * lr * 0.6, -m.H * 0.028, m.H * 0.068]} material={M(s.skin)}><boxGeometry args={[lr * 0.5, m.H * 0.018, m.H * 0.02]} /></mesh>)}</group>
              : <mesh position={[0, -m.H * 0.022, m.H * 0.03]} material={M(shoe)}><boxGeometry args={[lr * 2.3, m.H * 0.045, m.H * 0.13]} /></mesh>}
          </group>
        </group>
      </group>
    );
  };
  const Arm = (k: 1 | -1) => {
    const f = k > 0 ? R.shLf : R.shRf, o = k > 0 ? R.shLo : R.shRo, el = k > 0 ? R.elL : R.elR, tw = k > 0 ? R.shLt : R.shRt; const h = k > 0 ? holdL : hold;
    return (
      <group position={[k * m.shW * 0.94, torsoH - lr * 1.5, 0]} rotation={[-f, tw, k * o]}>
        <mesh material={M(s.topC)} scale={lr * 1.35}><icosahedronGeometry args={[1, 0]} /></mesh>
        <Seg len={m.uArm} r0={lr * 1.25} r1={lr * 1.05} c={s.topC} />
        <group position={[0, -m.uArm, 0]} rotation={[-el, 0, 0]}>
          <Seg len={m.lArm} r0={lr * 1.0} r1={lr * 0.8} c={sleeveLong ? s.topC : s.skin} />
          {!sleeveLong && <mesh position={[0, -0.02, 0]} material={M(s.topC)}><cylinderGeometry args={[lr * 1.2, lr * 1.2, 0.05, 6]} /></mesh>}
          {s.acc?.includes('redThread') && <mesh position={[0, -m.lArm + lr * 0.4, 0]} rotation={[Math.PI / 2, 0, 0]} material={M(PAL.red)}><torusGeometry args={[lr * 1.05, lr * 0.16, 3, 8]} /></mesh>}
          <group position={[0, -m.lArm, 0]}><Hand s={s} R={lr * 0.85} curl={h && h !== 'none' ? 1 : R.hand} side={k} hold={h} t={t} seed={seed + (k > 0 ? 10 : 0)} detail={detail} far={far} /></group>
        </group>
      </group>
    );
  };
  return (
    <group position={[at[0], at[1], at[2]]} rotation={[0, rot, 0]} scale={scale}>
      <group position={[R.x, m.hipY + R.y + float, R.z]} rotation={[R.rx, R.ry, R.rz]}>
        {/* hips */}
        <mesh material={M(skirt ? (dress ? s.topC : s.botC) : s.botC)}><cylinderGeometry args={[m.waist * 1.0, m.hipW * 1.5, m.H * 0.08, 7]} /></mesh>
        {Leg(1)}{Leg(-1)}
        {skirt && <mesh position={[0, -skirtLen / 2, 0]} material={M(dress ? s.topC : s.botC)}><cylinderGeometry args={[m.hipW * 1.55, m.hipW * 2.3, skirtLen, 8, 1, true]} /></mesh>}
        {coatLong && <mesh position={[0, -m.hipY * 0.28, 0]} material={M(s.topC, { side: 'double' })}><cylinderGeometry args={[m.waist * 1.1, m.hipW * 2.25, m.hipY * 0.62, 8, 1, true]} /></mesh>}
        {/* spine -> chest */}
        <group rotation={[R.spX, R.spY, R.spZ]}>
          <group scale={[br, 1, br]}>
            <mesh position={[0, torsoH / 2, 0]} scale={[1, 1, 0.62]} material={M(s.topC)}><cylinderGeometry args={[m.shW * 0.98, m.waist, torsoH, 7]} /></mesh>
            <mesh position={[0, torsoH - m.H * 0.012, 0]} scale={[1, 0.3, 0.62]} material={M(s.topC)}><icosahedronGeometry args={[m.shW * 0.98, 1]} /></mesh>
            {/* front details: collar V, buttons, pockets, belt */}
            {!far && <mesh position={[0, torsoH * 0.86, m.shW * 0.5]} rotation={[0.2, 0, Math.PI / 4]} material={M(s.inner || mix(s.topC, '#ffffff', 0.3))}><boxGeometry args={[m.shW * 0.42, m.shW * 0.42, 0.01]} /></mesh>}
            {detail && !far && ['shirt', 'workshirt', 'cardigan', 'coat', 'raincoat', 'uniform', 'jacket'].includes(s.top) && [0.25, 0.45, 0.65].map((y, i) => <mesh key={i} position={[0, torsoH * y, m.shW * 0.56]} material={M(mix(s.topC, '#000000', 0.45))}><boxGeometry args={[0.018, 0.018, 0.01]} /></mesh>)}
            {detail && !far && (s.top === 'workshirt' || s.top === 'uniform') && [-1, 1].map((k) => <mesh key={k} position={[k * m.shW * 0.45, torsoH * 0.68, m.shW * 0.52]} material={M(mix(s.topC, '#000000', 0.2))}><boxGeometry args={[m.shW * 0.36, m.shW * 0.3, 0.012]} /></mesh>)}
            {!far && (s.top === 'cardigan' || s.top === 'jacket' || coatLong) && [-1, 1].map((k) => <mesh key={'lap' + k} position={[k * m.shW * 0.2, torsoH * 0.5, m.shW * 0.57]} material={M(mix(s.topC, '#000000', 0.25))}><boxGeometry args={[0.02, torsoH * 0.95, 0.012]} /></mesh>)}
            {!skirt && !coatLong && <mesh position={[0, m.H * 0.01, 0]} scale={[1, 1, 0.68]} material={M('#2a1e16')}><cylinderGeometry args={[m.waist * 1.04, m.waist * 1.04, m.H * 0.022, 7]} /></mesh>}
            {s.acc?.includes('apron') && <mesh position={[0, torsoH * 0.15, m.shW * 0.55]} material={M(s.accC || '#c8bca0')}><boxGeometry args={[m.shW * 1.2, torsoH * 0.9, 0.01]} /></mesh>}
            {s.acc?.includes('badge') && <mesh position={[m.shW * 0.45, torsoH * 0.7, m.shW * 0.58]} material={M('#c8a850', { m: 0.7, r: 0.3 })}><octahedronGeometry args={[0.03, 0]} /></mesh>}
          </group>
          {s.acc?.includes('shawl') && <mesh position={[0, torsoH * 0.88, -0.01]} scale={[1, 1, 0.75]} material={M(s.accC || '#6a6050')}><coneGeometry args={[m.shW * 1.35, torsoH * 0.55, 8, 1, true]} /></mesh>}
          {s.acc?.includes('redScarf') && <mesh position={[0, torsoH + m.neck * 0.3, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.75, 1]} material={M(PAL.red)}><torusGeometry args={[m.H * 0.05, m.H * 0.018, 5, 8]} /></mesh>}
          {Arm(1)}{Arm(-1)}
          {/* neck + head */}
          <group position={[0, torsoH, 0]}>
            <mesh position={[0, m.neck / 2, 0]} material={M(s.skin)}><cylinderGeometry args={[m.H * 0.024, m.H * 0.028, m.neck * 1.3, 6]} /></mesh>
            <group position={[0, m.neck + m.headR * 0.95, 0]} rotation={[R.hdX, R.hdY, R.hdZ]}>
              <Face s={s} hr={m.headR} e={expr} t={t} seed={seed} jaw={R.jaw} detail={detail && !far} far={far} />
              {s.acc?.includes('hat') && <group position={[0, m.headR * 0.75, -m.headR * 0.05]}><mesh material={M(s.accC || '#3a2c20')}><cylinderGeometry args={[m.headR * 1.5, m.headR * 1.5, m.headR * 0.08, 10]} /></mesh><mesh position={[0, m.headR * 0.32, 0]} material={M(s.accC || '#3a2c20')}><cylinderGeometry args={[m.headR * 0.82, m.headR * 0.92, m.headR * 0.62, 8]} /></mesh></group>}
            </group>
          </group>
        </group>
        {s.acc?.includes('satchel') && <group>
          <mesh position={[0, torsoH * 0.52, 0]} rotation={[0, 0, 0.72]} material={M(s.accC || '#7a5a36')}><boxGeometry args={[0.07, m.shW * 3.4, m.shW * 1.45]} /></mesh>
          <mesh position={[m.hipW * 2.0, torsoH * 0.06, m.shW * 0.35]} material={M(s.accC || '#7a5a36')}><boxGeometry args={[m.H * 0.13, m.H * 0.11, m.H * 0.05]} /></mesh>
          <mesh position={[m.hipW * 2.0, torsoH * 0.1, m.shW * 0.4]} material={M(mix(s.accC || '#7a5a36', '#000000', 0.25))}><boxGeometry args={[m.H * 0.134, m.H * 0.045, m.H * 0.052]} /></mesh>
        </group>}
      </group>
    </group>
  );
};
// head anchor in world space (for tags): standing pose only, approximate
export const headTop = (s: P3, at: V3 = [0, 0, 0]): V3 => { const m = measures(s); return [at[0], at[1] + m.sh + m.neck + m.headR * 2, at[2]]; };
export const heightOf = (s: P3) => measures(s).H;
