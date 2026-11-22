import { Bot } from './bot.mjs';
import def from '../src/lv/ot20.js';
const Y = 3.4;
const t = new Bot(def); const crate = t.w.crates[0], wood = t.w.crates[1];
let top = -99; t.run(3, () => { top = Math.max(top, crate.pos.y - 0.6); return {}; }); console.log('crate bounces to', top.toFixed(2));
// Question 1: Nut launches Bolt up into the hall, Bolt reels Nut up
t.launchBolt(15.2, -4, 1, 0, 0.3); console.log('bolt up', t.st(), t.log);
t.go(0, 17.2, -4); t.go(1, 14.5, -4); t.tick({ mx: -0.3 }, {}); t.pullNut(17.6, -4); console.log('nut up', t.st(), t.log);
t.go(1, 18.5, -7.2);
// Bolt holds X by the shaft until the crate bounces into range
t.go(0, 20, -6.5); t.go(0, 23, -6.5); t.go(0, 22.65, -4.25, 6, 0.1); t.tick({ mx: 0.3 }, {});
const ok = t.waitFor(u => !!crate.pulledBy, 6, { power: true }); console.log('snatched', ok, t.pos(crate));
t.run(1.5, () => ({ power: true })); console.log('crate up', t.pos(crate));
// golden cog: Bolt sets the crate down, hops onto it, and Nut launches him off it
t.go(1, 19, -1.0); t.goHold(25, -3.7); t.run(0.3, () => ({ power: true, mz: 0.3 })); t.run(0.3, () => ({ power: true })); t.idle(0.8); console.log('crate down', t.pos(crate));
t.go(0, crate.pos.x, crate.pos.z - 1.5, 6, 0.1); for (let i = 0; i < 50; i++) t.tick({ mz: i > 4 && t.b.pos.z < crate.pos.z ? 0.7 : 0, jump: i < 18 }, {}); t.idle(0.3); console.log('bolt on crate', t.b.ground === crate, t.pos(t.b));
t.go(1, 22.5, -0.6); t.go(1, crate.pos.x, -0.6, 6, 0.1); t.idle(0.2); t.tick({}, { power: true }); t.run(1.4, () => t.steer(t.b, 25, -2.4)); t.idle(0.6); console.log('cog', t.w.cogs[0].got, t.st(), t.log);
// the crate goes on the plate, round the back of the shaft
t.go(1, 26, -1); t.go(0, crate.pos.x + 1.7, crate.pos.z, 6, 0.1); t.tick({ mx: -0.3 }, {}); t.run(1, () => ({ power: true })); console.log('regrab', !!crate.pulledBy, t.pos(crate));
t.goHold(23.5, -7.2); t.goHold(19.5, -7.0); t.run(0.3, () => ({ power: true, mx: -0.3 })); t.run(0.4, () => ({ power: true })); t.idle(0.8); console.log('on plate', t.pos(crate), 'ch1', !!t.w.channels[1], t.log);
t.go(0, 24, -2); t.go(1, 24, -1.5); t.both(31, -2.5, 31, -4.5); console.log('Q1', t.st(), t.log, 'gate', t.w.gates[0].open, t.pos(crate), t.w.channels);
// Question 2: Nut hops onto the wooden crate; Bolt grabs the ring as it comes back
t.go(1, 34.2, -4, 6, 0.1); t.idle(0.2);
for (let i = 0; i < 70; i++) t.tick({}, { mx: t.n.pos.x < wood.pos.x - 0.1 ? 0.7 : 0, jump: i < 18 }); t.idle(0.3); console.log('nut on crate', t.n.ground === wood, t.pos(t.n), t.pos(wood), t.log);
t.go(0, 33.4, -4, 6, 0.1);
t.waitFor(u => { const a = u.w.anchors[0]; return a.dir === -1 && a.x < 34.3; }, 14);
for (let i = 0; i < 30; i++) t.tick({ jump: i < 12, power: i > 8 }, {}); t.run(0.3, () => ({ power: true })); console.log('ring', t.b.target && t.b.target.kind, t.st());
for (let i = 0; i < 60 * 16 && !(t.n.pos.x > 48.6); i++) t.tick({ power: true }, {}); console.log('nut nearly there', t.pos(t.n), t.pos(wood), t.log);
for (let i = 0; i < 50; i++) t.tick({ power: true }, { mx: 1, jump: i < 18 }); t.idle(0.1, { power: true });
console.log('nut hopped off', t.pos(t.n), t.log);
t.go(1, 53.6, -6.2, 6, 0.2, { power: true }); t.tick({ power: true }, { power: true }); t.idle(0.3, { power: true }); console.log('lasers off', !!t.w.channels[2], t.w.lasers[1].on, t.w.bridges[0].on);
// Bolt lets go of the ring over the causeway and walks off along the belt and over the bridge
t.idle(0.3); t.go(0, 52.5, -4, 10); console.log('bolt over', t.st(), t.log);
t.both(53.5, -2.5, 53.5, -5); console.log('Q2', t.st(), t.log);
t.both(61.5, -3, 61.5, -5); t.idle(1.5);
console.log('stats', JSON.stringify(t.w.stats));
console.log(t.st(), 'complete', t.w.complete, 'cog', t.w.cogs[0].got, 'falls', JSON.stringify(t.w.stats.falls), 'zaps', JSON.stringify(t.w.stats.zaps), JSON.stringify(t.log));

const put = (u, p, x, y, z) => { p.pos = { x, y, z }; p.prev = { ...p.pos }; };
// ---- shortcut checks, question 1
{ // Bolt alone, boosting is not enough to reach the hall
  const u = new Bot(def); put(u, u.n, 15.4, 0.5, -4); put(u, u.b, 15.4, 1.5, -4); u.idle(0.3); for (let i = 0; i < 90; i++) u.tick({ mx: 1, jump: i < 30 }, {}); u.idle(0.5); console.log('boost into the hall (should be false)', u.b.pos.y > Y, u.pos(u.b)); }
{ // Bolt tries to snatch the crate from the floor below: it is out of sight, and it can never come out through the wall
  const u = new Bot(def); const c = u.w.crates[0]; put(u, u.b, 15.4, 0.6, -4.25); u.idle(0.2); u.tick({ mx: 0.3 }, {}); let top = -99, held = false;
  for (let i = 0; i < 360; i++) { u.tick({ power: true }, {}); held = held || !!c.pulledBy; top = Math.max(top, c.pos.y); } u.idle(2); console.log('snatch from the floor (crate never leaves the shaft)', 'grabbed', held, 'highest', top.toFixed(2), u.pos(c)); }
{ // Bolt on the hall floor away from the shaft: out of range all the way round the bounce
  const u = new Bot(def); const c = u.w.crates[0]; put(u, u.b, 26, Y + 0.6, -4.25); u.idle(0.2); u.tick({ mx: -0.3 }, {}); let held = false;
  for (let i = 0; i < 300; i++) { u.tick({ power: true }, {}); held = held || !!c.pulledBy; } console.log('snatch from 4 m away (should be false)', held); }
{ // Nut on the plate, Bolt through the gate: the gate shuts on Nut as soon as she steps off
  const u = new Bot(def); put(u, u.n, 17.8, Y + 0.5, -6.6); put(u, u.b, 27, Y + 0.6, -4); u.idle(1.5); u.go(0, 31, -4, 4); const thru = u.b.pos.x > 30; u.go(1, 22, -2, 4); u.idle(1); console.log('one robot holds the plate (gate shuts after)', thru, u.w.gates[0].open.toFixed(2)); }
{ // a robot falling in the shaft is zapped out, not stuck bouncing
  const u = new Bot(def); put(u, u.n, 21.5, Y + 0.6, -4.25); u.idle(2); console.log('nut in the shaft is zapped back', u.log, u.pos(u.n)); }
// ---- shortcut checks, question 2 (both in the hall past the gate)
const hall = () => { const u = new Bot(def); u.w.checkpoints[0].hit = true; u.w.cp = { b: { x: 31, z: -2.5 }, n: { x: 31, z: -5 } }; put(u, u.b, 31, Y + 0.6, -2.5); put(u, u.n, 31, Y + 0.5, -5); u.idle(0.3); return u; };
{ const u = hall(); put(u, u.b, 33.8, Y + 0.6, -4); u.idle(0.1); u.waitFor(v => v.w.anchors[0].dir === 1 && v.w.anchors[0].x < 34.5, 14); for (let i = 0; i < 30; i++) u.tick({ jump: i < 12, power: i > 8 }, {});
  u.waitFor(v => v.w.anchors[0].x > 44.2, 10, { power: true }); u.idle(1.5); console.log('bolt rides the ring to its end and drops (should zap)', u.log); }
{ const u = hall(); put(u, u.b, 34.3, Y + 0.6, -4); put(u, u.n, 33.2, Y + 0.5, -4); u.idle(0.3); u.tick({}, { power: true }); u.run(2, () => ({ mx: 1 })); console.log('launch along the causeway (should zap)', u.log); }
{ const u = hall(); const w = u.w.crates[1]; put(u, u.b, 34.55, Y + 0.6, -4); u.idle(0.5); console.log('bolt reaches for the crate from the dry strip (should not move it)', u.pos(w), u.pos(u.b), u.log);
  for (let i = 0; i < 60; i++) u.tick({ mx: 1 }, {}); console.log('...and walks on (should zap)', u.log); }
{ const u = hall(); const w = u.w.crates[1]; u.go(0, 34.2, -4, 6, 0.1); for (let i = 0; i < 70; i++) u.tick({ mx: u.b.pos.x < w.pos.x - 0.1 ? 0.7 : 0, jump: i < 18 }, {}); u.idle(0.3); const on = u.b.ground === w;
  u.go(1, 34.3, -4, 4, 0.1); u.tick({}, { power: true }); u.run(2, () => ({ mx: 1 })); u.idle(1); console.log('bolt on the crate, nut launches him along (should zap)', on, u.log); }
{ // Bolt sweeps the crate without Nut aboard: it rides the belt into the gap and a new one appears at the start
  const u = hall(); const w = u.w.crates[1]; put(u, u.b, 33.8, Y + 0.6, -4); u.idle(0.1); u.waitFor(v => v.w.anchors[0].dir === -1 && v.w.anchors[0].x < 34.3, 14); for (let i = 0; i < 30; i++) u.tick({ jump: i < 12, power: i > 8 }, {});
  u.waitFor(v => v.log.some(l => l.includes('crate-lost')), 20, { power: true }); u.idle(0.5, { power: true }); console.log('empty crate swept away comes back', u.log, u.pos(w)); }
{ // Bolt kicks the crate the wrong way, back onto the dry floor: walking it back on sends it off down the causeway again
  const u = hall(); const w = u.w.crates[1]; put(u, w, 33.0, Y + 0.6, -4); put(u, u.b, 31.5, Y + 0.6, -4); u.idle(0.2); for (let i = 0; i < 60 && u.b.pos.x < 34.0; i++) u.tick({ mx: 1 }, {}); u.idle(8); console.log('crate walked back onto the oil stops inside the ring sweep, or rides the belt away', w.pos.x < 44 || w.pos.x > 44.6, u.pos(w), u.log); }
{ // the golden cog: a plain launch, and a boost, miss
  const u = hall(); put(u, u.b, 25, Y + 0.6, -2.4); put(u, u.n, 25, Y + 0.5, -1.2); u.idle(0.3); u.tick({}, { power: true }); u.run(1.4, () => u.steer(u.b, 25, -2.4)); console.log('cog by plain launch (should be false)', u.w.cogs[0].got);
  const v = hall(); put(v, v.n, 25, Y + 0.5, -2.4); put(v, v.b, 25, Y + 1.5, -2.4); v.idle(0.3); v.run(1.2, () => ({ jump: true })); console.log('cog by boost (should be false)', v.w.cogs[0].got); }
