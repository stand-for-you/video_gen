import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Stage, Cam } from './Post';
import { ChapterCard } from './Card';
import { CAMERA } from './camera';
import { AnnotLayer, type AnnotItem } from './Annot';
export type Shot = { s: number; e: number; set: string; v: any; close: boolean; z: number; fx: number; fy: number; dir: number; off: number };
export const find = (shots: Shot[], fr: number) => { let lo = 0, hi = shots.length - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (shots[m].s <= fr) lo = m; else hi = m - 1; } return shots[lo]; };
// Main camera habit comes from src/camera.ts (change it for every new look kit). All moves are STEPPED (12 steps per shot).
//   push = slow dolly in   pull = slow zoom-out reveal   truck = sideways glide   rise = slow crane up   still = locked, tiny drift
export const camOf = (sh: Shot, local: number, W: number, H: number): Cam => {
  const len = Math.max(1, sh.e - sh.s); const p = Math.floor(Math.min(1, local / len) * 12) / 12;
  if (['end', 'crtoff', 'qcard', 'rcrtoff', 'rqcard'].includes(sh.set)) return { z: 1, fx: W / 2, fy: H / 2, tx: 0, ty: 0 };
  const m = CAMERA;
  if (!sh.close) {
    if (m === 'push') return { z: 1.03 + 0.08 * p, fx: W / 2 + sh.dir * 10, fy: H / 2 - 8 * p, tx: 0, ty: 0 };
    if (m === 'pull') return { z: 1.11 - 0.08 * p, fx: W / 2 + sh.dir * 10, fy: H / 2 + 6 * p, tx: 0, ty: 0 };
    if (m === 'truck') return { z: 1.08, fx: W / 2 + sh.dir * (W * 0.035) * (2 * p - 1), fy: H / 2, tx: 0, ty: 0 };
    if (m === 'rise') return { z: 1.08, fx: W / 2, fy: H / 2 + (H * 0.035) * (1 - 2 * p), tx: 0, ty: 0 };
    return { z: 1.05 + 0.01 * p, fx: W / 2 + sh.dir * 4 * p, fy: H / 2, tx: 0, ty: 0 };
  }
  const k = m === 'push' ? 0.94 + 0.1 * p : m === 'pull' ? 1.05 - 0.09 * p : 1.0;
  const z = sh.z * k; const hw = W / (2 * z), hh = H / (2 * z);
  const dx = m === 'truck' ? sh.dir * 40 * (2 * p - 1) : 0, dy = m === 'rise' ? 40 * (1 - 2 * p) : 0;
  const fx = Math.min(W - hw + 30, Math.max(hw - 30, sh.fx + dx)), fy = Math.min(H - hh + 30, Math.max(hh - 30, sh.fy + dy));
  return { z, fx, fy, tx: 0, ty: 0 };
};
// Annotations (v0.5) come from the scene table as v.an and are drawn ABOVE Stage, in
// screen space, so the paper/grain/boil filters never soften the label text. They still
// track their world point through `cam`, so a dot stays stuck to the thing it names.
// The annotation clock is the shot-local frame (NOT f = local*3 + off), so a label's
// `at:` is read in real frames and a reveal never restarts mid-shot.
export const ShotView: React.FC<{ sh: Shot; frame: number; W: number; H: number; SETS: Record<string, React.FC<{ f: number; v: any }>>; mark?: string }> = ({ sh, frame, W, H, SETS, mark }) => {
  const local = frame - sh.s; const S = SETS[sh.set];
  const cam = camOf(sh, local, W, H);
  const an: AnnotItem[] | undefined = sh.v && sh.v.an;
  const card = ['end', 'crtoff', 'qcard', 'rcrtoff', 'rqcard'].includes(sh.set);
  return (
    <>
      <Stage W={W} H={H} frame={frame} cam={cam}><S f={local * 3 + sh.off} v={sh.v} /></Stage>
      <AnnotLayer items={an} cam={cam} W={W} H={H} f={local} mark={card ? undefined : mark} />
    </>
  );
};
export const makeVideo = (data: { shots: Shot[]; chapters: { s: number; n: number; title: string }[] }, W: number, H: number, SETS: any, vertical = false, mark?: string) => {
  const C: React.FC = () => {
    const frame = useCurrentFrame(); const sh = find(data.shots, frame);
    const ch = data.chapters.find((c) => frame >= c.s && frame < c.s + 31);
    return (<AbsoluteFill><ShotView sh={sh} frame={frame} W={W} H={H} SETS={SETS} mark={mark} />{ch && <ChapterCard W={W} H={H} t={frame - ch.s} n={ch.n} title={ch.title} vertical={vertical} />}</AbsoluteFill>);
  };
  return C;
};
// QA sheets render the annotation layer too, so a label that covers a face or runs
// off the frame is caught on the contact sheet instead of in the finished video.
export const makeQA = (data: { shots: Shot[] }, W: number, H: number, SETS: any, mark?: string) => {
  const C: React.FC = () => { const i = useCurrentFrame(); const sh = data.shots[Math.min(i, data.shots.length - 1)]; const mid = Math.floor((sh.s + sh.e) / 2); return <ShotView sh={sh} frame={mid} W={W} H={H} SETS={SETS} mark={mark} />; };
  return C;
};
