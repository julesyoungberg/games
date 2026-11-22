import { Bot } from '/home/claude/games/bolt-and-nut/test/bot.mjs';
import def from '../src/lv/ot16.js';
const t = new Bot(def); const crate = t.w.crates[0];
const mount = (u, who) => { const p = u.w.players[who], o = u.w.players[1 - who];
  for (let i = 0; i < 70; i++) { const s = u.steer(p, o.pos.x, o.pos.z); const inp = { ...s, jump: i < 20 }; u.tick(who === 0 ? inp : {}, who === 1 ? inp : {}); } u.idle(0.3); return p.ground === o; };
// drop the held crate at (x, z): Bolt stands 1.7 m short of it, facing (fx, fz)
const drop = (u, x, z, fx, fz) => { u.goHold(x - fx * 1.7, z - fz * 1.7); u.run(0.3, () => ({ power: true, mx: fx * 0.3, mz: fz * 0.3 })); u.run(0.6, () => ({ power: true })); u.idle(0.6); };
// golden cog: Bolt stands on Nut's head and Nut launches him straight up
t.go(1, 10.5, -2, 8, 0.1); t.go(0, 8.8, -2); console.log('on nut', mount(t, 0), t.st());
t.tick({}, { power: true }); t.run(1.4, () => t.steer(t.b, 10.5, -2)); t.idle(0.5); console.log('cog', t.w.cogs[0].got, t.st());
// 1. Crate Put: Bolt pulls the crate off the shelf, Nut throws it through the laser onto the plate
t.go(0, 6.5, -6.5); t.go(1, 3, -4); t.tick({ mz: -0.3 }, {}); t.run(1.5, () => ({ power: true })); console.log('crate down', !!crate.pulledBy, t.pos(crate));
drop(t, 12.8, -4.5, 1, 0); console.log('crate placed', t.pos(crate)); t.go(0, 10, -1.5);
t.go(1, 11.6, -4.5, 8, 0.1); t.idle(0.2); t.tick({}, { power: true }); t.idle(2);
console.log('crate put', t.pos(crate), 'ch1', t.w.channels[1], 'laser on', t.w.lasers[0].on);
t.both(16.5, -2, 16.5, -6.5); console.log('P1', t.st(), t.log);
// 2. High Jump: crate back to the lift plate, both ride the lift, Nut launches Bolt off it, Bolt pulls Nut up
t.go(0, 21, -4.5); t.tick({ mx: -0.3 }, {}); t.run(1.2, () => ({ power: true })); console.log('crate back', !!crate.pulledBy, t.pos(crate));
drop(t, 27.3, -2.2, 1, 0); console.log('crate on lift', t.pos(crate));
t.go(0, 26.3, -6, 8, 0.15); t.go(1, 28.5, -2.2, 8, 0.1); t.idle(0.2); t.tick({}, { power: true }); t.idle(2.5);
console.log('lift plate', t.w.channels[2], t.pos(crate), 'lift up', t.st());
t.go(0, 28.3, -4); t.go(1, 27.1, -4); t.idle(0.2);
t.tick({}, { power: true }); t.run(1.4, () => ({ mx: 1 })); t.idle(0.4); console.log('bolt up', t.st());
t.go(0, 30.3, -4); t.tick({ mx: -0.3 }, {}); t.pullNut(31.5, -4); console.log('P2', t.st(), t.log);
t.both(42.5, -3, 42.5, -5); t.idle(1.5);
console.log('stats', JSON.stringify(t.w.stats));
console.log(t.st(), 'complete', t.w.complete, 'cog', t.w.cogs[0].got, 'falls', JSON.stringify(t.w.stats.falls), 'zaps', JSON.stringify(t.w.stats.zaps), JSON.stringify(t.log));

const put = (u, p, x, y, z) => { p.pos = { x, y, z }; p.prev = { ...p.pos }; };
const up = u => u.b.pos.y > Y + 0.3 && u.b.pos.x > 29;
const Y = 6.8;
// shortcut checks
{ // Nut alone tries to push the crate off the shelf from below
  const u = new Bot(def); put(u, u.n, 6.5, 0.5, -7.5); u.idle(0.3); u.tick({}, { power: true }); u.idle(1); put(u, u.n, 4.4, 0.5, -7.5); u.idle(0.3); u.tick({}, { power: true }); u.idle(1);
  console.log('nut pushes shelf crate (should stay put)', u.pos(u.w.crates[0])); }
{ // Bolt carries the crate to the laser and lets go: lands short of the plate
  const u = new Bot(def); put(u, u.w.crates[0], 11, 0.6, -4.5); put(u, u.b, 9, 0.6, -4.5); u.idle(0.3); u.tick({ mx: 0.3 }, {}); u.run(1, () => ({ power: true }));
  u.goHold(13.5, -4.5); u.run(0.2, () => ({ power: true, mx: 0.3 })); u.run(0.5, () => ({ power: true })); u.idle(1); console.log('bolt carries crate to plate (should be false)', u.w.channels[1] || false, u.pos(u.w.crates[0]), u.log); }
{ // Nut launches Bolt over the laser
  const u = new Bot(def); put(u, u.b, 13, 0.6, -4.5); put(u, u.n, 11.9, 0.5, -4.5); u.idle(0.3); u.tick({}, { power: true }); u.run(1.5, () => ({ mx: 1 })); console.log('launch over laser (should zap)', u.log); }
{ // lift without the crate: Nut holds the plate, Bolt rides up and jumps
  const u = new Bot(def); put(u, u.n, 22, 0.5, -2.5); put(u, u.b, 27.8, 0.7, -4); u.idle(2.5);
  for (let i = 0; i < 80; i++) u.tick({ mx: 1, jump: i < 30 }, {}); u.idle(0.5); console.log('bolt jumps off lift (should be false)', up(u), u.st()); }
{ // head-launch from the floor next to the ledge
  const u = new Bot(def); put(u, u.n, 27.8, 0.5, -4); put(u, u.b, 27.8, 1.6, -4); u.idle(0.5); const on = u.b.ground === u.n; u.tick({}, { power: true }); u.run(1.4, () => ({ mx: 1 })); u.idle(0.5); console.log('head launch from floor (should be false)', on, up(u), u.st()); }
{ // crate on the lift as a step, Nut holds the plate, Bolt jumps off the crate at the top
  const u = new Bot(def); put(u, u.w.crates[0], 27.2, 0.7, -4); put(u, u.n, 22, 0.5, -2.5); put(u, u.b, 27.2, 2.0, -4); u.idle(2.5);
  for (let i = 0; i < 80; i++) u.tick({ mx: 1, jump: i < 30 }, {}); u.idle(0.5); console.log('crate step on lift (should be false)', up(u), u.st()); }
{ // Bolt on the lift tries to hold the crate over the plate himself
  const u = new Bot(def); put(u, u.w.crates[0], 24.5, 0.6, -2.5); put(u, u.b, 26.2, 0.7, -2.5); u.idle(0.3); u.tick({ mx: -0.3 }, {}); u.run(1.5, () => ({ power: true })); console.log('held crate presses lift plate (should be false)', !!u.w.crates[0].pulledBy, u.w.channels[2] || false, u.pos(u.w.crates[0])); }
{ // golden cog with a plain launch (should be false)
  const u = new Bot(def); put(u, u.b, 10.5, 0.6, -2); put(u, u.n, 10.5, 0.5, -0.9); u.idle(0.3); u.tick({}, { power: true }); u.run(1.4, () => u.steer(u.b, 10.5, -2)); console.log('cog by plain launch (should be false)', u.w.cogs[0].got); }
