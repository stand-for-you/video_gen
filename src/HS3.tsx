import React from 'react';
import { PAL, M, G, rng, sway, ss, seg, V3 } from './k3/core';
import { Night, Ground, Grass, Mist, Flakes, Halo } from './k3/World';
import { Forest, Pine, DeadTree, Rock, Gravestone, Fence } from './k3/Nature';
import { Cottage, Street, Cobbles, Cabin, Church, Well, Window, Door } from './k3/Build';
import { Room, Floor, BrickWall, Bed, Table, Chair, Shelf, Crate, Barrel, Chain, Stairs, Rug, Fireplace, Doll, OldBook, MoonWindow } from './k3/Interior';
import { Torch, Candle, Lantern, Flame, BigFire, Smoke, Embers, BloodPool } from './k3/Fx';
import { Person, Pose, Expr, Hold } from './k3/Person';
import { Creature, CPose, HERBERT, HERBERT_LIVING } from './k3/Creature';
import { CAST3 } from './Cast3D';
// ===== STORY KIT: ETTRICK, 1578 (demo story "The Melancholy of Herbert Solomon").
// A story kit holds the places of ONE story, built from the fixed 3D kits in src/k3/. Write a new file like this for a new story,
// and keep the cast and the creature builders untouched.
export const ETT = { fog: '#16283e', night: '#101c30', torch: '#ff9a40' };
// a crowd of townspeople with torches, standing in a loose line or circle; everyone moves (breathing, small weight shifts)
export const Mob: React.FC<{ t: number; n?: number; at?: V3; spread?: number; arc?: number; r?: number; rot?: number; pose?: Pose; seed?: number; torches?: number }> = ({ t, n = 7, at = [0, 0, 0], spread = 5, arc = 0, r = 4, rot = 0, pose = 'hold', seed = 12, torches = 1 }) => {
  const q = rng(seed); const ids = ['tom', 'terence', 'mckenzie', 'agnes', 'rose', 'elias', 'dale', 'mira', 'noah'];
  return <group position={at} rotation={[0, rot, 0]}>{Array.from({ length: n }, (_, i) => {
    const u = (i + 0.5) / n; const a = arc ? (u - 0.5) * arc : 0;
    const x = arc ? Math.sin(a) * r : (u - 0.5) * spread, z = arc ? r - Math.cos(a) * r : (q() - 0.5) * 1.2;
    const id = ids[(i * 3 + seed) % ids.length]; const hold: Hold = i < 2 && torches ? 'torch' : i % 3 === 1 ? 'pitchfork' : 'none';
    return <Person key={i} s={CAST3[id]} at={[x, 0, z]} rot={arc ? -a : (q() - 0.5) * 0.4} t={t + i * 1.7} seed={seed + i} pose={i % 6 === 4 ? 'point' : pose} hold={hold === 'none' ? undefined : hold} expr={i % 3 === 0 ? 'angry' : 'fear'} detail={i < 2} far={i >= 2} />;
  })}</group>;
};
// the narrow Ettrick lane: cottages both sides, cobbles, snow, thick fog, a few lit windows
export const Lane: React.FC<{ t: number; lit?: number; snow?: boolean; fogN?: number; seed?: number }> = ({ t, lit = 1, snow = true, fogN = 8, seed = 40 }) => (
  <group>
    <Ground flat={0} hill={0.5} c="#1a1f1e" />
    <Street t={t} n={4} lit={lit} snow={snow} seed={seed} width={3.0} />
    <Forest t={t} n={10} area={[-30, 30, -40, -28]} snow={snow} />
    <Mist t={t} n={Math.min(fogN, 6)} area={[-12, 12, -28, 8]} y={0.5} o={0.18} size={9} />
    {snow && <Flakes t={t} n={200} box={[-14, 14, 0, 9, -28, 8]} />}
  </group>
);
// Herbert's cabin clearing in the pine woods
export const Clearing: React.FC<{ t: number; burn?: number; burnt?: boolean; door?: number; lit?: number; snow?: boolean }> = ({ t, burn = 0, burnt = false, door = 0, lit = 1, snow = true }) => (
  <group>
    <Ground flat={12} c="#1c2420" />
    <Cabin at={[0, 0, -1]} t={t} burn={burn} burnt={burnt} door={door} lit={lit} snow={snow} />
    <Forest t={t} n={22} area={[-20, 20, -22, 8]} clear={[[-4, 4, -5, 4]]} snow={snow} dead={0.15} />
    <Grass t={t} n={450} area={[-9, 9, -6, 7]} clear={[[-2.6, 2.6, -3.4, 1.6]]} />
    <Mist t={t} n={7} area={[-12, 12, -10, 6]} y={0.35} o={0.12} />
    {snow && <Flakes t={t} n={240} box={[-12, 12, 0, 8, -12, 8]} />}
  </group>
);
// the cellar under the house: stone floor, brick walls, chains on the wall, crates, stairs up to a lit doorway
export const Cellar: React.FC<{ t: number; candle?: V3 | null; blood?: boolean; chains?: number }> = ({ t, candle = [-1.6, 0.95, 1.2], blood = false, chains = 3 }) => (
  <group>
    <Room w={8} d={7} h={2.25} wall="brick" wallC="#4e4a44" stoneFloor t={t} window={null} beams />
    <Stairs at={[2.4, 0, 3.2]} rot={0.1} n={8} w={1.3} />
    <group position={[2.4, 1.95, 1.0]}><Door at={[0, 0, 0]} w={1.0} h={1.9} open={0.8} lit={1} t={t} /></group>
    {Array.from({ length: chains }, (_, i) => <Chain key={i} at={[-3.2 + i * 1.5, 1.75, -3.4]} t={t} seed={i + 2} />)}
    <Crate at={[3.0, 0, -1.2]} rot={0.3} /><Crate at={[2.7, 0.6, -1.3]} s={0.5} rot={-0.2} /><Barrel at={[-3.2, 0, -0.6]} s={0.9} />
    {blood && <BloodPool at={[0.2, 0, -1.4]} r={1.1} seed={4} />}
    {candle && <Candle at={candle} t={t} seed={7} light={2.2} />}
  </group>
);
// the old university library: dark shelves, a long table, one lamp, dust in the air
export const Library: React.FC<{ t: number }> = ({ t }) => (
  <group>
    <Room w={11} d={9} h={3.4} wall="plank" wallC="#4a3a2a" floorC="#54412c" t={t} window={{ x: -3.2, moon: true, w: 1.1, h: 1.6 }} beams />
    {[-4.2, -2.4, 2.4, 4.2].map((x, i) => <Shelf key={i} at={[x, 0, -4.1]} w={1.7} h={2.8} rows={5} seed={i + 3} />)}
    {[-1, 1].map((k) => <Shelf key={'s' + k} at={[k * 5.2, 0, -1 + k]} rot={-k * Math.PI / 2} w={2.4} h={2.8} rows={5} seed={k + 9} />)}
    <Table at={[0, 0, 0.6]} w={3.2} d={1.3} />
    <Chair at={[0, 0, 1.75]} rot={Math.PI} />
    <Candle at={[-1.0, 0.82, 0.5]} t={t} seed={5} light={2.6} />
    <Flakes t={t} n={90} kind="dust" box={[-4, 4, 0.4, 3, -3, 3]} size={0.03} />
  </group>
);
// the big ink drawing of Herbert on the last page of the town book (drawn in code, no image file)
export const herbertSketch = (x: CanvasRenderingContext2D, w: number, h: number) => {
  x.strokeStyle = '#2a211a'; x.lineCap = 'round'; x.lineJoin = 'round';
  const L = (a: number, b: number, c: number, d: number, k = 6) => { x.lineWidth = k; x.beginPath(); x.moveTo(a, b); x.lineTo(c, d); x.stroke(); };
  // trees leaning away
  x.lineWidth = 3; for (let i = 0; i < 7; i++) { const tx = 40 + i * 70; x.beginPath(); x.moveTo(tx, h - 40); x.quadraticCurveTo(tx + (tx < w / 2 ? -26 : 26), h / 2, tx + (tx < w / 2 ? -44 : 44), 120); x.stroke(); }
  // the tall thin man
  const cx = w / 2, top = 150;
  x.fillStyle = '#2a211a';
  x.beginPath(); x.ellipse(cx, top, 46, 58, 0, 0, Math.PI * 2); x.fill();           // bald skull
  x.fillStyle = '#d8ccb0'; x.beginPath(); x.ellipse(cx - 17, top - 8, 11, 15, 0, 0, Math.PI * 2); x.fill(); x.beginPath(); x.ellipse(cx + 17, top - 8, 11, 15, 0, 0, Math.PI * 2); x.fill();
  x.fillStyle = '#2a211a'; x.beginPath(); x.ellipse(cx - 17, top - 4, 6, 8, 0, 0, Math.PI * 2); x.fill(); x.beginPath(); x.ellipse(cx + 17, top - 4, 6, 8, 0, 0, Math.PI * 2); x.fill();
  L(cx, top + 58, cx, top + 300, 26);                                                // long thin body
  L(cx, top + 90, cx - 120, top + 250, 11); L(cx - 120, top + 250, cx - 150, top + 360, 9);   // arms like sticks
  L(cx, top + 90, cx + 120, top + 230, 11); L(cx + 120, top + 230, cx + 70, top + 60, 9);     // one bony hand over the face
  for (let i = 0; i < 5; i++) L(cx + 70 - i * 9, top + 60, cx + 52 - i * 13, top - 20 - i * 6, 5);
  L(cx, top + 300, cx - 60, top + 440, 12); L(cx, top + 300, cx + 55, top + 450, 12);
  for (let i = 0; i < 6; i++) L(cx - 10 + i * 4, top + 70 + i * 6, cx - 34 + i * 12, top + 30 + i * 3, 2.5); // veins on the head
  x.font = 'bold 30px Georgia'; x.fillStyle = '#2a211a'; x.textAlign = 'center';
  x.fillText('1578', cx - 110, h - 60); x.fillText('Herbert Solomon', cx + 60, h - 60);
};
export { HERBERT, HERBERT_LIVING, Creature, Person, CAST3, Night, Ground, Grass, Mist, Flakes, Forest, Pine, DeadTree, Rock, Gravestone, Fence, Cottage, Street, Cobbles, Cabin, Church, Well, Window, Door, Room, Bed, Table, Chair, Shelf, Crate, Barrel, Chain, Stairs, Rug, Fireplace, Doll, OldBook, MoonWindow, Torch, Candle, Lantern, Flame, BigFire, Smoke, Embers, BloodPool, Halo };
