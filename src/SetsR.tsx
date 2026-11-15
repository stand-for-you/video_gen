import React from 'react';
import { INK, RED } from './Kit';
import { FullPerson } from './Cast';
import { sf } from './Beast';
import { Q, NOAH, MIRA, Alive, Face, PineTree, WoodFence, MimicCreature, DualSyrinxCutaway, MirrorEyeCutaway } from './MimicKit';

// Standard 1080x1920 Vertical Sets for "The Treeline Mimic" (Reel)
// All scenes re-composed natively on a 1080x1920 canvas.
// Captions safe area: keep focal content above y 1420.

export const SETS: Record<string, React.FC<{ f: number; v?: any }>> = {
  // 1. Reel First Frame: Tall Night Pines, Cabin, Fence, Glowing Eyes
  reel_first: ({ f, v = {} }) => {
    return (
      <svg viewBox="0 0 1080 1920" style={{ width: '100%', height: '100%' }}>
        {/* Sky */}
        <rect width="1080" height="1920" fill={Q.skyDk} />
        <rect x="0" y="600" width="1080" height="1320" fill={Q.skyMist} opacity={0.6} />

        {/* Crescent Moon High in Sky */}
        <g transform="translate(860, 240)">
          <circle cx="0" cy="0" r="54" fill={Q.moonWhite} />
          <circle cx="18" cy="-14" r="50" fill={Q.skyDk} />
        </g>

        {/* Tall Pine Silhouettes towering above */}
        <PineTree x={160} y={1100} h={760} w={320} c="#081013" />
        <PineTree x={920} y={1140} h={820} w={340} c="#081013" />
        <PineTree x={380} y={1060} h={680} w={280} c="#0e1b1e" />

        {/* Ground */}
        <rect x="0" y="1120" width="1080" height="800" fill="#0d1416" />
        <line x1="0" y1="1120" x2="1080" y2="1120" stroke={INK} strokeWidth={9} />

        {/* Split Rail Fence */}
        <WoodFence x={0} y={1380} w={1080} h={260} />

        {/* Cabin on the left */}
        <g transform="translate(260, 1120)">
          <rect x="-180" y="-340" width="360" height="340" fill={Q.cabinWood} stroke={INK} strokeWidth={8} />
          <polygon points="-220,-340 0,-440 220,-340" fill="#20150e" stroke={INK} strokeWidth={8} />
          {/* Glowing amber window */}
          <rect x="-130" y="-240" width="130" height="160" fill={Q.windowAmber} stroke={INK} strokeWidth={6} />
          <polygon points="-130,-240 0,-240 360,260 -240,260" fill={Q.windowAmber} opacity={0.14} />
        </g>

        {/* Glowing eyes in dark forest (focal center around y 780-840) */}
        <g transform="translate(680, 820)">
          <circle cx="-16" cy="0" r="6" fill="#ffffff" />
          <circle cx="16" cy="0" r="6" fill="#ffffff" />
          <circle cx="-16" cy="0" r="12" fill="#ffffff" opacity={0.3} />
          <circle cx="16" cy="0" r="12" fill="#ffffff" opacity={0.3} />
          <path d="M0,25 L0,260" stroke="#040708" strokeWidth={24} opacity={0.85} />
        </g>
      </svg>
    );
  },

  // 2. Reel Cabin Door & Deadbolt
  reel_porch: ({ f, v = {} }) => {
    return (
      <svg viewBox="0 0 1080 1920" style={{ width: '100%', height: '100%' }}>
        <rect width="1080" height="1920" fill={Q.skyDk} />
        {/* Cabin Wall planks */}
        {Array.from({ length: 24 }).map((_, i) => (
          <rect key={i} x={0} y={i * 80} width="1080" height="78" fill={i % 2 === 0 ? Q.cabinWood : '#2b1f17'} stroke={INK} strokeWidth={3} />
        ))}

        {/* Heavy Door */}
        <rect x="220" y="320" width="640" height="1280" fill="#241710" stroke={INK} strokeWidth={10} />
        {/* Deadbolt */}
        <rect x="260" y="880" width="90" height="55" rx="5" fill="#110d0a" stroke={INK} strokeWidth={5} />
        <circle cx="305" cy="907" r="18" fill="#d9a836" stroke={INK} strokeWidth={4} />

        {/* Door Window Pane */}
        <rect x="340" y="440" width="400" height="340" fill="#0a1218" stroke={INK} strokeWidth={8} />

        {/* Noah standing in dread */}
        <g transform="translate(540, 1080)">
          <Alive x={0} y={0} f={f} mode="tremble">
            <FullPerson s={NOAH} x={0} y={0} k={1.4} f={f} expr="fear" />
          </Alive>
        </g>
      </svg>
    );
  },

  // 3. Reel Dual Syrinx Anatomical Breakdown
  reel_syrinx: ({ f, v = {} }) => {
    return (
      <svg viewBox="0 0 1080 1920" style={{ width: '100%', height: '100%' }}>
        <rect width="1080" height="1920" fill="#090d14" />
        <rect x="40" y="160" width="1000" height="1200" fill="#101722" stroke={INK} strokeWidth={8} />

        {/* Syrinx Diagram centered nicely above captions */}
        <DualSyrinxCutaway x={540} y={720} k={2.1} f={f} />
      </svg>
    );
  },

  // 4. Reel Tapetum Lucidum (Mirror Eye) Breakdown
  reel_eye: ({ f, v = {} }) => {
    return (
      <svg viewBox="0 0 1080 1920" style={{ width: '100%', height: '100%' }}>
        <rect width="1080" height="1920" fill="#090d14" />
        <rect x="40" y="160" width="1000" height="1200" fill="#0e151e" stroke={INK} strokeWidth={8} />

        {/* Eye Diagram centered */}
        <MirrorEyeCutaway x={540} y={700} k={2.5} f={f} />
      </svg>
    );
  },

  // 5. Reel Full Mimic Reveal (Vertical 9-Foot Entity)
  reel_mimic_full: ({ f, v = {} }) => {
    return (
      <svg viewBox="0 0 1080 1920" style={{ width: '100%', height: '100%' }}>
        <rect width="1080" height="1920" fill={Q.skyDk} />
        <PineTree x={180} y={1100} h={780} w={320} c="#091316" />
        <PineTree x={900} y={1100} h={780} w={320} c="#091316" />

        <rect x="0" y="1180" width="1080" height="740" fill="#0b1114" />
        <line x1="0" y1="1180" x2="1080" y2="1180" stroke={INK} strokeWidth={8} />

        <WoodFence x={0} y={1420} w={1080} h={240} />

        {/* Tall Mimic towering in center */}
        <g transform="translate(540, 1140)">
          <Alive x={0} y={0} f={f} mode="reach">
            <MimicCreature x={0} y={0} k={1.7} f={f} pose="reach" />
          </Alive>
        </g>
      </svg>
    );
  },

  // 6. Reel Mimic Giant Face
  reel_mimic_face: ({ f, v = {} }) => {
    const t = sf(f, 3);
    const jawY = 24 + Math.sin(t / 8) * 12;
    return (
      <svg viewBox="0 0 1080 1920" style={{ width: '100%', height: '100%' }}>
        <rect width="1080" height="1920" fill="#040608" />
        <circle cx="540" cy="740" r="480" fill="#101920" opacity={0.4} />

        {/* Giant Face positioned safely in upper vertical quadrant */}
        <g transform={`translate(540, ${680 + Math.sin(t / 14) * 6}) scale(3.5)`}>
          <ellipse cx={0} cy={-20} rx={60} ry={82} fill={Q.fleshPale} stroke={INK} strokeWidth={8} />
          {/* Glowing Eyes */}
          <ellipse cx={-24} cy={-28} rx={20} ry={24} fill="#020406" stroke={INK} strokeWidth={5} />
          <ellipse cx={24} cy={-28} rx={20} ry={24} fill="#020406" stroke={INK} strokeWidth={5} />
          <circle cx={-24} cy={-28} r={7} fill="#ffffff" />
          <circle cx={24} cy={-28} r={7} fill="#ffffff" />
          <circle cx={-24} cy={-28} r={12} fill="#ffffff" opacity={0.3} />
          <circle cx={24} cy={-28} r={12} fill="#ffffff" opacity={0.3} />

          {/* Dark tear tracks */}
          <path d="M-24,-4 L-28,45" stroke="#05080b" strokeWidth={6} strokeLinecap="round" />
          <path d="M24,-4 L28,45" stroke="#05080b" strokeWidth={6} strokeLinecap="round" />

          {/* Mouth */}
          <path d={`M-38,18 C-18,${22 + jawY} 18,${22 + jawY} 38,18 C28,52 -28,52 -38,18Z`} fill="#100404" stroke={INK} strokeWidth={7} />
          <path d="M-30,22 l6,16 l6,-16 l6,16 l6,-16 l6,16 l6,-16" stroke="#dde6e8" strokeWidth={3} fill="none" />
        </g>
      </svg>
    );
  },

  // 7. Reel Noah Face
  reel_noah_face: ({ f, v = {} }) => {
    return (
      <svg viewBox="0 0 1080 1920" style={{ width: '100%', height: '100%' }}>
        <rect width="1080" height="1920" fill={Q.cabinWood} />
        <polygon points="0,0 1080,0 1080,1920" fill="#0a0c10" opacity={0.65} />
        <Face who="noah" x={540} y={740} k={2.5} f={f} expr="fear" />
      </svg>
    );
  },

  // 8. Reel Question / Title Card
  reel_qcard: ({ f, v = {} }) => {
    return (
      <svg viewBox="0 0 1080 1920" style={{ width: '100%', height: '100%' }}>
        <rect width="1080" height="1920" fill="#080c10" />
        <rect x="60" y="240" width="960" height="1080" fill="none" stroke={Q.fogTeal} strokeWidth={8} />
        <rect x="85" y="265" width="910" height="1030" fill="none" stroke={RED} strokeWidth={3} opacity={0.7} />
        <text x="540" y="740" fill="#ffffff" fontSize={52} fontFamily="serif" fontWeight="bold" textAnchor="middle">
          {v.title ?? "THE TREELINE MIMIC"}
        </text>
      </svg>
    );
  },
};
