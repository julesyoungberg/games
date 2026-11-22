// Overtime 34. Unlocks after Shift 17. Uses: a switch, a bridge, an inverted gate, pulling Nut over a gap.
// The aha: one switch runs both the bridge and the door, backwards. Switch on: the bridge is out and the door is shut.
// Switch off: the door is open and the bridge is gone. Only Nut can push the switch, and it is out of her reach from the
// far side. So Bolt walks the bridge alone, Nut switches it off behind him, and Bolt reels her over the empty pit.
// The pit is 9 m wide, too wide to jump, and lasered from 3 m up so nobody is launched across. It is inside the magnet's 11 m.
// Back walls are 10 m tall so nobody launched at them can stand on one and walk over the door.
const BW = (L, x0, x1, top, h = 10) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');
const P0 = 14, P1 = 23; // the pit
const D = 27; // the door

export default {
  name: 'Reverse Psychology', sub: 'Overtime. The door opens when the switch is off. Try not to think about it.', theme: 3, after: 16,
  intro: ['Overtime! Tonight the wiring was done by the cheapest contractor in the building. It was a toaster. It did its best.'],
  build(L) {
    L.start(2.5, -3, 2.5, -5.5);
    L.floor(0, -8, P0, 0, 0); BW(L, 0, P0, 0);
    /* ---- Reverse Psychology: the teal switch puts the bridge out and shuts the door. Bolt crosses on the bridge,
            Nut switches it off behind him (the door opens), and Bolt reels her across the empty pit. */
    L.button(P0 - 0.9, -7.2, 1, 0);
    L.bridge(P0, -6, P1, -2, 0, [1]);
    BW(L, P0, P1, 0);
    L.laser(P0, -8, P1, 0, 3, 12); // a ceiling of laser over the pit: nobody is launched across it
    L.floor(P1, -8, 44, 0, 0); BW(L, P1, 44, 0);
    L.gate(D, -8, D + 1, 0, 0, 10, [1], { invert: true });
    L.exit(38, -6.5, 43, -1.5, 0);
    // golden cog: high over the far floor. Only a launch reaches it.
    L.cog(34, 4.7, -6.8);
    /* ---- checkpoints, zones, decoration */
    L.checkpoint(D + 1.5, -8, 36, 0, 31, -3, 31, -5);
    L.zone('wiring', 6, -8, P0, 0);
    L.zone('across', P1, -8, D, 0);
    L.zone('end', D + 1.5, -8, 44, 0);
    L.deco(7, -11, 8.5, -9.5, 0, 14, 'pipe'); L.deco(41, -11, 42.5, -9.5, 0, 14, 'pipe');
    L.sign(P0 - 0.9, 3, -7.9, 'BRIDGE');
    L.sign(D + 0.5, 4, -7.9, 'NOT BRIDGE');
  },
  zones: {
    wiring: { say: ['One switch runs the bridge and the door. When the bridge is out, the door is shut. When the door is open, the bridge is not. The toaster was very confident about this.', 'The red ceiling over the pit is a laser. It is there to stop anyone being thrown across. We have met you two.'], hint: 'Nut pushes the switch to put the bridge out. Bolt crosses alone. Nut pushes the switch again from her side: the bridge goes and the door opens. Nut walks up to the edge of the pit. Bolt stands at the far edge, faces Nut and holds X to reel her across.' },
    across: { say: ['Halfway there. Or all the way there, for one of you. Teamwork is mostly maths.'] },
    end: { say: ['Through the door. The toaster has been promoted to Head of Wiring. Please do not tell it.'] },
  },
  outro: 'Overtime done. You crossed a bridge that was not there, through a door that was not shut. The toaster calls that a feature.',
};
