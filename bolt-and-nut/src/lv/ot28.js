// Overtime 28. Unlocks after Shift 27. Uses: rocketing off iron, standing on heads, launching, pulling Nut.
// The aha: a rocket carries whoever is standing on Nut's head. Bolt rides her rocket up, and at the top, while she is
// still under his feet, he jumps off her. That is higher than anything else in the room: a launch or a rocket reaches 3.9 m,
// riding the rocket without jumping 4.8 m, riding it and jumping off at the top 6.1 m. The upper floor is 5.3 m.
// There are no shelves or crates in the lobby, so Nut has nowhere higher to launch Bolt from.
// Back walls are 14 m tall so nobody launched at them can stand on one.
const BW = (L, x0, x1, top, h = 14) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');
const Y = 5.3; // the upper floor

export default {
  name: 'Upward Mobility', sub: 'Overtime. The fastest way up is to stand on somebody who is already going.', theme: 7, after: 26,
  intro: ['Overtime! Senior management is on the upper floor. Nobody has ever been promoted to it. People have been thrown at it.'],
  build(L) {
    L.start(2.5, -3, 2.5, -5.5);
    L.floor(0, -8, 20, 0, 0); BW(L, 0, 24, 0);
    /* ---- Upward Mobility: the iron patch by the wall. Bolt stands on Nut's head, Nut rockets, and at the top of the
            rocket Bolt jumps off her and steers onto the upper floor. Then he reels Nut up. */
    L.iron(20, -8, 24, 0, 0);
    L.box(24, -8, 44, 0, -6, Y, 'floor'); BW(L, 24, 44, Y);
    L.exit(37.5, -6.5, 42.5, -1.5, Y);
    // golden cog: high over the upper floor. Only Nut, standing up there, can launch Bolt that high.
    L.cog(31, Y + 4.3, -6.5);
    /* ---- checkpoints, zones, decoration */
    L.checkpoint(25, -8, 34, 0, 27, -3, 27, -5);
    L.zone('mobility', 13, -8, 24, 0);
    L.zone('top', 25, -8, 44, 0, Y - 1, 50);
    L.deco(5, -11, 6.5, -9.5, 0, 16, 'pipe'); L.deco(40, -11, 41.5, -9.5, Y, 20, 'pipe');
    L.sign(17, 2.4, -7.9, 'CAREER PATH');
    L.sign(29, Y + 2.4, -7.9, 'SENIOR MANAGEMENT');
  },
  zones: {
    mobility: { say: ['The upper floor is higher than Nut can rocket and higher than she can throw Bolt. We have measured. Someone filled in a form.', 'Remember, when Nut goes up, anything standing on her goes up too. That is how careers work.'], hint: 'Bolt stands on Nut\'s head while she stands on the iron by the wall. Nut presses X and rockets up, carrying Bolt. At the very top, while she is still under him, Bolt presses A to jump off her and steers onto the upper floor. Then he faces Nut, holds X and walks back to reel her up.' },
    top: { say: ['Welcome to senior management. You will notice it is just a slightly higher floor. That is the secret. Please do not tell anyone.'] },
  },
  outro: 'Overtime done. You rose through the company by standing on each other. HR says this is fine as long as nobody writes it down.',
};
