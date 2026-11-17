import React, { useMemo } from 'react';
import * as THREE from 'three';
import { M, G, PAL, rng, sway, noise1, ss, seg, clamp, lerp, flick, V3 } from './k3/core';
import { Night, Ground, Grass, Mist, Flakes, Halo, softTex } from './k3/World';
import { Forest, DeadTree, Rock, Fence } from './k3/Nature';
import { Window as KWindow, Door, Cobbles } from './k3/Build';
import { Floor, Table, Chair, Shelf, Crate, Stairs, Rug, OldBook } from './k3/Interior';
import { Flame, Candle, Smoke, Embers, BloodPool } from './k3/Fx';
import { Person } from './k3/Person';
import { Creature, C3 } from './k3/Creature';
import { CAST3 } from './Cast3D';
// ===== STORY KIT q — "THE SEER OF POSSIBILITIES" (modern city, 2000s). Built from the fixed 3D kits in src/k3/.
// Palette: cold grey-blue glass and night + sodium orange street light + warm lamp light indoors, and ONE red accent:
// the red screen text and the blinking router light. Flat shaded everywhere, light budget about 6 per scene.
export const SP = {
  wall: '#6a6a66', wall2: '#55555a', ceil: '#2a2c30', carpet: '#3a3d42', marble: '#6e7076', glass: '#243244',
  desk: '#8a7558', deskDark: '#4a4034', metal: '#55585e', plastic: '#2a2c30', screenOff: '#15171c',
  red: '#d8241f', amber: '#ff9a40', lamp: '#ffc07a', road: '#2a2a2c', line: '#b8b4a0', car: '#6a3a34', lorry: '#4a5a66',
  sofa: '#55504a', tv: '#9fc0e8', plant: '#2e4a32', pot: '#6a5a4a', paper: '#d8ccb0', skinPaint: '#cfc6b4',
};
// ---------- the Seer: a painted, bodyless figure. Her C3 spec plus hair and cracks added here.
export const SEER: C3 = {
  id: 'seer', name: 'THE SEER', skin: '#cfc6b4', height: 2.3, hunch: 0.08, armL: 1.22, fingerL: 1.35, legL: 1.0, thin: 0.9,
  eyes: 'glow', mouth: 'none', teeth: 0, veins: false, ribs: false, claws: '#7a1a18', dress: 'ghost', ragC: '#5a463c',
  scar: false, glowC: '#ff2a1e', veinC: '#7a1a18',
};
// she has no feet: the legs fade into the dark. A soft dark card hides them, and red paint drips from her fingers.
export const Seer: React.FC<{ at?: V3; rot?: number; t: number; pose?: any; look?: [number, number]; scale?: number }> = ({ at = [0, 0, 0], rot = 0, t, pose = 'stand', look, scale = 1 }) => (
  <group position={at} rotation={[0, rot, 0]} scale={scale}>
    <Creature c={SEER} at={[0, 0, 0]} rot={0} t={t} pose={pose} look={look} seed={21} />
    {/* long black hair, hanging still */}
    <group position={[0, 2.06, 0.02]}>
      <mesh position={[0, -0.22, -0.1]} material={M('#0d0d12')}><boxGeometry args={[0.3, 0.62, 0.2]} /></mesh>
      {[-1, 1].map((k) => <mesh key={k} position={[k * 0.14, -0.26, 0.04]} material={M('#0d0d12')}><boxGeometry args={[0.07, 0.6, 0.14]} /></mesh>)}
      <mesh position={[0, 0.07, -0.02]} scale={[0.165, 0.15, 0.17]} material={M('#0d0d12')}><icosahedronGeometry args={[1, 1]} /></mesh>
    </group>
    {/* red paint on the fingers, and the dark that eats her legs */}
    <mesh position={[0, 0.3, 0]} material={M('#05060a', { op: 0.9 })}><cylinderGeometry args={[0.46, 0.8, 0.62, 10, 1, true]} /></mesh>
    {/* her own light: a cold key from the front so the painted face reads, and a red rim from behind */}
    <pointLight position={[1.1, 2.1, 1.9]} intensity={3.0} distance={7} decay={1.5} color="#b8c6ff" />
    <pointLight position={[-1.0, 1.5, -1.4]} intensity={2.6} distance={6} decay={1.6} color="#ff3a22" />
    <Halo at={[0, 1.7, 0.1]} r={0.9} c="#ff2a1e" o={0.08} t={t} seed={4} />
  </group>
);
// ---------- RED SCREEN TEXT: the signature picture of this video. Lines appear letter by letter on a canvas texture.
const texCache = new Map<string, THREE.CanvasTexture>();
export const screenTex = (lines: string[], shown: number, w = 1024, h = 768, red = true) => {
  const key = lines.join('|') + '#' + shown.toFixed(2) + (red ? 'r' : 'w');
  const hit = texCache.get(key); if (hit) return hit;
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h; const x = cv.getContext('2d')!;
  x.fillStyle = '#05060a'; x.fillRect(0, 0, w, h);
  // faint scan lines, no flicker
  x.fillStyle = 'rgba(255,255,255,0.025)'; for (let y = 0; y < h; y += 4) x.fillRect(0, y, w, 1);
  const total = lines.reduce((a, b) => a + b.length, 0); let budget = total * clamp(shown);
  x.font = 'bold 42px Georgia, serif'; x.textBaseline = 'top';
  let y = 90;
  for (const line of lines) {
    const n = Math.max(0, Math.min(line.length, Math.round(budget))); budget -= line.length;
    if (n > 0) {
      const s = line.slice(0, n);
      x.fillStyle = red ? '#ff2a1e' : '#cfe0ff'; x.shadowColor = red ? '#ff2a1e' : '#9fc0ff'; x.shadowBlur = 22;
      x.fillText(s, 70, y);
      if (n < line.length) { x.shadowBlur = 0; x.fillStyle = red ? 'rgba(255,42,30,0.75)' : 'rgba(200,220,255,0.7)'; x.fillRect(70 + x.measureText(s).width + 6, y + 4, 20, 40); }
    }
    y += 64; if (budget <= 0) break;
  }
  x.shadowBlur = 0;
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
  if (texCache.size > 90) { const k0 = texCache.keys().next().value as string; texCache.get(k0)?.dispose(); texCache.delete(k0); }
  texCache.set(key, t); return t;
};
// a CRT monitor (the old flat on the third floor) or a flat panel (the house). screen = lines of red text, typed over time.
export const Monitor: React.FC<{ at?: V3; rot?: number; t: number; lines?: string[]; typed?: number; crt?: boolean; cards?: boolean; off?: boolean; light?: number; s?: number }> = ({ at = [0, 0, 0], rot = 0, t, lines = [], typed = 1, crt = true, cards = false, off = false, light = 1, s = 1 }) => {
  const tex = off ? null : cards ? null : screenTex(lines.length ? lines : [''], typed);
  const mat = useMemo(() => off ? M(SP.screenOff) : tex ? new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }) : new THREE.MeshBasicMaterial({ color: '#6a90b8' }), [tex, off, cards]);
  const W = crt ? 0.42 : 0.52, H = crt ? 0.33 : 0.3;
  return (
    <group position={at} rotation={[0, rot, 0]} scale={s}>
      {crt ? <>
        <mesh position={[0, H / 2 + 0.06, -0.18]} material={M('#d8d2c4')}><boxGeometry args={[W + 0.16, H + 0.14, 0.42]} /></mesh>
        <mesh position={[0, 0.03, 0]} material={M('#2a2622')}><boxGeometry args={[W + 0.2, 0.06, 0.36]} /></mesh>
      </> : <>
        <mesh position={[0, H / 2 + 0.08, -0.03]} material={M('#1a1c20')}><boxGeometry args={[W + 0.06, H + 0.08, 0.04]} /></mesh>
        <mesh position={[0, 0.02, 0]} material={M('#1a1c20')}><boxGeometry args={[0.2, 0.04, 0.14]} /></mesh>
        <mesh position={[0, 0.1, 0]} material={M('#1a1c20')}><boxGeometry args={[0.04, 0.2, 0.04]} /></mesh>
      </>}
      <mesh position={[0, H / 2 + 0.06, crt ? 0.035 : -0.005]} material={mat as any}><planeGeometry args={[W, H]} /></mesh>
      {!off && light > 0 && <pointLight position={[0, H / 2 + 0.1, 0.5]} intensity={light * 1.15} distance={3.4} decay={1.8} color={cards ? '#8fd0ff' : '#ff6a4a'} />}
      {!off && <Halo at={[0, H / 2 + 0.06, 0.08]} r={0.34} c={cards ? '#5a9ad8' : '#ff2a1e'} o={0.16} t={t} seed={3} />}
    </group>
  );
};
export const Keyboard: React.FC<{ at?: V3; rot?: number }> = ({ at = [0, 0, 0], rot = 0 }) => (
  <group position={at} rotation={[0, rot, 0]}>
    <mesh material={M('#cfc8ba')}><boxGeometry args={[0.44, 0.02, 0.16]} /></mesh>
    {Array.from({ length: 4 }, (_, r) => <mesh key={r} position={[0, 0.013, -0.05 + r * 0.033]} material={M('#b8b0a2')}><boxGeometry args={[0.4 - r * 0.01, 0.008, 0.024]} /></mesh>)}
  </group>
);
export const Router: React.FC<{ at?: V3; t: number }> = ({ at = [0, 0, 0], t }) => {
  const on = Math.sin(t * 3.2) > 0 ? 1 : 0.15;   // the blinking red light: slow, never a strobe
  return (
    <group position={at}>
      <mesh material={M('#20242a')}><boxGeometry args={[0.2, 0.035, 0.14]} /></mesh>
      {[-0.05, 0, 0.05].map((x, i) => <mesh key={i} position={[x, 0.022, 0.05]} material={G(i === 1 ? SP.red : '#2a3a2a', i === 1 ? on : 0.5)}><boxGeometry args={[0.012, 0.004, 0.012]} /></mesh>)}
      <mesh position={[0.07, 0.07, -0.04]} rotation={[0, 0, -0.3]} material={M('#20242a')}><cylinderGeometry args={[0.006, 0.006, 0.12, 4]} /></mesh>
      {on > 0.5 && <Halo at={[0, 0.03, 0.06]} r={0.1} c="#ff2a1e" o={0.5} t={t} seed={9} />}
    </group>
  );
};
// ---------- a plain modern room: plaster walls, carpet or boards, a ceiling, a window with city light
export const Flat: React.FC<{ t: number; w?: number; d?: number; h?: number; wallC?: string; floorC?: string; night?: boolean; curtain?: boolean }> = ({ t, w = 6.5, d = 6, h = 2.6, wallC = SP.wall, floorC = '#5a4a38', night = true, curtain = true }) => (
  <group>
    <Floor w={w} d={d} seed={4} c={floorC} />
    <mesh position={[0, h / 2, -d / 2]} material={M(wallC)}><boxGeometry args={[w, h, 0.12]} /></mesh>
    <mesh position={[-w / 2, h / 2, 0]} material={M(wallC)}><boxGeometry args={[0.12, h, d]} /></mesh>
    <mesh position={[w / 2, h / 2, 0]} material={M(wallC)}><boxGeometry args={[0.12, h, d]} /></mesh>
    <mesh position={[0, h, 0]} rotation={[Math.PI / 2, 0, 0]} material={M(SP.ceil)}><planeGeometry args={[w, d]} /></mesh>
    {[-1, 1].map((k) => <mesh key={k} position={[k * (w / 2 - 0.06), 0.06, 0]} material={M('#cfc8ba')}><boxGeometry args={[0.04, 0.12, d]} /></mesh>)}
    {/* the window on the back wall: orange street light outside, cold night sky above */}
    <group position={[w * 0.22, h * 0.56, -d / 2 + 0.07]}>
      <mesh material={M('#2a2c30')}><boxGeometry args={[1.5, 1.15, 0.1]} /></mesh>
      <mesh position={[0, 0, 0.03]} material={G(night ? '#3a3f52' : '#8fa8c8')}><boxGeometry args={[1.36, 1.0, 0.02]} /></mesh>
      <mesh position={[0, -0.26, 0.04]} material={G(night ? '#c87a32' : '#9fb8d8', 0.9)}><boxGeometry args={[1.36, 0.42, 0.02]} /></mesh>
      <mesh position={[0, 0, 0.05]} material={M('#2a2c30')}><boxGeometry args={[0.05, 1.0, 0.03]} /></mesh>
      <mesh position={[0, 0, 0.05]} material={M('#2a2c30')}><boxGeometry args={[1.36, 0.05, 0.03]} /></mesh>
      <mesh position={[0, -0.62, 0.08]} material={M('#cfc8ba')}><boxGeometry args={[1.62, 0.07, 0.2]} /></mesh>
      {curtain && [-1, 1].map((k) => <mesh key={k} position={[k * 0.82, 0.02, 0.12]} material={M('#4a4a52')}><boxGeometry args={[0.3, 1.3, 0.06]} /></mesh>)}
      <pointLight position={[0, -0.3, 1.2]} intensity={1.6} distance={7} decay={1.6} color="#ff9a40" />
    </group>
  </group>
);
export const Desk: React.FC<{ at?: V3; rot?: number; w?: number; d?: number; h?: number; c?: string; drawers?: boolean }> = ({ at = [0, 0, 0], rot = 0, w = 1.5, d = 0.72, h = 0.74, c = SP.desk, drawers = true }) => (
  <group position={at} rotation={[0, rot, 0]}>
    <mesh position={[0, h, 0]} material={M(c)}><boxGeometry args={[w, 0.05, d]} /></mesh>
    <mesh position={[0, h - 0.1, -d / 2 + 0.03]} material={M(c)}><boxGeometry args={[w, 0.16, 0.04]} /></mesh>
    {[-1, 1].map((k) => <mesh key={k} position={[k * (w / 2 - 0.05), h / 2, 0]} material={M(SP.deskDark)}><boxGeometry args={[0.06, h, d - 0.06]} /></mesh>)}
    {drawers && <group position={[w / 2 - 0.3, h / 2 - 0.06, 0]}>
      <mesh material={M(SP.deskDark)}><boxGeometry args={[0.44, h - 0.12, d - 0.1]} /></mesh>
      {[-0.18, 0.02, 0.22].map((y, i) => <mesh key={i} position={[0, y, (d - 0.1) / 2 + 0.01]} material={M('#3a3430')}><boxGeometry args={[0.4, 0.14, 0.02]} /></mesh>)}
    </group>}
  </group>
);
export const OfficeChair: React.FC<{ at?: V3; rot?: number; t?: number }> = ({ at = [0, 0, 0], rot = 0, t = 0 }) => (
  <group position={at} rotation={[0, rot + Math.sin(t * 0.4) * 0.03, 0]}>
    <mesh position={[0, 0.05, 0]} material={M('#1e2024')}><cylinderGeometry args={[0.05, 0.06, 0.1, 6]} /></mesh>
    {Array.from({ length: 5 }, (_, i) => <group key={i} rotation={[0, (i / 5) * Math.PI * 2, 0]}><mesh position={[0, 0.04, 0.2]} material={M('#1e2024')}><boxGeometry args={[0.05, 0.03, 0.34]} /></mesh><mesh position={[0, 0.02, 0.36]} material={M('#111316')}><cylinderGeometry args={[0.03, 0.03, 0.04, 6]} /></mesh></group>)}
    <mesh position={[0, 0.28, 0]} material={M('#1e2024')}><cylinderGeometry args={[0.04, 0.04, 0.36, 6]} /></mesh>
    <mesh position={[0, 0.47, 0]} material={M('#2e3238')}><boxGeometry args={[0.46, 0.08, 0.44]} /></mesh>
    <mesh position={[0, 0.74, -0.2]} rotation={[0.12, 0, 0]} material={M('#2e3238')}><boxGeometry args={[0.44, 0.5, 0.08]} /></mesh>
  </group>
);
// cubicle farm: instanced partitions + desks, with a few detailed workstations near the camera
export const Cubicles: React.FC<{ t: number; rows?: number; cols?: number; lit?: number }> = ({ t, rows = 3, cols = 4, lit = 1 }) => {
  const parts: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const x = (c - (cols - 1) / 2) * 3.1, z = -r * 3.4;
    const near = r === 0;
    parts.push(<group key={r + '_' + c} position={[x, 0, z]}>
      <mesh position={[0, 0.72, -0.95]} material={M('#7a7f78')}><boxGeometry args={[2.7, 1.44, 0.08]} /></mesh>
      <mesh position={[-1.35, 0.72, -0.2]} material={M('#7a7f78')}><boxGeometry args={[0.08, 1.44, 1.6]} /></mesh>
      <mesh position={[0, 1.46, -0.95]} material={M('#5f6460')}><boxGeometry args={[2.72, 0.05, 0.12]} /></mesh>
      <Desk at={[0, 0, -0.5]} w={2.4} d={0.7} drawers={near} />
      <Monitor at={[0.25, 0.79, -0.72]} rot={0.1} t={t} crt={false} cards lines={[]} light={near ? 0.35 : 0} />
      {near && <Keyboard at={[0.2, 0.77, -0.35]} />}
      {near && <OfficeChair at={[0.1, 0, 0.35]} rot={Math.PI} t={t + r} />}
      {!near && <mesh position={[0.1, 0.42, 0.3]} material={M('#2e3238')}><boxGeometry args={[0.44, 0.84, 0.44]} /></mesh>}
    </group>);
  }
  return (
    <group>
      <Floor w={16} d={16} seed={7} c={SP.carpet} stone />
      <mesh position={[0, 2.7, -6]} rotation={[Math.PI / 2, 0, 0]} material={M('#d8d6d0')}><planeGeometry args={[18, 18]} /></mesh>
      {[-4, 0, 4].map((x, i) => <mesh key={i} position={[x, 2.66, -3]} material={G('#dfe6ee', 0.95)}><boxGeometry args={[1.2, 0.04, 0.3]} /></mesh>)}
      <pointLight position={[0, 2.5, -1]} intensity={4.2 * lit} distance={16} decay={1.3} color="#dfeaf8" />
      <pointLight position={[0, 2.5, -7]} intensity={2.6 * lit} distance={16} decay={1.4} color="#dfeaf8" />
      {/* window wall on the right */}
      <group position={[7.5, 0, -3]}>
        <mesh position={[0, 1.4, 0]} material={G('#6a86a8', 0.9)}><boxGeometry args={[0.06, 2.4, 12]} /></mesh>
        {Array.from({ length: 5 }, (_, i) => <mesh key={i} position={[0.05, 1.4, -5 + i * 2.4]} material={M('#3a3f46')}><boxGeometry args={[0.1, 2.5, 0.12]} /></mesh>)}
      </group>
      {parts}
    </group>
  );
};
// the ground-floor lobby: marble, two lift doors, the big potted plant, glass front
export const Lobby: React.FC<{ t: number; plantOut?: number; people?: number; morning?: boolean }> = ({ t, plantOut = 0, people = 0, morning = true }) => (
  <group>
    <Floor w={16} d={18} seed={3} c={SP.marble} stone />
    <mesh position={[0, 2.0, -7]} material={M('#4a4e55')}><boxGeometry args={[16, 4, 0.3]} /></mesh>
    {[-1, 1].map((k) => <group key={k} position={[k * 1.9, 0, -6.8]}>
      <mesh position={[0, 1.2, 0]} material={M('#8e949c', { m: 0.55, r: 0.45 })}><boxGeometry args={[2.0, 2.4, 0.12]} /></mesh>
      <mesh position={[0, 1.2, 0.07]} material={M('#2a2e34')}><boxGeometry args={[0.06, 2.3, 0.04]} /></mesh>
      <mesh position={[0, 2.55, 0.06]} material={G('#ff9a40', 0.9)}><boxGeometry args={[0.5, 0.12, 0.03]} /></mesh>
    </group>)}
    {/* the plant: it stands between the two lift doors and moves out toward the camera */}
    <group position={[0, 0, -6.4 + plantOut * 0.08]}>
      <mesh position={[0, 0.3, 0]} material={M(SP.pot)}><cylinderGeometry args={[0.42, 0.34, 0.6, 9]} /></mesh>
      <mesh position={[0, 0.58, 0]} material={M('#2a2420')}><cylinderGeometry args={[0.4, 0.4, 0.06, 9]} /></mesh>
      {Array.from({ length: 11 }, (_, i) => { const a = (i / 11) * Math.PI * 2, r = 0.1 + (i % 3) * 0.07; return (
        <group key={i} position={[Math.sin(a) * r, 0.62, Math.cos(a) * r]} rotation={[Math.cos(a) * 0.5 + sway(t, 7, 0.02, i), a, -Math.sin(a) * 0.5]}>
          <mesh position={[0, 0.38, 0]} material={M(SP.plant)}><boxGeometry args={[0.16, 0.8, 0.03]} /></mesh>
          <mesh position={[0, 0.78, 0]} rotation={[0.2, 0, 0]} material={M('#355a3a')}><boxGeometry args={[0.2, 0.42, 0.03]} /></mesh>
        </group>); })}
    </group>
    <mesh position={[-5.4, 0.5, -5.6]} material={M('#4a4038')}><boxGeometry args={[2.6, 1.0, 0.7]} /></mesh>
    <mesh position={[-5.4, 1.02, -5.6]} material={M('#6a6058')}><boxGeometry args={[2.8, 0.06, 0.9]} /></mesh>
    {/* glass front */}
    <group position={[0, 0, 7]}>
      <mesh position={[0, 1.6, 0]} material={G(morning ? '#9fb4cc' : '#2a3850', 0.75)}><boxGeometry args={[16, 3.2, 0.06]} /></mesh>
      {[-6, -2, 2, 6].map((x, i) => <mesh key={i} position={[x, 1.6, 0.05]} material={M('#3a3f46')}><boxGeometry args={[0.12, 3.3, 0.12]} /></mesh>)}
    </group>
    <mesh position={[0, 3.3, 0]} rotation={[Math.PI / 2, 0, 0]} material={M('#d8d6d0')}><planeGeometry args={[16, 18]} /></mesh>
    <pointLight position={[0, 3.0, -4]} intensity={4.6} distance={18} decay={1.3} color="#dfeaf8" />
    <pointLight position={[0, 3.0, 3]} intensity={3.4} distance={18} decay={1.4} color={morning ? '#ffd8b0' : '#8fa8c8'} />
    {people > 0 && Array.from({ length: people }, (_, i) => { const q = rng(i + 5); const id = ['rose', 'agnes', 'sam', 'terence', 'lyra', 'mira', 'elias'][i % 7]; return (
      <Person key={i} s={CAST3[id]} at={[(q() - 0.5) * 9, 0, 1 + q() * 5]} rot={Math.PI + (q() - 0.5)} t={t + i * 1.3} seed={30 + i} pose="walk" travel={false} far detail={false} />); })}
  </group>
);
// a low-poly car and lorry (used for the drive and the crash)
export const Car: React.FC<{ at?: V3; rot?: number; c?: string; crushed?: number; lights?: boolean; t?: number }> = ({ at = [0, 0, 0], rot = 0, c = SP.car, crushed = 0, lights = false, t = 0 }) => (
  <group position={at} rotation={[0, rot, 0]}>
    <mesh position={[0, 0.5, 0]} scale={[1 - crushed * 0.3, 1 - crushed * 0.2, 1]} material={M(c)}><boxGeometry args={[1.76, 0.6, 4.1]} /></mesh>
    <mesh position={[0, 0.95, -0.25]} rotation={[0, 0, crushed * 0.25]} scale={[1 - crushed * 0.45, 1 - crushed * 0.35, 1]} material={M(c)}><boxGeometry args={[1.6, 0.56, 2.1]} /></mesh>
    <mesh position={[0, 0.95, -0.25]} scale={[1 - crushed * 0.5, 1 - crushed * 0.35, 1]} material={G(crushed > 0.3 ? '#2a3038' : '#8fb0d0', 0.85)}><boxGeometry args={[1.64, 0.4, 2.0]} /></mesh>
    {[[-1, 1.5], [1, 1.5], [-1, -1.4], [1, -1.4]].map(([sx, z], i) => <mesh key={i} position={[sx * 0.84, 0.3, z]} rotation={[0, 0, Math.PI / 2]} material={M('#17181c')}><cylinderGeometry args={[0.31, 0.31, 0.2, 9]} /></mesh>)}
    {lights && <>
      {[-1, 1].map((k) => <mesh key={k} position={[k * 0.55, 0.55, 2.06]} material={G('#ffeccf')}><boxGeometry args={[0.34, 0.16, 0.04]} /></mesh>)}
      {[-1, 1].map((k) => <mesh key={'r' + k} position={[k * 0.6, 0.6, -2.06]} material={G('#d8241f')}><boxGeometry args={[0.3, 0.14, 0.04]} /></mesh>)}
      <pointLight position={[0, 0.6, 3]} intensity={2.4} distance={9} decay={1.6} color="#ffeccf" />
    </>}
  </group>
);
export const Lorry: React.FC<{ at?: V3; rot?: number; t?: number }> = ({ at = [0, 0, 0], rot = 0 }) => (
  <group position={at} rotation={[0, rot, 0]}>
    <mesh position={[0, 1.5, 3.2]} material={M(SP.lorry)}><boxGeometry args={[2.5, 2.4, 2.6]} /></mesh>
    <mesh position={[0, 2.1, 4.4]} material={G('#9fb8d0', 0.8)}><boxGeometry args={[2.3, 1.0, 0.1]} /></mesh>
    <mesh position={[0, 1.9, -1.4]} material={M('#8a8f96')}><boxGeometry args={[2.6, 2.9, 7.6]} /></mesh>
    <mesh position={[0, 0.5, 0.6]} material={M('#3a3f46')}><boxGeometry args={[2.3, 0.5, 10]} /></mesh>
    {[[-1, 3.4], [1, 3.4], [-1, -1.2], [1, -1.2], [-1, -2.6], [1, -2.6]].map(([sx, z], i) => <mesh key={i} position={[sx * 1.15, 0.52, z]} rotation={[0, 0, Math.PI / 2]} material={M('#17181c')}><cylinderGeometry args={[0.52, 0.52, 0.3, 9]} /></mesh>)}
    {[-1, 1].map((k) => <mesh key={'h' + k} position={[k * 0.9, 1.0, 4.52]} material={G('#ffeccf')}><boxGeometry args={[0.4, 0.2, 0.04]} /></mesh>)}
  </group>
);
// a city street: road, kerbs, sodium lamps, pavement, a line of flat buildings
export const Street: React.FC<{ t: number; night?: boolean; lamps?: number; len?: number }> = ({ t, night = true, lamps = 4, len = 60 }) => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} material={M(SP.road)}><planeGeometry args={[14, len]} /></mesh>
    {Array.from({ length: Math.floor(len / 4) }, (_, i) => <mesh key={i} position={[0, 0.01, -len / 2 + 1 + i * 4]} rotation={[-Math.PI / 2, 0, 0]} material={M(SP.line)}><planeGeometry args={[0.18, 2]} /></mesh>)}
    {[-1, 1].map((k) => <group key={k}>
      <mesh position={[k * 7.3, 0.07, 0]} material={M('#6a6a68')}><boxGeometry args={[0.6, 0.14, len]} /></mesh>
      <mesh position={[k * 9.5, 0.06, 0]} material={M('#55565a')}><boxGeometry args={[4, 0.12, len]} /></mesh>
      <mesh position={[k * 14, 4, -len * 0.1]} material={M('#3a3e46')}><boxGeometry args={[6, 8, len * 0.7]} /></mesh>
    </group>)}
    {Array.from({ length: lamps }, (_, i) => { const z = -len / 2 + 6 + i * (len / lamps); return (
      <group key={i} position={[7.6, 0, z]}>
        <mesh position={[0, 2.4, 0]} material={M('#44474c')}><cylinderGeometry args={[0.07, 0.09, 4.8, 6]} /></mesh>
        <mesh position={[-0.5, 4.8, 0]} rotation={[0, 0, 0.35]} material={M('#44474c')}><cylinderGeometry args={[0.06, 0.06, 1.2, 6]} /></mesh>
        <mesh position={[-0.95, 4.62, 0]} material={G(night ? '#ffb45a' : '#55585e')}><boxGeometry args={[0.5, 0.1, 0.24]} /></mesh>
        {night && i < 2 && <pointLight position={[-0.95, 4.4, 0]} intensity={3.4} distance={16} decay={1.5} color="#ff9a40" />}
        {night && <Halo at={[-0.95, 4.5, 0]} r={1.6} c="#ff9a40" o={0.24} t={t} seed={i} />}
      </group>); })}
  </group>
);
// a shop interior (off licence, supermarket, electronics): shelves, a counter, cold strip lights
export const Shop: React.FC<{ t: number; kind?: 'booze' | 'food' | 'tech'; rows?: number }> = ({ t, kind = 'booze', rows = 3 }) => {
  const col = kind === 'booze' ? ['#6a4a2a', '#2a4a3a', '#5a2a2a', '#3a3a5a'] : kind === 'food' ? ['#c85a3a', '#d8c85a', '#4a8a4a', '#d8d8d8'] : ['#2a3a4a', '#3a3a3a', '#5a5a5a', '#1a1a1a'];
  return (
    <group>
      <Floor w={14} d={16} seed={9} c="#8a8a86" stone />
      <mesh position={[0, 3.0, 0]} rotation={[Math.PI / 2, 0, 0]} material={M('#e0ddd6')}><planeGeometry args={[14, 16]} /></mesh>
      {[-3, 3].map((x, i) => <mesh key={i} position={[x, 2.96, -2]} material={G('#eef4fb', 0.95)}><boxGeometry args={[0.4, 0.05, 6]} /></mesh>)}
      <pointLight position={[0, 2.8, -1]} intensity={5.2} distance={18} decay={1.25} color="#eef4ff" />
      {Array.from({ length: rows }, (_, r) => [-1, 1].map((k) => (
        <group key={r + '_' + k} position={[k * (2.4 + r * 2.2), 0, -3]}>
          <mesh position={[0, 0.9, 0]} material={M('#9a9a96')}><boxGeometry args={[0.7, 1.8, 7]} /></mesh>
          {Array.from({ length: 4 }, (_, s) => Array.from({ length: 9 }, (_, i) => <mesh key={s + '_' + i} position={[k * 0.38, 0.4 + s * 0.42, -3 + i * 0.75]} material={M(col[(i + s) % 4])}><boxGeometry args={[0.1, 0.3, 0.6]} /></mesh>))}
        </group>)))}
      <group position={[0, 0, 3.4]}>
        <mesh position={[0, 0.48, 0]} material={M('#9a8a70')}><boxGeometry args={[3.0, 0.96, 0.7]} /></mesh>
        <mesh position={[0, 0.99, 0]} material={M('#b8a888')}><boxGeometry args={[3.2, 0.07, 0.85]} /></mesh>
        <mesh position={[-1.0, 1.12, 0]} material={M('#3a3c40')}><boxGeometry args={[0.4, 0.2, 0.3]} /></mesh>
      </group>
    </group>
  );
};
// the big house at the end of the long road (exterior)
export const BigHouse: React.FC<{ t: number; lit?: number; door?: number; car?: boolean }> = ({ t, lit = 1, door = 0, car = true }) => (
  <group>
    <Ground flat={16} c="#243026" hill={1.1} />
    <Grass t={t} n={520} area={[-16, 16, -6, 12]} clear={[[-6, 6, -8, 2]]} />
    <group position={[0, 0, -4]}>
      <mesh position={[0, 1.7, 0]} material={M('#b8b2a4')}><boxGeometry args={[11, 3.4, 7]} /></mesh>
      <mesh position={[0, 3.4, 0]} material={M('#4a4a4e')}><boxGeometry args={[11.6, 0.25, 7.6]} /></mesh>
      <group position={[0, 3.55, 0]}>
        {[-1, 1].map((k) => <mesh key={k} position={[0, 0.7, k * 1.8]} rotation={[k * 0.52, 0, 0]} material={M('#3e3e42')}><boxGeometry args={[11.6, 0.22, 4.3]} /></mesh>)}
      </group>
      <mesh position={[3.6, 4.9, -1.6]} material={M('#8a8276')}><boxGeometry args={[0.8, 2.4, 0.8]} /></mesh>
      {[[-3.4, 1.9], [3.4, 1.9]].map(([x, y], i) => <KWindow key={i} at={[x, y, 3.52]} w={1.1} h={1.2} lit={lit} t={t} seed={i + 2} light={i === 0 ? 1.2 : 0} />)}
      {[[-2.2, 4.3], [2.2, 4.3]].map(([x, y], i) => <KWindow key={'u' + i} at={[x, y, 3.52]} w={0.9} h={1.0} lit={i === 1 ? 1 : 0} t={t} seed={i + 5} light={0} />)}
      <group position={[0, 0, 3.5]}>
        <mesh position={[0, 1.2, 0.2]} material={M('#8a8276')}><boxGeometry args={[3.2, 2.6, 0.5]} /></mesh>
        <Door at={[0, 0, 0.5]} w={1.1} h={2.2} open={door} lit={1} t={t} c="#3a2e26" />
        <mesh position={[0, 2.35, 0.55]} material={G('#ffc07a', 0.95)}><boxGeometry args={[0.3, 0.16, 0.1]} /></mesh>
        <pointLight position={[0, 2.3, 1.2]} intensity={2.6} distance={9} decay={1.6} color="#ffb060" />
        <Halo at={[0, 2.35, 0.7]} r={1.1} c="#ffb060" o={0.3} t={t} seed={7} />
      </group>
    </group>
    {car && <Car at={[4.6, 0, 2.6]} rot={0.2} c="#3a4450" />}
    <mesh position={[0, 0.02, 5]} rotation={[-Math.PI / 2, 0, 0]} material={M('#3a3a38')}><planeGeometry args={[5, 14]} /></mesh>
    <Mist t={t} n={5} area={[-14, 14, -2, 12]} y={0.4} o={0.14} size={9} />
  </group>
);
// the living room of the big house
export const Living: React.FC<{ t: number; tv?: number; pizza?: boolean; lamp?: number; empty?: boolean; stain?: boolean }> = ({ t, tv = 1, pizza = false, lamp = 1, empty = false, stain = false }) => (
  <group>
    <Floor w={9} d={8} seed={5} c="#6a5440" />
    <mesh position={[0, 1.35, -4]} material={M('#8a8276')}><boxGeometry args={[9, 2.7, 0.12]} /></mesh>
    <mesh position={[-4.5, 1.35, 0]} material={M('#8a8276')}><boxGeometry args={[0.12, 2.7, 8]} /></mesh>
    <mesh position={[4.5, 1.35, 0]} material={M('#8a8276')}><boxGeometry args={[0.12, 2.7, 8]} /></mesh>
    <mesh position={[0, 2.7, 0]} rotation={[Math.PI / 2, 0, 0]} material={M('#d8d4cc')}><planeGeometry args={[9, 8]} /></mesh>
    <Rug at={[0, 0, 0.4]} w={4.2} d={2.8} c="#4a3a34" c2="#6a5a44" />
    {/* sofa */}
    <group position={[0, 0, 1.9]}>
      <mesh position={[0, 0.26, 0]} material={M(SP.sofa)}><boxGeometry args={[3.0, 0.5, 1.0]} /></mesh>
      <mesh position={[0, 0.72, -0.44]} material={M(SP.sofa)}><boxGeometry args={[3.0, 0.9, 0.24]} /></mesh>
      {[-1, 1].map((k) => <mesh key={k} position={[k * 1.38, 0.56, 0]} material={M(SP.sofa)}><boxGeometry args={[0.26, 0.6, 1.0]} /></mesh>)}
      {[-0.8, 0.8].map((x, i) => <mesh key={i} position={[x, 0.6, -0.26]} rotation={[0.3, 0, 0]} material={M('#6a635c')}><boxGeometry args={[0.6, 0.6, 0.14]} /></mesh>)}
    </group>
    {/* low table with the pizza box */}
    <group position={[0, 0, 0.5]}>
      <mesh position={[0, 0.4, 0]} material={M('#5a4636')}><boxGeometry args={[1.5, 0.06, 0.8]} /></mesh>
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sz], i) => <mesh key={i} position={[sx * 0.66, 0.2, sz * 0.32]} material={M('#4a3828')}><boxGeometry args={[0.07, 0.4, 0.07]} /></mesh>)}
      {pizza && <group position={[0, 0.44, 0]}>
        <mesh material={M('#c8bca0')}><boxGeometry args={[0.6, 0.06, 0.6]} /></mesh>
        <mesh position={[0, 0.04, -0.3]} rotation={[-0.9, 0, 0]} material={M('#c8bca0')}><boxGeometry args={[0.6, 0.02, 0.6]} /></mesh>
        <mesh position={[0, 0.035, 0]} material={M('#c88a3a')}><cylinderGeometry args={[0.25, 0.25, 0.03, 12]} /></mesh>
      </group>}
      {stain && <mesh position={[0.5, -0.38, 0.5]} rotation={[-Math.PI / 2, 0, 0]} material={M('#3a0a0c', { r: 0.2 })}><circleGeometry args={[0.42, 9]} /></mesh>}
    </group>
    {/* the television */}
    <group position={[0, 0, -3.7]}>
      <mesh position={[0, 0.3, 0]} material={M('#3a3028')}><boxGeometry args={[1.8, 0.6, 0.4]} /></mesh>
      <mesh position={[0, 1.1, 0]} material={M('#1a1c20')}><boxGeometry args={[1.9, 1.1, 0.08]} /></mesh>
      <mesh position={[0, 1.1, 0.05]} material={G(SP.tv, 0.9)}><planeGeometry args={[1.76, 0.98]} /></mesh>
      {tv > 0 && <pointLight position={[0, 1.1, 1.2]} intensity={2.2 * tv} distance={7} decay={1.5} color="#9fc0e8" />}
    </group>
    {/* one warm lamp */}
    <group position={[-3.2, 0, 1.2]}>
      <mesh position={[0, 0.5, 0]} material={M('#4a4038')}><cylinderGeometry args={[0.04, 0.12, 1.0, 6]} /></mesh>
      <mesh position={[0, 1.12, 0]} material={G('#ffc07a', 0.95)}><cylinderGeometry args={[0.2, 0.28, 0.3, 8, 1, true]} /></mesh>
      {lamp > 0 && <pointLight position={[0, 1.05, 0]} intensity={3 * lamp} distance={7} decay={1.6} color="#ffb870" />}
    </group>
    {!empty && null}
  </group>
);
// upstairs home office: desk, flat monitor, shelves, a window with the night field outside
export const HomeOffice: React.FC<{ t: number; lines?: string[]; typed?: number; off?: boolean; lamp?: number }> = ({ t, lines = [], typed = 1, off = false, lamp = 0.5 }) => (
  <group>
    <Floor w={6} d={5.4} seed={6} c="#6a5440" />
    <mesh position={[0, 1.3, -2.7]} material={M('#8a8276')}><boxGeometry args={[6, 2.6, 0.12]} /></mesh>
    <mesh position={[-3, 1.3, 0]} material={M('#8a8276')}><boxGeometry args={[0.12, 2.6, 5.4]} /></mesh>
    <mesh position={[3, 1.3, 0]} material={M('#8a8276')}><boxGeometry args={[0.12, 2.6, 5.4]} /></mesh>
    <mesh position={[0, 2.6, 0]} rotation={[Math.PI / 2, 0, 0]} material={M('#d8d4cc')}><planeGeometry args={[6, 5.4]} /></mesh>
    <group position={[-1.9, 1.45, -2.62]}>
      <mesh material={M('#3a3530')}><boxGeometry args={[1.2, 1.1, 0.1]} /></mesh>
      <mesh position={[0, 0, 0.03]} material={G('#39465f')}><boxGeometry args={[1.06, 0.96, 0.02]} /></mesh>
      <mesh position={[0, 0, 0.05]} material={M('#3a3530')}><boxGeometry args={[0.05, 0.96, 0.03]} /></mesh>
      <pointLight position={[0, -0.2, 1.0]} intensity={1.1} distance={6} decay={1.6} color="#8fa8d8" />
    </group>
    <Desk at={[0.6, 0, -2.1]} w={2.0} d={0.8} />
    <Monitor at={[0.6, 0.79, -2.3]} rot={0.05} t={t} crt={false} lines={lines} typed={typed} off={off} light={off ? 0 : 1.2} />
    <Keyboard at={[0.6, 0.77, -1.85]} />
    <OfficeChair at={[0.6, 0, -1.3]} rot={Math.PI} t={t} />
    <Shelf at={[2.3, 0, -2.5]} rot={-0.15} w={1.3} h={1.9} rows={3} seed={11} />
    {lamp > 0 && <group position={[1.55, 0.79, -2.4]}>
      <mesh material={M('#3a3530')}><cylinderGeometry args={[0.07, 0.09, 0.03, 8]} /></mesh>
      <mesh position={[0, 0.22, 0]} material={M('#3a3530')}><cylinderGeometry args={[0.02, 0.02, 0.42, 5]} /></mesh>
      <mesh position={[0.05, 0.44, 0]} rotation={[0, 0, -0.4]} material={G('#ffc07a', 0.9)}><coneGeometry args={[0.14, 0.18, 8, 1, true]} /></mesh>
      <pointLight position={[0.1, 0.4, 0.1]} intensity={2.2 * lamp} distance={5} decay={1.6} color="#ffb870" />
    </group>}
  </group>
);
// hallway + stairs + front door, seen from inside (for the doorway and the last scene)
export const Hall: React.FC<{ t: number; doorOpen?: number; lamp?: number; shape?: boolean }> = ({ t, doorOpen = 0, lamp = 1 }) => (
  <group>
    <Floor w={4.4} d={9} seed={8} c="#6a5440" />
    {[-1, 1].map((k) => <mesh key={k} position={[k * 2.2, 1.35, 0]} material={M('#9a9084')}><boxGeometry args={[0.12, 2.7, 9]} /></mesh>)}
    <mesh position={[0, 2.7, 0]} rotation={[Math.PI / 2, 0, 0]} material={M('#d8d4cc')}><planeGeometry args={[4.4, 9]} /></mesh>
    <mesh position={[0, 1.35, -4.5]} material={M('#9a9084')}><boxGeometry args={[4.4, 2.7, 0.12]} /></mesh>
    <group position={[0, 0, 4.4]}><Door at={[0, 0, 0]} w={1.1} h={2.2} open={doorOpen} lit={0} t={t} c="#3a2e26" /></group>
    <Stairs at={[1.3, 0, -1.2]} rot={Math.PI} n={10} w={1.6} rise={0.22} run={0.3} c="#5a4636" />
    {[0.5, 2.0].map((z, i) => <mesh key={i} position={[-2.1, 1.6, -z]} rotation={[0, Math.PI / 2, 0]} material={M('#3a3028')}><boxGeometry args={[0.5, 0.65, 0.04]} /></mesh>)}
    {lamp > 0 && <><mesh position={[0, 2.62, 1.2]} material={G('#ffc07a', 0.9)}><cylinderGeometry args={[0.18, 0.12, 0.16, 8]} /></mesh>
      <pointLight position={[0, 2.4, 1.2]} intensity={4.4 * lamp} distance={11} decay={1.45} color="#ffc088" /></>}
  </group>
);
// the Seer's void: black, a far red glow, floating painted canvases
export const Void: React.FC<{ t: number; canvases?: number; glow?: number }> = ({ t, canvases = 0, glow = 1 }) => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} material={M('#06070b')}><planeGeometry args={[80, 80]} /></mesh>
    <Mist t={t} n={6} area={[-10, 10, -12, 4]} y={0.6} o={0.1} c="#402028" size={10} />
    {glow > 0 && <pointLight position={[0, 2.4, 2.4]} intensity={3.4 * glow} distance={14} decay={1.6} color="#ff3a22" />}
    {Array.from({ length: canvases }, (_, i) => { const q = rng(i + 3); const x = (q() - 0.5) * 12, y = 1 + q() * 2.6, z = -3 - q() * 9; return (
      <group key={i} position={[x, y, z]} rotation={[0, (q() - 0.5) * 1.2, sway(t, 9 + i, 0.02, i)]}>
        <mesh material={M('#2a211a')}><boxGeometry args={[1.0, 1.3, 0.06]} /></mesh>
        <mesh position={[0, 0, 0.04]} material={M(SP.paper)}><boxGeometry args={[0.86, 1.16, 0.02]} /></mesh>
        <mesh position={[0, 0.1, 0.06]} material={M('#4a3a30')}><boxGeometry args={[0.3, 0.42, 0.01]} /></mesh>
        <mesh position={[0, -0.3, 0.06]} material={M('#7a1a18')}><boxGeometry args={[0.5, 0.06, 0.01]} /></mesh>
      </group>); })}
  </group>
);
// the chain wall: painted faces of the people in the chain, one lamp, used in "The Masterpiece"
export const Gallery: React.FC<{ t: number; litFace?: number; faces?: string[] }> = ({ t, litFace = -1, faces = ['ALLIE', 'HER BROTHER', 'THE WINNER', 'THE MOTHER', 'THE BOY'] }) => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} material={M('#14141a')}><planeGeometry args={[40, 30]} /></mesh>
    <mesh position={[0, 3, -4]} material={M('#241d1a')}><boxGeometry args={[18, 6, 0.2]} /></mesh>
    {faces.map((f, i) => { const x = (i - (faces.length - 1) / 2) * 2.5; const on = litFace === i; return (
      <group key={i} position={[x, 2.4, -3.85]}>
        <mesh material={M('#3a2c22')}><boxGeometry args={[1.6, 2.1, 0.1]} /></mesh>
        <mesh position={[0, 0, 0.06]} material={M(on ? '#d8ccb0' : '#5a5248')}><boxGeometry args={[1.4, 1.9, 0.02]} /></mesh>
        <mesh position={[0, 0.3, 0.08]} scale={[0.34, 0.42, 0.06]} material={M(on ? '#b8a68c' : '#4a443c')}><icosahedronGeometry args={[1, 1]} /></mesh>
        {[-1, 1].map((k) => <mesh key={k} position={[k * 0.13, 0.4, 0.13]} material={G('#0a0608')}><boxGeometry args={[0.13, 0.1, 0.02]} /></mesh>)}
        {[-1, 1].map((k) => <mesh key={'b' + k} position={[k * 0.13, 0.52, 0.13]} material={G(on ? '#5a3a2a' : '#2a221c')}><boxGeometry args={[0.16, 0.035, 0.02]} /></mesh>)}
        <mesh position={[0, 0.14, 0.13]} material={G('#1a0e10')}><boxGeometry args={[0.16, 0.05, 0.02]} /></mesh>
        <mesh position={[0, 0.26, 0.13]} material={G(on ? '#8a7054' : '#3a342c')}><boxGeometry args={[0.05, 0.12, 0.02]} /></mesh>
        <mesh position={[0, -0.6, 0.08]} material={M(on ? '#7a1a18' : '#3a2a28')}><boxGeometry args={[0.9, 0.06, 0.02]} /></mesh>
        {on && <pointLight position={[0, 0.4, 1.1]} intensity={3.2} distance={5} decay={1.6} color="#ffb070" />}
      </group>); })}
    <Mist t={t} n={4} area={[-8, 8, -4, 2]} y={0.5} o={0.12} c="#2a2228" size={8} />
  </group>
);
// a car park with marked bays (space 43)
export const CarPark: React.FC<{ t: number; cars?: number; evening?: boolean }> = ({ t, cars = 5, evening = true }) => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} material={M('#3a3a3c')}><planeGeometry args={[40, 30]} /></mesh>
    {Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[-13.5 + i * 3, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} material={M('#c8c4b0')}><planeGeometry args={[0.12, 5.2]} /></mesh>)}
    <mesh position={[0, 3.2, -11]} material={M('#55585e')}><boxGeometry args={[26, 6.4, 8]} /></mesh>
    {Array.from({ length: 6 }, (_, i) => Array.from({ length: 2 }, (_, r) => <mesh key={i + '_' + r} position={[-10 + i * 4, 2.6 + r * 2.4, -6.95]} material={G(evening && (i + r) % 3 !== 0 ? '#e0a860' : '#2a3038', 0.85)}><boxGeometry args={[1.6, 1.0, 0.06]} /></mesh>))}
    <group position={[8.5, 0, 3]}><mesh position={[0, 2.6, 0]} material={M('#44474c')}><cylinderGeometry args={[0.08, 0.1, 5.2, 6]} /></mesh><mesh position={[-0.5, 5.1, 0]} material={G('#ffb45a')}><boxGeometry args={[0.6, 0.12, 0.26]} /></mesh></group>
    {Array.from({ length: cars }, (_, i) => { const q = rng(i + 11); return <Car key={i} at={[-12 + i * 3, 0, -1.4]} rot={0} c={['#4a4e55', '#2a3a4a', '#6a3a34', '#55554a', '#3a4450'][i % 5]} />; })}
    <group position={[1.5, 0, 1.8]}>
      <mesh position={[0, 0.011, 0]} rotation={[-Math.PI / 2, 0, 0]} material={M('#d8d0b8')}><planeGeometry args={[1.1, 0.5]} /></mesh>
    </group>
    {evening && <pointLight position={[6, 6, 4]} intensity={2.6} distance={22} decay={1.5} color="#ff9a40" />}
  </group>
);
export { CAST3, Person, Creature, Night, Ground, Grass, Mist, Flakes, Halo, Floor, Table, Chair, Shelf, Stairs, Rug, Door, KWindow, BloodPool, Smoke };
