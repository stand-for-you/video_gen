import React from 'react';
import { LightSet } from './Paint';
import { CAST, GHOSTS, FullPerson, CloseUp } from './Cast';
import { Dust, LightPool, NightMask } from './kits/Interior';
import { Tag } from './kits/Explain';
import { EndScreen } from './EndScreen';
import { GhostWoman, GhostGrin, GhostChild } from './Body';
import type { SetProps } from './Player';
import { Defs, LabRoom, ObsGlass, SteelBed, LyingElias, RecLamp, LIGHT_LAB, PAL_LAB, W, H, FLOOR } from './GW';
// ===== STORY SLOT: LONG-video sets (1920x1080) for "Gateway of the Mind". Every set reads f (1/30 s), t and len. Motion is smooth.
const cl = (v: number) => Math.max(0, Math.min(1, v));
const ease = (x: number) => { const c = cl(x); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
const Lit: React.FC<{ children: React.ReactNode }> = ({ children }) => <LightSet {...LIGHT_LAB}>{children}</LightSet>;
const CH_FLOOR = 700, WIN = { x: 480, y: 120, w: 960, h: 600 };
// the chamber behind the observation glass (dark teal padded room, steel bed, the subject)
const Chamber: React.FC<{ f: number; children?: React.ReactNode }> = ({ f, children }) => (
  <g>
    <rect x={WIN.x} y={WIN.y} width={WIN.w} height={WIN.h} fill="#15201f" />
    {[0.1, 0.5, 0.9].map((q, i) => <rect key={i} x={WIN.x + WIN.w * q - 70} y={WIN.y + 60} width={140} height={CH_FLOOR - WIN.y - 60} fill="#22302e" stroke="#0e1716" strokeWidth={4} />)}
    <rect x={WIN.x} y={CH_FLOOR} width={WIN.w} height={WIN.y + WIN.h - CH_FLOOR} fill="#2b3634" />
    {children}
  </g>
);

// 1 GLASS (wide): from the observer's side, the chamber glass, the Long-Hair Woman standing behind it (her dead husband's wife), the subject
const glass: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const p = ease(t / len); const gx = (v.close ? 1500 : 1330) - p * (v.close ? 120 : 40);
  const g = v.ghost === 'grin' ? 'grin' : v.ghost === 'child' ? 'child' : 'woman';
  return (
    <g>
      <Defs />
      <Lit>
        <LabRoom f={f} />
        <Chamber f={f}>
          <SteelBed x={720} y={CH_FLOOR - 10} w={520} f={f} />
          <LyingElias x={700} y={640} k={0.3} f={f} expr={v.expr ?? 'sleepy'} uid="glA" />
          {g === 'woman' && <GhostWoman x={gx} y={CH_FLOOR} s={0.2} f={f} view="front" motion={{ type: 'idle' }} />}
          {g === 'grin' && <GhostGrin x={gx} y={CH_FLOOR} s={0.19} f={f} view="front" motion={{ type: 'idle' }} />}
          {g === 'child' && <GhostChild x={gx} y={CH_FLOOR} s={0.15} f={f} view="front" motion={{ type: 'idle' }} />}
        </Chamber>
        <ObsGlass x={WIN.x} y={WIN.y} w={WIN.w} h={WIN.h} f={f} />
        <rect x={0} y={800} width={W} height={280} fill={PAL_LAB.floorD} opacity={0.6} />
        <rect x={120} y={690} width={560} height={28} fill="#3a4442" />
        <RecLamp x={600} y={660} />
        <Dust x={300} y={100} w={1300} h={800} f={f} n={26} />
      </Lit>
      <NightMask W={W} H={H} x={960} y={500} r={1080} o={0.6} c="#0c1412" />
    </g>
  );
};

// 2 RECORDER (detail): the tape reels turn, the REC lamp stays lit (steady), the slurred words are caught on tape
const recorder: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const p = ease(t / len); const rot = f * (v.rev ? -1 : 1) * 1.6;
  return (
    <g>
      <Defs />
      <Lit>
        <rect x={0} y={0} width={W} height={H} fill="#2a3432" />
        <rect x={0} y={0} width={W} height={H} fill="#0d1412" opacity={0.3} />
        <rect x={560} y={380} width={800} height={460} rx={24} fill="#3a4046" stroke="#1a1e22" strokeWidth={6} />
        <rect x={600} y={420} width={720} height={150} rx={10} fill="#1c2226" />
        {[800, 1120].map((cx, i) => <g key={i} transform={`rotate(${rot} ${cx} 540)`}>
          <circle cx={cx} cy={540} r={108} fill="#cfd6d2" stroke="#2a3230" strokeWidth={6} />
          <circle cx={cx} cy={540} r={36} fill="#3a4046" />
          {[0, 1, 2].map((k) => <rect key={k} x={cx - 6} y={540 - 100} width={12} height={200} fill="#8a948e" transform={`rotate(${k * 60} ${cx} 540)`} />)}
        </g>)}
        <path d={`M800,540 L 1120,540`} stroke="#5a2a1c" strokeWidth={6} opacity={0.6} />
        <rect x={700} y={650} width={520} height={28} rx={6} fill="#2a2e34" />
        <path d={`M${700 + 52 * p},664 L ${1220},664`} stroke="#8fd6c8" strokeWidth={4} opacity={0.6} />
        <RecLamp x={1250} y={440} />
        <rect x={1240} y={700} width={84} height={44} rx={8} fill="#11161a" />
        <Tag at={[1000, 670]} to={[1420, 300]} text="SLURRED WORDS" f={t} t0={0.8} red />
        <LightPool x={960} y={600} rx={700} ry={360} c="#d6fff0" o={0.18} />
        <Dust x={300} y={100} w={1300} h={800} f={f} n={24} />
      </Lit>
      <NightMask W={W} H={H} x={960} y={540} r={1000} o={0.55} c="#0a1010" />
    </g>
  );
};

// 3 CORRIDOR (wide): two scientists walk down the lab corridor, one of them leaves (v.leave)
const corridor: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const p = ease(t / len);
  const ox = v.leave ? 1080 - 620 * p : 1000 + 160 * p;
  return (
    <g>
      <Defs />
      <Lit>
        <LabRoom f={f} />
        <rect x={1380} y={250} width={300} height={570} fill="#1e2826" stroke="#0e1412" strokeWidth={8} />
        <rect x={1410} y={280} width={240} height={36} fill="#b8c4bc" opacity={0.9} />
        <rect x={640} y={380} width={180} height={440} fill="#2a3432" />
        <FullPerson s={CAST.oliver} x={560 + 260 * p} y={FLOOR} k={0.28} f={f} view="three" face={1} expr={v.expr ?? 'worry'} motion={{ type: 'walk' }} />
        <FullPerson s={CAST.terence} x={ox} y={FLOOR} k={0.28} f={f} view={v.leave ? 'back' : 'three'} face={v.leave ? -1 : 1} expr={v.expr ?? 'neutral'} motion={{ type: 'walk' }} />
        <Dust x={300} y={100} w={1300} h={800} f={f} n={20} />
      </Lit>
      <NightMask W={W} H={H} x={960} y={540} r={1150} o={0.5} c="#0a1210" />
    </g>
  );
};

// 4 CHAMBER (wide): the subject strapped to the steel bed, face up, eyes closed, the observers outside the glass
const chamber: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const p = ease(t / len);
  return (
    <g>
      <Defs />
      <Lit>
        <g transform={v.flip ? 'translate(1920,0) scale(-1,1)' : undefined}><Chamber f={f}>
          <SteelBed x={560} y={CH_FLOOR - 10} w={800} f={f} />
          {/* fit = the bed's usable length, so the body can never overhang it */}
          <LyingElias x={960} y={CH_FLOOR - 10 - 6 * p} k={0.4} fit={760} f={f} expr={v.expr ?? 'sleepy'} uid="chA" />
        </Chamber></g>
        <ObsGlass x={WIN.x} y={WIN.y} w={WIN.w} h={WIN.h} f={f} />
        <rect x={0} y={800} width={W} height={280} fill={PAL_LAB.floorD} opacity={0.5} />
        <Tag at={[1140, 300]} to={[1480, 220]} text="SENSES CUT" f={t} t0={0.5} />
        <Dust x={300} y={100} w={1300} h={800} f={f} n={20} />
      </Lit>
      <NightMask W={W} H={H} x={960} y={540} r={1080} o={0.55} c="#0a1210" />
    </g>
  );
};

// 5 CHAMBER CLOSE (bust): the subject's face in the padded room, neck and shoulders kept, the head turns very slowly
const chambercu: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const p = ease(t / len);
  return (
    <g>
      <Defs />
      <Lit>
        <rect x={0} y={0} width={W} height={H} fill="#15201f" />
        <g transform={`translate(${v.x ?? 960},560) scale(0.92)`}>
          <CloseUp s={CAST.elias} expr={v.expr ?? 'fear'} f={f} turn={0.1 + 0.25 * p} uid="ccu" />
        </g>
        {v.tag && <Tag at={[1100, 420]} to={[1450, 260]} text="NO SOUND" f={t} t0={0.7} />}
        <NightMask W={W} H={H} x={960} y={520} r={820} o={0.8} c="#0a1210" />
      </Lit>
    </g>
  );
};

// 6 WALL (wide): the subject throws his body against the padded wall; his arms and shoulders keep moving
const wallhit: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const p = ease(t / len);
  return (
    <g>
      <Defs />
      <Lit>
        <Chamber f={f}>
          {[0.15, 0.85].map((q, i) => <rect key={i} x={WIN.x + WIN.w * q - 70} y={WIN.y + 60} width={140} height={CH_FLOOR - WIN.y - 60} fill="#2a3a38" />)}
          <path d={`M${WIN.x + 120},${WIN.y + 130} L${WIN.x + 210},${WIN.y + 240} L${WIN.x + 180},${WIN.y + 310}`} stroke="#0c1412" strokeWidth={5} fill="none" />
        </Chamber>
        <FullPerson s={CAST.elias} x={960 + 20 * p} y={CH_FLOOR} k={0.27} f={f} view="three" face={-1} expr="fear" motion={{ type: 'recoil' }} />
        <Tag at={[1220, 300]} to={[1480, 220]} text="HE HITS THE WALL" f={t} t0={0.6} red />
        <Dust x={300} y={100} w={1300} h={800} f={f} n={16} />
      </Lit>
      <NightMask W={W} H={H} x={960} y={520} r={1100} o={0.55} c="#0a1210" />
    </g>
  );
};

// 7 GHOST BED (wide): the subject sits up in bed and reaches toward the Long-Hair Woman, who stands at the bed's end
const ghostbed: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const p = ease(t / len);
  return (
    <g>
      <Defs />
      <Lit>
        <Chamber f={f}>
          <SteelBed x={420} y={CH_FLOOR - 10} w={640} f={f} straps={false} />
          <FullPerson s={CAST.elias} x={560} y={CH_FLOOR - 40} k={0.25} f={f} view="three" face={1} expr="speak" motion={{ type: 'reach' }} />
          <GhostWoman x={1240 - 80 * p} y={CH_FLOOR} s={0.26} f={f} view="front" motion={{ type: 'idle' }} />
        </Chamber>
        <ObsGlass x={WIN.x} y={WIN.y} w={WIN.w} h={WIN.h} f={f} />
        <Tag at={[1280, 260]} to={[1520, 200]} text="HIS DEAD WIFE" f={t} t0={0.6} />
        <Dust x={300} y={100} w={1300} h={800} f={f} n={18} />
      </Lit>
      <NightMask W={W} H={H} x={960} y={520} r={1100} o={0.55} c="#0a1210" />
    </g>
  );
};

// 8 RELATIVES (wide): Dr. Oliver in the foreground hears names she never told anyone; the Grinner stands behind the glass
const relatives: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const p = ease(t / len);
  return (
    <g>
      <Defs />
      <Lit>
        <LabRoom f={f} />
        <Chamber f={f}>
          <GhostGrin x={1250} y={CH_FLOOR} s={0.22} f={f} view="front" motion={{ type: 'idle' }} />
        </Chamber>
        <ObsGlass x={WIN.x} y={WIN.y} w={WIN.w} h={WIN.h} f={f} />
        <FullPerson s={CAST.oliver} x={420 - 40 * p} y={FLOOR} k={0.3} f={f} view="three" face={1} expr="fear" motion={{ type: 'tremble' }} />
        <Tag at={[700, 340]} to={[1100, 230]} text="PRIVATE DETAILS" f={t} t0={0.8} red />
        <Dust x={300} y={100} w={1300} h={800} f={f} n={18} />
      </Lit>
      <NightMask W={W} H={H} x={960} y={520} r={1100} o={0.55} c="#0a1210" />
    </g>
  );
};

// 9 CHILD (wide): the Drenched Child stands at the chamber door; wet footprints lead across the floor toward the camera
const child: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const p = ease(t / len);
  return (
    <g>
      <Defs />
      <Lit>
        <Chamber f={f}>
          <rect x={1420} y={WIN.y + 40} width={150} height={CH_FLOOR - WIN.y - 40} fill="#0b1210" />
          <GhostChild x={1490} y={CH_FLOOR} s={0.16} f={f} view="front" motion={{ type: 'idle' }} />
        </Chamber>
        {[0, 1, 2, 3].map((i) => <ellipse key={i} cx={1000 + i * 70 + 20 * p} cy={CH_FLOOR + 170 - i * 60} rx={24} ry={10} fill="#0c1816" opacity={0.6 - i * 0.08} />)}
        <rect x={0} y={CH_FLOOR + 60} width={W} height={H - CH_FLOOR} fill="#0d1614" opacity={0.25} />
        <Tag at={[1500, 360]} to={[1200, 260]} text="WET FOOTPRINTS" f={t} t0={0.7} />
        <Dust x={300} y={100} w={1300} h={800} f={f} n={20} />
      </Lit>
      <NightMask W={W} H={H} x={960} y={520} r={1100} o={0.6} c="#0a1210" />
    </g>
  );
};

// 10 LAST LOOK (bust): the subject turns his head toward the glass; the eyes are closed, the mouth barely moves
const lastlook: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const p = ease(t / len);
  return (
    <g>
      <Defs />
      <Lit>
        <rect x={0} y={0} width={W} height={H} fill="#15201f" />
        <g transform={`translate(${v.x ?? 960},560) scale(0.95)`}>
          <CloseUp s={CAST.elias} expr={v.expr ?? 'sad'} f={f} turn={0.5 - 0.6 * p} uid="ll" />
        </g>
        <NightMask W={W} H={H} x={960} y={520} r={860} o={0.75} c="#0a1210" />
      </Lit>
    </g>
  );
};

// 11 FLATLINE (detail): a monitor screen; the green trace flattens; the red lamp stays on (steady)
const flatline: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const p = ease(t / len); const cut = 600 + 720 * p; let d = 'M600,520';
  for (let x = 600; x <= 1320; x += 10) { const amp = x < cut ? 110 * (1 - 0.2 * (x - 600) / 720) : 0; d += ` L${x},${520 + amp * Math.sin((x + f * 3) / 14) * 0.7}`; }
  return (
    <g>
      <Defs />
      <Lit>
        <rect x={0} y={0} width={W} height={H} fill="#0d1412" />
        <rect x={520} y={240} width={880} height={560} rx={16} fill="#2c3438" stroke="#14191c" strokeWidth={8} />
        <rect x={560} y={280} width={800} height={420} rx={6} fill="#071210" />
        <path d={d} stroke="#78e0a8" strokeWidth={5} fill="none" strokeLinejoin="round" />
        <RecLamp x={1370} y={300} />
        <Tag at={[1000, 740]} to={[1450, 560]} text="NO CAUSE FOUND" f={t} t0={0.9} red />
      </Lit>
    </g>
  );
};

// 12 CREDIT (card): a plain card with the credit line; slow fade in
const credit: React.FC<SetProps> = ({ f, t = 0 }) => {
  const a = ease(t / 30);
  return (
    <g opacity={a}>
      <Defs />
      <rect x={0} y={0} width={W} height={H} fill="#0c1412" />
      <rect x={420} y={300} width={1080} height={480} fill="#dfe9e2" stroke="#2e3836" strokeWidth={6} />
      {Array.from({ length: 8 }).map((_, i) => <path key={i} d={`M420,${340 + i * 56} H1500`} stroke="#b8c4bc" strokeWidth={2} />)}
      <text x={960} y={420} textAnchor="middle" fontFamily="Lora" fontStyle="italic" fontSize={46} fill="#1a2220">This video is inspired by the story</text>
      <text x={960} y={500} textAnchor="middle" fontFamily="Lora" fontWeight={700} fontSize={64} fill="#1a2220">Gateway of the Mind</text>
      <text x={960} y={580} textAnchor="middle" fontFamily="Lora" fontStyle="italic" fontSize={40} fill="#3a4a46">as published on an online horror story page</text>
      <text x={960} y={690} textAnchor="middle" fontFamily="Lora" fontWeight={700} fontSize={34} fill="#b3221f">Fiction. Retold in our own words.</text>
    </g>
  );
};

// 13 END SCREEN (long video, last 20 s): the closing question stays the last on-screen text
const end: React.FC<SetProps> = ({ f }) => <EndScreen f={f} fps={30} question="Would you have kept listening to the voices?" />;

export const SETS: Record<string, React.FC<SetProps>> = { glass, recorder, corridor, chamber, chambercu, wallhit, ghostbed, relatives, child, lastlook, flatline, credit, end };
void GHOSTS; void Dust; void LightPool; void NightMask; void ease;
