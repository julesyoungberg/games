// Controllers and keyboard. Each player is bound to one device id:
//  k1 = keyboard WASD, k2 = keyboard arrows, gN = whole gamepad N, gNL / gNR = left / right half of gamepad N.
const keys = new Set();
addEventListener('keydown', e => {
  keys.add(e.code);
  if (['Tab', 'Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Slash'].includes(e.code)) e.preventDefault();
});
addEventListener('keyup', e => keys.delete(e.code));
addEventListener('blur', () => keys.clear());
const K = c => keys.has(c) ? 1 : 0;

let pads = [];
const prev = {}, state = {};
const DZ = 0.25;
function ax(p, i) { const v = p.axes[i] || 0; return Math.abs(v) < DZ ? 0 : (v - Math.sign(v) * DZ) / (1 - DZ); }
function bt(p, i) { const b = p.buttons[i]; return !!b && (b.pressed || b.value > 0.5); }

function raw(dev) {
  if (dev === 'k1') return { mx: K('KeyD') - K('KeyA'), my: K('KeyS') - K('KeyW'), jump: K('Space'), power: K('KeyE') || K('KeyF'), pause: K('Escape') || K('KeyP'), narr: K('Tab') || K('KeyN') || K('KeyY'), back: K('Escape') || K('Backspace') };
  if (dev === 'k2') return { mx: K('ArrowRight') - K('ArrowLeft'), my: K('ArrowDown') - K('ArrowUp'), jump: K('Slash') || K('Numpad0') || K('ShiftRight'), power: K('Period') || K('ControlRight') || K('NumpadDecimal'), pause: 0, narr: K('Enter') || K('NumpadEnter'), back: 0 };
  const m = /^g(\d+)([LR]?)$/.exec(dev); if (!m) return null;
  const p = pads[+m[1]]; if (!p || !p.connected) return null;
  const dl = bt(p, 14), dr = bt(p, 15), du = bt(p, 12), dd = bt(p, 13);
  if (m[2] === '') {
    let mx = ax(p, 0), my = ax(p, 1);
    if (dl) mx = -1; if (dr) mx = 1; if (du) my = -1; if (dd) my = 1;
    return { mx, my, jump: bt(p, 0), power: bt(p, 2) || bt(p, 1) || bt(p, 7) || bt(p, 5), pause: bt(p, 9), narr: bt(p, 3), back: bt(p, 1), sel: bt(p, 8) };
  }
  if (m[2] === 'L') {
    let mx = ax(p, 0), my = ax(p, 1);
    if (dl) mx = -1; if (dr) mx = 1; if (du) my = -1; if (dd) my = 1;
    return { mx, my, jump: bt(p, 4), power: bt(p, 6) || bt(p, 10), pause: 0, narr: 0, back: 0 };
  }
  return { mx: ax(p, 2), my: ax(p, 3), jump: bt(p, 5) || bt(p, 0), power: bt(p, 7) || bt(p, 2) || bt(p, 11), pause: 0, narr: 0, back: 0 };
}

export const Input = {
  assign: [null, null], // device for [Bolt, Nut]
  forced: null,          // test override: [{mx,mz,jump,...}, ...]
  anyPressed: false,
  poll() {
    pads = navigator.getGamepads ? Array.from(navigator.getGamepads()) : [];
    const devs = ['k1', 'k2'];
    pads.forEach((p, i) => { if (p && p.connected) devs.push('g' + i, 'g' + i + 'L', 'g' + i + 'R'); });
    for (const d in state) if (!devs.includes(d)) delete state[d];
    this.anyPressed = false;
    for (const d of devs) {
      const r = raw(d); if (!r) continue;
      const pv = prev[d] || {};
      const dx = r.mx > 0.5 ? 1 : r.mx < -0.5 ? -1 : 0, dy = r.my > 0.5 ? 1 : r.my < -0.5 ? -1 : 0;
      const now = performance.now();
      // menu navigation with key repeat
      let navX = 0, navY = 0;
      if (dx && dx !== pv.dx) { navX = dx; pv.rx = now + 380; } else if (dx && now > (pv.rx || 0)) { navX = dx; pv.rx = now + 120; }
      if (dy && dy !== pv.dy) { navY = dy; pv.ry = now + 380; } else if (dy && now > (pv.ry || 0)) { navY = dy; pv.ry = now + 120; }
      const s = { ...r, jumpP: !!r.jump && !pv.jump, powerP: !!r.power && !pv.power, pauseP: !!r.pause && !pv.pause, narrP: !!r.narr && !pv.narr, backP: !!r.back && !pv.back, selP: !!r.sel && !pv.sel, navX, navY };
      s.any = s.jumpP || s.powerP || s.pauseP || s.narrP || navX || navY;
      if (s.any) this.anyPressed = true;
      state[d] = s;
      prev[d] = { jump: r.jump, power: r.power, pause: r.pause, narr: r.narr, back: r.back, sel: r.sel, dx, dy, rx: pv.rx, ry: pv.ry };
    }
  },
  devices() { return state; },
  // aggregated menu input from every whole device (not halves)
  menu() {
    const o = { navX: 0, navY: 0, ok: false, back: false, pause: false, narr: false, okDev: null, narrDev: null };
    for (const d in state) {
      if (/[LR]$/.test(d)) continue;
      const s = state[d];
      if (s.navX) o.navX = s.navX; if (s.navY) o.navY = s.navY;
      if (s.jumpP || (d === 'k1' && keys.has('Enter') && s.narrP === false && false)) { o.ok = true; o.okDev = o.okDev || d; }
      if (s.backP) o.back = true;
      if (s.pauseP) o.pause = true;
      if (s.narrP) { o.narr = true; o.narrDev = d; }
    }
    if (keys.has('Enter') && !this._enter) { o.ok = true; o.okDev = o.okDev || 'k1'; }
    this._enter = keys.has('Enter');
    return o;
  },
  player(i) {
    if (this.forced) return this.forced[i] || null;
    const d = this.assign[i]; const s = d && state[d];
    if (!s) return null;
    return { mx: s.mx, mz: s.my, jump: !!s.jump, jumpP: s.jumpP, power: !!s.power, powerP: s.powerP };
  },
  // narrator advance / pause from players' devices (halves share the pad's Y and Start)
  playerPressed(what) {
    for (const d of this.assign) {
      if (!d) continue;
      const base = d.replace(/[LR]$/, '');
      const s = state[base] || state[d];
      if (s && s[what]) return true;
    }
    return false;
  },
  split() { return !!(this.assign[0] && /[LR]$/.test(this.assign[0])); },
  name(d) {
    if (!d) return '';
    if (d === 'k1') return 'Keyboard (WASD)'; if (d === 'k2') return 'Keyboard (arrows)';
    const m = /^g(\d+)([LR]?)$/.exec(d); const p = pads[+m[1]];
    const nm = p ? (p.id || 'Controller').replace(/\(.*?\)/g, '').replace(/Vendor.*$/, '').trim().slice(0, 26) : 'Controller';
    return (m[2] === 'L' ? 'Left half of ' : m[2] === 'R' ? 'Right half of ' : '') + (nm || 'Controller ' + (+m[1] + 1)) + (p && p.mapping !== 'standard' ? ' (unusual button layout: try another browser if buttons feel wrong)' : '');
  },
  connected() { return pads.filter(p => p && p.connected).length; },
  rumble(i, strong = 0.4, ms = 120) {
    const d = this.assign[i]; if (!d || d[0] !== 'g') return;
    const p = pads[parseInt(d.slice(1))];
    try { p && p.vibrationActuator && p.vibrationActuator.playEffect('dual-rumble', { duration: ms, strongMagnitude: strong, weakMagnitude: strong * 0.6 }); } catch (e) { }
  },
};
