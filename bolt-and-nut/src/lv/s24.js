// Shift 24: Closing Time. The batch finale: one last run through every toy (oil, crates, fans, springs, lasers, rings, magnets, belts, a tube), up to the big front door.
// Back walls are 5.5 m tall so a launch can never land on top of one and walk past anything.
const BW = (L, x0, x1, top, h = 5.5) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');

export default {
  name: 'Closing Time', sub: 'Shift 32. Last one out turns off the lasers.', theme: 10,
  intro: [
    'Shift thirty two. Closing Time. This is the last shift of the season. I have been asked to keep it brief.',
    'Everything you have ever used is still switched on. Please go through it one last time and head for the front door. I will be fine.',
  ],
  build(L) {
    L.start(2.5, -3, 2.5, -5.5);
    /* ---- 1. Spill Kit: Nut holds the pen open; Bolt shoves the wooden crate across the oil and lets go before the laser cage */
    L.floor(0, -8, 6, 0, 0);
    L.oil(6, -8, 17, 0, 0);
    L.plate(4, -1.5, 1, 0);
    L.box(6.8, -5.2, 9.6, -4.8, 0, 2.5, 'wall');
    L.gate(9.6, -8, 10, -4.8, -3, 2.5, [1]);
    L.crate(8.2, -6.5, 0, { wood: true });
    L.plate(15.5, -6.5, 2, 0);
    L.laser(14.3, -8, 16.7, -5.3, 0, 2.6);
    L.gate(17, -8, 17.5, 0, 0, 5, [2]);
    /* ---- 2. Air Con: one plate runs the fan, the other one up top switches off the spring cage. Lasers on the wall stop any reeling */
    L.floor(17, -8, 26.5, 0, 0);
    L.plate(22.5, -6.3, 3, 0);
    L.fan(26.5, -8, 29.4, -4.6, 0, 7.2, [3]);
    L.floor(26.5, -4.6, 29.4, -3, 0); L.floor(26.5, -1, 29.4, 0, 0); L.floor(26.5, -3, 26.8, -1, 0); L.floor(28.8, -3, 29.4, -1, 0);
    L.spring(26.8, -3, 28.8, -1, 0, 21);
    L.laser(26.6, -3.2, 29, -0.8, 0, 9, [4]);
    L.floor(29.4, -8, 30, 0, 0);
    L.laser(29.45, -8, 30, 0, 0, 4.6);
    BW(L, 0, 30, 0);
    L.floor(30, -8, 44, 0, 6); BW(L, 30, 56, 6);
    L.plate(33, -2, 4, 6);
    /* ---- 3. Last Train: Bolt rides the ring to the wall magnet; his plate up top brings out the bridge; then he reels Nut up */
    L.anchor(45.5, 10.6, -6.5, { path: [[0, 0, 0], [7.5, 0, 0]], speed: 2 });
    L.bridge(44, -2.6, 56, -0.6, 6, [5]);
    L.box(56, -8, 72, 0, 4.8, 10.8, 'floor'); BW(L, 56, 79, 10.8);
    L.magnet(56, 10.8, -6.5, [-1, 0]);
    L.plate(59, -1.2, 5, 10.8);
    // golden cog: on the lost property shelf. Only a launch gets that high
    L.box(66, -8, 68, -6.6, 10.8, 13.8, 'shelf');
    L.cog(67, 14.85, -7.3);
    /* ---- 4. Last Bus: the belt runs the wrong way, too fast to walk. Nut launches Bolt over it; Bolt reels Nut across */
    L.conveyor(72, -8, 77, 0, 10.8, -9, 0);
    L.box(77, -8, 92, 0, 4.8, 10.8, 'floor'); BW(L, 79, 92, 10.8);
    /* ---- 5. Lock Up: Bolt stands on the iron crate and Nut launches him up the wall; his plate opens the tube cage for Nut */
    L.box(81, -8, 83, -6.8, 10.8, 13, 'shelf');
    L.crate(82, -7.4, 13);
    L.laser(91.45, -8, 92, 0, 10.8, 14.2);
    L.tube(87, -6.5, 10.8, 95, -6.5, 15.6, { outB: [1, 0] });
    L.laser(86.1, -7.4, 87.9, -5.6, 10.8, 12.8, [5]);
    L.box(92, -8, 109, 0, 9.6, 15.6, 'floor'); BW(L, 92, 109, 15.6, 8);
    L.plate(94.5, -1.8, 5, 15.6);
    /* ---- the front door: both clock out at once */
    L.plate(98, -6.3, 1, 15.6);
    L.plate(98, -1.7, 3, 15.6);
    L.gate(100, -8, 100.6, 0, 15.6, 21.5, [1, 3], { latch: true });
    L.exit(101.5, -7, 108, -1, 15.6);
    /* ---- checkpoints, zones, decoration */
    L.checkpoint(17.6, -8, 22, 0, 19.5, -3, 19.5, -5.5);
    L.checkpoint(34, -8, 43, 0, 37, -3, 37, -5.5);
    L.checkpoint(59.5, -8, 65.5, 0, 62, -3, 62, -5.5);
    L.checkpoint(80, -8, 86, 0, 84, -3, 84, -5.5);
    L.checkpoint(93, -8, 99.5, 0, 96.5, -3, 96.5, -4.6);
    L.zone('spill', 3, -8, 6, 0);
    L.zone('aircon', 17.6, -8, 22, 0);
    L.zone('train', 36, -8, 43, 0, 4, 50);
    L.zone('bus', 61, -8, 66, 0, 9, 50);
    L.zone('lockup', 80, -8, 85, 0, 9, 50);
    L.zone('clock', 93, -8, 99.5, 0, 14, 50);
    L.zone('end', 101.5, -8, 109, 0, 14, 50);
    L.deco(11, -11, 12.5, -9.5, 0, 12, 'pipe'); L.deco(40, -11, 41.5, -9.5, 6, 16, 'pipe'); L.deco(75, -11, 76.5, -9.5, 10.8, 20, 'pipe');
    L.deco(103, -11, 104.5, -9.5, 15.6, 30, 'pipe'); L.deco(106, -11, 107.5, -9.5, 15.6, 30, 'pipe');
    L.sign(3, 1.6, -7.9, 'SPILL KIT');
    L.sign(20, 1.6, -7.9, 'AIR CON');
    L.sign(38, 7.6, -7.9, 'LAST TRAIN');
    L.sign(67, 15.4, -7.9, 'LOST PROPERTY');
    L.sign(84, 12.4, -7.9, 'LOCK UP');
    L.sign(104.5, 20, -7.9, 'FRONT DOOR');
  },
  zones: {
    spill: { say: ['Spill kit. Somebody has to mop up before we close. Nobody mops. We just push a crate through it.', 'The crate goes on the plate in the laser cage. Crates do not get zapped. Robots who follow crates do.'], hint: 'Nut stands on the teal plate to open the pen. Bolt runs into the wooden crate from behind, then lets go of the stick so he stops on the oil. The crate slides into the cage onto the orange plate and the gate opens.' },
    aircon: { say: ['Air conditioning. The fan needs a plate. The spring needs a plate. The wall has lasers on it, so no reeling anybody up it.', 'One of you goes up on the fan. Then that one finds the other plate. I have always liked a plan with plates in it.'], hint: 'Nut stands on the pink plate and the fan starts. Bolt floats up and steers onto the ledge. Bolt stands on the lime plate up there and the cage around the spring switches off. Nut runs onto the spring and bounces up.' },
    train: { say: ['The last train. It is a ring on a rail. It goes most of the way. The magnet on the far wall does the rest.', 'Nut, the bridge is for you. It only comes out while someone stands on the plate over there. You know who.'], hint: 'Bolt grabs the moving ring, rides it across, then holds X at the wall magnet and hops up with A. Bolt stands on the purple plate and the bridge appears. Nut walks to the end of the bridge. Bolt, still on the plate, faces Nut and holds X to pull her up.' },
    bus: { say: ['The last bus. It is a belt. It is going the wrong way, very fast, which is how I remember every last bus.', 'Nobody can walk against it. Somebody can fly over it. Somebody else can be carried. You have done this before. I watched.'], hint: 'Stand at the start of the belt, Bolt in front of Nut. Nut presses X to launch Bolt over the belt and Bolt steers to the far side. Then Bolt faces Nut and holds X to pull her across.' },
    lockup: { say: ['Lock up. The top floor is too high for a launch. Unless you start a bit higher. The iron crate is a bit higher.', 'The tube is in a cage. The plate upstairs opens it. The wall has lasers, again. I am not sorry. It is nearly over.'], hint: 'Bolt pulls the iron crate off the shelf and puts it down a few steps from the wall. Bolt jumps onto the crate. Nut stands behind it and presses X to launch Bolt up onto the top floor. Bolt stands on the purple plate and the tube cage turns off. Nut takes the tube up.' },
    clock: { say: ['The front door. It opens when you both clock out at the same time. Like a proper team. Or a proper ending.', 'One of you on each plate, please. After that it stays open. I have checked it twice. I checked it a third time just now.'], hint: 'Bolt stands on one plate by the door and Nut stands on the other. The big door opens and stays open. Walk through together.' },
    end: { say: ['That is everything. Every gadget, every floor, every shift. You did all of it. Mostly on purpose.', 'I am not crying. It is the air conditioning. You will remember the air conditioning. It had plates.'] },
  },
  outro: 'Shift thirty two complete. That is the end of the season. Please leave your badges in the tray. Keep the cogs. Thank you both. Really. Lights off now.',
};
