// Shift 14: Quality Control. The robots test the factory's own machinery.
// Every puzzle combines two (or more) machines at once.
const BW = (L, x0, x1, top, h = 3) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');

export default {
  name: 'Quality Control', sub: 'Shift 14. Testing the machines that test the machines.', theme: 7,
  intro: [
    'Shift fourteen. Quality Control. Today you are not the ones being tested. The machines are.',
    'Every machine in here must be used, twice, together, by two robots. Then it gets a sticker. You do not get a sticker.',
  ],
  build(L) {
    L.start(2.5, -3, 2.5, -5.5);
    /* ---- 1. Bounce Test: plate + belt + wooden crate + spring behind a laser curtain */
    L.floor(0, -4.6, 24, 0, 0);
    L.floor(0, -8, 6, -4.6, 0);
    L.crate(4, -6.3, 0, { wood: true });
    L.conveyor(6, -8, 12, -4.6, 0, -2.5, 0, [1]);
    L.spring(12, -8, 14, -4.6, -0.3, 18);
    L.laser(12, -8, 14, -4.75, 0.4, 8);
    L.box(14, -8, 17, -4.6, -6, 4.2, 'shelf');
    L.plate(15, -6.3, 2, 4.2);
    L.box(17, -8, 17.6, -4.6, -6, 7, 'wall');
    L.floor(17.6, -8, 24, -4.6, 0);
    L.plate(8.5, -2.4, 1, 0);
    L.gate(21, -8, 22, 0, 0, 10, [2]);
    BW(L, 0, 24, 0);
    /* ---- 2. Reverse Polarity: one switch flips the belt AND kills the laser; anchors + pull */
    L.floor(24, -8, 30, 0, 0); BW(L, 24, 30, 0);
    L.button(27.5, -7, 3);
    L.conveyor(30, -8, 39, 0, 0, 9, 0, [3]); BW(L, 30, 39, 0);
    L.laser(34.3, -8, 34.7, 0, 0, 9, [3]);
    L.anchor(32.6, 5, -4); L.anchor(37, 5, -4);
    L.floor(39, -8, 48, 0, 0); BW(L, 39, 48, 0);
    /* ---- 3. Wind Tunnel: Nut holds the plate that runs the fan; Bolt flies up; Bolt pulls Nut */
    L.plate(44.5, -6.3, 4, 0);
    L.fan(48, -8, 51, 0, 0, 7.5, [4]); BW(L, 48, 51, 0);
    L.floor(51, -8, 62, 0, 6); BW(L, 51, 62, 6);
    /* ---- 4. Lift Inspection: plate opens a hatch over a spring; iron crate holds it open from above */
    L.plate(56, -6.3, 5, 6);
    L.spring(62, -8, 64, 0, 6, 20);
    L.bridge(61.6, -8, 64, 0, 11, [5], { invert: true });
    L.floor(64, -8, 80, 0, 11); BW(L, 62, 80, 11);
    L.plate(66.5, -6.3, 5, 11);
    L.crate(71, -3, 11);
    /* ---- 5. Transit + Final Inspection: mover, iron rocket, switch, laser-caged spring */
    L.mover(80.2, -6, 83, -2, 11, [[0, 0, 0], [4.8, 0, 0]], 2.5);
    L.floor(88, -8, 95.5, 0, 11); BW(L, 88, 97.5, 11);
    L.iron(88, -8, 90.2, -5, 11);
    L.box(90.2, -8, 93.5, -5.5, 5, 14.6, 'shelf');
    L.button(92.6, -7, 1, 14.6);
    L.spring(95.5, -8, 97.5, 0, 11, 20);
    L.laser(95.3, -8, 97.7, 0, 11.4, 20, [1]);
    L.floor(97.5, -8, 108, 0, 16); BW(L, 97.5, 108, 16);
    L.exit(102, -6.5, 106, -1.5, 16);
    L.cog(63, 12.6, -1);
    /* ---- checkpoints, zones, decoration */
    L.checkpoint(22.5, -8, 30, 0, 24, -2.5, 24, -5);
    L.checkpoint(39.5, -8, 47.8, 0, 40.5, -2.5, 40.5, -5);
    L.checkpoint(51.5, -8, 61.5, 0, 52.5, -2.5, 52.5, -5);
    L.checkpoint(64.5, -8, 80, 0, 74, -2.5, 74, -5);
    L.checkpoint(88.5, -8, 95, 0, 93, -2.5, 93.5, -4);
    L.checkpoint(98, -8, 108, 0, 99.5, -2.5, 99.5, -5);
    L.zone('bounce', 3, -8, 8, 0);
    L.zone('polarity', 24.5, -8, 30, 0);
    L.zone('wind', 40, -8, 47.8, 0);
    L.zone('lift', 52, -8, 61.5, 0, 4, 50);
    L.zone('transit', 75, -8, 80, 0, 9, 50);
    L.zone('final', 88.5, -8, 95, 0, 9, 50);
    L.zone('end', 99, -8, 108, 0, 14, 50);
    L.deco(3, -11, 4.5, -9.5, 0, 9, 'pipe'); L.deco(45, -11, 46.5, -9.5, 0, 12, 'pipe'); L.deco(104, -11, 105.5, -9.5, 16, 25, 'pipe');
    L.sign(5, 1.6, -7.9, 'QUALITY CONTROL');
    L.sign(66, 12.6, -7.9, 'INSPECTED BY: ?');
  },
  zones: {
    bounce: { say: ['Test one. A belt, a spring, and a crate. The laser curtain keeps robots off the spring. Crates are not robots. Crates do not care about lasers.', 'Somebody hold the belt plate. Somebody else feed it a crate.'], hint: 'Nut stands on the teal plate so the belt runs toward the spring. Bolt shoves the wooden crate onto the belt. The spring throws it up onto the orange plate.' },
    polarity: { say: ['Test two. This switch reverses the belt and switches off the laser. At the same time. Somebody in Engineering thought that was efficient.', 'Belt forward, laser on. Laser off, belt backward. Robots, find a third option. Possibly above.'], hint: 'Nut flips the pink switch: the laser goes off, the belt runs backward. Bolt swings across on the anchors, then pulls Nut over the belt.' },
    wind: { say: ['Test three. A fan, and a plate that powers it. The fan only blows while someone stands on the plate. Which means someone does not get to fly. Sorry. Ahead of time.'], hint: 'Nut stands on the lime plate. Bolt walks into the fan and floats up onto the high ledge. Then Bolt pulls Nut up.' },
    lift: { say: ['Test four. A spring under a hatch. The hatch opens while the purple plate is pressed.', 'There is another purple plate upstairs. I wonder what that is for. I do not wonder. I wrote it.'], hint: 'Nut holds the purple plate. Bolt bounces up through the hatch, then puts the iron crate on the upstairs plate. The hatch stays open for Nut.' },
    transit: { say: ['A moving platform. Not a test. Just a commute. Enjoy it. That is an instruction.'], hint: 'Ride the moving platform across the gap together.' },
    final: { say: ['Final inspection. The spring is behind a laser. The laser switch is up on that shelf. The shelf is up. Nut, there is iron under your feet.'], hint: 'Nut stands on the iron and presses X to rocket up to the shelf, then flips the teal switch. The laser goes off. Both of you bounce up to the exit.' },
    end: { say: ['Every machine tested. Every machine passed. I have put a sticker on each one. They say "Good Job". Nobody has ever given me a sticker.'] },
  },
  outro: 'Shift fourteen complete. Quality Control reports: the machines work, and so do you. Mostly. Seven out of ten.',
};
