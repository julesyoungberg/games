// Shift 16: Overhead Rail. Introduces moving anchor rings (L.anchor with a path).
const BW = (L, x0, x1, top, h = 3) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');

export default {
  name: 'Overhead Rail', sub: 'Shift 16. The rings move now. Hold on.', theme: 1,
  intro: [
    'Shift sixteen. Overhead Rail. The anchor rings have been put on tracks. They go back and forth all day. Like interns.',
    'Bolt, hang on and enjoy the view. Nut, you will be reeled in later. Like a fish. A valued fish.',
  ],
  build(L) {
    L.start(2.5, -3, 2.5, -5.5);
    L.cog(4, 4.3, -6.8);
    /* ---- 1. First Ride: ride the ring across the chasm, then reel Nut in */
    L.floor(0, -8, 10, 0, 0); BW(L, 0, 10, 0);
    L.anchor(11, 4.2, -4, { path: [[0, 0, 0], [9.5, 0, 0]], speed: 2.2 });
    L.floor(19, -8, 30, 0, 0); BW(L, 19, 30, 0);
    /* ---- 2. Drop Zone: drop onto the pillar plate, the bridge appears for Nut, catch the ring again */
    L.floor(36.4, -5.2, 37.6, -2.8, 0, 'shelf');
    L.plate(37, -4, 1, 0, 0.6);
    L.bridge(30, -7.6, 44, -5.2, 0, [1]); BW(L, 30, 44, 0);
    L.anchor(31, 4.4, -4, { path: [[0, 0, 0], [14.5, 0, 0]], speed: 2.5 });
    L.floor(44, -8, 57, 0, 0); BW(L, 44, 57, 0);
    /* ---- 3. High Line: Nut launches Bolt to catch a ring that only passes high */
    L.anchor(54, 12, -4, { path: [[0, 0, 0], [9, 0, 0]], speed: 2 });
    L.floor(57, -8, 70, 0, 8); BW(L, 57, 70, 8);
    /* ---- 4. Express: Nut takes the tube down and switches off the laser; Bolt rides past it */
    L.tube(68.5, -6.5, 8, 76, -6.5, 2, { outB: [1, 0] });
    L.floor(75, -8, 81, 0, 2); BW(L, 75, 81, 2);
    L.button(80.3, -7.3, 2, 2);
    L.laser(83, -8, 83.4, 0, 6.5, 13, [2]);
    L.anchor(71, 11.5, -4, { path: [[0, 0, 0], [17, 0, 0]], speed: 2.5 });
    L.floor(87, -8, 95, 0, 8);
    /* ---- 5. Last Stop: plate drops the spring cage; bounce, catch the ring, drop before the laser */
    L.plate(91.5, -6.8, 3, 8);
    L.spring(95, -8, 97, 0, 8, 18);
    L.laser(95, -8, 97, 0, 8.2, 9.8, [3]);
    L.floor(97, -8, 98.5, 0, 8); BW(L, 87, 98.5, 8);
    L.anchor(95.5, 20, -4, { path: [[0, 0, 0], [9, 0, 0]], speed: 1.5 });
    L.laser(102.5, -8, 102.9, 0, 17.2, 21.5);
    L.floor(98.5, -8, 108, 0, 14.5); BW(L, 98.5, 108, 14.5);
    L.exit(103.5, -6.5, 107.5, -1.5, 14.5);
    /* ---- checkpoints, zones, decoration */
    L.checkpoint(20, -8, 30, 0, 23, -3, 23, -5.5);
    L.checkpoint(44.5, -8, 57, 0, 48, -3, 48, -5.5);
    L.checkpoint(58, -8, 67.5, 0, 62, -3, 62, -5.5);
    L.checkpoint(87.5, -8, 94.5, 0, 89, -3, 89, -5.5);
    L.checkpoint(99, -8, 108, 0, 100.5, -3, 100.5, -5.5);
    L.zone('ride', 5, -8, 10, 0);
    L.zone('drop', 24, -8, 30, 0);
    L.zone('high', 48, -8, 57, 0);
    L.zone('express', 61, -8, 70, 0, 6, 50);
    L.zone('last', 87.5, -8, 94.5, 0, 6, 50);
    L.zone('end', 99, -8, 108, 0, 13, 50);
    L.deco(6, -11, 7.5, -9.5, 0, 10, 'pipe'); L.deco(50, -11, 51.5, -9.5, 0, 16, 'pipe'); L.deco(104, -11, 105.5, -9.5, 14.5, 24, 'pipe');
    L.sign(4, 1.6, -7.9, 'OVERHEAD RAIL');
    L.sign(91, 9.6, -7.9, 'LAST STOP');
  },
  zones: {
    ride: { say: ['The ring is on a rail. It goes over there, then it comes back. It is very committed.', 'Bolt, grab it as it passes. Let go over the far side. Then fetch Nut. With your head.'], hint: 'Bolt holds X at the passing ring and rides it over the chasm. Let go above the far floor. Then Bolt pulls Nut across.' },
    drop: { say: ['This chasm is too wide to reel anyone across. There is a pillar in the middle with a plate on it. The plate grows a bridge.', 'Bolt, let go over the pillar. Not before. Not after. Exactly then. No pressure.'], hint: 'Bolt rides the ring and lets go over the pillar to land on the teal plate. The bridge appears and Nut walks across. Then Bolt grabs the ring again on its way back.' },
    high: { say: ['That ring runs very high. Too high to reach from the floor. It was installed by a very tall contractor.'], hint: 'Nut launches Bolt straight up. Bolt grabs the high ring in mid air and rides it to the ledge. Then Bolt pulls Nut up.' },
    express: { say: ['The express ring goes straight through a laser. That is a design flaw. The switch for it is down there, past the tube.', 'Nut, the tube is for you. It is fun. I am told.'], hint: 'Nut steps into the tube hatch and pops out on the low platform. Nut flips the orange switch: the laser goes off. Bolt rides the ring to the far ledge and pulls Nut up.' },
    last: { say: ['Last stop. The spring is in a laser cage. The plate opens the cage. The ring above runs into another laser, so get off early. Like a bus.'], hint: 'Nut stands on the pink plate to switch off the cage. Bolt bounces on the spring and grabs the high ring. Let go over the platform before the laser. Then Bolt pulls Nut up.' },
    end: { say: ['Everyone off the rail. Please take all your belongings. Including each other.'] },
  },
  outro: 'Shift sixteen complete. The rings will keep going back and forth all night. Somebody should tell them the shift is over. Not me.',
};
