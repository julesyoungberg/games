// Overtime 31. Unlocks after Shift 13. Uses: springs, launching, pulling Nut.
// The aha: Nut can launch Bolt from anywhere, not just from the floor. A launch always adds the same four metres,
// so the higher Bolt is when she pushes, the higher he ends up. Bolt bounces on the spring, and Nut, standing beside it,
// launches him as he passes her. Nothing else reaches the 5.6 m mezzanine: a bounce gets 3 m, a launch 3.9 m, a launch
// mid-jump 5.2 m, riding Nut up the spring and jumping off 5.2 m. Launched mid-bounce he reaches about 6.5 m.
// Back walls are 14 m tall so nobody launched at them can stand on one.
const BW = (L, x0, x1, top, h = 14) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');
const Y = 5.6; // the mezzanine
const S0 = 16, S1 = 18.4; // the spring

export default {
  name: 'Escalation', sub: 'Overtime. If a problem bounces back, escalate it.', theme: 4, after: 12,
  intro: ['Overtime! Tonight you are escalating a complaint. The complaints department is on the mezzanine. That is not a coincidence.'],
  build(L) {
    L.start(2.5, -3, 2.5, -5.5);
    L.floor(0, -8, S0, 0, 0); BW(L, 0, S1 + 3, 0);
    /* ---- Escalation: the spring in front of the mezzanine wall. Bolt bounces on it. Nut stands right beside it and
            launches him on the way up, and the launch starts from wherever he is. He steers onto the mezzanine and reels her up. */
    L.spring(S0, -8, S1, 0, -0.3, 14);
    L.floor(S1, -8, S1 + 3, 0, 0);
    L.box(S1 + 3, -8, 44, 0, -6, Y, 'floor'); BW(L, S1 + 3, 44, Y);
    L.exit(38, -6.5, 43, -1.5, Y);
    // golden cog: high over the mezzanine. Only Nut, standing up there, can launch Bolt that high.
    L.cog(31, Y + 4.3, -6.5);
    /* ---- checkpoints, zones, decoration */
    L.checkpoint(S1 + 3, -8, 34, 0, 26, -3, 26, -5);
    L.zone('escalate', 8, -8, S1 + 3, 0);
    L.zone('top', S1 + 3, -8, 44, 0, Y - 1, 50);
    L.deco(5, -11, 6.5, -9.5, 0, 16, 'pipe'); L.deco(40, -11, 41.5, -9.5, Y, 20, 'pipe');
    L.sign(11, 2.4, -7.9, 'PLEASE HOLD');
    L.sign(28, Y + 2.4, -7.9, 'COMPLAINTS');
  },
  zones: {
    escalate: { say: ['The complaints department is up there. The spring does not reach. Nut does not reach. We have tried both. In writing.', 'But a launch does not care where it starts. Only where you are when it happens.'], hint: 'Bolt stands still on the spring and bounces. Nut stands on the floor right next to the spring. As Bolt rises past her, Nut presses X to launch him. Bolt steers onto the mezzanine, then faces Nut, holds X and walks back from the edge to reel her up.' },
    top: { say: ['Welcome to Complaints. Please take a number. The number is one. It is always one. Nobody else gets up here.'] },
  },
  outro: 'Overtime done. Your complaint has been escalated, received and filed. In a bin. A nice bin.',
};
