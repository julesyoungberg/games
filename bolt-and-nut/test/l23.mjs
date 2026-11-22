import { Bot } from './bot.mjs';
import level from '../src/lv/s23.js';
const t = new Bot(level); const sw = t.w.switches; const G = t.w.gates;
const press = () => { t.tick({}, { power: true }); t.idle(0.3); };
// golden cog: Nut launches Bolt onto the filing cabinet
t.go(0, 1.5, -5.8); t.go(1, 1.5, -4.7, 8, 0.15); t.idle(0.2);
t.tick({}, { power: true }); t.run(1.0, () => ({ mz: -1 })); t.idle(0.3); t.go(0, 1.5, -7.3, 2, 0.2);
console.log('cog', t.w.cogs[0].got, t.st());
t.go(0, 3, -6.6); t.run(0.6, () => ({ mx: 1 })); t.idle(0.4); console.log('down', t.st(), t.log);
// 1. Hot Desking
t.both(6, -7.2, 6, -2.5); t.go(1, 8.3, -3.4); press(); console.log('S1', sw[0].on, G[0].open.toFixed(2));
t.go(0, 10.5, -7.2); t.go(0, 14.5, -6.2); t.idle(0.8); console.log('P2', t.w.channels[2], G[1].open.toFixed(2));
t.go(1, 16.5, -1.8); t.idle(0.8); console.log('P3', t.w.channels[3], G[2].open.toFixed(2));
t.go(0, 22, -6); t.go(1, 22, -2); t.both(24, -3, 24, -5.5); console.log('P1', t.st(), t.log);
// 2. Reply All
t.go(0, 40.8, -4.5); console.log('Bolt over', t.st());
t.go(1, 31, -4.8); press(); t.idle(0.5); console.log('S4', sw[1].on, 'bridge', t.w.bridges[0].on, 'gate', G[3].open.toFixed(2));
t.pullNut(43, -4.5, 3); console.log('pulled', t.st(), t.log.slice(-2));
t.both(47, -3, 47, -5.5); console.log('P2', t.st(), t.log);
// 3. Hold Music
t.go(0, 49.5, -6.2); t.go(0, 54, -6.2); t.go(1, 53.5, -1.8); t.idle(0.3); console.log('belt rev', t.w.belts && t.w.belts[0].rev);
t.go(0, 66, -6.2, 6); t.idle(0.6); console.log('on P3', t.st(), 'latched', G[4].latched, t.log.slice(-1));
t.go(0, 69.5, -6.2); t.go(1, 70, -2); t.both(71, -3, 71, -5.5); console.log('P3', t.st(), t.log);
// 4. Revolving Door
t.go(0, 82.5, -4); t.go(1, 75.2, -4.8); press(); t.idle(0.8); console.log('S5 on', sw[2].on, 'A', G[5].open.toFixed(2), 'B', G[6].open.toFixed(2));
t.go(0, 88, -6.3); t.idle(0.3); press(); t.idle(0.8); console.log('S5 off', sw[2].on, 'A', G[5].open.toFixed(2), 'B', G[6].open.toFixed(2));
t.go(1, 87, -2.5, 10); console.log('Nut through', t.st());
t.both(93, -3, 93, -5); t.idle(1.5);
// shortcut checks
const put = (u, p, x, y, z) => { p.pos = { x, y, z }; p.prev = { ...p.pos }; };
{ const u = new Bot(level); put(u, u.b, 1.5, 0.6, -5.5); u.idle(0.2); u.run(1, () => ({ mz: -1, jump: true })); console.log('cog by jump (should be false)', u.w.cogs[0].got); }
{ const u = new Bot(level); put(u, u.n, 1.5, 0.5, -6); put(u, u.b, 1.5, 1.6, -6); u.idle(0.5); const on = u.b.ground === u.n; u.run(1, () => ({ mz: -1, jump: true })); console.log('cog by boost (should be false)', on, u.w.cogs[0].got); }
{ const u = new Bot(level); put(u, u.b, 10.6, 0.6, -5.0); put(u, u.n, 11.9, 0.5, -3.5); u.idle(0.3); u.tick({}, { power: true }); let top = 0; u.run(1.5, () => { top = Math.max(top, u.b.pos.y - 0.55); return { mx: 1 }; }); console.log('P1 launch over gate: Bolt x (should be < 11)', u.b.pos.x.toFixed(2), 'peak', top.toFixed(2)); }
{ const u = new Bot(level); put(u, u.b, 10, 0.6, -2.5); put(u, u.n, 10, 0.5, -1.2); u.idle(0.3); u.tick({}, { power: true }); u.run(1.5, () => ({ mz: -1 })); console.log('P1 launch over divider: zaps (should be 1)', u.w.stats.zaps[0]); }
{ const u = new Bot(level); put(u, u.n, 41, 0.5, -4.5); u.idle(0.2); u.tick({}, { power: true }); u.idle(0.3); console.log('P2 flip from far side (should be false)', u.w.switches[1].on); }
{ const u = new Bot(level); put(u, u.b, 54.5, 0.6, -6.2); u.idle(0.2); u.run(3, () => ({ mx: 1, jump: true })); console.log('P3 hop the belt: zaps (should be 1)', u.w.stats.zaps[0], 'x', u.b.pos.x.toFixed(2)); }
{ const u = new Bot(level); put(u, u.n, 80.3, 0.5, -4); put(u, u.b, 82, 0.6, -4); u.idle(0.2); u.tick({}, { power: true }); u.idle(0.3); console.log('P4 flip from inside the doors (should be false)', u.w.switches[2].on); }
{ const u = new Bot(level); put(u, u.n, 79.0, 0.5, -6.8); u.idle(0.2); u.tick({}, { power: true }); u.idle(0.3); console.log('P4 flip from the near door (should be false)', u.w.switches[2].on); }
console.log('stats', JSON.stringify(t.w.stats));
console.log('cog', t.w.cogs[0].got);
console.log(t.st(), 'complete', t.w.complete, t.log);
