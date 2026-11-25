import React from 'react';
import { AbsoluteFill } from 'remotion';
// STORY SLOT: chapter title card for "You Can't Trust Everyone": a torn spiral-notebook page with a red margin line.
// Contract (v0.4): ChapterCard({ W, H, t, n, title, vertical }) where t = SECONDS since the card started; visible 0..3 s, SMOOTH fades.
export const ChapterCard: React.FC<{ W: number; H: number; t: number; n: number; title: string; vertical?: boolean }> = ({ W, H, t, n, title, vertical = false }) => {
  if (t < 0 || t > 3) return null;
  const e = (x: number) => { const c = Math.max(0, Math.min(1, x)); return 1 - Math.pow(1 - c, 3); };
  const a = Math.min(e(t / 0.45), 1 - e((t - 2.45) / 0.55));
  const sz = vertical ? W * 0.82 : H * 0.6, w = sz * 1.32, h = sz * 0.56;
  const fs = h * 0.2 * (title.length > 16 ? 0.82 : 1);
  return (
    <AbsoluteFill style={{ background: `rgba(0,0,0,${0.5 * a})` }}>
      <div style={{ position: 'absolute', left: (W - w) / 2, top: (H - h) / 2 + (1 - a) * 50, width: w, height: h, opacity: a, transform: `rotate(${-1.5 + (1 - a) * 2}deg)` }}>
        <svg viewBox={`0 0 ${w} ${h}`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', filter: 'drop-shadow(8px 12px 0 rgba(0,0,0,0.55))' }}>
          <rect x={0} y={0} width={w} height={h} fill="#e9e6da" stroke="#b7b2a2" strokeWidth={4} />
          {Array.from({ length: 7 }).map((_, i) => <path key={'h' + i} d={`M${w * 0.12},${(h / 7) * (i + 1)} H${w * 0.95}`} stroke="#aab6c4" strokeWidth={1.5} opacity={0.7} />)}
          <path d={`M${w * 0.12},0 V${h}`} stroke="#c23a2e" strokeWidth={3} opacity={0.85} />
          {Array.from({ length: 9 }).map((_, i) => <circle key={'r' + i} cx={w * 0.055} cy={h * (0.08 + i * 0.105)} r={h * 0.02} fill="#0c0d12" opacity={0.55} />)}
        </svg>
        <div style={{ position: 'absolute', left: '14%', top: '9%', fontFamily: 'Lora', fontWeight: 700, fontSize: fs * 0.42, letterSpacing: fs * 0.1, color: '#b3221f' }}>ENTRY {String(n).padStart(2, '0')}</div>
        <div style={{ position: 'absolute', left: '14%', right: '8%', top: '36%', height: '48%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: 'Lora', fontStyle: 'italic', fontWeight: 700, fontSize: fs, lineHeight: 1.05, color: '#1a1a1e' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};
