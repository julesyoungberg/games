import { Bot } from './bot.mjs';
import def from '../src/lv/ot9.js';
const t = new Bot(def); const C = t.w.crates;
// stand 2 m behind the crate, then a gentle running jump onto it (bumping it on oil would send it sliding away)
const hop = (who, c, u = t) => { const p = u.w.players[who]; u.go(who, c.pos.x - 2, c.pos.z, 8, 0.1); u.idle(0.3);
  for (let i = 0; i < 70; i++) { const inp = { mx: p.pos.x < c.pos.x - 0.1 ? 0.7 : 0, jump: i < 20 }; u.tick(who === 0 ? inp : {}, who === 1 ? inp : {}); } u.idle(0.4); return p.ground === c; };
// 1. Limbo: Nut rides the iron crate, Bolt shoves it along the oil through the laser slot
console.log('nut on crate', hop(1, C[0]), t.st());
t.go(0, 5, -5);
for (let i = 0; i < 120 && t.b.pos.x < 10.5; i++) t.tick({ mx: 1 }, {});
t.idle(4); console.log('slid', t.pos(C[0]), t.st(), t.log);
t.go(1, 21.2, -6.5, 4); t.tick({}, { power: true }); t.idle(1); console.log('switch', t.w.channels[1], t.w.lasers[0].on);
t.both(25, -2.5, 25, -5); console.log('P1', t.st(), t.log);
// 2. Return Ticket: Bolt rides the crate, Nut shoves; Bolt pulls Nut over the pit
t.go(1, 27, -4); console.log('bolt on crate', hop(0, C[1]), t.st());
t.go(1, 27, -6.4);
for (let i = 0; i < 120 && t.n.pos.x < 31; i++) t.tick({}, { mx: 1 });
t.idle(4); console.log('slid2', t.pos(C[1]), t.st(), t.log);
t.go(0, 43.5, -6.4, 3); t.go(0, 41.3, -2); t.go(1, 30.2, -6); t.go(1, 30.3, -2); t.go(1, 30.6, -2);
t.tick({ mx: -0.3 }, {}); t.pullNut(43, -2); console.log('P2', t.st(), t.log);
t.both(48.5, -3, 48.5, -5); t.idle(1.5);
console.log('stats', JSON.stringify(t.w.stats));
console.log(t.st(), 'complete', t.w.complete, t.log);
const put = (u, p, x, y, z) => { p.pos = { x, y, z }; p.prev = { ...p.pos }; };
// checks: Bolt is too tall for slot 1; jumping or launching over slot 1 fails; Nut riding alone through slot 2 is fine but Bolt cannot follow
{ const u = new Bot(def); put(u, u.n, 5, 0.5, -2); put(u, u.b, 9.3, 0.6, -5); u.idle(0.2);
  const on = hop(0, u.w.crates[0], u);
  put(u, u.n, 5, 0.5, -5); u.idle(0.2); for (let i = 0; i < 120 && u.n.pos.x < 10.5; i++) u.tick({}, { mx: 1 }); u.idle(4); console.log('bolt rides slot 1 (should zap)', on, u.log); }
{ let best = false; for (let k = 0; k < 5; k++) { const u = new Bot(def); put(u, u.b, 13.5 - k * 0.5, 0.6, -4); put(u, u.n, 12.5 - k * 0.5, 0.5, -4); u.idle(0.6); u.tick({}, { power: true }); u.run(1.5, () => ({ mx: 1 })); u.idle(1); if (u.b.pos.x > 19.5 && !u.w.stats.zaps[0]) best = true; } console.log('launch over slot 1 (should be false)', best); }
// golden cog: Nut launches Bolt straight up from the oil
{ const u = new Bot(def); u.go(1, 11.2, -0.9); u.go(0, 11.2, -2.2, 8, 0.1); u.idle(0.8); u.tick({}, { power: true }); u.run(1.5, () => u.steer(u.b, 11.2, -2.2)); console.log('cog', u.w.cogs[0].got, u.log); }
{ const u = new Bot(def); put(u, u.b, 10.8, 1.8, -5); u.idle(0.5); u.run(0.6, () => ({ jump: true, ...u.steer(u.b, 11.2, -2.2) })); u.idle(1); console.log('cog by jump off crate (should be false)', u.w.cogs[0].got); }
// slot 2 bypass: Nut launching Bolt over the 10 m pit falls short
{ const u = new Bot(def); put(u, u.b, 30.6, 0.6, -2); put(u, u.n, 29.4, 0.5, -2); u.idle(0.5); u.tick({}, { power: true }); u.run(2, () => ({ mx: 1 })); console.log('launch over pit 2 (should be false)', u.b.pos.x > 41 && u.b.pos.y > 0, u.log); }
