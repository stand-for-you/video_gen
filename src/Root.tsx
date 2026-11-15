import React from 'react';
import { Composition, Still } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Lora';
import { makeVideo, makeQA } from './Player';
import { SETS as SL } from './SetsL';
import { SETS as SR } from './SetsR';
import { Gal } from './Gal';
import { GalR } from './GalR';
import { ThumbA, ThumbB, ThumbC, ThumbR } from './ThumbsStory';
import L from './shots_long.json';
import RL from './shots_reel.json';
import gal from './gal.json';
import galr from './galr.json';
// Generic root. Story slots (replace per story): SetsL.tsx, SetsR.tsx, Card.tsx, camera.ts, ThumbsStory.tsx, a kit file (like SD.tsx);
// generated: shots_long.json, shots_reel.json (tools/build_shots.py); gal.json, galr.json (set galleries for QA).
loadFont('normal', { weights: ['400', '700'] }); loadFont('italic', { weights: ['700'] });
const Long = makeVideo(L as any, 1920, 1080, SL);
const QAL = makeQA(L as any, 1920, 1080, SL);
const Reel = makeVideo(RL as any, 1080, 1920, SR, true);
const QAR = makeQA(RL as any, 1080, 1920, SR);
export const Root: React.FC = () => (<>
  <Composition id="Long" component={Long} width={1920} height={1080} fps={10} durationInFrames={(L as any).total_frames || (L as any).frames} />
  <Composition id="QAL" component={QAL} width={1920} height={1080} fps={10} durationInFrames={(L as any).shots.length} />
  <Composition id="Reel" component={Reel} width={1080} height={1920} fps={10} durationInFrames={(RL as any).total_frames || (RL as any).frames} />
  <Composition id="QAR" component={QAR} width={1080} height={1920} fps={10} durationInFrames={(RL as any).shots.length} />
  <Composition id="Gal" component={Gal} width={1920} height={1080} fps={10} durationInFrames={Math.max(1, (gal as any[]).length)} />
  <Composition id="GalR" component={GalR} width={1080} height={1920} fps={10} durationInFrames={Math.max(1, (galr as any[]).length)} />
  <Still id="ThumbA" component={ThumbA} width={1280} height={720} />
  <Still id="ThumbB" component={ThumbB} width={1280} height={720} />
  <Still id="ThumbC" component={ThumbC} width={1280} height={720} />
  <Still id="ThumbR" component={ThumbR} width={1080} height={1920} />
</>);
