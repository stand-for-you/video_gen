import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Stage3 } from './Stage3';
import { Night, Ground, Mist, Flakes } from './k3/World';
import { ApartmentStudy, OfficeLobby, CRTMonitor, PottedPlant, UpstairsStudy } from './Seer3';
import { Person } from './k3/Person';
import { CAST3, GHOST3 } from './Cast3D';

// ===== THUMBNAIL A: 1280x720 (Main A/B set)
export const ThumbA: React.FC = () => {
  const S = () => (
    <>
      <Night t={2} fog="#060a12" density={0.06} moonI={1.4} amb={0.3} />
      <ApartmentStudy t={2} textRed={true} />
      <Person s={CAST3.noah} at={[0.4, 0, -0.6]} rot={Math.PI * 0.9} t={2} pose="hold" expr="fear" />
      <group position={[1.4, 1.2, -4.5]}>
        <Person s={GHOST3.woman} at={[0, 0, 0]} t={2} pose="idle" />
        <pointLight position={[0, 0.5, 0.2]} color="#ff2222" intensity={3.5} distance={6} />
      </group>
    </>
  );
  return (
    <AbsoluteFill style={{ background: '#05070c' }}>
      <Stage3 S={S as any} v={{}} t={2} len={5} W={1280} H={720} />
      {/* Title typography */}
      <div style={{ position: 'absolute', left: 70, top: 80, maxWidth: 640 }}>
        <div style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: 32, letterSpacing: 4, color: '#ff2828', textShadow: '0 0 16px rgba(255,40,40,0.8)' }}>
          OFFLINE COMPUTER SPEAKS
        </div>
        <div style={{ fontFamily: 'Lora, Georgia, serif', fontWeight: 700, fontSize: 74, lineHeight: 1.05, color: '#f8fafc', textShadow: '0 6px 20px rgba(0,0,0,0.95)' }}>
          THE SEER OF POSSIBILITIES
        </div>
      </div>
    </AbsoluteFill>
  );
};
(ThumbA as any).cam = () => ({ p: [-1.2, 1.6, 3.8], l: [0.2, 1.1, -1.8], fov: 42, move: 'hold', amt: 0 });

// ===== THUMBNAIL B: 1280x720 (Closer crop + 2-word punchy title)
export const ThumbB: React.FC = () => {
  const S = () => (
    <>
      <Night t={2} fog="#050810" density={0.075} moonI={1.1} amb={0.25} />
      <group position={[0, -0.2, 0]}>
        <CRTMonitor t={2} at={[0.2, 0.35, -1.2]} textRed={true} lit={true} />
      </group>
      <Person s={CAST3.noah} at={[-0.4, 0, -0.6]} rot={Math.PI * 0.75} t={2} pose="hold" expr="fear" />
    </>
  );
  return (
    <AbsoluteFill style={{ background: '#05070c' }}>
      <Stage3 S={S as any} v={{}} t={2} len={5} W={1280} H={720} />
      <div style={{ position: 'absolute', left: 80, top: 120 }}>
        <div style={{ fontFamily: 'Lora, Georgia, serif', fontWeight: 700, fontSize: 96, lineHeight: 0.95, color: '#ff2828', textShadow: '0 0 30px rgba(255,40,40,0.9)' }}>
          DON'T ANSWER
        </div>
        <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 32, color: '#e2e8f0', letterSpacing: 3, marginTop: 16 }}>
          12 YEARS OF MANIPULATION
        </div>
      </div>
    </AbsoluteFill>
  );
};
(ThumbB as any).cam = () => ({ p: [-0.6, 1.45, 2.4], l: [0, 1.0, -1.2], fov: 36, move: 'hold', amt: 0 });

// ===== THUMBNAIL C: 1280x720 (Key object big & glowing: The Potted Ficus)
export const ThumbC: React.FC = () => {
  const S = () => (
    <>
      <Night t={2} fog="#0e1520" density={0.045} moonI={1.8} amb={0.45} />
      <OfficeLobby t={2} plantOffset={0.08} />
      <Person s={CAST3.noah} at={[1.8, 0, -4.2]} rot={-Math.PI / 2.5} t={2} pose="hold" expr="fear" />
    </>
  );
  return (
    <AbsoluteFill style={{ background: '#05070c' }}>
      <Stage3 S={S as any} v={{}} t={2} len={5} W={1280} H={720} />
      <div style={{ position: 'absolute', left: 70, top: 90 }}>
        <div style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: 34, color: '#38bdf8', letterSpacing: 4 }}>
          MOVE IT 3 INCHES
        </div>
        <div style={{ fontFamily: 'Lora, Georgia, serif', fontWeight: 700, fontSize: 82, color: '#ffffff', textShadow: '0 6px 24px rgba(0,0,0,0.9)' }}>
          THE FATAL FAVOR
        </div>
      </div>
    </AbsoluteFill>
  );
};
(ThumbC as any).cam = () => ({ p: [0, 1.4, 4.2], l: [0, 1.1, -5.5], fov: 40, move: 'hold', amt: 0 });

// ===== THUMBNAIL R: 1080x1920 (Vertical Reel Cover)
export const ThumbR: React.FC = () => {
  const S = () => (
    <>
      <Night t={2} fog="#060910" density={0.07} moonI={1.2} amb={0.3} />
      <UpstairsStudy t={2} textRed={true} hulkInDoor={true} />
    </>
  );
  return (
    <AbsoluteFill style={{ background: '#05070c' }}>
      <Stage3 S={S as any} v={{}} t={2} len={5} W={1080} H={1920} vert={true} />
      <div style={{ position: 'absolute', left: 70, top: 180, right: 70 }}>
        <div style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: 36, color: '#ff2828', letterSpacing: 4, textShadow: '0 0 16px rgba(255,40,40,0.8)' }}>
          12 YEARS PLANNED
        </div>
        <div style={{ fontFamily: 'Lora, Georgia, serif', fontWeight: 700, fontSize: 78, lineHeight: 1.05, color: '#ffffff', textShadow: '0 6px 24px rgba(0,0,0,0.95)', marginTop: 12 }}>
          THE SEER OF POSSIBILITIES
        </div>
      </div>
    </AbsoluteFill>
  );
};
(ThumbR as any).cam = () => ({ p: [0.8, 1.5, 4.8], l: [0, 1.15, -1.6], fov: 50, move: 'hold', amt: 0 });
