// Shift 29 (played as Shift 27): Interdepartmental. Accounts and Payroll share one printer and do not speak.
// Switch and plate logic across dividing walls: a belt "printer" through a laser hatch, an airlock (one plate colour opens the
// fire door and takes the walkway away), a latched exit that needs a robot on one side and a crate on the other at once,
// and standing desks: gates used as lifts that rise while the pink channel is on.
// Cross walls and gates are 11.2 m tall and a thin laser ceiling runs at 10.6 m, so nobody can climb or fly over a wall.
// By the standing desks the laser ceiling over the floor drops to 5.6 m, and the desk has its own curtain while it is down,
// so nobody gets up to Head Office by launching, double launching or standing on each other.
const BW = (L, x0, x1, top, h = 12) => L.box(x0, -9.5, x1, -8, top - 6, top + h, 'backwall');
const H = 11.2; // wall and gate height
const T = 7.6; // head office floor

export default {
  name: 'Interdepartmental', sub: 'Shift 27. Two offices. One printer. Nobody is speaking.', theme: 0,
  intro: [
    'Shift twenty seven. Interdepartmental. Accounts and Payroll share one printer. They have not spoken since the spring.',
    'You have both been lent out for the day. Bolt is in Accounts. Nut is in Payroll. Please be polite through the wall.',
  ],
  build(L) {
    L.start(3, -2.5, 20.5, -2.5);
    BW(L, 0, 86, 0);
    L.laser(0, -8, 86, 0, 10.6, H); // laser ceiling: nobody gets over a wall
    /* ---- 1. Print Queue: the printer is a belt through a laser hatch. It feeds back to Accounts unless Payroll holds the print button.
            Bolt puts the crate on the belt; Nut holds the button; the crate rides through into the tray and the door opens */
    L.floor(0, -8, 6.5, 0, 0); L.floor(6.5, -5.4, 11, 0, 0);
    L.conveyor(6.5, -8, 16, -5.4, 0, -3, 0, [2]);
    L.box(11, -5.4, 11.6, -3.6, 0, H); L.box(11, -8, 11.6, -5.4, 2.2, H);
    L.laser(11, -8, 11.6, -5.4, 0, 2.2);
    L.gate(11, -3.6, 11.6, 0, 0, H, [1]);
    L.crate(3.5, -5, 0);
    L.floor(11.6, -5.4, 30, 0, 0); L.floor(16, -8, 18.8, -5.4, 0); L.floor(18.8, -8, 30, -5.4, 0);
    L.laser(11.6, -8, 16, -5.4, 0, 3);
    L.box(16, -5.4, 19.2, -5, 0, 3); L.box(18.8, -8, 19.2, -5.4, 0, 3);
    L.plate(17.2, -6.7, 1, -0.07);
    L.plate(14.5, -2.5, 2, 0);
    /* golden cog: high over Payroll. Nut launches Bolt */
    L.cog(23.5, 4.4, -6.6);
    /* ---- 2. Fire Door: both pink plates open the fire door and take the walkway away. The pit has a laser roof */
    L.plate(25.5, -1.6, 3, 0);
    L.gate(30, -8, 30.6, 0, 0, H, [3]);
    L.floor(30.6, -8, 33, 0, 0);
    L.bridge(33, -6, 40.5, -2, 0, [3], { invert: true });
    L.laser(33, -8, 40.5, 0, 1.6, H);
    L.floor(40.5, -8, 54, 0, 0);
    L.plate(44.5, -1.6, 3, 0);
    /* ---- 3. In Tray: the exit latches open when a robot stands on the lime plate and the crate is on the purple one, at the same time.
            The lime plate is on this side of the wall; the crate and the purple tray on its cabinet are on the other side. One hatch */
    L.plate(52.6, -6.5, 4, 0);
    L.box(54, -8, 54.6, -7.4, 0, H); L.box(54, -5.6, 54.6, -3.8, 0, H); L.box(54, -7.4, 54.6, -5.6, 2.4, H);
    L.laser(54, -7.4, 54.6, -5.6, 0, 2.4);
    L.gate(54, -3.8, 54.6, 0, 0, H, [4]);
    L.floor(54.6, -8, 66, 0, 0); L.crate(57.4, -6.5, 0);
    L.box(59.9, -7.6, 62.1, -5.4, -1, 2, 'shelf'); L.plate(61, -6.5, 5, 2);
    L.laser(59.9, -7.6, 62.1, -5.4, 2.3, 10.6);
    L.gate(66, -8, 66.6, 0, 0, H, [4, 5], { latch: true });
    /* ---- 4. Standing Desks: the desk rises while the pink channel is on: Nut's switch down here, or Bolt's plate up in Head Office.
            While it is down, its safety curtain is on above head height, so there is no hopping or climbing on Nut in the desk.
            Skirting lasers on the wall stop any reeling, and the low laser ceiling over the floor stops any launching */
    L.floor(66.6, -8, 83, 0, 0); L.floor(83, -8, 86, -6.6, 0); L.floor(83, -3.4, 86, 0, 0); L.floor(85.6, -6.6, 86, -3.4, 0);
    L.gate(83, -6.6, 85.6, -3.4, 0, T - 0.35, [3], { invert: true });
    L.laser(83, -6.6, 85.6, -3.4, 1.4, 12, [3]);
    L.laser(85.6, -8, 86, 0, -1, T - 0.55);
    L.laser(66.6, -8, 83, 0, 5.6, 6); L.laser(83, -8, 85.6, -6.6, 5.6, 6); L.laser(83, -3.4, 85.6, 0, 5.6, 6);
    L.button(75, -6.6, 3, 0);
    L.box(86, -8, 98, 0, -6, T, 'floor'); BW(L, 86, 98, T, 10);
    L.plate(89, -5, 3, T);
    L.exit(92, -6.5, 97.5, -1.5, T);
    /* ---- checkpoints, zones, decoration */
    L.checkpoint(23, -8, 29.5, 0, 26, -4.5, 28, -4.5);
    L.checkpoint(45, -8, 50, 0, 47, -4, 47, -6);
    L.checkpoint(67, -8, 72, 0, 69, -3, 69, -5.5);
    L.checkpoint(90, -8, 98, 0, 93, -3, 93, -5.5);
    L.zone('print', 0, -8, 30, 0);
    L.zone('cog', 20.5, -8, 26.5, -5.4, 2, 50);
    L.zone('fire', 26.5, -8, 30, 0);
    L.zone('tray', 45, -8, 50, 0);
    L.zone('desk', 67, -8, 72, 0);
    L.zone('end', 90, -8, 98, 0, T - 1, 50);
    L.deco(5, -11, 6.5, -9.5, 0, 14, 'pipe'); L.deco(36, -11, 37.5, -9.5, -6, 14, 'pipe'); L.deco(58, -11, 59.5, -9.5, 0, 14, 'pipe'); L.deco(79, -11, 80.5, -9.5, 0, 14, 'pipe'); L.deco(94, -11, 95.5, -9.5, T, T + 12, 'pipe');
    L.sign(5.5, 2.4, -7.9, 'ACCOUNTS');
    L.sign(22, 2.4, -7.9, 'PAYROLL');
    L.sign(11.3, 3.2, -7.9, 'PRINTER');
    L.sign(37, 3, -7.9, 'FIRE DOOR');
    L.sign(54.3, 3.4, -7.9, 'IN TRAY');
    L.sign(77, 2.4, -7.9, 'STANDING DESKS');
    L.sign(92, T + 2.4, -7.9, 'HEAD OFFICE');
  },
  zones: {
    print: { say: ['The printer lives in the wall between the two offices. It feeds back to Accounts unless somebody in Payroll holds the print button down.', 'The door opens when the paper tray in Payroll gets something heavy in it. Please do not climb into the printer. People have tried. It is not that kind of printer.'], hint: 'Nut stands on the orange plate in Payroll and stays there, so the printer belt runs toward Payroll. Bolt pulls the iron crate over and drops it on the belt (hold X near it, walk it over, let go). It rides through the hatch into the teal tray and the door in the wall opens. Bolt walks through.' },
    cog: { say: ['There is a golden cog up by the Payroll ceiling. Nobody in Payroll will admit to putting it there.'], hint: 'Optional golden cog. Bolt stands under the cog, Nut stands right next to him and presses X to launch him.' },
    fire: { say: ['The fire door. Either pink plate opens it, and the same pink plates take the walkway away. It is a fire door. It is very sure of itself.', 'There is a laser roof over the pit, so please walk. One of you holds the door. One of you waits in the little lobby. Then swap.'], hint: 'Bolt stands on the pink plate and the door opens. Nut walks into the little lobby. Bolt steps off: the door shuts and the walkway comes back. Nut walks over and stands on the far pink plate. The door opens again; Bolt walks into the lobby. Nut steps off, the walkway comes back and Bolt walks over. No jumping on the walkway.' },
    tray: { say: ['The in tray. The exit only opens if somebody stands on the lime plate on this side while the crate sits in the purple tray on top of the cabinet over there. At the same time. After that it stays open. It is that kind of exit.', 'The lime plate also opens the door in the wall. There is one crate, and one hatch. The hatch takes crates. It does not take staff.'], hint: 'Bolt stands on the lime plate and Nut walks through the door. Bolt stays on the plate. Nut stands behind the crate, lined up with the cabinet, and presses X to throw it up onto the purple plate. The exit latches open. Nut walks over by the exit, out of the way. Bolt stands just behind the lime plate, faces the hatch and holds X to pull the crate off the cabinet, through the hatch and onto the lime plate. The door opens and he can follow.' },
    desk: { say: ['Head Office is upstairs. There are no stairs. There are standing desks. The desk goes up while the pink channel is on, and comes down when it is off.', 'Nut has the switch down here. There is a pink plate up in Head Office. When the desk is down its safety curtain is on, so no hopping on it. And nobody gets off the desk by going down with it. Step off at the top.'], hint: 'Bolt stands on the desk while it is down. Nut pushes the pink switch and the desk lifts him up. He steps off onto Head Office. Nut pushes the switch again so the desk comes down, and stands on it. Bolt stands on the pink plate upstairs and the desk lifts her. She steps off. No jumping on the desk.' },
    end: { say: ['Head Office. Very quiet. Very carpeted. There is a printer up here too. It works. Nobody downstairs must ever know.'] },
  },
  outro: 'Shift twenty seven complete. Accounts and Payroll are speaking again. Mostly about you. It was all very positive. I think.',
};
