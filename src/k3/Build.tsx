import React, { useMemo } from 'react';
import * as THREE from 'three';
import { M, G, PAL, rng, flick, V3 } from './core';
import { Halo } from './World';
import { Smoke, BigFire } from './Fx';
// ===== BUILDINGS (low-poly, flat shaded): cottages with thatch, chimneys, warm orange windows (emissive pane + point light),
// a church with a steeple, a well, a cobbled lane, a log cabin (burning / burnt). Fixed engine file.
// Windows: lit = 0..1. Lit windows ALWAYS carry a small warm point light that flickers smoothly (fire inside).
export const Window: React.FC<{ at: V3; w?: number; h?: number; lit?: number; t: number; seed?: number; light?: number; rot?: number; frame?: string }> = ({ at, w = 0.6, h = 0.7, lit = 1, t, seed = 1, light = 1.6, rot = 0, frame = PAL.woodDark }) => {
  const k = flick(t, seed, 0.15) * lit;
  return (
    <group position={at} rotation={[0, rot, 0]}>
      <mesh position={[0, 0, 0.01]} material={M(frame)}><boxGeometry args={[w + 0.12, h + 0.12, 0.06]} /></mesh>
      <mesh position={[0, 0, 0.045]} material={lit > 0 ? G(PAL.win, 1) : M('#0c1018')}><boxGeometry args={[w, h, 0.02]} /></mesh>
      <mesh position={[0, 0, 0.06]} material={M(frame)}><boxGeometry args={[0.05, h, 0.03]} /></mesh>
      <mesh position={[0, 0, 0.06]} material={M(frame)}><boxGeometry args={[w, 0.05, 0.03]} /></mesh>
      <mesh position={[0, -h / 2 - 0.08, 0.08]} material={M(frame)}><boxGeometry args={[w + 0.24, 0.06, 0.16]} /></mesh>
      {lit > 0 && light > 0 && <pointLight position={[0, 0, 0.7]} intensity={light * k} distance={6} decay={1.6} color={PAL.winGlow} />}
      {lit > 0 && <Halo at={[0, 0, 0.12]} r={Math.max(w, h) * 0.6} o={0.3 * lit} t={t} seed={seed} />}
    </group>
  );
};
export const Door: React.FC<{ at: V3; w?: number; h?: number; open?: number; lit?: number; t: number; rot?: number; c?: string }> = ({ at, w = 0.9, h = 1.8, open = 0, lit = 0, t, rot = 0, c = PAL.wood }) => (
  <group position={at} rotation={[0, rot, 0]}>
    {/* the doorway itself: a dark room with warm light deeper inside, never a flat bright panel */}
    <mesh position={[0, h / 2, -0.25]} material={M('#0a0b0e')}><boxGeometry args={[w, h, 0.02]} /></mesh>
    {lit > 0 && open > 0 && <>
      <mesh position={[0, h * 0.22, -0.2]} material={G('#8a4e1e', 0.9)}><boxGeometry args={[w * 0.9, h * 0.42, 0.02]} /></mesh>
      <mesh position={[0, h * 0.1, -0.16]} material={G('#c87a30', 0.8)}><boxGeometry args={[w * 0.55, h * 0.22, 0.02]} /></mesh>
    </>}
    <group position={[-w / 2, 0, 0.02]} rotation={[0, -open * 1.6, 0]}>
      <mesh position={[w / 2, h / 2, 0]} material={M(c)}><boxGeometry args={[w, h, 0.06]} /></mesh>
      {[0.3, 0.7].map((y, i) => <mesh key={i} position={[w / 2, h * y, 0.04]} material={M(PAL.woodDark)}><boxGeometry args={[w * 0.95, 0.07, 0.03]} /></mesh>)}
      <mesh position={[w * 0.85, h * 0.5, 0.06]} material={M('#2a2622', { m: 0.6 })}><sphereGeometry args={[0.035, 5, 4]} /></mesh>
    </group>
    {lit > 0 && open > 0 && <pointLight position={[0, h * 0.6, 0.8]} intensity={3 * lit * open * flick(t, 9, 0.12)} distance={8} decay={1.5} color={PAL.winGlow} />}
  </group>
);
// gable roof from two slabs
const Gable: React.FC<{ w: number; d: number; rise: number; over?: number; c: string; snow?: boolean; thick?: number }> = ({ w, d, rise, over = 0.3, c, snow, thick = 0.22 }) => {
  const half = w / 2 + over; const L = Math.hypot(half, rise); const a = Math.atan2(rise, half);
  return (
    <group>
      {[-1, 1].map((s) => (
        <group key={s} position={[(s * half) / 2, rise / 2, 0]} rotation={[0, 0, -s * a]}>
          <mesh material={M(c)}><boxGeometry args={[L, thick, d + over * 2]} /></mesh>
          {snow && <mesh position={[0, thick / 2 + 0.04, 0]} material={M(PAL.snow)}><boxGeometry args={[L * 0.96, 0.08, d + over * 2 - 0.05]} /></mesh>}
          {!snow && Array.from({ length: 4 }, (_, i) => <mesh key={i} position={[-L / 2 + (L * (i + 0.5)) / 4, thick / 2, 0]} material={M(PAL.thatch === c ? '#5e4e30' : PAL.stoneDark)}><boxGeometry args={[0.06, 0.04, d + over * 2]} /></mesh>)}
        </group>
      ))}
      <mesh position={[0, rise + 0.02, 0]} rotation={[0, 0, Math.PI / 4]} material={M(c)}><boxGeometry args={[0.24, 0.24, d + over * 2 + 0.02]} /></mesh>
    </group>
  );
};
// triangular gable wall (the end walls under a gable roof)
const GableWall: React.FC<{ w: number; rise: number; c: string; z: number }> = ({ w, rise, c, z }) => {
  const geo = useMemo(() => { const s = new THREE.Shape(); s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(0, rise); s.lineTo(-w / 2, 0); const g = new THREE.ExtrudeGeometry(s, { depth: 0.2, bevelEnabled: false }); g.translate(0, 0, -0.1); return g; }, [w, rise]);
  return <mesh geometry={geo} position={[0, 0, z]} material={M(c)} />;
};
export type CottageP = { at: V3; rot?: number; lod?: boolean; w?: number; d?: number; h?: number; rise?: number; wall?: string; roof?: string; lit?: number; t: number; seed?: number; snow?: boolean; door?: number; doorLit?: number; chimney?: boolean; smoke?: boolean; beams?: boolean; wins?: number; light?: number };
// stone cottage: walls with corner stones and timber beams, gable roof (thatch), chimney with smoke, windows front + side, door
export const Cottage: React.FC<CottageP> = ({ at, rot = 0, lod = false, w = 4.2, d = 3.4, h = 2.4, rise = 1.7, wall = PAL.cob, roof = PAL.thatch, lit = 1, t, seed = 1, snow = false, door = 0, doorLit = 0, chimney = true, smoke = true, beams = true, wins = 2, light = 0 }) => {
  const q = rng(seed); const lit2 = q() > 0.35 ? lit : 0;
  // LOD: a far house is 4 meshes instead of about 65. Software WebGL pays for every draw call, so distant houses use this.
  if (lod) return (
    <group position={at} rotation={[0, rot, 0]}>
      <mesh position={[0, h / 2, 0]} material={M(wall)}><boxGeometry args={[w, h, d]} /></mesh>
      <group position={[0, h, 0]}><Gable w={w} d={d} rise={rise} c={snow ? PAL.snow : roof} snow={false} /></group>
      {lit > 0 && <mesh position={[-w * 0.24, h * 0.55, d / 2 + 0.03]} material={G(PAL.win, 1)}><boxGeometry args={[0.6, 0.7, 0.02]} /></mesh>}
      {lit > 0 && <pointLight position={[-w * 0.24, h * 0.55, d / 2 + 0.7]} intensity={light * flick(t, seed, 0.12)} distance={6} decay={1.6} color={PAL.winGlow} />}
    </group>
  );
  return (
    <group position={at} rotation={[0, rot, 0]}>
      <mesh position={[0, h / 2, 0]} material={M(wall)}><boxGeometry args={[w, h, d]} /></mesh>
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sz], i) => Array.from({ length: 3 }, (_, j) => <mesh key={i + '_' + j} position={[sx * (w / 2 - 0.02), (j + 0.5) * (h / 3), sz * (d / 2 - 0.02)]} material={M(j % 2 ? PAL.stone : PAL.stoneDark)}><boxGeometry args={[j % 2 ? 0.36 : 0.26, h / 3 - 0.03, j % 2 ? 0.26 : 0.36]} /></mesh>))}
      {beams && <>
        <mesh position={[0, h - 0.08, d / 2 + 0.03]} material={M(PAL.woodDark)}><boxGeometry args={[w, 0.16, 0.08]} /></mesh>
        <mesh position={[0, 0.12, d / 2 + 0.03]} material={M(PAL.stoneDark)}><boxGeometry args={[w + 0.06, 0.24, 0.1]} /></mesh>
      </>}
      <GableWall w={w} rise={rise} c={wall} z={d / 2 - 0.1} />
      <GableWall w={w} rise={rise} c={wall} z={-d / 2 + 0.1} />
      <group position={[0, h, 0]}><Gable w={w} d={d} rise={rise} c={roof} snow={snow} /></group>
      {chimney && <group position={[w * 0.28, h + rise * 0.55, -d * 0.18]}>
        <mesh position={[0, 0.5, 0]} material={M(PAL.stoneDark)}><boxGeometry args={[0.5, 1.4, 0.5]} /></mesh>
        <mesh position={[0, 1.22, 0]} material={M(PAL.stone)}><boxGeometry args={[0.6, 0.1, 0.6]} /></mesh>
        {smoke && <Smoke t={t} n={7} at={[0, 1.3, 0]} spread={0.2} seed={seed} rise={3.5} c="#2c3038" o={0.4} s={0.8} />}
      </group>}
      <Door at={[w * 0.18, 0, d / 2 + 0.02]} open={door} lit={doorLit} t={t} />
      <Window at={[-w * 0.24, h * 0.55, d / 2]} lit={lit} t={t} seed={seed} light={light} />
      {wins > 1 && <Window at={[w / 2, h * 0.55, 0]} rot={Math.PI / 2} lit={lit2} t={t} seed={seed + 1} light={0} />}
      {wins > 2 && <Window at={[-w / 2, h * 0.55, 0]} rot={-Math.PI / 2} lit={lit2} t={t} seed={seed + 2} light={0} />}
      {snow && <mesh position={[0, 0.02, d / 2 + 0.6]} material={M(PAL.snow)}><boxGeometry args={[w + 0.6, 0.04, 1.2]} /></mesh>}
    </group>
  );
};
// log cabin in the woods (Herbert's home). burn = 0..1 fire on it; burnt = black ruin with smoke
export const Cabin: React.FC<{ at: V3; rot?: number; t: number; lit?: number; door?: number; burn?: number; burnt?: boolean; snow?: boolean; seed?: number }> = ({ at, rot = 0, t, lit = 1, door = 0, burn = 0, burnt = false, snow = false, seed = 5 }) => {
  const w = 3.6, d = 3, h = 2.1, logC = burnt ? '#141110' : '#4a3626', logC2 = burnt ? '#1c1714' : '#3c2a1c';
  return (
    <group position={at} rotation={[0, rot, 0]}>
      {Array.from({ length: 8 }, (_, i) => <group key={i}>
        {[-1, 1].map((s) => <mesh key={s} position={[0, 0.14 + i * 0.26, s * d / 2]} rotation={[0, 0, Math.PI / 2]} material={M(i % 2 ? logC : logC2)}><cylinderGeometry args={[0.14, 0.14, w + 0.4, 6]} /></mesh>)}
        {[-1, 1].map((s) => <mesh key={'x' + s} position={[s * w / 2, 0.27 + i * 0.26, 0]} rotation={[Math.PI / 2, 0, 0]} material={M(i % 2 ? logC2 : logC)}><cylinderGeometry args={[0.14, 0.14, d + 0.4, 6]} /></mesh>)}
      </group>)}
      <mesh position={[0, h / 2, 0]} material={M('#1a1410')}><boxGeometry args={[w - 0.1, h, d - 0.1]} /></mesh>
      {!burnt && <group position={[0, h + 0.1, 0]}><Gable w={w} d={d} rise={1.4} c={snow ? '#3a2c20' : '#3a2c20'} snow={snow} thick={0.18} /></group>}
      {burnt && [[-1.2, 0.6, 0.3], [0.8, 1.1, -0.5], [0.1, 0.4, 1.2]].map(([x, y, r], i) => <mesh key={i} position={[x, h + 0.1, 0]} rotation={[r, 0, 0.5 * y]} material={M('#100c0a')}><boxGeometry args={[0.18, 0.18, 2.6]} /></mesh>)}
      <Door at={[0.6, 0, d / 2 + 0.16]} w={0.8} h={1.7} open={door} lit={lit > 0 && !burnt ? 1 : 0} t={t} c="#3a2a1c" />
      <Window at={[-0.9, 1.15, d / 2 + 0.16]} w={0.55} h={0.5} lit={burnt ? 0 : lit} t={t} seed={seed} />
      {burn > 0 && <><BigFire at={[0, h * 0.75, 0]} t={t} w={w * 1.15} d={d * 1.1} h={2.4 * burn + 0.5} n={26} light={16 * burn} /><BigFire at={[0, 0.15, d * 0.52]} t={t + 1.3} w={w * 0.9} d={0.5} h={1.5 * burn} n={12} light={0} seed={9} /></>}
      {burnt && <Smoke t={t} n={10} at={[0, 1.2, 0]} spread={2} seed={seed} rise={6} c="#26282c" o={0.45} s={1.4} />}
    </group>
  );
};
export const Church: React.FC<{ at: V3; rot?: number; t: number; lit?: number; snow?: boolean }> = ({ at, rot = 0, t, lit = 1, snow }) => (
  <group position={at} rotation={[0, rot, 0]}>
    <mesh position={[0, 2, 0]} material={M(PAL.stone)}><boxGeometry args={[5, 4, 9]} /></mesh>
    <group position={[0, 4, 0]}><Gable w={5} d={9} rise={2.4} c={PAL.stoneDark} snow={snow} /></group>
    <GableWall w={5} rise={2.4} c={PAL.stone} z={4.4} />
    <group position={[0, 0, 5.2]}>
      <mesh position={[0, 3.5, 0]} material={M(PAL.stone)}><boxGeometry args={[2.2, 7, 2.2]} /></mesh>
      <mesh position={[0, 8.6, 0]} rotation={[0, Math.PI / 4, 0]} material={M(PAL.stoneDark)}><coneGeometry args={[1.75, 3.2, 4]} /></mesh>
      <mesh position={[0, 10.6, 0]} material={M('#2a2a2a')}><boxGeometry args={[0.1, 0.9, 0.1]} /></mesh>
      <mesh position={[0, 10.75, 0]} material={M('#2a2a2a')}><boxGeometry args={[0.5, 0.1, 0.1]} /></mesh>
      <Window at={[0, 5.6, 1.1]} w={0.5} h={0.9} lit={lit} t={t} seed={21} light={1} />
      <Door at={[0, 0, 1.12]} w={1.1} h={2.2} t={t} c={PAL.woodDark} />
    </group>
    {[-2.5, 2.5].map((x) => [-2, 1.5].map((z) => <Window key={x + '_' + z} at={[x > 0 ? 2.51 : -2.51, 2.4, z]} rot={x > 0 ? Math.PI / 2 : -Math.PI / 2} w={0.6} h={1.4} lit={lit} t={t} seed={30 + z} light={0} />))}
  </group>
);
export const Well: React.FC<{ at: V3; t: number; rot?: number }> = ({ at, t, rot = 0 }) => (
  <group position={at} rotation={[0, rot, 0]}>
    <mesh position={[0, 0.45, 0]} material={M(PAL.stone)}><cylinderGeometry args={[0.9, 0.95, 0.9, 9, 1, true]} /></mesh>
    <mesh position={[0, 0.45, 0]} material={M(PAL.stoneDark, { side: 'double' })}><cylinderGeometry args={[0.72, 0.72, 0.9, 9, 1, true]} /></mesh>
    <mesh position={[0, 0.9, 0]} rotation={[Math.PI / 2, 0, 0]} material={M(PAL.stone)}><torusGeometry args={[0.82, 0.12, 4, 9]} /></mesh>
    <mesh position={[0, 0.3, 0]} rotation={[-Math.PI / 2, 0, 0]} material={M('#05070a')}><circleGeometry args={[0.72, 9]} /></mesh>
    {[-1, 1].map((s) => <mesh key={s} position={[s * 0.8, 1.4, 0]} material={M(PAL.woodDark)}><boxGeometry args={[0.1, 1.2, 0.1]} /></mesh>)}
    <mesh position={[0, 1.9, 0]} rotation={[0, 0, Math.PI / 2]} material={M(PAL.wood)}><cylinderGeometry args={[0.06, 0.06, 1.7, 5]} /></mesh>
    <group position={[0, 2.05, 0]}><Gable w={1.9} d={1.2} rise={0.55} over={0.12} c={PAL.thatch} thick={0.1} /></group>
    <mesh position={[0, 1.55, 0]} rotation={[0, 0, Math.sin(t * 0.9) * 0.05]} material={M('#6a5a40')}><cylinderGeometry args={[0.01, 0.01, 0.7, 3]} /></mesh>
    <mesh position={[0, 1.15, 0]} rotation={[0, 0, Math.sin(t * 0.9) * 0.05]} material={M(PAL.wood)}><cylinderGeometry args={[0.14, 0.11, 0.2, 7]} /></mesh>
  </group>
);
// cobbled lane: instanced flat stones with colour variety along a strip (x0..x1 wide, z0..z1 long)
export const Cobbles: React.FC<{ x0?: number; x1?: number; z0?: number; z1?: number; seed?: number; c?: string; wet?: boolean }> = ({ x0 = -2.2, x1 = 2.2, z0 = -40, z1 = 8, seed = 3, c = '#4a4a46', wet = false }) => {
  const mesh = useMemo(() => {
    const q = rng(seed); const pts: number[][] = []; for (let z = z0; z < z1; z += 0.36) for (let x = x0 + ((Math.round(z / 0.36) % 2) * 0.17); x < x1; x += 0.36) pts.push([x + (q() - 0.5) * 0.05, z + (q() - 0.5) * 0.05, 0.28 + q() * 0.08, 0.26 + q() * 0.08, q()]);
    const g = new THREE.BoxGeometry(1, 0.08, 1); const m = new THREE.InstancedMesh(g, M('#ffffff', { r: wet ? 0.45 : 0.9 }), pts.length); const o = new THREE.Object3D(); const col = new THREE.Color(); const base = new THREE.Color(c);
    pts.forEach(([x, z, sx, sz, v], i) => { o.position.set(x, 0.02 + v * 0.02, z); o.rotation.set(0, (v - 0.5) * 0.3, 0); o.scale.set(sx, 1, sz); o.updateMatrix(); m.setMatrixAt(i, o.matrix); col.copy(base).multiplyScalar(0.7 + v * 0.55); m.setColorAt(i, col); });
    return m;
  }, [x0, x1, z0, z1, seed, c, wet]);
  return <><mesh position={[(x0 + x1) / 2, -0.01, (z0 + z1) / 2]} rotation={[-Math.PI / 2, 0, 0]} material={M('#1e1e1c')}><planeGeometry args={[x1 - x0 + 0.4, z1 - z0]} /></mesh><primitive object={mesh} /></>;
};
// a street of cottages on both sides of a cobbled lane (one-point perspective street), every house different
export const Street: React.FC<{ t: number; n?: number; z0?: number; gap?: number; lit?: number; snow?: boolean; seed?: number; width?: number }> = ({ t, n = 4, z0 = 2, gap = 5.4, lit = 1, snow = false, seed = 40, width = 3.2 }) => {
  const q = rng(seed); const houses: React.ReactNode[] = [];
  for (let i = 0; i < n; i++) for (const s of [-1, 1]) {
    const w = 3.8 + q() * 1.2, d = 3.4 + q() * 0.6, h = 2.2 + q() * 0.6, k = Math.floor(q() * 100);
    houses.push(<Cottage key={i + '_' + s} lod={i >= 2} light={i === 0 ? 1.2 : 0} at={[s * (width + d / 2), 0, z0 - i * gap]} rot={-s * Math.PI / 2} w={w} d={d} h={h} rise={1.4 + q() * 0.6} t={t} seed={k} lit={q() > 0.25 ? lit : 0} snow={snow} wins={1} smoke={i < 2} wall={q() > 0.5 ? PAL.cob : '#5a5650'} roof={q() > 0.4 ? PAL.thatch : '#4a4440'} />);
  }
  return <group><Cobbles x0={-width + 0.4} x1={width - 0.4} z0={z0 - n * gap - 4} z1={z0 + 6} seed={seed} wet />{houses}</group>;
};
