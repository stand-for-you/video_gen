/* Scroll Kaos v0.5 - headless set/shot preview.
   Renders any kit + camera anchor + rig preset to a PNG with the same materials and the
   same rig the finished video uses, in headless Chrome WebGL2. This is how a set is
   checked BEFORE a 25-minute Remotion render.
   Usage: node tools/preview/shot_preview.mjs <shots.json> <outDir>
   shots.json = [ { "name":"a1", "kit":"CityBlock", "opts":{...}, "anchor":{...},
                   "preset":"walk_bob", "t":1.2, "dur":4, "seed":3, "w":960, "h":540 } ] */
import { build } from 'esbuild';
import puppeteer from 'puppeteer-core';
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(here, '../..');
const shotsPath = process.argv[2];
const outDir = process.argv[3] || resolve(ROOT, 'qa/preview');
mkdirSync(outDir, { recursive: true });
const shots = JSON.parse(readFileSync(shotsPath, 'utf8'));

// one bundle holding every kit builder + the rig. Cast modules are included only once
// they exist, so the environment stage can be previewed before the cast is drawn.
const have = (rel) => existsSync(resolve(ROOT, rel));
const rootPosix = ROOT.replace(/\\/g, '/');
const castImports = [
  ['buildCast', 'src/cast/Cast3D'],
  ['buildCreature', 'src/cast/Creature3D'],
  ['buildHands', 'src/cast/FPSHands'],
].filter(([, rel]) => have(rel + '.ts'));
const entry = resolve(outDir, '_entry.ts');
writeFileSync(entry, `
import * as THREE from 'three';
import { buildCityBlock } from '${rootPosix}/src/kits/CityBlock';
import { buildCarInterior } from '${rootPosix}/src/kits/CarInterior';
import { buildApartmentInterior } from '${rootPosix}/src/kits/ApartmentInterior';
import { buildRooftopBeam } from '${rootPosix}/src/kits/RooftopBeam';
import { buildStudio } from '${rootPosix}/src/kits/Studio';
import { buildAwakeHouse } from '${rootPosix}/src/kits/AwakeHouse';
${castImports.map(([n, rel]) => `import { ${n} } from '${rootPosix}/${rel}';`).join('\n')}
import { rigAt } from '${rootPosix}/src/three/rig';
import { setOutlineResolution } from '${rootPosix}/src/three/toon';
import { PAL } from '${rootPosix}/src/three/palette';
const KITS: any = { CityBlock: buildCityBlock, CarInterior: buildCarInterior,
  ApartmentInterior: buildApartmentInterior, RooftopBeam: buildRooftopBeam,
  Studio: buildStudio, AwakeHouse: buildAwakeHouse };
(window as any).SK = { THREE, KITS, rigAt, PAL, setOutlineResolution, ${castImports.map(([n]) => n).join(', ')} };
`);
await build({ entryPoints: [entry], bundle: true, format: 'iife', outfile: resolve(outDir, '_bundle.js'), platform: 'browser', target: 'es2020', logLevel: 'error' });
const bundle = readFileSync(resolve(outDir, '_bundle.js'), 'utf8');

const chromePath = process.env.CHROME
  || (existsSync('.browser') ? readFileSync('.browser', 'utf8').trim() : null)
  || (existsSync('C:/Program Files/Google/Chrome/Application/chrome.exe') ? 'C:/Program Files/Google/Chrome/Application/chrome.exe' : '/usr/bin/google-chrome');

const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: 'new',
  args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
});
const page = await browser.newPage();
page.on('pageerror', (e) => console.error('PAGE ERROR:', e.message));
page.on('console', (m) => { const t = m.text(); if (/error|ERROR|WARNING|shader|GL_/.test(t)) console.error('PAGE LOG:', t.slice(0, 600)); });
await page.setContent('<style>html,body{margin:0;background:#000}</style><canvas id="c"></canvas>');
await page.addScriptTag({ content: bundle });

for (const s of shots) {
  const w = s.w || 960, h = s.h || 540;
  await page.setViewport({ width: w, height: h });
  const dataUrl = await page.evaluate((s, w, h) => {
    const { THREE, KITS, rigAt, buildCast, buildCreature, buildHands, setOutlineResolution } = window.SK;
    // Match the finished render's line weight: 1080 is the delivery height.
    setOutlineResolution(s.inkRefH || 1080);
    const canvas = document.getElementById('c');
    canvas.width = w; canvas.height = h;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(w, h, false);
    renderer.setClearColor(0x000000, 1);
    const scene = new THREE.Scene();
    scene.add(KITS[s.kit](s.opts || {}));
    for (const a of s.actors || []) {
      const mk = a.kind === 'creature' ? buildCreature : buildCast;
      if (!mk) continue;
      const node = mk(a);
      node.position.set(...(a.at || [0, 0, 0]));
      node.rotation.y = (a.yaw || 0) * Math.PI / 180;
      scene.add(node);
    }
    const cam = new THREE.PerspectiveCamera(80, w / h, 0.05, 400);
    const st = rigAt(s.preset || 'idle_breath', s.t ?? 0, s.dur ?? 4, s.seed ?? 1, s.anchor);
    cam.position.set(...st.pos);
    cam.rotation.order = 'YXZ';
    cam.rotation.set(st.rot[0], st.rot[1], st.rot[2]);
    cam.fov = st.fov; cam.updateProjectionMatrix();
    if (s.hands && buildHands) { cam.add(buildHands(s.hands)); scene.add(cam); }
    renderer.render(scene, cam);
    const url = canvas.toDataURL('image/png');
    renderer.dispose();
    return url;
  }, s, w, h);
  writeFileSync(resolve(outDir, `${s.name}.png`), Buffer.from(dataUrl.split(',')[1], 'base64'));
  console.log('rendered', s.name);
}
await browser.close();
