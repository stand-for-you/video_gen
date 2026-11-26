// Scroll Kaos v0.5 - the look. Flat 2-3 step toon fill + a solid ink silhouette.
//
// HOW THE HAND-DRAWN LINE IS MADE (read this before changing anything):
//   1. every solid body gets an inverted-hull shell (BackSide, slightly fattened) in INK.
//      That gives a clean, closed, reliable outline at any camera distance.
//   2. the whole composited frame is then warped a few pixels by a seeded turbulence
//      displacement in Post3D.tsx. That converts the clean line into the wobbly
//      pressure-varying marker line the reference has, on every edge at once.
// Do NOT try to make the wobble in the mesh shader. It is frame-coherent only in screen
// space, and the post route is deterministic across chunked renders.

import * as THREE from 'three';
import { INK, PAL } from './palette';

/** Cache so a 6-set scene does not build 400 identical materials. */
const matCache = new Map<string, THREE.Material>();
const gradCache = new Map<number, THREE.DataTexture>();

/** N-step gradient ramp for MeshToonMaterial. 2 = hard cel, 3 = one mid tone. */
export const gradientMap = (steps: 2 | 3 | 4 = 3): THREE.DataTexture => {
  const hit = gradCache.get(steps);
  if (hit) return hit;
  const data = new Uint8Array(steps);
  for (let i = 0; i < steps; i++) data[i] = Math.round((i / (steps - 1)) * 255);
  const t = new THREE.DataTexture(data, steps, 1, THREE.RedFormat);
  t.minFilter = THREE.NearestFilter;
  t.magFilter = THREE.NearestFilter;
  t.generateMipmaps = false;
  t.needsUpdate = true;
  gradCache.set(steps, t);
  return t;
};

/** Flat-shaded toon fill. This is the default material for everything solid. */
export const toon = (color: string, steps: 2 | 3 | 4 = 3, opts: { side?: THREE.Side; transparent?: boolean; opacity?: number } = {}): THREE.Material => {
  const key = `toon|${color}|${steps}|${opts.side ?? 0}|${opts.opacity ?? 1}`;
  const hit = matCache.get(key);
  if (hit) return hit;
  const m = new THREE.MeshToonMaterial({
    color: new THREE.Color(color),
    gradientMap: gradientMap(steps),
    side: opts.side ?? THREE.FrontSide,
    transparent: opts.transparent ?? (opts.opacity !== undefined && opts.opacity < 1),
    opacity: opts.opacity ?? 1,
  });
  matCache.set(key, m);
  return m;
};

/** No shading at all - sky domes, lit window panes, screens, painted signage. */
export const flat = (color: string, opts: { opacity?: number; side?: THREE.Side; depthWrite?: boolean } = {}): THREE.Material => {
  const key = `flat|${color}|${opts.opacity ?? 1}|${opts.side ?? 0}|${opts.depthWrite !== false}`;
  const hit = matCache.get(key);
  if (hit) return hit;
  const m = new THREE.MeshBasicMaterial({
    color: new THREE.Color(color),
    transparent: (opts.opacity ?? 1) < 1,
    opacity: opts.opacity ?? 1,
    side: opts.side ?? THREE.FrontSide,
    depthWrite: opts.depthWrite !== false,
  });
  matCache.set(key, m);
  return m;
};

/**
 * THE INK LINE.
 *
 * An inverted hull scaled up by a factor does not work: on a 60 m wall the factor rounds to
 * 1.0 and the line disappears, and on a thin plate it fattens the wrong axis. (That is
 * exactly what the first preview of this engine got wrong.) So the shell is pushed out
 * along the vertex normal in CLIP space by a fixed number of PIXELS, which gives the same
 * line weight on a hand 30 cm away and on a building 40 m away - which is what the
 * reference video does.
 *
 * Box, cylinder and cone geometry have split normals at the corners, so a shell built on
 * the raw normals tears open at every edge. `inked()` therefore bakes a second attribute,
 * aInkNormal = normalize(position - centroid), which is gap-free for every convex
 * primitive this engine uses.
 */
let OUTLINE_H = 1080;
const outlineMats: THREE.ShaderMaterial[] = [];
/** Call once per composition with the render height, so 1080p and 1920-tall Reels match. */
export const setOutlineResolution = (h: number) => {
  OUTLINE_H = h;
  for (const m of outlineMats) m.uniforms.uResH.value = h;
};

export const outlineMaterial = (px: number, color = INK): THREE.ShaderMaterial => {
  const key = `outline|${px}|${color}`;
  const hit = matCache.get(key) as THREE.ShaderMaterial | undefined;
  if (hit) return hit;
  const m = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    uniforms: {
      uPx: { value: px },
      uResH: { value: OUTLINE_H },
      uColor: { value: new THREE.Color(color) },
    },
    vertexShader: `
      attribute vec3 aInkNormal;
      uniform float uPx;
      uniform float uResH;
      void main() {
        // Offset in VIEW space, by exactly the world distance that covers uPx pixels at this
        // vertex's depth, then project. (The first version offset the already-projected
        // clip-space xy by a normal that had been run through the projection matrix - which
        // is not a valid direction transform, and the line silently vanished.)
        //   projectionMatrix[1][1] == 1.0 / tan(fovY / 2)
        //   world units per pixel at depth d  ==  2 * d / (uResH * projectionMatrix[1][1])
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vec3 n = normalize(normalMatrix * aInkNormal);
        float depth = max(0.0001, -mv.z);
        float perPx = 2.0 * depth / (uResH * projectionMatrix[1][1]);
        mv.xyz += n * (uPx * perPx);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      uniform vec3 uColor;
      void main() { gl_FragColor = vec4(uColor, 1.0); }`,
  });
  matCache.set(key, m);
  outlineMats.push(m);
  return m;
};

/** Add the gap-free shell normal used by outlineMaterial. */
const withInkNormal = (geo: THREE.BufferGeometry): THREE.BufferGeometry => {
  if (geo.getAttribute('aInkNormal')) return geo;
  const pos = geo.getAttribute('position') as THREE.BufferAttribute;
  geo.computeBoundingBox();
  const bb = geo.boundingBox!;
  const cx = (bb.min.x + bb.max.x) / 2, cy = (bb.min.y + bb.max.y) / 2, cz = (bb.min.z + bb.max.z) / 2;
  // normalise by half-extent first, so a 60 x 15 x 0.3 wall pushes out sideways, not forward
  const hx = Math.max(1e-4, (bb.max.x - bb.min.x) / 2);
  const hy = Math.max(1e-4, (bb.max.y - bb.min.y) / 2);
  const hz = Math.max(1e-4, (bb.max.z - bb.min.z) / 2);
  const arr = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) {
    let x = (pos.getX(i) - cx) / hx, y = (pos.getY(i) - cy) / hy, z = (pos.getZ(i) - cz) / hz;
    const l = Math.hypot(x, y, z) || 1;
    arr[i * 3] = x / l; arr[i * 3 + 1] = y / l; arr[i * 3 + 2] = z / l;
  }
  geo.setAttribute('aInkNormal', new THREE.BufferAttribute(arr, 3));
  return geo;
};

/**
 * Solid body + its ink line, as one Group.
 * `ink` is a LINE WIDTH IN PIXELS at 1080p (reference measures 2-4 px on props, 4-6 px on
 * characters and the creature). 0 turns the line off - use that for the sky dome and for
 * flat decals, which are painted ON a surface and must never be outlined.
 */
export const inked = (
  geo: THREE.BufferGeometry,
  mat: THREE.Material,
  ink = 3,
  inkColor = INK,
): THREE.Group => {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(geo, mat));
  if (ink > 0) {
    const shell = new THREE.Mesh(withInkNormal(geo), outlineMaterial(ink, inkColor));
    shell.renderOrder = -1;
    g.add(shell);
  }
  return g;
};

/** Convenience: an inked box. */
export const box = (w: number, h: number, d: number, color: string, ink = 3, steps: 2 | 3 | 4 = 3) =>
  inked(new THREE.BoxGeometry(w, h, d), toon(color, steps), ink);

/** Convenience: an inked capsule - the limb and torso primitive for the cast. */
export const capsule = (r: number, len: number, color: string, ink = 4, steps: 2 | 3 | 4 = 3) =>
  inked(new THREE.CapsuleGeometry(r, len, 4, 10), toon(color, steps), ink);

/** Convenience: an inked sphere - heads, knobs, lamps. */
export const ball = (r: number, color: string, ink = 4, steps: 2 | 3 | 4 = 3) =>
  inked(new THREE.SphereGeometry(r, 18, 14), toon(color, steps), ink);

/** A flat un-outlined plane. Decals, posters, graffiti, window glow, screens. */
export const decal = (w: number, h: number, color: string, opacity = 1) => {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), flat(color, { opacity, side: THREE.DoubleSide, depthWrite: opacity >= 1 }));
  return m;
};

/**
 * The night light rig. Two sources per room is the channel rule (quality law 4c):
 * one cool fill so nothing is ever pure black, one warm key so the room has a direction.
 * Returns a Group - add it once per scene, never per object.
 */
export const nightRig = (opts: { key?: string; fill?: string; keyPos?: [number, number, number]; keyPower?: number; fillPower?: number } = {}): THREE.Group => {
  const g = new THREE.Group();
  const amb = new THREE.AmbientLight(new THREE.Color(opts.fill ?? '#3b3a58'), opts.fillPower ?? 0.62);
  g.add(amb);
  // A hemisphere keeps ceilings and up-facing planes off pure black. The reference never
  // has an unreadable black region outside a planned dark beat (quality law 4c).
  const hemi = new THREE.HemisphereLight(new THREE.Color('#6e6a95'), new THREE.Color('#2a2838'), 0.75);
  g.add(hemi);
  const key = new THREE.DirectionalLight(new THREE.Color(opts.key ?? PAL.lampWarm), opts.keyPower ?? 2.4);
  const p = opts.keyPos ?? [4, 6, 3];
  key.position.set(p[0], p[1], p[2]);
  g.add(key);
  // A dim rim from behind keeps a dark silhouette off a dark wall.
  const rim = new THREE.DirectionalLight(new THREE.Color('#8d9ad6'), 0.75);
  rim.position.set(-p[0], p[1] * 0.6, -p[2]);
  g.add(rim);
  return g;
};

/** A warm street-lamp pool: the glow card plus the point light that sells it. */
export const lampPool = (x: number, y: number, z: number, radius = 3.2, color = PAL.lampWarm): THREE.Group => {
  const g = new THREE.Group();
  const l = new THREE.PointLight(new THREE.Color(color), 2.2, radius * 3.2, 2);
  l.position.set(x, y, z);
  g.add(l);
  const pool = decal(radius * 2, radius * 2, color, 0.17);
  pool.rotation.x = -Math.PI / 2;
  pool.position.set(x, 0.02, z);
  g.add(pool);
  return g;
};

export { THREE };
