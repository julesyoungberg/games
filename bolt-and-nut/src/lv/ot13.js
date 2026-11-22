// Overtime 13. Unlocks after Shift 22. Uses: moving anchor rings, timed lasers, launching (including off a ring), pulling Nut.
// Back walls are 8 to 14 m tall so nobody dropping off a ring can land on one and walk along the top to the shelf.
const BW = (L, x0, x1, top, h = 8) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');
const Y = 6; // the shelf

export default {
  name: 'Rush Hour', sub: 'Overtime. Mind the gap. Mind the lasers. Mind each other.', theme: 3, after: 21,
  intro: ['Overtime. The overhead rail runs a reduced service tonight. Two rings. No timetable. The lasers have a timetable. Nobody else has seen it.'],
  build(L) {
    L.start(2.5, -3, 2.5, -5.5);
    /* ---- 1. Peak Service: the sky ring is out of reach. Nut launches Bolt into it as it passes. Bolt rides over the pit,
            then reels Nut across while the curtain on the far side blinks off. */
    L.floor(0, -8, 9, 0, 0); BW(L, 0, 9, 0);
    L.anchor(7.5, 14.2, -4, { path: [[0, 0, 0], [12, 0, 0]], speed: 2.4 });
    L.laser(17.6, -8, 17.9, 0, -6, 8, null, [1.2, 1.5, 0]);
    BW(L, 9, 18.5, 0, 10);
    L.floor(18.5, -8, 27, 0, 0); BW(L, 18.5, 27, 0);
    /* ---- 2. Express Transfer: the low ring passes the island. Bolt rides it, Nut waits on the island,
            and launches Bolt off the ring as he goes by. The ring gives the height. Nut gives the rest.
            Up top, Bolt's plate turns the island into a lift for Nut. */
    L.anchor(25.5, 4, -4, { path: [[0, 0, 0], [12.5, 0, 0]], speed: 2.2 });
    L.mover(32.5, -6.5, 35.5, -1.5, 0, [[0, 0, 0], [0, Y, 0], [3.5, Y, 0]], 3, [1]);
    BW(L, 27, 39, 0, 14);
    L.cog(34, 6.8, -4);
    L.box(39, -8, 52, 0, -6, Y, 'floor');
    L.plate(42, -6.6, 1, Y); BW(L, 39, 52, Y, 8);
    L.exit(46, -6.5, 51, -1.5, Y);
    /* ---- checkpoints, zones, decoration */
    L.checkpoint(19, -8, 26.5, 0, 22, -3, 22, -5.5);
    L.checkpoint(39.5, -8, 45, 0, 41, -3, 41, -5.5);
    L.zone('peak', 4, -8, 9, 0);
    L.zone('transfer', 22, -8, 27, 0);
    L.zone('end', 39.5, -8, 52, 0, Y - 1, 50);
    L.deco(3, -11, 4.5, -9.5, 0, 14, 'pipe'); L.deco(48, -11, 49.5, -9.5, Y, 20, 'pipe');
    L.sign(5, 2.2, -7.9, 'PEAK SERVICE');
    L.sign(24, 2.2, -7.9, 'EXPRESS TRANSFER');
  },
  zones: {
    peak: { say: ['The sky ring runs over the gap. It is too high for anyone to reach. Anyone who has not been launched, that is.', 'The curtain on the far side blinks. Bolt goes over it. Nut goes through it. Timing is a courtesy.'], hint: 'Wait for the ring to come to this end. Bolt stands under it with Nut right behind him, and Nut presses X. Bolt holds X near the top to grab the ring. Let go over the far floor. Then Bolt faces Nut and pulls her across just after the curtain blinks off.' },
    transfer: { say: ['The shelf is too high to jump to. Even from the ring. Even with feeling.', 'There is a little island halfway. Nut, you could wait there. Like a commuter. Bolt, you could pass by. Like a train. Nut, you could then shove the train.'], hint: 'Bolt rides the low ring to the island, drops off, and pulls Nut over. Nut waits at the right end of the island. Bolt grabs the ring again as it passes, and when he swings by right next to Nut, Nut presses X. Bolt flies up onto the shelf and stands on the teal plate. The island turns into a lift and brings Nut up.' },
    end: { say: ['You have arrived. The service was late, overcrowded and partly airborne. That is a normal service.'] },
  },
  outro: 'Overtime done. Your travel has been expensed. To you. Please pay Accounts by Friday.',
};
