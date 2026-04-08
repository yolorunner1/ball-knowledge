module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const key = process.env.API_FOOTBALL_KEY;
  if (!key) return res.status(500).json({ error: "No API key" });
  const { date, live, league, season } = req.query;
  const params = new URLSearchParams();
  if (live === "all") params.append("live", "all");
  else if (date) params.append("date", date);
  if (league) params.append("league", league);
  if (season) params.append("season", season);
  const url = `https://v3.football.api-sports.io/fixtures?${params}`;
  const r = await fetch(url, { headers: { "x-apisports-key": key } });
  const data = await r.json();
  res.status(200).json(data);
};
