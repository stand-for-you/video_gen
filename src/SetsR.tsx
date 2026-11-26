import React from 'react';
// SCROLL KAOS TEMPLATE - SetsR sets (1080x1920). Replace every set with this story's own places.
// A set is React.FC<{ f: number; v: any }>: f = animation frame (already x3), v = the variant
// dict from the scene table. Draw past the edges (the camera zooms). End each set with a soft
// dark overlay. Read engine/examples/smile-dog/src/SetsR.tsx for a full worked example.
//
// REQUIRED card sets: 'end' (long only), 'qcard' / 'rqcard' (the credit + closing question).
const R: React.FC<{ c: string; op?: number }> = ({ c, op = 1 }) => (
  <rect x={-600} y={-600} width={1080 + 1200} height={1920 + 1200} fill={c} opacity={op} />
);
const placeholder = (name: string): React.FC<{ f: number; v: any }> => ({ f, v }) => (
  <g>
    <R c="#12141c" />
    <text x={1080 / 2} y={1920 / 2} textAnchor="middle" fontFamily="Lora, Georgia, serif"
      fontSize={54} fill="#6a6c78" opacity={0.5}>{name}</text>
    <R c="#05030a" op={v?.dark ?? 0.2} />
  </g>
);
export const SETS: Record<string, React.FC<{ f: number; v: any }>> = {
  rqcard: placeholder('credit + question'),
};
