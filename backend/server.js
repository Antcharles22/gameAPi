// ...existing code...
const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const API_Key = process.env.RAWG_KEY || '64a66ea3c1624447bfeb3bcd7f094e6a';

// Simple in-memory cache with TTL
const cache = new Map(); // key -> { expires: timestamp, data }

function setCache(key, data, ttl = 60_000) {
  cache.set(key, { expires: Date.now() + ttl, data });
}
function getCache(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

app.use(cors());
app.use(express.json());

// health
app.get("/", (req, res) => res.send("Proxy server is running"));

// Helper to proxy GET requests to RAWG with caching
async function proxyRawg(req, res, path) {
  try {
    // Build query params from incoming request and ensure key is included
    const params = { ...req.query, key: API_Key };

    // Build cache key based on path + sorted params (excluding sensitive value key)
    const sortedKeys = Object.keys(params).sort();
    const paramString = sortedKeys.map(k => `${k}=${params[k]}`).join("&");
    const cacheKey = `${path}?${paramString}`;

    const cached = getCache(cacheKey);
    if (cached) {
      console.log("CACHE HIT:", cacheKey);
      return res.json(cached);
    }

    console.log("CACHE MISS -> RAWG:", cacheKey);
    const rawgRes = await axios.get(`https://api.rawg.io${path}`, {
      params,
      timeout: 10_000
    });

    // Cache success (short TTL to reduce rate usage)
    setCache(cacheKey, rawgRes.data, 60_000); // 60s cache
    return res.json(rawgRes.data);
  } catch (error) {
    console.error("RAWG API error:", error.message);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Body:", error.response.data);
      // forward RAWG response status and body when available
      return res.status(error.response.status).json(error.response.data);
    }
    return res.status(500).json({ error: "Failed to fetch data from RAWG", message: error.message });
  }
}

app.get("/api/games", (req, res) => proxyRawg(req, res, "/api/games"));
app.get("/api/game/:id", (req, res) => proxyRawg(req, res, `/api/games/${req.params.id}`));

/* ---------------------------
   Twitch helper endpoints
   - keep client id/secret in env:
     TWITCH_CLIENT_ID and TWITCH_CLIENT_SECRET
   - endpoints:
     GET /api/twitch/token
     GET /api/twitch/game-id?name=...
     GET /api/twitch/streams?game_id=...&first=10
   --------------------------- */

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;

// simple token cache
let twitchToken = null;
let twitchTokenExpiresAt = 0;

async function getTwitchAppToken() {
  // return cached if still valid (give small safety margin)
  if (twitchToken && Date.now() < twitchTokenExpiresAt - 60_000) return twitchToken;

  if (!TWITCH_CLIENT_ID || !TWITCH_CLIENT_SECRET) {
    throw new Error("Twitch client id/secret not configured on server (TWITCH_CLIENT_ID/TWITCH_CLIENT_SECRET)");
  }

  const res = await axios.post("https://id.twitch.tv/oauth2/token", null, {
    params: {
      client_id: TWITCH_CLIENT_ID,
      client_secret: TWITCH_CLIENT_SECRET,
      grant_type: "client_credentials",
    },
    timeout: 10_000,
  });

  twitchToken = res.data.access_token;
  const expiresIn = res.data.expires_in || 0;
  twitchTokenExpiresAt = Date.now() + expiresIn * 1000;
  return twitchToken;
}

// Return app token (useful for debugging)
app.get("/api/twitch/token", async (req, res) => {
  try {
    const token = await getTwitchAppToken();
    return res.json({ access_token: token });
  } catch (error) {
    console.error("Twitch token error:", error.message);
    if (error.response) return res.status(error.response.status).json(error.response.data);
    return res.status(500).json({ error: "Failed to get twitch token", message: error.message });
  }
});

// Lookup Twitch game id by name
app.get("/api/twitch/game-id", async (req, res) => {
  try {
    const name = req.query.name;
    if (!name) return res.status(400).json({ error: "Missing query param: name" });

    const token = await getTwitchAppToken();
    const twitchRes = await axios.get("https://api.twitch.tv/helix/games", {
      headers: {
        "Client-ID": TWITCH_CLIENT_ID,
        Authorization: `Bearer ${token}`,
      },
      params: { name },
      timeout: 10_000,
    });

    return res.json(twitchRes.data.data || []);
  } catch (error) {
    console.error("Twitch game-id error:", error.message);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Body:", error.response.data);
      return res.status(error.response.status).json(error.response.data);
    }
    return res.status(500).json({ error: "Failed to fetch twitch game id", message: error.message });
  }
});

// Fetch streams (by game_id or top streams)
app.get("/api/twitch/streams", async (req, res) => {
  try {
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

    return res.json(twitchRes.data.data || []);
  } catch (error) {
    console.error("Twitch streams error:", error.message);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Body:", error.response.data);
      return res.status(error.response.status).json(error.response.data);
    }
    return res.status(500).json({ error: "Failed to fetch twitch streams", message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  if (!process.env.RAWG_KEY) {
    console.warn("Warning: RAWG_KEY not set in environment. Using embedded key (not recommended for production).");
  }
  if (!process.env.TWITCH_CLIENT_ID || !process.env.TWITCH_CLIENT_SECRET) {
    console.warn("Warning: TWITCH_CLIENT_ID/TWITCH_CLIENT_SECRET not set - Twitch endpoints will fail.");
  }
});