import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Stage3, Grade } from './Stage3';
import { MI_SETS, MI_ORDER } from './MI3';
// ===== MONSTER-INTRODUCTION REFERENCE SHEET =====
// One still per card of the block, with worked example annotations. This is the
// living spec: render it (`remotion still MISheet`, or the MIx stills below) and
// look at it before writing a new monster-introduction scene table.
// It is QA only - it is never part of a delivered video.

// The example wording below is DEMO TEXT. In a real story every one of these
// strings comes from story/creature.md through the scene table, never from here.
export const MI_DEMO: Record<string, any> = {
  mi_reveal: {
    name: 'THE LISTENER', mark: 'NIGHT FILE',
    facts: [{ t: 'FIRST SEEN 1931', at: [0.5, 0.08], in: 1.1 }],
  },
  mi_height: {
    tall: '2.6 M TALL', manTall: '1.8 M', mx: 0.18,
    facts: [{ t: 'NEVER STANDS STRAIGHT', at: [0.5, 0.075], tone: 'red', in: 1.8 }],
  },
  mi_anatomy: {
    panel: 'voice', pr: 0.3, py: 0.4,
    meters: [{ t: 'COPY 100%', v: 1 }, { t: 'MEANING 0%', v: 0.02 }],
    facts: [{ t: 'TWO VOICE BOXES', at: [0.5, 0.78], in: 0.9 }],
  },
  mi_ability: {
    say: 'COME OUTSIDE', flowT: 'IT LEANS 4 M',
    facts: [{ t: 'YOUR MOTHER’S VOICE', at: [0.5, 0.08], tone: 'red', in: 2.0 }],
  },
  mi_compare: {
    name: 'THE LISTENER', animal: 'bird', animalName: 'LYREBIRD', as: 1.3,
    facts: [{ t: 'BOTH COPY WHAT THEY HEAR', at: [0.5, 0.8], in: 1.4 }],
  },
  mi_scale: {
    dist: '25 M',
    meters: [{ t: 'IT CAN HEAR YOU', v: 1 }],
    facts: [{ t: 'IT NEVER CROSSES THE FENCE', at: [0.5, 0.08], in: 1.6 }],
  },
  mi_threat: {
    say: 'WHY ARE YOU RUNNING', eye: 2.35,
    facts: [{ t: 'IT ALREADY KNOWS YOUR NAME', at: [0.5, 0.82], tone: 'red', in: 1.5 }],
  },
};

const Card: React.FC<{ i: number; W: number; H: number; vert: boolean; t?: number }> = ({ i, W, H, vert, t = 2.4 }) => {
  const key = MI_ORDER[Math.max(0, Math.min(MI_ORDER.length - 1, i))];
  const S = (MI_SETS as any)[key];
  const v = { ...(MI_DEMO[key] || {}), off: 0, dir: 1 };
  return (
    <AbsoluteFill style={{ background: '#05070b' }}>
      <Stage3 S={S} v={v} t={t} len={4.5} W={W} H={H} vert={vert} />
      <Grade W={W} H={H} />
    </AbsoluteFill>
  );
};

// one frame per card, vertical (the format the block is designed in)
export const MISheet: React.FC = () => {
  const i = useCurrentFrame();
  return <Card i={i} W={1080} H={1920} vert />;
};
export const MISheetL: React.FC = () => {
  const i = useCurrentFrame();
  return <Card i={i} W={1920} H={1080} vert={false} />;
};
export const MI_N = MI_ORDER.length;
