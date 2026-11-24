import React from 'react';
import { INK, Hand } from './Kit';
import { NOAH } from './Body';
import { sf } from './Beast';
import { Walls, Door, Blinds, Frame, StreetLamp, R, Glow } from './IH';
import { Q, MARY, TERENCE, Noah, Person, Face, DogHead, DogSit, Beckon, CRT, Tower, Keyboard, Modem, DeskPhone, Floppy, Envelope, Laptop, Desk, Lamp, Barrel, City, Wood70, Blocks, Carpet, Screen } from './SD';
// ===== 9:16 scene sets (1080x1920) for the "Smile Dog" Reel. Drawn on their own vertical canvas (no 16:9 scene is reused).
// Burned-in captions sit about 430 px above the bottom, so faces and key props stay between y 180 and y 1420.
export const W = 1080, H = 1920;
type SP = { f: number; v: any };
const FY = 1430;
const Dark: React.FC<{ op?: number }> = ({ op = 0.3 }) => <R c="#05030a" op={op} />;
const Floor: React.FC<{ c?: string }> = ({ c = '#140e10' }) => <rect x={-600} y={FY} width={2400} height={1200} fill={c} />;
// ---------- the picture (vertical): the dog sits centre, the hand reaches in from the left, flash pool above
const rphoto: React.FC<SP> = ({ f, v }) => { const dx = v.dx ?? 600, dy = v.dy ?? 1330, ds = v.ds ?? 0.44; return (<g>
  <R c="#0a0709" /><rect x={-600} y={1100} width={2400} height={1400} fill="#140e10" />
  <rect x={680} y={160} width={260} height={760} fill="#120c0e" stroke="#20161a" strokeWidth={8} />
  <Glow x={dx} y={820} r={760} ry={900} c={Q.flash} op={0.42} />
  <defs><filter id="rdsh"><feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" /><feGaussianBlur stdDeviation="10" /></filter></defs><g opacity={0.35} filter="url(#rdsh)"><g transform="translate(70,0)"><DogSit x={dx} y={dy} s={ds * 1.04} f={f} grin={0} /></g></g>
  <R c="#0a0709" op={0.0} />
  <DogSit x={dx} y={dy} s={ds} f={f} grin={v.grin ?? 1} />
  {v.hand !== false && <Beckon x={v.hx ?? 170} y={v.hy ?? 1060} s={v.hs ?? 1.45} f={f} rot={v.hr ?? 72} />}
  {v.dream && <g><defs><radialGradient id="rdrm"><stop offset="0.42" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.95" /></radialGradient></defs><rect x={-400} y={-300} width={1880} height={2520} fill="url(#rdrm)" /></g>}
  <R c="#2a1418" op={0.1} /><Dark op={v.dark ?? 0.08} />
</g>); };
const rdog: React.FC<SP> = ({ f, v }) => (<g>
  <R c="#0a0709" /><Glow x={540} y={v.y ?? 820} r={760} ry={900} c={Q.flash} op={0.3} />
  <g transform={`translate(${v.x ?? 540},${v.y ?? 820}) rotate(${(v.rot ?? 0) + Math.sin(sf(f, 3) / 30) * 2}) scale(${v.k ?? 1.05})`}><DogHead f={f} grin={v.talk ? 0.72 + 0.28 * Math.abs(Math.sin(sf(f, 3) / 3)) : (v.grin ?? 1)} eyes={v.eyes ?? 1} /></g>
  <Dark op={v.dark ?? 0.08} />
</g>);
const rhand: React.FC<SP> = ({ f, v }) => (<g>
  <R c="#060406" /><Glow x={700} y={900} r={700} c={Q.flash} op={0.12} />
  <Beckon x={v.x ?? 260} y={v.y ?? 980} s={v.k ?? 2.2} f={f} rot={v.rot ?? 50} />
  {v.eyes && <g opacity={0.75}>{[-1, 1].map((q) => <ellipse key={q} cx={760 + q * 70} cy={460} rx={34} ry={14} fill={Q.eye} />)}</g>}
  <Dark op={0.1} />
</g>);
const rmarybed: React.FC<SP> = ({ f, v }) => (<g>
  <Walls W={W} fy={FY} c="#4a3e46" d="#362c34" />
  <Frame x={120} y={300} w={180} h={130} kind={1} />
  <Carpet W={W} H={H} fy={FY} c="#4a3c3a" />
  <g transform="translate(560,1480)">
    <rect x={-560} y={-240} width={1120} height={170} fill={Q.wood} stroke={INK} strokeWidth={8} />
    <path d="M-560,-470 V-90 H-450 V-470 Q-505,-520 -560,-470Z" fill={Q.woodD} stroke={INK} strokeWidth={8} />
    <rect x={-520} y={-290} width={1060} height={70} rx={20} fill="#9ea4aa" stroke={INK} strokeWidth={7} />
    <rect x={-500} y={-420} width={340} height={140} rx={50} fill="#d4d8dc" stroke={INK} strokeWidth={7} />
  </g>
  <Face who="mary" x={250} y={1010} k={0.46} f={f} rot={-80} expr={v.open ? 'fear' : 'neutral'} />
  <path d="M360,1030 C560,980 800,990 1120,1030 L1120,1250 C800,1230 560,1230 360,1250Z" fill="#5a4a66" stroke={INK} strokeWidth={8} />
  {v.dream && <g opacity={0.32}><svg x={160} y={170} width={760} height={760} viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice"><RPic f={f} /></svg></g>}
  {v.dream && <Glow x={540} y={550} r={420} c="#8090c0" op={0.12} />}
  <Dark op={v.dark ?? 0.32} />
</g>);
const RPic: React.FC<{ f: number }> = ({ f }) => (<g><R c="#0a0709" /><Glow x={600} y={820} r={760} ry={900} c={Q.flash} op={0.42} /><DogSit x={600} y={1330} s={0.44} f={f} /><Beckon x={170} y={1060} s={1.45} f={f} rot={72} /></g>);
// ---------- Chicago
const rcity: React.FC<SP> = ({ f, v }) => (<g>
  <City W={W} H={H} f={f} gy={v.gy ?? 1350} train={v.train !== false} seed={v.seed || 4} />
  {v.apt && <g><rect x={560} y={560} width={460} height={800} fill="#3a2e2a" stroke={INK} strokeWidth={8} />{Array.from({ length: 6 }).map((_, r) => Array.from({ length: 3 }).map((_, c) => <rect key={r + '-' + c} x={600 + c * 140} y={600 + r * 120} width={80} height={80} fill={(r * 3 + c) % 5 === 2 ? '#f0d488' : '#1a1418'} stroke={INK} strokeWidth={4} />))}</g>}
  {v.era === '1992' && <R c="#2a4a3a" op={0.18} />}
  <Dark op={v.dark ?? 0.12} />
</g>);
// ---------- 1992 bulletin board room (vertical)
const rbbs: React.FC<SP> = ({ f, v }) => (<g>
  <Wood70 W={W} fy={FY} />
  <Blinds x={120} y={260} w={360} h={380} f={f} seed={5} open={0.55} outside={<City W={600} H={800} f={f} gy={560} />} />
  <Frame x={700} y={300} w={220} h={160} kind={2} />
  <Carpet W={W} H={H} fy={FY} />
  <Desk x={640} y={1150} w={820} />
  <Tower x={960} y={1150} s={0.5} />
  <CRT x={620} y={1150} s={0.62} id={'rcb' + (v.mode || 'bbs')}><Screen mode={v.mode || 'bbs'} w={552} h={396} f={f} /></CRT>
  <Glow x={620} y={950} r={420} c={Q.cyan} op={0.3} />
  <Keyboard x={620} y={1150} s={0.5} /><Modem x={360} y={1150} s={0.55} />
  {v.mary && <Person s={MARY} x={v.mx ?? 250} y={FY + 60} k={0.25} f={f} mode="lean" expr={v.mexpr || 'neutral'} />}
  <Dark op={v.dark ?? 0.28} />
</g>);
const rbbsface: React.FC<SP> = ({ f, v }) => (<g>
  <Wood70 W={W} fy={2400} />
  <Glow x={540} y={800} r={700} c={Q.cyan} op={0.42} />
  <Face who="mary" x={540} y={760} k={v.k ?? 1.3} f={f} expr={v.expr || 'neutral'} glow={Q.cyan} />
  <rect x={-600} y={1300} width={2400} height={700} fill={Q.woodD} /><Keyboard x={540} y={1420} s={1.25} />
  <Dark op={0.18} />
</g>);
const rscreen: React.FC<SP> = ({ f, v }) => (<g>
  <R c={v.dev === 'laptop' ? '#141820' : '#1d1519'} />
  <g transform={`rotate(${v.rot ?? 0} 540 900)`}>
  {v.dev === 'laptop' ? <g><Glow x={540} y={800} r={800} c={Q.cyan} op={0.22} /><rect x={-600} y={1180} width={2400} height={900} fill={Q.woodD} /><Laptop x={540} y={1240} s={v.s ?? 1.12} id={'rls' + v.mode}><Screen mode={v.mode} w={740} h={520} f={f} /></Laptop></g>
    : <g><Glow x={540} y={760} r={800} c={Q.cyan} op={0.24} /><rect x={-600} y={1200} width={2400} height={900} fill={Q.woodD} />{v.disk && <Floppy x={880} y={1330} s={0.42} rot={14} />}<CRT x={540} y={1230} s={v.s ?? 1.4} id={'rcs' + v.mode}><Screen mode={v.mode} w={552} h={396} f={f} /></CRT></g>}
  </g>
  <Dark op={v.dark ?? 0.1} />
</g>);
// ---------- 2007 hallway, the locked door
const rhall: React.FC<SP> = ({ f, v }) => (<g>
  <Walls W={W} fy={FY} c={Q.wall07} d={Q.wall07D} />
  <Frame x={90} y={420} w={140} h={180} kind={1} />
  <Carpet W={W} H={H} fy={FY} c="#5a4636" />
  <Door x={540} y={FY} s={1.2} open={0} c="#6e6252" />
  <rect x={365} y={FY - 8} width={350} height={10} fill="#f0dca0" />
  <Glow x={540} y={FY} r={260} ry={50} c="#f0dca0" op={0.45} />
  {v.cry && [0, 1, 2].map((i) => <path key={i} d={`M${760 + i * 40},${860 - i * 10} q30,60 0,120`} stroke="#e8e0d0" strokeWidth={6} fill="none" opacity={0.25 + 0.2 * Math.sin(sf(f, 3) / 8 + i)} />)}
  <Person s={TERENCE} x={v.tx ?? 200} y={FY + 60} k={0.26} f={f} expr={v.texpr || 'speak'} mode="lean" />
  <Noah x={v.nx ?? 880} y={FY + 70} s={0.26} f={f} view="three" note expr={v.nexpr || 'neutral'} />
  <Dark op={v.dark ?? 0.24} />
</g>);
const rdoor: React.FC<SP> = ({ f, v }) => (<g>
  <R c="#6e6252" />
  {[[140, 120, 800, 560], [140, 760, 800, 520]].map((r, i) => <rect key={i} x={r[0]} y={r[1]} width={r[2]} height={r[3]} fill="none" stroke={INK} strokeWidth={8} opacity={0.5} />)}
  <rect x={-600} y={1380} width={2400} height={26} fill="#f0dca0" />
  {v.feet && <rect x={400 + Math.sin(sf(f, 3) / 10) * 140} y={1380} width={150} height={26} fill="#140c10" />}
  <rect x={-600} y={1406} width={2400} height={700} fill="#5a4636" />
  <circle cx={900} cy={860} r={40} fill="#c0a060" stroke={INK} strokeWidth={8} />
  {v.hand && <Hand x={500} y={900} s={1.5} rot={-10} skin={TERENCE.skin} shade={TERENCE.skinD} sleeve={TERENCE.topC} sleeveLen={600} ext={[0.95, 1, 0.95, 0.85]} />}
  {v.cry && [0, 1, 2, 3].map((i) => <path key={i} d={`M${260 + i * 160},${420} q40,${80 + i * 10} 0,${180}`} stroke="#fff4e0" strokeWidth={8} fill="none" opacity={0.18 + 0.15 * Math.sin(sf(f, 3) / 8 + i)} />)}
  <Dark op={v.dark ?? 0.2} />
</g>);
// ---------- vertical face close-ups with backgrounds
const rfaces: React.FC<SP> = ({ f, v }) => { const bg = v.bg || 'hall'; const k = v.k ?? 1.6; return (<g>
  {bg === 'hall' && <Walls W={W} fy={2400} c={Q.wall07} d={Q.wall07D} />}
  {bg === 'dorm' && <g><Blocks W={W} fy={2400} /><Glow x={800} y={900} r={700} c={Q.cyan} op={0.25} /></g>}
  {bg === 'dark' && <R c="#0c080c" />}
  {bg === 'yard' && <g><R c="#120e18" /><Glow x={200} y={1300} r={700} c="#ffa040" op={0.35} /></g>}
  <Face who={v.who || 'noah'} x={v.x ?? 540} y={v.y ?? 820} k={k} f={f} expr={v.expr || 'neutral'} rot={v.rot ?? 0} tears={v.tears} turn={v.turn ?? 0} glow={v.glow} />
  {v.phone && <g transform={`translate(${(v.x ?? 540) + 230 * k / 1.5},${(v.y ?? 820) + 40}) rotate(20) scale(${k / 1.5})`}><rect x={-60} y={-200} width={120} height={360} rx={30} fill={v.who === 'terence' ? '#c8bea4' : '#2a2c30'} stroke={INK} strokeWidth={8} /><Hand x={30} y={120} s={1.1} rot={-20} skin={v.who === 'terence' ? TERENCE.skin : NOAH.skin} shade={v.who === 'terence' ? TERENCE.skinD : NOAH.shade} sleeve={v.who === 'terence' ? TERENCE.topC : NOAH.robe} sleeveLen={300} ext={[0.4, 0.4, 0.35, 0.3]} /></g>}
  <Dark op={v.dark ?? 0.16} />
</g>); };
// ---------- 2008 dorm (vertical)
const rdorm: React.FC<SP> = ({ f, v }) => (<g>
  <Blocks W={W} fy={FY} />
  <Blinds x={620} y={260} w={340} h={360} f={f} seed={11} open={0.6} />
  <Frame x={110} y={330} w={200} h={260} kind={0} />
  <Carpet W={W} H={H} fy={FY} c="#4a4e56" />
  <Desk x={620} y={1160} w={820} c="#7a6a56" />
  <Laptop x={640} y={1160} s={0.5} id={'rdl' + (v.mode || 'inbox')}><Screen mode={v.mode || 'inbox'} w={740} h={520} f={f} /></Laptop>
  <Lamp x={960} y={1160} s={0.55} on />
  <Noah x={v.nx ?? 230} y={FY + 70} s={0.26} f={f} view={v.view || 'three'} expr={v.expr || 'neutral'} />
  <Dark op={v.dark ?? 0.36} />
</g>);
// ---------- envelope, floppy, burn, reflection, nightmare, cards
const rfloppy: React.FC<SP> = ({ f, v }) => { const t = Math.min(1, sf(f, 3) / 60); return (<g>
  <R c="#2a2024" /><rect x={-600} y={900} width={2400} height={1300} fill={Q.woodD} />
  {v.env && <Envelope x={540} y={1000} s={1.15} rot={-8} open={1} />}
  <Floppy x={v.env ? 540 + t * 60 : 540} y={v.env ? 860 - t * 160 : 860} s={v.k ?? 1.5} rot={(v.rot ?? -8) + Math.sin(sf(f, 3) / 20) * 2} glow={v.glow} />
  {v.hand && <Hand x={860} y={1180} s={1.7} rot={-60} skin={MARY.skin} shade={MARY.skinD} sleeve={MARY.topC} sleeveLen={600} ext={[0.6, 0.55, 0.5, 0.45]} />}
  <Dark op={v.dark ?? 0.2} />
</g>); };
const rburn: React.FC<SP> = ({ f, v }) => (<g>
  <rect x={-600} y={-600} width={2400} height={2400} fill="#0e0c14" />
  <City W={W} H={H} f={f} gy={900} train={false} seed={9} />
  {Array.from({ length: 24 }).map((_, i) => <rect key={i} x={-600 + i * 110} y={860} width={90} height={300} fill="#3a2e26" stroke={INK} strokeWidth={5} />)}
  <rect x={-600} y={1160} width={2400} height={900} fill="#1a1612" />
  {v.close ? <Barrel x={540} y={1700} s={1.15} f={f} disk />
    : <g><Barrel x={760} y={1380} s={0.55} f={f} disk /><Person s={TERENCE} x={280} y={1440} k={0.27} f={f} expr="fear" /></g>}
  <Dark op={v.dark ?? 0.12} />
</g>);
const rreflect: React.FC<SP> = ({ f, v }) => { const a = Math.min(1, sf(f, 3) / 50); return (<g>
  <R c="#0a0c10" /><rect x={-600} y={1300} width={2400} height={900} fill={Q.woodD} />
  <g transform="translate(540,1360) scale(1.25)"><path d="M-400,-620 H400 L410,-40 H-410Z" fill="#2a2c30" stroke={INK} strokeWidth={9} /><rect x={-370} y={-590} width={740} height={520} fill="#0c1016" />
    <defs><clipPath id="rrfc"><rect x={-370} y={-590} width={740} height={520} /></clipPath></defs>
    <g clipPath="url(#rrfc)" opacity={0.55}><Face who="noah" x={-60} y={-300} k={0.75} f={f} expr={v.expr || 'neutral'} />{v.dog && <g opacity={a * 0.8} transform="translate(220,-420) scale(0.42)"><DogHead f={f} /></g>}</g></g>
  <Dark op={0.12} />
</g>); };
const rnight: React.FC<SP> = ({ f, v }) => (<g>
  <Blocks W={W} fy={FY} c="#3a3e44" /><Carpet W={W} H={H} fy={FY} c="#34383e" />
  <g transform="translate(560,1480)"><rect x={-560} y={-240} width={1120} height={170} fill={Q.woodD} stroke={INK} strokeWidth={8} /><rect x={-520} y={-290} width={1060} height={70} rx={20} fill="#9a9ea6" stroke={INK} strokeWidth={7} /><rect x={-500} y={-420} width={340} height={140} rx={50} fill="#c8ccd4" stroke={INK} strokeWidth={7} /></g>
  <Face who="noah" x={250} y={1010} k={0.46} f={f} rot={-80} expr="fear" />
  <path d="M360,1030 C560,980 800,990 1120,1030 L1120,1250 C800,1230 560,1230 360,1250Z" fill="#3a4a6a" stroke={INK} strokeWidth={8} />
  <R c="#000" op={0.35} />
  {v.hand && <Beckon x={980} y={420} s={1.6} f={f} rot={-115} />}
  {v.eyes && <g>{[-1, 1].map((q) => <ellipse key={q} cx={620 + q * 60} cy={520} rx={30} ry={12} fill={Q.eye} opacity={0.8} />)}</g>}
</g>);
const rcrtoff: React.FC<SP> = ({ f }) => { const t = Math.min(1, sf(f, 3) / 30); return (<g>
  <R c="#0a0808" />
  <CRT x={540} y={1240} s={1.3} id="rcoff"><rect width={552} height={396} fill="#000" /><rect x={276 - 276 * (1 - t)} y={198 - 6 * (1 - t) - 190 * Math.max(0, 0.4 - t) * 2.5} width={Math.max(6, 552 * (1 - t))} height={Math.max(6, 12 + 380 * Math.max(0, 0.4 - t) * 2.5)} fill="#dff6ee" opacity={1 - t * 0.6} /></CRT>
</g>); };
const rqcard: React.FC<SP> = ({ f, v }) => { const a = Math.min(1, sf(f, 3) / 15); return (<g>
  <R c="#0d080b" />
  <g opacity={0.32}><g transform="translate(540,1000) scale(0.6)"><DogHead f={f} grin={v.credit ? 0.5 : 1} /></g></g>
  <g opacity={a}>
    {v.credit ? <g><text x={540} y={400} textAnchor="middle" fontFamily="Lora" fontSize={46} fill="#aeb7c1">Inspired by the creepypasta</text><text x={540} y={500} textAnchor="middle" fontFamily="Lora" fontWeight={700} fontSize={86} fill="#f1f4f8">"Smile Dog"</text><text x={540} y={580} textAnchor="middle" fontFamily="Lora" fontSize={42} fill="#aeb7c1">(Creepypasta.com)</text></g>
      : <g><text x={540} y={380} textAnchor="middle" fontFamily="Lora" fontWeight={700} fontSize={92} fill="#f1f4f8" stroke="#000" strokeWidth={3} paintOrder="stroke">Would you have</text><text x={540} y={500} textAnchor="middle" fontFamily="Lora" fontWeight={700} fontSize={92} fill="#ff3a2a" stroke="#000" strokeWidth={3} paintOrder="stroke">opened</text><text x={540} y={620} textAnchor="middle" fontFamily="Lora" fontWeight={700} fontSize={92} fill="#ff3a2a" stroke="#000" strokeWidth={3} paintOrder="stroke">smile.jpg?</text></g>}
  </g>
</g>); };
export const SETS: Record<string, React.FC<SP>> = { rphoto, rdog, rhand, rmarybed, rcity, rbbs, rbbsface, rscreen, rhall, rdoor, rfaces, rdorm, rfloppy, rburn, rreflect, rnight, rcrtoff, rqcard };
