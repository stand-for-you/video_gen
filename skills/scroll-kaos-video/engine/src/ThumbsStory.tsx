import React from 'react';
// STORY SLOT: the 4 thumbnails. Export ThumbA, ThumbB, ThumbC (1280x720 A/B set) and ThumbR (1080x1920 Reel). Same HorrorBack law; see references/channel-policy.md section 5.
import { AbsoluteFill } from 'remotion';
import { Defs } from './Kit';
import { Snow } from './Room';
import { HorrorBack, Reach, Title } from './Thumbs';
import { FullMan, NOAH } from './Body';
import { Glow } from './IH';
import { DogHead, Floppy } from './SD';
// "Smile Dog" thumbnails. Same HorrorBack law; the story has no ghost, so the giant face is the story's creature, the Grinning Dog (rule for ghost-less stories).
const Dog: React.FC<{ x: number; y: number; k: number; rot?: number; op?: number }> = ({ x, y, k, rot = 0, op = 1 }) => (
  <g opacity={op} transform={`translate(${x},${y}) rotate(${rot}) scale(${k})`}><Glow x={0} y={0} r={620} c="#f4f6ff" op={0.18} /><DogHead f={2} grin={1} eyes={1.1} /></g>);
const NoahBack: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => <FullMan look={NOAH} view="back" x={x} y={y} s={s} f={4} expr="neutral" />;
export const ThumbA: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    <svg width={1280} height={720} viewBox="0 0 1280 720" style={{ position: 'absolute' }}>
      <Defs />
      <HorrorBack W={1280} H={720} moon={[470, 330, 170]} gy={520} />
      <Dog x={1000} y={330} k={0.6} rot={-4} />
      {[[60, 740, 0.7, -12], [220, 760, 0.8, 8], [380, 770, 0.7, -6]].map((h, i) => <Reach key={i} x={h[0]} y={h[1]} s={h[2]} rot={h[3]} />)}
      <NoahBack x={600} y={716} s={0.1} />
      <Snow f={9} n={26} op={0.5} w={1280} h={720} />
    </svg>
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 70% 50%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.55) 100%)' }} />
    <div style={{ position: 'absolute', left: 40, top: 40, width: 640 }}><Title a="SMILE" b="DOG" sa={150} sb={190} align="left" /></div>
  </AbsoluteFill>
);
export const ThumbB: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    <svg width={1280} height={720} viewBox="0 0 1280 720" style={{ position: 'absolute' }}>
      <Defs />
      <HorrorBack W={1280} H={720} moon={[230, 470, 46]} gy={540} />
      <Dog x={1000} y={330} k={1.32} rot={6} />
      {[[60, 740, 0.7, -12], [220, 760, 0.8, 8]].map((h, i) => <Reach key={i} x={h[0]} y={h[1]} s={h[2]} rot={h[3]} />)}
      <NoahBack x={420} y={716} s={0.09} />
      <Snow f={9} n={26} op={0.5} w={1280} h={720} />
    </svg>
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 70% 45%, rgba(0,0,0,0) 38%, rgba(0,0,0,0.55) 100%)' }} />
    <div style={{ position: 'absolute', left: 44, top: 50, width: 520 }}><Title a="DON'T" b="OPEN" sa={150} sb={170} align="left" /></div>
  </AbsoluteFill>
);
export const ThumbC: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    <svg width={1280} height={720} viewBox="0 0 1280 720" style={{ position: 'absolute' }}>
      <Defs />
      <HorrorBack W={1280} H={720} moon={[150, 230, 85]} gy={560} />
      <Dog x={1060} y={400} k={0.34} op={0.9} />
      <Glow x={560} y={470} r={420} c="#ff2a1a" op={0.45} />
      <Floppy x={560} y={470} s={0.95} rot={-10} label="smile.jpg" glow />
      {[[60, 760, 0.7, -12], [1200, 770, 0.7, 10]].map((h, i) => <Reach key={i} x={h[0]} y={h[1]} s={h[2]} rot={h[3]} />)}
      <NoahBack x={860} y={716} s={0.085} />
      <Snow f={9} n={26} op={0.5} w={1280} h={720} />
    </svg>
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 45% 60%, rgba(0,0,0,0) 38%, rgba(0,0,0,0.5) 100%)' }} />
    <div style={{ position: 'absolute', left: 20, right: 20, top: 18 }}><Title a="SPREAD THE" b="WORD" sa={92} sb={104} /></div>
  </AbsoluteFill>
);
export const ThumbR: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
      <Defs />
      <HorrorBack W={1080} H={1920} moon={[300, 700, 190]} gy={1320} />
      <Dog x={600} y={960} k={0.95} rot={-4} />
      {[[80, 1900, 1.1, -14], [250, 1930, 1.3, 8], [420, 1960, 1.1, -6], [660, 1950, 1.2, 10], [840, 1925, 1.3, -10], [1000, 1900, 1.1, 14]].map((h, i) => <Reach key={i} x={h[0]} y={h[1]} s={h[2]} rot={h[3]} />)}
      <NoahBack x={540} y={1850} s={0.17} />
      <Snow f={9} n={40} op={0.5} w={1080} h={1920} />
    </svg>
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 42%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)' }} />
    <div style={{ position: 'absolute', left: 30, right: 30, top: 80 }}><Title a="SMILE" b="DOG" sa={190} sb={230} /></div>
  </AbsoluteFill>
);
