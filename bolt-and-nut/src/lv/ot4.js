const BW = (L, x0, x1, top, h = 3) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');
export default {
  name: 'Bounce House', sub: 'Overtime. Springs, walls, and very good timing.', theme: 6, after: 12,
  intro: ['Overtime! Nobody asked for this. And yet, here you are. Bouncing.'],
  build(L) {
    L.start(2.5, -3, 2.5, -5.5);
    L.floor(0, -8, 8, 0, 0); BW(L, 0, 8, 0);
    L.spring(5, -6, 7, -2, 0, 18);
    L.box(7.4, -8, 8, 0, -6, 4.2, 'shelf');
    L.anchor(11, 7.5, -4); L.anchor(16.5, 7.5, -4);
    L.floor(15, -8, 44, 0, 0); BW(L, 15, 44, 0);
    L.box(21.5, -8, 22, -4, 0, 2.2, 'shelf'); L.box(26, -8, 26.5, -4, 0, 2.2, 'shelf'); L.box(21.5, -4.5, 26.5, -4, 0, 2.2, 'shelf');
    L.spring(23, -7.5, 25, -5.5, 0, 18);
    L.crate(24, -6.5, 0.3);
    L.plate(29, -6.3, 1, 0);
    L.gate(31, -8, 32, 0, 0, 10, [1]);
    L.exit(38, -6.5, 42, -1.5, 0);
    L.cog(23.4, 6.3, -6.8);
    L.checkpoint(15.5, -8, 21, 0, 16.5, -2.5, 16.5, -5);
    L.checkpoint(32.5, -8, 44, 0, 33.5, -2.5, 33.5, -5);
    L.zone('wall', 3.5, -8, 7.4, 0);
    L.zone('pen', 16, -8, 21, 0);
    L.sign(3, 1.6, -7.9, 'BOING');
  },
  zones: {
    wall: { say: ['A wall, a pit, and a spring. Bolt goes up and grabs things. Nut goes up and gets grabbed. Mid-air. Romantic, in a way.'], hint: 'Bolt runs onto the spring and grabs the rings at the top of the bounce. From the far side, Bolt pulls Nut while she is high on the spring, above the wall.' },
    pen: { say: ['That crate has been bouncing since Tuesday. Catch it when it clears the fence.'], hint: 'Bolt pulls the crate when it is above the fence, then puts it on the plate.' },
  },
  outro: 'Overtime done. Your bounce has been noted in your file. Under "bounce".',
};
