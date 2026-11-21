# Games

Original couch co-op games for two players on one Steam Deck (two Bluetooth controllers), plus a browser
version of each. One folder per game; each folder is its own Vercel project.

| Game | Folder | Live site | Vercel project |
|---|---|---|---|
| Wick & Shade (2D, canvas) | [`wick-and-shade/`](wick-and-shade) | https://wick-and-shade.vercel.app | `wick-and-shade` (root directory `wick-and-shade`) |
| Bolt & Nut (3D, three.js) | [`bolt-and-nut/`](bolt-and-nut) | https://bolt-and-nut-game.vercel.app (`bolt-and-nut.vercel.app` was taken) | `bolt-and-nut` (root directory `bolt-and-nut`) |

Every site has the same three routes:

- `/` landing page with install steps
- `/play/` the browser version
- `/dl` the Steam Deck AppImage (always the latest build, saved as `<Game>.AppImage` so the Steam shortcut survives updates;
  old versioned links such as `/WickAndShade-1.0.3.AppImage` redirect to it)

## How a new version ships

1. Change the game inside its folder and bump `version` (Wick & Shade: `wick-and-shade/package.json`;
   Bolt & Nut: `bolt-and-nut/app/package.json`).
2. Run the game's checks (Bolt & Nut: `npm ci && node build.mjs && node test/all.mjs`; Wick & Shade: the bot playthroughs).
3. Commit and push to `main`. Vercel builds the AppImage and the site itself (`scripts/vercel-build.sh`, about 1-2 minutes).
   The landing page picks up the new version number automatically.

Pushes to other branches get preview deployments. A push that doesn't touch a game's folder doesn't rebuild that game
(`ignoreCommand` in its `vercel.json`).

AppImages are never committed: Vercel builds them from source on every deploy. To build one locally, run
`bash scripts/vercel-build.sh` inside the game folder; the output lands in `public/`.

## Adding a game

1. Make a new folder with a `vercel.json` and `scripts/vercel-build.sh` (copy one of the existing games) that writes
   the site to `public/`.
2. In Vercel, import this repo as a new project and set **Root Directory** to the new folder.

## Vercel setup notes

- Both projects live in the `jules-youngbergs-projects` team; each has **Root Directory** set to its game folder.
  Build settings come from the folder's `vercel.json`.
- Commits that only touch files outside a game's folder (like this README) skip that game's build.
