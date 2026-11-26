import React from 'react';
import type { SetProps } from './Player';
import { CAST, FullPerson, CloseUp } from './Cast';
import { Tag } from './kits/Explain';
import { Floor, Window, Door, Dust, LightPool, NightMask } from './kits/Interior';
import { LyingPerson } from './kits/Lying';
import { BloodPool, Spatter, Stain } from './kits/Blood';
import {
  PAL, Defs, ease, Cold, Warm, Moon, Candle,
  MaskThing, Robed, BlackTears, Lantern, NotebookPage, RED,
} from './Trust';
// ===== STORY SLOT: REEL sets (1080x1920), drawn again for vertical. Keep faces + tags between y 220 and 1420
// (burned-in captions sit near y 1490). Imports only the story kit (Trust.tsx), never SetsL.tsx.
const W = 1080, H = 1920, GND = 1500;
const E = CAST.sam, J = CAST.noah, EL = CAST.mira, OFF = CAST.dale;

const VWall: React.FC<{ fill?: string }> = ({ fill = PAL.wall }) => (
  <g><rect x={0} y={0} width={W} height={GND} fill={fill} />
    {Array.from({ length: 8 }).map((_, i) => <path key={i} d={`M${i * 150},0 V${GND}`} stroke={PAL.wallInk} strokeWidth={2} opacity={0.25} />)}
    <rect x={0} y={GND} width={W} height={H - GND} fill={PAL.floor} /><rect x={0} y={GND} width={W} height={6} fill={PAL.trim} /></g>
);

// 1 LIBRARY (vertical): Ethan at a monitor, the dark shelves behind.
const rlibrary: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const g = 0.5 + 0.5 * Math.sin(f / 9); const p = ease(t / len);
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

// 2 COMMON (vertical): Ethan and Jack, the TV glow.
const rcommon: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const g = 0.5 + 0.5 * Math.sin(f / 7); const who = v.who ?? 'both';
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

// 3 CAFETERIA (vertical): Jack shouting, a student flinching back.
const rcafeteria: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const p = ease(t / len);
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

// 4 HALL (vertical): Elisa's wrong smile.
const rhall: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const p = ease(t / len);
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

// 5 PHONE (vertical): Ethan on the phone, screen glow on his face.
const rphone: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const g = 0.6 + 0.4 * Math.sin(f / 11);
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

// 6 APARTMENT (vertical): Jack on the couch; v.dark + v.tears = black tears in the dark.
const rapartment: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const dark = !!v.dark; const Lgt = dark ? Moon : Warm;
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

// 7 DOOR (vertical): Elisa's shape behind the frosted glass.
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

// 8 WOODS (vertical): Ethan chasing into the trees.
const rwoods: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const p = ease(t / len); const GY = GND - 20;
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

// 9 CLEARING (vertical): the circle, the chair, the mask thing bound.
const rclearing: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const p = ease(t / len); const GY = GND + 40;
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

// 10 RITUAL (vertical): closer; the blue mask, the tar, the tendrils.
const rritual: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const p = ease(t / len); const GY = GND + 40;
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

// 11 UNLEASHED (vertical): the thing free, red on the frost.
const runleashed: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const p = ease(t / len); const GY = GND + 40;
  return (
    <g><Defs /><Candle>
      <rect x={0} y={0} width={W} height={H} fill="#131a27" />
      <ellipse cx={260} cy={320} rx={130} ry={130} fill="#9fb8e0" opacity={0.2} /><circle cx={260} cy={320} r={56} fill="#cdddf4" opacity={0.4} />
      <rect x={0} y={GY} width={W} height={H - GY + 200} fill="#14181a" />
      <BloodPool x={420} y={GY + 110} r={220} grow={1} f={f} /><Spatter x={760} y={GY + 40} dir={-0.5} spread={110} size={240} n={26} f={f} t0={0.2} /><Stain x={880} y={GY + 150} r={150} grow={1} />
      <Robed x={900} y={GY + 30} k={0.42} f={f} seed={7} bow={0.5} />
      <MaskThing x={460 + ((v.px as number) ?? 0)} y={GY} k={0.5} f={f} face={1} pose={(v.pose as any) ?? (v.pose2 === 'loom' ? 'loom' : 'stalk')} p={v.pp ?? (f / 60)} tar={0.9} free tendrils={0.3} />
      <Tag at={[460, 440]} to={[470, 300]} text="YOU MADE HIM MAD" f={t} t0={0.6} red size={30} />
      <Dust x={60} y={200} w={960} h={1100} f={f} n={10} c="#cdddf4" />
    </Candle><NightMask W={W} H={H} x={480} y={860} r={1040} o={0.32} c="#04060a" /></g>
  );
};

// 12 HOSPITAL (vertical): Ethan in the bed, steady monitor.
const rhospital: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const trace = (() => { let d = 'M160,560'; for (let x = 160; x <= 860; x += 10) { const a = Math.sin((x + f * 4) / 18) * (x % 120 < 16 ? 40 : 6); d += ` L${x},${560 + a}`; } return d; })();
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

// 13 FACE (vertical): close-up; v.who, v.expr, v.tears.
const rface: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const p = ease(t / len); const who = v.who === 'jack' ? J : v.who === 'elisa' ? EL : E; const Lgt = v.warm ? Warm : Cold;
  return (
    <g><Defs /><Lgt>
      <rect x={0} y={0} width={W} height={H} fill={v.warm ? '#1a1510' : '#141a22'} />
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

// 15 QUESTION card (closing, vertical): the closing question is the last on-screen text.
const rqend: React.FC<SetProps> = ({ f, t = 0 }) => {
  const a = ease(t / 30);
  return (
    <g opacity={a}>
      <rect x={0} y={0} width={W} height={H} fill="#131a27" />
      <text x={540} y={900} textAnchor="middle" fontFamily="Lora" fontStyle="italic" fontWeight={700} fontSize={72} fill="#efe4cc">Who would you</text>
      <text x={540} y={1000} textAnchor="middle" fontFamily="Lora" fontStyle="italic" fontWeight={700} fontSize={72} fill="#efe4cc">have trusted?</text>
      <rect x={470} y={1050} width={140} height={6} fill={RED} />
    </g>
  );
};

void OFF; void ease;
export const SETS: Record<string, React.FC<SetProps>> = { rlibrary, rcommon, rcafeteria, rhall, rphone, rapartment, rdoor, rwoods, rclearing, rritual, runleashed, rhospital, rface, rqcard, rqend };
