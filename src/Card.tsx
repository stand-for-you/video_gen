import React from 'react';
import { AbsoluteFill } from 'remotion';
// SCROLL KAOS TEMPLATE - the chapter title card. Give it an ornament of its own for this story
// (past kits used: a floppy disk, an LED clock, a clipboard, notebook paper, a lace scallop).
// Keep the Lora font. Show nothing when t < 0 or t > 30.
export const ChapterCard: React.FC<{ W: number; H: number; t: number; n: number; title: string; vertical?: boolean }> = ({ W, H, t, n, title }) => {
  if (t < 0 || t > 30) return null;
  const a = Math.max(0, Math.min(Math.min(1, t / 3), t > 26 ? (30 - t) / 4 : 1));
  return (
    <AbsoluteFill style={{ background: `rgba(0,0,0,${0.55 * a})`, alignItems: 'center', justifyContent: 'center', opacity: a }}>
      <div style={{ fontFamily: 'Lora', fontWeight: 700, fontSize: H * 0.05, color: '#f6efe0', textAlign: 'center' }}>
        <div style={{ fontSize: H * 0.026, letterSpacing: H * 0.006, opacity: 0.8 }}>CHAPTER {n}</div>
        <div style={{ marginTop: H * 0.015 }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};
