import { Bot } from '/home/claude/games/bolt-and-nut/test/bot.mjs';
import def from '../src/lv/ot30.js';
const P = 3.2, A = 16, B = 28;
const t = new Bot(def);
// 1. the mail pole: Nut launches Bolt onto the hatch on top, and the tube posts him over the chasm
t.go(0, 9.8, -4.5, 8); t.go(1, 8.7, -4.5, 8, 0.15); t.idle(0.2);
t.tick({}, { power: true }); t.run(1.6, () => t.b.pos.x < A ? t.steer(t.b, 12, -4.5) : {}); t.idle(0.6);
console.log('posted', t.b.pos.x > B, t.st(), t.log);
// 2. the trust fall: Bolt at the far edge facing Nut, holding X; Nut takes a running jump into the chasm
t.go(0, B + 0.6, -3, 6, 0.15); t.tick({ mx: -0.3 }, {}); t.idle(0.1);
t.go(1, 13, -3, 6, 0.15); t.idle(0.2);
let caught = -1;
for (let i = 0; i < 240; i++) {
  const nx = t.n.pos.x;
  t.tick({ power: true }, { mx: 1, jump: nx > A - 0.5 && i < 200 });
  if (caught < 0 && t.b.target && t.b.target.kind === 'nut') caught = i;
  if (caught >= 0 && i > caught + 20) break;
}
t.goHold(B + 3.5, -3); t.run(0.4, () => ({ power: true })); t.idle(0.6); console.log('caught at frame', caught, t.st(), t.log);
t.both(36, -3, 36, -5); console.log('P1', t.st(), t.log);
// golden cog: Nut launches Bolt straight up beside it
t.both(36, -6.8, 36, -5.7); t.idle(0.2); t.tick({}, { power: true }); t.run(1.4, () => t.steer(t.b, 36, -6.8)); t.idle(0.5); console.log('cog', t.w.cogs[0].got, t.st());
t.both(42, -3, 42, -5); t.idle(1.5);
console.log('stats', JSON.stringify(t.w.stats));
console.log(t.st(), 'complete', t.w.complete, 'cog', t.w.cogs[0].got, 'falls', JSON.stringify(t.w.stats.falls), 'zaps', JSON.stringify(t.w.stats.zaps), JSON.stringify(t.log));

const put = (u, p, x, y, z) => { p.pos = { x, y, z }; p.prev = { ...p.pos }; };
const posted = u => u.b.pos.x > B;
// ---- shortcut checks
{ const u = new Bot(def); put(u, u.b, B + 0.6, 0.6, -3); put(u, u.n, A - 0.6, 0.5, -3); u.idle(0.3); u.tick({ mx: -0.3 }, {}); u.run(2, () => ({ power: true })); console.log('catch Nut standing on the edge (should be false)', !!(u.b.target && u.b.target.kind === 'nut')); }
{ const u = new Bot(def); put(u, u.b, B + 0.6, 0.6, -3); put(u, u.n, A - 0.6, 0.5, -3); u.idle(0.3); u.tick({ mx: -0.3 }, {}); let c = false; for (let i = 0; i < 120; i++) { u.tick({ power: true }, { mx: 1, jump: i < 20 }); c = c || !!(u.b.target && u.b.target.kind === 'nut'); } console.log('catch Nut after a standing jump', c); }
{ const u = new Bot(def); put(u, u.b, 10.5, 0.6, -4.5); u.idle(0.3); for (let i = 0; i < 90; i++) u.tick({ ...u.steer(u.b, 12, -4.5), jump: i < 30 }, {}); u.idle(0.8); console.log('bolt jumps onto the pole (should be false)', posted(u), u.pos(u.b)); }
{ const u = new Bot(def); put(u, u.n, 10.9, 0.5, -4.5); put(u, u.b, 9.6, 0.6, -4.5); u.idle(0.3); for (let i = 0; i < 70; i++) u.tick({ ...u.steer(u.b, u.n.pos.x, u.n.pos.z), jump: i < 18 }, {}); const on = u.b.ground === u.n; for (let i = 0; i < 90; i++) u.tick({ ...u.steer(u.b, 12, -4.5), jump: i < 30 }, {}); u.idle(0.8); console.log('bolt boosts onto the pole (should be false)', on, posted(u), u.pos(u.b)); }
{ const r = []; for (const bx of [9.2, 9.5, 9.8, 10.1, 10.4]) { const u = new Bot(def); put(u, u.b, bx, 0.6, -4.5); put(u, u.n, bx - 1.1, 0.5, -4.5); u.idle(0.3); u.tick({}, { power: true }); u.run(1.6, () => u.b.pos.x < A ? u.steer(u.b, 12, -4.5) : {}); u.idle(0.6); r.push(bx + ':' + posted(u)); } console.log('launch distance window', r.join(' ')); }
{ const u = new Bot(def); put(u, u.b, 9.8, 0.6, -4.5); put(u, u.n, 8.7, 0.5, -4.5); u.idle(0.3); u.tick({}, { power: true }); u.run(1.6, () => ({})); u.idle(0.6); console.log('launch without steering', posted(u), u.pos(u.b)); }
{ const u = new Bot(def); put(u, u.n, 36, 0.5, -6.8); put(u, u.b, 36, 1.5, -6.8); u.idle(0.4); for (let i = 0; i < 90; i++) u.tick({ ...u.steer(u.b, 36, -6.8), jump: i < 30 }, {}); u.idle(0.5); console.log('cog by a boost (should be false)', u.w.cogs[0].got); }
