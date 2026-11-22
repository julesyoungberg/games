// Renders Bolt & Nut (src/robots.js) in fancy and cheap modes to shots/robots-fancy.png and shots/robots-cheap.png.
// Usage: node wip/robots-shot.cjs   (from the project root or anywhere)
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');
const esbuild = require('esbuild');

const ROOT = path.resolve(__dirname, '..');
const entry = `
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { makeBolt, makeNut } from './src/robots.js';
const fancy = window.MODE === 'fancy';
const W = 1200, H = 800;
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setSize(W, H); renderer.setPixelRatio(1);
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);
const scene = new THREE.Scene(); scene.background = new THREE.Color(0xf3dcc0);
const pm = new THREE.PMREMGenerator(renderer);
scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
scene.add(new THREE.HemisphereLight(0xffffff, 0x8a7a70, fancy ? 0.6 : 1.25));
const sun = new THREE.DirectionalLight(0xfff4e6, fancy ? 2.2 : 1.5); sun.position.set(-3, 6, 4.5);
sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3, near: 0.5, far: 20 }); sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.02;
scene.add(sun);
const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.MeshStandardMaterial({ color: 0xf4efe4, roughness: 0.85 }));
floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
const bolt = makeBolt(fancy), nut = makeNut(fancy);
bolt.root.position.set(-0.62, 0.55, 0); bolt.root.rotation.y = 0.35;
nut.root.position.set(0.62, 0.45, 0); nut.root.rotation.y = -0.35;
scene.add(bolt.root, nut.root);
const tris = (o) => { let n = 0; o.traverse(c => { if (c.isMesh) { const g = c.geometry; n += (g.index ? g.index.count : g.attributes.position.count) / 3; } }); return Math.round(n); };
const meshes = (o) => { let n = 0; o.traverse(c => { if (c.isMesh) n++; }); return n; };
const top = (o) => { const a = []; o.traverse(c => { if (c.isMesh) { const g = c.geometry; a.push([g.type, Math.round((g.index ? g.index.count : g.attributes.position.count) / 3)]); } }); return a.sort((x, y) => y[1] - x[1]).slice(0, 8).map(x => x.join(":")).join(" "); };
window.STATS = { topB: top(bolt.root), topN: top(nut.root),  bolt: tris(bolt.root), nut: tris(nut.root), boltMeshes: meshes(bolt.root), nutMeshes: meshes(nut.root) };
const cam = new THREE.PerspectiveCamera(32, W / H, 0.1, 50);
const view = window.VIEW || 'front';
if (view === 'back') cam.position.set(-1.2, 1.6, -3.4); else if (view === 'top') cam.position.set(0, 3.2, 2.2); else cam.position.set(0.3, 1.15, 3.9);
cam.lookAt(0, 0.55, 0);
renderer.render(scene, cam);
window.DONE = true;
`;

(async () => {
  const r = await esbuild.build({ stdin: { contents: entry, resolveDir: ROOT, loader: 'js' }, bundle: true, format: 'iife', write: false, target: 'chrome110', logLevel: 'error' });
  const js = r.outputFiles[0].text.replace(/<\/script/g, '<\\/script');
  const html = (m, v) => `<!doctype html><html><body style="margin:0;background:#000"><script>window.MODE=${JSON.stringify(m)};window.VIEW=${JSON.stringify(v)};</script><script>${js}</script></body></html>`;
  fs.mkdirSync(path.join(ROOT, 'shots'), { recursive: true });
  const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const views = (process.argv[2] || 'front').split(',');
  for (const mode of ['fancy', 'cheap']) for (const view of views) {
    const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });
    page.on('console', m => { if (!/GL Driver/.test(m.text())) console.log(`[${mode}] ${m.text()}`); });
    page.on('pageerror', e => console.log(`[${mode}] ERROR ${e.message}`));
    await page.setContent(html(mode, view));
    await page.waitForFunction(() => window.DONE, null, { timeout: 120000 });
    const stats = await page.evaluate(() => window.STATS);
    const file = path.join(ROOT, 'shots', `robots-${mode}${view === 'front' ? '' : '-' + view}.png`);
    await page.screenshot({ path: file });
    console.log(mode, view, JSON.stringify(stats), '->', file);
    await page.close();
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
