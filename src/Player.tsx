import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Stage, Cam } from './Post';
import { ChapterCard } from './Card';
import { CAMERA } from './camera';
import ENG from '../engine.json';
// ===== SCROLL KAOS PLAYER v0.4 (smooth): native 30 fps, continuous eased camera, soft dissolves, 1:1 animation time.
// Time unit for every set: f = 1/30 s. A set receives f (= t + off, keeps loops alive), t (frames since the shot started) and len (shot length in frames).
export const FPS: number = (ENG as any).fps || 30;
const DIS: number = (ENG as any).dissolve ?? 8;
export type Shot = { b: number; s: number; e: number; set: string; v: any; close: boolean; z: number; fx: number; fy: number; dir: number; off: number; fr?: string; cm?: string };
export type SetProps = { f: number; v: any; t?: number; len?: number };
export const find = (shots: Shot[], fr: number) => { let lo = 0, hi = shots.length - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (shots[m].s <= fr) lo = m; else hi = m - 1; } return lo; };
const eio = (t: number) => { const c = Math.max(0, Math.min(1, t)); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
const esin = (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * Math.max(0, Math.min(1, t)));
// Main camera habit from src/camera.ts; a shot may override it with v.cm (push | pull | truck | rise | still | orbit).
// CONTINUOUS moves (eased in and out over the whole shot), never stepped. Moves are slow enough to keep faces and text sharp.
export const camOf = (sh: Shot, local: number, W: number, H: number): Cam => {
  const len = Math.max(1, sh.e - sh.s); const p = esin(local / len);
  if (['end', 'qcard', 'rqcard'].includes(sh.set)) return { z: 1, fx: W / 2, fy: H / 2, tx: 0, ty: 0 };
  const m = sh.cm || sh.v?.cm || CAMERA;
  const breath = Math.sin((local / 30) * 0.9 + sh.off) * 0.0025; // tiny hand-held float so even 'still' never freezes
  if (!sh.close) {
    if (m === 'push') return { z: 1.02 + 0.07 * p + breath, fx: W / 2 + sh.dir * 10, fy: H / 2 - 8 * p, tx: 0, ty: 0 };
    if (m === 'pull') return { z: 1.10 - 0.07 * p + breath, fx: W / 2 + sh.dir * 10, fy: H / 2 + 6 * p, tx: 0, ty: 0 };
    if (m === 'truck') return { z: 1.07 + breath, fx: W / 2 + sh.dir * (W * 0.03) * (2 * p - 1), fy: H / 2, tx: 0, ty: 0 };
    if (m === 'rise') return { z: 1.07 + breath, fx: W / 2, fy: H / 2 + (H * 0.03) * (1 - 2 * p), tx: 0, ty: 0 };
    if (m === 'orbit') return { z: 1.06 + 0.03 * p, fx: W / 2 + sh.dir * (W * 0.02) * (2 * p - 1), fy: H / 2 + 6 * (1 - 2 * p), tx: 0, ty: 0, rot: sh.dir * 0.6 * (2 * p - 1) };
    return { z: 1.04 + 0.012 * p + breath, fx: W / 2 + sh.dir * 6 * p, fy: H / 2, tx: 0, ty: 0 };
  }
  const k = m === 'push' ? 0.95 + 0.08 * p : m === 'pull' ? 1.05 - 0.07 * p : 1.0 + 0.02 * p;
  const z = sh.z * k * (1 + breath); const hw = W / (2 * z), hh = H / (2 * z);
  const dx = m === 'truck' || m === 'orbit' ? sh.dir * 34 * (2 * p - 1) : 0, dy = m === 'rise' ? 34 * (1 - 2 * p) : 0;
  const fx = Math.min(W - hw + 30, Math.max(hw - 30, sh.fx + dx)), fy = Math.min(H - hh + 30, Math.max(hh - 30, sh.fy + dy));
  return { z, fx, fy, tx: 0, ty: 0 };
};
export const ShotView: React.FC<{ sh: Shot; frame: number; W: number; H: number; SETS: Record<string, React.FC<SetProps>> }> = ({ sh, frame, W, H, SETS }) => {
  const local = frame - sh.s; const S = SETS[sh.set];
  if (!S) throw new Error('missing set ' + sh.set);
  return <Stage W={W} H={H} frame={frame} cam={camOf(sh, local, W, H)}><S f={local + sh.off} t={local} len={sh.e - sh.s} v={sh.v} /></Stage>;
};
export const makeVideo = (data: { shots: Shot[]; chapters: { s: number; n: number; title: string }[] }, W: number, H: number, SETS: any, vertical = false) => {
  const C: React.FC = () => {
    const frame = useCurrentFrame(); const i = find(data.shots, frame); const sh = data.shots[i];
    const ch = data.chapters.find((c) => frame >= c.s && frame < c.s + 3 * FPS);
    const prev = i > 0 ? data.shots[i - 1] : null;
    const into = frame - sh.s;
    const soft = DIS > 0 && prev && prev.b === sh.b && into < DIS && !sh.v?.hard;
    return (
      <AbsoluteFill>
        {soft && prev && <ShotView sh={prev} frame={frame} W={W} H={H} SETS={SETS} />}
        <AbsoluteFill style={{ opacity: soft ? eio((into + 1) / (DIS + 1)) : 1 }}><ShotView sh={sh} frame={frame} W={W} H={H} SETS={SETS} /></AbsoluteFill>
        {ch && <ChapterCard W={W} H={H} t={(frame - ch.s) / FPS} n={ch.n} title={ch.title} vertical={vertical} />}
      </AbsoluteFill>
    );
  };
  return C;
};
// QA: one still per shot, taken at 60% of the shot (after pop-ins have landed)
export const makeQA = (data: { shots: Shot[] }, W: number, H: number, SETS: any) => {
  const C: React.FC = () => { const i = useCurrentFrame(); const sh = data.shots[Math.min(i, data.shots.length - 1)]; const at = Math.floor(sh.s + (sh.e - sh.s) * 0.6); return <ShotView sh={sh} frame={at} W={W} H={H} SETS={SETS} />; };
  return C;
};
