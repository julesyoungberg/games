// Bolt & Nut — game simulation. Pure JS, no DOM, so it can run headless for tests.
// Coordinates: x to the right, y up, z toward the camera. 1 unit = 1 metre.
import { ALL } from './levels.js';

export const C = {
  g: 32, jumpV: 9.6, run: 6.5, accelG: 70, accelA: 34, coyote: 0.1, buffer: 0.13,
  pullRange: 11, pullSpeed: 11, carryDist: 1.7, grappleSpeed: 13,
  pushR: 3.3, launchV: 16, launchH: 4.5, crateLaunchV: 13, crateLaunchH: 6, rocketV: 16, pushCd: 0.45,
  killY: -14, fanAccel: 75, fanMax: 9, stepUp: 0.36,
};
const EPS = 1e-4;

/* ---------------- level builder ---------------- */
function makeBuilder(w) {
  const L = {
    box(x0, z0, x1, z1, y0, y1, style = 'wall', extra = {}) {
      const s = { kind: 'static', min: { x: Math.min(x0, x1), y: y0, z: Math.min(z0, z1) }, max: { x: Math.max(x0, x1), y: y1, z: Math.max(z0, z1) }, style, ...extra };
      w.solids.push(s); return s;
    },
    floor(x0, z0, x1, z1, top = 0, style = 'floor') { return L.box(x0, z0, x1, z1, top - 6, top, style); },
    iron(x0, z0, x1, z1, top = 0) { return L.box(x0, z0, x1, z1, top - 6, top, 'iron', { iron: true }); },
    deco(x0, z0, x1, z1, y0, y1, style = 'deco') { w.decos.push({ min: { x: x0, y: y0, z: z0 }, max: { x: x1, y: y1, z: z1 }, style }); },
    start(bx, bz, nx, nz) { w.spawn = { b: { x: bx, z: bz }, n: { x: nx, z: nz } }; },
    plate(x, z, ch, top = 0, r = 0.9) {
      const p = { x, z, top, ch, r, pressed: false, kind: 'plate' };
      w.plates.push(p);
      L.box(x - r, z - r, x + r, z + r, top, top + 0.08, 'plate', { ch, plate: p });
      return p;
    },
    gate(x0, z0, x1, z1, y0, y1, chs, opt = {}) {
      const g = { kind: 'gate', min: { x: Math.min(x0, x1), y: y0, z: Math.min(z0, z1) }, max: { x: Math.max(x0, x1), y: y1, z: Math.max(z0, z1) }, base0: y0, base1: y1, chs: [].concat(chs), any: !!opt.any, open: 0, latch: !!opt.latch, latched: false, invert: !!opt.invert, style: 'gate' };
      w.solids.push(g); w.gates.push(g); return g;
    },
    bridge(x0, z0, x1, z1, top, chs, opt = {}) {
      const b = { kind: 'bridge', min: { x: Math.min(x0, x1), y: top - 0.5, z: Math.min(z0, z1) }, max: { x: Math.max(x0, x1), y: top, z: Math.max(z0, z1) }, chs: [].concat(chs), any: !!opt.any, on: false, vis: 0, invert: !!opt.invert, style: 'bridge' };
      w.solids.push(b); w.bridges.push(b); return b;
    },
    // Moving platform. path: list of [dx,dy,dz] offsets (first is [0,0,0]). With chs it moves to the end while active.
    mover(x0, z0, x1, z1, top, path, speed = 2.5, chs = null, thick = 0.6) {
      const m = { kind: 'mover', min: { x: Math.min(x0, x1), y: top - thick, z: Math.min(z0, z1) }, max: { x: Math.max(x0, x1), y: top, z: Math.max(z0, z1) }, path, speed, chs: chs ? [].concat(chs) : null, seg: 0, t: 0, dir: 1, off: { x: 0, y: 0, z: 0 }, delta: { x: 0, y: 0, z: 0 }, style: 'mover' };
      m.home = { min: { ...m.min }, max: { ...m.max } };
      // precompute cumulative lengths
      m.len = [0];
      for (let i = 1; i < path.length; i++) { const a = path[i - 1], b = path[i]; m.len.push(m.len[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2])); }
      m.total = m.len[m.len.length - 1]; m.s = 0;
      w.solids.push(m); w.movers.push(m); return m;
    },
    crate(x, z, top = 0, opt = {}) { const c = makeBody('crate', x, top + 0.6, z, 0.6, 0.6, 0.6); c.wood = !!opt.wood; c.home = { x, y: top + 0.6, z }; w.crates.push(c); w.bodies.push(c); return c; },
    // anchor ring; opt.path = [[0,0,0],[dx,dy,dz],...] makes it glide back and forth (opt.speed m/s, pausing at the ends)
    anchor(x, y, z, opt = {}) {
      const a = { x, y, z, kind: 'anchor' };
      if (opt.path) { a.home = { x, y, z }; a.path = opt.path; a.speed = opt.speed || 2; a.s = 0; a.dir = 1; a.wait = 0; a.len = [0]; for (let i = 1; i < opt.path.length; i++) { const p0 = opt.path[i - 1], p1 = opt.path[i]; a.len.push(a.len[i - 1] + Math.hypot(p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2])); } a.total = a.len[a.len.length - 1]; }
      w.anchors.push(a); return a;
    },
    // oily floor: slippery, robots and crates keep sliding
    oil(x0, z0, x1, z1, top = 0) { return L.box(x0, z0, x1, z1, top - 6, top, 'oil', { oil: true }); },
    // magnet plate on a wall: Bolt grapples it like a ring and clings to the wall in front of it. face = [nx, nz] points out of the wall.
    magnet(x, y, z, face = [0, 1]) { w.anchors.push({ x, y, z, kind: 'anchor', wall: true, face, ox: face[0] * 0.55, oz: face[1] * 0.55 }); },
    // pneumatic tube between two floor hatches: step in at one end, pop out of the other. opt.outA / opt.outB: [dx, dz] exit direction.
    tube(ax, az, atop, bx, bz, btop, opt = {}) { const d = Math.sign(bx - ax) || 1; w.tubes.push({ a: { x: ax, z: az, top: atop, out: opt.outA || [-d, 0] }, b: { x: bx, z: bz, top: btop, out: opt.outB || [d, 0] }, t: -9 }); },
    laser(x0, z0, x1, z1, y0, y1, chs = null, timer = null, any = false) { w.lasers.push({ any, min: { x: Math.min(x0, x1), y: y0, z: Math.min(z0, z1) }, max: { x: Math.max(x0, x1), y: y1, z: Math.max(z0, z1) }, chs: chs ? [].concat(chs) : null, timer, on: true }); },
    fan(x0, z0, x1, z1, base, height, chs = null) { w.fans.push({ min: { x: Math.min(x0, x1), y: base, z: Math.min(z0, z1) }, max: { x: Math.max(x0, x1), y: base + height, z: Math.max(z0, z1) }, chs: chs ? [].concat(chs) : null, on: true }); L.box(x0, z0, x1, z1, base - 6, base, 'fan'); },
    checkpoint(x0, z0, x1, z1, bx, bz, nx, nz) { w.checkpoints.push({ min: { x: Math.min(x0, x1), z: Math.min(z0, z1) }, max: { x: Math.max(x0, x1), z: Math.max(z0, z1) }, b: { x: bx, z: bz }, n: { x: nx, z: nz }, hit: false }); },
    exit(x0, z0, x1, z1, top = 0) { w.exit = { min: { x: Math.min(x0, x1), y: top - 1, z: Math.min(z0, z1) }, max: { x: Math.max(x0, x1), y: top + 4, z: Math.max(z0, z1) }, top }; },
    zone(id, x0, z0, x1, z1, y0 = -50, y1 = 50) { w.zones.push({ id, min: { x: Math.min(x0, x1), y: y0, z: Math.min(z0, z1) }, max: { x: Math.max(x0, x1), y: y1, z: Math.max(z0, z1) }, hit: false }); },
    // conveyor belt: floor that carries whatever stands on it at (vx, vz) m/s; reverses while chs are active
    conveyor(x0, z0, x1, z1, top, vx, vz, chs = null) { return L.box(x0, z0, x1, z1, top - 6, top + 0.01, 'conveyor', { conv: { vx, vz, chs: chs ? [].concat(chs) : null, rev: false } }); },
    // bounce pad: anything that lands on it is thrown up at v m/s (v 14 is about 3 m, 18 about 5 m)
    spring(x0, z0, x1, z1, top, v = 15) { const sp = { v, t: -9 }; w.springs.push(L.box(x0, z0, x1, z1, top - 6, top + 0.3, 'spring', { spring: sp })); return sp; },
    // golden cog: optional collectible, one per level
    cog(x, y, z) { w.cogs.push({ x, y, z, got: false }); },
    // push switch: Nut's push flips it on/off; it holds its channel while on
    button(x, z, ch, top = 0) { const b = { x, z, top, ch, on: false }; w.switches.push(b); L.box(x - 0.35, z - 0.35, x + 0.35, z + 0.35, top, top + 1.1, 'switch', { sw: b }); return b; },
    sign(x, y, z, text, ry = 0) { w.signs.push({ x, y, z, text, ry }); },
  };
  return L;
}

function makeBody(kind, x, y, z, hx, hy, hz) {
  return { kind, pos: { x, y, z }, half: { x: hx, y: hy, z: hz }, vel: { x: 0, y: 0, z: 0 }, grounded: false, ground: null, prev: { x, y, z }, pulledBy: null, alive: true };
}

export function groundAt(w, x, z, fromY = 100, ignore = null) {
  let best = -Infinity;
  for (const s of w.solids) {
    if (s === ignore || !solidActive(s)) continue;
    if (x >= s.min.x && x <= s.max.x && z >= s.min.z && z <= s.max.z && s.max.y <= fromY && s.max.y > best) best = s.max.y;
  }
  return best;
}

export function createWorld(index) {
  // a level definition object can be passed directly (used by tests of work-in-progress levels)
  let def; if (typeof index === 'object') { def = index; index = -1; } else def = ALL[index];
  const w = {
    index, def, t: 0, solids: [], gates: [], bridges: [], movers: [], plates: [], lasers: [], fans: [], anchors: [], crates: [], switches: [], springs: [], cogs: [], tubes: [], bodies: [], decos: [], zones: [], checkpoints: [], signs: [],
    channels: {}, events: [], exit: null, exitT: 0, complete: false, spawn: null, stats: { falls: [0, 0], zaps: [0, 0], pulls: 0, pushes: 0, launches: 0 },
  };
  def.build(makeBuilder(w));
  const sp = w.spawn;
  const by = groundAt(w, sp.b.x, sp.b.z), ny = groundAt(w, sp.n.x, sp.n.z);
  const bolt = makeBody('player', sp.b.x, by + 0.55 + 0.01, sp.b.z, 0.38, 0.55, 0.38);
  const nut = makeBody('player', sp.n.x, ny + 0.45 + 0.01, sp.n.z, 0.42, 0.45, 0.42);
  Object.assign(bolt, { id: 0, name: 'Bolt', face: { x: 1, z: 0 }, coyote: 0, buffer: 0, target: null, hang: false, launched: false, jumpHeld: false, cd: 0, anim: 0, zapT: 0 });
  Object.assign(nut, { id: 1, name: 'Nut', face: { x: 1, z: 0 }, coyote: 0, buffer: 0, target: null, launched: false, jumpHeld: false, cd: 0, anim: 0, zapT: 0 });
  w.players = [bolt, nut];
  w.bodies.unshift(bolt, nut);
  w.cp = { b: { ...sp.b }, n: { ...sp.n } };
  return w;
}

export function solidActive(s) {
  if (s.kind === 'bridge') return s.on;
  return true;
}

function overlap(a, bmin, bmax) {
  return a.pos.x - a.half.x < bmax.x - EPS && a.pos.x + a.half.x > bmin.x + EPS &&
    a.pos.y - a.half.y < bmax.y - EPS && a.pos.y + a.half.y > bmin.y + EPS &&
    a.pos.z - a.half.z < bmax.z - EPS && a.pos.z + a.half.z > bmin.z + EPS;
}
const bmin = b => ({ x: b.pos.x - b.half.x, y: b.pos.y - b.half.y, z: b.pos.z - b.half.z });
const bmax = b => ({ x: b.pos.x + b.half.x, y: b.pos.y + b.half.y, z: b.pos.z + b.half.z });

function chActive(w, chs, any = false) { return any ? chs.some(c => !!w.channels[c]) : chs.every(c => !!w.channels[c]); }

/* Move a body along one axis, colliding with solids and other bodies. Players shove crates. */
function moveAxis(w, b, ax, d, depth = 0) {
  if (d === 0) return 0;
  const start = b.pos[ax];
  b.pos[ax] += d;
  for (const s of w.solids) {
    if (!solidActive(s) || !overlap(b, s.min, s.max)) continue;
    const rise = s.max.y - (b.pos.y - b.half.y);
    if (ax !== 'y' && ((b.kind === 'player' && (b.grounded || b.coyote > 0) && rise <= (b.target ? 0.12 : C.stepUp)) || (b.kind === 'crate' && b.grounded && rise <= 0.12))) {
      const oy = b.pos.y; b.pos.y = s.max.y + b.half.y + EPS;
      if (!anyOverlap(w, b, b.kind === 'player')) continue;
      b.pos.y = oy;
    }
    resolve(b, ax, d, s.min, s.max, s);
  }
  for (const o of w.bodies) {
    if (o === b || !o.alive || b.pulledBy === o || o.pulledBy === b || !overlap(b, bmin(o), bmax(o))) continue;
    if (ax !== 'y' && o.kind === 'crate' && depth < 2 && !o.pulledBy) {
      // shove the crate by the overlap
      const pen = d > 0 ? (b.pos[ax] + b.half[ax]) - (o.pos[ax] - o.half[ax]) : (b.pos[ax] - b.half[ax]) - (o.pos[ax] + o.half[ax]);
      moveAxis(w, o, ax, pen, depth + 1);
      if (o.grounded && o.ground && o.ground.oil && b.vel) o.vel[ax] = b.vel[ax];
      if (!overlap(b, bmin(o), bmax(o))) continue;
    }
    if (ax === 'y' && d > 0 && o.ground === b && depth < 3) {
      const pen = (b.pos.y + b.half.y) - (o.pos.y - o.half.y);
      moveAxis(w, o, 'y', pen, depth + 1);
      if (!overlap(b, bmin(o), bmax(o))) continue;
    }
    resolve(b, ax, d, bmin(o), bmax(o), o);
  }
  return b.pos[ax] - start;
}
function anyOverlap(w, b, skipCrates = false) {
  for (const s of w.solids) if (solidActive(s) && overlap(b, s.min, s.max)) return true;
  for (const o of w.bodies) if (o !== b && o.alive && b.pulledBy !== o && o.pulledBy !== b && !(skipCrates && o.kind === 'crate') && overlap(b, bmin(o), bmax(o))) return true;
  return false;
}
function resolve(b, ax, d, mn, mx, ref) {
  if (d > 0) b.pos[ax] = mn[ax] - b.half[ax] - EPS * 0.5;
  else b.pos[ax] = mx[ax] + b.half[ax] + EPS * 0.5;
  if (ax === 'y') {
    if (d < 0) { b.grounded = true; b.ground = ref; if (b.vel.y < 0) b.vel.y = 0; }
    else if (b.vel.y > 0) b.vel.y = 0;
  } else if (b.kind === 'crate' && b.grounded) b.vel[ax] = 0;
}

function moveBody(w, b, dx, dy, dz) {
  moveAxis(w, b, 'x', dx);
  moveAxis(w, b, 'z', dz);
  b.grounded = false; b.ground = null;
  moveAxis(w, b, 'y', dy);
}

function emit(w, type, data = {}) { w.events.push({ type, ...data }); }

/* ---------------- kinematics: gates, bridges, movers ---------------- */
function updateAnchors(w, dt) {
  for (const a of w.anchors) {
    if (!a.path) continue;
    if (a.wait > 0) { a.wait -= dt; continue; }
    a.s += a.dir * a.speed * dt;
    if (a.s >= a.total) { a.s = a.total; a.dir = -1; a.wait = 0.6; } else if (a.s <= 0) { a.s = 0; a.dir = 1; a.wait = 0.6; }
    let i = 1; while (i < a.len.length - 1 && a.len[i] < a.s) i++;
    const f = (a.s - a.len[i - 1]) / Math.max(1e-6, a.len[i] - a.len[i - 1]), p0 = a.path[i - 1], p1 = a.path[i];
    a.x = a.home.x + p0[0] + (p1[0] - p0[0]) * f; a.y = a.home.y + p0[1] + (p1[1] - p0[1]) * f; a.z = a.home.z + p0[2] + (p1[2] - p0[2]) * f;
  }
}
function updateTubes(w, dt) {
  for (const b of w.bodies) if (b.tubeCd > 0) b.tubeCd -= dt;
  for (const tb of w.tubes) for (const [from, to] of [[tb.a, tb.b], [tb.b, tb.a]]) for (const b of w.bodies) {
    if (!b.alive || b.tubeCd > 0) continue;
    const bot = b.pos.y - b.half.y;
    if (Math.abs(b.pos.x - from.x) > 0.55 || Math.abs(b.pos.z - from.z) > 0.55 || bot < from.top - 0.2 || bot > from.top + 0.5) continue;
    if (b.pulledBy) releaseTarget(w, b.pulledBy);
    if (b.kind === 'player' && b.target) releaseTarget(w, b);
    b.pos = { x: to.x, y: to.top + b.half.y + 0.7, z: to.z }; b.prev = { ...b.pos };
    b.vel = { x: to.out[0] * 4.5, y: 7, z: to.out[1] * 4.5 }; b.grounded = false; b.ground = null; b.tubeCd = 0.8;
    if (b.kind === 'player') { b.launched = true; b.coyote = 0; }
    tb.t = w.t; emit(w, 'tube', { x: to.x, y: to.top + 0.5, z: to.z, fx: from.x, fz: from.z, fy: from.top + 0.5, who: b.id });
  }
}
function updateKinematics(w, dt) {
  for (const g of w.gates) {
    let want = chActive(w, g.chs, g.any);
    if (g.invert) want = !want;
    if (g.latch && want) g.latched = true;
    if (g.latched) want = true;
    const prev = g.open;
    g.open = want ? Math.min(1, g.open + dt * 1.6) : Math.max(0, g.open - dt * 1.6);
    if ((prev === 0 && g.open > 0)) emit(w, 'gate', { open: true, x: (g.min.x + g.max.x) / 2, z: (g.min.z + g.max.z) / 2 });
    if (prev === 1 && g.open < 1) emit(w, 'gate', { open: false, x: (g.min.x + g.max.x) / 2, z: (g.min.z + g.max.z) / 2 });
    const h = g.base1 - g.base0;
    const newTop = g.base1 - h * g.open;
    const dy = newTop - g.max.y;
    g.min.y += dy; g.max.y += dy;
    if (dy > 0) liftBodiesOn(w, g, dy);
  }
  for (const br of w.bridges) {
    let want = chActive(w, br.chs, br.any); if (br.invert) want = !want;
    if (want && !br.on) {
      br.on = true; emit(w, 'bridge', { on: true });
      for (const b of w.bodies) if (b.alive && overlap(b, br.min, br.max)) { if (b.pos.y > br.min.y) b.pos.y = br.max.y + b.half.y + EPS; }
    } else if (!want && br.on) { br.on = false; emit(w, 'bridge', { on: false }); }
    br.vis += ((br.on ? 1 : 0) - br.vis) * Math.min(1, dt * 10);
  }
  for (const m of w.movers) {
    let target;
    if (m.chs) target = chActive(w, m.chs) ? m.total : 0;
    const prevOff = { ...m.off };
    if (m.chs) {
      const ds = m.speed * dt;
      if (m.s < target) m.s = Math.min(target, m.s + ds); else if (m.s > target) m.s = Math.max(target, m.s - ds);
    } else {
      m.s += m.dir * m.speed * dt;
      if (m.s >= m.total) { m.s = m.total; m.dir = -1; m.wait = 0.6; }
      if (m.s <= 0) { m.s = 0; m.dir = 1; m.wait = 0.6; }
      if (m.wait > 0) { m.wait -= dt; m.s = m.dir > 0 ? 0 : m.total; }
    }
    // position along path
    let i = 1; while (i < m.len.length - 1 && m.len[i] < m.s) i++;
    const a = m.path[i - 1], b = m.path[i] || a; const segLen = (m.len[i] - m.len[i - 1]) || 1;
    const f = Math.max(0, Math.min(1, (m.s - m.len[i - 1]) / segLen));
    m.off = { x: a[0] + (b[0] - a[0]) * f, y: a[1] + (b[1] - a[1]) * f, z: a[2] + (b[2] - a[2]) * f };
    const d = { x: m.off.x - prevOff.x, y: m.off.y - prevOff.y, z: m.off.z - prevOff.z };
    m.delta = d;
    // riders: bodies standing on the mover
    const riders = w.bodies.filter(b => b.alive && b.ground === m);
    m.min.x = m.home.min.x + m.off.x; m.max.x = m.home.max.x + m.off.x;
    m.min.y = m.home.min.y + m.off.y; m.max.y = m.home.max.y + m.off.y;
    m.min.z = m.home.min.z + m.off.z; m.max.z = m.home.max.z + m.off.z;
    for (const r of riders) {
      if (d.y > 0) r.pos.y = Math.max(r.pos.y, m.max.y + r.half.y + EPS);
      moveAxis(w, r, 'x', d.x); moveAxis(w, r, 'z', d.z);
      if (d.y < 0) { moveAxis(w, r, 'y', d.y); r.ground = m; r.grounded = true; }
    }
    // shove non-riders out of the way
    for (const b of w.bodies) {
      if (!b.alive || riders.includes(b) || !overlap(b, m.min, m.max)) continue;
      // push out along the shortest way (never downward, so nobody gets squashed into the floor)
      const opts = [
        ['y', m.max.y + b.half.y + EPS, (m.max.y + b.half.y) - b.pos.y],
        ['x', m.max.x + b.half.x + EPS, (m.max.x + b.half.x) - b.pos.x],
        ['x', m.min.x - b.half.x - EPS, b.pos.x - (m.min.x - b.half.x)],
        ['z', m.max.z + b.half.z + EPS, (m.max.z + b.half.z) - b.pos.z],
        ['z', m.min.z - b.half.z - EPS, b.pos.z - (m.min.z - b.half.z)],
      ].sort((a, c) => a[2] - c[2]);
      b.pos[opts[0][0]] = opts[0][1];
    }
  }
}
function liftBodiesOn(w, s, dy) {
  for (const b of w.bodies) if (b.alive && overlap(b, s.min, s.max) && b.pos.y > s.min.y) b.pos.y = s.max.y + b.half.y + EPS;
}

/* ---------------- players ---------------- */
function ironUnder(w, b) {
  const y = b.pos.y - b.half.y;
  for (const s of w.solids) if (s.iron && Math.abs(s.max.y - y) < 0.12 && b.pos.x + b.half.x > s.min.x && b.pos.x - b.half.x < s.max.x && b.pos.z + b.half.z > s.min.z && b.pos.z - b.half.z < s.max.z) return true;
  return false;
}
export function pickTarget(w, bolt) {
  const nut = w.players[1];
  const cands = [];
  const add = (obj, x, y, z, kind) => {
    const dx = x - bolt.pos.x, dy = y - bolt.pos.y, dz = z - bolt.pos.z;
    const d = Math.hypot(dx, dy, dz);
    if (d > C.pullRange || d < 0.5) return;
    const hd = Math.hypot(dx, dz);
    // how well it lines up with where Bolt is facing (3D, so things far above count less)
    const dot = hd < 1.2 ? 0.5 : (dx * bolt.face.x + dz * bolt.face.z) / d;
    if (dot < 0.3) return; // only things in front of Bolt (or right above / below him)
    cands.push({ obj, kind, score: d * (2 - 1.5 * dot) * (kind === 'nut' ? 0.8 : 1) * (kind === 'anchor' && bolt.grounded && hd < 2.2 ? 2.5 : 1) * (kind === 'anchor' && !bolt.grounded ? 0.5 : 1) });
  };
  if (nut.alive) add(nut, nut.pos.x, nut.pos.y, nut.pos.z, 'nut');
  for (const c of w.crates) if (c.alive && !c.wood) add(c, c.pos.x, c.pos.y, c.pos.z, 'crate');
  for (const a of w.anchors) if (!(bolt.target && bolt.target.obj === a) && !(bolt.lastAnchor === a && bolt.lastAnchorT > 0)) add(a, a.x, a.y, a.z, 'anchor');
  cands.sort((a, b) => a.score - b.score);
  return cands[0] || null;
}

function releaseTarget(w, bolt) {
  const t = bolt.target; if (!t) return;
  if (t.kind !== 'anchor') { t.obj.pulledBy = null; t.obj.vel.x *= 0.4; t.obj.vel.z *= 0.4; t.obj.vel.y = Math.min(t.obj.vel.y, 2); }
  if (t.kind === 'anchor') { bolt.lastAnchor = t.obj; bolt.lastAnchorT = 0.6; }
  bolt.target = null; bolt.hang = false;
  emit(w, 'pull-end');
}

function updatePlayer(w, p, inp, dt) {
  const other = w.players[1 - p.id];
  p.cd = Math.max(0, p.cd - dt);
  p.zapT = Math.max(0, p.zapT - dt);
  const mx = (inp && inp.mx) || 0, mz = (inp && inp.mz) || 0;
  const mag = Math.min(1, Math.hypot(mx, mz));
  if (mag > 0.2) { const l = Math.hypot(mx, mz); p.face = { x: mx / l, z: mz / l }; }
  // --- Bolt: pull / carry / grapple
  if (p.id === 0) {
    p.lastAnchorT = Math.max(0, (p.lastAnchorT || 0) - dt);
    if (p.target && p.target.kind === 'anchor' && inp && inp.jumpP) { releaseTarget(w, p); p.vel.y = C.jumpV; p.vel.x = p.face.x * 3; p.vel.z = p.face.z * 3; p.jumpHeld = true; emit(w, 'jump', { who: 0 }); }
    // holding X keeps trying: a press made before anything was in range still grabs once something is
    if (!inp || !inp.power) p.wantPull = false;
    const retry = inp && inp.power && p.wantPull && !p.target;
    if ((inp && inp.powerP && !p.target) || retry) {
      const t = pickTarget(w, p);
      if (t) { p.wantPull = false;
        p.target = t; w.stats.pulls++;
        if (t.kind !== 'anchor') { t.obj.pulledBy = p; if (t.obj.kind === 'player' && t.obj.target) releaseTarget(w, t.obj); }
        emit(w, 'pull', { kind: t.kind });
      } else if (!retry) { p.wantPull = true; emit(w, 'pull-miss'); }
    }
    if (p.target && (!inp || !inp.power)) releaseTarget(w, p);
    if (p.target && p.target.kind !== 'anchor') {
      const o = p.target.obj;
      const d = Math.hypot(o.pos.x - p.pos.x, o.pos.y - p.pos.y, o.pos.z - p.pos.z);
      if (!o.alive || d > C.pullRange + 3) releaseTarget(w, p);
    }
  }
  // --- Nut: push
  // a push pressed during the cooldown fires as soon as the cooldown ends
  if (p.id === 1 && inp && inp.powerP && p.cd > 0) p.pushBuf = 0.18; else if (p.id === 1) p.pushBuf = Math.max(0, (p.pushBuf || 0) - dt);
  if (p.id === 1 && inp && (inp.powerP || p.pushBuf > 0) && p.cd <= 0) {
    p.pushBuf = 0;
    p.cd = C.pushCd; w.stats.pushes++;
    const grounded = p.grounded || p.coyote > 0;
    let hit = false;
    if (grounded && ironUnder(w, p)) { p.vel.y = C.rocketV; p.launched = true; p.grounded = false; p.coyote = 0; hit = true; emit(w, 'rocket'); }
    const push = (o, v, h) => {
      const dx = o.pos.x - p.pos.x, dz = o.pos.z - p.pos.z, dy = o.pos.y - p.pos.y;
      if (Math.hypot(dx, dy, dz) > C.pushR) return false;
      const hd = Math.hypot(dx, dz);
      const nx = hd > 0.25 ? dx / hd : 0, nz = hd > 0.25 ? dz / hd : 0;
      if (o.pulledBy) releaseTarget(w, o.pulledBy);
      if (o.kind === 'player' && o.target) releaseTarget(w, o);
      o.vel.x = nx * h; o.vel.z = nz * h; o.vel.y = v; o.grounded = false; o.ground = null;
      return true;
    };
    if (grounded && other.alive && push(other, C.launchV, C.launchH)) { other.launched = true; other.coyote = 0; hit = true; w.stats.launches++; emit(w, 'launch', { who: other.id }); }
    for (const c of w.crates) if (c.alive && !c.wood && push(c, C.crateLaunchV, C.crateLaunchH)) { hit = true; emit(w, 'crate-launch'); }
    for (const sw of w.switches) if (Math.hypot(sw.x - p.pos.x, sw.top + 0.6 - p.pos.y, sw.z - p.pos.z) < C.pushR + 0.4) { sw.on = !sw.on; hit = true; emit(w, 'switch', { on: sw.on, ch: sw.ch }); }
    emit(w, 'push', { x: p.pos.x, y: p.pos.y, z: p.pos.z, hit });
  }
  // --- movement
  if (p.pulledBy) { p.coyote = 0; return; } // handled by puller
  if (p.id === 0 && p.target && p.target.kind === 'anchor') {
    const a = p.target.obj;
    const tx = a.x + (a.ox || 0), ty = a.y - (a.wall ? 0.5 : 1.0), tz = a.z + (a.oz || 0);
    const dx = tx - p.pos.x, dy = ty - p.pos.y, dz = tz - p.pos.z, d = Math.hypot(dx, dy, dz);
    if (d < 0.25) { p.vel.x = dx / dt; p.vel.y = dy / dt; p.vel.z = dz / dt; if (!p.hang) emit(w, 'hang'); p.hang = true; }
    else { const s = Math.min(C.grappleSpeed, d / dt) / d; p.vel.x = dx * s; p.vel.y = dy * s; p.vel.z = dz * s; }
    p.launched = false; p.coyote = 0;
    return;
  }
  const speed = C.run * (p.id === 0 && p.target ? 0.7 : 1);
  const tvx = mx * speed / Math.max(1, mag), tvz = mz * speed / Math.max(1, mag);
  const acc = (p.grounded ? (p.ground && p.ground.oil ? 7 : C.accelG) : C.accelA) * dt;
  const approach = (v, t) => v < t ? Math.min(t, v + acc) : Math.max(t, v - acc);
  if (p.launched && !p.grounded) {
    // keep launch momentum but allow steering
    const steer = C.accelA * dt * 0.8;
    p.vel.x += Math.sign(tvx - p.vel.x) * Math.min(Math.abs(tvx - p.vel.x), mag > 0.1 ? steer : steer * 0.15);
    p.vel.z += Math.sign(tvz - p.vel.z) * Math.min(Math.abs(tvz - p.vel.z), mag > 0.1 ? steer : steer * 0.15);
  } else { p.vel.x = approach(p.vel.x, tvx); p.vel.z = approach(p.vel.z, tvz); }
  // jump
  if (p.grounded) p.coyote = C.coyote; else p.coyote = Math.max(0, p.coyote - dt);
  if (inp && inp.jumpP) p.buffer = C.buffer; else p.buffer = Math.max(0, p.buffer - dt);
  if (p.buffer > 0 && p.coyote > 0) {
    p.vel.y = C.jumpV; p.buffer = 0; p.coyote = 0; p.grounded = false; p.jumpHeld = true; p.launched = false;
    emit(w, 'jump', { who: p.id });
  }
  if (p.jumpHeld && (!inp || !inp.jump)) { if (p.vel.y > 2 && !p.launched) p.vel.y *= 0.55; p.jumpHeld = false; }
  if (p.vel.y <= 0) p.jumpHeld = false;
}

/* ---------------- main step ---------------- */
export function step(w, inputs, dt = 1 / 60) {
  w.t += dt;
  // channels from plates (evaluated from last positions)
  updateKinematics(w, dt);
  updateAnchors(w, dt);
  for (const p of w.players) updatePlayer(w, p, inputs[p.id], dt);
  // pulled bodies move toward Bolt (carry point)
  const bolt = w.players[0];
  // integrate
  for (const b of w.bodies) {
    if (!b.alive) continue;
    b.prev = { ...b.pos };
    const wasGrounded = b.grounded;
    if (b.pulledBy) {
      const P = b.pulledBy;
      let tx = P.pos.x + P.face.x * C.carryDist, tz = P.pos.z + P.face.z * C.carryDist;
      let ty = P.pos.y - P.half.y + b.half.y + 0.35;
      // far away: fly straight at Bolt first (slides off shelves, around corners), then settle in front
      if (Math.hypot(b.pos.x - P.pos.x, b.pos.y - P.pos.y, b.pos.z - P.pos.z) > 2.6) { tx = P.pos.x; tz = P.pos.z; ty = P.pos.y + 0.3; }
      const dx = tx - b.pos.x, dy = ty - b.pos.y, dz = tz - b.pos.z, d = Math.hypot(dx, dy, dz);
      const sp = Math.min(C.pullSpeed, d / dt * 0.5);
      if (d > 0.001) { b.vel.x = dx / d * sp; b.vel.y = dy / d * sp; b.vel.z = dz / d * sp; } else b.vel.x = b.vel.y = b.vel.z = 0;
    } else if (b.kind === 'player' && b.target && b.target.kind === 'anchor') {
      // velocity set in updatePlayer
    } else {
      b.vel.y -= C.g * dt;
      if (b.vel.y < -30) b.vel.y = -30;
      if (b.kind === 'crate' && b.grounded) { const f = Math.max(0, 1 - dt * (b.ground && b.ground.oil ? 0.6 : 10)); b.vel.x *= f; b.vel.z *= f; }
    }
    // fans
    for (const f of w.fans) if (f.on && b.pos.x > f.min.x && b.pos.x < f.max.x && b.pos.z > f.min.z && b.pos.z < f.max.z && b.pos.y - b.half.y < f.max.y && b.pos.y - b.half.y >= f.min.y - 0.05 && !b.pulledBy) {
      b.vel.y = Math.min(C.fanMax, b.vel.y + C.fanAccel * dt);
      if (b.kind === 'player') b.launched = false;
    }
    const vyBefore = b.vel.y;
    moveBody(w, b, b.vel.x * dt, b.vel.y * dt, b.vel.z * dt);
    if (b.kind === 'player') {
      if (b.grounded && !wasGrounded) { b.launched = false; if (vyBefore < -4 && !(b.ground && b.ground.spring)) emit(w, 'land', { who: b.id, v: -vyBefore }); }
    }
    if (b.grounded && b.ground && b.ground.spring && !b.pulledBy) {
      const sp = b.ground.spring; sp.t = w.t;
      b.vel.y = sp.v; b.grounded = false; b.ground = null;
      if (b.kind === 'player') { b.launched = true; b.coyote = 0; b.jumpHeld = false; }
      emit(w, 'spring', { x: b.pos.x, y: b.pos.y - b.half.y, z: b.pos.z, who: b.id });
    }
  }
  updateTubes(w, dt);
  // conveyor belts
  if (!w.belts) w.belts = w.solids.filter(s => s.conv).map(s => s.conv);
  for (const g of w.belts) g.rev = g.chs ? chActive(w, g.chs, true) : false;
  for (const b of w.bodies) {
    const g = b.alive && b.grounded && b.ground && b.ground.conv;
    if (!g || b.pulledBy) {
      // a crate coming off a belt keeps some of its speed, so belts can deliver crates onto floors
      if (b.beltV && b.kind === 'crate' && !b.pulledBy) { b.vel.x = b.beltV.x; b.vel.z = b.beltV.z; }
      b.beltV = null; continue;
    }
    const k = (g.rev ? -1 : 1);
    moveAxis(w, b, 'x', g.vx * k * dt); moveAxis(w, b, 'z', g.vz * k * dt);
    b.beltV = { x: g.vx * k, z: g.vz * k };
  }
  // riders on bodies (standing on partner / on a crate being carried)
  for (const b of w.bodies) {
    if (!b.alive || !b.ground || !b.ground.pos) continue;
    const g = b.ground;
    const dx = g.pos.x - g.prev.x, dz = g.pos.z - g.prev.z;
    if (dx || dz) { moveAxis(w, b, 'x', dx); moveAxis(w, b, 'z', dz); }
  }
  // plates
  const ch = {};
  for (const pl of w.plates) {
    let pressed = false;
    for (const b of w.bodies) {
      if (!b.alive) continue;
      const bot = b.pos.y - b.half.y;
      if (bot > pl.top + 0.45 || bot < pl.top - 0.2) continue;
      if (Math.abs(b.pos.x - pl.x) < pl.r + b.half.x - 0.15 && Math.abs(b.pos.z - pl.z) < pl.r + b.half.z - 0.15) { pressed = true; break; }
    }
    if (pressed !== pl.pressed) emit(w, 'plate', { on: pressed, ch: pl.ch });
    pl.pressed = pressed;
    if (pressed) ch[pl.ch] = true;
  }
  for (const sw of w.switches) if (sw.on) ch[sw.ch] = true;
  w.channels = ch;
  // lasers
  for (const l of w.lasers) {
    let on = true;
    if (l.chs) on = !chActive(w, l.chs, l.any);
    if (l.timer) { const [onT, offT, ph] = l.timer; const per = onT + offT; on = on && ((w.t + (ph || 0)) % per) < onT; }
    l.on = on;
    if (!on) continue;
    for (const p of w.players) if (p.alive && p.zapT <= 0 && overlap(p, l.min, l.max)) { w.stats.zaps[p.id]++; emit(w, 'zap', { who: p.id, x: p.pos.x, y: p.pos.y, z: p.pos.z }); respawn(w, p); }
  }
  for (const f of w.fans) f.on = f.chs ? chActive(w, f.chs, true) : true;
  // falls
  for (const p of w.players) if (p.pos.y < C.killY) { w.stats.falls[p.id]++; emit(w, 'fall', { who: p.id }); respawn(w, p); }
  for (const c of w.crates) if (c.pos.y < C.killY) {
    if (c.pulledBy) releaseTarget(w, c.pulledBy);
    c.pos = { ...c.home }; c.vel = { x: 0, y: 0, z: 0 };
    // lift out if something sits there
    while (anyOverlap(w, c)) c.pos.y += 0.5;
    emit(w, 'crate-lost');
  }
  // golden cogs
  for (const g of w.cogs) if (!g.got) for (const p of w.players) if (p.alive && Math.hypot(p.pos.x - g.x, p.pos.y - g.y, p.pos.z - g.z) < 0.95) { g.got = true; emit(w, 'cog', { x: g.x, y: g.y, z: g.z, who: p.id }); break; }
  // checkpoints
  for (const cp of w.checkpoints) {
    if (cp.hit) continue;
    // only counts once BOTH robots have reached it, so falling never skips a puzzle
    if (w.players.every(p => p.pos.x > cp.min.x && p.pos.x < cp.max.x && p.pos.z > cp.min.z && p.pos.z < cp.max.z && p.pos.y > -2)) {
      cp.hit = true; w.cp = { b: cp.b, n: cp.n }; emit(w, 'checkpoint');
    }
  }
  // zones (narration)
  for (const z of w.zones) {
    if (z.hit) continue;
    for (const p of w.players) if (overlap(p, z.min, z.max)) { z.hit = true; emit(w, 'zone', { id: z.id, who: p.id }); break; }
  }
  // exit
  if (w.exit && !w.complete) {
    const inside = w.players.map(p => overlap(p, w.exit.min, w.exit.max));
    if (inside[0] && inside[1]) { w.exitT += dt; if (w.exitT > 0.8) { w.complete = true; emit(w, 'complete'); } }
    else { if (w.exitT > 0 || (inside[0] !== inside[1] && !w._exitWarned)) { if (inside[0] !== inside[1]) { w._exitWarned = true; emit(w, 'exit-one', { who: inside[0] ? 0 : 1 }); } } w.exitT = 0; }
  }
}

export function respawn(w, p) {
  if (p.target) releaseTarget(w, p);
  if (p.pulledBy) releaseTarget(w, p.pulledBy);
  const s = p.id === 0 ? w.cp.b : w.cp.n;
  const gy = groundAt(w, s.x, s.z);
  p.pos = { x: s.x, y: gy + p.half.y + 0.02, z: s.z };
  p.vel = { x: 0, y: 0, z: 0 };
  p.launched = false; p.zapT = 1.0;
  while (anyOverlap(w, p)) p.pos.y += 0.3;
  p.prev = { ...p.pos };
  emit(w, 'respawn', { who: p.id });
}

export function restartFromCheckpoint(w) { for (const p of w.players) respawn(w, p); }
