// Shift 25 (played as Shift 23): Stocktake. End of season count: belts, crates and switches. Logistics and sorting.
// Back walls are 10 m tall so a launch (even from the stock shelf) can never land on top of one and walk past a gate.
const BW = (L, x0, x1, top, h = 10) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');

export default {
  name: 'Stocktake', sub: 'Shift 23. Everything gets counted. Then sorted. Then counted again.', theme: 2,
  intro: [
    'Shift twenty three. Stocktake. The season is nearly over, so we count everything before we pack it away.',
    'I have a clipboard. You have a factory full of crates. One of us is going to have a long day.',
  ],
  build(L) {
    L.start(2.5, -3, 2.5, -5.5);
    BW(L, 0, 101, 0);
    /* ---- 1. Stock Check: the crate is in the Goods In cage, the plate is on top of the stock shelf. Nut launches Bolt up; Bolt pulls the crate up to the plate */
    L.floor(0, -8, 31, 0, 0);
    L.box(11, -3.4, 16, -0.6, -1, 3.4, 'shelf');
    L.plate(12.6, -2, 1, 3.4);
    L.box(17.5, -8, 22.5, -7.6, 0, 1.2, 'wall');
    L.crate(20, -6.6, 0);
    L.laser(17.5, -8, 22.5, -5.4, 0, 5);
    L.gate(24, -8, 24.5, 0, 0, 9, [1]);
    /* golden cog: high over the stock shelf. Both robots up on the shelf, then Nut launches Bolt */
    L.cog(13.6, 7.7, -2);
    /* ---- 2. Cross Docking: the belt over the dock only runs your way while the plate is pressed. The switch on the far island keeps it running. The gate wants it off again */
    L.plate(29.5, -6.5, 2, 0);
    L.conveyor(31, -5.2, 42, -2.8, 0, -9, 0, [2]);
    L.laser(31, -5.2, 42, -2.8, 1.3, 9);
    L.box(40.8, -8, 42, -6.8, -6, 0, 'floor');
    L.button(41.4, -7.4, 2, 0);
    L.floor(42, -8, 54, 0, 0);
    L.gate(46, -8, 46.5, 0, 0, 9, [2], { invert: true });
    /* ---- 3. Pick and Pack: two crates on the top rack, two bays at the ends of the sorting belt. The switch turns the belt round. One crate each way */
    L.box(58, -1.4, 60.6, 0, -1, 5.5, 'shelf');
    L.crate(58.65, -0.7, 5.5); L.crate(59.95, -0.7, 5.5);
    L.floor(54, -4.2, 78, 0, 0);
    L.floor(54, -8, 58, -4.2, 0);
    L.conveyor(58, -8, 70, -6.4, 0, -5, 0, [2]);
    L.floor(58, -6.4, 70, -4.2, 0);
    L.floor(70, -8, 78, -4.2, 0);
    L.plate(56.4, -7.2, 3, 0);
    L.plate(71.8, -7.2, 4, 0);
    L.laser(53, -8, 59, -4.2, 0, 5);
    L.laser(69, -8, 75, -4.2, 0, 5);
    L.button(64, -5.2, 2, 0);
    L.gate(76.5, -8, 77, 0, 0, 9, [3, 4]);
    /* ---- 4. Despatch: Bolt pulls the parcel back over the pit; Nut throws it up onto the despatch belt; the belt takes it over to the plate and the bridge comes out */
    L.conveyor(78, -7.4, 90, -5.4, 2.4, 4, 0);
    L.floor(78, -8, 82, -7.4, 0); L.floor(78, -5.4, 82, 0, 0);
    L.floor(90, -8, 101, 0, 0);
    L.bridge(82, -2.2, 90, 0, 0, [5]);
    L.laser(82, -8, 90, -2.4, -6, 9);
    L.plate(92.6, -6.4, 5, 0);
    L.crate(91.4, -1.4, 0);
    L.exit(96, -6.5, 100.5, -1.5, 0);
    /* ---- checkpoints, zones, decoration */
    L.checkpoint(25, -8, 29, 0, 26.5, -3, 26.5, -5.5);
    L.checkpoint(47, -8, 53, 0, 49, -3, 49, -5.5);
    L.checkpoint(77.5, -8, 82, 0, 79.5, -3, 79.5, -5.5);
    L.checkpoint(95, -8, 101, 0, 98, -3, 98, -5.5);
    L.zone('stock', 5, -8, 9.5, 0);
    L.zone('cog', 11, -3.4, 16, -0.6, 3, 50);
    L.zone('dock', 26, -8, 30, 0);
    L.zone('pack', 49, -8, 54, 0);
    L.zone('despatch', 78, -8, 81, 0);
    L.zone('end', 95, -8, 101, 0);
    L.deco(6, -11, 7.5, -9.5, 0, 12, 'pipe'); L.deco(36, -11, 37.5, -9.5, -6, 12, 'pipe'); L.deco(64, -11, 65.5, -9.5, 0, 12, 'pipe'); L.deco(86, -11, 87.5, -9.5, -6, 12, 'pipe');
    L.sign(13.5, 4.6, -7.9, 'STOCK CHECK');
    L.sign(20, 2.4, -7.9, 'GOODS IN');
    L.sign(35, 1.6, -7.9, 'CROSS DOCKING');
    L.sign(64, 1.6, -7.9, 'PICK AND PACK');
    L.sign(84, 4.2, -7.9, 'DESPATCH');
  },
  zones: {
    stock: { say: ['Stock check. One crate in the Goods In cage. One plate on top of the stock shelf. That is the whole inventory.', 'Bolt, the crate goes on the plate. The plate is up there. You are down here. I am just reading the clipboard.'], hint: 'Bolt stands behind the stock shelf with Nut behind him, and Nut presses X to launch him onto it. On the shelf, Bolt faces the cage and holds X: the iron crate flies out through the lasers. He turns and sets it on the teal plate. The gate opens.' },
    dock: { say: ['Cross docking. The belt over the dock only runs your way while somebody stands on the plate. There is a laser roof, so please ride it standing up. No hopping. This is a dock.', 'There is a switch on the island at the far end. It keeps the belt running. The gate on the other side wants it switched off again. Facilities wrote these rules. I just read them.'], hint: 'Bolt stands on the orange plate and the belt runs across. Nut rides it over, standing still (a jump hits the laser roof), and pushes the orange switch on the island. Bolt steps off and rides across too. Then Nut pushes the switch again to turn it off, and the gate opens.' },
    pack: { say: ['Pick and pack. Two crates on the top rack. Two bays, one at each end of the sorting belt. One crate in each bay, please.', 'The belt goes left. The switch makes it go right. Nobody may enter the bays. That is what the lasers are for. The lasers are very strict.'], hint: 'Bolt pulls a crate down from the top rack and drops it on the sorting belt: it rides left into the pink bay. Nut pushes the orange switch so the belt runs right. Bolt drops the second crate on the belt and it rides into the lime bay. With a crate in each bay the gate opens.' },
    despatch: { say: ['Despatch. The parcel is already over there. It came back. Returns. Please send it again.', 'Nobody can cross. Parcels can. The despatch belt is up high, and only one of you throws things up high.'], hint: 'Bolt faces the parcel across the pit and holds X to pull it over. He puts it down in front of the despatch belt. Nut stands right behind it and presses X to throw it up onto the belt. The belt carries it over to the purple plate and a bridge appears along the front. Walk across.' },
    cog: { say: ['Nice view from the top of the stock shelf. There is a golden cog up near the ceiling. It is not on my list.'], hint: 'Optional golden cog. Bolt pulls Nut up onto the stock shelf. Bolt stands under the cog, Nut stands right next to him and presses X.' },
    end: { say: ['Everything is counted. Everything is sorted. Everything is in a crate. Some of it is in two crates. That is a problem for next year.'] },
  },
  outro: 'Shift twenty three complete. The stocktake balances. I added up the column three times and got three answers, so I picked the nicest one.',
};
