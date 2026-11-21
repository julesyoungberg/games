import { Bot } from './bot.mjs';
import level from '../src/lv/ot3.js';
const t = new Bot(level); const c = t.w.crates; const [W, I] = c; const sw = t.w.switches;
const H = { power: true };
// --- puzzle 1: catch the wooden crate on the iron one
t.go(1, 3.5, -5.2); t.go(0, 3, -0.6); t.grab(0, -1, 0.8); console.log('grab', !!I.pulledBy);
t.goHold(14.4, -3.5); t.goHold(14.4, -6.8); t.run(0.3, () => ({ ...H, mx: -0.3 })); t.run(0.6, () => H);
console.log('holding', t.pos(I), t.st());
t.tick(H, { power: true }); t.run(3, () => H); console.log('switch', sw[0].on, 'W', t.pos(W), 'I', t.pos(I));
// back up slowly, still facing the crate, then set the stack down on the floor
for (let i = 0; i < 300 && t.b.pos.x < 16.9; i++) t.tick({ ...H, mx: 0.19 }, {});
t.run(0.3, () => H); t.idle(0.8); console.log('stack', t.pos(I), t.pos(W), W.ground === I);
// --- puzzle 2: up the ledge, then pull the stack through the slot
t.launchBolt(17.4, -3, 1, 0, 1.0); console.log('launched', t.st());
t.go(0, 19.2, -3); t.pullNut(20, -3); console.log('pulled', t.st());
t.go(0, 25.5, -6.8); t.go(1, 28.5, -2); t.tick({ mx: -0.3 }, {});
t.run(2.5, () => H); console.log('pulled stack', 'I', t.pos(I), 'W', t.pos(W), t.w.channels);
t.goHold(28.2, -6.8); t.run(0.3, () => ({ ...H, mx: -0.3 })); t.run(0.5, () => H); t.idle(0.8);
console.log('plates', t.pos(I), t.pos(W), t.w.channels, t.w.gates[0].open);
t.both(33, -3, 33, -5); t.both(37.5, -3, 38.5, -5); t.idle(1.5);
console.log(t.st(), 'complete', t.w.complete, t.log);

{ const u = new Bot(Object.values({}).length ? null : (await import('../src/lv/ot3.js')).default); const c = u.w.cogs[0]; u.b.pos = { x: c.x - 1.25, y: 0.6, z: c.z }; u.n.pos = { x: c.x - 2.45, y: 0.5, z: c.z }; u.idle(0.4); u.tick({}, { power: true }); u.idle(1.5); console.log('cog', c.got); }
