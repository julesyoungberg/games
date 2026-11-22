import { Bot } from './bot.mjs';
import level from '../src/lv/s24.js';
const t = new Bot(level); const A = t.w.anchors; const c = t.w.crates; const G = t.w.gates;
const hanging = (a) => t.b.target && t.b.target.obj === a && t.b.hang;
const cling = (a, fx, fz = 0, sec = 3) => { t.tick({ mx: fx * 0.3, mz: fz * 0.3 }, {}); for (let i = 0; i < sec * 60 && !hanging(a); i++) t.tick({ power: true }, {}); return hanging(a); };
const hop = (fx, fz = 0, sec = 1.2) => { t.tick({ power: true, mx: fx, mz: fz }, {}); t.tick({ power: true, mx: fx, mz: fz, jump: true }, {}); t.run(sec, () => ({ mx: fx, mz: fz, jump: true })); t.idle(0.3); };
// 1. Spill Kit
t.go(1, 4, -1.5); t.idle(0.5); console.log('pen', t.w.channels[1]);
t.go(0, 3, -6.5); t.idle(0.5);
for (let i = 0; i < 300 && c[0].pos.x < 10.5; i++) t.tick({ mx: 1 }, {});
t.idle(3); console.log('crate', t.pos(c[0]), 'ch2', t.w.channels[2], t.st(), t.log);
t.go(0, 12.5, -2.5, 6, 0.4); t.go(1, 15, -2); t.both(19.5, -3, 19.5, -5.5); console.log('P1', t.st(), t.log);
// 2. Air Con
t.go(1, 22.5, -6.3); t.idle(0.3); console.log('fan', t.w.fans[0].on);
t.go(0, 28, -6.3); t.idle(1.6); console.log('floating', t.st());
t.run(0.8, () => ({ mx: 1 })); t.go(0, 33, -2); t.idle(0.3); console.log('up', t.st(), 'ch4', t.w.channels[4], t.w.lasers[2].on);
t.go(1, 24, -2); t.go(1, 33, -3.5, 3); t.idle(0.6); console.log('sprung', t.st(), t.log.slice(-2));
t.both(37, -3, 37, -5.5); console.log('P2', t.st(), t.log);
// 3. Last Train
{ const R = A[0], M = A[1];
  t.go(1, 40, -1.6); t.go(0, 43.4, -6.5);
  t.waitFor(t => R.dir > 0 && R.wait > 0, 12);
  console.log('ring', cling(R, 1), t.st());
  for (let i = 0; i < 600 && R.x < 52.9; i++) t.tick({ power: true }, {});
  console.log('magnet', cling(M, 1), t.st());
  hop(1, 0, 0.6); t.go(0, 59, -1.2); console.log('top', t.st(), 'bridge', t.w.bridges[0].on);
  t.go(1, 55.4, -1.6); t.idle(0.3); console.log('nut at end', t.st());
  t.tick({ mx: -0.3 }, {}); t.run(2.0, () => ({ power: true })); t.idle(0.6); console.log('nut up', t.st(), t.log.slice(-2));
  t.both(62, -3, 62, -5.5); console.log('P3', t.st(), t.log); }
// golden cog: Nut launches Bolt onto the lost property shelf
t.go(0, 67, -5.6); t.go(1, 67, -4.5, 8, 0.15); t.idle(0.2);
t.tick({}, { power: true }); t.run(1.0, () => ({ mz: -1 })); t.idle(0.3); t.go(0, 67, -7.3, 2, 0.2);
console.log('cog', t.w.cogs[0].got, t.st());
t.go(0, 65.5, -7.3); t.run(0.5, () => ({ mx: -1 })); t.idle(0.4); console.log('down', t.st());
// 4. Last Bus
t.go(0, 71.55, -4, 8, 0.1); t.go(1, 70.45, -4, 8, 0.1); t.idle(0.2); t.tick({}, { power: true }); t.run(1.2, () => ({ mx: 1 })); t.idle(0.3); console.log('over belt', t.st());
t.go(0, 79, -4); t.go(1, 71, -4); t.tick({ mx: -0.3 }, {}); t.pullNut(82, -4, 3); console.log('pulled', t.st());
t.both(84, -3, 84, -5.5); console.log('P4', t.st(), t.log);
// 5. Lock Up
t.go(1, 84, -2); t.go(0, 82, -5.5); t.grab(0, -1, 1.5); console.log('grab', !!c[1].pulledBy, t.pos(c[1]));
t.carry(c[1], 88.5, -3, 1, 0); console.log('placed', t.pos(c[1]), t.st());
t.go(0, 86.6, -3); t.run(0.3, () => ({ mx: 0.6, jump: true })); t.go(0, c[1].pos.x, c[1].pos.z, 2, 0.1); t.idle(0.3); console.log('on crate', t.b.ground === c[1], t.st());
t.go(1, 85.5, -3.2); t.go(1, c[1].pos.x - 1.2, c[1].pos.z, 4, 0.1); t.idle(0.2); t.tick({}, { power: true }); t.run(1.2, () => ({ mx: 1 })); t.idle(0.3); console.log('launched', t.st(), t.log.slice(-1));
t.go(0, 94.5, -1.8); t.idle(0.3); console.log('tube cage', t.w.lasers[t.w.lasers.length - 1].on);
{ let went = false; for (let i = 0; i < 360 && !went; i++) { const ox = t.n.pos.x; t.tick({}, t.steer(t.n, 87, -6.5)); went = Math.abs(t.n.pos.x - ox) > 1.5; } t.idle(1.2); console.log('tube', went, t.st()); }
t.both(96.5, -3, 96.5, -4.6); console.log('P5', t.st(), t.log.slice(-2));
// the front door
t.both(98, -1.7, 98, -6.3); t.idle(0.8); console.log('door', G[2].latched, G[2].open.toFixed(2));
t.both(104, -2.5, 104, -5); t.idle(1.5);
// shortcut checks
const put = (u, p, x, y, z) => { p.pos = { x, y, z }; p.prev = { ...p.pos }; };
const peak = (u, sec, inp) => { let top = -99; u.run(sec, () => { top = Math.max(top, u.b.pos.y - 0.55); return inp; }); return top; };
{ const u = new Bot(level); put(u, u.b, 67, 11.4, -5.6); put(u, u.n, 67, 11.3, -4.5); u.idle(0.3); u.run(1, () => ({ mz: -1, jump: true })); console.log('cog by jump (should be false)', u.w.cogs[0].got); }
{ const u = new Bot(level); put(u, u.n, 67, 11.3, -6); put(u, u.b, 67, 12.4, -6); u.idle(0.5); const on = u.b.ground === u.n; u.run(1, () => ({ mz: -1, jump: true })); console.log('cog by boost (should be false)', on, u.w.cogs[0].got); }
{ const u = new Bot(level); put(u, u.b, 26, 0.6, -6); put(u, u.n, 24.9, 0.5, -6); u.idle(0.3); u.tick({}, { power: true }); const p = peak(u, 1.5, { mx: 1 }); console.log('P2 launch: peak (should be < 6)', p.toFixed(2), 'ends at y', (u.b.pos.y - 0.55).toFixed(2)); }
{ const u = new Bot(level); put(u, u.b, 33, 6.6, -4); put(u, u.n, 27.5, 0.5, -6); u.idle(0.3); u.tick({ mx: -0.3 }, {}); u.run(3, () => ({ power: true })); console.log('P2 reel Nut up the wall: zaps (should be 1)', u.w.stats.zaps[1], 'Nut y', u.n.pos.y.toFixed(2)); }
{ const u = new Bot(level); put(u, u.b, 43.5, 6.6, -6.5); u.idle(0.3); u.tick({ mx: 0.3 }, {}); let got = false; u.run(1, () => { got = got || !!(u.b.target && u.b.target.obj === u.w.anchors[1]); return { power: true }; }); console.log('P3 magnet from the near side (should be false)', got); }
{ const u = new Bot(level); put(u, u.b, 59, 11.4, -2); put(u, u.n, 43, 6.5, -2); u.idle(0.3); u.tick({ mx: -0.3 }, {}); let got = false; u.run(1, () => { got = got || !!(u.b.target && u.b.target.obj === u.n); return { power: true }; }); console.log('P3 reel Nut over the pit (should be false)', got); }
{ const u = new Bot(level); put(u, u.b, 89, 11.4, -3); put(u, u.n, 87.8, 11.3, -3); u.idle(0.3); u.tick({}, { power: true }); const p = peak(u, 1.5, { mx: 1 }); console.log('P5 launch from floor: peak (should be < 15.6)', p.toFixed(2)); }
{ const u = new Bot(level); put(u, u.b, 96, 16.2, -3); put(u, u.n, 88, 11.3, -3); u.idle(0.3); u.tick({ mx: -0.3 }, {}); u.run(3, () => ({ power: true })); console.log('P5 reel Nut up the wall: zaps (should be 1)', u.w.stats.zaps[1], 'Nut y', u.n.pos.y.toFixed(2)); }
console.log('stats', JSON.stringify(t.w.stats));
console.log('cog', t.w.cogs[0].got);
console.log(t.st(), 'complete', t.w.complete, t.log);
