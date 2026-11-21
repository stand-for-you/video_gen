import React from 'react';
import { AbsoluteFill } from 'remotion';

// STORY SLOT: Chapter title card for Kit q ("Facility 1983" / "Gateway of the Mind").
// Classified 1983 sensory research dossier with red security stamp and Lora typography.
export const ChapterCard: React.FC<{ W: number; H: number; t: number; n: number; title: string; vertical?: boolean }> = ({
  W,
  H,
  t,
  n,
  title,
  vertical = false,
}) => {
  if (t < 0 || t > 3) return null;
  const e = (x: number) => {
    const c = Math.max(0, Math.min(1, x));
    return 1 - Math.pow(1 - c, 3);
  };
  const a = Math.min(e(t / 0.45), 1 - e((t - 2.45) / 0.55));
  const sz = vertical ? W * 0.82 : H * 0.65;
  const w = sz * 1.25;
  const h = sz * 0.8;
  const fs = h * 0.14 * (title.length > 14 ? 0.8 : 1);

  return (
    <AbsoluteFill style={{ background: `rgba(0,0,0,${0.55 * a})` }}>
      <div
        style={{
          position: 'absolute',
          left: (W - w) / 2,
          top: (H - h) / 2 + (1 - a) * 50,
          width: w,
          height: h,
          opacity: a,
          transform: `rotate(${-1.5 + (1 - a) * 2.5}deg)`,
        }}
      >
        <svg
          viewBox="0 0 500 320"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', filter: 'drop-shadow(10px 14px 0 rgba(0,0,0,0.65))' }}
        >
          {/* Manila / Institutional Grey Folder */}
          <path d="M20,40 H180 L200,16 H340 L360,40 H480 V310 H20Z" fill="#a89a80" stroke="#1f2426" strokeWidth={4} strokeLinejoin="round" />
          <path d="M20,40 H480" stroke="#786c56" strokeWidth={3} />
          {/* Inner Document Sheet */}
          <rect x={40} y={60} width={420} height={232} fill="#dfd8c8" stroke="#786c56" strokeWidth={2} />
          {[0, 1, 2, 3, 4].map((i) => (
            <path key={i} d={`M60,${200 + i * 18} H440`} stroke="#c2b8a2" strokeWidth={1.5} />
          ))}
          {/* Red Classified Stamp */}
          <rect x={320} y={75} width={120} height={32} fill="none" stroke="#b3221f" strokeWidth={3} rx={4} />
          <text x={380} y={97} textAnchor="middle" fill="#b3221f" fontFamily="Lora" fontWeight="bold" fontSize="13" letterSpacing="2">
            RESTRICTED
          </text>
        </svg>

        {/* Tab Header */}
        <div
          style={{
            position: 'absolute',
            left: '40%',
            right: '30%',
            top: '5%',
            height: '8%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Lora',
            fontWeight: 700,
            fontSize: fs * 0.42,
            letterSpacing: fs * 0.12,
            color: '#2a2218',
          }}
        >
          SUBJECT 83
        </div>

        {/* Chapter Title */}
        <div
          style={{
            position: 'absolute',
            left: '12%',
            right: '12%',
            top: '26%',
            height: '34%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            fontFamily: 'Lora',
            fontStyle: 'italic',
            fontWeight: 700,
            fontSize: fs,
            lineHeight: 1.05,
            color: '#1a1d1e',
          }}
        >
          {title}
        </div>
      </div>
    </AbsoluteFill>
  );
};
