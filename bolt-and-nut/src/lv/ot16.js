// Overtime 16. Unlocks after Shift 6. Uses: pulling crates, launching crates and Bolt, lasers, plates, a plate-driven lift.
// Back walls are 6 m tall (10 m beside the lift) so nobody launched off the lift can stand on one and walk to the ledge.
const BW = (L, x0, x1, top, h = 6) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');
const Y = 6.8; // the high floor

export default {
  name: 'Office Olympics', sub: 'Overtime. Shot put, then high jump. No medals. Some lanyards.', theme: 4, after: 5,
  intro: ['Overtime! Tonight is the Office Olympics. Two events. The crate put, and the high jump. Management will be judging. From home.'],
  build(L) {
    L.start(2.5, -3, 2.5, -5.5);
    /* ---- 1. Crate Put: the plate that switches off the laser is behind the laser, too far to carry a crate to.
            The crate is on a high shelf. Bolt pulls it down, and Nut throws it through the laser onto the plate. */
    L.floor(0, -8, 29, 0, 0); BW(L, 0, 5, 0); BW(L, 8, 14, 0);
    L.box(5, -11, 8, -8, -6, 4.5, 'shelf'); L.box(5, -12, 8, -11, -6, 7, 'backwall');
    L.crate(6.5, -9.5, 4.5);
    L.cog(10.5, 5.6, -2);
    L.laser(14, -9.5, 14.3, 0, -6, 14, [1]);
    L.plate(18.6, -4.5, 1, 0, 1.2);
    /* ---- 2. High Jump: the lift only rises halfway, and only while its plate is pressed. Nobody gets to the top from halfway,
            and nobody can get on once it has gone. So everybody boards with the crate, and Nut throws it onto the plate from the lift.
            At the top, Nut launches Bolt off the lift. */
    L.plate(22, -2.5, 2, 0, 1.2);
    L.mover(25.8, -6.5, 29, -1.5, 0.02, [[0, 0, 0], [0, 3.8, 0]], 2.5, [2]);
    BW(L, 14, 29, 0, 10);
    L.floor(29, -8, 46, 0, Y); BW(L, 29, 46, Y, 4);
    L.exit(40, -6.5, 45, -1.5, Y);
    /* ---- checkpoints, zones, decoration */
    L.checkpoint(15, -8, 25.3, 0, 16.5, -2, 16.5, -6.5);
    L.checkpoint(29.5, -8, 46, 0, 31, -2.5, 31, -5);
    L.zone('put', 9, -8, 14, 0);
    L.zone('jump', 20, -8, 25.3, 0);
    L.zone('end', 31, -8, 46, 0, Y - 1, 50);
    L.deco(2, -11, 3.5, -9.5, 0, 10, 'pipe'); L.deco(42, -11, 43.5, -9.5, Y, 16, 'pipe');
    L.sign(11, 1.8, -7.9, 'CRATE PUT');
    L.sign(21, 1.8, -7.9, 'HIGH JUMP');
  },
  zones: {
    put: { say: ['Event one. The plate behind the laser turns the laser off. Nobody can walk a crate over there. The laser has views on that.', 'Crates go through lasers, though. Nut, you have a very strong throwing arm. You have no arms. Use the arm you do not have.'], hint: 'Bolt pulls the crate down from the high shelf. Put it on the floor a little way before the laser. Nut stands behind it and presses X: the crate flies through the laser and lands on the teal plate.' },
    jump: { say: ['Event two. The lift goes halfway up while its plate is pressed. Halfway is not the top. The top is the top.', 'And it leaves without you. You will want your crate back. It is sitting on a plate, doing nothing. Typical.'], hint: 'Bolt pulls the crate back off the teal plate and drops it on the lift. Both of you get on. Nut stands behind the crate and throws it onto the orange plate, and the lift carries you up. At the top, Nut launches Bolt onto the ledge, and Bolt pulls Nut up.' },
    end: { say: ['A clean sweep. Gold in the crate put. Gold in the high jump. The medals are chocolate. Management ate them.'] },
  },
  outro: 'Overtime done. The Office Olympics are over until next year. Please return your lanyards to the lanyard bin.',
};
