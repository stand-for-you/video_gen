import React from 'react';
import { LightSet, LIGHT_NIGHT } from './Paint';
import { CloseUp, FullPerson, CAST, GHOSTS } from './Cast';
import { Floor, Far, RoomDefs, Dust, LightPool, NightMask, PAL_NIGHT } from './kits/Interior';
import type { RoomPal } from './kits/Interior';
import { BloodDefs } from './kits/Blood';
import { Tag } from './kits/Explain';
import { GhostWoman, GhostGrin, GhostChild } from './Body';
import type { Motion } from './Rig';
// ===== STORY KIT: "Gateway of the Mind" (look kit "lab"): a cold 1983 observation room, ash-green tile, pale fluorescent light,
// steel bed, one RED accent (the tape recorder's REC lamp and the flatline monitor). Cast: Elias Gray (subject, grey cardigan),
// Dr. Oliver and Terence (scientists), ghosts: the Long-Hair Woman (dead wife), the Grinner (dead relatives), the Drenched Child.
export const W = 1920, H = 1080;
export const FLOOR = 820;
export const PAL_LAB: RoomPal = { ...PAL_NIGHT, wall: '#5e6b68', wallInk: '#6e7c78', wallD: '#26302e', trim: '#3a4442', floor: '#4a5250', floorD: '#20282a', wood: '#6e7476', woodD: '#3c4244', quiltA: '#8a9c98', quiltB: '#6a7c80', quiltC: '#b8c4bc', sheet: '#d8e0da', light: '#dff8ec', night: '#2a3634' };
export const LIGHT_LAB = { ...LIGHT_NIGHT, keyC: '#d6fff0', keyA: 0.22, shade: '#2e4a48', shadeA: 0.9, rim: '#b8ffe6', rimA: 0.8 };
export const Defs: React.FC = () => <><RoomDefs P={PAL_LAB} /><BloodDefs /></>;
const cl = (v: number) => Math.max(0, Math.min(1, v));
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const Lit: React.FC<{ children: React.ReactNode }> = ({ children }) => <LightSet {...LIGHT_LAB}>{children}</LightSet>;

// the observation room: tiled back wall with grout lines, ceiling strip light, floor
export const LabRoom: React.FC<{ floorY?: number; wide?: number; f?: number }> = ({ floorY = FLOOR, wide = 1, f = 0 }) => {
  const tiles: React.ReactNode[] = [];
  for (let x = -300; x < W + 300; x += 150) tiles.push(<path key={'v' + x} d={`M${x},-300 V${floorY}`} stroke={PAL_LAB.wallInk} strokeWidth={3} opacity={0.5} />);
  for (let y = -300; y < floorY; y += 110) tiles.push(<path key={'h' + y} d={`M-300,${y} H${W + 300}`} stroke={PAL_LAB.wallInk} strokeWidth={3} opacity={0.45} />);
  return (
    <g>
      <Far b={3}>
        <rect x={-300} y={-300} width={W + 600} height={floorY + 300} fill={PAL_LAB.wall} />
        {tiles}
        <rect x={-300} y={floorY - 70} width={W + 600} height={70} fill={PAL_LAB.trim} opacity={0.9} />
      </Far>
      <rect x={380 * wide} y={-60} width={1160} height={30} fill="#eafff4" opacity={0.9} />
      <LightPool x={960} y={60} rx={900} ry={380} c="#d6fff0" o={0.25} />
      <Floor W={W} floorY={floorY} H={H} P={PAL_LAB} vx={W * 0.5} />
    </g>
  );
};
// observation window: a steel frame, glass with a faint tint, two moving reflection bands
export const ObsGlass: React.FC<{ x: number; y: number; w: number; h: number; f: number }> = ({ x, y, w, h, f }) => {
  const s = Math.sin(f / 60) * 0.5 + 0.5;
  return (
    <g>
      <rect x={x - 13} y={y - 13} width={w + 26} height={h + 26} fill="none" stroke="#2c3634" strokeWidth={26} />
      <rect x={x - 26} y={y - 26} width={w + 52} height={h + 52} fill="none" stroke="#1a2220" strokeWidth={6} />
      <rect x={x} y={y} width={w} height={h} fill="#e8fff6" opacity={0.08 + 0.03 * s} />
      <path d={`M${x + w * 0.18},${y} L${x + w * 0.3},${y + h} L${x + w * 0.25},${y + h} L${x + w * 0.13},${y}Z`} fill="#ffffff" opacity={0.12} />
      <path d={`M${x + w * 0.68},${y} L${x + w * 0.79},${y + h} L${x + w * 0.74},${y + h} L${x + w * 0.63},${y}Z`} fill="#ffffff" opacity={0.08} />
      <rect x={x} y={y + h - 8} width={w} height={8} fill="#6e7c78" />
    </g>
  );
};
// steel bed with straps; the subject lies face up (head toward the camera-left), head-and-shoulders CloseUp rotated flat
export const SteelBed: React.FC<{ x: number; y: number; w: number; f: number; straps?: boolean }> = ({ x, y, w, f, straps = true }) => (
  <g>
    <rect x={x} y={y} width={w} height={26} fill="#9aa6a2" stroke="#2a3230" strokeWidth={4} />
    <rect x={x + 30} y={y - 40} width={w - 60} height={44} fill="#c8d2cc" opacity={0.8} />
    <path d={`M${x + 10},${y} L${x - 40},${y + 220} M${x + w - 10},${y} L${x + w + 40},${y + 220}`} stroke="#5a6664" strokeWidth={12} />
    {straps && [0.2, 0.5, 0.8].map((q, i) => <rect key={i} x={x + w * q - 14} y={y - 42} width={28} height={70} fill="#3a4a46" opacity={0.85} />)}
  </g>
);
// the subject, head and shoulders, lying on the steel bed (turned flat, face up)
export const LyingElias: React.FC<{ x: number; y: number; k: number; f: number; expr?: 'sleepy' | 'fear' | 'speak' | 'shock' | 'sad' | 'neutral'; uid?: string }> = ({ x, y, k, f, expr = 'sleepy', uid = 'le' }) => (
  <g transform={`translate(${x},${y}) rotate(-90) scale(${k})`}>
    <LightSet {...LIGHT_LAB}><CloseUp s={CAST.elias} expr={expr} f={f} turn={0.1} uid={uid + expr} /></LightSet>
  </g>
);
// the ceiling of the lab and the glow of the tape recorder's red REC lamp
export const RecLamp: React.FC<{ x: number; y: number }> = ({ x, y }) => <g><circle cx={x} cy={y} r={14} fill="#b3221f" /><circle cx={x} cy={y} r={26} fill="#e0483c" opacity={0.25} /></g>;
export { Dust, Far, LightPool, NightMask, Tag, GhostWoman, GhostGrin, GhostChild, GHOSTS, CAST, FullPerson, CloseUp };
export type { Motion };
