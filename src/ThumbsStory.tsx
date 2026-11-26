import React from 'react';
import { AbsoluteFill } from 'remotion';
import { PAL } from './three/palette';
import { HEAD, KICKER, STROKE, GLOW, u } from './ui/type';
import { Plate } from './Film';
import STORY from './story.json';
import L from './shots_long.json';
import type { ShotFile } from './Shot';

/**
 * THUMBNAILS - "I Know You're Awake".
 *
 * Each one is a REAL SHOT from the video with type over it, not a drawing of its own:
 *   A  the thing bent over in the bedroom doorway, full body            (shot b34_3)
 *   B  the wall at 5:30 a.m. with the message readable, two words of type (shot b63_1)
 *   C  the key object: the gap under the bed, with a hand in it          (shot b66_1)
 *   R  the vertical cover: both parents arranged to face the bed         (shot b00_1)
 *
 * They differ in SUBJECT, in crop and in which colour carries the type, so the A/B test is
 * testing three different ideas and not three fonts. And because they are rendered from the
 * shot list, the creature on them cannot drift from the creature in the film.
 */
const S = STORY as any;
const long = L as unknown as ShotFile;

const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.78 }) => (
  <AbsoluteFill style={{
    background: `radial-gradient(ellipse at 50% 42%, rgba(9,2,11,0) 18%, rgba(9,2,11,${strength}) 86%)`,
  }} />
);

const Bar: React.FC<{ W: number; top: string; children: React.ReactNode }> = ({ W, top, children }) => (
  <div style={{ position: 'absolute', left: 0, right: 0, top, textAlign: 'center' }}>{children}</div>
);

export const ThumbA: React.FC = () => (
  <AbsoluteFill style={{ background: PAL.cardBg0 }}>
    <Plate data={long} index={84} W={1280} H={720} />
    <Vignette strength={0.72} />
    <Bar W={1280} top="6%">
      <div style={{ ...HEAD, fontSize: 92 * u(1280), lineHeight: 1.02, textShadow: STROKE(7 * u(1280)) }}>
        {S.title} <span style={{ color: PAL.coral }}>{S.accent}</span>
      </div>
    </Bar>
    <Bar W={1280} top="80%">
      <div style={{ ...KICKER, fontSize: 36 * u(1280), color: PAL.orange, textShadow: STROKE(4 * u(1280)) }}>
        WHAT DO YOU DO?
      </div>
    </Bar>
  </AbsoluteFill>
);

export const ThumbB: React.FC = () => (
  <AbsoluteFill style={{ background: PAL.cardBg0 }}>
    <Plate data={long} index={161} W={1280} H={720} />
    <Vignette strength={0.6} />
    <Bar W={1280} top="68%">
      <div style={{ ...HEAD, fontSize: 132 * u(1280), textShadow: STROKE(8 * u(1280)) }}>
        DON'T <span style={{ color: PAL.coral }}>MOVE</span>
      </div>
      <div style={{ ...KICKER, fontSize: 30 * u(1280), color: PAL.gold, marginTop: 10 * u(1280), textShadow: STROKE(3 * u(1280)) }}>
        {S.stakes1} 3 HOURS. NOT ONE BLINK.
      </div>
    </Bar>
  </AbsoluteFill>
);

export const ThumbC: React.FC = () => (
  <AbsoluteFill style={{ background: PAL.cardBg0 }}>
    <Plate data={long} index={166} W={1280} H={720} />
    <AbsoluteFill style={{
      background: `radial-gradient(circle at 42% 62%, ${PAL.coral}2e 0%, transparent 46%)`,
    }} />
    <Vignette strength={0.66} />
    <Bar W={1280} top="9%">
      <div style={{ ...HEAD, fontSize: 86 * u(1280), textShadow: GLOW(20 * u(1280)) }}>
        IT IS <span style={{ color: PAL.coral }}>UNDER THE BED</span>
      </div>
    </Bar>
    <Bar W={1280} top="83%">
      <div style={{ ...KICKER, fontSize: 32 * u(1280), color: PAL.white, textShadow: STROKE(4 * u(1280)) }}>
        AND IT KNOWS YOU ARE AWAKE
      </div>
    </Bar>
  </AbsoluteFill>
);

export const ThumbR: React.FC = () => (
  <AbsoluteFill style={{ background: PAL.cardBg0 }}>
    <Plate data={long} index={0} W={1080} H={1920} />
    <Vignette strength={0.74} />
    <Bar W={1080} top="7%">
      <div style={{ ...HEAD, fontSize: 118 * u(1080), lineHeight: 1.04, textShadow: STROKE(8 * u(1080)) }}>
        {S.title}<br /><span style={{ color: PAL.coral }}>{S.accent}</span>
      </div>
    </Bar>
    <Bar W={1080} top="78%">
      <div style={{ ...KICKER, fontSize: 44 * u(1080), color: PAL.orange, textShadow: STROKE(5 * u(1080)) }}>
        BOTH OF THEM ARE FACING ME
      </div>
      <div style={{ ...KICKER, fontSize: 34 * u(1080), color: PAL.gold, marginTop: 16 * u(1080) }}>
        PART 1
      </div>
    </Bar>
  </AbsoluteFill>
);
