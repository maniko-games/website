# Product link service (p.maniko.games)

A tiny Vercel project (no dependencies) behind the product links `https://p.maniko.games/p/?t=<token>`:
- `api/p.js` returns the preview tags (title, rating, product photo) for chat apps and sends people to Google Play;
- `public/.well-known/assetlinks.json` lets Android open the links in the app (App Links).

Setup: see `docs/BUILD.md` in the app repository (section "Product links"). The main site (GitHub Pages) is not changed.
