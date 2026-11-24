import React from 'react';
import { INK, rng, Hatch, Hand } from './Kit';
import { sf, taper } from './util';
// ===== Kit (j) "It's Inside Your House": storm night, lone two-storey house at the edge of the Pine Barrens (2020s).
// Palette: bruise blue-black + steel blue-grey, lightning white, sickly fluorescent bathroom light; ONE red accent = red LED light (alarm clock digits, later the car tail lights).
export const K = {
  sky0: '#070b12', sky1: '#111a28', sky2: '#22314a', cloud: '#161f2d', cloudL: '#2b3950',
  wall: '#3d4859', wallD: '#2a3340', wallL: '#4f5b6d', trim: '#8a92a0', trimD: '#5a6270',
  floor: '#3d3127', floorD: '#271e17', floorL: '#54443a', carpet: '#4a4458', carpetD: '#332f3e',
  tile: '#a7b4ae', tileD: '#7d8a86', fluo: '#e3ebcc',
  wood: '#4c3b2c', woodD: '#2c2219', woodL: '#6c5641', cab: '#4e5866', cabD: '#363e4a', counter: '#8c8f94',
  metal: '#8e959c', metalD: '#5a6068', glassC: '#9fb8c8', sheet: '#b9c0c8', sheetD: '#8a929c', blanket: '#3e4a5e', blanketD: '#2a3343',
  concrete: '#4a4d52', concreteD: '#33363a', car: '#5c6b74', carD: '#3c474e',
  red: '#ff2a1a', redD: '#b3171d', green: '#62e0a0', amber: '#ffb43a', pine: '#0c130f', pineL: '#1a281f', bolt: '#e4ecff',
};
export const R: React.FC<{ c: string; op?: number }> = ({ c, op = 1 }) => <rect x={-600} y={-600} width={3200} height={3200} fill={c} opacity={op} />;
let gid = 0;
export const Glow: React.FC<{ x: number; y: number; r: number; c?: string; op?: number; ry?: number }> = ({ x, y, r, c = '#dfe6c4', op = 0.6, ry }) => { const id = 'ig' + c.slice(1) + (gid++ % 9); return (<g><defs><radialGradient id={id}><stop offset="0" stopColor={c} stopOpacity={op} /><stop offset="1" stopColor={c} stopOpacity={0} /></radialGradient></defs><ellipse cx={x} cy={y} rx={r} ry={ry ?? r} fill={`url(#${id})`} /></g>); };
// lightning: returns flash strength for a scene frame (stepped flicker every ~5 s)
export const flash = (f: number, seed = 1, period = 150) => { const t = (sf(f, 3) + seed * 37) % period; return t < 3 ? 0.55 : t < 9 ? 0.22 : t < 12 ? 0.42 : 0; };
export const Flash: React.FC<{ f: number; seed?: number; k?: number; period?: number }> = ({ f, seed = 1, k = 1, period }) => { const a = flash(f, seed, period) * k; return a > 0 ? <rect x={-600} y={-600} width={3200} height={3200} fill={K.bolt} opacity={a * 0.5} /> : null; };
export const Bolt: React.FC<{ x: number; y: number; h: number; seed?: number; op?: number }> = ({ x, y, h, seed = 1, op = 1 }) => { const q = rng(seed); let px = x, py = y; const pts: string[] = [`${x},${y}`]; const br: string[] = []; for (let i = 0; i < 9; i++) { px += (q() - 0.5) * h * 0.22; py += h / 9; pts.push(`${px.toFixed(0)},${py.toFixed(0)}`); if (i === 3 || i === 6) br.push(`M${px},${py} l${(q() - 0.3) * h * 0.25},${h * 0.18} l${(q() - 0.5) * h * 0.1},${h * 0.12}`); } return (<g opacity={op}><path d={'M' + pts.join(' L')} stroke="#9fb8ff" strokeWidth={22} fill="none" opacity={0.35} filter="url(#soft2)" /><path d={'M' + pts.join(' L')} stroke={K.bolt} strokeWidth={6} fill="none" strokeLinejoin="round" />{br.map((d, i) => <path key={i} d={d} stroke={K.bolt} strokeWidth={3} fill="none" />)}</g>); };
export const Rain: React.FC<{ W: number; H: number; f: number; n?: number; op?: number; seed?: number; ang?: number; y0?: number }> = ({ W, H, f, n = 90, op = 0.35, seed = 2, ang = 0.35, y0 = 0 }) => { const q = rng(seed); return (<g opacity={op}>{Array.from({ length: n }).map((_, i) => { const x0 = q() * (W + 400) - 200, yy = q() * H, sp = 30 + q() * 20; const y = y0 + (yy + sf(f, 1) * sp) % H; const x = x0 + (y - y0) * ang * 0.3; return <path key={i} d={`M${x},${y} l${-26 * ang},40`} stroke="#b8c8e0" strokeWidth={2.4} />; })}</g>); };
export const Clouds: React.FC<{ W: number; y: number; f: number; c?: string; n?: number; seed?: number; s?: number }> = ({ W, y, f, c = K.cloud, n = 7, seed = 3, s = 1 }) => { const q = rng(seed); return (<g>{Array.from({ length: n }).map((_, i) => { const cx = ((q() * (W + 600) + sf(f, 3) * (0.6 + q())) % (W + 600)) - 300, cy = y + (q() - 0.5) * 120 * s, rx = (180 + q() * 220) * s, ry = (60 + q() * 50) * s; return <g key={i}><ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={c} stroke={INK} strokeWidth={5} /><ellipse cx={cx - rx * 0.4} cy={cy - ry * 0.5} rx={rx * 0.55} ry={ry * 0.8} fill={c} stroke={INK} strokeWidth={5} /><ellipse cx={cx + rx * 0.35} cy={cy - ry * 0.4} rx={rx * 0.5} ry={ry * 0.7} fill={c} /></g>; })}</g>); };
export const Sky: React.FC<{ W: number; H: number; f: number; seed?: number; bolt?: [number, number, number] | null; tone?: 'night' | 'dusk' }> = ({ W, H, f, seed = 1, bolt = null, tone = 'night' }) => {
  const a = flash(f, seed); const id = 'sky' + tone;
  return (<g><defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1">{tone === 'night' ? <><stop offset="0" stopColor={K.sky0} /><stop offset="0.6" stopColor={K.sky1} /><stop offset="1" stopColor={K.sky2} /></> : <><stop offset="0" stopColor="#1a2230" /><stop offset="0.55" stopColor="#3a4658" /><stop offset="1" stopColor="#7a7464" /></>}</linearGradient></defs>
    <rect x={-600} y={-600} width={W + 1200} height={H + 1200} fill={`url(#${id})`} />
    <Clouds W={W} y={H * 0.12} f={f} seed={seed + 3} c={tone === 'night' ? K.cloud : '#2a3344'} s={W / 1920 * 1.2} />
    <Clouds W={W} y={H * 0.28} f={f * 1.4} seed={seed + 7} c={tone === 'night' ? '#1c2636' : '#3a4456'} n={6} s={W / 1920} />
    {bolt && a > 0.3 && <Bolt x={bolt[0]} y={bolt[1]} h={bolt[2]} seed={seed + sf(f, 30)} />}
    {a > 0 && <rect x={-600} y={-600} width={W + 1200} height={H + 1200} fill={K.bolt} opacity={a * 0.35} />}
  </g>);
};
// thin, ragged Pine Barrens pitch pine. sway follows the wind.
export const PitchPine: React.FC<{ x: number; y: number; s?: number; f?: number; seed?: number; c?: string }> = ({ x, y, s = 1, f = 0, seed = 1, c = K.pine }) => {
  const q = rng(seed); const sw = Math.sin(sf(f, 3) / 8 + seed) * 4; const h = 900 + q() * 300;
  return (<g transform={`translate(${x},${y}) rotate(${sw}) scale(${s})`}>
    <path d={`M-14,0 C-10,${-h * 0.4} ${-6 + q() * 20},${-h * 0.7} 4,${-h} L10,${-h} C14,${-h * 0.6} 16,${-h * 0.3} 16,0Z`} fill={c} stroke={INK} strokeWidth={5} />
    {Array.from({ length: 7 }).map((_, i) => { const yy = -h * (0.5 + i * 0.075) + q() * 30, side = i % 2 ? 1 : -1, L = 60 + q() * 110; return <g key={i}><path d={`M0,${yy} l${side * L},${-20 - q() * 40}`} stroke={c} strokeWidth={10} strokeLinecap="round" /><ellipse cx={side * L} cy={yy - 30 - q() * 30} rx={50 + q() * 50} ry={30 + q() * 20} fill={c} stroke={INK} strokeWidth={4} /></g>; })}
    <ellipse cx={4} cy={-h - 20} rx={70} ry={50} fill={c} stroke={INK} strokeWidth={4} />
  </g>);
};
export const Barrens: React.FC<{ W: number; gy: number; f: number; s?: number; seed?: number; c?: string; gap?: number }> = ({ W, gy, f, s = 1, seed = 1, c = K.pine, gap = 110 }) => { const q = rng(seed); const n = Math.ceil((W + 400) / (gap * s)); return (<g>{Array.from({ length: n }).map((_, i) => <PitchPine key={i} x={-200 + i * gap * s + q() * 40 * s} y={gy + q() * 20 * s} s={s * (0.7 + q() * 0.5)} f={f} seed={seed * 13 + i} c={c} />)}</g>); };
// 7-segment LED digits ("2:48")
const SEG: Record<string, string> = { '0': 'abcdef', '1': 'bc', '2': 'abged', '3': 'abgcd', '4': 'fgbc', '5': 'afgcd', '6': 'afgedc', '7': 'abc', '8': 'abcdefg', '9': 'abcdfg' };
export const Seg7: React.FC<{ x: number; y: number; s?: number; t: string; c?: string; glow?: boolean }> = ({ x, y, s = 1, t, c = K.red, glow = true }) => {
  const segs: Record<string, string> = { a: 'M8,0 H52 L44,8 H16Z', b: 'M54,2 V46 L46,40 V10Z', c: 'M54,54 V98 L46,90 V60Z', d: 'M8,100 H52 L44,92 H16Z', e: 'M6,54 V98 L14,90 V60Z', f: 'M6,2 V46 L14,40 V10Z', g: 'M8,50 L14,45 H46 L52,50 L46,55 H14Z' };
  let cx = 0; const out: JSX.Element[] = [];
  t.split('').forEach((ch, i) => {
    if (ch === ':') { out.push(<g key={i}><rect x={cx + 4} y={26} width={10} height={10} fill={c} /><rect x={cx + 4} y={64} width={10} height={10} fill={c} /></g>); cx += 22; return; }
    const on = SEG[ch] || ''; out.push(<g key={i} transform={`translate(${cx},0) skewX(-6)`}>{Object.keys(segs).map((k) => <path key={k} d={segs[k]} fill={on.includes(k) ? c : '#2a0a08'} opacity={on.includes(k) ? 1 : 0.5} />)}</g>); cx += 66;
  });
  return (<g transform={`translate(${x},${y}) scale(${s})`}>{glow && <Glow x={cx / 2} y={50} r={cx * 0.75} ry={110} c="#ff3a2a" op={0.45} />}{out}</g>);
};
export const AlarmClock: React.FC<{ x: number; y: number; s?: number; t?: string }> = ({ x, y, s = 1, t = '2:48' }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-150,0 L-130,-120 Q-128,-136 -110,-136 H110 Q128,-136 130,-120 L150,0Z" fill="#141418" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    <rect x={-112} y={-118} width={224} height={92} rx={8} fill="#0a0506" stroke={INK} strokeWidth={4} />
    <Seg7 x={-96} y={-110} s={0.74} t={t} />
  </g>
);
// interior wall with diamond lattice wallpaper + wainscot + baseboard
export const Walls: React.FC<{ W: number; fy: number; c?: string; d?: string; wain?: boolean; seed?: number }> = ({ W, fy, c = K.wall, d = K.wallD, wain = true }) => (
  <g>
    <rect x={-600} y={-600} width={W + 1200} height={fy + 600} fill={c} />
    <g opacity={0.22}>{Array.from({ length: Math.ceil((W + 1200) / 90) }).map((_, i) => <path key={i} d={`M${-600 + i * 90},-600 l${fy + 600},${fy + 600} M${-600 + i * 90},-600 l${-(fy + 600)},${fy + 600}`} stroke={d} strokeWidth={4} />)}</g>
    {wain && <g><rect x={-600} y={fy - 300} width={W + 1200} height={300} fill={d} /><path d={`M-600,${fy - 300} H${W + 600}`} stroke={K.trimD} strokeWidth={14} />{Array.from({ length: Math.ceil((W + 1200) / 260) }).map((_, i) => <rect key={i} x={-560 + i * 260} y={fy - 260} width={210} height={200} fill="none" stroke={INK} strokeWidth={4} opacity={0.45} />)}</g>}
    <rect x={-600} y={fy - 34} width={W + 1200} height={34} fill={K.trimD} stroke={INK} strokeWidth={5} />
  </g>
);
export const Planks: React.FC<{ W: number; H: number; fy: number; c?: string; d?: string; seed?: number }> = ({ W, H, fy, c = K.floor, d = K.floorD, seed = 4 }) => { const q = rng(seed); const rows = 7; return (<g><rect x={-600} y={fy} width={W + 1200} height={H - fy + 600} fill={c} />{Array.from({ length: rows }).map((_, r) => { const y0 = fy + Math.pow(r / rows, 1.6) * (H - fy + 120); return <g key={r}><path d={`M-600,${y0} H${W + 600}`} stroke={d} strokeWidth={3 + r} />{Array.from({ length: 8 }).map((_, k) => { const xx = -400 + k * 330 + q() * 160; return <path key={k} d={`M${xx},${y0} v${(H - fy) / rows * (0.6 + r * 0.25)}`} stroke={d} strokeWidth={3} opacity={0.8} />; })}</g>; })}<rect x={-600} y={fy} width={W + 1200} height={40} fill="#000" opacity={0.25} /></g>); };
export const Door: React.FC<{ x: number; y: number; s?: number; open?: number; dark?: boolean; c?: string; inner?: React.ReactNode; light?: string; frame?: string }> = ({ x, y, s = 1, open = 0, c = '#6e7682', inner, light, frame = K.trim }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-150} y={-560} width={300} height={560} fill={light ?? '#05070a'} stroke={INK} strokeWidth={8} />
    {inner}
    <g transform={`translate(-150,0) scale(${Math.cos(open * 1.35)},1) translate(150,0)`}>
      <rect x={-150} y={-560} width={300} height={560} fill={c} stroke={INK} strokeWidth={8} />
      {[[-120, -520, 105, 170], [15, -520, 105, 170], [-120, -320, 105, 120], [15, -320, 105, 120], [-120, -170, 105, 140], [15, -170, 105, 140]].map((r, i) => <rect key={i} x={r[0]} y={r[1]} width={r[2]} height={r[3]} fill="none" stroke={INK} strokeWidth={5} opacity={0.55} />)}
      <circle cx={110} cy={-270} r={14} fill="#c0a060" stroke={INK} strokeWidth={4} />
      <rect x={60} y={-560} width={90} height={560} fill="#000" opacity={0.15} />
    </g>
    <path d="M-170,0 V-580 H170 V0" fill="none" stroke={frame} strokeWidth={22} />
    <path d="M-170,0 V-580 H170 V0" fill="none" stroke={INK} strokeWidth={5} />
  </g>
);
export const Blinds: React.FC<{ x: number; y: number; w: number; h: number; f: number; seed?: number; open?: number; outside?: React.ReactNode; lift?: number }> = ({ x, y, w, h, f, seed = 1, open = 0.45, outside, lift = 0 }) => {
  const id = 'bl' + seed + x; const a = flash(f, seed);
  return (<g>
    <defs><clipPath id={id}><rect x={x} y={y} width={w} height={h} /></clipPath></defs>
    <g clipPath={`url(#${id})`}>
      <rect x={x} y={y} width={w} height={h} fill={K.sky1} />
      {outside}
      <Rain W={w + x} H={h + y} f={f} n={40} op={0.4} seed={seed} />
      {a > 0.3 && <Bolt x={x + w * 0.6} y={y - 20} h={h * 0.9} seed={seed + sf(f, 30)} />}
      <rect x={x} y={y} width={w} height={h} fill={K.bolt} opacity={a * 0.6} />
      {Array.from({ length: Math.floor(h * (1 - lift) / 26) }).map((_, i) => <rect key={i} x={x} y={y + i * 26} width={w} height={26 * (1 - (lift ? 0.1 : open))} fill="#c8ccc4" stroke={INK} strokeWidth={2} opacity={0.92} />)}
      {lift > 0 && <rect x={x - 6} y={y + Math.floor(h * (1 - lift) / 26) * 26} width={w + 12} height={18} fill="#9a9e98" stroke={INK} strokeWidth={4} />}
    </g>
    <rect x={x - 14} y={y - 14} width={w + 28} height={h + 28} fill="none" stroke={K.trim} strokeWidth={22} /><rect x={x - 14} y={y - 14} width={w + 28} height={h + 28} fill="none" stroke={INK} strokeWidth={5} />
    <path d={`M${x - 30},${y + h + 14} H${x + w + 30}`} stroke={K.trim} strokeWidth={26} /><path d={`M${x - 30},${y + h + 1} H${x + w + 30} M${x - 30},${y + h + 27} H${x + w + 30}`} stroke={INK} strokeWidth={4} />
  </g>);
};
// side-view bed. state: 'made' | 'slept' | 'torn'
export const Bed: React.FC<{ x: number; y: number; s?: number; state?: string; f?: number; flip?: boolean }> = ({ x, y, s = 1, state = 'made', f = 0, flip = false }) => {
  const q = rng(17); const shake = state === 'torn' ? (sf(f, 3) % 6) - 3 : 0;
  return (<g transform={`translate(${x + shake},${y}) scale(${flip ? -s : s},${s})`}>
    <path d="M-520,0 V-420 Q-520,-470 -470,-470 H-400 Q-360,-470 -360,-420 V-230 H-520Z" fill={K.woodD} stroke={INK} strokeWidth={8} />
    <rect x={-520} y={-240} width={1060} height={120} fill={K.wood} stroke={INK} strokeWidth={8} />
    <rect x={-500} y={-120} width={40} height={120} fill={K.woodD} stroke={INK} strokeWidth={6} /><rect x={480} y={-120} width={40} height={120} fill={K.woodD} stroke={INK} strokeWidth={6} />
    <rect x={-500} y={-330} width={1010} height={100} rx={26} fill={state === 'torn' ? '#a8a69a' : K.sheet} stroke={INK} strokeWidth={7} />
    {state !== 'torn' && <path d="M-470,-340 Q-460,-410 -360,-400 Q-280,-396 -270,-340Z" fill="#d6dadf" stroke={INK} strokeWidth={6} />}
    {state === 'made' && <path d="M-260,-344 C-100,-380 300,-370 520,-344 L520,-250 C300,-240 -100,-240 -260,-250Z" fill={K.blanket} stroke={INK} strokeWidth={7} />}
    {state === 'slept' && <path d="M-300,-338 C-200,-420 -60,-430 60,-380 C200,-340 380,-380 520,-344 L530,-230 C300,-220 -100,-226 -300,-240Z" fill={K.blanket} stroke={INK} strokeWidth={7} />}
    {state === 'torn' && <g>
      {Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M${-420 + i * 105},-330 l${30 - q() * 60},${-40 - q() * 50} l${20},${40}`} stroke={INK} strokeWidth={6} fill="#6e6a5e" />)}
      {Array.from({ length: 7 }).map((_, i) => <path key={i} d={`M${-380 + i * 130},-300 q20,40 -10,80`} stroke="#2a2a2a" strokeWidth={7} fill="none" />)}
      {Array.from({ length: 6 }).map((_, i) => <circle key={i} cx={-300 + i * 150} cy={-330} r={18} fill="none" stroke={K.metal} strokeWidth={6} />)}
      {Array.from({ length: 12 }).map((_, i) => { const t = (sf(f, 3) / 30 + q()) % 1; return <ellipse key={i} cx={-400 + q() * 900} cy={-360 - t * 300} rx={26 + q() * 20} ry={18 + q() * 10} fill="#e4e2d8" stroke={INK} strokeWidth={3} opacity={1 - t} />; })}
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M${-200 + i * 180},-250 C${-170 + i * 180},-150 ${-230 + i * 180},-60 ${-190 + i * 180},20 L${-160 + i * 180},16 C${-190 + i * 180},-70 ${-140 + i * 180},-150 ${-160 + i * 180},-250Z`} fill={K.blanket} stroke={INK} strokeWidth={5} />)}
    </g>}
  </g>);
};
export const Nightstand: React.FC<{ x: number; y: number; s?: number; t?: string; phone?: boolean }> = ({ x, y, s = 1, t = '2:48' }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-150} y={-300} width={300} height={300} fill={K.wood} stroke={INK} strokeWidth={8} /><rect x={-130} y={-270} width={260} height={110} fill={K.woodD} stroke={INK} strokeWidth={5} /><circle cx={0} cy={-215} r={10} fill="#c0a060" />
    <AlarmClock x={0} y={-300} s={0.8} t={t} />
  </g>
);
export const Closet: React.FC<{ x: number; y: number; s?: number; state?: string; f?: number }> = ({ x, y, s = 1, state = 'closed', f = 0 }) => {
  const hit = state === 'bang' ? (sf(f, 3) % 12 < 3 ? 1 : 0) : 0;
  return (<g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-300} y={-640} width={600} height={640} fill="#06080b" stroke={INK} strokeWidth={8} />
    {state === 'gone' ? (<g>{[-200, -90, 30, 140].map((q, i) => <path key={i} d={`M${q},-560 l-50,90 l20,300 h120 l20,-300 l-50,-90Z`} fill={['#3a4252', '#4a3a3a', '#2e3a34', '#43404a'][i]} stroke={INK} strokeWidth={5} opacity={0.75} />)}<path d="M-300,-600 H300" stroke={K.metal} strokeWidth={8} /><path d="M-280,-20 l120,-60 l60,40 l80,-80 l90,70" stroke="#8a7a60" strokeWidth={8} fill="none" /></g>) : (
      [-1, 1].map((q) => <g key={q} transform={`translate(${q * 150 + hit * q * 6},${-hit * 4}) skewX(${hit * q * 2})`}>
        <rect x={-146} y={-636} width={292} height={632} fill="#7a828e" stroke={INK} strokeWidth={7} />
        {Array.from({ length: 13 }).map((_, i) => <path key={i} d={`M-116,${-596 + i * 44} h232`} stroke={INK} strokeWidth={5} opacity={0.6} />)}
        <circle cx={-q * 120} cy={-320} r={12} fill="#c0a060" stroke={INK} strokeWidth={4} />
      </g>)
    )}
    {state === 'bang' && hit > 0 && <g>{[0, 1, 2].map((i) => <path key={i} d={`M${-40 - i * 40},${-360 - i * 30} q-40,-40 -80,-20 M${40 + i * 40},${-300 + i * 30} q50,30 80,0`} stroke="#e4e8f0" strokeWidth={6} fill="none" opacity={0.8} />)}<path d="M-10,-400 l30,60 l-20,40 l30,60" stroke={INK} strokeWidth={6} fill="none" /></g>}
    <path d="M-320,0 V-660 H320 V0" fill="none" stroke={K.trim} strokeWidth={22} /><path d="M-320,0 V-660 H320 V0" fill="none" stroke={INK} strokeWidth={5} />
  </g>);
};
export const Frame: React.FC<{ x: number; y: number; w: number; h: number; kind?: number }> = ({ x, y, w, h, kind = 0 }) => (
  <g><rect x={x} y={y} width={w} height={h} fill="#20262e" stroke={INK} strokeWidth={6} /><rect x={x + 10} y={y + 10} width={w - 20} height={h - 20} fill={['#5a6a78', '#6a6050', '#4a5a50'][kind % 3]} />
    {kind % 3 === 0 && <path d={`M${x + 10},${y + h - 10} L${x + w * 0.35},${y + h * 0.45} L${x + w * 0.55},${y + h * 0.7} L${x + w * 0.75},${y + h * 0.35} L${x + w - 10},${y + h - 10}Z`} fill="#33403a" />}
    {kind % 3 === 1 && <g><circle cx={x + w * 0.38} cy={y + h * 0.42} r={h * 0.16} fill="#b09070" /><circle cx={x + w * 0.64} cy={y + h * 0.46} r={h * 0.14} fill="#a08060" /></g>}
    {kind % 3 === 2 && <path d={`M${x + 10},${y + h * 0.6} Q${x + w / 2},${y + h * 0.4} ${x + w - 10},${y + h * 0.62} V${y + h - 10} H${x + 10}Z`} fill="#2a3a44" />}
  </g>
);
// bathroom
export const Tiles: React.FC<{ x: number; y: number; w: number; h: number; c?: string; d?: string; size?: number }> = ({ x, y, w, h, c = K.tile, d = K.tileD, size = 70 }) => (<g><rect x={x} y={y} width={w} height={h} fill={c} />{Array.from({ length: Math.ceil(w / size) + 1 }).map((_, i) => <path key={'v' + i} d={`M${x + i * size},${y} v${h}`} stroke={d} strokeWidth={4} />)}{Array.from({ length: Math.ceil(h / size) + 1 }).map((_, i) => <path key={'h' + i} d={`M${x},${y + i * size} h${w}`} stroke={d} strokeWidth={4} />)}</g>);
export const Vanity: React.FC<{ x: number; y: number; s?: number; water?: boolean; f?: number; bubbles?: boolean }> = ({ x, y, s = 1, water = false, f = 0, bubbles = false }) => { const q = rng(5); return (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-330} y={-420} width={660} height={420} fill={K.cab} stroke={INK} strokeWidth={8} />
    <rect x={-300} y={-380} width={290} height={350} fill="none" stroke={INK} strokeWidth={5} opacity={0.6} /><rect x={10} y={-380} width={290} height={350} fill="none" stroke={INK} strokeWidth={5} opacity={0.6} />
    <rect x={-360} y={-460} width={720} height={44} fill="#d8d8d0" stroke={INK} strokeWidth={7} />
    <ellipse cx={0} cy={-452} rx={170} ry={22} fill="#b8bcb8" stroke={INK} strokeWidth={6} />
    <path d="M-20,-460 V-560 Q-20,-600 20,-600 H90 V-570 H30 V-460Z" fill={K.metal} stroke={INK} strokeWidth={6} />
    <path d="M-80,-500 h50 M40,-500 h50" stroke={K.metal} strokeWidth={14} strokeLinecap="round" />
    {water && <path d={`M76,-570 Q${78 + (sf(f, 3) % 6)},-520 74,-460`} stroke="#c8e0f0" strokeWidth={10} fill="none" opacity={0.85} />}
    {bubbles && Array.from({ length: 10 }).map((_, i) => { const t = (sf(f, 3) / 24 + q()) % 1; return <circle key={i} cx={-200 + q() * 400 + t * 120} cy={-480 - t * 160} r={8 + q() * 10} fill="#e8f0f4" stroke={INK} strokeWidth={2.5} opacity={1 - t} />; })}
  </g>); };
export const Mirror: React.FC<{ x: number; y: number; w: number; h: number; children?: React.ReactNode; id?: string }> = ({ x, y, w, h, children, id = 'mir' }) => (
  <g><defs><clipPath id={id}><rect x={x} y={y} width={w} height={h} /></clipPath></defs>
    <rect x={x} y={y} width={w} height={h} fill="#5a6a70" />
    <g clipPath={`url(#${id})`}>{children}<path d={`M${x + w * 0.1},${y + h} L${x + w * 0.5},${y} H${x + w * 0.62} L${x + w * 0.22},${y + h}Z`} fill="#ffffff" opacity={0.08} /></g>
    <rect x={x} y={y} width={w} height={h} fill="none" stroke={K.metal} strokeWidth={14} /><rect x={x} y={y} width={w} height={h} fill="none" stroke={INK} strokeWidth={5} />
  </g>
);
export const Toilet: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (<g transform={`translate(${x},${y}) scale(${s})`}><rect x={-120} y={-520} width={240} height={190} rx={18} fill="#d8dcd6" stroke={INK} strokeWidth={7} /><path d="M-170,-330 H170 Q170,-220 90,-180 L70,0 H-70 L-90,-180 Q-170,-220 -170,-330Z" fill="#e2e4de" stroke={INK} strokeWidth={7} /><path d="M80,-480 h30" stroke={K.metal} strokeWidth={10} /></g>);
export const LightBar: React.FC<{ x: number; y: number; w: number; on?: boolean }> = ({ x, y, w, on = true }) => (<g>{on && <Glow x={x + w / 2} y={y + 30} r={w * 0.9} ry={360} c={K.fluo} op={0.5} />}<rect x={x} y={y} width={w} height={46} rx={10} fill={on ? '#f4f8e4' : '#6a6e66'} stroke={INK} strokeWidth={6} />{[0.2, 0.5, 0.8].map((t) => <circle key={t} cx={x + w * t} cy={y + 23} r={14} fill={on ? '#ffffff' : '#555'} />)}</g>);
// stairs (side view) rising to the right. n steps.
export const Stairs: React.FC<{ x: number; y: number; s?: number; n?: number; flip?: boolean }> = ({ x, y, s = 1, n = 9, flip = false }) => (
  <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
    <path d={`M0,0 ${Array.from({ length: n }).map((_, i) => `V${-(i + 1) * 70} H${(i + 1) * 90}`).join(' ')} V0Z`} fill={K.carpet} stroke={INK} strokeWidth={7} />
    {Array.from({ length: n }).map((_, i) => <path key={i} d={`M${i * 90},${-(i + 1) * 70} h90`} stroke={K.carpetD} strokeWidth={10} />)}
    <path d={`M-20,-380 L${n * 90},${-n * 70 - 380}`} stroke={K.woodD} strokeWidth={30} strokeLinecap="round" /><path d={`M-20,-380 L${n * 90},${-n * 70 - 380}`} stroke={INK} strokeWidth={5} />
    {Array.from({ length: n }).map((_, i) => <path key={i} d={`M${i * 90 + 45},${-(i + 1) * 70} V${-(i + 1) * 70 - 330}`} stroke={K.woodL} strokeWidth={12} />)}
    <rect x={-50} y={-430} width={60} height={430} fill={K.woodD} stroke={INK} strokeWidth={6} />
  </g>
);
export const GClock: React.FC<{ x: number; y: number; s?: number; fallen?: boolean; f?: number }> = ({ x, y, s = 1, fallen = false, f = 0 }) => {
  const sw = fallen ? 0 : Math.sin(sf(f, 3) / 6) * 14;
  return (<g transform={`translate(${x},${y}) ${fallen ? 'rotate(-90)' : ''} scale(${s})`}>
    <path d="M-110,0 V-260 H-90 V-760 H-130 V-900 Q0,-1000 130,-900 V-760 H90 V-260 H110 V0Z" fill={K.woodD} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
    <rect x={-60} y={-700} width={120} height={400} fill="#1a140e" stroke={INK} strokeWidth={5} />
    {!fallen && <g transform={`rotate(${sw} 0 -690)`}><path d="M0,-690 V-380" stroke="#c0a060" strokeWidth={6} /><circle cx={0} cy={-380} r={30} fill="#c0a060" stroke={INK} strokeWidth={5} /></g>}
    <circle cx={0} cy={-830} r={70} fill="#e2dccb" stroke={INK} strokeWidth={6} /><path d="M0,-830 l0,-50 M0,-830 l34,16" stroke={INK} strokeWidth={6} />
    {Array.from({ length: 12 }).map((_, i) => <circle key={i} cx={Math.cos(i * 0.5236) * 56} cy={-830 + Math.sin(i * 0.5236) * 56} r={4} fill={INK} />)}
    <rect x={-110} y={-260} width={220} height={260} fill={K.wood} stroke={INK} strokeWidth={6} />
  </g>);
};
export const Shards: React.FC<{ x: number; y: number; w: number; f?: number; n?: number; seed?: number; fly?: boolean }> = ({ x, y, w, f = 0, n = 22, seed = 8, fly = false }) => { const q = rng(seed); return (<g>{Array.from({ length: n }).map((_, i) => { const px = x + q() * w, py = y + (q() - 0.5) * 30, r = 6 + q() * 16, a = q() * 6; const t = fly ? ((sf(f, 3) / 20 + q()) % 1) : 0; const ox = fly ? (q() - 0.3) * 300 * t : 0, oy = fly ? -200 * t + 400 * t * t : 0; const gl = (sf(f, 3) / 3 + i) % 9 === 0; return <g key={i}><path d={`M${px + ox},${py + oy} l${Math.cos(a) * r},${Math.sin(a) * r} l${-r * 0.6},${r * 0.7}Z`} fill={K.glassC} stroke={INK} strokeWidth={2} opacity={0.9} />{gl && <path d={`M${px + ox - 10},${py + oy} h20 M${px + ox},${py + oy - 10} v20`} stroke="#ffffff" strokeWidth={3} />}</g>; })}</g>); };
// living room
export const Sofa: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (<g transform={`translate(${x},${y}) scale(${s})`}><rect x={-420} y={-330} width={840} height={200} rx={40} fill="#4a5262" stroke={INK} strokeWidth={8} /><rect x={-460} y={-200} width={920} height={170} rx={30} fill="#566072" stroke={INK} strokeWidth={8} /><rect x={-500} y={-260} width={110} height={240} rx={40} fill="#4a5262" stroke={INK} strokeWidth={8} /><rect x={390} y={-260} width={110} height={240} rx={40} fill="#4a5262" stroke={INK} strokeWidth={8} /><path d="M-10,-320 V-200" stroke={INK} strokeWidth={5} opacity={0.5} /><rect x={-440} y={-30} width={30} height={30} fill={K.woodD} /><rect x={410} y={-30} width={30} height={30} fill={K.woodD} /></g>);
export const CTable: React.FC<{ x: number; y: number; s?: number; under?: React.ReactNode }> = ({ x, y, s = 1, under }) => (<g transform={`translate(${x},${y}) scale(${s})`}>{under}<rect x={-380} y={-200} width={760} height={46} fill={K.woodL} stroke={INK} strokeWidth={8} /><rect x={-380} y={-154} width={760} height={20} fill={K.woodD} stroke={INK} strokeWidth={5} />{[-350, 330].map((q) => <rect key={q} x={q} y={-134} width={22} height={134} fill={K.woodD} stroke={INK} strokeWidth={5} />)}<Frame x={-300} y={-250} w={70} h={50} kind={2} /></g>);
export const Curtain: React.FC<{ x: number; y: number; h: number; f: number; side?: number; c?: string; wind?: number }> = ({ x, y, h, f, side = 1, c = '#6a6250', wind = 1 }) => { const b = Math.sin(sf(f, 3) / 4) * 40 * wind + 60 * wind; return (<path d={`M${x},${y} C${x + side * 60},${y + h * 0.3} ${x + side * (40 + b)},${y + h * 0.6} ${x + side * (20 + b * 1.6)},${y + h} L${x + side * (150 + b * 1.4)},${y + h - 30} C${x + side * (180 + b)},${y + h * 0.6} ${x + side * 170},${y + h * 0.3} ${x + side * 160},${y}Z`} fill={c} stroke={INK} strokeWidth={7} strokeLinejoin="round" />); };
export const BrokenWin: React.FC<{ x: number; y: number; w: number; h: number; f: number; seed?: number; outside?: React.ReactNode }> = ({ x, y, w, h, f, seed = 3, outside }) => { const id = 'bw' + seed + x; const a = flash(f, seed); return (<g>
  <defs><clipPath id={id}><rect x={x} y={y} width={w} height={h} /></clipPath></defs>
  <g clipPath={`url(#${id})`}><rect x={x} y={y} width={w} height={h} fill={K.sky1} />{outside}<Rain W={x + w} H={y + h} f={f} n={40} op={0.45} seed={seed} />{a > 0.3 && <Bolt x={x + w * 0.4} y={y - 10} h={h} seed={seed + sf(f, 30)} />}<rect x={x} y={y} width={w} height={h} fill={K.bolt} opacity={a * 0.6} />
    <path d={`M${x},${y} H${x + w} V${y + h * 0.3} L${x + w * 0.78},${y + h * 0.18} L${x + w * 0.7},${y + h * 0.42} L${x + w * 0.55},${y + h * 0.2} L${x + w * 0.4},${y + h * 0.5} L${x + w * 0.28},${y + h * 0.26} L${x + w * 0.12},${y + h * 0.4} L${x},${y + h * 0.22}Z`} fill={K.glassC} opacity={0.35} stroke={INK} strokeWidth={4} />
    <path d={`M${x},${y + h} H${x + w} V${y + h * 0.75} L${x + w * 0.82},${y + h * 0.86} L${x + w * 0.6},${y + h * 0.7} L${x + w * 0.45},${y + h * 0.9} L${x + w * 0.25},${y + h * 0.72} L${x},${y + h * 0.84}Z`} fill={K.glassC} opacity={0.35} stroke={INK} strokeWidth={4} />
  </g>
  <rect x={x - 14} y={y - 14} width={w + 28} height={h + 28} fill="none" stroke={K.trim} strokeWidth={22} /><rect x={x - 14} y={y - 14} width={w + 28} height={h + 28} fill="none" stroke={INK} strokeWidth={5} /><path d={`M${x + w / 2},${y} V${y + h}`} stroke={K.trim} strokeWidth={14} />
</g>); };
// kitchen
export const Cabinets: React.FC<{ W: number; cy: number; y0?: number; x0?: number; x1?: number }> = ({ W, cy, x0 = -200, x1 }) => { const e = x1 ?? W + 200; const n = Math.ceil((e - x0) / 240); return (<g>
  {Array.from({ length: n }).map((_, i) => <g key={i}><rect x={x0 + i * 240} y={cy - 760} width={230} height={300} fill={K.cab} stroke={INK} strokeWidth={6} /><rect x={x0 + i * 240 + 22} y={cy - 736} width={186} height={252} fill="none" stroke={INK} strokeWidth={4} opacity={0.5} /><circle cx={x0 + i * 240 + 200} cy={cy - 490} r={8} fill={K.metal} /></g>)}
  <rect x={x0} y={cy - 30} width={e - x0} height={40} fill={K.counter} stroke={INK} strokeWidth={7} />
  {Array.from({ length: n }).map((_, i) => <g key={'l' + i}><rect x={x0 + i * 240} y={cy + 10} width={230} height={330} fill={K.cabD} stroke={INK} strokeWidth={6} /><rect x={x0 + i * 240 + 20} y={cy + 30} width={190} height={80} fill="none" stroke={INK} strokeWidth={4} opacity={0.5} /><path d={`M${x0 + i * 240 + 90},${cy + 70} h50`} stroke={K.metal} strokeWidth={8} /></g>)}
</g>); };
export const Pan: React.FC<{ x: number; y: number; s?: number; rot?: number; pot?: boolean }> = ({ x, y, s = 1, rot = 0, pot = false }) => (<g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>{pot ? <g><path d="M-90,-110 H90 V-10 Q90,10 70,10 H-70 Q-90,10 -90,-10Z" fill="#6a7078" stroke={INK} strokeWidth={6} /><path d="M-110,-100 h20 M90,-100 h20" stroke={INK} strokeWidth={10} /></g> : <g><ellipse cx={0} cy={0} rx={100} ry={100} fill="#2a2c30" stroke={INK} strokeWidth={6} /><ellipse cx={0} cy={0} rx={74} ry={74} fill="#3a3d42" /><rect x={-10} y={-260} width={20} height={170} rx={8} fill="#1a1a1a" stroke={INK} strokeWidth={4} /></g>}</g>);
export const Keys: React.FC<{ x: number; y: number; s?: number; glow?: boolean }> = ({ x, y, s = 1, glow = false }) => (<g transform={`translate(${x},${y}) scale(${s})`}>{glow && <Glow x={0} y={0} r={120} c="#f0e2a0" op={0.4} />}<circle cx={-20} cy={-10} r={30} fill="none" stroke="#c0b8a8" strokeWidth={10} /><path d="M0,0 L90,30 L86,46 L70,40 L66,52 L54,48 L50,58 L-4,16Z" fill="#c9c2b2" stroke={INK} strokeWidth={4} /><path d="M-40,10 L-60,100 L-44,104 L-40,86 L-30,88 L-26,72 L-36,70 L-28,16Z" fill="#a8a090" stroke={INK} strokeWidth={4} /><rect x={-10} y={-40} width={50} height={28} rx={8} fill="#2a2a30" stroke={INK} strokeWidth={4} /></g>);
export const Knife: React.FC<{ x: number; y: number; s?: number; rot?: number; glint?: boolean }> = ({ x, y, s = 1, rot = 0, glint = false }) => (<g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}><path d="M-20,0 h40 v150 h-40Z" fill="#2a2420" stroke={INK} strokeWidth={6} /><circle cx={0} cy={50} r={6} fill="#aaa" /><circle cx={0} cy={110} r={6} fill="#aaa" /><path d="M-28,-14 h56 v14 h-56Z" fill="#6a6a6a" stroke={INK} strokeWidth={4} /><path d="M-20,-14 L20,-14 L14,-430 L0,-480 L-20,-430Z" fill="#c8ccd0" stroke={INK} strokeWidth={6} strokeLinejoin="round" /><path d="M8,-30 L4,-420" stroke="#fff" strokeWidth={6} opacity={0.6} />{glint && <g><path d="M0,-470 l0,-60 M0,-470 l0,60 M0,-470 l-60,0 M0,-470 l60,0" stroke="#fff" strokeWidth={8} /><circle cx={0} cy={-470} r={26} fill="#fff" opacity={0.6} filter="url(#soft2)" /></g>}</g>);
export const Drawer: React.FC<{ x: number; y: number; s?: number; open?: number; f?: number }> = ({ x, y, s = 1, open = 1, f = 0 }) => { const q = rng(9); const j = sf(f, 3) % 6 < 3 ? 2 : -2; return (<g transform={`translate(${x},${y}) scale(${s})`}><rect x={-360} y={-140 + open * 80} width={720} height={150} fill="#1a1d22" stroke={INK} strokeWidth={6} />{Array.from({ length: 14 }).map((_, i) => <path key={i} d={`M${-320 + i * 48 + j},${-100 + open * 80} l${10 + q() * 20},${80}`} stroke="#b8bec4" strokeWidth={10} strokeLinecap="round" />)}<rect x={-380} y={10 + open * 80} width={760} height={110} fill={K.cabD} stroke={INK} strokeWidth={7} /><path d={`M-60,${60 + open * 80} h120`} stroke={K.metal} strokeWidth={10} /></g>); };
export const Powder: React.FC<{ x: number; y: number; w: number }> = ({ x, y, w }) => { const q = rng(12); return (<g opacity={0.85}>{Array.from({ length: 40 }).map((_, i) => <circle key={i} cx={x + q() * w} cy={y + (q() - 0.5) * 50} r={4 + q() * 14} fill="#e8e2c8" opacity={0.5 + q() * 0.4} />)}<path d={`M${x + w * 0.1},${y} q${w * 0.2},-30 ${w * 0.4},0 q${w * 0.2},30 ${w * 0.4},-6`} stroke="#e8e2c8" strokeWidth={10} fill="none" opacity={0.5} /></g>); };
export const SpiceRack: React.FC<{ x: number; y: number; s?: number; fallen?: boolean }> = ({ x, y, s = 1, fallen = false }) => (<g transform={`translate(${x},${y}) rotate(${fallen ? 78 : 0}) scale(${s})`}><rect x={-160} y={-220} width={320} height={220} fill={K.woodL} stroke={INK} strokeWidth={6} /><path d="M-160,-110 h320" stroke={INK} strokeWidth={6} />{Array.from({ length: 10 }).map((_, i) => <rect key={i} x={-145 + (i % 5) * 60} y={i < 5 ? -205 : -95} width={40} height={80} rx={8} fill={['#8a5a3a', '#c8b070', '#6a7a4a', '#a0603a', '#d8d0b0'][i % 5]} stroke={INK} strokeWidth={4} />)}</g>);
export const SlideDoor: React.FC<{ x: number; y: number; w: number; h: number; f: number; seed?: number }> = ({ x, y, w, h, f, seed = 5 }) => { const id = 'sd' + seed; const a = flash(f, seed); return (<g><defs><clipPath id={id}><rect x={x} y={y} width={w} height={h} /></clipPath></defs><g clipPath={`url(#${id})`}><rect x={x} y={y} width={w} height={h} fill={K.sky1} /><Barrens W={x + w} gy={y + h * 0.75} f={f} s={0.5} seed={seed} /><Rain W={x + w} H={y + h} f={f} n={50} op={0.5} seed={seed} /><rect x={x} y={y} width={w} height={h} fill={K.bolt} opacity={a * 0.5} /></g><rect x={x} y={y} width={w} height={h} fill="none" stroke={K.metalD} strokeWidth={24} /><path d={`M${x + w / 2},${y} V${y + h}`} stroke={K.metalD} strokeWidth={20} /><rect x={x} y={y} width={w} height={h} fill="none" stroke={INK} strokeWidth={5} /><path d={`M${x},${y + h + 12} H${x + w}`} stroke={K.metal} strokeWidth={14} />{[0.2, 0.7].map((t) => <circle key={t} cx={x + w * t} cy={y + h + 12} r={12} fill="#3a3a3a" stroke={INK} strokeWidth={4} />)}</g>); };
export const BasementDoor: React.FC<{ x: number; y: number; s?: number; f?: number; inner?: React.ReactNode }> = ({ x, y, s = 1, inner }) => (<g transform={`translate(${x},${y}) scale(${s})`}><rect x={-160} y={-580} width={320} height={580} fill="#020304" stroke={INK} strokeWidth={8} />{Array.from({ length: 5 }).map((_, i) => <path key={i} d={`M-150,${-90 + i * 0 - i * -0} `} />)}{[0, 1, 2, 3].map((i) => <path key={i} d={`M${-140 + i * 20},${-40 - i * 0} h${280 - i * 40}`} stroke="#14181c" strokeWidth={6} transform={`translate(0,${-i * 60})`} opacity={0.9 - i * 0.2} />)}{inner}<g transform="translate(-160,0) scale(0.22,1) translate(160,0)"><rect x={-160} y={-580} width={320} height={580} fill="#6e7682" stroke={INK} strokeWidth={8} /></g><path d="M-180,0 V-600 H180 V0" fill="none" stroke={K.trim} strokeWidth={22} /><path d="M-180,0 V-600 H180 V0" fill="none" stroke={INK} strokeWidth={5} /></g>);
// garage + car
export const Sedan: React.FC<{ x: number; y: number; s?: number; flip?: boolean; lights?: number; tail?: number; c?: string; f?: number; dent?: boolean }> = ({ x, y, s = 1, flip = false, lights = 0, tail = 0, c = K.car, f = 0, dent = false }) => {
  const wr = sf(f, 3) * 0.3;
  return (<g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
    <ellipse cx={0} cy={6} rx={560} ry={30} fill="#000" opacity={0.4} />
    <path d={`M-560,-80 Q-570,-200 -480,-220 L-300,-240 L-170,-390 Q-150,-410 -110,-410 H220 Q260,-410 290,-380 L420,-240 L520,-220 Q580,-200 570,-90 L560,-60 H-560Z`} fill={c} stroke={INK} strokeWidth={9} strokeLinejoin="round" />
    {dent && <path d="M-60,-410 q60,30 140,0" fill="none" stroke={INK} strokeWidth={8} />}
    <path d="M-140,-376 Q-128,-390 -100,-390 H40 V-250 H-260Z" fill="#26323c" stroke={INK} strokeWidth={6} /><path d="M70,-390 H210 Q240,-390 262,-366 L360,-250 H70Z" fill="#26323c" stroke={INK} strokeWidth={6} />
    <path d="M-120,-370 L-60,-370 L-170,-260 L-220,-260Z" fill="#ffffff" opacity={0.1} />
    <path d="M-560,-140 H570" stroke={K.carD} strokeWidth={10} /><path d="M50,-240 V-80" stroke={INK} strokeWidth={5} /><path d="M110,-200 h50" stroke={INK} strokeWidth={8} />
    <path d="M-560,-80 H570 V-50 H-560Z" fill={K.carD} stroke={INK} strokeWidth={6} />
    {[-340, 360].map((q) => <g key={q} transform={`translate(${q},-40)`}><circle r={100} fill="#16181b" stroke={INK} strokeWidth={8} /><circle r={52} fill="#7a8088" stroke={INK} strokeWidth={5} /><g transform={`rotate(${wr * 60})`}>{[0, 72, 144, 216, 288].map((a) => <path key={a} d="M0,0 L0,-46" stroke={INK} strokeWidth={6} transform={`rotate(${a})`} />)}</g></g>)}
    <path d="M530,-200 L572,-190 L570,-150 L520,-160Z" fill={lights ? '#fff6d0' : '#a8a89a'} stroke={INK} strokeWidth={5} />
    {lights > 0 && <path d="M570,-170 L1500,-330 L1500,60 Z" fill="#fff4c0" opacity={0.18 * lights} />}
    <path d="M-562,-200 L-540,-210 L-540,-150 L-566,-150Z" fill={tail ? K.red : K.redD} stroke={INK} strokeWidth={5} />
    {tail > 0 && <Glow x={-570} y={-180} r={140} c="#ff2a1a" op={0.5 * tail} />}
  </g>);
};
export const RollDoor: React.FC<{ x: number; y: number; w: number; h: number; open?: number; outside?: React.ReactNode }> = ({ x, y, w, h, open = 0, outside }) => { const oh = h * open; return (<g>{open > 0 && <g><rect x={x} y={y + h - oh} width={w} height={oh} fill={K.sky1} />{outside}</g>}{Array.from({ length: 6 }).map((_, i) => { const yy = y + i * (h / 6) - oh; return yy + h / 6 > y ? <g key={i}><rect x={x} y={Math.max(y, yy)} width={w} height={Math.max(0, Math.min(h / 6, yy + h / 6 - y))} fill="#8a9098" stroke={INK} strokeWidth={5} />{yy > y && Array.from({ length: 4 }).map((_, k) => <rect key={k} x={x + 20 + k * (w - 40) / 4} y={yy + 14} width={(w - 40) / 4 - 20} height={h / 6 - 28} fill="none" stroke={INK} strokeWidth={3} opacity={0.4} />)}</g> : null; })}<rect x={x - 20} y={y - 20} width={w + 40} height={h + 20} fill="none" stroke={K.concreteD} strokeWidth={30} /></g>); };
export const Concrete: React.FC<{ W: number; H: number; fy: number }> = ({ W, H, fy }) => (<g><rect x={-600} y={-600} width={W + 1200} height={fy + 600} fill="#3e4248" />{Array.from({ length: 16 }).map((_, r) => <path key={r} d={`M-600,${fy - r * 70} H${W + 600}`} stroke="#2e3136" strokeWidth={4} />)}{Array.from({ length: 16 }).map((_, r) => Array.from({ length: 14 }).map((_, c) => <path key={r + '-' + c} d={`M${-600 + c * 220 + (r % 2) * 110},${fy - r * 70} v-70`} stroke="#2e3136" strokeWidth={4} />))}<rect x={-600} y={fy} width={W + 1200} height={H - fy + 600} fill={K.concrete} /><path d={`M200,${fy + 80} q300,30 600,-10 M1100,${fy + 140} q200,20 400,0`} stroke={K.concreteD} strokeWidth={6} fill="none" /></g>);
export const Shelf: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (<g transform={`translate(${x},${y}) scale(${s})`}>{[0, 1, 2].map((i) => <g key={i}><rect x={-200} y={-200 - i * 220} width={400} height={20} fill={K.metalD} stroke={INK} strokeWidth={5} />{[0, 1, 2].map((k) => <rect key={k} x={-170 + k * 120} y={-300 - i * 220} width={80 + (k % 2) * 20} height={100} rx={8} fill={['#6a5a4a', '#4a5a6a', '#7a6a3a'][(i + k) % 3]} stroke={INK} strokeWidth={4} />)}</g>)}<path d="M-200,0 V-680 M200,0 V-680" stroke={K.metalD} strokeWidth={12} /></g>);
// car interior (dash glows green and amber)
export const Dash: React.FC<{ W: number; H: number; f: number; on?: boolean; hands?: boolean; gear?: boolean; one?: boolean }> = ({ W, H, f, on = true, hands = true, gear = false, one = false }) => (<g>
  <path d={`M-200,${H * 0.62} Q${W / 2},${H * 0.5} ${W + 200},${H * 0.62} V${H + 200} H-200Z`} fill="#15181c" stroke={INK} strokeWidth={8} />
  <rect x={W * 0.3} y={H * 0.58} width={W * 0.4} height={H * 0.13} rx={30} fill="#0a0c0e" stroke={INK} strokeWidth={6} />
  {on && <g>{[0.38, 0.5, 0.62].map((t, i) => <g key={t}><circle cx={W * t} cy={H * 0.645} r={H * 0.045} fill="none" stroke={i === 1 ? K.amber : K.green} strokeWidth={5} /><path d={`M${W * t},${H * 0.645} l${Math.cos(sf(f, 3) / 20 + i) * H * 0.035},${-H * 0.03}`} stroke={i === 1 ? K.amber : K.green} strokeWidth={5} /></g>)}<Glow x={W * 0.5} y={H * 0.64} r={W * 0.25} ry={H * 0.12} c={K.green} op={0.25} />{[0.33, 0.36, 0.66, 0.69].map((t, i) => <rect key={t} x={W * t} y={H * 0.6} width={18} height={12} fill={i % 2 ? K.amber : K.green} />)}</g>}
  <g transform={`translate(${W * 0.5},${H * 0.86})`}><circle r={H * 0.3} fill="none" stroke="#202428" strokeWidth={H * 0.05} /><circle r={H * 0.3} fill="none" stroke={INK} strokeWidth={5} /><path d={`M${-H * 0.3},0 H${H * 0.3}`} stroke="#202428" strokeWidth={H * 0.06} /></g>
  {hands && <g><Hand x={W * 0.5 - H * 0.3} y={H * 0.86} s={0.9} rot={-30} skin="#c19468" shade="#85613f" sleeve="#566476" sleeveLen={200} />{!one && <Hand x={W * 0.5 + H * 0.3} y={H * 0.86} s={0.9} rot={30} skin="#c19468" shade="#85613f" sleeve="#566476" sleeveLen={200} />}</g>}
  {gear && <g transform={`translate(${W * 0.8},${H * 0.95})`}><path d="M-20,0 V-160" stroke="#2a2a2a" strokeWidth={26} /><circle cx={0} cy={-170} r={36} fill="#1a1a1a" stroke={INK} strokeWidth={6} /><Hand x={0} y={-150} s={0.8} rot={10} skin="#c19468" shade="#85613f" sleeve="#566476" sleeveLen={200} /></g>}
</g>);
export const StreetLamp: React.FC<{ x: number; y: number; s?: number; on?: boolean }> = ({ x, y, s = 1, on = true }) => (<g transform={`translate(${x},${y}) scale(${s})`}>{on && <path d="M150,-1020 L-60,0 H420Z" fill="#e8e0c0" opacity={0.08} />}<path d="M0,0 V-1000 Q0,-1060 60,-1060 H170" stroke="#2a2e34" strokeWidth={26} fill="none" /><path d="M120,-1080 h110 l-10,40 h-90Z" fill="#3a3e44" stroke={INK} strokeWidth={6} />{on && <Glow x={170} y={-1030} r={160} c="#f0e8c8" op={0.55} />}</g>);
export { taper, Hatch };
// two-storey house on the edge of the pines. lit: which windows glow ('bath','bed','hall'); broken living-room window; garage door open 0..1
export const HouseExt: React.FC<{ x: number; y: number; s?: number; f?: number; lit?: string[]; broken?: boolean; gopen?: number; headl?: boolean }> = ({ x, y, s = 1, f = 0, lit = [], broken = false, gopen = 0, headl = false }) => {
  const win = (wx: number, wy: number, id: string, w = 120, h = 150) => { const on = lit.includes(id); return (<g key={id}>{on && <Glow x={wx + w / 2} y={wy + h / 2} r={w * 1.4} c={K.fluo} op={0.35} />}<rect x={wx} y={wy} width={w} height={h} fill={on ? '#e8eed0' : '#141c26'} stroke={INK} strokeWidth={7} /><path d={`M${wx + w / 2},${wy} V${wy + h} M${wx},${wy + h / 2} H${wx + w}`} stroke={K.trim} strokeWidth={8} />{id === 'liv' && broken && <path d={`M${wx + 10},${wy + 20} l40,50 l-20,30 l50,40`} stroke="#c8d8e8" strokeWidth={5} fill="none" />}<rect x={wx - 18} y={wy} width={16} height={h} fill="#2a3240" stroke={INK} strokeWidth={4} /><rect x={wx + w + 2} y={wy} width={16} height={h} fill="#2a3240" stroke={INK} strokeWidth={4} /></g>); };
  return (<g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-520,0 V-620 H520 V0Z" fill="#4a5466" stroke={INK} strokeWidth={9} />
    {Array.from({ length: 14 }).map((_, i) => <path key={i} d={`M-520,${-40 - i * 42} H520`} stroke="#3a4352" strokeWidth={4} />)}
    <path d="M-580,-600 L0,-940 L580,-600Z" fill="#20262f" stroke={INK} strokeWidth={9} strokeLinejoin="round" />
    {Array.from({ length: 7 }).map((_, i) => <path key={i} d={`M${-520 + i * 30},${-640 - i * 40} L${520 - i * 30},${-640 - i * 40}`} stroke="#151a20" strokeWidth={4} />)}
    <rect x={260} y={-1000} width={90} height={220} fill="#3a3030" stroke={INK} strokeWidth={7} />
    {win(-400, -540, 'bed')}{win(-130, -540, 'hall', 100)}{win(140, -540, 'bath', 110, 120)}{win(330, -540, 'bed2')}
    {win(-420, -300, 'liv', 220, 170)}{win(180, -300, 'kit', 150, 150)}
    <rect x={-70} y={-280} width={140} height={280} fill="#3a2a22" stroke={INK} strokeWidth={7} /><circle cx={40} cy={-140} r={8} fill="#c0a060" />
    <path d="M-110,-290 H110 L90,-320 H-90Z" fill="#20262f" stroke={INK} strokeWidth={6} />
    {/* garage */}
    <path d="M520,0 V-400 L880,-400 L940,-360 V0Z" fill="#46505f" stroke={INK} strokeWidth={9} />
    <path d="M500,-400 L740,-560 L960,-380Z" fill="#20262f" stroke={INK} strokeWidth={9} strokeLinejoin="round" />
    <RollDoor x={580} y={-320} w={300} h={320} open={gopen} />
    {headl && gopen > 0.5 && <path d="M700,-60 L-200,200 L1600,200Z" fill="#fff4c0" opacity={0.12} />}
  </g>);
};
