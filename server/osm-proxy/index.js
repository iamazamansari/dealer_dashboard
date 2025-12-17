import express from "express";
import NodeCache from "node-cache";
import fetch from "node-fetch";

const app = express();
const cache = new NodeCache({ stdTTL: 60 * 60 }); // 1 hour
const PORT = process.env.PORT || 4000;

app.get("/api/geocode", async (req, res) => {
  const q = String(req.query.q || "").trim();
  if (!q) return res.status(400).json({ error: "q required" });

  const key = `geocode:${q}`;
  const cached = cache.get(key);
  if (cached) return res.json(cached);

  const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(
    q
  )}`;

  try {
    const r = await fetch(url, { headers: { "User-Agent": "DealerDashboard/1.0" } });
    const json = await r.json();
    cache.set(key, json);
    res.json(json);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.get("/api/reverse", async (req, res) => {
  const lat = req.query.lat;
  const lon = req.query.lon;
  if (!lat || !lon) return res.status(400).json({ error: "lat & lon required" });

  const key = `reverse:${lat},${lon}`;
  const cached = cache.get(key);
  if (cached) return res.json(cached);

  const url = `https://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&lat=${lat}&lon=${lon}`;

  try {
    const r = await fetch(url, { headers: { "User-Agent": "DealerDashboard/1.0" } });
    const json = await r.json();
    cache.set(key, json);
    res.json(json);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.listen(PORT, () => console.log(`OpenStreetMap proxy listening on ${PORT}`));
