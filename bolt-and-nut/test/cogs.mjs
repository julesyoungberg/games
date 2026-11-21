// Checks every golden cog can be reached with the intended move (positions are set up directly).
import { Bot } from './bot.mjs';
const setup = (t, bx, bz, nx, nz) => { const gy = (x, z) => { let best = -99; for (const s of t.w.solids) if (x >= s.min.x && x <= s.max.x && z >= s.min.z && z <= s.max.z && s.max.y > best && s.kind === 'static') best = s.max.y; return best; };
  t.b.pos = { x: bx, y: gy(bx, bz) + 0.6, z: bz }; t.n.pos = { x: nx, y: gy(nx, nz) + 0.5, z: nz }; t.b.prev = { ...t.b.pos }; t.n.prev = { ...t.n.pos }; t.idle(0.4); };
const moves = {
  boost: (t, c) => { setup(t, c.x, c.z, c.x, c.z); t.b.pos.y = t.n.pos.y + 1.05; t.idle(0.4); for (let i = 0; i < 70; i++) t.tick({ jump: i < 30 }, {}); },
  launch: (t, c) => { setup(t, c.x - 1.25, c.z, c.x - 2.45, c.z); t.tick({}, { power: true }); t.idle(1.5); },
  rocket: (t, c) => { setup(t, c.x - 4, c.z + 3, c.x, c.z); t.tick({}, { power: true }); t.idle(1.5); },
};
const plan = [
  ['boost'], ['boost'], ['launch'], ['rocket'], ['launch'], ['launch'],
  ['custom', t => { setup(t, 20, -3, 18, -5); t.run(3, b => b.steer(b.b, 30.5, -2.5), () => ({})); }],
  ['rocket'],
  ['custom', t => { setup(t, 30.5, -1, 26, -6.3); t.idle(0.3); }], // standing on the fast belt edge (plate not pressed: belt pushes back toward x 30)
  ['custom', t => { setup(t, 49.5, -6.5, 45, -0.6); t.tick({}, { power: true }); t.idle(3.5); }],
  ['launch'], ['launch'],
];
let ok = true;
for (let l = 0; l < 12; l++) {
  const t = new Bot(l); const c = t.w.cogs[0];
  const [kind, fn] = plan[l];
  if (kind === 'custom') fn(t); else moves[kind](t, c);
  const got = c.got; ok = ok && got;
  console.log(`Shift ${l + 1} cog (${kind}): ${got ? 'reached' : 'MISSED'}`);
}
process.exit(ok ? 0 : 1);
