// Shift 27 (played as Shift 25): Topping Out. A building site. Moving rings carry Bolt, and Bolt carries Nut on his head:
// she flips a switch from up there, steps off into a duct he cannot fit in, changes rings at an island and rides the hoist to the top.
// Wall magnets are Bolt's own way up: over the duct block once Nut has switched off its cage, and the last metre of the hoist.
// Back walls are 14 m tall beside the high rings and the hoist, so nobody can hop off a ring onto one and walk past a puzzle.
const BW = (L, x0, x1, top, h = 6) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');
const T = 12.5; // top floor

export default {
  name: 'Topping Out', sub: 'Shift 25. The building is finished. Someone has to carry the flag to the top.', theme: 6,
  intro: [
    'Shift twenty five. Topping Out. When a building is finished, somebody carries a little flag up to the very top. It is a tradition.',
    'This year that somebody is you. The building has no stairs yet. It does have rings. And one of you has a very flat head.',
  ],
  build(L) {
    L.start(2.5, -3, 2.5, -5.5);
    /* ---- 1. Window Cleaning: the ring climbs the facade. Nut rides on Bolt's head and flips the high switch at the top */
    L.floor(0, -8, 38, 0, 0); BW(L, 0, 38, 0, 14);
    L.anchor(8, 1.6, -4.6, { path: [[0, 0, 0], [3, 0, 0], [9, 6, 0], [16, 7.8, 0]], speed: 3 });
    L.box(23.3, -8, 24.7, -6.2, 0, 8.8, 'shelf'); L.button(24, -6.9, 1, 8.8); L.laser(23.1, -8, 24.9, -6, 8.8, 13);
    /* golden cog: above the top of the climb. Nut jumps off Bolt's head up there */
    L.cog(24, 11, -4.6);
    L.gate(28.5, -8, 29, 0, 0, 14, [1]);
    /* ---- 2. Air Duct: the ring stops at a duct 1 m tall. Nut fits. Bolt does not. Nut crawls through and switches off the cage on Bolt's magnet */
    L.anchor(31.5, 1.6, -4.5, { path: [[0, 0, 0], [2, 0, 0], [6.1, 3.45, 0]], speed: 2.5 });
    L.box(38, -8, 46, 0, -6, 4.6, 'floor');
    L.box(38, -8, 46, -5.5, 4.6, 5.6, 'wall'); L.box(38, -3.5, 46, 0, 4.6, 5.6, 'wall');
    L.box(38, -8, 46, 0, 5.6, 8, 'floor');
    L.magnet(38, 8, -1.2, [-1, 0]); L.laser(36.7, -2.6, 38, 0, 5.8, 9, [3]);
    BW(L, 38, 46, 8, 6);
    L.floor(46, -8, 54, 0, 0); BW(L, 46, 75, 0, 6);
    L.button(47.6, -7, 3, 0);
    /* ---- 3. Interchange: two rings over a laser floor. The switch on the island turns off the curtain on the second line */
    L.floor(54, -8, 62, 0, 0); L.laser(54, -8, 62, 0, -1, 0.95);
    L.anchor(50.8, 1.6, -4, { path: [[0, 0, 0], [1.5, 0, 0], [2.6, 1.2, 0], [11, 1.2, 0]], speed: 2.5 });
    L.floor(62, -8, 66.5, 0, 0);
    L.button(64.2, -7, 4, 0);
    L.anchor(63.6, 1.6, -4, { path: [[0, 0, 0], [1, 0, 0], [2.1, 1.2, 0], [12, 1.2, 0]], speed: 2.5 });
    L.floor(66.5, -8, 75, 0, 0); L.laser(66.5, -8, 75, 0, -1, 0.95);
    L.laser(70.2, -8, 70.6, 0, -1, 12, [4]);
    /* ---- 4. Goods Hoist: the ring runs straight up the tower. Far too high to reel anybody. Nut rides and jumps off the top; Bolt takes the magnet */
    L.floor(75, -8, 84, 0, 0); BW(L, 75, 84, 0, 16);
    L.anchor(81, 1.6, -4, { path: [[0, 0, 0], [2.4, 0, 0], [2.4, 10.35, 0]], speed: 2.5 });
    L.box(84, -8, 98, 0, -6, T, 'floor'); BW(L, 84, 98, T, 6);
    L.magnet(84, T, -4, [-1, 0]);
    L.exit(88, -6.5, 97.5, -1.5, T);
    /* ---- checkpoints, zones, decoration */
    L.checkpoint(29.2, -8, 31, 0, 30.1, -1.5, 30.1, -6.6);
    L.checkpoint(46.5, -8, 51, 0, 48.5, -2.5, 48.5, -5);
    L.checkpoint(75.5, -8, 79.5, 0, 77.5, -2.5, 77.5, -5.5);
    L.checkpoint(86, -8, 98, 0, 90, -3, 90, -5.5);
    L.zone('window', 4.5, -8, 8, 0);
    L.zone('cog', 20, -8, 28, 0, 9, 50);
    L.zone('duct', 29.2, -8, 31.5, 0);
    L.zone('inside', 39, -5.5, 45, -3.5, 4, 6);
    L.zone('inter', 49.5, -8, 52, 0);
    L.zone('hoist', 75.5, -8, 79.5, 0);
    L.zone('end', 86, -8, 98, 0, T - 1, 50);
    L.deco(5, -11, 6.5, -9.5, 0, 16, 'pipe'); L.deco(41, -11, 42.5, -9.5, 0, 16, 'pipe'); L.deco(64, -11, 65.5, -9.5, 0, 9, 'pipe'); L.deco(79, -11, 80.5, -9.5, 0, 18, 'pipe'); L.deco(94, -11, 95.5, -9.5, T, T + 8, 'pipe');
    L.sign(4, 2.2, -7.9, 'WINDOW CLEANING');
    L.sign(34, 2.2, -7.9, 'AIR DUCT');
    L.sign(52.5, 2.2, -7.9, 'INTERCHANGE');
    L.sign(77.5, 2.2, -7.9, 'GOODS HOIST');
    L.sign(91, T + 2.2, -7.9, 'TOP FLOOR');
  },
  zones: {
    window: { say: ['Window cleaning. The ring climbs the front of the building. The switch for the gate is right at the top, behind lasers, being dusty.', 'Bolt holds the ring. Nut holds on to Bolt. Standing on a colleague is allowed today. I have signed a form.', 'Nut, if you push while standing on Bolt, Bolt goes too. Hop first. Then push. Then apologise.'], hint: 'Bolt grabs the ring (hold X) while it is low. Nut jumps onto his head. Ride to the top. Nut hops straight up and presses X in the air to flip the teal switch on the back wall. The gate at the end opens. Drop off and walk through.' },
    cog: { say: ['There is a golden cog right at the top of the climb. Even higher than the window cleaner. Somebody must have thrown it.'], hint: 'Optional golden cog. Ride the ring all the way to the top with Nut on Bolt\'s head. While it waits at the top, Nut jumps straight up.' },
    duct: { say: ['Bolt goes over the block by the wall magnet. The magnet is in a laser cage. The switch for the cage is on the other side. The only way to the other side is the air duct.', 'The air duct is one metre tall. Nut is less than one metre tall. Bolt is more than one metre tall. Bolt, this is not a comment on your work.'], hint: 'Bolt grabs the ring while it is low and Nut jumps onto his head. At the top the ring stops at the duct. Nut walks off his head into the duct, crawls through and drops out on the far side. She pushes the pink switch and the cage on the wall magnet turns off. Bolt holds X at the magnet, hops up with A and walks over the top.' },
    inside: { say: ['You are in the duct. Please do not knock on anything. People downstairs think it is ghosts.'] },
    inter: { say: ['The interchange. Two rings, one island. The second line has a laser curtain. The switch for it is on the island.', 'The floor is lasered, so nobody gets reeled across. Please change rings at the island. Mind the gap. The gap is lasers.'], hint: 'Bolt grabs the first ring and Nut jumps onto his head. Get off on the island. Nut pushes the lime switch to turn off the curtain. Bolt grabs the second ring while it is low and Nut jumps back onto his head. Ride across together.' },
    hoist: { say: ['The goods hoist. It goes nearly to the top floor. Bolt can ride it. Nut cannot hold on to anything. Nut has no magnet.', 'From up there the floor is much too far away to reel anyone up. So nobody gets left behind. Get on. Bolt, the last metre is a magnet. It always is.'], hint: 'Bolt grabs the hoist ring while it is low and Nut jumps onto his head. Ride all the way up. At the top Nut jumps up onto the roof and walks away from the edge. Bolt lets go of X, grabs the wall magnet just above him and hops up with A.' },
    end: { say: ['You made it to the top. Please place the little flag. There is no little flag. It is on back order until spring. Please just stand there proudly.'] },
  },
  outro: 'Shift twenty five complete. The building is topped out. Everybody clapped. Mostly the wind.',
};
