import React from 'react';
import { AbsoluteFill } from 'remotion';

// ===== KIT 'q': THE SEER OF POSSIBILITIES CHAPTER CARD =====
// Sleek dark terminal window with glowing phosphor header and red cursor accent.
export const ChapterCard: React.FC<{ W: number; H: number; t: number; n: number; title: string; vertical?: boolean }> = ({ W, H, t, n, title, vertical = false }) => {
  if (t < 0 || t > 3) return null;
  const e = (x: number) => { const c = Math.max(0, Math.min(1, x)); return 1 - Math.pow(1 - c, 3); };
  const a = Math.min(e(t / 0.45), 1 - e((t - 2.45) / 0.55));
  const sz = vertical ? W * 0.85 : H * 0.65, w = sz * 1.35, h = sz * 0.82;
  const fs = h * 0.16 * (title.length > 14 ? 0.82 : 1);

  return (
    <AbsoluteFill style={{ background: `rgba(0,0,0,${0.55 * a})`, pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          left: (W - w) / 2,
          top: (H - h) / 2 + (1 - a) * 50,
          width: w,
          height: h,
          opacity: a,
          filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.85))',
        }}
      >
        <svg viewBox="0 0 540 330" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          {/* Main Dark Terminal Glass */}
          <rect x={15} y={15} width={510} height={300} rx={12} fill="#070c14" stroke="#1e293b" strokeWidth={3} />
          {/* Top Title Bar */}
          <rect x={15} y={15} width={510} height={48} rx={12} fill="#0f172a" stroke="#1e293b" strokeWidth={2} />
          {/* Terminal Dots */}
          <circle cx={42} cy={39} r={6} fill="#ef4444" />
          <circle cx={62} cy={39} r={6} fill="#eab308" />
          <circle cx={82} cy={39} r={6} fill="#22c55e" />
          {/* Inner Content Border */}
          <rect x={35} y={80} width={470} height={215} rx={6} fill="#04070d" stroke="#334155" strokeWidth={1.5} />
          {/* Red Scanner Line */}
          <line x1={35} y1={80} x2={505} y2={80} stroke="#ff2a2a" strokeWidth={3} />
        </svg>

        {/* Top Header Label */}
        <div
          style={{
            position: 'absolute',
            left: 105,
            top: 28,
            fontFamily: 'monospace',
            fontWeight: 700,
            fontSize: 16,
            letterSpacing: 2,
            color: '#38bdf8',
          }}
        >
          POSSIBILITY_CHAIN // NODE {String(n).padStart(2, '0')}
        </div>

        {/* Chapter Title */}
        <div
          style={{
            position: 'absolute',
            left: '12%',
            right: '12%',
            top: '36%',
            height: '42%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            fontFamily: 'Lora, Georgia, serif',
            fontStyle: 'italic',
            fontWeight: 700,
            fontSize: fs,
            lineHeight: 1.15,
            color: '#f8fafc',
            textShadow: '0 4px 14px rgba(0,0,0,0.9)',
          }}
        >
          {title}
        </div>
      </div>
    </AbsoluteFill>
  );
};
