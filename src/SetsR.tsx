// SetsR.tsx — 9:16 sets (1080x1920) for Eyeless Jack (kit m). Drawn again from scratch;
// does NOT import SetsL.tsx. Keep key content between y 180 and 1420 (Reel caption zone
// sits around y 1450+).
import React from 'react';
import {
  R, Glow, Walls, Bed, Nightstand, Frame, Mirror, Curtain, Sedan, StreetLamp,
  Sky, Clouds, PitchPine, Barrens, M, Person, Face, EyelessJack,
} from './EJ';

export type SProps = { f: number; v: any; t?: number; len?: number };

export const rbedroom: React.FC<SProps> = ({ f, v }) => {
  const night = v.night !== false;
  return (
    <g>
      <R c={night ? M.wallNight : M.wallDay} />
      <Walls W={1080} fy={1360} c={night ? M.wallNight : M.wallDay} />
      <Nightstand x={820} y={1100} s={1.1} />
      <Bed x={380} y={1000} s={1.1} state={v.tossing ? 'rumpled' : 'normal'} f={f} />
      <Curtain x={920} y={260} h={520} f={f} wind={v.curtain ? 1 : 0} />
      <Glow x={900} y={900} r={320} c={M.warm} op={0.32} />
      {night && <Glow x={920} y={300} r={420} c={M.cold} op={0.2} />}
      {!v.shadow && !v.creature && (
        <Person who="mitch" x={380} y={1300} s={0.3} f={f} expr={night ? 'fear' : 'neutral'} />
      )}
      {(v.shadow === 'jack' || v.creature === 'jack') && (
        <EyelessJack x={620 + (v.px ?? 0)} y={1340} k={1.25} f={f}
          face={(v.face ?? 1) as 1 | -1} pose={(v.pose as any) ?? 'stand'} ooze={v.ooze ?? 0.3} />
      )}
      <R c="#05030a" op={v.dark ?? (night ? 0.3 : 0.12)} />
    </g>
  );
};

export const rhallway: React.FC<SProps> = ({ f, v }) => {
  const day = v.day === true;
  return (
    <g>
      <R c={day ? M.wallDay : M.wallNight} />
      <Walls W={1080} fy={1360} c={day ? M.wallDay : M.wallNight} wain={true} />
      <Frame x={300} y={420} w={100} h={140} /><Frame x={300} y={720} w={100} h={140} />
      <Mirror x={760} y={560} w={160} h={240}>{v.mirror && <rect width={160} height={240} fill="#8da3b8" opacity={0.3} />}</Mirror>
      <Glow x={540} y={300} r={340} c={day ? M.warm : M.cold} op={0.3} />
      {v.greet && (
        <>
          <Person who="mitch" x={360} y={1340} s={0.3} f={f} expr="neutral" />
          <Person who="edwin" x={720} y={1340} s={0.31} f={f} expr="neutral" />
        </>
      )}
      {v.shadowed && <Person who="mitch" x={540} y={1300} s={0.3} f={f} expr="fear" />}
      <R c="#05030a" op={v.dark ?? (day ? 0.12 : 0.35)} />
    </g>
  );
};

export const rkitchen: React.FC<SProps> = ({ f, v }) => (
  <g>
    <R c={M.wallDay} />
    <Walls W={1080} fy={1380} c={M.wallDay} />
    <Nightstand x={760} y={1120} s={1.0} />
    <Glow x={540} y={260} r={360} c={M.warm} op={0.3} />
    {v.boxes && <Person who="mitch" x={420} y={1340} s={0.3} f={f} expr="neutral" />}
    {v.who2 === 'edwin' && (
      <>
        <Person who="mitch" x={360} y={1360} s={0.29} f={f} expr="neutral" />
        <Person who="edwin" x={720} y={1360} s={0.3} f={f} expr="neutral" />
      </>
    )}
    <R c="#05030a" op={v.dark ?? 0.14} />
  </g>
);

export const rhospital: React.FC<SProps> = ({ f, v }) => (
  <g>
    <R c="#1b2230" />
    <Walls W={1080} fy={1380} c="#1b2230" />
    <Bed x={520} y={1040} s={1.1} state={v.bedridden ? 'rumpled' : 'normal'} f={f} />
    <Glow x={540} y={220} r={460} c="#c7e4ff" op={0.4} />
    <Glow x={700} y={1100} r={260} c={M.warm} op={0.22} />
    {v.bandage && (
      <g transform="translate(540 1280)">
        <rect x={-100} y={-26} width={200} height={52} rx={12} fill="#e9e3d6" />
        <rect x={-100} y={-26} width={200} height={52} rx={12} fill={M.red} opacity={v.red ?? 0.35} />
      </g>
    )}
    {v.who2 === 'doctor' && (
      <>
        <Person who="mitch" x={400} y={1360} s={0.29} f={f} expr="fear" />
        <Person who="doctor" x={740} y={1360} s={0.31} f={f} expr="neutral" />
      </>
    )}
    {v.bedridden && !v.who2 && <Person who="mitch" x={520} y={1320} s={0.29} f={f} expr="fear" />}
    <R c="#05030a" op={v.dark ?? 0.1} />
  </g>
);

export const rwoods: React.FC<SProps> = ({ f, v }) => (
  <g>
    <Sky W={1080} H={1920} f={f} tone="night" />
    <Clouds W={1080} y={240} f={f} />
    <PitchPine x={180} y={1240} s={1.1} f={f} />
    <PitchPine x={900} y={1260} s={1.0} f={f} />
    <Barrens W={1080} gy={1360} f={f} />
    <Glow x={520} y={300} r={420} c={M.cold} op={0.3} />
    {v.running && <Person who="mitch" x={520} y={1320} s={0.3} f={f} expr="fear" />}
    {v.creature === 'jack' && (
      <EyelessJack x={600 + (v.px ?? 0)} y={1340} k={1.15} f={f}
        face={(v.face ?? 1) as 1 | -1} pose={(v.pose as any) ?? 'stand'} ooze={v.ooze ?? 0.4} />
    )}
    {v.fallen && <Person who="mitch" x={520} y={1420} s={0.26} f={f} expr="fear" />}
    <R c="#05030a" op={v.dark ?? 0.4} />
  </g>
);

export const rcar: React.FC<SProps> = ({ f, v }) => (
  <g>
    <R c="#15161e" />
    <Sedan x={540} y={1060} s={1.1} f={f} lights={v.driving ? 1 : 0} />
    <StreetLamp x={940} y={420} on={v.driving} />
    <Glow x={540} y={1240} r={300} c={M.warm} op={0.28} />
    {v.holding && (
      <g transform="translate(540 1420)">
        <ellipse cx={0} cy={0} rx={52} ry={34} fill="#120f10" stroke="#2a2420" strokeWidth={3} />
        <ellipse cx={-8} cy={-4} rx={22} ry={12} fill={M.oozeC} opacity={0.8} />
      </g>
    )}
    <R c="#05030a" op={v.dark ?? 0.25} />
  </g>
);

export const rface: React.FC<SProps> = ({ f, v }) => (
  <g>
    <R c="#0a0b12" />
    <Glow x={540} y={760} r={460} c={M.cold} op={0.3} />
    <Face who={v.who ?? 'mitch'} x={540} y={900} k={1.6} f={f} expr={v.expr ?? 'fear'}
      turn={v.turn ?? 0} tag={v.tag} gash={v.gash} />
  </g>
);

export const rqcard: React.FC<SProps> = ({ v }) => (
  <g>
    <R c="#13100c" />
    <rect x={120} y={600} width={840} height={700} fill="#1c1812" stroke={M.red} strokeWidth={4} />
    {v.question ? (
      <text x={540} y={960} textAnchor="middle" fontFamily="Lora, serif" fontSize={44} fill="#e9e1d2">
        Would you have believed{'\n'}it was only a raccoon?
      </text>
    ) : (
      <>
        <text x={540} y={920} textAnchor="middle" fontFamily="Lora, serif" fontSize={38} fill="#e9e1d2">
          Inspired by the Eyeless Jack
        </text>
        <text x={540} y={970} textAnchor="middle" fontFamily="Lora, serif" fontSize={38} fill="#e9e1d2">
          creepypasta, 2012
        </text>
      </>
    )}
  </g>
);

export const SETS: Record<string, React.FC<SProps>> = {
  rbedroom, rhallway, rkitchen, rhospital, rwoods, rcar, rface, rqcard,
};
