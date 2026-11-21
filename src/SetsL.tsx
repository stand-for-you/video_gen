import React from 'react';
import { Set3, SetP } from './Stage3';
import { CamSpec } from './k3/Cam';
import { V3, PAL, M, G, ss, seg, sway } from './k3/core';
import { Night, Ground, Grass, Mist, Flakes } from './k3/World';
import { DeadTree, Gravestone } from './k3/Nature';
import { Room, Door, Table, Chair } from './k3/Interior';
import { Person } from './k3/Person';
import { CAST3, GHOST3 } from './Cast3D';
import { ExamTable, Oscilloscope, ReelConsole, IVStand, FluorescentLight, IsolationChamber, VoidChamber, FAC } from './GM3';
import { EndScreen3, endCam } from './End3';

// Framing distance helper: never a face alone
const FR: Record<string, number> = { wide: 1, waist: 0.65, bust: 0.45, close: 0.32, detail: 0.22 };
const dist = (v: any, base: number) => base * (FR[v?.fr as string] ?? 1);

// ---------- 1. Isolation Chamber (The Opening Teaser Shot & General Sensory Cell)
export const chamber_iso: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} indoor density={0.065} amb={0.35} moonI={0.8} rim={0.3} fill={0.2} disc={null} stars={false} fog="#14181a" />
    <IsolationChamber t={t} restrained={!!v?.alt} mic={!v?.alt} />
  </>
);
chamber_iso.cam = (v, t, len): CamSpec => ({
  p: [0.5, 1.6, dist(v, 4.8) + 0.6],
  l: [0, 1.1, -0.4],
  fov: v?.fr === 'close' ? 34 : 42,
  move: 'push',
  amt: 0.35,
  breath: 1.2,
});

// ---------- 2. Observation Window (Scientists watching through one-way glass)
export const obs_window: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} indoor density={0.055} amb={0.38} moonI={0.6} rim={0.25} disc={null} stars={false} fog="#14181a" />
    <Room w={10} d={7} h={3.2} wall="brick" wallC="#2a3235" floorC="#1a2022" t={t} window={null} beams />
    {/* Glass divider */}
    <mesh position={[0, 1.6, -1.8]}>
      <planeGeometry args={[4.5, 1.8]} />
      <primitive object={M('#152026', { op: 0.85 })} attach="material" />
    </mesh>
    {/* Scientists in observation booth */}
    <Person s={CAST3.dr_reed} at={[-0.6, 0, 0.4]} rot={0.1} pose="look" expr="calm" t={t} seed={5} />
    <Person s={CAST3.noah} at={[0.8, 0, 0.6]} rot={-0.15} pose="point" expr="fear" t={t + 1} seed={6} />
    {/* Audio console on desk */}
    <ReelConsole at={[0.2, 0, -0.6]} rot={0} t={t} />
  </>
);
obs_window.cam = (v, t, len): CamSpec => ({
  p: [0.2, 1.65, dist(v, 3.8) + 1.2],
  l: [-0.2, 1.45, 0.2],
  fov: 40,
  move: 'truck',
  amt: 0.28,
  dir: 1,
  breath: 1.1,
});

// ---------- 3. Reel-to-Reel Audio Console (Close telemetry & voice recording)
export const reels_tape: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} indoor density={0.06} amb={0.4} moonI={0.4} rim={0.3} disc={null} stars={false} fog="#121618" />
    <Room w={6} d={6} h={3.0} wall="brick" wallC="#242b2d" floorC="#161b1c" t={t} window={null} />
    <ReelConsole at={[0, 0, 0]} rot={0} t={t} />
    <Person s={CAST3.dr_reed} at={[0, 0, 1.2]} rot={Math.PI} pose="look" expr="calm" t={t} seed={7} />
  </>
);
reels_tape.cam = (v, t, len): CamSpec => ({
  p: [0.35, 1.45, dist(v, 2.4) + 0.5],
  l: [0, 0.95, 0],
  fov: 36,
  move: 'orbit',
  amt: 0.25,
  dir: 1,
  breath: 1.0,
});

// ---------- 4. Retro Surgery Suite (Severing of the sensory nerves)
export const retro_surgery: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} indoor density={0.06} amb={0.42} moonI={0.9} rim={0.35} disc={null} stars={false} fog="#161a1d" />
    <Room w={9} d={8} h={3.4} wall="brick" wallC="#3a4245" floorC="#24292b" t={t} window={null} beams />
    <ExamTable at={[0, 0, 0]} rot={0} restrained t={t} />
    <Person s={CAST3.subject} at={[0, 0.98, 0]} rot={Math.PI / 2} pose="sit" expr="fear" t={t} seed={2} />
    <Person s={CAST3.dr_reed} at={[-0.85, 0, 0.4]} rot={Math.PI / 4} pose="point" t={t} seed={8} />
    <FluorescentLight at={[0, 3.2, 0]} t={t} />
  </>
);
retro_surgery.cam = (v, t, len): CamSpec => ({
  p: [-0.9, 1.85, dist(v, 3.6) + 0.8],
  l: [0, 1.1, 0],
  fov: 40,
  move: 'arc',
  amt: 0.32,
  dir: -1,
  breath: 1.15,
});

// ---------- 5. Speaking into Suspended Microphone (Slurred speech)
export const speaking_mic: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} indoor density={0.07} amb={0.36} moonI={0.7} rim={0.25} disc={null} stars={false} fog="#121618" />
    <IsolationChamber t={t} restrained mic />
  </>
);
speaking_mic.cam = (v, t, len): CamSpec => ({
  p: [0.15, 1.45, dist(v, 2.6) + 0.4],
  l: [0.1, 1.25, -0.4],
  fov: 35,
  move: 'push',
  amt: 0.28,
  breath: 1.3,
});

// ---------- 6. First Whispers (Psychological fog beginning to enter)
export const whisper_mist: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} indoor density={0.08} amb={0.34} moonI={0.8} rim={0.3} disc={null} stars={false} fog="#101518" />
    <IsolationChamber t={t} restrained={false} mic={false} />
    <Mist t={t} n={8} area={[-3, 3, -3, 3]} y={0.3} o={0.25} />
  </>
);
whisper_mist.cam = (v, t, len): CamSpec => ({
  p: [0.6, 1.55, dist(v, 3.4) + 0.6],
  l: [0, 1.15, -0.4],
  fov: 38,
  move: 'orbit',
  amt: 0.26,
  dir: 1,
  breath: 1.2,
});

// ---------- 7. Wife's Apparition (Ghost Woman looming behind the cot)
export const wife_apparition: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} indoor density={0.075} amb={0.35} moonI={0.9} rim={0.4} disc={null} stars={false} fog="#11161a" />
    <Room w={9} d={8} h={3.3} wall="brick" wallC="#2e3639" floorC="#1e2426" t={t} window={null} beams />
    <ExamTable at={[0, 0, 0]} rot={0.1} t={t} />
    <Person s={CAST3.subject} at={[0, 0.98, 0]} rot={Math.PI / 2} pose="sit" expr="fear" t={t} seed={3} />
    {/* Ghost Woman apparition */}
    <Person s={GHOST3.woman} at={[-0.8, 0.1, -1.2]} rot={0.4} pose="stand" t={t} seed={11} />
    <Mist t={t} n={7} area={[-3, 3, -3, 1]} y={0.3} o={0.24} />
  </>
);
wife_apparition.cam = (v, t, len): CamSpec => ({
  p: [0.8, 1.7, dist(v, 3.8) + 0.8],
  l: [-0.3, 1.25, -0.5],
  fov: 38,
  move: 'arc',
  amt: 0.35,
  dir: -1,
  breath: 1.2,
});

// ---------- 8. Secrets Shock (Researchers in booth stunned by dead relative secrets)
export const secrets_shock: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} indoor density={0.06} amb={0.38} moonI={0.7} rim={0.3} disc={null} stars={false} fog="#13171a" />
    <Room w={8} d={7} h={3.2} wall="brick" wallC="#283033" floorC="#1b2022" t={t} window={null} />
    <Person s={CAST3.dr_reed} at={[0, 0, 0]} rot={0} pose="look" expr="fear" t={t} seed={10} />
    <ReelConsole at={[-1.1, 0, 0.2]} rot={0.3} t={t} />
  </>
);
secrets_shock.cam = (v, t, len): CamSpec => ({
  p: [0, 1.62, dist(v, 2.5) + 0.4],
  l: [0, 1.5, 0],
  fov: 34,
  move: 'push',
  amt: 0.26,
  breath: 1.25,
});

// ---------- 9. Fleeing Down the Facility Corridor
export const fleeing_hall: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} indoor density={0.06} amb={0.35} moonI={0.6} rim={0.25} disc={null} stars={false} fog="#14181b" />
    <Room w={5} d={14} h={3.2} wall="brick" wallC="#333a3d" floorC="#202527" t={t} window={null} beams />
    {/* Exit door at the end */}
    <group position={[0, 0, -6.8]}>
      <Door at={[0, 0, 0]} w={1.2} h={2.2} open={0.4} lit={1} t={t} />
    </group>
    {/* Fleeing researchers */}
    <Person s={CAST3.noah} at={[-0.4, 0, -2.5]} rot={Math.PI} pose="stalk" t={t} seed={15} />
    <Person s={CAST3.mira} at={[0.4, 0, -4.2]} rot={Math.PI} pose="stalk" t={t + 0.5} seed={16} />
  </>
);
fleeing_hall.cam = (v, t, len): CamSpec => ({
  p: [0, 2.2, dist(v, 5.5) + 1.2],
  l: [0, 1.3, -4.5],
  fov: 44,
  move: 'crane',
  amt: -0.6,
  breath: 1.1,
});

// ---------- 10. Hysteria & Slamming against Cell Wall
export const hysteria_slam: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} indoor density={0.08} amb={0.32} moonI={0.8} rim={0.35} disc={null} stars={false} fog="#101416" />
    <Room w={8} d={8} h={3.4} wall="brick" wallC="#2e3538" floorC="#1d2224" t={t} window={null} beams />
    <Person s={CAST3.subject} at={[-2.8, 0, -1.5]} rot={Math.PI / 3} pose="point" expr="fear" t={t} seed={18} />
    <Mist t={t} n={6} area={[-3, 3, -3, 3]} y={0.25} o={0.2} />
  </>
);
hysteria_slam.cam = (v, t, len): CamSpec => ({
  p: [-1.2, 1.7, dist(v, 3.6) + 0.6],
  l: [-2.6, 1.2, -1.5],
  fov: 42,
  move: 'push',
  amt: 0.38,
  breath: 1.4,
});

// ---------- 11. Sedative Sleep & IV Drip
export const sedative_sleep: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} indoor density={0.07} amb={0.36} moonI={0.7} rim={0.25} disc={null} stars={false} fog="#121619" />
    <Room w={8} d={7} h={3.2} wall="brick" wallC="#2c3336" floorC="#1c2123" t={t} window={null} />
    <ExamTable at={[0, 0, 0]} rot={0} t={t} />
    <Person s={CAST3.subject} at={[0, 0.98, 0]} rot={Math.PI / 2} pose="sit" expr="calm" t={t} seed={20} />
    <IVStand at={[1.2, 0, 0]} t={t} />
  </>
);
sedative_sleep.cam = (v, t, len): CamSpec => ({
  p: [0.8, 1.6, dist(v, 2.8) + 0.6],
  l: [0.2, 1.05, 0],
  fov: 36,
  move: 'truck',
  amt: 0.24,
  dir: -1,
  breath: 1.1,
});

// ---------- 12. Full Nightmare Void (Circling apparitions)
export const nightmare_void: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} density={0.08} amb={0.28} moonI={1.2} fog="#0a0e10" />
    <VoidChamber t={t} />
  </>
);
nightmare_void.cam = (v, t, len): CamSpec => ({
  p: [1.8, 2.1, dist(v, 4.6) + 0.8],
  l: [0, 1.0, -1.0],
  fov: 42,
  move: 'orbit',
  amt: 0.36,
  dir: 1,
  breath: 1.25,
});

// ---------- 13. Clawing at Eyes in Desperation
export const clawing_eyes: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} indoor density={0.075} amb={0.32} moonI={0.8} rim={0.35} disc={null} stars={false} fog="#101518" />
    <IsolationChamber t={t} alarm />
  </>
);
clawing_eyes.cam = (v, t, len): CamSpec => ({
  p: [0.2, 1.55, dist(v, 2.8) + 0.5],
  l: [0, 1.2, -0.4],
  fov: 34,
  move: 'push',
  amt: 0.32,
  breath: 1.35,
});

// ---------- 14. Red Alarm Shriek ("No heaven, no forgiveness")
export const alarm_shriek: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} indoor density={0.07} amb={0.35} moonI={0.7} rim={0.3} disc={null} stars={false} fog="#150f11" />
    <IsolationChamber t={t} alarm />
  </>
);
alarm_shriek.cam = (v, t, len): CamSpec => ({
  p: [-0.7, 1.75, dist(v, 4.2) + 0.8],
  l: [0, 1.15, -0.4],
  fov: 40,
  move: 'arc',
  amt: 0.34,
  dir: 1,
  breath: 1.3,
});

// ---------- 15. Restrained Flat on Metal Table
export const restrained_flat: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} indoor density={0.065} amb={0.38} moonI={0.8} rim={0.3} disc={null} stars={false} fog="#13171a" />
    <IsolationChamber t={t} restrained />
  </>
);
restrained_flat.cam = (v, t, len): CamSpec => ({
  p: [0.6, 1.85, dist(v, 3.4) + 0.6],
  l: [0, 1.0, -0.4],
  fov: 38,
  move: 'crane',
  amt: -0.5,
  breath: 1.15,
});

// ---------- 16. Tears Blankly at Ceiling
export const tears_ceiling: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} indoor density={0.07} amb={0.34} moonI={0.6} rim={0.25} disc={null} stars={false} fog="#121619" />
    <Room w={7} d={7} h={3.2} wall="brick" wallC="#2a3235" floorC="#1a2022" t={t} window={null} />
    <ExamTable at={[0, 0, 0]} rot={0} restrained t={t} />
    <Person s={CAST3.subject} at={[0, 0.98, 0]} rot={Math.PI / 2} pose="sit" expr="calm" t={t} seed={25} />
  </>
);
tears_ceiling.cam = (v, t, len): CamSpec => ({
  p: [0.05, 2.15, dist(v, 2.2) + 0.4],
  l: [0, 1.0, 0],
  fov: 32,
  move: 'push',
  amt: 0.22,
  breath: 1.1,
});

// ---------- 17. Rehydration & Two Weeks Silence
export const rehydration_iv: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} indoor density={0.065} amb={0.36} moonI={0.7} rim={0.3} disc={null} stars={false} fog="#14181b" />
    <Room w={8} d={7} h={3.2} wall="brick" wallC="#2f3639" floorC="#1d2224" t={t} window={null} />
    <ExamTable at={[0, 0, 0]} rot={0} restrained t={t} />
    <Person s={CAST3.subject} at={[0, 0.98, 0]} rot={Math.PI / 2} pose="sit" expr="calm" t={t} seed={26} />
    <IVStand at={[1.2, 0, 0]} t={t} />
  </>
);
rehydration_iv.cam = (v, t, len): CamSpec => ({
  p: [1.3, 1.7, dist(v, 3.2) + 0.8],
  l: [0, 1.0, 0],
  fov: 38,
  move: 'truck',
  amt: 0.28,
  dir: 1,
  breath: 1.15,
});

// ---------- 18. Focused Eye Contact through the Glass
export const eye_contact_shot: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} indoor density={0.07} amb={0.38} moonI={0.8} rim={0.35} disc={null} stars={false} fog="#13171a" />
    <IsolationChamber t={t} restrained />
  </>
);
eye_contact_shot.cam = (v, t, len): CamSpec => ({
  p: [0, 1.45, dist(v, 2.2) + 0.3],
  l: [0, 1.15, -0.4],
  fov: 32,
  move: 'push',
  amt: 0.28,
  breath: 1.25,
});

// ---------- 19. "He has abandoned us" (Final Whisper)
export const whisper_god: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} indoor density={0.08} amb={0.35} moonI={0.9} rim={0.35} disc={null} stars={false} fog="#111518" />
    <IsolationChamber t={t} restrained />
  </>
);
whisper_god.cam = (v, t, len): CamSpec => ({
  p: [0.15, 1.38, dist(v, 1.9) + 0.3],
  l: [0, 1.12, -0.4],
  fov: 30,
  move: 'hold',
  amt: 0.15,
  breath: 1.3,
});

// ---------- 20. Flatline on the CRT Screen
export const flatline_screen: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} indoor density={0.06} amb={0.35} moonI={0.3} rim={0.2} disc={null} stars={false} fog="#0f1416" />
    <Room w={5} d={5} h={3.0} wall="brick" wallC="#202628" floorC="#15191b" t={t} window={null} />
    <Oscilloscope at={[0, 0.4, 0]} rot={0} flatline t={t} />
  </>
);
flatline_screen.cam = (v, t, len): CamSpec => ({
  p: [0, 0.76, dist(v, 1.6) + 0.3],
  l: [0, 0.74, 0],
  fov: 28,
  move: 'push',
  amt: 0.2,
  breath: 1.0,
});

// ---------- 21. Abandoned Laboratory in Silence
export const abandoned_lab: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} indoor density={0.075} amb={0.32} moonI={0.6} rim={0.25} disc={null} stars={false} fog="#101416" />
    <Room w={10} d={8.5} h={3.4} wall="brick" wallC={FAC.wall} floorC={FAC.floor} t={t} window={null} beams />
    <ExamTable at={[0, 0, -0.4]} rot={0.1} restrained t={t} />
    <Person s={CAST3.dr_reed} at={[-1.2, 0, 1.4]} rot={-0.2} pose="look" expr="calm" t={t} seed={30} />
  </>
);
abandoned_lab.cam = (v, t, len): CamSpec => ({
  p: [-0.5, 1.8, dist(v, 4.8) + 1.2],
  l: [0, 1.0, -0.4],
  fov: 42,
  move: 'pull',
  amt: 0.4,
  breath: 1.1,
});

// ---------- 22. Restricted Facility Door (Credit shot)
export const restricted_door: Set3 = ({ t, v }: SetP) => (
  <>
    <Night t={t} indoor density={0.065} amb={0.35} moonI={0.7} rim={0.25} disc={null} stars={false} fog="#14181b" />
    <Room w={6} d={7} h={3.2} wall="brick" wallC="#30383b" floorC="#1f2426" t={t} window={null} beams />
    <group position={[0, 0, -3.4]}>
      <Door at={[0, 0, 0]} w={1.2} h={2.2} open={0} lit={0} t={t} />
    </group>
  </>
);
restricted_door.cam = (v, t, len): CamSpec => ({
  p: [0, 1.6, dist(v, 3.8) + 0.6],
  l: [0, 1.3, -3.4],
  fov: 38,
  move: 'hold',
  amt: 0.15,
  breath: 1.1,
});

// ---------- 23. End Screen (Mandatory 20s Scroll Kaos End Scene)
export const end: Set3 = ({ t }: SetP) => <EndScreen3 t={t} />;
end.cam = endCam;

// Export all 16:9 sets
export const SETS: Record<string, Set3> = {
  chamber_iso,
  obs_window,
  reels_tape,
  retro_surgery,
  speaking_mic,
  whisper_mist,
  wife_apparition,
  secrets_shock,
  fleeing_hall,
  hysteria_slam,
  sedative_sleep,
  nightmare_void,
  clawing_eyes,
  alarm_shriek,
  restrained_flat,
  tears_ceiling,
  rehydration_iv,
  eye_contact_shot,
  whisper_god,
  flatline_screen,
  abandoned_lab,
  restricted_door,
  end,
};
