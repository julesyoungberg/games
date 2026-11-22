// Overtime 10. Unlocks after Shift 18. Uses: wall magnets, standing on heads, lasers, switches.
// Back walls are 6 m tall here so nobody can be launched onto one and stroll over the laser fences.
const BW = (L, x0, x1, top, h = 6) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');

export default {
  name: 'Team Building', sub: 'Overtime. Some of you are the team. Some of you are the building.', theme: 7, after: 17,
  intro: ['Overtime. Tonight is a team building exercise. Bolt will be the building. Nut will be the team. Nobody asked Bolt.'],
  build(L) {
    L.start(2.5, -3, 2.5, -5.5);
    /* ---- 1. Stepping Stone: a low laser fence that Nut can clear from Bolt's head, and nothing else can */
    L.floor(0, -8, 10, 0, 0); BW(L, 0, 26, 0);
    L.magnet(12.6, 0.6, -8, [0, 1]);
    L.laser(14.7, -9.5, 15, 0, -6, 1.2, [1]);
    L.floor(14.7, -8, 26, 0, 0);
    L.button(19, -7.3, 1, 0);
    L.cog(13.8, 3.4, -7.45);
    /* ---- 2. Carpool Lane: a longer pit. Bolt swaps magnets with Nut still on his head */
    L.magnet(28.6, 0.6, -8, [0, 1]);
    L.magnet(31.6, 0.6, -8, [0, 1]);
    L.laser(33.7, -9.5, 34, 0, -6, 1.2, [2]);
    L.floor(33.7, -8, 48, 0, 0); BW(L, 26, 48, 0);
    L.button(38.5, -7.3, 2, 0);
    L.exit(42.5, -6.5, 47, -1.5, 0);
    /* ---- checkpoints, zones, decoration */
    L.checkpoint(16, -8, 25, 0, 18, -3, 18, -5.5);
    L.checkpoint(35, -8, 41.5, 0, 37, -3, 37, -5);
    L.zone('stone', 5, -8, 10, 0);
    L.zone('carpool', 20, -8, 26, 0);
    L.zone('end', 35, -8, 48, 0);
    L.deco(3, -11, 4.5, -9.5, 0, 12, 'pipe'); L.deco(44, -11, 45.5, -9.5, 0, 12, 'pipe');
    L.sign(6, 2.2, -7.9, 'TEAM BUILDING');
    L.sign(22, 2.2, -7.9, 'CARPOOL LANE');
  },
  zones: {
    stone: { say: ['That laser fence is too high for Bolt and too far for Nut. Pulling Nut through it would be a short, bright career.', 'There is a magnet down in the pit. Bolt, you are about to become furniture.'], hint: 'Bolt clings to the magnet in the pit (hold X). Nut runs and jumps onto his head, then jumps from there over the laser fence. Nut flips the teal switch. Bolt hops off the wall and walks over.' },
    carpool: { say: ['A longer pit. Two magnets. One Bolt. Bolt cannot be in two places. He can be in one place and then another place. With a passenger.'], hint: 'Bolt clings to the first magnet and Nut jumps onto his head. Bolt lets go of X and grabs the second magnet straight away, carrying Nut along. Nut jumps over the fence and flips the orange switch.' },
    end: { say: ['Team building complete. The team is built. The building has a sore head.'] },
  },
  outro: 'Overtime done. Bolt has been reclassified as office furniture. He gets a little sticker with a number on it.',
};
