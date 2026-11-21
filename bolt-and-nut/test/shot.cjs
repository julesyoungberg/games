const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  const errs = [];
  p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.type() + ': ' + m.text()); });
  p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  await p.goto('file://' + process.cwd() + '/dist/index.html');
  await p.waitForTimeout(2500);
  await p.screenshot({ path: 'shots/title.png' });
  const info = await p.evaluate(() => ({ r: __bn.view.rendererName, sw: __bn.view.software, scale: __bn.view.scale }));
  console.log(info);
  const levels = (process.argv[2] || '0').split(',').map(Number);
  for (const l of levels) {
    await p.evaluate(l => __bn.start(l), l);
    await p.waitForTimeout(2500);
    // measure frame time
    const ft = await p.evaluate(() => new Promise(res => { const ts = []; let last = performance.now(); function f(n) { ts.push(n - last); last = n; if (ts.length < 90) requestAnimationFrame(f); else res(ts.slice(10)); } requestAnimationFrame(f); }));
    const avg = ft.reduce((a, b) => a + b, 0) / ft.length;
    console.log('level', l, 'avg frame ms', avg.toFixed(1), 'scale', await p.evaluate(() => __bn.view.scale));
    await p.screenshot({ path: `shots/l${l}.png` });
  }
  console.log(errs.slice(0, 20).join('\n'));
  await b.close();
})();
