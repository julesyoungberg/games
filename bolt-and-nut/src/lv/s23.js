// Shift 23: Open Plan Office. Switches and channel logic: split lanes, any / invert / latch gates, an invert bridge, a belt that turns around.
// Back walls are 5.5 m tall so a launch can never land on top of one and walk past a gate.
const BW = (L, x0, x1, top, h = 5.5) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');

export default {
  name: 'Open Plan Office', sub: 'Shift 32. No walls. Just lasers. Very modern.', theme: 8,
  intro: [
    'Shift thirty two. Open Plan Office. Management has removed all the walls to help everyone communicate.',
    'They replaced them with lasers. Communication is now mostly shouting. Please shout responsibly.',
  ],
  build(L) {
    L.start(3, -3, 3, -5.5);
    L.floor(0, -8, 34, 0, 0);
    L.floor(40, -8, 55, 0, 0); L.floor(55, -4.2, 63, 0, 0); L.floor(63, -8, 97, 0, 0);
    BW(L, 0, 97, 0);
    /* ---- golden cog: on top of the filing cabinet. Only a launch gets that high */
    L.box(0.5, -8, 2.5, -6.6, -6, 3, 'shelf');
    L.cog(1.5, 4.0, -7.3);
    /* ---- 1. Hot Desking: a laser splits the room. Nut flips the back lane switch through the laser; plates in each lane open the other lane's gate */
    L.laser(7, -4.4, 21, -4.0, 0, 6);
    L.button(8.3, -6.2, 1, 0);
    L.gate(11, -8, 11.5, -4.4, 0, 5, [1]);
    L.gate(12.5, -4.0, 13, 0, 0, 5, [2]);
    L.plate(14.5, -6.2, 2, 0);
    L.plate(16.5, -1.8, 3, 0);
    L.gate(18, -8, 18.5, -4.4, 0, 5, [3]);
    /* ---- 2. Reply All: the switch opens the gate but takes the bridge away. Bolt goes first and reels Nut over the gap */
    L.button(30, -6.8, 4, 0);
    L.bridge(34, -6, 40, -2, 0, [4], { invert: true });
    L.gate(44, -8, 44.5, 0, 0, 5, [4]);
    /* ---- 3. Hold Music: the laser splits the room again. Nut's plate turns Bolt's belt around; Bolt's plate latches Nut's gate */
    L.laser(51, -4.4, 68, -4.0, 0, 6);
    L.plate(53.5, -1.8, 2, 0);
    L.conveyor(55, -8, 63, -4.2, 0, -9, 0, [2]);
    L.laser(55, -8, 63, -4.4, 1.4, 6);
    L.gate(60, -4.0, 60.5, 0, 0, 5, [3], { latch: true });
    L.plate(66, -6.2, 3, 0);
    /* ---- 4. Revolving Door: the switch opens one door and shuts the other. The far door also opens for the plate behind it */
    L.button(75, -6.8, 5, 0);
    L.gate(79.5, -8, 80, 0, 0, 5, [5], { invert: true });
    L.gate(85, -8, 85.5, 0, 0, 5, [5, 2], { any: true });
    L.plate(88, -6.3, 2, 0);
    L.exit(90.5, -6.5, 96, -1.5, 0);
    /* ---- checkpoints, zones, decoration */
    L.checkpoint(22, -8, 26, 0, 24, -3, 24, -5.5);
    L.checkpoint(45, -8, 49.5, 0, 47, -3, 47, -5.5);
    L.checkpoint(69, -8, 73, 0, 71, -3, 71, -5.5);
    L.checkpoint(89, -8, 97, 0, 92, -3, 92, -5.5);
    L.zone('desk', 3.5, -8, 7, 0);
    L.zone('reply', 26, -8, 30, 0);
    L.zone('hold', 49.5, -8, 52, 0);
    L.zone('door', 72.5, -8, 76, 0);
    L.zone('end', 90, -8, 97, 0);
    L.deco(5, -11, 6.5, -9.5, 0, 10, 'pipe'); L.deco(37, -11, 38.5, -9.5, -6, 10, 'pipe'); L.deco(66, -11, 67.5, -9.5, 0, 10, 'pipe'); L.deco(93, -11, 94.5, -9.5, 0, 10, 'pipe');
    L.sign(1.5, 5.4, -7.9, 'FILING');
    L.sign(9, 1.6, -7.9, 'HOT DESKING');
    L.sign(28, 1.6, -7.9, 'REPLY ALL');
    L.sign(58, 1.6, -7.9, 'PLEASE HOLD');
    L.sign(82, 1.6, -7.9, 'REVOLVING DOOR');
  },
  zones: {
    desk: { say: ['Hot desking. Nobody has their own desk. Nobody has their own side of the room either. The laser decides.', 'One of you per lane. Each lane has the key to the other one. Nut, switches work through lasers. Lasers find this rude.'], hint: 'Bolt takes the back lane, Nut takes the front lane. Nut flips the teal switch through the laser to open Bolt\'s gate. Bolt stands on the orange plate to open Nut\'s gate. Nut stands on the pink plate to open Bolt\'s last gate. Meet at the end.' },
    reply: { say: ['Reply All. One switch. It opens the gate. It also deletes the bridge. Nobody reads the whole email.', 'Bolt, you can carry a colleague over a gap. Pulling is allowed. It is in the handbook, under Pulling.'], hint: 'Bolt crosses the bridge first. Nut goes back and flips the lime switch: the gate opens and the bridge vanishes. Bolt faces Nut across the gap and holds X to pull her over.' },
    hold: { say: ['Please hold. The back lane belt runs the wrong way, and the ceiling is a laser. Do not jump. We value your call.', 'There is a plate on each side. Each one does something for the other side. Like a good manager. We have heard.'], hint: 'Bolt waits at the start of the belt. Nut stands on the orange plate and the belt turns around, carrying Bolt across. Bolt stands on the pink plate and Nut\'s gate opens and stays open. Nut walks through.' },
    door: { say: ['A revolving door. The switch opens one door and closes the other. Never both. Someone is always stuck in the middle.', 'The far door has a plate behind it as well. Either one opens it. Remember that. I will not say it again. I might.'], hint: 'Bolt walks between the doors. Nut flips the purple switch: the near door shuts and the far door opens. Bolt goes through and stands on the orange plate. Nut flips the switch back. The near door opens and the far door stays open for Bolt\'s plate. Nut walks through.' },
    end: { say: ['You made it across the open plan office. Communication was excellent. There were only three lasers involved.'] },
  },
  outro: 'Shift thirty two complete. Management is delighted with the open plan. Next quarter they are removing the floor.',
};
