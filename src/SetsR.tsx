// SetsR.tsx — 9:16 sets (1080x1920) for Eyeless Jack (kit m).
import React from 'react';
import {
  R, Glow, Walls, Bed, Nightstand, Frame, Mirror, Curtain, Sedan, StreetLamp,
  Sky, Clouds, PitchPine, Barrens, M, Person, Face, EyelessJack,
} from './EJ';

export type SProps = { f: number; v: any; t?: number; len?: number };

export const rbedroom: React.FC<SProps> = ({ f, v }) => {
  const night = v.night !== false;
  const angle = v.angle ?? (v.open_win ? 'window_top' : v.settling ? 'door_open' : 'bed_left');

  return (
    <g>
      <R c={night ? M.wallNight : M.wallDay} />
      <Walls W={1080} fy={1360} c={night ? M.wallNight : M.wallDay} />

      {angle === 'window_top' && (
        <g>
          {/* Tall multi-pane window in upper half with moonlight */}
          <rect x={260} y={180} width={560} height={700} fill={night ? '#12253e' : '#d8e8f4'} stroke="#0b121e" strokeWidth={14} />
          <path d="M 260 530 H 820 M 540 180 V 880" stroke="#0b121e" strokeWidth={12} />
          <Glow x={540} y={530} r={500} c={night ? M.cold : M.warm} op={0.4} />
          <Curtain x={800} y={160} h={740} f={f} wind={1} />
          <Bed x={360} y={1080} s={1.1} state={v.tossing ? 'rumpled' : 'normal'} f={f} />
        </g>
      )}

      {angle === 'door_open' && (
        <g>
          {/* Open doorway on the right spilling warm light */}
          <rect x={680} y={320} width={340} height={840} fill="#241a12" stroke="#0e0a08" strokeWidth={12} />
          <polygon points="680,320 1020,320 1080,1360 480,1360" fill={M.warm} opacity={0.3} />
          <Glow x={840} y={640} r={420} c={M.warm} op={0.45} />
          <Bed x={280} y={1080} s={1.0} state="normal" f={f} />
        </g>
      )}

      {angle === 'bed_left' && (
        <g>
          <Nightstand x={820} y={1100} s={1.1} />
          <Bed x={380} y={1000} s={1.1} state={v.tossing ? 'rumpled' : 'normal'} f={f} />
          <Curtain x={920} y={260} h={520} f={f} wind={v.curtain ? 1 : 0} />
          <Glow x={900} y={900} r={320} c={M.warm} op={0.32} />
          {night && <Glow x={920} y={300} r={420} c={M.cold} op={0.2} />}
        </g>
      )}

      {!v.shadow && !v.creature && (
        <Person who="mitch" x={angle === 'window_top' ? 540 : 380} y={1300} s={0.3} f={f} expr={night ? 'fear' : 'neutral'} />
      )}
      {(v.shadow === 'jack' || v.creature === 'jack') && (
        <EyelessJack x={(angle === 'window_top' ? 440 : 620) + (v.px ?? 0)} y={1340} k={1.25} f={f}
          face={(v.face ?? 1) as 1 | -1} pose={(v.pose as any) ?? 'stand'} ooze={v.ooze ?? 0.3} />
      )}
      <R c="#05030a" op={v.dark ?? (night ? 0.3 : 0.12)} />
    </g>
  );
};

export const rhallway: React.FC<SProps> = ({ f, v }) => {
  const day = v.day === true;
  const angle = v.angle ?? (v.mirror ? 'mirror' : v.fleeing ? 'flee' : v.greet ? 'greet' : 'stairs');

  return (
    <g>
      <R c={day ? M.hallDay : M.hallNight} />
      <Walls W={1080} fy={1360} c={day ? M.wallDay : M.wallNight} wain={true} />

      {angle === 'mirror' && (
        <g>
          {/* Prominent mirror frame in center */}
          <rect x={360} y={340} width={360} height={560} rx={18} fill="#141a22" stroke="#5a422a" strokeWidth={14} />
          <rect x={380} y={360} width={320} height={520} rx={12} fill="#8da3b8" opacity={0.35} />
          <Glow x={540} y={620} r={360} c="#c0d8f0" op={0.3} />
          <Frame x={100} y={480} w={140} h={180} />
          <Frame x={840} y={500} w={140} h={180} />
        </g>
      )}

      {angle === 'stairs' && (
        <g>
          {/* Diagonal wooden staircase going up to top-right */}
          <polygon points="0,1360 0,600 700,200 1080,200 1080,1360" fill="#241a14" />
          {/* Banister and spindles */}
          <path d="M 0 620 L 720 220" stroke="#5a3c26" strokeWidth={16} />
          {[100, 220, 340, 460, 580].map((bx, i) => (
            <line key={i} x1={bx} y1={620 - i * 68} x2={bx} y2={1360} stroke="#3a2618" strokeWidth={8} />
          ))}
          <Glow x={360} y={500} r={320} c={M.warm} op={0.3} />
        </g>
      )}

      {angle === 'flee' && (
        <g>
          {/* Deep corridor vanishing down center */}
          <polygon points="340,300 740,300 1080,1360 0,1360" fill="#08060c" opacity={0.55} />
          <rect x={460} y={340} width={160} height={340} fill="#000" />
          <Glow x={540} y={440} r={300} c={M.cold} op={0.4} />
        </g>
      )}

      {angle === 'greet' && (
        <g>
          {/* Front door open on right with bright daylight */}
          <rect x={600} y={360} width={380} height={820} fill="#3a2e22" stroke="#16120e" strokeWidth={12} />
          <Glow x={780} y={680} r={480} c={M.warm} op={0.5} />
          <Frame x={140} y={520} w={140} h={180} />
        </g>
      )}

      {v.greet && (
        <>
          <Person who="mitch" x={360} y={1340} s={0.3} f={f} expr="neutral" />
          <Person who="edwin" x={720} y={1340} s={0.31} f={f} expr="neutral" />
        </>
      )}
      {v.fleeing && <Person who="mitch" x={540} y={1300} s={0.3} f={f} expr="fear" />}
      {v.shadowed && <Person who="mitch" x={540} y={1300} s={0.3} f={f} expr="fear" />}
      <R c="#05030a" op={v.dark ?? (day ? 0.12 : 0.35)} />
    </g>
  );
};

export const rkitchen: React.FC<SProps> = ({ f, v }) => {
  const angle = v.angle ?? (v.broken_mug ? 'mug_floor' : v.boxes ? 'boxes_left' : v.talk ? 'table_talk' : 'counter');

  return (
    <g>
      <R c={M.wallDay} />
      <Walls W={1080} fy={1380} c={M.wallDay} />

      {angle === 'mug_floor' && (
        <g>
          {/* Close floor perspective with spilled coffee and broken mug */}
          <rect x={0} y={0} width={1080} height={700} fill="#9c8774" />
          <rect x={0} y={700} width={1080} height={1220} fill="#3a2e26" />
          <path d="M 0 700 H 1080 M 0 980 H 1080 M 0 1300 H 1080 M 240 700 L 100 1920 M 540 700 L 540 1920 M 840 700 L 980 1920" stroke="#221a14" strokeWidth={5} opacity={0.6} />
          <ellipse cx={540} cy={1180} rx={260} ry={90} fill="#140a04" />
          <polygon points="500,1120 560,1100 540,1160" fill="#e6edf2" stroke="#607080" strokeWidth={3} />
          <polygon points="620,1140 680,1120 660,1180" fill="#e6edf2" stroke="#607080" strokeWidth={3} />
          <Glow x={540} y={1160} r={400} c="#ffe0a0" op={0.3} />
        </g>
      )}

      {angle === 'table_talk' && (
        <g>
          {/* Kitchen dining table with two chairs, sunlit window on left */}
          <rect x={80} y={240} width={380} height={520} fill="#eef6fa" stroke="#483624" strokeWidth={10} />
          <Glow x={270} y={500} r={480} c="#fff0c0" op={0.4} />
          <rect x={240} y={1180} width={600} height={120} rx={8} fill="#543c28" stroke="#261a10" strokeWidth={6} />
          <rect x={300} y={1300} width={40} height={200} fill="#3a281a" />
          <rect x={740} y={1300} width={40} height={200} fill="#3a281a" />
          <Person who="mitch" x={240} y={1340} s={0.29} f={f} expr={v.expr ?? 'neutral'} />
          <Person who="edwin" x={840} y={1340} s={0.3} f={f} expr={v.expr ?? 'neutral'} />
        </g>
      )}

      {angle === 'boxes_left' && (
        <g>
          {/* Stacks of moving boxes on left */}
          <rect x={120} y={960} width={260} height={220} rx={6} fill="#8c6a46" stroke="#44301c" strokeWidth={6} />
          <rect x={220} y={780} width={220} height={190} rx={6} fill="#a6845c" stroke="#44301c" strokeWidth={6} />
          <Nightstand x={840} y={1120} s={1.1} />
          <Glow x={840} y={640} r={400} c={M.warm} op={0.35} />
          <Person who="mitch" x={540} y={1340} s={0.3} f={f} expr="neutral" />
        </g>
      )}

      {angle === 'counter' && (
        <g>
          <Nightstand x={760} y={1120} s={1.0} />
          <Glow x={540} y={260} r={360} c={M.warm} op={0.3} />
          {v.who2 === 'edwin' && (
            <>
              <Person who="mitch" x={360} y={1360} s={0.29} f={f} expr="neutral" />
              <Person who="edwin" x={720} y={1360} s={0.3} f={f} expr="neutral" />
            </>
          )}
        </g>
      )}

      {angle === 'door_yard' && (
        <g>
          <rect x={0} y={0} width={1080} height={1920} fill="#18120c" />
          <rect x={440} y={240} width={540} height={1160} fill="#06120c" stroke="#3a2818" strokeWidth={16} />
          <PitchPine x={600} y={1100} s={1.1} f={f} />
          <PitchPine x={820} y={1120} s={1.0} f={f} />
          <Glow x={710} y={440} r={440} c="#8cb0a0" op={0.28} />
          <Person who="mitch" x={240} y={1340} s={0.29} f={f} expr="neutral" />
        </g>
      )}

      <R c="#05030a" op={v.dark ?? 0.14} />
    </g>
  );
};

export const rhospital: React.FC<SProps> = ({ f, v }) => {
  const angle = v.angle ?? (v.bandage ? 'xray_chart' : v.bedridden ? 'bed_monitor' : 'wide_clinic');

  return (
    <g>
      <R c="#1b2230" />
      <Walls W={1080} fy={1380} c="#1b2230" />

      {angle === 'xray_chart' && (
        <g>
          {/* Glowing X-ray box on upper wall */}
          <rect x={300} y={240} width={480} height={420} rx={14} fill="#0a1820" stroke="#364e5e" strokeWidth={10} />
          <rect x={340} y={280} width={400} height={340} rx={8} fill="#d2f0ff" opacity={0.85} />
          <path d="M 540 320 V 580 M 460 380 Q 540 360 620 380 M 440 440 Q 540 420 640 440" stroke="#102534" strokeWidth={12} fill="none" />
          <circle cx={590} cy={510} r={36} fill="none" stroke="#b01018" strokeWidth={6} strokeDasharray="8 6" />
          <Glow x={540} y={450} r={500} c="#d2f0ff" op={0.4} />
          <Bed x={540} y={1160} s={1.1} state="rumpled" f={f} />
        </g>
      )}

      {angle === 'bed_monitor' && (
        <g>
          {/* Medical monitor on left */}
          <rect x={100} y={380} width={460} height={360} rx={16} fill="#081418" stroke="#1d3b42" strokeWidth={8} />
          <path d="M 120 560 L 220 560 L 250 480 L 280 620 L 310 530 L 340 560 L 520 560" stroke="#48e0a0" strokeWidth={6} fill="none" />
          <text x={380} y={460} fontFamily="Lora, serif" fontSize={48} fill="#48e0a0">72</text>
          <Glow x={330} y={560} r={400} c="#48e0a0" op={0.35} />
          <Bed x={660} y={1080} s={1.1} state="rumpled" f={f} />
        </g>
      )}

      {angle === 'wide_clinic' && (
        <g>
          <Bed x={520} y={1040} s={1.1} state={v.bedridden ? 'rumpled' : 'normal'} f={f} />
          <Glow x={540} y={220} r={460} c="#c7e4ff" op={0.4} />
          <Glow x={700} y={1100} r={260} c={M.warm} op={0.22} />
        </g>
      )}

      {v.bandage && (
        <g transform="translate(540 1280)">
          <rect x={-100} y={-26} width={200} height={52} rx={12} fill="#e9e3d6" />
          <rect x={-100} y={-26} width={200} height={52} rx={12} fill={M.red} opacity={v.red ?? 0.35} />
        </g>
      )}
      {v.who2 === 'doctor' && (
        <>
          <Person who="mitch" x={angle === 'bed_monitor' ? 640 : 400} y={1360} s={0.29} f={f} expr="fear" />
          <Person who="doctor" x={angle === 'bed_monitor' ? 920 : 740} y={1360} s={0.31} f={f} expr="neutral" />
        </>
      )}
      {v.bedridden && !v.who2 && <Person who="mitch" x={520} y={1320} s={0.29} f={f} expr="fear" />}
      <R c="#05030a" op={v.dark ?? 0.1} />
    </g>
  );
};

export const rwoods: React.FC<SProps> = ({ f, v }) => {
  const angle = v.angle ?? (v.clearing ? 'clearing' : v.pines_left ? 'pines_left' : 'standard');

  return (
    <g>
      <Sky W={1080} H={1920} f={f} tone="night" />
      <Clouds W={1080} y={240} f={f} />

      {angle === 'pines_left' && (
        <g>
          {/* Dense cluster of tall pines on the left half */}
          <PitchPine x={120} y={1240} s={1.3} f={f} />
          <PitchPine x={300} y={1200} s={1.2} f={f} />
          <circle cx={880} cy={340} r={160} fill="#d8eef8" opacity={0.4} />
          <Glow x={880} y={340} r={460} c="#9ed8f0" op={0.35} />
        </g>
      )}

      {angle === 'moon_left' && (
        <g>
          {/* Dense pines on right, big low moon on left */}
          <circle cx={240} cy={380} r={180} fill="#d8eef8" opacity={0.4} />
          <Glow x={240} y={380} r={500} c="#9ed8f0" op={0.35} />
          <PitchPine x={700} y={1240} s={1.15} f={f} />
          <PitchPine x={920} y={1260} s={1.05} f={f} />
        </g>
      )}

      {angle === 'clearing' && (
        <g>
          {/* Open foggy clearing with big centered moon */}
          <circle cx={540} cy={420} r={220} fill="#e2f2fc" opacity={0.45} />
          <Glow x={540} y={420} r={640} c="#b0daf0" op={0.4} />
          <PitchPine x={80} y={1280} s={1.0} f={f} />
          <PitchPine x={1000} y={1280} s={1.0} f={f} />
        </g>
      )}

      {angle === 'standard' && (
        <g>
          <PitchPine x={180} y={1240} s={1.1} f={f} />
          <PitchPine x={900} y={1260} s={1.0} f={f} />
          <Glow x={520} y={300} r={420} c={M.cold} op={0.3} />
        </g>
      )}

      <Barrens W={1080} gy={1360} f={f} />
      {v.running && <Person who="mitch" x={520} y={1320} s={0.3} f={f} expr="fear" />}
      {v.creature === 'jack' && (
        <EyelessJack x={(angle === 'pines_left' ? 760 : 600) + (v.px ?? 0)} y={1340} k={1.15} f={f}
          face={(v.face ?? 1) as 1 | -1} pose={(v.pose as any) ?? 'stand'} ooze={v.ooze ?? 0.4} />
      )}
      {v.fallen && <Person who="mitch" x={520} y={1420} s={0.26} f={f} expr="fear" />}
      <R c="#05030a" op={v.dark ?? 0.4} />
    </g>
  );
};

export const rcar: React.FC<SProps> = ({ f, v }) => {
  const angle = v.angle ?? (v.dash ? 'dash_interior' : v.holding ? 'seat_prop' : 'exterior');

  return (
    <g>
      <R c="#15161e" />

      {angle === 'dash_interior' && (
        <g>
          {/* Vertical windshield view cutting through dark night */}
          <polygon points="100,0 980,0 1080,1100 0,1100" fill="#0d141e" />
          <polygon points="300,1100 420,380 660,380 780,1100" fill="#fff" opacity={0.18} />
          <Glow x={540} y={480} r={360} c="#fff4c0" op={0.3} />
          <rect x={0} y={1100} width={1080} height={820} fill="#101116" stroke="#222630" strokeWidth={8} />
          <circle cx={340} cy={1340} r={90} fill="#080a0e" stroke="#20c080" strokeWidth={8} />
          <circle cx={580} cy={1340} r={90} fill="#080a0e" stroke="#20c080" strokeWidth={8} />
          <path d="M 180 1540 Q 460 1100 740 1540" stroke="#1c1f26" strokeWidth={40} fill="none" />
        </g>
      )}

      {angle === 'wheel_steer' && (
        <g>
          {/* Side view / driver steering wheel */}
          <rect x={0} y={0} width={1080} height={1920} fill="#0d1016" />
          <polygon points="0,200 480,200 400,1000 0,1000" fill="#142030" stroke="#080a0e" strokeWidth={10} />
          <Glow x={200} y={500} r={350} c="#4080a0" op={0.25} />
          {/* Steering wheel side arc */}
          <ellipse cx={740} cy={1100} rx={160} ry={280} fill="none" stroke="#2a2e38" strokeWidth={40} />
          <rect x={600} y={1180} width={480} height={740} fill="#181a20" stroke="#0e1014" strokeWidth={8} />
          <Glow x={740} y={1100} r={280} c="#ff8040" op={0.15} />
        </g>
      )}

      {angle === 'seat_prop' && (
        <g>
          {/* Passenger seat close up with dark wrapped kidney prop */}
          <rect x={0} y={0} width={1080} height={1920} fill="#14151c" />
          <rect x={240} y={400} width={600} height={1000} rx={48} fill="#242632" stroke="#0e1014" strokeWidth={12} />
          <Glow x={540} y={900} r={440} c={M.warm} op={0.3} />
          <g transform="translate(540 1020)">
            <rect x={-110} y={-70} width={220} height={140} rx={18} fill="#120e0e" stroke="#2a2222" strokeWidth={5} />
            <ellipse cx={0} cy={-4} rx={64} ry={44} fill="#0a0608" />
            <ellipse cx={-12} cy={-12} rx={26} ry={16} fill={M.oozeC} opacity={0.85} />
          </g>
          <polygon points="600,0 900,0 1080,1920 780,1920" fill="#ffa820" opacity={0.12} />
        </g>
      )}

      {angle === 'exterior' && (
        <g>
          <Sedan x={540} y={1060} s={1.1} f={f} lights={v.driving ? 1 : 0} />
          <StreetLamp x={940} y={420} on={v.driving} />
          <Glow x={540} y={1240} r={300} c={M.warm} op={0.28} />
          {v.driving && <Person who="mitch" x={380} y={1300} s={0.24} f={f} expr="fear" />}
        </g>
      )}

      <R c="#05030a" op={v.dark ?? 0.25} />
    </g>
  );
};

export const rface: React.FC<SProps> = ({ f, v }) => {
  const loc = v.loc ?? 'bedroom';
  const x = v.x ?? 540;
  const y = v.y ?? 900;
  const k = v.k ?? 1.6;

  return (
    <g>
      {/* Vertical location background */}
      {loc === 'bedroom' && (
        <g>
          <R c="#0b1220" />
          <rect x={0} y={0} width={500} height={1920} fill="#142238" />
          <rect x={60} y={200} width={380} height={800} fill="#182c48" stroke="#0a101c" strokeWidth={10} />
          <path d="M 60 600 H 440 M 250 200 V 1000" stroke="#0a101c" strokeWidth={8} />
          <Glow x={250} y={600} r={460} c="#8cb4d8" op={0.35} />
        </g>
      )}
      {loc === 'kitchen' && (
        <g>
          <R c="#d6c6b0" />
          <rect x={540} y={0} width={540} height={1920} fill="#bfad93" />
          <rect x={620} y={240} width={400} height={600} fill="#826c50" stroke="#4a3c2c" strokeWidth={8} />
          <Glow x={820} y={540} r={460} c="#ffe8a8" op={0.45} />
        </g>
      )}
      {loc === 'hospital' && (
        <g>
          <R c="#122026" />
          <rect x={40} y={320} width={440} height={460} rx={16} fill="#081418" stroke="#1d3b42" strokeWidth={6} />
          <path d="M 60 550 L 160 550 L 190 440 L 220 640 L 250 510 L 280 550 L 460 550" stroke="#48e0a0" strokeWidth={6} fill="none" />
          <Glow x={250} y={550} r={400} c="#48e0a0" op={0.4} />
          <rect x={640} y={0} width={440} height={1920} fill="#263842" opacity={0.7} />
        </g>
      )}
      {loc === 'woods' && (
        <g>
          <R c="#06120c" />
          <PitchPine x={140} y={1200} s={1.4} f={f} />
          <PitchPine x={940} y={1180} s={1.4} f={f} />
          <circle cx={540} cy={380} r={180} fill="#d8eef8" opacity={0.4} />
          <Glow x={540} y={380} r={500} c="#9ed8f0" op={0.35} />
        </g>
      )}
      {loc === 'car' && (
        <g>
          <R c="#0d0e14" />
          <polygon points="60,0 540,0 420,1920 0,1920" fill="#181c28" />
          <Glow x={200} y={400} r={400} c="#e0aa40" op={0.4} />
          <Glow x={880} y={1200} r={340} c="#e02020" op={0.3} />
        </g>
      )}
      {loc === 'emergency' && (
        <g>
          <R c="#1a060a" />
          <polygon points="0,0 780,0 500,1920 0,1920" fill="#3d0a10" />
          <Glow x={300} y={700} r={600} c="#d01828" op={0.45} />
        </g>
      )}

      <Face who={v.who ?? 'mitch'} x={x} y={y} k={k} f={f} expr={v.expr ?? 'fear'}
        turn={v.turn ?? 0} tag={v.tag} gash={v.gash} />
    </g>
  );
};

export const rqcard: React.FC<SProps> = ({ v }) => (
  <g>
    <R c="#13100c" />
    {v.question ? (
      <g>
        {/* Full screen intense vignette for closing question */}
        <R c="#120608" />
        <circle cx={540} cy={960} r={600} fill="#3a080c" opacity={0.5} />
        <Glow x={540} y={960} r={700} c={M.red} op={0.4} />
        <rect x={100} y={640} width={880} height={640} rx={24} fill="#1c0a0c" stroke={M.red} strokeWidth={6} />
        <text x={540} y={920} textAnchor="middle" fontFamily="Lora, serif" fontSize={46} fill="#f4ede2">
          Would you have believed
        </text>
        <text x={540} y={990} textAnchor="middle" fontFamily="Lora, serif" fontSize={46} fill="#f4ede2">
          it was only a raccoon?
        </text>
      </g>
    ) : (
      <g>
        <rect x={120} y={600} width={840} height={700} rx={16} fill="#1c1812" stroke="#5a422a" strokeWidth={6} />
        <text x={540} y={920} textAnchor="middle" fontFamily="Lora, serif" fontSize={38} fill="#e9e1d2">
          Inspired by the Eyeless Jack
        </text>
        <text x={540} y={980} textAnchor="middle" fontFamily="Lora, serif" fontSize={38} fill="#e9e1d2">
          creepypasta, 2012
        </text>
      </g>
    )}
  </g>
);

export const SETS: Record<string, React.FC<SProps>> = {
  rbedroom, rhallway, rkitchen, rhospital, rwoods, rcar, rface, rqcard,
};
