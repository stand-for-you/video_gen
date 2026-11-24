import React, { useMemo } from 'react';
import { rng } from './core';
// ===== HUD v0.6: the documentary overlay vocabulary =====
// Stage3 already draws simple name tags (TagReq). This file adds the rest of the
// language used by the monster-introduction short: measurements, bar meters, voice
// chips, flight arrows and the red anatomy cutaway panel.
//
// All of these are FLAT overlays, drawn through a set's `overlay` export, on top of
// the 3D picture. They are deliberately not 3D: the reference short keeps every label
// axis-aligned and crisp no matter where the camera is.
//
// LIMIT: the cutaway panels are diagrams of an INVENTED creature only. Never draw a
// human body opened up, an organ of a real person, or a wound. Same rule as blood:
// the picture shows a diagram, never surgery.

export const HC = {
  ink: '#06070b', line: '#e8dcc4', red: '#b3221f', redT: '#ff7a68',
  tech: '#7fe6cf', warm: '#f0a94a',
  flesh: '#9c1f22', fleshD: '#6a1317', fleshL: '#c8373a', rim: '#f2e6cf',
  bone: '#ded3bd', signal: '#5fe3a8', spark: '#f0c34a', cool: '#6fd9e0',
  font: 'Inter, "Helvetica Neue", Arial, sans-serif',
  serif: 'Lora, Georgia, serif',
};
const ss = (x: number) => { const c = Math.max(0, Math.min(1, x)); return c * c * (3 - 2 * c); };
type Tone = 'cream' | 'red' | 'tech';
const tn = (t: Tone) =>
  t === 'red' ? { bg: '#1c0907', br: HC.red, tx: HC.redT }
  : t === 'tech' ? { bg: '#07201c', br: HC.tech, tx: HC.tech }
  : { bg: HC.ink, br: HC.line, tx: HC.line };

// ---------------------------------------------------------------------------
// Pill: the shared label chip. w is measured, not laid out (SVG has no metrics).
// ---------------------------------------------------------------------------
export const Pill: React.FC<{
  x: number; y: number; t: string; fs: number; tone?: Tone; anchor?: 'start' | 'middle' | 'end'; k?: number;
}> = ({ x, y, t, fs, tone = 'cream', anchor = 'middle', k = 1 }) => {
  const c = tn(tone);
  const w = t.length * fs * 0.62 + fs * 1.1, h = fs * 1.72;
  const bx = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x;
  return (
    <g opacity={k}>
      <rect x={bx} y={y - h / 2} width={w} height={h} rx={h * 0.26} fill={c.bg} fillOpacity={0.92} stroke={c.br} strokeWidth={Math.max(1.4, fs * 0.07)} />
      <text x={bx + w / 2} y={y + fs * 0.36} textAnchor="middle" fontFamily={HC.font} fontWeight={700}
        fontSize={fs} letterSpacing={fs * 0.1} fill={c.tx}>{t.toUpperCase()}</text>
    </g>
  );
};

// ---------------------------------------------------------------------------
// Measure: dashed span + arrow caps + value. "2.7 M TALL", "REACH 1.7 M", "25 M".
// Screen coordinates: pass the two ends already projected by the set.
// ---------------------------------------------------------------------------
export const Measure: React.FC<{
  a: [number, number]; b: [number, number]; t: string; H: number; k?: number; tone?: Tone;
}> = ({ a, b, t, H, k = 1, tone = 'cream' }) => {
  const c = tn(tone), p = ss(k); if (p <= 0) return null;
  const fs = H * 0.021;
  const bx = a[0] + (b[0] - a[0]) * p, by = a[1] + (b[1] - a[1]) * p;
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
  const tick = (cx: number, cy: number) => {
    const n = ang + 90, rad = (n * Math.PI) / 180, L = fs * 0.8;
    return <line x1={cx - Math.cos(rad) * L} y1={cy - Math.sin(rad) * L} x2={cx + Math.cos(rad) * L} y2={cy + Math.sin(rad) * L} stroke={c.br} strokeWidth={2.2} />;
  };
  return (
    <g>
      <line x1={a[0]} y1={a[1]} x2={bx} y2={by} stroke={c.br} strokeWidth={2.2} strokeDasharray="9 7" opacity={0.92} />
      {tick(a[0], a[1])}
      {p > 0.96 && tick(b[0], b[1])}
      {p > 0.96 && <Pill x={(a[0] + b[0]) / 2} y={(a[1] + b[1]) / 2} t={t} fs={fs} tone={tone} />}
    </g>
  );
};

// ---------------------------------------------------------------------------
// Meter: "COPY 100%" / "ANSWER 0%" / the DAY-NIGHT pair.
// ---------------------------------------------------------------------------
export const Meter: React.FC<{
  x: number; y: number; w: number; t: string; v: number; H: number; k?: number; tone?: Tone;
}> = ({ x, y, w, t, v, H, k = 1, tone = 'tech' }) => {
  const c = tn(tone), p = ss(k); if (p <= 0) return null;
  const fs = H * 0.016, h = fs * 0.8;
  return (
    <g opacity={p}>
      <text x={x} y={y - fs * 0.5} fontFamily={HC.font} fontWeight={700} fontSize={fs} letterSpacing={fs * 0.13} fill={c.tx}>{t.toUpperCase()}</text>
      <rect x={x} y={y} width={w} height={h} rx={h / 2} fill="#000" fillOpacity={0.55} stroke={c.br} strokeWidth={1.5} strokeOpacity={0.5} />
      <rect x={x} y={y} width={Math.max(0, w * v * p)} height={h} rx={h / 2} fill={c.br} />
    </g>
  );
};

// ---------------------------------------------------------------------------
// VoiceChip: the stolen voice. |||.||| "SWEETIE, COME OUTSIDE"
// The bars move, so the chip is never a frozen picture.
// ---------------------------------------------------------------------------
export const VoiceChip: React.FC<{
  x: number; y: number; t: string; H: number; time: number; k?: number; tone?: Tone;
}> = ({ x, y, t, H, time, k = 1, tone = 'cream' }) => {
  const c = tn(tone), p = ss(k); if (p <= 0) return null;
  const fs = H * 0.02, label = `"${t.toUpperCase()}"`;
  const barW = fs * 2.8, w = label.length * fs * 0.6 + fs * 1.2 + barW, h = fs * 1.8;
  return (
    <g opacity={p}>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={h * 0.26} fill={c.bg} fillOpacity={0.92} stroke={c.br} strokeWidth={2} />
      {[0, 1, 2, 3, 4].map((i) => {
        const a = 0.3 + Math.abs(Math.sin(time * 7 + i * 1.1)) * 0.7;
        return <rect key={i} x={x - w / 2 + fs * 0.5 + i * (fs * 0.46)} y={y - h * 0.3 * a} width={fs * 0.2} height={h * 0.6 * a} rx={fs * 0.1} fill={c.tx} opacity={0.9} />;
      })}
      <text x={x - w / 2 + fs * 0.6 + barW} y={y + fs * 0.35} fontFamily={HC.font} fontWeight={700} fontSize={fs} letterSpacing={fs * 0.07} fill={c.tx}>{label}</text>
    </g>
  );
};

// ---------------------------------------------------------------------------
// FlowArrow: how the voice travels, how the warm air moves, where it goes next.
// ---------------------------------------------------------------------------
export const FlowArrow: React.FC<{
  a: [number, number]; b: [number, number]; H: number; t?: string; bow?: number; k?: number; tone?: Tone;
}> = ({ a, b, H, t, bow = 0.25, k = 1, tone = 'tech' }) => {
  const c = tn(tone), p = ss(k); if (p <= 0) return null;
  const fs = H * 0.016;
  const mx = (a[0] + b[0]) / 2 + (b[1] - a[1]) * bow, my = (a[1] + b[1]) / 2 - (b[0] - a[0]) * bow;
  const ang = Math.atan2(b[1] - my, b[0] - mx) * 180 / Math.PI;
  return (
    <g opacity={p}>
      <path d={`M${a[0]},${a[1]} Q${mx},${my} ${b[0]},${b[1]}`} fill="none" stroke={c.br} strokeWidth={2.4} strokeDasharray="10 8" opacity={0.9} />
      {p > 0.85 && <path d="M0,0 l15,-7 l0,14 Z" fill={c.br} transform={`translate(${b[0]},${b[1]}) rotate(${ang})`} />}
      {t && p > 0.85 && <text x={mx} y={my - fs * 0.5} textAnchor="middle" fontFamily={HC.font} fontWeight={700} fontSize={fs} letterSpacing={fs * 0.13} fill={c.tx}>{t.toUpperCase()}</text>}
    </g>
  );
};

// ---------------------------------------------------------------------------
// The red anatomy cutaway. A wobbly organic slice with the ONE organ the
// narration is about drawn inside it.
// ---------------------------------------------------------------------------
const blob = (r: number, n: number, seed: number, time: number) => {
  const q = rng(seed); const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2, j = 0.78 + q() * 0.34;
    const rr = r * j * (1 + Math.sin(time * 1.2 + i * 0.9) * 0.014);
    pts.push([Math.cos(a) * rr, Math.sin(a) * rr * 0.92]);
  }
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    d += ` C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)},${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)},${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d + 'Z';
};

export type PanelKind = 'voice' | 'mind' | 'mirror' | 'heat' | 'gut' | 'plain';

export const CutPanel: React.FC<{
  x: number; y: number; r: number; kind?: PanelKind; seed?: number; time: number; k?: number;
}> = ({ x, y, r, kind = 'plain', seed = 7, time, k = 1 }) => {
  const p = ss(k); if (p <= 0) return null;
  const d = useMemo(() => blob(r, 13, seed, Math.round(time * 4) / 4), [r, seed, Math.round(time * 4)]);
  const id = `cut${seed}`;
  const br = Math.sin(time * 2.2);
  return (
    <g opacity={p} transform={`translate(${x},${y}) scale(${0.86 + 0.14 * p})`}>
      <defs>
        <clipPath id={id}><path d={d} /></clipPath>
        <radialGradient id={`${id}g`} cx="0.38" cy="0.32" r="0.78">
          <stop offset="0" stopColor={HC.fleshL} /><stop offset="0.62" stopColor={HC.flesh} /><stop offset="1" stopColor={HC.fleshD} />
        </radialGradient>
      </defs>
      <path d={d} fill={`url(#${id}g)`} stroke={HC.rim} strokeWidth={r * 0.055} strokeLinejoin="round" />
      <g clipPath={`url(#${id})`}>
        <path d={d} fill="none" stroke={HC.fleshD} strokeWidth={r * 0.17} opacity={0.5} />
        {kind === 'voice' && (
          <g>
            <path d={`M0,${-r * 0.95} V${-r * 0.1} C${-r * 0.1},${r * 0.2} ${-r * 0.42},${r * 0.26} ${-r * 0.44},${r * 0.48}`} fill="none" stroke={HC.rim} strokeWidth={r * 0.2} strokeLinecap="round" />
            <path d={`M0,${-r * 0.95} V${-r * 0.1} C${-r * 0.1},${r * 0.2} ${-r * 0.42},${r * 0.26} ${-r * 0.44},${r * 0.48}`} fill="none" stroke={HC.bone} strokeWidth={r * 0.15} strokeLinecap="round" />
            <path d={`M0,${-r * 0.1} C${r * 0.1},${r * 0.2} ${r * 0.34},${r * 0.26} ${r * 0.36},${r * 0.5}`} fill="none" stroke={HC.bone} strokeWidth={r * 0.12} strokeLinecap="round" />
            <circle cx={-r * 0.44} cy={r * 0.5} r={r * 0.22 * (1 + br * 0.06)} fill={HC.bone} stroke={HC.rim} strokeWidth={r * 0.03} />
            <circle cx={r * 0.36} cy={r * 0.52} r={r * 0.17 * (1 - br * 0.06)} fill={HC.spark} stroke={HC.rim} strokeWidth={r * 0.03} />
          </g>
        )}
        {kind === 'mind' && (
          <g>
            <ellipse rx={r * 0.62} ry={r * 0.5} fill="#2a0a0c" opacity={0.55} />
            {Array.from({ length: 10 }, (_, i) => {
              const q = rng(seed + i * 3); const bx = (q() - 0.5) * r * 1.1, by = (q() - 0.5) * r * 0.9, ph = q() * 6.3;
              return <circle key={i} cx={bx + Math.sin(time * 1.4 + ph) * r * 0.05} cy={by + Math.cos(time * 1.2 + ph) * r * 0.05}
                r={r * 0.045} fill={HC.signal} opacity={0.65 + 0.35 * Math.abs(Math.sin(time * 2 + ph))} />;
            })}
          </g>
        )}
        {kind === 'mirror' && (
          <g>
            <ellipse rx={r * 0.64} ry={r * 0.52} fill="#f6eedd" opacity={0.9} />
            {[0, 1, 2].map((i) => {
              const kk = ((time * 0.5 + i / 3) % 1);
              return <path key={i} d={`M${-r * 0.1},${-r * (0.72 - kk * 0.1)} A ${r * 0.72},${r * 0.86} 0 0 0 ${-r * 0.1},${r * (0.72 - kk * 0.1)}`}
                fill="none" stroke={HC.cool} strokeWidth={r * 0.05} opacity={0.85 * (1 - kk)} strokeLinecap="round" />;
            })}
            {Array.from({ length: 8 }, (_, i) => {
              const q = rng(seed + 50 + i * 5); const bx = (q() - 0.5) * r * 0.9, by = (q() - 0.5) * r * 0.75;
              return <circle key={i} cx={bx} cy={by} r={r * 0.04} fill={HC.spark} opacity={0.6 + 0.4 * Math.abs(Math.sin(time * 1.8 + i))} />;
            })}
          </g>
        )}
        {kind === 'heat' && [0.9, 0.66, 0.42].map((kk, i) => (
          <ellipse key={i} rx={r * kk * 0.7} ry={r * kk * 0.58} fill={i === 2 ? HC.spark : 'none'}
            stroke={HC.spark} strokeWidth={r * 0.035} opacity={0.35 + i * 0.22 + 0.12 * Math.sin(time * 2 + i)} />
        ))}
        {kind === 'gut' && (
          <path d={`M${-r * 0.5},${-r * 0.4} C${r * 0.5},${-r * 0.5} ${-r * 0.5},${r * 0.1} ${r * 0.45},${r * 0.2} C${-r * 0.2},${r * 0.5} ${r * 0.1},${r * 0.7} ${-r * 0.2},${r * 0.66}`}
            fill="none" stroke={HC.bone} strokeWidth={r * 0.18} strokeLinecap="round" />
        )}
      </g>
    </g>
  );
};

// ---------------------------------------------------------------------------
// Watermark at the foot of the frame (reference: "NIGHT PROTOCOL").
// ---------------------------------------------------------------------------
export const Watermark: React.FC<{ W: number; H: number; t: string; op?: number }> = ({ W, H, t, op = 0.3 }) => {
  const fs = H * 0.0105;
  return <text x={W / 2} y={H * 0.955} textAnchor="middle" fontFamily={HC.font} fontWeight={600}
    fontSize={fs} letterSpacing={fs * 0.45} fill={HC.line} opacity={op}>{t.toUpperCase()}</text>;
};

// A plain full-frame SVG wrapper for a set's `overlay`.
export const Hud: React.FC<{ W: number; H: number; children: React.ReactNode }> = ({ W, H, children }) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
    <defs><filter id="hudsh" x="-25%" y="-25%" width="150%" height="150%">
      <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#000" floodOpacity="0.65" />
    </filter></defs>
    <g filter="url(#hudsh)">{children}</g>
  </svg>
);
