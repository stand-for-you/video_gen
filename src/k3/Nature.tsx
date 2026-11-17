import React, { useMemo } from 'react';
import * as THREE from 'three';
import { M, G, PAL, rng, sway, V3 } from './core';
// ===== NATURE: low-poly flat-shaded pines, dead trees, forests, rocks, bushes, river, fences. Fixed engine file.
// Every tree sways a little in the wind (secondary motion). snow = white caps on branches.
export const Pine: React.FC<{ at: V3; s?: number; t: number; seed?: number; snow?: boolean; c?: string }> = ({ at, s = 1, t, seed = 1, snow = false, c }) => {
  const q = rng(seed); const rot = q() * Math.PI; const tiers = 4 + Math.floor(q() * 2); const col = c || (q() > 0.5 ? PAL.pine : PAL.pineDark);
  const w = sway(t, 5 + q() * 2, 0.025, seed);
  return (
    <group position={at} scale={s} rotation={[0, rot, 0]}>
      <mesh position={[0, 0.7, 0]} material={M(PAL.bark)}><cylinderGeometry args={[0.1, 0.17, 1.4, 5]} /></mesh>
      <group rotation={[w, 0, w * 0.7]}>
        {Array.from({ length: tiers }, (_, i) => { const r = 1.25 - i * (0.95 / tiers), y = 1.2 + i * 0.72; return (
          <group key={i} position={[0, y, 0]} rotation={[0, i * 0.7, 0]}>
            <mesh material={M(col)}><coneGeometry args={[r, 1.25, 7]} /></mesh>
            {snow && <mesh position={[0, 0.18, 0]} material={M(PAL.snow)}><coneGeometry args={[r * 0.62, 0.55, 7]} /></mesh>}
          </group>); })}
      </group>
    </group>
  );
};
// bare dead tree: recursive branches (cylinders), very dark. Sways at the tips.
export const DeadTree: React.FC<{ at: V3; s?: number; t: number; seed?: number; c?: string }> = ({ at, s = 1, t, seed = 2, c = '#15120f' }) => {
  const parts = useMemo(() => {
    const q = rng(seed); const out: { p: V3; r: V3; l: number; w: number; d: number }[] = [];
    const grow = (p: THREE.Vector3, dir: THREE.Vector3, l: number, w: number, d: number) => {
      if (d === 0 || l < 0.15) return; const e = p.clone().add(dir.clone().multiplyScalar(l));
      const mid = p.clone().add(e).multiplyScalar(0.5); const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize()); const eu = new THREE.Euler().setFromQuaternion(quat);
      out.push({ p: [mid.x, mid.y, mid.z], r: [eu.x, eu.y, eu.z], l, w, d });
      const n = d > 3 ? 2 : 2 + (q() > 0.6 ? 1 : 0);
      for (let i = 0; i < n; i++) { const nd = dir.clone().add(new THREE.Vector3((q() - 0.5) * 1.3, 0.25 + q() * 0.3, (q() - 0.5) * 1.3)).normalize(); grow(e, nd, l * (0.62 + q() * 0.12), w * 0.62, d - 1); }
    };
    grow(new THREE.Vector3(0, 0, 0), new THREE.Vector3((q() - 0.5) * 0.15, 1, (q() - 0.5) * 0.15).normalize(), 2.1, 0.22, 6); return out;
  }, [seed]);
  const w = sway(t, 6, 0.02, seed);
  return <group position={at} scale={s} rotation={[w * 0.5, 0, w]}>{parts.map((b, i) => <mesh key={i} position={b.p} rotation={b.r} material={M(c)}><cylinderGeometry args={[b.w * 0.62, b.w, b.l, 5]} /></mesh>)}</group>;
};
// scattered forest. clear = rectangles [x0,x1,z0,z1] kept empty (paths, clearings, houses)
// Forest: ONE instanced mesh for the trunks and ONE for the tiers (plus one for snow caps), so a whole wood costs 2-3 draw calls
// instead of hundreds. Software WebGL (the renderer in CI) is slow per draw call, so this is what keeps 3D renders affordable.
// Every tree still sways in the wind: the instance matrices are rebuilt every frame.
export const Forest: React.FC<{ t: number; n?: number; area?: [number, number, number, number]; clear?: [number, number, number, number][]; seed?: number; snow?: boolean; dead?: number; s?: [number, number] }> = ({ t, n = 40, area = [-30, 30, -40, -6], clear = [], seed = 11, snow = false, dead = 0, s = [0.9, 1.6] }) => {
  const trees = useMemo(() => {
    const q = rng(seed); const o: { x: number; z: number; s: number; r: number; tiers: number; dark: boolean; dead: boolean }[] = []; let g = 0;
    while (o.length < n && g++ < n * 8) {
      const x = area[0] + q() * (area[1] - area[0]), z = area[2] + q() * (area[3] - area[2]);
      if (clear.some(([a, b, c, d]) => x > a && x < b && z > c && z < d)) continue;
      o.push({ x, z, s: s[0] + q() * (s[1] - s[0]), r: q() * Math.PI, tiers: 4 + Math.floor(q() * 2), dark: q() > 0.5, dead: q() < dead });
    }
    return o;
  }, [n, seed, JSON.stringify(area), JSON.stringify(clear), dead, s[0], s[1]]);
  const live = trees.filter((x) => !x.dead);
  const tierN = live.reduce((a, b) => a + b.tiers, 0);
  const trunks = useMemo(() => new THREE.InstancedMesh(new THREE.CylinderGeometry(0.1, 0.17, 1.4, 5), M(PAL.bark), Math.max(1, live.length)), [live.length]);
  const tiersA = useMemo(() => { const m = new THREE.InstancedMesh(new THREE.ConeGeometry(1, 1.25, 7), M(PAL.pine), Math.max(1, tierN)); m.instanceColor = null; return m; }, [tierN]);
  const caps = useMemo(() => new THREE.InstancedMesh(new THREE.ConeGeometry(1, 0.55, 7), M(PAL.snow), Math.max(1, snow ? tierN : 1)), [tierN, snow]);
  const o = useMemo(() => new THREE.Object3D(), []);
  const col = useMemo(() => new THREE.Color(), []);
  let k = 0;
  live.forEach((tr, i) => { o.position.set(tr.x, 0.7 * tr.s, tr.z); o.rotation.set(0, tr.r, 0); o.scale.set(tr.s, tr.s, tr.s); o.updateMatrix(); trunks.setMatrixAt(i, o.matrix); });
  trunks.instanceMatrix.needsUpdate = true;
  live.forEach((tr) => {
    const w = sway(t, 5 + (tr.r % 2), 0.025, tr.x);
    for (let j = 0; j < tr.tiers; j++) {
      const r = (1.25 - j * (0.95 / tr.tiers)) * tr.s, y = (1.2 + j * 0.72) * tr.s;
      o.position.set(tr.x + w * y * 0.35, y, tr.z + w * y * 0.2); o.rotation.set(w * 0.6, tr.r + j * 0.7, w);
      o.scale.set(r, tr.s, r); o.updateMatrix(); tiersA.setMatrixAt(k, o.matrix);
      col.set(tr.dark ? PAL.pineDark : PAL.pine); tiersA.setColorAt(k, col);
      if (snow) { o.position.set(o.position.x, y + 0.18 * tr.s, o.position.z); o.scale.set(r * 0.62, tr.s, r * 0.62); o.updateMatrix(); caps.setMatrixAt(k, o.matrix); }
      k++;
    }
  });
  tiersA.instanceMatrix.needsUpdate = true; if (tiersA.instanceColor) tiersA.instanceColor.needsUpdate = true;
  if (snow) caps.instanceMatrix.needsUpdate = true;
  return (<group>
    <primitive object={trunks} /><primitive object={tiersA} />{snow && <primitive object={caps} />}
    {trees.filter((x) => x.dead).map((tr, i) => <DeadTree key={i} at={[tr.x, 0, tr.z]} s={tr.s} t={t} seed={Math.floor(tr.r * 1000)} />)}
  </group>);
};
export const Rock: React.FC<{ at: V3; s?: number | V3; seed?: number; c?: string; rot?: number }> = ({ at, s = 1, seed = 1, c = PAL.stone, rot }) => { const q = rng(seed); const sc: V3 = typeof s === 'number' ? [s * (0.8 + q() * 0.5), s * (0.5 + q() * 0.4), s * (0.8 + q() * 0.4)] : s; return <mesh position={at} scale={sc} rotation={[q(), rot ?? q() * 6, q() * 0.4]} material={M(c)}><dodecahedronGeometry args={[0.6, 0]} /></mesh>; };
export const Bush: React.FC<{ at: V3; s?: number; t: number; seed?: number; c?: string }> = ({ at, s = 1, t, seed = 1, c = '#1e3226' }) => <mesh position={[at[0], at[1] + 0.35 * s, at[2]]} scale={[s, s * 0.7, s]} rotation={[0, seed, sway(t, 4, 0.03, seed)]} material={M(c)}><icosahedronGeometry args={[0.6, 0]} /></mesh>;
// river: a long faceted water strip whose vertices roll every frame (moving water), with pale highlight
export const River: React.FC<{ t: number; at?: V3; w?: number; l?: number; rot?: number; c?: string; speed?: number }> = ({ t, at = [0, 0.02, 0], w = 6, l = 60, rot = 0, c = '#1c3346', speed = 1.6 }) => {
  const geo = useMemo(() => { const g = new THREE.PlaneGeometry(w, l, 10, 60); g.rotateX(-Math.PI / 2); return g; }, [w, l]);
  const p = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i); p.setY(i, 0.07 * Math.sin(z * 1.3 + t * speed * 2) + 0.05 * Math.sin(x * 2.1 + z * 0.7 - t * speed * 1.6)); }
  p.needsUpdate = true; geo.computeVertexNormals();
  return <mesh geometry={geo} position={at} rotation={[0, rot, 0]} material={M(c, { r: 0.25, m: 0.1 })} />;
};
export const Fence: React.FC<{ from: V3; to: V3; n?: number; h?: number; c?: string; broken?: boolean }> = ({ from, to, n = 8, h = 1, c = PAL.woodDark, broken }) => {
  const dx = to[0] - from[0], dz = to[2] - from[2], L = Math.hypot(dx, dz), a = Math.atan2(dx, dz);
  return (
    <group position={from} rotation={[0, a, 0]}>
      {Array.from({ length: n + 1 }, (_, i) => <mesh key={i} position={[0, h / 2, (L * i) / n]} rotation={[0, 0, broken && i % 3 === 1 ? 0.25 : 0]} material={M(c)}><boxGeometry args={[0.1, h, 0.1]} /></mesh>)}
      {[0.35, 0.75].map((y, i) => <mesh key={i} position={[0, h * y, L / 2]} material={M(c)}><boxGeometry args={[0.05, 0.08, L]} /></mesh>)}
    </group>
  );
};
export const Gravestone: React.FC<{ at: V3; kind?: number; s?: number; rot?: number; c?: string }> = ({ at, kind = 0, s = 1, rot = 0, c = '#3c3e40' }) => (
  <group position={at} scale={s} rotation={[0, rot, kind === 2 ? 0.12 : 0.04]}>
    {kind === 1 ? <>
      <mesh position={[0, 0.7, 0]} material={M(c)}><boxGeometry args={[0.16, 1.4, 0.14]} /></mesh>
      <mesh position={[0, 1.05, 0]} material={M(c)}><boxGeometry args={[0.7, 0.16, 0.14]} /></mesh>
    </> : <>
      <mesh position={[0, 0.5, 0]} material={M(c)}><boxGeometry args={[0.62, 1, 0.16]} /></mesh>
      <mesh position={[0, 1, 0]} rotation={[Math.PI / 2, 0, 0]} material={M(c)}><cylinderGeometry args={[0.31, 0.31, 0.16, 7, 1, false, 0, Math.PI]} /></mesh>
    </>}
  </group>
);
export const Sky = { G };
