import React from 'react';
import { AbsoluteFill } from 'remotion';
// ===== CHAPTER CARD (story kit q): a dark monitor with one red line of text, "FAVOUR 01".
// It slides in from the left on a smoothstep curve, holds, and fades. No flashing.
const ss = (x: number) => { const c = Math.max(0, Math.min(1, x)); return c * c * (3 - 2 * c); };
export const ChapterCard: React.FC<{ W: number; H: number; t: number; n: number; title: string; vertical?: boolean }> = ({ W, H, t, n, title, vertical }) => {
  const inn = ss(t / 0.6), out = 1 - ss((t - 2.1) / 0.6);
  const k = Math.min(inn, out); if (k <= 0) return null;
  const w = vertical ? W * 0.84 : W * 0.4, h = vertical ? H * 0.12 : H * 0.17;
  const x = vertical ? (W - w) / 2 : W * 0.065, y = vertical ? H * 0.21 : H * 0.66;
  const fs = vertical ? h * 0.3 : h * 0.26;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity: k }}>
      <svg width={W} height={H}>
        <g transform={`translate(${x - (1 - inn) * 60},${y})`}>
          <rect x={-10} y={-10} width={w + 20} height={h + 44} rx={8} fill="#1a1c20" opacity={0.92} />
          <rect x={0} y={0} width={w} height={h} rx={3} fill="#06070b" />
          <rect x={0} y={0} width={w} height={h} rx={3} fill="none" stroke="#2a2e34" strokeWidth={3} />
          {Array.from({ length: Math.floor(h / 6) }, (_, i) => <rect key={i} x={2} y={i * 6} width={w - 4} height={1} fill="#ffffff" opacity={0.03} />)}
          <text x={w * 0.06} y={h * 0.42} fill="#ff2a1e" fontFamily="Lora, Georgia, serif" fontWeight={700} fontSize={fs * 0.62} letterSpacing={6} opacity={0.9}>{`FAVOUR ${String(n).padStart(2, '0')}`}</text>
          <text x={w * 0.06} y={h * 0.78} fill="#f2e6cf" fontFamily="Lora, Georgia, serif" fontWeight={700} fontSize={fs} letterSpacing={1}>{title}</text>
          <rect x={w * 0.06} y={h + 14} width={(w * 0.88) * inn} height={4} fill="#d8241f" opacity={0.8} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
