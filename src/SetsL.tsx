import React from 'react';
import { INK, RED } from './Kit';
import { FullPerson } from './Cast';
import { sf } from './Beast';
import { Q, NOAH, MIRA, Alive, Face, PineTree, WoodFence, MimicCreature, DualSyrinxCutaway, MirrorEyeCutaway } from './MimicKit';

// Standard 1920x1080 Widescreen Sets for "The Treeline Mimic"
// All components follow React.FC<{ f: number; v?: any }>

export const SETS: Record<string, React.FC<{ f: number; v?: any }>> = {
  // 1. First Creepiest Picture: The Cabin, the Fence, and the Glowing Eyes at 2:15 AM
  first_frame: ({ f, v = {} }) => {
    return (
      <svg viewBox="0 0 1920 1080" style={{ width: '100%', height: '100%' }}>
        {/* Night Sky with cold fog gradient */}
        <rect width="1920" height="1080" fill={Q.skyDk} />
        <rect x="0" y="320" width="1920" height="760" fill={Q.skyMist} opacity={0.6} />

        {/* Crescent Moon */}
        <g transform="translate(1620, 140)">
          <circle cx="0" cy="0" r="48" fill={Q.moonWhite} />
          <circle cx="16" cy="-12" r="44" fill={Q.skyDk} />
        </g>

        {/* Deep Pine Silhouettes in background */}
        <PineTree x={120} y={640} h={440} w={190} c="#081013" />
        <PineTree x={320} y={660} h={480} w={220} c="#0c1618" />
        <PineTree x={1480} y={630} h={420} w={180} c="#081013" />
        <PineTree x={1720} y={670} h={510} w={230} c="#0c1618" />

        {/* Forest Ground */}
        <rect x="0" y="660" width="1920" height="420" fill="#0d1416" />
        <line x1="0" y1="660" x2="1920" y2="660" stroke={INK} strokeWidth={8} />

        {/* Cabin on the left */}
        <g transform="translate(360, 660)">
          {/* Cabin body */}
          <rect x="-240" y="-380" width="480" height="380" fill={Q.cabinWood} stroke={INK} strokeWidth={9} />
          {/* Porch overhang */}
          <polygon points="-280,-380 0,-500 280,-380" fill="#20150e" stroke={INK} strokeWidth={9} />
          {/* Glowing window */}
          <rect x="-180" y="-280" width="160" height="200" fill={Q.windowAmber} stroke={INK} strokeWidth={7} />
          <line x1="-100" y1="-280" x2="-100" y2="-80" stroke={INK} strokeWidth={5} />
          <line x1="-180" y1="-180" x2="-20" y2="-180" stroke={INK} strokeWidth={5} />
          {/* Window warm light beam */}
          <polygon points="-180,-280 -20,-280 440,320 -320,320" fill={Q.windowAmber} opacity={0.12} />
          {/* Noah silhouette looking out window */}
          <g transform="translate(-100,-120)">
            <ellipse cx="0" cy="-35" rx="16" ry="22" fill="#120c08" />
            <rect x="-18" y="-12" width="36" height="45" fill="#120c08" />
          </g>
          {/* Wooden door */}
          <rect x="30" y="-320" width="150" height="320" fill="#261a12" stroke={INK} strokeWidth={7} />
          {/* Brass handle / lock */}
          <circle cx="50" cy="-150" r="8" fill="#e8b84b" stroke={INK} strokeWidth={3} />
        </g>

        {/* Split rail fence crossing front */}
        <WoodFence x={0} y={880} w={1920} h={220} />

        {/* Glowing tapetum eyes in the dark pines */}
        <g transform="translate(1260, 520)">
          <circle cx="-14" cy="0" r="5" fill="#ffffff" />
          <circle cx="14" cy="0" r="5" fill="#ffffff" />
          <circle cx="-14" cy="0" r="8" fill="#ffffff" opacity={0.3} />
          <circle cx="14" cy="0" r="8" fill="#ffffff" opacity={0.3} />
          {/* Faint tall skeletal silhouette */}
          <path d="M0,20 L0,180" stroke="#05080a" strokeWidth={18} opacity={0.8} />
        </g>
      </svg>
    );
  },

  // 2. Cabin Porch Door & Noah in Dread
  porch_door: ({ f, v = {} }) => {
    return (
      <svg viewBox="0 0 1920 1080" style={{ width: '100%', height: '100%' }}>
        <rect width="1920" height="1080" fill={Q.skyDk} />
        {/* Cabin wall planks */}
        <g transform="translate(480, 0)">
          {Array.from({ length: 14 }).map((_, i) => (
            <rect key={i} x={0} y={i * 80} width="1440" height="78" fill={i % 2 === 0 ? Q.cabinWood : '#2b1f17'} stroke={INK} strokeWidth={3} />
          ))}
          {/* Heavy wooden door */}
          <rect x="240" y="160" width="460" height="920" fill="#241710" stroke={INK} strokeWidth={10} />
          {/* Deadbolt hardware */}
          <rect x="270" y="520" width="70" height="45" rx="4" fill="#110d0a" stroke={INK} strokeWidth={5} />
          <circle cx="305" cy="542" r="14" fill="#d9a836" stroke={INK} strokeWidth={3} />
          {/* Window pane on door */}
          <rect x="340" y="240" width="260" height="240" fill="#0c151c" stroke={INK} strokeWidth={7} />
          {/* Outdoor cold light passing through */}
          <polygon points="340,240 600,240 760,1080 180,1080" fill={Q.fogTeal} opacity={0.08} />
        </g>

        {/* Noah standing by the door */}
        <g transform="translate(560, 680)">
          <Alive x={0} y={0} f={f} mode="tremble">
            <FullPerson s={NOAH} x={0} y={0} k={1.1} f={f} expr="fear" />
          </Alive>
        </g>

        {/* Shadow hand reaching across window if active */}
        {v.shadow && (
          <g transform="translate(940, 360)">
            <path d="M60,-80 L-10,30 L-80,80" stroke="#05080c" strokeWidth={14} strokeLinecap="round" />
            <path d="M-80,80 l-25,-12 M-80,80 l-30,4 M-80,80 l-24,20" stroke="#05080c" strokeWidth={5} strokeLinecap="round" />
          </g>
        )}
      </svg>
    );
  },

  // 3. Wide Pine Woods Clearing
  woods_wide: ({ f, v = {} }) => {
    return (
      <svg viewBox="0 0 1920 1080" style={{ width: '100%', height: '100%' }}>
        <rect width="1920" height="1080" fill={Q.skyDk} />
        {/* Layered Pines */}
        <PineTree x={220} y={540} h={520} w={240} c="#081013" />
        <PineTree x={460} y={580} h={460} w={210} c="#0f1d20" />
        <PineTree x={760} y={520} h={540} w={260} c="#091316" />
        <PineTree x={1220} y={530} h={530} w={250} c="#0b171a" />
        <PineTree x={1540} y={570} h={480} w={220} c="#112226" />
        <PineTree x={1780} y={530} h={560} w={270} c="#081013" />

        {/* Ground with pine needle mounds */}
        <rect x="0" y="600" width="1920" height="480" fill="#0d1416" />
        <line x1="0" y1="600" x2="1920" y2="600" stroke={INK} strokeWidth={8} />

        {/* Fence line */}
        <WoodFence x={0} y={820} w={1920} h={240} />

        {/* Mimic in the distance if visible */}
        {v.mimic && (
          <g transform="translate(960, 600)">
            <Alive x={0} y={0} f={f} mode="stalk">
              <MimicCreature x={0} y={0} k={0.7} f={f} pose="stalk" />
            </Alive>
          </g>
        )}
      </svg>
    );
  },

  // 4. Anatomical Cutaway: Dual Voice Boxes (Dual Syrinx)
  dual_syrinx: ({ f, v = {} }) => {
    return (
      <svg viewBox="0 0 1920 1080" style={{ width: '100%', height: '100%' }}>
        {/* Dark scientific / parchment frame */}
        <rect width="1920" height="1080" fill="#0a0e14" />
        <rect x="40" y="40" width="1840" height="1000" fill="#101722" stroke={INK} strokeWidth={8} />

        {/* Center Diagram */}
        <DualSyrinxCutaway x={960} y={540} k={1.7} f={f} />

        {/* Explanatory subtitle banner */}
        <rect x="360" y="880" width="1200" height="80" rx="8" fill="#070a0e" stroke={INK} strokeWidth={5} />
        <text x="960" y="930" fill="#e2edf0" fontSize={26} fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
          TWO INDEPENDENT ACOUSTIC SYRINX CHAMBERS — PERFECT HUMAN MIMICRY
        </text>
      </svg>
    );
  },

  // 5. Anatomical Cutaway: Tapetum Lucidum (Mirror Eye)
  mirror_eye: ({ f, v = {} }) => {
    return (
      <svg viewBox="0 0 1920 1080" style={{ width: '100%', height: '100%' }}>
        <rect width="1920" height="1080" fill="#0a0e14" />
        <rect x="40" y="40" width="1840" height="1000" fill="#0f1620" stroke={INK} strokeWidth={8} />

        {/* Center Eye Diagram */}
        <MirrorEyeCutaway x={960} y={520} k={2.0} f={f} />

        {/* Explanatory subtitle banner */}
        <rect x="320" y="880" width="1280" height="80" rx="8" fill="#070a0e" stroke={INK} strokeWidth={5} />
        <text x="960" y="930" fill="#48c4d4" fontSize={26} fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
          TAPETUM LUCIDUM: REFLECTIVE MIRROR LAYER BOUNCES AMBIENT LIGHT
        </text>
      </svg>
    );
  },

  // 6. Mimic Creature Full Reveal (9-Foot Skeletal Entity)
  mimic_full: ({ f, v = {} }) => {
    return (
      <svg viewBox="0 0 1920 1080" style={{ width: '100%', height: '100%' }}>
        <rect width="1920" height="1080" fill={Q.skyDk} />
        <PineTree x={280} y={620} h={520} w={220} c="#091316" />
        <PineTree x={1640} y={620} h={520} w={220} c="#091316" />
        <rect x="0" y="680" width="1920" height="400" fill="#0c1214" />
        <line x1="0" y1="680" x2="1920" y2="680" stroke={INK} strokeWidth={8} />

        <WoodFence x={0} y={880} w={1920} h={200} />

        {/* Giant Mimic standing in center */}
        <g transform="translate(960, 680)">
          <Alive x={0} y={0} f={f} mode="reach">
            <MimicCreature x={0} y={0} k={1.4} f={f} pose={v.reach ? 'reach' : 'stalk'} />
          </Alive>
        </g>
      </svg>
    );
  },

  // 7. Noah Close-up Face
  noah_closeup: ({ f, v = {} }) => {
    return (
      <svg viewBox="0 0 1920 1080" style={{ width: '100%', height: '100%' }}>
        <rect width="1920" height="1080" fill={Q.cabinWood} />
        {/* Wall shadows */}
        <polygon points="0,0 1920,0 1920,1080" fill="#0c0e12" opacity={0.6} />
        <Face who="noah" x={960} y={540} k={2.2} f={f} expr={v.expr ?? 'fear'} />
      </svg>
    );
  },

  // 8. Mimic Giant Face Close-up
  mimic_face: ({ f, v = {} }) => {
    const t = sf(f, 3);
    const jawY = 24 + Math.sin(t / 8) * 12;
    return (
      <svg viewBox="0 0 1920 1080" style={{ width: '100%', height: '100%' }}>
        <rect width="1920" height="1080" fill="#05070a" />
        {/* Fog wash */}
        <circle cx="960" cy="540" r="540" fill="#121e24" opacity={0.4} />

        {/* Giant skull */}
        <g transform={`translate(960, ${460 + Math.sin(t / 14) * 6}) scale(3.2)`}>
          <ellipse cx={0} cy={-20} rx={60} ry={82} fill={Q.fleshPale} stroke={INK} strokeWidth={8} />
          {/* Eyes */}
          <ellipse cx={-24} cy={-28} rx={20} ry={24} fill="#020406" stroke={INK} strokeWidth={5} />
          <ellipse cx={24} cy={-28} rx={20} ry={24} fill="#020406" stroke={INK} strokeWidth={5} />
          <circle cx={-24} cy={-28} r={7} fill="#ffffff" />
          <circle cx={24} cy={-28} r={7} fill="#ffffff" />
          <circle cx={-24} cy={-28} r={12} fill="#ffffff" opacity={0.3} />
          <circle cx={24} cy={-28} r={12} fill="#ffffff" opacity={0.3} />

          {/* Dark tear tracks */}
          <path d="M-24,-4 L-28,45" stroke="#05080b" strokeWidth={6} strokeLinecap="round" />
          <path d="M24,-4 L28,45" stroke="#05080b" strokeWidth={6} strokeLinecap="round" />

          {/* Gaping mouth */}
          <path d={`M-38,18 C-18,${22 + jawY} 18,${22 + jawY} 38,18 C28,52 -28,52 -38,18Z`} fill="#100404" stroke={INK} strokeWidth={7} />
          <path d="M-30,22 l6,16 l6,-16 l6,16 l6,-16 l6,16 l6,-16" stroke="#dde6e8" strokeWidth={3} fill="none" />
        </g>
      </svg>
    );
  },

  // 9. Chapter Card
  qcard: ({ f, v = {} }) => {
    return (
      <svg viewBox="0 0 1920 1080" style={{ width: '100%', height: '100%' }}>
        <rect width="1920" height="1080" fill="#080c10" />
        <rect x="80" y="80" width="1760" height="920" fill="none" stroke={Q.fogTeal} strokeWidth={8} />
        <rect x="110" y="110" width="1700" height="860" fill="none" stroke={RED} strokeWidth={3} opacity={0.7} />
        <text x="960" y="520" fill="#ffffff" fontSize={56} fontFamily="serif" fontWeight="bold" textAnchor="middle">
          {v.title ?? "THE TREELINE MIMIC"}
        </text>
        {v.sub && (
          <text x="960" y="600" fill={RED} fontSize={32} fontFamily="sans-serif" textAnchor="middle">
            {v.sub}
          </text>
        )}
      </svg>
    );
  },

  // 10. End Screen
  end: ({ f }) => {
    return (
      <svg viewBox="0 0 1920 1080" style={{ width: '100%', height: '100%' }}>
        <rect width="1920" height="1080" fill="#06090c" />
        <rect x="100" y="100" width="1720" height="880" fill="none" stroke={RED} strokeWidth={6} opacity={0.6} />
        <text x="960" y="440" fill="#ffffff" fontSize={52} fontFamily="serif" fontWeight="bold" textAnchor="middle">
          WOULD YOU HAVE OPENED THE DOOR?
        </text>
        <text x="960" y="520" fill="#8ca0a8" fontSize={26} fontFamily="sans-serif" textAnchor="middle">
          SUBSCRIBE FOR WEEKLY HORROR FOLKLORE & INVESTIGATIONS
        </text>
        {/* Recommended video placeholders */}
        <rect x="260" y="600" width="600" height="300" rx="8" fill="#111720" stroke={INK} strokeWidth={6} />
        <rect x="1060" y="600" width="600" height="300" rx="8" fill="#111720" stroke={INK} strokeWidth={6} />
      </svg>
    );
  },
};
