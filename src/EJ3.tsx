import React from 'react';
import { PAL, M, G, rng, sway, ss, V3 } from './k3/core';
import { Night, Ground, Grass, Mist, Halo } from './k3/World';
import { Forest, Pine, Fence, Rock } from './k3/Nature';
import { Window, Door } from './k3/Build';
import { Room, Floor, PlankWall, Bed, Table, Chair, Shelf, Crate, Rug } from './k3/Interior';
import { Person } from './k3/Person';
import { Creature, C3 } from './k3/Creature';
import { MITCH, MITCH_BED, EDWIN, DOCTOR } from './EJCast';
// ===== STORY KIT r: "EYELESS JACK" - a cheap suburban house, pine woods behind the fence, and a small hospital.
// Palette: clinical teal-green + charcoal, sodium-amber porch light, ONE red accent (the camera's record light, the EXIT sign).
export const EJP = { fog: '#1b242a', night: '#121a20', amber: '#ffa24a', teal: '#7fd3c4', red: '#ff3a2e', wall: '#8a8f8c', wall2: '#6f7a78' };

// ---- the creature, built only from the words of the story: a hood, a blank grey-green face with no nose and no mouth,
// two hollow black sockets, and something dark running out of them. It is NOT the famous mask picture: our own design.
export const EJ: C3 = {
  id: 'ej', name: 'THE EYELESS ONE', skin: '#6d7a71', height: 1.96, hunch: 0.24, armL: 1.14, fingerL: 1.18, legL: 1.08, thin: 0.84,
  eyes: 'black', mouth: 'none', teeth: 0, veins: false, ribs: false, claws: '#1e2024', dress: 'living',
  hood: '#1c2028', tears: '#0b0d10', clothC: '#7b8a80', coatC: '#1d2028', trouC: '#15171c', ragC: '#191b21',
};
// the creature with its own cold edge light, so the hood reads against a dark room without lighting the whole wall
export const Eyeless: React.FC<{ at?: V3; rot?: number; t: number; pose?: any; pose2?: any; p?: number; scale?: number; look?: [number, number] }> =
  ({ at = [0, 0, 0], rot = 0, t, pose = 'stand', pose2, p, scale = 1, look }) => (
    <group>
      <Creature c={EJ} at={at} rot={rot} t={t} pose={pose} pose2={pose2} p={p} scale={scale} look={look ?? [sway(t, 7, 0.12, 4), 0]} seed={9} />
      <pointLight position={[at[0] - 0.9, at[1] + 1.8, at[2] + 0.9]} intensity={3.4} distance={6} decay={1.7} color="#a8bdd0" />
      <pointLight position={[at[0] + 1.0, at[1] + 1.5, at[2] - 0.8]} intensity={1.8} distance={5} decay={1.8} color="#5c7f78" />
      <pointLight position={[at[0] - 0.8, at[1] + 0.95, at[2] + 0.35]} intensity={2.2} distance={3.2} decay={1.9} color="#b6c6d4" />
    </group>
  );

// ---- props
export const Blinds: React.FC<{ at: V3; w?: number; h?: number; t: number; open?: number }> = ({ at, w = 1.2, h = 1.1, t, open = 0.25 }) => {
  const n = 11;
  return <group position={at}>{Array.from({ length: n }, (_, i) => (
    <mesh key={i} position={[0, h / 2 - (i + 0.5) * (h / n), 0.01 + 0.004 * Math.sin(t * 0.7 + i * 0.6)]}
      rotation={[open * 0.5 + 0.03 * Math.sin(t * 0.6 + i), 0, 0]} material={M('#b9bdb6')}>
      <boxGeometry args={[w, h / n - 0.012, 0.012]} /></mesh>))}</group>;
};
export const Camera3: React.FC<{ at: V3; rot?: number; t: number; rec?: boolean; s?: number }> = ({ at, rot = 0, t, rec = true, s = 1 }) => (
  <group position={at} rotation={[0, rot, 0]} scale={s}>
    <mesh material={M('#23262b')}><boxGeometry args={[0.13, 0.085, 0.07]} /></mesh>
    <mesh position={[0.018, 0, 0.05]} material={M('#15171a')}><cylinderGeometry args={[0.028, 0.03, 0.035, 10]} /></mesh>
    <mesh position={[0.018, 0, 0.068]} rotation={[Math.PI / 2, 0, 0]} material={M('#3a4046')}><cylinderGeometry args={[0.022, 0.022, 0.006, 10]} /></mesh>
    <mesh position={[-0.04, 0.052, 0]} material={M('#2c3036')}><boxGeometry args={[0.03, 0.02, 0.05]} /></mesh>
    {rec && <mesh position={[-0.05, 0.012, 0.037]} material={G(EJP.red)}><boxGeometry args={[0.012, 0.008, 0.004]} /></mesh>}
    {rec && <pointLight position={[-0.05, 0.02, 0.1]} intensity={0.25} distance={0.7} color={EJP.red} />}
  </group>
);
export const Boxes: React.FC<{ at?: V3; n?: number; seed?: number; spread?: number }> = ({ at = [0, 0, 0], n = 6, seed = 5, spread = 2.4 }) => {
  const q = rng(seed);
  return <group position={at}>{Array.from({ length: n }, (_, i) => {
    const s = 0.4 + q() * 0.22, x = (q() - 0.5) * spread, z = (q() - 0.5) * 1.1, up = q() > 0.72;
    return <group key={i}>
      <group position={[x, 0, z]} rotation={[0, (q() - 0.5) * 0.8, 0]}>
        <mesh position={[0, s / 2, 0]} material={M(i % 3 ? '#8a7254' : '#7c674c')}><boxGeometry args={[s, s, s * 0.85]} /></mesh>
        <mesh position={[0, s + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]} material={M('#9a8b6e')}><planeGeometry args={[s * 0.98, s * 0.83]} /></mesh>
        <mesh position={[0, s * 0.62, s * 0.43]} material={M('#cfc6b4')}><boxGeometry args={[s * 0.5, s * 0.1, 0.004]} /></mesh>
        {up && <mesh position={[0, s * 1.5, 0]} rotation={[0, 0.4, 0]} material={M('#80694f')}><boxGeometry args={[s * 0.85, s * 0.9, s * 0.7]} /></mesh>}
      </group></group>;
  })}</group>;
};
export const Bundle: React.FC<{ at: V3; t: number; open?: boolean; hands?: boolean }> = ({ at, t, open = false, hands = false }) => (
  <group position={at} rotation={[0, 0.3, 0]}>
    <mesh position={[0, 0.03, 0]} rotation={[0.1, 0, 0.05]} material={M('#b8b2a4')}><boxGeometry args={[0.2, 0.055, 0.16]} /></mesh>
    {!open && <mesh position={[0, 0.062, 0]} rotation={[0, 0.5, 0.2]} material={M('#a8a294')}><boxGeometry args={[0.15, 0.03, 0.12]} /></mesh>}
    {open && <mesh position={[0, 0.07, 0]} material={M('#4a2f33')}><icosahedronGeometry args={[0.045, 0]} /></mesh>}
    {open && <mesh position={[0.04, 0.047, 0.03]} rotation={[-Math.PI / 2, 0, 0.3]} material={M('#2a2026')}><circleGeometry args={[0.07, 7]} /></mesh>}
    {hands && <mesh position={[0, -0.02, 0.02]} rotation={[0.2 + 0.02 * Math.sin(t), 0, 0]} material={M('#c89a78')}><boxGeometry args={[0.26, 0.04, 0.2]} /></mesh>}
  </group>
);
// ---- places
export const Bedroom: React.FC<{ t: number; lamp?: number; open?: number; boxes?: boolean; cam?: boolean; door?: number; bump?: number }> =
  ({ t, lamp = 0, open = 0, boxes = true, cam = true, door = 0.25, bump = 1 }) => (
    <group>
      <Room w={4.6} d={4.4} h={2.6} wall="plank" wallC={EJP.wall} floorC="#6a5a48" t={t} window={{ x: 0, moon: false }} beams={false} />
      <mesh position={[0, 1.45, -2.18]} material={M('#2a3340')}><boxGeometry args={[1.26, 1.16, 0.04]} /></mesh>
      <mesh position={[0, 1.45 + 0.6 * open, -2.14]} material={M(EJP.wall2)}><boxGeometry args={[1.3, 0.1, 0.06]} /></mesh>
      <Blinds at={[0, 1.45, -2.1]} t={t} open={open > 0.2 ? 0.9 : 0.25} />
      <pointLight position={[0, 1.6, -1.9]} intensity={1.5} distance={6} decay={1.6} color="#6f8fc8" />
      <Bed at={[0.1, 0, 0.4]} rot={0} t={t} c="#4a4a52" blanket="#53606a" bump={bump} w={1.25} />
      <Shelf at={[-2.0, 0, -0.6]} rot={Math.PI / 2} w={1.1} h={1.3} rows={2} seed={4} />
      {cam && <Camera3 at={[-1.92, 1.36, -0.6]} rot={1.1} t={t} />}
      {boxes && <Boxes at={[1.5, 0, -1.2]} n={6} seed={7} spread={1.5} />}
      <Rug at={[0.2, 0, 1.2]} w={1.8} d={1.2} c="#3d4a4a" c2="#5a6a62" />
      <Door at={[-0.9, 0, 2.18]} open={door} lit={0.6} t={t} />
      {lamp > 0 && <><mesh position={[1.5, 0.52, 0.6]} material={M('#d8cfbe')}><cylinderGeometry args={[0.12, 0.16, 0.2, 7]} /></mesh>
        <pointLight position={[1.5, 0.6, 0.6]} intensity={2.4 * lamp} distance={5} decay={1.7} color={EJP.amber} />
        <Halo at={[1.5, 0.58, 0.6]} r={0.5} c={EJP.amber} o={0.14 * lamp} t={t} /></>}
      <Mist t={t} n={3} area={[-2, 2, -2, 2]} y={0.25} o={0.05} c="#2a3238" size={5} />
    </group>
  );
export const Hall: React.FC<{ t: number; lamp?: number; far?: boolean; shake?: number }> = ({ t, lamp = 0.6, far = false, shake = 0 }) => (
  <group position={[0, 0, shake ? 0.01 * Math.sin(t * 9) : 0]}>
    <Floor w={2.4} d={12} seed={6} c="#5f5244" />
    <PlankWall w={12} h={2.6} at={[-1.2, 0, -4]} rot={Math.PI / 2} seed={3} c={EJP.wall} />
    <PlankWall w={12} h={2.6} at={[1.2, 0, -4]} rot={-Math.PI / 2} seed={5} c={EJP.wall} />
    <mesh position={[0, 2.6, -4]} material={M('#3a3f3e')}><boxGeometry args={[2.4, 0.06, 12]} /></mesh>
    {[-2.2, -5.4, -8.4].map((z, i) => <Door key={i} at={[i % 2 ? 1.16 : -1.16, 0, z]} rot={i % 2 ? -Math.PI / 2 : Math.PI / 2} open={i === 1 ? 0.35 : 0} lit={i === 1 ? 0.4 : 0} t={t} />)}
    <pointLight position={[0, 2.3, -1.2]} intensity={4.4 * lamp} distance={8} decay={1.7} color={EJP.amber} />
    <Halo at={[0, 2.3, -1.2]} r={0.7} c={EJP.amber} o={0.12} t={t} />
    {far && <><pointLight position={[0, 2.1, -10.2]} intensity={2.2} distance={7} decay={1.7} color={EJP.amber} /><mesh position={[0.15, 0.09, -9.3]} rotation={[0, 0.4, 0]} material={M('#20242a')}><boxGeometry args={[1.5, 0.18, 0.5]} /></mesh>
      <Bundle at={[0.75, 0.02, -8.8]} t={t} /></>}
    <Mist t={t} n={3} area={[-1, 1, -9, -2]} y={0.3} o={0.06} c="#2a3238" size={4} />
  </group>
);
export const Kitchen: React.FC<{ t: number; cup?: number; mirror?: boolean }> = ({ t, cup = 0, mirror = false }) => (
  <group>
    <Room w={4.4} d={4} h={2.6} wall="plank" wallC="#8f9490" floorC="#6a6256" t={t} window={{ x: 1.4, moon: false }} beams={false} />
    <mesh position={[-1.6, 0.45, -1.2]} material={M('#7b7f7a')}><boxGeometry args={[1.1, 0.9, 0.62]} /></mesh>
    <mesh position={[-1.6, 0.91, -1.2]} material={M('#4e5450')}><boxGeometry args={[1.14, 0.04, 0.66]} /></mesh>
    <Table at={[0.4, 0, 0.3]} w={1.2} d={0.8} c="#6b5a44" />
    <Chair at={[0.4, 0, 1.1]} rot={Math.PI} c="#5a4c3a" />
    {cup < 1 && <mesh position={[0.4, 0.82, 0.3]} material={M('#cfd4cc')}><cylinderGeometry args={[0.045, 0.04, 0.09, 8]} /></mesh>}
    {cup >= 1 && <><mesh position={[0.62, 0.04, 0.72]} rotation={[1.4, 0.4, 0]} material={M('#cfd4cc')}><cylinderGeometry args={[0.045, 0.04, 0.09, 8]} /></mesh>
      <mesh position={[0.66, 0.012, 0.78]} rotation={[-Math.PI / 2, 0, 0]} material={M('#3a2c20')}><circleGeometry args={[0.16, 9]} /></mesh></>}
    {mirror && <mesh position={[-2.1, 1.5, 0.2]} rotation={[0, Math.PI / 2, 0]} material={M('#9fb2b8')}><boxGeometry args={[0.42, 0.54, 0.03]} /></mesh>}
    <pointLight position={[0, 2.3, 0]} intensity={3.2} distance={9} decay={1.6} color="#ffd6a0" />
  </group>
);
export const HouseOut: React.FC<{ t: number; porch?: number; bins?: boolean; door?: number }> = ({ t, porch = 1, bins = true, door = 0 }) => (
  <group>
    <Ground flat={14} c="#20262a" />
    <group position={[0, 0, -3]}>
      <mesh position={[0, 1.5, 0]} material={M('#5a615e')}><boxGeometry args={[7, 3, 6]} /></mesh>
      <mesh position={[0, 3.3, 0]} rotation={[0, Math.PI / 4, 0]} material={M('#3f4644')}><coneGeometry args={[5.2, 1.3, 4]} /></mesh>
      <Door at={[0, 0, 3.02]} open={door} lit={0.5} t={t} />
      <Window at={[-2.1, 1.5, 3.02]} t={t} lit={0.5} w={0.9} h={0.8} light={1.1} />
      <Window at={[2.1, 1.5, 3.02]} t={t} lit={0} w={0.9} h={0.8} light={0} />
      <Window at={[1.9, 1.6, -3.02]} t={t} lit={0.2} w={1.0} h={0.9} light={0.4} />
      <mesh position={[0, 2.5, 3.6]} material={M('#4a514e')}><boxGeometry args={[4.4, 0.12, 1.3]} /></mesh>
      {[-1.9, 1.9].map((x, i) => <mesh key={i} position={[x, 1.25, 4.2]} material={M('#4a514e')}><boxGeometry args={[0.12, 2.5, 0.12]} /></mesh>)}
      {porch > 0 && <><mesh position={[0.7, 2.36, 3.3]} material={G(EJP.amber)}><boxGeometry args={[0.16, 0.1, 0.16]} /></mesh>
        <pointLight position={[0.7, 2.3, 3.4]} intensity={4 * porch} distance={9} decay={1.6} color={EJP.amber} />
        <Halo at={[0.7, 2.34, 3.3]} r={0.9} c={EJP.amber} o={0.16 * porch} t={t} /></>}
    </group>
    {bins && [[-3.4, 0.9], [-2.9, 1.3]].map(([x, z], i) => <mesh key={i} position={[x, 0.45, z]} rotation={[0, i * 0.4, 0]} material={M(i ? '#3a4a3e' : '#2f3a44')}><boxGeometry args={[0.55, 0.9, 0.55]} /></mesh>)}
    <Fence from={[-9, 0, 5.5]} to={[9, 0, 5.5]} n={18} h={1.2} c="#3e3a33" />
    <Forest t={t} n={14} area={[-16, 16, -16, -9]} />
    <Grass t={t} n={70} area={[-8, 8, 1, 5]} c="#2c3a30" />
    <Mist t={t} n={4} area={[-10, 10, -6, 6]} y={0.35} o={0.08} c="#28323a" size={9} />
  </group>
);
export const Woods: React.FC<{ t: number; run?: boolean; amber?: number }> = ({ t, run = false, amber = 0.5 }) => (
  <group>
    <Ground flat={0} hill={0.4} c="#1c241f" />
    <Forest t={t} n={26} area={[-16, 16, -22, 6]} clear={[[-2, 2, -6, 4]]} dead={0.12} />
    <Rock at={[1.4, 0, -1.2]} s={0.4} seed={3} />
    <Rock at={[-2.2, 0, -4.4]} s={0.6} seed={5} />
    <Grass t={t} n={90} area={[-7, 7, -8, 5]} c="#2a3328" />
    <Mist t={t} n={5} area={[-10, 10, -14, 4]} y={0.4} o={0.1} c="#26302c" size={9} />
    {amber > 0 && <pointLight position={[0, 3, 9]} intensity={3 * amber} distance={22} decay={1.4} color={EJP.amber} />}
  </group>
);
export const Ward: React.FC<{ t: number; person?: boolean; doc?: boolean; chart?: boolean }> = ({ t, person = true, doc = false, chart = false }) => (
  <group>
    <Room w={5} d={4.6} h={2.7} wall="plank" wallC="#b4bcb8" floorC="#8e968f" t={t} window={{ x: 1.8, moon: false }} beams={false} />
    <group position={[-0.4, 0, 0]}>
      <mesh position={[0, 0.58, 0]} material={M('#cfd6d2')}><boxGeometry args={[1.0, 0.18, 2.1]} /></mesh>
      <mesh position={[0, 0.3, 0]} material={M('#7d8a88')}><boxGeometry args={[0.9, 0.3, 1.9]} /></mesh>
      {[-1, 1].map((k) => <mesh key={k} position={[k * 0.53, 0.84, 0.25]} material={M('#9aa6a4')}><boxGeometry args={[0.04, 0.42, 1.1]} /></mesh>)}
      <mesh position={[0, 0.72, -0.85]} rotation={[0.25, 0, 0]} material={M('#e2e6e0')}><boxGeometry args={[0.6, 0.1, 0.4]} /></mesh>
      <mesh position={[0, 0.69, 0.3]} material={M('#9fb0ad')}><boxGeometry args={[0.95, 0.06, 1.5]} /></mesh>
    </group>
    <mesh position={[1.1, 1.0, -1.0]} material={M('#8d9794')}><cylinderGeometry args={[0.03, 0.03, 2.0, 6]} /></mesh>
    <mesh position={[1.1, 1.75, -1.0]} material={M('#cfe0dc')}><boxGeometry args={[0.12, 0.22, 0.07]} /></mesh>
    <mesh position={[2.1, 1.55, -1.6]} material={M('#1d2420')}><boxGeometry args={[0.5, 0.34, 0.06]} /></mesh>
    <mesh position={[2.1, 1.55, -1.56]} material={G(EJP.teal)}><boxGeometry args={[0.42, 0.02, 0.01]} /></mesh>
    <mesh position={[-2.3, 1.3, 0.4]} rotation={[0, 0.2, 0]} material={M('#9fb6ae')}><boxGeometry args={[0.04, 2.6, 2.4]} /></mesh>
    {chart && <mesh position={[0.65, 0.92, 1.0]} rotation={[0.9, 0.2, 0]} material={M('#e6e2d4')}><boxGeometry args={[0.24, 0.32, 0.01]} /></mesh>}
    {person && <Person s={MITCH_BED} at={[-0.4, 0.31, 0.1]} rot={0.1} t={t} pose="sit" expr="sad" seed={3} />}
    {doc && <Person s={DOCTOR} at={[0.95, 0, 0.5]} rot={-2.1} t={t} pose="idle" expr="calm" seed={6} />}
    <pointLight position={[0, 2.4, 0]} intensity={4.2} distance={10} decay={1.5} color="#cfe6e0" />
    <pointLight position={[1.6, 1.6, 1.4]} intensity={1.4} distance={6} decay={1.7} color={EJP.teal} />
  </group>
);
export const Corridor: React.FC<{ t: number; chairs?: boolean; people?: number }> = ({ t, chairs = true, people = 0 }) => (
  <group>
    <Floor w={3} d={14} seed={9} c="#9aa29c" />
    <PlankWall w={14} h={2.7} at={[-1.5, 0, -5]} rot={Math.PI / 2} seed={2} c="#b7beb9" />
    <PlankWall w={14} h={2.7} at={[1.5, 0, -5]} rot={-Math.PI / 2} seed={4} c="#b7beb9" />
    <mesh position={[0, 2.7, -5]} material={M('#cdd4cf')}><boxGeometry args={[3, 0.06, 14]} /></mesh>
    {[-2, -5, -8].map((z, i) => <Door key={i} at={[i % 2 ? 1.46 : -1.46, 0, z]} rot={i % 2 ? -Math.PI / 2 : Math.PI / 2} open={0} lit={0.2} t={t} />)}
    {[-1.5, -4.5, -7.5].map((z, i) => <group key={'l' + i}><mesh position={[0, 2.66, z]} material={G('#dff0ea')}><boxGeometry args={[0.5, 0.05, 0.14]} /></mesh>
      <pointLight position={[0, 2.5, z]} intensity={2.6} distance={7} decay={1.6} color="#d8ece6" /></group>)}
    <mesh position={[0, 2.3, -9.4]} material={G(EJP.red)}><boxGeometry args={[0.5, 0.2, 0.04]} /></mesh>
    <pointLight position={[0, 2.2, -9.2]} intensity={1.1} distance={4} decay={1.8} color={EJP.red} />
    {chairs && [-0.9, -0.35, 0.2].map((x, i) => <Chair key={i} at={[1.0, 0, -1.4 + i * 0.6]} rot={-Math.PI / 2} c="#4c5a60" />)}
    {people > 0 && <Person s={DOCTOR} at={[-0.5, 0, -6.5]} rot={0.2} t={t} pose="walk" expr="calm" seed={4} far />}
  </group>
);
export const CarKerb: React.FC<{ t: number; inside?: boolean; bundle?: boolean; open?: boolean }> = ({ t, inside = false, bundle = false, open = false }) => (
  inside ? (
    <group>
      <mesh position={[0, 0.4, -0.75]} material={M('#3a4048')}><boxGeometry args={[1.9, 0.75, 0.55]} /></mesh>
      <mesh position={[0, 0.95, -1.0]} material={M('#454c55')}><boxGeometry args={[1.9, 0.75, 0.14]} /></mesh>
      <mesh position={[0, 0.02, 0.1]} rotation={[-Math.PI / 2, 0, 0]} material={M('#2b3138')}><planeGeometry args={[2.0, 2.0]} /></mesh>
      <mesh position={[-1.08, 0.9, -0.2]} material={M('#333a42')}><boxGeometry args={[0.1, 1.1, 1.6]} /></mesh>
      <mesh position={[-1.02, 1.35, -0.2]} material={M('#20262e')}><boxGeometry args={[0.03, 0.6, 1.3]} /></mesh>
      <mesh position={[0, 1.95, -1.3]} material={M('#20262e')}><boxGeometry args={[2.1, 0.08, 1.2]} /></mesh>
      {bundle && <Bundle at={[0, 0.78, -0.42]} t={t} open={open} hands />}
      <pointLight position={[0.2, 1.5, 0.9]} intensity={5.0} distance={5} decay={1.6} color={EJP.amber} />
      <pointLight position={[-1.3, 1.2, -0.4]} intensity={1.6} distance={4} decay={1.8} color="#8fa8c8" />
    </group>
  ) : (
    <group>
      <Ground flat={16} c="#242a2e" />
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.55, 0]} material={M('#6b5a63')}><boxGeometry args={[4.2, 0.6, 1.8]} /></mesh>
        <mesh position={[-0.2, 1.05, 0]} material={M('#5b4e57')}><boxGeometry args={[2.2, 0.55, 1.7]} /></mesh>
        <mesh position={[-0.2, 1.06, 0.86]} material={M('#18202a')}><boxGeometry args={[2.0, 0.45, 0.04]} /></mesh>
        {[[-1.4, 0.9], [1.4, 0.9], [-1.4, -0.9], [1.4, -0.9]].map(([x, z], i) => <mesh key={i} position={[x, 0.33, z]} rotation={[Math.PI / 2, 0, 0]} material={M('#17191c')}><cylinderGeometry args={[0.33, 0.33, 0.22, 10]} /></mesh>)}
      </group>
      <mesh position={[0, 0.02, 3.2]} rotation={[-Math.PI / 2, 0, 0]} material={M('#33383a')}><planeGeometry args={[26, 5]} /></mesh>
      <pointLight position={[-3.4, 4.2, 2.4]} intensity={11} distance={22} decay={1.5} color={EJP.amber} />
      <Mist t={t} n={3} area={[-8, 8, -4, 6]} y={0.3} o={0.07} c="#2a3238" size={8} />
      <pointLight position={[2.5, 2.2, 3.2]} intensity={3.2} distance={10} decay={1.7} color="#8fa8c8" />
    </group>
  )
);
