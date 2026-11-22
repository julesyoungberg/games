import { Bot } from './bot.mjs';
import def from '../src/lv/ot23.js';
const S = 3, P = 2, Y = 4;
const t = new Bot(def); const A = t.w.anchors, crate = t.w.crates[0];
// Nut runs after the hanging Bolt and jumps onto his head (as on the commuter line)
const board = (u) => { let jt = -99; for (let i = 0; i < 240; i++) {
  const n = u.n, b = u.b, dx = b.pos.x - n.pos.x; let inp;
  if (n.ground === b) { if (i > jt + 20) return true; inp = {}; }
  else if (n.grounded && dx < 1.8 && dx > 0) { jt = i; inp = { jump: true, mx: 1 }; }
  else if (!n.grounded) inp = { jump: i - jt < 25, mx: dx > 0.05 ? 1 : 0.37 };
  else inp = { mx: 1 };
  u.tick({ power: true }, inp); } return false; };
const catchRing = (u, a, x, sec = 20) => { u.waitFor(u => a.wait > 0 && a.dir > 0 && a.x < x, sec); u.tick({ mx: 0.3 }, {}); u.run(0.2, () => ({ power: true })); return !!(u.b.target && u.b.target.obj === a); };
// Sleigh Ride: Bolt grabs the ring at the near end, Nut boards
t.both(5, -4, 2.5, -4);
console.log('ring', catchRing(t, A[0], 5.5, 40), 'boarded', board(t), t.st());
// riding past the sack, Nut throws the present a little before she is over it
t.waitFor(u => u.n.pos.x > crate.pos.x - 1.4, 12, { power: true }); console.log('over the roofs', t.st(), t.pos(crate));
t.tick({ power: true }, { power: true }); t.run(1.5, () => ({ power: true })); console.log('present', t.pos(crate), 'chimney', !!t.w.channels[1], t.log);
// ride on to the far roof and hop off at the end of the line
for (let i = 0; i < 900 && !(A[0].wait > 0 && A[0].dir < 0); i++) t.tick({ power: true }, {});
t.idle(0.6); console.log('far roof', t.st(), 'nut on bolt', t.n.ground === t.b, t.log);
t.go(1, 31.5, -5, 4); t.both(31, -2.5, 31, -5); console.log('P1', t.st(), t.log, 'gate', t.w.gates[0].open.toFixed(2));
// golden cog: Nut launches Bolt up to the star
t.go(0, 32, -6.6, 6, 0.1); t.go(1, 32, -5.4, 6, 0.1); t.idle(0.2); t.tick({}, { power: true }); t.run(1.4, () => t.steer(t.b, 32, -6.6)); t.idle(0.5); console.log('cog', t.w.cogs[0].got, t.st());
t.both(42.5, -3, 42.5, -5); t.idle(1.5);
console.log('stats', JSON.stringify(t.w.stats));
console.log(t.st(), 'complete', t.w.complete, 'cog', t.w.cogs[0].got, 'falls', JSON.stringify(t.w.stats.falls), 'zaps', JSON.stringify(t.w.stats.zaps), JSON.stringify(t.log));

const put = (u, p, x, y, z) => { p.pos = { x, y, z }; p.prev = { ...p.pos }; };
const sack = c => Math.abs(c.pos.x - 17) < 0.2 && Math.abs(c.pos.z + 4) < 0.2 && Math.abs(c.pos.y - (S + 0.6)) < 0.05;
// ---- shortcut checks
{ // Bolt rides alone to the far roof: the gate stays shut
  const u = new Bot(def); u.both(5, -4, 2.5, -6); catchRing(u, u.w.anchors[0], 5.5, 40);
  for (let i = 0; i < 900 && !(u.w.anchors[0].wait > 0 && u.w.anchors[0].dir < 0); i++) u.tick({ power: true }, {}); u.idle(0.6);
  u.go(0, 34.2, -4, 6); console.log('bolt alone rides to the far roof (gate should stay shut)', u.pos(u.b), 'gate', u.w.gates[0].open.toFixed(2), 'chimney', !!u.w.channels[1]); }
{ // Bolt reels the present from the edge of the yard: the rim of the sack snags it
  const u = new Bot(def); const c = u.w.crates[0]; put(u, u.b, 9.6, 0.6, -4); u.idle(0.2); u.tick({ mx: 0.3 }, {}); let held = false;
  for (let i = 0; i < 300; i++) { u.tick({ power: true }, {}); held = held || !!c.pulledBy; } const still = Math.abs(c.pos.x - 17) < 0.7 && c.pos.y > S; u.idle(1);
  console.log('reel the present from the yard (grabbed, but snagged in the sack)', held, still, u.pos(c)); }
{ // Bolt reels it from the far roof: out of range
  const u = new Bot(def); const c = u.w.crates[0]; put(u, u.b, 29.3, Y + 0.6, -4); u.idle(0.2); u.tick({ mx: -0.3 }, {}); let held = false;
  for (let i = 0; i < 240; i++) { u.tick({ power: true }, {}); held = held || !!c.pulledBy; } console.log('reel the present from the far roof (should be false)', held); }
{ // Nut throws from the edge of the yard: out of range
  const u = new Bot(def); const c = u.w.crates[0]; put(u, u.n, 9.6, 0.5, -4); u.idle(0.2); u.tick({}, { power: true }); u.idle(1); console.log('nut throws from the yard (present should not move)', sack(c), u.pos(c)); }
{ // Nut jumps off Bolt onto the chimney roof: lasers
  const u = new Bot(def); u.both(5, -4, 2.5, -4); catchRing(u, u.w.anchors[0], 5.5, 40); board(u); u.waitFor(v => v.b.pos.x > 21.2, 12, { power: true });
  for (let i = 0; i < 60; i++) u.tick({ power: true }, { jump: i < 20, mx: 0.3 }); u.idle(1, { power: true }); console.log('nut hops off onto the chimney roof (should zap)', u.log, 'chimney', !!u.w.channels[1]); }
{ // Nut hops off into the sack and throws from there: standing on the present she can only throw it straight up
  const u = new Bot(def); const c = u.w.crates[0]; put(u, u.n, 17.2, S + 1.75, -4.1); u.idle(0.5); const on = u.n.ground === c; let maxDx = 0;
  for (let k = 0; k < 3; k++) { u.tick({}, { power: true }); for (let i = 0; i < 60; i++) { u.tick({}, {}); maxDx = Math.max(maxDx, Math.abs(c.pos.x - 17)); } }
  console.log('nut in the sack throws the present (it only goes straight up, chimney false)', on, !!u.w.channels[1], 'max sideways', maxDx.toFixed(2), u.pos(c)); }
{ // Bolt drops off the ring into the sack and carries the present: he is stuck on the pillar with it
  const u = new Bot(def); const c = u.w.crates[0]; put(u, u.b, 17, S + 1.8, -4); u.idle(0.5); u.tick({ mx: 0.3 }, {}); u.run(1, () => ({ power: true })); const held = !!c.pulledBy;
  u.run(2, () => ({ power: true, mx: 1 })); u.idle(1); console.log('bolt alone in the sack carries the present (chimney should be false)', held, !!u.w.channels[1], u.pos(u.b), u.log); }
{ const u = new Bot(def); u.w.checkpoints[0].hit = true; u.w.cp = { b: { x: 31, z: -2.5 }, n: { x: 31, z: -5 } }; put(u, u.b, 34.3, Y + 0.6, -4); put(u, u.n, 33.2, Y + 0.5, -4); u.idle(0.3); u.tick({}, { power: true }); u.run(1.6, () => ({ mx: 1 })); u.idle(0.5); console.log('launch over the gate (should be false)', u.b.pos.x > 36, u.pos(u.b)); }
{ const u = new Bot(def); put(u, u.b, 33, Y + 0.6, -7.4); put(u, u.n, 33, Y + 0.5, -6.2); u.idle(0.3); u.tick({}, { power: true }); u.run(1.6, () => ({ mz: -1, mx: 1 })); u.idle(0.5); console.log('launch at the back wall (should be false)', u.b.pos.x > 36, u.pos(u.b)); }
{ const u = new Bot(def); put(u, u.b, 9.6, 0.6, -4); put(u, u.n, 8.5, 0.5, -4); u.idle(0.3); u.tick({}, { power: true }); u.run(1.6, () => ({ mx: 1 })); u.idle(0.5); console.log('launch from the yard into the pit (falls)', u.log); }
// lost present: a miss falls in the pit and goes back in the sack; one left in the yard can be thrown in the pit to send it back
{ const u = new Bot(def); const c = u.w.crates[0]; c.vel = { x: -6, y: 13, z: 0 }; c.grounded = false; u.idle(3.5); console.log('missed throw goes back in the sack', sack(c), u.log); }
{ const u = new Bot(def); const c = u.w.crates[0]; put(u, c, 8.5, 0.6, -4); put(u, u.n, 7.2, 0.5, -4); u.idle(0.3); u.tick({}, { power: true }); u.idle(3); console.log('present in the yard, thrown in the pit, back in the sack', sack(c), u.log); }
// golden cog: a boost, and Nut jumping off Bolt's head at the end of the line, miss
{ const u = new Bot(def); put(u, u.n, 32, Y + 0.5, -6.6); put(u, u.b, 32, Y + 1.5, -6.6); u.idle(0.3); u.run(1.2, () => ({ jump: true })); console.log('cog by boost (should be false)', u.w.cogs[0].got); }
{ const u = new Bot(def); u.both(5, -4, 2.5, -4); catchRing(u, u.w.anchors[0], 5.5, 40); board(u); u.waitFor(v => v.w.anchors[0].wait > 0 && v.w.anchors[0].dir < 0, 20, { power: true });
  let top = 0; for (let i = 0; i < 60; i++) { u.tick({ power: true }, { jump: i < 25, ...u.steer(u.n, 32, -6.6) }); top = Math.max(top, u.n.pos.y); } console.log('cog by nut jumping off Bolt at the end of the line (should be false)', u.w.cogs[0].got, 'nut centre max', top.toFixed(2)); }
