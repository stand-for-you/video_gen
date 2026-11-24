import React from 'react';
import { rng } from '../Kit';
// ===== SCROLL KAOS BLOOD KIT (v0.4). Use ONLY when the story itself has blood. Show it clearly and well painted:
// wet gloss, dark edges, drips that grow, pools that spread, writing that is painted stroke by stroke.
// Platform line (channel policy): blood on walls, floors, hands, mouths, clothes and fabric = allowed (flag age-restriction risk).
// NEVER: open wounds, gore, organs, cut bodies, or a person being hurt on screen (cut to the aftermath instead). No blood on thumbnails.
// All animation is smooth: pass f (1/30 s) and the second the event starts (t0).
export const B = { base: '#6e0d10', mid: '#8e1416', hi: '#c43a2e', dark: '#2a0406', dry: '#4a1a14', gloss: '#ffd9c8' };
const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const eo = (t: number) => 1 - Math.pow(1 - clamp(t), 3);

// one-time filter defs (rough brush edge). Put <BloodDefs/> once inside the <svg> (Stage already renders children inside an svg).
export const BloodDefs: React.FC = () => (
  <defs>
    <filter id="bl-rough" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves={2} seed={4} result="n" /><feDisplacementMap in="SourceGraphic" in2="n" scale={9} /></filter>
    <filter id="bl-soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation={2.2} /></filter>
    <filter id="bl-blur6" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation={6} /></filter>
  </defs>
);

// ---------- POOL: irregular spreading pool with a dark rim and a wet highlight. grow 0..1
export const BloodPool: React.FC<{ x: number; y: number; r: number; grow?: number; seed?: number; flat?: number; f?: number }> = ({ x, y, r, grow = 1, seed = 1, flat = 0.32, f = 0 }) => {
  const q = rng(seed); const n = 14; const g = 0.15 + 0.85 * eo(grow);
  const lobes = Array.from({ length: n }, () => 0.7 + q() * 0.55);
  const pts = lobes.map((l, i) => { const a = (i / n) * Math.PI * 2; const rr = r * g * l * (1 + 0.02 * Math.sin(f / 40 + i)); return [x + Math.cos(a) * rr, y + Math.sin(a) * rr * flat]; });
  const d = 'M' + pts.map((p, i) => { const nx = pts[(i + 1) % n]; const mx = (p[0] + nx[0]) / 2, my = (p[1] + nx[1]) / 2; return `${p[0].toFixed(1)},${p[1].toFixed(1)} Q${p[0].toFixed(1)},${p[1].toFixed(1)} ${mx.toFixed(1)},${my.toFixed(1)}`; }).join(' ') + 'Z';
  return (
    <g>
      <path d={d} fill={B.dark} transform={`translate(0,${r * 0.02})`} opacity={0.9} />
      <path d={d} fill={B.base} />
      <path d={d} fill={B.mid} transform={`translate(${x * 0.12},${y * 0.12}) scale(0.88)`} opacity={0.55} />
      <ellipse cx={x - r * g * 0.25} cy={y - r * g * flat * 0.25} rx={r * g * 0.35} ry={r * g * flat * 0.12} fill={B.gloss} opacity={0.32} filter="url(#bl-soft)" />
      <ellipse cx={x + r * g * 0.2} cy={y - r * g * flat * 0.05} rx={r * g * 0.12} ry={r * g * flat * 0.05} fill={B.gloss} opacity={0.4} />
    </g>
  );
};

// ---------- DRIPS running down a wall from a start line. Each drip grows after t0 (seconds) and ends in a bead.
export const WallDrips: React.FC<{ x: number; y: number; w: number; f: number; t0?: number; n?: number; maxL?: number; seed?: number; width?: number }> = ({ x, y, w, f, t0 = 0, n = 6, maxL = 260, seed = 2, width = 14 }) => {
  const q = rng(seed); const t = f / 30 - t0;
  return (<g>{Array.from({ length: n }).map((_, i) => {
    const xx = x + q() * w, L = maxL * (0.35 + q() * 0.65), sp = 0.25 + q() * 0.5, delay = q() * 1.5, ww = width * (0.6 + q() * 0.6);
    const l = L * eo((t - delay) * sp); if (l <= 1) return null;
    return <g key={i}>
      <path d={`M${xx - ww / 2},${y} C${xx - ww / 2},${y + l * 0.6} ${xx - ww * 0.32},${y + l} ${xx},${y + l} C${xx + ww * 0.32},${y + l} ${xx + ww / 2},${y + l * 0.6} ${xx + ww / 2},${y}Z`} fill={B.base} />
      <ellipse cx={xx} cy={y + l} rx={ww * 0.62} ry={ww * 0.72} fill={B.base} />
      <path d={`M${xx - ww * 0.18},${y + 4} V${y + l * 0.9}`} stroke={B.hi} strokeWidth={ww * 0.18} opacity={0.5} />
      <circle cx={xx - ww * 0.2} cy={y + l - ww * 0.2} r={ww * 0.16} fill={B.gloss} opacity={0.5} />
    </g>;
  })}</g>);
};

// ---------- SPATTER: drops flung from a point in a direction (deg). Static (aftermath) or fly-in with t0.
export const Spatter: React.FC<{ x: number; y: number; dir?: number; spread?: number; size?: number; n?: number; seed?: number; f?: number; t0?: number }> = ({ x, y, dir = 0, spread = 70, size = 120, n = 34, seed = 6, f, t0 }) => {
  const q = rng(seed); const live = f !== undefined && t0 !== undefined ? eo((f / 30 - t0) / 0.35) : 1;
  return (<g>{Array.from({ length: n }).map((_, i) => {
    const a = ((dir + (q() - 0.5) * spread) * Math.PI) / 180, dist = size * (0.2 + Math.pow(q(), 0.7) * 1.6) * live, r = size * 0.06 * (1.3 - dist / (size * 1.8)) * (0.4 + q());
    const cx = x + Math.cos(a) * dist, cy = y + Math.sin(a) * dist; const el = 1 + dist / size;
    return <ellipse key={i} cx={cx} cy={cy} rx={Math.max(1, r * el)} ry={Math.max(1, r)} transform={`rotate(${(a * 180) / Math.PI} ${cx} ${cy})`} fill={i % 5 ? B.base : B.dark} />;
  })}<circle cx={x} cy={y} r={size * 0.12} fill={B.base} /></g>);
};

// ---------- HANDPRINT (palm + long fingers) with an optional drag smear. rot in degrees.
export const HandPrint: React.FC<{ x: number; y: number; s?: number; rot?: number; drag?: number; long?: number; o?: number }> = ({ x, y, s = 1, rot = 0, drag = 0, long = 1, o = 1 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`} opacity={o} filter="url(#bl-rough)">
    {drag > 0 && <path d={`M-60,0 C-60,${drag * 0.6} -40,${drag} 0,${drag} C40,${drag} 60,${drag * 0.6} 60,0Z`} fill={B.base} opacity={0.55} />}
    <path d="M-58,-10 C-62,-70 -40,-104 0,-104 C40,-104 62,-70 58,-10 C54,40 30,60 0,60 C-30,60 -54,40 -58,-10Z" fill={B.base} />
    {[[-44, -100, 86], [-16, -108, 104], [14, -106, 98], [40, -96, 80]].map(([fx, fy, L], i) => <path key={i} d={`M${fx - 11},${fy} C${fx - 12},${fy - L * long * 0.7} ${fx - 8},${fy - L * long} ${fx},${fy - L * long} C${fx + 8},${fy - L * long} ${fx + 12},${fy - L * long * 0.7} ${fx + 11},${fy}Z`} fill={B.base} />)}
    <path d="M-56,-6 C-90,-30 -110,-60 -104,-80 C-90,-84 -70,-50 -48,-34Z" fill={B.base} />
    <ellipse cx={-14} cy={-40} rx={22} ry={10} fill={B.dark} opacity={0.4} />
  </g>
);

// ---------- SMEAR: a wide wiped streak along a path (finger or hand dragged). p 0..1 reveal.
export const Smear: React.FC<{ d: string; w?: number; p?: number; o?: number }> = ({ d, w = 60, p = 1, o = 0.9 }) => (
  <g filter="url(#bl-rough)" opacity={o}>
    <path d={d} stroke={B.dark} strokeWidth={w * 1.08} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${p} 1`} opacity={0.6} />
    <path d={d} stroke={B.base} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${p} 1`} />
    {[0.25, 0.5, 0.75].map((k, i) => <path key={i} d={d} stroke={i === 1 ? B.hi : B.dark} strokeWidth={w * 0.08} fill="none" transform={`translate(0,${(k - 0.5) * w * 0.7})`} pathLength={1} strokeDasharray={`${p} 1`} opacity={0.45} />)}
  </g>
);

// ---------- STAIN on fabric or carpet (soaked in, soft edge, no gloss)
export const Stain: React.FC<{ x: number; y: number; r: number; seed?: number; grow?: number; flat?: number; o?: number }> = ({ x, y, r, seed = 3, grow = 1, flat = 0.6, o = 0.85 }) => {
  const q = rng(seed); const g = 0.2 + 0.8 * eo(grow);
  return (<g opacity={o} filter="url(#bl-blur6)">{Array.from({ length: 7 }).map((_, i) => <ellipse key={i} cx={x + (q() - 0.5) * r * g} cy={y + (q() - 0.5) * r * g * flat} rx={r * g * (0.3 + q() * 0.4)} ry={r * g * flat * (0.3 + q() * 0.4)} fill={i % 2 ? B.dry : B.base} />)}</g>);
};

// ===== FINGER-PAINTED WRITING (own stroke font, capitals A-Z, 0-9 and ' ? ! . ,). Each stroke is painted in order.
// text: '\n' for new lines. p = how much is written (0..1); or pass f + t0 + secs to animate. Drips grow under finished strokes.
type Stroke = number[][];
const G: Record<string, Stroke[]> = {
  A: [[[0, 100], [30, 0], [60, 100]], [[12, 62], [48, 62]]], B: [[[0, 100], [0, 0], [38, 0], [52, 12], [52, 36], [38, 48], [0, 48]], [[0, 48], [42, 48], [58, 62], [58, 86], [42, 100], [0, 100]]],
  C: [[[58, 14], [44, 0], [16, 0], [0, 20], [0, 80], [16, 100], [44, 100], [58, 86]]], D: [[[0, 0], [0, 100], [34, 100], [56, 78], [56, 22], [34, 0], [0, 0]]],
  E: [[[56, 0], [0, 0], [0, 100], [56, 100]], [[0, 50], [40, 50]]], F: [[[56, 0], [0, 0], [0, 100]], [[0, 50], [40, 50]]],
  G: [[[58, 14], [44, 0], [16, 0], [0, 20], [0, 80], [16, 100], [44, 100], [58, 84], [58, 56], [32, 56]]], H: [[[0, 0], [0, 100]], [[56, 0], [56, 100]], [[0, 50], [56, 50]]],
  I: [[[10, 0], [10, 100]]], J: [[[50, 0], [50, 80], [36, 100], [14, 100], [0, 84]]], K: [[[0, 0], [0, 100]], [[54, 0], [0, 58]], [[16, 44], [56, 100]]],
  L: [[[0, 0], [0, 100], [52, 100]]], M: [[[0, 100], [0, 0], [32, 58], [64, 0], [64, 100]]], N: [[[0, 100], [0, 0], [56, 100], [56, 0]]],
  O: [[[28, 0], [6, 12], [0, 50], [6, 88], [28, 100], [50, 88], [56, 50], [50, 12], [28, 0]]], P: [[[0, 100], [0, 0], [40, 0], [56, 14], [56, 36], [40, 50], [0, 50]]],
  Q: [[[28, 0], [6, 12], [0, 50], [6, 88], [28, 100], [50, 88], [56, 50], [50, 12], [28, 0]], [[34, 72], [60, 104]]], R: [[[0, 100], [0, 0], [40, 0], [56, 14], [56, 36], [40, 50], [0, 50]], [[24, 50], [58, 100]]],
  S: [[[56, 12], [40, 0], [16, 0], [0, 16], [4, 36], [52, 62], [58, 82], [42, 100], [14, 100], [0, 86]]], T: [[[0, 0], [60, 0]], [[30, 0], [30, 100]]],
  U: [[[0, 0], [0, 78], [14, 100], [42, 100], [56, 78], [56, 0]]], V: [[[0, 0], [30, 100], [60, 0]]], W: [[[0, 0], [16, 100], [36, 40], [56, 100], [72, 0]]],
  X: [[[0, 0], [56, 100]], [[56, 0], [0, 100]]], Y: [[[0, 0], [30, 50], [60, 0]], [[30, 50], [30, 100]]], Z: [[[0, 0], [56, 0], [0, 100], [56, 100]]],
  "'": [[[10, 0], [6, 24]]], '?': [[[0, 16], [14, 0], [40, 0], [54, 16], [52, 34], [28, 52], [28, 72]], [[28, 92], [28, 100]]], '!': [[[10, 0], [10, 70]], [[10, 90], [10, 100]]],
  '.': [[[6, 92], [6, 100]]], ',': [[[8, 88], [2, 104]]],
  '0': [[[28, 0], [6, 12], [0, 50], [6, 88], [28, 100], [50, 88], [56, 50], [50, 12], [28, 0]]], '1': [[[10, 14], [24, 0], [24, 100]]], '2': [[[0, 16], [16, 0], [40, 0], [54, 16], [54, 34], [0, 100], [56, 100]]],
  '3': [[[0, 10], [16, 0], [42, 0], [54, 14], [52, 36], [30, 48], [54, 62], [56, 86], [40, 100], [14, 100], [0, 88]]], '4': [[[44, 100], [44, 0], [0, 66], [60, 66]]],
  '5': [[[54, 0], [6, 0], [2, 44], [36, 40], [56, 58], [56, 84], [40, 100], [12, 100], [0, 88]]], '6': [[[50, 6], [30, 0], [10, 10], [0, 40], [0, 80], [14, 100], [40, 100], [56, 82], [54, 58], [36, 46], [14, 48], [0, 60]]],
  '7': [[[0, 0], [56, 0], [20, 100]]], '8': [[[28, 0], [6, 10], [6, 36], [28, 48], [52, 60], [56, 82], [40, 100], [16, 100], [0, 82], [4, 60], [28, 48], [50, 36], [50, 10], [28, 0]]],
  '9': [[[54, 40], [40, 52], [14, 50], [0, 34], [2, 12], [20, 0], [42, 0], [56, 20], [56, 60], [44, 92], [20, 100]]],
};
const adv = (ch: string) => (ch === ' ' ? 44 : ch === 'I' || ch === '1' ? 38 : ch === "'" || ch === '.' || ch === ',' || ch === '!' ? 30 : ch === 'M' || ch === 'W' ? 96 : 82);
const plen = (s: Stroke) => s.slice(1).reduce((a, p, i) => a + Math.hypot(p[0] - s[i][0], p[1] - s[i][1]), 0);
// layout: returns strokes in writing order, in text units (cap height 100), plus total width per line
export const writingLayout = (text: string, slant = 8, seed = 5) => {
  const q = rng(seed); const out: { pts: number[][]; len: number }[] = []; const lines = text.toUpperCase().split('\n'); const widths: number[] = [];
  lines.forEach((ln, li) => {
    let x = 0; const y0 = li * 150;
    for (const ch of ln) {
      const g = G[ch]; const lift = (q() - 0.5) * 14, rot = (q() - 0.5) * 0.08, sc = 0.92 + q() * 0.16;
      if (g) g.forEach((s) => { const pts = s.map(([px, py]) => { const X = px * sc, Y = py * sc; return [x + X * Math.cos(rot) - Y * Math.sin(rot) + (100 - Y) * (slant / 100) + (q() - 0.5) * 4, y0 + lift + X * Math.sin(rot) + Y * Math.cos(rot) + (q() - 0.5) * 4]; }); out.push({ pts, len: plen(pts) }); });
      x += adv(ch) * (0.95 + q() * 0.1);
    }
    widths.push(x);
  });
  return { strokes: out, widths, lines: lines.length };
};
export const BloodWriting: React.FC<{ text: string; x: number; y: number; size?: number; p?: number; f?: number; t0?: number; secs?: number; drips?: boolean; seed?: number; slant?: number; align?: 'left' | 'center'; dry?: number }> = ({ text, x, y, size = 120, p, f = 0, t0 = 0, secs = 6, drips = true, seed = 5, slant = 8, align = 'center', dry = 0 }) => {
  const Lo = writingLayout(text, slant, seed); const total = Lo.strokes.reduce((a, s) => a + s.len, 0);
  const prog = p ?? clamp((f / 30 - t0) / secs);
  const k = size / 100; const W = Math.max(...Lo.widths);
  const ox = align === 'center' ? x - (W * k) / 2 : x;
  const w = 15; // stroke width in text units (finger)
  let acc = 0; const q = rng(seed + 7);
  const now = f / 30;
  const col = dry > 0 ? B.dry : B.base;
  return (
    <g transform={`translate(${ox},${y}) scale(${k})`}>
      <g filter="url(#bl-rough)">
        {Lo.strokes.map((s, i) => { const st = acc / total; acc += s.len; const fr = clamp((prog * total - (acc - s.len)) / s.len); if (fr <= 0) return null; const d = 'M' + s.pts.map((pp) => `${pp[0].toFixed(1)},${pp[1].toFixed(1)}`).join(' L'); void st; return (
          <g key={i}>
            <path d={d} stroke={B.dark} strokeWidth={w + 3} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${fr} 1`} opacity={0.7} />
            <path d={d} stroke={col} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${fr} 1`} />
            <path d={d} stroke={B.hi} strokeWidth={w * 0.22} fill="none" strokeLinecap="round" transform="translate(-2,-2)" pathLength={1} strokeDasharray={`${fr} 1`} opacity={dry > 0 ? 0.1 : 0.55} />
          </g>); })}
      </g>
      {drips && (() => { let a2 = 0; return Lo.strokes.map((s, i) => {
        a2 += s.len; const doneAt = t0 + (a2 / total) * secs; const since = p !== undefined ? (prog >= a2 / total ? 3 : -1) : now - doneAt; if (since <= 0) return null;
        const low = s.pts.reduce((m, pp) => (pp[1] > m[1] ? pp : m), s.pts[0]); if (q() < 0.35) return null; const L = (60 + q() * 160) * eo(since / (2.5 + q() * 2));
        const ww = 6 + q() * 5; const xx = low[0], yy = low[1] + 4;
        return <g key={'d' + i}><path d={`M${xx - ww / 2},${yy} C${xx - ww / 2},${yy + L * 0.6} ${xx - ww * 0.3},${yy + L} ${xx},${yy + L} C${xx + ww * 0.3},${yy + L} ${xx + ww / 2},${yy + L * 0.6} ${xx + ww / 2},${yy}Z`} fill={col} /><ellipse cx={xx} cy={yy + L} rx={ww * 0.65} ry={ww * 0.75} fill={col} /></g>;
      }); })()}
    </g>
  );
};
// the moving fingertip position while writing (to place a creature hand on it): text units -> world
export const writingTip = (text: string, x: number, y: number, size: number, prog: number, slant = 8, seed = 5, align: 'left' | 'center' = 'center'): [number, number] => {
  const Lo = writingLayout(text, slant, seed); const total = Lo.strokes.reduce((a, s) => a + s.len, 0); const k = size / 100; const W = Math.max(...Lo.widths); const ox = align === 'center' ? x - (W * k) / 2 : x;
  let acc = 0; const target = clamp(prog) * total;
  for (const s of Lo.strokes) { if (acc + s.len >= target) { let r = target - acc; for (let i = 1; i < s.pts.length; i++) { const a = s.pts[i - 1], b = s.pts[i]; const l = Math.hypot(b[0] - a[0], b[1] - a[1]); if (r <= l) { const t = r / (l || 1); return [ox + k * (a[0] + (b[0] - a[0]) * t), y + k * (a[1] + (b[1] - a[1]) * t)]; } r -= l; } } acc += s.len; }
  const last = Lo.strokes[Lo.strokes.length - 1].pts.slice(-1)[0]; return [ox + k * last[0], y + k * last[1]];
};
