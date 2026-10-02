# Dentia Astro — Smile Savers Dental website

Astro 7 site for **Smile Savers Dental** (Woodside, Queens NY), deployed to Cloudflare Workers.
Template origin: Dentia dental-clinic theme, progressively prefilled with real brand content.

## Quickstart

```bash
npm install
npm run dev        # http://localhost:4321 — keep exactly ONE instance running
```

> ⚠️ Never run `npm run build` while the dev server is up (corrupts the Vite cache).
> If the dev server breaks: kill all `node.exe`, delete `node_modules/.vite`, restart once.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` | Production build (stop dev first) |
| `npx astro check` | Typecheck (stop dev first) |
| `npm run preview` | Preview the build |
| `npm run deploy` | Build + deploy to Cloudflare Workers |
| `npm run cf-typegen` | Generate Worker types |

## Structure

- `src/pages/` — one `.astro` file per route (all prerendered static). Homepage: `index.astro`
- `src/components/` — layout chrome (`.astro`) + interactive islands (`.tsx`: booking/contact forms, gallery)
- `src/layouts/Layout.astro` — shared shell: CSS/JS includes, header, footer, scripts
- `src/scripts/site-init.ts` — client-side motion glue (sliders, carousels, accordions, menus)
- `public/` — served as-is: legacy CSS/JS, images, fonts
- `wrangler.jsonc` — Cloudflare Workers config

## Brand

Live content source: [dentalsmilesavers.com](https://dentalsmilesavers.com/).
Canonical NAP/hours live in footers, headers, and contact/booking pages — keep them in sync:
**32-02 53rd Pl, Woodside, NY 11377 · (718) 956-8400 ·
Mon–Thu 10–6, Fri 9–5, Sat 9–1, Sun closed.**

## Agent instructions

Machine-readable contributor rules: see [AGENTS.md](./AGENTS.md) (repo map: [index.md](./index.md)).
Key rules: text-only edits unless asked, no visual/motion regressions, verify against the live dev server.
