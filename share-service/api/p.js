// The page of a product link: https://p.maniko.games/p/?t=<token>.
// - Chat apps (Telegram, WhatsApp, ...) read the preview tags below: title, rating line and the product photo.
// - People who land here (the app is not installed, or a computer) go straight to Google Play.
// - On a phone that has the app, Android opens the app itself (App Link) and never loads this page.
// The card is read from the app's server (Supabase function "shared-product"); nothing is stored here.
const API = 'https://ejqnanfgjkrxrwxhbucb.supabase.co/functions/v1/shared-product';
const PLAY = 'https://play.google.com/store/apps/details?id=com.manikogames.rememberthatthing';
const VERDICTS = {
  en: { buy: 'Buy again', meh: 'So-so', skip: 'Skip' },
  ru: { buy: 'Покупать снова', meh: 'Так себе', skip: 'Пропустить' },
  uk: { buy: 'Купувати знову', meh: 'Так собі', skip: 'Пропустити' },
  ro: { buy: 'Cumpără din nou', meh: 'Așa și așa', skip: 'Sari peste' },
};

const escape = (text) => String(text).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function describe(card, language) {
  const names = VERDICTS[language] ?? VERDICTS.en;
  const rating = Math.round(card.rating || 0);
  const verdict = rating >= 4 ? names.buy : rating === 3 ? names.meh : rating >= 1 ? names.skip : '';
  const line = verdict ? `${verdict} · ★ ${rating}` : '';
  const note = (card.comment || '').trim();
  return [line, note].filter(Boolean).join('\n');
}

module.exports = async (request, response) => {
  const token = String(request.query.t || '').trim().toLowerCase();
  const language = String(request.headers['accept-language'] || 'en').slice(0, 2).toLowerCase();
  let title = 'Remember That Thing';
  let description = '';
  let image = '';
  if (/^[0-9a-f]{24}$/.test(token)) {
    try {
      const result = await fetch(`${API}?t=${token}`);
      if (result.ok) {
        const card = await result.json();
        title = [card.name, card.brand].filter(Boolean).join(' · ') || title;
        description = describe(card, language);
        if (card.hasFront || card.hasBack) image = `${API}?t=${token}&photo=${card.hasFront ? 'front' : 'back'}`;
      }
    } catch {
      // no preview details: the page still sends people to Google Play
    }
  }
  const tags = [
    ['og:type', 'website'],
    ['og:site_name', 'Remember That Thing'],
    ['og:title', title],
    ['og:description', description],
    ['og:image', image],
    ['twitter:card', image ? 'summary_large_image' : 'summary'],
    ['twitter:title', title],
    ['twitter:description', description],
    ['twitter:image', image],
  ]
    .filter(([, value]) => value)
    .map(([name, value]) => `<meta property="${name}" name="${name}" content="${escape(value)}">`)
    .join('\n');
  response.setHeader('Content-Type', 'text/html; charset=utf-8');
  response.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');
  response.status(200).send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex">
<title>${escape(title)}</title>
${tags}
</head>
<body style="font-family:sans-serif;text-align:center;padding:40px">
<p><a href="${PLAY}">Remember That Thing</a></p>
<script>window.location.replace(${JSON.stringify(PLAY)});</script>
</body>
</html>`);
};
