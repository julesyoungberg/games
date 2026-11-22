// Overtime 27. Unlocks after Shift 1. Uses: jumping, standing on heads, plates, gates (one latching), pulling Nut.
// The aha (1): a door held open from one side can be held open from the other. Bolt holds the shelf plate, Nut walks
// through and stands on the far plate, and the door stays open for him. (2): the plate is two storeys up. Bolt climbs
// one storey off Nut's head, reels her up after him, and climbs the second storey off her head again.
// Back walls are 10 m tall so nobody standing on a shelf (or launched off one) can stand on one and walk past a gate.
const BW = (L, x0, x1, top, h = 10) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');
const S = 2.0; // the shelf by the first door
const K = 1.9, H = 3.8; // the two storeys of the filing stack

export default {
  name: 'Job Share', sub: 'Overtime. One job, two robots, and a lot of standing about.', theme: 1, after: 0,
  intro: ['Overtime! Already? You only started this morning. That is the spirit. The spirit is unpaid.'],
  build(L) {
    L.start(2.5, -3, 2.5, -5.5);
    L.floor(0, -8, 48, 0, 0); BW(L, 0, 48, 0);
    /* ---- 1. Job Share: the door plate is on a shelf. Bolt boosts off Nut onto it, the door opens, Nut walks through
            and stands on the plate on the far side. That plate holds the door too, so Bolt walks through after her. */
    L.box(10, -8, 13, -5.4, -6, S, 'shelf');
    L.plate(11.5, -6.7, 1, S);
    L.gate(16, -8, 17, 0, 0, 10, [1, 2], { any: true });
    L.plate(20.5, -6.3, 2, 0);
    /* ---- 2. Filing Stack: the plate that opens the last door for good is two storeys up. Bolt boosts onto the low
            storey, reels Nut up, then boosts off her onto the high storey and stands on the plate. */
    L.box(28, -8, 31, -4.5, -6, K, 'shelf');
    L.box(31, -8, 34, -4.5, -6, H, 'shelf');
    L.plate(32.5, -6.3, 3, H);
    L.gate(36, -8, 37, 0, 0, 10, 3, { latch: true });
    L.exit(41, -6.5, 46, -1.5, 0);
    // golden cog: over the high storey. A jump from up there misses. A boost off Nut's head up there does not.
    L.cog(32.5, 7.0, -6.3);
    /* ---- checkpoints, zones, decoration */
    L.checkpoint(17.5, -8, 26, 0, 19, -3, 19, -5);
    L.checkpoint(37.5, -8, 48, 0, 39, -3, 39, -5);
    L.zone('share', 6, -8, 16, 0);
    L.zone('stack', 24, -8, 31, 0);
    L.zone('top', 31, -8, 34, -4.5, H - 0.5, 50);
    L.zone('end', 38, -8, 48, 0);
    L.deco(4, -11, 5.5, -9.5, 0, 12, 'pipe'); L.deco(43, -11, 44.5, -9.5, 0, 12, 'pipe');
    L.sign(8, 2.2, -7.9, 'JOB SHARE');
    L.sign(29.5, 4.4, -7.9, 'ARCHIVE');
    L.sign(42, 2.2, -7.9, 'HOME TIME');
  },
  zones: {
    share: { say: ['This door is opened by the plate on that shelf. The shelf is too high for one robot. You know what to do. You did it this morning.', 'Of course, whoever holds the plate is not going through the door. Have a look round the other side before you panic.'], hint: 'Nut stands still by the shelf. Bolt jumps on her head and onto the shelf plate. The door opens. Nut walks through and stands on the plate on the far side. That plate holds the door open too, so Bolt hops down and walks through.' },
    stack: { say: ['The last door opens from the plate on top of the filing. Two storeys of filing. Nobody has looked in it since the nineties.', 'Bolt, your magnet pulls Nut. Hold X while facing her. Climbing is much easier when you bring the ladder with you.'], hint: 'Bolt jumps off Nut\'s head onto the low storey. He faces Nut, holds X and steps back to reel her up. Then Nut stands still and Bolt jumps off her head onto the high storey and the plate. The door stays open for good.' },
    top: { say: ['Lovely. That door is open for good now. It has been told it can go home.'] },
    end: { say: ['The exit! Both of you, please. Job shares clock out together.'] },
  },
  outro: 'Overtime done. You shared one job perfectly. Payroll has split one wage between you. It came to a biscuit each.',
};
