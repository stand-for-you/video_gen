import React from 'react';
import { LightSet } from './Paint';
import { CAST, FullPerson, CloseUp } from './Cast';
import { Dust, NightMask, LightPool, Far } from './kits/Interior';
import { Tag } from './kits/Explain';
import { GhostWoman, GhostChild } from './Body';
import type { SetProps } from './Player';
import { PAL_LAB, LIGHT_LAB, RecLamp, LyingElias, Defs } from './GW';
// ===== STORY SLOT: REEL sets (1080x1920), drawn again for vertical (NOT the 16:9 pictures). Keep faces and tags between y 220 and 1420
// (burned-in captions sit near y 1490). This file imports only the story kit (GW.tsx), never SetsL.tsx.
const W = 1080, H = 1920;
const cl = (v: number) => Math.max(0, Math.min(1, v));
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
const Lit: React.FC<{ children: React.ReactNode }> = ({ children }) => <LightSet {...LIGHT_LAB}>{children}</LightSet>;
const CHF = 1140, WIN = { x: 130, y: 380, w: 820, h: 780 };
const Room: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <g>
    <rect x={0} y={0} width={W} height={H} fill={PAL_LAB.wall} />
    {Array.from({ length: 8 }).map((_, i) => <path key={'v' + i} d={`M${i * 150},0 V${CHF}`} stroke={PAL_LAB.wallInk} strokeWidth={3} opacity={0.45} />)}
    {Array.from({ length: 12 }).map((_, i) => <path key={'h' + i} d={`M0,${i * 110} H${W}`} stroke={PAL_LAB.wallInk} strokeWidth={3} opacity={0.4} />)}
    <rect x={0} y={CHF} width={W} height={H - CHF} fill={PAL_LAB.floor} />
    <rect x={0} y={CHF} width={W} height={6} fill={PAL_LAB.trim} />
    <LightPool x={W / 2} y={120} rx={700} ry={300} c="#d6fff0" o={0.22} />
    {children}
  </g>
);
const Chamber: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <g>
    <rect x={WIN.x} y={WIN.y} width={WIN.w} height={WIN.h} fill="#15201f" />
    {[0.2, 0.8].map((q, i) => <rect key={i} x={WIN.x + WIN.w * q - 60} y={WIN.y + 60} width={120} height={CHF - WIN.y - 60} fill="#22302e" stroke="#0e1716" strokeWidth={4} />)}
    {children}
  </g>
);
const Glass: React.FC<{ f: number }> = ({ f }) => { const s = Math.sin(f / 60) * 0.5 + 0.5; return <g><rect x={WIN.x - 22} y={WIN.y - 22} width={WIN.w + 44} height={WIN.h + 44} fill="#2c3634" /><rect x={WIN.x} y={WIN.y} width={WIN.w} height={WIN.h} fill="#e8fff6" opacity={0.08 + 0.03 * s} /><path d={`M${WIN.x + 160},${WIN.y} L${WIN.x + 260},${WIN.y + WIN.h} L${WIN.x + 225},${WIN.y + WIN.h} L${WIN.x + 130},${WIN.y}Z`} fill="#fff" opacity={0.12} /></g>; };

// 1 GLASS: the Long-Hair Woman behind the observation glass, the subject on the steel bed inside
const rglass: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const p = ease(t / len); const gx = 650 - p * (v.close ? 80 : 20);
  return (
    <g>
      <Defs />
      <Lit>
        <Room>
          <Chamber>
            <rect x={WIN.x} y={CHF - 40} width={WIN.w} height={WIN.y + WIN.h - CHF + 40} fill="#2b3634" />
            <rect x={WIN.x + 120} y={1020} width={560} height={22} fill="#9aa6a2" />
            <LyingElias x={450} y={1000} k={0.46} f={f} expr={v.expr ?? 'sleepy'} uid="rgA" />
            <GhostWoman x={gx} y={CHF} s={0.24} f={f} view="front" motion={{ type: 'idle' }} />
          </Chamber>
          <Glass f={f} />
          <RecLamp x={920} y={1400} />
          <Dust x={60} y={100} w={960} h={1200} f={f} n={18} />
        </Room>
        <NightMask W={W} H={H} x={540} y={900} r={1000} o={0.55} c="#0a1210" />
      </Lit>
    </g>
  );
};
// 2 CHAMBER (wide): the subject on the steel bed, face up, eyes closed, the straps tight
const rchamber: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const p = ease(t / len);
  return (
    <g>
      <Defs />
      <Lit>
        <Room>
          <Chamber>
            <rect x={WIN.x + 40} y={1040} width={WIN.w - 80} height={24} fill="#9aa6a2" />
            <LyingElias x={540} y={1020 - 6 * p} k={0.5} f={f} expr={v.expr ?? 'sleepy'} uid="rcA" />
          </Chamber>
          <Tag at={[700, 360]} to={[790, 300]} text="SENSES CUT" f={t} t0={0.5} />
          <Dust x={60} y={100} w={960} h={1200} f={f} n={16} />
        </Room>
        <NightMask W={W} H={H} x={540} y={900} r={1000} o={0.55} c="#0a1210" />
      </Lit>
    </g>
  );
};
// 3 WALL (wide): the subject throws himself against the padded wall
const rwall: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const p = ease(t / len);
  return (
    <g>
      <Defs />
      <Lit>
        <Room>
          <Chamber>
            <rect x={WIN.x} y={CHF - 6} width={WIN.w} height={20} fill="#2c3c3a" />
          </Chamber>
          <FullPerson s={CAST.elias} x={540 + 30 * p} y={CHF} k={0.3} f={f} view="three" face={-1} expr="fear" motion={{ type: 'recoil' }} />
          <Tag at={[760, 330]} to={[680, 280]} text="HE HITS THE WALL" f={t} t0={0.6} red />
          <Dust x={60} y={100} w={960} h={1200} f={f} n={14} />
        </Room>
        <NightMask W={W} H={H} x={540} y={900} r={1000} o={0.55} c="#0a1210" />
      </Lit>
    </g>
  );
};
// 4 GHOST (wide): the subject sits up and reaches; the Long-Hair Woman stands at the bed's end
const rghost: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const p = ease(t / len);
  return (
    <g>
      <Defs />
      <Lit>
        <Room>
          <Chamber>
            <rect x={WIN.x + 40} y={1040} width={WIN.w - 80} height={24} fill="#9aa6a2" />
          </Chamber>
          <FullPerson s={CAST.elias} x={430} y={CHF} k={0.28} f={f} view="three" face={1} expr="speak" motion={{ type: 'reach' }} />
          <GhostWoman x={780 - 60 * p} y={CHF} s={0.28} f={f} view="front" motion={{ type: 'idle' }} />
          <Tag at={[720, 300]} to={[740, 240]} text="HIS DEAD WIFE" f={t} t0={0.6} />
          <Dust x={60} y={100} w={960} h={1200} f={f} n={14} />
        </Room>
        <NightMask W={W} H={H} x={540} y={900} r={1000} o={0.55} c="#0a1210" />
      </Lit>
    </g>
  );
};
// 5 LAST LOOK (bust, vertical): the head turns slowly toward the glass; eyes closed, neck and shoulders in frame
const rlast: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const p = ease(t / len);
  return (
    <g>
      <Defs />
      <Lit>
        <rect x={0} y={0} width={W} height={H} fill="#15201f" />
        <g transform={`translate(${v.x ?? 540},960) scale(1.02)`}>
          <CloseUp s={CAST.elias} expr={v.expr ?? 'sad'} f={f} turn={0.5 - 0.6 * p} uid="rll" />
        </g>
        <NightMask W={W} H={H} x={540} y={900} r={820} o={0.75} c="#0a1210" />
      </Lit>
    </g>
  );
};
// 6 FLAT (detail, vertical): the monitor line flattens; a steady red lamp
const rflat: React.FC<SetProps> = ({ f, t = 0, len = 90 }) => {
  const p = ease(t / len); const cut = 180 + 620 * p; let d = 'M180,980';
  for (let x = 180; x <= 900; x += 10) { const amp = x < cut ? 120 * (1 - 0.2 * (x - 180) / 720) : 0; d += ` L${x},${980 + amp * Math.sin((x + f * 3) / 14) * 0.7}`; }
  return (
    <g>
      <Defs />
      <Lit>
        <rect x={0} y={0} width={W} height={H} fill="#0d1412" />
        <rect x={120} y={760} width={840} height={440} rx={16} fill="#2c3438" stroke="#14191c" strokeWidth={8} />
        <rect x={160} y={800} width={760} height={360} rx={6} fill="#071210" />
        <path d={d} stroke="#78e0a8" strokeWidth={6} fill="none" strokeLinejoin="round" />
        <RecLamp x={860} y={840} />
        <Tag at={[300, 1330]} to={[600, 1320]} text="NO CAUSE FOUND" f={t} t0={0.9} red />
      </Lit>
    </g>
  );
};
// 7 CREDIT card (vertical)
const rqcard: React.FC<SetProps> = ({ f, t = 0 }) => {
  const a = ease(t / 30);
  return (
    <g opacity={a}>
      <Defs />
      <rect x={0} y={0} width={W} height={H} fill="#0c1412" />
      <rect x={90} y={640} width={900} height={560} fill="#dfe9e2" stroke="#2e3836" strokeWidth={6} />
      <text x={540} y={760} textAnchor="middle" fontFamily="Lora" fontStyle="italic" fontSize={44} fill="#1a2220">Inspired by the story</text>
      <text x={540} y={850} textAnchor="middle" fontFamily="Lora" fontWeight={700} fontSize={64} fill="#1a2220">Gateway of the Mind</text>
      <text x={540} y={940} textAnchor="middle" fontFamily="Lora" fontStyle="italic" fontSize={40} fill="#3a4a46">as published on an online horror story page</text>
      <text x={540} y={1080} textAnchor="middle" fontFamily="Lora" fontWeight={700} fontSize={34} fill="#b3221f">Fiction. Retold in our own words.</text>
    </g>
  );
};
// 8 QUESTION card (closing, vertical): the closing question as the last on-screen text
const rqend: React.FC<SetProps> = ({ f, t = 0 }) => {
  const a = ease(t / 30);
  return (
    <g opacity={a}>
      <rect x={0} y={0} width={W} height={H} fill="#0c1412" />
      <text x={540} y={900} textAnchor="middle" fontFamily="Lora" fontStyle="italic" fontWeight={700} fontSize={70} fill="#efe4cc">Would you have kept</text>
      <text x={540} y={990} textAnchor="middle" fontFamily="Lora" fontStyle="italic" fontWeight={700} fontSize={70} fill="#efe4cc">listening to the voices?</text>
    </g>
  );
};
void GhostChild; void Far; void ease;
export const SETS: Record<string, React.FC<SetProps>> = { rglass, rchamber, rwall, rghost, rlast, rflat, rqcard, rqend };


