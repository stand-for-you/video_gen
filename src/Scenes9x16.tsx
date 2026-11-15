import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { YamishibaiLayer, VintageRadio, JanitorLetter } from './Kit';
import { CAST } from './Cast';
import { FaceNoah, FaceElias, FaceOlivia, FaceStanislavGhost, FaceWoman } from './Faces';
import { FullMan, GhostFigure, TinyHeroBack } from './Body';

// Reel timed cues loaded directly
const REEL_CUES = [
  {"index": 1, "start_time": 0.0, "end_time": 7.936, "en": "Every spring, I make my middle school history students record an interview with an older relative."},
  {"index": 2, "start_time": 8.236, "end_time": 13.91, "en": "I expected nothing different from Olivia, a quiet girl who sat in the back row."},
  {"index": 3, "start_time": 14.21, "end_time": 17.58, "en": "She handed me two unmarked discs."},
  {"index": 4, "start_time": 17.88, "end_time": 23.36, "en": "Late that night in my study, I put the first disc into the player."},
  {"index": 5, "start_time": 23.66, "end_time": 30.68, "en": "On screen, Olivia sat inside a cluttered living room across from her Great Uncle Stephen."},
  {"index": 6, "start_time": 30.98, "end_time": 36.96, "en": "The old veteran smoked in silence, clutching a stack of yellowed papers."},
  {"index": 7, "start_time": 37.26, "end_time": 44.55, "en": "When Olivia asked about his worst memory from the army, Stephen set his cigarette down."},
  {"index": 8, "start_time": 44.85, "end_time": 49.96, "en": "He had been deployed to the Balkans after a brutal conflict."},
  {"index": 9, "start_time": 50.26, "end_time": 57.65, "en": "His unit was sent to clear an old elementary school that had been obliterated years before."},
  {"index": 10, "start_time": 57.95, "end_time": 66.86, "en": "The roof had collapsed, rain poured through cracked concrete, and no child had stepped inside for seasons."},
  {"index": 11, "start_time": 67.16, "end_time": 75.33, "en": "In the flooded basement, Stephen discovered a handwritten letter left beside a heavy transistor radio."},
  {"index": 12, "start_time": 75.63, "end_time": 80.35, "en": "It was written by Stanislav, the school's former janitor."},
  {"index": 13, "start_time": 80.65, "end_time": 89.96, "en": "Stanislav wrote that after an illness took his wife and child, his radio was the only sound that kept him alive."},
  {"index": 14, "start_time": 90.26, "end_time": 93.39, "en": "Grief had shattered his mind."},
  {"index": 15, "start_time": 93.69, "end_time": 100.12, "en": "He returned to the destroyed schoolhouse every morning with his mop and broom."},
  {"index": 16, "start_time": 100.42, "end_time": 108.68, "en": "He wrote that the teachers smiled at him in the halls, and the children enjoyed the low music from his radio."},
  {"index": 17, "start_time": 108.98, "end_time": 117.84, "en": "He swept around broken desks, carefully polishing the rubble and moving aside whatever lay in the shadows."},
  {"index": 18, "start_time": 118.14, "end_time": 122.18, "en": "Until one morning, the radio went dead."},
  {"index": 19, "start_time": 122.48, "end_time": 132.06, "en": "Unable to bear the suffocating silence, Stanislav wedged a chair beneath the basement door and took his own life."},
  {"index": 20, "start_time": 132.36, "end_time": 137.66, "en": "His note had one dying plea: Please fix my radio."},
  {"index": 21, "start_time": 137.96, "end_time": 144.38, "en": "On the second disc, Olivia asked her uncle the question that still haunts me."},
  {"index": 22, "start_time": 144.68, "end_time": 150.37, "en": "How could the janitor die in an empty school destroyed years earlier?"},
  {"index": 23, "start_time": 150.67, "end_time": 154.55, "en": "Stephen answered with a trembling voice."},
  {"index": 24, "start_time": 154.85, "end_time": 159.98, "en": "The letter was dated only two weeks before their arrival."},
  {"index": 25, "start_time": 160.28, "end_time": 170.21, "en": "Stanislav had spent two years sweeping a tomb, smiling at figures frozen in the dark, thinking the silence was alive."},
  {"index": 26, "start_time": 170.51, "end_time": 177.59, "en": "And when Stephen finally forced the basement door open, the janitor was gone. Sitting in the stagnant water was the radio, softly humming."}
];

// Helper to format captions to roughly 22 chars per line
function wrapText(text: string, maxChars = 22): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let cur = '';

  for (const w of words) {
    if (!cur) {
      cur = w;
    } else if ((cur + ' ' + w).length <= maxChars) {
      cur += ' ' + w;
    } else {
      lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

export const ReelVideo9x16: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig(); // 1080x1920
  const currentTimeSec = frame / 10;

  // Shot division across 1776 frames (roughly 60 vertical shots, ~29 frames each)
  const shotIndex = Math.min(59, Math.floor(frame / 29.6));
  const shotProgress = (frame % 29.6) / 29.6;
  const stepFrame = frame - (frame % 3);

  // Find active caption
  const activeCue = REEL_CUES.find(
    (c) => currentTimeSec >= c.start_time && currentTimeSec <= c.end_time
  );

  // Render Vertical Native Backgrounds
  const renderVerticalBackground = () => {
    // 0-11: Teacher study at night (tall vertical room)
    if (shotIndex <= 11) {
      return (
        <svg width={width} height={height} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
          {/* Wall */}
          <rect width={1080} height={1920} fill="#141210" />
          {/* Tall book shelves on left and right */}
          <rect x="40" y="150" width="240" height="1200" fill="#241c16" stroke="#0e0a07" strokeWidth="8" />
          <rect x="800" y="150" width="240" height="1200" fill="#1c1611" stroke="#0e0a07" strokeWidth="8" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <line key={i} x1="40" y1={250 + i * 180} x2="280" y2={250 + i * 180} stroke="#100c09" strokeWidth="10" />
          ))}
          {/* Large Study Desk */}
          <polygon points="120,1180 960,1180 1080,1920 0,1920" fill="#2a2018" stroke="#0c0907" strokeWidth="10" />
          {/* Lamp glow from above */}
          <ellipse cx="540" cy="850" rx="420" ry="420" fill="#ffecb3" opacity="0.14" filter="blur(40px)" />
          {/* Stack of discs */}
          <circle cx="360" cy="1320" r="65" fill="#8ca0ac" stroke="#121619" strokeWidth="6" />
          <circle cx="360" cy="1320" r="18" fill="#2a2018" stroke="#121619" strokeWidth="5" />
          <circle cx="440" cy="1360" r="65" fill="#788b96" stroke="#121619" strokeWidth="6" />
          <circle cx="440" cy="1360" r="18" fill="#2a2018" stroke="#121619" strokeWidth="5" />
        </svg>
      );
    }

    // 12-23: Stephen & Olivia Living Room (vertical composition)
    if (shotIndex <= 23) {
      return (
        <svg width={width} height={height} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
          {/* High gloomy ceiling */}
          <rect width={1080} height={1920} fill="#1a1815" />
          {/* Grimy vertical stains */}
          {[120, 360, 600, 840, 1000].map((x, i) => (
            <line key={i} x1={x} y1="0" x2={x} y2="1920" stroke="#0f0e0c" strokeWidth="32" opacity="0.35" />
          ))}
          {/* Tall hoarder stacks on both sides */}
          <rect x="40" y="600" width="220" height="850" fill="#2c2822" stroke="#0c0b09" strokeWidth="8" />
          <rect x="820" y="550" width="220" height="900" fill="#27241f" stroke="#0c0b09" strokeWidth="8" />
          {/* Coffee Table */}
          <rect x="180" y="1280" width="720" height="340" fill="#211d19" stroke="#0b0908" strokeWidth="9" />
          {/* Ashtray with lit cigarette smoke rising vertically */}
          <ellipse cx="540" cy="1380" rx="45" ry="22" fill="#111" stroke="#000" strokeWidth="5" />
          <circle cx="535" cy="1378" r="5" fill="#c4281b" />
          <path d="M535 1370 Q510 1200 560 1000 T530 800" stroke="#ded8cd" strokeWidth="6" opacity="0.65" fill="none" />
        </svg>
      );
    }

    // 24-42: Balkans Obliterated Schoolhouse (Vertical perspective)
    if (shotIndex <= 42) {
      return (
        <svg width={width} height={height} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
          {/* Bleak sky above */}
          <rect width={1080} height={1920} fill="#14181c" />
          {/* Massive concrete ruins soaring upwards */}
          <polygon points="0,0 480,0 360,420 180,380 0,550" fill="#25292e" stroke="#0e1114" strokeWidth="9" />
          <polygon points="620,0 1080,0 1080,580 880,440 760,480" fill="#1f2226" stroke="#0e1114" strokeWidth="9" />
          {/* Twisted hanging rebar */}
          <path d="M360 420 Q410 650 370 850 M880 440 Q840 680 890 920" stroke="#482218" strokeWidth="7" fill="none" />
          {/* Vertical rain downpour */}
          {[...Array(24)].map((_, i) => (
            <line
              key={i}
              x1={(i * 85 + stepFrame * 14) % 1080}
              y1={(stepFrame * 32 + i * 75) % 1920}
              x2={(i * 85 + stepFrame * 14 - 15) % 1080}
              y2={(stepFrame * 32 + i * 75 + 110) % 1920}
              stroke="#586772"
              strokeWidth="3"
              opacity="0.45"
            />
          ))}
          {/* Rubble pile at base */}
          <polygon points="0,1500 320,1380 760,1440 1080,1360 1080,1920 0,1920" fill="#1a1d21" stroke="#0c0e10" strokeWidth="10" />
        </svg>
      );
    }

    // 43-59: Vertical Flooded Basement corridor
    return (
      <svg width={width} height={height} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
        <rect width={1080} height={1920} fill="#090b0d" />
        {/* Soaring Gothic concrete archway */}
        <path d="M100 1920 L100 800 Q540 280 980 800 L980 1920 Z" fill="#13161a" stroke="#050709" strokeWidth="12" />
        <path d="M220 1920 L220 920 Q540 450 860 920 L860 1920 Z" fill="#0b0e10" stroke="#050709" strokeWidth="10" />
        {/* Distant basement door */}
        <rect x="420" y="780" width="240" height="480" fill="#201a15" stroke="#070504" strokeWidth="8" />
        <circle cx="450" cy="1020" r="8" fill="#8f7a55" stroke="#070504" strokeWidth="3" />
        {/* Flooded base with dark reflections */}
        <rect y="1520" width={1080} height={400} fill="#06090c" stroke="#020304" strokeWidth="9" />
        <ellipse cx="540" cy="1650" rx="380" ry="45" fill="#0d141a" opacity="0.75" />
      </svg>
    );
  };

  // Render Vertical Native Foreground
  const renderVerticalSubject = () => {
    // Shot 0-3: Noah Reed
    if (shotIndex <= 3) {
      return (
        <div style={{ position: 'absolute', left: 370, top: 620, transform: `scale(${1.3 + shotProgress * 0.06})` }}>
          <FullMan pose="sitting" headComponent={<FaceNoah expression={shotIndex >= 2 ? 'dread' : 'neutral'} size={230} />} />
        </div>
      );
    }

    // Shot 4-7: Olivia Lily with her discs
    if (shotIndex <= 7) {
      return (
        <div style={{ position: 'absolute', left: 410, top: 640, transform: `scale(${1.4 + shotProgress * 0.05})` }}>
          {CAST.lily.bodyBuilder('sitting', <FaceOlivia size={210} expression="neutral" />)}
        </div>
      );
    }

    // Shot 8-11: CRT Screen Scanline Title
    if (shotIndex <= 11) {
      return (
        <div style={{ position: 'absolute', left: 140, top: 580, width: 800, height: 600, background: '#07090b', border: '16px solid #1a1e22', borderRadius: 12, padding: 40, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <h2 style={{ color: '#dce6ec', fontSize: 52, letterSpacing: 4, margin: '0 0 20px 0', textAlign: 'center' }}>DISC 1: INTERVIEW</h2>
          <div style={{ width: 180, height: 8, background: '#a81c1c' }} />
          <p style={{ color: '#7a8c96', fontSize: 28, marginTop: 40 }}>RECORDED: 1993 BALKANS</p>
        </div>
      );
    }

    // Shot 12-16: Uncle Stephen Elias close-up
    if (shotIndex <= 16) {
      return (
        <div style={{ position: 'absolute', left: 370, top: 640, transform: `scale(${1.45 + shotProgress * 0.06})` }}>
          <FullMan pose="sitting" headComponent={<FaceElias size={230} hasCigarette={true} />} coatColor="#423e37" />
        </div>
      );
    }

    // Shot 17-23: Stephen clenching papers
    if (shotIndex <= 23) {
      return (
        <div style={{ position: 'absolute', left: 360, top: 620, transform: 'scale(1.4)' }}>
          <FullMan pose="sitting" headComponent={<FaceElias size={230} hasCigarette={true} />} coatColor="#423e37" />
        </div>
      );
    }

    // Shot 24-28: Hero approaching the ruined school
    if (shotIndex <= 28) {
      return (
        <div style={{ position: 'absolute', left: 460, bottom: 480, transform: `scale(${1.1 + shotProgress * 0.08})` }}>
          <TinyHeroBack width={170} height={300} />
        </div>
      );
    }

    // Shot 29-33: The Vintage Radio & The Note
    if (shotIndex <= 33) {
      return (
        <div style={{ position: 'absolute', left: 390, top: 720, transform: `scale(${2.4 + shotProgress * 0.08})` }}>
          <VintageRadio size={210} isGlowing={true} />
        </div>
      );
    }

    // Shot 34-40: Stanislav sweeping in the dark
    if (shotIndex <= 40) {
      return (
        <div style={{ position: 'absolute', left: 370, top: 580, transform: `scale(${1.35 + shotProgress * 0.05})` }}>
          <GhostFigure type="stanislav" headComponent={<FaceStanislavGhost size={230} mouthOpen={shotIndex >= 38} />} />
        </div>
      );
    }

    // Shot 41-48: Olivia crying on the recording
    if (shotIndex <= 48) {
      return (
        <div style={{ position: 'absolute', left: 410, top: 620, transform: `scale(${1.45 + shotProgress * 0.06})` }}>
          {CAST.lily.bodyBuilder('sitting', <FaceOlivia size={220} expression="crying" />)}
        </div>
      );
    }

    // Shot 49-55: Giant Ghost Janitor face reveal
    if (shotIndex <= 55) {
      return (
        <div style={{ position: 'absolute', left: 340, top: 480, transform: `scale(${1.8 + shotProgress * 0.1})` }}>
          <FaceStanislavGhost size={240} mouthOpen={true} />
        </div>
      );
    }

    // Shot 56-59: Final chilling shot: The radio glowing in the water
    return (
      <div style={{ position: 'absolute', left: 390, top: 760, transform: `scale(${2.6 + shotProgress * 0.08})` }}>
        <VintageRadio size={220} isGlowing={true} />
      </div>
    );
  };

  // Safe area burned-in captions: about 430px above bottom, 70px side margins, ~22 chars per line
  const renderBurnedInCaptions = () => {
    if (!activeCue) return null;
    const lines = wrapText(activeCue.en, 24);

    return (
      <div
        style={{
          position: 'absolute',
          bottom: 430,
          left: 70,
          right: 70,
          textAlign: 'center',
          pointerEvents: 'none',
          zIndex: 50
        }}
      >
        <div
          style={{
            display: 'inline-block',
            backgroundColor: 'rgba(8, 8, 10, 0.82)',
            padding: '16px 28px',
            borderRadius: 8,
            border: '2px solid rgba(220, 220, 220, 0.15)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.85)'
          }}
        >
          {lines.map((line, i) => (
            <div
              key={i}
              style={{
                fontFamily: "'Lora', serif",
                fontSize: 38,
                fontWeight: 700,
                color: '#ffffff',
                lineHeight: 1.35,
                textShadow: '0 3px 8px rgba(0,0,0,0.95), 0 1px 3px rgba(0,0,0,0.85)',
                letterSpacing: '0.5px'
              }}
            >
              {line}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <YamishibaiLayer width={width} height={height} frame={frame}>
      {renderVerticalBackground()}
      {renderVerticalSubject()}
      {renderBurnedInCaptions()}
    </YamishibaiLayer>
  );
};
