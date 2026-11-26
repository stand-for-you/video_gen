// Scroll Kaos v0.5 - type system for every card and caption.
// The reference uses ONE family: a heavy geometric sans with round terminals. Montserrat is
// the closest free match and is what the engine loads; the stack below is the fallback
// order if a machine is missing it. Never introduce a second family.

export const FACE = "'Montserrat', 'Poppins', 'Nunito Sans', 'Inter', system-ui, sans-serif";

/** The card glow behind big white type - soft, dark, never a hard drop shadow. */
export const GLOW = (px = 18) => `0 0 ${px}px rgba(0,0,0,0.85), 0 ${px * 0.18}px ${px * 0.5}px rgba(0,0,0,0.6)`;

/** Caption outline. Captions sit over moving art, so they carry a real stroke, not a glow. */
export const STROKE = (px = 5) =>
  `-${px}px -${px}px 0 #15121c, ${px}px -${px}px 0 #15121c, -${px}px ${px}px 0 #15121c, ${px}px ${px}px 0 #15121c,` +
  ` 0 -${px}px 0 #15121c, 0 ${px}px 0 #15121c, -${px}px 0 0 #15121c, ${px}px 0 0 #15121c`;

/** Scale every card from the 1920-wide design so the 1080x1920 Reel matches exactly. */
export const u = (W: number) => W / 1920;

export const HEAD = { fontFamily: FACE, fontWeight: 800, letterSpacing: '-0.015em', color: '#fdfdfd' } as const;
export const KICKER = { fontFamily: FACE, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase' } as const;
export const SUB = { fontFamily: FACE, fontWeight: 800, fontStyle: 'italic' } as const;
