import { Bot } from './bot.mjs';
import level from '../src/lv/s17.js';
const t = new Bot(level); const c = t.w.crates; const A = t.w.anchors;
// careful walking on oil: aim for a speed we can still brake from (oil grip is about 7 m/s^2)
const ease = (p, x, z) => { const dx = x - p.pos.x, dz = z - p.pos.z, d = Math.hypot(dx, dz); if (d < 0.05) return { mx: -p.vel.x / 6.5, mz: -p.vel.z / 6.5 }; const v = Math.min(6.5, Math.sqrt(2 * 5 * d)); return { mx: dx / d * v / 6.5, mz: dz / d * v / 6.5 }; };
const slide = (who, x, z, sec = 8) => { const p = t.w.players[who]; for (let i = 0; i < sec * 60; i++) { if (Math.hypot(p.pos.x - x, p.pos.z - z) < 0.25 && Math.hypot(p.vel.x, p.vel.z) < 0.5) return true; const inp = ease(p, x, z); t.tick(who === 0 ? inp : {}, who === 1 ? inp : {}); } return false; };
const press = () => { t.tick({}, { power: true }); t.idle(0.3); };
// 1. Rink Practice
t.go(1, 4, -1.5); t.idle(0.5); console.log('pen', t.w.channels[1]);
t.go(0, 3, -6.5); t.idle(0.5);
for (let i = 0; i < 300 && t.b.pos.x < 7.9; i++) t.tick({ mx: 1 }, {});
t.idle(3); console.log('crate1', t.pos(c[0]), 'ch2', t.w.channels[2], t.st());
t.idle(1); t.both(16, -2.5, 15, -1); t.both(21, -2, 21, -4.5); console.log('P1', t.st(), t.log);
// 2. Curling (cog first: Nut launches Bolt onto the shelf)
t.go(1, 18.4, -4.0); t.go(0, 18.4, -5.9, 6, 0.15); t.idle(0.3); t.tick({}, { power: true });
t.run(1.4, b => b.steer(b.b, 18.4, -7.4)); t.idle(0.5); console.log('cog', t.w.cogs[0].got, t.st());
t.run(0.5, () => ({ mz: 1 })); t.idle(0.6); console.log('down', t.st());
t.go(1, 23, -1); t.go(0, 23, -4.5); t.tick({ mx: -0.3 }, {}); t.grab(-1, 0, 1.5); console.log('grab', !!c[1].pulledBy, t.pos(c[1]));
t.carry(c[1], 23.2, -6.3, 1, 0); console.log('placed', t.pos(c[1]), t.st());
t.go(0, 19, -2); t.go(1, 22, -6.3, 6, 0.1); t.tick({ mx: 0.3 }, {}); t.idle(0.2); press();
t.idle(4); console.log('curl', t.pos(c[1]), 'ch3', t.w.channels[3], t.w.lasers[0].on);
t.both(35, -2.5, 35, -4); t.both(39, -3, 39, -5.5); console.log('P2', t.st(), t.log);
// 3. Grease Island
const post = (who, hx, hz, sec = 6) => { const p = t.w.players[who]; let went = false;
  for (let i = 0; i < sec * 60 && !went; i++) { const ox = p.pos.x; const inp = t.steer(p, hx, hz); t.tick(who === 0 ? inp : {}, who === 1 ? inp : {}); went = Math.abs(p.pos.x - ox) > 1.5; }
  return went; };
t.go(1, 41.5, -6.5); console.log('tube', post(1, 43.5, -6.5));
t.idle(2.5); console.log('island', t.st());
t.go(1, 52.5, -6.5, 4); press(); console.log('sw', t.w.switches[0].on, t.w.bridges[0].on);
t.go(0, 44, -1.5); t.go(0, 52.5, -2.5); t.tick({ mz: -0.3 }, {}); t.pullNut(57, -1.5, 4); console.log('pulled', t.st());
t.both(60, -3, 60, -5.5); console.log('P3', t.st(), t.log);
// 4. Ski Jump
t.launchBolt(63, -3, 1, 0, 0.8); console.log('up', t.st(), t.log.slice(-1));
t.go(0, 65, -3); t.go(1, 62, -3); t.tick({ mx: -0.3 }, {}); t.pullNut(66.5, -2, 3); console.log('nut up', t.st());
t.go(1, 65.5, -1); t.go(0, 64.6, -6.5, 6, 0.1); t.idle(0.3);
for (let i = 0; i < 200 && t.b.pos.x < 68.2; i++) t.tick({ mx: 1 }, {});
t.idle(3); console.log('ski', t.pos(c[2]), 'ch5', t.w.channels[5], t.st(), t.log.slice(-2));
t.go(0, 70, -1.5); t.both(76, -1.5, 75, -1.5); t.both(80, -3, 80, -5.5); console.log('P4', t.st(), t.log.slice(-2));
// 5. Rush Hour
t.launchBolt(85.4, -4, 1, 0, 0.9); t.idle(2); console.log('over belt', t.st(), t.log.slice(-1));
slide(0, 91.5, -4); t.go(1, 84.5, -4); t.tick({ mx: -0.3 }, {}); t.pullNut(93, -3, 3); console.log('nut over', t.st(), t.log.slice(-1));
slide(1, 92, -6); slide(0, 95.5, -4); t.idle(1); t.tick({ mx: 0.3 }, {}); t.run(1.2, () => ({ power: true })); console.log('ring', t.b.hang, t.st());
t.run(0.3, () => ({ power: true, mx: 1 })); t.run(1.2, () => ({ mx: 1, jump: true })); t.idle(1); console.log('hop', t.st(), t.log.slice(-1));
t.go(0, 101.3, -4); t.tick({ mx: -0.3 }, {}); t.pullNut(103, -4, 3); console.log('P5', t.st(), t.log.slice(-2));
t.both(104.5, -3, 104.5, -5); t.idle(1.5);
// golden cog checks: a boost off Nut's head falls short of the shelf, a jump from the belt cannot climb onto the high oil
{ const u = new Bot(level); u.n.pos = { x: 18.4, y: 0.5, z: -6.2 }; u.b.pos = { x: 18.4, y: 1.6, z: -6.2 }; u.b.prev = { ...u.b.pos }; u.n.prev = { ...u.n.pos }; u.idle(0.5);
  const onNut = u.b.ground === u.n; for (let i = 0; i < 70; i++) u.tick({ mz: -1, jump: i < 30 }, {}); u.idle(1); console.log('cog by boost (should be false)', onNut, u.w.cogs[0].got, u.pos(u.b)); }
{ const u = new Bot(level); u.b.pos = { x: 88.5, y: 3.6, z: -4 }; u.b.prev = { ...u.b.pos }; u.n.pos = { x: 80, y: 3.5, z: -4 }; u.n.prev = { ...u.n.pos };
  u.run(0.6, () => ({ mx: 1, jump: true })); u.idle(2); console.log('belt hop onto oil (should be false)', u.b.pos.y > 4.5); }
console.log('cog', t.w.cogs[0].got, 'stats', JSON.stringify(t.w.stats));
console.log(t.st(), 'complete', t.w.complete, t.log);
