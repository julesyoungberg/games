import { Bot } from './bot.mjs';
import def from '../src/lv/ot13.js';
const t = new Bot(def); const [SKY, LOW] = t.w.anchors;
const hanging = (u, a) => u.b.target && u.b.target.obj === a && u.b.hang;
const curtainOff = (u, l, sec) => { const [on, off, ph] = l.timer; const per = on + off; const k = (u.w.t + (ph || 0)) % per; return k >= on && per - k > sec; };
// 1. Peak Service: wait for the sky ring at this end, Nut launches Bolt into it
t.go(0, 7.6, -4, 8, 0.15); t.go(1, 6.4, -4, 8, 0.15);
t.waitFor(u => SKY.dir === 1 && SKY.x > 8.6, 14);
t.tick({ power: true }, { power: true });
for (let i = 0; i < 90 && !hanging(t, SKY); i++) t.tick({ power: true }, {});
t.run(0.3, () => ({ power: true }));
console.log('sky ring', hanging(t, SKY), t.st(), t.log);
t.waitFor(u => SKY.x > 19.2, 10, { power: true });
t.idle(2); console.log('dropped', t.st(), t.log);
// reel Nut across when the curtain has just blinked off
t.go(0, 19.4, -4, 4, 0.15); t.go(1, 8.6, -4, 4, 0.15);
t.tick({ mx: -0.3 }, {});
t.waitFor(u => curtainOff(u, u.w.lasers[0], 1.3), 6);
t.run(1.4, () => ({ power: true })); t.goHold(21, -4); t.run(0.3, () => ({ power: true })); t.idle(0.5);
console.log('nut across', t.st(), t.log);
t.both(22, -3, 22, -5.5); console.log('P1', t.st(), t.log);
// 2. Express Transfer: Bolt rides the low ring to the island and reels Nut over
t.go(1, 24, -6); t.go(0, 25.8, -4, 4, 0.15);
t.waitFor(u => LOW.dir === 1 && LOW.x > 26.5 && LOW.x < 27, 14);
t.tick({ mx: 0.3 }, {}); for (let i = 0; i < 120 && !hanging(t, LOW); i++) t.tick({ power: true }, {});
console.log('low ring', hanging(t, LOW), t.st());
t.waitFor(u => LOW.x > 33.4, 6, { power: true }); t.idle(1); console.log('island', t.st(), t.log);
t.go(0, 33.2, -4, 3, 0.15); t.go(1, 26.6, -4, 4, 0.15); t.pullNut(34.3, -4); console.log('nut on island', t.st(), t.log);
// Nut waits at the right end; Bolt catches the ring as it comes back, rides it out again, and Nut launches him off it
t.go(0, 33, -4, 3, 0.15); t.go(1, 35.1, -4, 3, 0.15);
t.waitFor(u => LOW.dir === -1 && LOW.x < 35, 14); t.tick({ mx: -0.3 }, {});
for (let i = 0; i < 120 && !hanging(t, LOW); i++) t.tick({ power: true }, {});
console.log('ring again', hanging(t, LOW), t.st());
t.waitFor(u => LOW.dir === 1 && u.b.pos.x > u.n.pos.x + 0.8, 14, { power: true });
t.tick({ power: true }, { power: true }); t.run(1.0, () => ({ mx: 1 })); t.idle(0.4);
console.log('on shelf', t.st(), t.log);
t.go(0, 42, -6.6, 6, 0.15); t.waitFor(u => u.n.pos.y > 6.2 && u.w.movers[0].s >= u.w.movers[0].total, 8); t.go(1, 40.5, -4, 4); console.log('P2', t.st(), t.log);
t.both(41, -3, 41, -5.5); t.both(48.5, -3, 48.5, -5); t.idle(1.5);
console.log('stats', JSON.stringify(t.w.stats));
console.log(t.st(), 'complete', t.w.complete, t.log);
const put = (u, p, x, y, z) => { p.pos = { x, y, z }; p.prev = { ...p.pos }; };
// checks
{ const u = new Bot(def); const S = u.w.anchors[0]; put(u, u.b, 7.6, 0.6, -4); put(u, u.n, 4, 0.5, -6); u.waitFor(v => S.dir === 1 && S.x > 8.6, 14);
  u.tick({ power: true }, {}); u.run(1.5, () => ({ power: true, jump: true })); console.log('jump to sky ring (should be false)', !!hanging(u, S)); }
{ const u = new Bot(def); const S = u.w.anchors[0]; put(u, u.n, 8, 0.5, -4); put(u, u.b, 6.5, 0.6, -4); u.idle(0.3); u.waitFor(v => S.dir === 1 && S.x > 7.2, 14); u.boostBolt(8, -4, 1, 0);
  let g = false; for (let i = 0; i < 60; i++) { u.tick({ power: true, jump: true }, {}); g = g || hanging(u, S); } console.log('boost off Nut to sky ring (should be false)', g, u.onNut); }
{ const u = new Bot(def); put(u, u.b, 8.4, 0.6, -4); put(u, u.n, 7.2, 0.5, -4); u.idle(0.4); u.tick({}, { power: true }); u.run(2.5, () => ({ mx: 1 })); console.log('launch over pit 1 (should fall)', u.log); }
{ const u = new Bot(def); put(u, u.b, 19.4, 0.6, -4); put(u, u.n, 8.6, 0.5, -4); u.idle(0.2); u.waitFor(v => !curtainOff(v, v.w.lasers[0], 0) && ((v.w.t % 2.7) < 0.1), 6); u.tick({ mx: -0.3 }, {}); u.run(1.4, () => ({ power: true })); u.goHold(21, -4); u.idle(0.5); console.log('pull Nut while the curtain is on (should zap)', u.log); }
{ const u = new Bot(def); put(u, u.n, 6, 0.5, -4); u.idle(0.2); u.run(2.5, () => ({}), () => ({ mx: 1, jump: u.n.pos.x > 8.5 })); console.log('nut jumps pit 1 (should fall)', u.log); }
{ const u = new Bot(def); const LOW = u.w.anchors[1]; put(u, u.b, 33, 0.6, -4); u.waitFor(v => LOW.dir === 1 && LOW.x > 31 && LOW.x < 32, 20); u.tick({ mx: -0.3 }, {}); u.run(0.6, () => ({ power: true }));
  u.waitFor(v => LOW.x > 37.9, 8, { power: true }); u.tick({ power: true, mx: 1 }, {}); u.tick({ power: true, mx: 1, jump: true }, {}); u.run(1.5, () => ({ mx: 1, jump: true })); console.log('hop from low ring to shelf (should be false)', u.b.pos.y > 5.5, u.log); }
{ const u = new Bot(def); put(u, u.b, 35.1, 0.6, -4); put(u, u.n, 33.9, 0.5, -4); u.idle(0.4); u.tick({}, { power: true }); u.run(2, () => ({ mx: 1 })); console.log('launch from island to shelf (should be false)', u.b.pos.y > 5.5, u.log); }
{ const u = new Bot(def); put(u, u.n, 34, 0.5, -4); put(u, u.b, 24, 0.6, -4); u.idle(4); console.log('island lifts with nobody on the plate (should be false)', u.n.pos.y > 1); }
// golden cog: Nut stands right under the ring as Bolt rides over her and launches him straight up
{ const u = new Bot(def); const LOW = u.w.anchors[1]; put(u, u.b, 33, 0.6, -4); put(u, u.n, 34.6, 0.5, -4); u.waitFor(v => LOW.dir === 1 && LOW.x > 31 && LOW.x < 32, 20); u.tick({ mx: -0.3 }, {}); u.run(0.6, () => ({ power: true }));
  u.waitFor(v => v.b.pos.x > v.n.pos.x - 0.1, 8, { power: true }); u.tick({ power: true }, { power: true }); u.run(1.5, () => ({})); console.log('cog', u.w.cogs[0].got, u.log); }
{ const u = new Bot(def); const LOW = u.w.anchors[1]; put(u, u.b, 33, 0.6, -4); u.waitFor(v => LOW.dir === 1 && LOW.x > 31 && LOW.x < 32, 20); u.tick({ mx: -0.3 }, {}); u.run(0.6, () => ({ power: true }));
  u.waitFor(v => LOW.x > 34.3, 8, { power: true }); u.tick({ power: true, jump: true }, {}); u.run(1.5, () => ({ jump: true })); console.log('cog by hopping off the ring (should be false)', u.w.cogs[0].got); }
