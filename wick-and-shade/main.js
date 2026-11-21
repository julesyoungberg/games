const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
// Sound should start without a click, and the game only loads its own local file.
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
app.commandLine.appendSwitch('no-sandbox');
app.commandLine.appendSwitch('disable-background-timer-throttling');
// The game is a 2D canvas, so software rendering is plenty fast and avoids black screens from
// GPU/driver/compositor problems (seen on a Steam Deck in Desktop Mode). Launch with --gpu to use the GPU.
const useGpu = process.argv.includes('--gpu');
if (!useGpu) { app.disableHardwareAcceleration(); app.commandLine.appendSwitch('disable-gpu'); app.commandLine.appendSwitch('disable-gpu-compositing'); }
Menu.setApplicationMenu(null);

const GAME = path.join(__dirname, 'game', 'index.html');
function errorPage(msg) {
  return 'data:text/html;charset=utf-8,' + encodeURIComponent(`<body style="background:#120e26;color:#f4ead8;font:22px Georgia;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;text-align:center"><div><h1>Wick &amp; Shade could not start</h1><p>${msg}</p><p>Press Alt+F4 or the Steam button → Exit game.</p></div></body>`);
}
function create() {
  const win = new BrowserWindow({
    width: 1280, height: 800, fullscreen: true, show: false, autoHideMenuBar: true, backgroundColor: '#120e26',
    title: 'Wick and Shade',
    webPreferences: { backgroundThrottling: false, contextIsolation: true, nodeIntegration: false },
  });
  const reveal = () => { if (!win.isDestroyed() && !win.isVisible()) { win.show(); win.setFullScreen(true); win.focus(); } };
  win.once('ready-to-show', reveal);
  setTimeout(reveal, 4000);
  win.webContents.on('did-fail-load', (e, code, desc) => win.loadURL(errorPage(`The game files are missing from this build (${desc}).`)));
  if (fs.existsSync(GAME)) win.loadFile(GAME);
  else win.loadURL(errorPage('The game files are missing from this build (game/index.html).'));
  win.webContents.on('before-input-event', (e, input) => {
    if (input.type === 'keyDown' && input.key === 'F11') win.setFullScreen(!win.isFullScreen());
  });
  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
}
app.whenReady().then(create);
app.on('window-all-closed', () => app.quit());
