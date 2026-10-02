# SEO/Perf PROD Baseline — 2026-10-02

PROD build served via `npx astro preview --port 4333`. Lighthouse (Edge, `--no-sandbox`), default mobile emulation, categories: performance, seo, accessibility, best-practices. Raw JSON: `C:\Users\pithu\AppData\Local\Temp\opencode\lh-prod-<home|services-orthodontics|gallery>-mobile.json`. Screenshots: `base-home-1440.png`, `base-home-390.png` (same temp dir).

| Page | Perf | SEO | A11y | Best-pract. | LCP | TBT | CLS | Weight |
|---|---|---|---|---|---|---|---|---|
| `/` | 0.38 | 0.92 | 0.95 | 1.00 | 20.1 s | 1,260 ms | 0.097 | 4,281 KiB |
| `/services/orthodontics` | 0.53 | 0.92 | 0.86 | 1.00 | 6.8 s | 550 ms | 0 | 1,834 KiB |
| `/gallery` | 0.41 | 0.92 | 0.95 | 1.00 | 9.8 s | 890 ms | 0.048 | 3,797 KiB |

Desktop (`--preset=desktop`), same PROD preview :4333 + Edge `--no-sandbox`. Raw JSON: `C:\Users\pithu\AppData\Local\Temp\opencode\lh-prod-<home|services-orthodontics|gallery>-desktop.json`.

| Page | Perf | SEO | A11y | Best-pract. | LCP | TBT | CLS | Weight |
|---|---|---|---|---|---|---|---|---|
| `/` | 0.67 | 0.92 | 0.95 | 1.00 | 3.4 s | 232 ms | 0.063 | 4,279 KiB |
| `/services/orthodontics` | 0.92 | 0.92 | 0.86 | 1.00 | 1.4 s | 99 ms | 0.004 | 1,831 KiB |
| `/gallery` | 0.55 | 0.92 | 0.95 | 1.00 | 2.7 s | 596 ms | 0.000 | 3,794 KiB |
