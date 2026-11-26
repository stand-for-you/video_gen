// Scroll Kaos v0.5 - Studio. A neutral backdrop for CHARACTER SHEETS, not for the story.
//
// A character bible has to be rendered against something flat and even, or you end up
// judging a face by the alley lamp that happened to be behind it. This kit is a cyclorama:
// a seamless curved floor-to-wall sweep, lit three-quarter front, with a floor shadow so the
// figure is standing rather than floating.
//
// It is deliberately NOT in the story kit list: tools/build_shots.py will reject a shot that
// names it, because a neutral void is not a readable room.

import * as THREE from 'three';
import { PAL } from '../three/palette';
import { toon, flat, decal } from '../three/toon';

export type StudioOpts = {
  /** backdrop colour. Default is a LIGHT warm lilac: the ink line is near-black, so a sheet
   *  on a dark plate hides the one thing it exists to show. */
  bg?: string;
  floor?: string;
  /** metres of sweep - make it bigger for a tall creature */
  size?: number;
  /** turn the contact shadow off for a floating pose (a fall, a lift) */
  shadow?: boolean;
};

export const STUDIO_READABLE = ['cyclorama sweep', 'contact shadow', 'three-quarter key', 'cool rim'];

export const buildStudio = (o: StudioOpts = {}): THREE.Group => {
  const S = o.size ?? 14;
  const root = new THREE.Group();

  // One seamless sweep. The first build used a cove cylinder and a separate wall and left
  // black bands across the plate where they did not meet - a backdrop with a seam in it is
  // worse than no backdrop, so this is deliberately one flat wall and one flat floor,
  // both oversized well past frame.
  const bg = o.bg ?? '#b9b0cc';
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(S * 3, S * 3), toon(o.floor ?? '#8e86a4', 3));
  floor.rotation.x = -Math.PI / 2;
  root.add(floor);

  const back = new THREE.Mesh(new THREE.PlaneGeometry(S * 3, S * 3), flat(bg));
  back.position.set(0, 0, -S * 0.55);
  root.add(back);

  // a soft floor gradient so the figure is standing on something, not pasted on a swatch
  const falloff = decal(S * 3, S * 1.2, '#6e6686', 0.55);
  falloff.rotation.x = -Math.PI / 2;
  falloff.position.set(0, 0.006, -S * 0.3);
  root.add(falloff);

  // --- light: a warm three-quarter key, a cool rim, and enough fill that no face goes black
  // Even, bright, front-biased. A sheet is for judging a design, not for mood.
  root.add(new THREE.AmbientLight(new THREE.Color('#cfc9e0'), 1.5));
  root.add(new THREE.HemisphereLight(new THREE.Color('#ffffff'), new THREE.Color('#8a84a8'), 1.1));
  const key = new THREE.DirectionalLight(new THREE.Color('#fff1dc'), 1.9);
  key.position.set(3.0, 5.0, 6.0);
  root.add(key);
  const fill = new THREE.DirectionalLight(new THREE.Color('#dfe4ff'), 0.9);
  fill.position.set(-4.0, 2.5, 4.5);
  root.add(fill);

  if (o.shadow !== false) {
    const sh = decal(1.9, 1.3, '#3b3550', 0.34);
    sh.rotation.x = -Math.PI / 2;
    sh.position.set(0.1, 0.012, 0.05);
    root.add(sh);
  }
  return root;
};
