import React from 'react';
import { INK, RED, Hatch, Hand, rng } from './Kit';
import type { Look } from './Kit';
import { NOAH } from './Body';
import { FaceNoah } from './Faces';
// ===== Kit (j) It's Inside Your House: THE HOOVED THING (original design, inspired by the Pine Barrens legend) + Noah in sleep clothes =====
export const sf = (f: number, n = 3) => Math.floor(f / n) * n;
// smooth tapered stroke as a filled outline. pts = centre line, w0 -> w1 widths.
const cr = (p: number[][], n = 10) => { const o: number[][] = []; for (let i = 0; i < p.length - 1; i++) { const p0 = p[Math.max(0, i - 1)], p1 = p[i], p2 = p[i + 1], p3 = p[Math.min(p.length - 1, i + 2)]; for (let k = 0; k < n; k++) { const t = k / n, t2 = t * t, t3 = t2 * t; o.push([0, 1].map((j) => 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3))); } } o.push(p[p.length - 1]); return o; };
export const taper = (pts: number[][], w0: number, w1: number, spikes = 0, seed = 1) => {
  const c = cr(pts); const L: number[][] = [], R: number[][] = []; const q = rng(seed);
  for (let i = 0; i < c.length; i++) {
    const a = c[Math.max(0, i - 1)], b = c[Math.min(c.length - 1, i + 1)]; let dx = b[0] - a[0], dy = b[1] - a[1]; const d = Math.hypot(dx, dy) || 1; dx /= d; dy /= d;
    const t = i / (c.length - 1); let w = (w0 + (w1 - w0) * t) / 2; const sp = spikes && i % 4 === 2 ? spikes * (0.6 + q() * 0.6) * (1 - t * 0.6) : 0;
    L.push([c[i][0] - dy * (w + sp), c[i][1] + dx * (w + sp)]); R.push([c[i][0] + dy * w, c[i][1] - dx * w]);
  }
  const f = (p: number[]) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`;
  return 'M' + L.map(f).join(' L') + ' L' + R.reverse().map(f).join(' L') + 'Z';
};
// closed shape with a jagged (hairy) outline. pts = loop of control points.
export const furry = (pts: number[][], spike: number, seed = 1, every = 3) => {
  const n = pts.length; const ext = [pts[n - 1], ...pts, pts[0], pts[1]]; const c = cr(ext, 12).slice(12, 12 + n * 12); const q = rng(seed); let cx = 0, cy = 0; pts.forEach((p) => { cx += p[0]; cy += p[1]; }); cx /= pts.length; cy /= pts.length;
  const o: string[] = [];
  c.forEach((p, i) => { let dx = p[0] - cx, dy = p[1] - cy; const d = Math.hypot(dx, dy) || 1; dx /= d; dy /= d; const k = i % every === 0 ? spike * (0.5 + q()) : 0; o.push(`${(p[0] + dx * k).toFixed(1)},${(p[1] + dy * k).toFixed(1)}`); });
  return 'M' + o.join(' L') + 'Z';
};
export const C = {
  fur: '#161311', fur2: '#262019', furHi: '#3d342a', hide: '#57483a', hideD: '#3a3027', bone: '#c9b98a', boneD: '#8f7d57', boneL: '#e4d7aa', horn: '#7d6d50', hornD: '#4e432f',
  eye: '#6f6a3c', eyeL: '#c8c08a', wing: '#2a2320', wingM: '#3b322c', socket: '#0b0807',
};
const Hoof: React.FC<{ x: number; y: number; s?: number; flip?: boolean }> = ({ x, y, s = 1, flip }) => (
  <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
    <path d="M-62,0 L-56,-70 Q-44,-96 -10,-92 L-4,0Z" fill={C.bone} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
    <path d="M4,0 L8,-92 Q46,-94 58,-66 L74,0Z" fill={C.bone} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
    <path d="M-50,-30 h40 M14,-34 h46" stroke={C.boneD} strokeWidth={5} opacity={0.8} />
    <path d="M-66,-92 C-60,-130 66,-130 62,-88" fill={C.fur} stroke={INK} strokeWidth={7} />
  </g>
);
// one deer-like leg (hip at 0,0 of the group). ph = walk phase -1..1
const Leg: React.FC<{ ph?: number; far?: boolean }> = ({ ph = 0, far = false }) => {
  const kx = 150 + ph * 50, ax = -90 + ph * 90, px = -30 + ph * 130, hx = ph * 150;
  const lift = Math.max(0, ph) * 40;
  const col = far ? '#0f0d0c' : C.fur;
  return (
    <g>
      <path d={furry([[-170, -120], [120, -160], [kx + 110, 300], [kx + 40, 520], [kx - 120, 460], [-150, 200]], 30, far ? 3 : 4, 2)} fill={col} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
      <path d={taper([[0, 0], [kx * 0.6, 260], [kx, 470]], 300, 170)} fill={col} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
      <path d={taper([[kx, 470], [kx * 0.2 + ax * 0.8, 700], [ax, 910 - lift]], 170, 90)} fill={col} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
      <path d={taper([[ax, 910 - lift], [px * 0.6 + ax * 0.4, 1200 - lift], [px, 1440 - lift]], 84, 62)} fill={col} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
      {/* tiered shaggy fur */}
      {[0, 1, 2].map((i) => <path key={i} d={taper([[kx * (0.15 + i * 0.25) - 40, 60 + i * 140], [kx * (0.3 + i * 0.25) - 30, 230 + i * 140], [kx * (0.4 + i * 0.25) - 60, 380 + i * 140]], 120, 10, 34, 5 + i)} fill={far ? '#14110f' : C.fur2} stroke={INK} strokeWidth={5} strokeLinejoin="round" opacity={0.95} />)}
      <path d={taper([[kx - 20, 470], [kx * 0.3 + ax * 0.7 - 20, 700]], 110, 20, 26, 9)} fill={far ? '#14110f' : C.fur2} stroke={INK} strokeWidth={5} />
      <Hoof x={hx + px * 0.1} y={1550 - lift} s={1} />
    </g>
  );
};
const Claw3: React.FC<{ x: number; y: number; s?: number; rot?: number; curl?: number }> = ({ x, y, s = 1, rot = 0, curl = 1 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <path d={taper([[0, -40], [10, 40], [0, 110]], 120, 90)} fill={C.hide} stroke={INK} strokeWidth={7} />
    {[-40, 0, 40].map((q, i) => <path key={i} d={taper([[q * 0.8, 100], [q * 1.2 + 20 * curl, 230], [q + 70 * curl, 330], [q + 120 * curl, 300 + 40 * (1 - curl)]], 40, 4)} fill={C.bone} stroke={INK} strokeWidth={6} strokeLinejoin="round" />)}
  </g>
);
export { Claw3 };
// horse-like skull head with coiled goat horns. Facing right. jaw = mouth open degrees.
export const SkullHead: React.FC<{ f?: number; jaw?: number; glow?: number }> = ({ f = 0, jaw = 0, glow = 0.6 }) => {
  const j = jaw + (Math.floor(f / 6) % 7 === 3 ? 6 : 0);
  const horn = (back: boolean) => (
    <g opacity={back ? 0.75 : 1} transform={back ? 'translate(60,-14) scale(0.9)' : ''}>
      <path d={taper([[-30, -120], [-80, -300], [-260, -380], [-410, -260], [-400, -80], [-280, -20], [-220, -120], [-270, -190]], 120, 20, back ? 0 : 14, 3)} fill={back ? C.hornD : C.horn} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
      {!back && [0.12, 0.22, 0.32, 0.42, 0.52, 0.62].map((t, i) => { const p = cr([[-30, -120], [-80, -300], [-260, -380], [-410, -260], [-400, -80], [-280, -20], [-220, -120], [-270, -190]]); const k = Math.floor(t * (p.length - 1)); const a = p[k], b = p[k + 1]; const dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1; const w = 52 * (1 - t * 0.8); return <path key={i} d={`M${a[0] - (dy / d) * w},${a[1] + (dx / d) * w} Q${a[0] + (dx / d) * 14},${a[1] + (dy / d) * 14} ${a[0] + (dy / d) * w},${a[1] - (dx / d) * w}`} stroke={C.hornD} strokeWidth={6} fill="none" />; })}
    </g>
  );
  return (
    <g>
      {horn(true)}
      {/* lower jaw */}
      <g transform={`rotate(${j} -40 110)`}>
        <path d="M-60,110 C40,170 260,160 470,118 L476,92 C300,120 120,120 -40,80Z" fill={C.boneD} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
        {Array.from({ length: 7 }).map((_, i) => <path key={i} d={`M${220 + i * 36},${108 - i * 2} v-26 h28 v${26 - 2}`} fill={C.boneL} stroke={INK} strokeWidth={4} />)}
      </g>
      {/* cranium + long snout */}
      <path d="M-150,10 C-170,-120 -70,-190 40,-170 C140,-150 220,-90 330,-40 C430,4 500,24 530,60 C540,84 520,100 480,96 C380,92 260,96 150,100 C60,104 -20,100 -80,80 C-130,64 -148,40 -150,10Z" fill={C.bone} stroke={INK} strokeWidth={9} strokeLinejoin="round" />
      <path d="M-120,60 C-40,90 160,92 300,90 C400,88 470,90 520,82 C510,96 490,100 460,98 C340,96 160,104 40,104 C-40,104 -100,90 -120,60Z" fill={C.boneD} opacity={0.7} />
      <path d="M40,-170 C160,-140 300,-60 420,-10 C330,-40 200,-90 60,-120Z" fill={C.boneL} opacity={0.55} />
      {/* upper teeth */}
      {Array.from({ length: 7 }).map((_, i) => <path key={i} d={`M${230 + i * 36},${90 - i * 1} v24 h28 v-24`} fill={C.boneL} stroke={INK} strokeWidth={4} />)}
      {/* cracks and ridges */}
      <path d="M-60,-140 l30,50 l-14,40 M180,-80 l20,40 l-26,30 M300,-20 l30,10 M110,30 q60,-10 120,6" stroke={C.boneD} strokeWidth={5} fill="none" />
      <Hatch x={-140} y={-20} w={300} h={110} angle={-55} gap={14} seed={21} sw={2.4} op={0.35} />
      {/* nasal slit */}
      <path d="M380,-4 C420,8 460,24 486,44 C450,40 410,26 376,12Z" fill={C.socket} stroke={INK} strokeWidth={5} />
      {/* eye socket with muddy eye */}
      <ellipse cx={70} cy={-56} rx={78} ry={58} fill={C.socket} stroke={INK} strokeWidth={8} />
      <circle cx={84} cy={-52} r={70} fill={C.eye} opacity={0.18 * glow} filter="url(#soft2)" />
      <circle cx={84} cy={-52} r={24} fill={C.eye} /><circle cx={84} cy={-52} r={11} fill="#14120a" /><circle cx={92} cy={-60} r={6} fill={C.eyeL} />
      <path d="M-2,-112 C40,-128 110,-126 150,-96" stroke={C.boneD} strokeWidth={14} fill="none" strokeLinecap="round" />
      {horn(false)}
    </g>
  );
};
// Full body. Facing right (flip for left). Origin = between the hooves on the ground. About 3700 tall.
export const Beast: React.FC<{ x: number; y: number; s?: number; f?: number; walk?: boolean; wings?: number; neck?: number; jaw?: number; flip?: boolean; arm?: number; glow?: number; rim?: string; legsOnly?: boolean }> = ({ x, y, s = 1, f = 0, walk = false, wings = 0, neck = 0, jaw = 0, flip = false, arm = 0, glow = 0.6, rim, legsOnly = false }) => {
  const ph = walk ? Math.sin(sf(f, 3) / 5) : 0;
  const breathe = Math.sin(sf(f, 3) / 9) * 12;
  const tailW = Math.sin(sf(f, 3) / 7) * 60;
  const wingL = wings > 0.5;
  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <ellipse cx={0} cy={6} rx={520} ry={40} fill="#000" opacity={0.35} />
      {/* tail: forked, leathery */}
      <g>
        <path d={taper([[-260, -1620], [-560, -1300], [-760, -620 + tailW * 0.4], [-900 - tailW, -160], [-1180 - tailW, -60]], 110, 26)} fill={C.hide} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
        <path d={`M${-1170 - tailW},-80 L${-1330 - tailW},-170 L${-1250 - tailW},-50 L${-1340 - tailW},20 Z`} fill={C.hideD} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
      </g>
      {/* far leg */}
      <g transform={`translate(-60,-1550) rotate(${-ph * 5})`}><Leg ph={-ph} far /></g>
      {!legsOnly && (<g>
        {/* far wing (spread only) */}
        {wingL && <g opacity={0.9}><path d="M-80,-2760 L-520,-3700 L-1500,-3150 C-1420,-2950 -1320,-2860 -1260,-2700 C-1140,-2800 -1060,-2700 -980,-2520 C-880,-2620 -760,-2540 -680,-2380 C-560,-2500 -360,-2440 -200,-2300Z" fill="#221c19" stroke={INK} strokeWidth={8} strokeLinejoin="round" /></g>}
        {/* far arm */}
        <g transform={`rotate(${arm * 0.6} 200 -2560)`}><path d={taper([[180, -2560], [330, -2120], [470, -1820]], 120, 70)} fill="#100e0c" stroke={INK} strokeWidth={7} /><g transform="translate(470,-1820) scale(0.85)" opacity={0.9}><Claw3 x={0} y={0} rot={-20} /></g></g>
        {/* folded near wing (bat-like) or spread */}
        {!wingL ? (
          <g>
            <path d="M-120,-2760 L-330,-3180 L-470,-1900 C-420,-1960 -380,-1880 -340,-1960 C-300,-1900 -260,-1980 -220,-2000Z" fill={C.wingM} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
            <path d="M-120,-2760 L-330,-3180 M-330,-3180 L-470,-1900 M-330,-3180 L-340,-1960 M-330,-3180 L-220,-2000" stroke={C.wing} strokeWidth={22} strokeLinecap="round" fill="none" />
            <path d="M-120,-2760 L-330,-3180 M-330,-3180 L-470,-1900 M-330,-3180 L-340,-1960 M-330,-3180 L-220,-2000" stroke={INK} strokeWidth={4} fill="none" opacity={0.7} />
            <path d={taper([[-340, -3190], [-330, -3290]], 34, 4)} fill={C.bone} stroke={INK} strokeWidth={5} />
          </g>
        ) : (
          <g>
            <path d="M-60,-2700 L-700,-3900 L-1800,-3300 C-1700,-3080 -1590,-2980 -1540,-2780 C-1400,-2900 -1280,-2780 -1200,-2560 C-1080,-2680 -930,-2600 -840,-2380 C-700,-2520 -460,-2440 -260,-2280Z" fill={C.wingM} stroke={INK} strokeWidth={9} strokeLinejoin="round" />
            <path d="M-60,-2700 L-700,-3900 M-700,-3900 L-1800,-3300 M-700,-3900 L-1540,-2780 M-700,-3900 L-1200,-2560 M-700,-3900 L-840,-2380" stroke={C.wing} strokeWidth={26} strokeLinecap="round" fill="none" />
            <path d="M-60,-2700 L-700,-3900 M-700,-3900 L-1800,-3300 M-700,-3900 L-1540,-2780 M-700,-3900 L-1200,-2560 M-700,-3900 L-840,-2380" stroke={INK} strokeWidth={5} fill="none" opacity={0.7} />
            <path d={taper([[-700, -3900], [-720, -4040]], 40, 4)} fill={C.bone} stroke={INK} strokeWidth={5} />
          </g>
        )}
        {/* hanging leathery skin folds (back) */}
        <path d="M-420,-2760 C-600,-2400 -620,-1900 -560,-1380 C-520,-1300 -470,-1400 -430,-1300 C-390,-1220 -330,-1330 -280,-1260 C-240,-1180 -190,-1300 -150,-1280 C-140,-1700 -130,-2200 -80,-2760Z" fill={C.hide} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
        <path d="M-400,-2300 q60,40 120,10 M-420,-2000 q70,50 150,10 M-410,-1700 q80,40 170,0 M-360,-2550 q50,30 110,0" stroke={C.hideD} strokeWidth={6} fill="none" />
        {/* torso, thick hair: hunched mass */}
        <path d={furry([[-380, -1620], [-520, -2100], [-400, -2700], [-80, -(2980 + breathe)], [300, -2840], [500, -2480], [450, -2000], [260, -1680], [0, -1540]], 46, 41, 2)} fill={C.fur} stroke={INK} strokeWidth={9} strokeLinejoin="round" />
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={taper([[-330 + i * 30, -2700 + i * 230], [-80 + i * 30, -2620 + i * 240], [220 - i * 20, -2560 + i * 230]], 20, 150, 34, 11 + i)} fill={C.fur2} stroke={INK} strokeWidth={5} opacity={0.9} />)}
        <path d={`M140,-2840 C330,-2700 450,-2400 390,-2000 C360,-1820 300,-1720 240,-1680 C320,-2000 330,-2400 140,-2840Z`} fill="#000" opacity={0.35} />
        <Hatch x={-280} y={-2700} w={560} h={1000} angle={-70} gap={16} seed={31} sw={3} op={0.35} color="#3d342a" />
      </g>)}
      {/* near leg */}
      <g transform={`translate(40,-1520) rotate(${ph * 5})`}><Leg ph={ph} /></g>
      {!legsOnly && (<g>
        {/* neck + head */}
        <g transform={`rotate(${neck} 200 -2700)`}>
          <path d={taper([[160, -2500], [380, -2820], [470, -3120], [620, -3300]], 380, 230)} fill={C.fur} stroke={INK} strokeWidth={9} strokeLinejoin="round" />
          <path d={taper([[60, -2720], [260, -3020], [420, -3290], [560, -3440]], 150, 40, 50, 17)} fill={C.fur2} stroke={INK} strokeWidth={6} />
          <path d="M330,-2620 q80,-200 150,-420 M400,-2560 q90,-200 170,-450 M300,-2700 q50,-140 100,-260" stroke="#3d342a" strokeWidth={7} fill="none" opacity={0.6} />
          <path d={taper([[280, -2560], [470, -2900], [560, -3200]], 120, 40)} fill="#000" opacity={0.3} />
          <g transform="translate(640,-3330) rotate(28) scale(1.35)"><SkullHead f={f} jaw={jaw} glow={glow} /></g>
        </g>
        {/* near arm with 3 talons */}
        <g transform={`rotate(${arm} 240 -2540)`}><path d={taper([[240, -2540], [430, -2080], [570, -1780]], 140, 80)} fill={C.fur} stroke={INK} strokeWidth={8} /><path d={taper([[240, -2460], [380, -2180]], 70, 10, 22, 4)} fill={C.fur2} stroke={INK} strokeWidth={5} /><Claw3 x={570} y={-1780} rot={-24} /></g>
        {rim && <path d="M-330,-2700 C-460,-2400 -470,-2000 -420,-1500" stroke={rim} strokeWidth={14} fill="none" opacity={0.6} />}
      </g>)}
    </g>
  );
};
// ===== NOAH in sleep clothes (permanent FullMan drawing: same face, hair, body, height, red cord; satchel and boots left off, pajama colours)
export const PJ: Look = { ...NOAH, id: 'noahpj', robe: '#566476', robeDark: '#343e4c', collar: '#d8d2c0' };
export const NoahSleep: React.FC<{ view?: 'front' | 'three' | 'back'; x?: number; y?: number; s?: number; f?: number; expr?: any; knife?: boolean; keys?: boolean; closed?: boolean }> = ({ view = 'front', x = 0, y = 0, s = 1, f = 0, expr = 'neutral', knife = false, keys = false, closed = false }) => {
  const L = PJ; const back = view === 'back'; const sx = view === 'three' ? 0.86 : 1;
  const sh = L.robe, shd = L.robeDark, pants = '#465062', pantsD = '#2a3140', lt = '#8a98a8';
  const ff = closed ? Math.floor(f / 96) * 96 + 1 : f;
  const shadeP = (d: string, o = 0.4, c = '#000') => <path d={d} fill={c} opacity={o} />;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <ellipse cx={0} cy={4} rx={420} ry={34} fill="#000" opacity={0.28} />
      <g transform={`scale(${sx},1)`}>
        {[0, 1].map((i) => (
          <g key={i} transform={i ? 'scale(-1,1)' : ''}>
            <path d="M-232,-1560 C-236,-1100 -240,-700 -222,-220 L-100,-220 C-96,-700 -60,-1100 -6,-1560Z" fill={pants} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
            <path d="M-232,-1560 C-236,-1100 -240,-700 -222,-220 L-176,-220 C-196,-700 -200,-1100 -196,-1560Z" fill={pantsD} opacity={0.45} />
            <path d="M-228,-900 q70,34 130,0 M-224,-1300 q60,20 120,-4" stroke={INK} strokeWidth={4} fill="none" opacity={0.5} />
            <path d="M-236,-250 H-96 V-206 H-236Z" fill={pantsD} stroke={INK} strokeWidth={6} />
            {/* bare foot */}
            <path d="M-222,-206 C-224,-130 -240,-70 -282,-40 C-306,-20 -296,10 -258,10 L-74,10 C-48,10 -46,-22 -72,-44 C-96,-74 -100,-140 -102,-206Z" fill={L.skin} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
            <path d="M-250,8 v-18 M-214,10 v-16 M-178,10 v-16 M-142,10 v-14" stroke={INK} strokeWidth={4} opacity={0.6} />
            {shadeP('M-150,-206 C-150,-120 -140,-60 -110,-30 L-74,10 C-48,10 -46,-22 -72,-44 C-96,-74 -100,-140 -102,-206Z', 0.3, L.shade)}
          </g>
        ))}
        <path d="M-72,-2660 L-72,-2470 C-30,-2440 30,-2440 72,-2470 L72,-2660Z" fill={L.skin} stroke={INK} strokeWidth={7} />
        {shadeP('M-72,-2600 L-72,-2470 C-30,-2440 30,-2440 72,-2470 L72,-2560 C20,-2520 -30,-2540 -72,-2600Z', 0.3, L.shade)}
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
        {[0, 1].map((i) => (
          <g key={i} transform={i ? 'scale(-1,1)' : ''}>
            <path d="M-388,-1940 C-402,-1800 -382,-1650 -368,-1530 L-286,-1530 C-284,-1650 -284,-1800 -292,-1940Z" fill={L.skin} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
            {shadeP('M-330,-1940 C-330,-1800 -320,-1650 -322,-1530 L-286,-1530 C-284,-1650 -284,-1800 -292,-1940Z', 0.3, L.shade)}
            <path d="M-300,-2480 C-396,-2300 -410,-2100 -398,-1940 L-282,-1940 C-282,-2100 -260,-2300 -236,-2440Z" fill={sh} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
            <rect x={-406} y={-2000} width={128} height={70} rx={14} fill={lt} stroke={INK} strokeWidth={6} />
            <path d="M-340,-2340 q20,120 10,300" stroke={INK} strokeWidth={4} fill="none" opacity={0.4} />
            <Hand x={-328} y={-1520} s={0.5} rot={180} skin={L.skin} shade={L.shade} ext={[0.75, 0.7, 0.65, 0.55]} thumb={0.2} />
          </g>
        ))}
        <g transform={back ? 'scale(-1,1)' : ''}><path d="M-392,-1568 q55,26 108,0" stroke={RED} strokeWidth={14} fill="none" strokeLinecap="round" /><path d="M-300,-1560 q8,60 -6,100" stroke={RED} strokeWidth={6} fill="none" strokeLinecap="round" /></g>
        {knife && <g transform={`translate(${back ? -328 : 328},-1480)`}><path d="M-18,0 h36 v150 h-36Z" fill="#2a2420" stroke={INK} strokeWidth={6} /><path d="M-26,150 h52 v14 h-52Z" fill="#6a6a6a" stroke={INK} strokeWidth={4} /><path d="M-18,164 L18,164 L12,560 L-2,600 L-18,560Z" fill="#c8ccd0" stroke={INK} strokeWidth={6} strokeLinejoin="round" /><path d="M8,180 L4,540" stroke="#ffffff" strokeWidth={6} opacity={0.6} /></g>}
        {keys && <g transform={`translate(${back ? 328 : -328},-1450)`}><circle cx={0} cy={40} r={34} fill="none" stroke="#b8b0a0" strokeWidth={12} /><path d="M-10,70 l-30,140 l24,6 l6,-30 l14,4 l6,-30" fill="#c9c2b2" stroke={INK} strokeWidth={5} /><path d="M20,70 l26,120 l20,-4 l-4,-20 l12,-2 l-6,-26" fill="#a8a090" stroke={INK} strokeWidth={5} /></g>}
        {!back ? (<g transform="translate(0,-2780)"><FaceNoah expr={expr} f={ff} turn={view === 'three' ? 0.5 : 0} /></g>) : (
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
// Noah face (permanent FaceNoah) at a position; closed = eyes shut; hand = hand pressed over the mouth
export const NFace: React.FC<{ x: number; y: number; k?: number; f?: number; expr?: string; rot?: number; closed?: boolean; hand?: boolean; pale?: number; turn?: number }> = ({ x, y, k = 2, f = 0, expr = 'neutral', rot = 0, closed = false, hand = false, pale = 0, turn = 0 }) => {
  const ff = closed ? Math.floor(f / 96) * 96 + 1 : (expr === 'fear' ? (f % 96 < 4 ? f + 4 : f) : f);
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${k})`}>
      <FaceNoah expr={expr} f={ff} turn={turn} />
      {pale > 0 && <path d="M0,-225 C105,-230 158,-130 152,-20 C148,90 120,160 70,205 C40,228 -40,228 -70,205 C-120,160 -148,90 -152,-20 C-158,-130 -105,-230 0,-225Z" fill="#e8f0f2" opacity={pale} />}
      {hand && <g><Hand x={10} y={190} s={1.15} rot={-8} skin={NOAH.skin} shade={NOAH.shade} ext={[0.95, 1, 0.95, 0.85]} thumb={0.6} sleeve={PJ.robe} sleeveLen={150} /></g>}
    </g>
  );
};

export const SilDefs: React.FC = () => (<defs><filter id="blk" x="-20%" y="-20%" width="140%" height="140%"><feColorMatrix type="matrix" values="0 0 0 0 0.01  0 0 0 0 0.015  0 0 0 0 0.03  0 0 0 1 0" /></filter><filter id="blkb" x="-20%" y="-20%" width="140%" height="140%"><feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" /><feGaussianBlur stdDeviation="10" /></filter></defs>);
// creature as a pure black shape (only two muddy eye glints) - used before the full reveal in chapter 7
export const Sil: React.FC<{ x: number; y: number; s: number; f: number; flip?: boolean; walk?: boolean; eyes?: boolean; op?: number; blur?: boolean; wings?: number; neck?: number }> = ({ x, y, s, f, flip, walk, eyes = true, op = 1, blur = false, wings = 0, neck = 0 }) => (<g opacity={op}><SilDefs /><g filter={blur ? 'url(#blkb)' : 'url(#blk)'}><Beast x={x} y={y} s={s} f={f} flip={flip} walk={walk} wings={wings} neck={neck} /></g>{eyes && !blur && <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}><g transform={`rotate(${neck} 200 -2700)`}><g transform="translate(640,-3330) rotate(28) scale(1.35)"><circle cx={84} cy={-52} r={30} fill="#8a8040" opacity={0.9} /><circle cx={92} cy={-60} r={9} fill="#e8e0a0" /></g></g></g>}</g>);
