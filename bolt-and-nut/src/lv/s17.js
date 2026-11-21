// Shift 17: Slippery Slope. Introduces oil floors (L.oil): robots slide, shoved crates keep going.
const BW = (L, x0, x1, top, h = 3) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');

export default {
  name: 'Slippery Slope', sub: 'Shift 17. Someone spilled something. Everywhere.', theme: 2,
  intro: [
    'Shift seventeen. Slippery Slope. There has been a small oil incident. It is the whole floor.',
    'Robots slide on oil. Crates slide even better. Please walk like you are carrying soup.',
  ],
  build(L) {
    L.start(2.5, -3, 2.5, -5.5);
    /* ---- 1. Rink Practice: Nut holds the plate that opens the pen; Bolt shoves the wooden crate across the rink onto the far plate */
    L.floor(0, -8, 6, 0, 0); BW(L, 0, 6, 0);
    L.oil(6, -8, 17, 0, 0); BW(L, 6, 17, 0);
    L.plate(4, -1.5, 1, 0);
    L.box(6.8, -5.2, 9.6, -4.8, 0, 2.5, 'wall');
    L.gate(9.6, -8, 10, -4.8, -3, 2.5, [1]);
    L.crate(8.2, -6.5, 0, { wood: true });
    L.plate(15.5, -6.5, 2, 0);
    L.gate(17, -8, 17.5, 0, -3, 4, [2]);
    /* ---- 2. Curling: Bolt pulls the iron crate off the shelf; Nut fires it down the rink, under the laser, onto the plate */
    L.floor(17, -8, 24.5, 0, 0); BW(L, 17, 24.5, 0);
    L.box(17.5, -8, 21, -6.8, 0, 3, 'shelf');
    L.crate(20.2, -7.4, 3);
    L.cog(18.4, 4, -7.4);
    L.oil(24.5, -8, 37, 0, 0); BW(L, 24.5, 37, 0);
    L.laser(31, -8, 31.3, 0, 0, 6, [3]);
    L.plate(34.5, -6.3, 3, 0, 1.0);
    /* ---- 3. Grease Island: Nut rides the tube to the oily island and flips the switch; the bridge comes out; Bolt reels Nut in */
    L.floor(37, -8, 45, 0, 0); BW(L, 37, 45, 0);
    L.tube(43.5, -6.5, 0, 50, -6.5, -1.5, { outB: [1, 0] });
    L.oil(48.5, -8, 56, -4.5, -1.5); BW(L, 48.5, 56, -1.5);
    L.box(48.5, -8, 48.9, -4.5, -1.5, -0.5, 'wall');
    L.button(53, -7.6, 4, -1.5);
    L.bridge(45, -3, 58, 0, 0, [4]);
    /* ---- 4. Ski Jump: up the ledge, then shove the crate off the oily end; it flies through the laser cage onto the pillar plate */
    L.floor(58, -8, 64, 0, 0); BW(L, 58, 64, 0);
    L.floor(64, -8, 68, 0, 3);
    L.oil(68, -8, 72.5, -3.5, 3); L.floor(68, -3.5, 72.5, 0, 3); BW(L, 64, 72.5, 3);
    L.crate(69.2, -6.5, 3, { wood: true });
    L.box(74, -8, 76, -5, -6, 0, 'shelf'); BW(L, 74, 76, 0);
    L.plate(75, -6.5, 5, 0);
    L.laser(73.8, -8, 76.2, -4.8, 0, 2.6);
    L.bridge(72.5, -3, 78, 0, 3, [5]);
    /* ---- 5. Rush Hour: Nut launches Bolt over the backward belt onto the oil, Bolt reels Nut over, then hops the pit off the ring */
    L.floor(78, -8, 86, 0, 3); BW(L, 78, 86, 3);
    L.conveyor(86, -8, 90, 0, 3, -9, 0); BW(L, 86, 90, 3);
    L.oil(90, -8, 97, 0, 4.5); BW(L, 90, 97, 4.5);
    L.anchor(98.7, 9, -4);
    L.floor(100.5, -8, 107, 0, 4.5); BW(L, 100.5, 107, 4.5);
    L.exit(102.5, -6.5, 106.5, -1.5, 4.5);
    /* ---- checkpoints, zones, decoration */
    L.checkpoint(18.5, -6.5, 24.5, 0, 22, -2, 22, -4.5);
    L.checkpoint(37.5, -8, 42, 0, 39, -3, 39, -5.5);
    L.checkpoint(58.5, -8, 63.5, 0, 60, -3, 60, -5.5);
    L.checkpoint(78.5, -8, 85.5, 0, 80, -3, 80, -5.5);
    L.checkpoint(101, -8, 107, 0, 102, -3, 102, -5.5);
    L.zone('rink', 3, -8, 6, 0);
    L.zone('curl', 18.5, -8, 24.5, 0);
    L.zone('island', 38, -8, 45, 0);
    L.zone('ski', 59, -8, 64, 0);
    L.zone('rush', 79, -8, 86, 0, 2, 50);
    L.zone('end', 101, -8, 107, 0, 3.5, 50);
    L.deco(12, -11, 13.5, -9.5, 0, 9, 'pipe'); L.deco(50, -11, 51.5, -9.5, -1.5, 9, 'pipe'); L.deco(92, -11, 93.5, -9.5, 4.5, 14, 'pipe');
    L.sign(3, 1.6, -7.9, 'CAUTION: WET');
    L.sign(27.5, 1.6, -7.9, 'CURLING');
    L.sign(66, 4.6, -7.9, 'SKI JUMP');
  },
  zones: {
    rink: { say: ['This is the rink. It used to be the hallway. Then someone carried a bucket of oil without a lid.', 'The crate is locked in its pen. Somebody stand on the plate. Somebody else give the crate a good shove.'], hint: 'Nut stands on the teal plate to open the pen. Bolt runs into the wooden crate from behind. It slides across the oil onto the orange plate and the gate opens.' },
    curl: { say: ['Curling. A sport where you slide a heavy thing at a target and shout. We have removed the shouting.', 'Robots cannot get past that laser. Crates do not mind it at all. Crates have no feelings. That we know of.'], hint: 'Bolt pulls the iron crate off the shelf and drops it on the floor. Nut stands behind it and pushes. It flies, lands on the oil and slides under the laser onto the pink plate.' },
    island: { say: ['The switch for the bridge is on that island. The island is very oily. We are not sure why. We do not ask.', 'Nut, take the tube. When you land, stop. Stopping is important.'], hint: 'Nut steps into the tube hatch and lands on the oily island. Let go of the stick to stop. Nut flips the lime switch and the bridge appears. Bolt walks onto the bridge and pulls Nut up.' },
    ski: { say: ['The ski jump. Shove the crate off the oily end and it will fly. You do not need to fly. Please stop before the edge.', 'The plate is on that pillar, inside a laser cage. Crates get in free.'], hint: 'Nut launches Bolt up the ledge, then Bolt pulls Nut up. Shove the wooden crate along the oil and let go early. It flies off the end onto the purple plate and the bridge appears.' },
    rush: { say: ['The belt runs the wrong way and nobody can find the switch. So we are going over it. Nobody tell the belt.', 'There is oil on the other side. Land softly. Then there is a pit. Do not land in that.'], hint: 'Nut launches Bolt over the belt and up onto the oily ledge. Let go of the stick so you stop before the pit. Bolt pulls Nut over the belt. Bolt grabs the ring above the pit and hops off it with A toward the far ledge, then pulls Nut across.' },
    end: { say: ['You made it. Please wipe your feet. All of them. Bolt has wheels. Wipe those.'] },
  },
  outro: 'Shift seventeen complete. The oil stays. It is part of the building now. We have named it Gary.',
};
