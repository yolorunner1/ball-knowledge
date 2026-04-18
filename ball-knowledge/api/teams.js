// /api/teams.js
// Proxy for API-Football team info.
// Modes:
//   ?id=33                → team profile (info + venue)
//   ?search=liverpool     → search teams by name (min 3 chars)
//   ?league=39&season=2025 → list teams in a league/season
//
// Optionally combine with ?stats=1 to also fetch /teams/statistics for league+season.

export default async function handler(req, res) {
  const apiKey = process.env.API_FOOTBALL_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API_FOOTBALL_KEY not set in Vercel env vars' });
  }

  const { id, search, league, season, stats } = req.query;

  if (!id && !search && !league) {
    return res.status(400).json({ error: 'id, search or league is required' });
  }

  if (search && search.length < 3) {
    return res.status(400).json({ error: 'search must be at least 3 characters' });
  }

  const params = new URLSearchParams();
  if (id) params.append('id', id);
  if (search) params.append('search', search);
  if (league) params.append('league', league);
  if (season) params.append('season', season);

  const baseUrl = `https://v3.football.api-sports.io/teams?${params.toString()}`;

  try {
    const teamRes = await fetch(baseUrl, { headers: { 'x-apisports-key': apiKey } });
    if (!teamRes.ok) {
      const text = await teamRes.text();
      return res.status(teamRes.status).json({ error: 'Upstream API error', detail: text });
    }
    const teamData = await teamRes.json();

    // If stats requested and we have id + league + season, also fetch stats
    let statsData = null;
    if (stats && id && league && season) {
      const statsUrl = `https://v3.football.api-sports.io/teams/statistics?team=${id}&league=${league}&season=${season}`;
      const sRes = await fetch(statsUrl, { headers: { 'x-apisports-key': apiKey } });
      if (sRes.ok) statsData = await sRes.json();
    }

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).json({ team: teamData, stats: statsData });
  } catch (err) {
    return res.status(500).json({ error: 'Fetch failed', detail: String(err) });
  }
}
