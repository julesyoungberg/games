// Overtime 11. Unlocks after Shift 19. Uses: pneumatic tubes, springs, wall magnets, lasers, pulling Nut.
const BW = (L, x0, x1, top, h = 3) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');

export default {
  name: 'Air Mail', sub: 'Overtime. First class, by bounce.', theme: 9, after: 18,
  intro: ['Overtime. Tonight the post goes by air. The tube posts you to the spring. The spring posts you upward. After that, the post office is less clear.'],
  build(L) {
    L.start(2.5, -3, 2.5, -5.5);
    /* ---- Air Mail: the tube posts you to a spring island between two laser fields. Bolt bounces to the magnet;
            Nut bounces too, and Bolt reels her in over the lasers at the very top of her bounce. */
    L.floor(0, -8, 12, 0, 0); BW(L, 0, 12, 0);
    L.tube(9, -6.5, 0, 18.3, -5, 0);
    L.laser(12, -9.5, 17.5, 0, -6, 4.5); BW(L, 12, 17.5, 0);
    L.floor(17.5, -8, 19.6, 0, 0); L.floor(19.6, -1, 23, 0, 0); L.floor(23, -8, 24, 0, 0); BW(L, 17.5, 24, 0, 7);
    L.spring(19.6, -8, 23, -1, 0, 18);
    L.cog(21.3, 8.3, -4.5);
    L.laser(24, -9.5, 29, 0, -6, 4.5); BW(L, 24, 29, 0);
    L.box(29, -8, 44, 0, -6, 5.5, 'floor'); BW(L, 29, 44, 5.5);
    L.magnet(29, 6.9, -7.5, [-1, 0]);
    L.exit(38.5, -6.5, 43, -1.5, 5.5);
    /* ---- checkpoints, zones, decoration */
    L.checkpoint(31, -8, 37.5, 0, 33, -3, 33, -5.5);
    L.zone('air', 4, -8, 12, 0);
    L.zone('island', 17.5, -8, 24, 0, -2, 3);
    L.zone('end', 31, -8, 44, 0, 4.5, 50);
    L.deco(3, -11, 4.5, -9.5, 0, 10, 'pipe'); L.deco(40, -11, 41.5, -9.5, 5.5, 15, 'pipe');
    L.sign(6, 1.6, -7.9, 'AIR MAIL');
    L.sign(20.5, 4.6, -7.9, 'SORTING');
  },
  zones: {
    air: { say: ['Air mail. The tube posts you to the island. Lasers on both sides. Do not post yourself into a laser. It voids the warranty.'], hint: 'Both of you take the tube to the island. The ledge is past another laser field, so you have to go over the top.' },
    island: { say: ['The spring gets you high. Not ledge high. Magnet high, if you are a Bolt. If you are a Nut, it gets you high enough to be collected.', 'Bolt, if you reel Nut in too early she goes through the lasers. Wait for the very top. Patience is a parcel.'], hint: 'Bolt bounces on the spring and grabs the wall magnet at the top of the bounce, then hops onto the ledge. Nut bounces on the front of the spring. Bolt faces her and pulls at the very top of her bounce, so she flies over the lasers.' },
    end: { say: ['Delivered. Signed for. Slightly bent. That is how you know it was air mail.'] },
  },
  outro: 'Overtime done. Your postage has been taken from your wages. It was one bounce. We charge per bounce.',
};
