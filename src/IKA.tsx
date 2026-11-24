import React from 'react';
import { LightSet, LIGHT_NIGHT, LIGHT_DEFAULT, PHand, Painted } from './Paint';
import { FullPerson, CloseUp, CAST } from './Cast';
import type { Spec, Expr } from './Cast';
import { RoomDefs, Wall, Floor, Window, Door, PictureFrame, Nightstand, Bed, Dust, Rug, PAL_NIGHT, LightPool } from './kits/Interior';
import type { RoomPal } from './kits/Interior';
import { CREATURES } from './kits/Monster';
import { BloodDefs } from './kits/Blood';
import { LyingPerson } from './kits/Lying';
// ===== STORY KIT: "I Know You're Awake" (v0.4 demo remake). Look kit: 1970s bedroom, moon-blue night -> grey-rose dawn,
// one red accent (the blood / the clock digits). Creature = CREATURES.waxman (hairless, eyeless, waxy, hunched, long arms and fingers).
export const NOAH_PJ: Spec = { ...CAST.noah, id: 'noahpj', top: 'tshirt', topC: '#5a6478', bottom: 'trousers', botC: '#3a4254', barefoot: true, acc: [] };
export const THING = CREATURES.waxman;
export const PAL_DAWN: RoomPal = { ...PAL_NIGHT, wall: '#6a6466', wallInk: '#7a7270', wallD: '#3a3436', trim: '#4a4040', floor: '#5a4636', floorD: '#3a2a20', wood: '#7a5a42', woodD: '#4a3424', quiltA: '#8a6070', quiltB: '#5a6a86', quiltC: '#9a8a6a', sheet: '#ddd6cc', light: '#ffd8c0', night: '#3a3040' };
export const LIGHT_DAWN = { ...LIGHT_DEFAULT, keyC: '#ffdcc4', keyA: 0.22, shade: '#6a5a72', rim: '#ffc8a0' };
export const Defs: React.FC<{ P: RoomPal }> = ({ P }) => <><RoomDefs P={P} /><BloodDefs /></>;

// the bedroom seen from the side: back wall, window (left), frames, door (right), floor. W x H frame, floorY = wall/floor line.
export const BedroomBack: React.FC<{ W: number; H: number; floorY: number; f: number; P?: RoomPal; dawn?: boolean; win?: [number, number, number, number]; door?: [number, number] | null; doorOpen?: number; doorLight?: string | null; frames?: boolean; shaft?: [number, number, number] | null; doorInside?: React.ReactNode }> = ({ W, H, floorY, f, P = PAL_NIGHT, dawn = false, win = [180, 260, 360, 420], door = [W - 560, floorY], doorOpen = 0, doorLight = '#e8b070', frames = true, shaft = null, doorInside }) => (
  <g>
    <Wall x={-300} y={-300} w={W + 600} h={floorY + 300} P={P} kind="damask" seed={4} />
    <Floor W={W} floorY={floorY} H={H} P={P} vx={W * 0.55} />
    <Rug x={W * 0.52} y={floorY + (H - floorY) * 0.55} w={W * 0.42} h={(H - floorY) * 0.5} />
    <Window x={win[0]} y={win[1]} w={win[2]} h={win[3]} f={f} P={P} shaft={shaft} moon={!dawn} outside={dawn ? <rect x={win[0]} y={win[1]} width={win[2]} height={win[3]} fill="#d8a890" opacity={0.75} /> : null} />
    {frames && <PictureFrame x={W * 0.38} y={floorY - 760} w={170} h={220} rot={-3} P={P} id="pf1"><rect x={W * 0.38} y={floorY - 760} width={170} height={220} fill="#5a6a5a" /><path d={`M${W * 0.38 + 20},${floorY - 580} L${W * 0.38 + 80},${floorY - 690} L${W * 0.38 + 150},${floorY - 580}Z`} fill="#3a4a3a" /></PictureFrame>}
    {frames && <PictureFrame x={W * 0.38 + 210} y={floorY - 700} w={130} h={160} rot={2} P={P} id="pf2"><rect x={W * 0.38 + 210} y={floorY - 700} width={130} height={160} fill="#7a6a5a" /><circle cx={W * 0.38 + 275} cy={floorY - 630} r={30} fill="#c8b090" /></PictureFrame>}
    {door && <Door x={door[0]} y={door[1]} w={340} h={740} open={doorOpen} P={P} light={doorLight} inside={doorInside} f={f} />}
    <LightPool x={win[0] + win[2] / 2} y={win[1] + win[3] / 2} rx={win[2]} ry={win[3]} c={P.light} o={dawn ? 0.5 : 0.3} />
  </g>
);
// Noah lying on his back, head on the pillow (Bed occupant). Bed is drawn at x with scale s; this sits in Bed coords.
// Was a CloseUp wrapped in rotate(-90) - the tipped-statue fault. Now the shared supine body.
// UNVERIFIED: this story kit is not the active one, so these coordinates have not been rendered.
// Check NoahLying on screen before building a video from this kit again.
export const NoahLying: React.FC<{ f: number; expr?: Expr; s?: Spec }> = ({ f, expr = 'sleepy', s = NOAH_PJ }) => (
  <LyingPerson s={s} x={205} surfaceY={-400} k={0.3} fit={640} f={f} expr={expr} head={-1} uid={`nl-${expr}`} />
);
// CLOSE / BUST in bed: Noah on the pillow, quilt up to the chest, one hand gripping the quilt edge. W x H frame.
export const NoahInBedCU: React.FC<{ W: number; H: number; f: number; expr?: Expr; P?: RoomPal; tight?: boolean; kk?: number; at?: [number, number] }> = ({ W, H, f, expr = 'sleepy', P = PAL_NIGHT, tight = false, kk, at }) => {
  const k = kk ?? (tight ? H / 760 : H / 980); const cx = at ? at[0] : W * 0.36, cy = at ? at[1] : H * 0.46; const br = Math.sin(f / 40) * 6;
  return (
    <g>
      <rect x={-200} y={-200} width={W + 400} height={H + 400} fill={P.sheet} />
      <path d={`M${cx - 520 * k},${cy - 420 * k} C${cx - 300 * k},${cy - 600 * k} ${cx + 500 * k},${cy - 560 * k} ${cx + 560 * k},${cy - 300 * k} C${cx + 600 * k},${cy + 200 * k} ${cx + 300 * k},${cy + 520 * k} ${cx - 300 * k},${cy + 500 * k} C${cx - 700 * k},${cy + 300 * k} ${cx - 700 * k},${cy - 200 * k} ${cx - 520 * k},${cy - 420 * k}Z`} fill="#e2ded6" />
      <path d={`M${cx - 400 * k},${cy - 200 * k} C${cx - 250 * k},${cy - 120 * k} ${cx - 150 * k},${cy - 260 * k} ${cx},${cy - 360 * k} M${cx - 420 * k},${cy + 240 * k} C${cx - 300 * k},${cy + 120 * k} ${cx - 200 * k},${cy + 300 * k} ${cx - 80 * k},${cy + 380 * k}`} stroke="#9a96a4" strokeWidth={8 * k} fill="none" opacity={0.6} />
      <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#0a1020" opacity={0.62} />
      {/* lint-ok: rotation - a deliberate BUST of a face on a pillow seen from above. There is no
          body to pose here: the quilt below covers it. This is framing, not a tipped-over figure. */}
      <g transform={`translate(${cx},${cy}) rotate(-78) scale(${k})`}><LightSet {...LIGHT_NIGHT}><CloseUp s={NOAH_PJ} expr={expr} f={f} turn={0.25} uid={`nib-${expr}`} /></LightSet></g>
      {/* a band of moonlight across the eyes */}
      <g style={{ mixBlendMode: 'screen' as const }}><path d={`M${-200},${cy - 40 * k} L${W + 200},${cy - 160 * k} L${W + 200},${cy + 10 * k} L${-200},${cy + 120 * k}Z`} fill="#9fc0ff" opacity={0.16} filter="url(#rm-b14)" /></g>
      {/* quilt over the chest, folds, stitching; breathing lifts it */}
      <g transform={`translate(0,${-br})`}>
        <path d={`M${cx + 330 * k},${-200} L${W + 300},${-200} L${W + 300},${H + 300} L${cx + 120 * k},${H + 300} C${cx + 300 * k},${cy + 400 * k} ${cx + 240 * k},${cy} ${cx + 330 * k},${-200}Z`} fill="url(#rm-quilt)" />
        <path d={`M${cx + 330 * k},${-200} C${cx + 240 * k},${cy} ${cx + 300 * k},${cy + 400 * k} ${cx + 120 * k},${H + 300}`} stroke="#f0e6d0" strokeWidth={44 * k} fill="none" />
        <path d={`M${cx + 330 * k},${-200} C${cx + 240 * k},${cy} ${cx + 300 * k},${cy + 400 * k} ${cx + 120 * k},${H + 300}`} stroke="#000" strokeWidth={14 * k} fill="none" opacity={0.3} transform={`translate(${26 * k},0)`} />
        <path d={`M${cx + 330 * k},${-200} L${W + 300},${-200} L${W + 300},${H + 300} L${cx + 120 * k},${H + 300}Z`} fill="#06080f" opacity={0.3} />
        {[0, 1, 2].map((i) => <path key={'s' + i} d={`M${cx + (330 + i * 30) * k},${cy - (420 - i * 300) * k} C${cx + (520 + i * 60) * k},${cy - (360 - i * 300) * k} ${cx + (700 + i * 40) * k},${cy - (300 - i * 300) * k} ${cx + (900) * k},${cy - (380 - i * 300) * k}`} stroke="#000" strokeWidth={26 * k} fill="none" opacity={0.22} filter="url(#rm-b14)" />)}
        {[0.2, 0.5, 0.8].map((t, i) => <path key={i} d={`M${cx + (380 + i * 260) * k},${-100} C${cx + (330 + i * 280) * k},${H * 0.4} ${cx + (420 + i * 250) * k},${H * 0.7} ${cx + (360 + i * 270) * k},${H + 100}`} stroke="#000" strokeWidth={30 * k} fill="none" opacity={0.18} filter="url(#rm-b14)" />)}
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#0a1426" opacity={0.35} />
      </g>
    </g>
  );
};
// Noah sitting up in bed in the morning (BUST, turned toward the wall)
export const NoahSitUp: React.FC<{ cx: number; cy: number; k: number; f: number; expr?: Expr; turn?: number }> = ({ cx, cy, k, f, expr = 'shock', turn = -0.5 }) => (
  <g transform={`translate(${cx},${cy}) scale(${k})`}><LightSet {...LIGHT_DAWN}><CloseUp s={NOAH_PJ} expr={expr} f={f} turn={turn} uid={`nsu-${expr}`} motion={{ type: 'tremble' }} /></LightSet></g>
);
// Noah standing (for size comparisons), 1.8 m = 3040 units, k 0.17
export const NoahStand: React.FC<{ f: number }> = ({ f }) => <FullPerson s={NOAH_PJ} x={0} y={0} k={0.17} f={f} view="three" face={1} expr="fear" motion={{ type: 'tremble' }} />;
export { Dust, Nightstand, Bed, FullPerson };
