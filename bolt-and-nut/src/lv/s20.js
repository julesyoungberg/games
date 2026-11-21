// Shift 20: Year-End Review. The batch finale: a tall climb through the factory, one quarter per floor.
// Back walls are 4.5 m tall here so a launch or a rocket can never land on top of one (the lobby one is taller, for the cog).
const BW = (L, x0, x1, top, h = 4.5) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');

export default {
  name: 'Year-End Review', sub: 'Shift 20. Your annual review is on the top floor. Please climb to it.', theme: 11,
  intro: [
    'Shift twenty. Year-End Review. It is time for your annual performance review. It is on the top floor.',
    'We will go through the year one quarter at a time. One floor per quarter. The lifts are for people who have already been promoted.',
  ],
  build(L) {
    L.start(4, -3, 4, -5.5);
    /* ---- golden cog: the Employee of the Month podium. Bolt stands on Nut's head, Nut rockets off the iron, both go up */
    L.iron(0, -8, 3, -5);
    L.floor(0, -5, 10.5, 0, 0); L.floor(3, -8, 10.5, -5, 0);
    L.cog(1.5, 6, -6.5);
    /* ---- 1. Q1 Air Handling: Nut holds the plate that runs the fan; Bolt rides it up and reels Nut in */
    L.plate(6, -1.5, 1, 0);
    L.fan(10.5, -7, 13.5, -2, 0, 7.2, [1]);
    L.floor(10.5, -2, 13.5, 0, 0); L.floor(10.5, -8, 13.5, -7, 0); BW(L, 0, 13.5, 0, 11);
    L.floor(13.5, -8, 22, 0, 6); BW(L, 13.5, 22, 6);
    /* ---- 2. Q2 Synergy: iron steps. One push from Nut rockets her up AND launches Bolt up, together */
    L.iron(22, -8, 27, 0, 6); BW(L, 22, 27, 6);
    L.iron(27, -8, 32, 0, 9.2); BW(L, 27, 32, 9.2);
    L.iron(32, -8, 37, 0, 12.4); BW(L, 32, 37, 12.4);
    L.floor(37, -8, 47, 0, 15.6); BW(L, 37, 47, 15.6);
    /* ---- 3. Q3 Cross-Department: Bolt rides the ring over the gap and stands on the plate; the lift brings Nut */
    L.anchor(48.5, 21.5, -4.5, { path: [[0, 0, 0], [8, 0, 0]], speed: 2 });
    L.mover(47, -3, 49, -1, 15.6, [[0, 0, 0], [0, 3, 0], [8.5, 3, 0]], 2.8, [2]);
    BW(L, 47, 57.5, 15.6);
    L.floor(57.5, -8, 74, 0, 18.6); BW(L, 57.5, 76, 18.6);
    L.plate(60, -6.3, 2, 18.6);
    /* ---- 4. Q4 Delegation: Bolt fetches the iron crate, Nut fires it into the laser cage; the plate switches off the spring cage */
    L.box(62, -8, 64, -6.8, 18.6, 21, 'shelf');
    L.crate(63, -7.4, 21);
    L.box(70.5, -8, 73.5, -4.6, 18.6, 20.6, 'shelf');
    L.plate(72, -6.5, 3, 20.6);
    L.laser(70.3, -8, 73.7, -4.4, 18.6, 23);
    L.spring(74, -6, 76, -2, 18.6, 21);
    L.floor(74, -8, 76, -6, 18.6); L.floor(74, -2, 76, 0, 18.6);
    L.laser(73.8, -6.2, 76, -1.8, 18.6, 26.5, [3]);
    /* ---- 5. Q5 Promotion: past the timed laser; Bolt rides the ring to the wall magnet and hops up; his plate opens Nut's tube */
    L.floor(76, -8, 88, 0, 25.1); BW(L, 76, 88, 25.1);
    L.laser(83, -8, 83.3, 0, 25.1, 30, null, [1.2, 1.6, 0]);
    L.tube(86.5, -6.5, 25.1, 105, -6.5, 29.9, { outB: [1, 0] });
    L.laser(85.6, -7.4, 87.4, -5.6, 25.1, 27.1, [4]);
    L.anchor(89.5, 29.7, -4, { path: [[0, 0, 0], [7.5, 0, 0]], speed: 2 });
    BW(L, 88, 100, 25.1);
    L.box(100, -8, 110, 0, 23.9, 29.9, 'floor'); BW(L, 100, 110, 29.9);
    L.magnet(100, 29.9, -4, [-1, 0]);
    L.plate(102.5, -1.8, 4, 29.9);
    L.exit(106, -6.5, 109.5, -1.5, 29.9);
    /* ---- checkpoints, zones, decoration */
    L.checkpoint(15, -8, 21.5, 0, 17, -3, 17, -5.5);
    L.checkpoint(38, -8, 46, 0, 40, -3, 40, -5.5);
    L.checkpoint(61, -8, 66, 0, 64, -3, 64, -5);
    L.checkpoint(77, -8, 82, 0, 79, -3, 79, -5.5);
    L.checkpoint(101, -8, 110, 0, 103.5, -4, 104, -6);
    L.zone('podium', 0, -8, 3, -5);
    L.zone('q1', 6.5, -8, 10.5, 0);
    L.zone('q2', 17, -8, 22, 0, 4, 50);
    L.zone('q3', 41, -8, 47, 0, 13, 50);
    L.zone('q4', 61, -8, 66, 0, 17, 50);
    L.zone('q5', 78, -8, 82.5, 0, 23, 50);
    L.zone('end', 101, -8, 110, 0, 28.5, 50);
    L.deco(8, -11, 9.5, -9.5, 0, 14, 'pipe'); L.deco(34, -11, 35.5, -9.5, 12.4, 24, 'pipe');
    L.deco(66, -11, 67.5, -9.5, 18.6, 30, 'pipe'); L.deco(107, -11, 108.5, -9.5, 29.9, 42, 'pipe');
    L.sign(1.5, 2.2, -7.9, 'EMPLOYEE OF THE MONTH');
    L.sign(5, 1.6, -7.9, 'Q1');
    L.sign(18, 7.6, -7.9, 'Q2');
    L.sign(42, 17.2, -7.9, 'Q3');
    L.sign(66, 20.2, -7.9, 'Q4');
    L.sign(80, 26.7, -7.9, 'Q5');
    L.sign(105, 31.5, -7.9, 'REVIEW ROOM');
  },
  zones: {
    podium: { say: ['This is the Employee of the Month podium. Nobody has won it. The cog is still up there, waiting.', 'Nut can rocket off iron. If someone happened to be standing on Nut at the time, that someone would go higher. Just a thought.'], hint: 'Optional golden cog. Nut stands on the iron podium. Bolt jumps onto Nut\'s head and stays there. Nut presses X: she rockets and launches Bolt from up there, high enough to reach the cog.' },
    q1: { say: ['Quarter one. Air Handling. The fan only runs while someone stands on the plate. Facilities calls this a feature.', 'One of you holds the plate. One of you goes up. Then the one who went up brings the other one up. That is called teamwork. It is on the form.'], hint: 'Nut stands on the teal plate and the fan starts. Bolt walks into the fan, floats up and steers onto the ledge. Then Bolt faces Nut and holds X to pull her up.' },
    q2: { say: ['Quarter two. Synergy. The steps are iron. Nut can rocket off iron. Bolt cannot. Bolt has other qualities.', 'Here is the thing. When Nut pushes, she pushes everything near her at once. Herself included.'], hint: 'Stand together near the next step, Bolt a little ahead of Nut. Nut presses X once: she rockets off the iron and launches Bolt at the same time. Both steer onto the step. Repeat for each step.' },
    q3: { say: ['Quarter three. Cross-Department Collaboration. Bolt takes the ring. Nut takes the lift. The lift only runs when the plate over there is pressed.', 'Nut, get on the lift and wait. Waiting is a skill. We have measured it.'], hint: 'Bolt grabs the moving ring and rides it over the gap, then hops off with A onto the far floor. Nut stands on the lift. Bolt stands on the orange plate and the lift carries Nut across.' },
    q4: { say: ['Quarter four. Delegation. The plate is in a laser cage. Robots cannot go in. Crates can. Crates are excellent delegates.', 'That plate switches off the cage around the spring. The spring is how you get upstairs. Upstairs is where the review is.'], hint: 'Bolt pulls the iron crate off the shelf and sets it down in front of the cage. Bolt steps away. Nut stands behind the crate and presses X. It flies through the lasers onto the pink plate. The spring cage turns off. Both bounce up.' },
    q5: { say: ['Final item. Promotion. The review room is across the gap. Mind the blinking laser. It is on a schedule. So are we.', 'Bolt, take the ring, then the magnet on the far wall. The plate up there opens the tube for Nut. Nut, wait by the tube. Look promotable.'], hint: 'Cross the blinking laser while it is off. Bolt grabs the moving ring, rides it, then holds X at the wall magnet and hops up with A. Bolt stands on the lime plate and the cage over the tube turns off. Nut steps into the tube and pops out on the top floor.' },
    end: { say: ['You made it to the review room. Please take a seat. There are no seats. That is part of the review.', 'Overall rating: exceeds expectations. Mostly because we did not have any.'] },
  },
  outro: 'Shift twenty complete. Your year-end review is finished. Your bonus is a golden cog, if you found it. If not, it is a firm handshake. Bolt has no hands.',
};
