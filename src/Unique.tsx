import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Stage3 } from './Stage3';
import { SETS as SL } from './SetsL';
import { SETS as SR } from './SetsR';
import UL from './unique_long.json';
import UR from './unique_reel.json';

export const UniqueL: React.FC = () => {
  const i = useCurrentFrame();
  const spec = (UL as any[])[Math.min(i, UL.length - 1)];
  if (!spec) return null;
  const S = SL[spec.set];
  if (!S) throw new Error('Missing long set: ' + spec.set);
  return <Stage3 S={S} v={{ ...(spec.v || {}), off: i * 0.7 }} t={1.5} len={3.0} W={1920} H={1080} />;
};

export const UniqueR: React.FC = () => {
  const i = useCurrentFrame();
  const spec = (UR as any[])[Math.min(i, UR.length - 1)];
  if (!spec) return null;
  const S = SR[spec.set];
  if (!S) throw new Error('Missing reel set: ' + spec.set);
  return <Stage3 S={S} v={{ ...(spec.v || {}), off: i * 0.7 }} t={1.5} len={3.0} W={1080} H={1920} vert />;
};
