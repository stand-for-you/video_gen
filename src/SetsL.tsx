import React from 'react';
import type { SetProps } from './Player';
import { CAST, FullPerson, CloseUp } from './Cast';
import { Tag } from './kits/Explain';
import { Wall, Floor, Far, Window, Door, PictureFrame, Dust, LightPool, NightMask, Rug } from './kits/Interior';
import { LyingPerson } from './kits/Lying';
import { BloodPool, Spatter, Stain, WallDrips } from './kits/Blood';
import { EndScreen } from './EndScreen';
import {
  W, H, FLOOR, PAL, PAL_WOOD, Defs, ease, Cold, Warm, Moon, Candle,
  MaskThing, MaskBust, Robed, Tendrils, BlackTears, Lantern, NotebookPage, RED,
} from './Trust';

const E = CAST.sam, J = CAST.noah, EL = CAST.mira, OFF = CAST.dale;
const Ceiling: React.FC<{ y?: number; c?: string }> = ({ y = -40, c = '#eef4ff' }) => <rect x={320} y={y} width={1280} height={30} fill={c} opacity={0.85} />;

// 1 LIBRARY: the college computer lab at night
const library: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const p = ease(t / len);
  const glow = 0.5 + 0.5 * Math.sin(f / 9);
  const n = v.n ?? 1;

  // n=3: narrow vertical aisle between book stacks
  if (n === 3) {
    return (
      <g><Defs /><Cold>
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#080c14" />
        <rect x={40} y={40} width={460} height={FLOOR + 100} fill="#141b26" stroke="#06090e" strokeWidth={10} />
        {Array.from({ length: 8 }).map((_, r) => <rect key={r} x={60} y={80 + r * 94} width={420} height={14} fill="#0d121a" />)}
        {Array.from({ length: 8 }).map((_, r) => Array.from({ length: 18 }).map((_, b) => <rect key={b} x={68 + b * 22} y={80 + r * 94 - 60} width={18} height={62} fill={['#3a485a', '#2d3848', '#44566c', '#202834'][(r + b) % 4]} />))}
        <rect x={1420} y={40} width={460} height={FLOOR + 100} fill="#141b26" stroke="#06090e" strokeWidth={10} />
        {Array.from({ length: 8 }).map((_, r) => <rect key={r} x={1440} y={80 + r * 94} width={420} height={14} fill="#0d121a" />)}
        {Array.from({ length: 8 }).map((_, r) => Array.from({ length: 18 }).map((_, b) => <rect key={b} x={1448 + b * 22} y={80 + r * 94 - 60} width={18} height={62} fill={['#3a485a', '#2d3848', '#44566c', '#202834'][(r + b) % 4]} />))}
        <polygon points={`500,${FLOOR + 40} 1420,${FLOOR + 40} 1120,240 800,240`} fill="#101824" />
        <rect x={820} y={120} width={280} height={420} fill="#1c3044" stroke="#080e16" strokeWidth={8} />
        <LightPool x={960} y={320} rx={340} ry={280} c="#8fd4e6" o={0.32} />
        <FullPerson s={E} x={960} y={FLOOR - 20} k={0.28} f={f} view="three" face={-1} expr={v.expr ?? 'fear'} turn={-0.3} motion={{ type: 'idle' }} />
        <Tag at={[960, 320]} to={[820, 220]} text="ALONE IN THE STACKS" f={t} t0={0.7} red size={26} />
        <Dust x={300} y={120} w={1300} h={700} f={f} n={16} />
      </Cold><NightMask W={W} H={H} x={960} y={540} r={980} o={0.4} c="#04060a" /></g>
    );
  }

  // n=5: High angle / corner desk with dual monitors on right and dark stacks left
  if (n === 5) {
    return (
      <g><Defs /><Cold>
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#0a0e18" />
        <rect x={100} y={60} width={380} height={FLOOR} fill="#121822" stroke="#080c12" strokeWidth={8} />
        <rect x={1120} y={FLOOR - 360} width={680} height={240} rx={12} fill="#081018" stroke="#1c2c3c" strokeWidth={6} />
        <rect x={1140} y={FLOOR - 340} width={640} height={200} fill="#123a4e" opacity={0.8} />
        <LightPool x={1460} y={FLOOR - 240} rx={500} ry={300} c="#6ed4ea" o={0.4} />
        <FullPerson s={E} x={760} y={FLOOR} k={0.3} f={f} view="three" face={1} expr="fear" turn={0.3} motion={{ type: 'idle' }} />
        {v.tag && <Tag at={[760, 380]} to={[640, 260]} text="WATCHED" f={t} t0={0.7} red size={28} />}
        <Dust x={300} y={120} w={1300} h={700} f={f} n={16} />
      </Cold><NightMask W={W} H={H} x={960} y={540} r={1050} o={0.38} c="#05070c" /></g>
    );
  }

  // n=6: close-in angle on massive cyan computer screens on left, Ethan on right
  if (n === 6) {
    return (
      <g><Defs /><Cold>
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#090d14" />
        <rect x={100} y={160} width={680} height={460} rx={14} fill="#050a10" stroke="#223242" strokeWidth={8} />
        <rect x={126} y={186} width={628} height={408} fill="#104256" opacity={0.85} />
        {Array.from({ length: 9 }).map((_, r) => <rect key={r} x={160} y={220 + r * 38} width={380 - (r % 4) * 60} height={8} fill="#7ee4f4" opacity={0.75} />)}
        <LightPool x={440} y={400} rx={560} ry={360} c="#6cd4ea" o={0.45} />
        <FullPerson s={E} x={1320} y={FLOOR} k={0.32} f={f} view="three" face={-1} expr={v.expr ?? 'sad'} turn={-0.2} motion={{ type: 'idle' }} />
        <rect x={1540} y={100} width={320} height={FLOOR - 100} fill="#18222e" stroke="#0c121a" strokeWidth={6} />
        <Dust x={300} y={120} w={1300} h={700} f={f} n={16} />
      </Cold><NightMask W={W} H={H} x={960} y={540} r={1050} o={0.35} c="#05070c" /></g>
    );
  }

  // n=7: doorway back view looking into the cold room
  if (n === 7) {
    return (
      <g><Defs /><Cold>
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#06090e" />
        <rect x={0} y={0} width={340} height={H} fill="#030406" />
        <rect x={1580} y={0} width={340} height={H} fill="#030406" />
        <rect x={340} y={80} width={1240} height={FLOOR - 80} fill="#111824" />
        <Window x={800} y={140} w={320} h={360} f={f} P={PAL} moon curtains={false} />
        <LightPool x={960} y={400} rx={480} ry={300} c="#8fd4e6" o={0.28} />
        <FullPerson s={E} x={960} y={FLOOR} k={0.25} f={f} view="three" face={1} expr="fear" turn={0.2} motion={{ type: 'idle' }} />
        <Dust x={300} y={120} w={1300} h={700} f={f} n={14} />
      </Cold><NightMask W={W} H={H} x={960} y={540} r={1120} o={0.4} c="#04060a" /></g>
    );
  }

  // n=71: Diagonal view across long study table with reading lamps
  if (n === 71) {
    return (
      <g><Defs /><Cold>
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#0a1018" />
        <Floor W={W} floorY={FLOOR} H={H} P={PAL} vx={W * 0.5} />
        <polygon points={`200,${FLOOR} 1720,${FLOOR} 1400,${FLOOR - 180} 520,${FLOOR - 180}`} fill="#3e4a58" stroke="#18202c" strokeWidth={6} />
        {[600, 960, 1320].map((x, i) => (
          <g key={i}><rect x={x - 6} y={FLOOR - 280} width={12} height={100} fill="#18202a" /><ellipse cx={x} cy={FLOOR - 280} rx={50} ry={24} fill="#248a60" /><LightPool x={x} y={FLOOR - 160} rx={220} ry={140} c="#60e0a0" o={0.28} /></g>
        ))}
        <FullPerson s={E} x={960} y={FLOOR} k={0.28} f={f} view="three" face={-1} expr="neutral" turn={0.1} motion={{ type: 'idle' }} />
        <Dust x={300} y={120} w={1300} h={700} f={f} n={14} />
      </Cold><NightMask W={W} H={H} x={960} y={540} r={1050} o={0.35} c="#05070c" /></g>
    );
  }

  // Default wide desk (n=1)
  return (
    <g><Defs /><Cold>
      <Far b={3}><rect x={-200} y={-200} width={W + 400} height={FLOOR + 200} fill={PAL.wall} />
        {[80, 320, 1560].map((x, i) => <g key={i}><rect x={x} y={120} width={200} height={FLOOR - 120} fill={PAL.wallD} stroke="#10141c" strokeWidth={5} />
          {Array.from({ length: 7 }).map((_, r) => <rect key={r} x={x + 12} y={150 + r * 84} width={176} height={10} fill="#1c222c" />)}
          {Array.from({ length: 7 }).map((_, r) => Array.from({ length: 9 }).map((_, b) => <rect key={b} x={x + 16 + b * 19} y={150 + r * 84 - 54} width={15} height={56} fill={['#5a6472', '#45506a', '#6a5a4a', '#3c4656'][(r + b) % 4]} />))}
        </g>)}
      </Far>
      <Ceiling />
      <Window x={800} y={150} w={320} h={360} f={f} P={PAL} moon curtains={false} />
      <Floor W={W} floorY={FLOOR} H={H} P={PAL} vx={W * 0.5} />
      <rect x={360} y={FLOOR - 150} width={1200} height={40} fill={PAL.wood} stroke={PAL.woodD} strokeWidth={5} />
      <rect x={360} y={FLOOR - 110} width={1200} height={110} fill={PAL.woodD} />
      {[560, 1180].map((mx, i) => <g key={i}><rect x={mx} y={FLOOR - 330} width={300} height={200} rx={8} fill="#0a1016" stroke="#2a3240" strokeWidth={6} />
        <rect x={mx + 16} y={FLOOR - 314} width={268} height={168} fill="#17384a" opacity={0.5 + 0.5 * glow} />
        {Array.from({ length: 6 }).map((_, r) => <rect key={r} x={mx + 28} y={FLOOR - 300 + r * 24} width={180 - (r % 3) * 40} height={6} fill="#7fd4e6" opacity={0.6} />)}
        <rect x={mx + 60} y={FLOOR - 128} width={180} height={14} fill="#20262e" /></g>)}
      <LightPool x={760} y={FLOOR - 230} rx={520} ry={240} c="#8fd4e6" o={0.14 + 0.06 * glow} />
      <FullPerson s={E} x={820} y={FLOOR} k={0.3} f={f} view="three" face={-1} expr={v.expr ?? 'worry'} turn={0.2 - 0.5 * p} motion={{ type: 'idle' }} />
      {v.watch && <rect x={120} y={200} width={190} height={FLOOR - 200} fill="#05070b" opacity={0.7} />}
      <Dust x={300} y={120} w={1300} h={700} f={f} n={18} />
    </Cold><NightMask W={W} H={H} x={820} y={560} r={1120} o={0.36} c="#06080e" /></g>
  );
};

// 2 COMMON ROOM: the dorm common room where Ethan and Jack play games.
const common: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const g = 0.5 + 0.5 * Math.sin(f / 7);
  const who = v.who ?? 'both';
  const n = v.n ?? 8;

  // n=9: Game table with hanging amber lamp
  if (n === 9) {
    return (
      <g><Defs /><Warm>
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#1c1612" />
        <Floor W={W} floorY={FLOOR} H={H} P={PAL} vx={W * 0.5} />
        <rect x={480} y={FLOOR - 180} width={960} height={50} rx={8} fill="#523a26" stroke="#281a10" strokeWidth={6} />
        <rect x={520} y={FLOOR - 130} width={80} height={130} fill="#2c1e14" /><rect x={1320} y={FLOOR - 130} width={80} height={130} fill="#2c1e14" />
        <line x1={960} y1={-40} x2={960} y2={180} stroke="#1a1410" strokeWidth={6} />
        <polygon points="860,260 1060,260 1000,180 920,180" fill="#3a2818" stroke="#1c1208" strokeWidth={6} />
        <LightPool x={960} y={FLOOR - 240} rx={520} ry={360} c="#ffd070" o={0.36} />
        <FullPerson s={E} x={720} y={FLOOR} k={0.3} f={f} view="three" face={1} expr={v.expr ?? 'smile'} motion={{ type: 'sit' }} />
        {who === 'both' && <FullPerson s={J} x={1180} y={FLOOR} k={0.3} f={f} view="three" face={-1} expr={v.jexpr ?? 'smile'} motion={{ type: 'sit' }} />}
        <Dust x={300} y={120} w={1300} h={700} f={f} n={14} />
      </Warm><NightMask W={W} H={H} x={960} y={540} r={1100} o={0.35} c="#08080e" /></g>
    );
  }

  // n=11: Behind TV console looking towards Jack
  if (n === 11) {
    return (
      <g><Defs /><Warm>
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#201a16" />
        <Floor W={W} floorY={FLOOR} H={H} P={PAL} vx={W * 0.5} />
        <rect x={60} y={160} width={500} height={600} rx={16} fill="#0d1016" stroke="#222834" strokeWidth={8} />
        <polygon points="560,240 760,140 760,780 560,720" fill="#123448" opacity={0.7} />
        <LightPool x={700} y={460} rx={440} ry={340} c="#62e0d0" o={0.3} />
        <rect x={1100} y={FLOOR - 280} width={460} height={280} rx={22} fill="#3a4458" stroke="#18202e" strokeWidth={6} />
        <FullPerson s={J} x={1260} y={FLOOR} k={0.3} f={f} view="three" face={-1} expr={v.jexpr ?? 'smile'} motion={{ type: 'sit' }} />
        <rect x={1640} y={140} width={14} height={560} fill="#443224" /><ellipse cx={1647} cy={140} rx={60} ry={40} fill="#ffe4a0" opacity={0.8} />
        <LightPool x={1647} y={160} rx={280} ry={240} c="#ffa840" o={0.3} />
        <Dust x={300} y={120} w={1300} h={700} f={f} n={14} />
      </Warm><NightMask W={W} H={H} x={960} y={540} r={1120} o={0.34} c="#08080e" /></g>
    );
  }

  // n=13: Armchair close-up on left with warm floor lamp
  if (n === 13) {
    return (
      <g><Defs /><Warm>
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#181410" />
        <Floor W={W} floorY={FLOOR} H={H} P={PAL} vx={W * 0.5} />
        <rect x={180} y={FLOOR - 320} width={520} height={320} rx={26} fill="#463628" stroke="#1c140a" strokeWidth={8} />
        <rect x={760} y={160} width={16} height={FLOOR - 160} fill="#322416" /><ellipse cx={768} cy={180} rx={80} ry={50} fill="#ffd880" opacity={0.7} />
        <LightPool x={768} y={300} rx={420} ry={320} c="#ffa830" o={0.35} />
        <FullPerson s={E} x={440} y={FLOOR} k={0.34} f={f} view="three" face={1} expr="smile" motion={{ type: 'sit' }} />
        <FullPerson s={J} x={1320} y={FLOOR} k={0.3} f={f} view="three" face={-1} expr="smile" motion={{ type: 'sit' }} />
        <Dust x={300} y={120} w={1300} h={700} f={f} n={14} />
      </Warm><NightMask W={W} H={H} x={960} y={540} r={1100} o={0.32} c="#08080e" /></g>
    );
  }

  // n=15: Low coffee table in foreground with pizza box and game controllers, TV glare on floor
  if (n === 15) {
    return (
      <g><Defs /><Warm>
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#141820" />
        <Floor W={W} floorY={FLOOR} H={H} P={PAL} vx={W * 0.5} />
        <rect x={240} y={FLOOR - 160} width={900} height={40} fill="#584232" stroke="#221810" strokeWidth={6} />
        <rect x={300} y={FLOOR - 200} width={260} height={40} fill="#b47030" stroke="#502810" strokeWidth={4} />
        <LightPool x={700} y={FLOOR - 260} rx={500} ry={300} c="#48c4e0" o={0.3} />
        <FullPerson s={J} x={1200} y={FLOOR} k={0.32} f={f} view="three" face={-1} expr="sad" motion={{ type: 'sit' }} />
        <Dust x={300} y={120} w={1300} h={700} f={f} n={14} />
      </Warm><NightMask W={W} H={H} x={960} y={540} r={1050} o={0.35} c="#06080e" /></g>
    );
  }

  // n=17: Looking out the common room window at the dark quad, Ethan in profile
  if (n === 17) {
    return (
      <g><Defs /><Warm>
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#10141c" />
        <Floor W={W} floorY={FLOOR} H={H} P={PAL} vx={W * 0.5} />
        <rect x={1100} y={120} width={620} height={600} fill="#122438" stroke="#0a121e" strokeWidth={10} />
        <line x1={1410} y1={120} x2={1410} y2={720} stroke="#0a121e" strokeWidth={8} />
        <LightPool x={1410} y={420} rx={480} ry={340} c="#78b4e4" o={0.28} />
        <FullPerson s={E} x={660} y={FLOOR} k={0.32} f={f} view="three" face={1} expr="worry" motion={{ type: 'idle' }} />
        <Dust x={300} y={120} w={1300} h={700} f={f} n={14} />
      </Warm><NightMask W={W} H={H} x={960} y={540} r={1120} o={0.36} c="#06080e" /></g>
    );
  }

  // n=72: Hallway entrance looking into common room
  if (n === 72) {
    return (
      <g><Defs /><Warm>
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#0e1016" />
        <rect x={0} y={0} width={400} height={H} fill="#06080c" />
        <rect x={400} y={80} width={1520} height={FLOOR - 80} fill="#261c16" />
        <LightPool x={1000} y={400} rx={600} ry={360} c="#ffa840" o={0.32} />
        <FullPerson s={J} x={1180} y={FLOOR} k={0.28} f={f} view="three" face={-1} expr="neutral" motion={{ type: 'sit' }} />
        <Dust x={300} y={120} w={1300} h={700} f={f} n={14} />
      </Warm><NightMask W={W} H={H} x={960} y={540} r={1120} o={0.38} c="#08080e" /></g>
    );
  }

  // Default wide couch (n=8)
  return (
    <g><Defs /><Warm>
      <Far b={2}><rect x={-200} y={-200} width={W + 400} height={FLOOR + 200} fill={PAL.wall} />
        <Wall x={-200} y={-200} w={W + 400} h={FLOOR + 160} P={PAL} kind="plain" id="rm" stains={0} />
        <PictureFrame x={360} y={150} w={360} h={240} P={PAL} id="rm"><rect x={0} y={0} width={360} height={240} fill="#2a3450" /><text x={180} y={140} textAnchor="middle" fontFamily="Lora" fontSize={44} fill="#8a96b0">WASTED YOUTH</text></PictureFrame>
      </Far>
      <Floor W={W} floorY={FLOOR} H={H} P={PAL} vx={W * 0.5} />
      <Rug x={520} y={FLOOR - 40} w={1000} h={220} c="#3a3048" c2="#6a5a7a" />
      <rect x={1280} y={FLOOR - 430} width={460} height={300} rx={10} fill="#07090d" stroke="#2a3240" strokeWidth={7} />
      <rect x={1298} y={FLOOR - 414} width={424} height={268} fill="#14415a" opacity={0.55 + 0.45 * g} />
      <path d={`M1360,${FLOOR - 280} l80,-40 l80,40 l-80,40Z`} fill="#7fe0d0" opacity={0.6 + 0.4 * g} />
      <rect x={1300} y={FLOOR - 120} width={420} height={110} fill={PAL.woodD} />
      <rect x={720} y={FLOOR - 120} width={360} height={28} fill={PAL.wood} />
      <rect x={420} y={FLOOR - 250} width={620} height={250} rx={28} fill="#45506a" stroke="#242b3a" strokeWidth={6} />
      <rect x={440} y={FLOOR - 300} width={580} height={90} rx={24} fill="#515e7c" />
      <LightPool x={1500} y={FLOOR - 280} rx={420} ry={260} c="#7fe0d0" o={0.12} />
      <LightPool x={500} y={200} rx={360} ry={260} c="#ffd27a" o={0.16} />
      {(who === 'both' || who === 'ethan') && <FullPerson s={E} x={640} y={FLOOR} k={0.26} f={f} view="three" face={1} expr={v.expr ?? 'smile'} motion={{ type: 'sit' }} />}
      {(who === 'both' || who === 'jack') && <FullPerson s={J} x={860} y={FLOOR} k={0.26} f={f} view="three" face={-1} expr={v.jexpr ?? 'smile'} motion={{ type: 'sit' }} />}
      <Dust x={300} y={120} w={1300} h={700} f={f} n={16} />
    </Warm><NightMask W={W} H={H} x={960} y={560} r={1180} o={0.3} c="#0a0a12" /></g>
  );
};

// 3 CAFETERIA: the serving line. Jack snaps and a student flinches back.
const cafeteria: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const p = ease(t / len);
  const n = v.n ?? 18;

  // n=19: Dining tables in foreground
  if (n === 19) {
    return (
      <g><Defs /><Cold>
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#141a24" />
        <Floor W={W} floorY={FLOOR} H={H} P={PAL} vx={W * 0.5} />
        <ellipse cx={480} cy={FLOOR - 140} rx={340} ry={90} fill="#82909e" stroke="#202a36" strokeWidth={6} />
        <rect x={440} y={FLOOR - 90} width={80} height={90} fill="#303c4a" />
        <rect x={360} y={60} width={520} height={16} fill="#eef8ff" />
        <LightPool x={620} y={FLOOR - 200} rx={420} ry={280} c="#9ed8f0" o={0.25} />
        <FullPerson s={J} x={1240} y={FLOOR} k={0.3} f={f} view="three" face={-1} expr="stern" turn={0.2} motion={{ type: 'point' }} />
        <FullPerson s={EL} x={1560} y={FLOOR} k={0.28} f={f} view="three" face={-1} expr="shock" motion={{ type: 'recoil' }} uid="caf-st2" />
        <Dust x={300} y={120} w={1300} h={700} f={f} n={14} />
      </Cold><NightMask W={W} H={H} x={960} y={540} r={1120} o={0.32} c="#080c12" /></g>
    );
  }

  // n=73: Beverage / soda machine angle on left
  if (n === 73) {
    return (
      <g><Defs /><Cold>
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#18202c" />
        <Floor W={W} floorY={FLOOR} H={H} P={PAL} vx={W * 0.5} />
        <rect x={120} y={140} width={420} height={680} rx={14} fill="#0e141e" stroke="#2a3848" strokeWidth={8} />
        <rect x={140} y={180} width={380} height={200} fill="#c85020" opacity={0.8} />
        <LightPool x={330} y={380} rx={440} ry={300} c="#ff8030" o={0.35} />
        <FullPerson s={J} x={1080} y={FLOOR} k={0.32} f={f} view="three" face={1} expr="stern" turn={0.1} motion={{ type: 'point' }} />
        <Dust x={300} y={120} w={1300} h={700} f={f} n={14} />
      </Cold><NightMask W={W} H={H} x={960} y={540} r={1120} o={0.34} c="#080c12" /></g>
    );
  }

  // n=22: Tray return window and dish rack
  if (n === 22) {
    return (
      <g><Defs /><Cold>
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#101822" />
        <Floor W={W} floorY={FLOOR} H={H} P={PAL} vx={W * 0.5} />
        <rect x={200} y={160} width={640} height={420} fill="#080e14" stroke="#223242" strokeWidth={8} />
        <rect x={240} y={200} width={560} height={340} fill="#1a2838" />
        <LightPool x={520} y={370} rx={480} ry={260} c="#6ed8ea" o={0.32} />
        <FullPerson s={J} x={1260} y={FLOOR} k={0.32} f={f} view="three" face={-1} expr="stern" motion={{ type: 'point' }} />
        <FullPerson s={EL} x={1600} y={FLOOR} k={0.28} f={f} view="three" face={-1} expr="shock" motion={{ type: 'recoil' }} uid="caf-tr22" />
        <Dust x={300} y={120} w={1300} h={700} f={f} n={14} />
      </Cold><NightMask W={W} H={H} x={960} y={540} r={1120} o={0.32} c="#060a10" /></g>
    );
  }

  // Default serving line (n=18, 21)
  return (
    <g><Defs /><Cold>
      <Far b={2}><rect x={-200} y={-200} width={W + 400} height={FLOOR + 200} fill={PAL.wall} />
        <rect x={200} y={120} width={520} height={120} fill="#10151e" stroke="#2a3140" strokeWidth={5} /><text x={460} y={200} textAnchor="middle" fontFamily="Lora" fontSize={52} fill="#9fb0c4">TODAY</text>
        {[1180, 1420, 1660].map((x, i) => <rect key={i} x={x} y={120} width={180} height={420} fill={PAL.wallD} stroke="#10141c" strokeWidth={4} />)}
      </Far>
      {[520, 900, 1280].map((x, i) => <rect key={i} x={x} y={-40} width={70} height={150} fill="#1a2028" />)}
      {[520, 900, 1280].map((x, i) => <ellipse key={i} cx={x + 35} cy={120} rx={120} ry={34} fill="#ffe6b8" opacity={0.12} />)}
      <Floor W={W} floorY={FLOOR} H={H} P={PAL} vx={W * 0.5} />
      <rect x={120} y={FLOOR - 230} width={1040} height={60} fill="#8a94a0" stroke="#2a3038" strokeWidth={5} />
      <rect x={120} y={FLOOR - 170} width={1040} height={150} fill="#4a525e" />
      {[200, 360, 520, 680, 840].map((x, i) => <rect key={'t' + i} x={x} y={FLOOR - 250} width={120} height={24} rx={6} fill="#aeb6c0" stroke="#2a3038" strokeWidth={3} />)}
      <FullPerson s={EL} x={1420 + 80 * p} y={FLOOR} k={0.27} f={f} view="three" face={-1} expr="shock" motion={{ type: 'recoil' }} uid="caf-st" />
      <FullPerson s={J} x={1120} y={FLOOR} k={0.29} f={f} view="three" face={1} expr="stern" turn={0.3 * p} motion={{ type: 'point' }} />
      {v.tray && <g>{[0, 1, 2].map((i) => <rect key={i} x={1000 + i * 40} y={FLOOR - 20 - i * 10} width={120} height={20} rx={6} fill="#aeb6c0" transform={`rotate(${-20 + i * 14} ${1060} ${FLOOR})`} />)}</g>}
      <Tag at={[1180, 360]} to={[1280, 250]} text="THAT WAS NOT MY FRIEND" f={t} t0={0.7} red size={28} />
      <Dust x={300} y={120} w={1300} h={700} f={f} n={14} />
    </Cold><NightMask W={W} H={H} x={960} y={560} r={1200} o={0.3} c="#0a0e14" /></g>
  );
};

// 4 HALL: a hall of lockers. Elisa says the cold line; her smile is wrong.
const hall: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const p = ease(t / len);
  const n = v.n ?? 23;

  // n=25: Classroom doorway angle
  if (n === 25) {
    return (
      <g><Defs /><Cold>
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#161e28" />
        <Floor W={W} floorY={FLOOR} H={H} P={PAL} vx={W * 0.5} planks={20} />
        <rect x={180} y={140} width={420} height={720} fill="#0a0e16" stroke="#222e3c" strokeWidth={10} />
        <polygon points="600,180 880,240 880,FLOOR 600,FLOOR" fill="#182432" opacity={0.5} />
        <FullPerson s={EL} x={420} y={FLOOR} k={0.32} f={f} view="three" face={1} expr={v.expr ?? 'cruel'} turn={0.1} motion={{ type: 'idle' }} />
        <FullPerson s={E} x={1380} y={FLOOR} k={0.28} f={f} view="three" face={-1} expr="worry" motion={{ type: 'idle' }} />
        <Dust x={300} y={120} w={1300} h={700} f={f} n={14} />
      </Cold><NightMask W={W} H={H} x={960} y={540} r={1100} o={0.33} c="#060a10" /></g>
    );
  }

  // n=75: Stairwell landing with green handrails
  if (n === 75) {
    return (
      <g><Defs /><Cold>
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#18222a" />
        <Floor W={W} floorY={FLOOR} H={H} P={PAL} vx={W * 0.5} />
        <line x1={0} y1={FLOOR - 320} x2={W} y2={FLOOR - 100} stroke="#2e684e" strokeWidth={16} />
        <LightPool x={960} y={400} rx={600} ry={360} c="#80d0b0" o={0.28} />
        <FullPerson s={EL} x={1100} y={FLOOR} k={0.3} f={f} view="three" face={-1} expr="neutral" motion={{ type: 'idle' }} />
        <Dust x={300} y={120} w={1300} h={700} f={f} n={14} />
      </Cold><NightMask W={W} H={H} x={960} y={540} r={1100} o={0.35} c="#06080e" /></g>
    );
  }

  // Default lockers (n=23, 26, 74)
  return (
    <g><Defs /><Cold>
      <Far b={2}><rect x={-200} y={-200} width={W + 400} height={FLOOR + 200} fill={PAL.wall} />
        {Array.from({ length: 14 }).map((_, i) => <g key={i}><rect x={120 + i * 92} y={200} width={84} height={420} fill={i % 2 ? '#3a5060' : '#365466'} stroke="#182028" strokeWidth={4} />
          <circle cx={120 + i * 92 + 64} cy={420} r={6} fill="#1a2028" /><rect x={120 + i * 92 + 24} y={250} width={36} height={8} fill="#1a2028" /></g>)}
      </Far>
      <rect x={1180} y={220} width={520} height={300} fill="#6a5a3e" stroke="#3a2e18" strokeWidth={8} />
      {Array.from({ length: 10 }).map((_, i) => <rect key={i} x={1210 + (i % 5) * 96} y={250 + Math.floor(i / 5) * 130} width={78} height={104} fill={['#d8d2c4', '#c8d0d8', '#e0d0c0'][i % 3]} transform={`rotate(${(i % 3 - 1) * 4} ${1250 + (i % 5) * 96} ${300})`} />)}
      <circle cx={960} cy={160} r={46} fill="#e8eef6" stroke="#2a3038" strokeWidth={6} /><path d={`M960,160 L960,128 M960,160 L982,168`} stroke="#1a2028" strokeWidth={4} />
      <Window x={300} y={160} w={220} h={300} f={f} P={PAL} moon curtains={false} />
      <Floor W={W} floorY={FLOOR} H={H} P={PAL} vx={W * 0.5} planks={20} />
      <FullPerson s={E} x={560} y={FLOOR} k={0.3} f={f} view="three" face={1} expr="worry" motion={{ type: 'idle' }} />
      <FullPerson s={EL} x={1200 - 40 * p} y={FLOOR} k={0.29} f={f} view="three" face={-1} expr={v.expr ?? 'smile'} turn={-0.2} motion={{ type: 'idle' }} />
      {v.tag && <Tag at={[1200, 360]} to={[1480, 250]} text="BETTER THAN EVER" f={t} t0={0.8} red size={30} />}
      <Dust x={300} y={120} w={1300} h={700} f={f} n={14} />
    </Cold><NightMask W={W} H={H} x={960} y={560} r={1180} o={0.3} c="#0a0e14" /></g>
  );
};

// 5 PHONE: Ethan's room at night, on the phone. His face lit by the screen.
const phone: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const g = 0.6 + 0.4 * Math.sin(f / 11);
  const n = v.n ?? 27;

  // n=29, 76: Close wall phone with spiral cord
  if (n === 29 || n === 76) {
    return (
      <g><Defs /><Warm>
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#241a14" />
        <Floor W={W} floorY={FLOOR} H={H} P={PAL} vx={W * 0.5} />
        <rect x={380} y={240} width={260} height={440} rx={18} fill="#1a1410" stroke="#4a3424" strokeWidth={10} />
        <circle cx={510} cy={380} r={60} fill="#0d0a08" stroke="#cca050" strokeWidth={6} />
        <path d="M 460 620 Q 420 720 480 760 Q 520 800 460 840" stroke="#0d0a08" strokeWidth={12} fill="none" />
        <LightPool x={510} y={420} rx={420} ry={360} c="#ffd080" o={0.35} />
        <FullPerson s={E} x={1120} y={FLOOR} k={0.32} f={f} view="three" face={-1} expr={v.expr ?? 'fear'} motion={{ type: 'sit' }} />
        <Dust x={300} y={120} w={1300} h={700} f={f} n={14} />
      </Warm><NightMask W={W} H={H} x={960} y={540} r={1050} o={0.35} c="#08080e" /></g>
    );
  }

  // n=77: Corner phone booth with bifold door
  if (n === 77) {
    return (
      <g><Defs /><Warm>
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#181c24" />
        <Floor W={W} floorY={FLOOR} H={H} P={PAL} vx={W * 0.5} />
        <rect x={260} y={120} width={480} height={FLOOR - 120} fill="#0c1218" stroke="#243444" strokeWidth={10} />
        <LightPool x={500} y={380} rx={440} ry={300} c="#ffe290" o={0.35} />
        <FullPerson s={E} x={1260} y={FLOOR} k={0.3} f={f} view="three" face={-1} expr={v.expr ?? 'worry'} motion={{ type: 'idle' }} />
        <Dust x={300} y={120} w={1300} h={700} f={f} n={14} />
      </Warm><NightMask W={W} H={H} x={960} y={540} r={1050} o={0.35} c="#080a10" /></g>
    );
  }

  // n=30, 78: Ethan facing cold rainy window
  if (n === 30 || n === 78) {
    return (
      <g><Defs /><Cold>
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#0e141c" />
        <Floor W={W} floorY={FLOOR} H={H} P={PAL} vx={W * 0.5} />
        <rect x={1180} y={100} width={520} height={600} fill="#14283c" stroke="#0a121c" strokeWidth={10} />
        <line x1={1440} y1={100} x2={1440} y2={700} stroke="#0a121c" strokeWidth={8} />
        <line x1={1180} y1={400} x2={1700} y2={400} stroke="#0a121c" strokeWidth={8} />
        <LightPool x={1440} y={400} rx={480} ry={340} c="#ffcc60" o={0.28} />
        <FullPerson s={E} x={680} y={FLOOR} k={0.3} f={f} view="three" face={1} expr={v.expr ?? 'worry'} motion={{ type: 'idle' }} />
        <Dust x={300} y={120} w={1300} h={700} f={f} n={14} />
      </Cold><NightMask W={W} H={H} x={960} y={540} r={1120} o={0.36} c="#05080e" /></g>
    );
  }

  // Default wide bedroom (n=27)
  return (
    <g><Defs /><Warm>
      <Far b={2}><rect x={-200} y={-200} width={W + 400} height={FLOOR + 200} fill={PAL.wall} />
        <Wall x={-200} y={-200} w={W + 400} h={FLOOR + 160} P={PAL} kind="plain" stains={0} /></Far>
      <Window x={1280} y={150} w={360} h={380} f={f} P={PAL} moon curtains />
      <Floor W={W} floorY={FLOOR} H={H} P={PAL} vx={W * 0.5} />
      <rect x={980} y={FLOOR - 140} width={620} height={36} fill={PAL.wood} /><rect x={980} y={FLOOR - 104} width={620} height={104} fill={PAL.woodD} />
      <rect x={1140} y={FLOOR - 250} width={220} height={120} rx={8} fill="#0a1016" stroke="#2a3240" strokeWidth={5} /><rect x={1156} y={FLOOR - 236} width={188} height={92} fill="#17384a" opacity={0.5} />
      <g transform={`translate(${1420},${FLOOR - 150})`}><rect x={-8} y={-60} width={16} height={60} fill="#2a3038" /><path d="M-70,-120 L70,-120 L40,-60 L-40,-60Z" fill="#3a3330" stroke="#1a1612" strokeWidth={4} /><ellipse cx={0} cy={-80} rx={70} ry={30} fill="#ffe6b8" opacity={0.3} /></g>
      <LightPool x={1420} y={FLOOR - 120} rx={420} ry={300} c="#ffe6b8" o={0.18} />
      <rect x={120} y={FLOOR - 170} width={560} height={170} rx={14} fill={PAL.quiltB} stroke="#20283a" strokeWidth={5} /><rect x={120} y={FLOOR - 220} width={200} height={70} rx={14} fill={PAL.sheet} />
      <FullPerson s={E} x={760} y={FLOOR} k={0.28} f={f} view="three" face={1} expr={v.expr ?? 'worry'} motion={{ type: 'sit' }} />
      <ellipse cx={820} cy={FLOOR - 560} rx={60} ry={90} fill="#bfe0ff" opacity={0.18 * g} />
      {v.tag && <Tag at={[760, 400]} to={[1100, 280]} text="HIS VOICE WAS SHAKING" f={t} t0={0.7} size={26} />}
      <Dust x={300} y={120} w={1300} h={700} f={f} n={14} />
    </Warm><NightMask W={W} H={H} x={820} y={560} r={1120} o={0.34} c="#080a10" /></g>
  );
};

// 6 APARTMENT: the living room. v.dark turns the lamp off; v.tears puts black tears on Jack.
const apartment: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const dark = !!v.dark; const Lgt = dark ? Moon : Warm;
  const n = v.n ?? 31;

  // n=32: Doorway with light under door
  if (n === 32) {
    return (
      <g><Defs /><Cold>
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#0a0c12" />
        <Floor W={W} floorY={FLOOR} H={H} P={PAL} vx={W * 0.5} />
        <rect x={240} y={120} width={380} height={FLOOR - 120} fill="#141822" stroke="#080a0e" strokeWidth={10} />
        <polygon points={`240,${FLOOR} 620,${FLOOR} 760,${FLOOR + 60} 100,${FLOOR + 60}`} fill="#ffd060" opacity={0.65} />
        <LightPool x={430} y={FLOOR} rx={360} ry={140} c="#ffb840" o={0.4} />
        <FullPerson s={J} x={1260} y={FLOOR} k={0.3} f={f} view="three" face={-1} expr="fear" motion={{ type: 'sit' }} />
        {v.tears && <BlackTears x={1200} y={FLOOR - 640} k={0.5} f={f} n={2} />}
        <Dust x={300} y={120} w={1300} h={700} f={f} n={14} />
      </Cold><NightMask W={W} H={H} x={960} y={540} r={1050} o={0.55} c="#04060a" /></g>
    );
  }

  // n=34: Desk corner with rainy window and off-lamp
  if (n === 34) {
    return (
      <g><Defs /><Cold>
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#090c12" />
        <Floor W={W} floorY={FLOOR} H={H} P={PAL} vx={W * 0.5} />
        <rect x={1100} y={80} width={500} height={420} fill="#0e1824" stroke="#080e14" strokeWidth={8} />
        <line x1={1350} y1={80} x2={1350} y2={500} stroke="#080e14" strokeWidth={6} />
        <LightPool x={1350} y={350} rx={460} ry={300} c="#8cb4d8" o={0.32} />
        <rect x={120} y={FLOOR - 220} width={580} height={40} fill="#2c2016" />
        <FullPerson s={J} x={520} y={FLOOR} k={0.32} f={f} view="three" face={-1} expr="fear" motion={{ type: 'sit' }} />
        {v.tears && <BlackTears x={460} y={FLOOR - 640} k={0.5} f={f} n={2} />}
        <Dust x={300} y={120} w={1300} h={700} f={f} n={14} />
      </Cold><NightMask W={W} H={H} x={960} y={540} r={1050} o={0.55} c="#04060a" /></g>
    );
  }

  // n=35, 36, 48: Venetian blinds slicing diagonal moonlight
  if (n === 35 || n === 36 || n === 48) {
    return (
      <g><Defs /><Cold>
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#08090e" />
        <Floor W={W} floorY={FLOOR} H={H} P={PAL} vx={W * 0.5} />
        {Array.from({ length: 12 }).map((_, i) => (
          <polygon key={i} points={`0,${60 + i * 80} 1920,${200 + i * 80} 1920,${245 + i * 80} 0,${105 + i * 80}`} fill="#283e58" opacity={0.32} />
        ))}
        <FullPerson s={J} x={960} y={FLOOR} k={0.34} f={f} view="three" face={-1} expr="fear" motion={{ type: 'reach' }} />
        {v.tears && <BlackTears x={900} y={FLOOR - 670} k={0.6} f={f} n={2} />}
        {v.tears && <BlackTears x={955} y={FLOOR - 670} k={0.6} f={f + 6} n={2} />}
        <ellipse cx={960} cy={FLOOR - 10} rx={160} ry={40} fill="#050508" stroke="#000" strokeWidth={4} />
        <Dust x={300} y={120} w={1300} h={700} f={f} n={14} />
      </Cold><NightMask W={W} H={H} x={960} y={540} r={980} o={0.6} c="#040508" /></g>
    );
  }

  // Default wide apartment (n=31, 37, 41, 42)
  return (
    <g><Defs /><Lgt>
      <Far b={2}><rect x={-200} y={-200} width={W + 400} height={FLOOR + 200} fill={dark ? '#12161e' : PAL.wall} />
        <Wall x={-200} y={-200} w={W + 400} h={FLOOR + 160} P={PAL} kind="plain" stains={1} /></Far>
      <Window x={220} y={150} w={340} h={380} f={f} P={PAL} moon curtains shaft={dark ? [320, FLOOR, 300] : null} />
      <Floor W={W} floorY={FLOOR} H={H} P={PAL} vx={W * 0.5} />
      <Door x={1560} y={FLOOR} w={300} h={640} P={PAL} id="rm" light={dark ? '#334' : null} />
      <rect x={1180} y={FLOOR - 300} width={300} height={210} rx={10} fill="#131a27" stroke="#262c34" strokeWidth={6} /><rect x={1200} y={FLOOR - 284} width={260} height={178} fill="#141a22" />
      <rect x={1200} y={FLOOR - 90} width={260} height={90} fill={PAL.woodD} />
      <rect x={700} y={FLOOR - 110} width={320} height={26} fill={PAL.wood} />
      <g transform={`translate(${430},${FLOOR - 150})`}><rect x={-6} y={-70} width={12} height={70} fill="#2a2024" /><path d="M-60,-130 L60,-130 L34,-70 L-34,-70Z" fill="#7a2a28" stroke="#3a1414" strokeWidth={4} />{!dark && <ellipse cx={0} cy={-96} rx={66} ry={30} fill={RED} opacity={0.4} />}</g>
      {!dark && <LightPool x={430} y={FLOOR - 120} rx={420} ry={320} c="#ff8a6a" o={0.16} />}
      <rect x={540} y={FLOOR - 240} width={620} height={240} rx={26} fill="#3a4154" stroke="#20283a" strokeWidth={6} />
      <FullPerson s={J} x={820} y={FLOOR} k={0.27} f={f} view="three" face={-1} expr={v.jexpr ?? (dark ? 'fear' : 'sad')} motion={{ type: v.reach ? 'reach' : 'sit' }} />
      {v.tears && <BlackTears x={760} y={FLOOR - 640} k={0.5} f={f} n={2} />}
      {v.tears && <BlackTears x={815} y={FLOOR - 640} k={0.5} f={f + 7} n={2} />}
      {v.ethan && <FullPerson s={E} x={1280} y={FLOOR} k={0.27} f={f} view="three" face={-1} expr="fear" motion={{ type: 'idle' }} />}
      {v.tag && <Tag at={[800, 360]} to={[1120, 250]} text="BLACK TEARS" f={t} t0={0.7} red size={30} />}
      <Dust x={300} y={120} w={1300} h={700} f={f} n={14} />
    </Lgt><NightMask W={W} H={H} x={820} y={560} r={1120} o={dark ? 0.68 : 0.52} c="#06080e" /></g>
  );
};

// 7 DOOR: the front door, Elisa's dark shape behind the frosted side-window; her calm voice.
const door: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const p = ease(t / len);
  const n = v.n ?? 38;

  // n=39: Hallway perspective looking down entryway corridor
  if (n === 39) {
    return (
      <g><Defs /><Moon>
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#0d1016" />
        <Floor W={W} floorY={FLOOR} H={H} P={PAL} vx={W * 0.5} />
        <rect x={1260} y={120} width={420} height={FLOOR - 120} fill="#241a14" stroke="#0a0806" strokeWidth={10} />
        <rect x={180} y={200} width={480} height={24} fill="#4a3624" />
        <path d={`M260,224 l40,160 l-24,0 l-32,-150Z`} fill="#222b3a" />
        <LightPool x={1470} y={400} rx={360} ry={280} c="#9fc0ff" o={0.25} />
        <FullPerson s={E} x={680} y={FLOOR} k={0.3} f={f} view="three" face={1} expr="fear" motion={{ type: 'idle' }} />
        <Dust x={300} y={120} w={1300} h={700} f={f} n={12} />
      </Moon><NightMask W={W} H={H} x={960} y={540} r={1100} o={0.4} c="#04060a" /></g>
    );
  }

  // n=41: Close-up on the door lock / peephole
  if (n === 41) {
    return (
      <g><Defs /><Moon>
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#0a0c10" />
        <rect x={200} y={40} width={800} height={H} fill="#2c2018" stroke="#120c08" strokeWidth={12} />
        <circle cx={600} cy={480} r={28} fill="#c8a850" stroke="#664e1e" strokeWidth={6} />
        <rect x={560} y={640} width={80} height={180} rx={10} fill="#cca854" stroke="#664e1e" strokeWidth={6} />
        <rect x={1100} y={80} width={500} height={H} fill="#1a2838" opacity={0.8} />
        <LightPool x={600} y={540} rx={480} ry={360} c="#ffd470" o={0.28} />
        <Dust x={300} y={120} w={1300} h={700} f={f} n={12} />
      </Moon><NightMask W={W} H={H} x={960} y={540} r={1050} o={0.42} c="#05070c" /></g>
    );
  }

  // Default door view (n=38)
  return (
    <g><Defs /><Moon>
      <Far b={2}><rect x={-200} y={-200} width={W + 400} height={FLOOR + 200} fill="#13171f" /></Far>
      <Floor W={W} floorY={FLOOR} H={H} P={PAL} vx={W * 0.5} />
      <rect x={640} y={FLOOR - 760} width={420} height={760} fill={PAL.woodD} stroke="#120d0a" strokeWidth={8} />
      <circle cx={1010} cy={FLOOR - 380} r={14} fill="#c8b070" />
      <rect x={1100} y={FLOOR - 720} width={160} height={640} fill="#4a5a68" opacity={0.7} stroke="#1a2028" strokeWidth={6} />
      <g opacity={0.6 + 0.2 * p}><ellipse cx={1180} cy={FLOOR - 520} rx={54} ry={70} fill="#0b0f16" /><rect x={1140} y={FLOOR - 460} width={80} height={300} rx={30} fill="#0b0f16" /></g>
      <Tag at={[1180, FLOOR - 540]} to={[1420, 300]} text="THEY ARE WAITING" f={t} t0={0.8} red size={28} />
      <Dust x={300} y={120} w={1300} h={700} f={f} n={12} />
    </Moon><NightMask W={W} H={H} x={860} y={520} r={1120} o={0.38} c="#05070c" /></g>
  );
};

// 8 WOODS: pine trunks at night; Jack runs from us / Ethan is dragged.
const woods: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const p = ease(t / len);
  const GY = FLOOR - 20;
  return (
    <g><Defs /><Moon>
      <Far b={2}><rect x={-200} y={-200} width={W + 400} height={GY + 200} fill="#090d16" />
        <ellipse cx={W * 0.5} cy={220} rx={140} ry={140} fill="#d2e0f8" opacity={0.16} />
        {[120, 360, 620, 940, 1280, 1580, 1780].map((x, i) => <rect key={i} x={x} y={-40} width={50 + (i % 3) * 14} height={GY + 60} fill="#0c121e" stroke="#05070c" strokeWidth={5} />)}
      </Far>
      <Floor W={W} floorY={GY} H={H} P={{ ...PAL, floor: '#141820', floorD: '#0a0d14' }} vx={W * 0.5} snow />
      <rect x={-200} y={GY} width={W + 400} height={H - GY + 200} fill="#141820" />
      <LightPool x={960} y={GY - 100} rx={700} ry={340} c="#9fc0ff" o={0.16} />
      {v.run ? (
        <g>
          <FullPerson s={J} x={1120 + 180 * p} y={GY} k={0.24} f={f} view="back" face={1} expr="fear" motion={{ type: 'run' }} />
          <FullPerson s={E} x={620 + 160 * p} y={GY} k={0.27} f={f} view="three" face={1} expr="fear" motion={{ type: 'run' }} />
        </g>
      ) : (
        <g>
          <FullPerson s={E} x={760} y={GY} k={0.28} f={f} view="three" face={1} expr="fear" motion={{ type: 'idle' }} />
          <Robed x={1320} y={GY} f={f} scale={0.3} face={-1} lantern />
        </g>
      )}
      <Dust x={300} y={120} w={1300} h={700} f={f} n={16} />
    </Moon><NightMask W={W} H={H} x={960} y={540} r={1180} o={0.42} c="#04060c" /></g>
  );
};

// 9 CLEARING: circle of robed students with torches.
const clearing: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const p = ease(t / len);
  const GY = FLOOR - 40;
  const n = v.n ?? 43;

  // n=50: Close-in behind robed cultists kneeling in semicircle
  if (n === 50) {
    return (
      <g><Defs /><Candle>
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#0d0910" />
        <rect x={-200} y={GY} width={W + 400} height={H - GY + 200} fill="#181216" />
        <BloodPool x={960} y={GY + 10} rx={380} ry={120} />
        {/* Massive kneeling cultists in foreground left and right */}
        <Robed x={340} y={GY + 80} f={f} scale={0.38} face={1} torch />
        <Robed x={1580} y={GY + 80} f={f + 8} scale={0.38} face={-1} torch />
        <LightPool x={960} y={GY - 120} rx={680} ry={340} c="#ff8834" o={0.36} />
        <MaskThing x={960 + (v.px ?? 0)} y={GY} f={f} k={0.44} face={v.face ?? 1} tar={v.tar ?? 0.65} tend={v.tend ?? 0.5} unmask={v.unmask} read={v.read} />
        <Dust x={300} y={120} w={1300} h={700} f={f} n={16} />
      </Candle><NightMask W={W} H={H} x={960} y={540} r={1080} o={0.42} c="#08040a" /></g>
    );
  }

  // n=47: Cold moon clearing with stone cairn and lone robed figure
  if (n === 47) {
    return (
      <g><Defs /><Moon>
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#060910" />
        <circle cx={W * 0.5} cy={160} r={180} fill="#9ebcf4" opacity={0.24} />
        <rect x={-200} y={GY} width={W + 400} height={H - GY + 200} fill="#0e1218" />
        <rect x={1400} y={GY - 340} width={140} height={340} fill="#1a202a" stroke="#080a0e" strokeWidth={8} />
        <LightPool x={960} y={GY - 100} rx={640} ry={300} c="#9fc0ff" o={0.22} />
        <Robed x={500} y={GY} f={f} scale={0.3} face={1} torch />
        <MaskThing x={960 + (v.px ?? 0)} y={GY} f={f} k={0.38} face={v.face ?? 1} tar={v.tar ?? 0.6} tend={v.tend ?? 0.4} unmask={v.unmask} read={v.read} />
        <Dust x={300} y={120} w={1300} h={700} f={f} n={16} />
      </Moon><NightMask W={W} H={H} x={960} y={540} r={1140} o={0.4} c="#040508" /></g>
    );
  }

  // n=56: Low angle through snow drifts with torchlight ring
  if (n === 56) {
    return (
      <g><Defs /><Candle>
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#14080c" />
        <rect x={-200} y={GY} width={W + 400} height={H - GY + 200} fill="#1c0e12" />
        <ellipse cx={960} cy={GY + 60} rx={600} ry={120} fill="none" stroke="#ff4820" strokeWidth={12} opacity={0.4} />
        <LightPool x={960} y={GY - 80} rx={700} ry={320} c="#ff8030" o={0.38} />
        <MaskThing x={960 + (v.px ?? 0)} y={GY} f={f} k={0.44} face={v.face ?? 1} tar={0.9} tend={0.7} unmask={v.unmask} read={v.read} />
        <Dust x={300} y={120} w={1300} h={700} f={f} n={16} />
      </Candle><NightMask W={W} H={H} x={960} y={540} r={1080} o={0.38} c="#08040a" /></g>
    );
  }

  // Default wide clearing
  return (
    <g><Defs /><Candle>
      <Far b={2}><rect x={-200} y={-200} width={W + 400} height={GY + 200} fill="#090a12" />
        <ellipse cx={W * 0.5} cy={200} rx={160} ry={160} fill="#c8d8f4" opacity={0.14} />
        {[80, 260, 1640, 1820].map((x, i) => <rect key={i} x={x} y={-40} width={60} height={GY + 60} fill="#0b0e16" stroke="#05070a" strokeWidth={5} />)}
      </Far>
      <Floor W={W} floorY={GY} H={H} P={{ ...PAL, floor: '#1a1418', floorD: '#0d0a0e' }} vx={W * 0.5} snow />
      <rect x={-200} y={GY} width={W + 400} height={H - GY + 200} fill="#1a1418" />
      <Spatter x={960} y={GY} r={280} n={24} red />
      {[420, 600, 780, 1140, 1320, 1500].map((x, i) => <Robed key={i} x={x} y={GY} f={f + i * 5} scale={0.24} face={x < 960 ? 1 : -1} torch />)}
      <LightPool x={960} y={GY - 120} rx={600} ry={300} c="#ffa84a" o={0.26} />
      <MaskThing x={960 + (v.px ?? 0)} y={GY} f={f} k={0.34} face={v.face ?? 1} tar={v.tar ?? 0.4} tend={v.tend ?? 0.2} unmask={v.unmask} read={v.read} />
      <FullPerson s={E} x={360} y={GY} k={0.26} f={f} view="three" face={1} expr="fear" motion={{ type: 'idle' }} />
      {v.tag && <Tag at={[960, 420]} to={[840, 300]} text="THE RITUAL WAS NOT FOR ME" f={t} t0={0.8} red size={28} />}
      <Dust x={300} y={120} w={1300} h={700} f={f} n={16} />
    </Candle><NightMask W={W} H={H} x={960} y={540} r={1180} o={0.36} c="#08060c" /></g>
  );
};

// 10 RITUAL: close inside the circle. The mask, the black tears, the cult kneeling.
const ritual: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const GY = FLOOR - 50;
  const n = v.n ?? 46;

  // n=51: Close perspective looking past cultist shoulders with tendrils rising high
  if (n === 51) {
    return (
      <g><Defs /><Candle>
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#14060a" />
        <rect x={-200} y={GY} width={W + 400} height={H - GY + 200} fill="#180a0e" />
        <BloodPool x={960} y={GY + 20} rx={480} ry={140} />
        {/* Giant tendrils curling high */}
        <Tendrils x={960} y={GY - 400} k={1.4} f={f} n={12} tar={0.9} />
        <LightPool x={960} y={GY - 200} rx={720} ry={420} c="#ff5020" o={0.38} />
        <MaskThing x={960 + (v.px ?? 0)} y={GY} f={f} k={0.46} face={v.face ?? 1} tar={v.tar ?? 0.8} tend={v.tend ?? 0.8} unmask={v.unmask} read={v.read} />
        <Dust x={300} y={120} w={1300} h={700} f={f} n={16} />
      </Candle><NightMask W={W} H={H} x={960} y={520} r={1050} o={0.45} c="#08040a" /></g>
    );
  }

  // n=48: Low profile angle with wooden post and blue mask halo
  if (n === 48) {
    return (
      <g><Defs /><Candle>
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#0d0408" />
        <rect x={-200} y={GY} width={W + 400} height={H - GY + 200} fill="#14080c" />
        <rect x={900} y={GY - 520} width={120} height={520} fill="#241418" stroke="#10080a" strokeWidth={8} />
        <circle cx={960} cy={GY - 340} r={160} fill="#62b4e8" opacity={0.3} />
        <LightPool x={960} y={GY - 180} rx={540} ry={300} c="#9fc0ff" o={0.35} />
        <MaskThing x={960 + (v.px ?? 0)} y={GY} f={f} k={0.5} face={v.face ?? 1} tar={0.8} tend={0.7} unmask={v.unmask} read={v.read} />
        <Dust x={300} y={120} w={1300} h={700} f={f} n={16} />
      </Candle><NightMask W={W} H={H} x={960} y={520} r={1050} o={0.42} c="#060206" /></g>
    );
  }

  // n=52: Wide angle looking from behind the cultists toward the pillar
  if (n === 52) {
    return (
      <g><Defs /><Candle>
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#10060c" />
        <rect x={-200} y={GY} width={W + 400} height={H - GY + 200} fill="#180c12" />
        <BloodPool x={960} y={GY + 10} rx={420} ry={130} />
        <Robed x={240} y={GY + 40} f={f} scale={0.34} face={1} torch />
        <Robed x={1680} y={GY + 40} f={f + 5} scale={0.34} face={-1} torch />
        <LightPool x={960} y={GY - 140} rx={660} ry={360} c="#ff6428" o={0.35} />
        <MaskThing x={960 + (v.px ?? 0)} y={GY} f={f} k={0.42} face={v.face ?? -1} tar={0.85} tend={0.9} unmask={v.unmask} read={v.read} />
        <Dust x={300} y={120} w={1300} h={700} f={f} n={16} />
      </Candle><NightMask W={W} H={H} x={960} y={520} r={1080} o={0.42} c="#08040a" /></g>
    );
  }

  // Default ritual (n=46)
  return (
    <g><Defs /><Candle>
      <Far b={2}><rect x={-200} y={-200} width={W + 400} height={GY + 200} fill="#0d080c" /></Far>
      <Floor W={W} floorY={GY} H={H} P={{ ...PAL, floor: '#1e1014', floorD: '#0c0608' }} vx={W * 0.5} snow />
      <rect x={-200} y={GY} width={W + 400} height={H - GY + 200} fill="#1e1014" />
      <BloodPool x={960} y={GY + 10} rx={360} ry={110} />
      {[380, 520, 1400, 1540].map((x, i) => <Robed key={i} x={x} y={GY} f={f + i * 7} scale={0.26} face={x < 960 ? 1 : -1} torch />)}
      <LightPool x={960} y={GY - 160} rx={640} ry={360} c="#ff7a3a" o={0.32} />
      <MaskThing x={960 + (v.px ?? 0)} y={GY} f={f} k={0.4} face={v.face ?? 1} tar={v.tar ?? 0.7} tend={v.tend ?? 0.6} unmask={v.unmask} read={v.read} />
      <Dust x={300} y={120} w={1300} h={700} f={f} n={16} />
    </Candle><NightMask W={W} H={H} x={960} y={520} r={1080} o={0.42} c="#08040a" /></g>
  );
};

// 11 UNLEASHED: Jack completely transformed.
const unleashed: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const GY = FLOOR - 40;
  const n = v.n ?? 53;

  // n=59: Full-body silhouette of the beast against massive glowing moon disk on left
  if (n === 59) {
    return (
      <g><Defs /><Moon>
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#04060c" />
        <ellipse cx={480} cy={220} rx={260} ry={260} fill="#b8d4f8" opacity={0.3} />
        <circle cx={480} cy={220} r={120} fill="#eef6ff" opacity={0.6} />
        <LightPool x={480} y={220} rx={600} ry={400} c="#9fc0ff" o={0.35} />
        <rect x={-200} y={GY} width={W + 400} height={H - GY + 200} fill="#0c1018" />
        <Spatter x={960} y={GY} r={520} n={48} red />
        <MaskThing x={960 + (v.px ?? 0)} y={GY} f={f} k={0.48} face={v.face ?? -1} pose={v.pose ?? 'loom'} pp={v.pp ?? 0.9} tar={0.98} tend={1.0} />
        <Dust x={300} y={120} w={1300} h={700} f={f} n={18} />
      </Moon><NightMask W={W} H={H} x={960} y={540} r={1160} o={0.4} c="#04050a" /></g>
    );
  }

  // Default unleashed (n=53, 55, 57, 58)
  return (
    <g><Defs /><Moon>
      <Far b={2}><rect x={-200} y={-200} width={W + 400} height={GY + 200} fill="#06070e" />
        <ellipse cx={W * 0.5} cy={180} rx={180} ry={180} fill="#9ec0f8" opacity={0.18} />
        {[140, 1780].map((x, i) => <rect key={i} x={x} y={-40} width={80} height={GY + 60} fill="#080a12" stroke="#030408" strokeWidth={6} />)}
      </Far>
      <Floor W={W} floorY={GY} H={H} P={{ ...PAL, floor: '#10141c', floorD: '#080a0e' }} vx={W * 0.5} snow />
      <rect x={-200} y={GY} width={W + 400} height={H - GY + 200} fill="#10141c" />
      <Spatter x={960} y={GY} r={420} n={36} red />
      <LightPool x={960} y={GY - 140} rx={720} ry={380} c="#9fc0ff" o={0.2} />
      <MaskThing x={960 + (v.px ?? 0)} y={GY} f={f} k={0.42} face={v.face ?? 1} pose={v.pose ?? 'stalk'} pp={v.pp ?? 0.5} tar={0.95} tend={1.0} />
      <Dust x={300} y={120} w={1300} h={700} f={f} n={18} />
    </Moon><NightMask W={W} H={H} x={960} y={540} r={1160} o={0.45} c="#04050a" /></g>
  );
};

// 12 HOSPITAL: morning; Ethan in bed, officer beside him.
const hospital: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const n = v.n ?? 56;

  // n=57: Glowing vital signs monitor in foreground
  if (n === 57) {
    return (
      <g><Defs /><Cold>
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#0d181c" />
        <Floor W={W} floorY={FLOOR} H={H} P={{ ...PAL, floor: '#1e2830', floorD: '#10161c' }} vx={W * 0.5} />
        <rect x={140} y={160} width={540} height={380} rx={18} fill="#071216" stroke="#1d3e46" strokeWidth={8} />
        <path d="M 160 350 L 280 350 L 310 260 L 340 420 L 370 300 L 400 350 L 660 350" stroke="#42e698" strokeWidth={6} fill="none" />
        <LightPool x={410} y={350} rx={420} ry={280} c="#40e090" o={0.35} />
        <LyingPerson s={E} x={1280} surfaceY={FLOOR - 50} k={0.36} f={f} expr={v.expr ?? 'sad'} head={-1} sheet sheetC={PAL.sheet} uid="hosp2" fit={760} />
        <Stain x={1380} y={FLOOR - 120} r={60} grow={1} o={0.7} />
        <Tag at={[1380, FLOOR - 120]} to={[1180, 280]} text="A KIDNEY GONE" f={t} t0={0.8} red size={28} />
        <Dust x={300} y={120} w={1300} h={700} f={f} n={12} />
      </Cold><NightMask W={W} H={H} x={960} y={540} r={1120} o={0.3} c="#060a0e" /></g>
    );
  }

  // n=59: Window angle with Officer Reyes standing by the bedside
  if (n === 59) {
    return (
      <g><Defs /><Cold>
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#101820" />
        <Floor W={W} floorY={FLOOR} H={H} P={{ ...PAL, floor: '#1e2830', floorD: '#10161c' }} vx={W * 0.5} />
        <rect x={160} y={80} width={480} height={600} fill="#243e4c" stroke="#0e1820" strokeWidth={10} />
        <line x1={400} y1={80} x2={400} y2={680} stroke="#0e1820" strokeWidth={8} />
        <LightPool x={400} y={380} rx={460} ry={340} c="#9fd4e8" o={0.3} />
        <FullPerson s={OFF} x={880} y={FLOOR} k={0.32} f={f} view="three" face={1} expr="worry" motion={{ type: 'idle' }} />
        <LyingPerson s={E} x={1420} surfaceY={FLOOR - 50} k={0.32} f={f} expr="sad" head={-1} sheet sheetC={PAL.sheet} uid="hosp3" fit={640} />
        <Dust x={300} y={120} w={1300} h={700} f={f} n={12} />
      </Cold><NightMask W={W} H={H} x={960} y={540} r={1120} o={0.3} c="#060a0e" /></g>
    );
  }

  // Default hospital (n=56)
  return (
    <g><Defs /><Cold>
      <Far b={2}><rect x={-200} y={-200} width={W + 400} height={FLOOR + 200} fill="#141c22" />
        <rect x={-200} y={-200} width={W + 400} height={FLOOR + 160} fill="#1b242c" />
        {Array.from({ length: 8 }).map((_, r) => <line key={r} x1={-200} y1={100 + r * 90} x2={W + 200} y2={100 + r * 90} stroke="#10151b" strokeWidth={3} />)}
        <Window x={1280} y={140} w={360} h={420} f={f} P={PAL} moon curtains={false} />
      </Far>
      <Floor W={W} floorY={FLOOR} H={H} P={{ ...PAL, floor: '#1e2830', floorD: '#10161c' }} vx={W * 0.5} />
      <rect x={360} y={FLOOR - 560} width={8} height={460} fill="#9aa6b2" /><rect x={320} y={FLOOR - 600} width={90} height={60} rx={10} fill="#cdd6de" opacity={0.7} />
      <rect x={560} y={FLOOR - 40} width={900} height={40} fill="#9aa6b2" /><path d={`M560,${FLOOR - 40} l-30,120 M1460,${FLOOR - 40} l30,120`} stroke="#6a7682" strokeWidth={12} />
      <LyingPerson s={E} x={1000} surfaceY={FLOOR - 50} k={0.4} f={f} expr={v.expr ?? 'sad'} head={-1} sheet sheetC={PAL.sheet} uid="hosp" fit={760} />
      <Stain x={1120} y={FLOOR - 120} r={70} grow={1} o={0.7} />
      {v.officer && <FullPerson s={OFF} x={520} y={FLOOR} k={0.3} f={f} view="three" face={1} expr="worry" motion={{ type: 'idle' }} />}
      {v.tag && <Tag at={[1120, FLOOR - 120]} to={[760, 300]} text="A KIDNEY GONE" f={t} t0={0.8} red size={28} />}
      <Dust x={300} y={120} w={1300} h={700} f={f} n={12} />
    </Cold><NightMask W={W} H={H} x={1000} y={560} r={1200} o={0.3} c="#0a0e14" /></g>
  );
};

// 13 FACE: close-ups with distinct environmental backgrounds per location
const face: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const p = ease(t / len);
  const who = v.who === 'jack' ? J : v.who === 'elisa' ? EL : E;
  const Lgt = v.warm ? Warm : Cold;
  const n = v.n ?? 2;

  return (
    <g><Defs /><Lgt>
      <rect x={0} y={0} width={W} height={H} fill={v.warm ? '#1a1510' : '#141a22'} />

      {/* n=2: Library face (monitor right, books left) */}
      {n === 2 && (
        <g>
          <rect x={40} y={60} width={320} height={960} fill="#182230" stroke="#0c121c" strokeWidth={8} />
          {Array.from({ length: 6 }).map((_, r) => <rect key={r} x={60} y={100 + r * 150} width={280} height={10} fill="#0d141e" />)}
          <rect x={1480} y={160} width={400} height={420} rx={14} fill="#09141c" stroke="#1c3040" strokeWidth={6} />
          <rect x={1500} y={180} width={360} height={380} fill="#103c4e" opacity={0.7} />
          <LightPool x={1680} y={370} rx={420} ry={300} c="#62d8ea" o={0.3} />
        </g>
      )}

      {/* n=4: Library face (cold window left, blue light) */}
      {n === 4 && (
        <g>
          <rect x={80} y={100} width={420} height={600} fill="#1c344c" stroke="#0a121c" strokeWidth={10} />
          <line x1={290} y1={100} x2={290} y2={700} stroke="#0a121c" strokeWidth={8} />
          <LightPool x={290} y={400} rx={460} ry={340} c="#82c4f0" o={0.35} />
        </g>
      )}

      {/* n=70: Library face (narrow aisle stacks behind) */}
      {n === 70 && (
        <g>
          <rect x={0} y={0} width={W} height={H} fill="#080e18" />
          <polygon points="200,H 1720,H 1200,200 720,200" fill="#141e2e" />
          <LightPool x={960} y={300} rx={500} ry={260} c="#52c0dc" o={0.32} />
        </g>
      )}

      {/* n=10: Common face (Jack, warm picture frame) */}
      {n === 10 && (
        <g>
          <rect x={0} y={0} width={W} height={H} fill="#201812" />
          <rect x={80} y={120} width={380} height={480} fill="#322216" stroke="#160e08" strokeWidth={8} />
          <rect x={1420} y={100} width={440} height={320} fill="#143648" stroke="#1c4c62" strokeWidth={6} />
          <LightPool x={1640} y={260} rx={460} ry={280} c="#6ae0d4" o={0.35} />
        </g>
      )}

      {/* n=14: Common face (Elisa, game screen green/cyan glow) */}
      {n === 14 && (
        <g>
          <rect x={0} y={0} width={W} height={H} fill="#181e18" />
          <rect x={100} y={140} width={500} height={380} rx={16} fill="#0d241c" stroke="#1a4436" strokeWidth={8} />
          <LightPool x={350} y={330} rx={440} ry={300} c="#52e0a4" o={0.35} />
        </g>
      )}

      {/* n=16: Common face (Jack, dark doorway slit behind) */}
      {n === 16 && (
        <g>
          <rect x={0} y={0} width={W} height={H} fill="#241c14" />
          <rect x={1380} y={80} width={420} height={800} fill="#120c08" stroke="#3a2818" strokeWidth={8} />
          <LightPool x={800} y={400} rx={480} ry={320} c="#ffb050" o={0.32} />
        </g>
      )}

      {/* n=20: Cafeteria face (Jack, orange menu board) */}
      {n === 20 && (
        <g>
          <rect x={0} y={0} width={W} height={H} fill="#161c24" />
          <rect x={100} y={120} width={500} height={140} fill="#10151e" stroke="#2a3444" strokeWidth={6} />
          <rect x={0} y={680} width={W} height={400} fill="#626e7c" stroke="#1a222c" strokeWidth={6} />
          <LightPool x={960} y={200} rx={600} ry={200} c="#ffe8a8" o={0.25} />
        </g>
      )}

      {/* n=24: Hall face (Elisa, metal lockers) */}
      {n === 24 && (
        <g>
          <rect x={0} y={0} width={W} height={H} fill="#141c26" />
          <rect x={60} y={40} width={440} height={1000} fill="#263848" stroke="#101820" strokeWidth={8} />
          {Array.from({ length: 12 }).map((_, r) => <rect key={r} x={100} y={80 + r * 76} width={360} height={6} fill="#101820" />)}
          <rect x={1360} y={160} width={480} height={360} fill="#54442a" stroke="#2c2214" strokeWidth={6} />
          <LightPool x={960} y={60} rx={700} ry={160} c="#e4f0fc" o={0.35} />
        </g>
      )}

      {/* n=33: Apartment face (Jack, venetian blinds diagonal stripes) */}
      {n === 33 && (
        <g>
          <rect x={0} y={0} width={W} height={H} fill="#0a0b10" />
          {Array.from({ length: 10 }).map((_, i) => (
            <polygon key={i} points={`0,${100 + i * 90} 1920,${240 + i * 90} 1920,${280 + i * 90} 0,${140 + i * 90}`} fill="#283e58" opacity={0.38} />
          ))}
        </g>
      )}

      {/* n=44: Clearing face (Ethan, pine trunks + moon) */}
      {n === 44 && (
        <g>
          <rect x={0} y={0} width={W} height={H} fill="#05080e" />
          <rect x={100} y={0} width={140} height={H} fill="#020306" /><rect x={1680} y={0} width={160} height={H} fill="#020306" />
          <circle cx={960} cy={180} r={180} fill="#c8e2f8" opacity={0.28} />
          <LightPool x={960} y={180} rx={440} ry={320} c="#9cc8f4" o={0.3} />
        </g>
      )}

      {/* n=49: Clearing face (Ethan, blazing orange torch glow on right) */}
      {n === 49 && (
        <g>
          <rect x={0} y={0} width={W} height={H} fill="#0e0608" />
          <rect x={1520} y={140} width={60} height={600} fill="#3a1c0a" />
          <ellipse cx={1550} cy={120} rx={90} ry={140} fill="#ff7020" opacity={0.8} />
          <LightPool x={1400} y={300} rx={500} ry={360} c="#ff5a10" o={0.42} />
        </g>
      )}

      {/* n=54: Clearing face (Ethan, cult silhouettes in shadow behind) */}
      {n === 54 && (
        <g>
          <rect x={0} y={0} width={W} height={H} fill="#08040a" />
          {[240, 520, 1400, 1680].map((x, i) => (
            <ellipse key={i} cx={x} cy={380} rx={70} ry={120} fill="#030206" />
          ))}
          <LightPool x={960} y={260} rx={420} ry={240} c="#9a48d0" o={0.25} />
        </g>
      )}

      {/* n=58: Hospital face (Ethan, green ECG heart line) */}
      {n === 58 && (
        <g>
          <rect x={0} y={0} width={W} height={H} fill="#0a1418" />
          <rect x={1320} y={140} width={500} height={360} rx={16} fill="#061214" stroke="#16383e" strokeWidth={6} />
          <path d="M 1340 320 L 1440 320 L 1470 240 L 1500 390 L 1530 280 L 1560 320 L 1800 320" stroke="#42e698" strokeWidth={5} fill="none" />
          <LightPool x={1560} y={320} rx={400} ry={260} c="#40e090" o={0.35} />
        </g>
      )}

      <LightPool x={960} y={360} rx={700} ry={420} c={v.warm ? '#ffe6b8' : '#9fc0ff'} o={0.12} />
      <g transform={`translate(${v.x ?? 960},560) scale(0.96)`}>
        <CloseUp s={who} expr={v.expr ?? 'fear'} f={f} turn={(v.turn ?? 0.1) + 0.2 * p} uid={`fc-${v.who ?? 'e'}`} />
        {v.tears && <BlackTears x={-70} y={-150} k={1.1} f={f} n={2} />}
        {v.tears && <BlackTears x={70} y={-150} k={1.1} f={f + 6} n={2} />}
      </g>
      {v.tag && <Tag at={[1120, 420]} to={[1460, 260]} text={String(v.tag)} f={t} t0={0.6} red size={28} />}
      <NightMask W={W} H={H} x={960} y={520} r={860} o={0.5} c="#05070c" />
    </Lgt></g>
  );
};

// 14 CREDIT: the torn notebook page with the credit line.
const credit: React.FC<SetProps> = ({ f, t = 0 }) => {
  const a = ease(t / 30);
  return (
    <g opacity={a}><Defs />
      <rect x={0} y={0} width={W} height={H} fill="#131a27" />
      <g transform={`translate(${(W - 1080) / 2},${(H - 560) / 2}) rotate(-1 540 280)`}>
        <NotebookPage w={1080} h={560} />
        <text x={540} y={170} textAnchor="middle" fontFamily="Lora" fontStyle="italic" fontSize={44} fill="#2a2a2e">This video is inspired by the story</text>
        <text x={540} y={260} textAnchor="middle" fontFamily="Lora" fontWeight={700} fontSize={62} fill="#1a1a1e">You Can't Trust Everyone</text>
        <text x={540} y={340} textAnchor="middle" fontFamily="Lora" fontStyle="italic" fontSize={38} fill="#3a3a40">as published on an online horror story page</text>
        <text x={540} y={450} textAnchor="middle" fontFamily="Lora" fontWeight={700} fontSize={32} fill="#b3221f">Fiction. Retold in our own words.</text>
      </g>
    </g>
  );
};

// 15 END SCREEN (long, last 20 s): the closing question stays the last on-screen text. Forest, a cult silhouette.
const end: React.FC<SetProps> = ({ f }) => <EndScreen f={f} fps={30} question="Who would you have trusted?" hero="sam" ghost="woman" />;

void WallDrips; void PictureFrame; void ease;
export const SETS: Record<string, React.FC<SetProps>> = { library, common, cafeteria, hall, phone, apartment, door, woods, clearing, ritual, unleashed, hospital, face, credit, end };
