import { Bot } from './bot.mjs';
import level from '../src/lv/ot1.js';
const t = new Bot(level);
const H = { power: true };
// --- puzzle 1: Bolt hangs from the ring, Nut uses his head as a step
t.go(1, 8.5, -6.5); t.go(0, 11.4, -4.3); t.go(1, 8.5, -4.3); t.tick({ mx: 0.3 }, {});
t.run(1.2, () => H); console.log('hang', t.b.hang, t.st());
// Nut runs and jumps onto Bolt's head
t.run(1.4, () => H, b => ({ ...b.steer(b.n, 15.5, -4.3), jump: b.n.pos.x > 11.3 && b.n.ground !== b.b }));
t.run(0.3, () => H); console.log('on head', t.n.ground === t.b, t.st());
// Nut jumps onto the pillar
for (let i = 0; i < 72; i++) t.tick(H, { ...t.steer(t.n, 18.2, -6.7), jump: i < 30 });
t.go(1, 18.2, -6.7, 1, 0.15, H); t.run(0.3, () => H);
console.log('pillar', t.st(), 'bridge', t.w.bridges[0].on);
// Bolt drops onto the bridge, crosses, pulls Nut over
t.idle(0.5); t.go(0, 23.5, -3); t.pullNut(24.5, -3); console.log('across', t.st());
// --- puzzle 2: stack and launch
t.go(1, 35.2, -4); t.go(0, 33.6, -4); t.idle(0.2);
for (let i = 0; i < 70; i++) { const s = t.steer(t.b, t.n.pos.x, t.n.pos.z); t.tick({ ...s, jump: i < 18 }, {}); }
t.go(0, t.n.pos.x, t.n.pos.z, 1, 0.08); t.idle(0.2); console.log('stacked', t.b.ground === t.n, t.st());
t.tick({}, { power: true }); t.run(1.2, () => ({ mx: 1 })); t.idle(0.3); console.log('up', t.st());
t.go(0, 37, -4); t.tick({ mx: -0.3 }, {}); t.pullNut(38, -4); console.log('pulled', t.st());
t.both(43.5, -3, 44.5, -5); t.idle(1.5);
console.log(t.st(), 'complete', t.w.complete, t.log);

{ const u = new Bot(Object.values({}).length ? null : (await import('../src/lv/ot1.js')).default); const c = u.w.cogs[0]; u.b.pos = { x: c.x - 1.25, y: 0.6, z: c.z }; u.n.pos = { x: c.x - 2.45, y: 0.5, z: c.z }; u.idle(0.4); u.tick({}, { power: true }); u.idle(1.5); console.log('cog', c.got); }
