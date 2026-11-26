import React, { useMemo } from 'react';
import { rng } from './Kit';
import { HUD } from './Annot';
// ============================================================================
// ANATOMY CUTAWAY PANELS (v0.5)
// The red cross-section diagrams from the Night Protocol monster short: an organic
// wobbly slice of the creature, pale rim, deep red flesh, and the organ that the
// narration is talking about drawn inside it (two voice boxes, a brain full of
// meaningless signal dots, a mirror layer, a heat pit).
//
// These are NOT medical pictures and never show a human body being cut. They are
// diagrams of an invented creature only - the same limit as quality-law 4d.
//
// Draw them in world space inside a set, usually floating beside the creature.
// Every panel breathes (quality law 4e: nothing is ever a frozen picture).
// ============================================================================

export const A = {
  rim: '#f2e6cf',        // pale rim of the slice
  flesh: '#9c1f22',      // deep red body
  fleshD: '#6a1317',     // shaded red
  fleshL: '#c8373a',     // lit red
  bone: '#ded3bd',
  signal: '#5fe3a8',     // green signal dots
  spark: '#f0c34a',      // yellow memory dots
  cool: '#6fd9e0',       // teal mirror arc
  void: '#2a0a0c',
};

// ---------------------------------------------------------------------------
// A wobbly closed slice outline. Seeded, so the same panel is the same shape
// every frame, but it swells very slowly so the diagram is alive.
// ---------------------------------------------------------------------------
const blobPath = (r: number, n: number, seed: number, wob: number, f: number) => {
  const q = rng(seed);
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const jitter = 0.78 + q() * 0.34;
    const breathe = 1 + Math.sin(f / 26 + i * 0.9) * wob;
    const rr = r * jitter * breathe;
    pts.push([Math.cos(a) * rr, Math.sin(a) * rr * 0.92]);
  }
  // Catmull-Rom -> cubic bezier, closed
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d + 'Z';
};

export const Slice: React.FC<{
  x?: number; y?: number; r?: number; seed?: number; f?: number; wob?: number;
  rim?: number; children?: React.ReactNode;
}> = ({ x = 0, y = 0, r = 300, seed = 7, f = 0, wob = 0.012, rim = 16, children }) => {
  const d = useMemo(() => blobPath(r, 13, seed, wob, Math.floor(f / 3) * 3), [r, seed, wob, Math.floor(f / 3)]);
  const cid = `slice${seed}`;
  return (
    <g transform={`translate(${x},${y})`}>
      <defs>
        <clipPath id={cid}><path d={d} /></clipPath>
        <radialGradient id={`${cid}g`} cx="0.38" cy="0.32" r="0.78">
          <stop offset="0" stopColor={A.fleshL} /><stop offset="0.62" stopColor={A.flesh} /><stop offset="1" stopColor={A.fleshD} />
        </radialGradient>
      </defs>
      <path d={d} fill={`url(#${cid}g)`} stroke={A.rim} strokeWidth={rim} strokeLinejoin="round" />
      <g clipPath={`url(#${cid})`}>
        {/* inner wall shading so the slice reads as thick tissue, not a flat blob */}
        <path d={d} fill="none" stroke={A.fleshD} strokeWidth={r * 0.17} opacity={0.5} />
        {children}
      </g>
    </g>
  );
};

// ---------------------------------------------------------------------------
// Organ primitives, all breathing.
// ---------------------------------------------------------------------------
export const Sac: React.FC<{ x: number; y: number; r: number; c?: string; f?: number; ph?: number; stroke?: string }> =
  ({ x, y, r, c = A.bone, f = 0, ph = 0, stroke = A.rim }) => {
    const k = 1 + Math.sin(f / 14 + ph) * 0.055;
    return (
      <g transform={`translate(${x},${y}) scale(${k})`}>
        <circle r={r} fill={c} stroke={stroke} strokeWidth={r * 0.14} />
        <circle r={r * 0.52} fill="#fff" opacity={0.18} cx={-r * 0.22} cy={-r * 0.24} />
      </g>
    );
  };

export const Tube: React.FC<{ d: string; w: number; c?: string; stroke?: string; f?: number; ph?: number }> =
  ({ d, w, c = A.bone, stroke = A.rim, f = 0, ph = 0 }) => {
    const k = 1 + Math.sin(f / 16 + ph) * 0.07;
    return (
      <g>
        <path d={d} fill="none" stroke={stroke} strokeWidth={w * k + w * 0.3} strokeLinecap="round" strokeLinejoin="round" />
        <path d={d} fill="none" stroke={c} strokeWidth={w * k} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    );
  };

// Signal dots: the "just sounds / no meaning" brain, the "memory sparks" mirror layer.
export const Scatter: React.FC<{
  n?: number; r: number; dot?: number; c?: string; seed?: number; f?: number; drift?: number;
}> = ({ n = 9, r, dot = 11, c = A.signal, seed = 3, f = 0, drift = 14 }) => {
  const base = useMemo(() => {
    const q = rng(seed);
    return Array.from({ length: n }, () => [(q() - 0.5) * r * 1.7, (q() - 0.5) * r * 1.5, q() * 6.3] as [number, number, number]);
  }, [n, r, seed]);
  return (
    <g>
      {base.map(([bx, by, ph], i) => (
        <circle key={i} cx={bx + Math.sin(f / 21 + ph) * drift} cy={by + Math.cos(f / 25 + ph) * drift}
          r={dot} fill={c} opacity={0.65 + 0.35 * Math.abs(Math.sin(f / 17 + ph))} />
      ))}
    </g>
  );
};

// A reflecting arc: the "mirror layer" that copies a voice back.
export const MirrorArc: React.FC<{ r: number; c?: string; f?: number; w?: number }> =
  ({ r, c = A.cool, f = 0, w = 14 }) => (
    <g>
      {[0, 1, 2].map((i) => {
        const k = ((f / 18 + i / 3) % 1);
        return <path key={i} d={`M${-r * 0.1},${-r * (0.72 - k * 0.1)} A ${r * 0.72},${r * 0.86} 0 0 0 ${-r * 0.1},${r * (0.72 - k * 0.1)}`}
          fill="none" stroke={c} strokeWidth={w} opacity={0.85 * (1 - k)} strokeLinecap="round" />;
      })}
    </g>
  );

// ---------------------------------------------------------------------------
// Ready-made panels. `kind` picks the organ; the scene table supplies the label
// text through the normal annotation layer, so nothing is hard-coded to one story.
// ---------------------------------------------------------------------------
export type PanelKind = 'voice' | 'mind' | 'mirror' | 'heat' | 'gut' | 'plain';

export const Panel: React.FC<{
  kind?: PanelKind; x?: number; y?: number; r?: number; seed?: number; f?: number;
}> = ({ kind = 'plain', x = 0, y = 0, r = 300, seed = 7, f = 0 }) => (
  <Slice x={x} y={y} r={r} seed={seed} f={f}>
    {kind === 'voice' && (
      <g>
        {/* a throat that forks into two voice boxes: the creature can hold two voices at once */}
        <Tube d={`M0,${-r * 0.95} V${-r * 0.1} M0,${-r * 0.1} C${-r * 0.1},${r * 0.2} ${-r * 0.42},${r * 0.26} ${-r * 0.44},${r * 0.48}`} w={r * 0.17} f={f} />
        <Tube d={`M0,${-r * 0.1} C${r * 0.1},${r * 0.2} ${r * 0.34},${r * 0.26} ${r * 0.36},${r * 0.5}`} w={r * 0.13} f={f} ph={1.6} />
        <Sac x={-r * 0.44} y={r * 0.5} r={r * 0.22} f={f} />
        <Sac x={r * 0.36} y={r * 0.52} r={r * 0.17} c={A.spark} f={f} ph={1.9} />
      </g>
    )}
    {kind === 'mind' && (
      <g>
        <ellipse rx={r * 0.62} ry={r * 0.5} fill={A.void} opacity={0.55} />
        <Scatter n={10} r={r * 0.6} dot={r * 0.045} c={A.signal} seed={seed + 2} f={f} />
      </g>
    )}
    {kind === 'mirror' && (
      <g>
        <ellipse rx={r * 0.64} ry={r * 0.52} fill="#f6eedd" opacity={0.9} />
        <MirrorArc r={r} f={f} w={r * 0.05} />
        <Scatter n={8} r={r * 0.5} dot={r * 0.04} c={A.spark} seed={seed + 5} f={f} drift={r * 0.03} />
      </g>
    )}
    {kind === 'heat' && (
      <g>
        {[0.9, 0.66, 0.42].map((k, i) => (
          <ellipse key={i} rx={r * k * 0.7} ry={r * k * 0.58}
            fill={i === 2 ? A.spark : 'none'} stroke={A.spark} strokeWidth={r * 0.035}
            opacity={0.35 + i * 0.22 + 0.12 * Math.sin(f / 15 + i)} />
        ))}
      </g>
    )}
    {kind === 'gut' && (
      <Tube d={`M${-r * 0.5},${-r * 0.4} C${r * 0.5},${-r * 0.5} ${-r * 0.5},${r * 0.1} ${r * 0.45},${r * 0.2} C${-r * 0.2},${r * 0.5} ${r * 0.1},${r * 0.7} ${-r * 0.2},${r * 0.66}`}
        w={r * 0.2} f={f} />
    )}
  </Slice>
);

// ---------------------------------------------------------------------------
// Scale comparison: the creature next to a thing the viewer already knows
// (the reference used an anglerfish and a lyrebird). Both silhouettes sit on one
// baseline with a height tick between them.
// ---------------------------------------------------------------------------
export const ScaleRow: React.FC<{
  W: number; baseY: number; f?: number;
  left: React.ReactNode; right: React.ReactNode; gap?: number;
}> = ({ W, baseY, f = 0, left, right, gap = 0.46 }) => (
  <g>
    <line x1={W * 0.06} y1={baseY} x2={W * 0.94} y2={baseY} stroke={HUD.line} strokeWidth={2.4} opacity={0.5} strokeDasharray="12 10" />
    <g transform={`translate(${W * (0.5 - gap / 2)},${baseY}) translate(0,${Math.sin(f / 30) * 4})`}>{left}</g>
    <g transform={`translate(${W * (0.5 + gap / 2)},${baseY}) translate(0,${Math.sin(f / 30 + 2) * 4})`}>{right}</g>
  </g>
);
