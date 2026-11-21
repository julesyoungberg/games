import { Bot } from './bot.mjs';
import level from '../src/lv/s14.js';
const t = new Bot(level); const c = t.w.crates; const sw = t.w.switches;
const press = () => { t.tick({}, { power: true }); t.idle(0.3); };
// shove crate along a line: walk behind it and push toward (tx,tz)
t.shove = function (who, crate, tx, tz, sec = 12) {
  const p = this.w.players[who];
  for (let i = 0; i < sec * 60; i++) {
    const dx = tx - crate.pos.x, dz = tz - crate.pos.z, d = Math.hypot(dx, dz); if (d < 0.15) break;
    const ux = dx / d, uz = dz / d;
    const bx = crate.pos.x - ux * (0.6 + p.half.x + 0.15), bz = crate.pos.z - uz * (0.6 + p.half.z + 0.15);
    const along = (p.pos.x - crate.pos.x) * ux + (p.pos.z - crate.pos.z) * uz;
    let gx = bx, gz = bz;
    if (along > -0.8) { gx = crate.pos.x - ux * 1.6 + uz * 1.6; gz = crate.pos.z - uz * 1.6 - ux * 1.6; }
    const nearBehind = Math.hypot(p.pos.x - bx, p.pos.z - bz) < 0.35;
    const inp = nearBehind ? { mx: ux * Math.min(1, d / 0.8 + 0.3), mz: uz * Math.min(1, d / 0.8 + 0.3) } : this.steer(p, gx, gz);
    this.tick(who === 0 ? inp : {}, who === 1 ? inp : {});
  }
  this.idle(0.3);
};
// 1. Bounce Test
t.go(1, 8.5, -2.4); console.log('ch1', t.w.channels[1]);
t.go(0, 2.5, -6.3); for (let i = 0; i < 240 && c[0].pos.x < 7; i++) t.tick({ mx: 1 }, {}); t.go(0, 4.5, -3.5);
t.waitFor(t => t.w.channels[2], 10); console.log('crate', t.pos(c[0]), 'ch2', t.w.channels[2], t.w.t.toFixed(1));
t.idle(1);
t.both(24, -3, 24, -5); console.log('P1 done', t.st(), t.log, t.w.gates[0].open);
// 2. Reverse Polarity
t.go(1, 27.5, -5.2); press(); console.log('sw3', sw[0].on, t.w.lasers[1].on);
t.go(0, 29.4, -4); t.go(1, 29.4, -5.5);
t.grab(1, 0, 1.2); console.log('hang1', t.st(), t.b.hang);
t.tick({ mx: 1 }, {}); t.tick({ mx: 1 }, {}); t.grab(1, 0, 1.2); console.log('hang2', t.st(), t.b.hang);
t.run(0.05, () => ({ mx: 1, power: true })); t.run(0.8, () => ({ mx: 1, jump: true })); t.idle(0.3); console.log('landed', t.st());
t.go(1, 29.6, -4); t.go(0, 39.6, -4); t.tick({ mx: -0.3 }, {}); t.tick({ power: true }, {}); console.log('target', t.b.target && t.b.target.kind); t.pullNut(42, -4); console.log('P2 done', t.st(), t.log);
// 3. Wind Tunnel
t.go(1, 44.5, -6.3); console.log('fan', t.w.fans[0].on);
t.go(0, 49.5, -4); t.idle(1.5); console.log('floating', t.st());
t.run(1, () => ({ mx: 1 })); t.go(0, 52, -4); console.log('ledge', t.st());
t.go(1, 47, -4); t.tick({ mx: -0.3 }, {}); t.pullNut(54, -4); console.log('P3 done', t.st(), t.log);
// 4. Lift Inspection
t.go(1, 56, -6.3); console.log('hatch solid', t.w.bridges[0].on);
t.go(0, 60.5, -4);
const bounceUp = (who, z) => { const p = t.w.players[who]; let up = false;
  for (let i = 0; i < 600; i++) { const inp = p.vel.y < 4 && p.pos.y > 11.4 ? { mx: 1 } : (p.pos.x < 62.9 && p.pos.y < 7 ? t.steer(p, 63, z) : (p.pos.y > 11.6 ? { mx: 1 } : t.steer(p, 63, z))); t.tick(who === 0 ? inp : {}, who === 1 ? inp : {}); if (p.grounded && p.pos.y > 11 && p.pos.x > 64.5) { up = true; break; } } return up; };
console.log('bolt up', bounceUp(0, -1), t.st(), t.w.cogs[0].got);
t.go(0, 69.3, -3); t.grab(1, 0, 0.8); console.log('grab', !!c[1].pulledBy); t.carry(c[1], 66.5, -6.3, 0, -1); console.log('crate', t.pos(c[1]), t.w.channels[5]);
t.go(1, 60.5, -4); console.log('nut up', bounceUp(1, -4), t.st());
t.both(74, -2.5, 74, -5); console.log('P4 done', t.st(), t.log);
// 5. Transit + Final Inspection
const m = t.w.movers[0];
t.both(79.2, -3, 79.2, -5);
t.waitFor(t => m.off.x < 0.05 && m.wait > 0.3, 20);
t.run(0.5, b => b.steer(b.b, 81.6, -3), b => b.steer(b.n, 81.6, -5));
t.waitFor(t => m.off.x > 4.75, 10); console.log('rode', t.st());
t.run(0.8, () => ({ mx: 1 }), () => ({ mx: 1 }));
t.both(91, -2.5, 89.2, -6.5); console.log('at iron', t.st());
t.tick({}, { power: true }); t.run(1.2, () => ({}), b => b.n.pos.y > 14.8 || b.n.vel.y < 0 ? { mx: 1 } : {}); t.go(1, 92, -6.2, 3); console.log('shelf', t.st());
press(); console.log('sw', t.w.switches[1].on, 'laser', t.w.lasers[2].on);
const bounce2 = (who) => { const p = t.w.players[who];
  for (let i = 0; i < 600; i++) { const inp = p.pos.y > 16.2 ? { mx: 1 } : t.steer(p, 96.5, -4); t.tick(who === 0 ? inp : {}, who === 1 ? inp : {}); if (p.grounded && p.pos.y > 16 && p.pos.x > 98) return true; } return false; };
t.go(0, 94.5, -4); console.log('bolt top', bounce2(0), t.st());
t.go(1, 94.5, -4, 4); console.log('nut top', bounce2(1), t.st());
t.both(104, -3, 104, -5); t.idle(1.5);
console.log('cog', t.w.cogs[0].got, 'stats', JSON.stringify(t.w.stats));
console.log(t.st(), 'complete', t.w.complete, t.log);
