import React from 'react';
import { LightSet, LIGHT_GHOST } from './Paint';
import { FullPerson, CAST, GHOSTS } from './Cast';
import type { Expr, View } from './Cast';
import type { Motion } from './Rig';
// ===== SCROLL KAOS PERMANENT CHARACTERS (painted style), old API names kept so existing scenes still work.
// Origin = centre of the feet on the ground, up is negative y. Noah about 3040 tall.
// Every wrapper takes `motion` (see Rig.tsx) so the figure moves with the scene: walk, climbUp, sit, cover ...
export const NOAH = CAST.noah;
export const FullMan: React.FC<{ look?: unknown; view?: View; face?: 1 | -1; x?: number; y?: number; s?: number; f?: number; expr?: Expr; pose?: 'relaxed' | 'straight'; motion?: Motion; turn?: number }> = ({ view = 'front', face, x = 0, y = 0, s = 1, f = 4, expr = 'neutral', pose, motion, turn }) => (
  <FullPerson s={CAST.noah} view={view} face={face} x={x} y={y} k={s} f={f} expr={expr} pose={pose} motion={motion} turn={turn} />
);
// ghosts: cold ghost light, upright by default ('still'); pass a motion (for example idle, reach, lookBack) to make them move. No blood (dark tear tracks only).
type GhostProps = { x?: number; y?: number; s?: number; f?: number; view?: View; face?: 1 | -1; motion?: Motion };
const ghost = (spec: typeof GHOSTS.woman): React.FC<GhostProps> => ({ x = 0, y = 0, s = 1, f = 4, view = 'front', face, motion }) => (
  <LightSet {...LIGHT_GHOST}><FullPerson s={spec} x={x} y={y} k={s} f={f} view={view} face={face} pose="straight" motion={motion} /></LightSet>
);
export const GhostWoman = ghost(GHOSTS.woman);
export const GhostGrin = ghost(GHOSTS.grin);
export const GhostChild = ghost(GHOSTS.child);
