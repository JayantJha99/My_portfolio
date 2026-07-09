# Jayant Jha — Portfolio

Personal portfolio: a single-page static site that tells the story of a mechanical
engineer who became a data engineer — and now builds the pipelines behind renewable-energy
operations.

**Stack:** Vite · semantic HTML · modern CSS · vanilla JS. Zero runtime dependencies,
self-hosted variable fonts, no trackers. ~9KB of gzipped JS+CSS.

## Develop

```bash
npm install
npm run dev        # http://localhost:5173
```

## Build & preview

```bash
npm run build      # outputs static site to dist/
npm run preview    # serve dist/ locally
```

## Deploy

The site is fully static — host `dist/` anywhere.

- **Vercel / Netlify / Cloudflare Pages:** import the repo, framework preset *Vite*,
  build command `npm run build`, output directory `dist`. Done.
- **GitHub Pages:** set `base: '/<repo-name>/'` in [vite.config.js](vite.config.js),
  build, and publish `dist/` (e.g. with the `actions/deploy-pages` workflow).

## Updating content

All content lives in [index.html](index.html) — no CMS, no data files. The résumé PDF
served from the header button is [public/Jayant_Jha_Resume.pdf](public/Jayant_Jha_Resume.pdf);
replace that file to update it.

See [CLAUDE.md](CLAUDE.md) for architecture, design language, and conventions.
