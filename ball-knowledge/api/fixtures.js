// /api/fixtures.js
// Proxy for API-Football fixtures endpoint.
// Accepts query params: id, date, league, season, live, team, from, to, timezone, round, status

export default async function handler(req, res) {
  const apiKey = process.env.API_FOOTBALL_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API_FOOTBALL_KEY not set in Vercel env vars' });
  }

  const { id, date, league, season, live, team, from, to, timezone, round, status } = req.query;

  const params = new URLSearchParams();
  if (id) params.append('id', id);
  if (date) params.append('date', date);
  if (league) params.append('league', league);
  if (season) params.append('season', season);
  if (live) params.append('live', live);
  if (team) params.append('team', team);
  if (from) params.append('from', from);
  if (to) params.append('to', to);
  if (timezone) params.append('timezone', timezone);
  if (round) params.append('round', round);
  if (status) params.append('status', status);

  const url = `https://v3.football.api-sports.io/fixtures?${params.toString()}`;

  try {
    const response = await fetch(url, { headers: { 'x-apisports-key': apiKey } });
    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({
        error: 'Upstream API error', status: response.status, detail: text,
      });
    }
    const data = await response.json();
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Fetch failed', detail: String(err) });
  }
}
