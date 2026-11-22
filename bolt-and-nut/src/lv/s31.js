// Shift 31 (played as Shift 29): Last Posting Date. The sorting office in the Christmas rush.
// Conveyor belts, oil, pneumatic tubes and an iron parcel. A belt queue nobody can walk or jump, a letter slot only a parcel fits,
// a sealed house you get into by the chimney, and a hatch whose lid only stays open while somebody holds the door.
// A thin laser net hangs over every floor, a little above the top of a launch, so nobody climbs by standing on the other robot.
const BW = (L, x0, x1, top, h = 14) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');
const NET = (L, x0, x1, y) => L.laser(x0, -9.5, x1, 1.5, y, y + 0.4);
const R = 5.2; // top of the roof of the sealed house

export default {
  name: 'Last Posting Date', sub: 'Shift 29. The Christmas rush. Everything has to be in the post by midnight.', theme: 7,
  intro: [
    'Shift twenty nine. Last Posting Date. It is the Christmas rush in the sorting office, and everything has to be in the post by midnight.',
    'The belts are fast, the floors are polished and the tubes are pneumatic. Please do not post yourselves unless you have the correct postage.',
  ],
  build(L) {
    L.start(2.5, -2, 2.5, -4);
    BW(L, 0, 100, 0);
    /* ---- 1. Pillar Box: the queue is a fast belt running backwards, with a no queue jumping laser above it.
            Nut launches Bolt onto the pillar box and he is posted to the far side. Then he reels Nut along under the laser */
    L.floor(0, -8, 8, 0, 0); NET(L, 0, 8, 5.6);
    L.box(4.5, -8, 6.5, -6, -6, 3.2, 'shelf');
    L.tube(5.5, -7, 3.2, 18.5, -7.2, 0, { outA: [0, 1], outB: [1, 0] });
    L.conveyor(8, -8, 16, 0, 0, -9, 0);
    L.laser(8, -9.5, 16, 1.5, 1.5, 14);
    L.floor(16, -8, 24, 0, 0); NET(L, 16, 24, 5.6);
    /* ---- 2. Letter Slot: the iron parcel is in a roofed cage. Bolt pulls it out, Nut throws it up onto the high belt.
            The belt posts it through the slot in the wall; it slides down the oiled chute onto the plate, and the wall opens */
    L.floor(24, -8, 31, 0, 0); L.floor(31, -5.6, 36, 0, 0); NET(L, 24, 36, 5.6);
    L.box(25.6, -8, 26.2, -5.2, -6, 2.6, 'wall'); L.box(27.8, -8, 28.4, -5.2, -6, 2.6, 'wall'); L.box(26.2, -8, 27.8, -5.2, 2.0, 2.6, 'shelf');
    L.laser(26.2, -5.4, 27.8, -5.2, 0, 2.0);
    L.crate(27, -7.2, 0);
    L.conveyor(31, -8, 40, -5.6, 2.2, 5, 0);
    L.box(36, -8, 40, -5.6, 3.6, 14, 'wall'); L.box(36, -5.6, 40, -4, -6, 14, 'wall');
    L.laser(36.4, -8, 39.6, -5.6, 2.2, 3.6);
    L.gate(36, -4, 40, 0, 0, 14, [2]);
    L.laser(36, -9.5, 40, 1.5, 14, 14.4);
    L.oil(40, -8, 48, -5.6, 0); L.floor(40, -5.6, 48, 0, 0); NET(L, 40, 48, 5.6);
    L.box(46, -8, 48, -5.6, -6, 1.5, 'wall');
    L.plate(45, -6.8, 2, 0);
    /* ---- 3. Chimney: the house is sealed and the switch for its door is inside. Bolt hops on Nut onto the sacks,
            she launches him onto the roof, he reels her up, and she goes down the chimney */
    L.floor(48, -8, 52.5, 0, 0); NET(L, 48, 52, 7);
    L.box(48.6, -8, 50.4, -6.2, -6, 1.8, 'shelf');
    L.box(52, -8, 52.5, 0, -6, R, 'wall'); L.box(52.5, -8, 61.5, 0, 4.2, R, 'shelf');
    L.floor(52.5, -8, 61.5, 0, 0); NET(L, 52, 61.5, R + 5.3);
    L.tube(59.8, -6.5, R, 58.6, -6.8, 0, { outA: [0, 1], outB: [0, 1] });
    L.button(56, -2.6, 3, 0);
    L.box(61.5, -8, 62.5, -4, -6, 14, 'wall'); L.box(61.5, -4, 62.5, 0, 4.2, 14, 'wall');
    L.gate(61.5, -4, 62.5, 0, 0, 4.2, [3]);
    L.laser(61.5, -9.5, 62.5, 1.5, 14, 14.4);
    /* golden cog: up the chimney breast inside the house. Too high for a jump */
    L.cog(54.2, 3.0, -7.2);
    /* ---- 4. Last Collection: the only way through the sorting wall is the tube, and its lid is only open while a plate is held.
            One robot holds the door from this side and the other is posted. Then the posted one holds it from the far side */
    L.floor(62.5, -8, 76, 0, 0); NET(L, 62.5, 76, 5.6);
    L.plate(66.8, -1.6, 4, 0);
    L.tube(73.5, -6.5, 0, 82.5, -6.5, 0, { outA: [-1, 0], outB: [1, 0] });
    L.gate(72.8, -7.2, 74.2, -5.8, 0, 0.8, [4, 5], { any: true });
    L.box(76, -8, 80, 0, -6, 14, 'wall'); L.laser(76, -9.5, 80, 1.5, 14, 14.4);
    L.floor(80, -8, 98, 0, 0); NET(L, 80, 98, 5.6);
    L.plate(81.5, -2, 5, 0);
    L.exit(88, -6.5, 97.5, -1.5, 0);
    /* ---- checkpoints, zones, decoration */
    L.checkpoint(19.5, -8, 24, 0, 21, -2.5, 21, -5);
    L.checkpoint(41, -5.6, 48, 0, 43, -2, 43, -4.5);
    L.checkpoint(62.5, -8, 65.5, 0, 64, -3, 64, -5.5);
    L.checkpoint(84, -8, 98, 0, 88, -3, 88, -5.5);
    L.zone('box', 0, -8, 8, 0);
    L.zone('slot', 24, -8, 31, 0);
    L.zone('chimney', 44, -8, 52, 0);
    L.zone('cog', 52.5, -8, 61.5, 0, -1, 4);
    L.zone('collect', 62.5, -8, 72, 0);
    L.zone('end', 84, -8, 98, 0);
    L.deco(10, -11, 11.5, -9.5, 0, 16, 'pipe'); L.deco(33, -11, 34.5, -9.5, 0, 16, 'pipe'); L.deco(56, -11, 57.5, -9.5, 0, 16, 'pipe'); L.deco(70, -11, 71.5, -9.5, 0, 16, 'pipe'); L.deco(93, -11, 94.5, -9.5, 0, 16, 'pipe');
    L.sign(3, 2.4, -7.9, 'PILLAR BOX');
    L.sign(29.5, 2.4, -7.9, 'LETTER SLOT');
    L.sign(50.5, 3.2, -7.9, 'CHIMNEY');
    L.sign(64.5, 2.4, -7.9, 'LAST COLLECTION');
    L.sign(91, 2.4, -7.9, 'POSTED');
  },
  zones: {
    box: { say: ['The queue. It runs backwards, it runs fast, and there is a laser above it marked no queue jumping. It is very much like the real post office.', 'The pillar box at the back is a tube. Whatever goes in the top comes out the other side of the queue. Bolt fits. Just about.'], hint: 'Nut launches Bolt onto the red pillar box at the back. He drops into the slot on top and pops out past the belt. Then he stands near the belt, faces Nut and holds X to reel her along, low under the laser. Pulled robots do not get carried by belts.' },
    slot: { say: ['The letter slot. The plate is behind that wall, and the only way through is the slot. It is exactly one parcel high. Not one robot high. One parcel.', 'The parcel is in the cage. Nut cannot shift it from out here. Bolt can. Bolt cannot throw. You see where this is going. Hopefully onto the belt.'], hint: 'Bolt faces the cage and holds X to pull the iron parcel out. He sets it down in front of the high belt and steps away. Nut stands in front of it and presses X to throw it up onto the belt. The belt posts it through the slot, it slides down the oil onto the plate and the wall opens. If it falls off, it goes back to its cage.' },
    chimney: { say: ['The house is sealed for Christmas. The switch for the door is inside. The traditional way in is the chimney. Nobody is quite sure why.', 'The roof is too high for a launch from the floor. From the sacks, it is not. Getting onto the sacks is a matter of standing on each other, briefly, in a professional manner.'], hint: 'Nut stands by the sacks and Bolt hops on her head and onto them. Nut launches Bolt from the sacks onto the roof. He stands at the front edge of the roof and reels Nut up. Nut drops down the chimney, walks to the switch inside and presses X. The door opens. Bolt follows down the chimney.' },
    cog: { say: ['There is a golden cog up on the chimney breast. Somebody hung it there like a stocking. Too high to jump for. Not too high for a hop off a friend.'], hint: 'Optional golden cog. Inside the house, Nut stands under the cog and Bolt hops onto her head and jumps up to it.' },
    collect: { say: ['The last collection. The only way through the sorting wall is the tube, and the lid only opens while somebody stands on a plate. One plate this side, one plate that side.', 'Somebody holds the door. Somebody else goes through. Then they hold it from the other side. It is called manners. We used to have them.'], hint: 'One robot stands on the teal plate. The lid over the hatch by the wall sinks, and the other robot walks onto the hatch and is posted through the wall. On the far side, they stand on the lime plate, which keeps the lid open, and the first robot walks over to the hatch and follows.' },
    end: { say: ['Everything is posted. The queue has gone home. I have been asked to tell you that the pillar box would like its robot back. I have told it no.'] },
  },
  outro: 'Shift twenty nine complete. Everything made the last post. Several things made it twice. One of them was Bolt.',
};
