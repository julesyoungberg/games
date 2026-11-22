import { Bot } from '/home/claude/games/bolt-and-nut/test/bot.mjs';
import def from '../src/lv/ot32.js';
const H = 2.0, C0 = 13, W = 16, E = 23, CZ = -5.6;
const t = new Bot(def);
const crate = t.w.crates[0];
// 1. Bolt pulls the crate off the stock shelf and sets it down by the chute
t.go(1, 8, -1.5, 8); t.go(0, 4.5, -4.3, 8, 0.15); t.grab(0, -1, 1.2); console.log('grabbed', t.b.target && t.b.target.kind, t.pos(crate));
t.carry(crate, 12.5, -4.5, 0, -1); console.log('crate set down', t.pos(crate), t.st());
t.go(0, 8, -1.5, 8);
// 2. Nut throws it up onto the chute, along it; it skates through the slot onto the plate and the gate opens
t.go(1, 11.4, -3.8, 8, 0.15); t.idle(0.2); t.tick({}, { power: true }); t.idle(5);
console.log('crate', t.pos(crate), 'plate', !!t.w.channels[1], 'gate', t.w.gates[0].open.toFixed(2), t.log);
t.both(W + 3, -2, W + 3, -4); t.both(30, -2, 30, -4); console.log('P1', t.st(), t.log);
// golden cog: Nut launches Bolt straight up beside it
t.both(37, -6.8, 37, -5.7); t.idle(0.2); t.tick({}, { power: true }); t.run(1.4, () => t.steer(t.b, 37, -6.8)); t.idle(0.5); console.log('cog', t.w.cogs[0].got, t.st());
t.both(42, -3, 42, -5); t.idle(1.5);
console.log('stats', JSON.stringify(t.w.stats));
console.log(t.st(), 'complete', t.w.complete, 'cog', t.w.cogs[0].got, 'falls', JSON.stringify(t.w.stats.falls), 'zaps', JSON.stringify(t.w.stats.zaps), JSON.stringify(t.log));

const put = (u, p, x, y, z) => { p.pos = { x, y, z }; p.prev = { ...p.pos }; };
const through = u => u.b.pos.x > W + 1 || u.n.pos.x > W + 1;
// ---- shortcut checks
{ const u = new Bot(def); put(u, u.n, 4.5, 0.5, -5.8); u.idle(0.3); u.tick({}, { power: true }); u.idle(2); console.log('Nut throws the crate off the shelf (should be false)', u.w.crates[0].pos.y < 3); }
{ const u = new Bot(def); u.idle(1); console.log('gate shut with no crate on the plate (should be false)', u.w.gates[0].open > 0.5); }
// Bolt carries the crate along the chute, jumps and lets go (324 timings): he cannot lift it onto the chute
{ let hits = 0, on = 0; for (const x0 of [8, 10, 12]) for (const j of [5, 10, 15, 20, 25, 30]) for (const r of [8, 12, 16, 20, 24, 28]) for (const mz of [-0.3, -0.6, -1]) {
  const u = new Bot(def); const c = u.w.crates[0]; put(u, u.b, x0, 0.6, -4.2); put(u, c, x0, 0.6, -5.9); put(u, u.n, 3, 0.5, -1); u.idle(0.2);
  u.tick({ mz: -0.3 }, {}); u.run(0.6, () => ({ power: true }));
  for (let i = 0; i < 120; i++) u.tick(i < j + r ? { power: true, mx: 1, mz: i >= j ? mz : 0, jump: i >= j && i < j + 20 } : {}, {});
  u.idle(4); if (c.pos.y > H) on++; if (u.w.channels[1]) hits++; }
  console.log('Bolt lifts the crate onto the chute by jumping (should be 0 0)', on, hits); }
// Bolt boosts off Nut's head carrying the crate and drops it on the chute (co-op, but slow): it stops short of the plate
{ let hits = 0, on = 0; for (const x0 of [11, 12.5, 14]) for (const r of [10, 16, 22, 28, 34]) for (const mx of [0, 0.5, 1]) {
  const u = new Bot(def); const c = u.w.crates[0]; put(u, u.n, x0, 0.5, -4.4); put(u, u.b, x0, 1.5, -4.4); put(u, c, x0 + 1.7, 0.6, -4.4); u.idle(0.4);
  u.tick({ mx: 0.3 }, {}); u.run(0.5, () => ({ power: true })); u.run(0.3, () => ({ power: true, mz: -0.3 }));
  for (let i = 0; i < 90; i++) u.tick(i < r ? { power: true, mx, mz: -1, jump: i < 25 } : {}, {});
  u.idle(4); if (c.pos.y > H) on++; if (u.w.channels[1]) hits++; }
  console.log('boost-carry onto the chute: on chute', on, 'plate hits (should be 0)', hits); }
// a crate resting on the chute: Bolt reeling it along the chute pulls it off the edge instead
{ const u = new Bot(def); const c = u.w.crates[0]; put(u, c, 14, H + 0.6, -6.8); put(u, u.b, 12, 0.6, -4.8); put(u, u.n, 3, 0.5, -2); u.idle(0.3);
  u.tick({ mz: -0.3 }, {}); u.run(1, () => ({ power: true })); for (let i = 0; i < 120; i++) u.tick({ power: true, mx: 1, mz: -0.01 }, {}); u.idle(4); console.log('Bolt drags the crate down the chute (should be false)', !!u.w.channels[1], u.pos(c)); }
// robots on the chute or through the slot get lasered
{ const u = new Bot(def); put(u, u.b, 12, 0.6, -4.6); put(u, u.n, 11, 0.5, -3.6); u.idle(0.3); u.tick({}, { power: true }); u.run(1.6, () => ({ mx: 1, mz: -1 })); u.idle(1); console.log('Bolt launched onto the chute (should be zapped, not through)', u.w.stats.zaps[0] > 0, through(u)); }
// throw window: crate at 12.5,-4.5, Nut behind it by dx and toward the camera by dz
{ const r = []; let k = 0; for (const dx of [0.6, 0.8, 1.0, 1.2, 1.5]) for (const dz of [0.4, 0.6, 0.9, 1.2, 1.5]) { const u = new Bot(def); const c = u.w.crates[0]; put(u, c, 12.5, 0.6, -4.5); put(u, u.n, 12.5 - dx, 0.5, -4.5 + dz); put(u, u.b, 5, 0.6, -2); u.idle(0.3); u.tick({}, { power: true }); u.idle(5); k += !!u.w.channels[1]; r.push(dx + '/' + dz + ':' + (u.w.channels[1] ? 'Y' : 'n')); } console.log('throw window', k + '/25', r.join(' ')); }
// a throw that stops short on the chute: Bolt can reel the crate back out through the slot and try again
{ const u = new Bot(def); const c = u.w.crates[0]; put(u, c, 18.7, H + 0.6, -7.4); put(u, u.b, 14, 0.6, -3.6); put(u, u.n, 5, 0.5, -2); u.idle(0.3);
  u.tick({ mx: 0.5, mz: -0.5 }, {}); u.run(1.5, () => ({ power: true })); for (let i = 0; i < 60; i++) u.tick({ power: true, ...u.steer(u.b, 11, -2.5) }, {}); u.idle(1); console.log('retrieve a short throw', c.pos.x < W, u.pos(c)); }
// golden cog misses with less than a launch
{ const u = new Bot(def); put(u, u.n, 37, 0.5, -6.8); put(u, u.b, 37, 1.5, -6.8); u.idle(0.4); for (let i = 0; i < 90; i++) u.tick({ ...u.steer(u.b, 37, -6.8), jump: i < 30 }, {}); u.idle(0.5); console.log('cog by a boost (should be false)', u.w.cogs[0].got); }
