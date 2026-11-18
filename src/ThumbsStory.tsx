import React from 'react';
import { Thumb3, HorrorBack3, Title3 } from './k3/Thumbs3';
import { Person } from './k3/Person';
import { Halo } from './k3/World';
import { Eyeless, Camera3, EJP } from './EJ3';
import { MITCH } from './EJCast';
// STORY SLOT (kit r, "Eyeless Jack"): the four thumbnails.
// A/B/C = the YouTube A/B test (1280x720, ONE clear difference each), R = the Reel (1080x1920).
// Law: the giant creature, the man tiny and seen from behind, 2-3 big words, no blood, readable on a phone.
const T = 1.4;
// A (main): the hooded figure big on the right, title on the left, tiny Mitch seen from behind
export const ThumbA: React.FC = () => (
  <Thumb3 W={1280} H={720} t={T} cam={{ p: [-0.62, 1.52, 1.5], l: [0.58, 1.52, -0.25], fov: 44, move: 'hold' }}
    overlay={<Title3 a="IT TOOK" b="A PIECE" W={1280} H={720} sa={84} sb={120} />}>
    <HorrorBack3 t={T} />
    <Eyeless at={[0.6, 0, -0.25]} rot={-0.75} t={T} pose="stand" scale={1.12} />
    <pointLight position={[-0.3, 1.75, 1.0]} intensity={5} distance={3.5} decay={1.6} color="#cfe0ea" />
    <Person s={MITCH} at={[-1.25, 0, 0.75]} rot={-2.2} t={T} pose="idle" seed={2} detail={false} />
  </Thumb3>
);
// B: a much closer crop (the hood and the shoulders fill the frame), a SHORTER title, the red moon smaller
export const ThumbB: React.FC = () => (
  <Thumb3 W={1280} H={720} t={T} cam={{ p: [0.42, 1.68, 0.95], l: [0, 1.63, 0], fov: 42, move: 'hold' }}
    overlay={<Title3 a="NO" b="EYES" W={1280} H={720} sa={92} sb={140} x={0.045} y={0.06} />}>
    <HorrorBack3 t={T} hands={2} />
    <Eyeless at={[0, 0, 0]} rot={0.12} t={T} pose="stand" />
    <pointLight position={[0.35, 1.78, 1.1]} intensity={6} distance={3} decay={1.6} color="#dfeaf2" />
  </Thumb3>
);
// C: the key object big and glowing (the camera with its red record light), the figure smaller and further away
export const ThumbC: React.FC = () => (
  <Thumb3 W={1280} H={720} t={T} cam={{ p: [0.18, 1.18, 1.25], l: [0, 1.05, 0], fov: 40, move: 'hold' }}
    overlay={<Title3 a="ONE" b="PHOTOGRAPH" W={1280} H={720} sa={70} sb={104} align="center" y={0.05} />}>
    <HorrorBack3 t={T} hands={3} />
    <Camera3 at={[0, 1.05, 0]} rot={0.9} t={T} s={3.2} />
    <Halo at={[-0.1, 1.06, 0.1]} r={0.3} c={EJP.red} o={0.16} t={T} />
    <pointLight position={[0.5, 1.6, 1.2]} intensity={5} distance={4} color="#ffd0b0" />
    <Eyeless at={[1.5, 0, -4.6]} rot={-0.35} t={T} pose="stand" />
  </Thumb3>
);
// R (Reel, 1080x1920): title on top, the hooded figure in the middle, Mitch tiny below
export const ThumbR: React.FC = () => (
  <Thumb3 W={1080} H={1920} t={T} cam={{ p: [0.28, 1.55, 2.0], l: [0, 1.5, -0.1], fov: 48, move: 'hold' }}
    overlay={<Title3 a="IT TOOK" b="A PIECE" W={1080} H={1920} sa={96} sb={132} align="center" y={0.07} />}>
    <HorrorBack3 t={T} />
    <Eyeless at={[0, 0, 0]} rot={0.1} t={T} pose="stand" />
    <pointLight position={[0.3, 1.8, 1.3]} intensity={5} distance={3.5} decay={1.6} color="#cfe0ea" />
    <Person s={MITCH} at={[-0.35, 0, 1.15]} rot={-3.0} t={T} pose="idle" seed={2} detail={false} />
  </Thumb3>
);
