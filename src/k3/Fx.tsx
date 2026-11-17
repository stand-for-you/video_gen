import React, { useMemo } from 'react';
import { M, G, PAL, rng, flick, noise1, sway, V3 } from './core';
import { Halo } from './World';
// ===== FIRE, LIGHT AND BLOOD EFFECTS (low-poly). Fixed engine file.
// Flames are faceted cones that stretch and lean smoothly (noise), with a warm point light that flickers smoothly. Never strobes.
export const Flame: React.FC<{ at?: V3; s?: number; t: number; seed?: number; light?: number; dist?: number; halo?: number }> = ({ at = [0, 0, 0], s = 1, t, seed = 1, light = 2.2, dist = 6, halo = 0.6 }) => {
  const k = flick(t, seed, 0.3);
  const lean = noise1(t * 2.2, seed + 7) * 0.25, lean2 = noise1(t * 2.6, seed + 9) * 0.25;
  return (
    <group position={at} scale={s}>
      <group rotation={[lean2, 0, lean]}>
        <mesh position={[0, 0.13 * k, 0]} scale={[1, k, 1]} material={G(PAL.fire, 0.88)}><coneGeometry args={[0.055, 0.27, 6]} /></mesh>
        <mesh position={[0, 0.085 * k, 0]} scale={[1, k * 0.85, 1]} material={G(PAL.fireCore)}><coneGeometry args={[0.03, 0.16, 6]} /></mesh>
        <mesh position={[0.022, 0.1, 0.012]} rotation={[0, 0, -0.35 + lean]} scale={[1, 0.7 + 0.3 * flick(t, seed + 2), 1]} material={G(PAL.ember, 0.8)}><coneGeometry args={[0.025, 0.16, 5]} /></mesh>
      </group>
      {light > 0 && <pointLight position={[0, 0.25, 0]} intensity={light * k} distance={dist} decay={1.6} color={PAL.winGlow} />}
      {halo > 0 && <Halo at={[0, 0.18, 0]} r={0.34 * halo} o={0.4} t={t} seed={seed} />}
    </group>
  );
};
export const Torch: React.FC<{ at?: V3; t: number; seed?: number; light?: number; rot?: V3 }> = ({ at = [0, 0, 0], t, seed = 1, light = 3, rot = [0, 0, 0] }) => (
  <group position={at} rotation={rot}>
    <mesh position={[0, -0.32, 0]} material={M(PAL.woodDark)}><cylinderGeometry args={[0.025, 0.035, 0.75, 5]} /></mesh>
    <mesh position={[0, 0.04, 0]} material={M('#2a1a10')}><cylinderGeometry args={[0.05, 0.035, 0.12, 6]} /></mesh>
    <Flame at={[0, 0.08, 0]} s={1.15} t={t} seed={seed} light={light} dist={9} halo={1.1} />
  </group>
);
export const Candle: React.FC<{ at?: V3; t: number; seed?: number; light?: number; h?: number; holder?: boolean }> = ({ at = [0, 0, 0], t, seed = 3, light = 1.6, h = 0.18, holder = true }) => (
  <group position={at}>
    {holder && <mesh position={[0, 0.01, 0]} material={M('#6a5a40', { r: 0.4, m: 0.5 })}><cylinderGeometry args={[0.08, 0.09, 0.02, 8]} /></mesh>}
    <mesh position={[0, h / 2 + 0.02, 0]} material={M('#e8dcc0')}><cylinderGeometry args={[0.025, 0.028, h, 7]} /></mesh>
    <Flame at={[0, h + 0.02, 0]} s={0.45} t={t} seed={seed} light={light} dist={5} halo={0.8} />
  </group>
);
export const Lantern: React.FC<{ at?: V3; t: number; seed?: number; light?: number }> = ({ at = [0, 0, 0], t, seed = 5, light = 2.4 }) => (
  <group position={at}>
    <mesh position={[0, 0.2, 0]} material={M('#1e1a16', { m: 0.6, r: 0.5 })}><torusGeometry args={[0.06, 0.008, 4, 8]} /></mesh>
    <mesh position={[0, 0.12, 0]} material={M('#2a241c', { m: 0.5 })}><coneGeometry args={[0.1, 0.07, 6]} /></mesh>
    <mesh position={[0, 0, 0]} material={G('#ffc070', 0.55)}><cylinderGeometry args={[0.075, 0.075, 0.17, 6]} /></mesh>
    <mesh position={[0, -0.1, 0]} material={M('#2a241c', { m: 0.5 })}><cylinderGeometry args={[0.09, 0.09, 0.03, 6]} /></mesh>
    <Flame at={[0, -0.06, 0]} s={0.35} t={t} seed={seed} light={light} dist={7} halo={1.2} />
  </group>
);
// big fire: a cluster of flames + embers + smoke, for a burning cabin or bonfire
export const BigFire: React.FC<{ at?: V3; t: number; w?: number; d?: number; h?: number; n?: number; seed?: number; light?: number }> = ({ at = [0, 0, 0], t, w = 3, d = 2, h = 2.2, n = 26, seed = 7, light = 14 }) => {
  const q = useMemo(() => { const r = rng(seed); return Array.from({ length: n }, () => [r(), r(), r(), r()]); }, [n, seed]);
  const k = flick(t, seed, 0.25);
  return (
    <group position={at}>
      {q.map(([a, b, c, e], i) => { const x = (a - 0.5) * w, z = (b - 0.5) * d; const s = h * (0.3 + c * 0.5) * (0.75 + 0.35 * flick(t + i, seed + i, 0.5)); const lean = noise1(t * 1.8 + i, seed + i) * 0.3; return (
        <group key={i} position={[x, 0, z]} rotation={[noise1(t * 1.6 + i, i + 40) * 0.2, e * 6, lean]}>
          <mesh position={[0, s * 0.5, 0]} scale={[1, s, 1]} material={G(i % 3 === 0 ? PAL.fireCore : i % 3 === 1 ? PAL.fire : PAL.ember, 0.82)}><coneGeometry args={[0.12 + c * 0.12, 1, 6]} /></mesh>
        </group>); })}
      <Embers t={t} n={60} area={[w, h * 2.4, d]} seed={seed + 3} />
      <Smoke t={t} n={12} at={[0, h * 0.9, 0]} spread={w * 0.4} seed={seed + 5} rise={h * 3} />
      <pointLight position={[0, h * 0.6, 0]} intensity={light * k} distance={26} decay={1.4} color={PAL.winGlow} />
      <pointLight position={[0, h * 0.3, d]} intensity={light * 0.4 * k} distance={14} decay={1.6} color={PAL.fire} />
      <Halo at={[0, h * 0.6, 0]} r={w * 0.75} o={0.35} t={t} seed={seed} />
    </group>
  );
};
export const Embers: React.FC<{ t: number; n?: number; area?: V3; seed?: number }> = ({ t, n = 40, area = [2, 4, 2], seed = 3 }) => {
  const q = useMemo(() => { const r = rng(seed); return Array.from({ length: n }, () => [r(), r(), r(), r()]); }, [n, seed]);
  return <group>{q.map(([a, b, c, e], i) => { const life = 1.6 + e * 1.8; const ph = ((t + a * life) % life) / life; const x = (b - 0.5) * area[0] + sway(t + i, 2, 0.3, i); const z = (c - 0.5) * area[2] + sway(t + i, 2.6, 0.25, i * 3); return <mesh key={i} position={[x, ph * area[1], z]} scale={0.6 + 0.6 * (1 - ph)} material={G(i % 2 ? PAL.ember : PAL.fireCore, 1 - ph)}><octahedronGeometry args={[0.025, 0]} /></mesh>; })}</group>;
};
export const Smoke: React.FC<{ t: number; n?: number; at?: V3; spread?: number; seed?: number; rise?: number; c?: string; o?: number; s?: number }> = ({ t, n = 8, at = [0, 0, 0], spread = 0.3, seed = 2, rise = 3, c = '#3a3a40', o = 0.35, s = 1 }) => {
  const q = useMemo(() => { const r = rng(seed); return Array.from({ length: n }, () => [r(), r(), r()]); }, [n, seed]);
  return <group position={at}>{q.map(([a, b, e], i) => { const life = 4 + e * 3; const ph = ((t + a * life) % life) / life; return <mesh key={i} position={[(b - 0.5) * spread + ph * 0.8 + sway(t, 5, 0.2, i), ph * rise, sway(t, 4, 0.2, i * 2)]} scale={(0.3 + ph * 1.2) * s} material={M(c, { op: o * Math.sin(Math.PI * ph) })}><icosahedronGeometry args={[0.5, 0]} /></mesh>; })}</group>;
};
// BLOOD (only when the story has it; never on thumbnails): dark glossy pools and drips as flat low-poly shapes. No wounds, no bodies.
export const BloodPool: React.FC<{ at: V3; r?: number; grow?: number; seed?: number }> = ({ at, r = 0.8, grow = 1, seed = 1 }) => {
  const q = rng(seed); const blobs = Array.from({ length: 6 }, () => [q() - 0.5, q() - 0.5, 0.4 + q() * 0.6]);
  return <group position={[at[0], at[1] + 0.012, at[2]]} scale={[grow, 1, grow]}>{blobs.map(([x, z, s], i) => <mesh key={i} position={[x * r, i * 0.001, z * r]} rotation={[-Math.PI / 2, 0, i]} material={M(PAL.blood, { r: 0.15, m: 0.2 })}><circleGeometry args={[r * s * 0.7, 7]} /></mesh>)}</group>;
};
