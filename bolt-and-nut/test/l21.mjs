import { Bot } from './bot.mjs';
import level from '../src/lv/s21.js';
const t = new Bot(level); const c = t.w.crates;
const away = (who, x, z) => t.go(who, x, z, 10, 0.25);
// golden cog: Bolt on the suggestion box, Nut launches him
t.go(1, 6, -4.3); t.go(0, 3.4, -2.5); t.idle(0.2);
for (let i = 0; i < 60; i++) t.tick(i > 30 ? t.steer(t.b, 6, -2.5) : { mx: 1, jump: true }, {});
t.idle(0.3); console.log('on box', t.b.ground === c[0]);
t.tick({}, { power: true }); t.run(1.4, () => ({ mz: -0.25 })); t.idle(0.8); console.log('cog', t.w.cogs[0].got, t.st(), t.log);
// 1. Lost Property
t.go(0, 6, -0.8); t.go(0, 11.5, -1.5); t.go(0, 11.5, -2.6, 2, 0.15); t.grab(0, -1, 1.5); console.log('grab', c[1].pulledBy === t.b, t.pos(c[1]));
t.carry(c[1], 18.2, -3.3, 0, -1); console.log('placed', t.pos(c[1]), t.st());
t.go(0, 14, -1);
t.go(1, 12, -0.8); t.go(1, 18.2, -0.8); t.go(1, 18.2, -2.0, 3, 0.1); t.idle(0.2);
t.tick({}, { power: true }); t.idle(2); console.log('fired', t.pos(c[1]), 'ch1', t.w.channels[1]);
t.both(24.5, -3, 24.5, -5.5); console.log('P1', t.st(), t.log);
// 2. Inbox
t.go(1, 28.2, -1.4); t.idle(0.3); console.log('belt reversed', t.w.channels[2]);
t.go(0, 31, -3.0); t.go(0, 35, -2.6, 3, 0.1);
console.log("pre", t.st()); for (let i = 0; i < 120 && c[2].pos.x < 35.3; i++) t.tick({ mz: -0.7 }, {}); console.log("post", t.st(), t.pos(c[2]));
t.go(0, 35.5, -1.5); t.idle(3); console.log('inbox', t.pos(c[2]), 'ch3', t.w.channels[3], t.st());
t.go(1, 30, -1.5); t.both(44, -2.5, 44, -1.5); t.both(47, -2.5, 47, -4.5); console.log('P2', t.st(), t.log);
// 3. Commute
const W = c[3];
const mount = (who, x) => { const p = t.w.players[who]; t.go(who, 50.6, -4); t.idle(0.2); for (let i = 0; i < 70; i++) { const inp = i > 30 ? t.steer(p, x, -4) : { mx: 1, jump: true }; t.tick(who === 0 ? inp : {}, who === 1 ? inp : {}); } t.idle(0.3); return p.ground === W; };
console.log('Bolt on crate', mount(0, W.pos.x));
t.go(1, 49.5, -6.6); t.waitFor(t => W.pos.x > 63.2, 6); t.idle(0.3); console.log('across', t.st(), t.pos(W));
t.go(0, 65.4, -4); t.go(0, 66, -2.5); console.log('B off', t.st());
t.go(1, 48.5, -4); t.waitFor(t => W.pos.x < 52.7, 6); t.idle(0.3);
console.log('Nut on crate', mount(1, W.pos.x));
t.go(0, 67, -6.6); t.waitFor(t => W.pos.x > 63.2, 6); t.idle(0.3); t.go(1, 65.4, -4); t.go(1, 66, -2.5);
t.both(69, -2, 69, -4); console.log('P3', t.st(), t.log);
// 4. Top Shelf
const K = c[4];
t.go(1, 72, -1); t.launchBolt(78, -3.3, 0, -1, 0.8); console.log('mezz', t.st(), t.log.slice(-1));
t.go(0, 78, -4.6, 3, 0.15); t.go(1, 78, -2.2); t.go(0, 78, -6.0, 3, 0.15); t.tick({ mz: 0.3 }, {}); t.pullNut(78.5, -7.2, 2); console.log('nut up', t.st());
t.go(1, 79, -4.6); t.go(0, 77, -6.5, 3, 0.15); t.grab(-1, 0, 1.5); console.log('crate', K.pulledBy === t.b, t.pos(K));
t.carry(K, 79.2, -6.0, 1, 0); console.log('placed', t.pos(K), t.st());
t.go(0, 76.6, -4.4); t.go(0, 76.6, -2.5); t.go(1, 77.9, -6.0, 3, 0.1); t.idle(0.3);
t.tick({}, { power: true }); t.idle(2); console.log('fired', t.pos(K), 'ch5', t.w.channels[5], t.st());
t.go(1, 77.9, -3); t.go(1, 77.9, -2); console.log("down", t.st(), t.log.slice(-1)); t.both(87, -2, 87, -1); t.both(94, -3, 94, -5.5); t.idle(1.5);
// shortcut checks (separate worlds, positions set directly)
const put = (u, p, x, y, z) => { p.pos = { x, y, z }; p.prev = { ...p.pos }; };
{ const u = new Bot(level); put(u, u.w.crates[0], 2, 0.6, -7); put(u, u.b, 6, 0.56, -2.2); put(u, u.n, 6, 0.46, -3.6); u.idle(0.3); u.tick({}, { power: true }); u.run(1.4, () => ({ mz: -0.25 })); console.log('cog by plain launch (should be false)', u.w.cogs[0].got); }
{ const u = new Bot(level); const k = u.w.crates[1]; let out = false; for (const [nx, nz] of [[9.2, -4.3], [11.5, -4.3], [13.8, -4.3], [10, -4.3]]) { put(u, k, 11.5, 0.6, -6.5); k.vel = { x: 0, y: 0, z: 0 }; put(u, u.n, nx, 0.46, nz); put(u, u.b, 2, 0.56, -2); u.idle(0.5); u.tick({}, { power: true }); u.idle(2); out = out || k.pos.z > -4.8 || k.pos.x < 10 || k.pos.x > 13; } console.log('Nut gets the crate out of the cage alone (should be false)', out); }
{ const u = new Bot(level); const k = u.w.crates[2]; put(u, u.b, 35, 0.56, -2.0); put(u, u.n, 20, 0.46, -2); u.idle(0.3); u.run(0.6, () => ({ mz: -0.7 })); u.run(5, () => u.steer(u.b, 28.2, -1.4)); console.log('Inbox solo: Bolt reached the plate', u.w.channels[2], 'crate went to the shredder', u.log.some(e => e.includes('crate-lost')), 'cage plate (should be undefined)', u.w.channels[3]); }
{ const u = new Bot(level); put(u, u.b, 51.0, 0.56, -4); put(u, u.n, 49.9, 0.46, -4); u.idle(0.3); u.tick({}, { power: true }); u.run(2, () => ({ mx: 1 })); console.log('Commute launch over: zaps (should be 1)', u.w.stats.zaps[0], 'B at', u.pos(u.b)); }
{ const u = new Bot(level); put(u, u.b, 64.3, 1.16, -4); put(u, u.n, 53.05, 0.46, -4); u.idle(0.3); u.tick({ mx: -0.3 }, {}); u.run(2, () => ({ power: true })); console.log('Commute pull Nut across from closest spots: pulled', u.w.stats.pulls, 'Nut ends at', u.pos(u.n), '(should be 0: out of reach)'); }
{ const u = new Bot(level); const k = u.w.crates[4]; let hit = false; for (const x0 of [79, 80, 81]) { put(u, k, x0, 0.6, -3.6); k.vel = { x: 0, y: 0, z: 0 }; put(u, u.n, x0, 0.46, -2.3); put(u, u.b, 70, 0.56, -2); u.idle(0.4); u.tick({}, { power: true }); u.idle(2); hit = hit || !!u.w.channels[5]; } console.log('Top Shelf thrown from the floor reaches the plate (should be false)', hit); }
console.log('stats', JSON.stringify(t.w.stats));
console.log('cog', t.w.cogs[0].got);
console.log(t.st(), 'complete', t.w.complete, t.log);
