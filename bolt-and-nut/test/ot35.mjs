import { Bot } from '/home/claude/games/bolt-and-nut/test/bot.mjs';
import def from '../src/lv/ot35.js';
const A = 15, B = 22, PX = 19.5, PZ = -6.3;
const t = new Bot(def);
const crate = t.w.crates[0], gA = t.w.gates[0], gB = t.w.gates[1];
// golden cog: Nut launches Bolt straight up under it
t.both(4, -6.8, 4, -5.7); t.idle(0.2); t.tick({}, { power: true }); t.run(1.4, () => t.steer(t.b, 4, -6.8)); t.idle(0.6); console.log('cog', t.w.cogs[0].got, t.st());
// 1. Bolt pulls the crate off the shelf and carries it
t.go(1, 17.5, -1.5, 12); t.go(0, 7.2, -3.5, 8); t.grab(0, -1, 1.6); console.log('crate held', crate.pulledBy === t.b, t.pos(crate));
// 2. both walk into the airlock, Bolt carrying the crate
t.carry(crate, PX, PZ, 0, -1); console.log('crate on plate', t.pos(crate), 'plate', t.w.plates[0].pressed, 'A', gA.open.toFixed(2), 'B', gB.open.toFixed(2));
t.idle(1);
console.log('after drop A', gA.open.toFixed(2), 'B', gB.open.toFixed(2), t.st());
t.both(26, -3, 26, -5); console.log('out', t.st(), t.log);
t.both(32, -3, 32, -5); t.idle(1.5);
console.log(t.st(), 'complete', t.w.complete, 'cog', t.w.cogs[0].got, 'falls', JSON.stringify(t.w.stats.falls), 'zaps', JSON.stringify(t.w.stats.zaps), JSON.stringify(t.log));

const put = (u, p, x, y, z) => { p.pos = { x, y, z }; p.prev = { ...p.pos }; };
const outB = p => p.pos.x > B + 1;
// ---- shortcut checks
// Nut holds the plate: Bolt gets out, she is shut in when she steps off
{ const u = new Bot(def); u.both(11, -3, 11, -4.5); u.both(18, -3, PX, PZ); u.idle(1.2); u.go(0, 26, -3, 8); u.idle(0.2); console.log('Bolt walks out while Nut holds the plate', outB(u.b), 'A', u.w.gates[0].open.toFixed(2)); u.go(1, 26, -5, 8); u.idle(1); console.log('Nut walks out after holding the plate (should be false)', outB(u.n)); }
// ... nor can Bolt reel her off the plate and through the closing door
{ const u = new Bot(def); u.both(11, -3, 11, -4.5); u.both(18, -3, PX, PZ); u.idle(1.2); u.go(0, B + 2, -5.5, 8); u.idle(0.2); u.pullNut(B + 5, -5); u.idle(1); console.log('Bolt reels Nut off the plate through the door (should be false)', outB(u.n), u.st()); }
// Nobody reaches the shelf: a launch from beside it falls short
{ let k = 0; for (const [bx, bz] of [[7.2, -5.6], [5.6, -7], [9, -7]]) { const u = new Bot(def); put(u, u.b, bx, 0.6, bz); put(u, u.n, bx, 0.5, bz + 1.1); u.idle(0.3); u.tick({}, { power: true }); u.run(1.6, () => u.steer(u.b, 7.2, -7)); u.idle(1); if (u.b.pos.y > 4) k++; } console.log('launched onto the shelf (should be 0)', k); }
// A launch at a shut door does not clear it
{ const u = new Bot(def); put(u, u.b, B - 0.5, 0.6, -4); put(u, u.n, B - 1.6, 0.5, -4); u.idle(1.5); u.tick({}, { power: true }); u.run(1.6, () => ({ mx: 1 })); u.idle(1); console.log('launch over the shut far door (should be false)', outB(u.b)); }
// cog misses with a boost
{ const u = new Bot(def); put(u, u.n, 4, 0.5, -6.8); put(u, u.b, 4, 1.5, -6.8); u.idle(0.4); for (let i = 0; i < 90; i++) u.tick({ ...u.steer(u.b, 4, -6.8), jump: i < 30 }, {}); u.idle(0.5); console.log('cog by a boost (should be false)', u.w.cogs[0].got); }
