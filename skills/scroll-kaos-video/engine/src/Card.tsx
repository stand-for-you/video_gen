import React from 'react';
import { AbsoluteFill } from 'remotion';
// STORY SLOT: the chapter title card. Change its frame ornament and paper tone for every new look kit (variety rule);
// keep the Lora font. Must export ChapterCard({ W, H, t, n, title, vertical }) and show nothing when t < 0 or t > 30.
// kit (k) chapter card: a big 3.5-inch floppy disk; its paper label carries "DISK n" (red stripe) and the chapter title in Lora.
export const ChapterCard: React.FC<{ W: number; H: number; t: number; n: number; title: string; vertical?: boolean }> = ({ W, H, t, n, title, vertical = false }) => {
  if (t < 0 || t > 30) return null;
  const inn = Math.min(1, t / 3), out = t > 26 ? (30 - t) / 4 : 1; const a = Math.max(0, Math.min(inn, out));
  const step = Math.floor(a * 4) / 4; const sz = vertical ? W * 0.82 : H * 0.62;
  const fs = sz * 0.085 * (title.length > 14 ? 0.82 : 1);
  return (
    <AbsoluteFill style={{ background: `rgba(0,0,0,${0.55 * step})` }}>
      <div style={{ position: 'absolute', left: (W - sz) / 2, top: (H - sz) / 2 + (1 - step) * 50, width: sz, height: sz, opacity: step, transform: 'rotate(-3deg)' }}>
        <svg viewBox="0 0 400 400" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', filter: 'drop-shadow(8px 12px 0 rgba(0,0,0,0.6))' }}>
          <path d="M10,10 H352 L390,48 V390 H10Z" fill="#2a3038" stroke="#050407" strokeWidth={7} strokeLinejoin="round" />
          <rect x={96} y={10} width={212} height={118} fill="#a8aeb4" stroke="#050407" strokeWidth={5} /><rect x={232} y={26} width={46} height={84} fill="#2a3038" />
          <rect x={18} y={366} width={20} height={18} fill="#14181e" /><rect x={362} y={366} width={20} height={18} fill="#14181e" />
          <rect x={46} y={168} width={308} height={210} fill="#e8e2d0" stroke="#050407" strokeWidth={5} />
          <rect x={46} y={168} width={308} height={40} fill="#c8241e" />
          {[0, 1, 2, 3].map((i) => <path key={i} d={`M60,${246 + i * 34} H340`} stroke="#9ab0d0" strokeWidth={2} />)}
        </svg>
        <div style={{ position: 'absolute', left: '12%', right: '12%', top: '42.5%', height: '9%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Lora', fontWeight: 700, fontSize: fs * 0.5, letterSpacing: fs * 0.12, color: '#f6efe0' }}>DISK {n}</div>
        <div style={{ position: 'absolute', left: '14%', right: '14%', top: '53%', bottom: '7%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: 'Lora', fontStyle: 'italic', fontWeight: 700, fontSize: fs, lineHeight: 1.08, color: '#1a1e30' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};
