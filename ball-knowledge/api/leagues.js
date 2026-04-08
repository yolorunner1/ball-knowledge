module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const key = process.env.API_FOOTBALL_KEY;
  if (!key) return res.status(500).json({ error: "No API key" });
  const { search, current } = req.query;
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (current) params.append("current", current);
  const url = `https://v3.football.api-sports.io/leagues?${params}`;
  const r = await fetch(url, { headers: { "x-apisports-key": key } });
  const data = await r.json();
  res.status(200).json(data);
};
