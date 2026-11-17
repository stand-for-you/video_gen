import React from 'react';
import { Set3, SetP } from './Stage3';
import { CamSpec } from './k3/Cam';
import { V3, ss, sway, PAL, M } from './k3/core';
import { Night, Mist } from './k3/World';
import { HomeOffice, Seer, SP } from './SR3';
import ST from './story.json';
// ===== END SCREEN (LONG VIDEO ONLY, the last 20 seconds) =====
// YouTube end screens use the last 5-20 s, up to 4 elements on 16:9, and the video must be 25 s or longer.
// The picture: the upstairs office after everything. The chair is empty and still turning a little. The monitor is dark.
// Far back in the dark, the Seer is still standing there. The right side and one circle stay empty for the YouTube elements.
export const END_SECONDS = 20;
export const END_ZONES = { videoA: { x: 1110, y: 112, w: 704, h: 396 }, videoB: { x: 1110, y: 572, w: 704, h: 396 }, subscribe: { cx: 905, cy: 830, r: 112 }, question: { x: 92, y: 110, w: 920 } };
export const endCam = (): CamSpec => ({ p: [-2.1, 1.62, 1.1], l: [0.3, 1.1, -2.2], fov: 42, move: 'push', amt: 0.12, breath: 1.1 });
export const EndScreen3: Set3 = ({ t }: SetP) => (<>
  <Night t={t} indoor density={0.045} amb={0.3} moonI={0.5} moonC="#8fa8ff" rim={0.25} fill={0.2} disc={null} stars={false} fog="#15181f" sky="#07080c" />
  <HomeOffice t={t} off lamp={0.18} />
  <Mist t={t} n={4} area={[-3, 3, -2.5, 2]} y={0.5} o={0.08} c="#2a2e38" size={5} />
  <group position={[-2.3, 0, 2.2]} scale={0.92}><Seer at={[0, 0, 0]} rot={0.5} t={t} pose="stand" /></group>
</>);
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
  const q = (ST as any).question || 'Would you have done the first favour?';
  const lines = wrap(q, vert ? 16 : 22); const fs = vert ? 68 : 60;
  return (
    <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0 }}>
      <g opacity={k} transform={vert ? `translate(${W * 0.08},${H * 0.3})` : `translate(${Z.question.x * sx},${(Z.question.y + 60) * sy})`}>
        {lines.map((l, i) => <text key={i} x={0} y={i * (fs * 1.22)} fill="#f4e9d4" fontFamily="Lora, Georgia, serif" fontWeight={700} fontSize={fs} letterSpacing={1}>{l}</text>)}
        <rect x={0} y={lines.length * (fs * 1.22) - fs * 0.62} width={140} height={6} fill="#d8241f" />
      </g>
      <text x={W * 0.048} y={H * 0.962} fill="#e8dcc4" opacity={0.5 * k} fontFamily="Lora, Georgia, serif" fontSize={26 * sx} letterSpacing={6}>{(ST as any).channel || 'SCROLL KAOS'}</text>
      {!vert && <>
        <Frame {...Z.videoA} t={t} k={k} /><Frame {...Z.videoB} t={t + 1} k={k} />
        <g opacity={(0.55 + 0.25 * Math.sin(t * 2.4)) * k}>
          <circle cx={Z.subscribe.cx} cy={Z.subscribe.cy} r={Z.subscribe.r} fill="#05070c" opacity={0.45} />
          <circle cx={Z.subscribe.cx} cy={Z.subscribe.cy} r={Z.subscribe.r + 10} fill="none" stroke="#d8241f" strokeWidth={5} />
        </g>
      </>}
    </svg>
  );
};
