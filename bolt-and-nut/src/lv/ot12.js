// Overtime 12. Unlocks after Shift 21. Uses: pneumatic tubes, fans, plates, launching, pulling Nut into a tube, lasers, switches.
// Back walls are tall (9 m over the ledge, 14 m beside the shaft) so nobody launched off the pillar can walk along the top past the fence.
const BW = (L, x0, x1, top, h = 6) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');
const Y = 6.5; // the ledge

export default {
  name: 'Climate Control', sub: 'Overtime. The air conditioning has been promoted. To transport.', theme: 6, after: 20,
  intro: ['Overtime. Facilities have connected the pneumatic tubes to the air conditioning. They say it saves on ducting. It does not save on robots.'],
  build(L) {
    L.start(2.5, -3, 2.5, -5.5);
    /* ---- 1. Air Conditioning: the tube posts you into a laser-caged fan shaft. The fan runs while either teal plate is pressed:
            one down here, one up on the ledge. Whoever goes up first holds the top plate for the other. */
    L.floor(0, -8, 15, 0, 0); BW(L, 0, 15, 0);
    L.plate(12.5, -6.3, 1, 0);
    L.tube(9.5, -2.2, 0, 16.6, -4, 0);
    L.laser(15, -8, 15.3, 0, -6, 14);
    L.fan(15.3, -8, 18.7, 0, 0, 7.2, [1]);
    BW(L, 15, 18.7, 0, 14);
    L.cog(17.2, 10.9, -5);
    L.box(18.7, -8, 30, 0, -6, Y, 'floor');
    L.plate(21.5, -6.3, 1, Y);
    /* ---- 2. Recorded Delivery: the second hatch is up on a pillar. Nut launches Bolt up there, and Bolt reels Nut into the tube.
            She is posted past the laser fence, next to the switch. */
    L.box(23, -8, 26, -4.6, -6, Y + 3, 'shelf');
    L.tube(25.2, -6.3, Y + 3, 34, -2.5, Y);
    L.laser(31, -8, 31.3, 0, Y - 6, Y + 14, [2]);
    L.box(30, -8, 50, 0, -6, Y, 'floor');
    L.button(35.8, -7.2, 2, Y);
    L.exit(41.5, -6.5, 46.5, -1.5, Y);
    BW(L, 18.7, 50, Y, 9);
    /* ---- checkpoints, zones, decoration */
    L.checkpoint(19.2, -4.3, 22.6, 0, 20.5, -1.5, 20.5, -3.3);
    L.checkpoint(37, -8, 41, 0, 38.5, -3, 38.5, -5.5);
    L.zone('aircon', 5, -8, 11, 0);
    L.zone('pillar', 23, -4.6, 30.5, 0, Y - 1, 50);
    L.zone('end', 37, -8, 50, 0, Y - 1, 50);
    L.deco(3, -11, 4.5, -9.5, 0, 16, 'pipe'); L.deco(44, -11, 45.5, -9.5, Y, 22, 'pipe');
    L.sign(6, 1.8, -7.9, 'AIR CONDITIONING');
    L.sign(28, Y + 1.8, -7.9, 'RECORDED DELIVERY');
  },
  zones: {
    aircon: { say: ['The tube posts you into the air conditioning shaft. The fan carries you up to the ledge. The fan only runs while someone stands on a plate.', 'Please do not climb into the shaft over the lasers. Use the tube. That is what the forms are for.'], hint: 'Nut stands on the teal plate so the fan runs. Bolt walks onto the tube hatch, floats up the shaft and steps right onto the ledge. Bolt stands on the teal plate up there, and Nut takes the tube up too.' },
    pillar: { say: ['The switch for that fence is on the far side. The tube goes there. The tube starts on top of that pillar. Nobody here is tall enough. Nobody here is anything enough.', 'Nut, you can make Bolt taller. Briefly. Bolt, you can make Nut go places. Into tubes, for example.'], hint: 'Nut launches Bolt up onto the pillar (stand next to him and press X). Bolt faces the hatch on top and pulls Nut up (hold X): she lands on the hatch and is posted past the fence. Nut pushes the orange switch and the fence turns off.' },
    end: { say: ['Delivered by air, then by tube, then by Bolt. Three methods. One parcel. The parcel is Nut.'] },
  },
  outro: 'Overtime done. Facilities have asked if the shaft is now a lift. It is not a lift. It is a feeling.',
};
