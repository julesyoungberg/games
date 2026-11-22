// Overtime 25. Unlocks after Shift 9. Uses: launching, pulling Nut, plates, a channel fan.
// The aha: the fan and its plate share one small shelf. Somebody has to stay on the plate while the other rides up,
// and only one of you can fetch the other afterwards. So Nut holds the plate and Bolt goes up first.
// If Nut goes up first she can drop back down to the floor and start again, so nothing soft-locks.
// Back walls are 12 m tall so nobody launched at them can stand on one.
const BW = (L, x0, x1, top, h = 12) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');
const S = 3.4; // the fan shelf
const Y = 9; // the top floor

export default {
  name: 'Hot Air', sub: 'Overtime. Management produces plenty of it. Tonight it is finally useful.', theme: 6, after: 8,
  intro: ['Overtime! The air conditioning has been moved to a shelf. Nobody knows why. Facilities said it was for the views.'],
  build(L) {
    L.start(2.5, -3, 2.5, -5.5);
    /* ---- 1. Office Space: the shelf is too high to jump to or to boost to. Nut launches Bolt up, and Bolt reels her up after him. */
    L.floor(0, -8, 17, 0, 0); BW(L, 0, 17, 0);
    L.box(12, -8, 14.5, -3, -6, S, 'shelf'); L.box(14.5, -5, 16.5, -3, -6, S, 'shelf');
    /* ---- 2. Hot Air: the fan only blows while the plate next to it is pressed. One rides up, one stays on the plate.
            The one who rides up has to be able to fetch the other one. That is Bolt. */
    L.plate(13.2, -4.2, 2, S, 0.75);
    L.fan(14.5, -8, 16.5, -5, S, 6.5, [2]);
    L.floor(17, -8, 40, 0, Y); BW(L, 17, 40, Y);
    L.exit(34, -6.5, 38.5, -1.5, Y);
    // golden cog: high over the top floor. A boost misses it. A launch does not.
    L.cog(28, Y + 3.9, -4);
    /* ---- checkpoints, zones, decoration */
    L.checkpoint(19, -8, 30, 0, 21, -3, 21, -5);
    L.zone('shelf', 6, -8, 12, 0, -5, 3);
    L.zone('air', 12, -8, 16.5, -3, S - 0.5, S + 2);
    L.zone('end', 30, -8, 40, 0, Y - 1, 60);
    L.deco(3, -11, 4.5, -9.5, 0, 14, 'pipe'); L.deco(36, -11, 37.5, -9.5, Y, 20, 'pipe');
    L.sign(7, 2.2, -7.9, 'HOT AIR');
    L.sign(13.2, S + 2.2, -7.9, 'FACILITIES');
    L.sign(26, Y + 2.2, -7.9, 'TOP TABLE');
  },
  zones: {
    shelf: { say: ['Facilities have put the fan on a shelf. The shelf is too high for jumping. It is not too high for being thrown.', 'Bolt, you will be thrown. Nut, you will be fetched. Everyone has a role.'], hint: 'Nut stands next to Bolt and presses X, and Bolt steers onto the shelf. Then Bolt faces Nut, holds X and walks back, reeling her up.' },
    air: { say: ['The fan only blows while somebody stands on the plate. Somebody, then, will not be going up with the fan.', 'Choose carefully. Only one of you can fetch the other. The other one can only shove.'], hint: 'Nut stands on the orange plate. Bolt steps onto the fan and steers onto the top floor. Then Bolt faces Nut, holds X and walks back from the edge to reel her up. If Nut went up first, she can drop back to the floor and try again.' },
    end: { say: ['You have reached the boardroom. It is mostly a table. The table is the meeting.'] },
  },
  outro: 'Overtime done. You rose on hot air alone. Several managers have asked how. Please do not tell them.',
};
