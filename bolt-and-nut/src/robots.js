// Bolt & Nut — the two player robots.
// makeBolt(fancy) / makeNut(fancy) return the same shapes render.js's poseRobot expects:
//   Bolt: { root, body, eyes, feet, mag, baseY }   Nut: { root, body, eyes, feet, dish, baseY }
// fancy = true  -> PBR materials (needs scene.environment for the metals to read well), smooth geometry, details.
// fancy = false -> Lambert materials, low segment counts, for software WebGL.
// Body is centred at the origin; feet touch y = -half (Bolt 0.55, Nut 0.45). Robots face +z.
import * as THREE from 'three';

const RED = 0xe23a42, RED_DARK = 0xa8202c, BLUE = 0x2a72e6, BLUE_DARK = 0x2258b8;

/* ---------------- procedural textures (built once, shared) ---------------- */
let TEX = null;
function canvas(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  return c;
}
function textures() {
  if (TEX) return TEX;
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  // brushed steel: fine horizontal streaks
  const brushed = canvas(256, 256, (g, w, h) => {
    g.fillStyle = '#c9cdd3'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 900; i++) {
      const y = rnd() * h, l = 20 + rnd() * 120, x = rnd() * w, v = 175 + rnd() * 70;
      g.strokeStyle = `rgba(${v},${v},${v + 4},${0.25 + rnd() * 0.35})`; g.lineWidth = 0.6 + rnd();
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + l, y + (rnd() - 0.5)); g.stroke();
    }
  });
  // roughness variation for steel (streaky)
  const brushedR = canvas(256, 256, (g, w, h) => {
    g.fillStyle = '#5a5a5a'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 700; i++) {
      const y = rnd() * h, l = 30 + rnd() * 150, x = rnd() * w, v = 60 + rnd() * 90;
      g.strokeStyle = `rgba(${v},${v},${v},0.5)`; g.lineWidth = 0.5 + rnd() * 1.5;
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + l, y); g.stroke();
    }
  });
  // painted metal roughness: soft mottling plus tiny scuffs, so the clearcoat highlight breaks up a little
  const paintR = canvas(256, 256, (g, w, h) => {
    g.fillStyle = '#6e6e6e'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 120; i++) {
      const x = rnd() * w, y = rnd() * h, r = 8 + rnd() * 30, v = 90 + rnd() * 50;
      const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${v},${v},${v},0.35)`); gr.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2);
    }
    for (let i = 0; i < 160; i++) {
      const x = rnd() * w, y = rnd() * h, a = rnd() * Math.PI, l = 2 + rnd() * 8;
      g.strokeStyle = `rgba(200,200,200,${0.2 + rnd() * 0.3})`; g.lineWidth = 0.6;
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke();
    }
  });
  // rubber: fine grain
  const rubber = canvas(128, 128, (g, w, h) => {
    const d = g.createImageData(w, h);
    for (let i = 0; i < w * h; i++) { const v = 150 + rnd() * 90; d.data[i * 4] = d.data[i * 4 + 1] = d.data[i * 4 + 2] = v; d.data[i * 4 + 3] = 255; }
    g.putImageData(d, 0, 0);
  });
  // tread bump for the soles
  const tread = canvas(128, 128, (g, w, h) => {
    g.fillStyle = '#808080'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#303030';
    for (let y = 0; y < h; y += 16) g.fillRect(0, y, w, 6);
  });
  // torso bump: a riveted service hatch on the back of Bolt's shank
  const seams = canvas(512, 256, (g, w, h) => {
    g.fillStyle = '#808080'; g.fillRect(0, 0, w, h);
    g.strokeStyle = '#2a2a2a'; g.lineWidth = 3;
    // back panel (u ~ 0.5 is the back of a lathe whose seam starts at +z)
    g.strokeRect(w * 0.4, h * 0.2, w * 0.2, h * 0.22);
    g.fillStyle = '#2a2a2a';
    for (const [x, y] of [[0.415, 0.23], [0.585, 0.23], [0.415, 0.39], [0.585, 0.39]]) { g.beginPath(); g.arc(w * x, h * y, 4, 0, 7); g.fill(); }
  });
  const mk = (c, srgb, rep = 1) => { const t = new THREE.CanvasTexture(c); if (srgb) t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep, rep); t.anisotropy = 4; return t; };
  TEX = { brushed: mk(brushed, true), brushedR: mk(brushedR, false), paintR: mk(paintR, false, 2), rubber: mk(rubber, false, 2), tread: mk(tread, false), seams: mk(seams, false) };
  return TEX;
}

/* ---------------- materials ---------------- */
function mats(fancy) {
  if (!fancy) {
    const L = (color, extra) => new THREE.MeshLambertMaterial({ color, ...extra });
    return {
      paint: (c) => L(c), paintDark: (c) => L(c), steel: () => L(0xcfd4da), chrome: () => L(0xe4e8ee), darkSteel: () => L(0x5d6470),
      rubber: () => L(0x34343c), eyeWhite: () => L(0xffffff), pupil: () => new THREE.MeshBasicMaterial({ color: 0x15172a }),
      iris: (c) => L(c, { emissive: c, emissiveIntensity: 0.35 }), glint: () => new THREE.MeshBasicMaterial({ color: 0xffffff }),
      lid: (c) => L(c, { side: THREE.DoubleSide }), led: (c) => new THREE.MeshBasicMaterial({ color: c }), glow: (c, e) => L(c, { emissive: e }), rim: () => L(0x2a2d3a), hole: () => new THREE.MeshBasicMaterial({ color: 0x14254a }),
    };
  }
  const T = textures();
  return {
    paint: (c) => new THREE.MeshPhysicalMaterial({ color: c, metalness: 0.15, roughness: 0.38, roughnessMap: T.paintR, clearcoat: 1, clearcoatRoughness: 0.06 }),
    paintDark: (c) => new THREE.MeshPhysicalMaterial({ color: c, metalness: 0.2, roughness: 0.42, roughnessMap: T.paintR, clearcoat: 0.8, clearcoatRoughness: 0.1 }),
    steel: () => new THREE.MeshStandardMaterial({ color: 0xd4d8de, metalness: 1, roughness: 0.38, map: T.brushed, roughnessMap: T.brushedR }),
    chrome: () => new THREE.MeshStandardMaterial({ color: 0xf2f4f7, metalness: 1, roughness: 0.12 }),
    darkSteel: () => new THREE.MeshStandardMaterial({ color: 0x4a515c, metalness: 0.9, roughness: 0.45, map: T.brushed }),
    rubber: () => new THREE.MeshStandardMaterial({ color: 0x2c2c33, metalness: 0, roughness: 0.92, roughnessMap: T.rubber, bumpMap: T.tread, bumpScale: 1.5 }),
    eyeWhite: () => new THREE.MeshPhysicalMaterial({ color: 0xfbfbf8, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.03, sheen: 0 }),
    pupil: () => new THREE.MeshPhysicalMaterial({ color: 0x0c0d18, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.02 }),
    iris: (c) => new THREE.MeshPhysicalMaterial({ color: c, emissive: c, emissiveIntensity: 0.55, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.02 }),
    glint: () => new THREE.MeshBasicMaterial({ color: 0xffffff }),
    rim: () => new THREE.MeshPhysicalMaterial({ color: 0x23262f, metalness: 0.2, roughness: 0.55, clearcoat: 0.4, clearcoatRoughness: 0.35 }),
    led: (c) => new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 1.1, roughness: 0.2 }),
    lid: (c) => new THREE.MeshPhysicalMaterial({ color: c, metalness: 0.15, roughness: 0.4, clearcoat: 1, clearcoatRoughness: 0.08, side: THREE.DoubleSide }),
    glow: (c, e) => new THREE.MeshPhysicalMaterial({ color: c, emissive: e, emissiveIntensity: 1, roughness: 0.15, transmission: 0, clearcoat: 1, clearcoatRoughness: 0.05 }),
    hole: () => new THREE.MeshStandardMaterial({ color: 0x1a1f2a, metalness: 0.8, roughness: 0.5 }),
  };
}

/* ---------------- geometry helpers ---------------- */
function mesh(geo, mat, parent, opts = {}) {
  const m = new THREE.Mesh(geo, mat);
  m.castShadow = true; m.receiveShadow = opts.receive !== false;
  if (opts.pos) m.position.set(...opts.pos);
  if (opts.rot) m.rotation.set(...opts.rot);
  if (opts.scale) m.scale.set(...opts.scale);
  if (parent) parent.add(m);
  return m;
}
// lathe profile of a tapered cylinder with rounded top/bottom edges
function roundedTube(rBot, rTop, h, rc, arcSegs, radial) {
  const pts = [], y0 = -h / 2, y1 = h / 2;
  pts.push(new THREE.Vector2(0, y0));
  for (let i = 0; i <= arcSegs; i++) { const a = -Math.PI / 2 + (i / arcSegs) * Math.PI / 2; pts.push(new THREE.Vector2(rBot - rc + Math.cos(a) * rc, y0 + rc + Math.sin(a) * rc)); }
  for (let i = 0; i <= arcSegs; i++) { const a = (i / arcSegs) * Math.PI / 2; pts.push(new THREE.Vector2(rTop - rc + Math.cos(a) * rc, y1 - rc + Math.sin(a) * rc)); }
  pts.push(new THREE.Vector2(0, y1));
  const g = new THREE.LatheGeometry(pts, radial);
  // lathe u=0 is +z (front), u=0.5 is -z (back): the seams texture puts its service panel at the back
  return g;
}
// bevelled hexagonal prism standing on y, flat faces toward ±z. Optional round bore.
function hexPrism(r, h, bevel, bevelSegs, bore = 0, boreSegs = 24) {
  const s = new THREE.Shape(), R = r - bevel;
  for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; const x = Math.cos(a) * R, y = Math.sin(a) * R; i ? s.lineTo(x, y) : s.moveTo(x, y); }
  s.closePath();
  if (bore > 0) { const p = new THREE.Path(); p.absarc(0, 0, bore + bevel, 0, Math.PI * 2, true); s.holes.push(p); }
  const depth = Math.max(0.001, h - 2 * bevel);
  const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel, bevelSegments: bevelSegs, curveSegments: boreSegs });
  g.translate(0, 0, -depth / 2); g.rotateX(-Math.PI / 2);
  g.computeVertexNormals();
  return g;
}
// smooth rounded box (w x h x d, corner radius r): a subdivided box whose vertices are pushed onto the rounded shell
function roundBox(w, h, d, r, n) {
  const g = new THREE.BoxGeometry(w, h, d, n, n, n), P = g.attributes.position, N = g.attributes.normal;
  const hx = w / 2 - r, hy = h / 2 - r, hz = d / 2 - r, v = new THREE.Vector3(), c = new THREE.Vector3();
  for (let i = 0; i < P.count; i++) {
    v.fromBufferAttribute(P, i);
    c.set(THREE.MathUtils.clamp(v.x, -hx, hx), THREE.MathUtils.clamp(v.y, -hy, hy), THREE.MathUtils.clamp(v.z, -hz, hz));
    v.sub(c); if (v.lengthSq() < 1e-12) continue;
    v.normalize(); N.setXYZ(i, v.x, v.y, v.z); v.multiplyScalar(r).add(c); P.setXYZ(i, v.x, v.y, v.z);
  }
  return g;
}
function rivet(r, q) { return new THREE.SphereGeometry(r, q ? 7 : 4, q ? 3 : 2, 0, Math.PI * 2, 0, Math.PI / 2); }

/* ---------------- eyes ---------------- */
// spherical cap of angular radius `ang` around +z (front of the eye); open-backed, so we never pay for hidden triangles
function cap(r, ang, w, h) { return new THREE.SphereGeometry(r, w, h, 0, Math.PI * 2, 0, ang).rotateX(Math.PI / 2); }
// Returns a Group placed at eye height; children sit at y = 0 eyes.userData holds the lids and gaze groups render.js animates.
function makeEyes(parent, M, q, { y, z, spread, r, iris, bezel, lid }) {
  const grp = new THREE.Group(); grp.position.y = y; parent.add(grp);
  const S = [1, 1.12, 0.62];
  const scl = cap(r, 1.6, q ? 20 : 12, q ? 8 : 5);
  const irg = cap(r * (q ? 1.012 : 1.03), 0.78, q ? 22 : 12, q ? 3 : 2);
  const pug = cap(r * (q ? 1.024 : 1.06), 0.46, q ? 22 : 12, 2);
  const glg = new THREE.SphereGeometry(r * 0.15, q ? 8 : 4, q ? 6 : 3);
  // eyelids: hemispherical shells a touch bigger than the eye, hinged on the eye's centre.
  // rotation.x of the upper lid: about -0.8 open, 0 half shut, PI/2 closed; the lower lid: 1.2 open, 0 half, -PI/2 closed
  const lidG = new THREE.SphereGeometry(r * 1.13, q ? 20 : 10, q ? 6 : 3, 0, Math.PI * 2, 0, Math.PI / 2);
  const lidM = M.lid(lid);
  const white = M.eyeWhite(), irisM = M.iris(iris), pupilM = M.pupil(), glintM = M.glint(), bezM = M.rim();
  const lids = [], looks = [];
  for (const s of [-1, 1]) {
    const e = new THREE.Group(); e.position.set(s * spread, 0, z); e.rotation.y = s * 0.1; grp.add(e);
    mesh(scl, white, e, { scale: S });
    // iris + pupil turn together inside the white so the eyes can look around
    const sg = new THREE.Group(); sg.scale.set(...S); e.add(sg); const look = new THREE.Group(); sg.add(look); looks.push(look); // scale outside the turn, so the iris slides over the squashed eye
    mesh(irg, irisM, look, { rot: [-0.05, 0, 0] });
    mesh(pug, pupilM, look, { rot: [-0.05, 0, 0] });
    mesh(glg, glintM, e, { pos: [r * 0.3, r * 0.32, r * 0.58], scale: [1, 1, 0.5], receive: false });
    if (q) mesh(new THREE.SphereGeometry(r * 0.07, 6, 4), glintM, e, { pos: [-r * 0.22, -r * 0.3, r * 0.6], receive: false });
    if (bezel) mesh(new THREE.TorusGeometry(r * 1.0, r * 0.13, q ? 5 : 3, q ? 24 : 10), bezM, e, { pos: [0, 0, -r * 0.02], scale: [1, 1.12, 1] });
    // tilt group (brow angle) -> hinge (open/close)
    const tilt = new THREE.Group(); tilt.scale.set(...S); e.add(tilt);
    const up = new THREE.Group(); tilt.add(up); mesh(lidG, lidM, up, { receive: false }).castShadow = false;
    const lo = new THREE.Group(); lo.rotation.z = Math.PI; tilt.add(lo); mesh(lidG, lidM, lo, { receive: false }).castShadow = false;
    up.rotation.x = -0.8; lo.rotation.x = 1.2;
    lids.push({ s, tilt, up, lo });
  }
  grp.userData = { lids, looks };
  return grp;
}

/* ---------------- Bolt ---------------- */
export function makeBolt(fancy = true) {
  const q = !!fancy, M = mats(q);
  const root = new THREE.Group(), body = new THREE.Group(); root.add(body);
  const red = M.paint(RED), dark = M.paintDark(RED_DARK), steel = M.steel(), chrome = M.chrome(), rubber = M.rubber(), dsteel = M.darkSteel();
  if (q) { red.bumpMap = textures().seams; red.bumpScale = 6; }

  // shank / torso
  const tH = 0.66, tY = -0.08, rB = 0.355, rT = 0.325;
  mesh(roundedTube(rB, rT, tH, 0.07, q ? 4 : 1, q ? 32 : 9), red, body, { pos: [0, tY, 0] });
  // chrome thread spiral round the lower shank
  if (q) {
    const turns = 3, y0 = tY - tH / 2 + 0.06, y1 = y0 + 0.21;
    class Helix extends THREE.Curve { getPoint(t, out = new THREE.Vector3()) { const a = Math.PI + t * turns * Math.PI * 2, y = y0 + (y1 - y0) * t; const k = (y - (tY - tH / 2)) / tH, rr = rB + (rT - rB) * k + 0.004; return out.set(Math.sin(a) * rr, y, Math.cos(a) * rr); } }
    mesh(new THREE.TubeGeometry(new Helix(), 66, 0.021, 5, false), chrome, body);
  } else {
    for (let i = 0; i < 3; i++) { const y = -0.36 + i * 0.07, k = (y - (tY - tH / 2)) / tH, rr = rB + (rT - rB) * k + 0.014; mesh(new THREE.CylinderGeometry(rr, rr, 0.03, 9, 1, true), steel, body, { pos: [0, y, 0] }); }
  }
  // seam ring + rivets above the thread
  const seamY = tY - tH / 2 + 0.31;
  mesh(new THREE.TorusGeometry(0.343, 0.012, q ? 4 : 3, q ? 30 : 9), dsteel, body, { pos: [0, seamY, 0], rot: [Math.PI / 2, 0, 0] });
  if (q) for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2 + Math.PI / 6; const rr = 0.337; mesh(rivet(0.018, q), steel, body, { pos: [Math.sin(a) * rr, seamY + 0.03, Math.cos(a) * rr], rot: [Math.PI / 2, a, 0, 'YXZ'] }); }

  // washer + hex head
  mesh(new THREE.CylinderGeometry(0.375, 0.385, 0.045, q ? 36 : 8), steel, body, { pos: [0, 0.255, 0] });
  const head = mesh(hexPrism(0.45, 0.24, q ? 0.035 : 0, q ? 3 : 1), dark, body, { pos: [0, 0.395, 0] });
  if (!q) head.geometry = new THREE.CylinderGeometry(0.43, 0.43, 0.24, 6).rotateY(Math.PI / 6);
  // head top cap plate (steel) the magnet mounts on
  mesh(new THREE.CylinderGeometry(0.2, 0.23, 0.035, q ? 24 : 6), steel, body, { pos: [0, 0.53, 0] });
  // rivets on the five other head faces, glowing indicator on the front face
  if (q) for (let i = 1; i < 6; i++) { const a = (i / 6) * Math.PI * 2; const rr = 0.392; for (const dx of [0]) mesh(rivet(0.017, q), steel, body, { pos: [Math.sin(a) * rr + Math.cos(a) * dx, 0.395, Math.cos(a) * rr - Math.sin(a) * dx], rot: [Math.PI / 2, a, 0, 'YXZ'] }); }
  mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.02, q ? 20 : 6), dsteel, body, { pos: [0, 0.395, 0.392], rot: [Math.PI / 2, 0, 0] });
  mesh(new THREE.SphereGeometry(0.032, q ? 16 : 6, q ? 10 : 4), M.led(0x45e83a), body, { pos: [0, 0.395, 0.402], scale: [1, 1, 0.6], receive: false });

  // horseshoe magnet
  // horseshoe magnet: U-shaped, poles pointing up, red body with steel pole tips
  const mag = new THREE.Group(); mag.position.y = 0.55; body.add(mag);
  const magRed = M.paint(0xe8323c), MR = 0.17, MT = 0.068, MC = 0.25;
  mesh(new THREE.CylinderGeometry(0.06, 0.085, 0.05, q ? 20 : 6), dsteel, mag, { pos: [0, 0.02, 0] });
  mesh(new THREE.TorusGeometry(MR, MT, q ? 12 : 5, q ? 18 : 6, Math.PI), magRed, mag, { pos: [0, MC, 0], rot: [0, 0, Math.PI] });
  for (const s of [-1, 1]) {
    mesh(new THREE.CylinderGeometry(MT, MT, 0.07, q ? 16 : 6, 1, true), magRed, mag, { pos: [s * MR, MC + 0.035, 0] });
    mesh(new THREE.CylinderGeometry(MT + 0.004, MT + 0.004, 0.016, q ? 16 : 6, 1, !q), dsteel, mag, { pos: [s * MR, MC + 0.078, 0] });
    mesh(new THREE.CylinderGeometry(MT + 0.002, MT + 0.002, 0.085, q ? 16 : 6), q ? chrome : steel, mag, { pos: [s * MR, MC + 0.128, 0] });
  }
  // eyes: big, glossy, set in chrome bezels on the shank
  const eyesG = makeEyes(body, M, q, { y: 0.06, z: 0.27, spread: 0.135, r: 0.115, iris: 0xffa51f, bezel: true, lid: RED_DARK });

  // arms: little ball-jointed nubs
  for (const s of [-1, 1]) {
    mesh(new THREE.SphereGeometry(0.06, q ? 10 : 5, q ? 6 : 3), dsteel, body, { pos: [s * 0.35, -0.04, 0] });
    mesh(new THREE.CapsuleGeometry(0.055, 0.12, q ? 3 : 1, q ? 10 : 5), dark, body, { pos: [s * 0.39, -0.12, 0.02], rot: [0, 0, s * 0.35] });
  }

  // feet
  const feet = [], fg = q ? roundBox(0.2, 0.13, 0.28, 0.05, 3) : new THREE.BoxGeometry(0.2, 0.13, 0.28);
  for (const s of [-1, 1]) { const f = mesh(fg, rubber, body, { pos: [s * 0.15, -0.485, 0.03] }); feet.push(f); if (q) mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.07, 8, 1, true), dsteel, body, { pos: [s * 0.15, -0.41, 0] }); }
  return { root, body, eyes: eyesG, feet, mag, baseY: 0 };
}

/* ---------------- Nut ---------------- */
export function makeNut(fancy = true) {
  const q = !!fancy, M = mats(q);
  const root = new THREE.Group(), body = new THREE.Group(); root.add(body);
  const blue = M.paint(BLUE), dark = M.paintDark(BLUE_DARK), steel = M.steel(), chrome = M.chrome(), rubber = M.rubber(), dsteel = M.darkSteel();

  // hex nut body with a real bore through it
  const R = 0.47, H = 0.62, bore = 0.19;
  if (q) mesh(hexPrism(R, H, 0.06, 3, bore, 20), blue, body, { pos: [0, 0, 0] });
  else mesh(new THREE.CylinderGeometry(R, R, H, 6).rotateY(Math.PI / 6), blue, body);
  // bore liner with a dark inside, and a chrome collar
  if (q) {
    const liner = mesh(new THREE.CylinderGeometry(bore + 0.002, bore + 0.002, H - 0.02, 24, 1, true), M.hole(), body, { receive: false });
    liner.material.side = THREE.BackSide;
    mesh(new THREE.TorusGeometry(bore + 0.03, 0.022, 5, 28), chrome, body, { pos: [0, H / 2 - 0.005, 0], rot: [Math.PI / 2, 0, 0] });
  } else {
    mesh(new THREE.CylinderGeometry(0.43, R, 0.06, 6).rotateY(Math.PI / 6), dark, body, { pos: [0, H / 2 + 0.02, 0] });
    mesh(new THREE.CylinderGeometry(bore, bore, 0.02, 10), M.hole(), body, { pos: [0, H / 2 + 0.05, 0] });
  }
  // seam band below the eyes
  const fr = R * Math.cos(Math.PI / 6);
  if (!q) mesh(new THREE.CylinderGeometry(R + 0.008, R + 0.008, 0.03, 6, 1, true).rotateY(Math.PI / 6), dark, body, { pos: [0, -0.17, 0] });
  // corner rivets on the front face, little grille under the eyes
  if (q) {
    for (const [x, y] of [[-0.17, 0.22], [0.17, 0.22], [-0.17, -0.25], [0.17, -0.25]]) mesh(rivet(0.02, q), steel, body, { pos: [x, y, fr - 0.004], rot: [Math.PI / 2, 0, 0] });
    for (let i = 0; i < 3; i++) mesh(new THREE.CapsuleGeometry(0.009, 0.1, 1, 5), dsteel, body, { pos: [0, -0.1 - i * 0.025, fr + 0.002], rot: [0, 0, Math.PI / 2] });
    // side rivets on the other faces
    for (let i = 1; i < 6; i++) { const a = (i / 6) * Math.PI * 2; if (i === 3) continue; mesh(rivet(0.02, q), steel, body, { pos: [Math.sin(a) * (fr - 0.004), 0.05, Math.cos(a) * (fr - 0.004)], rot: [Math.PI / 2, a, 0, 'YXZ'] }); }
  }
  // indicator light on the front top
  mesh(new THREE.SphereGeometry(0.026, q ? 14 : 6, q ? 10 : 4), M.led(0xffd23a), body, { pos: [0.27, 0.22, fr], scale: [1, 1, 0.6], receive: false });

  // repulsor dish on top (pulses via emissiveIntensity)
  const dishY = H / 2 + 0.01;
  if (q) mesh(new THREE.CylinderGeometry(0.16, 0.17, 0.04, 24), dsteel, body, { pos: [0, dishY + 0.005, 0] });
  const dish = mesh(new THREE.SphereGeometry(0.13, q ? 24 : 8, q ? 8 : 3, 0, Math.PI * 2, 0, Math.PI / 2), M.glow(0xbfe0ff, q ? 0x2f86ff : 0x1d4f9a), body, { pos: [0, dishY + 0.02, 0], scale: [1, 0.75, 1], receive: false });
  if (q) {
    mesh(new THREE.TorusGeometry(0.135, 0.018, 6, 30), chrome, body, { pos: [0, dishY + 0.025, 0], rot: [Math.PI / 2, 0, 0] });
    mesh(new THREE.TorusGeometry(0.075, 0.008, 3, 20), chrome, dish, { pos: [0, 0.105, 0], rot: [Math.PI / 2, 0, 0], scale: [1, 1, 1 / 0.75] });
  }

  // eyes on the front flat face
  const eyesG = makeEyes(body, M, q, { y: 0.05, z: fr - 0.035, spread: 0.155, r: 0.12, iris: 0x2ad4c8, bezel: true, lid: BLUE_DARK });

  // arms: shoulder joints + rounded mitts
  for (const s of [-1, 1]) {
    mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.06, q ? 14 : 5), dsteel, body, { pos: [s * (fr + 0.02), -0.02, 0], rot: [0, 0, Math.PI / 2] });
    mesh(new THREE.SphereGeometry(0.1, q ? 14 : 7, q ? 9 : 5), dark, body, { pos: [s * 0.52, -0.05, 0] });
  }
  // feet
  const feet = [], fg = q ? roundBox(0.22, 0.12, 0.28, 0.05, 3) : new THREE.BoxGeometry(0.22, 0.12, 0.28);
  for (const s of [-1, 1]) { const f = mesh(fg, rubber, body, { pos: [s * 0.18, -0.39, 0.03] }); feet.push(f); }
  return { root, body, eyes: eyesG, feet, dish, baseY: 0 };
}
