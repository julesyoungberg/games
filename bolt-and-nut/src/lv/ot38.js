// Overtime 38. Unlocks after Shift 31 (Fire Drill). Uses: factory clocks, clocked bridges, a clocked fan, laser and gate.
// 1. Four bridges on two clocks that take turns: hop from one to the next just before the one under you switches off.
// 2. The fan, the laser in front of it and the gate at the top all run off one clock: the laser drops only while the
//    fan runs, and the gate opens only while it rests.
const BW = (L, x0, x1, top, h = 10) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');
const Y = 5; // the upper floor

export default {
  name: 'Clockwork', sub: 'Overtime. Everything in here runs on the factory clock. Keep time.', theme: 5, after: 30,
  intro: ['Overtime! Tonight the whole floor runs on the factory clock. When it ticks, things appear. When it tocks, they do not. Please be on the right side of that.'],
  build(L) {
    L.start(2.5, -3, 2.5, -5.5);
    L.floor(0, -8, 8, 0, 0); BW(L, 0, 38, 0);
    /* ---- 1. Turnstile: two clocks, four bridges, taking turns */
    L.clock(13.2, -8.4, 4, 1.8, 1.4, 0);
    L.clock(22.8, -8.4, 5, 1.8, 1.4, 1.6);
    L.bridge(8.8, -8, 12.8, 0, 0, [4]);
    L.bridge(13.6, -8, 17.6, 0, 0, [5]);
    L.bridge(18.4, -8, 22.4, 0, 0, [4]);
    L.bridge(23.2, -8, 27.2, 0, 0, [5]);
    L.floor(28, -8, 38, 0, 0);
    /* ---- 2. The lift: laser, fan and gate on one clock */
    L.clock(35, -7.3, 2, 2.0, 2.6, 0);
    L.laser(37.4, -8, 37.7, 0, 0, 4, [2]);
    L.fan(38, -6, 41, -2, 0, Y + 1.5, [2]);
    L.floor(38, -8, 41, -6, 0); L.floor(38, -2, 41, 0, 0);
    L.floor(41, -8, 58, 0, Y); BW(L, 38, 58, Y);
    L.gate(47.5, -8, 48, 0, Y, Y + 4, [2], { invert: true });
    L.exit(52, -6.5, 56.5, -1.5, Y);
    // golden cog: high over the top of the fan. Nut launches Bolt back out over it from the upper floor.
    L.cog(40, Y + 4.2, -4);
    L.checkpoint(28.5, -8, 34, 0, 30, -3, 30, -5.5);
    L.checkpoint(41.5, -8, 47, 0, 43, -3, 43, -5.5);
    L.zone('turn', 3, -8, 8, 0);
    L.zone('lift', 31, -8, 37, 0);
    L.zone('cog', 41.5, -8, 47, 0, Y - 1, 50);
    L.zone('end', 50, -8, 58, 0, Y - 1, 50);
    L.deco(4, -11, 5.5, -9.5, 0, 14, 'pipe'); L.deco(54, -11, 55.5, -9.5, Y, 14, 'pipe');
    L.sign(18, 2.4, -7.9, 'KEEP TIME');
    L.sign(44, Y + 2.4, -7.9, 'TICK, TOCK');
  },
  zones: {
    turn: { say: ['Four bridges, two clocks. Green and purple take turns. When one goes, the next one comes. Hop just before the floor under you clocks off.'], hint: 'Stand on a bridge while its clock is lit. Just as the hand reaches the end of the coloured part, hop to the next bridge, which is about to come on.' },
    lift: { say: ['One clock runs the fan, the laser and the gate. The laser rests while the fan runs. The gate opens while the fan rests. Keep up.'], hint: 'Wait for the orange bulb. The laser goes off and the fan starts at the same moment. Ride the fan up, step onto the high floor, and go through the gate when the fan stops.' },
    cog: { say: ['There is a golden cog over the top of the fan. Nut, you know what to do with Bolt.'], hint: 'Optional golden cog: Bolt stands near the edge of the high floor, Nut behind him, and Nut launches him back out over the fan.' },
    end: { say: ['On time. The clock does not care. The narrator does, a little.'] },
  },
  outro: 'Overtime done. The clock is still ticking. It will be ticking long after we are all gone. Clocks are like that.',
};
