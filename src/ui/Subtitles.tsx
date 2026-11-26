import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { SPEAKER, type SpeakerRole, PAL } from '../three/palette';
import { FACE, STROKE, u } from './type';

/**
 * SPEAKER-BADGED SUBTITLES (reference throughout).
 *
 * Two things the first read of the reference gets wrong, both checked against the frames:
 *   1. the speaker colour tints the CAPTION TEXT as well as the tag. The protagonist is the
 *      only speaker with a white caption; the creature's own lines are coral.
 *   2. the tag is tiny - about a third the caption size - and sits directly above it with a
 *      small filled dot in front. It is a badge, not a label bar.
 *
 * Chunks are 2-6 words, at most 2 lines, cut on the voice timing that tts.py writes.
 */

export type Cue = {
  /** frame the chunk appears */
  s: number;
  /** frame it leaves */
  e: number;
  /** "CHRIS (YOU)" - already uppercased by tools/subs.py */
  who: string;
  role: SpeakerRole;
  /** "(on the phone)", "(in the closet)", "(whispering)" - lowercase, optional */
  state?: string;
  text: string;
};

export const SubtitleLayer: React.FC<{ cues: Cue[]; W: number; H: number; vertical?: boolean }> = ({ cues, W, H, vertical }) => {
  const f = useCurrentFrame();
  const cue = cues.find((c) => f >= c.s && f < c.e);
  if (!cue) return null;
  const s = u(W);
  const col = SPEAKER[cue.role] ?? SPEAKER.stranger;
  // Reel captions sit higher: the bottom sixth of a 9:16 frame is under the UI chrome.
  const bottom = vertical ? H * 0.2 : H * 0.075;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom, textAlign: 'center', padding: `0 ${W * 0.08}px` }}>
        <div style={{
          fontFamily: FACE, fontWeight: 800, fontSize: 21 * s, letterSpacing: '0.14em',
          color: col.tag, marginBottom: 7 * s, textShadow: STROKE(2.2 * s),
        }}>
          <span style={{
            display: 'inline-block', width: 9 * s, height: 9 * s, borderRadius: 9 * s,
            background: col.tag, marginRight: 9 * s, verticalAlign: 'middle',
          }} />
          {cue.who}
          {cue.state && <span style={{ fontWeight: 700, letterSpacing: '0.04em', textTransform: 'lowercase', opacity: 0.85 }}> {cue.state}</span>}
        </div>
        <div style={{
          fontFamily: FACE, fontWeight: 800, fontSize: 52 * s, lineHeight: 1.12,
          color: col.text, textShadow: STROKE(5 * s), textTransform: 'uppercase',
        }}>
          {cue.text}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Split a spoken line into 2-6 word caption chunks. Used by tools/subs.py's mirror test. */
export const chunkLine = (text: string, maxWords = 5): string[] => {
  const w = text.trim().split(/\s+/);
  const out: string[] = [];
  for (let i = 0; i < w.length; i += maxWords) out.push(w.slice(i, i + maxWords).join(' '));
  return out;
};
