import { Bot } from './bot.mjs';
const t = new Bot(2); const c = t.w.crates;
t.launchBolt(11.5, -4, 1, 0, 1.0); console.log('launched', t.st());
t.go(0, 12.8, -4); t.pullNut(15, -4); console.log('pulled', t.st());
t.go(1, 17, -6.5); t.launchBolt(21.5, -4, 1, 0, 1.4); console.log('gap', t.st());
t.go(0, 27.6, -4); t.pullNut(30, -4); console.log('pulled', t.st());
// crate to shelf: Nut pushes crate toward -z (crate at 32,-4.5). Nut stands at z -3.4 behind it
// Alternative: Bolt carries crate to (35,-7.3) then Nut launches it
t.go(1, 29, -6.5); t.go(0, 32, -2); t.grab(0, -1, 0.3); t.carry(c[0], 35, -7.2, 0, -1); console.log('crate placed', t.pos(c[0]));
t.go(0, 37.5, -3);
t.go(1, 35, -5.6); t.idle(0.2); t.tick({}, { power: true }); t.idle(2);
console.log('crate after push', t.pos(c[0]), 'ch1', t.w.channels[1]);
t.idle(1);
t.both(50, -3, 50, -5, 15);
t.launchBolt(51.5, -4, 1, 0, 1.0); t.go(0, 53, -4); t.pullNut(55, -4);
t.both(59, -3, 59, -5); t.idle(1.5);
console.log(t.st(), 'complete', t.w.complete, t.log);
