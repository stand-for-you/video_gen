import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { PAL } from './palette';
import { hash1, onTwos } from './noise';

/**
 * Scroll Kaos v0.5 - the hand-drawn pass.
 *
 * The 3D render gives a clean, mathematically perfect ink line. The reference video does
 * NOT have that: its line wobbles and its pressure varies, because it is drawn. This layer
 * is where that comes from. A seeded turbulence displacement warps the whole composited
 * frame by 1-3 px, so every edge in the picture - outline, fill boundary, text on a wall -
 * wobbles together, the way a redrawn frame does.
 *
 * The displacement seed steps on TWOS (one new wobble every 2 frames at 30 fps = 15 "drawn"
 * frames a second). That is the boil rate of hand-drawn animation. Stepping every frame
 * looks like video noise; holding it still looks like 3D.
 *
 * Everything here is a pure function of `frame`, so chunked cloud renders match exactly.
 */

export type PostOpts = {
  /** ink boil strength in px. 0 = off (use for UI cards, which must stay crisp). */
  boil?: number;
  /** paper grain opacity */
  grain?: number;
  /** corner darkening */
  vignette?: number;
  /** red/cyan VHS bars. 0 = off, 1 = full scare. */
  glitch?: number;
  /** push everything toward one colour - used for the monster's arrival */
  wash?: string;
  washAmount?: number;
};

export const PostDefs: React.FC<{ frame: number; boil: number }> = ({ frame, boil }) => {
  const step = onTwos(frame, 2);
  // the seed only ever takes a few hundred values, so the browser caches the turbulence
  const seed = Math.floor(hash1(step) * 400);
  return (
    <svg width={0} height={0} style={{ position: 'absolute' }} aria-hidden>
      <defs>
        <filter id="skBoil" x="-4%" y="-4%" width="108%" height="108%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.013 0.021" numOctaves={2} seed={seed} result="t" />
          <feDisplacementMap in="SourceGraphic" in2="t" scale={boil} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  );
};

/** Paper grain. Static per frame-pair so it boils with the line instead of crawling. */
const Grain: React.FC<{ frame: number; amount: number }> = ({ frame, amount }) => {
  const step = onTwos(frame, 2);
  const seed = Math.floor(hash1(step + 77) * 400);
  return (
    <AbsoluteFill style={{ opacity: amount, mixBlendMode: 'overlay', pointerEvents: 'none' }}>
      <svg width="100%" height="100%">
        <filter id={`skGrain${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={1} seed={seed} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#skGrain${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

/**
 * Red/cyan VHS bars. Horizontal, semi-transparent, a handful at a time, each one sliding.
 * Photosensitive safety: never more than 3 bars on screen, never a full-frame flash, and
 * never faster than one change every 2 frames.
 */
export const GlitchBars: React.FC<{ frame: number; amount: number; W: number; H: number }> = ({ frame, amount, W, H }) => {
  if (amount <= 0) return null;
  const step = onTwos(frame, 2);
  const bars = [0, 1, 2].map((i) => {
    const a = hash1(step * 7 + i * 31);
    const b = hash1(step * 13 + i * 17);
    const y = a * H;
    const h = 6 + b * (H * 0.035);
    const dx = (b - 0.5) * W * 0.05 * amount;
    const on = hash1(step * 3 + i * 5) < 0.55 + 0.4 * amount;
    if (!on) return null;
    return (
      <React.Fragment key={i}>
        <div style={{ position: 'absolute', left: dx, top: y, width: W, height: h, background: PAL.glitchRed, opacity: 0.3 * amount, mixBlendMode: 'screen' }} />
        <div style={{ position: 'absolute', left: -dx, top: y + h * 0.45, width: W, height: h * 0.7, background: PAL.glitchCyan, opacity: 0.26 * amount, mixBlendMode: 'screen' }} />
      </React.Fragment>
    );
  });
  return <AbsoluteFill style={{ pointerEvents: 'none' }}>{bars}</AbsoluteFill>;
};

/**
 * Wrap the 3D canvas in this. Children are warped, then grain / vignette / glitch go on
 * top UNWARPED, so grain stays fine and bars stay straight.
 */
export const Post3D: React.FC<React.PropsWithChildren<PostOpts & { W: number; H: number }>> = ({
  children, W, H, boil = 2.2, grain = 0.1, vignette = 0.5, glitch = 0, wash, washAmount = 0,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: '#07060b' }}>
      <PostDefs frame={frame} boil={boil} />
      <AbsoluteFill style={boil > 0 ? { filter: 'url(#skBoil)' } : undefined}>{children}</AbsoluteFill>
      {wash && washAmount > 0 && (
        <AbsoluteFill style={{ background: wash, opacity: washAmount, mixBlendMode: 'multiply', pointerEvents: 'none' }} />
      )}
      {grain > 0 && <Grain frame={frame} amount={grain} />}
      {vignette > 0 && (
        <AbsoluteFill style={{
          pointerEvents: 'none',
          background: `radial-gradient(ellipse at 50% 48%, rgba(0,0,0,0) 42%, rgba(0,0,0,${vignette * 0.55}) 78%, rgba(0,0,0,${vignette}) 100%)`,
        }} />
      )}
      <GlitchBars frame={frame} amount={glitch} W={W} H={H} />
    </AbsoluteFill>
  );
};
