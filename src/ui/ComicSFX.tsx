import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { FACE, STROKE, u } from './type';
import { easeOut } from '../three/noise';
import type { SfxPop } from '../Shot';

/**
 * FLOATING COMIC SFX (reference: *THUD*, *CRACK*, *SKRRT*, *WHAM*, *BOOM*, *creak*).
 *
 * Pale cream, bold, slightly italic, heavy black outline, popped ON the thing that made the
 * noise - not parked in a corner. Scale-pop in over 4 frames, hold, fade over 8.
 * Lowercase words (*creak*) come in smaller and quieter: that contrast is doing real work,
 * because every sound being a shout flattens the fear.
 */
export const ComicSFXLayer: React.FC<{ items?: SfxPop[]; W: number; H: number }> = ({ items, W, H }) => {
  const f = useCurrentFrame();
  if (!items || items.length === 0) return null;
  const s = u(W);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {items.map((it, i) => {
        const local = f - it.at;
        if (local < 0 || local > 26) return null;
        const pop = easeOut(local / 4);
        const over = local < 6 ? 1 + 0.16 * (1 - easeOut(local / 6)) : 1;
        const fade = interpolate(local, [16, 26], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        const quiet = it.t === it.t.toLowerCase();
        const size = (it.size ?? 1) * (quiet ? 42 : 76) * s;
        return (
          <div key={i} style={{
            position: 'absolute', left: `${it.x * 100}%`, top: `${it.y * 100}%`,
            transform: `translate(-50%,-50%) scale(${pop * over}) rotate(${(i % 2 ? -1 : 1) * 4}deg)`,
            opacity: fade * (quiet ? 0.82 : 1),
            fontFamily: FACE, fontWeight: 800, fontStyle: 'italic', fontSize: size,
            color: '#f7eccb', textShadow: STROKE(Math.max(2, size * 0.075)), whiteSpace: 'nowrap',
          }}>{it.t}</div>
        );
      })}
    </AbsoluteFill>
  );
};
