import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Stage } from './Post';
import { SETS } from './SetsR';
import gal from './galr.json';
export const GalR: React.FC = () => { const i = useCurrentFrame(); const g = (gal as any[])[i]; const S = SETS[g[0]]; return <Stage W={1080} H={1920} frame={i} cam={{ z: 1, fx: 540, fy: 960, tx: 0, ty: 0 }}><S f={60} v={g[1]} /></Stage>; };
