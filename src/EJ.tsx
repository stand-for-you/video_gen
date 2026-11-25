// EJ.tsx — kit "m" (Eyeless Jack). Reuses the permanent cast (Cast.tsx) and the reusable
// room/prop library from kit j, IH.tsx (Walls, Bed, Nightstand, Door, Frame, Mirror,
// Curtain, Sedan, StreetLamp, HouseExt, Sky, Clouds, PitchPine, Barrens, R, Glow — see
// references/art-library.md). The creature is drawn here from scratch with plain SVG
// shapes (silhouette + mask + claws) rather than depending on another kit's private
// creature rig, so this file has no unknown-schema risk.
import React from 'react';
import { CAST, FullPerson, CloseUp } from './Cast';
import { Hand, INK, RED, rng } from './Kit';
import {
  R, Glow, Walls, Bed, Nightstand, Frame, Mirror, Curtain, Sedan, StreetLamp,
  HouseExt, Sky, Clouds, PitchPine, Barrens,
} from './IH';

// ---- palette (kit m) ----------------------------------------------------
export const M = {
  wallNight: '#0e1020',
  wallDay: '#2a2e3c',
  floor: '#171a28',
  warm: '#e8b870',   // lamp / dashboard / sconce glow
  cold: '#9fb6d8',   // moonlight / fluorescent
  red: '#b4232c',    // the ONE red accent — stitched-scar / dried-blood tint only
  mask: '#3f6f8c',   // Eyeless Jack's dull cerulean-blue mask
  oozeC: '#0a0a0c',  // near-black ooze
  hoodie: '#10131c', // near-black navy hoodie
};

// Mitch, Edwin, the doctor — cast mapping (never re-typed elsewhere)
export const MITCH = { ...CAST.sam };
export const EDWIN = { ...CAST.elias };
export const DOCTOR = { ...CAST.dale };

export function Person({
  who, s = 0.22, x, y, k = 1, f = 0, expr = 'neutral',
}: { who: 'mitch' | 'edwin' | 'doctor'; s?: number; x: number; y: number; k?: number; f?: number; expr?: 'neutral' | 'fear' | 'speak' }) {
  const spec = who === 'mitch' ? MITCH : who === 'edwin' ? EDWIN : DOCTOR;
  return <FullPerson s={spec as any} x={x} y={y} k={s * k} f={f} expr={expr as any} />;
}

export function Face({
  who, x, y, k = 1, f = 0, expr = 'fear', turn = 0, tag, gash = false,
}: { who: 'mitch' | 'edwin' | 'doctor'; x: number; y: number; k?: number; f?: number; expr?: 'neutral' | 'fear' | 'speak'; turn?: number; tag?: string; gash?: boolean }) {
  const spec = who === 'mitch' ? MITCH : who === 'edwin' ? EDWIN : DOCTOR;
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <CloseUp s={spec as any} expr={expr as any} f={f} turn={turn} />
      {gash && (
        <path
          d="M -70 -10 Q -30 20 -50 60"
          stroke={M.red} strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.9}
        />
      )}
      {tag && (
        <text x={0} y={-180} textAnchor="middle" fontFamily="Lora, serif" fontSize={30}
          fill="#f2e9da" opacity={0.85}>{tag}</text>
      )}
    </g>
  );
}

// ---- Eyeless Jack ---------------------------------------------------------
// Declared states only: ooze (0-1 drip heaviness), pose (stand|lean|lunge),
// face (1|-1 mirror), px (position offset). No other variation is permitted —
// see story/creature.md.
export function EyelessJack({
  x, y, k = 1, f = 0, face = 1, pose = 'stand', ooze = 0.3,
}: { x: number; y: number; k?: number; f?: number; face?: 1 | -1; pose?: 'stand' | 'lean' | 'lunge'; ooze?: number }) {
  const sway = Math.sin(f / 26) * 6 * k;
  const lean = pose === 'lean' ? 14 : pose === 'lunge' ? 26 : 0;
  const reach = pose === 'lunge' ? 220 : pose === 'lean' ? 90 : 20;
  const bob = Math.sin(f / 18) * 3 * k;
  return (
    <g transform={`translate(${x} ${y}) scale(${face},1)`}>
      {/* shadow puddle */}
      <ellipse cx={0} cy={420 * k} rx={170 * k} ry={34 * k} fill="#000" opacity={0.35} />
      {/* hoodie body, slightly leaning */}
      <g transform={`rotate(${lean})`}>
        <path
          d={`M ${-120 * k} ${-260 * k + bob}
              C ${-170 * k} ${-140 * k} ${-150 * k} ${180 * k} ${-90 * k} ${400 * k}
              L ${90 * k} ${400 * k}
              C ${150 * k} ${180 * k} ${170 * k} ${-140 * k} ${120 * k} ${-260 * k + bob}
              Q 0 ${-300 * k + bob} ${-120 * k} ${-260 * k + bob} Z`}
          fill={M.hoodie} stroke={INK} strokeWidth={4} opacity={0.98}
        />
        {/* hood edge */}
        <path d={`M ${-130 * k} ${-250 * k + bob} Q 0 ${-210 * k + bob} ${130 * k} ${-250 * k + bob}`}
          stroke="#05060a" strokeWidth={10 * k} fill="none" opacity={0.9} />
        {/* mask (no nose, no mouth) */}
        <ellipse cx={0} cy={-170 * k + bob} rx={92 * k} ry={110 * k} fill={M.mask}
          stroke="#0b1b22" strokeWidth={5} />
        <path d={`M ${-30 * k} ${-230 * k + bob} L ${-10 * k} ${-110 * k + bob}`}
          stroke="#1c3542" strokeWidth={3} opacity={0.6} /> {/* hairline crack */}
        {/* empty black eye sockets */}
        <ellipse cx={-34 * k} cy={-180 * k + bob + sway * 0.1} rx={22 * k} ry={30 * k} fill={M.oozeC} />
        <ellipse cx={34 * k} cy={-180 * k + bob + sway * 0.1} rx={22 * k} ry={30 * k} fill={M.oozeC} />
        {/* ooze drips */}
        {ooze > 0 && (
          <>
            <path d={`M ${-34 * k} ${-150 * k + bob} q ${-4 * k} ${30 * k * ooze} 0 ${60 * k * ooze}`}
              stroke={M.oozeC} strokeWidth={5 * k} fill="none" opacity={0.85} />
            <path d={`M ${34 * k} ${-150 * k + bob} q ${4 * k} ${30 * k * ooze} 0 ${60 * k * ooze}`}
              stroke={M.oozeC} strokeWidth={5 * k} fill="none" opacity={0.85} />
          </>
        )}
        {/* long pale clawed arm, reaching */}
        <path
          d={`M ${90 * k} ${-60 * k + bob} L ${90 * k + reach * k} ${20 * k + bob}`}
          stroke={M.hoodie} strokeWidth={30 * k} strokeLinecap="round"
        />
        <Hand x={90 * k + reach * k} y={20 * k + bob} s={0.55 * k} rot={10} skin="#cfc6ba"
          shade="#9a9184" ext={[1, 1, 1, 1]} thumb={0.8} sleeveLen={0} long />
      </g>
    </g>
  );
}

// Re-export room primitives so SetsL/SetsR import everything from one place.
export {
  R, Glow, Walls, Bed, Nightstand, Frame, Mirror, Curtain, Sedan, StreetLamp,
  HouseExt, Sky, Clouds, PitchPine, Barrens, rng,
};
