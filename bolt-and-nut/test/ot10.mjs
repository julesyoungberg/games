import { Bot } from './bot.mjs';
import def from '../src/lv/ot10.js';
const t = new Bot(def); const A = t.w.anchors;
const hanging = (u, a) => u.b.target && u.b.target.obj === a && u.b.hang;
const cling = (u, a, fx, fz = 0, sec = 3) => { u.tick({ mx: fx * 0.3, mz: fz * 0.3 }, {}); for (let i = 0; i < sec * 60 && !hanging(u, a); i++) u.tick({ power: true }, {}); return hanging(u, a); };
// Nut runs off the edge and lands on the clinging Bolt's head (Bolt keeps holding X)
const board = (u, edge) => { u.go(1, edge - 2.2, -7.45, 8, 0.1, { power: true }); u.idle(0.2, { power: true });
  for (let i = 0; i < 90; i++) { const air = !u.n.grounded; const dx = u.b.pos.x - u.n.pos.x;
    u.tick({ power: true }, { mx: air ? Math.max(-1, Math.min(1, dx * 2)) : 1, mz: (-7.45 - u.n.pos.z), jump: (u.n.pos.x > edge - 0.6 && i < 60) || air }); if (u.n.ground === u.b && i > 30) break; }
  u.idle(0.3, { power: true }); return u.n.ground === u.b; };
// Nut jumps off Bolt's head over the fence
const leap = (u) => { for (let i = 0; i < 70; i++) u.tick({ power: true }, { mx: 1, jump: i < 25 }); u.idle(0.5, { power: true }); };
const press = (u) => { u.tick({}, { power: true }); u.idle(0.3); };
// 1. Stepping Stone
t.go(1, 6, -5); t.go(0, 9.4, -7.45);
console.log('cling', cling(t, A[0], 1), t.st());
console.log('board', board(t, 10), t.st());
leap(t); console.log('over', t.st(), t.log);
t.go(1, 18, -6.6, 4, 0.25, { power: true }); t.tick({ power: true }, { power: true }); t.idle(0.3, { power: true }); console.log('switch', t.w.channels[1], t.w.lasers[0].on);
t.tick({ power: true, mx: 1 }, {}); t.tick({ power: true, mx: 1, jump: true }, {}); t.run(1, () => ({ mx: 1, jump: true })); t.idle(0.4);
t.both(18, -3, 18, -5.5); console.log('P1', t.st(), t.log);
// 2. Carpool Lane: magnet A with Nut aboard, swap to magnet B, Nut leaps over the fence
t.go(1, 22, -5); t.go(0, 25.4, -7.45);
console.log('clingA', cling(t, A[1], 1), t.st());
console.log('boardA', board(t, 26), t.st());
t.tick({ mx: 1 }, {}); t.tick({ mx: 1, power: true }, {}); for (let i = 0; i < 120 && !hanging(t, A[2]); i++) t.tick({ power: true }, {});
t.idle(0.4, { power: true }); console.log('swap', hanging(t, A[2]), 'nut aboard', t.n.ground === t.b, t.st());
leap(t); console.log('over2', t.st(), t.log);
t.go(1, 37.5, -6.6, 4, 0.25, { power: true }); t.tick({ power: true }, { power: true }); t.idle(0.3, { power: true }); console.log('switch2', t.w.channels[2], t.w.lasers[1].on);
t.tick({ power: true, mx: 1 }, {}); t.tick({ power: true, mx: 1, jump: true }, {}); t.run(1, () => ({ mx: 1, jump: true })); t.idle(0.4);
t.both(37, -3, 37, -5); console.log('P2', t.st(), t.log);
t.both(44.5, -3, 44.5, -5); t.idle(1.5);
console.log('stats', JSON.stringify(t.w.stats));
console.log(t.st(), 'complete', t.w.complete, t.log);
const put = (u, p, x, y, z) => { p.pos = { x, y, z }; p.prev = { ...p.pos }; };
// checks: Bolt cannot hop the fence; Nut cannot jump the pit; pulling Nut through the fence zaps her
{ const u = new Bot(def); put(u, u.b, 9.4, 0.6, -7.45); u.idle(0.3); cling(u, u.w.anchors[0], 1); u.tick({ power: true, mx: 1 }, {}); u.tick({ power: true, mx: 1, jump: true }, {}); u.run(1.5, () => ({ mx: 1, jump: true })); console.log('bolt hops fence (should be false)', u.b.pos.x > 15.3 && !u.w.stats.zaps[0] && !u.w.stats.falls[0], u.log); }
{ const u = new Bot(def); put(u, u.n, 7, 0.5, -4); u.idle(0.3); for (let i = 0; i < 100; i++) u.tick({}, { mx: 1, jump: u.n.pos.x > 9.5 }); u.idle(1); console.log('nut jumps pit (should be false)', u.n.pos.x > 15.3 && !u.w.stats.zaps[1], u.log); }
{ const u = new Bot(def); put(u, u.b, 17, 0.6, -4); put(u, u.n, 9.5, 0.5, -4); u.idle(0.3); u.tick({ mx: -0.3 }, {}); u.run(2, () => ({ power: true })); console.log('pull through fence (should zap)', u.log); }
{ const u = new Bot(def); put(u, u.b, 25.4, 0.6, -7.45); put(u, u.n, 22, 0.5, -7.45); u.idle(0.3); cling(u, u.w.anchors[1], 1); u.tick({ mx: 1 }, {}); u.tick({ mx: 1, power: true }, {}); for (let i = 0; i < 120 && !hanging(u, u.w.anchors[2]); i++) u.tick({ power: true }, {});
  const c = hanging(u, u.w.anchors[2]); board(u, 26); console.log('bolt on far magnet', c, 'nut reaches him alone (should be false)', u.n.ground === u.b, u.log); }
// golden cog: Bolt clings in the pit, Nut launches him off the wall from the edge
{ const u = new Bot(def); put(u, u.b, 9.4, 0.6, -7.45); put(u, u.n, 9.5, 0.5, -5.5); u.idle(0.3); cling(u, u.w.anchors[0], 1); u.go(1, 9.55, -7.45, 4, 0.1, { power: true }); u.idle(0.2, { power: true });
  u.tick({}, { power: true }); for (let i = 0; i < 90; i++) u.tick({ mx: 1 }, {}); u.idle(0.5); console.log('cog', u.w.cogs[0].got, u.log); }
{ const u = new Bot(def); put(u, u.b, 9.4, 0.6, -7.45); u.idle(0.3); cling(u, u.w.anchors[0], 1); u.tick({ power: true, mz: 0 }, {}); u.tick({ power: true, jump: true }, {}); u.run(1, () => ({ jump: true, mx: 0.6 })); console.log('cog by hop (should be false)', u.w.cogs[0].got); }
