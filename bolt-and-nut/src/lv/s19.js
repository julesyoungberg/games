// Shift 19: Mixed Signals. A greatest-hits shift: oil, springs, rings, tubes, crates, wall magnets and switches, in new combinations.
const BW = (L, x0, x1, top, h = 3) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');

export default {
  name: 'Mixed Signals', sub: 'Shift 19. Everything at once. Like a group email.', theme: 3,
  intro: [
    'Shift nineteen. Mixed Signals. Facilities has taken every gadget from every floor and put them in one hallway.',
    'You have seen all of it before. Just not all of it together. Please do not panic. Panic is on the next floor.',
  ],
  build(L) {
    L.start(2.5, -3, 2.5, -5.5);
    /* ---- 1. Bank Shot: Nut holds the pen open; Bolt shoves the wooden crate across the oil and lets go; the spring bounces it onto the high plate */
    L.floor(0, -8, 6, 0, 0); BW(L, 0, 6, 0, 4.6);
    L.plate(4, -1.5, 1, 0);
    L.oil(6, -8, 14.5, 0, 0); BW(L, 6, 14.5, 0, 4.6);
    L.box(6.8, -5.2, 9.6, -4.8, 0, 2.5, 'wall');
    L.gate(9.6, -8, 10, -4.8, -3, 2.5, [1]);
    L.crate(8.2, -6.5, 0, { wood: true });
    L.spring(14.5, -8, 16, -5, -0.3, 18);
    L.laser(14.5, -8, 16, -5, 1.3, 9);
    L.floor(14.5, -5, 16, 0, 0);
    L.floor(16, -8, 31, 0, 0); BW(L, 14.5, 24, 0, 4.6);
    L.box(17.4, -8, 21, -4.5, -6, 4.2, 'shelf');
    L.plate(18.6, -6.3, 2, 4.2);
    L.gate(22.5, -8, 23, 0, 0, 5.5, [2]);
    /* ---- 2. Sky Tram: the ring runs too high to reach; Nut launches Bolt into it; he rides over the pit and reels Nut across */
    BW(L, 24, 31, 0);
    L.anchor(30.5, 14.5, -4, { path: [[0, 0, 0], [10.5, 0, 0]], speed: 2.5 });
    L.floor(40, -8, 70, 0, 0); BW(L, 40, 70, 0);
    /* ---- 3. Mail Slot: Nut launches Bolt onto the shelf; he shoves the crate down the chute; the tube posts it under the gate onto the plate */
    L.box(43, -8, 48, -4.5, -6, 3, 'shelf'); BW(L, 43, 48, 3);
    L.crate(45.5, -6.3, 3, { wood: true });
    L.box(48, -4.9, 50.4, -4.5, 0, 1.8, 'wall');
    L.box(50, -8, 50.4, -4.9, 0, 1.8, 'wall');
    L.tube(49, -6.4, 0, 53.2, -6.4, 0, { outB: [1, 0] });
    L.gate(51.2, -8, 51.7, 0, 0, 8, [3]); BW(L, 49, 54, 0, 9);
    L.laser(52.3, -7.4, 54.1, -5.4, 0, 2.6);
    L.plate(55.6, -6.4, 3, 0);
    /* ---- 4. Signal Tower: the switch is up on the tower; Bolt clings to the magnet, hops up and hauls Nut after him */
    L.box(64, -8, 68, -4, -6, 7, 'shelf'); BW(L, 62, 70, 7, 7);
    L.magnet(64, 7, -4.8, [-1, 0]);
    L.button(67.2, -7.3, 4, 7);
    L.cog(67.6, 11.1, -6);
    L.gate(71, -8, 71.5, 0, 0, 8, [4]); BW(L, 70, 73, 0, 9);
    /* ---- 5. Top Floor: the magnet is out of reach from the floor; the spring gets Bolt close; his plate turns off the cage on Nut's tube */
    L.floor(70, -8, 90, -6, 0); L.floor(70, -6, 85.5, 0, 0); L.floor(88, -6, 90, 0, 0); L.floor(85.5, -2, 88, 0, 0); BW(L, 73, 90, 0);
    L.spring(85.5, -6, 88, -2, 0, 18);
    L.tube(80, -6.6, 0, 93, -1.6, 16, { outB: [1, 0] });
    L.laser(79.1, -7.5, 80.9, -5.7, 0, 3, [5]);
    L.box(90, -8, 101, 0, -6, 16, 'floor'); BW(L, 90, 101, 16);
    L.magnet(90, 16, -4, [-1, 0]);
    L.plate(92.6, -6.3, 5, 16);
    L.exit(95.5, -6.5, 100.5, -1.5, 16);
    /* ---- checkpoints, zones, decoration */
    L.checkpoint(23.5, -8, 28, 0, 25, -3, 25, -5.5);
    L.checkpoint(40.5, -8, 42.5, 0, 41.5, -2, 41.5, -4.5);
    L.checkpoint(56.5, -8, 62, 0, 59, -3, 59, -5.5);
    L.checkpoint(72, -8, 77, 0, 74, -3, 74, -5.5);
    L.checkpoint(91, -8, 101, 0, 94, -3, 94, -5.5);
    L.zone('bank', 3, -8, 6, 0);
    L.zone('tram', 24, -8, 28, 0);
    L.zone('mail', 41, -8, 43, 0);
    L.zone('tower', 57, -8, 62, 0);
    L.zone('top', 73, -8, 78, 0);
    L.zone('end', 91, -8, 101, 0, 15, 50);
    L.deco(11, -11, 12.5, -9.5, 0, 10, 'pipe'); L.deco(35, -11, 36.5, -9.5, -6, 16, 'pipe'); L.deco(58, -11, 59.5, -9.5, 0, 10, 'pipe'); L.deco(96, -11, 97.5, -9.5, 16, 26, 'pipe');
    L.sign(3, 1.6, -7.9, 'BANK SHOT');
    L.sign(44.5, 4.6, -7.9, 'OUTGOING MAIL');
    L.sign(60, 1.6, -7.9, 'SIGNAL TOWER');
  },
  zones: {
    bank: { say: ['Welcome to the shift where we use everything. Like the end of a jar of jam.', 'The plate is up high. The spring can get a crate there. The spring is not for robots. The laser has made that very clear.'], hint: 'Nut stands on the teal plate to open the pen. Bolt runs into the wooden crate from behind, then lets go of the stick so he stops on the oil. The crate slides onto the spring and bounces up onto the orange plate. The gate opens.' },
    tram: { say: ['The ring runs along the ceiling. Nobody can reach the ceiling. That is what ceilings are for.', 'Nut, you can make Bolt reach the ceiling. Bolt, hold on when you get there.'], hint: 'Wait for the ring to come close. Nut launches Bolt straight up and Bolt holds X to grab the ring. Ride it over the pit and let go at the far end. Then Bolt pulls Nut across.' },
    mail: { say: ['Outgoing mail. Robots may not be posted. The laser at the other end checks every parcel.', 'The crate is on the shelf. The chute is next to the shelf. I feel I have said a lot.'], hint: 'Nut launches Bolt onto the shelf behind the wooden crate. Bolt shoves the crate off the end, into the chute. The tube posts it under the gate onto the pink plate. Do not jump in after it.' },
    tower: { say: ['The switch for the gate is on top of the tower. Whoever built it was very afraid of switches.', 'Bolt, there is a magnet on the wall. Nut, you are going up the tower the same way you go everywhere. On a string.'], hint: 'Bolt faces the magnet on the tower and holds X, then presses A to hop on top. Bolt pulls Nut up. Nut flips the lime switch and the gate opens. Both drop down and go through.' },
    top: { say: ['Top floor. The magnet is so high you cannot reach it from the ground. Not even with help. I asked.', 'The spring can get you close. Nut, your tube is in a cage. The plate upstairs opens it. As usual.'], hint: 'Bolt runs onto the spring and holds X near the top of the bounce to grab the wall magnet. Hop up and stand on the purple plate. The cage over the tube switches off. Nut takes the tube up.' },
    end: { say: ['That was everything. All at once. You did not panic. I am told the next floor is very disappointed.'] },
  },
  outro: 'Shift nineteen complete. Facilities will now put everything back where it was. Nobody knows where it was.',
};
