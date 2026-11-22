import { Bot } from '/home/claude/games/bolt-and-nut/test/bot.mjs';
import def from '../src/lv/ot27.js';
const S = 2.0, K = 1.9, H = 3.8;
const t = new Bot(def);
// hop onto Nut's head where she stands, then jump toward (dirx, dirz)
const hopOn = u => { for (let i = 0; i < 70; i++) { const s = u.steer(u.b, u.n.pos.x, u.n.pos.z); u.tick({ ...s, jump: i < 18 }, {}); } return u.b.ground === u.n; };
const jumpTo = (u, x, z) => { for (let i = 0; i < 80; i++) u.tick({ ...u.steer(u.b, x, z), jump: i < 30 }, {}); u.idle(0.3); };
const jumpOff = (u, dx, dz) => { for (let i = 0; i < 70; i++) u.tick({ mx: dx, mz: dz, jump: i < 30 }, {}); u.idle(0.3); };
// 1. Job Share: Nut by the shelf, Bolt boosts onto the plate, Nut walks through to the far plate, Bolt follows
t.go(1, 11.5, -4.2, 8); t.go(0, 11.5, -2.4, 8, 0.15); t.idle(0.2);
console.log('on nut', hopOn(t)); jumpOff(t, 0, -1); t.go(0, 11.5, -6.7, 2, 0.15);
console.log('shelf plate', t.w.plates[0].pressed, t.st(), t.log); t.idle(1);
t.go(1, 16.5, -4, 6); t.go(1, 20.5, -6.3, 6, 0.15); t.idle(0.3); console.log('far plate', t.w.plates[1].pressed, t.st());
t.go(0, 11.5, -5.0, 2, 0.15); t.go(0, 11.5, -3, 3, 0.2); t.go(0, 19, -3, 8); t.go(1, 19, -5, 3); console.log('P1', t.st(), t.log);
// 2. Filing Stack: Bolt boosts onto the low storey, reels Nut up, boosts off her onto the high storey plate
t.go(1, 27, -6, 8); t.go(0, 25.6, -6, 8, 0.15); t.idle(0.2);
console.log('on nut', hopOn(t)); jumpOff(t, 1, 0); console.log('low storey', t.st());
t.go(0, 28.6, -6.2, 3, 0.15); t.go(1, 25.5, -6.2, 3); t.tick({ mx: -0.3 }, {}); t.pullNut(29.0, -6.2); console.log('nut up', t.n.pos.y > K, t.st(), t.log);
if (t.b.ground === t.n) jumpOff(t, -1, 0); t.go(1, 30.2, -6.2, 3, 0.15); t.go(0, 28.7, -6.2, 3, 0.15); t.idle(0.2); console.log('on nut', hopOn(t)); jumpTo(t, 32.5, -6.3); t.idle(0.4);
console.log('high storey plate', t.w.plates[2].pressed, t.st(), t.log);
// golden cog: Bolt reels Nut up to the high storey, then boosts off her head straight up
t.go(0, 33.2, -6.3, 2, 0.15); t.tick({ mx: -0.3 }, {}); t.pullNut(32.3, -6.3, 2); console.log('nut on top', t.st());
t.go(1, 32.5, -6.6, 3, 0.15); t.go(0, 33.6, -6.6, 2, 0.15); t.idle(0.2); console.log('on nut', hopOn(t)); t.idle(0.2);
for (let i = 0; i < 80; i++) t.tick({ ...t.steer(t.b, 32.5, -6.3), jump: i < 30 }, {}); t.idle(0.5); console.log('cog', t.w.cogs[0].got, t.st());
// down and out (the latched door stays open)
t.go(1, 33.5, -3.5, 3); t.go(0, 33.5, -3.5, 3); t.both(39, -3, 39, -5); t.both(43, -3, 43, -5); t.idle(1.5);
console.log('stats', JSON.stringify(t.w.stats));
console.log(t.st(), 'complete', t.w.complete, 'cog', t.w.cogs[0].got, 'falls', JSON.stringify(t.w.stats.falls), 'zaps', JSON.stringify(t.w.stats.zaps), JSON.stringify(t.log));

const put = (u, p, x, y, z) => { p.pos = { x, y, z }; p.prev = { ...p.pos }; };
const jumpAt = (u, who, x, z, dx, dz) => { u.go(who, x - dx * 2.5, z - dz * 2.5, 6, 0.15); const inp = i => ({ mx: dx, mz: dz, jump: i > 10 && i < 40 }); for (let i = 0; i < 100; i++) u.tick(who === 0 ? inp(i) : {}, who === 1 ? inp(i) : {}); u.idle(0.4); };
// ---- shortcut checks
{ const u = new Bot(def); jumpAt(u, 0, 11.5, -5.4, 0, -1); console.log('bolt jumps onto the shelf alone (should be false)', u.b.pos.y > S, u.pos(u.b)); }
{ const u = new Bot(def); put(u, u.b, 2, 0.6, -2); u.idle(0.2); jumpAt(u, 1, 11.5, -5.4, 0, -1); console.log('nut jumps onto the shelf alone (should be false)', u.n.pos.y > S, u.pos(u.n)); }
{ const u = new Bot(def); put(u, u.b, 18.5, 0.6, -4); put(u, u.n, 19.5, 0.5, -4); u.idle(0.2); jumpAt(u, 0, 28, -6, 1, 0); console.log('bolt jumps onto the low storey alone (should be false)', u.b.pos.y > K, u.pos(u.b)); u.go(0, 20, -2, 4); jumpAt(u, 1, 28, -6, 1, 0); console.log('nut jumps onto the low storey alone (should be false)', u.n.pos.y > K, u.pos(u.n)); }
{ const u = new Bot(def); put(u, u.b, 28.6, K + 0.6, -6.2); put(u, u.n, 20, 0.5, -4); u.idle(0.3); jumpAt(u, 0, 31, -6.2, 1, 0); console.log('bolt jumps from the low storey to the high one (should be false)', u.b.pos.y > H, u.pos(u.b)); }
{ const u = new Bot(def); put(u, u.n, 26.5, 0.5, -6.2); put(u, u.b, 26.5, 1.5, -6.2); u.idle(0.4); const on = u.b.ground === u.n; for (let i = 0; i < 90; i++) u.tick({ mx: 1, jump: i < 30 }, {}); u.idle(0.5); console.log('boost from the floor to the high storey (should be false)', on, u.b.pos.y > H, u.pos(u.b)); }
{ const u = new Bot(def); put(u, u.b, 15.5, 0.6, -4); put(u, u.n, 14.3, 0.5, -4); u.idle(0.3); u.tick({}, { power: true }); u.run(1.6, () => ({ mx: 1 })); u.idle(0.5); console.log('launch over the first door (should be false)', u.b.pos.x > 17, u.pos(u.b)); }
{ const u = new Bot(def); put(u, u.b, 11.5, S + 0.6, -6.7); put(u, u.n, 11.5, 0.5, -4); u.idle(0.4); u.tick({}, { power: true }); u.run(1.6, () => ({ mx: 1 })); u.idle(0.5); console.log('launch off the shelf over the door (should be false)', u.b.pos.x > 17, u.pos(u.b)); }
{ const u = new Bot(def); put(u, u.b, 32.5, H + 0.6, -6.3); put(u, u.n, 32.5, H + 0.5, -5.0); u.idle(0.4); u.tick({}, { power: true }); u.run(1.6, () => ({ mz: -1 })); u.idle(0.5); console.log('launch off the high storey onto the back wall (should be false)', u.b.pos.z < -8, u.pos(u.b)); }
{ const u = new Bot(def); put(u, u.b, 32.5, H + 0.6, -6.3); u.idle(0.3); for (let i = 0; i < 90; i++) u.tick({ ...u.steer(u.b, 32.5, -6.3), jump: i < 30 }, {}); u.idle(0.4); console.log('cog by a plain jump off the high storey (should be false)', u.w.cogs[0].got); }
{ const u = new Bot(def); put(u, u.n, 26.5, 0.5, -6.3); put(u, u.b, 26.5, 1.5, -6.3); u.idle(0.4); for (let i = 0; i < 90; i++) u.tick({ mx: 1, jump: i < 30 }, {}); u.idle(0.4); console.log('door after boost to the low storey only (should be false)', u.w.gates[1].open > 0); }
