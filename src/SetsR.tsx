import React from 'react';
import { INK } from './Kit';
import { FullPerson } from './Cast';
import { Q, SAM, DAD, MOM, Alive, Face, LurkerCreature, BedroomBed, WallRitual } from './LurkerKit';

// Standard 1080x1920 Vertical Sets for "I Know You're Awake" (Reel / Shorts)
// Built natively at 1080x1920 without importing SetsL.tsx.
// Safe Margins: Faces and key props kept between y 180 and y 1420 (captions occupy ~y 1450-1850).

export const SETS: Record<string, React.FC<{ f: number; v?: any }>> = {
  // 1. First Creepiest Picture: Vertical bedroom scene
  bedroom_awake: ({ f, v = {} }) => {
    return (
      <svg viewBox="0 0 1080 1920" style={{ width: '100%', height: '100%' }}>
        <rect width="1080" height="1920" fill={Q.dk} />
        <rect x="0" y="0" width="1080" height="1350" fill={Q.wall} />
        <rect x="0" y="1350" width="1080" height="570" fill={Q.carpet} />
        <line x1="0" y1="1350" x2="1080" y2="1350" stroke={INK} strokeWidth={8} />

        {/* Cold Window top left */}
        <g transform="translate(80, 160)">
          <rect width="220" height="340" fill="#1b2330" stroke={INK} strokeWidth={8} />
          <line x1="110" y1="0" x2="110" y2="340" stroke={INK} strokeWidth={5} />
          <line x1="0" y1="170" x2="220" y2="170" stroke={INK} strokeWidth={5} />
        </g>

        {/* Wall ritual scrawl centered high */}
        <g transform="translate(680, 420)">
          <WallRitual revealWords={v.revealWords} bloodPentagram={true} />
        </g>

        {/* Seated mother in chair */}
        <g transform="translate(840, 920)">
          <Alive x={0} y={0} f={f} mode="shake">
            <FullPerson s={MOM} x={0} y={0} k={0.65} f={f} expr="fear" />
          </Alive>
        </g>

        {/* Bedroom Bed with Sam under sheets and Father propped */}
        <g transform="translate(460, 1180)">
          <BedroomBed f={f} samTerror={true} fatherPropped={v.father ?? true} creatureUnder={v.creatureUnder ?? true} />
        </g>

        {/* Alarm Clock */}
        <g transform="translate(140, 1100)">
          <rect x="-45" y="-25" width="90" height="50" rx="6" fill="#10141a" stroke={INK} strokeWidth={4} />
          <text x="0" y="10" textAnchor="middle" fill="#d4261e" fontFamily="monospace" fontWeight="bold" fontSize="20">
            {v.time ?? "05:30"}
          </text>
        </g>
      </svg>
    );
  },

  // 2. Creature stalk vertical
  creature_stalk: ({ f, v = {} }) => {
    return (
      <svg viewBox="0 0 1080 1920" style={{ width: '1080px', height: '1920px' }}>
        <rect width="1080" height="1920" fill="#040609" />
        <g transform="translate(540, 850)">
          <LurkerCreature f={f} reach={v.reach} crawl={v.crawl} scale={1.7} />
        </g>
      </svg>
    );
  },

  // 3. Hallway vertical
  hallway_blood: ({ f, v = {} }) => {
    return (
      <svg viewBox="0 0 1080 1920" style={{ width: '100%', height: '100%' }}>
        <rect width="1080" height="1920" fill={Q.dk} />
        <polygon points="200,100 880,100 1080,1920 0,1920" fill={Q.carpetDk} />
        <line x1="200" y1="100" x2="0" y2="1920" stroke={INK} strokeWidth={8} />
        <line x1="880" y1="100" x2="1080" y2="1920" stroke={INK} strokeWidth={8} />

        {/* Master bedroom door */}
        <rect x="390" y="300" width="300" height="550" fill="#030407" stroke={INK} strokeWidth={9} />

        {/* Blood trail */}
        <path d="M480,750 Q540,1100 320,1800" stroke={Q.redDark} strokeWidth={35} fill="none" opacity={0.85} />
        <path d="M600,750 Q560,1120 780,1800" stroke={Q.redDark} strokeWidth={30} fill="none" opacity={0.85} />
      </svg>
    );
  },

  // 4. Sam terror vertical
  sam_terror: ({ f, v = {} }) => {
    return (
      <svg viewBox="0 0 1080 1920" style={{ width: '100%', height: '100%' }}>
        <rect width="1080" height="1920" fill={Q.dk} />
        <g transform="translate(540, 750)">
          <Face who="sam" x={0} y={0} k={1.8} f={f} expr="fear" tears={true} />
          {/* Blanket drawn up over nose */}
          <path d="M-400,200 Q0,160 400,200 L400,600 L-400,600 Z" fill={Q.sheet} stroke={INK} strokeWidth={9} />
          <path d="M-300,220 Q0,185 300,220" stroke={Q.sheetDk} strokeWidth={10} fill="none" />
        </g>
      </svg>
    );
  },

  // 5. Creature dragging parents vertical
  creature_dragging: ({ f, v = {} }) => {
    return (
      <svg viewBox="0 0 1080 1920" style={{ width: '100%', height: '100%' }}>
        <rect width="1080" height="1920" fill={Q.wall} />
        <rect x="0" y="1150" width="1080" height="770" fill={Q.carpet} />
        <line x1="0" y1="1150" x2="1080" y2="1150" stroke={INK} strokeWidth={8} />

        {/* Doorway */}
        <g transform="translate(320, 360)">
          <rect width="440" height="800" fill="#04060a" stroke={INK} strokeWidth={10} />
          <g transform="translate(220, 380)">
            <LurkerCreature f={f} scale={1.2} />
          </g>
          {/* Limp bodies dragged */}
          <g transform="translate(100, 520) rotate(80)">
            <FullPerson s={DAD} x={0} y={0} k={0.5} f={f} expr="neutral" />
          </g>
          <g transform="translate(320, 540) rotate(-75)">
            <FullPerson s={MOM} x={0} y={0} k={0.5} f={f} expr="neutral" />
          </g>
        </g>
      </svg>
    );
  },

  // 6. Propped parents vertical
  parents_propped: ({ f, v = {} }) => {
    return (
      <svg viewBox="0 0 1080 1920" style={{ width: '100%', height: '100%' }}>
        <rect width="1080" height="1920" fill={Q.dk} />
        <rect x="0" y="0" width="1080" height="1200" fill={Q.wall} />
        <rect x="0" y="1200" width="1080" height="720" fill={Q.carpet} />

        {/* Father propped upper */}
        <g transform="translate(360, 680)">
          <Face who="dad" x={0} y={0} k={1.25} f={f} expr="fear" tears={true} />
        </g>
        {/* Mother seated lower */}
        <g transform="translate(740, 940)">
          <Face who="mom" x={0} y={0} k={1.25} f={f} expr="fear" tears={true} />
        </g>
      </svg>
    );
  },

  // 7. Wall reveal vertical
  wall_reveal: ({ f, v = {} }) => {
    return (
      <svg viewBox="0 0 1080 1920" style={{ width: '100%', height: '100%' }}>
        <rect width="1080" height="1920" fill={Q.wallDk} />
        <g transform="translate(540, 750)">
          <WallRitual revealWords={true} bloodPentagram={true} />
        </g>
      </svg>
    );
  },

  // 8. Bathroom vertical
  bathroom_dark: ({ f, v = {} }) => {
    return (
      <svg viewBox="0 0 1080 1920" style={{ width: '100%', height: '100%' }}>
        <rect width="1080" height="1920" fill="#0b0f16" />
        <rect x="100" y="240" width="880" height="1350" fill="#141a24" stroke={INK} strokeWidth={8} />
        <rect x="340" y="420" width="400" height="520" fill="#222c3c" stroke={INK} strokeWidth={8} />
        <ellipse cx="540" cy="680" rx="90" ry="120" fill="#121822" />
        <rect x="300" y="980" width="480" height="140" fill="#7a8898" stroke={INK} strokeWidth={7} />
      </svg>
    );
  },

  // 9. Credit beat vertical
  qcard: ({ f, v = {} }) => {
    return (
      <svg viewBox="0 0 1080 1920" style={{ width: '100%', height: '100%' }}>
        <rect width="1080" height="1920" fill={Q.dk} />
        <g transform="translate(540, 800)">
          <rect x="-450" y="-260" width="900" height="520" rx="10" fill="#181e28" stroke={INK} strokeWidth={8} />
          <text x="0" y="-80" textAnchor="middle" fill="#f0ebe1" fontFamily="Lora" fontWeight="bold" fontSize="38">
            I KNOW YOU'RE AWAKE
          </text>
          <text x="0" y="20" textAnchor="middle" fill="#c43026" fontFamily="Lora" fontStyle="italic" fontSize="28">
            Scroll Kaos
          </text>
          <text x="0" y="100" textAnchor="middle" fill="#8e9aa8" fontFamily="Lora" fontSize="22">
            Inspired by creepypasta archives
          </text>
        </g>
      </svg>
    );
  },

  // 10. End screen vertical
  end: ({ f, v = {} }) => {
    return (
      <svg viewBox="0 0 1080 1920" style={{ width: '100%', height: '100%' }}>
        <rect width="1080" height="1920" fill="#06090e" />
        <g transform="translate(540, 680)" opacity={0.4}>
          <LurkerCreature f={f} crawl scale={1.1} />
        </g>
        <text x="540" y="320" textAnchor="middle" fill="#f0ebe1" fontFamily="Lora" fontWeight="bold" fontSize="44" letterSpacing="3">
          SCROLL KAOS
        </text>
        <line x1="340" y1="350" x2="740" y2="350" stroke="#b81c16" strokeWidth={5} />
        <text x="540" y="480" textAnchor="middle" fill="#b81c16" fontFamily="Lora" fontStyle="italic" fontWeight="bold" fontSize="32">
          "Would you have looked under the bed?"
        </text>
        <g transform="translate(540, 1150)">
          <Alive x={0} y={0} f={f} mode="shake">
            <FullPerson s={SAM} x={0} y={0} k={0.7} f={f} expr="fear" />
          </Alive>
        </g>
      </svg>
    );
  },
};
