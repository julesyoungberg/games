// Overtime 18. Unlocks after Shift 8. Uses: fans (crates float too), pulling crates, crate throws (Nut can push in mid-air),
// plates, a plate-driven fan, a gate with two plates, launching, lasers.
// Back walls downstairs are 12 m tall so nobody hovering in the fan (or jumping off Nut's head up there) can stand on one.
const BW = (L, x0, x1, top, h = 6) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');
const Y = 9.5; // the upstairs floor

export default {
  name: 'Blue Sky Thinking', sub: 'Overtime. Ideas float to the top. So do crates.', theme: 3, after: 7,
  intro: ['Overtime! Tonight is a brainstorm. Management has asked for some blue sky thinking. We found a fan, a crate and a bit of sky. It will have to do.'],
  build(L) {
    L.start(2.5, -3, 2.5, -5.5);
    /* ---- 1. Blue Sky Thinking: the plate that runs the big fan is on a shelf nobody can stand on (it is lasered).
            The little fan floats robots and crates to just below it. Bolt fetches the crate and drops it in the fan,
            Nut floats up beside it and pushes it in mid-air, and it lands on the plate. A throw that hits the shelf falls back into the fan. */
    L.floor(0, -8, 11, 0, 0);
    L.box(4.5, -11, 7.5, -8, -6, 4.5, 'shelf'); L.box(4.5, -12, 7.5, -11, -6, 7, 'backwall');
    L.crate(6, -9.5, 4.5);
    L.fan(11, -6, 14.5, -2.5, 0, 6.5);
    L.floor(11, -8, 14.5, -6, 0); L.floor(11, -2.5, 14.5, 0, 0);
    L.floor(14.5, -8, 20, 0, 0);
    L.box(14.5, -6, 17.5, -2.5, -6, 9.0, 'shelf');
    L.plate(16, -4.25, 1, 9.0, 1.2);
    L.laser(14.5, -6, 17.5, -2.5, 9.15, 12.5);
    L.fan(20, -6, 23, -2, 0, 10.2, [1]);
    L.floor(20, -8, 23, -6, 0); L.floor(20, -2, 23, 0, 0);
    BW(L, 0, 4.5, 0, 12); BW(L, 7.5, 23, 0, 12);
    /* ---- 2. Paperweight: the plate for the gate sits on a floor vent. Anything put down on it floats off.
            Anything Bolt is holding does not. Bolt holds the crate down on it, Nut goes through and stands on the far plate. */
    L.box(23, -8, 28, 0, -6, Y, 'floor');
    L.fan(28, -6, 31, -2.5, Y, 2.4); L.box(28, -6, 31, -2.5, -6, Y - 6, 'floor');
    L.box(28, -8, 31, -6, -6, Y, 'floor'); L.box(28, -2.5, 31, 0, -6, Y, 'floor');
    L.plate(29.5, -4.25, 2, Y);
    L.box(31, -8, 48, 0, -6, Y, 'floor'); BW(L, 23, 48, Y);
    L.gate(35, -8, 36, 0, Y, Y + 10, [2, 3], { any: true });
    L.plate(39.5, -6.3, 3, Y);
    L.exit(42, -6.5, 47, -1.5, Y);
    // golden cog: up in the corner by the stairs fan. Too high for a jump or a boost: Nut launches Bolt.
    L.cog(25, Y + 4.2, -6.6);
    /* ---- checkpoints, zones, decoration */
    L.checkpoint(23.5, -8, 34.5, 0, 25, -2.5, 25, -5);
    L.checkpoint(36.5, -8, 48, 0, 38, -2.5, 38, -4.5);
    L.zone('sky', 7, -8, 10, 0);
    L.zone('weight', 24, -8, 34.5, 0, Y - 1, 50);
    L.zone('end', 38, -8, 48, 0, Y - 1, 50);
    L.deco(2, -11, 3.5, -9.5, 0, 14, 'pipe'); L.deco(44, -11, 45.5, -9.5, Y, 18, 'pipe');
    L.sign(9, 2.2, -7.9, 'BLUE SKY');
    L.sign(26, Y + 2.2, -7.9, 'PAPERWEIGHT');
  },
  zones: {
    sky: { say: ['The plate for the big fan is up on that shelf. The shelf is lasered. Robots may not stand on it. Crates may. Crates have no ambitions.', 'The little fan lifts anything. Robots. Crates. Morale. Nut, you can push in mid-air. You do not need a floor to have an idea.'], hint: 'Bolt pulls the crate off the high shelf and drops it in the little fan. Nut floats up in the fan right behind it, on the side away from the shelf, and presses X while the crate bobs high: it flies onto the teal plate. A miss just falls back into the fan. The big fan starts. Ride it up together.' },
    weight: { say: ['The gate plate is on a vent. Anything you put down on it floats away. Including you. Especially you.', 'Bolt, things you are holding ignore fans. And your crate is still downstairs, keeping a fan on that you no longer need.'], hint: 'Bolt pulls the crate up off the teal shelf. He stands next to the vent and holds the crate down on the orange plate. Nut goes through the gate and stands on the pink plate. Then Bolt lets go and follows.' },
    end: { say: ['Excellent. Blue sky thinking, delivered. Management would like the sky back by Monday.'] },
  },
  outro: 'Overtime done. The brainstorm produced one idea. It was a crate. Management has called it a disruptor.',
};
