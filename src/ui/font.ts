import { staticFile, continueRender, delayRender } from 'remotion';

/**
 * Scroll Kaos v0.5 - the type face, loaded from disk.
 *
 * v0.4 pulled fonts from Google at render time. That makes every render depend on the
 * network, and on a box behind a proxy it simply fails - which is how a 25-minute render
 * ends with fallback type on every card. The two variable files ship with the engine and
 * setup.sh copies them in, so a render never reaches for the network.
 */
let started = false;

export const loadBrandFont = (): void => {
  if (started || typeof document === 'undefined') return;
  started = true;
  const handle = delayRender('scroll-kaos font');
  const faces = [
    new FontFace('Montserrat', `url(${staticFile('fonts/Montserrat.ttf')})`, { weight: '100 900', style: 'normal' }),
    new FontFace('Montserrat', `url(${staticFile('fonts/Montserrat-Italic.ttf')})`, { weight: '100 900', style: 'italic' }),
  ];
  Promise.all(faces.map((f) => f.load().then((l) => { (document as any).fonts.add(l); })))
    .then(() => continueRender(handle))
    .catch(() => continueRender(handle));   // a missing file must not hang a render
};
