import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { Defs } from './Kit';
// Shared frame layers. v0.4 SMOOTH + CLEAR rules:
//  - NO line boil, NO texture jitter, NO frame-to-frame grain swap (all of these made the picture flicker and look "made of few frames").
//  - Paper texture is a STILL layer (multiply, low opacity) so the paper-cut look stays but the picture stays clean.
//  - The camera transform is continuous (see Player.camOf); every element moves on every frame.
export type Cam = { z: number; fx: number; fy: number; tx: number; ty: number; rot?: number };
export const Stage: React.FC<{ W: number; H: number; frame: number; cam: Cam; children: React.ReactNode; tint?: string; paper?: number; grain?: number; vignette?: number }> = ({ W, H, cam, children, tint, paper = 0.32, grain = 0.06, vignette = 0.5 }) => {
  const t = `translate(${W / 2 + cam.tx},${H / 2 + cam.ty}) rotate(${cam.rot || 0}) scale(${cam.z}) translate(${-cam.fx},${-cam.fy})`;
  const M = Math.max(W, H);
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute' }}>
        <Defs />
        <g transform={t}>{children}</g>
        {tint && <rect x={0} y={0} width={W} height={H} fill={tint} />}
      </svg>
      {paper > 0 && <Img src={staticFile('paper.jpg')} style={{ position: 'absolute', width: M, height: M, left: (W - M) / 2, top: (H - M) / 2, mixBlendMode: 'multiply', opacity: paper }} />}
      {grain > 0 && <Img src={staticFile('grain0.png')} style={{ position: 'absolute', width: W, height: H, left: 0, top: 0, mixBlendMode: 'overlay', opacity: grain }} />}
      {vignette > 0 && <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 48%, rgba(0,0,0,0) 58%, rgba(0,0,0,${vignette}) 100%)` }} />}
    </AbsoluteFill>
  );
};
