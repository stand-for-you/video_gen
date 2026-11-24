import React from 'react';
import { AbsoluteFill } from 'remotion';
import type { Cam } from './Post';
// ============================================================================
// HUD ANNOTATION LAYER (v0.5)
// The "documentary label" language taken from the two reference videos:
//   - Herbert Solomon reel : cream pill + elbow leader line + target dot ("HAT", "GREY CLOTH",
//     "VICAR McKENZIE"), red pill for danger beats ("ALREADY BURNED", "A SCREAM").
//   - Night Protocol monster short : the same pill plus measurements ("2.7 M TALL", "REACH 1.7 M"),
//     bar meters ("COPY 100% / ANSWER 0%"), voice chips (|||.||| "COME OUTSIDE") and a watermark.
// Annotations live in SCREEN space so they stay crisp and axis-aligned, but they TRACK a world
// point through the camera, so the dot sticks to the thing it names while the camera moves.
// They are drawn ABOVE Stage, so the paper/grain/boil filters never touch them.
// ============================================================================

export const HUD = {
  ink: '#120d09',          // pill fill
  line: '#e8dcc4',         // cream line + text
  lineDim: '#bfae8e',
  danger: '#d4332a',       // red pill stroke
  dangerText: '#ff7a68',
  dangerInk: '#1c0907',
  tech: '#7fe6cf',         // teal, used by the monster-intro diagrams
  warm: '#f0a94a',
  font: 'Inter, "Helvetica Neue", Arial, sans-serif',
};

type Tone = 'cream' | 'red' | 'tech';
const toneOf = (t: Tone) =>
  t === 'red' ? { bg: HUD.dangerInk, br: HUD.danger, tx: HUD.dangerText }
  : t === 'tech' ? { bg: '#07201c', br: HUD.tech, tx: HUD.tech }
  : { bg: HUD.ink, br: HUD.line, tx: HUD.line };

export const project = (x: number, y: number, cam: Cam, W: number, H: number): [number, number] =>
  [(x - cam.fx) * cam.z + W / 2 + cam.tx, (y - cam.fy) * cam.z + H / 2 + cam.ty];

// how far a reveal has progressed: line draws 0 -> 1 over `draw` frames after `at`
const prog = (f: number, at: number, draw: number) => Math.max(0, Math.min(1, (f - at) / Math.max(1, draw)));
const eased = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

// ---------------------------------------------------------------------------
// Tag: a pill label joined to a world point by an elbow leader line.
// side: which way the pill sits from the dot. The elbow always leaves the pill
// horizontally and turns once, exactly like the reference frames.
// ---------------------------------------------------------------------------
export type TagSpec = {
  t: string;                 // label text (drawn uppercase)
  x: number; y: number;      // world point the dot sits on
  lx?: number; ly?: number;  // world point the pill sits at (defaults to up-and-right of the dot)
  tone?: Tone;
  at?: number;               // local frame the reveal starts
  draw?: number;             // frames the leader line takes to draw
  size?: number;             // text size in screen px
  dot?: boolean;             // show the target dot (off for free-floating titles)
};

export const Tag: React.FC<TagSpec & { cam: Cam; W: number; H: number; f: number }> = ({
  t, x, y, lx, ly, tone = 'cream', at = 0, draw = 7, size = 26, dot = true, cam, W, H, f,
}) => {
  const p = prog(f, at, draw);
  if (p <= 0) return null;
  const c = toneOf(tone);
  const [dx, dy] = project(x, y, cam, W, H);
  const [px, py] = project(lx ?? x + 230, ly ?? y - 260, cam, W, H);

  // pill geometry (measured, not laid out: SVG text has no reliable metrics here)
  const chw = size * 0.68, pad = size * 0.55, h = size * 1.72;
  const w = t.length * chw + pad * 2;
  const left = px > dx ? px : px - w;           // pill grows away from the dot
  const ax = px > dx ? left : left + w;         // the pill edge the line leaves from
  const ay = py;

  // elbow: out of the pill horizontally, then straight to the dot's column, then down
  const midX = ax + (dx - ax) * 0.42;
  const path = `M${ax},${ay} H${midX} V${dy} H${dx}`;
  const len = Math.abs(midX - ax) + Math.abs(dy - ay) + Math.abs(dx - midX);
  const lp = eased(Math.min(1, p * 1.45));
  const fade = eased(Math.max(0, (p - 0.45) / 0.55));

  return (
    <g>
      <path d={path} fill="none" stroke={c.br} strokeWidth={2.4} strokeLinecap="square"
        strokeDasharray={len} strokeDashoffset={len * (1 - lp)} opacity={0.92} />
      {dot && lp > 0.02 && (
        <g opacity={lp}>
          <circle cx={dx} cy={dy} r={13} fill="none" stroke={c.br} strokeWidth={2} opacity={0.45} />
          <circle cx={dx} cy={dy} r={5.5} fill={c.br} />
        </g>
      )}
      {fade > 0.01 && (
        <g opacity={fade}>
          <rect x={left} y={py - h / 2} width={w} height={h} rx={h * 0.26}
            fill={c.bg} fillOpacity={0.94} stroke={c.br} strokeWidth={2.2} />
          <text x={left + w / 2} y={py + size * 0.36} textAnchor="middle"
            fontFamily={HUD.font} fontWeight={700} fontSize={size}
            letterSpacing={size * 0.1} fill={c.tx}>{t.toUpperCase()}</text>
        </g>
      )}
    </g>
  );
};

// ---------------------------------------------------------------------------
// Measure: dashed span with arrow caps and a centred value ("2.7 M TALL", "25 M", "40 KG").
// axis 'v' measures height, 'h' measures reach/distance.
// ---------------------------------------------------------------------------
export type MeasureSpec = {
  t: string; x: number; y: number; x2: number; y2: number;
  tone?: Tone; at?: number; draw?: number; size?: number;
};

export const Measure: React.FC<MeasureSpec & { cam: Cam; W: number; H: number; f: number }> = ({
  t, x, y, x2, y2, tone = 'cream', at = 0, draw = 9, size = 22, cam, W, H, f,
}) => {
  const p = eased(prog(f, at, draw));
  if (p <= 0) return null;
  const c = toneOf(tone);
  const [ax, ay] = project(x, y, cam, W, H);
  const [bx0, by0] = project(x2, y2, cam, W, H);
  const bx = ax + (bx0 - ax) * p, by = ay + (by0 - ay) * p;
  const ang = Math.atan2(by0 - ay, bx0 - ax) * 180 / Math.PI;
  const cap = (cx: number, cy: number, rot: number) => (
    <path d="M0,0 l13,-6 l0,12 Z" fill={c.br}
      transform={`translate(${cx},${cy}) rotate(${rot})`} />
  );
  const mx = (ax + bx0) / 2, my = (ay + by0) / 2;
  const chw = size * 0.66, pad = size * 0.5, h = size * 1.6, w = t.length * chw + pad * 2;
  return (
    <g>
      <line x1={ax} y1={ay} x2={bx} y2={by} stroke={c.br} strokeWidth={2.2}
        strokeDasharray="9 7" opacity={0.9} />
      {cap(ax, ay, ang + 180)}
      {p > 0.96 && cap(bx0, by0, ang)}
      {p > 0.96 && (
        <g>
          <rect x={mx - w / 2} y={my - h / 2} width={w} height={h} rx={h * 0.26}
            fill={c.bg} fillOpacity={0.94} stroke={c.br} strokeWidth={2} />
          <text x={mx} y={my + size * 0.34} textAnchor="middle" fontFamily={HUD.font}
            fontWeight={700} fontSize={size} letterSpacing={size * 0.09} fill={c.tx}>
            {t.toUpperCase()}
          </text>
        </g>
      )}
    </g>
  );
};

// ---------------------------------------------------------------------------
// Meter: a labelled bar. Used for "COPY 100% / ANSWER 0%" and the DAY/NIGHT pair.
// Screen-space only (sx, sy are screen px) because these sit in a fixed corner.
// ---------------------------------------------------------------------------
export type MeterSpec = {
  t: string; v: number;          // v 0..1
  sx: number; sy: number; w?: number;
  tone?: Tone; at?: number; size?: number;
};

export const Meter: React.FC<MeterSpec & { f: number }> = ({
  t, v, sx, sy, w = 250, tone = 'tech', at = 0, size = 18, f,
}) => {
  const p = eased(prog(f, at, 10));
  if (p <= 0) return null;
  const c = toneOf(tone);
  const h = size * 0.74;
  return (
    <g opacity={p}>
      <text x={sx} y={sy - size * 0.55} fontFamily={HUD.font} fontWeight={700} fontSize={size}
        letterSpacing={size * 0.12} fill={c.tx}>{t.toUpperCase()}</text>
      <rect x={sx} y={sy} width={w} height={h} rx={h / 2} fill="#000" fillOpacity={0.55}
        stroke={c.br} strokeWidth={1.6} strokeOpacity={0.5} />
      <rect x={sx} y={sy} width={Math.max(0, w * v * p)} height={h} rx={h / 2} fill={c.br} />
    </g>
  );
};

// ---------------------------------------------------------------------------
// Voice: the waveform chip used whenever the creature SPEAKS a stolen voice.
// Reference frames: |||.||| "COME OUTSIDE"  /  "SWEETIE, COME OUTSIDE"  /  "DANNY? IT'S MOM".
// The bars animate, so the chip is never a frozen picture (quality law 4e).
// ---------------------------------------------------------------------------
export type VoiceSpec = {
  t: string; x: number; y: number;
  tone?: Tone; at?: number; size?: number;
};

export const Voice: React.FC<VoiceSpec & { cam: Cam; W: number; H: number; f: number }> = ({
  t, x, y, tone = 'cream', at = 0, size = 24, cam, W, H, f,
}) => {
  const p = eased(prog(f, at, 6));
  if (p <= 0) return null;
  const c = toneOf(tone);
  const [sx, sy] = project(x, y, cam, W, H);
  const label = `"${t.toUpperCase()}"`;
  const chw = size * 0.64, pad = size * 0.5, h = size * 1.7;
  const barW = size * 2.6;
  const w = label.length * chw + pad * 2 + barW;
  const bars = [0, 1, 2, 3, 4].map((i) => {
    const a = Math.abs(Math.sin((f * 0.42) + i * 1.1));
    return 0.28 + a * 0.72;
  });
  return (
    <g opacity={p}>
      <rect x={sx - w / 2} y={sy - h / 2} width={w} height={h} rx={h * 0.26}
        fill={c.bg} fillOpacity={0.94} stroke={c.br} strokeWidth={2.2} />
      {bars.map((b, i) => (
        <rect key={i} x={sx - w / 2 + pad + i * (size * 0.44)} y={sy - (h * 0.3) * b}
          width={size * 0.2} height={h * 0.6 * b} rx={size * 0.1} fill={c.tx} opacity={0.9} />
      ))}
      <text x={sx - w / 2 + pad + barW} y={sy + size * 0.35} fontFamily={HUD.font}
        fontWeight={700} fontSize={size} letterSpacing={size * 0.08} fill={c.tx}>{label}</text>
    </g>
  );
};

// ---------------------------------------------------------------------------
// Arrow: a curved flight path ("WARM AIR" / "COLD AIR" / how the voice travels).
// ---------------------------------------------------------------------------
export type ArrowSpec = {
  t?: string; x: number; y: number; x2: number; y2: number; bow?: number;
  tone?: Tone; at?: number; draw?: number; size?: number; dash?: boolean;
};

export const Arrow: React.FC<ArrowSpec & { cam: Cam; W: number; H: number; f: number }> = ({
  t, x, y, x2, y2, bow = 0.3, tone = 'tech', at = 0, draw = 10, size = 18, dash = true, cam, W, H, f,
}) => {
  const p = eased(prog(f, at, draw));
  if (p <= 0) return null;
  const c = toneOf(tone);
  const [ax, ay] = project(x, y, cam, W, H);
  const [bx, by] = project(x2, y2, cam, W, H);
  const mx = (ax + bx) / 2 + (by - ay) * bow, my = (ay + by) / 2 - (bx - ax) * bow;
  const d = `M${ax},${ay} Q${mx},${my} ${bx},${by}`;
  const len = Math.hypot(bx - ax, by - ay) * 1.3;
  const ang = Math.atan2(by - my, bx - mx) * 180 / Math.PI;
  return (
    <g>
      <path d={d} fill="none" stroke={c.br} strokeWidth={2.4}
        strokeDasharray={dash ? '10 8' : `${len}`} strokeDashoffset={dash ? 0 : len * (1 - p)}
        opacity={dash ? p * 0.9 : 0.9} />
      {p > 0.9 && <path d="M0,0 l15,-7 l0,14 Z" fill={c.br} transform={`translate(${bx},${by}) rotate(${ang})`} />}
      {t && p > 0.9 && (
        <text x={mx} y={my - size * 0.5} textAnchor="middle" fontFamily={HUD.font} fontWeight={700}
          fontSize={size} letterSpacing={size * 0.12} fill={c.tx}>{t.toUpperCase()}</text>
      )}
    </g>
  );
};

// ---------------------------------------------------------------------------
// Watermark: the faint channel mark at the foot of every Reel frame.
// ---------------------------------------------------------------------------
export const Watermark: React.FC<{ t: string; W: number; H: number; size?: number; op?: number }> = ({
  t, W, H, size = 19, op = 0.3,
}) => (
  <text x={W / 2} y={H - size * 4.6} textAnchor="middle" fontFamily={HUD.font} fontWeight={600}
    fontSize={size} letterSpacing={size * 0.42} fill={HUD.line} opacity={op}>
    {t.toUpperCase()}
  </text>
);

// ---------------------------------------------------------------------------
// The layer itself. Scene tables put an `an` array on any scene variant:
//   v.an = [{k:'tag', t:'HAT', x:540, y:300, lx:760, ly:150, tone:'cream', at:4}, ...]
// Supported k: tag | measure | meter | voice | arrow.
// ---------------------------------------------------------------------------
export type AnnotItem =
  | ({ k: 'tag' } & TagSpec)
  | ({ k: 'measure' } & MeasureSpec)
  | ({ k: 'meter' } & MeterSpec)
  | ({ k: 'voice' } & VoiceSpec)
  | ({ k: 'arrow' } & ArrowSpec);

export const AnnotLayer: React.FC<{
  items?: AnnotItem[]; cam: Cam; W: number; H: number; f: number; mark?: string;
}> = ({ items, cam, W, H, f, mark }) => {
  if ((!items || !items.length) && !mark) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute' }}>
        <defs>
          <filter id="hudshadow" x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#000" floodOpacity="0.65" />
          </filter>
        </defs>
        <g filter="url(#hudshadow)">
          {(items || []).map((a, i) => {
            if (a.k === 'tag') return <Tag key={i} {...a} cam={cam} W={W} H={H} f={f} />;
            if (a.k === 'measure') return <Measure key={i} {...a} cam={cam} W={W} H={H} f={f} />;
            if (a.k === 'meter') return <Meter key={i} {...a} f={f} />;
            if (a.k === 'voice') return <Voice key={i} {...a} cam={cam} W={W} H={H} f={f} />;
            if (a.k === 'arrow') return <Arrow key={i} {...a} cam={cam} W={W} H={H} f={f} />;
            return null;
          })}
          {mark && <Watermark t={mark} W={W} H={H} />}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
