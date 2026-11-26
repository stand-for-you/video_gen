/* Scroll Kaos v0.5 - CHARACTER SHEET GENERATOR.
 *
 * Reads story/cast.json - the locked character database - and renders, for every character:
 *   - a turnaround: front, three-quarter, side, back
 *   - an expression strip: normal, scared, shocked, sad, angry, confused   (humans)
 *   - a pose strip: stand, loom, crouch, reach                             (creatures)
 *
 * This is the file that makes the consistency rule enforceable instead of aspirational: the
 * sheet is generated FROM the same definitions the scenes read, so a sheet can never drift
 * from what actually renders. Regenerate it after ANY change to a character.
 *
 *   node tools/charsheet.mjs                 # every character
 *   node tools/charsheet.mjs boy father      # just these
 */
import { build } from 'esbuild';
import puppeteer from 'puppeteer-core';
import { writeFileSync, mkdirSync, readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(here, '..');
const OUT = resolve(ROOT, 'qa/charsheet');
mkdirSync(OUT, { recursive: true });

const cast = JSON.parse(readFileSync(resolve(ROOT, 'story/cast.json'), 'utf8'));
const want = process.argv.slice(2);
const keys = Object.keys(cast).filter((k) => !k.startsWith('_')).filter((k) => !want.length || want.includes(k));

const VIEWS = [['front', 0], ['3q', -35], ['side', -90], ['back', 180]];
const EXPR = ['normal', 'scared', 'shocked', 'sad', 'angry', 'confused'];
const CPOSE = ['stand', 'loom', 'crouch_spider', 'reach'];

const entry = resolve(OUT, '_entry.ts');
writeFileSync(entry, `
import * as THREE from 'three';
import { buildStudio } from '${ROOT}/src/kits/Studio';
import { buildCast } from '${ROOT}/src/cast/Cast3D';
import { buildCreature } from '${ROOT}/src/cast/Creature3D';
import { setOutlineResolution } from '${ROOT}/src/three/toon';
(window as any).SK = { THREE, buildStudio, buildCast, buildCreature, setOutlineResolution };
`);
await build({ entryPoints: [entry], bundle: true, format: 'iife', outfile: resolve(OUT, '_bundle.js'),
  platform: 'browser', target: 'es2020', logLevel: 'error' });
const bundle = readFileSync(resolve(OUT, '_bundle.js'), 'utf8');

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME || '/usr/bin/google-chrome', headless: 'new',
  args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage();
page.on('pageerror', (e) => console.error('PAGE ERROR:', e.message));
await page.setContent('<style>html,body{margin:0}</style><canvas id="c"></canvas>');
await page.addScriptTag({ content: bundle });

/** One render. `mode` is 'body' (whole figure) or 'head' (shoulders up). */
const shot = async (def, opts) => {
  const { w, h, yaw, mode, expr, pose } = opts;
  await page.setViewport({ width: w, height: h });
  const url = await page.evaluate((def, w, h, yaw, mode, expr, pose) => {
    const { THREE, buildStudio, buildCast, buildCreature, setOutlineResolution } = window.SK;
    setOutlineResolution(1080);
    const canvas = document.getElementById('c');
    canvas.width = w; canvas.height = h;
    const r = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
    r.setSize(w, h, false);
    const scene = new THREE.Scene();
    scene.add(buildStudio({ size: 18 }));

    const isCreature = !!def.creature;
    const node = isCreature
      ? buildCreature({ id: 'x', kind: 'creature', creature: { ...def.creature, pose: pose || 'stand' } })
      : buildCast({ id: 'x', pose: 'stand', look: def.look, state: { ...(def.state || {}), expr: expr || 'normal' } });
    node.rotation.y = (yaw * Math.PI) / 180;
    scene.add(node);

    // frame the figure from its own measured height - never from a guessed camera distance
    const bb = new THREE.Box3().setFromObject(node);
    const H = Math.max(0.4, bb.max.y - bb.min.y);
    const cam = new THREE.PerspectiveCamera(34, w / h, 0.05, 200);
    if (mode === 'head') {
      const eye = bb.max.y - H * 0.11;
      cam.position.set(0, eye, H * 0.62);
      cam.lookAt(0, eye, 0);
    } else {
      const mid = bb.min.y + H * 0.52;
      cam.position.set(0, mid, H * 2.25);
      cam.lookAt(0, mid, 0);
    }
    r.render(scene, cam);
    const u = canvas.toDataURL('image/png');
    r.dispose();
    return u;
  }, def, w, h, yaw, mode, expr, pose);
  return Buffer.from(url.split(',')[1], 'base64');
};

for (const k of keys) {
  const def = cast[k];
  for (const [name, yaw] of VIEWS) {
    writeFileSync(resolve(OUT, `${k}_view_${name}.png`), await shot(def, { w: 420, h: 760, yaw, mode: 'body' }));
  }
  if (def.creature) {
    for (const p of CPOSE) {
      writeFileSync(resolve(OUT, `${k}_pose_${p}.png`), await shot(def, { w: 420, h: 760, yaw: -20, mode: 'body', pose: p }));
    }
  } else {
    for (const e of EXPR) {
      writeFileSync(resolve(OUT, `${k}_expr_${e}.png`), await shot(def, { w: 360, h: 360, yaw: -12, mode: 'head', expr: e }));
    }
  }
  console.log('sheet:', k, '-', def.name);
}
await browser.close();
