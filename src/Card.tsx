import React from 'react';
import { AbsoluteFill } from 'remotion';

// Kit L Chapter Card: A dark bedside digital alarm clock silhouette glowing pre-dawn crimson red,
// over a slate-grey textured paper card with an ink-etched alarm glyph.
export const ChapterCard: React.FC<{ W: number; H: number; t: number; n: number; title: string; vertical?: boolean }> = ({ W, H, t, n, title, vertical = false }) => {
  if (t < 0 || t > 30) return null;
  const inn = Math.min(1, t / 3), out = t > 26 ? (30 - t) / 4 : 1;
  const a = Math.max(0, Math.min(inn, out));
  const step = Math.floor(a * 4) / 4;
  const szW = vertical ? W * 0.88 : H * 0.75;
  const szH = szW * 0.65;
  const fs = szW * 0.075 * (title.length > 16 ? 0.8 : 1);

  return (
    <AbsoluteFill style={{ background: `rgba(4, 7, 13, ${0.7 * step})` }}>
      <div style={{
        position: 'absolute',
        left: (W - szW) / 2,
        top: (H - szH) / 2 + (1 - step) * 40,
        width: szW,
        height: szH,
        opacity: step,
        transform: 'rotate(-1.5deg)'
      }}>
        <svg viewBox="0 0 500 325" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', filter: 'drop-shadow(10px 14px 0 rgba(0,0,0,0.75))' }}>
          {/* Card body: slate charcoal bone paper with ink border */}
          <rect x={12} y={12} width={476} height={301} rx={8} fill="#181c24" stroke="#05070a" strokeWidth={8} strokeLinejoin="round" />
          <rect x={24} y={24} width={452} height={277} rx={4} fill="#252b36" stroke="#0c0f14" strokeWidth={4} />

          {/* Red warning bar top */}
          <rect x={24} y={24} width={452} height={42} fill="#9c1c18" />
          <line x1={24} y1={66} x2={476} y2={66} stroke="#05070a" strokeWidth={5} />

          {/* Chapter glyph for The Melancholy of Herbert Solomon: ETTRICK // 1578 */}
          <text x={40} y={53} fill="#fbeeee" fontFamily="Lora" fontWeight="bold" fontSize="19" letterSpacing="2">ETTRICK // PART {n}</text>
          <text x={450} y={53} textAnchor="end" fill="#fbeeee" fontFamily="Lora" fontWeight="bold" fontSize="18" opacity={0.85}>1578 AD</text>

          {/* Inner parchment panel */}
          <rect x={44} y={85} width={412} height={195} fill="#ddd4c4" stroke="#05070a" strokeWidth={5} />
          {/* Faint blood/ink drip lines */}
          <line x1={44} y1={92} x2={456} y2={92} stroke="#c43026" strokeWidth={4} opacity={0.6} />
          <line x1={70} y1={92} x2={70} y2={125} stroke="#c43026" strokeWidth={3} opacity={0.7} />
          <line x1={390} y1={92} x2={390} y2={115} stroke="#c43026" strokeWidth={3} opacity={0.7} />
        </svg>

        {/* Chapter Title text inside parchment */}
        <div style={{
          position: 'absolute',
          left: '12%',
          right: '12%',
          top: '35%',
          bottom: '12%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          fontFamily: 'Lora',
          fontStyle: 'italic',
          fontWeight: 700,
          fontSize: fs,
          lineHeight: 1.15,
          color: '#121620'
        }}>
          {title}
        </div>
      </div>
    </AbsoluteFill>
  );
};
