// /api/leagues.js
// Proxy for API-Football leagues search.
// Accepts query params: search, country, code, id, current, season, type

export default async function handler(req, res) {
  const apiKey = process.env.API_FOOTBALL_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API_FOOTBALL_KEY not set in Vercel env vars' });
  }

  const { search, country, code, id, current, season, type } = req.query;

  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (country) params.append('country', country);
  if (code) params.append('code', code);
  if (id) params.append('id', id);
  if (current) params.append('current', current);
  if (season) params.append('season', season);
  if (type) params.append('type', type);

  const url = `https://v3.football.api-sports.io/leagues?${params.toString()}`;

  try {
    const response = await fetch(url, {
      headers: {
        'x-apisports-key': apiKey,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({
        error: 'Upstream API error',
        status: response.status,
        detail: text,
      });
    }

    const data = await response.json();

    // Leagues list is pretty static — cache 1 hour
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Fetch failed', detail: String(err) });
  }
}
