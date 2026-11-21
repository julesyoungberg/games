import { Bot } from './bot.mjs';
const t = new Bot(10); const c = t.w.crates;
// shove crate along x: walk behind it then push to target x
t.shove = function (who, crate, tx, tz, sec = 12) {
  const p = this.w.players[who];
  for (let i = 0; i < sec * 60; i++) {
    const dx = tx - crate.pos.x, dz = tz - crate.pos.z, d = Math.hypot(dx, dz); if (d < 0.15) break;
    const ux = dx / d, uz = dz / d;
    const bx = crate.pos.x - ux * (0.6 + p.half.x + 0.15), bz = crate.pos.z - uz * (0.6 + p.half.z + 0.15);
    // get behind: if not behind, path around
    const along = (p.pos.x - crate.pos.x) * ux + (p.pos.z - crate.pos.z) * uz;
    let gx = bx, gz = bz;
    if (along > -0.8) { gx = crate.pos.x - ux * 1.6 + uz * 1.6; gz = crate.pos.z - uz * 1.6 - ux * 1.6; }
    const nearBehind = Math.hypot(p.pos.x - bx, p.pos.z - bz) < 0.35;
    const inp = nearBehind ? { mx: ux * Math.min(1, d / 0.8 + 0.3), mz: uz * Math.min(1, d / 0.8 + 0.3) } : this.steer(p, gx, gz);
    this.tick(who === 0 ? inp : {}, who === 1 ? inp : {});
  }
  this.idle(0.3);
};
t.shove(0, c[0], 11, -6.2); console.log('A', t.pos(c[0]), t.w.channels[1]);
t.idle(1); t.both(17, -2, 17, -6);
t.shove(0, c[1], 29.3, -4); console.log('B', t.pos(c[1]));
t.go(0, 27.5, -4); t.run(0.5, () => ({ mx: 1, jump: true })); t.idle(0.4); console.log('on crate?', t.b.ground === c[1], t.st());
t.go(0, c[1].pos.x, -4, 2, 0.1);
t.go(1, 27.4, -4); t.idle(0.2); t.tick({}, { power: true }); t.run(1.5, () => ({ mx: 1 })); t.idle(0.4);
console.log('launched', t.st());
t.go(0, 31.5, -4); t.pullNut(32.5, -4); console.log('pulled', t.st());
t.shove(0, c[2], 40, -6.3); console.log('wood on 2', t.pos(c[2]), t.w.channels[2]);
t.go(0, 31, -2.5); t.grab(1, 0, 0.8); console.log('iron', !!c[3].pulledBy); t.carry(c[3], 42, -1.8, 1, 0); console.log('iron on 3', t.pos(c[3]), t.w.channels[3]);
t.both(39.5, -4.2, 38, -4.2); t.both(43.4, -4.2, 42, -4.2); t.both(53, -4, 53.5, -5.5, 15); console.log('across', t.st(), t.w.bridges[0].on);
t.go(0, 52.6, -2); t.grab(-1, 0, 0.8); console.log('grab iron', !!c[3].pulledBy);
t.carry(c[3], 56, -6.3, 0, -1); console.log('on 4', t.pos(c[3]), t.w.channels[4]);
t.idle(1); t.both(62.5, -2, 62.5, -5); console.log('gate', t.st());
t.idle(1.5); console.log('belt crate', t.pos(c[4]));
t.shove(0, c[4], 78, -4, 20); t.shove(0, c[4], 78, -6.2, 8); console.log('wood on 5', t.pos(c[4]), t.w.channels[5]);
t.idle(1); t.both(76, -2, 75, -3); t.both(85, -2, 85, -3.5); t.both(90, -3, 91, -5, 15); t.idle(1.5);
console.log(t.st(), 'complete', t.w.complete, t.log);
