import { Bot } from './bot.mjs';
import level from '../src/lv/s26.js';
const t = new Bot(level); const Ls = t.w.lasers; const sw = t.w.switches;
const Y = 5.5, Y2 = 8.5;
const phase = (l) => { const [on, off, ph] = l.timer; return (t.w.t + (ph || 0)) % (on + off); };
const press = () => { t.tick({}, { power: true }); t.idle(0.3); };
// 1. Intake
t.go(0, 6.5, -1.6); t.idle(0.3); console.log('fan', t.w.fans[0].on);
t.go(1, 11.5, -3.0); t.go(1, 12.6, -5.5, 3, 0.2); let top = 0; t.run(1.6, null, () => { top = Math.max(top, t.n.pos.y); return t.steer(t.n, 12.8, -6.6); }); console.log('floating', t.st(), top.toFixed(2));
t.tick({}, { power: true }); t.idle(0.3); console.log('switch', sw[0].on);
t.go(0, 8, -2); t.idle(2); t.both(17, -3, 17, -4.5); t.both(21.5, -5.5, 21.5, -7); console.log('P1', t.st(), t.log);
// 2. Return Air
{ const X = Ls[2];
  t.go(0, 22.5, -1.5); t.idle(0.3); console.log('cage off', !Ls[0].on);
  t.go(1, 23.6, -4.5); t.waitFor(t => { const p = phase(X); return p > 1.3 && p < 1.35; }, 5);
  t.waitFor(t => t.n.pos.y > 3, 2, {}, { mx: 1 }); t.run(0.8, null, () => ({ mx: 1 })); t.go(1, 40, -6.4); console.log('Nut up', t.st(), t.log.slice(-1));
  t.idle(0.2); console.log('cage off', !Ls[0].on);
  t.go(0, 23.6, -4.5); t.waitFor(t => { const p = phase(X); return p > 1.3 && p < 1.35; }, 5);
  t.waitFor(t => t.b.pos.y > 3, 2, { mx: 1 }); t.run(0.8, () => ({ mx: 1 })); t.go(0, 37, -2); console.log('Bolt up', t.st(), t.log.slice(-1)); }
// golden cog: Nut launches Bolt from the upper floor
t.go(1, 43.5, -3.0); t.go(0, 43.5, -1.6, 4, 0.1); t.idle(0.2); t.tick({}, { power: true }); t.run(1.2, () => ({ mz: -0.2 })); t.idle(0.6); console.log('cog', t.w.cogs[0].got, t.st(), t.log.slice(-1));
t.both(46, -3, 46, -5.5); console.log('P2', t.st(), t.log);
// 3. Cross Draught
{ const C = Ls[3];
  t.go(0, 47.5, -4, 4, 0.1); t.go(1, 46.4, -4, 4, 0.1); t.idle(0.2);
  t.tick({}, { power: true }); t.run(1.0, () => t.steer(t.b, 55.2, -4)); t.run(1.0, () => t.steer(t.b, 55.2, -4)); console.log('in fan', t.st(), t.log.slice(-1));
  t.tick({ mx: -0.3 }, {}); t.run(1.4, () => ({ power: true })); console.log('holding', t.b.target && t.b.target.kind, t.st());
  t.idle(1.2); console.log('both floating', t.st());
  t.waitFor(t => { const p = phase(C); return p > 1.0 && p < 1.05; }, 4);
  t.run(1.6, () => t.steer(t.b, 62, -4)); console.log('Bolt on roof', t.st(), t.log.slice(-1));
  t.waitFor(t => { const p = phase(C); return p > 0.9 && p < 0.95; }, 4);
  t.run(1.8, () => ({}), () => t.steer(t.n, 62, -5.5)); console.log('roof', t.st(), t.log.slice(-2));
  t.both(62.5, -3, 62.5, -5.5); console.log('P3', t.st(), t.log); }
// 4. Exhaust
{ const K = Ls[5];
  t.go(1, 63.5, -1.5); t.idle(0.3); console.log('cage off', !Ls[4].on);
  t.go(0, 68, -6.5); t.waitFor(t => t.b.pos.x > 80, 2, { mx: 1 }); t.idle(1); console.log('Bolt over', t.st(), t.log.slice(-1));
  t.go(0, 83.6, -4, 4, 0.1); t.go(1, 73.4, -4, 6, 0.1); t.tick({ mx: -0.3 }, {}); t.idle(0.2);
  t.waitFor(t => { const p = phase(K); return p > 1.0 && p < 1.05; }, 4);
  let pushed = false;
  for (let i = 0; i < 90; i++) { const go = !pushed && t.n.pos.x > 77.6; if (go) pushed = true; t.tick({ power: true }, go ? { power: true } : {}); }
  t.goHold(86.2, -4, 2); t.idle(0.8); console.log('reeled', t.st(), 'switch', sw[1].on, 'gate', t.w.gates[1].open, t.log.slice(-1));
  t.both(95, -3, 95, -5.5); t.idle(1.5); }
// shortcut and timing checks (separate worlds, positions set directly)
const put = (u, p, x, y, z) => { p.pos = { x, y, z }; p.prev = { ...p.pos }; p.vel = { x: 0, y: 0, z: 0 }; };
const at = (u, l, lo, hi) => u.waitFor(u => { const [on, off, ph] = l.timer; const p = (u.w.t + (ph || 0)) % (on + off); return p >= lo && p < hi; }, 6);
// P1
{ const u = new Bot(level); put(u, u.n, 14.7, 0.46, -5.9); u.idle(0.3); u.run(0.4, null, () => ({ jump: true })); u.tick({}, { power: true }); u.idle(0.5); console.log('P1 Nut jumps under the ledge and pushes (should be false)', u.w.switches[0].on); }
{ const u = new Bot(level); put(u, u.b, 11.5, 0.56, -2.8); put(u, u.n, 11.5, 0.46, -1.6); u.idle(0.3); u.tick({}, { power: true }); let top = 0; u.run(1.5, () => { top = Math.max(top, u.b.pos.y - 0.55); return { mz: -1 }; }); console.log('P1 launch at the back wall: peak feet (should be < 10)', top.toFixed(2)); }
{ const u = new Bot(level); put(u, u.b, 6.5, 0.56, -1.6); put(u, u.n, 12, 0.46, -6); u.idle(0.3); let top = 0; u.run(3, () => ({}), () => { top = Math.max(top, u.n.pos.y - 0.45); return { mz: -1 }; }); console.log('P1 Nut floats at the back wall: peak feet (should be < 10)', top.toFixed(2), 'ends at y', u.n.pos.y.toFixed(2)); }
// P2
{ const u = new Bot(level); put(u, u.b, 28.6, 0.56, -4); put(u, u.n, 27.5, 0.46, -4); u.idle(0.3); u.tick({}, { power: true }); let top = 0; u.run(1.5, () => { top = Math.max(top, u.b.pos.y - 0.55); return { mx: 1 }; }); console.log('P2 launch up the wall: Bolt zapped by the wall laser (should be 1)', u.w.stats.zaps[0], 'peak feet before that (should be < 5.5)', top.toFixed(2)); }
{ const u = new Bot(level); put(u, u.b, 30.6, Y + 0.56, -4); put(u, u.n, 28.6, 0.46, -4); u.idle(0.3); u.tick({ mx: -0.3 }, {}); u.run(2.5, () => ({ power: true })); console.log('P2 Bolt reels Nut up the wall: Nut zapped (should be 1)', u.w.stats.zaps[1]); }
{ const u = new Bot(level); put(u, u.b, 38, Y + 0.56, -4); put(u, u.n, 26, 0.46, -1.5); u.idle(0.3); u.tick({ mx: -0.3 }, {}); u.run(3, () => ({ power: true })); console.log('P2 Bolt reels Nut from far back: Nut zapped or not up (should be true)', u.w.stats.zaps[1] > 0 || u.n.pos.y < 3); }
{ const u = new Bot(level); put(u, u.n, 23.4, 0.46, -4.5); put(u, u.b, 21, 0.56, -7); u.idle(0.3); u.run(1, null, () => ({ mx: 1 })); console.log('P2 walk into the caged hatch: Nut zapped (should be 1)', u.w.stats.zaps[1], 'Nut y', u.n.pos.y.toFixed(2)); }
{ const u = new Bot(level); put(u, u.b, 22.5, 0.56, -1.5); put(u, u.n, 24.3, 0.46, -4.5); u.idle(0.3); at(u, u.w.lasers[2], 0.1, 0.15); u.run(1, null, () => ({ mx: 1 })); console.log('P2 tube while the top laser is on: Nut zapped (should be 1)', u.w.stats.zaps[1]); }
{ const u = new Bot(level); put(u, u.b, 43.5, Y + 0.56, -1.6); u.idle(0.3); u.run(1, () => ({ jump: true })); put(u, u.n, 43.5, Y + 0.46, -1.6); put(u, u.b, 43.5, Y + 1.5, -1.6); u.idle(0.5); const on = u.b.ground === u.n; u.run(1, () => ({ jump: true })); console.log('P2 Bolt on Nut\'s head', on, 'cog by jump or boost (should be false)', u.w.cogs[0].got); }
// P3
{ const u = new Bot(level); put(u, u.b, 44, Y + 0.56, -4); u.idle(0.3); u.run(0.6, () => ({ mx: 1 })); u.run(2, () => ({ mx: 1, jump: true })); u.idle(1); console.log('P3 running jump into the fan: Bolt fell (should be 1)', u.w.stats.falls[0]); }
{ const u = new Bot(level); put(u, u.b, 47.5, Y + 0.56, -4); put(u, u.n, 46.4, Y + 0.46, -4); u.idle(0.3); u.tick({}, { power: true }); u.run(2.5, () => ({ mx: 1, mz: 1 })); u.idle(1); console.log('P3 launch past the fan: Bolt fell (should be >= 1)', u.w.stats.falls[0], 'on roof (should be false)', u.b.pos.y > Y2); }
{ const u = new Bot(level); put(u, u.b, 60.5, Y2 + 0.56, -4); put(u, u.n, 47.55, Y + 0.46, -4); u.idle(0.3); u.tick({ mx: -0.3 }, {}); u.run(2, () => ({ power: true })); console.log('P3 Bolt reels Nut over from the roof: pulls (should be 0)', u.w.stats.pulls); }
{ const u = new Bot(level); put(u, u.b, 55, Y + 6, -4); u.idle(2.5); at(u, u.w.lasers[3], 0.0, 0.05); u.run(1.6, () => u.steer(u.b, 62, -4)); console.log('P3 float over while the curtain is on: zaps (should be 1)', u.w.stats.zaps[0]); }
{ const u = new Bot(level); let top = 0; put(u, u.b, 55, Y + 6, -6.5); u.idle(1); u.run(3, () => { top = Math.max(top, u.b.pos.y - 0.55); return { mz: -1 }; }); console.log('P3 float into the back wall: peak feet (should be < 15.5)', top.toFixed(2), 'ends at y', u.b.pos.y.toFixed(2)); }
// P4
{ const u = new Bot(level); put(u, u.b, 73.5, Y2 + 0.56, -2); put(u, u.n, 72.4, Y2 + 0.46, -2); u.idle(0.3); u.tick({}, { power: true }); u.run(2, () => ({ mx: 1 })); u.idle(1); console.log('P4 launch over the pit: falls', u.w.stats.falls[0], 'zaps', u.w.stats.zaps[0], '(should not both be 0)'); }
{ const u = new Bot(level); put(u, u.b, 68.4, Y2 + 0.56, -6.5); u.idle(0.3); u.run(1, () => ({ mx: 1 })); console.log('P4 tube without the plate: Bolt zapped (should be 1)', u.w.stats.zaps[0], 'B x', u.b.pos.x.toFixed(2)); }
{ const u = new Bot(level); put(u, u.n, 73.6, Y2 + 0.46, -5.4); u.idle(0.3); u.run(0.4, null, () => ({ jump: true })); u.tick({}, { power: true }); u.idle(0.3); put(u, u.n, 83.45, Y2 + 0.46, -6); u.idle(0.3); u.run(0.4, null, () => ({ jump: true })); u.tick({}, { power: true }); u.idle(0.3); console.log('P4 pillar switch from either edge (should be false)', u.w.switches[1].on); }
{ const u = new Bot(level); put(u, u.b, 83.6, Y2 + 0.56, -4); put(u, u.n, 73.4, Y2 + 0.46, -4); u.idle(0.3); u.tick({ mx: -0.3 }, {}); at(u, u.w.lasers[5], 0.3, 0.35); u.run(1.5, () => ({ power: true })); console.log('P4 reel while the curtain is about to come on: Nut zapped (should be 1)', u.w.stats.zaps[1]); }
{ const u = new Bot(level); put(u, u.b, 83.6, Y2 + 0.56, -4); put(u, u.n, 73.4, Y2 + 0.46, -4); const cp = u.w.checkpoints[2]; u.w.cp = { b: cp.b, n: cp.n }; u.idle(0.3); u.tick({ mx: -0.3 }, {}); at(u, u.w.lasers[5], 1.0, 1.05); u.run(1.5, () => ({ power: true })); u.goHold(86.2, -4, 2); u.idle(0.5); const across = u.n.pos.x > 83; u.waitFor(u => u.w.stats.zaps[1] > 0, 3, {}, u => u.steer(u.n, 86, -6.5)); u.idle(0.5); console.log('P4 missed the switch: Nut across', across, 'switch', u.w.switches[1].on, '-> steps back into the tube, the cage sends her to the checkpoint', u.pos(u.n), u.log.slice(-2)); }
{ const u = new Bot(level); put(u, u.b, 89.5, Y2 + 0.56, -4); put(u, u.n, 88.4, Y2 + 0.46, -4); u.idle(0.3); u.tick({}, { power: true }); let top = 0; u.run(2, () => { top = Math.max(top, u.b.pos.y - 0.55); return { mx: 1 }; }); console.log('P4 launch over the door: peak feet (should be < 17.5)', top.toFixed(2), 'B x (should be < 91)', u.b.pos.x.toFixed(2)); }
console.log('stats', JSON.stringify(t.w.stats));
console.log('cog', t.w.cogs[0].got);
console.log(t.st(), 'complete', t.w.complete, t.log);
