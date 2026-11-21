// Overtime 7. Unlocks after Shift 15. Uses: pulling crates, crate throws, lasers, pneumatic tubes, anchor rings, pulling Nut.
const BW = (L, x0, x1, top, h = 3) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');

export default {
  name: 'Internal Mail', sub: 'Overtime. Please allow three to five working seconds.', theme: 9, after: 14,
  intro: ['Overtime. The mail room is short-staffed tonight. By which I mean it is staffed by lasers. You are the delivery team.'],
  build(L) {
    L.start(2.5, -3, 2.5, -5.5);
    L.cog(3, 4.45, -7.3);
    /* ---- 1. Mail Slot: the hatch sits inside a laser mailbox. Robots cannot go in. Parcels can be thrown in. */
    L.floor(0, -8, 10, 0, 0); L.floor(10, -3.5, 15, 0, 0); L.floor(15, -8, 29, 0, 0); BW(L, 0, 9, 0); BW(L, 9, 15, 0, 6); BW(L, 15, 29, 0);
    L.box(3.5, -8, 6, -6, -6, 5, 'shelf'); BW(L, 3.5, 6, 5);
    L.crate(4.7, -7, 5);
    L.floor(10, -8, 10.3, -3.5, 2, 'shelf'); L.floor(10.3, -3.8, 15, -3.5, 2, 'shelf');
    L.conveyor(10.3, -8, 12.8, -3.8, 0, 4, -4); L.floor(12.8, -8, 15, -3.8, 0);
    L.laser(10.3, -8, 15, -3.8, 0, 5);
    L.tube(14.2, -7.2, 0, 17.6, -6.6, 3, { outB: [1, 0] });
    L.box(15, -9.5, 15.8, -3.5, -6, 12, 'wall');
    L.gate(15, -3.5, 15.8, 0, 0, 12, [1]);
    L.box(15.8, -8, 18.5, -5.4, -6, 3, 'shelf');
    L.plate(21, -6.6, 1, 0);
    /* ---- 2. Return to Sender: the far hatch is on a lonely pillar. Whatever lands on it gets posted straight back. */
    L.tube(27.5, -4, 0, 32.5, -4, 3, { outA: [-1, 0], outB: [0, 0] });
    L.box(29, -9.5, 30, 0, -6, 14, 'wall');
    L.box(31.95, -4.55, 33.05, -3.45, -6, 3, 'shelf');
    L.anchor(39.2, 6.6, -4);
    L.floor(38, -8, 50, 0, 3); BW(L, 38, 50, 3);
    L.exit(44.5, -6.5, 48.5, -1.5, 3);
    /* ---- checkpoints, zones, decoration */
    L.checkpoint(21.5, -8, 26, 0, 23, -2.5, 23, -5);
    L.checkpoint(38.5, -8, 44, 0, 40.5, -2.5, 40.5, -5);
    L.zone('slot', 6.5, -8, 10, 0);
    L.zone('return', 22, -8, 27, 0);
    L.zone('end', 38.5, -8, 50, 0, 2, 50);
    L.deco(1, -11, 2.5, -9.5, 0, 10, 'pipe'); L.deco(46, -11, 47.5, -9.5, 3, 14, 'pipe');
    L.sign(8, 1.6, -7.9, 'PARCELS ONLY');
    L.sign(24.5, 1.6, -7.9, 'RETURNS');
  },
  zones: {
    slot: { say: ['The mailbox is full of security lasers. Robots go in, robots come out crispy. Parcels go in, parcels come out at the plate.', 'The parcel is on the top shelf. Bolt, fetch. Nut, I believe you have a strong throwing arm. Or a strong throwing everything.'], hint: 'Bolt pulls the iron crate down from the shelf and puts it down two steps in front of the mailbox wall. Nut stands behind it and pushes: the crate flies over the lasers into the hatch, comes out over the wall and lands on the teal plate.' },
    return: { say: ['The far end of this tube is on a pillar with nowhere to stand. Anything that lands on that hatch gets posted straight back. Even you.', 'So do not land. Catch something on the way up.'], hint: 'Bolt steps into the hatch. When he pops out on the pillar, he grabs the ring (hold X) and drops onto the far floor. Then Nut takes the tube and Bolt pulls her in as she pops out.' },
    end: { say: ['All mail delivered. Including two robots, marked "fragile". You were not fragile. I just liked the sticker.'] },
  },
  outro: 'Overtime done. The mail room thanks you. It has also kept one of your bolts. Not Bolt. A bolt.',
};
