import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Defs, Hand, INK, rng } from './Kit';
import { FullMan, NOAH } from './Body';
import { FaceWoman } from './Faces';
import { Thread, Snow } from './Room';
// ===== SCROLL KAOS THUMBNAIL KIT: the MOST HORROR backdrop. Used for every video: blood moon, dead trees, gravestones, fog, hands from the ground, giant ghost face, tiny hero small. =====
const Tree: React.FC<{ x: number; y: number; s: number; flip?: boolean; seed?: number }> = ({ x, y, s, flip, seed = 1 }) => {
  const q = rng(seed); const br: JSX.Element[] = [];
  const grow = (px: number, py: number, a: number, len: number, w: number, d: number) => {
    if (d === 0 || len < 14) return; const nx = px + Math.cos(a) * len, ny = py + Math.sin(a) * len;
    br.push(<path key={br.length} d={`M${px},${py} L${nx},${ny}`} stroke="#050407" strokeWidth={w} strokeLinecap="round" />);
    grow(nx, ny, a - 0.35 - q() * 0.4, len * (0.7 + q() * 0.1), w * 0.68, d - 1); grow(nx, ny, a + 0.3 + q() * 0.4, len * (0.68 + q() * 0.1), w * 0.68, d - 1);
  };
  grow(0, 0, -Math.PI / 2 + (q() - 0.5) * 0.2, 260, 38, 7);
  return <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>{br}</g>;
};
const Stone: React.FC<{ x: number; y: number; s: number; kind?: number }> = ({ x, y, s, kind = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {kind === 0 && <path d="M-60,0 V-170 C-60,-250 60,-250 60,-170 V0Z" fill="#17141c" stroke="#050407" strokeWidth={6} />}
    {kind === 1 && <path d="M-26,0 V-250 H-80 V-300 H-26 V-360 H26 V-300 H80 V-250 H26 V0Z" fill="#17141c" stroke="#050407" strokeWidth={6} />}
    {kind === 2 && <path d="M-70,0 L-50,-190 L0,-220 L55,-180 L70,0Z" fill="#17141c" stroke="#050407" strokeWidth={6} />}
    <path d="M-30,-150 q10,40 -4,90 M18,-170 l6,60" stroke="#07050a" strokeWidth={5} fill="none" opacity={0.8} />
  </g>
);
export const HorrorBack: React.FC<{ W: number; H: number; moon: [number, number, number]; gy: number }> = ({ W, H, moon, gy }) => {
  const q = rng(7);
  return (
    <g>
      <defs>
        <linearGradient id="hsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#050206" /><stop offset="0.55" stopColor="#1c0709" /><stop offset="1" stopColor="#3a0c0d" /></linearGradient>
        <radialGradient id="hmoon"><stop offset="0" stopColor="#ff6a4a" /><stop offset="0.55" stopColor="#b8221c" /><stop offset="1" stopColor="#6a0c10" /></radialGradient>
        <radialGradient id="hglow"><stop offset="0" stopColor="#c8261c" stopOpacity="0.7" /><stop offset="1" stopColor="#c8261c" stopOpacity="0" /></radialGradient>
        <linearGradient id="hground" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#120a0e" /><stop offset="1" stopColor="#030203" /></linearGradient>
        <filter id="hfog" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="38" /></filter>
        <filter id="hsoft"><feGaussianBlur stdDeviation="3" /></filter>
      </defs>
      <rect x={-80} y={-80} width={W + 160} height={H + 160} fill="url(#hsky)" />
      <circle cx={moon[0]} cy={moon[1]} r={moon[2] * 3.2} fill="url(#hglow)" />
      <circle cx={moon[0]} cy={moon[1]} r={moon[2]} fill="url(#hmoon)" />
      {[[-0.3, 0.2, 0.5], [0.25, -0.35, 0.3], [0.1, 0.4, 0.35]].map((c, i) => <circle key={i} cx={moon[0] + c[0] * moon[2]} cy={moon[1] + c[1] * moon[2]} r={c[2] * moon[2] * 0.4} fill="#7a1010" opacity={0.45} />)}
      {Array.from({ length: 5 }).map((_, i) => <path key={i} d={`M${W * (0.05 + i * 0.22)},${moon[1] - 60 + (i % 2) * 80} q40,-30 90,-4 q-30,10 -40,26 q-30,-12 -50,-22Z`} fill="#030203" />)}
      <rect x={-80} y={gy} width={W + 160} height={H - gy + 160} fill="url(#hground)" />
      <Tree x={W * 0.1} y={gy + 10} s={W / 1080 * 1.5} seed={3} /><Tree x={W * 0.9} y={gy + 10} s={W / 1080 * 1.7} flip seed={5} /><Tree x={W * 0.52} y={gy - 4} s={W / 1080 * 0.7} seed={9} />
      {Array.from({ length: 9 }).map((_, i) => <Stone key={i} x={W * (0.04 + i * 0.115) + (q() - 0.5) * 30} y={gy + 40 + q() * (H - gy) * 0.35} s={(0.45 + q() * 0.5) * W / 1080} kind={i % 3} />)}
      <g filter="url(#hfog)" opacity={0.75}>{Array.from({ length: 6 }).map((_, i) => <ellipse key={i} cx={W * (i / 5)} cy={gy + 20 + (i % 2) * 60} rx={W * 0.28} ry={70} fill="#8a6a70" />)}</g>
    </g>
  );
};
export const Reach: React.FC<{ x: number; y: number; s: number; rot: number }> = ({ x, y, s, rot }) => (
  <g><Hand x={x} y={y} s={s} rot={rot} skin="#c9d3d8" shade="#6e7f92" sleeve="#1a1418" sleeveLen={900} ext={[1.1, 1.2, 1.15, 1]} long /></g>
);
export const Hair: React.FC<{ sx?: number }> = ({ sx = 0.62 }) => <path transform={`scale(${sx},1)`} d="M-290,-170 C-320,-420 320,-420 290,-170 C340,200 330,520 300,900 L-300,900 C-330,520 -340,200 -290,-170Z" fill="#050407" stroke={INK} strokeWidth={9} />;
export const Title: React.FC<{ a: string; b: string; sa: number; sb: number; align?: 'center' | 'left' }> = ({ a, b, sa, sb, align = 'center' }) => (
  <div style={{ textAlign: align, fontFamily: 'Lora', fontWeight: 700 }}>
    <div style={{ fontSize: sa, lineHeight: 0.95, color: '#f1f4f8', letterSpacing: sa * 0.03, textShadow: `0 0 ${sa * 0.14}px #000, ${sa * 0.045}px ${sa * 0.045}px 0 #000` }}>{a}</div>
    <div style={{ fontSize: sb, lineHeight: 1.05, color: '#ff3a2a', textShadow: `0 0 ${sb * 0.2}px #000, ${sb * 0.06}px ${sb * 0.06}px 0 #000, 0 0 ${sb * 0.3}px #8a0a0a` }}>{b}</div>
  </div>
);
export const ThumbR: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
      <Defs />
      <HorrorBack W={1080} H={1920} moon={[860, 520, 200]} gy={1320} />
      <g transform="translate(540,830) scale(3.0)"><Hair sx={0.38} /><FaceWoman f={8} /></g>
      
      {[[80, 1900, 1.1, -14], [250, 1930, 1.3, 8], [420, 1960, 1.1, -6], [660, 1950, 1.2, 10], [840, 1925, 1.3, -10], [1000, 1900, 1.1, 14]].map((h, i) => <Reach key={i} x={h[0]} y={h[1]} s={h[2]} rot={h[3]} />)}
      <FullMan look={NOAH} view="back" x={540} y={1850} s={0.17} f={4} />
      <Snow f={9} n={40} op={0.5} />
      <rect x={-60} y={-60} width={1200} height={2040} fill="url(#darkv)" opacity={0.2} />
    </svg>
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 42%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)' }} />
    <div style={{ position: 'absolute', left: 30, right: 30, top: 70 }}><Title a="TICCI TOBY" b="ORIGIN" sa={150} sb={150} /></div>
  </AbsoluteFill>
);
export const ThumbY: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    <svg width={1280} height={720} viewBox="0 0 1280 720" style={{ position: 'absolute' }}>
      <Defs />
      <HorrorBack W={1280} H={720} moon={[470, 330, 170]} gy={520} />
      <g transform="translate(900,400) scale(1.75)"><Hair /><FaceWoman f={8} /></g>
      
      {[[60, 740, 0.7, -12], [200, 760, 0.8, 8], [360, 770, 0.7, -6]].map((h, i) => <Reach key={i} x={h[0]} y={h[1]} s={h[2]} rot={h[3]} />)}
      <FullMan look={NOAH} view="back" x={520} y={716} s={0.1} f={4} />
      <Snow f={9} n={26} op={0.5} />
    </svg>
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 70% 50%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.55) 100%)' }} />
    <div style={{ position: 'absolute', left: 40, top: 40, width: 760 }}><Title a="TICCI TOBY" b="ORIGIN" sa={100} sb={124} align="left" /></div>
  </AbsoluteFill>
);
