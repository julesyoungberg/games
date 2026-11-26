// Shift 33 (played as Shift 31): Fire Drill. Three rooms, each a quick evacuation with one twist.
// 1. Muster point: the fan only runs while someone holds the plate. Bolt rides it up; Nut gets reeled up after.
// 2. Stairwell: an alarm laser blinks across the ledge, then two rings over the gap. Bolt swings, then reels Nut over.
// 3. Fire door: a belt carries the crate off the edge; Bolt catches it and carries it past a blinking alarm laser onto the door plate.
const BW = (L, x0, x1, top, h = 10) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');
const Y = 5; // the upper floor

export default {
  name: 'Fire Drill', sub: 'Shift 31. This is only a drill. Please evacuate as if it were not.', theme: 5,
  intro: [
    'Shift thirty one. Fire Drill. In a moment the alarm will sound, and you will leave the building in a calm and orderly fashion.',
    'The alarm is the blinking red laser. Management wanted it to be memorable. It is very memorable. Please do not touch it.',
  ],
  build(L) {
    L.start(2.5, -3, 2.5, -5.5);
    /* ---- 1. Muster point: plate runs the fan */
    L.floor(0, -8, 14, 0, 0); BW(L, 0, 17, 0);
    L.plate(8, -6.3, 1, 0);
    L.fan(14, -6, 17, -2, 0, Y + 1.5, [1]);
    L.floor(14, -8, 17, -6, 0); L.floor(14, -2, 17, 0, 0);
    L.floor(17, -8, 30, 0, Y); BW(L, 17, 30, Y);
    L.cog(21, Y + 3.6, -7); // golden cog: high over the back of the stairwell. Nut launches Bolt up to it.
    /* ---- 2. Stairwell: blinking alarm laser, then two rings */
    L.laser(24, -8, 24.3, 0, Y, Y + 6, null, [1.4, 1.8, 0]);
    L.anchor(33.5, Y + 4, -4); L.anchor(40, Y + 4, -4);
    /* ---- 3. Fire door: belt carries the crate off the front, alarm laser, plate opens the door */
    L.floor(39, -8, 42, 0, Y); L.floor(46, -8, 66, 0, Y); BW(L, 39, 66, Y);
    L.conveyor(42, -8, 46, 0, Y, 0, 2.5);
    L.crate(44, -7.3, Y);
    L.laser(49.5, -8, 49.8, 0, Y, Y + 6, null, [1.6, 1.6, 0.8]);
    L.plate(53.5, -7, 3, Y);
    L.gate(56, -8, 57, 0, Y, Y + 10, [3]);
    L.exit(60, -6.5, 64, -1.5, Y);
    /* ---- checkpoints, zones, decoration */
    L.checkpoint(17.5, -8, 23, 0, 18.5, -2.5, 18.5, -5);
    L.checkpoint(39.5, -8, 42, 0, 40.5, -2.5, 40.5, -5);
    L.checkpoint(57.5, -8, 66, 0, 58.5, -2.5, 58.5, -5);
    L.zone('muster', 4, -8, 13, 0);
    L.zone('stairs', 17.5, -8, 23, 0, Y - 1, 50);
    L.zone('rings', 25, -8, 30, 0, Y - 1, 50);
    L.zone('door', 39.5, -8, 42, 0, Y - 1, 50);
    L.zone('end', 57.5, -8, 66, 0, Y - 1, 50);
    L.deco(10, -11, 11.5, -9.5, 0, 14, 'pipe'); L.deco(36, -11, 37.5, -9.5, Y, 20, 'pipe'); L.deco(62, -11, 63.5, -9.5, Y, 20, 'pipe');
    L.sign(3, 2.4, -7.9, 'MUSTER POINT');
    L.sign(20, Y + 2.4, -7.9, 'STAIRWELL');
    L.sign(56.5, Y + 4, -7.9, 'FIRE DOOR');
  },
  zones: {
    muster: { say: ['The evacuation lift is a fan. It only runs while somebody stands on the plate. The fire officer was very clear that this is a design decision.', 'One of you holds the plate. The other one rides. Then the one at the top fetches the one at the bottom. Teamwork. In a hurry.'], hint: 'Nut stands on the plate and the fan starts. Bolt walks into the fan and floats up onto the ledge. Then Bolt faces Nut and holds X to reel her up.' },
    stairs: { say: ['The stairwell. The alarm laser blinks. Walk through during the quiet part. Like a library, but with more lasers.', 'There is a golden cog up by the back wall. Too high to jump to. Not too high to be thrown to.'], hint: 'Wait for the red laser to switch off, then walk through together. Optional golden cog: Bolt stands by the back wall under it and Nut launches him straight up.' },
    rings: { say: ['The stairs have been removed for the drill. Nobody told me why. Bolt, you know what rings are for.'], hint: 'Bolt holds X toward the near ring, then the far ring, and drops onto the floor. Then he faces Nut and holds X to reel her across.' },
    door: { say: ['The fire door opens when the plate is weighed down. The weight is on a belt, heading out of the building. Even the crate is evacuating. Bolt, catch it.', 'And the alarm laser is in the way. Carrying a crate does not make you laser proof. I asked.'], hint: 'Bolt waits by the belt and holds X when the crate comes past. He carries it to the laser, waits for it to switch off, then sets the crate on the plate. The fire door opens.' },
    end: { say: ['Everybody is out. Evacuation time: acceptable. Calm and orderly: debatable. The fire officer has given you a sticker.'] },
  },
  outro: 'Shift thirty one complete. The drill is over. Please go back inside. Yes, through the fire door. It is fine. It was a drill.',
};
