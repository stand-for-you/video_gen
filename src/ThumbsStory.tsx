import React from 'react';
import { Thumb3, HorrorBack3, Title3 } from './k3/Thumbs3';
import { Person } from './k3/Person';
import { Seer, Monitor } from './SR3';
import { JACK_HOME } from './SeerCast';
import { Halo } from './k3/World';
// STORY SLOT (kit q, "The Seer of Possibilities"): the four thumbnails.
// A/B/C = the YouTube A/B test (1280x720, ONE clear difference each), R = the Reel (1080x1920).
// Law: the giant ghost figure (the Seer), the man tiny and seen from behind, 2-3 big words, no blood, readable on a phone.
const T = 1.4;
// A (main): the Seer big on the right, title left, tiny Jack from behind
export const ThumbA: React.FC = () => (
  <Thumb3 W={1280} H={720} t={T} cam={{ p: [-0.95, 1.82, 1.65], l: [0.55, 1.8, -0.25], fov: 46, move: 'hold' }}
    overlay={<Title3 a="ONE SMALL" b="FAVOUR" W={1280} H={720} sa={84} sb={120} />}>
    <HorrorBack3 t={T} />
    <Seer at={[0.58, 0, -0.25]} rot={-0.55} t={T} scale={1.15} />
    <Person s={JACK_HOME} at={[-1.02, 0, 0.42]} rot={-2.35} t={T} pose="idle" seed={2} detail={false} />
  </Thumb3>
);
// B: much closer crop (the face and the shoulders only), SHORTER title (2 words), the red moon smaller
export const ThumbB: React.FC = () => (
  <Thumb3 W={1280} H={720} t={T} cam={{ p: [0.62, 1.93, 1.5], l: [0, 1.92, 0], fov: 44, move: 'hold' }}
    overlay={<Title3 a="SAY" b="THANK YOU" W={1280} H={720} sa={74} sb={112} x={0.045} y={0.055} />}>
    <HorrorBack3 t={T} hands={2} />
    <Seer at={[0, 0, 0]} rot={0.1} t={T} />
  </Thumb3>
);
// C: the key object big and glowing (the screen with the red words), the Seer smaller and further away, title on top
export const ThumbC: React.FC = () => (
  <Thumb3 W={1280} H={720} t={T} cam={{ p: [0.1, 0.9, 1.22], l: [0, 0.86, 0], fov: 36, move: 'hold' }}
    overlay={<Title3 a="IT ASKED FOR" b="A FAVOUR" W={1280} H={720} sa={66} sb={96} align="center" y={0.045} />}>
    <HorrorBack3 t={T} hands={3} />
    <Monitor at={[0, 0, 0]} t={T} lines={['Hello Jack.', 'I need a favour', 'from you.']} typed={1} light={1.2} s={2.4} />
    <Halo at={[0, 0.86, 0.06]} r={0.7} c="#ff3a2a" o={0.26} t={T} />
    <pointLight position={[0.3, 1.3, 1.0]} intensity={3.0} distance={4} color="#ff6a4a" />
    <Seer at={[1.5, 0, -4.6]} rot={-0.3} t={T} />
  </Thumb3>
);
// R (Reel, 1080x1920): title on top, the Seer in the middle, Jack tiny below
export const ThumbR: React.FC = () => (
  <Thumb3 W={1080} H={1920} t={T} cam={{ p: [0.32, 1.78, 2.95], l: [0, 1.72, -0.1], fov: 46, move: 'hold' }}
    overlay={<Title3 a="ONE SMALL" b="FAVOUR" W={1080} H={1920} sa={96} sb={132} align="center" y={0.07} />}>
    <HorrorBack3 t={T} />
    <Seer at={[0, 0, 0]} rot={0.1} t={T} />
    <Person s={JACK_HOME} at={[-0.3, 0, 1.08]} rot={-3.0} t={T} pose="idle" seed={2} detail={false} />
  </Thumb3>
);
