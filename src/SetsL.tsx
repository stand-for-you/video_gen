// SetsL.tsx — 16:9 sets (1920x1080) for Eyeless Jack (kit m).
import React from 'react';
import {
  R, Glow, Walls, Bed, Nightstand, Frame, Mirror, Curtain, Sedan, StreetLamp,
  Sky, Clouds, PitchPine, Barrens, M, Person, Face, EyelessJack,
} from './EJ';

export type SProps = { f: number; v: any; t?: number; len?: number };

export const bedroom: React.FC<SProps> = ({ f, v }) => {
  const night = v.night !== false;
  const angle = v.angle ?? (v.open_win ? 'window_left' : v.settling ? 'door_open' : 'bed_left');

  return (
    <g>
      <R c={night ? M.wallNight : M.wallDay} />
      <Walls W={1920} fy={740} c={night ? M.wallNight : M.wallDay} />

      {angle === 'window_left' && (
        <g>
          {/* Big window on the left with moonlight casting across */}
          <rect x={180} y={120} width={480} height={560} fill={night ? '#12253e' : '#d8e8f4'} stroke="#0b121e" strokeWidth={12} />
          <path d="M 180 400 H 660 M 420 120 V 680" stroke="#0b121e" strokeWidth={10} />
          <Glow x={420} y={400} r={460} c={night ? M.cold : M.warm} op={0.4} />
          <Curtain x={640} y={100} h={600} f={f} wind={1} />
          <Bed x={1320} y={560} s={1.1} state={v.tossing ? 'rumpled' : 'normal'} f={f} />
        </g>
      )}

      {angle === 'door_open' && (
        <g>
          {/* Doorway on the right spilling warm hall light */}
          <rect x={1480} y={180} width={340} height={560} fill="#241a12" stroke="#0e0a08" strokeWidth={10} />
          <polygon points="1480,180 1820,180 1920,740 1340,740" fill={M.warm} opacity={0.3} />
          <Glow x={1600} y={380} r={340} c={M.warm} op={0.45} />
          <Bed x={480} y={580} s={1.05} state="normal" f={f} />
          <Frame x={940} y={280} w={120} h={160} kind={0} />
        </g>
      )}

      {angle === 'bed_left' && (
        <g>
          {/* Standard bed on left, window on right */}
          <Nightstand x={1540} y={620} s={1.1} />
          <Bed x={640} y={560} s={1.1} state={v.tossing ? 'rumpled' : 'normal'} f={f} />
          <Curtain x={1680} y={160} h={480} f={f} wind={v.curtain ? 1 : 0} />
          <Frame x={340} y={300} w={120} h={160} kind={0} />
          <Glow x={1560} y={560} r={260} c={M.warm} op={0.35} />
          {night && <Glow x={1680} y={200} r={340} c={M.cold} op={0.22} />}
        </g>
      )}

      {v.settling && <Person who="mitch" x={520} y={760} s={0.24} f={f} expr="neutral" />}
      {!v.settling && !v.shadow && !v.creature && (
        <Person who="mitch" x={angle === 'window_left' ? 1280 : 640} y={700} s={0.24} f={f}
          expr={v.night ? 'fear' : 'neutral'} />
      )}
      {(v.shadow === 'jack' || v.creature === 'jack') && (
        <EyelessJack x={(angle === 'window_left' ? 440 : 1180) + (v.px ?? 0)} y={760} k={1.05} f={f}
          face={(v.face ?? 1) as 1 | -1} pose={(v.pose as any) ?? 'stand'}
          ooze={v.ooze ?? 0.3} />
      )}
      <R c="#05030a" op={v.dark ?? (night ? 0.3 : 0.12)} />
    </g>
  );
};

export const hallway: React.FC<SProps> = ({ f, v }) => {
  const day = v.day === true;
  const angle = v.angle ?? (v.mirror ? 'mirror' : v.fleeing ? 'flee' : v.greet ? 'greet' : 'plain');

  return (
    <g>
      <R c={day ? M.wallDay : M.wallNight} />
      <Walls W={1920} fy={760} c={day ? M.wallDay : M.wallNight} wain={true} />

      {angle === 'mirror' && (
        <g>
          {/* Prominent mirror on left half */}
          <rect x={420} y={180} width={340} height={520} rx={16} fill="#141a22" stroke="#5a422a" strokeWidth={12} />
          <rect x={440} y={200} width={300} height={480} rx={10} fill="#8da3b8" opacity={0.35} />
          <Glow x={590} y={440} r={320} c="#c0d8f0" op={0.3} />
          <Frame x={1100} y={300} w={140} h={180} />
          <Frame x={1400} y={320} w={120} h={160} />
        </g>
      )}

      {angle === 'flee' && (
        <g>
          {/* Deep perspective hall corridor vanishing in center */}
          <polygon points="760,200 1160,200 1560,760 360,760" fill="#08060c" opacity={0.5} />
          <Glow x={960} y={320} r={280} c={M.cold} op={0.4} />
          <rect x={900} y={240} width={120} height={260} fill="#000" />
        </g>
      )}

      {angle === 'greet' && (
        <g>
          {/* Front door open on right with daylight */}
          <rect x={1420} y={180} width={360} height={580} fill="#3a2e22" stroke="#16120e" strokeWidth={12} />
          <Glow x={1600} y={420} r={460} c={M.warm} op={0.5} />
          <Frame x={380} y={320} w={120} h={160} />
          <Frame x={720} y={340} w={120} h={160} />
        </g>
      )}

      {angle === 'plain' && (
        <g>
          <Frame x={300} y={320} w={100} h={140} />
          <Frame x={620} y={340} w={100} h={140} />
          <Frame x={940} y={300} w={100} h={140} />
          <Mirror x={1480} y={420} w={180} h={280} />
          <Glow x={960} y={200} r={300} c={day ? M.warm : M.cold} op={0.3} />
        </g>
      )}

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

export const kitchen: React.FC<SProps> = ({ f, v }) => {
  const angle = v.angle ?? (v.broken_mug ? 'mug_floor' : v.boxes ? 'boxes_left' : v.talk ? 'table_talk' : 'counter');

  return (
    <g>
      <R c={M.wallDay} />
      <Walls W={1920} fy={780} c={M.wallDay} />

      {angle === 'mug_floor' && (
        <g>
          {/* Close shot of floor with spilled coffee and shattered mug */}
          <rect x={0} y={0} width={1920} height={500} fill="#9c8774" />
          <rect x={0} y={500} width={1920} height={580} fill="#3a2e26" />
          {/* Floor tile perspective lines */}
          <path d="M 0 500 L 1920 500 M 0 680 H 1920 M 0 880 H 1920 M 400 500 L 200 1080 M 800 500 L 700 1080 M 1200 500 L 1300 1080 M 1600 500 L 1800 1080" stroke="#221a14" strokeWidth={4} opacity={0.6} />
          {/* Spilled dark coffee pool */}
          <ellipse cx={960} cy={820} rx={220} ry={70} fill="#140a04" />
          <ellipse cx={880} cy={810} rx={90} ry={35} fill="#080402" />
          {/* Broken mug shards */}
          <polygon points="920,780 970,760 950,810" fill="#e6edf2" stroke="#607080" strokeWidth={2} />
          <polygon points="1020,800 1060,780 1050,830" fill="#e6edf2" stroke="#607080" strokeWidth={2} />
          <path d="M 980 840 Q 1020 860 1000 890" stroke="#e6edf2" strokeWidth={8} fill="none" />
          <Glow x={960} y={800} r={340} c="#ffe0a0" op={0.25} />
        </g>
      )}

      {angle === 'table_talk' && (
        <g>
          {/* Large dining table with chairs, window on left */}
          <rect x={120} y={160} width={420} height={460} fill="#eef6fa" stroke="#483624" strokeWidth={10} />
          <Glow x={330} y={390} r={460} c="#fff0c0" op={0.4} />
          <polygon points="120,160 540,160 1400,780 400,780" fill="#fff" opacity={0.15} />
          {/* Wooden table */}
          <rect x={600} y={680} width={760} height={100} rx={8} fill="#543c28" stroke="#261a10" strokeWidth={6} />
          <rect x={660} y={780} width={40} height={200} fill="#3a281a" />
          <rect x={1260} y={780} width={40} height={200} fill="#3a281a" />
          <Person who="mitch" x={540} y={780} s={0.24} f={f} expr={v.expr ?? 'neutral'} />
          <Person who="edwin" x={1400} y={780} s={0.25} f={f} expr={v.expr ?? 'neutral'} />
        </g>
      )}

      {angle === 'boxes_left' && (
        <g>
          {/* Stacks of moving boxes on the left */}
          <rect x={240} y={540} width={240} height={200} rx={4} fill="#8c6a46" stroke="#44301c" strokeWidth={6} />
          <rect x={440} y={580} width={220} height={180} rx={4} fill="#9c7a54" stroke="#44301c" strokeWidth={6} />
          <rect x={320} y={400} width={200} height={160} rx={4} fill="#a6845c" stroke="#44301c" strokeWidth={6} />
          <Nightstand x={1560} y={640} s={1.1} />
          <Glow x={1560} y={360} r={340} c={M.warm} op={0.35} />
          <Person who="mitch" x={860} y={780} s={0.24} f={f} expr="neutral" />
        </g>
      )}

      {angle === 'counter' && (
        <g>
          <Nightstand x={1500} y={660} s={1.0} />
          <Glow x={960} y={160} r={320} c={M.warm} op={0.3} />
          <Glow x={1600} y={260} r={260} c={M.cold} op={0.18} />
          {v.who2 === 'edwin' && (
            <>
              <Person who="mitch" x={700} y={800} s={0.24} f={f} expr={v.expr ?? 'neutral'} />
              <Person who="edwin" x={1060} y={800} s={0.25} f={f} expr={v.expr ?? 'neutral'} />
            </>
          )}
        </g>
      )}

      {angle === 'door_yard' && (
        <g>
          <rect x={0} y={0} width={1920} height={1080} fill="#18120c" />
          <rect x={1100} y={120} width={600} height={960} fill="#06120c" stroke="#3a2818" strokeWidth={16} />
          <PitchPine x={1300} y={800} s={1.1} f={f} />
          <PitchPine x={1560} y={820} s={1.0} f={f} />
          <Glow x={1400} y={300} r={400} c="#8cb0a0" op={0.25} />
          <rect x={100} y={400} width={800} height={380} fill="#342216" stroke="#1c120c" strokeWidth={8} />
          <Glow x={500} y={590} r={340} c={M.warm} op={0.3} />
          <Person who="mitch" x={420} y={780} s={0.24} f={f} expr="neutral" />
        </g>
      )}

      <R c="#05030a" op={v.dark ?? 0.14} />
    </g>
  );
};

export const hospital: React.FC<SProps> = ({ f, v }) => {
  const angle = v.angle ?? (v.bandage ? 'xray_chart' : v.bedridden ? 'bed_monitor' : 'wide_clinic');

  return (
    <g>
      <R c="#1b2230" />
      <Walls W={1920} fy={780} c="#1b2230" />

      {angle === 'xray_chart' && (
        <g>
          {/* Doctor holding up glowing X-ray illuminator on right */}
          <rect x={1180} y={160} width={460} height={400} rx={12} fill="#0a1820" stroke="#364e5e" strokeWidth={10} />
          <rect x={1220} y={200} width={380} height={320} rx={6} fill="#d2f0ff" opacity={0.85} />
          {/* Ribcage / kidney silhouette on X-ray */}
          <path d="M 1410 240 V 480 M 1340 300 Q 1410 280 1480 300 M 1320 350 Q 1410 330 1500 350 M 1330 400 Q 1410 380 1490 400" stroke="#102534" strokeWidth={12} fill="none" />
          <ellipse cx={1360} cy={430} rx={28} ry={36} fill="#0a1a24" />
          <circle cx={1460} cy={430} r={32} fill="none" stroke="#b01018" strokeWidth={6} strokeDasharray="8 6" />
          <Glow x={1410} y={360} r={460} c="#d2f0ff" op={0.4} />
          <Bed x={480} y={620} s={1.05} state="rumpled" f={f} />
        </g>
      )}

      {angle === 'bed_monitor' && (
        <g>
          {/* Vital signs monitor on left */}
          <rect x={140} y={220} width={440} height={340} rx={14} fill="#081418" stroke="#1d3b42" strokeWidth={8} />
          <path d="M 160 400 L 260 400 L 290 320 L 320 460 L 350 370 L 380 400 L 560 400" stroke="#48e0a0" strokeWidth={6} fill="none" />
          <text x={420} y={300} fontFamily="Lora, serif" fontSize={42} fill="#48e0a0">72</text>
          <Glow x={360} y={390} r={360} c="#48e0a0" op={0.35} />
          <Curtain x={1600} y={160} h={540} f={f} />
          <Bed x={1000} y={620} s={1.1} state="rumpled" f={f} />
        </g>
      )}

      {angle === 'wide_clinic' && (
        <g>
          <Bed x={700} y={620} s={1.1} state={v.bedridden ? 'rumpled' : 'normal'} f={f} />
          <Curtain x={1560} y={220} h={460} f={f} />
          <Glow x={960} y={120} r={420} c="#c7e4ff" op={0.4} />
          <Glow x={620} y={660} r={240} c={M.warm} op={0.22} />
        </g>
      )}

      {v.bandage && (
        <g transform="translate(700 780)">
          <rect x={-90} y={-24} width={180} height={48} rx={10} fill="#e9e3d6" />
          <rect x={-90} y={-24} width={180} height={48} rx={10} fill={M.red} opacity={v.red ?? 0.35} />
        </g>
      )}
      {v.who2 === 'doctor' && (
        <>
          <Person who="mitch" x={angle === 'bed_monitor' ? 1000 : 660} y={800} s={0.24} f={f} expr="fear" />
          <Person who="doctor" x={angle === 'bed_monitor' ? 1440 : 1140} y={800} s={0.26} f={f} expr="neutral" />
        </>
      )}
      {v.bedridden && !v.who2 && <Person who="mitch" x={angle === 'bed_monitor' ? 1000 : 700} y={760} s={0.24} f={f} expr="fear" />}
      <R c="#05030a" op={v.dark ?? 0.1} />
    </g>
  );
};

export const woods: React.FC<SProps> = ({ f, v }) => {
  const angle = v.angle ?? (v.clearing ? 'clearing' : v.pines_left ? 'pines_left' : 'standard');

  return (
    <g>
      <Sky W={1920} H={1080} f={f} tone="night" />
      <Clouds W={1920} y={160} f={f} />

      {angle === 'pines_left' && (
        <g>
          {/* Dense pine trunks clustered on the left */}
          <PitchPine x={180} y={720} s={1.4} f={f} />
          <PitchPine x={380} y={700} s={1.3} f={f} />
          <PitchPine x={580} y={740} s={1.2} f={f} />
          <circle cx={1520} cy={220} r={140} fill="#d8eef8" opacity={0.4} />
          <Glow x={1520} y={220} r={460} c="#9ed8f0" op={0.35} />
        </g>
      )}

      {angle === 'clearing' && (
        <g>
          {/* Wide open foggy moon clearing */}
          <circle cx={960} cy={260} r={180} fill="#e2f2fc" opacity={0.45} />
          <Glow x={960} y={260} r={600} c="#b0daf0" op={0.4} />
          <PitchPine x={120} y={740} s={1.0} f={f} />
          <PitchPine x={1800} y={740} s={1.0} f={f} />
        </g>
      )}

      {angle === 'standard' && (
        <g>
          <PitchPine x={340} y={700} s={1.2} f={f} />
          <PitchPine x={1580} y={720} s={1.1} f={f} />
          <Glow x={1700} y={900} r={260} c={M.warm} op={0.15} />
          <Glow x={560} y={200} r={360} c={M.cold} op={0.3} />
        </g>
      )}

      <Barrens W={1920} gy={740} f={f} />
      {v.running && <Person who="mitch" x={760} y={820} s={0.24} f={f} expr="fear" />}
      {v.creature === 'jack' && (
        <EyelessJack x={(angle === 'pines_left' ? 1400 : 1200) + (v.px ?? 0)} y={840} k={1.0} f={f}
          face={(v.face ?? 1) as 1 | -1} pose={(v.pose as any) ?? 'stand'} ooze={v.ooze ?? 0.4} />
      )}
      {v.fallen && (
        <Person who="mitch" x={820} y={920} s={0.22} f={f} expr="fear" />
      )}
      <R c="#05030a" op={v.dark ?? 0.4} />
    </g>
  );
};

export const car: React.FC<SProps> = ({ f, v }) => {
  const angle = v.angle ?? (v.dash ? 'dash_interior' : v.holding ? 'seat_prop' : 'exterior');

  return (
    <g>
      <R c="#15161e" />

      {angle === 'dash_interior' && (
        <g>
          {/* Interior windshield view cutting through night rain */}
          <polygon points="200,0 1720,0 1920,700 0,700" fill="#0d141e" />
          {/* Headlights cutting forward */}
          <polygon points="600,700 740,240 1180,240 1320,700" fill="#fff" opacity={0.18} />
          <Glow x={960} y={320} r={320} c="#fff4c0" op={0.3} />
          {/* Dashboard bottom */}
          <rect x={0} y={700} width={1920} height={380} fill="#101116" stroke="#222630" strokeWidth={6} />
          {/* Glowing speedometer & tachometer circles on left */}
          <circle cx={480} cy={860} r={70} fill="#080a0e" stroke="#20c080" strokeWidth={6} />
          <circle cx={660} cy={860} r={70} fill="#080a0e" stroke="#20c080" strokeWidth={6} />
          <path d="M 480 860 L 520 820" stroke="#ff4040" strokeWidth={4} />
          {/* Steering wheel arc */}
          <path d="M 320 980 Q 570 660 820 980" stroke="#1c1f26" strokeWidth={34} fill="none" />
        </g>
      )}

      {angle === 'seat_prop' && (
        <g>
          {/* Close shot of passenger car seat with dark wrapped kidney prop */}
          <rect x={0} y={0} width={1920} height={1080} fill="#14151c" />
          <rect x={600} y={200} width={720} height={700} rx={40} fill="#242632" stroke="#0e1014" strokeWidth={10} />
          <Glow x={960} y={540} r={360} c={M.warm} op={0.25} />
          {/* Wrapped dark organ prop */}
          <g transform="translate(960 620)">
            <rect x={-90} y={-60} width={180} height={120} rx={16} fill="#120e0e" stroke="#2a2222" strokeWidth={4} />
            <ellipse cx={0} cy={-4} rx={54} ry={36} fill="#0a0608" />
            <ellipse cx={-10} cy={-10} rx={22} ry={14} fill={M.oozeC} opacity={0.85} />
          </g>
          {/* Amber streetlamp light streak across right */}
          <polygon points="1200,0 1600,0 1920,1080 1520,1080" fill="#ffa820" opacity={0.12} />
        </g>
      )}

      {angle === 'exterior' && (
        <g>
          <Sedan x={960} y={600} s={1.2} f={f} lights={v.driving ? 1 : 0} />
          <StreetLamp x={1700} y={300} on={v.driving} />
          <Glow x={960} y={760} r={240} c={M.warm} op={0.28} />
          {v.driving && <Person who="mitch" x={760} y={760} s={0.2} f={f} expr="fear" />}
        </g>
      )}

      <R c="#05030a" op={v.dark ?? 0.25} />
    </g>
  );
};

export const face: React.FC<SProps> = ({ f, v }) => {
  const loc = v.loc ?? 'bedroom';
  const x = v.x ?? 960;
  const y = v.y ?? 520;
  const k = v.k ?? 1.35;

  return (
    <g>
      {/* Location-specific backgrounds so every face shot has a distinct dHash */}
      {loc === 'bedroom' && (
        <g>
          <R c="#0b1220" />
          <rect x={0} y={0} width={760} height={1080} fill="#142238" />
          <rect x={140} y={120} width={420} height={600} fill="#182c48" stroke="#0a101c" strokeWidth={10} />
          <path d="M 140 420 H 560 M 350 120 V 720" stroke="#0a101c" strokeWidth={8} />
          <Glow x={350} y={420} r={360} c="#8cb4d8" op={0.3} />
        </g>
      )}
      {loc === 'kitchen' && (
        <g>
          <R c="#d6c6b0" />
          <rect x={1100} y={0} width={820} height={1080} fill="#bfad93" />
          <rect x={1260} y={100} width={500} height={420} fill="#826c50" stroke="#4a3c2c" strokeWidth={8} />
          <Glow x={1510} y={310} r={420} c="#ffe8a8" op={0.4} />
        </g>
      )}
      {loc === 'hospital' && (
        <g>
          <R c="#122026" />
          <rect x={60} y={240} width={540} height={380} rx={16} fill="#081418" stroke="#1d3b42" strokeWidth={6} />
          <path d="M 80 430 L 200 430 L 230 340 L 260 500 L 290 390 L 320 430 L 580 430" stroke="#48e0a0" strokeWidth={5} fill="none" />
          <Glow x={300} y={430} r={300} c="#48e0a0" op={0.35} />
          <rect x={1220} y={0} width={700} height={1080} fill="#263842" opacity={0.7} />
        </g>
      )}
      {loc === 'woods' && (
        <g>
          <R c="#06120c" />
          <PitchPine x={240} y={720} s={1.3} f={f} />
          <PitchPine x={1680} y={700} s={1.4} f={f} />
          <circle cx={960} cy={220} r={160} fill="#d8eef8" opacity={0.4} />
          <Glow x={960} y={220} r={400} c="#9ed8f0" op={0.3} />
        </g>
      )}
      {loc === 'car' && (
        <g>
          <R c="#0d0e14" />
          <polygon points="100,0 720,0 600,1080 0,1080" fill="#181c28" />
          <Glow x={300} y={200} r={320} c="#e0aa40" op={0.35} />
          <Glow x={1600} y={700} r={260} c="#e02020" op={0.25} />
        </g>
      )}
      {loc === 'emergency' && (
        <g>
          <R c="#1a060a" />
          <polygon points="0,0 1200,0 800,1080 0,1080" fill="#3d0a10" />
          <Glow x={400} y={400} r={500} c="#d01828" op={0.4} />
        </g>
      )}

      {/* Face centered or offset */}
      <Face who={v.who ?? 'mitch'} x={x} y={y} k={k} f={f} expr={v.expr ?? 'fear'}
        turn={v.turn ?? 0} tag={v.tag} gash={v.gash} />
    </g>
  );
};

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
