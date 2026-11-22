// Overtime 9. Unlocks after Shift 17. Uses: oil floors, crates sliding on oil, lasers, switches, pulling Nut.
const BW = (L, x0, x1, top, h = 3) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');

export default {
  name: 'Staff Limbo', sub: 'Overtime. How low can you go? About one crate.', theme: 2, after: 16,
  intro: ['Overtime. It is staff limbo night. The bar is a laser. The dance floor is oil. Health and Safety are watching from the car park.'],
  build(L) {
    L.start(2.5, -3, 2.5, -5.5);
    /* ---- 1. Limbo: a laser slot exactly one crate up and one Nut tall. Nut rides the crate, Bolt gives it a shove. */
    L.floor(0, -8, 10, 0, 0); BW(L, 0, 10, 0);
    L.oil(10, -8, 23, 0, 0); BW(L, 10, 23, 0);
    L.crate(10.8, -5, 0);
    L.laser(15, -9.5, 19.5, 0, -6, 1.15, [1]);
    L.laser(15, -9.5, 19.5, 0, 2.2, 10, [1]);
    L.button(22.4, -7.3, 1, 0);
    L.cog(11.2, 4.5, -2.2);
    /* ---- 2. Return Ticket: this slot fits Bolt. Nobody fits the pit. Nut shoves, Bolt surfs, then reels Nut over the pit. */
    L.floor(23, -8, 31, 0, 0); BW(L, 23, 52, 0);
    L.oil(31, -8, 41, -4.7, 0);
    L.box(31, -4.7, 41, -4.3, -6, 10, 'wall');
    L.oil(41, -8, 44, -4.3, 0);
    L.floor(44, -8, 52, -4.3, 0); L.floor(41, -4.3, 52, 0, 0);
    L.crate(32, -6.4, 0);
    L.laser(35.5, -9.5, 40, -4.7, -6, 1.15);
    L.laser(35.5, -9.5, 40, -4.7, 2.4, 10);
    L.exit(47, -6.5, 51, -1.5, 0);
    /* ---- checkpoints, zones, decoration */
    L.checkpoint(23.5, -8, 29, 0, 25, -2.5, 25, -5);
    L.checkpoint(41.5, -4.3, 46, 0, 43, -1.5, 43, -3.3);
    L.zone('limbo', 5, -8, 10, 0);
    L.zone('ticket', 24.5, -8, 30, 0);
    L.zone('end', 44, -8, 52, 0);
    L.deco(2, -11, 3.5, -9.5, 0, 9, 'pipe'); L.deco(48, -11, 49.5, -9.5, 0, 9, 'pipe');
    L.sign(7, 1.6, -7.9, 'LIMBO NIGHT');
    L.sign(27, 1.6, -7.9, 'RETURNS DESK');
  },
  zones: {
    limbo: { say: ['The limbo bar is a laser. The floor under it is also a laser. The gap in between is exactly one crate up and one Nut tall.', 'Bolt, you are slightly too tall. This is not a criticism. It is a measurement.'], hint: 'Nut jumps onto the iron crate and stays still. Bolt runs into the crate from behind: it slides along the oil and carries Nut through the gap. Nut flips the teal switch on the far side and the lasers switch off.' },
    ticket: { say: ['Round two. This gap is taller. Bolt fits. The pit next to it fits nobody.', 'There is no switch on the other side. Whoever goes through had better have a magnet.'], hint: 'Bolt jumps onto the crate. Nut runs into it from behind and stops before the laser. Bolt rides through, hops off, walks to the edge of the pit and pulls Nut over it.' },
    end: { say: ['That is the end of limbo night. Nut won. Bolt took part. Both of those count.'] },
  },
  outro: 'Overtime done. The oil stays where it is. It has a contract now.',
};
