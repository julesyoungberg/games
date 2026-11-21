// Shift 18: Cling Film. Introduces wall magnets (L.magnet): Bolt zips to a plate on a wall and clings there.
const BW = (L, x0, x1, top, h = 3) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');

export default {
  name: 'Cling Film', sub: 'Shift 18. Bolt sticks to walls now. Socially, too.', theme: 7,
  intro: [
    'Shift eighteen. Cling Film. Maintenance has bolted magnet plates to the walls. Mostly on purpose.',
    'Bolt, point your head at one and hold on. You will stick. Nut, you will not stick. Please do not try.',
  ],
  build(L) {
    L.start(2.5, -3, 2.5, -5.5);
    /* ---- 1. First Cling: zip to the plate under the lip, hop up, reel Nut in */
    L.floor(0, -8, 12, 0, 0); BW(L, 0, 12, 0);
    L.box(12, -8, 30, 0, -6, 4.6, 'floor'); BW(L, 12, 30, 4.6);
    L.magnet(12, 4.6, -1.6, [-1, 0]);
    /* ---- 2. Wall Launch: cling low, Nut launches Bolt off the wall onto the high shelf */
    L.magnet(30, 7.6, -1.6, [-1, 0]);
    L.box(30, -8, 41, 0, -6, 10, 'floor'); BW(L, 30, 41, 10, 8);
    // golden cog: a back-wall magnet on the shelf, then a wall launch straight up
    L.magnet(35, 12.6, -8, [0, 1]);
    L.cog(35, 16.3, -7.45);
    /* ---- 3. Floor Is Lava: chain back-wall magnets over the laser floor; Bolt's plate opens Nut's tube */
    L.floor(41, -8, 63, 0, 10); BW(L, 41, 63, 10);
    L.laser(42, -8, 53.5, 0, 10, 10.6);
    L.magnet(44.5, 13.6, -8, [0, 1]);
    L.magnet(48.5, 13.6, -8, [0, 1]);
    L.magnet(52.5, 13.6, -8, [0, 1]);
    L.tube(39.5, -1.6, 10, 56, -1.6, 10, { outB: [1, 0] });
    L.laser(38.6, -2.5, 40.4, -0.7, 10, 11.6, [3]);
    L.plate(58, -6.3, 3, 10);
    /* ---- 4. Pillar Talk: zip to the pillar, hop on its plate; the bridge appears; Nut's switch keeps it */
    L.box(67, -8, 69, -4.5, -6, 14.6, 'shelf');
    L.magnet(67, 14.6, -6.2, [-1, 0]);
    L.plate(68, -6.2, 4, 14.6);
    L.bridge(63, -4, 75, 0, 10, [4]); BW(L, 63, 75, 10);
    L.floor(75, -8, 86, 0, 10); L.floor(86, -4.4, 88, 0, 10); BW(L, 75, 88, 10);
    L.button(80, -7.2, 4, 10);
    /* ---- 5. Top Floor: spring to the moving ring, ring to the wall magnet; Bolt's plate runs Nut's lift */
    L.spring(86, -8, 88, -4.4, 10, 18);
    L.anchor(89, 20.5, -6, { path: [[0, 0, 0], [7, 0, 0]], speed: 2 });
    L.mover(88.2, -3, 90.2, -1, 10, [[0, 0, 0], [0, 10.5, 0], [9.6, 10.5, 0]], 2.8, [5]);
    BW(L, 88, 100, 10);
    L.box(100, -8, 112, 0, -6, 20.5, 'floor'); BW(L, 100, 112, 20.5);
    L.magnet(100, 20.5, -6, [-1, 0]);
    L.plate(102.5, -6.3, 5, 20.5);
    L.exit(106, -6.5, 111, -1.5, 20.5);
    /* ---- checkpoints, zones, decoration */
    L.checkpoint(13, -8, 29, 0, 17, -3, 17, -5.5);
    L.checkpoint(31, -8, 41, 0, 33, -3, 33, -5.5);
    L.checkpoint(57, -8, 63, 0, 60, -3, 60, -5.5);
    L.checkpoint(75.5, -8, 86, 0, 77, -3, 77, -5.5);
    L.checkpoint(101, -8, 112, 0, 103, -3, 104, -5.5);
    L.zone('cling', 5, -8, 11, 0);
    L.zone('launch', 20, -8, 29, 0, 3, 50);
    L.zone('lava', 36, -8, 41, 0, 8, 50);
    L.zone('pillar', 59, -8, 63, 0, 8, 50);
    L.zone('top', 81, -8, 86, 0, 8, 50);
    L.zone('end', 101, -8, 112, 0, 19, 50);
    L.deco(8, -11, 9.5, -9.5, 0, 12, 'pipe'); L.deco(47, -11, 48.5, -9.5, 10, 20, 'pipe'); L.deco(106, -11, 107.5, -9.5, 20.5, 30, 'pipe');
    L.deco(67.4, -8, 68.6, -7.6, 14.6, 16, 'pipe');
    L.sign(4, 1.6, -7.9, 'CLING FILM');
    L.sign(60, 11.6, -7.9, 'PILLAR TALK');
    L.sign(104, 22.1, -7.9, 'TOP FLOOR');
  },
  zones: {
    cling: { say: ['See the round plate under the lip of that wall? That is a wall magnet. Bolt, point your head at it and hold on.', 'You will stick to the wall like a fridge note. Then hop up. Then fetch Nut. Nut is not magnetic. Nut is fine with this.'], hint: 'Bolt faces the wall magnet and holds X: he zips over and clings. Press A to hop off the wall onto the ledge. Then Bolt holds X facing Nut to pull her up.' },
    launch: { say: ['This shelf is taller. The magnet is too low to hop from. Somebody in Facilities measured with their foot.', 'Nut, a robot stuck to a wall is still a robot. You can still launch him. I checked the policy.'], hint: 'Bolt clings to the low wall magnet. Nut stands under him, a little back from the wall, and presses X to launch him off the wall onto the shelf. Then Bolt pulls Nut up.' },
    lava: { say: ['The floor ahead is a laser grid. It is not lava. It is worse. It is paperwork.', 'Bolt, the back wall has magnets. Go from one to the next. Nut, your tube is in a cage. The plate on the far side opens it.'], hint: 'Bolt grabs the first back-wall magnet, then lets go of X and grabs the next one, and the next. Hop off the last one past the lasers and stand on the pink plate. The laser cage over the tube switches off and Nut takes the tube across.' },
    pillar: { say: ['A pillar in a pit. The plate on top makes a bridge. The bridge goes away when nobody is on the plate. Like a meeting.', 'There is a switch on the far side. Switches do not get bored.'], hint: 'Bolt zips to the magnet on the pillar and hops onto the lime plate on top. The bridge appears. Nut crosses and flips the lime switch, so the bridge stays. Then Bolt drops down onto the bridge and crosses.' },
    top: { say: ['Top floor. The magnet is very high up. The ring goes most of the way. The spring goes most of the way to the ring.', 'Nut, there is a lift for you. It only runs when someone stands on the plate upstairs. Upstairs is the hard part.'], hint: 'Bolt bounces on the spring and grabs the moving ring. Ride it over the pit, then let go of X and grab the wall magnet. Hop onto the top floor and stand on the purple plate. The lift carries Nut up.' },
    end: { say: ['Top floor reached. You have climbed a whole building using a magnet and a friend. That is how most careers work.'] },
  },
  outro: 'Shift eighteen complete. Maintenance would like their fridge back. They are not getting it.',
};
