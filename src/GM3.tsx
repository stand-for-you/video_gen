import React from 'react';
import { PAL, M, G, rng, sway, ss, seg, V3 } from './k3/core';
import { Night, Ground, Grass, Mist, Flakes, Halo } from './k3/World';
import { Forest, Pine, DeadTree, Rock, Gravestone, Fence } from './k3/Nature';
import { Room, Floor, Table, Chair, Shelf, Crate, Chain, Stairs } from './k3/Interior';
import { Door } from './k3/Build';
import { BloodPool, Smoke, Embers } from './k3/Fx';
import { Person, Pose, Expr, Hold } from './k3/Person';
import { Creature, HERBERT } from './k3/Creature';
import { CAST3, GHOST3 } from './Cast3D';

// ===== STORY KIT q: 1983 UNDERGROUND SENSORY RESEARCH FACILITY ("Gateway of the Mind")
// Muted concrete grey (#2e3438) + oscilloscope phosphor green (#5a7a60); single red accent = recording LED (#ff1a1a).
export const FAC = {
  wall: '#323a3d',
  floor: '#22282a',
  steel: '#6a7275',
  screen: '#1e382b',
  beam: '#55ff77',
  redLed: '#ff1a1a',
  dimLight: '#d5e2d5',
};

// 1. Stainless steel medical / restraint examination table
export const ExamTable: React.FC<{ at?: V3; rot?: number; restrained?: boolean; t?: number }> = ({ at = [0, 0, 0], rot = 0, restrained = false, t = 0 }) => (
  <group position={at} rotation={[0, rot, 0]}>
    {/* Frame and legs */}
    {[-0.9, 0.9].map((x, i) =>
      [-0.4, 0.4].map((z, j) => (
        <mesh key={`leg-${i}-${j}`} position={[x, 0.42, z]}>
          <boxGeometry args={[0.07, 0.84, 0.07]} />
          <primitive object={M(FAC.steel)} attach="material" />
        </mesh>
      ))
    )}
    {/* Table top slab */}
    <mesh position={[0, 0.86, 0]}>
      <boxGeometry args={[2.1, 0.08, 0.95]} />
      <primitive object={M('#4a5255')} attach="material" />
    </mesh>
    {/* Padded vinyl mat */}
    <mesh position={[0, 0.92, 0]}>
      <boxGeometry args={[1.98, 0.05, 0.86]} />
      <primitive object={M('#1e2224')} attach="material" />
    </mesh>
    {/* Headrest */}
    <mesh position={[0.82, 0.95, 0]} rotation={[0, 0, -0.15]}>
      <boxGeometry args={[0.38, 0.06, 0.5]} />
      <primitive object={M('#181b1d')} attach="material" />
    </mesh>
    {/* Leather restraint straps */}
    {restrained && (
      <>
        {[-0.5, 0.0, 0.5].map((x, k) => (
          <mesh key={`strap-${k}`} position={[x, 0.96, 0]}>
            <boxGeometry args={[0.08, 0.06, 0.92]} />
            <primitive object={M('#2b1f1a')} attach="material" />
          </mesh>
        ))}
      </>
    )}
  </group>
);

// 2. 1983 CRT Oscilloscope / Heart Monitor
export const Oscilloscope: React.FC<{ at?: V3; rot?: number; flatline?: boolean; t?: number }> = ({ at = [0, 0, 0], rot = 0, flatline = false, t = 0 }) => {
  const pulse = flatline ? 0 : Math.sin(t * 8) > 0.8 ? 1 : 0.2;
  return (
    <group position={at} rotation={[0, rot, 0]}>
      {/* Outer casing */}
      <mesh position={[0, 0.32, 0]}>
        <boxGeometry args={[0.65, 0.5, 0.6]} />
        <primitive object={M('#3a4244')} attach="material" />
      </mesh>
      {/* Bezel */}
      <mesh position={[0, 0.34, 0.31]}>
        <boxGeometry args={[0.54, 0.4, 0.04]} />
        <primitive object={M('#202425')} attach="material" />
      </mesh>
      {/* Green screen */}
      <mesh position={[0, 0.34, 0.325]}>
        <planeGeometry args={[0.48, 0.34]} />
        <primitive object={G(flatline ? '#338844' : '#44bb55')} attach="material" />
      </mesh>
      {/* Horizontal beam / flatline line */}
      <mesh position={[0, flatline ? 0.34 : 0.34 + Math.sin(t * 12) * 0.04, 0.33]}>
        <planeGeometry args={[0.44, 0.02]} />
        <primitive object={G(flatline ? '#55ff77' : pulse > 0.5 ? '#99ffaa' : '#55ff77')} attach="material" />
      </mesh>
      {/* Red record indicator LED */}
      <mesh position={[0.22, 0.5, 0.32]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <primitive object={G(FAC.redLed)} attach="material" />
      </mesh>
      {/* Control knobs */}
      {[-0.15, -0.05, 0.05, 0.15].map((x, i) => (
        <mesh key={i} position={[x, 0.18, 0.32]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.03, 8]} />
          <primitive object={M('#151819')} attach="material" />
        </mesh>
      ))}
    </group>
  );
};

// 3. 1983 Reel-to-Reel Tape Recorder console
export const ReelConsole: React.FC<{ at?: V3; rot?: number; t?: number }> = ({ at = [0, 0, 0], rot = 0, t = 0 }) => {
  const spin = t * 3.5;
  return (
    <group position={at} rotation={[0, rot, 0]}>
      {/* Desk stand */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[0.85, 0.8, 0.6]} />
        <primitive object={M('#2a3133')} attach="material" />
      </mesh>
      {/* Deck faceplate */}
      <mesh position={[0, 0.82, 0]}>
        <boxGeometry args={[0.8, 0.06, 0.56]} />
        <primitive object={M('#4e5659')} attach="material" />
      </mesh>
      {/* Left and right tape reels */}
      {[-0.2, 0.2].map((x, i) => (
        <group key={i} position={[x, 0.86, -0.04]} rotation={[0, spin * (i === 0 ? 1 : 1.05), 0]}>
          <mesh>
            <cylinderGeometry args={[0.13, 0.13, 0.02, 16]} />
            <primitive object={M('#959fa3')} attach="material" />
          </mesh>
          <mesh position={[0, 0.015, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.025, 8]} />
            <primitive object={M('#151819')} attach="material" />
          </mesh>
        </group>
      ))}
      {/* VU Level Meters */}
      {[-0.1, 0.1].map((x, i) => (
        <mesh key={`vu-${i}`} position={[x, 0.86, 0.18]}>
          <boxGeometry args={[0.12, 0.015, 0.08]} />
          <primitive object={G('#ffbb44')} attach="material" />
        </mesh>
      ))}
      {/* Glowing red record lamp */}
      <mesh position={[0.3, 0.86, 0.18]}>
        <sphereGeometry args={[0.022, 8, 8]} />
        <primitive object={G(FAC.redLed)} attach="material" />
      </mesh>
    </group>
  );
};

// 4. Intravenous (IV) Saline Stand
export const IVStand: React.FC<{ at?: V3; t?: number }> = ({ at = [0, 0, 0], t = 0 }) => (
  <group position={at}>
    {/* Base stand with rolling caster legs */}
    {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((a, i) => (
      <mesh key={i} position={[Math.cos(a) * 0.22, 0.04, Math.sin(a) * 0.22]} rotation={[0, a, 0]}>
        <boxGeometry args={[0.26, 0.04, 0.04]} />
        <primitive object={M(FAC.steel)} attach="material" />
      </mesh>
    ))}
    {/* Vertical pole */}
    <mesh position={[0, 1.15, 0]}>
      <cylinderGeometry args={[0.018, 0.018, 2.2, 8]} />
      <primitive object={M(FAC.steel)} attach="material" />
    </mesh>
    {/* Top cross hooks */}
    <mesh position={[0, 2.2, 0]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.012, 0.012, 0.35, 8]} />
      <primitive object={M(FAC.steel)} attach="material" />
    </mesh>
    {/* Hanging Saline Solution Bag */}
    <mesh position={[0.12, 2.05, 0]}>
      <boxGeometry args={[0.1, 0.22, 0.05]} />
      <primitive object={M('#bcc9cf', { op: 0.75 })} attach="material" />
    </mesh>
    {/* Clear plastic drip tube */}
    <mesh position={[0.12, 1.45, 0]}>
      <cylinderGeometry args={[0.005, 0.005, 1.0, 6]} />
      <primitive object={M('#eef5f8', { op: 0.6 })} attach="material" />
    </mesh>
  </group>
);

// 5. Overhead Industrial Fluorescent Tube Fixture
export const FluorescentLight: React.FC<{ at?: V3; flicker?: boolean; t?: number }> = ({ at = [0, 3.1, 0], flicker = false, t = 0 }) => {
  const f = flicker ? 0.65 + sway(t, 25, 0.35, 1) : 1.0;
  return (
    <group position={at}>
      {/* Reflector hood */}
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[1.5, 0.08, 0.32]} />
        <primitive object={M('#3a4042')} attach="material" />
      </mesh>
      {/* Glowing dual tubes */}
      {[-0.07, 0.07].map((z, i) => (
        <mesh key={i} position={[0, -0.02, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.022, 0.022, 1.4, 8]} />
          <primitive object={G(FAC.dimLight)} attach="material" />
        </mesh>
      ))}
      {/* Downward light */}
      <pointLight position={[0, -0.15, 0]} intensity={2.8 * f} distance={7} color={FAC.dimLight} />
    </group>
  );
};

// 6. Complete Underground Isolation Chamber
export const IsolationChamber: React.FC<{ t: number; restrained?: boolean; flatline?: boolean; alarm?: boolean; mic?: boolean }> = ({
  t,
  restrained = false,
  flatline = false,
  alarm = false,
  mic = false,
}) => (
  <group>
    {/* Concrete and padded chamber */}
    <Room w={10} d={8.5} h={3.4} wall="brick" wallC={FAC.wall} floorC={FAC.floor} stoneFloor t={t} window={null} beams />

    {/* Observation one-way glass window on the back wall */}
    <mesh position={[0, 1.8, -4.18]}>
      <planeGeometry args={[3.2, 1.3]} />
      <primitive object={M('#152026', { op: 0.85 })} attach="material" />
    </mesh>
    <mesh position={[0, 1.8, -4.2]}>
      <boxGeometry args={[3.4, 1.5, 0.06]} />
      <primitive object={M('#232a2c')} attach="material" />
    </mesh>

    {/* Examination Table in center */}
    <ExamTable at={[0, 0, -0.4]} rot={0.1} restrained={restrained} t={t} />

    {/* Patient (Subject 83) lying or sitting */}
    <Person s={CAST3.subject} at={[0, 0.98, -0.4]} rot={Math.PI / 2} pose={restrained ? 'sit' : 'stand'} t={t} expr="fear" seed={1} />

    {/* Medical / Telemetry Cart beside the table */}
    <group position={[-1.6, 0, -0.5]}>
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[0.8, 0.9, 0.7]} />
        <primitive object={M('#3a4245')} attach="material" />
      </mesh>
      <Oscilloscope at={[0, 0.9, 0]} rot={0.3} flatline={flatline} t={t} />
    </group>

    {/* IV Stand next to table */}
    <IVStand at={[1.3, 0, -0.4]} t={t} />

    {/* Suspended Gooseneck Microphone from ceiling */}
    {mic && (
      <group position={[0.2, 1.8, -0.4]}>
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 1.2, 6]} />
          <primitive object={M(FAC.steel)} attach="material" />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.035, 0.03, 0.12, 8]} />
          <primitive object={M('#111314')} attach="material" />
        </mesh>
      </group>
    )}

    {/* Overhead Fluorescent Fixtures */}
    <FluorescentLight at={[0, 3.25, -0.4]} flicker={alarm} t={t} />

    {/* Pulsing red alarm beacon if triggered */}
    {alarm && (
      <group position={[3.8, 2.8, -3.8]}>
        <mesh>
          <cylinderGeometry args={[0.08, 0.1, 0.15, 8]} />
          <primitive object={G(FAC.redLed)} attach="material" />
        </mesh>
        <pointLight color={FAC.redLed} intensity={4.5 * (Math.sin(t * 10) * 0.5 + 0.5)} distance={8} />
      </group>
    )}

    {/* Subtle atmospheric mist */}
    <Mist t={t} n={5} area={[-4, 4, -3.5, 3.5]} y={0.2} o={0.12} />
  </group>
);

// 7. Psychological Void with Looming Apparitions
export const VoidChamber: React.FC<{ t: number }> = ({ t }) => (
  <group>
    <Ground flat={10} c="#0d1113" />
    <Mist t={t} n={12} area={[-10, 10, -10, 8]} y={0.3} o={0.28} />

    {/* Center test subject kneeling or surrounded */}
    <Person s={CAST3.subject} at={[0, 0, 0]} rot={0} pose="look" expr="fear" t={t} seed={3} />

    {/* Looming deceased relatives / apparitions */}
    <Person s={GHOST3.woman} at={[-2.2, 0.2, -1.8]} rot={0.5} pose="stand" t={t + 1} seed={11} />
    <Person s={GHOST3.grinner} at={[2.2, 0.3, -2.1]} rot={-0.6} pose="stand" t={t + 2} seed={12} />
    <Person s={GHOST3.child} at={[0, 0.1, -3.2]} rot={0.1} pose="stand" t={t + 3} seed={13} />

    {/* Eerie cold moonlight */}
    <pointLight position={[0, 4, 1]} intensity={1.8} distance={12} color="#88aacc" />
  </group>
);
