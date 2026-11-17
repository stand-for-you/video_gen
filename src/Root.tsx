import React from 'react';
import { Composition, Still, staticFile } from 'remotion';
import { makeVideo, makeQA, FPS } from './Player3';
import { SETS as SL } from './SetsL';
import { SETS as SR } from './SetsR';
import { Gal, GalR, GAL_N, GALR_N } from './Gal';
import { Lab3, LAB3_PLATES } from './Lab3';
import { ThumbA, ThumbB, ThumbC, ThumbR } from './ThumbsStory';
import L from './shots_long.json';
import RL from './shots_reel.json';
import WL from './words_long.json';
import WR from './words_reel.json';
// Generic root (engine v0.5: 3D, native 60 fps from engine.json).
// STORY SLOTS (replace for each story): SetsL.tsx, SetsR.tsx, a story kit (like HS3.tsx), End3 story.json, ThumbsStory.tsx,
// Card.tsx (chapter card look), gal.json, story/*.
// FIXED ENGINE (never rewrite per story): k3/* (core, Cam, World, Nature, Build, Interior, Fx, Person, Creature, Thumbs3),
// Cast3D.ts (the permanent cast), Stage3.tsx, Player3.tsx, Subs3.tsx, Gal.tsx, Lab3.tsx.
// GENERATED: shots_long.json, shots_reel.json (tools/build_shots.py), words_long.json, words_reel.json (tools/words.py).
if (typeof document !== 'undefined' && !document.getElementById('sk-lora')) {
  const el = document.createElement('style'); el.id = 'sk-lora';
  el.textContent = `@font-face{font-family:'Lora';src:local('Lora'),url('${staticFile('fonts/Lora.ttf')}') format('truetype');font-weight:400 700;font-style:normal}@font-face{font-family:'Lora';src:local('Lora Italic'),url('${staticFile('fonts/Lora-Italic.ttf')}') format('truetype');font-weight:400 700;font-style:italic}`;
  document.head.appendChild(el);
}
const Long = makeVideo(L as any, WL as any, 1920, 1080, SL);
const QAL = makeQA(L as any, 1920, 1080, SL);
const Reel = makeVideo(RL as any, WR as any, 1080, 1920, SR, true);
const QAR = makeQA(RL as any, 1080, 1920, SR, true);
export const Root: React.FC = () => (<>
  <Composition id="Long" component={Long} width={1920} height={1080} fps={FPS} durationInFrames={(L as any).frames} />
  <Composition id="QAL" component={QAL} width={1920} height={1080} fps={FPS} durationInFrames={(L as any).shots.length} />
  <Composition id="Reel" component={Reel} width={1080} height={1920} fps={FPS} durationInFrames={(RL as any).frames} />
  <Composition id="QAR" component={QAR} width={1080} height={1920} fps={FPS} durationInFrames={(RL as any).shots.length} />
  <Composition id="Gal" component={Gal} width={1920} height={1080} fps={FPS} durationInFrames={Math.max(1, GAL_N)} />
  <Composition id="GalR" component={GalR} width={1080} height={1920} fps={FPS} durationInFrames={Math.max(1, GALR_N)} />
  <Composition id="Lab" component={Lab3} width={1920} height={1080} fps={FPS} durationInFrames={LAB3_PLATES * 100} />
  <Still id="ThumbA" component={ThumbA} width={1280} height={720} />
  <Still id="ThumbB" component={ThumbB} width={1280} height={720} />
  <Still id="ThumbC" component={ThumbC} width={1280} height={720} />
  <Still id="ThumbR" component={ThumbR} width={1080} height={1920} />
</>);
