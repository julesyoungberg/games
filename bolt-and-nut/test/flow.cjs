const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  const errs = []; p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  await p.goto('file://' + process.cwd() + '/dist/index.html'); await p.waitForTimeout(1000);
  const tap = async k => { await p.keyboard.down(k); await p.waitForTimeout(80); await p.keyboard.up(k); await p.waitForTimeout(120); };
  await tap('Space'); console.log('after start', await p.evaluate(() => __bn.mode));
  await tap('Space'); await tap('Slash');
  await p.screenshot({ path: 'shots/f_join.png' });
  await tap('Space'); console.log('after join', await p.evaluate(() => __bn.mode));
  await p.waitForTimeout(500);
  // narrator advance with Tab
  const t0 = await p.evaluate(() => document.getElementById('narrTxt').textContent);
  await tap('Tab'); await tap('Tab');
  const t1 = await p.evaluate(() => document.getElementById('narrTxt').textContent);
  console.log('narr changed:', t0.slice(0, 30), '=>', t1.slice(0, 30));
  // walk right with D for 1s, jump
  await p.keyboard.down('KeyD'); await p.waitForTimeout(1000); await tap('Space'); await p.keyboard.up('KeyD');
  console.log('bolt x', await p.evaluate(() => __bn.world.players[0].pos.x.toFixed(2)));
  await tap('Escape'); console.log('paused', await p.evaluate(() => __bn.mode));
  await p.screenshot({ path: 'shots/f_pause.png' });
  await tap('ArrowDown'); await tap('ArrowDown'); await tap('ArrowDown'); await tap('ArrowDown'); await tap('ArrowDown'); await tap('ArrowDown'); await tap('Space');
  await p.screenshot({ path: 'shots/f_opts.png' });
  console.log(errs.join('\n') || 'no errors');
  await b.close();
})();
