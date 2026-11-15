import React from 'react';
import { INK, RED, rng } from './Kit';
import { FacePerson, CAST } from './Cast';
import type { Spec } from './Cast';
import { sf } from './Beast';

// ===== Kit S "The Melancholy of Herbert Solomon" =====
// Scottish 16th-century gothic palette: cold moorland slate + granite moss + heather + torch amber + blood crimson
export const Q = {
  skyDk: '#080c14',
  skyMoor: '#141c24',
  slateRock: '#222b33',
  graniteMoss: '#2d3834',
  pineDk: '#0d181c',
  pineCold: '#182b30',
  woodCabin: '#2e2118',
  woodDark: '#1a1410',
  tomeLeather: '#1e1612',
  tomeGold: '#c29a4a',
  torchAmber: '#e58c28',
  torchFlame: '#f5b538',
  parchment: '#dfd3b8',
  solomonPale: '#d5dcde',
  solomonShade: '#8c9ea6',
  solomonVein: '#3a505e',
  eyeHollow: '#090b10',
  crimson: '#a31818',
  waterRapid: '#2b444a',
  waterFoam: '#9eb4bd',
  snowMist: '#d0dae0',
};

// Character specs
export const NOAH_SCHOLAR: Spec = {
  id: 'noah_scholar',
  name: 'NOAH REED (Folklorist)',
  sex: 'm',
  age: 1,
  skin: '#c19468',
  skinD: '#85613f',
  hair: '#17120f',
  hairStyle: 'crop',
  eyeC: '#1a0f08',
  lip: '#8a4a3a',
  fw: 1.0,
  top: 'jacket',
  topC: '#2b3942',
  topD: '#1a242b',
  inner: '#dfd3b8',
  sw: 300,
  hw: 236,
  bottom: 'trousers',
  botC: '#1e242a',
  shoeC: '#141618',
  acc: ['satchel'],
};

export const VICAR_MCKENZIE: Spec = {
  id: 'vicar_mckenzie',
  name: 'VICAR MCKENZIE',
  sex: 'm',
  age: 2,
  skin: '#c9a380',
  skinD: '#7a5a42',
  hair: '#8c8c88',
  hairStyle: 'greyshort',
  stache: false,
  fw: 1.02,
  top: 'cardigan',
  topC: '#1a1c22',
  topD: '#101216',
  inner: '#e2ddcc',
  sw: 290,
  hw: 240,
  bottom: 'trousers',
  botC: '#16181d',
  shoeC: '#0d0e12',
  acc: ['cane'],
};

export const ALANA_CHILD: Spec = {
  id: 'alana_child',
  name: 'ALANA SUTHERLAND',
  sex: 'f',
  age: 0,
  skin: '#e2be9c',
  skinD: '#9e7552',
  hair: '#4a2c1d',
  hairStyle: 'pigtails',
  eyeC: '#2a1a10',
  lip: '#aa5555',
  fw: 0.96,
  top: 'cardigan',
  topC: '#46556b',
  topD: '#2e3b4d',
  inner: '#e0d8c4',
  sw: 210,
  hw: 200,
  bottom: 'dressKnee',
  botC: '#46556b',
  shoeC: '#3b2520',
  legK: 0.62,
  hs: 1.28,
  gs: 0.82,
  acc: ['redRibbons'],
};

// Subtle alive breathing/swaying
export const Alive: React.FC<{ x: number; y: number; f: number; mode?: string; k?: number; children: React.ReactNode }> = ({ x, y, f, mode = 'idle', k = 1, children }) => {
  const t = sf(f, 3);
  let rot = Math.sin(t / 22) * 0.8, sy = 1 + Math.sin(t / 14) * 0.007, dy = 0, dx = 0;
  if (mode === 'sorrow') { rot = -2 + Math.sin(t / 18) * 1.5; dy = Math.sin(t / 12) * 4 * k; }
  if (mode === 'flee') { rot = Math.sin(t / 6) * 3; dy = Math.sin(t / 8) * 10 * k; }
  if (mode === 'flame') { rot = Math.sin(t / 4) * 2; dy = Math.sin(t / 5) * 6; sy = 1 + Math.sin(t / 3) * 0.03; }
  return <g transform={`translate(${x + dx},${y + dy}) rotate(${rot}) scale(1,${sy}) translate(${-x},${-y})`}>{children}</g>;
};

// ===== HERBERT SOLOMON CHARACTER (Detailed Painted Face) =====
export const FaceSolomon: React.FC<{ f?: number; expr?: 'melancholy' | 'sorrow' | 'burning'; rot?: number }> = ({ f = 0, expr = 'melancholy' }) => {
  const t = sf(f, 3);
  const blink = f % 120 < 4;
  const flame = expr === 'burning';
  const gx = Math.sin(t / 28) * 4;
  const headPath = 'M0,-240 C95,-244 140,-150 134,-20 C130,80 105,170 55,220 C25,245 -25,245 -55,220 C-105,170 -130,80 -134,-20 C-140,-150 -95,-244 0,-240Z';

  return (
    <g>
      <defs>
        <radialGradient id="solhead" cx="0.45" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#eaf0f2" />
          <stop offset="0.65" stopColor={Q.solomonPale} />
          <stop offset="1" stopColor={Q.solomonShade} />
        </radialGradient>
      </defs>

      {/* Ears - elongated & gaunt */}
      {[-1, 1].map((q) => (
        <ellipse key={q} cx={q * 136} cy={-10} rx={16} ry={48} fill={Q.solomonShade} stroke={INK} strokeWidth={6} />
      ))}

      {/* Head Base */}
      <path d={headPath} fill="url(#solhead)" stroke={INK} strokeWidth={8} strokeLinejoin="round" />

      {/* Right side shadow */}
      <path d="M50,-240 C100,-210 134,-150 130,-20 C126,80 102,170 55,220 C85,140 92,40 85,-30 C80,-120 72,-190 50,-240Z" fill="#1b252c" opacity={0.35} />

      {/* Cheekbone & Temple Hollows */}
      <path d="M-120,-30 C-90,20 -70,90 -50,150 M120,-30 C90,20 70,90 50,150" stroke={Q.solomonShade} strokeWidth={6} fill="none" opacity={0.7} />
      <path d="M-115,-70 C-85,-50 -60,-40 -30,-40 M115,-70 C85,-50 60,-40 30,-40" stroke={Q.solomonShade} strokeWidth={5} fill="none" opacity={0.5} />

      {/* Prominent Temple and Forehead Veins (Key Lore Detail) */}
      <g stroke={flame ? Q.crimson : Q.solomonVein} strokeWidth={3.5} fill="none" opacity={0.85} strokeLinecap="round">
        <path d="M-45,-210 C-35,-180 -50,-140 -40,-100 C-35,-85 -25,-75 -20,-60" />
        <path d="M-40,-155 C-60,-140 -75,-120 -85,-90" />
        <path d="M50,-205 C40,-175 55,-135 45,-95 C38,-78 28,-68 22,-58" />
        <path d="M48,-150 C68,-135 80,-115 92,-85" />
        <path d="M-10,-225 C-5,-195 5,-170 0,-140" />
      </g>

      {/* Deep-Set Dark Eye Sockets */}
      {[-1, 1].map((q) => (
        <g key={q}>
          {/* Socket recess */}
          <ellipse cx={q * 52} cy={-25} rx={38} ry={32} fill="#090d12" stroke={INK} strokeWidth={5} />
          {/* Gentle specular highlight (sorrowful, human gaze) */}
          {!blink && (
            <g>
              <circle cx={q * 52 + gx} cy={-25} r={5} fill="#f4f8fa" opacity={0.85} />
              <circle cx={q * 52 + gx + 1.5} cy={-27} r={2} fill="#ffffff" />
            </g>
          )}
          {/* Heavy skeletal brow */}
          <path d={`M${q * 95},-55 C${q * 65},-75 ${q * 35},-70 ${q * 15},-48`} stroke={INK} strokeWidth={8} fill="none" strokeLinecap="round" />
          {/* Dark tear/shadow tracks under eyes */}
          <path d={`M${q * 48},5 C${q * 52},40 ${q * 44},70 ${q * 48},105`} stroke="#141c22" strokeWidth={6} fill="none" opacity={0.65} strokeLinecap="round" />
        </g>
      ))}

      {/* Emaciated Sharp Nose */}
      <path d="M-8,-40 C-14,10 -20,40 -26,60 M8,-40 C12,10 18,40 22,58" stroke={INK} strokeWidth={5} fill="none" opacity={0.8} />
      <path d="M-26,60 L0,70 L22,58" stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />
      <circle cx={-12} cy={66} r={4.5} fill="#0a0e14" />
      <circle cx={10} cy={66} r={4.5} fill="#0a0e14" />

      {/* Sorrowful Thin Mouth */}
      <path d="M-44,140 C-18,130 18,130 44,140" stroke={INK} strokeWidth={7} fill="none" strokeLinecap="round" />
      <path d="M-44,140 q-6,10 -8,22 M44,140 q6,10 8,22" stroke={Q.solomonShade} strokeWidth={4} fill="none" opacity={0.7} />
      <path d="M-20,165 C-5,172 5,172 20,165" stroke={Q.solomonShade} strokeWidth={4} fill="none" opacity={0.5} />
    </g>
  );
};

// Full Tall Silhouette of Herbert Solomon (7.5-8 heads tall, emaciated)
export const FullSolomon: React.FC<{ x: number; y: number; s?: number; f?: number; mode?: 'stand' | 'reach' | 'flee' | 'carry' }> = ({ x, y, s = 1, f = 0, mode = 'stand' }) => {
  const t = sf(f, 3);
  const reach = mode === 'reach';
  const flee = mode === 'flee';
  const armRotL = flee ? Math.sin(t / 8) * 35 : reach ? -75 : 8 + Math.sin(t / 18) * 4;
  const armRotR = flee ? -Math.sin(t / 8) * 35 : reach ? -65 : -8 - Math.sin(t / 18) * 4;

  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {/* Ground shadow */}
      <ellipse cx={0} cy={10} rx={180} ry={22} fill="#000" opacity={0.4} />

      {/* Spindly Legs (Long tattered dark trousers) */}
      {[-1, 1].map((q) => (
        <g key={q} transform={flee ? `rotate(${q * Math.sin(t / 6) * 18} 0 -500)` : ''}>
          <path d={`M${q * 45},-520 L${q * 55},-180 L${q * 40},0 H${q * 80} L${q * 95},-180 L${q * 75},-520Z`} fill="#1c1612" stroke={INK} strokeWidth={7} />
          {/* Bony knee bulge */}
          <circle cx={q * 65} cy={-220} r={14} fill="#14100c" stroke={INK} strokeWidth={4} />
        </g>
      ))}

      {/* Long Tattered Ragged Coat / Shroud */}
      <path d="M-90,-880 C-110,-720 -130,-500 -120,-380 L120,-380 C130,-500 110,-720 90,-880Z" fill="#241a14" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
      <path d="M0,-880 V-380" stroke={INK} strokeWidth={6} opacity={0.7} />
      {/* Torn cloth fringe */}
      <path d="M-120,-380 l18,30 l22,-25 l26,35 l28,-30 l26,30 l28,-30 l24,35 l22,-30 l26,20" stroke={INK} strokeWidth={6} fill="none" />

      {/* Torso & Ribcage Emaciation under fabric */}
      <path d="M-80,-880 C-85,-780 -60,-650 0,-620 C60,-650 85,-780 80,-880Z" fill="#1e1612" stroke={INK} strokeWidth={7} />
      {[-1, 1].map((q) => (
        <g key={q}>
          <path d={`M${q * 20},-820 q${q * 40},15 ${q * 50},4`} stroke="#0e0a08" strokeWidth={5} fill="none" opacity={0.8} />
          <path d={`M${q * 18},-780 q${q * 42},15 ${q * 48},4`} stroke="#0e0a08" strokeWidth={5} fill="none" opacity={0.8} />
          <path d={`M${q * 16},-740 q${q * 44},15 ${q * 46},4`} stroke="#0e0a08" strokeWidth={5} fill="none" opacity={0.8} />
        </g>
      ))}

      {/* Frayed Shawl / Weathered Scarf */}
      <path d="M-95,-900 C-50,-870 50,-870 95,-900 C80,-840 50,-810 0,-810 C-50,-810 -80,-840 -95,-900Z" fill="#42352b" stroke={INK} strokeWidth={6} />

      {/* Elongated Spindly Arms & White Skeletal Hands */}
      {/* Left Arm */}
      <g transform={`translate(-85,-860) rotate(${armRotL})`}>
        <path d="M-14,0 L-22,260 L-18,520 H8 L12,260 L14,0Z" fill="#241a14" stroke={INK} strokeWidth={6} />
        {/* Forearm skin and white hand */}
        <path d="M-12,480 L-14,600 C-10,640 -5,660 0,670 C5,660 10,640 14,600 L12,480Z" fill={Q.solomonPale} stroke={INK} strokeWidth={6} />
        {/* Long thin fingers */}
        {[-15, -5, 5, 15].map((fx, fi) => (
          <path key={fi} d={`M${fx},660 L${fx * 1.4},720`} stroke={INK} strokeWidth={4} strokeLinecap="round" />
        ))}
      </g>

      {/* Right Arm */}
      <g transform={`translate(85,-860) rotate(${armRotR})`}>
        <path d="M-14,0 L-12,260 L-8,520 H18 L22,260 L14,0Z" fill="#241a14" stroke={INK} strokeWidth={6} />
        <path d="M-12,480 L-14,600 C-10,640 -5,660 0,670 C5,660 10,640 14,600 L12,480Z" fill={Q.solomonPale} stroke={INK} strokeWidth={6} />
        {[-15, -5, 5, 15].map((fx, fi) => (
          <path key={fi} d={`M${fx},660 L${fx * 1.4},720`} stroke={INK} strokeWidth={4} strokeLinecap="round" />
        ))}
      </g>

      {/* Head */}
      <g transform="translate(0,-980) scale(0.68)">
        <FaceSolomon f={f} expr={flee ? 'burning' : 'melancholy'} />
      </g>
    </g>
  );
};

// ===== THE 16TH-CENTURY TOME & DRAWING =====
export const AncientTome: React.FC<{ x: number; y: number; w?: number; h?: number; open?: boolean }> = ({ x, y, w = 480, h = 340, open = true }) => (
  <g transform={`translate(${x},${y})`}>
    {/* Tome Leather Shadow */}
    <rect x={-w / 2 + 10} y={-h / 2 + 15} width={w} height={h} rx={12} fill="#000" opacity={0.6} />
    {/* Blackened Weathered Leather Cover */}
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={10} fill={Q.tomeLeather} stroke={INK} strokeWidth={8} />
    {/* Gold Embossed Floral Filigree on Corners */}
    {[-1, 1].map((qx) =>
      [-1, 1].map((qy) => (
        <path
          key={`${qx}_${qy}`}
          d={`M${qx * (w / 2 - 20)},${qy * (h / 2 - 70)} L${qx * (w / 2 - 70)},${qy * (h / 2 - 20)}`}
          stroke={Q.tomeGold}
          strokeWidth={4}
          opacity={0.65}
        />
      ))
    )}

    {open && (
      <g>
        {/* Yellowed Cracked Parchment Pages */}
        <path d={`M${-w / 2 + 25},${-h / 2 + 20} H-10 V${h / 2 - 20} H${-w / 2 + 25}Z`} fill={Q.parchment} stroke={INK} strokeWidth={5} />
        <path d={`M10,${-h / 2 + 20} H${w / 2 - 25} V${h / 2 - 20} H10Z`} fill={Q.parchment} stroke={INK} strokeWidth={5} />
        {/* Spine depression */}
        <line x1={0} y1={-h / 2 + 15} x2={0} y2={h / 2 - 15} stroke={INK} strokeWidth={8} />

        {/* Left Page Text Lines (Latin / Scots chronicle) */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((line) => (
          <line
            key={line}
            x1={-w / 2 + 50}
            y1={-h / 2 + 50 + line * 30}
            x2={-30}
            y2={-h / 2 + 50 + line * 30}
            stroke="#4a3b2c"
            strokeWidth={3}
            opacity={0.6}
          />
        ))}

        {/* Right Page: The 1578 Ink Illustration of Herbert Solomon */}
        <rect x={35} y={-h / 2 + 35} width={w / 2 - 70} height={h - 70} fill="#d5c8a8" stroke={INK} strokeWidth={3} />
        {/* Miniature Sketch of Herbert Solomon */}
        <g transform={`translate(${w / 4},${-h / 2 + 150}) scale(0.24)`}>
          <FaceSolomon f={0} expr="melancholy" />
        </g>
        {/* Ink Date and Name Inscription: "1578 - Herbert Solomon" */}
        <text x={w / 4} y={h / 2 - 45} textAnchor="middle" fill={INK} fontFamily="serif" fontSize={14} fontWeight="bold" letterSpacing={1}>
          1578 — Herbert Solomon
        </text>
      </g>
    )}
  </g>
);

// ===== HAND-CARVED WOODEN DOLL =====
export const CarvedDoll: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {/* Wooden Torso & Head carved from pine branch */}
    <ellipse cx={0} cy={-50} rx={22} ry={26} fill="#7a5538" stroke={INK} strokeWidth={5} />
    <path d="M-22,-24 L-28,40 H28 L22,-24Z" fill="#5c3f28" stroke={INK} strokeWidth={5} />
    {/* Painted simple smiling face */}
    <circle cx={-8} cy={-52} r={3} fill={INK} />
    <circle cx={8} cy={-52} r={3} fill={INK} />
    <path d="M-7,-40 q7,6 14,0" stroke={INK} strokeWidth={3} fill="none" />
    {/* Little Red Yarn Scarf / Ribbon (The single red accent) */}
    <circle cx={0} cy={-24} r={8} fill={RED} stroke={INK} strokeWidth={3} />
    <path d="M-4,-24 L-12,-4 M4,-24 L14,-6" stroke={RED} strokeWidth={6} strokeLinecap="round" />
    {/* Stick arms & legs */}
    <line x1={-24} y1={-10} x2={-42} y2={10} stroke="#4a301c" strokeWidth={6} strokeLinecap="round" />
    <line x1={24} y1={-10} x2={42} y2={10} stroke="#4a301c" strokeWidth={6} strokeLinecap="round" />
    <line x1={-14} y1={40} x2={-18} y2={85} stroke="#4a301c" strokeWidth={7} strokeLinecap="round" />
    <line x1={14} y1={40} x2={18} y2={85} stroke="#4a301c" strokeWidth={7} strokeLinecap="round" />
  </g>
);

// ===== 16TH-CENTURY STONE COTTAGE & COBBLESTONES =====
export const StoneCottage: React.FC<{ x: number; y: number; w?: number; h?: number }> = ({ x, y, w = 460, h = 380 }) => (
  <g transform={`translate(${x},${y})`}>
    {/* Stone Wall */}
    <rect x={-w / 2} y={-h} width={w} height={h} fill={Q.graniteMoss} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
    {/* Masonry Stones Pattern */}
    {Array.from({ length: 6 }).map((_, row) => (
      <line
        key={row}
        x1={-w / 2 + 10}
        y1={-h + (row + 1) * (h / 7)}
        x2={w / 2 - 10}
        y2={-h + (row + 1) * (h / 7)}
        stroke="#1a221f"
        strokeWidth={4}
        opacity={0.6}
      />
    ))}
    {/* Thatched / Slate Gable Roof */}
    <polygon points={`0,${-h - 140} ${-w / 2 - 40},${-h} ${w / 2 + 40},${-h}`} fill="#1c242b" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
    {/* Wooden Plank Doorway */}
    <rect x={-45} y={-160} width={90} height={160} rx={4} fill="#241710" stroke={INK} strokeWidth={6} />
    <circle cx={30} cy={-80} r={5} fill="#8c6a40" />
    {/* Small Leaded-Glass Window with Amber Lantern Glow */}
    <rect x={-w / 2 + 60} y={-260} width={80} height={90} fill={Q.torchAmber} stroke={INK} strokeWidth={6} />
    <line x1={-w / 2 + 100} y1={-260} x2={-w / 2 + 100} y2={-170} stroke={INK} strokeWidth={4} />
    <line x1={-w / 2 + 60} y1={-215} x2={-w / 2 + 140} y2={-215} stroke={INK} strokeWidth={4} />
  </g>
);

// ===== BURNING WOODEN CABIN IN ETTRICK FOREST =====
export const BurningCabin: React.FC<{ x: number; y: number; f?: number }> = ({ x, y, f = 0 }) => {
  const t = sf(f, 3);
  return (
    <g transform={`translate(${x},${y})`}>
      {/* Cabin Base Timber */}
      <rect x={-200} y={-240} width={400} height={240} fill={Q.woodCabin} stroke={INK} strokeWidth={8} />
      {/* Horizontal Logs */}
      {[0, 1, 2, 3, 4].map((log) => (
        <line key={log} x1={-190} y1={-200 + log * 42} x2={190} y2={-200 + log * 42} stroke="#17100b" strokeWidth={5} />
      ))}
      {/* Roof */}
      <polygon points="0,-380 -240,-240 240,-240" fill="#211710" stroke={INK} strokeWidth={8} />

      {/* Roaring Flames leaping from windows and roof */}
      <g opacity={0.92}>
        {[-140, -80, -20, 40, 100, 150].map((fx, i) => {
          const fh = 140 + Math.sin(t / 4 + i) * 50;
          return (
            <path
              key={i}
              d={`M${fx},-240 C${fx - 25},${-240 - fh * 0.5} ${fx + 25},${-240 - fh * 0.8} ${fx + Math.sin(t / 3 + i) * 15},${-240 - fh} C${fx + 30},${-240 - fh * 0.6} ${fx + 10},${-240 - fh * 0.3} ${fx + 25},-240Z`}
              fill={i % 2 === 0 ? Q.torchAmber : Q.torchFlame}
              stroke={RED}
              strokeWidth={3}
            />
          );
        })}
      </g>
    </g>
  );
};

// ===== RAGING SWOLLEN RIVER & MOSS BOULDERS =====
export const RagingRiver: React.FC<{ x: number; y: number; w?: number; f?: number }> = ({ x, y, w = 1920, f = 0 }) => {
  const t = sf(f, 3);
  return (
    <g transform={`translate(${x},${y})`}>
      {/* Deep Torrent Water */}
      <rect x={-w / 2} y={-140} width={w} height={280} fill={Q.waterRapid} stroke={INK} strokeWidth={6} />
      {/* Churning Wave Strands */}
      {[-80, -30, 20, 70].map((wy, wi) => {
        const off = (t * 8 + wi * 140) % 240;
        return (
          <path
            key={wi}
            d={`M${-w / 2},${wy} Q${-w / 4 + off},${wy - 20} ${off},${wy} T${w / 2},${wy}`}
            stroke={Q.waterFoam}
            strokeWidth={10 - wi * 1.5}
            fill="none"
            opacity={0.7}
            strokeLinecap="round"
          />
        );
      })}
      {/* Jagged Dark Rocks in River Bed */}
      {[-450, -100, 280, 600].map((rx, ri) => (
        <polygon
          key={ri}
          points={`${rx},40 ${rx + 50},-60 ${rx + 110},-40 ${rx + 140},50`}
          fill="#182228"
          stroke={INK}
          strokeWidth={6}
        />
      ))}
    </g>
  );
};
