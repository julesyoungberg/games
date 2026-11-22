// Overtime 32. Unlocks after Shift 25. Uses: oil, pulling crates, Nut throwing crates, plates, gates, lasers.
// The aha: on oil, a crate keeps whatever speed it lands with. The gate plate is at the far end of a long oiled chute,
// through a slot in the wall. The chute is lasered, so nobody can walk a crate down it, and it is 2 m up, higher than
// Bolt can lift a crate. Only Nut's throw gets a crate up there, and only a throw along the chute lands it fast enough
// to skate all the way to the plate. The crate starts on a high shelf, out of Nut's reach, so Bolt has to fetch it first.
// The plate is flush with the oil, so a crate that gets there glides onto it and stops against the end wall.
// Back walls are 10 m tall so nobody launched at them can stand on one.
const BW = (L, x0, x1, top, h = 10) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');
const H = 2.0; // the chute
const C0 = 13, W = 16, E = 23, CZ = -5.6; // chute start, the wall, the chute's end, the chute's front edge

export default {
  name: 'Sliding Scale', sub: 'Overtime. The further it slides, the more it earns.', theme: 10, after: 24,
  intro: ['Overtime! Tonight the post room is closed, so parcels go down the chute. The chute has been oiled. Facilities say that is a feature.'],
  build(L) {
    L.start(2.5, -3, 2.5, -1.5);
    L.floor(0, -8, C0, 0, 0); L.floor(C0, CZ, W, 0, 0); BW(L, 0, C0, 0);
    // the crate on the stock shelf, too high for Nut to throw from the floor
    L.box(3, -8, 6, -6.4, -6, 3.4, 'shelf');
    L.crate(4.5, -7.2, 3.4);
    /* ---- Sliding Scale: Bolt pulls the crate off the shelf and puts it down by the chute. Nut throws it up onto the chute,
            along the wall, and it skates through the slot and all the way to the plate. The plate opens the gate. */
    L.oil(C0, -8, E, CZ, H); BW(L, C0, E + 1, H);
    L.laser(C0, -8, E, CZ + 0.7, H + 0.05, H + 6);
    L.plate(E - 1, -6.8, 1, H - 0.08, 0.9); // flush with the oil, so a crate glides onto it
    L.box(E, -8, E + 1, CZ, -6, H + 2, 'wall');
    // the slot: wide enough for a crate hanging off the chute's edge, lasered for robots
    L.box(W, -8, W + 1, CZ + 0.7, H + 2.2, 10, 'wall'); L.box(W, CZ, W + 1, CZ + 0.7, 0, H, 'wall');
    L.gate(W, CZ + 0.7, W + 1, 0, 0, 10, [1]);
    L.floor(W + 1, CZ, 46, 0, 0); L.floor(E + 1, -8, 46, CZ, 0); BW(L, E + 1, 46, 0);
    L.exit(40, -6.5, 45, -1.5, 0);
    // golden cog: high over the dispatch floor. Only a launch reaches it.
    L.cog(37, 4.7, -6.8);
    /* ---- checkpoints, zones, decoration */
    L.checkpoint(W + 2, -5.5, 37, 0, 30, -2, 30, -4);
    L.zone('shelf', 1, -8, 8, 0);
    L.zone('chute', 9, -8, W, 0);
    L.zone('end', W + 2, -8, 46, 0);
    L.deco(7, -11, 8.5, -9.5, 0, 14, 'pipe'); L.deco(42, -11, 43.5, -9.5, 0, 14, 'pipe');
    L.sign(4.5, 4.6, -7.9, 'STOCK');
    L.sign(14.5, H + 3.2, -7.9, 'PARCELS ONLY');
    L.sign(E - 1, H + 3.2, -7.9, 'DISPATCH');
  },
  zones: {
    shelf: { say: ['One parcel tonight. It is on the top shelf, because that is where parcels go to be forgotten.'], hint: 'Bolt faces the shelf and holds X to pull the crate down, then carries it to the chute.' },
    chute: { say: ['The plate that opens the gate is at the far end of the chute. The chute is for parcels only. Robots will be gently lasered.', 'The chute is oiled. Whatever lands on it keeps going. That is the whole idea. It took a committee.'], hint: 'Bolt sets the crate down on the floor, close to the chute. Nut stands behind it (on the start side) and only a little toward the camera, and presses X. The crate flies up onto the chute, mostly along it. It skates through the slot onto the plate. If it stops halfway, Bolt can pull it back out.' },
    end: { say: ['Delivered. Signed for. By a plate. Plates have very neat handwriting.'] },
  },
  outro: 'Overtime done. One parcel dispatched at great speed. The oil bill has been sent to Facilities. By chute.',
};
