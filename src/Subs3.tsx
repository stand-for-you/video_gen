import React from 'react';
import { AbsoluteFill } from 'remotion';
// ===== BOLD WORD-BY-WORD SUBTITLES (engine v0.5) =====
// Drawn inside BOTH videos, centered at the bottom, synced to the narration. The sentence is shown in short groups; the word
// being spoken right now is bright and a little bigger (smoothstep pop), the other words of the group stay dim.
// Word times come from src/words_<name>.json (tools/words.py). They are estimated from the sentence times (UNVERIFIED, about 0.1 s).
export type WUnit = { s: number; e: number; who: string; i: number; words: { w: string; s: number; e: number }[] };
const ss = (x: number) => { const c = Math.max(0, Math.min(1, x)); return c * c * (3 - 2 * c); };
const groups = (u: WUnit, max: number) => {
  const out: { w: string; s: number; e: number }[][] = []; let cur: typeof u.words = []; let n = 0;
  for (const w of u.words) {
    const add = w.w.length + 1;
    if (cur.length && (n + add > max || cur.length >= 7)) { out.push(cur); cur = []; n = 0; }
    cur.push(w); n += add;
    if (/[.?!,;:]"?$/.test(w.w) && n > max * 0.55) { out.push(cur); cur = []; n = 0; }
  }
  if (cur.length) out.push(cur);
  return out;
};
export const Words: React.FC<{ units: WUnit[]; t: number; W: number; H: number; vert?: boolean; hide?: boolean }> = ({ units, t, W, H, vert = false, hide }) => {
  if (hide) return null;
  const u = units.find((x) => t >= x.s - 0.12 && t <= x.e + 0.22);
  if (!u) return null;
  const max = vert ? 20 : 34;
  const gs = groups(u, max);
  const g = gs.find((grp) => t >= grp[0].s - 0.12 && t <= grp[grp.length - 1].e + 0.18) || (t < u.words[0].s ? gs[0] : gs[gs.length - 1]);
  if (!g) return null;
  const fs = vert ? Math.round(H * 0.036) : Math.round(H * 0.044);
  const bottom = vert ? Math.round(H * 0.225) : Math.round(H * 0.075);
  const appear = ss((t - (g[0].s - 0.12)) / 0.18);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: `${fs * 0.3}px`, padding: `0 ${vert ? W * 0.07 : W * 0.1}px`, flexWrap: 'wrap', opacity: appear }}>
        {g.map((w, i) => {
          const on = t >= w.s - 0.04 && t < w.e + 0.04;
          const done = t >= w.e;
          const pop = on ? ss((t - w.s + 0.04) / 0.1) : 0;
          return (
            <span key={i} style={{
              fontFamily: 'Lora, Georgia, serif', fontWeight: 700, fontSize: fs * (1 + 0.085 * pop), lineHeight: 1.18,
              color: on ? '#fff6e6' : done ? '#cfc4ad' : '#a9a294', opacity: on ? 1 : 0.72,
              textShadow: `0 0 ${fs * 0.5}px rgba(0,0,0,0.95), 0 ${fs * 0.06}px ${fs * 0.12}px rgba(0,0,0,0.95), 0 0 ${fs * 0.14}px rgba(0,0,0,1)`,
              WebkitTextStroke: `${Math.max(1, fs * 0.045)}px rgba(6,7,11,0.9)`, paintOrder: 'stroke fill', letterSpacing: 0.5,
              transform: on ? `translateY(${-fs * 0.03 * pop}px)` : 'none',
            }}>{w.w}</span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
