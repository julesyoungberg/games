// Overtime 1. Unlocks after Shift 4. Uses: jumping, standing on heads, plates/bridges, pulling Nut, anchors, launching.
const BW = (L, x0, x1, top, h = 3) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');

export default {
  name: 'Unpaid Internship', sub: 'Overtime. The experience is the payment.', theme: 2, after: 3,
  intro: [
    'Overtime! Short, hard, and unpaid. Think of it as an investment in your future. Somebody\'s future.',
  ],
  build(L) {
    L.start(2.5, -3, 2.5, -5.5);
    L.cog(8, 4.4, -7);
    L.floor(0, -8, 12, 0, 0); BW(L, 0, 12, 0);
    // puzzle 1: one ring over the pit, one pillar with a plate, one bridge
    BW(L, 12, 22, 0);
    L.anchor(15.5, 1.0, -4.3);
    L.box(17.4, -8, 19, -5.4, -6, 1.6, 'shelf');
    L.plate(18.2, -6.7, 1, 1.6, 0.7);
    L.bridge(12, -4.8, 22, -0.5, 0, 1);
    L.floor(22, -8, 36, 0, 0); BW(L, 22, 36, 0);
    // puzzle 2: a wall taller than any launch
    L.floor(36, -8, 48, 0, 4.4); BW(L, 36, 48, 4.4);
    L.exit(42, -6.5, 46, -1.5, 4.4);
    L.checkpoint(22.5, -8, 36, 0, 24, -2.5, 24, -5);
    L.checkpoint(36.5, -8, 48, 0, 38, -2.5, 38, -5);
    L.zone('rung', 8, -8, 12, 0);
    L.zone('stack', 29, -8, 36, 0);
    L.zone('end', 38, -8, 48, 0, 3, 50);
    L.deco(4, -11, 5.5, -9.5, 0, 9, 'pipe'); L.deco(44, -11, 45.5, -9.5, 4.4, 13, 'pipe');
    L.sign(6, 1.6, -7.9, 'INTERNS →');
  },
  zones: {
    rung: { say: ['One ring, one pillar, one plate. Bolt, you are not the one going to the pillar. You are the ladder.'], hint: 'Bolt hangs from the ring. Nut jumps onto his head, then onto the pillar plate. Bolt drops onto the bridge, crosses, and pulls Nut over.' },
    stack: { say: ['That wall is taller than any launch. Unless you start the launch somewhere higher. Like a head.'], hint: 'Bolt stands on Nut\'s head. Nut presses X. Bolt goes extra high and steers onto the ledge, then pulls Nut up.' },
    end: { say: ['Excellent work. Your internship certificate is in the post. The post is also unpaid.'] },
  },
  outro: 'Overtime complete. You have gained valuable experience. Please do not try to spend it.',
};
