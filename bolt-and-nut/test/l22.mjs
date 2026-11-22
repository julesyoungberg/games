import { Bot } from './bot.mjs';
import level from '../src/lv/s22.js';
const t = new Bot(level); const A = t.w.anchors; const Ls = t.w.lasers;
const Y = 5.5;
const phase = (l) => { const [on, off, ph] = l.timer; return (t.w.t + (ph || 0)) % (on + off); };
const justOff = (l, a = 0.02) => { const [on] = l.timer; const p = phase(l); return p >= on && p < on + a; };
const hanging = (a) => t.b.target && t.b.target.obj === a && t.b.hang;
const hop = (fx, fz = 0, sec = 1.2) => { t.tick({ power: true, mx: fx, mz: fz }, {}); t.tick({ power: true, mx: fx, mz: fz, jump: true }, {}); t.run(sec, () => ({ mx: fx, mz: fz, jump: true })); t.idle(0.3); };
// 1. Clock In
t.go(1, 8, -1.5); t.go(0, 11.8, -4.5); t.idle(0.3); console.log('fan', t.w.fans[0].on);
t.waitFor(t => justOff(Ls[0]), 5);
t.go(0, 14.5, -4.5, 2, 0.2); t.idle(0.9); console.log('floating', t.st(), t.log);
t.run(1.0, () => ({ mx: 1 })); t.go(0, 16.5, -4.5, 3, 0.1); console.log('up', t.st());
t.tick({ mx: -0.3 }, {}); t.waitFor(t => justOff(Ls[0]), 5);
t.pullNut(18, -4.5, 3); console.log('P1', t.st(), t.log);
// golden cog: up here Nut launches Bolt straight up
t.go(1, 21, -3.0); t.go(0, 21, -1.6, 4, 0.1); t.idle(0.2); t.tick({}, { power: true }); t.run(1.2, () => ({ mz: -0.3 })); t.idle(0.6); console.log('cog', t.w.cogs[0].got, t.st(), t.log.slice(-1));
// 2. Night Bus
{ const M = t.w.movers[0];
  t.go(1, 32, -4); t.go(1, 34.4, -4, 3, 0.1); t.go(0, 32, -6.5); t.idle(0.2); console.log('Nut on bus', t.n.ground === M);
  t.waitFor(t => { const p = (t.w.t + 0.28) % 2.4; return p > 0.1 && p < 0.14; }, 5);
  t.go(0, 30, -6.5, 2, 0.2); console.log('drive at', (t.w.t % 2.4).toFixed(2), t.w.channels[2]);
  t.waitFor(t => M.s >= M.total - 0.01, 8); t.go(1, 48.5, -4.5); console.log('Nut across', t.st(), t.log.slice(-1));
  t.go(1, 49, -4.8); t.tick({}, { power: true }); t.idle(0.5); console.log('bridge', t.w.channels[3], t.w.bridges[0].on);
  t.go(0, 32, -0.9); t.go(0, 36.2, -0.9); t.waitFor(t => justOff(Ls[1]), 4); t.go(0, 39.5, -0.9);
  t.waitFor(t => justOff(Ls[2]), 4); t.go(0, 44, -0.9); t.go(0, 48, -1); console.log('Bolt across', t.st(), t.log.slice(-1));
  t.both(52, -3, 52, -5.5); console.log('P2', t.st(), t.log); }
// 3. Sky Patrol
{ const R = A[0];
  t.go(0, 57.6, -4); t.go(1, 56.5, -4); t.idle(0.2);
  t.waitFor(t => R.dir > 0 && R.s < 0.01 && R.wait > 0.3, 20);
  t.tick({}, { power: true });
  let hung = false, pw = false;
  for (let i = 0; i < 120 && !hung; i++) { pw = pw || t.b.vel.y < 3; t.tick({ mx: 0.3, power: pw }, {}); hung = hanging(R); }
  console.log('ring', hung, t.st());
  t.waitFor(t => R.wait > 0 && R.dir < 0, 10, { power: true }); t.idle(1.5); console.log('dropped', t.st(), t.log.slice(-1));
  t.go(1, 57.6, -4); t.go(0, 67.6, -4); t.tick({ mx: -0.3 }, {}); t.pullNut(69, -3, 3); t.both(70, -3, 70, -5.5); console.log('P3', t.st(), t.log.slice(-2)); }
// 4. Lookout
{ const M = A[1], Lf = t.w.movers[1], B4 = Ls[3];
  t.go(0, 73.4, -5.5); t.go(1, 72.3, -5.5); t.idle(0.2);
  t.waitFor(t => justOff(B4), 5); t.tick({}, { power: true });
  let hung = false, pw = false;
  for (let i = 0; i < 150 && !hung; i++) { pw = pw || t.b.vel.y < 3; t.tick({ mx: 0.3, power: pw }, {}); hung = hanging(M); }
  console.log('magnet', hung, t.st(), t.log.slice(-1));
  hop(1, 0, 0.6); t.go(0, 84.8, -6.5); console.log('top', t.st());
  t.go(1, 75.4, -2); t.idle(0.3); console.log('Nut on lift', t.n.ground === Lf);
  t.waitFor(t => { const p = phase(B4); return p > 0.1 && p < 0.12; }, 5);
  t.go(0, 83, -6.5, 2, 0.2); console.log('lift at', phase(B4).toFixed(2), t.w.channels[4]);
  t.waitFor(t => Lf.s >= Lf.total - 0.01, 8); t.go(1, 81.5, -2); console.log('Nut up', t.st(), t.log.slice(-1));
  t.both(88.5, -3, 88.5, -5); t.idle(1.5); }
// shortcut and timing checks (separate worlds, positions set directly)
const put = (u, p, x, y, z) => { p.pos = { x, y, z }; p.prev = { ...p.pos }; };
const at = (u, l, lo, hi) => u.waitFor(u => { const [on, off, ph] = l.timer; const p = (u.w.t + (ph || 0)) % (on + off); return p >= lo && p < hi; }, 6);
{ const u = new Bot(level); put(u, u.b, 15.2, 0.56, -1); put(u, u.n, 14.1, 0.46, -1); u.idle(0.3); at(u, u.w.lasers[0], 1.2, 1.25); u.tick({}, { power: true }); let top = 0; u.run(1.5, () => { top = Math.max(top, u.b.pos.y - 0.55); return { mx: 1 }; }); console.log('Clock In by launch: peak (should be < 5.5)', top.toFixed(2), 'zaps', u.w.stats.zaps[0]); }
{ const u = new Bot(level); put(u, u.n, 14.5, 0.46, -1); put(u, u.b, 14.5, 1.5, -1); u.idle(0.5); const onNut = u.b.ground === u.n; at(u, u.w.lasers[0], 1.2, 1.25); u.tick({}, { power: true }); let top = 0; u.run(1.5, () => { top = Math.max(top, u.b.pos.y - 0.55); return { mx: 1 }; }); console.log('Clock In by launch from Nut\'s head', onNut, 'peak (should be < 5.5)', top.toFixed(2), 'zaps', u.w.stats.zaps[0]); }
{ const u = new Bot(level); put(u, u.b, 16.5, 6.06, -4.5); put(u, u.n, 8, 0.6, -1.5); u.idle(0.2); at(u, u.w.lasers[0], 0.0, 0.05); u.tick({ mx: -0.3 }, {}); u.run(1.5, () => ({ power: true })); console.log('Clock In pull while the laser is on: Nut zapped (should be 1)', u.w.stats.zaps[1]); }
{ const u = new Bot(level); put(u, u.n, 21, 5.96, -1.5); put(u, u.b, 21, 6.9, -1.5); u.idle(0.5); const onNut = u.b.ground === u.n; u.run(1, () => ({ jump: true })); console.log('cog by boost (should be false)', onNut, u.w.cogs[0].got); }
{ const u = new Bot(level); const M = u.w.movers[0]; put(u, u.n, 34.4, 6.0, -4); put(u, u.b, 32, 6.06, -6.5); u.idle(0.3); at(u, u.w.lasers[1], 1.5, 1.55); u.go(0, 30, -6.5, 2, 0.2); u.waitFor(u => M.s >= M.total - 0.01, 8); console.log('Night Bus driven straight at a bad moment: Nut zapped (should be 1)', u.w.stats.zaps[1]); }
{ const u = new Bot(level); put(u, u.n, 57.6, 5.96, -4); put(u, u.b, 57.6, 6.9, -4); u.idle(0.5); const R = u.w.anchors[0]; u.waitFor(u => R.s < 0.01 && R.wait > 0.3, 20); const onNut = u.b.ground === u.n; let got = false; for (let i = 0; i < 60; i++) { u.tick({ mx: 0.3, jump: i < 30, power: i > 18 }, {}); got = got || !!(u.b.target && u.b.target.obj === R); } console.log('Sky Patrol ring by boost (should be false)', onNut, got); }
{ const u = new Bot(level); put(u, u.b, 57.6, 6.06, -4); put(u, u.n, 56.5, 5.96, -4); u.w.anchors[0].speed = 0; u.idle(0.3); u.tick({}, { power: true }); u.run(2.5, () => ({ mx: 1 })); console.log('Sky Patrol launched across without the ring: fell (should be 1)', u.w.stats.falls[0]); }
{ const u = new Bot(level); const M = u.w.anchors[1]; put(u, u.b, 73.6, 6.06, -5.5); put(u, u.n, 70, 5.96, -2); u.idle(0.4); let got = false; for (let i = 0; i < 70; i++) { u.tick({ mx: 0.3, jump: i < 30, power: i > 15 }, {}); got = got || !!(u.b.target && u.b.target.obj === M); }
  const v = new Bot(level); put(v, v.n, 73.4, 5.96, -5.5); put(v, v.b, 73.4, 6.9, -5.5); v.idle(0.5); const onNut = v.b.ground === v.n; let got2 = false; for (let i = 0; i < 70; i++) { v.tick({ mx: 0.3, jump: i < 30, power: i > 18 }, {}); got2 = got2 || !!(v.b.target && v.b.target.obj === M); } console.log('Lookout magnet by jump / by boost (should be false false)', got, onNut, got2); }
{ const u = new Bot(level); const M = u.w.anchors[1]; put(u, u.b, 73.4, 6.06, -5.5); put(u, u.n, 72.3, 5.96, -5.5); u.idle(0.3); at(u, u.w.lasers[3], 0.6, 0.65); u.tick({}, { power: true }); let pw = false; for (let i = 0; i < 150; i++) { pw = pw || u.b.vel.y < 3; u.tick({ mx: 0.3, power: pw }, {}); } console.log('Lookout launch while the laser is on: Bolt zapped (should be 1)', u.w.stats.zaps[0]); }
{ const u = new Bot(level); const Lf = u.w.movers[1]; put(u, u.n, 75.4, 6.0, -2); put(u, u.b, 84.8, 18.06, -6.5); u.idle(0.3); at(u, u.w.lasers[3], 1.4, 1.45); u.go(0, 83, -6.5, 2, 0.2); u.waitFor(u => Lf.s >= Lf.total - 0.01, 8); console.log('Lookout lift at a bad moment: Nut zapped (should be 1)', u.w.stats.zaps[1]); }
console.log('stats', JSON.stringify(t.w.stats));
console.log('cog', t.w.cogs[0].got);
console.log(t.st(), 'complete', t.w.complete, t.log);
