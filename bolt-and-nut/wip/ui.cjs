const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  p.on('pageerror', e => console.log('PAGEERROR', e.message));
  await p.goto('file://' + process.cwd() + '/dist/index.html');
  await p.evaluate(() => localStorage.setItem('bn-save', JSON.stringify({ unlocked: 4, done: [0, 1, 2, 3], cogs: [1, 3] })));
  await p.reload();
  await p.waitForTimeout(800);
  await p.evaluate(() => { __bn.view.setQuality('high'); __bn.view.quality = 'fixed'; });
  await p.waitForTimeout(3000);
  await p.screenshot({ path: 'shots/ui-title.png' });
  await p.keyboard.press('ArrowDown'); await p.waitForTimeout(400);
  await p.keyboard.press('Enter'); await p.waitForTimeout(600);
  for (let i = 0; i < 3; i++) { await p.keyboard.press('ArrowDown'); await p.waitForTimeout(200); }
  await p.waitForTimeout(800);
  await p.screenshot({ path: 'shots/ui-menu.png' });
  
  await b.close();
})();
