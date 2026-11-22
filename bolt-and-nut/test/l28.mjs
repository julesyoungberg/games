import { Bot } from './bot.mjs';
import level from '../src/lv/s28.js';
const t = new Bot(level); const c = t.w.crates; const sw = t.w.switches;
const onTop = (who, crate) => t.w.players[who].ground === crate;
const climb = (who, crate, fx = 1) => { const p = t.w.players[who]; for (let i = 0; i < 70 && !onTop(who, crate); i++) { const inp = i < 14 ? { mx: fx, jump: true } : t.steer(p, crate.pos.x, crate.pos.z); t.tick(who === 0 ? inp : {}, who === 1 ? inp : {}); } t.idle(0.2); return onTop(who, crate); };
// shove: run into the crate from behind along +x and let go of the stick once it is sliding on the oil
const shove = (who, crate) => { for (let i = 0; i < 240 && !(crate.ground && crate.ground.oil && crate.vel.x > 1); i++) t.tick(who === 0 ? { mx: 1 } : {}, who === 1 ? { mx: 1 } : {}); t.idle(0.4); return crate.vel.x; };
// bounce: walk onto the spring from the +x side, then steer onto (tx,tz) on the way down
const bounce = (who, tx, tz) => { const p = t.w.players[who]; t.go(who, 38.2, -4); let up = false;
  for (let i = 0; i < 400; i++) { if (p.vel.y > 5) up = true; const inp = up ? t.steer(p, tx, tz) : t.steer(p, 36, -4); t.tick(who === 0 ? inp : {}, who === 1 ? inp : {}); if (up && p.grounded && p.ground && !p.ground.spring) break; if (tx === 36 && up && p.vel.y < 3) break; } t.idle(0.3); };
// 1. Skittle Alley
{ const A = c[0], B = c[1];
  t.go(0, 5, -3.4); t.tick({ mz: -0.3 }, {}); t.run(1.5, () => ({ power: true })); console.log('snatched', A.pulledBy === t.b, t.pos(A));
  t.carry(A, 9, -3.2, 1, 0); t.carry(A, 9.6, -6.2, 1, 0); console.log('placed', t.pos(A), t.st());
  t.go(0, 4, -1.5); t.go(1, 7.5, -3); t.go(1, 7.6, -6.2, 4, 0.1); t.idle(0.2);
  t.tick({}, { power: true }); t.idle(4); console.log('thrown', t.pos(A), 'wooden', t.pos(B), 'ch1', t.w.channels[1]);
  t.idle(1); t.both(11, -2, 11, -3.2); t.both(25, -2, 25, -3.2); t.both(28.5, -2.5, 29.8, -4.5); console.log('P1', t.st(), t.log); }
// 2. High Bay
{ const A = c[2];
  t.go(0, 31, -1); bounce(0, 33.5, -4); console.log('bolt up', t.st());
  t.go(1, 33, -1); t.go(0, 33.5, -2.6); t.pullNut(33.6, -4.5); console.log('nut up', t.st());
  t.go(1, 34, -6.5); t.go(0, 32.4, -4); t.grab(-1, 0); console.log('crate up', A.pulledBy === t.b, t.pos(A));
  t.goHold(34.2, -4); for (let i = 0; i < 6; i++) t.tick({ power: true, mx: 0.3 }, {}); t.run(0.6, () => ({ power: true })); t.idle(0.6); console.log('dropped', t.pos(A));
  t.go(0, 32.5, -2.5); t.go(1, 34.6, -4); t.waitFor(() => A.pos.y > 6 && Math.abs(A.vel.y) < 1, 10); console.log('push at', t.st(), t.pos(A)); t.tick({}, { power: true }); t.idle(2.5);
  console.log('thrown', t.pos(A), 'ch2', t.w.channels[2]);
  // golden cog: Bolt bounces, Nut launches him from the top of his bounce
  t.go(0, 33, -1); bounce(0, 36, -4); console.log('bolt bouncing', t.st());
  t.waitFor(() => t.b.pos.y > 7 && t.b.vel.y < 2 && t.b.vel.y > 0, 10, (u) => u.steer(u.b, 36, -4)); console.log('bolt at', t.st());
  t.tick({}, { power: true }); t.run(1.6, () => ({ mx: -1 })); t.idle(0.5); console.log('cog', t.w.cogs[0].got, t.st(), t.log);
  t.both(40, -1, 39, -1); t.both(47, -2.5, 47, -5.5); console.log('P2', t.st(), t.log); }
// 3. Pallet Run
{ const A = c[3];
  const hopStep = (who, x) => { const p = t.w.players[who]; t.go(who, x, -3); for (let i = 0; i < 50; i++) t.tick(who === 0 ? { mz: -1, jump: p.pos.z < -3.6 } : {}, who === 1 ? { mz: -1, jump: p.pos.z < -3.6 } : {}); t.go(who, x, -6.5); t.idle(0.3); };
  t.go(1, 48.5, -1); hopStep(0, 50.5); t.go(0, 51.6, -5.3); t.go(0, 52.65, -4.9); t.idle(0.3); console.log('on crate', onTop(0, A), t.st(), t.pos(A));
  t.go(1, 49.5, -4.6); console.log('shove v', shove(1, A).toFixed(2)); t.idle(2.5); console.log('slid', t.pos(A), t.st(), t.log);
  t.go(0, 62.5, -4.9); console.log('bolt on dock', t.st());
  t.go(1, 50.5, -2.6); for (let i = 0; i < 50 && !(t.n.grounded && t.n.pos.y > 1.5); i++) t.tick({}, { mz: 1, jump: t.n.pos.z > -2.2 }); t.go(1, 51.1, -0.8); t.idle(0.3); console.log('nut on step', t.st());
  t.go(0, 61.3, -0.8); t.pullNut(63.5, -2); console.log('reeled', t.st(), t.log);
  t.both(63.5, -2.5, 63.5, -5.5); console.log('P3', t.st(), t.log); }
// 4. Goods Out
{ const A = c[4], L4 = t.w.movers[0];
  t.go(0, 67.5, -1.5); t.go(1, 69.3, -3); for (let i = 0; i < 50 && !(t.n.grounded && t.n.pos.y > 1.5); i++) t.tick({}, { mz: -1, jump: t.n.pos.z < -3.5 }); t.go(1, 69.6, -4.9); t.go(1, 70.65, -4.1); t.idle(0.3);
  console.log('nut on crate', onTop(1, A), t.st(), t.pos(A));
  t.go(0, 67.5, -3.6); console.log('shove v', shove(0, A).toFixed(2), t.st());
  let jumped = false;
  for (let i = 0; i < 600 && !(t.n.grounded && t.n.pos.y > 5.5); i++) { const go = jumped || (onTop(1, A) && A.pos.y - 0.6 > 2.8 && A.vel.y > 0 && A.pos.x > 78.5); if (go) jumped = true; t.tick({}, go ? { mx: 1, jump: true } : {}); }
  t.idle(0.3); console.log('nut on dock', t.st(), t.pos(A), t.log);
  t.go(0, 67.5, -6.7); t.idle(0.3); t.go(1, 82.5, -5.4); t.tick({}, { mz: -0.3 }); t.tick({}, { power: true }); console.log('switch', t.w.switches[0].on);
  t.idle(7); console.log('lift', t.st()); t.go(0, 84, -5); t.both(88, -3, 88, -5.5); t.idle(2); console.log('P4', t.st(), t.log); }
// shortcut checks (separate worlds, positions set directly)
const put = (p, x, y, z) => { p.pos = { x, y, z }; p.prev = { ...p.pos }; p.vel = { x: 0, y: 0, z: 0 }; };
{ let out = false, zaps = 0; for (const nx of [3, 4, 5, 6, 7]) for (const jump of [false, true]) for (let k = 0; k < 60; k += 3) { const u = new Bot(level); const A = u.w.crates[0]; put(u.n, nx, 0.46, -4.75); put(u.b, 1, 0.56, -1); u.idle(0.5 + k / 60);
  if (jump) { u.tick({}, { jump: true }); u.run(0.15, () => ({}), () => ({ jump: true })); } u.tick({}, { power: true }); u.idle(2.5); if (A.pos.x < 3.6 || A.pos.x > 6.4 || A.pos.z > -5.3) out = true; zaps += u.w.stats.zaps[1]; }
  console.log('Alley: Nut alone pushes the caged crate from every spot and timing (crate out should be false)', out, 'zaps', zaps); }
{ const u = new Bot(level); const A = u.w.crates[0]; put(u.b, 5, 0.56, -3.4); put(u.n, 1, 0.46, -1); u.idle(0.2); u.tick({ mz: -0.3 }, {}); u.run(1.5, () => ({ power: true }));
  u.carry(A, 9, -3.2, 1, 0); u.carry(A, 8.6, -6.2, 1, 0); for (let i = 0; i < 120 && u.b.pos.x < 10.3; i++) u.tick({ power: true, mx: 1 }, {}); const rel = u.pos(u.b) + ' crate vx ' + A.vel.x.toFixed(2); u.tick({ mx: 1 }, {}); u.idle(4); console.log('Alley: Bolt alone runs the crate up to the alley and lets go (ch1 should be false)', !!u.w.channels[1], 'iron at', u.pos(A), 'wooden at', u.pos(u.w.crates[1]), 'released at', rel, 'zaps', u.w.stats.zaps[0]); }
{ let moved = false; for (const [x, y, z] of [[31.95, 4.96, -7.4], [31.95, 4.96, -6.2], [28.25, 0.46, -6.1], [29.45, 0.46, -7.3]]) for (const jump of [false, true]) { const u = new Bot(level); const A = u.w.crates[2]; put(u.n, x, y, z); put(u.b, 40, 0.56, -1); u.idle(0.3);
  if (jump) { u.tick({}, { jump: true }); u.run(0.28, () => ({}), () => ({ jump: true })); } u.tick({}, { power: true }); u.idle(2); if (Math.hypot(A.pos.x - 28.25, A.pos.y - 6.6, A.pos.z + 7.3) > 0.05) moved = true; }
  console.log('High Bay: Nut alone tries to push the crate off the high shelf (moved should be false)', moved); }
{ let hit = false; for (const nx of [33.2, 33.45]) for (const jump of [false, true]) { const u = new Bot(level); const A = u.w.crates[2]; put(u.b, 34.3, 5.06, -4); put(A, 36, 5.2, -4); u.b.face = { x: 1, z: 0 }; u.idle(0.05); u.b.target = { obj: A, kind: 'crate' }; A.pulledBy = u.b; put(u.n, nx, 4.96, -4); u.run(0.8, () => ({ power: true }));
  if (jump) { u.tick({ power: true }, { jump: true }); u.run(0.28, () => ({ power: true }), () => ({ jump: true })); } u.tick({ power: true }, { power: true }); u.idle(2.5); if (u.w.channels[2]) hit = true; }
  console.log('High Bay: Nut throws the crate from the mezzanine without the spring (ch2 should be false)', hit); }
{ let hit = 0; for (const bx of [34.0, 34.5]) for (let k = 0; k < 30; k++) { const u = new Bot(level); const A = u.w.crates[2]; put(u.b, bx, 5.06, -4); put(A, bx + 1.7, 5.5, -4); u.b.face = { x: 1, z: 0 }; u.idle(0.05); u.b.target = { obj: A, kind: 'crate' }; A.pulledBy = u.b; put(u.n, bx - 0.85, 4.96, -4); u.run(0.8, () => ({ power: true }));
  u.tick({ power: true, jump: true }, {}); u.run(k / 60, () => ({ power: true, jump: true })); u.tick({ power: true, jump: true }, { power: true }); u.idle(2.5); if (u.w.channels[2]) hit++; }
  console.log('High Bay: Bolt jumps holding the crate and Nut throws it at every point of his jump (hits should be 0)', hit); }
{ const u = new Bot(level); put(u.b, 38.2, 0.56, -4); put(u.n, 34.6, 4.96, -4); u.idle(0.2); u.waitFor(u => u.b.pos.y > 7 && u.b.vel.y < 2 && u.b.vel.y > 0, 10, (u) => u.steer(u.b, 36, -4)); u.tick({}, { power: true }); let pk = 0; u.run(2, () => { pk = Math.max(pk, u.b.pos.y - 0.55); return { mx: 1 }; });
  console.log('High Bay: Nut launches Bolt off the spring toward the column (Bolt zaps should be 1)', u.w.stats.zaps[0], 'peak feet', pk.toFixed(2), 'back wall 14'); }
{ const u = new Bot(level); put(u.b, 51.6, 0.56, -3); put(u.n, 50.5, 0.46, -3); u.idle(0.3); u.tick({}, { power: true }); u.run(2, () => ({ mx: 1 })); console.log('Pallet Run: Nut launches Bolt over the oil (Bolt zaps should be 1)', u.w.stats.zaps[0], u.st()); }
{ const u = new Bot(level); put(u.n, 51, 0.46, -3); put(u.b, 51.9, 0.56, -3); u.idle(0.3); for (let i = 0; i < 70; i++) u.tick({ jump: i < 15, ...u.steer(u.b, u.n.pos.x, u.n.pos.z) }, {}); const on = u.b.ground === u.n; u.run(1.2, () => ({ mx: 1, jump: true })); console.log('Pallet Run: Bolt jumps off Nut\'s head over the oil (on head, Bolt zaps should be 1)', on, u.w.stats.zaps[0]); }
{ const u = new Bot(level); put(u.b, 61.6, 1.76, -3); put(u.n, 51.4, 0.46, -3); u.idle(0.3); u.tick({ mx: -0.3 }, {}); u.run(2.5, () => ({ power: true })); console.log('Pallet Run: Bolt on the dock reels Nut from the floor (Nut zaps should be 1)', u.w.stats.zaps[1]); }
{ const u = new Bot(level); put(u.b, 69.5, 0.56, -1); put(u.n, 69.5, 0.46, -7); u.idle(0.2); u.go(0, 79, -1, 3); u.go(1, 79, -7, 3); console.log('Goods Out: both walk across the oil to the spring (zaps should be [1,1])', JSON.stringify(u.w.stats.zaps)); }
{ const u = new Bot(level); put(u.b, 69.6, 0.56, -2); put(u.n, 68.6, 0.46, -2); u.idle(0.3); u.tick({}, { power: true }); let pk = 0; u.run(2, () => { pk = Math.max(pk, u.b.pos.y - 0.55); return { mx: 1 }; }); console.log('Goods Out: Nut launches Bolt at the dock from the last dry floor (on dock should be false)', u.b.pos.y > 5, 'peak feet', pk.toFixed(2), 'dock', 5.2); }
{ const u = new Bot(level); const A = u.w.crates[4]; put(u.b, 79.2, 1.76, -4); put(A, 79.2, 0.61, -4); put(u.n, 66, 0.46, -2); u.idle(0.05); let pk = 0; u.run(4, () => { pk = Math.max(pk, u.b.pos.y - 0.55); return u.b.ground === A && A.vel.y > 0 && A.pos.y > 3 ? { mx: 1, jump: true } : {}; });
  u.go(0, 82.5, -6, 3); u.tick({ mz: -0.3 }, {}); u.run(1, () => ({ power: true, jump: true })); console.log('Goods Out: roles swapped, Bolt bounces up on the crate (Bolt on dock, switch should be false)', u.b.pos.y > 5.5, u.w.switches[0].on, 'lift top', u.w.movers[0].max.y.toFixed(2)); }
{ const u = new Bot(level); const A = u.w.crates[4]; put(A, 79.3, 4, -4); u.idle(2); put(u.b, 69.5, 0.56, -4); u.idle(0.2); u.tick({ mx: 0.3 }, {}); u.run(1.5, () => ({ power: true })); console.log('Goods Out: a crate left bouncing on the spring can be pulled back (grabbed should be true)', A.pulledBy === u.b);
  const P = new Bot(level); const B = P.w.crates[3]; put(B, 60.4, 0.61, -2.5); put(P.b, 50.5, 0.56, -2.5); P.idle(0.5); P.tick({ mx: 0.3 }, {}); P.run(2, () => ({ power: true })); console.log('Pallet Run: a crate parked at the far dock can be pulled back (grabbed should be true)', B.pulledBy === P.b); }
{ const u = new Bot(level); const A = u.w.crates[4]; put(u.n, 79.3, 1.66, -4); put(A, 79.3, 0.61, -4); put(u.b, 66, 0.56, -2); u.idle(0.05); let pk = 0, pushed = false;
  u.run(5, () => ({}), () => { pk = Math.max(pk, u.n.pos.y - 0.45); if (!pushed && A.pos.y > 4 && A.vel.y < 2) { pushed = true; return { power: true }; } return pushed && u.n.ground === A && A.vel.y < 4 ? { jump: true } : {}; });
  console.log('Goods Out: Nut throws her own trampoline crate up from the top and jumps (peak feet, back walls 10 and 11.2)', pk.toFixed(2), 'zaps', u.w.stats.zaps[1]); }
{ const u = new Bot(level); const A = u.w.crates[2]; put(A, 20, 0.61, 3); u.idle(3); console.log('Lost crate goes home (High Bay crate back on the shelf)', u.pos(A), u.log.join(' ')); }
console.log('stats', JSON.stringify(t.w.stats));
console.log('cog', t.w.cogs[0].got);
console.log(t.st(), 'complete', t.w.complete, t.log);
