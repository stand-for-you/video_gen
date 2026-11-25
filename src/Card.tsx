// Card.tsx — chapter card ornament for kit m: a torn hospital discharge-paper slip,
// stapled at one corner, stamped "NIGHT n" in red ink (Lora font).
import React from 'react';
import { AbsoluteFill } from 'remotion';

export const ChapterCard: React.FC<{ W: number; H: number; t: number; n: number; title: string; vertical?: boolean }> = ({ W, H, t, n, title, vertical = false }) => {
  if (t < 0 || t > 3) return null;
  const e = (x: number) => { const c = Math.max(0, Math.min(1, x)); return 1 - Math.pow(1 - c, 3); };
  const a = Math.min(e(t / 0.45), 1 - e((t - 2.45) / 0.55));
  const sz = vertical ? W * 0.8 : H * 0.62, w = sz * 1.3, h = sz * 0.55;
  const fs = h * 0.2 * (title.length > 16 ? 0.8 : 1);
  return (
    <AbsoluteFill style={{ background: `rgba(0,0,0,${0.5 * a})` }}>
      <div style={{ position: 'absolute', left: (W - w) / 2, top: (H - h) / 2 + (1 - a) * 50, width: w, height: h, opacity: a, transform: `rotate(${-1 + (1 - a) * 2}deg)` }}>
        <svg viewBox="0 0 440 540" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', filter: 'drop-shadow(8px 10px 0 rgba(0,0,0,0.5))' }}>
          <path d="M 0 0 L 420 -12 L 440 520 L -10 540 Z" fill="#efe7d6" stroke="#cfc4a9" strokeWidth={3} />
          <path d="M 10 10 L 20 60 L 5 100 L 18 150" stroke="#cfc4a9" strokeWidth={2} fill="none" opacity={0.5} />
          <circle cx={30} cy={20} r={10} fill="#8c8c8c" />
          <text x={210} y={120} textAnchor="middle" fontFamily="Lora, serif" fontSize={34}
            fill="#b4232c" transform="rotate(-6 210 120)">
            NIGHT {n}
          </text>
          <text x={210} y={260} textAnchor="middle" fontFamily="Lora, serif" fontSize={38} fill="#1c1812">
            {title}
          </text>
        </svg>
      </div>
    </AbsoluteFill>
  );
};

export const Card = ChapterCard;
export default ChapterCard;
