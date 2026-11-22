// Overtime 29. Unlocks after Shift 21. Uses: lasers that ignore crates, an iron crate, pull range, launching, plates, a gate.
// The aha (1): pull range is measured in a straight line, upwards too. The crate on top of the lost property shelf is out of
// Bolt's reach from the floor, from a jump and from a boost off Nut's head. Launched, he is close enough to grab it on the way up.
// (2): the laser fence only stops robots. Once both are through, Bolt reels the crate back through the fence after them,
// and Nut throws it onto the plate under the laser canopy, where no robot can stand.
// Back walls are 14 m tall so nobody launched at them can stand on one and walk past the fence.
const BW = (L, x0, x1, top, h = 14) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');
const T = 12.4; // the top of the lost property shelf
const S = 2.0; // the out tray shelf

export default {
  name: 'Lost Property', sub: 'Overtime. If it is on the top shelf, it is lost. That is the policy.', theme: 5, after: 20,
  intro: ['Overtime! Lost Property has lost a crate. On its own top shelf. Please find it. Then post it.'],
  build(L) {
    L.start(2.5, -3, 2.5, -5.5);
    L.floor(0, -8, 44, 0, 0); BW(L, 0, 44, 0);
    /* ---- 1. Top Shelf: a laser fence (off while the plate is held) and the crate on top of a very tall shelf beyond it.
            Nut launches Bolt by the fence, and on the way up he holds X and grabs the crate, then sets it on the plate. */
    L.plate(10, -6.3, 1, 0);
    L.laser(14, -8, 14.4, 0, 0, 14, 1);
    L.box(18, -8, 21, -5, -6, T, 'shelf');
    L.crate(18.7, -6.5, T);
    /* ---- 2. Out Tray: the exit door plate sits on a shelf under a laser canopy. Bolt reels the crate back through the
            fence, sets it down, and Nut throws it onto the tray. */
    L.box(27, -8, 30, -4.6, -6, S, 'shelf');
    L.box(30, -8, 30.5, -4.6, S, S + 1.2, 'wall');
    L.plate(28.6, -6.3, 2, S);
    L.laser(27, -8, 30, -4.6, S, S + 2.4);
    L.gate(34, -8, 35, 0, 0, 14, 2);
    L.exit(38, -6.5, 43, -1.5, 0);
    // golden cog: over the floor past the fence. A jump or a boost falls short. A launch does not.
    L.cog(23.5, 5.0, -7);
    /* ---- checkpoints, zones, decoration */
    L.checkpoint(15, -5, 26, 0, 17, -2, 17, -4);
    L.checkpoint(35.5, -8, 44, 0, 37, -3, 37, -5);
    L.zone('shelf', 6, -8, 14, 0);
    L.zone('tray', 22, -8, 32, 0);
    L.zone('end', 36, -8, 44, 0);
    L.deco(4, -11, 5.5, -9.5, 0, 18, 'pipe'); L.deco(41, -11, 42.5, -9.5, 0, 18, 'pipe');
    L.sign(19.5, T + 1.2, -7.9, 'LOST PROPERTY');
    L.sign(8, 2.4, -7.9, 'CLAIMS');
    L.sign(28.5, 5.2, -7.9, 'OUT TRAY');
  },
  zones: {
    shelf: { say: ['The fence turns off while that plate is held. The only crate is on the top shelf over there. Lost, officially.', 'Bolt, your magnet reaches eleven metres. Straight lines only. Upwards counts. Go up.'], hint: 'Bolt stands near the fence. Nut stands beside him and presses X to launch him. On the way up Bolt faces the tall shelf and holds X to grab the crate. He lands, carries it onto the plate, and the fence switches off. Walk through together.' },
    tray: { say: ['The door opens from the out tray. The out tray is under a laser. Health and safety. Mostly safety.', 'Lasers do not mind crates. Crates do not mind lasers. It is the nicest relationship in the building.'], hint: 'Bolt faces the fence, holds X and reels the crate back through it, then sets it down on the floor near the tray shelf. Nut stands just behind the crate and presses X to throw it onto the tray plate. The door opens.' },
    end: { say: ['Delivered. Lost Property is now Found Property. They will need new signs.'] },
  },
  outro: 'Overtime done. One crate found, posted and filed. Nobody has claimed it. It is going back on the top shelf.',
};
