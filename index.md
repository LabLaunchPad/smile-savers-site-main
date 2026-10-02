# index.md — Repo map (read this before exploring)

> Token rule: resolve location here FIRST, then grep, then read the smallest range that answers the question.

## Read tiers (cheapest first)
- T0 — `AGENTS.md` (rules), this file (locations), `package.json` (scripts), `astro.config.mjs` (output mode)
- T1 — `src/layouts/Layout.astro` (shell: CSS/JS load, header/footer/overlay) · `src/scripts/site-init.ts` (all client motion) · `src/types/globals.d.ts` (legacy window surface)
- T2 — page under edit (`src/pages/…`) + its components (`src/components/…`)
- T3 — `public/css/style.css` (12k+ lines: spacing §7553, motion §6842, header §247) — grep selectors, never full-read
- T4 — `public/js/{plugins,on3step,swiper,custom-marquee}.js` (minified vendor) — `Select-String` for hook names only

## File roles
| Path | Role | Touch? |
|---|---|---|
| `src/pages/index.astro` | Homepage (canonical) | yes — copy/sections |
| `src/pages/about|contact|booking.astro` | Prefilled brand pages | yes — copy/NAP |
| `src/pages/services[6]|dentists|testimonials|faq|gallery|blog*.astro` | Template copy, fictional content | only if asked |
| `src/pages/homepage-6.astro` | Deleted variant (see AGENTS.md §2); `index.astro` is the only homepage | no |
| `src/components/Header|Footer|Preloader.astro` | Chrome (NAP lives here) | yes — text only |
| `src/components/BookingForm|ContactForm|GalleryGrid.tsx` | React islands | forms: labels/roles only; gallery: owner-asked only |
| `src/styles/globals.css` | Light-only base tokens + menu fixes | tokens: no dark mode ever |
| `public/css/colors/scheme-01.css` | Brand color scheme | only for retheme |
| `public/images/logo.svg|logo-white.svg|favicon.svg` | Brand marks | replace whole file, keep names |
| `public/images/team/bhagat.webp` | Only real photo | keep aspect ~20:27 |
| `wrangler.jsonc` / `.dev.vars` / dashboard | Deploy config / local secrets / prod secrets | config only |

## Grep-first patterns (PowerShell)
- Stale placeholders: `123 456 789|100 S Main|dentiacare|dentiaclinic|23k|Sarah Bennett`
- Motion hooks: `swiper|owl-|magnific|popup-|de-marquee|accordion|timer|jarallax|wow`
- A11y surface: `<div.*onClick|href="#"|<input.*placeholder|alt=""`
- NAP drift: `956-8400|53rd Pl|dentalsmilesavers|10AM|153 Google`

## Verification shortcuts
- Dev DOM: `(Invoke-WebRequest http://localhost:4321/<route> -UseBasicParsing).Content | Select-String <pattern>`
- Motion present: check hook classes in DOM (§3 AGENTS.md), not JS execution
- Visual: Edge headless PNG, then `read` the PNG — one screenshot beats ten greps
- Never: `npm run build` with dev up · multiple dev instances · `start /min`
