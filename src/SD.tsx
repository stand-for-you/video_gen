import React from 'react';
import { TERENCE } from './CastExtra';
import { INK, Hand, Hatch, rng } from './Kit';
import { FullMan, NOAH } from './Body';
import { FullPerson, FacePerson, CAST, HairBack, HairFront } from './Cast';
import type { Spec } from './Cast';
import { FaceNoah } from './Faces';
import { sf, taper, furry } from './Beast';
import { R, Glow } from './IH';
// ===== Kit (k) "Smile Dog": early-internet era (1992 Chicago bulletin board room, 2005 teen bedroom, 2007 Chicago apartment, 2008 college dorm).
// Palette: plum-brown darkness + cold CRT cyan/green glow; ONE red accent = the red floppy-disk label / the red unread-mail badge.
// NO flashing effects anywhere (safe for light-sensitive viewers). The "camera flash" in the picture is a still pool of hard light.
export const Q = {
  dk: '#1d1519', dk2: '#2b2026', dk3: '#3a2c33', panel: '#4a3a30', panelD: '#33271f', carpet: '#5a4434', beige: '#c8bea4', beigeD: '#9a9078', beigeL: '#ddd4bc',
  crt: '#06140f', phos: '#7ff0a8', cyan: '#8fe0d8', flash: '#f4f6ff', red: '#d42a22', redD: '#8e1c18', paper: '#e8e2d0', manila: '#c9a96a', manilaD: '#a08450',
  block: '#6a6e72', blockD: '#54585c', wood: '#5a4232', woodD: '#3a2a20', wall07: '#7a6e60', wall07D: '#5a5046',
  dogDk: '#2a2c30', dogGr: '#6a6e74', dogW: '#e8e6e0', dogWD: '#b8b6b0', eye: '#a8d8f0', gum: '#4a3640', tooth: '#f6f4ec',
};
// ---------- people (permanent cast drawing; renamed in narration only)
export const MARY: Spec = { ...CAST.mira, id: 'mary', name: 'MARY E. (Mira drawing)', top: 'cardigan', topC: '#6a5560', topD: '#46383f', acc: [] } as Spec;
export { TERENCE };
// ALIVE: every person breathes / sways / walks with the scene (no statues). mode: idle | walk | shake
export const Alive: React.FC<{ x: number; y: number; f: number; mode?: string; k?: number; children: React.ReactNode }> = ({ x, y, f, mode = 'idle', k = 1, children }) => {
  const t = sf(f, 3);
  let rot = Math.sin(t / 22) * 0.7, sy = 1 + Math.sin(t / 14) * 0.006, dy = 0, dx = 0;
  if (mode === 'walk') { rot = Math.sin(t / 5) * 2.2; dy = -Math.abs(Math.sin(t / 5)) * 14 * k; dx = t * 2.2 * k; }
  if (mode === 'shake') { rot = Math.sin(t * 1.3) * 0.8; sy = 1 + Math.sin(t / 6) * 0.01; }
  if (mode === 'lean') { rot = 4 + Math.sin(t / 22) * 0.6; }
  return <g transform={`translate(${x + dx},${y + dy}) rotate(${rot}) scale(1,${sy}) translate(${-x},${-y})`}>{children}</g>;
};
export const Noah: React.FC<{ x: number; y: number; s: number; f: number; view?: 'front' | 'three' | 'back'; expr?: string; mode?: string; note?: boolean; phone?: boolean }> = ({ x, y, s, f, view = 'front', expr = 'neutral', mode = 'idle', note = false }) => (
  <Alive x={x} y={y} f={f} mode={mode} k={s}>
    <FullMan look={NOAH} view={view} x={x} y={y} s={s} f={f} expr={expr} />
    {note && <g transform={`translate(${x},${y}) scale(${s})`}>
      <g transform="translate(-300,-1640) rotate(-12)"><rect x={-150} y={-200} width={300} height={220} fill={Q.paper} stroke={INK} strokeWidth={9} />{[0, 1, 2, 3].map((i) => <path key={i} d={`M-120,${-150 + i * 44} h${200 - (i % 2) * 60}`} stroke="#5a5a7a" strokeWidth={6} />)}<rect x={-150} y={-214} width={300} height={28} fill="#2a3a5a" stroke={INK} strokeWidth={6} /></g>
      <g transform={`translate(${300 + Math.sin(sf(f, 3) / 3) * 20},-1600) rotate(-30)`}><rect x={-12} y={-180} width={24} height={200} fill="#2a3a5a" stroke={INK} strokeWidth={5} /></g>
    </g>}
  </Alive>
);
export const Person: React.FC<{ s: Spec; x: number; y: number; k: number; f: number; expr?: string; mode?: string }> = ({ s, x, y, k, f, expr = 'neutral', mode = 'idle' }) => (
  <Alive x={x} y={y} f={f} mode={mode} k={k}><FullPerson s={s} x={x} y={y} k={k} f={f} expr={expr} /></Alive>
);
export const Face: React.FC<{ who: 'noah' | 'mary' | 'terence'; x: number; y: number; k: number; f: number; expr?: string; rot?: number; tears?: boolean; turn?: number; glow?: string }> = ({ who, x, y, k, f, expr = 'neutral', rot = 0, tears = false, turn = 0, glow }) => {
  const b = Math.sin(sf(f, 3) / 14) * 4;
  return (<g transform={`translate(${x},${y + b}) rotate(${rot + Math.sin(sf(f, 3) / 24) * 0.8}) scale(${k})`}>
    <Shoulders c={who === 'noah' ? NOAH.robe : who === 'mary' ? MARY.topC : TERENCE.topC} d={who === 'noah' ? NOAH.robeDark : who === 'mary' ? MARY.topD : TERENCE.topD} skin={who === 'noah' ? NOAH.skin : who === 'mary' ? MARY.skin : TERENCE.skin} inner={who === 'terence' ? TERENCE.inner : undefined} />
    {who === 'noah' ? <FaceNoah expr={expr as any} f={f} turn={turn} /> : <g><HairBack s={who === 'mary' ? MARY : TERENCE} /><FacePerson s={who === 'mary' ? MARY : TERENCE} expr={expr} f={f} /><HairFront s={who === 'mary' ? MARY : TERENCE} /></g>}
    {tears && [-1, 1].map((q) => <path key={q} d={`M${q * 70},${20} q${q * 6},60 ${q * 2},${110 + ((sf(f, 3) * 3) % 40)}`} stroke="#c8e0f0" strokeWidth={9} fill="none" opacity={0.8} strokeLinecap="round" />)}
    {glow && <path d="M0,-225 C105,-230 158,-130 152,-20 C148,90 120,160 70,205 C40,228 -40,228 -70,205 C-120,160 -148,90 -152,-20 C-158,-130 -105,-230 0,-225Z" fill={glow} opacity={0.16} />}
  </g>);
};
// neck + shoulders under a close-up face (no floating heads)
export const Shoulders: React.FC<{ c: string; d: string; skin: string; inner?: string }> = ({ c, d, skin, inner }) => (<g>
  <path d="M-70,170 L-76,300 C-30,330 30,330 76,300 L70,170Z" fill={skin} stroke={INK} strokeWidth={7} />
  <path d="M-76,260 C-180,280 -330,320 -380,420 L-420,900 H420 L380,420 C330,320 180,280 76,260 C40,300 -40,300 -76,260Z" fill={c} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
  <path d="M120,290 C260,320 360,380 380,460 L420,900 H200 C230,700 220,480 120,290Z" fill={d} opacity={0.7} />
  {inner ? <path d="M-76,262 L0,380 L76,262 C40,300 -40,300 -76,262Z" fill={inner} stroke={INK} strokeWidth={6} /> : <path d="M-90,262 L-20,400 L-40,270Z M90,262 L20,400 L40,270Z" fill={d} stroke={INK} strokeWidth={6} />}
</g>);
// ---------- THE GRINNING DOG (original design; husky-like, human teeth grin). Head: origin = centre of the face, about 820 wide.
export const DogHead: React.FC<{ f?: number; grin?: number; eyes?: number }> = ({ f = 0, grin = 1, eyes = 1 }) => {
  const q = rng(7); const tw = Math.sin(sf(f, 3) / 18) * 3;
  const ear = (s: number) => (<g transform={`scale(${s},1) rotate(${tw * s})`}>
    <path d="M120,-250 L250,-560 C270,-520 330,-330 340,-170Z" fill={Q.dogDk} stroke={INK} strokeWidth={9} strokeLinejoin="round" />
    <path d="M165,-270 L248,-470 C262,-420 300,-310 300,-200Z" fill="#8e8288" opacity={0.85} />
    <path d={furry([[150, -260], [250, -470], [300, -210]], 14, 11, 2)} fill="none" stroke="#c8c4c0" strokeWidth={3} opacity={0.5} />
  </g>);
  return (
    <g>
      {ear(1)}{ear(-1)}
      {/* cheek ruff + skull */}
      <path d={furry([[0, -300], [200, -270], [330, -120], [380, 60], [330, 230], [180, 330], [0, 360], [-180, 330], [-330, 230], [-380, 60], [-330, -120], [-200, -270]], 26, 3, 2)} fill={Q.dogGr} stroke={INK} strokeWidth={9} strokeLinejoin="round" />
      {/* white mask */}
      <path d="M0,-150 C70,-150 110,-120 170,-60 C240,-10 300,60 300,160 C290,260 180,330 0,340 C-180,330 -290,260 -300,160 C-300,60 -240,-10 -170,-60 C-110,-120 -70,-150 0,-150Z" fill={Q.dogW} />
      {/* dark cap: widow's peak down to the nose bridge */}
      <path d="M-210,-250 C-120,-300 120,-300 210,-250 C200,-170 120,-120 40,-110 L18,40 L-18,40 L-40,-110 C-120,-120 -200,-170 -210,-250Z" fill={Q.dogDk} />
      {/* white brow spots */}
      {[-1, 1].map((s) => <ellipse key={s} cx={s * 110} cy={-150} rx={46} ry={26} fill={Q.dogW} transform={`rotate(${s * -14} ${s * 110} -150)`} />)}
      {/* eyes: ice-pale, tiny pupils, dark rims */}
      {[-1, 1].map((s) => <g key={s} transform={`translate(${s * 120},-62)`}>
        <path d="M-62,4 C-40,-34 40,-38 64,-6 C40,26 -40,30 -62,4Z" fill="#141216" />
        <path d="M-50,2 C-30,-24 30,-28 52,-6 C30,16 -30,20 -50,2Z" fill={Q.eye} />
        <circle cx={s * 6} cy={-4} r={7 * eyes} fill="#050405" />
        <circle cx={s * 6 - 14} cy={-12} r={6} fill="#ffffff" />
        <circle cx={0} cy={-4} r={60} fill={Q.eye} opacity={0.08} />
      </g>)}
      {/* muzzle */}
      <path d="M0,-30 C60,-30 110,40 140,130 C150,170 120,200 80,206 L-80,206 C-120,200 -150,170 -140,130 C-110,40 -60,-30 0,-30Z" fill={Q.dogW} stroke={INK} strokeWidth={6} strokeOpacity={0.4} />
      <path d="M40,-30 C90,10 130,80 140,130 C120,110 90,60 30,10Z" fill={Q.dogWD} opacity={0.7} />
      {/* nose */}
      <path d="M-56,96 C-56,66 56,66 56,96 C56,124 20,148 0,150 C-20,148 -56,124 -56,96Z" fill="#0c0a0c" stroke={INK} strokeWidth={6} />
      <ellipse cx={-14} cy={86} rx={18} ry={9} fill="#ffffff" opacity={0.6} />
      <path d="M0,150 V186" stroke={INK} strokeWidth={6} />
      {/* THE GRIN: split far back into the cheeks, two rows of straight human teeth */}
      {grin > 0 && (() => {
        const W = 250 * (0.85 + 0.15 * grin), y0 = 196, up = 70 * grin;
        const outer = `M${-W},${y0 - up} C${-W * 0.7},${y0 + 40} ${-W * 0.35},${y0 + 70} 0,${y0 + 74} C${W * 0.35},${y0 + 70} ${W * 0.7},${y0 + 40} ${W},${y0 - up} C${W * 0.72},${y0 + 110} ${W * 0.38},${y0 + 150} 0,${y0 + 156} C${-W * 0.38},${y0 + 150} ${-W * 0.72},${y0 + 110} ${-W},${y0 - up}Z`;
        const n = 12;
        return (<g>
          <path d={outer} fill={Q.gum} stroke={INK} strokeWidth={9} strokeLinejoin="round" />
          <clipPath id="dgclip"><path d={outer} /></clipPath>
          <g clipPath="url(#dgclip)">
            <path d={`M${-W},${y0 + 104} H${W} V${y0 + 116} H${-W}Z`} fill="#140c10" />
            {Array.from({ length: n }).map((_, i) => { const t = (i + 0.5) / n - 0.5; const x = t * 2 * W * 0.92; const yy = y0 + 70 - Math.pow(Math.abs(t) * 2, 2) * (up + 30); const w = (2 * W * 0.92) / n - 6; const h = 40 - Math.abs(t) * 20; return <rect key={'u' + i} x={x - w / 2} y={yy} width={w} height={h + 12} rx={6} fill={Q.tooth} stroke="#6a6266" strokeWidth={3} />; })}
            {Array.from({ length: n - 1 }).map((_, i) => { const t = (i + 0.5) / (n - 1) - 0.5; const x = t * 2 * W * 0.86; const yy = y0 + 116 - Math.pow(Math.abs(t) * 2, 2) * (up - 10); const w = (2 * W * 0.86) / (n - 1) - 6; const h = 34 - Math.abs(t) * 16; return <rect key={'l' + i} x={x - w / 2} y={yy} width={w} height={h} rx={6} fill="#ebe8de" stroke="#6a6266" strokeWidth={3} />; })}
          </g>
          <path d={`M${-W},${y0 - up} q-30,-20 -40,-56 M${W},${y0 - up} q30,-20 40,-56`} stroke={INK} strokeWidth={7} fill="none" />
        </g>);
      })()}
      {/* fur hatching + right-side shade */}
      <Hatch x={-360} y={-260} w={720} h={560} angle={-62} gap={22} seed={13} sw={2.4} op={0.22} />
      <path d="M180,-250 C320,-120 380,60 330,230 C280,300 200,330 120,340 C230,240 260,40 180,-250Z" fill="#000" opacity={0.22} />
      {Array.from({ length: 16 }).map((_, i) => { const a = q() * 6.28, r = 300 + q() * 60; return <path key={i} d={`M${Math.cos(a) * r},${Math.sin(a) * r} l${Math.cos(a) * 30},${Math.sin(a) * 30}`} stroke={Q.dogWD} strokeWidth={4} opacity={0.5} />; })}
    </g>
  );
};
// sitting dog, three-quarter front. origin = between the front paws on the floor. About 2300 tall.
export const DogSit: React.FC<{ x: number; y: number; s: number; f?: number; grin?: number; tilt?: number }> = ({ x, y, s, f = 0, grin = 1, tilt = 0 }) => {
  const br = Math.sin(sf(f, 3) / 12) * 8; const tl = Math.sin(sf(f, 3) / 16) * 30;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <ellipse cx={60} cy={10} rx={620} ry={60} fill="#000" opacity={0.4} />
      {/* tail curled to the side */}
      <path d={taper([[-380, -260], [-640, -200 + tl * 0.3], [-700, -40], [-520, 20]], 210, 90, 30, 4)} fill={Q.dogGr} stroke={INK} strokeWidth={9} strokeLinejoin="round" />
      {/* haunch + back */}
      <path d={furry([[-480, -40], [-560, -520], [-380, -1100], [-60, -1500], [220, -1460], [300, -900], [240, -300], [80, -20]], 30, 5, 2)} fill={Q.dogGr} stroke={INK} strokeWidth={9} strokeLinejoin="round" />
      <path d="M-560,-520 C-520,-760 -420,-1000 -260,-1260 C-300,-900 -360,-600 -400,-200Z" fill="#000" opacity={0.18} />
      {/* white chest ruff */}
      <path d={furry([[-160, -1420], [180, -1440], [300, -1000], [220, -500], [0, -360], [-220, -520], [-280, -1000]], 34, 9, 2)} fill={Q.dogW} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
      {/* front legs */}
      {[-120, 140].map((lx, i) => <g key={i}><path d={taper([[lx, -760], [lx + 8, -380], [lx + 4, -50]], 210, 160, 16, 3 + i)} fill={Q.dogW} stroke={INK} strokeWidth={8} /><path d={`M${lx - 80},-10 C${lx - 90},-90 ${lx + 90},-90 ${lx + 90},-10Z`} fill={Q.dogW} stroke={INK} strokeWidth={8} />{[-40, 0, 40].map((t) => <path key={t} d={`M${lx + t},-10 v-30`} stroke={INK} strokeWidth={5} />)}</g>)}
      <Hatch x={-560} y={-1400} w={800} h={1300} angle={-60} gap={24} seed={9} sw={2.6} op={0.25} />
      <g transform={`translate(30,${-1500 + br}) rotate(${tilt + Math.sin(sf(f, 3) / 30) * 3}) scale(1.05)`}><DogHead f={f} grin={grin} /></g>
    </g>
  );
};
// the pale beckoning hand from the darkness (index finger slowly curls)
export const Beckon: React.FC<{ x: number; y: number; s: number; f: number; rot?: number }> = ({ x, y, s, f, rot = 72 }) => {
  const c = 0.5 + 0.5 * Math.sin(sf(f, 3) / 9);
  return <Hand x={x} y={y} s={s} rot={rot} skin="#d8d4cc" shade="#8a867e" sleeve="#0b090b" sleeveLen={900} ext={[0.35 + 0.6 * c, 0.45, 0.4, 0.35]} thumb={0.4} long />;
};
// the picture itself: dark room, flash pool, the dog, the hand. W x H canvas.
export const Picture: React.FC<{ W: number; H: number; f: number; dx?: number; dy?: number; ds?: number; hand?: boolean; grin?: number; hy?: number }> = ({ W, H, f, dx, dy, ds, hand = true, grin = 1, hy }) => (
  <g>
    <rect x={-600} y={-600} width={W + 1200} height={H + 1200} fill="#0a0709" />
    <rect x={-600} y={H * 0.72} width={W + 1200} height={H} fill="#140e10" />
    <path d={`M${W * 0.2},${H * 0.72} L${W * 0.86},${H * 0.72}`} stroke="#241a1e" strokeWidth={10} />
    <rect x={W * 0.62} y={H * 0.06} width={W * 0.16} height={H * 0.5} fill="#120c0e" stroke="#20161a" strokeWidth={8} />
    <Glow x={(dx ?? W * 0.56)} y={H * 0.48} r={W * 0.42} ry={H * 0.55} c={Q.flash} op={0.42} />
    <g opacity={0.35}><DogSitShadow x={(dx ?? W * 0.56) + W * 0.06} y={dy ?? H * 0.86} s={(ds ?? H / 2600) * 1.05} f={f} /></g>
    <DogSit x={dx ?? W * 0.56} y={dy ?? H * 0.86} s={ds ?? H / 2600} f={f} grin={grin} />
    {hand && <Beckon x={W * 0.13} y={hy ?? H * 0.56} s={H / 900} f={f} />}
    <rect x={-600} y={-600} width={W + 1200} height={H + 1200} fill="#2a1418" opacity={0.12} />
  </g>
);
const DogSitShadow: React.FC<{ x: number; y: number; s: number; f: number }> = ({ x, y, s, f }) => (<g><defs><filter id="dsh"><feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" /><feGaussianBlur stdDeviation="8" /></filter></defs><g filter="url(#dsh)"><DogSit x={x} y={y} s={s} f={f} /></g></g>);
// ---------- retro computers and objects
export const CRT: React.FC<{ x: number; y: number; s?: number; children?: React.ReactNode; id?: string; back?: boolean }> = ({ x, y, s = 1, children, id = 'crt', back = false }) => back ? (
  <g transform={`translate(${x},${y}) scale(${s})`}><path d="M-300,-560 H300 L340,-40 H-340Z" fill={Q.beigeD} stroke={INK} strokeWidth={9} /><path d="M-200,-480 H200 L230,-120 H-230Z" fill={Q.beige} stroke={INK} strokeWidth={6} />{Array.from({ length: 6 }).map((_, i) => <path key={i} d={`M-150,${-420 + i * 50} h300`} stroke={INK} strokeWidth={6} opacity={0.5} />)}<rect x={-360} y={-40} width={720} height={40} fill={Q.beigeD} stroke={INK} strokeWidth={8} /></g>
) : (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-360} y={-620} width={720} height={580} rx={40} fill={Q.beige} stroke={INK} strokeWidth={9} />
    <rect x={-300} y={-570} width={600} height={440} rx={50} fill="#2a2a26" stroke={INK} strokeWidth={7} />
    <defs><clipPath id={id}><rect x={-276} y={-548} width={552} height={396} rx={44} /></clipPath></defs>
    <rect x={-276} y={-548} width={552} height={396} rx={44} fill={Q.crt} />
    <g clipPath={`url(#${id})`}><g transform="translate(-276,-548)">{children}</g>
      {Array.from({ length: 50 }).map((_, i) => <rect key={i} x={-280} y={-550 + i * 8} width={560} height={3} fill="#000" opacity={0.18} />)}
      <path d="M-276,-548 L-80,-548 L-276,-300Z" fill="#ffffff" opacity={0.06} />
    </g>
    <rect x={-276} y={-548} width={552} height={396} rx={44} fill="none" stroke="#000" strokeWidth={14} opacity={0.5} />
    <circle cx={290} cy={-80} r={10} fill="#4ade80" /><rect x={-80} y={-100} width={160} height={30} rx={6} fill={Q.beigeD} />
    <path d="M-200,-40 L-240,0 H240 L200,-40Z" fill={Q.beigeD} stroke={INK} strokeWidth={8} />
  </g>
);
export const Tower: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (<g transform={`translate(${x},${y}) scale(${s})`}><rect x={-140} y={-620} width={280} height={620} fill={Q.beige} stroke={INK} strokeWidth={8} /><rect x={-110} y={-580} width={220} height={60} fill={Q.beigeD} stroke={INK} strokeWidth={5} /><rect x={-110} y={-500} width={220} height={60} fill={Q.beigeD} stroke={INK} strokeWidth={5} /><rect x={-90} y={-410} width={180} height={18} rx={4} fill="#2a2a26" /><circle cx={70} cy={-100} r={18} fill={Q.beigeL} stroke={INK} strokeWidth={5} /><circle cx={-60} cy={-100} r={7} fill="#4ade80" />{Array.from({ length: 5 }).map((_, i) => <path key={i} d={`M-100,${-300 + i * 30} h200`} stroke={INK} strokeWidth={4} opacity={0.4} />)}</g>);
export const Keyboard: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (<g transform={`translate(${x},${y}) scale(${s})`}><path d="M-400,0 L-380,-90 H380 L400,0Z" fill={Q.beige} stroke={INK} strokeWidth={8} />{Array.from({ length: 4 }).map((_, r) => Array.from({ length: 16 }).map((_, c) => <rect key={r + '-' + c} x={-360 + c * 45 + r * 4} y={-80 + r * 18} width={38} height={14} rx={3} fill={Q.beigeL} stroke={INK} strokeWidth={2} />))}</g>);
export const Modem: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (<g transform={`translate(${x},${y}) scale(${s})`}><rect x={-160} y={-70} width={320} height={70} rx={10} fill="#3a3a40" stroke={INK} strokeWidth={7} />{[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={-110 + i * 40} cy={-35} r={9} fill={i % 3 === 0 ? '#ffb43a' : '#4ade80'} opacity={0.9} />)}</g>);
export const DeskPhone: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (<g transform={`translate(${x},${y}) scale(${s})`}><path d="M-150,0 L-120,-120 H120 L150,0Z" fill={Q.beigeD} stroke={INK} strokeWidth={7} /><path d="M-170,-130 C-170,-190 170,-190 170,-130 L130,-110 C100,-150 -100,-150 -130,-110Z" fill={Q.beige} stroke={INK} strokeWidth={7} />{Array.from({ length: 9 }).map((_, i) => <rect key={i} x={-60 + (i % 3) * 44} y={-100 + Math.floor(i / 3) * 28} width={34} height={20} rx={4} fill={Q.beigeL} stroke={INK} strokeWidth={2} />)}<path d="M150,-40 q40,20 20,60 q-20,40 20,60 q40,20 20,60" stroke={INK} strokeWidth={6} fill="none" /></g>);
export const Floppy: React.FC<{ x: number; y: number; s?: number; rot?: number; label?: string; glow?: boolean }> = ({ x, y, s = 1, rot = 0, label = '', glow = false }) => (<g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
  {glow && <Glow x={0} y={0} r={420} c="#ff4a3a" op={0.35} />}
  <path d="M-180,-180 H150 L180,-150 V180 H-180Z" fill="#2a3038" stroke={INK} strokeWidth={9} strokeLinejoin="round" />
  <rect x={-90} y={-180} width={200} height={110} fill="#a8aeb4" stroke={INK} strokeWidth={6} /><rect x={30} y={-165} width={44} height={80} fill="#2a3038" />
  <rect x={-140} y={-20} width={280} height={190} fill={Q.paper} stroke={INK} strokeWidth={6} />
  <rect x={-140} y={-20} width={280} height={34} fill={Q.red} />
  {[0, 1, 2].map((i) => <path key={i} d={`M-120,${50 + i * 40} h240`} stroke="#8aa0c8" strokeWidth={3} />)}
  {label && <text x={0} y={80} textAnchor="middle" fontFamily="Lora" fontWeight={700} fontSize={44} fill="#1a1a2a">{label}</text>}
  <rect x={-170} y={140} width={20} height={20} fill="#1a1e24" />
</g>);
export const Envelope: React.FC<{ x: number; y: number; s?: number; rot?: number; open?: number }> = ({ x, y, s = 1, rot = 0, open = 0 }) => (<g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}><rect x={-360} y={-240} width={720} height={480} fill={Q.manila} stroke={INK} strokeWidth={8} /><path d={`M-360,-240 L0,${-240 + 220 * (1 - open) - 200 * open} L360,-240`} fill={Q.manilaD} stroke={INK} strokeWidth={7} strokeLinejoin="round" /><circle cx={0} cy={-30} r={18} fill={Q.manilaD} stroke={INK} strokeWidth={4} opacity={open ? 0 : 1} /><path d="M-300,120 h200 M-300,160 h140" stroke={Q.manilaD} strokeWidth={6} opacity={0.4} /></g>);
export const Laptop: React.FC<{ x: number; y: number; s?: number; children?: React.ReactNode; id?: string; glow?: boolean }> = ({ x, y, s = 1, children, id = 'lap', glow = true }) => (<g transform={`translate(${x},${y}) scale(${s})`}>
  {glow && <Glow x={0} y={-300} r={700} ry={500} c={Q.cyan} op={0.22} />}
  <path d="M-400,-620 H400 L410,-40 H-410Z" fill="#2a2c30" stroke={INK} strokeWidth={9} />
  <defs><clipPath id={id}><rect x={-370} y={-590} width={740} height={520} /></clipPath></defs>
  <rect x={-370} y={-590} width={740} height={520} fill="#dfe6ea" />
  <g clipPath={`url(#${id})`}><g transform="translate(-370,-590)">{children}</g></g>
  <path d="M-470,0 L-410,-40 H410 L470,0Z" fill="#3a3c40" stroke={INK} strokeWidth={8} /><rect x={-470} y={0} width={940} height={24} fill="#222428" stroke={INK} strokeWidth={6} />
</g>);
export const Desk: React.FC<{ x: number; y: number; w: number; s?: number; c?: string }> = ({ x, y, w, s = 1, c = Q.wood }) => (<g transform={`translate(${x},${y}) scale(${s})`}><rect x={-w / 2} y={0} width={w} height={50} fill={c} stroke={INK} strokeWidth={8} /><rect x={-w / 2 + 20} y={50} width={40} height={460} fill={Q.woodD} stroke={INK} strokeWidth={6} /><rect x={w / 2 - 60} y={50} width={40} height={460} fill={Q.woodD} stroke={INK} strokeWidth={6} /><rect x={w / 2 - 340} y={50} width={280} height={200} fill={c} stroke={INK} strokeWidth={6} /><path d={`M${w / 2 - 230},150 h60`} stroke={INK} strokeWidth={8} /></g>);
export const Lamp: React.FC<{ x: number; y: number; s?: number; on?: boolean }> = ({ x, y, s = 1, on = true }) => (<g transform={`translate(${x},${y}) scale(${s})`}>{on && <path d="M-40,-320 L-260,0 H220Z" fill="#ffd89a" opacity={0.12} />}<path d="M-80,0 h160 l-20,-30 h-120Z" fill="#2a2a2e" stroke={INK} strokeWidth={6} /><path d="M0,-30 L-40,-260 L20,-300" stroke="#2a2a2e" strokeWidth={14} fill="none" /><path d="M-30,-300 L60,-360 L120,-280 Z" fill="#3a5a4a" stroke={INK} strokeWidth={6} />{on && <Glow x={60} y={-290} r={160} c="#ffd89a" op={0.5} />}</g>);
export const Barrel: React.FC<{ x: number; y: number; s?: number; f: number; disk?: boolean }> = ({ x, y, s = 1, f, disk = false }) => { const sw = Math.sin(sf(f, 3) / 7); return (<g transform={`translate(${x},${y}) scale(${s})`}>
  <Glow x={0} y={-640} r={520} c="#ffa040" op={0.4} />
  {[0, 1, 2].map((i) => <path key={i} d={`M${-150 + i * 120},-560 C${-200 + i * 120 + sw * 20},${-700 - i * 30} ${-90 + i * 110 - sw * 24},${-820 - (i % 2) * 60} ${-120 + i * 120 + sw * 10},${-940 + i * 20} C${-40 + i * 100},${-800} ${-20 + i * 110},${-700} ${-40 + i * 120},-560Z`} fill={['#e86a2a', '#f0a040', '#e8502a'][i]} stroke={INK} strokeWidth={5} opacity={0.92} />)}
  {disk && <g transform={`translate(0,-600) rotate(${12 + sw * 3}) scale(0.5,${0.4 - Math.max(0, sw) * 0.05})`}><path d="M-180,-180 H150 L180,-150 V180 H-180Z" fill="#14161a" stroke={INK} strokeWidth={9} /><rect x={-140} y={-20} width={280} height={34} fill={Q.redD} /></g>}
  <path d="M-220,0 L-240,-560 H240 L220,0Z" fill="#5a5e62" stroke={INK} strokeWidth={9} />{[-420, -260, -100].map((yy) => <path key={yy} d={`M-236,${yy} H236`} stroke={INK} strokeWidth={8} />)}
  {Array.from({ length: 6 }).map((_, i) => <ellipse key={i} cx={sw * 30 + (i - 3) * 40} cy={-1000 - i * 90 - (sf(f, 3) * 3) % 90} rx={70 + i * 16} ry={40 + i * 8} fill="#6a6268" opacity={0.25 - i * 0.03} />)}
</g>); };
// Chicago at night (generic towers, elevated train trestle)
export const City: React.FC<{ W: number; H: number; f: number; gy: number; train?: boolean; seed?: number }> = ({ W, H, f, gy, train = true, seed = 3 }) => { const q = rng(seed); return (<g>
  <rect x={-600} y={-600} width={W + 1200} height={gy + 600} fill="#120e18" /><Glow x={W * 0.5} y={gy} r={W} ry={gy * 0.6} c="#6a4a6a" op={0.35} />
  {Array.from({ length: 22 }).map((_, i) => { const w = 90 + q() * 160, h = 260 + q() * (gy * 0.7), x = -200 + i * (W + 400) / 22; return <g key={i}><rect x={x} y={gy - h} width={w} height={h} fill={i % 2 ? '#1d1824' : '#241e2c'} stroke={INK} strokeWidth={4} />{Array.from({ length: Math.floor(h / 60) }).map((_, r) => Array.from({ length: Math.floor(w / 40) }).map((_, c) => q() > 0.72 ? <rect key={r + '-' + c} x={x + 12 + c * 40} y={gy - h + 20 + r * 60} width={18} height={26} fill="#e8c878" opacity={0.75} /> : null))}</g>; })}
  {train && <g><rect x={-600} y={gy - 120} width={W + 1200} height={40} fill="#2a2a30" stroke={INK} strokeWidth={6} />{Array.from({ length: 30 }).map((_, i) => <path key={i} d={`M${-600 + i * 120},${gy - 80} l60,80 l60,-80`} stroke="#2a2a30" strokeWidth={10} fill="none" />)}
    <g transform={`translate(${((sf(f, 3) * 9) % (W + 1600)) - 1200},${gy - 260})`}>{[0, 1, 2].map((c) => <g key={c} transform={`translate(${c * 420},0)`}><rect x={0} y={0} width={400} height={140} rx={16} fill="#5a6070" stroke={INK} strokeWidth={6} />{Array.from({ length: 6 }).map((_, k) => <rect key={k} x={24 + k * 62} y={26} width={44} height={50} fill="#f0dc98" />)}</g>)}</g>
  </g>}
  <rect x={-600} y={gy} width={W + 1200} height={H} fill="#141018" />
</g>); };
export const Wood70: React.FC<{ W: number; fy: number; c?: string }> = ({ W, fy, c = Q.panel }) => (<g><rect x={-600} y={-600} width={W + 1200} height={fy + 600} fill={c} />{Array.from({ length: Math.ceil((W + 1200) / 70) }).map((_, i) => <path key={i} d={`M${-600 + i * 70},-600 V${fy}`} stroke={Q.panelD} strokeWidth={i % 3 ? 3 : 7} />)}<rect x={-600} y={fy - 30} width={W + 1200} height={30} fill={Q.panelD} stroke={INK} strokeWidth={5} /></g>);
export const Blocks: React.FC<{ W: number; fy: number; c?: string }> = ({ W, fy, c = Q.block }) => (<g><rect x={-600} y={-600} width={W + 1200} height={fy + 600} fill={c} />{Array.from({ length: 24 }).map((_, r) => <g key={r}><path d={`M-600,${fy - r * 64} H${W + 600}`} stroke={Q.blockD} strokeWidth={5} />{Array.from({ length: 20 }).map((_, k) => <path key={k} d={`M${-600 + k * 180 + (r % 2) * 90},${fy - r * 64} v-64`} stroke={Q.blockD} strokeWidth={5} />)}</g>)}</g>);
export const Carpet: React.FC<{ W: number; H: number; fy: number; c?: string }> = ({ W, H, fy, c = Q.carpet }) => { const q = rng(5); return (<g><rect x={-600} y={fy} width={W + 1200} height={H - fy + 600} fill={c} />{Array.from({ length: 120 }).map((_, i) => <circle key={i} cx={-600 + q() * (W + 1200)} cy={fy + q() * (H - fy + 100)} r={2 + q() * 3} fill="#000" opacity={0.15} />)}<rect x={-600} y={fy} width={W + 1200} height={30} fill="#000" opacity={0.25} /></g>); };
// ---------- screen content (draw inside CRT / Laptop; local coords 0..552 x 0..396 for CRT, 0..740 x 0..520 for laptop)
const mono = 'DejaVu Sans Mono, monospace';
export const Screen: React.FC<{ mode: string; w: number; h: number; f: number }> = ({ mode, w, h, f }) => {
  const t = sf(f, 3); const cur = Math.floor(t / 15) % 2 === 0;
  const G = Q.phos; const fs = h / 16;
  const line = (y: number, txt: string, c = G, b = false) => <text x={w * 0.05} y={y} fontFamily={mono} fontSize={fs} fill={c} fontWeight={b ? 700 : 400}>{txt}</text>;
  if (mode === 'bbs') return (<g><rect width={w} height={h} fill={Q.crt} />{line(fs * 1.4, '== WINDY CITY BBS ==', G, true)}{line(fs * 3, 'Messages: 1,204   Users: 412')}{line(fs * 4.6, '> General chat (38 new)')}{line(fs * 6.2, '> Files and pictures')}{line(fs * 7.8, '> Night owls (12 new)')}<rect x={w * 0.03} y={fs * 8.6} width={w * 0.94} height={fs * 1.6} fill={G} opacity={0.22} />{line(fs * 9.8, 'NEW LINK: smile.jpg', '#e8fff0', true)}{line(fs * 11.6, 'posted by: ???')}{line(fs * 13.4, 'Open link? (Y/N) ' + (cur ? '_' : ''))}</g>);
  if (mode === 'users') { const n = 400, cols = 25; return (<g><rect width={w} height={h} fill={Q.crt} />{line(fs * 1.2, 'WHO SAW IT:  412 users', G, true)}{Array.from({ length: n }).map((_, i) => { const off = (i * 37) % 100 < Math.min(70, t / 4); return <rect key={i} x={w * 0.04 + (i % cols) * (w * 0.92 / cols)} y={fs * 2 + Math.floor(i / cols) * (h - fs * 2.6) / 16} width={w * 0.92 / cols - 3} height={(h - fs * 2.6) / 16 - 3} fill={off ? '#0a2016' : G} opacity={off ? 1 : 0.8} />; })}</g>); }
  if (mode === 'search') return (<g><rect width={w} height={h} fill="#e8ecf0" /><rect x={w * 0.06} y={h * 0.1} width={w * 0.88} height={h * 0.12} fill="#fff" stroke="#8a96a4" strokeWidth={3} /><text x={w * 0.1} y={h * 0.19} fontFamily={mono} fontSize={h * 0.06} fill="#202830">smile.jpg{cur ? '|' : ''}</text><text x={w * 0.08} y={h * 0.36} fontFamily="Lora" fontSize={h * 0.055} fill="#2a3a6a" fontWeight={700}>is smile.dog real??</text><text x={w * 0.08} y={h * 0.5} fontFamily="Lora" fontSize={h * 0.055} fill="#2a3a6a" fontWeight={700}>the smile.jpg legend (thread)</text><text x={w * 0.08} y={h * 0.64} fontFamily="Lora" fontSize={h * 0.055} fill="#2a3a6a" fontWeight={700}>Mary E. - Chicago, 1992</text><text x={w * 0.08} y={h * 0.84} fontFamily="Lora" fontSize={h * 0.06} fill={Q.red} fontWeight={700}>Image: not found</text></g>);
  if (mode === 'fakes') return (<g><rect width={w} height={h} fill="#1a1d22" />{Array.from({ length: 12 }).map((_, i) => <g key={i} transform={`translate(${w * 0.05 + (i % 4) * w * 0.23},${h * 0.06 + Math.floor(i / 4) * h * 0.31})`}><rect width={w * 0.2} height={h * 0.27} fill="#0e0c0e" stroke="#4a4e56" strokeWidth={3} /><g transform={`translate(${w * 0.1},${h * 0.15}) scale(${h * 0.00032 * (0.8 + (i % 3) * 0.1)})`} opacity={0.75}><DogHead f={f} grin={0.6 + (i % 4) * 0.1} /></g><text x={w * 0.01} y={h * 0.26} fontFamily={mono} fontSize={h * 0.035} fill="#e85a4a">FAKE</text></g>)}</g>);
  if (mode === 'chain') return (<g><rect width={w} height={h} fill="#d8dce0" /><rect width={w} height={h * 0.1} fill="#2a3a6a" /><text x={w * 0.04} y={h * 0.07} fontFamily="Lora" fontSize={h * 0.05} fill="#fff" fontWeight={700}>Inbox</text>{['SMILE!! GOD LOVES YOU!', 'FW: SMILE!! GOD LOVES YOU!', 'FW: FW: SMILE!! GOD LOVES YOU!', 'FW: FW: FW: SMILE!!', 'FW: SMILE!! GOD LOVES YOU!'].map((s, i) => <g key={i}><rect x={0} y={h * (0.12 + i * 0.17)} width={w} height={h * 0.15} fill={i === 0 ? '#c8d0e8' : '#eef0f2'} stroke="#a0a8b0" strokeWidth={2} /><text x={w * 0.04} y={h * (0.215 + i * 0.17)} fontFamily={mono} fontSize={h * 0.048} fill="#202830" fontWeight={i === 0 ? 700 : 400}>{s}</text></g>)}</g>);
  if (mode === 'forum') return (<g><rect width={w} height={h} fill="#e6e2d8" /><rect width={w} height={h * 0.1} fill="#4a5a3a" /><text x={w * 0.04} y={h * 0.07} fontFamily="Lora" fontSize={h * 0.05} fill="#fff" fontWeight={700}>Comedy Forum - General</text>{Array.from({ length: 4 }).map((_, i) => <g key={i}><rect x={w * 0.04} y={h * (0.13 + i * 0.21)} width={w * 0.92} height={h * 0.18} fill="#f4f0e6" stroke="#b0a890" strokeWidth={2} /><rect x={w * 0.06} y={h * (0.145 + i * 0.21)} width={h * 0.15} height={h * 0.15} fill="#1a1416" /><text x={w * 0.06 + h * 0.18} y={h * (0.23 + i * 0.21)} fontFamily={mono} fontSize={h * 0.042} fill="#3a2a2a">[image] smile.jpg</text></g>)}</g>);
  if (mode === 'post') return (<g><rect width={w} height={h} fill="#eef0f2" /><text x={w * 0.05} y={h * 0.12} fontFamily="Lora" fontSize={h * 0.055} fill="#2a3a6a" fontWeight={700}>Folklore and Legends list</text><text x={w * 0.05} y={h * 0.26} fontFamily={mono} fontSize={h * 0.045} fill="#202830">Subject: anyone else see smile.jpg?</text>{Array.from({ length: 5 }).map((_, i) => <rect key={i} x={w * 0.05} y={h * (0.34 + i * 0.09)} width={w * (0.85 - (i % 3) * 0.15)} height={h * 0.035} fill="#9aa4b0" />)}<text x={w * 0.05} y={h * 0.88} fontFamily={mono} fontSize={h * 0.045} fill="#6a7480">Replies: 0</text></g>);
  if (mode === 'letter') return (<g><rect width={w} height={h} fill="#f4f4f2" /><rect width={w} height={h * 0.2} fill="#dde2ea" /><text x={w * 0.04} y={h * 0.08} fontFamily={mono} fontSize={h * 0.04} fill="#30384a">From: marye@****.net</text><text x={w * 0.04} y={h * 0.16} fontFamily={mono} fontSize={h * 0.04} fill="#30384a">Subject: Last summer's interview</text><text x={w * 0.05} y={h * 0.3} fontFamily="Lora" fontSize={h * 0.05} fill="#202830">Dear Mr. L.,</text>{Array.from({ length: 6 }).map((_, i) => <rect key={i} x={w * 0.05} y={h * (0.36 + i * 0.07)} width={w * (0.88 - (i % 2) * 0.12)} height={h * 0.025} fill="#a8b0bc" />)}<rect x={w * 0.04} y={h * 0.8} width={w * 0.8} height={h * 0.09} fill={Q.red} opacity={0.18} /><text x={w * 0.05} y={h * 0.865} fontFamily="Lora" fontSize={h * 0.052} fill="#202830" fontWeight={700}>Stop while you are still whole.</text></g>);
  if (mode === 'obit') return (<g><rect width={w} height={h} fill="#f2efe6" /><text x={w * 0.5} y={h * 0.13} textAnchor="middle" fontFamily="Lora" fontSize={h * 0.08} fill="#1a1a1a" fontWeight={700}>OBITUARIES</text><path d={`M${w * 0.05},${h * 0.17} H${w * 0.95}`} stroke="#1a1a1a" strokeWidth={3} />{[0, 1, 2].map((i) => <g key={i}><text x={w * 0.06} y={h * (0.3 + i * 0.24)} fontFamily="Lora" fontSize={h * 0.055} fill="#1a1a1a" fontWeight={700}>{['Harold B.', 'Mary E.', 'Lorraine K.'][i]}</text>{Array.from({ length: 3 }).map((_, k) => <rect key={k} x={w * 0.06} y={h * (0.33 + i * 0.24 + k * 0.045)} width={w * (0.84 - k * 0.15)} height={h * 0.02} fill="#9a968a" />)}</g>)}<rect x={w * 0.03} y={h * 0.43} width={w * 0.94} height={h * 0.22} fill="none" stroke={Q.red} strokeWidth={4} /></g>);
  if (mode === 'zahir') return (<g><rect width={w} height={h} fill="#f4f4f2" /><rect width={w} height={h * 0.2} fill="#dde2ea" /><text x={w * 0.04} y={h * 0.08} fontFamily={mono} fontSize={h * 0.04} fill="#30384a">From: elzahir82@****.com</text><text x={w * 0.04} y={h * 0.16} fontFamily={mono} fontSize={h * 0.04} fill="#30384a">Subject: smile</text>{Array.from({ length: 4 }).map((_, i) => <rect key={i} x={w * 0.05} y={h * (0.27 + i * 0.07)} width={w * (0.8 - (i % 2) * 0.2)} height={h * 0.025} fill="#a8b0bc" />)}<text x={w * 0.05} y={h * 0.6} fontFamily="Lora" fontSize={h * 0.05} fill="#202830">Just spreading the word.</text><text x={w * 0.05} y={h * 0.8} fontFamily={mono} fontSize={h * 0.12} fill="#202830" fontWeight={700}>(:</text></g>);
  if (mode === 'attach') return (<g><rect width={w} height={h} fill="#f4f4f2" /><rect width={w} height={h * 0.12} fill="#dde2ea" /><text x={w * 0.04} y={h * 0.08} fontFamily={mono} fontSize={h * 0.04} fill="#30384a">Attachments (1)</text><rect x={w * 0.2} y={h * 0.25} width={w * 0.6} height={h * 0.5} rx={16} fill="#ffffff" stroke="#8a96a4" strokeWidth={4} /><rect x={w * 0.42} y={h * 0.32} width={w * 0.16} height={h * 0.22} fill="#c8d0dc" stroke="#6a7484" strokeWidth={3} /><path d={`M${w * 0.42},${h * 0.54} l${w * 0.05},-${h * 0.1} l${w * 0.04},${h * 0.06} l${w * 0.03},-${h * 0.04} l${w * 0.04},${h * 0.08}Z`} fill="#6a7484" /><text x={w * 0.5} y={h * 0.66} textAnchor="middle" fontFamily={mono} fontSize={h * 0.06} fill="#202830" fontWeight={700}>smile.jpg</text><circle cx={w * 0.78} cy={h * 0.27} r={h * 0.05} fill={Q.red} /><text x={w * 0.78} y={h * 0.285} textAnchor="middle" fontFamily="Lora" fontSize={h * 0.045} fill="#fff" fontWeight={700}>1</text><path d={`M${w * 0.58 + Math.sin(t / 20) * 10},${h * 0.6} l0,${h * 0.12} l${h * 0.03},-${h * 0.03} l${h * 0.03},${h * 0.05} l${h * 0.02},-${h * 0.01} l-${h * 0.03},-${h * 0.05} l${h * 0.04},0Z`} fill="#111" stroke="#fff" strokeWidth={2} /></g>);
  if (mode === 'article') return (<g><rect width={w} height={h} fill="#f6f6f4" /><rect width={w} height={h * 0.1} fill="#e2e4e8" /><rect x={w * 0.72} y={h * 0.02} width={w * 0.24} height={h * 0.06} rx={8} fill={Q.red} /><text x={w * 0.84} y={h * 0.068} textAnchor="middle" fontFamily="Lora" fontSize={h * 0.04} fill="#fff" fontWeight={700}>Attach file</text><text x={w * 0.06} y={h * 0.24} fontFamily="Lora" fontSize={h * 0.07} fill="#202830" fontWeight={700}>The truth about smile.jpg</text>{Array.from({ length: 6 }).map((_, i) => <rect key={i} x={w * 0.06} y={h * (0.32 + i * 0.08)} width={w * (0.86 - (i % 3) * 0.14) * (i === 5 ? Math.min(1, t / 60) : 1)} height={h * 0.028} fill="#a8b0bc" />)}</g>);
  if (mode === 'inbox' || mode === 'inboxm') return (<g><rect width={w} height={h} fill="#f0f2f4" /><rect width={w * 0.26} height={h} fill="#2a3a5a" /><text x={w * 0.03} y={h * 0.1} fontFamily="Lora" fontSize={h * 0.05} fill="#fff" fontWeight={700}>Inbox</text><circle cx={w * 0.21} cy={h * 0.085} r={h * 0.04} fill={Q.red} /><text x={w * 0.21} y={h * 0.1} textAnchor="middle" fontFamily="Lora" fontSize={h * 0.04} fill="#fff" fontWeight={700}>1</text>{[0, 1, 2, 3, 4].map((i) => <g key={i}><rect x={w * 0.28} y={h * (0.04 + i * 0.18)} width={w * 0.7} height={h * 0.16} fill={i === 0 ? '#dfe6f6' : '#fff'} stroke="#c0c6ce" strokeWidth={2} /><text x={w * 0.3} y={h * (0.11 + i * 0.18)} fontFamily={mono} fontSize={h * 0.04} fill="#202830" fontWeight={i === 0 ? 700 : 400}>{[mode === 'inboxm' ? 'marye - last summer' : 'elzahir82 - smile', 'Library - book due', 'Mom - call me', 'Class - finals info', 'Newsletter'][i]}</text></g>)}</g>);
  if (mode === 'picture') return (<g><rect width={w} height={h} fill="#c0c4c8" /><rect width={w} height={h * 0.08} fill="#2a3a6a" /><text x={w * 0.03} y={h * 0.06} fontFamily={mono} fontSize={h * 0.045} fill="#fff">smile.jpg</text><svg x={w * 0.03} y={h * 0.1} width={w * 0.94} height={h * 0.86} viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice"><Picture W={1600} H={1000} f={f} /></svg></g>);
  if (mode === 'off') return <rect width={w} height={h} fill="#0a0c0c" />;
  return <rect width={w} height={h} fill={Q.crt} />;
};
export { R, Glow };
