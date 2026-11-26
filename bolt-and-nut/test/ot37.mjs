import { Bot } from './bot.mjs';
import level from '../src/lv/ot37.js';
const t = new Bot(level); const M = t.w.movers[0], LZ = t.w.lasers[0], A = t.w.anchors[0];
const mx = () => M.min.x; // left edge of the shuttle
// 1. Shuttle: wait for it at the near end, both step on
t.both(7.2, -3, 7.2, -5);
t.waitFor(u => mx() < 8.4, 15);
t.both(9.7, -3, 9.7, -5, 3); console.log('aboard', t.st(), 'mover', mx().toFixed(2));
// ride; before reaching the laser, check whether it will be off; if not, shuffle to the other end
let tries = 0;
while (t.b.pos.x < 24 && tries < 6) {
  tries++;
  // ride toward the laser, staying at the platform centre
  t.waitFor(u => mx() + 1.5 > 13.5 || u.b.pos.y < -2, 12, () => t.steer(t.b, mx() + 1.5, -3), () => t.steer(t.n, mx() + 1.5, -5));
  // the riders cross x=16 in about (16-13.5)/2.4 s; wait at the back of the platform if the laser will be on then
  const arrive = (16 - (mx() + 1.5)) / 2.4;
  const phase = (t.w.t + arrive) % 2.8; // timer [on 1.3, off 1.5]
  console.log('approach', t.w.t.toFixed(2), 'phase at arrival', phase.toFixed(2), LZ.on);
  t.waitFor(u => mx() > 20 || u.w.stats.zaps[0] + u.w.stats.zaps[1] > 0, 8, () => t.steer(t.b, mx() + 2.6, -3), () => t.steer(t.n, mx() + 2.6, -5));
  console.log('ride', t.st(), 'zaps', JSON.stringify(t.w.stats.zaps));
  if (t.w.stats.zaps[0] + t.w.stats.zaps[1] === 0) { t.both(26, -3, 26, -5); break; }
  // zapped: back to start, try again
  t.w.stats.zaps = [0, 0]; t.both(7.2, -3, 7.2, -5); t.waitFor(u => mx() < 8.4, 15); t.both(9.7, -3, 9.7, -5, 3);
}
console.log('across', t.st(), t.log);
// 2. Ring
t.go(0, 34.6, -4); t.go(1, 33, -5);
t.waitFor(u => A.x < 37.3, 10);
let hung = false; for (let i = 0; i < 120 && !hung; i++) { t.tick({ mx: 0.4, power: true }, {}); hung = !!t.b.hang; } console.log('ring', hung, t.st());
t.waitFor(u => A.x > 40.6, 6, { power: true });
t.tick({ mx: 1, jump: true }, {}); t.run(1.0, () => ({ mx: 1, jump: true })); t.idle(0.5); console.log('far floor', t.st(), 'cog', t.w.cogs[0].got);
t.go(0, 43.6, -4); t.go(1, 34.6, -4); t.pullNut(46, -4); console.log('reeled', t.st(), t.log);
t.go(0, 48, -6.5); t.go(1, 48, -5.3); t.idle(0.3); t.tick({}, { power: true }); t.run(2, () => ({ mz: -1 })); t.idle(0.5); console.log('cog', t.w.cogs[0].got, t.st());
t.both(52, -3, 52, -5); t.idle(1);
// shortcut checks
const put = (p, x, y, z) => { p.pos = { x, y, z }; p.prev = { ...p.pos }; p.vel = { x: 0, y: 0, z: 0 }; };
{ const u = new Bot(level); put(u.b, 34.6, 0.56, -4); put(u.n, 33.5, 0.46, -4); u.idle(0.3); u.tick({}, { power: true }); u.run(2.5, () => ({ mx: 1 })); console.log('Ring: launch over the second gap without the ring (across should be false)', u.b.pos.x > 43 && u.w.stats.falls[0] === 0); }
{ const u = new Bot(level); put(u.n, 34.6, 0.46, -4); put(u.b, 43.6, 0.56, -4); u.b.face = { x: -1, z: 0 }; u.idle(0.2); u.run(1.6, () => ({ power: true })); console.log('Ring: Bolt reels Nut from the far edge (grabbed should be true)', !!u.n.pulledBy || u.n.pos.x > 40); }
console.log(t.st(), 'complete', t.w.complete, t.log);
