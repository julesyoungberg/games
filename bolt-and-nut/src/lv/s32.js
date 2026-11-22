// Shift 32 (played as Shift 30): Staff Reunion. A rehearsal for the finale: four rooms from the first week of the season, each with one new twist.
// Pull Nut across a gap, through a blinking laser curtain. Launch Bolt to a ring that is too far to reach from the edge.
// Rocket Nut onto a shelf, then launch Bolt off the top of his spring bounce. Carry a crate onto a plate, after a wall magnet gets Bolt across.
// Thin laser nets hang over the floors (a little above the top of a launch) so nobody climbs by standing on the other robot.
const BW = (L, x0, x1, top, h = 14) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');
const NET = (L, x0, z0, x1, z1, y) => L.laser(x0, z0, x1, z1, y, y + 0.4);
const G = 8.8; // top of the gantry in the springs room

export default {
  name: 'Staff Reunion', sub: 'Shift 30. Old rooms, new tricks. A rehearsal for the big night.', theme: 1,
  intro: [
    'Shift thirty. Staff Reunion. Before the big night at the end of the season, we are having a rehearsal in the rooms where you started.',
    'Facilities have rebuilt each one with a little something extra. They called it a twist. I called it a health and safety form. We are both right.',
  ],
  build(L) {
    L.start(2.5, -2, 2.5, -4.5);
    BW(L, 0, 72, 0); BW(L, 72, 100, 0, 16);
    /* ---- 1. Class of Shift 2: Nut holds the plate so Bolt can walk the bridge. Then he reels her across the gap,
            through the laser curtain while it is off */
    L.floor(0, -8, 8, 0, 0);
    L.plate(6.6, -6.6, 1, 0);
    L.bridge(8, -5, 16.5, -3, 0, [1]);
    L.laser(12, -9.5, 12.4, 1.5, -14, 200, null, [1.6, 1.2, 0]);
    L.floor(16.5, -8, 24, 0, 0);
    /* ---- 2. Class of Shift 3: the ring is too far out to grab from the edge. Nut launches Bolt, and he grabs it on the way down.
            From the far side he stands on the plate, which brings out the bridge for Nut */
    L.floor(24, -8, 30, 0, 0); NET(L, 24, -9.5, 33, 1.5, 5.6);
    L.anchor(44.5, 5, -4);
    L.bridge(30, -5, 46.5, -3, 0, [2]);
    L.floor(46.5, -8, 50, 0, 0);
    L.plate(48, -1.8, 2, 0);
    /* ---- 3. Class of Shift 4: Nut rockets off the iron onto the shelf. Bolt bounces on the spring next to it,
            and she launches him off the top of his bounce onto the gantry. His plate up there opens the gate */
    L.floor(50, -5.5, 72, 0, 0); L.floor(50, -8, 50.5, -5.5, 0);
    L.iron(50.5, -8, 53, -5.5, 0);
    L.box(53, -8, 57, -5.5, -6, 3.5, 'shelf');
    L.spring(57, -8, 59.5, -5.5, 0, 18);
    L.box(59.5, -8, 72, -5.5, -6, G, 'shelf');
    L.plate(61.5, -6.8, 3, G);
    L.gate(66, -5.5, 67, 0, 0, 14, [3]);
    L.laser(66, -9.5, 67, 1.5, 14, 200);
    NET(L, 50, -5.5, 66, 1.5, 5.6); NET(L, 50, -9.5, 53, -5.5, 5.6); NET(L, 53, -9.5, 57, -5.5, 9.1); NET(L, 57, -9.5, 59.5, -5.5, 10.6); NET(L, 59.5, -9.5, 72, -5.5, G + 5.6);
    /* ---- 4. Class of Shift 5: the wall magnet is too high to reach from the floor. Nut launches Bolt and he grabs it from the top.
            On the far side he reels the crate over, carries it onto the plate, and the bridge and the gate open for good */
    L.floor(72, -8, 78, 0, 0); NET(L, 72, -9.5, 78.6, 1.5, 5.6);
    L.crate(77, -3.5, 0);
    L.magnet(84, 13.5, -8, [0, 1]);
    L.bridge(78, -5, 87.5, -3, 0, [4]);
    L.floor(87.5, -8, 98, 0, 0);
    L.plate(90.5, -6.6, 4, 0);
    L.gate(92.5, -8, 93, 0, 0, 14, [4]);
    L.laser(92.5, -9.5, 93, 1.5, 14, 200);
    /* golden cog: a second magnet over the far floor. From the first magnet, let go and grab it in mid air */
    L.magnet(91, 13.5, -8, [0, 1]);
    L.cog(91, 13, -7.45);
    L.exit(94, -6.5, 97.5, -1.5, 0);
    /* ---- checkpoints, zones, decoration */
    L.checkpoint(19.5, -8, 24, 0, 21, -2.5, 21, -5);
    L.checkpoint(46.5, -8, 50, 0, 47.5, -4, 47.5, -6);
    L.checkpoint(68, -5.5, 72, 0, 69, -2, 69, -4);
    L.checkpoint(93.5, -8, 98, 0, 95, -3, 95, -5.5);
    L.zone('gap', 0, -8, 8, 0);
    L.zone('ring', 24, -8, 30, 0);
    L.zone('springs', 50, -8, 57, 0, -1, 8);
    L.zone('magnet', 72, -8, 78, 0);
    L.zone('cog', 87.5, -8, 92.5, 0);
    L.zone('end', 93.5, -8, 98, 0);
    L.deco(10, -11, 11.5, -9.5, 0, 16, 'pipe'); L.deco(37, -11, 38.5, -9.5, 0, 16, 'pipe'); L.deco(63, -11, 64.5, -9.5, 0, 16, 'pipe'); L.deco(80, -11, 81.5, -9.5, 0, 16, 'pipe'); L.deco(96, -11, 97.5, -9.5, 0, 16, 'pipe');
    L.sign(3, 2.4, -7.9, 'CLASS OF SHIFT 2');
    L.sign(27, 2.4, -7.9, 'CLASS OF SHIFT 3');
    L.sign(51.5, 2.4, -7.9, 'CLASS OF SHIFT 4');
    L.sign(75, 2.4, -7.9, 'CLASS OF SHIFT 5');
    L.sign(95.5, 2.4, -7.9, 'STAFF REUNION');
  },
  zones: {
    gap: { say: ['The room from Shift two. You will remember it. Nut stands on the plate, the bridge comes out, Bolt walks across and reels Nut over. Lovely.', 'The new bit is the laser curtain over the gap. It blinks. Please reel during the off part. The on part is less popular.'], hint: 'Nut stands on the plate and Bolt walks the bridge while the curtain is off. On the far side, Bolt faces Nut and waits for the curtain to switch off, then holds X straight away. She flies through before it comes back on. If she gets zapped, she starts again by the plate.' },
    ring: { say: ['The room from Shift three. A ring, a gap and a launch. The ring has been moved further out since then. It wanted more space.', 'It is too far to grab from the edge. It is not too far to grab from the top of a launch. Then a plate on the far side brings out the bridge for whoever is left.'], hint: 'Bolt stands at the edge of the gap and Nut stands behind him and presses X. While he is in the air, Bolt holds X toward the ring. He hangs there. He jumps off toward the far floor and stands on the plate. The bridge comes out and Nut walks across.' },
    springs: { say: ['The room from Shift four. Nut, the iron patch still works. The shelf is where you left it. The gantry is new. It is very high and it has a plate on it.', 'Bolt, the spring takes you about halfway up. Nut, on the shelf, is about halfway up. Halfway plus halfway is the whole way. I checked.'], hint: 'Nut stands on the iron patch, presses X to rocket up and steers onto the shelf. Bolt bounces on the spring beside the shelf. Nut stands at the edge of the shelf and presses X when Bolt is at the top of a bounce. He flies onto the gantry. He stands on the plate up there and the gate opens. Nut walks through, then Bolt walks along the gantry and hops down past the gate.' },
    magnet: { say: ['The room from Shift five. The crate goes on the plate. You know this one. The plate is on the far side now. So is the magnet. The magnet is quite high.', 'From the floor, that magnet is out of reach. From the top of a launch, it is not. Bolt cannot hold the crate and the magnet at the same time. He has tried. It was a long afternoon. Leave the crate by the edge.'], hint: 'Nut launches Bolt from the edge and he holds X toward the magnet on the back wall. He jumps off onto the far floor, faces the crate and holds X to reel it over, then carries it onto the plate. The bridge comes out for Nut and the gate opens.' },
    cog: { say: ['There is a golden cog by the second magnet. From the first magnet, let go and grab the second one in mid air. Bolt, this is the bit you practise.'], hint: 'Optional golden cog. While Bolt hangs on the first magnet, he jumps toward the second magnet and holds X again while he is in the air.' },
    end: { say: ['That is the rehearsal done. You have not changed a bit. Well. You have changed quite a lot of bits. But in a good way.'] },
  },
  outro: 'Shift thirty complete. The rehearsal went well. Nobody fell off anything they were not supposed to. Next time, it is for real.',
};
