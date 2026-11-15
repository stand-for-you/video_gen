import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Defs } from './Kit';
import { Snow } from './Room';
import { HorrorBack, Reach, Title } from './Thumbs';
import { FullMan, NOAH } from './Body';
import { Glow } from './IH';
import { FaceSolomon, FullSolomon, CarvedDoll } from './SolomonKit';

// Thumbnails for "The Melancholy of Herbert Solomon".
// Follows all channel policies:
// ThumbA: Giant Herbert Solomon on the right, title left, tiny Noah from behind facing it.
// ThumbB: Much closer crop of Solomon's face with bulging forehead veins, 2-word title ("DON'T BURN"), small blood moon.
// ThumbC: Key story object (the carved wooden doll) glowing in center, Solomon silhouette behind, title on top ("HIS SOUL").
// ThumbR: 1080x1920 vertical reel thumbnail.

const SolomonHuge: React.FC<{ x: number; y: number; k: number; rot?: number; op?: number }> = ({ x, y, k, rot = 0, op = 1 }) => (
  <g opacity={op} transform={`translate(${x},${y}) rotate(${rot}) scale(${k})`}>
    <Glow x={0} y={0} r={480} c="#d5dcde" op={0.25} />
    <FaceSolomon f={4} expr="melancholy" />
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
      {/* Herbert Solomon Face on right */}
      <SolomonHuge x={1040} y={380} k={1.4} rot={-3} />
      {[[60, 740, 0.7, -12], [220, 760, 0.8, 8], [380, 770, 0.7, -6]].map((h, i) => (
        <Reach key={i} x={h[0]} y={h[1]} s={h[2]} rot={h[3]} />
      ))}
      <NoahBack x={620} y={716} s={0.1} />
      <Snow f={9} n={26} op={0.5} w={1280} h={720} />
    </svg>
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 70% 50%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.6) 100%)' }} />
    <div style={{ position: 'absolute', left: 40, top: 50, width: 660 }}>
      <Title a="DON'T" b="JUDGE" sa={140} sb={180} align="left" />
    </div>
  </AbsoluteFill>
);

export const ThumbB: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    <svg width={1280} height={720} viewBox="0 0 1280 720" style={{ position: 'absolute' }}>
      <Defs />
      <HorrorBack W={1280} H={720} moon={[220, 480, 44]} gy={540} />
      {/* Extreme close crop of Solomon with bulging forehead veins */}
      <SolomonHuge x={980} y={350} k={2.2} rot={4} />
      {[[60, 740, 0.7, -12], [220, 760, 0.8, 8]].map((h, i) => (
        <Reach key={i} x={h[0]} y={h[1]} s={h[2]} rot={h[3]} />
      ))}
      <NoahBack x={440} y={716} s={0.09} />
      <Snow f={9} n={26} op={0.5} w={1280} h={720} />
    </svg>
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 70% 45%, rgba(0,0,0,0) 38%, rgba(0,0,0,0.6) 100%)' }} />
    <div style={{ position: 'absolute', left: 40, top: 70, width: 660 }}>
      <Title a="DON'T" b="BURN" sa={150} sb={190} align="left" />
    </div>
  </AbsoluteFill>
);

export const ThumbC: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    <svg width={1280} height={720} viewBox="0 0 1280 720" style={{ position: 'absolute' }}>
      <Defs />
      <HorrorBack W={1280} H={720} moon={[640, 220, 130]} gy={520} />
      {/* Looming tall silhouette in background */}
      <g transform="translate(640, 480) scale(0.65)" opacity={0.85}>
        <FullSolomon x={0} y={0} f={4} mode="stand" />
      </g>
      {/* Glowing Carved Doll in foreground */}
      <g transform="translate(640, 580) scale(1.6)">
        <Glow x={0} y={0} r={180} c="#f5b538" op={0.4} />
        <CarvedDoll x={0} y={0} s={1} />
      </g>
      <NoahBack x={360} y={716} s={0.09} />
      <Snow f={9} n={26} op={0.5} w={1280} h={720} />
    </svg>
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.55) 100%)' }} />
    <div style={{ position: 'absolute', left: 40, top: 40, width: 1200, textAlign: 'center' }}>
      <Title a="HIS" b="SOUL" sa={130} sb={170} align="center" />
    </div>
  </AbsoluteFill>
);

export const ThumbR: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
      <Defs />
      <HorrorBack W={1080} H={1920} moon={[540, 680, 220]} gy={1380} />
      {/* Giant Solomon in middle */}
      <SolomonHuge x={540} y={960} k={2.2} rot={0} />
      {[[80, 1960, 1.0, -12], [960, 1980, 1.1, 10], [540, 2020, 1.0, -4]].map((h, i) => (
        <Reach key={i} x={h[0]} y={h[1]} s={h[2]} rot={h[3]} />
      ))}
      <NoahBack x={540} y={1860} s={0.16} />
      <Snow f={9} n={40} op={0.5} w={1080} h={1920} />
    </svg>
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.65) 100%)' }} />
    <div style={{ position: 'absolute', left: 40, top: 120, width: 1000, textAlign: 'center' }}>
      <Title a="DON'T" b="JUDGE" sa={160} sb={210} align="center" />
    </div>
  </AbsoluteFill>
);
