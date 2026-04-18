// /api/standings.js
// Proxy for API-Football standings endpoint.
// Accepts query params: league (required), season (required), team

export default async function handler(req, res) {
  const apiKey = process.env.API_FOOTBALL_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API_FOOTBALL_KEY not set in Vercel env vars' });
  }

  const { league, season, team } = req.query;

  if (!league || !season) {
    return res.status(400).json({ error: 'league and season are required' });
  }

  const params = new URLSearchParams({ league, season });
  if (team) params.append('team', team);

  const url = `https://v3.football.api-sports.io/standings?${params.toString()}`;

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

    // Standings change less frequently — cache 5 min
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=3600');
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Fetch failed', detail: String(err) });
  }
}
