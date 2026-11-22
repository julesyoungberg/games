// Shift 30 (played as Shift 28): Outlook Unsettled. The weather station on the factory roof: moving rings, a vent, springs.
// A lightning net (a laser ceiling at 5.6 m) covers the whole roof and a safety net (lasers just below roof level) fills every gap,
// so nobody stands on Nut to climb, and every gap is wider than two launches. Rings run just under the net, too high for a passenger.
const BW = (L, x0, x1, top, h = 8) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');
const NET = (L, x0, x1) => L.laser(x0, -8, x1, 0, -1, -0.05);
const RY = 5.2; // ring height

export default {
  name: 'Outlook Unsettled', sub: 'Shift 28. The weather station on the roof. Changeable, with a chance of robots.', theme: 3,
  intro: [
    'Shift twenty eight. Outlook Unsettled. The weather station on the roof needs its end of season reading. Somebody has to go and read it.',
    'There is a lightning net over the whole roof, just above head height. Please do not stand on each other. It is not that kind of weather.',
  ],
  build(L) {
    L.start(3, -2.5, 3, -5.5);
    BW(L, 0, 100, 0);
    L.laser(0, -8, 100, 0, 5.6, 6.1); // the lightning net
    /* ---- 1. Wind Vane: the switch for the curtain is on a pole in the middle of the gap. Nobody can reach it from either side.
            Bolt rides the ring over; when he reels Nut across, she flips the switch on the way past */
    L.floor(0, -8, 12, 0, 0);
    NET(L, 12, 21.5);
    L.anchor(11, RY, -3.5, { path: [[0, 0, 0], [12, 0, 0]], speed: 2.5 });
    L.box(16.55, -6.15, 17.25, -5.45, -6, 0, 'shelf'); L.button(16.9, -5.8, 1, 0);
    L.floor(21.5, -8, 35, 0, 0);
    L.laser(28, -8, 28.4, 0, 0, 5.6, [1]);
    /* ---- 2. Updraft: Bolt rides over and stands on the orange plate. That runs the vent and opens the spring cage.
            Nut bounces off the spring into the updraft, and Bolt reels her out of it */
    L.spring(35, -5, 37, -3, 0, 14);
    L.laser(35, -5.2, 37, -2.8, 0, 2.4, [2]);
    NET(L, 35, 49.5);
    L.fan(38.5, -6, 42.5, -2, 0, 2.6, [2]);
    L.laser(38.5, -6, 42.5, -2, 0, 1);
    L.anchor(34, RY, -6.6, { path: [[0, 0, 0], [16.5, 0, 0]], speed: 2.5 });
    L.floor(49.5, -8, 62.4, 0, 0);
    L.plate(50.8, -4, 2, 0);
    /* golden cog: over the back of the roof. Nut launches Bolt */
    L.cog(56.5, 4.4, -6.8);
    /* ---- 3. Rain Gauge: the edge of the roof is fenced off at ankle and knee height, so a reel from the floor goes through it.
            Bolt rides up to the gauge platform. Nut bounces on the spring behind the fence; he catches her at the top */
    L.spring(60.8, -5, 62, -3, 0, 14);
    L.laser(62, -8, 62.4, 0, -1, 2.2);
    NET(L, 62.4, 70.6);
    L.anchor(60, RY, -6.6, { path: [[0, 0, 0], [13, 0, 0]], speed: 2.5 });
    L.box(70.6, -8, 74, 0, -6, 3, 'floor');
    L.floor(74, -8, 84, 0, 0);
    /* ---- 4. Lightning Rod: the exit latches open when the pink plate on the rod and the lime plate on the roof are pressed together.
            Bolt presses it with his feet as the ring carries him over (or drops onto the rod and waits there for the ring to come back) */
    L.plate(81, -2, 4, 0);
    NET(L, 84, 93.5);
    L.box(88.2, -7.4, 89.4, -6.2, -6, 3.4, 'shelf'); L.plate(88.8, -6.8, 3, 3.4, 0.6);
    L.anchor(83, RY, -6.8, { path: [[0, 0, 0], [11.4, 0, 0]], speed: 2.5 });
    L.floor(93.5, -8, 100, 0, 0);
    L.gate(95.6, -8, 96, 0, 0, 8, [3, 4], { latch: true });
    L.exit(96.5, -6.5, 99.8, -1.5, 0);
    /* ---- checkpoints, zones, decoration */
    L.checkpoint(29, -8, 34.5, 0, 31, -2.5, 31, -5.5);
    L.checkpoint(53.5, -8, 59, 0, 55, -2.5, 55, -5.5);
    L.checkpoint(75, -8, 80, 0, 77, -2.5, 77, -5.5);
    L.checkpoint(96.5, -8, 100, 0, 98, -3, 98, -5.5);
    L.zone('vane', 4, -8, 9, 0);
    L.zone('updraft', 29, -8, 34, 0);
    L.zone('cog', 54.5, -8, 58.5, -5.6, 2, 50);
    L.zone('gauge', 57, -8, 59.5, 0);
    L.zone('rod', 75, -8, 80, 0);
    L.zone('end', 96.5, -8, 100, 0);
    L.deco(6, -11, 7.5, -9.5, 0, 12, 'pipe'); L.deco(26, -11, 27.5, -9.5, 0, 12, 'pipe'); L.deco(46, -11, 47.5, -9.5, -6, 12, 'pipe'); L.deco(66, -11, 67.5, -9.5, -6, 12, 'pipe'); L.deco(90, -11, 91.5, -9.5, -6, 12, 'pipe');
    L.sign(6, 2.4, -7.9, 'WIND VANE');
    L.sign(31, 2.4, -7.9, 'UPDRAFT');
    L.sign(57, 2.4, -7.9, 'RAIN GAUGE');
    L.sign(78, 2.4, -7.9, 'LIGHTNING ROD');
    L.sign(98, 2.4, -7.9, 'WEATHER STATION');
  },
  zones: {
    vane: { say: ['The wind vane. The curtain on the next roof switches off from that switch on the pole. The pole is in the middle of the gap. Nobody designed this. It just happened.', 'Bolt, the ring will take you over. Nut, you cannot reach the pole from here or from there. You can reach it on the way. Press once. Twice is off again.'], hint: 'Bolt grabs the ring (hold X) and rides it over the gap, and drops onto the next roof. He faces Nut across the gap and holds X to reel her over. As she flies past the pole, Nut presses X once to flip the teal switch. The curtain switches off.' },
    updraft: { say: ['The updraft. The vent in the gap only runs while somebody stands on the orange plate on the far roof. The same plate opens the spring cage over here.', 'The vent grille is lasered, so please float above it. Bolt has the ring. Nut has the spring. Bolt, please do not wander off the plate while she is up there.'], hint: 'Bolt rides the ring across and stands on the orange plate. The spring cage opens and the vent starts. Nut runs onto the spring and keeps going forward: she lands in the updraft and floats. Bolt stays on the plate, faces her and holds X to reel her over.' },
    cog: { say: ['A golden cog, up by the lightning net. Please collect it before the lightning does.'], hint: 'Optional golden cog. Bolt stands under the cog, Nut stands right next to him and presses X.' },
    gauge: { say: ['The rain gauge. The edge of this roof is fenced off with lasers up to the knee. So nobody gets reeled off the floor. A reel from up high goes over the top.', 'Bolt, the ring goes up to the gauge platform. Nut, the spring is behind the fence. Step on it from the side and bounce. Bolt, catch her at the top.'], hint: 'Bolt rides the ring over the gap and drops onto the high platform. Nut steps onto the spring behind the fence from the side, not toward the fence, and bounces. Bolt faces her and holds X just as she reaches the top of a bounce: she flies over the fence to him.' },
    rod: { say: ['The lightning rod. The exit opens when the pink plate on top of the rod and the lime plate on this roof are pressed at the same time. Then it stays open.', 'There is no way out to the rod on foot. But the ring goes right over it, and Bolt has feet. Nut, please stand on the lime plate and look patient.'], hint: 'Nut stands on the lime plate. Bolt grabs the ring and rides it over the rod: his feet press the pink plate on the way past and the exit latches open. He drops onto the far roof and reels Nut across.' },
    end: { say: ['The weather station. Today\'s reading is: unsettled, with robots. I will write that down. In pencil. It changes.'] },
  },
  outro: 'Shift twenty eight complete. The weather station has its last reading of the season. It says it is time to go home. For once I agree with it.',
};
