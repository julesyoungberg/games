// Bolt & Nut — Three.js renderer. Low-poly, vertex-coloured, no shadow maps: light enough for software WebGL.
import * as THREE from 'three';
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
];
export const CH_COLORS = { 1: 0x2ec4b6, 2: 0xff9f1c, 3: 0xf15bb5, 4: 0x8ac926, 5: 0x9b5de5 };
const RED = 0xe5484d, BLUE = 0x3d8bfd;

const col = (hex) => new THREE.Color(hex);

/* ---------- geometry helpers: build one big vertex-coloured mesh ---------- */
class GeoBuilder {
  constructor() { this.p = []; this.n = []; this.c = []; }
  quad(a, b, c, d, nrm, ca, cb = ca, cc = cb, cd = ca) {
    // a,b,c,d counter-clockwise when looking at the face
    const P = this.p, N = this.n, Cc = this.c;
    for (const [v, k] of [[a, ca], [b, cb], [c, cc], [a, ca], [c, cc], [d, cd]]) { P.push(v[0], v[1], v[2]); N.push(nrm[0], nrm[1], nrm[2]); Cc.push(k.r, k.g, k.b); }
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

/* ---------- characters ---------- */
function eyes(parent, y, z, spread = 0.14, r = 0.11) {
  const white = new THREE.MeshLambertMaterial({ color: 0xffffff });
  const black = new THREE.MeshBasicMaterial({ color: 0x1b1b2a });
  const eg = new THREE.SphereGeometry(r, 10, 8), pg = new THREE.SphereGeometry(r * 0.55, 8, 6);
  const grp = new THREE.Group();
  for (const s of [-1, 1]) {
    const e = new THREE.Mesh(eg, white); e.position.set(s * spread, y, z); e.scale.set(1, 1.15, 0.6); grp.add(e);
    const p = new THREE.Mesh(pg, black); p.position.set(s * spread, y, z + r * 0.45); grp.add(p);
    const gl = new THREE.Mesh(new THREE.SphereGeometry(r * 0.18, 6, 4), new THREE.MeshBasicMaterial({ color: 0xffffff })); gl.position.set(s * spread + r * 0.18, y + r * 0.25, z + r * 0.7); grp.add(gl);
  }
  parent.add(grp);
  return grp;
}
function makeBolt() {
  const root = new THREE.Group(), body = new THREE.Group(); root.add(body);
  const red = new THREE.MeshLambertMaterial({ color: RED }), dark = new THREE.MeshLambertMaterial({ color: 0xb8323a }), steel = new THREE.MeshLambertMaterial({ color: 0xd9dde3 });
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.37, 0.62, 6), red); torso.position.y = -0.05; body.add(torso);
  const head = new THREE.Mesh(new THREE.CylinderGeometry(0.43, 0.43, 0.26, 6), dark); head.position.y = 0.36; body.add(head);
  // thread rings on the torso
  for (let i = 0; i < 3; i++) { const r = new THREE.Mesh(new THREE.TorusGeometry(0.355, 0.025, 4, 6), dark); r.rotation.x = Math.PI / 2; r.rotation.z = Math.PI / 6; r.position.y = -0.28 + i * 0.16; body.add(r); }
  // horseshoe magnet on the head
  const mag = new THREE.Group(); mag.position.y = 0.52;
  const arc = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.075, 6, 12, Math.PI), red); arc.rotation.z = Math.PI; arc.position.y = 0.22; mag.add(arc);
  for (const s of [-1, 1]) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.14, 8), red); leg.position.set(s * 0.2, 0.15, 0); mag.add(leg);
    const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.078, 0.078, 0.1, 8), steel); tip.position.set(s * 0.2, 0.05, 0); mag.add(tip);
  }
  body.add(mag);
  const eg = eyes(body, 0.05, 0.3, 0.13, 0.1);
  const feet = [];
  for (const s of [-1, 1]) { const f = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.26), dark); f.position.set(s * 0.15, -0.49, 0.03); body.add(f); feet.push(f); }
  return { root, body, eyes: eg, feet, mag, baseY: 0 };
}
function makeNut() {
  const root = new THREE.Group(), body = new THREE.Group(); root.add(body);
  const blue = new THREE.MeshLambertMaterial({ color: BLUE }), dark = new THREE.MeshLambertMaterial({ color: 0x2b66c4 }), hole = new THREE.MeshBasicMaterial({ color: 0x1d3f7a });
  const hex = new THREE.Mesh(new THREE.CylinderGeometry(0.47, 0.47, 0.6, 6), blue); hex.rotation.y = Math.PI / 6; hex.position.y = 0.0; body.add(hex);
  const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.43, 0.47, 0.06, 6), dark); rim.rotation.y = Math.PI / 6; rim.position.y = 0.32; body.add(rim);
  const h = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.02, 16), hole); h.position.y = 0.355; body.add(h);
  // little repulsor dish on top (pulses when pushing)
  const dish = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshLambertMaterial({ color: 0xbfe0ff, emissive: 0x1d4f9a })); dish.position.y = 0.36; body.add(dish);
  const eg = eyes(body, 0.04, 0.4, 0.15, 0.11);
  const feet = [];
  for (const s of [-1, 1]) { const f = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.12, 0.26), dark); f.position.set(s * 0.18, -0.39, 0.03); body.add(f); feet.push(f); }
  for (const s of [-1, 1]) { const a = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 6), dark); a.position.set(s * 0.52, -0.02, 0); body.add(a); }
  return { root, body, eyes: eg, feet, dish, baseY: 0 };
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
    gl.setPixelRatio(1);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(48, 16 / 10, 0.5, 160);
    this.camPos = new THREE.Vector3(10, 10, 16); this.camLook = new THREE.Vector3(10, 0, -4);
    this.hemi = new THREE.HemisphereLight(0xffffff, 0x8a7a70, 1.25); this.scene.add(this.hemi);
    this.sun = new THREE.DirectionalLight(0xffffff, 1.5); this.sun.position.set(-6, 12, 9); this.scene.add(this.sun);
    this.level = new THREE.Group(); this.scene.add(this.level);
    this.bolt = makeBolt(); this.nut = makeNut();
    this.scene.add(this.bolt.root, this.nut.root);
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
    this.resize();
    addEventListener('resize', () => this.resize());
    this.frameT = []; this.time = 0;
  }
  resize() {
    const w = innerWidth, h = innerHeight;
    this.renderer.setSize(Math.max(1, Math.round(w * this.scale)), Math.max(1, Math.round(h * this.scale)), false);
    this.canvas.style.width = w + 'px'; this.canvas.style.height = h + 'px';
    this.camera.aspect = w / h; this.camera.updateProjectionMatrix();
  }
  setQuality(q) {
    this.quality = q;
    this.scale = q === 'high' ? 1 : q === 'low' ? 0.5 : (this.software ? 0.6 : 1);
    this.resize();
  }
  // adaptive resolution in "auto": keep frames under ~19 ms
  adapt(dtMs) {
    if (this.quality !== 'auto') return;
    this.frameT.push(dtMs); if (this.frameT.length < 45) return;
    const avg = this.frameT.reduce((a, b) => a + b, 0) / this.frameT.length; this.frameT = [];
    const old = this.scale;
    if (avg > 21 && this.scale > 0.45) this.scale = Math.max(0.45, this.scale - 0.1);
    else if (avg < 14 && this.scale < 1) this.scale = Math.min(1, this.scale + 0.05);
    if (old !== this.scale) this.resize();
  }

  /* ---------- level build ---------- */
  build(w) {
    this.clear();
    const th = THEMES[w.def.theme || 0]; this.theme = th;
    this.scene.background = col(th.bg);
    this.scene.fog = new THREE.Fog(th.bg, 45, 110);
    this.hemi.color.set(w.def.theme === 5 ? 0xb8b0ff : 0xffffff); this.hemi.groundColor.set(th.side);
    this.hemi.intensity = w.def.theme === 5 ? 0.9 : 1.25;
    const gb = new GeoBuilder();
    const T = { f1: col(th.f1), f2: col(th.f2), side: col(th.side), wall: col(th.wall), shelf: col(th.shelf), iron1: col(0x4a4f5a), iron2: col(0x3d424c), ironSide: col(0x353943), lip: col(0xffffff).lerp(col(th.f1), 0.4), fan: col(0x51586a), pipe: col(th.pipe) };
    for (const s of w.solids) {
      if (s.kind !== 'static' || s.style === 'plate') continue;
      const mn = [s.min.x, s.min.y, s.min.z], mx = [s.max.x, s.max.y, s.max.z];
      if (s.style === 'floor') gb.box(mn, mx, T.f1, T.side, { tiles: [T.f1, T.f2], lip: T.lip });
      else if (s.style === 'iron') gb.box(mn, mx, T.iron1, T.ironSide, { tiles: [T.iron1, T.iron2], tile: 1, lip: col(0xf2b84b) });
      else if (s.style === 'backwall') gb.box(mn, mx, T.wall.clone().multiplyScalar(1.08), T.wall, { dark: 0.75 });
      else if (s.style === 'shelf') gb.box(mn, mx, T.shelf.clone().lerp(col(0xffffff), 0.25), T.shelf, { lip: T.lip });
      else if (s.style === 'fan') gb.box(mn, mx, T.fan, T.fan, {});
      else gb.box(mn, mx, T.side, T.side);
    }
    // background: soft pillars and stripes on the back wall
    for (const d of w.decos) {
      if (d.style === 'pipe') {
        const r = Math.min(d.max.x - d.min.x, 1.6) / 2, h = Math.min(d.max.y - d.min.y, 6);
        const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 10), new THREE.MeshLambertMaterial({ color: th.pipe }));
        m.position.set((d.min.x + d.max.x) / 2, d.min.y + h / 2, (d.min.z + d.max.z) / 2); this.level.add(m);
        const cap = new THREE.Mesh(new THREE.CylinderGeometry(r * 1.25, r * 1.25, 0.3, 10), new THREE.MeshLambertMaterial({ color: th.wall })); cap.position.set(m.position.x, d.min.y + h, m.position.z); this.level.add(cap);
      }
    }
    const mat = new THREE.MeshLambertMaterial({ vertexColors: true });
    this.staticMesh = new THREE.Mesh(gb.geometry(), mat); this.level.add(this.staticMesh);
    // far background gears
    let xmax = 0; this.minX = Infinity; for (const s of w.solids) { xmax = Math.max(xmax, s.max.x); this.minX = Math.min(this.minX, s.min.x); }
    this.gears = [];
    const gm = new THREE.MeshLambertMaterial({ color: th.gear });
    for (let x = -10, i = 0; x < xmax + 30; x += 22, i++) {
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
      const m = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshLambertMaterial({ color: c }));
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(1.04, 0.25, 1.02), new THREE.MeshLambertMaterial({ color: 0xffffff }));
      m.add(stripe);
      this.level.add(m); this.dyn.push({ kind: 'gate', o: g, m, stripe });
    }
    for (const b of w.bridges) {
      const c = CH_COLORS[b.chs[0]] || 0x999999;
      const m = new THREE.Mesh(new THREE.BoxGeometry(b.max.x - b.min.x, b.max.y - b.min.y, b.max.z - b.min.z), new THREE.MeshLambertMaterial({ color: c, transparent: true, opacity: 0.25, emissive: c, emissiveIntensity: 0.25 }));
      m.position.set((b.min.x + b.max.x) / 2, (b.min.y + b.max.y) / 2, (b.min.z + b.max.z) / 2);
      this.level.add(m); this.dyn.push({ kind: 'bridge', o: b, m });
    }
    for (const mv of w.movers) {
      const sx = mv.max.x - mv.min.x, sy = mv.max.y - mv.min.y, sz = mv.max.z - mv.min.z;
      const m = new THREE.Group();
      const base = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), new THREE.MeshLambertMaterial({ color: th.mover }));
      m.add(base);
      for (let i = 0; i < 3; i++) { const s = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.02, sz * 0.9), new THREE.MeshBasicMaterial({ color: 0x2a2a35 })); s.position.set(-sx / 2 + sx * (i + 1) / 4, sy / 2 + 0.01, 0); s.rotation.y = 0.5; m.add(s); }
      if (mv.chs) { const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.1, 0.4), new THREE.MeshBasicMaterial({ color: CH_COLORS[mv.chs[0]] })); lamp.position.set(0, -sy / 2 - 0.05, sz / 2 - 0.3); m.add(lamp); }
      this.level.add(m); this.dyn.push({ kind: 'mover', o: mv, m });
    }
    for (const p of w.plates) {
      const c = CH_COLORS[p.ch];
      const m = new THREE.Mesh(new THREE.CylinderGeometry(p.r * 0.95, p.r, 0.16, 20), new THREE.MeshLambertMaterial({ color: c, emissive: c, emissiveIntensity: 0.15 }));
      m.position.set(p.x, p.top + 0.08, p.z);
      const ring = new THREE.Mesh(new THREE.CylinderGeometry(p.r + 0.12, p.r + 0.12, 0.06, 20), new THREE.MeshLambertMaterial({ color: 0x3a3f4b }));
      ring.position.set(p.x, p.top + 0.03, p.z);
      this.level.add(m, ring); this.dyn.push({ kind: 'plate', o: p, m });
    }
    this.crateMeshes = w.crates.map(c => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.2), new THREE.MeshLambertMaterial({ map: this.crateTex }));
      this.level.add(m);
      const sh = new THREE.Mesh(this.shadowGeo, this.shadowMat); sh.scale.setScalar(0.85); this.level.add(sh);
      return { c, m, sh };
    });
    this.anchorMeshes = w.anchors.map(a => {
      const g = new THREE.Group(); g.position.set(a.x, a.y, a.z);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.12, 6, 16), new THREE.MeshLambertMaterial({ color: 0x9aa3b2, emissive: 0x000000 }));
      g.add(ring);
      const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 8, 4), new THREE.MeshLambertMaterial({ color: 0x6b7280 })); chain.position.y = 4.5; g.add(chain);
      const halo = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.05, 4, 20), new THREE.MeshBasicMaterial({ color: 0xff8c8c, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending, depthWrite: false })); g.add(halo);
      this.level.add(g); return { a, g, ring, halo };
    });
    this.laserMeshes = w.lasers.map(l => {
      const g = new THREE.Group();
      const alongZ = (l.max.z - l.min.z) > (l.max.x - l.min.x);
      const len = alongZ ? l.max.z - l.min.z : l.max.x - l.min.x;
      const cx = (l.min.x + l.max.x) / 2, cz = (l.min.z + l.max.z) / 2;
      const postM = new THREE.MeshLambertMaterial({ color: 0x3a3f4b });
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
      const bm = new THREE.MeshLambertMaterial({ color: 0xd9dde3 });
      for (let i = 0; i < 4; i++) { const b = new THREE.Mesh(new THREE.BoxGeometry(r * 1.9, 0.06, 0.45), bm); b.rotation.y = i * Math.PI / 4 * 2 / 2 + i * Math.PI / 4; b.rotation.x = 0.3; blades.add(b); }
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.15, 10), new THREE.MeshLambertMaterial({ color: 0xf2b84b })); blades.add(hub);
      g.add(blades);
      const grill = new THREE.Mesh(new THREE.TorusGeometry(r, 0.06, 4, 20), new THREE.MeshLambertMaterial({ color: 0x2a2f3a })); grill.rotation.x = Math.PI / 2; grill.position.y = 0.1; g.add(grill);
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
      const padMat = new THREE.MeshLambertMaterial({ color: 0x8be9c1, emissive: 0x2ec48f, emissiveIntensity: 0.4 });
      const pad = new THREE.Mesh(new THREE.BoxGeometry(sx, 0.1, sz), padMat); pad.position.y = 0.05; g.add(pad);
      const frameM = new THREE.MeshLambertMaterial({ color: 0x3a3f4b });
      for (const s of [-1, 1]) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.3, 4, 0.3), frameM); p.position.set(s * (sx / 2 + 0.15), 2, -sz / 2 + 0.2); g.add(p); }
      const top = new THREE.Mesh(new THREE.BoxGeometry(sx + 0.6, 0.9, 0.3), frameM); top.position.set(0, 4.2, -sz / 2 + 0.2); g.add(top);
      const label = new THREE.Mesh(new THREE.PlaneGeometry(sx * 0.9, 0.7), new THREE.MeshBasicMaterial({ map: canvasTex(256, 64, (c, W, H) => { c.fillStyle = '#2ec48f'; c.fillRect(0, 0, W, H); c.fillStyle = '#fff'; c.font = 'bold 44px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('EXIT', W / 2, H / 2 + 2); }) }));
      label.position.set(0, 4.2, -sz / 2 + 0.36); g.add(label);
      const beam = new THREE.Mesh(new THREE.CylinderGeometry(Math.min(sx, sz) / 2, Math.min(sx, sz) / 2, 3.5, 20, 1, true), new THREE.MeshBasicMaterial({ color: 0x8be9c1, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
      beam.position.y = 1.8; g.add(beam);
      this.level.add(g); this.exitMesh = { g, padMat, beam };
    } else this.exitMesh = null;
    // checkpoint lamps
    this.cpMeshes = w.checkpoints.map(cp => {
      const g = new THREE.Group();
      const x = cp.min.x + 0.7, z = -7.4, y = groundAt(w, x, z);
      g.position.set(x, y, z);
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.6, 6), new THREE.MeshLambertMaterial({ color: 0x3a3f4b })); pole.position.y = 0.8; g.add(pole);
      const bulbM = new THREE.MeshLambertMaterial({ color: 0x777777, emissive: 0x000000 });
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 8), bulbM); bulb.position.y = 1.7; g.add(bulb);
      this.level.add(g); return { cp, bulbM };
    });
    // signs
    for (const s of w.signs) {
      const tex = canvasTex(512, 128, (c, W, H) => { c.fillStyle = 'rgba(255,255,255,0.0)'; c.clearRect(0, 0, W, H); c.fillStyle = '#ffffff'; c.globalAlpha = 0.85; c.font = 'bold 64px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(s.text, W / 2, H / 2); });
      const m = new THREE.Mesh(new THREE.PlaneGeometry(6, 1.5), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }));
      m.position.set(s.x, s.y, s.z + 0.02); this.level.add(m);
    }
    this.camPos.set(w.players[0].pos.x + 2, 10, 18); this.camLook.set(w.players[0].pos.x + 2, 1, -4);
    this.pl = []; this.parts.count = 0;
  }
  clear() {
    const kill = o => { o.traverse(c => { if (c.geometry && c.geometry !== this.shadowGeo) c.geometry.dispose(); if (c.material && c.material !== this.shadowMat) { const ms = [].concat(c.material); ms.forEach(m => { if (m.map && m.map !== this.crateTex) m.map.dispose(); m.dispose(); }); } }); };
    for (const c of [...this.level.children]) { kill(c); this.level.remove(c); }
  }

  /* ---------- effects ---------- */
  burst(x, y, z, color, n = 12, speed = 4, up = 3, life = 0.6) {
    for (let i = 0; i < n; i++) {
      if (this.pl.length >= this.maxP) this.pl.shift();
      const a = Math.random() * Math.PI * 2, s = speed * (0.4 + Math.random() * 0.6);
      this.pl.push({ x, y, z, vx: Math.cos(a) * s, vy: up * (0.5 + Math.random()), vz: Math.sin(a) * s, t: 0, life: life * (0.6 + Math.random() * 0.6), c: col(color), s: 0.6 + Math.random() * 0.8 });
    }
  }
  pushRing(x, y, z) {
    const r = this.pushRings.find(r => r.t >= 1) || this.pushRings[0];
    r.t = 0; r.position.set(x, y, z); r.visible = true;
  }

  /* ---------- per-frame ---------- */
  draw(w, dt, opts = {}) {
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
    // robots
    this.poseRobot(this.bolt, B, dt, w, 0);
    this.poseRobot(this.nut, N, dt, w, 1);
    // shadows
    [B, N].forEach((p, i) => { const gy = groundAt(w, p.pos.x, p.pos.z, p.pos.y - p.half.y + 0.2); const sh = this.pShadows[i]; if (gy > -50) { sh.visible = true; sh.position.set(p.pos.x, gy + 0.03, p.pos.z); const h = p.pos.y - p.half.y - gy; sh.scale.setScalar(Math.max(0.15, 0.48 - h * 0.04)); } else sh.visible = false; });
    // crates
    for (const cm of this.crateMeshes) {
      const c = cm.c; cm.m.position.set(c.pos.x, c.pos.y, c.pos.z);
      cm.m.rotation.y = c.pulledBy ? Math.sin(t * 6) * 0.08 : 0;
      const gy = groundAt(w, c.pos.x, c.pos.z, c.pos.y - 0.5); cm.sh.visible = gy > -50; cm.sh.position.set(c.pos.x, gy + 0.025, c.pos.z);
    }
    // dynamic level bits
    for (const d of this.dyn) {
      if (d.kind === 'gate') {
        const g = d.o, sx = g.max.x - g.min.x, sy = g.max.y - g.min.y, sz = g.max.z - g.min.z;
        d.m.scale.set(sx, sy, sz); d.m.position.set((g.min.x + g.max.x) / 2, (g.min.y + g.max.y) / 2, (g.min.z + g.max.z) / 2);
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
      am.g.rotation.y = Math.sin(t * 0.8 + am.a.x) * 0.3;
    }
    if (tgt && !B.target && tgt.kind !== 'anchor' && opts.showTarget) {
      const o = tgt.obj; this.marker.visible = true; this.marker.position.set(o.pos.x, o.pos.y + o.half.y + 0.45 + Math.sin(t * 5) * 0.08, o.pos.z);
      this.marker.scale.setScalar(o.kind === 'crate' ? 1.1 : 0.8); this.marker.material.opacity = 0.55;
    } else this.marker.visible = false;
    // beam
    if (B.target) {
      const a = new THREE.Vector3(B.pos.x, B.pos.y + 0.85, B.pos.z);
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
      this.exitMesh.padMat.emissiveIntensity = 0.35 + inside * 0.35 + Math.sin(t * 3) * 0.1;
      this.exitMesh.beam.material.opacity = 0.08 + inside * 0.1;
    }
    for (const c of this.cpMeshes) { c.bulbM.color.set(c.cp.hit ? 0x9dffb0 : 0x777777); c.bulbM.emissive.set(c.cp.hit ? 0x2ec48f : 0x000000); }
    for (const g of this.gears) g.rotation.z += g.userData.speed * dt;
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
    this.renderer.render(this.scene, this.camera);
  }
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
    if (p.grounded && !R.wasG) R.land = 0.18;
    R.wasG = p.grounded;
    if (R.land > 0) { R.land -= dt; sq = 1 - R.land * 1.2; }
    if (air) sq = 1 + Math.max(-0.12, Math.min(0.15, p.vel.y * 0.012));
    if (p.pulledBy || (p.target && p.target.kind === 'anchor')) sq = 1 + Math.sin(this.time * 20) * 0.04;
    R.body.scale.set(1 / Math.sqrt(sq), sq, 1 / Math.sqrt(sq));
    R.body.position.y = (sq - 1) * -0.3 + (p.grounded && sp > 0.5 ? Math.abs(Math.sin(R.walk * 2)) * 0.06 : 0);
    R.body.rotation.x = p.grounded ? Math.min(0.15, sp * 0.02) : 0;
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
