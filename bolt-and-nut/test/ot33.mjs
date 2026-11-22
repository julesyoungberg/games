import { Bot } from '/home/claude/games/bolt-and-nut/test/bot.mjs';
import def from '../src/lv/ot33.js';
const Y = 8, L0 = 16, L1 = 19.5, LH = 4.8;
const t = new Bot(def);
const lift = t.w.movers[0];
const top = () => lift.max.y.toFixed(2);
// 1. Nut calls the lift down, Bolt steps on, Nut steps off and the lift carries Bolt up
t.go(1, 11, -6.4, 8); t.idle(2.4); console.log('lift down', top(), !!t.w.channels[1]);
t.go(0, 17.2, -4, 8); t.idle(0.3);
t.go(1, 14, -4, 8); t.idle(2.5); console.log('lift up with Bolt', top(), t.st());
// 2. Bolt reels Nut up onto the lift
t.go(0, 16.8, -4, 4, 0.15); t.pullNut(18.4, -4); console.log('Nut on lift', t.st());
// golden cog: Nut launches Bolt straight up at the back of the lift; he lands back on it
t.both(17, -7, 17, -5.9); t.idle(0.2); t.tick({}, { power: true }); t.run(1.4, () => t.steer(t.b, 17, -7)); t.idle(0.6); console.log('cog', t.w.cogs[0].got, t.st());
// 3. Nut launches Bolt onto the ledge, Bolt reels her up
t.launchBolt(18.7, -4, 1, 0, 1.2); console.log('launched', t.st());
t.go(0, 20.4, -4, 4, 0.15); t.pullNut(23, -4); console.log('both up', t.st(), t.log);
t.both(31, -3, 31, -5); t.idle(1.5);
console.log(t.st(), 'complete', t.w.complete, 'cog', t.w.cogs[0].got, 'falls', JSON.stringify(t.w.stats.falls), 'zaps', JSON.stringify(t.w.stats.zaps), JSON.stringify(t.log));

const put = (u, p, x, y, z) => { p.pos = { x, y, z }; p.prev = { ...p.pos }; };
const upAt = u => u.b.pos.y > Y - 0.2 || u.n.pos.y > Y - 0.2;
// golden cog: both on the raised lift (put there), Nut launches Bolt straight up at the back
{ const u = new Bot(def); put(u, u.b, 17, LH + 0.6, -7); put(u, u.n, 17, LH + 0.5, -5.9); u.idle(0.4); u.tick({}, { power: true }); u.run(1.4, () => u.steer(u.b, 17, -7)); u.idle(0.5); console.log('cog by a launch from the lift', u.w.cogs[0].got); }
{ const u = new Bot(def); put(u, u.n, 17, LH + 0.5, -7); put(u, u.b, 17, LH + 1.5, -7); u.idle(0.4); for (let i = 0; i < 90; i++) u.tick({ ...u.steer(u.b, 17, -7), jump: i < 30 }, {}); u.idle(0.5); console.log('cog by a boost on the lift (should be false)', u.w.cogs[0].got); }
// ---- shortcut checks
// a launch from the ground cannot reach the raised lift
{ let k = 0; for (const bx of [14.6, 15.2, 15.6]) { const u = new Bot(def); put(u, u.b, bx, 0.6, -4); put(u, u.n, bx - 1.1, 0.5, -4); u.idle(0.3); u.tick({}, { power: true }); u.run(1.6, () => ({ mx: 1 })); u.idle(1); if (u.b.pos.y > LH) k++; } console.log('ground launch onto the raised lift (should be 0)', k); }
// a boost on the raised lift (Nut's head) cannot reach the ledge
{ let k = 0; for (const mx of [0.6, 1]) { const u = new Bot(def); put(u, u.n, 18.8, LH + 0.5, -4); put(u, u.b, 18.8, LH + 1.5, -4); u.idle(0.4); for (let i = 0; i < 100; i++) u.tick({ mx, jump: i < 30 }, {}); u.idle(1); if (upAt(u)) k++; } console.log('boost from the lift onto the ledge (should be 0)', k); }
// a launch while the lift is still rising: Nut steps off the plate, runs over and launches Bolt as soon as she can
{ let k = 0; for (const d of [0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.3]) { const u = new Bot(def); put(u, u.n, 11, 0.5, -6.4); put(u, u.b, 17, 0.6, -4); u.idle(2.4); put(u, u.n, 15.2, 0.5, -4); u.idle(d); u.tick({}, { power: true }); u.run(1.6, () => ({ mx: 1 })); u.idle(1); if (upAt(u)) k++; } console.log('launch from the rising lift onto the ledge (should be 0)', k); }
// nobody can just walk up: the lift alone with Bolt is stuck under the ledge
{ const u = new Bot(def); put(u, u.b, 17.5, LH + 0.6, -4); u.idle(0.3); for (let i = 0; i < 100; i++) u.tick({ mx: 1, jump: i < 30 }, {}); u.idle(1); console.log('Bolt jumps from the lift to the ledge (should be false)', upAt(u)); }
