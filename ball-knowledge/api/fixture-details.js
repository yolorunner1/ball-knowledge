// /api/fixture-details.js
// Combined fetch for a single fixture: events + lineups + statistics.
// Accepts: fixture (required, fixture ID)
// Returns: { events, lineups, statistics } — each null if upstream fails individually.

export default async function handler(req, res) {
  const apiKey = process.env.API_FOOTBALL_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API_FOOTBALL_KEY not set in Vercel env vars' });
  }

  const { fixture } = req.query;
  if (!fixture) {
    return res.status(400).json({ error: 'fixture (fixture id) is required' });
  }

  const headers = { 'x-apisports-key': apiKey };
  const base = 'https://v3.football.api-sports.io/fixtures';

  const urls = {
    events:     `${base}/events?fixture=${fixture}`,
    lineups:    `${base}/lineups?fixture=${fixture}`,
    statistics: `${base}/statistics?fixture=${fixture}`,
  };

  async function safeFetch(url) {
    try {
      const r = await fetch(url, { headers });
      if (!r.ok) return null;
      return await r.json();
    } catch {
      return null;
    }
  }

  try {
    const [events, lineups, statistics] = await Promise.all([
      safeFetch(urls.events),
      safeFetch(urls.lineups),
      safeFetch(urls.statistics),
    ]);

    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=120');
    return res.status(200).json({ events, lineups, statistics });
  } catch (err) {
    return res.status(500).json({ error: 'Fetch failed', detail: String(err) });
  }
}
