import React from 'react';
import { AbsoluteFill } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import { CamRig, camAt, CamSpec } from './Cam';
import { M, G, PAL, rng, V3 } from './core';
import { Ground, Mist, Flakes, MoonDisc, softTex } from './World';
import { DeadTree, Gravestone } from './Nature';
// ===== THUMBNAIL KIT 3D (fixed engine file): the MOST HORROR backdrop, used for every video.
// Near-black sky fading to blood red, a huge blood-red moon, dead bare trees, crooked gravestones, ground fog, ash,
// and pale hands reaching up out of the ground. No blood on faces, no gore, no weapons on people (channel policy).
export const HandUp: React.FC<{ at: V3; s?: number; rot?: number; c?: string }> = ({ at, s = 1, rot = 0, c = '#cfc9bc' }) => (
  <group position={at} scale={s} rotation={[0, rot, 0]}>
    <mesh position={[0, 0.3, 0]} material={M(c)}><cylinderGeometry args={[0.05, 0.07, 0.6, 5]} /></mesh>
    <mesh position={[0, 0.66, 0]} scale={[1, 1.2, 0.5]} material={M(c)}><boxGeometry args={[0.17, 0.18, 0.12]} /></mesh>
    {[-1.5, -0.5, 0.5, 1.5].map((k, i) => <mesh key={i} position={[k * 0.045, 0.86, 0]} rotation={[(i - 1.5) * 0.12, 0, k * 0.1]} material={M(c)}><cylinderGeometry args={[0.014, 0.018, 0.26, 4]} /></mesh>)}
    <mesh position={[0.1, 0.68, 0.05]} rotation={[0, 0, 0.9]} material={M(c)}><cylinderGeometry args={[0.014, 0.018, 0.16, 4]} /></mesh>
  </group>
);
export const HorrorBack3: React.FC<{ t?: number; seed?: number; hands?: number }> = ({ t = 0, seed = 7, hands = 5 }) => {
  const q = rng(seed);
  return (<>
    <color attach="background" args={['#1a0608']} />
    <fogExp2 attach="fog" args={['#3a0d0c', 0.035]} />
    <ambientLight intensity={0.6} color="#8a3a30" />
    <hemisphereLight args={['#b04a30', '#120608', 0.7]} />
    <directionalLight position={[-6, 9, 12]} intensity={1.5} color="#ff8a5a" />
    <directionalLight position={[4, 6, -14]} intensity={1.9} color="#ff4a3a" />
    <MoonDisc at={[-2, 7.5, -34]} r={5.6} c="#d8242a" t={t} />
    <Ground c="#1d1416" flat={6} hill={1.2} size={120} />
    {Array.from({ length: 9 }, (_, i) => <DeadTree key={i} at={[(q() - 0.5) * 34, 0, -8 - q() * 22]} s={1.4 + q() * 1.4} t={t} seed={i * 7 + 2} c="#0d0a0a" />)}
    {Array.from({ length: 10 }, (_, i) => <Gravestone key={i} at={[(q() - 0.5) * 22, 0, -4 - q() * 14]} kind={i % 3} s={0.8 + q() * 0.5} rot={(q() - 0.5) * 1.2} c="#2a2023" />)}
    {Array.from({ length: hands }, (_, i) => <HandUp key={i} at={[(q() - 0.5) * 12, 0, -1 - q() * 7]} s={0.9 + q() * 0.6} rot={q() * 6} />)}
    <Mist t={t} n={16} area={[-16, 16, -22, 4]} y={0.4} o={0.2} c="#a06050" size={11} />
    <Flakes t={t} n={500} kind="ash" box={[-12, 12, 0, 8, -16, 4]} />
  </>);
};
// one thumbnail = the 3D backdrop + subject, then the title drawn flat on top
export const Thumb3: React.FC<{ W: number; H: number; cam: CamSpec; children?: React.ReactNode; overlay?: React.ReactNode; t?: number }> = ({ W, H, cam, children, overlay, t = 1.4 }) => {
  const cs = camAt(cam, t, 4);
  return (
    <AbsoluteFill style={{ background: '#120508' }}>
      <ThreeCanvas width={W} height={H} camera={{ fov: cs.fov, position: cs.pos }}><CamRig s={cs} W={W} H={H} />{children}</ThreeCanvas>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 38%, rgba(0,0,0,0.6) 100%)' }} />
      {overlay}
    </AbsoluteFill>
  );
};
export const Title3: React.FC<{ a: string; b: string; W: number; H: number; x?: number; y?: number; sa?: number; sb?: number; align?: 'left' | 'center' }> = ({ a, b, W, H, x = 0.04, y = 0.05, sa = 86, sb = 124, align = 'left' }) => (
  <div style={{ position: 'absolute', left: align === 'center' ? 0 : W * x, right: align === 'center' ? 0 : undefined, top: H * y, width: align === 'center' ? W : W * 0.56, textAlign: align === 'center' ? 'center' : 'left' }}>
    <div style={{ fontFamily: 'Lora, Georgia, serif', fontWeight: 700, fontSize: sa, color: '#f6efe2', lineHeight: 1.0, letterSpacing: 1, textShadow: '0 6px 22px rgba(0,0,0,0.95), 0 0 10px rgba(0,0,0,1)' }}>{a}</div>
    <div style={{ fontFamily: 'Lora, Georgia, serif', fontWeight: 700, fontSize: sb, color: '#ff2f2a', lineHeight: 1.02, letterSpacing: 1, textShadow: '0 0 34px rgba(255,40,30,0.75), 0 6px 22px rgba(0,0,0,0.95)' }}>{b}</div>
  </div>
);
