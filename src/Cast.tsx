import React from 'react';
import { INK, RED, Hand, rng } from './Kit';
// ===== SCROLL KAOS CAST BUILDER: any new person in the permanent painted style. Same line, same grain, same muted colours as Noah and the ghosts. =====
export type Spec = {
  id: string; name: string; sex: 'm' | 'f'; age: 0 | 1 | 2 | 3; skin: string; skinD: string; hair: string; grey?: boolean;
  hairStyle: 'crop' | 'long' | 'bun' | 'greyshort' | 'messy' | 'cap' | 'pigtails' | 'bald'; blind?: boolean; stache?: boolean; glasses?: boolean; eyeC?: string; lip?: string; fw?: number;
  top: 'shirt' | 'jacket' | 'cardigan' | 'hoodie' | 'uniform'; topC: string; topD: string; inner?: string; sw?: number; hw?: number; rolled?: boolean;
  bottom: 'trousers' | 'skirtLong' | 'dressKnee'; botC: string; shoeC: string; legK?: number; hs?: number; gs?: number;
  // 'apron' | 'suspenders' | 'tie' are drawn by CastGen.tsx (the character template): costume
  // that says the job before the face does. Keep this union and CastGen's drawing in step.
  acc?: ('cane' | 'backpack' | 'satchel' | 'handbag' | 'redScarf' | 'shawl' | 'redRibbons' | 'redLaces' | 'badge' | 'apron' | 'suspenders' | 'tie')[]; accC?: string;
};
const mix = (a: string, b: string, t: number) => { const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)); const A = p(a), B = p(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); };
const Speck: React.FC<{ id: string; d: string; seed: number; n?: number; col?: string; op?: number; r?: number }> = ({ id, d, seed, n = 220, col = '#5a4630', op = 0.25, r = 2.2 }) => { const q = rng(seed); return (<g><clipPath id={id}><path d={d} /></clipPath><g clipPath={`url(#${id})`}>{Array.from({ length: n }).map((_, i) => <circle key={i} cx={-170 + q() * 340} cy={-250 + q() * 480} r={0.8 + q() * r} fill={col} opacity={op * (0.4 + q() * 0.8)} />)}</g></g>); };
export const FacePerson: React.FC<{ s: Spec; expr?: string; f?: number }> = ({ s, expr = 'neutral', f = 0 }) => {
  const O = mix(s.skinD, '#000000', 0.55), blink = !!s.blind || f % 96 < 4, fear = expr === 'fear', speak = expr === 'speak', fem = s.sex === 'f', fw = s.fw || 1;
  const face = fem ? 'M0,-225 C100,-228 150,-130 144,-20 C140,90 112,160 64,206 C36,230 -36,230 -64,206 C-112,160 -140,90 -144,-20 C-150,-130 -100,-228 0,-225Z' : 'M0,-225 C105,-230 158,-130 152,-20 C148,90 120,160 70,205 C40,228 -40,228 -70,205 C-120,160 -148,90 -152,-20 C-158,-130 -105,-230 0,-225Z';
  const ey = fear ? -28 : -20, er = fear ? 21 : fem ? 14 : 11, bro = fear ? -18 : 0, gx = Math.sin(f / 40) * 3; const gid = 'sk' + s.id, wr = s.age * 0.18;
  const eye = (sx: number) => (
    <g transform={`scale(${sx},1)`}>
      <ellipse cx={-62} cy={ey + 2} rx={48} ry={28} fill={s.skinD} opacity={0.3 + s.age * 0.06} />
      {blink ? <path d={`M-98,${ey} C-80,${ey + 8} -44,${ey + 8} -26,${ey}`} stroke={O} strokeWidth={7} fill="none" /> : (<g>
        <path d={`M-98,${ey} C-84,${ey - er - 6} -40,${ey - er - 6} -26,${ey} C-40,${ey + er} -84,${ey + er} -98,${ey}Z`} fill="#dcd4bc" stroke={O} strokeWidth={4} />
        <circle cx={-62 + gx * sx} cy={ey} r={fear ? 9 : fem ? 13 : 12} fill={s.eyeC || '#150c07'} /><circle cx={-62 + gx * sx} cy={ey} r={fear ? 5 : 7} fill="#05030a" /><circle cx={-58 + gx * sx} cy={ey - 4} r={3} fill="#f3eddc" />
        <path d={`M-102,${ey + 2} C-84,${ey - er - 10} -40,${ey - er - 10} -22,${ey + 2}`} stroke={O} strokeWidth={fem ? 10 : 8} fill="none" strokeLinecap="round" />
        {fem && <path d="M-102,-22 l-14,-10 M-98,-30 l-10,-14" stroke={O} strokeWidth={5} strokeLinecap="round" />}
        {s.age >= 2 && !fear && <path d={`M-98,${ey - 4} C-80,${ey - 14} -44,${ey - 14} -26,${ey - 6} L-26,${ey - 2} C-44,${ey - 8} -80,${ey - 8} -98,${ey}Z`} fill={O} opacity={0.3} />}
      </g>)}
      <path d={`M-100,${ey + 14} C-76,${ey + 38} -44,${ey + 36} -22,${ey + 14}`} stroke={s.skinD} strokeWidth={4} fill="none" opacity={0.3 + wr} />
      <path d={`M-112,${-52 + bro} C-84,${-84 + bro} -40,${-80 + bro} -12,${-52 + bro + (fear ? -8 : 6)}`} stroke={s.grey ? '#8c8c86' : s.hair} strokeWidth={fem ? 9 : 14} fill="none" strokeLinecap="round" />
      {s.age >= 1 && <path d={`M-124,${ey - 4} l-16,-8 M-124,${ey + 6} l-18,2 M-122,${ey + 16} l-14,12`} stroke={s.skinD} strokeWidth={3} opacity={0.3 + wr} />}
      {s.glasses && <ellipse cx={-62} cy={ey} rx={52} ry={40} fill="#cfe0ea" fillOpacity={0.18} stroke="#2a2018" strokeWidth={6} />}
    </g>
  );
  const lipC = s.lip || (fem ? '#a8585a' : '#8a5040');
  const mouth = speak ? (<g><path d="M-48,124 C-20,112 20,112 48,124 C40,160 -40,160 -48,124Z" fill="#2a0e0e" stroke={O} strokeWidth={6} /><path d="M-40,122 C-16,114 16,114 40,122 L36,134 C14,128 -14,128 -36,134Z" fill="#d9d0b6" /></g>) : fear ? (<path d="M-40,128 C-16,118 16,118 40,128 C32,150 -32,150 -40,128Z" fill="#2a0e0e" stroke={O} strokeWidth={6} />) : fem ? (<g><path d="M-44,128 C-20,114 -6,118 0,122 C6,118 20,114 44,128 C20,150 -20,150 -44,128Z" fill={lipC} stroke={O} strokeWidth={5} /><path d="M-44,128 C-16,132 16,132 44,128" stroke={O} strokeWidth={4} fill="none" /></g>) : (<g><path d="M-54,130 C-20,120 20,120 54,128" stroke={O} strokeWidth={8} fill="none" strokeLinecap="round" /><path d="M-54,130 q-8,6 -10,20 M54,128 q8,6 10,20" stroke={O} strokeWidth={5} fill="none" opacity={0.7 + s.age * 0.1} /></g>);
  return (
    <g transform={`scale(${fw},1)`}>
      <defs><radialGradient id={gid} cx="0.4" cy="0.35" r="0.8"><stop offset="0" stopColor={mix(s.skin, '#ffffff', 0.22)} /><stop offset="1" stopColor={s.skin} /></radialGradient></defs>
      {[-1, 1].map((q) => <ellipse key={q} cx={q * 152} cy={0} rx={24} ry={48} fill={mix(s.skin, '#000000', 0.08)} stroke={O} strokeWidth={6} />)}
      <path d={face} fill={`url(#${gid})`} stroke={O} strokeWidth={8} strokeLinejoin="round" />
      <Speck id={'spk' + s.id} d={face} seed={s.id.length * 7 + 3} n={240} col={mix(s.skinD, '#000000', 0.3)} />
      <path d="M60,-225 C120,-200 156,-130 150,-20 C146,90 120,160 70,205 C100,120 110,40 100,-30 C96,-120 90,-190 60,-225Z" fill="#000" opacity={0.18} />
      {s.age >= 1 && <path d="M-120,-150 C-70,-168 70,-168 120,-150 M-110,-120 C-60,-136 60,-136 110,-120 M-96,-98 C-50,-110 50,-110 96,-98" stroke={s.skinD} strokeWidth={4} fill="none" opacity={0.2 + wr} />}
      {eye(1)}{eye(-1)}
      <path d="M-12,-44 C-18,10 -28,40 -38,60 M12,-44 C16,0 22,30 30,52" stroke={O} strokeWidth={5} fill="none" opacity={0.6} />
      <path d="M-36,62 C-38,42 -14,40 0,46 C14,40 38,42 36,62 C20,82 -20,82 -36,62Z" fill={mix(s.skin, '#000000', 0.06)} opacity={0.7} stroke={O} strokeWidth={4} /><path d="M-20,70 q4,6 10,2 M10,72 q6,4 10,-2" stroke={O} strokeWidth={5} fill="none" />
      <path d="M-70,64 C-92,96 -84,114 -66,128 M70,64 C92,96 84,114 66,128" stroke={O} strokeWidth={4} fill="none" opacity={0.2 + wr * 1.5} />
      {s.stache && <path d="M-60,108 C-40,92 -14,96 0,106 C14,96 40,92 60,108 C40,124 14,116 0,114 C-14,116 -40,124 -60,108Z" fill={s.grey ? '#7c7c78' : s.hair} stroke={O} strokeWidth={4} />}
      {mouth}
      {!fem && s.age < 3 && !s.stache && <Speck id={'stb' + s.id} d="M-140,70 C-130,170 -60,230 0,228 C60,230 130,170 140,70 C100,120 60,140 0,140 C-60,140 -100,120 -140,70Z" seed={9} n={90} col="#1b130f" op={0.4} r={1.5} />}
      {s.glasses && <g><path d="M-10,-20 C-4,-26 4,-26 10,-20" stroke="#2a2018" strokeWidth={6} fill="none" /><ellipse cx={62} cy={ey} rx={52} ry={40} fill="#cfe0ea" fillOpacity={0.18} stroke="#2a2018" strokeWidth={6} /></g>}
    </g>
  );
};
const hairC = (s: Spec) => (s.grey ? '#b8b8b0' : s.hair);
export const HairBack: React.FC<{ s: Spec }> = ({ s }) => {
  const c = hairC(s);
  if (s.hairStyle === 'long') return <path d="M-172,-60 C-210,-270 210,-270 172,-60 C196,100 206,300 186,540 L-186,540 C-206,300 -196,100 -172,-60Z" fill={c} stroke={INK} strokeWidth={7} />;
  if (s.hairStyle === 'bun') return <circle cx={0} cy={-268} r={60} fill={c} stroke={INK} strokeWidth={7} />;
  if (s.hairStyle === 'pigtails') return <g>{[-1, 1].map((q) => <g key={q}><ellipse cx={q * 196} cy={70} rx={40} ry={120} fill={c} stroke={INK} strokeWidth={7} transform={`rotate(${q * -12} ${q * 196} 70)`} /><path d={`M${q * 176},-40 q${q * 30},-14 ${q * 40},20`} stroke={RED} strokeWidth={16} fill="none" strokeLinecap="round" /></g>)}</g>;
  return null;
};
export const HairFront: React.FC<{ s: Spec }> = ({ s }) => {
  const c = hairC(s), st = s.hairStyle;
  if (st === 'crop') return <g><path d="M-160,-34 C-186,-200 -84,-262 0,-258 C90,-262 186,-200 160,-34 C152,-96 124,-146 78,-172 L66,-140 L44,-186 L22,-150 L0,-196 L-20,-152 L-44,-188 L-64,-142 L-82,-170 C-128,-142 -150,-96 -160,-34Z" fill={c} stroke={INK} strokeWidth={7} strokeLinejoin="round" /></g>;
  if (st === 'messy') return <path d="M-164,-30 C-196,-190 -90,-262 0,-256 C96,-262 196,-190 164,-30 C158,-90 140,-130 112,-150 L120,-190 L84,-158 L76,-210 L44,-160 L26,-214 L2,-160 L-22,-218 L-44,-160 L-76,-206 L-84,-150 L-122,-186 L-112,-140 C-146,-110 -156,-80 -164,-30Z" fill={c} stroke={INK} strokeWidth={7} strokeLinejoin="round" />;
  if (st === 'long') return <g><path d="M0,-232 C-100,-234 -166,-150 -162,-20 C-150,-110 -90,-162 0,-166 C90,-162 150,-110 162,-20 C166,-150 100,-234 0,-232Z" fill={c} stroke={INK} strokeWidth={7} />{[-1, 1].map((q) => <path key={q} d={`M${q * 150},-30 C${q * 160},60 ${q * 150},170 ${q * 142},270 L${q * 118},270 C${q * 124},150 ${q * 128},60 ${q * 126},-20Z`} fill={c} stroke={INK} strokeWidth={6} />)}<path d="M0,-232 V-170" stroke="#000" strokeWidth={4} opacity={0.5} /></g>;
  if (st === 'bun') return <path d="M-158,-40 C-176,-200 -80,-250 0,-246 C80,-250 176,-200 158,-40 C140,-110 90,-170 0,-176 C-90,-170 -140,-110 -158,-40Z" fill={c} stroke={INK} strokeWidth={7} />;
  if (st === 'greyshort') return <g><path d="M-160,-40 C-176,-190 -80,-240 0,-236 C80,-240 176,-190 160,-40 C150,-100 120,-140 90,-160 C60,-130 -60,-130 -90,-160 C-120,-140 -150,-100 -160,-40Z" fill={c} stroke={INK} strokeWidth={7} /><path d="M-60,-170 q-10,-14 -4,-30 M10,-172 q4,-18 -2,-30 M70,-168 q12,-14 6,-30" stroke="#8a8a84" strokeWidth={4} fill="none" /></g>;
  if (st === 'pigtails') return <path d="M-164,-30 C-190,-330 190,-330 164,-30 C140,-100 100,-122 0,-126 C-100,-122 -140,-100 -164,-30Z" fill={c} stroke={INK} strokeWidth={7} />;
  if (st === 'cap') return <g><path d="M-158,-80 C-164,-70 -160,-40 -152,-20 L-130,-20 L-130,-80Z M158,-80 C164,-70 160,-40 152,-20 L130,-20 L130,-80Z" fill={s.hair} stroke={INK} strokeWidth={5} /><path d="M-176,-96 C-186,-262 186,-262 176,-96Z" fill="#1d2a40" stroke={INK} strokeWidth={7} /><rect x={-176} y={-112} width={352} height={30} fill="#10192a" stroke={INK} strokeWidth={5} /><path d="M-196,-86 C-120,-50 120,-50 196,-86 L184,-62 C100,-22 -100,-22 -184,-62Z" fill="#10192a" stroke={INK} strokeWidth={6} /><path d="M0,-210 l16,24 l-16,24 l-16,-24Z" fill="#b89a3c" stroke={INK} strokeWidth={4} /></g>;
  return null;
};
// ===== full body. Origin = feet centre, up is negative. adult about 3040 tall before gs/legK.
export const FullPerson: React.FC<{ s: Spec; x?: number; y?: number; k?: number; f?: number; expr?: string }> = ({ s, x = 0, y = 0, k = 1, f = 0, expr = 'neutral' }) => {
  const sw = s.sw || 300, hw = s.hw || 236, legK = s.legK || 1, hs = s.hs || 1, gs = s.gs || 1, dy = 1560 * (1 - legK), fem = s.sex === 'f';
  const acc = s.acc || []; const O = INK; const top = s.topC, topD = s.topD, inner = s.inner || '#d6ccb2';
  const longSk = s.bottom === 'skirtLong', kneeSk = s.bottom === 'dressKnee'; const skirtY = longSk ? -330 : -1000;
  const armX = sw - 300;
  return (
    <g transform={`translate(${x},${y}) scale(${k * gs})`}>
      <ellipse cx={0} cy={4} rx={400} ry={32} fill="#000" opacity={0.28} />
      {/* LEGS */}
      <g transform={`scale(1,${legK})`}>
        {[0, 1].map((i) => (<g key={i} transform={i ? 'scale(-1,1)' : ''}>
          <path d={`M${-hw + 4},-1560 C${-hw},-1100 ${-hw - 6},-700 -214,-170 L-98,-170 C-94,-700 -60,-1100 -6,-1560Z`} fill={longSk || kneeSk ? s.skin : s.botC} stroke={O} strokeWidth={8} strokeLinejoin="round" />
          {!(longSk || kneeSk) && <path d={`M${-hw + 4},-1560 C${-hw},-1100 ${-hw - 6},-700 -214,-170 L-170,-170 C-196,-700 -200,-1100 -196,-1560Z`} fill="#000" opacity={0.3} />}
          {kneeSk && <path d="M-214,-640 L-98,-640 L-98,-170 L-214,-170Z" fill={mixc(s.botC)} opacity={0.0} />}
          <path d="M-232,-200 H-92 L-80,-110 C-50,-90 -34,-50 -34,-14 C-34,14 -300,14 -302,-10 C-300,-60 -250,-96 -232,-200Z" fill={s.shoeC} stroke={O} strokeWidth={8} strokeLinejoin="round" /><path d="M-302,-4 H-34" stroke="#0a0706" strokeWidth={14} />
          {acc.includes('redLaces') && <path d="M-200,-150 H-110 M-196,-120 H-114" stroke={RED} strokeWidth={9} />}
        </g>))}
      </g>
      <g transform={`translate(0,${dy})`}>
        {/* skirt / dress */}
        {(longSk || kneeSk) && <g><path d={`M${-hw},-1700 C${-hw - 30},-1400 ${-hw - 150},${skirtY - 400} ${-hw - 190},${skirtY} L${hw + 190},${skirtY} C${hw + 150},${skirtY - 400} ${hw + 30},-1400 ${hw},-1700Z`} fill={s.botC} stroke={O} strokeWidth={8} strokeLinejoin="round" /><path d={`M${hw},-1700 C${hw + 30},-1400 ${hw + 150},${skirtY - 400} ${hw + 190},${skirtY} L40,${skirtY} C60,-1300 60,-1500 40,-1700Z`} fill="#000" opacity={0.25} /><path d={`M-120,-1600 C-150,-1300 -190,${skirtY - 300} -220,${skirtY} M60,-1600 C80,-1300 120,${skirtY - 300} 160,${skirtY}`} stroke={O} strokeWidth={4} fill="none" opacity={0.4} /></g>}
        {/* neck */}
        <path d="M-70,-2660 L-70,-2470 C-30,-2440 30,-2440 70,-2470 L70,-2660Z" fill={s.skin} stroke={O} strokeWidth={7} /><path d="M-70,-2600 L-70,-2470 C-30,-2440 30,-2440 70,-2470 L70,-2560 C20,-2520 -30,-2540 -70,-2600Z" fill="#000" opacity={0.18} />
        {/* torso */}
        {s.top === 'hoodie' && <path d="M-150,-2540 C-120,-2420 120,-2420 150,-2540 C200,-2420 100,-2380 0,-2380 C-100,-2380 -200,-2420 -150,-2540Z" fill={topD} stroke={O} strokeWidth={7} />}
        <path d={`M${-sw},-2470 C${-sw - 12},-2250 ${-hw - 20},-1950 ${-hw},-${s.top === 'jacket' ? 1380 : 1540} H${hw} C${hw + 20},-1950 ${sw + 12},-2250 ${sw},-2470 C150,-2540 -150,-2540 ${-sw},-2470Z`} fill={top} stroke={O} strokeWidth={8} strokeLinejoin="round" />
        <path d={`M${sw},-2470 C${sw + 12},-2250 ${hw + 20},-1950 ${hw},-${s.top === 'jacket' ? 1380 : 1540} H100 C150,-1900 190,-2200 170,-2500Z`} fill="#000" opacity={0.26} />
        <path d="M-130,-2300 q-30,200 -20,420 M120,-2200 q40,200 30,360" stroke={O} strokeWidth={4} fill="none" opacity={0.4} />
        {s.top === 'shirt' && <g><path d="M-96,-2504 L0,-2330 L-34,-2530Z M96,-2504 L0,-2330 L34,-2530Z" fill={mixc(top, 0.2)} stroke={O} strokeWidth={6} /><path d="M0,-2330 V-1560" stroke={O} strokeWidth={5} />{[0, 1, 2, 3, 4].map((q) => <circle key={q} cx={-16} cy={-2220 + q * 150} r={11} fill={inner} stroke={O} strokeWidth={4} />)}</g>}
        {s.top === 'cardigan' && <g><path d="M-120,-2490 L0,-2260 L120,-2490 L90,-2400 L0,-2200 L-90,-2400Z" fill={inner} stroke={O} strokeWidth={6} /><path d="M0,-2260 V-1540" stroke={O} strokeWidth={6} />{[0, 1, 2, 3].map((q) => <circle key={q} cx={-18} cy={-2150 + q * 170} r={14} fill={mixc(top, 0.5)} stroke={O} strokeWidth={4} />)}<rect x={-200} y={-1900} width={110} height={130} fill={topD} stroke={O} strokeWidth={5} opacity={0.8} /><rect x={90} y={-1900} width={110} height={130} fill={topD} stroke={O} strokeWidth={5} opacity={0.8} /></g>}
        {s.top === 'jacket' && <g><path d="M-170,-2520 L-60,-2250 L0,-2240 L60,-2250 L170,-2520 L110,-2570 L0,-2420 L-110,-2570Z" fill={topD} stroke={O} strokeWidth={7} strokeLinejoin="round" /><path d="M0,-2250 V-1380" stroke={O} strokeWidth={7} /><path d="M-16,-2240 V-1400 M16,-2240 V-1400" stroke="#1a1a14" strokeWidth={3} opacity={0.6} />{[-1, 1].map((q) => <path key={q} d={`M${q * 120},-1900 H${q * 230} V-1650 H${q * 120}Z`} fill={topD} stroke={O} strokeWidth={5} opacity={0.85} />)}</g>}
        {s.top === 'hoodie' && <g><path d="M-120,-2400 L-110,-2150 M120,-2400 L110,-2150" stroke={inner} strokeWidth={10} strokeLinecap="round" /><path d="M-170,-1860 H170 L210,-1560 H-210Z" fill={topD} stroke={O} strokeWidth={6} opacity={0.9} /></g>}
        {s.top === 'uniform' && <g><path d="M-96,-2504 L0,-2330 L-34,-2530Z M96,-2504 L0,-2330 L34,-2530Z" fill={mixc(top, 0.25)} stroke={O} strokeWidth={6} /><path d="M-18,-2380 L18,-2380 L30,-1950 L0,-1880 L-30,-1950Z" fill="#1a1a22" stroke={O} strokeWidth={5} /><path d="M0,-2330 V-1560" stroke={O} strokeWidth={5} opacity={0.5} /><rect x={-236} y={-1640} width={472} height={60} fill="#17110d" stroke={O} strokeWidth={6} /><rect x={-34} y={-1646} width={68} height={72} fill="#b89a3c" stroke={O} strokeWidth={5} />{[-1, 1].map((q) => <g key={q}><rect x={q * 190 - 50} y={-2480} width={100} height={36} fill="#10192a" stroke={O} strokeWidth={5} /><rect x={q * 120 - 40} y={-2250} width={80} height={110} fill={topD} stroke={O} strokeWidth={5} opacity={0.8} /></g>)}<path d="M-170,-2250 l50,-14 v70 l-50,-14Z" fill="#b89a3c" stroke={O} strokeWidth={4} /></g>}
        {acc.includes('badge') && <path d="M120,-2260 l22,-16 l22,16 l-8,28 h-28Z" fill="#b89a3c" stroke={O} strokeWidth={4} />}
        {acc.includes('satchel') && <g><path d="M-250,-2490 L250,-1680 L190,-1640 L-300,-2440Z" fill="#8a6a44" stroke={O} strokeWidth={6} /><rect x={150} y={-1900} width={250} height={280} rx={26} fill="#8a6a44" stroke={O} strokeWidth={8} transform="rotate(-6 280 -1760)" /></g>}
        {acc.includes('backpack') && <g><path d="M-190,-2480 C-200,-2200 -190,-1900 -160,-1700 M190,-2480 C200,-2200 190,-1900 160,-1700" stroke="#2b2b30" strokeWidth={40} fill="none" strokeLinecap="round" /><path d="M-190,-2480 C-200,-2200 -190,-1900 -160,-1700 M190,-2480 C200,-2200 190,-1900 160,-1700" stroke={O} strokeWidth={6} fill="none" opacity={0.5} /><rect x={-sw - 70} y={-2300} width={80} height={520} rx={30} fill="#33333a" stroke={O} strokeWidth={7} /><rect x={sw - 10} y={-2300} width={80} height={520} rx={30} fill="#33333a" stroke={O} strokeWidth={7} /></g>}
        {acc.includes('redScarf') && <g><path d="M-120,-2540 C-60,-2440 60,-2440 120,-2540 L130,-2470 C60,-2390 -60,-2390 -130,-2470Z" fill={RED} stroke={O} strokeWidth={7} /><path d="M40,-2440 L90,-2100 L150,-2120 L110,-2460Z" fill={RED} stroke={O} strokeWidth={7} /></g>}
        {acc.includes('shawl') && <g><path d={`M${-sw - 40},-2480 C-200,-2560 200,-2560 ${sw + 40},-2480 C${sw + 60},-2200 ${sw + 20},-1900 ${sw - 20},-1780 L0,-1980 L${-sw + 20},-1780 C${-sw - 20},-1900 ${-sw - 60},-2200 ${-sw - 40},-2480Z`} fill={s.accC || '#8a7aa0'} stroke={O} strokeWidth={8} strokeLinejoin="round" /><path d="M-200,-2200 q40,150 20,300 M200,-2200 q-40,150 -20,300" stroke={O} strokeWidth={4} fill="none" opacity={0.4} /></g>}
        {/* ARMS */}
        {[0, 1].map((i) => (<g key={i} transform={i ? 'scale(-1,1)' : ''}><g transform={`translate(${-armX},0)`}>
          <path d="M-388,-1940 C-402,-1800 -382,-1650 -368,-1530 L-286,-1530 C-284,-1650 -284,-1800 -292,-1940Z" fill={s.skin} stroke={O} strokeWidth={7} strokeLinejoin="round" /><path d="M-330,-1940 C-330,-1800 -320,-1650 -322,-1530 L-286,-1530 C-284,-1650 -284,-1800 -292,-1940Z" fill="#000" opacity={0.2} />
          <path d={`M-300,-2480 C-396,-2300 -410,-2100 -398,${s.rolled ? -1940 : -1560} L-282,${s.rolled ? -1940 : -1560} C-282,-2100 -260,-2300 -236,-2440Z`} fill={top} stroke={O} strokeWidth={8} strokeLinejoin="round" />
          {s.rolled && <rect x={-406} y={-2000} width={128} height={70} rx={14} fill={mixc(top, 0.2)} stroke={O} strokeWidth={6} />}
          {!s.rolled && <rect x={-404} y={-1610} width={124} height={50} rx={12} fill={topD} stroke={O} strokeWidth={5} />}
          <Hand x={-328} y={-1520} s={0.5} rot={180} skin={s.skin} shade={s.skinD} ext={[0.75, 0.7, 0.65, 0.55]} thumb={0.2} />
          {i === 1 && acc.includes('cane') && <g><path d="M-338,-1450 L-300,0" stroke="#3a2a1c" strokeWidth={26} strokeLinecap="round" /><path d="M-338,-1450 L-300,0" stroke={O} strokeWidth={5} fill="none" opacity={0.6} /><path d="M-338,-1450 C-338,-1520 -400,-1530 -400,-1470" stroke="#3a2a1c" strokeWidth={26} fill="none" strokeLinecap="round" /></g>}
          {i === 0 && acc.includes('handbag') && <g><path d="M-330,-1400 C-330,-1560 -250,-1560 -250,-1400" stroke={O} strokeWidth={8} fill="none" /><rect x={-420} y={-1400} width={240} height={190} rx={22} fill="#6a3a3e" stroke={O} strokeWidth={8} /><rect x={-330} y={-1340} width={60} height={40} fill="#b89a3c" stroke={O} strokeWidth={4} /></g>}
        </g></g>))}
        {/* HEAD */}
        <g transform={`translate(0,-2780) translate(0,250) scale(${hs}) translate(0,-250)`}><HairBack s={s} /><FacePerson s={s} expr={expr} f={f} /><HairFront s={s} /></g>
        {s.hairStyle === 'long' && [-1, 1].map((q) => <path key={q} d={`M${q * 150},-2500 C${q * 200},-2300 ${q * 210},-2100 ${q * 190},-1800 L${q * 130},-1800 C${q * 140},-2100 ${q * 130},-2300 ${q * 110},-2500Z`} fill={hairC(s)} stroke={O} strokeWidth={7} />)}
      </g>
    </g>
  );
};
function mixc(c: string, t = 0.25) { return mix(c, '#ffffff', t); }
// ===== THE CAST (muted palette, same style as Noah and the ghosts)
export const CAST: Record<string, Spec> = {
  mira: { id: 'mira', name: 'MIRA VALE', sex: 'f', age: 0, skin: '#d6a982', skinD: '#8c6240', hair: '#2a1a16', hairStyle: 'long', eyeC: '#2a1a10', lip: '#9a4a4a', fw: 0.96, top: 'jacket', topC: '#566b4a', topD: '#3a4a32', inner: '#d8cfb4', sw: 262, hw: 244, bottom: 'trousers', botC: '#3c4b66', shoeC: '#2b2019', acc: ['redScarf'] },
  elias: { id: 'elias', name: 'ELIAS GRAY', sex: 'm', age: 3, skin: '#c9a380', skinD: '#7a5a42', hair: '#b8b8b0', grey: true, hairStyle: 'greyshort', stache: true, glasses: false, top: 'cardigan', topC: '#6e5a3e', topD: '#4a3a28', inner: '#cfc6a8', sw: 280, hw: 236, bottom: 'trousers', botC: '#555a5c', shoeC: '#2b2019', gs: 0.96, acc: ['cane'] },
  rose: { id: 'rose', name: 'ROSE MARLOW', sex: 'f', age: 3, skin: '#d2b08e', skinD: '#85634a', hair: '#b8b8b0', grey: true, hairStyle: 'bun', glasses: true, eyeC: '#2a1a10', lip: '#9a5a5a', fw: 0.94, top: 'cardigan', topC: '#7a5a6a', topD: '#523a48', inner: '#d6ccb0', sw: 250, hw: 250, bottom: 'skirtLong', botC: '#4e4258', shoeC: '#2b2019', gs: 0.9, acc: ['shawl', 'handbag'], accC: '#8a7aa0' },
  sam: { id: 'sam', name: 'SAM CARTER (teen)', sex: 'm', age: 0, skin: '#b88a62', skinD: '#7a5636', hair: '#1c1612', hairStyle: 'messy', fw: 0.94, top: 'hoodie', topC: '#8a5a42', topD: '#5e3c2c', inner: '#d6ccb0', sw: 270, hw: 220, rolled: false, bottom: 'trousers', botC: '#3a4258', shoeC: '#d8d2c0', gs: 0.95, acc: ['backpack', 'redLaces'] },
  lily: { id: 'lily', name: 'LILY (child)', sex: 'f', age: 0, skin: '#e0bc9a', skinD: '#a07a58', hair: '#3a2418', hairStyle: 'pigtails', eyeC: '#3a2418', lip: '#b0605e', fw: 1.0, top: 'cardigan', topC: '#6e8aa0', topD: '#4a6478', inner: '#e4dcc4', sw: 220, hw: 210, bottom: 'dressKnee', botC: '#6e8aa0', shoeC: '#7a3a3a', legK: 0.62, hs: 1.3, gs: 0.8, acc: ['redRibbons'] },
  dale: { id: 'dale', name: 'OFFICER DALE REYES', sex: 'm', age: 2, skin: '#b88c68', skinD: '#7a5a3c', hair: '#1c1612', hairStyle: 'cap', stache: true, fw: 1.04, top: 'uniform', topC: '#3e506c', topD: '#26354a', inner: '#d6ccb0', sw: 316, hw: 252, rolled: false, bottom: 'trousers', botC: '#202838', shoeC: '#15110e', gs: 1.02, acc: ['badge'] },
};
