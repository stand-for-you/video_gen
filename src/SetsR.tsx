import React from 'react';
import { Set3, SetP } from './Stage3';
import { CamSpec } from './k3/Cam';
import { M, seg, sway } from './k3/core';
import { Night, Mist, Flakes } from './k3/World';
import { Person } from './k3/Person';
import { CAST3 } from './Cast3D';
import { JACK, JACK_HOME, ALLIE, JAMES, LOTTERY, LOTTERY_RICH, DONNA, BOY } from './SeerCast';
import { Seer, Monitor, Keyboard, Router, Flat, Desk, OfficeChair, Cubicles, Lobby, Car, Lorry, Street, Shop, BigHouse, Living, HomeOffice, Hall, Void, Gallery } from './SR3';
// ===== 9:16 SETS (REEL) — composed again for the tall frame: the camera stands closer and lower, the subject fills the
// middle, and the bottom fifth is kept clear for the word-by-word subtitles. Nothing here is imported from SetsL.tsx.
const FR = { wide: 1, waist: 0.66, bust: 0.48, close: 0.36, detail: 0.26 } as Record<string, number>;
const d = (v: any, base: number) => base * (FR[v?.fr as string] ?? 1);
const T = (v: any, fallback: string[]) => (v?.txt as string[]) || fallback;
const typed = (v: any, t: number, len: number) => (v?.typed != null ? v.typed : seg(t, 0.15, Math.max(1.2, len * 0.62)));
export const rflat: Set3 = ({ t, len, v }: SetP) => (<>
  <Night t={t} indoor density={0.035} amb={0.44} moonI={0.5} rim={0.3} fill={0.25} disc={null} stars={false} fog="#1a1d24" />
  <Flat t={t} w={6} d={5.6} />
  <Desk at={[0.2, 0, -2.1]} w={1.6} d={0.75} />
  <Monitor at={[0.2, 0.79, -2.3]} rot={0.04} t={t} lines={T(v, [])} typed={typed(v, t, len)} off={v?.off} light={v?.off ? 0 : 1.1} />
  <Keyboard at={[0.2, 0.77, -1.8]} />
  <Router at={[-0.8, 0.79, -2.25]} t={t} />
  <OfficeChair at={[0.2, 0, -1.3]} rot={Math.PI} t={t} />
  {!v?.empty && <Person s={JACK_HOME} at={[0.2, 0, -1.25]} rot={Math.PI} t={t} pose={v?.pose || 'sit'} expr={v?.expr || 'calm'} seed={2} />}
</>);
rflat.camR = (v): CamSpec => ({ p: [-1.1, 1.5, d(v, 1.9) - 0.3], l: [0.2, 1.2, -2.1], fov: 54, move: v?.cm || 'orbit', amt: 0.28, dir: 1 });
export const rscreen: Set3 = ({ t, len, v }: SetP) => (<>
  <Night t={t} indoor density={0.02} amb={0.3} moonI={0.2} rim={0.15} fill={0.15} disc={null} stars={false} fog="#15161c" />
  <Monitor at={[0, 0, 0]} t={t} crt={v?.crt !== false} lines={T(v, ['...'])} typed={typed(v, t, len)} light={1.6} s={2.2} />
</>);
rscreen.camR = (): CamSpec => ({ p: [0.1, 0.9, 1.45], l: [0, 0.84, 0], fov: 46, move: 'push', amt: 0.14, breath: 0.7 });
export const rlobby: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} indoor density={0.02} amb={0.6} moonI={0.8} hemi={0.9} rim={0.4} fill={0.35} disc={null} stars={false} fog="#5a6472" />
  <Lobby t={t} plantOut={v?.out ?? 0} people={v?.people ?? 0} morning />
  {v?.jack !== false && <Person s={JACK} at={[0.8, 0, -4.2]} rot={0.1} t={t} pose={v?.pose || 'idle'} expr={v?.expr || 'calm'} seed={2} />}
</>);
rlobby.camR = (v): CamSpec => ({ p: [-0.6, 1.6, d(v, 4.2) - 1.6], l: [0.3, 1.5, -6.2], fov: 56, move: v?.cm || 'push', amt: 0.28 });
export const roffice: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} indoor density={0.02} amb={0.62} moonI={0.7} hemi={0.95} rim={0.4} fill={0.35} disc={null} stars={false} fog="#55606e" />
  <Cubicles t={t} rows={2} cols={3} />
  <Person s={ALLIE} at={[0.2, 0, -0.5]} rot={2.5} t={t} pose={v?.apose || 'sit'} expr={v?.aexpr || 'smile'} seed={6} />
  {v?.jack !== false && <Person s={JACK} at={[1.4, 0, 0.5]} rot={-2.3} t={t + 1.2} pose="idle" expr={v?.jexpr || 'calm'} seed={2} />}
  {v?.james && <Person s={JAMES} at={[2.4, 0, -1.3]} rot={-2.0} t={t} pose="idle" expr="pain" seed={8} rig={{ hpRf: 0.22, knR: 0.5 }} />}
</>);
roffice.camR = (v): CamSpec => ({ p: [2.3, 1.62, d(v, 2.6) + 0.5], l: [0.5, 1.35, -0.4], fov: 52, move: v?.cm || 'orbit', amt: 0.3, dir: -1 });
export const rcrash: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} sky="#55657a" fog="#76869a" density={0.016} moon={[-8, 14, 10]} moonI={2.0} amb={0.7} hemi={0.95} disc={null} stars={false} />
  <Street t={t} night={false} lamps={3} len={40} />
  <Lorry at={[-2.2, 0, 3.4]} rot={0.28} />
  <Car at={[1.4, 0, -1.2]} rot={1.35} c="#6a3a34" crushed={0.75} />
  {Array.from({ length: 6 }, (_, i) => { const a = -0.8 + i * 0.3; const r = 6.5; return (
    <Person key={i} s={[CAST3.rose, CAST3.sam, CAST3.agnes, CAST3.terence, CAST3.lyra, CAST3.mira][i]} at={[Math.sin(a) * r, 0, Math.cos(a) * r - 2]} rot={Math.PI + a} t={t + i * 1.1} pose={i % 3 === 0 ? 'cover' : 'idle'} expr="shock" seed={60 + i} far detail={false} />); })}
</>);
rcrash.camR = (v): CamSpec => (v?.fr === 'wide'
  ? { p: [2.2, 6.2, 10], l: [0.4, 1.2, 0], fov: 54, move: 'drop', amt: 2.6 }
  : { p: [1.8, 1.6, d(v, 5.6) + 1], l: [0.6, 1.3, -0.6], fov: 52, move: 'arc', amt: 0.3, dir: -1 });
export const rshop: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} indoor density={0.02} amb={0.65} moonI={0.6} hemi={1.0} rim={0.4} fill={0.35} disc={null} stars={false} fog="#6a7078" />
  <Shop t={t} kind={v?.kind || 'booze'} />
  {v?.man && <Person s={v?.rich ? LOTTERY_RICH : LOTTERY} at={[-0.6, 0, 2.5]} rot={0.3} t={t} pose={v?.mpose || 'idle'} expr={v?.rich ? 'smile' : 'calm'} seed={12} />}
  <Person s={JACK} at={[0.8, 0, 3.2]} rot={-0.4} t={t + 1.4} pose="idle" expr={v?.jexpr || 'calm'} seed={2} />
</>);
rshop.camR = (v): CamSpec => ({ p: [2.0, 1.62, d(v, 2.8) + 3.6], l: [-0.1, 1.4, 2.7], fov: 52, move: 'arc', amt: 0.3, dir: 1 });
export const rhouse: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} density={0.04} moonI={1.8} amb={0.5} disc={[-30, 26, -80]} discR={6} />
  <BigHouse t={t} lit={v?.lit ?? 1} door={v?.door ?? 0} car />
</>);
rhouse.camR = (v): CamSpec => ({ p: [1.6, 1.6, d(v, 11) + 2], l: [0, 3.0, -3.4], fov: 56, move: 'push', amt: 0.3, breath: 1.2 });
export const rdoor: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} indoor density={0.03} amb={0.42} moonI={0.6} rim={0.3} fill={0.25} disc={null} stars={false} fog="#1e2229" />
  <Hall t={t} doorOpen={0.85} lamp={1} />
  <Person s={BOY} at={[0.1, 0, 5.2]} rot={Math.PI} t={t} pose={v?.bpose || 'hold'} expr="angry" seed={14} />
  {v?.jack !== false && <Person s={JACK_HOME} at={[0.1, 0, 3.5]} rot={0.05} t={t + 1} pose="idle" expr={v?.jexpr || 'fear'} seed={2} />}
</>);
rdoor.camR = (v): CamSpec => ({ p: [0.95, 1.15, d(v, 2.6) + 1.5], l: [0.1, 1.85, 5.0], fov: 50, move: v?.cm || 'tilt', amt: 0.7 });
export const rliving: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} indoor density={0.03} amb={0.4} moonI={0.5} rim={0.28} fill={0.22} disc={null} stars={false} fog="#1e2229" />
  <Living t={t} tv={v?.tv ?? 1} pizza={v?.pizza} lamp={v?.lamp ?? 1} stain={v?.stain} />
  {v?.donna && <Person s={DONNA} at={[-0.45, 0, 1.75]} rot={0.1} t={t} pose="sit" expr={v?.dexpr || 'smile'} seed={9} />}
  {v?.jack && <Person s={JACK_HOME} at={[0.65, 0, 1.8]} rot={0.05} t={t + 1.3} pose="sit" expr={v?.jexpr || 'calm'} seed={2} />}
</>);
rliving.camR = (v): CamSpec => ({ p: [2.1, 1.45, d(v, 2.6) + 1.2], l: [0.0, 1.1, 1.0], fov: 52, move: v?.cm || 'orbit', amt: 0.28, dir: -1 });
export const rupstairs: Set3 = ({ t, len, v }: SetP) => (<>
  <Night t={t} indoor density={0.03} amb={0.38} moonI={0.5} rim={0.28} fill={0.22} disc={null} stars={false} fog="#1b1f26" />
  <HomeOffice t={t} lines={T(v, [])} typed={typed(v, t, len)} off={v?.off} lamp={v?.lamp ?? 0.5} />
  <Person s={JACK_HOME} at={[0.6, 0, -1.25]} rot={Math.PI} t={t} pose={v?.pose || 'sit'} expr={v?.expr || 'calm'} seed={2} tremble={v?.tremble} />
  {v?.boy && <group position={[-1.7, 0, 1.9]}><mesh position={[0, 1.3, 0.12]} material={M('#07080b')}><boxGeometry args={[1.3, 2.6, 0.1]} /></mesh><Person s={BOY} at={[0, 0, -0.1]} rot={0.25} t={t} pose="idle" expr="angry" seed={14} /></group>}
</>);
rupstairs.camR = (v): CamSpec => ({ p: [1.7, 1.5, d(v, 2.1) - 0.4], l: [0.5, 1.3, -2.1], fov: 52, move: v?.cm || 'orbit', amt: 0.3, dir: -1 });
export const rseer: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} indoor density={0.05} amb={0.3} ambC="#6a4a52" moonI={0.45} moonC="#8fa8ff" rim={0.35} fill={0.2} disc={null} stars={false} fog="#14090c" sky="#07070c" />
  <Void t={t} canvases={v?.canvases ?? 2} glow={1} />
  <Seer at={[0, 0, 0]} rot={0.15} t={t} pose="stand" look={[sway(t, 9, 0.1, 2), 0]} />
</>);
rseer.camR = (v): CamSpec => (v?.fr === 'close'
  ? { p: [0.6, 2.0, 1.75], l: [0, 1.95, 0], fov: 46, move: 'orbit', amt: 0.26, dir: 1 }
  : { p: [1.3, 1.6, d(v, 4.4) + 0.6], l: [0, 1.6, 0], fov: 52, move: 'arc', amt: 0.3, dir: -1 });
export const rgallery: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} indoor density={0.04} amb={0.3} ambC="#5a4a46" moonI={0.4} rim={0.3} fill={0.2} disc={null} stars={false} fog="#14121a" sky="#08080c" />
  <Gallery t={t} litFace={v?.face ?? -1} />
</>);
rgallery.camR = (v): CamSpec => ({ p: [(v?.face ?? 0) * 2.5 * 0 - 1.6, 2.5, 0.2], l: [0.6, 2.3, -3.8], fov: 54, move: 'truck', amt: 2.4, dir: 1 });
export const rafter: Set3 = ({ t }: SetP) => (<>
  <Night t={t} indoor density={0.045} amb={0.3} moonI={0.4} rim={0.22} fill={0.18} disc={null} stars={false} fog="#15181e" />
  <Living t={t} tv={0.9} pizza lamp={0.25} stain empty />
</>);
rafter.camR = (): CamSpec => ({ p: [1.8, 1.7, 3.8], l: [0, 0.9, 0.6], fov: 52, move: 'push', amt: 0.26 });
export const SETS: Record<string, Set3> = { rflat, rscreen, rlobby, roffice, rcrash, rshop, rhouse, rdoor, rliving, rupstairs, rseer, rgallery, rafter };
