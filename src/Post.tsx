import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { Defs } from './Kit';
// Shared Yamishibai frame layers: boil (stepped line wobble), paper multiply texture, grain, vignette, chapter card.
export type Cam = { z: number; fx: number; fy: number; tx: number; ty: number };
export const Stage: React.FC<{ W: number; H: number; frame: number; cam: Cam; children: React.ReactNode; boil?: number; tint?: string }> = ({ W, H, frame, cam, children, boil = 3.2, tint }) => {
  const seed = Math.floor(frame / 2) % 5;
  const t = `translate(${W / 2 + cam.tx},${H / 2 + cam.ty}) scale(${cam.z}) translate(${-cam.fx},${-cam.fy})`;
  const g = frame % 4;
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute' }}>
        <Defs />
        <defs><filter id="boil" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.013" numOctaves={1} seed={seed} /><feDisplacementMap in="SourceGraphic" scale={boil} /></filter></defs>
        <g filter={boil > 0 ? 'url(#boil)' : undefined}><g transform={t}>{children}</g></g>
        {tint && <rect x={0} y={0} width={W} height={H} fill={tint} />}
      </svg>
      <Img src={staticFile('paper.jpg')} style={{ position: 'absolute', width: Math.max(W, H), height: Math.max(W, H), left: (W - Math.max(W, H)) / 2 - (g % 2) * 6, top: (H - Math.max(W, H)) / 2 - (g > 1 ? 6 : 0), mixBlendMode: 'multiply', opacity: 0.5 }} />
      <Img src={staticFile(`grain${g}.png`)} style={{ position: 'absolute', width: W, height: H, left: 0, top: 0, mixBlendMode: 'overlay', opacity: 0.16 }} />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 48%, rgba(0,0,0,0) 52%, rgba(0,0,0,0.62) 100%)' }} />
    </AbsoluteFill>
  );
};
