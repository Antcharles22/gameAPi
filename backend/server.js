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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  if (!process.env.RAWG_KEY) {
    console.warn("Warning: RAWG_KEY not set in environment. Using embedded key (not recommended for production).");
  }
});