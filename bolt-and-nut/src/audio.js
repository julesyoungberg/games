// Tiny synth: sound effects and a gentle generative factory tune. No audio files.
let ctx = null, master, sfxBus, musBus, noiseBuf;
const vol = { master: 0.8, music: 0.5, sfx: 0.8 };

export function initAudio() {
  if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
  try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return; }
  master = ctx.createGain(); master.connect(ctx.destination);
  sfxBus = ctx.createGain(); sfxBus.connect(master);
  musBus = ctx.createGain(); musBus.connect(master);
  noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  setVolumes(vol);
  music.start();
}
export function setVolumes(v) {
  Object.assign(vol, v);
  if (!ctx) return;
  master.gain.value = vol.master; sfxBus.gain.value = vol.sfx; musBus.gain.value = vol.music * 0.55;
}

function tone(type, f0, f1, dur, gain = 0.2, when = 0, bus = sfxBus) {
  if (!ctx) return;
  const t = ctx.currentTime + when;
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type; o.frequency.setValueAtTime(f0, t);
  if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(bus); o.start(t); o.stop(t + dur + 0.05);
}
function noise(dur, gain = 0.2, f0 = 2000, f1 = 300, q = 1, when = 0, type = 'bandpass') {
  if (!ctx) return;
  const t = ctx.currentTime + when;
  const s = ctx.createBufferSource(); s.buffer = noiseBuf;
  const f = ctx.createBiquadFilter(); f.type = type; f.Q.value = q; f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(Math.max(30, f1), t + dur);
  const g = ctx.createGain(); g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(f); f.connect(g); g.connect(sfxBus); s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.05);
}

// continuous magnet hum while Bolt pulls
let hum = null;
function humOn() {
  if (!ctx || hum) return;
  const o = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain(), lfo = ctx.createOscillator(), lg = ctx.createGain();
  o.type = 'sawtooth'; o.frequency.value = 92; o2.type = 'sine'; o2.frequency.value = 184;
  const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 600;
  lfo.frequency.value = 7; lg.gain.value = 180; lfo.connect(lg); lg.connect(f.frequency);
  g.gain.value = 0.0001; g.gain.exponentialRampToValueAtTime(0.07, ctx.currentTime + 0.08);
  o.connect(f); o2.connect(f); f.connect(g); g.connect(sfxBus);
  o.start(); o2.start(); lfo.start();
  hum = { o, o2, g, lfo };
}
function humOff() {
  if (!hum || !ctx) return;
  const h = hum; hum = null;
  h.g.gain.cancelScheduledValues(ctx.currentTime); h.g.gain.setValueAtTime(h.g.gain.value, ctx.currentTime);
  h.g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
  setTimeout(() => { try { h.o.stop(); h.o2.stop(); h.lfo.stop(); } catch (e) { } }, 200);
}

export const SFX = {
  jump(who) { tone('square', who ? 330 : 260, who ? 620 : 520, 0.12, 0.06); },
  land() { noise(0.12, 0.25, 600, 120, 0.8, 0, 'lowpass'); },
  pullStart() { tone('sine', 300, 900, 0.18, 0.08); humOn(); },
  pullEnd() { humOff(); tone('sine', 700, 260, 0.12, 0.05); },
  pullMiss() { tone('square', 200, 150, 0.1, 0.04); },
  push() { noise(0.35, 0.35, 3000, 200, 0.7); tone('sine', 140, 50, 0.3, 0.3); },
  launch() { tone('triangle', 200, 900, 0.35, 0.18); tone('square', 400, 1200, 0.2, 0.04, 0.05); },
  rocket() { noise(0.5, 0.3, 400, 3000, 0.6); tone('sawtooth', 90, 300, 0.4, 0.08); },
  hang() { tone('triangle', 880, 1320, 0.08, 0.07); tone('triangle', 1320, 1320, 0.1, 0.05, 0.07); },
  zap() { tone('sawtooth', 900, 60, 0.35, 0.14); noise(0.25, 0.2, 6000, 2000, 2); },
  fall() { tone('sine', 700, 120, 0.6, 0.12); },
  respawn() { tone('sine', 520, 520, 0.08, 0.08); tone('sine', 780, 780, 0.1, 0.08, 0.08); tone('sine', 1040, 1040, 0.14, 0.07, 0.16); },
  cog() { [880, 1175, 1568, 2093].forEach((f, i) => tone('triangle', f, f, 0.18, 0.08, i * 0.07)); },
  boing() { tone('sine', 180, 720, 0.25, 0.14); tone('triangle', 360, 1100, 0.18, 0.05, 0.03); },
  toggle(on) { tone('square', on ? 660 : 440, on ? 990 : 330, 0.06, 0.07); tone('triangle', on ? 1320 : 660, on ? 1320 : 520, 0.12, 0.05, 0.05); },
  plate(on) { tone('square', on ? 500 : 300, on ? 700 : 220, 0.08, 0.06); noise(0.05, 0.15, 1500, 800, 3); },
  gate(open) { noise(0.7, 0.18, open ? 200 : 400, open ? 500 : 150, 1.2, 0, 'lowpass'); tone('sawtooth', 60, open ? 45 : 70, 0.6, 0.06); },
  bridge(on) { tone('sine', on ? 660 : 990, on ? 990 : 660, 0.2, 0.08); },
  checkpoint() { [523, 659, 784].forEach((f, i) => tone('triangle', f, f, 0.18, 0.08, i * 0.07)); },
  crate() { noise(0.1, 0.25, 900, 200, 1); tone('square', 120, 80, 0.1, 0.06); },
  complete() { [523, 659, 784, 1046, 784, 1046].forEach((f, i) => tone('triangle', f, f, 0.25, 0.1, i * 0.11)); },
  tick() { tone('square', 1300 + Math.random() * 300, 1200, 0.025, 0.015); },
  menu() { tone('triangle', 660, 660, 0.06, 0.06); },
  select() { tone('triangle', 660, 990, 0.12, 0.08); },
  join(who) { [who ? 392 : 330, who ? 587 : 494, who ? 784 : 659].forEach((f, i) => tone('triangle', f, f, 0.14, 0.09, i * 0.06)); },
  stopAll() { humOff(); },
};

// ---- music: soft pentatonic arpeggio + bass, slowly mutating
const music = {
  on: false, step: 0, next: 0, timer: null, mood: 0,
  scale: [0, 2, 4, 7, 9, 12, 14, 16, 19, 21],
  start() {
    if (this.on || !ctx) return;
    this.on = true; this.next = ctx.currentTime + 0.1;
    this.pattern = this.newPattern();
    this.timer = setInterval(() => this.schedule(), 50);
  },
  newPattern() { const p = []; for (let i = 0; i < 16; i++) p.push(Math.random() < 0.72 ? Math.floor(Math.random() * this.scale.length) : -1); return p; },
  schedule() {
    if (!ctx) return;
    const spb = 60 / 96 / 2; // eighth notes
    while (this.next < ctx.currentTime + 0.25) {
      const s = this.step % 16, bar = Math.floor(this.step / 16);
      const roots = [0, -3, 5, -5][bar % 4] + (this.mood ? -2 : 0);
      const base = 220 * Math.pow(2, roots / 12);
      const n = this.pattern[s];
      const w = this.next - ctx.currentTime;
      if (n >= 0) tone('triangle', base * Math.pow(2, this.scale[n] / 12), base * Math.pow(2, this.scale[n] / 12), 0.22, 0.05, w, musBus);
      if (s % 4 === 0) tone('sine', base / 2, base / 2, 0.5, 0.11, w, musBus);
      if (s % 8 === 4) { const t = this.next; const src = ctx.createBufferSource(); src.buffer = noiseBuf; const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 7000; const g = ctx.createGain(); g.gain.setValueAtTime(0.03, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05); src.connect(f); f.connect(g); g.connect(musBus); src.start(t); src.stop(t + 0.06); }
      this.step++; this.next += spb;
      if (this.step % 64 === 0 && Math.random() < 0.6) this.pattern = this.newPattern();
    }
  },
};
export function setMood(m) { music.mood = m; }
