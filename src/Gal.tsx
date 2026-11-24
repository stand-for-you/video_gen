import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Stage } from './Post';
import { SETS } from './SetsL';
import { SETS as SR } from './SetsR';
import gal from './gal.json';
// SET GALLERY (QA before audio exists): one still per entry of src/gal.json = [set, v, t, len]. Long sets 1920x1080, reel sets (r*) 1080x1920.
export const Gal: React.FC = () => { const i = useCurrentFrame(); const g = (gal as any[]).filter((x) => !String(x[0]).startsWith('r'))[i]; if (!g) return null; const S = SETS[g[0]]; return <Stage W={1920} H={1080} frame={i} cam={{ z: 1, fx: 960, fy: 540, tx: 0, ty: 0 }}><S f={(g[2] ?? 60) + 40} t={g[2] ?? 60} len={g[3] ?? 90} v={g[1]} /></Stage>; };
export const GalR: React.FC = () => { const i = useCurrentFrame(); const g = (gal as any[]).filter((x) => String(x[0]).startsWith('r'))[i]; if (!g) return null; const S = SR[g[0]]; return <Stage W={1080} H={1920} frame={i} cam={{ z: 1, fx: 540, fy: 960, tx: 0, ty: 0 }}><S f={(g[2] ?? 60) + 40} t={g[2] ?? 60} len={g[3] ?? 90} v={g[1]} /></Stage>; };
export const GAL_N = (gal as any[]).filter((x) => !String(x[0]).startsWith('r')).length, GALR_N = (gal as any[]).filter((x) => String(x[0]).startsWith('r')).length;
