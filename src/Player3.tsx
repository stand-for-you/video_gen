import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Stage3, Set3, Grade } from './Stage3';
import { ChapterCard } from './Card';
import { Words, WUnit } from './Subs3';
import ENG from '../engine.json';
// ===== SCROLL KAOS PLAYER v0.5 (3D, native 60 fps) =====
// One shot = one 3D set + its own moving camera (see src/k3/Cam.tsx). Time inside a set is SECONDS from the start of the shot,
// so every move is frame-rate independent and stays smooth at 60 fps. Cuts inside one spoken sentence are soft dissolves.
export const FPS: number = (ENG as any).fps || 60;
const DIS: number = (ENG as any).dissolve ?? 14;
export type Shot = { b: number; u: number; s: number; e: number; set: string; v: any; close: boolean; fr?: string; dir: number; off: number };
export const find = (shots: Shot[], fr: number) => { let lo = 0, hi = shots.length - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (shots[m].s <= fr) lo = m; else hi = m - 1; } return lo; };
const ss = (x: number) => { const c = Math.max(0, Math.min(1, x)); return c * c * (3 - 2 * c); };
export const ShotView: React.FC<{ sh: Shot; frame: number; W: number; H: number; SETS: Record<string, Set3>; vert?: boolean }> = ({ sh, frame, W, H, SETS, vert }) => {
  const S = SETS[sh.set];
  if (!S) throw new Error('missing set ' + sh.set);
  const t = (frame - sh.s) / FPS, len = (sh.e - sh.s) / FPS;
  const v = { ...sh.v, off: sh.off ?? 0, dir: sh.dir, fr: sh.fr };
  return <Stage3 S={S} v={v} t={t} len={len} W={W} H={H} vert={vert} />;
};
export const makeVideo = (data: { shots: Shot[]; chapters: { s: number; n: number; title: string }[] }, words: { units: WUnit[] }, W: number, H: number, SETS: any, vertical = false) => {
  const C: React.FC = () => {
    const frame = useCurrentFrame(); const i = find(data.shots, frame); const sh = data.shots[i];
    const ch = data.chapters.find((c) => frame >= c.s && frame < c.s + 3 * FPS);
    const prev = i > 0 ? data.shots[i - 1] : null;
    const into = frame - sh.s;
    const soft = DIS > 0 && prev && prev.u === sh.u && into < DIS && !sh.v?.hard;
    const endish = sh.set === 'end';
    return (
      <AbsoluteFill style={{ background: '#05070b' }}>
        {soft && prev && <ShotView sh={prev} frame={frame} W={W} H={H} SETS={SETS} vert={vertical} />}
        <AbsoluteFill style={{ opacity: soft ? ss((into + 1) / (DIS + 1)) : 1 }}><ShotView sh={sh} frame={frame} W={W} H={H} SETS={SETS} vert={vertical} /></AbsoluteFill>
        <Grade W={W} H={H} />
        <Words units={words.units} t={frame / FPS} W={W} H={H} vert={vertical} hide={endish} />
        {ch && <ChapterCard W={W} H={H} t={(frame - ch.s) / FPS} n={ch.n} title={ch.title} vertical={vertical} />}
      </AbsoluteFill>
    );
  };
  return C;
};
// QA: one still per shot, taken at 60% of the shot
export const makeQA = (data: { shots: Shot[] }, W: number, H: number, SETS: any, vertical = false) => {
  const C: React.FC = () => { const i = useCurrentFrame(); const sh = data.shots[Math.min(i, data.shots.length - 1)]; const at = Math.floor(sh.s + (sh.e - sh.s) * 0.6); return <AbsoluteFill><ShotView sh={sh} frame={at} W={W} H={H} SETS={SETS} vert={vertical} /><Grade W={W} H={H} /></AbsoluteFill>; };
  return C;
};
