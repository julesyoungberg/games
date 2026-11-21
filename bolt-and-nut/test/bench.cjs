const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  await p.goto('file://' + process.cwd() + '/dist/index.html'); await p.waitForTimeout(800);
  for (const l of [0, 3, 5, 7]) {
    const r = await p.evaluate(async l => {
      __bn.start(l); await new Promise(r => setTimeout(r, 1000));
      const v = __bn.view, gl = v.renderer.getContext(), out = {}, px = new Uint8Array(4);
      for (const sc of [1, 0.75, 0.6, 0.45]) {
        v.scale = sc; v.resize();
        for (let i = 0; i < 5; i++) { v.draw(__bn.world, 1 / 60, { showTarget: true }); gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px); }
        const t0 = performance.now(); for (let i = 0; i < 30; i++) { v.draw(__bn.world, 1 / 60, { showTarget: true }); gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px); }
        out[sc] = ((performance.now() - t0) / 30).toFixed(1);
      }
      const info = v.renderer.info.render; out.calls = info.calls; out.tris = info.triangles;
      return out;
    }, l);
    console.log('level', l, JSON.stringify(r));
  }
  await b.close();
})();
