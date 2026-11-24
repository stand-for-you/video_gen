import React, { useMemo } from 'react';
// Scroll Kaos Kit.tsx (permanent kit, from Project doc scroll-kaos-kit-tsx.md).
// Only the parts the permanent cast and thumbnails use are kept here; the drawing code is unchanged.
export const W = 1920, H = 1080;
export const INK = '#0b0713';
export const RED = '#b3171d';
export const st = (f: number, _n = 3) => f; // smooth (stepped motion is banned: it looked choppy)
export const ease = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t * t * (3 - 2 * t));
export const rng = (seed: number) => {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};
export const P = {
  sky0: '#0c0716', sky1: '#22123e', sky2: '#3a2260', stone0: '#2b2540', stone1: '#3a3358', stone2: '#4a4270', stone3: '#5d5586',
  roof: '#1a1430', roof2: '#2a2048', wood: '#4a3526', wood2: '#6a4b34', woodD: '#2a1d14', paper: '#d9cba3', paperD: '#a99a72', lamp: '#f2a93b', cream: '#eadfc0',
  skin: '#d9b992', skinD: '#9c7a58', ghost: '#dfe3dc', ghostD: '#9aa5a2', water: '#1a1236', fog: '#b8a8d8',
};

export const Defs: React.FC = () => (
  <defs>
    <radialGradient id="moonglow"><stop offset="0" stopColor="#f3ecd0" stopOpacity="0.95" /><stop offset="0.35" stopColor="#cfe0d8" stopOpacity="0.35" /><stop offset="1" stopColor="#cfe0d8" stopOpacity="0" /></radialGradient>
    <radialGradient id="warmglow"><stop offset="0" stopColor="#ffc15a" stopOpacity="0.95" /><stop offset="0.4" stopColor="#f08a2a" stopOpacity="0.35" /><stop offset="1" stopColor="#f08a2a" stopOpacity="0" /></radialGradient>
    <radialGradient id="redglow"><stop offset="0" stopColor="#ff3a2a" stopOpacity="0.9" /><stop offset="0.5" stopColor="#b3171d" stopOpacity="0.3" /><stop offset="1" stopColor="#b3171d" stopOpacity="0" /></radialGradient>
    <linearGradient id="fogv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b8a8d8" stopOpacity="0" /><stop offset="0.6" stopColor="#b8a8d8" stopOpacity="0.38" /><stop offset="1" stopColor="#b8a8d8" stopOpacity="0" /></linearGradient>
    <linearGradient id="nightv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0c0716" /><stop offset="0.55" stopColor="#22123e" /><stop offset="1" stopColor="#3a2260" /></linearGradient>
    <linearGradient id="dawnv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2b4a55" /><stop offset="0.7" stopColor="#8d9a8c" /><stop offset="1" stopColor="#c9b890" /></linearGradient>
    <linearGradient id="darkv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#000" stopOpacity="0.85" /><stop offset="0.5" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.75" /></linearGradient>
    <filter id="cut" x="-10%" y="-10%" width="125%" height="125%"><feDropShadow dx="3" dy="5" stdDeviation="3.2" floodColor="#000" floodOpacity="0.55" /></filter>
    <filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="14" /></filter>
    <filter id="soft2" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5" /></filter>
  </defs>
);

// dry ink hatch lines
export const Hatch: React.FC<{ x: number; y: number; w: number; h: number; angle?: number; gap?: number; seed?: number; sw?: number; op?: number; color?: string; lenF?: number }> = ({ x, y, w, h, angle = -60, gap = 10, seed = 1, sw = 2.4, op = 0.6, color = INK, lenF = 0.4 }) => {
  const lines = useMemo(() => {
    const r = rng(seed); const out: JSX.Element[] = [];
    const a = (angle * Math.PI) / 180; const dx = Math.cos(a), dy = Math.sin(a);
    const diag = Math.sqrt(w * w + h * h); const n = Math.floor(diag / gap);
    for (let i = 0; i < n; i++) {
      const off = -diag / 2 + i * gap + r() * 3;
      const cx = x + w / 2 - dy * off, cy = y + h / 2 + dx * off;
      const L = diag * (lenF * 0.5 + r() * lenF);
      const s = (r() - 0.5) * diag * 0.5;
      out.push(<line key={i} x1={cx + dx * (s - L / 2)} y1={cy + dy * (s - L / 2)} x2={cx + dx * (s + L / 2)} y2={cy + dy * (s + L / 2)} stroke={color} strokeWidth={sw * (0.6 + r() * 0.9)} strokeLinecap="round" opacity={op * (0.5 + r() * 0.5)} />);
    }
    return out;
  }, [x, y, w, h, angle, gap, seed, sw, op, color, lenF]);
  return <g>{lines}</g>;
};

// =============== hands ===============
export const Hand: React.FC<{ x: number; y: number; s?: number; rot?: number; skin?: string; shade?: string; ext?: number[]; thumb?: number; sleeve?: string; sleeveLen?: number; long?: boolean }> = ({ x, y, s = 1, rot = 0, skin = P.skin, shade = P.skinD, ext = [1, 1, 1, 1], thumb = 0.5, sleeve, sleeveLen = 120, long = false }) => {
  const fx = [-52, -18, 16, 50]; const fl = [92, 112, 106, 84]; const L = long ? 1.35 : 1;
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      {sleeve && <path d={`M-78,60 L-70,${60 + sleeveLen} H70 L78,60Z`} fill={sleeve} stroke={INK} strokeWidth={6} strokeLinejoin="round" />}
      {fx.map((q, i) => {
        const e = ext[i]; const len = fl[i] * L * (0.35 + 0.65 * e);
        return (
          <g key={i}>
            <path d={`M${q - 17},10 L${q - 15 + (i - 1.5) * 3 * e},${-len} Q${q + (i - 1.5) * 3 * e},${-len - 18} ${q + 15 + (i - 1.5) * 3 * e},${-len} L${q + 17},10Z`} fill={skin} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
            <path d={`M${q - 14},${-len * 0.55} h24`} stroke={shade} strokeWidth={2.4} />
          </g>
        );
      })}
      <path d={`M-70,0 Q-76,64 -52,88 L52,88 Q80,64 70,0 Q0,-20 -70,0Z`} fill={skin} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      <path d={`M-62,30 Q-104,${-10 - thumb * 40} -92,${-44 - thumb * 40} Q-74,${-50 - thumb * 40} -58,-6 Z`} fill={skin} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <path d="M-30,40 Q0,52 30,40" fill="none" stroke={shade} strokeWidth={2.6} opacity={0.8} />
      <Hatch x={-70} y={20} w={140} h={66} angle={-50} gap={9} seed={11} sw={2} op={0.4} />
    </g>
  );
};

export type Look = {
  id: string; skin: string; shade: string; hair: string; hairHi: string; face: 'round' | 'long' | 'square' | 'point' | 'old'; eye: 'round' | 'narrow' | 'droop' | 'sharp'; brow: number;
  hairStyle: 'curly' | 'hijab' | 'long' | 'bob' | 'crop' | 'ponytail' | 'bowl' | 'oldbun' | 'braid' | 'headband' | 'topknot' | 'wet' | 'ribbonbun' | 'baldbeard' | 'pigtail' | 'kerchief' | 'shortgrey';
  age: number; beardCol?: string; beard?: boolean; stache?: boolean; glasses?: boolean; blush?: boolean; robe: string; robeDark: string; collar: string; accent?: string; item?: 'beads' | 'bracelet' | 'comb' | 'apron' | 'ribbon' | 'headband' | 'crest' | 'scarf'; iris?: string; lip?: string;
};
