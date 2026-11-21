// Shift 15: Pneumatic Post. Introduces pneumatic tubes (L.tube): step on one hatch, pop out of the other.
const BW = (L, x0, x1, top, h = 3) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');

export default {
  name: 'Pneumatic Post', sub: 'Shift 15. You have mail. You are the mail.', theme: 9,
  intro: [
    'Shift fifteen. Pneumatic Post. Today you work in the mail room.',
    'Step on a hatch and the tube sends you to the other hatch. Very fast. Please do not lick the tubes.',
  ],
  build(L) {
    L.start(2.5, -3, 2.5, -5.5);
    L.cog(23.6, 6.6, -7.2);
    /* ---- 1. First Class: one robot takes the tube under the wall, then holds the plate that opens the gate */
    L.floor(0, -8, 17, 0, 0); BW(L, 0, 17, 0);
    L.box(9.5, -8, 10.3, -3, 0, 7, 'wall');
    L.gate(9.5, -3, 10.3, 0, 0, 7, [1]);
    L.tube(7, -6.5, 0, 12.5, -6.5, 0);
    L.plate(14.5, -2.2, 1, 0);
    /* ---- 2. Parcel Post: boost up to the sorting shelf, post the iron crate onto the far plate, then post yourselves */
    L.floor(17, -8, 21, -4, 0); L.floor(17, -4, 27, 0, 0); BW(L, 17, 21, 0);
    L.box(21, -8, 27, -4, -6, 2, 'shelf'); BW(L, 21, 27, 2);
    L.crate(22.5, -6.5, 2);
    L.box(27, -8, 27.8, 0, -6, 9, 'wall');
    L.tube(25.8, -6.2, 2, 29.5, -6.2, 0);
    L.floor(27.8, -8, 40, 0, 0); BW(L, 27.8, 40, 0);
    L.plate(32.5, -6.3, 2, 0);
    L.gate(34, -8, 34.8, 0, 0, 7, [2]);
    /* ---- 3. Special Delivery: Nut launches Bolt over the fast belt; Bolt reels Nut straight into the mail slot */
    L.conveyor(40, -8, 44.5, 0, 0, -8, 0); BW(L, 40, 44.5, 0);
    L.floor(44.5, -8, 50, 0, 0); BW(L, 44.5, 50, 0);
    L.tube(47.5, -4, 0, 52.5, -2.5, 0);
    L.box(50, -8, 50.8, 0, -6, 7, 'wall');
    /* ---- 4. Return to Sender: plate opens the gate to the spring; Bolt posts the crate back down onto the plate */
    L.floor(50.8, -8, 60, 0, 0); BW(L, 50.8, 60, 0);
    L.box(50.8, -8, 52.6, -5.5, -6, 4.5, 'shelf');
    L.plate(55.8, -6.3, 3, 0);
    L.tube(58, -5, 0, 62, -6, 0);
    L.box(60, -8, 60.8, 0, -6, 12, 'wall');
    L.floor(60.8, -8, 63.4, 0, 0); BW(L, 60.8, 66.2, 0);
    L.gate(63.4, -8, 64, 0, 0, 7, [3]);
    L.spring(64, -8, 66.2, 0, 0, 18);
    L.floor(66.2, -8, 84, 0, 4); BW(L, 66.2, 84, 4);
    L.crate(71, -6.5, 4);
    L.tube(51.7, -6.6, 4.5, 74, -7.3, 4, { outA: [1, 0], outB: [1, 0] });
    /* ---- 5. Rush Hour: time the laser over the hatch; the far belt runs backward until someone fixes it */
    L.plate(78, -2.5, 4, 4);
    L.laser(80.7, -7.6, 82.3, -5, 4, 5.4, null, [1.2, 1.4]);
    L.tube(81.5, -6.3, 4, 85.6, -6.3, 7);
    L.box(84, -8, 84.6, 0, -2, 16, 'wall');
    L.conveyor(84.6, -8, 93, 0, 7, -8, 0, [4]); BW(L, 84.6, 93, 7);
    L.floor(93, -8, 102, 0, 7); BW(L, 93, 102, 7);
    L.button(94.5, -7.2, 4, 7);
    L.exit(97, -6.5, 101, -1.5, 7);
    /* ---- checkpoints, zones, decoration */
    L.checkpoint(13, -8, 17.5, 0, 16, -2.5, 16, -4.5);
    L.checkpoint(35, -8, 39.5, 0, 36.5, -2.5, 36.5, -5);
    L.checkpoint(52.8, -5, 57, 0, 55.5, -1.5, 53.8, -1.5);
    L.checkpoint(70, -8, 79, 0, 76, -2.5, 76, -4.5);
    L.checkpoint(94, -8, 102, 0, 96, -2.5, 96, -4.5);
    L.zone('mail', 3, -8, 9, 0);
    L.zone('parcel', 17.5, -8, 21, 0);
    L.zone('express', 35.5, -8, 40, 0);
    L.zone('return', 53, -8, 57, 0);
    L.zone('rush', 75, -8, 79, 0, 3, 50);
    L.zone('end', 94, -8, 102, 0, 6, 50);
    L.deco(3, -11, 4.5, -9.5, 0, 9, 'pipe'); L.deco(56, -11, 57.5, -9.5, 0, 14, 'pipe'); L.deco(98, -11, 99.5, -9.5, 7, 18, 'pipe');
    L.sign(5, 1.6, -7.9, 'MAIL ROOM');
    L.sign(24, 3.6, -7.9, 'SORTING');
    L.sign(72, 5.6, -7.9, 'RETURNS');
  },
  zones: {
    mail: { say: ['Your first tube. The hatch on the floor goes under the wall. You go with it.', 'One of you rides the tube. The other waits for the gate. It is called teamwork. Or postage.'], hint: 'One robot steps on the tube hatch and pops out past the wall, then stands on the teal plate. The gate opens for the other robot.' },
    parcel: { say: ['Parcel post. The tube is up on the sorting shelf. The gate on the far side wants a parcel on its plate. A parcel is a crate with ambition.'], hint: 'Bolt jumps off Nut\'s head onto the shelf. Bolt carries the iron crate onto the hatch, so it lands on the orange plate. Then Bolt pulls Nut up and you both take the tube.' },
    express: { say: ['Special delivery. The belt runs backward faster than you can walk. The tube is on the far side.', 'Bolt, you are a magnet. Nut, you are mail. I think you can see where this is going. Into the slot.'], hint: 'Nut launches Bolt over the belt. Bolt stands behind the hatch, faces Nut and pulls. Nut flies over the belt and straight into the tube. Then Bolt steps in too.' },
    return: { say: ['Return to sender. The pink plate opens the gate to a spring past the wall. Only while someone stands on it.', 'There is a little tube up on that shelf. It comes from upstairs. Things upstairs can come down. Think about it.'], hint: 'Nut holds the pink plate. Bolt takes the tube, bounces up the spring to the high floor, then carries the iron crate onto the hatch upstairs. The crate drops onto the pink plate and Nut follows.' },
    rush: { say: ['Rush hour. A laser guards the hatch. It blinks. Go when it blinks off.', 'The belt on the other side runs backward. Backward belts return to sender. You are the sender.'], hint: 'Bolt stands on the lime plate so the far belt runs forward. Nut goes into the hatch when the laser is off, rides the belt and flips the lime switch. Then Bolt follows.' },
    end: { say: ['All parcels delivered. Two robots, no stamps. The post office would like you to know you were very poorly wrapped.'] },
  },
  outro: 'Shift fifteen complete. Pneumatic Post reports zero lost parcels. One slightly dizzy robot. Two, actually.',
};
