import { Bot } from './bot.mjs';
const t = new Bot(6);
t.b.pos = { x: 43.5, y: 6.6, z: -4 }; t.n.pos = { x: 39, y: 6.5, z: -6.3 }; t.idle(0.5);
console.log(t.st(), t.w.channels, t.w.fans[2]);
for (let i = 0; i < 150; i++) { t.tick(t.steer(t.b, 45.5, -4), {}); if (i % 10 == 0) console.log(i, t.pos(t.b), t.b.vel.y.toFixed(1)); }
