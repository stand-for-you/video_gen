import React from 'react';
import { Set3, SetP } from './Stage3';
import { CamSpec } from './k3/Cam';
import { V3, M, G, ss, sway } from './k3/core';
import { Night, Mist, Halo } from './k3/World';
import { Person } from './k3/Person';
import { Bedroom, Hall, Kitchen, HouseOut, Woods, Ward, Corridor, CarKerb, Camera3, Bundle, Eyeless, EJP, Blinds } from './EJ3';
import { MITCH, MITCH_BED, EDWIN, DOCTOR } from './EJCast';
import { EndScreen3, endCam } from './End3';
// ===== STORY SLOT: the 16:9 sets of "Eyeless Jack" (kit r).
// Every set follows the engine laws: the camera always moves with smoothstep easing and a breathing sway, people breathe,
// fog and grass drift, every model is flat shaded, and the picture shows exactly what the sentence says.
// CAMERA HABIT of this kit: the BEDSIDE RISE - the camera starts low, at the height of somebody lying down, and rises with a tilt.
const FR = { wide: 1, waist: 0.62, bust: 0.42, close: 0.3, detail: 0.22 } as Record<string, number>;
const d = (v: any, base: number) => base * (FR[v?.fr as string] ?? 1);
const T = (v: any, f: any) => (v?.txt ?? f);

// ---------- 1. the back room at night (empty bed, blinds, boxes)
export const bedroom: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} indoor density={0.03} amb={0.6} moonI={0.8} rim={0.4} fill={0.35} disc={null} stars={false} fog="#23303a" />
  <Bedroom t={t} lamp={v?.lamp ?? 0} open={v?.open ?? 0} boxes={v?.boxes !== false} cam={v?.cam !== false} door={v?.door ?? 0.2} />
  {v?.sit && <Person s={MITCH_BED} at={[0.62, 0.16, 0.95]} rot={-1.3} t={t} pose="sit" expr={v?.expr || 'fear'} seed={3} tremble={v?.tremble} />}
</>);
bedroom.cam = (v): CamSpec => ({ p: [1.45, 0.95, d(v, 1.75) + 0.15], l: [0.1, 0.72, -0.5], fov: 44, move: v?.cm || 'crane', amt: 0.9, dir: v?.dir ?? 1, breath: 1.0 });

// ---------- 2. the thing leaning over the bed (the first picture of the video)
export const over: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} indoor density={0.035} amb={0.5} moonI={0.9} rim={0.5} fill={0.3} disc={null} stars={false} fog="#1e2a34" />
  <Bedroom t={t} lamp={0} open={v?.open ?? 0.9} boxes cam door={0.1} />
  {v?.sit && <Person s={MITCH_BED} at={[0.62, 0.16, 0.95]} rot={-1.3} t={t} pose="sit" expr="fear" seed={3} tremble={0.5} />}
  <Eyeless at={[1.15, 0, 0.45]} rot={-1.57} t={t} pose={v?.pose || 'bend'} p={v?.p} />
</>);
over.cam = (v): CamSpec => ({ p: [-0.9, 0.78, d(v, 1.05) + 0.2], l: [0.67, 1.12, 0.45], fov: 42, move: v?.cm || 'push', amt: 0.5, dir: v?.dir ?? 1, breath: 1.2 });

// ---------- 3. the empty sockets, close, with the shoulders and the ceiling still in frame (never a face alone)
export const sockets: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} indoor density={0.04} amb={0.45} moonI={0.85} rim={0.55} fill={0.28} disc={null} stars={false} fog="#1b2630" />
  <Bedroom t={t} lamp={0} open={0.9} boxes={false} cam={false} door={0.1} />
  <Eyeless at={[1.1, 0, 0.5]} rot={-1.75} t={t} pose={v?.pose || 'bend'} />
</>);
sockets.cam = (v): CamSpec => ({ p: [-0.08, 1.2, d(v, 0.72) + 0.3], l: [0.6, 1.1, 0.5], fov: 38, move: v?.cm || 'arc', amt: 0.35, dir: v?.dir ?? -1, breath: 1.3 });

// ---------- 4. the window from inside: the sash, the blinds, the dark yard beyond
export const window7: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} indoor density={0.03} amb={0.58} moonI={0.9} rim={0.42} fill={0.34} disc={null} stars={false} fog="#22303a" />
  <Bedroom t={t} lamp={v?.lamp ?? 0} open={v?.open ?? 0.9} boxes cam={false} door={0.15} />
  <mesh position={[0, 1.45, -2.45]} material={M('#1a242c')}><boxGeometry args={[3.2, 2.2, 0.05]} /></mesh>
  <pointLight position={[0.6, 2.0, -3.2]} intensity={2.2} distance={9} decay={1.6} color={EJP.amber} />
</>);
window7.cam = (v): CamSpec => ({ p: [0.5, 0.85, d(v, 2.2) - 0.3], l: [0, 1.5, -2.2], fov: 44, move: v?.cm || 'push', amt: 0.6, dir: v?.dir ?? 1, breath: 0.9 });

// ---------- 5. the dark back yard seen from the window (the rustling)
export const yard: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} density={0.05} amb={0.5} moonI={1.0} rim={0.4} fill={0.3} fog="#1d2830" />
  <HouseOut t={t} porch={v?.porch ?? 0.9} bins door={v?.door ?? 0} />
</>);
yard.cam = (v): CamSpec => ({ p: [-2.6, 1.5, d(v, 7.5) + 2.0], l: [-2.2, 1.1, 1.0], fov: 46, move: v?.cm || 'truck', amt: 1.4, dir: v?.dir ?? 1, breath: 1.1 });

// ---------- 6. the house from the street, porch light on
export const house: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} density={0.05} amb={0.5} moonI={1.0} rim={0.4} fill={0.3} fog="#1d2830" />
  <HouseOut t={t} porch={v?.porch ?? 1} bins door={v?.door ?? 0} />
  {v?.mitch && <Person s={MITCH} at={[1.2, 0, 7.5]} rot={v?.run ? 0.3 : Math.PI} t={t} pose={v?.pose || 'walk'} expr={v?.expr || 'fear'} seed={3} />}
</>);
house.cam = (v): CamSpec => ({ p: [4.2, 1.5, d(v, 11) + 3], l: [0, 2.0, -1], fov: 48, move: v?.cm || 'crane', amt: 1.8, dir: v?.dir ?? 1, breath: 1.2 });

// ---------- 7. the front door and the porch
export const porch: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} density={0.045} amb={0.6} moonI={0.9} rim={0.45} fill={0.38} fog="#202c34" />
  <HouseOut t={t} porch={1} bins={false} door={v?.door ?? 0.6} />
  {v?.mitch !== false && <Person s={MITCH} at={[-0.4, 0, 1.0]} rot={0.4} t={t} pose={v?.pose || 'idle'} expr={v?.expr || 'calm'} seed={3} />}
</>);
porch.cam = (v): CamSpec => ({ p: [2.0, 1.45, d(v, 4.4) + 1.6], l: [0, 1.5, -0.4], fov: 44, move: v?.cm || 'arc', amt: 0.9, dir: v?.dir ?? -1, breath: 1.0 });

// ---------- 8. the house corridor (boxes in the hall, and later the far end)
export const hall: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} indoor density={0.035} amb={0.62} moonI={0.6} rim={0.4} fill={0.36} disc={null} stars={false} fog="#242e34" />
  <Hall t={t} lamp={v?.lamp ?? 1.0} far={v?.far} shake={v?.shake} />
  {v?.mitch && <Person s={MITCH} at={[-0.2, 0, -0.6]} rot={Math.PI} t={t} pose={v?.pose || 'walk'} expr={v?.expr || 'calm'} seed={3} hold={v?.box ? undefined : undefined} />}
</>);
hall.cam = (v): CamSpec => ({ p: [0.45, 1.05, d(v, 3.2) + 0.9], l: [0, 1.4, -6.5], fov: 46, move: v?.cm || 'push', amt: 1.6, dir: v?.dir ?? 1, breath: 1.0 });

// ---------- 9. the kitchen, Edwin and the coffee cup
export const kitchen: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} indoor density={0.02} amb={0.75} moonI={0.5} rim={0.35} fill={0.45} disc={null} stars={false} fog="#2a3238" />
  <Kitchen t={t} cup={v?.cup ?? 0} mirror={v?.mirror} />
  {v?.edwin !== false && <Person s={EDWIN} at={[-0.9, 0, -0.3]} rot={1.1} t={t} pose={v?.epose || 'idle'} expr={v?.eexpr || 'calm'} seed={8} />}
  {v?.mitch && <Person s={MITCH} at={[0.9, 0, 0.9]} rot={-1.9} t={t} pose={v?.pose || 'idle'} expr={v?.expr || 'calm'} seed={3} />}
</>);
kitchen.cam = (v): CamSpec => ({ p: [1.7, 1.25, d(v, 3.6) + 0.6], l: [-0.3, 1.3, -0.2], fov: 44, move: v?.cm || 'orbit', amt: 0.7, dir: v?.dir ?? 1, breath: 1.0 });

// ---------- 10. the little mirror: the cut on the cheek (shown as one thin line, nothing more)
export const mirror: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} indoor density={0.02} amb={0.8} moonI={0.5} rim={0.35} fill={0.5} disc={null} stars={false} fog="#2a3238" />
  <Kitchen t={t} cup={1} mirror />
  <Person s={MITCH} at={[-1.45, 0, 0.3]} rot={-Math.PI / 2} t={t} pose="idle" expr={v?.expr || 'shock'} seed={3} />
  <pointLight position={[-1.9, 1.7, 1.0]} intensity={2.2} distance={5} decay={1.7} color="#ffe6c0" />
</>);
mirror.cam = (v): CamSpec => ({ p: [-0.35, 1.52, d(v, 1.5) + 0.55], l: [-1.75, 1.5, 0.28], fov: 40, move: v?.cm || 'push', amt: 0.3, dir: v?.dir ?? 1, breath: 0.9 });

// ---------- 11. the hospital room
export const ward: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} indoor density={0.015} amb={0.85} moonI={0.4} rim={0.3} fill={0.55} disc={null} stars={false} fog="#33403e" />
  <Ward t={t} person={v?.person !== false} doc={v?.doc} chart={v?.chart} />
</>);
ward.cam = (v): CamSpec => ({ p: [1.6, 1.35, d(v, 3.4) + 0.8], l: [-0.3, 0.85, 0.1], fov: 44, move: v?.cm || 'drop', amt: 0.8, dir: v?.dir ?? 1, breath: 0.9 });

// ---------- 12. the hospital corridor with the red EXIT sign
export const corridor: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} indoor density={0.02} amb={0.8} moonI={0.4} rim={0.3} fill={0.5} disc={null} stars={false} fog="#36423f" />
  <Corridor t={t} chairs people={v?.people ?? 0} />
</>);
corridor.cam = (v): CamSpec => ({ p: [0.7, 1.3, d(v, 4.2) + 1.0], l: [0, 1.5, -7], fov: 46, move: v?.cm || 'truck', amt: 1.5, dir: v?.dir ?? -1, breath: 1.0 });

// ---------- 13. the pine woods behind the fence
export const woods: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} density={0.06} amb={0.52} moonI={0.85} rim={0.4} fill={0.3} fog="#1a241f" />
  <Woods t={t} amber={v?.amber ?? 0.5} />
  {v?.mitch !== false && <Person s={MITCH} at={[0, 0, 1.2]} rot={v?.rot ?? 0.2} t={t} pose={v?.pose || 'run'} expr={v?.expr || 'fear'} seed={3} travel={false} />}
</>);
woods.cam = (v): CamSpec => ({ p: [1.1, 1.3, d(v, 4.0) + 1.4], l: [0, 1.2, -2.5], fov: 50, move: v?.cm || 'follow', amt: 2.2, dir: v?.dir ?? 1, breath: 1.4 });

// ---------- 14. the car at the kerb
export const car: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} density={0.045} amb={0.58} moonI={0.8} rim={0.4} fill={0.34} fog="#212a30" />
  <CarKerb t={t} />
</>);
car.cam = (v): CamSpec => ({ p: [3.0, 1.2, d(v, 5.0) + 1.4], l: [0, 1.0, 0], fov: 46, move: v?.cm || 'arc', amt: 1.1, dir: v?.dir ?? 1, breath: 1.0 });

// ---------- 15. the back seat, the cloth bundle in his hands
export const seat: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} indoor density={0.03} amb={0.62} moonI={0.5} rim={0.35} fill={0.36} disc={null} stars={false} fog="#232a32" />
  <CarKerb t={t} inside bundle open={v?.open} />
</>);
seat.cam = (v): CamSpec => ({ p: [0.55, 1.18, d(v, 1.5) + 0.35], l: [0, 0.82, -0.35], fov: 42, move: v?.cm || 'drop', amt: 0.4, dir: v?.dir ?? 1, breath: 0.9 });

// ---------- 16. the camera on the shelf, and the photograph itself
export const camera: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} indoor density={0.03} amb={0.6} moonI={0.7} rim={0.4} fill={0.36} disc={null} stars={false} fog="#232e36" />
  <Bedroom t={t} lamp={v?.lamp ?? 0.5} open={0.4} boxes cam={false} door={0.15} />
  <Camera3 at={[-1.9, 1.36, -0.6]} rot={1.1} t={t} s={1.6} />
  <Halo at={[-1.9, 1.36, -0.5]} r={0.3} c={EJP.red} o={0.12} t={t} />
</>);
camera.cam = (v): CamSpec => ({ p: [-0.95, 1.5, d(v, 1.4) - 0.1], l: [-1.9, 1.36, -0.6], fov: 38, move: v?.cm || 'push', amt: 0.28, dir: v?.dir ?? 1, breath: 0.8 });

// ---------- 17. the white flash: the whole room seen for half a second
export const flash: Set3 = ({ t, len, v }: SetP) => {
  const k = ss(Math.min(1, t / Math.max(0.6, len * 0.35)));
  return (<>
    <Night t={t} indoor density={0.03} amb={0.5 + 1.5 * k} moonI={0.8} rim={0.45} fill={0.3 + 0.9 * k} disc={null} stars={false} fog="#202b34" />
    <Bedroom t={t} lamp={0} open={0.9} boxes cam door={0.1} />
    <Person s={MITCH_BED} at={[0.62, 0.16, 0.95]} rot={-1.3} t={t} pose="sit" expr="fear" seed={3} tremble={0.5} />
    <Eyeless at={[1.15, 0, 0.45]} rot={-1.57} t={t} pose={v?.pose || 'lunge'} p={v?.p} />
    <pointLight position={[0.1, 1.3, 1.4]} intensity={14 * k} distance={9} decay={1.2} color="#ffffff" />
  </>);
};
flash.cam = (v): CamSpec => ({ p: [-1.1, 0.85, d(v, 1.35) + 0.25], l: [0.9, 1.2, 0.3], fov: 44, move: v?.cm || 'push', amt: 0.4, dir: v?.dir ?? 1, breath: 1.3 });

// ---------- 18. the full creature, standing, for scale (the reveal)
export const creature: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} indoor density={0.04} amb={0.55} moonI={0.9} rim={0.5} fill={0.32} disc={null} stars={false} fog="#1e2830" />
  <Bedroom t={t} lamp={0} open={0.9} boxes cam={false} door={0.35} />
  <Eyeless at={[0.2, 0, -0.6]} rot={v?.rot ?? 0.25} t={t} pose={v?.pose || 'stand'} />
</>);
creature.cam = (v): CamSpec => ({ p: [1.3, 0.8, d(v, 1.55) + 0.2], l: [0.2, 1.3, -0.65], fov: 42, move: v?.cm || 'crane', amt: 1.0, dir: v?.dir ?? -1, breath: 1.2 });

// ---------- 19. the far end of the house corridor (softened: a dark shape, nothing more)
export const far: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} indoor density={0.05} amb={0.5} moonI={0.5} rim={0.35} fill={0.3} disc={null} stars={false} fog="#1f272c" />
  <Hall t={t} lamp={0.8} far shake={v?.shake ?? 0.3} />
  <Mist t={t} n={4} area={[-1, 1, -10, -3]} y={0.3} o={0.09} c="#262f34" size={4} />
</>);
far.cam = (v): CamSpec => ({ p: [0.25, 1.2, d(v, 2.2) + 1.0], l: [0.1, 1.0, -8.8], fov: 40, move: v?.cm || 'push', amt: 1.2, dir: v?.dir ?? 1, breath: 1.1 });

// ---------- 20. the end screen
export const end: Set3 = EndScreen3 as any;
(end as any).cam = endCam;
(end as any).overlay = (EndScreen3 as any).overlay;
export const SETS: Record<string, Set3> = { bedroom, over, sockets, window7, yard, house, porch, hall, kitchen, mirror, ward, corridor, woods, car, seat, camera, flash, creature, far, end };
