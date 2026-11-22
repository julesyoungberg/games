import { Bot } from '/home/claude/games/bolt-and-nut/test/bot.mjs';
import def from '../src/lv/ot34.js';
const P0 = 14, P1 = 23, D = 27, SX = P0 - 0.9, SZ = -7.2;
const t = new Bot(def);
const gate = t.w.gates[0], bridge = t.w.bridges[0];
// 1. Nut puts the bridge out; Bolt crosses alone
t.both(11, -4, 12.4, -5.6); t.idle(0.2); t.tick({}, { power: true }); t.idle(0.5);
console.log('switch on: bridge', bridge.on, 'gate', gate.open.toFixed(2));
t.go(0, P1 + 0.6, -4, 8); console.log('Bolt across', t.st());
// 2. Nut switches it off: the bridge goes and the door opens
t.idle(0.2); t.tick({}, { power: true }); t.idle(1); console.log('switch off: bridge', bridge.on, 'gate', gate.open.toFixed(2));
// 3. Nut walks up to the edge; Bolt reels her over the pit
t.go(1, P0 - 0.5, -5.2, 4);
t.go(0, P1 + 0.4, -5.2, 4, 0.15); t.pullNut(P1 + 3, -4.5); console.log('Nut across', t.st(), t.log);
t.both(D + 3, -3, D + 3, -5); t.both(31, -3, 31, -5); console.log('P1', t.st(), t.log);
// golden cog: Nut launches Bolt straight up beside it
t.both(34, -6.8, 34, -5.7); t.idle(0.2); t.tick({}, { power: true }); t.run(1.4, () => t.steer(t.b, 34, -6.8)); t.idle(0.5); console.log('cog', t.w.cogs[0].got, t.st());
t.both(40, -3, 40, -5); t.idle(1.5);
console.log(t.st(), 'complete', t.w.complete, 'cog', t.w.cogs[0].got, 'falls', JSON.stringify(t.w.stats.falls), 'zaps', JSON.stringify(t.w.stats.zaps), JSON.stringify(t.log));

const put = (u, p, x, y, z) => { p.pos = { x, y, z }; p.prev = { ...p.pos }; };
const across = u => u.b.pos.x > P1 && u.b.pos.y > -0.5;
const through = u => u.b.pos.x > D + 1 || u.n.pos.x > D + 1;
// ---- shortcut checks
{ const u = new Bot(def); u.idle(1); console.log('door open at the start (fine: the bridge is not there)', u.w.gates[0].open > 0.5, u.w.bridges[0].on); }
// Nut cannot reach the switch from the far side of the pit
{ let k = 0; for (const z of [-7.5, -6, -4]) { const u = new Bot(def); u.w.switches[0].on = true; u.w.channels[1] = true; put(u, u.n, P1 + 0.4, 0.5, z); put(u, u.b, 30, 0.6, -3); u.idle(0.5); u.tick({}, { power: true }); u.idle(1); if (!u.w.switches[0].on) k++; } console.log('Nut flips the switch from across the pit (should be 0)', k); }
// both cross on the bridge: the door stays shut
{ const u = new Bot(def); put(u, u.n, 12.4, 0.5, -5.6); u.idle(0.3); u.tick({}, { power: true }); u.idle(0.5); u.both(P1 + 2, -3, P1 + 2, -5); u.idle(1); console.log('both cross the bridge, door open (should be false)', u.w.gates[0].open > 0.1, through(u)); }
// Bolt cannot jump the pit, and a launch from the edge does not carry him over
{ const u = new Bot(def); put(u, u.b, 10, 0.6, -4); u.idle(0.3); for (let i = 0; i < 120; i++) u.tick({ mx: 1, jump: u.b.pos.x > P0 - 0.3 }, {}); u.idle(1.5); console.log('Bolt jumps the pit (should be false)', u.b.pos.x > P1 && u.b.pos.y > -0.5, 'falls', u.w.stats.falls[0]); }
{ let k = 0; for (const bx of [P0 - 0.3, P0 - 1]) for (const st of [1.2, 1.8, 2.4]) { const u = new Bot(def); put(u, u.b, bx, 0.6, -4); put(u, u.n, bx - 1.1, 0.5, -4); u.idle(0.3); u.tick({}, { power: true }); u.run(st, () => ({ mx: 1 })); u.idle(1.5); if (across(u)) k++; } console.log('Bolt launched over the pit (should be 0)', k); }
// Bolt reels Nut from as far as the switch: the pull reaches
{ const u = new Bot(def); put(u, u.b, P1 + 0.4, 0.6, -5.2); put(u, u.n, 12.4, 0.5, -5.6); u.idle(0.3); u.pullNut(P1 + 3, -4.5); console.log('pull from the switch', u.n.pos.x > P1, u.pos(u.n), 'falls', u.w.stats.falls[1]); }
// a launch at the door cannot clear it
{ const u = new Bot(def); u.w.switches[0].on = true; u.w.channels[1] = true; put(u, u.b, D - 0.5, 0.6, -4); put(u, u.n, D - 1.6, 0.5, -4); u.idle(1.5); u.tick({}, { power: true }); u.run(1.6, () => ({ mx: 1 })); u.idle(1); console.log('launch over the shut door (should be false)', through(u)); }
// golden cog misses with less than a launch
{ const u = new Bot(def); put(u, u.n, 34, 0.5, -6.8); put(u, u.b, 34, 1.5, -6.8); u.idle(0.4); for (let i = 0; i < 90; i++) u.tick({ ...u.steer(u.b, 34, -6.8), jump: i < 30 }, {}); u.idle(0.5); console.log('cog by a boost (should be false)', u.w.cogs[0].got); }
// jumping on the bridge stays under the laser ceiling
{ const u = new Bot(def); put(u, u.n, 12.4, 0.5, -5.6); u.idle(0.3); u.tick({}, { power: true }); put(u, u.b, P0 + 1, 0.6, -4); u.idle(0.5); for (let i = 0; i < 120; i++) u.tick({ mx: 1, jump: i % 40 < 20 }, {}); u.idle(0.5); console.log('Bolt hops along the bridge, zaps (should be 0)', u.w.stats.zaps[0], across(u)); }
