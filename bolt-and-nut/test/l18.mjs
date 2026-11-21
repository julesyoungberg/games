import { Bot } from './bot.mjs';
import level from '../src/lv/s18.js';
const t = new Bot(level); const A = t.w.anchors; const sw = t.w.switches;
const press = () => { t.tick({}, { power: true }); t.idle(0.3); };
const hanging = (a) => t.b.target && t.b.target.obj === a && t.b.hang;
// face (fx,fz), press X and keep holding until clinging to anchor a
const cling = (a, fx, fz = 0, sec = 3) => {
  t.tick({ mx: fx * 0.3, mz: fz * 0.3 }, {});
  for (let i = 0; i < sec * 60 && !hanging(a); i++) t.tick({ power: true }, {});
  return hanging(a);
};
// let go of X for one tick, then press again while facing (fx,fz): grabs the next magnet in mid-air
const swap = cling;
const hop = (fx, fz = 0, sec = 1.2) => { t.tick({ power: true, mx: fx, mz: fz }, {}); t.tick({ power: true, mx: fx, mz: fz, jump: true }, {}); t.run(sec, () => ({ mx: fx, mz: fz, jump: true })); t.idle(0.3); };
// 1. First Cling
t.go(1, 4, -5.5); t.go(0, 9.5, -1.6);
console.log('cling1', cling(A[0], 1), t.st());
hop(1); console.log('up1', t.st());
t.go(0, 14, -7); t.go(1, 10, -7); t.tick({ mx: -0.3 }, {}); t.pullNut(17, -6); console.log('P1', t.st(), t.log);
// 2. Wall Launch
t.both(27.5, -1.6, 22, -5.5);
console.log('cling2', cling(A[1], 1), t.st());
t.go(1, 28.4, -1.6, 6, 0.15, { power: true }); t.idle(0.2, { power: true }); console.log('nut under', t.st());
t.tick({}, { power: true }); t.run(1.2, () => ({ mx: 1 })); t.idle(0.4); console.log('launched', t.st());
t.go(0, 32, -7); t.go(1, 28, -7); t.tick({ mx: -0.3 }, {}); t.pullNut(34, -5); console.log('P2', t.st(), t.log);
// 3. Floor Is Lava
t.go(1, 36, -6.5); t.go(0, 40.5, -4);
console.log('m1', cling(A[3], 1, -0.3), t.st(), t.log.slice(-1));
console.log('m2', swap(A[4], 1), t.st());
console.log('m3', swap(A[5], 1), t.st());
hop(1, 0.3, 1.0); console.log('over', t.st(), t.log.slice(-1));
t.go(0, 58, -6.3); console.log('cage off', t.w.channels[3], t.w.lasers[1].on);
{ let went = false; for (let i = 0; i < 360 && !went; i++) { const ox = t.n.pos.x; t.tick({}, t.steer(t.n, 39.5, -1.6)); went = Math.abs(t.n.pos.x - ox) > 1.5; } t.idle(1.2); console.log('tube', went, t.st()); }
t.both(60, -3, 60, -5.5); console.log('P3', t.st(), t.log);
// 4. Pillar Talk
t.go(1, 60, -2); t.go(0, 62.4, -6.2);
console.log('pillar', cling(A[6], 1), t.st());
hop(0.25, 0, 0.8); t.go(0, 68, -6.2, 3, 0.2); console.log('on plate', t.st(), t.w.channels[4]);
t.go(1, 63.5, -2); t.go(1, 76, -2); t.go(1, 80, -5.8); press(); console.log('switch', sw[0].on, t.st());
t.go(0, 68, -3.5, 3); t.idle(0.6); t.go(0, 76, -3); t.both(77, -3, 78, -5.5); console.log('P4', t.st(), t.log);
// 5. Top Floor
const R = A[7], M = t.w.movers[0];
t.go(1, 89.2, -2); t.go(0, 85.2, -6.2);
t.waitFor(t => R.dir > 0 && R.wait > 0, 20);
let hung = false;
for (let i = 0; i < 900 && !hung; i++) {
  const nearApex = t.b.pos.y > 14.5 && t.b.vel.y < 2 && R.x < 91;
  t.tick(t.b.target || nearApex ? { mx: 0.3, power: true } : { ...t.steer(t.b, 87, -6.2) }, {});
  hung = hanging(R);
}
console.log('ring', hung, t.st(), R.x.toFixed(2));
for (let i = 0; i < 600 && R.x < 95.8; i++) t.tick({ power: true }, {});
console.log('magnet', swap(A[8], 1), t.st());
hop(1, 0, 0.8); t.go(0, 102.5, -6.3); console.log('top', t.st(), t.w.channels[5]);
t.waitFor(t => M.s >= M.total - 0.01, 15); t.go(1, 103, -2.5); console.log('lift', t.st());
t.both(108, -3, 108.5, -5); t.idle(1.5);
// golden cog (positions set directly on the shelf): Bolt clings to the back-wall magnet, Nut launches him off the wall
const put = (u, p, x, y, z) => { p.pos = { x, y, z }; p.prev = { ...p.pos }; };
{ const u = new Bot(level); put(u, u.b, 35, 10.6, -5); put(u, u.n, 33, 10.5, -3); u.idle(0.3);
  u.tick({ mz: -0.3 }, {}); u.run(1, () => ({ power: true })); const c = u.b.hang;
  u.go(1, 35, -5.6, 4, 0.15, { power: true }); u.idle(0.2, { power: true }); u.tick({}, { power: true }); u.idle(1.5);
  console.log('cog clinging', c, 'got', u.w.cogs[0].got); }
// ...a plain launch from the shelf floor or a hop off the magnet falls short
{ const u = new Bot(level); put(u, u.b, 35, 10.6, -7.3); put(u, u.n, 35, 10.5, -4.8); u.idle(0.3); u.tick({}, { power: true }); u.idle(1.5); console.log('cog by floor launch (should be false)', u.w.cogs[0].got); }
{ const u = new Bot(level); put(u, u.b, 35, 10.6, -5); put(u, u.n, 31, 10.5, -3); u.idle(0.3); u.tick({ mz: -0.3 }, {}); u.run(1, () => ({ power: true })); u.tick({ power: true, jump: true }, {}); u.run(1, () => ({ jump: true })); console.log('cog by hop (should be false)', u.w.cogs[0].got); }
// wall launch is needed in puzzle 2: a hop off the low magnet falls short of the shelf
{ const u = new Bot(level); put(u, u.b, 27.5, 4.7, -1.6); put(u, u.n, 22, 4.7, -5.5); u.idle(0.3); u.tick({ mx: 0.3 }, {}); u.run(1, () => ({ power: true })); u.tick({ power: true, mx: 1, jump: true }, {}); u.run(1.2, () => ({ mx: 1, jump: true })); console.log('P2 by hop (should be < 10)', u.b.pos.y.toFixed(2)); }
console.log('stats', JSON.stringify(t.w.stats));
console.log(t.st(), 'complete', t.w.complete, t.log);
