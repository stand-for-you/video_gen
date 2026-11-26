import React from 'react';
import { INK, RED, Hand, rng } from './Kit';
import { FacePerson, HairBack, HairFront, type Spec } from './Cast';
// ============================================================================
// CHARACTER DESIGN TEMPLATE (v0.5)   -- replaces the "permanent cast" rule.
//
// The user's instruction: the character sheets are a TEMPLATE, not a cast.
// Every story gets NEW people. What stays the same across videos is the design
// LANGUAGE taken from the reference sheets, not the faces:
//
//   1. Build variety is the point. In one reference scene you get a lean young
//      lead, a huge round chef, a broad stocky market man, a frail stooped old
//      man and a slim upright woman. Six people of the same width is a failure.
//   2. Silhouette first. Each person must be recognisable as a black shape:
//      width, height, posture and hair outline do the work, not face detail.
//   3. Posture carries the role. The boss stands straight, the dogsbody stoops,
//      the old man hunches, the bully leans back over his belly.
//   4. Costume says the job before the face does (apron, whites, suspenders
//      and tie, uniform, work coat).
//   5. Hands are large and readable - they are half the acting.
//
// makeCast(slug, roles) hashes the STORY SLUG, so a different story deterministically
// yields a different set of people, and the same story always rebuilds identically.
// ============================================================================

export type Build = 'lean' | 'slim' | 'average' | 'stocky' | 'heavy' | 'huge';
export type Posture = 'straight' | 'stoop' | 'hunch' | 'lean' | 'ready';

export type GenSpec = Spec & {
  build: Build;
  posture: Posture;
  height: number;     // 0.82 (child) .. 1.18 (very tall). 1.0 = about 3040 units.
  belly: number;      // 0 .. 0.7 extra torso bow
  shoulder: number;   // -0.3 (sloped/frail) .. 0.3 (square/strong)
  handS: number;      // hand scale, 0.42 .. 0.62
};

const BUILD: Record<Build, { sw: number; hw: number; belly: number; shoulder: number }> = {
  lean:    { sw: 248, hw: 196, belly: -0.04, shoulder: -0.06 },
  slim:    { sw: 266, hw: 216, belly: 0.02,  shoulder: 0.02 },
  average: { sw: 292, hw: 242, belly: 0.10,  shoulder: 0.08 },
  stocky:  { sw: 344, hw: 292, belly: 0.22,  shoulder: 0.22 },
  heavy:   { sw: 382, hw: 356, belly: 0.44,  shoulder: 0.06 },
  huge:    { sw: 430, hw: 424, belly: 0.64,  shoulder: 0.00 },
};

const POSTURE: Record<Posture, { tilt: number; drop: number; neck: number }> = {
  straight: { tilt: 0,    drop: 0,   neck: 0 },
  ready:    { tilt: -2.5, drop: 20,  neck: -14 },
  lean:     { tilt: 3.5,  drop: 10,  neck: 26 },
  stoop:    { tilt: -6,   drop: 60,  neck: 60 },
  hunch:    { tilt: -11,  drop: 118, neck: 104 },
};

const mix = (a: string, b: string, t: number) => {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const A = p(a), B = p(b);
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join('');
};

// ---------------------------------------------------------------------------
// BodyGen: a full body with real build variation. Origin = feet centre, up is
// negative, same contract as Cast.FullPerson so sets can swap one for the other.
// The head re-uses FacePerson/HairBack/HairFront so faces stay one family.
// ---------------------------------------------------------------------------
export const BodyGen: React.FC<{
  s: GenSpec; x?: number; y?: number; k?: number; f?: number; expr?: string;
  view?: 'front' | 'three' | 'back';
}> = ({ s, x = 0, y = 0, k = 1, f = 0, expr = 'neutral', view = 'front' }) => {
  const B = BUILD[s.build], P = POSTURE[s.posture];
  const sw = s.sw ?? B.sw, hw = s.hw ?? B.hw;
  const belly = s.belly ?? B.belly, shoulder = s.shoulder ?? B.shoulder;
  const H = s.height ?? 1, O = INK;
  const top = s.topC, topD = s.topD, inner = s.inner || '#d6ccb2';
  const acc = s.acc || [], legK = s.legK || 1, hs = s.hs || 1;
  const longSk = s.bottom === 'skirtLong', kneeSk = s.bottom === 'dressKnee';
  const skirtY = longSk ? -330 : -1000;

  // key heights, pushed by posture
  const shY = -2470 + P.drop, hipY = s.top === 'jacket' ? -1380 : -1540;
  const headY = -2780 + P.drop + P.neck * 0.4;
  // belly bow: how far the side of the torso pushes out at the waist
  const bow = 1 + belly;
  const sideX = (q: number) => q * (hw + (sw - hw) * 0.25) * bow;
  const breathe = Math.sin(f / 22) * (3 + belly * 9);
  const armX = sw - 300;

  return (
    <g transform={`translate(${x},${y}) scale(${k * (s.gs || 1)})`}>
      <ellipse cx={0} cy={4} rx={360 + sw * 0.35} ry={30} fill="#000" opacity={0.28} />
      {/* ---- LEGS ---- */}
      <g transform={`scale(1,${legK * H})`}>
        {[0, 1].map((i) => (
          <g key={i} transform={i ? 'scale(-1,1)' : ''}>
            <path d={`M${-hw + 4},-1560 C${-hw},-1100 ${-hw - 6},-700 -214,-170 L-98,-170 C-94,-700 -60,-1100 -6,-1560Z`}
              fill={longSk || kneeSk ? s.skin : s.botC} stroke={O} strokeWidth={8} strokeLinejoin="round" />
            {!(longSk || kneeSk) && (
              <path d={`M${-hw + 4},-1560 C${-hw},-1100 ${-hw - 6},-700 -214,-170 L-170,-170 C-196,-700 -200,-1100 -196,-1560Z`}
                fill="#000" opacity={0.3} />
            )}
            <path d="M-232,-200 H-92 L-80,-110 C-50,-90 -34,-50 -34,-14 C-34,14 -300,14 -302,-10 C-300,-60 -250,-96 -232,-200Z"
              fill={s.shoeC} stroke={O} strokeWidth={8} strokeLinejoin="round" />
            <path d="M-302,-4 H-34" stroke="#0a0706" strokeWidth={14} />
            {acc.includes('redLaces') && <path d="M-200,-150 H-110 M-196,-120 H-114" stroke={RED} strokeWidth={9} />}
          </g>
        ))}
      </g>

      {/* ---- UPPER BODY (posture tilts the whole thing from the hips) ---- */}
      <g transform={`translate(0,${1560 * (1 - legK * H)}) rotate(${P.tilt} 0 ${hipY})`}>
        {(longSk || kneeSk) && (
          <g>
            <path d={`M${-hw},-1700 C${-hw - 30},-1400 ${-hw - 150},${skirtY - 400} ${-hw - 190},${skirtY} L${hw + 190},${skirtY} C${hw + 150},${skirtY - 400} ${hw + 30},-1400 ${hw},-1700Z`}
              fill={s.botC} stroke={O} strokeWidth={8} strokeLinejoin="round" />
            <path d={`M${hw},-1700 C${hw + 30},-1400 ${hw + 150},${skirtY - 400} ${hw + 190},${skirtY} L40,${skirtY} C60,-1300 60,-1500 40,-1700Z`}
              fill="#000" opacity={0.25} />
          </g>
        )}

        {/* neck - short and thick on heavy builds, long on lean ones */}
        {(() => { const nw = 56 + (sw - 248) * 0.13, nTop = shY - 190 + P.neck * 0.25;
          return (<g>
            <path d={`M${-nw},${nTop} L${-nw},${shY} C${-nw * 0.5},${shY + 30} ${nw * 0.5},${shY + 30} ${nw},${shY} L${nw},${nTop}Z`}
              fill={s.skin} stroke={O} strokeWidth={7} />
            <path d={`M${-nw},${nTop + 60} L${-nw},${shY} C${-nw * 0.5},${shY + 30} ${nw * 0.5},${shY + 30} ${nw},${shY} L${nw},${shY - 90} C${nw * 0.3},${shY - 50} ${-nw * 0.4},${shY - 70} ${-nw},${nTop + 60}Z`}
              fill="#000" opacity={0.2} />
          </g>); })()}

        {/* hood bunch on hoodies */}
        {s.top === 'hoodie' && (
          <path d={`M-150,${shY - 70} C-120,${shY + 50} 120,${shY + 50} 150,${shY - 70} C200,${shY + 50} 100,${shY + 90} 0,${shY + 90} C-100,${shY + 90} -200,${shY + 50} -150,${shY - 70}Z`}
            fill={topD} stroke={O} strokeWidth={7} />
        )}

        {/* TORSO: the build lives here. Shoulders slope by `shoulder`, the sides
            bow out by `belly`, so lean / stocky / huge read as different shapes. */}
        {(() => {
          const shDrop = -shoulder * 70;      // square shoulders sit higher at the outside
          const wx = sideX(1) + breathe;
          const d = `M${-sw},${shY + shDrop}
                     C${-sw - 16},${shY + 240} ${-wx - 24},${shY + 560} ${-hw * bow},${hipY}
                     H${hw * bow}
                     C${wx + 24},${shY + 560} ${sw + 16},${shY + 240} ${sw},${shY + shDrop}
                     C${sw * 0.5},${shY - 72} ${-sw * 0.5},${shY - 72} ${-sw},${shY + shDrop}Z`;
          return (<g>
            <path d={d} fill={top} stroke={O} strokeWidth={8} strokeLinejoin="round" />
            <path d={`M${sw},${shY + shDrop} C${sw + 16},${shY + 240} ${wx + 24},${shY + 560} ${hw * bow},${hipY} H${hw * 0.42} C${sw * 0.55},${shY + 520} ${sw * 0.7},${shY + 230} ${sw * 0.6},${shY - 20}Z`}
              fill="#000" opacity={0.26} />
            {/* cloth folds follow the belly: more bulk, more fabric strain */}
            <path d={`M${-hw * 0.5},${shY + 180} q-30,${200 + belly * 120} -18,${420}
                      M${hw * 0.45},${shY + 280} q40,${180 + belly * 140} 28,${360}`}
              stroke={O} strokeWidth={4} fill="none" opacity={0.4} />
            {belly > 0.3 && (
              <path d={`M${-hw * 0.72},${hipY - 300} C${-hw * 0.2},${hipY - 240} ${hw * 0.2},${hipY - 240} ${hw * 0.72},${hipY - 300}`}
                stroke={O} strokeWidth={5} fill="none" opacity={0.3} />
            )}
          </g>);
        })()}

        {/* collars / plackets, unchanged vocabulary from the permanent kit */}
        {s.top === 'shirt' && (
          <g>
            <path d={`M-96,${shY - 34} L0,${shY + 140} L-34,${shY - 60}Z M96,${shY - 34} L0,${shY + 140} L34,${shY - 60}Z`}
              fill={mix(top, '#ffffff', 0.2)} stroke={O} strokeWidth={6} />
            <path d={`M0,${shY + 140} V${hipY}`} stroke={O} strokeWidth={5} />
            {[0, 1, 2, 3, 4].map((q) => <circle key={q} cx={-16} cy={shY + 250 + q * 150} r={11} fill={inner} stroke={O} strokeWidth={4} />)}
          </g>
        )}
        {s.top === 'cardigan' && (
          <g>
            <path d={`M-120,${shY - 20} L0,${shY + 210} L120,${shY - 20} L90,${shY + 70} L0,${shY + 270} L-90,${shY + 70}Z`} fill={inner} stroke={O} strokeWidth={6} />
            <path d={`M0,${shY + 210} V${hipY}`} stroke={O} strokeWidth={6} />
          </g>
        )}
        {s.top === 'jacket' && (
          <g>
            <path d={`M-170,${shY - 50} L-60,${shY + 220} L0,${shY + 230} L60,${shY + 220} L170,${shY - 50} L110,${shY - 100} L0,${shY + 50} L-110,${shY - 100}Z`}
              fill={topD} stroke={O} strokeWidth={7} strokeLinejoin="round" />
            <path d={`M0,${shY + 220} V${hipY}`} stroke={O} strokeWidth={7} />
          </g>
        )}
        {s.top === 'uniform' && (
          <g>
            <path d={`M-96,${shY - 34} L0,${shY + 140} L-34,${shY - 60}Z M96,${shY - 34} L0,${shY + 140} L34,${shY - 60}Z`} fill={mix(top, '#ffffff', 0.25)} stroke={O} strokeWidth={6} />
            <path d={`M-18,${shY + 90} L18,${shY + 90} L30,${shY + 520} L0,${shY + 590} L-30,${shY + 520}Z`} fill="#1a1a22" stroke={O} strokeWidth={5} />
            <rect x={-hw * bow * 0.82} y={hipY - 80} width={hw * bow * 1.64} height={60} fill="#17110d" stroke={O} strokeWidth={6} />
          </g>
        )}
        {/* apron: the single most useful costume in the reference sheets */}
        {acc.includes('apron') && (
          <g>
            <path d={`M-70,${shY - 40} L-${hw * bow * 0.78},${shY + 330} L-${hw * bow * 0.86},${hipY + 520} L${hw * bow * 0.86},${hipY + 520} L${hw * bow * 0.78},${shY + 330} L70,${shY - 40}Z`}
              fill={s.accC || '#e6ddc6'} stroke={O} strokeWidth={7} strokeLinejoin="round" opacity={0.95} />
            <path d={`M-${hw * bow * 0.8},${shY + 420} H${hw * bow * 0.8}`} stroke={O} strokeWidth={5} opacity={0.35} />
          </g>
        )}
        {acc.includes('badge') && <path d={`M120,${shY + 210} l22,-16 l22,16 l-8,28 h-28Z`} fill="#b89a3c" stroke={O} strokeWidth={4} />}
        {acc.includes('redScarf') && (
          <g>
            <path d={`M-120,${shY - 70} C-60,${shY + 30} 60,${shY + 30} 120,${shY - 70} L130,${shY} C60,${shY + 80} -60,${shY + 80} -130,${shY}Z`} fill={RED} stroke={O} strokeWidth={7} />
            <path d={`M40,${shY + 30} L90,${shY + 370} L150,${shY + 350} L110,${shY + 10}Z`} fill={RED} stroke={O} strokeWidth={7} />
          </g>
        )}
        {acc.includes('suspenders') && (
          <g>{[-1, 1].map((q) => (
            <path key={q} d={`M${q * 110},${shY - 30} C${q * 128},${shY + 300} ${q * (hw * bow * 0.62)},${shY + 560} ${q * (hw * bow * 0.6)},${hipY}`}
              stroke="#2a2118" strokeWidth={34} fill="none" strokeLinecap="round" />
          ))}</g>
        )}
        {acc.includes('tie') && (
          <path d={`M-26,${shY + 120} L26,${shY + 120} L40,${shY + 230} L0,${shY + 760} L-40,${shY + 230}Z`}
            fill={s.accC || '#9c3a28'} stroke={O} strokeWidth={6} strokeLinejoin="round" />
        )}

        {/* ---- ARMS: hang wider the heavier the build ---- */}
        {[0, 1].map((i) => {
          const spread = armX + belly * 110;
          return (
            <g key={i} transform={i ? 'scale(-1,1)' : ''}>
              <g transform={`translate(${-spread},0)`}>
                <path d={`M-388,${shY + 530} C-402,${shY + 670} -382,${shY + 820} -368,${shY + 940} L-286,${shY + 940} C-284,${shY + 820} -284,${shY + 670} -292,${shY + 530}Z`}
                  fill={s.skin} stroke={O} strokeWidth={7} strokeLinejoin="round" />
                <path d={`M-300,${shY - 10} C-396,${shY + 170} -410,${shY + 370} -398,${shY + (s.rolled ? 530 : 910)} L-282,${shY + (s.rolled ? 530 : 910)} C-282,${shY + 370} -260,${shY + 170} -236,${shY + 30}Z`}
                  fill={top} stroke={O} strokeWidth={8} strokeLinejoin="round" />
                {s.rolled && <rect x={-406} y={shY + 470} width={128} height={70} rx={14} fill={mix(top, '#ffffff', 0.2)} stroke={O} strokeWidth={6} />}
                <Hand x={-328} y={shY + 950} s={s.handS ?? 0.5} rot={180} skin={s.skin} shade={s.skinD}
                  ext={[0.75, 0.7, 0.65, 0.55]} thumb={0.2} />
                {i === 1 && acc.includes('cane') && (
                  <path d={`M-338,${shY + 1020} L-300,${-1560 * (1 - legK * H) * -1}`} stroke="#3a2a1c" strokeWidth={26} strokeLinecap="round" />
                )}
              </g>
            </g>
          );
        })}

        {/* ---- HEAD ---- */}
        <g transform={`translate(0,${headY}) rotate(${-P.tilt * 0.55}) translate(0,250) scale(${hs}) translate(0,-250)`}>
          {view !== 'back' && <HairBack s={s} />}
          {view === 'back'
            ? <path d="M0,-240 C120,-244 172,-130 166,-10 C160,120 118,208 0,210 C-118,208 -160,120 -166,-10 C-172,-130 -120,-244 0,-240Z"
                fill={s.grey ? '#b8b8b0' : s.hair} stroke={INK} strokeWidth={8} />
            : <FacePerson s={s} expr={expr} f={f} />}
          {view !== 'back' && <HairFront s={s} />}
        </g>
      </g>
    </g>
  );
};

// ---------------------------------------------------------------------------
// THE GENERATOR. A story slug in, a cast of distinct people out.
// roles: ['lead','boss','neighbour',...] - any labels the story needs.
// Pass `hint` to steer one person ('old','child','big','frail','tall','woman','man').
// ---------------------------------------------------------------------------
const SKINS: [string, string][] = [
  ['#e3c3a2', '#a8805c'], ['#d6a982', '#8c6240'], ['#c08a5e', '#7d5436'],
  ['#9c6b44', '#5f3e26'], ['#7a4e30', '#48291a'], ['#ecd3b6', '#b3906c'],
];
const HAIRS = ['#1a1310', '#2a1a16', '#3a2418', '#54341e', '#6b4a2a', '#0f0d0c'];
const TOPS: [string, string][] = [
  ['#566b4a', '#3a4a32'], ['#7a4a3a', '#54301f'], ['#3e506c', '#26354a'],
  ['#6e5a3e', '#4a3a28'], ['#5a4a60', '#3a2f42'], ['#8a6a4a', '#5e472f'],
  ['#4a6460', '#2f4440'], ['#8c5a52', '#5e3a34'],
];
const BOTS = ['#3c4b66', '#2f3a2c', '#4a3f38', '#202838', '#555a5c', '#3a3550'];
const M_HAIR: Spec['hairStyle'][] = ['crop', 'messy', 'bald', 'cap', 'greyshort'];
const F_HAIR: Spec['hairStyle'][] = ['long', 'bun', 'pigtails', 'messy', 'greyshort'];
const BUILDS: Build[] = ['lean', 'slim', 'average', 'stocky', 'heavy', 'huge'];
const POSTURES: Posture[] = ['straight', 'ready', 'lean', 'stoop', 'hunch'];

const hash = (s: string) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return Math.abs(h); };

export type RoleHint = 'old' | 'child' | 'big' | 'frail' | 'tall' | 'woman' | 'man' | 'worker' | 'boss';

export const makeCast = (
  slug: string,
  roles: { id: string; name: string; hint?: RoleHint[] }[],
): Record<string, GenSpec> => {
  const q = rng(hash(slug) % 100000);
  const out: Record<string, GenSpec> = {};
  const usedBuild: Build[] = [], usedHair: string[] = [];

  roles.forEach((role, idx) => {
    const h = role.hint || [];
    const fem = h.includes('woman') ? true : h.includes('man') ? false : q() < 0.45;
    const child = h.includes('child');
    const old = h.includes('old');
    const age: Spec['age'] = child ? 0 : old ? 3 : (Math.floor(q() * 3) as Spec['age']);

    // build: force spread. Never give two people in a row the same build.
    let build: Build =
      child ? 'lean'
      : h.includes('big') ? (q() < 0.5 ? 'heavy' : 'huge')
      : h.includes('frail') ? 'lean'
      : h.includes('worker') ? 'stocky'
      : BUILDS[Math.floor(q() * BUILDS.length)];
    let guard = 0;
    while (usedBuild.slice(-2).includes(build) && guard++ < 8) build = BUILDS[Math.floor(q() * BUILDS.length)];
    usedBuild.push(build);

    const posture: Posture =
      child ? 'ready'
      : old ? 'hunch'
      : h.includes('frail') ? 'stoop'
      : h.includes('boss') ? 'lean'
      : h.includes('worker') ? 'stoop'
      : POSTURES[Math.floor(q() * POSTURES.length)];

    const pool = fem ? F_HAIR : M_HAIR;
    let hairStyle = old ? 'greyshort' : child ? (fem ? 'pigtails' : 'crop') : pool[Math.floor(q() * pool.length)];
    let g2 = 0;
    while (usedHair.slice(-3).includes(hairStyle) && g2++ < 8) hairStyle = pool[Math.floor(q() * pool.length)];
    usedHair.push(hairStyle);

    const [skin, skinD] = SKINS[Math.floor(q() * SKINS.length)];
    const [topC, topD] = TOPS[(idx * 3 + Math.floor(q() * TOPS.length)) % TOPS.length];
    const B = BUILD[build];

    out[role.id] = {
      id: role.id, name: role.name, sex: fem ? 'f' : 'm', age,
      skin, skinD,
      hair: old ? '#b8b8b0' : HAIRS[Math.floor(q() * HAIRS.length)], grey: old,
      hairStyle: hairStyle as Spec['hairStyle'],
      stache: !fem && !child && q() < 0.3, glasses: q() < 0.22,
      eyeC: '#2a1a10', lip: fem ? '#9a4a4a' : undefined, fw: fem ? 0.95 : 1 + (build === 'huge' ? 0.1 : 0),
      top: (['shirt', 'jacket', 'cardigan', 'hoodie', 'uniform'] as const)[Math.floor(q() * 5)],
      topC, topD, inner: '#d8cfb4',
      bottom: fem && q() < 0.4 ? (q() < 0.5 ? 'skirtLong' : 'dressKnee') : 'trousers',
      botC: BOTS[Math.floor(q() * BOTS.length)], shoeC: '#2b2019',
      rolled: q() < 0.35,
      // generated geometry
      build, posture,
      height: child ? 0.72 : h.includes('tall') ? 1.14 : 0.94 + q() * 0.16,
      belly: B.belly, shoulder: B.shoulder, handS: 0.46 + q() * 0.14,
      sw: B.sw, hw: B.hw,
      legK: child ? 0.64 : 1, hs: child ? 1.28 : 1 - (build === 'huge' ? 0.06 : 0),
      gs: child ? 0.78 : old ? 0.94 : 1,
      acc: [
        ...(h.includes('worker') ? (['apron'] as const) : []),
        ...(old ? (['cane'] as const) : []),
        ...(q() < 0.25 ? (['suspenders', 'tie'] as const) : []),
      ] as GenSpec['acc'],
      accC: q() < 0.5 ? '#9c3a28' : '#e6ddc6',
    };
  });
  return out;
};

// Quick silhouette check: render the whole generated cast on one baseline and
// look at it. If two people read as the same black shape, re-roll the slug salt.
export const CastSheet: React.FC<{ cast: Record<string, GenSpec>; W: number; H: number; f?: number }> =
  ({ cast, W, H, f = 0 }) => {
    const ks = Object.keys(cast), gap = W / (ks.length + 1);
    return (
      <g>
        {ks.map((k, i) => (
          <BodyGen key={k} s={cast[k]} x={gap * (i + 1)} y={H * 0.92} k={H * 0.00026} f={f + i * 17} />
        ))}
      </g>
    );
  };
