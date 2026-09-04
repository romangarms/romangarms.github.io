# Aerial Reforestation (romangarms.com/ar/)

Acceleration times and run leaderboards for the group's cars. This is the `ar` branch of the
romangarms.com repo: each long-lived branch here is its own sub-site served from a subfolder of
romangarms.com, sharing only the Vite/React tooling with `main`.

## Pages

- `/ar/acceleration` — 0–30 / 0–60 / quarter-mile table (published Google Sheet)
- `/ar/leaderboard` — Washington: Bellingham Cannonball Run, run photos, Disco Run, Track Addict QR codes (published Google Sheets)
- `/ar/leaderboard-ca` — California: Highway 9 courses from the leaderboard API, with the published sheet as a fallback

## Data sources

The Highway 9 tables come from the Evergreen AutoX server (`../Evergreen-AutoX-App`):

- `GET /api/leaderboard/courses`
- `GET /api/leaderboard/courses/{id}`

The base URL is `https://autox.romangarms.com` in production and is proxied through Vite at `/api`
in development (see `vite.config.js`). Override it with `VITE_API_BASE` in a `.env` file.

Everything else still reads the published-to-web Google Sheets (`src/data/sheets.js`) at runtime
via their CSV export, which Google serves with permissive CORS.

## Development

```bash
npm install
npm run dev      # http://localhost:5173/ar/
npm run build
npm run preview
```

## Deployment

```bash
npm run deploy
```

Builds with `base: '/ar/'` and pushes `dist/` into the `ar/` folder of this repo's `gh-pages`
branch (`gh-pages --dest ar`), which only touches files under `ar/`. The main site's own deploy
(on `main`) removes everything except `ar/`, so the two can be deployed independently.

Client-side routing under `/ar/` relies on the root `404.html` published by `main`: it keeps the
first path segment for known sub-sites and redirects to `/ar/?/<path>`, which `index.html` here
turns back into the real URL before React Router takes over. Adding a new sub-site means adding
its folder name to that list on `main`.
