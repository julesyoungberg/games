import { Bot } from '/home/claude/games/bolt-and-nut/test/bot.mjs';
import def from '../src/lv/ot28.js';
const Y = 5.3;
const t = new Bot(def);
const hopOn = u => { for (let i = 0; i < 70; i++) { const s = u.steer(u.b, u.n.pos.x, u.n.pos.z); u.tick({ ...s, jump: i < 18 }, {}); } return u.b.ground === u.n; };
// Upward Mobility: Nut on the iron by the wall, Bolt hops onto her head, she rockets, he jumps off at the top toward the wall
t.go(1, 22.6, -4.5, 8); t.go(0, 21.3, -4.5, 8, 0.15); t.idle(0.2);
console.log('on nut', hopOn(t), t.st()); t.idle(0.2);
let top = 0; t.tick({}, { power: true });
for (let i = 0; i < 120; i++) { t.tick({ mx: i > 24 ? 1 : 0, jump: i >= 24 && i < 50 }, {}); top = Math.max(top, t.b.pos.y - 0.55); } t.idle(0.4);
console.log('bolt up', top.toFixed(2), t.b.pos.y > Y, t.st(), t.log);
t.go(0, 25.0, -4.5, 3, 0.15); t.go(1, 20.5, -4.5, 3); t.tick({ mx: -0.3 }, {}); t.pullNut(27, -4.5); console.log('nut up', t.n.pos.y > Y, t.st(), t.log);
t.both(27, -3, 27, -5); console.log('P1', t.st(), t.log);
// golden cog: Nut launches Bolt straight up from the upper floor
t.both(31, -6.5, 31, -5.2); t.idle(0.2); t.tick({}, { power: true }); t.run(1.4, () => t.steer(t.b, 31, -6.5)); t.idle(0.5); console.log('cog', t.w.cogs[0].got, t.st());
t.both(40, -3, 40, -5); t.idle(1.5);
console.log('stats', JSON.stringify(t.w.stats));
console.log(t.st(), 'complete', t.w.complete, 'cog', t.w.cogs[0].got, 'falls', JSON.stringify(t.w.stats.falls), 'zaps', JSON.stringify(t.w.stats.zaps), JSON.stringify(t.log));

const put = (u, p, x, y, z) => { p.pos = { x, y, z }; p.prev = { ...p.pos }; };
const up = u => u.b.pos.y > Y + 0.3 || u.n.pos.y > Y + 0.3;
// ---- shortcut checks (all next to the wall, steering for the top)
{ const u = new Bot(def); put(u, u.b, 23.4, 0.6, -4.5); put(u, u.n, 22.2, 0.5, -4.5); u.idle(0.3); let m = 0; u.tick({}, { power: true }); for (let i = 0; i < 100; i++) { u.tick({ mx: 1 }, { mx: 1 }); m = Math.max(m, u.b.pos.y - 0.55); } u.idle(0.5); console.log('launch from the iron, Nut rockets too (should be false)', up(u), 'bolt feet max', m.toFixed(2)); }
{ const u = new Bot(def); put(u, u.b, 19, 0.6, -4.5); put(u, u.n, 17.8, 0.5, -4.5); u.idle(0.3); u.tick({}, { power: true }); u.run(1.6, () => ({ mx: 1 })); u.idle(0.5); console.log('launch from the floor (should be false)', up(u), u.st()); }
{ const u = new Bot(def); put(u, u.n, 23.3, 0.5, -4.5); u.idle(0.3); let m = 0; u.tick({}, { power: true }); for (let i = 0; i < 100; i++) { u.tick({}, { mx: 1, jump: i > 20 && i < 40 }); m = Math.max(m, u.n.pos.y - 0.45); } u.idle(0.5); console.log('nut rockets alone (should be false)', up(u), 'nut feet max', m.toFixed(2)); }
{ const u = new Bot(def); put(u, u.n, 23.2, 0.5, -4.5); put(u, u.b, 23.2, 1.5, -4.5); u.idle(0.4); const on = u.b.ground === u.n; let m = 0; u.tick({}, { power: true }); for (let i = 0; i < 100; i++) { u.tick({ mx: 1 }, {}); m = Math.max(m, u.b.pos.y - 0.55); } u.idle(0.5); console.log('ride the rocket without jumping (should be false)', on, up(u), 'bolt feet max', m.toFixed(2)); }
{ const u = new Bot(def); put(u, u.n, 23.2, 0.5, -4.5); put(u, u.b, 23.2, 1.5, -4.5); u.idle(0.4); let m = 0; for (let i = 0; i < 90; i++) { u.tick({ mx: 1, jump: i < 30 }, {}); m = Math.max(m, u.b.pos.y - 0.55); } u.idle(0.5); console.log('boost (should be false)', up(u), 'bolt feet max', m.toFixed(2)); }
{ const u = new Bot(def); put(u, u.b, 23.4, 0.6, -4.5); u.idle(0.3); for (let i = 0; i < 90; i++) u.tick({ mx: 1, jump: i < 30 }, {}); u.idle(0.5); console.log('bolt jumps alone (should be false)', up(u)); }
{ const u = new Bot(def); put(u, u.n, 23.2, 0.5, -1.5); put(u, u.b, 23.2, 0.6, -2.8); u.idle(0.3); u.tick({}, { power: true }); u.run(1.6, () => ({ mz: -1 })); u.idle(0.5); console.log('launch at the back wall (should be false)', up(u), u.pos(u.b));
  const v = new Bot(def); put(v, v.n, 22, 0.5, -7.3); put(v, v.b, 22, 1.5, -7.3); v.idle(0.4); v.tick({}, { power: true }); for (let i = 0; i < 120; i++) v.tick({ mz: -1, jump: i >= 24 && i < 50 }, {}); v.idle(0.5); console.log('rocket ride jump onto the back wall (should be false)', v.b.pos.z < -8, v.pos(v.b)); }
// timing window for the jump off the rocket (frames after the push): wide enough to hit by eye
{ const ok = []; for (const jf of [16, 18, 19, 20, 21, 22, 34, 35, 36, 37, 38]) { const u = new Bot(def); put(u, u.n, 22.6, 0.5, -4.5); put(u, u.b, 22.6, 1.5, -4.5); u.idle(0.4); u.tick({}, { power: true }); for (let i = 0; i < 120; i++) u.tick({ mx: i > jf ? 1 : 0, jump: i >= jf && i < jf + 26 }, {}); u.idle(0.5); ok.push(jf + ':' + (u.b.pos.y > Y)); } console.log('jump-off window', ok.join(' ')); }
// golden cog misses with less than a launch from the upper floor
{ const u = new Bot(def); put(u, u.b, 31, Y + 0.6, -6.5); u.idle(0.3); for (let i = 0; i < 90; i++) u.tick({ ...u.steer(u.b, 31, -6.5), jump: i < 30 }, {}); u.idle(0.5); console.log('cog by a jump up there (should be false)', u.w.cogs[0].got); }
{ const u = new Bot(def); put(u, u.n, 31, Y + 0.5, -6.5); put(u, u.b, 31, Y + 1.5, -6.5); u.idle(0.4); for (let i = 0; i < 90; i++) u.tick({ ...u.steer(u.b, 31, -6.5), jump: i < 30 }, {}); u.idle(0.5); console.log('cog by a boost up there (should be false)', u.w.cogs[0].got); }
