import { Bot } from './bot.mjs';
import level from '../src/lv/s30.js';
const t = new Bot(level); const R = t.w.anchors;
const near = (a, x, tol = 0.4) => Math.abs(a.x - x) < tol;
// Bolt waits under ring a at its start (x0), grabs it, rides until the ring reaches x1, lets go
const ride = (a, bx, bz, x0, x1) => { t.go(0, bx, bz); t.waitFor(() => near(a, x0) && a.dir > 0 && a.wait <= 0, 20); t.tick({ mx: 0.3 }, {}); t.run(0.1, () => ({ power: true }));
  const ok = t.waitFor(() => t.b.target && t.b.target.obj === a && t.b.hang, 3, { power: true }); t.waitFor(() => a.x >= x1 - 0.05, 12, { power: true }); t.tick({}, {}); t.idle(1); return ok; };
// Bolt faces Nut and holds X until she arrives, then lets go
const reel = (sec = 2.5, nin = () => ({})) => { const dx = t.n.pos.x - t.b.pos.x, dz = t.n.pos.z - t.b.pos.z, d = Math.hypot(dx, dz); t.tick({ mx: dx / d * 0.3, mz: dz / d * 0.3 }, {}); let got = false; t.run(sec, () => { if (t.b.target && t.b.target.obj === t.n) got = true; return { power: true }; }, nin); for (let i = 0; i < 6; i++) t.tick({ power: true, mx: -dx / d * 0.3, mz: -dz / d * 0.3 }, {}); t.run(0.6, () => ({ power: true })); t.idle(0.8); return got; };
// 1. Wind Vane
{ t.go(1, 6, -6); const ok = ride(R[0], 8.6, -3.5, 11, 23); console.log('ride', ok, t.st(), t.log);
  t.go(1, 11.55, -3.5, 6, 0.08); t.go(0, 21.9, -3.5, 6, 0.08); let pressed = false; const got = reel(2.5, () => { if (!pressed && t.n.pos.x > 15.5) { pressed = true; return { power: true }; } return {}; });
  console.log('reel', got, t.st(), 'switch', t.w.switches[0].on, t.log);
  t.both(31, -2.5, 31, -5.5); console.log('P1', t.st(), t.log); }
// 2. Updraft
{ t.go(1, 29.5, -3); const ok = ride(R[1], 31.6, -6.6, 34, 50.5); console.log('ride', ok, t.st(), t.log);
  t.go(0, 50.8, -4, 6, 0.1); t.idle(0.5); console.log('plate', !!t.w.channels[2]);
  t.go(1, 32, -4); let up = false; for (let i = 0; i < 240; i++) { t.tick({}, { mx: 1 }); if (t.n.vel.y > 5) up = true; if (up && t.n.pos.x > 40) break; } t.idle(1.5); console.log('floating', t.st(), t.log);
  const got = reel(2.5); console.log('reel', got, t.st(), t.log);
  t.both(55, -2.5, 55, -5.5); console.log('P2', t.st(), t.log); }
// golden cog
t.go(0, 56.5, -6.8); t.go(1, 56.5, -5.6, 6, 0.15); t.idle(0.2); t.tick({}, { power: true }); t.run(1.2, () => t.steer(t.b, 56.5, -6.8)); t.idle(0.8); console.log('cog', t.w.cogs[0].got, t.st(), t.log);
// 3. Rain Gauge
{ t.go(1, 58.5, -3.5); const ok = ride(R[2], 57.6, -6.6, 60, 72.5); console.log('ride', ok, t.st(), t.log);
  t.go(0, 71.3, -4, 6, 0.1); t.go(1, 61.4, -1.6); t.go(1, 61.4, -4, 4, 0.1); for (let i = 0; i < 120; i++) t.tick({}, t.steer(t.n, 61.4, -4)); let mx = 0, apex = []; for (let i = 0; i < 300; i++) { t.tick({}, {}); if (t.n.vel.y < 0.3 && t.n.vel.y > -0.3 && t.n.pos.y > 2) { apex.push(i); if (apex.length > 1) break; } mx = Math.max(mx, t.n.pos.y); }
  console.log('bounce max', mx.toFixed(2), t.st(), t.log);
  const got = reel(2.5); console.log('reel', got, t.st(), t.log);
  t.both(77, -2.5, 77, -5.5); console.log('P3', t.st(), t.log); }
// 4. Lightning Rod
{ t.go(1, 81, -2, 6, 0.1); const ok = ride(R[3], 80.6, -6.8, 83, 94.2); console.log('ride', ok, t.st(), 'latched', t.w.gates[0].latched, t.log);
  t.go(1, 83.9, -2.5, 6, 0.1); t.go(0, 93.8, -5.5, 6, 0.1); const got = reel(2.5); console.log('reel', got, t.st(), t.log);
  t.both(98, -3, 98, -5.5); t.idle(1.5); console.log('P4', t.st(), t.log); }
console.log('stats', JSON.stringify(t.w.stats));
console.log('cog', t.w.cogs[0].got);
console.log(t.st(), 'complete', t.w.complete, t.log);
// ---------------- shortcut checks
const put = (p, x, y, z) => { p.pos = { x, y, z }; p.prev = { ...p.pos }; p.vel = { x: 0, y: 0, z: 0 }; };
const stack = (u, x, z, steer, sec = 6) => { put(u.b, x, 0.56, z); put(u.n, x, 1.7, z); u.idle(0.5); const on = u.n.ground === u.b; let pk = 0, mx = 0, i = 0, dead = false;
  for (let k = 0; k < sec * 60 && !dead; k++) { u.tick(u.b.pos.y > 4 ? steer : {}, { power: (i++ % 8) === 0 }); dead = u.log.some(e => e.includes('zap')); if (!dead) { pk = Math.max(pk, u.b.pos.y - 0.55); mx = Math.max(mx, u.b.pos.x); } }
  return { on, pk: pk.toFixed(2), mx: mx.toFixed(2) }; };
const dbl = (u, bx, bz, nx, nz, steer) => { put(u.b, bx, 0.56, bz); put(u.n, nx, 0.46, nz); u.idle(0.3); u.tick({}, { power: true }); let again = false, mx = 0;
  u.run(3.5, () => { mx = Math.max(mx, u.b.pos.x); return again ? steer : u.steer(u.b, u.n.pos.x, u.n.pos.z); }, () => { if (!again && u.b.vel.y < 0 && u.b.pos.y < 3.5 && Math.hypot(u.b.pos.x - u.n.pos.x, u.b.pos.y - u.n.pos.y, u.b.pos.z - u.n.pos.z) < 3.25) { again = true; return { power: true }; } return {}; }); return { again, mx: mx.toFixed(2) }; };
const launch = (u, bx, bz, nx, nz, steer) => { put(u.b, bx, 0.56, bz); put(u.n, nx, 0.46, nz); u.idle(0.3); u.tick({}, { power: true }); let mx = 0; u.run(2.5, () => { mx = Math.max(mx, u.b.pos.x); return steer; }); return mx.toFixed(2); };
const boost = (u, nx, nz, steer) => { put(u.n, nx, 0.46, nz); put(u.b, nx - 1.3, 0.56, nz); u.idle(0.3); for (let i = 0; i < 70; i++) u.tick({ jump: i < 15, ...u.steer(u.b, u.n.pos.x, u.n.pos.z) }, {}); const on = u.b.ground === u.n; let mx = 0; u.run(1.5, () => { mx = Math.max(mx, u.b.pos.x); return { jump: true, ...steer }; }); return { on, mx: mx.toFixed(2) }; };
const gaps = [['Wind Vane', 11.4, 21.5], ['Updraft', 34.4, 49.5], ['Rain Gauge', 61.3, 70.6], ['Lightning Rod', 83.4, 93.5]];
// every gap: launch, double launch, boost, stacking
for (const [nm, x, far] of gaps) { const z = nm === 'Rain Gauge' ? -6.5 : -4;
  const u1 = new Bot(level); const l = launch(u1, x, z, x - 1.1, z, { mx: 1 });
  const u2 = new Bot(level); const d = dbl(u2, x, z, x - 1.1, z, { mx: 1 });
  const u3 = new Bot(level); const bo = boost(u3, x, z, { mx: 1 });
  const u4 = new Bot(level); const st = stack(u4, x, z, { mx: 1 });
  const across = u => u.b.pos.x > far && u.b.alive && !u.log.some(e => e.includes('zap'));
  console.log(nm + ' gap: launch (furthest x', l + ', zaps', u1.w.stats.zaps[0] + ', across', across(u1) + ') | double launch (relaunched', d.again + ', zaps', u2.w.stats.zaps[0] + ', across', across(u2) + ') | boost (on head', bo.on + ', zaps', u3.w.stats.zaps[0] + ', across', across(u3) + ') | stack (on head', st.on + ', peak feet', st.pk + ', zapped', JSON.stringify(u4.w.stats.zaps) + ', across', across(u4) + ')');
}
// a passenger on the ring: Nut stands on Bolt, Bolt grabs the ring
for (const [nm, a, x, z] of [['Wind Vane', 0, 8.6, -3.5], ['Updraft', 1, 31.6, -6.6], ['Rain Gauge', 2, 57.6, -6.6], ['Lightning Rod', 3, 80.6, -6.8]]) {
  const u = new Bot(level); const A = u.w.anchors[a]; put(u.b, x, 0.56, z); put(u.n, x, 1.7, z); u.idle(0.5); const on = u.n.ground === u.b;
  u.waitFor(() => Math.abs(A.x - A.x0 - 0) < 0.3 || true, 0); u.waitFor(() => A.dir > 0 && A.wait <= 0 && Math.abs(A.x - (x + 2.4)) < 0.4, 20); u.tick({ mx: 0.3 }, {}); u.run(0.1, () => ({ power: true })); const tk = u.b.target && u.b.target.kind; u.run(2.9, () => ({ power: true }));
  console.log(nm + ': Nut stands on Bolt\'s head and he presses X for the ring (on head', on + ', he takes', tk + ', hanging on the ring should be false)', !!u.b.hang); }
// P1
{ let on = false; for (const [x, z] of [[11.6, -5.8], [21.7, -5.8]]) { const u = new Bot(level); put(u.n, x, 0.46, z); u.idle(0.3); u.tick({}, { power: true }); u.idle(0.5); on = on || u.w.switches[0].on; } console.log('Wind Vane: Nut presses X at either edge of the gap (switch should be false)', on); }
{ const u = new Bot(level); put(u.b, 27, 0.56, -4); u.idle(0.3); u.run(1.5, () => ({ mx: 1 })); console.log('Wind Vane: walk into the curtain while it is on (zaps should be 1)', u.w.stats.zaps[0]); }
{ const u = new Bot(level); put(u.b, 21.9, 0.56, -3.5); put(u.n, 11.55, 0.46, -3.5); u.idle(0.3); u.tick({ mx: -0.3 }, {}); u.run(2.5, () => ({ power: true })); for (let i = 0; i < 6; i++) u.tick({ power: true, mx: 0.3 }, {}); u.run(0.6, () => ({ power: true })); u.idle(1); console.log('Wind Vane: Bolt reels Nut over without her pressing (switch should be false)', u.w.switches[0].on, u.st(), 'zaps', JSON.stringify(u.w.stats.zaps)); }
// P2
{ const u = new Bot(level); put(u.n, 32, 0.46, -4); u.idle(0.3); u.run(2, null, () => ({ mx: 1 })); console.log('Updraft: Nut runs at the spring with nobody on the plate (zaps should be at least 1)', u.w.stats.zaps[1]); }
{ const u = new Bot(level); put(u.b, 49.7, 0.56, -4); put(u.n, 34.6, 0.46, -4); u.idle(0.5); const onPlate = !!u.w.channels[2]; u.tick({ mx: -0.3 }, {}); let got = false; u.run(2, () => { if (u.b.target && u.b.target.obj === u.n) got = true; return { power: true }; }); console.log('Updraft: Bolt on the plate reels Nut straight from the roof edge (plate', onPlate + ', got should be false)', got); }
{ const u = new Bot(level); put(u.b, 52.5, 0.56, -4); put(u.n, 41, 2.5, -4); u.idle(2); console.log('Updraft: Nut over the vent with nobody on the plate (zaps should be 1)', u.w.stats.zaps[1]); }
// P3
{ const u = new Bot(level); put(u.b, 71.3, 3.56, -4); put(u.n, 61.2, 0.46, -1.2); u.idle(0.5); u.tick({ mx: -0.3 }, {}); u.run(2.5, () => ({ power: true })); u.idle(1); console.log('Rain Gauge: Bolt reels Nut off the roof floor through the fence (Nut zaps should be 1)', u.w.stats.zaps[1]); }
{ const u = new Bot(level); put(u.n, 58.5, 0.46, -4); u.idle(0.3); u.run(2.5, null, () => ({ mx: 1 })); console.log('Rain Gauge: Nut runs onto the spring toward the fence (zaps should be 1)', u.w.stats.zaps[1], u.pos(u.n)); }
{ const u = new Bot(level); put(u.b, 61.4, 0.56, -1.2); u.idle(0.3); u.go(0, 61.4, -4, 2); u.run(2.5, () => ({ mx: 1 })); console.log('Rain Gauge: Bolt bounces toward the platform himself (zaps should be at least 1)', u.w.stats.zaps[0]); }
// P4
{ const u = new Bot(level); const A = u.w.anchors[3]; put(u.b, 80.6, 0.56, -6.8); put(u.n, 76, 0.46, -4); u.waitFor(() => A.dir > 0 && A.wait <= 0 && Math.abs(A.x - 83) < 0.4, 20); u.tick({ mx: 0.3 }, {}); u.run(0.1, () => ({ power: true })); u.waitFor(() => A.x > 94, 12, { power: true }); u.idle(1);
  console.log('Lightning Rod: Bolt rides over the rod with nobody on the lime plate (latched should be false)', u.w.gates[0].latched); }
{ const u = new Bot(level); put(u.n, 81, 0.54, -2); u.idle(3); console.log('Lightning Rod: Nut on the lime plate alone (latched should be false)', u.w.gates[0].latched); }
{ const u = new Bot(level); put(u.b, 94.5, 0.56, -4); put(u.n, 84, 0.46, -4); u.idle(0.3); u.tick({ mx: 1 }, {}); u.run(2, () => ({ mx: 1 })); console.log('Lightning Rod: exit gate stays shut without the latch (Bolt x should stay < 95.6)', u.b.pos.x.toFixed(2)); }
{ const u = new Bot(level); const A = u.w.anchors[3]; put(u.b, 80.6, 0.56, -6.8); u.waitFor(() => A.dir > 0 && A.wait <= 0 && Math.abs(A.x - 83) < 0.4, 20); u.tick({ mx: 0.3 }, {}); u.run(0.1, () => ({ power: true })); u.waitFor(() => A.x > 88.8, 12, { power: true }); u.idle(2); console.log('Lightning Rod: Bolt lets go over the rod', u.pos(u.b), 'zaps', u.w.stats.zaps[0]); }
// golden cog
{ const u = new Bot(level); const r = boost(u, 56.5, -5.4, u.steer(u.b, 56.5, -6.8)); console.log('Cog: Bolt jumps off Nut\'s head (on head', r.on + ', cog should be false)', u.w.cogs[0].got); }
{ const u = new Bot(level); const A = u.w.anchors[2]; put(u.b, 61, 0.56, -6.6); u.waitFor(() => A.wait > 0.2 && Math.abs(A.x - 60) < 0.3, 20); u.tick({ mx: -0.3 }, {}); u.run(0.6, () => ({ power: true })); u.tick({ mx: -1, power: true, jump: true }, {}); u.run(1.5, () => ({ mx: -1 })); console.log('Cog: Bolt jumps off the gauge ring toward the cog (cog should be false)', u.w.cogs[0].got, u.w.stats.zaps[0]); }
// back walls: the lightning net is under the top of every back wall
{ const u = new Bot(level); const top = Math.min(...u.w.solids.filter(s => s.style === 'backwall').map(s => s.max.y)); console.log('Back walls: lowest back wall top', top, 'is above the net bottom 5.6 (nobody can get onto one):', top > 6.1); }

