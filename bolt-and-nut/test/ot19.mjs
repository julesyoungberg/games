import { Bot } from './bot.mjs';
import def from '../src/lv/ot19.js';
const t = new Bot(def); const hat = t.w.crates[0];
// golden cog: Bolt jumps onto the hat rack, Nut launches him off it
t.go(0, 5.2, -4.2, 8, 0.1); for (let i = 0; i < 50; i++) t.tick({ mz: t.b.pos.z > -6.1 ? -0.6 : 0, jump: i < 18 }, {}); t.idle(0.3); console.log('bolt on rack', t.pos(t.b));
t.go(1, 5.2, -4.4, 8, 0.1); t.idle(0.2); t.tick({}, { power: true }); t.run(1.4, () => t.steer(t.b, 5.2, -6.2)); t.idle(0.6); console.log('cog', t.w.cogs[0].got, t.st(), t.log);
// Hat Trick: Bolt stands in front of the rack, Nut climbs it behind the crate and walks it onto his head
t.go(0, 9.5, -2.5); t.go(1, 3.5, -6.5, 6, 0.1); for (let i = 0; i < 60; i++) t.tick({}, { mx: t.n.pos.x < 5.2 ? 0.8 : 0, jump: i < 18 }); t.idle(0.3);
t.go(1, 5.3, -7.2, 4, 0.1); t.go(1, hat.pos.x, -7.2, 4, 0.1); t.go(0, hat.pos.x, -4.45, 6, 0.1); t.idle(0.2); console.log('nut on rack', t.pos(t.n), t.pos(hat), t.pos(t.b));
for (let i = 0; i < 90 && hat.pos.z < t.b.pos.z - 0.05; i++) t.tick({}, { mz: 0.5 }); t.idle(0.5); console.log('hat on', hat.ground === t.b, t.pos(hat), t.st());
t.go(1, 4.5, -7.4); t.go(1, 4, -3);
// Bolt walks to the pit edge and rides the ring over
t.go(0, 12.8, -4, 8); console.log('hat kept', hat.ground === t.b, t.pos(hat));
t.waitFor(u => { const a = u.w.anchors[0]; return a.dir === 1 && a.x > 15.6 && a.x < 16.6; }, 12);
t.tick({ mx: 0.3 }, {}); t.run(0.6, () => ({ power: true })); console.log('grabbed', !!t.b.target, t.st());
t.waitFor(u => u.w.anchors[0].x > 23.8, 10, { power: true }); t.idle(0.8); console.log('across', t.st(), 'hat', hat.ground === t.b, t.pos(hat), t.log);
// Bolt reels Nut over the pit, facing her the whole time, and lets go before turning round (or she knocks the hat off)
t.go(1, 13.55, -4, 8, 0.1); t.go(0, 24.2, -4, 8, 0.1); t.tick({ mx: -0.3 }, {}); t.run(0.3, () => ({ power: true })); console.log('pulling', t.b.target && t.b.target.kind); t.run(1.9, () => ({ power: true })); t.idle(0.6); console.log('nut over', hat.ground === t.b, t.st(), t.log);
t.go(1, 25, -6.5);
// the doorway knocks the hat off onto the plate
t.go(0, 32.5, -4, 6); t.idle(0.5); console.log('hat off', t.pos(hat), 'ch1', !!t.w.channels[1], t.st());
t.go(1, 29.4, -6.6, 6); t.go(1, 32, -6.6, 6); t.both(37, -2.5, 37, -5); console.log('P1', t.st(), t.log);
t.both(40.5, -3, 40.5, -5); t.idle(1.5);
console.log('stats', JSON.stringify(t.w.stats));
console.log(t.st(), 'complete', t.w.complete, 'cog', t.w.cogs[0].got, 'falls', JSON.stringify(t.w.stats.falls), 'zaps', JSON.stringify(t.w.stats.zaps), JSON.stringify(t.log));

const put = (u, p, x, y, z) => { p.pos = { x, y, z }; p.prev = { ...p.pos }; };
// ---- shortcut checks
{ // Nut launches Bolt at the pit
  const u = new Bot(def); put(u, u.b, 13.4, 0.6, -4); put(u, u.n, 12.3, 0.5, -4); u.idle(0.3); u.tick({}, { power: true }); u.run(2.5, () => ({ mx: 1 })); console.log('launch over the pit (should fall)', u.b.pos.x > 22 && u.b.pos.y > 0, u.log); }
{ // Bolt alone shoves the hat off the rack: it just lands on the floor. Knocked into the pit, it comes back to the rack
  const u = new Bot(def); const h = u.w.crates[0]; put(u, u.b, 6.8, 1.7, -7.2); u.idle(0.3); for (let i = 0; i < 90 && h.pos.y > 1.2; i++) u.tick({ mz: 0.5 }, {}); u.idle(0.6); console.log('bolt shoves the hat off alone (lands on floor)', u.pos(h), h.ground && h.ground.style);
  put(u, h, 15.2, 0.6, -4); u.idle(3); console.log('hat lost in the pit comes back to the rack', u.pos(h), u.log); }
{ // without the hat: Nut holds the plate, Bolt goes through, and the gate shuts behind him when she steps off
  const u = new Bot(def); put(u, u.n, 29.4, 0.4, -4); put(u, u.b, 32, 0.6, -4); u.idle(1.5); u.go(0, 36.5, -4, 4); const thru = u.b.pos.x > 35; u.go(1, 26, -4, 4); u.idle(1); console.log('one holds the plate (gate shuts after)', thru, u.w.gates[0].open.toFixed(2)); }
{ // launch over the gate, or onto the doorway
  const u = new Bot(def); put(u, u.b, 33.2, 0.6, -4); put(u, u.n, 32.1, 0.5, -4); u.idle(0.3); u.tick({}, { power: true }); u.run(2, () => ({ mx: 1 })); console.log('launch over the gate (should be false)', u.b.pos.x > 35, u.pos(u.b));
  const v = new Bot(def); put(v, v.b, 28.8, 0.6, -4); put(v, v.n, 27.7, 0.5, -4); v.idle(0.3); v.tick({}, { power: true }); v.run(2, () => ({ mx: 1 })); console.log('launch onto the doorway (should be false)', v.b.pos.y > 2, v.pos(v.b)); }
{ // the other way round: Bolt walks the hat onto Nut's head, rides the ring alone, and reels the hatted Nut over
  const u = new Bot(def); const h = u.w.crates[0]; put(u, u.n, 6.8, 0.5, -4.5); put(u, u.b, 6.8, 1.7, -7.2); u.idle(0.3); for (let i = 0; i < 90 && h.ground !== u.n; i++) u.tick({ mz: 0.4 }, {}); u.idle(0.5); const on = h.ground === u.n;
  u.go(1, 13.55, -4, 8, 0.1); put(u, u.b, 24.2, 0.6, -4); u.idle(0.2); u.tick({ mx: -0.3 }, {}); u.run(2.2, () => ({ power: true })); u.idle(0.6); console.log('nut wears the hat over the pit', on, h.ground === u.n, u.pos(h), u.st()); }
// ---- golden cog: plain launch and boost miss
{ const u = new Bot(def); put(u, u.b, 5.2, 0.6, -4.2); put(u, u.n, 5.2, 0.5, -3.0); u.idle(0.3); u.tick({}, { power: true }); u.run(1.4, () => u.steer(u.b, 5.2, -6.2)); console.log('cog by a launch from the floor (should be false)', u.w.cogs[0].got); }
{ const u = new Bot(def); put(u, u.n, 5.2, 1.6, -6.2); put(u, u.b, 5.2, 2.7, -6.2); u.idle(0.3); u.run(1.2, () => ({ jump: true })); console.log('cog by a boost on the rack (should be false)', u.w.cogs[0].got); }
