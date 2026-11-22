// Overtime 19. Unlocks after Shift 20. Uses: a wooden crate (worn as a hat), a moving anchor ring, pulling Nut, plates, gates, launching.
// Back walls are 6 m tall so nobody launched or dropping off the ring can stand on one and walk past the gate.
const BW = (L, x0, x1, top, h = 6) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');

export default {
  name: 'Hat Trick', sub: 'Overtime. Smart casual. The hat is a crate.', theme: 10, after: 19,
  intro: ['Overtime! Tonight is smart casual. Management has issued one hat. It is a wooden crate. Please wear it with pride, or at least on your head.'],
  build(L) {
    L.start(2.5, -3, 2.5, -5.5);
    /* ---- Hat Trick: the gate needs a weight on its plate while both robots go through. The only weight is a wooden crate,
            and wood cannot be pulled or pushed by a power. It can be worn, though. The hat rack is exactly head height:
            Nut walks the crate off it onto Bolt's head (or Bolt onto Nut's). Bolt rides the ring over the pit in his hat
            and reels Nut across. The low doorway knocks the hat off, right onto the plate. */
    L.floor(0, -8, 14, 0, 0); BW(L, 0, 14, 0);
    L.box(4.5, -8, 8.5, -5, -6, 1.1, 'shelf');
    L.crate(6.8, -5.6, 1.1, { wood: true });
    // golden cog: over the hat rack. Nut launches Bolt off the top of the rack.
    L.cog(5.2, 5.75, -6.2);
    L.anchor(15.5, 6.2, -4, { path: [[0, 0, 0], [9, 0, 0]], speed: 2 });
    BW(L, 14, 22, 0);
    // the plate sits in a shallow recess, flush with the floor, so stepping onto it does not jolt the hat off early
    L.floor(22, -8, 28.2, 0, 0); L.floor(28.2, -8, 30.6, -5.2, 0); L.floor(28.2, -2.8, 30.6, 0, 0); L.floor(30.6, -8, 44, 0, 0); BW(L, 22, 44, 0);
    L.floor(28.2, -5.2, 30.6, -2.8, -0.08); L.plate(29.4, -4, 1, -0.08, 1.2);
    L.box(30, -8, 33.5, 0, 1.25, 9, 'wall');
    L.gate(34, -8, 35, 0, 0, 10, [1]);
    L.exit(38, -6.5, 43, -1.5, 0);
    /* ---- checkpoints, zones, decoration */
    L.checkpoint(22.5, -8, 30, 0, 25, -2.5, 25, -5);
    L.checkpoint(35.5, -8, 44, 0, 37, -2.5, 37, -5);
    L.zone('hat', 3.5, -8, 9, 0);
    L.zone('ring', 11, -8, 14, 0);
    L.zone('door', 24, -8, 30, 0);
    L.zone('end', 37, -8, 44, 0);
    L.deco(2, -11, 3.5, -9.5, 0, 12, 'pipe'); L.deco(40, -11, 41.5, -9.5, 0, 12, 'pipe');
    L.sign(9, 2.2, -7.9, 'HAT RACK');
    L.sign(31.75, 3.6, 0.02, 'MIND YOUR HEAD'); // on the face of the low doorway, above the robots
  },
  zones: {
    hat: { say: ['The gate over the pit needs something heavy on its plate. The only heavy thing is that wooden crate. Bolt cannot pull wood. Nut cannot push it with her power.', 'Notice the rack is exactly head height. Bolt\'s head. That is not an accident. Nothing here is an accident, except the accidents.'], hint: 'Bolt stands right in front of the hat rack. Nut jumps onto the rack behind the crate and walks it forward, off the rack and onto Bolt\'s head. Then Bolt walks carefully. It stays on.' },
    ring: { say: ['Bolt, the ring will carry you over. Your hat will come too. Hats are very loyal.'], hint: 'Bolt holds X toward the moving ring and rides it over the pit, hat and all, and drops off on the far side. He faces Nut and reels her across, then lets go before turning round: a swinging Nut knocks hats off. If the hat falls in the pit, it goes back on the rack.' },
    door: { say: ['A low doorway. Robots fit under it. Hats do not. I am sure you will think of something. Or walk into it. Either way.'], hint: 'Walk under the doorway through the middle. The doorway knocks the hat off onto the teal plate, and the gate opens. If it lands off the plate, walk it on.' },
    end: { say: ['Very smart. Very casual. The hat stays here. It has found its place in life.'] },
  },
  outro: 'Overtime done. The hat has been returned to the hat department. There is a hat department. Do not ask about the hat department.',
};
