#!/bin/sh
# Builds the QS Play portal version of Sunlight Beam from the live game.
# Output: qsplay/build/ (folder to upload), qsplay/shadow-light-qsplay.zip (the game)
# and qsplay/shadow-light-qsplay-submission.zip (game + images + texts for the
# portal application).
# The game itself is not changed; this only adds the portal SDK and adapter.
set -e
cd "$(dirname "$0")"
GAME=..
OUT=build
ZIP=shadow-light-qsplay.zip
SUBMISSION=shadow-light-qsplay-submission.zip
PACK=submission
MARKER='<!-- PLATFORM SCRIPTS:'

rm -rf "$OUT" "$ZIP" "$PACK" "$SUBMISSION"
mkdir -p "$OUT"

grep -q "$MARKER" "$GAME/index.html" || { echo "Marker '$MARKER' not found in index.html" >&2; exit 1; }

# The SDK and the adapter go into <head>, before the game code
awk -v marker="$MARKER" '
    index($0, marker) {
        print "    <script src=\"https://sdk.quartsoft.com/v1/sdk.js\"></script>"
        print "    <script src=\"qsplay-platform.js\"></script>"
        next
    }
    { print }
' "$GAME/index.html" > "$OUT/index.html"
cp "$GAME/tailwind.css" "$OUT/"
cp qsplay-platform.js "$OUT/"

# Portal rules: no local addresses, no CDN Tailwind, only https links
if grep -n -E 'localhost|127\.0\.0\.1|cdn\.tailwindcss|http://' "$OUT"/*; then
    echo "Build contains forbidden references (see above)" >&2
    exit 1
fi

(cd "$OUT" && zip -q -r "../$ZIP" .)
echo "Built $(cd "$OUT" && ls | tr '\n' ' ')"
echo "Size: $(du -sh "$OUT" | cut -f1) folder, $(du -h "$ZIP" | cut -f1) zip -> qsplay/$ZIP"

# Everything for the application in one archive:
#   game/   - the game archive to upload
#   images/ - icon, cover, share image, screenshots
#   texts/  - title, descriptions, controls, tags
mkdir -p "$PACK/game" "$PACK/images/icon" "$PACK/images/cover" "$PACK/images/screenshots" "$PACK/texts"
cp "$ZIP" "$PACK/game/"
cp media/game_icon.png "$PACK/images/icon/"
cp media/game_cover.jpg media/share_image.jpg "$PACK/images/cover/"
cp media/screenshot_*.jpg "$PACK/images/screenshots/"
cp listing.md "$PACK/texts/"
(cd "$PACK" && zip -q -r "../$SUBMISSION" .)
rm -rf "$PACK"
echo "Submission: qsplay/$SUBMISSION ($(du -h "$SUBMISSION" | cut -f1))"
