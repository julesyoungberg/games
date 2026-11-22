import { Bot } from '/home/claude/games/bolt-and-nut/test/bot.mjs';
import def from '../src/lv/ot36.js';
const W = 20, Y = 4.6, G = 31, PX = 27, PZ = -6.3;
const t = new Bot(def);
const crate = t.w.crates[0], gate = t.w.gates[0];
const up = p => p.pos.y > Y - 0.2;
// 1. Bolt pulls the crate out of the lasered pen and sets it against the wall
t.go(1, 15, -1.5, 8); t.go(0, 7, -3.8, 8); t.grab(0, -1, 1.6); console.log('crate held', crate.pulledBy === t.b, t.pos(crate));
t.carry(crate, W - 0.7, -4, 1, 0); console.log('crate at the wall', t.pos(crate));
const hop = () => { t.go(0, crate.pos.x - 2.4, -4, 6, 0.15); t.idle(0.2); for (let i = 0; i < 50; i++) t.tick({ mx: t.b.pos.x < crate.pos.x ? 1 : 0, jump: i < 25 }, {}); t.idle(0.3); console.log('Bolt on crate', t.st()); };
// 2. back on the crate; Nut launches Bolt onto the ledge, Bolt reels her up
hop();
t.go(1, crate.pos.x - 1.1, -4, 6, 0.2); t.idle(0.2); t.tick({}, { power: true }); t.run(1.4, () => ({ mx: 1 })); t.idle(0.5); console.log('launched', t.st());
t.go(0, W + 0.5, -4, 4, 0.15); t.pullNut(W + 3, -4); console.log('both up', t.st(), t.log);
// 3. Bolt reels the crate up and sets it on the plate
t.go(1, 24, -2, 6);
t.go(0, W + 0.4, -4, 4, 0.15); t.grab(-1, 0, 1.6); console.log('crate held', crate.pulledBy === t.b, t.pos(crate));
t.carry(crate, PX, PZ, 0, -1); t.idle(1); console.log('crate on plate', t.pos(crate), 'gate', gate.open.toFixed(2));
t.both(35, -3, 35, -5); t.both(40, -3, 40, -5); t.idle(1.5);
console.log(t.st(), 'complete', t.w.complete, 'falls', JSON.stringify(t.w.stats.falls), 'zaps', JSON.stringify(t.w.stats.zaps), JSON.stringify(t.log));

const put = (u, p, x, y, z) => { p.pos = { x, y, z }; p.prev = { ...p.pos }; };
const through = p => p.pos.x > G + 1 && p.pos.y > Y - 0.5;
// golden cog: Bolt on the crate by the wall, Nut launches him up toward it
{ const u = new Bot(def); put(u, u.w.crates[0], W - 0.7, 0.6, -4); u.idle(0.3); put(u, u.b, W - 0.7, 1.8, -4); put(u, u.n, W - 1.8, 0.5, -5); u.idle(0.5); u.tick({}, { power: true }); u.run(1.4, () => u.steer(u.b, 18.2, -7)); u.idle(0.6); console.log('cog by a launch from the crate', u.w.cogs[0].got, u.st()); }
// ---- shortcut checks
// a launch from the floor at the wall does not reach the ledge
{ let k = 0; for (const bx of [W - 0.4, W - 1]) { const u = new Bot(def); put(u, u.b, bx, 0.6, -4); put(u, u.n, bx - 1.1, 0.5, -4); u.idle(0.3); u.tick({}, { power: true }); u.run(1.6, () => ({ mx: 1 })); u.idle(1); if (up(u.b)) k++; } console.log('floor launch onto the ledge (should be 0)', k); }
// a boost from the crate (Nut on the crate, Bolt on her head) does not reach it either
{ const u = new Bot(def); put(u, crate, W - 0.7, 0.6, -4); put(u, u.n, W - 0.7, 1.75, -4); u.idle(0.5); put(u, u.b, W - 0.7, 2.9, -4); u.idle(0.4); for (let i = 0; i < 100; i++) u.tick({ mx: 1, jump: i < 30 }, {}); u.idle(1); console.log('boost from Nut on the crate (should be false)', up(u.b), u.st()); }
// Nut holds the plate: Bolt goes through, and she is shut out when she steps off
{ const u = new Bot(def); put(u, u.b, 26, Y + 0.6, -3); put(u, u.n, PX, Y + 0.5, PZ); u.idle(1.5); u.go(0, 35, -3, 8); console.log('Bolt through', through(u.b)); u.go(1, 35, -5, 8); u.idle(1); console.log('Nut walks through after holding the plate (should be false)', through(u.n)); }
{ const u = new Bot(def); put(u, u.b, 26, Y + 0.6, -3); put(u, u.n, PX, Y + 0.5, PZ); u.idle(1.5); u.go(0, G + 2, -5.5, 8); u.idle(0.2); u.pullNut(G + 5, -5); u.idle(1); console.log('Bolt reels Nut off the plate through the gate (should be false)', through(u.n)); }
// a launch over the shut gate fails
{ const u = new Bot(def); put(u, u.b, G - 0.5, Y + 0.6, -4); put(u, u.n, G - 1.6, Y + 0.5, -4); u.idle(0.5); u.tick({}, { power: true }); u.run(1.6, () => ({ mx: 1 })); u.idle(1); console.log('launch over the shut gate (should be false)', through(u.b)); }
// cog misses with a floor launch
{ const u = new Bot(def); put(u, u.b, 18.2, 0.6, -7); put(u, u.n, 18.2, 0.5, -5.9); u.idle(0.4); u.tick({}, { power: true }); u.run(1.4, () => u.steer(u.b, 18.2, -7)); u.idle(0.5); console.log('cog by a floor launch (should be false)', u.w.cogs[0].got); }
