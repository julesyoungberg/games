const BW = (L, x0, x1, top, h = 3) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');
export default {
  name: 'Express Delivery', sub: 'Overtime. Belts into springs into trouble.', theme: 4, after: 12,
  intro: ['Overtime. Shipping needs a parcel delivered to a shelf. The shelf is up there. The parcel is wood. Good luck.'],
  build(L) {
    L.start(2.5, -2, 2.5, -3.8);
    L.floor(0, -8, 6, -5, 0); L.floor(0, -5, 25, 0, 0); BW(L, 0, 18, 0);
    L.conveyor(6, -8, 16, -5, 0, -4, 0, [1]);
    L.crate(9, -6.5, 0, { wood: true });
    L.button(11, -2.2, 1);
    L.spring(16, -8, 18, -5, -0.3, 16);
    L.floor(18, -8, 24, -5, 3, 'shelf'); BW(L, 18, 24, 3);
    L.plate(20, -6.5, 2, 3, 1);
    L.gate(24, -8, 25, 0, 0, 12, [2]);
    L.floor(25, -8, 32.5, 0, 0); BW(L, 25, 32.5, 0);
    L.spring(30, -5.5, 32, -2.5, 0, 18);
    L.floor(32.5, -8, 46, 0, 6); BW(L, 32.5, 46, 6);
    L.exit(39, -6.5, 43, -1.5, 6);
    L.cog(2, 4.2, -7);
    L.checkpoint(25.5, -8, 29.5, 0, 26.5, -2.5, 26.5, -5);
    L.checkpoint(33, -8, 46, 0, 34, -2.5, 34, -5);
    L.zone('belt', 4, -8, 9, 0);
    L.zone('top', 25.5, -8, 29.5, 0);
    L.sign(3, 1.6, -7.9, 'PARCELS');
  },
  zones: {
    belt: { say: ['The belt runs the wrong way. The switch fixes that. And at the end of the belt, a spring. I can see where this is going. Literally. Up.'], hint: 'Nut flips the switch so the belt runs right. Shove the wooden crate onto the belt. The spring throws it onto the shelf plate.' },
    top: { say: ['A spring, a ledge just out of reach, and Nut. Nut, try pushing Bolt while he is in the air. On the way up.'], hint: 'Bolt bounces on the spring. Nut stands next to it and pushes when Bolt is a little way up. Then Bolt pulls Nut onto the ledge.' },
  },
  outro: 'Overtime done. The parcel arrived. So did you. Shipping gives you three stars, out of a possible "fine".',
};
