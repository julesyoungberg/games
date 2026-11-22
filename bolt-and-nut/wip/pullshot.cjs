const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  await p.goto('file://' + process.cwd() + '/dist/index.html'); await p.waitForTimeout(1500);
  await p.evaluate(() => { __bn.view.setQuality('high'); __bn.view.quality = 'fixed'; __bn.start(1); });
  await p.waitForTimeout(3000);
  await p.evaluate(() => { const [B, N] = __bn.world.players; N.pos.x = B.pos.x + 5; N.pos.z = B.pos.z; N.pos.y = B.pos.y + 1.5; B.face = { x: 1, z: 0 }; });
  await p.waitForTimeout(300);
  await p.keyboard.down('KeyE'); await p.waitForTimeout(250);
  await p.screenshot({ path: 'shots/pull.png' });
  await p.keyboard.up('KeyE');
  await b.close();
})();
