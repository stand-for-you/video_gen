import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Defs } from './GW';
import { HorrorBack, Title } from './Thumbs';
import { LightSet, LIGHT_GHOST } from './Paint';
import { FullMan } from './Body';
import { CloseUp, CAST, GHOSTS } from './Cast';
import { Snow } from './Room';
import { Creature } from './kits/Monster';
// STORY SLOT: thumbnails for "Gateway of the Mind". A/B/C = YouTube A/B test (1280x720, one difference each), R = Reel (1080x1920).
// No blood on thumbnails. The subject of the picture is the Long-Hair Woman (her face), the back-view figure is a small permanent-cast person.
const Back: React.FC<{ W: number; H: number; moon: [number, number, number]; gy: number }> = (p) => <><Defs /><HorrorBack {...p} /></>;
// giant ghost face (CloseUp with the ghost spec: pale skin, hollow eyes, dark tear tracks)
const GhostFace: React.FC<{ s: 'woman' | 'grin' | 'child'; k: number; x: number; y: number }> = ({ s, k, x, y }) => (
  <g transform={`translate(${x},${y}) scale(${k})`}><LightSet {...LIGHT_GHOST}><CloseUp s={GHOSTS[s]} expr="fear" f={30} turn={0.1} uid={`th${s}`} /></LightSet></g>
);
export const ThumbA: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    <svg width={1280} height={720} style={{ position: 'absolute' }}><Back W={1280} H={720} moon={[470, 330, 170]} gy={520} />
      <GhostFace s="woman" k={0.9} x={930} y={300} />
      <FullMan view="back" x={500} y={716} s={0.1} f={4} /><Snow f={9} n={26} op={0.5} /></svg>
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 70% 50%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.55) 100%)' }} />
    <div style={{ position: 'absolute', left: 40, top: 40, width: 640 }}><Title a="GATEWAY" b="OF THE MIND" sa={86} sb={110} align="left" /></div>
  </AbsoluteFill>
);
export const ThumbB: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    <svg width={1280} height={720} style={{ position: 'absolute' }}><Back W={1280} H={720} moon={[260, 160, 90]} gy={560} />
      <GhostFace s="woman" k={1.25} x={820} y={160} /><Snow f={9} n={20} op={0.4} /></svg>
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 65% 45%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.6) 100%)' }} />
    <div style={{ position: 'absolute', left: 40, top: 60, width: 520 }}><Title a="HER" b="VOICE" sa={130} sb={150} align="left" /></div>
  </AbsoluteFill>
);
export const ThumbC: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    <svg width={1280} height={720} style={{ position: 'absolute' }}><Back W={1280} H={720} moon={[980, 300, 150]} gy={560} />
      <rect x={430} y={250} width={260} height={470} fill="#e0a060" opacity={0.85} /><rect x={430} y={250} width={260} height={470} fill="none" stroke="#2a1c14" strokeWidth={18} />
      <GhostFace s="grin" k={0.5} x={600} y={300} />
      <FullMan view="back" x={250} y={716} s={0.12} f={4} /><Snow f={9} n={20} op={0.4} /></svg>
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 45% 60%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.6) 100%)' }} />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 24 }}><Title a="NO" b="HEAVEN" sa={80} sb={92} /></div>
  </AbsoluteFill>
);
export const ThumbR: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    <svg width={1080} height={1920} style={{ position: 'absolute' }}><Back W={1080} H={1920} moon={[860, 520, 200]} gy={1320} />
      <GhostFace s="woman" k={1.45} x={540} y={420} />
      <rect x={-100} y={1380} width={1300} height={600} fill="#08060a" opacity={0.85} />
      <FullMan view="back" x={540} y={1880} s={0.13} f={4} /><Snow f={9} n={40} op={0.5} /></svg>
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 42%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)' }} />
    <div style={{ position: 'absolute', left: 30, right: 30, top: 70 }}><Title a="GATEWAY" b="OF THE MIND" sa={110} sb={150} /></div>
  </AbsoluteFill>
);
void Creature; void CAST;
