import { createWorld, step, C } from '../src/sim.js';
export function I(o = {}) { return { mx: 0, mz: 0, jump: false, jumpP: false, power: false, powerP: false, ...o }; }
export class Bot {
  constructor(level) { this.w = createWorld(level); this.log = []; this.prevIn = [I(), I()]; }
  get b() { return this.w.players[0]; } get n() { return this.w.players[1]; }
  tick(inA, inB) {
    const mk = (i, p) => { i = I(i); i.jumpP = i.jump && !p.jump; i.powerP = i.power && !p.power; return i; };
    const a = mk(inA, this.prevIn[0]), b = mk(inB, this.prevIn[1]);
    this.prevIn = [a, b];
    this.w.events = [];
    step(this.w, [a, b], 1 / 60);
    for (const e of this.w.events) if (['fall', 'zap', 'complete', 'checkpoint', 'crate-lost'].includes(e.type)) this.log.push(this.w.t.toFixed(2) + ' ' + e.type + (e.who !== undefined ? ':' + e.who : ''));
  }
  run(sec, fA, fB) { const n = Math.round(sec * 60); for (let i = 0; i < n; i++) { this.tick(fA ? fA(this) : {}, fB ? fB(this) : {}); } }
  // steer player p toward x,z; returns input
  steer(p, x, z, extra = {}) { const dx = x - p.pos.x, dz = z - p.pos.z, d = Math.hypot(dx, dz); if (d < 0.15) return { ...extra }; const s = Math.min(1, d / 0.8); return { mx: dx / d * s, mz: dz / d * s, ...extra }; }
  // walk until within tolerance or timeout
  go(who, x, z, sec = 8, tol = 0.25, other = null) {
    const p = this.w.players[who];
    for (let i = 0; i < sec * 60; i++) {
      if (Math.hypot(p.pos.x - x, p.pos.z - z) < tol) return true;
      const inp = this.steer(p, x, z);
      this.tick(who === 0 ? inp : (other || {}), who === 1 ? inp : (other || {}));
    }
    return false;
  }
  both(xb, zb, xn, zn, sec = 10) {
    for (let i = 0; i < sec * 60; i++) {
      const db = Math.hypot(this.b.pos.x - xb, this.b.pos.z - zb), dn = Math.hypot(this.n.pos.x - xn, this.n.pos.z - zn);
      if (db < 0.25 && dn < 0.25) return true;
      this.tick(db < 0.25 ? {} : this.steer(this.b, xb, zb), dn < 0.25 ? {} : this.steer(this.n, xn, zn));
    }
    return false;
  }
  idle(sec, a = {}, b = {}) { this.run(sec, () => a, () => b); }
  pos(p) { return `(${p.pos.x.toFixed(2)},${p.pos.y.toFixed(2)},${p.pos.z.toFixed(2)})`; }
  st() { return `B${this.pos(this.b)} N${this.pos(this.n)}`; }
}
// ---- higher-level co-op moves
Bot.prototype.boostBolt = function (nx, nz, dirx, dirz) {
  this.go(1, nx, nz, 10, 0.2);
  this.go(0, nx - dirx * 1.3, nz - dirz * 1.3, 10, 0.15);
  this.idle(0.2);
  // hop onto Nut: jump, then steer to stand right above her
  for (let i = 0; i < 70; i++) { const s = this.steer(this.b, this.n.pos.x, this.n.pos.z); this.tick({ ...s, jump: i < 18 }, {}); }
  this.onNut = this.b.ground === this.n;
  // jump toward ledge
  for (let i = 0; i < 70; i++) this.tick({ mx: dirx, mz: dirz, jump: i < 30 }, {});
  this.idle(0.2);
};
Bot.prototype.launchBolt = function (bx, bz, dirx, dirz, steerSec = 1.2) {
  this.go(0, bx, bz, 10, 0.2);
  this.go(1, bx - dirx * 1.1, bz - dirz * 1.1, 10, 0.2);
  this.idle(0.2);
  this.tick({}, { power: true });
  this.run(steerSec, () => ({ mx: dirx, mz: dirz }));
  this.idle(0.4);
};
Bot.prototype.pullNut = function (tx, tz, sec = 4) {
  // Bolt faces Nut, holds pull, then walks to (tx,tz) and releases
  const b = this.b, n = this.n;
  const dx = n.pos.x - b.pos.x, dz = n.pos.z - b.pos.z, d = Math.hypot(dx, dz) || 1;
  this.tick({ mx: dx / d * 0.3, mz: dz / d * 0.3 }, {});
  this.run(1.6, () => ({ power: true }));
  for (let i = 0; i < sec * 60; i++) {
    if (Math.hypot(b.pos.x - tx, b.pos.z - tz) < 0.2) break;
    this.tick({ power: true, ...this.steer(b, tx, tz) }, {});
  }
  this.run(0.4, () => ({ power: true }));
  this.idle(0.6);
};
Bot.prototype.grab = function (fx, fz, sec = 2) { this.tick({ mx: fx * 0.3, mz: fz * 0.3 }, {}); this.run(sec, () => ({ power: true })); };
Bot.prototype.carry = function (crate, px, pz, fx, fz) {
  for (let i = 0; i < 400; i++) { if (Math.hypot(crate.pos.x - px, crate.pos.z - pz) < 0.3) break; this.tick({ power: true, ...this.steer(this.b, px - fx * 1.7, pz - fz * 1.7) }, {}); if (Math.hypot(this.b.pos.x - (px - fx * 1.7), this.b.pos.z - (pz - fz * 1.7)) < 0.2) this.tick({ power: true, mx: fx * 0.3, mz: fz * 0.3 }, {}); }
  this.idle(0.8);
};
Bot.prototype.waitFor = function (cond, sec = 20, a = {}, b = {}) { for (let i = 0; i < sec * 60; i++) { if (cond(this)) return true; this.tick(typeof a === 'function' ? a(this) : a, typeof b === 'function' ? b(this) : b); } return false; };
Bot.prototype.goHold = function (x, z, sec = 6) { for (let i = 0; i < sec * 60 && Math.hypot(this.b.pos.x - x, this.b.pos.z - z) > 0.25; i++) this.tick({ power: true, ...this.steer(this.b, x, z) }, {}); };
