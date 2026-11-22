// Overtime 23. Unlocks after Shift 29. Uses: a moving anchor ring, standing on heads, an iron crate thrown in mid-air, plates,
// a latching gate, lasers, launching, pulling Nut.
// The aha: Nut can throw a crate from anywhere, even from Bolt's head while he rides the ring. The present is in a sack on a
// pillar that nobody can reach on foot, and the chimney is lasered, so it can only be delivered from the sleigh.
// Back walls are 9 m tall so nobody launched on the roof can stand on one and walk round the gate.
const BW = (L, x0, x1, top, h = 9) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');
const S = 3; // the sack: the crate sits in a rimmed box on a pillar
const P = 2; // the chimney: a plate on a lasered roof
const Y = 4; // the far roof

export default {
  name: 'Sleigh Ride', sub: 'Overtime. One sleigh, one elf, one present. The budget was cut.', theme: 5, after: 28,
  intro: ['Overtime! One present was missed in the Christmas post. Head Office has authorised a sleigh. The sleigh is Bolt. Nobody told Bolt.'],
  build(L) {
    L.start(2.5, -3, 2.5, -5.5);
    /* ---- Sleigh Ride: the ring hangs low over the yard, then climbs over the roofs. Nut boards Bolt while he hangs low, like the
            commuter line. The present is in a rimmed sack on a pillar: the rim snags it if Bolt reels it from the yard, and nobody can
            stand near it. Riding past, Nut throws it out of the sack, and it lands on the chimney plate on the lasered roof.
            The gate on the far roof latches open. A miss falls in the pit and the present goes back in its sack for another go. */
    L.floor(0, -8, 10, 0, 0); BW(L, 0, 10, 0);
    L.anchor(5, 1.6, -4, { path: [[0, 0, 0], [5, 0, 0], [10, 4.55, 0], [25.6, 4.55, 0]], speed: 2.2 });
    L.box(16.2, -4.8, 17.8, -3.2, -14, S, 'shelf');
    L.box(16.2, -4.8, 16.35, -3.2, S, S + 1.3, 'wall'); L.box(17.65, -4.8, 17.8, -3.2, S, S + 1.3, 'wall');
    L.box(16.35, -4.8, 17.65, -4.65, S, S + 1.3, 'wall'); L.box(16.35, -3.35, 17.65, -3.2, S, S + 1.3, 'wall');
    L.crate(17, -4, S);
    L.box(20.8, -6, 24.4, -2, -14, P, 'shelf');
    L.box(20.8, -6, 24.4, -5.8, P, P + 0.3, 'wall'); L.box(20.8, -2.2, 24.4, -2, P, P + 0.3, 'wall');
    L.box(20.8, -5.8, 21, -2.2, P, P + 0.3, 'wall'); L.box(24.2, -5.8, 24.4, -2.2, P, P + 0.3, 'wall');
    L.plate(22.6, -4, 1, P, 1.5);
    L.laser(20.8, -6, 24.4, -2, P + 0.1, P + 2.2);
    BW(L, 10, 29, 0);
    L.box(29, -8, 46, 0, -14, Y, 'floor'); BW(L, 29, 46, Y);
    L.gate(35, -8, 36, 0, Y, Y + 10, [1], { latch: true });
    L.exit(40, -6.5, 45, -1.5, Y);
    // golden cog: the star on top of the tree on the far roof. Nut launches Bolt up to it.
    L.cog(32, Y + 5.2, -6.6);
    /* ---- checkpoints, zones, decoration */
    L.checkpoint(29.5, -8, 34.5, 0, 31, -2.5, 31, -5);
    L.zone('sleigh', 4, -8, 10, 0);
    L.zone('roof', 30, -8, 46, 0, Y - 1, 50);
    L.deco(2, -11, 3.5, -9.5, 0, 14, 'pipe');
    L.deco(31.5, -7.6, 32.5, -6.6, Y, Y + 3.2, 'pipe');
    L.sign(7, 2.2, -7.9, 'SLEIGH');
    L.sign(42, Y + 2.2, -7.9, 'DELIVERED');
  },
  zones: {
    sleigh: { say: ['One present left. It is in the sack on that pillar. It goes down the chimney on the house with the lasered roof. Do not stand on the roof. It is very festive and very hot.', 'Tonight Bolt is the sleigh. Nut is the elf. The elf rides on top. Elves can throw things. That is most of the job.'], hint: 'Bolt grabs the ring while it hangs low over the yard. Nut jumps onto his head. As the ring climbs past the sack, Nut presses X just before she is over it: the present flies out and lands on the chimney plate. The gate on the far roof opens for good. Ride on, hop off at the end. A miss goes back in the sack: ride back and try again.' },
    roof: { say: ['Delivered. Signed for by nobody. It is a chimney. Chimneys do not sign.'] },
  },
  outro: 'Overtime done. Every present delivered. The elf would like it noted that the sleigh complained the whole way.',
};
