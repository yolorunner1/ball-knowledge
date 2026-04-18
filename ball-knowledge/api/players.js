// /api/players.js
// Proxy for API-Football player search.
// Accepts query params: search (required, min 3 chars), league, season, team, id, page

export default async function handler(req, res) {
  const apiKey = process.env.API_FOOTBALL_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API_FOOTBALL_KEY not set in Vercel env vars' });
  }

  const { search, league, season, team, id, page } = req.query;

  if (!search && !id && !team) {
    return res.status(400).json({ error: 'search, id, or team is required' });
  }

  if (search && search.length < 3) {
    return res.status(400).json({ error: 'search must be at least 3 characters' });
  }

  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (league) params.append('league', league);
  if (season) params.append('season', season);
  if (team) params.append('team', team);
  if (id) params.append('id', id);
  if (page) params.append('page', page);

  const url = `https://v3.football.api-sports.io/players?${params.toString()}`;

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

    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=3600');
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Fetch failed', detail: String(err) });
  }
}
