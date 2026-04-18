// /api/scorers.js
// Proxy for API-Football player leaderboards.
// Accepts query params:
//   league (required), season (required)
//   stat = goals | assists | yellowcards | redcards  (default: goals)

export default async function handler(req, res) {
  const apiKey = process.env.API_FOOTBALL_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API_FOOTBALL_KEY not set in Vercel env vars' });
  }

  const { league, season, stat = 'goals' } = req.query;

  if (!league || !season) {
    return res.status(400).json({ error: 'league and season are required' });
  }

  const statToEndpoint = {
    goals: 'topscorers',
    assists: 'topassists',
    yellowcards: 'topyellowcards',
    redcards: 'topredcards',
  };

  const endpoint = statToEndpoint[stat];
  if (!endpoint) {
    return res.status(400).json({ error: 'stat must be one of: goals, assists, yellowcards, redcards' });
  }

  const params = new URLSearchParams({ league, season });
  const url = `https://v3.football.api-sports.io/players/${endpoint}?${params.toString()}`;

  try {
    const response = await fetch(url, { headers: { 'x-apisports-key': apiKey } });
    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({
        error: 'Upstream API error', status: response.status, detail: text,
      });
    }
    const data = await response.json();
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=3600');
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Fetch failed', detail: String(err) });
  }
}
