import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import { CamRig } from './k3/Cam';
import { camAt } from './k3/Cam';
import { Night, Ground, Grass, Mist, Flakes } from './k3/World';
import { Forest, Pine, DeadTree, Rock, River } from './k3/Nature';
import { Cottage, Church, Well, Street, Cabin, Cobbles } from './k3/Build';
import { Room, Bed, Table, Chair, Shelf, Crate, Barrel, Chain, Stairs, Fireplace, Doll, OldBook } from './k3/Interior';
import { Torch, Candle, Lantern, BigFire } from './k3/Fx';
import { Person } from './k3/Person';
import { Creature, HERBERT, HERBERT_LIVING } from './k3/Creature';
import { CAST3, GHOST3 } from './Cast3D';
import { PAL, V3 } from './k3/core';
// KIT LAB 3D: plate i at frame i*100. npx remotion still src/index.ts Lab3 out.png --frame=N
const plates: ((t: number) => { cam: any; node: React.ReactNode })[] = [
  // 0 the permanent cast line-up (front), standing on moonlit ground
  (t) => ({ cam: { p: [0, 1.5, 7.2] as V3, l: [0, 1.0, 0] as V3, fov: 38, move: 'truck' }, node: <>
    <Night t={t} density={0.02} />
    <Ground flat={30} />
    {['noah', 'mira', 'elias', 'rose', 'sam', 'lily'].map((k, i) => <Person key={k} s={CAST3[k]} at={[-3.1 + i * 1.25, 0, 0]} rot={0} t={t + i} seed={i + 1} pose="idle" expr="calm" />)}
  </> }),
  // 1 Noah close (bust, with shoulders and background) + the three ghosts
  (t) => ({ cam: { p: [0.2, 1.55, 3.4] as V3, l: [-0.6, 1.45, 0] as V3, fov: 36, move: 'push' }, node: <>
    <Night t={t} density={0.03} />
    <Ground flat={30} />
    <Person s={CAST3.noah} at={[-0.9, 0, 0]} rot={0.3} t={t} pose="idle" expr="fear" seed={2} />
    {['woman', 'grinner', 'child'].map((k, i) => <Person key={k} s={GHOST3[k]} at={[0.8 + i * 1.1, 0, -0.6]} rot={0} t={t + i * 2} seed={10 + i} pose="idle" expr="calm" />)}
    <Mist t={t} y={0.3} n={10} o={0.1} />
  </> }),
  // 2 Herbert the creature (ghost form) by the pines, and the living man in hat and face cloth
  (t) => ({ cam: { p: [0.5, 1.6, 6.5] as V3, l: [0, 1.5, 0] as V3, fov: 40, move: 'orbit' }, node: <>
    <Night t={t} density={0.035} />
    <Ground flat={24} />
    <Forest t={t} n={26} area={[-16, 16, -22, -5]} snow />
    <Creature c={HERBERT} at={[-1.5, 0, 0]} rot={0.25} t={t} pose="stand" />
    <Creature c={HERBERT_LIVING} at={[1.6, 0, 0]} rot={-0.2} t={t + 3} pose="stand" seed={9} />
    <Grass t={t} n={700} area={[-8, 8, -6, 4]} />
    <Mist t={t} y={0.25} n={12} o={0.12} />
  </> }),
  // 3 the village street at night: lit windows, snow, cobbles, a person walking
  (t) => ({ cam: { p: [0, 1.65, 7] as V3, l: [0, 1.4, -8] as V3, fov: 42, move: 'push' }, node: <>
    <Night t={t} density={0.05} />
    <Ground flat={0} hill={0.8} />
    <Street t={t} n={5} snow />
    <Forest t={t} n={18} area={[-26, 26, -34, -24]} snow />
    <Person s={CAST3.isla} at={[-0.5, 0, -2]} rot={Math.PI} t={t} pose="walk" travel={false} seed={4} />
    <Flakes t={t} n={700} kind="snow" box={[-12, 12, 0, 9, -24, 6]} />
    <Mist t={t} y={0.2} n={14} o={0.1} area={[-14, 14, -24, 6]} />
  </> }),
  // 4 the cellar room: brick walls, chains, crates, a candle, a man bent under the low ceiling
  (t) => ({ cam: { p: [0.4, 1.35, 3.6] as V3, l: [0, 1.1, -1] as V3, fov: 44, move: 'arc' }, node: <>
    <Night t={t} indoor density={0.06} amb={0.34} moonI={0.35} rim={0.25} fill={0.2} disc={null} stars={false} />
    <Room w={7} d={6} h={2.3} wall="brick" stoneFloor t={t} window={null} />
    <Person s={CAST3.terence} at={[-1.5, 0, 0.4]} rot={0.5} t={t} pose="hold" hold="candle" expr="shock" seed={6} />
    <Creature c={HERBERT} at={[1.4, 0, -1.6]} rot={-0.35} t={t} pose="bend" />
    <Chain at={[-2.6, 1.9, -2.9]} t={t} /><Chain at={[2.2, 1.9, -2.9]} t={t} seed={3} />
    <Crate at={[2.6, 0, -0.4]} rot={0.3} /><Crate at={[2.3, 0.6, -0.5]} s={0.5} rot={-0.2} /><Barrel at={[-2.7, 0, -1.2]} s={0.9} />
    <Stairs at={[-2.2, 0, 2.4]} n={7} />
  </> }),
  // 5 the cabin in the woods, burning (fire light on the trees)
  (t) => ({ cam: { p: [2.5, 2.2, 9] as V3, l: [0, 1.4, 0] as V3, fov: 40, move: 'arc' }, node: <>
    <Night t={t} density={0.045} />
    <Ground flat={14} />
    <Cabin at={[0, 0, 0]} t={t} burn={1} />
    <Forest t={t} n={30} area={[-18, 18, -20, -4]} />
    <Grass t={t} n={800} area={[-10, 10, -8, 6]} clear={[[-2.4, 2.4, -2, 2]]} />
    {[0, 1, 2].map((i) => <Person key={i} s={CAST3[['tom', 'terence', 'mckenzie'][i]]} at={[-3 + i * 1.6, 0, 4]} rot={Math.PI} t={t + i} pose="hold" hold="torch" seed={i + 3} />)}
  </> }),
];
export const Lab3: React.FC = () => {
  const i = useCurrentFrame(); const p = Math.floor(i / 100), f = i % 100; const t = f / 60 + 1.2;
  const pl = plates[Math.min(p, plates.length - 1)](t);
  const cs = camAt(pl.cam, t, 4);
  return (
    <AbsoluteFill style={{ background: '#05070b' }}>
      <ThreeCanvas width={1920} height={1080} camera={{ fov: cs.fov, position: cs.pos }}><CamRig s={cs} W={1920} H={1080} />{pl.node}</ThreeCanvas>
    </AbsoluteFill>
  );
};
export const LAB3_PLATES = plates.length;
