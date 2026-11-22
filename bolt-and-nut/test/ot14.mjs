import { Bot } from './bot.mjs';
import def from '../src/lv/ot14.js';
const t = new Bot(def); const c = t.w.crates[0];
t.idle(1); console.log('crate rests', t.pos(c));
// 1. Parcel Lift: Bolt hops onto the kerb, then onto the crate
t.go(0, 5, -6.4, 8, 0.15); t.idle(0.2);
for (let i = 0; i < 80; i++) t.tick({ mx: t.b.pos.x < 6.6 ? 0.8 : 0, jump: i < 20 }, {}); t.idle(0.4);
console.log('bolt on crate', t.b.ground === c, t.st(), t.log);
t.go(1, 1.8, -1.6, 8, 0.2); t.tick({}, { power: true }); t.idle(0.1); console.log('switch', t.w.channels[1]);
let j = false; for (let i = 0; i < 600 && !(t.b.grounded && t.b.pos.y > 7); i++) { if (!j && c.pos.y > 3 && c.vel.y < 3 && c.vel.y > 0) j = true; t.tick(j ? { jump: true, mx: 1 } : {}, {}); }
t.idle(0.3); console.log('bolt on shelf', t.st(), t.log);
// Bolt pulls Nut up from the end of the walkway
t.go(1, 12.4, -2, 8, 0.2); t.go(0, 18.8, -2, 4, 0.15); t.pullNut(20.5, -2); console.log('nut up', t.st(), t.log);
t.both(21, -2.5, 21, -4.5); console.log('P1', t.st(), t.log);
// 2. Crane Hire: Bolt pulls the crate up off the spring and sets it down
t.go(1, 22, -2.5); t.go(0, 19.2, -6.4, 4, 0.15); t.tick({ mx: -0.3 }, {});
t.run(1.6, () => ({ power: true })); console.log('crate grabbed', !!c.pulledBy, t.pos(c));
t.goHold(24.5, -6.4); t.tick({ power: true, mx: 0.3 }, {}); t.run(0.5, () => ({ power: true })); t.idle(0.8); console.log('crate down', t.pos(c), t.st());
t.go(0, c.pos.x - 1.6, c.pos.z, 4, 0.1);
// Nut climbs aboard
t.go(1, c.pos.x, c.pos.z + 1.9, 6, 0.15); t.idle(0.2);
for (let i = 0; i < 80; i++) { const air = !t.n.grounded; t.tick({}, { ...t.steer(t.n, c.pos.x, c.pos.z), jump: i < 20 }); if (t.n.ground === c && i > 25) break; }
t.idle(0.3); console.log('nut on crate', t.n.ground === c, t.st());
// Bolt lifts the crate and walks it through the slot
t.tick({ mx: 0.3 }, {}); t.run(0.8, () => ({ power: true })); console.log('lifted', t.pos(c), t.pos(t.n), t.n.ground === c);
t.goHold(29.45, c.pos.z); t.run(0.5, () => ({ power: true })); console.log('at fence', t.pos(c), t.st(), t.log);
t.idle(0.6); console.log('dropped', t.st(), t.log);
t.go(1, 34.8, -5.5, 4, 0.3); t.tick({}, { power: true }); t.idle(0.4); console.log('switch2', t.w.channels[2], t.w.lasers[1].on);
t.both(35, -2.5, 35, -4.5); console.log('P2', t.st(), t.log);
t.both(40.5, -3, 40.5, -5); t.idle(1.5);
console.log('stats', JSON.stringify(t.w.stats));
console.log(t.st(), 'complete', t.w.complete, t.log);
const put = (u, p, x, y, z) => { p.pos = { x, y, z }; p.prev = { ...p.pos }; };
// checks
{ const u = new Bot(def); const cr = u.w.crates[0]; u.idle(0.5); u.go(1, 1.8, -1.6, 8, 0.2); u.tick({}, { power: true }); u.go(1, 5, -6.4, 4, 0.15);
  for (let i = 0; i < 90; i++) u.tick({}, { mx: u.n.pos.x < cr.pos.x ? 1 : 0, jump: i < 20 }); u.idle(1); console.log('nut flips then chases the crate (should be false)', u.n.ground === cr, u.pos(u.n), u.log); }
{ const u = new Bot(def); const cr = u.w.crates[0]; u.idle(0.5); put(u, u.b, 6.7, 1.9, -6.4); u.idle(0.3); u.w.switches[0].on = true; let my = 0; for (let i = 0; i < 480; i++) { u.tick({}, {}); my = Math.max(my, u.b.pos.y - 0.55); } console.log('ride without jumping (should be false)', u.b.pos.y > 7, 'apex feet', my.toFixed(2), u.log); }
{ const u = new Bot(def); put(u, u.b, 12.2, 0.6, -4.1); put(u, u.n, 12.2, 0.5, -2.9); u.idle(0.3); u.tick({}, { power: true }); u.run(2, () => u.steer(u.b, 17, -6.4)); console.log('launch from walkway over the wall (should be false)', u.b.pos.y > 6, u.pos(u.b), u.log); }
{ const u = new Bot(def); put(u, u.b, 12.6, 0.6, -2); put(u, u.n, 11.4, 0.5, -2); u.idle(0.3); u.tick({}, { power: true }); u.run(2, () => ({ mx: 1 })); console.log('launch from walkway to shelf (should be false)', u.b.pos.y > 6, u.log); }
{ const u = new Bot(def); put(u, u.b, 6.7, 1.9, -6.4); put(u, u.n, 5, 0.5, -6.4); u.idle(0.3); u.w.switches[0].on = true; u.tick({}, { power: true }); u.run(2, () => ({ mx: 1 })); console.log('nut launches bolt off the crate on the belt (should be false)', u.b.pos.y > 6, u.log); }
// P2 checks (crate placed on the shelf)
const onShelf = () => { const u = new Bot(def); const cr = u.w.crates[0]; put(u, cr, 27, Y + 0.6, -6.4); put(u, u.b, 22, Y + 0.6, -2); put(u, u.n, 22, Y + 0.5, -4); u.idle(0.5); return u; };
const Y = 6.8;
{ const u = onShelf(); put(u, u.n, 27, Y + 1.7, -6.4); u.idle(0.4); u.run(1.5, () => ({}), () => ({ mx: 1, jump: true })); console.log('nut jumps off the resting crate through the slot (should zap)', u.log); }
{ const u = onShelf(); put(u, u.n, 28.5, Y + 0.5, -4); u.idle(0.3); u.run(1.5, () => ({}), () => ({ mx: 1, jump: true })); console.log('nut jumps the slot (should zap)', u.log); }
{ const u = onShelf(); put(u, u.b, 29.3, Y + 0.6, -4); put(u, u.n, 28.1, Y + 0.5, -4); u.idle(0.3); u.tick({}, { power: true }); u.run(2, () => ({ mx: 1 })); console.log('launch bolt at the fence (should zap)', u.log); }
{ const u = onShelf(); put(u, u.b, 28.4, Y + 0.6, -4); put(u, u.n, 27.2, Y + 0.5, -4); u.idle(0.3); u.tick({}, { power: true }); u.run(2, () => ({ mx: 1 })); console.log('launch bolt from further back (should zap)', u.log); }
{ const u = onShelf(); put(u, u.b, 27.2, Y + 1.9, -6.4); put(u, u.n, 26, Y + 0.5, -6.4); u.idle(0.3); u.tick({}, { power: true }); u.run(2, () => ({ mx: 1 })); console.log('launch bolt off the crate (should zap)', u.log); }
{ const u = onShelf(); put(u, u.b, 33, Y + 0.6, -4); put(u, u.n, 28, Y + 0.5, -4); u.idle(0.3); u.tick({ mx: -0.3 }, {}); u.run(2, () => ({ power: true })); console.log('pull nut through the slot (should zap)', u.log); }
{ const u = onShelf(); put(u, u.n, 29.5, Y + 0.5, -7.2); u.idle(0.3); u.tick({}, { power: true }); u.idle(0.3); console.log('flip switch from the near side (should be false)', !!u.w.channels[2]); }
// golden cog: Bolt stands on the crate and Nut launches him
{ const u = onShelf(); const cr = u.w.crates[0]; put(u, cr, 22.5, Y + 0.6, -6.8); u.idle(0.3); put(u, u.b, 22.5, Y + 1.8, -6.8); put(u, u.n, 22.5, Y + 0.5, -5.2); u.idle(0.4); const on = u.b.ground === cr; u.tick({}, { power: true }); u.run(1.5, () => u.steer(u.b, 22.5, -6.8)); console.log('cog', u.w.cogs[0].got, 'from crate', on, u.log); }
{ const u = onShelf(); put(u, u.b, 22.5, Y + 0.6, -6.8); put(u, u.n, 22.5, Y + 0.5, -5.4); u.idle(0.4); u.tick({}, { power: true }); u.run(1.5, () => u.steer(u.b, 22.5, -6.8)); console.log('cog by plain launch (should be false)', u.w.cogs[0].got); }
{ const u = onShelf(); const cr = u.w.crates[0]; put(u, cr, 22.5, Y + 0.6, -6.8); u.idle(0.3); put(u, u.b, 22.5, Y + 1.8, -6.8); u.idle(0.3); u.run(1, () => ({ jump: true })); console.log('cog by jumping off the crate (should be false)', u.w.cogs[0].got); }
// recovery: the crate bounces on the spring with nobody aboard; Bolt pulls it back over the wall from the walkway
{ const u = new Bot(def); const cr = u.w.crates[0]; u.w.switches[0].on = true; u.idle(4); put(u, u.b, 12.4, 0.6, -4.1); u.idle(0.3);
  u.waitFor(v => cr.pos.y > 4 && cr.vel.y < 2, 4); u.tick({ mx: 1, mz: -0.3 }, {}); u.run(1.5, () => ({ power: true })); const got = !!cr.pulledBy;
  u.goHold(5.2, -5.5); u.tick({ power: true, mx: 0.3 }, {}); u.run(0.5, () => ({ power: true })); u.idle(1); console.log('crate recovered from the walkway', got, u.pos(cr)); }
// lost crate in Crane Hire: it respawns on the belt; the spare teal switch on the shelf sends it back to the spring
{ const u = onShelf(); const cr = u.w.crates[0]; put(u, cr, 30, -20, -2); u.idle(0.5); console.log('crate home', u.pos(cr)); u.go(1, 20.5, -5.6, 4, 0.3); u.tick({}, { power: true }); u.idle(4); console.log('crate back on the spring', cr.pos.x > 16, u.pos(cr)); }
