import React from 'react';
import { Set3 } from './Stage3';
import { CamSpec, Move } from './k3/Cam';
import { V3 } from './k3/core';
import { EndScreen3, endCam } from './End3';
import { BedOver, JackFull, HouseOut, BedWin, KitchenS, HospitalS, Snap, Lunge, Flee, HallS, CarOut, CarIn } from './EJScenes';
// ===== 16:9 SETS of "Eyeless Jack". Every camera: a MOVE (smoothstep, see k3/Cam.tsx) + breathing sway. v.fr picks the distance,
// v.ang turns the camera around the subject (so the same place looks different), v.cm overrides the move. Never a face alone:
// 'close' keeps the hood, the shoulders and the room behind the head.
const rotA = (p: V3, c: V3, a: number): V3 => { const dx = p[0] - c[0], dz = p[2] - c[2], ca = Math.cos(a), sa = Math.sin(a); return [c[0] + dx * ca + dz * sa, p[1], c[2] - dx * sa + dz * ca]; };
type Row = { p: V3; l: V3; fov: number; move: Move; amt?: number; dir?: number; l2?: V3 };
const pick = (v: any, rows: Record<string, Row>, base = 'wide'): CamSpec => {
  const r = rows[v?.fr] || rows[base]; const a = (v?.ang ?? 0) * 0.6;
  return { p: a ? rotA(r.p, r.l, a) : r.p, l: r.l, fov: r.fov, move: (v?.cm as Move) || r.move, amt: r.amt, dir: r.dir ?? (v?.dir ?? 1), l2: r.l2, breath: 1.1 };
};
export const bedover: Set3 = (p) => <BedOver {...p} />;
bedover.cam = (v) => v?.part === 'hand'
  ? pick(v, { wide: { p: [-0.2, 1.1, 0.9], l: [1.25, 0.8, -0.6], fov: 46, move: 'arc', amt: 0.3 }, detail: { p: [0.25, 0.95, 0.15], l: [1.2, 0.82, -0.55], fov: 40, move: 'push', amt: 0.25 }, waist: { p: [0.1, 1.1, 0.5], l: [1.25, 0.9, -0.7], fov: 42, move: 'arc' } })
  : pick(v, {
    // every p below keeps x < 0.3 (outside the bed's x-range 0.35..1.65), so the camera never ends up inside the bed frame
    wide: { p: [-1.4, 1.7, 2.2], l: [1.3, 1.0, -1.2], fov: 48, move: 'arc', amt: 0.3, dir: 1 },
    waist: { p: [-0.6, 1.55, 0.6], l: [1.25, 1.1, -1.3], fov: 42, move: 'push', amt: 0.3 },
    bust: { p: [-0.1, 1.5, -0.3], l: [1.2, 1.3, -1.35], fov: 38, move: 'arc', amt: 0.3, dir: -1 },
    close: { p: [0.15, 1.4, -0.85], l: [1.15, 1.5, -1.4], fov: 34, move: 'push', amt: 0.2 },
    detail: { p: [0.1, 1.35, -0.85], l: [1.15, 1.4, -1.5], fov: 34, move: 'push', amt: 0.2 },
  });
export const jackfull: Set3 = (p) => <JackFull {...p} />;
jackfull.cam = (v) => pick(v, {
  wide: { p: [1.0, 1.5, 5.2], l: [1.0, 1.15, 0.6], fov: 42, move: 'push', amt: 0.3 },
  waist: { p: [1.2, 1.45, 3.1], l: [1.0, 1.2, 0.6], fov: 42, move: 'arc', amt: 0.3 },
  bust: { p: [1.0, 1.75, 2.3], l: [1.0, 1.7, 0.6], fov: 36, move: 'orbit', amt: 0.3 },
  close: { p: [1.05, 1.8, 1.8], l: [1.0, 1.75, 0.6], fov: 34, move: 'vertigo', amt: 0.3 },
  detail: { p: [1.5, 1.0, 1.6], l: [1.3, 0.9, 0.6], fov: 36, move: 'push', amt: 0.2 },
});
export const houseout: Set3 = (p) => <HouseOut {...p} />;
houseout.cam = (v) => v?.fig
  // the house occupies x in [-3.5,3.5], z in [-2.5,2.5]; keep p and the line to l clear of that box
  ? pick(v, { wide: { p: [6, 1.7, 6], l: [9, 1.6, -5], fov: 40, move: 'push', amt: 0.25 }, waist: { p: [7, 1.5, 1.5], l: [9, 1.5, -5], fov: 32, move: 'push', amt: 0.2 } })
  : pick(v, { wide: { p: [3.2, 1.9, 17], l: [0, 2.3, 0], fov: 44, move: 'push', amt: 0.3 }, waist: { p: [-1.4, 1.2, 10.5], l: [-4.2, 0.9, 3.6], fov: 40, move: 'truck', amt: 1.4 }, detail: { p: [-2.8, 0.9, 7.6], l: [-4.6, 0.6, 3.6], fov: 36, move: 'push', amt: 0.3 } });
export const bedwin: Set3 = (p) => <BedWin {...p} />;
bedwin.cam = (v) => pick(v, {
  wide: { p: [1.8, 1.8, 2.3], l: [-0.6, 1.0, -1.6], fov: 52, move: 'arc', amt: 0.3 },
  waist: { p: [-0.4, 1.35, 0.3], l: [1.0, 1.0, -1.0], fov: 44, move: 'push', amt: 0.3 },
  bust: { p: [-0.1, 1.45, -0.3], l: [1.0, 1.35, -1.0], fov: 40, move: 'arc', amt: 0.3 },
  detail: { p: [-0.7, 1.3, -1.4], l: [-1.1, 1.4, -2.4], fov: 40, move: 'push', amt: 0.25 },
});
export const kitchen: Set3 = (p) => <KitchenS {...p} />;
kitchen.cam = (v) => pick(v, {
  wide: { p: [0.1, 1.6, 3.9], l: [0.05, 1.1, 0.1], fov: 46, move: 'push', amt: 0.3 },
  waist: { p: [0.1, 1.3, 2.3], l: [0.05, 1.15, 0.3], fov: 42, move: 'arc', amt: 0.3 },
  bust: { p: [0.05, 1.5, 1.7], l: [0.05, 1.4, 0.3], fov: 38, move: 'orbit', amt: 0.3 },
  detail: { p: [0.6, 0.9, 1.4], l: [0.45, 0.55, 0.28], fov: 38, move: 'drop', amt: 0.3 },
});
export const hospital: Set3 = (p) => <HospitalS {...p} />;
hospital.cam = (v) => pick(v, {
  wide: { p: [2.6, 1.9, 4.2], l: [-0.3, 1.0, -0.4], fov: 48, move: 'arc', amt: 0.3 },
  waist: { p: [1.6, 1.5, 2.8], l: [-0.1, 1.15, 0.0], fov: 42, move: 'push', amt: 0.3 },
  bust: { p: [0.9, 1.5, 1.8], l: [-0.5, 1.3, -0.1], fov: 38, move: 'arc', amt: 0.3, dir: -1 },
  detail: { p: [0.3, 1.1, 1.0], l: [-0.6, 0.95, -0.1], fov: 36, move: 'push', amt: 0.2 },
});
export const snap: Set3 = (p) => <Snap {...p} />;
snap.cam = (v) => pick(v, {
  // keep x < 0.3 so the camera stays off the bed/Jack's body (bed x 0.35..1.65, Jack at x=1.78)
  detail: { p: [-0.5, 1.2, 0.5], l: [0.55, 1.15, -0.8], fov: 44, move: 'push', amt: 0.2 },
  wide: { p: [-0.8, 1.5, 1.2], l: [0.9, 1.1, -1.3], fov: 48, move: 'arc', amt: 0.3 },
  waist: { p: [-0.4, 1.3, 0.5], l: [0.8, 1.15, -1.1], fov: 42, move: 'push', amt: 0.3 },
}, 'detail');
export const lunge: Set3 = (p) => <Lunge {...p} />;
lunge.cam = (v) => pick(v, {
  wide: { p: [-1.2, 1.5, 2.0], l: [1.0, 1.1, -1.0], fov: 52, move: 'arc', amt: 0.3 },
  waist: { p: [0.0, 1.35, 1.0], l: [1.0, 1.2, -1.0], fov: 46, move: 'push', amt: 0.3 },
  bust: { p: [0.3, 1.3, 0.1], l: [1.1, 1.3, -1.1], fov: 40, move: 'arc', amt: 0.3 },
});
export const flee: Set3 = (p) => <Flee {...p} />;
flee.cam = (v) => v?.yard
  ? pick(v, { wide: { p: [2, 1.5, 9], l: [3, 1.2, -3], fov: 46, move: 'follow', l2: [1.5, 1.2, 1.2], amt: 0.3 }, waist: { p: [4.2, 1.5, 4.6], l: [3, 1.2, -1.5], fov: 40, move: 'follow', l2: [1.5, 1.2, 1.5] } })
  : pick(v, { wide: { p: [1.4, 1.5, 8.5], l: [0, 1.2, -3], fov: 46, move: 'pull', amt: 0.3 }, waist: { p: [-1.2, 1.4, 4.5], l: [0, 1.15, -1.5], fov: 40, move: 'follow', l2: [0, 1.0, 1.5] }, bust: { p: [-1.4, 1.3, 3.0], l: [0, 0.8, -0.5], fov: 40, move: 'drop', amt: 0.4 } });
export const hall: Set3 = (p) => <HallS {...p} />;
hall.cam = (v) => pick(v, {
  wide: { p: [0.5, 1.6, 4.4], l: [0.1, 0.9, -1.0], fov: 46, move: 'push', amt: 0.3 },
  waist: { p: [0.5, 1.5, 3.4], l: [0.1, 0.7, -0.4], fov: 42, move: 'drop', amt: 0.4 },
  detail: { p: [0.45, 0.35, 0.95], l: [0.15, 0.08, -0.4], fov: 38, move: 'push', amt: 0.25 },
});
export const carout: Set3 = (p) => <CarOut {...p} />;
carout.cam = (v) => v?.part === 'walk'
  ? pick(v, { wide: { p: [-2.0, 1.6, 12.5], l: [2.0, 1.2, 6.5], fov: 44, move: 'truck', amt: 1.2 }, waist: { p: [0.2, 1.5, 9.8], l: [1.0, 1.1, 7.0], fov: 40, move: 'follow', l2: [2.6, 1.1, 6.6] } })
  : pick(v, { wide: { p: [-1.0, 1.7, 6.0], l: [3.0, 1.0, 11], fov: 46, move: 'pan', amt: 0.6 }, waist: { p: [0.6, 1.4, 8.0], l: [3.2, 0.9, 11], fov: 38, move: 'push', amt: 0.3 } });
export const carin: Set3 = (p) => <CarIn {...p} />;
carin.cam = (v) => pick(v, {
  wide: { p: [-0.15, 1.2, -0.3], l: [0.45, 0.95, 1.1], fov: 54, move: 'push', amt: 0.2 },
  waist: { p: [0.05, 1.15, 0.1], l: [0.45, 0.95, 1.1], fov: 48, move: 'arc', amt: 0.3 },
  bust: { p: [0.2, 1.2, 0.35], l: [0.45, 1.05, 1.1], fov: 42, move: 'orbit', amt: 0.2 },
  detail: { p: [0.35, 1.3, 0.3], l: [0.45, 0.78, 0.62], fov: 40, move: 'drop', amt: 0.2 },
});
export const end: Set3 = EndScreen3 as any;
(end as any).cam = endCam;
(end as any).overlay = (EndScreen3 as any).overlay;
export const SETS: Record<string, Set3> = { bedover, jackfull, houseout, bedwin, kitchen, hospital, snap, lunge, flee, hall, carout, carin, end };
