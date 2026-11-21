import { Bot } from './bot.mjs';
// jump height on level 0 flat floor
let t = new Bot(0); t.idle(0.5);
let y0 = t.b.pos.y, maxY = y0; t.tick({ jump: true }, {}); for (let i = 0; i < 60; i++) { t.tick({ jump: true }, {}); maxY = Math.max(maxY, t.b.pos.y); }
console.log('bolt jump height', (maxY - y0).toFixed(2));
// jump distance
t = new Bot(0); t.idle(0.3); let x0 = t.b.pos.x; t.run(0.5, () => ({ mx: 1 }));
let xs = t.b.pos.x; t.tick({ mx: 1, jump: true }); let n = 0; while (!t.b.grounded || n < 3) { t.tick({ mx: 1, jump: true }); n++; if (n > 200) break; }
console.log('jump dist', (t.b.pos.x - xs).toFixed(2));
// launch height: nut pushes bolt
t = new Bot(0); t.idle(0.3); t.b.pos.x = 5; t.b.pos.z = -4; t.n.pos.x = 4; t.n.pos.z = -4; t.idle(0.3);
y0 = t.b.pos.y; maxY = y0; t.tick({}, { power: true }); for (let i = 0; i < 90; i++) { t.tick({}, {}); maxY = Math.max(maxY, t.b.pos.y); }
console.log('launch height', (maxY - y0).toFixed(2), 'x travel', (t.b.pos.x - 5).toFixed(2));
// boost: bolt on nut
t = new Bot(0); t.idle(0.3); t.n.pos.x = 8; t.n.pos.z = -4; t.b.pos.x = 8; t.b.pos.z = -4; t.b.pos.y = 3; t.idle(0.6);
console.log('stacked', t.st(), 'ground of bolt is nut', t.b.ground === t.n);
y0 = t.b.pos.y; maxY = y0; for (let i = 0; i < 60; i++) { t.tick({ jump: true }, {}); maxY = Math.max(maxY, t.b.pos.y); }
console.log('boost apex (feet)', (maxY - 0.55).toFixed(2));
// pull: crate on level 2 across gap
t = new Bot(1); t.go(0, 11.6, -6.5); console.log('bolt at edge', t.st());
t.run(0.05, () => ({ mx: 1 })); t.run(2, () => ({ power: true }));
console.log('crate', t.pos(t.w.crates[0]), 'pulledBy', !!t.w.crates[0].pulledBy);
t.run(3, b => ({ power: true, ...b.steer(b.b, 8.5 + 1.7, -6.3) })); // carry toward plate (crate in front facing -x)
t.run(0.5, b => ({ power: true, mx: -1 })); t.idle(1);
console.log('crate after drop', t.pos(t.w.crates[0]), 'ch1', !!t.w.channels[1]);
console.log(t.log.join('\n'));
