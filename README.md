# APigamer

Vite/React frontend with a Node/Express backend that proxies RAWG and Twitch APIs to avoid exposing secrets in the browser. The backend handles API key/token exchange, lightweight caching, and CORS for local development.

## Quick Start

```sh
# Frontend
npm install
npm run dev

# Backend (separate terminal)
cd backend
npm install
npm start
```

Frontend dev server defaults to http://localhost:5173 and backend to http://localhost:4000.

## Environment Variables

Create backend/.env (kept out of git) with:

```sh
PORT=4000                 # optional override
RAWG_KEY=your_rawg_key    # required for RAWG endpoints
TWITCH_CLIENT_ID=your_id  # required for Twitch endpoints
TWITCH_CLIENT_SECRET=your_secret
```

Notes:
- RAWG key is required to avoid rate limits; the embedded fallback is only for local testing.
- Twitch endpoints need both client id and secret; the server exchanges them for an app token and caches it.
- .gitignore already ignores .env and backend/.env; keep secrets out of commits.

## Backend Endpoints

- GET /api/games — proxies RAWG list queries (supports RAWG query params, adds key automatically).
- GET /api/game/:id — proxies RAWG game detail.
- GET /api/twitch/token — returns the cached Twitch app token (debug).
- GET /api/twitch/game-id?name=... — resolves a Twitch game id by name.
- GET /api/twitch/streams?game_id=...&first=10 — Twitch streams for a game (defaults to top streams when no game_id).

Each route applies short TTL in-memory caching to reduce upstream calls.

## Frontend Notes

- Axios instance targets the backend; calls stay same shape as RAWG/Twitch responses.
- Zustand stores fetch from the proxy; set the backend base URL if you run on a non-default port.

## Development Tips

- If you see TLS/CA issues when calling external APIs from the backend on some networks, set NODE_EXTRA_CA_CERTS to your corporate CA bundle.
- To clear the in-memory caches, restart the backend process.
- When deploying, keep environment variables on the server/platform; do not bundle them in the frontend.
