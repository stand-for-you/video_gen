import React, { useMemo } from 'react';
import * as THREE from 'three';
import { M, G, PAL, rng, sway, noise1, V3, flick } from './core';
// ===== WORLD: night environment, ground, sky, mist, snow, rain of ash. Fixed engine file.
// LIGHT LAW: dark night fog (FogExp2) + cool blue directional moonlight + low blue ambient/hemisphere.
// Warm orange light only comes from windows, torches, candles and fire (their own point lights).
export type Env = { sky?: string; fog?: string; density?: number; moon?: V3; moonI?: number; moonC?: string; amb?: number; ambC?: string; hemi?: number; indoor?: boolean; disc?: V3 | null; discR?: number; discC?: string; stars?: boolean; rim?: number; fill?: number };
// LIGHT LAW (v0.5): the KEY moonlight comes from the FRONT side of the picture, so faces are always readable;
// a dim blue fill from the other side and a back rim keep people separate from the dark. Night comes from the blue tint,
// the fog and the vignette, NEVER from a black picture. Warm orange light only from windows, fire, torches and candles.
export const Night: React.FC<Env & { t: number }> = ({ t, sky = PAL.sky, fog = PAL.fog, density = 0.04, moon = [-9, 13, 10], moonI = 2.1, moonC = PAL.moon, amb = 0.55, ambC = PAL.amb, hemi = 0.8, indoor = false, disc = [-34, 30, -100], discR = 7, discC = PAL.moonDisc, stars = true, rim = 0.75, fill = 0.5 }) => (
  <>
    <color attach="background" args={[sky]} />
    <fogExp2 attach="fog" args={[fog, density]} />
    <ambientLight intensity={amb} color={ambC} />
    <hemisphereLight args={[indoor ? '#4a5a7a' : '#6a82b8', '#121620', hemi]} />
    <directionalLight position={moon} intensity={moonI} color={moonC} />
    <directionalLight position={[-moon[0], Math.abs(moon[1]) * 0.5, -moon[2] * 0.6]} intensity={(rim + fill) * 0.65} color="#7e97d8" />
    {!indoor && disc && <MoonDisc at={disc} r={discR} c={discC} t={t} />}
    {!indoor && stars && <Stars t={t} />}
  </>
);
export const MoonDisc: React.FC<{ at: V3; r: number; c: string; t: number }> = ({ at, r, c, t }) => (
  <group position={at}>
    <mesh material={G(c, 1, false)}><icosahedronGeometry args={[r, 3]} /></mesh>
    <sprite scale={[r * 9, r * 9, 1]}><spriteMaterial map={softTex()} color={c} transparent opacity={0.24 + 0.02 * Math.sin(t * 0.7)} depthWrite={false} fog={false} /></sprite>
  </group>
);
export const Stars: React.FC<{ t: number; n?: number }> = ({ t, n = 260 }) => {
  const g = useMemo(() => { const q = rng(77); const a = new Float32Array(n * 3); for (let i = 0; i < n; i++) { const th = q() * Math.PI * 2, ph = 0.12 + q() * 1.2, R = 190; a[i * 3] = Math.cos(th) * Math.cos(ph) * R; a[i * 3 + 1] = Math.sin(ph) * R; a[i * 3 + 2] = Math.sin(th) * Math.cos(ph) * R; } const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(a, 3)); return geo; }, [n]);
  const m = useMemo(() => new THREE.PointsMaterial({ color: '#c8d4ff', size: 0.9, sizeAttenuation: true, fog: false, transparent: true, opacity: 0.7 }), []);
  m.opacity = 0.55 + 0.15 * Math.sin(t * 1.3);
  return <points geometry={g} material={m} />;
};
// low-poly ground: displaced plane, flat shaded. flat = radius around (0,0) kept level for people and buildings.
export const Ground: React.FC<{ c?: string; size?: number; seg?: number; hill?: number; flat?: number; seed?: number; y?: number; at?: V3 }> = ({ c = PAL.ground, size = 160, seg = 70, hill = 1.6, flat = 9, seed = 3, y = 0, at = [0, 0, 0] }) => {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(size, size, seg, seg); g.rotateX(-Math.PI / 2); const p = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i); const r = Math.hypot(x, z); const k = Math.min(1, Math.max(0, (r - flat) / 14)); p.setY(i, (noise1(x * 0.11, seed) * 0.6 + noise1(z * 0.13, seed + 1) * 0.6 + noise1((x + z) * 0.37, seed + 2) * 0.12) * hill * k + noise1(x * 1.3 + z * 0.7, seed + 5) * 0.05); }
    g.computeVertexNormals(); return g;
  }, [size, seg, hill, flat, seed]);
  return <mesh geometry={geo} material={M(c)} position={[at[0], y + at[1], at[2]]} />;
};
// soft round texture for mist cards and glows (made once in code, no image file)
let SOFT: THREE.Texture | null = null;
export const softTex = () => {
  if (SOFT) return SOFT; const cv = document.createElement('canvas'); cv.width = cv.height = 128; const x = cv.getContext('2d')!;
  const gr = x.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.45, 'rgba(255,255,255,0.45)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = gr; x.fillRect(0, 0, 128, 128); SOFT = new THREE.CanvasTexture(cv); return SOFT;
};
const MistMat = new Map<string, THREE.MeshBasicMaterial>();
const mistM = (c: string, o: number) => { const k = c + o.toFixed(2); let m = MistMat.get(k); if (!m) { m = new THREE.MeshBasicMaterial({ map: softTex(), color: c, transparent: true, opacity: o, depthWrite: false, fog: true }); MistMat.set(k, m); } return m; };
// drifting ground mist: soft cards that slide slowly (wind), always moving
export const Mist: React.FC<{ t: number; n?: number; area?: [number, number, number, number]; y?: number; c?: string; o?: number; size?: number; seed?: number; speed?: number }> = ({ t, n = 7, area = [-20, 20, -30, 6], y = 0.6, c = '#8c9cb0', o = 0.17, size = 8, seed = 5, speed = 0.35 }) => {
  const q = useMemo(() => { const r = rng(seed); return Array.from({ length: n }, () => [r(), r(), r(), r()]); }, [n, seed]);
  const W = area[1] - area[0];
  return <group>{q.map(([a, b, cc, d], i) => { const x = area[0] + (((a * W + t * speed * (0.6 + d)) % W) + W) % W; const z = area[2] + b * (area[3] - area[2]); return <mesh key={i} position={[x, y + cc * 1.4, z]} material={mistM(c, o * (0.6 + 0.4 * Math.sin(t * 0.3 + i)))}><planeGeometry args={[size * (0.7 + d), size * 0.42 * (0.7 + cc)]} /></mesh>; })}</group>;
};
// falling snow or ash (points). kind 'snow' drifts down and sideways, 'ash' glows and rises slowly near fire.
export const Flakes: React.FC<{ t: number; n?: number; box?: [number, number, number, number, number, number]; kind?: 'snow' | 'ash' | 'dust'; size?: number; seed?: number }> = ({ t, n = 320, box = [-14, 14, 0, 10, -18, 8], kind = 'snow', size, seed = 9 }) => {
  const base = useMemo(() => { const q = rng(seed); return Array.from({ length: n }, () => [q(), q(), q(), q()]); }, [n, seed]);
  const geo = useMemo(() => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3)); return g; }, [n]);
  const mat = useMemo(() => new THREE.PointsMaterial({ color: kind === 'ash' ? '#ffb070' : kind === 'dust' ? '#d8c8a0' : '#dfe6f2', size: size ?? (kind === 'snow' ? 0.07 : 0.045), transparent: true, opacity: kind === 'snow' ? 0.85 : 0.7, depthWrite: false, map: softTex(), alphaTest: 0.02 }), [kind, size]);
  const a = (geo.attributes.position as THREE.BufferAttribute).array as Float32Array;
  const [x0, x1, y0, y1, z0, z1] = box; const H = y1 - y0;
  base.forEach(([u, v, w, s], i) => {
    const sp = kind === 'snow' ? 0.55 + s * 0.5 : kind === 'ash' ? -(0.25 + s * 0.3) : 0.04 + s * 0.05;
    let y = y1 - (((v * H + t * sp) % H) + H) % H; if (kind === 'ash') y = y0 + (((v * H - t * sp) % H) + H) % H;
    a[i * 3] = x0 + u * (x1 - x0) + sway(t + i, 3 + s * 3, kind === 'dust' ? 0.15 : 0.35, i);
    a[i * 3 + 1] = y; a[i * 3 + 2] = z0 + w * (z1 - z0) + sway(t + i * 0.3, 4 + s * 2, 0.2, i * 2);
  });
  geo.attributes.position.needsUpdate = true;
  return <points geometry={geo} material={mat} />;
};
// wind-swayed grass: instanced low-poly blades, every blade sways every frame (secondary motion law)
export const Grass: React.FC<{ t: number; n?: number; area?: [number, number, number, number]; clear?: [number, number, number, number][]; c?: string; h?: number; wind?: number; seed?: number; ground?: (x: number, z: number) => number }> = ({ t, n = 700, area = [-16, 16, -22, 8], clear = [], c = PAL.grassTip, h = 0.45, wind = 1, seed = 4 }) => {
  const data = useMemo(() => { const q = rng(seed); const out: number[][] = []; let guard = 0; while (out.length < n && guard++ < n * 6) { const x = area[0] + q() * (area[1] - area[0]), z = area[2] + q() * (area[3] - area[2]); if (clear.some(([a, b, cc, d]) => x > a && x < b && z > cc && z < d)) continue; out.push([x, z, q() * Math.PI, 0.6 + q() * 0.8, q() * 6]); } return out; }, [n, seed, JSON.stringify(area), JSON.stringify(clear)]);
  const mesh = useMemo(() => { const g = new THREE.ConeGeometry(0.035, 1, 3, 1); g.translate(0, 0.5, 0); const m = new THREE.InstancedMesh(g, M(c), data.length); return m; }, [data, c]);
  const o = useMemo(() => new THREE.Object3D(), []);
  data.forEach(([x, z, r, s, ph], i) => { o.position.set(x, 0, z); o.rotation.set(0, r, 0); const bend = (0.18 + 0.1 * Math.sin(t * 1.7 + x * 0.45 + ph)) * wind + 0.06 * Math.sin(t * 3.1 + ph * 2); o.rotateX(bend * 0.5); o.rotateZ(bend * 0.6 * Math.cos(r)); o.scale.set(1, h * s, 1); o.updateMatrix(); mesh.setMatrixAt(i, o.matrix); });
  mesh.instanceMatrix.needsUpdate = true;
  return <primitive object={mesh} />;
};
// glow card (soft halo around a light: window, torch, candle). Additive-looking, never flickers in steps.
export const Halo: React.FC<{ at: V3; r: number; c?: string; o?: number; t?: number; seed?: number }> = ({ at, r, c = PAL.winGlow, o = 0.35, t = 0, seed = 1 }) => {
  const k = flick(t, seed, 0.18);
  return <sprite position={at} scale={[r * 2 * k, r * 2 * k, 1]}><spriteMaterial map={softTex()} color={c} transparent opacity={o * k} depthWrite={false} fog={false} /></sprite>;
};
