// Overtime 30. Unlocks after Shift 29. Uses: launching, a pneumatic tube, pull range, pulling Nut (in mid-air).
// The aha: Bolt's magnet only reaches eleven metres, and the chasm is wider than that from edge to edge. So Nut jumps
// into it, and Bolt, already holding X on the far side, catches her the moment she comes into range. A trust fall.
// Bolt gets over first by mail: the tube's hatch is on top of a pole too tall to jump or boost onto, so Nut launches him into it.
// Back walls are 10 m tall so nobody launched at them can stand on one.
const BW = (L, x0, x1, top, h = 10) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');
const P = 3.2; // the top of the mail pole
const A = 16, B = 28; // the near and far edges of the chasm

export default {
  name: 'Trust Exercise', sub: 'Overtime. Jump, and trust that somebody is holding X.', theme: 3, after: 28,
  intro: ['Overtime! Tonight is a team building exercise. It is called a trust fall. Attendance is compulsory. So is trust.'],
  build(L) {
    L.start(2.5, -3, 2.5, -5.5);
    L.floor(0, -8, A, 0, 0); BW(L, 0, A, 0);
    /* ---- Trust Exercise: the mail pole. Its hatch is on top, 3.2 m up. Nut launches Bolt into it and the tube posts
            him over the chasm. Then Nut takes a running jump into the chasm, and Bolt catches her with his magnet. */
    L.box(11.7, -4.8, 12.3, -4.2, -6, P, 'wall');
    L.tube(12, -4.5, P, B + 3, -7, 0, { outA: [-1, 0], outB: [1, 0] });
    BW(L, A, B, -6);
    L.floor(B, -8, 46, 0, 0); BW(L, B, 46, 0);
    L.exit(40, -6.5, 45, -1.5, 0);
    // golden cog: high over the far floor. Only a launch reaches it.
    L.cog(36, 5.0, -6.8);
    /* ---- checkpoints, zones, decoration */
    L.checkpoint(B + 4, -8, 46, 0, 36, -3, 36, -5);
    L.zone('pole', 6, -8, A, 0);
    L.zone('chasm', B, -8, B + 6, 0);
    L.zone('end', 38, -8, 46, 0);
    L.deco(4, -11, 5.5, -9.5, 0, 14, 'pipe'); L.deco(42, -11, 43.5, -9.5, 0, 14, 'pipe');
    L.sign(9, 2.4, -7.9, 'INTERNAL MAIL');
    L.sign(22, 2.4, -7.9, 'TRUST');
    L.sign(B + 3, 2.4, -7.9, 'ARRIVALS');
  },
  zones: {
    pole: { say: ['Step one. Bolt goes over by internal mail. The post box is on top of that pole. Nobody said posting yourself would be easy.', 'Step two is trust. We will get to step two.'], hint: 'Bolt stands a couple of metres from the pole. Nut stands just behind him, on the far side from the pole, and presses X to launch him. Bolt steers onto the top of the pole and the tube posts him across the chasm.' },
    chasm: { say: ['The chasm is wider than Bolt\'s magnet reaches. We checked. Twice. Once with a tape measure, once with an intern.', 'So Nut has to meet him part of the way. In the air. That is what trust is.'], hint: 'Bolt stands at the very edge of the chasm, faces Nut and holds X. Nut takes a running jump into the chasm toward him. As soon as she is in range the magnet catches her, and Bolt reels her in.' },
    end: { say: ['Nobody fell. Well. Nobody fell very far. That is a pass.'] },
  },
  outro: 'Overtime done. Trust has been built. It is load-bearing. Please do not lean on it.',
};
