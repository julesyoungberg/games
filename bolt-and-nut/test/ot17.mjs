import { Bot } from '/home/claude/games/bolt-and-nut/test/bot.mjs';
import def from '../src/lv/ot17.js';
const t = new Bot(def); const S = t.w.switches; const Y = 6; // S[0] teal (gate), S[1] pink (cupboard), S[2] orange (fan)
const H = { power: true };
// Nut presses X once
const press = (u, extraB = {}) => { u.tick(extraB, { power: true }); u.idle(0.3, extraB); };
// Bolt on the pillar faces Nut, reels her up, then turns to (fx, fz) and keeps holding
const lantern = (u, fx, fz) => { const dx = u.n.pos.x - u.b.pos.x, dz = u.n.pos.z - u.b.pos.z, d = Math.hypot(dx, dz);
  u.tick({ mx: dx / d * 0.25, mz: dz / d * 0.25 }, {}); u.run(1.6, () => H); u.tick({ ...H, mx: fx * 0.25, mz: fz * 0.25 }, {}); u.run(0.8, () => H); return !!u.n.pulledBy; };
// 1. Remote Working: Nut launches Bolt onto the pillar, Bolt holds Nut out by the tall post, Nut flips the teal switch
t.go(0, 10, -4.6); t.go(1, 9.3, -4.6); t.idle(0.3); t.tick({}, { power: true }); t.run(1.3, () => t.steer(t.b, 11.4, -4.6)); t.idle(0.3);
console.log('bolt on pillar', t.b.pos.y > 3.5, t.st());
// golden cog first: hold Nut out toward the back post, flip the pink switch, then the teal one
console.log('lantern back', lantern(t, 0, -1), t.st()); press(t, H); console.log('pink switch', S[1].on);
t.tick({ ...H, mx: 0.25 }, {}); t.run(0.8, () => H); console.log('lantern front', t.st()); press(t, H); console.log('teal switch', S[0].on, 'gate', t.w.gates[0].open);
t.idle(1.2); t.go(0, 10.2, -4.6, 2); t.idle(0.5); console.log('down', t.st(), t.log);
console.log('cupboard', t.w.gates[1].open); t.go(1, 8, -2); t.go(1, 4.2, -4.8); t.go(1, 4.2, -6.8); console.log('cog', t.w.cogs[0].got, t.st()); t.go(1, 4.2, -4.8);
t.both(21, -2.5, 21, -5); console.log('P1', t.st(), t.log);
// 2. Out of Office: fan on, Bolt floats up, fan off (gate opens), Bolt pulls Nut up
t.go(1, 24.5, -5.8); press(t); console.log('fan on', S[2].on, 'gate2', t.w.gates[1].open);
t.go(0, 28.5, -4, 4); t.run(2.5, () => ({ mx: t.b.pos.y > 6.2 ? 1 : 0 })); t.idle(0.5); console.log('bolt up', t.st());
press(t); console.log('fan off', !S[2].on); t.idle(1); console.log('gate2 open', t.w.gates[1].open);
t.go(1, 27.5, -4); t.go(0, 30.5, -4); t.tick({ mx: -0.3 }, {}); t.pullNut(31.5, -4); console.log('P2', t.st(), t.log);
t.both(44, -3, 44, -5); t.idle(1.5);
console.log('stats', JSON.stringify(t.w.stats));
console.log(t.st(), 'complete', t.w.complete, 'cog', t.w.cogs[0].got, 'falls', JSON.stringify(t.w.stats.falls), 'zaps', JSON.stringify(t.w.stats.zaps), JSON.stringify(t.log));

const put = (u, p, x, y, z) => { p.pos = { x, y, z }; p.prev = { ...p.pos }; };
// shortcut checks
{ // Nut alone: jump and push beside the tall post; Nut jumping off Bolt's head beside it
  const u = new Bot(def); put(u, u.n, 13.5, 0.5, -4.6); u.idle(0.3); u.tick({}, { jump: true }); for (let i = 0; i < 12; i++) u.tick({}, { jump: true }); u.tick({}, { jump: true, power: true }); u.idle(1);
  const v = new Bot(def); put(v, v.b, 13.5, 0.6, -4.6); put(v, v.n, 13.5, 1.8, -4.6); v.idle(0.5); const on = v.n.ground === v.b; v.tick({}, { jump: true }); for (let i = 0; i < 12; i++) v.tick({}, { jump: true }); v.tick({}, { jump: true, power: true }); v.idle(1);
  console.log('nut reaches teal switch from floor / from head (should be false false)', u.w.switches[0].on, on && v.w.switches[0].on); }
{ // Bolt boosts off Nut's head toward the pillar
  const u = new Bot(def); put(u, u.n, 10, 0.5, -4.6); put(u, u.b, 10, 1.6, -4.6); u.idle(0.5); for (let i = 0; i < 70; i++) u.tick({ mx: 1, jump: i < 30 }, {}); u.idle(0.5); console.log('boost onto pillar (should be false)', u.b.pos.y > 3.5, u.st()); }
{ // Nut launches Bolt over the gate
  const u = new Bot(def); put(u, u.b, 17, 0.6, -4); put(u, u.n, 15.9, 0.5, -4); u.idle(0.3); u.tick({}, { power: true }); u.run(1.5, () => ({ mx: 1 })); u.idle(0.5); console.log('launch over gate (should be false)', u.b.pos.x > 19, u.st()); }
{ // both ride the fan up: the gate up top stays shut and the switch is out of reach
  const u = new Bot(def); put(u, u.b, 22, 0.6, -3); put(u, u.n, 24.5, 0.5, -5.8); u.idle(0.3); press(u); u.go(1, 28.5, -3, 4); u.go(0, 28.5, -5, 4);
  u.run(3, () => ({ mx: u.b.pos.y > 6.2 ? 1 : 0 }), () => ({ mx: u.n.pos.y > 6.2 ? 1 : 0 })); u.idle(0.5); u.go(1, 30.6, -6.5); press(u);
  u.go(0, 35, -4, 3); u.go(1, 35, -6, 3); console.log('both up, switch from ledge (should be on true, past false)', u.w.switches[2].on, u.b.pos.x > 37 || u.n.pos.x > 37, u.st()); }
{ // fan off: head launch at the ledge falls short
  const u = new Bot(def); put(u, u.n, 29.2, 0.5, -4); put(u, u.b, 29.2, 1.6, -4); u.idle(0.5); u.tick({}, { power: true }); u.run(1.4, () => ({ mx: 1 })); u.idle(0.5); console.log('head launch to ledge (should be false)', u.b.pos.y > Y, u.st()); }
{ // golden cog: Nut cannot reach the pink switch from the floor; Bolt cannot get into the cupboard
  const u = new Bot(def); put(u, u.n, 11.4, 0.5, -6.5); u.idle(0.3); u.tick({}, { jump: true }); for (let i = 0; i < 12; i++) u.tick({}, { jump: true }); u.tick({}, { jump: true, power: true }); u.idle(1);
  u.go(0, 4.2, -6.5, 3); u.go(1, 4.2, -6.5, 3); console.log('pink from floor / cog through the bars (should be false false)', u.w.switches[1].on, u.w.cogs[0].got); }
