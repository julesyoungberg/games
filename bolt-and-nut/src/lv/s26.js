// Shift 26 (played as Shift 24): Clearing the Air. The vents get one last service before winter: fans, pneumatic tubes and blinking lasers.
// Back walls are tall (10 m on the ground floor, 7 m above the upper floors) so neither a fan nor a launch can put anyone on top of one.
const BW = (L, x0, x1, top, h = 7) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');
const Y = 5.5; // upper floor
const Y2 = 8.5; // roof

export default {
  name: 'Clearing the Air', sub: 'Shift 24. The vents get one last service before the winter.', theme: 6,
  intro: [
    'Shift twenty four. Clearing the Air. Before we close for the winter, every vent, fan and tube gets a good blow through.',
    'The lasers blink while the air is moving. Nobody knows why. It has been on the maintenance list since the spring.',
  ],
  build(L) {
    L.start(2.5, -3, 2.5, -5.5);
    /* ---- 1. Intake: Bolt's plate runs the fan; Nut floats up and pushes the switch on the high ledge in mid-air */
    L.floor(0, -8, 10, 0, 0); L.floor(10, -4, 13, 0, 0); L.floor(13, -8, 30, 0, 0); BW(L, 0, 30, 0, 10);
    L.plate(6.5, -1.6, 1, 0);
    L.fan(10, -8, 13, -4, 0, 7, [1]);
    L.box(14, -8, 15.4, -6.6, -1, 6.2, 'shelf');
    L.button(14.7, -7.3, 2, 6.2);
    L.gate(19, -8, 19.5, 0, 0, 10, [2]);
    /* ---- 2. Return Air: the only way up is the tube. Its hatch is caged unless someone stands on a plate. The exit blinks */
    L.plate(22.5, -1.5, 3, 0);
    L.tube(25.5, -4.5, 0, 33, -4.5, Y, { outB: [1, 0] });
    L.laser(24.3, -5.7, 26.7, -3.3, 0, 3, [3]);
    L.laser(29.4, -8, 30, 0, -1, Y - 0.05);
    L.box(30, -8, 48, 0, -1, Y, 'floor'); BW(L, 30, 48, Y); BW(L, 48, 60, Y, 10);
    L.laser(32.4, -8, 34.6, 0, Y, Y + 4, null, [1.4, 1.6, 0]);
    L.plate(40, -6.4, 3, Y);
    /* golden cog: over the upper floor. Nut launches Bolt from up here */
    L.cog(43.5, Y + 4.45, -1.6);
    /* ---- 3. Cross Draught: launch Bolt into the fan island, he reels Nut in, both float over to the roof between blinks */
    L.fan(52.5, -7, 58, -1.5, Y, 7);
    L.box(60, -8, 74, 0, Y2 - 6, Y2, 'floor'); BW(L, 60, 100, Y2);
    L.laser(59.2, -8, 59.9, 0, Y, Y2 + 10, null, [1.5, 1.5, 0]);
    /* ---- 4. Exhaust: Nut holds the plate so Bolt can take the tube over; Bolt reels Nut back over the pit and she pushes the switch on the pillar on the way past */
    L.plate(63.5, -1.5, 4, Y2);
    L.tube(70, -6.5, Y2, 86, -6.5, Y2, { outB: [1, 0] });
    L.laser(68.8, -7.7, 71.2, -5.3, Y2, Y2 + 3, [4]);
    L.box(78, -6.6, 79.2, -5.4, Y2 - 8, Y2, 'shelf');
    L.button(78.6, -6, 5, Y2);
    L.laser(80.6, -8, 81.1, 0, Y2 - 8, Y2 + 6, null, [1.0, 2.0, 0]);
    L.box(83, -8, 100, 0, Y2 - 6, Y2, 'floor');
    L.gate(91, -8, 91.5, 0, Y2, Y2 + 9, [5]);
    L.exit(93.5, -6.5, 99, -1.5, Y2);
    /* ---- checkpoints, zones, decoration */
    L.checkpoint(20, -8, 24, 0, 21.5, -5.5, 21.5, -7);
    L.checkpoint(44, -8, 48, 0, 46, -3, 46, -5.5);
    L.checkpoint(61, -8, 67, 0, 62.5, -3, 62.5, -5.5);
    L.checkpoint(92, -8, 100, 0, 95, -3, 95, -5.5);
    L.zone('intake', 4, -8, 8, 0);
    L.zone('return', 20, -8, 24, 0);
    L.zone('cog', 38, -8, 44, 0, Y - 1, 50);
    L.zone('draught', 44, -8, 48, 0, Y - 1, 50);
    L.zone('exhaust', 61, -8, 67, 0, Y2 - 1, 50);
    L.zone('end', 92, -8, 100, 0, Y2 - 1, 50);
    L.deco(5, -11, 6.5, -9.5, 0, 14, 'pipe'); L.deco(36, -11, 37.5, -9.5, Y, 20, 'pipe'); L.deco(54, -11, 55.5, -9.5, Y - 6, 20, 'pipe'); L.deco(80, -11, 81.5, -9.5, Y2 - 6, 24, 'pipe'); L.deco(96, -11, 97.5, -9.5, Y2, 24, 'pipe');
    L.sign(7, 2.0, -7.9, 'INTAKE');
    L.sign(24, 2.0, -7.9, 'RETURN AIR');
    L.sign(50, Y + 2.0, -7.9, 'CROSS DRAUGHT');
    L.sign(72, Y2 + 2.0, -7.9, 'EXHAUST');
  },
  zones: {
    intake: { say: ['The intake fan. It only runs while somebody stands on the plate. The switch for the gate is up on that ledge. Out of reach. Of course it is.', 'Nut, you push things. You do not have to be standing on anything to push things. I looked it up.'], hint: 'Bolt stands on the teal plate and the fan starts. Nut walks into the fan and floats up. Near the top, next to the high ledge, she presses X to push the orange switch. The gate opens. Bolt can step off the plate.' },
    return: { say: ['Return air. The tube goes up. The hatch is in a cage. The cage switches off while someone stands on the pink plate. Down here, or up there.', 'The top of the tube blinks. Please arrive while it is off. Arriving while it is on is how we lost the last intern. Not lost. Respawned.'], hint: 'Bolt stands on the pink plate down here and the cage turns off. Nut walks into the tube just as the laser at the top switches off, so she pops out while it is off. Upstairs Nut stands on the other pink plate. Bolt takes the tube the same way.' },
    cog: { say: ['There is a golden cog up near the ceiling. Somebody blew it up there. With a fan. Probably.'], hint: 'Optional golden cog. Up on this floor, Bolt stands under the cog and Nut stands right next to him and presses X.' },
    draught: { say: ['Cross draught. The fan in the middle of the pit blows up to the roof. It is too far to jump to. It is not too far to be thrown to.', 'The curtain by the roof blinks too. Float over while it is off. And Bolt, please bring your colleague. She is standing right there.'], hint: 'Bolt stands at the edge with Nut right behind him. Nut presses X to launch him into the fan. Floating, Bolt faces Nut and holds X to pull her in, then turns and lets go over the fan so she floats too. Both drift over to the roof while the curtain is off.' },
    exhaust: { say: ['The exhaust. The tube goes across the pit. The hatch is caged unless the lime plate is pressed. The door switch is on the pillar in the middle.', 'Nut cannot reach the pillar from either side. She can reach it on the way past. Bolt, you know how to give someone a lift. Please wait for the curtain.'], hint: 'Nut stands on the lime plate and Bolt takes the tube across. Bolt stands at the far edge facing Nut and holds X to pull her over the pit just after the curtain turns off, then steps back to set her down. As she flies past the pillar Nut presses X to push the purple switch. The big door opens. If she misses, she steps back into the tube. The cage zaps her back to the start of the room, and you try again.' },
    end: { say: ['That is every vent cleared. The air is fresh. The lasers have stopped blinking. That might be the power. I am choosing to call it success.'] },
  },
  outro: 'Shift twenty four complete. The vents are clean, the tubes are clear, and the fans are off for the winter. Please do not stand on the plate anymore. I can hear you standing on it.',
};
