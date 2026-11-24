import React from 'react';
import { AbsoluteFill } from 'remotion';
// STORY SLOT: chapter title card for "Gateway of the Mind": a pale lab ECG strip (graph paper, one red trace). Lora font.
// Contract (v0.4): ChapterCard({ W, H, t, n, title, vertical }) where t = SECONDS since the card started; visible 0..3 s, SMOOTH fades.
export const ChapterCard: React.FC<{ W: number; H: number; t: number; n: number; title: string; vertical?: boolean }> = ({ W, H, t, n, title, vertical = false }) => {
  if (t < 0 || t > 3) return null;
  const e = (x: number) => { const c = Math.max(0, Math.min(1, x)); return 1 - Math.pow(1 - c, 3); };
  const a = Math.min(e(t / 0.45), 1 - e((t - 2.45) / 0.55));
  const sz = vertical ? W * 0.8 : H * 0.62, w = sz * 1.3, h = sz * 0.55;
  const fs = h * 0.2 * (title.length > 16 ? 0.8 : 1);
  const trace = `M0,${h * 0.55} L${w * 0.2},${h * 0.55} L${w * 0.25},${h * 0.2} L${w * 0.3},${h * 0.85} L${w * 0.35},${h * 0.55} L${w * 0.7},${h * 0.55} L${w * 0.74},${h * 0.3} L${w * 0.78},${h * 0.55} L${w},${h * 0.55}`;
  return (
    <AbsoluteFill style={{ background: `rgba(0,0,0,${0.5 * a})` }}>
      <div style={{ position: 'absolute', left: (W - w) / 2, top: (H - h) / 2 + (1 - a) * 50, width: w, height: h, opacity: a, transform: `rotate(${-1 + (1 - a) * 2}deg)` }}>
        <svg viewBox={`0 0 ${w} ${h}`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', filter: 'drop-shadow(8px 10px 0 rgba(0,0,0,0.5))' }}>
          <rect x={0} y={0} width={w} height={h} fill="#dfe9e2" stroke="#2e3836" strokeWidth={4} />
          {Array.from({ length: 12 }).map((_, i) => <path key={'v' + i} d={`M${(w / 12) * i},0 V${h}`} stroke="#b8c4bc" strokeWidth={1.5} />)}
          {Array.from({ length: 8 }).map((_, i) => <path key={'h' + i} d={`M0,${(h / 8) * i} H${w}`} stroke="#b8c4bc" strokeWidth={1.5} />)}
          <path d={trace} stroke="#b3221f" strokeWidth={5} fill="none" strokeLinejoin="round" />
        </svg>
        <div style={{ position: 'absolute', left: '6%', top: '8%', fontFamily: 'Lora', fontWeight: 700, fontSize: fs * 0.42, letterSpacing: fs * 0.1, color: '#b3221f' }}>TRIAL {String(n).padStart(2, '0')}</div>
        <div style={{ position: 'absolute', left: '8%', right: '8%', top: '38%', height: '44%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: 'Lora', fontStyle: 'italic', fontWeight: 700, fontSize: fs, lineHeight: 1.05, color: '#1a2220' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};
