import React, { useMemo } from 'react';
import * as THREE from 'three';
import { M, G, PAL, rng, sway, noise1, ss, lerp, V3 } from './core';
import { mix } from './Person';
// ===== MONSTER BUILDER 3D (engine v0.5): low-poly, flat-shaded skeletal creature with a full rig, built from ONE spec.
// Default design = the channel's Herbert Solomon creature (the user's favourite): impossibly tall and thin, hunched, bald white skull,
// eyes like two black holes deep in the skull, a grin of teeth, bulging veins, ribs, arms like sticks, very long bony fingers with claws.
// Dress: 'living' (brown hat, grey face cloth, long brown coat), 'ghost' (burnt black rags, scar), 'bare' (no clothes, ribs).
// MONSTER PROTOCOL: the creature looks exactly as the story describes. List every body detail of the story in the spec.
// SECONDARY MOTION LAW: the creature ALWAYS breathes (slow, deep chest + shoulders), sways, twitches its head and curls its fingers.
export type C3 = {
  id: string; name: string; skin: string; height: number; hunch: number; armL: number; fingerL: number; legL: number; thin: number;
  eyes: 'black' | 'glow' | 'none'; mouth: 'teeth' | 'grin' | 'none'; teeth: number; veins: boolean; ribs: boolean; claws: string;
  dress: 'living' | 'ghost' | 'bare'; hood?: string; tears?: string; hatC?: string; clothC?: string; coatC?: string; trouC?: string; ragC?: string; scar?: boolean; veinC?: string; glowC?: string;
};
export const HERBERT: C3 = { id: 'herbert', name: 'HERBERT SOLOMON', skin: '#d6d3c6', height: 2.55, hunch: 0.48, armL: 1.3, fingerL: 1.28, legL: 1.14, thin: 0.98, eyes: 'black', mouth: 'teeth', teeth: 14, veins: true, ribs: true, claws: '#4a4038', dress: 'ghost', hatC: '#5a4630', clothC: '#8c8a80', coatC: '#4a3b2c', trouC: '#3d3934', ragC: '#2a2522', scar: true, veinC: '#5a4a62' };
export const HERBERT_LIVING: C3 = { ...HERBERT, dress: 'living', scar: false };
export type CPose = 'stand' | 'stalk' | 'crawl' | 'reach' | 'loom' | 'run' | 'crouch' | 'bend' | 'lunge' | 'hide' | 'carry' | 'sit';
type CR = { y: number; z: number; spX: number; spZ: number; nk: number; hdX: number; hdY: number; hdZ: number; breath: number; shLf: number; shLo: number; elL: number; shRf: number; shRo: number; elR: number; hpLf: number; knL: number; hpRf: number; knR: number; curlL: number; curlR: number; jaw: number };
const bump = (t: number, period: number, at: number, w = 0.35) => { const ph = ((t % period) + period) % period; const d = Math.abs(ph - at); return d < w ? Math.pow(Math.cos((d / w) * Math.PI * 0.5), 2) : 0; };
export const cRig = (pose: CPose, t: number, c: C3, o: { speed?: number; seed?: number; travel?: boolean; p?: number } = {}): CR => {
  const sd = o.seed ?? 3; const hipY = c.height * 0.46 * c.legL / 1.14;
  const br = Math.sin((t * Math.PI * 2) / 3.3 + sd);
  const r: CR = { y: 0, z: 0, spX: c.hunch * 0.9, spZ: sway(t, 6, 0.03, sd), nk: 0.55, hdX: -0.75, hdY: sway(t, 6.3, 0.18, sd), hdZ: sway(t, 4.7, 0.08, sd) + 0.32 * bump(t, 5.3, 2.1) - 0.22 * bump(t, 7.1, 4.4), breath: br,
    shLf: 0.12 + sway(t, 4.1, 0.08, sd + 1), shLo: 0.12, elL: 0.35 + sway(t, 3.3, 0.08, sd + 2), shRf: 0.1 + sway(t, 4.4, 0.08, sd + 3), shRo: 0.12, elR: 0.4 + sway(t, 3.6, 0.08, sd + 4), hpLf: 0.12, knL: 0.3, hpRf: -0.05, knR: 0.24, curlL: 0.35 + sway(t, 1.7, 0.18, sd), curlR: 0.35 + sway(t, 1.9, 0.18, sd + 5), jaw: 0.12 + 0.08 * Math.max(0, br) };
  r.y = -hipY * 0.06 + 0.012 * br; r.spX += 0.03 * br;
  switch (pose) {
    case 'stalk': case 'run': {
      const run = pose === 'run'; const f = (run ? 1.25 : 0.42) * (o.speed ?? 1); const ph = t * f * Math.PI * 2 + sd; const A = run ? 0.75 : 0.5;
      r.hpLf = A * Math.sin(ph) + 0.15; r.hpRf = -A * Math.sin(ph) + 0.15; r.knL = 0.35 + (run ? 1.2 : 0.95) * Math.max(0, -Math.sin(ph - 0.8)); r.knR = 0.35 + (run ? 1.2 : 0.95) * Math.max(0, Math.sin(ph - 0.8));
      r.shLf = -0.45 * A * Math.sin(ph) + 0.2; r.shRf = 0.45 * A * Math.sin(ph) + 0.2; r.elL = 0.3 + 0.2 * Math.max(0, Math.sin(ph)); r.elR = 0.3 + 0.2 * Math.max(0, -Math.sin(ph));
      r.y = -hipY * 0.1 + 0.06 * Math.abs(Math.cos(ph)); r.hdX += 0.1 * Math.sin(ph * 2); if (run) { r.spX += 0.35; r.shLf += 0.4; r.shRf += 0.4; }
      if (o.travel !== false) r.z = (run ? 4.2 : 0.95) * (o.speed ?? 1) * t; break;
    }
    case 'crawl': { const ph = t * 0.55 * Math.PI * 2 + sd; r.spX = 1.35; r.nk = 0.2; r.hdX = -1.25; r.y = -hipY * 0.62; r.hpLf = 1.5 + 0.25 * Math.sin(ph); r.hpRf = 1.5 - 0.25 * Math.sin(ph); r.knL = 2.1; r.knR = 2.1;
      r.shLf = 1.35 + 0.45 * Math.sin(ph); r.shRf = 1.35 - 0.45 * Math.sin(ph); r.elL = 0.35 + 0.35 * Math.max(0, -Math.sin(ph)); r.elR = 0.35 + 0.35 * Math.max(0, Math.sin(ph)); r.shLo = 0.35; r.shRo = 0.35;
      if (o.travel !== false) r.z = 0.45 * (o.speed ?? 1) * t; break; }
    case 'reach': r.shRf = 1.4 + 0.08 * Math.sin(t * 1.5); r.shRo = 0.05; r.elR = 0.12; r.curlR = 0.08 + 0.12 * Math.sin(t * 2.3); r.spX = c.hunch * 0.9 + 0.2; r.hdX = -0.95; r.jaw = 0.35; break;
    case 'loom': { const p = o.p ?? ss(t / 2.2); r.spX = lerp(1.0, 0.1, p); r.hdX = lerp(-1.0, -0.15, p); r.y = lerp(-hipY * 0.45, 0, p); r.knL = r.knR = lerp(1.6, 0.1, p); r.hpLf = r.hpRf = lerp(1.0, 0.05, p);
      r.shLf = lerp(0.3, 0.6, p); r.shLo = lerp(0.2, 0.9, p); r.shRf = lerp(0.3, 0.6, p); r.shRo = lerp(0.2, 0.9, p); r.elL = r.elR = 0.25; r.curlL = r.curlR = 0.15; r.jaw = lerp(0.1, 0.7, p); break; }
    case 'crouch': r.spX = 0.95; r.y = -hipY * 0.48; r.hpLf = 1.25; r.hpRf = 1.05; r.knL = 2.2; r.knR = 2.2; r.shLf = 0.95; r.shRf = 0.8; r.elL = 0.5; r.elR = 0.6; r.hdX = -1.05; break;
    case 'bend': r.spX = 1.15; r.nk = 0.75; r.hdX = -1.3; r.y = -hipY * 0.12; r.knL = 0.5; r.knR = 0.45; r.shLf = 0.95; r.shRf = 0.7; r.elL = 0.35; r.elR = 0.55; break;
    case 'lunge': { const p = o.p ?? ss(t / 0.9); r.spX = c.hunch + 0.5 * p; r.shLf = 0.4 + 1.1 * p; r.shRf = 0.4 + 1.2 * p; r.shLo = r.shRo = 0.3 + 0.4 * p; r.elL = r.elR = 0.2; r.curlL = r.curlR = 0.05; r.jaw = 0.2 + 0.8 * p; r.hpLf = 0.6 * p; r.knL = 0.3 + 0.5 * p; r.hpRf = -0.3 * p; r.z = 0.8 * p; break; }
    case 'hide': r.shRf = 1.9; r.shRo = 0.55; r.elR = 2.35; r.curlR = 0.25; r.hdX = -0.5; r.hdY = 0.25 + sway(t, 6, 0.05, sd); break;
    case 'carry': r.shLf = 0.9; r.shLo = -0.15; r.elL = 1.2; r.shRf = 0.9; r.shRo = -0.15; r.elR = 1.2; r.curlL = r.curlR = 0.7; break;
    case 'sit': r.hpLf = 1.6; r.hpRf = 1.5; r.knL = 1.9; r.knR = 1.85; r.y = -hipY * 0.55; r.shLf = 0.6; r.elL = 0.9; r.shRf = 0.5; r.elR = 1.0; break;
    case 'stand': default: break;
  }
  return r;
};
const Bone: React.FC<{ len: number; r0: number; r1?: number; c: string; knob?: boolean }> = ({ len, r0, r1, c, knob = true }) => (
  <>{knob && <mesh material={M(c)} scale={r0 * 1.6}><icosahedronGeometry args={[1, 0]} /></mesh>}<mesh position={[0, -len / 2, 0]} material={M(c)}><cylinderGeometry args={[r1 ?? r0 * 0.8, r0, len, 5]} /></mesh></>
);
const Vein: React.FC<{ pts: V3[]; r: number; c: string }> = ({ pts, r, c }) => {
  const geo = useMemo(() => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p))), 10, r, 3, false), [JSON.stringify(pts), r]);
  return <mesh geometry={geo} material={M(c)} />;
};
// tattered cloth ring: hanging strips of different lengths (burnt rags), they sway
const Rags: React.FC<{ r: number; len: number; n?: number; c: string; t: number; seed: number }> = ({ r, len, n = 11, c, t, seed }) => {
  const q = rng(seed); const st = Array.from({ length: n }, () => [q(), q()]);
  return <group>{st.map(([a, b], i) => { const ang = (i / n) * Math.PI * 2; const l = len * (0.45 + b * 0.75); return <group key={i} position={[Math.sin(ang) * r, 0, Math.cos(ang) * r]} rotation={[Math.cos(ang) * (0.12 + sway(t, 2.6, 0.06, i)), ang, -Math.sin(ang) * 0.12]}><mesh position={[0, -l / 2, 0]} material={M(i % 3 ? c : mix(c, '#000000', 0.35), { side: 'double' })}><coneGeometry args={[r * (0.32 + a * 0.15), l, 3, 1, true]} /></mesh></group>; })}</group>;
};
const Finger: React.FC<{ len: number; r: number; curl: number; c: string; claw: string }> = ({ len, r, curl, c, claw }) => (
  <group rotation={[-curl * 0.6, 0, 0]}>
    <mesh position={[0, -len * 0.27, 0]} material={M(c)}><cylinderGeometry args={[r * 0.8, r, len * 0.55, 4]} /></mesh>
    <group position={[0, -len * 0.55, 0]} rotation={[-curl * 0.9, 0, 0]}>
      <mesh material={M(c)} scale={r * 1.15}><icosahedronGeometry args={[1, 0]} /></mesh>
      <mesh position={[0, -len * 0.22, 0]} material={M(c)}><cylinderGeometry args={[r * 0.6, r * 0.8, len * 0.45, 4]} /></mesh>
      <mesh position={[0, -len * 0.5, r * 0.2]} rotation={[0.25, 0, 0]} material={M(claw, { r: 0.4 })}><coneGeometry args={[r * 0.65, len * 0.2, 4]} /></mesh>
    </group>
  </group>
);
const CHand: React.FC<{ c: C3; R: number; curl: number; t: number; seed: number; side: 1 | -1 }> = ({ c, R, curl, t, seed, side }) => {
  const fl = R * 9 * c.fingerL;
  return (
    <group>
      <mesh position={[0, -R * 1.4, 0]} scale={[1, 1, 0.45]} material={M(c.skin)}><boxGeometry args={[R * 3, R * 2.8, R * 1.6]} /></mesh>
      {[-1.5, -0.5, 0.5, 1.5].map((k, i) => <group key={i} position={[k * R * 0.85, -R * 2.7, 0]} rotation={[0, 0, k * 0.07]}><Finger len={fl * (1 - Math.abs(k) * 0.08)} r={R * 0.38} curl={curl + sway(t, 1.3 + i * 0.27, 0.12, seed + i)} c={c.skin} claw={c.claws} /></group>)}
      <group position={[side * R * 1.5, -R * 1.2, R * 0.4]} rotation={[0.3, 0, side * 0.7]}><Finger len={fl * 0.6} r={R * 0.38} curl={curl * 0.6} c={c.skin} claw={c.claws} /></group>
    </group>
  );
};
const Skull: React.FC<{ c: C3; hr: number; jaw: number; t: number; cloth: boolean }> = ({ c, hr, jaw, t, cloth }) => {
  const dark = mix(c.skin, '#1a1418', 0.45), bone = mix(c.skin, '#ffffff', 0.12);
  return (
    <group>
      <mesh position={[0, hr * 0.15, -hr * 0.05]} scale={[hr * 0.86, hr * 1.08, hr * 0.98]} material={M(c.skin)}><icosahedronGeometry args={[1, 1]} /></mesh>
      <mesh position={[0, hr * 0.32, hr * 0.62]} scale={[hr * 0.78, hr * 0.16, hr * 0.28]} material={M(bone)}><icosahedronGeometry args={[1, 0]} /></mesh>
      {[-1, 1].map((k) => <group key={k}>
        <mesh position={[k * hr * 0.33, hr * 0.08, hr * 0.72]} scale={[hr * 0.27, hr * 0.27, hr * 0.12]} material={G(c.eyes === 'glow' ? (c.glowC || PAL.red) : '#000000')}><icosahedronGeometry args={[1, 1]} /></mesh>
        <mesh position={[k * hr * 0.35, hr * 0.06, hr * 0.62]} scale={[hr * 0.36, hr * 0.36, hr * 0.12]} material={M(dark)}><icosahedronGeometry args={[1, 0]} /></mesh>
        <mesh position={[k * hr * 0.55, -hr * 0.28, hr * 0.5]} scale={[hr * 0.2, hr * 0.12, hr * 0.2]} material={M(bone)}><icosahedronGeometry args={[1, 0]} /></mesh>
        <mesh position={[k * hr * 0.45, -hr * 0.45, hr * 0.48]} scale={[hr * 0.16, hr * 0.22, hr * 0.12]} material={M(dark)}><icosahedronGeometry args={[1, 0]} /></mesh>
      </group>)}
      {[-1, 1].map((k) => <mesh key={'n' + k} position={[k * hr * 0.06, -hr * 0.18, hr * 0.92]} rotation={[0, 0, k * 0.4]} material={G('#050505')}><coneGeometry args={[hr * 0.05, hr * 0.14, 3]} /></mesh>)}
      {!cloth && c.mouth !== 'none' && <group position={[0, -hr * 0.55, hr * 0.72]}>
        <mesh scale={[1, 1 + jaw * 2.5, 1]} material={G('#0c0606')}><boxGeometry args={[hr * 0.7, hr * 0.12, hr * 0.1]} /></mesh>
        {Array.from({ length: c.teeth }, (_, i) => { const n = c.teeth / 2, k = i % n, row = i < n ? 1 : -1; const x = (k - (n - 1) / 2) * hr * 0.085; return <mesh key={i} position={[x, row * hr * (0.03 + jaw * 0.12), hr * 0.06 - Math.abs(x) * 0.35]} material={M('#e6e0cc')}><boxGeometry args={[hr * 0.07, hr * 0.11, hr * 0.04]} /></mesh>; })}
        <group position={[0, -hr * (0.12 + jaw * 0.18), -hr * 0.12]}><mesh scale={[hr * 0.55, hr * 0.2, hr * 0.42]} material={M(c.skin)}><icosahedronGeometry args={[1, 0]} /></mesh></group>
      </group>}
      {c.veins && <>
        <Vein pts={[[-hr * 0.2, hr * 1.1, hr * 0.3], [-hr * 0.35, hr * 0.85, hr * 0.62], [-hr * 0.5, hr * 0.55, hr * 0.64], [-hr * 0.7, hr * 0.3, hr * 0.45]]} r={hr * 0.035} c={c.veinC || '#5a4a62'} />
        <Vein pts={[[hr * 0.1, hr * 1.18, hr * 0.0], [hr * 0.3, hr * 1.0, hr * 0.5], [hr * 0.45, hr * 0.8, hr * 0.68], [hr * 0.62, hr * 0.62, hr * 0.5]]} r={hr * 0.03} c={c.veinC || '#5a4a62'} />
        <Vein pts={[[hr * 0.0, hr * 1.2, -hr * 0.4], [-hr * 0.5, hr * 0.95, -hr * 0.6], [-hr * 0.82, hr * 0.5, -hr * 0.3]]} r={hr * 0.03} c={c.veinC || '#5a4a62'} />
      </>}
      {c.tears && [-1, 1].map((k) => <group key={'tr' + k} position={[k * hr * 0.33, -hr * 0.1, hr * 0.74]}>
        <mesh position={[0, -hr * 0.16, 0]} material={G(c.tears!)}><boxGeometry args={[hr * 0.12, hr * 0.5, hr * 0.03]} /></mesh>
        <mesh position={[k * hr * 0.03, -hr * 0.52 - hr * 0.1 * (0.5 + 0.5 * Math.sin(t * 0.9 + k)), 0]} material={G(c.tears!)}><boxGeometry args={[hr * 0.08, hr * 0.3, hr * 0.03]} /></mesh>
      </group>)}
      {c.hood && <group position={[0, hr * 0.12, -hr * 0.3]}>
        {/* a cowl that covers the back and the top of the head and leaves the face in shadow, not hidden */}
        <mesh scale={[hr * 1.16, hr * 1.22, hr * 1.0]} material={M(c.hood, { side: 'double' })}><icosahedronGeometry args={[1, 1]} /></mesh>
        <mesh position={[0, hr * 0.05, hr * 0.72]} rotation={[0.2, 0, 0]} material={M(mix(c.hood, '#000000', 0.25), { side: 'double' })}><torusGeometry args={[hr * 0.92, hr * 0.16, 4, 10]} /></mesh>
        <mesh position={[0, hr * 0.6, -hr * 0.5]} rotation={[0.5, 0, 0]} material={M(c.hood)}><coneGeometry args={[hr * 0.72, hr * 0.8, 6]} /></mesh>
      </group>}
      {c.scar && <mesh position={[hr * 0.55, hr * 0.5, hr * 0.35]} scale={[hr * 0.35, hr * 0.42, hr * 0.3]} material={M('#6a4a3e')}><icosahedronGeometry args={[1, 0]} /></mesh>}
      {cloth && <group position={[0, -hr * (c.hood ? 0.66 : 0.42), hr * 0.62]} scale={c.hood ? [1, 0.72, 1] : [1, 1, 1]}>
        <mesh scale={[1, 1, 0.55]} material={M(c.clothC || '#8c8a80')}><cylinderGeometry args={[hr * 0.9, hr * 0.98, hr * 0.85, 8, 1, true, -Math.PI * 0.75, Math.PI * 1.5]} /></mesh>
        <mesh position={[0, 0, hr * 0.32]} material={M(mix(c.clothC || '#8c8a80', '#000000', 0.15))}><boxGeometry args={[hr * 1.3, hr * 0.85, hr * 0.06]} /></mesh>
        <mesh position={[hr * 0.1, -hr * 0.62, hr * 0.28]} rotation={[0.1 + sway(t, 3, 0.08, 2), 0, 0.15]} material={M(c.clothC || '#8c8a80')}><coneGeometry args={[hr * 0.3, hr * 0.6, 3]} /></mesh>
        {[-0.3, 0.05, 0.4].map((y, i) => <mesh key={i} position={[0, hr * y * 0.8, hr * 0.36]} material={M(mix(c.clothC || '#8c8a80', '#000000', 0.3))}><boxGeometry args={[hr * 1.2, hr * 0.02, hr * 0.01]} /></mesh>)}
      </group>}
      {c.dress === 'living' && !c.hood && <group position={[0, hr * 0.95, -hr * 0.05]} rotation={[-0.1, 0, 0.05]}>
        <mesh material={M(c.hatC || '#5a4630')}><cylinderGeometry args={[hr * 1.55, hr * 1.6, hr * 0.08, 12]} /></mesh>
        <mesh position={[0, hr * 0.38, 0]} material={M(c.hatC || '#5a4630')}><cylinderGeometry args={[hr * 0.78, hr * 0.92, hr * 0.72, 8]} /></mesh>
        <mesh position={[0, hr * 0.08, 0]} material={M(mix(c.hatC || '#5a4630', '#000000', 0.45))}><cylinderGeometry args={[hr * 0.93, hr * 0.93, hr * 0.12, 8]} /></mesh>
      </group>}
    </group>
  );
};
export type CreatureP = { c?: C3; at?: V3; rot?: number; t: number; pose?: CPose; pose2?: CPose; at2?: number; blend?: number; seed?: number; speed?: number; travel?: boolean; p?: number; look?: [number, number]; jaw?: number; scale?: number };
export const Creature: React.FC<CreatureP> = ({ c = HERBERT, at = [0, 0, 0], rot = 0, t, pose = 'stand', pose2, at2 = 1, blend = 0.7, seed = 3, speed, travel, p, look, jaw, scale = 1 }) => {
  let R = cRig(pose, t, c, { speed, seed, travel, p });
  if (pose2) { const B = cRig(pose2, t, c, { speed, seed, travel, p }); const k = ss((t - at2) / blend); const o: any = {}; for (const key in R) o[key] = lerp((R as any)[key], (B as any)[key], k); R = o; }
  if (look) { R.hdY += look[0]; R.hdX += look[1]; }
  if (jaw != null) R.jaw = jaw;
  const H = c.height; const hipY = H * 0.46 * c.legL / 1.14; const thigh = hipY * 0.5, shin = hipY * 0.48; const torso = H * 0.27, neck = H * 0.065, hr = H * 0.066;
  const lr = H * 0.012 * c.thin; const shW = H * 0.085; const uA = H * 0.2 * c.armL / 1.3, lA = H * 0.19 * c.armL / 1.3;
  const living = c.dress === 'living', ghost = c.dress === 'ghost';
  const body = living ? (c.coatC || '#4a3b2c') : ghost ? (c.ragC || '#2a2522') : c.skin;
  const legC = living ? (c.trouC || '#3d3934') : ghost ? mix(c.ragC || '#2a2522', '#000000', 0.2) : c.skin;
  const br = 1 + 0.05 * R.breath;
  const Leg = (k: 1 | -1) => (
    <group position={[k * H * 0.035, 0, 0]} rotation={[-(k > 0 ? R.hpLf : R.hpRf), 0, k * 0.04]}>
      <Bone len={thigh} r0={lr * 1.5} r1={lr * 1.1} c={legC} />
      <group position={[0, -thigh, 0]} rotation={[k > 0 ? R.knL : R.knR, 0, 0]}>
        <Bone len={shin} r0={lr * 1.25} r1={lr * 0.9} c={ghost ? c.skin : legC} />
        {ghost && <mesh position={[0, -shin * 0.12, 0]} material={M(legC, { side: 'double' })}><coneGeometry args={[lr * 2.6, shin * 0.35, 5, 1, true]} /></mesh>}
        <group position={[0, -shin, 0]} rotation={[-(k > 0 ? R.knL : R.knR) * 0.4 + (k > 0 ? R.hpLf : R.hpRf) * 0.3, 0, 0]}>
          {living ? <mesh position={[0, -lr, H * 0.035]} material={M('#1e1814')}><boxGeometry args={[lr * 3, lr * 2.2, H * 0.11]} /></mesh>
            : <group><mesh position={[0, -lr, H * 0.03]} material={M(c.skin)}><boxGeometry args={[lr * 2.6, lr * 1.6, H * 0.09]} /></mesh>{[-1, 0, 1].map((i) => <mesh key={i} position={[i * lr * 0.9, -lr * 1.3, H * 0.085]} rotation={[1.3, 0, 0]} material={M(c.skin)}><coneGeometry args={[lr * 0.4, H * 0.04, 4]} /></mesh>)}</group>}
        </group>
      </group>
    </group>
  );
  const Arm = (k: 1 | -1) => {
    const f = k > 0 ? R.shLf : R.shRf, o = k > 0 ? R.shLo : R.shRo, el = k > 0 ? R.elL : R.elR, cu = k > 0 ? R.curlL : R.curlR;
    return (
      <group position={[k * shW, torso - lr, 0]} rotation={[-f, 0, k * o]}>
        <Bone len={uA} r0={lr * 1.35} r1={lr * 1.0} c={living || ghost ? body : c.skin} />
        {ghost && <mesh position={[0, -uA * 0.55, 0]} material={M(body, { side: 'double' })}><coneGeometry args={[lr * 3.2, uA * 0.9, 5, 1, true]} /></mesh>}
        <group position={[0, -uA, 0]} rotation={[-el, 0, 0]}>
          <Bone len={lA} r0={lr * 1.1} r1={lr * 0.85} c={living ? body : c.skin} />
          {c.veins && !living && <Vein pts={[[lr * 0.8, -lA * 0.05, lr * 0.6], [lr * 1.0, -lA * 0.4, lr * 0.4], [lr * 0.6, -lA * 0.75, lr * 0.8], [lr * 0.7, -lA * 0.95, lr * 0.5]]} r={lr * 0.32} c={c.veinC || '#5a4a62'} />}
          {living && <mesh position={[0, -lA * 0.9, 0]} material={M(mix(body, '#000000', 0.3))}><cylinderGeometry args={[lr * 1.6, lr * 1.5, lA * 0.12, 6]} /></mesh>}
          <group position={[0, -lA, 0]}><mesh material={M(c.skin)} scale={lr * 1.2}><icosahedronGeometry args={[1, 0]} /></mesh><CHand c={c} R={lr * 1.05} curl={cu} t={t} seed={seed + k} side={k} /></group>
        </group>
      </group>
    );
  };
  return (
    <group position={at} rotation={[0, rot, 0]} scale={scale}>
      <group position={[0, hipY + R.y, R.z]}>
        <mesh material={M(legC)}><cylinderGeometry args={[H * 0.035, H * 0.045, H * 0.05, 6]} /></mesh>
        {Leg(1)}{Leg(-1)}
        {living && <mesh position={[0, -hipY * 0.3, 0]} material={M(body, { side: 'double' })}><cylinderGeometry args={[H * 0.05, H * 0.085, hipY * 0.7, 8, 1, true]} /></mesh>}
        {ghost && <Rags r={H * 0.045} len={hipY * 0.55} c={body} t={t} seed={seed} />}
        <group rotation={[R.spX, 0, R.spZ]}>
          <group scale={[br, 1, br]}>
            <mesh position={[0, torso * 0.5, 0]} scale={[1, 1, 0.6]} material={M(body)}><cylinderGeometry args={[shW * 0.95, H * 0.032, torso, 6]} /></mesh>
            {(ghost || c.dress === 'bare') && c.ribs && Array.from({ length: 5 }, (_, i) => <mesh key={i} position={[0, torso * (0.42 + i * 0.1), shW * 0.14]} rotation={[Math.PI / 2 + 0.2, 0, 0]} scale={[1, 0.62, 1]} material={M(mix(c.skin, '#2a2420', 0.35))}><torusGeometry args={[shW * (0.55 + i * 0.07), lr * 0.42, 3, 8, Math.PI * 0.9]} /></mesh>)}
            {ghost && <mesh position={[shW * 0.15, torso * 0.62, shW * 0.4]} rotation={[0, 0, 0.6]} material={M(body)}><boxGeometry args={[shW * 0.35, torso * 0.55, lr * 2]} /></mesh>}
            {living && [-1, 1].map((k) => <mesh key={k} position={[k * shW * 0.25, torso * 0.65, shW * 0.5]} rotation={[0, 0, k * 0.4]} material={M(mix(body, '#000000', 0.3))}><boxGeometry args={[shW * 0.25, torso * 0.5, lr * 1.2]} /></mesh>)}
            <mesh position={[0, torso, 0]} scale={[1, 0.35, 0.6]} material={M(body)}><icosahedronGeometry args={[shW, 0]} /></mesh>
          </group>
          {Arm(1)}{Arm(-1)}
          <group position={[0, torso, 0]} rotation={[R.nk, 0, 0]}>
            <mesh position={[0, neck / 2, 0]} material={M(c.skin)}><cylinderGeometry args={[lr * 1.1, lr * 1.5, neck, 5]} /></mesh>
            {[-1, 1].map((k) => <mesh key={k} position={[k * lr * 0.9, neck / 2, lr * 0.6]} rotation={[0, 0, -k * 0.12]} material={M(mix(c.skin, '#000000', 0.12))}><cylinderGeometry args={[lr * 0.35, lr * 0.45, neck, 3]} /></mesh>)}
            {living && <mesh position={[0, neck * 0.1, 0]} material={M(body)}><cylinderGeometry args={[lr * 2.6, shW * 0.6, neck * 0.45, 7]} /></mesh>}
            <group position={[0, neck + hr * 0.85, hr * 0.15]} rotation={[R.hdX + R.nk * -0.2, R.hdY, R.hdZ]}><Skull c={c} hr={hr} jaw={R.jaw} t={t} cloth={living} /></group>
          </group>
        </group>
      </group>
    </group>
  );
};
// approximate anchor points for tags (standing pose): head, hand, feet, top
export const cAnchors = (c: C3, at: V3 = [0, 0, 0], rot = 0) => {
  const H = c.height; const s = Math.sin(rot), co = Math.cos(rot); const tr = (x: number, y: number, z: number): V3 => [at[0] + x * co + z * s, at[1] + y, at[2] - x * s + z * co];
  return { head: tr(0, H * 0.84, H * 0.2), eye: tr(H * 0.02, H * 0.84, H * 0.25), hand: tr(H * 0.1, H * 0.28, H * 0.12), top: tr(0, H * 0.92, H * 0.15), feet: tr(0, 0, 0), chest: tr(0, H * 0.62, H * 0.08) };
};
export const _n = noise1;
