// Overtime 24. Unlocks after Shift 5. Uses: launching, anchor rings, plates, a channel lift.
// The aha: the ring over the start is just out of magnet range from the floor, and from a boost. A launch carries Bolt
// into range on the way up, and he grapples the rest of the way to the top floor. Then he holds the lift plate for Nut.
// Back walls are 16 m tall so nobody launched at them can stand on one. There is no iron, so Nut cannot rocket.
const BW = (L, x0, x1, top, h = 16) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');
const Y = 13; // the top floor

export default {
  name: 'Glass Ceiling', sub: 'Overtime. You can see the top floor from here. That is as far as most people get.', theme: 3, after: 4,
  intro: ['Overtime! Tonight we are visiting the top floor. Most staff only ever look at it. It looks lovely.'],
  build(L) {
    L.start(2.5, -3, 2.5, -5.5);
    /* ---- 1. Glass Ceiling: the ring hangs right up under the top floor. From the floor it is just out of magnet range.
            From a boost it is still just out of range. Nut launches Bolt and he grabs it on the way up, then hops onto the top floor. */
    L.floor(0, -8, 18, 0, 0); L.floor(21, -8, 26, 0, 0);
    L.floor(18, -8, 21, -6, 0); L.floor(18, -2, 21, 0, 0); L.floor(18, -6, 21, -2, -0.6); // the shaft floor, under the lift
    BW(L, 0, 26, 0);
    L.anchor(9, Y + 1.4, -4);
    /* ---- 2. Lift Share: the lift goes up while the plate on the top floor is pressed. Bolt stands on it, Nut rides up. */
    L.box(10.2, -8, 18, 0, Y - 1, Y, 'floor'); L.box(21, -8, 40, 0, Y - 1, Y, 'floor');
    L.box(18, -8, 21, -6, Y - 1, Y, 'floor'); L.box(18, -2, 21, 0, Y - 1, Y, 'floor');
    BW(L, 26, 40, Y);
    L.mover(18, -6, 21, -2, 0, [[0, 0, 0], [0, Y, 0]], 3, [1]);
    L.plate(13.5, -6.3, 1, Y);
    L.exit(34, -6.5, 38.5, -1.5, Y);
    // golden cog: high over the top floor. A boost misses it. A launch does not.
    L.cog(29, Y + 3.9, -4);
    /* ---- checkpoints, zones, decoration */
    L.checkpoint(21.5, -8, 32, 0, 24, -3, 24, -5);
    L.zone('ceiling', 5, -8, 10, 0, -5, 8);
    L.zone('lift', 10.5, -8, 18, 0, Y - 1, 60);
    L.zone('end', 32, -8, 40, 0, Y - 1, 60);
    L.deco(3, -11, 4.5, -9.5, 0, 16, 'pipe'); L.deco(36, -11, 37.5, -9.5, Y, 22, 'pipe');
    L.sign(6, 2.2, -7.9, 'GLASS CEILING');
    L.sign(19.5, 2.2, -7.9, 'STAFF LIFT');
    L.sign(30, Y + 2.2, -7.9, 'EXECUTIVE FLOOR');
  },
  zones: {
    ceiling: { say: ['That ring is very nearly in magnet range. Very nearly is the most popular size in this building.', 'Bolt, you need to be a bit closer to the ceiling. Nut, you are very good at making Bolt closer to ceilings.'], hint: 'Bolt stands just short of the ring, facing it, with Nut a couple of steps behind him. Bolt holds X and Nut presses X. On the way up Bolt comes into range and grabs the ring. He hops off onto the top floor (press A, toward the floor).' },
    lift: { say: ['The staff lift only runs while someone stands on that plate. Staff tend to forget the plate. That is why Nut is still downstairs.'], hint: 'Bolt stands on the teal plate. Nut walks onto the lift and rides it up to the top floor.' },
    end: { say: ['The top floor. Nobody up here knows what happens downstairs. That is the main perk.'] },
  },
  outro: 'Overtime done. You broke through the glass ceiling. It was a ring. We will be getting a quote for real glass.',
};
