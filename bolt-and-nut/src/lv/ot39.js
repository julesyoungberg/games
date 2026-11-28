// Overtime 39. Unlocks after Shift 32. Uses: factory clocks driving a lift, a laser, a gate, a bridge and a sliding ring.
// 1. The lift only rises while the green clock runs; the laser at the top lands only while it rests. Step off in time.
// 2. Airlock: the purple clock opens the gate while the bridge beyond it is away, then shuts it as the bridge comes back.
// 3. Last call: a ring glides over the last gap on the orange clock. Bolt rides it, then reels Nut over before it slides back.
const BW = (L, x0, x1, top, h = 10) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');
const Y = 5; // the upper floor

export default {
  name: 'Punch Clock', sub: 'Overtime. Clock in, clock out, keep up.', theme: 4, after: 31,
  intro: ['Overtime! Punch in. Tonight the lift, the airlock and the crane all run on the factory clock. The clock does not wait for anyone. I checked.'],
  build(L) {
    L.start(2.5, -3, 2.5, -5.5);
    L.floor(0, -8, 8, 0, 0); BW(L, 0, 12, 0);
    /* ---- 1. Lift on the green clock, laser at the top while it rests */
    L.clock(6.5, -7.3, 4, 3.0, 3.0, 0);
    L.mover(8.2, -6, 11.6, -2, 0, [[0, 0, 0], [0, Y, 0]], 2.6, [4]);
    L.floor(8, -8, 12, -6, 0); L.floor(8, -2, 12, 0, 0);
    L.floor(12, -8, 23, 0, Y); BW(L, 12, 46, Y);
    L.laser(12.2, -8, 12.5, 0, Y, Y + 4, [4]);
    /* ---- 2. Airlock on the purple clock */
    L.clock(17, -7.3, 5, 2.2, 2.0, 0, Y);
    L.gate(22.5, -8, 23, 0, Y, Y + 4, [5], { invert: true });
    L.floor(23, -8, 24.4, 0, Y); // the airlock: just room for two
    L.bridge(24.4, -8, 29, 0, Y, [5]);
    L.floor(29, -8, 35, 0, Y);
    /* ---- 3. Last call: the ring glides over the last gap while the orange clock runs */
    L.clock(33, -7.3, 2, 2.4, 2.2, 0, Y);
    L.anchor(35.5, Y + 3.2, -4, { path: [[0, 0, 0], [5, 0, 0]], speed: 2.6, chs: [2] });
    L.floor(41, -8, 46, 0, Y);
    L.exit(42, -6.5, 45.5, -1.5, Y);
    // golden cog: high by the back wall past the airlock. Nut launches Bolt up to it.
    L.cog(31.5, Y + 4.3, -7.2);
    L.checkpoint(13, -8, 22, 0, 15, -3, 15, -5.5);
    L.checkpoint(29.5, -8, 34.5, 0, 31, -3, 31, -5.5);
    L.zone('lift', 3, -8, 8, 0);
    L.zone('airlock', 18, -8, 22, 0, Y - 1, 50);
    L.zone('ring', 30, -8, 35, 0, Y - 1, 50);
    L.zone('end', 41.5, -8, 46, 0, Y - 1, 50);
    L.sign(4, 2.4, -7.9, 'PUNCH IN');
    L.sign(40, Y + 2.4, -7.9, 'PUNCH OUT');
  },
  zones: {
    lift: { say: ['The lift goes up while the green clock runs and comes down when it stops. The laser at the top only lands while the clock rests. Do not be on the lift when it rests.'], hint: 'Get on the lift as the green bulb lights. At the top, step off straight away and get past the laser before the clock stops.' },
    airlock: { say: ['An airlock. The gate opens while the purple clock rests, and the bridge only comes while it runs. In, wait, out.'], hint: 'Go through the gate while it is open and wait on the little floor behind it. When the purple bulb lights, the gate shuts and the bridge appears. Cross.' },
    ring: { say: ['The crane ring glides over the last gap while the orange clock runs, and slides back when it stops. Bolt, catch a ride. Then Nut.'], hint: 'Bolt grabs the ring as the orange bulb lights, rides it over, jumps off onto the far floor, then turns and holds X to reel Nut across.' },
  },
  outro: 'Punched out. The clock has recorded your hours. The clock records everything. Do not think about the clock.',
};
