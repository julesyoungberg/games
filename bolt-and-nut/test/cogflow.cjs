// Browser check: picking up a golden cog saves it, finishing a shift opens the complete menu.
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  const errs = []; p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  await p.goto('file://' + process.cwd() + '/dist/index.html'); await p.waitForTimeout(1000);
  await p.evaluate(() => __bn.start(0)); await p.waitForTimeout(500);
  await p.evaluate(() => { const w = __bn.world, c = w.cogs[0]; Object.assign(w.players[0].pos, { x: c.x, y: c.y, z: c.z }); });
  await p.waitForTimeout(600);
  console.log('saved cogs', await p.evaluate(() => JSON.stringify(JSON.parse(localStorage.getItem('bn-save') || '{}').cogs)));
  await p.evaluate(() => { const w = __bn.world, e = w.exit; for (const pl of w.players) Object.assign(pl.pos, { x: (e.min.x + e.max.x) / 2, y: e.top + 1, z: (e.min.z + e.max.z) / 2 + (pl.id ? -1 : 1) }); });
  await p.waitForTimeout(3500);
  console.log('mode', await p.evaluate(() => __bn.mode), 'menu', await p.evaluate(() => document.getElementById('menu').textContent.slice(0, 80)));
  await p.screenshot({ path: 'shots/complete.png' });
  console.log(errs.join('\n') || 'no errors');
  await b.close();
})();
