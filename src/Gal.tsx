import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Stage3 } from './Stage3';
import { SETS } from './SetsL';
import { SETS as SR } from './SetsR';
import gal from './gal.json';
// SET GALLERY (QA before the audio exists): one still per entry of src/gal.json = [set, variant, seconds-into-the-shot, shot length].
// Long sets 1920x1080, reel sets (r*) 1080x1920. Look at every sheet before building the real shot list.
export const Gal: React.FC = () => { const i = useCurrentFrame(); const g = (gal as any[]).filter((x) => !String(x[0]).startsWith('r'))[i]; if (!g) return null; const S = SETS[g[0]]; return <Stage3 S={S} v={{ ...(g[1] || {}), off: i * 1.3 }} t={g[2] ?? 1.5} len={g[3] ?? 3} W={1920} H={1080} />; };
export const GalR: React.FC = () => { const i = useCurrentFrame(); const g = (gal as any[]).filter((x) => String(x[0]).startsWith('r'))[i]; if (!g) return null; const S = SR[g[0]]; return <Stage3 S={S} v={{ ...(g[1] || {}), off: i * 1.3 }} t={g[2] ?? 1.5} len={g[3] ?? 3} W={1080} H={1920} vert />; };
export const GAL_N = (gal as any[]).filter((x) => !String(x[0]).startsWith('r')).length, GALR_N = (gal as any[]).filter((x) => String(x[0]).startsWith('r')).length;
