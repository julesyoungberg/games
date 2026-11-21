import { Bot } from './bot.mjs';
import level from '../src/lv/ot2.js';
const t = new Bot(level); const c = t.w.crates; const L = t.w.lasers;
// --- puzzle 1: launch Bolt into the cubby, carry the crate through the fence
t.go(1, 12, -2.5); t.launchBolt(8.5, -3.8, 0, -1, 0.9); console.log('cubby', t.st());
t.go(0, 8.7, -6.6, 3, 0.15); t.grab(-1, 0, 1.0); console.log('grab', !!c[0].pulledBy, t.pos(c[0]));
for (let i = 0; i < 70; i++) t.tick({ power: true, mx: 0.6, mz: 1, jump: i < 25 }, {});
console.log('out', t.st(), t.pos(c[0]));
t.goHold(19.5, -6.3, 8); t.run(0.3, () => ({ power: true, mx: 0.3 })); t.idle(0.8);
console.log('crate', t.pos(c[0]), 'ch1', t.w.channels[1], 'fence', L[0].on);
t.both(24, -3, 24, -5);
// --- puzzle 2: Nut holds the plate, Bolt floats up between blinks, then pulls Nut up between blinks
t.go(1, 29, -6.3); t.go(0, 30.8, -4);
t.waitFor(t => L[1].on, 5); t.waitFor(t => !L[1].on, 5);
t.go(0, 33.5, -4, 3); t.run(1.0, () => ({})); t.run(1.0, () => ({ mx: 1 })); t.go(0, 36.5, -5.5);
console.log('bolt up', t.st(), t.log);
t.tick({ mx: -0.3, mz: -0.1 }, {});
t.waitFor(t => L[1].on, 5); t.waitFor(t => !L[1].on, 5);
t.pullNut(37.5, -5); console.log('pulled', t.st());
t.both(43.5, -3, 44.5, -5); t.idle(1.5);
console.log(t.st(), 'complete', t.w.complete, t.log);

{ const u = new Bot(Object.values({}).length ? null : (await import('../src/lv/ot2.js')).default); const c = u.w.cogs[0]; u.b.pos = { x: c.x - 1.25, y: 0.6, z: c.z }; u.n.pos = { x: c.x - 2.45, y: 0.5, z: c.z }; u.idle(0.4); u.tick({}, { power: true }); u.idle(1.5); console.log('cog', c.got); }
