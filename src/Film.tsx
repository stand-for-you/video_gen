import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion';
import { makeSheet, SceneShot, findShot } from './Scene';
import { TitleCard, Intertitle } from './ui/Card';
import { ChoiceScreen } from './ui/ChoiceScreen';
import { EndScreen } from './ui/EndScreen';
import type { Cue } from './ui/Subtitles';
import type { ShotFile } from './Shot';
import STORY from './story.json';
import FILM from './film.json';

/**
 * THE FINISHED FILM: title card + story + the three choice screens + the 5-stage end screen,
 * on one timeline, in one composition.
 *
 * v0.5 shipped these as separate compositions and tools/render.sh only rendered the story
 * body, so the delivered video had no title, no choices and no end screen. This stitches
 * them, and tools/film.py decides where each card sits.
 *
 * TWO RULES THIS FILE OBEYS
 * 1. The narration never pauses, so a card is never INSERTED - it plays OVER the scene whose
 *    id story.json names, while the narrator reads the question. Picture and voice stay in
 *    step no matter how the video is re-timed.
 * 2. Nothing is drawn twice. While a card is up, the story body returns null, so a 25-minute
 *    render is not spent on 3D nobody will see behind an opaque card.
 */

const S = STORY as any;
const F = FILM as any;

type CardSpan = { kind: string; from: number; dur: number; part?: number; shot: string };

/** The story body, blanked while an opaque card is over it. */
const Body: React.FC<{ data: ShotFile; cues: Cue[]; vertical: boolean; spans: CardSpan[] }> =
  ({ data, cues, vertical, spans }) => {
    const f = useCurrentFrame();
    if (f >= data.frames) return null;
    for (const c of spans) {
      if (f >= c.from && f < c.from + c.dur) return null;
    }
    const sh = findShot(data.shots, f);
    return <SceneShot sh={sh} W={data.w} H={data.h} cues={cues} vertical={vertical} />;
  };

/** One already-approved shot, re-rendered as a still plate for the end screen. */
const PlateAt: React.FC<{ data: ShotFile; index: number }> = ({ data, index }) => {
  const C = React.useMemo(
    () => makeSheet({ ...data, shots: [data.shots[index] ?? data.shots[0]] }),
    [data, index],
  );
  return <C />;
};

/**
 * THE SAME SHOT, AT ANY SIZE - this is what the thumbnails are built on.
 *
 * A thumbnail drawn by hand in CSS is a second, different creature, and the one-creature law
 * reaches the thumbnail (quality-law.md section 7). Rendering an approved shot instead means
 * the creature on the thumbnail IS the creature in the video, with the same rig, the same
 * spec and the same light. Frame 0 of a Still lands mid-shot, so the rig is caught in motion
 * rather than at its rest position.
 */
export const Plate: React.FC<{ data: ShotFile; index: number; W: number; H: number }> =
  ({ data, index, W, H }) => {
    const sh = data.shots[index] ?? data.shots[0];
    const half = Math.max(1, Math.floor((sh.e - sh.s) / 2));
    return <SceneShot sh={{ ...sh, s: -half, e: half }} W={W} H={H} />;
  };

const Choice: React.FC<{ part: number; W: number; H: number }> = ({ part, W, H }) => {
  const p = S.parts[part - 1];
  return (
    <ChoiceScreen
      W={W} H={H} part={p.n}
      a={{ emoji: p.aEmoji, text: p.aText, sub: p.aSub }}
      b={{ emoji: p.bEmoji, text: p.bText, sub: p.bSub }}
      chosen={p.chosen}
      nextLabel={p.nextLabel}
    />
  );
};

export const makeFilm = (kind: 'long' | 'reel', data: ShotFile, cues: Cue[]) => {
  const L = F[kind];
  const spans: CardSpan[] = L.cards ?? [];
  const W = data.w, H = data.h;
  const vertical = kind === 'reel';

  const C: React.FC = () => (
    <AbsoluteFill style={{ background: '#09020b' }}>
      <Body data={data} cues={cues} vertical={vertical} spans={spans} />

      {spans.map((c) => (
        <Sequence key={`${c.kind}-${c.shot}`} from={c.from} durationInFrames={c.dur} layout="none">
          {c.kind === 'title' ? (
            <TitleCard W={W} H={H} title={S.title} accent={S.accent} tagline={S.tagline}
              parts="THE FULL STORY · PARTS 1-4" />
          ) : (
            <Choice part={c.part as number} W={W} H={H} />
          )}
        </Sequence>
      ))}

      {L.endFrames > 0 && (
        <Sequence from={data.frames} durationInFrames={L.endFrames} layout="none">
          <EndScreen
            W={W} H={H}
            title={S.title} accent={S.accent} closer={S.closer} cta={S.cta} teaser={S.teaser}
            recap={S.recap} epilogue={S.epilogue}
            recapClip={(i) => <PlateAt data={data} index={S.recapShot[i]} />}
            epiloguePlate={(i) => <PlateAt data={data} index={S.epilogueShot[i]} />}
            brandPlate={<PlateAt data={data} index={S.brandShot} />}
          />
        </Sequence>
      )}

      {L.tailFrames > 0 && (
        <Sequence from={data.frames} durationInFrames={L.tailFrames} layout="none">
          <Intertitle W={W} H={H} line1={S.reelTail.line1} line2={S.reelTail.line2} />
        </Sequence>
      )}
    </AbsoluteFill>
  );
  return C;
};

export const filmFrames = (kind: 'long' | 'reel'): number => F[kind].filmFrames;
