import { Bot } from '/home/claude/games/bolt-and-nut/test/bot.mjs';
import def from '../src/lv/ot15.js';
const t = new Bot(def); const crate = t.w.crates[0];
// a jump from wherever the robot stands toward (x, z), steering all the way
// jump onto the partner's head, steering to stay over them
const mount = (u, who) => { const p = u.w.players[who], o = u.w.players[1 - who];
  for (let i = 0; i < 70; i++) { const s = u.steer(p, o.pos.x, o.pos.z); const inp = { ...s, jump: i < 20 }; u.tick(who === 0 ? inp : {}, who === 1 ? inp : {}); } u.idle(0.3); return p.ground === o; };
const hopTo = (u, who, x, z, sec = 1.2) => { const p = u.w.players[who];
  for (let i = 0; i < sec * 60; i++) { const s = u.steer(p, x, z); const inp = { ...s, jump: i < 30 }; u.tick(who === 0 ? inp : {}, who === 1 ? inp : {}); } u.idle(0.3); };
// 1. Corporate Ladder: crate beside the cabinet, Nut on the cabinet, Bolt climbs crate -> Nut -> ledge
t.go(0, 4.5, -3); t.grab(1, 0); t.goHold(9.9, -4.6); t.run(0.3, () => ({ power: true, mx: 0.3 })); t.run(0.6, () => ({ power: true })); t.idle(0.6); t.go(0, 9.5, -4.6, 3);
console.log('crate placed', t.pos(crate));
t.go(1, 12.2, -2.6); hopTo(t, 1, 13.4, -4.6); console.log('nut on cabinet', t.st());
t.go(0, 9.8, -4.6); hopTo(t, 0, 11.6, -4.6); console.log('bolt on crate', t.b.ground === crate, t.st());
console.log('bolt on nut', mount(t, 0), t.st());
hopTo(t, 0, 15, -4.6); console.log('bolt on ledge', t.st());
t.go(0, 15.2, -4.6); t.tick({ mx: -0.3 }, {}); t.pullNut(16.5, -4.6); t.both(16, -2.5, 16, -5); console.log('P1', t.st(), t.log);
// 2. Two Places at Once: fetch the crate, Nut holds the bridge, Bolt takes the crate to the gate plate, then reels Nut over
t.go(0, 14.6, -4.6); t.tick({ mx: -0.3 }, {}); t.run(2.5, () => ({ power: true })); console.log('crate fetched', !!crate.pulledBy, t.pos(crate));
// golden cog: crate on the bridge plate, both walk out on the bridge, Bolt boosts off Nut's head
t.go(1, 22, -1.5, 8, 0.25, { power: true }); t.goHold(18.5, -4.6); t.run(0.3, () => ({ power: true, mz: -0.3 })); t.run(0.6, () => ({ power: true })); t.idle(0.6); console.log('bridge', t.w.bridges[0].on);
t.go(1, 28, -3.2, 8, 0.1); t.go(0, 26, -3.2); t.idle(0.3); console.log('on nut', mount(t, 0)); for (let i = 0; i < 50; i++) t.tick({ jump: i < 30 }, {}); t.idle(0.8);
console.log('cog', t.w.cogs[0].got, t.st());
t.go(1, 21, -1.2); t.go(0, 18.5, -4.4); t.tick({ mz: -0.3 }, {}); t.run(1, () => ({ power: true })); t.goHold(22.5, -3.2); t.go(1, 18.5, -6.3, 8, 0.1, { power: true });
t.goHold(22, -3.2); t.goHold(32.8, -3.2); t.goHold(35, -4.6); t.run(0.3, () => ({ power: true, mz: -0.3 })); t.run(0.6, () => ({ power: true })); t.idle(0.6); t.go(0, 34, -3.5, 3); console.log('gate plate', t.w.channels[2], t.pos(crate), t.st());
t.go(1, 23.4, -3.2); t.go(0, 32.6, -3.2); t.tick({ mx: -0.3 }, {}); t.pullNut(33.5, -3.2); console.log('P2', t.st(), t.log);
t.both(46, -3, 46, -5); t.idle(1.5);
console.log('stats', JSON.stringify(t.w.stats));
console.log(t.st(), 'complete', t.w.complete, 'cog', t.w.cogs[0].got, 'falls', JSON.stringify(t.w.stats.falls), 'zaps', JSON.stringify(t.w.stats.zaps), JSON.stringify(t.log));

const put = (u, p, x, y, z) => { p.pos = { x, y, z }; p.prev = { ...p.pos }; };
const onLedge = u => u.b.pos.y > 3.5 && u.b.pos.x > 14;
// shortcut checks
{ // Bolt alone, crate next to the cabinet: crate -> cabinet -> jump at the ledge
  const u = new Bot(def); put(u, u.w.crates[0], 11.6, 0.6, -4.6); put(u, u.b, 11.6, 1.8, -4.6); u.idle(0.4);
  hopTo(u, 0, 13.4, -4.6, 1.0); const onCab = u.b.pos.y > 1.6; hopTo(u, 0, 15, -4.6); console.log('bolt alone via crate+cabinet (should be false)', onCab, onLedge(u)); }
{ // crate stacked on the cabinet: Bolt jumps off Nut's head to reach it, then the ledge
  const u = new Bot(def); put(u, u.w.crates[0], 13.4, 1.8, -4.6); put(u, u.n, 11.8, 0.5, -4.6); put(u, u.b, 9.5, 0.6, -4.6); u.idle(0.5);
  const onNut = mount(u, 0); hopTo(u, 0, 13.4, -4.6); hopTo(u, 0, 15, -4.6); console.log('stacked crate (should be false)', onNut, onLedge(u), u.st()); }
{ // Bolt boosts off Nut's head straight at the ledge
  const u = new Bot(def); put(u, u.n, 13.3, 0.5, -2.5); put(u, u.b, 11.5, 0.6, -2.5); u.idle(0.4); const onNut = mount(u, 0); hopTo(u, 0, 15, -2.5); console.log('plain boost (should be false)', onNut, onLedge(u)); }
{ // crate on the bridge plate, both cross, then Bolt tries to pull the crate over to the gate plate from the far edge
  const u = new Bot(def); put(u, u.w.crates[0], 18.5, Y0(), -6.3); put(u, u.b, 31.7, 3.8, -3.2); put(u, u.n, 33.5, 3.7, -4); u.idle(0.5);
  u.tick({ mx: -0.3 }, {}); u.run(2, () => ({ power: true })); console.log('pull crate off the far plate (should be false)', !!u.w.crates[0].pulledBy, u.w.bridges[0].on, u.st()); }
{ // running jump over the pit, and a jump off Nut's head
  const u = new Bot(def); put(u, u.b, 20, 3.8, -3.2); u.idle(0.3); for (let i = 0; i < 120; i++) u.tick({ mx: 1, jump: u.b.pos.x > 23.4 }, {}); console.log('jump the pit (should fall)', u.log);
  const v = new Bot(def); put(v, v.n, 23.3, 3.7, -3.2); put(v, v.b, 23.3, 4.8, -3.2); v.idle(0.5); for (let i = 0; i < 120; i++) v.tick({ mx: 1, jump: i < 30 }, {}); console.log('jump off head over the pit (should fall)', v.b.ground === null || v.log); }
{ // later mechanics: Nut's launch over the pit (plain and off her head) falls short
  const u = new Bot(def); put(u, u.b, 23.5, 3.8, -3.2); put(u, u.n, 22.4, 3.7, -3.2); u.idle(0.3); u.tick({}, { power: true }); u.run(2, () => ({ mx: 1 })); console.log('launch over pit (should fall)', u.log);
  const v = new Bot(def); put(v, v.n, 23.2, 3.7, -3.2); put(v, v.b, 23.2, 4.8, -3.2); v.idle(0.5); v.tick({}, { power: true }); v.run(2, () => ({ mx: 1 })); console.log('head launch over pit (should fall)', v.log);
  const w = new Bot(def); put(w, w.b, 13, 0.6, -2); put(w, w.n, 12, 0.5, -2); w.idle(0.3); w.tick({}, { power: true }); w.run(1.3, () => ({ mx: 1 })); w.idle(0.3); console.log('launch onto ledge (later mechanic, works: see caveat)', onLedge(w)); }
function Y0() { return 3.2 + 0.6; }
// golden cog: crate holds the bridge, Bolt boosts off Nut's head in the middle of the bridge
{ const u = new Bot(def); put(u, u.w.crates[0], 18.5, 3.8, -6.3); put(u, u.n, 26, 3.7, -3.2); put(u, u.b, 24.5, 3.8, -3.2); u.idle(0.5);
  u.go(1, 28, -3.2, 3, 0.1); u.idle(0.3); console.log('on nut', mount(u, 0), u.st());
  for (let i = 0; i < 50; i++) u.tick({ jump: i < 30 }, {}); u.idle(1); console.log('cog', u.w.cogs[0].got, u.log); }
{ const u = new Bot(def); put(u, u.w.crates[0], 18.5, 3.8, -6.3); put(u, u.b, 28, 3.8, -3.2); u.idle(0.4); for (let i = 0; i < 60; i++) u.tick({ jump: i < 30 }, {}); console.log('cog by plain jump on bridge (should be false)', u.w.cogs[0].got); }
