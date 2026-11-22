// Overtime 21. Unlocks after Shift 24. Uses: an iron crate, standing on heads, launching, pulling Nut.
// The aha: a stack. Crate at the bottom, Nut in the middle, Bolt on top. One push from Nut sends the top of the stack higher than
// any single trick can (launch from the floor 3.9 m, off the crate 5.1 m, off Nut's head 4.8 m, the stack 6 m).
// Back walls are 10 m tall so nobody launched off the stack can stand on one.
const BW = (L, x0, x1, top, h = 10) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');
const Y = 5.5; // the boardroom floor

export default {
  name: 'Org Chart', sub: 'Overtime. Everybody stands on somebody. Tonight Bolt is at the top.', theme: 8, after: 23,
  intro: ['Overtime! The boardroom is up there. The boardroom is always up there. Tonight you are visiting it without an appointment.'],
  build(L) {
    L.start(2.5, -3, 2.5, -5.5);
    /* ---- Org Chart: the boardroom wall is 5.5 m. A launch from the floor gets Bolt 3.9 m, off the crate 5.1 m, off Nut's head 4.8 m.
            Stacked, crate then Nut then Bolt, one push from Nut gets him 6 m. Bolt climbs onto Nut first, Nut hops onto the crate
            carrying him, and pushes. Then Bolt reels Nut up. */
    L.floor(0, -8, 20, 0, 0); BW(L, 0, 20, 0);
    L.crate(17.4, -4.5, 0);
    L.box(20, -8, 40, 0, -6, Y, 'floor'); BW(L, 20, 40, Y);
    L.exit(33.5, -6.5, 38.5, -1.5, Y);
    // golden cog: high over the lobby, well away from the boardroom edge. Only the full stack reaches it.
    L.cog(6, 7.0, -4.5);
    /* ---- checkpoints, zones, decoration */
    L.checkpoint(21, -8, 30, 0, 23, -2.5, 23, -5);
    L.zone('chart', 12, -8, 20, 0);
    L.zone('top', 21, -8, 40, 0, Y - 1, 50);
    L.deco(2, -11, 3.5, -9.5, 0, 16, 'pipe'); L.deco(36, -11, 37.5, -9.5, Y, 20, 'pipe');
    L.sign(14, 2.2, -7.9, 'ORG CHART');
    L.sign(24, Y + 2.2, -7.9, 'BOARDROOM');
  },
  zones: {
    chart: { say: ['The boardroom is on top of that wall. The wall is taller than a launch. Taller than a launch off the crate. Taller than a launch off Nut.', 'Have you tried all three at once? Management calls it a hierarchy. You may call it a pile.'], hint: 'Bolt jumps onto Nut\'s head first. Then Nut, carrying him, jumps onto the crate by the wall. Bolt shuffles to the wall side of her head, and Nut presses X: he flies higher than any single launch. Steer him onto the top, then he reels Nut up.' },
    top: { say: ['Welcome to the boardroom. It is mostly carpet. Please wipe your wheels.'] },
  },
  outro: 'Overtime done. You have been restructured. Bolt is now above Nut. Nut is now above a crate. The crate has not been told.',
};
