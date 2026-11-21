// Renders the app / site icon from the real 3D robot models: node scripts/icon.cjs -> app/build/icon.png (512x512)
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const esbuild = require('esbuild');
const ROOT = path.resolve(__dirname, '..');
const entry = `
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { makeBolt, makeNut } from './src/robots.js';
const S = 1024;
const r = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
r.setSize(S, S); r.setPixelRatio(1); r.setClearColor(0x000000, 0);
r.toneMapping = THREE.NeutralToneMapping; r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene();
const pm = new THREE.PMREMGenerator(r); scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture; scene.environmentIntensity = 0.6;
scene.add(new THREE.HemisphereLight(0xffffff, 0x9a8070, 0.6));
const sun = new THREE.DirectionalLight(0xfff1dc, 2.8); sun.position.set(-3, 6, 5); sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3, near: 0.5, far: 20 }); sun.shadow.normalBias = 0.02;
scene.add(sun);
const rim = new THREE.DirectionalLight(0xbfd8ff, 1.6); rim.position.set(4, 3, -3); scene.add(rim);
const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.ShadowMaterial({ opacity: 0.28 }));
floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
const bolt = makeBolt(true), nut = makeNut(true);
bolt.root.position.set(-0.5, 0.55, 0.05); bolt.root.rotation.y = 0.45; bolt.body.rotation.z = -0.08;
nut.root.position.set(0.58, 0.45, 0.25); nut.root.rotation.y = -0.4;
bolt.mag.rotation.z = 0.05;
scene.add(bolt.root, nut.root);
// a little magnetic spark between them
const spark = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.025, 8, 24), new THREE.MeshBasicMaterial({ color: 0xffe08a }));
const cam = new THREE.PerspectiveCamera(30, 1, 0.1, 50); cam.position.set(0.12, 1.5, 4.25); cam.lookAt(0.05, 0.62, 0);
r.render(scene, cam);
// compose: rounded square, warm glow, the render on top
const c = document.createElement('canvas'); c.width = c.height = S; const g = c.getContext('2d');
const R = S * 0.22; g.beginPath(); g.moveTo(R, 0); g.arcTo(S, 0, S, S, R); g.arcTo(S, S, 0, S, R); g.arcTo(0, S, 0, 0, R); g.arcTo(0, 0, S, 0, R); g.closePath(); g.clip();
const bg = g.createLinearGradient(0, 0, 0, S); bg.addColorStop(0, '#ffe7c9'); bg.addColorStop(1, '#f2a97e'); g.fillStyle = bg; g.fillRect(0, 0, S, S);
const glow = g.createRadialGradient(S * 0.5, S * 0.42, 0, S * 0.5, S * 0.42, S * 0.6); glow.addColorStop(0, 'rgba(255,255,255,0.75)'); glow.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = glow; g.fillRect(0, 0, S, S);
// faint gear behind
g.save(); g.translate(S * 0.78, S * 0.2); g.fillStyle = 'rgba(160,80,40,0.13)'; g.beginPath();
for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2, rr = i % 2 ? 150 : 185; g.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } g.closePath(); g.fill();
g.globalCompositeOperation = 'destination-out'; g.beginPath(); g.arc(0, 0, 60, 0, 7); g.fill(); g.restore();
g.drawImage(r.domElement, 0, 0);
// little sparkles of attraction between them
const star = (x, y, rr, c) => { g.fillStyle = c; g.beginPath(); for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2, q = i % 2 ? rr * 0.35 : rr; g.lineTo(x + Math.cos(a) * q, y + Math.sin(a) * q); } g.closePath(); g.fill(); };
star(S * 0.5, S * 0.38, 30, '#fff6c8'); star(S * 0.56, S * 0.30, 18, '#ffe08a'); star(S * 0.45, S * 0.29, 14, '#ffffff');
const o = document.createElement('canvas'); o.width = o.height = 512; o.getContext('2d').drawImage(c, 0, 0, 512, 512);
window.PNG = o.toDataURL('image/png'); window.DONE = true;
`;
(async () => {
  const b = await esbuild.build({ stdin: { contents: entry, resolveDir: ROOT, loader: 'js' }, bundle: true, format: 'iife', write: false, logLevel: 'error' });
  const js = b.outputFiles[0].text.replace(/<\/script/g, '<\\/script');
  const br = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await br.newPage();
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.setContent(`<!doctype html><html><body><script>${js}</script></body></html>`);
  await p.waitForFunction(() => window.DONE, null, { timeout: 120000 });
  const data = await p.evaluate(() => window.PNG);
  const out = process.argv[2] || path.join(ROOT, 'app/build/icon.png');
  fs.writeFileSync(out, Buffer.from(data.split(',')[1], 'base64'));
  console.log('wrote', out);
  await br.close();
})();
