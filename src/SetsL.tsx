import React from 'react';
import { Set3, SetP } from './Stage3';
import { CamSpec } from './k3/Cam';
import { V3, M, PAL, ss, seg, sway, clamp } from './k3/core';
import { Night, Mist, Flakes } from './k3/World';
import { Person } from './k3/Person';
import { CAST3 } from './Cast3D';
import { JACK, JACK_HOME, ALLIE, JAMES, DIEGO, LOTTERY, LOTTERY_RICH, DONNA, BOY } from './SeerCast';
import { SP, Seer, Monitor, Keyboard, Router, Flat, Desk, OfficeChair, Cubicles, Lobby, Car, Lorry, Street, Shop, BigHouse, Living, HomeOffice, Hall, Void, Gallery, CarPark } from './SR3';
import { EndScreen3, endCam } from './End3';
// ===== 16:9 SETS — "The Seer of Possibilities" (story kit q).
// Every set: a camera MOVE with smoothstep easing + breathing sway, people who breathe, one motivated light, flat-shaded models.
// v.fr sets the framing (wide | waist | bust | close | detail). v.txt = the red lines on a screen, v.typed = how much is typed.
const FR = { wide: 1, waist: 0.62, bust: 0.44, close: 0.32, detail: 0.24 } as Record<string, number>;
const d = (v: any, base: number) => base * (FR[v?.fr as string] ?? 1);
const T = (v: any, fallback: string[]) => (v?.txt as string[]) || fallback;
const typed = (v: any, t: number, len: number) => (v?.typed != null ? v.typed : seg(t, 0.15, Math.max(1.2, len * 0.62)));
// ---------- 1. the small flat at night: desk, CRT, router, window with orange street light
export const flat: Set3 = ({ t, len, v }: SetP) => (<>
  <Night t={t} indoor density={0.035} amb={0.42} moonI={0.5} rim={0.3} fill={0.25} disc={null} stars={false} fog="#1a1d24" />
  <Flat t={t} />
  <Desk at={[0.2, 0, -2.3]} w={1.6} d={0.75} />
  <Monitor at={[0.2, 0.79, -2.5]} rot={0.04} t={t} lines={T(v, [])} typed={typed(v, t, len)} off={v?.off} light={v?.off ? 0 : 1.1} />
  <Keyboard at={[0.2, 0.77, -2.0]} />
  <Router at={[-0.85, 0.79, -2.45]} t={t} />
  <OfficeChair at={[0.2, 0, -1.5]} rot={Math.PI} t={t} />
  {!v?.empty && <Person s={JACK_HOME} at={[0.2, 0, -1.45]} rot={Math.PI} t={t} pose={v?.pose || 'sit'} expr={v?.expr || 'calm'} seed={2} look={[v?.look ?? 0, 0.12]} tremble={v?.tremble} />}
</>);
flat.cam = (v, t, len): CamSpec => (v?.fr === 'detail'
  ? { p: [1.25, 1.55, -0.95], l: [0.25, 0.82, -2.2], fov: 44, move: 'push', amt: 0.22, breath: 0.8 }
  : { p: [-1.6, 1.62, d(v, 2.6) - 0.7], l: [0.1, 1.15, -2.2], fov: 42, move: v?.cm || 'orbit', amt: 0.3, dir: v?.dir ?? 1 });
// ---------- 2. the screen itself: the red text fills the frame
export const screen: Set3 = ({ t, len, v }: SetP) => (<>
  <Night t={t} indoor density={0.02} amb={0.3} moonI={0.2} rim={0.15} fill={0.15} disc={null} stars={false} fog="#15161c" />
  <Monitor at={[0, 0, 0]} t={t} crt={v?.crt !== false} lines={T(v, ['...'])} typed={typed(v, t, len)} light={0.35} s={2.4} />
  <mesh position={[0, 0.9, -1.4]} material={M('#14161c')}><boxGeometry args={[7, 4, 0.1]} /></mesh>
  <pointLight position={[1.6, 2.1, 2.2]} intensity={1.3} distance={7} decay={1.7} color="#8fa8d8" />
</>);
screen.cam = (v): CamSpec => ({ p: [0.18 * (v?.side ?? 1), 0.95, d(v, 1.95) * 0.9 + 0.1], l: [0, 0.86, 0], fov: 36, move: v?.cm || 'push', amt: 0.14, dir: v?.dir ?? 1, breath: 0.7 });
// ---------- 3. the office tower from the street, morning
export const tower: Set3 = ({ t }: SetP) => (<>
  <Night t={t} sky="#5a6e86" fog="#7e8ea0" density={0.012} moon={[-10, 16, 12]} moonI={2.2} amb={0.75} hemi={1.0} disc={null} stars={false} />
  <Street t={t} night={false} lamps={3} len={50} />
  <group position={[9.5, 0, -8]}>
    <mesh position={[0, 11, 0]} material={M('#5a6470')}><boxGeometry args={[9, 22, 12]} /></mesh>
    {Array.from({ length: 9 }, (_, r) => Array.from({ length: 4 }, (_, c) => <mesh key={r + '_' + c} position={[-4.52, 2.4 + r * 2.2, -4 + c * 2.6]} material={M(r % 3 === 0 && c % 2 === 0 ? '#a8c0d8' : '#39465a')}><boxGeometry args={[0.06, 1.5, 1.9]} /></mesh>))}
    <mesh position={[-4.6, 1.3, 0]} material={M('#9fb4cc')}><boxGeometry args={[0.12, 2.6, 10]} /></mesh>
  </group>
  {Array.from({ length: 4 }, (_, i) => <Person key={i} s={[CAST3.rose, CAST3.sam, CAST3.terence, CAST3.agnes][i]} at={[3 + i * 0.9, 0, 2 - i * 1.6]} rot={-1.2} t={t + i * 1.5} pose="walk" travel={false} seed={40 + i} far detail={false} />)}
</>);
tower.cam = (v): CamSpec => ({ p: [1.2, 1.65, d(v, 7.5) + 1.5], l: [7.5, 9, -7], fov: 46, move: v?.cm || 'crane', amt: 2.6, dir: v?.dir ?? 1, breath: 1.1 });
// ---------- 4. the lobby with the plant
export const lobby: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} indoor density={0.02} amb={0.95} moonI={1.1} hemi={1.35} rim={0.5} fill={0.45} disc={null} stars={false} fog="#5a6472" />
  <Lobby t={t} plantOut={v?.out ?? 0} people={v?.people ?? 0} morning />
  {v?.jack !== false && <Person s={JACK} at={[v?.at ?? 0.9, 0, -4.4]} rot={v?.rot ?? 0.1} t={t} pose={v?.pose || 'idle'} expr={v?.expr || 'calm'} seed={2} />}
</>);
lobby.cam = (v): CamSpec => (v?.fr === 'detail'
  ? { p: [1.3, 1.05, -4.5], l: [0.1, 0.5, -6.2], fov: 42, move: 'arc', amt: 0.3, dir: -1 }
  : { p: [-1.0, 1.7, d(v, 4.6) - 2.6], l: [0.2, 1.25, -6.3], fov: 44, move: v?.cm || 'push', amt: 0.3 });
// ---------- 5. the cubicle floor
export const office: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} indoor density={0.02} amb={0.95} moonI={1.0} hemi={1.35} rim={0.5} fill={0.45} disc={null} stars={false} fog="#55606e" />
  <Cubicles t={t} rows={3} cols={4} />
  {v?.jack !== false && <Person s={JACK} at={[-1.4, 0, 0.4]} rot={v?.rot ?? 2.6} t={t} pose={v?.pose || 'sit'} expr={v?.expr || 'calm'} seed={2} />}
  {v?.crowd && [0, 1, 2, 3].map((i) => <Person key={i} s={[CAST3.rose, CAST3.sam, CAST3.agnes, CAST3.terence][i]} at={[1.6 + i * 1.3, 0, -1.6 - (i % 2) * 2.4]} rot={2.2 + i * 0.4} t={t + i * 1.7} pose={i % 2 ? 'idle' : 'look'} expr="sad" seed={50 + i} far detail={false} />)}
</>);
office.cam = (v): CamSpec => ({ p: [-3.4, 1.72, d(v, 4.6) - 0.4], l: [-0.6, 1.25, -1.6], fov: 42, move: v?.cm || 'truck', amt: 1.5, dir: v?.dir ?? 1 });
// ---------- 6. Allie at her desk (two-shot with Jack)
export const allie: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} indoor density={0.02} amb={0.95} moonI={1.0} hemi={1.35} rim={0.5} fill={0.45} disc={null} stars={false} fog="#55606e" />
  <Cubicles t={t} rows={2} cols={3} />
  <Person s={ALLIE} at={[0.2, 0, -0.5]} rot={v?.arot ?? 2.5} t={t} pose={v?.apose || 'sit'} expr={v?.aexpr || 'smile'} seed={6} />
  {v?.jack !== false && <Person s={JACK} at={[1.5, 0, 0.55]} rot={v?.jrot ?? -2.3} t={t + 1.2} pose={v?.jpose || 'idle'} expr={v?.jexpr || 'calm'} seed={2} />}
  {v?.james && <Person s={JAMES} at={[2.5, 0, -1.3]} rot={-2.0} t={t} pose="idle" expr="pain" seed={8} rig={{ hpRf: 0.22, knR: 0.5 }} />}
</>);
allie.cam = (v): CamSpec => ({ p: [2.8, 1.68, d(v, 3.4) + 0.6], l: [0.6, 1.3, -0.4], fov: 40, move: v?.cm || 'orbit', amt: 0.3, dir: -1 });
// ---------- 7. the lift doors open: James limping out
export const liftout: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} indoor density={0.02} amb={0.6} moonI={0.7} hemi={0.9} rim={0.4} fill={0.35} disc={null} stars={false} fog="#55606e" />
  <Cubicles t={t} rows={2} cols={3} />
  <group position={[-3.2, 0, -2.2]}>
    <mesh position={[0, 1.2, 0]} material={M('#8e949c', { m: 0.5, r: 0.45 })}><boxGeometry args={[2.0, 2.4, 0.12]} /></mesh>
    <mesh position={[0, 1.2, 0.08]} material={M('#2a2e34')}><boxGeometry args={[0.06, 2.3, 0.04]} /></mesh>
  </group>
  <Person s={JAMES} at={[-2.4, 0, -1.2]} rot={1.1} t={t} pose="walk" speed={0.5} travel={false} expr="pain" seed={8} rig={{ shLf: 0.9, elL: 1.4, knR: 0.55, hpRf: 0.2 }} />
  <Person s={JACK} at={[0.9, 0, 0.3]} rot={-2.4} t={t + 1} pose="idle" expr={v?.jexpr || 'shock'} seed={2} />
  <Person s={ALLIE} at={[0.0, 0, -0.4]} rot={2.4} t={t + 2} pose="idle" expr="shock" seed={6} />
</>);
liftout.cam = (v): CamSpec => ({ p: [1.9, 1.7, d(v, 3.8) + 0.8], l: [-1.4, 1.35, -1.0], fov: 44, move: v?.cm || 'push', amt: 0.3, dir: v?.dir ?? 1 });
// ---------- 8. the office windows, seven floors up, after the sound
export const window7: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} indoor density={0.02} amb={0.9} moonI={1.0} hemi={1.3} rim={0.45} fill={0.4} disc={null} stars={false} fog="#55606e" />
  <Cubicles t={t} rows={2} cols={3} lit={0.8} />
  <group position={[7.4, 0, -2]}>
    <mesh position={[0, 1.4, 0]} material={M('#9fb8d0', { op: 0.35 })}><boxGeometry args={[0.06, 2.4, 10]} /></mesh>
    {Array.from({ length: 5 }, (_, i) => <mesh key={i} position={[0.1, 1.4, -4.6 + i * 2.3]} material={M('#3a3f46')}><boxGeometry args={[0.1, 2.5, 0.12]} /></mesh>)}
  </group>
  {/* the city seven floors down, seen through the glass */}
  <group position={[16, -9, -2]}>
    {Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[(i % 3) * 5 - 2, 3 + (i % 4) * 2.5, -8 + i * 2.6]} material={M(i % 2 ? '#3f4a58' : '#4a5664')}><boxGeometry args={[4.2, 9 + (i % 3) * 4, 4.2]} /></mesh>)}
    <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]} material={M('#2e3238')}><planeGeometry args={[40, 40]} /></mesh>
  </group>
  {[0, 1, 2, 3].map((i) => <Person key={i} s={[JACK, CAST3.rose, CAST3.sam, CAST3.agnes][i]} at={[6.4, 0, -4 + i * 1.5]} rot={1.57} t={t + i * 1.3} pose={i === 0 ? 'idle' : 'look'} expr={i === 0 ? 'shock' : 'fear'} seed={2 + i * 7} detail={i < 2} far={i > 1} />)}
</>);
window7.cam = (v): CamSpec => ({ p: [4.3, 1.72, d(v, 3.2) - 3.4], l: [6.9, 1.45, -1.2], fov: 46, move: v?.cm || 'truck', amt: 1.5, dir: v?.dir ?? -1 });
// ---------- 9. the street after the crash (no body is ever shown)
export const crash: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} sky="#55657a" fog="#76869a" density={0.016} moon={[-8, 14, 10]} moonI={2.0} amb={0.7} hemi={0.95} disc={null} stars={false} />
  <Street t={t} night={false} lamps={3} len={46} />
  <Lorry at={[-2.2, 0, 3.4]} rot={0.28} />
  <Car at={[1.4, 0, -1.2]} rot={1.35} c="#6a3a34" crushed={0.75} />
  {Array.from({ length: 9 }, (_, i) => { const a = -1.1 + i * 0.26; const r = 7.5; return (
    <Person key={i} s={[CAST3.rose, CAST3.sam, CAST3.agnes, CAST3.terence, CAST3.lyra, CAST3.mira, CAST3.elias, CAST3.isla, CAST3.erik][i]} at={[Math.sin(a) * r, 0, Math.cos(a) * r - 2]} rot={Math.PI + a} t={t + i * 1.1} pose={i % 3 === 0 ? 'cover' : 'idle'} expr="shock" seed={60 + i} far detail={false} />); })}
  {v?.jack && <Person s={JACK} at={[1.0, 0, 5.2]} rot={Math.PI} t={t} pose={v?.pose || 'idle'} expr="shock" seed={2} />}
</>);
crash.cam = (v): CamSpec => (v?.fr === 'wide'
  ? { p: [3.0, 7.5, 13], l: [0.4, 1.2, 0], fov: 44, move: 'drop', amt: 3.2, breath: 1.2 }
  : { p: [2.2, 1.68, d(v, 7.4) + 1], l: [0.6, 1.2, -0.6], fov: 42, move: v?.cm || 'arc', amt: 0.3, dir: -1 });
// ---------- 10. shops: off licence, supermarket, electronics
export const shop: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} indoor density={0.02} amb={1.0} moonI={0.9} hemi={1.4} rim={0.5} fill={0.45} disc={null} stars={false} fog="#6a7078" />
  <Shop t={t} kind={v?.kind || 'booze'} />
  {v?.man && <Person s={v?.rich ? LOTTERY_RICH : LOTTERY} at={[-0.7, 0, 2.4]} rot={v?.mrot ?? 0.3} t={t} pose={v?.mpose || 'idle'} expr={v?.rich ? 'smile' : 'calm'} seed={12} />}
  {v?.jack !== false && <Person s={JACK} at={[0.9, 0, 3.2]} rot={v?.jrot ?? -0.4} t={t + 1.4} pose={v?.jpose || 'idle'} expr={v?.jexpr || 'calm'} seed={2} />}
</>);
shop.cam = (v): CamSpec => ({ p: [3.1, 1.66, d(v, 3.2) + 4.6], l: [-0.6, 1.3, 1.6], fov: 44, move: v?.cm || 'arc', amt: 0.3, dir: 1 });
// ---------- 11. the county car park, space 43
export const carpark: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} sky="#36435c" fog="#4a5a72" density={0.02} moon={[-9, 13, 9]} moonI={1.7} amb={0.6} hemi={0.8} disc={[-30, 24, -70]} discR={5} />
  <CarPark t={t} cars={5} />
  <Car at={[1.5, 0, 1.6]} rot={0.02} c="#3a4450" lights={v?.lights} t={t} />
  {v?.jack && <Person s={JACK} at={[2.9, 0, 2.2]} rot={-1.2} t={t} pose={v?.pose || 'walk'} travel={false} expr="calm" seed={2} />}
</>);
carpark.cam = (v): CamSpec => ({ p: [6.5, 3.4, d(v, 8.4) + 2], l: [1.2, 1.1, 1.2], fov: 42, move: v?.cm || 'crane', amt: -1.6, dir: -1 });
// ---------- 12. the big house at the end of the long road (night)
export const house: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} density={0.04} moonI={1.8} amb={0.5} disc={[-34, 26, -90]} discR={6} />
  <BigHouse t={t} lit={v?.lit ?? 1} door={v?.door ?? 0} car />
  <Flakes t={t} n={120} kind="dust" box={[-14, 14, 0, 6, -6, 10]} size={0.035} />
</>);
house.cam = (v): CamSpec => ({ p: [2.2, 1.75, d(v, 14) + 3], l: [0, 2.2, -3.4], fov: 42, move: v?.cm || 'push', amt: 0.3, breath: 1.2 });
// ---------- 13. the front door, from inside the hall
export const frontdoor: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} indoor density={0.03} amb={0.6} moonI={0.7} rim={0.4} fill={0.35} disc={null} stars={false} fog="#1e2229" />
  <Hall t={t} doorOpen={0.85} lamp={1} />
  {v?.boy !== false && <Person s={BOY} at={[0.1, 0, 5.3]} rot={Math.PI} t={t} pose={v?.bpose || 'hold'} expr={v?.bexpr || 'angry'} seed={14} />}
  {v?.jack !== false && <Person s={JACK_HOME} at={[0.1, 0, 3.4]} rot={0.05} t={t + 1} pose={v?.jpose || 'idle'} expr={v?.jexpr || 'calm'} seed={2} />}
</>);
frontdoor.cam = (v): CamSpec => (v?.fr === 'wide'
  ? { p: [1.75, 1.55, 0.4], l: [0.1, 1.6, 4.8], fov: 48, move: 'push', amt: 0.26 }
  : { p: [1.5, 1.5, 2.1], l: [0.05, 1.78, 5.2], fov: 42, move: v?.cm || 'tilt', amt: 0.5 });
// ---------- 14. the living room (pizza, Donna, the TV)
export const living: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} indoor density={0.03} amb={0.4} moonI={0.5} rim={0.28} fill={0.22} disc={null} stars={false} fog="#1e2229" />
  <Living t={t} tv={v?.tv ?? 1} pizza={v?.pizza} lamp={v?.lamp ?? 1} stain={v?.stain} />
  {v?.donna && <Person s={DONNA} at={[-0.5, 0, 1.75]} rot={0.1} t={t} pose={v?.dpose || 'sit'} expr={v?.dexpr || 'smile'} seed={9} />}
  {v?.jack && <Person s={JACK_HOME} at={[0.7, 0, 1.8]} rot={0.05} t={t + 1.3} pose={v?.jpose || 'sit'} expr={v?.jexpr || 'calm'} seed={2} />}
</>);
living.cam = (v): CamSpec => ({ p: [2.9, 1.55, d(v, 3.6) + 1.4], l: [-0.1, 1.0, 0.9], fov: 42, move: v?.cm || 'orbit', amt: 0.28, dir: -1 });
// ---------- 15. the upstairs office of the big house
export const upstairs: Set3 = ({ t, len, v }: SetP) => (<>
  <Night t={t} indoor density={0.03} amb={0.38} moonI={0.5} rim={0.28} fill={0.22} disc={null} stars={false} fog="#1b1f26" />
  <HomeOffice t={t} lines={T(v, [])} typed={typed(v, t, len)} off={v?.off} lamp={v?.lamp ?? 0.5} />
  {v?.jack !== false && <Person s={JACK_HOME} at={[0.6, 0, -1.25]} rot={Math.PI + (v?.turn ?? 0)} t={t} pose={v?.pose || 'sit'} expr={v?.expr || 'calm'} seed={2} tremble={v?.tremble} />}
</>);
upstairs.cam = (v): CamSpec => (v?.fr === 'detail'
  ? { p: [0.98, 1.15, -1.6], l: [0.6, 0.95, -2.3], fov: 40, move: 'push', amt: 0.18, breath: 0.8 }
  : { p: [2.2, 1.6, d(v, 2.8) - 0.6], l: [0.5, 1.2, -2.1], fov: 42, move: v?.cm || 'orbit', amt: 0.3, dir: v?.dir ?? -1 });
// ---------- 16. the doorway behind him: the shape with the knife
export const doorway: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} indoor density={0.035} amb={0.34} moonI={0.45} rim={0.25} fill={0.2} disc={null} stars={false} fog="#1b1f26" />
  <HomeOffice t={t} lines={T(v, ['Have you nothing to say to me, Jack?'])} typed={v?.typed ?? 1} lamp={0.35} />
  <Person s={JACK_HOME} at={[0.6, 0, -1.25]} rot={Math.PI - 0.35} t={t} pose="sit" expr={v?.jexpr || 'fear'} seed={2} tremble={0.6} />
  <group position={[-1.9, 0, 2.3]}>
    <mesh position={[0, 1.3, 0.12]} material={M('#07080b')}><boxGeometry args={[1.3, 2.6, 0.1]} /></mesh>
    <Person s={BOY} at={[0, 0, -0.1]} rot={0.25} t={t} pose={v?.bpose || 'idle'} expr="angry" seed={14} />
    <mesh position={[0.42, 0.78, 0.26]} rotation={[0.25, 0, 0.1]} material={M('#b8bcc4', { m: 0.8, r: 0.3 })}><boxGeometry args={[0.05, 0.42, 0.012]} /></mesh>
    <mesh position={[0.42, 0.62, 0.27]} rotation={[0.25, 0, 0.1]} material={M('#4a0a0c', { r: 0.2 })}><boxGeometry args={[0.055, 0.2, 0.014]} /></mesh>
  </group>
</>);
doorway.cam = (v): CamSpec => ({ p: [2.35, 1.9, -0.5], l: [-1.2, 1.45, 1.6], fov: 46, move: v?.cm || 'drop', amt: 0.9, shake: v?.shake });
// ---------- 17. the Seer in the void
export const seer: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} indoor density={0.05} amb={0.3} ambC="#6a4a52" moonI={0.45} moonC="#8fa8ff" rim={0.35} fill={0.2} disc={null} stars={false} fog="#14090c" sky="#07070c" />
  <Void t={t} canvases={v?.canvases ?? 0} glow={v?.glow ?? 1} />
  <Seer at={[0, 0, 0]} rot={v?.rot ?? 0.2} t={t} pose={v?.pose || 'stand'} look={[sway(t, 9, 0.1, 2), 0]} />
</>);
seer.cam = (v): CamSpec => (v?.fr === 'close' || v?.fr === 'bust'
  ? { p: [0.8, 2.02, 1.95], l: [0, 1.95, 0], fov: 36, move: 'orbit', amt: 0.26, dir: 1, breath: 1.2 }
  : { p: [1.8, 1.7, d(v, 5.6) + 0.8], l: [0, 1.5, 0], fov: 40, move: v?.cm || 'arc', amt: 0.32, dir: v?.dir ?? -1 });
// ---------- 17b. the Seer with the explain tags (policy 2H: name the parts the words name)
export const seerTags: Set3 = ({ t, tag }: SetP) => {
  tag({ at: [0.22, 1.98, 0.17], text: 'eyes painted out' });
  tag({ at: [0.52, 0.95, 0.18], text: 'red on the fingers', side: 1 });
  tag({ at: [0, 0.4, 0], text: 'no feet', side: -1 });
  return (<>
    <Night t={t} indoor density={0.05} amb={0.32} ambC="#6a4a52" moonI={0.5} moonC="#8fa8ff" rim={0.35} fill={0.2} disc={null} stars={false} fog="#14090c" sky="#07070c" />
    <Void t={t} canvases={3} glow={1} />
    <Seer at={[0, 0, 0]} rot={0.15} t={t} pose="stand" />
  </>);
};
seerTags.cam = (v): CamSpec => ({ p: [1.5, 1.75, d(v, 4.2) + 1.2], l: [0, 1.45, 0], fov: 38, move: v?.cm || 'push', amt: 0.2, dir: v?.dir ?? 1, breath: 1.1 });
// ---------- 18. the painted chain wall
export const gallery: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} indoor density={0.04} amb={0.3} ambC="#5a4a46" moonI={0.4} rim={0.3} fill={0.2} disc={null} stars={false} fog="#14121a" sky="#08080c" />
  <Gallery t={t} litFace={v?.face ?? -1} />
  <pointLight position={[0, 4.2, 2.2]} intensity={2.6} distance={16} decay={1.5} color="#c8b49a" />
  {v?.seer && <Seer at={[4.6, 0, -1.6]} rot={-0.6} t={t} pose="stand" scale={0.9} />}
</>);
gallery.cam = (v): CamSpec => (v?.face != null && v.face >= 0
  ? { p: [(v.face - 2) * 2.5 + 0.7, 2.5, -1.1], l: [(v.face - 2) * 2.5, 2.4, -3.8], fov: 38, move: v?.cm || 'push', amt: 0.2, dir: v?.dir ?? 1 }
  : { p: [-4.5, 2.6, 0.6], l: [1.5, 2.3, -3.8], fov: 44, move: v?.cm || 'truck', amt: 3.2, dir: v?.dir ?? 1 });
// ---------- 19. the dark living room seen from the stairs (after)
export const after: Set3 = ({ t }: SetP) => (<>
  <Night t={t} indoor density={0.045} amb={0.3} moonI={0.4} rim={0.22} fill={0.18} disc={null} stars={false} fog="#15181e" />
  <Living t={t} tv={0.9} pizza lamp={0.25} stain empty />
  <Mist t={t} n={4} area={[-4, 4, -3, 3]} y={0.4} o={0.08} c="#2a2a32" size={6} />
</>);
after.cam = (v): CamSpec => ({ p: [2.4, 1.85, d(v, 4.4) + 1.4], l: [0, 0.75, 0.6], fov: 42, move: v?.cm || 'push', amt: 0.26, dir: v?.dir ?? 1, breath: 1.1 });
// ---------- 20. the end screen
export const end: Set3 = EndScreen3 as any;
(end as any).cam = endCam;
(end as any).overlay = (EndScreen3 as any).overlay;
export const SETS: Record<string, Set3> = { flat, screen, tower, lobby, office, allie, liftout, window7, crash, shop, carpark, house, frontdoor, living, upstairs, doorway, seer, seerTags, gallery, after, end };
