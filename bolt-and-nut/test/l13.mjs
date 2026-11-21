import { Bot } from './bot.mjs';
import level from '../src/lv/s13.js';
const t = new Bot(level); const c = t.w.crates; const sw = t.w.switches;
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
const press = () => { t.tick({}, { power: true }); t.idle(0.3); };
// 1. Bolt bounces onto the plate; Nut walks through and flips the switch
t.go(0, 8, -3.8); t.go(0, 11, -3.8, 8, 0.3);
t.waitFor(t => t.b.pos.y > 2.5, 3);
t.run(1.2, b => b.steer(b.b, 11, -6.5));
console.log('on plate', t.st(), t.w.channels[1]);
t.go(1, 8, -1.2); t.go(1, 18, -1.2); t.go(1, 19.5, -5.5); press(); console.log('sw2', sw[0].on, t.w.gates[0].open);
t.both(18, -2.5, 19, -4.5, 10); console.log('P1', t.st(), t.log);
// 2. Nut launches Bolt over the pit
t.go(0, 31.3, -3, 10); t.go(1, 30.2, -3, 10);
t.launchBolt(31.3, -3, 1, 0, 1.2); console.log('over pit', t.st(), t.log);
// Bolt catches the bouncing crate and puts it on the plate
t.go(0, 37.7, -6.5);
t.waitFor(t => c[0].pos.y > -2, 3);
t.grab(-1, 0, 1.5); console.log('caught', !!c[0].pulledBy, t.pos(c[0]), t.st());
t.carry(c[0], 40, -6.5, 1, 0); console.log('plate3', t.pos(c[0]), t.w.channels[3], t.st());
t.go(0, 38.5, -3); t.pullNut(41, -3); console.log('nut over', t.st(), t.w.gates[1].open);
t.both(47, -2.5, 47, -4.5, 10); console.log('P2', t.st(), t.log);
// 3. Bolt bounces, Nut pushes him on the way up
t.go(1, 52.5, -4); t.go(0, 52, -1.5); t.go(0, 54.25, -1.5); t.go(0, 54.25, -4, 4, 0.2);
let k = 0; t.waitFor(t => { k++; return k > 60 && t.b.vel.y > 0 && t.b.pos.y > 2 && Math.hypot(t.b.pos.x - t.n.pos.x, t.b.pos.y - t.n.pos.y, t.b.pos.z - t.n.pos.z) < 3.2 && Math.hypot(t.b.pos.x - t.n.pos.x, t.b.pos.y - t.n.pos.y, t.b.pos.z - t.n.pos.z) > 3.0; }, 6, b => b.steer(b.b, 54.25, -4));
console.log('push at', t.st()); t.tick({}, { power: true });
let mx = 0; t.run(1.5, b => { mx = Math.max(mx, b.b.pos.y); return b.b.pos.x < 58.3 ? { mx: 1 } : {}; }); t.idle(0.4); console.log('ledge', t.st(), 'max', mx.toFixed(2));
t.go(0, 58.5, -4); t.pullNut(59, -4); console.log('P3', t.st(), t.log);
// 4. Nut reverses the belt; Bolt shoves the wooden crate onto it; the spring throws it onto the plate
t.go(1, 62, -2); press(); console.log('sw4', sw[1].on);
t.go(0, 58.5, -6.2); t.shove(0, c[1], 65, -6.2); t.go(0, 63, -3);
t.waitFor(t => t.w.channels[1], 8); t.idle(1); console.log('wood', t.pos(c[1]), t.w.channels[1], t.st());
t.both(76, -2.5, 75, -3.5, 10); t.both(82, -2.5, 82, -4.5, 10); console.log('P4', t.st(), t.log);
// 5. Nut bounces and flips the high switch at the top of a bounce
t.go(0, 83, -1.5);
t.go(1, 85.5, -4.5); t.go(1, 87.6, -4.8, 4, 0.3);
const dSw = () => Math.hypot(sw[2].x - t.n.pos.x, sw[2].top + 0.6 - t.n.pos.y, sw[2].z - t.n.pos.z);
k = 0; t.waitFor(t => { k++; return k > 40 && t.n.vel.y < 1 && t.n.pos.y > 7 && dSw() < 3.4; }, 6, {}, b => b.steer(b.n, 87.6, -4.8));
t.tick({}, { power: true }); console.log('sw5', sw[2].on, t.w.gates[3].open, t.st());
t.run(1.5, () => ({}), b => b.steer(b.n, 85.8, -4)); t.go(1, 85.9, -4, 4, 0.15); t.idle(1);
t.go(0, 87.6, -1.5); t.go(0, 87.6, -4, 4, 0.2);
k = 0; t.waitFor(t => { k++; return k > 60 && t.b.vel.y > 0 && t.b.pos.y > 6 && Math.hypot(t.b.pos.x - t.n.pos.x, t.b.pos.y - t.n.pos.y, t.b.pos.z - t.n.pos.z) > 3.0 && Math.hypot(t.b.pos.x - t.n.pos.x, t.b.pos.y - t.n.pos.y, t.b.pos.z - t.n.pos.z) < 3.2; }, 6, b => b.steer(b.b, 87.6, -4));
console.log('push at', t.st()); t.tick({}, { power: true });
mx = 0; t.run(1.5, b => { mx = Math.max(mx, b.b.pos.y); return b.b.pos.x < 91 ? { mx: 1 } : {}; }); t.idle(0.4); console.log('top', t.st(), 'max', mx.toFixed(2));
t.go(0, 91.5, -4); t.pullNut(92.5, -4); console.log('P5', t.st(), t.log);
t.both(96, -3, 96, -5, 10); t.idle(1.5);
console.log(t.st(), 'complete', t.w.complete, t.log);
