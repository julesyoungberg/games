import { Bot } from './bot.mjs';
const t = new Bot(4); const c = t.w.crates; const m = t.w.movers;
// Bolt picks up crate0 (8,-4)
t.go(0, 6, -4); t.grab(1, 0, 0.6);
t.both(11.2, -4.3, 11.2, -2.6);
t.waitFor(t => m[0].off.x < 0.05 && m[0].wait > 0.3, 20, { power: true });
// step on: bolt to 14.6 (crate in front at 16.3? beyond platform... carry crate facing -z instead)
t.run(0.6, b => ({ power: true, ...b.steer(b.b, 13.7, -3.2) }), b => b.steer(b.n, 13.7, -5));
t.run(0.1, () => ({ power: true, mz: -0.3 }));
console.log('on mover', t.st(), 'crate', t.pos(c[0]), t.b.ground === m[0], t.n.ground === m[0]);
t.waitFor(t => m[0].off.x > 8.55, 10, { power: true });
t.run(0.8, () => ({ power: true, mx: 1 }), () => ({ mx: 1 }));
t.both(26, -3, 26, -5);
console.log('B side', t.st(), 'crate', t.pos(c[0]));
t.carry(c[0], 27.5, -6, 0, -1);
console.log('ch1', t.w.channels[1], t.pos(c[0]));
// island crate (19,-12): Bolt at 24.6,-7.3 facing toward it
t.go(0, 24.6, -7.4); t.grab(-1, -1, 0.3); console.log('target island', t.b.target && t.b.target.obj === c[1]);
t.run(2.5, () => ({ power: true })); console.log('c1', t.pos(c[1]));
for (let i = 0; i < 300 && Math.hypot(t.b.pos.x - 29, t.b.pos.z + 2) > 0.3; i++) t.tick({ power: true, ...t.steer(t.b, 29, -2) }, {});
t.carry(c[1], 32, -6, 1, 0);
console.log('ch2', t.w.channels[2], t.pos(c[1]), 'gate', t.w.gates[0].open);
t.idle(1); t.both(36, -1, 36.5, -2.5); t.go(0, 43.5, -4); t.go(1, 39.5, -6.3); t.idle(3); console.log('lift up', t.st(), m[1].off);
t.go(0, 46, -4); t.pullNut(48, -4); console.log('pulled', t.st());
t.both(51.4, -3, 51.4, -5);
t.waitFor(t => m[2].off.x < 0.05 && m[2].wait > 0.3, 20);
t.run(0.5, b => b.steer(b.b, 53.7, -3.2), b => b.steer(b.n, 53.7, -5));
t.waitFor(t => m[2].off.x > 5.55, 10);
t.run(0.8, () => ({ mx: 1 }), () => ({ mx: 1 }));
t.both(69, -3, 69, -5); t.idle(1.5);
console.log(t.st(), 'complete', t.w.complete, t.log);
