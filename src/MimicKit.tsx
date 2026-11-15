import React from 'react';
import { INK, RED, rng } from './Kit';
import { FullPerson, FacePerson, CAST, HairBack, HairFront } from './Cast';
import type { Spec } from './Cast';
import { sf } from './Beast';

// ===== Kit M "The Treeline Mimic" =====
// Palette: Cold midnight pine indigo / foggy teal-slate + amber cabin lantern + crimson accent
export const Q = {
  skyDk: '#070b12',
  skyMist: '#111b24',
  pineDk: '#0c1618',
  pineMid: '#16282b',
  pineLight: '#233d40',
  fogTeal: '#2b4447',
  barkWood: '#211814',
  cabinWood: '#36281e',
  cabinGlow: '#d98b2c',
  windowAmber: '#f0b04a',
  fleshPale: '#d0d8db',
  fleshDead: '#89999e',
  eyeGlow: '#f5f7fa',
  redAccent: '#b81c16',
  moonWhite: '#eaf2f5',
};

// Permanent cast characters
export const NOAH: Spec = {
  id: 'noah',
  name: 'NOAH REED (Narrator Hero)',
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
  topC: '#4f7377',
  topD: '#2b4448',
  inner: '#dcd2b6',
  sw: 300,
  hw: 236,
  bottom: 'trousers',
  botC: '#4d3b2e',
  shoeC: '#2b2019',
  acc: ['satchel'],
};
export const MIRA: Spec = {
  ...CAST.mira,
  id: 'mira',
  name: 'MIRA VALE (Sister)',
};

// Subtle alive breathing/swaying animation
export const Alive: React.FC<{ x: number; y: number; f: number; mode?: string; k?: number; children: React.ReactNode }> = ({ x, y, f, mode = 'idle', k = 1, children }) => {
  const t = sf(f, 3);
  let rot = Math.sin(t / 22) * 0.8, sy = 1 + Math.sin(t / 14) * 0.007, dy = 0, dx = 0;
  if (mode === 'stalk') { rot = Math.sin(t / 8) * 1.8; dy = Math.sin(t / 10) * 8 * k; }
  if (mode === 'reach') { rot = -4 + Math.sin(t / 16) * 2; dy = Math.sin(t / 12) * 5; }
  if (mode === 'tremble') { rot = Math.sin(t * 2) * 1.2; sy = 1 + Math.sin(t / 4) * 0.02; }
  return <g transform={`translate(${x + dx},${y + dy}) rotate(${rot}) scale(1,${sy}) translate(${-x},${-y})`}>{children}</g>;
};

// Shoulders for closeups
export const Shoulders: React.FC<{ c: string; d: string; skin: string }> = ({ c, d, skin }) => (
  <g>
    <path d="M-70,170 L-76,300 C-30,330 30,330 76,300 L70,170Z" fill={skin} stroke={INK} strokeWidth={7} />
    <path d="M-76,260 C-180,280 -330,320 -380,420 L-420,900 H420 L380,420 C330,320 180,280 76,260 C40,300 -40,300 -76,260Z" fill={c} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
    <path d="M120,290 C260,320 360,380 380,460 L420,900 H200 C230,700 220,480 120,290Z" fill={d} opacity={0.7} />
  </g>
);

// Close-up Face
export const Face: React.FC<{ who: 'noah' | 'mira'; x: number; y: number; k: number; f: number; expr?: string; rot?: number }> = ({ who, x, y, k, f, expr = 'neutral', rot = 0 }) => {
  const spec = who === 'noah' ? NOAH : MIRA;
  const b = Math.sin(sf(f, 3) / 14) * 4;
  return (
    <g transform={`translate(${x},${y + b}) rotate(${rot + Math.sin(sf(f, 3) / 24) * 0.8}) scale(${k})`}>
      <Shoulders c={spec.topC} d={spec.topD} skin={spec.skin} />
      <HairBack s={spec} />
      <FacePerson s={spec} expr={expr} f={f} />
      <HairFront s={spec} />
    </g>
  );
};

// Stylized Yamishibai Pine Tree
export const PineTree: React.FC<{ x: number; y: number; h: number; w?: number; c?: string }> = ({ x, y, h, w = 180, c = Q.pineDk }) => {
  const trunkW = w * 0.16;
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x={-trunkW / 2} y={-h * 0.25} width={trunkW} height={h * 0.28} fill={Q.barkWood} stroke={INK} strokeWidth={6} />
      {/* 3 Tiered Pine Needle Cones */}
      <polygon points={`0,${-h} ${-w * 0.35},${-h * 0.72} ${w * 0.35},${-h * 0.72}`} fill={c} stroke={INK} strokeWidth={6} />
      <polygon points={`0,${-h * 0.8} ${-w * 0.45},${-h * 0.48} ${w * 0.45},${-h * 0.48}`} fill={c} stroke={INK} strokeWidth={6} />
      <polygon points={`0,${-h * 0.58} ${-w * 0.55},${-h * 0.22} ${w * 0.55},${-h * 0.22}`} fill={c} stroke={INK} strokeWidth={7} />
    </g>
  );
};

// Split-Rail Fence
export const WoodFence: React.FC<{ x: number; y: number; w: number; h?: number }> = ({ x, y, w, h = 180 }) => {
  const posts = Math.floor(w / 160) + 1;
  return (
    <g transform={`translate(${x},${y})`}>
      {/* Horizontal rails */}
      <rect x={0} y={-h * 0.65} width={w} height={22} rx={4} fill={Q.barkWood} stroke={INK} strokeWidth={5} />
      <rect x={0} y={-h * 0.35} width={w} height={22} rx={4} fill={Q.barkWood} stroke={INK} strokeWidth={5} />
      {/* Vertical posts */}
      {Array.from({ length: posts }).map((_, i) => (
        <rect key={i} x={i * 160 - 12} y={-h * 0.85} width={26} height={h * 0.9} rx={3} fill="#1a120e" stroke={INK} strokeWidth={6} />
      ))}
    </g>
  );
};

// The 9-Foot Skeletal Mimic Creature
export const MimicCreature: React.FC<{ x: number; y: number; k: number; f: number; pose?: 'stalk' | 'reach' | 'gower' }> = ({ x, y, k, f, pose = 'stalk' }) => {
  const t = sf(f, 3);
  const armRot = pose === 'reach' ? -35 + Math.sin(t / 12) * 8 : 12 + Math.sin(t / 16) * 4;
  const mouthOpen = 24 + Math.sin(t / 8) * 8;
  return (
    <g transform={`translate(${x},${y}) scale(${k})`}>
      {/* Thin Spindly Legs */}
      <path d="M-22,-20 L-40,240 L-50,520" stroke={INK} strokeWidth={16} fill="none" strokeLinecap="round" />
      <path d="M-22,-20 L-40,240 L-50,520" stroke={Q.fleshPale} strokeWidth={11} fill="none" strokeLinecap="round" />
      <path d="M22,-20 L40,240 L50,520" stroke={INK} strokeWidth={16} fill="none" strokeLinecap="round" />
      <path d="M22,-20 L40,240 L50,520" stroke={Q.fleshPale} strokeWidth={11} fill="none" strokeLinecap="round" />

      {/* Gaunt Pelvis & Spine */}
      <path d="M-36,-20 C-20,0 20,0 36,-20 L24,-70 H-24Z" fill={Q.fleshDead} stroke={INK} strokeWidth={7} />
      <path d="M0,-60 Q-15,-160 0,-260" stroke={INK} strokeWidth={24} fill="none" />
      <path d="M0,-60 Q-15,-160 0,-260" stroke={Q.fleshPale} strokeWidth={18} fill="none" />

      {/* Skeletal Ribs */}
      {[-100, -140, -180, -220].map((ry, i) => (
        <g key={i}>
          <path d={`M-55,${ry} C-40,${ry - 12} 0,${ry - 10} 0,${ry} C0,${ry - 10} 40,${ry - 12} 55,${ry}`} stroke={INK} strokeWidth={8} fill="none" />
          <path d={`M-55,${ry} C-40,${ry - 12} 0,${ry - 10} 0,${ry} C0,${ry - 10} 40,${ry - 12} 55,${ry}`} stroke={Q.fleshPale} strokeWidth={5} fill="none" />
        </g>
      ))}

      {/* Long Left Arm */}
      <g transform={`translate(-45,-250) rotate(${-armRot})`}>
        <path d="M0,0 L-30,180 L-50,420 L-65,490" stroke={INK} strokeWidth={14} fill="none" strokeLinecap="round" />
        <path d="M0,0 L-30,180 L-50,420 L-65,490" stroke={Q.fleshPale} strokeWidth={9} fill="none" strokeLinecap="round" />
        {/* Elongated Claws */}
        {[-8, 0, 8].map((fx, fi) => (
          <path key={fi} d={`M-65,490 l${fx * 3},${45 + fi * 5}`} stroke={INK} strokeWidth={4} strokeLinecap="round" />
        ))}
      </g>

      {/* Long Right Arm */}
      <g transform={`translate(45,-250) rotate(${armRot})`}>
        <path d="M0,0 L30,180 L50,420 L65,490" stroke={INK} strokeWidth={14} fill="none" strokeLinecap="round" />
        <path d="M0,0 L30,180 L50,420 L65,490" stroke={Q.fleshPale} strokeWidth={9} fill="none" strokeLinecap="round" />
        {[-8, 0, 8].map((fx, fi) => (
          <path key={fi} d={`M65,490 l${fx * 3},${45 + fi * 5}`} stroke={INK} strokeWidth={4} strokeLinecap="round" />
        ))}
      </g>

      {/* Distorted Neck & Skull */}
      <path d="M0,-260 L0,-320" stroke={INK} strokeWidth={16} strokeLinecap="round" />
      <g transform="translate(0,-340)">
        {/* Elongated Skull */}
        <ellipse cx={0} cy={-20} rx={42} ry={58} fill={Q.fleshPale} stroke={INK} strokeWidth={8} />
        {/* Hollow Eyes with Glowing Tapetum Lucidum Reflection */}
        <ellipse cx={-18} cy={-26} rx={14} ry={18} fill="#05070a" stroke={INK} strokeWidth={4} />
        <ellipse cx={18} cy={-26} rx={14} ry={18} fill="#05070a" stroke={INK} strokeWidth={4} />
        <circle cx={-18} cy={-26} r={5} fill={Q.eyeGlow} />
        <circle cx={18} cy={-26} r={5} fill={Q.eyeGlow} />

        {/* Dark Tear Tracks */}
        <path d="M-18,-8 L-22,30" stroke="#080c10" strokeWidth={5} strokeLinecap="round" opacity={0.8} />
        <path d="M18,-8 L22,30" stroke="#080c10" strokeWidth={5} strokeLinecap="round" opacity={0.8} />

        {/* Gaping Lower Jaw & Jagged Teeth */}
        <path d={`M-28,12 C-14,${16 + mouthOpen} 14,${16 + mouthOpen} 28,12 C20,38 -20,38 -28,12Z`} fill="#120505" stroke={INK} strokeWidth={6} />
        {/* Teeth needles */}
        <path d="M-22,14 l4,12 l4,-12 l4,12 l4,-12 l4,12 l4,-12" stroke="#e0e8eb" strokeWidth={2.5} fill="none" />
      </g>
    </g>
  );
};

// Anatomical Cutaway: Dual Voice Boxes (Dual Syrinx)
export const DualSyrinxCutaway: React.FC<{ x: number; y: number; k?: number; f: number }> = ({ x, y, k = 1, f }) => {
  const t = sf(f, 3);
  const wave1 = Math.sin(t / 4) * 8;
  const wave2 = Math.cos(t / 4.5) * 8;
  return (
    <g transform={`translate(${x},${y}) scale(${k})`}>
      {/* Outer meat / throat membrane */}
      <path d="M-120,-160 C-60,-190 60,-190 120,-160 C160,-60 170,120 120,200 C40,250 -40,250 -120,200 C-170,120 -160,-60 -120,-160Z" fill="#3a1416" stroke={INK} strokeWidth={8} />
      <path d="M-90,-130 C-40,-150 40,-150 90,-130 C130,-40 130,90 90,160 C30,200 -30,200 -90,160 C-130,90 -130,-40 -90,-130Z" fill="#5c1c20" stroke={INK} strokeWidth={5} />

      {/* Main Trachea Tube splitting into two */}
      <path d="M-28,-140 V-30 C-28,40 -85,60 -95,140 M28,-140 V-30 C28,40 85,60 95,140" stroke="#f0e2d1" strokeWidth={12} fill="none" strokeLinecap="round" />
      <path d="M-28,-140 V-30 C-28,40 -85,60 -95,140 M28,-140 V-30 C28,40 85,60 95,140" stroke={INK} strokeWidth={4} fill="none" />

      {/* Voice Box 1 (Left Syrinx) */}
      <g transform={`translate(-85,90)`}>
        <circle cx={0} cy={0} r={38} fill="#243f47" stroke={INK} strokeWidth={7} />
        <circle cx={0} cy={0} r={28 + wave1 * 0.4} fill="none" stroke="#68abb8" strokeWidth={4} />
        <circle cx={0} cy={0} r={16 + wave1 * 0.6} fill="none" stroke="#9ee8f7" strokeWidth={3} />
        <text x={0} y={4} fill="#ffffff" fontSize={14} fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">VOICE 1</text>
      </g>

      {/* Voice Box 2 (Right Syrinx) */}
      <g transform={`translate(85,90)`}>
        <circle cx={0} cy={0} r={38} fill="#4a2e1d" stroke={INK} strokeWidth={7} />
        <circle cx={0} cy={0} r={28 + wave2 * 0.4} fill="none" stroke="#d9824c" strokeWidth={4} />
        <circle cx={0} cy={0} r={16 + wave2 * 0.6} fill="none" stroke="#fca974" strokeWidth={3} />
        <text x={0} y={4} fill="#ffffff" fontSize={14} fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">VOICE 2</text>
      </g>

      {/* Title Tag */}
      <rect x={-110} y={-220} width={220} height={38} rx={6} fill="#0d141c" stroke={INK} strokeWidth={5} />
      <text x={0} y={-195} fill={RED} fontSize={16} fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">DUAL VOICE BOXES</text>
    </g>
  );
};

// Anatomical Cutaway: Tapetum Lucidum (Mirror Eye)
export const MirrorEyeCutaway: React.FC<{ x: number; y: number; k?: number; f: number }> = ({ x, y, k = 1, f }) => {
  const t = sf(f, 3);
  const pulse = Math.sin(t / 8) * 4;
  return (
    <g transform={`translate(${x},${y}) scale(${k})`}>
      {/* Eye Socket Outline */}
      <ellipse cx={0} cy={0} rx={130} ry={110} fill="#141a24" stroke={INK} strokeWidth={8} />

      {/* Sclera & Cornea */}
      <ellipse cx={-15} cy={0} rx={95} ry={85} fill="#d8e2e6" stroke={INK} strokeWidth={6} />

      {/* Tapetum Lucidum (Reflective Mirror Back Layer) */}
      <path d="M-40,-75 C30,-70 70,-40 70,0 C70,40 30,70 -40,75" stroke="#48c4d4" strokeWidth={16} fill="none" strokeLinecap="round" />
      <path d="M-40,-75 C30,-70 70,-40 70,0 C70,40 30,70 -40,75" stroke="#ffffff" strokeWidth={6} fill="none" strokeLinecap="round" />

      {/* Pupil Opening */}
      <ellipse cx={-50} cy={0} rx={22} ry={48} fill="#070a0e" stroke={INK} strokeWidth={5} />

      {/* Incoming Light Rays and Reflection */}
      <path d="M-140,-25 L-50,-10 L50,0 L-50,20 L-140,35" stroke="#ffeb80" strokeWidth={5} fill="none" strokeDasharray="8,6" opacity={0.9} />
      <circle cx={50} cy={0} r={10 + pulse} fill="#fffbbd" opacity={0.8} />

      {/* Tag */}
      <rect x={-110} y={-160} width={220} height={38} rx={6} fill="#0d141c" stroke={INK} strokeWidth={5} />
      <text x={0} y={-135} fill="#48c4d4" fontSize={16} fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">TAPETUM (MIRROR EYE)</text>
    </g>
  );
};
