import { Bot } from './bot.mjs';
import level from '../src/lv/s15.js';
const t = new Bot(level); const c = t.w.crates; const sw = t.w.switches;
const press = () => { t.tick({}, { power: true }); t.idle(0.3); };
// walk onto a hatch until the tube takes you, then let the landing play out
const post = (who, hx, hz, sec = 6, other = {}) => { const p = t.w.players[who]; let went = false;
  for (let i = 0; i < sec * 60 && !went; i++) { const ox = p.pos.x; const inp = t.steer(p, hx, hz); t.tick(who === 0 ? inp : other, who === 1 ? inp : other); went = Math.abs(p.pos.x - ox) > 1.5; }
  t.idle(1.2, who === 0 ? {} : other, who === 1 ? {} : other); return went; };
// 1. First Class
t.go(0, 5.5, -6.5); post(0, 7, -6.5); console.log('bolt through', t.st());
t.go(0, 14.5, -2.2); console.log('gate', t.w.channels[1]); t.idle(1);
t.go(1, 6, -2); t.go(1, 13, -2.5); t.go(0, 16, -4.5); t.both(16, -3, 16, -5);
console.log('P1 done', t.st(), t.log);
// 2. Parcel Post
t.boostBolt(23, -3.0, 0, -1); console.log('on shelf?', t.st(), t.onNut);
t.go(0, 20.8, -6.5, 4, 0.15); t.grab(1, 0, 0.8); console.log('grab', !!c[0].pulledBy);
t.goHold(24.1, -6.2); t.idle(2); console.log('crate', t.pos(c[0]), 'ch2', t.w.channels[2], t.log);
t.go(1, 23, -1.8); t.go(0, 23, -4.7, 4, 0.15); t.tick({ mz: 0.3 }, {}); t.pullNut(23, -7, 3); console.log('nut up', t.st());
t.go(0, 23, -5); post(1, 25.8, -6.2); console.log('nut posted', t.st(), t.pos(c[0]));
post(0, 25.8, -6.2); console.log('bolt posted', t.st(), t.pos(c[0]), t.w.channels[2]);
t.both(31, -2.5, 30.5, -4); t.both(36.5, -3, 36.5, -5); console.log('P2 done', t.st(), t.log);
// 3. Special Delivery
t.launchBolt(39.3, -4, 1, 0, 1.0); console.log('bolt over', t.st(), t.log);
t.go(0, 46.5, -1.8); t.go(0, 49.2, -1.8); t.go(0, 49.2, -4, 4, 0.15); t.go(1, 38.5, -4); t.tick({ mx: -0.3 }, {});
t.grab(-1, 0, 3); t.idle(1.2); console.log('nut slotted', t.st());
post(0, 47.5, -4); console.log('P3 done', t.st(), t.log);
// 4. Return to Sender
t.go(0, 57, -1); console.log(t.st()); t.go(1, 55.8, -6.3); t.idle(1); console.log('ch3', t.w.channels[3], t.w.gates[2].open);
post(0, 58, -5); t.run(1.5, () => ({ mx: 1 })); console.log('bolt up', t.st(), t.log);
t.go(1, 55.8, -3); t.go(0, 69.2, -6.5); t.grab(1, 0, 0.8); console.log('grab', !!c[1].pulledBy);
t.goHold(72.3, -7.3); t.idle(2.5); console.log('crate', t.pos(c[1]), 'ch3', t.w.channels[3], t.log);
t.go(0, 76, -2.5); post(1, 58, -5, 6); t.run(1.5, () => ({}), () => ({ mx: 1 })); console.log('nut up', t.st());
t.both(76, -2.5, 76, -4.5); console.log('P4 done', t.st(), t.log);
// 5. Rush Hour
const L5 = t.w.lasers[0];
t.go(0, 78, -2.5); t.go(1, 79.7, -6.3); console.log('belt fwd', t.w.channels[4]);
t.waitFor(t => !L5.on, 4); post(1, 81.5, -6.3); console.log('nut through', t.st(), t.log.slice(-1));
t.go(1, 94.5, -5.6, 6); press(); console.log('switch', sw[0].on);
t.go(0, 79.7, -6.3); t.waitFor(t => L5.on, 4); t.waitFor(t => !L5.on, 4); post(0, 81.5, -6.3); console.log('bolt through', t.st());
t.both(98, -3, 98.5, -5); t.idle(1.5);
// golden cog: up on the sorting shelf, Nut launches Bolt straight up into it (positions set directly)
{ const u = new Bot(level); u.b.pos = { x: 22.3, y: 2.6, z: -7.2 }; u.n.pos = { x: 21.2, y: 2.5, z: -7.2 }; u.b.prev = { ...u.b.pos }; u.n.prev = { ...u.n.pos }; u.idle(0.4); u.tick({}, { power: true }); u.idle(1.5); console.log('cog', u.w.cogs[0].got); }
{ const u = new Bot(level); u.b.pos = { x: 22.3, y: 2.6, z: -7.2 }; u.n.pos = { x: 22.3, y: 2.5, z: -5.2 }; u.b.prev = { ...u.b.pos }; u.n.prev = { ...u.n.pos }; u.idle(0.4); for (let i = 0; i < 70; i++) u.tick({ jump: i < 30 }, {}); console.log('cog by jump alone (should be false)', u.w.cogs[0].got); }
console.log('stats', JSON.stringify(t.w.stats));
console.log(t.st(), 'complete', t.w.complete, t.log);
