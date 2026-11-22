// Shift 28 (played as Shift 26): Clearance. A slippery warehouse being cleared out for the end of the season.
// Springs, oil floors, iron crates and plates: crates shove crates, a bouncing crate gets thrown from the top of its bounce,
// crates carry robots over laser floors, and a crate on a spring is a trampoline.
// Back walls are tall (8 to 14 m) wherever a spring or a launch could put someone on top of one.
const BW = (L, x0, x1, top, h = 6) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');
const D = 5.2; // top of the goods-out dock

export default {
  name: 'Clearance', sub: 'Shift 26. Everything must go. Mostly sideways.', theme: 9,
  intro: [
    'Shift twenty six. Clearance. The season is nearly over, so the warehouse is being cleared out before the winter.',
    'Facilities oiled the floors to help things move faster. Things are moving faster. Mostly sideways. Please hold on to something heavy.',
  ],
  build(L) {
    L.start(2.5, -1.5, 2.5, -3.5);
    /* ---- 1. Skittle Alley: a wooden crate sits on oil in a lasered alley. Only another crate can reach it.
            Bolt snatches the iron crate off the caged spring; Nut throws it down the alley; it knocks the wooden one onto the plate */
    L.floor(0, -8, 12, 0, 0); L.floor(12, -4.4, 27, 0, 0); BW(L, 0, 27, 0, 8);
    L.box(3.6, -8, 4, -5.6, -6, 8, 'wall'); L.box(6, -8, 6.4, -5.6, -6, 8, 'wall');
    L.spring(4, -8, 6, -5.6, 0, 14);
    L.laser(4, -5.6, 6, -5.3, 0, 5);
    L.crate(5, -6.8, 0.3);
    L.oil(12, -8, 24, -4.4, 0);
    L.box(12, -4.4, 24, -4, 0, 2.2, 'wall'); L.box(24, -8, 24.6, -4, -6, 2.2, 'wall'); L.floor(24.6, -8, 27, -4.4, 0);
    L.laser(12, -8, 24, -4.4, 0, 3);
    L.crate(18, -6.2, 0, { wood: true });
    L.plate(23.1, -6.2, 1, 0);
    L.gate(26.4, -8, 26.9, 0, 0, 8, [1]);
    /* ---- 2. High Bay: the plate is on a tall caged column. Bolt pulls the crate off a high shelf and drops it on the spring;
            Nut throws it from the top of its bounce. Nut cannot get near the shelf, and a throw from the mezzanine falls short */
    L.floor(27, -8, 31, 0, 0); BW(L, 27, 48, 0, 14);
    L.box(27.5, -8, 29, -6.6, -6, 6, 'shelf'); L.crate(28.25, -7.3, 6);
    L.box(31.5, -8, 35, -2, -6, 4.5, 'floor'); L.floor(31, -2, 35, 0, 0); L.floor(31, -8, 31.5, -2, 0);
    L.spring(35, -6, 37, -2, 0, 21);
    L.floor(35, -8, 37, -6, 0); L.floor(35, -2, 37, 0, 0); L.floor(37, -8, 48, 0, 0);
    L.box(38.6, -5.6, 41.2, -2.4, -6, 8.8, 'shelf'); L.plate(39.9, -4, 2, 8.8);
    L.laser(38.4, -5.8, 41.4, -2.2, 8.8, 13);
    /* golden cog: high over the spring. Nut launches Bolt off the top of his bounce */
    L.cog(36, 11.2, -4);
    L.gate(45, -8, 45.5, 0, 0, 12, [2]);
    /* ---- 3. Pallet Run: the oil floor is lasered at ankle height and the ceiling at head height.
            Nut shoves Bolt across on the crate; from the far dock Bolt reels Nut over the lasers, as long as she starts up high */
    L.floor(48, -5, 52, -1.6, 0); L.floor(51.5, -1.6, 52, 0, 0); L.box(48, -8, 52, -5, -6, 1.2, 'floor'); L.box(48, -1.6, 51.5, 0, -6, 1.2, 'floor'); BW(L, 48, 61, 0, 8);
    L.oil(52, -8, 61, 0, 0);
    L.laser(53.4, -8, 59.6, 0, -1, 0.95);
    L.laser(52, -8, 61, 0, 2.8, 12);
    L.crate(52.65, -4.9, 0);
    L.box(61, -8, 66, 0, -6, 1.2, 'floor'); BW(L, 61, 66, 1.2, 8);
    /* ---- 4. Goods Out: Bolt shoves Nut on the crate across the oil onto the spring. At the top of a bounce she jumps onto the dock.
            Her switch up there brings the lift down for Bolt */
    L.floor(66, -8, 70, 0, 0); BW(L, 66, 80, 0, 10);
    L.oil(70, -8, 78, 0, 0);
    L.laser(71.5, -8, 80, 0, -1, 0.95);
    L.box(68.6, -5.6, 70, -4.2, -6, 1.2, 'floor'); L.crate(70.65, -4, 0);
    L.spring(78, -5.5, 80, -2.5, -0.3, 16);
    L.floor(78, -8, 80, -5.5, 0); L.floor(78, -2.5, 80, 0, 0);
    L.box(80, -8, 98, 0, -6, D, 'floor'); BW(L, 80, 98, D, 6);
    L.button(82.5, -7, 4, D);
    L.mover(66.3, -7.8, 68.7, -5.6, 0.3, [[0, 0, 0], [0, D - 0.3, 0], [11.3, D - 0.3, 0]], 3, [4], 0.6);
    L.exit(88, -6.5, 97.5, -1.5, D);
    /* ---- checkpoints, zones, decoration */
    L.checkpoint(27.2, -6.4, 30.8, 0, 28.5, -2.5, 29.8, -4.5);
    L.checkpoint(46, -8, 48, 0, 47, -2.5, 47, -5.5);
    L.checkpoint(62, -8, 66, 0, 63.5, -2.5, 63.5, -5.5);
    L.checkpoint(84, -8, 98, 0, 88, -3, 88, -5.5);
    L.zone('alley', 6.5, -8, 10, 0);
    L.zone('bay', 27.5, -8, 31, 0);
    L.zone('cog', 37, -8, 40, 0);
    L.zone('pallet', 48, -8, 51.5, 0);
    L.zone('out', 66, -8, 69.5, 0);
    L.zone('end', 84, -8, 98, 0, D - 1, 50);
    L.deco(9, -11, 10.5, -9.5, 0, 12, 'pipe'); L.deco(33, -11, 34.5, -9.5, 0, 16, 'pipe'); L.deco(56, -11, 57.5, -9.5, 0, 12, 'pipe'); L.deco(73, -11, 74.5, -9.5, 0, 12, 'pipe'); L.deco(93, -11, 94.5, -9.5, D, D + 10, 'pipe');
    L.sign(8.5, 1.6, -7.9, 'SKITTLE ALLEY');
    L.sign(38.5, 2.2, -7.9, 'HIGH BAY');
    L.sign(50, 2.6, -7.9, 'PALLET RUN');
    L.sign(69, 2.2, -7.9, 'GOODS OUT');
    L.sign(90, D + 2.2, -7.9, 'CLEARANCE');
  },
  zones: {
    alley: { say: ['Skittle alley. The wooden crate goes on the plate at the far end. The alley is lasered, so no robots. And Bolt cannot pull wood.', 'A crate sliding on oil shoves anything in its way, and passes the slide on. The iron crate is in the cage, bouncing. It has been bouncing since March.'], hint: 'Bolt faces the spring cage and holds X to snatch the bouncing iron crate. He sets it down in front of the alley, lined up with it, and steps away. Nut stands right behind it and presses X. It lands on the oil, slides into the wooden crate and knocks it onto the teal plate. If it stops short, Bolt can pull the iron crate back out and you can go again.' },
    bay: { say: ['The high bay. The plate is on top of that tall column, in a laser cage. Crates get in. Robots do not. Nobody can throw that high from the floor.', 'A crate on a spring goes up and down forever. At the top of its bounce it is very high indeed. Then somebody gives it a push. Just a thought.'], hint: 'Walk round to the spring and bounce up onto the mezzanine, steering toward it at the top (or Bolt goes first and reels Nut up). From the mezzanine Bolt pulls the iron crate off the high shelf. He stands still at the edge and lets the crate drop onto the spring, then steps back. Nut stands at the edge and presses X when the crate is at the top of a bounce. It flies onto the orange plate on the column and the gate opens.' },
    cog: { say: ['There is a golden cog right up over the spring. Higher than a bounce. Higher than a launch. Not higher than both.'], hint: 'Optional golden cog. Nut stands at the edge of the mezzanine. Bolt bounces on the spring, and Nut presses X when he comes up past her. He flies up to the cog. Steer back over the mezzanine on the way down, away from the laser cage.' },
    pallet: { say: ['The pallet run. Lasers at ankle height and lasers at head height. A robot on a crate fits nicely in between. Like a sandwich.', 'Nut, give Bolt a good shove and let go of the stick. Then wait up on the loading step. From up there, a reel goes over the lasers. From the floor, it goes through them.'], hint: 'Bolt hops up onto the high step at the back and walks off the end of it onto the iron crate, so it does not move. Nut runs into the crate from behind and lets go of the stick so she stops before the oil. The crate slides Bolt across. He steps onto the far dock. Nut climbs onto the little front step and stands at the oil end. Bolt stands at the front of the dock, faces her and holds X to reel her over the lasers.' },
    out: { say: ['Goods out. The loading dock is up there. The lift only runs when the switch up there is on. The switch is up there. You see the problem.', 'The spring is lasered off at ankle height, so nobody walks to it. A crate can. A crate with a passenger can. It is a trampoline with a lid.'], hint: 'Nut hops onto the little step by the oil and walks off the end of it onto the iron crate. Bolt runs into the crate from behind and lets go of the stick. The crate slides onto the spring and bounces with Nut on top. Near the top of a bounce, Nut jumps toward the dock. Bolt waits on the lift in the corner. She pushes the lime switch and the lift brings him up. If the crate gets stuck, Bolt can pull it back.' },
    end: { say: ['Everything must go, and everything has gone. Thank you. The warehouse is empty. It echoes. I quite like it.'] },
  },
  outro: 'Shift twenty six complete. The clearance was a success. We have sold every crate except the one that bounces. It is not for sale. It is family.',
};
