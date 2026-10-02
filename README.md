# Smile Savers Dental — smile-savers-site

![Astro 7.3.1](https://img.shields.io/badge/Astro-7.3.1-FF5D01?logo=astro&logoColor=white)
![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript strict](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![Cloudflare Pages](https://img.shields.io/badge/Cloudflare_Pages-deployed-F6821F?logo=cloudflare&logoColor=white)
![Lighthouse 100](https://img.shields.io/badge/Lighthouse-SEO_100_%7C_a11y_100_%7C_best--practices_100-00C853?logo=lighthouse&logoColor=white)
![Tests 49 passing](https://img.shields.io/badge/tests-49_passing-brightgreen)

![Smile Savers Dental homepage — hero with booking CTA and Google rating](docs/readme/homepage-hero.png)

Static marketing + online-booking site for **Smile Savers Dental**, an affordable family dentistry practice in Woodside, Queens. Astro 7 prerenders 18 pages to flat HTML; React 19 islands handle booking, contact, and gallery interactivity; Cloudflare Pages Functions power form submission via Resend. Live at **https://dentalsmilesavers.com**.

| Practice | Detail |
|---|---|
| Address | 32-02 53rd Pl, Woodside, NY 11377 |
| Phone | (718) 956-8400 (`tel:+17189568400`) |
| Email | dentalsmilesavers@gmail.com |
| Hours | Mon–Thu 10AM–6PM · Fri 9AM–5PM · Sat 9AM–1PM · Sun Closed |
| Rating | 4.5 / 153 Google reviews |
| Track record | 35+ years, 10,000+ patients |

## Features

| Area | What ships |
|---|---|
| Booking | Online appointment form (React island) → `POST /api/contact` (Pages Function + Resend, `RESEND_API_KEY` server env) with `mailtoWith` fallback |
| Contact | Contact form island, same API path; real `<label>`s, live-region feedback |
| Gallery | Filterable gallery grid island with lightbox |
| SEO | Dentist + Organization + BreadcrumbList JSON-LD, 16-URL `sitemap.xml`, AI-search-friendly `robots.txt`, `og:image` (`/images/og-cover.jpg`) |
| Trust | Verified credential strip (AAID, AGD, AO, ADA, ICOI, NYU), Google 4.5/153 badge |
| Motion | Legacy template runtime (jQuery `plugins.js` → `lablaunchpad.js` → `swiper` → `custom-marquee` → `site-init.ts`): WOW reveals, Swiper hero, Owl testimonials, counters, jarallax, accordion |

## Screenshots

Real captures from a production `astro build` + preview (Edge headless, no stock, no placeholders).

**Homepage narrative — hero → contact strip → credentials → about → services:**

![Homepage story: hero, trust bar, about, services](docs/readme/homepage-story.png)

**Mobile hero (390px):**

![Mobile hero](docs/readme/homepage-mobile.png)

**Services page:**

![Services page](docs/readme/services.png)

**Dentists page:**

![Dentists page](docs/readme/dentists.png)

## Quickstart

Prereqs: **Node 22** (`node --version` → v22.x).

```bash
npm ci
npm run dev      # http://localhost:4321 — exactly ONE instance (see warning below)
npm run build    # astro build → flat dist/
npx astro check  # typecheck (stop dev first)
npm run preview  # serve dist/ locally
```

| Script | Purpose |
|---|---|
| `npm run dev` | Dev server on `:4321` |
| `npm run build` / `build:ci` | Production build, plain adapter-less `astro build` → flat `dist/` |
| `npm run check` | `astro check` typecheck (shares `.astro` cache with dev — stop dev first) |
| `npm run preview` | Preview `dist/` locally |
| `npm run preview:cf` | Preview via `wrangler pages dev dist` |

To run the production build on a custom port (as used for the screenshots above): `npx astro preview --port 4333 --host 127.0.0.1`.

## Project structure

```text
src/
  pages/            # 18 routes — index.astro (only homepage), about, services (+6 service pages),
                    # dentists, booking, contact, gallery, testimonials, faq, blog, 404
  components/
    site/           # Header, MainNav (#mainmenu), HeaderActions (#menu-btn/#btn-extra/CTA)
    sections/       # PageHeader (title/crumb/trail), BookingCTA, homepage/service blocks
  layouts/          # Layout.astro — shell, legacy JS load order, SEO/JSON-LD head
  data/practice.ts  # Brand canon (NAP, hours, rating, stats) — single source of truth
  scripts/site-init.ts  # Motion glue; guards on window.jQuery, never remove .off() rebinds
functions/api/      # Pages Functions: contact.js (Resend), chat.js
public/             # Served as-is: css/, images/ (logo.svg/logo-white.svg, team/, og-cover.jpg),
                    # sitemap.xml (16 URLs), robots.txt
tests/site.test.mjs # 49-test node suite — the suite
.github/workflows/  # deploy.yml (Pages), security.yml
docs/readme/        # README screenshots (gitignore exception)
```

Legacy JS load order in `Layout.astro` is load-bearing — `plugins.js` → `lablaunchpad.js` → `swiper.js` → `custom-marquee.js` → `site-init.ts`. Nav/accordion selectors (`.accordion-section-title`, `data-tab`, `#mainmenu`, `.active`) are bound in both `site-init.ts` and `lablaunchpad.js`; element swaps must preserve class + data attributes byte-identical.

## Testing

```bash
node --test tests/site.test.mjs   # 49-test suite — must stay GREEN
```

Plus, at milestones: Edge headless screenshots of the edited surface (open the PNG and look before claiming visual state; tall pages fail — use ≤3600px windows), and `npx astro check` with dev stopped.

## Deployment

Cloudflare Pages via `.github/workflows/deploy.yml` — project **`smile-savers`**, plain `astro build` → `dist/` directory. Pipeline: type-check → build → deploy production on `main` (preview deploys + PR comments on pull requests) → post-deploy Lighthouse audit. `wrangler.jsonc` is not used by CI.

## SEO / performance highlights

| Metric | Value |
|---|---|
| Lighthouse | SEO 100 / Accessibility 100 / Best-practices 100 |
| Images | 10.3 MB → 2.6 MB (−74%) |
| Structured data | Dentist, Organization, BreadcrumbList JSON-LD |
| Sitemap | 16 URLs |
| Robots | Allows AI-search crawlers (OAI-SearchBot, ChatGPT-User, Claude, Perplexity) |
| Suite | 49 tests, green |

## ⚠️ Dev-server discipline

- **ONE `npm run dev` at a time.** Multiple instances corrupt `node_modules/.vite`.
- **NEVER `npm run build` while dev runs** (file-watcher race → `deps_ssr` corruption).
- Recovery: `taskkill /F /IM node.exe` → `Remove-Item -Recurse -Force node_modules/.vite` → launch ONE instance → wait ~75 s → expect 200.

## Contributing

`main`-only unless the owner approves a branch. Conventional commits (`feat/fix/a11y(scope): …`). New/edited markup must meet the accessibility floor: real `<label for>` on every field, native `<button>` for toggles, `aria-label` on icon-only links, `aria-hidden="true"` on decorative icons, live regions on form feedback, unskipped heading order. Never invent stats, testimonials, or prices — `src/data/practice.ts` is canon.
