import React from 'react';
import { INK, RED, Hatch, Hand } from './Kit';
import type { Look } from './Kit';
import { FaceNoah, FaceGrin, FaceWoman, FaceChild } from './Faces';
// ===== SCROLL KAOS PERMANENT CHARACTERS (full body, feet to head). Origin = centre of feet on the ground, up is negative y. 1 head = 440 units, adult = about 3040 units. =====
export const NOAH: Look = { id: 'noah', skin: '#c19468', shade: '#85613f', hair: '#17120f', hairHi: '#3c2f27', face: 'long', eye: 'round', brow: 1.3, hairStyle: 'crop', age: 1, robe: '#4f7377', robeDark: '#2b4448', collar: '#dcd2b6', accent: '#c6a45a', iris: '#1a0f08', lip: '#8a4a3a' };
const GS = { skin: '#d8e0e2', shade: '#97a6aa', blue: '#a8b3bc', blueD: '#6e7f92' };
const shadeP = (d: string, o = 0.4, c = '#000') => <path d={d} fill={c} opacity={o} />;
export const FullMan: React.FC<{ look?: Look; view?: 'front' | 'three' | 'back'; x?: number; y?: number; s?: number; f?: number; expr?: any }> = ({ look: L = NOAH, view = 'front', x = 0, y = 0, s = 1, f = 0, expr = 'neutral' }) => {
  const back = view === 'back'; const sx = view === 'three' ? 0.86 : 1;
  const sh = L.robe, shd = L.robeDark, pants = '#4d3b2e', pantsD = '#2a1f18', boot = '#2b2019', lt = '#6a9296';
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <ellipse cx={0} cy={4} rx={420} ry={34} fill="#000" opacity={0.28} />
      <g transform={`scale(${sx},1)`}>
        {/* LEGS + BOOTS */}
        {[0, 1].map((i) => (
          <g key={i} transform={i ? 'scale(-1,1)' : ''}>
            <path d="M-232,-1560 C-236,-1100 -240,-700 -216,-170 L-96,-170 C-92,-700 -60,-1100 -6,-1560Z" fill={pants} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
            <path d="M-232,-1560 C-236,-1100 -240,-700 -216,-170 L-170,-170 C-196,-700 -200,-1100 -196,-1560Z" fill={pantsD} opacity={0.45} />
            <path d="M-228,-900 q70,34 130,0 M-224,-1300 q60,20 120,-4" stroke={INK} strokeWidth={4} fill="none" opacity={0.5} />
            <path d="M-222,-250 q60,28 124,0" stroke={INK} strokeWidth={4} fill="none" opacity={0.5} />
            <path d="M-232,-200 H-92 L-80,-110 C-50,-90 -34,-50 -34,-14 C-34,14 -300,14 -302,-10 C-300,-60 -250,-96 -232,-200Z" fill={boot} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
            <path d="M-302,-4 H-34" stroke="#0a0706" strokeWidth={16} /><path d="M-170,-190 H-90 M-176,-150 H-86" stroke="#7a6a58" strokeWidth={5} opacity={0.7} />
            <path d="M-230,-200 H-92 V-170 H-232Z" fill="#6a5440" stroke={INK} strokeWidth={5} />
          </g>
        ))}
        {/* NECK */}
        <path d="M-72,-2660 L-72,-2470 C-30,-2440 30,-2440 72,-2470 L72,-2660Z" fill={L.skin} stroke={INK} strokeWidth={7} />
        {shadeP('M-72,-2600 L-72,-2470 C-30,-2440 30,-2440 72,-2470 L72,-2560 C20,-2520 -30,-2540 -72,-2600Z', 0.3, L.shade)}
        {/* TORSO (shirt, untucked) */}
        <path d="M-300,-2470 C-312,-2250 -252,-1950 -236,-1540 H236 C252,-1950 312,-2250 300,-2470 C150,-2540 -150,-2540 -300,-2470Z" fill={sh} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
        {shadeP('M300,-2470 C312,-2250 252,-1950 236,-1540 H100 C150,-1900 190,-2200 170,-2500Z', 0.28, '#000')}
        <path d="M-236,-1560 q118,38 236,0 q118,38 236,0" stroke={INK} strokeWidth={5} fill="none" opacity={0.5} />
        <path d="M-130,-2300 q-30,200 -20,420 M120,-2200 q40,200 30,360 M-20,-2100 q10,200 0,400" stroke={INK} strokeWidth={4} fill="none" opacity={0.4} />

        {!back && (<g>
          <path d="M-96,-2504 L0,-2330 L-34,-2530Z M96,-2504 L0,-2330 L34,-2530Z" fill={lt} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
          <path d="M0,-2330 V-1560" stroke={INK} strokeWidth={5} />
          {[0, 1, 2, 3, 4].map((k) => <circle key={k} cx={-16} cy={-2220 + k * 150} r={11} fill={L.collar} stroke={INK} strokeWidth={4} />)}
          {[-1, 1].map((q) => <g key={q}><rect x={q > 0 ? 90 : -230} y={-2220} width={140} height={120} fill={shd} stroke={INK} strokeWidth={5} opacity={0.85} /><path d={`M${q > 0 ? 90 : -230},-2220 h140`} stroke={INK} strokeWidth={5} /></g>)}
        </g>)}
        {back && <path d="M-300,-2470 C-150,-2400 150,-2400 300,-2470 L300,-2420 C150,-2350 -150,-2350 -300,-2420Z" fill={lt} stroke={INK} strokeWidth={6} />}
        {/* SATCHEL strap + bag (signature item) */}
        <path d={back ? 'M-210,-2480 L250,-1680 L190,-1640 L-270,-2440Z' : 'M-250,-2490 L250,-1680 L190,-1640 L-300,-2440Z'} fill="#8a6a44" stroke={INK} strokeWidth={6} />
        <g transform={back ? 'translate(-190,0) scale(-1,1) translate(-190,0)' : ''}>
          <rect x={150} y={-1900} width={260} height={290} rx={26} fill="#8a6a44" stroke={INK} strokeWidth={8} transform="rotate(-6 280 -1760)" />
          <path d="M150,-1880 H410 V-1790 H150Z" fill="#6e5234" stroke={INK} strokeWidth={6} transform="rotate(-6 280 -1760)" /><rect x={262} y={-1830} width={34} height={60} rx={6} fill="#c6a45a" stroke={INK} strokeWidth={4} transform="rotate(-6 280 -1760)" />
        </g>
        {/* ARMS */}
        {[0, 1].map((i) => (
          <g key={i} transform={i ? 'scale(-1,1)' : ''}>
            <path d="M-388,-1940 C-402,-1800 -382,-1650 -368,-1530 L-286,-1530 C-284,-1650 -284,-1800 -292,-1940Z" fill={L.skin} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
            {shadeP('M-330,-1940 C-330,-1800 -320,-1650 -322,-1530 L-286,-1530 C-284,-1650 -284,-1800 -292,-1940Z', 0.3, L.shade)}
            <path d="M-300,-2480 C-396,-2300 -410,-2100 -398,-1940 L-282,-1940 C-282,-2100 -260,-2300 -236,-2440Z" fill={sh} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
            <rect x={-406} y={-2000} width={128} height={70} rx={14} fill={lt} stroke={INK} strokeWidth={6} />
            <path d="M-340,-2340 q20,120 10,300" stroke={INK} strokeWidth={4} fill="none" opacity={0.4} />

            {!back || true ? <Hand x={-328} y={-1520} s={0.5} rot={180} skin={L.skin} shade={L.shade} ext={[0.75, 0.7, 0.65, 0.55]} thumb={0.2} /> : null}
          </g>
        ))}
        {/* RED CORD on his left wrist (signature item, the red accent) */}
        <g transform={back ? 'scale(-1,1)' : ''}><path d="M-392,-1568 q55,26 108,0" stroke={RED} strokeWidth={14} fill="none" strokeLinecap="round" /><path d="M-300,-1560 q8,60 -6,100" stroke={RED} strokeWidth={6} fill="none" strokeLinecap="round" /></g>
        {/* HEAD */}
        {!back ? (<g transform="translate(0,-2780)"><FaceNoah expr={expr} f={f} turn={view === 'three' ? 0.5 : 0} /></g>) : (
          <g>
            <ellipse cx={0} cy={-2800} rx={176} ry={226} fill={L.hair} stroke={INK} strokeWidth={8} />
            <ellipse cx={-176} cy={-2790} rx={30} ry={52} fill={L.skin} stroke={INK} strokeWidth={6} /><ellipse cx={176} cy={-2790} rx={30} ry={52} fill={L.skin} stroke={INK} strokeWidth={6} />
            <path d="M-150,-2980 C-60,-3040 60,-3040 150,-2980 M-160,-2900 C-40,-2960 40,-2960 160,-2900 M0,-3010 V-2720 M-120,-2760 q120,70 240,0" stroke={L.hairHi} strokeWidth={5} fill="none" opacity={0.7} />

            <path d="M-120,-2600 q120,50 240,0 L150,-2560 q-150,30 -300,0Z" fill={L.hair} stroke={INK} strokeWidth={5} />
          </g>
        )}
      </g>
    </g>
  );
};
// ---- shared ghost bits
const Drips: React.FC<{ x: number; y: number; n?: number; f?: number }> = ({ x, y, n = 4, f = 0 }) => (<g>{Array.from({ length: n }).map((_, i) => { const t = ((f / 10 + i * 0.27) % 1); return <path key={i} d={`M${x + (i - n / 2) * 60},${y + t * 160} q-8,16 0,26 q8,-10 0,-26Z`} fill="#9fb3c4" stroke={INK} strokeWidth={3} opacity={0.8 * (1 - t)} />; })}</g>);
const Puddle: React.FC<{ rx: number; f?: number }> = ({ rx, f = 0 }) => (<g><ellipse cx={0} cy={4} rx={rx} ry={rx * 0.1} fill="#1b2a3a" opacity={0.7} stroke={INK} strokeWidth={4} /><ellipse cx={0} cy={4} rx={rx * (0.5 + ((f / 12) % 1) * 0.5)} ry={rx * 0.05} fill="none" stroke="#9fb3c4" strokeWidth={3} opacity={0.5} /></g>);
const PaleFoot: React.FC<{ x: number; flip?: boolean }> = ({ x, flip }) => (<g transform={`translate(${x},0) ${flip ? 'scale(-1,1)' : ''}`}><path d="M-70,-90 C-72,-30 -92,-4 -80,10 C-40,26 40,24 70,8 C84,-6 60,-30 56,-90Z" fill={GS.skin} stroke={INK} strokeWidth={7} strokeLinejoin="round" />{[-50, -22, 6, 34, 58].map((q, i) => <path key={i} d={`M${q},8 v-16`} stroke={INK} strokeWidth={3} opacity={0.7} />)}{shadeP('M20,-90 C20,-30 40,-10 70,8 C84,-6 60,-30 56,-90Z', 0.3, GS.shade)}</g>);
// ===== GHOST 1: THE LONG-HAIR WOMAN (about 2950 tall)
export const GhostWoman: React.FC<{ x?: number; y?: number; s?: number; f?: number }> = ({ x = 0, y = 0, s = 1, f = 0 }) => {
  const sway = Math.sin(f / 18) * 10;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <Puddle rx={400} f={f} />
      {/* back hair */}
      <path d={`M-250,-2800 C-330,-2400 -320,-1900 -300,-1380 L-120,-1380 L120,-1380 L300,-1380 C330,-1900 330,-2400 250,-2800 C150,-3000 -150,-3000 -250,-2800Z`} fill="#0b0a0e" stroke={INK} strokeWidth={7} />
      {/* legs + feet */}
      {[-110, 110].map((q, i) => <g key={i}><path d={`M${q - 52},-420 C${q - 54},-300 ${q - 44},-180 ${q - 40},-90 L${q + 40},-90 C${q + 44},-180 ${q + 54},-300 ${q + 52},-420Z`} fill={GS.skin} stroke={INK} strokeWidth={7} /><PaleFoot x={q} flip={i === 1} /></g>)}
      {/* arms (long, hanging) */}
      {[0, 1].map((i) => <g key={i} transform={i ? 'scale(-1,1)' : ''}><path d={`M-250,-2470 C-330,-2200 -350,-1700 -350,-1250 C-345,-1000 -340,-900 -330,-820 L-262,-820 C-270,-1000 -260,-1250 -250,-1700 C-230,-2000 -190,-2300 -170,-2440Z`} fill={GS.skin} stroke={INK} strokeWidth={7} />{shadeP('M-300,-2300 C-310,-1900 -300,-1300 -300,-820 L-262,-820 C-270,-1000 -260,-1250 -250,-1700Z', 0.28, GS.shade)}<Hand x={-296} y={-830} s={0.5} rot={180} skin={GS.skin} shade={GS.shade} ext={[0.9, 1, 0.95, 0.8]} long thumb={0.1} /></g>)}
      {/* neck */}
      <path d="M-64,-2680 L-64,-2480 C-20,-2450 20,-2450 64,-2480 L64,-2680Z" fill={GS.skin} stroke={INK} strokeWidth={7} />
      {/* dress */}
      <path d="M-230,-2480 C-250,-2300 -200,-2000 -190,-1800 C-300,-1400 -400,-800 -440,-360 L-380,-330 L-330,-380 L-270,-320 L-210,-390 L-150,-310 L-90,-390 L-30,-320 L30,-396 L90,-318 L150,-392 L214,-314 L274,-388 L332,-330 L384,-384 L440,-360 C400,-800 300,-1400 190,-1800 C200,-2000 250,-2300 230,-2480 C120,-2540 -120,-2540 -230,-2480Z" fill="#e6e4d8" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
      {shadeP('M230,-2480 C250,-2300 200,-2000 190,-1800 C300,-1400 400,-800 440,-360 L384,-384 L332,-330 L274,-388 L214,-314 C190,-900 130,-1500 100,-1800 C140,-2100 160,-2300 130,-2500Z', 0.22, '#3a4a5a')}
      <path d="M-120,-2000 C-150,-1500 -200,-900 -250,-380 M20,-1900 C30,-1400 20,-800 10,-400 M130,-1900 C170,-1400 230,-900 300,-380 M-60,-1200 q50,40 110,0" stroke={INK} strokeWidth={4} fill="none" opacity={0.4} />

      <path d="M-120,-2490 C-60,-2400 60,-2400 120,-2490" stroke={INK} strokeWidth={6} fill="none" />
      <path d="M-300,-700 q40,90 20,200 M180,-560 q-30,80 -10,160" stroke="#8a97a0" strokeWidth={10} fill="none" opacity={0.35} />
      <Drips x={0} y={-390} n={5} f={f} />
      <g transform={`translate(0,-2770) rotate(${8 + sway * 0.2} 0 250)`}><FaceWoman f={f} /></g>
      {/* front hair strands over shoulders */}
      {[-1, 1].map((q) => <path key={q} d={`M${q * 120},-2560 C${q * 190},-2200 ${q * 170},-1700 ${q * 150},-1300 L${q * 90},-1300 C${q * 100},-1700 ${q * 110},-2200 ${q * 70},-2560Z`} fill="#0b0a0e" stroke={INK} strokeWidth={6} />)}
    </g>
  );
};
// ===== GHOST 2: THE GRINNER (about 3000 tall). Stiff, upright, hollow eyes, an impossible smile. No blood.
export const GhostGrin: React.FC<{ x?: number; y?: number; s?: number; f?: number }> = ({ x = 0, y = 0, s = 1, f = 0 }) => {
  const sk = GS.blue, skD = GS.blueD, shirt = '#76866c', shirtD = '#4b5a46', pants = '#3b3d4a', pantsD = '#22232d';
  const tilt = Math.sin(f / 22) * 2.2;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <ellipse cx={0} cy={4} rx={420} ry={34} fill="#000" opacity={0.28} />
      {[0, 1].map((i) => <g key={i} transform={i ? 'scale(-1,1)' : ''}>
        <path d="M-226,-1560 C-232,-1100 -236,-700 -214,-170 L-96,-170 C-92,-700 -60,-1100 -6,-1560Z" fill={pants} stroke={INK} strokeWidth={8} />{shadeP('M-226,-1560 C-232,-1100 -236,-700 -214,-170 L-168,-170 C-194,-700 -196,-1100 -194,-1560Z', 0.45, '#000')}
        <path d="M-232,-200 H-92 L-80,-110 C-50,-90 -34,-50 -34,-14 C-34,14 -300,14 -302,-10 C-300,-60 -250,-96 -232,-200Z" fill="#1a1a20" stroke={INK} strokeWidth={8} /></g>)}
      <path d="M-72,-2660 L-72,-2470 C-30,-2440 30,-2440 72,-2470 L72,-2660Z" fill={sk} stroke={INK} strokeWidth={7} />
      <path d="M-296,-2470 C-306,-2250 -250,-1950 -236,-1540 H236 C250,-1950 306,-2250 296,-2470 C150,-2540 -150,-2540 -296,-2470Z" fill={shirt} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
      {shadeP('M296,-2470 C306,-2250 250,-1950 236,-1540 H100 C150,-1900 190,-2200 170,-2500Z', 0.3, '#000')}
      <path d="M-100,-2504 L0,-2340 L-40,-2540Z M100,-2504 L0,-2340 L40,-2540Z" fill="#e0e2d8" stroke={INK} strokeWidth={6} /><path d="M0,-2340 V-1560" stroke={INK} strokeWidth={5} />
      <rect x={-210} y={-2200} width={130} height={150} fill={shirtD} stroke={INK} strokeWidth={5} /><path d="M-190,-2200 v90 M-150,-2200 v110" stroke="#d9d2b4" strokeWidth={8} />

      {[0, 1].map((i) => <g key={i} transform={i ? 'scale(-1,1)' : ''}>
        <path d="M-380,-1940 C-400,-1800 -392,-1500 -384,-1100 L-298,-1100 C-296,-1640 -286,-1800 -292,-1940Z" fill={sk} stroke={INK} strokeWidth={7} />{shadeP('M-336,-1940 C-336,-1800 -330,-1640 -330,-1400 L-298,-1400 C-296,-1640 -286,-1800 -292,-1940Z', 0.3, skD)}
        <path d="M-296,-2480 C-380,-2300 -396,-2100 -388,-1940 L-282,-1940 C-282,-2100 -258,-2300 -236,-2440Z" fill={shirt} stroke={INK} strokeWidth={8} />
        <Hand x={-340} y={-1100} s={0.72} rot={180} skin={sk} shade={skD} ext={[0.6, 0.6, 0.55, 0.5]} thumb={0.3} /></g>)}
      <g transform={`translate(0,-2780) rotate(${tilt} 0 220)`}><FaceGrin f={f} /></g>
    </g>
  );
};
// ===== GHOST 3: THE DRENCHED CHILD (about 1850 tall). Wet, hollow eyes, bare feet. No blood.
export const GhostChild: React.FC<{ x?: number; y?: number; s?: number; f?: number }> = ({ x = 0, y = 0, s = 1, f = 0 }) => {
  const coat = '#b79a4c', coatD = '#7d6628';
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <Puddle rx={330} f={f} />
      {[-70, 70].map((q, i) => <g key={i}><path d={`M${q - 40},-300 C${q - 42},-200 ${q - 34},-120 ${q - 30},-70 L${q + 30},-70 C${q + 34},-120 ${q + 42},-200 ${q + 40},-300Z`} fill={GS.skin} stroke={INK} strokeWidth={7} /><g transform="scale(0.72)"><PaleFoot x={q / 0.72} flip={i === 1} /></g></g>)}
      <path d="M-160,-1000 C-200,-700 -230,-500 -250,-360 L250,-360 C230,-500 200,-700 160,-1000Z" fill={coat} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
      {shadeP('M160,-1000 C200,-700 230,-500 250,-360 L120,-360 C140,-600 140,-800 100,-1000Z', 0.3, '#000')}
      <path d="M-250,-360 q50,30 100,0 q50,30 100,0 q50,30 100,0 q50,30 100,0 q50,30 100,0" stroke={INK} strokeWidth={5} fill="none" opacity={0.6} />
      <path d="M0,-1000 V-380" stroke={INK} strokeWidth={5} />{[-880, -760, -640, -520].map((q) => <circle key={q} cx={-18} cy={q} r={13} fill={coatD} stroke={INK} strokeWidth={4} />)}

      {[0, 1].map((i) => <g key={i} transform={i ? 'scale(-1,1)' : ''}>
        <path d="M-170,-1000 C-250,-900 -270,-760 -270,-600 L-190,-600 C-190,-760 -150,-880 -120,-960Z" fill={coat} stroke={INK} strokeWidth={8} />
        <path d="M-272,-620 C-274,-520 -266,-440 -262,-380 L-198,-380 C-198,-440 -192,-520 -190,-620Z" fill={GS.skin} stroke={INK} strokeWidth={7} />
        <Hand x={-230} y={-380} s={0.34} rot={180} skin={GS.skin} shade={GS.shade} ext={[0.7, 0.7, 0.6, 0.5]} thumb={0.2} /></g>)}
      <path d="M-50,-1090 L-50,-980 C-20,-960 20,-960 50,-980 L50,-1090Z" fill={GS.skin} stroke={INK} strokeWidth={7} />
      <path d="M-200,-1040 C-130,-960 130,-960 200,-1040 L180,-980 C100,-930 -100,-930 -180,-980Z" fill={coatD} stroke={INK} strokeWidth={7} />
      <g transform={`translate(0,-1330) rotate(${Math.sin(f / 20) * 3} 0 250) scale(1.45)`}><FaceChild f={f} /></g>
      <Drips x={0} y={-370} n={5} f={f} />
    </g>
  );
};
