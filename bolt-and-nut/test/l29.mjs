import { Bot } from './bot.mjs';
import level from '../src/lv/s29.js';
const t = new Bot(level); const c = t.w.crates;
// carry the crate Bolt holds: walk to (x,z) holding X, turn to face (fx,fz), wait, let go
const place = (x, z, fx, fz, hold = 0.6) => { t.goHold(x, z, 8); for (let i = 0; i < 4; i++) t.tick({ power: true, mx: fx * 0.3, mz: fz * 0.3 }, {}); t.run(hold, () => ({ power: true })); t.idle(0.6); };
// 1. Print Queue
{ const A = c[0];
  t.go(1, 14.5, -2.5); t.idle(0.3); console.log('button', !!t.w.channels[2]);
  t.go(0, 3.5, -3.5); t.grab(0, -1, 1.2); console.log('grab', A.pulledBy === t.b, t.pos(A));
  place(8.5, -5.0, 0, -1); console.log('on belt', t.pos(A));
  t.go(0, 8.5, -3.5); t.waitFor(() => t.w.channels[1], 8); t.idle(1); console.log('tray', t.pos(A), 'ch1', !!t.w.channels[1], t.w.gates[0].open);
  t.go(0, 10, -1.8); t.go(0, 13, -1.8); console.log('P1', t.st(), t.log);
}
// golden cog: Nut launches Bolt under it
t.go(0, 23.5, -6.6); t.go(1, 23.5, -5.4, 6, 0.15); t.idle(0.2); t.tick({}, { power: true }); t.run(1.2, () => t.steer(t.b, 23.5, -6.6)); t.idle(0.8); console.log('cog', t.w.cogs[0].got, t.st());
t.both(26, -4.5, 28, -4.5); console.log('P1 done', t.st(), t.log);
// 2. Fire Door
const pd = (x) => console.log(x, 'door', t.w.gates[1].open.toFixed(2), 'bridge', t.w.bridges[0].on, t.st());
t.go(0, 25.5, -1.6); t.idle(1); pd('bolt on plate'); t.go(1, 31.8, -4); pd('nut in lobby');
t.go(0, 25.5, -4); t.idle(1); pd('bolt off'); t.go(1, 44.5, -1.6); t.idle(1); pd('nut on far plate');
t.go(0, 31.8, -4); pd('bolt in lobby'); t.go(1, 44.5, -4); t.idle(1); pd('nut off'); t.go(0, 42, -4); pd('bolt over');
t.both(47, -4, 47, -6); console.log('P2', t.st(), t.log);
// 3. In Tray
{ const A = c[1];
  t.go(0, 52.6, -6.5); t.idle(0.8); console.log('door', t.w.gates[2].open.toFixed(2)); t.go(1, 53, -1.5); t.go(1, 56.8, -2); t.go(1, 56.25, -6.5, 6, 0.1); t.idle(0.3); console.log('nut behind crate', t.st(), t.pos(A));
  t.tick({}, { power: true }); t.idle(2.5); console.log('thrown', t.pos(A), 'ch5', !!t.w.channels[5], 'exit', t.w.gates[3].open.toFixed(2), t.w.gates[3].latched);
  t.go(1, 63, -1.2); t.go(0, 51.2, -6.5); t.grab(1, 0, 2.5); t.run(1.2, () => ({ power: true })); console.log('pulled', A.pulledBy === t.b, t.pos(A)); t.idle(1); console.log('on lime', t.pos(A), !!t.w.channels[4], t.w.gates[2].open.toFixed(2));
  t.go(0, 52, -1.5); t.go(0, 57, -1.5); t.both(64, -2, 64, -4); t.both(69, -3, 69, -5.5); console.log('P3', t.st(), t.log); }
// 4. Standing Desks
{ const D = t.w.gates[4]; const sw = () => { t.tick({}, { power: true }); t.idle(0.3); };
  t.go(0, 84.3, -5); t.go(1, 75, -5.3); t.idle(0.3); console.log('desk', D.open.toFixed(2), t.st());
  sw(); t.idle(3); console.log('raised', D.open.toFixed(2), t.st()); t.go(0, 89, -5); t.idle(0.3); console.log('bolt up', t.st(), t.w.channels[3]);
  t.go(0, 89, -2.5); sw(); t.idle(3.5); console.log('lowered', D.open.toFixed(2)); t.go(1, 84.3, -5); t.idle(0.3);
  t.go(0, 89, -5); t.idle(3.5); console.log('nut raised', t.st()); t.go(1, 89, -3); t.both(93, -3, 93, -5.5); t.idle(1.5); console.log('P4', t.st(), t.log); }
// shortcut checks (separate worlds, positions set directly)
const put = (p, x, y, z) => { p.pos = { x, y, z }; p.prev = { ...p.pos }; p.vel = { x: 0, y: 0, z: 0 }; };
const stack = (u, x, z, steer, sec = 6) => { put(u.b, x, 0.56, z); put(u.n, x, 1.7, z); u.idle(0.5); const on = u.n.ground === u.b; let pk = 0, mx = 0, i = 0, dead = false;
  for (let k = 0; k < sec * 60 && !dead; k++) { u.tick(u.b.pos.y > 4 ? steer : {}, { power: (i++ % 8) === 0 }); dead = u.log.some(e => e.includes('zap:0')); if (!dead) { pk = Math.max(pk, u.b.pos.y - 0.55); mx = Math.max(mx, u.b.pos.x); } }
  return { on, pk: pk.toFixed(2), mx: mx.toFixed(2) }; };
// Nut launches Bolt, then pushes him again as he comes back down past her (she stays on the floor)
const dbl = (u, bx, bz, nx, nz, steer) => { put(u.b, bx, 0.56, bz); put(u.n, nx, 0.46, nz); u.idle(0.3); u.tick({}, { power: true }); let pk = 0, again = false;
  u.run(3.5, () => { pk = Math.max(pk, u.b.pos.y - 0.55); return again ? steer : u.steer(u.b, u.n.pos.x, u.n.pos.z); }, () => { if (!again && u.b.vel.y < 0 && u.b.pos.y < 3.5 && Math.hypot(u.b.pos.x - u.n.pos.x, u.b.pos.y - u.n.pos.y, u.b.pos.z - u.n.pos.z) < 3.25) { again = true; return { power: true }; } return {}; }); return { again, pk: pk.toFixed(2) }; };
// P1
{ const u = new Bot(level); const A = u.w.crates[0]; put(u.b, 8.5, 0.56, -4.6); put(A, 8.5, 0.62, -6.7); put(u.n, 20, 0.46, -2); u.idle(5); console.log('Print Queue: crate on the belt without the print button goes back to Accounts (tray should be false)', !!u.w.channels[1], u.pos(A)); }
{ const u = new Bot(level); const A = u.w.crates[0]; put(u.b, 10.6, 0.56, -6.7); put(A, 9, 0.62, -6.7); put(u.n, 20, 0.46, -2); u.idle(0.2); u.tick({ mx: 0.3 }, {}); u.run(1, () => ({ power: true })); u.run(0.5, () => ({ power: true, mx: 0.3 })); u.idle(5); console.log('Print Queue: Bolt pushes the crate through the hatch himself (tray should be false)', !!u.w.channels[1], u.pos(A)); }
{ const u = new Bot(level); put(u.b, 10, 0.56, -6.7); u.idle(0.2); u.run(1.5, () => ({ mx: 1, jump: true })); console.log('Print Queue: Bolt climbs into the hatch (zaps should be 1)', u.w.stats.zaps[0]); }
{ const u = new Bot(level); put(u.b, 10.5, 0.56, -4.5); put(u.n, 12.1, 0.46, -4.5); u.idle(0.3); u.tick({}, { power: true }); let mx = 0; u.run(2.5, () => { mx = Math.max(mx, u.b.pos.x); return { mx: 1 }; }); console.log('Print Queue: Nut launches Bolt through the wall (Bolt x should stay < 11)', mx.toFixed(2), u.w.stats.launches); }
{ const u = new Bot(level); put(u.b, 9.5, 0.56, -6.7); put(u.n, 13.5, 0.46, -6.7); u.idle(0.3); u.tick({ mx: 0.3 }, {}); u.run(2, () => ({ power: true })); console.log('Print Queue: Bolt reels Nut through the hatch (Nut zaps should be 1)', u.w.stats.zaps[1]); }
{ const u = new Bot(level); put(u.n, 13.5, 0.46, -5.0); u.idle(0.2); u.go(1, 17.2, -6.7, 3); u.idle(0.5); console.log('Print Queue: Nut walks into the tray (tray false, Nut zaps should be 1)', !!u.w.channels[1], u.w.stats.zaps[1]); }
{ const u = new Bot(level); const A = u.w.crates[0]; put(A, 3, 0.62, 3); u.idle(2); console.log('Print Queue: a lost crate goes home to Accounts', u.pos(A), u.log.join(' ')); }
{ const u = new Bot(level); u.w.gates[0].latched = true; put(u.b, 22.5, 0.56, -6.6); put(u.n, 21, 0.46, -6.6); u.idle(0.3); for (let i = 0; i < 70; i++) u.tick({ jump: i < 15, ...u.steer(u.b, u.n.pos.x, u.n.pos.z) }, {}); const on = u.b.ground === u.n; u.run(1, () => ({ jump: true, ...u.steer(u.b, 23.5, -6.6) })); console.log('Payroll: Bolt jumps off Nut\'s head at the cog (on head, cog should be false)', on, u.w.cogs[0].got); }
{ const u = new Bot(level); put(u.n, 14.5, 0.54, -2.5); put(u.b, 7, 0.57, -6.7); u.idle(0.3); let i = 0; u.run(4, () => ({ mx: 1, jump: (i++ % 6) < 3 })); console.log('Print Queue: Bolt quick-jumps along the running printer belt (zaps should be 1)', u.w.stats.zaps[0]); }
// stacking and double launches against the walls
for (const [nm, x, z] of [['Payroll at the fire door', 28.6, -4], ['Fire Door lobby at the pit', 32.2, -4], ['In Tray room at the wall', 52.6, -1.5], ['In Tray far room at the exit', 64.8, -4]]) { const u = new Bot(level); const r = stack(u, x, z, { mx: 1 }); console.log(nm + ': Nut stands on Bolt and keeps pushing, steering east (on head', r.on + ') zapped', JSON.stringify(u.w.stats.zaps), 'Bolt peak feet', r.pk, 'Bolt furthest x', r.mx); }
// P2
{ const u = new Bot(level); put(u.n, 31.8, 0.46, -4); put(u.b, 32.8, 0.56, -4); u.idle(0.3); u.tick({}, { power: true }); u.run(2, () => ({ mx: 1 })); console.log('Fire Door: Nut launches Bolt over the pit from the lobby (zaps should be 1)', u.w.stats.zaps[0], u.pos(u.b)); }
{ const u = new Bot(level); put(u.b, 34, 0.56, -4); u.idle(0.3); u.run(1.2, () => ({ mx: 1, jump: true })); console.log('Fire Door: jumping on the walkway (zaps should be 1)', u.w.stats.zaps[0]); }
{ const u = new Bot(level); put(u.b, 25.5, 0.64, -1.6); put(u.n, 20, 0.46, -2); u.idle(1); let mx = 0; u.run(3, () => { mx = Math.max(mx, u.b.pos.x); return { mx: 1 }; }); console.log('Fire Door: Bolt steps off the plate and runs for the door (Bolt x should stay < 30)', mx.toFixed(2)); }
{ const u = new Bot(level); put(u.n, 25.5, 0.54, -1.6); put(u.b, 31.6, 0.56, -2.2); u.idle(1); u.tick({ mx: -0.3 }, {}); u.run(2, () => ({ power: true })); u.idle(1); console.log('Fire Door: Bolt in the lobby reels Nut off the plate (Nut x should stay < 30)', u.n.pos.x.toFixed(2), 'door', u.w.gates[1].open.toFixed(2)); }
// P3
{ const u = new Bot(level); const A = u.w.crates[1]; put(u.n, 56.25, 0.46, -6.5); put(u.b, 47, 0.56, -2); u.idle(0.3); u.tick({}, { power: true }); u.idle(2.5); console.log('In Tray: crate in the tray with nobody on the lime plate (purple', !!u.w.channels[5], ', exit should be shut)', u.w.gates[3].open.toFixed(2)); }
{ const u = new Bot(level); const A = u.w.crates[1]; put(u.b, 58.1, 0.56, -6.5); put(u.n, 52.6, 0.54, -6.5); u.idle(0.5); u.tick({ mx: 0.3 }, {}); u.run(1, () => ({ power: true })); let mx = 0; u.run(2, () => { mx = Math.max(mx, A.pos.y); return { power: true, mx: 0.4, jump: true }; }); u.idle(2); console.log('In Tray: Nut on the lime plate, Bolt jumps the crate at the cabinet (purple should be false)', !!u.w.channels[5], 'crate peak', mx.toFixed(2), 'exit', u.w.gates[3].open.toFixed(2)); }
{ const u = new Bot(level); put(u.b, 58.3, 0.56, -6.5); put(u.n, 57.2, 0.46, -6.5); u.idle(0.3); u.tick({}, { power: true }); u.run(2, () => ({ mx: 1 })); console.log('In Tray: Nut launches Bolt onto the cabinet (zaps should be 1)', u.w.stats.zaps[0]); }
{ const u = new Bot(level); put(u.n, 59, 0.46, -4.5); put(u.b, 57.7, 0.56, -4.5); u.idle(0.3); for (let i = 0; i < 70; i++) u.tick({ jump: i < 15, ...u.steer(u.b, u.n.pos.x, u.n.pos.z) }, {}); const on = u.b.ground === u.n; u.run(1.2, () => ({ jump: true, ...u.steer(u.b, 61, -6.5) })); console.log('In Tray: Bolt boosts off Nut onto the cabinet (on head', on + ', zaps should be 1)', u.w.stats.zaps[0]); }
{ const u = new Bot(level); const A = u.w.crates[1]; put(A, 60, 0.62, 3); u.idle(2); console.log('In Tray: a lost crate goes home to the far room', u.pos(A), u.log.join(' ')); }
// P4
{ const u = new Bot(level); put(u.b, 84.3, 0.56, -5); put(u.n, 76, 0.46, -5); u.idle(2); u.go(1, 84.3, -5, 4); u.tick({}, { power: true }); u.idle(1); console.log('Standing Desks: Nut on the desk cannot reach the switch (switch should be false)', u.w.switches[0].on); }
{ let best = 0, up = false, n = 0; for (const [bx, bz, nx, nz] of [[82.4, -2, 82.4, -0.9], [82.4, -7.2, 82.4, -6.1], [84.3, -7.3, 83.2, -7.3], [84.3, -0.7, 83.2, -0.7]]) { const u = new Bot(level); const r = dbl(u, bx, bz, nx, nz, { mx: 1 }); if (r.again) n++; best = Math.max(best, +r.pk); up = up || u.b.pos.y > 7; }
  console.log('Standing Desks: Nut launches Bolt and relaunches him on the way down, four spots (relaunched', n + ', on top should be false)', up, 'peak feet', best.toFixed(2)); }
{ const u = new Bot(level); put(u.b, 84.3, 0.56, -5); put(u.n, 83.3, 0.46, -2.8); u.idle(2); u.tick({}, { power: true }); u.run(2, () => ({ mx: 1 })); console.log('Standing Desks: launch from the desk while it is down (zaps should be 1)', u.w.stats.zaps[0]); }
for (const [nm, x, z] of [['Standing Desks: Nut stands on Bolt on the floor and keeps pushing', 82.4, -5], ['Standing Desks: Nut tries to stand on Bolt on the lowered desk (curtain) and keeps pushing', 84.3, -5]]) { const u = new Bot(level); u.idle(1); const r = stack(u, x, z, { mx: 1 }); console.log(nm + ' (on head', r.on + ', on top should be false)', u.b.pos.y > 7 || u.n.pos.y > 7, 'zaps', JSON.stringify(u.w.stats.zaps), 'peak feet', r.pk); }
{ let zap = 0, up = false; for (const [x, z] of [[82, -5], [84.3, -5], [84.3, -1.5]]) { const u = new Bot(level); put(u.b, 87.6, 8.16, -2); put(u.n, x, 0.46, z); u.idle(1); u.tick({ mx: -0.3 }, {}); u.run(2.5, () => ({ power: true })); u.idle(1); zap += u.w.stats.zaps[1]; up = up || u.n.pos.y > 7; } console.log('Standing Desks: Bolt reels Nut up into Head Office from three spots (zaps should be 3, up should be false)', zap, up); }
console.log('stats', JSON.stringify(t.w.stats));
console.log('cog', t.w.cogs[0].got);
console.log(t.st(), 'complete', t.w.complete, t.log);
