import React from 'react';
import type { SetProps } from './Player';
import { CAST, FullPerson, CloseUp } from './Cast';
import { Tag } from './kits/Explain';
import { Floor, Window, Door, Dust, LightPool, NightMask } from './kits/Interior';
import { LyingPerson } from './kits/Lying';
import { BloodPool, Spatter, Stain } from './kits/Blood';
import {
  PAL, Defs, ease, Cold, Warm, Moon, Candle,
  MaskThing, Robed, BlackTears, Lantern, NotebookPage, RED, BlueMask,
} from './Trust';

const W = 1080, H = 1920, GND = 1500;
const E = CAST.sam, J = CAST.noah, EL = CAST.mira, OFF = CAST.dale;

const VWall: React.FC<{ fill?: string }> = ({ fill = PAL.wall }) => (
  <g><rect x={0} y={0} width={W} height={GND} fill={fill} />
    {Array.from({ length: 8 }).map((_, i) => <path key={i} d={`M${i * 150},0 V${GND}`} stroke={PAL.wallInk} strokeWidth={2} opacity={0.25} />)}
    <rect x={0} y={GND} width={W} height={H - GND} fill={PAL.floor} /><rect x={0} y={GND} width={W} height={6} fill={PAL.trim} /></g>
);

// 1 LIBRARY (vertical)
const rlibrary: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const g = 0.5 + 0.5 * Math.sin(f / 9); const p = ease(t / len);
  const n = v.n ?? 1;

  // ANGLE A (n=3, 50): narrow vertical bookshelf aisle
  if (n === 3 || n === 50) {
    return (
      <g><Defs /><Cold>
        <rect x={0} y={0} width={W} height={H} fill="#090d16" />
        <rect x={0} y={100} width={300} height={GND - 100} fill="#141c28" stroke="#080c12" strokeWidth={6} />
        {Array.from({ length: 9 }).map((_, r) => <rect key={r} x={10} y={140 + r * 140} width={280} height={12} fill="#0d141e" />)}
        <rect x={780} y={100} width={300} height={GND - 100} fill="#141c28" stroke="#080c12" strokeWidth={6} />
        {Array.from({ length: 9 }).map((_, r) => <rect key={r} x={790} y={140 + r * 140} width={280} height={12} fill="#0d141e" />)}
        <polygon points={`300,${GND} 780,${GND} 620,400 460,400`} fill="#121824" />
        <rect x={470} y={260} width={140} height={280} fill="#1a2e42" stroke="#060c12" strokeWidth={6} />
        <LightPool x={540} y={480} rx={280} ry={220} c="#8fd4e6" o={0.35} />
        <FullPerson s={E} x={540} y={GND - 20} k={0.46} f={f} view="three" face={-1} expr={v.expr ?? 'fear'} turn={-0.3} motion={{ type: 'idle' }} />
        <Dust x={60} y={200} w={960} h={1100} f={f} n={16} />
      </Cold><NightMask W={W} H={H} x={540} y={900} r={1050} o={0.4} c="#04060a" /></g>
    );
  }

  // ANGLE B (n=51): Study carrel with green reading lamp
  if (n === 51) {
    return (
      <g><Defs /><Cold>
        <rect x={0} y={0} width={W} height={H} fill="#0b121c" />
        <rect x={140} y={320} width={800} height={GND - 320} fill="#182436" stroke="#0a0f16" strokeWidth={8} />
        <rect x={180} y={980} width={720} height={40} fill="#3e2a1c" />
        <line x1={540} y1={980} x2={540} y2={640} stroke="#101824" strokeWidth={10} />
        <ellipse cx={360} cy={660} rx={90} ry={40} fill="#248a60" />
        <LightPool x={360} y={880} rx={360} ry={240} c="#6ae0a4" o={0.4} />
        <FullPerson s={E} x={420} y={GND} k={0.48} f={f} view="three" face={1} expr={v.expr ?? 'fear'} motion={{ type: 'sit' }} />
        <Dust x={60} y={200} w={960} h={1100} f={f} n={14} />
      </Cold><NightMask W={W} H={H} x={540} y={900} r={1050} o={0.36} c="#06080e" /></g>
    );
  }

  // Default wide desk (n=1, 4)
  return (
    <g><Defs /><Cold>
      <VWall fill="#2c3340" />
      {[70, 300, 760].map((x, i) => <g key={i}><rect x={x} y={260} width={200} height={GND - 260} fill={PAL.wallD} stroke="#10141c" strokeWidth={4} />
        {Array.from({ length: 6 }).map((_, r) => Array.from({ length: 9 }).map((_, b) => <rect key={b} x={x + 14 + b * 20} y={300 + r * 120} width={16} height={70} fill={['#5a6472', '#45506a', '#6a5a4a'][(r + b) % 3]} />))}</g>)}
      <rect x={120} y={1120} width={840} height={40} fill={PAL.wood} /><rect x={360} y={840} width={360} height={240} rx={8} fill="#0a1016" stroke="#2a3240" strokeWidth={6} />
      <rect x={380} y={860} width={320} height={200} fill="#17384a" opacity={0.5 + 0.5 * g} />{Array.from({ length: 6 }).map((_, r) => <rect key={r} x={400} y={880 + r * 28} width={220 - (r % 3) * 50} height={7} fill="#7fd4e6" opacity={0.6} />)}
      <LightPool x={540} y={980} rx={500} ry={300} c="#8fd4e6" o={0.16 + 0.06 * g} />
      <FullPerson s={E} x={560} y={GND} k={0.5} f={f} view="three" face={-1} expr={v.expr ?? 'worry'} turn={0.2 - 0.5 * p} motion={{ type: 'idle' }} />
      {v.watch && <rect x={70} y={300} width={170} height={GND - 300} fill="#05070b" opacity={0.7} />}
      {v.tag && <Tag at={[220, 420]} to={[360, 320]} text="WATCHED" f={t} t0={0.7} red />}
      <Dust x={60} y={200} w={960} h={1100} f={f} n={16} />
    </Cold><NightMask W={W} H={H} x={540} y={900} r={1050} o={0.36} c="#06080e" /></g>
  );
};

// 2 COMMON (vertical)
const rcommon: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const g = 0.5 + 0.5 * Math.sin(f / 7); const who = v.who ?? 'both';
  const n = v.n ?? 7;

  // ANGLE A (n=9): Looking over shoulder at glowing TV console
  if (n === 9) {
    return (
      <g><Defs /><Warm>
        <rect x={0} y={0} width={W} height={H} fill="#1c1612" />
        <rect x={0} y={GND} width={W} height={H - GND} fill="#241a14" />
        <rect x={60} y={540} width={460} height={420} rx={16} fill="#080c10" stroke="#1c2634" strokeWidth={8} />
        <rect x={80} y={560} width={420} height={380} fill="#103c4a" opacity={0.7} />
        <LightPool x={290} y={750} rx={420} ry={360} c="#6ae0d4" o={0.35} />
        <FullPerson s={J} x={740} y={GND} k={0.5} f={f} view="three" face={-1} expr={v.jexpr ?? 'sad'} motion={{ type: 'sit' }} />
        <Dust x={60} y={200} w={960} h={1100} f={f} n={14} />
      </Warm><NightMask W={W} H={H} x={540} y={900} r={1050} o={0.32} c="#08080e" /></g>
    );
  }

  // ANGLE B (n=55): Night dorm window with cold moonlight, small warm lamp on side table
  if (n === 55) {
    return (
      <g><Defs /><Warm>
        <rect x={0} y={0} width={W} height={H} fill="#141822" />
        <rect x={0} y={GND} width={W} height={H - GND} fill="#1a1e28" />
        <rect x={520} y={260} width={460} height={520} fill="#080c14" stroke="#222c3e" strokeWidth={8} />
        <circle cx={750} cy={480} r={90} fill="#a8c8e8" opacity={0.4} />
        <LightPool x={750} y={500} rx={400} ry={300} c="#9fc0ff" o={0.25} />
        <rect x={80} y={940} width={220} height={300} fill="#3a2818" />
        <ellipse cx={190} cy={880} rx={45} ry={30} fill="#ffd27a" />
        <LightPool x={190} y={880} rx={260} ry={200} c="#ffd27a" o={0.35} />
        <FullPerson s={J} x={540} y={GND} k={0.48} f={f} view="three" face={-1} expr={v.jexpr ?? 'neutral'} motion={{ type: 'sit' }} />
        <Dust x={60} y={200} w={960} h={1100} f={f} n={14} />
      </Warm><NightMask W={W} H={H} x={540} y={900} r={1050} o={0.35} c="#06080e" /></g>
    );
  }

  // ANGLE C (n=52): Warm couch arm close-in
  if (n === 52) {
    return (
      <g><Defs /><Warm>
        <rect x={0} y={0} width={W} height={H} fill="#241a14" />
        <rect x={0} y={GND} width={W} height={H - GND} fill="#2e2016" />
        <rect x={80} y={840} width={920} height={440} rx={28} fill="#515e7c" stroke="#2a3240" strokeWidth={8} />
        <LightPool x={540} y={800} rx={480} ry={320} c="#ffd27a" o={0.3} />
        <FullPerson s={E} x={500} y={GND} k={0.52} f={f} view="three" face={1} expr={v.expr ?? 'smile'} motion={{ type: 'sit' }} />
        <Dust x={60} y={200} w={960} h={1100} f={f} n={14} />
      </Warm><NightMask W={W} H={H} x={540} y={900} r={1050} o={0.3} c="#0a0a12" /></g>
    );
  }

  // Default wide couch (n=5, 7)
  return (
    <g><Defs /><Warm>
      <VWall />
      <rect x={640} y={560} width={400} height={280} rx={10} fill="#07090d" stroke="#2a3240" strokeWidth={6} /><rect x={658} y={578} width={364} height={244} fill="#14415a" opacity={0.55 + 0.45 * g} />
      <rect x={120} y={1180} width={320} height={28} fill={PAL.wood} /><rect x={160} y={1140} width={150} height={34} fill="#b8783a" stroke="#6a3a18" strokeWidth={4} />
      <rect x={120} y={1020} width={560} height={260} rx={26} fill="#45506a" stroke="#242b3a" strokeWidth={6} /><rect x={140} y={960} width={520} height={90} rx={22} fill="#515e7c" />
      <LightPool x={840} y={700} rx={360} ry={260} c="#7fe0d0" o={0.12} /><LightPool x={300} y={300} rx={300} ry={240} c="#ffd27a" o={0.16} />
      {(who === 'both' || who === 'ethan') && <FullPerson s={E} x={360} y={GND} k={0.44} f={f} view="three" face={1} expr={v.expr ?? 'smile'} motion={{ type: 'sit' }} />}
      {(who === 'both' || who === 'jack') && <FullPerson s={J} x={640} y={GND} k={0.44} f={f} view="three" face={-1} expr={v.jexpr ?? 'smile'} motion={{ type: 'sit' }} />}
      <Dust x={60} y={200} w={960} h={1100} f={f} n={14} />
    </Warm><NightMask W={W} H={H} x={540} y={900} r={1050} o={0.3} c="#0a0a12" /></g>
  );
};

// 3 CAFETERIA (vertical)
const rcafeteria: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const p = ease(t / len);
  const n = v.n ?? 10;

  // ANGLE A (n=54): Food service counter with fluorescent tube and stainless rail
  if (n === 54) {
    return (
      <g><Defs /><Cold>
        <rect x={0} y={0} width={W} height={H} fill="#18202c" />
        <rect x={0} y={GND} width={W} height={H - GND} fill="#1e2634" />
        <rect x={100} y={180} width={880} height={40} rx={12} fill="#6ee4f0" />
        <LightPool x={540} y={300} rx={540} ry={300} c="#6ee4f0" o={0.35} />
        <rect x={60} y={860} width={960} height={120} fill="#708294" stroke="#222e3c" strokeWidth={8} />
        {[140, 420, 700].map((x, i) => <rect key={i} x={x} y={780} width={220} height={70} rx={8} fill="#9ab0c4" stroke="#222e3c" strokeWidth={5} />)}
        <FullPerson s={J} x={520} y={GND} k={0.5} f={f} view="three" face={1} expr="stern" motion={{ type: 'point' }} />
        <Dust x={60} y={200} w={960} h={1100} f={f} n={12} />
      </Cold><NightMask W={W} H={H} x={540} y={900} r={1080} o={0.3} c="#0a0e14" /></g>
    );
  }

  // ANGLE B (n=12): Wide cafeteria tables with quad window in background
  if (n === 12) {
    return (
      <g><Defs /><Cold>
        <rect x={0} y={0} width={W} height={H} fill="#141c26" />
        <rect x={160} y={220} width={760} height={480} fill="#080e16" stroke="#2a3848" strokeWidth={8} />
        <LightPool x={540} y={460} rx={480} ry={320} c="#8fd4e6" o={0.25} />
        <polygon points={`60,${GND} 1020,${GND} 840,1100 240,1100`} fill="#3a4858" stroke="#18222e" strokeWidth={6} />
        <FullPerson s={EL} x={780} y={GND} k={0.46} f={f} view="three" face={-1} expr="shock" motion={{ type: 'recoil' }} uid="rcaf-st12" />
        <FullPerson s={J} x={360} y={GND} k={0.48} f={f} view="three" face={1} expr="stern" motion={{ type: 'point' }} />
        {v.tag && <Tag at={[420, 520]} to={[620, 360]} text="NOT MY FRIEND" f={t} t0={0.7} red size={30} />}
        <Dust x={60} y={200} w={960} h={1100} f={f} n={12} />
      </Cold><NightMask W={W} H={H} x={540} y={900} r={1080} o={0.3} c="#0a0e14" /></g>
    );
  }

  // Default wide angle (n=10)
  return (
    <g><Defs /><Cold>
      <VWall fill="#2e3542" />
      <rect x={120} y={260} width={420} height={110} fill="#10151e" stroke="#2a3140" strokeWidth={5} /><text x={330} y={336} textAnchor="middle" fontFamily="Lora" fontSize={56} fill="#9fb0c4">TODAY</text>
      <rect x={80} y={980} width={920} height={60} fill="#8a94a0" stroke="#2a3038" strokeWidth={5} /><rect x={80} y={1040} width={920} height={150} fill="#4a525e" />
      {[160, 360, 560, 760].map((x, i) => <rect key={i} x={x} y={956} width={120} height={24} rx={6} fill="#aeb6c0" stroke="#2a3038" strokeWidth={3} />)}
      <FullPerson s={EL} x={820 + 70 * p} y={GND} k={0.45} f={f} view="three" face={-1} expr="shock" motion={{ type: 'recoil' }} uid="rcaf-st" />
      <FullPerson s={J} x={420} y={GND} k={0.48} f={f} view="three" face={1} expr="stern" turn={0.3 * p} motion={{ type: 'point' }} />
      {v.tag && <Tag at={[420, 520]} to={[620, 360]} text="NOT MY FRIEND" f={t} t0={0.7} red size={30} />}
      <Dust x={60} y={200} w={960} h={1100} f={f} n={12} />
    </Cold><NightMask W={W} H={H} x={540} y={900} r={1080} o={0.3} c="#0a0e14" /></g>
  );
};

// 4 HALL (vertical)
const rhall: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const p = ease(t / len);
  const n = v.n ?? 8;

  // ANGLE A (n=15): Classroom doorway angle
  if (n === 15) {
    return (
      <g><Defs /><Cold>
        <rect x={0} y={0} width={W} height={H} fill="#141c26" />
        <rect x={0} y={GND} width={W} height={H - GND} fill="#1c2634" />
        <rect x={80} y={240} width={380} height={GND - 240} fill="#0a0e14" stroke="#1c2a38" strokeWidth={8} />
        <FullPerson s={EL} x={380} y={GND} k={0.52} f={f} view="three" face={1} expr={v.expr ?? 'cruel'} turn={0.1} motion={{ type: 'idle' }} />
        <FullPerson s={E} x={840} y={GND} k={0.44} f={f} view="three" face={-1} expr="worry" motion={{ type: 'idle' }} />
        <Dust x={60} y={200} w={960} h={1100} f={f} n={12} />
      </Cold><NightMask W={W} H={H} x={540} y={900} r={1050} o={0.32} c="#06080e" /></g>
    );
  }

  // ANGLE B (n=56): End of dark hallway with illuminated red EXIT sign
  if (n === 56) {
    return (
      <g><Defs /><Cold>
        <rect x={0} y={0} width={W} height={H} fill="#0b0e14" />
        <polygon points={`0,0 1080,0 720,600 360,600`} fill="#121822" />
        <polygon points={`0,${H} 1080,${H} 720,${GND - 200} 360,${GND - 200}`} fill="#18202c" />
        <rect x={440} y={480} width={200} height={60} rx={8} fill="#c82424" />
        <text x={540} y={525} textAnchor="middle" fontFamily="sans-serif" fontWeight="900" fontSize={36} fill="#ffffff">EXIT</text>
        <LightPool x={540} y={540} rx={340} ry={240} c="#ff5050" o={0.4} />
        <FullPerson s={EL} x={540} y={GND - 100} k={0.42} f={f} view="three" face={1} expr={v.expr ?? 'cruel'} motion={{ type: 'idle' }} />
        <Dust x={60} y={200} w={960} h={1100} f={f} n={12} />
      </Cold><NightMask W={W} H={H} x={540} y={900} r={1050} o={0.38} c="#06080e" /></g>
    );
  }

  // ANGLE C (n=13 || n=53): Stairwell landing with green metal handrail
  if (n === 13 || n === 53) {
    return (
      <g><Defs /><Cold>
        <rect x={0} y={0} width={W} height={H} fill="#18222a" />
        <rect x={0} y={GND} width={W} height={H - GND} fill="#202a34" />
        <line x1={0} y1={920} x2={1080} y2={420} stroke="#2e684e" strokeWidth={16} />
        {Array.from({ length: 6 }).map((_, i) => <line key={i} x1={150 + i * 160} y1={850 - i * 75} x2={150 + i * 160} y2={GND} stroke="#2e684e" strokeWidth={10} />)}
        <LightPool x={540} y={600} rx={480} ry={360} c="#80d0b0" o={0.25} />
        <FullPerson s={E} x={360} y={GND} k={0.48} f={f} view="three" face={1} expr="worry" motion={{ type: 'idle' }} />
        <FullPerson s={EL} x={760} y={GND} k={0.48} f={f} view="three" face={-1} expr={v.expr ?? 'smile'} motion={{ type: 'idle' }} />
        {v.tag && <Tag at={[760, 520]} to={[520, 360]} text="BETTER THAN EVER" f={t} t0={0.8} red size={30} />}
        <Dust x={60} y={200} w={960} h={1100} f={f} n={12} />
      </Cold><NightMask W={W} H={H} x={540} y={900} r={1050} o={0.32} c="#0a0e14" /></g>
    );
  }

  // ANGLE D (n=57): Trophy display case with spotlights
  if (n === 57) {
    return (
      <g><Defs /><Cold>
        <rect x={0} y={0} width={W} height={H} fill="#101620" />
        <rect x={120} y={240} width={840} height={800} fill="#0a0f16" stroke="#263444" strokeWidth={8} />
        <LightPool x={540} y={400} rx={400} ry={260} c="#ffd700" o={0.22} />
        <FullPerson s={EL} x={540} y={GND} k={0.48} f={f} view="three" face={-1} expr="neutral" motion={{ type: 'idle' }} />
        <Dust x={60} y={200} w={960} h={1100} f={f} n={12} />
      </Cold><NightMask W={W} H={H} x={540} y={900} r={1050} o={0.35} c="#080a10" /></g>
    );
  }

  // Default wide lockers (n=8)
  return (
    <g><Defs /><Cold>
      <VWall fill="#2c3744" />
      {Array.from({ length: 7 }).map((_, i) => <rect key={i} x={60 + i * 150} y={300} width={130} height={420} fill={i % 2 ? '#3a5060' : '#365466'} stroke="#182028" strokeWidth={4} />)}
      <rect x={640} y={320} width={360} height={240} fill="#6a5a3e" stroke="#3a2e18" strokeWidth={7} />
      <FullPerson s={E} x={340} y={GND} k={0.46} f={f} view="three" face={1} expr="worry" motion={{ type: 'idle' }} />
      <FullPerson s={EL} x={740 - 40 * p} y={GND} k={0.46} f={f} view="three" face={-1} expr={v.expr ?? 'smile'} turn={-0.2} motion={{ type: 'idle' }} />
      {v.tag && <Tag at={[740, 520]} to={[520, 360]} text="BETTER THAN EVER" f={t} t0={0.8} red size={30} />}
      <Dust x={60} y={200} w={960} h={1100} f={f} n={12} />
    </Cold><NightMask W={W} H={H} x={540} y={900} r={1050} o={0.3} c="#0a0e14" /></g>
  );
};

// 5 PHONE (vertical)
const rphone: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const g = 0.6 + 0.4 * Math.sin(f / 11);
  const n = v.n ?? 16;

  // ANGLE A (n=16): Retro wall phone close
  if (n === 16) {
    return (
      <g><Defs /><Warm>
        <rect x={0} y={0} width={W} height={H} fill="#241a14" />
        <rect x={0} y={GND} width={W} height={H - GND} fill="#2c1e14" />
        <rect x={120} y={380} width={280} height={460} rx={16} fill="#1a120c" stroke="#483220" strokeWidth={8} />
        <circle cx={260} cy={520} r={64} fill="#0d0806" stroke="#cca050" strokeWidth={6} />
        <path d="M 220 780 Q 180 880 240 940 Q 280 1000 220 1060" stroke="#0d0806" strokeWidth={12} fill="none" />
        <LightPool x={260} y={560} rx={420} ry={360} c="#ffd080" o={0.35} />
        <FullPerson s={E} x={680} y={GND} k={0.5} f={f} view="three" face={-1} expr={v.expr ?? 'fear'} motion={{ type: 'sit' }} />
        <Dust x={60} y={200} w={960} h={1100} f={f} n={12} />
      </Warm><NightMask W={W} H={H} x={480} y={900} r={1020} o={0.34} c="#08080e" /></g>
    );
  }

  // ANGLE B (n=58): Bedside nightstand with rotary phone and red lamp
  if (n === 58) {
    return (
      <g><Defs /><Warm>
        <rect x={0} y={0} width={W} height={H} fill="#1c1410" />
        <rect x={0} y={GND} width={W} height={H - GND} fill="#221612" />
        <rect x={140} y={920} width={340} height={380} fill="#3a2216" stroke="#1c100a" strokeWidth={6} />
        <circle cx={310} cy={760} r={60} fill="#b82824" />
        <LightPool x={310} y={820} rx={380} ry={260} c="#ff5a4a" o={0.4} />
        <FullPerson s={E} x={680} y={GND} k={0.48} f={f} view="three" face={-1} expr={v.expr ?? 'sad'} motion={{ type: 'sit' }} />
        <Dust x={60} y={200} w={960} h={1100} f={f} n={12} />
      </Warm><NightMask W={W} H={H} x={480} y={900} r={1020} o={0.35} c="#08080e" /></g>
    );
  }

  // ANGLE C (n=59): Phone booth with glass bifold door
  if (n === 59) {
    return (
      <g><Defs /><Warm>
        <rect x={0} y={0} width={W} height={H} fill="#121820" />
        <rect x={160} y={240} width={760} height={GND - 240} fill="#0a1016" stroke="#243444" strokeWidth={10} />
        <LightPool x={540} y={480} rx={440} ry={300} c="#ffe290" o={0.32} />
        <FullPerson s={E} x={540} y={GND} k={0.46} f={f} view="three" face={1} expr={v.expr ?? 'worry'} motion={{ type: 'sit' }} />
        <Dust x={60} y={200} w={960} h={1100} f={f} n={12} />
      </Warm><NightMask W={W} H={H} x={480} y={900} r={1020} o={0.35} c="#080a10" /></g>
    );
  }

  // Default window phone (n=17, 18)
  return (
    <g><Defs /><Warm>
      <VWall />
      <Window x={640} y={300} w={360} h={400} f={f} P={PAL} moon curtains />
      <rect x={560} y={1140} width={460} height={36} fill={PAL.wood} /><rect x={700} y={1010} width={220} height={120} rx={8} fill="#0a1016" stroke="#2a3240" strokeWidth={5} /><rect x={716} y={1024} width={188} height={92} fill="#17384a" opacity={0.5} />
      <LightPool x={820} y={1120} rx={360} ry={280} c="#ffe6b8" o={0.18} />
      <FullPerson s={E} x={420} y={GND} k={0.46} f={f} view="three" face={1} expr={v.expr ?? 'worry'} motion={{ type: 'sit' }} />
      <ellipse cx={480} cy={820} rx={70} ry={100} fill="#bfe0ff" opacity={0.18 * g} />
      {v.tag && <Tag at={[460, 700]} to={[720, 500]} text="HIS VOICE SHOOK" f={t} t0={0.7} size={28} />}
      <Dust x={60} y={200} w={960} h={1100} f={f} n={12} />
    </Warm><NightMask W={W} H={H} x={480} y={900} r={1020} o={0.34} c="#080a10" /></g>
  );
};

// 6 APARTMENT (vertical)
const rapartment: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const dark = !!v.dark; const Lgt = dark ? Moon : Warm;
  const n = v.n ?? 19;

  // ANGLE A (n=22): Desk angle with red reading lamp, dark window
  if (n === 22) {
    return (
      <g><Defs /><Moon>
        <rect x={0} y={0} width={W} height={H} fill="#0d1016" />
        <rect x={0} y={GND} width={W} height={H - GND} fill="#141820" />
        <rect x={120} y={280} width={420} height={460} fill="#06090e" stroke="#1c2432" strokeWidth={8} />
        <rect x={160} y={880} width={760} height={40} fill="#322218" />
        <ellipse cx={320} cy={760} rx={70} ry={36} fill="#b82622" />
        <LightPool x={320} y={860} rx={380} ry={260} c="#ff5a4a" o={0.38} />
        <FullPerson s={J} x={660} y={GND} k={0.5} f={f} view="three" face={-1} expr={v.jexpr ?? 'fear'} motion={{ type: 'sit' }} />
        {v.tears && <BlackTears x={620} y={830} k={0.8} f={f} n={2} />}
        {v.tears && <BlackTears x={700} y={830} k={0.8} f={f + 7} n={2} />}
        {v.tag && <Tag at={[660, 640]} to={[760, 460]} text="BLACK TEARS" f={t} t0={0.7} red size={30} />}
        <Dust x={60} y={200} w={960} h={1100} f={f} n={12} />
      </Moon><NightMask W={W} H={H} x={540} y={900} r={1050} o={0.65} c="#06080e" /></g>
    );
  }

  // ANGLE B (n=61): Front apartment door from inside with chain latch
  if (n === 61) {
    return (
      <g><Defs /><Moon>
        <rect x={0} y={0} width={W} height={H} fill="#0a0c12" />
        <rect x={360} y={420} width={520} height={GND - 420} fill="#241a14" stroke="#0e0a08" strokeWidth={10} />
        <circle cx={420} cy={820} r={16} fill="#cca860" />
        <line x1={420} y1={820} x2={480} y2={820} stroke="#cca860" strokeWidth={8} />
        <LightPool x={620} y={800} rx={420} ry={320} c="#6080a8" o={0.25} />
        <FullPerson s={J} x={300} y={GND} k={0.48} f={f} view="three" face={1} expr={v.jexpr ?? 'fear'} motion={{ type: 'reach' }} />
        <Dust x={60} y={200} w={960} h={1100} f={f} n={12} />
      </Moon><NightMask W={W} H={H} x={540} y={900} r={1050} o={0.68} c="#06080e" /></g>
    );
  }

  // ANGLE C (n=60): Kitchenette counter
  if (n === 60) {
    return (
      <g><Defs /><Warm>
        <rect x={0} y={0} width={W} height={H} fill="#201a14" />
        <rect x={140} y={860} width={800} height={GND - 860} fill="#32261c" stroke="#160e0a" strokeWidth={6} />
        <LightPool x={540} y={700} rx={460} ry={280} c="#ffd080" o={0.3} />
        <FullPerson s={J} x={540} y={GND} k={0.46} f={f} view="three" face={-1} expr={v.jexpr ?? 'neutral'} motion={{ type: 'sit' }} />
        <Dust x={60} y={200} w={960} h={1100} f={f} n={12} />
      </Warm><NightMask W={W} H={H} x={540} y={900} r={1050} o={0.45} c="#08080e" /></g>
    );
  }

  // Default wide living room (n=19, 20)
  return (
    <g><Defs /><Lgt>
      <VWall fill={dark ? '#12161e' : PAL.wall} />
      <Window x={120} y={300} w={300} h={360} f={f} P={PAL} moon curtains shaft={dark ? [240, GND, 280] : null} />
      <Door x={840} y={GND} w={260} h={620} P={PAL} id="rm" light={dark ? '#334' : null} />
      <g transform={`translate(${260},${1120})`}><rect x={-6} y={-80} width={12} height={80} fill="#2a2024" /><path d="M-60,-140 L60,-140 L34,-80 L-34,-80Z" fill="#7a2a28" stroke="#3a1414" strokeWidth={4} />{!dark && <ellipse cx={0} cy={-106} rx={66} ry={30} fill={RED} opacity={0.4} />}</g>
      {!dark && <LightPool x={260} y={1140} rx={380} ry={300} c="#ff8a6a" o={0.16} />}
      <rect x={300} y={1040} width={560} height={240} rx={26} fill="#3a4154" stroke="#20283a" strokeWidth={6} /><rect x={320} y={980} width={520} height={84} rx={22} fill="#454e64" />
      <FullPerson s={J} x={560} y={GND} k={0.44} f={f} view="three" face={-1} expr={v.jexpr ?? (dark ? 'fear' : 'sad')} motion={{ type: v.reach ? 'reach' : 'sit' }} />
      {v.tears && <BlackTears x={520} y={830} k={0.8} f={f} n={2} />}
      {v.tears && <BlackTears x={600} y={830} k={0.8} f={f + 7} n={2} />}
      {v.tag && <Tag at={[560, 640]} to={[760, 460]} text="BLACK TEARS" f={t} t0={0.7} red size={30} />}
      <Dust x={60} y={200} w={960} h={1100} f={f} n={12} />
    </Lgt><NightMask W={W} H={H} x={540} y={900} r={1050} o={dark ? 0.68 : 0.52} c="#06080e" /></g>
  );
};

// 7 DOOR (vertical)
const rdoor: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const p = ease(t / len);
  return (
    <g><Defs /><Moon>
      <rect x={0} y={0} width={W} height={H} fill="#13171f" />
      <Floor W={W} floorY={GND} H={H} P={PAL} vx={W * 0.5} />
      <rect x={300} y={640} width={420} height={860} fill={PAL.woodD} stroke="#120d0a" strokeWidth={8} /><rect x={340} y={690} width={340} height={360} fill="none" stroke="#0e0a08" strokeWidth={6} /><circle cx={670} cy={1120} r={14} fill="#c8b070" />
      <rect x={740} y={700} width={150} height={760} fill="#4a5a68" opacity={0.7} stroke="#1a2028" strokeWidth={6} />
      <g opacity={0.6 + 0.2 * p}><ellipse cx={815} cy={920} rx={52} ry={66} fill="#0b0f16" /><rect x={775} y={980} width={80} height={320} rx={30} fill="#0b0f16" /></g>
      <circle cx={180} cy={520} r={26} fill="#ffe6b8" opacity={0.5} /><ellipse cx={180} cy={1000} rx={280} ry={460} fill="#ffe6b8" opacity={0.06} />
      <Tag at={[815, 940]} to={[560, 520]} text="THEY ARE WAITING" f={t} t0={0.8} red size={30} />
      <Dust x={60} y={200} w={960} h={1100} f={f} n={10} />
    </Moon><NightMask W={W} H={H} x={560} y={900} r={1050} o={0.38} c="#05070c" /></g>
  );
};

// 8 WOODS (vertical)
const rwoods: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const p = ease(t / len); const GY = GND - 20;
  const n = v.n ?? 24;

  // ANGLE A (n=62): Dense snowy birch trunks with cold mist
  if (n === 62) {
    return (
      <g><Defs /><Moon>
        <rect x={0} y={0} width={W} height={H} fill="#0e1624" />
        <circle cx={540} cy={260} r={140} fill="#9fb8e0" opacity={0.3} />
        <rect x={0} y={GY} width={W} height={H - GY} fill="#182026" />
        {[80, 260, 480, 720, 920].map((x, i) => (
          <g key={i}>
            <rect x={x} y={0} width={50} height={GY} fill="#d2dce8" />
            {Array.from({ length: 6 }).map((_, b) => <rect key={b} x={x} y={200 + b * 180 + (i % 2) * 40} width={30} height={12} fill="#141c26" />)}
          </g>
        ))}
        <FullPerson s={J} x={560} y={GY + 90} k={0.46} f={f} view="back" face={-1} expr="fear" motion={{ type: 'run' }} />
        <Dust x={60} y={200} w={960} h={1100} f={f} n={14} c="#cdddf4" />
      </Moon><NightMask W={W} H={H} x={540} y={900} r={1100} o={0.34} c="#04060a" /></g>
    );
  }

  // ANGLE B (n=63): Barbed wire fence across snow path
  if (n === 63) {
    return (
      <g><Defs /><Moon>
        <rect x={0} y={0} width={W} height={H} fill="#0c121e" />
        <rect x={0} y={GY} width={W} height={H - GY} fill="#161c20" />
        <line x1={0} y1={GY - 120} x2={W} y2={GY - 120} stroke="#4a5868" strokeWidth={6} />
        <line x1={0} y1={GY - 240} x2={W} y2={GY - 240} stroke="#4a5868" strokeWidth={6} />
        {[200, 540, 880].map((x, i) => <rect key={i} x={x} y={GY - 360} width={34} height={360} fill="#3a2a1c" stroke="#16100a" strokeWidth={6} />)}
        <LightPool x={540} y={GY - 100} rx={480} ry={260} c="#8cb4d8" o={0.28} />
        <FullPerson s={E} x={480} y={GY + 90} k={0.44} f={f} view="three" face={1} expr="fear" motion={{ type: 'run' }} />
        <Dust x={60} y={200} w={960} h={1100} f={f} n={14} c="#cdddf4" />
      </Moon><NightMask W={W} H={H} x={540} y={900} r={1100} o={0.36} c="#04060a" /></g>
    );
  }

  // Default pine woods (n=24)
  return (
    <g><Defs /><Moon>
      <rect x={0} y={0} width={W} height={H} fill="#16202f" />
      <ellipse cx={300} cy={340} rx={150} ry={150} fill="#9fb8e0" opacity={0.26} /><circle cx={300} cy={340} r={70} fill="#cdddf4" opacity={0.5} />
      {[80, 360, 680, 940].map((x, i) => <g key={i}><rect x={x} y={0} width={44 + (i % 2) * 18} height={GY} fill="#0a0e12" />{Array.from({ length: 6 }).map((_, b) => <path key={b} d={`M${x + 22},${260 + b * 150} l${-80 - b * 10},40 l80,-10Z`} fill="#0b1116" />)}</g>)}
      <rect x={0} y={GY} width={W} height={H - GY} fill="#141a1c" />
      {Array.from({ length: 6 }).map((_, i) => <ellipse key={i} cx={80 + i * 200} cy={GY + 70 + (i % 3) * 40} rx={150} ry={30} fill="#d6e0ea" opacity={0.12} />)}
      {v.run ? <FullPerson s={J} x={560} y={GY + 90} k={0.44} f={f} view="back" face={-1} expr="fear" motion={{ type: 'run' }} />
        : <FullPerson s={E} x={480} y={GY + 90} k={0.44} f={f} view="three" face={1} expr="fear" motion={{ type: 'run' }} />}
      <Dust x={60} y={200} w={960} h={1100} f={f} n={14} c="#cdddf4" />
    </Moon><NightMask W={W} H={H} x={540} y={900} r={1100} o={0.34} c="#04060a" /></g>
  );
};

// 9 CLEARING (vertical)
const rclearing: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const p = ease(t / len); const GY = GND + 40;
  const n = v.n ?? 25;

  // ANGLE A (n=30, 66): Side angle with robed semicircle and low ground lantern
  if (n === 30 || n === 66) {
    return (
      <g><Defs /><Candle>
        <rect x={0} y={0} width={W} height={H} fill="#0e1624" />
        <rect x={0} y={GY} width={W} height={H - GY + 200} fill="#14181c" />
        <Lantern x={540} y={GY + 60} f={f} k={1.2} />
        <Robed x={240} y={GY + 30} k={0.44} f={f} seed={8} bow={0.4} />
        <Robed x={800} y={GY + 40} k={0.44} f={f} seed={9} bow={0.3} />
        <MaskThing x={540 + ((v.px as number) ?? 0)} y={GY} k={0.46} f={f} face={(v.face ?? 1) as 1|-1} pose={(v.pose as any) ?? 'stand'} p={1} tar={v.tar ?? 0.6} free={false} tendrils={v.tend ?? 0.3} />
        <Dust x={60} y={200} w={960} h={1100} f={f} n={12} c="#cdddf4" />
      </Candle><NightMask W={W} H={H} x={540} y={900} r={1050} o={0.35} c="#04060a" /></g>
    );
  }

  // ANGLE B (n=35, 68): Overhead moonlight clearing with stone ring
  if (n === 35 || n === 68) {
    return (
      <g><Defs /><Moon>
        <rect x={0} y={0} width={W} height={H} fill="#080e18" />
        <circle cx={540} cy={340} r={220} fill="#9fb8e0" opacity={0.35} />
        <rect x={0} y={GY - 60} width={W} height={H - GY + 260} fill="#10161a" />
        <ellipse cx={540} cy={GY + 40} rx={440} ry={140} fill="none" stroke="#2a3848" strokeWidth={16} />
        <MaskThing x={540 + ((v.px as number) ?? 0)} y={GY - 40} k={0.48} f={f} face={1} pose="stalk" p={1} tar={0.9} free tendrils={0.4} />
        <Dust x={60} y={200} w={960} h={1100} f={f} n={12} c="#cdddf4" />
      </Moon><NightMask W={W} H={H} x={540} y={900} r={1050} o={0.35} c="#04060a" /></g>
    );
  }

  // Default clearing (n=25, 64)
  return (
    <g><Defs /><Candle>
      <rect x={0} y={0} width={W} height={H} fill="#141d2e" />
      <ellipse cx={820} cy={320} rx={190} ry={190} fill="#9fb8e0" opacity={0.32} /><circle cx={820} cy={320} r={60} fill="#cdddf4" opacity={0.45} />
      {[40, 1000].map((x, i) => <rect key={i} x={x} y={0} width={44} height={GY} fill="#080c10" />)}
      <rect x={0} y={GY} width={W} height={H - GY + 200} fill="#161a1a" />
      <Lantern x={220} y={GY + 70} f={f} k={1.0} /><Lantern x={880} y={GY + 80} f={f + 20} k={1.0} />
      <Robed x={180} y={GY + 40} k={0.42} f={f} seed={1} /><Robed x={900} y={GY + 50} k={0.42} f={f} seed={2} />
      <Robed x={360} y={GY - 40} k={0.3} f={f} seed={3} bow={v.read ? 0.4 : 0} arms={!!v.read} />
      <rect x={500} y={GY - 360} width={110} height={360} fill="#2a2018" stroke="#140d08" strokeWidth={5} /><rect x={464} y={GY - 400} width={182} height={38} fill="#2a2018" />
      <MaskThing x={555 + ((v.px as number) ?? 0)} y={GY} k={0.42} f={f} face={(v.face ?? 1) as 1|-1} pose={(v.pose as any) ?? 'stand'} p={1} tar={v.tar ?? 0.4} free={false} tendrils={v.tend ?? 0} />
      {[-240, -130].map((dy, i) => <rect key={i} x={500} y={GY + dy} width={110} height={16} fill="#1a1510" opacity={0.9} />)}
      {v.unmask && <FullPerson s={EL} x={820 + ((v.px as number) ?? 0)} y={GY} k={0.42} f={f} view="three" face={-1} expr="cruel" motion={{ type: 'idle' }} />}
      {v.tag && <Tag at={[560, 560]} to={[760, 400]} text="IT WAS ELISA" f={t} t0={0.8} red size={30} />}
      <Dust x={60} y={200} w={960} h={1100} f={f} n={12} c="#cdddf4" />
    </Candle><NightMask W={W} H={H} x={540} y={900} r={1050} o={0.34} c="#04060a" /></g>
  );
};

// 10 RITUAL (vertical)
const rritual: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const p = ease(t / len); const GY = GND + 40;
  const n = v.n ?? 27;

  // ANGLE A (n=31, 65): Low angle looking up at mask with moon overhead
  if (n === 31 || n === 65) {
    return (
      <g><Defs /><Candle>
        <rect x={0} y={0} width={W} height={H} fill="#090d16" />
        <circle cx={540} cy={300} r={160} fill="#a8c8e8" opacity={0.35} />
        <rect x={0} y={GY} width={W} height={H - GY + 200} fill="#12161a" />
        <Lantern x={540} y={GY + 60} f={f} k={1.3} />
        <rect x={480} y={GY - 520} width={120} height={520} fill="#241a12" stroke="#100a06" strokeWidth={6} />
        <MaskThing x={540} y={GY} k={0.56} f={f} face={1} pose="stand" p={1} tar={0.85} free={false} tendrils={0.8} />
        <Dust x={60} y={200} w={960} h={1100} f={f} n={10} c="#cdddf4" />
      </Candle><NightMask W={W} H={H} x={540} y={820} r={980} o={0.36} c="#04060a" /></g>
    );
  }

  // Default ritual (n=27, 28)
  return (
    <g><Defs /><Candle>
      <rect x={0} y={0} width={W} height={H} fill="#131b29" />
      <rect x={0} y={GY} width={W} height={H - GY + 200} fill="#15191a" />
      <Lantern x={180} y={GY + 60} f={f} k={1.1} /><Lantern x={900} y={GY + 70} f={f + 14} k={1.1} />
      <Robed x={160} y={GY + 30} k={0.4} f={f} seed={5} bow={0.3} arms /><Robed x={930} y={GY + 40} k={0.4} f={f} seed={6} />
      <rect x={470} y={GY - 460} width={150} height={460} fill="#2a2018" stroke="#140d08" strokeWidth={6} /><rect x={420} y={GY - 510} width={250} height={50} fill="#2a2018" />
      <MaskThing x={545 + ((v.px as number) ?? 0)} y={GY} k={0.52} f={f} face={(v.face ?? 1) as 1|-1} pose={(v.pose as any) ?? 'stand'} p={1} tar={v.tar ?? 0.7} free={false} tendrils={v.tend ?? (0.4 + 0.6 * p)} />
      <Tag at={[545, 420]} to={[760, 300]} text="A BLUE MASK" f={t} t0={0.7} red size={30} />
      <Dust x={60} y={200} w={960} h={1100} f={f} n={10} c="#cdddf4" />
    </Candle><NightMask W={W} H={H} x={540} y={820} r={980} o={0.36} c="#04060a" /></g>
  );
};

// 11 UNLEASHED (vertical)
const runleashed: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const p = ease(t / len); const GY = GND + 40;
  const n = v.n ?? 32;

  // ANGLE A (n=34, 67): Creature crouching low over spattered snow
  if (n === 34 || n === 67) {
    return (
      <g><Defs /><Candle>
        <rect x={0} y={0} width={W} height={H} fill="#0d141e" />
        <rect x={0} y={GY} width={W} height={H - GY + 200} fill="#14181a" />
        <Spatter x={540} y={GY + 20} dir={0} spread={180} size={380} n={36} f={f} t0={0.1} />
        <BloodPool x={540} y={GY + 90} r={260} grow={1} f={f} />
        <MaskThing x={540 + ((v.px as number) ?? 0)} y={GY} k={0.52} f={f} face={-1} pose="crouch" p={v.pp ?? 0.65} tar={0.95} free tendrils={0.5} />
        <Dust x={60} y={200} w={960} h={1100} f={f} n={10} c="#cdddf4" />
      </Candle><NightMask W={W} H={H} x={480} y={860} r={1040} o={0.34} c="#04060a" /></g>
    );
  }

  // ANGLE B (n=36, 71): Looming silhouette against huge moon
  if (n === 36 || n === 71) {
    return (
      <g><Defs /><Candle>
        <rect x={0} y={0} width={W} height={H} fill="#080c14" />
        <circle cx={540} cy={400} r={260} fill="#a8cce8" opacity={0.4} />
        <rect x={0} y={GY} width={W} height={H - GY + 200} fill="#101416" />
        <MaskThing x={540 + ((v.px as number) ?? 0)} y={GY} k={0.58} f={f} face={1} pose="loom" p={v.pp ?? 0.95} tar={1.0} free tendrils={0.9} />
        <Dust x={60} y={200} w={960} h={1100} f={f} n={10} c="#cdddf4" />
      </Candle><NightMask W={W} H={H} x={480} y={860} r={1040} o={0.32} c="#04060a" /></g>
    );
  }

  // Default unleashed (n=32)
  return (
    <g><Defs /><Candle>
      <rect x={0} y={0} width={W} height={H} fill="#131a27" />
      <ellipse cx={260} cy={320} rx={130} ry={130} fill="#9fb8e0" opacity={0.2} /><circle cx={260} cy={320} r={56} fill="#cdddf4" opacity={0.4} />
      <rect x={0} y={GY} width={W} height={H - GY + 200} fill="#14181a" />
      <BloodPool x={420} y={GY + 110} r={220} grow={1} f={f} /><Spatter x={760} y={GY + 40} dir={-0.5} spread={110} size={240} n={26} f={f} t0={0.2} /><Stain x={880} y={GY + 150} r={150} grow={1} />
      <Robed x={900} y={GY + 30} k={0.42} f={f} seed={7} bow={0.5} />
      <MaskThing x={460 + ((v.px as number) ?? 0)} y={GY} k={0.5} f={f} face={1} pose={(v.pose as any) ?? 'stalk'} p={v.pp ?? (f / 60)} tar={0.9} free tendrils={0.3} />
      <Tag at={[460, 440]} to={[470, 300]} text="YOU MADE HIM MAD" f={t} t0={0.6} red size={30} />
      <Dust x={60} y={200} w={960} h={1100} f={f} n={10} c="#cdddf4" />
    </Candle><NightMask W={W} H={H} x={480} y={860} r={1040} o={0.32} c="#04060a" /></g>
  );
};

// 12 HOSPITAL (vertical)
const rhospital: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const trace = (() => { let d = 'M160,560'; for (let x = 160; x <= 860; x += 10) { const a = Math.sin((x + f * 4) / 18) * (x % 120 < 16 ? 40 : 6); d += ` L${x},${560 + a}`; } return d; })();
  const n = v.n ?? 34;

  // ANGLE A (n=69, 70): Observation window with yellow biohazard / restriction sign
  if (n === 69 || n === 70) {
    return (
      <g><Defs /><Cold>
        <rect x={0} y={0} width={W} height={H} fill="#0e181e" />
        <rect x={140} y={260} width={800} height={520} fill="#061214" stroke="#224048" strokeWidth={10} />
        <rect x={180} y={300} width={180} height={60} rx={6} fill="#f4c430" />
        <text x={270} y={342} textAnchor="middle" fontFamily="sans-serif" fontWeight="900" fontSize={26} fill="#111111">ICU RESTRICTED</text>
        <LightPool x={540} y={520} rx={480} ry={300} c="#40e0a0" o={0.25} />
        <LyingPerson s={E} x={540} surfaceY={GND - 50} k={0.46} f={f} expr={v.expr ?? 'sad'} head={-1} sheet sheetC={PAL.sheet} uid="rhosp-obs" fit={760} />
        <Dust x={60} y={200} w={960} h={1100} f={f} n={10} />
      </Cold><NightMask W={W} H={H} x={540} y={900} r={1080} o={0.34} c="#0a0e14" /></g>
    );
  }

  // ANGLE B (n=72): Close IV drip stand and flatline monitor
  if (n === 72) {
    return (
      <g><Defs /><Cold>
        <rect x={0} y={0} width={W} height={H} fill="#0a1216" />
        <rect x={100} y={360} width={420} height={260} rx={12} fill="#040c0e" stroke="#163438" strokeWidth={6} />
        <line x1={120} y1={490} x2={500} y2={490} stroke="#ff4040" strokeWidth={4} />
        <line x1={740} y1={100} x2={740} y2={GND} stroke="#8aa0a8" strokeWidth={10} />
        <ellipse cx={740} cy={280} rx={40} ry={70} fill="#c8e4ea" opacity={0.6} stroke="#608088" strokeWidth={4} />
        <LightPool x={540} y={600} rx={460} ry={320} c="#60e0a8" o={0.28} />
        <LyingPerson s={E} x={540} surfaceY={GND - 50} k={0.48} f={f} expr="neutral" head={-1} sheet sheetC={PAL.sheet} uid="rhosp-iv" fit={760} />
        <Dust x={60} y={200} w={960} h={1100} f={f} n={10} />
      </Cold><NightMask W={W} H={H} x={540} y={900} r={1080} o={0.32} c="#0a0e14" /></g>
    );
  }

  // Default hospital (n=34, 36)
  return (
    <g><Defs /><Cold>
      <VWall fill="#2e3542" />
      <Window x={640} y={300} w={360} h={320} f={f} P={PAL} moon={false} curtains={false} />
      <rect x={120} y={440} width={760} height={240} rx={10} fill="#0a1016" stroke="#2a3240" strokeWidth={6} /><rect x={140} y={460} width={720} height={200} fill="#061512" /><path d={trace} stroke="#78e0a8" strokeWidth={4} fill="none" strokeLinejoin="round" />
      <rect x={120} y={GND - 40} width={840} height={40} fill="#9aa6b2" />
      <LyingPerson s={E} x={540} surfaceY={GND - 50} k={0.5} f={f} expr={v.expr ?? 'sad'} head={-1} sheet sheetC={PAL.sheet} uid="rhosp" fit={760} />
      <Stain x={640} y={GND - 120} r={64} grow={1} o={0.7} />
      {v.tag && <Tag at={[640, GND - 120]} to={[760, 520]} text="A KIDNEY GONE" f={t} t0={0.8} red size={28} />}
      <Dust x={60} y={200} w={960} h={1100} f={f} n={10} />
    </Cold><NightMask W={W} H={H} x={540} y={900} r={1080} o={0.3} c="#0a0e14" /></g>
  );
};

// 13 FACE (vertical): with environmental backgrounds
const rface: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const p = ease(t / len); const who = v.who === 'jack' ? J : v.who === 'elisa' ? EL : E; const Lgt = v.warm ? Warm : Cold;
  const n = v.n ?? 2;

  const isLibrary = n === 2;
  const isCommon = n === 6;
  const isHall = n === 14;
  const isPhone = n === 17;
  const isApartment = n === 21;
  const isWoods = n === 26;
  const isRitual = n === 29 || n === 33;
  const isHospital = n === 35;

  return (
    <g><Defs /><Lgt>
      <rect x={0} y={0} width={W} height={H} fill={v.warm ? '#1a1510' : '#141a22'} />

      {/* Library vertical face backdrop */}
      {isLibrary && (
        <g>
          <rect x={40} y={160} width={280} height={1200} fill="#182230" stroke="#0a0e16" strokeWidth={6} />
          {Array.from({ length: 8 }).map((_, r) => <rect key={r} x={50} y={200 + r * 140} width={260} height={10} fill="#0d141e" />)}
          <rect x={720} y={300} width={320} height={380} fill="#103c4e" opacity={0.75} rx={12} />
          <LightPool x={880} y={500} rx={360} ry={280} c="#62d8ea" o={0.32} />
        </g>
      )}

      {/* Common room vertical face backdrop */}
      {isCommon && (
        <g>
          <rect x={0} y={0} width={W} height={H} fill="#221812" />
          <rect x={600} y={240} width={420} height={340} fill="#123648" stroke="#1c485c" strokeWidth={6} />
          <LightPool x={800} y={420} rx={420} ry={280} c="#6ae0d4" o={0.35} />
        </g>
      )}

      {/* Hallway face backdrop */}
      {isHall && (
        <g>
          <rect x={0} y={0} width={W} height={H} fill="#16202a" />
          {Array.from({ length: 5 }).map((_, i) => <rect key={i} x={80 + i * 190} y={220} width={160} height={600} fill="#283848" stroke="#0e141c" strokeWidth={6} />)}
          <LightPool x={540} y={440} rx={480} ry={280} c="#80c8e8" o={0.28} />
        </g>
      )}

      {/* Phone face backdrop */}
      {isPhone && (
        <g>
          <rect x={0} y={0} width={W} height={H} fill="#221610" />
          <path d="M 220 200 Q 140 500 240 800 Q 300 1100 200 1400" stroke="#482818" strokeWidth={14} fill="none" />
          <LightPool x={300} y={500} rx={420} ry={340} c="#ffd080" o={0.35} />
        </g>
      )}

      {/* Apartment vertical face backdrop */}
      {isApartment && (
        <g>
          <rect x={0} y={0} width={W} height={H} fill="#0a0b10" />
          {Array.from({ length: 14 }).map((_, i) => (
            <polygon key={i} points={`0,${160 + i * 110} 1080,${300 + i * 110} 1080,${350 + i * 110} 0,${210 + i * 110}`} fill="#283e58" opacity={0.38} />
          ))}
        </g>
      )}

      {/* Woods face backdrop */}
      {isWoods && (
        <g>
          <rect x={0} y={0} width={W} height={H} fill="#0c121e" />
          {[120, 880].map((x, i) => <rect key={i} x={x} y={0} width={80} height={H} fill="#04060a" />)}
          <circle cx={540} cy={300} r={180} fill="#9fb8e0" opacity={0.3} />
          <LightPool x={540} y={300} rx={440} ry={300} c="#9cc8f4" o={0.32} />
        </g>
      )}

      {/* Ritual vertical face backdrop */}
      {isRitual && (
        <g>
          <rect x={0} y={0} width={W} height={H} fill="#05080e" />
          <rect x={60} y={0} width={120} height={H} fill="#020306" />
          <rect x={900} y={0} width={140} height={H} fill="#020306" />
          <circle cx={540} cy={300} r={180} fill="#c8e2f8" opacity={0.28} />
          <LightPool x={540} y={300} rx={440} ry={320} c="#9cc8f4" o={0.3} />
        </g>
      )}

      {/* Hospital vertical face backdrop */}
      {isHospital && (
        <g>
          <rect x={0} y={0} width={W} height={H} fill="#0a1418" />
          <rect x={140} y={240} width={800} height={320} rx={16} fill="#061214" stroke="#16383e" strokeWidth={6} />
          <path d="M 160 400 L 320 400 L 350 320 L 380 470 L 410 360 L 440 400 L 920 400" stroke="#42e698" strokeWidth={5} fill="none" />
          <LightPool x={540} y={400} rx={460} ry={260} c="#40e090" o={0.35} />
        </g>
      )}

      <LightPool x={540} y={760} rx={560} ry={520} c={v.warm ? '#ffe6b8' : '#9fc0ff'} o={0.12} />
      <g transform={`translate(${v.x ?? 540},960) scale(1.04)`}>
        <CloseUp s={who} expr={v.expr ?? 'fear'} f={f} turn={(v.turn ?? 0.1) + 0.2 * p} uid={`rfc-${v.who ?? 'e'}`} />
        {v.tears && <BlackTears x={-70} y={-150} k={1.1} f={f} n={2} />}{v.tears && <BlackTears x={70} y={-150} k={1.1} f={f + 6} n={2} />}
      </g>
      {v.tag && <Tag at={[700, 520]} to={[820, 380]} text={String(v.tag)} f={t} t0={0.6} red size={28} />}
      <NightMask W={W} H={H} x={540} y={900} r={900} o={0.5} c="#05070c" />
    </Lgt></g>
  );
};

// 14 CREDIT card (vertical)
const rqcard: React.FC<SetProps> = ({ f, t = 0 }) => {
  const a = ease(t / 30);
  return (
    <g opacity={a}><Defs />
      <rect x={0} y={0} width={W} height={H} fill="#131a27" />
      <g transform={`translate(90,660) rotate(-1 450 300)`}><NotebookPage w={900} h={600} />
        <text x={450} y={180} textAnchor="middle" fontFamily="Lora" fontStyle="italic" fontSize={42} fill="#2a2a2e">Inspired by the story</text>
        <text x={450} y={280} textAnchor="middle" fontFamily="Lora" fontWeight={700} fontSize={56} fill="#1a1a1e">You Can't Trust Everyone</text>
        <text x={450} y={360} textAnchor="middle" fontFamily="Lora" fontStyle="italic" fontSize={34} fill="#3a3a40">from an online horror story page</text>
        <text x={450} y={470} textAnchor="middle" fontFamily="Lora" fontWeight={700} fontSize={32} fill="#b3221f">Fiction. Our own words.</text>
      </g>
    </g>
  );
};

// 15 QUESTION card (closing, vertical): large ritual mask + question text
const rqend: React.FC<SetProps> = ({ f, t = 0 }) => {
  const a = ease(t / 30);
  return (
    <g opacity={a}><Defs />
      <rect x={0} y={0} width={W} height={H} fill="#050810" />
      <rect x={80} y={0} width={60} height={H} fill="#020408" />
      <rect x={940} y={0} width={70} height={H} fill="#020408" />
      <circle cx={540} cy={520} r={220} fill="#8cb4d8" opacity={0.2} />
      <LightPool x={540} y={520} rx={480} ry={360} c="#9fc0ff" o={0.3} />
      <BlueMask cx={540} cy={520} r={220} />
      <text x={540} y={1180} textAnchor="middle" fontFamily="Lora" fontStyle="italic" fontWeight={700} fontSize={68} fill="#efe4cc">Who would you</text>
      <text x={540} y={1270} textAnchor="middle" fontFamily="Lora" fontStyle="italic" fontWeight={700} fontSize={68} fill="#efe4cc">have trusted?</text>
      <rect x={470} y={1330} width={140} height={6} fill={RED} />
    </g>
  );
};

void OFF; void ease;
export const SETS: Record<string, React.FC<SetProps>> = { rlibrary, rcommon, rcafeteria, rhall, rphone, rapartment, rdoor, rwoods, rclearing, rritual, runleashed, rhospital, rface, rqcard, rqend };
