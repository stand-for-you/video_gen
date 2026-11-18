import React from 'react';
import { Thumb3, HorrorBack3, Title3 } from './k3/Thumbs3';
import { Person } from './k3/Person';
import { Jack, MITCH, CamProp } from './EJ3';
// STORY SLOT: the four thumbnails for "Eyeless Jack". A/B/C = the YouTube A/B test (1280x720, ONE clear difference
// each), R = the Reel (1080x1920). Law: Jack big and masked, Mitch tiny and seen from behind, 2-3 big words, no
// blood on the mask, readable on a phone.
const T = 1.4;
// A (main): Jack standing tall on the right, mask reading clearly, claws out; title left; tiny Mitch from behind.
export const ThumbA: React.FC = () => (
  <Thumb3 W={1280} H={720} t={T} cam={{ p: [-0.85, 1.65, 3.2], l: [0.95, 1.35, -0.2], fov: 44, move: 'hold' }}
    overlay={<Title3 a="EYELESS" b="JACK" W={1280} H={720} sa={88} sb={126} />}>
    <HorrorBack3 t={T} />
    <Jack at={[1.1, 0, -0.3]} rot={-0.5} t={T} pose="stand" scale={1.1} />
    <Person s={MITCH} at={[-0.2, 0, 1.1]} rot={-2.9} t={T} pose="idle" seed={2} />
  </Thumb3>
);
// B: much closer crop (only the mask and the shoulders), SHORTER title (2 words).
export const ThumbB: React.FC = () => (
  <Thumb3 W={1280} H={720} t={T} cam={{ p: [0.3, 1.78, 1.7], l: [0, 1.73, 0], fov: 38, move: 'hold' }}
    overlay={<Title3 a="NO" b="EYES" W={1280} H={720} sa={84} sb={128} x={0.045} y={0.055} />}>
    <HorrorBack3 t={T} hands={2} />
    <Jack at={[0, 0, 0]} rot={0.12} t={T} pose="stand" scale={1.1} />
  </Thumb3>
);
// C: the key object big and glowing (the camera that caught it), Jack smaller and further back, title on top.
export const ThumbC: React.FC = () => (
  <Thumb3 W={1280} H={720} t={T} cam={{ p: [0.18, 1.05, 0.55], l: [0, 1.0, 0], fov: 46, move: 'hold' }}
    overlay={<Title3 a="CAUGHT ON" b="CAMERA" W={1280} H={720} sa={62} sb={98} align="center" y={0.045} />}>
    <HorrorBack3 t={T} hands={3} />
    <group position={[0, 1.0, 0]} rotation={[0, 0.3, 0]} scale={3.2}><CamProp at={[0, 0, 0]} t={T} flash={1} /></group>
    <pointLight position={[0.3, 1.1, 0.5]} intensity={6} distance={5} color="#eaf3ff" />
    <Jack at={[1.4, 0, -5]} rot={-0.35} t={T} pose="stand" />
  </Thumb3>
);
// R (Reel, 1080x1920): title on top, Jack centered, Mitch tiny below.
export const ThumbR: React.FC = () => (
  <Thumb3 W={1080} H={1920} t={T} cam={{ p: [0.2, 1.65, 2.9], l: [0, 1.5, 0], fov: 46, move: 'hold' }}
    overlay={<Title3 a="EYELESS" b="JACK" W={1080} H={1920} sa={100} sb={140} align="center" y={0.07} />}>
    <HorrorBack3 t={T} />
    <Jack at={[0, 0, 0]} rot={0.12} t={T} pose="stand" scale={1.1} />
    <Person s={MITCH} at={[-0.45, 0, 2.15]} rot={-3.0} t={T} pose="idle" seed={2} />
  </Thumb3>
);
