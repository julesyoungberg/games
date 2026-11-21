import { Bot } from './bot.mjs';
import level from '../src/lv/s20.js';
const t = new Bot(level); const A = t.w.anchors; const c = t.w.crates;
const hanging = (a) => t.b.target && t.b.target.obj === a && t.b.hang;
const cling = (a, fx, fz = 0, sec = 3) => {
  t.tick({ mx: fx * 0.3, mz: fz * 0.3 }, {});
  for (let i = 0; i < sec * 60 && !hanging(a); i++) t.tick({ power: true }, {});
  return hanging(a);
};
const hop = (fx, fz = 0, sec = 1.2) => { t.tick({ power: true, mx: fx, mz: fz }, {}); t.tick({ power: true, mx: fx, mz: fz, jump: true }, {}); t.run(sec, () => ({ mx: fx, mz: fz, jump: true })); t.idle(0.3); };
// golden cog: Bolt hops onto Nut's head on the iron podium, Nut rockets, both go up
t.go(1, 1.5, -6.5); t.go(0, 3.0, -6.5, 8, 0.15); t.idle(0.2);
for (let i = 0; i < 70; i++) { const s = t.steer(t.b, t.n.pos.x, t.n.pos.z); t.tick({ ...s, jump: i < 18 }, {}); }
console.log('on Nut', t.b.ground === t.n, t.st());
t.tick({}, { power: true }); t.idle(2); t.go(0, 4, -2.5); console.log('cog', t.w.cogs[0].got, t.st(), t.log);
// 1. Q1 Air Handling
t.go(1, 6, -1.5); t.idle(0.3); console.log('fan on', t.w.channels[1], t.w.fans[0].on);
t.go(0, 12, -4.5); t.idle(1.5); console.log('floating', t.st());
t.run(1.2, () => ({ mx: 1 })); t.go(0, 16, -4.5); console.log('up1', t.st());
t.go(1, 11.5, -4.5); t.idle(0.5); t.tick({ mx: -0.3 }, {}); t.pullNut(18, -4.5); console.log('P1', t.st(), t.log);
// 2. Q2 Synergy
const climb = (x) => { t.go(0, x - 0.6, -2.2); t.go(1, x - 1.7, -4); t.go(0, x - 0.6, -4); t.idle(0.3); t.tick({}, { power: true }); t.run(1.0, () => ({ mx: 1 }), () => ({ mx: 1 })); t.idle(0.5); console.log('step', t.st()); };
climb(27); climb(32); climb(37);
t.both(40, -3, 40, -5.5); console.log('P2', t.st(), t.log);
// 3. Q3 Cross-Department
{ const R = A[0], M = t.w.movers[0];
  t.go(1, 42, -2); t.go(0, 45.5, -4.5);
  t.waitFor(t => R.dir > 0 && R.wait > 0, 12);
  console.log('ring', cling(R, 1), t.st());
  t.go(1, 48, -2, 4, 0.2, { power: true });
  for (let i = 0; i < 600 && R.x < 56.4; i++) t.tick({ power: true }, {});
  hop(1, 0, 1.0); console.log('hopped', t.st(), t.log.slice(-1));
  t.go(0, 60, -6.3); console.log('plate', t.w.channels[2]);
  t.waitFor(t => M.s >= M.total - 0.01, 10); t.go(1, 62, -2); console.log('lift', t.st());
  t.both(64, -3, 64, -5); console.log('P3', t.st(), t.log); }
// 4. Q4 Delegation
t.go(1, 61, -1.5); t.go(0, 63, -3.5); t.grab(0, -1, 1.5); console.log('grab', !!c[0].pulledBy, t.pos(c[0]));
t.carry(c[0], 68.4, -6.4, 1, 0); console.log('placed', t.pos(c[0]), t.st());
t.go(0, 63.5, -1.5);
{ const dx = 72 - c[0].pos.x, dz = -6.5 - c[0].pos.z, d = Math.hypot(dx, dz); console.log('range', d.toFixed(2));
  t.go(1, c[0].pos.x - dx / d * 1.25, -4.5); t.go(1, c[0].pos.x - dx / d * 1.25, c[0].pos.z - dz / d * 1.25, 4, 0.08); t.idle(0.2); }
t.tick({}, { power: true }); t.idle(2); console.log('fired', t.pos(c[0]), 'ch3', t.w.channels[3], t.w.lasers[1].on);
t.both(73, -2.6, 72.5, -1.2); t.go(0, 77.5, -4, 3); t.idle(0.5); console.log('sprung B', t.st(), t.log.slice(-1));
t.go(1, 77.5, -3, 3); t.idle(0.5); console.log('sprung N', t.st(), t.log.slice(-1));
t.both(79, -3, 79, -5.5); console.log('P4', t.st(), t.log);
// 5. Q5 Promotion
{ const R = A[1], M = A[2], las = t.w.lasers[2];
  t.both(82.2, -3, 82.2, -5.5); t.waitFor(t => !las.on && (t.w.t % 2.8) > 1.25 && (t.w.t % 2.8) < 1.4, 6);
  t.both(85, -2.5, 84.6, -3.5, 2); console.log('past laser', t.st(), t.log.slice(-1));
  t.go(0, 87.5, -4); t.waitFor(t => R.dir > 0 && R.wait > 0, 12);
  console.log('ring', cling(R, 1), t.st());
  for (let i = 0; i < 600 && R.x < 96.9; i++) t.tick({ power: true }, {});
  console.log('magnet', cling(M, 1), t.st());
  hop(1, 0, 0.8); t.go(0, 102.5, -1.8); console.log('top', t.st(), t.w.channels[4], t.w.lasers[3].on);
  let went = false; for (let i = 0; i < 360 && !went; i++) { const ox = t.n.pos.x; t.tick({}, t.steer(t.n, 86.5, -6.5)); went = Math.abs(t.n.pos.x - ox) > 1.5; }
  t.idle(1.2); console.log('tube', went, t.st());
  t.both(108.5, -3, 108.5, -5); t.idle(1.5); }
// cog checks: a plain launch or a rocket alone from the podium falls short
const put = (u, p, x, y, z) => { p.pos = { x, y, z }; p.prev = { ...p.pos }; };
{ const u = new Bot(level); put(u, u.n, 1.2, 0.5, -6.5); put(u, u.b, 2.2, 0.6, -6.5); u.idle(0.3); u.tick({}, { power: true }); u.run(1.5, () => ({ mx: -0.3 })); console.log('cog by plain launch (should be false)', u.w.cogs[0].got); }
{ const u = new Bot(level); put(u, u.n, 1.5, 0.5, -6.5); put(u, u.b, 6, 0.6, -3); u.idle(0.3); u.tick({}, { power: true }); u.idle(1.5); console.log('cog by rocket alone (should be false)', u.w.cogs[0].got); }
// puzzle checks
{ const u = new Bot(level); put(u, u.b, 13, 0.6, -1); put(u, u.n, 12, 0.5, -1); u.idle(0.3); u.tick({}, { power: true }); let top = 0; u.run(1.5, () => { top = Math.max(top, u.b.pos.y - 0.55); return { mx: 1 }; }); console.log('Q1 by launch: peak (should be < 6)', top.toFixed(2), 'ends at', (u.b.pos.y - 0.55).toFixed(2)); }
{ const u = new Bot(level); put(u, u.b, 73.4, 19.2, -1); put(u, u.n, 72.3, 19.1, -1); u.idle(0.3); u.tick({}, { power: true }); let top = 0; u.run(1.5, () => { top = Math.max(top, u.b.pos.y - 0.55); return { mx: 1 }; }); console.log('Q4 by launch: peak (should be < 25.1)', top.toFixed(2), 'ends at', (u.b.pos.y - 0.55).toFixed(2)); }
{ const u = new Bot(level); const k = u.w.crates[0]; put(u, k, 73, 19.2, -1); put(u, u.b, 73, 20.4, -1); put(u, u.n, 71.8, 19.1, -1); u.idle(0.4);
  u.tick({}, { power: true }); let top = 0; u.run(1.5, () => { top = Math.max(top, u.b.pos.y - 0.55); return { mx: 1 }; }); console.log('Q4 bypass, Bolt launched off the crate: peak (should be < 25.1)', top.toFixed(2)); }
{ const u = new Bot(level); const k = u.w.crates[0]; put(u, k, 73, 19.2, -1); put(u, u.n, 73, 20.3, -1); put(u, u.b, 73, 21.3, -1); u.idle(0.4); const stack = u.b.ground === u.n && u.n.ground === k;
  u.tick({}, { power: true }); let top = 0; u.run(1.5, () => { top = Math.max(top, u.b.pos.y - 0.55); return { mx: 1 }; }); console.log('Q4 bypass, crate + Nut + Bolt stack', stack, 'peak (should be < 25.1)', top.toFixed(2)); }
{ const u = new Bot(level); const R = u.w.anchors[1]; put(u, u.b, 87.5, 25.7, -4); put(u, u.n, 80, 25.6, -4); u.idle(0.3);
  u.waitFor(u => R.dir > 0 && R.wait > 0, 12); u.tick({ mx: 0.3 }, {}); for (let i = 0; i < 200 && !u.b.hang; i++) u.tick({ power: true }, {}); const h = u.b.hang;
  for (let i = 0; i < 600 && R.x < 96.9; i++) u.tick({ power: true }, {});
  u.tick({ power: true, mx: 1, jump: true }, {}); u.run(1.5, () => ({ mx: 1, jump: true })); console.log('Q5 hop from ring end: hung', h, 'lands on top floor (should be false)', u.b.pos.y > 29.9); }
console.log('stats', JSON.stringify(t.w.stats));
console.log(t.st(), 'complete', t.w.complete, t.log);
