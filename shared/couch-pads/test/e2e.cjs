// End-to-end check for phone controllers, with a local PeerJS server instead of the public one.
// Needs: npm install here, Playwright (require('playwright')), and Bolt & Nut built (cd bolt-and-nut && node build.mjs).
const { chromium } = require('playwright');
const { PeerServer } = require('peer');
const http = require('http'), fs = require('fs'), path = require('path');
const repo = path.resolve(__dirname, '../../..');
const sleep = ms => new Promise(r => setTimeout(r, ms));
// /bolt/ -> bolt-and-nut/dist, /wick/ -> wick-and-shade/game, /pad/ -> shared/couch-pads/pad, couch-pads.js served beside each page
const MOUNT = { bolt: 'bolt-and-nut/dist', wick: 'wick-and-shade/game', pad: 'shared/couch-pads/pad' };
function serve(req, res) {
  const [, top, ...rest] = decodeURIComponent(req.url.split(/[?#]/)[0]).split('/');
  let f = rest.join('/') || 'index.html';
  f = f === 'couch-pads.js' ? path.join(repo, 'shared/couch-pads/couch-pads.js') : MOUNT[top] && path.join(repo, MOUNT[top], f);
  fs.readFile(f || '', (e, d) => { if (e) { res.writeHead(404); return res.end(); } res.writeHead(200, { 'content-type': f.endsWith('.js') ? 'text/javascript' : 'text/html' }); res.end(d); });
}
const Q = 'signal=' + encodeURIComponent('ws://127.0.0.1:9123/peerjs') + '&padsite=' + encodeURIComponent('http://127.0.0.1:9124');
let failed = 0;
const check = (ok, msg) => { console.log((ok ? 'ok   ' : 'FAIL ') + msg); if (!ok) failed++; };

async function phone(b, room, relay) {
  const ctx = await b.newContext({ viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true });
  const p = await ctx.newPage();
  p.on('pageerror', e => check(false, 'phone page error: ' + e.message));
  await p.goto(`http://127.0.0.1:9124/pad/?${Q}${relay ? '&padrelay=1' : ''}#${room}`);
  await p.waitForFunction(() => window.__pad.helloAt > 0, null, { timeout: 15000 });
  p.tap = async (id, ms = 120) => { const r = await p.locator('#' + id).boundingBox(); await p.mouse.move(r.x + r.width / 2, r.y + r.height / 2); await p.mouse.down(); await sleep(ms); await p.mouse.up(); await sleep(200); };
  return p;
}
async function host(b, game, init) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } });
  if (init) await ctx.addInitScript(init);
  const h = await ctx.newPage();
  h.on('pageerror', e => check(false, game + ' page error: ' + e.message));
  await h.goto(`http://127.0.0.1:9124/${game}/index.html?${Q}`);
  await sleep(1200);
  return h;
}

(async () => {
  const peer = PeerServer({ port: 9123, host: '127.0.0.1', path: '/' });
  const web = http.createServer(serve).listen(9124, '127.0.0.1');
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });

  // Bolt & Nut: two phones (one direct, one through the relay) join and play
  {
    const h = await host(b, 'bolt');
    await h.keyboard.press('Enter'); await sleep(300);
    check(await h.evaluate(() => __bn.mode) === 'join', 'Bolt: Enter on the title opens the join screen');
    await h.waitForFunction(() => CouchPads.status === 'open', null, { timeout: 8000 });
    const room = await h.evaluate(() => CouchPads.room);
    check(/^[A-Z]{4}$/.test(room), 'Bolt: room code ' + room);
    check(await h.evaluate(() => !!document.querySelector('.ccp-card:not(.ccp-off) svg')), 'Bolt: join panel shows a QR code');
    const p1 = await phone(b, room, false);
    check(await p1.evaluate(() => !!(__pad.link && __pad.link.ok)), 'phone 1 connected directly (WebRTC)');
    await p1.tap('bA');
    const p2 = await phone(b, room, true);
    await p2.tap('bA', 30); // a very short tap still counts
    await sleep(300);
    const names = await h.evaluate(() => __bn.Input.assign.map(d => __bn.Input.name(d)));
    check(names.join() === 'Phone 1,Phone 2', 'Bolt: phones joined as Bolt and Nut: ' + names.join(', '));
    await sleep(400); await p1.tap('bA'); await sleep(600);
    check(await h.evaluate(() => __bn.mode) === 'play', 'Bolt: phone A starts the shift');
    const L = await p1.locator('#left').boundingBox();
    await p1.mouse.move(L.x + 100, L.y + 150); await p1.mouse.down(); await p1.mouse.move(L.x + 180, L.y + 150, { steps: 4 }); await sleep(300);
    check(await h.evaluate(() => __bn.Input.player(0).mx) > 0.9, 'Bolt: phone stick moves Bolt');
    await p1.mouse.up();
    await p2.context().close(); await sleep(3600);
    check(await h.evaluate(() => !__bn.Input.player(1)), 'Bolt: closing phone 2 reads as a disconnected controller');
    await h.context().close(); await p1.context().close();
  }

  // Wick & Shade: a real controller and a phone together; narrator, pause, game reload
  {
    const h = await host(b, 'wick', () => {
      window.__fakeA = false;
      const mk = () => ({ id: 'Xbox Wireless Controller (STANDARD GAMEPAD)', index: 0, connected: true, mapping: 'standard', timestamp: performance.now(), axes: [0, 0, 0, 0],
        buttons: Array.from({ length: 17 }, (_, i) => ({ pressed: i === 0 && window.__fakeA, touched: false, value: i === 0 && window.__fakeA ? 1 : 0 })) });
      Object.defineProperty(navigator, 'getGamepads', { value: () => [mk(), null, null, null], configurable: true, writable: true });
    });
    await h.keyboard.press('Space'); await sleep(400);
    check(await h.evaluate(() => __ws.state) === 'join', 'Wick: join screen');
    await h.waitForFunction(() => CouchPads.status === 'open', null, { timeout: 8000 });
    const room = await h.evaluate(() => CouchPads.room);
    await h.evaluate(() => { __fakeA = true; }); await sleep(150); await h.evaluate(() => { __fakeA = false; }); await sleep(500);
    const p = await phone(b, room, false);
    await p.tap('bA'); await sleep(1600);
    check(await h.evaluate(() => __ws.state) === 'play', 'Wick: controller + phone joined and the chapter started');
    const q0 = await h.evaluate(() => (__ws.narr.cur ? 1 : 0) + __ws.narr.q.length);
    await sleep(1500); await p.tap('bY'); await sleep(300);
    const q1 = await h.evaluate(() => (__ws.narr.cur ? 1 : 0) + __ws.narr.q.length);
    check(q1 === q0 - 1, `Wick: phone Y advances the narrator (${q0} -> ${q1} lines left)`);
    await p.tap('bStart'); await sleep(300);
    check(await h.evaluate(() => __ws.state) === 'pause', 'Wick: phone Pause pauses');
    await h.reload(); await sleep(1500);
    check(await h.evaluate(() => CouchPads.room) === room, 'Wick: room code survives a reload');
    await h.keyboard.press('Space');
    await h.waitForFunction(() => CouchPads.phones().some(x => x.live), null, { timeout: 20000 }).catch(() => { });
    check(await h.evaluate(() => CouchPads.phones().some(x => x.live)), 'Wick: phone reconnects by itself after the game reloads');
  }
  await b.close(); peer.close && peer.close(); web.close();
  console.log(failed ? `${failed} check(s) failed` : 'all phone-controller checks passed');
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
