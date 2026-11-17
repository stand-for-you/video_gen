import React, { useMemo } from 'react';
import * as THREE from 'three';
import { M, G, PAL, rng, flick, sway, V3 } from './core';
import { Halo } from './World';
import { Flame } from './Fx';
// ===== INTERIORS (low-poly, flat shaded, DETAILED): rooms with brick/stone or plank walls, beams, floor planks, a moonlit window,
// beds, tables, chairs, shelves of books, crates, barrels, chains, stairs, rugs, fireplace, old book, peg doll. Fixed engine file.
// ROOM DETAIL LAW: a room always has at least 6 props + a light source + wall texture (bricks / planks), never a flat empty box.
const bricksMesh = (w: number, h: number, seed: number, c: string, bw = 0.42, bh = 0.2) => {
  const q = rng(seed); const pts: number[][] = [];
  for (let r = 0; r * bh < h; r++) for (let x = -w / 2 + (r % 2 ? bw / 2 : 0); x < w / 2; x += bw) pts.push([x + bw / 2, r * bh + bh / 2, q()]);
  const m = new THREE.InstancedMesh(new THREE.BoxGeometry(bw - 0.03, bh - 0.03, 0.06), M('#ffffff'), pts.length); const o = new THREE.Object3D(); const col = new THREE.Color(); const base = new THREE.Color(c);
  pts.forEach(([x, y, v], i) => { o.position.set(Math.min(x, w / 2 - bw / 2), y, 0.03 + v * 0.015); o.updateMatrix(); m.setMatrixAt(i, o.matrix); col.copy(base).multiplyScalar(0.75 + v * 0.45); m.setColorAt(i, col); });
  return m;
};
export const BrickWall: React.FC<{ w: number; h: number; at?: V3; rot?: number; seed?: number; c?: string; mortar?: string }> = ({ w, h, at = [0, 0, 0], rot = 0, seed = 1, c = '#5a5a54', mortar = '#24241f' }) => {
  const m = useMemo(() => bricksMesh(w, h, seed, c), [w, h, seed, c]);
  return <group position={at} rotation={[0, rot, 0]}><mesh position={[0, h / 2, 0]} material={M(mortar)}><boxGeometry args={[w, h, 0.04]} /></mesh><primitive object={m} /></group>;
};
export const PlankWall: React.FC<{ w: number; h: number; at?: V3; rot?: number; seed?: number; c?: string }> = ({ w, h, at = [0, 0, 0], rot = 0, seed = 2, c = PAL.plank }) => {
  const q = rng(seed); const n = Math.ceil(w / 0.32);
  return <group position={at} rotation={[0, rot, 0]}>{Array.from({ length: n }, (_, i) => { const v = q(); return <mesh key={i} position={[-w / 2 + (i + 0.5) * (w / n), h / 2, v * 0.02]} material={M(new THREE.Color(c).multiplyScalar(0.75 + v * 0.4).getStyle())}><boxGeometry args={[w / n - 0.025, h, 0.05]} /></mesh>; })}</group>;
};
export const Floor: React.FC<{ w: number; d: number; seed?: number; c?: string; stone?: boolean }> = ({ w, d, seed = 3, c = PAL.plank, stone = false }) => {
  const m = useMemo(() => {
    const q = rng(seed); const pts: number[][] = []; const pw = stone ? 0.5 : 0.24, pl = stone ? 0.5 : 1.6;
    for (let x = -w / 2; x < w / 2; x += pw) for (let z = -d / 2 - q() * pl; z < d / 2; z += pl) pts.push([x + pw / 2, z + pl / 2, q()]);
    const mm = new THREE.InstancedMesh(new THREE.BoxGeometry(pw - 0.02, 0.05, pl - 0.02), M('#ffffff'), pts.length); const o = new THREE.Object3D(); const col = new THREE.Color(); const base = new THREE.Color(c);
    pts.forEach(([x, z, v], i) => { o.position.set(x, 0.025 + v * 0.01, Math.max(-d / 2 + pl / 2, Math.min(d / 2 - pl / 2, z))); o.updateMatrix(); mm.setMatrixAt(i, o.matrix); col.copy(base).multiplyScalar(0.7 + v * 0.5); mm.setColorAt(i, col); });
    return mm;
  }, [w, d, seed, c, stone]);
  return <><mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} material={M('#141210')}><planeGeometry args={[w, d]} /></mesh><primitive object={m} /></>;
};
export type RoomP = { w?: number; d?: number; h?: number; wall?: 'brick' | 'plank' | 'stone'; wallC?: string; floorC?: string; stoneFloor?: boolean; beams?: boolean; window?: { x: number; moon?: boolean; w?: number; h?: number } | null; t: number; seed?: number; ceiling?: boolean; sides?: boolean };
// a room open toward the camera (+z): back wall, two side walls, floor, optional ceiling beams, a moonlit window on the back wall
export const Room: React.FC<RoomP> = ({ w = 7, d = 6, h = 3, wall = 'brick', wallC, floorC, stoneFloor = false, beams = true, window = { x: 1.6, moon: true }, t, seed = 1, ceiling = true, sides = true }) => {
  const Wall = (p: { w: number; at: V3; rot?: number; s: number }) => wall === 'plank' ? <PlankWall w={p.w} h={h} at={p.at} rot={p.rot} seed={p.s} c={wallC || PAL.plank} /> : <BrickWall w={p.w} h={h} at={p.at} rot={p.rot} seed={p.s} c={wallC || (wall === 'stone' ? '#55574f' : '#5c5850')} />;
  return (
    <group>
      <Floor w={w} d={d} seed={seed} c={floorC || (stoneFloor ? '#3e3e3a' : PAL.plank)} stone={stoneFloor} />
      <Wall w={w} at={[0, 0, -d / 2]} s={seed} />
      {sides && <><Wall w={d} at={[-w / 2, 0, 0]} rot={Math.PI / 2} s={seed + 1} /><Wall w={d} at={[w / 2, 0, 0]} rot={-Math.PI / 2} s={seed + 2} /></>}
      {ceiling && <mesh position={[0, h, 0]} rotation={[Math.PI / 2, 0, 0]} material={M('#16120e')}><planeGeometry args={[w, d]} /></mesh>}
      {beams && [-0.3, 0.2, 0.7].map((k, i) => <mesh key={i} position={[0, h - 0.12, -d / 2 + d * (k + 0.3) * 0.8]} material={M(PAL.woodDark)}><boxGeometry args={[w, 0.22, 0.24]} /></mesh>)}
      {beams && [-1, 1].map((s) => <mesh key={s} position={[s * (w / 2 - 0.15), h / 2, -d / 2 + 0.15]} material={M(PAL.woodDark)}><boxGeometry args={[0.22, h, 0.22]} /></mesh>)}
      {window && <MoonWindow at={[window.x, h * 0.55, -d / 2 + 0.05]} w={window.w ?? 0.9} h={window.h ?? 1.1} t={t} moon={window.moon !== false} />}
    </group>
  );
};
// window in a back wall with cool moonlight coming in (blue shaft + spot light)
export const MoonWindow: React.FC<{ at: V3; w?: number; h?: number; t: number; moon?: boolean }> = ({ at, w = 0.9, h = 1.1, t, moon = true }) => (
  <group position={at}>
    <mesh material={M(PAL.woodDark)}><boxGeometry args={[w + 0.16, h + 0.16, 0.12]} /></mesh>
    <mesh position={[0, 0, 0.05]} material={G(moon ? '#5a74a8' : '#0c1018')}><boxGeometry args={[w, h, 0.02]} /></mesh>
    <mesh position={[0, 0, 0.08]} material={M(PAL.woodDark)}><boxGeometry args={[0.05, h, 0.04]} /></mesh>
    <mesh position={[0, 0, 0.08]} material={M(PAL.woodDark)}><boxGeometry args={[w, 0.05, 0.04]} /></mesh>
    {moon && <>
      <pointLight position={[0, -0.2, 1.1]} intensity={3.5} distance={9} decay={1.4} color={PAL.moon} />
      <mesh position={[0, -0.7, 1.4]} rotation={[0.9, 0, 0]} material={G('#7a92c8', 0.06)}><boxGeometry args={[w * 1.1, 3.2, 0.02]} /></mesh>
    </>}
  </group>
);
export const Bed: React.FC<{ at?: V3; rot?: number; t: number; c?: string; blanket?: string; bump?: number; breathe?: boolean; w?: number }> = ({ at = [0, 0, 0], rot = 0, t, c = PAL.woodDark, blanket = '#6a5a4c', bump = 1, breathe = true, w = 1.3 }) => {
  const b = breathe ? 1 + 0.03 * Math.sin(t * 1.6) : 1;
  return (
    <group position={at} rotation={[0, rot, 0]}>
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([x, z], i) => <mesh key={i} position={[x * (w / 2 - 0.05), z < 0 ? 0.55 : 0.35, z * 1.0]} material={M(c)}><boxGeometry args={[0.1, z < 0 ? 1.1 : 0.7, 0.1]} /></mesh>)}
      <mesh position={[0, 0.85, -1.0]} material={M(c)}><boxGeometry args={[w, 0.5, 0.06]} /></mesh>
      <mesh position={[0, 0.32, 0]} material={M(c)}><boxGeometry args={[w, 0.12, 2.1]} /></mesh>
      <mesh position={[0, 0.45, 0]} material={M('#cfc6ae')}><boxGeometry args={[w - 0.08, 0.16, 2.0]} /></mesh>
      <mesh position={[0, 0.6, -0.78]} material={M('#e0d8c4')}><boxGeometry args={[w * 0.6, 0.14, 0.34]} /></mesh>
      <group position={[0, 0.56, 0.2]}>
        <mesh material={M(blanket)}><boxGeometry args={[w + 0.06, 0.08, 1.5]} /></mesh>
        {bump > 0 && <mesh position={[0, 0.1 * bump * b, 0.1]} scale={[1, b, 1]} material={M(blanket)}><boxGeometry args={[w * 0.45, 0.2 * bump, 1.2]} /></mesh>}
        {[-1, 1].map((s) => <mesh key={s} position={[s * (w / 2 + 0.03), -0.18, 0]} material={M(blanket)}><boxGeometry args={[0.04, 0.36, 1.5]} /></mesh>)}
      </group>
      <mesh position={[0, 0.06, 0]} material={M('#050505')}><boxGeometry args={[w - 0.1, 0.12, 1.9]} /></mesh>
    </group>
  );
};
export const Table: React.FC<{ at?: V3; rot?: number; w?: number; d?: number; h?: number; c?: string }> = ({ at = [0, 0, 0], rot = 0, w = 1.4, d = 0.8, h = 0.78, c = PAL.wood }) => (
  <group position={at} rotation={[0, rot, 0]}>
    <mesh position={[0, h, 0]} material={M(c)}><boxGeometry args={[w, 0.07, d]} /></mesh>
    {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([x, z], i) => <mesh key={i} position={[x * (w / 2 - 0.08), h / 2, z * (d / 2 - 0.08)]} material={M(PAL.woodDark)}><boxGeometry args={[0.08, h, 0.08]} /></mesh>)}
  </group>
);
export const Chair: React.FC<{ at?: V3; rot?: number; c?: string }> = ({ at = [0, 0, 0], rot = 0, c = PAL.wood }) => (
  <group position={at} rotation={[0, rot, 0]}>
    <mesh position={[0, 0.45, 0]} material={M(c)}><boxGeometry args={[0.45, 0.05, 0.45]} /></mesh>
    {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([x, z], i) => <mesh key={i} position={[x * 0.19, z < 0 ? 0.48 : 0.22, z * 0.19]} material={M(PAL.woodDark)}><boxGeometry args={[0.05, z < 0 ? 0.96 : 0.45, 0.05]} /></mesh>)}
    {[0.65, 0.85].map((y, i) => <mesh key={i} position={[0, y, -0.19]} material={M(c)}><boxGeometry args={[0.4, 0.06, 0.03]} /></mesh>)}
  </group>
);
export const Shelf: React.FC<{ at?: V3; rot?: number; w?: number; h?: number; rows?: number; seed?: number }> = ({ at = [0, 0, 0], rot = 0, w = 1.6, h = 2.2, rows = 4, seed = 7 }) => {
  const q = rng(seed); const books: React.ReactNode[] = []; const cols = ['#5a2a22', '#2a3a4a', '#3a4a2a', '#6a5a3a', '#4a2a3a', '#2a2420', PAL.red];
  for (let r = 0; r < rows; r++) { let x = -w / 2 + 0.06; const y = 0.12 + (r * (h - 0.2)) / rows; while (x < w / 2 - 0.1) { const bw = 0.05 + q() * 0.06, bh = 0.26 + q() * 0.14, lean = q() > 0.9 ? 0.25 : 0; books.push(<mesh key={books.length} position={[x + bw / 2, y + bh / 2, 0.02]} rotation={[0, 0, lean]} material={M(cols[Math.floor(q() * (q() > 0.95 ? 7 : 6))])}><boxGeometry args={[bw, bh, 0.24]} /></mesh>); x += bw + 0.005 + (q() > 0.93 ? 0.12 : 0); } }
  return (
    <group position={at} rotation={[0, rot, 0]}>
      <mesh position={[0, h / 2, -0.15]} material={M(PAL.woodDark)}><boxGeometry args={[w, h, 0.04]} /></mesh>
      {[-1, 1].map((s) => <mesh key={s} position={[s * w / 2, h / 2, 0]} material={M(PAL.wood)}><boxGeometry args={[0.05, h, 0.34]} /></mesh>)}
      {Array.from({ length: rows + 1 }, (_, r) => <mesh key={r} position={[0, 0.1 + (r * (h - 0.2)) / rows, 0]} material={M(PAL.wood)}><boxGeometry args={[w, 0.04, 0.34]} /></mesh>)}
      {books}
    </group>
  );
};
export const Crate: React.FC<{ at?: V3; s?: number; rot?: number }> = ({ at = [0, 0, 0], s = 0.6, rot = 0 }) => (
  <group position={[at[0], at[1] + s / 2, at[2]]} rotation={[0, rot, 0]}>
    <mesh material={M(PAL.wood)}><boxGeometry args={[s, s, s]} /></mesh>
    {[-1, 1].map((k) => <mesh key={k} position={[0, k * s * 0.4, s / 2 + 0.01]} material={M(PAL.woodDark)}><boxGeometry args={[s, s * 0.12, 0.02]} /></mesh>)}
    <mesh position={[0, 0, s / 2 + 0.015]} rotation={[0, 0, 0.78]} material={M(PAL.woodDark)}><boxGeometry args={[s * 1.25, s * 0.1, 0.02]} /></mesh>
  </group>
);
export const Barrel: React.FC<{ at?: V3; s?: number }> = ({ at = [0, 0, 0], s = 1 }) => (
  <group position={at} scale={s}>
    <mesh position={[0, 0.45, 0]} material={M(PAL.wood)}><cylinderGeometry args={[0.3, 0.3, 0.9, 9]} /></mesh>
    <mesh position={[0, 0.45, 0]} material={M(PAL.wood)}><cylinderGeometry args={[0.34, 0.34, 0.5, 9]} /></mesh>
    {[0.15, 0.75].map((y, i) => <mesh key={i} position={[0, y, 0]} material={M('#2a2622', { m: 0.5 })}><cylinderGeometry args={[0.325, 0.325, 0.04, 9]} /></mesh>)}
  </group>
);
// iron chains hanging from a wall ring (they swing a little)
export const Chain: React.FC<{ at: V3; n?: number; t: number; seed?: number; cuff?: boolean }> = ({ at, n = 9, t, seed = 1, cuff = true }) => {
  const a = sway(t, 3.2, 0.06, seed);
  return (
    <group position={at}>
      <mesh rotation={[0, 0, 0]} material={M('#3a3a3c', { m: 0.7, r: 0.5 })}><torusGeometry args={[0.07, 0.015, 4, 8]} /></mesh>
      <group rotation={[0, 0, a]}>
        {Array.from({ length: n }, (_, i) => <mesh key={i} position={[0, -0.09 - i * 0.075, 0.02]} rotation={[0, i % 2 ? Math.PI / 2 : 0, 0]} material={M('#4a4a4c', { m: 0.7, r: 0.45 })}><torusGeometry args={[0.035, 0.011, 4, 6]} /></mesh>)}
        {cuff && <mesh position={[0, -0.12 - n * 0.075, 0.02]} rotation={[Math.PI / 2, 0, 0]} material={M('#4a4a4c', { m: 0.7, r: 0.45 })}><torusGeometry args={[0.06, 0.016, 4, 9]} /></mesh>}
      </group>
    </group>
  );
};
export const Stairs: React.FC<{ at?: V3; rot?: number; n?: number; w?: number; rise?: number; run?: number; c?: string }> = ({ at = [0, 0, 0], rot = 0, n = 9, w = 1.2, rise = 0.24, run = 0.3, c = PAL.wood }) => (
  <group position={at} rotation={[0, rot, 0]}>{Array.from({ length: n }, (_, i) => <mesh key={i} position={[0, rise * (i + 0.5), -run * i]} material={M(i % 2 ? c : PAL.woodDark)}><boxGeometry args={[w, rise, run]} /></mesh>)}</group>
);
export const Rug: React.FC<{ at?: V3; w?: number; d?: number; c?: string; c2?: string }> = ({ at = [0, 0, 0], w = 2, d = 1.3, c = '#5a2a24', c2 = '#8a6a3a' }) => (
  <group position={[at[0], at[1] + 0.06, at[2]]}><mesh rotation={[-Math.PI / 2, 0, 0]} material={M(c)}><planeGeometry args={[w, d]} /></mesh><mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]} material={M(c2)}><ringGeometry args={[Math.min(w, d) * 0.3, Math.min(w, d) * 0.36, 6]} /></mesh></group>
);
export const Fireplace: React.FC<{ at?: V3; rot?: number; t: number; lit?: number }> = ({ at = [0, 0, 0], rot = 0, t, lit = 1 }) => (
  <group position={at} rotation={[0, rot, 0]}>
    <mesh position={[-0.75, 0.7, 0]} material={M(PAL.stone)}><boxGeometry args={[0.4, 1.4, 0.6]} /></mesh>
    <mesh position={[0.75, 0.7, 0]} material={M(PAL.stone)}><boxGeometry args={[0.4, 1.4, 0.6]} /></mesh>
    <mesh position={[0, 1.5, 0]} material={M(PAL.stoneDark)}><boxGeometry args={[2.0, 0.3, 0.7]} /></mesh>
    <mesh position={[0, 0.7, -0.25]} material={M('#0a0806')}><boxGeometry args={[1.1, 1.4, 0.1]} /></mesh>
    {lit > 0 && <>{[-0.25, 0, 0.25].map((x, i) => <Flame key={i} at={[x, 0.1, 0]} s={2.2 - Math.abs(x) * 2} t={t + i} seed={i + 3} light={i === 1 ? 5 * lit : 0} dist={9} halo={i === 1 ? 2 : 0} />)}</>}
  </group>
);
// peg doll (carved wooden doll with a red ribbon), the story's key object
export const Doll: React.FC<{ at?: V3; s?: number; rot?: V3; t?: number }> = ({ at = [0, 0, 0], s = 1, rot = [0, 0, 0] }) => (
  <group position={at} scale={s} rotation={rot}>
    <mesh position={[0, 0.09, 0]} material={M('#a8804e')}><cylinderGeometry args={[0.035, 0.05, 0.18, 7]} /></mesh>
    <mesh position={[0, 0.215, 0]} material={M('#c09a68')}><icosahedronGeometry args={[0.042, 1]} /></mesh>
    <mesh position={[0, 0.235, 0.0]} material={M('#5a3a22')}><icosahedronGeometry args={[0.044, 0]} /></mesh>
    <mesh position={[0, 0.16, 0]} rotation={[Math.PI / 2, 0, 0]} material={M(PAL.red)}><torusGeometry args={[0.043, 0.01, 4, 8]} /></mesh>
    <mesh position={[0.03, 0.14, 0.03]} rotation={[0, 0, 0.5]} material={M(PAL.red)}><boxGeometry args={[0.012, 0.06, 0.012]} /></mesh>
  </group>
);
// an old leather book, open. page = an image drawn in code on a canvas (sketch), so no image file is needed.
export const OldBook: React.FC<{ at?: V3; rot?: V3; s?: number; t: number; sketch?: (x: CanvasRenderingContext2D, w: number, h: number) => void; turn?: number }> = ({ at = [0, 0, 0], rot = [0, 0, 0], s = 1, t, sketch, turn = 0 }) => {
  const tex = useMemo(() => { if (!sketch) return null; const cv = document.createElement('canvas'); cv.width = 512; cv.height = 680; const x = cv.getContext('2d')!; x.fillStyle = '#d8ccb0'; x.fillRect(0, 0, 512, 680); const q = rng(4); for (let i = 0; i < 900; i++) { x.fillStyle = `rgba(90,70,40,${q() * 0.08})`; x.fillRect(q() * 512, q() * 680, 3, 3); } sketch(x, 512, 680); const tt = new THREE.CanvasTexture(cv); tt.colorSpace = THREE.SRGBColorSpace; return tt; }, [sketch]);
  const pageM = useMemo(() => tex ? new THREE.MeshStandardMaterial({ map: tex, roughness: 0.95 }) : M(PAL.paper), [tex]);
  return (
    <group position={at} rotation={rot} scale={s}>
      <mesh position={[0, -0.01, 0]} material={M('#1a1210')}><boxGeometry args={[0.92, 0.03, 0.64]} /></mesh>
      <mesh position={[-0.22, 0.015, 0]} rotation={[0, 0, 0.05]} material={M(PAL.paper)}><boxGeometry args={[0.43, 0.03, 0.6]} /></mesh>
      {Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[-0.22, 0.032, -0.24 + i * 0.075]} rotation={[0, 0, 0.05]} material={M('#4a3e30')}><boxGeometry args={[0.32, 0.002, 0.012]} /></mesh>)}
      <group position={[0.22, 0.03, 0]} rotation={[0, 0, -0.05]}>
        <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]} material={pageM}><planeGeometry args={[0.42, 0.58]} /></mesh>
        <mesh position={[0, -0.015, 0]} material={M(PAL.paper)}><boxGeometry args={[0.43, 0.03, 0.6]} /></mesh>
      </group>
      {turn > 0 && <group position={[0, 0.04, 0]} rotation={[0, 0, Math.PI * Math.min(1, turn)]}><mesh position={[0.21, 0, 0]} material={M('#cfc2a4', { side: 'double' })}><boxGeometry args={[0.42, 0.004, 0.58]} /></mesh></group>}
    </group>
  );
};
export const Lamp = { flick, Halo };
