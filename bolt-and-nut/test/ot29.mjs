import { Bot } from '/home/claude/games/bolt-and-nut/test/bot.mjs';
import def from '../src/lv/ot29.js';
const T = 12.4, S = 2.0;
const t = new Bot(def);
const crate = t.w.crates[0];
// 1. Top Shelf: Nut launches Bolt by the fence; on the way up he faces the shelf and holds X to grab the crate
t.go(0, 12.6, -2.6, 8); t.go(1, 12.6, -1.5, 8, 0.15); t.tick({ mx: 0.3 }, {}); t.idle(0.2);
t.tick({}, { power: true });
for (let i = 0; i < 140; i++) t.tick({ power: i > 15 }, {});
console.log('grabbed', t.b.target && t.b.target.kind, t.st(), t.pos(crate), t.log);
t.carry(crate, 10, -6.3, -1, 0); t.idle(0.4);
console.log('plate 1', t.w.plates[0].pressed, 'laser', t.w.lasers[0].on, t.pos(crate));
t.go(0, 12, -2.5, 3); t.both(17, -2, 17, -4); console.log('P1', t.st(), t.log);
// 2. Out Tray: Bolt reels the crate back through the fence and sets it down; Nut throws it onto the tray
t.go(0, 16, -6.3, 3); t.tick({ mx: -0.3 }, {}); t.grab(-1, 0, 1.6); console.log('regrab', t.b.target && t.b.target.kind, t.pos(crate));
t.goHold(17, -3.2); t.goHold(22, -3.2); t.carry(crate, 24.8, -6.3, 1, 0); t.idle(0.3); console.log('crate down', t.pos(crate), 'laser', t.w.lasers[0].on);
t.go(0, 21, -1.5, 4); t.go(1, crate.pos.x - 1.6, -3, 6); t.go(1, crate.pos.x - 1.0, crate.pos.z, 6, 0.1); t.idle(0.2); t.tick({}, { power: true }); t.idle(1.5);
console.log('tray', t.w.plates[1].pressed, t.pos(crate), 'gate', t.w.gates[0].open);
// golden cog: Nut launches Bolt straight up beside it
t.both(23.5, -6.9, 23.5, -5.8); t.idle(0.2); t.tick({}, { power: true }); t.run(1.4, () => t.steer(t.b, 23.5, -7)); t.idle(0.5); console.log('cog', t.w.cogs[0].got, t.st());
t.both(25, -2, 25, -3.5); t.both(37, -2, 37, -3.5); t.both(40, -3, 40, -5); t.idle(1.5);
console.log('stats', JSON.stringify(t.w.stats));
console.log(t.st(), 'complete', t.w.complete, 'cog', t.w.cogs[0].got, 'falls', JSON.stringify(t.w.stats.falls), 'zaps', JSON.stringify(t.w.stats.zaps), JSON.stringify(t.log));

const put = (u, p, x, y, z) => { p.pos = { x, y, z }; p.prev = { ...p.pos }; };
const grabbed = u => !!(u.b.target && u.b.target.kind === 'crate');
// ---- shortcut checks: the crate is out of reach without a launch
{ const u = new Bot(def); put(u, u.b, 13.6, 0.6, -5.5); put(u, u.n, 3, 0.5, -3); u.idle(0.3); u.tick({ mx: 0.3 }, {}); for (let i = 0; i < 90; i++) u.tick({ jump: i < 30, power: i > 5 }, {}); console.log('crate by a jump (should be false)', grabbed(u)); }
{ const u = new Bot(def); put(u, u.n, 13.5, 0.5, -5.5); put(u, u.b, 12.2, 0.6, -5.5); u.idle(0.3); for (let i = 0; i < 70; i++) u.tick({ ...u.steer(u.b, u.n.pos.x, u.n.pos.z), jump: i < 18 }, {}); const on = u.b.ground === u.n; u.tick({ mx: 0.3 }, {}); let m = 0, dmin = 99; const c = u.w.crates[0]; for (let i = 0; i < 90; i++) { u.tick({ jump: i < 30, power: i > 5 }, {}); m = Math.max(m, u.b.pos.y - 0.55); dmin = Math.min(dmin, Math.hypot(c.pos.x - u.b.pos.x, c.pos.y - u.b.pos.y, c.pos.z - u.b.pos.z)); } console.log('crate by a boost (should be false)', on, grabbed(u), 'feet max', m.toFixed(2), 'closest', dmin.toFixed(2)); }
{ const u = new Bot(def); put(u, u.b, 13.6, 0.6, -5.5); put(u, u.n, 3, 0.5, -3); u.idle(0.3); u.tick({ mx: 0.3 }, {}); u.run(2, () => ({ power: true })); console.log('crate from the floor (should be false)', grabbed(u)); }
// Bolt alone cannot lift the crate onto the tray by jumping with it
{ const u = new Bot(def); const c = u.w.crates[0]; put(u, u.b, 24.5, 0.6, -6.3); put(u, c, 26.2, 0.6, -6.3); put(u, u.n, 18, 0.5, -2); u.idle(0.3); u.tick({ mx: 0.3 }, {}); u.run(1, () => ({ power: true })); for (let i = 0; i < 80; i++) u.tick({ power: i < 40, jump: i < 30, mx: i < 40 ? 0.25 : 0 }, {}); u.idle(1); console.log('bolt jumps the crate onto the tray (should be false)', u.w.plates[1].pressed, u.pos(c)); }
// nobody stands on the tray
{ const u = new Bot(def); put(u, u.n, 26, 0.5, -6.3); put(u, u.b, 26, 1.5, -6.3); u.idle(0.4); for (let i = 0; i < 90; i++) u.tick({ mx: 1, jump: i < 30 }, {}); u.idle(0.5); console.log('bolt boosts onto the tray (should zap)', JSON.stringify(u.w.stats.zaps), u.w.plates[1].pressed); }
// the cog misses with a boost
{ const u = new Bot(def); put(u, u.n, 23.5, 0.5, -7); put(u, u.b, 23.5, 1.5, -7); u.idle(0.4); for (let i = 0; i < 90; i++) u.tick({ ...u.steer(u.b, 23.5, -7), jump: i < 30 }, {}); u.idle(0.5); console.log('cog by a boost (should be false)', u.w.cogs[0].got); }
