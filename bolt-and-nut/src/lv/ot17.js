// Overtime 17. Unlocks after Shift 10. Uses: launching, pulling Nut, switches (Nut pushes while Bolt holds her in mid-air), fans, gates.
// Back walls are 6 m tall so nobody launched or jumping off the pillar can stand on one and walk past a gate.
const BW = (L, x0, x1, top, h = 6) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');
const Y = 6; // the high floor

export default {
  name: 'Remote Working', sub: 'Overtime. Nut flips switches from home. Home is mid-air.', theme: 9, after: 9,
  intro: ['Overtime! Tonight, Nut is trialling remote working. Bolt is trialling being the remote. Nobody asked Bolt.'],
  build(L) {
    L.start(2.5, -3, 2.5, -5.5);
    /* ---- 1. Remote Working: the teal switch is on top of a tall post. Nut cannot reach it. The pillar next to it only has room
            for one robot. Nut launches Bolt onto the pillar, Bolt reels Nut up and holds her out in the air, and she pushes. */
    L.floor(0, -8, 27, 0, 0); BW(L, 0, 30, 0);
    L.box(10.8, -5.2, 12, -4, -6, 3.2, 'shelf');
    L.box(14, -5.2, 15.2, -4, -6, 6.2, 'shelf'); L.button(14.6, -4.6, 1, 6.2);
    L.gate(18, -8, 19, 0, 0, 12, [1]);
    // golden cog: a cupboard by the start, opened by a pink switch on a second post behind the pillar
    L.box(10.8, -8, 12, -7, -6, 6.2, 'shelf'); L.button(11.4, -7.5, 3, 6.2);
    L.box(3, -8, 3.2, -5.8, 0, 2.3, 'wall'); L.box(5.2, -8, 5.4, -5.8, 0, 2.3, 'wall'); L.box(3, -8, 5.4, -5.8, 2.0, 2.3, 'wall');
    L.gate(3.2, -6, 5.2, -5.8, 0, 2.0, [3]);
    L.cog(4.2, 0.8, -7.1);
    /* ---- 2. Out of Office: the fan only runs while the orange switch is on. The gate up top only opens while it is off.
            Nut turns the fan on for Bolt, turns it off again for the gate, and Bolt reels her up. */
    L.button(24.5, -7.2, 2, 0);
    L.fan(27, -6, 30, -2, 0, 6.5, [2]);
    L.floor(27, -8, 30, -6, 0); L.floor(27, -2, 30, 0, 0);
    L.floor(30, -8, 48, 0, Y); BW(L, 30, 48, Y);
    L.gate(36, -8, 37, 0, Y, Y + 10, [2], { invert: true });
    L.exit(41.5, -6.5, 46.5, -1.5, Y);
    /* ---- checkpoints, zones, decoration */
    L.checkpoint(19.5, -8, 26.5, 0, 21, -2.5, 21, -5);
    L.checkpoint(37.5, -8, 48, 0, 39, -2.5, 39, -5);
    L.zone('remote', 7, -8, 10.5, 0);
    L.zone('office', 20, -8, 26.5, 0);
    L.zone('end', 38, -8, 48, 0, Y - 1, 50);
    L.deco(2, -11, 3.5, -9.5, 0, 10, 'pipe'); L.deco(44, -11, 45.5, -9.5, Y, 16, 'pipe');
    L.sign(8, 1.8, -7.9, 'REMOTE WORKING');
    L.sign(22, 1.8, -7.9, 'OUT OF OFFICE');
    L.sign(4.2, 2.9, -7.9, 'STATIONERY');
  },
  zones: {
    remote: { say: ['The switch for that gate is on top of a very tall post. Nut cannot reach it. The pillar beside it has room for exactly one robot. It is a very small office.', 'Nut, you can still push while Bolt is holding you. You do not need a desk. You barely need a floor.'], hint: 'Nut launches Bolt onto the pillar. Bolt faces Nut and pulls her up (hold X), then turns toward the tall post and keeps holding. Nut floats out next to it and presses X to flip the teal switch.' },
    office: { say: ['The fan runs while the orange switch is on. The gate at the top opens while it is off. That is not a bug. That is a policy.', 'Somebody has to stay down here and change their mind.'], hint: 'Nut flips the orange switch on. Bolt rides the fan up to the ledge. Nut flips the switch off again, so the gate opens. Bolt pulls Nut up.' },
    end: { say: ['Excellent remote working. Productivity is up. Bolt\'s arms are tired. Bolt does not have arms. You see the problem.'] },
  },
  outro: 'Overtime done. The remote working trial has been a success. It has been cancelled anyway. Management likes to see you.',
};
