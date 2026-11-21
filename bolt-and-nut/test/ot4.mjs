import { Bot } from './bot.mjs';
import def from '../src/lv/ot4.js';
const t = new Bot(def); const c = t.w.crates[0];
t.go(0, 2.2, -4);
// run onto the spring, grapple at the top
t.run(0.5, () => ({ mx: 1 }));
t.waitFor(t => t.b.vel.y < 2 && t.b.pos.y > 3, 3, { mx: 1 });
t.grab(1, 0, 1.2); console.log('hang1', t.st(), t.b.hang);
t.tick({ mx: 1 }, {}); t.tick({ mx: 1 }, {}); t.grab(1, 0, 1.2); t.idle(1); console.log('across', t.st());
t.go(0, 15.4, -4); t.go(1, 6, -4, 3, 0.3); t.tick({ mx: -0.3 }, {});
t.waitFor(t => t.n.pos.y > 4.4 && t.n.vel.y < 3, 4); console.log('nut high', t.st());
t.run(1.4, () => ({ power: true })); t.goHold(17.5, -3); t.idle(0.8); console.log('pulled', t.st());
t.go(1, 17, -6.5); t.go(0, 24, -2.2); t.tick({ mz: -0.3 }, {});
console.log('pre', t.st(), JSON.stringify(t.b.face)); t.waitFor(t => c.pos.y > 5, 3); t.run(0.4, () => ({ power: true })); console.log('tgt', t.b.target && t.b.target.kind, t.pos(c)); t.goHold(24, -0.6); t.run(0.5, () => ({ power: true })); console.log('crate', !!c.pulledBy, t.pos(c));
t.carry(c, 29, -6.3, 1, 0); console.log('plate', t.w.channels[1], t.pos(c), t.st(), !!c.pulledBy);
t.idle(1); t.both(27.5, -2, 20, -2); t.both(34, -3, 34, -5); t.both(39.5, -3, 40.5, -5); t.idle(1.5);
console.log(t.st(), 'complete', t.w.complete, t.log);
{ const u = new Bot(def); u.b.pos = { x: 23.4, y: 2, z: -6.8 }; u.idle(3); console.log('cog', u.w.cogs[0].got); }
