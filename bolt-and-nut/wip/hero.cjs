const { chromium } = require('playwright'); const fs = require('fs');
(async () => {
  const [lvl, dx, out] = [Number(process.argv[2] || 14), Number(process.argv[3] || 14), process.argv[4] || 'site/shot.jpg'];
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  await p.goto('file://' + process.cwd() + '/dist/index.html'); await p.waitForTimeout(800);
  await p.evaluate(() => { __bn.view.setQuality('high'); __bn.view.quality = 'fixed'; });
  await p.evaluate(l => __bn.start(l), lvl); await p.waitForTimeout(1500);
  await p.evaluate(dx => { const w = __bn.world; w.players[0].pos.x += dx; w.players[1].pos.x += dx; for (const q of w.players) q.pos.y += 2; }, dx);
  await p.waitForTimeout(3000);
  const d = await p.evaluate(() => { const v = __bn.view; for (let k = 0; k < 2; k++) v.draw(__bn.world, 1 / 60, { zoom: 1.15 }); return v.renderer.domElement.toDataURL('image/jpeg', 0.85); });
  fs.writeFileSync(out, Buffer.from(d.split(',')[1], 'base64'));
  await b.close();
})();
