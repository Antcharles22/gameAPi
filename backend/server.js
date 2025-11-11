// ...existing code...
app.get("/api/twitch/streams", async (req, res) => {
  try {
    // cache key based on query to avoid hitting Twitch repeatedly
    const cacheKey = `twitch_streams:${JSON.stringify(req.query || {})}`;
    const cached = getCache(cacheKey);
    if (cached) {
      console.log("CACHE HIT -> TWITCH:", cacheKey);
      return res.json(cached);
    }

    const token = await getTwitchAppToken();
    const params = {};
    if (req.query.game_id) params.game_id = req.query.game_id;
    if (req.query.first) params.first = req.query.first;
    if (req.query.language) params.language = req.query.language;

    const twitchRes = await axios.get("https://api.twitch.tv/helix/streams", {
      headers: {
        "Client-ID": TWITCH_CLIENT_ID,
        Authorization: `Bearer ${token}`,
      },
      params: Object.keys(params).length ? params : { first: 10 },
      timeout: 10_000,
    });

    // cache for 30s to reduce rate usage
    setCache(cacheKey, twitchRes.data.data || [], 30_000);
    return res.json(twitchRes.data.data || []);
  } catch (error) {
    console.error("Twitch streams error:", error?.response?.data || error?.message);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Body:", error.response.data);
      return res.status(error.response.status).json(error.response.data);
    }
    return res.status(500).json({ error: "Failed to fetch twitch streams", message: error.message });
  }
});
// ...existing code...