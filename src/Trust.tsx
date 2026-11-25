import React from 'react';
import { LightSet, LIGHT_NIGHT, LIGHT_INTERIOR, LIGHT_EMBER, RED, Patch } from './Paint';
import { RoomDefs, PAL_NIGHT, Far, Floor, Dust, LightPool, NightMask } from './kits/Interior';
import type { RoomPal } from './kits/Interior';
import { BloodDefs } from './kits/Blood';
import { Creature, CreatureBust, anchors } from './kits/Monster';
import type { CreatureSpec, CProps, CPose } from './kits/Monster';
import type { XY } from './Rig';
// ===== STORY KIT: "You Can't Trust Everyone" (look kit "l2").
// Present-day US college + a winter pine clearing. Cold slate-blue + charcoal, warm sodium-amber indoor light,
// one red accent (the apartment lamp / exit sign / police light). The signature horror colour is BLACK TAR, not red.
// Cast (Specs): Ethan = sam, Jack = noah, Elisa = mira, Officer Reyes = dale. Antagonist = MASKC ("mask").
export const W = 1920, H = 1080;
export const FLOOR = 858;

export const PAL: RoomPal = { ...PAL_NIGHT, wall: '#3b4350', wallInk: '#4c586a', wallD: '#1a1f28', trim: '#2a3038', floor: '#3a332e', floorD: '#1b1712', wood: '#5a4636', woodD: '#2e241c', quiltA: '#4a5666', quiltB: '#394152', quiltC: '#6a7686', sheet: '#c6ccd6', light: '#ffe6b8', night: '#0c1018' };
export const PAL_WOOD: RoomPal = { ...PAL, wall: '#2e2a26', wallInk: '#3c3630', wallD: '#15120f', trim: '#241f1a', floor: '#2a221c', floorD: '#140f0b' };

export const LIGHT_COLD = { ...LIGHT_NIGHT, keyC: '#cfe0ff', keyA: 0.16, shade: '#3a4660', shadeA: 0.92, rim: '#9fc0ff', rimA: 0.85, line: 0.7 };
export const LIGHT_WARM = { ...LIGHT_INTERIOR, keyC: '#ffe6b8', keyA: 0.3, shade: '#44405a', shadeA: 0.86, rim: '#ffc880', rimA: 0.9, line: 0.62 };
export const LIGHT_MOON = { ...LIGHT_NIGHT, keyC: '#bcd2ff', keyA: 0.17, shade: '#2e3a5a', shadeA: 0.95, rim: '#8fb8ff', rimA: 0.9, line: 0.72 };
export const LIGHT_CANDLE = { ...LIGHT_EMBER, keyC: '#ffcf94', keyA: 0.3, shade: '#34304e', shadeA: 0.92, rim: '#ff9a4a', rimA: 0.92, line: 0.66 };

export const Defs: React.FC = () => <><RoomDefs P={PAL} id="rm" /><RoomDefs P={PAL_WOOD} id="wd" /><BloodDefs /></>;

const cl = (v: number) => Math.max(0, Math.min(1, v));
export const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };

// ===== THE ANTAGONIST: "mask" — what is left of Jack after the ritual. One design, one spec, imported everywhere.
export const MASKC: CreatureSpec = { id: 'mask', skin: '#b7bdc4', hunch: 0.18, armL: 1.1, fingerL: 1.3, legL: 0.96, thin: 0.68, eyes: 'black', mouth: 'slit', jawW: 1.0, veins: true, ribs: false, spine: true, wet: 0.9, claws: '#120f16', hair: 'none' };

// the cracked pale-BLUE ritual mask (two holes show the black sockets; a thin mouth slit; a crack). Reads clearly as a mask.
export const BlueMask: React.FC<{ cx: number; cy: number; r: number; rot?: number; o?: number }> = ({ cx, cy, r, rot = 0, o = 1 }) => (
  <g transform={`translate(${cx},${cy}) rotate(${rot}) scale(${r / 100})`} opacity={o}>
    <path d="M-76,-100 C-104,-28 -90,82 -36,130 C-12,152 12,152 36,130 C90,82 104,-28 76,-100 C42,-126 -42,-126 -76,-100Z" fill="#6f93c8" stroke="#2c3a54" strokeWidth={8} />
    <path d="M-76,-100 C-42,-122 42,-122 76,-100 C72,-70 -72,-70 -76,-100Z" fill="#9db9df" opacity={0.85} />
    <path d="M-62,6 C-48,-54 48,-54 62,6 C48,34 -48,34 -62,6Z" fill="#567" opacity={0.3} />
    <ellipse cx={-36} cy={-14} rx={27} ry={34} fill="#05060a" /><ellipse cx={-30} cy={-22} rx={8} ry={10} fill="#1a2740" opacity={0.6} />
    <ellipse cx={36} cy={-14} rx={27} ry={34} fill="#05060a" /><ellipse cx={42} cy={-22} rx={8} ry={10} fill="#1a2740" opacity={0.6} />
    <path d="M-22,84 Q0,100 22,84" stroke="#0c0a12" strokeWidth={12} fill="none" strokeLinecap="round" />
    <path d="M14,-116 L2,-20 L22,70 L8,128" stroke="#20304a" strokeWidth={5} fill="none" opacity={0.9} />
    <path d="M-10,-116 L-2,-60" stroke="#20304a" strokeWidth={3} fill="none" opacity={0.7} />
    <path d="M-54,-44 C-32,-66 32,-66 56,-42" stroke="#cfe0f2" strokeWidth={5} fill="none" opacity={0.6} />
  </g>
);

// black tar running from a point (the torn eye sockets)
export const BlackTears: React.FC<{ x: number; y: number; k?: number; f: number; n?: number; o?: number }> = ({ x, y, k = 1, f, n = 4, o = 1 }) => (
  <g opacity={o}>
    {Array.from({ length: n }).map((_, i) => {
      const ox = (i - (n - 1) / 2) * 34 * k; const len = (160 + ((i * 53) % 90)) * k + Math.sin(f / 20 + i) * 8 * k;
      return <path key={i} d={`M${x + ox},${y} q${6 * k},${len * 0.5} ${2 * k},${len} q${-4 * k},${18 * k} ${-10 * k},${6 * k}`} stroke="#060608" strokeWidth={10 * k} fill="none" strokeLinecap="round" />;
    })}
    <ellipse cx={x} cy={y + 8 * k} rx={34 * k} ry={14 * k} fill="#060608" opacity={0.8} />
  </g>
);

// black tendrils rising from the ground like weeds
export const Tendrils: React.FC<{ x: number; y: number; f: number; n?: number; h?: number; k?: number; o?: number; grow?: number }> = ({ x, y, f, n = 7, h = 520, k = 1, o = 0.95, grow = 1 }) => (
  <g opacity={o}>
    {Array.from({ length: n }).map((_, i) => {
      const ox = (i - (n - 1) / 2) * 84 * k; const sway = Math.sin(f / 22 + i * 1.3) * 60 * k;
      const hh = h * k * grow * (0.7 + ((i * 37) % 30) / 100);
      const d = `M${x + ox},${y} C${x + ox - 40 * k},${y - hh * 0.4} ${x + ox + sway * 0.5},${y - hh * 0.72} ${x + ox + sway},${y - hh}`;
      return <path key={i} d={d} stroke="#070608" strokeWidth={(26 - i % 3 * 6) * k} fill="none" strokeLinecap="round" />;
    })}
  </g>
);

// full-body antagonist (side view so the silhouette and the mask read clearly). tar 0..1, free = loose vs bound.
export const MaskThing: React.FC<{ x: number; y: number; k: number; f: number; face?: 1 | -1; pose?: CPose; p?: number; tar?: number; free?: boolean; tendrils?: number }> = ({ x, y, k, f, face = 1, pose = 'stand', p = 1, tar = 0.6, free = true, tendrils = 0 }) => {
  const pr: CProps = { c: MASKC, x, y, k, f, view: 'side', face, pose, p, jaw: free ? 0.45 : 0.12, shadow: true };
  const A = anchors(pr);
  const head = A.head, eye = A.eye, mouth = A.mouth;
  const cx = (eye[0] + mouth[0]) / 2 * 0.5 + (head[0] + mouth[0]) / 2 * 0.5, cy = (eye[1] + mouth[1]) / 2 * 0.5 + (head[1] + mouth[1]) / 2 * 0.5;
  const hh = Math.hypot(mouth[0] - head[0], mouth[1] - head[1]);
  const rot = Math.atan2(mouth[1] - head[1], mouth[0] - head[0]) * 180 / Math.PI - 90;
  return (
    <g>
      {tendrils > 0 && <Tendrils x={x} y={y} f={f} k={k * 2.6} grow={tendrils} o={0.9} />}
      <Creature {...pr} />
      {/* Jack's dark messy hair over the crown, then the cracked blue mask over the face */}
      <ellipse cx={head[0]} cy={head[1]} rx={hh * 0.34} ry={hh * 0.26} fill="#141016" transform={`rotate(${rot} ${head[0]} ${head[1]})`} />
      <BlueMask cx={cx} cy={cy} r={hh * 0.56} rot={rot} o={0.97} />
      <BlackTears x={cx - hh * 0.2} y={cy - hh * 0.06} k={k * 2.0} f={f} n={2} o={0.6 + 0.4 * tar} />
      <BlackTears x={cx + hh * 0.2} y={cy - hh * 0.06} k={k * 2.0} f={f + 6} n={2} o={0.6 + 0.4 * tar} />
      {tendrils > 0 && <Tendrils x={x} y={y} f={f + 11} n={4} k={k * 2.2} grow={tendrils} o={0.55} />}
    </g>
  );
};

// chest-up antagonist for a close shot. Drawn at the transform the set applies; mask centred on the bust head.
export const MaskBust: React.FC<{ f: number; tar?: number; jaw?: number }> = ({ f, tar = 0.7, jaw = 0.4 }) => (
  <g>
    <CreatureBust c={MASKC} f={f} jaw={jaw} />
    <BlueMask cx={0} cy={-150} r={300} o={0.96} />
    <BlackTears x={-70} y={-150} k={2.1} f={f} n={2} o={0.6 + 0.4 * tar} />
    <BlackTears x={70} y={-150} k={2.1} f={f + 7} n={2} o={0.6 + 0.4 * tar} />
  </g>
);

// a robed cultist: long black robe, hood, pale-blue mask. Faces f for a slow sway. Bodies hidden by the robe (readable, non-gory).
export const Robed: React.FC<{ x: number; y: number; k: number; f: number; seed?: number; bow?: number; arms?: boolean }> = ({ x, y, k, f, seed = 0, bow = 0, arms = false }) => {
  const sway = Math.sin(f / 40 + seed) * 10 * k; const lean = bow * 70 * k;
  const topY = y - 1360 * k; const headY = topY - 150 * k;
  return (
    <g transform={`translate(${sway},0)`}>
      {/* robe */}
      <path d={`M${x - 300 * k},${y} C${x - 250 * k},${y - 900 * k} ${x - 140 * k},${topY + 80 * k} ${x - 120 * k + lean},${topY} L${x + 120 * k + lean},${topY} C${x + 140 * k},${topY + 80 * k} ${x + 250 * k},${y - 900 * k} ${x + 300 * k},${y} Z`} fill="#0c0d12" stroke="#1c1e26" strokeWidth={6 * k} />
      <path d={`M${x + lean},${topY + 40 * k} L${x - 30 * k},${y} M${x + lean},${topY + 40 * k} L${x + 30 * k},${y}`} stroke="#060608" strokeWidth={10 * k} opacity={0.5} />
      {arms && <path d={`M${x - 90 * k + lean},${topY + 150 * k} Q${x - 320 * k},${topY + 280 * k} ${x - 300 * k},${topY + 520 * k}`} stroke="#0c0d12" strokeWidth={70 * k} fill="none" strokeLinecap="round" />}
      {/* hood */}
      <path d={`M${x - 150 * k + lean},${topY + 60 * k} C${x - 170 * k + lean},${headY - 40 * k} ${x + 170 * k + lean},${headY - 40 * k} ${x + 150 * k + lean},${topY + 60 * k} Z`} fill="#0a0b10" stroke="#1c1e26" strokeWidth={6 * k} />
      {/* mask inside the hood */}
      <BlueMask cx={x + lean} cy={headY + 60 * k} r={82 * k} o={0.95} />
    </g>
  );
};

// a small warm lantern / candle on the frost
export const Lantern: React.FC<{ x: number; y: number; f: number; k?: number }> = ({ x, y, f, k = 1 }) => {
  const fl = 0.8 + 0.2 * Math.sin(f / 5 + x);
  return (
    <g>
      <ellipse cx={x} cy={y} rx={130 * k} ry={46 * k} fill="#ff9a4a" opacity={0.18 * fl} />
      <rect x={x - 22 * k} y={y - 60 * k} width={44 * k} height={60 * k} rx={6 * k} fill="#14110c" stroke="#3a2c18" strokeWidth={3 * k} />
      <ellipse cx={x} cy={y - 34 * k} rx={14 * k} ry={20 * k} fill="#ffd27a" opacity={fl} />
    </g>
  );
};

// a torn spiral-notebook page (the student's confession note) — used for the chapter + credit cards
export const NotebookPage: React.FC<{ w: number; h: number; red?: boolean }> = ({ w, h, red = true }) => (
  <g>
    <rect x={0} y={0} width={w} height={h} fill="#e9e6da" stroke="#b7b2a2" strokeWidth={4} />
    <rect x={0} y={0} width={w} height={h} fill="url(#rm-paper)" opacity={0.0} />
    {Array.from({ length: Math.floor(h / (h / 9)) }).map((_, i) => <path key={i} d={`M${w * 0.1},${(h / 9) * (i + 1)} H${w * 0.94}`} stroke="#aab6c4" strokeWidth={1.5} opacity={0.7} />)}
    {red && <path d={`M${w * 0.1},0 V${h}`} stroke="#c23a2e" strokeWidth={3} opacity={0.8} />}
    {Array.from({ length: 11 }).map((_, i) => <circle key={i} cx={w * 0.05} cy={h * (0.06 + i * 0.088)} r={h * 0.016} fill="#0c0d12" opacity={0.5} />)}
  </g>
);

// shorthand light wrappers
export const Cold: React.FC<{ children: React.ReactNode }> = ({ children }) => <LightSet {...LIGHT_COLD}>{children}</LightSet>;
export const Warm: React.FC<{ children: React.ReactNode }> = ({ children }) => <LightSet {...LIGHT_WARM}>{children}</LightSet>;
export const Moon: React.FC<{ children: React.ReactNode }> = ({ children }) => <LightSet {...LIGHT_MOON}>{children}</LightSet>;
export const Candle: React.FC<{ children: React.ReactNode }> = ({ children }) => <LightSet {...LIGHT_CANDLE}>{children}</LightSet>;

export { Far, Floor, Dust, LightPool, NightMask, Patch, RED };
export type { XY };
