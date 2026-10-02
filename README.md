# Smile Savers Dental — smile-savers-site

Astro 7 static site for Smile Savers Dental, Woodside, Queens NY. Live at https://dentalsmilesavers.com.

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Dev server :4321, exactly ONE instance |
| `npm run build` / `build:ci` | Prod build (astro build → flat dist/). Stop dev first |
| `npm run check` | Typecheck (astro check). Stop dev first |
| `npm run preview` | Local preview (astro preview) |
| `npm run preview:cf` | Preview via wrangler pages dev dist |

Never run build while dev runs. Recovery: kill node.exe, delete node_modules/.vite, restart once.

## Architecture

output static, no adapter. src/pages (.astro, prerendered; homepage index.astro), src/components (.astro chrome + .tsx islands: booking/contact forms, gallery), src/layouts/Layout.astro shell, src/scripts/site-init.ts motion glue, public/ served as-is. Pages Functions in functions/ serve /api/*.

## Deploy

Cloudflare Pages via .github/workflows/deploy.yml (project smile-savers, directory dist). Stop dev, build, CI deploys. wrangler.jsonc (Workers Static Assets shape) is not used by CI.

## Contact

Smile Savers Dental, 32-02 53rd Pl, Woodside, NY 11377, (718) 956-8400, dentalsmilesavers@gmail.com. Hours: Mon–Thu 10AM–6PM · Fri 9AM–5PM · Sat 9AM–1PM · Sun Closed.
