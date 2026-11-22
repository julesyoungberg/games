// Overtime 36. Unlocks after Shift 33 (the finale). Uses: an iron crate, lasers that ignore crates, pulling crates,
// standing on a crate, launching, pulling Nut, a plate, a gate.
// The aha: one crate, two jobs. Downstairs it is a step: a launch from the floor reaches 3.9 m, a launch from the crate
// 5.1 m, and the ledge is 4.6 m. Upstairs it is a doorstop: whoever holds the door plate is shut out when they step off.
// So after Bolt reels Nut up, he reels the crate up too, and sets it on the plate.
// Back walls and the gate are 10 m tall so nobody launched at them can stand on one.
const BW = (L, x0, x1, top, h = 10) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');
const W = 20, Y = 4.6, G = 31; // the ledge wall, its height, the gate

export default {
  name: 'Severance Package', sub: 'Overtime. One crate. Two jobs. No pay rise.', theme: 11, after: 32,
  intro: ['Overtime! The very last one. Head office has given you a leaving present. It is a crate. It will be doing a lot of work tonight.'],
  build(L) {
    L.start(2.5, -3, 2.5, -5.5);
    L.floor(0, -8, W, 0, 0); BW(L, 0, W, 0);
    /* ---- Step: the crate is in a lasered pen. Bolt pulls it out, sets it by the wall, stands on it, and Nut launches him up. */
    L.crate(7, -7, 0);
    L.laser(5.5, -8, 8.5, -5.8, 0, 3);
    /* ---- Doorstop: Bolt reels Nut up, then the crate. The crate goes on the plate and the gate stays open for both. */
    L.floor(W, -8, 44, 0, Y); BW(L, W, 44, Y);
    L.plate(27, -6.3, 1, Y, 0.9);
    L.gate(G, -8, G + 1, 0, Y, Y + 10, [1]);
    L.exit(38, -6.5, 43, -1.5, Y);
    // golden cog: over the foot of the wall. Only a launch from the crate reaches it.
    L.cog(18.2, 5.6, -7);
    /* ---- checkpoints, zones, decoration */
    L.checkpoint(W + 1, -8, 25, 0, 23, -3, 23, -5);
    L.checkpoint(G + 1.5, -8, 37, 0, 35, -3, 35, -5);
    L.zone('pen', 3, -8, 12, 0);
    L.zone('wall', 14, -8, W, 0);
    L.zone('door', W + 1, -8, G, 0, Y - 1, 50);
    L.zone('end', G + 1.5, -8, 44, 0, Y - 1, 50);
    L.deco(10, -11, 11.5, -9.5, 0, 14, 'pipe'); L.deco(41, -11, 42.5, -9.5, Y, 20, 'pipe');
    L.sign(7, 3.6, -7.9, 'LEAVING PRESENT');
    L.sign(G + 0.5, Y + 4, -7.9, 'EXIT INTERVIEW');
  },
  zones: {
    pen: { say: ['Your leaving present is in the pen. The pen is a laser. Lasers do not care about crates. Crates do not care about anything. Be more like the crate.'], hint: 'Bolt faces the crate in the laser pen and holds X to pull it out. He keeps holding X to carry it.' },
    wall: { say: ['The ledge is higher than any launch from the floor. It is not higher than a launch from a crate. Funny, that.'], hint: 'Bolt sets the crate right against the wall and lets go. He takes two or three steps of run-up and jumps onto it. Nut stands just behind him and presses X to launch him onto the ledge. Bolt faces Nut and holds X to reel her up.' },
    door: { say: ['The door stays open only while somebody stands on the plate. Somebody, or something. Something is cheaper.'], hint: 'Bolt goes to the edge, faces the crate below and holds X to pull it up. He carries it onto the plate and lets go. The door opens for both of you.' },
    end: { say: ['Everyone is through, and so is the crate, in spirit. That is it. Overtime is over. Go home. Take the crate. Do not take the crate.'] },
  },
  outro: 'All overtime done. Head office thanks you for your service and would like the crate back.',
};
