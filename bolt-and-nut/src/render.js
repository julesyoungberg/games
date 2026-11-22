// Bolt & Nut: Three.js renderer.
// Two looks: "fancy" (GPU: PBR materials, textures, real shadows, bloom, MSAA) and "cheap" (software WebGL: Lambert, blob shadows).
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

// final colour grade: gentle S-curve, warm highlights / cool shadows, soft vignette, faint film grain
const GradeShader = {
  uniforms: { tDiffuse: { value: null }, time: { value: 0 }, vig: { value: 0.28 } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: `uniform sampler2D tDiffuse; uniform float time; uniform float vig; varying vec2 vUv;
    float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
    void main(){
      vec3 c = texture2D(tDiffuse, vUv).rgb;
      float l = dot(c, vec3(0.299, 0.587, 0.114));
      c = mix(vec3(l), c, 1.07);                                   // a touch more colour
      c = c + (c - c * c) * 0.18 * (c - 0.5) * 2.0;                 // soft S-curve
      c += mix(vec3(-0.012, 0.0, 0.02), vec3(0.02, 0.008, -0.015), smoothstep(0.2, 0.8, l)); // split tone
      vec2 d = vUv - 0.5; c *= 1.0 - vig * smoothstep(0.35, 0.95, length(d * vec2(1.15, 1.0)));
      c += (h(vUv * 913.0 + fract(time) * 37.0) - 0.5) * 0.018;    // grain
      gl_FragColor = vec4(clamp(c, 0.0, 1.0), 1.0);
    }`,
};
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { makeSurfaces, gradientTex, hallTex } from './fx.js';
import { makeBolt, makeNut } from './robots.js';
import { buildScenery } from './scenery.js';
import { groundAt, pickTarget } from './sim.js';

export const THEMES = [
  { bg: 0xf6d9b8, f1: 0xf4efe4, f2: 0xe6dfcf, side: 0xc8b49c, wall: 0xe9a48a, shelf: 0xd98f73, pipe: 0xb07a63, gear: 0xe7b99b, mover: 0xf2b84b },
  { bg: 0xcfe9df, f1: 0xeff6f1, f2: 0xdfeae4, side: 0x9fbaae, wall: 0x7fb8a6, shelf: 0x6aa592, pipe: 0x5d8f80, gear: 0xa9d3c4, mover: 0xf2b84b },
  { bg: 0xe2d6f0, f1: 0xf3eff8, f2: 0xe4ddf0, side: 0xb2a4c7, wall: 0x9d86c2, shelf: 0x8a72b3, pipe: 0x7a66a0, gear: 0xc8b8e0, mover: 0xf2b84b },
  { bg: 0xcddbe8, f1: 0xeff2f5, f2: 0xdde4eb, side: 0x9aaaba, wall: 0x6f8aa6, shelf: 0x5f7a96, pipe: 0x546b84, gear: 0xaabdd0, mover: 0xf2b84b },
  { bg: 0xf5e6b0, f1: 0xf9f4e3, f2: 0xede5cd, side: 0xc9ba8e, wall: 0xe0a94f, shelf: 0xcf9440, pipe: 0xb07f3a, gear: 0xe8cf86, mover: 0x6cc2a8 },
  { bg: 0x2a2236, f1: 0x5e5674, f2: 0x524a68, side: 0x3b3451, wall: 0x40375a, shelf: 0x4b4168, pipe: 0x342c48, gear: 0x3a3150, mover: 0xf2b84b },
  { bg: 0xbfe3f5, f1: 0xf1f8fc, f2: 0xe0eef6, side: 0x9cc1d4, wall: 0x6fa7c8, shelf: 0x5d95b8, pipe: 0x4f84a6, gear: 0x9fcbe3, mover: 0xf2b84b },
  { bg: 0xf3c1a6, f1: 0xf8eee7, f2: 0xefdfd2, side: 0xc89f8d, wall: 0xb8687a, shelf: 0xa65a6c, pipe: 0x8d4b5b, gear: 0xe3a48d, mover: 0x6cc2a8 },
  { bg: 0xe9dcc4, f1: 0xf6f0e3, f2: 0xe9e0cc, side: 0xbfa985, wall: 0xc4955e, shelf: 0xae7f4a, pipe: 0x8f6a42, gear: 0xd9c19a, mover: 0x6cc2a8 },
  { bg: 0xd3e4f2, f1: 0xf0f5fa, f2: 0xdfe8f1, side: 0x9fb2c6, wall: 0x56708f, shelf: 0x4a6280, pipe: 0x3f546e, gear: 0xa8bdd2, mover: 0xf2b84b },
  { bg: 0xdfe8cf, f1: 0xf4f6ea, f2: 0xe5ead6, side: 0xadb58f, wall: 0x7f9a5a, shelf: 0x6c874a, pipe: 0x8a6a46, gear: 0xbfcd9f, mover: 0xf2b84b },
  { bg: 0x161b2e, f1: 0x4a5270, f2: 0x404763, side: 0x2c3248, wall: 0x262c44, shelf: 0x343c5a, pipe: 0x20263a, gear: 0x232a40, mover: 0xf2b84b },
];
export const CH_COLORS = { 1: 0x2ec4b6, 2: 0xff9f1c, 3: 0xf15bb5, 4: 0x8ac926, 5: 0x9b5de5 };
const RED = 0xe5484d, BLUE = 0x3d8bfd;

const col = (hex) => new THREE.Color(hex);
// material factory: PBR when fancy, Lambert otherwise (pbr = extra standard-material settings)
let FANCY = false;
const LM = (p, pbr) => FANCY ? new THREE.MeshStandardMaterial({ roughness: 0.55, metalness: 0.05, ...p, ...(pbr || {}) }) : new THREE.MeshLambertMaterial(p);
const METAL = { roughness: 0.38, metalness: 0.75 }, PAINT = { roughness: 0.42, metalness: 0.15 }, RUBBER = { roughness: 0.85, metalness: 0 };

/* ---------- geometry helpers: build one big vertex-coloured mesh ---------- */
class GeoBuilder {
  constructor(uvs = 2) { this.p = []; this.n = []; this.c = []; this.u = []; this.uvs = uvs; }
  quad(a, b, c, d, nrm, ca, cb = ca, cc = cb, cd = ca) {
    // a,b,c,d counter-clockwise when looking at the face
    const P = this.p, N = this.n, Cc = this.c;
    const U = this.u, S = 1 / this.uvs;
    for (const [v, k] of [[a, ca], [b, cb], [c, cc], [a, ca], [c, cc], [d, cd]]) {
      P.push(v[0], v[1], v[2]); N.push(nrm[0], nrm[1], nrm[2]); Cc.push(k.r, k.g, k.b);
      // world-space UVs, so textures line up across neighbouring boxes
      if (nrm[1]) U.push(v[0] * S, -v[2] * S); else if (nrm[2]) U.push(v[0] * S * nrm[2], v[1] * S); else U.push(-v[2] * S * nrm[0], v[1] * S);
    }
  }
  box(mn, mx, top, side, opts = {}) {
    const [x0, y0, z0] = mn, [x1, y1, z1] = mx;
    const sideTop = side, sideBot = side.clone().multiplyScalar(opts.dark ?? 0.62);
    // top (optionally tiled)
    if (opts.tiles) {
      const T = opts.tile || 2;
      for (let x = Math.floor(x0 / T) * T; x < x1; x += T) for (let z = Math.floor(z0 / T) * T; z < z1; z += T) {
        const ax = Math.max(x, x0), bx = Math.min(x + T, x1), az = Math.max(z, z0), bz = Math.min(z + T, z1);
        if (bx - ax < 1e-3 || bz - az < 1e-3) continue;
        const k = ((Math.round(x / T) + Math.round(z / T)) & 1) ? opts.tiles[1] : opts.tiles[0];
        this.quad([ax, y1, bz], [bx, y1, bz], [bx, y1, az], [ax, y1, az], [0, 1, 0], k);
      }
    } else this.quad([x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0], [0, 1, 0], top);
    if (opts.noSides) return;
    // front (+z), back (-z), right (+x), left (-x): gradient top->bottom
    this.quad([x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [0, 0, 1], sideBot, sideBot, sideTop, sideTop);
    this.quad([x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0], [0, 0, -1], sideBot, sideBot, sideTop, sideTop);
    this.quad([x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [1, 0, 0], sideBot, sideBot, sideTop, sideTop);
    this.quad([x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0], [-1, 0, 0], sideBot, sideBot, sideTop, sideTop);
    // a thin light lip around the top edge of floors
    if (opts.lip) {
      const L = 0.06, lc = opts.lip;
      this.quad([x0, y1 - L, z1 + 0.001], [x1, y1 - L, z1 + 0.001], [x1, y1, z1 + 0.001], [x0, y1, z1 + 0.001], [0, 0, 1], lc);
      this.quad([x1 + 0.001, y1 - L, z1], [x1 + 0.001, y1 - L, z0], [x1 + 0.001, y1, z0], [x1 + 0.001, y1, z1], [1, 0, 0], lc);
      this.quad([x0 - 0.001, y1 - L, z0], [x0 - 0.001, y1 - L, z1], [x0 - 0.001, y1, z1], [x0 - 0.001, y1, z0], [-1, 0, 0], lc);
    }
  }
  geometry() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.p, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.n, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(this.c, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(this.u, 2));
    g.computeBoundingSphere();
    return g;
  }
}

function canvasTex(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 1;
  return t;
}

/* ---------- renderer ---------- */
export class View {
  constructor(canvas) {
    this.canvas = canvas;
    const gl = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance', alpha: false, stencil: false, preserveDrawingBuffer: false });
    this.renderer = gl;
    const ctx = gl.getContext();
    let rinfo = '';
    try { const ext = ctx.getExtension('WEBGL_debug_renderer_info'); rinfo = ext ? ctx.getParameter(ext.UNMASKED_RENDERER_WEBGL) : ctx.getParameter(ctx.RENDERER); } catch (e) { }
    this.rendererName = String(rinfo || '');
    this.software = /swiftshader|llvmpipe|software|softpipe|microsoft basic/i.test(this.rendererName);
    this.scale = this.software ? 0.6 : 1; this.quality = 'auto';
    this.fancy = FANCY = !this.software;
    gl.setPixelRatio(1);
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(48, 16 / 10, 0.5, 160);
    this.camPos = new THREE.Vector3(10, 10, 16); this.camLook = new THREE.Vector3(10, 0, -4);
    this.hemi = new THREE.HemisphereLight(0xffffff, 0x8a7a70, 1.25); this.scene.add(this.hemi);
    this.sun = new THREE.DirectionalLight(0xffffff, 1.5); this.sun.position.set(-6, 12, 9); this.scene.add(this.sun); this.scene.add(this.sun.target);
    const sc = this.sun.shadow.camera; sc.left = -24; sc.right = 24; sc.top = 16; sc.bottom = -16; sc.near = 1; sc.far = 80;
    this.sun.shadow.mapSize.set(2048, 2048); this.sun.shadow.bias = -0.0004; this.sun.shadow.normalBias = 0.03;
    this.fill = new THREE.DirectionalLight(0xbfd4ff, 0.0); this.fill.position.set(8, 6, -4); this.scene.add(this.fill);
    this.level = new THREE.Group(); this.scene.add(this.level);
    this.surf = makeSurfaces();
    this.makeRobots();
    // blob shadows
    const sg = new THREE.CircleGeometry(1, 16); sg.rotateX(-Math.PI / 2);
    this.shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.22, depthWrite: false });
    this.shadowGeo = sg;
    this.pShadows = [0, 1].map(() => { const m = new THREE.Mesh(sg, this.shadowMat); this.scene.add(m); return m; });
    // pull beam
    const bm = new THREE.MeshBasicMaterial({ color: 0xff6b6b, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false });
    this.beam = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1, 8, 1, true), bm); this.beam.visible = false; this.scene.add(this.beam);
    this.beamRings = [0, 1, 2].map(() => { const r = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.04, 4, 12), bm); r.visible = false; this.scene.add(r); return r; });
    // target marker
    this.marker = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.05, 4, 20), new THREE.MeshBasicMaterial({ color: 0xff5d5d, transparent: true, opacity: 0.7, depthTest: false })); this.marker.rotation.x = Math.PI / 2; this.marker.renderOrder = 5; this.scene.add(this.marker);
    // push rings
    this.pushRings = [0, 1, 2].map(() => { const r = new THREE.Mesh(new THREE.TorusGeometry(1, 0.08, 4, 24), new THREE.MeshBasicMaterial({ color: 0x8fc4ff, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })); r.rotation.x = Math.PI / 2; r.visible = false; r.t = 1; this.scene.add(r); return r; });
    // particles
    this.maxP = 160;
    this.parts = new THREE.InstancedMesh(new THREE.BoxGeometry(0.14, 0.14, 0.14), new THREE.MeshBasicMaterial({ color: 0xffffff }), this.maxP);
    this.parts.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.parts.setColorAt(0, col(0xffffff)); this.parts.count = 0; this.parts.frustumCulled = false;
    this.scene.add(this.parts);
    this.pl = [];
    this.tmpM = new THREE.Matrix4(); this.tmpQ = new THREE.Quaternion(); this.tmpV = new THREE.Vector3(); this.tmpS = new THREE.Vector3();
    this.crateTex = canvasTex(128, 128, (g, w, h) => {
      g.fillStyle = '#8d97a6'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#6c7584'; g.fillRect(0, 0, w, 14); g.fillRect(0, h - 14, w, 14); g.fillRect(0, 0, 14, h); g.fillRect(w - 14, 0, 14, h);
      g.strokeStyle = '#6c7584'; g.lineWidth = 10; g.beginPath(); g.moveTo(14, 14); g.lineTo(w - 14, h - 14); g.stroke();
      g.fillStyle = '#c7ced8'; for (const [x, y] of [[7, 7], [w - 7, 7], [7, h - 7], [w - 7, h - 7]]) { g.beginPath(); g.arc(x, y, 4, 0, 7); g.fill(); }
      g.fillStyle = '#f2b84b'; g.font = 'bold 30px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('AI', w / 2 + 22, h / 2 - 22);
    });
    this.woodTex = canvasTex(128, 128, (g, w, h) => {
      g.fillStyle = '#b07a44'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#9a6634'; for (let y = 0; y < h; y += 32) g.fillRect(0, y, w, 4);
      g.strokeStyle = '#7d5129'; g.lineWidth = 2; for (let i = 0; i < 9; i++) { g.beginPath(); const y = 8 + i * 13; g.moveTo(0, y); g.bezierCurveTo(w * 0.3, y + 4, w * 0.6, y - 4, w, y + 2); g.stroke(); }
      g.fillStyle = '#7d5129'; g.fillRect(0, 0, w, 12); g.fillRect(0, h - 12, w, 12); g.fillRect(0, 0, 12, h); g.fillRect(w - 12, 0, 12, h);
      g.fillStyle = '#f7ead2'; g.font = 'bold 22px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('NOT', w / 2, h / 2 - 12); g.fillText('IRON', w / 2, h / 2 + 12);
    });
    // chevron textures: canvas right = world +x, canvas down = world +z (top-down)
    const chev = (dx, dz) => canvasTex(64, 64, (g, w, h) => {
      g.fillStyle = '#30343e'; g.fillRect(0, 0, w, h);
      g.translate(32, 32); g.rotate(Math.atan2(dz, dx)); g.translate(-32, -32);
      g.strokeStyle = '#f2b84b'; g.lineWidth = 7; g.lineCap = 'round';
      g.beginPath(); g.moveTo(18, 12); g.lineTo(42, 32); g.lineTo(18, 52); g.stroke();
    });
    this.beltTexFor = (dx, dz) => { const t = chev(dx, dz); t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; };
    this.applyLook();
    this.resize();
    addEventListener('resize', () => this.resize());
    this.frameT = []; this.time = 0;
  }
  makeRobots() {
    if (this.bolt) this.scene.remove(this.bolt.root, this.nut.root);
    this.bolt = makeBolt(FANCY); this.nut = makeNut(FANCY);
    for (const R of [this.bolt, this.nut]) R.root.traverse(o => { if (o.isMesh) o.castShadow = true; });
    this.scene.add(this.bolt.root, this.nut.root);
  }
  // switch renderer settings between the fancy and cheap looks
  applyLook() {
    const gl = this.renderer, f = this.fancy;
    gl.shadowMap.enabled = f; this.sun.castShadow = f;
    gl.toneMapping = f ? THREE.NeutralToneMapping : THREE.NoToneMapping; gl.toneMappingExposure = 1.0;
    if (f && !this.envTex) {
      const pm = new THREE.PMREMGenerator(gl);
      this.envTex = pm.fromScene(new RoomEnvironment(), 0.04).texture; pm.dispose();
    }
    this.scene.environment = f ? this.envTex : null;
    this.scene.environmentIntensity = 0.55;
    if (f && !this.composer) {
      const rt = new THREE.WebGLRenderTarget(16, 16, { type: THREE.HalfFloatType, samples: 4 });
      this.composer = new EffectComposer(gl, rt);
      this.composer.addPass(new RenderPass(this.scene, this.camera));
      this.bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.5, 0.4, 1.15);
      this.composer.addPass(this.bloom);
      this.composer.addPass(new OutputPass());
      this.grade = new ShaderPass(GradeShader); this.composer.addPass(this.grade);
    }
    for (const sh of this.pShadows || []) sh.visible = !f;
  }
  resize() {
    const w = innerWidth, h = innerHeight;
    this.renderer.setSize(Math.max(1, Math.round(w * this.scale)), Math.max(1, Math.round(h * this.scale)), false);
    if (this.composer) this.composer.setSize(Math.max(1, Math.round(w * this.scale)), Math.max(1, Math.round(h * this.scale)));
    this.canvas.style.width = w + 'px'; this.canvas.style.height = h + 'px';
    this.camera.aspect = w / h; this.camera.updateProjectionMatrix();
  }
  setQuality(q) {
    this.quality = q;
    this.scale = q === 'high' ? 1 : q === 'low' ? 0.5 : (this.software ? 0.6 : 1);
    // 'sharp' always gets the full look, 'fast' never does, 'automatic' gets it on a real GPU
    const f = q === 'high' || (q === 'auto' && !this.software);
    if (f !== this.fancy) { this.fancy = FANCY = f; this.applyLook(); this.makeRobots(); this.dirty = true; }
    this.resize();
  }
  // adaptive resolution in "auto": keep frames under ~19 ms
  adapt(dtMs) {
    if (this.quality !== 'auto') return;
    this.frameT.push(dtMs); if (this.frameT.length < 45) return;
    const avg = this.frameT.reduce((a, b) => a + b, 0) / this.frameT.length; this.frameT = [];
    const old = this.scale;
    const lo = this.fancy ? 0.6 : 0.45;
    // still slow at the lowest scale with the full look: drop the glow, then the shadow maps
    if (this.fancy && avg > 24 && this.scale <= lo) {
      if (this.bloom.enabled) this.bloom.enabled = false;
      else if (this.sun.castShadow) this.sun.castShadow = false;
    }
    if (avg > 21 && this.scale > lo) this.scale = Math.max(lo, this.scale - 0.1);
    else if (avg < 14 && this.scale < 1) this.scale = Math.min(1, this.scale + 0.05);
    if (old !== this.scale) this.resize();
  }

  /* ---------- level build ---------- */
  build(w) {
    this.clear(); this.dirty = false;
    const th = THEMES[w.def.theme || 0]; this.theme = th;
    const dark = w.def.theme === 5 || w.def.theme === 11, F = this.fancy;
    this.hemi.color.set(w.def.theme === 11 ? 0x9fb4ff : dark ? 0xb8b0ff : 0xffffff); this.hemi.groundColor.set(th.side);
    this.hemi.intensity = dark ? 0.95 : 1.25;
    if (F) {
      // fancy: a gradient sky, a warm key light with real shadows, a cool rim light
      const bg = col(th.bg).lerp(col(dark ? 0x10121e : 0x6a6258), dark ? 0.1 : 0.22), top = bg.clone().lerp(col(dark ? 0x0a0c18 : 0xfff6e8), dark ? 0.5 : 0.2), bot = bg.clone().multiplyScalar(dark ? 0.55 : 0.7);
      if (this.skyTex) this.skyTex.dispose();
      this.skyTex = gradientTex('#' + top.getHexString(), '#' + bg.getHexString(), '#' + bot.getHexString());
      this.scene.background = this.skyTex;
      this.scene.fog = new THREE.Fog(bg.getHex(), 26, 105); // a little deeper than the level colour, so the hall recedes
      this.hemi.intensity = dark ? 0.45 : 0.45;
      this.sun.color.set(dark ? 0xc8c0ff : 0xfff1dc); this.sun.intensity = dark ? 2.2 : 3.0;
      this.fill.intensity = dark ? 0.9 : 0.6; this.fill.color.set(dark ? 0x7f9cff : 0xcfe0ff);
      this.scene.environmentIntensity = dark ? 0.25 : 0.35; this.renderer.toneMappingExposure = dark ? 1.0 : 0.88;
    } else {
      this.scene.background = col(th.bg);
      this.scene.fog = new THREE.Fog(th.bg, 45, 110);
      this.sun.color.set(0xffffff); this.sun.intensity = 1.5; this.fill.intensity = 0;
    }
    const S = this.surf;
    // one merged mesh per surface type
    const G = {
      tile: [new GeoBuilder(2), { map: S.tile, bump: 0.6, pbr: { roughness: 0.62, metalness: 0.05 } }],
      panel: [new GeoBuilder(2), { map: S.panel, bump: 0.8, pbr: { roughness: 0.5, metalness: 0.35 } }],
      iron: [new GeoBuilder(1), { map: S.iron, bump: 1.2, pbr: { roughness: 0.45, metalness: 0.4 } }],
      wall: [new GeoBuilder(4), { map: S.wall, bump: 0.8, pbr: { roughness: 0.68, metalness: 0.1 } }],
      oil: [new GeoBuilder(2), { map: S.tile, bump: 0.3, pbr: { roughness: 0.08, metalness: 0.35 } }],
    };
    const gb = { box: (mn, mx, top, side, o = {}) => (G[o.kind || 'panel'][0]).box(mn, mx, top, side, o) };
    // floors: textured top plus panelled sides (two passes so each part gets its own texture)
    const floorBox = (mn, mx, top, side, o, topKind, sideKind) => {
      G[topKind][0].box(mn, mx, top, side, { ...o, noSides: true });
      const g2 = G[sideKind][0], q = g2.p.length; g2.box(mn, mx, top, side, { ...o, tiles: null });
      g2.p.splice(q, 18); g2.n.splice(q, 18); g2.c.splice(q, 18); g2.u.splice(q / 3 * 2, 12); // drop the duplicate top
    };
    const T = { f1: col(th.f1), f2: col(th.f2), side: col(th.side), wall: col(th.wall), shelf: col(th.shelf), iron1: col(0x4a4f5a), iron2: col(0x3d424c), ironSide: col(0x353943), lip: col(0xffffff).lerp(col(th.f1), 0.4), fan: col(0x51586a), pipe: col(th.pipe) };
    if (F) { for (const k of ['f1', 'f2', 'lip']) T[k].multiplyScalar(0.82); } // lit floors read as white paper otherwise
    for (const s of w.solids) {
      if (s.kind !== 'static' || s.style === 'plate') continue;
      const mn = [s.min.x, s.min.y, s.min.z], mx = [s.max.x, s.max.y, s.max.z];
      if (s.style === 'floor') floorBox(mn, mx, T.f1, T.side, { tiles: [T.f1, T.f2], lip: T.lip }, 'tile', 'panel');
      else if (s.style === 'iron') floorBox(mn, mx, T.iron1, T.ironSide, { tiles: [T.iron1, T.iron2], tile: 1, lip: col(0xf2b84b) }, 'iron', 'iron');
      else if (s.style === 'backwall') gb.box(mn, mx, T.wall.clone().multiplyScalar(1.08), T.wall, { dark: 0.75, kind: 'wall' });
      else if (s.style === 'shelf') gb.box(mn, mx, T.shelf.clone().lerp(col(0xffffff), 0.25), T.shelf, { lip: T.lip });
      else if (s.style === 'fan') gb.box(mn, mx, T.fan, T.fan, { kind: 'iron' });
      else if (s.style === 'conveyor') gb.box(mn, [mx[0], mx[1] - 0.02, mx[2]], col(0x2b2e36), col(0x3a3f4b), { lip: col(0xf2b84b) });
      else if (s.style === 'switch') continue;
      else if (s.style === 'oil') floorBox(mn, mx, col(0x2e2a3a), T.side, { tiles: [col(0x2e2a3a), col(0x39334a)], lip: col(0x7a6cff) }, 'oil', 'panel');
      else if (s.style === 'spring') gb.box(mn, [mx[0], mx[1] - 0.3, mx[2]], col(0x3a3f4b), col(0x3a3f4b), { kind: 'iron' });
      else gb.box(mn, mx, T.side, T.side);
    }
    // background: soft pillars and stripes on the back wall
    for (const d of w.decos) {
      if (d.style === 'pipe') {
        const r = Math.min(d.max.x - d.min.x, 1.6) / 2, h = Math.min(d.max.y - d.min.y, 6);
        const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 10), LM({ color: th.pipe }));
        m.position.set((d.min.x + d.max.x) / 2, d.min.y + h / 2, (d.min.z + d.max.z) / 2); this.level.add(m);
        const cap = new THREE.Mesh(new THREE.CylinderGeometry(r * 1.25, r * 1.25, 0.3, 10), LM({ color: th.wall })); cap.position.set(m.position.x, d.min.y + h, m.position.z); this.level.add(cap);
      }
    }
    for (const k in G) {
      const [b, m] = G[k]; if (!b.p.length) continue;
      const mat = F ? new THREE.MeshStandardMaterial({ vertexColors: true, map: m.map, bumpMap: m.map, bumpScale: m.bump, ...m.pbr })
        : new THREE.MeshLambertMaterial({ vertexColors: true }); // software WebGL: texture sampling costs too much
      const mesh = new THREE.Mesh(b.geometry(), mat); mesh.receiveShadow = mesh.castShadow = true;
      this.level.add(mesh);
    }
    if (F) {
      // the far wall of the hall, with tall windows
      let x0 = Infinity, x1 = -Infinity; for (const s of w.solids) { x0 = Math.min(x0, s.min.x); x1 = Math.max(x1, s.max.x); }
      const ht = hallTex(); ht.userData.keep = false; const L = x1 - x0 + 120;
      const hm = new THREE.MeshStandardMaterial({ map: ht, color: col(th.wall).lerp(col(0xffffff), dark ? 0.1 : 0.45), roughness: 0.9, emissive: dark ? 0x101830 : 0x000000 });
      ht.repeat.set(L / 24, 1);
      let yb = 0, yt = 0; for (const s of w.solids) if (s.style === 'floor') { yb = Math.min(yb, s.max.y); yt = Math.max(yt, s.max.y); }
      const H = yt - yb + 50; ht.repeat.set(L / 24, H / 24);
      const hall = new THREE.Mesh(new THREE.PlaneGeometry(L, H), hm); hall.position.set((x0 + x1) / 2, yb - 18 + H / 2, -48); this.level.add(hall);
    }
    this.scenery = F ? buildScenery(this.level, w, th, this.surf, dark) : null;
    // far background gears
    let xmax = 0; this.minX = Infinity; for (const s of w.solids) { xmax = Math.max(xmax, s.max.x); this.minX = Math.min(this.minX, s.min.x); }
    this.gears = [];
    const gm = LM({ color: th.gear }, METAL);
    if (!F) for (let x = -10, i = 0; x < xmax + 30; x += 22, i++) {
      const r = 3.5 + (i % 3) * 1.8;
      const g = new THREE.Group();
      const disc = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 1, 18), gm); disc.rotation.x = Math.PI / 2; g.add(disc);
      const teeth = Math.round(r * 2.2);
      for (let k = 0; k < teeth; k++) { const t = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.4, 1), gm); const a = k / teeth * Math.PI * 2; t.position.set(Math.cos(a) * (r + 0.5), Math.sin(a) * (r + 0.5), 0); t.rotation.z = a; g.add(t); }
      g.position.set(x, 2 + (i % 2) * 6, -30 - (i % 3) * 6);
      g.userData.speed = (i % 2 ? 1 : -1) * (0.08 + (i % 3) * 0.04);
      this.level.add(g); this.gears.push(g);
    }
    // dynamic pieces
    this.dyn = [];
    for (const g of w.gates) {
      const c = CH_COLORS[g.chs[0]] || 0x999999;
      const ht = this.surf.hazard.clone(); ht.userData = {}; ht.needsUpdate = true;
      const m = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), LM({ color: c, map: F ? ht : null }, { roughness: 0.35, metalness: 0.3, bumpMap: ht, bumpScale: 0.6 }));
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(1.04, 0.25, 1.02), LM({ color: 0xffffff }));
      m.add(stripe);
      this.level.add(m); this.dyn.push({ kind: 'gate', o: g, m, stripe });
    }
    for (const b of w.bridges) {
      const c = CH_COLORS[b.chs[0]] || 0x999999;
      const m = new THREE.Mesh(new THREE.BoxGeometry(b.max.x - b.min.x, b.max.y - b.min.y, b.max.z - b.min.z), LM({ color: c, transparent: true, opacity: 0.25, emissive: c, emissiveIntensity: 0.25 }));
      m.position.set((b.min.x + b.max.x) / 2, (b.min.y + b.max.y) / 2, (b.min.z + b.max.z) / 2);
      this.level.add(m); this.dyn.push({ kind: 'bridge', o: b, m });
    }
    for (const mv of w.movers) {
      const sx = mv.max.x - mv.min.x, sy = mv.max.y - mv.min.y, sz = mv.max.z - mv.min.z;
      const m = new THREE.Group();
      const base = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), LM({ color: th.mover }));
      m.add(base);
      for (let i = 0; i < 3; i++) { const s = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.02, sz * 0.9), new THREE.MeshBasicMaterial({ color: 0x2a2a35 })); s.position.set(-sx / 2 + sx * (i + 1) / 4, sy / 2 + 0.01, 0); s.rotation.y = 0.5; m.add(s); }
      if (mv.chs) { const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.1, 0.4), new THREE.MeshBasicMaterial({ color: CH_COLORS[mv.chs[0]] })); lamp.position.set(0, -sy / 2 - 0.05, sz / 2 - 0.3); m.add(lamp); }
      this.level.add(m); this.dyn.push({ kind: 'mover', o: mv, m });
    }
    for (const p of w.plates) {
      const c = CH_COLORS[p.ch];
      const m = new THREE.Mesh(new THREE.CylinderGeometry(p.r * 0.95, p.r, 0.16, 20), LM({ color: c, emissive: c, emissiveIntensity: 0.15, map: F ? this.surf.plate : null }, { roughness: 0.35, metalness: 0.2 }));
      m.position.set(p.x, p.top + 0.08, p.z);
      const ring = new THREE.Mesh(new THREE.CylinderGeometry(p.r + 0.12, p.r + 0.12, 0.06, 20), LM({ color: 0x3a3f4b }));
      ring.position.set(p.x, p.top + 0.03, p.z);
      this.level.add(m, ring); this.dyn.push({ kind: 'plate', o: p, m });
    }
    this.belts = [];
    for (const s of w.solids) if (s.style === 'conveyor') {
      const sx = s.max.x - s.min.x, sz = s.max.z - s.min.z, cv = s.conv;
      const along = Math.abs(cv.vx) >= Math.abs(cv.vz);
      const tex = this.beltTexFor(along ? Math.sign(cv.vx) : 0, along ? 0 : Math.sign(cv.vz));
      const tex2 = this.beltTexFor(along ? -Math.sign(cv.vx) : 0, along ? 0 : -Math.sign(cv.vz));
      tex.repeat.set(sx / 1.2, sz / 1.2); tex2.repeat.copy(tex.repeat);
      const ang = 0;
      const mat = LM({ map: tex });
      const m = new THREE.Mesh(new THREE.PlaneGeometry(sx - 0.1, sz - 0.1), mat);
      m.rotation.x = -Math.PI / 2; m.position.set((s.min.x + s.max.x) / 2, s.max.y + 0.005, (s.min.z + s.max.z) / 2);
      this.level.add(m);
      const lamp = cv.chs ? new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.12, 0.35), new THREE.MeshBasicMaterial({ color: CH_COLORS[cv.chs[0]] })) : null;
      if (lamp) { lamp.position.set(s.min.x + 0.3, s.max.y + 0.06, s.min.z + 0.3); this.level.add(lamp); }
      this.belts.push({ s, tex, tex2, mat, ang, speed: Math.hypot(cv.vx, cv.vz), along, lamp });
    }
    this.springMeshes = w.springs.map(s => {
      const sx = s.max.x - s.min.x, sz = s.max.z - s.min.z, base = s.max.y - 0.3;
      const g = new THREE.Group(); g.position.set((s.min.x + s.max.x) / 2, base, (s.min.z + s.max.z) / 2);
      const coilM = LM({ color: 0x9aa3b2 });
      const coils = new THREE.Group(); g.add(coils);
      for (let i = 0; i < 3; i++) { const c = new THREE.Mesh(new THREE.TorusGeometry(Math.min(sx, sz) * 0.3, 0.05, 4, 16), coilM); c.rotation.x = Math.PI / 2; c.position.y = 0.06 + i * 0.08; coils.add(c); }
      const top = new THREE.Mesh(new THREE.BoxGeometry(sx - 0.1, 0.1, sz - 0.1), LM({ color: 0xf2b84b, emissive: 0xf2b84b, emissiveIntensity: 0.15 }));
      top.position.y = 0.25; g.add(top);
      const arrow = new THREE.Mesh(new THREE.ConeGeometry(Math.min(sx, sz) * 0.22, 0.25, 4), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 }));
      arrow.position.y = 0.45; g.add(arrow);
      this.level.add(g); return { sp: s.spring, top, coils, arrow };
    });
    this.cogMeshes = w.cogs.map(cg => {
      const g = new THREE.Group(); g.position.set(cg.x, cg.y, cg.z);
      const m = LM({ color: 0xffc53d, emissive: 0xb07a10, emissiveIntensity: 0.6, transparent: true });
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.12, 6, 18), m); g.add(ring);
      for (let k = 0; k < 8; k++) { const t = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 0.2), m); const a = k / 8 * Math.PI * 2; t.position.set(Math.cos(a) * 0.48, Math.sin(a) * 0.48, 0); t.rotation.z = a; g.add(t); }
      const glow = new THREE.Mesh(new THREE.SphereGeometry(0.75, 12, 8), new THREE.MeshBasicMaterial({ color: 0xffd76a, transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending, depthWrite: false })); g.add(glow);
      this.level.add(g); return { cg, g, m, glow };
    });
    this.tubeMeshes = w.tubes.map(tb => {
      const glass = LM({ color: 0x9fd8ff, transparent: true, opacity: 0.35, depthWrite: false });
      const H = Math.max(tb.a.top, tb.b.top) + 4.5;
      const seg = (A, B) => { const L = A.distanceTo(B); const m = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, L + 0.5, 12, 1, true), glass); m.position.copy(A).add(B).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.clone().sub(A).normalize()); this.level.add(m); };
      const pa = [new THREE.Vector3(tb.a.x, tb.a.top + 1.6, tb.a.z), new THREE.Vector3(tb.a.x, H, tb.a.z), new THREE.Vector3(tb.b.x, H, tb.b.z), new THREE.Vector3(tb.b.x, tb.b.top + 1.6, tb.b.z)];
      for (let i = 1; i < pa.length; i++) seg(pa[i - 1], pa[i]);
      const mouths = [tb.a, tb.b].map(e => {
        const g = new THREE.Group(); g.position.set(e.x, e.top, e.z);
        const rim = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.14, 6, 18), LM({ color: 0x3fa7d6 })); rim.rotation.x = Math.PI / 2; rim.position.y = 0.1; g.add(rim);
        const hole = new THREE.Mesh(new THREE.CircleGeometry(0.58, 18), new THREE.MeshBasicMaterial({ color: 0x1b2230 })); hole.rotation.x = -Math.PI / 2; hole.position.y = 0.03; g.add(hole);
        const hood = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.5, 14, 1, true), LM({ color: 0x3fa7d6, side: THREE.DoubleSide })); hood.position.y = 1.85; g.add(hood);
        const arrow = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.4, 4), new THREE.MeshBasicMaterial({ color: 0x9fd8ff })); arrow.position.set(e.out[0] * 0.95, 0.35, e.out[1] * 0.95); arrow.rotation.set(e.out[1] * Math.PI / 2, 0, -e.out[0] * Math.PI / 2); g.add(arrow);
        this.level.add(g); return { g, rim };
      });
      return { tb, mouths, glass };
    });
    this.switchMeshes = w.switches.map(sw => {
      const g = new THREE.Group(); g.position.set(sw.x, sw.top, sw.z);
      const c = CH_COLORS[sw.ch] || 0x999999;
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.8, 0.7), LM({ color: 0x6b7385 })); post.position.y = 0.4; g.add(post);
      const band = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.22, 0.74), LM({ color: c, emissive: c, emissiveIntensity: 0.25 })); band.position.y = 0.6; g.add(band);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.07, 4, 20), new THREE.MeshBasicMaterial({ color: c })); ring.rotation.x = Math.PI / 2; ring.position.y = 0.04; g.add(ring);
      const bulbM = LM({ color: 0x8a8f99, emissive: 0x000000 });
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 8), bulbM); bulb.position.y = 0.98; g.add(bulb);
      const lever = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.55, 0.12), LM({ color: 0xf2b84b })); lever.position.set(0.38, 0.65, 0); g.add(lever);
      this.level.add(g); return { sw, bulbM, lever, c };
    });
    this.crateMeshes = w.crates.map(c => {
      const tx = c.wood ? this.woodTex : this.crateTex;
      const m = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.2), LM({ map: tx }, c.wood ? { roughness: 0.85, metalness: 0, bumpMap: tx, bumpScale: 1.2 } : { roughness: 0.42, metalness: 0.65, bumpMap: tx, bumpScale: 1.6 }));
      this.level.add(m);
      const sh = new THREE.Mesh(this.shadowGeo, this.shadowMat); sh.scale.setScalar(0.85); this.level.add(sh);
      return { c, m, sh };
    });
    this.anchorMeshes = w.anchors.map(a => {
      const g = new THREE.Group(); g.position.set(a.x, a.y, a.z);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.12, 6, 16), LM({ color: 0x9aa3b2, emissive: 0x000000 }));
      g.add(ring);
      const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 8, 4), LM({ color: 0x6b7280 })); chain.position.y = 4.5; g.add(chain);
      const halo = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.05, 4, 20), new THREE.MeshBasicMaterial({ color: 0xff8c8c, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending, depthWrite: false })); g.add(halo);
      if (a.wall) { // magnet plate on a wall instead of a hanging ring
        g.remove(chain); ring.visible = false;
        const plate = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.1, 0.18), LM({ color: 0x9aa3b2, emissive: 0x000000 }));
        plate.lookAt(a.face[0], 0, a.face[1]); g.add(plate);
        const mark = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.07, 4, 16), new THREE.MeshBasicMaterial({ color: 0xe5484d })); mark.position.set(a.face[0] * 0.1, 0, a.face[1] * 0.1); mark.lookAt(a.face[0] * 2, 0, a.face[1] * 2); g.add(mark);
        ring.material = plate.material;
      }
      if (a.path) { // overhead rail the moving ring hangs from
        const railM = LM({ color: 0x6b7280 });
        for (let i = 1; i < a.path.length; i++) { const p0 = a.path[i - 1], p1 = a.path[i]; const A = new THREE.Vector3(a.home.x + p0[0], a.home.y + p0[1] + 8.5, a.home.z + p0[2]), B = new THREE.Vector3(a.home.x + p1[0], a.home.y + p1[1] + 8.5, a.home.z + p1[2]); const L = A.distanceTo(B); const r = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.25, L + 0.25), railM); r.position.copy(A).add(B).multiplyScalar(0.5); r.lookAt(B); this.level.add(r); }
      }
      this.level.add(g); return { a, g, ring, halo };
    });
    this.laserMeshes = w.lasers.map(l => {
      const g = new THREE.Group();
      const alongZ = (l.max.z - l.min.z) > (l.max.x - l.min.x);
      const len = alongZ ? l.max.z - l.min.z : l.max.x - l.min.x;
      const cx = (l.min.x + l.max.x) / 2, cz = (l.min.z + l.max.z) / 2;
      const postM = LM({ color: 0x3a3f4b });
      for (const s of [-1, 1]) {
        // tall emitter at the back, a low stub at the front so it never blocks the view
        const H = s < 0 ? l.max.y - l.min.y + 0.4 : 0.45;
        const p = new THREE.Mesh(new THREE.BoxGeometry(0.35, H, 0.35), postM);
        p.position.set(alongZ ? cx : cx + s * len / 2, l.min.y + H / 2, alongZ ? cz + s * len / 2 : cz);
        g.add(p);
      }
      const beamMat = new THREE.MeshBasicMaterial({ color: 0xff2e4d, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false });
      const beams = [];
      const n = Math.max(3, Math.round((l.max.y - l.min.y) / 0.55));
      for (let i = 0; i < n; i++) {
        const b = new THREE.Mesh(new THREE.BoxGeometry(alongZ ? 0.08 : len, 0.08, alongZ ? len : 0.08), beamMat);
        b.position.set(cx, l.min.y + 0.25 + i * (l.max.y - l.min.y - 0.4) / (n - 1), cz);
        g.add(b); beams.push(b);
      }
      const sheet = new THREE.Mesh(new THREE.BoxGeometry(alongZ ? 0.02 : len, l.max.y - l.min.y, alongZ ? len : 0.02), new THREE.MeshBasicMaterial({ color: 0xff2e4d, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false }));
      sheet.position.set(cx, (l.min.y + l.max.y) / 2, cz); g.add(sheet);
      this.level.add(g); return { l, g, beams, sheet, beamMat };
    });
    this.fanMeshes = w.fans.map(f => {
      const g = new THREE.Group();
      const cx = (f.min.x + f.max.x) / 2, cz = (f.min.z + f.max.z) / 2, r = Math.min(f.max.x - f.min.x, f.max.z - f.min.z) / 2 * 0.9;
      g.position.set(cx, f.min.y + 0.05, cz);
      const blades = new THREE.Group();
      const bm = LM({ color: 0xd9dde3 });
      for (let i = 0; i < 4; i++) { const b = new THREE.Mesh(new THREE.BoxGeometry(r * 1.9, 0.06, 0.45), bm); b.rotation.y = i * Math.PI / 4 * 2 / 2 + i * Math.PI / 4; b.rotation.x = 0.3; blades.add(b); }
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.15, 10), LM({ color: 0xf2b84b })); blades.add(hub);
      g.add(blades);
      const grill = new THREE.Mesh(new THREE.TorusGeometry(r, 0.06, 4, 20), LM({ color: 0x2a2f3a })); grill.rotation.x = Math.PI / 2; grill.position.y = 0.1; g.add(grill);
      // wind streaks
      const sm = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.45, depthWrite: false });
      const streaks = [];
      for (let i = 0; i < 9; i++) { const s = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.9, 0.05), sm); s.userData = { x: (Math.random() - 0.5) * r * 1.6, z: (Math.random() - 0.5) * r * 1.6, t: Math.random() }; g.add(s); streaks.push(s); }
      this.level.add(g); return { f, g, blades, streaks, sm, spin: 0 };
    });
    // exit
    if (w.exit) {
      const e = w.exit, cx = (e.min.x + e.max.x) / 2, cz = (e.min.z + e.max.z) / 2, sx = e.max.x - e.min.x, sz = e.max.z - e.min.z;
      const g = new THREE.Group(); g.position.set(cx, e.top, cz);
      const padMat = LM({ color: 0x8be9c1, emissive: 0x2ec48f, emissiveIntensity: 0.4 });
      const pad = new THREE.Mesh(new THREE.BoxGeometry(sx, 0.1, sz), padMat); pad.position.y = 0.05; g.add(pad);
      const frameM = LM({ color: 0x3a3f4b });
      for (const s of [-1, 1]) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.3, 4, 0.3), frameM); p.position.set(s * (sx / 2 + 0.15), 2, -sz / 2 + 0.2); g.add(p); }
      const top = new THREE.Mesh(new THREE.BoxGeometry(sx + 0.6, 0.9, 0.3), frameM); top.position.set(0, 4.2, -sz / 2 + 0.2); g.add(top);
      const label = new THREE.Mesh(new THREE.PlaneGeometry(sx * 0.9, 0.7), new THREE.MeshBasicMaterial({ map: canvasTex(256, 64, (c, W, H) => { c.fillStyle = '#2ec48f'; c.fillRect(0, 0, W, H); c.fillStyle = '#fff'; c.font = 'bold 44px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('EXIT', W / 2, H / 2 + 2); }) }));
      label.position.set(0, 4.2, -sz / 2 + 0.36); g.add(label);
      // glowing light strips down the inside of the frame
      const strip = LM({ color: 0x8be9c1, emissive: 0x2ec48f, emissiveIntensity: 1.5 });
      for (const s of [-1, 1]) { const st = new THREE.Mesh(new THREE.BoxGeometry(0.08, 3.6, 0.12), strip); st.position.set(s * (sx / 2 + 0.01), 1.9, -sz / 2 + 0.36); g.add(st); }
      padMat.map = this.fancy ? this.surf.plate : null; padMat.color.set(this.fancy ? 0x5fcf9f : 0x8be9c1);
      const beam = new THREE.Mesh(new THREE.CylinderGeometry(Math.min(sx, sz) / 2, Math.min(sx, sz) / 2, 3.5, 20, 1, true), new THREE.MeshBasicMaterial({ color: 0x8be9c1, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
      beam.position.y = 1.8; g.add(beam);
      this.level.add(g); this.exitMesh = { g, padMat, beam, strip };
    } else this.exitMesh = null;
    // checkpoint lamps
    this.cpMeshes = w.checkpoints.map(cp => {
      const g = new THREE.Group();
      const x = cp.min.x + 0.7, z = -7.4, y = groundAt(w, x, z);
      g.position.set(x, y, z);
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.6, 6), LM({ color: 0x3a3f4b })); pole.position.y = 0.8; g.add(pole);
      const bulbM = LM({ color: 0x777777, emissive: 0x000000 });
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 8), bulbM); bulb.position.y = 1.7; g.add(bulb);
      this.level.add(g); return { cp, bulbM };
    });
    // signs
    for (const s of w.signs) {
      const tex = canvasTex(512, 128, (c, W, H) => { c.fillStyle = 'rgba(255,255,255,0.0)'; c.clearRect(0, 0, W, H); c.fillStyle = '#ffffff'; c.globalAlpha = 0.85; let fs = 64; c.font = `bold ${fs}px sans-serif`; while (c.measureText(s.text).width > W - 16 && fs > 20) { fs -= 2; c.font = `bold ${fs}px sans-serif`; } c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(s.text, W / 2, H / 2); });
      const m = new THREE.Mesh(new THREE.PlaneGeometry(6, 1.5), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }));
      m.position.set(s.x, s.y, s.z + 0.02); this.level.add(m);
    }
    this.camPos.set(w.players[0].pos.x + 2, 10, 18); this.camLook.set(w.players[0].pos.x + 2, 1, -4);
    this.pl = []; this.parts.count = 0;
    if (F) this.level.traverse(o => {
      if (!o.isMesh) return; const m = o.material;
      const solid = m && !m.transparent && !m.isMeshBasicMaterial;
      o.castShadow = o.castShadow || solid; o.receiveShadow = o.receiveShadow || solid;
    });
    for (const cm of this.crateMeshes) cm.sh.visible = !F;
    // glowing bits get pushed above 1.0 so the bloom picks them up
    const hot = F ? 1.8 : 1;
    for (const lm of this.laserMeshes) lm.beamMat.color.set(0xff2e4d).multiplyScalar(hot);
    this.beam.material.color.set(0xff6b6b).multiplyScalar(F ? 1.8 : 1);
  }
  clear() {
    const kill = o => { o.traverse(c => { if (c.geometry && c.geometry !== this.shadowGeo) c.geometry.dispose(); if (c.material && c.material !== this.shadowMat) { const ms = [].concat(c.material); ms.forEach(m => { if (m.map && m.map !== this.crateTex && m.map !== this.woodTex && !m.map.userData.keep) m.map.dispose(); m.dispose(); }); } }); };
    for (const c of [...this.level.children]) { kill(c); this.level.remove(c); }
  }

  /* ---------- effects ---------- */
  burst(x, y, z, color, n = 12, speed = 4, up = 3, life = 0.6) {
    for (let i = 0; i < n; i++) {
      if (this.pl.length >= this.maxP) this.pl.shift();
      const a = Math.random() * Math.PI * 2, s = speed * (0.4 + Math.random() * 0.6);
      this.pl.push({ x, y, z, vx: Math.cos(a) * s, vy: up * (0.5 + Math.random()), vz: Math.sin(a) * s, t: 0, life: life * (0.6 + Math.random() * 0.6), c: this.fancy && color !== 0xffffff ? col(color).multiplyScalar(2.4) : col(color), s: 0.6 + Math.random() * 0.8 });
    }
  }
  shake(a) { this.shakeA = Math.max(this.shakeA || 0, a); }
  pushRing(x, y, z) {
    const r = this.pushRings.find(r => r.t >= 1) || this.pushRings[0];
    r.t = 0; r.position.set(x, y, z); r.visible = true;
  }

  /* ---------- per-frame ---------- */
  draw(w, dt, opts = {}) {
    if (this.dirty) this.build(w);
    this.time += dt;
    const t = this.time;
    const [B, N] = w.players;
    // camera
    const mid = new THREE.Vector3((B.pos.x + N.pos.x) / 2, (B.pos.y + N.pos.y) / 2, (B.pos.z + N.pos.z) / 2);
    const spread = Math.hypot(B.pos.x - N.pos.x, (B.pos.y - N.pos.y) * 1.3, (B.pos.z - N.pos.z) * 0.6);
    const dist = Math.min(30, Math.max(13, 11 + spread * 0.72)) * (opts.zoom || 1);
    const look = new THREE.Vector3(Math.max(this.minX + 7, mid.x + 0.5), mid.y + 0.3, -4.2 + (mid.z + 4) * 0.3);
    const want = new THREE.Vector3(look.x, look.y + dist * 0.68, look.z + dist * 0.78);
    if (opts.title) { look.x += 1.5; want.set(look.x + 1 + Math.sin(t * 0.15) * 2, look.y + 6.5, look.z + 11); }
    const k = Math.min(1, dt * (opts.snap ? 60 : 3.2));
    this.camPos.lerp(want, k); this.camLook.lerp(look, k);
    this.camera.position.copy(this.camPos); this.camera.lookAt(this.camLook);
    if (this.shakeA > 0.003) { // short, decaying camera shake
      const a = this.shakeA; this.camera.position.x += (Math.random() - 0.5) * a; this.camera.position.y += (Math.random() - 0.5) * a;
      this.shakeA *= Math.exp(-dt * 9);
    }
    // speed trails behind launched or flung robots
    [B, N].forEach((p, i) => { const v = Math.hypot(p.vel.x, p.vel.y, p.vel.z); if (v > 9.5 && Math.random() < 0.7) this.burst(p.pos.x, p.pos.y, p.pos.z, i ? 0x8fc4ff : 0xff8c8c, 1, 0.4, 0.2, 0.35); });
    // robots
    this.poseRobot(this.bolt, B, dt, w, 0);
    this.poseRobot(this.nut, N, dt, w, 1);
    // shadows
    if (!this.fancy) [B, N].forEach((p, i) => { const gy = groundAt(w, p.pos.x, p.pos.z, p.pos.y - p.half.y + 0.2); const sh = this.pShadows[i]; if (gy > -50) { sh.visible = true; sh.position.set(p.pos.x, gy + 0.03, p.pos.z); const h = p.pos.y - p.half.y - gy; sh.scale.setScalar(Math.max(0.15, 0.48 - h * 0.04)); } else sh.visible = false; });
    // crates
    for (const cm of this.crateMeshes) {
      const c = cm.c; cm.m.position.set(c.pos.x, c.pos.y, c.pos.z);
      cm.m.rotation.y = c.pulledBy ? Math.sin(t * 6) * 0.08 : 0;
      if (!this.fancy) { const gy = groundAt(w, c.pos.x, c.pos.z, c.pos.y - 0.5); cm.sh.visible = gy > -50; cm.sh.position.set(c.pos.x, gy + 0.025, c.pos.z); }
    }
    // dynamic level bits
    for (const d of this.dyn) {
      if (d.kind === 'gate') {
        const g = d.o, sx = g.max.x - g.min.x, sy = g.max.y - g.min.y, sz = g.max.z - g.min.z;
        d.m.scale.set(sx, sy, sz); if (d.m.material.map) d.m.material.map.repeat.set(Math.max(sx, sz) / 2, sy / 1.3); d.m.position.set((g.min.x + g.max.x) / 2, (g.min.y + g.max.y) / 2, (g.min.z + g.max.z) / 2);
        d.stripe.position.y = 0.5 - 0.6 / sy; d.stripe.scale.y = 1 / sy * 1.2;
      } else if (d.kind === 'bridge') {
        const b = d.o; d.m.material.opacity = 0.1 + 0.8 * b.vis; d.m.material.emissiveIntensity = 0.15 + 0.35 * b.vis + (b.vis < 0.5 ? Math.sin(t * 4) * 0.08 : 0);
      } else if (d.kind === 'mover') {
        const m = d.o; d.m.position.set((m.min.x + m.max.x) / 2, (m.min.y + m.max.y) / 2, (m.min.z + m.max.z) / 2);
      } else if (d.kind === 'plate') {
        const p = d.o; d.m.position.y = p.top + (p.pressed ? 0.03 : 0.08); d.m.material.emissiveIntensity = p.pressed ? 0.8 : 0.15 + Math.sin(t * 3) * 0.05;
      }
    }
    // anchors + target marker
    let tgt = null;
    if (B.target) tgt = B.target; else if (opts.showTarget && w.anchors.length + w.crates.length > 0 || opts.showTarget) tgt = pickTarget(w, B);
    for (const am of this.anchorMeshes) {
      const on = tgt && tgt.obj === am.a;
      am.halo.material.opacity = on ? (B.target ? 0.9 : 0.45 + Math.sin(t * 6) * 0.15) : 0;
      am.ring.material.emissive.set(on ? 0x662222 : 0x000000);
      if (!am.a.wall) am.g.rotation.y = Math.sin(t * 0.8 + am.a.x) * 0.3;
      if (am.a.path) am.g.position.set(am.a.x, am.a.y, am.a.z);
    }
    if (tgt && !B.target && tgt.kind !== 'anchor' && opts.showTarget) {
      const o = tgt.obj; this.marker.visible = true; this.marker.position.set(o.pos.x, o.pos.y + o.half.y + 0.45 + Math.sin(t * 5) * 0.08, o.pos.z);
      this.marker.scale.setScalar(o.kind === 'crate' ? 1.1 : 0.8); this.marker.material.opacity = 0.55;
    } else this.marker.visible = false;
    // beam
    if (B.target) {
      const a = new THREE.Vector3(B.pos.x, B.pos.y + 0.95, B.pos.z);
      const o = B.target.obj; const b = B.target.kind === 'anchor' ? new THREE.Vector3(o.x, o.y, o.z) : new THREE.Vector3(o.pos.x, o.pos.y, o.pos.z);
      const d = b.clone().sub(a), len = d.length();
      this.beam.visible = len > 0.3;
      this.beam.position.copy(a).addScaledVector(d, 0.5);
      this.beam.scale.set(0.07 + Math.sin(t * 30) * 0.015, len, 0.07 + Math.sin(t * 30) * 0.015);
      this.beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize());
      this.beamRings.forEach((r, i) => { const f = ((t * 1.6 + i / 3) % 1); r.visible = len > 0.6; r.position.copy(b).addScaledVector(d, -f); r.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), d.clone().normalize()); r.scale.setScalar(1 - f * 0.5); });
    } else { this.beam.visible = false; this.beamRings.forEach(r => r.visible = false); }
    // push rings
    for (const r of this.pushRings) { if (r.t >= 1) { r.visible = false; continue; } r.t = Math.min(1, r.t + dt / 0.35); r.scale.setScalar(0.4 + r.t * 3.3); r.material.opacity = (1 - r.t) * 0.8; }
    // lasers
    for (const lm of this.laserMeshes) {
      const l = lm.l;
      let warn = false;
      if (l.timer && !l.on) { const [onT, offT, ph] = l.timer; const per = onT + offT; const tt = (w.t + (ph || 0)) % per; warn = tt > per - 0.45; }
      const vis = l.on || warn;
      lm.beams.forEach((b, i) => { b.visible = vis; b.scale.set(1, warn && !l.on ? 0.4 : 1 + Math.sin(t * 40 + i) * 0.2, 1); });
      lm.beamMat.opacity = l.on ? 0.85 + Math.sin(t * 50) * 0.1 : 0.35;
      lm.sheet.visible = l.on;
    }
    // golden cogs (faded if found on an earlier visit)
    for (const c of this.cogMeshes) {
      c.g.visible = !c.cg.got; c.g.rotation.y = t * 1.6; c.g.position.y = c.cg.y + Math.sin(t * 2 + c.cg.x) * 0.12;
      c.m.opacity = opts.cogsFound ? 0.45 : 1; c.glow.material.opacity = opts.cogsFound ? 0.06 : 0.16 + Math.sin(t * 3) * 0.05;
    }
    // tubes
    for (const tm of this.tubeMeshes) { const k = Math.max(0, 1 - (w.t - tm.tb.t) / 0.4); tm.glass.opacity = 0.3 + k * 0.4; tm.mouths.forEach(m => m.rim.scale.setScalar(1 + k * 0.25 + Math.sin(t * 3) * 0.03)); }
    // springs
    for (const sm of this.springMeshes) {
      const k = Math.max(0, 1 - (w.t - sm.sp.t) / 0.25); // 1 right after a bounce
      const sq = k > 0 ? 1 - Math.sin(k * Math.PI) * 0.6 : 1;
      sm.top.position.y = 0.05 + 0.2 * sq + (k > 0 ? Math.sin(k * Math.PI) * 0.15 : 0); sm.coils.scale.y = sq;
      sm.arrow.position.y = 0.5 + Math.sin(t * 4) * 0.08; sm.top.material.emissiveIntensity = 0.15 + k * 0.6;
    }
    // belts + switches
    for (const b of this.belts) { const dir = b.s.conv.rev ? -1 : 1; const tx = b.s.conv.rev ? b.tex2 : b.tex; if (b.mat.map !== tx) { tx.offset.copy(b.mat.map.offset); b.mat.map = tx; b.mat.needsUpdate = true; } tx.offset.x -= dir * b.s.conv.vx * dt / 1.2; tx.offset.y += dir * b.s.conv.vz * dt / 1.2; if (b.lamp) b.lamp.material.color.set(b.s.conv.rev ? CH_COLORS[b.s.conv.chs[0]] : 0x333333); }
    for (const sm of this.switchMeshes) { const on = sm.sw.on; sm.bulbM.color.set(on ? sm.c : 0x8a8f99); sm.bulbM.emissive.set(on ? sm.c : 0x000000); sm.bulbM.emissiveIntensity = on ? (this.fancy ? 2.4 : 0.7) : 0; sm.lever.rotation.z = on ? -0.6 : 0.6; }
    // fans
    for (const fm of this.fanMeshes) {
      const on = fm.f.on; fm.spin += dt * (on ? 18 : 1); fm.blades.rotation.y = fm.spin;
      const H = fm.f.max.y - fm.f.min.y;
      fm.streaks.forEach(s => { s.visible = on; if (!on) return; s.userData.t = (s.userData.t + dt * 0.9) % 1; s.position.set(s.userData.x, s.userData.t * H, s.userData.z); });
      fm.sm.opacity = 0.35;
    }
    // exit glow
    if (this.exitMesh) {
      const inside = w.players.filter(p => p.pos.x > w.exit.min.x && p.pos.x < w.exit.max.x && p.pos.z > w.exit.min.z && p.pos.z < w.exit.max.z && p.pos.y > w.exit.min.y && p.pos.y < w.exit.max.y).length;
      const F = this.fancy; // with bloom on, keep the exit light subtle so it doesn't wash the area out
      this.exitMesh.padMat.emissiveIntensity = F ? 0.12 + inside * 0.22 + Math.sin(t * 3) * 0.04 : 0.35 + inside * 0.35 + Math.sin(t * 3) * 0.1;
      this.exitMesh.beam.material.opacity = F ? 0.025 + inside * 0.03 : 0.08 + inside * 0.1;
      if (this.exitMesh.strip) this.exitMesh.strip.emissiveIntensity = 1.2 + inside * 1.2 + Math.sin(t * 3) * 0.3;
    }
    for (const c of this.cpMeshes) { c.bulbM.color.set(c.cp.hit ? 0x9dffb0 : 0x777777); c.bulbM.emissive.set(c.cp.hit ? 0x2ec48f : 0x000000); c.bulbM.emissiveIntensity = this.fancy ? 2.5 : 1; }
    if (this.scenery) { // haze starts just behind the action, so the background layers fade with depth
      const cd = this.camPos.distanceTo(this.camLook); this.scene.fog.near = cd + 6; this.scene.fog.far = cd + 62;
    }
    if (this.scenery) this.scenery.update(t, dt, this.camLook); else for (const g of this.gears) g.rotation.z += g.userData.speed * dt;
    // particles
    let n = 0;
    for (let i = this.pl.length - 1; i >= 0; i--) {
      const p = this.pl[i]; p.t += dt; if (p.t > p.life) { this.pl.splice(i, 1); continue; }
      p.vy -= 12 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
    }
    for (const p of this.pl) {
      const s = p.s * (1 - p.t / p.life);
      this.tmpM.compose(this.tmpV.set(p.x, p.y, p.z), this.tmpQ.identity(), this.tmpS.set(s, s, s));
      this.parts.setMatrixAt(n, this.tmpM); this.parts.setColorAt(n, p.c); n++;
    }
    this.parts.count = n; this.parts.instanceMatrix.needsUpdate = true; if (this.parts.instanceColor) this.parts.instanceColor.needsUpdate = true;
    if (this.fancy) {
      // the shadow camera follows the view, snapped to whole shadow texels so edges don't shimmer
      const sz = 48 / 2048, lx = Math.round(this.camLook.x / sz) * sz, lz = Math.round(this.camLook.z / sz) * sz, ly = Math.round(this.camLook.y / sz) * sz;
      this.sun.target.position.set(lx, ly, lz); this.sun.position.set(lx - 9, ly + 20, lz + 12);
      if (this.grade) this.grade.uniforms.time.value = this.time;
      this.composer.render(dt);
    } else this.renderer.render(this.scene, this.camera);
  }
  // squash on a landing (harder landing, bigger squash) and stretch on a jump
  land(who, v) { const R = who ? this.nut : this.bolt; if (R) R.landK = Math.max(0.6, Math.min(1.8, v / 9)); }
  hop(who) { const R = who ? this.nut : this.bolt; if (R) { R.hopT = 0.12; R.land = 0; } }
  poseRobot(R, p, dt, w, who) {
    R.root.position.set(p.pos.x, p.pos.y, p.pos.z);
    const moving = Math.hypot(p.vel.x, p.vel.z) > 0.3 || !p.grounded;
    R.still = moving ? 0 : (R.still || 0) + dt;
    let fx = p.face.x, fz = p.face.z;
    if (R.still > 1.2) { fx = fx * 0.45; fz = 1; }
    const yaw = Math.atan2(fx, fz);
    let dy = yaw - R.root.rotation.y; while (dy > Math.PI) dy -= Math.PI * 2; while (dy < -Math.PI) dy += Math.PI * 2;
    R.root.rotation.y += dy * Math.min(1, dt * (R.still > 1.2 ? 3 : 12));
    const sp = Math.hypot(p.vel.x, p.vel.z);
    R.walk = (R.walk || 0) + sp * dt * 2.2;
    const air = !p.grounded;
    let sq = 1;
    if (p.grounded && !R.wasG) { R.land = 0.18; R.landK = R.landK || 1; }
    R.wasG = p.grounded;
    if (air) sq = 1 + Math.max(-0.12, Math.min(0.15, p.vel.y * 0.012));
    if (R.land > 0) { R.land -= dt; sq = 1 - Math.max(0, R.land) * 1.2 * (R.landK || 1); if (R.land <= 0) R.landK = 0; }
    if (R.hopT > 0) { R.hopT -= dt; sq = Math.max(sq, 1 + R.hopT * 1.4); }
    if (p.pulledBy || (p.target && p.target.kind === 'anchor')) sq = 1 + Math.sin(this.time * 20) * 0.04;
    R.body.scale.set(1 / Math.sqrt(sq), sq, 1 / Math.sqrt(sq));
    R.body.position.y = (sq - 1) * -0.3 + (p.grounded && sp > 0.5 ? Math.abs(Math.sin(R.walk * 2)) * 0.06 : 0);
    if (R.still > 0.4) R.body.position.y += Math.sin(this.time * 2.4 + who * 1.7) * 0.02; // idle breathing
    // lean into speed changes: forward when starting off, back when braking
    const acc = dt > 0 ? (sp - (R.lastSp || 0)) / dt : 0; R.lastSp = sp;
    R.lean = (R.lean || 0) + (Math.max(-0.12, Math.min(0.12, acc * 0.006)) - (R.lean || 0)) * Math.min(1, dt * 10);
    R.body.rotation.x = (p.grounded ? Math.min(0.15, sp * 0.02) : 0) + R.lean;
    R.feet.forEach((f, i) => { f.position.z = 0.03 + (p.grounded ? Math.sin(R.walk * 2 + i * Math.PI) * Math.min(0.15, sp * 0.03) : 0.05); });
    // blink
    R.blinkT = (R.blinkT ?? 2 + Math.random() * 3) - dt;
    R.eyes.scale.y = R.blinkT < 0.12 ? 0.15 : 1;
    if (R.blinkT < 0) R.blinkT = 2 + Math.random() * 4;
    if (who === 0) R.mag.rotation.z = p.target ? Math.sin(this.time * 30) * 0.08 : 0;
    if (who === 1) R.dish.material.emissiveIntensity = p.cd > 0.2 ? 3 : 1;
    R.root.visible = !(p.zapT > 0.5 && Math.floor(this.time * 20) % 2 === 0);
  }
}
