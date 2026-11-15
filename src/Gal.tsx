import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Stage } from './Post';
import { SETS } from './SetsL';
import gal from './gal.json';
export const Gal: React.FC = () => { const i = useCurrentFrame(); const g = (gal as any[])[i]; const S = SETS[g[0]]; return <Stage W={1920} H={1080} frame={i} cam={{ z: 1, fx: 960, fy: 540, tx: 0, ty: 0 }}><S f={60} v={g[1]} /></Stage>; };
