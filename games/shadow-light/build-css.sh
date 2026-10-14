#!/bin/sh
# Rebuilds tailwind.css from the Tailwind classes used in index.html.
# Run it after adding or changing Tailwind classes in the game. Needs Node.js.
cd "$(dirname "$0")" || exit 1
npx --yes tailwindcss@3.4.17 --content ./index.html --output ./tailwind.css --minify
