// SetsL.tsx — 16:9 sets (1920x1080) for Eyeless Jack (kit m).
import React from 'react';
import {
  R, Glow, Walls, Bed, Nightstand, Frame, Mirror, Curtain, Sedan, StreetLamp,
  Sky, Clouds, PitchPine, Barrens, M, Person, Face, EyelessJack,
} from './EJ';

export type SProps = { f: number; v: any; t?: number; len?: number };

export const bedroom: React.FC<SProps> = ({ f, v }) => {
  const night = v.night !== false;
  return (
    <g>
      <R c={night ? M.wallNight : M.wallDay} />
      <Walls W={1920} fy={740} c={night ? M.wallNight : M.wallDay} />
      <Nightstand x={1540} y={620} s={1.1} />
      <Bed x={640} y={560} s={1.1} state={v.tossing ? 'rumpled' : 'normal'} f={f} />
      <Curtain x={1680} y={160} h={480} f={f} wind={v.curtain ? 1 : 0} />
      <Frame x={340} y={300} w={120} h={160} kind={0} />
      <Glow x={1560} y={560} r={260} c={M.warm} op={0.35} />
      {night && <Glow x={1680} y={200} r={340} c={M.cold} op={0.22} />}
      {v.settling && <Person who="mitch" x={520} y={760} s={0.24} f={f} expr="neutral" />}
      {!v.settling && !v.shadow && !v.creature && (
        <Person who="mitch" x={640} y={700} s={0.24} f={f}
          expr={v.night ? 'fear' : 'neutral'} />
      )}
      {(v.shadow === 'jack' || v.creature === 'jack') && (
        <EyelessJack x={1180 + (v.px ?? 0)} y={760} k={1.05} f={f}
          face={(v.face ?? 1) as 1 | -1} pose={(v.pose as any) ?? 'stand'}
          ooze={v.ooze ?? 0.3} />
      )}
      <R c="#05030a" op={v.dark ?? (night ? 0.3 : 0.12)} />
    </g>
  );
};

export const hallway: React.FC<SProps> = ({ f, v }) => {
  const day = v.day === true;
  return (
    <g>
      <R c={day ? M.wallDay : M.wallNight} />
      <Walls W={1920} fy={760} c={day ? M.wallDay : M.wallNight} wain={true} />
      <Frame x={300} y={320} w={100} h={140} /><Frame x={620} y={340} w={100} h={140} /><Frame x={940} y={300} w={100} h={140} />
      <Mirror x={1480} y={420} w={180} h={280}>{v.mirror && <rect width={180} height={280} fill="#8da3b8" opacity={0.3} />}</Mirror>
      <Glow x={960} y={200} r={300} c={day ? M.warm : M.cold} op={0.3} />
      {v.greet && (
        <>
          <Person who="mitch" x={720} y={780} s={0.24} f={f} expr="neutral" />
          <Person who="edwin" x={1060} y={780} s={0.25} f={f} expr="neutral" />
        </>
      )}
      {v.fleeing && <Person who="mitch" x={900} y={760} s={0.25} f={f} expr="fear" />}
      {v.shadowed && (
        <Person who="mitch" x={960} y={760} s={0.25} f={f} expr="fear" />
      )}
      <R c="#05030a" op={v.dark ?? (day ? 0.12 : 0.35)} />
    </g>
  );
};

export const kitchen: React.FC<SProps> = ({ f, v }) => (
  <g>
    <R c={M.wallDay} />
    <Walls W={1920} fy={780} c={M.wallDay} />
    <Nightstand x={1500} y={660} s={1.0} />
    {v.broken_mug && (
      <g transform="translate(760 880)">
        <ellipse cx={0} cy={0} rx={70} ry={14} fill="#1a1c22" opacity={0.6} />
        <path d="M -40 -4 L -10 2 L 20 -6 L 46 4" stroke="#c9d3e0" strokeWidth={4} fill="none" />
      </g>
    )}
    <Glow x={960} y={160} r={320} c={M.warm} op={0.3} />
    <Glow x={1600} y={260} r={260} c={M.cold} op={0.18} />
    {v.boxes && <Person who="mitch" x={640} y={780} s={0.24} f={f} expr="neutral" />}
    {v.who2 === 'edwin' && (
      <>
        <Person who="mitch" x={700} y={800} s={0.24} f={f} expr={v.expr ?? 'neutral'} />
        <Person who="edwin" x={1060} y={800} s={0.25} f={f} expr={v.expr ?? 'neutral'} />
      </>
    )}
    <R c="#05030a" op={v.dark ?? 0.14} />
  </g>
);

export const hospital: React.FC<SProps> = ({ f, v }) => (
  <g>
    <R c="#1b2230" />
    <Walls W={1920} fy={780} c="#1b2230" />
    <Bed x={700} y={620} s={1.1} state={v.bedridden ? 'rumpled' : 'normal'} f={f} />
    <Curtain x={1560} y={220} h={460} f={f} />
    <Glow x={960} y={120} r={420} c="#c7e4ff" op={0.4} />
    <Glow x={620} y={660} r={240} c={M.warm} op={0.22} />
    {v.bandage && (
      <g transform="translate(700 780)">
        <rect x={-90} y={-24} width={180} height={48} rx={10} fill="#e9e3d6" />
        <rect x={-90} y={-24} width={180} height={48} rx={10} fill={M.red} opacity={v.red ?? 0.35} />
      </g>
    )}
    {v.who2 === 'doctor' && (
      <>
        <Person who="mitch" x={700} y={800} s={0.24} f={f} expr="fear" />
        <Person who="doctor" x={1140} y={800} s={0.26} f={f} expr="neutral" />
      </>
    )}
    {v.bedridden && !v.who2 && <Person who="mitch" x={700} y={760} s={0.24} f={f} expr="fear" />}
    <R c="#05030a" op={v.dark ?? 0.1} />
  </g>
);

export const woods: React.FC<SProps> = ({ f, v }) => (
  <g>
    <Sky W={1920} H={1080} f={f} tone="night" />
    <Clouds W={1920} y={160} f={f} />
    <PitchPine x={340} y={700} s={1.2} f={f} />
    <PitchPine x={1580} y={720} s={1.1} f={f} />
    <Barrens W={1920} gy={740} f={f} />
    <Glow x={1700} y={900} r={260} c={M.warm} op={0.15} />
    <Glow x={560} y={200} r={360} c={M.cold} op={0.3} />
    {v.running && <Person who="mitch" x={760} y={820} s={0.24} f={f} expr="fear" />}
    {v.creature === 'jack' && (
      <EyelessJack x={1200 + (v.px ?? 0)} y={840} k={1.0} f={f}
        face={(v.face ?? 1) as 1 | -1} pose={(v.pose as any) ?? 'stand'} ooze={v.ooze ?? 0.4} />
    )}
    {v.fallen && (
      <Person who="mitch" x={820} y={920} s={0.22} f={f} expr="fear" />
    )}
    <R c="#05030a" op={v.dark ?? 0.4} />
  </g>
);

export const car: React.FC<SProps> = ({ f, v }) => (
  <g>
    <R c="#15161e" />
    <Sedan x={960} y={600} s={1.2} f={f} lights={v.driving ? 1 : 0} />
    <StreetLamp x={1700} y={300} on={v.driving} />
    <Glow x={960} y={760} r={240} c={M.warm} op={0.28} />
    {v.holding && (
      <g transform="translate(960 840)">
        <ellipse cx={0} cy={0} rx={44} ry={28} fill="#120f10" stroke="#2a2420" strokeWidth={3} />
        <ellipse cx={-6} cy={-4} rx={18} ry={10} fill={M.oozeC} opacity={0.8} />
      </g>
    )}
    {v.driving && <Person who="mitch" x={760} y={760} s={0.2} f={f} expr="fear" />}
    <R c="#05030a" op={v.dark ?? 0.25} />
  </g>
);

export const face: React.FC<SProps> = ({ f, v }) => (
  <g>
    <R c="#0a0b12" />
    <Glow x={960} y={400} r={420} c={M.cold} op={0.3} />
    <Face who={v.who ?? 'mitch'} x={960} y={520} k={1.3} f={f} expr={v.expr ?? 'fear'}
      turn={v.turn ?? 0} tag={v.tag} gash={v.gash} />
  </g>
);

export const qcard: React.FC<SProps> = () => (
  <g>
    <R c="#13100c" />
    <rect x={260} y={200} width={1400} height={680} fill="#1c1812" stroke={M.red} strokeWidth={4} />
    <text x={960} y={520} textAnchor="middle" fontFamily="Lora, serif" fontSize={40} fill="#e9e1d2">
      Inspired by the Eyeless Jack creepypasta
    </text>
    <text x={960} y={580} textAnchor="middle" fontFamily="Lora, serif" fontSize={30} fill="#b8ad99">
      as shared online, 2012
    </text>
  </g>
);

export const end: React.FC<SProps> = ({ f }) => (
  <g>
    <R c="#0a0b12" />
    <Glow x={700} y={760} r={300} c={M.cold} op={0.2} />
    <Person who="mitch" x={300} y={900} s={0.16} f={f} expr="neutral" />
    <EyelessJack x={560} y={900} k={0.5} f={f} face={1} pose="stand" ooze={0.1} />
    <text x={80} y={120} fontFamily="Lora, serif" fontSize={46} fill="#e9e1d2">
      Would you have believed it was only a raccoon?
    </text>
    <rect x={1180} y={150} width={620} height={349} fill="#111" stroke="#333" strokeWidth={2} />
    <rect x={1180} y={580} width={620} height={349} fill="#111" stroke="#333" strokeWidth={2} />
    <circle cx={780} cy={890} r={120} fill="none" stroke={M.red} strokeWidth={4} />
  </g>
);

export const SETS: Record<string, React.FC<SProps>> = {
  bedroom, hallway, kitchen, hospital, woods, car, face, qcard, end,
};
