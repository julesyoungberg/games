import { Bot } from './bot.mjs';
const t = new Bot(6); const c = t.w.crates;
t.both(9.5, -3.5, 9.5, -4.5);
t.run(0.5, () => ({ mx: 1 }), () => ({ mx: 1 }));
t.run(2.0, b => b.steer(b.b, 11.5, -3.5), b => b.steer(b.n, 11.5, -4.5));
console.log('floating', t.st());
t.run(1.2, () => ({ mx: 1 }), () => ({ mx: 1 }));
console.log('on B', t.st());
t.both(21.5, -3.5, 21.5, -4.5);
// fan hop: jump right into fan 24..27, drift to 30.5 fan, then to 34+
const hop = b => ({ mx: 1, jump: true });
for (let i = 0; i < 60 * 6; i++) {
  const f = p => { if (p.pos.x < 25.5) return { mx: 1, jump: true }; if (p.pos.x < 30.5 && p.pos.y < 5.5) return { mx: 0 }; if (p.pos.x < 30.5) return { mx: 1 }; if (p.pos.x < 33 && p.pos.y < 6.6) return { mx: 0 }; return { mx: 1 }; };
  t.tick(f(t.b), f(t.n)); if (t.b.pos.x > 35 && t.n.pos.x > 35 && t.b.grounded && t.n.grounded) break;
}
console.log('across pit', t.st(), t.log);
t.go(0, 43.5, -4); t.go(1, 39, -6.3); t.idle(0.3);
t.run(2.5, b => b.steer(b.b, 45.5, -4)); t.run(1, () => ({ mx: 1 }));
console.log('bolt up', t.st());
t.go(0, 47.8, -4); t.pullNut(50, -4); console.log('pulled', t.st());
// crate (53,-3) on D; Bolt floats up fan 56..59 z-12..-9 to pillar 53..56 top 15
t.go(1, 49, -1.5);
t.go(0, 57.5, -8.6); t.run(3, b => b.steer(b.b, 57.5, -10.5)); console.log('in fan', t.st());
t.run(1.2, b => b.steer(b.b, 54.5, -10.5)); t.idle(0.5); console.log('pillar', t.st(), t.w.channels);
// face +z toward crate and pull
t.tick({ mz: 0.3 }, {}); t.grab(-0.3, 1, 0.1); console.log('target crate', t.b.target && t.b.target.obj === c[0]);
t.run(2.5, () => ({ power: true })); console.log('c', t.pos(c[0]));
// place crate on plate (54.5,-10.5): Bolt stands at 54.5,-10.5+? crate in front facing -x... pillar 53..56 small. Bolt at 55.5,-10.5 facing -x -> crate at 53.8
t.goHold(55.4, -10.5); t.run(0.2, () => ({ power: true, mx: -0.3 })); t.run(1, () => ({ power: true }));
t.idle(0.8); console.log('c', t.pos(c[0]), t.w.channels);
t.run(1, () => ({ mz: 1 })); t.idle(1);
t.both(66, -3, 66, -5, 15); t.both(69, -3, 69, -5); t.idle(1.5);
console.log(t.st(), 'complete', t.w.complete, t.log);
