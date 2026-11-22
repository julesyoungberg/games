const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  p.on('pageerror', e => console.log('PAGEERROR', e.message));
  await p.goto('file://' + process.cwd() + '/dist/index.html');
  await p.evaluate(() => localStorage.setItem('bn-save', JSON.stringify({ unlocked: 4, done: [0, 1, 2, 3, 17], cogs: [1, 3] })));
  await p.reload(); await p.waitForTimeout(1500);
  console.log(await p.evaluate(() => localStorage.getItem('bn-save')));
  await p.reload(); await p.waitForTimeout(1500);
  console.log(await p.evaluate(() => localStorage.getItem('bn-save')));
  console.log(await p.evaluate(() => document.querySelector('#menu').innerText.slice(0, 80)));
  await b.close();
})();
