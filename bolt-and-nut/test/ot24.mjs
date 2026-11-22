import { Bot } from '/home/claude/games/bolt-and-nut/test/bot.mjs';
import def from '../src/lv/ot24.js';
const Y = 13;
const t = new Bot(def);
// grab the ring on the way up: hold X facing away from Nut (so the magnet picks the ring, not her) and steer under the ring
const ringGrab = (u, sec = 3) => { for (let i = 0; i < sec * 60; i++) { u.tick({ power: true, ...u.steer(u.b, 9, -4) }, {}); if (u.b.hang) return true; } return false; };
// 1. Glass Ceiling: Nut launches Bolt past the ring, he grabs it on the way up and hops onto the top floor
t.both(7.6, -4, 5.4, -4); t.tick({ mx: 0.1 }, {}); t.idle(0.2);
t.tick({ power: true }, { power: true });
console.log('ring', ringGrab(t), t.st());
t.run(0.3, () => ({ power: true, mx: 1 }));
for (let i = 0; i < 60; i++) t.tick({ power: i < 2, mx: 1, jump: i < 20 }, {}); t.idle(0.5); console.log('top floor', t.st(), t.log);
// 2. Lift Share: Bolt holds the plate, Nut rides the lift up
t.go(1, 19.5, -4, 8, 0.15); t.go(0, 13.5, -6.3, 6, 0.15); console.log('plate', t.w.plates[0].pressed);
t.waitFor(u => u.n.pos.y > Y + 0.3 && u.w.movers[0].s >= u.w.movers[0].total - 0.01, 10); t.idle(0.3); console.log('nut up', t.st());
t.go(1, 24, -5, 6); t.go(0, 17, -7, 4, 0.2); t.go(0, 24, -7, 4, 0.2); t.both(24, -3, 24, -5); console.log('P1', t.st(), t.log);
// golden cog: Nut launches Bolt straight up at it
t.both(28.9, -4, 27.6, -4); t.idle(0.2); t.tick({}, { power: true }); t.run(1.4, () => t.steer(t.b, 29, -4)); t.idle(0.5); console.log('cog', t.w.cogs[0].got, t.st());
t.both(36, -3, 36, -5); t.idle(1.5);
console.log('stats', JSON.stringify(t.w.stats));
console.log(t.st(), 'complete', t.w.complete, 'cog', t.w.cogs[0].got, 'falls', JSON.stringify(t.w.stats.falls), 'zaps', JSON.stringify(t.w.stats.zaps), JSON.stringify(t.log));

const put = (u, p, x, y, z) => { p.pos = { x, y, z }; p.prev = { ...p.pos }; };
const up = u => u.b.pos.y > Y || u.n.pos.y > Y;
// ---- shortcut checks
{ const u = new Bot(def); put(u, u.b, 9, 0.6, -4); u.idle(0.3); for (let i = 0; i < 60; i++) u.tick({ power: true, jump: i < 25 }, {}); u.idle(0.5); console.log('bolt jumps at the ring (should be false)', !!u.b.target, up(u), u.pos(u.b)); }
{ const u = new Bot(def); put(u, u.n, 9, 0.5, -4); put(u, u.b, 9, 1.6, -4); u.idle(0.5); const on = u.b.ground === u.n;
  let got = false; for (let i = 0; i < 70; i++) { u.tick({ power: true, jump: i < 25 }, {}); got = got || !!(u.b.target && u.b.target.kind === 'anchor'); } u.idle(0.5); console.log('boost off Nut at the ring (should be false)', on, got, up(u)); }
{ const u = new Bot(def); put(u, u.b, 7.6, 0.6, -4); put(u, u.n, 5.4, 0.5, -4); u.idle(0.3); u.tick({ mx: 0.1 }, {}); u.tick({}, { power: true }); u.run(1.6, () => ({ mx: 1 })); u.idle(0.5); console.log('launch without the magnet (should be false)', up(u), u.pos(u.b)); }
{ const u = new Bot(def); put(u, u.b, 10, 0.6, -7.4); put(u, u.n, 10, 0.5, -6.0); u.idle(0.3); u.tick({}, { power: true }); u.run(1.6, () => ({ mz: -1 })); u.idle(0.5); console.log('launch at the back wall (should be false)', u.b.pos.y > 1, u.pos(u.b)); }
{ const u = new Bot(def); put(u, u.b, 19.5, 0.6, -4); u.idle(3); console.log('bolt alone on the lift (should be false)', u.b.pos.y > 1, u.pos(u.b)); }
{ const u = new Bot(def); put(u, u.n, 19.5, 0.5, -4); put(u, u.b, 19.5, 1.6, -4); u.idle(3); console.log('both on the lift (should be false)', up(u)); }
// golden cog: a boost on the top floor misses
{ const u = new Bot(def); put(u, u.n, 29, Y + 0.5, -4); put(u, u.b, 29, Y + 1.6, -4); u.idle(0.5); const on = u.b.ground === u.n; u.run(1.2, () => ({ jump: true })); console.log('cog by boost (should be false)', on, u.w.cogs[0].got); }
