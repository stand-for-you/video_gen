import React from 'react';
import { RED, rng } from './Kit';
// Small helpers used by Thumbs.tsx (red thread line + falling ash/snow specks).
export const Thread: React.FC<{ d: string; w?: number }> = ({ d, w = 6 }) => (
  <g>
    <path d={d} stroke="#ff3a2a" strokeWidth={w * 3} fill="none" strokeLinecap="round" opacity={0.25} filter="url(#soft2)" />
    <path d={d} stroke={RED} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </g>
);
export const Snow: React.FC<{ f: number; n?: number; op?: number; w?: number; h?: number; seed?: number }> = ({ f, n = 30, op = 0.5, w = 1920, h = 1920, seed = 11 }) => {
  const q = rng(seed);
  return (
    <g opacity={op}>
      {Array.from({ length: n }).map((_, i) => {
        const x0 = q() * w, y0 = q() * h, sp = 1.5 + q() * 2.5, r = 1.6 + q() * 3.2, dr = q() * 6.28;
        const y = (y0 + f * sp * 3) % h, x = x0 + Math.sin(f * 0.05 + dr) * 18;
        return <circle key={i} cx={x} cy={y} r={r} fill="#e8e4e0" />;
      })}
    </g>
  );
};
