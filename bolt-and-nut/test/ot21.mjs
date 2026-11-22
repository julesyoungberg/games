import { Bot } from './bot.mjs';
import def from '../src/lv/ot21.js';
const Y = 5.5;
const t = new Bot(def); const crate = t.w.crates[0];
// Bolt hops onto Nut, Nut hops onto the crate carrying him, Bolt shuffles to the side he wants to fly
const stack = (u, c, side) => {
  const cx = c.pos.x, cz = c.pos.z; u.go(0, u.b.pos.x, -1.5, 6); u.go(1, u.n.pos.x, -1.5, 6); u.go(1, cx - 1.6, -1.5, 8); u.go(1, cx - 1.6, cz, 6, 0.1); u.go(0, cx - 2.9, -1.5, 8); u.go(0, cx - 2.9, cz, 6, 0.1); u.idle(0.2);
  for (let i = 0; i < 70; i++) { const s = u.steer(u.b, u.n.pos.x, u.n.pos.z); u.tick({ ...s, jump: i < 18 }, {}); }
  const onNut = u.b.ground === u.n;
  for (let i = 0; i < 60; i++) u.tick({}, { mx: u.n.pos.x < c.pos.x - 0.05 ? 0.6 : 0, jump: i < 18 }); u.idle(0.4);
  for (let i = 0; i < 30 && (side > 0 ? u.b.pos.x < u.n.pos.x + 0.3 : Math.abs(u.b.pos.x - u.n.pos.x) > 0.1); i++) u.tick({ mx: side > 0 ? 0.4 : Math.sign(u.n.pos.x - u.b.pos.x) * 0.2 }, {}); u.idle(0.2);
  return onNut && u.n.ground === c && u.b.ground === u.n;
};
// golden cog first: Nut shoves the crate under the cog, the stack goes straight up
t.go(1, 18.7, -4.5, 8, 0.1); t.go(1, 7.15, -4.5, 8, 0.1); t.go(1, 8.5, -4.5); console.log('crate under cog', t.pos(crate));
console.log('stack under cog', stack(t, crate, 0), t.st());
t.tick({}, { power: true }); t.run(1.4, () => t.steer(t.b, 6, -4.5)); t.idle(0.4); console.log('cog', t.w.cogs[0].got, t.st(), t.log);
// Org Chart: Nut shoves the crate back toward the wall, the stack again, Bolt flies onto the top
t.go(0, t.b.pos.x, -1.6, 4); t.go(0, 3, -1.6, 4); t.go(1, t.n.pos.x, -7.2, 4); t.go(1, crate.pos.x - 1.2, -7.2, 6); t.go(1, crate.pos.x - 1.2, -4.5, 6, 0.1); t.go(1, 16.8, -4.5, 8, 0.1); t.go(1, 14, -4.5); console.log('crate by wall', t.pos(crate));
console.log('stack', stack(t, crate, 1), t.st());
let top = 0; t.tick({}, { power: true }); for (let i = 0; i < 90; i++) { t.tick({ mx: 1 }, {}); top = Math.max(top, t.b.pos.y - 0.55); } t.idle(0.3); console.log('bolt up', top.toFixed(2), t.st(), t.log);
// Bolt reels Nut up
t.go(0, 21.5, -4.5, 4, 0.15); t.go(1, crate.pos.x - 2, -4.5, 6); t.tick({ mx: -0.3 }, {}); t.pullNut(23, -4.5); console.log('nut up', t.st(), t.log);
t.both(23, -2.5, 23, -5); console.log('P1', t.st(), t.log);
t.both(36, -3, 36, -5); t.idle(1.5);
console.log('stats', JSON.stringify(t.w.stats));
console.log(t.st(), 'complete', t.w.complete, 'cog', t.w.cogs[0].got, 'falls', JSON.stringify(t.w.stats.falls), 'zaps', JSON.stringify(t.w.stats.zaps), JSON.stringify(t.log));

const put = (u, p, x, y, z) => { p.pos = { x, y, z }; p.prev = { ...p.pos }; };
const up = u => u.b.pos.y > Y + 0.3 || u.n.pos.y > Y + 0.3;
const fly = (u, sec = 1.6) => { let top = 0; u.tick({}, { power: true }); for (let i = 0; i < sec * 60; i++) { u.tick({ mx: 1 }, { mx: 1 }); top = Math.max(top, u.b.pos.y - 0.55); } u.idle(0.5); return top.toFixed(2); };
// ---- shortcut checks (all next to the wall, Bolt steering for the top)
{ const u = new Bot(def); put(u, u.b, 19.5, 0.6, -4.5); put(u, u.n, 18.4, 0.5, -4.5); u.idle(0.3); const top = fly(u); console.log('launch from the floor (should be false)', up(u), 'bolt feet max', top); }
{ const u = new Bot(def); const c = u.w.crates[0]; put(u, c, 19.3, 0.6, -4.5); put(u, u.b, 19.3, 1.8, -4.5); put(u, u.n, 18.0, 0.5, -4.5); u.idle(0.4); const top = fly(u); console.log('launch off the crate (should be false)', up(u), 'bolt feet max', top); }
{ const u = new Bot(def); put(u, u.n, 19.2, 0.5, -4.5); put(u, u.b, 19.45, 1.5, -4.5); u.idle(0.4); const on = u.b.ground === u.n; const top = fly(u); console.log('launch off Nut\'s head (should be false)', on, up(u), 'bolt feet max', top); }
{ const u = new Bot(def); put(u, u.n, 19.2, 0.5, -4.5); put(u, u.b, 19.2, 1.5, -4.5); u.idle(0.4); let top = 0; for (let i = 0; i < 90; i++) { u.tick({ mx: 1, jump: i < 30 }, {}); top = Math.max(top, u.b.pos.y - 0.55); } u.idle(0.5); console.log('boost (should be false)', up(u), 'bolt feet max', top.toFixed(2)); }
{ const u = new Bot(def); const c = u.w.crates[0]; put(u, c, 19.3, 0.6, -4.5); put(u, u.n, 19.3, 1.7, -4.5); u.idle(0.4); let top = 0; u.tick({}, { power: true }); for (let i = 0; i < 90; i++) { u.tick({}, { mx: i > 20 ? 1 : 0 }); top = Math.max(top, u.n.pos.y - 0.45); } u.idle(0.5); console.log('nut throws the crate she stands on and rides it (should be false)', up(u), 'nut feet max', top.toFixed(2)); }
{ const u = new Bot(def); const c = u.w.crates[0]; put(u, c, 19.3, 0.6, -4.5); put(u, u.b, 19.3, 1.8, -4.5); u.idle(0.3); put(u, u.n, 19.3, 3.0, -4.5); u.idle(0.4); const on = u.n.ground === u.b; let top = 0; for (let i = 0; i < 90; i++) { u.tick({}, { mx: 1, jump: i < 30 }); top = Math.max(top, u.n.pos.y - 0.45); } u.idle(0.5); console.log('nut jumps off Bolt on the crate (should be false)', on, up(u), 'nut feet max', top.toFixed(2)); }
{ const u = new Bot(def); const c = u.w.crates[0]; put(u, c, 19.3, 0.6, -4.5); put(u, u.b, 19.3, 1.8, -4.5); u.idle(0.3); put(u, u.n, 19.3, 3.0, -4.5); u.idle(0.4); u.run(0.6, () => ({}), () => ({ power: true })); u.idle(1); console.log('nut on Bolt on the crate cannot launch him (should be false)', up(u), u.st()); }
{ const u = new Bot(def); const c = u.w.crates[0]; put(u, c, 19.3, 0.6, -4.5); put(u, u.n, 19.3, 1.7, -4.5); u.idle(0.3); put(u, u.b, 19.3, 2.8, -4.5); u.idle(0.4); let top = 0; for (let i = 0; i < 90; i++) { u.tick({ mx: 1, jump: i < 30 }, {}); top = Math.max(top, u.b.pos.y - 0.55); } u.idle(0.5); console.log('bolt jumps off the stack without a push (should be false)', up(u), 'bolt feet max', top.toFixed(2)); }
{ const u = new Bot(def); put(u, u.b, 19.3, 0.6, -7.4); put(u, u.n, 19.3, 0.5, -6.2); u.idle(0.3); u.tick({}, { power: true }); u.run(1.6, () => ({ mz: -1 })); u.idle(0.5); console.log('launch at the back wall (should be false)', up(u), u.pos(u.b)); }
// lost crate comes back to the lobby; golden cog misses with anything less than the stack
{ const u = new Bot(def); const c = u.w.crates[0]; put(u, c, 10, 0.6, 1.5); u.idle(2); console.log('lost crate home', u.pos(c), u.log); }
{ const u = new Bot(def); const c = u.w.crates[0]; put(u, c, 6, 0.6, -4.5); put(u, u.b, 6, 1.8, -4.5); put(u, u.n, 6, 0.5, -3.2); u.idle(0.4); u.tick({}, { power: true }); u.run(1.4, () => u.steer(u.b, 6, -4.5)); console.log('cog by launch off the crate (should be false)', u.w.cogs[0].got);
  const v = new Bot(def); put(v, v.n, 6, 0.5, -4.5); put(v, v.b, 6, 1.5, -4.5); v.idle(0.4); v.tick({}, { power: true }); v.run(1.4, () => v.steer(v.b, 6, -4.5)); console.log('cog by launch off Nut\'s head (should be false)', v.w.cogs[0].got);
  const w2 = new Bot(def); put(w2, w2.b, 19.5, Y + 0.6, -4.5); w2.idle(0.2); for (let i = 0; i < 90; i++) w2.tick({ mx: -1, jump: i < 30 }, {}); w2.idle(1); console.log('cog by jumping off the top (should be false)', w2.w.cogs[0].got, w2.log); }
