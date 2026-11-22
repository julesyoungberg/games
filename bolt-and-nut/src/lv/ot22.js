// Overtime 22. Unlocks after Shift 26. Uses: a fast conveyor belt, launching, pulling Nut.
// The aha: a robot that leaves a belt in the air keeps the belt's speed until he lands. So a launch from the belt flies
// about twice as far as a launch from the floor. Nut launches Bolt while they both ride the belt, then Bolt reels her over.
// Back walls are 8 m tall (on the mezzanine too) so nobody launched at them can stand on one.
const BW = (L, x0, x1, top, h = 8) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');
const Y = 2; // the far dock
const M = 5.2; // the mezzanine over the start
const V2 = 9; // the dock belt, running back toward the pit

export default {
  name: 'Carry Over', sub: 'Overtime. Unused momentum may be carried over into the next pit.', theme: 2, after: 25,
  intro: ['Overtime! The clearance belt runs all night. It takes everything to the edge and lets go. We call that a policy.'],
  build(L) {
    L.start(2.5, -3, 2.5, -5.5);
    /* ---- 1. Carry Over: the pit is wider than a launch from the floor. The belt along the front runs at the pit, faster than you can walk.
            Anyone leaving it in the air keeps its speed until they land. Both walk back against it, Nut launches Bolt from the belt,
            and he lands on the far dock. Then he reels her over. A jump off the belt is far enough but not high enough. */
    L.floor(0, -8, 14, 0, 0);
    L.floor(14, -4.5, 24, -3.5, 0);
    L.conveyor(14, -3.5, 24, 0, 0, 8, 0);
    BW(L, 0, 14, 0);
    /* ---- 2. Carry Back: the mezzanine is over the start, too high for anything from down there. The dock belt runs back at the pit.
            Same trick, other way: both walk up the belt, Nut launches Bolt back over the pit onto the mezzanine, and he reels her up. */
    L.box(14, -8, 24, -4.5, -6, M, 'floor'); BW(L, 14, 24, M);
    L.box(31.5, -4.5, 44, 0, -14, Y, 'floor'); L.box(40, -8, 44, -4.5, -14, Y, 'floor');
    L.box(31.5, -8, 40, -4.5, -14, Y - 6, 'floor'); L.conveyor(31.5, -8, 40, -4.5, Y, -V2, 0);
    BW(L, 31.5, 44, Y);
    L.box(13.4, -8, 14, -4.5, M, M + 3, 'wall'); // a stop at the far end, so nobody overshoots the mezzanine
    L.exit(15.5, -7.8, 21, -4.6, M);
    // golden cog: high over the far dock. Nut launches Bolt straight up at it.
    L.cog(42, Y + 5.2, -6.2);
    /* ---- checkpoints, zones, decoration */
    L.checkpoint(32.5, -4.5, 44, 0, 34, -2, 36, -2);
    L.zone('carry', 9, -8, 14, 0);
    L.zone('back', 32.5, -8, 44, 0, Y - 1, 50);
    L.zone('end', 14, -8, 24, -4.5, M - 1, 50);
    L.deco(3, -11, 4.5, -9.5, 0, 14, 'pipe'); L.deco(42, -11, 43.5, -9.5, Y, 16, 'pipe');
    L.sign(11, 2.2, -7.9, 'CARRY OVER');
    L.sign(18, 1.6, -4.45, 'FAST →');
    L.sign(41.5, Y + 2.2, -7.9, '← REFUNDS');
    L.sign(20, M + 2.2, -7.9, 'CARRY BACK');
  },
  zones: {
    carry: { say: ['The dock is on the far side of that pit. A launch from the floor gets about two thirds of the way. Two thirds is a fail. I checked.', 'The belt goes to the edge very quickly. Anything that leaves it in the air keeps going just as quickly. It is in the policy. Read the policy.'], hint: 'Both robots get on the belt, Nut just behind Bolt, and walk back against it. Before Bolt reaches the end, Nut presses X: he keeps the belt\'s speed in the air and lands on the far dock. Nut steps off the belt sideways, then Bolt reels her across.' },
    back: { say: ['Head Office would like you on the mezzanine. That is the shelf over where you started. It is too high to reach from down there.', 'This belt runs back the way you came. Faster, too. I am sure you will think of something.'], hint: 'Same trick, the other way. Both get on the dock belt, Nut just in front of Bolt, and walk up it toward the wall. Near the pit end, Nut presses X: Bolt flies back over the pit with the belt\'s speed and lands on the mezzanine. Nut steps off the belt, and Bolt reels her up.' },
    end: { say: ['Carried over and carried back. That is called a round trip. Accounts call it a wash.'] },
  },
  outro: 'Overtime done. Everything must go, and everything went. Including you. You came back, which is a bonus.',
};
