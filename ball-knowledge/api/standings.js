module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const key = process.env.API_FOOTBALL_KEY;
  if (!key) return res.status(500).json({ error: "No API key" });
  const { league, season } = req.query;
  const yr = season || 2025;
  const url = `https://v3.football.api-sports.io/standings?league=${league}&season=${yr}`;
  const r = await fetch(url, { headers: { "x-apisports-key": key } });
  const data = await r.json();
  res.status(200).json(data);
};
