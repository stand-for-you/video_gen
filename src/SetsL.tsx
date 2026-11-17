import React from 'react';
import { Set3, SetP } from './Stage3';
import { CamSpec } from './k3/Cam';
import { V3, PAL, ss, seg, sway, M } from './k3/core';
import { Night, Ground, Grass, Mist, Flakes } from './k3/World';
import { Forest, Pine, DeadTree, Rock, Fence } from './k3/Nature';
import { Cottage, Door, Window, Cobbles, Street } from './k3/Build';
import { Room, Table, Chair, Shelf, Stairs, Rug } from './k3/Interior';
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
import { EndScreen3, endCam } from './End3';

const FR = { wide: 1, waist: 0.62, bust: 0.42, close: 0.3, detail: 0.22 } as Record<string, number>;
const dist = (v: any, base: number) => base * (FR[v?.fr as string] ?? 1);

// 1. TEASER & STUDY: Solitaire and First Message
export const study_dark: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} fog="#0a1018" density={0.06} moonI={1.4} amb={0.35} />
    <ApartmentStudy t={t} textRed={v?.alt ? true : false} />
    <Person s={CAST3.noah} at={[0, 0, -1.0]} rot={Math.PI} t={t} pose="hold" expr={v?.alt ? 'fear' : 'calm'} />
  </>
);
study_dark.cam = (v, t, len): CamSpec => ({
  p: [0.8, 1.45, dist(v, 3.8)],
  l: [0, 1.1, -1.8],
  fov: v?.fr === 'close' ? 32 : 44,
  move: v?.alt ? 'push' : 'orbit',
  amt: 0.25,
  breath: 1.1,
});

// 2. MONITOR CLOSEUP: Red letters pulsing on the glass
export const monitor_glow: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} fog="#060910" density={0.08} moonI={0.8} amb={0.2} />
    <group position={[0, -0.4, 0]}>
      <CRTMonitor t={t} at={[0, 0, 0]} textRed={true} lit={true} />
    </group>
    <Mist t={t} n={3} area={[-2, 2, -1, 1]} y={0.2} o={0.08} />
  </>
);
monitor_glow.cam = (v, t, len): CamSpec => ({
  p: [0, 0.4, dist(v, 1.8)],
  l: [0, 0.35, 0.1],
  fov: 34,
  move: 'push',
  amt: 0.18,
  breath: 0.8,
});

// 3. ROUTER / CABLE: Pulling the cord from the wall
export const router_cable: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} fog="#080c14" density={0.07} moonI={1.1} amb={0.3} />
    <Table at={[0, 0, -1.0]} w={2.0} d={1.0} h={0.75} />
    <RouterBox t={t} at={[0, 0.75, -1.0]} />
    <Person s={CAST3.noah} at={[0.4, 0, -0.5]} rot={Math.PI * 0.85} t={t} pose="hold" expr="fear" />
  </>
);
router_cable.cam = (v, t, len): CamSpec => ({
  p: [0.6, 1.25, dist(v, 2.4)],
  l: [0, 0.8, -1.0],
  fov: 36,
  move: 'arc',
  amt: 0.2,
});

// 4. OFFICE LOBBY: The soaring atrium and elevators
export const lobby_empty: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} fog="#141a24" density={0.04} moonI={1.8} amb={0.5} />
    <OfficeLobby t={t} plantOffset={v?.alt ? 0.08 : 0} crowd={v?.crowd ? true : false} />
    <Person s={CAST3.noah} at={[0.6, 0, -3.8]} rot={Math.PI * 0.9} t={t} pose="hold" />
  </>
);
lobby_empty.cam = (v, t, len): CamSpec => ({
  p: [-1.2, 1.7, dist(v, 6.2)],
  l: [0, 1.4, -5.5],
  fov: v?.fr === 'wide' ? 48 : 38,
  move: v?.alt ? 'truck' : 'push',
  amt: 0.35,
  breath: 1.0,
});

// 5. THE PLANT MOVE: Jack shifting the heavy pot
export const plant_shift: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} fog="#121820" density={0.045} moonI={1.6} amb={0.45} />
    <OfficeLobby t={t} plantOffset={0.076} />
    <Person s={CAST3.noah} at={[0.45, 0, -5.2]} rot={-Math.PI / 2} t={t} pose="hold" />
  </>
);
plant_shift.cam = (v, t, len): CamSpec => ({
  p: [1.8, 1.35, dist(v, 3.6)],
  l: [0, 0.9, -5.5],
  fov: 38,
  move: 'push',
  amt: 0.22,
});

// 6. 7TH FLOOR CUBICLES: Jack and Allie
export const cubicle_chat: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} fog="#101722" density={0.035} moonI={1.5} amb={0.5} />
    <CubicleOffice t={t} alliePresent={true} jamesLimp={v?.limp ? true : false} />
  </>
);
cubicle_chat.cam = (v, t, len): CamSpec => ({
  p: [0, 1.55, dist(v, 4.6)],
  l: [0.6, 1.25, -2.0],
  fov: v?.fr === 'close' ? 32 : 44,
  move: v?.alt ? 'arc' : 'push',
  amt: 0.3,
});

// 7. JAMES LIMPING: The boss in agony
export const boss_limp: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} fog="#121720" density={0.04} moonI={1.6} amb={0.45} />
    <CubicleOffice t={t} alliePresent={true} jamesLimp={true} />
  </>
);
boss_limp.cam = (v, t, len): CamSpec => ({
  p: [1.2, 1.5, dist(v, 4.0)],
  l: [0.3, 1.1, 0.4],
  fov: 40,
  move: 'follow',
  amt: 0.4,
});

// 8. CRASH INTERSECTION: 18-wheeler and smashed sedan
export const crash_wide: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} fog="#0c111a" density={0.055} moonI={1.3} amb={0.35} />
    <CrashScene t={t} />
    <Person s={CAST3.noah} at={[2.2, 0, 1.4]} rot={-0.3} t={t} pose="hold" expr="fear" />
  </>
);
crash_wide.cam = (v, t, len): CamSpec => ({
  p: [3.4, 2.2, dist(v, 7.5)],
  l: [-0.8, 1.0, -3.8],
  fov: v?.fr === 'wide' ? 50 : 38,
  move: 'crane',
  amt: 0.35,
  breath: 1.2,
});

// 9. PROMOTION MEETING: Executive office with Diego Salbara
export const office_promo: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} fog="#0e1520" density={0.04} moonI={1.8} amb={0.5} />
    <Room w={12} d={9} h={3.6} wall="plank" wallC="#2d3744" floorC="#1e242d" t={t} window={{ x: 0, moon: true, w: 6.0, h: 2.4 }} />
    <Table at={[0, 0, 0]} w={3.6} d={1.6} h={0.78} />
    <Chair at={[0, 0, -1.2]} rot={0} />
    <Chair at={[0, 0, 1.2]} rot={Math.PI} />
    <Person s={CAST3.elias} at={[0, 0, -1.2]} t={t} pose="sit" expr="calm" />
    <Person s={CAST3.noah} at={[0, 0, 1.2]} rot={Math.PI} t={t} pose="sit" expr="calm" />
  </>
);
office_promo.cam = (v, t, len): CamSpec => ({
  p: [2.8, 1.6, dist(v, 4.8)],
  l: [0, 1.1, 0],
  fov: 42,
  move: 'orbit',
  amt: 0.25,
});

// 10. LIQUOR STORE: Lottery number 27
export const liquor_store: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} fog="#141922" density={0.05} moonI={1.5} amb={0.4} />
    <Room w={9} d={7} h={3.0} wall="brick" wallC="#3a2f26" floorC="#2a221b" t={t} />
    <Shelf at={[-3.4, 0, -1.0]} rot={Math.PI / 2} w={2.8} h={2.4} rows={4} seed={6} />
    <Table at={[0, 0, -0.6]} w={2.4} d={1.0} h={0.88} />
    <Person s={CAST3.tom} at={[-0.4, 0, -0.6]} rot={Math.PI * 0.9} t={t} pose="hold" expr="smile" />
    <Person s={CAST3.noah} at={[1.2, 0, 0.4]} rot={-Math.PI / 3} t={t} pose="hold" />
    <pointLight position={[0, 2.2, 0]} color="#ffdd88" intensity={2.0} distance={5} />
  </>
);
liquor_store.cam = (v, t, len): CamSpec => ({
  p: [1.8, 1.55, dist(v, 4.2)],
  l: [0.2, 1.1, -0.4],
  fov: 40,
  move: 'push',
  amt: 0.28,
});

// 11. COUNTRY HOME: Living room with Donna
export const country_living: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} fog="#0a0f16" density={0.05} moonI={1.6} amb={0.4} />
    <RuralLivingRoom t={t} pizzaPresent={true} donnaSleeping={v?.alt ? true : false} />
    <Person s={CAST3.noah} at={[-0.7, 0.25, -0.8]} rot={Math.PI * 0.95} t={t} pose="sit" />
  </>
);
country_living.cam = (v, t, len): CamSpec => ({
  p: [-1.4, 1.6, dist(v, 4.6)],
  l: [0, 0.9, -0.6],
  fov: v?.fr === 'close' ? 32 : 44,
  move: v?.alt ? 'push' : 'orbit',
  amt: 0.25,
});

// 12. PIZZA DELIVERY: The menacing courier at the door
export const door_courier: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} fog="#070c14" density={0.06} moonI={1.4} amb={0.35} />
    <Ground flat={10} c="#121815" />
    {/* House front facade */}
    <mesh position={[0, 2.5, -3.5]} material={M('#32271e')}>
      <boxGeometry args={[10, 5, 0.4]} />
    </mesh>
    <Door at={[0, 0, -3.3]} w={1.2} h={2.2} open={0.9} lit={1.2} t={t} />
    {/* Inside Jack */}
    <Person s={CAST3.noah} at={[-0.4, 0, -2.6]} rot={0} t={t} pose="hold" expr="fear" />
    {/* Outside Delivery Hulk */}
    <Person s={CAST3.hulk} at={[0.4, 0, -4.2]} rot={Math.PI} t={t} pose="hold" expr="angry" />
    <pointLight position={[-0.8, 2.2, -3.0]} color="#ffaa44" intensity={2.0} distance={4} />
  </>
);
door_courier.cam = (v, t, len): CamSpec => ({
  p: [-1.2, 1.7, dist(v, 4.8)],
  l: [0.2, 1.3, -3.5],
  fov: 42,
  move: 'push',
  amt: 0.3,
});

// 13. UPSTAIRS STUDY CLIMAX: Seer revelation & Hulk entering
export const study_climax: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} fog="#060910" density={0.065} moonI={1.2} amb={0.3} />
    <UpstairsStudy t={t} textRed={true} hulkInDoor={v?.alt ? true : false} />
  </>
);
study_climax.cam = (v, t, len): CamSpec => ({
  p: [1.4, 1.5, dist(v, 4.2)],
  l: [0, 1.1, -1.6],
  fov: v?.fr === 'close' ? 30 : 42,
  move: v?.alt ? 'arc' : 'push',
  amt: 0.28,
  breath: 1.2,
});

// 14. THE SEER VOID: Cosmic tapestry of possibilities
export const seer_void: Set3 = ({ t, v }: SetP) => (
  <>
    <SeerVoid t={t} />
  </>
);
seer_void.cam = (v, t, len): CamSpec => ({
  p: [0, 1.8, dist(v, 5.8)],
  l: [0, 1.4, -4.5],
  fov: 46,
  move: 'crane',
  amt: 0.35,
});

// 15. END SCREEN (last 20 s)
export const end: Set3 = EndScreen3;
end.cam = endCam;

// Export all sets for the Long Video player
export const SETS: Record<string, Set3> = {
  study_dark,
  monitor_glow,
  router_cable,
  lobby_empty,
  plant_shift,
  cubicle_chat,
  boss_limp,
  crash_wide,
  office_promo,
  liquor_store,
  country_living,
  door_courier,
  study_climax,
  seer_void,
  end,
};
