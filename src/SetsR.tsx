import React from 'react';
import { Set3, SetP } from './Stage3';
import { CamSpec } from './k3/Cam';
import { M, ss, sway } from './k3/core';
import { Night, Mist, Halo } from './k3/World';
import { Person } from './k3/Person';
import { Bedroom, Hall, Kitchen, HouseOut, Woods, Ward, Corridor, CarKerb, Camera3, Eyeless, EJP } from './EJ3';
import { MITCH, MITCH_BED, EDWIN, DOCTOR } from './EJCast';
// ===== STORY SLOT: the 9:16 sets of "Eyeless Jack" (kit r), COMPOSED AGAIN for a tall frame.
// Nothing here is imported from SetsL: every camera is written for 1080x1920, closer and taller, with the subject in the
// middle band of the picture so the burned-in captions at the bottom never cover a face.
const FR = { wide: 1, waist: 0.66, bust: 0.46, close: 0.34, detail: 0.24 } as Record<string, number>;
const d = (v: any, base: number) => base * (FR[v?.fr as string] ?? 1);

export const rbedroom: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} indoor density={0.03} amb={0.6} moonI={0.8} rim={0.4} fill={0.35} disc={null} stars={false} fog="#23303a" />
  <Bedroom t={t} lamp={v?.lamp ?? 0} open={v?.open ?? 0} boxes cam door={0.2} />
  {v?.sit && <Person s={MITCH_BED} at={[0.62, 0.16, 0.95]} rot={-1.3} t={t} pose="sit" expr={v?.expr || 'fear'} seed={3} tremble={v?.tremble} />}
</>);
rbedroom.camR = (v): CamSpec => ({ p: [1.3, 1.05, d(v, 1.6) + 0.15], l: [0.1, 0.8, -0.6], fov: 56, move: v?.cm || 'crane', amt: 0.8, dir: v?.dir ?? 1, breath: 1.0 });

export const rover: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} indoor density={0.035} amb={0.5} moonI={0.9} rim={0.5} fill={0.3} disc={null} stars={false} fog="#1e2a34" />
  <Bedroom t={t} lamp={0} open={0.9} boxes cam door={0.1} />
  {v?.sit && <Person s={MITCH_BED} at={[0.62, 0.16, 0.95]} rot={-1.3} t={t} pose="sit" expr="fear" seed={3} tremble={0.5} />}
  <Eyeless at={[1.15, 0, 0.45]} rot={-1.57} t={t} pose={v?.pose || 'bend'} p={v?.p} />
</>);
rover.camR = (v): CamSpec => ({ p: [-0.85, 0.82, d(v, 1.0) + 0.2], l: [0.67, 1.12, 0.45], fov: 54, move: v?.cm || 'push', amt: 0.45, dir: v?.dir ?? 1, breath: 1.2 });

export const rsockets: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} indoor density={0.04} amb={0.45} moonI={0.85} rim={0.55} fill={0.28} disc={null} stars={false} fog="#1b2630" />
  <Bedroom t={t} lamp={0} open={0.9} boxes={false} cam={false} door={0.1} />
  <Eyeless at={[1.1, 0, 0.5]} rot={-1.75} t={t} pose={v?.pose || 'bend'} />
</>);
rsockets.camR = (v): CamSpec => ({ p: [-0.05, 1.22, d(v, 0.68) + 0.3], l: [0.6, 1.1, 0.5], fov: 50, move: v?.cm || 'arc', amt: 0.3, dir: v?.dir ?? -1, breath: 1.3 });

export const rwindow: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} indoor density={0.03} amb={0.58} moonI={0.9} rim={0.42} fill={0.34} disc={null} stars={false} fog="#22303a" />
  <Bedroom t={t} lamp={v?.lamp ?? 0} open={v?.open ?? 0.9} boxes cam={false} door={0.15} />
  <mesh position={[0, 1.45, -2.45]} material={M('#1a242c')}><boxGeometry args={[3.2, 2.2, 0.05]} /></mesh>
  <pointLight position={[0.6, 2.0, -3.2]} intensity={2.2} distance={9} decay={1.6} color={EJP.amber} />
</>);
rwindow.camR = (v): CamSpec => ({ p: [0.35, 1.0, d(v, 1.9) - 0.2], l: [0, 1.5, -2.2], fov: 54, move: v?.cm || 'push', amt: 0.55, dir: v?.dir ?? 1, breath: 0.9 });

export const ryard: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} density={0.05} amb={0.5} moonI={1.0} rim={0.4} fill={0.3} fog="#1d2830" />
  <HouseOut t={t} porch={v?.porch ?? 0.9} bins door={0} />
</>);
ryard.camR = (v): CamSpec => ({ p: [-2.2, 1.4, d(v, 5.5) + 1.6], l: [-2.0, 1.4, 0.4], fov: 56, move: v?.cm || 'truck', amt: 1.2, dir: v?.dir ?? 1, breath: 1.1 });

export const rhouse: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} density={0.05} amb={0.5} moonI={1.0} rim={0.4} fill={0.3} fog="#1d2830" />
  <HouseOut t={t} porch={v?.porch ?? 1} bins door={v?.door ?? 0} />
  {v?.mitch && <Person s={MITCH} at={[1.0, 0, 6.5]} rot={v?.run ? 0.3 : Math.PI} t={t} pose={v?.pose || 'walk'} expr={v?.expr || 'fear'} seed={3} />}
</>);
rhouse.camR = (v): CamSpec => ({ p: [2.6, 1.6, d(v, 8.5) + 2.2], l: [0, 2.4, -1], fov: 58, move: v?.cm || 'crane', amt: 1.6, dir: v?.dir ?? 1, breath: 1.2 });

export const rporch: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} density={0.045} amb={0.6} moonI={0.9} rim={0.45} fill={0.38} fog="#202c34" />
  <HouseOut t={t} porch={1} bins={false} door={v?.door ?? 0.6} />
  {v?.mitch !== false && <Person s={MITCH} at={[-0.4, 0, 1.0]} rot={0.4} t={t} pose={v?.pose || 'idle'} expr={v?.expr || 'calm'} seed={3} />}
</>);
rporch.camR = (v): CamSpec => ({ p: [1.5, 1.4, d(v, 3.6) + 1.2], l: [-0.2, 1.4, -0.4], fov: 54, move: v?.cm || 'arc', amt: 0.8, dir: v?.dir ?? -1, breath: 1.0 });

export const rhall: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} indoor density={0.035} amb={0.62} moonI={0.6} rim={0.4} fill={0.36} disc={null} stars={false} fog="#242e34" />
  <Hall t={t} lamp={v?.lamp ?? 1.0} far={v?.far} shake={v?.shake} />
  {v?.mitch && <Person s={MITCH} at={[-0.2, 0, -0.6]} rot={Math.PI} t={t} pose={v?.pose || 'walk'} expr={v?.expr || 'calm'} seed={3} />}
</>);
rhall.camR = (v): CamSpec => ({ p: [0.3, 1.2, d(v, 2.6) + 0.8], l: [0, 1.3, -6.5], fov: 58, move: v?.cm || 'push', amt: 1.5, dir: v?.dir ?? 1, breath: 1.0 });

export const rkitchen: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} indoor density={0.02} amb={0.75} moonI={0.5} rim={0.35} fill={0.45} disc={null} stars={false} fog="#2a3238" />
  <Kitchen t={t} cup={v?.cup ?? 0} mirror={v?.mirror} />
  {v?.edwin !== false && <Person s={EDWIN} at={[-0.9, 0, -0.3]} rot={1.1} t={t} pose={v?.epose || 'idle'} expr={v?.eexpr || 'calm'} seed={8} />}
  {v?.mitch && <Person s={MITCH} at={[0.8, 0, 0.8]} rot={-1.9} t={t} pose="idle" expr={v?.expr || 'calm'} seed={3} />}
</>);
rkitchen.camR = (v): CamSpec => ({ p: [1.2, 1.4, d(v, 2.9) + 0.5], l: [-0.4, 1.35, -0.2], fov: 56, move: v?.cm || 'orbit', amt: 0.6, dir: v?.dir ?? 1, breath: 1.0 });

export const rmirror: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} indoor density={0.02} amb={0.8} moonI={0.5} rim={0.35} fill={0.5} disc={null} stars={false} fog="#2a3238" />
  <Kitchen t={t} cup={1} mirror />
  <Person s={MITCH} at={[-1.45, 0, 0.3]} rot={-Math.PI / 2} t={t} pose="idle" expr={v?.expr || 'shock'} seed={3} />
  <pointLight position={[-1.9, 1.7, 1.0]} intensity={2.2} distance={5} decay={1.7} color="#ffe6c0" />
</>);
rmirror.camR = (v): CamSpec => ({ p: [-0.45, 1.54, d(v, 1.3) + 0.5], l: [-1.75, 1.5, 0.28], fov: 50, move: v?.cm || 'push', amt: 0.26, dir: v?.dir ?? 1, breath: 0.9 });

export const rward: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} indoor density={0.015} amb={0.85} moonI={0.4} rim={0.3} fill={0.55} disc={null} stars={false} fog="#33403e" />
  <Ward t={t} person={v?.person !== false} doc={v?.doc} chart={v?.chart} />
</>);
rward.camR = (v): CamSpec => ({ p: [1.2, 1.5, d(v, 2.8) + 0.6], l: [-0.35, 0.9, 0], fov: 56, move: v?.cm || 'drop', amt: 0.7, dir: v?.dir ?? 1, breath: 0.9 });

export const rcorridor: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} indoor density={0.02} amb={0.8} moonI={0.4} rim={0.3} fill={0.5} disc={null} stars={false} fog="#36423f" />
  <Corridor t={t} chairs people={v?.people ?? 0} />
</>);
rcorridor.camR = (v): CamSpec => ({ p: [0.5, 1.45, d(v, 3.4) + 0.8], l: [0, 1.5, -7], fov: 58, move: v?.cm || 'truck', amt: 1.3, dir: v?.dir ?? -1, breath: 1.0 });

export const rwoods: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} density={0.06} amb={0.52} moonI={0.85} rim={0.4} fill={0.3} fog="#1a241f" />
  <Woods t={t} amber={v?.amber ?? 0.5} />
  {v?.mitch !== false && <Person s={MITCH} at={[0, 0, 1.0]} rot={v?.rot ?? 0.2} t={t} pose={v?.pose || 'run'} expr={v?.expr || 'fear'} seed={3} travel={false} />}
</>);
rwoods.camR = (v): CamSpec => ({ p: [0.8, 1.45, d(v, 3.2) + 1.2], l: [0, 1.25, -2.2], fov: 60, move: v?.cm || 'follow', amt: 2.0, dir: v?.dir ?? 1, breath: 1.4 });

export const rcar: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} density={0.045} amb={0.58} moonI={0.8} rim={0.4} fill={0.34} fog="#212a30" />
  <CarKerb t={t} />
</>);
rcar.camR = (v): CamSpec => ({ p: [2.2, 1.5, d(v, 4.0) + 1.1], l: [0, 1.0, 0], fov: 56, move: v?.cm || 'arc', amt: 1.0, dir: v?.dir ?? 1, breath: 1.0 });

export const rseat: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} indoor density={0.03} amb={0.62} moonI={0.5} rim={0.35} fill={0.36} disc={null} stars={false} fog="#232a32" />
  <CarKerb t={t} inside bundle open={v?.open} />
</>);
rseat.camR = (v): CamSpec => ({ p: [0.42, 1.3, d(v, 1.3) + 0.3], l: [0, 0.8, -0.35], fov: 54, move: v?.cm || 'drop', amt: 0.35, dir: v?.dir ?? 1, breath: 0.9 });

export const rcamera: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} indoor density={0.03} amb={0.6} moonI={0.7} rim={0.4} fill={0.36} disc={null} stars={false} fog="#232e36" />
  <Bedroom t={t} lamp={v?.lamp ?? 0.5} open={0.4} boxes cam={false} door={0.15} />
  <Camera3 at={[-1.9, 1.36, -0.6]} rot={1.1} t={t} s={1.8} />
  <Halo at={[-1.9, 1.36, -0.5]} r={0.3} c={EJP.red} o={0.12} t={t} />
</>);
rcamera.camR = (v): CamSpec => ({ p: [-1.05, 1.48, d(v, 1.2) - 0.1], l: [-1.9, 1.36, -0.6], fov: 48, move: v?.cm || 'push', amt: 0.26, dir: v?.dir ?? 1, breath: 0.8 });

export const rflash: Set3 = ({ t, len, v }: SetP) => {
  const k = ss(Math.min(1, t / Math.max(0.6, len * 0.35)));
  return (<>
    <Night t={t} indoor density={0.03} amb={0.5 + 1.5 * k} moonI={0.8} rim={0.45} fill={0.3 + 0.9 * k} disc={null} stars={false} fog="#202b34" />
    <Bedroom t={t} lamp={0} open={0.9} boxes cam door={0.1} />
    <Person s={MITCH_BED} at={[0.62, 0.16, 0.95]} rot={-1.3} t={t} pose="sit" expr="fear" seed={3} tremble={0.5} />
    <Eyeless at={[1.15, 0, 0.45]} rot={-1.57} t={t} pose={v?.pose || 'lunge'} p={v?.p} />
    <pointLight position={[0.1, 1.3, 1.4]} intensity={14 * k} distance={9} decay={1.2} color="#ffffff" />
  </>);
};
rflash.camR = (v): CamSpec => ({ p: [-1.05, 0.9, d(v, 1.25) + 0.25], l: [0.9, 1.25, 0.3], fov: 56, move: v?.cm || 'push', amt: 0.38, dir: v?.dir ?? 1, breath: 1.3 });

export const rcreature: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} indoor density={0.04} amb={0.55} moonI={0.9} rim={0.5} fill={0.32} disc={null} stars={false} fog="#1e2830" />
  <Bedroom t={t} lamp={0} open={0.9} boxes cam={false} door={0.35} />
  <Eyeless at={[0.2, 0, -0.6]} rot={v?.rot ?? 0.25} t={t} pose={v?.pose || 'stand'} />
</>);
rcreature.camR = (v): CamSpec => ({ p: [1.15, 0.9, d(v, 1.4) + 0.2], l: [0.2, 1.32, -0.65], fov: 54, move: v?.cm || 'crane', amt: 0.9, dir: v?.dir ?? -1, breath: 1.2 });

export const rfar: Set3 = ({ t, v }: SetP) => (<>
  <Night t={t} indoor density={0.05} amb={0.5} moonI={0.5} rim={0.35} fill={0.3} disc={null} stars={false} fog="#1f272c" />
  <Hall t={t} lamp={0.8} far shake={v?.shake ?? 0.3} />
  <Mist t={t} n={4} area={[-1, 1, -10, -3]} y={0.3} o={0.09} c="#262f34" size={4} />
</>);
rfar.camR = (v): CamSpec => ({ p: [0.18, 1.25, d(v, 1.9) + 0.9], l: [0.1, 1.0, -8.8], fov: 52, move: v?.cm || 'push', amt: 1.1, dir: v?.dir ?? 1, breath: 1.1 });

export const SETS: Record<string, Set3> = { rbedroom, rover, rsockets, rwindow, ryard, rhouse, rporch, rhall, rkitchen, rmirror, rward, rcorridor, rwoods, rcar, rseat, rcamera, rflash, rcreature, rfar };
