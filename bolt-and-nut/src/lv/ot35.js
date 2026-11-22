// Overtime 35. Unlocks after Shift 10. Uses: an iron crate, pulling crates, plates, two gates (one inverted).
// The aha: the airlock. The plate is inside it. Weight on the plate shuts the way in and opens the way out, so whoever
// stands on it is shut in the moment they step off. A robot is the wrong doorstop. Bring the crate in with you.
// The crate starts on a shelf 4.5 m up: too high to climb, boost or launch onto, but well inside the magnet's 11 m.
// Gates and back walls are 10 m tall so nobody launched at them can stand on one. Pulling Nut off the plate does not
// work either: the way out starts closing from the floor up the instant she leaves it.
const BW = (L, x0, x1, top, h = 10) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');
const A = 15, B = 22; // the two doors (each 1 m thick)

export default {
  name: 'Airlock', sub: 'Overtime. Only one door may be open at a time. It is in the handbook. Page one. In red.', theme: 9, after: 9,
  intro: ['Overtime! Tonight you are testing the new airlock. Nobody knows what it keeps out. Facilities say that is how you know it works.'],
  build(L) {
    L.start(2.5, -3, 2.5, -5.5);
    L.floor(0, -8, 36, 0, 0); BW(L, 0, 36, 0);
    /* ---- Airlock: the plate is inside, between the doors. Weight on it shuts the way in and opens the way out.
            Bolt pulls the crate off the shelf, both walk in, and he sets the crate on the plate. */
    L.box(6, -8, 8.5, -6, 0, 4.5, 'wall'); // the shelf
    L.crate(7.2, -7, 4.5);
    L.gate(A, -8, A + 1, 0, 0, 10, [1], { invert: true });
    L.plate(19.5, -6.3, 1, 0, 0.9);
    L.gate(B, -8, B + 1, 0, 0, 10, [1]);
    L.exit(30, -6.5, 35, -1.5, 0);
    // golden cog: high over the start. Only a launch reaches it.
    L.cog(4, 4.6, -6.8);
    /* ---- checkpoints, zones, decoration */
    L.checkpoint(B + 1.5, -8, 29, 0, 26, -3, 26, -5);
    L.zone('shelf', 3, -8, 12, 0);
    L.zone('airlock', A + 1, -8, B, 0);
    L.zone('out', B + 1.5, -8, 36, 0);
    L.deco(10, -11, 11.5, -9.5, 0, 14, 'pipe'); L.deco(33, -11, 34.5, -9.5, 0, 14, 'pipe');
    L.sign(7.25, 5.6, -7.9, 'DOORSTOP');
    L.sign(18.5, 4, -7.9, 'AIRLOCK');
  },
  zones: {
    shelf: { say: ['That crate on the shelf is the official airlock doorstop. It is up there so nobody borrows it. Nobody can reach it. Policy is working.'], hint: 'Bolt faces the crate on the shelf and holds X to pull it down. He keeps holding X to carry it.' },
    airlock: { say: ['Weight on the plate shuts the door behind you and opens the one in front. Step off, and it swaps back. Whoever holds the plate stays in the airlock.', 'Do not leave a colleague on the plate. It is bad for morale and worse for the colleague.'], hint: 'Both robots walk into the airlock while the first door is open. Then Bolt carries the crate onto the plate and lets go of X. The far door opens and stays open for both of you.' },
    out: { say: ['Through. The airlock kept out nothing, and kept in nobody. Facilities are calling it a total success.'] },
  },
  outro: 'Overtime done. You used a crate as a doorstop. Head office is drafting a new handbook. It is one page. It says: crate.',
};
