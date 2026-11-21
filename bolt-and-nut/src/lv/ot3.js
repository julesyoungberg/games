// Overtime 3. Unlocks after Shift 12. Adds: conveyor belts, switches, wooden crates.
const BW = (L, x0, x1, top, h = 3) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');

export default {
  name: 'Inventory Day', sub: 'Overtime 3. Count everything. Then lift it.', theme: 4, after: 11,
  intro: [
    'Inventory Day. Every crate must be counted, moved, and placed on a plate. In that order. Mostly.',
  ],
  build(L) {
    L.start(2.5, -2.5, 2.5, -4.5);
    L.cog(3, 4.4, -7);
    // ground floor: a belt on a high shelf, with a scrap chute under its end
    L.floor(0, -5.6, 18, 0, 0); L.floor(0, -8, 5.4, -5.6, 0); L.floor(13.6, -8, 18, -5.6, 0); BW(L, 0, 18, 0);
    L.box(5.4, -8, 6, -5.6, -6, 3, 'wall');
    L.conveyor(6, -8, 12, -5.6, 1.55, -3, 0, [1]);
    L.crate(9, -6.8, 1.55, { wood: true });
    L.button(3.5, -7, 1, 0);
    L.crate(3, -2.2, 0);
    L.sign(12.8, 2.4, -7.9, 'SCRAP');
    // upper floor: a low slot, two plates, a gate
    L.floor(18, -8, 42, 0, 2.6); BW(L, 18, 42, 2.6);
    L.box(22, -8, 22.4, 0, 4.2, 8.6, 'wall');
    L.plate(21.4, -6.8, 2, 2.6); L.plate(26.5, -6.8, 3, 2.6);
    L.gate(30, -8, 31, 0, 2.6, 12, [2, 3]);
    L.exit(36, -6.5, 40, -1.5, 2.6);
    L.checkpoint(18.5, -8, 30, 0, 19.5, -2.5, 19.5, -4.5);
    L.checkpoint(31.5, -8, 42, 0, 33, -2.5, 33, -5);
    L.zone('stock', 1, -8, 6, 0);
    L.zone('slot', 18.2, -8, 30, 0, 2, 50);
    L.zone('end', 32, -8, 42, 0, 2, 50);
    L.deco(1, -11, 2.5, -9.5, 0, 9, 'pipe'); L.deco(39, -11, 40.5, -9.5, 2.6, 11, 'pipe');
    L.sign(24, 4.8, -7.9, 'RETURNS');
  },
  zones: {
    stock: { say: ['Two plates upstairs. One iron crate, one wooden crate. Magnets do not like wood. But wood does like a ride.'], hint: 'Bolt holds the iron crate under the end of the belt. Nut flips the switch, and the wooden crate rides onto it. Then carry both together.' },
    slot: { say: ['That slot is just tall enough for an iron crate. Not for an iron crate wearing a wooden hat.'], hint: 'Bolt goes through the slot and pulls the stacked crates up from below. The slot knocks the wooden crate off onto its plate. Put the iron crate on the other plate.' },
    end: { say: ['Inventory complete. Two crates. Two robots. One very tired Facilitator.'] },
  },
  outro: 'Overtime complete. Everything is counted. You count too. Mostly as robots.',
};
