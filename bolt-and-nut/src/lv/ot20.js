// Overtime 20. Unlocks after Shift 24. The after-hours final exam. Uses: springs, iron crates, pull range, launching, plates, gates,
// lasers, a moving anchor ring, a wooden crate, oil, a conveyor belt, a switch, a bridge, pulling Nut.
// Back walls are 8 m tall so nobody launched (or launched off a crate) can stand on one and walk past a gate or the causeway.
const BW = (L, x0, x1, top, h = 8) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');
const Y = 3.4; // the exam hall floor

export default {
  name: 'Final Exam', sub: 'Overtime. Unofficial. Unpaid. Unbelievably difficult.', theme: 11, after: 23,
  intro: [
    'Good evening. Strictly speaking, you have finished. This is not an exam. It is an unofficial after-hours assessment that I wrote on a napkin.',
    'There are two questions. Show your working. No talking. You may talk.',
  ],
  build(L) {
    L.start(2.5, -3, 2.5, -5.5);
    /* ---- Question 1, Spring Collection: the only crate bounces for ever at the bottom of a deep, lasered shaft inside the hall.
            From down on the floor it is out of sight. From the hall floor it is out of range, except at the top of each bounce.
            Nut launches Bolt up, Bolt holds X until the crate comes up to meet him, then puts it on the plate. */
    L.floor(0, -8, 16, 0, 0); BW(L, 0, 16, 0);
    L.box(16, -8, 20.75, 0, -13, Y, 'floor');
    L.box(20.75, -8, 22.25, -5, -13, Y, 'floor'); L.box(20.75, -3.5, 22.25, 0, -13, Y, 'floor');
    L.box(22.25, -8, 34.6, 0, -13, Y, 'floor');
    L.spring(20.75, -5, 22.25, -3.5, -12, 18);
    L.crate(21.5, -4.25, -11.7);
    L.laser(20.75, -5, 22.25, -3.5, -4, Y - 0.1);
    L.plate(17.8, -6.6, 1, Y); // more than a pull's reach from anywhere past the gate, so nobody can tug the crate off it later
    L.gate(28.5, -8, 29.5, 0, Y, Y + 10, [1]);
    BW(L, 16, 34.6, Y);
    // golden cog: the bonus question, high over the hall. Bolt stands on the crate and Nut launches him off it.
    L.cog(25, Y + 5.65, -2.4);
    /* ---- Question 2, Sweeping Statement: the causeway is oil, lasered at ankle height. A wooden crate sits on it. Robots cannot walk it.
            Nut can ride the crate. The low ring cannot carry Bolt all the way, but hanging from it his feet clear the lasers and his body
            shoves the crate. On oil, a shoved crate keeps going: the belt at the end delivers it (and Nut) to the gap.
            Nut hops off, switches the lasers off and brings the bridge out for Bolt. */
    L.oil(34.6, -5.5, 44.5, -2.5, Y);
    L.conveyor(44.5, -5.5, 50, -2.5, Y - 0.01, 3, 0); // flush with the oil, so a crate slides straight on
    L.crate(36.6, -4, Y, { wood: true });
    L.laser(35, -5.5, 50, -2.5, Y - 0.5, Y + 0.6, [2]);
    L.anchor(33.8, Y + 2.35, -4, { path: [[0, 0, 0], [10.5, 0, 0]], speed: 2 }); // its far end just overlaps the belt, so the crate can never stall out of reach
    L.bridge(50, -5.5, 51.6, -2.5, Y, [2]); // the gap is wider than a crate, so a crate that arrives alone always drops in and comes back
    BW(L, 34.6, 51.6, Y);
    L.box(51.6, -8, 66, 0, -13, Y, 'floor'); BW(L, 51.6, 66, Y);
    L.button(53.6, -7.2, 2, Y);
    L.exit(59, -6.5, 64.5, -1.5, Y);
    /* ---- checkpoints, zones, decoration */
    L.checkpoint(16.5, -8, 20.5, 0, 17.5, -2.5, 17.5, -5);
    L.checkpoint(30, -8, 34.6, 0, 31, -2.5, 31, -5);
    L.checkpoint(52, -8, 66, 0, 53.5, -2.5, 53.5, -5);
    L.zone('q1', 11, -8, 16, 0);
    L.zone('q1top', 16.5, -8, 28, 0, Y - 1, 50);
    L.zone('q2', 30, -8, 34.6, 0, Y - 1, 50);
    L.zone('end', 54, -8, 66, 0, Y - 1, 50);
    L.deco(3, -11, 4.5, -9.5, 0, 14, 'pipe'); L.deco(61, -11, 62.5, -9.5, Y, 16, 'pipe');
    L.sign(8, 2.2, -7.9, 'EXAM HALL ↑');
    L.sign(17.5, Y + 2.2, -7.9, 'QUESTION 1');
    L.sign(31.5, Y + 2.2, -7.9, 'QUESTION 2');
  },
  zones: {
    q1: { say: ['Question one. The exam hall is up there. You know how to get up there. That part is not on the exam.'], hint: 'Nut launches Bolt up onto the hall floor. Bolt can reel Nut up after him whenever you like.' },
    q1top: { say: ['The gate wants a crate on its plate. There is one crate. It lives at the bottom of that shaft, on a spring, and it has never stopped bouncing.', 'It is out of range of your magnet, Bolt. Most of the time. Hold that thought. Hold that button.'], hint: 'Bolt stands right at the edge of the shaft, facing away from Nut, and holds X. The crate is only in range at the top of its bounce, so keep holding until it comes up to you. Carry it round the shaft and put it on the teal plate by the wall. Do not jump in the shaft: it is lasered.' },
    q2: { say: ['Question two. The causeway is oil, and lasered at ankle height. Robots may not walk on it. Crates may. Robots standing on crates may.', 'The ring will not take Bolt all the way. It hangs low, though. Low enough to kick things.'], hint: 'Nut jumps onto the wooden crate. Bolt jumps under the ring as it comes back and holds X (in the air he grabs rings before robots). When the ring heads out, his body shoves the crate, and on oil it keeps going. The belt takes Nut to the end: she hops off onto the far floor before the gap, and pushes the orange switch. The lasers go off and the bridge comes out for Bolt. If the crate falls, a new one appears at the start.' },
    end: { say: ['Pencils down. You passed. It does not count for anything. I am going to frame it anyway.'] },
  },
  outro: 'Final exam complete. Grade: A. Comments: Bolt pulled his weight. Nut pushed hers. See me after class. Just to say well done.',
};
