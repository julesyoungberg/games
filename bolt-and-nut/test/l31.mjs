import { Bot } from './bot.mjs';
import level from '../src/lv/s31.js';
const t = new Bot(level); const c = t.w.crates;
// 1. Pillar Box
{ t.launchBolt(5.5, -4.6, 0, -1, 0.8); console.log('launched', t.st(), t.log);
  t.waitFor(u => u.b.pos.x > 17, 3, u => u.steer(u.b, 5.5, -7)); t.waitFor(u => u.b.grounded, 3); t.idle(0.5); console.log('posted', t.st(), t.log);
  t.go(1, 7.2, -3); t.go(0, 16.8, -3); t.pullNut(19, -3); console.log('reeled', t.st(), t.log);
  t.both(21, -2.5, 21, -5); console.log('P1', t.st(), t.log); }
// 2. Letter Slot
{ const A = c[0];
  t.go(0, 27, -3.6); t.grab(0, -1); console.log('grabbed', A.pulledBy === t.b, t.pos(A));
  t.carry(A, 33.5, -4.4, 0, -1); console.log('placed', t.pos(A), t.st());
  t.go(0, 30, -1); t.go(1, 33.5, -3.0, 4, 0.1); t.idle(0.2); t.tick({}, { power: true }); t.idle(1); console.log('thrown', t.pos(A));
  t.idle(5); console.log('posted', t.pos(A), 'ch2', t.w.channels[2], t.log);
  t.idle(1.5); t.both(43, -2, 43, -4.5); console.log('P2', t.st(), t.log); }
// 3. Chimney
{ t.go(0, 47, -2); t.boostBolt(49.5, -5.3, 0, -1); console.log('on sacks', t.onNut, t.st());
  t.go(0, 50, -6.7, 3, 0.15); t.go(1, 48.3, -5.5, 4, 0.15); t.idle(0.2); t.tick({}, { power: true }); t.run(1.2, () => ({ mx: 1 })); t.idle(0.5); console.log('roof', t.st(), t.log);
  t.go(0, 52.9, -3.5); t.go(1, 50.2, -3.5); t.pullNut(55, -3.5); console.log('nut up', t.st(), t.log);
  t.waitFor(u => u.n.pos.y < 3, 4, {}, u => u.steer(u.n, 59.8, -6.5)); t.waitFor(u => u.n.grounded, 3); console.log('inside', t.st());
  t.go(1, 57.6, -2.6); t.tick({}, { mx: -0.3 }); t.tick({}, { power: true }); t.idle(1.2); console.log('door', t.w.switches[0].on, t.w.gates[1].open.toFixed(2));
  t.waitFor(u => u.b.pos.y < 3, 4, u => u.steer(u.b, 59.8, -6.5)); t.waitFor(u => u.b.grounded, 3); console.log('bolt inside', t.st());
  t.boostBolt(54.2, -5.9, 0, -1); console.log('cog', t.w.cogs[0].got, t.st());
  t.go(0, 58, -2); t.go(1, 59, -1); t.both(64, -3, 64, -5.5); console.log('P3', t.st(), t.log); }
// 4. Last Collection
{ t.go(1, 66.8, -1.6); t.idle(1); console.log('lid', t.w.gates[2].open.toFixed(2));
  t.waitFor(u => u.b.pos.x > 80, 4, u => u.steer(u.b, 73.5, -6.5)); t.waitFor(u => u.b.grounded, 3); console.log('bolt posted', t.st());
  t.go(0, 81.5, -2); t.go(1, 70, -3); t.idle(0.5); console.log('lid held from far side', t.w.gates[2].open.toFixed(2));
  t.waitFor(u => u.n.pos.x > 80, 4, {}, u => u.steer(u.n, 73.5, -6.5)); t.waitFor(u => u.n.grounded, 3); console.log('nut posted', t.st());
  t.both(88, -3, 88, -5.5); t.idle(2); console.log('P4', t.st(), t.log); }
// ---------------- shortcut checks (separate worlds, positions set directly)
const put = (p, x, y, z) => { p.pos = { x, y, z }; p.prev = { ...p.pos }; p.vel = { x: 0, y: 0, z: 0 }; };
const stack = (u, x, z, steer, sec = 6) => { put(u.b, x, 0.56, z); put(u.n, x, 1.7, z); u.idle(0.5); const on = u.n.ground === u.b; let pk = 0, i = 0, dead = false;
  for (let k = 0; k < sec * 60 && !dead; k++) { u.tick(u.b.pos.y > 3 ? steer : {}, { power: (i++ % 6) === 0 }); dead = u.log.some(e => e.includes('zap')); if (!dead) pk = Math.max(pk, u.b.pos.y - 0.55); }
  return { on, pk: pk.toFixed(2), zaps: JSON.stringify(u.w.stats.zaps) }; };
const launch = (u, bx, bz, nx, nz, steer, sec = 2.5) => { put(u.b, bx, 0.56, bz); put(u.n, nx, 0.46, nz); u.idle(0.3); u.tick({}, { power: true }); let pk = 0; u.run(sec, () => { pk = Math.max(pk, u.b.pos.y - 0.55); return steer; }); return pk.toFixed(2); };
const boost = (u, nx, nz, steer) => { put(u.n, nx, 0.46, nz); put(u.b, nx - 1.3, 0.56, nz); u.idle(0.3); for (let i = 0; i < 70; i++) u.tick({ jump: i < 15, ...u.steer(u.b, u.n.pos.x, u.n.pos.z) }, {}); const on = u.b.ground === u.n; u.run(1.5, () => ({ jump: true, ...steer })); return on; };
// Pillar Box
{ const r = []; for (const who of [0, 1]) for (const jump of [false, true]) { const u = new Bot(level); put(u.b, 6.5, 0.56, -3 + who * 2); put(u.n, 6.5, 0.46, -1 - who * 2); u.idle(0.3); let mx = 0; const inp = (i) => ({ mx: 1, jump: jump && i % 20 < 12 });
    let i = 0; u.run(4, () => who === 0 ? inp(i++) : {}, () => who === 1 ? inp(i++) : {}); mx = u.w.players[who].pos.x; r.push((who ? 'Nut' : 'Bolt') + (jump ? ' hopping' : ' walking') + ' x ' + mx.toFixed(1) + ' zaps ' + u.w.stats.zaps[who]); }
  console.log('Pillar Box: each robot walks or quick-jumps across the belt (none should get past x 16)', r.join(' | ')); }
{ const u = new Bot(level); const pk = launch(u, 6.8, -3, 5.7, -3, { mx: 1 }); console.log('Pillar Box: Nut launches Bolt over the belt (Bolt zaps should be 1)', u.w.stats.zaps[0], 'peak feet', pk, 'x', u.b.pos.x.toFixed(1)); }
{ const u = new Bot(level); const on = boost(u, 7, -3, { mx: 1 }); console.log('Pillar Box: Bolt boosts off Nut over the belt (on head', on + ', Bolt zaps should be 1)', u.w.stats.zaps[0]); }
{ const u = new Bot(level); const r = stack(u, 6.8, -3, { mx: 1 }); console.log('Pillar Box: Nut stands on Bolt and keeps pushing (on head', r.on + ', zapped should be nonzero)', r.zaps, 'peak feet', r.pk, 'x', u.b.pos.x.toFixed(1)); }
{ const u = new Bot(level); const pk = launch(u, 2, -6.5, 2, -5.4, { mz: -1 }); console.log('Pillar Box: launch at the back wall (on back wall should be false)', u.b.pos.z < -8, 'peak feet', pk, 'wall top 14'); }
{ const u = new Bot(level); put(u.b, 5.5, 0.56, -5); put(u.n, 1, 0.46, -1); u.idle(0.3); let pk = 0; u.run(2, () => { pk = Math.max(pk, u.b.pos.y - 0.55); return { mz: -1, jump: true }; }); console.log('Pillar Box: Bolt alone jumps at the pillar box (posted should be false)', u.b.pos.x > 10, 'peak feet', pk.toFixed(2), 'box top 3.2'); }
// Letter Slot
{ let out = false; for (const [x, z] of [[24.6, -7.5], [24.6, -4.5], [26.2, -4.5], [27, -4.4], [27.8, -4.5], [29, -4.5], [28.9, -7.6], [24.9, -7.6]]) for (const jump of [false, true]) { const u = new Bot(level); const A = u.w.crates[0]; put(u.n, x, 0.46, z); put(u.b, 22, 0.56, -1); u.idle(0.3);
    if (jump) { u.tick({}, { jump: true }); u.run(0.25, () => ({}), () => ({ jump: true })); } u.tick({}, { power: true }); u.idle(0.6); u.tick({}, { power: true }); u.idle(2); if (A.pos.z > -5.8 || A.pos.x < 26 || A.pos.x > 28) out = true; }
  console.log('Letter Slot: Nut alone pushes the caged parcel from every side, twice (out should be false)', out); }
{ let best = 0, hit = false; for (const k of [0, 6, 12, 18, 24]) { const u = new Bot(level); const A = u.w.crates[0]; put(u.n, 22, 0.46, -1); put(u.b, 33.5, 0.56, -2.6); put(A, 33.5, 0.61, -4.3); u.b.face = { x: 0, z: -1 }; u.idle(0.05); u.b.target = { obj: A, kind: 'crate' }; A.pulledBy = u.b; u.run(0.6, () => ({ power: true }));
    u.tick({ power: true, jump: true, mz: -0.2 }, {}); u.run(k / 60, () => ({ power: true, jump: true, mz: -0.2 })); let pk = 0; u.run(1.5, () => { pk = Math.max(pk, A.pos.y - 0.6); return { jump: true, mz: -1 }; }); u.idle(5); best = Math.max(best, pk); if (u.w.channels[2] || A.pos.x > 36) hit = true; }
  console.log('Letter Slot: Bolt alone jumps the parcel at the belt and lets go (on belt should be false)', hit, 'parcel peak bottom', best.toFixed(2), 'belt top 2.2'); }
{ let hit = false; for (const [cx, cz, nx, nz] of [[35.3, -4.5, 33, -3], [34.5, -1, 32.5, -1], [35.3, -1, 33.5, -0.6], [35.3, -3, 33.3, -2.2], [35.3, -2, 34, -0.5]]) for (const jump of [false, true]) { const u = new Bot(level); const A = u.w.crates[0]; put(u.b, 22, 0.56, -1); put(A, cx, 0.61, cz); put(u.n, nx, 0.46, nz); u.idle(0.3);
    let belt = false; const chk = () => { if (A.ground && A.ground.conv) belt = true; return {}; };
    if (jump) { u.tick({}, { jump: true }); u.run(0.25, chk, () => ({ jump: true })); } u.tick({}, { power: true }); u.run(0.5, chk); u.tick({}, { power: true }); u.run(5, chk); if (!belt && (u.w.channels[2] || A.pos.x > 36)) hit = true; }
  console.log('Letter Slot: Nut throws the parcel at the wall from the floor, twice, without the belt (through should be false)', hit); }
{ const u = new Bot(level); const on = boost(u, 33.5, -4.5, { mz: -1 }); u.idle(4); console.log('Letter Slot: Bolt boosts onto the belt and rides into the slot (on head', on + ', Bolt zaps should be 1, plate false)', u.w.stats.zaps[0], !!u.w.channels[2]); }
{ const u = new Bot(level); const r = stack(u, 34, -3, { mx: 1 }); console.log('Letter Slot: Nut stands on Bolt and keeps pushing (zapped should be nonzero)', r.zaps, 'peak feet', r.pk, 'wall top 14'); }
{ const u = new Bot(level); const A = u.w.crates[0]; put(A, 30, 0.61, 3); u.idle(3); console.log('Letter Slot: a lost parcel goes home to its cage', u.pos(A), u.log.join(' ')); }
// Chimney
{ const u = new Bot(level); const pk = launch(u, 51, -3, 49.9, -3, { mx: 1 }); console.log('Chimney: Nut launches Bolt at the roof from the floor (on roof should be false)', u.b.pos.y > 5, 'peak feet', pk, 'roof', 5.2); }
{ const u = new Bot(level); const r = stack(u, 51, -3, { mx: 1 }); console.log('Chimney: Nut stands on Bolt and keeps pushing (on roof should be false)', u.b.pos.y > 5 && !u.log.some(e => e.includes('zap')), 'zaps', r.zaps, 'peak feet', r.pk); }
{ const u = new Bot(level); put(u.b, 51.2, 0.56, -3); put(u.n, 50.1, 0.46, -3); u.idle(0.3); u.tick({}, { power: true }); let again = false; u.run(3, () => ({ mx: 1 }), () => { if (!again && u.b.vel.y < 0 && Math.hypot(u.b.pos.x - u.n.pos.x, u.b.pos.y - u.n.pos.y, u.b.pos.z - u.n.pos.z) < 3.25) { again = true; return { power: true }; } return { mx: 0.6 }; });
  console.log('Chimney: Nut launches Bolt and relaunches him on the way down (relaunched', again + ', on roof', u.b.pos.y > 5, 'zaps', JSON.stringify(u.w.stats.zaps) + ')'); }
{ let on = false; for (const [x, z] of [[51.5, -2.6], [51.5, -1], [51.5, -4]]) { const u = new Bot(level); put(u.n, x, 0.46, z); put(u.b, 47, 0.56, -1); u.idle(0.3); u.tick({}, { power: true }); u.idle(0.3); if (u.w.switches[0].on) on = true; }
  const v = new Bot(level); put(v.n, 56, 5.66, -2.6); put(v.b, 54, 5.76, -4); v.idle(0.3); v.tick({}, { power: true }); v.idle(0.3); v.tick({}, { jump: true }); v.run(0.3, () => ({}), () => ({ jump: true, power: true })); if (v.w.switches[0].on) on = true;
  console.log('Chimney: Nut presses X at the door switch from outside the front wall and from the roof right above it (on should be false)', on); }
{ const u = new Bot(level); put(u.b, 58.6, 0.56, -4); put(u.n, 47, 0.46, -1); u.idle(1); u.go(0, 61, -2, 3); console.log('Chimney: Bolt inside alone (door should stay shut)', u.w.gates[1].open.toFixed(2), u.b.pos.x.toFixed(1)); }
{ const u = new Bot(level); const pk = launch(u, 60.6, -3, 59.5, -3, { mx: 1 }, 2); put(u.n, 60.4, 5.66, -3); const v = new Bot(level); put(v.n, 60.4, 5.66, -3); const pk2 = launch(v, 61, -3, 60, -3, { mx: 1 }); console.log('Chimney: launch over the tall wall from the roof (Bolt past it should be false)', v.b.pos.x > 62.5, 'peak feet', pk2, 'wall top 14');
  const s = new Bot(level); put(s.b, 58, 5.76, -3); put(s.n, 58, 6.9, -3); s.idle(0.5); const on = s.n.ground === s.b; let i = 0; s.run(5, () => s.b.pos.y > 7 ? { mx: 1 } : {}, () => ({ power: (i++ % 6) === 0 })); console.log('Chimney: Nut stands on Bolt on the roof and keeps pushing (on head', on + ', zaps should be nonzero)', JSON.stringify(s.w.stats.zaps), 'past wall', s.b.pos.x > 62.5); }
// Last Collection
{ const r = []; for (const [who, nm] of [[0, 'Bolt'], [1, 'Nut']]) { const u = new Bot(level); put(u.players ? u.b : u.b, 47, 0.56, -1); put(u.n, 47, 0.46, -1); put(u.w.players[who], 66.8, who ? 0.46 : 0.56, -1.6); u.idle(1); let i = 0; u.run(4, () => who === 0 ? u.steer(u.b, 73.5, -6.5) : {}, () => who === 1 ? u.steer(u.n, 73.5, -6.5) : {}); r.push(nm + ' posted ' + (u.w.players[who].pos.x > 78) + ' lid ' + u.w.gates[2].open.toFixed(2)); }
  console.log('Last Collection: one robot alone holds the plate and runs for the hatch (posted should be false)', r.join(' | ')); }
{ const u = new Bot(level); const pk = launch(u, 75, -3, 73.9, -3, { mx: 1 }); console.log('Last Collection: Nut launches Bolt at the sorting wall (past it should be false)', u.b.pos.x > 80, 'peak feet', pk, 'wall top 14'); }
{ const u = new Bot(level); const on = boost(u, 75.3, -3, { mx: 1 }); console.log('Last Collection: Bolt boosts off Nut at the wall (past it should be false)', on, u.b.pos.x > 80); }
{ const u = new Bot(level); const r = stack(u, 75, -3, { mx: 1 }); console.log('Last Collection: Nut stands on Bolt and keeps pushing (zapped should be nonzero, past wall false)', r.zaps, u.b.pos.x > 80, 'peak feet', r.pk); }
console.log('stats', JSON.stringify(t.w.stats));
console.log('cog', t.w.cogs[0].got);
console.log(t.st(), 'complete', t.w.complete, t.log);
