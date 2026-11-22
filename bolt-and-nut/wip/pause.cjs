const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + process.cwd() + '/dist/index.html'); await p.waitForTimeout(1000);
  const tap = async k => { await p.keyboard.down(k); await p.waitForTimeout(80); await p.keyboard.up(k); await p.waitForTimeout(120); };
  await tap('Space'); await tap('Space'); await tap('Slash'); await p.waitForTimeout(800); await tap('Space'); await p.waitForTimeout(1500); console.log(await p.evaluate(() => __bn.mode));
  await tap('Escape'); await p.waitForTimeout(500);
  await p.screenshot({ path: 'shots/pause.png' }); console.log(await p.evaluate(() => { const q = s => getComputedStyle(document.querySelector(s)); return [q('#menu .keys p').fontSize, q('#menu .card p').fontFamily, q('#menu .box').transform, q('#menu .keys').fontSize, q('#menu .keys').width, document.querySelector('#menu .keys').parentElement.className]; }));
  console.log(await p.evaluate(() => __bn.mode), errs.length ? errs : 'no errors');
  await b.close();
})();
