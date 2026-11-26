// Overtime 37. Unlocks after Shift 31 (Fire Drill). Uses: a moving platform, a blinking laser, a moving anchor, pulling Nut.
// Ride the shuttle through the laser curtain (it blinks out of step with the shuttle, so pick your moment and your end of the
// platform), then Bolt catches a ring that slides back and forth over the second gap and reels Nut across.
const BW = (L, x0, x1, top, h = 10) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');

export default {
  name: 'Moving Target', sub: 'Overtime. Nothing in this room stays still. Including you, ideally.', theme: 6, after: 30,
  intro: ['Overtime! Everything in here moves. The floor, the lasers, the rings. Facilities call it dynamic. I call it a lot of paperwork.'],
  build(L) {
    L.start(2.5, -3, 2.5, -5.5);
    L.floor(0, -8, 8, 0, 0); BW(L, 0, 8, 0);
    /* ---- 1. The shuttle: a platform going back and forth over the first gap, through a blinking laser curtain */
    L.mover(8.2, -6.5, 11.2, -1.5, 0, [[0, 0, 0], [12.6, 0, 0]], 2.4);
    L.laser(16, -9.5, 16.3, 1.5, -6, 9, null, [1.3, 1.5, 0]);
    L.floor(24, -8, 35, 0, 0); BW(L, 24, 35, 0);
    /* ---- 2. The ring slides over the second gap. Bolt catches it, rides it, drops off, and reels Nut over */
    L.anchor(37, 5, -4, { path: [[0, 0, 0], [4, 0, 0]], speed: 1.8 });
    L.floor(43, -8, 56, 0, 0); BW(L, 43, 56, 0);
    L.exit(50, -6.5, 54.5, -1.5, 0);
    // golden cog: high by the back wall over the far floor. Nut launches Bolt up to it.
    L.cog(48, 4.4, -7);
    L.checkpoint(24.5, -8, 30, 0, 26, -3, 26, -5.5);
    L.checkpoint(44.5, -8, 49, 0, 46.5, -3, 46.5, -5.5);
    L.zone('shuttle', 3, -8, 8, 0);
    L.zone('ring', 28, -8, 35, 0);
    L.zone('cog', 45.5, -8, 49.5, 0);
    L.zone('end', 49.5, -8, 56, 0);
    L.deco(5, -11, 6.5, -9.5, 0, 14, 'pipe'); L.deco(52, -11, 53.5, -9.5, 0, 14, 'pipe');
    L.sign(4, 2.4, -7.9, 'SHUTTLE');
    L.sign(30, 2.4, -7.9, 'MIND THE RING');
  },
  zones: {
    shuttle: { say: ['The shuttle goes back and forth. The laser goes on and off. They were not designed to get along.'], hint: 'Ride the platform together. If the laser will be on when you reach it, stay on and ride back, or move to the other end of the platform to change your timing.' },
    ring: { say: ['The ring slides over the gap. Bolt, grab it while it is close. It will carry you. Then come back for Nut.'], hint: 'Bolt stands at the edge and holds X when the ring is nearest. He rides it across, jumps off over the far floor, then faces Nut and holds X to reel her over.' },
    end: { say: ['Everyone is here. Nothing is moving. Enjoy it. It will not last.'] },
    cog: { say: ['There is a golden cog up by the back wall. Nut, you know how to send Bolt up there.'], hint: 'Optional golden cog: Bolt stands under it by the back wall and Nut launches him straight up.' },
  },
  outro: 'Overtime done. The room has stopped moving. The narrator has not stopped feeling like it is.',
};
