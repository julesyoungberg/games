const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// ---- graphics mode -------------------------------------------------------
// "Safe" (default) draws the 3D scene in software (SwiftShader). It is the mode that avoided the black
// window seen on the Steam Deck. "Graphics card" mode is faster; it can be picked in Options, or forced
// with --gpu / --software on the command line (Steam: Properties > Launch Options).
const settingsFile = path.join(app.getPath('userData'), 'graphics.json');
let settings = { gpu: false, pending: false };
try { settings = Object.assign(settings, JSON.parse(fs.readFileSync(settingsFile, 'utf8'))); } catch (e) { }
const saveSettings = () => { try { fs.mkdirSync(path.dirname(settingsFile), { recursive: true }); fs.writeFileSync(settingsFile, JSON.stringify(settings)); } catch (e) { } };
if (process.argv.includes('--gpu')) { settings.gpu = true; settings.pending = false; }
if (process.argv.includes('--software')) { settings.gpu = false; settings.pending = false; }
const useGpu = settings.gpu;

app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
app.commandLine.appendSwitch('no-sandbox');
app.commandLine.appendSwitch('disable-background-timer-throttling');
app.commandLine.appendSwitch('enable-unsafe-swiftshader'); // keep software WebGL available as a fallback
if (!useGpu) {
  app.commandLine.appendSwitch('use-gl', 'angle');
  app.commandLine.appendSwitch('use-angle', 'swiftshader');
  app.commandLine.appendSwitch('disable-gpu-compositing');
} else {
  app.commandLine.appendSwitch('ignore-gpu-blocklist');
}
Menu.setApplicationMenu(null);

const GAME = path.join(__dirname, 'game', 'index.html');
function errorPage(msg) {
  return 'data:text/html;charset=utf-8,' + encodeURIComponent(`<body style="background:#2b2338;color:#fff8ee;font:22px sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;text-align:center"><div><h1>Bolt &amp; Nut could not start</h1><p>${msg}</p><p>Press Alt+F4 or the Steam button → Exit game.</p></div></body>`);
}
function relaunchWith(gpu) {
  settings.gpu = gpu; settings.pending = gpu; saveSettings();
  const args = process.argv.slice(1).filter(a => a !== '--gpu' && a !== '--software');
  app.relaunch({ args }); app.exit(0);
}

let win, revertTimer = null;
function create() {
  win = new BrowserWindow({
    width: 1280, height: 800, fullscreen: true, show: false, autoHideMenuBar: true, backgroundColor: '#f6d9b8', title: 'Bolt and Nut',
    webPreferences: { backgroundThrottling: false, contextIsolation: true, nodeIntegration: false, preload: path.join(__dirname, 'preload.js'), additionalArguments: [`--bn-gpu=${useGpu ? 1 : 0}`, `--bn-pending=${settings.pending ? 1 : 0}`] },
  });
  const reveal = () => { if (!win.isDestroyed() && !win.isVisible()) { win.show(); win.setFullScreen(true); win.focus(); } };
  win.once('ready-to-show', reveal);
  setTimeout(reveal, 4000);
  win.webContents.on('did-fail-load', (e, code, desc) => win.loadURL(errorPage(`The game files are missing from this build (${desc}).`)));
  if (fs.existsSync(GAME)) win.loadFile(GAME); else win.loadURL(errorPage('The game files are missing from this build (game/index.html).'));
  win.webContents.on('before-input-event', (e, input) => { if (input.type === 'keyDown' && input.key === 'F11') win.setFullScreen(!win.isFullScreen()); });
  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  // Just switched to graphics-card mode: if the player does not confirm within 15 s (black screen?), go back.
  if (useGpu && settings.pending) revertTimer = setTimeout(() => relaunchWith(false), 15000);
  win.webContents.on('render-process-gone', () => { if (useGpu) relaunchWith(false); });
}
ipcMain.on('bn-set-gpu', (e, on) => relaunchWith(!!on));
ipcMain.on('bn-confirm-gpu', () => { clearTimeout(revertTimer); settings.pending = false; saveSettings(); });
ipcMain.on('bn-webgl-failed', () => { if (useGpu) relaunchWith(false); });
ipcMain.on('bn-quit', () => app.quit());
app.on('child-process-gone', (e, d) => { if (d.type === 'GPU' && useGpu && settings.pending) relaunchWith(false); });
app.whenReady().then(create);
app.on('window-all-closed', () => app.quit());

// Automated check used when building: BN_TEST_SHOT=/path.png captures the window after a few seconds and quits.
if (process.env.BN_TEST_SHOT) {
  app.whenReady().then(() => setTimeout(async () => {
    try {
      const info = await win.webContents.executeJavaScript(`(async () => { const v = window.__bn && window.__bn.view; if (window.__bn) window.__bn.start(${+(process.env.BN_TEST_LEVEL || 0)}); await new Promise(r => setTimeout(r, 2500)); const ts = []; await new Promise(res => { let l = performance.now(); const f = n => { ts.push(n - l); l = n; ts.length < 120 ? requestAnimationFrame(f) : res(); }; requestAnimationFrame(f); }); ts.splice(0, 20); return JSON.stringify({ renderer: v && v.rendererName, software: v && v.software, scale: v && v.scale, avgMs: ts.reduce((a, b) => a + b, 0) / ts.length, nogl: getComputedStyle(document.getElementById('nogl')).display }); })()`);
      console.log('BN_TEST', info);
      const img = await win.webContents.capturePage();
      fs.writeFileSync(process.env.BN_TEST_SHOT, img.toPNG());
    } catch (e) { console.log('BN_TEST error', e.message); }
    app.exit(0);
  }, 3000));
}
