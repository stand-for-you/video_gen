import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { LightSet, LIGHT_NIGHT } from './Paint';
import { Creature, CreatureBust, CREATURES, anchors } from './kits/Monster';
import { BedroomBack, NoahLying, NoahInBedCU, Defs, PAL_DAWN, LIGHT_DAWN } from './IKA';
import { Bed, Nightstand, Dust, PAL_NIGHT, NightMask } from './kits/Interior';
import { BloodWriting, BloodPool, WallDrips, HandPrint, Stain } from './kits/Blood';
import { Tag, Measure, Cutaway } from './kits/Explain';
// KIT LAB: frame i*100 shows test plate i (QA of kits before scenes). npx remotion still src/index.ts Lab out.png --frame=N
const c = CREATURES.waxman;
const W = 1920, H = 1080;
const plates: ((f: number) => React.ReactNode)[] = [
  (f) => <g><rect width={W} height={H} fill="#2a2730" /><Creature c={c} x={500} y={1000} k={0.26} f={f} /><Creature c={c} x={1300} y={1000} k={0.26} f={f} view="front" jaw={0.6} blood={{ hands: 1, mouth: 1 }} /></g>,
  (f) => <g><Defs P={PAL_NIGHT} /><LightSet {...LIGHT_NIGHT}><BedroomBack W={W} H={H} floorY={760} f={f} shaft={[620, 1000, 520]} />
    <Bed x={520} y={1010} w={1000} s={0.62} f={f} occupant={<NoahLying f={f} />} />
    <Nightstand x={330} y={1000} s={0.62} time="3:07" />
    <Creature c={c} x={1180} y={1010} k={0.27} f={f} pose="lean" face={-1} p={1} jaw={0.4} />
    <Dust x={300} y={300} w={700} h={700} f={f} /></LightSet>
    <NightMask W={W} H={H} x={760} y={600} r={1100} o={0.6} />
    <Measure x={1560} y0={1010 - 0.27 * 2900} y1={1010} text="2.9 M" f={f + 200} side={1} />
    <Tag at={anchors({ c, x: 1180, y: 1010, k: 0.27, f, pose: 'lean', face: -1, p: 1 }).eye} to={[1000, 260]} text="NO EYES" f={f + 200} icon="eye" />
  </g>,
  (f) => <g><Defs P={PAL_NIGHT} /><NoahInBedCU W={W} H={H} f={f} expr="sleepy" /></g>,
  (f) => <g><Defs P={PAL_DAWN} /><LightSet {...LIGHT_DAWN}><BedroomBack W={W} H={H} floorY={800} f={f} P={PAL_DAWN} dawn door={null} frames={false} />
    <BloodWriting text={"I KNOW\nYOU'RE AWAKE"} x={1100} y={190} size={130} p={1} f={f + 600} />
    <WallDrips x={700} y={560} w={800} f={f + 300} />
    <HandPrint x={560} y={420} s={1.1} rot={-12} drag={120} long={1.5} />
    <Bed x={700} y={1050} w={1000} s={0.7} P={PAL_DAWN} f={f} bump={0} stain={<Stain x={700} y={-330} r={180} />} />
    <BloodPool x={1500} y={990} r={220} grow={1} /></LightSet></g>,
  (f) => <g><rect width={W} height={H} fill="#141820" /><g transform="translate(960,330) scale(0.62)"><LightSet {...LIGHT_NIGHT}><CreatureBust c={c} f={f} jaw={0.55} blood={{ mouth: 0.0 }} /></LightSet></g>
    <Cutaway id="cw1" at={[960, 330]} c={[1550, 560]} r={240} f={f + 200} label="NO EYES">
      <g transform="translate(0,40) scale(0.9)"><LightSet {...LIGHT_NIGHT}><CreatureBust c={c} f={f} jaw={0} /></LightSet></g></Cutaway></g>,
];
export const Lab: React.FC = () => { const i = useCurrentFrame(); const p = Math.floor(i / 100), f = i % 100; return <AbsoluteFill style={{ background: '#000' }}><svg width={1920} height={1080}>{plates[Math.min(p, plates.length - 1)](f + 40)}</svg></AbsoluteFill>; };
export const LAB_PLATES = plates.length;
