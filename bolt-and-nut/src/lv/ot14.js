// Overtime 14. Unlocks after Shift 23. Uses: conveyor belts flipped by a switch, an iron crate, a spring, lasers, carrying crates, pulling Nut.
// Back walls are 10 m tall by the belt and 8 m over the shelf, so nobody riding the crate up can hop onto one and walk past the fence.
const BW = (L, x0, x1, top, h = 10) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');
const Y = 6.8; // the shelf

export default {
  name: 'Parcel Force', sub: 'Overtime. Please do not ride the parcels. Please ride the parcels.', theme: 8, after: 31,
  intro: ['Overtime. Shipping has a backlog. The backlog is one crate. It is very important. It needs to go up, then sideways, then through a laser. With a robot on it.'],
  build(L) {
    L.start(2.5, -2, 2.5, -4);
    /* ---- 1. Parcel Lift: the belt runs back toward the kerb until Nut flips the teal switch. Bolt waits on the crate. The belt takes
            him under the low lasers and onto the spring, and he jumps off the crate at the top of the bounce. The switch is too far
            from the crate for Nut to flip it and still catch the ride. */
    L.floor(0, -8, 6, 0, 0); BW(L, 0, 6, 0);
    L.button(1.2, -0.9, 1, 0);
    L.box(5.7, -8, 6, -4.8, -6, 1.2, 'shelf');
    L.conveyor(6, -8, 16, -4.8, 0, -4, 0, [1]);
    L.crate(7, -6.4, 0);
    L.laser(6, -8, 16, -4.8, -6, 1.15);
    L.box(6, -4.8, 18, -4.5, -6, 5, 'wall');
    L.floor(6, -4.5, 13, 0, 0);
    L.spring(16, -8, 18, -4.8, -0.3, 18);
    BW(L, 6, 18, 0);
    /* ---- 2. Crane Hire: the fence has a slot just big enough for Nut riding a crate that someone is holding up.
            Bolt pulls the crate up off the spring, Nut climbs aboard, and Bolt lifts her through. */
    L.box(18, -8, 44, 0, -6, Y, 'floor'); BW(L, 18, 44, Y, 8);
    L.button(19.2, -7.4, 1, Y); // spare belt switch, so a lost crate can always be sent back to the spring
    L.cog(22.5, Y + 5.6, -6.8);
    L.laser(30, -8, 30.3, 0, Y - 6, Y + 1.4, [2]);
    L.laser(30, -8, 30.3, 0, Y + 2.55, Y + 14, [2]);
    L.button(34.8, -7.2, 2, Y);
    L.exit(38, -6.5, 43, -1.5, Y);
    /* ---- checkpoints, zones, decoration */
    L.checkpoint(18.5, -8, 26, 0, 21, -2.5, 21, -4.5);
    L.checkpoint(33, -8, 37.5, 0, 35, -2.5, 35, -4.5);
    L.zone('lift', 3, -8, 6, 0);
    L.zone('crane', 18.5, -8, 26, 0, Y - 1, 50);
    L.zone('end', 33, -8, 44, 0, Y - 1, 50);
    L.deco(2, -11, 3.5, -9.5, 0, 16, 'pipe'); L.deco(40, -11, 41.5, -9.5, Y, 22, 'pipe');
    L.sign(4, 2.4, -7.9, 'PARCEL LIFT');
    L.sign(24, Y + 2.4, -7.9, 'CRANE HIRE');
  },
  zones: {
    lift: { say: ['That spring cannot get anyone up to the shelf. It can get a parcel quite high. And whatever is standing on the parcel, a bit higher.', 'The belt is lasered at ankle height. Ankles are not covered by the warranty. Parcels are.'], hint: 'Bolt jumps onto the kerb and then onto the iron crate, and waits there. Nut pushes the teal switch so the belt runs the other way. The crate carries Bolt onto the spring. Bolt presses A near the top of the bounce and steers onto the shelf. If he misses, the crate keeps bouncing: try again. Then Bolt pulls Nut up from the walkway.' },
    crane: { say: ['The fence has a slot. The slot is exactly one Nut tall, if the Nut is standing on a crate, and the crate is being held up a little. By someone. I wonder who.', 'The crate is still bouncing down there. Parcels love a spring.'], hint: 'Bolt pulls the crate up from the spring and puts it down a little way from the fence. Nut stands on the crate. Bolt stands right next to it and holds X: the crate lifts Nut. Bolt walks up to the fence and lets go, so the crate carries Nut through the slot. Nut pushes the orange switch. If the crate falls off the shelf it goes back to the belt: push the teal switch up here and the belt brings it back to the spring.' },
    end: { say: ['Parcel delivered. Robot delivered on top of parcel. We will be charging for both.'] },
  },
  outro: 'Overtime done. The parcel has been signed for. By Nut. Standing on it. That is not how signing works, but we accept it.',
};
