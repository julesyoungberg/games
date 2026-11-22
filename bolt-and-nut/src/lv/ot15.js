// Overtime 15. Unlocks after Shift 2. Uses: jumping, standing on heads, iron crates, plates, bridges, gates, pulling Nut.
// Back walls are 6 m tall so nobody standing on a head can climb onto one and walk past the ledge.
const BW = (L, x0, x1, top, h = 6) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');
const Y = 3.2; // the upper floor

export default {
  name: 'Corporate Ladder', sub: 'Overtime. Climbing it is easy. You just step on a colleague.', theme: 1, after: 1,
  intro: ['Overtime! This evening we are climbing the corporate ladder. We could not afford a ladder. You will have to be the ladder.'],
  build(L) {
    L.start(2.5, -3, 2.5, -5.5);
    /* ---- 1. Corporate Ladder: the ledge is too high for a head, too high for a crate. A crate, a cabinet and a Nut
            make a staircase. Nut stands on the cabinet, Bolt climbs the crate, then Nut, then the ledge. */
    L.floor(0, -8, 14, 0, 0); BW(L, 0, 14, 0);
    L.crate(6, -3, 0);
    L.box(12.8, -5.2, 14, -4, -6, 1.2, 'shelf');
    /* ---- 2. Two Places at Once: the bridge wants a weight on this side. The gate wants a weight on the far side.
            There is one crate. There is also one Nut, and Bolt can fetch Nuts from anywhere. */
    L.floor(14, -8, 24, 0, Y); BW(L, 14, 24, Y);
    L.plate(18.5, -6.3, 1, Y);
    L.bridge(24, -5, 32, -1.5, Y, 1); BW(L, 24, 32, Y);
    L.cog(28, Y + 3, -3.2);
    L.floor(32, -8, 50, 0, Y); BW(L, 32, 50, Y);
    L.plate(35, -6.3, 2, Y);
    L.gate(39, -8, 40, 0, Y, Y + 10, [2]);
    L.exit(44, -6.5, 48, -1.5, Y);
    /* ---- checkpoints, zones, decoration */
    L.checkpoint(14.5, -8, 23.5, 0, 16, -2.5, 16, -5);
    L.checkpoint(32.5, -8, 38.5, 0, 33.5, -2.5, 33.5, -4.5);
    L.checkpoint(40.5, -8, 50, 0, 42, -2.5, 42, -5);
    L.zone('ladder', 7.5, -8, 14, 0);
    L.zone('twice', 15, -8, 24, 0, Y - 1, 50);
    L.zone('end', 41, -8, 50, 0, Y - 1, 50);
    L.deco(3, -11, 4.5, -9.5, 0, 9, 'pipe'); L.deco(46, -11, 47.5, -9.5, Y, 12, 'pipe');
    L.sign(4.5, 1.8, -7.9, 'CORPORATE LADDER');
    L.sign(20, Y + 1.8, -7.9, 'LUGGAGE');
  },
  zones: {
    ladder: { say: ['That ledge is too high for standing on a head. It is too high for standing on a crate. It is not too high for both.', 'One cabinet. One crate. One colleague. That is a staircase, if you squint.'], hint: 'Bolt carries the crate next to the cabinet and drops it. Nut jumps onto the cabinet. Bolt jumps onto the crate, then onto Nut\'s head, then onto the ledge. Then Bolt pulls Nut up.' },
    twice: { say: ['The bridge needs a weight on this plate. The gate over there needs a weight on that plate. You have one crate.', 'Bolt, you left your crate downstairs. Fetch it. Then decide which of you is luggage.'], hint: 'Bolt pulls the crate up from below. Nut stands on the teal plate. Bolt carries the crate over the bridge and drops it on the orange plate. Then Nut steps off, and Bolt pulls her over the gap.' },
    end: { say: ['You have climbed the ladder. There is nothing at the top except a door. That is how ladders work here.'] },
  },
  outro: 'Overtime done. You have been promoted by three metres. Mostly by standing on each other. That is how it usually goes.',
};
