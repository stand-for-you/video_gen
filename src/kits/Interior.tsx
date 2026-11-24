import React from 'react';
import { rng } from '../Kit';
// ===== SCROLL KAOS INTERIOR KIT (v0.4): DETAILED rooms. A room is never a flat colour with one object.
// Checklist for every room shot: wall texture (wallpaper / panels + stains + seams), skirting board, floor with planks in
// perspective, at least 3 props with their own shading, one motivated light source (window moon, lamp, door gap) with a light
// shaft or light pool, contact shadows under every object, floating dust in the light, and depth (blur the far layer with <Far>).
// Scene units = pixels of the 1920x1080 (or 1080x1920) frame. All motion smooth (f = 1/30 s).
const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export type RoomPal = { wall: string; wallInk: string; wallD: string; trim: string; floor: string; floorD: string; wood: string; woodD: string; quiltA: string; quiltB: string; quiltC: string; sheet: string; light: string; night: string };
export const PAL_NIGHT: RoomPal = { wall: '#3c4352', wallInk: '#4c5466', wallD: '#1c2029', trim: '#2a2e38', floor: '#3a2e28', floorD: '#1e1712', wood: '#5a4030', woodD: '#2a1c14', quiltA: '#6a4a5a', quiltB: '#46506a', quiltC: '#7a6a52', sheet: '#c8cbd2', light: '#cfe0ff', night: '#0b1020' };

export const RoomDefs: React.FC<{ P?: RoomPal; id?: string }> = ({ P = PAL_NIGHT, id = 'rm' }) => (
  <defs>
    <pattern id={`${id}-damask`} width={120} height={160} patternUnits="userSpaceOnUse">
      <rect width={120} height={160} fill={P.wall} />
      <path d="M60,10 C80,30 90,50 60,80 C30,50 40,30 60,10Z M60,80 C80,100 90,130 60,150 C30,130 40,100 60,80Z" fill={P.wallInk} />
      <path d="M0,80 C20,70 30,60 20,40 M120,80 C100,70 90,60 100,40" stroke={P.wallInk} strokeWidth={6} fill="none" />
      <circle cx={0} cy={0} r={10} fill={P.wallInk} /><circle cx={120} cy={160} r={10} fill={P.wallInk} /><circle cx={0} cy={160} r={10} fill={P.wallInk} /><circle cx={120} cy={0} r={10} fill={P.wallInk} />
    </pattern>
    <pattern id={`${id}-stripe`} width={90} height={10} patternUnits="userSpaceOnUse"><rect width={90} height={10} fill={P.wall} /><rect x={0} width={26} height={10} fill={P.wallInk} /><rect x={34} width={4} height={10} fill={P.wallInk} /></pattern>
    <pattern id={`${id}-quilt`} width={160} height={160} patternUnits="userSpaceOnUse">
      <rect width={80} height={80} fill={P.quiltA} /><rect x={80} width={80} height={80} fill={P.quiltB} /><rect y={80} width={80} height={80} fill={P.quiltC} /><rect x={80} y={80} width={80} height={80} fill={P.quiltA} />
      <path d="M40,8 L72,40 L40,72 L8,40Z" fill="#000" opacity={0.12} /><path d="M120,88 L152,120 L120,152 L88,120Z" fill="#fff" opacity={0.08} />
      <path d="M0,80 H160 M80,0 V160" stroke="#f0e6d0" strokeWidth={2.5} strokeDasharray="7 6" opacity={0.55} />
    </pattern>
    <filter id={`${id}-b2`} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation={2} /></filter>
    <filter id={`${id}-b5`} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation={5} /></filter>
    <filter id={`${id}-b14`} x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation={14} /></filter>
    <filter id={`${id}-b40`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={40} /></filter>
    <linearGradient id={`${id}-shaft`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={P.light} stopOpacity="0.32" /><stop offset="1" stopColor={P.light} stopOpacity="0.02" /></linearGradient>
    <radialGradient id={`${id}-pool`}><stop offset="0" stopColor={P.light} stopOpacity="0.4" /><stop offset="1" stopColor={P.light} stopOpacity="0" /></radialGradient>
    <radialGradient id={`${id}-softD`}><stop offset="0" stopColor={P.wallD} stopOpacity="1" /><stop offset="0.6" stopColor={P.wallD} stopOpacity="0.5" /><stop offset="1" stopColor={P.wallD} stopOpacity="0" /></radialGradient>
    <radialGradient id={`${id}-softL`}><stop offset="0" stopColor={P.light} stopOpacity="1" /><stop offset="0.5" stopColor={P.light} stopOpacity="0.4" /><stop offset="1" stopColor={P.light} stopOpacity="0" /></radialGradient>
    <linearGradient id={`${id}-ceil`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#000" stopOpacity="0.55" /><stop offset="1" stopColor="#000" stopOpacity="0" /></linearGradient>
    <radialGradient id={`${id}-lamp`}><stop offset="0" stopColor="#ffd690" stopOpacity="0.85" /><stop offset="0.4" stopColor="#ff9a40" stopOpacity="0.25" /><stop offset="1" stopColor="#ff9a40" stopOpacity="0" /></radialGradient>
  </defs>
);

// depth of field: blur the far layer (b in px). Use for the back wall when a person or creature is in the foreground.
export const Far: React.FC<{ b?: number; children: React.ReactNode; o?: number }> = ({ b = 3, children, o }) => (
  <g opacity={o}><defs><filter id={`far-${b}`} x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation={b} /></filter></defs><g filter={`url(#far-${b})`}>{children}</g></g>
);

// ---------- WALL: wallpaper (damask | stripe | plain) + age stains + seams + a darker top (ceiling shadow)
export const Wall: React.FC<{ x: number; y: number; w: number; h: number; P?: RoomPal; kind?: 'damask' | 'stripe' | 'plain'; seed?: number; id?: string; stains?: number }> = ({ x, y, w, h, P = PAL_NIGHT, kind = 'damask', seed = 3, id = 'rm', stains = 1 }) => {
  const q = rng(seed);
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={kind === 'plain' ? P.wall : `url(#${id}-${kind})`} />
      {Array.from({ length: Math.ceil(w / 260) }).map((_, i) => <path key={i} d={`M${x + i * 260 + 30},${y} V${y + h}`} stroke={P.wallD} strokeWidth={2} opacity={0.4} />)}
      {Array.from({ length: Math.round(5 * stains) }).map((_, i) => <ellipse key={i} cx={x + q() * w} cy={y + q() * h * 0.8} rx={80 + q() * 180} ry={60 + q() * 140} fill={`url(#${id}-softD)`} opacity={0.25 + q() * 0.2} />)}
      <rect x={x} y={y} width={w} height={h * 0.4} fill={`url(#${id}-ceil)`} opacity={0.7} />
      {/* peeling corner on one seam */}
      <path d={`M${x + 290},${y + h * 0.2} l40,6 l-18,40 Z`} fill={P.wallInk} opacity={0.6} /><path d={`M${x + 290},${y + h * 0.2} l40,6`} stroke="#000" strokeWidth={2} opacity={0.4} />
    </g>
  );
};
// ---------- SKIRTING + FLOOR planks converging to a vanishing point (vx). floorY = where the wall meets the floor.
export const Floor: React.FC<{ W: number; floorY: number; H: number; vx?: number; P?: RoomPal; id?: string; planks?: number }> = ({ W, floorY, H, vx, P = PAL_NIGHT, id = 'rm', planks = 16 }) => {
  const cx = vx ?? W / 2; const depth = H - floorY;
  return (
    <g>
      <rect x={-200} y={floorY} width={W + 400} height={depth + 200} fill={P.floor} />
      {Array.from({ length: planks + 1 }).map((_, i) => { const t = i / planks; const xb = -W * 0.6 + t * W * 2.2; const xt = cx + (xb - cx) * 0.35; return <path key={i} d={`M${xt},${floorY} L${xb},${H + 200}`} stroke={P.floorD} strokeWidth={3} opacity={0.7} />; })}
      {Array.from({ length: 6 }).map((_, i) => { const yy = floorY + depth * Math.pow((i + 1) / 7, 1.6); return <path key={i} d={`M-200,${yy} H${W + 200}`} stroke={P.floorD} strokeWidth={2} opacity={0.35} strokeDasharray={`${160 + i * 40} ${90 + i * 30}`} />; })}
      <rect x={-200} y={floorY} width={W + 400} height={depth * 0.35} fill={`url(#${id}-ceil)`} opacity={0.5} />
      <rect x={-200} y={floorY - 34} width={W + 400} height={36} fill={P.trim} /><rect x={-200} y={floorY - 34} width={W + 400} height={5} fill="#fff" opacity={0.08} /><rect x={-200} y={floorY - 2} width={W + 400} height={6} fill="#000" opacity={0.45} />
    </g>
  );
};
export const Rug: React.FC<{ x: number; y: number; w: number; h: number; c?: string; c2?: string }> = ({ x, y, w, h, c = '#5a2a2c', c2 = '#c8a46a' }) => (
  <g><ellipse cx={x} cy={y} rx={w / 2 + 10} ry={h / 2 + 6} fill="#000" opacity={0.35} /><ellipse cx={x} cy={y} rx={w / 2} ry={h / 2} fill={c} /><ellipse cx={x} cy={y} rx={w / 2 - 22} ry={h / 2 - 10} fill="none" stroke={c2} strokeWidth={5} strokeDasharray="18 10" opacity={0.6} /><ellipse cx={x} cy={y} rx={w / 3} ry={h / 3.2} fill="none" stroke={c2} strokeWidth={3} opacity={0.4} /></g>
);

// ---------- WINDOW with night outside (moon, tree branches), glass reflections, curtains that sway, sill, and a moonlight shaft
export const Window: React.FC<{ x: number; y: number; w: number; h: number; f: number; P?: RoomPal; id?: string; moon?: boolean; curtains?: boolean; shaft?: [number, number, number] | null; wind?: number; outside?: React.ReactNode }> = ({ x, y, w, h, f, P = PAL_NIGHT, id = 'rm', moon = true, curtains = true, shaft = null, wind = 1, outside }) => {
  const sway = Math.sin(f / 50) * 10 * wind + Math.sin(f / 23) * 3 * wind;
  return (
    <g>
      {shaft && <g style={{ mixBlendMode: 'screen' as const }}><path d={`M${x + 20},${y + h} L${x + w - 20},${y + h} L${shaft[0] + shaft[2] / 2},${shaft[1]} L${shaft[0] - shaft[2] / 2},${shaft[1]}Z`} fill={`url(#${id}-shaft)`} /><ellipse cx={shaft[0]} cy={shaft[1]} rx={shaft[2] * 0.55} ry={shaft[2] * 0.12} fill={`url(#${id}-pool)`} /></g>}
      <rect x={x - 26} y={y - 26} width={w + 52} height={h + 52} fill={P.trim} /><rect x={x - 26} y={y - 26} width={w + 52} height={8} fill="#fff" opacity={0.1} />
      <defs><clipPath id={`${id}-win`}><rect x={x} y={y} width={w} height={h} /></clipPath><linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0a1226" /><stop offset="1" stopColor="#2a3a5a" /></linearGradient></defs>
      <g clipPath={`url(#${id}-win)`}>
        <rect x={x} y={y} width={w} height={h} fill={`url(#${id}-sky)`} />
        {moon && <g><circle cx={x + w * 0.68} cy={y + h * 0.28} r={w * 0.3} fill={P.light} opacity={0.12} /><circle cx={x + w * 0.68} cy={y + h * 0.28} r={w * 0.11} fill="#eef2f8" /><circle cx={x + w * 0.64} cy={y + h * 0.26} r={w * 0.025} fill="#c8ccd6" /></g>}
        {outside}
        <path d={`M${x - 10},${y + h * 0.75} C${x + w * 0.2},${y + h * 0.6} ${x + w * 0.3},${y + h * 0.45 + sway * 0.6} ${x + w * 0.55},${y + h * 0.4 + sway} M${x + w * 0.25},${y + h * 0.64} C${x + w * 0.32},${y + h * 0.5} ${x + w * 0.2},${y + h * 0.35} ${x + w * 0.24},${y + h * 0.2 + sway * 0.5}`} stroke="#06080e" strokeWidth={9} fill="none" />
        <rect x={x} y={y} width={w} height={h} fill="#9ab0d0" opacity={0.06} />
        <path d={`M${x + w * 0.1},${y + h} L${x + w * 0.45},${y} L${x + w * 0.55},${y} L${x + w * 0.2},${y + h}Z`} fill="#fff" opacity={0.05} />
      </g>
      <path d={`M${x + w / 2},${y} V${y + h} M${x},${y + h / 2} H${x + w}`} stroke={P.trim} strokeWidth={14} />
      <rect x={x - 46} y={y + h + 20} width={w + 92} height={22} fill={P.trim} /><rect x={x - 46} y={y + h + 42} width={w + 92} height={10} fill="#000" opacity={0.4} />
      {curtains && [-1, 1].map((q) => { const cx0 = q < 0 ? x - 40 : x + w + 40; const cw = w * 0.32; const ins = q < 0 ? 1 : -1; const s = sway * (q < 0 ? 1 : 0.8); return (
        <g key={q}>
          <path d={`M${cx0 - ins * 30},${y - 60} L${cx0 + ins * cw},${y - 60} C${cx0 + ins * (cw * 0.8 + s)},${y + h * 0.4} ${cx0 + ins * (cw * 0.5 + s * 1.4)},${y + h * 0.8} ${cx0 + ins * (cw * 0.62 + s * 1.6)},${y + h + 90} L${cx0 - ins * 30},${y + h + 90}Z`} fill="#4a3446" />
          {[0.2, 0.45, 0.7].map((t, i) => <path key={i} d={`M${cx0 + ins * cw * t},${y - 56} C${cx0 + ins * (cw * t * 0.9 + s * 0.5)},${y + h * 0.4} ${cx0 + ins * (cw * t * 0.7 + s)},${y + h * 0.8} ${cx0 + ins * (cw * t * 0.8 + s * 1.2)},${y + h + 86}`} stroke={i % 2 ? '#2a1c28' : '#6a4c62'} strokeWidth={i % 2 ? 14 : 8} fill="none" opacity={0.7} />)}
        </g>); })}
      <rect x={x - 80} y={y - 76} width={w + 160} height={14} rx={7} fill={P.woodD} />
    </g>
  );
};

// ---------- DOOR (front elevation). open 0..1 swings inward (dark gap grows), light = colour behind the door (hall light) or null
export const Door: React.FC<{ x: number; y: number; w?: number; h?: number; open?: number; P?: RoomPal; light?: string | null; id?: string; inside?: React.ReactNode; f?: number }> = ({ x, y, w = 360, h = 760, open = 0, P = PAL_NIGHT, light = null, id = 'rm', inside }) => {
  const gap = w * clamp(open);
  return (
    <g>
      <rect x={x - 34} y={y - h - 34} width={w + 68} height={h + 34} fill={P.trim} /><rect x={x - 34} y={y - h - 34} width={w + 68} height={8} fill="#fff" opacity={0.08} />
      <defs><clipPath id={`${id}-dg`}><rect x={x} y={y - h} width={w} height={h} /></clipPath></defs>
      <g clipPath={`url(#${id}-dg)`}>
        <rect x={x} y={y - h} width={w} height={h} fill={light ? light : '#040408'} />
        {light && <rect x={x} y={y - h} width={w} height={h} fill="#000" opacity={0.25} />}
        {inside}
        {/* the door leaf swings in: drawn as a narrowing panel on the hinge side */}
        <g transform={`translate(${x + w},${y - h})`}>
          <path d={`M0,0 L${-(w - gap)},${open * 30} L${-(w - gap)},${h - open * 30} L0,${h}Z`} fill={P.wood} />
          <path d={`M-30,40 L${-(w - gap) + 30},${open * 30 + 40} L${-(w - gap) + 30},${h * 0.45} L-30,${h * 0.45}Z M-30,${h * 0.52} L${-(w - gap) + 30},${h * 0.52} L${-(w - gap) + 30},${h - open * 30 - 40} L-30,${h - 40}Z`} fill={P.woodD} opacity={0.5} />
          <circle cx={-(w - gap) + 36} cy={h * 0.5} r={13} fill="#b89a5a" /><circle cx={-(w - gap) + 33} cy={h * 0.5 - 3} r={4} fill="#fff" opacity={0.5} />
          <path d={`M${-(w - gap)},${open * 30} V${h - open * 30}`} stroke="#000" strokeWidth={5} opacity={0.5} />
        </g>
      </g>
      {light && open < 0.05 && <rect x={x} y={y - 6} width={w} height={6} fill={light} opacity={0.9} />}
      {light && <g style={{ mixBlendMode: 'screen' as const }}><path d={`M${x + w - gap},${y} L${x + w},${y} L${x + w + 160 + gap * 1.6},${y + 260} L${x + w - gap * 0.4 - 40},${y + 260}Z`} fill={light} opacity={0.18 * clamp(open * 3)} filter={`url(#${id}-b5)`} /></g>}
    </g>
  );
};

// ---------- PICTURE FRAME on the wall (portrait / landscape), optional crooked angle
export const PictureFrame: React.FC<{ x: number; y: number; w: number; h: number; rot?: number; P?: RoomPal; children?: React.ReactNode; id?: string }> = ({ x, y, w, h, rot = 0, P = PAL_NIGHT, children, id = 'pf' }) => (
  <g transform={`rotate(${rot} ${x + w / 2} ${y})`}>
    <path d={`M${x + w / 2},${y - 40} L${x + 10},${y} M${x + w / 2},${y - 40} L${x + w - 10},${y}`} stroke="#000" strokeWidth={2} opacity={0.6} />
    <rect x={x + 8} y={y + 10} width={w} height={h} fill="#000" opacity={0.4} />
    <rect x={x} y={y} width={w} height={h} fill={P.woodD} /><rect x={x + 14} y={y + 14} width={w - 28} height={h - 28} fill="#2a2a30" />
    <defs><clipPath id={`${id}-c`}><rect x={x + 14} y={y + 14} width={w - 28} height={h - 28} /></clipPath></defs>
    <g clipPath={`url(#${id}-c)`}>{children}<path d={`M${x},${y + h} L${x + w * 0.5},${y} L${x + w * 0.62},${y} L${x + w * 0.12},${y + h}Z`} fill="#fff" opacity={0.07} /></g>
    <rect x={x} y={y} width={w} height={6} fill="#fff" opacity={0.12} />
  </g>
);

// ---------- NIGHTSTAND with drawer, lamp (on/off), alarm clock (red digits) and a glass of water
export const Nightstand: React.FC<{ x: number; y: number; s?: number; lamp?: boolean; time?: string; P?: RoomPal; id?: string; f?: number }> = ({ x, y, s = 1, lamp = false, time = '3:07', P = PAL_NIGHT, id = 'rm', f = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {lamp && <circle cx={-10} cy={-470} r={420} fill={`url(#${id}-lamp)`} opacity={0.85 + 0.08 * Math.sin(f / 9)} />}
    <ellipse cx={0} cy={4} rx={190} ry={18} fill="#000" opacity={0.5} />
    <rect x={-170} y={-330} width={340} height={330} fill={P.wood} /><rect x={-180} y={-346} width={360} height={26} fill={P.woodD} /><rect x={-180} y={-346} width={360} height={5} fill="#fff" opacity={0.12} />
    <rect x={-140} y={-290} width={280} height={110} fill={P.woodD} opacity={0.45} /><rect x={-30} y={-242} width={60} height={14} rx={7} fill="#b89a5a" />
    <rect x={-140} y={-160} width={280} height={130} fill={P.woodD} opacity={0.3} />
    <path d="M-170,-330 V0 M170,-330 V0" stroke="#000" strokeWidth={4} opacity={0.4} />
    {/* lamp */}
    <path d="M-40,-346 h60 l-10,-30 h-40Z" fill="#6a5a48" /><rect x={-14} y={-500} width={8} height={130} fill="#8a7a62" />
    <path d="M-110,-470 L90,-470 L50,-590 L-70,-590Z" fill={lamp ? '#e8c890' : '#7a6c5a'} /><path d="M-110,-470 L90,-470" stroke="#000" strokeWidth={4} opacity={0.3} />
    {lamp && <path d="M-110,-470 L90,-470 L60,-440 L-80,-440Z" fill="#fff2c0" opacity={0.6} />}
    {/* clock */}
    <rect x={60} y={-420} width={150} height={76} rx={10} fill="#141418" /><rect x={70} y={-410} width={130} height={56} rx={6} fill="#0a0406" />
    <text x={135} y={-366} textAnchor="middle" fill="#ff3a30" fontFamily="'DejaVu Sans Mono', monospace" fontWeight={700} fontSize={40}>{time}</text>
    <rect x={70} y={-410} width={130} height={56} fill="#ff3a30" opacity={0.08} />
    {/* glass of water */}
    <path d="M-150,-346 l6,-80 h40 l6,80Z" fill="#a8c0d8" opacity={0.25} /><path d="M-146,-380 h48" stroke="#cfe0ff" strokeWidth={2} opacity={0.5} /><path d="M-142,-420 l4,70" stroke="#fff" strokeWidth={3} opacity={0.35} />
  </g>
);

// ---------- BED, side view (headboard left at x, foot to the right, length w). occupant = node drawn on the mattress
// (e.g. a person lying), quilt drawn OVER it with a body-shaped bump; pillow with dents and creases.
export const Bed: React.FC<{ x: number; y: number; w?: number; s?: number; P?: RoomPal; id?: string; occupant?: React.ReactNode; bump?: number; quiltTop?: number; f?: number; stain?: React.ReactNode; flip?: boolean }> = ({ x, y, w = 1100, s = 1, P = PAL_NIGHT, id = 'rm', occupant, bump = 1, quiltTop = 0.22, f = 0, stain, flip = false }) => {
  const mt = -380; // mattress top (relative to floor y)
  const br = Math.sin(f / 40) * 6 * bump; // breathing under the quilt
  const qx0 = w * quiltTop;
  const hump = (t: number) => bump * (Math.exp(-Math.pow((t - 0.16) / 0.14, 2)) * (150 + br) + Math.exp(-Math.pow((t - 0.5) / 0.18, 2)) * 110 + Math.exp(-Math.pow((t - 0.8) / 0.07, 2)) * 80);
  const N = 30; const top = Array.from({ length: N + 1 }, (_, i) => { const t = i / N; const xx = qx0 + (w - 40 - qx0) * t; return [xx, mt - 26 - hump(t)]; });
  const quilt = `M${qx0 - 20},${mt + 40} L${top.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' L')} L${w + 30},${mt - 10} L${w + 50},${mt + 210} C${w * 0.7},${mt + 230} ${w * 0.35},${mt + 226} ${qx0 - 30},${mt + 214}Z`;
  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <ellipse cx={w / 2} cy={6} rx={w * 0.6} ry={26} fill="#000" opacity={0.5} />
      {/* frame + legs */}
      <rect x={-40} y={mt + 140} width={w + 80} height={90} fill={P.woodD} /><rect x={-20} y={mt + 220} width={40} height={-mt - 220} fill={P.woodD} /><rect x={w - 20} y={mt + 220} width={40} height={-mt - 220} fill={P.woodD} />
      {/* headboard */}
      <path d={`M-70,0 V${mt - 520} C-70,${mt - 600} 60,${mt - 600} 60,${mt - 520} V${mt + 200} H-70Z`} fill={P.wood} /><path d={`M-50,${mt - 480} V${mt + 120} M30,${mt - 480} V${mt + 120}`} stroke={P.woodD} strokeWidth={8} opacity={0.6} /><path d={`M-62,${mt - 540} C-50,${mt - 580} 40,${mt - 580} 52,${mt - 540}`} stroke="#fff" strokeWidth={4} opacity={0.12} fill="none" />
      {/* footboard */}
      <path d={`M${w - 50},0 V${mt - 160} C${w - 50},${mt - 210} ${w + 60},${mt - 210} ${w + 60},${mt - 160} V0Z`} fill={P.wood} /><path d={`M${w - 30},${mt - 140} V${mt + 160}`} stroke={P.woodD} strokeWidth={8} opacity={0.6} />
      {/* mattress + sheet */}
      <rect x={30} y={mt} width={w - 60} height={150} rx={30} fill={P.sheet} /><rect x={30} y={mt + 100} width={w - 60} height={50} rx={20} fill="#000" opacity={0.18} />
      {/* pillow */}
      <path d={`M60,${mt - 10} C50,${mt - 120} 300,${mt - 130} 330,${mt - 60} C350,${mt - 10} 320,${mt + 20} 200,${mt + 16} C120,${mt + 14} 66,${mt + 10} 60,${mt - 10}Z`} fill="#e6e2da" />
      <path d={`M90,${mt - 50} C160,${mt - 30} 240,${mt - 40} 300,${mt - 70} M140,${mt - 90} C180,${mt - 60} 210,${mt - 60} 250,${mt - 90}`} stroke="#9a96a0" strokeWidth={5} fill="none" opacity={0.5} />
      <path d={`M60,${mt - 10} C120,${mt + 8} 260,${mt + 12} 330,${mt - 30}`} stroke="#000" strokeWidth={6} opacity={0.18} fill="none" />
      {occupant}
      {/* quilt over the body: patchwork, stitching, folds that follow the body, hem shadow */}
      <path d={quilt} fill={`url(#${id}-quilt)`} />
      <path d={quilt} fill="#000" opacity={0.12} />
      {[0.12, 0.3, 0.5, 0.7, 0.88].map((t, i) => { const p = top[Math.round(t * N)]; return <path key={i} d={`M${p[0]},${p[1] + 6} C${p[0] + 20},${mt + 60} ${p[0] - 10},${mt + 140} ${p[0] + 10},${mt + 214}`} stroke="#000" strokeWidth={14} fill="none" opacity={0.18} filter={`url(#${id}-b5)`} />; })}
      {[0.22, 0.42, 0.62, 0.8].map((t, i) => { const p = top[Math.round(t * N)]; return <path key={i} d={`M${p[0] - 6},${p[1] + 10} C${p[0] + 14},${mt + 70} ${p[0] - 16},${mt + 150} ${p[0]},${mt + 210}`} stroke="#fff" strokeWidth={6} fill="none" opacity={0.08} filter={`url(#${id}-b2)`} />; })}
      <path d={`M${top[0][0]},${top[0][1]} L${top.map((p) => `${p[0].toFixed(1)},${(p[1] + 3).toFixed(1)}`).join(' L')}`} stroke={P.light} strokeWidth={6} fill="none" opacity={0.25} />
      <path d={`M${qx0 - 20},${mt + 40} C${qx0 - 30},${mt + 100} ${qx0 - 40},${mt + 160} ${qx0 - 30},${mt + 214}`} stroke="#f0e6d0" strokeWidth={22} fill="none" opacity={0.8} />
      <path d={`M${qx0 - 30},${mt + 214} C${w * 0.35},${mt + 226} ${w * 0.7},${mt + 230} ${w + 50},${mt + 210}`} stroke="#000" strokeWidth={10} fill="none" opacity={0.4} />
      {stain}
    </g>
  );
};

// ---------- floating dust in a light shaft (smooth, slow). box = x, y, w, h
export const Dust: React.FC<{ x: number; y: number; w: number; h: number; f: number; n?: number; c?: string; seed?: number; o?: number }> = ({ x, y, w, h, f, n = 40, c = '#e8eeff', seed = 9, o = 0.7 }) => {
  const q = rng(seed);
  return (<g opacity={o}>{Array.from({ length: n }).map((_, i) => { const px = q(), py = q(), sp = 0.2 + q() * 0.6, r = 1 + q() * 2.6, ph = q() * 6.28; const t = f / 30; const xx = x + ((px * w + Math.sin(t * 0.3 * sp + ph) * 30 + t * 6 * sp) % w + w) % w; const yy = y + ((py * h - t * 10 * sp) % h + h) % h; const tw = 0.5 + 0.5 * Math.sin(t * 1.3 + ph); return <circle key={i} cx={xx} cy={yy} r={r} fill={c} opacity={0.25 + 0.6 * tw} />; })}</g>);
};
// soft glow pool on the floor or a wall
export const LightPool: React.FC<{ x: number; y: number; rx: number; ry: number; c?: string; o?: number; id?: string }> = ({ x, y, rx, ry, c, o = 0.35, id = 'rm' }) => {
  const gid = c ? `lp-${c.slice(1)}` : `${id}-softL`;
  return (<g style={{ mixBlendMode: 'screen' as const }}>{c && <defs><radialGradient id={gid}><stop offset="0" stopColor={c} stopOpacity="1" /><stop offset="0.5" stopColor={c} stopOpacity="0.4" /><stop offset="1" stopColor={c} stopOpacity="0" /></radialGradient></defs>}<ellipse cx={x} cy={y} rx={rx} ry={ry} fill={`url(#${gid})`} opacity={o * 0.7} /></g>);
};
// darken everything outside a light (night): a big dark frame with a soft hole at (x, y)
export const NightMask: React.FC<{ W: number; H: number; x: number; y: number; r: number; o?: number; c?: string }> = ({ W, H, x, y, r, o = 0.55, c = '#05060c' }) => { const gid = `nm-${Math.round(x)}-${Math.round(y)}-${Math.round(r)}`; return (
  <g><defs><radialGradient id={gid} cx={x} cy={y} r={r} gradientUnits="userSpaceOnUse"><stop offset="0.25" stopColor={c} stopOpacity="0" /><stop offset="1" stopColor={c} stopOpacity={o} /></radialGradient></defs><rect x={-400} y={-400} width={W + 800} height={H + 800} fill={`url(#${gid})`} /></g>
); };
