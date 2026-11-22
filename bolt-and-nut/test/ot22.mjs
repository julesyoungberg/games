import { Bot } from './bot.mjs';
import def from '../src/lv/ot22.js';
const Y = 2, M = 5.2;
const t = new Bot(def);
// golden cog comes after the main puzzle. Carry Over: both step onto the belt, Nut just behind Bolt, and walk back against it
t.both(13.6, -1.5, 12.4, -1.5);
let lx = 0; for (let i = 0; i < 300; i++) { if (t.b.pos.x > 21) break; t.tick(t.b.pos.x < 15 ? { mx: 1 } : { mx: -1 }, t.n.pos.x < t.b.pos.x - 1.1 ? { mx: 1 } : { mx: -1 }); }
lx = t.b.pos.x; console.log('on the belt', t.st(), 'gap', (t.b.pos.x - t.n.pos.x).toFixed(2));
t.tick({ mx: -1 }, { mx: -1, power: true }); let top = 0;
for (let i = 0; i < 90; i++) { t.tick({ mx: 1 }, t.n.pos.z > -3.9 ? { mz: -1, mx: -0.3 } : {}); top = Math.max(top, t.b.pos.y - 0.55); }
t.idle(0.4); console.log('launched from', lx.toFixed(2), 'top', top.toFixed(2), t.st(), t.log);
// Bolt reels Nut over the pit
t.go(0, 32, -3, 6, 0.15); t.go(1, 23.6, -4.0, 6, 0.15); t.tick({ mx: -0.3 }, {}); t.pullNut(35, -2.5); console.log('nut over', t.st(), t.log);
t.both(34, -2, 36, -2); console.log('P1', t.st(), t.log);
// golden cog: Nut launches Bolt straight up at it
t.both(42, -2, 43, -2); t.go(0, 42, -6.2, 6, 0.1); t.go(1, 42, -5.0, 6, 0.1); t.idle(0.2); t.tick({}, { power: true }); t.run(1.4, () => t.steer(t.b, 42, -6.2)); t.idle(0.5); console.log('cog', t.w.cogs[0].got, t.st());
// 2. Carry Back: both step onto the dock belt at the wall end, Bolt nearer the pit, and walk up it until Bolt is near the pit end
t.both(40.6, -6.2, 42.2, -6.2);
for (let i = 0; i < 600 && t.b.pos.x > 34.0; i++) t.tick(t.b.pos.x > 39.4 && t.b.pos.x < 40.6 ? { mx: -1 } : { mx: t.b.pos.x > 39.4 ? -1 : 1 }, t.n.pos.x > t.b.pos.x + 1.15 ? { mx: -1 } : { mx: 1 });
const lx2 = t.b.pos.x; console.log('up the belt', t.st(), 'gap', (t.n.pos.x - t.b.pos.x).toFixed(2));
t.tick({ mx: 1 }, { mx: 1, power: true }); top = 0;
for (let i = 0; i < 80; i++) { t.tick({ mx: -1 }, t.n.pos.z < -3.6 ? { mz: 1, mx: 1 } : {}); top = Math.max(top, t.b.pos.y - 0.55); }
t.idle(0.4); console.log('launched back from', lx2.toFixed(2), 'top', top.toFixed(2), t.st(), t.log);
// Bolt reels Nut up onto the mezzanine
t.go(0, 23.4, -6.2, 6, 0.15); t.go(1, 32.4, -3, 6, 0.15); t.tick({ mx: 0.3 }, {}); t.run(1.6, () => ({ power: true })); console.log('pulling', t.b.target && t.b.target.kind, t.st()); t.goHold(20, -6.2); t.run(0.4, () => ({ power: true })); t.idle(0.6); console.log('nut up', t.st(), t.log);
t.both(17.5, -5.5, 19, -7); t.idle(1.5);
console.log('stats', JSON.stringify(t.w.stats));
console.log(t.st(), 'complete', t.w.complete, 'cog', t.w.cogs[0].got, 'falls', JSON.stringify(t.w.stats.falls), 'zaps', JSON.stringify(t.w.stats.zaps), JSON.stringify(t.log));

const put = (u, p, x, y, z) => { p.pos = { x, y, z }; p.prev = { ...p.pos }; };
const over = u => u.b.pos.x > 31 && u.b.pos.y > Y;
const mezz = u => u.b.pos.y > M || u.n.pos.y > M;
const flight = (u, sec = 2) => { for (let i = 0; i < sec * 60; i++) u.tick({ mx: 1 }, {}); u.idle(0.5); };
// ---- shortcut checks
{ const u = new Bot(def); put(u, u.b, 24.35, 0.6, -4); put(u, u.n, 23.2, 0.5, -4); u.idle(0.3); u.tick({}, { power: true }); flight(u); console.log('launch from the floor edge (should be false)', over(u), u.pos(u.b), u.log); }
{ const u = new Bot(def); put(u, u.n, 24.0, 0.5, -4); put(u, u.b, 24.3, 1.5, -4); u.idle(0.3); u.tick({}, { power: true }); flight(u); console.log('launch off Nut\'s head at the edge (should be false)', over(u), u.pos(u.b), u.log); }
{ const u = new Bot(def); put(u, u.b, 15, 0.6, -1.5); for (let i = 0; i < 150; i++) u.tick({ mx: 1, jump: u.b.pos.x > 23.2 }, {}); u.idle(1); console.log('bolt runs down the belt and jumps (should be false)', over(u), u.pos(u.b), u.log); }
{ const u = new Bot(def); put(u, u.n, 15, 0.5, -1.5); for (let i = 0; i < 150; i++) u.tick({}, { mx: 1, jump: u.n.pos.x > 23.2 }); u.idle(1); console.log('nut runs down the belt and jumps (should be false)', u.n.pos.x > 31 && u.n.pos.y > Y, u.pos(u.n), u.log); }
{ // boost on the belt: Bolt on Nut's head while she runs down the belt, he jumps off at the end
  const u = new Bot(def); put(u, u.n, 15, 0.5, -1.5); put(u, u.b, 15, 1.5, -1.5); u.idle(0.2); const on = u.b.ground === u.n;
  for (let i = 0; i < 150; i++) u.tick({ mx: 1, jump: u.n.pos.x > 22.8 }, { mx: 1 }); u.idle(1); console.log('boost off Nut on the belt (should be false)', on, over(u), u.pos(u.b), u.log); }
{ // launch off Nut's head on the belt: Bolt is riding Nut, not the belt, so he keeps no belt speed
  const u = new Bot(def); put(u, u.n, 21, 0.5, -1.5); put(u, u.b, 21.3, 1.5, -1.5); u.idle(0.1, {}, { mx: -1 }); const on = u.b.ground === u.n; u.tick({}, { power: true, mx: -1 }); for (let i = 0; i < 120; i++) u.tick({ mx: 1 }, { mx: -1 }); u.idle(0.5); console.log('launch off Nut\'s head on the belt (should be false)', on, over(u), u.pos(u.b), u.log); }
{ const u = new Bot(def); put(u, u.b, 10, 0.6, -7.4); put(u, u.n, 10, 0.5, -6.2); u.idle(0.3); u.tick({}, { power: true }); u.run(1.6, () => ({ mz: -1 })); u.idle(0.5); console.log('launch at the back wall (should be false)', u.b.pos.y > 1, u.pos(u.b)); }
// ---- shortcut checks, puzzle 2 (the mezzanine)
{ const u = new Bot(def); put(u, u.b, 12.5, 0.6, -6); put(u, u.n, 11.4, 0.5, -6); u.idle(0.3); u.tick({}, { power: true }); u.run(1.6, () => ({ mx: 1 })); u.idle(0.5); console.log('launch at the mezzanine from below (should be false)', mezz(u), u.pos(u.b)); }
{ const u = new Bot(def); put(u, u.n, 13.3, 0.5, -6); put(u, u.b, 13.5, 1.5, -6); u.idle(0.3); u.tick({}, { power: true }); u.run(1.6, () => ({ mx: 1 })); u.idle(0.5); console.log('launch off Nut\'s head at the mezzanine from below (should be false)', mezz(u), u.pos(u.b)); }
{ const u = new Bot(def); put(u, u.b, 15, 0.6, -1.5); put(u, u.n, 13.9, 0.5, -1.5); u.idle(0.1, { mx: -1 }, { mx: -1 }); u.tick({ mx: -1 }, { power: true, mx: 1 }); u.run(1.6, () => ({ mz: -1 })); u.idle(0.5); console.log('belt launch at the mezzanine from below (should be false)', mezz(u), u.pos(u.b)); }
{ const u = new Bot(def); put(u, u.b, 31.8, Y + 0.6, -3); put(u, u.n, 32.9, Y + 0.5, -3); u.idle(0.3); u.tick({}, { power: true }); u.run(1.6, () => ({ mx: -1, mz: -1 })); u.idle(0.5); console.log('launch from the dock floor at the mezzanine (should be false)', mezz(u), u.pos(u.b)); }
{ const u = new Bot(def); put(u, u.n, 32.0, Y + 0.5, -3); put(u, u.b, 31.8, Y + 1.5, -3); u.idle(0.3); u.tick({}, { power: true }); u.run(1.6, () => ({ mx: -1, mz: -1 })); u.idle(0.5); console.log('launch off Nut\'s head from the dock at the mezzanine (should be false)', mezz(u), u.pos(u.b)); }
{ const u = new Bot(def); put(u, u.b, 36, Y + 0.6, -6.2); for (let i = 0; i < 150; i++) u.tick({ mx: -1, jump: u.b.pos.x < 32.3 }, {}); u.idle(1); console.log('bolt runs down the dock belt and jumps (should be false)', mezz(u), u.pos(u.b), u.log); }
{ const u = new Bot(def); put(u, u.n, 33.6, Y + 0.5, -6.2); put(u, u.b, 33.6, Y + 1.5, -6.2); u.idle(0.1, {}, { mx: 1 }); u.tick({}, { power: true, mx: 1 }); u.run(1.6, () => ({ mx: -1 }), () => ({ mx: 1 })); u.idle(0.5); console.log('launch off Nut\'s head on the dock belt (should be false)', mezz(u), u.pos(u.b), u.log); }
// golden cog: a boost misses
{ const u = new Bot(def); put(u, u.n, 40.5, Y + 0.5, -6.6); put(u, u.b, 40.5, Y + 1.5, -6.6); u.idle(0.3); u.run(1.2, () => ({ jump: true })); console.log('cog by boost (should be false)', u.w.cogs[0].got); }
