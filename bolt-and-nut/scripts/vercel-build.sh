#!/usr/bin/env bash
# Vercel runs this on every push (see vercel.json). It bundles the browser build,
# builds the Steam Deck AppImage, and assembles the static site in public/:
#   /            landing page (site/index.html with the version filled in)
#   /play/       browser version (dist/index.html)
#   /dl          -> /BoltAndNut.AppImage (latest desktop build)
set -euo pipefail
VERSION=$(node -p "require('./app/package.json').version")
echo "Building Bolt & Nut $VERSION"

node build.mjs
mkdir -p app/game
cp dist/index.html app/game/index.html
(cd app && npm ci && npx electron-builder --linux AppImage --x64 -p never)

rm -rf public && mkdir -p public/play
cp app/dist/BoltAndNut-"$VERSION".AppImage public/BoltAndNut.AppImage
cp dist/index.html public/play/index.html
cp app/build/icon.png public/icon.png
SIZE_MB=$(( ($(stat -c %s public/BoltAndNut.AppImage) + 524288) / 1048576 ))
sed -e "s/__VERSION__/$VERSION/g" -e "s/__SIZE_MB__/$SIZE_MB/g" site/index.html > public/index.html
if grep -q "__VERSION__\|__SIZE_MB__" public/index.html; then echo "placeholder left in landing page" >&2; exit 1; fi
ls -la public public/play
