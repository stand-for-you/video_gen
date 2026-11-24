import React, { createContext, useContext } from 'react';
// ===== SCROLL KAOS PAINTED KIT (painted cast v3, approved 2026-11-10) =====
// Look: flat colour shapes + soft painted shadow side + warm light side + bright rim light,
// thin coloured lines (no thick black ink), brush grain texture. Light and rim colour come from <LightSet>.

export const RED = '#a8302a';
export const rng = (seed: number) => {
  let a = seed >>> 0 || 1;
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
};
const hx = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
export const mix = (a: string, b: string, t: number) => { const A = hx(a), B = hx(b); return '#' + A.map((v, i) => Math.max(0, Math.min(255, Math.round(v + (B[i] - v) * t))).toString(16).padStart(2, '0')).join(''); };
export const dark = (c: string, t = 0.5) => mix(c, '#140a10', t);
export const lite = (c: string, t = 0.3) => mix(c, '#fff4e2', t);

// ---- scene light (change per scene: warm sunset, cold night, red alarm, etc.)
export type Light = { keyC: string; keyA: number; shade: string; shadeA: number; rim: string; rimA: number; side: 1 | -1; line: number };
// shade = multiply tint for the shadow side (keeps colours rich, like paint); shadeA = strength
export const LIGHT_DEFAULT: Light = { keyC: '#ffe2b8', keyA: 0.26, shade: '#8a6278', shadeA: 0.82, rim: '#ffcf94', rimA: 0.95, side: 1, line: 0.7 };
export const LIGHT_NIGHT: Light = { keyC: '#cfe0ff', keyA: 0.18, shade: '#4a5680', shadeA: 0.95, rim: '#8fc3ff', rimA: 0.9, side: 1, line: 0.72 };
export const LIGHT_EMBER: Light = { keyC: '#ffd3a0', keyA: 0.32, shade: '#7a3a4a', shadeA: 0.95, rim: '#ff8a3c', rimA: 0.95, side: 1, line: 0.72 };
export const LIGHT_GHOST: Light = { keyC: '#e6f4ff', keyA: 0.22, shade: '#5a6c96', shadeA: 0.9, rim: '#bfe8ff', rimA: 0.9, side: 1, line: 0.72 };
// === CINEMATIC LIGHTS (v0.5 â€” matching the reference animation style) ===
// CINEMATIC: warm afternoon sun, strong purple shadow, hot orange rim
export const LIGHT_CINEMATIC: Light = { keyC: '#ffecc8', keyA: 0.38, shade: '#5a3860', shadeA: 0.92, rim: '#ff9a4a', rimA: 1.0, side: 1, line: 0.55 };
// GOLDEN: late-afternoon golden hour, richest contrast
export const LIGHT_GOLDEN: Light = { keyC: '#ffd080', keyA: 0.44, shade: '#6a3250', shadeA: 0.9, rim: '#ffb060', rimA: 1.0, side: 1, line: 0.5 };
// OVERCAST: cool flat daylight, soft shadows, blue-grey rim
export const LIGHT_OVERCAST: Light = { keyC: '#d8e8f8', keyA: 0.22, shade: '#3a4a7a', shadeA: 0.88, rim: '#a8c8f0', rimA: 0.85, side: 1, line: 0.65 };
// INTERIOR_DAY: indoor daylight â€” warm key, blue-grey fill shadow
export const LIGHT_INTERIOR: Light = { keyC: '#fff0d0', keyA: 0.3, shade: '#4a5878', shadeA: 0.85, rim: '#ffc880', rimA: 0.9, side: 1, line: 0.62 };
const LightCtx = createContext<Light>(LIGHT_DEFAULT);
export const useLight = () => useContext(LightCtx);
export const LightSet: React.FC<Partial<Light> & { children?: React.ReactNode }> = ({ children, ...p }) => {
  const L = useContext(LightCtx);
  return <LightCtx.Provider value={{ ...L, ...p } as Light}>{children}</LightCtx.Provider>;
};
export const mul = (a: string, b: string) => { const A = hx(a), B = hx(b); return '#' + A.map((v, i) => Math.round((v * B[i]) / 255).toString(16).padStart(2, '0')).join(''); };
export const shadeOf = (c: string, L: Light, k = 1) => mix(c, mul(c, L.shade), Math.min(1, L.shadeA * k));
export const keyOf = (c: string, L: Light, k = 1) => mix(c, L.keyC, L.keyA * k);
export const lineOf = (c: string, L: Light) => mix(mix(c, '#3a1a12', 0.25), '#12080c', L.line);

// ---- path helpers: smooth closed shapes from points. A 3rd number 0 = sharp corner.
export type P = [number, number] | [number, number, number];
const r1 = (v: number) => Math.round(v * 10) / 10;
export const sp = (pts: P[], closed = true) => {
  const n = pts.length;
  const g = (i: number): P => pts[closed ? ((i % n) + n) % n : Math.max(0, Math.min(n - 1, i))];
  let d = `M${r1(pts[0][0])},${r1(pts[0][1])}`;
  const segs = closed ? n : n - 1;
  for (let i = 0; i < segs; i++) {
    const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2);
    const t1 = p1[2] ?? 1, t2 = p2[2] ?? 1;
    d += ` C${r1(p1[0] + ((p2[0] - p0[0]) / 6) * t1)},${r1(p1[1] + ((p2[1] - p0[1]) / 6) * t1)} ${r1(p2[0] - ((p3[0] - p1[0]) / 6) * t2)},${r1(p2[1] - ((p3[1] - p1[1]) / 6) * t2)} ${r1(p2[0])},${r1(p2[1])}`;
  }
  return d + (closed ? 'Z' : '');
};
// mirror a right half (top centre -> down the +x side -> bottom centre) into a full symmetric shape
export const sym = (half: P[]) => sp([...half, ...half.slice(1, -1).reverse().map((p) => [-p[0], p[1], p[2] ?? 1] as P)]);
export const flipX = (pts: P[]) => pts.map((p) => [-p[0], p[1], p[2] ?? 1] as P);

// ---- shared filters (include once per character; identical copies are harmless)
export const PaintDefs: React.FC = () => (
  <defs>
    {[1, 2, 3, 6, 12, 24, 50].map((s) => (
      <filter key={s} id={`pk-b${s}`} x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation={s} /></filter>
    ))}
    {/* cinematic grain v0.5: denser turbulence, overlay blend for richness */}
    <filter id="pk-tex" x="-2%" y="-2%" width="104%" height="104%" colorInterpolationFilters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.055" numOctaves={4} seed={7} result="t1" />
      <feColorMatrix in="t1" type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0 1" result="g1" />
      <feComponentTransfer in="g1" result="c1"><feFuncR type="linear" slope={0.38} intercept={0.31} /><feFuncG type="linear" slope={0.38} intercept={0.31} /><feFuncB type="linear" slope={0.38} intercept={0.31} /></feComponentTransfer>
      <feBlend in="c1" in2="SourceGraphic" mode="soft-light" result="b1" />
      <feTurbulence type="fractalNoise" baseFrequency="0.32" numOctaves={2} seed={17} result="t2" />
      <feColorMatrix in="t2" type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0 1" result="g2" />
      <feComponentTransfer in="g2" result="c2"><feFuncR type="linear" slope={0.28} intercept={0.36} /><feFuncG type="linear" slope={0.28} intercept={0.36} /><feFuncB type="linear" slope={0.28} intercept={0.36} /></feComponentTransfer>
      <feBlend in="c2" in2="b1" mode="overlay" result="b2" />
      <feComposite in="b2" in2="SourceAlpha" operator="in" />
    </filter>
    {/* cel-shadow: sharp shadow with 1.5px feather — cinematic cel-shading */}
    <filter id="pk-cel" x="-5%" y="-5%" width="110%" height="110%">
      <feGaussianBlur stdDeviation="1.5" />
    </filter>
    {/* depth blur: atmospheric perspective for backgrounds */}
    <filter id="pk-depth" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur stdDeviation="3.5" />
    </filter>
    {/* bloom: glowing light sources */}
    <filter id="pk-bloom" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
);
// wrap a whole character: brush grain inside its silhouette
export const Painted: React.FC<{ children?: React.ReactNode; tex?: boolean }> = ({ children, tex = true }) => (
  <g>
    <PaintDefs />
    <g filter={tex ? 'url(#pk-tex)' : undefined}>{children}</g>
  </g>
);
export const Blur: React.FC<{ s: 1 | 2 | 3 | 6 | 12 | 24 | 50; children?: React.ReactNode; o?: number }> = ({ s, children, o }) => <g filter={`url(#pk-b${s})`} opacity={o}>{children}</g>;
// === CINEMATIC PRIMITIVES (v0.5) ===
// CelShadow: a hard-edged cel shadow shape with 1-2px feather. Put inside a Form clipPath to mask it.
// Use for clothing shadow planes, strong face shadow terminator, or scene cast shadows.
export const CelShadow: React.FC<{ d: string; c: string; o?: number }> = ({ d, c, o = 0.88 }) => (
  <g filter="url(#pk-cel)"><path d={d} fill={c} opacity={o} /></g>
);
// RimLight: a bright rim highlight patch on the lit edge of a form. Blurred for soft glow.
export const RimLight: React.FC<{ d: string; c: string; o?: number }> = ({ d, c, o = 0.75 }) => (
  <g filter="url(#pk-b2)"><path d={d} fill={c} opacity={o} /></g>
);
// DepthBlur: applies atmospheric perspective to background layer objects
export const DepthBlur: React.FC<{ children?: React.ReactNode; o?: number }> = ({ children, o = 1 }) => (
  <g filter="url(#pk-depth)" opacity={o}>{children}</g>
);
// Bloom: glowing light source (window, lamp, eye catch-light)
export const Bloom: React.FC<{ children?: React.ReactNode; o?: number }> = ({ children, o = 1 }) => (
  <g filter="url(#pk-bloom)" opacity={o}>{children}</g>
);
// HairStroke: a single tapered hair strand for the cinematic hair style (layered on top of the hair mass fill)
export const HairStroke: React.FC<{ d: string; c: string; w?: number; o?: number }> = ({ d, c, w = 8, o = 0.7 }) => (
  <path d={d} stroke={c} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={o} />
);

// ---- FORM: one painted volume. d = silhouette, c = base colour.
// so = how far the shadow side reaches in (units), lo = light side, ro = rim width. Children are clipped inside (folds, details).
export const Form: React.FC<{
  id: string; d: string; c: string; so?: number; lo?: number; ro?: number; tilt?: number; line?: number | false; lc?: string;
  sc?: string; shA?: number; rim?: boolean; soft?: 6 | 12 | 24 | 50; children?: React.ReactNode; over?: React.ReactNode; op?: number; hull?: string; lineO?: number;
}> = ({ id, d, c, so = 60, lo = 50, ro = 14, tilt = 0.18, line = 4.5, lc, sc, shA = 1, rim = true, soft = 12, children, over, op, hull, lineO = 0.88 }) => {
  const H = hull || d;
  const L = useLight(); const s = L.side;
  const shC = sc || shadeOf(c, L, shA), keyC = keyOf(c, L), rimC = L.rim;
  return (
    <g opacity={op}>
      <defs>
        <clipPath id={`${id}-c`}><path d={d} /></clipPath>
        <mask id={`${id}-s`}><path d={H} fill="#fff" /><path d={H} fill="#000" transform={`translate(${-s * so},${-so * tilt})`} /></mask>
        <mask id={`${id}-l`}><path d={H} fill="#fff" /><path d={H} fill="#000" transform={`translate(${s * lo},${lo * 0.7})`} /></mask>
        {rim && <mask id={`${id}-r`}><path d={H} fill="#fff" /><path d={H} fill="#000" transform={`translate(${-s * ro},${ro * 0.5})`} /></mask>}
      </defs>
      <path d={d} fill={c} />
      <g clipPath={`url(#${id}-c)`}>
        <g filter={`url(#pk-b${soft})`}><path d={H} fill={keyC} mask={`url(#${id}-l)`} /></g>
        <g filter={`url(#pk-b${soft >= 24 ? 6 : 3})`}><path d={H} fill={shC} mask={`url(#${id}-s)`} /></g>
        {children}
        {rim && <g filter="url(#pk-b3)"><path d={H} fill={rimC} opacity={L.rimA * 0.8} mask={`url(#${id}-r)`} /></g>}
      </g>
      {line !== false && <path d={d} fill="none" stroke={lc || lineOf(c, L)} strokeWidth={line} strokeLinejoin="round" opacity={lineO} />}
      {over}
    </g>
  );
};
// soft painted stroke (fold, crease, wrinkle) - put inside a Form so it is clipped
export const Crease: React.FC<{ d: string; c: string; w?: number; o?: number; b?: 3 | 6 | 12 | 24 }> = ({ d, c, w = 10, o = 0.5, b = 6 }) => (
  <g filter={`url(#pk-b${b})`}><path d={d} stroke={c} strokeWidth={w} fill="none" strokeLinecap="round" opacity={o} /></g>
);
// soft painted patch (blush, glow, cast shadow)
export const Patch: React.FC<{ d: string; c: string; o?: number; b?: 3 | 6 | 12 | 24 | 50 }> = ({ d, c, o = 0.5, b = 12 }) => (
  <g filter={`url(#pk-b${b})`}><path d={d} fill={c} opacity={o} /></g>
);
export const Speck: React.FC<{ id: string; d: string; seed: number; n?: number; col: string; op?: number; r?: number; box: [number, number, number, number] }> = ({ id, d, seed, n = 200, col, op = 0.35, r = 2, box }) => {
  const q = rng(seed);
  return (<g><clipPath id={id}><path d={d} /></clipPath><g clipPath={`url(#${id})`}>{Array.from({ length: n }).map((_, i) => <circle key={i} cx={box[0] + q() * box[2]} cy={box[1] + q() * box[3]} r={0.7 + q() * r} fill={col} opacity={op * (0.4 + q() * 0.8)} />)}</g></g>);
};
// ground contact shadow
export const Ground: React.FC<{ rx: number; o?: number }> = ({ rx, o = 0.35 }) => <Patch d={`M${-rx},0 a${rx},${rx * 0.09} 0 1,0 ${rx * 2},0 a${rx},${rx * 0.09} 0 1,0 ${-rx * 2},0Z`} c="#0a0610" o={o} b={12} />;

// ===== painted hand, hanging and relaxed. Wrist at (0,0), fingers point down (+y). thumb toward -x. len ~ 320.
export const PHand: React.FC<{ id: string; skin: string; x?: number; y?: number; rot?: number; k?: number; flip?: boolean; long?: number; nails?: string }> = ({ id, skin, x = 0, y = 0, rot = 0, k = 1, flip, long = 1, nails }) => {
  const L = useLight(); const ln = lineOf(skin, L), sh = shadeOf(skin, L);
  const F = long, Fy = (v: number) => 140 + (v - 140) * F; // finger length factor (ghosts have long fingers)
  const d = sp([[44, -10], [58, 60], [66, 140], [64, Fy(200)], [58, Fy(244)], [48, Fy(256), 0.6], [38, Fy(246), 0.2], [34, Fy(266)], [28, Fy(290)], [18, Fy(298), 0.6], [9, Fy(290), 0.2], [6, Fy(304)], [-2, Fy(314)], [-14, Fy(314), 0.6], [-22, Fy(302), 0.2], [-26, Fy(294)], [-34, Fy(284), 0.6], [-40, Fy(262)], [-42, Fy(224)], [-42, 196], [-50, 192], [-62, 196, 0.6], [-74, 176], [-78, 130], [-68, 78], [-54, 28], [-44, -10]]);
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${k},${k})`}><Mirror on={!!flip}>
      <Form id={id} d={d} c={skin} so={46} lo={30} ro={8} soft={6}>
        {[[38, Fy(246)], [9, Fy(290)], [-22, Fy(302)]].map(([xx, yy], i) => <Crease key={i} d={`M${xx},${yy} C${xx + 2},${yy - 40} ${xx + 4},${160} ${xx + 6},${150}`} c={dark(ln, 0.1)} w={4} o={0.6} b={3} />)}
        <Crease d={`M-40,${Fy(230)} C-44,200 -46,190 -50,192`} c={ln} w={4} o={0.5} b={3} />
        <Crease d="M-36,60 C-46,110 -52,150 -54,190" c={sh} w={12} o={0.6} />
        <Crease d={`M-30,148 C-6,160 30,160 62,146`} c={sh} w={14} o={0.4} />
        {[[50, 150], [24, 160], [-4, 162], [-30, 156]].map(([xx, yy], i) => <ellipse key={i} cx={xx} cy={yy} rx={10} ry={7} fill={L.keyC} opacity={0.35} />)}
        <Patch d="M-10,20 C10,10 40,20 46,80 C40,110 0,110 -10,80Z" c={L.keyC} o={0.25} b={12} />
        <Crease d={`M50,${Fy(180)} C52,${Fy(220)} 50,${Fy(240)} 46,${Fy(250)}`} c={sh} w={10} o={0.45} />
        {nails && [44, 18, -10, -34].map((q, i) => <ellipse key={i} cx={q} cy={Fy([246, 286, 302, 282][i])} rx={8} ry={11} fill={nails} opacity={0.7} />)}
      </Form>
    </Mirror></g>
  );
};
// ---- sample a smooth open curve (same maths as sp) into n points per segment
export const samp = (pts: P[], n = 8): [number, number][] => {
  const out: [number, number][] = []; const N = pts.length; const g = (i: number) => pts[Math.max(0, Math.min(N - 1, i))];
  for (let i = 0; i < N - 1; i++) {
    const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2);
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    for (let k = 0; k < n; k++) { const t = k / n, u = 1 - t; out.push([u * u * u * p1[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * p2[0], u * u * u * p1[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * p2[1]]); }
  }
  out.push([pts[N - 1][0], pts[N - 1][1]]); return out;
};
// tapered ribbon along a spine (hair lock, strand, scarf end). w0 = width at root, tip tapers to 0.
export const ribbon = (spine: P[], w0: number, w1 = 0, n = 8) => {
  const s = samp(spine, n); const L: string[] = [], R: string[] = [];
  s.forEach((p, i) => {
    const a = s[Math.max(0, i - 1)], b = s[Math.min(s.length - 1, i + 1)];
    let nx = -(b[1] - a[1]), ny = b[0] - a[0]; const m = Math.hypot(nx, ny) || 1; nx /= m; ny /= m;
    const t = i / (s.length - 1); const root = t < 0.2 ? 0.25 + 0.75 * Math.sin((t / 0.2) * Math.PI / 2) : 1; const tip = w1 === 0 && t > 0.45 ? 1 - ((t - 0.45) / 0.55) ** 1.5 : 1; const w = (w0 * (1 - t) + (w1 || w0 * 0.6) * t) * root * tip / 2;
    L.push(`${r1(p[0] + nx * w)},${r1(p[1] + ny * w)}`); R.unshift(`${r1(p[0] - nx * w)},${r1(p[1] - ny * w)}`);
  });
  return `M${L.join(' L')} L${R.join(' L')}Z`;
};
// mirror a group left-right but keep the light coming from the same side
export const Mirror: React.FC<{ on?: boolean; children?: React.ReactNode }> = ({ on = true, children }) => {
  const L = useLight();
  if (!on) return <>{children}</>;
  return <g transform="scale(-1,1)"><LightCtx.Provider value={{ ...L, side: (-L.side) as 1 | -1 }}>{children}</LightCtx.Provider></g>;
};
// MASS: several shapes painted as ONE volume (hair = mass + locks). One light pass over the union, rim only on the hull's outer edge.
export const Mass: React.FC<{ id: string; ds: string[]; c: string; hull: string; so?: number; lo?: number; ro?: number; soft?: 6 | 12 | 24 | 50; children?: React.ReactNode; line?: string; lineO?: number }> = ({ id, ds, c, hull, so = 80, lo = 60, ro = 12, soft = 24, children, line, lineO = 0.35 }) => {
  const L = useLight(); const s = L.side;
  return (
    <g>
      <defs>
        <clipPath id={`${id}-c`}>{ds.map((d, i) => <path key={i} d={d} />)}</clipPath>
        <mask id={`${id}-s`}><path d={hull} fill="#fff" /><path d={hull} fill="#000" transform={`translate(${-s * so},${-so * 0.15})`} /></mask>
        <mask id={`${id}-l`}><path d={hull} fill="#fff" /><path d={hull} fill="#000" transform={`translate(${s * lo},${lo * 0.7})`} /></mask>
        <mask id={`${id}-r`}><path d={hull} fill="#fff" /><path d={hull} fill="#000" transform={`translate(${-s * ro},${ro * 0.5})`} /></mask>
      </defs>
      {ds.map((d, i) => <path key={i} d={d} fill={c} />)}
      <g clipPath={`url(#${id}-c)`}>
        <g filter={`url(#pk-b${soft})`}><path d={hull} fill={keyOf(c, L)} mask={`url(#${id}-l)`} /></g>
        <g filter="url(#pk-b6)"><path d={hull} fill={shadeOf(c, L)} mask={`url(#${id}-s)`} /></g>
        {children}
        <g filter="url(#pk-b3)"><path d={hull} fill={L.rim} opacity={L.rimA} mask={`url(#${id}-r)`} /></g>
      </g>
      {line && ds.map((d, i) => <path key={i} d={d} fill="none" stroke={line} strokeWidth={2} opacity={lineO} />)}
    </g>
  );
};
// tapered limb along a spine with a width per spine point (thigh -> knee -> ankle, shoulder -> elbow -> wrist)
export const ribbonW = (spine: P[], ws: number[], n = 8) => {
  const s = samp(spine, n); const Lft: string[] = [], Rgt: string[] = [];
  s.forEach((p, i) => {
    const a = s[Math.max(0, i - 1)], b = s[Math.min(s.length - 1, i + 1)];
    let nx = -(b[1] - a[1]), ny = b[0] - a[0]; const m = Math.hypot(nx, ny) || 1; nx /= m; ny /= m;
    const seg = Math.min(ws.length - 2, Math.floor(i / n)), t = i / n - seg;
    const w = (ws[seg] + (ws[seg + 1] - ws[seg]) * Math.min(1, t)) / 2;
    Lft.push(`${Math.round(p[0] + nx * w)},${Math.round(p[1] + ny * w)}`); Rgt.unshift(`${Math.round(p[0] - nx * w)},${Math.round(p[1] - ny * w)}`);
  });
  return `M${Lft.join(' L')} L${Rgt.join(' L')}Z`;
};



