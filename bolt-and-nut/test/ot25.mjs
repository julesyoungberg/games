import { Bot } from '/home/claude/games/bolt-and-nut/test/bot.mjs';
import def from '../src/lv/ot25.js';
const S = 3.4, Y = 9;
const t = new Bot(def);
// 1. Office Space: Nut launches Bolt onto the shelf, he reels her up
t.both(11, -4.2, 9.8, -4.2); t.idle(0.2); t.tick({}, { power: true }); t.run(1.3, () => t.steer(t.b, 13.2, -5.5)); t.idle(0.4); console.log('shelf', t.st(), t.log);
t.go(0, 12.6, -6.5, 4, 0.15); t.tick({ mx: -0.3 }, {}); t.pullNut(14.0, -4.0, 3); console.log('nut up', t.st(), t.log);
// 2. Hot Air: Nut on the plate, Bolt rides the fan and steers onto the top floor
t.go(1, 13.2, -4.2, 4, 0.15); console.log('plate', t.w.plates[0].pressed);
t.go(0, 15.5, -6.5, 4, 0.2); let top = 0; for (let i = 0; i < 300 && t.b.pos.x < 18.5; i++) { top = Math.max(top, t.b.pos.y - 0.55); t.tick(t.b.pos.y > Y + 0.7 ? { mx: 1 } : t.steer(t.b, 15.5, -6.5), {}); } t.idle(0.5);
console.log('bolt up', top.toFixed(2), t.st(), t.log);
t.go(0, 18, -4.5, 3); t.tick({ mx: -0.3 }, {}); t.pullNut(21, -4.5); console.log('nut up', t.st(), t.log);
t.both(21, -3, 21, -5); console.log('P2', t.st(), t.log);
// golden cog: Nut launches Bolt straight up at it
t.both(27.9, -4, 26.6, -4); t.idle(0.2); t.tick({}, { power: true }); t.run(1.4, () => t.steer(t.b, 28, -4)); t.idle(0.5); console.log('cog', t.w.cogs[0].got, t.st());
t.both(36, -3, 36, -5); t.idle(1.5);
console.log('stats', JSON.stringify(t.w.stats));
console.log(t.st(), 'complete', t.w.complete, 'cog', t.w.cogs[0].got, 'falls', JSON.stringify(t.w.stats.falls), 'zaps', JSON.stringify(t.w.stats.zaps), JSON.stringify(t.log));

const put = (u, p, x, y, z) => { p.pos = { x, y, z }; p.prev = { ...p.pos }; };
const shelf = u => u.b.pos.y > S || u.n.pos.y > S;
const up = u => u.b.pos.y > Y || u.n.pos.y > Y;
// ---- shortcut checks
{ const u = new Bot(def); put(u, u.b, 11, 0.6, -4.2); u.idle(0.3); for (let i = 0; i < 70; i++) u.tick({ mx: 1, jump: i < 25 }, {}); u.idle(0.5); console.log('bolt jumps at the shelf (should be false)', shelf(u)); }
{ const u = new Bot(def); put(u, u.n, 11.2, 0.5, -4.2); put(u, u.b, 11.2, 1.6, -4.2); u.idle(0.5); const on = u.b.ground === u.n; for (let i = 0; i < 70; i++) u.tick({ mx: 1, jump: i < 25 }, {}); u.idle(0.5); console.log('boost onto the shelf (should be false)', on, shelf(u)); }
{ const u = new Bot(def); put(u, u.n, 11.2, 0.5, -4.2); put(u, u.b, 11.2, 1.6, -4.2); u.idle(0.5); for (let i = 0; i < 70; i++) u.tick({ mx: 1, jump: i < 25 }, { mx: 1, jump: i > 10 && i < 30 }); u.idle(0.5); console.log('nut jumps with Bolt on her head (should be false)', shelf(u)); }
{ const u = new Bot(def); put(u, u.b, 16.5, 0.6, -2); put(u, u.n, 15.3, 0.5, -2); u.idle(0.3); u.tick({}, { power: true }); u.run(1.6, () => ({ mx: 1 })); u.idle(0.5); console.log('launch at the top floor from the floor (should be false)', up(u), u.pos(u.b)); }
{ const u = new Bot(def); put(u, u.b, 13.6, S + 0.6, -6.5); put(u, u.n, 12.5, S + 0.5, -6.5); u.idle(0.3); u.tick({}, { power: true }); u.run(1.6, () => ({ mx: 1 })); u.idle(0.5); console.log('launch from the shelf, fan off (should be false)', up(u), u.pos(u.b)); }
{ const u = new Bot(def); put(u, u.n, 13.4, S + 0.5, -6.5); put(u, u.b, 13.4, S + 1.6, -6.5); u.idle(0.5); const on = u.b.ground === u.n; u.tick({}, { power: true }); u.run(1.6, () => ({ mx: 1 })); u.idle(0.5); console.log('launch off Nut\'s head on the shelf (should be false)', on, up(u), u.pos(u.b)); }
{ const u = new Bot(def); put(u, u.b, 15.5, S + 0.6, -6.5); u.idle(3); console.log('bolt alone on the dead fan (should be false)', up(u), u.pos(u.b)); }
{ const u = new Bot(def); put(u, u.b, 10, 0.6, -7.4); put(u, u.n, 10, 0.5, -6.0); u.idle(0.3); u.tick({}, { power: true }); u.run(1.6, () => ({ mz: -1 })); u.idle(0.5); console.log('launch at the back wall (should be false)', u.b.pos.y > 1, u.pos(u.b)); }
{ // wrong order: Bolt on the plate, Nut rides up; she drops back to the floor and nothing is stuck
  const u = new Bot(def); put(u, u.b, 13.2, S + 0.6, -4.2); put(u, u.n, 15.5, S + 0.5, -6.5); u.idle(0.3);
  for (let i = 0; i < 300 && u.n.pos.x < 18.5; i++) u.tick({}, u.n.pos.y > Y + 0.6 ? { mx: 1 } : u.steer(u.n, 15.5, -6.5)); u.idle(0.5); const nUp = u.n.pos.y > Y;
  u.go(1, 17.3, -2, 3); u.run(1.5, () => ({}), () => ({ mx: -1 })); u.idle(1); console.log('nut up first, then drops back down (should be true true)', nUp, u.n.pos.y < 1 && u.n.pos.x < 17, u.pos(u.n), u.log); }
// golden cog: a boost on the top floor misses
{ const u = new Bot(def); put(u, u.n, 28, Y + 0.5, -4); put(u, u.b, 28, Y + 1.6, -4); u.idle(0.5); const on = u.b.ground === u.n; u.run(1.2, () => ({ jump: true })); console.log('cog by boost (should be false)', on, u.w.cogs[0].got); }
