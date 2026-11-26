import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { PAL } from '../three/palette';
import { FACE, GLOW, HEAD, KICKER, STROKE, u } from './type';

/**
 * THE INTERACTIVE CHOICE SCREEN (reference 1:31, 2:51, 4:29).
 *
 * The beat order is exact, and it is the whole trick of the format - get it wrong and the
 * card stops feeling like a decision:
 *   0-8    "END OF PART n" then "WHAT DO YOU DO?"
 *   10-22  option A slides in from the left, in its own colour
 *   22-34  "or" appears, then option B slides in, in its own colour
 *   40     a beat of nothing. The viewer is choosing.
 *   52     the "✓ YOU CHOSE" badge drops onto the chosen button
 *   52-60  the UNCHOSEN button drains to grey
 *   70     "PART n+1 ▶"
 *
 * The colours belong to the OPTIONS, not to the outcome: A is always green, B is always
 * orange-red. The chosen one is marked by keeping its colour, gaining a gold border and a
 * glow, and wearing the badge - not by turning green.
 */

export type ChoiceOption = { emoji: string; text: string; sub: string };

const Button: React.FC<{
  o: ChoiceOption; tone: 'A' | 'B'; W: number;
  /** 0 = off screen, 1 = landed */ enter: number;
  /** 1 = chosen and lit, 0 = drained to grey */ live: number;
  chosen: boolean; badge: number;
}> = ({ o, tone, W, enter, live, chosen, badge }) => {
  const s = u(W);
  const fill = tone === 'A' ? PAL.green : '#e2543f';
  const dead = '#2a2930';
  const bg = chosen ? fill : `color-mix(in srgb, ${fill} ${Math.round(live * 100)}%, ${dead})`;
  const textCol = chosen ? '#ffffff' : `color-mix(in srgb, #ffffff ${Math.round(25 + live * 75)}%, ${PAL.greyDark})`;
  return (
    <div style={{ position: 'relative', opacity: enter, transform: `translateX(${(1 - enter) * -90 * s}px)` }}>
      {chosen && badge > 0 && (
        <div style={{
          ...KICKER, position: 'absolute', top: -34 * s, left: 8 * s, fontSize: 19 * s, color: PAL.gold,
          opacity: badge, transform: `translateY(${(1 - badge) * 10 * s}px)`, whiteSpace: 'nowrap',
        }}>✔ YOU CHOSE</div>
      )}
      <div style={{
        minWidth: 690 * s, padding: `${20 * s}px ${30 * s}px ${16 * s}px`, borderRadius: 18 * s,
        background: bg,
        border: chosen ? `${4 * s}px solid ${PAL.gold}` : `${4 * s}px solid rgba(0,0,0,0)`,
        boxShadow: chosen ? `0 0 ${30 * s}px rgba(249,210,97,${0.55 * badge}), 0 ${8 * s}px ${16 * s}px rgba(0,0,0,0.5)` : `0 ${8 * s}px ${16 * s}px rgba(0,0,0,0.45)`,
        textAlign: 'center',
      }}>
        <div style={{ fontFamily: FACE, fontWeight: 800, fontSize: 36 * s, color: textCol, textShadow: chosen ? STROKE(2.4 * s) : 'none', whiteSpace: 'nowrap' }}>
          <span style={{ marginRight: 14 * s }}>{o.emoji}</span>{o.text}
        </div>
        <div style={{ fontFamily: FACE, fontWeight: 700, fontSize: 21 * s, color: chosen ? 'rgba(255,255,255,0.92)' : `color-mix(in srgb, #ffffff ${Math.round(18 + live * 62)}%, ${PAL.greyDark})`, marginTop: 4 * s }}>
          {/* the brackets belong to the card, not to the story text */}
          ({o.sub.replace(/^\(|\)$/g, '')})
        </div>
      </div>
    </div>
  );
};

export const ChoiceScreen: React.FC<{
  W: number; H: number;
  part: number;
  question?: string;
  a: ChoiceOption;
  b: ChoiceOption;
  /** which one the story takes */
  chosen: 'A' | 'B';
  nextLabel?: string;
}> = ({ W, H, part, question = 'WHAT DO YOU DO?', a, b, chosen, nextLabel }) => {
  const f = useCurrentFrame();
  const s = u(W);
  const ramp = (from: number, to: number) => interpolate(f, [from, to], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const headIn = ramp(0, 7);
  const aIn = ramp(10, 20);
  const orIn = ramp(22, 27);
  const bIn = ramp(26, 36);
  const badge = ramp(52, 60);
  const drain = 1 - ramp(52, 62);
  const next = ramp(70, 78);
  const vertical = H > W;

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 46%, ${PAL.cardBg1} 0%, ${PAL.cardBg0} 70%)`, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ ...KICKER, fontSize: 26 * s, color: PAL.orange, opacity: headIn }}>END OF PART {part}</div>
      <div style={{ ...HEAD, fontSize: 104 * s, marginTop: 10 * s, textShadow: GLOW(24 * s), opacity: headIn }}>{question}</div>

      <div style={{
        display: 'flex', flexDirection: vertical ? 'column' : 'row', alignItems: 'center',
        gap: 26 * s, marginTop: 70 * s,
      }}>
        <Button o={a} tone="A" W={W} enter={aIn} live={chosen === 'A' ? 1 : drain} chosen={chosen === 'A'} badge={badge} />
        <div style={{ fontFamily: FACE, fontWeight: 700, fontSize: 26 * s, color: PAL.grey, opacity: orIn * drain }}>or</div>
        <Button o={b} tone="B" W={W} enter={bIn} live={chosen === 'B' ? 1 : drain} chosen={chosen === 'B'} badge={badge} />
      </div>

      {nextLabel && (
        <div style={{ ...HEAD, fontSize: 32 * s, marginTop: 64 * s, opacity: next }}>
          {nextLabel} <span style={{ color: PAL.orange }}>▶</span>
        </div>
      )}
    </AbsoluteFill>
  );
};

/** How long a choice card runs, in frames at 30 fps. 90 = 3.0 s. */
export const CHOICE_FRAMES = 96;
