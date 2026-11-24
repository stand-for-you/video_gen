import React from 'react';
import { INK, Hand } from './Kit';
import { FullMan, NOAH } from './Body';
import { sf } from './Beast';
import { Walls, Planks, Door, Blinds, Frame, StreetLamp } from './IH';
import { R, Glow } from './IH';
import { Q, MARY, TERENCE, Noah, Person, Face, Alive, DogHead, DogSit, Beckon, Picture, CRT, Tower, Keyboard, Modem, DeskPhone, Floppy, Envelope, Laptop, Desk, Lamp, Barrel, City, Wood70, Blocks, Carpet, Screen } from './SD';
// ===== 16:9 scene sets (1920x1080) for "Smile Dog". Camera habit for this kit: slow stepped PULL-BACK (see Player.tsx). No flashing effects.
export const W = 1920, H = 1080;
type SP = { f: number; v: any };
const FY = 860;
const Dark: React.FC<{ op?: number }> = ({ op = 0.3 }) => <R c="#05030a" op={op} />;
const Tint: React.FC<{ c: string; op: number }> = ({ c, op }) => <R c={c} op={op} />;
// ---------- the picture / the dream
const photo: React.FC<SP> = ({ f, v }) => (<g>
  <Picture W={W} H={H} f={f} dx={v.dx} dy={v.dy} ds={v.ds} hand={v.hand !== false} grin={v.grin ?? 1} hy={v.hy} />
  {v.dream && <g><defs><radialGradient id="drm"><stop offset="0.45" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.95" /></radialGradient></defs><rect x={-600} y={-600} width={3200} height={2400} fill="url(#drm)" /></g>}
  <Dark op={v.dark ?? 0.1} />
</g>);
const dogface: React.FC<SP> = ({ f, v }) => (<g>
  <R c="#0a0709" /><Glow x={v.x ?? 960} y={v.y ?? 520} r={900} ry={700} c={Q.flash} op={0.3} />
  <g transform={`translate(${v.x ?? 960},${v.y ?? 520}) rotate(${(v.rot ?? 0) + Math.sin(sf(f, 3) / 30) * 2}) scale(${v.k ?? 1})`}><DogHead f={f} grin={v.talk ? 0.72 + 0.28 * Math.abs(Math.sin(sf(f, 3) / 3)) : (v.grin ?? 1)} eyes={v.eyes ?? 1} /></g>
  <Dark op={v.dark ?? 0.08} />
</g>);
const hand: React.FC<SP> = ({ f, v }) => (<g>
  <R c="#060406" /><Glow x={1300} y={600} r={800} c={Q.flash} op={0.12} />
  <Beckon x={v.x ?? 640} y={v.y ?? 600} s={v.k ?? 2.4} f={f} rot={v.rot ?? 72} />
  {v.eyes && <g opacity={0.7}>{[-1, 1].map((q) => <ellipse key={q} cx={1500 + q * 70} cy={420} rx={34} ry={14} fill={Q.eye} />)}</g>}
  <Dark op={0.1} />
</g>);
const marybed: React.FC<SP> = ({ f, v }) => (<g>
  <Walls W={W} fy={FY} c="#4a3e46" d="#362c34" />
  <Blinds x={1380} y={180} w={380} h={320} f={f} seed={3} open={0.3} outside={<City W={1800} H={600} f={f} gy={460} train={false} />} />
  <Frame x={260} y={240} w={180} h={130} kind={1} />
  <Carpet W={W} H={H} fy={FY} c="#4a3c3a" />
  <g transform="translate(980,920)">
    <rect x={-640} y={-260} width={1280} height={150} fill={Q.wood} stroke={INK} strokeWidth={8} />
    <path d="M-640,-430 V-120 H-520 V-430 Q-580,-480 -640,-430Z" fill={Q.woodD} stroke={INK} strokeWidth={8} />
    <rect x={-600} y={-350} width={1220} height={110} rx={30} fill="#c4c8cc" stroke={INK} strokeWidth={7} />
    <path d="M-560,-360 Q-540,-440 -380,-430 Q-300,-420 -290,-350Z" fill="#dcdfe2" stroke={INK} strokeWidth={6} />
  </g>
  <Face who="mary" x={700} y={560} k={0.42} f={f} rot={-80} expr={v.open ? 'fear' : 'neutral'} />
  <path d="M520,580 C700,520 1000,540 1600,580 L1620,720 C1200,700 800,700 520,720Z" fill="#5a4a66" stroke={INK} strokeWidth={8} />
  {v.dream && <g opacity={0.3}><svg x={760} y={40} width={720} height={420} viewBox="0 0 1920 1080"><Picture W={1920} H={1080} f={f} /></svg></g>}
  {v.dream && <Glow x={1120} y={250} r={420} ry={260} c="#8090c0" op={0.12} />}
  <Dark op={v.dark ?? 0.32} />
</g>);
// ---------- Chicago, the apartment
const city: React.FC<SP> = ({ f, v }) => (<g>
  <City W={W} H={H} f={f} gy={v.gy ?? 820} train={v.train !== false} seed={v.seed || 3} />
  {v.apt && <g><rect x={1200} y={200} width={560} height={700} fill="#3a2e2a" stroke={INK} strokeWidth={8} />{Array.from({ length: 5 }).map((_, r) => Array.from({ length: 4 }).map((_, c) => <rect key={r + '-' + c} x={1240 + c * 130} y={240 + r * 120} width={80} height={80} fill={(r * 4 + c) % 5 === 2 ? '#f0d488' : '#1a1418'} stroke={INK} strokeWidth={4} />))}<rect x={1420} y={780} width={120} height={120} fill="#1a1418" /></g>}
  {v.era === '1992' && <Tint c="#2a4a3a" op={0.18} />}
  <Dark op={v.dark ?? 0.12} />
</g>);
const aptdoor: React.FC<SP> = ({ f, v }) => (<g>
  <Walls W={W} fy={FY} c={Q.wall07} d={Q.wall07D} />
  <Carpet W={W} H={H} fy={FY} c="#6a3a34" />
  <Door x={1100} y={FY} s={1.25} open={v.open ?? 0} c="#5a3a2a" light="#e8d0a0" />
  <text x={1100} y={FY - 600} textAnchor="middle" fontFamily="Lora" fontWeight={700} fontSize={44} fill="#c0a060">4B</text>
  <Glow x={700} y={120} r={300} c="#ffe0a0" op={0.4} />
  {v.open > 0 && <Person s={TERENCE} x={1110} y={FY + 30} k={0.22} f={f} expr="speak" />}
  <Noah x={v.nx ?? 560} y={FY + 40} s={0.23} f={f} view="three" note mode={v.walk ? 'walk' : 'idle'} />
  <Dark op={v.dark ?? 0.18} />
</g>);
const hall: React.FC<SP> = ({ f, v }) => { const sh = v.shadow ? (Math.sin(sf(f, 3) / 12) * 120) : 0; return (<g>
  <Walls W={W} fy={FY} c={Q.wall07} d={Q.wall07D} />
  <Frame x={220} y={250} w={160} h={200} kind={1} /><Frame x={1580} y={270} w={200} h={150} kind={0} />
  <Carpet W={W} H={H} fy={FY} c="#5a4636" />
  <rect x={-600} y={FY + 20} width={3200} height={110} fill="#6a3a34" opacity={0.85} />
  <Door x={v.dx ?? 960} y={FY} s={1.2} open={0} c="#6e6252" />
  <rect x={(v.dx ?? 960) - 175} y={FY - 8} width={350} height={10} fill="#f0dca0" />
  {v.shadow && <rect x={(v.dx ?? 960) - 60 + sh} y={FY - 8} width={90} height={10} fill="#140c10" />}
  <Glow x={v.dx ?? 960} y={FY} r={260} ry={50} c="#f0dca0" op={0.45} />
  {v.cry && [0, 1, 2].map((i) => <path key={i} d={`M${(v.dx ?? 960) + 200 + i * 40},${420 - i * 10} q30,60 0,120`} stroke="#e8e0d0" strokeWidth={6} fill="none" opacity={0.25 + 0.2 * Math.sin(sf(f, 3) / 8 + i)} />)}
  {v.who !== 'noah' && <Person s={TERENCE} x={v.tx ?? 700} y={FY + 40} k={0.24} f={f} expr={v.texpr || 'speak'} mode={v.tmode || 'lean'} />}
  {v.who !== 'terence' && <Noah x={v.nx ?? 1380} y={FY + 50} s={0.24} f={f} view="three" note expr={v.nexpr || 'neutral'} />}
  <Dark op={v.dark ?? 0.24} />
</g>); };
const door: React.FC<SP> = ({ f, v }) => (<g>
  <R c="#6e6252" />
  {[[200, -100, 640, 520], [1000, -100, 640, 520], [200, 520, 640, 360], [1000, 520, 640, 360]].map((r, i) => <rect key={i} x={r[0]} y={r[1]} width={r[2]} height={r[3]} fill="none" stroke={INK} strokeWidth={8} opacity={0.5} />)}
  <rect x={-600} y={940} width={3200} height={26} fill="#f0dca0" />
  {v.feet && <rect x={860 + Math.sin(sf(f, 3) / 10) * 160} y={940} width={150} height={26} fill="#140c10" />}
  <rect x={-600} y={966} width={3200} height={600} fill="#5a4636" />
  <circle cx={1700} cy={520} r={44} fill="#c0a060" stroke={INK} strokeWidth={8} />
  {v.hand && <Hand x={v.hx ?? 900} y={560} s={1.6} rot={-10} skin={TERENCE.skin} shade={TERENCE.skinD} sleeve={TERENCE.topC} sleeveLen={500} ext={[0.95, 1, 0.95, 0.85]} />}
  {v.cry && [0, 1, 2, 3].map((i) => <path key={i} d={`M${700 + i * 120},${300} q40,${80 + i * 10} 0,${180}`} stroke="#fff4e0" strokeWidth={8} fill="none" opacity={0.18 + 0.15 * Math.sin(sf(f, 3) / 8 + i)} />)}
  <Dark op={v.dark ?? 0.2} />
</g>);
const notes: React.FC<SP> = ({ f, v }) => { const t = sf(f, 3); const lines = v.page === 2 ? ['- she will not come out', '- crying. "the dream"', '- the same nightmare?', '- smile.jpg ??'] : ['Mary E. - Chicago', '- BBS sysop, 1992', '- married 15 years', '- nightmares (every night)']; return (<g>
  <R c="#3a2c24" /><rect x={-600} y={640} width={3200} height={800} fill={Q.woodD} />
  <g transform="translate(960,560) rotate(-4)">
    <rect x={-560} y={-420} width={1120} height={840} fill={Q.paper} stroke={INK} strokeWidth={10} />
    <rect x={-560} y={-460} width={1120} height={60} fill="#2a3a5a" stroke={INK} strokeWidth={8} />
    {Array.from({ length: 12 }).map((_, i) => <path key={i} d={`M-520,${-320 + i * 64} H520`} stroke="#9ab0d0" strokeWidth={3} />)}
    <path d="M-420,-420 V420" stroke="#d07070" strokeWidth={4} />
    {lines.map((l, i) => <text key={i} x={-390} y={-260 + i * 128} fontFamily="Lora" fontStyle="italic" fontSize={62} fill="#20284a">{l.slice(0, Math.max(0, Math.min(l.length, Math.floor((t - i * 18) / 2))))}</text>)}
  </g>
  <Hand x={1300 + Math.sin(t / 3) * 30} y={760 - (t % 40)} s={1.8} rot={-140} skin={NOAH.skin} shade={NOAH.shade} sleeve={NOAH.robe} sleeveLen={500} ext={[0.4, 0.35, 0.3, 0.3]} />
  <Dark op={0.12} />
</g>); };
// ---------- close-up faces with backgrounds
const faces: React.FC<SP> = ({ f, v }) => { const bg = v.bg || 'hall'; return (<g>
  {bg === 'hall' && <Walls W={W} fy={1500} c={Q.wall07} d={Q.wall07D} />}
  {bg === 'bbs' && <g><Wood70 W={W} fy={1500} /><Glow x={v.gx ?? 1500} y={540} r={700} c={Q.cyan} op={0.3} /></g>}
  {bg === 'dorm' && <g><Blocks W={W} fy={1500} /><Glow x={1500} y={600} r={700} c={Q.cyan} op={0.25} /></g>}
  {bg === 'teen' && <g><Walls W={W} fy={1500} c="#3a4a5a" d="#2a3644" /><Frame x={1400} y={160} w={300} h={400} kind={2} /><Glow x={400} y={600} r={600} c={Q.cyan} op={0.3} /></g>}
  {bg === 'dark' && <R c="#0c080c" />}
  {bg === 'yard' && <g><R c="#120e18" /><Glow x={300} y={800} r={600} c="#ffa040" op={0.35} /></g>}
  <Face who={v.who || 'noah'} x={v.x ?? 960} y={v.y ?? 560} k={v.k ?? 1.5} f={f} expr={v.expr || 'neutral'} rot={v.rot ?? 0} tears={v.tears} turn={v.turn ?? 0} glow={v.glow} />
  {v.phone && <g transform={`translate(${(v.x ?? 960) + 230 * (v.k ?? 1.5) / 1.5},${(v.y ?? 560) + 40}) rotate(20) scale(${(v.k ?? 1.5) / 1.5})`}><rect x={-60} y={-200} width={120} height={360} rx={30} fill={v.who === 'terence' ? '#c8bea4' : '#2a2c30'} stroke={INK} strokeWidth={8} /><Hand x={30} y={120} s={1.1} rot={-20} skin={v.who === 'terence' ? TERENCE.skin : NOAH.skin} shade={v.who === 'terence' ? TERENCE.skinD : NOAH.shade} sleeve={v.who === 'terence' ? TERENCE.topC : NOAH.robe} sleeveLen={300} ext={[0.4, 0.4, 0.35, 0.3]} /></g>}
  <Dark op={v.dark ?? 0.16} />
</g>); };
// ---------- 1992 bulletin board room
const bbs: React.FC<SP> = ({ f, v }) => (<g>
  <Wood70 W={W} fy={FY} />
  <Blinds x={240} y={170} w={420} h={340} f={f} seed={5} open={0.55} outside={<City W={800} H={600} f={f} gy={470} />} />
  <Frame x={1560} y={210} w={220} h={160} kind={2} />
  <Carpet W={W} H={H} fy={FY} />
  <Desk x={1100} y={640} w={1000} />
  <Tower x={1480} y={640} s={0.55} />
  <CRT x={1060} y={640} s={0.62} id={'cb' + (v.mode || 'bbs')}><Screen mode={v.mode || 'bbs'} w={552} h={396} f={f} /></CRT>
  <Glow x={1060} y={440} r={460} c={Q.cyan} op={0.28} />
  <Keyboard x={1060} y={640} s={0.55} /><Modem x={760} y={640} s={0.6} /><DeskPhone x={1350} y={640} s={0.5} />
  {v.mary && <Person s={MARY} x={v.mx ?? 760} y={FY + 60} k={0.22} f={f} mode="lean" expr={v.mexpr || 'neutral'} />}
  <Dark op={v.dark ?? 0.28} />
</g>);
const bbsface: React.FC<SP> = ({ f, v }) => (<g>
  <Wood70 W={W} fy={1400} />
  <Glow x={960} y={560} r={700} c={Q.cyan} op={0.4} />
  <Face who="mary" x={v.x ?? 960} y={430} k={v.k ?? 1.15} f={f} expr={v.expr || 'neutral'} glow={Q.cyan} />
  <rect x={-600} y={1010} width={3200} height={200} fill={Q.woodD} /><Keyboard x={960} y={1110} s={1.7} />
  <Dark op={0.18} />
</g>);
const screen: React.FC<SP> = ({ f, v }) => (<g>
  <R c={v.dev === 'laptop' ? '#141820' : '#1d1519'} />
  <g transform={`rotate(${v.rot ?? 0} 960 540)`}>
  {v.dev === 'laptop' ? <g><Glow x={v.x ?? 960} y={560} r={900} c={Q.cyan} op={0.2} /><rect x={-600} y={900} width={3200} height={600} fill={Q.woodD} />{v.mug && <g transform="translate(1720,960)"><path d="M-70,0 V-160 H70 V0Z" fill="#c8c0a8" stroke={INK} strokeWidth={7} /><path d="M70,-130 q60,0 60,50 q0,40 -60,40" stroke={INK} strokeWidth={10} fill="none" /></g>}<Laptop x={v.x ?? 960} y={980} s={v.s ?? 1.45} id={'ls' + v.mode + (v.x ?? '')}><Screen mode={v.mode} w={740} h={520} f={f} /></Laptop></g>
    : <g><Glow x={v.x ?? 960} y={500} r={900} c={Q.cyan} op={0.22} /><rect x={-600} y={930} width={3200} height={600} fill={Q.woodD} />{v.disk && <Floppy x={1620} y={900} s={0.5} rot={14} />}<CRT x={v.x ?? 960} y={960} s={v.s ?? 1.5} id={'cs' + v.mode + (v.x ?? '')}><Screen mode={v.mode} w={552} h={396} f={f} /></CRT></g>}
  </g>
  <Dark op={v.dark ?? 0.1} />
</g>);
// ---------- 2005 teen bedroom, the fakes board
const teen: React.FC<SP> = ({ f, v }) => (<g>
  <Walls W={W} fy={FY} c="#3a4a5a" d="#2a3644" />
  <Frame x={180} y={190} w={260} h={360} kind={2} /><Frame x={500} y={230} w={200} h={150} kind={0} />
  <Blinds x={1500} y={170} w={340} h={300} f={f} seed={8} open={0.5} />
  <Carpet W={W} H={H} fy={FY} c="#3e4a56" />
  <Desk x={1000} y={640} w={900} c="#6a5a4a" />
  <CRT x={980} y={640} s={0.62} id="tc"><Screen mode={v.mode || 'search'} w={552} h={396} f={f} /></CRT>
  <Glow x={980} y={440} r={460} c={Q.cyan} op={0.3} /><Keyboard x={980} y={640} s={0.5} /><Tower x={1340} y={640} s={0.5} />
  <Noah x={v.nx ?? 700} y={FY + 80} s={0.23} f={f} view="back" />
  <Dark op={v.dark ?? 0.32} />
</g>);
const fakes: React.FC<SP> = ({ f, v }) => (<g>
  <Walls W={W} fy={1300} c="#3a4a5a" d="#2a3644" wain={false} />
  <rect x={160} y={80} width={1600} height={900} fill="#9a7a50" stroke={INK} strokeWidth={12} />
  {Array.from({ length: 10 }).map((_, i) => { const x = 260 + (i % 5) * 300, y = 160 + Math.floor(i / 5) * 420, r = ((i * 37) % 11) - 5; return <g key={i} transform={`translate(${x},${y}) rotate(${r})`}><rect x={0} y={0} width={240} height={300} fill="#ece6d8" stroke={INK} strokeWidth={5} /><rect x={16} y={16} width={208} height={200} fill="#120c0e" /><g transform={`translate(120,${130}) scale(0.2)`} opacity={0.8}><DogHead f={f} grin={0.5 + (i % 3) * 0.2} /></g><text x={120} y={270} textAnchor="middle" fontFamily="Lora" fontWeight={700} fontSize={34} fill={Q.redD}>FAKE?</text><circle cx={120} cy={8} r={12} fill="#c03030" stroke={INK} strokeWidth={4} /></g>; })}
  <path d="M380,170 L980,600 L1580,170 M680,600 L1280,170" stroke="#b02020" strokeWidth={4} fill="none" opacity={0.7} />
  {v.noah && <Noah x={1640} y={1300} s={0.3} f={f} view="back" />}
  <Lamp x={140} y={1000} s={1.2} />
  <Dark op={v.dark ?? 0.25} />
</g>);
// ---------- 2008 college dorm
const dorm: React.FC<SP> = ({ f, v }) => (<g>
  <Blocks W={W} fy={FY} />
  <Blinds x={v.wx ?? 1440} y={170} w={360} h={330} f={f} seed={11} open={0.6} outside={<g><rect x={1400} y={150} width={500} height={400} fill="#141a28" /><rect x={1460} y={330} width={200} height={200} fill="#3a2e2a" />{[0, 1, 2].map((i) => <rect key={i} x={1480 + i * 60} y={360} width={30} height={40} fill="#e8c878" />)}</g>} />
  <Frame x={220} y={220} w={220} h={300} kind={0} />
  <Carpet W={W} H={H} fy={FY} c="#4a4e56" />
  <g transform="translate(300,900)"><rect x={-300} y={-260} width={620} height={120} fill="#3a4a6a" stroke={INK} strokeWidth={8} /><rect x={-300} y={-150} width={620} height={150} fill={Q.woodD} stroke={INK} strokeWidth={8} /><rect x={-290} y={-300} width={160} height={60} rx={20} fill="#d8dce0" stroke={INK} strokeWidth={6} /></g>
  <Desk x={1100} y={640} w={900} c="#7a6a56" />
  <Laptop x={1080} y={640} s={0.5} id={'dl' + (v.mode || 'inbox')}><Screen mode={v.mode || 'inbox'} w={740} h={520} f={f} /></Laptop>
  <Lamp x={1440} y={640} s={0.6} on={v.lamp !== false} />
  {v.books && <g>{[0, 1, 2, 3].map((i) => <rect key={i} x={720} y={600 - i * 34} width={260 - i * 14} height={32} fill={['#6a3a3a', '#3a5a6a', '#5a6a3a', '#7a6a3a'][i]} stroke={INK} strokeWidth={5} />)}</g>}
  {v.noah && <Noah x={v.nx ?? 520} y={FY + 60} s={0.24} f={f} view={v.view || 'three'} expr={v.expr || 'neutral'} />}
  <Dark op={v.dark ?? 0.36} />
</g>);
const campus: React.FC<SP> = ({ f, v }) => (<g>
  <rect x={-600} y={-600} width={3200} height={1500} fill="#141a28" /><Glow x={960} y={300} r={900} ry={300} c="#4a5a7a" op={0.3} />
  <rect x={360} y={220} width={1200} height={600} fill="#5a3e34" stroke={INK} strokeWidth={10} />
  <path d="M320,230 L960,40 L1600,230Z" fill="#2a2228" stroke={INK} strokeWidth={10} />
  {Array.from({ length: 4 }).map((_, r) => Array.from({ length: 8 }).map((_, c) => <rect key={r + '-' + c} x={420 + c * 140} y={280 + r * 130} width={70} height={90} fill={(r * 8 + c) % 6 === 1 ? '#f0d488' : '#1a1418'} stroke={INK} strokeWidth={4} />))}
  <rect x={-600} y={820} width={3200} height={600} fill="#1a2018" />
  <StreetLamp x={160} y={900} s={0.6} /><StreetLamp x={1760} y={900} s={0.6} />
  {[260, 1660].map((x) => <g key={x}><path d={`M${x},900 V600`} stroke="#1a1410" strokeWidth={24} /><circle cx={x} cy={560} r={150} fill="#141c14" stroke={INK} strokeWidth={6} /></g>)}
  <Dark op={0.18} />
</g>);
// ---------- objects: envelope, floppy, kitchen, closet, burn, finals
const envelope: React.FC<SP> = ({ f, v }) => { const t = Math.min(1, sf(f, 3) / 60); return (<g>
  <R c="#3a2c24" /><Carpet W={W} H={H} fy={200} c="#5a4434" />
  <rect x={380} y={300} width={1160} height={640} fill="#6a5a3a" stroke={INK} strokeWidth={10} />
  <Envelope x={960} y={600} s={1.2} rot={-6} open={v.open ? 1 : 0} />
  {v.open && <Floppy x={960 + t * 180} y={520 - t * 120} s={1.1} rot={-6 + t * 10} />}
  {v.hand && <Hand x={1500} y={300} s={1.7} rot={-130} skin={MARY.skin} shade={MARY.skinD} sleeve={MARY.topC} sleeveLen={500} ext={[0.9, 0.9, 0.85, 0.8]} />}
  <Dark op={0.25} />
</g>); };
const floppy: React.FC<SP> = ({ f, v }) => (<g>
  <R c="#1d1519" /><rect x={-600} y={700} width={3200} height={800} fill={v.box ? '#7a6a56' : Q.woodD} />
  {v.box && <g><rect x={300} y={300} width={1320} height={700} fill="#c8b48a" stroke={INK} strokeWidth={10} />{[0, 1, 2].map((i) => <rect key={i} x={380 + i * 380} y={380 + (i % 2) * 40} width={340} height={240} fill={['#e8e2d0', '#d8d0c0', '#ece4cc'][i]} stroke={INK} strokeWidth={6} transform={`rotate(${(i - 1) * 6} ${550 + i * 380} 500)`} />)}</g>}
  <Floppy x={v.x ?? 960} y={v.y ?? 560} s={v.k ?? 1.6} rot={(v.rot ?? -8) + Math.sin(sf(f, 3) / 20) * 2} glow={v.glow} />
  {v.hand && <Hand x={1400} y={760} s={1.8} rot={-60} skin={MARY.skin} shade={MARY.skinD} sleeve={MARY.topC} sleeveLen={500} ext={[0.6, 0.55, 0.5, 0.45]} />}
  <Dark op={v.dark ?? 0.18} />
</g>);
const kitchen92: React.FC<SP> = ({ f, v }) => (<g>
  <Walls W={W} fy={FY} c="#4e4a3e" d="#3a3830" wain={false} />
  {Array.from({ length: 6 }).map((_, i) => <rect key={i} x={760 + i * 200} y={180} width={190} height={280} fill="#6a5a44" stroke={INK} strokeWidth={6} />)}
  <rect x={700} y={560} width={1400} height={40} fill="#c8c0a8" stroke={INK} strokeWidth={7} /><rect x={700} y={600} width={1400} height={300} fill="#5a4a3a" stroke={INK} strokeWidth={7} />
  <Floppy x={1180} y={540} s={0.22} rot={-10} glow />
  <rect x={160} y={240} width={300} height={620} fill="#e8d0a0" stroke={INK} strokeWidth={8} />
  {v.terence && <g opacity={0.95}><defs><filter id="tsil"><feColorMatrix type="matrix" values="0 0 0 0 0.05  0 0 0 0 0.04  0 0 0 0 0.05  0 0 0 1 0" /></filter></defs><g filter="url(#tsil)"><Person s={TERENCE} x={310} y={870} k={0.19} f={f} /></g></g>}
  <Carpet W={W} H={H} fy={FY} c="#6a6458" />
  <Person s={MARY} x={v.mx ?? 1000} y={FY + 60} k={0.23} f={f} expr={v.expr || 'neutral'} mode="idle" />
  <Glow x={1180} y={540} r={200} c="#ff4a3a" op={0.18} />
  <Dark op={v.dark ?? 0.34} />
</g>);
const closet: React.FC<SP> = ({ f, v }) => (<g>
  <R c="#2a2026" /><rect x={160} y={80} width={1600} height={1000} fill="#3a2e2a" stroke={INK} strokeWidth={12} />
  <rect x={160} y={460} width={1600} height={40} fill={Q.wood} stroke={INK} strokeWidth={8} /><path d="M200,200 H1720" stroke="#8a8a8a" strokeWidth={14} />
  {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${300 + i * 260},200 l-60,90 l20,${380 - (i % 2) * 60} h140 l20,-${380 - (i % 2) * 60} l-60,-90Z`} fill={['#5a4a5a', '#4a5a5a', '#6a5a4a', '#3a4a3a', '#5a5060'][i]} stroke={INK} strokeWidth={6} opacity={0.8} />)}
  <g transform="translate(960,460)"><rect x={-300} y={-220} width={600} height={220} fill="#c8b48a" stroke={INK} strokeWidth={8} /><rect x={-320} y={(v.lid ? -320 : -240)} width={640} height={50} fill="#b8a47a" stroke={INK} strokeWidth={8} transform={v.lid ? 'rotate(-12 -320 -280)' : ''} />{v.lid && <Floppy x={40} y={-210} s={0.36} rot={-12} glow />}</g>
  {[0, 1].map((i) => <rect key={i} x={360 + i * 1000} y={360} width={200} height={100} fill="#8a7a64" stroke={INK} strokeWidth={6} />)}
  <Glow x={960} y={300} r={600} c="#e8d8b0" op={0.12} />
  <Dark op={v.dark ?? 0.25} />
</g>);
const burn: React.FC<SP> = ({ f, v }) => (<g>
  <rect x={-600} y={-600} width={3200} height={1500} fill="#0e0c14" />
  <City W={W} H={H} f={f} gy={560} train={false} seed={9} />
  {Array.from({ length: 30 }).map((_, i) => <rect key={i} x={-600 + i * 110} y={520} width={90} height={260} fill="#3a2e26" stroke={INK} strokeWidth={5} />)}
  <rect x={-600} y={780} width={3200} height={600} fill="#1a1612" />
  {v.close ? <g><Barrel x={960} y={1300} s={1.4} f={f} disk />{[0, 1, 2].map((i) => <path key={i} d={`M${700 - i * 50},${300 - i * 30} q-60,30 -120,0 M${1220 + i * 50},${300 - i * 30} q60,30 120,0`} stroke="#f0e0c0" strokeWidth={6} fill="none" opacity={0.4} />)}</g>
    : <g><Barrel x={v.bx ?? 1100} y={900} s={0.5} f={f} disk={v.disk} /><Person s={TERENCE} x={v.tx ?? 700} y={940} k={0.25} f={f} expr={v.expr || 'fear'} /></g>}
  <Dark op={v.dark ?? 0.12} />
</g>);
const finals: React.FC<SP> = ({ f, v }) => (<g>
  <Blocks W={W} fy={700} />
  <rect x={-600} y={700} width={3200} height={800} fill="#7a6a56" stroke={INK} strokeWidth={8} />
  <g transform="translate(1300,330)"><rect x={-260} y={-220} width={520} height={440} fill="#f2ede0" stroke={INK} strokeWidth={8} /><rect x={-260} y={-220} width={520} height={80} fill="#2a3a5a" /><text x={0} y={-162} textAnchor="middle" fontFamily="Lora" fontWeight={700} fontSize={50} fill="#fff">MAY</text>{Array.from({ length: 28 }).map((_, i) => <text key={i} x={-220 + (i % 7) * 72} y={-80 + Math.floor(i / 7) * 80} fontFamily="Lora" fontSize={30} fill="#3a3a3a">{i + 1}</text>)}{[26, 27, 28].map((d) => <circle key={d} cx={-210 + ((d - 1) % 7) * 72} cy={-90 + Math.floor((d - 1) / 7) * 80} r={30} fill="none" stroke={Q.red} strokeWidth={5} />)}</g>
  {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={360 + i * 6} y={640 - i * 60} width={480} height={56} fill={['#6a3a3a', '#3a5a6a', '#5a6a3a', '#7a6a3a', '#4a4a6a'][i]} stroke={INK} strokeWidth={6} />)}
  <g transform="translate(1020,690)"><path d="M-70,0 V-160 H70 V0Z" fill="#c8c0a8" stroke={INK} strokeWidth={7} /><path d="M70,-130 q60,0 60,50 q0,40 -60,40" stroke={INK} strokeWidth={10} fill="none" /></g>
  <Lamp x={1700} y={700} s={0.9} />
  <Dark op={v.dark ?? 0.3} />
</g>);
// ---------- the ending: reflection, nightmare, CRT off, question, end screen
const reflect: React.FC<SP> = ({ f, v }) => { const a = Math.min(1, sf(f, 3) / 50); return (<g>
  <R c="#0a0c10" /><rect x={-600} y={900} width={3200} height={600} fill={Q.woodD} />
  <g transform="translate(960,960) scale(1.45)"><path d="M-400,-620 H400 L410,-40 H-410Z" fill="#2a2c30" stroke={INK} strokeWidth={9} /><rect x={-370} y={-590} width={740} height={520} fill="#0c1016" />
    <defs><clipPath id="rfc"><rect x={-370} y={-590} width={740} height={520} /></clipPath></defs>
    <g clipPath="url(#rfc)" opacity={0.55}><Face who="noah" x={-60} y={-300} k={0.75} f={f} expr={v.expr || 'neutral'} />{v.dog && <g opacity={a * 0.8} transform="translate(220,-420) scale(0.42)"><DogHead f={f} /></g>}</g>
    <path d="M-370,-590 L-150,-590 L-370,-300Z" fill="#fff" opacity={0.05} /></g>
  <Dark op={0.12} />
</g>); };
const nightNoah: React.FC<SP> = ({ f, v }) => (<g>
  <Blocks W={W} fy={FY} c="#3a3e44" />
  <g transform="translate(980,940)"><rect x={-660} y={-280} width={1320} height={150} fill={Q.woodD} stroke={INK} strokeWidth={8} /><rect x={-620} y={-370} width={1260} height={110} rx={30} fill="#b8bcc4" stroke={INK} strokeWidth={7} /></g>
  <Face who="noah" x={620} y={560} k={0.42} f={f} rot={-80} expr={v.expr || 'fear'} />
  <path d="M460,580 C700,520 1000,540 1660,580 L1680,720 C1200,700 800,700 460,720Z" fill="#3a4a6a" stroke={INK} strokeWidth={8} />
  <R c="#000" op={0.45} />
  {v.hand && <Beckon x={1700} y={300} s={1.6} f={f} rot={-110} />}
  {v.eyes && <g>{[-1, 1].map((q) => <ellipse key={q} cx={1500 + q * 60} cy={220} rx={30} ry={12} fill={Q.eye} opacity={0.8} />)}</g>}
</g>);
const crtoff: React.FC<SP> = ({ f, v }) => { const t = Math.min(1, sf(f, 3) / 30); return (<g>
  <R c="#0a0808" />
  <CRT x={960} y={1010} s={1.6} id="coff"><rect width={552} height={396} fill="#000" /><rect x={276 - 276 * (1 - t)} y={198 - 6 * (1 - t) - 190 * Math.max(0, 0.4 - t) * 2.5} width={Math.max(6, 552 * (1 - t))} height={Math.max(6, 12 + 380 * Math.max(0, 0.4 - t) * 2.5)} fill="#dff6ee" opacity={1 - t * 0.6} /></CRT>
</g>); };
const qcard: React.FC<SP> = ({ f, v }) => { const a = Math.min(1, sf(f, 3) / 15); return (<g>
  <R c="#0d080b" /><Glow x={1500} y={540} r={700} c={Q.flash} op={0.08} />
  <g opacity={0.3}><svg x={1100} y={140} width={900} height={800} viewBox="0 0 1920 1080"><Picture W={1920} H={1080} f={f} hand={false} /></svg></g>
  <g opacity={a}>
    <text x={120} y={440} fontFamily="Lora" fontWeight={700} fontSize={96} fill="#f1f4f8" stroke="#000" strokeWidth={3} paintOrder="stroke">Would you have</text>
    <text x={120} y={570} fontFamily="Lora" fontWeight={700} fontSize={96} fill="#ff3a2a" stroke="#000" strokeWidth={3} paintOrder="stroke">opened smile.jpg?</text>
    {v.credit && <text x={120} y={700} fontFamily="Lora" fontSize={34} fill="#aeb7c1">Inspired by the creepypasta "Smile Dog" (Creepypasta.com)</text>}
  </g>
</g>); };
// END SCREEN (last 20 s of the long video only). Clear zones: two video boxes on the right, subscribe button lower middle.
export const ENDZ = { v1: [1180, 150, 620, 349], v2: [1180, 580, 620, 349], sub: [780, 890, 120] };
const end: React.FC<SP> = ({ f, v }) => { const a = Math.min(1, sf(f, 3) / 30); return (<g>
  <R c="#120c10" /><Glow x={400} y={760} r={700} ry={400} c={Q.flash} op={0.06} />
  <g opacity={0.22 + 0.18 * a}><g transform="translate(640,600) scale(0.36)"><DogHead f={f} /></g></g>
  <Noah x={250} y={1050} s={0.15} f={f} view="back" />
  <text x={80} y={150} fontFamily="Lora" fontWeight={700} fontSize={62} fill="#f1f4f8">Would you have</text>
  <text x={80} y={230} fontFamily="Lora" fontWeight={700} fontSize={62} fill="#ff3a2a">opened smile.jpg?</text>
  <text x={80} y={300} fontFamily="Lora" fontSize={30} letterSpacing={6} fill="#aeb7c1">SCROLL KAOS</text>
  <text x={1180} y={120} fontFamily="Lora" fontWeight={700} fontSize={34} letterSpacing={4} fill="#aeb7c1">WATCH NEXT</text>
  {[ENDZ.v1, ENDZ.v2].map((z, i) => <rect key={i} x={z[0]} y={z[1]} width={z[2]} height={z[3]} fill="#181116" stroke="#2c2128" strokeWidth={3} rx={10} />)}
  <circle cx={ENDZ.sub[0]} cy={ENDZ.sub[1]} r={ENDZ.sub[2]} fill="#1c1418" stroke="#3a2c34" strokeWidth={4} />
</g>); };
export const SETS: Record<string, React.FC<SP>> = { photo, dogface, hand, marybed, city, aptdoor, hall, door, notes, faces, bbs, bbsface, screen, teen, fakes, dorm, campus, envelope, floppy, kitchen92, closet, burn, finals, reflect, nightNoah, crtoff, qcard, end };
