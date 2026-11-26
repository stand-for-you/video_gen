import React from 'react';
import { Composition, Still } from 'remotion';
import { loadBrandFont } from './ui/font';
import { makeStory, makeSheet } from './Scene';
import { makeFilm, filmFrames } from './Film';
import { TitleCard, Intertitle, PartBumper } from './ui/Card';
import { ChoiceScreen } from './ui/ChoiceScreen';
import { EndScreen, endTotal } from './ui/EndScreen';
import { ThumbA, ThumbB, ThumbC, ThumbR } from './ThumbsStory';
import STORY from './story.json';
import L from './shots_long.json';
import RL from './shots_reel.json';
import cuesL from './cues_long.json';
import cuesR from './cues_reel.json';
import type { ShotFile } from './Shot';

// ONE family, loaded from the engine's own public/fonts so a render never needs the
// network. Loading it here means every composition - video, sheet and thumbnail - measures
// text identically.
loadBrandFont();

export const FPS = 30;   // v0.4 shipped 10 fps while its own law said 30. It is 30 now.

const long = L as unknown as ShotFile;
const reel = RL as unknown as ShotFile;
const S = STORY as any;

const LongBody = makeStory(long, cuesL as any, false);
const ReelBody = makeStory(reel, cuesR as any, true);
// What actually ships: story + title card + choice screens + end screen on one timeline.
const Long = makeFilm('long', long, cuesL as any);
const Reel = makeFilm('reel', reel, cuesR as any);
const SheetL = makeSheet(long);
const SheetR = makeSheet(reel);

const Title16: React.FC = () => <TitleCard W={1920} H={1080} title={S.title} accent={S.accent} tagline={S.tagline} />;
const Title9: React.FC = () => <TitleCard W={1080} H={1920} title={S.title} accent={S.accent} tagline={S.tagline} />;
const Stakes: React.FC = () => <Intertitle W={1920} H={1080} line1={S.stakes1} line2={S.stakes2} />;
const Bumper: React.FC = () => <PartBumper W={1920} H={1080} label="PART 2" />;

const Choice = (i: number, W: number, H: number): React.FC => () => {
  const p = S.parts[i];
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

const End: React.FC = () => (
  <EndScreen
    W={1920} H={1080}
    title={S.title} accent={S.accent} closer={S.closer} cta={S.cta} teaser={S.teaser}
    recap={S.recap} epilogue={S.epilogue}
    recapClip={(i) => <SheetAt data={long} index={S.recapShot[i]} />}
    epiloguePlate={(i) => <SheetAt data={long} index={S.epilogueShot[i]} />}
    brandPlate={<SheetAt data={long} index={S.brandShot} />}
  />
);

/** Re-renders one already-approved shot as a still plate for the outro. */
const SheetAt: React.FC<{ data: ShotFile; index: number }> = ({ data, index }) => {
  const C = React.useMemo(() => makeSheet({ ...data, shots: [data.shots[index] ?? data.shots[0]] }), [data, index]);
  return <C />;
};

export const Root: React.FC = () => (
  <>
    <Composition id="Long" component={Long} width={1920} height={1080} fps={FPS} durationInFrames={filmFrames('long')} />
    <Composition id="LongBody" component={LongBody} width={1920} height={1080} fps={FPS} durationInFrames={long.frames} />
    <Composition id="Reel" component={Reel} width={1080} height={1920} fps={FPS} durationInFrames={filmFrames('reel')} />
    <Composition id="ReelBody" component={ReelBody} width={1080} height={1920} fps={FPS} durationInFrames={reel.frames} />
    <Composition id="SheetL" component={SheetL} width={1920} height={1080} fps={FPS} durationInFrames={long.shots.length} />
    <Composition id="SheetR" component={SheetR} width={1080} height={1920} fps={FPS} durationInFrames={reel.shots.length} />
    <Composition id="Title16" component={Title16} width={1920} height={1080} fps={FPS} durationInFrames={120} />
    <Composition id="Title9" component={Title9} width={1080} height={1920} fps={FPS} durationInFrames={120} />
    <Composition id="Stakes" component={Stakes} width={1920} height={1080} fps={FPS} durationInFrames={60} />
    <Composition id="Bumper" component={Bumper} width={1920} height={1080} fps={FPS} durationInFrames={30} />
    <Composition id="Choice1" component={Choice(0, 1920, 1080)} width={1920} height={1080} fps={FPS} durationInFrames={96} />
    <Composition id="Choice2" component={Choice(1, 1920, 1080)} width={1920} height={1080} fps={FPS} durationInFrames={96} />
    <Composition id="Choice3" component={Choice(2, 1920, 1080)} width={1920} height={1080} fps={FPS} durationInFrames={96} />
    <Composition id="Choice1R" component={Choice(0, 1080, 1920)} width={1080} height={1920} fps={FPS} durationInFrames={96} />
    <Composition id="End" component={End} width={1920} height={1080} fps={FPS} durationInFrames={endTotal()} />
    <Still id="ThumbA" component={ThumbA} width={1280} height={720} />
    <Still id="ThumbB" component={ThumbB} width={1280} height={720} />
    <Still id="ThumbC" component={ThumbC} width={1280} height={720} />
    <Still id="ThumbR" component={ThumbR} width={1080} height={1920} />
  </>
);
