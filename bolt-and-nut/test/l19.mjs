import { Bot } from './bot.mjs';
import level from '../src/lv/s19.js';
const t = new Bot(level); const c = t.w.crates; const A = t.w.anchors;
const press = () => { t.tick({}, { power: true }); t.idle(0.3); };
// 1. Bank Shot
t.go(1, 4, -1.5); t.idle(0.5); console.log('pen', t.w.channels[1]);
t.go(0, 3, -6.5); t.idle(0.5);
for (let i = 0; i < 300 && c[0].pos.x < 11; i++) t.tick({ mx: 1 }, {});
t.idle(3); console.log('crate1', t.pos(c[0]), 'ch2', t.w.channels[2], t.st(), t.log);
t.go(0, 12.5, -2.5, 6, 0.4); t.go(1, 15, -2); t.both(22, -2, 21, -4); t.both(25, -3, 25, -5.5); console.log('P1', t.st(), t.log);
// 2. Sky Tram
const R = A[0];
t.go(0, 28.6, -4); t.go(1, 27.5, -4); t.idle(0.2);
t.waitFor(t => R.dir > 0 && R.s < 0.01 && R.wait > 0.3, 20);
t.tick({}, { power: true }); console.log('launch', t.st(), t.log.slice(-1));
let hung = false, pw = false;
for (let i = 0; i < 120 && !hung; i++) { pw = pw || t.b.vel.y < 3; t.tick({ mx: 0.3, power: pw }, {}); hung = t.b.hang && t.b.target.obj === R; }
console.log('ring', hung, t.st(), R.x.toFixed(2));
t.waitFor(t => R.wait > 0 && R.dir < 0, 10, { power: true }); t.idle(1.5); console.log('dropped', t.st(), t.log.slice(-1));
t.go(1, 30.4, -4); t.go(0, 40.5, -4); t.tick({ mx: -0.3 }, {}); t.pullNut(42, -3, 3); t.both(41.5, -2, 41.5, -4.5); console.log('P2', t.st(), t.log);
// 3. Mail Slot
t.launchBolt(44, -3.6, 0, -1, 0.6); console.log('shelf', t.st(), t.log.slice(-1));
t.go(0, 44, -6.4, 3, 0.15); t.idle(0.2);
for (let i = 0; i < 300 && c[1].pos.y > 2.5 && t.b.pos.x < 47.85; i++) t.tick({ mx: 0.5 }, {});
t.idle(2.5); console.log('mail', t.pos(c[1]), 'ch3', t.w.channels[3], t.st(), t.log.slice(-1));
t.go(0, 47.5, -3); t.idle(0.5); t.both(53, -2, 53, -3.5); t.both(59, -3, 59, -5.5); console.log('P3', t.st(), t.log.slice(-2));
// 4. Signal Tower
const hanging = (a) => t.b.target && t.b.target.obj === a && t.b.hang;
const cling = (a, fx, fz = 0, sec = 3) => { t.tick({ mx: fx * 0.3, mz: fz * 0.3 }, {}); for (let i = 0; i < sec * 60 && !hanging(a); i++) t.tick({ power: true }, {}); return hanging(a); };
const hop = (fx, fz = 0, sec = 1.2) => { t.tick({ power: true, mx: fx, mz: fz }, {}); t.tick({ power: true, mx: fx, mz: fz, jump: true }, {}); t.run(sec, () => ({ mx: fx, mz: fz, jump: true })); t.idle(0.3); };
t.go(1, 60, -6.5); t.go(0, 61, -4.8);
console.log('cling', cling(A[1], 1), t.st()); hop(1, 0, 0.3); console.log('tower', t.st());
t.go(0, 64.6, -7.2); t.go(1, 61.5, -7.2); t.tick({ mx: -0.3 }, {}); t.pullNut(66, -6.5, 3); console.log('nut up', t.st());
// golden cog: Nut, up on the tower, launches Bolt straight up
t.go(0, 65.8, -4.5); t.go(1, 64.8, -6); t.go(0, 66, -6, 3, 0.15); t.idle(0.3); t.tick({}, { power: true }); t.idle(2); console.log('cog', t.w.cogs[0].got, t.st());
if (!t.w.switches[0].on) press(); console.log('switch', t.w.switches[0].on, 'ch4', t.w.channels[4]);
t.go(0, 69, -2); t.idle(0.6); t.go(1, 69, -5); t.idle(0.6); t.both(74, -3, 74, -5.5); console.log('P4', t.st(), t.log.slice(-2));
// 5. Top Floor
const M = A[2];
t.go(1, 77, -6.6); t.go(0, 81, -4); t.idle(0.3);
{ let pw = false, sprung = false; for (let i = 0; i < 240 && !hanging(M); i++) { sprung = sprung || t.b.vel.y > 10; pw = pw || (sprung && t.b.pos.x > 89.3); t.tick({ mx: 1, power: pw }, {}); } }
console.log('magnet', hanging(M), t.st(), t.log.slice(-1));
hop(1, 0, 0.3); t.go(0, 92.6, -6.3); console.log('top', t.st(), 'ch5', t.w.channels[5], t.w.lasers[2].on);
{ let went = false; for (let i = 0; i < 360 && !went; i++) { const ox = t.n.pos.x; t.tick({}, t.steer(t.n, 80, -6.6)); went = Math.abs(t.n.pos.x - ox) > 1.5; } t.idle(1.2); console.log('tube', went, t.st()); }
t.both(98, -3, 98, -5); t.idle(1.5);
// cog checks: a jump or a boost on the tower falls short; a launch from the floor cannot reach the top floor magnet; a jump or boost cannot reach the ring
const put = (u, p, x, y, z) => { p.pos = { x, y, z }; p.prev = { ...p.pos }; };
{ const u = new Bot(level); put(u, u.b, 67.6, 7.6, -6); put(u, u.n, 65, 7.5, -6.5); u.idle(0.3); u.run(1, () => ({ jump: true })); console.log('cog by jump (should be false)', u.w.cogs[0].got); }
{ const u = new Bot(level); put(u, u.n, 67.6, 7.5, -6); put(u, u.b, 67.6, 8.6, -6); u.idle(0.5); const onNut = u.b.ground === u.n; u.run(1, () => ({ jump: true })); console.log('cog by boost (should be false)', onNut, u.w.cogs[0].got); }
{ const u = new Bot(level); put(u, u.b, 89.4, 0.6, -4); put(u, u.n, 88.2, 0.5, -4); u.idle(0.3); u.tick({}, { power: true }); let got = false; for (let i = 0; i < 60; i++) { u.tick({ mx: 0.3, power: i > 20 }, {}); got = got || !!(u.b.target && u.b.target.obj === u.w.anchors[2]); } console.log('top magnet by launch (should be false)', got); }
{ const u = new Bot(level); put(u, u.n, 30.3, 0.5, -4); put(u, u.b, 30.3, 1.6, -4); u.idle(0.5); u.waitFor(u => u.w.anchors[0].s < 0.01 && u.w.anchors[0].wait > 0.3, 20); const onNut = u.b.ground === u.n; let got = false; for (let i = 0; i < 50; i++) { u.tick({ mx: 0.3, jump: i < 30, power: i > 18 }, {}); got = got || !!(u.b.target && u.b.target.obj === u.w.anchors[0]); } console.log('ring by boost (should be false)', onNut, got); }
console.log('stats', JSON.stringify(t.w.stats));
console.log('cog', t.w.cogs[0].got);
console.log(t.st(), 'complete', t.w.complete, t.log);
