import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { PAL } from '../three/palette';
import { FACE, GLOW, HEAD, KICKER, SUB, u } from './type';

/**
 * TITLE CARD (reference 0:07-0:11).
 * Dark purple-black radial. The title lands first, the tagline second, the parts line last -
 * three beats, never all at once.
 */
export const TitleCard: React.FC<{
  W: number; H: number;
  /** the plain part of the title */
  title: string;
  /** the ONE word painted coral. Keep it to one word. */
  accent: string;
  /** italic tagline, with the one emphasised word wrapped in *stars* */
  tagline: string;
  parts?: string;
}> = ({ W, H, title, accent, tagline, parts = 'THE FULL STORY · PARTS 1-4' }) => {
  const f = useCurrentFrame();
  const s = u(W);
  const inAt = (at: number) => interpolate(f, [at, at + 7], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const lift = (at: number) => (1 - inAt(at)) * 22 * s;
  const bits = tagline.split('*');
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 46%, ${PAL.cardBg1} 0%, ${PAL.cardBg0} 68%)`, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ ...HEAD, fontSize: 150 * s, lineHeight: 1, textShadow: GLOW(26 * s), opacity: inAt(0), transform: `translateY(${lift(0)}px)` }}>
        {title} <span style={{ color: PAL.coral }}>{accent}</span>
      </div>
      <div style={{ ...SUB, fontSize: 40 * s, color: '#fdfdfd', marginTop: 26 * s, textShadow: GLOW(14 * s), opacity: inAt(10), transform: `translateY(${lift(10)}px)` }}>
        {bits.map((b, i) => (i % 2 ? <span key={i} style={{ color: PAL.coral }}>{b}</span> : <span key={i}>{b}</span>))}
      </div>
      <div style={{ ...KICKER, fontSize: 25 * s, color: PAL.orange, marginTop: 34 * s, opacity: inAt(20), transform: `translateY(${lift(20)}px)` }}>
        {parts}
      </div>
    </AbsoluteFill>
  );
};

/**
 * INTERTITLE (reference 0:28-0:30). Pure black, centred grey-white stakes text, two beats:
 * the name, then what it means. No motion, no music swell - the silence is the point.
 */
export const Intertitle: React.FC<{ W: number; H: number; line1: string; line2?: string }> = ({ W, H, line1, line2 }) => {
  const f = useCurrentFrame();
  const s = u(W);
  const a1 = interpolate(f, [0, 6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const a2 = interpolate(f, [14, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ background: '#000', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ ...HEAD, fontWeight: 800, fontSize: 48 * s, letterSpacing: '0.06em', color: '#e8e6ea', opacity: a1 }}>{line1}</div>
      {line2 && (
        <div style={{ fontFamily: FACE, fontWeight: 700, fontSize: 27 * s, letterSpacing: '0.05em', color: '#9e9da4', marginTop: 20 * s, opacity: a2 }}>{line2}</div>
      )}
    </AbsoluteFill>
  );
};

/**
 * CHAPTER / PART BUMPER - "PART 2 ▶" after a choice resolves.
 */
export const PartBumper: React.FC<{ W: number; H: number; label: string }> = ({ W, H, label }) => {
  const s = u(W);
  const f = useCurrentFrame();
  const a = interpolate(f, [0, 5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ ...HEAD, fontSize: 34 * s, opacity: a }}>
        {label} <span style={{ color: PAL.orange }}>▶</span>
      </div>
    </AbsoluteFill>
  );
};
