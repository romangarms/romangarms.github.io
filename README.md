# Aerial Reforestation (ar.romangarms.com)

Acceleration times and run leaderboards for the group's cars. This is the `ar` branch of the
romangarms.com repo: each long-lived branch here is its own sub-site with its own domain,
build, and deploy target, sharing only the Vite/React tooling with `main`.

## Pages

- `/acceleration` — 0–30 / 0–60 / quarter-mile table (published Google Sheet)
- `/leaderboard` — Washington: Bellingham Cannonball Run, run photos, Disco Run, Track Addict QR codes (published Google Sheets)
- `/leaderboard-ca` — California: Highway 9 courses from the leaderboard API, with the published sheet as a fallback

## Data sources

The Highway 9 tables come from the Evergreen AutoX server (`../Evergreen-AutoX-App`):

- `GET /api/leaderboard/courses`
- `GET /api/leaderboard/courses/{id}`

The base URL is `http://mini.romangarms.com:8321` in production and is proxied through Vite at `/api`
in development (see `vite.config.js`). Override it with `VITE_API_BASE` in a `.env` file.

Everything else still reads the published-to-web Google Sheets (`src/data/sheets.js`) at runtime
via their CSV export, which Google serves with permissive CORS.

## Development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

## Deployment

```bash
npm run deploy
```

Builds and pushes `dist/` to the `gh-pages` branch of the repo named in the `deploy` script in
`package.json`. GitHub Pages only serves one site per repository, so each sub-site branch deploys
to its own repository. One-time setup for this site:

1. Create the target repo (`romangarms/ar.romangarms.com`, public, empty).
2. Run `npm run deploy` once so the `gh-pages` branch exists.
3. In that repo: Settings → Pages → source `gh-pages` / root, custom domain `ar.romangarms.com`,
   enforce HTTPS. The `CNAME` file in this branch is copied into every build.
4. DNS: change the `ar` CNAME record from `ghs.googlehosted.com` to `romangarms.github.io`.

Client-side routing on GitHub Pages works through `public/404.html`, which redirects unknown paths
back to `index.html` with the path in the query string.
