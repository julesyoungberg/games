import { Bot } from './bot.mjs';
const t = new Bot(1);
const c = t.w.crates;
t.go(0, 11.5, -6.5); t.grab(1, 0, 1.5);
t.carry = function (crate, px, pz, fx, fz) { // carry crate so it ends over (px,pz); Bolt stands at p - f*1.7
  for (let i = 0; i < 400; i++) { if (Math.hypot(crate.pos.x - px, crate.pos.z - pz) < 0.3) break; this.tick({ power: true, ...this.steer(this.b, px - fx * 1.7, pz - fz * 1.7) }, {}); if (Math.hypot(this.b.pos.x - (px - fx * 1.7), this.b.pos.z - (pz - fz * 1.7)) < 0.2) this.tick({ power: true, mx: fx * 0.3, mz: fz * 0.3 }, {}); }
  this.idle(0.8);
};
t.carry(c[0], 8.5, -6.3, -1, 0);
console.log('crate0', t.pos(c[0]), 'ch1', t.w.channels[1]);
t.both(18, -3, 18, -2.5); t.both(30, -3, 30, -5);
t.boostBolt(33, -4, 1, 0); console.log('boost', t.st());
t.go(0, 34.6, -4); t.pullNut(37, -2); console.log('pulled', t.st());
t.go(0, 38, -4.5); t.grab(0, 1, 0.5); console.log('target', t.b.target && t.b.target.obj === c[2]);
t.carry(c[2], 36, -6.3, -1, 0); console.log('crate2', t.pos(c[2]), 'ch2', t.w.channels[2]);
t.go(1, 36, -1.5);
t.go(0, 40, -6.5); t.grab(0, -1, 0.3); console.log('shelf target', t.b.target && t.b.target.obj === c[1]);
t.run(1.5, () => ({ power: true })); console.log('c1', t.pos(c[1]));
t.goHold(40, -3); t.carry(c[1], 44, -6.3, 1, 0);
console.log('c1', t.pos(c[1]), 'ch3', t.w.channels[3], 'ch2', t.w.channels[2]);
t.idle(1); console.log('gate', t.w.gates[0].open);
t.both(42, -1, 42.5, -2); t.both(54, -3, 54, -5, 15); t.idle(1.5);
console.log(t.st(), 'complete', t.w.complete, t.log);
const g = t.w.gates[0]; console.log(g.min, g.max, t.w.channels);
