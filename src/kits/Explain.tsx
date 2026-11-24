import React from 'react';
// ===== SCROLL KAOS EXPLAIN KIT (v0.4): on-picture explanation, the healthy thing from the reference Shorts.
// When the narration names a body part, a size, a sound, a rule or a time, POINT AT IT: a tag with a leader line, a height bar,
// a cut-away bubble that zooms into a detail, pulse rings for sounds, a waveform tag for a voice line.
// Rules: English only; 1-3 words per tag (UPPERCASE); max 3 tags on screen at once; tags pop in WITH the spoken word (t0) and stay
// at least 1.2 s; never cover a face; use the cream ink for facts, the red ink only for the one danger fact. All motion is eased.
const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const eo = (t: number) => 1 - Math.pow(1 - clamp(t), 3);
const pop = (t: number) => { const c = clamp(t); const s = 1.9; return 1 + (s + 1) * Math.pow(c - 1, 3) + s * Math.pow(c - 1, 2); };
export const INKS = { cream: '#efe4cc', red: '#e0483c', dark: '#0b0d12', line: '#efe4cc' };
export const TAG_FONT = "'Noto Sans', 'DejaVu Sans', 'Liberation Sans', sans-serif";
type XY = [number, number];
const sec = (f: number, t0: number) => f / 30 - t0;

// ---------- TAG: anchor dot -> leader line (elbow) -> label pill. at = point on the thing, to = where the label sits.
export const Tag: React.FC<{ at: XY; to: XY; text: string; f: number; t0?: number; red?: boolean; size?: number; icon?: 'wave' | 'eye' | 'ruler' | 'none'; out?: number }> = ({ at, to, text, f, t0 = 0, red = false, size = 30, icon = 'none', out }) => {
  const t = sec(f, t0); if (t < 0) return null;
  const fade = out !== undefined ? 1 - clamp((f / 30 - out) / 0.3) : 1; if (fade <= 0) return null;
  const c = red ? INKS.red : INKS.cream;
  const a = eo(t / 0.35), b = pop((t - 0.2) / 0.35);
  const elbow: XY = [to[0], at[1] + (to[1] - at[1]) * 0.15];
  const pad = size * 0.55, iw = icon === 'none' ? 0 : size * 1.25; const tw = text.length * size * 0.66 + pad * 2 + iw, th = size * 1.6;
  const left = to[0] < at[0];
  const bx = left ? to[0] - tw : to[0], by = to[1] - th / 2;
  const L = Math.hypot(elbow[0] - at[0], elbow[1] - at[1]) + Math.hypot(to[0] - elbow[0], to[1] - elbow[1]);
  return (
    <g opacity={fade}>
      <circle cx={at[0]} cy={at[1]} r={size * 0.32 * eo(t / 0.2)} fill={c} />
      <circle cx={at[0]} cy={at[1]} r={size * (0.5 + 0.9 * ((t * 0.8) % 1))} fill="none" stroke={c} strokeWidth={2} opacity={0.6 * (1 - ((t * 0.8) % 1))} />
      <path d={`M${at[0]},${at[1]} L${elbow[0]},${elbow[1]} L${to[0]},${to[1]}`} stroke={c} strokeWidth={size * 0.1} fill="none" strokeDasharray={`${L * a} ${L}`} strokeLinejoin="round" />
      <g transform={`translate(${left ? bx + tw : bx},${to[1]}) scale(${b}) translate(${left ? -tw : 0},${-th / 2})`} opacity={clamp(b * 1.5)}>
        <rect x={0} y={0} width={tw} height={th} rx={th * 0.22} fill={INKS.dark} opacity={0.88} stroke={c} strokeWidth={size * 0.07} />
        {icon === 'wave' && [0, 1, 2, 3, 4].map((i) => { const hh = th * (0.2 + 0.45 * Math.abs(Math.sin(f / 4 + i * 1.3))); return <rect key={i} x={pad * 0.7 + i * size * 0.2} y={th / 2 - hh / 2} width={size * 0.1} height={hh} fill={c} rx={2} />; })}
        {icon === 'eye' && <g transform={`translate(${pad * 0.7 + size * 0.45},${th / 2})`}><path d={`M${-size * 0.45},0 Q0,${-size * 0.4} ${size * 0.45},0 Q0,${size * 0.4} ${-size * 0.45},0Z`} fill="none" stroke={c} strokeWidth={3} /><path d={`M${-size * 0.5},${size * 0.4} L${size * 0.5},${-size * 0.4}`} stroke={c} strokeWidth={3} /></g>}
        {icon === 'ruler' && <g transform={`translate(${pad * 0.7},${th / 2})`}><path d={`M0,${-size * 0.4} V${size * 0.4} M${size * 0.8},${-size * 0.4} V${size * 0.4} M0,0 H${size * 0.8}`} stroke={c} strokeWidth={3} /></g>}
        <text x={pad + iw} y={th / 2 + size * 0.36} fill={c} fontFamily={TAG_FONT} fontWeight={800} fontSize={size} letterSpacing={size * 0.06}>{text}</text>
      </g>
    </g>
  );
};

// ---------- MEASURE: vertical height bar from ground (y1) to top (y0) at x, ticks, label in the middle. Grows up from the ground.
export const Measure: React.FC<{ x: number; y0: number; y1: number; text: string; f: number; t0?: number; side?: 1 | -1; size?: number }> = ({ x, y0, y1, text, f, t0 = 0, side = 1, size = 30 }) => {
  const t = sec(f, t0); if (t < 0) return null;
  const g = eo(t / 0.8); const top = y1 + (y0 - y1) * g; const c = INKS.cream;
  const n = 10;
  return (
    <g>
      <path d={`M${x},${y1} V${top}`} stroke={c} strokeWidth={4} strokeDasharray="14 10" />
      <path d={`M${x - 22},${y1} H${x + 22} M${x - 22},${top} H${x + 22}`} stroke={c} strokeWidth={5} />
      {Array.from({ length: n }).map((_, i) => { const yy = y1 + ((top - y1) * (i + 1)) / (n + 1); return <path key={i} d={`M${x},${yy} h${side * 12}`} stroke={c} strokeWidth={2.5} opacity={0.8} />; })}
      <g opacity={clamp((t - 0.5) / 0.3)} transform={`translate(${x + side * 30},${(y0 + y1) / 2})`}>
        <rect x={side > 0 ? 0 : -(text.length * size * 0.66 + size)} y={-size * 0.8} width={text.length * size * 0.66 + size} height={size * 1.6} rx={size * 0.3} fill={INKS.dark} opacity={0.88} stroke={c} strokeWidth={2} />
        <text x={side > 0 ? size * 0.5 : -(text.length * size * 0.66 + size) + size * 0.5} y={size * 0.36} fill={c} fontFamily={TAG_FONT} fontWeight={800} fontSize={size} letterSpacing={size * 0.06}>{text}</text>
      </g>
    </g>
  );
};

// ---------- CUTAWAY: a round bubble that zooms into a detail (children drawn in the bubble's own coords, centre 0,0, radius r).
// at = the detail on the main picture; c = bubble centre. Red ring + tail, like an X-ray / magnifier.
export const Cutaway: React.FC<{ at: XY; c: XY; r: number; f: number; t0?: number; children: React.ReactNode; label?: string; red?: boolean; id: string; bg?: string }> = ({ at, c, r, f, t0 = 0, children, label, red = true, id, bg = '#140c10' }) => {
  const t = sec(f, t0); if (t < 0) return null;
  const s = pop(t / 0.45); const ring = red ? INKS.red : INKS.cream;
  const ang = Math.atan2(at[1] - c[1], at[0] - c[0]);
  const e: XY = [c[0] + Math.cos(ang) * r * s, c[1] + Math.sin(ang) * r * s];
  return (
    <g>
      <path d={`M${at[0]},${at[1]} L${e[0]},${e[1]}`} stroke={ring} strokeWidth={4} opacity={eo(t / 0.3)} />
      <circle cx={at[0]} cy={at[1]} r={10} fill="none" stroke={ring} strokeWidth={4} opacity={eo(t / 0.3)} />
      <g transform={`translate(${c[0]},${c[1]}) scale(${s})`}>
        <defs><clipPath id={`${id}-cc`}><circle r={r} /></clipPath></defs>
        <circle r={r + 14} fill={ring} opacity={0.95} />
        <circle r={r} fill={bg} />
        <g clipPath={`url(#${id}-cc)`}>{children}</g>
        <circle r={r} fill="none" stroke="#000" strokeWidth={6} opacity={0.5} />
        {label && <g transform={`translate(0,${r + 46})`}><rect x={-label.length * 12 - 22} y={-26} width={label.length * 24 + 44} height={46} rx={12} fill={INKS.dark} stroke={ring} strokeWidth={3} /><text x={0} y={8} textAnchor="middle" fill={ring} fontFamily={TAG_FONT} fontWeight={800} fontSize={26} letterSpacing={2}>{label}</text></g>}
      </g>
    </g>
  );
};

// ---------- PULSE: expanding rings at a point (a sound, a knock, a heartbeat). Smooth loop.
export const Pulse: React.FC<{ at: XY; f: number; t0?: number; r?: number; n?: number; red?: boolean; speed?: number }> = ({ at, f, t0 = 0, r = 160, n = 3, red = false, speed = 1 }) => {
  const t = sec(f, t0); if (t < 0) return null; const c = red ? INKS.red : INKS.cream;
  return <g>{Array.from({ length: n }).map((_, i) => { const u = ((t * 0.7 * speed + i / n) % 1); return <circle key={i} cx={at[0]} cy={at[1]} r={r * (0.15 + u)} fill="none" stroke={c} strokeWidth={5 * (1 - u)} opacity={0.75 * (1 - u)} />; })}</g>;
};

// ---------- SOUND TAG: waveform + quoted words, e.g. a voice from the dark. Words appear one by one with the narration.
export const SoundTag: React.FC<{ at: XY; to: XY; quote: string; f: number; t0?: number; red?: boolean; size?: number }> = ({ at, to, quote, f, t0 = 0, red = true, size = 30 }) => (
  <Tag at={at} to={to} text={`"${quote.toUpperCase()}"`} f={f} t0={t0} red={red} size={size} icon="wave" />
);

// ---------- FILE BANNER: thin top strip like a case file ("FILE 07 · ALDER ROAD // THE SCREAM"). Stays on during a chapter.
export const FileBanner: React.FC<{ W: number; left: string; right?: string; f: number; t0?: number; y?: number }> = ({ W, left, right, f, t0 = 0, y = 34 }) => {
  const a = eo(sec(f, t0) / 0.6);
  return (
    <g opacity={0.75 * a} fontFamily={TAG_FONT} fontWeight={700} fontSize={20} letterSpacing={4} fill={INKS.cream}>
      <text x={40} y={y}>{left.toUpperCase()}</text>
      {right && <text x={W - 40} y={y} textAnchor="end">{right.toUpperCase()}</text>}
      <rect x={40} y={y + 12} width={(W - 80) * a} height={1.5} fill={INKS.cream} opacity={0.4} />
    </g>
  );
};

// ---------- ARROW: dashed path drawing itself from a to b (a path the creature took, where a sound came from)
export const PathArrow: React.FC<{ d: string; f: number; t0?: number; secs?: number; red?: boolean; w?: number }> = ({ d, f, t0 = 0, secs = 1.2, red = false, w = 5 }) => {
  const t = sec(f, t0); if (t < 0) return null; const p = eo(t / secs); const c = red ? INKS.red : INKS.cream;
  return (<g><path d={d} stroke={c} strokeWidth={w} fill="none" pathLength={1} strokeDasharray={`${p} 1`} strokeLinecap="round" opacity={0.9} /><path d={d} stroke={INKS.dark} strokeWidth={w * 0.4} fill="none" pathLength={100} strokeDasharray="2 3" opacity={0.6} /></g>);
};
