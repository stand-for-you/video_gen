import { rng } from './Kit';
// ===== SMOOTH-MOTION HELPERS. Time unit f = 1/30 s (one video frame at 30 fps). NEVER step motion:
// old code used sf(f, 3) = stepped "every 3rd frame" motion. That made videos look choppy (8 fps feel). sf is now smooth.
export const sf = (f: number, _n = 1) => f;
export const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeIO = (t: number) => { const c = clamp(t); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const easeOut = (t: number) => 1 - Math.pow(1 - clamp(t), 3);
export const easeIn = (t: number) => Math.pow(clamp(t), 3);
export const smooth = (t: number) => { const c = clamp(t); return c * c * (3 - 2 * c); };
// back-out overshoot (for labels that pop in)
export const pop = (t: number) => { const c = clamp(t); const s = 1.70158; return 1 + (s + 1) * Math.pow(c - 1, 3) + s * Math.pow(c - 1, 2); };
// progress from second a to second b (f in 1/30 s), eased
export const tw = (f: number, a: number, b: number, e: (t: number) => number = easeIO) => e((f / 30 - a) / Math.max(0.001, b - a));
// slow organic drift (breathing, sway, hover): sum of two sines, smooth at any frame rate
export const drift = (f: number, period = 4, amp = 1, seed = 0) => amp * (0.7 * Math.sin((f / 30) * (Math.PI * 2) / period + seed) + 0.3 * Math.sin((f / 30) * (Math.PI * 2) / (period * 0.37) + seed * 2.1));
// smooth value noise in [-1, 1] (for flicker without jumps)
export const noise1 = (x: number, seed = 1) => { const i = Math.floor(x), t = x - i; const h = (n: number) => { const q = rng(n * 7919 + seed * 104729); return q() * 2 - 1; }; const s = t * t * (3 - 2 * t); return h(i) * (1 - s) + h(i + 1) * s; };
// candle / bulb flicker 0..1 (smooth)
export const flicker = (f: number, seed = 1, depth = 0.25) => 1 - depth * (0.5 + 0.5 * noise1(f / 7, seed)) * (0.6 + 0.4 * (0.5 + 0.5 * noise1(f / 2.3, seed + 3)));

// smooth tapered stroke as a filled outline. pts = centre line, w0 -> w1 widths.
const cr = (p: number[][], n = 10) => { const o: number[][] = []; for (let i = 0; i < p.length - 1; i++) { const p0 = p[Math.max(0, i - 1)], p1 = p[i], p2 = p[i + 1], p3 = p[Math.min(p.length - 1, i + 2)]; for (let k = 0; k < n; k++) { const t = k / n, t2 = t * t, t3 = t2 * t; o.push([0, 1].map((j) => 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3))); } } o.push(p[p.length - 1]); return o; };
export const taper = (pts: number[][], w0: number, w1: number, spikes = 0, seed = 1) => {
  const c = cr(pts); const L: number[][] = [], R: number[][] = []; const q = rng(seed);
  for (let i = 0; i < c.length; i++) {
    const a = c[Math.max(0, i - 1)], b = c[Math.min(c.length - 1, i + 1)]; let dx = b[0] - a[0], dy = b[1] - a[1]; const d = Math.hypot(dx, dy) || 1; dx /= d; dy /= d;
    const t = i / (c.length - 1); const w = (w0 + (w1 - w0) * t) / 2; const spk = spikes && i % 4 === 2 ? spikes * (0.6 + q() * 0.6) * (1 - t * 0.6) : 0;
    L.push([c[i][0] - dy * (w + spk), c[i][1] + dx * (w + spk)]); R.push([c[i][0] + dy * w, c[i][1] - dx * w]);
  }
  const f = (p: number[]) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`;
  return 'M' + L.map(f).join(' L') + ' L' + R.reverse().map(f).join(' L') + 'Z';
};
// closed shape with a jagged (hairy) outline. pts = loop of control points.
export const furry = (pts: number[][], spike: number, seed = 1, every = 3) => {
  const n = pts.length; const ext = [pts[n - 1], ...pts, pts[0], pts[1]]; const c = cr(ext, 12).slice(12, 12 + n * 12); const q = rng(seed); let cx = 0, cy = 0; pts.forEach((p) => { cx += p[0]; cy += p[1]; }); cx /= pts.length; cy /= pts.length;
  const o: string[] = [];
  c.forEach((p, i) => { let dx = p[0] - cx, dy = p[1] - cy; const d = Math.hypot(dx, dy) || 1; dx /= d; dy /= d; const k = i % every === 0 ? spike * (0.5 + q()) : 0; o.push(`${(p[0] + dx * k).toFixed(1)},${(p[1] + dy * k).toFixed(1)}`); });
  return 'M' + o.join(' L') + 'Z';
};
