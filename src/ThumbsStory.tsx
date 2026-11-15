import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Defs } from './Kit';
import { Snow } from './Room';
import { HorrorBack, Reach, Title } from './Thumbs';
import { FullMan, NOAH } from './Body';
import { Glow } from './IH';
import { LurkerCreature, WallRitual } from './LurkerKit';

// Thumbnails for "I Know You're Awake".
// Four deliverables following channel policy:
// ThumbA: Giant creature stalking on the right, title left, tiny Noah from behind facing it.
// ThumbB: Close crop monster face, 2-word title ("DON'T LOOK"), small blood moon.
// ThumbC: Key story element (glowing ritual message wall) huge in center, creature stalking in background.
// ThumbR: 1080x1920 vertical reel thumbnail.

const Lurker: React.FC<{ x: number; y: number; k: number; rot?: number; op?: number }> = ({ x, y, k, rot = 0, op = 1 }) => (
  <g opacity={op} transform={`translate(${x},${y}) rotate(${rot}) scale(${k})`}>
    <Glow x={0} y={0} r={480} c="#dce5f0" op={0.2} />
    <LurkerCreature f={3} reach scale={1.5} />
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
      <Lurker x={1020} y={420} k={0.65} rot={-3} />
      {[[60, 740, 0.7, -12], [220, 760, 0.8, 8], [380, 770, 0.7, -6]].map((h, i) => (
        <Reach key={i} x={h[0]} y={h[1]} s={h[2]} rot={h[3]} />
      ))}
      <NoahBack x={620} y={716} s={0.1} />
      <Snow f={9} n={26} op={0.5} w={1280} h={720} />
    </svg>
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 70% 50%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.6) 100%)' }} />
    <div style={{ position: 'absolute', left: 40, top: 50, width: 660 }}>
      <Title a="STILL" b="AWAKE" sa={140} sb={180} align="left" />
    </div>
  </AbsoluteFill>
);

export const ThumbB: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    <svg width={1280} height={720} viewBox="0 0 1280 720" style={{ position: 'absolute' }}>
      <Defs />
      <HorrorBack W={1280} H={720} moon={[220, 480, 44]} gy={540} />
      <Lurker x={980} y={380} k={1.4} rot={4} />
      {[[60, 740, 0.7, -12], [220, 760, 0.8, 8]].map((h, i) => (
        <Reach key={i} x={h[0]} y={h[1]} s={h[2]} rot={h[3]} />
      ))}
      <NoahBack x={440} y={716} s={0.09} />
      <Snow f={9} n={26} op={0.5} w={1280} h={720} />
    </svg>
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 70% 45%, rgba(0,0,0,0) 38%, rgba(0,0,0,0.6) 100%)' }} />
    <div style={{ position: 'absolute', left: 44, top: 60, width: 540 }}>
      <Title a="DON'T" b="LOOK" sa={145} sb={175} align="left" />
    </div>
  </AbsoluteFill>
);

export const ThumbC: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    <svg width={1280} height={720} viewBox="0 0 1280 720" style={{ position: 'absolute' }}>
      <Defs />
      <HorrorBack W={1280} H={720} moon={[160, 240, 85]} gy={560} />
      <Lurker x={1080} y={440} k={0.4} op={0.85} />
      <Glow x={600} y={450} r={450} c="#b81c16" op={0.5} />
      <g transform="translate(600, 400)">
        <WallRitual revealWords={true} bloodPentagram={true} />
      </g>
      {[[60, 760, 0.7, -12], [1200, 770, 0.7, 10]].map((h, i) => (
        <Reach key={i} x={h[0]} y={h[1]} s={h[2]} rot={h[3]} />
      ))}
      <NoahBack x={280} y={716} s={0.1} />
      <Snow f={9} n={26} op={0.5} w={1280} h={720} />
    </svg>
    <div style={{ position: 'absolute', left: 60, top: 40, width: 1160 }}>
      <Title a="THE" b="MASTERPIECE" sa={120} sb={140} align="left" />
    </div>
  </AbsoluteFill>
);

export const ThumbR: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
      <Defs />
      <HorrorBack W={1080} H={1920} moon={[540, 680, 220]} gy={1400} />
      <Lurker x={540} y={960} k={1.1} rot={-2} />
      {[[120, 1920, 0.9, -10], [960, 1920, 0.9, 12]].map((h, i) => (
        <Reach key={i} x={h[0]} y={h[1]} s={h[2]} rot={h[3]} />
      ))}
      <NoahBack x={540} y={1900} s={0.14} />
      <Snow f={9} n={36} op={0.55} w={1080} h={1920} />
    </svg>
    <div style={{ position: 'absolute', left: 40, top: 120, width: 1000, textAlign: 'center' }}>
      <Title a="I KNOW YOU'RE" b="AWAKE" sa={105} sb={135} align="center" />
    </div>
  </AbsoluteFill>
);
