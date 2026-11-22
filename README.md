# Games

Original couch co-op games for two players on one Steam Deck (two Bluetooth controllers), plus a browser
version of each. One folder per game, all published together as one site:

**https://couch-coop-games.vercel.app**

| Game | Folder | Page |
|---|---|---|
| Wick & Shade (2D) | [`wick-and-shade/`](wick-and-shade) | https://couch-coop-games.vercel.app/wick-and-shade/ |
| Bolt & Nut (3D, three.js) | [`bolt-and-nut/`](bolt-and-nut) | https://couch-coop-games.vercel.app/bolt-and-nut/ |

Every game gets the same routes:

- `/<game>/` landing page with the Steam Deck install steps
- `/<game>/play/` the browser version
- `/<game>/dl` the Steam Deck AppImage (always the latest build, saved under a fixed name such as
  `WickAndShade.AppImage` so the Steam shortcut survives updates; old versioned links redirect to it)

The old addresses (`wick-and-shade.vercel.app`, `bolt-and-nut-game.vercel.app`, `bolt-and-nut.vercel.app`) redirect
to the matching path here, so `wick-and-shade.vercel.app/dl` still downloads the game.

## Playing without controllers

- **One keyboard, two players:** both games split the keyboard (WASD + Space vs. arrows), shown on the join screen.
- **Phones as controllers:** the join screen shows a QR code and room code. Each player opens
  https://couch-coop-games.vercel.app/pad on their phone and gets an on-screen gamepad. Phones, controllers and
  keyboards can be mixed. Shared code: [`shared/couch-pads/`](shared/couch-pads) (see its README).

## How a new version ships

1. Change the game inside its folder and bump its version (the file named by `versionFrom` in its `game.json`:
   Wick & Shade `wick-and-shade/package.json`, Bolt & Nut `bolt-and-nut/app/package.json`).
2. Run the game's checks (Bolt & Nut: `npm ci && node build.mjs && node test/all.mjs`; Wick & Shade: the bot playthroughs).
3. Push to `main`. Vercel (project `couch-games`) runs `scripts/build-site.mjs`, which builds every game's AppImage
   and site from source and publishes the lot in a few minutes. Other branches get preview deployments.

AppImages are never committed. To build the whole site locally: `node scripts/build-site.mjs`
(output in `.vercel/output/static`). To build one game: `npm ci && bash scripts/vercel-build.sh` inside its folder.

## Adding a game

Make a new top-level folder containing:

- `game.json`: `title`, `tagline`, `style`, `appImage` (file name, or omit for browser-only), `versionFrom`, `accent`,
  `background`, optional `order`
- `scripts/vercel-build.sh`: writes `public/` with `index.html`, `icon.png`, `play/index.html` and the AppImage.
  Use relative links in `index.html` (`play/`, `icon.png`), because the page is served under `/<game>/`.

Push it and it appears on the home page. No Vercel setup needed.

## Vercel notes

- Project `couch-games` in the `jules-youngbergs-projects` team, connected to this repo, root directory = repo root.
- `scripts/build-site.mjs` writes Vercel's Build Output API format (`.vercel/output/config.json`) so per-game routes
  are generated from `game.json`.
- The old `wick-and-shade` Vercel project only holds a redirect to this site.
