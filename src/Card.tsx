import React from 'react';
import { AbsoluteFill } from 'remotion';
// STORY SLOT: the chapter title card. Change its ornament and paper tone for every new look kit (variety rule); keep the Lora font.
// Contract (v0.4): ChapterCard({ W, H, t, n, title, vertical }) where t = SECONDS since the card started; visible 0..3 s, SMOOTH fades.
// demo kit (l2): a manila case-file folder with a typed tab "FILE n" and a red paper-clip; the folder slides up and settles.
export const ChapterCard: React.FC<{ W: number; H: number; t: number; n: number; title: string; vertical?: boolean }> = ({ W, H, t, n, title, vertical = false }) => {
  if (t < 0 || t > 3) return null;
  const e = (x: number) => { const c = Math.max(0, Math.min(1, x)); return 1 - Math.pow(1 - c, 3); };
  const a = Math.min(e(t / 0.45), 1 - e((t - 2.45) / 0.55));
  const sz = vertical ? W * 0.8 : H * 0.62, w = sz * 1.25, h = sz * 0.8;
  const fs = h * 0.15 * (title.length > 14 ? 0.8 : 1);
  return (
    <AbsoluteFill style={{ background: `rgba(0,0,0,${0.5 * a})` }}>
      <div style={{ position: 'absolute', left: (W - w) / 2, top: (H - h) / 2 + (1 - a) * 60, width: w, height: h, opacity: a, transform: `rotate(${-2 + (1 - a) * 3}deg)` }}>
        <svg viewBox="0 0 500 320" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', filter: 'drop-shadow(10px 14px 0 rgba(0,0,0,0.55))' }}>
          <path d="M20,40 H170 L190,14 H330 L350,40 H480 V310 H20Z" fill="#c9a96a" stroke="#2a1c10" strokeWidth={4} strokeLinejoin="round" />
          <path d="M20,40 H480" stroke="#8a6a3a" strokeWidth={3} />
          <rect x={40} y={60} width={420} height={232} fill="#e8dcc0" stroke="#8a6a3a" strokeWidth={2} />
          {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M60,${200 + i * 18} H440`} stroke="#b8a888" strokeWidth={1.5} />)}
          <path d="M420,30 v60 q0,16 -14,16 q-14,0 -14,-16 v-50" stroke="#b3221f" strokeWidth={6} fill="none" strokeLinecap="round" />
        </svg>
        <div style={{ position: 'absolute', left: '38%', right: '30%', top: '4.5%', height: '8%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Lora', fontWeight: 700, fontSize: fs * 0.42, letterSpacing: fs * 0.12, color: '#3a2410' }}>FILE {String(n).padStart(2, '0')}</div>
        <div style={{ position: 'absolute', left: '12%', right: '12%', top: '24%', height: '34%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: 'Lora', fontStyle: 'italic', fontWeight: 700, fontSize: fs, lineHeight: 1.05, color: '#1a1420' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};
