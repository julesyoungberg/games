// Overtime 8. Unlocks after Shift 16. Uses: moving anchor rings, standing on heads, plates, latch gates, pulling Nut.
const BW = (L, x0, x1, top, h = 3) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');

export default {
  name: 'Commute', sub: 'Overtime. Standing room only. On Bolt.', theme: 1, after: 15,
  intro: ['Overtime. The late service runs on the overhead rail tonight. There is one seat. It is Bolt.'],
  build(L) {
    L.start(2.5, -3, 2.5, -5.5);
    /* ---- 1. Carpool: the chasm is wider than any pull. The low ring carries Bolt, and Bolt carries Nut. On his head. */
    L.floor(0, -8, 10, 0, 0); BW(L, 0, 10, 0);
    L.anchor(8, 1.6, -4, { path: [[0, 0, 0], [16, 0, 0]], speed: 2.4 });
    L.cog(16, 3.2, -4);
    L.floor(22, -8, 27, 0, 0); BW(L, 22, 27, 0);
    /* ---- 2. Request Stop: Nut gets off at the pillar to open the gate. Bolt rides on and reels her in from the far side. */
    L.anchor(25.5, 1.6, -4, { path: [[0, 0, 0], [18, 0, 0]], speed: 2.4 });
    L.box(33.5, -8, 35.5, -5.6, -6, 1.9, 'shelf'); BW(L, 33.5, 35.5, 1.9);
    L.plate(34.5, -6.8, 1, 1.9, 0.7);
    L.gate(38.5, -8, 39.3, 0, -6, 9, [1], { latch: true });
    L.floor(41, -8, 50, 0, 0); BW(L, 41, 50, 0);
    L.exit(45, -6.5, 49, -1.5, 0);
    /* ---- checkpoints, zones, decoration */
    L.checkpoint(22.5, -8, 25, 0, 23.5, -2.5, 23.5, -5.5);
    L.checkpoint(41.5, -8, 44.5, 0, 42.5, -2.5, 42.5, -5);
    L.zone('carpool', 5, -8, 10, 0);
    L.zone('stop', 22.5, -8, 27, 0);
    L.zone('end', 41.5, -8, 50, 0);
    L.deco(2, -11, 3.5, -9.5, 0, 9, 'pipe'); L.deco(47, -11, 48.5, -9.5, 0, 9, 'pipe');
    L.sign(4, 1.6, -7.9, 'LATE SERVICE');
    L.sign(24.5, 1.6, -7.9, 'REQUEST STOP');
  },
  zones: {
    carpool: { say: ['That gap is too wide to reel anyone across. Bolt can ride the ring. Nut cannot. Nut has no magnet. Nut has feet.', 'The ring runs nice and low. Low enough to step onto something. Or someone.'], hint: 'Bolt grabs the low ring (hold X) while Nut waits behind him. Once he hangs, Nut runs after him and jumps onto his head. Ride across together and get off on the far side.' },
    stop: { say: ['The gate on this line only opens for the plate on that pillar. Bolt cannot reach the pillar from the ring. His head can. Well. What is on his head can.'], hint: 'Nut rides on Bolt\'s head again and jumps off onto the pillar plate. The gate opens for good. Bolt rides on to the far side, then pulls Nut over from the pillar.' },
    end: { say: ['You have reached your destination. Please mind the gap. Please mind each other.'] },
  },
  outro: 'Overtime done. Your commute has been logged as working hours. Not paid ones. But logged.',
};
