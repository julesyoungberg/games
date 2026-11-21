// Bolt & Nut — app shell: screens, narrator, game loop.
import { createWorld, step, restartFromCheckpoint } from './sim.js';
import { LEVELS, LINES } from './levels.js';
import { Input } from './input.js';
import { initAudio, SFX, setVolumes, setMood } from './audio.js';
import { View } from './render.js';

const $ = id => document.getElementById(id);
const APP = window.bnApp || null; // set by the desktop app's preload

/* ---------------- save + options ---------------- */
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } },
};
const save = store.get('bn-save', { unlocked: 0, done: [] });
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
  menuEl.innerHTML = `<div class="box ${menu.cls || ''}">${menu.title ? `<h2>${menu.title}</h2>` : ''}${menu.sub ? `<p class="sub">${menu.sub}</p>` : ''}<ul>${items.map((it, i) => `<li class="${i === menu.sel ? 'sel' : ''} ${it.dim ? 'dim' : ''}">${it.label}${it.get ? `<span class="val">◂ ${it.get()} ▸</span>` : ''}</li>`).join('')}</ul>${menu.foot ? `<p class="foot">${menu.foot}</p>` : ''}</div>`;
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

function setScreen(id) { for (const s of ['title', 'join', 'hud', 'credits']) $(s).classList.toggle('on', s === id); }

function goTitle() {
  mode = 'title'; closeMenu(); narr.clear(); SFX.stopAll(); setMood(0);
  world = createWorld(0); view.build(world);
  setScreen('title');
  const cont = save.unlocked > 0;
  openMenu({
    cls: 'title', items: [
      { label: cont ? `Continue: Shift ${Math.min(save.unlocked, LEVELS.length - 1) + 1}` : 'Start orientation', act: () => goJoin(Math.min(save.unlocked, LEVELS.length - 1)) },
      { label: 'Choose a shift', hidden: !cont, act: chooseShift },
      { label: 'Options', act: () => optionsMenu(goTitle) },
      { label: 'Quit', hidden: !APP, act: () => APP.quit() },
    ],
  });
}
function chooseShift() {
  openMenu({
    title: 'Choose a shift', back: goTitle,
    items: LEVELS.map((L, i) => ({ label: `${i + 1}. ${L.name}${save.done.includes(i) ? ' ✓' : ''}`, dim: i > save.unlocked, act: () => { if (i <= save.unlocked) goJoin(i); else SFX.pullMiss(); } })).concat([{ label: 'Back', act: goTitle }]),
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
    if (s.jumpP && !used) {
      const slot = a[0] ? 1 : 0; a[slot] = d; SFX.join(slot); joinOk = 0; renderJoin();
      return;
    }
  }
}

/* ---------------- playing ---------------- */
function startLevel(i) {
  levelIdx = i; world = createWorld(i); view.build(world); closeMenu();
  mode = 'play'; setScreen('hud'); narr.clear(); hint = null; firsts = {}; lineCd = {}; completeT = -1; accumulator = 0;
  lastProgress = performance.now(); idleSaid = 0; hudT = 0;
  setMood(i === 5 ? 1 : 0);
  const L = LEVELS[i];
  $('bannerN').textContent = `Shift ${i + 1}`; $('bannerT').textContent = L.name; $('bannerS').textContent = L.sub;
  $('banner').classList.remove('on'); void $('banner').offsetWidth; $('banner').classList.add('on');
  narr.say(L.intro);
  const sp = Input.split();
  $('ctrlB').innerHTML = `<b>Bolt</b> ${sp ? 'left stick · LB jump · LT pull' : 'A jump · hold X pull'}`;
  $('ctrlN').innerHTML = `<b>Nut</b> ${sp ? 'right stick · RB jump · RT push' : 'A jump · X push'}`;
  $('ctrlM').innerHTML = `Y: next line · Start: menu &amp; hints`;
}
function pauseMenu(note) {
  mode = 'paused'; SFX.stopAll();
  openMenu({
    title: 'Paused', sub: note || `Shift ${levelIdx + 1}: ${LEVELS[levelIdx].name}`, back: resume,
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
function startLevelCtrlText() { const sp = Input.split(); $('ctrlB').innerHTML = `<b>Bolt</b> ${sp ? 'left stick · LB jump · LT pull' : 'A jump · hold X pull'}`; $('ctrlN').innerHTML = `<b>Nut</b> ${sp ? 'right stick · RB jump · RT push' : 'A jump · X push'}`; }
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
      case 'jump': SFX.jump(e.who); break;
      case 'land': SFX.land(); { const p = world.players[e.who]; view.burst(p.pos.x, p.pos.y - p.half.y, p.pos.z, 0xffffff, 6, 2.5, 1, 0.35); } break;
      case 'pull': SFX.pullStart(); Input.rumble(0, 0.2, 80); if (!firsts.pull) { firsts.pull = 1; if (levelIdx >= 1) narr.sayIfQuiet(LINES.pullFirst); } break;
      case 'pull-end': SFX.pullEnd(); break;
      case 'pull-miss': SFX.pullMiss(); break;
      case 'hang': SFX.hang(); if (!firsts.hang) { firsts.hang = 1; narr.sayIfQuiet(LINES.hangFirst); } break;
      case 'push': SFX.push(); view.pushRing(e.x, e.y - 0.2, e.z); Input.rumble(1, 0.35, 120); break;
      case 'launch': SFX.launch(); Input.rumble(e.who, 0.6, 200); if (!firsts.launch) { firsts.launch = 1; narr.sayIfQuiet(LINES.launchFirst); } lastProgress = performance.now(); break;
      case 'crate-launch': SFX.crate(); break;
      case 'rocket': SFX.rocket(); { const p = world.players[1]; view.burst(p.pos.x, p.pos.y - 0.4, p.pos.z, 0x8fc4ff, 16, 3, 0.5, 0.5); } if (!firsts.rocket) { firsts.rocket = 1; narr.sayIfQuiet(LINES.rocketFirst); } break;
      case 'zap': SFX.zap(); view.burst(e.x, e.y, e.z, 0xff2e4d, 18, 5, 3, 0.6); Input.rumble(e.who, 0.8, 250); say('zap', e.who, 15); break;
      case 'fall': SFX.fall(); Input.rumble(e.who, 0.5, 200); say('fall', e.who, 18); break;
      case 'respawn': SFX.respawn(); { const p = world.players[e.who]; view.burst(p.pos.x, p.pos.y, p.pos.z, e.who ? 0x3d8bfd : 0xe5484d, 14, 3, 3, 0.6); } break;
      case 'plate': SFX.plate(e.on); if (e.on) lastProgress = performance.now(); break;
      case 'gate': SFX.gate(e.open); break;
      case 'bridge': SFX.bridge(e.on); break;
      case 'checkpoint': SFX.checkpoint(); lastProgress = performance.now(); break;
      case 'crate-lost': if (!firsts.crate) { firsts.crate = 1; narr.sayIfQuiet(LINES.crateLost); } break;
      case 'exit-one': if (!firsts.exit) { firsts.exit = 1; narr.sayIfQuiet(pick(LINES.exitOne)); } break;
      case 'zone': {
        const z = LEVELS[levelIdx].zones[e.id]; lastProgress = performance.now();
        if (z) { if (z.say) narr.say(z.say); if (z.hint) hint = z.hint; }
        break;
      }
      case 'complete': SFX.complete(); SFX.stopAll(); completeT = 0; break;
    }
  }
}
function finishLevel() {
  mode = 'complete';
  if (!save.done.includes(levelIdx)) save.done.push(levelIdx);
  save.unlocked = Math.max(save.unlocked, Math.min(LEVELS.length - 1, levelIdx + 1));
  if (levelIdx === LEVELS.length - 1) save.finished = true;
  store.set('bn-save', save);
  const s = world.stats;
  const last = levelIdx === LEVELS.length - 1;
  narr.say(LEVELS[levelIdx].outro);
  openMenu({
    cls: 'done', title: `Shift ${levelIdx + 1} complete`, sub: LEVELS[levelIdx].name,
    items: [
      { label: last ? 'Read your performance review' : `Clock in for shift ${levelIdx + 2}`, act: () => { narr.clear(); last ? goCredits() : startLevel(levelIdx + 1); } },
      { label: 'Replay this shift', act: () => startLevel(levelIdx) },
      { label: 'Quit to title', act: goTitle },
    ],
    foot: `Falls: Bolt ${s.falls[0]}, Nut ${s.falls[1]} · Launches: ${s.launches} · Pulls: ${s.pulls} · Lasered: ${s.zaps[0] + s.zaps[1]}`,
  });
}
function goCredits() {
  mode = 'credits'; closeMenu(); setScreen('credits'); narr.clear();
  narr.say(['That concludes orientation. You may now call yourselves Attraction Industries employees. There is no pay. There is cake. The cake is also a crate.', 'More shifts are being built as we speak. Margaret will be here. Margaret is always here.']);
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
      accumulator += dt;
      let steps = 0;
      while (accumulator >= 1 / 60 && steps < 5) {
        world.events = [];
        const ins = [Input.player(0), Input.player(1)];
        if (steps > 0 && ins[0]) { ins[0].jumpP = false; ins[0].powerP = false; }
        if (steps > 0 && ins[1]) { ins[1].jumpP = false; ins[1].powerP = false; }
        step(world, ins, 1 / 60);
        handleEvents(world.events);
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
  view.draw(world, dt, { title: mode === 'title' || mode === 'join' || mode === 'credits', showTarget: mode === 'play' });
  view.adapt(dtMs);
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

// test hooks (used by the automated checks; harmless in normal play)
window.__bn = {
  get mode() { return mode; }, get world() { return world; }, view, narr, Input,
  start(i) { Input.assign = ['k1', 'k2']; startLevel(i); },
  force(arr) { Input.forced = arr; },
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
