import React from 'react';
import { Thumb3, HorrorBack3, Title3 } from './k3/Thumbs3';
import { Person } from './k3/Person';
import { CAST3, GHOST3 } from './Cast3D';
import { Oscilloscope, ExamTable } from './GM3';
import { Halo } from './k3/World';

// Thumbnails for Gateway of the Mind (Kit q)
// A/B/C = YouTube A/B test (1280x720), R = Reel (1080x1920)
const T = 1.4;

// Thumb A (Main): Looming ghost apparition on right, tiny doctor from behind on left, title "HEARD GOD"
export const ThumbA: React.FC = () => (
  <Thumb3
    W={1280}
    H={720}
    t={T}
    cam={{ p: [-0.7, 2.2, 3.4], l: [0.75, 1.7, -0.2], fov: 44, move: 'hold' }}
    overlay={<Title3 a="THEY" b="HEARD GOD" W={1280} H={720} sa={84} sb={118} />}
  >
    <HorrorBack3 t={T} />
    <Person s={GHOST3.woman} at={[1.1, 0.1, -0.3]} rot={-0.45} t={T} pose="stand" />
    <Person s={CAST3.dr_reed} at={[-0.3, 0, 1.1]} rot={-2.9} t={T} pose="idle" seed={2} detail={false} />
  </Thumb3>
);

// Thumb B: Much closer crop on the blind subject's terrified face, short 2-word title "ABANDONED US"
export const ThumbB: React.FC = () => (
  <Thumb3
    W={1280}
    H={720}
    t={T}
    cam={{ p: [0.15, 1.62, 1.4], l: [0, 1.55, 0], fov: 36, move: 'hold' }}
    overlay={<Title3 a="HE HAS" b="ABANDONED US" W={1280} H={720} sa={70} sb={104} x={0.045} y={0.055} />}
  >
    <HorrorBack3 t={T} hands={2} />
    <Person s={CAST3.subject} at={[0, 0, 0]} rot={0.08} t={T} pose="stand" expr="fear" />
  </Thumb3>
);

// Thumb C: Key story object (green CRT monitor flatline) glowing big in front, title "THE VOID"
export const ThumbC: React.FC = () => (
  <Thumb3
    W={1280}
    H={720}
    t={T}
    cam={{ p: [0.05, 0.65, 1.25], l: [0, 0.45, 0], fov: 42, move: 'hold' }}
    overlay={<Title3 a="INTO" b="THE VOID" W={1280} H={720} sa={76} sb={110} align="center" y={0.045} />}
  >
    <HorrorBack3 t={T} hands={3} />
    <group position={[0, 0.05, 0]} scale={1.8}>
      <Oscilloscope flatline t={T} />
    </group>
    <Halo at={[0, 0.45, -0.1]} r={0.8} c="#55ff77" o={0.45} t={T} />
    <pointLight position={[0.2, 0.7, 0.8]} intensity={4.5} distance={3.5} color="#55ff77" />
    <Person s={GHOST3.woman} at={[1.2, 0, -4.5]} rot={-0.3} t={T} pose="stand" />
  </Thumb3>
);

// Thumb R (Reel 1080x1920): Title on top, spectral figure in middle, doctor tiny below
export const ThumbR: React.FC = () => (
  <Thumb3
    W={1080}
    H={1920}
    t={T}
    cam={{ p: [0.1, 1.8, 3.1], l: [0, 1.85, 0], fov: 48, move: 'hold' }}
    overlay={<Title3 a="THEY" b="HEARD GOD" W={1080} H={1920} sa={94} sb={134} align="center" y={0.07} />}
  >
    <HorrorBack3 t={T} />
    <Person s={GHOST3.woman} at={[0, 0.1, 0]} rot={0.1} t={T} pose="stand" />
    <Person s={CAST3.dr_reed} at={[-0.35, 0, 2.0]} rot={-3.0} t={T} pose="idle" seed={2} detail={false} />
  </Thumb3>
);
