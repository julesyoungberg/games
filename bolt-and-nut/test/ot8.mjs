import { Bot } from './bot.mjs';
import def from '../src/lv/ot8.js';
const t = new Bot(def); const A = t.w.anchors;
// Nut runs after the hanging Bolt and jumps onto his head
const board = (u) => { let jt = -99; for (let i = 0; i < 240; i++) {
  const n = u.n, b = u.b, dx = b.pos.x - n.pos.x; let inp;
  if (n.ground === b) { if (i > jt + 20) return true; inp = {}; }
  else if (n.grounded && dx < 1.8 && dx > 0) { jt = i; inp = { jump: true, mx: 1 }; }
  else if (!n.grounded) inp = { jump: i - jt < 25, mx: dx > 0.05 ? 1 : 0.37 };
  else inp = { mx: 1 };
  u.tick({ power: true }, inp); } return false; };
// Bolt grabs ring a while it rests at its near end
const catchRing = (u, a, x, sec = 20) => { u.waitFor(u => a.wait > 0 && a.dir > 0 && a.x < x, sec); u.tick({ mx: 0.3 }, {}); u.run(0.2, () => ({ power: true })); return !!(u.b.target && u.b.target.obj === a); };
// 1. Carpool: Bolt rides the low ring, Nut rides Bolt
t.both(7.8, -4, 5, -4);
console.log('ring1', catchRing(t, A[0], 8.1), 'boarded', board(t), t.st());
for (let i = 0; i < 900 && !(A[0].wait > 0 && A[0].dir < 0); i++) t.tick({ power: true }, {});
console.log('ride1', t.st(), 'nut on bolt', t.n.ground === t.b);
t.idle(0.5); t.both(23.5, -2.5, 23.5, -5.5); console.log('P1', t.st(), t.log);
// 2. Request Stop: Nut hops off onto the pillar plate (gate latches), Bolt rides on, then reels her in
t.both(25.3, -4, 23, -4);
console.log('ring2', catchRing(t, A[1], 25.6), 'boarded', board(t), t.st());
t.waitFor(t => t.b.pos.x > 33.6, 10, { power: true });
for (let i = 0; i < 90; i++) { const s = t.steer(t.n, 34.5, -6.8); t.tick({ power: true }, { ...s, jump: i < 25 }); }
console.log('stop', t.st(), 'plate', t.w.channels[1]);
t.waitFor(t => A[1].x > 42.5, 12, { power: true }); t.idle(0.8); console.log('far side', t.st(), 'gate', t.w.gates[0].open);
t.go(0, 41.6, -5.5); t.tick({ mx: -0.3 }, {}); t.pullNut(44, -5); console.log('P2', t.st(), t.log);
t.both(47, -3, 47, -5); t.idle(1.5);
console.log('stats', JSON.stringify(t.w.stats));
console.log(t.st(), 'complete', t.w.complete, t.log);
// checks: without the plate the gate stops the ride; a launch from the platform cannot reach the pillar
{ const u = new Bot(def); u.b.pos = { x: 25.3, y: 0.6, z: -4 }; u.n.pos = { x: 23, y: 0.5, z: -4 }; u.b.prev = { ...u.b.pos }; u.n.prev = { ...u.n.pos }; u.idle(0.2);
  catchRing(u, A.length && u.w.anchors[1], 25.6); board(u);
  for (let i = 0; i < 600; i++) u.tick({ power: true }, {}); console.log('no plate: blocked at gate', u.b.pos.x < 38.5, u.st()); }
{ let best = 0; for (let k = 0; k < 6; k++) { const u = new Bot(def); u.b.pos = { x: 26.4, y: 0.6, z: -6.4 + k * 0.2 }; u.n.pos = { x: 25.3, y: 0.5, z: -6.4 + k * 0.2 }; u.b.prev = { ...u.b.pos }; u.n.prev = { ...u.n.pos }; u.idle(0.3);
  u.tick({}, { power: true }); for (let i = 0; i < 90; i++) { u.tick({ mx: 1 }, {}); if (u.b.pos.y > 0) best = Math.max(best, u.b.pos.x); } if (u.w.channels[1]) best = 99; }
  console.log('launch from the platform reaches x', best.toFixed(2), '(pillar starts at 33.5)'); }
// golden cog: Nut jumps off Bolt's head in the middle of the first ride
{ const u = new Bot(def); u.both(7.8, -4, 5, -4); catchRing(u, u.w.anchors[0], 8.1); board(u);
  u.waitFor(u => u.b.pos.x > 15.4, 10, { power: true });
  for (let i = 0; i < 60; i++) u.tick({ power: true }, i > 5 && u.n.ground === u.b ? {} : { jump: i < 25, mx: 0.37 + u.b.pos.x - u.n.pos.x }); for (let i = 0; i < 600 && !(u.w.anchors[0].wait > 0 && u.w.anchors[0].dir < 0); i++) u.tick({ power: true }, {});
  console.log('cog', u.w.cogs[0].got, 'safe', u.st(), u.log); }
