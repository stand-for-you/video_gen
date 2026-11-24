import React from 'react';
import { Form, Crease, Patch, Speck, PaintDefs, Painted, LightSet, LIGHT_GHOST, sym, sp, mix, dark, lite, useLight, shadeOf, lineOf, CelShadow, RimLight, HairStroke, P } from './Paint';
import { HairBack, HairFront } from './Hair';
import { CAST, GHOSTS } from './Specs';
import { CloseUp } from './Cast';
// ===== SCROLL KAOS FACES v3 (reference style: crisp cel shadows, big eye whites, small dark irises,
// thick black upper lid, angular nose with a hard light/shadow split, warm red zone on nose, cheeks and ears).
// Origin (0,0) = centre of the face. Skull top about -240, chin about +220, half-width about 146.

export type Spec = {
  id: string; name: string; sex: 'm' | 'f'; age: 0 | 1 | 2 | 3; kid?: boolean;
  skin: string; hair: string; grey?: boolean; eyeC?: string; lip?: string; fw?: number;
  jaw?: 'square' | 'soft' | 'round' | 'long' | 'narrow'; nose?: 'straight' | 'small' | 'broad' | 'button' | 'hook';
  hairStyle: 'wavy' | 'messy' | 'long' | 'bun' | 'greyshort' | 'pigtails' | 'cap' | 'bald' | 'slick' | 'ghostlong' | 'wetbowl';
  stubble?: boolean; stache?: boolean; beard?: boolean; glasses?: boolean; freckles?: boolean; brow?: number; mole?: boolean;
  ghost?: 'woman' | 'grin' | 'child';
  top: 'shirt' | 'tshirt' | 'jacket' | 'cardigan' | 'hoodie' | 'uniform' | 'workshirt' | 'raincoat' | 'shift';
  topC: string; inner?: string; sw?: number; hw?: number; rolled?: boolean; tucked?: boolean;
  bottom: 'trousers' | 'jeans' | 'skirtLong' | 'dressKnee' | 'none'; botC: string; shoeC?: string; barefoot?: boolean;
  legK?: number; hs?: number; gs?: number; armL?: number; fingers?: number;
  acc?: ('cane' | 'backpack' | 'satchel' | 'handbag' | 'redScarf' | 'shawl' | 'redRibbons' | 'redLaces' | 'badge' | 'redCord' | 'clipboard' | 'redTie' | 'puddle')[]; accC?: string;
};

export type Expr = 'neutral' | 'fear' | 'speak' | 'worry' | 'smile' | 'sad' | 'stern' | 'sleepy' | 'shock' | 'cruel';
type EX = { bIn: number; bOut: number; o: number; ir: number; m: 'line' | 'open' | 'gasp' | 'O' | 'smile' | 'down' | 'tight' | 'smirk' };
const EXP: Record<Expr, EX> = {
  neutral: { bIn: 0, bOut: 0, o: 1, ir: 1, m: 'line' },
  speak: { bIn: -4, bOut: -2, o: 1, ir: 1, m: 'open' },
  fear: { bIn: -22, bOut: -2, o: 1.35, ir: 0.8, m: 'gasp' },
  shock: { bIn: -26, bOut: -20, o: 1.5, ir: 0.72, m: 'O' },
  worry: { bIn: -18, bOut: 6, o: 1.05, ir: 0.95, m: 'down' },
  sad: { bIn: -16, bOut: 10, o: 0.72, ir: 1, m: 'down' },
  smile: { bIn: -2, bOut: -4, o: 0.78, ir: 1, m: 'smile' },
  stern: { bIn: 14, bOut: -4, o: 0.8, ir: 1, m: 'tight' },
  sleepy: { bIn: 0, bOut: 6, o: 0.42, ir: 1, m: 'line' },
  cruel: { bIn: 16, bOut: -8, o: 0.78, ir: 0.85, m: 'smirk' },
};

const JAW: Record<string, P[]> = {
  square: [[0, -240], [84, -232], [132, -196], [146, -130], [148, -60], [145, 0], [139, 52], [128, 108], [110, 160, 0.5], [78, 198], [40, 218], [0, 224]],
  soft: [[0, -234], [80, -226], [126, -190], [140, -120], [140, -50], [136, 10], [127, 70], [110, 128], [84, 174], [44, 204], [0, 212]],
  narrow: [[0, -234], [76, -226], [120, -190], [134, -122], [134, -52], [130, 10], [121, 72], [104, 130], [78, 176], [40, 204], [0, 212]],
  round: [[0, -236], [96, -226], [148, -172], [162, -92], [162, -12], [154, 62], [130, 132], [90, 180], [44, 202], [0, 206]],
  long: [[0, -240], [80, -232], [128, -196], [142, -124], [142, -52], [139, 20], [132, 92], [116, 160, 0.5], [84, 208], [44, 234], [0, 240]],
};
// x of the face outline (right half) at height y
const outX = (half: P[], y: number) => { for (let i = 0; i < half.length - 1; i++) { const a = half[i], b = half[i + 1]; if (y >= a[1] && y <= b[1]) { const t = (y - a[1]) / (b[1] - a[1] || 1); return a[0] + (b[0] - a[0]) * t; } } return 0; };
// designed cel shadow (light from the left): cuts in at the eye socket, bulges at the cheekbone, follows the jaw
const faceShadow = (half: P[], ey: number, chin: number) => {
  const top = half[0][1];
  const prof: [number, number][] = [[top + 8, 0.52], [-150, 0.58], [ey - 44, 0.52], [ey - 18, 0.3], [ey + 10, 0.38], [ey + 36, 0.64], [ey + 66, 0.72], [ey + 102, 0.56], [ey + 140, 0.6], [chin - 70, 0.62], [chin - 26, 0.5], [chin - 4, 0.28]];
  const outer: P[] = half.filter((p) => p[1] > top + 2).map((p) => [p[0] + 6, p[1]] as P);
  const inner: P[] = prof.slice().reverse().map(([y, f]) => [Math.max(6, outX(half, y) * f), y, 0.7] as P);
  return sp([[outX(half, top + 8) * 0.52, top + 2], ...outer, [0, chin + 6], ...inner]);
};

export const Head: React.FC<{ s: Spec; expr?: Expr; f?: number; turn?: number; uid?: string; noHair?: boolean; noBack?: boolean }> = ({ s, expr = 'neutral', f = 0, turn = 0, uid, noHair, noBack }) => {
  const L = useLight();
  const id = uid || s.id + '-' + expr;
  const E = EXP[expr] || EXP.neutral;
  const kid = !!s.kid, fem = s.sex === 'f', ghost = s.ghost, age = s.age;
  const fw = (s.fw || 1) * (kid ? 1 : 0.93);
  const jaw = s.jaw || (kid ? 'round' : fem ? 'soft' : 'square');
  const half = JAW[jaw];
  const chin = half[half.length - 1][1];
  const T = Math.abs(turn);
  const faceD = turn ? sp([...half, ...half.slice(1, -1).reverse().map((p) => [-p[0], p[1], p[2] ?? 1] as P)].map((p) => [p[0] * (p[0] * turn > 0 ? 1 - T * 0.22 : 1 + T * 0.06), p[1], p[2] ?? 1] as P)) : sym(half);
  const skin = s.skin, skD = shadeOf(skin, L, 1.05), skDD = shadeOf(skin, L, 1.5), ln = lineOf(skin, L);
  const red = ghost ? '#5a7290' : mix(skin, '#c8362e', 0.62);
  const browC = s.grey ? '#9c998f' : dark(s.hair, 0.1);
  const INKC = '#140a0c';
  const blink = !ghost && f % 96 < 4;
  // layout
  // v0.5 cinematic eye: wider almond shape, larger iris, more expressive (reference style)
  const ey = kid ? 10 : fem ? -16 : -18, ex = kid ? 62 : fem ? 57 : 58;
  const eW = kid ? 46 : fem ? 44 : 42, eH = (kid ? 32 : fem ? 27 : 20) * E.o;
  const irR = (kid ? 20 : fem ? 18 : 15) * E.ir;
  const by = ey - (kid ? 52 : fem ? 50 : 36);
  const noseY = kid ? 74 : fem ? 62 : 68, my = kid ? 126 : fem ? 118 : 124;
  const tx = turn * 52, nt = tx * 1.55, mx = tx * 1.2;
  const gx = Math.sin(f / 40) * 2.5 + turn * 6;

  // ---------- eyes
  const eye = (q: 1 | -1) => {
    const far = turn !== 0 && q === Math.sign(turn), near = turn !== 0 && !far;
    const cx = q * ex * (far ? 1 - T * 0.3 : near ? 1 + T * 0.04 : 1) + tx, cy = ey;
    const w = eW * (far ? 1 - T * 0.28 : 1);
    const inner: P = [cx - q * w, cy + 5, 0.2], outer: P = [cx + q * w, cy - 1, 0.25];
    const top: P[] = [inner, [cx - q * w * 0.55, cy - eH * 0.82], [cx + q * w * 0.08, cy - eH * 1.02], [cx + q * w * 0.66, cy - eH * 0.72], outer];
    const bot: P[] = [[cx + q * w * 0.55, cy + eH * 0.55], [cx - q * w * 0.05, cy + eH * 0.68], [cx - q * w * 0.62, cy + eH * 0.5]];
    const white = sp([...top, ...bot]);
    const topLine = sp(top, false);
    const eid = `${id}-eye${q}`;
    if (ghost) {
      const R = ghost === 'child' ? 1.35 : 1.15;
      const hd = sp([[cx - q * w * R, cy + 2], [cx - q * w * 0.45, cy - 22 * R], [cx + q * w * 0.5 * R, cy - 26 * R], [cx + q * w * R, cy - 2], [cx + q * w * 0.4, cy + 20 * R], [cx - q * w * 0.5, cy + 22 * R]]);
      return (
        <g key={q}>
          <Patch d={hd} c="#090c16" o={0.85} b={12} />
          <path d={hd} fill="#04050a" transform={`translate(${cx},${cy}) scale(0.84) translate(${-cx},${-cy})`} />
          <circle cx={cx + gx * 1.5} cy={cy - 2} r={ghost === 'child' ? 6.5 : 5} fill="#f2f6f8" />
          <circle cx={cx + gx * 1.5} cy={cy - 2} r={ghost === 'child' ? 16 : 12} fill="#9fc8e8" opacity={0.14} />
          <Crease d={sp([[cx - q * 6, cy + 24], [cx - q * 2, cy + 64], [cx - q * 9, cy + 122], [cx - q * 4, cy + 178]], false)} c="#141a28" w={12} o={0.85} b={3} />
          <Crease d={sp([[cx + q * 20, cy + 22], [cx + q * 24, cy + 54], [cx + q * 16, cy + 102]], false)} c="#141a28" w={6} o={0.6} b={3} />
        </g>
      );
    }
    return (
      <g key={q}>
        {/* socket: crisp cel shadow under the brow, darkest at the inner corner */}
        <Patch d={`M${cx - q * w * 1.3},${cy - 2} C${cx - q * w * 1.1},${cy - eH - 30} ${cx + q * w * 0.9},${cy - eH - 34} ${cx + q * w * 1.3},${cy - eH - 6} C${cx + q * w * 0.6},${cy - eH - 14} ${cx - q * w * 0.4},${cy - eH - 12} ${cx - q * w * 1.3},${cy - 2}Z`} c={skD} o={0.75} b={3} />
        <Patch d={`M${cx - q * w * 1.3},${cy - 6} C${cx - q * w * 1.25},${cy - 30} ${cx - q * w * 0.85},${cy - 30} ${cx - q * w * 0.75},${cy - 4}Z`} c={skDD} o={0.55} b={6} />
        {age >= 1 && !kid && <Crease d={sp([[cx - q * w * 0.6, cy + eH * 0.7 + 14], [cx + q * w * 0.1, cy + eH + 22], [cx + q * w * 0.8, cy + eH * 0.5 + 12]], false)} c={skD} w={5} o={0.35 + age * 0.12} b={3} />}
        {blink ? (
          <g>
            <path d={sp([...top, [cx + q * w * 0.4, cy + eH * 0.45], [cx - q * w * 0.4, cy + eH * 0.5]])} fill={mix(skin, L.keyC, 0.12)} />
            <path d={sp([inner, [cx - q * w * 0.4, cy + eH * 0.48], [cx + q * w * 0.4, cy + eH * 0.42], outer], false)} stroke={INKC} strokeWidth={7} fill="none" strokeLinecap="round" />
          </g>
        ) : (
          <g>
            <clipPath id={eid}><path d={white} /></clipPath>
            <path d={white} fill={mix('#f2ede4', skin, 0.1)} />
            <g clipPath={`url(#${eid})`}>
              <path d={`M${cx - 70},${cy - eH - 20} H${cx + 70} V${cy - eH * 0.25} C${cx + 30},${cy - eH * 0.02} ${cx - 30},${cy - eH * 0.02} ${cx - 70},${cy - eH * 0.25}Z`} fill={mix('#c8bcb0', skin, 0.3)} opacity={0.75} />
              <circle cx={cx + gx} cy={cy - eH * 0.1} r={irR} fill={dark(s.eyeC || '#3a2414', 0.4)} />
              <circle cx={cx + gx} cy={cy - eH * 0.1 + irR * 0.25} r={irR * 0.7} fill={s.eyeC || '#3a2414'} opacity={0.55} />
              <circle cx={cx + gx} cy={cy - eH * 0.1} r={irR * 0.52} fill="#06040a" />
              <path d={`M${cx - 70},${cy - eH - 20} H${cx + 70} V${cy - eH * 0.45} C${cx + 30},${cy - eH * 0.25} ${cx - 30},${cy - eH * 0.25} ${cx - 70},${cy - eH * 0.45}Z`} fill={INKC} opacity={0.35} />
              <circle cx={cx + gx - irR * 0.32} cy={cy - eH * 0.1 - irR * 0.36} r={kid ? 5 : 3.8} fill="#fffaf2" />
              <circle cx={cx + gx + irR * 0.4} cy={cy - eH * 0.1 + irR * 0.36} r={1.8} fill="#fffaf2" opacity={0.7} />
            </g>
            <ellipse cx={cx - q * (w - 5)} cy={cy + 4} rx={5} ry={4} fill={mix(skin, '#c05a5a', 0.45)} />
            {/* thick black upper lid with a flick at the outer corner */}
            <path d={topLine} stroke={INKC} strokeWidth={fem || kid ? 10.5 : 9.5} fill="none" strokeLinecap="round" />
            {fem || kid
              ? <path d={`M${outer[0] - q * 4},${outer[1] - 2} q${q * 12},-2 ${q * 18},-12`} stroke={INKC} strokeWidth={6} fill="none" strokeLinecap="round" />
              : <path d={`M${outer[0] - q * 6},${outer[1] - 2} q${q * 10},2 ${q * 14},10`} stroke={INKC} strokeWidth={5} fill="none" strokeLinecap="round" />}
            {/* lid crease, lower lid */}
            <path d={sp([[cx - q * w * 0.8, cy - eH - 5], [cx - q * w * 0.05, cy - eH - 15 - (fem ? 4 : 0)], [cx + q * w * 0.75, cy - eH - 10], [cx + q * w * 1.05, cy - 3]], false)} stroke={dark(ln, 0.25)} strokeWidth={3.5} fill="none" opacity={0.8} />
            <path d={sp([[outer[0], outer[1] + 2], [cx + q * w * 0.5, cy + eH * 0.6], [cx - q * w * 0.15, cy + eH * 0.7]], false)} stroke={dark(ln, 0.2)} strokeWidth={2.8} fill="none" opacity={0.55} />
          </g>
        )}
        {age >= 2 && <path d={`M${cx + q * w * 1.2},${cy - 4} l${q * 18},-9 M${cx + q * w * 1.2},${cy + 4} l${q * 20},3 M${cx + q * w * 1.15},${cy + 12} l${q * 15},12`} stroke={ln} strokeWidth={2.5} opacity={0.25 + age * 0.08} />}
        {s.glasses && <g><ellipse cx={cx} cy={cy - 2} rx={w + 18} ry={w * 0.85} fill="#dfeaf0" opacity={0.12} stroke="#2c1e18" strokeWidth={5} /><path d={`M${cx - q * (w + 4)},${cy - w * 0.45} q${q * 12},-12 ${q * 28},-14`} stroke="#fff" strokeWidth={4} opacity={0.55} fill="none" /></g>}
      </g>
    );
  };

  // ---------- brows: solid block shapes
  const brow = (q: 1 | -1) => {
    if (ghost) return null;
    const far = turn !== 0 && q === Math.sign(turn);
    const bx = tx - (far ? q * ex * T * 0.3 : 0);
    const thick = (s.brow || (fem ? 0.62 : kid ? 0.68 : 1)) * 20;
    const yi = by + E.bIn, yo = by + 6 + E.bOut;
    const p0: [number, number] = [bx + q * 14, yi + 6], p1: [number, number] = [bx + q * 62, (yi + yo) / 2 - 8 - (fem ? 6 : 0)], p2: [number, number] = [bx + q * 114, yo + 4];
    const d = sp([[p0[0], p0[1] - thick * 0.55, 0.3], [p1[0], p1[1] - thick * 0.5], [p2[0], p2[1] - 2, 0.1], [p1[0] + q * 8, p1[1] + thick * 0.42], [p0[0], p0[1] + thick * 0.5, 0.3]]);
    return (
      <g key={'b' + q}>
        <path d={d} fill={browC} />
        {[0, 1, 2, 3].map((k) => <path key={k} d={`M${p0[0] + q * (6 + k * 18)},${p0[1] + 2 - k * 3} q${q * 10},-8 ${q * 26},-10`} stroke={lite(browC, 0.35)} strokeWidth={2.2} fill="none" opacity={0.4} />)}
      </g>
    );
  };

  // ---------- nose: hard light/shadow split
  const noseKind = s.nose || (kid ? 'button' : fem ? 'small' : 'straight');
  const nw = noseKind === 'broad' ? 32 : noseKind === 'small' ? 22 : noseKind === 'button' ? 21 : 26;
  const hook = noseKind === 'hook' ? 10 : 0;
  const nose = (
    <g>
      {noseKind !== 'button' && <Patch d={sp([[nt + 4, ey - 30, 0.4], [nt + 12 + hook * 0.4, ey + 14], [nt + nw - 2 + hook, noseY - 30], [nt + nw + 8, noseY - 4, 0.4], [nt + nw - 2, noseY + 8, 0.4], [nt + 8, noseY - 8], [nt + 2, ey + 20]])} c={skD} o={0.95} b={3} />}
      <Patch d={sp([[nt - nw - 4, noseY - 2, 0.4], [nt - nw * 0.5, noseY + 13], [nt, noseY + 11], [nt + nw * 0.5, noseY + 13], [nt + nw + 6, noseY - 2, 0.4], [nt + nw * 0.4, noseY + 4], [nt - nw * 0.4, noseY + 4]])} c={skDD} o={0.9} b={3} />
      <ellipse cx={nt - nw * 0.45} cy={noseY + 7} rx={nw * 0.26} ry={4.5} fill={INKC} opacity={0.55} />
      <ellipse cx={nt + nw * 0.45} cy={noseY + 7} rx={nw * 0.26} ry={4.5} fill={INKC} opacity={0.7} />
      <path d={`M${nt + nw - 6},${noseY - 22} C${nt + nw + 10},${noseY - 14} ${nt + nw + 10},${noseY + 4} ${nt + nw - 4},${noseY + 9}`} stroke={dark(ln, 0.2)} strokeWidth={3.5} fill="none" opacity={0.75} />
      <Patch d={`M${nt + 10},${noseY + 12} C${nt + 40},${noseY + 6} ${nt + 62},${noseY + 22} ${nt + 54},${noseY + 42} C${nt + 30},${noseY + 44} ${nt + 10},${noseY + 32} ${nt + 10},${noseY + 12}Z`} c={skD} o={0.6} b={3} />
      <Patch d={`M${nt - 18},${noseY - 10} a18,14 0 1,0 36,0 a18,14 0 1,0 -36,0Z`} c={red} o={0.45} b={6} />
      {noseKind !== 'button' && <path d={`M${nt - 6},${ey - 14} C${nt - 6},${ey + 24} ${nt - 8},${noseY - 42} ${nt - 6},${noseY - 24}`} stroke={L.keyC} strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.3} />}
      <ellipse cx={nt - 6} cy={noseY - 12} rx={9} ry={6} fill={L.keyC} opacity={0.65} />
    </g>
  );

  // ---------- mouth
  const lipC = s.lip || (ghost ? '#7a8a96' : fem ? mix(skin, '#9a3a42', 0.5) : mix(skin, '#8a4038', 0.4));
  const mw = fem ? 38 : kid ? 32 : 44;
  let mouth: React.ReactNode;
  if (ghost === 'grin' || ghost === 'child') {
    const W = ghost === 'grin' ? 116 : 84, H = ghost === 'grin' ? 74 : 58, n = ghost === 'grin' ? 12 : 9;
    const md = sp([[mx - W, my - 8, 0.2], [mx, my + 10], [mx + W, my - 8, 0.2], [mx + W * 0.6, my + H * 0.8], [mx, my + H], [mx - W * 0.6, my + H * 0.8]]);
    mouth = (
      <g>
        <Patch d={md} c="#0c0a12" o={0.6} b={12} />
        <clipPath id={`${id}-mc`}><path d={md} /></clipPath>
        <path d={md} fill="#130a10" />
        <g clipPath={`url(#${id}-mc)`}>
          {Array.from({ length: n }).map((_, i) => { const x = mx - W + ((i + 0.5) * 2 * W) / n; const yy = my + 10 * (1 - ((x - mx) / W) ** 2) - 12; return <rect key={'u' + i} x={x - W / n + 2} y={yy - 4} width={(2 * W) / n - 4} height={H * 0.42} rx={5} fill="#e2ddcb" stroke="#3a3238" strokeWidth={2.5} />; })}
          {Array.from({ length: n - 2 }).map((_, i) => { const x = mx - W * 0.8 + ((i + 0.5) * 1.6 * W) / (n - 2); const yy = my + H * (1 - 0.4 * ((x - mx) / W) ** 2); return <rect key={'l' + i} x={x - (0.8 * W) / (n - 2) + 2} y={yy - H * 0.36} width={(1.6 * W) / (n - 2) - 4} height={H * 0.36} rx={5} fill="#d4cebb" stroke="#3a3238" strokeWidth={2.5} />; })}
          <path d={`M${mx + W * 0.15},${my - 30} H${mx + W} V${my + H} H${mx + W * 0.15}Z`} fill="#0a1020" opacity={0.35} />
        </g>
        <path d={md} fill="none" stroke="#1a1418" strokeWidth={4} />
        <path d={`M${mx - W},${my - 8} q${-14},-10 ${-16},-30 M${mx + W},${my - 8} q14,-10 16,-30`} stroke={ln} strokeWidth={4} fill="none" opacity={0.6} />
      </g>
    );
  } else if (ghost === 'woman') {
    mouth = (<g><Patch d={`M${mx - 30},${my} a30,40 0 1,0 60,0 a30,40 0 1,0 -60,0Z`} c="#0a0c14" o={0.5} b={12} /><ellipse cx={mx} cy={my + 6} rx={21} ry={34} fill="#07080e" /><path d={`M${mx - 30},${my - 22} C${mx - 10},${my - 32} ${mx + 10},${my - 32} ${mx + 30},${my - 22}`} stroke={ln} strokeWidth={4} fill="none" opacity={0.55} /></g>);
  } else if (E.m === 'open' || E.m === 'gasp' || E.m === 'O') {
    const W = E.m === 'O' ? mw * 0.55 : E.m === 'gasp' ? mw * 0.95 : mw * 0.85, H = E.m === 'O' ? 46 : E.m === 'gasp' ? 42 : 28;
    const md = sp([[mx - W, my, 0.3], [mx - W * 0.4, my - 8], [mx + W * 0.4, my - 8], [mx + W, my, 0.3], [mx + W * 0.5, my + H], [mx - W * 0.5, my + H]]);
    mouth = (
      <g>
        <clipPath id={`${id}-mc`}><path d={md} /></clipPath>
        <path d={md} fill="#2a0e12" />
        <g clipPath={`url(#${id}-mc)`}>
          {E.m !== 'O' && <path d={`M${mx - W},${my - 10} H${mx + W} V${my + 8} C${mx + W * 0.5},${my + 4} ${mx - W * 0.5},${my + 4} ${mx - W},${my + 8}Z`} fill="#eee6d6" />}
          {E.m === 'gasp' && <path d={`M${mx - W},${my + H + 4} H${mx + W} V${my + H - 8} C${mx + W * 0.4},${my + H - 12} ${mx - W * 0.4},${my + H - 12} ${mx - W},${my + H - 8}Z`} fill="#d8d0c0" />}
          <ellipse cx={mx} cy={my + H} rx={W * 0.6} ry={12} fill="#9a4048" opacity={0.75} />
        </g>
        <path d={sp([[mx - W - 4, my, 0.3], [mx - W * 0.4, my - 12], [mx, my - 8], [mx + W * 0.4, my - 12], [mx + W + 4, my, 0.3], [mx + W * 0.4, my - 4], [mx - W * 0.4, my - 4]])} fill={dark(lipC, 0.15)} />
        <path d={sp([[mx - W * 0.8, my + H - 2], [mx, my + H + 13], [mx + W * 0.8, my + H - 2]], false)} stroke={lipC} strokeWidth={11} fill="none" strokeLinecap="round" />
        <path d={md} fill="none" stroke={INKC} strokeWidth={3} opacity={0.8} />
        <Patch d={`M${mx - 26},${my + H + 20} a26,9 0 1,0 52,0 a26,9 0 1,0 -52,0Z`} c={skD} o={0.7} b={3} />
      </g>
    );
  } else {
    const cu = E.m === 'smile' ? -12 : E.m === 'down' ? 8 : 0;
    const tight = E.m === 'tight' ? 0.55 : 1;
    const lineD = E.m === 'smirk'
      ? sp([[mx - mw, my + 2], [mx - mw * 0.3, my + 2], [mx + mw * 0.4, my - 2], [mx + mw + 4, my - 14]], false)
      : E.m === 'smile'
        ? sp([[mx - mw - 4, my + cu], [mx - mw * 0.4, my + 8], [mx + mw * 0.4, my + 8], [mx + mw + 4, my + cu]], false)
        : sp([[mx - mw, my + cu], [mx - mw * 0.4, my - 1], [mx, my + 1], [mx + mw * 0.4, my - 1], [mx + mw, my + cu]], false);
    mouth = (
      <g>
        <path d={sp([[mx - mw, my + cu, 0.2], [mx - mw * 0.55, my - 12 * tight], [mx - 8, my - 9 * tight], [mx, my - 6 * tight], [mx + 8, my - 9 * tight], [mx + mw * 0.55, my - 12 * tight], [mx + mw, my + cu, 0.2], [mx + mw * 0.4, my + 1], [mx - mw * 0.4, my + 1]])} fill={dark(lipC, 0.25)} opacity={fem ? 0.95 : 0.8} />
        <path d={sp([[mx - mw * 0.82, my + 2 + cu * 0.6, 0.3], [mx - mw * 0.4, my + 3], [mx + mw * 0.4, my + 3], [mx + mw * 0.82, my + 2 + cu * 0.6, 0.3], [mx + mw * 0.45, my + 20 * tight], [mx - mw * 0.45, my + 20 * tight]])} fill={lipC} opacity={fem ? 0.95 : 0.65} />
        <ellipse cx={mx - 10} cy={my + 10} rx={12} ry={4} fill={L.keyC} opacity={0.55} />
        <path d={lineD} stroke={INKC} strokeWidth={4.5} fill="none" strokeLinecap="round" opacity={0.85} />
        <Patch d={`M${mx - 28},${my + 32} C${mx - 10},${my + 26} ${mx + 10},${my + 26} ${mx + 28},${my + 32} C${mx + 10},${my + 40} ${mx - 10},${my + 40} ${mx - 28},${my + 32}Z`} c={skDD} o={0.7} b={3} />
        {E.m === 'smile' && <path d={`M${mx - mw - 14},${my - 20} q-8,14 2,28 M${mx + mw + 14},${my - 20} q8,14 -2,28`} stroke={ln} strokeWidth={3} fill="none" opacity={0.5} />}
        <path d={`M${mx - mw - 2},${my + cu} q-5,4 -4,10 M${mx + mw + 2},${my + cu} q5,4 4,10`} stroke={ln} strokeWidth={3} fill="none" opacity={0.45} />
      </g>
    );
  }

  const stubD = sp([[-146, 40], [-138, 110], [-104, 176], [-54, 208], [0, chin - 4], [54, 208], [104, 176], [138, 110], [146, 40], [120, 70], [86, 116], [mx + 54, my + 4], [mx + 42, my - 22], [nt + 12, noseY + 22], [nt - 12, noseY + 22], [mx - 42, my - 22], [mx - 54, my + 4], [-86, 116], [-120, 70]]);
  return (
    <g>
      <PaintDefs />
      {!noHair && !noBack && <HairBack s={s} uid={id} />}
      {[-1, 1].map((q) => {
        const ear = sp([[q * 130, -48], [q * 156, -66], [q * 178, -44], [q * 180, -6], [q * 172, 28], [q * 158, 52], [q * 136, 60]]);
        return (
          <g key={q} transform={`translate(${q * turn > 0 ? -q * 40 * T : -turn * 10},0)`} opacity={q * turn > 0 && T > 0.6 ? 0 : 1}>
            <Form id={`${id}-ear${q}`} d={ear} c={mix(skin, red, 0.3)} so={q > 0 ? 40 : 12} lo={10} ro={6} soft={6} line={3}>
              <Crease d={`M${q * 146},-36 C${q * 168},-44 ${q * 168},-6 ${q * 156},8 C${q * 148},20 ${q * 154},32 ${q * 146},42`} c={skDD} w={8} o={0.7} b={3} />
            </Form>
          </g>
        );
      })}
      <g transform={`scale(${fw},1)`}>
        <Form id={`${id}-face`} d={faceD} c={skin} so={16} lo={70} ro={8} soft={12} tilt={0.04} line={3.5} lineO={0.6}>
          <g transform={`translate(${tx * 0.7},0)`}><Patch d={faceShadow(half, ey, chin)} c={skD} o={0.95} b={3} /></g>
          {!kid && <Patch d={`M-150,${ey + 40} C-122,${ey + 48} -98,${ey + 74} -92,${ey + 108} C-112,${ey + 100} -138,${ey + 74} -150,${ey + 64}Z`} c={skD} o={0.5} b={6} />}
          <Patch d={`M${mx - 58},${noseY + 16} C${mx - 30},${noseY + 8} ${mx + 30},${noseY + 8} ${mx + 58},${noseY + 16} L${mx + 52},${my - 6} L${mx - 52},${my - 6}Z`} c={skD} o={0.25} b={6} />
          <Patch d={sp([[-150, 140], [-110, 196], [-40, chin + 8], [40, chin + 8], [110, 196], [150, 140], [150, 270], [-150, 270]])} c={skD} o={0.45} b={6} />
          <Patch d="M-100,-182 C-40,-204 40,-200 62,-164 C40,-130 -60,-124 -104,-150Z" c={L.keyC} o={0.36} b={12} />
          <Patch d={`M-134,${ey + 12} C-112,${ey - 4} -78,${ey} -68,${ey + 20} C-78,${ey + 46} -116,${ey + 52} -134,${ey + 32}Z`} c={L.keyC} o={0.42} b={6} />
          <Patch d={`M-24,${chin - 48} C-4,${chin - 60} 18,${chin - 56} 20,${chin - 38} C10,${chin - 24} -14,${chin - 24} -24,${chin - 38}Z`} c={L.keyC} o={0.4} b={6} />
          <Patch d={`M${-ex - 54 + tx},${ey + 50} a48,30 0 1,0 96,0 a48,30 0 1,0 -96,0Z`} c={red} o={ghost ? 0.25 : fem || kid ? 0.5 : 0.28} b={12} />
          <Patch d={`M${ex - 42 + tx},${ey + 50} a48,30 0 1,0 96,0 a48,30 0 1,0 -96,0Z`} c={red} o={ghost ? 0.25 : fem || kid ? 0.45 : 0.24} b={12} />
          {s.stubble && <><Patch d={stubD} c="#3e4c66" o={0.16} b={6} /><g filter="url(#pk-b3)" opacity={0.75}><Speck id={`${id}-stb`} d={stubD} seed={9} n={1500} col={mix(s.hair, '#3a4660', 0.3)} op={0.35} r={0.9} box={[-150, 40, 300, 200]} /></g></>}
          {!s.stubble && !fem && !kid && !ghost && <Patch d={stubD} c="#4a5a78" o={0.1} b={6} />}
          {s.beard && <path d={stubD} fill={s.grey ? '#9a978e' : s.hair} opacity={0.92} />}
          {age >= 2 && <path d="M-88,-146 C-40,-158 40,-158 88,-146 M-78,-122 C-30,-132 30,-132 78,-122" stroke={skDD} strokeWidth={3.5} fill="none" opacity={0.2 + age * 0.1} />}
          {age >= 2 && <path d={`M${tx - 14},${by - 2} l4,-22 M${tx + 14},${by - 2} l-4,-22`} stroke={skDD} strokeWidth={3} opacity={0.45} />}
          {!kid && <Crease d={`M${nt + nw + 6},${noseY - 6} C${nt + nw + 26},${noseY + 22} ${mx + mw + 10},${my - 14} ${mx + mw + 12},${my + 12}`} c={skDD} w={age >= 2 ? 9 : 5} o={0.35 + age * 0.12} b={3} />}
          {!kid && <Crease d={`M${nt - nw - 6},${noseY - 6} C${nt - nw - 26},${noseY + 22} ${mx - mw - 10},${my - 14} ${mx - mw - 12},${my + 12}`} c={skD} w={age >= 2 ? 7 : 4} o={0.25 + age * 0.1} b={3} />}
          {!ghost && <path d={`M${mx - 8},${noseY + 18} L${mx - 10},${my - 10} M${mx + 8},${noseY + 18} L${mx + 10},${my - 10}`} stroke={skD} strokeWidth={3} opacity={0.35} />}
          {s.freckles && <Speck id={`${id}-frk`} d="M-126,26 C-80,0 80,0 126,26 C100,76 -100,76 -126,26Z" seed={4} n={70} col={dark(skin, 0.3)} op={0.55} r={2.2} box={[-130, -4, 260, 84]} />}
          {s.mole && <circle cx={-70 + tx} cy={my + 30} r={4} fill={dark(skin, 0.6)} />}
          {ghost && <Patch d={sp([[-140, -60], [-60, -40], [0, 0], [60, -40], [140, -60], [140, 270], [-140, 270]])} c="#5c7894" o={0.18} b={24} />}
        </Form>
        {brow(1)}{brow(-1)}
        {eye(1)}{eye(-1)}
        {ghost === 'woman' ? <g opacity={0.6}>{nose}</g> : nose}
        {s.stache && <Form id={`${id}-stc`} d={sp([[mx - 62, my - 2, 0.3], [mx - 32, my - 34], [mx, my - 27], [mx + 32, my - 34], [mx + 62, my - 2, 0.3], [mx + 30, my - 12], [mx, my - 15], [mx - 30, my - 12]])} c={s.grey ? '#a8a59c' : dark(s.hair, 0.05)} so={24} lo={20} ro={5} soft={6} line={2}>
          <path d={`M${mx - 44},${my - 26} q10,10 4,20 M${mx - 18},${my - 26} q6,10 2,18 M${mx + 18},${my - 26} q-6,10 -2,18 M${mx + 44},${my - 26} q-10,10 -4,20`} stroke={lite(s.grey ? '#a8a59c' : s.hair, 0.35)} strokeWidth={3} fill="none" opacity={0.6} />
        </Form>}
        {mouth}
        {s.glasses && <path d={`M${tx - 18},${ey - 8} q18,-12 36,0`} stroke="#2c1e18" strokeWidth={5} fill="none" />}
      </g>
      {!noHair && <HairFront s={s} uid={id} turn={turn} />}
    </g>
  );
};

// close-up face. FIX: never a floating head any more - the neck, shoulders and body are attached (CloseUp).
// The face still sits at (0,0) at the old size, so old scenes keep working.
export const FacePerson: React.FC<{ s: Spec; expr?: Expr; f?: number; turn?: number; uid?: string }> = (p) => <CloseUp {...p} />;
// head WITHOUT a body: ONLY for pictures of a face (photo, poster, painting, mask, TV screen). Never for a living character in a scene.
export const PictureHead: React.FC<{ s: Spec; expr?: Expr; f?: number; turn?: number; uid?: string }> = (p) => <Painted><Head {...p} /></Painted>;

// ===== old API names (drop-in for existing scenes)
export const FaceNoah: React.FC<{ expr?: Expr; f?: number; turn?: number }> = ({ expr = 'neutral', f = 4, turn = 0 }) => <FacePerson s={CAST.noah} expr={expr} f={f} turn={turn} />;
export const FaceWoman: React.FC<{ f?: number }> = ({ f = 4 }) => <LightSet {...LIGHT_GHOST}><g transform={`rotate(${8 + Math.sin(f / 18) * 2} 0 200)`}><FacePerson s={GHOSTS.woman} f={f} /></g></LightSet>;
export const FaceGrin: React.FC<{ f?: number }> = ({ f = 4 }) => <LightSet {...LIGHT_GHOST}><FacePerson s={GHOSTS.grin} f={f} /></LightSet>;
export const FaceChild: React.FC<{ f?: number }> = ({ f = 4 }) => <LightSet {...LIGHT_GHOST}><FacePerson s={GHOSTS.child} f={f} /></LightSet>;


