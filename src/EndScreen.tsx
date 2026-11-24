import React from 'react';
import { Patch, PaintDefs, LightSet, LIGHT_NIGHT, LIGHT_GHOST, RED } from './Paint';
import { FullPerson, CAST, GHOSTS } from './Cast';
import { motionRig } from './Rig';
// ===== SCROLL KAOS END SCREEN (LONG VIDEO ONLY, 1920x1080, the last 20 seconds).
// Leaves clean, marked spaces where YouTube end-screen elements are added in Studio:
// two video boxes on the right (16:9) and one subscribe circle. Nothing important is drawn under those spaces.
// The closing question stays the main text, so it is still the last sentence on screen.
// Usage in the Long composition: <Sequence from={total - 20 * fps}><EndScreen f={frame} fps={fps} question="Would you have opened the door?" /></Sequence>

export const END_SCREEN_SECONDS = 20; // YouTube Help (checked 2026-11-10): end screens use the last 5-20 s, up to 4 elements on 16:9, video must be 25 s or longer
export const END_ZONES = {
  videoA: { x: 1110, y: 112, w: 704, h: 396 },
  videoB: { x: 1110, y: 572, w: 704, h: 396 },
  subscribe: { cx: 905, cy: 830, r: 112 },
  question: { x: 92, y: 96, w: 920, h: 300 },
};

const wrap = (t: string, max = 24) => {
  const out: string[] = []; let line = '';
  t.split(' ').forEach((w) => { if ((line + ' ' + w).trim().length > max) { out.push(line.trim()); line = w; } else line += ' ' + w; });
  if (line.trim()) out.push(line.trim());
  return out.slice(0, 4);
};

const Frame: React.FC<{ x: number; y: number; w: number; h: number; t: number }> = ({ x, y, w, h, t }) => {
  const c = 34, o = 0.55 + 0.2 * Math.sin(t * 2);
  return (
    <g opacity={o}>
      <rect x={x} y={y} width={w} height={h} rx={10} fill="#05070c" opacity={0.55} />
      <rect x={x} y={y} width={w} height={h} rx={10} fill="none" stroke="#e8dcc4" strokeWidth={2} opacity={0.35} />
      {[[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]].map(([a, b, sx, sy], i) => <path key={i} d={`M${a},${b + sy * c} V${b} H${a + sx * c}`} stroke="#e8dcc4" strokeWidth={5} fill="none" />)}
    </g>
  );
};

export const EndScreen: React.FC<{ f: number; fps?: number; question?: string; channel?: string; hero?: keyof typeof CAST; ghost?: keyof typeof GHOSTS }> = ({ f, fps = 30, question = 'Would you have opened the door?', channel = 'SCROLL KAOS', hero = 'noah', ghost = 'woman' }) => {
  const t = f / fps;
  const appear = Math.min(1, t / 1.2);
  const lines = wrap(question);
  const ghostO = 0.25 + 0.35 * (0.5 + 0.5 * Math.sin(t * 0.9));
  const Z = END_ZONES;
  // breathing idle, with a slow, smooth look back over the shoulder every 8 s (no head snap)
  const w = Math.max(0, Math.min(1, (0.5 - 0.5 * Math.cos((Math.PI * 2 * t) / 8)) * 1.6 - 0.3)), look = w * w * (3 - 2 * w);
  const idleR = motionRig({ type: 'idle' }, 1, CAST[hero].legK || 1, f);
  const heroRig = { ...idleR, turn: -1.1 * look, lean: idleR.lean - 2 * look, swing: [idleR.swing[0] - 6 * look, idleR.swing[1] + 6 * look] as [number, number] };
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080">
      <PaintDefs />
      <defs>
        <linearGradient id="es-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0b0f1a" /><stop offset="0.6" stopColor="#161c2a" /><stop offset="1" stopColor="#0a0c12" /></linearGradient>
        <radialGradient id="es-moon" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#f1e6d0" stopOpacity="0.9" /><stop offset="0.25" stopColor="#c9b89a" stopOpacity="0.35" /><stop offset="1" stopColor="#c9b89a" stopOpacity="0" /></radialGradient>
        <radialGradient id="es-vig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.6" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.75" /></radialGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#es-sky)" />
      <circle cx={560} cy={430} r={520} fill="url(#es-moon)" opacity={0.35} />
      {/* dead trees and ground */}
      <g fill="#07090e" opacity={0.95}>
        <path d="M0,1080 L0,930 C220,900 520,915 760,940 C1000,960 1400,950 1920,930 L1920,1080Z" />
        <path d="M70,940 L84,640 L60,560 M84,640 L120,560 M80,720 L40,690" stroke="#07090e" strokeWidth={14} fill="none" />
        <path d="M980,955 L990,700 L1010,640 M990,760 L950,720" stroke="#07090e" strokeWidth={12} fill="none" />
      </g>
      {/* the ghost fades in and out behind the fog */}
      <g opacity={ghostO * appear}><LightSet {...LIGHT_GHOST}><GhostAt which={ghost} f={f} /></LightSet></g>
      {/* fog bands drift */}
      {[0, 1, 2].map((i) => <Patch key={i} d={`M${-400 + ((t * (14 + i * 6) + i * 300) % 600)},${900 + i * 40} h1700 v70 h-1700Z`} c="#9fb0c4" o={0.12} b={50} />)}
      {/* the hero stands, breathing, looking toward the next videos */}
      <g opacity={appear}><LightSet {...LIGHT_NIGHT}><FullPerson s={CAST[hero]} view="three" face={1} rig={heroRig} x={360} y={1030} k={0.235} f={f} uid="es-hero" /></LightSet></g>
      <Patch d="M-100,985 h2120 v140 h-2120Z" c="#0a0d14" o={0.6} b={24} />
      <rect width={1920} height={1080} fill="url(#es-vig)" />
      {/* closing question (the last sentence on screen) */}
      <g opacity={appear} transform={`translate(${Z.question.x},${Z.question.y + 70})`}>
        {lines.map((l, i) => <text key={i} x={0} y={i * 76} fill={i === lines.length - 1 ? '#f2e6cf' : '#f2e6cf'} fontFamily="Lora, Georgia, serif" fontWeight={700} fontSize={62} letterSpacing={1}>{l}</text>)}
        <rect x={0} y={lines.length * 76 - 40} width={140} height={6} fill={RED} />
      </g>
      <text x={92} y={1046} fill="#e8dcc4" opacity={0.55 * appear} fontFamily="Lora, Georgia, serif" fontSize={26} letterSpacing={6}>{channel}</text>
      {/* spaces for YouTube end-screen elements (add the elements in YouTube Studio) */}
      <Frame {...Z.videoA} t={t} />
      <Frame {...Z.videoB} t={t + 1} />
      <g opacity={0.6 + 0.25 * Math.sin(t * 2.4)}>
        <circle cx={Z.subscribe.cx} cy={Z.subscribe.cy} r={Z.subscribe.r} fill="#05070c" opacity={0.5} />
        <circle cx={Z.subscribe.cx} cy={Z.subscribe.cy} r={Z.subscribe.r + 10} fill="none" stroke={RED} strokeWidth={5} />
      </g>
    </svg>
  );
};

const GhostAt: React.FC<{ which: keyof typeof GHOSTS; f: number }> = ({ which, f }) => (
  <FullPerson s={GHOSTS[which]} x={640} y={990} k={0.18} f={f} pose="straight" uid="es-ghost" />
);
