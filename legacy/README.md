# Legacy addresses

`wick-and-shade.vercel.app/` holds what the old `wick-and-shade` Vercel project serves (deployed by hand with the Vercel
API, not from git). The old address forwards to couch-coop-games.vercel.app, and its page carries the browser save along
as `#ws-import=...`. `wick-and-shade/site/import-save.js` merges that save on the new site.
Bolt & Nut's old addresses are host redirects in `scripts/build-site.mjs` (game.json `legacyHosts`).
