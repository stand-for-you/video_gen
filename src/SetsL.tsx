import React from 'react';
import { INK } from './Kit';
import { FullPerson, CAST } from './Cast';
import { sf } from './Beast';
import { Q, SAM, DAD, MOM, Alive, Face, LurkerCreature, BedroomBed, WallRitual } from './LurkerKit';

// Standard 1920x1080 Widescreen Sets for "I Know You're Awake"
// All components follow React.FC<{ f: number; v?: any }>

export const SETS: Record<string, React.FC<{ f: number; v?: any }>> = {
  // 1. First Creepiest Picture: The bedroom at 5:30 AM.
  // Sam frozen under sheets, propped parents facing him, creature creeping out from under bed.
  bedroom_awake: ({ f, v = {} }) => {
    return (
      <svg viewBox="0 0 1920 1080" style={{ width: '100%', height: '100%' }}>
        {/* Deep pre-dawn navy wall */}
        <rect width="1920" height="1080" fill={Q.dk} />
        <rect x="0" y="0" width="1920" height="740" fill={Q.wall} />
        {/* Floor */}
        <rect x="0" y="740" width="1920" height="340" fill={Q.carpet} />
        <line x1="0" y1="740" x2="1920" y2="740" stroke={INK} strokeWidth={8} />

        {/* Cold pre-dawn window */}
        <g transform="translate(180, 120)">
          <rect width="260" height="420" fill="#202a3a" stroke={INK} strokeWidth={9} />
          <line x1="130" y1="0" x2="130" y2="420" stroke={INK} strokeWidth={6} />
          <line x1="0" y1="210" x2="260" y2="210" stroke={INK} strokeWidth={6} />
          {/* Pale moonlight wash */}
          <polygon points="0,0 260,0 600,620 -100,620" fill={Q.paleGlow} opacity={0.06} />
        </g>

        {/* Wall ritual scrawl in the background */}
        <g transform="translate(1420, 320)">
          <WallRitual revealWords={v.revealWords} bloodPentagram={true} />
        </g>

        {/* Seated Mother in chair */}
        <g transform="translate(1120, 680)">
          <Alive x={0} y={0} f={f} mode="shake">
            {/* Chair silhouette */}
            <rect x="-60" y="-120" width="120" height="180" fill="#151922" stroke={INK} strokeWidth={6} />
            <FullPerson s={MOM} x={0} y={0} k={0.65} f={f} expr="fear" />
            {/* Dark tear streaks */}
            <path d="M-12,-190 L-10,-140" stroke="#050810" strokeWidth={5} />
            <path d="M12,-190 L14,-140" stroke="#050810" strokeWidth={5} />
          </Alive>
        </g>

        {/* Bed with Sam shivering and creature lurking under */}
        <g transform="translate(680, 720)">
          <BedroomBed f={f} samTerror={true} fatherPropped={v.father ?? true} creatureUnder={v.creatureUnder ?? true} />
        </g>

        {/* Digital alarm clock showing 05:30 */}
        <g transform="translate(160, 680)">
          <rect x="-50" y="-30" width="100" height="60" rx="6" fill="#10141a" stroke={INK} strokeWidth={5} />
          <text x="0" y="10" textAnchor="middle" fill="#d4261e" fontFamily="monospace" fontWeight="bold" fontSize="24">
            {v.time ?? "05:30"}
          </text>
        </g>
      </svg>
    );
  },

  // 2. Creature closeup / stalking
  creature_stalk: ({ f, v = {} }) => {
    return (
      <svg viewBox="0 0 1920 1080" style={{ width: '100%', height: '100%' }}>
        <rect width="1920" height="1080" fill="#040609" />
        <radialGradient id="stalkGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#253040" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#040609" stopOpacity="1" />
        </radialGradient>
        <rect width="1920" height="1080" fill="url(#stalkGlow)" />

        <g transform="translate(960, 580)">
          <LurkerCreature f={f} reach={v.reach} crawl={v.crawl} scale={1.8} />
        </g>
      </svg>
    );
  },

  // 3. Hallway outside the master bedroom: dark carpet streaks
  hallway_blood: ({ f, v = {} }) => {
    return (
      <svg viewBox="0 0 1920 1080" style={{ width: '100%', height: '100%' }}>
        <rect width="1920" height="1080" fill={Q.dk} />
        {/* Hallway perspective lines */}
        <polygon points="400,0 1520,0 1920,1080 0,1080" fill={Q.carpetDk} />
        <polygon points="0,0 400,0 0,1080" fill={Q.wallDk} />
        <polygon points="1520,0 1920,0 1920,1080" fill={Q.wallDk} />
        <line x1="400" y1="0" x2="0" y2="1080" stroke={INK} strokeWidth={8} />
        <line x1="1520" y1="0" x2="1920" y2="1080" stroke={INK} strokeWidth={8} />

        {/* Open master bedroom door at far end with darkness */}
        <rect x="760" y="220" width="400" height="600" fill="#020305" stroke={INK} strokeWidth={9} />

        {/* Heavy smeared trails coming down the carpet */}
        <path d="M860,650 Q920,800 680,1080" stroke={Q.redDark} strokeWidth={40} fill="none" opacity={0.8} />
        <path d="M1060,650 Q1000,820 1280,1080" stroke={Q.redDark} strokeWidth={35} fill="none" opacity={0.8} />
        <path d="M880,680 Q930,810 700,1080" stroke={Q.redAccent} strokeWidth={12} fill="none" opacity={0.6} />

        {/* Sam's bare feet hesitating in the foreground */}
        {v.feet && (
          <g transform="translate(960, 960)">
            <ellipse cx="-70" cy="0" rx="35" ry="60" fill={SAM.skin} stroke={INK} strokeWidth={6} />
            <ellipse cx="70" cy="0" rx="35" ry="60" fill={SAM.skin} stroke={INK} strokeWidth={6} />
          </g>
        )}
      </svg>
    );
  },

  // 4. Sam in terror (Face closeup)
  sam_terror: ({ f, v = {} }) => {
    return (
      <svg viewBox="0 0 1920 1080" style={{ width: '100%', height: '100%' }}>
        <rect width="1920" height="1080" fill={Q.dk} />
        {/* Soft cold moonlight diagonal */}
        <polygon points="300,0 900,0 1500,1080 900,1080" fill={Q.paleGlow} opacity={0.05} />

        {/* Blanket drawn up to the nose */}
        <g transform="translate(960, 480)">
          <Face who="sam" x={0} y={0} k={1.7} f={f} expr="fear" tears={true} />
          {/* Blanket edge covering lower face */}
          <path d="M-400,200 Q0,160 400,200 L400,600 L-400,600 Z" fill={Q.sheet} stroke={INK} strokeWidth={9} />
          <path d="M-300,220 Q0,185 300,220" stroke={Q.sheetDk} strokeWidth={10} fill="none" />
        </g>
      </svg>
    );
  },

  // 5. Creature dragging parents through the bedroom door
  creature_dragging: ({ f, v = {} }) => {
    return (
      <svg viewBox="0 0 1920 1080" style={{ width: '100%', height: '100%' }}>
        <rect width="1920" height="1080" fill={Q.wall} />
        <rect x="0" y="700" width="1920" height="380" fill={Q.carpet} />
        <line x1="0" y1="700" x2="1920" y2="700" stroke={INK} strokeWidth={8} />

        {/* Open Doorway with hallway darkness */}
        <g transform="translate(680, 160)">
          <rect width="560" height="740" fill="#04060a" stroke={INK} strokeWidth={10} />
          {/* Creature hunched in the threshold */}
          <g transform="translate(280, 360)">
            <LurkerCreature f={f} scale={1.2} />
          </g>
          {/* Limp parent bodies being dragged */}
          <g transform="translate(160, 520) rotate(80)">
            <FullPerson s={DAD} x={0} y={0} k={0.5} f={f} expr="neutral" />
          </g>
          <g transform="translate(400, 540) rotate(-75)">
            <FullPerson s={MOM} x={0} y={0} k={0.5} f={f} expr="neutral" />
          </g>
        </g>
      </svg>
    );
  },

  // 6. Propped Parents Horror View
  parents_propped: ({ f, v = {} }) => {
    return (
      <svg viewBox="0 0 1920 1080" style={{ width: '100%', height: '100%' }}>
        <rect width="1920" height="1080" fill={Q.dk} />
        <rect x="0" y="0" width="1920" height="720" fill={Q.wall} />
        <rect x="0" y="720" width="1920" height="360" fill={Q.carpet} />

        {/* Father propped against bed frame on left */}
        <g transform="translate(620, 480)">
          <Face who="dad" x={0} y={0} k={1.3} f={f} expr="fear" tears={true} />
        </g>

        {/* Mother seated on right */}
        <g transform="translate(1300, 480)">
          <Face who="mom" x={0} y={0} k={1.3} f={f} expr="fear" tears={true} />
        </g>
      </svg>
    );
  },

  // 7. Wall Masterpiece Reveal: "I KNOW YOU ARE AWAKE"
  wall_reveal: ({ f, v = {} }) => {
    return (
      <svg viewBox="0 0 1920 1080" style={{ width: '100%', height: '100%' }}>
        <rect width="1920" height="1080" fill={Q.wallDk} />
        <g transform="translate(960, 480)">
          <WallRitual revealWords={true} bloodPentagram={true} />
        </g>
      </svg>
    );
  },

  // 8. Bathroom / detours
  bathroom_dark: ({ f, v = {} }) => {
    return (
      <svg viewBox="0 0 1920 1080" style={{ width: '100%', height: '100%' }}>
        <rect width="1920" height="1080" fill="#0b0f16" />
        {/* Bathroom tiles */}
        <rect x="200" y="100" width="1520" height="880" fill="#141a24" stroke={INK} strokeWidth={8} />
        {/* Mirror above sink */}
        <rect x="760" y="200" width="400" height="480" fill="#222c3c" stroke={INK} strokeWidth={8} />
        {/* Dim shadowy reflection */}
        <ellipse cx="960" cy="420" rx="90" ry="120" fill="#121822" />
        {/* Faucet & Sink */}
        <rect x="720" y="680" width="480" height="120" fill="#7a8898" stroke={INK} strokeWidth={7} />
      </svg>
    );
  },

  // 9. Still Card / Credit Beat
  qcard: ({ f, v = {} }) => {
    return (
      <svg viewBox="0 0 1920 1080" style={{ width: '100%', height: '100%' }}>
        <rect width="1920" height="1080" fill={Q.dk} />
        <g transform="translate(960, 540)">
          <rect x="-600" y="-240" width="1200" height="480" rx="10" fill="#181e28" stroke={INK} strokeWidth={8} />
          <text x="0" y="-80" textAnchor="middle" fill="#f0ebe1" fontFamily="Lora" fontWeight="bold" fontSize="42">
            I KNOW YOU'RE AWAKE
          </text>
          <text x="0" y="20" textAnchor="middle" fill="#c43026" fontFamily="Lora" fontStyle="italic" fontSize="30">
            A Scroll Kaos Presentation
          </text>
          <text x="0" y="110" textAnchor="middle" fill="#8e9aa8" fontFamily="Lora" fontSize="24">
            Inspired by the classic creepypasta
          </text>
        </g>
      </svg>
    );
  },

  // 10. End Screen (20s): channel name, small Sam hero, faint creature, closing question
  end: ({ f, v = {} }) => {
    return (
      <svg viewBox="0 0 1920 1080" style={{ width: '100%', height: '100%' }}>
        <rect width="1920" height="1080" fill="#06090e" />

        {/* Faint creature lurking in background shadow */}
        <g transform="translate(960, 380)" opacity={0.35}>
          <LurkerCreature f={f} crawl scale={1.2} />
        </g>

        {/* Channel branding top left */}
        <text x="120" y="140" fill="#f0ebe1" fontFamily="Lora" fontWeight="bold" fontSize="48" letterSpacing="3">
          SCROLL KAOS
        </text>
        <line x1="120" y1="165" x2="480" y2="165" stroke="#b81c16" strokeWidth={5} />

        {/* The Closing Question on-screen text */}
        <text x="960" y="280" textAnchor="middle" fill="#b81c16" fontFamily="Lora" fontStyle="italic" fontWeight="bold" fontSize="42">
          "Would you have looked under the bed?"
        </text>

        {/* Small hero idle in bottom-left zone */}
        <g transform="translate(300, 860)">
          <Alive x={0} y={0} f={f} mode="shake">
            <FullPerson s={SAM} x={0} y={0} k={0.55} f={f} expr="fear" />
          </Alive>
        </g>

        {/* Reserved YouTube End Screen element zones (Right: 2 videos, Bottom center: Subscribe) */}
        {/* Video placeholder 1 */}
        <rect x="1260" y="180" width="540" height="304" rx="8" fill="none" stroke="#253040" strokeWidth={3} strokeDasharray="10 8" opacity={0.5} />
        {/* Video placeholder 2 */}
        <rect x="1260" y="520" width="540" height="304" rx="8" fill="none" stroke="#253040" strokeWidth={3} strokeDasharray="10 8" opacity={0.5} />
        {/* Subscribe button placeholder */}
        <circle cx="860" cy="740" r="75" fill="none" stroke="#253040" strokeWidth={3} strokeDasharray="8 6" opacity={0.5} />
      </svg>
    );
  },
};
