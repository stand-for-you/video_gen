import React from 'react';
import { Set3, SetP } from './Stage3';
import { CamSpec } from './k3/Cam';
import { V3, PAL, ss, seg, sway, M } from './k3/core';
import { Night, Ground, Grass, Mist, Flakes } from './k3/World';
import { Forest, Pine, DeadTree, Rock } from './k3/Nature';
import { Room, Floor, BrickWall, Table, Chair, Shelf, Stairs } from './k3/Interior';
import { Door, Window, Cobbles } from './k3/Build';
import { Person } from './k3/Person';
import { CAST3, GHOST3 } from './Cast3D';
import {
  ApartmentStudy,
  OfficeLobby,
  CubicleOffice,
  CrashScene,
  RuralLivingRoom,
  UpstairsStudy,
  SeerVoid,
  CRTMonitor,
  RouterBox,
  PottedPlant,
} from './Seer3';
import ST from './story.json';

const FR = { wide: 1, waist: 0.65, bust: 0.45, close: 0.32, detail: 0.22 } as Record<string, number>;
const dist = (v: any, base: number) => base * (FR[v?.fr as string] ?? 1);

// 1. REEL: Study & Monitor
export const r_study: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} fog="#0a1018" density={0.065} moonI={1.4} amb={0.35} />
    <ApartmentStudy t={t} textRed={v?.alt ? true : false} />
    <Person s={CAST3.noah} at={[0, 0, -1.0]} rot={Math.PI} t={t} pose="hold" expr={v?.alt ? 'fear' : 'calm'} />
  </>
);
r_study.cam = (v, t, len): CamSpec => ({
  p: [0, 1.45, dist(v, 4.4)],
  l: [0, 1.15, -1.8],
  fov: 52,
  move: 'push',
  amt: 0.3,
  breath: 1.2,
});

// 2. REEL: Monitor Glow Detail
export const r_monitor: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} fog="#060910" density={0.08} moonI={0.8} amb={0.2} />
    <group position={[0, -0.4, 0]}>
      <CRTMonitor t={t} at={[0, 0, 0]} textRed={true} lit={true} />
    </group>
    <Mist t={t} n={2} area={[-1, 1, -1, 1]} y={0.2} o={0.08} />
  </>
);
r_monitor.cam = (v, t, len): CamSpec => ({
  p: [0, 0.45, dist(v, 2.2)],
  l: [0, 0.35, 0.1],
  fov: 46,
  move: 'push',
  amt: 0.2,
});

// 3. REEL: Lobby & Potted Ficus
export const r_lobby: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} fog="#141a24" density={0.045} moonI={1.8} amb={0.5} />
    <OfficeLobby t={t} plantOffset={v?.alt ? 0.076 : 0} />
    <Person s={CAST3.noah} at={[0.4, 0, -3.8]} rot={Math.PI * 0.9} t={t} pose="hold" />
  </>
);
r_lobby.cam = (v, t, len): CamSpec => ({
  p: [0, 1.6, dist(v, 6.8)],
  l: [0, 1.3, -5.5],
  fov: 54,
  move: 'push',
  amt: 0.35,
});

// 4. REEL: Street Crash
export const r_crash: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} fog="#0c111a" density={0.06} moonI={1.3} amb={0.35} />
    <CrashScene t={t} />
    <Person s={CAST3.noah} at={[1.2, 0, 1.0]} rot={-0.2} t={t} pose="hold" expr="fear" />
  </>
);
r_crash.cam = (v, t, len): CamSpec => ({
  p: [1.8, 2.4, dist(v, 8.2)],
  l: [-0.6, 1.1, -3.8],
  fov: 54,
  move: 'crane',
  amt: 0.35,
});

// 5. REEL: Living Room with Donna
export const r_living: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} fog="#0a0f16" density={0.055} moonI={1.6} amb={0.4} />
    <RuralLivingRoom t={t} pizzaPresent={true} donnaSleeping={v?.alt ? true : false} />
    <Person s={CAST3.noah} at={[-0.5, 0.25, -0.8]} rot={Math.PI * 0.95} t={t} pose="sit" />
  </>
);
r_living.cam = (v, t, len): CamSpec => ({
  p: [0, 1.6, dist(v, 5.2)],
  l: [0, 0.95, -0.6],
  fov: 52,
  move: 'push',
  amt: 0.28,
});

// 6. REEL: Delivery Courier at Door
export const r_courier: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} fog="#070c14" density={0.065} moonI={1.4} amb={0.35} />
    <Ground flat={10} c="#121815" />
    <mesh position={[0, 2.5, -3.5]} material={M('#32271e')}>
      <boxGeometry args={[10, 5, 0.4]} />
    </mesh>
    <Door at={[0, 0, -3.3]} w={1.2} h={2.2} open={0.9} lit={1.2} t={t} />
    <Person s={CAST3.noah} at={[-0.3, 0, -2.6]} rot={0} t={t} pose="hold" expr="fear" />
    <Person s={CAST3.hulk} at={[0.3, 0, -4.2]} rot={Math.PI} t={t} pose="hold" expr="angry" />
    <pointLight position={[-0.6, 2.2, -3.0]} color="#ffaa44" intensity={2.2} distance={4} />
  </>
);
r_courier.cam = (v, t, len): CamSpec => ({
  p: [0, 1.7, dist(v, 5.4)],
  l: [0.1, 1.35, -3.5],
  fov: 52,
  move: 'push',
  amt: 0.32,
});

// 7. REEL: Study Climax & Hulk in Door
export const r_climax: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} fog="#060910" density={0.07} moonI={1.2} amb={0.3} />
    <UpstairsStudy t={t} textRed={true} hulkInDoor={v?.alt ? true : false} />
  </>
);
r_climax.cam = (v, t, len): CamSpec => ({
  p: [0.8, 1.5, dist(v, 4.8)],
  l: [0, 1.15, -1.6],
  fov: 50,
  move: 'push',
  amt: 0.3,
});

// 8. REEL: Closing Question Card
export const r_qcard: Set3 = ({ t }: SetP) => (
  <>
    <Night t={t} fog="#060810" density={0.07} moonI={0.8} amb={0.2} />
    <Ground flat={16} c="#090d14" />
    <Forest t={t} n={12} area={[-18, 18, -24, -10]} dead={0.5} />
    <Person s={CAST3.noah} at={[0, 0, -1.4]} rot={0} t={t} pose="idle" expr="calm" />
    <group position={[0, 1.2, -5.2]} scale={0.9}><Person s={GHOST3.woman} at={[0, 0, 0]} rot={0} t={t} pose="idle" /></group>
    <Flakes t={t} n={120} box={[-8, 8, 0, 6, -8, 2]} kind="dust" />
  </>
);
r_qcard.cam = (v, t, len): CamSpec => ({
  p: [0, 1.6, 5.4],
  l: [0, 1.25, -1.4],
  fov: 50,
  move: 'push',
  amt: 0.15,
});

export const SETS: Record<string, Set3> = {
  r_study,
  r_monitor,
  r_lobby,
  r_crash,
  r_living,
  r_courier,
  r_climax,
  r_qcard,
};
