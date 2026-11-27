import { Bot } from './bot.mjs';
import level from '../src/lv/ot38.js';
const t = new Bot(level);
const ph = () => t.w.t % 3.2; // green (ch 4) lit for ph < 1.8, purple (ch 5) lit for ph >= 1.6 or < 0.2
const zB = -3, zN = -5.5;
// 1. Turnstile: wait for green, step onto the first bridge, then hop bridge to bridge on the beat
t.both(7.4, zB, 7.4, zN);
t.waitFor(u => ph() > 0.05 && ph() < 0.2, 8);
t.both(12.2, zB, 12.2, zN, 2); console.log('bridge 1', t.st(), ph().toFixed(2));
const hop = (fromEdge, to, launchAt) => {
  t.both(fromEdge, zB, fromEdge, zN, 2);
  t.waitFor(u => Math.abs(ph() - launchAt) < 0.03, 4);
  t.run(0.3, () => ({ mx: 1, jump: true }), () => ({ mx: 1, jump: true }));
  t.run(0.45, u => u.steer(u.b, to, zB), u => u.steer(u.n, to, zN));
  console.log('hop to', to, t.st(), ph().toFixed(2), t.log.join(' '));
};
hop(12.3, 15.6, 1.3);  // onto purple
hop(17.1, 20.4, 2.9);  // onto green
hop(21.9, 25.2, 1.3);  // onto purple
hop(26.7, 30, 2.9);    // onto the floor
const falls1 = t.w.stats.falls[0] + t.w.stats.falls[1];
console.log('turnstile', t.st(), 'falls', falls1);
// 2. Lift: wait for the fan (orange) to start, ride, step off, wait for the gate
t.both(36.6, -3.5, 36.6, -4.8);
const F = t.w.fans[0], G = t.w.gates[0], LZ = t.w.lasers[0];
t.waitFor(u => !F.on, 6); t.waitFor(u => F.on, 6); // the moment the fan starts, the laser stops
console.log('fan starts', t.w.t.toFixed(2), 'laser', LZ.on);
t.run(0.5, u => u.steer(u.b, 39.5, -3.5), u => u.steer(u.n, 39.5, -4.6));
t.run(0.8, u => u.steer(u.b, 39.5, -3.5), u => u.steer(u.n, 39.5, -4.6));
console.log('rising', t.st(), F.on);
t.run(0.6, u => u.steer(u.b, 43, -3.5), u => u.steer(u.n, 43, -5)); t.idle(0.3);
console.log('upper', t.st(), 'fan', F.on, 'zaps', JSON.stringify(t.w.stats.zaps));
// golden cog: Nut launches Bolt back out over the fan
t.launchBolt(42.2, -4, -1, 0, 0.6); console.log('cog', t.w.cogs[0].got, t.st());
t.both(43.5, -3.5, 43.5, -5);
t.waitFor(u => G.open > 0.95, 8);
t.both(54, -3, 54, -5, 4); t.idle(1);
console.log(t.st(), 'gate', G.open.toFixed(2));
// shortcut checks
const put = (p, x, y, z) => { p.pos = { x, y, z }; p.prev = { ...p.pos }; p.vel = { x: 0, y: 0, z: 0 }; };
{ // walking straight across the bridges without waiting
  const u = new Bot(level); put(u.b, 7.5, 0.56, -3); put(u.n, 7.5, 0.46, -5.5); u.run(4, () => ({ mx: 1, jump: true }), () => ({ mx: 1, jump: true }));
  console.log('Turnstile: run and jump straight over (fell should be true)', u.w.stats.falls[0] > 0 && u.w.stats.falls[1] > 0);
}
{ // skip a bridge: jump from the first green bridge straight to the second green one
  const u = new Bot(level); put(u.b, 12.5, 0.56, -3); u.w.t = 0.1; u.run(0.6, () => ({ mx: 1, jump: true })); u.run(1.5, () => ({ mx: 1 }));
  console.log('Turnstile: skip a bridge (fell should be true)', u.w.stats.falls[0] > 0);
}
{ // Nut launches Bolt over the whole lift without the fan
  const u = new Bot(level); put(u.b, 37, 0.56, -4); put(u.n, 35.9, 0.46, -4); u.w.t = 2.2; u.idle(0.1); u.tick({}, { power: true }); u.run(1.5, () => ({ mx: 1 }));
  console.log('Lift: launch onto the high floor without the fan (made it should be false)', u.b.pos.y > 4.5);
}
{ // can you jump from the fan floor when it is off
  const u = new Bot(level); put(u.b, 40.5, 0.56, -4); u.w.t = 2.2; u.run(1, () => ({ mx: 1, jump: true }));
  console.log('Lift: jump up without the fan (made it should be false)', u.b.pos.y > 4.5);
}
console.log(t.st(), 'complete', t.w.complete, t.log);
