import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { PAL } from '../three/palette';
import { FACE, GLOW, HEAD, KICKER, SUB, STROKE, u } from './type';

/**
 * THE 5-STAGE RETENTION OUTRO (reference 7:14 to 8:11 - the whole last minute).
 *
 * Every stage below was read off the reference frames, including the exact wording pattern.
 * The stages are five SEPARATE jobs and they must stay in this order:
 *   A  THE END          - closes the story and asks the comment question        (~6 s)
 *   B  EVERY CHOICE YOU MADE - replays the viewer's own decisions              (10-15 s)
 *   C  character epilogue roll - tells you what happened to each of them       (15-20 s)
 *   D  series branding - "A #WHATWOULDYOUDO STORY" over a wide pull-back       (~4 s)
 *   E  YouTube end screen - the two element boxes in their safe zones          (15-20 s)
 *
 * Stage C is the ONLY place in the whole video where the camera leaves first person.
 */

export const END_FRAMES = { A: 180, B: 390, C: 540, D: 120, E: 540 } as const;
export const endTotal = () => Object.values(END_FRAMES).reduce((a, b) => a + b, 0);

/* ------------------------------------------------------------------ A: THE END */
export const StageA: React.FC<{ W: number; H: number; title: string; closer: string; cta: string }> = ({ W, H, title, closer, cta }) => {
  const f = useCurrentFrame();
  const s = u(W);
  const r = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ background: '#000', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ ...KICKER, fontSize: 25 * s, color: PAL.coral, opacity: r(0, 6) }}>{title}</div>
      <div style={{ ...HEAD, fontSize: 158 * s, lineHeight: 1, marginTop: 8 * s, textShadow: GLOW(26 * s), opacity: r(3, 10) }}>THE END</div>
      <div style={{ ...SUB, fontSize: 48 * s, color: PAL.gold, marginTop: 30 * s, textShadow: GLOW(12 * s), opacity: r(14, 22) }}>{closer}</div>
      <div style={{
        position: 'absolute', bottom: H * 0.1, left: 0, right: 0, textAlign: 'center',
        fontFamily: FACE, fontWeight: 800, fontSize: 36 * s, color: '#fdfdfd', textShadow: GLOW(10 * s), opacity: r(30, 40),
      }}>{cta}</div>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------- B: EVERY CHOICE YOU MADE */
export type RecapItem = { part: number; emoji: string; text: string };

/** The recap plays the chosen clips back. `clip` is whatever renders that part's shot. */
export const StageB: React.FC<{ W: number; H: number; items: RecapItem[]; clip: (i: number) => React.ReactNode }> = ({ W, H, items, clip }) => {
  const f = useCurrentFrame();
  const s = u(W);
  const per = Math.floor(END_FRAMES.B / Math.max(1, items.length));
  const i = Math.min(items.length - 1, Math.floor(f / per));
  const it = items[i];
  const local = f - i * per;
  const a = interpolate(local, [0, 5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <AbsoluteFill style={{ opacity: a }}>{clip(i)}</AbsoluteFill>
      <div style={{
        position: 'absolute', top: H * 0.055, left: 0, right: 0, textAlign: 'center',
        ...HEAD, fontSize: 44 * s, textShadow: STROKE(4 * s),
      }}>EVERY CHOICE YOU MADE</div>
      <div style={{ position: 'absolute', bottom: H * 0.09, left: 0, right: 0, textAlign: 'center', opacity: a }}>
        <div style={{ ...KICKER, fontSize: 20 * s, color: PAL.coral, textShadow: STROKE(2.2 * s) }}>PART {it.part} · YOU CHOSE</div>
        <div style={{
          fontFamily: FACE, fontWeight: 800, fontSize: 46 * s, color: PAL.gold,
          textTransform: 'uppercase', marginTop: 8 * s, textShadow: STROKE(4.5 * s),
        }}>
          <span style={{ marginRight: 14 * s }}>{it.emoji}</span>{it.text}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------- C: character epilogue roll */
export type Epilogue = {
  name: string;
  /** true for the antagonist - the name is painted coral-red */
  villain?: boolean;
  /** true for the protagonist - "(YOU)" is appended */
  you?: boolean;
  /** 3-6 words, lowercase, italic: "ash on the hood." */
  line: string;
};

export const StageC: React.FC<{ W: number; H: number; rows: Epilogue[]; plate: (i: number) => React.ReactNode }> = ({ W, H, rows, plate }) => {
  const f = useCurrentFrame();
  const s = u(W);
  const per = Math.floor(END_FRAMES.C / Math.max(1, rows.length));
  const i = Math.min(rows.length - 1, Math.floor(f / per));
  const r = rows[i];
  const local = f - i * per;
  const a = interpolate(local, [0, 8, per - 10, per], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <AbsoluteFill style={{ opacity: a }}>{plate(i)}</AbsoluteFill>
      <div style={{ position: 'absolute', left: W * 0.055, bottom: H * 0.12, opacity: a }}>
        <div style={{
          fontFamily: FACE, fontWeight: 800, fontSize: 46 * s, letterSpacing: '0.04em',
          color: r.villain ? PAL.coral : '#fdfdfd', textShadow: STROKE(4 * s), textTransform: 'uppercase',
        }}>
          {r.name}{r.you ? ' (YOU)' : ''}
        </div>
        <div style={{ ...SUB, fontSize: 28 * s, color: '#fdfdfd', marginTop: 6 * s, textShadow: STROKE(3 * s) }}>{r.line}</div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------- D: series branding */
export const StageD: React.FC<{ W: number; H: number; title: string; accent: string; plate: React.ReactNode; hashtag?: string }> = ({ W, H, title, accent, plate, hashtag = 'A #WHATWOULDYOUDO STORY' }) => {
  const f = useCurrentFrame();
  const s = u(W);
  const a = interpolate(f, [0, 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <AbsoluteFill>{plate}</AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', opacity: a }}>
        <div style={{ ...HEAD, fontSize: 92 * s, textShadow: STROKE(5 * s) }}>
          {title} <span style={{ color: PAL.coral }}>{accent}</span>
        </div>
        <div style={{ ...KICKER, fontSize: 23 * s, color: PAL.coral, marginTop: 16 * s, textShadow: STROKE(2.4 * s) }}>{hashtag}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* --------------------------------------------------- E: YouTube end screen */
/**
 * The two dashed boxes are NOT decoration: YouTube drops its real clickable elements over
 * them. They must sit inside the safe zones, which is why the geometry below is fixed in
 * fractions of the frame and must not be "improved".
 */
export const StageE: React.FC<{ W: number; H: number; teaser: string }> = ({ W, H, teaser }) => {
  const f = useCurrentFrame();
  const s = u(W);
  const r = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const boxW = W * 0.21, boxH = boxW * 0.42;
  const vertical = H > W;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 44%, ${PAL.cardBg1} 0%, ${PAL.cardBg0} 72%)`, alignItems: 'center' }}>
      <div style={{ ...KICKER, fontSize: 24 * s, color: PAL.coral, marginTop: H * 0.14, opacity: r(0, 6) }}>THANKS FOR WATCHING</div>
      <div style={{ ...HEAD, fontSize: 86 * s, marginTop: 14 * s, textAlign: 'center', textShadow: GLOW(22 * s), opacity: r(4, 12) }}>
        WHAT STORY SHOULD WE DO NEXT?
      </div>
      <div style={{ fontFamily: FACE, fontWeight: 700, fontSize: 30 * s, color: PAL.gold, marginTop: 20 * s, textAlign: 'center', opacity: r(12, 20) }}>
        Comment your idea 👇 The best one becomes the next series.
      </div>
      <div style={{
        display: 'flex', flexDirection: vertical ? 'column' : 'row', gap: W * 0.06,
        marginTop: H * (vertical ? 0.08 : 0.1), opacity: r(20, 30),
      }}>
        {['WATCH NEXT ▶', 'MORE STORIES ▶'].map((t) => (
          <div key={t} style={{
            width: boxW, height: boxH, border: `${3 * s}px dashed rgba(255,255,255,0.45)`,
            borderRadius: 10 * s, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: FACE, fontWeight: 800, fontSize: 23 * s, color: '#fdfdfd',
            background: 'rgba(255,255,255,0.03)',
          }}>{t}</div>
        ))}
      </div>
      <div style={{
        position: 'absolute', bottom: H * 0.055, left: 0, right: 0, textAlign: 'center',
        ...SUB, fontSize: 26 * s, color: PAL.coralSoft, opacity: r(30, 40),
      }}>{teaser}</div>
    </AbsoluteFill>
  );
};

/* --------------------------------------------------------- the whole outro */
export type EndScreenProps = {
  W: number; H: number;
  title: string;          // "SHOOT"
  accent: string;         // "EM"
  closer: string;         // "nobody's dead tonight."
  cta: string;            // "Would YOU have gone out on that beam? Comment what you'd do 👇"
  teaser: string;         // "a monster, a block, a choice you can't take back... tell us 👇"
  recap: RecapItem[];
  epilogue: Epilogue[];
  /** renders the chosen clip for recap item i */
  recapClip: (i: number) => React.ReactNode;
  /** renders the aftermath plate for epilogue row i */
  epiloguePlate: (i: number) => React.ReactNode;
  /** the wide pull-back behind the branding card */
  brandPlate: React.ReactNode;
};

export const EndScreen: React.FC<EndScreenProps> = (p) => {
  const A = END_FRAMES.A, B = END_FRAMES.B, C = END_FRAMES.C, D = END_FRAMES.D, E = END_FRAMES.E;
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={A}><StageA W={p.W} H={p.H} title={`${p.title} ${p.accent}`} closer={p.closer} cta={p.cta} /></Sequence>
      <Sequence from={A} durationInFrames={B}><StageB W={p.W} H={p.H} items={p.recap} clip={p.recapClip} /></Sequence>
      <Sequence from={A + B} durationInFrames={C}><StageC W={p.W} H={p.H} rows={p.epilogue} plate={p.epiloguePlate} /></Sequence>
      <Sequence from={A + B + C} durationInFrames={D}><StageD W={p.W} H={p.H} title={p.title} accent={p.accent} plate={p.brandPlate} /></Sequence>
      <Sequence from={A + B + C + D} durationInFrames={E}><StageE W={p.W} H={p.H} teaser={p.teaser} /></Sequence>
    </AbsoluteFill>
  );
};
