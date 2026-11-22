// Overtime 2. Unlocks after Shift 8. Adds: movers, timed and channel lasers, fans.
const BW = (L, x0, x1, top, h = 3) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');

export default {
  name: 'Mandatory Fun', sub: 'Overtime. Attendance is optional. Fun is not.', theme: 6, after: 7,
  intro: [
    'Welcome to the team building exercise. Participation is voluntary, and has been recorded.',
  ],
  build(L) {
    L.start(2.5, -3, 2.5, -5.5);
    L.cog(14, 4.4, -7);
    L.floor(0, -8, 32, 0, 0); BW(L, 0, 32, 0);
    // puzzle 1: a crate in a cubby, and a laser fence with its plate on the wrong side
    L.box(5, -8, 10, -5, -6, 2.6, 'shelf');
    L.box(5, -5.3, 10, -5, 2.6, 3.1, 'wall');
    L.box(5, -8, 5.3, -5.3, 2.6, 3.1, 'wall'); L.box(9.7, -8, 10, -5.3, 2.6, 3.1, 'wall');
    L.crate(6.5, -6.6, 2.6);
    L.laser(20, -8, 20.3, 0, 0, 9, [1]);
    L.plate(21.8, -6.3, 1, 0);
    // puzzle 2: a fan that needs a plate, with a blinking laser across the shaft
    L.plate(29, -6.3, 2, 0);
    L.fan(32, -6, 35, -2, 0, 8, [2]);
    L.floor(32, -8, 35, -6, 0); L.floor(32, -2, 35, 0, 0); BW(L, 32, 35, 0);
    L.laser(32, -8, 35, 0, 3.2, 3.6, null, [1.4, 1.6, 0]);
    L.floor(35, -8, 48, 0, 7); BW(L, 35, 48, 7);
    L.exit(42, -6.5, 46, -1.5, 7);
    L.checkpoint(20.5, -8, 32, 0, 23, -2.5, 23, -4.5);
    L.checkpoint(35.5, -8, 48, 0, 37, -2.5, 37, -5);
    L.zone('fence', 3, -8, 8, 0);
    L.zone('fan', 24, -8, 32, 0);
    L.zone('end', 37, -8, 48, 0, 6, 50);
    L.deco(2, -11, 3.5, -9.5, 0, 9, 'pipe'); L.deco(45, -11, 46.5, -9.5, 7, 15, 'pipe');
    L.sign(15, 1.6, -7.9, 'TEAM BUILDING');
  },
  zones: {
    fence: { say: ['The plate that turns off the fence is behind the fence. Lasers only zap robots, though. Crates do not count. Legally.'], hint: 'Nut launches Bolt into the cubby. Bolt carries the crate to the laser fence and lets go with it on the far side, right over the plate.' },
    fan: { say: ['The fan needs the plate. The blinking laser needs patience. One of you goes up first. Choose wisely.'], hint: 'Nut holds the plate. Bolt rides the fan up while the laser is off. Then Bolt pulls Nut up when it blinks off again. Or bring the crate.' },
    end: { say: ['Well done. That was fun. It was mandatory, so it was fun.'] },
  },
  outro: 'Overtime complete. Team building achieved. The team has been built. Please do not take it apart.',
};
