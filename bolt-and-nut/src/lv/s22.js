// Shift 22: Night Watch. The dark shift. Timing and teamwork: blinking lasers, a lift, a bus, a moving ring and a wall magnet.
// Back walls are tall (6 m on the ground floor, 8 m beside the pits) so a launch can never land on top of one and walk past a puzzle.
const BW = (L, x0, x1, top, h = 4.5) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');
const Y = 5.5; // upper floor

export default {
  name: 'Night Watch', sub: 'Shift 22. Someone has to watch the factory at night. Congratulations.', theme: 5,
  intro: [
    'Shift twenty two. Night Watch. Everyone else has gone home. You are in charge of the factory until morning.',
    'The security lasers blink on a timer at night. Nobody remembers who set the timer. Please walk in the gaps.',
  ],
  build(L) {
    L.start(2.5, -3, 2.5, -5.5);
    /* ---- 1. Clock In: Nut holds the plate that runs the fan; Bolt floats up between laser blinks; then he reels Nut up between blinks */
    L.floor(0, -8, 13, 0, 0); L.floor(13, -8, 16, -7, 0); L.floor(13, -2, 16, 0, 0); BW(L, 0, 16, 0, 6);
    L.plate(8, -1.5, 1, 0);
    L.fan(13, -7, 16, -2, 0, 6.5, [1]);
    L.laser(12, -8, 16, 0, 2.4, 3.6, null, [1.2, 1.8, 0]);
    L.floor(16, -8, 33, 0, Y); BW(L, 16, 30, Y);
    /* golden cog: hovering over the upper floor. Nut launches Bolt from up here */
    L.cog(21, 9.8, -1.5);
    /* ---- 2. Night Bus: Bolt drives the bus from his plate (on = forward, off = back) and carries Nut through the blinking curtains. Nut flips the switch for the bridge */
    L.plate(30, -6.5, 2, Y);
    L.mover(33.2, -5.5, 35.6, -2.5, Y, [[0, 0, 0], [11.2, 0, 0]], 2.5, [2]);
    L.laser(37.4, -8, 37.7, 0, Y - 3, Y + 6, null, [1.0, 1.4, 0]);
    L.laser(41.4, -8, 41.7, 0, Y - 3, Y + 6, null, [1.0, 1.4, 1.2]);
    L.bridge(33, -1.8, 47, 0, Y, [3]);
    L.floor(47, -8, 58, 0, Y); BW(L, 30, 74, Y, 8);
    L.button(49, -6.8, 3, Y);
    /* ---- 3. Sky Patrol: the ring patrols too high to reach. Nut launches Bolt into it as it passes; Bolt rides across and reels Nut over */
    L.anchor(57.5, Y + 14.2, -4, { path: [[0, 0, 0], [10.5, 0, 0]], speed: 2.5 });
    L.floor(67, -8, 74, 0, Y);
    /* ---- 4. Lookout: Nut launches Bolt at the tower magnet between blinks; on top, Bolt runs the lift for Nut, between blinks */
    L.box(80, -8, 92, 0, -1, Y + 12, 'floor'); BW(L, 74, 80, Y, 8); BW(L, 80, 92, Y + 12);
    L.magnet(80, Y + 12, -5.5, [-1, 0]);
    L.mover(74.2, -3.2, 76.6, -0.8, Y, [[0, 0, 0], [0, 12, 0], [3.2, 12, 0]], 3, [4]);
    L.laser(74, -8, 80, 0, Y + 5, Y + 6, null, [1.2, 1.6, 0]);
    L.plate(83, -6.5, 4, Y + 12);
    L.exit(86, -6.5, 91.5, -1.5, Y + 12);
    /* ---- checkpoints, zones, decoration */
    L.checkpoint(17, -8, 27, 0, 19, -3, 19, -5.5);
    L.checkpoint(48, -8, 56, 0, 52, -3, 52, -5.5);
    L.checkpoint(68, -8, 73.5, 0, 70, -3, 70, -5.5);
    L.checkpoint(84, -8, 92, 0, 87, -3, 87, -5.5);
    L.zone('clockin', 5, -8, 10, 0);
    L.zone('cog', 17, -8, 23, 0, 4, 50);
    L.zone('bus', 25, -8, 32, 0, 4, 50);
    L.zone('patrol', 50, -8, 56, 0, 4, 50);
    L.zone('tower', 68, -8, 73.5, 0, 4, 50);
    L.zone('end', 81, -8, 92, 0, Y + 11, 50);
    L.deco(5, -11, 6.5, -9.5, 0, 14, 'pipe'); L.deco(40, -11, 41.5, -9.5, Y, 22, 'pipe'); L.deco(62, -11, 63.5, -9.5, Y, 22, 'pipe'); L.deco(88, -11, 89.5, -9.5, Y + 12, 30, 'pipe');
    L.sign(3, 2.2, -7.9, 'CLOCK IN');
    L.sign(28, Y + 2.2, -7.9, 'NIGHT BUS');
    L.sign(53, Y + 2.2, -7.9, 'SKY PATROL');
    L.sign(70, Y + 2.2, -7.9, 'LOOKOUT');
  },
  zones: {
    clockin: { say: ['First, clock in. The clock is upstairs. The fan only runs while someone stands on the plate.', 'There is a laser across the fan. It blinks. Go up while it is off. That is the whole job, really.'], hint: 'Nut stands on the teal plate and the fan starts. Bolt waits until the laser blinks off, then walks into the fan and floats up onto the upper floor. Bolt faces Nut and holds X to pull her up, again while the laser is off.' },
    cog: { say: ['A golden cog has been left out overnight. It is floating. That is not in the security manual.'], hint: 'Optional golden cog. Up on this floor, Nut stands next to Bolt under the cog and presses X to launch him straight up.' },
    bus: { say: ['The night bus. Bolt drives. Standing on the plate makes it go. Stepping off makes it go back. That is all the controls.', 'The curtains blink. The passenger would like to arrive in one piece. The passenger is Nut.'], hint: 'Nut stands on the bus. Bolt stands on the orange plate to drive it forward and steps off to back it up, so Nut passes each blinking curtain while it is off. Nut steps off at the far side and pushes the pink switch. A bridge appears along the front. Bolt walks over it between blinks.' },
    patrol: { say: ['The patrol ring goes back and forth all night. It is far too high to reach. It does not get bored. We checked.', 'Nut, you can make Bolt go higher. Try doing it when the ring is nearby.'], hint: 'Wait for the ring to stop at this end. Bolt stands under it, Nut right behind him, and Nut presses X. Bolt holds X near the top to grab the ring. Ride it across and let go over the far floor. Then Bolt pulls Nut across.' },
    tower: { say: ['The lookout tower. The magnet at the top is out of reach from here. The laser across the front blinks. Of course it does.', 'Up top there is a plate for the lift. Bolt, Nut is counting on you. Do not drive her into a laser.'], hint: 'When the laser blinks off, Nut launches Bolt toward the tower and he holds X to grab the magnet, then presses A to hop on top. Nut stands on the lift. Bolt stands on the lime plate when the laser has just turned on, so Nut passes it while it is off. Step off the plate to bring the lift back down if the timing is wrong.' },
    end: { say: ['You watched the whole factory all night. Nothing happened. Mostly because of you. Partly because it was night.'] },
  },
  outro: 'Shift twenty two complete. The day shift has arrived. They have asked why the bus is on the other side. Please do not tell them.',
};
