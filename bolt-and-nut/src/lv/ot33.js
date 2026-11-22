// Overtime 33. Unlocks after Shift 7. Uses: a plate-driven lift, launching, pulling Nut.
// The aha: the lift is a pillar that sinks while its plate (far away on the ground) is pressed and rises when it is let go.
// So it only ever carries one robot up, the one who did not press. It stops 3.2 m short of the top floor. Bolt rides it,
// reels Nut up onto it, and from up there Nut's launch reaches the ledge. Nothing from the ground reaches the raised
// lift (a launch gets 3.9 m), and a boost on the lift gets 7.4 m, short of the 8 m ledge.
// Back walls are 10 m tall so nobody launched at them can stand on one.
const BW = (L, x0, x1, top, h = 10) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');
const Y = 8; // the ledge
const L0 = 16, L1 = 19.5, LH = 4.8; // the lift and how high it goes

export default {
  name: 'Elevator Pitch', sub: 'Overtime. You have until the top floor to make your case.', theme: 7, after: 6,
  intro: ['Overtime! Tonight you are pitching an idea to the board. The board is on the top floor. The lift is not cooperating. Neither is the board.'],
  build(L) {
    L.start(2.5, -3, 2.5, -5.5);
    L.floor(0, -8, L0, 0, 0); BW(L, 0, L0, 0);
    /* ---- Elevator Pitch: the lift sinks while the plate is pressed. Nut calls it, Bolt steps on, Nut steps off and up he goes.
            Bolt reels Nut up onto the lift, Nut launches Bolt onto the ledge, and Bolt reels her up after him. */
    L.plate(11, -6.4, 1, 0, 0.9);
    BW(L, L0, L1, LH);
    L.mover(L0, -8, L1, 0, LH, [[0, 0, 0], [0, -LH, 0]], 2.5, [1], LH + 0.6); // a solid pillar: nobody gets under it
    L.floor(L1, -8, 34, 0, Y); BW(L, L1, 34, Y);
    L.exit(29, -6.5, 33, -1.5, Y);
    // golden cog: high over the back of the lift. Only a launch from the raised lift reaches it.
    L.cog(17, 9, -7);
    /* ---- checkpoints, zones, decoration */
    L.checkpoint(L1 + 1, -8, 27, 0, 24, -3, 24, -5);
    L.zone('lobby', 1, -8, 10, 0);
    L.zone('lift', 10, -8, L1, 0);
    L.zone('board', L1 + 1, -8, 34, 0, Y - 1, 50);
    L.deco(8, -11, 9.5, -9.5, 0, 14, 'pipe'); L.deco(31, -11, 32.5, -9.5, Y, 20, 'pipe');
    L.sign(11, 2.2, -7.9, 'CALL LIFT');
    L.sign(17.75, LH + 4.6, -7.9, 'BOARDROOM');
  },
  zones: {
    lobby: { say: ['The boardroom is upstairs. The lift is right there. What could possibly go wrong.'] },
    lift: { say: ['To call the lift, stand on the plate. It comes down. Step off, and it goes back up. With whoever is on it. Not with you.', 'The lift stops a bit short of the top floor. Facilities call that a gap in the market.'], hint: 'Nut stands on the plate to bring the lift down. Bolt steps on, and Nut steps off, so the lift carries Bolt up. Bolt faces Nut and holds X to reel her up onto the lift. Then Nut stands just behind Bolt and presses X to launch him onto the ledge, and Bolt reels her up again.' },
    board: { say: ['You made it to the boardroom. The board is impressed. The board is a plank. It is always impressed.'] },
  },
  outro: 'Overtime done. Pitch delivered. The lift has asked for a pay rise. It keeps going up and down about it.',
};
