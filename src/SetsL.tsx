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
// ===== STORY SLOT: LONG-video sets (1920x1080) for "You Can't Trust Everyone". Every set reads f (1/30 s), t, len.
// Rooms carry 5+ readable objects and two light sources; every shot has a camera move (Player) AND intrinsic motion.
const E = CAST.sam, J = CAST.noah, EL = CAST.mira, OFF = CAST.dale;

const Ceiling: React.FC<{ y?: number; c?: string }> = ({ y = -40, c = '#eef4ff' }) => <rect x={320} y={y} width={1280} height={30} fill={c} opacity={0.85} />;

// 1 LIBRARY: the college computer lab at night. Ethan types; he glances back at the dark shelves.
const library: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const p = ease(t / len); const glow = 0.5 + 0.5 * Math.sin(f / 9);
  return (
    <g>
      <Defs />
      <Cold>
        <Far b={3}><rect x={-200} y={-200} width={W + 400} height={FLOOR + 200} fill={PAL.wall} />
          {/* tall bookshelves */}
          {[80, 320, 1560].map((x, i) => <g key={i}><rect x={x} y={120} width={200} height={FLOOR - 120} fill={PAL.wallD} stroke="#10141c" strokeWidth={5} />
            {Array.from({ length: 7 }).map((_, r) => <rect key={r} x={x + 12} y={150 + r * 84} width={176} height={10} fill="#1c222c" />)}
            {Array.from({ length: 7 }).map((_, r) => Array.from({ length: 9 }).map((_, b) => <rect key={b} x={x + 16 + b * 19} y={150 + r * 84 - 54} width={15} height={56} fill={['#5a6472', '#45506a', '#6a5a4a', '#3c4656'][(r + b) % 4]} />))}
          </g>)}
        </Far>
        <Ceiling />
        <Window x={800} y={150} w={320} h={360} f={f} P={PAL} moon curtains={false} />
        <Floor W={W} floorY={FLOOR} H={H} P={PAL} vx={W * 0.5} />
        {/* desk with a row of monitors */}
        <rect x={360} y={FLOOR - 150} width={1200} height={40} fill={PAL.wood} stroke={PAL.woodD} strokeWidth={5} />
        <rect x={360} y={FLOOR - 110} width={1200} height={110} fill={PAL.woodD} />
        {[560, 1180].map((mx, i) => <g key={i}><rect x={mx} y={FLOOR - 330} width={300} height={200} rx={8} fill="#0a1016" stroke="#2a3240" strokeWidth={6} />
          <rect x={mx + 16} y={FLOOR - 314} width={268} height={168} fill="#17384a" opacity={0.5 + 0.5 * glow} />
          {Array.from({ length: 6 }).map((_, r) => <rect key={r} x={mx + 28} y={FLOOR - 300 + r * 24} width={180 - (r % 3) * 40} height={6} fill="#7fd4e6" opacity={0.6} />)}
          <rect x={mx + 60} y={FLOOR - 128} width={180} height={14} fill="#20262e" /></g>)}
        <LightPool x={760} y={FLOOR - 230} rx={520} ry={240} c="#8fd4e6" o={0.14 + 0.06 * glow} />
        {/* Ethan at the keyboard, turning to look back */}
        <FullPerson s={E} x={820} y={FLOOR} k={0.3} f={f} view="three" face={-1} expr={v.expr ?? 'worry'} turn={0.2 - 0.5 * p} motion={{ type: 'idle' }} />
        {v.watch && <rect x={120} y={200} width={190} height={FLOOR - 200} fill="#05070b" opacity={0.7} />}
        {v.tag && <Tag at={[300, 360]} to={[250, 250]} text="WATCHED" f={t} t0={0.7} red />}
        <Dust x={300} y={120} w={1300} h={700} f={f} n={18} />
      </Cold>
      <NightMask W={W} H={H} x={820} y={560} r={1120} o={0.58} c="#06080e" />
    </g>
  );
};

// 2 COMMON ROOM: the dorm common room where Ethan and Jack play games.
const common: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const g = 0.5 + 0.5 * Math.sin(f / 7);
  const who = v.who ?? 'both';
  return (
    <g>
      <Defs />
      <Warm>
        <Far b={2}><rect x={-200} y={-200} width={W + 400} height={FLOOR + 200} fill={PAL.wall} />
          <Wall x={-200} y={-200} w={W + 400} h={FLOOR + 160} P={PAL} kind="plain" id="rm" stains={0} />
          <PictureFrame x={360} y={150} w={360} h={240} P={PAL} id="rm"><rect x={0} y={0} width={360} height={240} fill="#2a3450" /><text x={180} y={140} textAnchor="middle" fontFamily="Lora" fontSize={44} fill="#8a96b0">WASTED YOUTH</text></PictureFrame>
        </Far>
        <Floor W={W} floorY={FLOOR} H={H} P={PAL} vx={W * 0.5} />
        <Rug x={520} y={FLOOR - 40} w={1000} h={220} c="#3a3048" c2="#6a5a7a" />
        {/* TV with a game on */}
        <rect x={1280} y={FLOOR - 430} width={460} height={300} rx={10} fill="#07090d" stroke="#2a3240" strokeWidth={7} />
        <rect x={1298} y={FLOOR - 414} width={424} height={268} fill="#14415a" opacity={0.55 + 0.45 * g} />
        <path d={`M1360,${FLOOR - 280} l80,-40 l80,40 l-80,40Z`} fill="#7fe0d0" opacity={0.6 + 0.4 * g} />
        <rect x={1300} y={FLOOR - 120} width={420} height={110} fill={PAL.woodD} />
        {/* low table, pizza box, controllers */}
        <rect x={720} y={FLOOR - 120} width={360} height={28} fill={PAL.wood} /><rect x={740} y={FLOOR - 92} width={60} height={90} fill={PAL.woodD} /><rect x={1000} y={FLOOR - 92} width={60} height={90} fill={PAL.woodD} />
        <rect x={770} y={FLOOR - 150} width={150} height={34} fill="#b8783a" stroke="#6a3a18" strokeWidth={4} />
        {/* couch */}
        <rect x={420} y={FLOOR - 250} width={620} height={250} rx={28} fill="#45506a" stroke="#242b3a" strokeWidth={6} />
        <rect x={440} y={FLOOR - 300} width={580} height={90} rx={24} fill="#515e7c" />
        <LightPool x={1500} y={FLOOR - 280} rx={420} ry={260} c="#7fe0d0" o={0.12} />
        <LightPool x={500} y={200} rx={360} ry={260} c="#ffd27a" o={0.16} />
        {(who === 'both' || who === 'ethan') && <FullPerson s={E} x={640} y={FLOOR} k={0.26} f={f} view="three" face={1} expr={v.expr ?? 'smile'} motion={{ type: 'sit' }} />}
        {(who === 'both' || who === 'jack') && <FullPerson s={J} x={860} y={FLOOR} k={0.26} f={f} view="three" face={-1} expr={v.jexpr ?? 'smile'} motion={{ type: 'sit' }} />}
        <Dust x={300} y={120} w={1300} h={700} f={f} n={16} />
      </Warm>
      <NightMask W={W} H={H} x={960} y={560} r={1180} o={0.5} c="#0a0a12" />
    </g>
  );
};

// 3 CAFETERIA: the serving line. Jack snaps and a student flinches back.
const cafeteria: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const p = ease(t / len);
  return (
    <g>
      <Defs />
      <Cold>
        <Far b={2}><rect x={-200} y={-200} width={W + 400} height={FLOOR + 200} fill={PAL.wall} />
          <rect x={200} y={120} width={520} height={120} fill="#10151e" stroke="#2a3140" strokeWidth={5} /><text x={460} y={200} textAnchor="middle" fontFamily="Lora" fontSize={52} fill="#9fb0c4">TODAY</text>
          {[1180, 1420, 1660].map((x, i) => <rect key={i} x={x} y={120} width={180} height={420} fill={PAL.wallD} stroke="#10141c" strokeWidth={4} />)}
        </Far>
        {[520, 900, 1280].map((x, i) => <rect key={i} x={x} y={-40} width={70} height={150} fill="#1a2028" />)}
        {[520, 900, 1280].map((x, i) => <ellipse key={i} cx={x + 35} cy={120} rx={120} ry={34} fill="#ffe6b8" opacity={0.12} />)}
        <Floor W={W} floorY={FLOOR} H={H} P={PAL} vx={W * 0.5} />
        {/* serving counter + trays */}
        <rect x={120} y={FLOOR - 230} width={1040} height={60} fill="#8a94a0" stroke="#2a3038" strokeWidth={5} />
        <rect x={120} y={FLOOR - 170} width={1040} height={150} fill="#4a525e" />
        {[200, 360, 520, 680, 840].map((x, i) => <rect key={'t' + i} x={x} y={FLOOR - 250} width={120} height={24} rx={6} fill="#aeb6c0" stroke="#2a3038" strokeWidth={3} />)}
        {/* a student flinching back */}
        <FullPerson s={EL} x={1420 + 80 * p} y={FLOOR} k={0.27} f={f} view="three" face={-1} expr="shock" motion={{ type: 'recoil' }} uid="caf-st" />
        {/* Jack, turned, shouting */}
        <FullPerson s={J} x={1120} y={FLOOR} k={0.29} f={f} view="three" face={1} expr="stern" turn={0.3 * p} motion={{ type: 'point' }} />
        {v.tray && <g>{[0, 1, 2].map((i) => <rect key={i} x={1000 + i * 40} y={FLOOR - 20 - i * 10} width={120} height={20} rx={6} fill="#aeb6c0" transform={`rotate(${-20 + i * 14} ${1060} ${FLOOR})`} />)}</g>}
        <Tag at={[1180, 360]} to={[1280, 250]} text="THAT WAS NOT MY FRIEND" f={t} t0={0.7} red size={28} />
        <Dust x={300} y={120} w={1300} h={700} f={f} n={14} />
      </Cold>
      <NightMask W={W} H={H} x={960} y={560} r={1200} o={0.46} c="#0a0e14" />
    </g>
  );
};

// 4 HALL: a hall of lockers. Elisa says the cold line; her smile is wrong.
const hall: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const p = ease(t / len);
  return (
    <g>
      <Defs />
      <Cold>
        <Far b={2}><rect x={-200} y={-200} width={W + 400} height={FLOOR + 200} fill={PAL.wall} />
          {/* lockers */}
          {Array.from({ length: 14 }).map((_, i) => <g key={i}><rect x={120 + i * 92} y={200} width={84} height={420} fill={i % 2 ? '#3a5060' : '#365466'} stroke="#182028" strokeWidth={4} />
            <circle cx={120 + i * 92 + 64} cy={420} r={6} fill="#1a2028" /><rect x={120 + i * 92 + 24} y={250} width={36} height={8} fill="#1a2028" /></g>)}
        </Far>
        {/* notice board */}
        <rect x={1180} y={220} width={520} height={300} fill="#6a5a3e" stroke="#3a2e18" strokeWidth={8} />
        {Array.from({ length: 10 }).map((_, i) => <rect key={i} x={1210 + (i % 5) * 96} y={250 + Math.floor(i / 5) * 130} width={78} height={104} fill={['#d8d2c4', '#c8d0d8', '#e0d0c0'][i % 3]} transform={`rotate(${(i % 3 - 1) * 4} ${1250 + (i % 5) * 96} ${300})`} />)}
        <circle cx={960} cy={160} r={46} fill="#e8eef6" stroke="#2a3038" strokeWidth={6} /><path d={`M960,160 L960,128 M960,160 L982,168`} stroke="#1a2028" strokeWidth={4} />
        <Window x={300} y={160} w={220} h={300} f={f} P={PAL} moon curtains={false} />
        <Floor W={W} floorY={FLOOR} H={H} P={PAL} vx={W * 0.5} planks={20} />
        {/* Ethan (near, back to us) and Elisa (facing, cold smile) */}
        <FullPerson s={E} x={560} y={FLOOR} k={0.3} f={f} view="three" face={1} expr="worry" motion={{ type: 'idle' }} />
        <FullPerson s={EL} x={1200 - 40 * p} y={FLOOR} k={0.29} f={f} view="three" face={-1} expr={v.expr ?? 'smile'} turn={-0.2} motion={{ type: 'idle' }} />
        {v.tag && <Tag at={[1200, 360]} to={[1480, 250]} text="BETTER THAN EVER" f={t} t0={0.8} red size={30} />}
        <Dust x={300} y={120} w={1300} h={700} f={f} n={14} />
      </Cold>
      <NightMask W={W} H={H} x={960} y={560} r={1180} o={0.5} c="#0a0e14" />
    </g>
  );
};

// 5 PHONE: Ethan's room at night, on the phone. His face lit by the screen.
const phone: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const g = 0.6 + 0.4 * Math.sin(f / 11);
  return (
    <g>
      <Defs />
      <Warm>
        <Far b={2}><rect x={-200} y={-200} width={W + 400} height={FLOOR + 200} fill={PAL.wall} />
          <Wall x={-200} y={-200} w={W + 400} h={FLOOR + 160} P={PAL} kind="plain" stains={0} /></Far>
        <Window x={1280} y={150} w={360} h={380} f={f} P={PAL} moon curtains />
        <Floor W={W} floorY={FLOOR} H={H} P={PAL} vx={W * 0.5} />
        {/* desk + laptop + lamp */}
        <rect x={980} y={FLOOR - 140} width={620} height={36} fill={PAL.wood} /><rect x={980} y={FLOOR - 104} width={620} height={104} fill={PAL.woodD} />
        <rect x={1140} y={FLOOR - 250} width={220} height={120} rx={8} fill="#0a1016" stroke="#2a3240" strokeWidth={5} /><rect x={1156} y={FLOOR - 236} width={188} height={92} fill="#17384a" opacity={0.5} />
        <g transform={`translate(${1420},${FLOOR - 150})`}><rect x={-8} y={-60} width={16} height={60} fill="#2a3038" /><path d="M-70,-120 L70,-120 L40,-60 L-40,-60Z" fill="#3a3330" stroke="#1a1612" strokeWidth={4} /><ellipse cx={0} cy={-80} rx={70} ry={30} fill="#ffe6b8" opacity={0.3} /></g>
        <LightPool x={1420} y={FLOOR - 120} rx={420} ry={300} c="#ffe6b8" o={0.18} />
        {/* bed in the near corner */}
        <rect x={120} y={FLOOR - 170} width={560} height={170} rx={14} fill={PAL.quiltB} stroke="#20283a" strokeWidth={5} /><rect x={120} y={FLOOR - 220} width={200} height={70} rx={14} fill={PAL.sheet} />
        {/* Ethan sitting, phone glow on his face */}
        <FullPerson s={E} x={760} y={FLOOR} k={0.28} f={f} view="three" face={1} expr={v.expr ?? 'worry'} motion={{ type: 'sit' }} />
        <ellipse cx={820} cy={FLOOR - 560} rx={60} ry={90} fill="#bfe0ff" opacity={0.18 * g} />
        {v.tag && <Tag at={[760, 400]} to={[1100, 280]} text="HIS VOICE WAS SHAKING" f={t} t0={0.7} size={26} />}
        <Dust x={300} y={120} w={1300} h={700} f={f} n={14} />
      </Warm>
      <NightMask W={W} H={H} x={820} y={560} r={1120} o={0.56} c="#080a10" />
    </g>
  );
};

// 6 APARTMENT: the living room. v.dark turns the lamp off; v.tears puts black tears on Jack.
const apartment: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const dark = !!v.dark; const Lgt = dark ? Moon : Warm;
  return (
    <g>
      <Defs />
      <Lgt>
        <Far b={2}><rect x={-200} y={-200} width={W + 400} height={FLOOR + 200} fill={dark ? '#12161e' : PAL.wall} />
          <Wall x={-200} y={-200} w={W + 400} h={FLOOR + 160} P={PAL} kind="plain" stains={1} /></Far>
        <Window x={220} y={150} w={340} h={380} f={f} P={PAL} moon curtains shaft={dark ? [320, FLOOR, 300] : null} />
        <Floor W={W} floorY={FLOOR} H={H} P={PAL} vx={W * 0.5} />
        {/* door at the right */}
        <Door x={1560} y={FLOOR} w={300} h={640} P={PAL} id="rm" light={dark ? '#334' : null} />
        {/* old TV (off), coffee table */}
        <rect x={1180} y={FLOOR - 300} width={300} height={210} rx={10} fill="#0a0d12" stroke="#262c34" strokeWidth={6} /><rect x={1200} y={FLOOR - 284} width={260} height={178} fill="#141a22" />
        <rect x={1200} y={FLOOR - 90} width={260} height={90} fill={PAL.woodD} />
        <rect x={700} y={FLOOR - 110} width={320} height={26} fill={PAL.wood} /><rect x={720} y={FLOOR - 84} width={50} height={84} fill={PAL.woodD} /><rect x={950} y={FLOOR - 84} width={50} height={84} fill={PAL.woodD} />
        {/* the ONE red lamp */}
        <g transform={`translate(${430},${FLOOR - 150})`}><rect x={-6} y={-70} width={12} height={70} fill="#2a2024" /><path d="M-60,-130 L60,-130 L34,-70 L-34,-70Z" fill="#7a2a28" stroke="#3a1414" strokeWidth={4} />{!dark && <ellipse cx={0} cy={-96} rx={66} ry={30} fill={RED} opacity={0.4} />}</g>
        {!dark && <LightPool x={430} y={FLOOR - 120} rx={420} ry={320} c="#ff8a6a" o={0.16} />}
        {/* sagging couch with a blanket */}
        <rect x={540} y={FLOOR - 240} width={620} height={240} rx={26} fill="#3a4154" stroke="#20283a" strokeWidth={6} /><rect x={560} y={FLOOR - 290} width={580} height={84} rx={22} fill="#454e64" />
        <path d={`M600,${FLOOR - 250} q60,-30 140,0 q60,30 150,-6 l0,60 q-170,30 -300,6Z`} fill="#5a6378" opacity={0.9} />
        {/* Jack on the couch */}
        <FullPerson s={J} x={820} y={FLOOR} k={0.27} f={f} view="three" face={-1} expr={v.jexpr ?? (dark ? 'fear' : 'sad')} motion={{ type: v.reach ? 'reach' : 'sit' }} />
        {v.tears && <BlackTears x={760} y={FLOOR - 640} k={0.5} f={f} n={2} />}
        {v.tears && <BlackTears x={815} y={FLOOR - 640} k={0.5} f={f + 7} n={2} />}
        {v.ethan && <FullPerson s={E} x={1280} y={FLOOR} k={0.27} f={f} view="three" face={-1} expr="fear" motion={{ type: 'idle' }} />}
        {v.tag && <Tag at={[800, 360]} to={[1120, 250]} text="BLACK TEARS" f={t} t0={0.7} red size={30} />}
        <Dust x={300} y={120} w={1300} h={700} f={f} n={14} />
      </Lgt>
      <NightMask W={W} H={H} x={820} y={560} r={1120} o={dark ? 0.68 : 0.52} c="#06080e" />
    </g>
  );
};

// 7 DOOR: the front door, Elisa's dark shape behind the frosted side-window; her calm voice.
const door: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const p = ease(t / len);
  return (
    <g>
      <Defs />
      <Moon>
        <Far b={2}><rect x={-200} y={-200} width={W + 400} height={FLOOR + 200} fill="#13171f" /></Far>
        <Floor W={W} floorY={FLOOR} H={H} P={PAL} vx={W * 0.5} />
        {/* the door */}
        <rect x={640} y={FLOOR - 760} width={420} height={760} fill={PAL.woodD} stroke="#120d0a" strokeWidth={8} />
        {[0, 1].map((r) => [0].map((cc) => <rect key={r} x={680} y={FLOOR - 720 + r * 360} width={340} height={320} fill="none" stroke="#0e0a08" strokeWidth={6} />))}
        <circle cx={1010} cy={FLOOR - 380} r={14} fill="#c8b070" />
        {/* frosted side window with Elisa's shape */}
        <rect x={1100} y={FLOOR - 720} width={160} height={640} fill="#4a5a68" opacity={0.7} stroke="#1a2028" strokeWidth={6} />
        <g opacity={0.6 + 0.2 * p}><ellipse cx={1180} cy={FLOOR - 520} rx={54} ry={70} fill="#0b0f16" /><rect x={1140} y={FLOOR - 460} width={80} height={300} rx={30} fill="#0b0f16" /></g>
        {/* coat hook, shoe rack, rug */}
        <rect x={360} y={FLOOR - 560} width={120} height={16} fill={PAL.wood} />{[0, 1, 2].map((i) => <rect key={i} x={380 + i * 36} y={FLOOR - 544} width={10} height={36} fill="#2a2420" />)}
        <path d={`M380,${FLOOR - 508} l40,120 l-20,0 l-30,-110Z`} fill="#3a4454" />
        <rect x={300} y={FLOOR - 90} width={240} height={70} fill={PAL.woodD} />
        <Rug x={700} y={FLOOR - 30} w={520} h={120} c="#3a3048" c2="#5a4a6a" />
        <circle cx={520} cy={FLOOR - 820} r={26} fill="#ffe6b8" opacity={0.5} /><ellipse cx={520} cy={FLOOR - 400} rx={300} ry={420} fill="#ffe6b8" opacity={0.06} />
        {v.ethan && <FullPerson s={E} x={420} y={FLOOR} k={0.28} f={f} view="three" face={1} expr="fear" motion={{ type: 'idle' }} />}
        <Tag at={[1180, FLOOR - 540]} to={[1420, 300]} text="THEY ARE WAITING" f={t} t0={0.8} red size={28} />
        <Dust x={300} y={120} w={1300} h={700} f={f} n={12} />
      </Moon>
      <NightMask W={W} H={H} x={860} y={520} r={1120} o={0.6} c="#05070c" />
    </g>
  );
};

// 8 WOODS: pine trunks at night; Jack runs from us / Ethan is dragged.
const woods: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const p = ease(t / len);
  const GY = FLOOR - 20;
  return (
    <g>
      <Defs />
      <Moon>
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#0c121c" />
        <ellipse cx={560} cy={240} rx={150} ry={150} fill="#9fb8e0" opacity={0.28} /><circle cx={560} cy={240} r={70} fill="#cdddf4" opacity={0.5} />
        {/* far porch light */}
        <circle cx={1600} cy={360} r={14} fill="#ffcf8a" /><ellipse cx={1600} cy={360} rx={120} ry={90} fill="#ffcf8a" opacity={0.12} />
        {/* pine trunks (parallax) */}
        {[160, 470, 760, 1120, 1460, 1760].map((x, i) => <g key={i}><rect x={x} y={-40} width={40 + (i % 3) * 16} height={GY + 40} fill="#0a0e12" />
          {Array.from({ length: 6 }).map((_, b) => <path key={b} d={`M${x + 20},${120 + b * 120} l${-80 - b * 10},40 l80,-10Z`} fill="#0b1116" />)}</g>)}
        <rect x={-200} y={GY} width={W + 400} height={H - GY + 200} fill="#141a1c" />
        {/* frost / snow on the ground */}
        {Array.from({ length: 10 }).map((_, i) => <ellipse key={i} cx={120 + i * 180} cy={GY + 60 + (i % 3) * 40} rx={140} ry={30} fill="#d6e0ea" opacity={0.12} />)}
        {v.run ? <FullPerson s={J} x={1040 - 120 * p} y={GY + 90} k={0.26} f={f} view="back" face={-1} expr="fear" motion={{ type: 'run' }} />
          : <FullPerson s={E} x={820 + 60 * p} y={GY + 90} k={0.26} f={f} view="three" face={1} expr="fear" motion={{ type: 'run' }} />}
        {/* footprints */}
        {[0, 1, 2, 3].map((i) => <ellipse key={i} cx={1040 + i * 60 - 120 * p} cy={GY + 150 - i * 30} rx={20} ry={9} fill="#0a0e10" opacity={0.5 - i * 0.08} />)}
        <Dust x={300} y={120} w={1300} h={700} f={f} n={16} c="#cdddf4" />
      </Moon>
      <NightMask W={W} H={H} x={960} y={560} r={1200} o={0.56} c="#04060a" />
    </g>
  );
};

// 9 CLEARING: the cult circle. Jack (the mask thing) bound in a chair; robed figures; Elisa unmasking; the book.
const clearing: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const p = ease(t / len); const GY = FLOOR + 40;
  return (
    <g>
      <Defs />
      <Candle>
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#0b1018" />
        <ellipse cx={1500} cy={230} rx={150} ry={150} fill="#9fb8e0" opacity={0.22} /><circle cx={1500} cy={230} r={64} fill="#cdddf4" opacity={0.45} />
        {[120, 300, 1660, 1840].map((x, i) => <rect key={i} x={x} y={-40} width={44} height={GY + 40} fill="#080c10" />)}
        <rect x={-200} y={GY} width={W + 400} height={H - GY + 200} fill="#161a1a" />
        {Array.from({ length: 8 }).map((_, i) => <ellipse key={i} cx={160 + i * 220} cy={GY + 70 + (i % 2) * 40} rx={150} ry={30} fill="#d6e0ea" opacity={0.1} />)}
        {/* lanterns on the frost */}
        <Lantern x={470} y={GY + 80} f={f} k={1.1} /><Lantern x={1480} y={GY + 90} f={f + 20} k={1.1} /><Lantern x={960} y={GY + 150} f={f + 9} k={0.9} />
        {/* robed circle (near figures big, far small) */}
        <Robed x={300} y={GY + 120} k={0.5} f={f} seed={1} />
        <Robed x={1650} y={GY + 130} k={0.5} f={f} seed={2} />
        <Robed x={620} y={GY - 20} k={0.34} f={f} seed={3} bow={v.read ? 0.4 : 0} arms={!!v.read} />
        <Robed x={1320} y={GY - 20} k={0.34} f={f} seed={4} />
        {/* the wooden chair + the mask thing, bound */}
        <g transform={`translate(0,0)`}>
          <rect x={900} y={GY - 360} width={120} height={360} fill="#2a2018" stroke="#140d08" strokeWidth={5} /><rect x={860} y={GY - 400} width={200} height={40} fill="#2a2018" />
          <MaskThing x={960} y={GY} k={0.3} f={f} face={1} pose="stand" p={1} tar={v.tar ?? 0.4} free={false} tendrils={v.tend ?? 0} />
          {/* straps */}
          {[-220, -120].map((dy, i) => <rect key={i} x={900} y={GY + dy} width={120} height={16} fill="#1a1510" opacity={0.9} />)}
        </g>
        {/* Elisa, unmasked, to the side */}
        {v.unmask && <g><FullPerson s={EL} x={1240} y={GY} k={0.3} f={f} view="three" face={-1} expr="cruel" motion={{ type: 'idle' }} />
          <path d={`M1180,${GY - 820} l70,-20 l-10,70Z`} fill="#9fb6c6" opacity={0.8} /></g>}
        {v.tag && <Tag at={[960, GY - 760]} to={[1240, 260]} text="IT WAS ELISA" f={t} t0={0.8} red size={30} />}
        <Dust x={300} y={120} w={1300} h={800} f={f} n={14} c="#cdddf4" />
      </Candle>
      <NightMask W={W} H={H} x={960} y={560} r={1180} o={0.56} c="#04060a" />
    </g>
  );
};

// 10 RITUAL: closer on the bound thing; the cracked blue mask fixed on; black tar; tendrils rising.
const ritual: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const p = ease(t / len); const GY = FLOOR + 40;
  return (
    <g>
      <Defs />
      <Candle>
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#0a0e14" />
        {[160, 1700].map((x, i) => <rect key={i} x={x} y={-40} width={50} height={GY + 40} fill="#080c10" />)}
        <rect x={-200} y={GY} width={W + 400} height={H - GY + 200} fill="#15191a" />
        <Lantern x={360} y={GY + 70} f={f} k={1.2} /><Lantern x={1560} y={GY + 80} f={f + 14} k={1.2} />
        <Robed x={300} y={GY + 60} k={0.42} f={f} seed={5} bow={0.3} arms />
        <Robed x={1620} y={GY + 70} k={0.42} f={f} seed={6} />
        {/* the chair + the thing, bigger */}
        <rect x={870} y={GY - 440} width={170} height={440} fill="#2a2018" stroke="#140d08" strokeWidth={6} /><rect x={820} y={GY - 490} width={270} height={50} fill="#2a2018" />
        <MaskThing x={955} y={GY} k={0.38} f={f} face={1} pose="stand" p={1} tar={v.tar ?? 0.7} free={false} tendrils={v.tend ?? (0.4 + 0.6 * p)} />
        {[-300, -170].map((dy, i) => <rect key={i} x={870} y={GY + dy} width={170} height={20} fill="#120d08" opacity={0.9} />)}
        <Tag at={[955, GY - 980]} to={[1300, 240]} text="A BLUE MASK" f={t} t0={0.7} red size={30} />
        <Dust x={300} y={120} w={1300} h={800} f={f} n={12} c="#cdddf4" />
      </Candle>
      <NightMask W={W} H={H} x={960} y={520} r={1080} o={0.58} c="#04060a" />
    </g>
  );
};

// 11 UNLEASHED: the thing free; the circle torn; bright-red spatter on the frost (never organs or a cut body).
const unleashed: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const p = ease(t / len); const GY = FLOOR + 40;
  return (
    <g>
      <Defs />
      <Candle>
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#0a0d12" />
        <ellipse cx={420} cy={230} rx={140} ry={140} fill="#9fb8e0" opacity={0.2} /><circle cx={420} cy={230} r={60} fill="#cdddf4" opacity={0.4} />
        {[1680, 1840].map((x, i) => <rect key={i} x={x} y={-40} width={48} height={GY + 40} fill="#080c10" />)}
        <rect x={-200} y={GY} width={W + 400} height={H - GY + 200} fill="#14181a" />
        {/* bright red on the frost */}
        <BloodPool x={760} y={GY + 110} r={240} grow={1} f={f} />
        <Spatter x={1180} y={GY + 40} dir={-0.5} spread={120} size={260} n={30} f={f} t0={0.2} />
        <Stain x={1360} y={GY + 150} r={160} grow={1} />
        {/* a robed figure fallen / fleeing */}
        <Robed x={1420} y={GY + 40} k={0.44} f={f} seed={7} bow={0.5} />
        {/* the thing, free, mid-stride (full body, side, moving) */}
        <MaskThing x={820} y={GY} k={0.38} f={f} face={1} pose={v.pose2 === 'loom' ? 'loom' : 'stalk'} p={v.pp ?? (f / 60)} tar={0.9} free tendrils={0.3} />
        <Tag at={[820, GY - 980]} to={[640, 240]} text="YOU MADE HIM MAD" f={t} t0={0.6} red size={30} />
        <Dust x={300} y={120} w={1300} h={800} f={f} n={12} c="#cdddf4" />
      </Candle>
      <NightMask W={W} H={H} x={900} y={540} r={1160} o={0.54} c="#04060a" />
    </g>
  );
};

// 12 HOSPITAL: the morning after. Ethan in the bed, bandaged side; a steady monitor; Officer Reyes.
const hospital: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const trace = (() => { let d = 'M1180,300'; for (let x = 1180; x <= 1700; x += 10) { const a = Math.sin((x + f * 4) / 18) * (x % 120 < 16 ? 40 : 6); d += ` L${x},${300 + a}`; } return d; })();
  return (
    <g>
      <Defs />
      <Cold>
        <Far b={2}><rect x={-200} y={-200} width={W + 400} height={FLOOR + 200} fill={PAL.wall} />
          <Wall x={-200} y={-200} w={W + 400} h={FLOOR + 160} P={PAL} kind="plain" stains={0} /></Far>
        <Window x={1360} y={150} w={420} h={360} f={f} P={PAL} moon={false} curtains={false} />
        <Floor W={W} floorY={FLOOR} H={H} P={PAL} vx={W * 0.5} />
        {/* monitor */}
        <rect x={1140} y={200} width={600} height={240} rx={10} fill="#0a1016" stroke="#2a3240" strokeWidth={6} /><rect x={1160} y={220} width={560} height={200} fill="#061512" />
        <path d={trace} stroke="#78e0a8" strokeWidth={4} fill="none" strokeLinejoin="round" />
        {/* IV stand */}
        <rect x={360} y={FLOOR - 560} width={8} height={460} fill="#9aa6b2" /><rect x={320} y={FLOOR - 600} width={90} height={60} rx={10} fill="#cdd6de" opacity={0.7} />
        {/* bed with Ethan (supine), blanket */}
        <rect x={560} y={FLOOR - 40} width={900} height={40} fill="#9aa6b2" /><path d={`M560,${FLOOR - 40} l-30,120 M1460,${FLOOR - 40} l30,120`} stroke="#6a7682" strokeWidth={12} />
        <LyingPerson s={E} x={1000} surfaceY={FLOOR - 50} k={0.4} f={f} expr={v.expr ?? 'sad'} head={-1} sheet sheetC={PAL.sheet} uid="hosp" fit={760} />
        {/* bandage / holding the side (red stain on the sheet, no wound) */}
        <Stain x={1120} y={FLOOR - 120} r={70} grow={1} o={0.7} />
        {v.officer && <FullPerson s={OFF} x={520} y={FLOOR} k={0.3} f={f} view="three" face={1} expr="worry" motion={{ type: 'idle' }} />}
        {v.tag && <Tag at={[1120, FLOOR - 120]} to={[760, 300]} text="A KIDNEY GONE" f={t} t0={0.8} red size={28} />}
        <Dust x={300} y={120} w={1300} h={700} f={f} n={12} />
      </Cold>
      <NightMask W={W} H={H} x={1000} y={560} r={1200} o={0.44} c="#0a0e14" />
    </g>
  );
};

// 13 FACE: a generic close-up for a bust/close shot. v.who = ethan|jack|elisa, v.expr, v.tears for Jack's black tears.
const face: React.FC<SetProps> = ({ f, v, t = 0, len = 90 }) => {
  const p = ease(t / len);
  const who = v.who === 'jack' ? J : v.who === 'elisa' ? EL : E;
  const Lgt = v.warm ? Warm : Cold;
  return (
    <g>
      <Defs />
      <Lgt>
        <rect x={0} y={0} width={W} height={H} fill={v.warm ? '#1a1510' : '#141a22'} />
        <LightPool x={960} y={360} rx={700} ry={420} c={v.warm ? '#ffe6b8' : '#9fc0ff'} o={0.12} />
        <g transform={`translate(${v.x ?? 960},560) scale(0.96)`}>
          <CloseUp s={who} expr={v.expr ?? 'fear'} f={f} turn={(v.turn ?? 0.1) + 0.2 * p} uid={`fc-${v.who ?? 'e'}`} />
          {v.tears && <BlackTears x={-70} y={-150} k={1.1} f={f} n={2} />}
          {v.tears && <BlackTears x={70} y={-150} k={1.1} f={f + 6} n={2} />}
        </g>
        {v.tag && <Tag at={[1120, 420]} to={[1460, 260]} text={String(v.tag)} f={t} t0={0.6} red size={28} />}
        <NightMask W={W} H={H} x={960} y={520} r={860} o={0.72} c="#05070c" />
      </Lgt>
    </g>
  );
};

// 14 CREDIT: the torn notebook page with the credit line.
const credit: React.FC<SetProps> = ({ f, t = 0 }) => {
  const a = ease(t / 30);
  return (
    <g opacity={a}>
      <Defs />
      <rect x={0} y={0} width={W} height={H} fill="#0a0d12" />
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
