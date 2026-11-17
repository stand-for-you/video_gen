import React from 'react';
import { AbsoluteFill } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import { CamSpec, CamState, camAt, CamRig, project, toVertical } from './k3/Cam';
import { V3 } from './k3/core';
// ===== STAGE: one shot = a 3D world + the moving camera + a flat overlay (tags, labels, subtitles) drawn on top.
// Every set is a React component that gets { t, len, v, cam } and returns 3D parts (and may ask for tags through useTags).
export type SetP = { t: number; len: number; v: any; W: number; H: number; vert: boolean; tag: (x: TagReq) => void };
export type TagReq = { at: V3; text: string; to?: [number, number]; side?: 1 | -1; at2?: number; big?: boolean };
// A set may also export `overlay`: flat things drawn ON TOP of the 3D picture (title cards, the end screen text, explain boxes).
export type Set3 = React.FC<SetP> & { cam?: (v: any, t: number, len: number) => CamSpec; camR?: (v: any, t: number, len: number) => CamSpec; overlay?: React.FC<SetP> };
const TagLayer: React.FC<{ tags: TagReq[]; cs: CamState; W: number; H: number; t: number }> = ({ tags, cs, W, H, t }) => (
  <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0 }}>
    {tags.map((g, i) => {
      const [x, y, front] = project(cs, W, H, g.at); if (!front) return null;
      const k = Math.max(0, Math.min(1, (t - (g.at2 ?? 0.15)) / 0.5)); if (k <= 0) return null;
      const side = g.side ?? (x > W * 0.5 ? -1 : 1);
      const lx = Math.max(W * 0.06, Math.min(W * 0.94, x + side * W * (g.to ? 0 : 0.13))), ly = Math.max(H * 0.07, Math.min(H * 0.93, y - H * 0.09));
      const fs = (g.big ? 0.034 : 0.026) * H; const w = g.text.length * fs * 0.58 + fs * 0.9, h = fs * 1.7;
      const bx = side > 0 ? lx : lx - w;
      return (
        <g key={i} opacity={k * (k < 1 ? k : 1)}>
          <path d={`M${x},${y} L${bx + (side > 0 ? 0 : w)},${ly + h / 2}`} stroke="#ffffff" strokeWidth={2} opacity={0.75} strokeDasharray={`${200 * k} 400`} />
          <circle cx={x} cy={y} r={4} fill="#b3221f" />
          <rect x={bx} y={ly} width={w * k} height={h} rx={4} fill="#06070b" opacity={0.82} />
          <rect x={bx} y={ly} width={w * k} height={h} rx={4} fill="none" stroke="#e8dcc4" strokeWidth={1.5} opacity={0.5} />
          {k > 0.45 && <text x={bx + fs * 0.45} y={ly + h * 0.7} fill="#f2e6cf" fontFamily="Lora, Georgia, serif" fontWeight={700} fontSize={fs} letterSpacing={1}>{g.text.toUpperCase()}</text>}
        </g>
      );
    })}
  </svg>
);
export const Stage3: React.FC<{ S: Set3; v: any; t: number; len: number; W: number; H: number; vert?: boolean; children?: React.ReactNode }> = ({ S, v, t, len, W, H, vert = false, children }) => {
  const base: CamSpec = vert && S.camR ? S.camR(v, t, len) : S.cam ? (vert ? toVertical(S.cam(v, t, len)) : S.cam(v, t, len)) : { p: [0, 1.7, 6], l: [0, 1.2, 0] };
  const spec = base;
  const cs = camAt(spec, t, len);
  const tags: TagReq[] = []; const tag = (x: TagReq) => tags.push(x);
  return (
    <AbsoluteFill style={{ background: '#05070b' }}>
      <ThreeCanvas linear={false} width={W} height={H} camera={{ fov: cs.fov, position: cs.pos }} gl={{ antialias: false, powerPreference: 'high-performance' }}>
        <CamRig s={cs} W={W} H={H} />
        <S t={t} len={len} v={v} W={W} H={H} vert={vert} tag={tag} />
      </ThreeCanvas>
      <TagLayer tags={tags} cs={cs} W={W} H={H} t={t} />
      {S.overlay ? <S.overlay t={t} len={len} v={v} W={W} H={H} vert={vert} tag={tag} /> : null}
      {children}
    </AbsoluteFill>
  );
};
// vignette + grain-free film tone on top of every shot (keeps the night look even, never flashes)
export const Grade: React.FC<{ W: number; H: number; warm?: number }> = ({ W, H, warm = 0 }) => (
  <AbsoluteFill style={{ pointerEvents: 'none', background: `radial-gradient(ellipse at 50% 48%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.55) 100%)` }}>
    {warm > 0 && <AbsoluteFill style={{ background: `rgba(255,150,60,${0.05 * warm})`, mixBlendMode: 'overlay' }} />}
  </AbsoluteFill>
);
