import { rng } from './k3/core';
import type { P3 } from './k3/Person';
// =============================================================================
// CHARACTER TEMPLATE (engine v0.6)  --  replaces the permanent-cast law.
//
// OLD LAW (Cast3D.ts): one fixed set of people for the whole channel, reused in
// every video. NEW LAW: the character sheets are a TEMPLATE, not a cast. Every
// story casts NEW people. What carries across videos is the design LANGUAGE, not
// the faces.
//
// The design language, read off the character sheets:
//   1. BUILD VARIETY IS THE POINT. One reference scene holds a lean young lead, a
//      huge round chef, a broad stocky market man, a frail stooped old man and a
//      slim upright woman. Six people of the same width is a failure.
//   2. SILHOUETTE FIRST. Each person must be recognisable as a black shape alone:
//      width, height, hair outline and posture do the work, not face detail.
//   3. POSTURE CARRIES THE ROLE. The boss stands straight, the dogsbody stoops,
//      the old man hunches.
//   4. COSTUME SAYS THE JOB before the face does: apron, whites, work shirt,
//      uniform, good coat.
//   5. ONE RED ACCENT per story, never more. The channel's only saturated colour.
//
// makeCast() hashes the STORY SLUG, so a different story deterministically yields
// different people, and the same story always rebuilds identically (the render is
// resumable across GitHub Actions runners, so this MUST be deterministic).
//
// A story may still override any field after generation - the generator gives a
// cast that is already varied and consistent, not a cast you may not touch.
// =============================================================================

export type RoleHint =
  | 'lead' | 'old' | 'child' | 'big' | 'frail' | 'tall' | 'short'
  | 'woman' | 'man' | 'worker' | 'boss' | 'official' | 'poor' | 'rich';

export type Role = { id: string; name: string; hint?: RoleHint[] };

// --- palettes. Muted, night-ready; saturated colour is reserved for the red accent.
const SKIN = ['#e3c3a2', '#d6a982', '#c99a73', '#bd8a60', '#a9774f', '#8a5f3c', '#6f4a2e', '#dcb28e'];
const HAIR = ['#141210', '#1d1a19', '#2a1d18', '#3a2a1e', '#4e3522', '#6b4426', '#8c4a24'];
const GREY = ['#8d8a84', '#9b9893', '#a8a49c'];
const TOPC = ['#4e7a84', '#6a4a46', '#5c5448', '#44504a', '#2d3a4a', '#6a5f4c', '#62584a', '#4e4a44', '#7a7262', '#3f4a3a'];
const BOTC = ['#4a3728', '#39342e', '#333b46', '#3f3a31', '#232c38', '#4a4336', '#2a2622'];
const SHOE = ['#241c18', '#2a2018', '#1c1814', '#201a15'];

const M_HAIR: P3['hairStyle'][] = ['messy', 'short', 'slick', 'bald', 'cap'];
const F_HAIR: P3['hairStyle'][] = ['long', 'bun', 'wavy', 'short', 'pigtails'];
const JAWS: P3['jaw'][] = ['square', 'soft', 'round', 'long', 'narrow'];
const NOSES: P3['nose'][] = ['broad', 'straight', 'button', 'hook', 'small'];

// build = width multiplier on shoulders/waist/hips (Person.tsx `measures`).
// This is the single most important variety lever: use the whole range.
const BUILDS = [0.82, 0.90, 1.0, 1.12, 1.26, 1.42];
const BUILD_NAME = ['lean', 'slim', 'average', 'stocky', 'heavy', 'huge'];

const hash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return Math.abs(h);
};
const pick = <T,>(q: () => number, a: T[]): T => a[Math.floor(q() * a.length) % a.length];
// pick, but never one of the last `n` picks - this is what forces the spread
const pickFresh = <T,>(q: () => number, a: T[], used: T[], n = 2): T => {
  let v = pick(q, a), g = 0;
  while (used.slice(-n).includes(v) && g++ < 10) v = pick(q, a);
  used.push(v); return v;
};

export const makeCast = (slug: string, roles: Role[]): Record<string, P3> => {
  const q = rng(hash(slug) % 100000);
  const out: Record<string, P3> = {};
  const uBuild: number[] = [], uHair: string[] = [], uTop: string[] = [], uSkin: string[] = [];
  // one red accent per story, given to at most one person
  const redAt = Math.floor(q() * roles.length);

  roles.forEach((role, i) => {
    const h = role.hint || [];
    const fem = h.includes('woman') ? true : h.includes('man') ? false : q() < 0.45;
    const kid = h.includes('child');
    const old = h.includes('old');
    const age: P3['age'] = kid ? 0 : old ? 3 : (Math.floor(q() * 3) as P3['age']);

    // ---- build: forced spread, then steered by the hint
    let build =
      kid ? 0.9
      : h.includes('big') ? pick(q, [1.26, 1.42])
      : h.includes('frail') ? 0.82
      : h.includes('worker') ? pick(q, [1.12, 1.26])
      : h.includes('lead') ? pick(q, [0.90, 1.0])
      : pickFresh(q, BUILDS, uBuild, 2);
    if (!uBuild.includes(build)) uBuild.push(build);

    // ---- height in metres, the second silhouette lever
    const baseH = kid ? 1.12 + q() * 0.22 : fem ? 1.58 + q() * 0.14 : 1.68 + q() * 0.16;
    const H = h.includes('tall') ? baseH + 0.1 : h.includes('short') ? baseH - 0.09 : old ? baseH - 0.05 : baseH;

    // ---- hair
    const pool = fem ? F_HAIR : M_HAIR;
    const hairStyle = old ? 'greyshort' : kid ? (fem ? 'pigtails' : 'messy') : pickFresh(q, pool, uHair as P3['hairStyle'][], 3);

    // ---- clothes: the job before the face
    const top: P3['top'] =
      h.includes('official') ? 'uniform'
      : h.includes('worker') ? 'workshirt'
      : h.includes('rich') || h.includes('boss') ? 'coat'
      : h.includes('poor') ? 'shift'
      : old ? pick(q, ['cardigan', 'coat'] as P3['top'][])
      : kid ? pick(q, ['shirt', 'shift', 'dress'] as P3['top'][])
      : pick(q, ['shirt', 'workshirt', 'cardigan', 'jacket', 'hoodie'] as P3['top'][]);
    const bottom: P3['bottom'] =
      top === 'dress' || top === 'shift' ? 'dressKnee'
      : fem && q() < 0.38 ? (q() < 0.5 ? 'skirtLong' : 'dressKnee')
      : q() < 0.3 ? 'jeans' : 'trousers';

    const acc: P3['acc'] = [
      ...(h.includes('worker') ? (['apron'] as const) : []),
      ...(old ? (['cane'] as const) : []),
      ...(h.includes('official') ? (['badge', 'collar'] as const) : []),
      ...(q() < 0.22 ? (['satchel'] as const) : []),
      ...(q() < 0.18 ? (['hat'] as const) : []),
      // the story's single red accent
      ...(i === redAt ? ([kid ? 'redRibbons' : q() < 0.5 ? 'redScarf' : 'redThread'] as const) : []),
    ] as P3['acc'];

    out[role.id] = {
      id: role.id, name: role.name, sex: fem ? 'f' : 'm', age, kid: kid || undefined,
      h: Number(H.toFixed(2)), build: Number(build.toFixed(2)),
      skin: pickFresh(q, SKIN, uSkin, 2),
      hair: old ? pick(q, GREY) : pick(q, HAIR),
      hairStyle,
      eyeC: pick(q, ['#3a2a1c', '#2e2014', '#43301e', '#4a4038']),
      lip: fem ? pick(q, ['#8a4a48', '#96615d', '#8a5a56']) : undefined,
      brow: 1 + q() * 0.4,
      jaw: pickFresh(q, JAWS, [] as P3['jaw'][], 0),
      nose: pick(q, NOSES),
      stache: !fem && !kid && q() < 0.26,
      beard: !fem && !kid && (old ? q() < 0.55 : q() < 0.18),
      stubble: !fem && !kid && q() < 0.4,
      freckles: kid ? q() < 0.6 : q() < 0.15,
      glasses: q() < 0.2,
      top, topC: pickFresh(q, TOPC, uTop, 3), inner: q() < 0.5 ? '#cfc6b2' : '#d8cdb8',
      bottom, botC: pick(q, BOTC), shoeC: pick(q, SHOE),
      acc, accC: pick(q, ['#b3a88c', '#6b6355', '#7a5a36']),
    };
  });
  return out;
};

// -----------------------------------------------------------------------------
// Variety check. Run this on the generated cast BEFORE drawing anything: it is
// the silhouette rule as a number. Returns the problems, empty = good spread.
// -----------------------------------------------------------------------------
export const castProblems = (cast: Record<string, P3>): string[] => {
  const ppl = Object.values(cast), out: string[] = [];
  if (ppl.length < 2) return out;
  const builds = ppl.map((p) => p.build ?? 1), hs = ppl.map((p) => p.h ?? 1.7);
  const spread = Math.max(...builds) - Math.min(...builds);
  if (spread < 0.3) out.push(`builds too close (${spread.toFixed(2)}): the cast reads as one body shape. Widen with 'big'/'frail' hints.`);
  if (Math.max(...hs) - Math.min(...hs) < 0.14) out.push('heights too close: nobody stands out in a two-shot.');
  const hair = ppl.map((p) => p.hairStyle);
  if (new Set(hair).size < Math.min(3, ppl.length)) out.push(`only ${new Set(hair).size} hair shapes for ${ppl.length} people.`);
  const red = ppl.filter((p) => (p.acc || []).some((a) => a.startsWith('red')));
  if (red.length > 1) out.push(`${red.length} people carry the red accent; the channel allows ONE.`);
  const tops = ppl.map((p) => p.topC);
  if (new Set(tops).size < Math.ceil(ppl.length * 0.7)) out.push('top colours repeat too often.');
  return out;
};

// Human-readable sheet for the story bible, so the written cast and the drawn
// cast can be checked against each other.
export const describeCast = (cast: Record<string, P3>): string =>
  Object.values(cast).map((p) => {
    const b = BUILD_NAME[BUILDS.reduce((best, v, i) => Math.abs(v - (p.build ?? 1)) < Math.abs(BUILDS[best] - (p.build ?? 1)) ? i : best, 0)];
    const bits = [p.beard && 'beard', p.stache && 'moustache', p.glasses && 'glasses', p.freckles && 'freckles'].filter(Boolean);
    return `${p.name} (${p.id}): ${p.sex === 'f' ? 'woman' : 'man'}${p.kid ? ' (child)' : ''}, ${p.h} m, ${b} build, ${p.hairStyle} ${p.hair} hair, ${p.jaw} jaw, ${p.nose} nose${bits.length ? ', ' + bits.join(', ') : ''}; ${p.top} ${p.topC} over ${p.bottom}${(p.acc || []).length ? '; carries ' + (p.acc || []).join(', ') : ''}`;
  }).join('\n');
