// Deterministic noise. Cloud chunk rendering (ci/render_part.sh) renders frame ranges in
// separate processes, so NOTHING may use Math.random(), Date.now() or React state.
// Everything that wobbles is a pure function of (frame, seed).

export const hash1 = (n: number): number => {
  let x = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
};

export const hash2 = (a: number, b: number): number => {
  let x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453123;
  return x - Math.floor(x);
};

const fade = (t: number) => t * t * (3 - 2 * t);

/** Smooth 1-D value noise in [0,1). */
export const vnoise = (x: number, seed = 0): number => {
  const i = Math.floor(x), f = x - i;
  return hash2(i, seed) * (1 - fade(f)) + hash2(i + 1, seed) * fade(f);
};

/** Smooth 1-D noise in [-1,1]. */
export const snoise = (x: number, seed = 0): number => vnoise(x, seed) * 2 - 1;

/** Layered noise - used for breath, hand sway and the ink boil. */
export const fbm = (x: number, seed = 0, oct = 3): number => {
  let a = 0.5, s = 0, n = 0;
  for (let i = 0; i < oct; i++) { s += a * snoise(x * (1 << i), seed + i * 17); n += a; a *= 0.5; }
  return s / n;
};

/** Step a continuous value onto `n` frames - used for the 2s-on-3s ink boil. */
export const onTwos = (frame: number, n = 2): number => Math.floor(frame / n);

export const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const ease = (t: number) => { const u = clamp(t, 0, 1); return u * u * (3 - 2 * u); };
export const easeOut = (t: number) => { const u = clamp(t, 0, 1); return 1 - (1 - u) * (1 - u); };
export const easeIn = (t: number) => { const u = clamp(t, 0, 1); return u * u; };
