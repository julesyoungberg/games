import { Bot } from './bot.mjs';
import level from '../src/lv/s27.js';
const t = new Bot(level); const A = t.w.anchors; const sw = t.w.switches;
const hanging = (a) => t.b.target && t.b.target.obj === a && t.b.hang;
const onHead = () => t.n.ground === t.b;
// Bolt grabs ring R when it is back at its low end; Nut waits behind him and jumps onto his head
const board = (R, nx, nz) => {
  t.waitFor(t => R.s < 0.01 && R.wait > 0.4, 30);
  t.tick({ mx: 0.3 }, {});
  for (let i = 0; i < 90 && !hanging(R); i++) t.tick({ power: true }, {});
  for (let i = 0; i < 80 && !onHead(); i++) t.tick({ power: true }, i < 10 ? { ...t.steer(t.n, t.b.pos.x, t.b.pos.z), jump: true } : t.steer(t.n, t.b.pos.x, t.b.pos.z));
  t.idle(0.1, { power: true });
  return hanging(R) && onHead();
};
const ride = (cond, sec, nutIn = () => ({})) => t.waitFor(cond, sec, { power: true }, nutIn);
const hop = (fx, fz = 0, sec = 1.0) => { t.tick({ power: true, mx: fx, mz: fz }, {}); t.tick({ power: true, mx: fx, mz: fz, jump: true }, {}); t.run(sec, () => ({ mx: fx, mz: fz, jump: true })); t.idle(0.3); };
const flipNear = (s) => (u) => (!s.on && Math.hypot(u.n.pos.x - s.x, u.n.pos.y - s.top - 0.6, u.n.pos.z - s.z) < 3.2 && u.w.t % 0.5 < 0.02) ? { power: true } : {};
// 1. Window Cleaning (+ golden cog): ride to the top; Nut hops off Bolt's head and pushes at the top of her hop
{ const R = A[0];
  t.go(1, 6.5, -4.6); t.go(0, 8.6, -4.6); t.idle(0.2);
  console.log('boarded', board(R), t.st());
  ride(u => R.s >= R.total - 0.01, 12); console.log('top', t.st(), onHead());
  t.tick({ power: true }, { jump: true }); t.run(0.28, () => ({ power: true }), () => ({ jump: true })); t.tick({ power: true }, { jump: true, power: true });
  t.run(0.6, () => ({ power: true }), () => t.steer(t.n, t.b.pos.x, t.b.pos.z)); t.idle(0.2, { power: true });
  console.log('switch', sw[0].on, 'cog', t.w.cogs[0].got, 'launches', t.w.stats.launches, 'back on', onHead(), t.st());
  ride(u => R.s < 0.01, 12); t.idle(0.2);
  t.go(0, 26, -3); t.go(1, 26, -5); console.log('gate', t.w.gates[0].open.toFixed(2));
  t.both(30.1, -1.5, 30.1, -6.6); console.log('P1', t.st(), t.log); }
// 2. Air Duct: the ring stops at the duct; Nut walks off Bolt's head into it, crawls through and opens Bolt's gate
{ const R = A[1];
  t.go(1, 30.2, -4.5); t.go(0, 32.2, -4.5); t.idle(0.2);
  console.log('boarded', board(R), t.st());
  ride(u => R.s >= R.total - 0.01, 8); console.log('at duct', t.st(), onHead());
  for (let i = 0; i < 60 && t.n.pos.x < 38.8; i++) t.tick({ power: true }, { mx: 1 });
  console.log('in duct', t.st());
  t.idle(0.2); t.go(0, 33.5, -1.2, 6);
  t.go(1, 45.5, -4.5, 6); t.run(0.6, () => ({}), () => ({ mx: 1 })); t.go(1, 47.6, -5.2); t.tick({}, { power: true }); t.idle(0.8);
  console.log('switch', sw[1].on, 'cage', t.w.lasers[1].on, t.st(), t.log.slice(-1));
  const M = A[2]; t.tick({ mx: 0.3 }, {}); for (let i = 0; i < 150 && !hanging(M); i++) t.tick({ power: true }, {});
  console.log('magnet', hanging(M), t.st()); hop(1, 0, 0.6); t.go(0, 45.6, -1.2, 6); t.run(0.5, () => ({ mx: 1 })); t.idle(0.5);
  t.both(48.5, -2.5, 48.5, -5); console.log('P2', t.st(), t.log); }
// 3. Interchange: ride to the island, Nut flips the curtain switch, change rings, ride across together
{ const R1 = A[3], R2 = A[4];
  t.go(1, 49.5, -4); t.go(0, 51.4, -4); t.idle(0.2);
  console.log('boarded', board(R1), t.st());
  ride(u => R1.s >= R1.total - 0.01, 8); console.log('at island', t.st(), onHead());
  t.run(0.5, () => ({ power: true }), () => ({ mx: 1 })); hop(1, 0, 0.4); t.go(0, 62.6, -0.8); t.go(1, 64.2, -5.2); t.tick({}, { power: true }); t.idle(0.4);
  console.log('island', t.st(), 'switch', sw[2].on, 'curtain', t.w.lasers[4].on, t.log.slice(-1));
  t.go(1, 62.6, -4); t.go(0, 64.1, -4); t.idle(0.2);
  console.log('boarded', board(R2), t.st());
  ride(u => R2.s >= R2.total - 0.01, 8); console.log('across', t.st(), onHead(), t.log.slice(-1));
  t.run(0.6, () => ({ power: true }), () => ({ mx: 1 })); t.idle(0.6);
  t.both(77.5, -2.5, 77.5, -5.5); console.log('P3', t.st(), t.log); }
// 4. Goods Hoist: ride straight up with Nut on Bolt's head
{ const R = A[5], M = A[6];
  t.go(1, 79.8, -4); t.go(0, 81.6, -4); t.idle(0.2);
  console.log('boarded', board(R), t.st());
  ride(u => R.s >= R.total - 0.01, 10); console.log('top', t.st(), onHead());
  t.tick({ power: true }, { jump: true }); t.run(0.6, () => ({ power: true }), () => ({ mx: 1, jump: true })); t.go(1, 88, -5, 4); console.log('Nut up', t.st());
  t.tick({ mx: 0.3 }, {}); t.tick({}, {}); for (let i = 0; i < 90 && !hanging(M); i++) t.tick({ power: true, mx: 0.3 }, {});
  console.log('magnet', hanging(M), t.st()); hop(1, 0, 0.6);
  t.both(91, -3, 91, -5.5); t.idle(1.5); }
// shortcut checks (separate worlds, positions set directly)
const put = (u, p, x, y, z) => { p.pos = { x, y, z }; p.prev = { ...p.pos }; p.vel = { x: 0, y: 0, z: 0 }; };
const spam = (u) => (u.w.t * 60 | 0) % 12 === 0 ? { power: true } : {};
{ const u = new Bot(level); put(u, u.b, 24, 0.56, -5.4); put(u, u.n, 24, 1.7, -5.4); u.idle(0.5); const on = u.n.ground === u.b; u.run(1.2, () => ({}), () => ({ jump: true, ...spam(u) })); console.log('Window: Nut hops off Bolt\'s head on the floor and pushes (should be false)', on, u.w.switches[0].on); }
{ const u = new Bot(level); put(u, u.b, 24, 0.56, -5.6); put(u, u.n, 24, 0.46, -4.4); u.idle(0.3); u.tick({}, { power: true }); let pk = 0; u.run(0.35, () => ({ mz: -0.2 })); u.tick({ mz: 0.5 }, {}); u.run(1.5, () => { pk = Math.max(pk, u.n.pos.y); return { power: true }; }, () => spam(u)); console.log('Window: launch Bolt, he reels Nut up, she pushes (should be false)', u.w.switches[0].on, 'pulls', u.w.stats.pulls, 'Nut peak', pk.toFixed(2)); }
{ const u = new Bot(level); put(u, u.b, 24, 0.56, -5.4); put(u, u.n, 23, 0.46, -5.4); u.idle(0.2); u.run(1.2, () => ({ mx: 1, jump: true })); console.log('Window: Bolt jumps at the switch cage (zaps should be 0, switch false)', u.w.stats.zaps[0], u.w.switches[0].on); }
{ const u = new Bot(level); const R = u.w.anchors[0]; put(u, u.n, 2, 0.46, -2); put(u, u.b, 8.6, 0.56, -4.6); u.waitFor(u => R.s < 0.01 && R.wait > 0.4, 20); u.tick({ mx: 0.3 }, {}); u.waitFor(u => R.s >= R.total - 0.01, 12, { power: true }); const hung = !!u.b.hang; u.tick({ power: true, jump: true }, {}); u.run(1, () => ({ jump: true })); console.log('cog by Bolt alone hopping off the top of the ring (should be false)', hung, u.w.cogs[0].got, u.w.switches[0].on); }
{ const u = new Bot(level); const R = u.w.anchors[1]; put(u, u.n, 30, 0.46, -7); put(u, u.b, 32, 0.56, -4.5); u.waitFor(u => R.s < 0.01 && R.wait > 0.4, 20); u.tick({ mx: 0.3 }, {}); u.waitFor(u => R.s >= R.total - 0.01, 10, { power: true }); const at = u.pos(u.b); let mx = 0; u.run(1.2, () => { mx = Math.max(mx, u.b.pos.x); return { power: true, mx: 1 }; }); u.tick({ power: true, mx: 1, jump: true }, {}); u.run(1.2, () => { mx = Math.max(mx, u.b.pos.x); return { mx: 1, jump: true }; }); console.log('Air Duct: Bolt alone at the duct mouth', at, 'gets in (should be false)', mx > 38.4, mx.toFixed(2)); }
{ let inDuct = false, pk = 0; for (const nz of [-2.2, -2.8]) { const v = new Bot(level); put(v, v.b, 37.4, 0.56, -4.5); put(v, v.n, 37.4, 0.46, nz); v.idle(0.3); v.tick({}, { power: true }); v.run(0.15, () => ({})); v.tick({ mz: 0.4 }, {}); v.run(0.3, () => { pk = Math.max(pk, v.n.pos.y - 0.45); return { power: true, mz: 0.4 }; }); v.run(0.6, () => { pk = Math.max(pk, v.n.pos.y - 0.45); return { power: true, mx: 1 }; }); v.run(1.5, () => { pk = Math.max(pk, v.n.pos.y - 0.45); return { mx: 1 }; }, () => ({ mx: 1 })); inDuct = inDuct || (v.n.pos.x > 38.5 && v.n.pos.y > 4.4); } console.log('Air Duct: launch Bolt, reel Nut up and drop her into the duct (should be false)', inDuct, 'Nut feet peak (duct floor is 4.6)', pk.toFixed(2)); }
{ const u = new Bot(level); put(u, u.b, 33.5, 0.56, -1.2); put(u, u.n, 30, 0.46, -7); u.idle(0.2); u.tick({ mx: 0.3 }, {}); u.run(2, () => ({ power: true })); console.log('Air Duct: Bolt grabs the magnet before Nut switches off the cage (zaps should be 1)', u.w.stats.zaps[0]); }
{ const u = new Bot(level); put(u, u.b, 52.5, 0.56, -4); put(u, u.n, 51.4, 0.46, -4); u.idle(0.3); u.tick({}, { power: true }); u.run(2, () => ({ mx: 1 })); console.log('Interchange: launch Bolt across (zaps should be 1)', u.w.stats.zaps[0]); }
{ const u = new Bot(level); put(u, u.b, 62.6, 0.56, -4); put(u, u.n, 53.4, 0.46, -4); u.idle(0.3); u.tick({ mx: -0.3 }, {}); u.run(2.5, () => ({ power: true })); console.log('Interchange: Bolt on the island reels Nut over (Nut zaps should be 1)', u.w.stats.zaps[1]); }
{ const u = new Bot(level); put(u, u.b, 75.8, 0.56, -4); put(u, u.n, 66, 0.46, -4); u.idle(0.3); u.tick({ mx: -0.3 }, {}); u.run(2.5, () => ({ power: true })); console.log('Interchange: Bolt on the far side reels Nut off the island (Nut zaps should be 1)', u.w.stats.zaps[1]); }
{ const u = new Bot(level); const R = u.w.anchors[4]; put(u, u.n, 62.5, 0.46, -7); put(u, u.b, 64.1, 0.56, -4); u.idle(0.1); u.waitFor(u => R.s < 0.01 && R.wait > 0.4, 20); u.tick({ mx: 0.3 }, {}); u.waitFor(u => R.s >= R.total - 0.01, 10, { power: true }); console.log('Interchange: Bolt rides the second ring without the switch (zaps should be 1)', u.w.stats.zaps[0]); }
{ const u = new Bot(level); put(u, u.b, 84.5, 13.06, -4); put(u, u.n, 83.4, 0.46, -4); u.idle(0.3); u.tick({ mx: -0.3 }, {}); let pk = 0; u.run(2, () => { pk = Math.max(pk, u.n.pos.y); return { power: true }; }); console.log('Hoist: Bolt on the roof reels Nut up (Nut peak should stay 0.46)', pk.toFixed(2), 'distance', Math.hypot(84.5 - 83.4, 13.06 - 0.46).toFixed(2)); }
{ const u = new Bot(level); put(u, u.b, 83, 0.56, -4); put(u, u.n, 81.9, 0.46, -4); u.idle(0.3); u.tick({}, { power: true }); let pk = 0; u.run(1.5, () => { pk = Math.max(pk, u.b.pos.y - 0.55); return { mx: 1 }; }); console.log('Hoist: launch Bolt at the tower (feet peak, roof is 12.5)', pk.toFixed(2)); }
console.log('stats', JSON.stringify(t.w.stats));
console.log('cog', t.w.cogs[0].got);
console.log(t.st(), 'complete', t.w.complete, t.log);
