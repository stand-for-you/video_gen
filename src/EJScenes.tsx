import React from 'react';
import { SetP } from './Stage3';
import { V3, ss, seg, sway } from './k3/core';
import { cAnchors } from './k3/Creature';
import {
  NightQ, DayQ, Jack, JACK, CamProp, Bedroom, Farmhouse, Yard, Kitchen, Hospital, Hallway, Bundle, Car, CarInside, OutroYard,
  MITCH, EDWIN, DOC, MOM, DAD, EJ, Person, Forest, Ground, Mist, Flakes, Rock, Grass, Halo, Candle,
} from './EJ3';
import { M, G } from './k3/core';
// ===== SCENES of the Eyeless Jack kit (3D parts only). Cameras live in SetsL.tsx (16:9) and SetsR.tsx (9:16), composed separately.
// Variant keys read from v: fr (framing), ang (camera azimuth), alt (another moment), plus the scene keys documented per scene.
const BED_X = 1.0;
// A standing person's hip pivot sits hipY above 'at.y' (hipY ~= H*0.5 for an adult). The 'lie'/'sleep' pose rotates the
// body -90 deg about that pivot so it extends along z instead of y, so 'at.y' must drop by hipY to put the pivot (and so
// the whole lying body) at the real surface height, or the body floats in the air above the bed.
const BED_LIE: V3 = [BED_X, 0.58 - 0.81, -1.0];
// ---- 1. Jack leans over the bed. v.part = 'face' | 'hand'; v.mitch = expr
export const BedOver: React.FC<SetP> = ({ t, v }) => {
  const hand = v?.part === 'hand';
  return (<>
    <NightQ t={t} indoor density={0.05} moonI={1.7} amb={0.62} />
    <Bedroom t={t} />
    <Person s={MITCH} at={BED_LIE} rot={0} t={t} pose="lie" expr={v?.mitch || 'fear'} seed={3} />
    <Jack at={[1.78, 0, -1.55]} rot={-Math.PI / 2} t={t} pose={hand ? 'reach' : 'bend'} seed={4} />
  </>);
};
// ---- 2. Jack standing at the foot of the bed, facing us (tags name the parts)
export const JackFull: React.FC<SetP> = ({ t, v, tag }) => {
  const at: V3 = [1.0, 0, 0.6]; const a = cAnchors(JACK, at, 0);
  if (v?.tags) { tag({ at: [at[0] + 0.02, 1.86, at[2] + 0.25], text: 'BLUE MASK', at2: 0.5, side: -1 }); tag({ at: [at[0] - 0.12, 1.74, at[2] + 0.45], text: 'NO EYES', at2: 1.4, side: 1 }); tag({ at: [at[0] + 0.45, 0.9, at[2] + 0.2], text: 'CLAWS', at2: 2.2, side: 1 }); }
  return (<>
    <NightQ t={t} indoor density={0.05} moonI={1.5} amb={0.56} />
    <Bedroom t={t} />
    <Person s={MITCH} at={BED_LIE} rot={0} t={t} pose="sleep" expr="sleepy" seed={3} />
    <Jack at={at} rot={Math.sin(t * 0.3) * 0.05} t={t} pose="stand" look={[sway(t, 8, 0.1, 2), 0]} />
  </>);
};
// ---- 3. the house from outside, the bush rustles; v.fig = Jack far in the open yard (never crossing the house), v.lit = windows
export const HouseOut: React.FC<SetP> = ({ t, v }) => (<>
  <NightQ t={t} density={0.05} moonI={1.6} />
  <Yard t={t} rustle={v?.calm ? 0.1 : 1.4} />
  <Farmhouse t={t} lit={v?.lit ?? 1} />
  {v?.fig && <Jack at={[9, 0, -5]} rot={-0.8} t={t} pose="stand" scale={1.0} />}
</>);
// ---- 4. the window opens and something thumps in; Mitch sits up. v.win = 0..1 start, v.sit
export const BedWin: React.FC<SetP> = ({ t, v }) => {
  const win = v?.shut ? 0 : seg(t, 0.2, 1.6);
  return (<>
    <NightQ t={t} indoor density={0.05} moonI={1.4} amb={0.6} />
    <Bedroom t={t} win={win} />
    <Person s={MITCH} at={BED_LIE} rot={0} t={t} pose="lie" expr="fear" seed={3} look={[0.4, 0]} />
  </>);
};
// ---- 5. the kitchen: the coffee cup falls, the mirror. v.part = 'cup' | 'mirror' | 'both'
export const KitchenS: React.FC<SetP> = ({ t, v }) => {
  const fall = Math.max(0, t - 0.5); const y = Math.max(0.02, 1.05 - 4.9 * fall * fall); const hit = 1.05 - 4.9 * fall * fall <= 0.02;
  const mirror = v?.part === 'mirror' || v?.part === 'both';
  return (<>
    <DayQ t={t} />
    <Kitchen t={t} />
    <Person s={MITCH} at={[-0.7, 0, 0.3]} rot={mirror ? Math.PI / 2 : Math.PI / 2 + 0.3} t={t} pose="idle" expr="calm" seed={3} />
    <Person s={EDWIN} at={[0.8, 0, 0.3]} rot={-Math.PI / 2} t={t} pose={mirror ? 'reach' : 'hold'} pose2={mirror ? undefined : 'recoil'} at2={0.5} blend={0.4} expr="shock" seed={6} />
    {!mirror && <>
      <mesh position={[0.45, y, 0.28]} rotation={[0, 0, hit ? 1.4 : fall * 2]} material={M('#e8e4d6')}><cylinderGeometry args={[0.045, 0.035, 0.09, 8]} /></mesh>
      {hit && <><mesh position={[0.42, 0.012, 0.28]} rotation={[-Math.PI / 2, 0, 0]} material={M('#2a1a10', { r: 0.2 })}><circleGeometry args={[0.1 + 0.18 * ss((t - 1.4) / 1.2), 7]} /></mesh>
        {[0, 1, 2, 3, 4].map((i) => <mesh key={i} position={[0.42 + Math.cos(i * 1.3) * 0.15 * ss((t - 1.4) / 0.4), 0.01, 0.28 + Math.sin(i * 1.3) * 0.15 * ss((t - 1.4) / 0.4)]} rotation={[0.3 * i, i, 0.2]} material={M('#e8e4d6')}><boxGeometry args={[0.03, 0.01, 0.025]} /></mesh>)}</>}
    </>}
    {mirror && <group position={[0.18, 1.28, 0.32]} rotation={[0, -1.4 + sway(t, 5, 0.04, 1), 0.1]}>
      <mesh material={M('#6a5a44')}><boxGeometry args={[0.3, 0.42, 0.03]} /></mesh><mesh position={[0, 0, 0.018]} material={G('#9fb6c2')}><boxGeometry args={[0.26, 0.38, 0.01]} /></mesh>
    </group>}
  </>);
};
// ---- 6. the hospital. v.who = 'talk' | 'news' | 'parents' ; v.day
export const HospitalS: React.FC<SetP> = ({ t, v }) => {
  const day = !!v?.day;
  return (<>
    {day ? <DayQ t={t} fog="#b0bfc0" /> : <NightQ t={t} indoor density={0.04} moonI={0.8} amb={0.7} />}
    <Hospital t={t} day={day} />
    <Person s={MITCH} at={[-0.8, 0.5, -0.1]} rot={0.15} t={t} pose="sit" expr={v?.who === 'news' ? 'sad' : v?.who === 'parents' ? 'smile' : 'fear'} seed={3} look={[v?.alt ? 0.3 : -0.2, 0]} />
    <Person s={DOC} at={[0.7, 0, 0.5]} rot={-2.1} t={t} pose={v?.who === 'talk' ? 'point' : 'idle'} expr={v?.who === 'news' ? 'sad' : 'calm'} seed={8} side={1} />
    {v?.who === 'parents' && <>
      <Person s={MOM} at={[1.9, 0, 1.4]} rot={-2.3} t={t} pose="idle" expr="sad" seed={9} />
      <Person s={DAD} at={[2.4, 0, 0.6]} rot={-2.0} t={t} pose="idle" expr="sad" seed={10} />
    </>}
  </>);
};
// ---- 7. Mitch's point of view: the camera in his hands, Jack's mask above; the light of the camera brightens slowly (never a flash)
export const Snap: React.FC<SetP> = ({ t, v }) => {
  const fl = seg(t, 0.7, 2.2) * (1 - seg(t, 2.4, 3.4));
  return (<>
    <NightQ t={t} indoor density={0.05} moonI={1.5} amb={0.58} />
    <Bedroom t={t} />
    <Person s={MITCH} at={[BED_X, 0.56, -0.3]} rot={0} t={t} pose="sit" expr="fear" seed={3} look={[0, 0.2]} />
    <Jack at={[1.78, 0, -1.9]} rot={-Math.PI / 2} t={t} pose="bend" seed={4} />
    <CamProp at={[0.55, 1.1, -0.6]} rot={[-0.55, 1.05, 0]} s={1.8} t={t} flash={fl} />
    <Halo at={[1.3, 1.35, -1.8]} r={1.6 * fl + 0.01} c="#dff0ff" o={0.35 * fl} t={t} />
  </>);
};
// ---- 8. it lunges; Mitch kicks. v.kick = Mitch on the far side, Jack reeling
export const Lunge: React.FC<SetP> = ({ t, v }) => (<>
  <NightQ t={t} indoor density={0.05} moonI={1.4} amb={0.58} />
  <Bedroom t={t} />
  {v?.kick
    ? <>
      <Person s={MITCH} at={[0.1, 0, -0.9]} rot={Math.PI / 2} t={t} pose="recoil" expr="scream" seed={3} />
      <Jack at={[1.4, 0, -0.8]} rot={-Math.PI / 2} t={t} pose="stalk" pose2="stand" at2={0.8} travel={false} seed={4} look={[0.3, 0.2]} />
    </>
    : <>
      <Person s={MITCH} at={BED_LIE} rot={0} t={t} pose="lie" expr="scream" seed={3} />
      <Jack at={[1.9, 0, -1.4]} rot={-Math.PI / 2} t={t} pose="lunge" p={seg(t, 0.15, 1.3)} seed={4} />
    </>}
</>);
// ---- 9. the woods at night: Mitch runs toward the camera. v.yard = across the yard from the house; v.fall = trips on the rock; v.black = fade to black
export const Flee: React.FC<SetP> = ({ t, v, len }) => {
  const z0 = -9.5; const rockZ = z0 + 3.4 * 1.5;
  return (<>
    <NightQ t={t} density={0.07} moonI={1.5} />
    {v?.yard ? <><Yard t={t} rustle={0.3} /><Farmhouse t={t} lit={1} /></> : <>
      <Ground flat={16} c="#142018" hill={0.8} />
      <Forest t={t} n={80} area={[-20, 20, -32, 4]} seed={31} clear={[[-2.5, 2.5, -30, 6]]} dead={0.12} />
      <Mist t={t} n={6} area={[-10, 10, -22, 6]} y={0.45} o={0.16} size={8} />
      {v?.fall && <Rock at={[0.1, 0, rockZ + 0.2]} s={0.55} seed={3} />}
    </>}
    <Person s={MITCH} at={[v?.yard ? 3 : 0, 0, v?.yard ? -3 : z0]} rot={v?.yard ? 0.35 : 0} t={t} pose="run" pose2={v?.fall ? 'fall' : undefined} at2={1.45} blend={0.35} travel expr="fear" seed={3} speed={0.95} />
    {v?.fig && <Jack at={[-3, 0, -16]} rot={0.2} t={t} pose="stalk" travel speed={0.6} />}
  </>);
};
// ---- 10. the hallway: the dark bundle on the floor. Edwin is never shown.
export const HallS: React.FC<SetP> = ({ t, v }) => (<>
  <DayQ t={t} fog="#9aa8a8" density={0.02} />
  <Hallway t={t} bundle open={1} />
  <Person s={MITCH} at={[0.1, 0, 2.5]} rot={Math.PI} t={t} pose="recoil" expr="shock" seed={3} look={[0, 0.45]} />
</>);
// ---- 11. the parents' car at the farmhouse in the morning. v.part = 'arrive' | 'walk'
export const CarOut: React.FC<SetP> = ({ t, v }) => {
  const arrive = v?.part !== 'walk';
  const cz = arrive ? 14 - 6.5 * ss(t / 4) : 6.5;
  return (<>
    <DayQ t={t} fog="#9fb0b2" density={0.025} />
    <Yard t={t} rustle={0.1} day />
    <Farmhouse t={t} lit={0} day />
    <Car at={[3.2, 0, cz]} rot={Math.PI} t={t} lights />
    {!arrive && <>
      <Person s={MITCH} at={[0.6, 0, 7.2 - 0.0]} rot={1.1} t={t} pose="walk" travel speed={0.55} expr="shock" seed={3} />
      <Person s={MOM} at={[2.0, 0, 7.0]} rot={-0.4} t={t} pose="idle" expr="sad" seed={9} />
      <Person s={DAD} at={[4.5, 0, 5.4]} rot={0.6} t={t} pose="idle" expr="sad" seed={10} />
    </>}
  </>);
};
// ---- 12. inside the car: Mitch looks at what he holds
export const CarIn: React.FC<SetP> = ({ t, v }) => (<>
  <NightQ t={t} indoor density={0.035} moonI={0.7} amb={0.6} disc={null} />
  <CarInside t={t} />
  <Person s={MITCH} at={[0.45, 0.22, 1.1]} rot={Math.PI} t={t} pose="sit" expr="pain" seed={3} look={[0, 0.5]} />
  <Bundle at={[0.45, 0.8, 0.62]} t={t} s={1.3} />
</>);
// ---- 13. calm last picture of the Reel (the house at night)
export const Outro: React.FC<SetP> = ({ t }) => <OutroYard t={t} />;
