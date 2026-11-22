// Builds the whole games site (Vercel runs this on every push; see vercel.json).
//
// Every top-level folder with a game.json is a game. For each one this runs `npm ci` and the
// game's own scripts/vercel-build.sh (which writes <game>/public/), copies that to /<game>/,
// then writes the games index page and the routing config. Output uses Vercel's Build Output
// API (.vercel/output) so routes such as /<game>/dl are generated per game.
//
//   node scripts/build-site.mjs            build every game
//   node scripts/build-site.mjs --no-games skip game builds, reuse existing <game>/public/ (fast, for index tweaks)
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const skipGames = process.argv.includes('--no-games');
// Canonical address. Old per-game hosts (game.json legacyHosts) redirect here, so it must be absolute.
const SITE = (process.env.GAMES_SITE_URL || 'https://couch-coop-games.vercel.app').replace(/\/$/, '');
const out = path.join(root, '.vercel/output');
const stat = path.join(out, 'static');
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const reEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const games = fs.readdirSync(root, { withFileTypes: true })
  .filter(d => d.isDirectory() && fs.existsSync(path.join(root, d.name, 'game.json')))
  .map(d => {
    const dir = path.join(root, d.name);
    const meta = JSON.parse(fs.readFileSync(path.join(dir, 'game.json'), 'utf8'));
    const version = JSON.parse(fs.readFileSync(path.join(dir, meta.versionFrom || 'package.json'), 'utf8')).version;
    return { slug: d.name, dir, version, ...meta };
  })
  .sort((a, b) => (a.order ?? 99) - (b.order ?? 99) || a.slug.localeCompare(b.slug));
if (!games.length) throw new Error('no game folders (with game.json) found');

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(stat, { recursive: true });

for (const g of games) {
  if (!skipGames) {
    console.log(`\n=== ${g.title} ${g.version} ===`);
    execSync('npm ci --no-audit --no-fund && bash scripts/vercel-build.sh', { cwd: g.dir, stdio: 'inherit' });
  }
  const pub = path.join(g.dir, 'public');
  if (!fs.existsSync(path.join(pub, 'index.html'))) throw new Error(`${g.slug}: public/index.html missing`);
  if (g.appImage && !fs.existsSync(path.join(pub, g.appImage))) throw new Error(`${g.slug}: public/${g.appImage} missing`);
  fs.cpSync(pub, path.join(stat, g.slug), { recursive: true });
}

// Phone controller page (/pad/), shared by every game: see shared/couch-pads/
fs.cpSync(path.join(root, 'shared/couch-pads/pad'), path.join(stat, 'pad'), { recursive: true });
fs.copyFileSync(path.join(root, 'shared/couch-pads/couch-pads.js'), path.join(stat, 'pad/couch-pads.js'));

// Games index page
const cards = games.map(g => `
    <article class="game" style="--accent:${esc(g.accent || '#ffd27a')};--bg:${esc(g.background || '#1b1730')}">
      <a class="art" href="/${g.slug}/"><img src="/${g.slug}/icon.png" alt="" width="96" height="96"></a>
      <div class="body">
        <h2><a href="/${g.slug}/">${esc(g.title)}</a></h2>
        <p class="meta">${esc(g.style || 'Couch co-op')} &middot; version ${esc(g.version)}</p>
        <p class="tag">${esc(g.tagline || '')}</p>
        <div class="btns">
          <a class="btn play" href="/${g.slug}/play/">Play in browser</a>
          ${g.appImage ? `<a class="btn dl" href="/${g.slug}/${esc(g.appImage)}" download="${esc(g.appImage)}">Steam Deck download</a>` : ''}
          <a class="btn more" href="/${g.slug}/">Install guide</a>
        </div>
      </div>
    </article>`).join('');
const tpl = fs.readFileSync(path.join(root, 'site/index.html'), 'utf8');
fs.writeFileSync(path.join(stat, 'index.html'), tpl.replace('<!--GAMES-->', cards));

// Routes
const routes = [];
for (const g of games) for (const host of g.legacyHosts || [])
  routes.push({ src: '^/(.*)$', has: [{ type: 'host', value: host }], status: 308, headers: { Location: `${SITE}/${g.slug}/$1` } });
for (const g of games) {
  const s = reEsc(g.slug);
  routes.push({ src: `^/${s}$`, status: 308, headers: { Location: `/${g.slug}/` } });
  routes.push({ src: `^/${s}/play$`, status: 308, headers: { Location: `/${g.slug}/play/` } });
  routes.push({ src: `^/${s}/play/.*$`, headers: { 'Cache-Control': 'no-cache' }, continue: true });
  if (g.appImage) {
    const base = g.appImage.replace(/\.AppImage$/, '');
    routes.push({ src: `^/${s}/dl/?$`, status: 307, headers: { Location: `/${g.slug}/${g.appImage}` } });
    routes.push({ src: `^/${s}/${reEsc(base)}-[^/]+\\.AppImage$`, status: 307, headers: { Location: `/${g.slug}/${g.appImage}` } });
    routes.push({ src: `^/${s}/${reEsc(g.appImage)}$`, continue: true, headers: {
      'Content-Disposition': `attachment; filename=${g.appImage}`,
      'Content-Type': 'application/octet-stream',
      'Cache-Control': 'no-cache',
    } });
  }
}
routes.push({ src: '^/pad$', status: 308, headers: { Location: '/pad/' } });
routes.push({ src: '^/pad/.*$', headers: { 'Cache-Control': 'no-cache' }, continue: true });
routes.push({ handle: 'filesystem' });
fs.writeFileSync(path.join(out, 'config.json'), JSON.stringify({ version: 3, routes }, null, 2));
console.log(`\nSite ready: ${games.map(g => `${g.slug} ${g.version}`).join(', ')}`);
