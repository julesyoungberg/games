const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  await p.goto('file://' + process.cwd() + '/dist/index.html');
  await p.waitForTimeout(1200);
  await p.evaluate(() => { __bn.view.setQuality('high'); __bn.view.quality = 'fixed'; });
  await p.waitForTimeout(4000);
  await p.screenshot({ path: 'shots/title-hq.png' });
  await b.close();
})();
