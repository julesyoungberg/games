import { Bot } from './bot.mjs';
import def from '../src/lv/ot12.js';
const t = new Bot(def);
// walk onto a tube hatch until posted
const post = (u, who, x, z, sec = 6) => { const p = u.w.players[who]; for (let i = 0; i < sec * 60; i++) { const ox = p.pos.x; const s = u.steer(p, x, z); u.tick(who === 0 ? s : {}, who === 1 ? s : {}); if (Math.abs(p.pos.x - ox) > 1.5) return true; } return false; };
// 1. Nut holds the bottom plate, Bolt takes the tube and floats up the shaft
t.go(1, 12.5, -6.3, 8, 0.15);
console.log('fan on', t.w.fans[0].on);
console.log('bolt posted', post(t, 0, 9.5, -2.2), t.st());
for (let i = 0; i < 300 && !(t.b.grounded && t.b.pos.y > 6); i++) t.tick(t.b.pos.y > 7 ? { mx: 1 } : {}, {});
console.log('bolt up', t.st(), t.log);
t.go(0, 21.5, -6.3, 8, 0.15); t.idle(0.3); console.log('top plate', t.w.channels[1]);
t.go(1, 11, -3);
console.log('nut posted', post(t, 1, 9.5, -2.2), t.st());
for (let i = 0; i < 300 && !(t.n.grounded && t.n.pos.y > 6); i++) t.tick({}, t.n.pos.y > 7 ? { mx: 1 } : {});
t.both(20.5, -1.5, 20.5, -3.3); console.log('P1', t.st(), t.log);
// 2. Nut launches Bolt onto the pillar; Bolt reels Nut onto the hatch
t.go(0, 23.8, -3.9, 8, 0.15); t.go(1, 23.8, -2.6, 8, 0.15); t.idle(0.3);
t.tick({}, { power: true }); t.run(1.5, () => t.steer(t.b, 23.8, -6.6)); t.idle(0.5);
console.log('bolt on pillar', t.st(), t.log);
t.go(1, 28, -6.3, 8, 0.2);
t.go(0, 23.7, -6.3, 4, 0.15);
t.tick({ mx: 0.3 }, {}); 
let posted = false; for (let i = 0; i < 240 && !posted; i++) { t.tick({ power: true }, {}); posted = t.n.pos.x > 32; }
console.log('nut posted', posted, t.st(), t.log);
t.idle(1.5); console.log('landed', t.st());
t.go(1, 35.8, -5, 4, 0.3); t.tick({}, { power: true }); t.idle(0.4); console.log('switch', t.w.channels[2], t.w.lasers[1].on);
t.go(0, 27, -2); t.both(38.5, -3, 38.5, -5.5); console.log('P2', t.st(), t.log);
t.both(44, -3, 44, -5); t.idle(1.5);
console.log('stats', JSON.stringify(t.w.stats));
console.log(t.st(), 'complete', t.w.complete, t.log);
const put = (u, p, x, y, z) => { p.pos = { x, y, z }; p.prev = { ...p.pos }; };
// checks
{ const u = new Bot(def); put(u, u.b, 14.2, 0.6, -4); put(u, u.n, 13, 0.5, -4); u.idle(0.4); u.tick({}, { power: true }); u.run(2, () => ({ mx: 1 })); console.log('launch over the shaft cage (should zap)', u.log); }
{ const u = new Bot(def); put(u, u.n, 12, 0.5, -4); u.idle(0.3); post(u, 1, 9.5, -2.2); u.run(3, () => ({}), () => ({ mx: 1 })); console.log('nut takes tube with fan off (should be false)', u.n.pos.y > 6, u.st(), u.log); }
{ const u = new Bot(def); put(u, u.b, 20, 7.1, -3); put(u, u.n, 13.5, 0.5, -3); u.idle(0.4); u.tick({ mx: -0.3 }, {}); u.run(2.5, () => ({ power: true })); console.log('pull nut up over the cage (should zap)', u.log); }
{ const u = new Bot(def); put(u, u.b, 23.8, 7.1, -3.9); put(u, u.n, 23.8, 7, -2.6); u.idle(0.4); u.run(1, () => ({ jump: true, ...u.steer(u.b, 23.8, -6.6) })); u.idle(0.5); console.log('bolt jumps onto pillar (should be false)', u.b.pos.y > 9.4); }
{ const u = new Bot(def); put(u, u.n, 23.8, 7, -3.4); put(u, u.b, 22, 7.1, -3.4); u.idle(0.4); u.boostBolt(23.8, -3.4, 0, -1); console.log('boost off Nut onto pillar (should be false)', u.b.pos.y > 9.4, u.onNut); }
{ const u = new Bot(def); put(u, u.b, 29.8, 7.1, -3); put(u, u.n, 28.6, 7, -3); u.idle(0.4); u.tick({}, { power: true }); u.run(2, () => ({ mx: 1 })); u.idle(0.5); console.log('launch over the fence (should zap)', u.log); }
{ const u = new Bot(def); put(u, u.b, 25.5, 10.1, -5.2); u.idle(0.4); u.run(1.2, () => ({ mx: 1, jump: true })); u.idle(1); console.log('jump off pillar past fence (should zap)', u.b.pos.x > 31.3 && !u.w.stats.zaps[0], u.log); }
{ const u = new Bot(def); put(u, u.b, 33, 7.1, -3); put(u, u.n, 29, 7, -3); u.idle(0.4); u.tick({ mx: -0.3 }, {}); u.run(2, () => ({ power: true })); console.log('pull nut through the fence (should zap)', u.log); }
{ const u = new Bot(def); put(u, u.n, 30.5, 7, -7.2); u.idle(0.4); u.tick({}, { power: true }); u.idle(0.3); console.log('flip switch through fence (should be false)', u.w.channels[2] || false); }
// golden cog: Nut launches Bolt off the ledge out over the shaft
{ const u = new Bot(def); put(u, u.n, 20.2, 7, -5); put(u, u.b, 19.1, 7.1, -5); u.idle(0.5); u.tick({}, { power: true }); u.run(2, () => u.steer(u.b, 17.2, -5)); console.log('cog', u.w.cogs[0].got, u.log); }
{ const u = new Bot(def); put(u, u.n, 20.6, 7, -5.4); put(u, u.b, 17.2, 2, -5); u.run(4, () => ({})); console.log('cog by fan alone (should be false)', u.w.cogs[0].got); }
