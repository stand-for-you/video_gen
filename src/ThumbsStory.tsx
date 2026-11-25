// ThumbsStory.tsx — ThumbA, ThumbB, ThumbC (1280x720) and ThumbR (1080x1920).
import React from 'react';
import { HorrorBack, Reach, Title } from './Thumbs';
import { M, EyelessJack } from './EJ';
import { FullMan } from './Body';

export const ThumbA: React.FC = () => (
  <g>
    <HorrorBack W={1280} H={720} moon={[1080, 140, 90]} gy={560} />
    <EyelessJack x={700} y={620} k={1.6} f={40} face={1} pose="lean" ooze={0.7} />
    <Reach x={220} y={700} s={1.0} rot={-20} />
    <FullMan look="sam" view="back" x={260} y={660} s={0.22} f={10} expr="fear" />
    <Title a="EYELESS JACK" b="CAME THROUGH MY WINDOW" sa={64} sb={42} align="left" />
  </g>
);

export const ThumbB: React.FC = () => (
  <g>
    <HorrorBack W={1280} H={720} moon={[980, 560, 46]} gy={520} />
    <g transform="translate(640 340) scale(2.2)">
      <EyelessJack x={0} y={0} k={1.4} f={30} face={1} pose="stand" ooze={0.9} />
    </g>
    <Title a="NO EYES" b="" sa={92} sb={0} align="left" />
  </g>
);

export const ThumbC: React.FC = () => (
  <g>
    <HorrorBack W={1280} H={720} moon={[1100, 120, 70]} gy={560} />
    <rect x={420} y={420} width={220} height={60} rx={10} fill="#e9e3d6" />
    <rect x={420} y={420} width={220} height={60} rx={10} fill={M.red} opacity={0.4} />
    <EyelessJack x={900} y={640} k={1.0} f={20} face={-1} pose="lean" ooze={0.5} />
    <Title a="THE KIDNEY" b="WAS STILL WARM" sa={60} sb={40} align="left" />
  </g>
);

export const ThumbR: React.FC = () => (
  <g>
    <HorrorBack W={1080} H={1920} moon={[860, 240, 90]} gy={1500} />
    <EyelessJack x={540} y={1460} k={1.8} f={40} face={1} pose="lean" ooze={0.7} />
    <Reach x={220} y={1600} s={1.4} rot={-20} />
    <Title a="EYELESS JACK" b="CAME THROUGH MY WINDOW" sa={56} sb={36} align="left" />
  </g>
);
