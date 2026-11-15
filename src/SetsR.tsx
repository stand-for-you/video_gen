import React from 'react';
import { INK, RED } from './Kit';
import { sf } from './Beast';
import {
  Q,
  NOAH_SCHOLAR,
  ALANA_CHILD,
  Alive,
  FaceSolomon,
  FullSolomon,
  AncientTome,
  CarvedDoll,
  StoneCottage,
  BurningCabin,
  RagingRiver,
} from './SolomonKit';
import { FacePerson } from './Cast';

// Vertical 1080x1920 Sets for "The Melancholy of Herbert Solomon" (Reel)
// All scenes re-composed natively for vertical. Safe captions area: focus above y 1400.
export const SETS: Record<string, React.FC<{ f: number; v?: any }>> = {
  // 1. Reel Tome: St Andrews Library & 1578 Inscription
  reel_tome: ({ f, v = {} }) => {
    return (
      <svg viewBox="0 0 1080 1920" style={{ width: '100%', height: '100%' }}>
        <rect width="1080" height="1920" fill={Q.skyDk} />
        {/* Gothic Arch Window in upper third */}
        <g transform="translate(540, 480)">
          <path d="M-220,380 V-180 C-220,-480 0,-580 0,-580 C0,-580 220,-480 220,-180 V380Z" fill="#182430" stroke={INK} strokeWidth={9} />
          <polygon points="-160,-120 160,-120 360,780 -360,780" fill="#cde0ed" opacity={0.14} />
        </g>
        {/* Oak desk in lower half */}
        <polygon points="40,940 1040,940 1080,1920 0,1920" fill="#24170f" stroke={INK} strokeWidth={9} />
        <line x1="0" y1="940" x2="1080" y2="940" stroke={INK} strokeWidth={8} />

        {/* The Open 16th-Century Tome (Key Focal Element at y 1120) */}
        <AncientTome x={540} y={1120} w={640} h={380} open={true} />

        {/* Scholar Noah looking down from upper right */}
        <g transform="translate(860, 880) scale(0.62)">
          <FacePerson s={NOAH_SCHOLAR} expr="fear" f={f} />
        </g>
      </svg>
    );
  },

  // 2. Reel Hamlet: Cold Cobblestones of Ettrick
  reel_hamlet: ({ f, v = {} }) => {
    return (
      <svg viewBox="0 0 1080 1920" style={{ width: '100%', height: '100%' }}>
        <rect width="1080" height="1920" fill={Q.skyDk} />
        <rect y="400" width="1080" height="1520" fill={Q.skyMoor} opacity={0.65} />

        {/* Distant Steeple in Upper Third */}
        <g transform="translate(540, 520)">
          <rect x="-80" y="-180" width="160" height="180" fill="#202c34" stroke={INK} strokeWidth={7} />
          <polygon points="0,-380 -70,-180 70,-180" fill="#161e24" stroke={INK} strokeWidth={7} />
          <line x1="0" y1="-410" x2="0" y2="-380" stroke={INK} strokeWidth={5} />
        </g>

        {/* Stone Cottages framing the narrow street */}
        <StoneCottage x={220} y={1180} w={420} h={400} />
        <StoneCottage x={860} y={1180} w={420} h={400} />

        {/* Cobblestone street ground */}
        <polygon points="180,1180 900,1180 1080,1920 0,1920" fill="#161e24" stroke={INK} strokeWidth={8} />

        {/* Ground Fog drifting through */}
        <rect x="0" y="1100" width="1080" height="820" fill={Q.snowMist} opacity={0.2} />
      </svg>
    );
  },

  // 3. Reel Well: The Stone Well & Carved Doll
  reel_well: ({ f, v = {} }) => {
    return (
      <svg viewBox="0 0 1080 1920" style={{ width: '100%', height: '100%' }}>
        <rect width="1080" height="1920" fill="#140f1a" />
        <ellipse cx="540" cy="720" rx="420" ry="240" fill="#e58c28" opacity={0.18} />

        {/* Towering Scots Pines */}
        {[-40, 320, 840, 1020].map((px, pi) => (
          <g key={pi} transform={`translate(${px}, 960)`}>
            <polygon points="0,-520 -100,-180 100,-180" fill="#0d181c" stroke={INK} strokeWidth={8} />
            <polygon points="0,-320 -120,0 120,0" fill="#0d181c" stroke={INK} strokeWidth={8} />
            <rect x="-16" y="0" width="32" height="140" fill="#18120c" stroke={INK} strokeWidth={6} />
          </g>
        ))}

        {/* Ground */}
        <rect x="0" y="1040" width="1080" height="880" fill="#161e22" />
        <line x1="0" y1="1040" x2="1080" y2="1040" stroke={INK} strokeWidth={8} />

        {/* Large Stone Well in foreground */}
        <g transform="translate(540, 1200)">
          <ellipse cx="0" cy="0" rx="260" ry="70" fill="#2a3538" stroke={INK} strokeWidth={8} />
          <path d="M-260,0 C-260,70 260,70 260,0 V140 C260,210 -260,210 -260,140Z" fill="#1c2528" stroke={INK} strokeWidth={8} />
          <ellipse cx="0" cy="-5" rx="210" ry="52" fill="#07090c" stroke={INK} strokeWidth={6} />

          {/* Wooden Canopy */}
          <rect x="-180" y="-340" width="26" height="340" fill="#2c1e14" stroke={INK} strokeWidth={6} />
          <rect x="154" y="-340" width="26" height="340" fill="#2c1e14" stroke={INK} strokeWidth={6} />
          <polygon points="0,-440 -220,-340 220,-340" fill="#1e150f" stroke={INK} strokeWidth={7} />

          {/* Carved Doll resting on stone rim */}
          <g transform="translate(130, -15) scale(0.85)">
            <CarvedDoll x={0} y={0} />
          </g>
        </g>
      </svg>
    );
  },

  // 4. Reel Cabin Burning
  reel_cabin_burning: ({ f, v = {} }) => {
    return (
      <svg viewBox="0 0 1080 1920" style={{ width: '100%', height: '100%' }}>
        <rect width="1080" height="1920" fill="#1a0c0a" />
        <rect y="300" width="1080" height="1620" fill="#38100e" opacity={0.65} />

        {/* Burning Cabin centered at y 980 */}
        <BurningCabin x={540} y={980} f={f} />

        {/* Angry Mob Silhouettes in lower area */}
        {[-220, -70, 70, 220].map((vx, vi) => (
          <g key={vi} transform={`translate(${540 + vx}, 1280)`}>
            <path d="M-40,0 L-45,-140 L-30,-220 L30,-220 L45,-140 L40,0Z" fill="#140b08" stroke={INK} strokeWidth={7} />
            <ellipse cx="0" cy="-260" rx="24" ry="32" fill="#140b08" stroke={INK} strokeWidth={6} />
            <line x1="20" y1="-180" x2="50" y2="-320" stroke="#422e1e" strokeWidth={8} strokeLinecap="round" />
            <circle cx="50" cy="-340" r={26} fill={Q.torchFlame} stroke={RED} strokeWidth={4} />
          </g>
        ))}
      </svg>
    );
  },

  // 5. Reel Fog Stalk: Herbert Solomon's Shadow
  reel_fog_stalk: ({ f, v = {} }) => {
    return (
      <svg viewBox="0 0 1080 1920" style={{ width: '100%', height: '100%' }}>
        <rect width="1080" height="1920" fill="#080c10" />

        {/* Tall Narrow Scottish Alleyway */}
        <StoneCottage x={160} y={1180} w={420} h={520} />
        <StoneCottage x={920} y={1180} w={420} h={520} />

        {/* Cobblestones */}
        <polygon points="120,1180 960,1180 1080,1920 0,1920" fill="#141c22" stroke={INK} strokeWidth={8} />

        {/* Giant Spider-Like Shadow on Wall */}
        <g transform="translate(380, 1180) skewX(-35) scale(1.6, 0.7)" opacity={0.75}>
          <FullSolomon x={0} y={0} f={f} mode="stand" />
        </g>

        {/* Tall Herbert Solomon Figure in Center */}
        <g transform="translate(540, 1180) scale(1.05)">
          <Alive x={0} y={0} f={f} mode="sorrow">
            <FullSolomon x={0} y={0} f={f} mode="stand" />
          </Alive>
        </g>

        {/* Heavy Mist */}
        <rect x="0" y="1080" width="1080" height="840" fill={Q.snowMist} opacity={0.22} />
      </svg>
    );
  },

  // 6. Reel Cellar: Vaulted Ceilings, Chains, Rescued Children
  reel_cellar: ({ f, v = {} }) => {
    return (
      <svg viewBox="0 0 1080 1920" style={{ width: '100%', height: '100%' }}>
        <rect width="1080" height="1920" fill="#080b0e" />

        {/* Arched Stone Ceiling */}
        <path d="M0,0 H1080 V580 C840,420 540,440 280,440 C140,440 40,460 0,580Z" fill="#182026" stroke={INK} strokeWidth={8} />

        {/* Chains Hanging */}
        {[-220, 220].map((cx, ci) => (
          <g key={ci} transform={`translate(${540 + cx}, 380)`}>
            <line x1="0" y1="0" x2="0" y2="420" stroke="#3a444c" strokeWidth={7} strokeDasharray="9 7" />
            <circle cx="0" cy="425" r="16" fill="none" stroke="#2a333a" strokeWidth={5} />
          </g>
        ))}

        {/* Wall Lantern */}
        <g transform="translate(540, 560)">
          <circle cx="0" cy="0" r="140" fill={Q.torchAmber} opacity={0.18} />
          <rect x="-20" y="-35" width="40" height="70" rx="8" fill="#8c6a38" stroke={INK} strokeWidth={5} />
          <polygon points="-14,-18 14,-18 0,-32" fill={Q.torchFlame} />
        </g>

        {/* Floor */}
        <rect x="0" y="1120" width="1080" height="800" fill="#12181e" />
        <line x1="0" y1="1120" x2="1080" y2="1120" stroke={INK} strokeWidth={8} />

        {/* Huddled Children in shawls */}
        <g transform="translate(320, 1260)">
          <ellipse cx="0" cy="0" rx="160" ry="50" fill="#28323a" stroke={INK} strokeWidth={7} />
          <ellipse cx="-45" cy="-60" rx="34" ry="40" fill="#1c252c" />
          <ellipse cx="40" cy="-65" rx="36" ry="42" fill="#1c252c" />
          <CarvedDoll x="-10" y="-45" s={0.5} />
        </g>

        {/* Tom Sutherland sprawled dead on stone floor */}
        <g transform="translate(760, 1320)">
          <path d="M-140,20 L-40,-35 L60,-25 L120,10 L100,35 L-120,35Z" fill="#241a14" stroke={INK} strokeWidth={7} />
          <ellipse cx="-140" cy="0" rx="24" ry="20" fill="#8a6548" stroke={INK} strokeWidth={6} />
        </g>
      </svg>
    );
  },

  // 7. Reel River: Swollen River Rescue
  reel_river: ({ f, v = {} }) => {
    return (
      <svg viewBox="0 0 1080 1920" style={{ width: '100%', height: '100%' }}>
        <rect width="1080" height="1920" fill="#162028" />
        <rect y="380" width="1080" height="1540" fill="#222e36" opacity={0.6} />

        {/* Grassy Embankment in upper section */}
        <polygon points="0,780 420,840 0,960" fill="#1f2c24" stroke={INK} strokeWidth={7} />

        {/* Raging River in center */}
        <RagingRiver x={540} y={1160} w={1080} f={f} />

        {/* Girl on bank */}
        <g transform="translate(320, 1020) scale(0.68)">
          <Alive x={0} y={0} f={f} mode="sorrow">
            <FacePerson s={ALANA_CHILD} expr="fear" f={f} />
          </Alive>
        </g>

        {/* Herbert Solomon reaching over the bank */}
        <g transform="translate(680, 960) scale(0.85)">
          <Alive x={0} y={0} f={f} mode="sorrow">
            <FullSolomon x={0} y={0} f={f} mode="reach" />
          </Alive>
        </g>
      </svg>
    );
  },

  // 8. Reel Face: Solomon Close-Up Portrait
  reel_solomon_face: ({ f, v = {} }) => {
    return (
      <svg viewBox="0 0 1080 1920" style={{ width: '100%', height: '100%' }}>
        <rect width="1080" height="1920" fill="#090d14" />
        <circle cx="540" cy="820" r="480" fill="#1b2a33" opacity={0.25} />

        {/* Face placed centrally in safe viewport */}
        <g transform="translate(540, 820) scale(1.85)">
          <Alive x={0} y={0} f={f} mode="sorrow">
            <FaceSolomon f={f} expr="melancholy" />
          </Alive>
        </g>
      </svg>
    );
  },

  // 9. Reel Title Card
  reel_qcard: ({ f, v = {} }) => {
    return (
      <svg viewBox="0 0 1080 1920" style={{ width: '100%', height: '100%' }}>
        <rect width="1080" height="1920" fill={Q.skyDk} />
        {/* Border */}
        <rect x="60" y="240" width="960" height="1440" fill="none" stroke={Q.tomeGold} strokeWidth={8} rx={16} />
        <rect x="85" y="265" width="910" height="1390" fill="none" stroke="#3d2a1b" strokeWidth={4} rx={10} />

        {/* Carved Doll in Upper Center */}
        <g transform="translate(540, 680) scale(1.3)">
          <CarvedDoll x={0} y={0} />
        </g>

        {/* Title Text */}
        <text x="540" y="980" textAnchor="middle" fill="#eaf2f5" fontFamily="serif" fontSize={50} fontWeight="bold" letterSpacing={3}>
          THE MELANCHOLY OF
        </text>
        <text x="540" y="1080" textAnchor="middle" fill={RED} fontFamily="serif" fontSize={64} fontWeight="bold" letterSpacing={5}>
          HERBERT SOLOMON
        </text>
        <text x="540" y="1180" textAnchor="middle" fill="#9eaeb8" fontFamily="serif" fontSize={26} fontStyle="italic" letterSpacing={2}>
          A 16th-Century Scottish Tale
        </text>
      </svg>
    );
  },
};
