import React from 'react';
import { Form, Crease, Patch, Speck, Painted, Mirror, PaintDefs, sp, sym, mix, dark, lite, ribbonW, useLight, shadeOf, lineOf, P } from '../Paint';
import { ik } from '../Rig';
import type { XY } from '../Rig';
// ===== SCROLL KAOS MONSTER KIT (v0.4). One parametric, DETAILED creature builder, drawn in the same painted style as the cast.
// Build the creature the story describes by filling a CreatureSpec (height, hunch, arm and finger length, eyes, mouth, teeth,
// ribs, spine, veins, wet sheen, claws, hair, blood). Never draw a monster as a flat blob or a plain silhouette in its reveal shots.
// Units like the cast: origin = between the feet on the ground, up = negative y. An adult human is about 3040 tall.
// Views: 'side' (profile, best for hunched / long-armed shapes; face = 1 looks right, -1 left) and 'front' (doorway, looming).
// Close-up face: <CreatureFace/> (face centre at 0,0, about 520 wide at k = 1).
// Every pose is SMOOTH (f = 1/30 s): breathing, slow head tilt, finger twitches, eased reach, walk cycle with planted feet.

export type CreatureSpec = {
  id: string; skin: string; height?: number; hunch?: number; armL?: number; fingerL?: number; legL?: number; thin?: number;
  eyes?: 'none' | 'hollow' | 'glow' | 'black'; mouth?: 'slit' | 'teeth' | 'none'; teeth?: number; jawW?: number;
  veins?: boolean; ribs?: boolean; spine?: boolean; wet?: number; claws?: string; hair?: 'none' | 'stringy'; hairC?: string; eyeC?: string;
};
// ready-made creatures (add one per story, keep the builder)
export const CREATURES: Record<string, CreatureSpec> = {
  // "I Know You're Awake": hairless, eyeless, waxy, hunched like a caveman, very long arms and fingers
  waxman: { id: 'waxman', skin: '#cdc3a6', hunch: 0.82, armL: 1.28, fingerL: 1.55, legL: 1.06, thin: 0.75, eyes: 'none', mouth: 'teeth', teeth: 26, jawW: 1.15, veins: true, ribs: true, spine: true, wet: 0.8, claws: '#3a2a22', hair: 'none' },
  // spare designs for other stories
  hollowman: { id: 'hollowman', skin: '#a9b2b8', hunch: 0.35, armL: 1.1, fingerL: 1.25, thin: 0.9, eyes: 'black', mouth: 'slit', veins: true, ribs: true, spine: true, wet: 0.3, claws: '#1c1a20', hair: 'stringy', hairC: '#1a1a1e' },
  glower: { id: 'glower', skin: '#6a6460', hunch: 0.6, armL: 1.2, fingerL: 1.35, thin: 0.6, eyes: 'glow', eyeC: '#f2e9b0', mouth: 'teeth', teeth: 20, veins: false, ribs: true, spine: true, wet: 0.4, claws: '#141012', hair: 'none' },
};
export const BLOOD = '#6e0d10', BLOOD_HI = '#b3221f', BLOOD_D = '#2a0406';

export type CPose = 'stand' | 'stalk' | 'reach' | 'paint' | 'lean' | 'crouch' | 'loom';
export type CProps = {
  c: CreatureSpec; x?: number; y?: number; k?: number; f?: number; view?: 'side' | 'front'; face?: 1 | -1; pose?: CPose;
  p?: number; jaw?: number; target?: XY; blood?: { hands?: number; mouth?: number; body?: number }; uid?: string; tilt?: number; shadow?: boolean;
};
const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const sm = (t: number) => { const c = clamp(t); return c * c * (3 - 2 * c); };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const L2 = (a: XY, b: XY, t: number): XY => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
const add = (a: XY, b: XY): XY => [a[0] + b[0], a[1] + b[1]];

// ---------- SIDE-VIEW RIG (facing +x). Exported so scenes can aim callouts at the head, mouth or hands.
// The torso has its own local frame: up = pelvis -> shoulders, fwd = belly side. loc(base, a, b) = base + fwd*a + up*b.
export const creatureRig = (pr: CProps) => {
  const c = pr.c, f = pr.f ?? 0, pose = pr.pose || 'stand';
  const A = c.armL ?? 1.2, G = c.legL ?? 1;
  const LT = 880 * G, LS = 860 * G, U = 900 * A, Fo = 860 * A;
  const br = Math.sin(f / 38);
  let h = c.hunch ?? 0.7;
  let P: XY = [0, -1600 * G + br * 8];
  let a0: XY = [110, -110], a1: XY = [-150, -110];
  let swing = 0, dx = 0;
  if (pose === 'stalk') {
    const S = 300; const p = pr.p ?? f / 80; const u = ((p % 1) + 1) % 1; dx = 2 * S * p;
    const lx = (q: number) => (q < 0.5 ? S / 2 - S * (q / 0.5) : -S / 2 + S * sm((q - 0.5) / 0.5));
    const ly = (q: number) => (q < 0.5 ? 0 : Math.sin(Math.PI * ((q - 0.5) / 0.5)) * 150);
    a0 = [lx(u), -110 - ly(u)]; a1 = [lx((u + 0.5) % 1), -110 - ly((u + 0.5) % 1)];
    P = [0, -1580 * G + Math.cos(u * Math.PI * 4) * 22]; swing = Math.sin(u * Math.PI * 2);
  }
  if (pose === 'crouch') { P = [0, -1080 * G]; a0 = [230, -110]; a1 = [-140, -110]; h = 1; }
  if (pose === 'lean') h = Math.min(1.15, h + 0.3 * sm(pr.p ?? 1));
  if (pose === 'loom') h = Math.max(0.2, h - 0.45);
  const W: XY = add(P, [60 * h + 20, -330]);
  const R: XY = add(P, [260 * h + 40, -720 + 90 * h]);
  const S: XY = add(P, [560 * h + 80, -980 + 300 * h + br * 6]);
  const ux0 = S[0] - P[0], uy0 = S[1] - P[1], um = Math.hypot(ux0, uy0) || 1; const up: XY = [ux0 / um, uy0 / um], fwd: XY = [-up[1], up[0]];
  const loc = (base: XY, a: number, b: number): XY => [base[0] + fwd[0] * a + up[0] * b, base[1] + fwd[1] * a + up[1] * b];
  const N: XY = loc(S, 70, 110);
  const tilt = (pr.tilt ?? 0) + Math.sin(f / 53) * 5 + (pose === 'loom' ? 14 : 0);
  const Hd: XY = add(N, [230 + 80 * h, 30 + 130 * h + (pose === 'lean' ? 80 * sm(pr.p ?? 1) : 0)]);
  // arms
  const shN: XY = loc(S, 40, -70), shF: XY = loc(S, -30, -50);
  const hangN: XY = [shN[0] + 220 + swing * 240, -640], hangF: XY = [shF[0] + 110 - swing * 240, -680];
  let wN = hangN, wF = hangF;
  const pp = sm(pr.p ?? 1);
  if (pose === 'reach') wN = L2(hangN, pr.target ?? [S[0] + 1950, S[1] - 80], pp);
  if (pose === 'paint') { const t = f / 30; const tg = pr.target ?? [S[0] + 1350, S[1] - 420]; wN = L2(hangN, [tg[0] + Math.sin(t * 1.6) * 170, tg[1] + Math.sin(t * 2.2 + 1) * 120], pp); wF = L2(hangF, [S[0] + 700, S[1] + 300], pp * 0.6); }
  if (pose === 'lean') { wN = L2(hangN, pr.target ?? [S[0] + 950, S[1] + 820], pp); wF = L2(hangF, [S[0] + 420, S[1] + 900], pp); }
  if (pose === 'crouch') { wN = [S[0] + 520, -120]; wF = [S[0] + 260, -140]; }
  if (pose === 'loom') { wN = [shN[0] + 160, S[1] + 1250]; wF = [shF[0] + 60, S[1] + 1200]; }
  const dn = pose === 'reach' || pose === 'paint';
  const armN = ik(shN, wN, U, Fo, -1, dn), armF = ik(shF, wF, U, Fo, -1, pose === 'paint');
  const hipN: XY = loc(P, 30, -40), hipF: XY = loc(P, -10, -30);
  const legN = ik(hipN, add([P[0], 0], a0), LT, LS, 1), legF = ik(hipF, add([P[0], 0], a1), LT, LS, 1);
  return { P, W, R, S, N, Hd, tilt, shN, shF, armN, armF, hipN, hipF, legN, legF, dx, h, br, up, fwd, loc };
};
export type CRig = ReturnType<typeof creatureRig>;
// world position of a rig point (for callouts): x, y, k, face of the Creature + its rig point
export const toWorld = (pr: CProps, pt: XY): XY => { const R = creatureRig(pr); const fc = pr.face ?? 1, k = pr.k ?? 1; return [(pr.x ?? 0) + fc * k * (pt[0] + R.dx), (pr.y ?? 0) + k * pt[1]]; };
export const anchors = (pr: CProps) => {
  const R = creatureRig(pr); const r = (R.tilt * Math.PI) / 180; const a = (lx: number, ly: number): XY => [R.Hd[0] + Math.cos(r) * lx - Math.sin(r) * ly, R.Hd[1] + Math.sin(r) * lx + Math.cos(r) * ly];
  return { head: toWorld(pr, a(0, -220)), eye: toWorld(pr, a(150, -60)), mouth: toWorld(pr, a(200, 110)), hand: toWorld(pr, R.armN.end), fingers: toWorld(pr, add(R.armN.end, [60, 420])), spine: toWorld(pr, R.loc(R.R, -200, 0)), foot: toWorld(pr, add(R.legN.end, [150, 90])), top: toWorld(pr, R.loc(R.S, -60, 160)), ribs: toWorld(pr, R.loc(R.R, 120, 40)) };
};

// ---------- long-fingered hand. Wrist at (0,0), forearm direction = rot (deg, 0 = fingers point down +y). curl 0..1
const CHand: React.FC<{ id: string; c: CreatureSpec; skin: string; rot: number; curl?: number; f: number; blood?: number; spread?: number; k?: number; seed?: number }> = ({ id, c, skin, rot, curl = 0.35, f, blood = 0, spread = 1, k = 1, seed = 0 }) => {
  const L = useLight(); const FL = c.fingerL ?? 1.4; const ln = lineOf(skin, L), shd = shadeOf(skin, L, 1.1);
  const palm = sp([[-38, -40], [40, -40], [70, 30], [82, 140], [70, 206], [30, 226], [-20, 226], [-62, 206], [-80, 140], [-72, 50]]);
  const lens = [300, 340, 326, 270].map((v) => v * FL), bx = [56, 20, -16, -52];
  const fing = lens.map((Lf, i) => {
    const tw = Math.sin(f / 23 + i * 1.7 + seed) * 5 + Math.sin(f / 61 + i) * 4;
    const a0 = (i - 1.5) * 7 * spread; const segs = [0.44, 0.33, 0.23]; const cu = [16, 26, 30].map((d) => d * curl);
    let ang = a0 + tw * 0.5; let p: XY = [bx[i], 206]; const pts: XY[] = [p];
    segs.forEach((s, j) => { ang += cu[j] + (j ? tw * 0.3 : 0); const r = (ang * Math.PI) / 180; p = [p[0] - Math.sin(r) * Lf * s, p[1] + Math.cos(r) * Lf * s]; pts.push(p); });
    return pts;
  });
  const thumb: XY[] = [[-66, 60], [-120, 150], [-138, 240 * Math.min(1.25, FL * 0.85)], [-128, 300 * Math.min(1.25, FL * 0.85)]];
  const gid = `${id}-bg`;
  return (
    <g transform={`rotate(${rot}) scale(${k})`}>
      <defs><linearGradient id={gid} gradientUnits="userSpaceOnUse" x1="0" y1="-60" x2="0" y2={560 * FL}><stop offset="0" stopColor={BLOOD} stopOpacity="0" /><stop offset="0.35" stopColor={BLOOD} stopOpacity="0.55" /><stop offset="0.7" stopColor={BLOOD_D} stopOpacity="0.95" /><stop offset="1" stopColor={BLOOD_D} stopOpacity="1" /></linearGradient></defs>
      {/* fingers: tendon-thin, knuckles, long dark nails */}
      {fing.map((pts, i) => {
        const d = ribbonW([[pts[0][0], pts[0][1] - 30], ...pts] as P[], [46, 44, 36, 28, 15], 6);
        return (
          <g key={i}>
            <Form id={`${id}-f${i}`} d={d} c={i === 3 ? mix(skin, '#8a7a90', 0.12) : skin} so={18} lo={10} ro={5} soft={6} line={3} tilt={0}>
              {pts.slice(1, 3).map((q, j) => <path key={j} d={`M${q[0] - 14},${q[1] - 6} q14,10 28,0 M${q[0] - 12},${q[1] + 4} q12,8 24,0`} stroke={ln} strokeWidth={2.4} fill="none" opacity={0.6} />)}
              <Crease d={sp(pts.map((q) => [q[0] + 8, q[1]] as P), false)} c={shd} w={10} o={0.55} b={3} />
              <Crease d={sp(pts.map((q) => [q[0] - 9, q[1]] as P), false)} c={lite(skin, 0.5)} w={4} o={0.5 * (c.wet ?? 0.5)} b={3} />
            </Form>
            <path d={`M${pts[3][0] - 9},${pts[3][1] - 26} Q${pts[3][0]},${pts[3][1] + 34} ${pts[3][0] + 10},${pts[3][1] - 22}Z`} fill={c.claws || '#3a2a22'} stroke="#100808" strokeWidth={2} />
            {blood > 0 && <path d={d} fill={`url(#${gid})`} opacity={blood} />}
          </g>
        );
      })}
      <Form id={`${id}-th`} d={ribbonW(thumb as P[], [56, 40, 30, 16], 6)} c={skin} so={18} lo={10} ro={5} soft={6} line={3} tilt={0} />
      <Form id={`${id}-p`} d={palm} c={skin} so={40} lo={22} ro={6} soft={6} line={3.5}>
        {[-40, -10, 22, 52].map((x, i) => <Crease key={i} d={`M${x * 0.7},10 C${x * 0.8},80 ${x * 0.95},140 ${x},180`} c={shd} w={7} o={0.45} b={3} />)}
        <Crease d="M-60,40 C-30,60 30,60 66,30" c={lite(skin, 0.4)} w={6} o={0.35} b={3} />
        {c.veins && <path d="M-20,-20 C-10,40 6,90 20,150 M10,30 C24,70 40,110 44,160" stroke="#5c6a92" strokeWidth={3} fill="none" opacity={0.35} />}
      </Form>
      {blood > 0 && <path d={palm} fill={`url(#${gid})`} opacity={blood * 0.8} />}
    </g>
  );
};
// fingertip of finger 1 in world coords (for drips)
const tipOf = (W: XY, rot: number, c: CreatureSpec, k = 1, i = 1): XY => { const FL = c.fingerL ?? 1.4; const lx = [56, 20, -16, -52][i], ly = 206 + [300, 340, 326, 270][i] * FL * 0.92; const r = (rot * Math.PI) / 180; return [W[0] + k * (lx * Math.cos(r) - ly * Math.sin(r)), W[1] + k * (lx * Math.sin(r) + ly * Math.cos(r))]; };
// falling blood drops from a point (smooth, looped)
export const Drops: React.FC<{ at: XY; f: number; n?: number; len?: number; k?: number; seed?: number; o?: number }> = ({ at, f, n = 3, len = 420, k = 1, seed = 0, o = 1 }) => (
  <g opacity={o}>{Array.from({ length: n }).map((_, i) => { const t = ((f / 34 + i / n + seed * 0.13) % 1 + 1) % 1; const y = at[1] + t * t * len; const s = k * (1 - t * 0.3); return <path key={i} d={`M${at[0]},${y - 26 * s} C${at[0] + 12 * s},${y - 4 * s} ${at[0] + 12 * s},${y + 12 * s} ${at[0]},${y + 13 * s} C${at[0] - 12 * s},${y + 12 * s} ${at[0] - 12 * s},${y - 4 * s} ${at[0]},${y - 26 * s}Z`} fill={BLOOD} opacity={t < 0.08 ? t / 0.08 : 1 - Math.max(0, t - 0.85) / 0.15} />; })}
    <ellipse cx={at[0]} cy={at[1] + 6 * k} rx={12 * k} ry={10 * k} fill={BLOOD_D} /></g>
);

// ---------- irregular teeth: a row from x0 to x1 along a gum line y(x); dir +1 = point down (upper teeth), -1 = up (lower)
const Teeth: React.FC<{ n: number; x0: number; x1: number; y: (x: number) => number; dir: 1 | -1; len: number; seed: number; c?: string }> = ({ n, x0, x1, y, dir, len, seed, c = '#e0d6b8' }) => {
  const q = (i: number, k: number) => { const v = Math.sin((i + 1) * 12.9898 * (k + 1) + seed * 78.233) * 43758.5453; return v - Math.floor(v); };
  const step = (x1 - x0) / n;
  return (<g>{Array.from({ length: n }).map((_, i) => {
    const cx = x0 + (i + 0.5) * step + (q(i, 1) - 0.5) * step * 0.3; const w = step * (0.62 + q(i, 2) * 0.45); const mid = 1 - Math.abs((cx - (x0 + x1) / 2) / ((x1 - x0) / 2));
    const h = len * (0.55 + 0.45 * mid) * (0.7 + q(i, 3) * 0.6); const tilt = (q(i, 4) - 0.5) * w * 0.9; const yb = y(cx);
    const tip: XY = [cx + tilt, yb + dir * h];
    return <g key={i}>
      <path d={`M${cx - w / 2},${yb - dir * 6} C${cx - w / 2},${yb + dir * h * 0.45} ${tip[0] - w * 0.18},${tip[1] - dir * h * 0.2} ${tip[0]},${tip[1]} C${tip[0] + w * 0.18},${tip[1] - dir * h * 0.2} ${cx + w / 2},${yb + dir * h * 0.45} ${cx + w / 2},${yb - dir * 6}Z`} fill={c} stroke="#2a1c16" strokeWidth={1.8} />
      <path d={`M${cx - w * 0.28},${yb + dir * 4} C${cx - w * 0.3},${yb + dir * h * 0.4} ${tip[0] - w * 0.1},${tip[1] - dir * h * 0.35} ${tip[0] - w * 0.04},${tip[1] - dir * h * 0.15}`} stroke="#fffaf0" strokeWidth={2} fill="none" opacity={0.55} />
      <path d={`M${cx - w / 2},${yb} C${cx - w / 4},${yb + dir * h * 0.22} ${cx + w / 4},${yb + dir * h * 0.22} ${cx + w / 2},${yb}`} fill="#8a6a3a" opacity={0.45} />
    </g>;
  })}</g>);
};

// ---------- side-view head (facing +x). Head centre (0,0), about 480 long. jaw 0..1 opens the mouth (hinge behind the cheek).
const SideHead: React.FC<{ id: string; c: CreatureSpec; f: number; jaw: number; blood: number }> = ({ id, c, f, jaw, blood }) => {
  const L = useLight(); const skin = c.skin, shd = shadeOf(skin, L, 1.1), shd2 = shadeOf(skin, L, 1.6), ln = lineOf(skin, L), hi = lite(skin, 0.55), wet = c.wet ?? 0.5;
  const ja = jaw * 32 + Math.sin(f / 19) * 1.5 * jaw;
  const skull = sp([[-200, -30], [-190, -150], [-120, -238], [-10, -268], [110, -246], [186, -186], [222, -112], [232, -50], [256, -4], [268, 34], [254, 56], [240, 66], [238, 92, 0.3], [150, 100], [60, 110], [-10, 136], [-110, 128], [-182, 66]]);
  const lower = sp([[-40, 104], [60, 108], [160, 104], [238, 96, 0.3], [236, 130], [204, 170], [130, 202], [40, 204], [-40, 182], [-74, 130]]);
  const mouthIn = sp([[-30, 108], [100, 100], [244, 92], [226, 150], [120, 190], [0, 178]]);
  const nT = Math.round((c.teeth ?? 22) / 2);
  return (
    <g>
      <g transform={`rotate(${ja} -50 110)`}>
        {jaw > 0.02 && <path d={mouthIn} fill="#1c0507" />}
        {jaw > 0.02 && c.mouth === 'teeth' && <Teeth n={nT} x0={0} x1={236} y={(x) => 118 - x * 0.06} dir={-1} len={44} seed={2} c="#d2c6a6" />}
        <Form id={`${id}-lj`} d={lower} c={skin} so={44} lo={26} ro={8} soft={6} line={4}>
          <Crease d="M-40,176 C40,204 140,198 210,164" c={shd2} w={24} o={0.6} />
          <Crease d="M30,132 C110,126 180,120 232,108" c={ln} w={4} o={0.5} b={3} />
          <Crease d="M-50,140 C-30,160 -10,176 30,186" c={shd} w={12} o={0.5} />
          {blood > 0 && <Patch d="M60,110 C120,100 200,96 236,110 C228,150 170,196 100,204 C70,176 60,140 60,110Z" c={BLOOD} o={blood * 0.85} b={6} />}
        </Form>
      </g>
      {jaw > 0.02 && c.mouth === 'teeth' && <Teeth n={nT} x0={-4} x1={240} y={(x) => 100 - x * 0.03} dir={1} len={56} seed={7} />}
      <Form id={`${id}-sk`} d={skull} c={skin} so={70} lo={60} ro={12} soft={12} line={4.5}>
        {/* brow ridge, then skin stretched smooth over where the eyes should be (no eyes) */}
        <Crease d="M60,-150 C120,-160 182,-136 216,-96" c={hi} w={18} o={0.55 * wet} b={6} />
        <Patch d="M80,-104 C130,-112 186,-90 206,-52 C186,-12 130,-6 90,-22 C68,-50 68,-84 80,-104Z" c={shd2} o={0.7} b={12} />
        {[0, 1, 2].map((i) => <Crease key={i} d={`M${96 + i * 4},${-52 + i * 10} C${130},${-44 + i * 12} ${166},${-46 + i * 12} ${196 - i * 6},${-60 + i * 10}`} c={ln} w={2.4} o={0.4 - i * 0.1} b={3} />)}
        <ellipse cx={138} cy={-70} rx={30} ry={10} fill={hi} opacity={0.35 * wet} />
        {/* cheekbone, hollow cheek, nose slits */}
        <Crease d="M40,-10 C100,-20 170,-6 224,16" c={hi} w={12} o={0.4} b={6} />
        <Patch d="M30,10 C90,6 160,24 200,52 C160,92 80,96 30,70Z" c={shd} o={0.6} b={12} />
        <path d="M244,20 q9,10 5,24 M232,24 q7,8 3,19" stroke="#1a0c0c" strokeWidth={5} fill="none" strokeLinecap="round" />
        <Patch d="M-190,-60 C-130,-20 -70,-10 -30,-40 L-30,150 L-200,150Z" c={shd2} o={0.55} b={24} />
        {/* skull plates, temple veins, pores */}
        <Crease d="M-70,-250 C-40,-170 -50,-90 -20,-30" c={shd} w={8} o={0.35} />
        <Crease d="M30,-262 C20,-200 40,-150 70,-120" c={shd} w={6} o={0.25} />
        {c.veins && <path d="M-120,-60 C-90,-90 -70,-70 -40,-110 C-20,-140 10,-130 30,-170 M-70,-10 C-40,-30 -10,-20 20,-50 M60,-200 C80,-170 74,-140 96,-120" stroke="#5a6890" strokeWidth={3.5} fill="none" opacity={0.45} />}
        <Speck id={`${id}-sp`} d={skull} seed={5} n={200} col={dark(skin, 0.35)} op={0.35} r={2.2} box={[-210, -270, 480, 420]} />
        <Crease d="M-150,40 C-120,20 -96,30 -84,60" c={shd2} w={10} o={0.45} />
        <ellipse cx={20} cy={-214} rx={46} ry={13} fill="#fff8ec" opacity={0.35 * wet} transform="rotate(-14 20 -214)" />
        <ellipse cx={186} cy={-140} rx={20} ry={7} fill="#fff8ec" opacity={0.45 * wet} transform="rotate(30 186 -140)" />
        {c.eyes === 'black' && <ellipse cx={146} cy={-58} rx={30} ry={22} fill="#050306" />}
        {c.eyes === 'hollow' && <ellipse cx={146} cy={-58} rx={30} ry={24} fill="#120808" />}
      </Form>
      {c.eyes === 'glow' && <g><circle cx={146} cy={-58} r={22} fill={c.eyeC || '#f2e9b0'} /><circle cx={146} cy={-58} r={60} fill={c.eyeC || '#f2e9b0'} opacity={0.18} /></g>}
      {jaw <= 0.02 && <path d="M-30,112 C60,118 170,106 240,96" stroke="#1a0808" strokeWidth={6} fill="none" strokeLinecap="round" />}
      {jaw <= 0.02 && <path d="M-30,112 q-14,6 -20,18" stroke={ln} strokeWidth={4} fill="none" opacity={0.6} />}
      {blood > 0 && <Patch d="M120,92 C180,86 236,88 256,100 C240,122 190,126 140,122Z" c={BLOOD} o={blood * 0.8} b={3} />}
      {c.hair === 'stringy' && [-170, -130, -80, -30, 20].map((x, i) => <path key={i} d={`M${x},${-236 + Math.abs(x) * 0.1} C${x - 30},-100 ${x - 10},40 ${x - 40 + Math.sin(f / 30 + i) * 8},200`} stroke={c.hairC || '#141216'} strokeWidth={8} fill="none" opacity={0.9} />)}
    </g>
  );
};

// limb segment with a muscle profile: pts along the bone, ws = widths at each point
const seg = (a: XY, b: XY, n: number): XY[] => Array.from({ length: n + 1 }, (_, i) => L2(a, b, i / n));
const ell = (cx: number, cy: number, rx: number, ry: number, rot = 0) => { const r = (rot * Math.PI) / 180, c0 = Math.cos(r), s0 = Math.sin(r); const p = (t: number) => { const x = rx * Math.cos(t), y = ry * Math.sin(t); return `${(cx + x * c0 - y * s0).toFixed(1)},${(cy + x * s0 + y * c0).toFixed(1)}`; }; return `M${p(0)} ` + Array.from({ length: 16 }, (_, i) => `L${p(((i + 1) / 16) * Math.PI * 2)}`).join(' ') + 'Z'; };
const ang = (a: XY, b: XY) => (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;

// ===== THE CREATURE (side or front view)
export const Creature: React.FC<CProps> = (pr) => {
  const { c, x = 0, y = 0, k = 0.25, f = 0, view = 'side', face = 1, jaw = 0, blood = {}, uid, shadow = false } = pr;
  const L = useLight();
  if (view === 'front') return <CreatureFront {...pr} />;
  const id = uid || `cr-${c.id}-${pr.pose || 'stand'}`;
  const skin = c.skin, far = mix(skin, '#262234', 0.36), shd = shadeOf(skin, L, 1.2), shd2 = shadeOf(skin, L, 1.7), ln = lineOf(skin, L), hi = lite(skin, 0.5), wet = c.wet ?? 0.5;
  const bh = blood.hands ?? 0, bm = blood.mouth ?? 0, bb = blood.body ?? 0;
  const thin = c.thin ?? 0.75, T = 1.12 - thin * 0.22;
  const R = creatureRig(pr); const lc = R.loc;
  const handRot = (a: { mid: XY; end: XY }) => (Math.atan2(-(a.end[0] - a.mid[0]), a.end[1] - a.mid[1]) * 180) / Math.PI;
  const rotN = handRot(R.armN), rotF = handRot(R.armF);
  // ---- arm: shoulder cap + upper arm + bony elbow + forearm + wrist
  const drawArm = (isFar: boolean) => {
    const a = isFar ? R.armF : R.armN, sh = isFar ? R.shF : R.shN, col = isFar ? far : skin, rot = isFar ? rotF : rotN, aid = `${id}-a${isFar ? 'F' : 'N'}`;
    const sd = isFar ? dark(far, 0.25) : shd;
    const upper = ribbonW(seg(sh, a.mid, 4) as P[], [235, 220, 192, 150, 124].map((w) => w * T), 6);
    const fore = ribbonW(seg(L2(a.mid, sh, 0.06), a.end, 4) as P[], [136, 154, 128, 96, 84].map((w) => w * T), 6);
    return (
      <g>
        <Form id={aid + 'u'} d={upper + ' ' + ell(sh[0], sh[1] + 10, 150 * T, 128 * T, ang(sh, a.mid))} c={col} so={isFar ? 24 : 54} lo={isFar ? 8 : 30} ro={isFar ? 4 : 10} soft={12} line={isFar ? 3 : 4} tilt={0}>
          <Crease d={sp([L2(sh, a.mid, 0.15), L2(sh, a.mid, 0.85)] as P[], false)} c={sd} w={30} o={0.45} />
          {!isFar && <Crease d={sp([add(L2(sh, a.mid, 0.1), [-24, 0]), add(L2(sh, a.mid, 0.6), [-30, 0])] as P[], false)} c={hi} w={10} o={0.45 * wet} b={3} />}
        </Form>
        <Form id={aid + 'f'} d={fore} c={col} so={isFar ? 22 : 44} lo={isFar ? 8 : 24} ro={isFar ? 4 : 8} soft={12} line={isFar ? 3 : 4} tilt={0}>
          <Crease d={sp([L2(a.mid, a.end, 0.1), L2(a.mid, a.end, 0.9)] as P[], false)} c={sd} w={22} o={0.5} />
          {!isFar && <Crease d={sp([add(L2(a.mid, a.end, 0.15), [-16, -4]), add(L2(a.mid, a.end, 0.7), [-12, -4])] as P[], false)} c={hi} w={7} o={0.5 * wet} b={3} />}
          {c.veins && !isFar && <path d={sp([L2(a.mid, a.end, 0.12), add(L2(a.mid, a.end, 0.45), [12, 4]), add(L2(a.mid, a.end, 0.7), [-6, 0]), L2(a.mid, a.end, 0.96)] as P[], false)} stroke="#566492" strokeWidth={4} fill="none" opacity={0.42} />}
          {bh > 0 && <Patch d={ribbonW([L2(a.mid, a.end, 0.5), a.end] as P[], [50, 90], 4)} c={BLOOD} o={bh * 0.75} b={6} />}
        </Form>
        <Patch d={ell(a.mid[0] - 14, a.mid[1], 40 * T, 30 * T, ang(sh, a.mid))} c={isFar ? dark(far, 0.1) : lite(skin, 0.35)} o={0.7} b={3} />
        <g transform={`translate(${a.end[0]},${a.end[1]})`}><CHand id={aid + 'h'} c={c} skin={col} rot={rot} f={f} curl={pr.pose === 'paint' && !isFar ? 0.25 : pr.pose === 'reach' && !isFar ? 0.1 : 0.45} blood={bh} seed={isFar ? 3 : 0} /></g>
      </g>
    );
  };
  // ---- leg: thigh + knee cap + shin with calf + long foot
  const drawLeg = (isFar: boolean) => {
    const g = isFar ? R.legF : R.legN, hip = isFar ? R.hipF : R.hipN, col = isFar ? far : skin, gid = `${id}-l${isFar ? 'F' : 'N'}`;
    const sd = isFar ? dark(far, 0.25) : shd;
    const thigh = ribbonW(seg(add(hip, [0, -70]), g.mid, 4) as P[], [390, 350, 290, 220, 178].map((w) => w * T), 6);
    const shin = ribbonW(seg(L2(g.mid, hip, 0.05), g.end, 4) as P[], [180, 206, 166, 120, 104].map((w) => w * T), 6);
    const A = g.end;
    return (
      <g>
        <Form id={gid + 't'} d={thigh} c={col} so={isFar ? 30 : 70} lo={isFar ? 10 : 40} ro={isFar ? 4 : 10} soft={12} line={isFar ? 3 : 4} tilt={0}>
          <Crease d={sp([L2(hip, g.mid, 0.2), L2(hip, g.mid, 0.9)] as P[], false)} c={sd} w={36} o={0.4} />
        </Form>
        <Form id={gid + 's'} d={shin} c={col} so={isFar ? 26 : 50} lo={isFar ? 8 : 30} ro={isFar ? 4 : 8} soft={12} line={isFar ? 3 : 4} tilt={0}>
          <Crease d={sp([add(L2(g.mid, A, 0.12), [-30, 0]), add(L2(g.mid, A, 0.55), [-34, 0])] as P[], false)} c={sd} w={34} o={0.45} />
          {!isFar && <Crease d={sp([add(L2(g.mid, A, 0.1), [40, 0]), add(L2(g.mid, A, 0.9), [30, 0])] as P[], false)} c={hi} w={8} o={0.45 * wet} b={3} />}
        </Form>
        <Patch d={ell(g.mid[0] + 40, g.mid[1], 56 * T, 48 * T)} c={isFar ? dark(far, 0.1) : lite(skin, 0.35)} o={0.7} b={3} />
        <g transform={`translate(${A[0]},${A[1]})`}>
          <Form id={gid + 'f'} d={sp([[-70, -50], [40, -60], [150, -16], [290, 40], [390, 86], [396, 108, 0.4], [300, 114, 0], [-60, 114, 0], [-100, 60]])} c={col} so={30} lo={20} ro={6} soft={6} line={isFar ? 3 : 4} tilt={0}>
            {[310, 250, 190, 130].map((xx, i) => <path key={i} d={`M${xx},${66 + i * 4} q-6,24 -4,44`} stroke={ln} strokeWidth={3} fill="none" opacity={0.6} />)}
            <Crease d="M-40,10 C60,-10 200,20 370,88" c={isFar ? far : hi} w={8} o={0.4} b={3} />
            <ellipse cx={-30} cy={-6} rx={40} ry={30} fill={isFar ? dark(far, 0.1) : lite(skin, 0.15)} opacity={0.6} />
          </Form>
          {[386, 330, 270].map((xx, i) => <path key={i} d={`M${xx - 8},${100 - i * 4} q26,8 32,30 l-28,-6Z`} fill={c.claws || '#2a1e18'} />)}
        </g>
      </g>
    );
  };
  // ---- torso: back contour (spine side) and front contour (ribs, sunken belly) in the torso frame
  const torso = sp([lc(R.S, -70, 170), lc(R.S, -220, 20), lc(R.R, -260 - 40 * R.h, 0), lc(R.W, -170, 0), lc(R.P, -250, 120), lc(R.P, -220, -80), lc(R.P, -50, -190), lc(R.P, 110, -140), lc(R.P, 230, 70), lc(R.W, 170 * T, 0), lc(R.R, 330, -60), lc(R.S, 290, -130), lc(R.S, 210, 50), lc(R.S, 110, 160)]);
  const knobs: XY[] = Array.from({ length: 12 }, (_, i) => { const t = i / 11; const base = t < 0.5 ? L2(R.P, R.R, t / 0.5) : L2(R.R, R.S, (t - 0.5) / 0.5); const bk = t < 0.5 ? lerp(-230, -255 - 40 * R.h, t / 0.5) : lerp(-255 - 40 * R.h, -205, (t - 0.5) / 0.5); const hump = Math.sin(Math.PI * t) * 20; return [base[0] + R.fwd[0] * (bk - hump + 18), base[1] + R.fwd[1] * (bk - hump + 18)] as XY; });
  const ribs = Array.from({ length: 7 }, (_, i) => { const t = 0.15 + i * 0.12; const base = L2(R.R, R.S, Math.min(1, t * 0.9)); const b2 = L2(R.W, R.R, Math.min(1, 0.4 + t * 0.6)); return sp([lc(base, -190, -10), lc(base, -60, -60), lc(b2, 120, -60), lc(b2, 240 * (1 - i * 0.03), -150)], false); });
  const neckP: XY[] = [lc(R.S, 30, 60), R.N, add(R.Hd, [-90 * Math.cos((R.tilt * Math.PI) / 180), 70])];
  const drip = bh > 0 ? tipOf(R.armN.end, rotN, c, 1, 1) : null;
  const body = (
    <g>
      {drawArm(true)}
      {drawLeg(true)}
      <Form id={`${id}-tor`} d={torso} c={skin} so={130} lo={80} ro={14} soft={24} line={4.5} tilt={0.1}>
        {(c.ribs ?? true) && ribs.map((d, i) => <g key={i}><Crease d={d} c={shd} w={18} o={0.55} /><g transform="translate(-8,-14)"><Crease d={d} c={hi} w={7} o={0.45 * wet} b={3} /></g></g>)}
        <Patch d={sp([lc(R.W, -40, 120), lc(R.W, 150, 40), lc(R.P, 190, 40), lc(R.P, 60, -60), lc(R.W, -20, -40)])} c={shd2} o={0.5} b={24} />
        <Crease d={sp([lc(R.P, -60, -60), lc(R.P, 60, 40), lc(R.P, 170, 40)], false)} c={shd} w={18} o={0.5} />
        <Crease d={sp([lc(R.S, 200, -100), lc(R.S, 120, 60), lc(R.S, 20, 120)], false)} c={shd} w={16} o={0.45} />
        <Crease d={sp(knobs.slice(2, 10).map((q) => add(q, [R.fwd[0] * 40, R.fwd[1] * 40]) as P), false)} c={hi} w={22} o={0.55 * wet} b={12} />
        {c.veins && <path d={sp([lc(R.R, 160, 40), lc(R.W, 150, 80), lc(R.W, 120, -80)], false)} stroke="#566492" strokeWidth={4} fill="none" opacity={0.35} />}
        <Speck id={`${id}-tsp`} d={torso} seed={8} n={320} col={dark(skin, 0.35)} op={0.3} r={2.4} box={[R.P[0] - 500, R.S[1] - 400, 1800, 1800]} />
        {bb > 0 && <Patch d={sp([lc(R.R, 100, 40), lc(R.R, 250, -40), lc(R.W, 150, -40), lc(R.W, 60, 40)])} c={BLOOD} o={bb * 0.75} b={12} />}
      </Form>
      {(c.spine ?? true) && knobs.map((q, i) => <g key={i}><ellipse cx={q[0]} cy={q[1]} rx={30} ry={24} fill={lite(skin, 0.18)} stroke={ln} strokeWidth={2.2} /><ellipse cx={q[0] - 6} cy={q[1] - 8} rx={12} ry={6} fill="#fff8ec" opacity={0.35 * wet} /></g>)}
      {drawLeg(false)}
      <Form id={`${id}-nk`} d={ribbonW(neckP as P[], [250, 190, 160], 8)} c={skin} so={56} lo={30} ro={8} soft={12} line={4} tilt={0}>
        <Crease d={sp(neckP.map((q) => [q[0] + 10, q[1] + 34] as P), false)} c={shd} w={28} o={0.55} />
        {[-30, 10, 40].map((o, i) => <Crease key={i} d={sp(neckP.map((q) => [q[0] + o * 0.3, q[1] + o] as P), false)} c={i === 1 ? hi : shd} w={i === 1 ? 6 : 8} o={0.4} b={3} />)}
        {bm > 0 && <Crease d={sp(neckP.map((q) => [q[0] + 30, q[1] + 40] as P), false)} c={BLOOD} w={20} o={bm * 0.75} b={3} />}
      </Form>
      <g transform={`translate(${R.Hd[0]},${R.Hd[1]}) rotate(${R.tilt})`}><SideHead id={`${id}-hd`} c={c} f={f} jaw={jaw} blood={bm} /></g>
      {drawArm(false)}
      {drip && <Drops at={drip} f={f} n={3} len={520} k={1.6} />}
    </g>
  );
  return (
    <g transform={`translate(${x + face * k * R.dx},${y}) scale(${k})`}>
      {shadow ? <g filter="url(#cr-black)"><Mirror on={face < 0}>{body}</Mirror></g> : (
        <Painted>
          <ellipse cx={face * 260} cy={0} rx={900} ry={70} fill="#06040a" opacity={0.45} />
          <Mirror on={face < 0}>{body}</Mirror>
        </Painted>
      )}
    </g>
  );
};

// ===== FRONT VIEW: hunched toward the camera, head hanging forward between raised shoulders, arms almost to the floor.
const CreatureFront: React.FC<CProps> = (pr) => {
  const { c, x = 0, y = 0, k = 0.25, f = 0, jaw = 0, blood = {}, uid, pose = 'stand', shadow = false } = pr;
  const L = useLight();
  const id = uid || `crf-${c.id}-${pose}`;
  const skin = c.skin, shd = shadeOf(skin, L, 1.2), shd2 = shadeOf(skin, L, 1.7), ln = lineOf(skin, L), hi = lite(skin, 0.5), wet = c.wet ?? 0.5;
  const thin = c.thin ?? 0.75, T = 1.12 - thin * 0.22, A = c.armL ?? 1.2, G = c.legL ?? 1;
  const br = Math.sin(f / 38);
  const bh = blood.hands ?? 0, bm = blood.mouth ?? 0;
  const P: XY = [0, -1560 * G + br * 8];
  const shY = -2320 * G + br * 10, shX = 460 - thin * 30;
  const reach = pose === 'reach' ? sm(pr.p ?? 1) : 0;
  const sway = Math.sin(f / 47) * 26;
  const hip = (q: number): XY => [q * 150, P[1] + 20];
  const legs = [-1, 1].map((q) => ik(hip(q), [q * 190, -110], 880 * G, 860 * G, q * 0.4));
  const sh = (q: number): XY => [q * (shX - 20), shY + 60];
  const wrist = (q: number): XY => L2([q * (shX + 70) + sway * q, -420], [q * 230, shY + 420], reach * (q > 0 ? 1 : 0.55));
  const arms = [-1, 1].map((q) => ik(sh(q), wrist(q), 780 * A, 740 * A, q, false));
  const headY = shY + 40 + 110 * (c.hunch ?? 0.7), hTilt = Math.sin(f / 53) * 6 + (pr.tilt ?? 0);
  const torso = sym([[0, shY - 30], [shX * 0.45, shY - 80], [shX * 0.85, shY - 60], [shX + 40, shY + 40], [shX + 20, shY + 200], [shX - 40, shY + 420], [shX - 150, P[1] - 170], [shX - 130, P[1] - 30], [shX - 160, P[1] + 70], [90, P[1] + 140], [0, P[1] + 150]]);
  const handRot = (a: { mid: XY; end: XY }) => (Math.atan2(-(a.end[0] - a.mid[0]), a.end[1] - a.mid[1]) * 180) / Math.PI;
  const body = (
    <g>
      {legs.map((g, i) => { const q = i ? 1 : -1; const H = hip(q); return (
        <g key={i}>
          <Form id={`${id}-lt${i}`} d={ribbonW(seg(add(H, [0, -60]), g.mid, 4) as P[], [380, 340, 280, 210, 170].map((w) => w * T), 6)} c={skin} so={50} lo={30} ro={8} soft={12} tilt={0}><Crease d={sp([L2(H, g.mid, 0.2), L2(H, g.mid, 0.9)] as P[], false)} c={shd} w={30} o={0.4} /></Form>
          <Form id={`${id}-ls${i}`} d={ribbonW(seg(L2(g.mid, H, 0.05), g.end, 4) as P[], [180, 204, 160, 118, 100].map((w) => w * T), 6)} c={skin} so={40} lo={24} ro={8} soft={12} tilt={0}><Crease d={sp([L2(g.mid, g.end, 0.15), L2(g.mid, g.end, 0.85)] as P[], false)} c={shd} w={22} o={0.45} /></Form>
          <Patch d={ell(g.mid[0], g.mid[1], 58 * T, 50 * T)} c={lite(skin, 0.35)} o={0.7} b={3} />
          <Form id={`${id}-ft${i}`} d={sp([[g.end[0] - 76, g.end[1] - 40], [g.end[0] + 76, g.end[1] - 40], [g.end[0] + 100 + q * 30, g.end[1] + 110], [g.end[0] - 100 + q * 30, g.end[1] + 110]])} c={skin} so={30} lo={14} ro={6} soft={6} tilt={0}>
            {[0, 1, 2, 3].map((t) => <path key={t} d={`M${g.end[0] - 78 + t * 52 + q * 30},${g.end[1] + 60} v50`} stroke={ln} strokeWidth={3} opacity={0.6} />)}
          </Form>
          {[0, 1, 2, 3].map((t) => <path key={t} d={`M${g.end[0] - 92 + t * 54 + q * 30},${g.end[1] + 106} l10,26 l10,-26Z`} fill={c.claws || '#2a1e18'} />)}
        </g>); })}
      <Form id={`${id}-tor`} d={torso} c={skin} so={150} lo={80} ro={14} soft={24} line={4.5}>
        {Array.from({ length: 6 }).map((_, i) => [-1, 1].map((q) => <g key={`${i}${q}`}><Crease d={`M${q * 50},${shY + 150 + i * 66} C${q * 150},${shY + 128 + i * 66} ${q * (shX - 60)},${shY + 170 + i * 64} ${q * (shX - 30)},${shY + 236 + i * 58}`} c={shd} w={16} o={0.55} /><Crease d={`M${q * 54},${shY + 138 + i * 66} C${q * 150},${shY + 116 + i * 66} ${q * (shX - 60)},${shY + 156 + i * 64} ${q * (shX - 34)},${shY + 222 + i * 58}`} c={hi} w={6} o={0.4 * wet} b={3} /></g>))}
        <Crease d={`M0,${shY + 90} V${P[1] - 140}`} c={shd2} w={30} o={0.5} />
        {[-1, 1].map((q) => <Crease key={q} d={`M${q * 90},${shY - 10} C${q * 200},${shY - 60} ${q * 300},${shY - 40} ${q * (shX + 20)},${shY + 30}`} c={hi} w={18} o={0.5 * wet} b={6} />)}
        {[-1, 1].map((q) => <Crease key={q} d={`M${q * 60},${shY + 60} C${q * 160},${shY + 40} ${q * 260},${shY + 50} ${q * 330},${shY + 70}`} c={shd} w={12} o={0.5} />)}
        <Patch d={`M${-shX + 100},${P[1] - 330} C0,${P[1] - 230} ${shX - 100},${P[1] - 330} ${shX - 140},${P[1] + 40} L${-shX + 140},${P[1] + 40}Z`} c={shd2} o={0.55} b={24} />
        <Speck id={`${id}-sp`} d={torso} seed={8} n={260} col={dark(skin, 0.35)} op={0.3} r={2.4} box={[-shX - 60, shY - 100, 2 * shX + 120, P[1] - shY + 300]} />
      </Form>
      {arms.map((a, i) => { const q = i ? 1 : -1; const s0 = sh(q); return (
        <g key={i}>
          <Form id={`${id}-au${i}`} d={ribbonW(seg(s0, a.mid, 4) as P[], [240, 220, 190, 150, 124].map((w) => w * T), 6) + ' ' + ell(s0[0], s0[1], 160 * T, 136 * T)} c={skin} so={46} lo={30} ro={8} soft={12} tilt={0}><Crease d={sp([L2(s0, a.mid, 0.2), L2(s0, a.mid, 0.85)] as P[], false)} c={shd} w={26} o={0.45} /></Form>
          <Form id={`${id}-af${i}`} d={ribbonW(seg(L2(a.mid, s0, 0.06), a.end, 4) as P[], [136, 150, 124, 94, 84].map((w) => w * T), 6)} c={skin} so={40} lo={24} ro={8} soft={12} tilt={0}>
            <Crease d={sp([L2(a.mid, a.end, 0.12), L2(a.mid, a.end, 0.9)] as P[], false)} c={shd} w={20} o={0.45} />
            {c.veins && <path d={sp([L2(a.mid, a.end, 0.1), add(L2(a.mid, a.end, 0.5), [q * 10, 0]), L2(a.mid, a.end, 0.95)] as P[], false)} stroke="#566492" strokeWidth={4} fill="none" opacity={0.4} />}
            {bh > 0 && <Patch d={ribbonW([L2(a.mid, a.end, 0.5), a.end] as P[], [50, 90], 4)} c={BLOOD} o={bh * 0.75} b={6} />}
          </Form>
          <Patch d={ell(a.mid[0], a.mid[1], 44 * T, 36 * T)} c={lite(skin, 0.35)} o={0.6} b={3} />
          <g transform={`translate(${a.end[0]},${a.end[1]})`}><CHand id={`${id}-hd${i}`} c={c} skin={skin} rot={handRot(a)} f={f} curl={reach && q > 0 ? 0.1 : 0.5} blood={bh} seed={i * 2} k={1 + reach * 0.35 * (q > 0 ? 1 : 0)} /></g>
          {bh > 0 && <Drops at={tipOf(a.end, handRot(a), c, 1, 1)} f={f} n={2} len={480} k={1.5} seed={i} />}
        </g>); })}
      <g transform={`translate(0,${headY}) rotate(${hTilt})`}>
        <Form id={`${id}-nk`} d={sp([[-120, -230], [120, -230], [110, 10], [-110, 10]])} c={shd} so={20} lo={10} ro={4} soft={6} line={3}>{[-50, 0, 50].map((xx) => <Crease key={xx} d={`M${xx},-220 V0`} c={shd2} w={12} o={0.5} />)}</Form>
        <g transform="scale(0.92)"><CreatureFace c={c} f={f} jaw={jaw} blood={bm} uid={`${id}-fc`} noDefs /></g>
      </g>
    </g>
  );
  return (
    <g transform={`translate(${x},${y}) scale(${k})`}>
      {shadow ? <g filter="url(#cr-black)">{body}</g> : <Painted><ellipse cx={0} cy={0} rx={800} ry={70} fill="#06040a" opacity={0.45} />{body}</Painted>}
    </g>
  );
};

// ===== CREATURE FACE (front). Face centre (0,0); skull top about -320, chin about +345. jaw 0..1. blood = mouth/chin blood.
export const CreatureFace: React.FC<{ c: CreatureSpec; f?: number; jaw?: number; blood?: number; uid?: string; noDefs?: boolean; breath?: boolean }> = ({ c, f = 0, jaw = 0, blood = 0, uid, noDefs, breath = true }) => {
  const L = useLight();
  const id = uid || `cf-${c.id}`;
  const skin = c.skin, shd = shadeOf(skin, L, 1.1), shd2 = shadeOf(skin, L, 1.7), ln = lineOf(skin, L), hi = lite(skin, 0.55);
  const wet = c.wet ?? 0.5;
  const J = clamp(jaw + (breath ? 0.05 * Math.sin(f / 21) * jaw : 0));
  const mw = 150 * (c.jawW ?? 1);
  const head = sym([[0, -324], [104, -310], [176, -258], [212, -170], [210, -90], [228, -20], [222, 60], [200, 140], [172, 222], [122, 296], [58, 336], [0, 346]]);
  const my = 150, open = 170 * J;
  const lipTop = (x: number) => my - 18 * (1 - Math.pow(x / mw, 2));
  const lipBot = (x: number) => my + open * (1 - Math.pow(x / mw, 2) * 0.85) + 4;
  const mouth = `M${-mw},${my} C${-mw * 0.6},${my - 26} ${mw * 0.6},${my - 26} ${mw},${my} C${mw * 0.7},${my + open * 0.95 + 8} ${-mw * 0.7},${my + open * 0.95 + 8} ${-mw},${my}Z`;
  const nT = Math.round((c.teeth ?? 22) / 2);
  const inner = (
    <g>
      <defs><clipPath id={`${id}-mc`}><path d={mouth} /></clipPath><radialGradient id={`${id}-thr`} cx="0.5" cy="0.6" r="0.6"><stop offset="0" stopColor="#000" /><stop offset="0.55" stopColor="#2a0608" /><stop offset="1" stopColor="#6a1a1e" /></radialGradient></defs>
      <path d={mouth} fill={`url(#${id}-thr)`} />
      <g clipPath={`url(#${id}-mc)`}>
        <path d={`M${-mw},${my - 30} H${mw} V${my + 4} C${mw * 0.5},${my - 8} ${-mw * 0.5},${my - 8} ${-mw},${my + 4}Z`} fill="#5a1418" />
        {c.mouth === 'teeth' && <Teeth n={nT} x0={-mw * 0.94} x1={mw * 0.94} y={(x) => lipTop(x) + 6} dir={1} len={46 + open * 0.2} seed={3} />}
        {c.mouth === 'teeth' && J > 0.15 && <Teeth n={nT - 1} x0={-mw * 0.82} x1={mw * 0.82} y={(x) => lipBot(x) - 4} dir={-1} len={38 + open * 0.15} seed={9} c="#d4c8a8" />}
        {J > 0.25 && [-0.55, -0.12, 0.38].map((t, i) => <path key={i} d={`M${t * mw},${my + 12} Q${t * mw + 8},${my + open * 0.5 + Math.sin(f / 17 + i) * 8} ${t * mw + 3},${lipBot(t * mw) - 20}`} stroke="#ece4d4" strokeWidth={2.4} fill="none" opacity={0.6} />)}
      </g>
    </g>
  );
  return (
    <g>
      {!noDefs && <PaintDefs />}
      <Form id={`${id}-hd`} d={head} c={skin} so={46} lo={60} ro={12} soft={50} line={4.5} tilt={0.05}>
        <Patch d="M60,-330 C200,-300 240,-100 230,60 C220,200 160,320 40,350 L240,360 L240,-340Z" c={shd} o={0.55} b={50} />
        {/* temples sink in, cheekbones stand out */}
        {[-1, 1].map((q) => <g key={q}>
          <Patch d={`M${q * 150},-210 C${q * 210},-180 ${q * 214},-100 ${q * 196},-60 C${q * 170},-110 ${q * 150},-160 ${q * 150},-210Z`} c={shd2} o={0.55} b={12} />
          <Crease d={`M${q * 120},-4 C${q * 170},-14 ${q * 214},0 ${q * 226},30`} c={hi} w={14} o={0.5} b={6} />
          <Patch d={`M${q * 100},40 C${q * 170},40 ${q * 210},100 ${q * 196},180 C${q * 150},176 ${q * 112},120 ${q * 100},40Z`} c={shd} o={0.65} b={12} />
        </g>)}
        {/* the eyeless brow: skin stretched over shallow sockets, with fine folds */}
        {[-1, 1].map((q) => <g key={q}>
          <Patch d={`M${q * 26},-56 C${q * 54},-112 ${q * 150},-124 ${q * 196},-74 C${q * 184},-10 ${q * 92},12 ${q * 38},-8Z`} c={shd2} o={0.85} b={12} />
          <Patch d={`M${q * 40},-108 C${q * 100},-140 ${q * 170},-130 ${q * 206},-92 C${q * 160},-104 ${q * 100},-110 ${q * 40},-96Z`} c={shd2} o={0.7} b={3} />
          {[0, 1].map((i) => <Crease key={i} d={`M${q * (176 + i * 10)},${-40 + i * 18} l${q * 26},${6 + i * 10}`} c={ln} w={2.4} o={0.4} b={3} />)}
          <Crease d={`M${q * 60},${-4} C${q * 100},${10} ${q * 150},${8} ${q * 186},${-14}`} c={hi} w={8} o={0.45} b={3} />
          <Crease d={`M${q * 40},-106 C${q * 96},-136 ${q * 160},-128 ${q * 200},-90`} c={hi} w={14} o={0.55 * wet} b={6} />
          <ellipse cx={q * 112} cy={-72} rx={30} ry={9} fill={hi} opacity={0.3 * wet} />
        </g>)}
        {c.eyes === 'black' && [-1, 1].map((q) => <ellipse key={q} cx={q * 110} cy={-56} rx={46} ry={34} fill="#040205" />)}
        {c.eyes === 'hollow' && [-1, 1].map((q) => <ellipse key={q} cx={q * 110} cy={-56} rx={44} ry={36} fill="#0e0606" />)}
        {/* no nose bridge: two slits in a flat plate */}
        <Patch d="M-46,0 C-24,-20 24,-20 46,0 L34,74 L-34,74Z" c={shd} o={0.45} b={6} />
        <Crease d="M-6,-60 C-10,-20 -8,20 -12,50" c={hi} w={8} o={0.4} b={3} />
        {[-1, 1].map((q) => <path key={q} d={`M${q * 16},40 q${q * 9},16 ${q * 4},36`} stroke="#140808" strokeWidth={6} fill="none" strokeLinecap="round" />)}
        {/* jaw muscles, mouth corners pulled far back */}
        {[-1, 1].map((q) => <Crease key={q} d={`M${q * (mw + 24)},${my - 20} C${q * (mw + 40)},${my + 40} ${q * (mw + 22)},${my + 100} ${q * (mw - 6)},${my + 140}`} c={shd2} w={12} o={0.5} />)}
        {c.veins && [-1, 1].map((q) => <path key={q} d={`M${q * 196},-160 C${q * 170},-130 ${q * 186},-100 ${q * 160},-70 C${q * 140},-50 ${q * 150},-20 ${q * 130},0 M${q * 186},-118 C${q * 210},-86 ${q * 200},-46 ${q * 214},-6 M${q * 60},-280 C${q * 80},-240 ${q * 70},-210 ${q * 96},-180`} stroke="#566492" strokeWidth={3.2} fill="none" opacity={0.45} />)}
        <Crease d="M-120,-210 C-60,-236 60,-236 120,-210" c={ln} w={3} o={0.3} b={3} />
        <Crease d="M-100,-262 C-40,-292 60,-292 116,-258" c={hi} w={26} o={0.45 * wet} b={12} />
        <Speck id={`${id}-sp`} d={head} seed={3} n={320} col={dark(skin, 0.35)} op={0.32} r={2.3} box={[-230, -330, 460, 680]} />
        <Patch d={`M-150,${my + 70} C-80,${my + 200} 80,${my + 200} 150,${my + 70} L150,360 L-150,360Z`} c={shd} o={0.45} b={24} />
        <ellipse cx={-56} cy={-252} rx={46} ry={12} fill="#fff8ec" opacity={0.4 * wet} transform="rotate(-10 -56 -252)" />
        <ellipse cx={-160} cy={8} rx={16} ry={7} fill="#fff8ec" opacity={0.45 * wet} />
        <ellipse cx={-20} cy={20} rx={12} ry={6} fill="#fff8ec" opacity={0.4 * wet} />
        <ellipse cx={-40} cy={300} rx={30} ry={8} fill="#fff8ec" opacity={0.3 * wet} />
      </Form>
      {c.eyes === 'glow' && [-1, 1].map((q) => <g key={q}><circle cx={q * 110} cy={-56} r={26} fill={c.eyeC || '#f2e9b0'} /><circle cx={q * 110} cy={-56} r={70} fill={c.eyeC || '#f2e9b0'} opacity={0.16} /></g>)}
      {J > 0.02 ? inner : <path d={`M${-mw},${my} C${-mw * 0.5},${my + 8} ${mw * 0.5},${my + 8} ${mw},${my}`} stroke="#1a0808" strokeWidth={7} fill="none" strokeLinecap="round" />}
      <path d={`M${-mw - 6},${my} C${-mw * 0.6},${my - 30} ${mw * 0.6},${my - 30} ${mw + 6},${my}`} stroke={dark(skin, 0.4)} strokeWidth={7} fill="none" opacity={0.85} />
      {J > 0.02 && <path d={`M${-mw},${my} C${-mw * 0.7},${my + open * 0.95 + 8} ${mw * 0.7},${my + open * 0.95 + 8} ${mw},${my}`} stroke={dark(skin, 0.4)} strokeWidth={6} fill="none" opacity={0.8} />}
      {[-1, 1].map((q) => <path key={q} d={`M${q * (mw + 4)},${my} q${q * 14},-6 ${q * 22},-22 M${q * (mw + 4)},${my} q${q * 16},6 ${q * 20},20`} stroke={ln} strokeWidth={3} fill="none" opacity={0.6} />)}
      {blood > 0 && <g opacity={blood}>
        <Patch d={`M${-mw * 0.9},${my - 10} C${-mw * 0.3},${my - 40} ${mw * 0.4},${my - 34} ${mw * 0.95},${my - 6} C${mw * 0.7},${my + 30} ${-mw * 0.6},${my + 30} ${-mw * 0.9},${my - 10}Z`} c={BLOOD} o={0.85} b={3} />
        <path d={`M${-mw * 0.3},${lipBot(-mw * 0.3)} q-4,60 4,120 q8,-50 6,-120Z M${mw * 0.35},${lipBot(mw * 0.35) - 4} q-3,40 3,84 q6,-36 4,-84Z M${-mw * 0.7},${my + 10} q-6,50 2,96 q6,-40 4,-96Z`} fill={BLOOD} />
        <Drops at={[-mw * 0.28, lipBot(-mw * 0.3) + 118]} f={f} n={2} len={300} k={1.3} />
      </g>}
      {c.hair === 'stringy' && [-170, -120, -60, 0, 70, 130, 180].map((xx, i) => <path key={i} d={`M${xx * 0.8},-310 C${xx * 1.1},-160 ${xx * 1.2},40 ${xx * 1.25 + Math.sin(f / 30 + i) * 10},${260 + (i % 3) * 40}`} stroke={c.hairC || '#141216'} strokeWidth={10} fill="none" opacity={0.92} />)}
    </g>
  );
};

// ===== CREATURE BUST: face close-up WITH neck, collarbones, shoulders and upper ribs (never a floating head).
// Face centre at (0,0) like CreatureFace; the body continues below the frame edge.
export const CreatureBust: React.FC<{ c: CreatureSpec; f?: number; jaw?: number; blood?: { hands?: number; mouth?: number; body?: number }; uid?: string; tilt?: number; hand?: boolean }> = ({ c, f = 0, jaw = 0, blood = {}, uid, tilt = 0, hand = false }) => {
  const L = useLight(); const id = uid || `cb-${c.id}`;
  const skin = c.skin, shd = shadeOf(skin, L, 1.2), shd2 = shadeOf(skin, L, 1.7), ln = lineOf(skin, L), hi = lite(skin, 0.5), wet = c.wet ?? 0.5;
  const br = Math.sin(f / 38) * 10;
  const tl = tilt + Math.sin(f / 53) * 4;
  const chest = sym([[0, 230], [110, 214], [260, 252 + br], [410, 310 + br], [520, 372], [566, 450], [556, 620], [540, 900], [536, 1400], [0, 1400]]);
  return (
    <g>
      <PaintDefs />
      <Painted>
        <Form id={`${id}-ch`} d={chest} c={skin} so={160} lo={90} ro={14} soft={24} line={4.5}>
          {[-1, 1].map((q) => <g key={q}>
            <Crease d={`M${q * 60},${330 + br} C${q * 200},${300 + br} ${q * 380},${330 + br} ${q * 540},${420}`} c={hi} w={20} o={0.6 * wet} b={6} />
            <Crease d={`M${q * 60},${350 + br} C${q * 200},${320 + br} ${q * 380},${352 + br} ${q * 540},${442}`} c={shd} w={12} o={0.6} />
            {Array.from({ length: 5 }).map((_, i) => <Crease key={i} d={`M${q * 60},${520 + i * 110} C${q * 200},${490 + i * 110} ${q * 400},${540 + i * 104} ${q * 580},${640 + i * 96}`} c={shd} w={22} o={0.55} />)}
            {Array.from({ length: 5 }).map((_, i) => <Crease key={'h' + i} d={`M${q * 64},${500 + i * 110} C${q * 200},${470 + i * 110} ${q * 400},${520 + i * 104} ${q * 576},${618 + i * 96}`} c={hi} w={8} o={0.4 * wet} b={3} />)}
            <Patch d={`M${q * 480},380 C${q * 580},480 ${q * 620},700 ${q * 620},900 L${q * 460},900Z`} c={shd2} o={0.5} b={24} />
            <Crease d={`M${q * 400},520 C${q * 420},700 ${q * 430},1000 ${q * 440},1400`} c={shd2} w={26} o={0.75} />
            <Crease d={`M${q * 380},520 C${q * 396},700 ${q * 406},1000 ${q * 414},1400`} c={hi} w={6} o={0.35 * wet} b={3} />
            <ellipse cx={q * 500} cy={400} rx={70} ry={44} fill={hi} opacity={0.35 * wet} transform={`rotate(${q * 30} ${q * 500} 400)`} />
          </g>)}
          <Crease d="M0,380 V1400" c={shd2} w={34} o={0.5} />
          {c.veins && <path d="M-300,620 C-260,700 -280,800 -240,900 M260,560 C300,660 280,760 330,860" stroke="#566492" strokeWidth={5} fill="none" opacity={0.35} />}
          <Speck id={`${id}-csp`} d={chest} seed={6} n={300} col={dark(skin, 0.35)} op={0.3} r={2.6} box={[-620, 220, 1240, 1180]} />
          {(blood.body ?? 0) > 0 && <Patch d="M-260,520 C-120,480 80,520 160,640 C120,860 -60,980 -240,900 C-320,760 -320,600 -260,520Z" c={BLOOD} o={(blood.body ?? 0) * 0.8} b={12} />}
          {(blood.mouth ?? 0) > 0 && <path d="M-60,260 q-10,140 0,300 q16,-160 10,-300Z M40,280 q-6,90 4,200 q10,-110 6,-200Z" fill={BLOOD} opacity={blood.mouth} />}
        </Form>
        <g transform={`rotate(${tl} 0 300)`}>
          <Form id={`${id}-nk`} d={sp([[-130, 100], [130, 100], [160, 240], [250, 330, 0.5], [-250, 330, 0.5], [-160, 240]])} c={skin} so={60} lo={30} ro={8} soft={12} line={4}>
            {[-90, -30, 40, 100].map((xx, i) => <Crease key={i} d={`M${xx},130 C${xx * 1.1},230 ${xx * 1.3},290 ${xx * 1.5},330`} c={i % 2 ? hi : shd2} w={i % 2 ? 8 : 18} o={0.5} b={3} />)}
          </Form>
          <CreatureFace c={c} f={f} jaw={jaw} blood={blood.mouth ?? 0} uid={`${id}-fc`} noDefs />
        </g>
        {hand && <g transform="translate(560,900) rotate(150)"><CHand id={`${id}-hand`} c={c} skin={skin} rot={0} f={f} curl={0.25} blood={blood.hands ?? 0} k={1.6} /></g>}
      </Painted>
    </g>
  );
};
// black silhouette filter for cast shadows on walls: <svg><CreatureShadowDefs/> ... <Creature shadow .../>
export const CreatureShadowDefs: React.FC<{ blur?: number }> = ({ blur = 6 }) => (
  <defs><filter id="cr-black" x="-20%" y="-20%" width="140%" height="140%"><feColorMatrix type="matrix" values="0 0 0 0 0.01  0 0 0 0 0.01  0 0 0 0 0.02  0 0 0 0.92 0" /><feGaussianBlur stdDeviation={blur} /></filter></defs>
);
export const CreatureHand = CHand;
