import React from 'react';
import { Set3, SetP } from './Stage3';
import { CamSpec } from './k3/Cam';
import { V3, ss, sway, PAL } from './k3/core';
import { Night, Ground, Grass, Mist, Flakes } from './k3/World';
import { Forest, DeadTree, Gravestone } from './k3/Nature';
import { Person } from './k3/Person';
import { Creature, HERBERT } from './k3/Creature';
import { CAST3, GHOST3 } from './Cast3D';
import ST from './story.json';
// ===== END SCREEN (LONG VIDEO ONLY, the last 20 seconds) =====
// YouTube Help (checked 2026-11-10): end screens use the last 5-20 s, up to 4 elements on 16:9, the video must be 25 s or longer.
// The right side and one circle are kept EMPTY so the YouTube elements can sit there. The closing question is the last text on screen.
export const END_SECONDS = 20;
export const END_ZONES = { videoA: { x: 1110, y: 112, w: 704, h: 396 }, videoB: { x: 1110, y: 572, w: 704, h: 396 }, subscribe: { cx: 905, cy: 830, r: 112 }, question: { x: 92, y: 110, w: 920 } };
export const endCam = (v: any, t: number, len: number): CamSpec => ({ p: [-1.9, 1.8, 6.2], l: [-1.4, 1.25, 0], fov: 40, move: 'push', amt: 0.1, breath: 1.1 });
export const EndScreen3: Set3 = ({ t, v }: SetP) => {
  const hero = (v?.hero as string) || 'noah';
  const look = ss((t - 3) / 2.2);
  return (<>
    <Night t={t} density={0.05} moonI={1.9} amb={0.5} disc={[-26, 22, -70]} discR={6} />
    <Ground flat={18} c="#1a2320" />
    <Forest t={t} n={16} area={[-26, 26, -34, -14]} dead={0.5} />
    {[[-5.5, -9], [4.5, -11], [7.5, -8]].map((p, i) => <DeadTree key={i} at={[p[0], 0, p[1]]} s={1.5 + i * 0.2} t={t} seed={i + 5} />)}
    {[[-3.4, -5.5, 0], [-6.2, -7.2, 1], [2.6, -6.4, 2]].map((p, i) => <Gravestone key={i} at={[p[0], 0, p[1]]} kind={p[2]} s={0.9} rot={i * 0.7} />)}
    <Grass t={t} n={450} area={[-12, 12, -10, 6]} />
    <Person s={CAST3[hero] || CAST3.noah} at={[-1.4, 0, 0]} rot={0.25 + look * 0.5} t={t} pose="idle" expr="calm" seed={2} look={[look * 0.35, -0.05]} />
    <group position={[2.6, 0, -7]} scale={1}><Person s={GHOST3.woman} at={[0, 0, 0]} rot={0.1} t={t} pose="idle" seed={8} /></group>
    <Mist t={t} n={6} area={[-14, 14, -12, 6]} y={0.5} o={0.17} />
    <Flakes t={t} n={125} box={[-10, 10, 0, 7, -12, 5]} />
  </>);
};
const wrap = (s: string, max = 24) => { const out: string[] = []; let line = ''; s.split(' ').forEach((w) => { if ((line + ' ' + w).trim().length > max) { out.push(line.trim()); line = w; } else line += ' ' + w; }); if (line.trim()) out.push(line.trim()); return out.slice(0, 4); };
const Frame: React.FC<{ x: number; y: number; w: number; h: number; t: number; k: number }> = ({ x, y, w, h, t, k }) => {
  const c = 34, o = (0.5 + 0.2 * Math.sin(t * 2)) * k;
  return (<g opacity={o}>
    <rect x={x} y={y} width={w} height={h} rx={10} fill="#05070c" opacity={0.5} />
    <rect x={x} y={y} width={w} height={h} rx={10} fill="none" stroke="#e8dcc4" strokeWidth={2} opacity={0.35} />
    {[[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]].map(([a, b, sx, sy], i) => <path key={i} d={`M${a},${b + sy * c} V${b} H${a + sx * c}`} stroke="#e8dcc4" strokeWidth={5} fill="none" />)}
  </g>);
};
(EndScreen3 as any).overlay = ({ t, W, H, vert }: SetP) => {
  const k = ss(t / 1.2); const Z = END_ZONES; const sx = W / 1920, sy = H / 1080;
  const q = (ST as any).question || 'Would you have opened the door?';
  const lines = wrap(q, vert ? 16 : 24); const fs = vert ? 70 : 62;
  return (
    <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0 }}>
      <g opacity={k} transform={vert ? `translate(${W * 0.08},${H * 0.3})` : `translate(${Z.question.x * sx},${(Z.question.y + 60) * sy})`}>
        {lines.map((l, i) => <text key={i} x={0} y={i * (fs * 1.22)} fill="#f4e9d4" fontFamily="Lora, Georgia, serif" fontWeight={700} fontSize={fs} letterSpacing={1}>{l}</text>)}
        <rect x={0} y={lines.length * (fs * 1.22) - fs * 0.62} width={140} height={6} fill={PAL.red} />
      </g>
      <text x={W * 0.048} y={H * 0.962} fill="#e8dcc4" opacity={0.5 * k} fontFamily="Lora, Georgia, serif" fontSize={26 * sx} letterSpacing={6}>{(ST as any).channel || 'SCROLL KAOS'}</text>
      {!vert && <>
        <Frame {...Z.videoA} t={t} k={k} /><Frame {...Z.videoB} t={t + 1} k={k} />
        <g opacity={(0.55 + 0.25 * Math.sin(t * 2.4)) * k}>
          <circle cx={Z.subscribe.cx} cy={Z.subscribe.cy} r={Z.subscribe.r} fill="#05070c" opacity={0.45} />
          <circle cx={Z.subscribe.cx} cy={Z.subscribe.cy} r={Z.subscribe.r + 10} fill="none" stroke={PAL.red} strokeWidth={5} />
        </g>
      </>}
    </svg>
  );
};
