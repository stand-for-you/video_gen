import React from 'react';
import { PAL, M, G, rng, sway, ss, seg, V3 } from './k3/core';
import { Night, Ground, Grass, Mist, Flakes, Halo } from './k3/World';
import { Forest, Pine, DeadTree, Rock, Fence } from './k3/Nature';
import { Cottage, Street, Cobbles, Door, Window } from './k3/Build';
import { Room, Floor, BrickWall, Table, Chair, Shelf, Crate, Stairs, Rug } from './k3/Interior';
import { Torch, Flame, Smoke, BloodPool, Candle } from './k3/Fx';
import { Person, Pose, Expr, Hold } from './k3/Person';
import { CAST3 } from './Cast3D';

// ===== STORY KIT: THE SEER OF POSSIBILITIES (Kit 'q', 2000s/2010s Corporate & Rural Horror)
export const SEER_COL = {
  fog: '#0c1420',
  night: '#0a1018',
  redScreen: '#ff2828',
  routerRed: '#ff1111',
  monitorCyan: '#38bdf8',
  amberLamp: '#ff9933',
};

// 1. CRT Monitor & Desk Setup
export const CRTMonitor: React.FC<{ t: number; at?: V3; rot?: number; textRed?: boolean; lit?: boolean }> = ({ t, at = [0, 0, 0], rot = 0, textRed = true, lit = true }) => {
  const redBlink = textRed ? 0.85 + sway(t, 4, 0.15, 1) : 0;
  return (
    <group position={at} rotation={[0, rot, 0]}>
      {/* Monitor housing */}
      <mesh position={[0, 0.35, 0]} material={M('#222428')}>
        <boxGeometry args={[0.55, 0.45, 0.4]} />
      </mesh>
      {/* Stand */}
      <mesh position={[0, 0.08, 0]} material={M('#18191c')}>
        <cylinderGeometry args={[0.12, 0.16, 0.16, 8]} />
      </mesh>
      {/* Screen glass */}
      <mesh position={[0, 0.35, 0.205]} material={textRed ? G(SEER_COL.redScreen) : M('#111317')}>
        <planeGeometry args={[0.44, 0.34]} />
      </mesh>
      {/* Screen glow light */}
      {lit && textRed && <pointLight position={[0, 0.35, 0.45]} color="#ff2a2a" intensity={2.8 * redBlink} distance={4.5} decay={2} />}
      {lit && !textRed && <pointLight position={[0, 0.35, 0.45]} color="#38bdf8" intensity={1.5} distance={3.5} decay={2} />}
      {/* Keyboard */}
      <mesh position={[0, 0.02, 0.38]} material={M('#282a30')}>
        <boxGeometry args={[0.42, 0.03, 0.16]} />
      </mesh>
      {/* Mouse */}
      <mesh position={[0.28, 0.02, 0.38]} material={M('#222428')}>
        <boxGeometry args={[0.07, 0.03, 0.11]} />
      </mesh>
    </group>
  );
};

// 2. Internet Router with Blinking Red Light
export const RouterBox: React.FC<{ t: number; at?: V3 }> = ({ t, at = [0, 0, 0] }) => {
  const blink = Math.sin(t * 8) > 0.1 ? 1 : 0;
  return (
    <group position={at}>
      <mesh position={[0, 0.03, 0]} material={M('#151618')}>
        <boxGeometry args={[0.22, 0.06, 0.15]} />
      </mesh>
      {/* Antennas */}
      <mesh position={[-0.08, 0.15, -0.06]} rotation={[0.1, 0, -0.2]} material={M('#0d0e10')}>
        <cylinderGeometry args={[0.008, 0.008, 0.2, 4]} />
      </mesh>
      <mesh position={[0.08, 0.15, -0.06]} rotation={[0.1, 0, 0.2]} material={M('#0d0e10')}>
        <cylinderGeometry args={[0.008, 0.008, 0.2, 4]} />
      </mesh>
      {/* Blinking Red LED */}
      <mesh position={[0.06, 0.04, 0.076]} material={blink ? G('#ff1111') : M('#441111')}>
        <boxGeometry args={[0.02, 0.02, 0.005]} />
      </mesh>
      {blink && <pointLight position={[0.06, 0.04, 0.15]} color="#ff1111" intensity={1.2} distance={1.2} />}
    </group>
  );
};

// 3. Heavy Potted Ficus Plant (The trigger that changes everything)
export const PottedPlant: React.FC<{ t?: number; at?: V3; offsetZ?: number }> = ({ at = [0, 0, 0], offsetZ = 0 }) => (
  <group position={[at[0], at[1], at[2] + offsetZ]}>
    {/* Heavy ceramic pot */}
    <mesh position={[0, 0.4, 0]} material={M('#5c4a3e', { r: 0.8 })}>
      <cylinderGeometry args={[0.38, 0.26, 0.8, 12]} />
    </mesh>
    {/* Soil / Stones */}
    <mesh position={[0, 0.78, 0]} material={M('#2b221a')}>
      <cylinderGeometry args={[0.36, 0.36, 0.05, 12]} />
    </mesh>
    {/* Ficus stem */}
    <mesh position={[0, 1.2, 0]} material={M('#4a3728')}>
      <cylinderGeometry args={[0.05, 0.07, 0.9, 6]} />
    </mesh>
    {/* Lush foliage cluster */}
    {[-0.15, 0.12, 0].map((x, i) => (
      <mesh key={i} position={[x, 1.7 + i * 0.25, (i % 2 === 0 ? 0.1 : -0.1)]} material={M('#2a452e')}>
        <dodecahedronGeometry args={[0.42 + i * 0.08, 0]} />
      </mesh>
    ))}
  </group>
);

// 4. Jack's Apartment Study
export const ApartmentStudy: React.FC<{ t: number; textRed?: boolean; disconnected?: boolean }> = ({ t, textRed = true, disconnected = true }) => (
  <group>
    <Room w={7} d={6} h={2.8} wall="plank" wallC="#242b35" floorC="#1b1c20" t={t} window={{ x: -2.0, moon: true, w: 1.2, h: 1.8 }} />
    <Table at={[0, 0, -1.8]} w={2.2} d={1.1} h={0.76} />
    <Chair at={[0, 0, -1.0]} rot={Math.PI} />
    <CRTMonitor t={t} at={[0, 0.76, -1.8]} textRed={textRed} lit={true} />
    <RouterBox t={t} at={[-0.8, 0.76, -1.8]} />
    {/* Ambient desk lamp */}
    <mesh position={[0.7, 1.05, -1.8]} material={M('#181a1f')}>
      <cylinderGeometry args={[0.08, 0.14, 0.25, 8]} />
    </mesh>
    <pointLight position={[0.7, 1.0, -1.8]} color="#ffaa44" intensity={1.8} distance={3.0} />
    {/* Bookshelf */}
    <Shelf at={[-2.8, 0, -0.5]} rot={Math.PI / 2} w={1.8} h={2.2} rows={4} seed={3} />
    <Mist t={t} n={3} area={[-3, 3, -2.5, 1]} y={0.3} o={0.08} />
  </group>
);

// 5. Ten-Story Corporate Lobby (Elevators + Ficus)
export const OfficeLobby: React.FC<{ t: number; plantOffset?: number; crowd?: boolean }> = ({ t, plantOffset = 0, crowd = false }) => (
  <group>
    {/* Sleek commercial marble floor */}
    <Floor w={16} d={14} c="#333842" />
    {/* Travertine back wall */}
    <mesh position={[0, 3.5, -6]} material={M('#4a4e58')}>
      <boxGeometry args={[16, 7, 0.4]} />
    </mesh>
    {/* Left elevator */}
    <group position={[-2.8, 0, -5.7]}>
      <mesh position={[0, 1.6, 0]} material={M('#8892a0', { m: 0.8 })}>
        <boxGeometry args={[1.8, 3.0, 0.05]} />
      </mesh>
      {/* Floor indicator */}
      <mesh position={[0, 3.3, 0.04]} material={G('#38bdf8')}>
        <boxGeometry args={[0.3, 0.12, 0.02]} />
      </mesh>
    </group>
    {/* Right elevator */}
    <group position={[2.8, 0, -5.7]}>
      <mesh position={[0, 1.6, 0]} material={M('#8892a0', { m: 0.8 })}>
        <boxGeometry args={[1.8, 3.0, 0.05]} />
      </mesh>
      <mesh position={[0, 3.3, 0.04]} material={G('#38bdf8')}>
        <boxGeometry args={[0.3, 0.12, 0.02]} />
      </mesh>
    </group>
    {/* Center pillar between elevators */}
    <mesh position={[0, 3.5, -5.8]} material={M('#3a3e47')}>
      <boxGeometry args={[2.4, 7, 0.25]} />
    </mesh>
    {/* The fateful potted plant */}
    <PottedPlant t={t} at={[0, 0, -5.5]} offsetZ={plantOffset} />
    {/* Recessed ceiling lights */}
    {[-4, -1.5, 1.5, 4].map((x, i) => (
      <pointLight key={i} position={[x, 5.5, -3]} color="#e0eeff" intensity={1.6} distance={8} />
    ))}
    {/* Crowd of commuters if enabled */}
    {crowd && (
      <group position={[0, 0, 0]}>
        <Person s={CAST3.terence} at={[-1.6, 0, -3.2]} t={t} pose="hold" expr="angry" />
        <Person s={CAST3.elias} at={[3.2, 0, -2.5]} t={t} pose="hold" />
        <Person s={CAST3.mira} at={[1.2, 0, -1.8]} t={t} pose="hold" />
      </group>
    )}
  </group>
);

// 6. Seventh Floor Cubicle Office
export const CubicleOffice: React.FC<{ t: number; alliePresent?: boolean; jamesLimp?: boolean }> = ({ t, alliePresent = true, jamesLimp = false }) => (
  <group>
    <Floor w={18} d={14} c="#252930" />
    {/* Office window looking out at city */}
    <mesh position={[0, 3.0, -6.5]} material={M('#303642')}>
      <boxGeometry args={[18, 6, 0.2]} />
    </mesh>
    <mesh position={[0, 3.0, -6.38]} material={M('#0f1724')}>
      <planeGeometry args={[16, 4]} />
    </mesh>
    {/* Distant skyline buildings */}
    {[-6, -3, 0, 3, 6].map((x, i) => (
      <mesh key={i} position={[x, 2.5 + (i % 3) * 0.8, -12]} material={M('#080d14')}>
        <boxGeometry args={[2.2, 8, 2.2]} />
      </mesh>
    ))}
    {/* Jack's desk */}
    <Table at={[-1.8, 0, -2.2]} w={2.0} d={1.0} h={0.75} />
    <Chair at={[-1.8, 0, -1.4]} rot={Math.PI} />
    <CRTMonitor t={t} at={[-1.8, 0.75, -2.2]} textRed={false} />
    {/* Allie's desk */}
    <Table at={[1.8, 0, -2.2]} w={2.0} d={1.0} h={0.75} />
    <Chair at={[1.8, 0, -1.4]} rot={Math.PI} />
    <CRTMonitor t={t} at={[1.8, 0.75, -2.2]} textRed={false} />
    {/* Fabric dividers */}
    <mesh position={[0, 0.8, -2.2]} material={M('#3e4b5e')}>
      <boxGeometry args={[0.08, 1.6, 2.4]} />
    </mesh>
    <mesh position={[-1.8, 0.8, -3.2]} material={M('#3e4b5e')}>
      <boxGeometry args={[2.2, 1.6, 0.08]} />
    </mesh>
    <mesh position={[1.8, 0.8, -3.2]} material={M('#3e4b5e')}>
      <boxGeometry args={[2.2, 1.6, 0.08]} />
    </mesh>
    {/* People */}
    <Person s={CAST3.noah} at={[-1.8, 0, -1.4]} t={t} pose="hold" />
    {alliePresent && <Person s={CAST3.mira} at={[1.8, 0, -1.4]} t={t} pose="hold" expr="smile" />}
    {jamesLimp && <Person s={CAST3.terence} at={[0.4, 0, 0.8]} t={t} pose="hold" expr="fear" />}
  </group>
);

// 7. City Street Crash Scene (Wet asphalt, 18-wheeler, wrecked sedan, sirens)
export const CrashScene: React.FC<{ t: number }> = ({ t }) => {
  const sirenRed = Math.sin(t * 12) > 0 ? 1 : 0;
  const sirenBlue = Math.sin(t * 12 + Math.PI) > 0 ? 1 : 0;
  return (
    <group>
      <Ground flat={0} c="#111317" />
      {/* Wet asphalt road */}
      <Cobbles x0={-8} x1={8} z0={-16} z1={8} wet />
      {/* High-rise building base */}
      <mesh position={[-9, 6, -2]} material={M('#2b303c')}>
        <boxGeometry args={[4, 12, 16]} />
      </mesh>
      {/* The 18-Wheeler Truck */}
      <group position={[0.5, 0, -4]} rotation={[0, 0.1, 0]}>
        {/* Cab */}
        <mesh position={[-1.8, 1.6, 0]} material={M('#8c2d2a')}>
          <boxGeometry args={[3.2, 3.0, 2.4]} />
        </mesh>
        {/* Cargo trailer */}
        <mesh position={[3.2, 2.0, 0]} material={M('#9ca3af')}>
          <boxGeometry args={[6.8, 3.8, 2.5]} />
        </mesh>
      </group>
      {/* Smashed Sedan */}
      <group position={[-1.6, 0, -3.8]} rotation={[0, -0.4, 0.2]}>
        <mesh position={[0, 0.6, 0]} material={M('#2563eb')}>
          <boxGeometry args={[2.6, 0.9, 1.6]} />
        </mesh>
        {/* Crumpled roof */}
        <mesh position={[-0.2, 1.1, 0]} material={M('#1d4ed8')}>
          <boxGeometry args={[1.4, 0.5, 1.4]} />
        </mesh>
        <BloodPool at={[0.6, 0, 0.4]} r={0.9} />
      </group>
      {/* Flashing Police / Emergency Lights */}
      <pointLight position={[-4, 2.5, 2]} color="#ff1111" intensity={3.5 * sirenRed} distance={15} />
      <pointLight position={[4, 2.5, 2]} color="#1166ff" intensity={3.5 * sirenBlue} distance={15} />
      {/* Mist & Rain */}
      <Mist t={t} n={8} area={[-10, 10, -12, 6]} y={0.4} o={0.25} />
      <Flakes t={t} n={250} box={[-10, 10, 0, 8, -12, 6]} kind="dust" />
    </group>
  );
};

// 8. Jack & Donna's Country Home Living Room (12 Years Later)
export const RuralLivingRoom: React.FC<{ t: number; pizzaPresent?: boolean; donnaSleeping?: boolean }> = ({ t, pizzaPresent = true, donnaSleeping = false }) => (
  <group>
    <Room w={10} d={8} h={3.2} wall="plank" wallC="#332a22" floorC="#423528" t={t} window={{ x: 3.2, moon: true, w: 1.4, h: 2.0 }} beams />
    {/* Large comfortable sofa */}
    <group position={[0, 0, -0.8]}>
      {/* Base */}
      <mesh position={[0, 0.35, 0]} material={M('#523d2e')}>
        <boxGeometry args={[2.6, 0.5, 1.1]} />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, 0.75, -0.45]} material={M('#4a3628')}>
        <boxGeometry args={[2.6, 0.7, 0.3]} />
      </mesh>
      {/* Arms */}
      {[-1.35, 1.35].map((x, i) => (
        <mesh key={i} position={[x, 0.55, 0]} material={M('#4a3628')}>
          <boxGeometry args={[0.22, 0.5, 1.1]} />
        </mesh>
      ))}
    </group>
    {/* Coffee Table */}
    <Table at={[0, 0, 0.8]} w={1.8} d={0.9} h={0.45} />
    {/* Pizza Box */}
    {pizzaPresent && (
      <group position={[0, 0.47, 0.8]}>
        <mesh material={M('#c29b68')}>
          <boxGeometry args={[0.48, 0.05, 0.48]} />
        </mesh>
      </group>
    )}
    {/* Soft living room floor lamp */}
    <pointLight position={[-2.8, 1.8, -0.8]} color="#ffaa55" intensity={2.2} distance={6} />
    {/* Staircase leading upstairs */}
    <Stairs at={[-3.8, 0, 1.8]} rot={Math.PI / 2} n={10} w={1.2} />
    {/* Donna on couch */}
    {donnaSleeping && <Person s={CAST3.donna} at={[0.3, 0.25, -0.8]} rot={Math.PI * 0.9} t={t} pose="sit" expr="smile" />}
  </group>
);

// 9. Upstairs Study (The Final Confrontation)
export const UpstairsStudy: React.FC<{ t: number; textRed?: boolean; hulkInDoor?: boolean }> = ({ t, textRed = true, hulkInDoor = false }) => (
  <group>
    <Room w={8} d={7} h={2.8} wall="plank" wallC="#222830" floorC="#2c221a" t={t} window={{ x: -2.8, moon: true, w: 1.4, h: 1.8 }} />
    <Door at={[3.2, 0, 1.4]} w={1.1} h={2.2} open={0.95} lit={0.5} t={t} />
    <Table at={[0, 0, -1.8]} w={2.2} d={1.1} h={0.76} />
    <Chair at={[0, 0, -1.0]} rot={Math.PI} />
    <CRTMonitor t={t} at={[0, 0.76, -1.8]} textRed={textRed} lit={true} />
    {/* Jack seated facing screen */}
    <Person s={CAST3.noah} at={[0, 0, -1.0]} rot={Math.PI} t={t} pose="hold" expr="fear" />
    {/* The Delivery Hulk towering in the doorway */}
    {hulkInDoor && (
      <group position={[3.1, 0, 1.3]} rotation={[0, -Math.PI / 2.2, 0]}>
        <Person s={CAST3.hulk} at={[0, 0, 0]} t={t} pose="hold" hold="pitchfork" expr="angry" />
      </group>
    )}
  </group>
);

// 10. The Seer's Infinite Possibility Void
export const SeerVoid: React.FC<{ t: number }> = ({ t }) => (
  <group>
    <Night t={t} fog="#060810" density={0.06} moonI={0.8} amb={0.2} />
    <Ground flat={20} c="#080b12" />
    {/* Ancient megalithic pillars */}
    {[-6, -2, 2, 6].map((x, i) => (
      <mesh key={i} position={[x, 3.5, -4 - (i % 2) * 2]} material={M('#181d28')}>
        <boxGeometry args={[0.9, 7.0, 0.9]} />
      </mesh>
    ))}
    {/* The Seer spectral figure floating */}
    <group position={[0, 1.4 + Math.sin(t * 1.5) * 0.15, -4.5]}>
      <Person s={CAST3.seer} at={[0, 0, 0]} t={t} pose="idle" expr="smile" />
      <pointLight position={[0, 0.8, 0.5]} color="#ff2222" intensity={2.5} distance={5} />
    </group>
    {/* Floating crimson particle mist */}
    <Flakes t={t} n={180} box={[-8, 8, 0, 6, -8, 2]} kind="dust" />
  </group>
);
