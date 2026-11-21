import { Bot } from './bot.mjs';
import level from '../src/lv/s16.js';
const t = new Bot(level); const A = t.w.anchors; const sw = t.w.switches;
const press = () => { t.tick({}, { power: true }); t.idle(0.3); };
// face +x then hold pull until hanging from anchor a
const grabRing = (a, cond, fx = 1, sec = 20) => {
  t.waitFor(cond, sec);
  t.tick({ mx: fx * 0.3 }, {});
  t.run(0.05, () => ({ power: true }));
  return t.b.target && t.b.target.obj === a;
};
const rideUntil = (cond, sec = 15) => { for (let i = 0; i < sec * 60 && !cond(t); i++) t.tick({ power: true }, {}); t.tick({}, {}); };
// golden cog: a plain jump is not enough...
{ const c = new Bot(level); c.go(0, 4, -6.8); c.run(0.6, () => ({ jump: true })); c.idle(0.6); console.log('cog by jump alone', c.w.cogs[0].got); }
// ...but Nut launching Bolt straight up gets it
t.go(1, 1.7, -6.8); t.go(0, 2.8, -6.8); t.idle(0.3); t.tick({}, { power: true });
t.run(1.3, b => b.steer(b.b, 4, -6.8)); t.idle(0.5); console.log('cog', t.w.cogs[0].got);
// 1. First Ride
t.both(9.4, -4, 6, -5.5);
console.log('grab1', grabRing(A[0], t => A[0].x < 11.3 && A[0].dir > 0));
rideUntil(t => A[0].x > 20.2); t.idle(1); console.log('across', t.st());
t.go(0, 19.6, -4); t.go(1, 9.3, -4);
t.tick({ mx: -0.3 }, {}); t.pullNut(23, -4); console.log('P1', t.st(), t.log);
// 2. Drop Zone
t.both(29.5, -4, 27, -5.5);
console.log('grab2', grabRing(A[1], t => A[1].x < 31.3 && A[1].dir > 0));
rideUntil(t => A[1].x > 36.6); t.idle(1); console.log('pillar', t.st(), t.w.channels[1]);
t.go(1, 29.5, -6.4); t.go(1, 44.5, -6.4); t.go(1, 49, -5.5); console.log('nut across', t.st());
console.log('grab2b', grabRing(A[1], t => A[1].x < 36 && A[1].x > 34 && A[1].dir > 0, -1));
rideUntil(t => A[1].x > 45.3); t.idle(1); console.log('P2', t.st(), t.log);
// 3. High Line
t.both(48, -4, 49, -6, 10);
t.go(0, 53.5, -4); t.go(1, 52.4, -4);
t.waitFor(t => A[2].wait > 0 && A[2].dir > 0, 20);
t.tick({}, { power: true });
t.run(0.35, () => ({}));
t.tick({ mx: 0.3 }, {}); t.run(0.05, () => ({ power: true })); console.log('grab3', t.b.target && t.b.target.kind, t.st());
rideUntil(t => A[2].x > 60); t.idle(1); console.log('ledge', t.st());
t.go(1, 53, -4); t.go(0, 57.6, -4); t.tick({ mx: -0.3 }, {}); t.pullNut(62, -4); console.log('P3', t.st(), t.log);
// 4. Express
t.go(1, 66.5, -6.5); t.waitFor(t => t.n.pos.x > 74, 3, {}, b => b.steer(b.n, 68.5, -6.5)); t.idle(1.5); console.log('tube', t.st(), t.log.slice(-2));
t.go(1, 79.5, -6.5); press(); console.log('sw', sw[0].on, t.w.lasers[0].on);
t.go(0, 69.5, -4);
console.log('grab4', grabRing(A[3], t => A[3].x > 72.3 && A[3].x < 73 && A[3].dir > 0));
rideUntil(t => A[3].x > 87.8); t.idle(1); console.log('far', t.st());
t.go(0, 87.5, -4); t.tick({ mx: -0.3 }, {}); t.pullNut(90, -4); console.log('P4', t.st(), t.log);
// 5. Last Stop
t.both(93.8, -4, 91.5, -6.8, 10); console.log('P5start', t.st(), t.log.slice(-3)); console.log('cage', t.w.lasers[1].on);
t.waitFor(t => A[4].dir > 0 && A[4].x > 96 && A[4].x < 97, 20);
let hung = false;
for (let i = 0; i < 600 && !hung; i++) {
  const nearApex = t.b.pos.y > 12 && Math.abs(t.b.vel.y) < 3;
  t.tick(nearApex ? { mx: 0.3, power: true } : { ...t.steer(t.b, 96, -4) }, {});
  hung = !!(t.b.target && t.b.target.kind === 'anchor');
}
t.run(0.1, () => ({ power: true }));
console.log('grab5', hung, t.st(), A[4].x.toFixed(2));
rideUntil(t => A[4].x > 99.4); t.idle(1); console.log('platform', t.st(), t.log.slice(-2));
t.go(0, 99, -4); t.tick({ mx: -0.3 }, {}); t.pullNut(102, -4); console.log('P5', t.st(), t.log.slice(-2));
t.both(105, -3, 105, -5); t.idle(1.5);
console.log('cog', t.w.cogs[0].got, 'stats', JSON.stringify(t.w.stats));
console.log(t.st(), 'complete', t.w.complete, t.log);
