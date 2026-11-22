const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  const errs = [];
  p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.type() + ': ' + m.text()); });
  p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  await p.goto('file://' + process.cwd() + '/dist/index.html');
  await p.waitForTimeout(1500);
  const q = process.argv[3] || 'high';
  await p.evaluate(q => { __bn.view.setQuality(q); __bn.view.quality = 'fixed'; }, q);
  for (const l of (process.argv[2] || '0').split(',').map(Number)) {
    await p.evaluate(l => __bn.start(l), l);
    await p.waitForTimeout(3500); if (process.argv[4]) await p.evaluate(m => { const w = __bn.world; if (m === 'exit') { const e = w.exit; w.players.forEach((q, i) => { q.pos.x = e.min.x - 4; q.pos.z = -3 - i * 1.5; q.pos.y = e.top + 1; }); return; } w.players[0].pos.x += 14; w.players[1].pos.x += 14; for (const q of w.players) q.pos.y += 2; }, process.argv[4]), await p.waitForTimeout(2500);
    await p.screenshot({ path: `shots/fx${l}${q}.png` });
  }
  console.log(errs.slice(0, 10).join('\n'));
  await b.close();
})();
