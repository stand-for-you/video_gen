import React, { useMemo } from 'react';
import { rng, INK } from './Kit';
import { Panel, ScaleRow, A, type PanelKind } from './Anatomy';
import { HUD } from './Annot';
// ============================================================================
// MONSTER INTRODUCTION (v0.5)
// The "creature file" segment from the Night Protocol monster short, rebuilt as a
// reusable sequence. It is a 25-40 s block that can open a Reel or sit right after
// the teaser in the long video, and it answers, in order:
//
//   1. WHAT is it      - reveal, name tag
//   2. HOW BIG         - full body on a clean ground, height measurement
//   3. WHAT IS INSIDE  - anatomy cutaway of the one organ the story cares about
//   4. WHAT IT DOES    - the ability, demonstrated, not described
//   5. WHAT IT IS LIKE - one real animal the viewer already knows, for grounding
//   6. HOW CLOSE       - a human at known distance, so the threat gets a number
//   7. WHY YOU LOSE    - the close shot that ends the block
//
// IMPORTANT: this module supplies the FRAMING and the HUD only. The creature
// itself is always drawn from story/creature.md by the story's own kit and is
// passed in as a render function, so quality-law 4a still holds: the monster is
// the story's monster, never a stock monster re-used between videos.
// ============================================================================

export type CreatureFn = (p: { f: number; view: 'front' | 'side' | 'back' | 'head'; s: number }) => React.ReactNode;

// ---------------------------------------------------------------------------
// Faceted shading helper. The reference short reads as low-poly because every
// surface is split into flat planes with a slightly different tone. This wraps
// any shape in 3-5 hard-edged tone plates instead of a smooth gradient.
// ---------------------------------------------------------------------------
export const Facet: React.FC<{
  d: string; base: string; lo?: string; hi?: string; seed?: number; id: string; n?: number;
}> = ({ d, base, lo, hi, seed = 2, id, n = 4 }) => {
  const plates = useMemo(() => {
    const q = rng(seed);
    return Array.from({ length: n }, (_, i) => {
      const a = (q() * 180 - 90) + i * (180 / n);
      const r = 1600 + q() * 900;
      const cx = (q() - 0.5) * 400, cy = (q() - 0.5) * 400;
      const rad = (a * Math.PI) / 180;
      return { a, r, cx, cy, dx: Math.cos(rad) * r, dy: Math.sin(rad) * r, t: q() };
    });
  }, [seed, n]);
  const dark = lo || base, light = hi || base;
  return (
    <g>
      <defs><clipPath id={`fc${id}`}><path d={d} /></clipPath></defs>
      <path d={d} fill={base} />
      <g clipPath={`url(#fc${id})`}>
        {plates.map((p, i) => (
          <path key={i}
            d={`M${p.cx},${p.cy} L${p.cx + p.dx},${p.cy + p.dy} L${p.cx + p.dx - p.dy * 0.7},${p.cy + p.dy + p.dx * 0.7} L${p.cx - p.dy * 0.7},${p.cy + p.dx * 0.7}Z`}
            fill={i % 2 ? dark : light} opacity={0.16 + p.t * 0.2} />
        ))}
      </g>
      <path d={d} fill="none" stroke={INK} strokeWidth={5} strokeLinejoin="round" opacity={0.5} />
    </g>
  );
};

// ---------------------------------------------------------------------------
// Clean study ground: the near-empty stage the creature is measured on, so the
// silhouette is fully readable (quality law 4a: a dark blob is a failure).
// Two light sources: a cold key from above-left and a warm bounce at the floor.
// ---------------------------------------------------------------------------
export const StudyGround: React.FC<{ W: number; H: number; f?: number; tone?: 'night' | 'void' | 'snow' }> =
  ({ W, H, f = 0, tone = 'night' }) => {
    const sky = tone === 'void' ? ['#0a0c10', '#14181f'] : tone === 'snow' ? ['#2a3440', '#9fb0b8'] : ['#0b1218', '#1b2a30'];
    const gy = H * 0.82;
    return (
      <g>
        <defs>
          <linearGradient id="mi_sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={sky[0]} /><stop offset="1" stopColor={sky[1]} />
          </linearGradient>
          <radialGradient id="mi_key" cx="0.3" cy="0.12" r="0.8">
            <stop offset="0" stopColor="#cfe4ea" stopOpacity="0.3" /><stop offset="1" stopColor="#cfe4ea" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect x={-600} y={-600} width={W + 1200} height={H + 1200} fill="url(#mi_sky)" />
        <rect x={-600} y={-600} width={W + 1200} height={H + 1200} fill="url(#mi_key)" />
        {/* far treeline, drifting slowly so the frame is never still */}
        {Array.from({ length: 14 }).map((_, i) => {
          const q = rng(i * 13 + 5); const bx = (i / 14) * (W + 400) - 200 + Math.sin(f / 90 + i) * 6;
          const hh = H * (0.14 + q() * 0.12);
          return <path key={i} d={`M${bx},${gy} L${bx + hh * 0.3},${gy - hh} L${bx + hh * 0.6},${gy}Z`}
            fill="#060d10" opacity={0.75} />;
        })}
        <rect x={-600} y={gy} width={W + 1200} height={H} fill={tone === 'snow' ? '#c8d4d8' : '#0a1014'} />
        <ellipse cx={W / 2} cy={gy + 10} rx={W * 0.42} ry={H * 0.02} fill="#f0a94a" opacity={0.07} />
      </g>
    );
  };

// ---------------------------------------------------------------------------
// The seven cards. Each takes the story's creature render function.
// Every card moves: drifting trees, a breathing creature, a pulsing diagram.
// Annotations are NOT drawn here - the scene table supplies them through v.an so
// the wording always comes from the story text.
// ---------------------------------------------------------------------------
type CardP = { W: number; H: number; f: number; creature: CreatureFn; v?: any };

export const MIReveal: React.FC<CardP> = ({ W, H, f, creature, v = {} }) => (
  <g>
    <StudyGround W={W} H={H} f={f} tone={v.tone || 'night'} />
    {/* partly hidden: the viewer sees a shape before they see a monster */}
    <g transform={`translate(${W * 0.56},${H * 0.82})`} opacity={0.95}>
      {creature({ f, view: 'side', s: v.s ?? 1 })}
    </g>
    <rect x={-600} y={-600} width={W * 0.3} height={H + 1200} fill="#05080a" opacity={0.85} />
    <rect x={-600} y={-600} width={W + 1200} height={H + 1200} fill="#05030a" opacity={v.dark ?? 0.25} />
  </g>
);

export const MIHeight: React.FC<CardP> = ({ W, H, f, creature, v = {} }) => (
  <g>
    <StudyGround W={W} H={H} f={f} tone={v.tone || 'night'} />
    <g transform={`translate(${W * 0.46},${H * 0.82})`}>{creature({ f, view: 'front', s: v.s ?? 1 })}</g>
    {/* a human bar at the right so the height has something to beat */}
    {v.manH !== false && (
      <g transform={`translate(${W * 0.82},${H * 0.82})`}>
        <rect x={-W * 0.035} y={-H * 0.21} width={W * 0.07} height={H * 0.21} rx={W * 0.02} fill="#2b3a44" stroke={INK} strokeWidth={5} />
        <circle cy={-H * 0.235} r={W * 0.028} fill="#3b4c56" stroke={INK} strokeWidth={5} />
      </g>
    )}
    <rect x={-600} y={-600} width={W + 1200} height={H + 1200} fill="#05030a" opacity={v.dark ?? 0.18} />
  </g>
);

export const MIAnatomy: React.FC<CardP> = ({ W, H, f, creature, v = {} }) => (
  <g>
    <StudyGround W={W} H={H} f={f} tone={v.tone || 'void'} />
    <g transform={`translate(${W * 0.5},${H * 0.86}) scale(${v.cs ?? 0.72})`} opacity={0.45}>
      {creature({ f, view: v.cv || 'front', s: v.s ?? 1 })}
    </g>
    <Panel kind={(v.panel as PanelKind) || 'voice'} x={W * 0.5} y={H * (v.py ?? 0.42)}
      r={Math.min(W, H) * (v.pr ?? 0.3)} seed={v.seed ?? 7} f={f} />
    <rect x={-600} y={-600} width={W + 1200} height={H + 1200} fill="#05030a" opacity={v.dark ?? 0.15} />
  </g>
);

export const MIAbility: React.FC<CardP> = ({ W, H, f, creature, v = {} }) => {
  // the creature performs: it leans, reaches or bends across the frame
  const sw = Math.sin(f / 26), lean = (v.lean ?? 16) * sw;
  return (
    <g>
      <StudyGround W={W} H={H} f={f} tone={v.tone || 'night'} />
      {v.house !== false && (
        <g transform={`translate(${W * 0.16},${H * 0.82})`}>
          <rect x={-W * 0.16} y={-H * 0.2} width={W * 0.32} height={H * 0.2} fill="#2a2016" stroke={INK} strokeWidth={6} />
          <rect x={-W * 0.055} y={-H * 0.16} width={W * 0.11} height={H * 0.1} fill="#f0a94a"
            opacity={0.78 + 0.14 * Math.sin(f / 19)} stroke={INK} strokeWidth={5} />
          <path d={`M${-W * 0.19},${-H * 0.2} L0,${-H * 0.31} L${W * 0.19},${-H * 0.2}Z`} fill="#1d150e" stroke={INK} strokeWidth={6} />
        </g>
      )}
      <g transform={`translate(${W * 0.66},${H * 0.82}) rotate(${lean} 0 ${-H * 0.3})`}>
        {creature({ f, view: 'side', s: v.s ?? 1 })}
      </g>
      <rect x={-600} y={-600} width={W + 1200} height={H + 1200} fill="#05030a" opacity={v.dark ?? 0.2} />
    </g>
  );
};

export const MICompare: React.FC<CardP & { animal?: React.ReactNode }> = ({ W, H, f, creature, animal, v = {} }) => (
  <g>
    <StudyGround W={W} H={H} f={f} tone={v.tone || 'void'} />
    <ScaleRow W={W} baseY={H * 0.78} f={f}
      left={<g transform={`scale(${v.ls ?? 0.5})`}>{creature({ f, view: 'front', s: 1 })}</g>}
      right={<g transform={`scale(${v.rs ?? 1})`}>{animal}</g>} />
    <rect x={-600} y={-600} width={W + 1200} height={H + 1200} fill="#05030a" opacity={v.dark ?? 0.15} />
  </g>
);

export const MIScale: React.FC<CardP> = ({ W, H, f, creature, v = {} }) => (
  <g>
    <StudyGround W={W} H={H} f={f} tone={v.tone || 'night'} />
    {/* a fence line gives the distance something to be measured against */}
    {Array.from({ length: 9 }).map((_, i) => (
      <rect key={i} x={W * 0.04 + i * (W * 0.115)} y={H * 0.68} width={W * 0.012} height={H * 0.14} fill="#1b140d" stroke={INK} strokeWidth={3} />
    ))}
    <rect x={-600} y={H * 0.70} width={W + 1200} height={H * 0.012} fill="#1b140d" />
    <g transform={`translate(${W * 0.2},${H * 0.82}) scale(${v.ms ?? 0.26})`}>
      <rect x={-130} y={-760} width={260} height={760} rx={60} fill="#2b3a44" stroke={INK} strokeWidth={14} />
      <circle cy={-840} r={110} fill="#c99a72" stroke={INK} strokeWidth={14} />
    </g>
    <g transform={`translate(${W * 0.76},${H * 0.82})`} opacity={0.92}>
      {creature({ f, view: 'front', s: v.s ?? 0.8 })}
    </g>
    <rect x={-600} y={-600} width={W + 1200} height={H + 1200} fill="#05030a" opacity={v.dark ?? 0.28} />
  </g>
);

export const MIThreat: React.FC<CardP> = ({ W, H, f, creature, v = {} }) => (
  <g>
    <StudyGround W={W} H={H} f={f} tone={v.tone || 'void'} />
    <g transform={`translate(${W * 0.5},${H * (v.hy ?? 0.58)}) scale(${v.hs ?? 2.1})`}>
      {creature({ f, view: 'head', s: 1 })}
    </g>
    <rect x={-600} y={-600} width={W + 1200} height={H + 1200} fill="#05030a" opacity={v.dark ?? 0.22} />
  </g>
);

// ---------------------------------------------------------------------------
// Register these in SETS so the scene table can name them like any other set:
//   Object.assign(SETS, monsterIntroSets(W, H, myCreature))
// ---------------------------------------------------------------------------
export const monsterIntroSets = (
  W: number, H: number, creature: CreatureFn, animal?: React.ReactNode,
): Record<string, React.FC<{ f: number; v: any }>> => ({
  mi_reveal:  ({ f, v }) => <MIReveal  W={W} H={H} f={f} v={v} creature={creature} />,
  mi_height:  ({ f, v }) => <MIHeight  W={W} H={H} f={f} v={v} creature={creature} />,
  mi_anatomy: ({ f, v }) => <MIAnatomy W={W} H={H} f={f} v={v} creature={creature} />,
  mi_ability: ({ f, v }) => <MIAbility W={W} H={H} f={f} v={v} creature={creature} />,
  mi_compare: ({ f, v }) => <MICompare W={W} H={H} f={f} v={v} creature={creature} animal={animal} />,
  mi_scale:   ({ f, v }) => <MIScale   W={W} H={H} f={f} v={v} creature={creature} />,
  mi_threat:  ({ f, v }) => <MIThreat  W={W} H={H} f={f} v={v} creature={creature} />,
});

// The recommended beat order. Keep every card under 5 s and never repeat a card
// without changing the camera and the annotation.
export const MONSTER_INTRO_ORDER = [
  'mi_reveal', 'mi_height', 'mi_anatomy', 'mi_ability', 'mi_compare', 'mi_scale', 'mi_threat',
] as const;
