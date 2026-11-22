import { Bot } from './bot.mjs';
import def from '../src/lv/ot18.js';
const Y = 9.5;
const t = new Bot(def); const crate = t.w.crates[0];
// 1. Blue Sky Thinking: Bolt pulls the crate off the high shelf
t.go(1, 3, -2); t.go(0, 6, -6.6); t.tick({ mz: -0.3 }, {}); t.run(1.5, () => ({ power: true })); console.log('crate grabbed', !!crate.pulledBy, t.pos(crate));
// carry it to the fan and let go over its far side
t.goHold(13.0, -7.0); t.run(0.3, () => ({ power: true, mz: 0.3 })); t.run(0.4, () => ({ power: true })); t.idle(1.5); console.log('crate floating', t.pos(crate));
t.go(0, 8, -1.5);
// Nut floats up beside it, on the side away from the shelf, and pushes
t.go(1, 11.9, crate.pos.z, 8, 0.15); t.waitFor(u => u.n.pos.y > 4 && crate.pos.y - 0.6 > 7.4, 6); console.log('nut floating', t.pos(t.n), t.pos(crate));
t.tick({}, { power: true }); t.idle(2.5); console.log('crate thrown', t.pos(crate), 'ch1', !!t.w.channels[1], t.log);
// both ride the big fan up
t.go(1, 9, -4, 4, 0.3); t.idle(0.5);
t.both(14, -1.2, 14, -7); t.both(19, -1.2, 19, -7); t.both(21, -3, 21.5, -5); t.idle(2.5); console.log('floating', t.st());
t.both(25, -3, 25, -5, 6); t.idle(0.5); console.log('P1', t.st(), t.log);
// golden cog: Nut launches Bolt straight up into the corner
t.go(0, 25, -6.6, 6, 0.1); t.go(1, 25, -5.4, 6, 0.1); t.idle(0.2); t.tick({}, { power: true }); t.run(1.4, () => t.steer(t.b, 25, -6.6)); t.idle(0.4); console.log('cog', t.w.cogs[0].got, t.st());
t.go(1, 26, -7.2);
// 2. Paperweight: Bolt pulls the crate up off the teal shelf and holds it down on the vent plate
t.go(0, 23.8, -4.5, 4, 0.15); t.tick({ mx: -0.3 }, {}); t.run(1.6, () => ({ power: true })); console.log('crate fetched', !!crate.pulledBy, t.pos(crate), 'ch1', !!t.w.channels[1]);
t.goHold(26.0, -4.25); t.goHold(27.2, -4.25); t.run(0.2, () => ({ power: true, mx: 0.3 })); t.run(0.5, () => ({ power: true })); console.log('held on vent', t.st(), t.pos(crate), 'ch2', !!t.w.channels[2]);
// Nut walks through and stands on the pink plate, while Bolt keeps holding
for (let i = 0; i < 600 && Math.hypot(t.n.pos.x - 39.5, t.n.pos.z + 6.3) > 0.25; i++) t.tick({ power: true }, t.steer(t.n, t.n.pos.x < 36.8 ? 37.5 : 39.5, t.n.pos.x < 36.8 ? -2 : -6.3));
t.run(0.5, () => ({ power: true })); console.log('nut on far plate', t.pos(t.n), 'ch3', !!t.w.channels[3]);
t.idle(0.5); console.log('crate let go', t.pos(crate), 'gate open', t.w.gates[0].open.toFixed(2));
t.go(0, 38, -2.5, 6); t.both(38, -2.5, 38, -4.5); console.log('P2', t.st(), t.log);
t.both(44, -3, 44, -5); t.idle(1.5);
console.log('stats', JSON.stringify(t.w.stats));
console.log(t.st(), 'complete', t.w.complete, 'cog', t.w.cogs[0].got, 'falls', JSON.stringify(t.w.stats.falls), 'zaps', JSON.stringify(t.w.stats.zaps), JSON.stringify(t.log));

const put = (u, p, x, y, z) => { p.pos = { x, y, z }; p.prev = { ...p.pos }; };
const holdCrate = (u, x, z, fx, fz) => { const c = u.w.crates[0]; put(u, c, x + fx * 1.7, 0.6, z + fz * 1.7); put(u, u.b, x, 0.6, z); u.idle(0.2); u.tick({ mx: fx * 0.3, mz: fz * 0.3 }, {}); u.run(1, () => ({ power: true })); return c; };
const up = u => u.w.players.some(p => p.pos.y > Y + 0.3);
// ---- shortcut checks, puzzle 1
{ // Bolt alone carries the crate up the little fan and tries to hold it over the plate
  const u = new Bot(def); const c = holdCrate(u, 10.2, -4.25, 1, 0); let ch = false, top = 0;
  u.goHold(11.6, -4.25); for (let i = 0; i < 360; i++) { u.tick({ power: true, mx: 0.6 }, {}); ch = ch || !!u.w.channels[1]; top = Math.max(top, c.pos.y - 0.6); }
  u.run(1, () => ({ power: true })); u.idle(1); ch = ch || !!u.w.channels[1]; console.log('bolt carries crate up the fan to the plate (should be false)', ch, 'crate bottom max', top.toFixed(2), u.log); }
{ // Nut throws the crate at the shelf from the floor
  const u = new Bot(def); const c = u.w.crates[0]; let ch = false; put(u, c, 16, 0.6, -1.6); put(u, u.n, 16, 0.5, -0.5); u.idle(0.3); u.tick({}, { power: true }); for (let i = 0; i < 150; i++) { u.tick({}, {}); ch = ch || !!u.w.channels[1]; } console.log('nut throws crate from the floor (should be false)', ch, u.pos(c)); }
{ // Nut throws the crate at the shelf from right below it
  const u = new Bot(def); const c = u.w.crates[0]; let ch = false; put(u, c, 15.5, 0.6, -7.2); put(u, u.n, 15.5, 0.5, -1.3); u.idle(0.2); put(u, u.n, 15.5, 0.5, -8 + 0.45); put(u, c, 15.5, 0.6, -6.6); u.idle(0.1); u.tick({}, { power: true }); for (let i = 0; i < 150; i++) { u.tick({}, {}); ch = ch || !!u.w.channels[1]; } console.log('nut throws crate up from below the shelf (should be false)', ch, u.pos(c)); }
{ // Bolt rides on Nut's head up the little fan, holding the crate, and jumps off her head toward the shelf
  const u = new Bot(def); const c = u.w.crates[0]; put(u, u.n, 9.2, 0.5, -4.25); put(u, u.b, 9.2, 1.6, -4.25); put(u, c, 10.9, 1.5, -4.25); u.idle(0.05);
  u.tick({ mx: 0.3 }, {}); u.run(0.6, () => ({ power: true })); const held = !!c.pulledBy;
  for (let i = 0; i < 40; i++) u.tick({ power: true }, { mx: 1 }); u.run(2.5, () => ({ power: true }), () => ({})); const on = u.b.ground === u.n; let ch = false, top = 0;
  for (let i = 0; i < 90; i++) { u.tick({ power: true, mx: 1, jump: i < 30 }, {}); ch = ch || !!u.w.channels[1]; top = Math.max(top, c.pos.y - 0.6); } u.idle(1.5); ch = ch || !!u.w.channels[1];
  console.log('boost off nut in the fan with the crate (should be false)', 'held', held, 'on head', on, 'plate', ch, 'crate bottom max', top.toFixed(2), u.st(), u.log); }
{ // Bolt boosts off Nut in the fan onto the shelf himself
  const u = new Bot(def); put(u, u.n, 13.0, 0.5, -4.25); put(u, u.b, 13.0, 1.6, -4.25); u.idle(2); const on = u.b.ground === u.n;
  for (let i = 0; i < 120; i++) u.tick({ mx: 1, jump: i < 30 }, {}); u.idle(1); console.log('boost onto the shelf from the fan (should zap or miss)', on, !!u.w.channels[1], u.log); }
{ // Nut launches Bolt at the shelf, and at the upstairs from the big fan base
  const u = new Bot(def); put(u, u.b, 16, 0.6, -1.6); put(u, u.n, 16, 0.5, -0.5); u.idle(0.3); u.tick({}, { power: true }); u.run(1.6, () => ({ mz: -1 })); u.idle(1); console.log('launch at the shelf (should be false)', !!u.w.channels[1], u.pos(u.b), u.log);
  const v = new Bot(def); put(v, v.b, 22.5, 0.6, -4); put(v, v.n, 21.4, 0.5, -4); v.idle(0.3); v.tick({}, { power: true }); v.run(1.6, () => ({ mx: 1 })); v.idle(1); console.log('launch at the upstairs (should be false)', up(v), v.pos(v.b), v.log); }
// ---- shortcut checks, puzzle 2 (both upstairs, crate fetched)
const upstairs = () => { const u = new Bot(def); put(u, u.b, 25, Y + 0.6, -3); put(u, u.n, 25, Y + 0.5, -7); put(u, u.w.crates[0], 26, Y + 0.6, -4.25); u.idle(0.5); return u; };
{ const u = upstairs(); u.go(1, 29.5, -4.25, 4, 0.2); u.idle(1.5); console.log('nut on the vent plate (should be false)', !!u.w.channels[2], u.pos(u.n)); }
{ const u = upstairs(); const c = u.w.crates[0]; put(u, c, 29.5, Y + 0.6, -4.25); u.idle(1.5); console.log('crate set down on the vent (should be false)', !!u.w.channels[2], u.pos(c)); }
{ const u = upstairs(); const c = holdCrate(u, 27.3, -4.25, 1, 0); put(u, c, 29.0, Y + 1, -4.25); put(u, u.b, 27.3, Y + 0.6, -4.25); u.idle(0.05); u.tick({ mx: 0.3 }, {}); u.run(0.8, () => ({ power: true })); const ch = !!u.w.channels[2];
  for (let i = 0; i < 300; i++) u.tick(u.steer(u.b, 38, -4.25), {}); console.log('bolt holds the plate, then runs for the gate (should be false)', ch, u.b.pos.x > 36, u.pos(u.b)); }
{ const u = upstairs(); put(u, u.b, 34.3, Y + 0.6, -4); put(u, u.n, 33.2, Y + 0.5, -4); u.idle(0.3); u.tick({}, { power: true }); u.run(1.6, () => ({ mx: 1 })); u.idle(1); console.log('launch over the gate (should be false)', u.b.pos.x > 36, u.pos(u.b)); }
// ---- lost crate: it falls out of the factory and comes back on its high shelf, where Bolt can pull it down again
{ const u = upstairs(); const c = u.w.crates[0]; put(u, c, 30, Y + 0.6, 1.5); u.idle(2); console.log('lost crate home', u.pos(c), u.log);
  put(u, u.b, 6, 0.6, -6.6); u.tick({ mz: -0.3 }, {}); u.run(1.5, () => ({ power: true })); console.log('re-fetched', !!c.pulledBy, u.pos(c)); }
// ---- golden cog: plain jump and boost miss
{ const u = upstairs(); put(u, u.b, 25, Y + 0.6, -6.6); u.idle(0.2); u.run(1, () => ({ jump: true })); console.log('cog by jump (should be false)', u.w.cogs[0].got); }
{ const u = upstairs(); put(u, u.n, 25, Y + 0.5, -6.6); put(u, u.b, 25, Y + 1.6, -6.6); u.idle(0.3); u.run(1.2, () => ({ jump: true })); console.log('cog by boost (should be false)', u.w.cogs[0].got); }
