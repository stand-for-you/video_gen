import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Defs, MaskBust, BlueMask, BlackTears } from './Trust';
import { HorrorBack, Title } from './Thumbs';
import { LightSet, LIGHT_EMBER } from './Paint';
import { FullMan } from './Body';
import { Snow } from './Room';
// STORY SLOT: thumbnails for "You Can't Trust Everyone". A/B/C = YouTube A/B test (1280x720, one difference each), R = Reel (1080x1920).
// No blood on thumbnails. The subject is the SAME antagonist as the video: the Blue-Mask Thing (torn eyes, black tar, cracked blue mask).
const Back: React.FC<{ W: number; H: number; moon: [number, number, number]; gy: number }> = (p) => <><Defs /><HorrorBack {...p} /></>;
// the mask thing's face, lit cold
const MaskFace: React.FC<{ k: number; x: number; y: number; tar?: number }> = ({ k, x, y, tar = 0.8 }) => (
  <g transform={`translate(${x},${y}) scale(${k})`}><LightSet {...LIGHT_EMBER}><MaskBust f={30} tar={tar} jaw={0.4} /></LightSet></g>
);
export const ThumbA: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    <svg width={1280} height={720} style={{ position: 'absolute' }}><Back W={1280} H={720} moon={[470, 300, 150]} gy={520} />
      <MaskFace k={1.5} x={940} y={420} />
      <FullMan view="back" x={470} y={716} s={0.1} f={4} /><Snow f={9} n={26} op={0.5} /></svg>
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 72% 50%, rgba(0,0,0,0) 34%, rgba(0,0,0,0.58) 100%)' }} />
    <div style={{ position: 'absolute', left: 40, top: 60, width: 620 }}><Title a="DON'T TRUST" b="ANYONE" sa={92} sb={128} align="left" /></div>
  </AbsoluteFill>
);
export const ThumbB: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    <svg width={1280} height={720} style={{ position: 'absolute' }}><Back W={1280} H={720} moon={[250, 150, 80]} gy={560} />
      <MaskFace k={2.1} x={800} y={300} tar={1} /><Snow f={9} n={20} op={0.4} /></svg>
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 64% 44%, rgba(0,0,0,0) 34%, rgba(0,0,0,0.6) 100%)' }} />
    <div style={{ position: 'absolute', left: 40, top: 70, width: 520 }}><Title a="BLACK" b="TEARS" sa={150} sb={168} align="left" /></div>
  </AbsoluteFill>
);
export const ThumbC: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    <svg width={1280} height={720} style={{ position: 'absolute' }}><Back W={1280} H={720} moon={[980, 300, 150]} gy={560} />
      <ellipse cx={640} cy={370} rx={260} ry={320} fill="#7fa0c0" opacity={0.18} />
      <BlueMask cx={640} cy={360} r={320} o={1} /><BlackTears x={585} y={360} k={2.2} f={30} n={2} /><BlackTears x={695} y={360} k={2.2} f={37} n={2} />
      <Snow f={9} n={20} op={0.4} /></svg>
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0) 36%, rgba(0,0,0,0.6) 100%)' }} />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 24 }}><Title a="THE" b="RITUAL" sa={84} sb={100} /></div>
  </AbsoluteFill>
);
export const ThumbR: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    <svg width={1080} height={1920} style={{ position: 'absolute' }}><Back W={1080} H={1920} moon={[840, 520, 190]} gy={1320} />
      <MaskFace k={2.3} x={540} y={560} />
      <rect x={-100} y={1380} width={1300} height={600} fill="#08060a" opacity={0.85} />
      <FullMan view="back" x={540} y={1880} s={0.13} f={4} /><Snow f={9} n={40} op={0.5} /></svg>
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)' }} />
    <div style={{ position: 'absolute', left: 30, right: 30, top: 70 }}><Title a="YOU CAN'T" b="TRUST ANYONE" sa={120} sb={128} /></div>
  </AbsoluteFill>
);
