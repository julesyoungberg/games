// Bolt & Nut — levels ("shifts"). x to the right, z toward the camera, lane is roughly z -8..0.
// Bolt (red) PULLS: partner, crates, anchors (hold power). Nut (blue) PUSHES: launches partner and crates,
// and rockets herself off iron floors.

import S13 from './lv/s13.js';
import S14 from './lv/s14.js';
import S15 from './lv/s15.js';
import S16 from './lv/s16.js';
import OT1 from './lv/ot1.js';
import OT2 from './lv/ot2.js';
import OT3 from './lv/ot3.js';
import OT4 from './lv/ot4.js';
import OT5 from './lv/ot5.js';

const BW = (L, x0, x1, top, h = 3) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');

export const LEVELS = [
  /* ------------------------------------------------------------ 1 */
  {
    name: 'Orientation', sub: 'Shift 1. Please keep your limbs inside the robot.', theme: 0,
    intro: [
      'Hello, and welcome to Attraction Industries! I am Margaret, your Orientation Facilitator.',
      'You are Bolt, in red, and Nut, in blue. Our two newest employees. Our only employees, technically.',
      'Today you will learn to walk, jump, and leave a room together. Exciting stuff. Try to contain yourselves.',
    ],
    build(L) {
      L.cog(9, 2.9, -7);
      L.start(2.5, -3, 2.5, -5.5);
      L.floor(0, -8, 16, 0, 0); BW(L, 0, 16, 0);
      L.floor(16, -8, 24, 0, 1); BW(L, 16, 24, 1);
      L.floor(24, -8, 34, 0, 3); BW(L, 24, 34, 3);
      L.plate(28, -6.3, 1, 3);
      L.bridge(22, -8, 24, -4.5, 2, 1);
      L.floor(36.5, -8, 50, 0, 3); BW(L, 36.5, 50, 3);
      L.exit(45, -6.5, 49, -1.5, 3);
      L.checkpoint(24.5, -8, 34, 0, 26, -3, 26, -5.5);
      L.checkpoint(37, -8, 50, 0, 38.5, -3, 38.5, -5.5);
      L.zone('step', 13, -8, 16, 0);
      L.zone('wall', 20.5, -8, 24, 0);
      L.zone('up', 24.2, -8, 34, 0, 2.5, 50);
      L.zone('gap', 31, -8, 34, 0, 2.5, 50);
      L.zone('exit', 41, -8, 50, 0, 2.5, 50);
      L.deco(4, -11, 7, -9.5, 0, 5, 'pipe'); L.deco(9, -11, 10, -9.5, 0, 12, 'pipe');
      L.sign(6, 1.6, -7.9, 'WELCOME!');
      L.sign(43, 4.6, -7.9, 'EXIT →');
    },
    zones: {
      step: { say: ['A step. Press A to jump onto it. Thousands of years of robotics research, and here we are. Steps.'], hint: 'Press A to jump. You are robots. You can do this.' },
      wall: { say: ['Hmm. That ledge is too tall for one little robot.', 'But if one of you stands still, the other could jump on their head. Teamwork! Also, light trespassing.'], hint: 'One of you stands still by the wall. The other jumps onto their head, then up onto the ledge.' },
      up: { say: ['Lovely. Now, whoever is up there: that round plate on the floor. Stand on it. Something helpful happens. I am contractually forbidden from saying what.'], hint: 'Stand on the plate up top. A step appears for your partner. Stay on it until they are up.' },
      gap: { say: ['A small gap. Jump it. If you fall in, we put you back. We have a very good putting-back department.'], hint: 'Run and jump across the gap. Falling just puts you back at the last checkpoint.' },
      exit: { say: ['The exit! It only opens for two. Like a canoe. Or a very exclusive restaurant.'], hint: 'Both of you stand on the glowing exit pad.' },
    },
    outro: 'Shift one complete. You have walked, jumped and stood on a friend. HR has been notified. Positively.',
  },
  /* ------------------------------------------------------------ 2 */
  {
    name: 'The Pull of Things', sub: 'Shift 2. Bolt discovers the magnet on his head.', theme: 1,
    intro: [
      'Shift two! Bolt, you may have noticed the large horseshoe magnet bolted to your head.',
      'Hold X to pull things toward you. Your partner. Crates. Small regrets. Let go to drop them.',
      'Nut, you are about to be pulled around a lot. I would apologise in advance, but it is in your contract.',
    ],
    build(L) {
      L.cog(27, 2.9, -7);
      L.start(2.5, -3, 2.5, -5.5);
      L.floor(0, -8, 12, 0, 0); BW(L, 0, 12, 0);
      L.plate(8.5, -6.3, 1, 0);
      L.bridge(12, -5, 19, -1.5, 0, 1);
      L.floor(19, -8, 34, 0, 0); BW(L, 19, 34, 0);
      L.crate(21.5, -6.5, 0);
      L.floor(34, -8, 58, 0, 2); BW(L, 34, 38, 2); BW(L, 42, 58, 2);
      L.box(38, -11, 42, -8, -4, 5, 'shelf'); L.box(38, -12, 42, -11, -4, 7, 'backwall');
      L.crate(40, -9.5, 5);
      L.crate(38, -2.5, 2);
      L.plate(36, -6.3, 2, 2); L.plate(44, -6.3, 3, 2);
      L.gate(46, -8, 47, 0, 2, 10, [2, 3]);
      L.exit(52, -6.5, 56, -1.5, 2);
      L.checkpoint(19.5, -8, 34, 0, 21, -2, 21, -4);
      L.checkpoint(34.5, -8, 46, 0, 35.5, -2, 35.5, -4.5);
      L.checkpoint(47.5, -8, 58, 0, 48.5, -3, 48.5, -5.5);
      L.zone('edge', 9, -8, 12, 0);
      L.zone('bridge', 14, -8, 19, 0, -1, 50);
      L.zone('ledge', 29, -8, 34, 0);
      L.zone('top', 34.2, -8, 46, 0, 1.5, 50);
      L.zone('gate', 47.2, -8, 58, 0, 1.5, 50);
      L.deco(26, -11, 28, -9.5, 0, 8, 'pipe');
      L.sign(40, 6.2, -10.9, 'SHELF');
    },
    zones: {
      edge: { say: ['A gap. A crate on the far side. A plate on this side. I wonder what these three things could possibly have to do with each other.'], hint: 'Bolt: face the crate across the gap and hold X to pull it over. Drop it on the plate to make a bridge.' },
      bridge: { say: ['Bridges! Powered by the weight of a crate. Do not ask me how. I asked once and they made me Orientation Facilitator.'], hint: 'The bridge stays while something heavy is on the plate. Leave the crate there.' },
      ledge: { say: ['Tall ledge. You know the drill: one robot on top of the other, then up.', 'And then, Bolt, if you are up there and Nut is not: you have a magnet. Use it. On Nut. Gently.'], hint: 'Bolt climbs on Nut to get up. Then Bolt holds X facing Nut to lift her up.' },
      top: { say: ['That gate wants both plates pressed. There is one crate here, and one on that high shelf. I would look up. Up is a good direction.'], hint: 'Bolt: stand under the shelf and pull the crate down. Put one crate on each plate.' },
      gate: { say: ['Look at you. Pulling things. Being pulled. It is like watching a very small, very metal romance.'] },
    },
    outro: 'Shift two complete. Bolt, you pulled. Nut, you were pulled. Both are valid career paths.',
  },
  /* ------------------------------------------------------------ 3 */
  {
    name: 'Push Comes to Shove', sub: 'Shift 3. Nut would like a word. A loud one.', theme: 2,
    intro: [
      'Shift three. Nut, it is your turn. You are fitted with our patented Repulsor. Press X to shove everything near you away. Hard.',
      'If Bolt is standing next to you, he will go up. Very up. Ideally onto something.',
      'Attraction Industries accepts no responsibility for robots launched into the ceiling. We do accept compliments.',
    ],
    build(L) {
      L.cog(6, 4.4, -7);
      L.start(2.5, -3, 2.5, -5.5);
      L.floor(0, -8, 12, 0, 0); BW(L, 0, 12, 0);
      L.floor(12, -8, 22, 0, 3); BW(L, 12, 22, 3);
      L.floor(27, -8, 40, 0, 3); BW(L, 27, 33, 3); BW(L, 37, 40, 3);
      L.box(33, -10.5, 37, -8, -3, 5, 'shelf'); L.box(33, -11.5, 37, -10.5, -3, 7, 'backwall');
      L.plate(35, -9.25, 1, 5, 1.2);
      L.crate(32, -4.5, 3);
      L.gate(40, -8, 41, 0, 3, 11, 1);
      L.floor(40, -8, 52, 0, 3); BW(L, 41, 52, 3);
      L.floor(52, -8, 62, 0, 6); BW(L, 52, 62, 6);
      L.exit(57, -6.5, 61, -1.5, 6);
      L.checkpoint(12.5, -8, 22, 0, 14, -2.5, 14, -5);
      L.checkpoint(27.5, -8, 40, 0, 29, -2.5, 29, -5);
      L.checkpoint(41.5, -8, 52, 0, 43, -2.5, 43, -5);
      L.checkpoint(52.5, -8, 62, 0, 54, -2.5, 54, -5);
      L.zone('wall', 7, -8, 12, 0);
      L.zone('gap', 18, -8, 22, 0, 2, 50);
      L.zone('shelf', 28, -8, 40, 0, 2, 50);
      L.zone('tower', 46, -8, 52, 0, 2, 50);
      L.deco(5, -11, 6.5, -9.5, 0, 10, 'pipe'); L.deco(45, -11, 47, -9.5, 3, 12, 'pipe');
    },
    zones: {
      wall: { say: ['A wall three metres tall. Far too tall for jumping, or for standing on each other.', 'Bolt, stand by the wall. Nut, stand next to Bolt and press X. Then, Bolt, look down and pull Nut up after you.'], hint: 'Bolt stands by the wall. Nut stands close and presses X to launch him. Bolt then pulls Nut up with X.' },
      gap: { say: ['A wide gap. Too wide to jump. Nut, you can launch Bolt sideways too. Stand behind him. Aim him with your body.'], hint: 'Bolt at the edge, Nut just behind him. Nut presses X, Bolt steers in the air. Then Bolt pulls Nut across.' },
      shelf: { say: ['That plate on the shelf opens the gate. Crates can be launched too. Or carried, by someone who gets themselves up there.'], hint: 'Push the crate up onto the shelf with Nut, or launch Bolt up there and let him pull the crate up.' },
      tower: { say: ['One last climb. You know how this goes now. Launch, pull. Launch, pull. It is basically a dance.'], hint: 'Nut launches Bolt up, Bolt pulls Nut up.' },
    },
    outro: 'Shift three complete! No ceilings were harmed. Several were startled.',
  },
  /* ------------------------------------------------------------ 4 */
  {
    name: 'Iron Will', sub: 'Shift 4. Iron floors, iron hooks, iron resolve.', theme: 3,
    intro: [
      'Shift four. See the dark striped floors? Those are iron. Nut, if you press X while standing on iron, you shove the floor. The floor does not move. You do.',
      'Bolt, see the floating rings? Those are anchors. Hold X near one and you will zip up to it and hang there. Let go to drop.',
      'You can grab a second anchor straight from the first one. Let go and press X again, quickly. Like a very slow, very heavy monkey.',
    ],
    build(L) {
      L.cog(9, 4.6, -7);
      L.start(2.5, -3, 2.5, -5.5);
      L.floor(0, -8, 14, 0, 0); BW(L, 0, 14, 0);
      L.iron(8, -8, 14, -4.5, 0);
      L.floor(14, -8, 24, 0, 3); BW(L, 14, 24, 3);
      L.plate(17.5, -6, 1, 3);
      L.mover(10.5, -3.5, 13.8, -0.5, 0.05, [[0, 0, 0], [0, 3, 0]], 2.5, [1]);
      L.anchor(27.5, 7, -4); L.anchor(34.5, 7, -4);
      L.floor(33, -8, 41, 0, 3); BW(L, 33, 41, 3);
      L.plate(37, -6.3, 2, 3);
      L.gate(41, -8, 42, 0, 3, 13, [2, 3], { any: true });
      L.iron(42, -8, 46, 0, 3);
      L.floor(46, -8, 58, 0, 3); BW(L, 42, 46, 3); BW(L, 50, 58, 3);
      L.box(46, -8, 50, -5, -3, 6, 'shelf'); L.box(46, -9.5, 50, -8, -3, 8, 'backwall');
      L.plate(48, -6.5, 3, 6);
      L.exit(53, -6.5, 57, -1.5, 3);
      L.checkpoint(14.5, -8, 24, 0, 16, -2.5, 16, -5);
      L.checkpoint(33.5, -8, 41, 0, 35, -2.5, 35, -5);
      L.checkpoint(42.5, -8, 58, 0, 44, -1.5, 44, -3.5);
      L.zone('iron', 5, -8, 14, 0, -1, 2);
      L.zone('chasm', 20, -8, 24, 0, 2, 50);
      L.zone('across', 33.2, -8, 41, 0, 2, 50);
      L.zone('alone', 42.2, -8, 46, 0, 2, 50);
      L.zone('end', 51, -8, 58, 0, 2, 50);
      L.deco(4, -11, 5.5, -9.5, 0, 8, 'pipe'); L.deco(56, -11, 57.5, -9.5, 3, 12, 'pipe');
    },
    zones: {
      iron: { say: ['Iron floor. Nut, stand on it and press X. Then look for something to stand on up there. Bolt, you wait on that little lift.'], hint: 'Nut rockets off the iron (X while standing on it) up to the plate. The plate raises the lift for Bolt.' },
      chasm: { say: ['A chasm. Nobody is jumping that. Bolt, the anchors. Grab the near one, then the far one, then let go over solid ground.'], hint: 'Bolt: hold X facing the near ring, release, then press X again to grab the far ring. Let go over the floor. Then pull Nut over.' },
      across: { say: ['The gate opens while something stands on that plate. Or while something stands on the other plate. The one on the other side. Of the gate. Think about it.'], hint: 'Bolt holds the plate so Nut can go through. Nut rockets up onto the high plate to open the gate for Bolt.' },
      alone: { say: ['Nut, you are on your own for a moment. Iron below you. A plate above you. I believe the expression is "you have got this".'], hint: 'Nut: press X on the iron floor to rocket up to the high plate.' },
      end: { say: ['Excellent. Nut climbed a wall by shouting at the floor. Truly, this is the future.'] },
    },
    outro: 'Shift four complete. You are now certified in Iron. Certificates will be mailed to your heads.',
  },
  /* ------------------------------------------------------------ 5 */
  {
    name: 'Logistics', sub: 'Shift 5. Things go places. On purpose.', theme: 4,
    intro: [
      'Shift five: Logistics. Our core business is moving heavy things from where they are to where they should be.',
      'Today, the heavy things are crates. And also you.',
    ],
    build(L) {
      L.cog(48, 10.3, -7);
      L.start(2.5, -3, 2.5, -5.5);
      L.floor(0, -8, 12, 0, 0); BW(L, 0, 12, 0);
      L.crate(8, -4, 0);
      L.mover(12.2, -6, 15.2, -2, 0, [[0, 0, 0], [8.6, 0, 0]], 2.4);
      L.floor(16.5, -14, 21, -10, 0, 'shelf');
      L.crate(19, -12, 0);
      L.floor(24, -8, 37, 0, 0); BW(L, 24, 37, 0);
      L.plate(27.5, -6, 1, 0); L.plate(32, -6, 2, 0);
      L.gate(36, -8, 37, 0, 0, 10, [1, 2]);
      L.floor(37, -8, 45, 0, 0); BW(L, 37, 45, 0);
      L.plate(39.5, -6.3, 3, 0);
      L.mover(42, -6, 45, -2, 0.02, [[0, 0, 0], [0, 6, 0]], 2.6, [3]);
      L.floor(45, -8, 52, 0, 6); BW(L, 45, 52, 6);
      L.mover(52.2, -6, 55.2, -2, 6, [[0, 0, 0], [5.6, 0, 0]], 2.2);
      L.floor(61, -8, 72, 0, 6); BW(L, 61, 72, 6);
      L.exit(67, -6.5, 71, -1.5, 6);
      L.checkpoint(24.5, -8, 36, 0, 26, -2.5, 26, -4.5);
      L.checkpoint(37.5, -8, 42, 0, 38.5, -2, 38.5, -4);
      L.checkpoint(45.5, -8, 52, 0, 47, -2.5, 47, -5);
      L.checkpoint(61.5, -8, 72, 0, 63, -2.5, 63, -5);
      L.zone('ferry', 8, -8, 12, 0);
      L.zone('plates', 24.2, -8, 36, 0);
      L.zone('lift', 37.2, -8, 42, 0);
      L.zone('upper', 45.2, -8, 52, 0, 4, 50);
      L.deco(30, -11, 31.5, -9.5, 0, 9, 'pipe'); L.deco(64, -11, 65.5, -9.5, 6, 14, 'pipe');
      L.sign(30, 1.6, -7.9, '2 CRATES');
    },
    zones: {
      ferry: { say: ['A moving platform. It goes back and forth all day. It has never once complained. Be like the platform.', 'Bring the crate. You will want the crate. Bolt can carry it by holding X.'], hint: 'Ride the platform across. Bolt can carry the crate across by holding X while riding.' },
      plates: { say: ['Two plates, one gate. You brought one crate. Probably. The other crate is on that little island back there, looking lonely.'], hint: 'Bolt: pull the crate from the island behind the gap. Put a crate on each plate.' },
      lift: { say: ['An elevator! It goes up while the plate is pressed. Which raises the classic question: who stays down here?'], hint: 'Nut stands on the plate. Bolt rides up, then pulls Nut up from the top.' },
      upper: { say: ['Another ferry. This one is shy. Wait for it.'], hint: 'Ride the moving platform to the far side.' },
    },
    outro: 'Shift five complete. Everything is where it should be. Except me. I wanted to be a pilot.',
  },
  /* ------------------------------------------------------------ 6 */
  {
    name: 'Safety Lasers', sub: 'Shift 6. They are for your safety. Mostly.', theme: 5,
    intro: [
      'Shift six. Those red lines are Safety Lasers. They are there for your safety.',
      'If you touch one, you will be safely returned to the last checkpoint. Crates pass through them fine. Crates have no feelings.',
    ],
    build(L) {
      L.cog(34, 4.4, -7);
      L.start(2.5, -3, 2.5, -5.5);
      L.floor(0, -8, 62, 0, 0); BW(L, 0, 38, 0); BW(L, 42, 62, 0);
      L.laser(9, -8, 9.3, 0, 0, 5, null, [1.6, 1.8, 0]);
      L.laser(12, -8, 12.3, 0, 0, 5, null, [1.6, 1.8, 0]);
      L.laser(15, -8, 15.3, 0, 0, 5, null, [1.6, 1.8, 0]);
      L.plate(23, -6.3, 1, 0); L.plate(29, -6.3, 2, 0);
      L.laser(25.85, -8, 26.15, 0, 0, 9, [1, 2], null, true);
      L.crate(34, -3, 0);
      L.box(38, -11, 42, -8, -4, 4, 'shelf'); L.box(38, -12, 42, -11, -4, 7, 'backwall');
      L.crate(40, -9.5, 4);
      L.plate(35.5, -6.3, 3, 0); L.plate(40, -6.3, 4, 0);
      L.laser(44, -8, 44.3, 0, 0, 9, [3, 4]);
      L.laser(49, -8, 49.3, 0, 0, 5, null, [1.2, 1.3, 0.6]);
      L.laser(52, -8, 52.3, 0, 0, 5, null, [1.2, 1.3, 1.6]);
      L.exit(56, -6.5, 60, -1.5, 0);
      L.checkpoint(19, -8, 25.5, 0, 20.5, -2.5, 20.5, -5);
      L.checkpoint(32, -8, 43.5, 0, 33, -1.5, 33, -5.5);
      L.checkpoint(45, -8, 48, 0, 46, -2.5, 46, -5);
      L.zone('timed', 6, -8, 8.5, 0);
      L.zone('wall', 20, -8, 25, 0);
      L.zone('crates', 32, -8, 43.5, 0);
      L.zone('last', 45, -8, 48, 0);
      L.deco(3, -11, 4.5, -9.5, 0, 9, 'pipe'); L.deco(58, -11, 60, -9.5, 0, 8, 'pipe');
      L.sign(4.5, 1.6, -7.9, 'MIND THE LASERS');
    },
    zones: {
      timed: { say: ['These lasers blink. On, off, on, off. Watch the rhythm, then run. Like a crosswalk, but red, and you are the chicken.'], hint: 'Wait for the lasers to switch off, then run through all three together.' },
      wall: { say: ['This laser stays on unless someone stands on a plate. There is a plate on each side. Very fair. Very symmetrical. I designed it myself.'], hint: 'One of you stands on the near plate so the other can pass. The one who passed stands on the far plate.' },
      crates: { say: ['Two plates. Both must be pressed. One crate here. One crate on the shelf. This is basically a retirement party for crates.'], hint: 'Pull the crate off the shelf. Put one crate on each plate.' },
      last: { say: ['Two blinking lasers, slightly out of step. Timing! It is the secret to comedy and also to not being lasered.'], hint: 'Go through each laser when it blinks off. You can wait safely between them.' },
    },
    outro: 'Shift six complete. You were lasered a normal amount. Probably. I was not counting. I was counting.',
  },
  /* ------------------------------------------------------------ 7 */
  {
    name: 'Ventilation', sub: 'Shift 7. Hot air rises. So do you.', theme: 6,
    intro: [
      'Shift seven. The ventilation wing. Those big fans blow upward. Step over one and you will float.',
      'It is like flying, but with significantly more noise and slightly less dignity.',
    ],
    build(L) {
      L.cog(30.5, 7.3, -2.5);
      L.start(2.5, -3, 2.5, -5.5);
      L.floor(0, -8, 10, 0, 0); BW(L, 0, 10, 0);
      L.fan(10, -6, 13, -2, 0, 7.5);
      L.floor(10, -8, 13, -6, 0); L.floor(10, -2, 13, 0, 0);
      L.floor(13, -8, 22, 0, 6); BW(L, 10, 22, 6);
      L.fan(24, -6, 27, -2, -3, 9.5);
      L.fan(29, -6, 32, -2, -3, 9.5);
      L.floor(34, -8, 44, 0, 6); BW(L, 34, 44, 6);
      L.plate(39, -6.3, 1, 6);
      L.fan(44, -6, 47, -2, 0, 12.5, [1, 2]);
      L.floor(47, -8, 64, 0, 11); BW(L, 47, 52, 11); BW(L, 60, 64, 11);
      L.floor(52, -9, 60, -8, 11); L.floor(52, -12, 53, -9, 11); L.floor(59, -12, 60, -9, 11);
      L.box(51, -13, 61, -12, 5, 17, 'backwall'); L.box(51, -12, 52, -8, 5, 14, 'backwall'); L.box(60, -12, 61, -8, 5, 14, 'backwall');
      L.plate(50, -6.5, 2, 11);
      L.crate(53, -3, 11);
      L.box(53, -12, 56, -9, 5, 15, 'shelf');
      L.plate(54.5, -10.5, 3, 15);
      L.fan(56, -12, 59, -9, 11, 5.5);
      L.gate(60, -8, 61, 0, 11, 21, 3);
      L.floor(61, -8, 72, 0, 11); BW(L, 61, 72, 11);
      L.exit(67, -6.5, 71, -1.5, 11);
      L.checkpoint(13.5, -8, 22, 0, 15, -2.5, 15, -5);
      L.checkpoint(34.5, -8, 44, 0, 36, -2.5, 36, -5);
      L.checkpoint(47.5, -8, 60, 0, 49, -2.5, 49, -4.5);
      L.checkpoint(61.5, -8, 72, 0, 63, -2.5, 63, -5);
      L.zone('fan', 6, -8, 10, 0);
      L.zone('pit', 19, -8, 22, 0, 5, 50);
      L.zone('big', 34.2, -8, 44, 0, 5, 50);
      L.zone('high', 47.2, -8, 60, 0, 10, 50);
      L.deco(4, -11, 5.5, -9.5, 0, 14, 'pipe');
    },
    zones: {
      fan: { say: ['Walk onto the fan. Drift over to the ledge. If you fall, the fan will catch you. The fan believes in second chances.'], hint: 'Stand over the fan to float up, then steer onto the high ledge.' },
      pit: { say: ['A long drop, with fans in it. Hop from one updraft to the next. Do not look down. Actually, do look down. It is quite pretty.'], hint: 'Jump into the first fan, drift right into the second, then onto the far ledge.' },
      big: { say: ['That big fan only runs while a plate is pressed. There is a plate here. And another one up top. You see where this is going. Literally upward.'], hint: 'One of you holds the plate here while the other floats up. Up top, Bolt can pull Nut, or Nut can hold the top plate for Bolt.' },
      high: { say: ['A gate, and a plate on that tall pillar. A fan next to the pillar. And a crate. Somebody has to hold that plate forever, unless... crate.'], hint: 'Bolt floats up the back fan onto the pillar, pulls the crate up, and drops it on the plate.' },
    },
    outro: 'Shift seven complete. You flew! Sort of. You were blown. Let us say flew.',
  },
  /* ------------------------------------------------------------ 8 */
  {
    name: 'Performance Review', sub: 'Shift 8. Everything you know. All at once.', theme: 7,
    intro: [
      'Shift eight. Your Performance Review. Management has designed a course using everything you have learned.',
      'Management has never played it. Management has never played anything. Good luck.',
    ],
    build(L) {
      L.cog(58, 7.6, -6);
      L.start(2.5, -3, 2.5, -5.5);
      L.floor(0, -8, 10, 0, 0); BW(L, 0, 10, 0);
      L.floor(10, -8, 22, 0, 3); BW(L, 10, 22, 3);
      L.laser(15.5, -8, 15.8, 0, 3, 8.5, null, [1.4, 1.6, 0]);
      L.laser(18.5, -8, 18.8, 0, 3, 8.5, null, [1.4, 1.6, 0.8]);
      L.anchor(25.5, 7, -4); L.anchor(32.0, 7, -4);
      L.floor(31.0, -8, 44.0, 0, 3); BW(L, 31, 44, 3);
      L.plate(35.0, -6.3, 1, 3);
      L.gate(40.0, -8, 41.0, 0, 3, 13, [1, 2], { any: true });
      L.fan(45.0, -6, 48.0, -2, 0, 9.5);
      L.floor(41.0, -8, 45.0, 0, 3); L.floor(45.0, -8, 48.0, -6, 3); L.floor(45.0, -2, 48.0, 0, 3);
      L.floor(48.0, -8, 53.0, 0, 3); BW(L, 41, 53, 3);
      L.box(48.0, -8, 53.0, -5, -3, 9, 'shelf'); L.box(48.0, -9.5, 53.0, -8, -3, 11, 'backwall');
      L.plate(50.5, -6.5, 2, 9);
      L.crate(51.0, -2, 3);
      L.floor(53.0, -8, 60.0, 0, 3); BW(L, 53, 60, 3);
      L.iron(56.0, -8, 60.0, -4, 3);
      L.box(60.0, -11, 64.0, -8, -3, 6.5, 'shelf'); L.box(60.0, -12, 64.0, -11, -3, 8.5, 'backwall');
      L.crate(62.0, -9.5, 6.5);
      L.floor(60.0, -8, 66.0, 0, 3); BW(L, 64, 66, 3);
      L.plate(54.5, -6.3, 3, 3); L.plate(62.0, -6.3, 4, 3);
      L.bridge(66.0, -5.5, 74.0, -2, 3, [3, 4]);
      L.floor(74.0, -8, 82.0, 0, 3); BW(L, 74, 82, 3);
      L.mover(82.2, -6, 85.2, -2, 3, [[0, 0, 0], [0, 6, 0], [6, 6, 0]], 2.4);
      L.floor(91.4, -8, 102.0, 0, 9); BW(L, 91.4, 102, 9);
      L.exit(97.0, -6.5, 101.0, -1.5, 9);
      L.checkpoint(10.5, -8, 14.5, 0, 11.5, -2.5, 11.5, -5);
      L.checkpoint(19.2, -8, 22, 0, 20.2, -2.5, 20.2, -5);
      L.checkpoint(31.5, -8, 40.0, 0, 33.0, -2.5, 33.0, -5);
      L.checkpoint(41.5, -8, 66.0, 0, 42.5, -1.5, 42.5, -6.5);
      L.checkpoint(74.5, -8, 82.0, 0, 76.0, -2.5, 76.0, -5);
      L.checkpoint(92.0, -8, 102.0, 0, 93.5, -2.5, 93.5, -5);
      L.zone('start', 6, -8, 10, 0);
      L.zone('chasm', 20.0, -8, 22.0, 0, 2, 50);
      L.zone('gate', 31.2, -8, 40.0, 0, 2, 50);
      L.zone('fan', 41.2, -8, 48.0, 0, 2, 50);
      L.zone('bridge', 53.5, -8, 66.0, 0, 2, 50);
      L.zone('ferry', 76.0, -8, 82.0, 0, 2, 50);
      L.zone('end', 94.0, -8, 102.0, 0, 8, 50);
      L.deco(3, -11, 4.5, -9.5, 0, 9, 'pipe'); L.deco(95, -11, 96.5, -9.5, 9, 18, 'pipe');
      L.sign(5, 1.6, -7.9, 'REVIEW');
    },
    zones: {
      start: { say: ['First, a wall, then blinking lasers on top. Launch, pull, and time it. Management calls this "synergy".'], hint: 'Nut launches Bolt, Bolt pulls Nut. Then pass the lasers when they blink off.' },
      chasm: { say: ['The anchors again. Bolt, swing on over. Nut, prepare to be reeled in like a very surprised fish.'], hint: 'Bolt: grab the near ring, then the far ring, drop onto the floor, and pull Nut across.' },
      gate: { say: ['Gate. Plate on this side. Another plate somewhere on the other side, up high. One of you goes ahead.'], hint: 'Nut stands on the plate. Bolt goes through, floats up the fan, and stands on the high plate so Nut can come through.' },
      fan: { say: ['Up the fan, onto the shelf, onto the plate. I would sing a little song about it, but legal says no.'], hint: 'Ride the fan up to the shelf with the plate on it.' },
      bridge: { say: ['Two plates for one bridge. One crate down here. One crate up on that shelf. Nut, the iron floor might help. Or Bolt. Bolt helps with most things that are up.'], hint: 'Pull the shelf crate down (Bolt, from near the shelf), then put one crate on each plate.' },
      ferry: { say: ['A lift that goes up and then sideways. It is very proud of that. Hop on.'], hint: 'Ride the platform up and across to the tall ledge.' },
      end: { say: ['There it is. The exit. The end of orientation. Walk on together, and I will read your review.'] },
    },
    outro: 'Performance Review: Bolt and Nut. Teamwork: excellent. Magnetism: undeniable. Recommended action: give them a day off. Welcome to Attraction Industries.',
  },
  /* ------------------------------------------------------------ 9 */
  {
    name: 'Shipping', sub: 'Shift 9. Conveyor belts. The floor has opinions now.', theme: 8,
    intro: [
      'Welcome back! After your Performance Review, Management has promoted you. To Shipping.',
      'Shipping is where the floor moves. It moves things to where they need to go. Sometimes that is you.',
    ],
    build(L) {
      L.cog(36, 1.0, -0.8);
      L.start(2.5, -3, 2.5, -5.5);
      L.floor(0, -8, 10, 0, 0); BW(L, 0, 10, 0);
      L.conveyor(10, -8, 22, 0, 0, -2.2, 0); BW(L, 10, 22, 0);
      L.crate(19, -4, 0);
      L.floor(22, -8, 30, 0, 0); BW(L, 22, 30, 0);
      L.plate(26, -6.3, 1, 0);
      L.conveyor(30, -8, 42, 0, 0, -9, 0, [1]); BW(L, 30, 42, 0);
      L.floor(42, -8, 48, 0, 0); BW(L, 42, 48, 0);
      L.plate(45, -6.3, 2, 0);
      L.conveyor(48, -8, 56, 0, 0, -9, 0, [2]); BW(L, 48, 56, 0);
      L.floor(56, -8, 68, 0, 0); BW(L, 56, 68, 0);
      L.exit(62, -6.5, 66, -1.5, 0);
      L.checkpoint(22.5, -8, 30, 0, 23.5, -2.5, 23.5, -5);
      L.checkpoint(42.5, -8, 48, 0, 43.5, -2.5, 43.5, -4.5);
      L.checkpoint(56.5, -8, 68, 0, 57.5, -2.5, 57.5, -5);
      L.zone('belt', 6, -8, 10, 0);
      L.zone('fast', 22.2, -8, 30, 0);
      L.zone('split', 42.2, -8, 48, 0);
      L.zone('end', 58, -8, 68, 0);
      L.deco(4, -11, 5.5, -9.5, 0, 8, 'pipe'); L.deco(60, -11, 61.5, -9.5, 0, 10, 'pipe');
      L.sign(5, 1.6, -7.9, 'SHIPPING');
      L.sign(36, 1.6, -7.9, '← FAST ←');
    },
    zones: {
      belt: { say: ['A conveyor belt. It runs the wrong way, because of course it does. Walk against it. You are stronger than a belt.', 'Oh, and it is delivering a crate to you. Bolt, I would hang on to that. Hold X to carry it.'], hint: 'Walk across the belt. Bolt should carry the crate along (hold X).' },
      fast: { say: ['This belt is much faster. Too fast to walk against. Belts with a coloured light run backwards while their plate is pressed.'], hint: 'Put the crate on the plate. The fast belt flips direction and carries you both across.' },
      split: { say: ['One plate, one belt, two robots. Somebody stands on the plate. Somebody rides.', 'Things being pulled by a magnet do not touch the belt. I mention this for no reason at all.'], hint: 'Nut stands on the plate while Bolt rides across. Then Bolt pulls Nut over the belt (pulled things ignore belts).' },
      end: { say: ['Shipped! Both of you. Signed for and everything.'] },
    },
    outro: 'Shift nine complete. Shipping says you arrived in excellent condition. Slightly dizzy. Excellent condition.',
  },
  /* ------------------------------------------------------------ 10 */
  {
    name: 'Switchboard', sub: 'Shift 10. Nut finds out what buttons are for.', theme: 9,
    intro: [
      'Shift ten. The Switchboard. These posts are switches. Nut, give one a push with X and it flips on. Push again, it flips off.',
      'Switches stay how you leave them. So, unlike Management, they remember things.',
    ],
    build(L) {
      L.cog(49.5, 7.3, -6.9);
      L.start(2.5, -3, 2.5, -5.5);
      L.floor(0, -8, 12, 0, 0); BW(L, 0, 12, 0);
      L.button(9, -7, 1);
      L.gate(12, -8, 13, 0, 0, 10, [1]);
      L.floor(12, -8, 30, 0, 0); BW(L, 12, 30, 0);
      L.laser(19.5, -8, 19.8, 0, 0, 6, [2]);
      L.button(22.3, -7, 2);
      L.button(27.5, -7, 3);
      L.box(32, -8, 33, -7, -6, 0, 'shelf'); L.button(32.5, -7.5, 4);
      L.bridge(30, -6.5, 35, -1.5, 0, [4], { invert: true });
      L.floor(35, -8, 54, 0, 0); BW(L, 30, 54, 0);
      L.gate(40, -8, 41, 0, 0, 10, [3, 4]);
      L.button(45, -1.5, 5);
      L.mover(48, -7, 51, -3.5, 0.02, [[0, 0, 0], [0, 6, 0]], 2.6, [5]);
      L.floor(51, -8, 64, 0, 6); BW(L, 51, 64, 6);
      L.box(48, -8, 51, -7, -6, 6, 'shelf');
      L.exit(58, -6.5, 62, -1.5, 6);
      L.checkpoint(13.5, -8, 19, 0, 14.5, -2.5, 14.5, -5);
      L.checkpoint(20.5, -8, 29.5, 0, 21.5, -2.5, 21.5, -5);
      L.checkpoint(41.5, -8, 47.5, 0, 42.5, -2.5, 42.5, -5);
      L.checkpoint(51.5, -8, 64, 0, 52.5, -2.5, 52.5, -5);
      L.zone('switch', 4, -8, 12, 0);
      L.zone('reach', 13.5, -8, 19, 0);
      L.zone('order', 24, -8, 30, 0);
      L.zone('lift', 41.5, -8, 47.5, 0);
      L.zone('end', 54, -8, 64, 0, 4, 50);
      L.deco(3, -11, 4.5, -9.5, 0, 9, 'pipe'); L.deco(56, -11, 57.5, -9.5, 6, 15, 'pipe');
      L.sign(6, 1.6, -7.9, 'SWITCHBOARD');
    },
    zones: {
      switch: { say: ['There is your first switch. The gate has the same colour. Nut, walk up and push it.', 'Bolt, if you stand next to Nut while she pushes, you will go flying. That is not a warning. That is a feature.'], hint: 'Nut: walk next to the teal switch and press X.' },
      reach: { say: ['A laser. And the switch for the laser is behind the laser. This is the kind of design that gets a person promoted here.', 'Nut, your push reaches a little way. Through things. Ask me how. I will not know.'], hint: 'Nut: stand close to the laser (not in it) and press X. The push reaches the orange switch on the other side.' },
      order: { say: ['Two switches for the gate ahead. One of them also switches off that bridge. Hmm. Order of operations, robots.'], hint: 'Flip pink first. Cross the bridge. Then Nut flips green from the far side. Green turns the bridge off, but you are already over.' },
      lift: { say: ['A lift, and a switch for it. Whoever rides it goes up. Whoever pushes the switch... does not.'], hint: 'Bolt stands on the lift. Nut flips the purple switch (from a little way off, or Bolt gets launched). Bolt then pulls Nut up past the lift, not under it.' },
      end: { say: ['Very good. Every switch, flipped. I will be writing a strongly worded memo to whoever invented switches. It will say: "nice".'] },
    },
    outro: 'Shift ten complete. The Switchboard has been switched. All of it. Management is impressed and slightly frightened.',
  },
  /* ------------------------------------------------------------ 11 */
  {
    name: 'Lumber Room', sub: 'Shift 11. Wooden crates. Magnets are not interested.', theme: 10,
    intro: [
      'Shift eleven. The Lumber Room. These crates are made of wood. Bolt cannot pull them. Nut cannot push them.',
      'You will have to move them the old-fashioned way. By walking into them. Like animals.',
    ],
    build(L) {
      L.cog(25, 4.4, -7);
      L.start(2.5, -3, 2.5, -5.5);
      L.floor(0, -8, 16, 0, 0); BW(L, 0, 16, 0);
      L.crate(6, -6, 0, { wood: true });
      L.plate(11, -6.2, 1, 0);
      L.gate(14, -8, 15, 0, 0, 10, [1]);
      L.floor(15, -8, 30, 0, 0); BW(L, 15, 30, 0);
      L.crate(21, -4, 0, { wood: true });
      L.floor(30, -8, 44, 0, 4.5); BW(L, 30, 44, 4.5);
      L.crate(34, -6.3, 4.5, { wood: true });
      L.crate(33, -2.5, 4.5);
      L.plate(40, -6.3, 2, 4.5); L.plate(42, -1.8, 3, 4.5);
      L.bridge(44, -6, 52, -2, 4.5, [2, 3]);
      L.floor(52, -8, 64, 0, 4.5); BW(L, 44, 64, 4.5);
      L.plate(56, -6.3, 4, 4.5);
      L.gate(60, -8, 61, 0, 4.5, 15, [4]);
      L.conveyor(64, -8, 74, 0, 4.5, -3, 0); BW(L, 64, 74, 4.5);
      L.crate(71, -4, 4.5, { wood: true });
      L.floor(74, -8, 96, 0, 4.5); BW(L, 74, 96, 4.5);
      L.plate(78, -6.2, 5, 4.5);
      L.gate(82, -8, 83, 0, 4.5, 15, [5]);
      L.exit(89, -6.5, 93, -1.5, 4.5);
      L.checkpoint(15.5, -8, 29, 0, 16.5, -2.5, 16.5, -5);
      L.checkpoint(30.5, -8, 44, 0, 31.5, -1.5, 31.5, -4.5);
      L.checkpoint(52.5, -8, 59.5, 0, 53.5, -2.5, 53.5, -5);
      L.checkpoint(61.5, -8, 63.5, 0, 62, -2.5, 62, -5);
      L.checkpoint(83.5, -8, 96, 0, 84.5, -2.5, 84.5, -5);
      L.zone('wood', 2, -8, 8, 0);
      L.zone('high', 18, -8, 30, 0);
      L.zone('both', 30.5, -8, 44, 0, 3, 50);
      L.zone('belt', 61.5, -8, 64, 0, 3, 50);
      L.zone('end', 84, -8, 96, 0, 3, 50);
      L.deco(26, -11, 27.5, -9.5, 0, 10, 'pipe'); L.deco(86, -11, 87.5, -9.5, 4.5, 14, 'pipe');
      L.sign(9, 1.6, -7.9, 'LUMBER');
    },
    zones: {
      wood: { say: ['A wooden crate. Bolt, go on, try to pull it. I will wait.', 'Nothing. Wood. Not magnetic. Walk into it to shove it. Gently. It is older than both of you.'], hint: 'Walk into the wooden crate to shove it onto the plate.' },
      high: { say: ['That ledge is taller than a launch. Unless, of course, you launch from something taller than the floor. Like a crate. Hint, hint. That was the hint.'], hint: 'Shove the crate against the ledge. Bolt stands on the crate. Nut stands behind it and launches him. Then Bolt pulls Nut up.' },
      both: { say: ['This bridge needs both plates pressed. You have two crates. One is wood, and it stays where you put it. The other is iron, and it can follow you.'], hint: 'Wood crate on one plate, iron crate on the other. Cross. Then Bolt pulls the iron crate over the gap to the plate by the gate.' },
      belt: { say: ['The belt is bringing you a crate. It is also taking it away again. Shove it the other way. Belts respect persistence.'], hint: 'Shove the wooden crate against the belt, all the way to the plate by the gate.' },
      end: { say: ['The Lumber Room is tidy. Every crate exactly where it should be. I could cry. I will not. Facilitators do not have the hardware.'] },
    },
    outro: 'Shift eleven complete. You have moved wood with your bodies. Your ancestors, the forklifts, would be proud.',
  },
  /* ------------------------------------------------------------ 12 */
  {
    name: 'Night Shift', sub: 'Shift 12. Everything, but after hours.', theme: 11,
    intro: [
      'Shift twelve. The Night Shift. Everyone else has gone home. The lights are low. The machines are still on.',
      'It is just you two, me, and every single thing you have learned so far. Cosy.',
    ],
    build(L) {
      L.cog(28, 11.3, -7);
      L.start(2.5, -3, 2.5, -5.5);
      L.floor(0, -8, 6, 0, 0); BW(L, 0, 6, 0);
      L.conveyor(6, -8, 16, 0, 0, 3, 0); BW(L, 6, 16, 0);
      L.laser(12.5, -8, 12.8, 0, 0, 6, null, [1.4, 1.8, 0]);
      L.floor(16, -8, 21, 0, 0);
      L.button(18, -7, 1);
      L.fan(21, -6, 24, -2, 0, 8.5, [1]);
      L.floor(21, -8, 24, -6, 0); L.floor(21, -2, 24, 0, 0); BW(L, 16, 24, 0);
      L.floor(24, -8, 40, 0, 7); BW(L, 24, 40, 7);
      L.laser(31.5, -8, 31.8, 0, 7, 13, [2]);
      L.button(34.1, -7, 2, 7);
      L.anchor(43.5, 11, -4); L.anchor(50, 11, -4);
      L.floor(49, -8, 52, 0, 7); L.floor(56, -8, 64, 0, 7); BW(L, 49, 64, 7);
      L.conveyor(52, -8, 56, 0, 7, 0, 2.5);
      L.crate(54, -7.3, 7);
      L.plate(59.5, -6.3, 3, 7);
      L.gate(62, -8, 63, 0, 7, 17, [3]);
      L.button(65.5, -7, 4, 7);
      L.floor(64, -8, 67, 0, 7);
      L.conveyor(67, -8, 79, 0, 7, -8, 0, [4]); BW(L, 64, 79, 7);
      L.crate(65.8, -3, 7, { wood: true });
      L.floor(79, -8, 98, 0, 7); BW(L, 79, 98, 7);
      L.plate(81.5, -6.2, 5, 7);
      L.gate(86, -8, 87, 0, 7, 17, [5]);
      L.exit(92, -6.5, 96, -1.5, 7);
      L.checkpoint(16.5, -8, 21, 0, 17, -2.5, 17, -5);
      L.checkpoint(24.5, -8, 31, 0, 25.5, -2.5, 25.5, -5);
      L.checkpoint(32.5, -8, 40, 0, 33.5, -2.5, 33.5, -5);
      L.checkpoint(49.5, -8, 52, 0, 50.5, -2.5, 50.5, -5);
      L.checkpoint(63.5, -8, 67, 0, 64.2, -2.5, 64.2, -4.5);
      L.checkpoint(79.5, -8, 86, 0, 80.5, -2, 80.5, -3.5);
      L.checkpoint(87.5, -8, 98, 0, 88.5, -2.5, 88.5, -5);
      L.zone('belt', 4, -8, 7, 0);
      L.zone('fan', 16.5, -8, 21, 0);
      L.zone('ledge', 24.5, -8, 31, 0, 5, 50);
      L.zone('swing', 36, -8, 40, 0, 5, 50);
      L.zone('catch', 49.5, -8, 52, 0, 5, 50);
      L.zone('last', 63.5, -8, 67, 0, 5, 50);
      L.zone('end', 88, -8, 98, 0, 5, 50);
      L.deco(2, -11, 3.5, -9.5, 0, 9, 'pipe'); L.deco(90, -11, 91.5, -9.5, 7, 16, 'pipe');
      L.sign(3, 1.6, -7.9, 'NIGHT SHIFT');
    },
    zones: {
      belt: { say: ['This belt wants to deliver you into a laser. Walk against it while the laser is on. Walk with it while it is off. Dancing, basically.'], hint: 'Hold back against the belt while the laser is on, then go when it blinks off.' },
      fan: { say: ['A fan, and it is switched off. Nut, you know what to do. I believe in you. Quietly. It is night.'], hint: 'Nut flips the teal switch. The fan blows you both up onto the high ledge.' },
      ledge: { say: ['A laser and its switch, on the wrong side again. Some people never learn. I mean Management.'], hint: 'Nut: stand right by the laser and press X to flip the orange switch behind it.' },
      swing: { say: ['The anchors. Bolt, swing across. Nut, prepare for your traditional reeling-in.'], hint: 'Bolt grabs the near ring, then the far ring, drops onto the floor, and pulls Nut across.' },
      catch: { say: ['This belt runs off the edge of the factory. And it is carrying a crate. Bolt, catch!'], hint: 'Bolt grabs the crate off the belt (hold X) and carries it to the pink plate.' },
      last: { say: ['Last one. A belt, a switch, a wooden crate, and a plate far away. Put it all together. That is what the night shift does.'], hint: 'Nut flips the green switch so the belt carries everything forward. Ride it with the wooden crate, then shove the crate onto the plate.' },
      end: { say: ['That is the Night Shift done. Go home, robots. You are allowed to go home now. You live here. Go to bed, then.'] },
    },
    outro: 'Shift twelve complete. The factory is quiet. The belts are still. Management says: same time tomorrow.',
  },
  S13,
  S14,
  S15,
  S16,
];

// Overtime: short, harder bonus puzzles. Each unlocks when the main shift `after` (0-based) is done.
export const OVERTIME = [OT1, OT2, OT3, OT4, OT5];
OVERTIME.forEach((L, k) => { L.ot = k + 1; });

export const ALL = [...LEVELS, ...OVERTIME];
export const NMAIN = LEVELS.length;

// Lines for things that can happen anywhere.
export const LINES = {
  fall: [
    '{name} has left the building. Downward. We have put {name} back.',
    'Gravity: one. {name}: zero. Respawning.',
    'That was a fall, {name}. We do not have a word for it yet. "Oops", perhaps.',
    'Please do not jump off the factory, {name}. The paperwork is extraordinary.',
    "That's {n} for {name}. I am not keeping count. I am keeping count.",
    '{other}, please comfort {name}. They have been through a lot. Mostly air.',
  ],
  zap: [
    '{name} touched a laser. {name} is now safer. Safely back at the checkpoint.',
    'Zap! {name}, the red ones are lasers. Not party streamers.',
    'Lasered. Do not worry, {name}. It tickles. Professionally.',
  ],
  launchFirst: 'Liftoff! Bolt, you are flying. Steer with the stick. Land on something nice.',
  pullFirst: 'There it is. The pull. Feel the attraction. Not like that. Well, a little like that.',
  hangFirst: 'Hanging from an anchor. Very elegant, Bolt. Let go of X to drop.',
  rocketFirst: 'Nut shoved the floor, and the floor shoved back. Science.',
  cog: [
    'A golden cog! Management has lost one in every shift. That is {n} found. They will be thrilled. They will not notice.',
    'Golden cog number {n}. Shiny. Pointless. Precious. Like a facilitator.',
    'Ooh, a golden cog. {n} so far. Do not tell Accounting. They will want to count them.',
  ],
  cogAgain: 'You already found this cog. It has been returned to its hiding place for, ah, quality reasons.',
  tubeFirst: 'The pneumatic tube! Our fastest delivery method. Also our only one that sounds like a sneeze.',
  springFirst: 'Boing. That is the technical term. Springs throw whatever lands on them straight up. Including robots. Especially robots.',
  switchFirst: 'Click! Switches stay where you leave them. Unlike plates, which are needy.',
  crateLost: 'The crate fell out of the factory. A new crate has been issued. It is the same crate. Do not think about it.',
  exitOne: ['The exit needs both of you. That is sort of the whole point of the company. And the game.', 'One of you is at the exit. The other is... elsewhere. Reflecting on their choices.'],
  idle: [
    'Take your time. I will be here. Facilitating. Silently.',
    'Is anyone holding a controller? Hello? Blink twice if the robots have taken over.',
    'Fun fact: this is the part where you solve the puzzle. Press Start for a hint, if you like.',
  ],
};
