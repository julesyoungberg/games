import { Bot } from './bot.mjs';
import def from '../src/lv/ot5.js';
const t = new Bot(def); const c = t.w.crates[0];
t.idle(3); console.log('crate drifted', t.pos(c));
t.go(1, 11, -1); t.tick({}, { power: true }); t.idle(0.3); console.log('sw', t.w.switches[0].on);
// Bolt shoves the crate from the left onto the belt
t.go(0, 2, -4); t.go(0, c.pos.x - 1.2, c.pos.z, 4, 0.15); t.run(0.8, () => ({ mx: 1 }));
t.waitFor(t => t.w.channels[2], 6); console.log('delivered', t.pos(c), t.w.channels[2]);
t.idle(1); t.both(26.5, -3, 26.5, -5);
t.go(1, 29.5, -4, 4, 0.15); t.go(0, 29, -2); t.go(0, 30.8, -3.8, 3, 0.3);
t.waitFor(t => t.b.vel.y > 2 && t.b.pos.y > 2.8 && t.b.pos.y < 3.3, 5);
t.tick({ mx: 1 }, { power: true }); t.run(1.2, () => ({ mx: 1 })); t.idle(0.5); console.log('bolt up', t.st(), t.log);
t.go(0, 34, -4); t.go(1, 28, -4); t.pullNut(36, -4); console.log('pulled', t.st());
t.both(40, -3, 41.5, -5); t.idle(1.5);
console.log(t.st(), 'complete', t.w.complete, t.log);
{ const u = new Bot(def); u.b.pos = { x: 2, y: 0.6, z: -5.8 }; u.n.pos = { x: 2, y: 0.5, z: -4.6 }; u.idle(0.3); u.tick({}, { power: true }); u.idle(1.5); console.log('cog', u.w.cogs[0].got); }
