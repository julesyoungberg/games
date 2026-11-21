#!/usr/bin/env bash
# Vercel runs this on every push (see vercel.json). It builds the Steam Deck AppImage
# and assembles the static site in public/:
#   /            landing page (site/index.html with the version filled in)
#   /play/       browser version (game/index.html)
#   /dl          -> /WickAndShade.AppImage (latest desktop build)
set -euo pipefail
VERSION=$(node -p "require('./package.json').version")
echo "Building Wick & Shade $VERSION"

npx electron-builder --linux AppImage --x64 -p never

rm -rf public && mkdir -p public/play
cp dist/WickAndShade-"$VERSION".AppImage public/WickAndShade.AppImage
cp game/index.html public/play/index.html
# Browser saves from the old wick-and-shade.vercel.app address arrive as #ws-import=... (see site/import-save.js)
cp site/import-save.js public/import-save.js
sed -i '0,/<script>/s##<script src="../import-save.js"></script>\n<script>#' public/play/index.html
grep -q 'import-save.js' public/play/index.html || { echo "import-save.js not injected into play page" >&2; exit 1; }
cp build/icon.png public/icon.png
SIZE_MB=$(( ($(stat -c %s public/WickAndShade.AppImage) + 524288) / 1048576 ))
sed -e "s/__VERSION__/$VERSION/g" -e "s/__SIZE_MB__/$SIZE_MB/g" site/index.html > public/index.html
if grep -q "__VERSION__\|__SIZE_MB__" public/index.html; then echo "placeholder left in landing page" >&2; exit 1; fi
ls -la public public/play
