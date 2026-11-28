import { Bot } from './bot.mjs';
import level from '../src/lv/ot39.js';
const t = new Bot(level), w = t.w, Y = 5;
const M = w.movers[0], LZ = w.lasers[0], G = w.gates[0], BR = w.bridges[0], A = w.anchors[0];
const ch = c => !!w.channels[c];
// 1. Lift: board while it rests at the bottom, ride up on green, step off past the laser
t.both(7, -3, 7, -5);
t.waitFor(u => !ch(4) && M.off.y < 0.05, 8);
t.both(9.6, -3.2, 10.4, -4.8, 2);
t.waitFor(u => ch(4), 8); t.waitFor(u => M.off.y > Y - 0.05, 4);
console.log('top', t.st(), 'laser', LZ.on);
t.both(14.5, -3, 14.5, -5, 2);
console.log('lift done', t.st(), 'zaps', JSON.stringify(w.stats.zaps), 'falls', JSON.stringify(w.stats.falls));
// 2. Airlock: in while the gate is open, out when the bridge comes
t.both(21.5, -3, 21.5, -5);
t.waitFor(u => G.open > 0.95, 8);
t.both(23.85, -3, 23.85, -5.5, 2);
console.log('in the airlock', t.st(), 'gate', G.open.toFixed(2), 'bridge', BR.on);
t.both(23.85, -3, 23.85, -5.5, 2);
t.waitFor(u => BR.on, 8);
t.both(31, -3, 31, -5, 3);
console.log('across', t.st(), 'falls', JSON.stringify(w.stats.falls));
t.go(1, 33, -2.5, 3); t.go(0, 31.5, -6.8, 3, 0.15); t.go(1, 31.5, -5.6, 3, 0.15); t.idle(0.2); t.tick({}, { power: true }); t.run(0.6, () => ({ mz: -0.5 })); t.idle(1);
console.log('cog', w.cogs[0].got, t.st());
// 3. Ring on the orange clock
t.go(0, 34.6, -4); t.go(1, 33, -5);
t.waitFor(u => !ch(2), 6); t.waitFor(u => ch(2), 6);
let hung = false; for (let i = 0; i < 90 && !hung; i++) { t.tick({ mx: 0.3, power: true }, {}); hung = !!t.b.hang; }
console.log('ring', hung, t.st(), 'A.x', A.x.toFixed(2));
t.waitFor(u => A.x > 40.2, 4, { power: true });
t.tick({ mx: 1, jump: true }, {}); t.run(0.9, () => ({ mx: 1, jump: true })); t.idle(0.4);
console.log('far floor', t.st());
t.go(0, 41.8, -4); t.go(1, 34.6, -4); t.pullNut(43, -4);
console.log('reeled', t.st());
t.both(44, -3, 44, -5, 4); t.idle(1);
// shortcut checks
const put = (p, x, y, z) => { p.pos = { x, y, z }; p.prev = { ...p.pos }; p.vel = { x: 0, y: 0, z: 0 }; };
{ const u = new Bot(level); put(u.b, 7.4, 0.56, -4); put(u.n, 6.3, 0.46, -4); u.idle(0.2); u.tick({}, { power: true }); u.run(1.5, () => ({ mx: 1 }));
  console.log('Lift: launch onto the upper floor without the lift (made it should be false)', u.b.pos.y > Y && u.w.stats.zaps[0] === 0 && u.b.pos.x > 12.5); }
{ const u = new Bot(level); put(u.b, 24, Y + 0.56, -4); u.w.t = 3; u.run(1.5, () => ({ mx: 1, jump: true }));  // bridge away (clock resting)
  console.log('Airlock: jump the gap without the bridge (fell should be true)', u.w.stats.falls[0] > 0 || u.b.pos.y < Y - 1); }
{ const u = new Bot(level); put(u.b, 34.6, Y + 0.56, -4); put(u.n, 33.5, Y + 0.46, -4); u.idle(0.2); u.tick({}, { power: true }); u.run(2, () => ({ mx: 1 }));
  console.log('Ring: launch over the last gap (across should be false)', u.b.pos.x > 41 && u.b.pos.y > Y); }
console.log(t.st(), 'complete', w.complete, t.log);
