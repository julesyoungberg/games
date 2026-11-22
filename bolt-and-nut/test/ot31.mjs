import { Bot } from '/home/claude/games/bolt-and-nut/test/bot.mjs';
import def from '../src/lv/ot31.js';
const Y = 5.6;
const t = new Bot(def);
// Escalation: Bolt bounces on the spring, Nut stands beside it and launches him on the way up
t.go(0, 15.5, -4.5, 8); t.run(2, () => t.steer(t.b, 17.2, -4.5)); t.waitFor(u => Math.hypot(u.n.pos.x - 15.7, u.n.pos.z + 4.5) < 0.15, 8, u => u.steer(u.b, 17.2, -4.5), u => u.steer(u.n, 15.7, -4.5));
t.waitFor(u => u.b.vel.y < 0, 3, () => t.steer(t.b, 17.2, -4.5)); t.waitFor(u => u.b.vel.y > 5, 3, () => t.steer(t.b, 17.2, -4.5)); t.run(15 / 60, () => t.steer(t.b, 17.2, -4.5));
t.tick({}, { power: true }); t.run(1.6, () => ({ mx: 1 })); t.idle(0.4);
console.log('bolt up', t.b.pos.y > Y, t.st(), t.log);
t.go(0, 22.4, -4.5, 3, 0.15); t.go(1, 16.5, -4.5, 3); t.tick({ mx: -0.3 }, {}); t.pullNut(24.5, -4.5); console.log('nut up', t.n.pos.y > Y, t.st(), t.log);
t.both(26, -3, 26, -5); console.log('P1', t.st(), t.log);
// golden cog: Nut launches Bolt straight up from the mezzanine
t.both(31, -6.5, 31, -5.2); t.idle(0.2); t.tick({}, { power: true }); t.run(1.4, () => t.steer(t.b, 31, -6.5)); t.idle(0.5); console.log('cog', t.w.cogs[0].got, t.st());
t.both(40, -3, 40, -5); t.idle(1.5);
console.log('stats', JSON.stringify(t.w.stats));
console.log(t.st(), 'complete', t.w.complete, 'cog', t.w.cogs[0].got, 'falls', JSON.stringify(t.w.stats.falls), 'zaps', JSON.stringify(t.w.stats.zaps), JSON.stringify(t.log));

const put = (u, p, x, y, z) => { p.pos = { x, y, z }; p.prev = { ...p.pos }; };
const up = u => u.b.pos.y > Y + 0.3 || u.n.pos.y > Y + 0.3;
// ---- shortcut checks (all by the mezzanine, steering for the top)
{ const u = new Bot(def); put(u, u.b, 20.3, 0.6, -4.5); put(u, u.n, 19.6, 0.5, -4.5); u.idle(0.3); u.tick({}, { power: true }); u.run(1.6, () => ({ mx: 1 })); u.idle(0.5); console.log('launch from the floor (should be false)', up(u)); }
{ const u = new Bot(def); put(u, u.b, 17.2, 0.6, -4.5); u.idle(0.2); let m = 0; for (let i = 0; i < 300; i++) { u.tick({ mx: i > 150 ? 1 : 0, jump: (i % 20) < 10 }, {}); m = Math.max(m, u.b.pos.y - 0.55); } u.idle(0.5); console.log('bolt bounces and jumps (should be false)', up(u), 'feet max', m.toFixed(2)); }
{ const u = new Bot(def); put(u, u.n, 17.2, 0.5, -4.5); u.idle(0.1); let m = 0; for (let i = 0; i < 300; i++) { u.tick({}, { jump: (i % 20) < 10, mx: i > 200 ? 1 : 0 }); m = Math.max(m, u.n.pos.y - 0.45); } console.log('nut bounces and jumps (should be false)', up(u), 'feet max', m.toFixed(2)); }
{ const u = new Bot(def); put(u, u.n, 20.2, 0.5, -4.5); put(u, u.b, 20.2, 1.5, -4.5); u.idle(0.4); for (let i = 0; i < 90; i++) u.tick({ mx: 1, jump: i < 30 }, {}); u.idle(0.5); console.log('boost (should be false)', up(u)); }
{ let best = 0, ok = false; for (let nj = 0; nj < 30; nj += 3) for (let jf = 0; jf < 60; jf += 3) { const u = new Bot(def); put(u, u.n, 17.2, 0.5, -4.5); put(u, u.b, 17.2, 1.5, -4.5); u.idle(0.05); let m = 0; u.waitFor(u => u.n.vel.y > 5, 3); u.run(1.0); u.waitFor(u => u.n.vel.y > 5, 3); for (let i = 0; i < 120; i++) { u.tick({ mx: i >= jf ? 1 : 0, jump: i >= jf && i < jf + 25 }, { jump: i < nj + 20 && i >= nj }); m = Math.max(m, u.b.pos.y - 0.55); } u.idle(0.5); best = Math.max(best, m); ok = ok || up(u); } console.log('Bolt rides Nut up the spring and jumps off (should be false)', ok, 'feet max', best.toFixed(2)); }
{ let ok = false; for (let d = 0; d < 60; d += 2) { const u = new Bot(def); put(u, u.n, 17.2, 0.5, -4.5); put(u, u.b, 15.4, 0.6, -4.5); u.idle(0.1); u.run(d / 60); u.tick({}, { power: true }); u.run(1.6, () => ({ mx: 1 })); u.idle(0.5); ok = ok || up(u); } console.log('Nut on the spring launches Bolt (should be false)', ok); }
// timing window for the mid-bounce launch (frames after Bolt leaves the spring), Nut at the spring's edge
{ const r = []; for (let d = 0; d < 56; d += 2) { const u = new Bot(def); put(u, u.b, 17.2, 0.6, -4.5); put(u, u.n, 15.7, 0.5, -4.5); u.idle(0.2); u.waitFor(u => u.b.vel.y < 0, 3); u.waitFor(u => u.b.vel.y > 5, 3); u.run(d / 60); u.tick({}, { power: true }); u.run(1.6, () => ({ mx: 1 })); u.idle(0.5); r.push(d + ':' + up(u)); } console.log('launch window', r.join(' ')); }
// golden cog misses with less than a launch from the mezzanine
{ const u = new Bot(def); put(u, u.n, 31, Y + 0.5, -6.5); put(u, u.b, 31, Y + 1.5, -6.5); u.idle(0.4); for (let i = 0; i < 90; i++) u.tick({ ...u.steer(u.b, 31, -6.5), jump: i < 30 }, {}); u.idle(0.5); console.log('cog by a boost up there (should be false)', u.w.cogs[0].got); }
// Bolt jumps from the floor and Nut launches him mid-jump (best of many timings): short of the mezzanine
{ let ok = false, best = 0; for (let d = 0; d < 40; d += 2) { const u = new Bot(def); put(u, u.b, 20.3, 0.6, -4.5); put(u, u.n, 19.1, 0.5, -4.5); u.idle(0.3); let m = 0; for (let i = 0; i < d; i++) u.tick({ jump: true }, {}); u.tick({ jump: true }, { power: true }); for (let i = 0; i < 100; i++) { u.tick({ mx: 1 }, {}); m = Math.max(m, u.b.pos.y - 0.55); } u.idle(0.5); best = Math.max(best, m); ok = ok || up(u); } console.log('launch mid-jump (should be false)', ok, 'feet max', best.toFixed(2)); }
