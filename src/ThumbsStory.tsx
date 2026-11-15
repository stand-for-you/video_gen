import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Defs } from './Kit';
import { Snow } from './Room';
import { HorrorBack, Reach, Title } from './Thumbs';
import { FullMan, NOAH } from './Body';
import { Glow } from './IH';
import { MimicCreature, WoodFence } from './MimicKit';

// Thumbnails for "The Treeline Mimic".
// Four deliverables following channel policy:
// ThumbA: Giant creature stalking on the right, title left, tiny Noah from behind facing it.
// ThumbB: Close crop monster face, 2-word title ("DON'T OPEN"), small blood moon.
// ThumbC: Key story element (fence & glowing tapetum eyes) huge in center, creature silhouette.
// ThumbR: 1080x1920 vertical reel thumbnail.

const Mimic: React.FC<{ x: number; y: number; k: number; rot?: number; op?: number }> = ({ x, y, k, rot = 0, op = 1 }) => (
  <g opacity={op} transform={`translate(${x},${y}) rotate(${rot}) scale(${k})`}>
    <Glow x={0} y={0} r={460} c="#dce5f0" op={0.25} />
    <MimicCreature x={0} y={0} k={1.6} f={4} pose="reach" />
  </g>
);

const NoahBack: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <FullMan look={NOAH} view="back" x={x} y={y} s={s} f={4} expr="neutral" />
);

export const ThumbA: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    <svg width={1280} height={720} viewBox="0 0 1280 720" style={{ position: 'absolute' }}>
      <Defs />
      <HorrorBack W={1280} H={720} moon={[460, 320, 160]} gy={520} />
      <WoodFence x={0} y={640} w={1280} h={180} />
      <Mimic x={1020} y={400} k={0.7} rot={-3} />
      {[[60, 740, 0.7, -12], [220, 760, 0.8, 8], [380, 770, 0.7, -6]].map((h, i) => (
        <Reach key={i} x={h[0]} y={h[1]} s={h[2]} rot={h[3]} />
      ))}
      <NoahBack x={620} y={716} s={0.1} />
      <Snow f={9} n={26} op={0.5} w={1280} h={720} />
    </svg>
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 70% 50%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.6) 100%)' }} />
    <div style={{ position: 'absolute', left: 40, top: 50, width: 660 }}>
      <Title a="DON'T" b="ANSWER" sa={140} sb={180} align="left" />
    </div>
  </AbsoluteFill>
);

export const ThumbB: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    <svg width={1280} height={720} viewBox="0 0 1280 720" style={{ position: 'absolute' }}>
      <Defs />
      <HorrorBack W={1280} H={720} moon={[220, 480, 44]} gy={540} />
      <Mimic x={980} y={360} k={1.5} rot={4} />
      {[[60, 740, 0.7, -12], [220, 760, 0.8, 8]].map((h, i) => (
        <Reach key={i} x={h[0]} y={h[1]} s={h[2]} rot={h[3]} />
      ))}
      <NoahBack x={440} y={716} s={0.09} />
      <Snow f={9} n={26} op={0.5} w={1280} h={720} />
    </svg>
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 70% 45%, rgba(0,0,0,0) 38%, rgba(0,0,0,0.6) 100%)' }} />
    <div style={{ position: 'absolute', left: 44, top: 60, width: 540 }}>
      <Title a="DON'T" b="OPEN" sa={150} sb={190} align="left" />
    </div>
  </AbsoluteFill>
);

export const ThumbC: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    <svg width={1280} height={720} viewBox="0 0 1280 720" style={{ position: 'absolute' }}>
      <Defs />
      <HorrorBack W={1280} H={720} moon={[640, 180, 120]} gy={500} />
      <WoodFence x={0} y={560} w={1280} h={200} />
      <Mimic x={640} y={380} k={0.55} rot={0} />
      {[[80, 740, 0.65, -8], [1180, 740, 0.65, 8]].map((h, i) => (
        <Reach key={i} x={h[0]} y={h[1]} s={h[2]} rot={h[3]} />
      ))}
      <NoahBack x={640} y={716} s={0.09} />
      <Snow f={9} n={26} op={0.5} w={1280} h={720} />
    </svg>
    <AbsoluteFill style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.7) 100%)' }} />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 30, display: 'flex', justifyContent: 'center' }}>
      <Title a="HER" b="VOICE" sa={130} sb={160} align="center" />
    </div>
  </AbsoluteFill>
);

export const ThumbR: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
      <Defs />
      <HorrorBack W={1080} H={1920} moon={[540, 520, 240]} gy={1320} />
      <WoodFence x={0} y={1420} w={1080} h={280} />
      <Mimic x={540} y={880} k={1.4} rot={-2} />
      {[[120, 1920, 1.2, -10], [960, 1920, 1.2, 10]].map((h, i) => (
        <Reach key={i} x={h[0]} y={h[1]} s={h[2]} rot={h[3]} />
      ))}
      <NoahBack x={540} y={1900} s={0.16} />
      <Snow f={9} n={36} op={0.5} w={1080} h={1920} />
    </svg>
    <AbsoluteFill style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.8) 100%)' }} />
    <div style={{ position: 'absolute', left: 40, right: 40, top: 120, display: 'flex', justifyContent: 'center' }}>
      <Title a="DON'T" b="ANSWER" sa={150} sb={190} align="center" />
    </div>
  </AbsoluteFill>
);
