import { Bot } from './bot.mjs';
import def from '../src/lv/ot11.js';
const t = new Bot(def); const M = t.w.anchors[0];
const hanging = (u) => u.b.target && u.b.target.obj === M && u.b.hang;
// walk onto the tube hatch until posted
const post = (u, who, sec = 6) => { const p = u.w.players[who]; for (let i = 0; i < sec * 60; i++) { const ox = p.pos.x; const s = u.steer(p, 9, -6.5); u.tick(who === 0 ? s : {}, who === 1 ? s : {}); if (Math.abs(p.pos.x - ox) > 1.5) return true; } return false; };
// 1. Bolt: tube, spring, grab the magnet at the top of the bounce, hop onto the ledge
t.go(1, 5, -2.5);
console.log('bolt posted', post(t, 0));
let held = false;
for (let i = 0; i < 600 && !hanging(t); i++) {
  if (!held && t.b.pos.y > 5.6 && t.b.vel.y < 1.5) { held = true; t.tick({ mx: 0.3 }, {}); }
  t.tick(held ? { power: true } : t.steer(t.b, 21.3, -7), {});
}
console.log('magnet', hanging(t), t.st(), t.log);
t.tick({ power: true, mx: 1 }, {}); t.tick({ power: true, mx: 1, jump: true }, {}); t.run(0.8, () => ({ mx: 1, jump: true })); t.idle(0.3);
t.go(0, 30.6, -2.5); t.tick({ mx: -0.3 }, {}); console.log('bolt up', t.st(), t.log);
// 2. Nut: tube, bounce on the front of the spring, Bolt reels her in at the top
console.log('nut posted', post(t, 1));
let pulled = false;
for (let i = 0; i < 900 && !pulled; i++) {
  if (t.n.pos.y > 5.6 && t.n.vel.y < 1.5 && t.n.pos.x > 20) { pulled = true; break; }
  t.tick({}, t.steer(t.n, 21.3, -2.5));
}
t.run(1.4, () => ({ power: true })); t.goHold(32, -2.5); t.run(0.3, () => ({ power: true })); t.idle(0.8);
console.log('P1', t.st(), t.log);
t.both(33, -3, 33, -5.5); t.both(40.5, -3, 40.5, -5); t.idle(1.5);
console.log('stats', JSON.stringify(t.w.stats));
console.log(t.st(), 'complete', t.w.complete, t.log);
const put = (u, p, x, y, z) => { p.pos = { x, y, z }; p.prev = { ...p.pos }; };
// checks
{ const u = new Bot(def); put(u, u.b, 11.4, 0.6, -4); put(u, u.n, 10.3, 0.5, -4); u.idle(0.5); u.tick({}, { power: true }); u.run(2, () => ({ mx: 1 })); console.log('launch over near lasers (should zap)', u.log); }
{ const u = new Bot(def); put(u, u.b, 31, 6.1, -2.5); put(u, u.n, 22.6, 0.5, -0.5); u.idle(0.5); u.tick({ mx: -0.3 }, {}); u.run(2, () => ({ power: true })); console.log('pull from island floor (should zap)', u.log); }
{ const u = new Bot(def); put(u, u.b, 23.4, 0.6, -7); u.idle(0.5); u.tick({ mx: 1 }, {}); u.run(2, () => ({ power: true })); console.log('grab magnet from floor (should zap)', u.log); }
{ const u = new Bot(def); put(u, u.n, 21.3, 0.8, -4.5); u.idle(0.1); u.run(4, () => ({}), () => ({ mx: 1 })); console.log('nut bounces onto ledge (should be false)', u.n.pos.y > 5, u.log); }
{ const u = new Bot(def); put(u, u.b, 21.3, 0.8, -4.5); u.idle(0.1); u.run(4, () => ({ mx: 1 })); console.log('bolt bounces onto ledge (should be false)', u.b.pos.y > 5, u.log); }
{ const u = new Bot(def); put(u, u.n, 18.3, 1.0, -5); u.idle(1.5); console.log('nut back through tube from B', u.n.pos.x < 12, u.pos(u.n), u.log); }
// golden cog: piggyback. Bolt stands on Nut, Nut walks onto the spring, Bolt jumps off her head at the top
{ const u = new Bot(def); put(u, u.n, 18.6, 0.5, -4.5); put(u, u.b, 18.6, 1.6, -4.5); u.idle(0.5); const on = u.b.ground === u.n;
  let jumped = false;
  for (let i = 0; i < 200 && !u.w.cogs[0].got; i++) {
    if (!jumped && u.n.pos.y > 5 && u.n.vel.y < 2) jumped = true;
    u.tick(jumped ? { jump: true } : u.steer(u.b, u.n.pos.x, u.n.pos.z), u.steer(u.n, 21.3, -4.5));
  }
  console.log('cog', u.w.cogs[0].got, 'on nut', on, u.log); }
{ const u = new Bot(def); put(u, u.b, 21.3, 0.8, -4.5); u.idle(0.1); u.run(3, () => ({ jump: true })); console.log('cog by bounce alone (should be false)', u.w.cogs[0].got); }
