// Shift 13: Spring Cleaning. Introduces bounce pads (L.spring).
const BW = (L, x0, x1, top, h = 3) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');

export default {
  name: 'Spring Cleaning', sub: 'Shift 13. The floor is now bouncy. On purpose.', theme: 0,
  intro: [
    'Shift thirteen. Spring Cleaning. Not the dusting kind. The kind with actual springs.',
    'Management bought a pallet of bounce pads. Nobody knows why. Please find out what they are for, so the receipt makes sense.',
  ],
  build(L) {
    L.start(2.5, -3, 2.5, -5.5);
    L.cog(26, 4.4, -7);
    /* --- 1. first spring: bounce up to the plate, hold the gate, switch from the far side */
    L.floor(0, -8, 32, 0, 0); BW(L, 0, 32, 0);
    L.floor(9, -8, 13, -5, 2.8); BW(L, 9, 13, 2.8);
    L.plate(11, -6.5, 1, 2.8);
    L.spring(9.5, -4.8, 12.5, -2.8, 0, 14);
    L.gate(15, -8, 16, 0, 0, 6, [1, 2], { any: true });
    L.button(20, -7, 2, 0);
    /* --- 2. a crate bouncing in a pit: launch Bolt over, catch it, plate, reel Nut in */
    L.spring(33.8, -7.2, 35.2, -5.8, -5.8, 18);
    L.crate(34.5, -6.5, -5.5);
    BW(L, 32, 37, 0);
    L.floor(37, -8, 57, 0, 0); BW(L, 37, 57, 0);
    L.plate(40, -6.5, 3, 0);
    L.gate(44, -8, 45, 0, 0, 8, [3]);
    /* --- 3. spring plus launch: extra height for Bolt */
    L.spring(53, -5.5, 55.5, -2.5, 0, 14);
    L.floor(57, -8, 64, 0, 5);
    /* --- 4. wooden crate rides the belt onto a spring and up onto the ledge plate */
    L.crate(61, -6.2, 5, { wood: true });
    L.button(63, -0.8, 4, 5);
    L.conveyor(64, -7.2, 72, -5.2, 5, -3, 0, [4]);
    L.floor(64, -8, 72, -7.2, 5); L.floor(64, -5.2, 72, 0, 5);
    L.spring(72, -7.2, 73.6, -5.2, 4.7, 18);
    L.floor(72, -8, 73.6, -7.2, 5); L.floor(72, -5.2, 73.6, 0, 5);
    L.floor(73.6, -8, 86.5, 0, 5);
    L.floor(74, -8, 78, -4.5, 8); BW(L, 74, 78, 8);
    L.plate(76, -6.2, 1, 8, 1.1);
    L.gate(79, -8, 80, 0, 5, 15, [1]);
    BW(L, 57, 89, 5);
    /* --- 5. Nut flips a switch at the top of a bounce, then launches Bolt off the spring */
    L.floor(86.5, -8, 89, -6, 5); L.floor(86.5, -2, 89, 0, 5);
    L.spring(86.5, -6, 89, -2, 5, 14);
    L.box(86.5, -8, 87.5, -6.6, 0, 9, 'shelf');
    L.button(87, -7.3, 5, 9);
    L.floor(89, -8, 100, 0, 9.5); BW(L, 89, 100, 9.5);
    L.gate(89, -8, 89.8, 0, 9.5, 14, [5]);
    L.exit(94, -6.5, 98, -1.5, 9.5);
    /* --- checkpoints, zones, dressing */
    L.checkpoint(17, -8, 24, 0, 18, -2.5, 18, -5);
    L.checkpoint(45.5, -8, 52, 0, 46.5, -2.5, 46.5, -5);
    L.checkpoint(57.5, -8, 63.5, 0, 58.5, -2.5, 58.5, -4.5);
    L.checkpoint(80.5, -8, 86, 0, 81.5, -2.5, 81.5, -5);
    L.checkpoint(90.5, -8, 100, 0, 91.5, -2.5, 91.5, -5);
    L.zone('spring', 4, -8, 9, 0);
    L.zone('catch', 25, -8, 31, 0);
    L.zone('higher', 47, -8, 52, 0);
    L.zone('wood', 58, -8, 64, 0, 4, 50);
    L.zone('top', 81, -8, 86, 0, 4, 50);
    L.zone('end', 91, -8, 100, 0, 8, 50);
    L.deco(4, -11, 5.5, -9.5, 0, 8, 'pipe'); L.deco(48, -11, 49.5, -9.5, 0, 12, 'pipe');
    L.deco(93, -11, 94.5, -9.5, 9.5, 18, 'pipe');
    L.sign(6, 1.6, -7.9, 'BOING');
    L.sign(60, 6.6, -7.9, 'SPRINGS: NOT FOR CRATES*');
  },
  zones: {
    spring: { say: ['A bounce pad. Step on it and it throws you upward. That is all it does. It is very committed.', 'That plate up there holds the gate open. The switch past the gate holds it open too. Somebody has to go first.'], hint: 'Bolt bounces on the spring onto the plate up top. Nut walks through the gate and pushes the orange switch. Then Bolt comes down and follows.' },
    catch: { say: ['A crate. Bouncing in a pit. Forever. We have tried asking it to stop.', 'The pit is too wide to jump. Nut, you know how to send Bolt places.'], hint: 'Nut launches Bolt over the pit. Bolt grabs the bouncing crate (hold X), puts it on the pink plate, then pulls Nut across.' },
    higher: { say: ['That ledge is taller than a launch. And taller than a bounce. Taller than both. Separately.'], hint: 'Bolt bounces on the spring. Nut stands next to it and pushes when Bolt is coming up. Then Bolt pulls Nut onto the ledge.' },
    wood: { say: ['A wooden crate, a belt, a spring, and a plate up high. This is either a puzzle or a very small theme park.'], hint: 'Nut flips the lime switch so the belt runs toward the spring. Shove the wooden crate onto the belt. The spring throws it onto the teal plate, which opens the gate.' },
    top: { say: ['The exit is up there, behind a gate. The switch for the gate is up there too. On a pole. Who designed this. Do not answer that.'], hint: 'Nut bounces on the spring and pushes at the top of the bounce to flip the purple switch. Then Nut launches Bolt off the spring, and Bolt pulls Nut up.' },
    end: { say: ['Every spring, sprung. The receipt finally makes sense. I will be framing it.'] },
  },
  outro: 'Shift thirteen complete. Spring Cleaning is done. Nothing is clean. Everything has bounced.',
};
