// Overtime 26. Unlocks after Shift 30. Uses: launching, pulling Nut, a moving anchor ring.
// The aha: a launch always adds the same height, so launch Bolt from the highest place he can get to. That is the
// top of the ring's climb, and only from Nut standing on the perch beside it. Nothing else reaches the boardroom:
// the ring tops out short, a launch from the perch falls short, and a launch off Nut's head on the perch falls short too.
// Back walls are 14 m tall so nobody launched at them can stand on one. There is no iron, so Nut cannot rocket.
const BW = (L, x0, x1, top, h = 14) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');
const P = 3.6; // the perch
const Y = 9.8; // the boardroom

export default {
  name: 'Exit Interview', sub: 'Overtime. Tell us where you see yourself in five metres.', theme: 11, after: 29,
  intro: ['Overtime! Before you leave, Head Office would like a quick exit interview. Head Office is on top of that wall.'],
  build(L) {
    L.start(2.5, -3, 2.5, -5.5);
    /* ---- 1. Step Up: the perch is too high to jump to. Nut launches Bolt onto it, and he reels her up. */
    L.floor(0, -8, 16, 0, 0); BW(L, 0, 16, 0);
    L.box(11.4, -6.4, 13.8, -1.6, -6, P, 'shelf');
    /* ---- 2. Exit Interview: the ring climbs the face of the wall and stops short of the top. Bolt rides it up.
            Nut waits on the perch and launches him off the ring at the top of its climb. Then he reels her up. */
    L.anchor(14.3, 3, -4, { path: [[0, 0, 0], [0, 5, 0]], speed: 1.5 });
    L.box(16, -8, 40, 0, -6, Y, 'floor'); BW(L, 16, 40, Y);
    L.exit(34, -6.5, 38.5, -1.5, Y);
    // golden cog: high over the start, by the back wall. A plain launch misses. A launch off Nut's head does not.
    L.cog(3, 5.6, -7);
    /* ---- checkpoints, zones, decoration */
    L.checkpoint(18, -8, 30, 0, 20, -3, 20, -5);
    L.zone('perch', 7, -8, 11.4, 0, -5, 3);
    L.zone('exit', 11.4, -6.4, 13.8, -1.6, P - 0.5, P + 2);
    L.zone('end', 30, -8, 40, 0, Y - 1, 60);
    L.deco(6, -11, 7.5, -9.5, 0, 14, 'pipe'); L.deco(36, -11, 37.5, -9.5, Y, 20, 'pipe');
    L.sign(8, 2.2, -7.9, 'EXIT INTERVIEW');
    L.sign(14.3, 9.4, -7.9, 'GOING UP');
    L.sign(25, Y + 2.2, -7.9, 'PERSONNEL');
  },
  zones: {
    perch: { say: ['Interview question one. Can you get onto that perch? Please answer as a team. Nobody here can answer it alone.'], hint: 'Nut launches Bolt onto the perch. Bolt faces Nut, holds X and walks back to reel her up.' },
    exit: { say: ['The ring goes up the wall and stops short of the top. It is a career ladder. They all do that.', 'A launch always adds the same amount. So it matters very much where you start one. Think about where Bolt is highest.'], hint: 'Nut waits at the back of the perch while Bolt grabs the moving ring (hold X, facing it), then walks to the wall end. Bolt rides the ring up. When he is at the top, right beside Nut, she presses X and he flies up. He steers onto Head Office and reels Nut up from the edge.' },
    end: { say: ['That concludes your exit interview. Your answers have been noted. They were mostly jumping.'] },
  },
  outro: 'Overtime done. Head Office thanks you for your time. They have no further questions. They had no questions to begin with.',
};
