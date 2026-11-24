// ===== SCROLL KAOS RIG: poses and motion for every character (no more statues).
// Units = the character's own units (adult about 3040 tall, ground y = 0, up is negative y).
// The rig moves the pelvis, bends legs/arms with 2-bone IK (feet land exactly on floors and stair steps),
// leans the upper body and turns/tilts/nods the head. Scenes pass a Motion; p = progress in cycles (e.g. f / 30).

export type XY = [number, number];
export type Rig = {
  pelvis: XY;                 // pelvis position (figure coords). Standing = [0, -1540 * legK]
  lean: number;               // upper-body lean in degrees, + = toward the facing direction
  ankles: [XY, XY];           // [leg 0, leg 1] ankle targets: x RELATIVE to the pelvis x (plus that leg's hip offset), y absolute
  toes: [number, number];     // foot angle in degrees (+ = toes up)
  hands: [XY | null, XY | null]; // wrist targets in UPPER-BODY coords (shoulders y -2470, pelvis y -1560), null = hang
  swing: [number, number];    // arm swing in degrees (+ = forward) when the hand target is null
  bend: [number, number];     // elbow bend in degrees when hanging
  turn?: number; tilt?: number; nod?: number; // head (turn adds to the view's turn)
  rot?: number;               // whole-body rotation (lying down), the pelvis lands on the origin
  jitter?: number;            // trembling amount
  handsFront?: boolean;       // draw the arms in front of the face (cover face, recoil)
};
// leg 0 = left leg in front view / far leg in three-quarter view; leg 1 = right leg / near leg
export type MotionType =
  | 'still' | 'idle' | 'walk' | 'run' | 'climbUp' | 'climbDown' | 'sit' | 'sitFloor' | 'crouch' | 'kneel' | 'lie' | 'headDown'
  | 'reach' | 'point' | 'knock' | 'cover' | 'recoil' | 'lookBack' | 'tremble' | 'carry' | 'peek'
  | 'supine' | 'supineDead';
export type Motion = {
  type: MotionType;
  p?: number;        // progress in cycles (1 cycle = 2 steps). Default f / 30
  stride?: number;   // walk/run step length (default 470 walk, 760 run)
  rise?: number;     // stair step height (default 190)
  run?: number;      // stair step depth (default 300)
  seat?: number;     // chair seat height (default 820)
  travel?: boolean;  // walk/run/climb: move along the path (default true). false = in place (camera follows)
  target?: XY;       // reach/point target in upper-body coords
  head?: -1 | 1;     // supine only: which way the head points (-1 = left, default). NOT tied to facing,
                     // so a character on a bed never flips end-for-end between shots.
};

const TAU = Math.PI * 2;
const sm = (t: number) => { const c = Math.max(0, Math.min(1, t)); return c * c * (3 - 2 * c); };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// two-bone IK from joint A toward target T; dir = side (+x / -x) the middle joint (knee/elbow) points to
export const ik = (A: XY, T: XY, l1: number, l2: number, dir: number, down = false): { mid: XY; end: XY } => {
  const dx = T[0] - A[0], dy = T[1] - A[1];
  let d = Math.hypot(dx, dy) || 1;
  d = Math.max(Math.abs(l1 - l2) + 1, Math.min(l1 + l2 - 0.5, d));
  const a = Math.atan2(dy, dx);
  const b = Math.acos(Math.max(-1, Math.min(1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d))));
  const m1: XY = [A[0] + l1 * Math.cos(a + b), A[1] + l1 * Math.sin(a + b)];
  const m2: XY = [A[0] + l1 * Math.cos(a - b), A[1] + l1 * Math.sin(a - b)];
  const mid = down ? (m1[1] + (m1[0] - m2[0]) * (dir || 0) * 0.15 >= m2[1] ? m1 : m2) : (m1[0] - m2[0]) * (dir || 1) >= 0 ? m1 : m2;
  return { mid, end: [A[0] + d * Math.cos(a), A[1] + d * Math.sin(a)] };
};

// F = facing (+1 right, -1 left, 0 = toward the camera). legK = leg length factor (kids). f = frame (for breathing).
export const motionRig = (m: Motion | undefined, F: number, legK = 1, f = 0): Rig => {
  const P0 = -1540 * legK, A0 = -150 * legK;
  const k = F || 0, kk = F || 1;
  const breathe = Math.sin(f / 14);
  const base: Rig = { pelvis: [0, P0], lean: 0, ankles: k ? [[k * 30, A0], [-k * 50, A0]] : [[-6, A0], [6, A0]], toes: [0, 0], hands: [null, null], swing: [0, 0], bend: [8, 8] };
  if (!m || m.type === 'still') return base;
  const p = m.p ?? f / 30;
  const u = ((p % 1) + 1) % 1, n = Math.floor(p);
  const travel = m.travel !== false;
  const idle: Rig = { ...base, pelvis: [0, P0 + breathe * 6], lean: Math.sin(f / 37) * 0.8, swing: [Math.sin(f / 23) * 2, -Math.sin(f / 23) * 2], bend: [10, 14], tilt: Math.sin(f / 41) * 1.6 };
  switch (m.type) {
    case 'idle': return idle;
    case 'tremble': return { ...idle, jitter: 7, bend: [40, 40], lean: -4, swing: [10, 10], nod: 6 };
    case 'lookBack': return { ...idle, turn: -1.1 * kk, lean: -2, swing: [-6, 6] };
    case 'walk':
    case 'run': {
      const run = m.type === 'run';
      const S = (m.stride ?? (run ? 760 : 470)) * legK, lift = (run ? 320 : 120) * legK;
      const half = u < 0.5, s = half ? u / 0.5 : (u - 0.5) / 0.5;
      const swingFoot = (x0: number, x1: number, t: number): [number, number, number] =>
        [lerp(x0, x1, sm(t)), A0 - lift * Math.sin(Math.PI * t), t < 0.5 ? lerp(-30, 0, t * 2) : lerp(0, 18, (t - 0.5) * 2)];
      let l0: [number, number, number], l1: [number, number, number];
      if (half) { l0 = [2 * S * n, A0, 0]; l1 = swingFoot(2 * S * n - S, 2 * S * n + S, s); }
      else { l1 = [2 * S * n + S, A0, 0]; l0 = swingFoot(2 * S * n, 2 * S * n + 2 * S, s); }
      if (!k) { // facing the camera: step in place
        const st = (x: [number, number, number]) => [x[1] < A0 - 1 ? x[1] : A0, x[2]] as [number, number];
        const a = st(l0), b = st(l1);
        return { ...base, pelvis: [0, P0 + 18 * Math.cos(TAU * 2 * u)], ankles: [[-6, a[0]], [6, b[0]]], toes: [0, 0], swing: [8 * Math.cos(TAU * u), -8 * Math.cos(TAU * u)], bend: [16, 16], nod: 2 };
      }
      const px = S * 2 * p - S * 0.5;
      const off = travel ? 0 : px;
      const bob = run ? -70 * Math.abs(Math.sin(TAU * u)) - 30 : 24 * Math.cos(TAU * 2 * u) - 8;
      const arm = (run ? 40 : 22) * Math.cos(TAU * u);
      return {
        pelvis: [(px - off) * k, P0 + bob * legK], lean: run ? 13 : 3,
        ankles: [[(l0[0] - px) * k, l0[1]], [(l1[0] - px) * k, l1[1]]], toes: [l0[2], l1[2]],
        hands: [null, null], swing: [-arm, arm], bend: run ? [90, 90] : [14 + Math.max(0, -arm) * 0.5, 14 + Math.max(0, arm) * 0.5], nod: run ? 4 : 1,
      };
    }
    case 'climbUp':
    case 'climbDown': {
      // stairs: footfall j sits on tread j at x = j*D + D/2, height j*R (j = 0 is the floor before step 1). Origin = stair base.
      const up = m.type === 'climbUp';
      const R = (m.rise ?? 190) * (up ? 1 : -1), D = m.run ?? 300;
      const foot = (j: number): [number, number] => [j * D + D / 2, Math.max(0, j) * R];
      const half = u < 0.5, s = half ? u / 0.5 : (u - 0.5) / 0.5;
      const swing = (j0: number, j1: number, t: number): [number, number, number] => {
        const a = foot(j0), b = foot(j1);
        const x = lerp(a[0], b[0], sm(up ? (t - 0.2) / 0.8 : t / 0.75));
        const h = lerp(a[1], b[1], sm(up ? t / 0.65 : (t - 0.3) / 0.7)) + 80 * Math.sin(Math.PI * t);
        return [x, h, up ? lerp(12, -8, t) : lerp(-8, 16, t)];
      };
      const j = 2 * n;
      let l0: [number, number, number], l1: [number, number, number];
      if (half) { const a = foot(j); l0 = [a[0], a[1], 0]; l1 = swing(j - 1, j + 1, s); }
      else { const a = foot(j + 1); l1 = [a[0], a[1], 0]; l0 = swing(j, j + 2, s); }
      const prog = 2 * p;
      const px = prog * D;
      const ph = Math.max(up ? 1480 * legK : -1e9, (up ? (prog - 1) * R : prog * R) + 1540 * legK - (up ? 60 : 50) * legK + 12 * Math.sin(TAU * 2 * u));
      const offX = travel ? 0 : px, offH = travel ? 0 : prog * R;
      const ay = (h: number) => -(h - offH) - 150 * legK;
      return {
        pelvis: [(px - offX) * kk, -(ph - offH)], lean: up ? 10 : -5,
        ankles: [[(l0[0] - px) * kk, ay(l0[1])], [(l1[0] - px) * kk, ay(l1[1])]], toes: [l0[2], l1[2]],
        hands: [null, null], swing: [-14 * Math.cos(TAU * u), 14 * Math.cos(TAU * u)], bend: [20, 20], nod: up ? 6 : 12,
      };
    }
    case 'sit': {
      const seat = (m.seat ?? 820) * legK;
      return { ...base, pelvis: [-kk * 40, -seat - 110 * legK + breathe * 4], lean: -3, ankles: [[kk * 350, A0], [kk * 400, A0]], toes: [0, 0], hands: [[kk * 330, -1560], [kk * 300, -1540]], swing: [0, 0], bend: [0, 0], tilt: Math.sin(f / 41) * 1.5 };
    }
    case 'headDown': { // sitting at a table, head resting on the folded arms (the scene draws the table at about y -1300)
      const seat = (m.seat ?? 820) * legK;
      return { ...base, pelvis: [-kk * 40, -seat - 110 * legK + breathe * 3], lean: 64, ankles: [[kk * 350, A0], [kk * 400, A0]], toes: [0, 0], hands: [[kk * 170, -2560], [kk * 330, -2470]], swing: [0, 0], bend: [0, 0], nod: 14, turn: 0.25 * kk };
    }
    case 'sitFloor':
      return { ...base, pelvis: [0, -240 * legK], lean: 14, ankles: [[kk * 640, A0], [kk * 600, A0 - 10]], toes: [10, 10], hands: [[kk * 420, -2080], [kk * 380, -2020]], swing: [0, 0], bend: [0, 0], nod: 8 };
    case 'crouch':
      return { ...base, pelvis: [-kk * 90, -820 * legK + breathe * 4], lean: 28, ankles: [[kk * 250, A0], [kk * 120, A0]], toes: [0, 0], hands: [[kk * 380, -1900], [kk * 300, -1840]], swing: [0, 0], bend: [0, 0], nod: -12 };
    case 'kneel':
      return { ...base, pelvis: [0, -880 * legK], lean: 4, ankles: [[kk * 360, A0], [-kk * 470, -100 * legK]], toes: [0, -35], hands: [[kk * 330, -1760], null], swing: [0, 4], bend: [0, 20] };
    // 'lie' is kept only so old story kits still build. It is the standing idle rig tipped on
    // its side: the arms hang out sideways, props stay in the hand and the whole figure flips
    // end-for-end with the facing. That is the "tipped statue" fault. Use 'supine'.
    case 'lie': return { ...base, rot: -90 * kk, swing: [3, 3], bend: [6, 6], pelvis: [0, P0 + breathe * 4], ankles: [[-20, A0], [20, A0]] };
    // A person actually lying on their back. Built for beds, tables and the floor.
    //   - arms rest ALONG the body, wrists by the hips (not hanging out into the air)
    //   - legs together and straight, feet relaxed apart
    //   - the head points a FIXED way (m.head), never with the facing, so a body on a bed
    //     cannot flip end-for-end between two shots of the same scene
    //   - breathing is a small chest/head motion, not the standing bob (which would slide
    //     the whole body along the bed once rotated)
    // Draw it with kits/Lying.tsx LyingPerson, which also strips props and seats the body
    // on the surface so nothing pokes through the bed.
    case 'supine':
    case 'supineDead': {
      const dead = m.type === 'supineDead';
      const br = dead ? 0 : breathe;
      // sign verified by rendering: -90 puts the head on the RIGHT, +90 on the left
      const hd = m.head === 1 ? -90 : 90;
      return {
        ...base,
        rot: hd,
        pelvis: [0, P0],
        lean: 0,
        // legs together, straight out; one foot lolls a little further than the other
        ankles: [[-26, A0 + br * 2], [30, A0]],
        toes: [dead ? 26 : 12 + br * 3, dead ? -22 : -10],
        // wrists by the hips, arms tight along the torso
        hands: [[-250, -1680 + br * 5], [250, -1660]],
        swing: [0, 0],
        bend: [12, 12],
        // the head settles back; a living body moves a little, a dead one does not
        nod: dead ? -16 : -7 + br * 2.2,
        tilt: dead ? 9 : Math.sin(f / 53) * 1.1,
        turn: dead ? 0.22 : Math.sin(f / 67) * 0.07,
      };
    }
    case 'reach': { const t = m.target ?? [kk * 760, -2320]; return { ...idle, lean: 6, hands: [null, t], swing: [-4, 0], ankles: [[kk * 120, A0], [-kk * 140, A0]] }; }
    case 'point': { const t = m.target ?? [kk * 940, -2470]; return { ...idle, lean: 2, hands: [null, t], swing: [0, 0] }; }
    case 'knock': { const tap = Math.max(0, Math.sin(TAU * p * 2)) * 60; return { ...idle, lean: 4, hands: [null, [kk * (560 + tap), -2420]], swing: [0, 0] }; }
    case 'cover': return { ...idle, lean: -3, hands: [[k * 40 - 70, -2560], [k * 40 + 70, -2560]], swing: [0, 0], nod: 10, jitter: 2, handsFront: true };
    case 'recoil': return { ...base, pelvis: [-kk * 50, P0 + 10], lean: -14, ankles: [[kk * 110, A0], [-kk * 340, A0]], toes: [0, 0], hands: [[kk * 420, -2380], [kk * 330, -2470]], swing: [0, 0], bend: [0, 0], nod: -8, jitter: 3, handsFront: true };
    case 'carry': return { ...idle, hands: [[k * 300 - 150, -1990], [k * 300 + 150, -1990]] };
    case 'peek': return { ...idle, lean: 15, pelvis: [-kk * 30, P0], hands: [null, [kk * 430, -2320]] };
  }
  return base;
};

// where the face centre ends up (figure coords, before k/gs scaling) for a rig: close-ups centre on it
export const headPos = (r: Rig, F: number, legK = 1, headX = 0, headY = -2740): XY => {
  const dy = 1560 * (1 - legK);
  const a = ((r.lean * (F || 1)) * Math.PI) / 180;
  const lx = headX, ly = headY + 1560; // relative to the upper-body pivot (0, -1560)
  let x = r.pelvis[0] + lx * Math.cos(a) - ly * Math.sin(a);
  let y = r.pelvis[1] - (-1540 * legK) + (-1560 + dy) + lx * Math.sin(a) + ly * Math.cos(a);
  if (r.rot) { const b = (r.rot * Math.PI) / 180, cx = 0, cy = -1540 * legK; const X = x - cx, Y = y - cy; x = X * Math.cos(b) - Y * Math.sin(b); y = X * Math.sin(b) + Y * Math.cos(b); }
  return [x, y];
};

// ===== stairs that match climbUp / climbDown exactly =====
// Body units, origin = the motion origin (x/y given to FullPerson), facing right (mirror with scale(-1,1) when face = -1).
// Tread j (1..n) spans x = j*run .. (j+1)*run; its top is at y = -j*rise (climbUp) or +j*rise (climbDown, origin = top landing).
// Draw them inside <g transform={`translate(${x},${y}) scale(${k * face},${k})`}> in any art style.
export const stairTreads = (type: 'climbUp' | 'climbDown', n: number, rise = 190, run = 300) =>
  Array.from({ length: n }, (_, i) => { const j = i + 1; return { x: j * run, w: run, top: type === 'climbUp' ? -j * rise : j * rise }; });
// progress for a climb of n treads over `sec` seconds starting at second t0 (frame f at 30 fps units). After the top it stops (p = n / 2).
export const climbP = (f: number, n: number, sec: number, t0 = 0) => Math.max(0, Math.min(n / 2, ((f / 30 - t0) / sec) * (n / 2)));
// where the person stands after the climb (body units): switch to idle here, never slide further
export const climbEnd = (type: 'climbUp' | 'climbDown', n: number, rise = 190, run = 300): XY => [n * run, type === 'climbUp' ? -n * rise : n * rise];
