import React from 'react';
import { INK, rng } from './Kit';
// ===== Painted faces for the permanent cast. Origin (0,0) = centre of the face. Half-width about 150, top -225, chin +215 (same size as Head). =====
const Speck: React.FC<{ id: string; d: string; seed: number; n?: number; col?: string; op?: number; r?: number }> = ({ id, d, seed, n = 240, col = '#5a4630', op = 0.25, r = 2.2 }) => {
  const q = rng(seed);
  return (<g><clipPath id={id}><path d={d} /></clipPath><g clipPath={`url(#${id})`}>{Array.from({ length: n }).map((_, i) => <circle key={i} cx={-170 + q() * 340} cy={-250 + q() * 480} r={0.8 + q() * r} fill={col} opacity={op * (0.4 + q() * 0.8)} />)}</g></g>);
};
const Halo: React.FC = () => (<defs><radialGradient id="hollowhalo"><stop offset="0" stopColor="#05060a" stopOpacity="0.95" /><stop offset="0.6" stopColor="#1a2230" stopOpacity="0.6" /><stop offset="1" stopColor="#1a2230" stopOpacity="0" /></radialGradient><radialGradient id="skinlight" cx="0.4" cy="0.35" r="0.8"><stop offset="0" stopColor="#e2c298" /><stop offset="1" stopColor="#b88a60" /></radialGradient></defs>);
// ===== NOAH: weathered, deep-set eyes, heavy brows, lines, stubble
export const FaceNoah: React.FC<{ expr?: string; f?: number; turn?: number }> = ({ expr = 'neutral', f = 0, turn = 0 }) => {
  const blink = f % 96 < 4, fear = expr === 'fear', speak = expr === 'speak';
  const O = '#33201a', skD = '#7e5a3c', hair = '#15110e';
  const face = 'M0,-225 C105,-230 158,-130 152,-20 C148,90 120,160 70,205 C40,228 -40,228 -70,205 C-120,160 -148,90 -152,-20 C-158,-130 -105,-230 0,-225Z';
  const ey = fear ? -28 : -20, er = fear ? 21 : 11, bro = fear ? -18 : 0, gx = Math.sin(f / 40) * 3 + turn * 6;
  const eye = (sx: number) => (
    <g transform={`scale(${sx},1)`}>
      <ellipse cx={-62} cy={ey + 2} rx={48} ry={28} fill={skD} opacity={0.42} />
      {blink ? <path d={`M-98,${ey} C-80,${ey + 8} -44,${ey + 8} -26,${ey}`} stroke={O} strokeWidth={7} fill="none" /> : (<g>
        <path d={`M-98,${ey} C-84,${ey - er - 6} -40,${ey - er - 6} -26,${ey} C-40,${ey + er} -84,${ey + er} -98,${ey}Z`} fill="#d9d0b6" stroke={O} strokeWidth={4} />
        <circle cx={-62 + gx * sx} cy={ey} r={fear ? 9 : 12} fill="#150c07" /><circle cx={-58 + gx * sx} cy={ey - 4} r={3} fill="#f3eddc" />
        <path d={`M-102,${ey + 2} C-84,${ey - er - 10} -40,${ey - er - 10} -22,${ey + 2}`} stroke={O} strokeWidth={8} fill="none" strokeLinecap="round" />
        {!fear && <path d={`M-98,${ey - 4} C-80,${ey - 14} -44,${ey - 14} -26,${ey - 6} L-26,${ey - 2} C-44,${ey - 8} -80,${ey - 8} -98,${ey}Z`} fill={O} opacity={0.35} />}
      </g>)}
      <path d={`M-100,${ey + 14} C-76,${ey + 38} -44,${ey + 36} -22,${ey + 14}`} stroke={skD} strokeWidth={4} fill="none" opacity={0.7} /><path d={`M-90,${ey + 26} C-70,${ey + 48} -48,${ey + 46} -32,${ey + 28}`} stroke={skD} strokeWidth={3} fill="none" opacity={0.4} />
      <path d={`M-112,${-52 + bro} C-84,${-86 + bro} -40,${-82 + bro} -12,${-52 + bro + (fear ? -8 : 6)}`} stroke={hair} strokeWidth={13} fill="none" strokeLinecap="round" />
      <path d={`M-124,${ey - 4} l-16,-8 M-124,${ey + 6} l-18,2 M-122,${ey + 16} l-14,12`} stroke={skD} strokeWidth={3} opacity={0.6} />
    </g>
  );
  const mouth = speak ? (<g><path d="M-48,124 C-20,112 20,112 48,124 C40,160 -40,160 -48,124Z" fill="#2a0e0e" stroke={O} strokeWidth={6} /><path d="M-40,122 C-16,114 16,114 40,122 L36,134 C14,128 -14,128 -36,134Z" fill="#d9d0b6" /></g>) : fear ? (<g><path d="M-40,128 C-16,118 16,118 40,128 C32,150 -32,150 -40,128Z" fill="#2a0e0e" stroke={O} strokeWidth={6} /></g>) : (<g><path d="M-54,130 C-20,120 20,120 54,128" stroke={O} strokeWidth={8} fill="none" strokeLinecap="round" /><path d="M-54,130 q-8,6 -10,20 M54,128 q8,6 10,20" stroke={O} strokeWidth={5} fill="none" /><path d="M-26,148 C-8,156 8,156 26,148" stroke={skD} strokeWidth={4} fill="none" opacity={0.7} /></g>);
  return (
    <g transform={`translate(${turn * 18},0)`}>
      <Halo />
      {[-1, 1].map((q) => <g key={q}><ellipse cx={q * 154} cy={0} rx={24} ry={50} fill="#bf9468" stroke={O} strokeWidth={6} /><path d={`M${q * 150},-24 q${q * 14},10 ${q * 2},30 q${q * -8},6 ${q * -4},14`} stroke={O} strokeWidth={4} fill="none" /></g>)}
      <path d={face} fill="url(#skinlight)" stroke={O} strokeWidth={8} strokeLinejoin="round" />
      <Speck id="spkN" d={face} seed={5} n={260} />
      <Speck id="stubN" d="M-140,70 C-130,170 -60,230 0,228 C60,230 130,170 140,70 C100,120 60,140 0,140 C-60,140 -100,120 -140,70Z" seed={9} n={140} col="#1b130f" op={0.5} r={1.6} />
      <path d="M60,-225 C120,-200 158,-130 152,-20 C148,90 120,160 70,205 C100,120 110,40 100,-30 C96,-120 90,-190 60,-225Z" fill="#000" opacity={0.2} />
      <path d="M-120,-150 C-70,-168 70,-168 120,-150 M-110,-120 C-60,-136 60,-136 110,-120 M-96,-98 C-50,-110 50,-110 96,-98" stroke={skD} strokeWidth={4} fill="none" opacity={0.5} />
      {eye(1)}{eye(-1)}
      <path d="M-12,-44 C-18,10 -28,40 -38,60 M12,-44 C16,0 22,30 30,52" stroke={O} strokeWidth={5} fill="none" opacity={0.7} />
      <path d="M-38,62 C-40,40 -14,38 0,46 C14,38 40,40 38,62 C20,84 -20,84 -38,62Z" fill="#c29a70" opacity={0.7} stroke={O} strokeWidth={4} /><path d="M-22,70 q4,6 10,2 M12,72 q6,4 10,-2" stroke={O} strokeWidth={5} fill="none" />
      <path d="M-70,64 C-92,96 -84,114 -66,128 M70,64 C92,96 84,114 66,128" stroke={O} strokeWidth={4} fill="none" opacity={0.55} />
      <ellipse cx={-92} cy={72} rx={22} ry={40} fill={skD} opacity={0.2} /><ellipse cx={92} cy={72} rx={22} ry={40} fill={skD} opacity={0.2} />
      {mouth}
      <path d="M0,184 q-2,14 4,18" stroke={skD} strokeWidth={4} fill="none" opacity={0.6} />
      {/* hair, grey at the temples */}
      <path d="M-160,-34 C-186,-200 -84,-262 0,-258 C90,-262 186,-200 160,-34 C152,-96 124,-146 78,-172 L66,-140 L44,-186 L22,-150 L0,-196 L-20,-152 L-44,-188 L-64,-142 L-82,-170 C-128,-142 -150,-96 -160,-34Z" fill={hair} stroke={O} strokeWidth={7} strokeLinejoin="round" />
      <path d="M-150,-60 C-146,-100 -130,-130 -104,-152 M150,-60 C146,-100 130,-130 104,-152" stroke="#9a9a92" strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.8} />
      <path d="M-100,-210 C-60,-240 60,-240 100,-210 M-60,-190 l-6,-30 M0,-196 l2,-40 M60,-190 l8,-30" stroke="#4a3e34" strokeWidth={4} fill="none" opacity={0.8} />
    </g>
  );
};
// ===== THE GRINNER: bone-white face, hollow sockets, dark tear tracks, a full row of teeth
export const FaceGrin: React.FC<{ f?: number }> = ({ f = 0 }) => {
  const face = 'M0,-225 C100,-228 150,-140 146,-30 C142,70 118,150 70,200 C40,222 -40,222 -70,200 C-118,150 -142,70 -146,-30 C-150,-140 -100,-228 0,-225Z';
  const gx = Math.sin(f / 14) * 5; const yU = (x: number) => 62 + 42 * (1 - (x / 128) ** 2), yL = (x: number) => 62 + 100 * (1 - (x / 128) ** 2);
  return (
    <g>
      <Halo />
      {[-1, 1].map((q) => <ellipse key={q} cx={q * 150} cy={-10} rx={18} ry={44} fill="#cfd8d8" stroke={INK} strokeWidth={6} />)}
      <path d={face} fill="#e3e8e6" stroke={INK} strokeWidth={8} />
      <Speck id="spkG" d={face} seed={12} n={200} col="#6e8a9a" op={0.22} />
      <path d="M62,-225 C120,-200 150,-140 146,-30 C142,70 118,150 70,200 C96,120 104,40 96,-30 C92,-120 90,-190 62,-225Z" fill="#4e6a7c" opacity={0.3} />
      <path d="M-134,40 C-120,110 -90,150 -60,190 M134,40 C120,110 90,150 60,190" stroke="#8a9ca4" strokeWidth={6} fill="none" opacity={0.55} />
      {[-1, 1].map((q) => <g key={q}>
        <ellipse cx={q * 62} cy={-16} rx={64} ry={58} fill="url(#hollowhalo)" />
        <path d={`M${q * 62 - q * 44},-14 C${q * 62 - q * 44},-54 ${q * 62 + q * 42},-60 ${q * 62 + q * 44},-12 C${q * 62 + q * 40},34 ${q * 62 - q * 38},40 ${q * 62 - q * 44},-14Z`} fill="#04050a" stroke={INK} strokeWidth={5} />
        <circle cx={q * 62 + gx} cy={-12} r={7} fill="#f4f6f2" />
        <path d={`M${q * 116},-72 C${q * 80},-100 ${q * 40},-96 ${q * 18},-66`} stroke={INK} strokeWidth={8} fill="none" strokeLinecap="round" />
        <path d={`M${q * 66},24 C${q * 74},70 ${q * 60},120 ${q * 68},176`} stroke="#150a0d" strokeWidth={13} fill="none" strokeLinecap="round" opacity={0.88} /><path d={`M${q * 46},26 C${q * 44},60 ${q * 38},88 ${q * 42},124`} stroke="#150a0d" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.8} /><path d={`M${q * 80},60 q${q * 12},20 ${q * 4},44`} stroke="#150a0d" strokeWidth={5} fill="none" opacity={0.7} />
        <path d={`M${q * 128},62 q${q * 14},-26 ${q * 6},-62`} stroke={INK} strokeWidth={5} fill="none" opacity={0.7} />
      </g>)}
      <path d="M-10,-30 C-14,20 -22,40 -26,52 M10,-30 C14,20 22,40 26,52" stroke={INK} strokeWidth={4} fill="none" opacity={0.6} /><circle cx={-12} cy={60} r={6} fill="#14161c" /><circle cx={12} cy={60} r={6} fill="#14161c" />
      <path d="M-128,62 C-70,118 70,118 128,62 C84,196 -84,196 -128,62Z" fill="#1a0a0c" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
      {Array.from({ length: 11 }).map((_, i) => { const x = -112 + i * 22.4; return <rect key={'u' + i} x={x - 10} y={yU(x) - 2} width={20} height={26 + 6 * (1 - Math.abs(x) / 128)} rx={4} fill="#ebe8da" stroke={INK} strokeWidth={3} />; })}
      {Array.from({ length: 9 }).map((_, i) => { const x = -90 + i * 22.5; return <rect key={'l' + i} x={x - 10} y={yL(x) - 22} width={20} height={22} rx={4} fill="#e2dfd0" stroke={INK} strokeWidth={3} />; })}
      <path d="M-122,64 C-70,112 70,112 122,64" stroke="#7a3a40" strokeWidth={5} fill="none" opacity={0.7} />
      <path d="M-40,200 C-20,214 20,214 40,200" stroke={INK} strokeWidth={4} fill="none" opacity={0.5} />
      <path d="M-156,-40 C-178,-210 -72,-262 0,-256 C80,-262 178,-206 156,-40 C142,-100 128,-146 102,-170 L86,-128 L62,-178 L32,-130 L0,-182 L-30,-132 L-62,-178 L-86,-130 L-104,-170 C-132,-140 -146,-100 -156,-40Z" fill="#14161c" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    </g>
  );
};
// ===== THE LONG-HAIR WOMAN: face fully visible between two curtains of hair
export const FaceWoman: React.FC<{ f?: number }> = ({ f = 0 }) => {
  const face = 'M0,-215 C90,-218 130,-130 126,-30 C122,70 100,140 58,190 C34,212 -34,212 -58,190 C-100,140 -122,70 -126,-30 C-130,-130 -90,-218 0,-215Z'; const gx = Math.sin(f / 18) * 5;
  return (
    <g>
      <Halo />
      <path d={face} fill="#dfe6e8" stroke={INK} strokeWidth={8} />
      <Speck id="spkW" d={face} seed={21} n={160} col="#6e8a9a" op={0.2} />
      <path d="M50,-215 C100,-190 126,-130 126,-30 C122,70 100,140 58,190 C84,110 90,40 84,-30 C80,-120 76,-180 50,-215Z" fill="#4e6a7c" opacity={0.28} />
      {[-1, 1].map((q) => <g key={q}>
        <ellipse cx={q * 48} cy={-14} rx={58} ry={64} fill="url(#hollowhalo)" />
        <path d={`M${q * 48 - q * 36},-12 C${q * 48 - q * 34},-62 ${q * 48 + q * 36},-64 ${q * 48 + q * 36},-10 C${q * 48 + q * 32},40 ${q * 48 - q * 30},44 ${q * 48 - q * 36},-12Z`} fill="#04050a" stroke={INK} strokeWidth={5} />
        <circle cx={q * 48 + gx} cy={-8} r={6} fill="#f4f6f2" />
        <path d={`M${q * 52},34 C${q * 58},84 ${q * 46},130 ${q * 54},190`} stroke="#150a0d" strokeWidth={11} fill="none" strokeLinecap="round" opacity={0.85} />
        <path d={`M${q * 88},-64 C${q * 100},-30 ${q * 104},0 ${q * 98},30`} stroke="#7e92a4" strokeWidth={3} fill="none" opacity={0.5} />
      </g>)}
      <path d="M-6,-10 C-10,30 -16,50 -20,62 M6,-10 C10,30 14,50 20,62" stroke={INK} strokeWidth={4} fill="none" opacity={0.5} />
      <ellipse cx={0} cy={118} rx={22} ry={34} fill="#05060a" stroke={INK} strokeWidth={5} />
      <path d="M-46,100 C-20,128 20,128 46,100" stroke={INK} strokeWidth={5} fill="none" opacity={0.8} />
      <path d="M-120,-110 C-70,-40 -30,50 -34,176 M104,-80 C60,-10 30,70 40,160" stroke="#0b0a0e" strokeWidth={6} fill="none" opacity={0.9} />
      {[-1, 1].map((q) => <path key={q} d={`M0,-218 C${q * 60},-216 ${q * 130},-170 ${q * 134},-60 C${q * 140},40 ${q * 150},150 ${q * 150},250 L${q * 100},250 C${q * 108},150 ${q * 104},40 ${q * 100},-30 C${q * 96},-110 ${q * 60},-176 0,-190Z`} fill="#0b0a0e" stroke={INK} strokeWidth={7} />)}
      <path d="M0,-216 V-176" stroke="#46444f" strokeWidth={4} /><path d="M-100,-100 C-110,0 -110,100 -112,200 M100,-100 C110,0 110,100 112,200" stroke="#3a3946" strokeWidth={4} fill="none" opacity={0.8} />
    </g>
  );
};
// ===== THE DRENCHED CHILD: round pale face, huge black eyes, wide toothy grin, dark tear tracks
export const FaceChild: React.FC<{ f?: number }> = ({ f = 0 }) => {
  const face = 'M0,-215 C110,-215 160,-130 156,-20 C152,80 110,170 0,185 C-110,170 -152,80 -156,-20 C-160,-130 -110,-215 0,-215Z'; const gx = Math.sin(f / 12) * 4;
  const yU = (x: number) => 70 + 22 * (1 - (x / 96) ** 2), yL = (x: number) => 70 + 76 * (1 - (x / 96) ** 2);
  return (
    <g>
      <Halo />
      {[-1, 1].map((q) => <ellipse key={q} cx={q * 156} cy={10} rx={20} ry={40} fill="#c9d4da" stroke={INK} strokeWidth={6} />)}
      <path d={face} fill="#d9e3e8" stroke={INK} strokeWidth={8} />
      <Speck id="spkC" d={face} seed={31} n={140} col="#6e8a9a" op={0.2} />
      <path d="M62,-215 C120,-200 160,-130 156,-20 C152,80 110,170 0,185 C80,150 110,60 104,-30 C100,-120 96,-190 62,-215Z" fill="#4e6a7c" opacity={0.26} />
      {[-1, 1].map((q) => <g key={q}>
        <ellipse cx={q * 60} cy={-8} rx={70} ry={80} fill="url(#hollowhalo)" />
        <ellipse cx={q * 60} cy={-8} rx={46} ry={56} fill="#030305" stroke={INK} strokeWidth={5} /><ellipse cx={q * 60} cy={-8} rx={38} ry={48} fill="none" stroke="#3a3f4a" strokeWidth={3} />
        <circle cx={q * 60 - q * 10 + gx} cy={-24} r={9} fill="#f4f6f2" /><circle cx={q * 60 + q * 12 + gx} cy={10} r={4} fill="#f4f6f2" opacity={0.8} />
        <path d={`M${q * 56},50 C${q * 64},90 ${q * 52},120 ${q * 58},160`} stroke="#0b0d12" strokeWidth={12} fill="none" strokeLinecap="round" opacity={0.85} />
        <path d={`M${q * 100},-76 C${q * 80},-92 ${q * 50},-88 ${q * 30},-70`} stroke={INK} strokeWidth={5} fill="none" opacity={0.6} />
      </g>)}
      <path d="M-8,40 q-6,14 4,18 M8,40 q6,14 -4,18" stroke={INK} strokeWidth={4} fill="none" opacity={0.7} />
      <path d="M-96,70 C-50,100 50,100 96,70 C60,172 -60,172 -96,70Z" fill="#1a0a0c" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
      {Array.from({ length: 8 }).map((_, i) => { const x = -84 + i * 24; return <rect key={'u' + i} x={x - 11} y={yU(x) - 2} width={22} height={28} rx={4} fill="#ebe8da" stroke={INK} strokeWidth={3} />; })}
      {Array.from({ length: 7 }).map((_, i) => { const x = -72 + i * 24; return <rect key={'l' + i} x={x - 11} y={yL(x) - 24} width={22} height={24} rx={4} fill="#e2dfd0" stroke={INK} strokeWidth={3} />; })}
      <path d="M-96,70 q-16,-20 -8,-52 M96,70 q16,-20 8,-52" stroke={INK} strokeWidth={4} fill="none" opacity={0.6} />
      <path d="M-166,-30 C-190,-190 -90,-232 0,-228 C90,-232 190,-190 166,-30 C154,-100 142,-132 122,-160 L100,-120 L78,-176 L50,-128 L20,-186 L-8,-130 L-40,-184 L-62,-124 L-92,-170 L-110,-120 C-140,-120 -154,-90 -166,-30Z" fill="#1c1612" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
      <path d="M-120,-150 l-6,34 M-50,-170 l-4,40 M40,-170 l6,38 M110,-140 l8,32" stroke="#4a3e34" strokeWidth={4} opacity={0.8} />
    </g>
  );
};
