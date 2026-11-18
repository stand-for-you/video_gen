import React from 'react';
import * as THREE from 'three';
import { PAL, M, G, rng, sway, noise1, ss, seg, lerp, V3 } from './k3/core';
import { Night, Ground, Grass, Mist, Flakes, Halo } from './k3/World';
import { Forest, Pine, Rock, Bush, DeadTree } from './k3/Nature';
import { Window, Door } from './k3/Build';
import { Room, Bed, Table, Chair, Shelf, Crate, Rug } from './k3/Interior';
import { Candle } from './k3/Fx';
import { Person, mix, P3, Pose, Expr } from './k3/Person';
import { cRig, C3, CPose, HERBERT } from './k3/Creature';
import { CAST3 } from './Cast3D';
// ===== STORY KIT q: "EYELESS JACK" (engine v0.5). A farmhouse at the edge of a cornfield and a pine wood, autumn, 2010s.
// Palette: bruise-teal night + sodium porch amber, ONE red accent (the camera's record light, the hospital cross, a hoodie string).
// Everything is low-poly and flat shaded; the creature is built here (hoodie + mask are not in the fixed Creature builder).
export const EJ = { sky: '#0b1b21', fog: '#13272b', moonC: '#a6d6d2', amber: '#ffb35a', mask: '#2b4f9e', hood: '#0d0e13', skin: '#8e9094', red: '#b3221f' };
// ---------- light recipes
export const NightQ: React.FC<{ t: number; density?: number; moonI?: number; amb?: number; indoor?: boolean; disc?: any }> = ({ t, density = 0.06, moonI = 1.9, amb = 0.55, indoor = false, disc }) => (
  <Night t={t} sky={EJ.sky} fog={EJ.fog} density={density} moonC={EJ.moonC} moonI={moonI} amb={amb} ambC="#4a6a70" indoor={indoor} {...(disc !== undefined ? { disc } : {})} />
);
export const DayQ: React.FC<{ t: number; fog?: string; density?: number; moonI?: number }> = ({ t, fog = '#aab9ba', density = 0.03, moonI = 2.3 }) => (
  <Night t={t} sky={fog} fog={fog} density={density} moonC="#ffe4bc" moonI={moonI} amb={0.95} ambC="#c8d2d0" indoor disc={null} stars={false} rim={0.5} fill={0.6} />
);
// ---------- people (cast people with story notes; faces never change)
export const MITCH: P3 = CAST3.sam;                       // Mitch = Sam Carter (teen boy, green hoodie)
export const EDWIN: P3 = CAST3.noah;                      // Edwin = Noah Reed (the hero is the brother)
export const DOC: P3 = { ...CAST3.elias, id: 'doc', name: 'The Doctor', top: 'coat', topC: '#dde1e0', inner: '#7ea3a6', acc: [], botC: '#2a3238' }; // white coat: story reason
export const MOM: P3 = CAST3.rose; export const DAD: P3 = CAST3.tom;
// ---------- THE CREATURE: Eyeless Jack (original design built from the story's words)
// story words: humanoid, black hoodie, dark blue mask with no nose and no mouth, two empty eye sockets leaking a black liquid, claws.
export const JACK: C3 = { ...HERBERT, id: 'jack', name: 'EYELESS JACK', skin: EJ.skin, height: 2.05, hunch: 0.42, armL: 1.15, fingerL: 1.1, legL: 1.0, thin: 1.2, eyes: 'black', mouth: 'none', teeth: 0, veins: false, ribs: false, claws: '#15161a', dress: 'ghost', ragC: EJ.hood, scar: false };
const JB: React.FC<{ len: number; r0: number; r1?: number; c: string }> = ({ len, r0, r1, c }) => (<><mesh material={M(c)} scale={r0 * 1.5}><icosahedronGeometry args={[1, 0]} /></mesh><mesh position={[0, -len / 2, 0]} material={M(c)}><cylinderGeometry args={[r1 ?? r0 * 0.8, r0, len, 5]} /></mesh></>);
const JF: React.FC<{ len: number; r: number; curl: number; c: string; claw: string }> = ({ len, r, curl, c, claw }) => (
  <group rotation={[-curl * 0.6, 0, 0]}>
    <mesh position={[0, -len * 0.27, 0]} material={M(c)}><cylinderGeometry args={[r * 0.8, r, len * 0.55, 4]} /></mesh>
    <group position={[0, -len * 0.55, 0]} rotation={[-curl * 0.9, 0, 0]}>
      <mesh position={[0, -len * 0.22, 0]} material={M(c)}><cylinderGeometry args={[r * 0.6, r * 0.8, len * 0.45, 4]} /></mesh>
      <mesh position={[0, -len * 0.5, r * 0.2]} rotation={[0.25, 0, 0]} material={M(claw, { r: 0.4 })}><coneGeometry args={[r * 0.65, len * 0.24, 4]} /></mesh>
    </group>
  </group>
);
const JH: React.FC<{ R: number; curl: number; t: number; seed: number; side: 1 | -1 }> = ({ R, curl, t, seed, side }) => {
  const fl = R * 9 * JACK.fingerL;
  return (<group>
    <mesh position={[0, -R * 1.4, 0]} scale={[1, 1, 0.45]} material={M(JACK.skin)}><boxGeometry args={[R * 3, R * 2.8, R * 1.6]} /></mesh>
    {[-1.5, -0.5, 0.5, 1.5].map((k, i) => <group key={i} position={[k * R * 0.85, -R * 2.7, 0]} rotation={[0, 0, k * 0.07]}><JF len={fl * (1 - Math.abs(k) * 0.08)} r={R * 0.38} curl={curl + sway(t, 1.3 + i * 0.27, 0.12, seed + i)} c={JACK.skin} claw={JACK.claws} /></group>)}
    <group position={[side * R * 1.5, -R * 1.2, R * 0.4]} rotation={[0.3, 0, side * 0.7]}><JF len={fl * 0.6} r={R * 0.38} curl={curl * 0.6} c={JACK.skin} claw={JACK.claws} /></group>
  </group>);
};
const JackHead: React.FC<{ hr: number; t: number; drip: number }> = ({ hr, t, drip }) => (
  <group>
    <mesh position={[0, hr * 0.1, -hr * 0.08]} scale={[hr * 0.86, hr * 1.02, hr * 0.92]} material={M(JACK.skin)}><icosahedronGeometry args={[1, 1]} /></mesh>
    {/* the hood: covers the back and the sides, open at the front */}
    <mesh position={[0, hr * 0.12, -hr * 0.1]} scale={[hr * 1.2, hr * 1.28, hr * 1.22]} material={M(EJ.hood, { side: 'double' })}><sphereGeometry args={[1, 10, 8, Math.PI * 0.5 + 0.85, Math.PI * 2 - 1.7, 0, Math.PI * 0.82]} /></mesh>
    <mesh position={[0, hr * 0.12, hr * 0.5]} rotation={[0, 0, 0]} material={M(mix(EJ.hood, '#1c2030', 0.4))}><torusGeometry args={[hr * 1.0, hr * 0.13, 4, 12]} /></mesh>
    {/* the blue mask: smooth, NO nose, NO mouth */}
    <mesh position={[0, hr * 0.04, hr * 0.5]} scale={[hr * 0.84, hr * 1.0, hr * 0.62]} material={M(EJ.mask, { r: 0.55 })}><icosahedronGeometry args={[1, 1]} /></mesh>
    <mesh position={[0, -hr * 0.62, hr * 0.62]} scale={[hr * 0.5, hr * 0.06, hr * 0.3]} material={M(mix(EJ.mask, '#000000', 0.45))}><icosahedronGeometry args={[1, 0]} /></mesh>
    {[-1, 1].map((k) => (<group key={k}>
      <mesh position={[k * hr * 0.31, hr * 0.14, hr * 1.0]} scale={[hr * 0.3, hr * 0.36, hr * 0.12]} material={M('#0a1634')}><icosahedronGeometry args={[1, 1]} /></mesh>
      <mesh position={[k * hr * 0.31, hr * 0.14, hr * 1.07]} scale={[hr * 0.22, hr * 0.28, hr * 0.1]} material={G('#000000')}><icosahedronGeometry args={[1, 1]} /></mesh>
      {(() => { const L = hr * (0.5 + 0.55 * (0.5 + 0.5 * Math.sin(t * 0.8 + k * 1.7))) * drip; const ph = ((t * 0.45 + (k > 0 ? 0.37 : 0)) % 1); return (<>
        <mesh position={[k * hr * 0.31, hr * 0.14 - hr * 0.3 - L / 2, hr * 1.1]} material={M('#050506', { r: 0.15 })}><cylinderGeometry args={[hr * 0.04, hr * 0.065, L, 4]} /></mesh>
        <mesh position={[k * hr * 0.31, hr * 0.14 - hr * 0.3 - L - ph * hr * 1.4, hr * 1.1]} scale={hr * 0.05 * (1 - ph * 0.6)} material={M('#050506', { r: 0.15 })}><icosahedronGeometry args={[1, 0]} /></mesh></>); })()}
    </group>))}
  </group>
);
export type JackP = { at?: V3; rot?: number; t: number; pose?: CPose; pose2?: CPose; at2?: number; blend?: number; seed?: number; speed?: number; travel?: boolean; p?: number; look?: [number, number]; scale?: number; drip?: number };
export const Jack: React.FC<JackP> = ({ at = [0, 0, 0], rot = 0, t, pose = 'stand', pose2, at2 = 1, blend = 0.7, seed = 3, speed, travel, p, look, scale = 1, drip = 1 }) => {
  const c = JACK; let R = cRig(pose, t, c, { speed, seed, travel, p });
  if (pose2) { const B = cRig(pose2, t, c, { speed, seed, travel, p }); const k = ss((t - at2) / blend); const o: any = {}; for (const key in R) o[key] = lerp((R as any)[key], (B as any)[key], k); R = o; }
  if (look) { R.hdY += look[0]; R.hdX += look[1]; }
  const H = c.height, hipY = H * 0.46 * c.legL / 1.14, thigh = hipY * 0.5, shin = hipY * 0.48, torso = H * 0.27, neck = H * 0.065, hr = H * 0.07;
  const lr = H * 0.012 * c.thin, shW = H * 0.085, uA = H * 0.2 * c.armL / 1.3, lA = H * 0.19 * c.armL / 1.3; const br = 1 + 0.05 * R.breath;
  const jeans = '#1b1d26';
  const Leg = (k: 1 | -1) => (
    <group position={[k * H * 0.035, 0, 0]} rotation={[-(k > 0 ? R.hpLf : R.hpRf), 0, k * 0.04]}>
      <JB len={thigh} r0={lr * 1.5} r1={lr * 1.1} c={jeans} />
      <group position={[0, -thigh, 0]} rotation={[k > 0 ? R.knL : R.knR, 0, 0]}>
        <JB len={shin} r0={lr * 1.25} r1={lr * 0.9} c={jeans} />
        <group position={[0, -shin, 0]} rotation={[-(k > 0 ? R.knL : R.knR) * 0.4 + (k > 0 ? R.hpLf : R.hpRf) * 0.3, 0, 0]}><mesh position={[0, -lr, H * 0.035]} material={M('#0e0e10')}><boxGeometry args={[lr * 3, lr * 2.2, H * 0.11]} /></mesh></group>
      </group>
    </group>
  );
  const Arm = (k: 1 | -1) => {
    const f = k > 0 ? R.shLf : R.shRf, o = k > 0 ? R.shLo : R.shRo, el = k > 0 ? R.elL : R.elR, cu = k > 0 ? R.curlL : R.curlR;
    return (
      <group position={[k * shW, torso - lr, 0]} rotation={[-f, 0, k * o]}>
        <JB len={uA} r0={lr * 1.7} r1={lr * 1.3} c={EJ.hood} />
        <group position={[0, -uA, 0]} rotation={[-el, 0, 0]}>
          <JB len={lA} r0={lr * 1.5} r1={lr * 1.1} c={EJ.hood} />
          <mesh position={[0, -lA * 0.95, 0]} material={M(mix(EJ.hood, '#2a2e3c', 0.4))}><cylinderGeometry args={[lr * 1.7, lr * 1.6, lA * 0.1, 6]} /></mesh>
          <group position={[0, -lA, 0]}><mesh material={M(JACK.skin)} scale={lr * 1.2}><icosahedronGeometry args={[1, 0]} /></mesh><JH R={lr * 1.05} curl={cu} t={t} seed={seed + k} side={k} /></group>
        </group>
      </group>
    );
  };
  return (
    <group position={at} rotation={[0, rot, 0]} scale={scale}>
      <group position={[0, hipY + R.y, R.z]}>
        <mesh material={M(jeans)}><cylinderGeometry args={[H * 0.035, H * 0.045, H * 0.05, 6]} /></mesh>
        {Leg(1)}{Leg(-1)}
        <group rotation={[R.spX, 0, R.spZ]}>
          <group scale={[br, 1, br]}>
            <mesh position={[0, torso * 0.5, 0]} scale={[1, 1, 0.66]} material={M(EJ.hood)}><cylinderGeometry args={[shW * 1.05, H * 0.04, torso, 7]} /></mesh>
            <mesh position={[0, torso * 0.2, shW * 0.5]} material={M(mix(EJ.hood, '#222634', 0.35))}><boxGeometry args={[shW * 1.3, torso * 0.26, shW * 0.16]} /></mesh>
            {[-1, 1].map((k) => <mesh key={k} position={[k * shW * 0.14, torso * 0.62, shW * 0.62]} material={M(EJ.red)}><boxGeometry args={[shW * 0.05, torso * 0.2, shW * 0.05]} /></mesh>)}
            <mesh position={[0, torso, -shW * 0.2]} scale={[1.15, 0.5, 0.8]} material={M(EJ.hood)}><icosahedronGeometry args={[shW, 0]} /></mesh>
          </group>
          {Arm(1)}{Arm(-1)}
          <group position={[0, torso, 0]} rotation={[R.nk, 0, 0]}>
            <mesh position={[0, neck / 2, 0]} material={M(JACK.skin)}><cylinderGeometry args={[lr * 1.2, lr * 1.6, neck, 5]} /></mesh>
            <group position={[0, neck + hr * 0.85, hr * 0.15]} rotation={[R.hdX + R.nk * -0.2, R.hdY, R.hdZ]}><JackHead hr={hr} t={t} drip={drip} /></group>
          </group>
        </group>
      </group>
    </group>
  );
};
// ---------- props
export const CamProp: React.FC<{ at: V3; rot?: V3; s?: number; t: number; flash?: number }> = ({ at, rot = [0, 0, 0], s = 1, t, flash = 0 }) => (
  <group position={at} rotation={rot} scale={s}>
    <mesh material={M('#2a2b30', { r: 0.5 })}><boxGeometry args={[0.15, 0.09, 0.07]} /></mesh>
    <mesh position={[0, 0, 0.06]} rotation={[Math.PI / 2, 0, 0]} material={M('#111216')}><cylinderGeometry args={[0.032, 0.036, 0.06, 8]} /></mesh>
    <mesh position={[0, 0, 0.092]} rotation={[Math.PI / 2, 0, 0]} material={G('#1b2c3a')}><cylinderGeometry args={[0.024, 0.024, 0.006, 8]} /></mesh>
    <mesh position={[-0.05, 0.035, 0.036]} material={G('#f2f2ea')}><boxGeometry args={[0.03, 0.018, 0.006]} /></mesh>
    <mesh position={[0.058, 0.03, 0.036]} material={G(EJ.red)}><boxGeometry args={[0.012, 0.012, 0.006]} /></mesh>
    {flash > 0 && <Halo at={[-0.05, 0.035, 0.1]} r={0.9 * flash} c="#e8f2ff" o={0.45 * flash} t={t} />}
  </group>
);
const Mantel: React.FC<{ at: V3; t: number }> = ({ at, t }) => (
  <group position={at}>
    <mesh position={[0, 0.9, 0]} material={M('#3a2c20')}><boxGeometry args={[0.5, 0.06, 1.3]} /></mesh>
    {[-0.55, 0.55].map((z, i) => <mesh key={i} position={[0, 0.45, z]} material={M('#3a2c20')}><boxGeometry args={[0.1, 0.9, 0.1]} /></mesh>)}
    <CamProp at={[0, 0.98, 0.2]} rot={[0, 1.2, 0]} s={1.5} t={t} />
    <mesh position={[0.02, 0.96, -0.35]} material={M('#4a3a2c')}><boxGeometry args={[0.18, 0.04, 0.12]} /></mesh>
  </group>
);
// ---------- the bedroom (Edwin's spare room): plank walls, a moonlit window with curtains, moving boxes, a bed, the mantel with the camera
export const Bedroom: React.FC<{ t: number; win?: number; lamp?: boolean; day?: boolean }> = ({ t, win = 0, lamp = true, day = false }) => {
  const sway2 = (s: number) => sway(t, 3.4, 0.05 + 0.12 * win, s);
  return (
    <group>
      <Room w={5.2} d={5} h={2.6} wall="plank" wallC="#4b5b57" floorC="#3a322c" beams={false} window={{ x: -1.1, moon: !day, w: 0.9, h: 1.3 }} t={t} seed={4} />
      {win > 0 && <>
        <mesh position={[-1.1, 1.43, -2.38]} material={G('#02080a')}><boxGeometry args={[0.9, 1.3, 0.03]} /></mesh>
        <group position={[-1.55, 2.08, -2.34]} rotation={[-0.2 - win * 1.1, 0, 0]}><mesh position={[0, -0.6, 0]} material={M('#2e2218')}><boxGeometry args={[0.46, 1.2, 0.04]} /></mesh></group>
        <pointLight position={[-1.1, 1.3, -1.7]} intensity={2.2 * win} distance={6} decay={1.5} color={EJ.moonC} />
      </>}
      {[-1.78, -0.42].map((x, i) => <group key={i} position={[x, 2.2, -2.3]} rotation={[0, 0, sway2(i + 2) * (i ? -1 : 1)]}><mesh position={[0, -0.82, 0.04 + win * 0.18 * (i ? 1 : 1)]} rotation={[sway2(i + 5) * 0.5 * win, 0, 0]} material={M('#2a4048', { side: 'double' })}><boxGeometry args={[0.52, 1.64, 0.03]} /></mesh></group>)}
      <Bed at={[1.0, 0, -1.0]} t={t} c="#3a2c20" blanket="#4a6068" bump={0} breathe={false} />
      <Mantel at={[-2.4, 0, 0.7]} t={t} />
      <Crate at={[-1.7, 0, 1.4]} s={0.7} rot={0.3} /><Crate at={[-1.5, 0.7, 1.45]} s={0.5} rot={-0.2} /><Crate at={[1.9, 0, 1.8]} s={0.6} rot={0.5} />
      <Rug at={[0.1, 0.012, 0.9]} w={2.4} d={1.5} c="#33474a" c2="#6a7a72" />
      <mesh position={[2.35, 0.3, -0.2]} material={M('#3a2c20')}><boxGeometry args={[0.4, 0.6, 0.4]} /></mesh>
      {lamp && <><mesh position={[2.35, 0.66, -0.2]} material={M('#6a5a40')}><cylinderGeometry args={[0.07, 0.09, 0.1, 6]} /></mesh><pointLight position={[2.3, 0.9, -0.1]} intensity={0.9} distance={4} decay={1.6} color={EJ.amber} /></>}
      <Mist t={t} n={2} area={[-2, 2, -2, 2]} y={0.5} o={0.06} size={4} />
    </group>
  );
};
// Mitch lying in the bed (head toward the back wall). The pose pivot is calibrated in the gallery stills.
export const MitchInBed: React.FC<{ t: number; expr?: Expr; sit?: number }> = ({ t, expr = 'sleepy', sit = 0 }) => (
  <Person s={MITCH} at={[1.0, 0.56, -0.2]} rot={0} t={t} pose={sit > 0.5 ? 'sit' : 'lie'} expr={expr} seed={3} />
);
// ---------- the farmhouse seen from outside
export const Farmhouse: React.FC<{ t: number; lit?: number; porch?: boolean; day?: boolean }> = ({ t, lit = 1, porch = true, day = false }) => {
  const w = 7, d = 5, h = 4.6; const slat = '#8e9d96', roof = '#2a3034';
  return (
    <group>
      <mesh position={[0, h / 2, 0]} material={M(slat)}><boxGeometry args={[w, h, d]} /></mesh>
      {[0.9, 1.6, 2.3, 3.0, 3.7].map((y, i) => <mesh key={i} position={[0, y, d / 2 + 0.01]} material={M(mix(slat, '#000000', 0.18))}><boxGeometry args={[w + 0.06, 0.05, 0.02]} /></mesh>)}
      {[-1, 1].map((k) => <mesh key={k} position={[k * (w / 2 + 0.55), h + 0.8, 0]} rotation={[0, 0, -k * 0.62]} material={M(roof)}><boxGeometry args={[w * 0.62, 0.16, d + 0.7]} /></mesh>)}
      <mesh position={[2.4, h + 1.3, -1.2]} material={M('#5a4a46')}><boxGeometry args={[0.7, 1.6, 0.7]} /></mesh>
      <Window at={[-2.1, 1.7, d / 2 + 0.04]} w={1.0} h={1.3} lit={lit} t={t} seed={1} light={0} frame="#e0e4dc" />
      <Window at={[2.1, 1.7, d / 2 + 0.04]} w={1.0} h={1.3} lit={lit * 0.0} t={t} seed={2} light={0} frame="#e0e4dc" />
      <Window at={[-2.1, 3.7, d / 2 + 0.04]} w={1.0} h={1.2} lit={0} t={t} seed={3} light={0} frame="#e0e4dc" />
      <Window at={[2.1, 3.7, d / 2 + 0.04]} w={1.0} h={1.2} lit={0} t={t} seed={4} light={0} frame="#e0e4dc" />
      <Door at={[0, 0, d / 2 + 0.04]} w={1.1} h={2.2} lit={0} t={t} c="#4a3a2c" />
      {porch && <group position={[0, 0, d / 2 + 0.9]}>
        <mesh position={[0, 0.12, 0]} material={M('#5a4a3a')}><boxGeometry args={[3.2, 0.24, 1.8]} /></mesh>
        {[-1.5, 1.5].map((x, i) => <mesh key={i} position={[x, 1.2, 0.8]} material={M('#e0e4dc')}><boxGeometry args={[0.12, 2.1, 0.12]} /></mesh>)}
        <mesh position={[0, 2.3, 0]} material={M(roof)}><boxGeometry args={[3.5, 0.12, 2.1]} /></mesh>
        <mesh position={[0, 2.05, 0.2]} material={G(EJ.amber)}><sphereGeometry args={[0.1, 6, 5]} /></mesh>
        <pointLight position={[0, 1.9, 0.4]} intensity={3.2} distance={9} decay={1.5} color={EJ.amber} />
        <Halo at={[0, 2.05, 0.3]} r={1.1} c={EJ.amber} o={0.3} t={t} />
      </group>}
    </group>
  );
};
// the yard: ground, a tall cornfield beside the house, pines behind, a rustling bush
export const Yard: React.FC<{ t: number; rustle?: number; day?: boolean }> = ({ t, rustle = 1, day = false }) => (
  <group>
    <Ground flat={14} c={day ? '#4a5a44' : '#17251f'} hill={0.7} />
    <Forest t={t} n={34} area={[-34, 34, -34, -14]} seed={21} dead={0.1} />
    <Grass t={t} n={700} area={[6, 22, -14, 8]} h={1.7} c={day ? '#a39a58' : '#5a5e3a'} wind={1.3} seed={8} />
    <Grass t={t} n={500} area={[-12, 6, 4, 12]} h={0.5} c={day ? '#6a7a52' : '#3e5640'} wind={1.0} seed={9} />
    <group position={[-4.6, 0, 3.6]} rotation={[0, 0, sway(t, 0.9, 0.05 * rustle, 2)]}><Bush at={[0, 0, 0]} s={1.5} t={t * (1 + rustle * 2.2)} seed={4} /></group>
    <Bush at={[-3.0, 0, 3.8]} s={1.1} t={t} seed={6} /><Bush at={[3.4, 0, 3.6]} s={1.2} t={t} seed={7} />
    <mesh position={[0, 0.02, 9]} rotation={[-Math.PI / 2, 0, 0]} material={M('#2c2a26')}><planeGeometry args={[3.2, 10]} /></mesh>
    {!day && <Mist t={t} n={6} area={[-14, 14, -10, 10]} y={0.4} o={0.15} size={8} />}
  </group>
);
// ---------- the kitchen (morning)
export const Kitchen: React.FC<{ t: number }> = ({ t }) => (
  <group>
    <Room w={5.6} d={4.6} h={2.7} wall="plank" wallC="#b3ab94" floorC="#6a5844" beams={false} window={{ x: 0.2, moon: false, w: 1.4, h: 1.1 }} t={t} seed={6} />
    <mesh position={[0.2, 1.5, -2.2]} material={G('#cfe2e0')}><boxGeometry args={[1.38, 1.08, 0.03]} /></mesh>
    <Table at={[-0.3, 0, -0.6]} w={1.6} d={0.9} /><Chair at={[-1.4, 0, -0.5]} rot={1.57} /><Chair at={[0.9, 0, -0.5]} rot={-1.57} />
    <mesh position={[-2.25, 0.45, -0.6]} material={M('#d8d6cc')}><boxGeometry args={[0.6, 0.9, 3.4]} /></mesh>
    <mesh position={[-2.25, 0.93, -0.6]} material={M('#5a5a56')}><boxGeometry args={[0.66, 0.05, 3.5]} /></mesh>
    <mesh position={[-2.2, 1.1, -1.4]} material={M('#1d1e22')}><boxGeometry args={[0.28, 0.32, 0.22]} /></mesh>
    <mesh position={[-2.2, 1.28, -1.4]} material={G(EJ.red)}><boxGeometry args={[0.03, 0.03, 0.03]} /></mesh>
    <mesh position={[-0.2, 0.82, -0.4]} material={M('#e8e4d6')}><cylinderGeometry args={[0.05, 0.04, 0.09, 8]} /></mesh>
    <Crate at={[2.1, 0, 1.2]} s={0.7} rot={0.2} />
  </group>
);
// ---------- the hospital room
export const Hospital: React.FC<{ t: number; day?: boolean }> = ({ t, day = false }) => (
  <group>
    <Room w={5.4} d={4.8} h={2.7} wall="plank" wallC="#7e9b93" floorC="#6a6c68" beams={false} window={{ x: 1.4, moon: !day, w: 1.1, h: 1.2 }} t={t} seed={7} />
    {day && <mesh position={[1.4, 1.5, -2.35]} material={G('#c8dcdc')}><boxGeometry args={[1.08, 1.18, 0.03]} /></mesh>}
    <Bed at={[-0.8, 0, -1.0]} t={t} c="#aab2b4" blanket="#dfe6e4" bump={0} breathe={false} />
    <mesh position={[-2.55, 1.9, -0.6]} material={G('#d8e4e2')}><boxGeometry args={[0.05, 0.62, 0.62]} /></mesh>
    <mesh position={[-2.51, 1.9, -0.6]} material={G(EJ.red)}><boxGeometry args={[0.03, 0.46, 0.12]} /></mesh><mesh position={[-2.51, 1.9, -0.6]} material={G(EJ.red)}><boxGeometry args={[0.03, 0.12, 0.46]} /></mesh>
    <group position={[-1.9, 0, -1.8]}>
      <mesh position={[0, 1.0, 0]} material={M('#9aa6a8')}><cylinderGeometry args={[0.025, 0.025, 2.0, 5]} /></mesh>
      <mesh position={[0, 1.95, 0]} material={G('#cfe6e0', 0.8)}><boxGeometry args={[0.16, 0.26, 0.05]} /></mesh>
    </group>
    <group position={[0.7, 1.4, -2.3]}>
      <mesh material={M('#1d2226')}><boxGeometry args={[0.5, 0.34, 0.18]} /></mesh>
      <mesh position={[0, 0, 0.1]} material={G('#0a1a12')}><boxGeometry args={[0.44, 0.26, 0.01]} /></mesh>
      {Array.from({ length: 20 }, (_, i) => <mesh key={i} position={[-0.2 + i * 0.02, 0.02 * Math.sin(i * 0.7 + t * 4), 0.108]} material={G('#3fe08a')}><boxGeometry args={[0.012, 0.012, 0.004]} /></mesh>)}
      <mesh position={[0.2, 0.12, 0.108]} material={G(EJ.red)}><boxGeometry args={[0.02, 0.02, 0.004]} /></mesh>
    </group>
    <mesh position={[2.0, 0.3, 1.2]} material={M('#a9b0ae')}><boxGeometry args={[0.5, 0.6, 0.5]} /></mesh>
  </group>
);
// ---------- hallway of Edwin's house (we look down the corridor); the dark bundle lies on the floor
export const Hallway: React.FC<{ t: number; bundle?: boolean; open?: number }> = ({ t, bundle = true, open = 1 }) => (
  <group>
    <Room w={2.8} d={8} h={2.6} wall="plank" wallC="#8a8f84" floorC="#4a3c30" beams={false} window={{ x: 0, moon: false, w: 0.9, h: 1.2 }} t={t} seed={9} />
    <mesh position={[0, 1.55, -3.95]} material={G('#c5d5d4')}><boxGeometry args={[0.88, 1.18, 0.03]} /></mesh>
    <group position={[-1.4, 0, -1.2]} rotation={[0, Math.PI / 2, 0]}><Door at={[0, 0, 0]} w={0.95} h={2.1} open={open} lit={1} t={t} c="#e0e0d6" /></group>
    <mesh position={[1.36, 1.4, -0.8]} rotation={[0, -Math.PI / 2, 0]} material={M('#6a5a44')}><boxGeometry args={[0.5, 0.65, 0.04]} /></mesh>
    <mesh position={[-0.2, 0.012, 1.0]} rotation={[-Math.PI / 2, 0, 0.05]} material={M('#5a4a3a')}><planeGeometry args={[1.0, 5.2]} /></mesh>
    {bundle && <Bundle at={[0.15, 0, -0.4]} t={t} />}
    <Flakes t={t} n={60} kind="dust" box={[-1.2, 1.2, 0.3, 2.4, -3, 3]} size={0.025} />
  </group>
);
// a small dark bundle of cloth with black liquid on it (never an organ; it is only suggested)
export const Bundle: React.FC<{ at: V3; t: number; s?: number }> = ({ at, t, s = 1 }) => (
  <group position={at} scale={s}>
    <mesh position={[0, 0.06, 0]} scale={[0.15, 0.08, 0.1]} rotation={[0, 0.4, 0]} material={M('#241c22', { r: 0.6 })}><icosahedronGeometry args={[1, 1]} /></mesh>
    <mesh position={[0.05, 0.1, 0.02]} scale={[0.08, 0.05, 0.06]} material={M('#1a1418', { r: 0.4 })}><icosahedronGeometry args={[1, 0]} /></mesh>
    <mesh position={[0.02, 0.006, 0.0]} rotation={[-Math.PI / 2, 0, 0.5]} scale={[1 + 0.03 * Math.sin(t * 0.8), 1, 1]} material={M('#050506', { r: 0.15 })}><circleGeometry args={[0.2, 7]} /></mesh>
    <mesh position={[-0.2, 0.006, 0.08]} rotation={[-Math.PI / 2, 0, 1]} material={M('#050506', { r: 0.15 })}><circleGeometry args={[0.07, 6]} /></mesh>
  </group>
);
// ---------- the parents' car (low-poly) and the inside of it
export const Car: React.FC<{ at?: V3; rot?: number; t: number; lights?: boolean }> = ({ at = [0, 0, 0], rot = 0, t, lights = true }) => (
  <group position={at} rotation={[0, rot, 0]}>
    <mesh position={[0, 0.55, 0]} material={M('#4a5a6a', { r: 0.45, m: 0.3 })}><boxGeometry args={[1.8, 0.7, 4.3]} /></mesh>
    <mesh position={[0, 1.1, -0.2]} material={M('#3e4c5a', { r: 0.45, m: 0.3 })}><boxGeometry args={[1.65, 0.5, 2.4]} /></mesh>
    <mesh position={[0, 1.12, -0.2]} material={G('#0c1418')}><boxGeometry args={[1.69, 0.36, 2.2]} /></mesh>
    {[[-0.9, 1.4], [0.9, 1.4], [-0.9, -1.4], [0.9, -1.4]].map(([x, z], i) => <mesh key={i} position={[x, 0.32, z]} rotation={[0, 0, Math.PI / 2]} material={M('#0e0e10')}><cylinderGeometry args={[0.34, 0.34, 0.22, 9]} /></mesh>)}
    {[-0.6, 0.6].map((x, i) => <mesh key={i} position={[x, 0.65, 2.16]} material={G(lights ? '#ffe6b0' : '#556')}><boxGeometry args={[0.3, 0.14, 0.04]} /></mesh>)}
    {lights && <pointLight position={[0, 0.7, 3]} intensity={1.6} distance={7} decay={1.5} color="#ffe0a8" />}
  </group>
);
export const CarInside: React.FC<{ t: number }> = ({ t }) => {
  const q = rng(5); const trees = Array.from({ length: 12 }, (_, i) => [q() * 30, 4 + q() * 8, 1.4 + q() * 2.4]);
  return (
    <group>
      <mesh position={[0, 0.1, 0.4]} material={M('#1a1c20')}><boxGeometry args={[2.0, 0.1, 4]} /></mesh>
      <mesh position={[0, 1.7, 0.4]} material={M('#2a2c32')}><boxGeometry args={[2.0, 0.1, 4]} /></mesh>
      <mesh position={[0, 0.5, 1.25]} material={M('#3a3d44')}><boxGeometry args={[1.6, 0.45, 0.6]} /></mesh>
      <mesh position={[0, 1.0, 1.55]} material={M('#3a3d44')}><boxGeometry args={[1.6, 0.8, 0.14]} /></mesh>
      {[-0.45, 0.45].map((x, i) => <group key={i}><mesh position={[x, 0.85, -0.55]} material={M('#33363c')}><boxGeometry args={[0.55, 0.9, 0.2]} /></mesh><mesh position={[x, 1.42, -0.55]} material={M('#2a2d32')}><boxGeometry args={[0.3, 0.26, 0.16]} /></mesh></group>)}
      {[-1, 1].map((k) => <group key={k}>
        <mesh position={[k * 1.0, 1.1, 0.4]} material={M('#1c1e22')}><boxGeometry args={[0.06, 1.1, 4]} /></mesh>
        <mesh position={[k * 1.02, 1.05, 0.4]} material={G('#0d1a1f')}><boxGeometry args={[0.02, 0.62, 2.8]} /></mesh>
        {trees.map(([z, h, off], i) => { const zz = ((z + t * 7 + (k > 0 ? 9 : 0)) % 32) - 14; return <mesh key={i} position={[k * (2.2 + off), h * 0.3, zz * 0.4]} material={M('#112019')}><coneGeometry args={[0.9, h, 5]} /></mesh>; })}
      </group>)}
      <pointLight position={[0, 1.55, 0.3]} intensity={0.8} distance={4} decay={1.5} color="#9fc8c8" />
    </group>
  );
};
// the question card of the Reel (calm last picture, the question is also the last subtitle)
export const OutroYard: React.FC<{ t: number }> = ({ t }) => (<><NightQ t={t} density={0.07} moonI={1.8} /><Yard t={t} rustle={0.6} /><Farmhouse t={t} lit={1} /></>);
export { Person, Night, Ground, Grass, Mist, Flakes, Halo, Forest, Pine, Rock, Bush, DeadTree, Window, Door, Room, Bed, Table, Chair, Shelf, Crate, Rug, Candle, CAST3 };
