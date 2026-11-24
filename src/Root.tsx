import React from 'react';
import { Composition, Still, staticFile } from 'remotion';
import { makeVideo, makeQA, FPS } from './Player';
import { SETS as SL } from './SetsL';
import { SETS as SR } from './SetsR';
import { Gal, GalR, GAL_N, GALR_N } from './Gal';
import { Lab, LAB_PLATES } from './Lab';
import { ThumbA, ThumbB, ThumbC, ThumbR } from './ThumbsStory';
import L from './shots_long.json';
import RL from './shots_reel.json';
// Generic root (v0.4, native 30 fps from engine.json). Story slots (replace per story): SetsL.tsx, SetsR.tsx, Card.tsx, camera.ts,
// ThumbsStory.tsx, a story kit file (like IKA.tsx), Lab.tsx plates (kit tests); generated: shots_long.json, shots_reel.json (tools/build_shots.py),
// gal.json (set gallery for QA before audio).
// Lora: setup.sh installs the font files into the user's font folder (so Chrome has Lora with no loading at all) and into
// public/fonts. This @font-face only adds the local files as a fallback. No delayRender (a font wait can stall background tabs).
if (typeof document !== 'undefined' && !document.getElementById('sk-lora')) {
  const el = document.createElement('style'); el.id = 'sk-lora';
  el.textContent = `@font-face{font-family:'Lora';src:local('Lora'),url('${staticFile('fonts/Lora.ttf')}') format('truetype');font-weight:400 700;font-style:normal}@font-face{font-family:'Lora';src:local('Lora Italic'),url('${staticFile('fonts/Lora-Italic.ttf')}') format('truetype');font-weight:400 700;font-style:italic}`;
  document.head.appendChild(el);
}
const Long = makeVideo(L as any, 1920, 1080, SL);
const QAL = makeQA(L as any, 1920, 1080, SL);
const Reel = makeVideo(RL as any, 1080, 1920, SR, true);
const QAR = makeQA(RL as any, 1080, 1920, SR);
export const Root: React.FC = () => (<>
  <Composition id="Long" component={Long} width={1920} height={1080} fps={FPS} durationInFrames={(L as any).frames} />
  <Composition id="QAL" component={QAL} width={1920} height={1080} fps={FPS} durationInFrames={(L as any).shots.length} />
  <Composition id="Reel" component={Reel} width={1080} height={1920} fps={FPS} durationInFrames={(RL as any).frames} />
  <Composition id="QAR" component={QAR} width={1080} height={1920} fps={FPS} durationInFrames={(RL as any).shots.length} />
  <Composition id="Gal" component={Gal} width={1920} height={1080} fps={FPS} durationInFrames={Math.max(1, GAL_N)} />
  <Composition id="GalR" component={GalR} width={1080} height={1920} fps={FPS} durationInFrames={Math.max(1, GALR_N)} />
  <Composition id="Lab" component={Lab} width={1920} height={1080} fps={FPS} durationInFrames={LAB_PLATES * 100} />
  <Still id="ThumbA" component={ThumbA} width={1280} height={720} />
  <Still id="ThumbB" component={ThumbB} width={1280} height={720} />
  <Still id="ThumbC" component={ThumbC} width={1280} height={720} />
  <Still id="ThumbR" component={ThumbR} width={1080} height={1920} />
</>);
