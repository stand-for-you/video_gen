import React from 'react';
import { M, G, PAL, rng, sway, ss, seg, V3 } from './k3/core';
import { Night, Ground, Grass, Mist, Flakes } from './k3/World';
import { Forest, Fence } from './k3/Nature';
import { Cabin } from './k3/Build';
import { Person } from './k3/Person';
import { Creature, CPose } from './k3/Creature';
import { CREAT3, CAST3 } from './Cast3D';
import type { Set3, SetP } from './Stage3';
import type { CamSpec } from './k3/Cam';
import { Hud, CutPanel, Measure, Meter, VoiceChip, FlowArrow, Pill, PanelKind } from './k3/Hud3';
// =============================================================================
// MONSTER INTRODUCTION (engine v0.6)
//
// The "creature file" block from the reference monster short, as a reusable set
// pack. It is 25-40 s and answers, in this order:
//
//   mi_reveal   WHAT is it        - half-seen in the trees, the name lands
//   mi_height   HOW BIG           - full body, clean ground, a person for scale
//   mi_anatomy  WHAT IS INSIDE    - the one organ the story cares about
//   mi_ability  WHAT IT DOES      - the ability demonstrated, not described
//   mi_compare  WHAT IT IS LIKE   - one real animal the viewer already knows
//   mi_scale    HOW CLOSE         - a person at a measured distance
//   mi_threat   WHY YOU LOSE      - the close shot that ends the block
//
// LAW: this pack supplies FRAMING and HUD only. The creature is always the
// STORY's creature (v.c names an entry in CREAT3, built from story/creature.md),
// never a stock monster reused between videos.
//
// Wording comes from the scene table, never from this file: every label, number
// and quote is passed in through v, so the block says what the story says.
//
//   v.c      creature id in CREAT3            (default 'herbert')
//   v.name   name pill text                   ('SKINWALKER')
//   v.tall   height label                     ('2.7 M TALL')
//   v.panel  'voice'|'mind'|'mirror'|'heat'|'gut'
//   v.facts  [{t, at}]      extra pills, screen-fraction placed
//   v.say    quoted stolen voice              ('SWEETIE, COME OUTSIDE')
//   v.meters [{t, v}]       bar meters        ([{t:'COPY', v:1},{t:'ANSWER', v:0}])
//   v.animal 'fish' | 'bird' | 'none'         the grounding comparison
//   v.dist   distance label for mi_scale      ('25 M')
// =============================================================================

const creatureOf = (v: any) => CREAT3[v?.c as string] || CREAT3.herbert;
const WM = 'NIGHT FILE';

// --- shared night clearing used by most of the block. Two light sources (cold
// moon key, warm ground bounce) so the silhouette is always readable.
const Clearing: React.FC<{ t: number; snow?: boolean; fog?: number }> = ({ t, snow = true, fog = 6 }) => (
  <group>
    <Night t={t} moon={[-14, 16, -26]} />
    <Ground flat={16} c="#18211c" />
    <Forest t={t} n={18} area={[-24, 24, -26, -8]} snow={snow} dead={0.12} />
    <Grass t={t} n={320} area={[-11, 11, -8, 7]} />
    <Mist t={t} n={fog} area={[-14, 14, -14, 6]} y={0.4} o={0.13} size={8} />
    {snow && <Flakes t={t} n={180} box={[-13, 13, 0, 8, -14, 7]} />}
  </group>
);

// --- the two grounding animals from the reference (anglerfish, lyrebird).
// Deliberately crude low-poly: they are a size reference, not a character.
const Anglerfish: React.FC<{ t: number; s?: number }> = ({ t, s = 1 }) => (
  <group scale={[s, s, s]} position={[0, 0.9 * s, 0]}>
    <mesh material={M('#22403f')} rotation={[0, 0, 0.1]}><sphereGeometry args={[0.52, 7, 5]} /></mesh>
    <mesh material={M('#1a3231')} position={[0.44, 0.02, 0]} rotation={[0, 0, -0.2]}><coneGeometry args={[0.3, 0.5, 5]} /></mesh>
    {Array.from({ length: 9 }, (_, i) => (
      <mesh key={i} material={M('#dfe6ec')} position={[0.3 + (i % 3) * 0.08, -0.12 + Math.floor(i / 3) * 0.1, -0.18 + (i % 3) * 0.16]} rotation={[0, 0, -0.5]}>
        <coneGeometry args={[0.035, 0.2, 4]} /></mesh>
    ))}
    <mesh material={M('#101c1c')} position={[0.1, 0.3, 0.3]}><sphereGeometry args={[0.08, 6, 5]} /></mesh>
    <mesh material={M('#2a4442')} position={[-0.1, 0.62, 0]} rotation={[0, 0, -0.5 + sway(t, 5, 0.12)]}><cylinderGeometry args={[0.018, 0.022, 0.85, 4]} /></mesh>
    <mesh material={G('#bffbe8')} position={[0.26, 1.0 + sway(t, 5, 0.06), 0]}><sphereGeometry args={[0.09, 7, 6]} /></mesh>
    <pointLight position={[0.26, 1.0, 0]} color="#8ff0d4" intensity={2.2} distance={5} />
  </group>
);

const Lyrebird: React.FC<{ t: number; s?: number }> = ({ t, s = 1 }) => (
  <group scale={[s, s, s]}>
    <mesh material={M('#6b4a30')} position={[0, 0.55, 0]}><sphereGeometry args={[0.4, 7, 5]} /></mesh>
    <mesh material={M('#7a5637')} position={[0.05, 1.0, 0.1]}><sphereGeometry args={[0.19, 6, 5]} /></mesh>
    <mesh material={M('#3a2a1c')} position={[0.24, 0.98, 0.1]} rotation={[0, 0, -1.3]}><coneGeometry args={[0.06, 0.2, 5]} /></mesh>
    {[-1, 1].map((q) => <mesh key={q} material={M('#2a2018')} position={[-0.05, 0.12, q * 0.12]}><cylinderGeometry args={[0.03, 0.03, 0.44, 4]} /></mesh>)}
    {Array.from({ length: 11 }, (_, i) => {
      const u = i / 10, a = -0.9 - u * 0.5;
      return <mesh key={i} material={M(i % 2 ? '#d8c69c' : '#c0a87c')} position={[-0.5 - u * 0.1, 0.75 + u * 0.5, (u - 0.5) * 0.5]} rotation={[0, 0, a + sway(t, 6, 0.05, i)]}>
        <cylinderGeometry args={[0.012, 0.016, 1.5, 4]} /></mesh>;
    })}
  </group>
);

const AnimalOf: React.FC<{ kind?: string; t: number; s?: number }> = ({ kind, t, s = 1 }) =>
  kind === 'fish' ? <Anglerfish t={t} s={s} /> : kind === 'bird' ? <Lyrebird t={t} s={s} /> : null;

// --- creature placement helper.
// QUALITY LAW 4a: "clearly drawn and lit (outline, shading, one rim light). A dark blob
// that cannot be read is a failure." The night palette alone is far too dark for a study
// shot, so every creature in this block carries its OWN two-light rig that travels with it:
// a cold key from camera-left and a tight rim from behind. Without this the whole block
// renders as a black frame - that is exactly what the first pass did.
const Beast: React.FC<{ v: any; t: number; at?: V3; rot?: number; pose?: CPose; s?: number; key1?: number }> =
  ({ v, t, at = [0, 0, 0], rot = 0, pose = 'stand', s = 1, key1 = 1 }) => {
    const c = creatureOf(v);
    const hy = c.height * s;
    return (
      <group position={at}>
        {/* key: cold, from camera-left and above, close enough to model the body */}
        <pointLight position={[-2.4 * s, hy * 1.05, 3.0 * s]} color="#cfe0ff" intensity={14 * key1} distance={16 * s} decay={2} />
        {/* rim: behind and high, separates the silhouette from the trees */}
        <pointLight position={[1.8 * s, hy * 1.25, -3.2 * s]} color="#9fd8e8" intensity={10 * key1} distance={14 * s} decay={2} />
        {/* ground bounce so the legs and feet do not vanish into the dark */}
        <pointLight position={[0, 0.35, 1.6 * s]} color="#8a9ab0" intensity={4 * key1} distance={8 * s} decay={2} />
        <group rotation={[0, rot, 0]} scale={[s, s, s]}>
          <Creature c={c} t={t} pose={pose} seed={5} />
        </group>
      </group>
    );
  };

// --- shared overlay furniture: watermark + any extra fact pills from the table
const Facts: React.FC<{ v: any; W: number; H: number; t: number }> = ({ v, W, H, t }) => (
  <>
    {(v.facts || []).map((fct: any, i: number) => (
      <Pill key={i} x={W * (fct.at?.[0] ?? 0.5)} y={H * (fct.at?.[1] ?? 0.12)} t={fct.t}
        fs={H * 0.019} tone={fct.tone || 'cream'} k={ss((t - (fct.in ?? 0.3)) / 0.45)} />
    ))}
  </>
);

// =============================================================================
// 1. REVEAL
// =============================================================================
export const mi_reveal: Set3 = ({ t, v, tag }: SetP) => {
  const c = creatureOf(v);
  tag({ at: [1.2, c.height * 0.92, -3], text: v.name || c.name, side: -1, at2: 0.6, big: true });
  return (<group>
    <Clearing t={t} fog={7} />
    <Beast v={v} t={t} at={[1.2, 0, -3]} rot={-0.5} pose="stalk" />
    {/* two foreground trunks ONLY at the frame edges: the creature is half-hidden,
        never fully blocked. A wall of trees here renders as a black frame. */}
    <Forest t={t} n={2} area={[-5.2, -4.0, 1.2, 2.0]} snow />
    <Forest t={t} n={2} area={[4.2, 5.4, 1.2, 2.0]} snow />
  </group>);
};
mi_reveal.cam = (): CamSpec => ({ p: [-2.6, 1.7, 3.6], l: [1.1, 1.7, -3], move: 'arc', amt: 0.3, fov: 38 });
mi_reveal.camR = (): CamSpec => ({ p: [-1.8, 1.8, 2.8], l: [1.2, 1.9, -3], move: 'arc', amt: 0.28, fov: 52 });
mi_reveal.overlay = ({ W, H, t, v }: SetP) => (
  <Hud W={W} H={H}><Facts v={v} W={W} H={H} t={t} />
    <text x={W / 2} y={H * 0.955} textAnchor="middle" fontFamily="Inter, Arial, sans-serif" fontWeight={600}
      fontSize={H * 0.0105} letterSpacing={H * 0.0047} fill="#e8dcc4" opacity={0.3}>{(v.mark || WM).toUpperCase()}</text>
  </Hud>
);

// =============================================================================
// 2. HEIGHT  - full body, a person for scale, the measurement
// =============================================================================
export const mi_height: Set3 = ({ t, v }: SetP) => (
  <group>
    <Clearing t={t} fog={4} />
    {/* 9:16 is NARROW: at this distance the frame is only ~3.4 m wide, so the pair
        must sit inside +/-1.3 m or the person falls off the side of the Reel. */}
    <Beast v={v} t={t} at={[-0.95, 0, -2]} rot={0.15} pose="stand" />
    {v.man !== false && (<group>
      {/* the scale person needs light too, or the comparison has nothing to compare */}
      <pointLight position={[2.6, 2.0, 1.4]} color="#cfe0ff" intensity={8} distance={9} decay={2} />
      <Person s={CAST3[v.manId as string] || CAST3.noah} at={[1.25, 0, -2]} rot={-0.3} t={t} seed={3} pose="look" expr="fear" detail />
    </group>)}
  </group>
);
mi_height.cam = (): CamSpec => ({ p: [0.3, 1.35, 5.4], l: [0.1, 1.35, -2], move: 'crane', amt: 0.7, fov: 34 });
mi_height.camR = (): CamSpec => ({ p: [0.3, 1.4, 4.4], l: [0.1, 1.45, -2], move: 'crane', amt: 0.8, fov: 50 });
mi_height.overlay = ({ W, H, t, v }: SetP) => {
  // screen-fraction measurement beside the creature (the overlay has no camera,
  // and the reference keeps this bar pinned to the frame, not to the body)
  const x = W * (v.mx ?? 0.2);
  return (
    <Hud W={W} H={H}>
      <Measure a={[x, H * (v.my0 ?? 0.22)]} b={[x, H * (v.my1 ?? 0.82)]} t={v.tall || '2.5 M TALL'} H={H} k={ss((t - 0.5) / 0.8)} />
      {v.man !== false && (
        <Measure a={[W * (v.mx2 ?? 0.86), H * (v.my2 ?? 0.58)]} b={[W * (v.mx2 ?? 0.86), H * (v.my1 ?? 0.82)]} t={v.manTall || '1.8 M'} H={H} k={ss((t - 1.4) / 0.7)} tone="tech" />
      )}
      <Facts v={v} W={W} H={H} t={t} />
      <text x={W / 2} y={H * 0.955} textAnchor="middle" fontFamily="Inter, Arial, sans-serif" fontWeight={600}
        fontSize={H * 0.0105} letterSpacing={H * 0.0047} fill="#e8dcc4" opacity={0.3}>{(v.mark || WM).toUpperCase()}</text>
    </Hud>
  );
};

// =============================================================================
// 3. ANATOMY  - the creature dim behind, the cutaway in front
// =============================================================================
export const mi_anatomy: Set3 = ({ t, v }: SetP) => (
  <group>
    <Night t={t} moon={[-10, 14, -22]} />
    <Ground flat={20} c="#10171a" />
    <Mist t={t} n={8} area={[-12, 12, -12, 4]} y={0.5} o={0.2} size={10} />
    <Beast v={v} t={t} at={[0, 0, -3.4]} rot={0.1} pose={v.pose || 'loom'} />
  </group>
);
mi_anatomy.cam = (): CamSpec => ({ p: [0.2, 1.8, 5.2], l: [0, 1.9, -3.4], move: 'push', amt: 0.14, fov: 36 });
mi_anatomy.camR = (): CamSpec => ({ p: [0.2, 2.0, 4.4], l: [0, 2.1, -3.4], move: 'push', amt: 0.14, fov: 52 });
mi_anatomy.overlay = ({ W, H, t, v }: SetP) => (
  <Hud W={W} H={H}>
    <CutPanel x={W * (v.px ?? 0.5)} y={H * (v.py ?? 0.44)} r={Math.min(W, H) * (v.pr ?? 0.29)}
      kind={(v.panel as PanelKind) || 'voice'} seed={v.seed ?? 7} time={t} k={ss((t - 0.25) / 0.6)} />
    {(v.meters || []).map((m: any, i: number) => (
      <Meter key={i} x={W * 0.07} y={H * (0.1 + i * 0.062)} w={W * 0.3} t={m.t} v={m.v} H={H} k={ss((t - 0.9 - i * 0.25) / 0.5)} />
    ))}
    <Facts v={v} W={W} H={H} t={t} />
    <text x={W / 2} y={H * 0.955} textAnchor="middle" fontFamily="Inter, Arial, sans-serif" fontWeight={600}
      fontSize={H * 0.0105} letterSpacing={H * 0.0047} fill="#e8dcc4" opacity={0.3}>{(v.mark || WM).toUpperCase()}</text>
  </Hud>
);

// =============================================================================
// 4. ABILITY  - it bends toward the lit window and uses the stolen voice
// =============================================================================
export const mi_ability: Set3 = ({ t, v }: SetP) => {
  const bend = seg(t, 0.6, 2.6);
  return (<group>
    <Clearing t={t} fog={6} />
    <Cabin at={[-3.4, 0, -5]} t={t} lit={1} snow door={0} />
    <Fence from={[-7, 0, 0.6]} to={[7, 0, 0.6]} n={10} h={1.1} />
    {/* it bends toward the lit window: the lean IS the ability, so it must be visible */}
    <group rotation={[0, 0, -bend * 0.3]}>
      <Beast v={v} t={t} at={[1.05, 0, -3.4]} rot={-1.0} pose={v.pose || 'bend'} />
    </group>
  </group>);
};
// look BETWEEN the window and the creature so both are in frame, not just the cabin
mi_ability.cam = (): CamSpec => ({ p: [0.8, 2.0, 4.6], l: [0.0, 1.9, -4.2], move: 'truck', amt: 0.26, dir: -1, fov: 40 });
mi_ability.camR = (): CamSpec => ({ p: [0.5, 2.1, 3.8], l: [0.1, 2.0, -4.2], move: 'truck', amt: 0.24, dir: -1, fov: 54 });
mi_ability.overlay = ({ W, H, t, v }: SetP) => (
  <Hud W={W} H={H}>
    {v.say && <VoiceChip x={W * 0.5} y={H * (v.sayY ?? 0.16)} t={v.say} H={H} time={t} k={ss((t - 1.1) / 0.5)} />}
    {v.flow !== false && (
      <FlowArrow a={[W * 0.72, H * 0.4]} b={[W * 0.26, H * 0.52]} H={H} t={v.flowT} bow={0.18} k={ss((t - 1.6) / 0.7)} />
    )}
    <Facts v={v} W={W} H={H} t={t} />
    <text x={W / 2} y={H * 0.955} textAnchor="middle" fontFamily="Inter, Arial, sans-serif" fontWeight={600}
      fontSize={H * 0.0105} letterSpacing={H * 0.0047} fill="#e8dcc4" opacity={0.3}>{(v.mark || WM).toUpperCase()}</text>
  </Hud>
);

// =============================================================================
// 5. COMPARE  - the creature beside one real animal, on one baseline
// =============================================================================
export const mi_compare: Set3 = ({ t, v }: SetP) => (
  <group>
    <Night t={t} moon={[-8, 15, -20]} />
    <Ground flat={22} c="#141c1e" />
    <Mist t={t} n={6} area={[-14, 14, -10, 4]} y={0.35} o={0.16} size={9} />
    <Beast v={v} t={t} at={[-1.05, 0, -3]} rot={0.1} pose="stand" s={v.cs ?? 1} />
    <group position={[1.15, 0, -3]} rotation={[0, -0.4, 0]}>
      {/* the animal carries its own key light for the same reason the creature does */}
      <pointLight position={[1.6, 1.8, 2.2]} color="#cfe0ff" intensity={8} distance={8} decay={2} />
      <AnimalOf kind={v.animal || 'bird'} t={t} s={v.as ?? 1.1} />
    </group>
  </group>
);
// the pair must fit the 9:16 frame: at fov 50 and 6 m the vertical frame is ~5.6 m
// but the HORIZONTAL frame is only ~3.1 m, so the two subjects sit inside +/-1.7 m.
mi_compare.cam = (): CamSpec => ({ p: [0, 1.5, 4.8], l: [0, 1.3, -3], move: 'push', amt: 0.12, fov: 38 });
mi_compare.camR = (): CamSpec => ({ p: [0, 1.6, 4.0], l: [0, 1.4, -3], move: 'push', amt: 0.12, fov: 56 });
mi_compare.overlay = ({ W, H, t, v }: SetP) => (
  <Hud W={W} H={H}>
    <line x1={W * 0.06} y1={H * 0.86} x2={W * 0.94} y2={H * 0.86} stroke="#e8dcc4" strokeWidth={2.2} opacity={0.4} strokeDasharray="12 10" />
    <Pill x={W * 0.28} y={H * 0.1} t={v.name || creatureOf(v).name} fs={H * 0.019} k={ss((t - 0.3) / 0.5)} />
    <Pill x={W * 0.72} y={H * 0.1} t={v.animalName || (v.animal === 'fish' ? 'ANGLERFISH' : 'LYREBIRD')} fs={H * 0.019} tone="tech" k={ss((t - 0.8) / 0.5)} />
    <Facts v={v} W={W} H={H} t={t} />
    <text x={W / 2} y={H * 0.955} textAnchor="middle" fontFamily="Inter, Arial, sans-serif" fontWeight={600}
      fontSize={H * 0.0105} letterSpacing={H * 0.0047} fill="#e8dcc4" opacity={0.3}>{(v.mark || WM).toUpperCase()}</text>
  </Hud>
);

// =============================================================================
// 6. SCALE  - a person at the fence, the creature at a measured distance
// =============================================================================
export const mi_scale: Set3 = ({ t, v }: SetP) => (
  <group>
    <Clearing t={t} fog={7} />
    <Fence from={[-9, 0, -1.2]} to={[9, 0, -1.2]} n={13} h={1.1} />
    <Person s={CAST3[v.manId as string] || CAST3.noah} at={[-3.2, 0, 0.6]} rot={0.5} t={t} seed={6} pose="look" expr="fear" detail />
    <Beast v={v} t={t} at={[2.6, 0, -11]} rot={0.1} pose="stand" />
  </group>
);
mi_scale.cam = (): CamSpec => ({ p: [-1.4, 1.7, 4.6], l: [1.4, 1.8, -8], move: 'push', amt: 0.18, fov: 34 });
mi_scale.camR = (): CamSpec => ({ p: [-1.0, 1.8, 3.8], l: [1.6, 2.0, -8], move: 'push', amt: 0.18, fov: 50 });
mi_scale.overlay = ({ W, H, t, v }: SetP) => (
  <Hud W={W} H={H}>
    <FlowArrow a={[W * 0.26, H * 0.74]} b={[W * 0.66, H * 0.56]} H={H} t={v.dist || '25 M'} bow={0.12} k={ss((t - 0.6) / 0.8)} tone="cream" />
    {/* meters sit LOW here: the top of this frame already carries the fact pill,
        and two chips at the same height collided in the first pass */}
    {(v.meters || []).map((m: any, i: number) => (
      <Meter key={i} x={W * 0.07} y={H * (0.8 + i * 0.062)} w={W * 0.3} t={m.t} v={m.v} H={H} k={ss((t - 1.0 - i * 0.25) / 0.5)} />
    ))}
    <Facts v={v} W={W} H={H} t={t} />
    <text x={W / 2} y={H * 0.955} textAnchor="middle" fontFamily="Inter, Arial, sans-serif" fontWeight={600}
      fontSize={H * 0.0105} letterSpacing={H * 0.0047} fill="#e8dcc4" opacity={0.3}>{(v.mark || WM).toUpperCase()}</text>
  </Hud>
);

// =============================================================================
// 7. THREAT  - the close shot that closes the block
// =============================================================================
export const mi_threat: Set3 = ({ t, v }: SetP) => (
  <group>
    <Night t={t} moon={[-6, 12, -18]} />
    <Ground flat={18} c="#0e1416" />
    <Mist t={t} n={9} area={[-10, 10, -10, 3]} y={0.6} o={0.24} size={9} />
    <Beast v={v} t={t} at={[0, 0, -2.2]} rot={0.05} pose={v.pose || 'loom'} />
  </group>
);
// head-and-shoulders only: the camera sits ~1.7 m from the skull, not 4 m away.
// At 4 m this card rendered as another full body and stopped being a close shot.
mi_threat.cam = (v: any): CamSpec => ({ p: [0.45, (v?.eye ?? 2.3) + 0.08, -0.5], l: [0, v?.eye ?? 2.3, -2.2], move: 'push', amt: 0.18, fov: 38, breath: 1 });
mi_threat.camR = (v: any): CamSpec => ({ p: [0.35, (v?.eye ?? 2.3) + 0.08, -0.75], l: [0, v?.eye ?? 2.3, -2.2], move: 'push', amt: 0.18, fov: 46, breath: 1 });
mi_threat.overlay = ({ W, H, t, v }: SetP) => (
  <Hud W={W} H={H}>
    {/* the chip sits under the top third: at y 0.14 it landed on the moon disc */}
    {v.say && <VoiceChip x={W * 0.5} y={H * (v.sayY ?? 0.3)} t={v.say} H={H} time={t} k={ss((t - 0.8) / 0.5)} tone="red" />}
    <Facts v={v} W={W} H={H} t={t} />
    <text x={W / 2} y={H * 0.955} textAnchor="middle" fontFamily="Inter, Arial, sans-serif" fontWeight={600}
      fontSize={H * 0.0105} letterSpacing={H * 0.0047} fill="#e8dcc4" opacity={0.3}>{(v.mark || WM).toUpperCase()}</text>
  </Hud>
);

// =============================================================================
export const MI_SETS = { mi_reveal, mi_height, mi_anatomy, mi_ability, mi_compare, mi_scale, mi_threat };
// Drop-in beat order for story/scenes_*.py. Keep every card under 5 s, and never
// show a card twice without changing BOTH the camera and the annotation.
export const MI_ORDER = ['mi_reveal', 'mi_height', 'mi_anatomy', 'mi_ability', 'mi_compare', 'mi_scale', 'mi_threat'] as const;
