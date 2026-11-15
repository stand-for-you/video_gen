import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { YamishibaiLayer, VintageRadio, JanitorLetter, CURRENT_KIT } from './Kit';
import { CAST } from './Cast';
import { FaceNoah, FaceElias, FaceOlivia, FaceStanislavGhost, FaceWoman } from './Faces';
import { FullMan, GhostFigure, TinyHeroBack } from './Body';

// 16:9 Long Video Scene Component
export const LongVideo16x9: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig(); // 1920x1080

  // Total frames: 1844 frames at 10 fps (184.4 seconds)
  // We divide into 65 shots, each roughly 28 frames (~2.8s)
  const shotIndex = Math.min(64, Math.floor(frame / 28.3));
  const shotProgress = (frame % 28.3) / 28.3;
  // Stepped motion (3 frames step)
  const stepFrame = frame - (frame % 3);

  // Background environments
  const renderBackground = () => {
    // 0-11: Teacher Study
    if (shotIndex <= 11) {
      return (
        <svg width={width} height={height} viewBox="0 0 1920 1080" style={{ position: 'absolute' }}>
          {/* Wall */}
          <rect width={1920} height={1080} fill="#141210" />
          <line x1="0" y1="750" x2="1920" y2="750" stroke="#0a0807" strokeWidth="8" />
          {/* Wood Floor */}
          <rect y="750" width={1920} height={330} fill="#1c1611" />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <line key={i} x1={i * 300} y1="750" x2={i * 300 - 150} y2="1080" stroke="#100c09" strokeWidth="4" />
          ))}
          {/* Bookshelf */}
          <rect x="150" y="100" width="400" height="650" fill="#241c16" stroke="#0e0a07" strokeWidth="8" />
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1="150" y1={250 + i * 130} x2="550" y2={250 + i * 130} stroke="#120c08" strokeWidth="12" />
          ))}
          {/* Desk */}
          <polygon points="650,680 1650,680 1850,1080 450,1080" fill="#2c221a" stroke="#0e0a08" strokeWidth="8" />
          {/* Desk Lamp glow */}
          <ellipse cx="1450" cy="550" rx="350" ry="250" fill="#ffecb3" opacity="0.12" filter="blur(30px)" />
          {/* Wine glass with dark red wine */}
          <path d="M1250 670 L1240 730 Q1260 760 1280 730 L1270 670 Z" fill="#801015" stroke="#120d0b" strokeWidth="4" />
          <line x1="1260" y1="760" x2="1260" y2="800" stroke="#120d0b" strokeWidth="5" />
          <ellipse cx="1260" cy="800" rx="20" ry="6" fill="#120d0b" />
          {/* Stack of student folders */}
          <rect x="750" y="740" width="160" height="90" fill="#ded2bc" stroke="#16120e" strokeWidth="5" transform="rotate(-5 750 740)" />
          <rect x="760" y="730" width="160" height="90" fill="#c8bca8" stroke="#16120e" strokeWidth="5" transform="rotate(3 760 730)" />
          {/* Unmarked DVD Discs */}
          {shotIndex >= 4 && (
            <g transform="translate(1000, 760)">
              <circle cx="50" cy="50" r="45" fill="#9ab0bd" stroke="#14181b" strokeWidth="5" />
              <circle cx="50" cy="50" r="14" fill="#2c221a" stroke="#14181b" strokeWidth="4" />
              <circle cx="110" cy="65" r="45" fill="#869da8" stroke="#14181b" strokeWidth="5" />
              <circle cx="110" cy="65" r="14" fill="#2c221a" stroke="#14181b" strokeWidth="4" />
            </g>
          )}
        </svg>
      );
    }
    
    // 12-23: Hoarder Apartment (Stephen & Olivia Interview)
    if (shotIndex <= 23) {
      return (
        <svg width={width} height={height} viewBox="0 0 1920 1080" style={{ position: 'absolute' }}>
          {/* Grimy living room wallpaper */}
          <rect width={1920} height={1080} fill="#1c1b18" />
          {/* Vertical stains */}
          {[100, 350, 700, 1100, 1450, 1750].map((x, i) => (
            <line key={i} x1={x} y1="0" x2={x} y2="1080" stroke="#11100e" strokeWidth="24" opacity="0.4" />
          ))}
          {/* Baseboard */}
          <rect y="720" width={1920} height="360" fill="#131210" stroke="#080706" strokeWidth="8" />
          {/* Stacks of clutter & hoarder boxes */}
          <rect x="80" y="480" width="280" height="320" fill="#2e2b26" stroke="#0d0c0a" strokeWidth="7" />
          <rect x="60" y="320" width="260" height="180" fill="#38342e" stroke="#0d0c0a" strokeWidth="7" />
          <rect x="1550" y="420" width="300" height="400" fill="#2b2824" stroke="#0d0c0a" strokeWidth="7" />
          {/* Coffee Table littered with papers in plastic sleeves */}
          <rect x="620" y="740" width="680" height="240" fill="#24201c" stroke="#0c0a09" strokeWidth="8" />
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={660 + i * 110} y={760 + (i % 2) * 20} width="110" height="140" fill="#d2c6b2" stroke="#120f0d" strokeWidth="4" transform={`rotate(${(i - 2) * 7} ${660 + i * 110} 760)`} />
          ))}
          {/* Overflowing ashtray */}
          <ellipse cx="960" cy="840" rx="35" ry="18" fill="#111" stroke="#000" strokeWidth="4" />
          <circle cx="955" cy="838" r="4" fill="#c4281b" />
        </svg>
      );
    }

    // 24-42: Balkans Destroyed Concrete Schoolhouse
    if (shotIndex <= 42) {
      return (
        <svg width={width} height={height} viewBox="0 0 1920 1080" style={{ position: 'absolute' }}>
          {/* Gloomy stormy sky through blown-out roof */}
          <rect width={1920} height={1080} fill="#14181c" />
          {/* Jagged broken concrete ceiling and steel rebar */}
          <polygon points="0,0 800,0 650,220 400,180 200,280 0,220" fill="#25292e" stroke="#0e1114" strokeWidth="8" />
          <polygon points="1200,0 1920,0 1920,320 1650,240 1450,280 1350,180" fill="#202327" stroke="#0e1114" strokeWidth="8" />
          {/* Exposed twisted steel rebar */}
          <path d="M400 180 Q450 260 420 340 M650 220 Q700 310 680 400 M1450 280 Q1420 380 1460 450" stroke="#4a2216" strokeWidth="6" fill="none" />
          {/* Rain streaks pouring down */}
          {[...Array(20)].map((_, i) => (
            <line
              key={i}
              x1={(i * 105 + stepFrame * 12) % 1920}
              y1={(stepFrame * 28 + i * 45) % 1080}
              x2={(i * 105 + stepFrame * 12 - 25) % 1920}
              y2={(stepFrame * 28 + i * 45 + 90) % 1080}
              stroke="#586670"
              strokeWidth="2.5"
              opacity="0.45"
            />
          ))}
          {/* Fractured pillars and broken casement windows */}
          <rect x="220" y="250" width="140" height="650" fill="#2c3035" stroke="#101316" strokeWidth="8" />
          <rect x="1560" y="250" width="140" height="650" fill="#272a2f" stroke="#101316" strokeWidth="8" />
          {/* Overturned school desks & rubble */}
          <polygon points="450,820 620,740 720,860 520,940" fill="#3a2f26" stroke="#120e0a" strokeWidth="7" />
          <polygon points="1150,800 1350,750 1420,880 1220,930" fill="#322921" stroke="#120e0a" strokeWidth="7" />
          {/* Concrete Floor with water puddles reflecting dark sky */}
          <rect y="840" width={1920} height="240" fill="#1b1e22" stroke="#0c0e10" strokeWidth="8" />
          <ellipse cx="960" cy="950" rx="380" ry="65" fill="#242b32" stroke="#0d1114" strokeWidth="4" />
        </svg>
      );
    }

    // 43-64: The Flooded Basement & Haunting Revelation
    return (
      <svg width={width} height={height} viewBox="0 0 1920 1080" style={{ position: 'absolute' }}>
        {/* Oppressive subterranean stone corridor */}
        <rect width={1920} height={1080} fill="#0a0c0e" />
        {/* Heavy stone archway */}
        <path d="M250 1080 L250 450 Q960 150 1670 450 L1670 1080 Z" fill="#14181c" stroke="#06080a" strokeWidth="12" />
        <path d="M450 1080 L450 560 Q960 320 1470 560 L1470 1080 Z" fill="#0d1012" stroke="#06080a" strokeWidth="10" />
        {/* Basement Door with wooden chair wedged beneath */}
        <rect x="820" y="440" width="280" height="520" fill="#221b16" stroke="#080605" strokeWidth="8" />
        <circle cx="850" cy="700" r="9" fill="#8f7a55" stroke="#080605" strokeWidth="4" />
        {/* The Chair wedged under the handle */}
        <polygon points="860,695 910,720 900,890 840,860" fill="#3d2c1f" stroke="#0f0b07" strokeWidth="6" />
        {/* Murky flooded floor */}
        <rect y="920" width={1920} height="160" fill="#080c10" stroke="#030406" strokeWidth="8" />
        {/* Stagnant water ripples */}
        <ellipse cx="960" cy="980" rx="550" ry="40" fill="#101820" opacity="0.6" />
      </svg>
    );
  };

  // Render Foreground characters & action per shot
  const renderSubject = () => {
    // Shot 0-3: Noah Reed grading papers
    if (shotIndex <= 3) {
      return (
        <div style={{ position: 'absolute', left: 880, top: 320, transform: `scale(${1 + shotProgress * 0.05})` }}>
          <FullMan pose="sitting" headComponent={<FaceNoah expression={shotIndex >= 2 ? 'dread' : 'neutral'} size={210} />} />
        </div>
      );
    }

    // Shot 4-7: Olivia handing discs / close-up of interview tape
    if (shotIndex <= 7) {
      return (
        <div style={{ position: 'absolute', left: 740, top: 300, transform: `scale(${1.1 - shotProgress * 0.04})` }}>
          <div style={{ display: 'flex', gap: 140, alignItems: 'center' }}>
            <div style={{ transform: 'scale(1.2)' }}>
              {CAST.lily.bodyBuilder('sitting', <FaceOlivia size={190} expression="neutral" />)}
            </div>
            <div style={{ transform: 'scale(0.95)' }}>
              <FullMan pose="sitting" headComponent={<FaceNoah expression="neutral" size={200} />} />
            </div>
          </div>
        </div>
      );
    }

    // Shot 8-11: Screen flicker / DVD loading
    if (shotIndex <= 11) {
      return (
        <div style={{ position: 'absolute', left: 600, top: 220, textAlign: 'center' }}>
          <div style={{ width: 720, height: 480, background: '#07090b', border: '16px solid #1a1e22', borderRadius: 8, padding: 30, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <h2 style={{ color: '#dce6ec', fontSize: 44, letterSpacing: 4, margin: '0 0 20px 0' }}>PLAYING DISC 1: INTERVIEW</h2>
            <div style={{ width: 140, height: 6, background: '#a81c1c' }} />
            <p style={{ color: '#687882', fontSize: 24, marginTop: 30 }}>INPUT: CAMCORDER TAPE (BALKANS 1993)</p>
          </div>
        </div>
      );
    }

    // Shot 12-16: Uncle Stephen smoking
    if (shotIndex <= 16) {
      return (
        <div style={{ position: 'absolute', left: 780, top: 310 }}>
          <div style={{ transform: `scale(${1.2 + shotProgress * 0.08})` }}>
            <FullMan pose="sitting" headComponent={<FaceElias size={210} hasCigarette={true} />} coatColor="#423e37" />
          </div>
        </div>
      );
    }

    // Shot 17-23: Stephen & Olivia interview discussion
    if (shotIndex <= 23) {
      return (
        <div style={{ position: 'absolute', left: 450, top: 320, display: 'flex', gap: 260, alignItems: 'center' }}>
          <div style={{ transform: 'scale(1.15)' }}>
            {CAST.lily.bodyBuilder('sitting', <FaceOlivia size={185} expression="scared" />)}
          </div>
          <div style={{ transform: 'scale(1.2)' }}>
            <FullMan pose="sitting" headComponent={<FaceElias size={210} hasCigarette={true} />} coatColor="#423e37" />
          </div>
        </div>
      );
    }

    // Shot 24-28: Ruined schoolhouse exterior / flooded hallway
    if (shotIndex <= 28) {
      return (
        <div style={{ position: 'absolute', left: 820, bottom: 80, transform: `scale(${0.9 + shotProgress * 0.05})` }}>
          <TinyHeroBack width={180} height={310} />
        </div>
      );
    }

    // Shot 29-33: Finding the Transistor Radio & The Janitor's Letter
    if (shotIndex <= 33) {
      return (
        <div style={{ position: 'absolute', left: 650, top: 340, display: 'flex', gap: 140, alignItems: 'center' }}>
          <div style={{ transform: 'scale(1.8)' }}>
            <VintageRadio size={210} isGlowing={true} />
          </div>
          <div style={{ transform: 'scale(1.5)' }}>
            <JanitorLetter size={180} />
          </div>
        </div>
      );
    }

    // Shot 34-40: Stanislav's haunting routine (sweeping in the dark among shadows)
    if (shotIndex <= 40) {
      return (
        <div style={{ position: 'absolute', left: 780, top: 250, transform: `scale(${1.15 + shotProgress * 0.04})` }}>
          <GhostFigure type="stanislav" headComponent={<FaceStanislavGhost size={210} mouthOpen={shotIndex >= 38} />} />
        </div>
      );
    }

    // Shot 41-48: Olivia crying on Disc 2 & The revelation of the date
    if (shotIndex <= 48) {
      return (
        <div style={{ position: 'absolute', left: 620, top: 260, display: 'flex', gap: 180, alignItems: 'center' }}>
          <div style={{ transform: 'scale(1.3)' }}>
            {CAST.lily.bodyBuilder('sitting', <FaceOlivia size={190} expression="crying" />)}
          </div>
          <div style={{ transform: 'scale(1.25)' }}>
            <FullMan pose="sitting" headComponent={<FaceNoah expression="shock" size={210} />} />
          </div>
        </div>
      );
    }

    // Shot 49-57: The Basement Door & The Ghostly Reveal
    if (shotIndex <= 57) {
      return (
        <div style={{ position: 'absolute', left: 740, top: 160, transform: `scale(${1.3 + shotProgress * 0.1})` }}>
          <GhostFigure type="stanislav" headComponent={<FaceStanislavGhost size={240} mouthOpen={true} />} />
        </div>
      );
    }

    // Shot 58-64: The radio in the stagnant water softly humming / Climactic finish
    return (
      <div style={{ position: 'absolute', left: 680, top: 360, textAlign: 'center' }}>
        <div style={{ transform: `scale(${2.2 + shotProgress * 0.08})` }}>
          <VintageRadio size={230} isGlowing={true} />
        </div>
      </div>
    );
  };

  return (
    <YamishibaiLayer width={width} height={height} frame={frame}>
      {renderBackground()}
      {renderSubject()}
    </YamishibaiLayer>
  );
};
