import React from 'react';
import { Form, Crease, Patch, Painted, Mirror, PHand, Ground, sp, sym, mix, dark, lite, ribbon, ribbonW, useLight, shadeOf, lineOf, RED, P } from './Paint';
import { motionRig, ik, headPos } from './Rig';
import type { Motion, Rig, XY } from './Rig';
export type { Motion, Rig };
import { Head, Spec, Expr } from './Faces';
import { HairBack } from './Hair';
import { CAST, GHOSTS } from './Specs';
export { CAST, GHOSTS };
export type { Spec, Expr };
// ===== SCROLL KAOS PAINTED BODY BUILDER. Origin = centre of the feet on the ground, up is negative y.
// Adult about 3040 tall (head centre at -2780). Same builder for every person and ghost, so the cast always matches.

export type View = 'front' | 'three' | 'back';
type Ctx = { s: Spec; id: string; fem: boolean; sw: number; hw: number; waistX: number; hemY: number; skin: string; top: string; bot: string; view: View; f: number; acc: string[]; armL: number };

const SLEEVE: Record<Spec['top'], 'rolled' | 'long' | 'short' | 'cap'> = { shirt: 'long', tshirt: 'short', jacket: 'long', cardigan: 'long', hoodie: 'long', uniform: 'long', workshirt: 'short', raincoat: 'long', shift: 'cap' };
const HEM: Record<Spec['top'], number> = { shirt: -1470, tshirt: -1500, jacket: -1380, cardigan: -1490, hoodie: -1450, uniform: -1630, workshirt: -1610, raincoat: -1000, shift: -330 };

// ---------- legs + feet, driven by the rig. H = hip, K = knee, A = ankle (figure coords). F = facing for the shoe (0 = front shoe)
const Leg: React.FC<{ c: Ctx; idx: 0 | 1; H: XY; K: XY; A: XY; toe: number; F: number }> = ({ c, idx, H, K, A, toe, F }) => {
  const { s, hw, id } = c; const L = useLight();
  const pants = s.bottom === 'trousers' || s.bottom === 'jeans';
  const shoeC = s.shoeC || '#2b2019';
  const lid = `${id}-leg${idx}`;
  const jeans = s.bottom === 'jeans';
  const w = pants ? (jeans ? [236, 226, 158, 146] : [250, 240, 176, 168]) : (c.fem || s.kid ? [168, 160, 118, 96] : [190, 180, 130, 108]);
  const top: XY = [H[0], H[1] - 90];
  const d = ribbonW([top, H, K, [A[0], A[1] + 10]], w, 8);
  const sh = shadeOf(pants ? c.bot : c.skin, L, 1.25);
  // perpendicular helpers for knee and ankle folds
  const v = [A[0] - K[0], A[1] - K[1]]; const m = Math.hypot(v[0], v[1]) || 1; const nx = -v[1] / m, ny = v[0] / m;
  const fold = (P0: XY, t: number, len: number, bow: number) => `M${P0[0] - nx * len + v[0] / m * t},${P0[1] - ny * len + v[1] / m * t} Q${P0[0] + v[0] / m * (t + bow)},${P0[1] + v[1] / m * (t + bow)} ${P0[0] + nx * len + v[0] / m * t},${P0[1] + ny * len + v[1] / m * t}`;
  const kneeBend = Math.abs((K[0] - H[0]) * (A[1] - K[1]) - (K[1] - H[1]) * (A[0] - K[0])) / 1e5;
  const fs = F || (idx === 0 ? -1 : 1);
  const front = F === 0;
  const shoe = front
    ? sp([[-82, -66], [72, -66], [88, 14], [122, 64], [140, 112, 0.4], [96, 136, 0], [-96, 136, 0], [-110, 96], [-100, 26]].map((q) => [q[0] * (idx === 0 ? -1 : 1), q[1], q[2] ?? 1] as P))
    : sp([[-86, -74], [40, -84], [120, -56], [196, -22], [212, 10, 0.4], [180, 140 - 120, 0], [-96, 20, 0], [-112, -16]].map((q) => [q[0] * fs, q[1] + 120, q[2] ?? 1] as P));
  const foot = front
    ? sp([[-64, -40], [56, -40], [72, 30], [106, 90], [118, 130, 0.4], [80, 146, 0], [-80, 146, 0], [-92, 100], [-80, 30]].map((q) => [q[0] * (idx === 0 ? -1 : 1), q[1], q[2] ?? 1] as P))
    : sp([[-70, -40], [40, -40], [120, 40], [190, 110], [196, 140, 0.4], [-80, 146, 0], [-96, 90]].map((q) => [q[0] * fs, q[1], q[2] ?? 1] as P));
  return (
    <g>
      {pants ? (
        <Form id={lid} d={d} c={c.bot} so={w[1] * 0.42} lo={w[1] * 0.3} ro={14} soft={12} tilt={0}>
          <Crease d={fold(K, -30, w[2] * 0.4, 40)} c={sh} w={14} o={0.5 + kneeBend * 0.4} />
          <Crease d={fold(K, -110, w[2] * 0.36, 30)} c={sh} w={11} o={0.35} />
          <Crease d={fold(A, -150, w[3] * 0.45, 30)} c={sh} w={14} o={0.55} />
          <Crease d={fold(A, -80, w[3] * 0.45, 26)} c={sh} w={12} o={0.5} />
          <Crease d={fold(A, -230, w[3] * 0.4, 24)} c={keyOf2(c.bot)} w={10} o={0.3} />
          {jeans && <path d={`M${H[0] + (idx ? 1 : -1) * 100},${H[1]} L${K[0] + (idx ? 1 : -1) * 76},${K[1]} L${A[0] + (idx ? 1 : -1) * 66},${A[1]}`} stroke={mix(c.bot, '#d8b070', 0.5)} strokeWidth={3} strokeDasharray="10 8" fill="none" opacity={0.6} />}
        </Form>
      ) : (
        <Form id={lid} d={d} c={c.skin} so={50} lo={34} ro={8} soft={12} tilt={0}>
          <Crease d={fold(K, -10, w[2] * 0.3, 20)} c={sh} w={10} o={0.35} b={3} />
        </Form>
      )}
      <g transform={`translate(${A[0]},${A[1]}) rotate(${-toe * fs})`}>
        {s.barefoot ? (
          <Form id={lid + 'f'} d={foot} c={c.skin} so={40} lo={30} ro={8} soft={6} tilt={0}>
            {[0, 1, 2, 3].map((q) => <path key={q} d={`M${(front ? 70 - q * 34 : 150 - q * 24) * fs},150 v-18`} stroke={lineOf(c.skin, L)} strokeWidth={3} opacity={0.5} />)}
          </Form>
        ) : (
          <Form id={lid + 's'} d={shoe} c={shoeC} so={50} lo={40} ro={8} soft={12} tilt={0}>
            <path d={front ? `M-110,128 H110` : `M${-100 * fs},134 L${206 * fs},134`} stroke={dark(shoeC, 0.5)} strokeWidth={18} />
            <Crease d={front ? `M-60,-40 C-30,-20 30,-20 60,-40` : `M${-40 * fs},-20 C${10 * fs},0 ${60 * fs},6 ${110 * fs},20`} c={lite(shoeC, 0.45)} w={8} o={0.45} b={3} />
            {c.acc.includes('redLaces') && <path d={front ? 'M-50,-40 L50,-26 M-46,-6 L54,8 M50,-26 l20,40' : `M${-10 * fs},-40 L${60 * fs},-20 M${10 * fs},-10 L${80 * fs},4`} stroke={RED} strokeWidth={8} strokeLinecap="round" />}
          </Form>
        )}
      </g>
    </g>
  );
};
const keyOf2 = (c: string) => mix(c, '#ffe2b8', 0.35);

// ---------- arm, driven by the rig: S = shoulder, E = elbow, W = wrist (upper-body coords). thumb = side the thumb points to
const Arm: React.FC<{ c: Ctx; idx: 0 | 1; S: XY; E: XY; W: XY; thumb: number; red?: boolean }> = ({ c, idx, S, E, W, thumb, red }) => {
  const { s, id, skin, top } = c; const L = useLight();
  const kind = s.rolled && SLEEVE[s.top] === 'long' ? 'rolled' : SLEEVE[s.top];
  const bulk = s.top === 'jacket' || s.top === 'hoodie' || s.top === 'raincoat' ? 30 : s.top === 'cardigan' ? 14 : 0;
  const thin = (c.fem ? 0.84 : 1) * (s.kid ? 0.92 : 1);
  const aid = `${id}-arm${idx}`;
  const sh = shadeOf(top, L, 1.25);
  const mid = (a: XY, b: XY, t = 0.5): XY => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const spine: P[] = [S, mid(S, E), E, mid(E, W), W];
  const up: P[] = [S, mid(S, E), [E[0] + (E[0] - S[0]) * 0.06, E[1] + (E[1] - S[1]) * 0.06]];
  const fore: P[] = [mid(E, S, 0.08), mid(E, W), [W[0] + (W[0] - E[0]) * 0.04, W[1] + (W[1] - E[1]) * 0.04]];
  const vf = [W[0] - E[0], W[1] - E[1]]; const mf = Math.hypot(vf[0], vf[1]) || 1;
  const vu = [E[0] - S[0], E[1] - S[1]]; const mu = Math.hypot(vu[0], vu[1]) || 1;
  const across = (P0: XY, v: number[], m: number, t: number, len: number, bow = 18) => { const nx = -v[1] / m, ny = v[0] / m, tx = v[0] / m, ty = v[1] / m; return `M${P0[0] - nx * len + tx * t},${P0[1] - ny * len + ty * t} Q${P0[0] + tx * (t + bow)},${P0[1] + ty * (t + bow)} ${P0[0] + nx * len + tx * t},${P0[1] + ny * len + ty * t}`; };
  const handRot = (Math.atan2(-vf[0], vf[1]) * 180) / Math.PI;
  const cuff = ribbon([mid(W, E, 0.16), [W[0], W[1]]], 100 * thin + bulk * 0.7, 100 * thin + bulk * 0.7, 3);
  return (
    <g>
      {kind !== 'long' && <Form id={aid + 'sk'} d={kind === 'rolled' ? ribbonW(fore, [130 * thin, 112 * thin, 92 * thin], 8) : ribbonW(spine, [160 * thin, 146 * thin, 122 * thin, 104 * thin, 92 * thin], 8)} c={skin} so={50} lo={34} ro={9} soft={12}>
        <Crease d={across(E, vf, mf, 30, 40 * thin, 10)} c={shadeOf(skin, L)} w={6} o={0.35} b={3} />
      </Form>}
      {kind === 'long' && <Form id={aid + 'sl'} d={ribbonW(spine, [178 * thin + bulk, 164 * thin + bulk, 140 * thin + bulk, 122 * thin + bulk * 0.8, 112 * thin + bulk * 0.7], 8)} c={top} so={62} lo={46} ro={10} soft={12}>
        <Crease d={across(S, vu, mu, 110, 70 * thin, 20)} c={sh} w={12} o={0.4} />
        <Crease d={across(E, vu, mu, -60, 64 * thin, 22)} c={sh} w={11} o={0.45} />
        <Crease d={across(E, vf, mf, 10, 62 * thin, 22)} c={sh} w={13} o={0.55} />
        <Crease d={across(E, vf, mf, 90, 56 * thin, 18)} c={sh} w={10} o={0.4} />
      </Form>}
      {kind === 'long' && <Form id={aid + 'cf'} d={cuff} c={s.top === 'hoodie' || s.top === 'cardigan' || s.top === 'raincoat' ? dark(top, 0.12) : top} so={30} lo={20} ro={8} soft={6} />}
      {kind === 'rolled' && <Form id={aid + 'su'} d={ribbonW(up, [178 * thin, 164 * thin, 146 * thin], 8)} c={top} so={62} lo={46} ro={10} soft={12}><Crease d={across(S, vu, mu, 110, 70 * thin, 20)} c={sh} w={12} o={0.4} /></Form>}
      {kind === 'rolled' && <Form id={aid + 'rc'} d={ribbon([mid(E, S, 0.1), mid(E, W, 0.12)], 146 * thin, 138 * thin, 3)} c={lite(top, 0.12)} so={40} lo={30} ro={8} soft={6}><Crease d={across(E, vf, mf, 6, 70 * thin, 12)} c={sh} w={8} o={0.6} b={3} /></Form>}
      {kind === 'short' && <Form id={aid + 'ss'} d={ribbon([[S[0] - (S[0] - E[0]) * 0.02, S[1] - 20], mid(S, E, 0.22), mid(S, E, 0.42)], 186 * thin, 170 * thin, 6)} c={top} so={60} lo={40} ro={10} soft={12}><Crease d={across(mid(S, E, 0.4), vu, mu, 0, 80 * thin, 14)} c={sh} w={10} o={0.5} /></Form>}
      {kind === 'cap' && <Form id={aid + 'cs'} d={ribbon([[S[0], S[1] - 20], mid(S, E, 0.12), mid(S, E, 0.24)], 158 * thin, 152 * thin, 6)} c={top} so={50} lo={34} ro={8} soft={12} />}
      <PHand id={aid + 'h'} skin={skin} x={W[0]} y={W[1] - 6} rot={handRot} k={(c.fem ? 0.98 : 1.16) * (s.kid ? 0.9 : 1)} long={s.fingers || 1} flip={thumb > 0} />
      {red && <g transform={`translate(${W[0]},${W[1]}) rotate(${handRot})`}><path d="M-48,-30 q48,20 96,-2" stroke={RED} strokeWidth={14} fill="none" strokeLinecap="round" /><path d="M32,-24 q10,40 -2,70" stroke={RED} strokeWidth={6} fill="none" strokeLinecap="round" /></g>}
    </g>
  );
};

// ---------- torso + clothing (front view)
const Torso: React.FC<{ c: Ctx; back?: boolean; dx?: number }> = ({ c, back, dx = 0 }) => {
  const { s, sw, hw, waistX, hemY, id, top, skin, fem } = c; const L = useLight();
  const sh = shadeOf(top, L, 1.25), inner = s.inner || '#d6ccb2';
  const long = s.top === 'shift' || s.top === 'raincoat';
  const flare = s.top === 'shift' ? 210 : s.top === 'raincoat' ? 120 : 0;
  const half: P[] = long
    ? [[0, -2536], [64, -2546], [sw * 0.55, -2520], [sw - 14, -2478], [sw + 4, -2420], [sw - 2, -2300], [sw - 22, -2120], [waistX, -1780], [hw + flare * 0.3, -1500], [hw + flare * 0.75, (-1500 + hemY) / 2], [hw + flare, hemY + 4, 0.35], [hw * 0.55 + flare * 0.5, hemY + 30], [0, hemY + 34]]
    : [[0, -2536], [64, -2546], [sw * 0.55, -2520], [sw - 14, -2478], [sw + 4, -2420], [sw - 2, -2300], [sw - 22, -2120], [waistX, -1780], [hw + (fem ? 8 : 2), -1600], [hw + 12, hemY + 30], [hw + 8, hemY, 0.4], [0, hemY + 16]];
  const d = sym(half);
  const tid = `${id}-torso`;
  const open = s.top === 'jacket' || s.top === 'cardigan';
  return (
    <g>
      <Form id={tid} d={d} c={top} so={sw * 0.55} lo={sw * 0.42} ro={16} soft={12} tilt={0.02} shA={1.1}>
        {/* armpit + side folds, chest plane, belly folds */}
        <Crease d={`M${sw - 40},-2300 C${sw - 80},-2200 ${sw - 100},-2100 ${sw - 120},-1980`} c={sh} w={22} o={0.5} b={12} />
        <Crease d={`M${-sw + 40},-2300 C${-sw + 80},-2200 ${-sw + 100},-2100 ${-sw + 120},-1980`} c={sh} w={18} o={0.3} b={12} />
        {fem && !back && !s.ghost && <><Crease d={`M${-sw * 0.62},-2090 C${-sw * 0.35},-2050 ${-sw * 0.1},-2060 ${-10},-2100`} c={sh} w={18} o={0.45} b={12} /><Crease d={`M${sw * 0.62},-2090 C${sw * 0.35},-2050 ${sw * 0.1},-2060 ${10},-2100`} c={sh} w={18} o={0.55} b={12} /><Patch d={`M${-sw * 0.6},-2280 C${-sw * 0.4},-2320 ${-sw * 0.1},-2300 ${-sw * 0.1},-2200 C${-sw * 0.2},-2140 ${-sw * 0.5},-2150 ${-sw * 0.6},-2200Z`} c={L.keyC} o={0.25} b={24} /></>}
        {!long && <><Crease d={`M${-hw + 30},-1700 C${-hw * 0.4},-1640 ${-hw * 0.1},-1650 ${hw * 0.2},-1700`} c={sh} w={14} o={0.4} /><Crease d={`M${hw * 0.1},-1800 C${hw * 0.4},-1740 ${hw * 0.6},-1700 ${hw - 10},-1660`} c={sh} w={16} o={0.45} /></>}
        {!back && !long && <Crease d={`M${-sw * 0.5},-2380 C${-sw * 0.3},-2340 ${-sw * 0.1},-2330 0,-2350`} c={L.keyC} w={30} o={0.25} b={24} />}
        {long && <>{[-0.55, -0.15, 0.25, 0.6].map((t, i) => <Crease key={i} d={`M${t * hw},-1700 C${t * (hw + flare * 0.5)},-1200 ${t * (hw + flare * 0.8)},-700 ${t * (hw + flare)},${hemY + 20}`} c={i % 2 ? sh : keyOf2(top)} w={i % 2 ? 22 : 16} o={i % 2 ? 0.45 : 0.3} b={12} />)}</>}
        <g transform={`translate(${dx},0)`}>{/* clothing details */}
        {!back && s.top === 'shirt' && <g>
          <path d="M0,-2380 V-1480" stroke={dark(top, 0.35)} strokeWidth={4} opacity={0.6} />
          {[0, 1, 2, 3, 4].map((k) => <circle key={k} cx={-14} cy={-2290 + k * 160} r={10} fill={inner} opacity={0.9} />)}
          {[-1, 1].map((q) => <g key={q}><Patch d={`M${q > 0 ? 80 : -220},-2230 h140 v20 h-140Z`} c={sh} o={0.5} b={3} /><path d={`M${q > 0 ? 80 : -220},-2230 h140 v130 q-70,14 -140,0Z`} fill="none" stroke={dark(top, 0.35)} strokeWidth={3.5} opacity={0.6} /><circle cx={q > 0 ? 150 : -150} cy={-2214} r={8} fill={inner} opacity={0.8} /></g>)}
        </g>}
        {!back && (s.top === 'workshirt') && <g><path d="M0,-2380 V-1620" stroke={dark(top, 0.35)} strokeWidth={4} opacity={0.6} />{[0, 1, 2, 3].map((k) => <circle key={k} cx={-14} cy={-2290 + k * 170} r={10} fill={inner} opacity={0.9} />)}<path d="M-210,-2220 h130 v140 h-130Z" fill={sh} opacity={0.35} /><path d="M-196,-2220 v80 M-160,-2220 v104" stroke="#d9d2b4" strokeWidth={8} opacity={0.8} /></g>}
        {!back && s.top === 'uniform' && <g>
          <path d="M0,-2380 V-1640" stroke={dark(top, 0.35)} strokeWidth={4} opacity={0.6} />
          {[-1, 1].map((q) => <g key={q}><path d={`M${q > 0 ? 70 : -220},-2250 h150 v130 h-150Z`} fill={sh} opacity={0.35} /><path d={`M${q > 0 ? 70 : -220},-2250 h150 l-10,40 h-130Z`} fill={dark(top, 0.25)} opacity={0.6} /></g>)}
          <path d="M-170,-2300 l46,-12 v62 l-46,-12Z" fill="#c4a24a" opacity={0.9} />
        </g>}
        {!back && s.top === 'hoodie' && <g>
          <Form id={tid + 'pk'} d={sp([[-170, -1880, 0.3], [170, -1880, 0.3], [212, -1560, 0.3], [-212, -1560, 0.3]])} c={top} so={40} lo={30} ro={0} rim={false} soft={12}><Crease d="M-180,-1876 H180" c={sh} w={10} o={0.5} b={3} /></Form>
          <path d="M-60,-2420 C-70,-2300 -60,-2200 -70,-2120 M60,-2420 C70,-2300 60,-2200 70,-2120" stroke={inner} strokeWidth={10} fill="none" strokeLinecap="round" />
        </g>}
        {!back && s.top === 'raincoat' && <g><path d="M0,-2420 V-1010" stroke={dark(top, 0.4)} strokeWidth={5} opacity={0.7} />{[-2200, -1980, -1760, -1540].map((y) => <rect key={y} x={-30} y={y} width={40} height={18} rx={6} fill={dark(top, 0.45)} />)}</g>}
        {!back && s.top === 'tshirt' && <Crease d="M-110,-2486 C-60,-2440 60,-2440 110,-2486" c={dark(top, 0.3)} w={10} o={0.6} b={3} />}
        {!back && s.top === 'shift' && <Crease d="M-120,-2490 C-60,-2410 60,-2410 120,-2490" c={dark(top, 0.3)} w={8} o={0.5} b={3} />}
        </g>{/* hem */}
        {!long && <Crease d={`M${-hw - 10},${hemY + 4} C${-hw * 0.4},${hemY + 20} ${hw * 0.4},${hemY + 20} ${hw + 10},${hemY + 4}`} c={dark(top, 0.35)} w={8} o={0.5} b={3} />}
      </Form>
      <g transform={`translate(${dx},0)`}>{/* open front (jacket/cardigan) shows the inner top */}
      {!back && open && <g>
        <Form id={tid + 'in'} d={sp([[-96, -2520, 0.3], [96, -2520, 0.3], [70, -2200], [50, -1700], [44, s.top === 'jacket' ? -1390 : -1500, 0.3], [-44, s.top === 'jacket' ? -1390 : -1500, 0.3], [-50, -1700], [-70, -2200]])} c={inner} so={50} lo={30} ro={0} rim={false} soft={12} />
        {[-1, 1].map((q) => <Form key={q} id={tid + 'lp' + q} d={sp([[q * 40, -2530], [q * 140, -2520], [q * 110, -2300], [q * 80, -2000], [q * 70, s.top === 'jacket' ? -1380 : -1490, 0.3], [q * 44, s.top === 'jacket' ? -1380 : -1490, 0.3], [q * 52, -2000], [q * 60, -2300]])} c={top} so={30} lo={24} ro={8} soft={12}>
          <Crease d={`M${q * 60},-2500 C${q * 80},-2300 ${q * 70},-1900 ${q * 60},-1500`} c={q > 0 ? sh : keyOf2(top)} w={16} o={0.5} />
        </Form>)}
        {s.top === 'cardigan' && [0, 1, 2, 3].map((k) => <circle key={k} cx={56} cy={-2200 + k * 170} r={13} fill={dark(top, 0.35)} />)}
        {s.top === 'jacket' && [-1, 1].map((q) => <g key={q}><path d={`M${q * 120},-1900 h${q * 120} v220 h${-q * 120}Z`} fill={sh} opacity={0.35} /><path d={`M${q * 120},-1900 h${q * 120}`} stroke={dark(top, 0.4)} strokeWidth={5} /></g>)}
      </g>}
      {/* collars */}
      {!back && (s.top === 'shirt' || s.top === 'uniform' || s.top === 'workshirt') && <g>
        <Form id={tid + 'vn'} d={sp([[-58, -2540], [58, -2540], [0, -2400, 0]])} c={s.top === 'uniform' ? inner : skin} so={30} lo={20} ro={0} rim={false} soft={6} />
        {s.top === 'uniform' && <Form id={tid + 'tie'} d={sp([[-18, -2470, 0], [18, -2470, 0], [30, -2000], [0, -1930, 0], [-30, -2000]])} c="#141824" so={20} lo={14} ro={4} soft={6} />}
        {[-1, 1].map((q) => <Form key={q} id={tid + 'col' + q} d={sp([[q * 4, -2400, 0], [q * 66, -2560], [q * 126, -2520, 0.4], [q * 112, -2424, 0]])} c={lite(top, 0.1)} so={30} lo={22} ro={6} soft={6}><Crease d={`M${q * 20},-2420 L${q * 100},-2440`} c={dark(top, 0.3)} w={6} o={0.4} b={3} /></Form>)}
      </g>}
      {!back && s.top === 'hoodie' && <Form id={tid + 'hd'} d={sp([[-150, -2560], [-80, -2600], [80, -2600], [150, -2560], [130, -2470], [60, -2440], [-60, -2440], [-130, -2470]])} c={dark(top, 0.1)} so={40} lo={30} ro={8} soft={12}><Crease d="M-110,-2500 C-40,-2470 40,-2470 110,-2500" c={dark(top, 0.5)} w={14} o={0.6} b={6} /></Form>}
      {!back && s.top === 'raincoat' && <Form id={tid + 'rh'} d={sp([[-170, -2540], [-90, -2600], [90, -2600], [170, -2540], [150, -2460], [0, -2420], [-150, -2460]])} c={dark(top, 0.08)} so={40} lo={30} ro={8} soft={12} />}
      </g>
      {(s.top === 'uniform' || s.top === 'workshirt' || s.top === 'shirt') && !long && s.top !== 'shirt' && <Form id={tid + 'belt'} d={`M${-hw - 6},${hemY - 10} H${hw + 6} V${hemY + 46} H${-hw - 6}Z`} c={s.top === 'uniform' ? '#17110d' : '#2a2018'} so={30} lo={20} ro={6} soft={6} line={2}><rect x={-30} y={hemY - 4} width={60} height={46} fill="none" stroke="#b89a4a" strokeWidth={6} /></Form>}
      {s.top === 'uniform' && !back && [-1, 1].map((q) => <Form key={q} id={tid + 'ep' + q} d={sp([[q * (sw - 130), -2500, 0.3], [q * (sw - 10), -2470, 0.3], [q * (sw - 14), -2430, 0.3], [q * (sw - 134), -2456, 0.3]])} c={dark(top, 0.3)} so={20} lo={14} ro={4} soft={6} />)}
    </g>
  );
};

// ---------- accessories
const Strap: React.FC<{ id: string; a: [number, number]; b: [number, number]; w?: number; c: string }> = ({ id, a, b, w = 44, c }) => (
  <Form id={id} d={ribbon([a, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 20], b], w, w, 4)} c={c} so={16} lo={12} ro={6} soft={6} />
);

// ===== FULL PERSON. view: 'front' | 'three' (three-quarter, facing face = 1 right / -1 left) | 'back'.
// motion: { type, p, ... } from Rig.tsx. pose 'relaxed' (default) = idle breathing; 'straight' = model-sheet stand.
export const FullPerson: React.FC<{ s: Spec; x?: number; y?: number; k?: number; f?: number; expr?: Expr; view?: View; face?: 1 | -1; uid?: string; turn?: number; pose?: 'relaxed' | 'straight'; motion?: Motion; rig?: Rig }> = ({ s, x = 0, y = 0, k = 1, f = 4, expr = 'neutral', view = 'front', face, uid, turn, pose = 'relaxed', motion, rig }) => {
  const L = useLight();
  const fem = s.sex === 'f';
  const sw = (s.sw || (fem ? 262 : 312)) + (fem || s.kid ? 8 : 22), hw = s.hw || (fem ? 240 : 232);
  const waistX = fem ? hw - 44 : (sw + hw) / 2 - 34;
  const legK = s.legK || 1, gs = s.gs || 1, hs = s.hs || (s.kid ? 1.25 : 1.0);
  const dy = 1560 * (1 - legK);
  const id = uid || `${s.id}-${view}-${expr}-${motion?.type || pose}`;
  const acc = (s.acc || []) as string[];
  const c: Ctx = { s, id, fem, sw, hw, waistX, hemY: HEM[s.top], skin: s.skin, top: s.topC, bot: s.botC, view, f, acc, armL: s.armL || 1 };
  const back = view === 'back';
  const three = view === 'three';
  const T = three ? (face ?? (turn !== undefined && turn < 0 ? -1 : 1)) : 0;
  const F = T; // facing used by the rig (0 = toward the camera)
  const R: Rig = rig || motionRig(motion || (s.ghost || pose === 'straight' ? { type: 'still' } : { type: 'idle' }), back ? 0 : F, legK, f);
  const sx = three ? 0.86 : 1;
  const hturn = (turn ?? (three ? 0.6 * T : 0)) + (R.turn || 0);
  const ghostTilt = s.ghost === 'woman' ? 9 + Math.sin(f / 18) * 2 : s.ghost === 'grin' ? Math.sin(f / 22) * 2.2 : s.ghost === 'child' ? Math.sin(f / 20) * 3 : 0;
  const tilt = ghostTilt + (R.tilt || 0) + (R.nod || 0) * (T || 1);
  const headY = s.kid ? -2770 : -2740;
  const headT = `translate(${T * 26},${headY}) rotate(${tilt} 0 200) scale(${hs})`;
  const longHair = s.hairStyle === 'long' || s.hairStyle === 'ghostlong';
  const jit = R.jitter ? Math.sin(f * 2.7) * R.jitter : 0;
  // ---- legs (IK). leg 0 = left / far, leg 1 = right / near
  const P0 = -1540 * legK;
  const hipX = (i: 0 | 1) => (three ? (i === 0 ? T : -T) * hw * 0.34 : (i === 0 ? -1 : 1) * hw * 0.5);
  const legs = ([0, 1] as const).map((i) => {
    const H: XY = [R.pelvis[0] + hipX(i), R.pelvis[1]];
    const Aim: XY = [R.pelvis[0] + hipX(i) + R.ankles[i][0], R.ankles[i][1]];
    const kdir = three ? T : (i === 0 ? -1 : 1);
    const { mid, end } = ik(H, Aim, 760 * legK, 630 * legK, kdir);
    return { H, K: mid, A: end, toe: R.toes[i] };
  });
  // ---- arms (IK or hanging), upper-body coords
  const lean = (three ? T : 0) * R.lean + (view === 'front' && R.lean ? R.lean * 0.08 : 0);
  const shoulder = (i: 0 | 1): XY => (three ? [i === 0 ? T * (sw - 110) : -T * (sw - 70), -2470] : [(i === 0 ? -1 : 1) * (sw - 40), -2470]);
  const A = c.armL, L1 = 470 * A, L2 = 400 * A;
  const arm = (i: 0 | 1) => {
    const S = shoulder(i);
    const out = three ? 0 : (i === 0 ? -1 : 1);
    const tgt = R.hands[i];
    if (tgt) { const { mid, end } = ik(S, tgt, L1, L2, three ? -T : out, true); return { S, E: mid, W: end }; }
    const a1 = ((R.swing[i] * (three ? 1 : 0.15)) * Math.PI) / 180, b1 = ((R.bend[i]) * Math.PI) / 180;
    const fx = three ? T : 1;
    const E: XY = [S[0] + out * L1 * 0.08 + fx * L1 * Math.sin(a1) * (three ? 1 : 0), S[1] + L1 * Math.cos(a1)];
    const W: XY = three ? [E[0] + T * L2 * Math.sin(a1 + b1), E[1] + L2 * Math.cos(a1 + b1)] : [E[0] - out * L2 * 0.04, E[1] + L2 * Math.cos(b1 * 0.7)];
    return { S, E, W };
  };
  const arms = [arm(0), arm(1)];
  const thumbOf = (i: 0 | 1) => (three ? T : (i === 0 ? 1 : -1));
  const redArm = acc.includes('redCord') ? (three ? 1 : 1) : -1; // red cord on the left wrist
  const drawLeg = (i: 0 | 1) => <Leg key={'l' + i} c={c} idx={i} H={legs[i].H} K={legs[i].K} A={legs[i].A} toe={legs[i].toe} F={back ? 0 : F} />;
  const drawArm = (i: 0 | 1) => <Arm key={'a' + i} c={c} idx={i} S={arms[i].S} E={arms[i].E} W={arms[i].W} thumb={thumbOf(i)} red={i === redArm} />;
  const farLeg: 0 | 1 = 0, nearLeg: 0 | 1 = 1;
  const pelvisT = `translate(${R.pelvis[0] + jit},${R.pelvis[1] - P0 + dy}) rotate(${lean} 0 -1560)`;
  const body = (
    <g transform={`scale(${sx},1)`}>
      {!back && longHair && <g transform={pelvisT}><g transform={headT}><HairBack s={s} uid={id + 'B'} /></g></g>}
      {acc.includes('backpack') && !back && <g transform={pelvisT}>{[-1, 1].map((q) => <Form key={q} id={`${id}-bp${q}`} d={sp([[q * (sw - 10), -2380], [q * (sw + 70), -2340], [q * (sw + 80), -1900], [q * (sw + 20), -1840]])} c="#33333a" so={30} lo={20} ro={8} soft={12} />)}</g>}
      {three && <g transform={pelvisT}>{drawArm(0)}</g>}
      {drawLeg(farLeg)}{drawLeg(nearLeg)}
      {(s.bottom === 'trousers' || s.bottom === 'jeans') && <path d={sp([[R.pelvis[0] - hw + 20, R.pelvis[1] - 120], [R.pelvis[0] + hw - 20, R.pelvis[1] - 120], [R.pelvis[0] + hw - 40, R.pelvis[1] + 40], [R.pelvis[0] + 30, R.pelvis[1] + 150], [R.pelvis[0] - 30, R.pelvis[1] + 150], [R.pelvis[0] - hw + 40, R.pelvis[1] + 40]])} fill={c.bot} />}
      <g transform={pelvisT}>
        {!['shift', 'raincoat'].includes(s.top) && s.bottom !== 'skirtLong' && <Patch d={`M${-hw - 20},${c.hemY - 10} H${hw + 20} V${c.hemY + 90} C${hw * 0.5},${c.hemY + 130} ${-hw * 0.5},${c.hemY + 130} ${-hw - 20},${c.hemY + 90}Z`} c="#140810" o={0.3} b={24} />}
        {(s.bottom === 'skirtLong' || s.bottom === 'dressKnee') && (() => {
          const hem = s.bottom === 'skirtLong' ? -300 - dy : -760 * legK - dy; const fl = s.bottom === 'skirtLong' ? 170 : 90;
          const sit = R.pelvis[1] > P0 + 300; // sitting or crouching: skirt folds over the thighs
          const hemY = sit ? Math.min(hem, -1560 + 420) : hem;
          const d = sym([[0, -1790], [hw - 30, -1790], [hw + 20, -1500], [hw + fl * 0.55, (-1500 + hemY) / 2], [hw + fl, hemY + 10, 0.4], [hw * 0.5, hemY + 30], [0, hemY + 20]]);
          return <Form id={`${id}-sk`} d={d} c={s.botC} so={hw * 0.5} lo={hw * 0.4} ro={10} soft={24} tilt={0}>{[-0.6, -0.2, 0.2, 0.6].map((t, i) => <Crease key={i} d={`M${t * hw * 0.7},-1700 C${t * hw},-1300 ${t * (hw + fl * 0.6)},${hemY - 300} ${t * (hw + fl)},${hemY + 20}`} c={i % 2 ? shadeOf(s.botC, L, 1.3) : keyOf2(s.botC)} w={i % 2 ? 22 : 14} o={0.4} />)}</Form>;
        })()}
        <Form id={`${id}-neck`} d={sp(fem || s.kid ? [[-62, -2690], [62, -2690], [66, -2560], [100, -2500], [-100, -2500], [-66, -2560]] : [[-80, -2690], [80, -2690], [86, -2570], [124, -2500], [-124, -2500], [-86, -2570]])} c={s.skin} so={40} lo={24} ro={8} soft={12}>
          <Patch d="M-80,-2720 H80 V-2600 C40,-2570 -40,-2570 -80,-2600Z" c={shadeOf(s.skin, L, 1.4)} o={0.85} b={12} />
          {!fem && !s.kid && <Crease d="M-10,-2620 C-4,-2590 4,-2580 10,-2560" c={shadeOf(s.skin, L)} w={8} o={0.4} b={3} />}
        </Form>
        <g transform={T ? `translate(${T * 8},0)` : ''}><Torso c={c} back={back} dx={T * 70} /></g>
        <Patch d={`M${-sw + 30},-2380 C${-sw + 60},-2100 ${-waistX + 10},-1900 ${-waistX + 30},-1700 L${-waistX - 30},-1700 C${-sw},-2000 ${-sw - 10},-2200 ${-sw - 10},-2380Z`} c="#140810" o={0.25} b={24} />
        <Patch d={`M${sw - 30},-2380 C${sw - 60},-2100 ${waistX - 10},-1900 ${waistX - 30},-1700 L${waistX + 30},-1700 C${sw},-2000 ${sw + 10},-2200 ${sw + 10},-2380Z`} c="#140810" o={0.4} b={24} />
        {acc.includes('backpack') && !back && [-1, 1].map((q) => <Strap key={q} id={`${id}-bs${q}`} a={[q * (sw - 90), -2500]} b={[q * (sw - 60), -1820]} c="#2b2b30" w={50} />)}
        {acc.includes('shawl') && (() => { const scc = s.accC || '#8a7aa0'; const d = sp([[-90, -2566], [90, -2566], [sw + 64, -2476], [sw + 96, -2260], [sw + 80, -2090, 0.4], [sw - 40, -2070], [96, -1990, 0.3], [44, -2290], [0, -2420, 0], [-44, -2290], [-96, -1990, 0.3], [-sw + 40, -2070], [-sw - 80, -2090, 0.4], [-sw - 96, -2260], [-sw - 64, -2476]]); return <Form id={`${id}-shawl`} d={d} c={scc} so={90} lo={70} soft={12}>{[-250, -170, -90, 90, 170, 250].map((xx, i) => <Crease key={i} d={`M${xx * 0.5},-2540 C${xx * 0.85},-2400 ${xx * 1.05},-2250 ${xx * 1.1},-2080`} c={i % 2 ? shadeOf(scc, L, 1.4) : lite(scc, 0.3)} w={i % 2 ? 18 : 10} o={0.5} />)}</Form>; })()}
        {!R.handsFront && (three ? drawArm(1) : <>{drawArm(0)}{drawArm(1)}</>)}
        {acc.includes('satchel') && <g>
          <Strap id={`${id}-sst`} a={back ? [-(sw - 70), -2500] : [sw - 70, -2500]} b={back ? [hw + 20, -1640] : [-hw - 20, -1640]} c="#7a5a3a" w={42} />
          <g transform={`translate(${back ? hw + 40 : -hw - 40},-1520) rotate(${back ? -6 : 6})`}>
            <Form id={`${id}-bag`} d={sp([[-150, -160, 0.4], [150, -160, 0.4], [156, 130, 0.4], [-156, 130, 0.4]])} c="#8a6a44" so={70} lo={50} ro={10} soft={12}><Crease d="M-150,-60 C-60,-40 60,-40 150,-60" c={dark('#8a6a44', 0.4)} w={10} o={0.6} b={3} /></Form>
            <Form id={`${id}-flap`} d={sp([[-154, -164, 0.4], [154, -164, 0.4], [150, -40, 0.4], [-150, -40, 0.4]])} c="#7a5a38" so={50} lo={40} ro={8} soft={12} />
            <rect x={-18} y={-70} width={36} height={56} rx={6} fill="#c6a45a" />
          </g>
        </g>}
        {acc.includes('redScarf') && !back && <g>
          <Form id={`${id}-scf`} d={sp([[-130, -2560], [-60, -2620], [60, -2620], [130, -2560], [120, -2470], [0, -2440], [-120, -2470]])} c={RED} so={50} lo={40} ro={8} soft={12}><Crease d="M-110,-2520 C-40,-2490 40,-2490 110,-2520" c={dark(RED, 0.4)} w={12} o={0.6} b={6} /></Form>
          <Form id={`${id}-sce`} d={ribbon([[50, -2480], [80, -2300], [70, -2120]], 86, 70, 6)} c={RED} so={34} lo={24} ro={8} soft={12}><path d="M30,-2140 l10,30 M60,-2136 l6,30 M90,-2140 l4,30" stroke={dark(RED, 0.3)} strokeWidth={5} /></Form>
        </g>}
        {acc.includes('badge') && !back && <Form id={`${id}-bdg`} d="M140,-2270 l26,-20 l26,20 l-8,34 h-36Z" c="#c4a24a" so={12} lo={10} ro={4} soft={6} />}
        {acc.includes('cane') && (() => { const W = arms[three ? 1 : 0].W; return <g><Form id={`${id}-cane`} d={ribbon([[W[0], W[1] + 60], [W[0] - 20, (W[1] - 1560 - dy) / 2 + 600], [W[0] - 36, -dy - (R.pelvis[1] - P0) - 10]], 26, 26, 4)} c="#4a3422" so={10} lo={8} ro={4} soft={6} /><path d={`M${W[0]},${W[1] + 60} C${W[0]},${W[1] - 10} ${W[0] - 70},${W[1] - 20} ${W[0] - 72},${W[1] + 50}`} stroke="#4a3422" strokeWidth={26} fill="none" strokeLinecap="round" /></g>; })()}
        {acc.includes('handbag') && (() => { const W = arms[three ? 1 : 1].W; return <g transform={`translate(${W[0] + 20},${W[1] + 120})`}><path d="M-60,-40 C-60,-200 60,-200 60,-40" stroke="#4a2a2e" strokeWidth={12} fill="none" /><Form id={`${id}-hb`} d={sp([[-120, -40, 0.4], [120, -40, 0.4], [130, 160, 0.4], [-130, 160, 0.4]])} c="#6a2e34" so={50} lo={40} ro={8} soft={12}><rect x={-26} y={0} width={52} height={30} fill="#c4a24a" /></Form></g>; })()}
        {acc.includes('clipboard') && (() => { const W = arms[three ? 1 : 0].W; return <g transform={`translate(${W[0]},${W[1] + 120}) rotate(4)`}><Form id={`${id}-cb`} d="M-110,-150 H110 V170 H-110Z" c="#8a6a44" so={40} lo={30} ro={8} soft={6} /><rect x={-90} y={-120} width={180} height={270} fill="#ece6d6" /><path d="M-70,-70 H70 M-70,-30 H70 M-70,10 H40 M-70,50 H60" stroke="#8a8478" strokeWidth={6} /><rect x={-40} y={-168} width={80} height={44} rx={8} fill="#9aa0a8" /></g>; })()}
        {acc.includes('puddle') && <Drips y={c.hemY + 30} w={hw} f={f} />}
        {s.hairStyle === 'ghostlong' && !back && [-1, 1].map((q) => <Form key={q} id={`${id}-gs${q}`} d={sp([[q * 70, -2720], [q * 180, -2700], [q * 210, -2400], [q * 214, -2000], [q * 196, -1600], [q * 170, -1380, 0.2], [q * 150, -1560], [q * 120, -1450, 0.2], [q * 104, -1700], [q * 96, -2100], [q * 84, -2500]])} c={s.hair} so={50} lo={30} soft={12} line={3}><Crease d={sp([[q * 120, -2600], [q * 150, -2200], [q * 160, -1700]], false)} c="#5a6680" w={7} o={0.6} b={3} /><Crease d={sp([[q * 170, -2600], [q * 190, -2200], [q * 186, -1800]], false)} c="#5a6680" w={5} o={0.45} b={3} /></Form>)}
        <g transform={headT}>
          {back ? <BackHead s={s} id={id} /> : <Head s={s} expr={expr} f={f} turn={Math.max(-1, Math.min(1, hturn))} uid={id + 'h'} noBack={longHair} />}
        </g>
        {R.handsFront && (three ? drawArm(1) : <>{drawArm(0)}{drawArm(1)}</>)}
      </g>
    </g>
  );
  const lying = R.rot ? `rotate(${R.rot} 0 ${P0}) translate(0,${-P0})` : '';
  return (
    <g transform={`translate(${x},${y}) scale(${k * gs})`}>
      <Painted>
        {!R.rot && (acc.includes('puddle') ? <g><ellipse cx={0} cy={6} rx={460} ry={46} fill="#16222e" opacity={0.85} /><ellipse cx={-40} cy={2} rx={300} ry={22} fill="#7a98ae" opacity={0.25} /></g> : <Ground rx={420} />)}
        <g transform={lying}>{body}</g>
      </Painted>
    </g>
  );
};

// ===== CLOSE-UP (fixes floating heads): the face sits at (0,0) in face units (same size as the old Head/FacePerson),
// but the neck, shoulders and the rest of the body are always attached below it. Let the frame edge crop the body.
export const CloseUp: React.FC<{ s: Spec; expr?: Expr; f?: number; turn?: number; uid?: string; view?: View; face?: 1 | -1; motion?: Motion; light?: unknown }> = ({ s, expr = 'neutral', f = 4, turn, uid, view, face, motion }) => {
  const v: View = view || (turn && Math.abs(turn) > 0.25 ? 'three' : 'front');
  const T = v === 'three' ? (face ?? (turn !== undefined && turn < 0 ? -1 : 1)) : 0;
  const legK = s.legK || 1, gs = s.gs || 1, hs = s.hs || (s.kid ? 1.25 : 1.0);
  const R = motionRig(motion || (s.ghost ? { type: 'still' } : { type: 'idle' }), T, legK, f);
  const hp = headPos(R, T, legK, T * 26, s.kid ? -2770 : -2740);
  const sx = v === 'three' ? 0.86 : 1;
  const kk = 1 / (hs * gs);
  return <FullPerson s={s} view={v} face={T ? (T as 1 | -1) : undefined} turn={turn} expr={expr} f={f} uid={uid || `cu-${s.id}-${expr}`} motion={motion} x={-hp[0] * sx * hs} y={-hp[1] * hs} k={kk} />;
};

// back of the head (hair covers it)
const BackHead: React.FC<{ s: Spec; id: string }> = ({ s, id }) => {
  const L = useLight();
  const hair = s.grey ? '#b9b7b0' : s.hair;
  const skullD = sym([[0, -250], [96, -238], [152, -180], [164, -90], [158, 0], [140, 80], [100, 150], [0, 180]]);
  return (
    <g>
      {[-1, 1].map((q) => <Form key={q} id={`${id}-be${q}`} d={sp([[q * 130, -48], [q * 158, -66], [q * 180, -44], [q * 182, -6], [q * 172, 28], [q * 156, 52], [q * 134, 60]])} c={s.skin} so={20} lo={10} ro={6} soft={6} />)}
      <Form id={`${id}-bn`} d={sym([[0, -20], [76, -20], [80, 120], [90, 250], [0, 260]])} c={s.skin} so={50} lo={20} ro={8} soft={12}><Patch d="M-90,-20 H90 V90 C40,110 -40,110 -90,90Z" c="#1a0c10" o={0.35} b={12} /></Form>
      {s.hairStyle === 'cap' ? <Form id={`${id}-bc`} d={sym([[0, -342], [110, -334], [180, -292], [204, -220], [200, -120], [150, -110], [140, 20], [0, 40]])} c="#1f2a42" so={80} lo={60} ro={12} soft={24} />
        : s.hairStyle === 'bald' ? <Form id={`${id}-bs`} d={skullD} c={s.skin} so={80} lo={60} ro={12} soft={24} />
          : <Form id={`${id}-bh`} d={sym([[0, s.hairStyle === 'greyshort' ? -262 : -340], [112, -322], [174, -266], [196, -176], [188, -80], [162, 0], [112, 44], [60, 58], [0, 50]])} c={hair} so={90} lo={60} ro={12} soft={24}>
            {[-120, -60, 0, 60, 120].map((xx, i) => <Crease key={i} d={`M${xx * 0.2},-320 C${xx * 0.9},-220 ${xx * 1.1},-80 ${xx * 0.8},50`} c={dark(hair, 0.55)} w={10} o={0.55} />)}
            {[-90, -30, 30, 90].map((xx, i) => <Crease key={i} d={`M${xx * 0.2},-310 C${xx * 0.9},-230 ${xx * 1.05},-140 ${xx},-80`} c={mix(hair, '#8a96b8', 0.45)} w={7} o={0.5} b={3} />)}
            <Patch d="M-160,-250 C-60,-330 80,-330 160,-250 C100,-214 -60,-224 -160,-214Z" c={mix(hair, '#8a96b8', 0.4)} o={0.5} b={24} />
          </Form>}
      {s.hairStyle === 'bun' && <Form id={`${id}-bb`} d={sp([[-76, -280], [-44, -346], [30, -356], [90, -314], [84, -256], [10, -238], [-64, -246]])} c={hair} so={40} lo={30} ro={8} soft={12} />}
      {(s.hairStyle === 'long' || s.hairStyle === 'ghostlong') && <Form id={`${id}-bl`} d={sym([[0, -330], [120, -310], [196, -230], [214, -100], [222, 120], [230, s.hairStyle === 'ghostlong' ? 760 : 560, 0.4], [0, s.hairStyle === 'ghostlong' ? 780 : 580]])} c={hair} so={90} lo={60} ro={12} soft={24}>{[-150, -60, 50, 140].map((xx, i) => <Crease key={i} d={`M${xx * 0.3},-300 C${xx},-100 ${xx * 1.2},200 ${xx * 1.3},540`} c={dark(hair, 0.5)} w={12} o={0.5} />)}</Form>}
      {void L}
    </g>
  );
};

// water drips falling from wet ghosts (animated by f)
const Drips: React.FC<{ y: number; w: number; f: number }> = ({ y, w, f }) => (
  <g>{Array.from({ length: 6 }).map((_, i) => { const t = (f / 12 + i * 0.37) % 1; const x = -w * 0.8 + (i * w * 1.6) / 5; return <path key={i} d={`M${x},${y + t * 260} q-10,20 0,32 q10,-12 0,-32Z`} fill="#b4cadb" opacity={0.85 * (1 - t)} />; })}</g>
);
void Mirror;
