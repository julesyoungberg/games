// Shift 21: Quarterly Reset. A new year, a "new improved" factory. All about crates: lasers ignore them, belts carry them, robots ride them.
// Back walls are 4.5 m tall (10 m where a launch onto the wall could skip a puzzle) so nobody walks along the top past a gate.
const BW = (L, x0, x1, top, h = 4.5) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');

export default {
  name: 'Quarterly Reset', sub: 'Shift 21. New year. New factory. Same crates.', theme: 4,
  intro: [
    'Shift twenty one. Quarterly Reset. Happy new year from everyone at Attraction Industries.',
    'Over the holidays we built a new improved factory. It is the old factory, but the crates are in different places.',
  ],
  build(L) {
    L.start(2.5, -3, 2.5, -5.5);
    /* ---- golden cog: the suggestion box. Bolt stands on the wooden crate and Nut launches him */
    L.floor(0, -8, 30, 0, 0); BW(L, 0, 21, 0);
    L.crate(6, -2.5, 0, { wood: true });
    L.cog(6, 5.55, -2.2);
    /* ---- 1. Lost Property: the iron crate is locked in a laser cage. Bolt pulls it out through the lasers; Nut fires it onto the plate in the other cage */
    L.box(9.6, -8, 10, -5, 0, 4.4, 'wall'); L.box(13, -8, 13.4, -5, 0, 4.4, 'wall');
    L.crate(11.5, -6.5, 0);
    L.laser(10, -8, 13, -4.8, 0, 4.4);
    L.box(16.8, -8, 19.6, -5.4, -1, 1.8, 'shelf');
    L.plate(18.2, -6.8, 1, 1.8);
    L.laser(16.4, -8, 20, -5, 0, 4.4);
    L.gate(22, -8, 22.5, 0, 0, 8, [1]); BW(L, 21, 26, 0, 9);
    /* ---- 2. Inbox: the belt runs the wrong way, into the shredder. Nut holds it the right way; Bolt feeds it the wooden crate; the crate rides into the cage onto the plate */
    BW(L, 26, 44, 0);
    L.box(26.8, -2.6, 29.6, -0.2, -1, 0.3, 'step');
    L.plate(28.2, -1.4, 2, 0.3);
    L.floor(30, -3.8, 33, 0, 0); L.floor(33, -5, 46, 0, 0);
    L.box(30, -8, 44, -6.6, -6, 1.5, 'wall');
    L.conveyor(33, -6.6, 41, -5, 0, -4, 0, [2]);
    L.crate(35, -4, 0, { wood: true });
    L.floor(41, -6.6, 46, -5, 0); L.floor(44, -8, 46, -6.6, 0);
    L.laser(39, -8, 44, -4.2, 0, 4.4);
    L.plate(41.9, -5.6, 3, 0);
    L.gate(45, -8, 45.5, 0, 0, 8, [3]);
    /* ---- 3. Commute: the floor is lasers. Ride the wooden crate across on the belt; whoever is across holds the belt for the other one */
    BW(L, 44, 92, 0, 10);
    L.floor(46, -8, 52, 0, 0);
    L.box(48.3, -7.8, 50.7, -5.4, -1, 0.3, 'step'); L.plate(49.5, -6.6, 4, 0.3);
    L.box(51.4, -5.5, 52, -2.5, 0, 0.6, 'wall');
    L.conveyor(52, -5.5, 64, -2.5, 0, -4, 0, [4]);
    L.crate(52.62, -4, 0.02, { wood: true });
    L.floor(52, -8, 64, -5.5, 0); L.floor(52, -2.5, 64, 0, 0);
    L.laser(53.5, -8, 63.6, 0, -1, 0.95);
    L.laser(53.5, -8, 63.6, 0, 3.8, 10);
    L.box(64, -5.5, 64.6, -2.5, 0, 0.6, 'wall');
    L.floor(64, -8, 98, 0, 0);
    L.box(65.8, -7.8, 68.2, -5.4, -1, 0.3, 'step'); L.plate(67, -6.6, 4, 0.3);
    /* ---- 4. Top Shelf: the plate is too high to throw a crate onto from the floor. Throw it from the mezzanine */
    L.crate(73.5, -6.5, 0);
    L.box(76, -8, 80, -4, -1, 3, 'shelf');
    L.box(82, -8, 85.4, -4.6, -1, 5, 'shelf');
    L.plate(83.4, -6.4, 5, 5);
    L.laser(80, -8, 86, -4.2, 0, 10);
    L.gate(88, -8, 88.5, 0, 0, 8, [5]);
    BW(L, 92, 98, 0);
    L.exit(92, -6.5, 97.5, -1.5, 0);
    /* ---- checkpoints, zones, decoration */
    L.checkpoint(23, -8, 26.5, 0, 24.5, -3, 24.5, -5.5);
    L.checkpoint(46, -8, 48, 0, 47, -2.5, 47, -4.5);
    L.checkpoint(65, -5.2, 72, 0, 69, -2, 69, -4);
    L.checkpoint(89, -8, 98, 0, 91, -3, 91, -5.5);
    L.zone('cog', 4, -8, 8, 0);
    L.zone('lost', 8.5, -8, 11, 0);
    L.zone('inbox', 24, -8, 30, 0);
    L.zone('commute', 46, -8, 50, 0);
    L.zone('shelf', 69, -8, 74, 0);
    L.zone('end', 90, -8, 98, 0);
    L.deco(7, -11, 8.5, -9.5, 0, 10, 'pipe'); L.deco(37, -11, 38.5, -9.5, 0, 10, 'pipe'); L.deco(58, -11, 59.5, -9.5, 0, 14, 'pipe'); L.deco(94, -11, 95.5, -9.5, 0, 10, 'pipe');
    L.sign(6, 2.2, -7.9, 'SUGGESTION BOX');
    L.sign(11.5, 4.8, -7.9, 'LOST PROPERTY');
    L.sign(42, 4.8, -7.9, 'INBOX');
    L.sign(58, 4.8, -7.9, 'COMMUTE');
    L.sign(78, 4.8, -7.9, 'TOP SHELF');
  },
  zones: {
    cog: { say: ['This is the suggestion box. It is a crate. All suggestions go in the crate. Nobody has opened the crate.', 'There is a golden cog above it. Probably a suggestion that floated up.'], hint: 'Optional golden cog. Bolt jumps onto the wooden crate. Nut stands next to the crate and presses X. Bolt flies straight up from the crate, high enough to reach the cog.' },
    lost: { say: ['Welcome to the new improved factory. The lasers are new. The crates are improved. We locked one up to keep it safe.', 'Lasers only zap robots. Crates walk right through. Crates also do not walk. Moving on.'], hint: 'Bolt stands in front of the left cage and holds X: the iron crate flies out through the lasers. He sets it down in front of the right cage and steps away. Nut stands behind it and presses X to throw it onto the teal plate.' },
    inbox: { say: ['This is the inbox. The belt runs into the shredder. Facilities says it is the right way round. Facilities is wrong.', 'The plate on the step turns the belt around. It only works while someone is standing on it. Like most of us.'], hint: 'Nut stands on the orange plate on the step, so the belt runs toward the cage. Bolt walks into the wooden crate from the front and shoves it onto the belt. The belt carries it through the lasers onto the pink plate. The gate opens.' },
    commute: { say: ['The commute. The floor is lasers. The ceiling is also lasers. The crate is not a robot, so the crate does not care.', 'The belt only runs forward while someone stands on a plate. There is a plate at each end. Please carpool.'], hint: 'Bolt jumps onto the wooden crate. Nut stands on the lime plate and the belt carries Bolt across. Bolt steps off at the far end. Nut steps off her plate and the crate comes back. Nut climbs on, Bolt stands on the far lime plate, and Nut rides across. Do not jump while riding.' },
    shelf: { say: ['The top shelf. The plate is up high, in a cage. Nut can throw a crate, but not that high. Not from down here.', 'There is a mezzanine. Things thrown from a mezzanine go higher. That is the whole point of a mezzanine.'], hint: 'Nut launches Bolt onto the mezzanine. Bolt pulls Nut up, then pulls the iron crate up and sets it down near the edge facing the cage. Bolt hops down. Nut stands behind the crate and presses X. It lands on the purple plate and the gate opens.' },
    end: { say: ['Every crate is where it should be. For now. We reset everything again in three months.'] },
  },
  outro: 'Shift twenty one complete. The new improved factory has been inspected. It is new. It is improved. It is mostly crates.',
};
