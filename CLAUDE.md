# Jayant Jha — Portfolio

Personal portfolio for Jayant Jha (Data Engineer → AI/Backend). Single-page static site,
built to convince a recruiter within one minute. Live content sources: `Jayant_New.pdf`
résumé, github.com/JayantJha99, LinkedIn (jayant-aws-dataengineer).

## Stack & architecture

- **Vite + vanilla JS + modern CSS. Zero runtime dependencies.** This is deliberate — the
  site is itself a performance statement (≈9KB gzipped JS+CSS). Do not add a framework,
  component library, or CSS preprocessor.
- Fonts are self-hosted via `@fontsource-variable/*` (Space Grotesk = display,
  Inter = body, JetBrains Mono = labels/accents). No external requests, no trackers.
- Layout:
  - `index.html` — all content lives here, semantic HTML, one page, sections:
    hero → metrics → #story → #work → #experience → #skills → #contact.
  - `src/styles/main.css` — single stylesheet, ordered: tokens → base → components →
    sections → responsive → reduced-motion. Theming via `[data-theme]` custom properties.
  - `src/js/main.js` — boot + small feature functions (theme, nav, scrollspy, reveal, counters).
  - `src/js/pipeline.js` — hero canvas animation (see Design language).
  - `public/` — favicon.svg, robots.txt, `Jayant_Jha_Resume.pdf` (served at `/Jayant_Jha_Resume.pdf`).

## Design language: "medallion"

Bronze / Silver / Gold (the lakehouse medallion architecture Jayant works in daily) is the
design system: the `--bronze/--silver/--gold` tokens drive the favicon, brand mark, story
step badges, flow-diagram node tones, and the hero animation (particles flow left→right:
scattered/raw → converging/deduplicated → aligned lanes). Keep every new visual element
tied to this metaphor or neutral — no unrelated accent colors.

- Dark theme is the default and primary design; light theme must stay first-class.
  Test both before shipping any CSS change.
- Voice: engineering case studies, not resume bullets. Sections say *why decisions were
  made* ("decisions that mattered"), with real metrics (50% latency, 10K+/s Kafka, 15% DQ).
  Never inflate numbers beyond what the résumé states.
- Mono font (`.mono`) marks "system" text: eyebrows, labels, flow diagrams, buttons.

## Conventions

- No build-time content layer: content edits happen directly in `index.html`.
- Every interactive/animated feature must honor `prefers-reduced-motion` (see
  `initReveal`, `initCounters`, and the static-frame path in `pipeline.js`).
- Accessibility bar: semantic landmarks, skip link, `:focus-visible` styles, aria-labels
  on icon buttons, `role="img"` + label on the flow diagrams, contrast ≥ 4.5:1 for text
  (check `--text-faint` against `--bg` in both themes if touched).
- Keep `hero-canvas` cheap: cap particle count (~90), cap DPR at 2, pause off-screen and
  on hidden tab.

## Commands

- `npm run dev` — dev server (also configured in `.claude/launch.json` as `portfolio-dev`).
- `npm run build` — production build to `dist/`.
- `npm run preview` — serve the production build locally.

## Testing strategy

No test framework (static site). Verification = manual sweep before any release:
1. `npm run build` passes.
2. Dev preview: dark + light, mobile (375px) + desktop (1280px).
3. Console clean; no horizontal overflow (`scrollWidth === clientWidth`).
4. Interactions: mobile nav toggle, theme toggle persistence (localStorage `theme`),
   metric count-up, scrollspy, reveal-on-scroll.

## Deployment

Static output in `dist/`. Vercel/Netlify/Cloudflare Pages: framework preset "Vite",
build `npm run build`, output `dist`, no env vars. GitHub Pages: set `base` in
`vite.config.js` to `/<repo>/` first. After deploying, set the canonical URL in
`og:url`/JSON-LD (currently omitted — add when the domain exists).

## Known gaps / future work

- No `og:image` yet — generate a 1200×630 card when a domain is chosen.
- RAG + hallucination-detector projects have no public repos; cards intentionally have
  no GitHub links. Add links if Jayant publishes them.
- Résumé PDF is a copy of `Jayant_New.pdf` (Downloads/TEST); replace `public/Jayant_Jha_Resume.pdf`
  when the résumé updates.
