const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 4000;
const API_Key = '64a66ea3c1624447bfeb3bcd7f094e6a'; // Use your RAWG API key here

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.use(cors());

app.get("/api/games", async (req, res) => {
  try {
    const rawgRes = await axios.get("https://api.rawg.io/api/games", {
      params: { ...req.query, key: API_Key }
    });
    res.json(rawgRes.data);
  } catch (error) {
    console.error("RAWG API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch games" });
  }
});