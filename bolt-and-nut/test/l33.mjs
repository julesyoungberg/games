import { Bot } from './bot.mjs';
import level from '../src/lv/s33.js';
const t = new Bot(level); const c = t.w.crates; const L = t.w.lasers; const Y = 5;
// 1. Muster point: Nut on the plate, Bolt rides the fan, then reels Nut up
t.go(1, 8, -6.3); t.idle(0.3); console.log('fan', t.w.fans[0].on);
t.go(0, 15.5, -4, 8); t.idle(2); console.log('peak', t.st(), 'cog', t.w.cogs[0].got);
t.run(1.2, () => ({ mx: 1 })); t.go(0, 18.5, -4); t.idle(0.5); console.log('bolt up', t.st());
t.go(1, 12, -4); t.idle(0.3); console.log('fan off', t.w.fans[0].on);
t.go(0, 17.6, -4, 3, 0.15); t.pullNut(19.5, -4); console.log('nut up', t.st(), t.log);
t.both(18.5, -2.5, 18.5, -5);
t.go(0, 21, -6.5); t.go(1, 21, -5.3); t.idle(0.3); t.tick({}, { power: true }); t.run(2, () => ({ mz: -1 })); t.idle(0.5); console.log("cog launch", t.w.cogs[0].got, t.st());
// 2. Stairwell laser, then rings
t.both(22.5, -3, 22.5, -5);
t.waitFor(u => L[0].on, 5); t.waitFor(u => !L[0].on, 5); t.run(0.9, () => ({ mx: 1 }), () => ({ mx: 1 }));
t.both(29.5, -4, 27, -5); console.log('past alarm', t.st(), t.log);
t.go(0, 29.5, -4); t.grab(1, 0, 1.2); t.tick({ mx: 1 }, {}); t.tick({ mx: 1 }, {}); t.grab(1, 0, 1.2); t.idle(1); console.log('rings', t.st());
t.go(0, 39.5, -4); t.go(1, 29.6, -4); t.pullNut(41, -3); console.log('over', t.st(), t.log);
// 3. Fire door
t.go(1, 40.5, -1.5); t.go(0, 41, -6);
t.waitFor(u => c[0].pos.z > -5 && c[0].pos.z < -3.5, 10); t.grab(1, 0.2, 0.6); console.log('caught', !!c[0].pulledBy, t.pos(c[0]));
t.goHold(46.5, -2.5); t.goHold(48, -3.5);
t.waitFor(u => L[1].on, 5, { power: true }); t.waitFor(u => !L[1].on, 5, { power: true });
t.goHold(51.5, -4.5, 2); console.log('past laser with crate', !!c[0].pulledBy, t.st(), t.log);
t.carry(c[0], 53.5, -7, 1, 0); t.go(0, 51.8, -3.5); console.log('plate', t.pos(c[0]), t.w.channels[3]);
t.idle(1);
t.waitFor(u => L[1].on, 5); t.waitFor(u => !L[1].on, 5); t.go(1, 51.5, -2, 3);
t.both(59, -3, 59, -5); t.idle(1.5); t.both(62, -3, 62, -5); t.idle(1.5);
// ---- shortcut checks
const put = (p, x, y, z) => { p.pos = { x, y, z }; p.prev = { ...p.pos }; p.vel = { x: 0, y: 0, z: 0 }; };
{ const u = new Bot(level); put(u.b, 13, 0.56, -4); put(u.n, 12, 0.46, -4); u.idle(0.3); u.tick({}, { power: true }); u.run(2.5, () => ({ mx: 1 })); console.log('Muster: launch to the ledge without the fan (up should be false)', u.b.pos.y > Y); }
{ const u = new Bot(level); put(u.n, 13.3, 0.46, -4); put(u.b, 12, 0.56, -4); u.idle(0.3); for (let i = 0; i < 70; i++) u.tick({ jump: i < 15, ...u.steer(u.b, u.n.pos.x, u.n.pos.z) }, {}); u.run(1.5, () => ({ jump: true, mx: 1 })); console.log('Muster: boost off Nut (up should be false)', u.b.pos.y > Y); }
console.log('cog', t.w.cogs[0].got);
console.log(t.st(), 'complete', t.w.complete, t.log);
