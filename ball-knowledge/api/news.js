// /api/news.js
// Proxy for GNews football news.
// Accepts query params: q (search query), max (number of articles, default 10), lang (default en)

export default async function handler(req, res) {
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'NEWS_API_KEY not set in Vercel env vars' });
  }

  const { q = 'football', max = '10', lang = 'en' } = req.query;

  // Clamp max to GNews free tier limit (10 per request)
  const maxClamped = Math.min(parseInt(max, 10) || 10, 10);

  const params = new URLSearchParams({
    q,
    lang,
    max: String(maxClamped),
    apikey: apiKey,
  });

  const url = `https://gnews.io/api/v4/search?${params.toString()}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({
        error: 'Upstream GNews error',
        status: response.status,
        detail: text,
      });
    }

    const data = await response.json();

    // News updates frequently but we want to save on the 100/day quota — cache 15 min
    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=3600');
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Fetch failed', detail: String(err) });
  }
}
