import { Bot } from './bot.mjs';
import def from '../src/lv/ot6.js';
const t = new Bot(def);
// 1. Raise Request: Nut launches Bolt onto the pillar spring; he bounces onto the shelf plate (latches the gate)
t.go(0, 7, -6); t.go(1, 5.9, -6); t.idle(0.3);
t.tick({}, { power: true });
for (let i = 0; i < 180; i++) t.tick(t.b.pos.y > 6.5 && i > 50 ? t.steer(t.b, 13.3, -6.5) : t.steer(t.b, 9, -6), {});
console.log('plate', t.w.channels[1], t.st());
t.idle(1.5); console.log('gate', t.w.gates[0].open);
t.go(1, 7, -2); t.go(0, 15.6, -6.5); t.go(0, 16.5, -6.5); t.both(20, -2.5, 20, -5); console.log('P1', t.st(), t.log);
// 2. Piggyback Bonus: Bolt rides on Nut's head up the spring and jumps off at the top
t.both(22.5, -4, 24, -4);
for (let i = 0; i < 70; i++) { const s = t.steer(t.b, t.n.pos.x, t.n.pos.z); t.tick({ ...s, jump: i < 18 }, {}); }
console.log('on Nut', t.b.ground === t.n);
let jumped = false;
for (let i = 0; i < 150; i++) {
  if (!jumped && t.n.pos.y > 1 && t.n.vel.y < 2) jumped = true;
  t.tick(jumped ? { jump: true, mx: 1 } : t.steer(t.b, t.n.pos.x, t.n.pos.z), t.steer(t.n, 27.3, -4));
}
console.log('bolt up', t.st());
t.go(0, 30.0, -4); t.tick({ mx: -0.3 }, {});
t.waitFor(t => t.n.pos.y > 5 && t.n.vel.y < 3, 4);
t.run(1.2, () => ({ power: true })); t.goHold(33, -4); t.idle(0.8); console.log('P2', t.st(), t.log);
t.both(40, -3, 40, -5); t.idle(1.5);
console.log('stats', JSON.stringify(t.w.stats));
console.log(t.st(), 'complete', t.w.complete, t.log);
// without the piggyback: Nut launching Bolt off the spring (best timing of many) falls short of the bar
{ let best = 0;
  for (let d = 0; d < 40; d++) { const u = new Bot(def); u.b.pos = { x: 24.5, y: 0.6, z: -4 }; u.n.pos = { x: 25.2, y: 0.5, z: -5.5 }; u.b.prev = { ...u.b.pos }; u.n.prev = { ...u.n.pos }; u.idle(0.3);
    u.waitFor(u => u.b.vel.y > 5, 2, { mx: 1 }); u.run(d / 60, () => ({ mx: 1 })); u.tick({}, { power: true });
    for (let i = 0; i < 90; i++) { u.tick({ mx: 1 }, {}); if (u.b.launched) best = Math.max(best, u.b.pos.y - 0.55); } }
  console.log('spring + launch best apex', best.toFixed(2), '(bar is 7.6)'); }
// golden cog: above the pillar spring, only after Nut launches Bolt onto it
{ const u = new Bot(def); u.go(0, 7, -7.3); u.go(1, 5.9, -7.3); u.idle(0.3); u.tick({}, { power: true });
  for (let i = 0; i < 150 && !u.w.cogs[0].got; i++) u.tick(u.steer(u.b, 9, -7.3), {}); console.log('cog', u.w.cogs[0].got); }
