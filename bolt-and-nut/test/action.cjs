const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  const errs = []; p.on('pageerror', e => errs.push('PAGEERROR ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('file://' + process.cwd() + '/dist/index.html'); await p.waitForTimeout(800);
  const I = (o = {}) => Object.assign({ mx: 0, mz: 0, jump: false, jumpP: false, power: false, powerP: false }, o);
  // level 2: pull crate across gap
  await p.evaluate(() => { __bn.start(1); __bn.narr.clear(); const w = __bn.world; w.players[0].pos.x = 11.4; w.players[0].pos.z = -6.4; w.players[1].pos.x = 9; w.players[1].pos.z = -3; });
  await p.evaluate(() => __bn.force([{ mx: 1, mz: 0 }, {}]));
  await p.waitForTimeout(100);
  await p.evaluate(() => __bn.force([{ mx: 0, mz: 0, power: true, powerP: true }, {}]));
  await p.waitForTimeout(40);
  await p.evaluate(() => __bn.force([{ mx: 0, mz: 0, power: true, powerP: false }, {}]));
  await p.waitForTimeout(450);
  await p.screenshot({ path: 'shots/a_pull.png' });
  // level 3: launch
  await p.evaluate(() => { __bn.start(2); __bn.narr.clear(); const w = __bn.world; w.players[0].pos.x = 11; w.players[0].pos.z = -4; w.players[1].pos.x = 10; w.players[1].pos.z = -4; __bn.force([{}, {}]); });
  await p.waitForTimeout(1200);
  await p.evaluate(() => __bn.force([{}, { power: true, powerP: true }])); await p.waitForTimeout(30);
  await p.evaluate(() => __bn.force([{ mx: 1 }, {}])); await p.waitForTimeout(280);
  await p.screenshot({ path: 'shots/a_launch.png' });
  // level 6 lasers
  await p.evaluate(() => { __bn.start(5); __bn.narr.clear(); const w = __bn.world; w.players[0].pos.x = 7; w.players[1].pos.x = 6; __bn.force([{}, {}]); });
  await p.waitForTimeout(1500); await p.screenshot({ path: 'shots/a_laser.png' });
  // level 7 fans
  await p.evaluate(() => { __bn.start(6); __bn.narr.clear(); const w = __bn.world; w.players[0].pos.x = 11.5; w.players[0].pos.z = -3.5; w.players[1].pos.x = 9; __bn.force([{}, {}]); });
  await p.waitForTimeout(1500); await p.screenshot({ path: 'shots/a_fan.png' });
  // level 4 anchors
  await p.evaluate(() => { __bn.start(3); __bn.narr.clear(); const w = __bn.world; w.players[0].pos = { x: 23.5, y: 3.6, z: -4 }; w.players[1].pos = { x: 20, y: 3.5, z: -6 }; __bn.force([{ mx: 1 }, {}]); });
  await p.waitForTimeout(200);
  await p.evaluate(() => __bn.force([{ power: true, powerP: true }, {}])); await p.waitForTimeout(30);
  await p.evaluate(() => __bn.force([{ power: true }, {}])); await p.waitForTimeout(700);
  await p.screenshot({ path: 'shots/a_anchor.png' });
  console.log(errs.join('\n') || 'no errors');
  await b.close();
})();
