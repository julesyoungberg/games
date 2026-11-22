import { Bot } from './bot.mjs';
import level from '../src/lv/s32.js';
const t = new Bot(level); const c = t.w.crates;
// 1. Class of Shift 2
{ const L1 = t.w.lasers[0];
  t.go(1, 6.6, -6.6); t.go(0, 7.5, -4); t.idle(0.3); console.log('bridge', t.w.bridges[0].on);
  t.waitFor(u => !L1.on && (u.w.t % 2.8) < 1.65, 6); t.go(0, 16, -4, 3, 0.2); t.go(0, 17, -4); console.log('bolt across', t.st(), t.log);
  // reel: start right as the curtain switches off
  const dx = t.n.pos.x - t.b.pos.x, dz = t.n.pos.z - t.b.pos.z, d = Math.hypot(dx, dz); t.tick({ mx: dx / d * 0.3, mz: dz / d * 0.3 }, {});
  t.waitFor(u => !L1.on && (u.w.t % 2.8) > 1.6 && (u.w.t % 2.8) < 1.65, 6);
  t.run(1.4, () => ({ power: true })); t.run(0.4, () => ({ power: true, ...t.steer(t.b, 20, -3) })); t.idle(0.6); console.log('reeled', t.st(), t.log);
  t.both(21, -2.5, 21, -5); console.log('P1', t.st(), t.log); }
// 2. Class of Shift 3
{ t.go(0, 29.4, -4); t.go(1, 28.3, -4); t.idle(0.3); t.tick({}, { power: true });
  let hung = false; for (let i = 0; i < 180 && !hung; i++) { t.tick({ mx: 1, power: i > 12 }, {}); hung = !!t.b.hang; } console.log('hanging', hung, t.st(), t.log);
  t.run(0.5, () => ({ power: true })); t.tick({ mx: 1, jump: true }, {}); t.run(1.5, () => ({ mx: 1, jump: true })); t.idle(0.3); console.log('far floor', t.st(), t.log);
  t.go(0, 48, -1.8); t.idle(0.3); console.log('bridge', t.w.bridges[1].on); t.go(1, 30, -4); t.go(1, 46.5, -4, 6); t.go(1, 47.5, -6); t.idle(0.3); console.log('P2', t.st(), t.log); }
// 3. Class of Shift 4
{ t.go(1, 51.7, -6.8); t.idle(0.2); t.tick({}, { power: true }); t.run(1.2, () => ({}), () => t.n.pos.y > 4.0 || t.n.pos.x > 53.5 ? t.steer(t.n, 55, -6.8) : {}); t.idle(0.4); console.log('nut on shelf', t.st(), t.log);
  t.go(1, 56.4, -6.8, 3, 0.1);
  t.go(0, 58.2, -4.5); t.waitFor(u => u.b.pos.y > 5.5 && u.b.vel.y < 1, 6, u => u.steer(u.b, 58.2, -6.8)); console.log('bolt at top', t.st()); t.tick({}, { power: true });
  t.run(1.5, () => ({ mx: 0.5 })); t.idle(0.4); console.log('gantry', t.st(), 'ch3', t.w.channels[3], t.log);
  t.go(0, 61.5, -6.8); t.idle(1.5); console.log('gate', t.w.gates[0].open.toFixed(2));
  t.go(1, 57, -4.5); t.go(1, 69, -4); t.go(0, 70.5, -6.8); t.go(0, 70.5, -2); t.both(69, -2, 69, -4); console.log('P3', t.st(), t.log); }
// 4. Class of Shift 5
{ const A = c[0];
  console.log('crate by the edge', t.pos(A));
  t.go(0, 77.5, -6.3); t.go(1, 76.4, -6.3); t.idle(0.3); t.tick({}, { power: true });
  let hung = false; for (let i = 0; i < 180 && !hung; i++) { t.tick({ mx: 1, power: i > 10 }, {}); hung = !!t.b.hang; } console.log('magnet', hung, t.st(), t.log);
  // golden cog: let go toward the second magnet and grab it in mid air
  t.run(0.4, () => ({ power: true })); t.tick({ mx: 1, jump: true }, {}); let h2 = false; for (let i = 0; i < 120 && !h2; i++) { t.tick({ mx: 1, power: i > 15 }, {}); h2 = !!t.b.hang && t.b.pos.x > 88; } console.log('second magnet', h2, 'cog', t.w.cogs[0].got, t.st());
  t.idle(1.5); t.go(0, 87.8, -3.5, 6, 0.1); t.tick({ mx: -0.3 }, {}); t.run(1.6, () => ({ power: true })); console.log('reeled crate', A.pulledBy === t.b, t.pos(A));
  t.carry(A, 90.5, -6.6, 0, -1); console.log('crate on plate', t.pos(A), 'ch4', t.w.channels[4], t.log);
  t.go(1, 78, -4); t.go(1, 88.5, -4, 6); t.both(95, -3, 95, -5.5); t.idle(2); console.log('P4', t.st(), t.log); }
// ---------------- shortcut checks (separate worlds, positions set directly)
const G = 8.8;
const put = (p, x, y, z) => { p.pos = { x, y, z }; p.prev = { ...p.pos }; p.vel = { x: 0, y: 0, z: 0 }; };
const stack = (u, x, y, z, steer, sec = 6) => { put(u.b, x, y + 0.56, z); put(u.n, x, y + 1.7, z); u.idle(0.5); const on = u.n.ground === u.b; let pk = 0, i = 0, dead = false;
  for (let k = 0; k < sec * 60 && !dead; k++) { u.tick(steer, { power: (i++ % 6) === 0 }); dead = u.log.some(e => e.includes('zap')); if (!dead) pk = Math.max(pk, u.b.pos.y - 0.55); }
  return { on, pk: pk.toFixed(2), zaps: JSON.stringify(u.w.stats.zaps) }; };
const launch = (u, bx, by, bz, nx, nz, steer, sec = 2.5) => { put(u.b, bx, by + 0.56, bz); put(u.n, nx, by + 0.46, nz); u.idle(0.3); u.tick({}, { power: true }); let pk = 0; u.run(sec, () => { pk = Math.max(pk, u.b.pos.y - 0.55); return steer; }); return pk.toFixed(2); };
const dbl = (u, bx, bz, nx, nz, steer) => { put(u.b, bx, 0.56, bz); put(u.n, nx, 0.46, nz); u.idle(0.3); u.tick({}, { power: true }); let again = false, pk = 0;
  u.run(3.5, () => { pk = Math.max(pk, u.b.pos.y - 0.55); return steer; }, () => { if (!again && u.b.vel.y < 0 && Math.hypot(u.b.pos.x - u.n.pos.x, u.b.pos.y - u.n.pos.y, u.b.pos.z - u.n.pos.z) < 3.25) { again = true; return { power: true }; } return u.steer(u.n, u.b.pos.x, u.b.pos.z); }); return { again, pk: pk.toFixed(2) }; };
const boost = (u, nx, nz, steer) => { put(u.n, nx, 0.46, nz); put(u.b, nx - 1.3, 0.56, nz); u.idle(0.3); for (let i = 0; i < 70; i++) u.tick({ jump: i < 15, ...u.steer(u.b, u.n.pos.x, u.n.pos.z) }, {}); const on = u.b.ground === u.n; u.run(1.5, () => ({ jump: true, ...steer })); return on; };
const solo = (u, who, x, z, sec = 3) => { put(u.w.players[1 - who], 1, 0.5, -1); put(u.w.players[who], x, who ? 0.46 : 0.56, z); u.idle(0.3); let i = 0; u.run(sec, () => who ? {} : { mx: 1, jump: i++ % 20 < 12 }, () => who ? { mx: 1, jump: i++ % 20 < 12 } : {}); return u.w.players[who]; };
// Class of Shift 2
{ const r = []; for (const who of [0, 1]) { const u = new Bot(level); solo(u, who, 7.4, -4); r.push((who ? 'Nut' : 'Bolt') + ' falls ' + u.w.stats.falls[who]); } console.log('Shift 2 room: each robot alone jumps at the gap (falls should be 1 each)', r.join(' | ')); }
{ let across = 0, n = 0; for (let ph = 0; ph < 2.8; ph += 0.2) { const u = new Bot(level); put(u.b, 1, 0.56, -1); put(u.n, 1, 0.46, -2); u.idle(ph); const pk = launch(u, 7.6, 0, -4, 6.5, -4, { mx: 1 }); n++; if (u.b.pos.x > 16.5 && !u.log.some(e => e.includes('zap') || e.includes('fall'))) across++; } console.log('Shift 2 room: Nut launches Bolt over the gap at 14 points of the curtain cycle (across should be 0)', across, 'of', n); }
{ const u = new Bot(level); const on = boost(u, 7.4, -4, { mx: 1 }); console.log('Shift 2 room: Bolt boosts off Nut over the gap (on head', on + ', falls should be 1)', u.w.stats.falls[0]); }
{ const u = new Bot(level); const r = stack(u, 7.4, 0, -4, { mx: 1 }); console.log('Shift 2 room: Nut stands on Bolt and keeps pushing toward the gap (across should be false)', u.b.pos.x > 16.5 && u.b.alive && !u.log.some(e => e.includes('zap') || e.includes('fall')), 'zaps', r.zaps, 'falls', JSON.stringify(u.w.stats.falls)); }
{ let ok = 0, n = 0; const good = []; for (let k = 0; k < 56; k++) { const u = new Bot(level); put(u.n, 6.6, 0.54, -6.6); put(u.b, 17, 0.56, -4); u.b.face = { x: -1, z: 0 }; u.idle(0.2); const L1 = u.w.lasers[0]; u.waitFor(w => !L1.on && (w.w.t % 2.8) > 1.6 && (w.w.t % 2.8) < 1.62, 4); u.idle(k * 0.05);
    u.run(1.6, () => ({ power: true })); u.idle(0.5); n++; if (u.n.pos.x > 14.5 && u.w.stats.zaps[1] === 0) { ok++; good.push(k * 0.05); } }
  console.log('Shift 2 room: Bolt starts the reel at every 0.05 s of the 2.8 s curtain cycle (good starts, seconds of each cycle)', ok, 'of', n, '=', (ok * 0.05).toFixed(2), 's; a reel at any other moment zaps Nut'); }
// Class of Shift 3
{ let hung = false, best = 99; for (const z of [-1, -4, -7]) for (let k = 0; k < 20; k++) { const u = new Bot(level); put(u.b, 29.4, 0.56, z); put(u.n, 1, 0.5, -1); u.idle(0.3); u.tick({ mx: 1, jump: true }, {}); u.run(k / 60, () => ({ mx: 1, jump: true })); u.run(1.2, () => ({ mx: 1, power: true, jump: true })); if (u.b.hang || (u.b.target && u.b.target.kind === 'anchor')) hung = true; }
  const v = new Bot(level); const on = boost(v, 29.4, -4, { mx: 1, power: true }); console.log('Shift 3 room: Bolt jumps off the edge (or boosts off Nut) reaching for the ring (grabbed should be false)', hung, v.b.target && v.b.target.kind === 'anchor' ? true : false, 'boost on head', on); }
{ const u = new Bot(level); launch(u, 29.4, 0, -4, 28.3, -4, { mx: 1 }); console.log('Shift 3 room: launch over the gap without the ring (across should be false)', u.b.pos.x > 46.5 && u.w.stats.falls[0] === 0, 'falls', u.w.stats.falls[0]); }
{ const u = new Bot(level); const r = dbl(u, 29.4, -4, 28.3, -4, { mx: 1 }); console.log('Shift 3 room: launch and relaunch over the gap (relaunched', r.again + ', across should be false)', u.b.pos.x > 46.5 && u.w.stats.falls[0] === 0, 'falls', u.w.stats.falls[0]); }
{ const u = new Bot(level); const r = stack(u, 29.4, 0, -4, { mx: 1 }); console.log('Shift 3 room: Nut stands on Bolt and keeps pushing (zapped should be nonzero)', r.zaps, 'peak feet', r.pk); }
// Class of Shift 4
{ const u = new Bot(level); put(u.b, 1, 0.56, -1); put(u.n, 51.7, 0.46, -6.8); u.idle(0.3); u.tick({}, { power: true }); let pk = 0; u.run(2, () => ({}), () => { pk = Math.max(pk, u.n.pos.y - 0.45); return { mx: 1 }; }); console.log('Shift 4 room: Nut rockets off the iron toward the gantry (on gantry should be false)', u.n.pos.y > G, 'peak feet', pk.toFixed(2), 'gantry', G); }
{ const u = new Bot(level); put(u.n, 1, 0.5, -1); put(u.b, 58.2, 0.56, -4.5); u.idle(0.2); let pk = 0; u.run(5, () => { pk = Math.max(pk, u.b.pos.y - 0.55); return u.b.vel.y < 0 && u.b.pos.y > 4 ? { mx: 1 } : u.steer(u.b, 58.2, -6.8); }); console.log('Shift 4 room: Bolt bounces alone (on gantry should be false)', u.b.pos.y > G, 'peak feet', pk.toFixed(2)); }
{ let best = 0, up = false; for (const [nx, nz] of [[56.2, -4.5], [56.5, -3.6], [57.5, -4.2], [59.6, -4.2], [60.5, -4.6]]) { const u = new Bot(level); put(u.n, nx, 0.46, nz); put(u.b, 58.2, 0.56, -4.5); u.idle(0.2); let pk = 0, fired = false;
    u.run(6, () => { pk = Math.max(pk, u.b.pos.y - 0.55); return fired ? { mx: 1, mz: -0.4 } : u.steer(u.b, 58.2, -6.8); }, () => { const d = Math.hypot(u.b.pos.x - u.n.pos.x, u.b.pos.y - u.n.pos.y, u.b.pos.z - u.n.pos.z); if (!fired && u.b.pos.y > 1 && d < 3.25 && d > 2.9 && u.b.vel.y > 0) { fired = true; return { power: true }; } return {}; });
    best = Math.max(best, pk); if (u.b.pos.y > G) up = true; }
  console.log('Shift 4 room: Nut on the floor launches Bolt as he bounces, five spots (on gantry should be false)', up, 'peak feet', best.toFixed(2)); }
{ const u = new Bot(level); const pk = launch(u, 56.4, 3.5, -6.8, 55, -6.8, { mx: 1 }); console.log('Shift 4 room: both on the shelf, Nut launches Bolt (on gantry should be false)', u.b.pos.y > G, 'peak feet', pk); }
{ const u = new Bot(level); put(u.b, 55.6, 4.06, -6.8); put(u.n, 55.5, 3.96, -5.9); u.idle(0.3); u.tick({}, { power: true }); let again = false, pk = 0; u.run(3, () => { pk = Math.max(pk, u.b.pos.y - 0.55); return again ? { mx: 1 } : u.steer(u.b, 55.6, -6.8); }, () => { if (!again && u.b.vel.y < 0 && Math.hypot(u.b.pos.x - u.n.pos.x, u.b.pos.y - u.n.pos.y, u.b.pos.z - u.n.pos.z) < 3.25) { again = true; return { power: true }; } return {}; });
  console.log('Shift 4 room: launch and relaunch from the shelf (relaunched', again + ', on gantry should be false)', u.b.pos.y > G, 'peak feet', pk.toFixed(2), 'zaps', u.w.stats.zaps[0]); }
{ const r = []; for (const [nm, x, y, z] of [['floor', 55, 0, -3], ['shelf', 55.5, 3.5, -6.8], ['spring', 58.2, 0.3, -6.8]]) { const u = new Bot(level); const s = stack(u, x, y, z, { mx: 1 }); r.push(nm + ' on head ' + s.on + ' zaps ' + s.zaps + ' on gantry ' + (u.b.pos.y > G && u.b.pos.x > 59.5)); }
  console.log('Shift 4 room: Nut stands on Bolt and keeps pushing (gantry should be false everywhere)', r.join(' | ')); }
{ const u = new Bot(level); const on = boost(u, 64, -3, { mx: 1 }); const v = new Bot(level); launch(v, 64.8, 0, -3, 63.7, -3, { mx: 1 }); console.log('Shift 4 room: boost and launch at the gate (past it should be false)', u.b.pos.x > 67, v.b.pos.x > 67, 'on head', on); }
{ const u = new Bot(level); launch(u, 55, 0, -6.5, 55, -5.3, { mz: -1 }); console.log('Shift 4 room: launch at the back wall (on top should be false)', u.b.pos.z < -8); }
// Class of Shift 5
{ let hung = false; for (const [x, y, z] of [[77.4, 0, -7.4], [84, 0, -4.6], [77.4, 1.2, -4]]) for (let k = 0; k < 20; k += 4) { const u = new Bot(level); put(u.n, 1, 0.5, -1); const A = u.w.crates[0]; if (y > 0) put(A, x, 0.61, z); put(u.b, x, y + 0.56, z); u.idle(0.3); u.b.face = { x: 1, z: -0.3 }; u.tick({ mx: 1, mz: -0.3, jump: true }, {}); u.run(k / 60, () => ({ jump: true })); u.run(1.2, () => ({ mx: 1, mz: -0.4, power: true, jump: true })); if (u.b.target && u.b.target.kind === 'anchor') hung = true; }
  console.log('Shift 5 room: Bolt alone jumps for the magnet from the edge, from the bridge and from on top of the crate (grabbed should be false)', hung); }
{ const u = new Bot(level); launch(u, 77.5, 0, -6.3, 76.4, -6.3, { mx: 1 }); console.log('Shift 5 room: launch over the gap without the magnet (across should be false)', u.b.pos.x > 87.5 && u.w.stats.falls[0] === 0, 'falls', u.w.stats.falls[0]); }
{ const r = []; for (const st of [{ mx: 1 }, {}]) { const u = new Bot(level); const s = stack(u, 77.3, 0, -5, st); r.push('zaps ' + s.zaps + ' across ' + (u.b.pos.x > 87.5)); } console.log('Shift 5 room: Nut stands on Bolt at the edge and keeps pushing, steering out over the gap or not (zapped should be nonzero)', r.join(' | ')); }
{ const u = new Bot(level); put(u.n, 76, 0.46, -2); put(u.b, 90.5, 0.56, -6.6); u.idle(1); u.go(1, 77.5, -4); u.go(1, 89, -4, 4); u.go(1, 96, -2, 4); const nutPast = u.n.pos.x > 93; u.go(0, 96, -6, 4); console.log('Shift 5 room: Bolt holds the plate himself instead of the crate (Nut past', nutPast + ', Bolt past should be false)', u.b.pos.x > 93, 'gate', u.w.gates[1].open.toFixed(2)); }
{ const u = new Bot(level); const A = u.w.crates[0]; put(A, 82, 0.61, -4); u.idle(3); put(u.b, 87.75, 0.56, -3.5); u.b.face = { x: -1, z: 0 }; u.idle(0.2); u.run(1.6, () => ({ power: true })); console.log('Shift 5 room: a crate dropped in the gap goes home, and Bolt can still reel it from the far edge (grabbed should be true)', A.pulledBy === u.b, u.log.join(' ')); }
console.log('stats', JSON.stringify(t.w.stats));
console.log('cog', t.w.cogs[0].got);
console.log(t.st(), 'complete', t.w.complete, t.log);
