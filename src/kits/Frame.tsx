import React from 'react';
import { CloseUp, FullPerson } from '../Cast';
import type { Spec, Expr, View, Motion } from '../Cast';
// ===== SCROLL KAOS FRAMING KIT (v0.4) — fixes "only the face" shots.
// FRAMING LAW (every video): a living character is NEVER a face alone. Use these sizes and mix them:
//   WIDE  = whole body + the room (FullPerson, k so the person is 35-60% of the frame height)
//   WAIST = head to waist, hands visible (gestures, holding things)            -> <Waist/>
//   BUST  = head to mid-chest, shoulders and arms start visible (talking, fear)  -> <Bust/>
//   CLOSE = face fills about half the frame, neck and shoulders still in frame   -> <Bust tight/>
//   DETAIL= a hand, an object, a clock, a text (no faces)
// Target mix per video: WIDE >= 30%, WAIST+BUST >= 30%, CLOSE <= 25%, DETAIL as needed. Never two CLOSE shots of the same face in a row.
// Units: CloseUp puts the face centre at (0,0) in body units (face about 470 tall, mid-chest about +700, waist about +1150).
type Common = { s: Spec; expr?: Expr; f?: number; turn?: number; view?: View; face?: 1 | -1; motion?: Motion; uid?: string };
// BUST: face centre at (cx, cy); H = frame height. tight = CLOSE size.
export const Bust: React.FC<Common & { cx: number; cy?: number; H: number; tight?: boolean }> = ({ cx, cy, H, tight = false, ...p }) => {
  const k = tight ? H / 980 : H / 1250; const y = cy ?? H * (tight ? 0.4 : 0.34);
  return <g transform={`translate(${cx},${y}) scale(${k})`}><CloseUp {...p} /></g>;
};
// WAIST: head to the waist; face centre at (cx, cy)
export const Waist: React.FC<Common & { cx: number; cy?: number; H: number }> = ({ cx, cy, H, ...p }) => {
  const k = H / 1700; const y = cy ?? H * 0.24;
  return <g transform={`translate(${cx},${y}) scale(${k})`}><CloseUp {...p} /></g>;
};
// WIDE: whole person standing on floor line y; h = person height in px
export const Whole: React.FC<Common & { x: number; y: number; h: number }> = ({ x, y, h, s, ...p }) => <FullPerson s={s} x={x} y={y} k={h / 3040} {...p} />;
