import React from 'react';
import { INK, rng } from './Kit';
import { FullPerson, FacePerson, CAST, HairBack, HairFront } from './Cast';
import type { Spec } from './Cast';
import { sf } from './Beast';

// ===== Kit L "The Scent at 5:30" (I Know You're Awake) =====
// Palette: Cold pre-dawn steel-navy / bone charcoal + deep crimson red ritual markings and alarm glow.
export const Q = {
  dk: '#090c12',
  dk2: '#131822',
  dk3: '#1d2330',
  wall: '#262d3a',
  wallDk: '#181e28',
  carpet: '#202632',
  carpetDk: '#141820',
  bedWood: '#2a221c',
  bedWoodDk: '#1a1410',
  sheet: '#8d98a6',
  sheetDk: '#5d6775',
  fleshPale: '#c6ccd2',
  fleshDead: '#8e9aa4',
  redAccent: '#b81c16',
  redDark: '#6b0e0a',
  paleGlow: '#dce5f0',
};

// Permanent cast characters
export const SAM: Spec = { ...CAST.sam, id: 'sam', name: 'SAM CARTER (Narrator Hero)' } as Spec;
export const DAD: Spec = { ...CAST.elias, id: 'dad', name: 'ELIAS GRAY (Father)' } as Spec;
export const MOM: Spec = { ...CAST.rose, id: 'mom', name: 'ROSE MARLOW (Mother)' } as Spec;

// Alive animation wrapper
export const Alive: React.FC<{ x: number; y: number; f: number; mode?: string; k?: number; children: React.ReactNode }> = ({ x, y, f, mode = 'idle', k = 1, children }) => {
  const t = sf(f, 3);
  let rot = Math.sin(t / 22) * 0.7, sy = 1 + Math.sin(t / 14) * 0.006, dy = 0, dx = 0;
  if (mode === 'walk') { rot = Math.sin(t / 5) * 2.2; dy = -Math.abs(Math.sin(t / 5)) * 14 * k; dx = t * 2.2 * k; }
  if (mode === 'shake') { rot = Math.sin(t * 1.5) * 1.2; sy = 1 + Math.sin(t / 5) * 0.015; }
  if (mode === 'lean') { rot = 3 + Math.sin(t / 22) * 0.5; }
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
export const Face: React.FC<{ who: 'sam' | 'dad' | 'mom'; x: number; y: number; k: number; f: number; expr?: string; rot?: number; tears?: boolean }> = ({ who, x, y, k, f, expr = 'neutral', rot = 0, tears = false }) => {
  const spec = who === 'sam' ? SAM : who === 'dad' ? DAD : MOM;
  const b = Math.sin(sf(f, 3) / 14) * 4;
  return (
    <g transform={`translate(${x},${y + b}) rotate(${rot + Math.sin(sf(f, 3) / 24) * 0.8}) scale(${k})`}>
      <Shoulders c={spec.topC} d={spec.topD} skin={spec.skin} />
      <HairBack s={spec} />
      <FacePerson s={spec} expr={expr} f={f} />
      <HairFront s={spec} />
      {tears && [-1, 1].map((q) => (
        <path key={q} d={`M${q * 70},${20} q${q * 6},60 ${q * 2},${110 + ((sf(f, 3) * 3) % 40)}`} stroke="#0a0e16" strokeWidth={10} fill="none" opacity={0.85} strokeLinecap="round" />
      ))}
    </g>
  );
};

// THE EYELESS LURKER (Original Yamishibai paper cutout creature)
// Pale, leathery, hairless, hunched spine, eyeless smooth bone sockets, elongated clawed arms.
export const LurkerCreature: React.FC<{ f: number; crawl?: boolean; stalk?: boolean; reach?: boolean; scale?: number }> = ({ f, crawl = false, stalk = false, reach = false, scale = 1 }) => {
  const t = sf(f, 3);
  const breath = Math.sin(t / 12) * 5;
  const jitter = Math.sin(t * 1.8) * 3;

  if (crawl) {
    // Slithering flat under bed
    return (
      <g transform={`scale(${scale})`}>
        {/* Shadow */}
        <ellipse cx="0" cy="40" rx="360" ry="60" fill="#000" opacity={0.8} />
        {/* Elongated slithering body */}
        <path d="M-300,10 C-200,-20 -50,-30 180,0 C260,15 320,35 340,40 C280,50 120,55 -150,45 Z" fill={Q.fleshPale} stroke={INK} strokeWidth={8} />
        {/* Spine bones ridges */}
        {[-220, -160, -100, -40, 20, 80, 140, 200].map((bx, i) => (
          <ellipse key={i} cx={bx} cy={-5 + Math.sin((bx + t * 4) / 50) * 4} rx={12} ry={18} fill={Q.fleshDead} stroke={INK} strokeWidth={4} />
        ))}
        {/* Eyeless Head turning forward */}
        <g transform={`translate(280, ${-15 + jitter}) rotate(${5 + Math.sin(t / 8) * 4})`}>
          <path d="M-50,-40 C10,-60 80,-40 90,10 C95,50 40,75 -20,60 C-60,50 -70,0 -50,-40 Z" fill={Q.fleshPale} stroke={INK} strokeWidth={7} />
          {/* Eyeless hollow sunken sockets */}
          <ellipse cx="25" cy="-5" rx="14" ry="9" fill="#0d1118" stroke={INK} strokeWidth={5} />
          <ellipse cx="65" cy="-2" rx="12" ry="8" fill="#0d1118" stroke={INK} strokeWidth={5} />
          {/* Thin slit mouth */}
          <path d="M10,35 Q45,45 80,32" stroke={INK} strokeWidth={5} fill="none" />
        </g>
        {/* Crawling claw arms */}
        <path d={`M-80,20 C-60,70 40,110 ${120 + breath},85`} stroke={Q.fleshDead} strokeWidth={24} strokeLinecap="round" fill="none" />
        <path d={`M-80,20 C-60,70 40,110 ${120 + breath},85`} stroke={INK} strokeWidth={6} strokeLinecap="round" fill="none" />
        {/* Claw fingers */}
        <path d={`M${120 + breath},85 l25,10 m-25,-10 l30,0 m-30,0 l25,-10`} stroke={INK} strokeWidth={5} strokeLinecap="round" />
      </g>
    );
  }

  // Standing / Dragging / Hunched stance
  return (
    <g transform={`scale(${scale})`}>
      {/* Heavy floor shadow */}
      <ellipse cx="0" cy="220" rx="180" ry="35" fill="#000" opacity={0.7} />

      {/* Hunched Torso with pronounced ribcage and vertebrae */}
      <path d={`M-80,180 C-110,60 -90,-80 -10,-140 C80,-120 120,-30 90,80 C70,160 20,200 -80,180 Z`} fill={Q.fleshPale} stroke={INK} strokeWidth={8} />

      {/* Rib lines */}
      {[-60, -20, 20, 60].map((ry, i) => (
        <path key={i} d={`M-30,${ry + breath} Q20,${ry + 10 + breath} 65,${ry - 5 + breath}`} stroke={Q.fleshDead} strokeWidth={8} fill="none" />
      ))}

      {/* Heavy hunched neck & eyeless head */}
      <g transform={`translate(${-40 + jitter}, ${-160 + breath}) rotate(${-12 + Math.sin(t / 14) * 3})`}>
        <path d="M-60,-30 C-30,-90 60,-80 80,-20 C95,30 50,70 -10,65 C-50,60 -75,20 -60,-30 Z" fill={Q.fleshPale} stroke={INK} strokeWidth={8} />
        {/* Eyeless bone sockets */}
        <ellipse cx="15" cy="-10" rx="18" ry="12" fill="#080b12" stroke={INK} strokeWidth={6} />
        <ellipse cx="60" cy="-5" rx="15" ry="10" fill="#080b12" stroke={INK} strokeWidth={6} />
        {/* Gaunt cheek line */}
        <path d="M5,15 Q35,28 55,18" stroke={Q.fleshDead} strokeWidth={6} fill="none" />
        {/* Slit mouth slightly ajar */}
        <path d="M0,42 Q35,52 70,38" stroke={INK} strokeWidth={6} fill="none" />
      </g>

      {/* Long spindly arms reaching or dragging */}
      {reach ? (
        <g>
          <path d={`M40,-50 C120,-20 220,10 ${290 + breath},${40 + jitter}`} stroke={Q.fleshPale} strokeWidth={26} strokeLinecap="round" fill="none" />
          <path d={`M40,-50 C120,-20 220,10 ${290 + breath},${40 + jitter}`} stroke={INK} strokeWidth={7} strokeLinecap="round" fill="none" />
          {/* Long needle claws */}
          {[0, 1, 2, 3].map((ci) => (
            <line key={ci} x1={290 + breath} y1={40 + jitter} x2={340 + breath + ci * 8} y2={45 + jitter + ci * 12} stroke={INK} strokeWidth={6} strokeLinecap="round" />
          ))}
        </g>
      ) : (
        <g>
          {/* Arms dragging downward */}
          <path d={`M-60,-40 C-100,40 -120,140 -130,220`} stroke={Q.fleshPale} strokeWidth={26} strokeLinecap="round" fill="none" />
          <path d={`M-60,-40 C-100,40 -120,140 -130,220`} stroke={INK} strokeWidth={7} strokeLinecap="round" fill="none" />
          <path d={`M50,-30 C70,60 90,150 110,230`} stroke={Q.fleshPale} strokeWidth={26} strokeLinecap="round" fill="none" />
          <path d={`M50,-30 C70,60 90,150 110,230`} stroke={INK} strokeWidth={7} strokeLinecap="round" fill="none" />
        </g>
      )}

      {/* Slender bent legs */}
      <path d="M-50,180 L-70,290 L-100,340" stroke={Q.fleshDead} strokeWidth={28} strokeLinecap="round" fill="none" />
      <path d="M-50,180 L-70,290 L-100,340" stroke={INK} strokeWidth={7} strokeLinecap="round" fill="none" />
      <path d="M20,190 L40,290 L70,340" stroke={Q.fleshDead} strokeWidth={28} strokeLinecap="round" fill="none" />
      <path d="M20,190 L40,290 L70,340" stroke={INK} strokeWidth={7} strokeLinecap="round" fill="none" />
    </g>
  );
};

// Bedroom Props: Bed with Sam under blankets, propped Father, seated Mother
export const BedroomBed: React.FC<{ f: number; samTerror?: boolean; fatherPropped?: boolean; creatureUnder?: boolean }> = ({ f, samTerror = true, fatherPropped = false, creatureUnder = false }) => {
  const t = sf(f, 3);
  const shiver = samTerror ? Math.sin(t * 2.2) * 2 : 0;

  return (
    <g>
      {/* Dark under-bed abyss */}
      <rect x={-450} y={120} width={900} height={130} fill="#030407" />

      {/* If creature is under bed, its claws and eyeless silhouette peek out */}
      {creatureUnder && (
        <g transform="translate(0, 160)">
          <LurkerCreature f={f} crawl scale={0.85} />
        </g>
      )}

      {/* Bed wooden frame */}
      <rect x={-480} y={100} width={960} height={35} fill={Q.bedWood} stroke={INK} strokeWidth={8} />
      {/* Bed posts */}
      <rect x={-470} y={-80} width={45} height={260} fill={Q.bedWoodDk} stroke={INK} strokeWidth={7} />
      <rect x={425} y={-40} width={45} height={220} fill={Q.bedWoodDk} stroke={INK} strokeWidth={7} />

      {/* Mattress and Sheets */}
      <path d="M-440,95 Q0,85 430,95 L430,40 Q0,30 -440,40 Z" fill="#3a4454" stroke={INK} strokeWidth={6} />
      {/* Quilt / Blanket mound with Sam shivering under it */}
      <g transform={`translate(0, ${shiver})`}>
        <path d="M-380,45 C-320,-70 -120,-85 80,-40 C190,-10 320,15 390,45 Z" fill={Q.sheet} stroke={INK} strokeWidth={8} />
        <path d="M-300,30 C-240,-50 -100,-60 60,-25" stroke={Q.sheetDk} strokeWidth={12} fill="none" opacity={0.7} />
        {/* Sam's terrified eyes peeking over the top rim */}
        {samTerror && (
          <g transform="translate(-180, -60)">
            <ellipse cx="-18" cy="0" rx="14" ry="10" fill="#fff" stroke={INK} strokeWidth={4} />
            <circle cx="-16" cy="0" r="5" fill="#111" />
            <ellipse cx="18" cy="0" rx="14" ry="10" fill="#fff" stroke={INK} strokeWidth={4} />
            <circle cx="20" cy="0" r="5" fill="#111" />
          </g>
        )}
      </g>

      {/* Propped Father against the bed edge */}
      {fatherPropped && (
        <g transform="translate(320, 20) rotate(-6)">
          {/* Elias propped up, unblinking wide eyes, mouth open */}
          <Alive x={0} y={0} f={f} mode="shake">
            <FullPerson s={DAD} x={0} y={0} k={0.65} f={f} expr="fear" />
            {/* Dark tear streaks */}
            <path d="M-15,-205 L-12,-160" stroke="#050810" strokeWidth={6} />
            <path d="M15,-205 L18,-160" stroke="#050810" strokeWidth={6} />
          </Alive>
        </g>
      )}
    </g>
  );
};

// Blood/Ritual Scrawl on Wall: pentagram & "I KNOW YOU'RE AWAKE"
export const WallRitual: React.FC<{ revealWords?: boolean; bloodPentagram?: boolean }> = ({ revealWords = false, bloodPentagram = true }) => (
  <g>
    {bloodPentagram && (
      <g opacity={0.85}>
        {/* Hand smudge circle */}
        <circle cx="0" cy="-60" r="140" fill="none" stroke={Q.redDark} strokeWidth={14} strokeDasharray="40 10 20 8" />
        <circle cx="0" cy="-60" r="140" fill="none" stroke={Q.redAccent} strokeWidth={6} strokeDasharray="30 15 10 5" />
        {/* Inner star / pentagram lines */}
        <path d="M0,-200 L40,-70 L140,-70 L60,0 L90,100 L0,40 L-90,100 L-60,0 L-140,-70 L-40,-70 Z" fill="none" stroke={Q.redAccent} strokeWidth={8} strokeLinejoin="round" />
        {/* Drips */}
        <line x1="-80" y1="20" x2="-80" y2="90" stroke={Q.redDark} strokeWidth={5} />
        <line x1="70" y1="30" x2="70" y2="110" stroke={Q.redDark} strokeWidth={5} />
        <line x1="0" y1="60" x2="0" y2="130" stroke={Q.redDark} strokeWidth={6} />
      </g>
    )}

    {revealWords && (
      <g transform="translate(0, 180)">
        <text x="0" y="0" textAnchor="middle" fill={Q.redAccent} fontFamily="Lora" fontWeight="bold" fontSize="48" letterSpacing="6" style={{ filter: 'drop-shadow(0 0 10px rgba(184, 28, 22, 0.7))' }}>
          I KNOW YOU ARE AWAKE
        </text>
        <line x1="-310" y1="25" x2="310" y2="25" stroke={Q.redDark} strokeWidth={5} />
        {/* Blood drips from text */}
        {[-220, -110, 0, 120, 240].map((dx, i) => (
          <line key={i} x1={dx} y1={25} x2={dx + 2} y2={65 + (i % 3) * 20} stroke={Q.redAccent} strokeWidth={4} strokeLinecap="round" />
        ))}
      </g>
    )}
  </g>
);
