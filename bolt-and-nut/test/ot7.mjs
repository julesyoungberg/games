import { Bot } from './bot.mjs';
import def from '../src/lv/ot7.js';
const t = new Bot(def); const c = t.w.crates[0];
// 1. Mail Slot: Bolt pulls the parcel off the top shelf and sets it down; Nut throws it over the kerb into the laser mailbox
t.go(1, 9, -2);
t.go(0, 7, -6.5); t.tick({ mx: -0.3 }, {}); t.run(2, () => ({ power: true })); console.log('grab', !!c.pulledBy, t.pos(c));
t.go(0, 4.5, -5.9); t.tick({ mx: 0.3 }, {}); t.goHold(6.2, -5.9); t.run(0.6, () => ({ power: true })); t.idle(0.6); console.log('placed', t.pos(c));
t.go(0, 4, -2.5); t.go(1, 4.5, -2.5); t.go(1, c.pos.x - 1.4, c.pos.z, 8, 0.08); t.idle(0.3);
t.tick({}, { power: true }); t.waitFor(t => t.w.channels[1], 6); console.log('thrown', t.pos(c), t.w.channels[1]);
t.idle(1.5); t.both(9.5, -1.6, 8.5, -1.6); t.both(23, -1.6, 22, -1.6); t.both(23, -2.5, 23, -5); console.log('P1', t.st(), t.log);
// 2. Return to Sender: Bolt takes the tube and grabs the ring as he pops up off the pillar; then he catches Nut the same way
t.go(1, 24, -6.5); t.go(0, 25.5, -4);
for (let i = 0; i < 400 && !t.b.hang; i++) t.tick(t.b.pos.x < 31 ? t.steer(t.b, 27.5, -4) : t.b.vel.y < 3 ? { power: true, mx: 0.3 } : {}, {});
t.run(0.2, () => ({ power: true })); console.log('hang', t.b.hang, t.st()); t.idle(1); console.log('across', t.st());
t.go(0, 38.6, -4); t.tick({ mx: -0.3 }, {});
t.waitFor(t => t.n.pos.x > 31 && t.n.vel.y < 4, 8, {}, t => t.steer(t.n, 27.5, -4)); console.log('nut pops', t.st());
t.run(1.2, () => ({ power: true })); t.goHold(41, -4); t.idle(0.8); console.log('P2', t.st(), t.log);
t.both(46.5, -3, 46.5, -5); t.idle(1.5);
console.log('stats', JSON.stringify(t.w.stats));
console.log(t.st(), 'complete', t.w.complete, t.log);
// the pillar hatch posts you straight back if you just land on it
{ const u = new Bot(def); u.b.pos = { x: 25.5, y: 0.6, z: -4 }; u.b.prev = { ...u.b.pos }; u.idle(0.2);
  u.waitFor(u => u.b.pos.x > 31, 3, u => u.steer(u.b, 27.5, -4)); u.idle(2.5); console.log('returned to sender', u.b.pos.x < 28, u.log); }
// golden cog: above the start corner, Nut launches Bolt straight up into it
{ const u = new Bot(def); u.go(1, 5, -3); u.go(0, 3, -7.2, 8, 0.1); u.go(1, 3, -5.6, 8, 0.1); u.idle(0.3); u.tick({}, { power: true }); let my = 0; for (let i = 0; i < 90; i++) { u.tick({}, {}); my = Math.max(my, u.b.pos.y); } console.log('cog', u.w.cogs[0].got); }
{ const u = new Bot(def); u.go(0, 3, -7.2, 8, 0.1); u.idle(0.3); u.run(0.6, () => ({ jump: true })); u.idle(0.8); console.log('cog by jump alone (should be false)', u.w.cogs[0].got); }
