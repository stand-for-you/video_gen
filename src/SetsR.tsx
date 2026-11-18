import React from 'react';
import { Set3 } from './Stage3';
import { CamSpec, Move } from './k3/Cam';
import { V3 } from './k3/core';
import { EndScreen3, endCam } from './End3';
import { BedOver, JackFull, HouseOut, BedWin, KitchenS, HospitalS, Snap, Lunge, Flee, HallS, CarOut, CarIn } from './EJScenes';
// ===== 9:16 SETS of "Eyeless Jack", composed fresh for the Reel (NOT a resize of SetsL): each row moves the camera
// in toward the look point and narrows the fov, so the narrow vertical frame fills with the subject instead of empty
// side space. 'inward' shortens the p->l distance by a fraction; 'fov' is cut by a smaller fraction on top of that.
type Row = { p: V3; l: V3; fov: number; move: Move; amt?: number; dir?: number; l2?: V3 };
const inward = (p: V3, l: V3, f: number): V3 => [p[0] + (l[0] - p[0]) * f, p[1] + (l[1] - p[1]) * f, p[2] + (l[2] - p[2]) * f];
const vr = (p: V3, l: V3, fov: number, move: Move, amt: number | undefined, f: number, fovCut: number, dir?: number, l2?: V3): Row =>
  ({ p: inward(p, l, f), l, fov: fov * fovCut, move, amt, dir, l2 });
const pick = (v: any, rows: Record<string, Row>, base = 'wide'): CamSpec => {
  const r = rows[v?.fr] || rows[base];
  return { p: r.p, l: r.l, fov: r.fov, move: (v?.cm as Move) || r.move, amt: r.amt, dir: r.dir ?? (v?.dir ?? 1), l2: r.l2, breath: 1.1 };
};
export const bedover: Set3 = (p) => <BedOver {...p} />;
bedover.cam = (v) => v?.part === 'hand'
  ? pick(v, {
      wide: vr([-0.2, 1.1, 0.9], [1.25, 0.8, -0.6], 46, 'arc', 0.3, 0.22, 0.85),
      detail: vr([0.25, 0.95, 0.15], [1.2, 0.82, -0.55], 40, 'push', 0.25, 0, 1),
      waist: vr([0.1, 1.1, 0.5], [1.25, 0.9, -0.7], 42, 'arc', undefined, 0.15, 0.9),
    })
  : pick(v, {
      wide: vr([-1.4, 1.7, 2.2], [1.3, 1.0, -1.2], 48, 'arc', 0.3, 0.3, 0.8, 1),
      waist: vr([-0.6, 1.55, 0.6], [1.25, 1.1, -1.3], 42, 'push', 0.3, 0.22, 0.85),
      bust: vr([-0.1, 1.5, -0.3], [1.2, 1.3, -1.35], 38, 'arc', 0.3, 0.12, 0.92, -1),
      close: vr([0.15, 1.4, -0.85], [1.15, 1.5, -1.4], 34, 'push', 0.2, 0, 1),
      detail: vr([0.1, 1.35, -0.85], [1.15, 1.4, -1.5], 34, 'push', 0.2, 0, 1),
    });
export const jackfull: Set3 = (p) => <JackFull {...p} />;
jackfull.cam = (v) => pick(v, {
  wide: vr([1.0, 1.5, 5.2], [1.0, 1.15, 0.6], 42, 'push', 0.3, 0.35, 0.78),
  waist: vr([1.2, 1.45, 3.1], [1.0, 1.2, 0.6], 42, 'arc', 0.3, 0.25, 0.85),
  bust: vr([1.0, 1.75, 2.3], [1.0, 1.7, 0.6], 36, 'orbit', 0.3, 0.12, 0.92),
  close: vr([1.05, 1.8, 1.8], [1.0, 1.75, 0.6], 34, 'vertigo', 0.3, 0, 1),
  detail: vr([1.5, 1.0, 1.6], [1.3, 0.9, 0.6], 36, 'push', 0.2, 0, 1),
});
export const houseout: Set3 = (p) => <HouseOut {...p} />;
houseout.cam = (v) => v?.fig
  ? pick(v, {
      wide: vr([6, 1.7, 6], [9, 1.6, -5], 40, 'push', 0.25, 0.15, 0.9),
      waist: vr([7, 1.5, 1.5], [9, 1.5, -5], 32, 'push', 0.2, 0.1, 0.95),
    })
  : pick(v, {
      wide: vr([3.2, 1.9, 17], [0, 2.3, 0], 44, 'push', 0.3, 0.3, 0.82),
      waist: vr([-1.4, 1.2, 10.5], [-4.2, 0.9, 3.6], 40, 'truck', 1.4, 0.15, 0.9),
      detail: vr([-2.8, 0.9, 7.6], [-4.6, 0.6, 3.6], 36, 'push', 0.3, 0, 1),
    });
export const bedwin: Set3 = (p) => <BedWin {...p} />;
bedwin.cam = (v) => pick(v, {
  wide: vr([1.8, 1.8, 2.3], [-0.6, 1.0, -1.6], 52, 'arc', 0.3, 0.2, 0.85),
  waist: vr([-0.4, 1.35, 0.3], [1.0, 1.0, -1.0], 44, 'push', 0.3, 0.15, 0.9),
  bust: vr([-0.1, 1.45, -0.3], [1.0, 1.35, -1.0], 40, 'arc', 0.3, 0.1, 0.92),
  detail: vr([-0.7, 1.3, -1.4], [-1.1, 1.4, -2.4], 40, 'push', 0.25, 0, 1),
});
export const kitchen: Set3 = (p) => <KitchenS {...p} />;
kitchen.cam = (v) => pick(v, {
  wide: vr([0.1, 1.6, 3.9], [0.05, 1.1, 0.1], 46, 'push', 0.3, 0.3, 0.82),
  waist: vr([0.1, 1.3, 2.3], [0.05, 1.15, 0.3], 42, 'arc', 0.3, 0.2, 0.88),
  bust: vr([0.05, 1.5, 1.7], [0.05, 1.4, 0.3], 38, 'orbit', 0.3, 0.1, 0.92),
  detail: vr([0.6, 0.9, 1.4], [0.45, 0.55, 0.28], 38, 'drop', 0.3, 0, 1),
});
export const hospital: Set3 = (p) => <HospitalS {...p} />;
hospital.cam = (v) => pick(v, {
  wide: vr([2.6, 1.9, 4.2], [-0.3, 1.0, -0.4], 48, 'arc', 0.3, 0.25, 0.85),
  waist: vr([1.6, 1.5, 2.8], [-0.1, 1.15, 0.0], 42, 'push', 0.3, 0.18, 0.9),
  bust: vr([0.9, 1.5, 1.8], [-0.5, 1.3, -0.1], 38, 'arc', 0.3, 0.1, 0.92, -1),
  detail: vr([0.3, 1.1, 1.0], [-0.6, 0.95, -0.1], 36, 'push', 0.2, 0, 1),
});
export const snap: Set3 = (p) => <Snap {...p} />;
snap.cam = (v) => pick(v, {
  detail: vr([-0.5, 1.2, 0.5], [0.55, 1.15, -0.8], 44, 'push', 0.2, 0, 1),
  wide: vr([-0.8, 1.5, 1.2], [0.9, 1.1, -1.3], 48, 'arc', 0.3, 0.15, 0.9),
  waist: vr([-0.4, 1.3, 0.5], [0.8, 1.15, -1.1], 42, 'push', 0.3, 0.08, 0.94),
}, 'detail');
export const lunge: Set3 = (p) => <Lunge {...p} />;
lunge.cam = (v) => pick(v, {
  wide: vr([-1.2, 1.5, 2.0], [1.0, 1.1, -1.0], 52, 'arc', 0.3, 0.22, 0.85),
  waist: vr([0.0, 1.35, 1.0], [1.0, 1.2, -1.0], 46, 'push', 0.3, 0.12, 0.9),
  bust: vr([0.3, 1.3, 0.1], [1.1, 1.3, -1.1], 40, 'arc', 0.3, 0.05, 0.95),
});
export const flee: Set3 = (p) => <Flee {...p} />;
flee.cam = (v) => v?.yard
  ? pick(v, {
      wide: vr([2, 1.5, 9], [3, 1.2, -3], 46, 'follow', 0.3, 0.15, 0.88, 1, [1.5, 1.2, 1.2]),
      waist: vr([4.2, 1.5, 4.6], [3, 1.2, -1.5], 40, 'follow', undefined, 0.1, 0.92, 1, [1.5, 1.2, 1.5]),
    })
  : pick(v, {
      wide: vr([1.4, 1.5, 8.5], [0, 1.2, -3], 46, 'pull', 0.3, 0.2, 0.86),
      waist: vr([-1.2, 1.4, 4.5], [0, 1.15, -1.5], 40, 'follow', undefined, 0.1, 0.9, 1, [0, 1.0, 1.5]),
      bust: vr([-1.4, 1.3, 3.0], [0, 0.8, -0.5], 40, 'drop', 0.4, 0.05, 0.94),
    });
export const hall: Set3 = (p) => <HallS {...p} />;
hall.cam = (v) => pick(v, {
  wide: vr([0.5, 1.6, 4.4], [0.1, 0.9, -1.0], 46, 'push', 0.3, 0.25, 0.85),
  waist: vr([0.5, 1.5, 3.4], [0.1, 0.7, -0.4], 42, 'drop', 0.4, 0.15, 0.9),
  detail: vr([0.45, 0.35, 0.95], [0.15, 0.08, -0.4], 38, 'push', 0.25, 0, 1),
});
export const carout: Set3 = (p) => <CarOut {...p} />;
carout.cam = (v) => v?.part === 'walk'
  ? pick(v, {
      wide: vr([-2.0, 1.6, 12.5], [2.0, 1.2, 6.5], 44, 'truck', 1.2, 0.2, 0.88),
      waist: vr([0.2, 1.5, 9.8], [1.0, 1.1, 7.0], 40, 'follow', undefined, 0.1, 0.92, 1, [2.6, 1.1, 6.6]),
    })
  : pick(v, {
      wide: vr([-1.0, 1.7, 6.0], [3.0, 1.0, 11], 46, 'pan', 0.6, 0.2, 0.86),
      waist: vr([0.6, 1.4, 8.0], [3.2, 0.9, 11], 38, 'push', 0.3, 0.1, 0.92),
    });
export const carin: Set3 = (p) => <CarIn {...p} />;
carin.cam = (v) => pick(v, {
  wide: vr([-0.15, 1.2, -0.3], [0.45, 0.95, 1.1], 54, 'push', 0.2, 0.15, 0.88),
  waist: vr([0.05, 1.15, 0.1], [0.45, 0.95, 1.1], 48, 'arc', 0.3, 0.08, 0.92),
  bust: vr([0.2, 1.2, 0.35], [0.45, 1.05, 1.1], 42, 'orbit', 0.2, 0, 1),
  detail: vr([0.35, 1.3, 0.3], [0.45, 0.78, 0.62], 40, 'drop', 0.2, 0, 1),
});
export const SETS: Record<string, Set3> = { bedover, jackfull, houseout, bedwin, kitchen, hospital, snap, lunge, flee, hall, carout, carin };
