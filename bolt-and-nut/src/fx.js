// Bolt & Nut: procedural surface textures (drawn on canvases, no image files).
// All textures are light grey detail maps: the level palette tints them through vertex colours.
import * as THREE from 'three';

function rng(seed) { let s = seed >>> 0; return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

function make(size, draw, { srgb = true, repeat = true } = {}) {
  const c = document.createElement('canvas'); c.width = c.height = size;
  const g = c.getContext('2d');
  draw(g, size, rng(size * 7 + draw.length));
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 4; t.userData.keep = true;
  return t;
}
const grey = v => { const k = Math.max(0, Math.min(255, Math.round(v))); return `rgb(${k},${k},${k})`; };

// speckle noise + soft blotches, so flat surfaces never look like flat colour
function grime(g, S, r, base, amt = 14, blotches = 10) {
  g.fillStyle = grey(base); g.fillRect(0, 0, S, S);
  for (let i = 0; i < blotches; i++) {
    const x = r() * S, y = r() * S, rad = S * (0.08 + r() * 0.22);
    const gr = g.createRadialGradient(x, y, 0, x, y, rad);
    const v = base - 6 - r() * 10; gr.addColorStop(0, `rgba(${v | 0},${v | 0},${v | 0},0.16)`); gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr; g.fillRect(0, 0, S, S);
  }
  const img = g.getImageData(0, 0, S, S), d = img.data;
  for (let i = 0; i < d.length; i += 4) { const n = (r() - 0.5) * amt; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
  g.putImageData(img, 0, 0);
}
function rivet(g, x, y, rad) {
  g.fillStyle = grey(150); g.beginPath(); g.arc(x + 1, y + 1, rad, 0, 7); g.fill();
  g.fillStyle = grey(250); g.beginPath(); g.arc(x, y, rad, 0, 7); g.fill();
  g.fillStyle = grey(215); g.beginPath(); g.arc(x + rad * 0.25, y + rad * 0.25, rad * 0.6, 0, 7); g.fill();
}

export function makeSurfaces() {
  // floor tile: one 2 m tile, bevelled edges and grout
  const tile = make(256, (g, S, r) => {
    grime(g, S, r, 242, 10, 8);
    g.fillStyle = grey(168); g.fillRect(0, 0, S, 5); g.fillRect(0, 0, 5, S);
    g.fillStyle = grey(255); g.fillRect(5, 5, S - 5, 3); g.fillRect(5, 5, 3, S - 5);
    g.fillStyle = grey(212); g.fillRect(5, S - 4, S - 5, 4); g.fillRect(S - 4, 5, 4, S - 5);
    // faint inner panel line and scuffs
    g.strokeStyle = 'rgba(0,0,0,0.06)'; g.lineWidth = 2; g.strokeRect(S * 0.12, S * 0.12, S * 0.76, S * 0.76);
    g.strokeStyle = 'rgba(0,0,0,0.07)'; g.lineWidth = 1.5;
    for (let i = 0; i < 6; i++) { const x = r() * S, y = r() * S, a = r() * 3, l = 10 + r() * 30; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke(); }
  });
  // metal side panels: 2 m square, seam every 1 m with rivets, darker grime at the base
  const panel = make(256, (g, S, r) => {
    grime(g, S, r, 236, 12, 12);
    for (const y of [0, S / 2]) {
      g.fillStyle = grey(160); g.fillRect(0, y, S, 3); g.fillStyle = grey(255); g.fillRect(0, y + 3, S, 2);
      for (let x = 14; x < S; x += 32) rivet(g, x, y + 12, 3.2);
    }
    g.fillStyle = grey(160); g.fillRect(0, 0, 3, S); g.fillStyle = grey(252); g.fillRect(3, 0, 2, S);
    const gr = g.createLinearGradient(0, S / 2, 0, S); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(40,30,20,0.12)');
    g.fillStyle = gr; g.fillRect(0, S / 2 + 5, S, S / 2 - 5);
  });
  // iron floor: diamond tread plate, 1 m
  const iron = make(256, (g, S, r) => {
    grime(g, S, r, 205, 16, 6);
    const n = 8, cs = S / n;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const cx = (i + 0.5) * cs, cy = (j + 0.5) * cs, ang = (i + j) % 2 ? Math.PI / 4 : -Math.PI / 4;
      g.save(); g.translate(cx, cy); g.rotate(ang);
      g.fillStyle = grey(140); g.fillRect(-cs * 0.36 + 1.5, -3 + 1.5, cs * 0.72, 6);
      g.fillStyle = grey(255); g.fillRect(-cs * 0.36, -3, cs * 0.72, 6);
      g.restore();
    }
    g.strokeStyle = 'rgba(255,255,255,0.25)'; g.lineWidth = 1;
    for (let i = 0; i < 14; i++) { const x = r() * S, y = r() * S, a = r() * 3, l = 20 + r() * 60; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke(); }
  });
  // back wall: 4 m, big panels, a vent and a stripe of rivets
  const wall = make(512, (g, S, r) => {
    grime(g, S, r, 238, 10, 16);
    const P = S / 2;
    for (const x of [0, P]) { g.fillStyle = grey(165); g.fillRect(x, 0, 4, S); g.fillStyle = grey(255); g.fillRect(x + 4, 0, 2, S); }
    for (const y of [0, P]) { g.fillStyle = grey(165); g.fillRect(0, y, S, 4); g.fillStyle = grey(255); g.fillRect(0, y + 4, S, 2); }
    for (let x = 20; x < S; x += 40) { rivet(g, x, 18, 4); rivet(g, x, P + 18, 4); }
    // vent in one panel
    const vx = P + 60, vy = 90, vw = 130, vh = 90;
    g.fillStyle = grey(120); g.fillRect(vx - 4, vy - 4, vw + 8, vh + 8);
    for (let y = vy; y < vy + vh; y += 12) { g.fillStyle = grey(70); g.fillRect(vx, y, vw, 7); g.fillStyle = grey(230); g.fillRect(vx, y + 7, vw, 5); }
    // a hazard stripe along the bottom
    for (let x = -40; x < S + 40; x += 40) { g.fillStyle = 'rgba(0,0,0,0.10)'; g.beginPath(); g.moveTo(x, S - 34); g.lineTo(x + 20, S - 34); g.lineTo(x + 40, S - 10); g.lineTo(x + 20, S - 10); g.fill(); }
    const gr = g.createLinearGradient(0, 0, 0, S); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(30,20,10,0.10)');
    g.fillStyle = gr; g.fillRect(0, 0, S, S);
  });
  // brushed steel for props
  const steel = make(256, (g, S, r) => {
    grime(g, S, r, 225, 6, 4);
    for (let y = 0; y < S; y++) { g.fillStyle = `rgba(${r() < 0.5 ? '255,255,255' : '0,0,0'},${0.03 + r() * 0.05})`; g.fillRect(0, y, S, 1); }
  });
  // gate shutters: diagonal stripes inside a frame
  // gate shutters: horizontal roller slats
  const hazard = make(128, (g, S, r) => {
    grime(g, S, r, 240, 8, 3);
    for (let y = 0; y < S; y += 32) {
      const gr = g.createLinearGradient(0, y, 0, y + 32); gr.addColorStop(0, grey(255)); gr.addColorStop(0.7, grey(215)); gr.addColorStop(1, grey(150));
      g.fillStyle = gr; g.fillRect(0, y, S, 32); g.fillStyle = grey(120); g.fillRect(0, y + 30, S, 2);
    }
  });
  // pressure plate top: grooved rings and a centre dot
  const plate = make(128, (g, S, r) => {
    g.fillStyle = grey(235); g.fillRect(0, 0, S, S);
    for (let k = 0; k < 4; k++) { g.strokeStyle = grey(170); g.lineWidth = 3; g.beginPath(); g.arc(S / 2, S / 2, S * (0.14 + k * 0.1), 0, 7); g.stroke(); }
    g.fillStyle = grey(255); g.beginPath(); g.arc(S / 2, S / 2, S * 0.08, 0, 7); g.fill();
  }, { repeat: false });
  return { tile, panel, iron, wall, steel, hazard, plate };
}

// vertical gradient for the sky / hall behind the level
export function gradientTex(top, mid, bot) {
  const c = document.createElement('canvas'); c.width = 4; c.height = 256;
  const g = c.getContext('2d'); const gr = g.createLinearGradient(0, 0, 0, 256);
  gr.addColorStop(0, top); gr.addColorStop(0.55, mid); gr.addColorStop(1, bot);
  g.fillStyle = gr; g.fillRect(0, 0, 4, 256);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.userData.keep = true; return t;
}

// the far wall of the factory hall: tall windows letting light in
export function hallTex() {
  return make(512, (g, S, r) => {
    grime(g, S, r, 200, 8, 10);
    for (let i = 0; i < 2; i++) {
      const x = 40 + i * 256, y = 60, w = 176, h = 300;
      g.fillStyle = grey(120); g.fillRect(x - 10, y - 10, w + 20, h + 20);
      const gr = g.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, '#ffffff'); gr.addColorStop(1, '#d8e6f0');
      g.fillStyle = gr; g.fillRect(x, y, w, h);
      g.fillStyle = grey(110); for (let k = 1; k < 4; k++) g.fillRect(x + k * w / 4 - 3, y, 6, h); for (let k = 1; k < 5; k++) g.fillRect(x, y + k * h / 5 - 3, w, 6);
    }
    g.fillStyle = grey(150); g.fillRect(0, 420, S, 8);
  }, { repeat: true });
}
