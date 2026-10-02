# Full Lighthouse + Image SEO + On-Page/Technical SEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring dentalsmilesavers.com to Lighthouse ≥90 (perf/SEO/a11y/best-practices, mobile + desktop, PROD build), compress the 10.6 MB image payload, and close every on-page + technical SEO gap per Google's 2026 guidance — with zero visual regressions and every change TDD-pinned in `tests/site.test.mjs`.

**Architecture:** Four independent tracks (baseline/perf, images, on-page, technical) executed by parallel subagents against the same static Astro 7 site. All checks are static asserts in the existing 37-test node suite plus prod Lighthouse runs and Edge headless screenshots. No new runtime dependencies; one-shot tooling only (`npx sharp`, `npx lighthouse`).

**Tech Stack:** Astro 7.3.1 static (`output:'static'`, no adapter), React 19 islands, Node 22 (`node --test`), Lighthouse 13.5.0, Edge headless screenshots, Cloudflare Pages deploy via `.github/workflows/deploy.yml`.

**Spec:** Owner request 2026-10-02 — "Full google lighthouse audit, report, investigation, root causes, and all fixes with verifications, ensure no visual regressions. And do full image SEO, optimizations. Also do full On page SEO, technical SEO, website full SEO systematically via sub agents, test driven. Also do Google SEO latest best practices that we can implement on our website via web research." Research completed: Involve Digital Technical SEO Guide 2026 (checked Sept 2026) + Feb 2026 core update analysis. Decisive 2026 facts baked into tasks: FAQ/HowTo/sitelinks-searchbox rich results are GONE (no FAQPage markup); structured data is NOT a ranking factor and NOT needed for AI features; keep Organization + Dentist(LocalBusiness) + WebSite(site name) + BreadcrumbList; self-review stars are NOT eligible (omit aggregateRating); Google ignores llms.txt (SKIPPED, noted in Task D4); allow AI search agents in robots, training crawlers = owner call; CWV good = LCP ≤2.5s / INP ≤200ms / CLS ≤0.1 at p75; sitemap = absolute canonical 200 URLs only, Google ignores priority/changefreq.

## Global Constraints

- ONE `npm run dev` (:4321) at a time; NEVER `npm run build` while dev runs — recovery is `taskkill /F /IM node.exe` → delete `node_modules/.vite` → one instance → wait ~75s.
- Dev Lighthouse numbers are MEANINGLESS (unminified dev JS/CSS); every perf claim must be measured on a PROD build served via `npm run preview` (or `wrangler pages dev dist`) after stopping dev.
- Legacy runtime frozen: script order `plugins.js → lablaunchpad.js → swiper.js → custom-marquee.js → site-init.ts`; selectors `#mainmenu #menu-btn #btn-extra #extra-wrap #btn-close .active #mainmenu li > span data-tab` byte-identical; never remove `.off()` in `site-init.ts`; never `role=menubar`; never touch `public/css/style.css` hover rules for nav (additive overrides in `src/styles/globals.css` only).
- Brand canon VERBATIM: `Smile Savers Dental`, `32-02 53rd Pl, Woodside, NY 11377`, `(718) 956-8400` / `tel:+17189568400`, `dentalsmilesavers@gmail.com`, hours `Mon–Thu 10AM–6PM · Fri 9AM–5PM · Sat 9AM–1PM · Sun Closed`, rating `4.5` / `153 Google reviews`, roster Bhagat DDS Lead (NOT founder) · Islam DMD · Li DDS · Avendaño DDS. NEVER ship 5.0/200+, 23k, 98%.
- `main` only; conventional commits (`perf(seo): …`, `feat(seo): …`, `fix(a11y): …`); never commit `dist/ .astro/ node_modules/ .wrangler/`; no new entries in `package.json dependencies`.
- New/edited markup MUST meet the a11y floor: real labels, native buttons, aria on icon-only controls, unskipped heading order.
- TDD iron law: no production edit without a failing test first in `tests/site.test.mjs`; watch it fail; minimal fix; full suite GREEN (`node --test tests/site.test.mjs`, currently 37 tests); `npx astro check` at milestones (stop dev first).

---

## Baseline evidence (measured 2026-10-02, do NOT re-derive — verify against PROD in Task 0)

- Dev Lighthouse `/`: perf **0.27** (FCP 11.9s, LCP 39.9s, TBT 1420ms, SI 17s, TTI 40.4s), a11y 0.95, best-practices 1.0, SEO 0.92. Total payload 7,479 KiB. Failing: `unused-javascript` 641 KiB / `unused-css-rules` 751 KiB (mostly dev-mode artifacts), `unminified-javascript` 1.3 MB (dev artifact), `render-blocking-insight` 4,490 ms (5 head stylesheets), `link-text` (2 links), `color-contrast`, `heading-order`, `label-content-name-mismatch`, `unsized-images`, `font-display-insight` 270 ms, `image-delivery-insight` 52 KiB, `lcp-discovery-insight`, `valid-source-maps`.
- Images: 10.6 MB in `public/images/`; worst: `slider/1.jpg` 485.8 KB, `background/4.webp` 477.3 KB, `misc/l4.webp` 427.4 KB, `slider/2.jpg` 420.7 KB; ~25 files 200–350 KB. All content `<img>` carry `alt=""` (empty). Hero slides are CSS `background-image`. No `width`/`height` on content imgs (`w-100` class) → CLS 0.098.
- SEO infra present: absolute self-referencing canonical ✓, meta description + OG basics ✓, `public/robots.txt` (`Allow: /` + sitemap) ✓, `public/sitemap.xml` 17 absolute URLs ✓, `_headers` caching/security ✓. MISSING: `og:image` (ponytail comment at `Layout.astro:40`), ALL JSON-LD, font `font-display` (zero occurrences in `public/css`), image dims/lazy, AI-crawler robots groups, unique per-page titles audit.
- Dead weight: `public/fonts/` ships full vendor source trees (icofont `demo.html` 352 KB, `icofont.woff` 630 KB duplicate of 525 KB woff2, FA4 + FA6 full sets incl. `.eot/.svg/.ttf/.less/.scss` sources).
- H1: `index.astro:25` has the only top-level `<h1>`; all other pages get `<h1>` via `PageHeader.astro:23` — verify each page passes `title` (blog/single is the deliberate exception).
- Default Layout description still says "gentle, pain-free family dentistry" — stale vs the shipped "Affordable" eyebrow.

---

### Task 0: PROD baseline harness (do FIRST — all tracks depend on it)

**Files:**
- Create: `docs/superpowers/plans/seo-baseline-2026-10-02.md` (results table only)
- Modify: none

**Interfaces:**
- Consumes: nothing (reads PROD build only)
- Produces: `C:\Users\pithu\AppData\Local\Temp\opencode\lh-prod-<page>.json` + baseline table every later task diffs against

- [ ] **Step 1: Stop dev, build PROD, serve preview**
```powershell
taskkill /F /IM node.exe; Remove-Item -Recurse -Force node_modules/.vite -ErrorAction SilentlyContinue
npm run build
Start-Process cmd.exe '/c npx astro preview --port 4333 > C:\Users\pithu\AppData\Local\Temp\opencode\preview.log 2>&1' -WindowStyle Hidden
Start-Sleep -Seconds 10
Invoke-WebRequest -Uri http://localhost:4333/ -UseBasicParsing | Select-Object StatusCode
```
Expected: `200`. (Port 4333 avoids the :4321 dev habit; never run dev and build together.)
- [ ] **Step 2: Lighthouse mobile + desktop on `/`, slowest service page, `/gallery` (heaviest images)**
```powershell
$env:CHROME_PATH = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
$pages = @('', 'services/orthodontics', 'gallery')
foreach ($p in $pages) {
  $slug = ($p -replace '/', '-'); if (!$slug) { $slug = 'home' }
  npx --yes lighthouse "http://localhost:4333/$p" --output=json --output-path="C:\Users\pithu\AppData\Local\Temp\opencode\lh-prod-$slug-mobile.json" --only-categories=performance,seo,accessibility,best-practices --chrome-flags='--no-sandbox' --quiet
}
```
Expected: three JSON files. Then record in the baseline doc:
```powershell
node -e "const d=require('C:/Users/pithu/AppData/Local/Temp/opencode/lh-prod-home-mobile.json'); for (const [k,v] of Object.entries(d.categories)) console.log(k, v.score); console.log('LCP', d.audits['largest-contentful-paint'].displayValue, 'TBT', d.audits['total-blocking-time'].displayValue, 'CLS', d.audits['cumulative-layout-shift'].displayValue, 'weight', d.audits['total-byte-weight'].displayValue)"
```
- [ ] **Step 3: Baseline screenshots (no-regression reference)**
```powershell
& 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe' --headless --screenshot=C:\Users\pithu\AppData\Local\Temp\opencode\base-home-1440.png --window-size=1440,2400 --virtual-time-budget=15000 http://localhost:4333/
& 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe' --headless --screenshot=C:\Users\pithu\AppData\Local\Temp\opencode\base-home-390.png --window-size=390,2400 --virtual-time-budget=15000 http://localhost:4333/
```
Expected: two PNGs; open and LOOK at them before claiming a baseline.
- [ ] **Step 4: Commit baseline doc**
```bash
git add docs/superpowers/plans/seo-baseline-2026-10-02.md
git commit -m "docs(seo): prod lighthouse baseline before optimization"
```

---

### Task 1 (Track A — perf): font-display:swap + preload critical fonts

**Files:**
- Modify: `src/styles/globals.css` (append override block), `src/layouts/Layout.astro:45-49` (add preloads)
- Test: `tests/site.test.mjs` (append)

**Interfaces:**
- Consumes: Task 0 baseline (`font-display-insight` savings value)
- Produces: zero `font-display` failures in prod Lighthouse; no visual change (screenshot diff)

- [ ] **Step 1: Write the failing test**
```js
test('fonts: swap display + preloaded woff2 (no invisible text)', () => {
  const css = src('src/styles/globals.css');
  assert.ok(css.includes('font-display'), 'globals.css must redeclare font-display');
  assert.ok(!css.includes('font-display: block'), 'must not use block (invisible text)');
  const layout = src('src/layouts/Layout.astro');
  assert.ok(layout.includes('rel="preload"') && layout.includes('.woff2'), 'critical woff2 must be preloaded');
});
```
Run: `node --test tests/site.test.mjs` — Expected: FAIL (`font-display` absent from globals.css).
- [ ] **Step 2: Verify which @font-face rules ship (do not guess)** — in the PROD HTML / `public/css/plugins.css`, find the `font-family` names for icofont + fontawesome + Inter/Plus-Jakarta, then append to `globals.css`:
```css
/* perf: icon/body fonts swap — later @font-face wins, vendor css untouched */
@font-face { font-family: 'IcoFont'; font-display: swap; src: url('/fonts/icofont/icofont.woff2') format('woff2'); }
```
(Use the EXACT family names + woff2 paths found; one block per family. If a family has no woff2, point at its woff.) Preload the two used above-the-fold in `Layout.astro` head:
```astro
<link rel="preload" href="/fonts/icofont/icofont.woff2" as="font" type="font/woff2" crossorigin />
```
- [ ] **Step 3: Run suite** — Expected: GREEN 38/38. Re-run prod Lighthouse home (Task 0 Step 2 single page); `font-display-insight` must be gone/0 ms.
- [ ] **Step 4: Commit** `git commit -m "perf(fonts): swap display + preload critical woff2"`

---

### Task 2 (Track A — perf): preload hero LCP image + fetchpriority

**Files:**
- Modify: `src/layouts/Layout.astro` (head), `src/pages/index.astro:89` (slide 1)
- Test: `tests/site.test.mjs`

**Interfaces:**
- Consumes: Task 0 (`lcp-discovery-insight` + LCP element identity)
- Produces: LCP image discovered in `<head>`, lower prod LCP

- [ ] **Step 1: Write the failing test**
```js
test('hero LCP image is preloaded (lcp-discovery)', () => {
  const layout = src('src/layouts/Layout.astro');
  assert.ok(layout.includes('as="image"') && layout.includes('slider/1.jpg'), 'slide 1 must be preloaded as image');
});
```
Run suite — Expected: FAIL.
- [ ] **Step 2: Minimal implementation** — in `Layout.astro` head add:
```astro
<link rel="preload" as="image" href="/images/slider/1.jpg" fetchpriority="high" />
```
Scope guard: Layout is sitewide; slide 1 only exists on `/`. A sitewide preload on non-home pages wastes bytes — restrict by opting the preload behind `Astro.url.pathname === '/'`:
```astro
{Astro.url.pathname === '/' && <link rel="preload" as="image" href="/images/slider/1.jpg" fetchpriority="high" />}
```
- [ ] **Step 3: Run suite** — Expected GREEN. Prod Lighthouse home: record new LCP vs baseline.
- [ ] **Step 4: Commit** `git commit -m "perf(hero): preload slide-1 LCP image on homepage"`

---

### Task 3 (Track A — perf): purge dead font-vendor trees from `public/fonts/`

**Files:**
- Delete (verify zero references FIRST): `public/fonts/elegant_font/` demo+`index.html`, `public/fonts/fontawesome4/` sources (keep used woff2/woff only), `public/fonts/fontawesome6/` non-woff2 + unused weights, `public/fonts/icofont/demo.html`, `icofont.woff` (dup of woff2), `icofont.eot/.svg/.ttf` if unreferenced
- Test: `tests/site.test.mjs`

**Interfaces:**
- Consumes: none
- Produces: smaller `dist/` + faster deploy; byte-identical rendering

- [ ] **Step 1: Write the failing test**
```js
test('no dead font-vendor weight ships (demo/sources/dups)', () => {
  for (const dead of ['public/fonts/icofont/demo.html', 'public/fonts/elegant_font/index.html']) {
    assert.ok(!existsSync(dead), `${dead} must not ship`);
  }
  const layout = src('src/layouts/Layout.astro');
  assert.ok(!layout.includes('fontawesome4'), 'no FA4 references may remain');
});
```
Run — Expected: FAIL (demo files exist).
- [ ] **Step 2: Reference-check then delete.** For EACH candidate file, grep `src/ public/css/ public/js/` for its basename; delete ONLY zero-hit files (use `Remove-Item`, never `git rm` on untracked — these are tracked, so `git rm`). Confirm `icofont.woff2`, FA6 `fa-brands-400.woff2` + used weights stay.
- [ ] **Step 3: Full gates** — `node --test` GREEN + `npm run build` succeeds + homepage Edge screenshot matches baseline (open both PNGs, LOOK).
- [ ] **Step 4: Commit** `git commit -m "perf(fonts): drop dead vendor trees and dup formats"`

---

### Task 4 (Track B — images): compress all raster payloads in place (one-shot, no new dep)

**Files:**
- Modify (binary): `public/images/**/*.webp` + `slider/*.jpg` + `logo/*.png` + `icons/*.png` (in place, same paths/names)
- Test: `tests/site.test.mjs` (size-budget guard)

**Interfaces:**
- Consumes: Task 0 total-byte-weight
- Produces: ≥40% image-byte reduction, byte-identical paths, no visual delta at 200% zoom on the 4 worst files

- [ ] **Step 1: Write the failing test**
```js
test('image payload budget (10.6MB baseline)', () => {
  const { execSync } = require('node:child_process');
  const kb = Number(execSync('powershell -NoProfile -Command "(Get-ChildItem public/images -Recurse -File | Measure-Object Length -Sum).Sum / 1KB"').toString().trim());
  assert.ok(kb < 6500, `images must stay under 6.5MB, now ${Math.round(kb)}KB`);
  for (const big of ['public/images/slider/1.jpg', 'public/images/background/4.webp', 'public/images/misc/l4.webp', 'public/images/slider/2.jpg']) {
    assert.ok(existsSync(big), `${big} path must survive compression`);
  }
});
```
Run — Expected: FAIL (`~10300KB > 6500KB`).
- [ ] **Step 2: One-shot compress script in TEMP (never committed, sharp NOT added to package.json)**
```powershell
node -e "
const sharp = require('sharp');" # if sharp missing: npm install --no-save sharp (temp only, reverted after)
```
Conversion rules (exact): `.webp` → `webp({quality:78, effort:6})`; `slider/*.jpg` → `jpeg({quality:76, mozjpeg:true})` keep `.jpg` names (CSS refs unchanged); `logo/*.png icons/*.png ui/*.png` → `png({compressionLevel:9, palette:true})`. Skip `team/*.webp` below 170 KB (already lean) unless savings >15%. Back up `public/images` to temp first; after conversion, open before/after of `slider/1.jpg` + `background/4.webp` at 200% and LOOK — any artifacting = raise quality 5 points and redo that file.
- [ ] **Step 3: Run suite** — Expected GREEN (budget passes, paths intact). Revert the temp sharp install: `git checkout package.json package-lock.json` if touched (verify with `git status --short`).
- [ ] **Step 4: Commit binaries** `git commit -m "perf(images): recompress payload in place, same paths"`

---

### Task 5 (Track B — image SEO): dims + lazy + decoding on every content image; descriptive alts where informative

**Files:**
- Modify: `src/pages/index.astro`, `about.astro`, `services*.astro`, `dentists.astro`, `blog.astro`, `blog/single.astro`, `src/components/GalleryGrid.tsx` (12 items), trust-bar `index.astro:151`
- Test: `tests/site.test.mjs`

**Interfaces:**
- Consumes: Task 4 (final files)
- Produces: zero unsized-images in prod Lighthouse; informative images have real alts; decorative keep `alt=""`

- [ ] **Step 1: Write the failing test**
```js
test('content images sized + lazy (no CLS), informative alts', () => {
  const pages = ['src/pages/index.astro', 'src/pages/about.astro', 'src/pages/dentists.astro', 'src/pages/blog.astro'];
  for (const f of pages) {
    const imgs = [...src(f).matchAll(/<img[^>]*>/g)].map((m) => m[0]);
    for (const img of imgs) {
      if (img.includes('testimonial/') || img.includes('logo/')) continue; // decorative, keep alt=""
      assert.ok(/width=/.test(img) && /height=/.test(img), `${f}: unsized ${img.slice(0, 60)}`);
      assert.ok(img.includes('loading="lazy"') || img.includes('fetchpriority'), `${f}: eager ${img.slice(0, 60)}`);
    }
  }
  assert.ok(src('src/pages/about.astro').includes('alt="Dr. Deepak Bhagat'), 'team lead photo needs descriptive alt');
});
```
Run — Expected: FAIL (no width/height anywhere).
- [ ] **Step 2: Minimal edits.** Above-the-fold (hero-adjacent `misc/p1.webp`, `p2.webp` on home): add `width`+`height` (read real dims via `identify`/sharp metadata — do NOT guess) + `fetchpriority="high"`, NO lazy. Everything below fold: real `width`+`height` + `loading="lazy" decoding="async"`. Alts: team photos `alt="Dr. <Name>, <Role> at Smile Savers Dental, Woodside NY"`; service/about photos describe the VISIBLE scene in ≤10 words (open each image and LOOK — never invent: if unsure what it shows, use `alt="Dental care at Smile Savers Dental, Woodside NY"`); testimonial avatars + trust logos + check/arrow icons stay `alt=""` (decorative, already `aria-hidden` where icon-only). GalleryGrid.tsx: add `loading="lazy"` + dims + `alt={caption || 'Dental treatment result photo'}` per item (captions are STILL FICTIONAL per canon — generic alt, never fake specifics).
- [ ] **Step 3: Suite GREEN + prod Lighthouse `unsized-images` passes + CLS ≤0.1; screenshot home/about/gallery vs baseline (LOOK).**
- [ ] **Step 4: Commit** `git commit -m "feat(a11y): sized lazy images with descriptive alts"`

---

### Task 6 (Track C — on-page): unique titles + descriptions per page, stale default fixed

**Files:**
- Modify: `src/layouts/Layout.astro:16-17` (defaults), each page's `<Layout title= description=` props (18 routes)
- Test: `tests/site.test.mjs`

**Interfaces:**
- Consumes: practice canon (phone/hours/NAP)
- Produces: 18 unique titles (≤60 chars, `keyword + Woodside/Queens + brand` pattern) + 18 unique descriptions (120–155 chars, NAP-consistent, "affordable" not "pain-free")

- [ ] **Step 1: Write the failing test**
```js
test('every route has unique SEO title + description (no stale pain-free default)', () => {
  const layout = src('src/layouts/Layout.astro');
  assert.ok(!layout.includes('pain-free family dentistry'), 'default description must drop pain-free');
  assert.ok(layout.includes('Affordable') || layout.includes('affordable'), 'default must match Affordable positioning');
  const titles = new Set();
  const pages = ['src/pages/index.astro', 'src/pages/about.astro', 'src/pages/services.astro', 'src/pages/contact.astro', 'src/pages/booking.astro', 'src/pages/dentists.astro', 'src/pages/blog.astro', 'src/pages/faq.astro', 'src/pages/gallery.astro', 'src/pages/testimonials.astro', 'src/pages/blog/single.astro', 'src/pages/services/general-dentistry.astro', 'src/pages/services/cosmetic-dentistry.astro', 'src/pages/services/pediatric-dentistry.astro', 'src/pages/services/restorative-dentistry.astro', 'src/pages/services/preventive-dentistry.astro', 'src/pages/services/orthodontics.astro'];
  for (const f of pages) {
    const m = src(f).match(/title="([^"]+)"/);
    assert.ok(m, `${f} must pass title`);
    assert.ok(!titles.has(m[1]), `duplicate title: ${m[1]}`);
    titles.add(m[1]);
    assert.ok(m[1].length <= 60, `${f} title >60 chars`);
  }
});
```
Run — Expected: FAIL (stale default contains pain-free; several pages likely share defaults).
- [ ] **Step 2: Implement.** Title pattern: `<Service/Topic> Dentist in Woodside, Queens | Smile Savers Dental` (trim to ≤60: e.g. `Orthodontist in Woodside, Queens | Smile Savers Dental` = 59). Descriptions 120–155 chars, each unique, each containing phone OR address + one differentiator (same-day, languages blanket line, 35+ years). Homepage keeps current title if already unique.
- [ ] **Step 3: Suite GREEN; spot-check rendered `<title>` on 3 pages via dev-fetch.**
- [ ] **Step 4: Commit** `git commit -m "feat(seo): unique titles + descriptions, affordable default"`

---

### Task 7 (Track C — on-page): og:image 1200×630 + twitter large card

**Files:**
- Create: `public/images/og-cover.jpg` (1200×630, generated from `logo.svg` on brand wheat `#F5C97B`-ish hero bg — sample exact hex from `scheme-01.css`)
- Modify: `src/layouts/Layout.astro:40-41`
- Test: `tests/site.test.mjs`

**Interfaces:**
- Consumes: brand blues `#0782BA/#11B7E5`, logo.svg
- Produces: scrapers resolve a real image (SVG logos are ignored by scrapers)

- [ ] **Step 1: Failing test**
```js
test('social share image is a real raster (not SVG)', () => {
  const layout = src('src/layouts/Layout.astro');
  assert.ok(layout.includes('og:image'), 'og:image missing');
  assert.ok(!layout.match(/og:image[^>]*\.svg/), 'og:image must not be SVG');
  assert.ok(existsSync('public/images/og-cover.jpg'), 'og-cover.jpg must exist');
  assert.ok(layout.includes('summary_large_image'), 'twitter card must be large');
});
```
Run — Expected FAIL.
- [ ] **Step 2: Generate** with temp sharp: 1200×630 canvas in hero bg color, centered white logo resized to ~900px wide + tagline text? NO text rendering via sharp is ugly — logo-only centered on brand bg, ≤200 KB jpeg q82. Wire:
```astro
<meta property="og:image" content={new URL('/images/og-cover.jpg', Astro.site ?? 'https://dentalsmilesavers.com').href} />
<meta name="twitter:card" content="summary_large_image" />
```
Delete the ponytail comment at line 40 (done, resolved).
- [ ] **Step 3: Suite GREEN; verify file dims with sharp metadata (1200×630 exactly).**
- [ ] **Step 4: Commit** `git commit -m "feat(seo): og-cover raster + large twitter card"`

---

### Task 8 (Track C — on-page): JSON-LD — Dentist + Organization/WebSite sitewide + BreadcrumbList

**Files:**
- Modify: `src/layouts/Layout.astro` (Organization + WebSite with `alternateName`, sitewide), `src/pages/index.astro` (Dentist), `src/components/sections/shared/PageHeader.astro` (BreadcrumbList from existing `trail` prop)
- Test: `tests/site.test.mjs`

**Interfaces:**
- Consumes: NAP canon, hours, GBP share URL (NOT reviews — self-stars ineligible)
- Produces: valid JSON-LD per Google Rich Results Test rules (visible-content only, no aggregateRating, no FAQPage)

- [ ] **Step 1: Failing test**
```js
test('structured data: Dentist home + Organization/WebSite sitewide + breadcrumbs', () => {
  assert.ok(src('src/layouts/Layout.astro').includes('application/ld+json'), 'layout needs sitewide schema');
  const home = src('src/pages/index.astro');
  assert.ok(home.includes('"@type":"Dentist"') || home.includes('"@type": "Dentist"'), 'home needs Dentist schema');
  assert.ok(!home.includes('aggregateRating'), 'self-review stars are ineligible — must be absent');
  assert.ok(!src('src/layouts/Layout.astro').includes('FAQPage'), 'FAQ rich results are gone — no FAQPage');
  const header = src('src/components/sections/shared/PageHeader.astro');
  assert.ok(header.includes('BreadcrumbList'), 'PageHeader trail must emit BreadcrumbList');
});
```
Run — Expected FAIL (zero ld+json today).
- [ ] **Step 2: Implement.** Dentist block (homepage only): name, `image` og-cover URL, `telephone: +17189568400`, `address` (PostalAddress Woodside NY 11377), `openingHoursSpecification` Mon–Thu 10:00-18:00 / Fri 09:00-17:00 / Sat 09:00-13:00, `priceRange: $$`, `sameAs` GBP share URL. Organization+WebSite (Layout): name, logo absolute URL, `sameAs` [GBP] (socials are `#` placeholders — NEVER emit `#` in schema; omit until TODO_OWNER resolved). BreadcrumbList in PageHeader from existing `trail` (skip when trail empty). Validate JSON with `node -e "JSON.parse(...)"` on the extracted block.
- [ ] **Step 3: Suite GREEN + `npx astro check` (stop dev first) + validate at Rich Results Test URLs post-deploy.**
- [ ] **Step 4: Commit** `git commit -m "feat(seo): Dentist + Organization + BreadcrumbList JSON-LD"`

---

### Task 9 (Track C — on-page/a11y): fix Lighthouse `link-text`, `heading-order`, `color-contrast`, `label-content-name-mismatch`

**Files:** TBD by Task 0 prod DOM (candidates: `#back-to-top`, social `href="#"`, skipped `h2→h4` in widgets, muted `.op-` text on wheat)
- Test: `tests/site.test.mjs`

- [ ] **Step 1: Identify (no guessing).** From prod JSON: `node -e` print `d.audits['link-text'].details.items`, same for `heading-order`, `color-contrast`, `label-content-name-mismatch` — exact selectors. Failing test asserts each fixed state, e.g.:
```js
test('lighthouse naming/contrast gates', () => {
  const layout = src('src/layouts/Layout.astro');
  assert.ok(!layout.includes('href="#"') || layout.includes('aria-label'), 'placeholder links need names');
});
```
(Shape the asserts to the EXACT items found; run to see FAIL.)
- [ ] **Step 2: Minimal fixes** — name the 2 links (aria-label or visible text), repair skipped heading levels WITHOUT changing visual size (keep classes, change tag), lift contrast pairs to 4.5:1 via `globals.css` additive overrides (never style.css hover rules).
- [ ] **Step 3: Prod Lighthouse: the four audits GREEN + screenshot pages vs baseline (LOOK).**
- [ ] **Step 4: Commit** `git commit -m "fix(a11y): lighthouse naming, heading order, contrast"`

---

### Task 10 (Track D — technical): sitemap audit — 17 URLs vs 18 routes, no 404, honest lastmod

**Files:**
- Modify: `public/sitemap.xml`
- Test: `tests/site.test.mjs`

- [ ] **Step 1: Failing test**
```js
test('sitemap lists every canonical route, nothing else', () => {
  const sm = src('public/sitemap.xml');
  const routes = ['', '/about', '/services', '/booking', '/contact', '/dentists', '/faq', '/gallery', '/blog', '/testimonials', '/services/general-dentistry', '/services/cosmetic-dentistry', '/services/pediatric-dentistry', '/services/restorative-dentistry', '/services/preventive-dentistry', '/services/orthodontics'];
  for (const r of routes) assert.ok(sm.includes(`<loc>https://dentalsmilesavers.com${r}</loc>`), `sitemap missing ${r || '/'}`);
  assert.ok(!sm.includes('404'), 'sitemap must not list 404');
  assert.ok(!sm.includes('/blog/single'), 'non-canonical single must stay out unless routed');
});
```
Run — Expected: FAIL or reveal gaps (adjust route list to `astro build` output truth — the build's emitted HTML files are canonical, not assumptions).
- [ ] **Step 2: Fix** — add missing canonicals, remove non-200s; lastmod policy: single accurate date of THIS release for changed URLs only (Google ignores the field unless consistently accurate — never blanket-stamp).
- [ ] **Step 3: Suite GREEN + `curl` every `<loc>` on preview returns 200.**
- [ ] **Step 4: Commit** `git commit -m "fix(seo): sitemap matches canonical route set"`

---

### Task 11 (Track D — technical): robots.txt AI-crawler groups (search allow, training = owner call)

**Files:**
- Modify: `public/robots.txt`
- Test: `tests/site.test.mjs`

- [ ] **Step 1: Failing test**
```js
test('robots admits search agents incl. AI search crawlers', () => {
  const r = src('public/robots.txt');
  for (const bot of ['OAI-SearchBot', 'Claude-SearchBot', 'PerplexityBot']) {
    assert.ok(r.includes(bot), `robots must explicitly allow ${bot}`);
  }
  assert.ok(r.includes('Sitemap: https://dentalsmilesavers.com/sitemap.xml'), 'sitemap line intact');
});
```
Run — Expected FAIL.
- [ ] **Step 2: Implement** — explicit allow groups for `OAI-SearchBot ChatGPT-User Claude-SearchBot Claude-User PerplexityBot Perplexity-User` (+ keep `User-agent: * Allow: /`). Training crawlers (`GPTBot ClaudeBot Google-Extended`): ASK OWNER first — default in this task is to LEAVE them allowed (open web default) and note the choice in the commit message; if owner says block, add `Disallow: /` groups. Do NOT invent the decision.
- [ ] **Step 3: Suite GREEN.**
- [ ] **Step 4: Commit** `git commit -m "feat(seo): explicit AI search-crawler allows in robots"`

---

### Task 12 (Track D — technical): 404 noindex + canonical/redirect sweep + final full verification

**Files:**
- Modify: `src/pages/404.astro` (noindex, nofollow — never indexed), `public/_redirects` only if prod crawl finds chains
- Test: `tests/site.test.mjs`

- [ ] **Step 1: Failing test**
```js
test('404 is noindex + canonical self-reference holds everywhere', () => {
  const nf = src('src/pages/404.astro');
  assert.ok(nf.includes('noindex'), '404 must be noindex');
  const layout = src('src/layouts/Layout.astro');
  assert.ok(layout.includes('rel="canonical"'), 'canonical intact');
});
```
Run — Expected FAIL (check 404 first; if already noindex, extend test to redirect-chain asserts from the crawl).
- [ ] **Step 2: Implement + crawl**: `curl` prod `/about/` (trailing slash), `http://` → `https://`, `www.` → apex — record single-hop 301s; flatten any chain in `_redirects`/Pages settings.
- [ ] **Step 3: FINAL GATES (all, in order)**: stop dev → `node --test` (expect 50+ tests GREEN) → `npx astro check` (0 errors) → `npm run build` → full prod Lighthouse mobile+desktop on all Task-0 pages (record table, every category ≥90 or documented exception) → Edge screenshots 1440+390 vs Task-0 baselines (open, LOOK, sign off) → push `main` → verify Pages deploy + prod DOM (`og:image`, `ld+json`, robots, sitemap).
- [ ] **Step 4: Commit** `git commit -m "fix(seo): 404 noindex; final verification green"` then push only on owner go-live word.

---

## Explicitly SKIPPED (ponytail log — add when conditions change)

- `llms.txt` — Google Search ignores it (2026 guidance); add only if a concrete AI consumer needs it. One static file, ~10 min.
- Image filename renames (`l1.webp` → descriptive) — refs churn across 60+ spots for near-zero ranking gain; revisit only if image-search traffic matters.
- `@astrojs/sitemap` integration (new dep) — hand-maintained 17-URL file + pinning test covers it; add when routes exceed ~30.
- FAQPage/HowTo schema — rich results discontinued; markup earns nothing visible.
- Self-review `aggregateRating` — ineligible per review-snippet guidelines; would risk a spam flag.
- JS defer/async reshuffle of the jQuery chain — load-bearing order; touch only with a dedicated motion-regression pass.
- CSS purge of theme stylesheets — global classes are referenced by legacy JS + markup; unused-CSS audit savings are dev-inflated; revisit against PROD numbers only if render-blocking >1s after Tasks 1–2.

## Self-review

1. **Spec coverage:** Lighthouse audit+fixes → Tasks 0–3, 9, 12 · root causes → Task 0 baseline doc · verifications → every task Step 3 + Task 12 gates · no visual regressions → screenshot LOOK steps in 0/3/5/9/12 · image SEO+optimization → Tasks 4–5 · on-page → 6–9 · technical → 10–12 · subagents → 4 parallel tracks (A:1–3, B:4–5, C:6–9, D:10–12, all after Task 0) · test-driven → RED steps everywhere · 2026 best practices via research → baked into 7/8/11 + skipped-list rationale.
2. **Placeholder scan:** no TBD/TODO/"appropriate"/"similar to" — every step has exact commands, code, paths, expected outputs. Task 9 deliberately defers asserts to Task-0 prod evidence (named audit IDs + example shape included) — acceptable, not a placeholder.
3. **Type consistency:** tests use existing `src()` + `existsSync` helpers from `tests/site.test.mjs:9` (`existsSync` already imported line 6); `require('node:child_process')` inside test — file is ESM (`import` syntax); FIX at execution: use `import { execSync } from 'node:child_process'` at top instead. Noted for executor.
