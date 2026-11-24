import React from 'react';
import { Set3, SetP } from './Stage3';
import { MI_SETS } from './MI3';
import { CamSpec } from './k3/Cam';
import { V3, PAL, M, G, sway } from './k3/core';
import { Night, Ground, Mist } from './k3/World';
import { Room } from './k3/Interior';
import { Door } from './k3/Build';
import { Person } from './k3/Person';
import { CAST3, GHOST3 } from './Cast3D';
import { ExamTable, Oscilloscope, ReelConsole, IVStand, IsolationChamber, VoidChamber, FAC } from './GM3';

// Vertical distance helper
const FR: Record<string, number> = { wide: 1, waist: 0.68, bust: 0.48, close: 0.35, detail: 0.26 };
const d = (v: any, base: number) => base * (FR[v?.fr as string] ?? 1);

// ---------- 1. Vertical Isolation Chamber (Opening & Teaser)
export const rchamber: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} indoor density={0.075} amb={0.38} moonI={0.8} rim={0.3} disc={null} stars={false} fog="#14181a" />
    <IsolationChamber t={t} restrained={!!v?.alt} mic={!v?.alt} />
  </>
);
rchamber.camR = (v): CamSpec => ({
  p: [0.2, 1.6, d(v, 4.4) + 0.8],
  l: [0, 1.2, -0.4],
  fov: v?.fr === 'close' ? 44 : 52,
  move: 'push',
  amt: 0.32,
  breath: 1.2,
});

// ---------- 2. Observation Window
export const robs: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} indoor density={0.06} amb={0.4} moonI={0.6} rim={0.25} disc={null} stars={false} fog="#14181a" />
    <Room w={8} d={8} h={3.4} wall="brick" wallC="#2a3235" floorC="#1a2022" t={t} window={null} />
    <Person s={CAST3.dr_reed} at={[-0.4, 0, 0.2]} rot={0.1} pose="look" expr="calm" t={t} seed={5} />
    <ReelConsole at={[0.4, 0, -0.4]} rot={-0.2} t={t} />
  </>
);
robs.camR = (v): CamSpec => ({
  p: [0, 1.65, d(v, 3.4) + 0.8],
  l: [0, 1.35, 0],
  fov: 50,
  move: 'truck',
  amt: 0.25,
  dir: 1,
});

// ---------- 3. Reel-to-Reel Audio Console
export const rtapes: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} indoor density={0.06} amb={0.4} moonI={0.4} rim={0.3} disc={null} stars={false} fog="#121618" />
    <Room w={6} d={6} h={3.0} wall="brick" wallC="#242b2d" floorC="#161b1c" t={t} window={null} />
    <ReelConsole at={[0, 0, 0]} rot={0} t={t} />
    <Person s={CAST3.dr_reed} at={[0, 0, 1.1]} rot={Math.PI} pose="look" expr="calm" t={t} seed={7} />
  </>
);
rtapes.camR = (v): CamSpec => ({
  p: [0.25, 1.4, d(v, 2.2) + 0.5],
  l: [0, 1.0, 0],
  fov: 46,
  move: 'orbit',
  amt: 0.24,
  dir: 1,
});

// ---------- 4. Surgery Suite
export const rsurgery: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} indoor density={0.065} amb={0.42} moonI={0.9} rim={0.35} disc={null} stars={false} fog="#161a1d" />
    <Room w={8} d={8} h={3.4} wall="brick" wallC="#3a4245" floorC="#24292b" t={t} window={null} />
    <ExamTable at={[0, 0, 0]} rot={0} restrained t={t} />
    <Person s={CAST3.subject} at={[0, 0.98, 0]} rot={Math.PI / 2} pose="sit" expr="fear" t={t} seed={2} />
    <Person s={CAST3.dr_reed} at={[-0.7, 0, 0.3]} rot={Math.PI / 4} pose="point" t={t} seed={8} />
  </>
);
rsurgery.camR = (v): CamSpec => ({
  p: [-0.6, 1.8, d(v, 3.4) + 0.8],
  l: [0, 1.15, 0],
  fov: 52,
  move: 'arc',
  amt: 0.28,
  dir: -1,
});

// ---------- 5. Speaking into Microphone
export const rmic: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} indoor density={0.075} amb={0.36} moonI={0.7} rim={0.25} disc={null} stars={false} fog="#121618" />
    <IsolationChamber t={t} restrained mic />
  </>
);
rmic.camR = (v): CamSpec => ({
  p: [0.1, 1.45, d(v, 2.4) + 0.4],
  l: [0.08, 1.25, -0.4],
  fov: 44,
  move: 'push',
  amt: 0.26,
  breath: 1.2,
});

// ---------- 6. Whisper Mist
export const rwhisper: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} indoor density={0.08} amb={0.35} moonI={0.8} rim={0.3} disc={null} stars={false} fog="#11161a" />
    <IsolationChamber t={t} restrained={false} mic={false} />
    <Mist t={t} n={8} area={[-3, 3, -3, 3]} y={0.3} o={0.25} />
  </>
);
rwhisper.camR = (v): CamSpec => ({
  p: [0.4, 1.55, d(v, 3.2) + 0.6],
  l: [0, 1.2, -0.4],
  fov: 48,
  move: 'orbit',
  amt: 0.25,
  dir: 1,
});

// ---------- 7. Wife Apparition
export const rwife: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} indoor density={0.08} amb={0.35} moonI={0.9} rim={0.4} disc={null} stars={false} fog="#11161a" />
    <Room w={8} d={8} h={3.3} wall="brick" wallC="#2e3639" floorC="#1e2426" t={t} window={null} />
    <ExamTable at={[0, 0, 0]} rot={0.1} t={t} />
    <Person s={CAST3.subject} at={[0, 0.98, 0]} rot={Math.PI / 2} pose="sit" expr="fear" t={t} seed={3} />
    <Person s={GHOST3.woman} at={[-0.6, 0.1, -1.0]} rot={0.4} pose="stand" t={t} seed={11} />
    <Mist t={t} n={7} area={[-3, 3, -3, 1]} y={0.3} o={0.24} />
  </>
);
rwife.camR = (v): CamSpec => ({
  p: [0.5, 1.7, d(v, 3.4) + 0.7],
  l: [-0.2, 1.25, -0.5],
  fov: 50,
  move: 'arc',
  amt: 0.3,
  dir: -1,
});

// ---------- 8. Shocked Scientist
export const rshock: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} indoor density={0.065} amb={0.38} moonI={0.7} rim={0.3} disc={null} stars={false} fog="#13171a" />
    <Room w={7} d={7} h={3.2} wall="brick" wallC="#283033" floorC="#1b2022" t={t} window={null} />
    <Person s={CAST3.dr_reed} at={[0, 0, 0]} rot={0} pose="look" expr="fear" t={t} seed={10} />
  </>
);
rshock.camR = (v): CamSpec => ({
  p: [0, 1.6, d(v, 2.4) + 0.4],
  l: [0, 1.45, 0],
  fov: 44,
  move: 'push',
  amt: 0.24,
});

// ---------- 9. Fleeing Hallway
export const rhall: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} indoor density={0.065} amb={0.35} moonI={0.6} rim={0.25} disc={null} stars={false} fog="#14181b" />
    <Room w={5} d={12} h={3.2} wall="brick" wallC="#333a3d" floorC="#202527" t={t} window={null} />
    <group position={[0, 0, -5.8]}>
      <Door at={[0, 0, 0]} w={1.2} h={2.2} open={0.4} lit={1} t={t} />
    </group>
    <Person s={CAST3.noah} at={[-0.3, 0, -2.5]} rot={Math.PI} pose="stalk" t={t} seed={15} />
  </>
);
rhall.camR = (v): CamSpec => ({
  p: [0, 2.1, d(v, 4.8) + 1.0],
  l: [0, 1.35, -4.0],
  fov: 54,
  move: 'crane',
  amt: -0.6,
});

// ---------- 10. Hysteria Slam
export const rslam: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} indoor density={0.08} amb={0.32} moonI={0.8} rim={0.35} disc={null} stars={false} fog="#101416" />
    <Room w={7} d={7} h={3.4} wall="brick" wallC="#2e3538" floorC="#1d2224" t={t} window={null} />
    <Person s={CAST3.subject} at={[-2.2, 0, -1.2]} rot={Math.PI / 3} pose="point" expr="fear" t={t} seed={18} />
  </>
);
rslam.camR = (v): CamSpec => ({
  p: [-0.9, 1.7, d(v, 3.4) + 0.6],
  l: [-2.0, 1.25, -1.2],
  fov: 52,
  move: 'push',
  amt: 0.35,
});

// ---------- 11. Sedative Sleep
export const rsedative: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} indoor density={0.07} amb={0.36} moonI={0.7} rim={0.25} disc={null} stars={false} fog="#121619" />
    <Room w={7} d={7} h={3.2} wall="brick" wallC="#2c3336" floorC="#1c2123" t={t} window={null} />
    <ExamTable at={[0, 0, 0]} rot={0} t={t} />
    <Person s={CAST3.subject} at={[0, 0.98, 0]} rot={Math.PI / 2} pose="sit" expr="calm" t={t} seed={20} />
    <IVStand at={[1.0, 0, 0]} t={t} />
  </>
);
rsedative.camR = (v): CamSpec => ({
  p: [0.6, 1.6, d(v, 2.6) + 0.6],
  l: [0.15, 1.1, 0],
  fov: 46,
  move: 'truck',
  amt: 0.22,
  dir: -1,
});

// ---------- 12. Full Nightmare Void
export const rvoid: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} density={0.08} amb={0.28} moonI={1.2} fog="#0a0e10" />
    <VoidChamber t={t} />
  </>
);
rvoid.camR = (v): CamSpec => ({
  p: [1.4, 2.0, d(v, 4.0) + 0.8],
  l: [0, 1.1, -0.8],
  fov: 52,
  move: 'orbit',
  amt: 0.32,
  dir: 1,
});

// ---------- 13. Red Alarm Scream
export const ralarm: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} indoor density={0.075} amb={0.35} moonI={0.7} rim={0.3} disc={null} stars={false} fog="#150f11" />
    <IsolationChamber t={t} alarm />
  </>
);
ralarm.camR = (v): CamSpec => ({
  p: [-0.5, 1.7, d(v, 3.8) + 0.7],
  l: [0, 1.2, -0.4],
  fov: 50,
  move: 'arc',
  amt: 0.3,
  dir: 1,
});

// ---------- 14. Restrained on Table
export const rrestrain: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} indoor density={0.07} amb={0.38} moonI={0.8} rim={0.3} disc={null} stars={false} fog="#13171a" />
    <IsolationChamber t={t} restrained />
  </>
);
rrestrain.camR = (v): CamSpec => ({
  p: [0.4, 1.8, d(v, 3.2) + 0.6],
  l: [0, 1.1, -0.4],
  fov: 48,
  move: 'crane',
  amt: -0.4,
});

// ---------- 15. Tears Ceiling
export const rtears: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} indoor density={0.07} amb={0.34} moonI={0.6} rim={0.25} disc={null} stars={false} fog="#121619" />
    <Room w={6} d={6} h={3.2} wall="brick" wallC="#2a3235" floorC="#1a2022" t={t} window={null} />
    <ExamTable at={[0, 0, 0]} rot={0} restrained t={t} />
    <Person s={CAST3.subject} at={[0, 0.98, 0]} rot={Math.PI / 2} pose="sit" expr="calm" t={t} seed={25} />
  </>
);
rtears.camR = (v): CamSpec => ({
  p: [0.05, 2.05, d(v, 2.0) + 0.4],
  l: [0, 1.05, 0],
  fov: 42,
  move: 'push',
  amt: 0.2,
});

// ---------- 16. Focused Eye Contact
export const reye: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} indoor density={0.075} amb={0.38} moonI={0.8} rim={0.35} disc={null} stars={false} fog="#13171a" />
    <IsolationChamber t={t} restrained />
  </>
);
reye.camR = (v): CamSpec => ({
  p: [0, 1.45, d(v, 2.0) + 0.3],
  l: [0, 1.2, -0.4],
  fov: 40,
  move: 'push',
  amt: 0.25,
});

// ---------- 17. Flatline CRT Screen
export const rflatline: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} indoor density={0.06} amb={0.35} moonI={0.3} rim={0.2} disc={null} stars={false} fog="#0f1416" />
    <Room w={5} d={5} h={3.0} wall="brick" wallC="#202628" floorC="#15191b" t={t} window={null} />
    <Oscilloscope at={[0, 0.4, 0]} rot={0} flatline t={t} />
  </>
);
rflatline.camR = (v): CamSpec => ({
  p: [0, 0.74, d(v, 1.5) + 0.3],
  l: [0, 0.72, 0],
  fov: 38,
  move: 'push',
  amt: 0.18,
});

// ---------- 18. Closing Question Card Scene (Reel ending)
export const rqcard: Set3 = ({ t }: SetP) => (
  <>
    <Night t={t} indoor density={0.075} amb={0.35} moonI={0.7} rim={0.25} disc={null} stars={false} fog="#121619" />
    <IsolationChamber t={t} restrained />
  </>
);
rqcard.camR = (): CamSpec => ({
  p: [0, 1.5, 3.8],
  l: [0, 1.15, -0.4],
  fov: 48,
  move: 'push',
  amt: 0.22,
});

// The monster-introduction pack carries its own vertical cameras (camR), so the same
// set names work in the Reel without being redrawn.
export const SETS: Record<string, Set3> = {
  ...MI_SETS,
  rchamber,
  robs,
  rtapes,
  rsurgery,
  rmic,
  rwhisper,
  rwife,
  rshock,
  rhall,
  rslam,
  rsedative,
  rvoid,
  ralarm,
  rrestrain,
  rtears,
  reye,
  rflatline,
  rqcard,
};
