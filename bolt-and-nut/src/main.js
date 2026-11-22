// Bolt & Nut — app shell: screens, narrator, game loop.
import { createWorld, step, restartFromCheckpoint } from './sim.js';
import { LEVELS, LINES, ALL, OVERTIME, NMAIN } from './levels.js';
import THUMBS from './thumbs.js';
const lvName = i => ALL[i].ot ? `Overtime ${ALL[i].ot}` : `Shift ${i + 1}`;
const otOpen = k => true; // every level is always open, so lost saves never matter
import { Input } from './input.js';
import { initAudio, SFX, setVolumes, setMood } from './audio.js';
import { View } from './render.js';
import '../../shared/couch-pads/couch-pads.js'; // phone controllers (window.CouchPads)

const $ = id => document.getElementById(id);
const APP = window.bnApp || null; // set by the desktop app's preload

/* ---------------- save + options ---------------- */
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } },
};
// Saves are stored by level NAME (v2), so adding shifts never scrambles progress.
// In memory, done/cogs are level indices into ALL.
const save = (() => {
  const raw = store.get('bn-save', { unlocked: 0, done: [] });
  const idx = n => ALL.findIndex(L => L.name === n);
  if (raw.v === 2) return { ...raw, best: raw.best || {}, done: raw.done.map(idx).filter(i => i >= 0), cogs: (raw.cogs || []).map(idx).filter(i => i >= 0), unlocked: Math.max(0, idx(raw.cur)) };
  // v1 saved indices; main shifts never moved, Overtime indices did, so keep only the first 16 shifts
  const keep = a => (a || []).filter(i => i < 16);
  return { unlocked: Math.min(raw.unlocked || 0, 16), done: keep(raw.done), cogs: keep(raw.cogs), finished: raw.finished, best: {} };
})();
function saveGame() {
  store.set('bn-save', { v: 2, done: save.done.map(i => ALL[i].name), cogs: save.cogs.map(i => ALL[i].name), cur: LEVELS[Math.min(save.unlocked, NMAIN - 1)].name, finished: !!save.finished, best: save.best || {} });
}
// new shifts get added over time: anything after a finished shift is unlocked
if (save.done && save.done.length) save.unlocked = Math.max(save.unlocked, Math.min(NMAIN - 1, Math.max(...save.done.filter(d => d < NMAIN), -1) + 1));
saveGame();
const opts = Object.assign({ master: 8, music: 5, sfx: 8, narrAuto: false, quality: 'auto' }, store.get('bn-opts', {}));
const saveOpts = () => { store.set('bn-opts', opts); setVolumes({ master: opts.master / 10, music: opts.music / 10, sfx: opts.sfx / 10 }); };

/* ---------------- WebGL start-up ---------------- */
let view;
try {
  view = new View($('c'));
} catch (e) {
  console.error(e);
  $('nogl').style.display = 'flex';
  if (APP && APP.webglFailed) APP.webglFailed();
  throw e;
}
view.setQuality(opts.quality);
setVolumes({ master: opts.master / 10, music: opts.music / 10, sfx: opts.sfx / 10 });
$('c').addEventListener('webglcontextlost', e => { e.preventDefault(); toast('Graphics hiccup, recovering…'); });

/* ---------------- narrator ---------------- */
const narr = {
  q: [], cur: null, shown: 0, el: $('narr'), txt: $('narrTxt'), next: $('narrNext'), hold: 0,
  say(lines, front = false) { lines = [].concat(lines).filter(Boolean); if (front) this.q.unshift(...lines); else this.q.push(...lines); },
  // the players reached a new area: anything still queued (or on screen) about earlier areas is stale, so drop it
  moveOn() { this.q = []; if (this.cur) { this.cur = null; } },
  sayIfQuiet(line) { if (!this.cur && !this.q.length) this.say(line); },
  clear() { this.q = []; this.cur = null; this.el.classList.remove('on'); },
  busy() { return !!this.cur || this.q.length > 0; },
  update(dt) {
    if (!this.cur) {
      if (!this.q.length) { this.el.classList.remove('on'); return; }
      this.cur = this.q.shift(); this.shown = 0; this.hold = 0; this.el.classList.add('on');
    }
    if (this.shown < this.cur.length) {
      const a = Math.floor(this.shown); this.shown = Math.min(this.cur.length, this.shown + dt * 48);
      if (Math.floor(this.shown) !== a && a % 3 === 0 && this.cur[a] !== ' ') SFX.tick();
      this.txt.textContent = this.cur.slice(0, Math.floor(this.shown));
      this.next.style.opacity = 0.25;
    } else {
      this.txt.textContent = this.cur; this.hold += dt;
      this.next.style.opacity = 0.6 + Math.sin(performance.now() / 200) * 0.4;
      if (opts.narrAuto && this.hold > Math.max(2.5, this.cur.length * 0.05)) this.cur = null;
    }
    $('narrMore').textContent = this.q.length ? `+${this.q.length}` : '';
  },
  advance() {
    if (!this.cur) return;
    if (this.shown < this.cur.length) { this.shown = this.cur.length; return; }
    this.cur = null; SFX.menu();
  },
};
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const fill = (s, who) => s.replace(/\{name\}/g, who === 0 ? 'Bolt' : 'Nut').replace(/\{other\}/g, who === 0 ? 'Nut' : 'Bolt');

/* ---------------- toast + banner ---------------- */
let toastT = 0;
function toast(t, s = 2.5) { $('toast').textContent = t; $('toast').classList.add('on'); toastT = s; }

/* ---------------- menus ---------------- */
const menuEl = $('menu');
let menu = null; // {title, sub, items:[{label, get?, left?, right?, act?}], sel, back?}
function openMenu(m) { menu = Object.assign({ sel: 0 }, m); renderMenu(); menuEl.classList.add('on'); }
function closeMenu() { menu = null; menuEl.classList.remove('on'); }
function renderMenu() {
  if (!menu) return;
  const items = menu.items.filter(i => !i.hidden);
  menu.sel = Math.max(0, Math.min(items.length - 1, menu.sel));
  const list = `<ul>${items.map((it, i) => `<li class="${i === menu.sel ? 'sel' : ''} ${it.dim ? 'dim' : ''}">${it.label}${it.badges ? `<span class="badges">${it.badges}</span>` : ''}${it.get ? `<span class="val">◂ ${it.get()} ▸</span>` : ''}</li>`).join('')}</ul>`;
  // level menus show a preview picture of the highlighted level
  const cur = items[menu.sel], hasPv = items.some(it => it.thumb);
  const pv = hasPv ? `<div class="pv">${cur && cur.thumb ? `<img src="${cur.thumb}" alt="">` : '<div class="noimg"></div>'}${cur && cur.status ? `<div class="status">${cur.status}</div>` : ''}<p>${cur && cur.desc ? cur.desc : ''}</p></div>` : '';
  const side = menu.side ? `<div class="keys">${menu.side}</div>` : '';
  menuEl.innerHTML = `<div class="box ${menu.cls || ''}">${menu.title ? `<h2>${menu.title}</h2>` : ''}${menu.sub ? `<p class="sub">${menu.sub}</p>` : ''}${hasPv ? `<div class="row">${list}${pv}</div>` : side ? `<div class="row">${list}${side}</div>` : list}${menu.foot ? `<p class="foot">${menu.foot}</p>` : ''}</div>`;
  const selEl = menuEl.querySelector('li.sel'); if (selEl) selEl.scrollIntoView({ block: 'nearest' });
}
function menuInput(m) {
  if (!menu) return;
  const items = menu.items.filter(i => !i.hidden);
  if (m.navY) { menu.sel = (menu.sel + m.navY + items.length) % items.length; SFX.menu(); renderMenu(); }
  const it = items[menu.sel];
  if (m.navX && it) { if (m.navX < 0 && it.left) { it.left(); SFX.menu(); renderMenu(); } if (m.navX > 0 && it.right) { it.right(); SFX.menu(); renderMenu(); } }
  if (m.ok && it) { if (it.act) { SFX.select(); it.act(); } else if (it.right) { it.right(); SFX.menu(); renderMenu(); } }
  else if ((m.back || m.pause) && menu.back) { SFX.menu(); menu.back(); }
}

/* ---------------- game state ---------------- */
let mode = 'title'; // title | join | play | paused | complete | credits
let world = null, levelIdx = 0, hint = null, lastProgress = 0, idleSaid = 0, firsts = {}, lineCd = {}, completeT = -1, accumulator = 0;
let hudT = 0;
const latch = [{}, {}];

function fadeIn(ms = 550) { const f = $('fade'); f.style.transition = 'none'; f.style.opacity = '1'; void f.offsetWidth; f.style.transition = `opacity ${ms}ms ease`; f.style.opacity = '0'; }
function setScreen(id) { for (const s of ['title', 'join', 'hud', 'credits']) $(s).classList.toggle('on', s === id); }

function goTitle() {
  mode = 'title'; closeMenu(); narr.clear(); SFX.stopAll(); setMood(0);
  world = createWorld(0); view.build(world); fadeIn(800);
  setScreen('title');
  const cont = save.unlocked > 0;
  openMenu({
    cls: 'title', items: [
      { label: cont ? `Continue: ${LEVELS[Math.min(save.unlocked, LEVELS.length - 1)].name}` : 'Start orientation', act: () => goJoin(Math.min(save.unlocked, LEVELS.length - 1)) },
      { label: 'Choose a shift', act: chooseShift },
      { label: 'Overtime (bonus puzzles)', badges: (() => { const n = save.done.filter(i => i >= NMAIN).length; return n ? `<b class="bd todo">${n}/${OVERTIME.length}</b>` : ''; })(), act: overtimeMenu },
      { label: 'Options', act: () => optionsMenu(goTitle) },
      { label: 'Quit', hidden: !APP, act: () => APP.quit() },
    ],
  });
}
// progress badges for the level menus
const clock = t => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
function lvBadges(i) {
  const done = save.done.includes(i), cog = save.cogs.includes(i), best = save.best[ALL[i].name];
  return { badges: `${done ? '<b class="bd done">Done</b>' : ''}${cog ? '<b class="bd cog">⚙</b>' : ''}`,
    status: `${done ? '<b class="bd done">Finished</b>' : '<b class="bd todo">Not finished yet</b>'}${cog ? '<b class="bd cog">⚙ Golden cog found</b>' : '<b class="bd todo">Golden cog not found</b>'}${best ? `<b class="bd todo">Best ${clock(best)}</b>` : ''}` };
}
function chooseShift() {
  openMenu({
    title: 'Choose a shift', sub: `Every shift is open. Finished: ${save.done.filter(i => i < NMAIN).length} of ${NMAIN}. Golden cogs: ${save.cogs.filter(i => i < NMAIN).length} of ${NMAIN}.`, back: goTitle,
    items: LEVELS.map((L, i) => ({ label: `${i + 1}. ${L.name}`, ...lvBadges(i), thumb: THUMBS[i], desc: L.sub, act: () => goJoin(i) })).concat([{ label: 'Back', act: goTitle }]),
  });
}
function overtimeMenu() {
  openMenu({
    title: 'Overtime', sub: 'Short, tricky bonus puzzles. Unpaid, obviously.', back: goTitle,
    items: OVERTIME.map((L, k) => { const i = NMAIN + k, open = otOpen(k); return { label: open ? `${k + 1}. ${L.name}` : `${k + 1}. Locked: finish Shift ${L.after + 1}`, ...lvBadges(i), dim: !open, thumb: THUMBS[i], desc: L.sub, act: () => { if (open) goJoin(i); else SFX.pullMiss(); } }; }).concat([{ label: 'Back', act: goTitle }]),
  });
}
function optionsMenu(back) {
  const cyc = (k, vals) => ({ left: () => { opts[k] = vals[(vals.indexOf(opts[k]) - 1 + vals.length) % vals.length]; applyOpts(); }, right: () => { opts[k] = vals[(vals.indexOf(opts[k]) + 1) % vals.length]; applyOpts(); } });
  const num = k => ({ left: () => { opts[k] = Math.max(0, opts[k] - 1); applyOpts(); }, right: () => { opts[k] = Math.min(10, opts[k] + 1); applyOpts(); } });
  const items = [
    { label: 'Volume', get: () => opts.master, ...num('master') },
    { label: 'Music', get: () => opts.music, ...num('music') },
    { label: 'Sound effects', get: () => opts.sfx, ...num('sfx') },
    { label: 'Narrator', get: () => opts.narrAuto ? 'moves on by itself' : 'waits for Y', ...cyc('narrAuto', [false, true]) },
    { label: 'Picture quality', get: () => ({ auto: 'automatic', high: 'sharp', low: 'fast' })[opts.quality], ...cyc('quality', ['auto', 'high', 'low']) },
  ];
  if (APP) items.push({ label: 'Graphics engine', get: () => APP.gpu ? 'graphics card' : 'safe (software)', left: gpuToggle, right: gpuToggle, act: gpuToggle });
  else items.push({ label: 'Fullscreen', act: () => { try { if (!document.fullscreenElement) document.documentElement.requestFullscreen(); else document.exitFullscreen(); } catch (e) { } } });
  items.push({ label: 'Back', act: back });
  openMenu({ title: 'Options', back, items, foot: `Drawing with: ${view.rendererName || 'unknown'}${view.software ? ' (software)' : ''}` });
}
function gpuToggle() {
  openMenu({
    title: APP.gpu ? 'Switch to safe graphics?' : 'Try the graphics card?',
    sub: APP.gpu ? 'The game will restart using software drawing. Slower, but it always shows a picture.' : 'The game will restart using the graphics card. Smoother, but some setups show a black screen. If the picture does not come back, wait 15 seconds: it switches back by itself.',
    back: () => optionsMenu(goTitle),
    items: [{ label: 'Restart now', act: () => APP.setGpu(!APP.gpu) }, { label: 'Cancel', act: () => optionsMenu(goTitle) }],
  });
}
function applyOpts() { saveOpts(); view.setQuality(opts.quality); }

/* ---------------- join screen ---------------- */
let joinLevel = 0, joinOk = 0;
function goJoin(level) {
  joinLevel = level; closeMenu();
  if (Input.assign[0] && Input.assign[1]) { startLevel(level); return; }
  mode = 'join'; Input.assign = [null, null]; joinOk = 0; setScreen('join'); renderJoin();
}
function renderJoin() {
  const a = Input.assign;
  const card = (i, name, cls, how) => `<div class="card ${cls} ${a[i] ? 'in' : ''}"><div class="who">${name}</div><div class="what">${how}</div><div class="dev">${a[i] ? '✔ ' + Input.name(a[i]) : (a[0] || i === 0 ? 'Press <b>A</b> to join' : 'Waiting…')}</div></div>`;
  $('joinCards').innerHTML = card(0, 'Bolt', 'bolt', 'Pulls things. Partner, crates, anchors.') + card(1, 'Nut', 'nut', 'Pushes things. Hard. Rockets off iron.');
  $('joinFoot').innerHTML = a[0] && a[1] ? '<b>A</b> to clock in · <b>X</b> to swap · <b>B</b> to start over' : 'Each player presses <b>A</b> on their own controller. One controller? Press <b>Y</b> to share it. Keyboard: <b>Space</b> (WASD) and <b>/</b> (arrows).';
}
let joinT = 0;
function joinUpdate() {
  const devs = Input.devices(), a = Input.assign;
  const m = Input.menu();
  if (a[0] && a[1]) {
    if (m.ok && joinOk > 0.25) { SFX.select(); startLevel(joinLevel); return; }
    for (const d in devs) if (devs[d].powerP && !/[LR]$/.test(d)) { Input.assign = [a[1], a[0]]; SFX.menu(); renderJoin(); }
    if (m.back) { Input.assign = [null, null]; renderJoin(); }
    return;
  }
  if (m.back && !a[0]) { goTitle(); return; }
  for (const d in devs) {
    const s = devs[d];
    if (/[LR]$/.test(d)) continue;
    const used = a.some(x => x && x.replace(/[LR]$/, '') === d);
    if (d[0] === 'g' && s.narrP && !a[0] && !a[1]) { Input.assign = [d + 'L', d + 'R']; SFX.join(0); SFX.join(1); joinOk = 0; renderJoin(); return; }
    // some setups show one controller twice (e.g. Steam Input): a second "press" arriving while
    // Bolt's own button is still held a moment after he joined is the same press, not a new player
    if (s.jumpP && !used && a[0] && a[0][0] === 'g' && devs[a[0]] && devs[a[0]].jump && performance.now() - joinT < 400) continue;
    if (s.jumpP && !used) {
      const slot = a[0] ? 1 : 0; a[slot] = d; SFX.join(slot); joinOk = 0; joinT = performance.now(); renderJoin();
      return;
    }
  }
}

/* ---------------- playing ---------------- */
function startLevel(i) {
  levelIdx = i; world = createWorld(i); view.build(world); closeMenu(); fadeIn();
  mode = 'play'; setScreen('hud'); narr.clear(); hint = null; firsts = {}; lineCd = {}; completeT = -1; accumulator = 0;
  lastProgress = performance.now(); idleSaid = 0; hudT = 0;
  setMood(ALL[i].theme === 5 || ALL[i].theme === 11 ? 1 : 0, ALL[i].theme || 0, !!ALL[i].ot);
  const L = ALL[i];
  $('bannerN').textContent = lvName(i); $('bannerT').textContent = L.name; $('bannerS').textContent = L.sub;
  $('banner').classList.remove('on'); void $('banner').offsetWidth; $('banner').classList.add('on');
  narr.say(L.intro);
  const sp = Input.split();
  startLevelCtrlText();
  { const kb = Input.assign.filter(a => a && a[0] === 'k').length, pad = Input.assign.filter(a => a && a[0] === 'g').length;
    $('ctrlM').innerHTML = kb && !pad ? 'Tab: next line · Esc: menu &amp; hints' : kb ? 'Y / Tab: next line · Start / Esc: menu' : 'Y: next line · Start: menu &amp; hints'; }
}
// what each player's buttons do, for the device they actually hold
function keysFor(d, who) {
  const pw = who ? 'push' : 'hold to pull';
  if (d === 'k1') return [['WASD', 'move'], ['Space', 'jump'], ['E', pw]];
  if (d === 'k2') return [['Arrows', 'move'], ['/', 'jump'], ['.', pw]];
  if (d && /L$/.test(d)) return [['Left stick', 'move'], ['LB', 'jump'], ['LT', pw]];
  if (d && /R$/.test(d)) return [['Right stick', 'move'], ['RB', 'jump'], ['RT', pw]];
  return [['Stick', 'move'], ['A', 'jump'], ['X or B', pw]];
}
function controlsCard() {
  const one = (who) => {
    const d = Input.assign[who], nm = who ? 'Nut' : 'Bolt';
    const rows = keysFor(d, who).map(([k, v]) => `<tr><td><kbd>${k}</kbd></td><td>${v}</td></tr>`).join('');
    const tip = who ? 'Push near Bolt to launch him. Push a crate to throw it. Push while standing on iron to rocket up.'
      : 'Pull Nut, crates, rings and wall magnets. Let go to drop. Nut can ride on your head.';
    return `<div class="ck ${who ? 'n' : 'b'}"><h3>${nm}</h3><table>${rows}</table><p>${tip}</p></div>`;
  };
  return `${one(0)}${one(1)}<p class="tiny">Y / Tab: next narrator line · Start / Esc: this menu</p>`;
}
function pauseMenu(note) {
  mode = 'paused'; SFX.stopAll();
  openMenu({
    title: 'Paused', sub: note || `${lvName(levelIdx)}: ${ALL[levelIdx].name}`, back: resume, side: controlsCard(),
    items: [
      { label: 'Resume', act: resume },
      { label: 'Ask Margaret for a hint', act: () => { resume(); narr.say(hint || 'My advice: try things. Pull things. Push things. Stand on things. That is basically the job.', true); } },
      { label: 'Back to last checkpoint', act: () => { restartFromCheckpoint(world); resume(); } },
      { label: 'Restart this shift', act: () => startLevel(levelIdx) },
      { label: 'Swap Bolt and Nut', act: () => { Input.assign = [Input.assign[1], Input.assign[0]]; startLevelCtrlText(); resume(); toast('Swapped! Bolt and Nut changed hands.'); } },
      { label: 'Change controllers', act: () => { Input.assign = [null, null]; goJoin(levelIdx); } },
      { label: 'Options', act: () => optionsMenu(() => pauseMenu()) },
      { label: 'Quit to title', act: goTitle },
    ],
  });
}
function startLevelCtrlText() { const t = who => keysFor(Input.assign[who], who).slice(1).map(([k, v]) => `${k} ${v}`).join(' · '); $('ctrlB').innerHTML = `<b>Bolt</b> ${t(0)}`; $('ctrlN').innerHTML = `<b>Nut</b> ${t(1)}`; }
function resume() { closeMenu(); mode = 'play'; }

function say(key, who, cd = 12) {
  const now = performance.now() / 1000;
  if (lineCd[key] && now - lineCd[key] < cd) return;
  lineCd[key] = now;
  const n = who !== undefined ? world.stats.falls[who] + world.stats.zaps[who] : 0;
  narr.sayIfQuiet(fill(pick(LINES[key]), who).replace('{n}', n));
}
function handleEvents(evts) {
  for (const e of evts) {
    switch (e.type) {
      case 'jump': SFX.jump(e.who); view.hop(e.who); break;
      case 'land': SFX.land(e.v); { const p = world.players[e.who]; view.land(e.who, e.v); if (e.v > 7) view.burst(p.pos.x, p.pos.y - p.half.y, p.pos.z, 0xd8cdb8, Math.round(4 + e.v * 0.4), 2.5, 1, 0.35); if (e.v > 14) view.shake(0.06); } break;
      case 'pull': SFX.pullStart(); Input.rumble(0, 0.2, 80); if (!firsts.pull) { firsts.pull = 1; if (levelIdx >= 1) narr.sayIfQuiet(LINES.pullFirst); } break;
      case 'pull-end': SFX.pullEnd(); break;
      case 'pull-miss': SFX.pullMiss(); { const p = world.players[0]; view.burst(p.pos.x, p.pos.y + 1, p.pos.z, 0xff6b6b, 6, 1.5, 1, 0.3); } break; // the press registered: nothing in range yet (holding keeps trying)
      case 'hang': SFX.hang(); if (!firsts.hang) { firsts.hang = 1; narr.sayIfQuiet(LINES.hangFirst); } break;
      case 'push': SFX.push(); view.pushRing(e.x, e.y - 0.2, e.z); Input.rumble(1, 0.35, 120); break;
      case 'launch': SFX.launch(); view.shake(0.18); Input.rumble(e.who, 0.6, 200); if (!firsts.launch) { firsts.launch = 1; narr.sayIfQuiet(LINES.launchFirst); } lastProgress = performance.now(); break;
      case 'crate-launch': SFX.crate(); break;
      case 'rocket': SFX.rocket(); view.shake(0.22); { const p = world.players[1]; view.burst(p.pos.x, p.pos.y - 0.4, p.pos.z, 0x8fc4ff, 16, 3, 0.5, 0.5); } if (!firsts.rocket) { firsts.rocket = 1; narr.sayIfQuiet(LINES.rocketFirst); } break;
      case 'zap': SFX.zap(); view.shake(0.3); view.burst(e.x, e.y, e.z, 0xff2e4d, 18, 5, 3, 0.6); Input.rumble(e.who, 0.8, 250); say('zap', e.who, 15); break;
      case 'fall': SFX.fall(); Input.rumble(e.who, 0.5, 200); say('fall', e.who, 18); break;
      case 'respawn': SFX.respawn(); { const p = world.players[e.who]; view.burst(p.pos.x, p.pos.y, p.pos.z, e.who ? 0x3d8bfd : 0xe5484d, 14, 3, 3, 0.6); } break;
      case 'plate': SFX.plate(e.on); if (e.on) lastProgress = performance.now(); break;
      case 'gate': SFX.gate(e.open); break;
      case 'cog': SFX.cog(); view.burst(e.x, e.y, e.z, 0xffc53d, 26, 5, 4, 0.8); Input.rumble(e.who, 0.4, 150); { const had = save.cogs.includes(levelIdx); if (!had) { save.cogs.push(levelIdx); saveGame(); } if (!had) toast(ALL[levelIdx].ot ? '⚙ Golden cog found!' : `⚙ Golden cog found! ${save.cogs.filter(i => i < NMAIN).length} of ${NMAIN}`); narr.sayIfQuiet(had ? LINES.cogAgain : pick(LINES.cog).replace('{n}', String(save.cogs.filter(i => i < NMAIN).length))); } break;
      case 'tube': SFX.whoosh(); view.burst(e.fx, e.fy, e.fz, 0x9fd8ff, 10, 3, 3, 0.4); view.burst(e.x, e.y, e.z, 0x9fd8ff, 14, 4, 4, 0.5); if (!firsts.tube && e.who !== undefined) { firsts.tube = 1; narr.sayIfQuiet(LINES.tubeFirst); } break;
      case 'spring': SFX.boing(); view.shake(0.1); view.burst(e.x, e.y + 0.1, e.z, 0xf2b84b, 8, 3, 2, 0.4); if (e.who !== undefined) Input.rumble(e.who, 0.3, 90); if (!firsts.spring && e.who !== undefined) { firsts.spring = 1; narr.sayIfQuiet(LINES.springFirst); } break;
      case 'switch': SFX.toggle(e.on); lastProgress = performance.now(); if (!firsts.sw) { firsts.sw = 1; narr.sayIfQuiet(LINES.switchFirst); } break;
      case 'bridge': SFX.bridge(e.on); break;
      case 'checkpoint': SFX.checkpoint(); lastProgress = performance.now(); break;
      case 'crate-lost': if (!firsts.crate) { firsts.crate = 1; narr.sayIfQuiet(LINES.crateLost); } break;
      case 'exit-one': if (!firsts.exit) { firsts.exit = 1; narr.sayIfQuiet(pick(LINES.exitOne)); } break;
      case 'zone': {
        const z = ALL[levelIdx].zones[e.id]; lastProgress = performance.now();
        if (z) { if (z.say) { narr.moveOn(); narr.say(z.say); } if (z.hint) hint = z.hint; }
        break;
      }
      case 'complete': SFX.complete(); SFX.stopAll(); completeT = 0; break;
    }
  }
}
function finishLevel() {
  mode = 'complete';
  { const e = world.exit, x = (e.min.x + e.max.x) / 2, z = (e.min.z + e.max.z) / 2; for (const c of [0xe5484d, 0x3d8bfd, 0xffc53d, 0x2ec4b6, 0xf15bb5]) view.burst(x, e.top + 1, z, c, 14, 5, 7, 1.6); view.shake(0.15); }
  const L = ALL[levelIdx], ot = !!L.ot;
  if (!save.done.includes(levelIdx)) save.done.push(levelIdx);
  if (!ot) save.unlocked = Math.max(save.unlocked, Math.min(NMAIN - 1, levelIdx + 1));
  if (levelIdx === NMAIN - 1) save.finished = true;
  saveGame();
  const s = world.stats;
  const last = levelIdx === NMAIN - 1;
  // best times, kept by level name
  const secs = world.t, prev = save.best[L.name], newBest = !prev || secs < prev - 0.05;
  if (newBest) { save.best[L.name] = Math.round(secs * 10) / 10; saveGame(); }
  const timeTxt = `Time ${clock(secs)}${newBest ? (prev ? ' · <b class="bd done">New best!</b>' : '') : ` · best ${clock(prev)}`}`;
  const cogTxt = save.cogs.includes(levelIdx) ? '<b class="bd cog">⚙ Golden cog found</b>' : '<b class="bd todo">Golden cog still hidden</b>';
  const newOt = OVERTIME.findIndex(o => o.after === levelIdx);
  narr.moveOn(); // anything still queued is about the level they just left
  narr.say(newOt >= 0 && !ot ? [L.outro, 'Also: there is an Overtime bonus puzzle that goes with this shift. Title screen, Overtime. Unpaid. Very rewarding. Spiritually.'] : L.outro);
  const nextOt = ot && NMAIN + L.ot < ALL.length && otOpen(L.ot) ? NMAIN + L.ot : -1;
  const items = ot ? [
    nextOt >= 0 ? { label: `Next: Overtime ${L.ot + 1}`, act: () => { narr.clear(); startLevel(nextOt); } } : null,
    { label: 'Replay this one', act: () => startLevel(levelIdx) },
    { label: 'Back to Overtime', act: () => { narr.clear(); goTitle(); overtimeMenu(); } },
    { label: 'Quit to title', act: goTitle },
  ].filter(Boolean) : [
    { label: last ? 'Read your performance review' : `Clock in for shift ${levelIdx + 2}`, act: () => { narr.clear(); last ? goCredits() : startLevel(levelIdx + 1); } },
    { label: 'Replay this shift', act: () => startLevel(levelIdx) },
    { label: 'Quit to title', act: goTitle },
  ];
  openMenu({
    cls: 'done', title: `${lvName(levelIdx)} complete`, sub: L.name, items,
    foot: `<span class="tm">${timeTxt}</span> ${cogTxt}<br>Falls: Bolt ${s.falls[0]}, Nut ${s.falls[1]} · Launches: ${s.launches} · Pulls: ${s.pulls} · Lasered: ${s.zaps[0] + s.zaps[1]}`,
  });
}
function goCredits() {
  mode = 'credits'; closeMenu(); setScreen('credits'); narr.clear(); fadeIn(900);
  const cogs = save.cogs.filter(i => i < NMAIN).length, ot = save.done.filter(i => i >= NMAIN).length;
  $('credStats').innerHTML = `Shifts worked: ${NMAIN} of ${NMAIN} · Golden cogs: ${cogs} of ${NMAIN} · Overtime done: ${ot} of ${OVERTIME.length}`;
  narr.say(['And that is the year. Every shift, every crate, every laser you walked into on purpose.',
    'Your annual review is complete. Result: exceeds expectations. Expectations have been informed.',
    cogs < NMAIN ? `There are still ${NMAIN - cogs} golden cogs hiding in the factory. Management would love them back. Management would love anything back.` : 'You found every golden cog. Management has nothing left to hide. Management is nervous.',
    'Thank you for working at Attraction Industries. Opposites attract. You two proved it. Now go home. Or do overtime. Mostly overtime.']);
}

/* ---------------- main loop ---------------- */
let last = performance.now();
let started = false;
function frame(now) {
  requestAnimationFrame(frame);
  const dtMs = Math.min(100, now - last); last = now;
  const dt = dtMs / 1000;
  Input.poll();
  if (Input.anyPressed) { initAudio(); started = true; }
  $('press').classList.toggle('on', !started && mode === 'title');
  const m = Input.menu();
  if (toastT > 0) { toastT -= dt; if (toastT <= 0) $('toast').classList.remove('on'); }
  if (mode === 'title') {
    menuInput(m);
    idleStep(dt);
  } else if (mode === 'join') {
    joinOk += dt; joinUpdate(); idleStep(dt);
  } else if (mode === 'play') {
    if (m.pause || Input.playerPressed('pauseP')) { pauseMenu(); }
    else {
      // controller dropped?
      for (let i = 0; i < 2; i++) if (Input.assign[i] && !Input.forced && !Input.player(i)) { pauseMenu(`${i ? 'Nut' : 'Bolt'}'s controller went quiet. Press a button on it, then Resume.`); break; }
    }
    if (mode === 'play') {
      if (Input.playerPressed('narrP') || (m.narr && Input.assign.some(a => a && a[0] === 'k'))) narr.advance();
      for (let i = 0; i < 2; i++) { const pi = Input.player(i); if (pi) { if (pi.jumpP) latch[i].jumpP = 1; if (pi.powerP) latch[i].powerP = 1; } }
      accumulator += dt;
      let steps = 0;
      while (accumulator >= 1 / 60 && steps < 5) {
        world.events = [];
        const ins = [Input.player(0), Input.player(1)];
        // a press that landed on a frame with no sim step is kept until a step uses it
        for (let i = 0; i < 2; i++) if (ins[i]) { ins[i].jumpP = !!latch[i].jumpP; ins[i].powerP = !!latch[i].powerP; latch[i] = {}; }
        step(world, ins, 1 / 60);
        handleEvents(world.events);
        footsteps(1 / 60);
        accumulator -= 1 / 60; steps++;
      }
      if (steps === 5) accumulator = 0;
      if (completeT >= 0) { completeT += dt; if (completeT > 1.2) finishLevel(); }
      // idle chatter
      if (performance.now() - lastProgress > 100000 && performance.now() - idleSaid > 150000) { idleSaid = performance.now(); narr.sayIfQuiet(pick(LINES.idle)); }
      hudT += dt; $('ctrls').style.opacity = hudT < 25 ? 1 : 0.35;
    }
  } else if (mode === 'paused' || mode === 'complete') {
    if (mode === 'complete' && Input.playerPressed('narrP')) narr.advance();
    menuInput(m);
  } else if (mode === 'credits') {
    if (Input.playerPressed('narrP') || m.narr) narr.advance();
    if (m.ok || m.back) goTitle();
    idleStep(dt);
  }
  narr.update(dt);
  document.body.classList.toggle('paused', mode === 'paused');
  document.body.classList.toggle('carded', mode === 'paused' || mode === 'complete');
  view.draw(world, dt, { title: mode === 'title' || mode === 'join' || mode === 'credits', showTarget: mode === 'play', cogsFound: save.cogs.includes(levelIdx) });
  view.adapt(dtMs);
}
// footstep sounds: one per stride while a robot walks on the ground
const stride = [0, 0];
function footsteps(dt) {
  for (const p of world.players) {
    const sp = Math.hypot(p.vel.x, p.vel.z);
    if (!p.alive || !p.grounded || sp < 1.2 || (p.ground && p.ground.oil)) { stride[p.id] = Math.min(stride[p.id], 0.5); continue; }
    stride[p.id] += sp * dt;
    const len = p.id ? 0.75 : 1.0;
    if (stride[p.id] >= len) { stride[p.id] -= len; SFX.step(p.id, !!(p.ground && p.ground.iron)); }
  }
}
function idleStep(dt) {
  // little title-screen ambience: the robots bounce now and then
  world.events = [];
  const t = performance.now() / 1000;
  const hop = i => ({ mx: 0, mz: 0, jump: Math.sin(t * 1.3 + i * 2) > 0.97, jumpP: false, power: false, powerP: false });
  const a = hop(0), b = hop(1); a.jumpP = a.jump && !idleStep.pa; b.jumpP = b.jump && !idleStep.pb; idleStep.pa = a.jump; idleStep.pb = b.jump;
  accumulator += dt;
  while (accumulator >= 1 / 60) { step(world, [a, b], 1 / 60); a.jumpP = b.jumpP = false; accumulator -= 1 / 60; }
}

// phone controllers: phones show up as extra gamepads (see shared/couch-pads)
window.CouchPads.init({
  game: 'Bolt & Nut', accent: '#ffb547',
  labels: { a: 'Jump', b: 'Power', x: 'Power', y: 'Narrator', start: 'Pause' },
  keys: ['WASD move · Space jump · E power · Tab narrator · Esc pause', 'Arrows move · / jump · . power · Enter narrator'],
  screen: () => mode === 'join' ? 'join' : (mode === 'title' || mode === 'paused') ? 'hint' : null,
});

// test hooks (used by the automated checks; harmless in normal play)
window.__bn = {
  get mode() { return mode; }, get world() { return world; }, view, narr, Input,
  start(i) { Input.assign = ['k1', 'k2']; startLevel(i); },
  force(arr) { Input.forced = arr; },
  get count() { return ALL.length; },
};

goTitle();
if (APP && APP.gpu && APP.pending) {
  let left = 15;
  const ask = () => openMenu({
    title: 'Can you see this?', sub: `The game is now using the graphics card. Press A to keep it. Otherwise it switches back to safe mode in ${left} s.`,
    items: [{ label: 'Keep graphics card mode', act: () => { clearInterval(tick); APP.confirmGpu(); toast('Graphics card mode saved.'); goTitle(); } }, { label: 'Switch back to safe mode', act: () => APP.setGpu(false) }],
  });
  const tick = setInterval(() => { left--; if (menu && menu.title === 'Can you see this?') { const sel = menu.sel; ask(); menu.sel = sel; renderMenu(); } if (left <= 0) clearInterval(tick); }, 1000);
  ask();
}
requestAnimationFrame(frame);
