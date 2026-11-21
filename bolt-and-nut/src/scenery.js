// Bolt & Nut: background scenery for the fancy look. Gives the factory depth:
// a hall floor far below, steel columns, catwalks, pipes, hanging lamps with light shafts,
// detailed gears, machines and floating dust. Purely visual (no collision).
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const col = h => new THREE.Color(h);

function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

// a proper gear outline: teeth, a rim, spokes and a hub, extruded with a bevel
function gearGeometry(r, teeth, depth, spokes) {
  const sh = new THREE.Shape();
  const tooth = 0.42 + r * 0.04, root = r, tip = r + tooth;
  for (let i = 0; i < teeth; i++) {
    const a0 = (i / teeth) * Math.PI * 2, da = (Math.PI * 2) / teeth;
    const pts = [[root, a0], [tip, a0 + da * 0.18], [tip, a0 + da * 0.45], [root, a0 + da * 0.63]];
    pts.forEach(([rr, a], k) => { const x = Math.cos(a) * rr, y = Math.sin(a) * rr; if (i === 0 && k === 0) sh.moveTo(x, y); else sh.lineTo(x, y); });
    const a1 = a0 + da; sh.lineTo(Math.cos(a1) * root, Math.sin(a1) * root);
  }
  // spoke windows between the rim and the hub
  const rin = r * 0.72, hub = r * 0.26;
  for (let k = 0; k < spokes; k++) {
    const a0 = (k / spokes) * Math.PI * 2 + 0.22, a1 = ((k + 1) / spokes) * Math.PI * 2 - 0.22;
    const h = new THREE.Path();
    h.moveTo(Math.cos(a0) * hub * 1.25, Math.sin(a0) * hub * 1.25);
    h.absarc(0, 0, rin, a0 + 0.06, a1 - 0.06, false);
    h.lineTo(Math.cos(a1) * hub * 1.25, Math.sin(a1) * hub * 1.25);
    sh.holes.push(h);
  }
  const axle = new THREE.Path(); axle.absarc(0, 0, r * 0.09, 0, Math.PI * 2, true); sh.holes.push(axle);
  const g = new THREE.ExtrudeGeometry(sh, { depth, bevelEnabled: true, bevelThickness: 0.12, bevelSize: 0.1, bevelSegments: 2, curveSegments: 6 });
  g.translate(0, 0, -depth / 2);
  return g;
}

export function buildScenery(level, w, th, surf, dark) {
  const R = rng(w.def.name ? w.def.name.length * 977 : 7);
  let x0 = Infinity, x1 = -Infinity, yTop = -Infinity, yBot = Infinity;
  for (const s of w.solids) {
    x0 = Math.min(x0, s.min.x); x1 = Math.max(x1, s.max.x);
    if (s.style === 'floor' || s.style === 'iron' || s.style === 'oil') { yTop = Math.max(yTop, s.max.y); yBot = Math.min(yBot, s.max.y); }
  }
  if (!isFinite(yTop)) { yTop = 0; yBot = 0; }
  const floorY = yBot - 18, L = x1 - x0 + 140, cx = (x0 + x1) / 2;
  const steelC = col(th.gear).lerp(col(0x8a909c), 0.55);
  const steel = new THREE.MeshStandardMaterial({ color: steelC, map: surf.steel, roughness: 0.42, metalness: 0.65 });
  const darkSteel = new THREE.MeshStandardMaterial({ color: col(th.pipe).multiplyScalar(0.6).lerp(col(0x30343c), 0.5), roughness: 0.55, metalness: 0.5 });
  const paint = new THREE.MeshStandardMaterial({ color: col(th.pipe), roughness: 0.45, metalness: 0.2 });
  const accent = new THREE.MeshStandardMaterial({ color: 0xf2b84b, roughness: 0.4, metalness: 0.25 });
  const out = { gears: [], motes: null, leds: [] };
  // collect boxes/cylinders per material, merge them into a few meshes
  const bins = new Map();
  const put = (geo, mat, x, y, z, rx = 0, ry = 0, rz = 0) => {
    geo.rotateX(rx); geo.rotateY(ry); geo.rotateZ(rz); geo.translate(x, y, z);
    if (geo.index) geo = geo.toNonIndexed();
    if (!bins.has(mat)) bins.set(mat, []); bins.get(mat).push(geo);
  };
  const box = (sx, sy, sz, mat, x, y, z, ry = 0) => put(new THREE.BoxGeometry(sx, sy, sz), mat, x, y, z, 0, ry);
  const cyl = (r, h, mat, x, y, z, rx = 0, rz = 0, seg = 12) => put(new THREE.CylinderGeometry(r, r, h, seg), mat, x, y, z, rx, 0, rz);

  // 1. the hall floor far below, so there is no void under the level
  const ft = surf.tile.clone(); ft.userData = {}; ft.needsUpdate = true; ft.repeat.set(L / 5, 160 / 5);
  const hallFloor = new THREE.Mesh(new THREE.PlaneGeometry(L, 160), new THREE.MeshStandardMaterial({ map: ft, color: col(th.side).multiplyScalar(dark ? 0.6 : 0.85), roughness: 0.8 }));
  hallFloor.rotation.x = -Math.PI / 2; hallFloor.position.set(cx, floorY, -20); level.add(hallFloor);
  // machines and tanks standing on it (in front of and behind the level)
  for (let x = x0 - 30; x < x1 + 30; x += 7 + R() * 6) {
    for (const zc of [8 + R() * 10, -22 - R() * 18]) {
      if (R() < 0.55) {
        const sx = 2.5 + R() * 4, sy = 2 + R() * 5, sz = 2.5 + R() * 3;
        box(sx, sy, sz, R() < 0.5 ? steel : paint, x, floorY + sy / 2, zc);
        box(sx * 0.6, 0.5, sz * 0.6, darkSteel, x, floorY + sy + 0.25, zc);
        if (R() < 0.5) cyl(0.25, sy * 1.6, accent, x + sx / 2 + 0.4, floorY + sy * 0.8, zc);
      } else {
        const r = 1.2 + R() * 1.6, h = 3 + R() * 6;
        cyl(r, h, steel, x, floorY + h / 2, zc, 0, 0, 16);
        cyl(r * 1.04, 0.25, darkSteel, x, floorY + h * 0.3, zc, 0, 0, 16);
        cyl(r * 1.04, 0.25, darkSteel, x, floorY + h * 0.75, zc, 0, 0, 16);
        put(new THREE.SphereGeometry(r, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), steel, x, floorY + h, zc);
      }
    }
  }
  // 2. steel columns (two rows, the back row further away) with a truss beam on top
  const colTop = yTop + 16;
  const column = (x, z, s) => {
    const h = colTop - floorY;
    box(0.35 * s, h, 0.9 * s, darkSteel, x, floorY + h / 2, z);
    box(0.9 * s, h, 0.12 * s, darkSteel, x, floorY + h / 2, z + 0.45 * s);
    box(0.9 * s, h, 0.12 * s, darkSteel, x, floorY + h / 2, z - 0.45 * s);
    box(1.4 * s, 0.6, 1.4 * s, steel, x, floorY + 0.3, z);
  };
  for (let x = Math.floor(x0 / 12) * 12 - 12; x < x1 + 24; x += 12) column(x, -13, 1);
  for (let x = Math.floor(x0 / 16) * 16 - 24; x < x1 + 40; x += 16) column(x + 8, -30, 1.4);
  box(L, 0.9, 0.5, darkSteel, cx, colTop, -13);
  box(L, 0.9, 0.5, darkSteel, cx, colTop - 3.2, -13);
  for (let x = Math.floor(x0 / 12) * 12 - 12; x < x1 + 24; x += 12) {
    // X bracing between the two chords
    const d = Math.hypot(6, 3.2), a = Math.atan2(3.2, 6);
    put(new THREE.BoxGeometry(d * 1.0, 0.18, 0.18), darkSteel, x + 3, colTop - 1.6, -13, 0, 0, a);
    put(new THREE.BoxGeometry(d * 1.0, 0.18, 0.18), darkSteel, x + 9, colTop - 1.6, -13, 0, 0, -a);
    box(0.4, 0.4, 17, darkSteel, x, colTop, -21.5); // roof beams going back
  }
  // 3. a catwalk running along behind the level, with railings
  const cwY = yTop + 6.5;
  const it = surf.iron.clone(); it.userData = {}; it.needsUpdate = true; it.repeat.set(L / 1.5, 1.2);
  const deck = new THREE.Mesh(new THREE.BoxGeometry(L, 0.14, 1.8), new THREE.MeshStandardMaterial({ map: it, color: 0x8a909c, roughness: 0.5, metalness: 0.6 }));
  deck.position.set(cx, cwY, -11.4); level.add(deck);
  box(L, 0.08, 0.08, accent, cx, cwY + 1.05, -10.55); box(L, 0.06, 0.06, accent, cx, cwY + 0.55, -10.55);
  for (let x = Math.floor((x0 - 60) / 2) * 2; x < x1 + 60; x += 2) box(0.07, 1.05, 0.07, accent, x, cwY + 0.52, -10.55);
  // 4. pipes along the tops of the back walls, with brackets
  for (const s of w.solids) {
    if (s.style !== 'backwall') continue;
    const top = s.max.y, len = s.max.x - s.min.x, mx = (s.min.x + s.max.x) / 2;
    cyl(0.17, len, paint, mx, top + 0.32, -9.05, 0, Math.PI / 2, 10);
    cyl(0.1, len, accent, mx, top + 0.62, -9.3, 0, Math.PI / 2, 8);
    for (let x = s.min.x + 1; x < s.max.x; x += 2.5) box(0.12, 0.8, 0.5, darkSteel, x, top + 0.4, -9.15);
    // status lights on the front face of the wall
    for (let x = s.min.x + 3; x < s.max.x - 1; x += 7) out.leds.push([x, top - 0.45, -7.97]);
  }
  // 5. hanging lamps over the back of the lane, with soft light shafts
  const shadeM = new THREE.MeshStandardMaterial({ color: col(th.wall).multiplyScalar(0.7), roughness: 0.4, metalness: 0.4, side: THREE.DoubleSide });
  const bulbM = new THREE.MeshStandardMaterial({ color: 0xfff2d0, emissive: 0xffe0a0, emissiveIntensity: 3.2 });
  const shaftM = new THREE.MeshBasicMaterial({ color: dark ? 0x8fa0ff : 0xfff0d0, transparent: true, opacity: dark ? 0.07 : 0.05, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: true });
  const shafts = [];
  for (const s of w.solids) {
    if (s.style !== 'backwall') continue;
    for (let x = s.min.x + 4; x < s.max.x - 2; x += 11) {
      const ly = s.max.y + 4.2;
      put(new THREE.ConeGeometry(0.6, 0.55, 14, 1, true), shadeM, x, ly, -9.6);
      put(new THREE.SphereGeometry(0.2, 10, 6), bulbM, x, ly - 0.25, -9.6);
      cyl(0.025, colTop - ly, darkSteel, x, (colTop + ly) / 2, -9.6, 0, 0, 4);
      shafts.push([x, ly]);
    }
  }
  for (const [x, ly] of shafts) {
    const h = 5.5;
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 2.4, h, 16, 1, true), shaftM);
    m.position.set(x, ly - 0.3 - h / 2, -9.2); m.renderOrder = 2; level.add(m);
  }
  // merge the bins
  for (const [mat, geos] of bins) {
    const m = new THREE.Mesh(mergeGeometries(geos), mat);
    m.castShadow = mat !== bulbM; m.receiveShadow = true; level.add(m);
  }
  // 6. gears: real gear shapes, some in meshing pairs, in two depth layers
  const gearM = new THREE.MeshStandardMaterial({ color: col(th.gear).lerp(col(0x9aa0aa), 0.2), map: surf.steel, roughness: 0.38, metalness: 0.7 });
  const hubM = new THREE.MeshStandardMaterial({ color: 0xf2b84b, roughness: 0.35, metalness: 0.4 });
  const addGear = (x, y, z, r, speed) => {
    const teeth = Math.round(r * 3.2), g = new THREE.Group();
    const m = new THREE.Mesh(gearGeometry(r, teeth, 0.5, r > 3 ? 6 : 4), gearM); g.add(m);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.2, r * 0.2, 0.9, 16), hubM); hub.rotation.x = Math.PI / 2; g.add(hub);
    g.position.set(x, y, z); g.userData.speed = speed; level.add(g); out.gears.push(g);
    return teeth;
  };
  for (let x = x0 - 14, i = 0; x < x1 + 30; x += 20 + R() * 8, i++) {
    const r = 2.6 + R() * 2.6, y = yTop + 1 + R() * 7, z = -20 - R() * 6, sp = (i % 2 ? 1 : -1) * (0.1 + R() * 0.1);
    const t1 = addGear(x, y, z, r, sp);
    if (R() < 0.6) { // a smaller gear meshing with it
      const r2 = r * (0.45 + R() * 0.25), a = R() * Math.PI * 2, d = r + r2 + 0.45;
      const t2 = Math.round(r2 * 3.2);
      addGear(x + Math.cos(a) * d, y + Math.sin(a) * d, z + 0.1, r2, -sp * t1 / t2);
    }
  }
  for (let x = x0 - 30; x < x1 + 40; x += 30 + R() * 10) addGear(x, yTop + 9 + R() * 6, -38 - R() * 6, 5 + R() * 3, (R() < 0.5 ? 1 : -1) * 0.05);
  // 7. status LEDs (two banks that blink out of step)
  if (out.leds.length) {
    const mk = c => new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 2 });
    out.ledMats = [mk(0x39e58c), mk(0xffb347)];
    out.leds.forEach((p, i) => { const m = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 0.06), out.ledMats[i % 2]); m.position.set(...p); level.add(m); });
  }
  // 8. dust motes drifting in the light
  const N = 140;
  const motes = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.035, 0), new THREE.MeshBasicMaterial({ color: dark ? 0xaab4ff : 0xfff4dc, transparent: true, opacity: 0.55, depthWrite: false }), N);
  motes.frustumCulled = false; motes.instanceMatrix.setUsage(THREE.DynamicDrawUsage); level.add(motes);
  const md = Array.from({ length: N }, () => ({ x: R() * 40 - 20, y: R() * 10, z: -10 + R() * 12, p: R() * 6.28, s: 0.6 + R() * 0.8 }));
  const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), V = new THREE.Vector3(), S = new THREE.Vector3();
  out.update = (t, dt, look) => {
    for (const g of out.gears) g.rotation.z += g.userData.speed * dt;
    if (out.ledMats) { out.ledMats[0].emissiveIntensity = Math.sin(t * 2.1) > 0 ? 2.4 : 0.2; out.ledMats[1].emissiveIntensity = Math.sin(t * 1.3 + 1) > 0.3 ? 2.4 : 0.2; }
    for (let i = 0; i < N; i++) {
      const d = md[i];
      d.x += Math.sin(t * 0.3 + d.p) * 0.15 * dt; d.y += (0.05 + Math.sin(t * 0.5 + d.p) * 0.1) * dt;
      // keep the motes in a box that follows the camera, wrapping around
      let rx = ((d.x - look.x + 20) % 40 + 40) % 40 - 20, ry = ((d.y - look.y + 1) % 10 + 10) % 10 - 1;
      V.set(look.x + rx, look.y + ry, d.z); S.setScalar(d.s);
      M.compose(V, Q, S); motes.setMatrixAt(i, M);
    }
    motes.instanceMatrix.needsUpdate = true;
  };
  return out;
}
