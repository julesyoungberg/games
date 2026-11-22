import { Bot } from './bot.mjs';
import level from '../src/lv/s25.js';
const t = new Bot(level); const c = t.w.crates;
// 1. Stock Check: launch Bolt onto the shelf
t.go(1, 14.6, -5.4); t.go(0, 14.6, -4.2, 8, 0.15); t.idle(0.2);
t.tick({}, { power: true }); t.run(1.0, () => ({ mz: 0.6 })); t.idle(0.4); console.log('shelf', t.st(), t.log);
// golden cog: Bolt reels Nut up onto the shelf, Nut launches him
t.go(1, 14.6, -4.4); t.go(0, 14.6, -3.0, 3, 0.1); t.tick({ mz: -0.3 }, {}); t.run(1.6, () => ({ power: true })); t.goHold(15.2, -2.0, 2); t.run(0.5, () => ({ power: true, mx: -0.3 })); t.idle(0.8); console.log('nut up', t.st());
t.go(1, 15.4, -2, 3, 0.15); t.go(0, 14.3, -2, 3, 0.1); t.idle(0.2); t.tick({}, { power: true }); t.run(1.2, () => t.steer(t.b, 13.6, -2)); t.idle(0.6); console.log('cog', t.w.cogs[0].got, t.st());
t.go(0, 15.4, -1.4, 3, 0.15); t.go(1, 11.45, -3.0, 4, 0.1); t.go(0, 15.0, -2.0, 3, 0.15); console.log('ready', t.st());
t.grab(0.6, -0.8, 1.5); console.log('grab', c[0].pulledBy === t.b, t.pos(c[0]));
t.carry(c[0], 12.6, -2, -1, 0); console.log('placed', t.pos(c[0]), t.st(), 'ch1', t.w.channels[1]);
t.go(0, 14.4, -4.6); t.go(1, 15.4, -4.6); t.idle(0.5); console.log('down', t.st(), t.log, t.w.gates[0].open, t.pos(c[0]));
t.both(16, -2.5, 16, -3.5); t.both(26.5, -3, 26.5, -3.6); t.both(26.5, -3, 26.5, -5.5); console.log('P1', t.st(), t.log);
// 2. Cross Docking
const press = () => { t.tick({}, { power: true }); t.idle(0.3); };
t.go(0, 29.5, -6.5); t.idle(0.3); console.log('belt rev', t.w.channels[2]);
t.go(1, 30.4, -4); t.waitFor(t => t.n.pos.x > 42.2, 4, {}, { mx: 1 }); t.go(1, 43, -6.4); press(); console.log('Nut over', t.st(), 'switch', t.w.switches[0].on);
t.go(0, 30.4, -4); t.waitFor(t => t.b.pos.x > 42.2, 4, { mx: 1 }); t.go(0, 44, -3); console.log('Bolt over', t.st());
t.go(1, 43, -6.4); press(); t.idle(0.8); console.log('gate', t.w.gates[1].open);
t.both(49, -3, 49, -5.5); console.log('P2', t.st(), t.log);
// 3. Pick and Pack
const fetch = (k, px) => { t.go(0, k.pos.x, -3.4, 6, 0.15); t.grab(0, 1, 1.5); const ok = k.pulledBy === t.b; t.carry(k, px, -6.8, 0, -1); return ok; };
t.go(1, 54.5, -2);
console.log("crate A", fetch(c[1], 63)); t.idle(3); console.log('A at', t.pos(c[1]), 'ch3', t.w.channels[3]);
t.go(0, 61, -5.2); t.go(1, 64.4, -2.0); press(); console.log('switch', t.w.switches[1].on, t.st()); t.go(1, 55, -2);
console.log('crate B', fetch(c[2], 63)); t.idle(3); console.log('B at', t.pos(c[2]), 'ch4', t.w.channels[4], 'gate', t.w.gates[2].open);
t.both(75.5, -2, 75.5, -3); t.both(79.5, -3, 79.5, -5.5); console.log("P3", t.st(), t.log);
// 4. Despatch
{ const k = c[3];
  t.go(1, 78, -0.8); t.go(0, 81.5, -1.4, 6, 0.1); t.grab(1, 0, 2); console.log('parcel', k.pulledBy === t.b, t.pos(k));
  t.carry(k, 80, -3.1, 0, -1); console.log('set', t.pos(k), t.st());
  t.go(0, 78.4, -4.7); t.go(1, 80, -1.4, 6, 0.1); t.idle(0.2); press(); console.log('thrown', t.pos(k), t.st());
  t.waitFor(t => !!t.w.channels[5], 6); t.idle(0.8); console.log('delivered', t.pos(k), 'ch5', t.w.channels[5], 'bridge', t.w.bridges[0].on);
  t.both(81.5, -1.1, 80.5, -1.1); t.both(91, -1.1, 89.5, -1.1); console.log('over', t.st(), t.log.slice(-2));
  t.both(98, -3, 98, -5.5); t.idle(1.5); }
// shortcut checks (separate worlds, positions set directly)
const put = (u, p, x, y, z) => { p.pos = { x, y, z }; p.prev = { ...p.pos }; if (p.vel) p.vel = { x: 0, y: 0, z: 0 }; };
// P1
{ const u = new Bot(level); put(u, u.n, 13.5, 0.46, -4.3); put(u, u.b, 13.5, 1.5, -4.3); u.idle(0.5); const on = u.b.ground === u.n; u.run(1.2, () => ({ mz: 1, jump: true })); u.idle(0.5); console.log('P1 Bolt on Nut\'s head', on, 'boosts onto the shelf (should be false)', u.b.pos.y > 3); }
{ const u = new Bot(level); let up = false; for (const z of [-4.2, -4.6, -5.2]) { const k = u.w.crates[0]; put(u, k, 13, 0.6, z); put(u, u.n, 13, 0.46, z - 1.6); put(u, u.b, 5, 0.56, -2); u.idle(0.4); u.tick({}, { power: true }); u.idle(2); up = up || k.pos.y > 3; } console.log('P1 Nut throws the crate up onto the shelf (should be false)', up); }
{ const u = new Bot(level); put(u, u.b, 15.6, 3.96, -2); put(u, u.n, 14.5, 3.86, -2); u.idle(0.3); u.tick({}, { power: true }); let top = 0; u.run(2.5, () => { top = Math.max(top, u.b.pos.y); return { mx: 1 }; }); console.log('P1 launch from the shelf toward the gate: Bolt x (should be < 24)', u.b.pos.x.toFixed(2), 'peak', top.toFixed(2)); }
{ const u = new Bot(level); put(u, u.b, 14, 3.96, -3.0); put(u, u.n, 14, 3.86, -1.8); u.idle(0.3); u.tick({}, { power: true }); let top = 0; u.run(2.5, () => { top = Math.max(top, u.b.pos.y - 0.55); return { mz: -1 }; }); console.log('P1 launch from the shelf at the back wall: peak feet (should be < 10)', top.toFixed(2), 'ends at y', u.b.pos.y.toFixed(2)); }
{ const u = new Bot(level); put(u, u.b, 13.6, 0.56, -4.3); put(u, u.n, 13.6, 0.46, -5.4); u.idle(0.3); u.tick({}, { power: true }); u.run(1.4, () => u.steer(u.b, 13.6, -2)); console.log('P1 cog by a launch from the floor (should be false)', u.w.cogs[0].got); }
// P2
{ const u = new Bot(level); put(u, u.b, 30.4, 0.56, -4); put(u, u.n, 29.3, 0.46, -4); u.idle(0.3); u.tick({}, { power: true }); u.run(2, () => ({ mx: 1 })); u.idle(1); console.log('P2 launch over the dock: zaps', u.w.stats.zaps[0], 'falls', u.w.stats.falls[0], '(should not both be 0)'); }
{ const u = new Bot(level); put(u, u.b, 30.4, 0.56, -4); u.idle(0.2); let i = 0; u.run(4, () => ({ mx: 1, jump: (i++ % 6) < 3 })); u.idle(1); console.log('P2 quick-jumping along the belt: zaps (should be 1)', u.w.stats.zaps[0], 'B at', u.pos(u.b)); }
{ const u = new Bot(level); put(u, u.b, 30.4, 0.56, -4); u.idle(0.2); u.run(4, () => ({ mx: 1 })); console.log('P2 walking against the belt: Bolt x (should be < 31)', u.b.pos.x.toFixed(2)); }
{ const u = new Bot(level); put(u, u.b, 42.5, 0.56, -4); put(u, u.n, 30.55, 0.46, -4); u.idle(0.3); u.tick({ mx: -0.3 }, {}); u.run(2, () => ({ power: true })); console.log('P2 Bolt pulls Nut over from the far side: pulls (should be 0)', u.w.stats.pulls, 'Nut at', u.pos(u.n)); }
{ const u = new Bot(level); put(u, u.n, 30.6, 0.46, -7.4); u.idle(0.2); u.tick({}, { power: true }); u.idle(0.3); console.log('P2 Nut flips the island switch from the near side (should be false)', u.w.switches[0].on); }
// P3
{ const u = new Bot(level); const [, A, B] = u.w.crates; put(u, u.b, 63, 0.56, -5.0); put(u, u.n, 50, 0.46, -2); put(u, A, 63, 0.62, -6.8); u.idle(4); put(u, B, 64, 0.62, -6.8); u.idle(4); console.log('P3 two crates without the switch: west', !!u.w.channels[3], 'east (should be undefined)', u.w.channels[4]); }
{ const u = new Bot(level); const A = u.w.crates[1]; put(u, u.n, 50, 0.46, -2); put(u, u.b, 71.8, 0.56, -3.6); put(u, A, 71.8, 0.62, -1.4); u.idle(0.3); u.tick({ mz: 0.3 }, {}); u.run(1.5, () => ({ power: true })); for (let i = 0; i < 2; i++) u.tick({ power: true, mz: -0.25 }, {}); u.run(1, () => ({ power: true })); u.idle(1); console.log('P3 Bolt reaches the crate into the east bay from the walkway: ch4 (should be undefined)', u.w.channels[4], 'zaps', u.w.stats.zaps[0], 'crate', u.pos(A)); }
{ const u = new Bot(level); const A = u.w.crates[1]; put(u, u.n, 50, 0.46, -2); put(u, u.b, 66, 0.56, -5.0); put(u, A, 66, 0.62, -3.3); u.idle(0.3); u.tick({ mz: 0.3 }, {}); u.run(1.5, () => ({ power: true })); u.goHold(66, -6.6, 3); let mx = 0; for (let i = 0; i < 300; i++) { u.tick({ power: true, ...u.steer(u.b, 68.3, -7.0) }, {}); mx = Math.max(mx, A.pos.x); } u.tick({}, {}); u.idle(3); console.log('P3 Bolt tries to carry the crate east along the belt: crate got to x', mx.toFixed(2), 'ch4 (should be undefined)', u.w.channels[4]); }
{ const u = new Bot(level); put(u, u.n, 59.3, 0.46, -2.0); u.idle(0.2); u.run(0.5, () => ({ jump: true })); u.tick({}, { power: true }); u.tick({}, {}); u.idle(1); console.log('P3 Nut throws a crate off the top rack (should be false)', u.w.crates.slice(1, 3).some(k => k.pos.y < 5)); }
// P4
{ const u = new Bot(level); put(u, u.b, 81.5, 0.56, -1.2); put(u, u.n, 80.4, 0.46, -1.2); u.idle(0.3); u.tick({}, { power: true }); u.run(2, () => ({ mx: 1 })); u.idle(1); console.log('P4 launch over the pit: falls', u.w.stats.falls[0], 'zaps', u.w.stats.zaps[0], '(should not both be 0)'); }
{ const u = new Bot(level); put(u, u.b, 80, 0.56, -4.2); put(u, u.n, 80, 0.46, -3.0); u.idle(0.3); u.tick({}, { power: true }); u.run(1, () => ({ mz: -1 })); u.idle(3); console.log('P4 launch onto the despatch belt and ride it: zaps (should be 1)', u.w.stats.zaps[0]); }
{ const u = new Bot(level); put(u, u.b, 81.2, 2.96, -6.4); put(u, u.n, 80.1, 2.86, -6.4); u.idle(0.05); u.tick({}, { power: true }); u.run(2, () => ({ mx: 1, mz: 1 })); u.idle(1); console.log('P4 launch from the despatch belt: falls', u.w.stats.falls[0], 'zaps', u.w.stats.zaps[0], '(should not both be 0)', u.pos(u.b)); }
{ const u = new Bot(level); const k = u.w.crates[3]; put(u, u.n, 60, 0.46, -2); put(u, u.b, 80, 0.56, -2.0); put(u, k, 80, 0.62, -3.7); u.idle(0.3); u.tick({ mz: -0.3 }, {}); u.run(1, () => ({ power: true })); u.run(2, () => ({ power: true, jump: true, mz: -1 })); u.idle(3); console.log('P4 Bolt jumps the parcel onto the despatch belt (should be false)', k.pos.y > 2.5 || !!u.w.channels[5]); }
console.log('stats', JSON.stringify(t.w.stats));
console.log('cog', t.w.cogs[0].got);
console.log(t.st(), 'complete', t.w.complete, t.log);
