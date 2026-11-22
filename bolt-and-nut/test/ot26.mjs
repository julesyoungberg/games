import { Bot } from '/home/claude/games/bolt-and-nut/test/bot.mjs';
import def from '../src/lv/ot26.js';
const P = 3.6, Y = 9.8;
const t = new Bot(def); const ring = t.w.anchors[0];
const dist = u => Math.hypot(u.b.pos.x - u.n.pos.x, u.b.pos.y - u.n.pos.y, u.b.pos.z - u.n.pos.z);
// golden cog first: Bolt stands on Nut's head under it and she launches him straight up
t.go(1, 3, -7, 6, 0.1); t.go(0, 3, -5.4, 6, 0.1); t.idle(0.2);
for (let i = 0; i < 70; i++) { const s = t.steer(t.b, t.n.pos.x, t.n.pos.z); t.tick({ ...s, jump: i < 18 }, {}); } t.idle(0.3);
console.log('on nut', t.b.ground === t.n); t.tick({}, { power: true }); t.run(1.4, () => ({})); t.idle(0.4); console.log('cog', t.w.cogs[0].got, t.st());
// 1. Step Up: Nut launches Bolt onto the perch, he reels her up
t.both(10.2, -4, 9.0, -4); t.idle(0.2); t.tick({}, { power: true }); t.run(1.3, () => t.steer(t.b, 12.6, -4)); t.idle(0.4); console.log('perch', t.st(), t.log);
t.go(1, 9.6, -2.0, 3, 0.15); t.go(0, 11.8, -2.0, 3, 0.15); t.tick({ mx: -0.3 }, {}); t.pullNut(11.8, -4.2, 3); console.log('nut up', t.st(), t.log);
// 2. Exit Interview: Nut waits at the wall end of the perch, Bolt rides the ring up, she launches him off it at the top
// (Nut waits at the back of the perch while Bolt grabs the ring, so the magnet does not pick her instead)
t.go(1, 11.8, -5.6, 3, 0.15); t.go(0, 13.3, -3.0, 3, 0.15); t.idle(0.3);
t.waitFor(u => u.w.anchors[0].y < 3.3, 10); t.tick({ mx: 0.3 }, {}); t.run(0.1, () => ({ power: true }));
t.waitFor(u => u.b.hang, 3, { power: true }); console.log('hang', t.b.hang, t.st());
t.go(1, 13.4, -4.4, 3, 0.15, { power: true });
t.waitFor(u => u.w.anchors[0].y > 7.9, 10, { power: true }); console.log('top', t.st(), 'dist', dist(t).toFixed(2));
t.tick({ power: true }, { power: true }); let top = 0; for (let i = 0; i < 100; i++) { t.tick({ mx: 1 }, {}); top = Math.max(top, t.b.pos.y - 0.55); } t.idle(0.4); console.log('launched', top.toFixed(2), t.st(), t.log);
t.go(0, 16.6, -4.4, 6, 0.15); t.tick({ mx: -0.3 }, {}); t.pullNut(20, -4.4); console.log('nut up', t.st(), t.log);
t.both(20, -3, 20, -5); console.log('P2', t.st(), t.log);
t.both(36, -3, 36, -5); t.idle(1.5);
console.log('stats', JSON.stringify(t.w.stats));
console.log(t.st(), 'complete', t.w.complete, 'cog', t.w.cogs[0].got, 'falls', JSON.stringify(t.w.stats.falls), 'zaps', JSON.stringify(t.w.stats.zaps), JSON.stringify(t.log));

const put = (u, p, x, y, z) => { p.pos = { x, y, z }; p.prev = { ...p.pos }; };
const up = u => u.b.pos.y > Y || u.n.pos.y > Y;
const perch = u => u.b.pos.y > P || u.n.pos.y > P;
const fly = (u, sec = 1.6) => { u.run(sec, () => ({ mx: 1 })); u.idle(0.5); };
// ---- shortcut checks
{ const u = new Bot(def); put(u, u.n, 10.4, 0.5, -4); put(u, u.b, 10.4, 1.6, -4); u.idle(0.5); const on = u.b.ground === u.n; for (let i = 0; i < 70; i++) u.tick({ mx: 1, jump: i < 25 }, {}); u.idle(0.5); console.log('boost onto the perch (should be false)', on, perch(u)); }
{ // Bolt alone rides the ring to the top and hops off toward Head Office
  const u = new Bot(def); put(u, u.b, 13, P + 0.6, -4); u.idle(0.2); u.waitFor(v => v.w.anchors[0].y < 3.3, 10); u.tick({ mx: 0.3 }, {}); u.run(0.1, () => ({ power: true }));
  u.waitFor(v => v.w.anchors[0].y > 7.9, 10, { power: true }); for (let i = 0; i < 90; i++) u.tick({ mx: 1, power: i < 30, jump: i >= 30 && i < 55 }, {}); u.idle(0.5); console.log('bolt alone hops off the ring top (should be false)', up(u), u.pos(u.b)); }
{ const u = new Bot(def); put(u, u.b, 13.4, P + 0.6, -3); put(u, u.n, 12.2, P + 0.5, -3); u.idle(0.3); u.tick({}, { power: true }); fly(u); console.log('launch from the perch (should be false)', up(u), u.pos(u.b)); }
{ const u = new Bot(def); put(u, u.n, 13.3, P + 0.5, -4); put(u, u.b, 13.3, P + 1.6, -4); u.idle(0.5); const on = u.b.ground === u.n; u.tick({}, { power: true }); fly(u); console.log('launch off Nut\'s head on the perch (should be false)', on, up(u), u.pos(u.b)); }
{ const u = new Bot(def); put(u, u.n, 13.3, P + 0.5, -4); put(u, u.b, 13.3, P + 1.6, -4); u.idle(0.5); for (let i = 0; i < 70; i++) u.tick({ mx: 1, jump: i < 25 }, {}); u.idle(0.5); console.log('boost off Nut on the perch (should be false)', up(u)); }
{ // launch off the ring while it is still low: falls short
  const u = new Bot(def); put(u, u.b, 13.3, P + 0.6, -3); put(u, u.n, 11.8, P + 0.5, -5.6); u.idle(0.2); u.waitFor(v => v.w.anchors[0].y < 3.3, 10); u.tick({ mx: 0.3 }, {}); u.run(0.1, () => ({ power: true }));
  u.go(1, 13.4, -4.4, 3, 0.15, { power: true }); u.waitFor(v => v.w.anchors[0].y > 6.5, 10, { power: true }); console.log('  ring y', u.w.anchors[0].y.toFixed(2), 'hang', u.b.hang); u.tick({ power: true }, { power: true }); fly(u); console.log('launch off the ring halfway up (should be false)', up(u), u.pos(u.b)); }
{ const u = new Bot(def); put(u, u.b, 15, 0.6, -7.4); put(u, u.n, 15, 0.5, -6.0); u.idle(0.3); u.tick({}, { power: true }); u.run(1.6, () => ({ mz: -1 })); u.idle(0.5); console.log('launch at the back wall (should be false)', u.b.pos.y > 1, u.pos(u.b)); }
{ // Nut on the floor launches Bolt at the top of the ring: out of range
  const u = new Bot(def); put(u, u.b, 13, P + 0.6, -3); put(u, u.n, 14.3, 0.5, -1.0); u.idle(0.2); u.waitFor(v => v.w.anchors[0].y < 3.3, 10); u.tick({ mx: 0.3 }, {}); u.run(0.1, () => ({ power: true }));
  u.waitFor(v => v.w.anchors[0].y > 7.9, 10, { power: true }); u.tick({ power: true }, { power: true }); fly(u); console.log('launch from the floor at the ring top (should be false)', up(u), u.pos(u.b)); }
// golden cog: a plain launch misses
{ const u = new Bot(def); put(u, u.b, 3, 0.6, -7); put(u, u.n, 3, 0.5, -5.6); u.idle(0.3); u.tick({}, { power: true }); u.run(1.4, () => u.steer(u.b, 3, -7)); console.log('cog by plain launch (should be false)', u.w.cogs[0].got); }
