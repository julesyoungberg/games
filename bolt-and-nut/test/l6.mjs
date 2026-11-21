import { Bot } from './bot.mjs';
const t = new Bot(5); const c = t.w.crates; const L = t.w.lasers;
t.both(8.3, -3, 8.3, -5.5);
t.waitFor(t => !L[0].on && t.w.lasersOffT === undefined, 10); // wait until off
t.waitFor(t => L[0].on, 10); t.waitFor(t => !L[0].on, 10);
t.run(1.4, () => ({ mx: 1 }), () => ({ mx: 1 }));
console.log('past timed', t.st(), t.log);
t.both(20, -3, 20, -5);
t.go(1, 23, -6.3); t.go(0, 28, -2); t.go(0, 29, -6.3); t.go(1, 30, -2.5);
console.log('past wall', t.st(), t.log);
// crates: c0 (34,-3) -> plate ch3 (36,-6.3); c1 shelf (40,-9.5) -> plate ch4 (40,-3)
t.go(1, 33, -1);
t.go(0, 32, -3); t.grab(1, 0, 0.6); t.carry(c[0], 35.5, -6.3, 0, -1);
t.go(0, 40, -6.6); t.grab(0, -1, 0.3); t.run(1.5, () => ({ power: true }));
for (let i = 0; i < 200 && Math.hypot(t.b.pos.x - 40, t.b.pos.z + 3) > 0.2; i++) t.tick({ power: true, ...t.steer(t.b, 40, -3) }, {});
t.carry(c[1], 40, -6.3, 0, -1);
console.log('crates', t.pos(c[0]), t.pos(c[1]), t.w.channels, 'laser', L[4].on);
t.go(0, 42, -2); t.go(1, 42, -1); t.both(46.5, -3, 46.5, -5);
console.log('past crates', t.st(), t.log);
// two blinking lasers out of phase at 49 and 52
t.waitFor(t => !L[5].on, 10); t.run(0.35, () => ({ mx: 1 }), () => ({ mx: 1 }));
t.waitFor(t => !L[6].on, 10); t.run(0.6, () => ({ mx: 1 }), () => ({ mx: 1 }));
t.both(58, -3, 58, -5); t.idle(1.5);
console.log(t.st(), 'complete', t.w.complete, t.log);
