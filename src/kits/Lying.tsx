import React from 'react';
import { FullPerson } from '../Cast';
import type { Spec } from '../Cast';
// =============================================================================
// LYING PEOPLE - the shared, story-agnostic way to put a body on a bed, a table
// or the floor. Use this for EVERY story: a patient, a sleeper, a victim, a body.
//
// WHY THIS FILE EXISTS
// In "Gateway of the Mind" the man on the steel bed was drawn as
//     <g transform="rotate(-90)"><CloseUp .../></g>
// a head-and-shoulders close-up tipped on its side. The viewer saw a stiff statue
// lying at 90 degrees, still holding his walking cane in mid-air, with parts poking
// through the chamber wall and the body flipping end-for-end between shots. The
// engine's own 'lie' motion had the same shape: the standing idle rig plus rot:-90.
//
// The rule that was broken: when the script needs a pose the kit cannot draw,
// DRAW IT - never rotate, crop or substitute something else into the gap.
//
// What this gives you instead:
//   - the real 'supine' rig (arms along the body, legs together, fixed head end)
//   - props stripped: nobody lies in bed holding a cane, a handbag or a satchel
//   - the body seated ON the surface you name, so nothing pokes through the bed
//   - an optional sheet drawn over the legs
//   - `dead` for a body that does not breathe
//
// tools/lint_poses.py fails the build if a rotate(90) hack comes back.
// =============================================================================

export type LyingProps = {
  s: Spec;
  /** centre of the body along the surface */
  x: number;
  /** y of the SURFACE the body rests on (the bed top, the table top, the floor) */
  surfaceY: number;
  /** figure scale, same meaning as FullPerson's k */
  k?: number;
  f?: number;
  expr?: string;
  /** which way the head points. FIXED per scene - never tie this to the camera facing. */
  head?: -1 | 1;
  /** a body that does not breathe */
  dead?: boolean;
  /** draw a sheet over the legs up to the waist */
  sheet?: boolean;
  sheetC?: string;
  uid?: string;
  /** keep the character's accessories (default false - a cane in bed is the old bug) */
  keepProps?: boolean;
  /** usable length of the surface in px. The body is scaled DOWN to fit, so it can never
   *  be longer than the bed it lies on (the "legs through the chamber wall" fault). */
  fit?: number;
};

// WHERE THE ROTATED BODY ACTUALLY LANDS
// Cast.tsx applies:  rotate(rot, 0, P0) then translate(0, -P0)   with P0 = -1540 * legK
// The comment there says "the pelvis lands on the origin". It does not. Working it through
// for rot = -90 (head to the left), in figure units relative to the anchor passed as (x, y):
//     pelvis -> ( 1540, -1540)
//     head   -> (  240, -1540)
//     feet   -> ( 3080, -1540)
// so the whole body lies on the line y = -1540, entirely to the RIGHT of the anchor.
// For rot = +90 it is mirrored to the left. Nothing is centred on anything.
//
// Rather than change that transform (three story kits already depend on it), LyingPerson
// compensates: it shifts the figure so the caller's (x, surfaceY) means what it says -
// "the body lies centred on x, resting on this surface".
const SPINE = 1540;        // |P0|: the line the lying body rests on, in figure units
const CENTRE = 1660;       // midpoint of head(240)..feet(3080) along the body
const BACK_DEPTH = 190;    // half the body's thickness, so the back meets the surface
const BODY_LEN = 2840;     // head(240) to feet(3080): the full lying length in figure units

export const LyingPerson: React.FC<LyingProps> = ({
  s, x, surfaceY, k: kIn = 1, f = 0, expr = 'neutral', head = -1, dead = false,
  sheet = false, sheetC = '#d8e0da', uid = 'lie', keepProps = false, fit,
}) => {
  // a body in bed is not carrying anything
  const spec: Spec = keepProps ? s : { ...s, acc: [] };
  // Auto-fit: a body must never be longer than the thing it is lying on. This is what
  // stops legs and props poking through the chamber wall.
  const k = fit ? Math.min(kIn, fit / BODY_LEN) : kIn;
  // dir = +1 when the body extends right of the anchor, -1 when mirrored (sign checked by render)
  const dir = head === 1 ? 1 : -1;
  const ax = x - CENTRE * k * dir;                 // centre the body on x
  const ay = surfaceY - BACK_DEPTH * k + SPINE * k; // put the spine just above the surface
  // where the body now reaches, in screen units, for the sheet
  const headX = x - (CENTRE - 240) * k * dir;
  const feetX = x + (3080 - CENTRE) * k * dir;
  const waistX = x + (2200 - CENTRE) * k * dir;    // sheet starts a little below the waist
  const top = surfaceY - 2 * BACK_DEPTH * k;       // the top of the body as seen from the side
  return (
    <g>
      <FullPerson
        s={spec}
        x={ax}
        y={ay}
        k={k}
        f={f}
        expr={expr as never}
        view="front"
        uid={uid}
        motion={{ type: dead ? 'supineDead' : 'supine', head }}
      />
      {sheet && (
        <g>
          {/* waist-to-feet sheet with two soft folds, so it reads as cloth not a slab */}
          <path
            d={`M${waistX},${top} L${feetX},${top + 10 * k}
                Q${feetX + 50 * k * dir},${surfaceY} ${feetX - 20 * k * dir},${surfaceY + 4}
                L${waistX},${surfaceY + 4}Z`}
            fill={sheetC} stroke="#2a3230" strokeWidth={4 * k} strokeLinejoin="round" opacity={0.96}
          />
          <path
            d={`M${waistX + (feetX - waistX) * 0.34},${top + 4 * k}
                Q${waistX + (feetX - waistX) * 0.4},${(top + surfaceY) / 2} ${waistX + (feetX - waistX) * 0.33},${surfaceY}
                M${waistX + (feetX - waistX) * 0.68},${top + 7 * k}
                Q${waistX + (feetX - waistX) * 0.74},${(top + surfaceY) / 2} ${waistX + (feetX - waistX) * 0.67},${surfaceY}`}
            stroke="#2a3230" strokeWidth={3 * k} fill="none" opacity={0.3}
          />
        </g>
      )}
      {/* a shadow under the body so it sits ON the surface instead of floating */}
      <ellipse cx={(headX + feetX) / 2} cy={surfaceY + 6} rx={Math.abs(feetX - headX) / 2 * 0.96}
        ry={16 * k} fill="#000" opacity={0.22} />
    </g>
  );
};

// A plain flat surface to lay someone on, when the story kit has no bed of its own.
export const Slab: React.FC<{ x: number; y: number; w: number; k?: number; legs?: boolean; c?: string }> =
  ({ x, y, w, k = 1, legs = true, c = '#9aa6a2' }) => (
    <g>
      <rect x={x - w / 2} y={y} width={w} height={26 * k} fill={c} stroke="#2a3230" strokeWidth={4 * k} />
      {legs && (
        <path d={`M${x - w / 2 + 20 * k},${y + 26 * k} L${x - w / 2 - 10 * k},${y + 230 * k}
                  M${x + w / 2 - 20 * k},${y + 26 * k} L${x + w / 2 + 10 * k},${y + 230 * k}`}
          stroke="#5a6664" strokeWidth={12 * k} />
      )}
    </g>
  );
