# AGENTS.md — Dentia Astro (Smile Savers Dental site)

> Machine-readable. Token rules: grep-first (never full-read `public/` vendor files);
> read targeted ranges; verify via dev-server DOM, never by guessing. See `index.md` for the read map.

## 0. Commands
| Command | Purpose |
|---|---|
| `npm run dev` | Dev server `:4321` (exactly ONE instance — see §1) |
| `npm run build` / `build:ci` | Prod build, plain adapter-less `astro build` → flat `dist/` for Cloudflare Pages (STOP dev first — see §1) |
| `npx astro check` | Typecheck, no npm script (STOP dev first — shared `.astro` cache) |
| `npm run preview` / `preview:cf` | Local preview / Pages preview (`wrangler pages dev dist`) |

## 1. Dev-server discipline (earned the hard way, 3 outages)
- ONE `npm run dev` at a time. Multiple instances corrupt `node_modules/.vite`.
- NEVER `npm run build` while dev runs (file-watcher race → `deps_ssr` corruption → error overlay).
- Recovery: `taskkill /F /IM node.exe` → `Remove-Item -Recurse -Force node_modules/.vite` → launch ONE instance → wait ~75s (first-boot Vite opt) → expect 200.
- Launch detached: `Start-Process cmd.exe "/c npm run dev > <temp>/astro-dev.log 2>&1" -WindowStyle Hidden`. Never `start /min` (kills the harness shell).

## 2. Architecture
- `astro.config.mjs`: `output: 'static'`, NO adapter — plain `astro build` emits flat `dist/`; deploys via Cloudflare Pages (`.github/workflows/deploy.yml`, project `smile-savers` — NOT wrangler.jsonc, which is unused by CI). Pages Functions in `functions/` untouched.
- `.astro` pages/layouts/components; `.tsx` React islands only (`client:load`: BookingForm, ContactForm, GalleryGrid).
- `tsconfig.json` strict; `@/*` alias exists but `src/` uses RELATIVE imports — keep them.
- Legacy JS load order in `Layout.astro` is load-bearing: `plugins.js` (jQuery 3.7.1 + Bootstrap + Owl + Magnific + marquee + Jarallax v2 BUNDLED — no separate files) → `lablaunchpad.js` (owns `de_init`, counters, jarallax init, accordion twin bindings) → `swiper.js` → `custom-marquee.js` → `site-init.ts`.
- `site-init.ts`: guards on `window.jQuery`, re-inits on 100ms/1000ms timers, `.off()` calls prevent double-binding React islands. DO NOT "simplify". `src/types/globals.d.ts` declares the legacy `window` surface.
- WOW is initialized TWICE (`Lab LaunchPad` + `site-init`) — benign, leave it.
- `homepage-7.astro` DELETED (one homepage). `homepage-6/homepage-7 deleted; index.astro is the only homepage`.

## 3. Motion matrix (need → provider; all verified)
WOW reveals→`site-init` · Swiper hero→`site-init`+`swiper.js` · logo marquee→`custom-marquee.js` · Owl testimonials→`site-init` (reset+rebuild) · accordion→`Lab LaunchPad`+`site-init` rebind · counters→`Lab LaunchPad de_counter` · lightbox→`site-init` magnific · jarallax hero slides→`Lab LaunchPad` (class-only hook) · gallery filters→React-owned.
- Hazard: accordion/menu selectors (`.accordion-section-title`, `data-tab`, `#mainmenu li > span`, `.active`) are bound in BOTH `site-init.ts` and `lablaunchpad.js`. Element swaps (div→button) must preserve class + data attrs byte-identical.
- Known latent gap (pre-existing, unfixed): gallery lightbox binds at init; React-remounted items after filter changes lose it until reload.

## 4. Spacing system (`public/css/style.css` — read, don't guess)
- Base rhythm: `section { padding: 120px 0 }`.
- Native overrides: `.pt-NN`/`.pb-NN` pixel utilities (10–100); Bootstrap `!important` utils (`pt-5`=48px etc.); flow spacers `.spacer-half/single/double/triple` = 15/30/60/90px.
- Junction rule: a section's `pb-0` is only safe when the NEXT section supplies top padding (about supplies 120px; the dark strip supplies 50px — measure both sides, keep junctions near-symmetric).

## 5. A11y floor (audit: FAIL vs WCAG 2.2 AA — 23 issues on file)
New/edited markup MUST: real `<label for>` on every field (never placeholder-only); native `<button>` for toggles/tabs (never div/span-onClick); `aria-label` on icon-only links; `aria-hidden="true"` on decorative `<i>`; `role="status"/"alert"` on form feedback; unskipped heading order; mirror visible state in ARIA (`.selected`/`.active` need `aria-pressed`/`aria-expanded`). Fixed so far: Batch 1 (names/hiding) + Batch 2 (form labels/live regions). Open: accordion/tab semantics, menu disclosure, dialog trap, carousel controls, gallery alts.

## 6. Brand canonical (Smile Savers Dental — use VERBATIM, never reintroduce placeholders)
- `32-02 53rd Pl, Woodside, NY 11377` · `(718) 956-8400` / `tel:+17189568400` · `dentalsmilesavers@gmail.com`
- Hours: `Mon–Thu 10AM–6PM · Fri 9AM–5PM · Sat 9AM–1PM · Sun Closed` (Fri 9–5 wins over any blurb)
- Rating: `4.5` / `153 Google reviews` (GBP wins; NEVER ship 5.0/200+, 23k, 98%, "100+ Companies" (exempt: homepage logo-marquee prefill slot, owner-approved 2026-10-02))
- Roster: Bhagat DDS (Lead Dentist, NOT founder) · Islam DMD · Li DDS · Avendaño DDS (photos pending except Bhagat)
- Stats allowed: `35+ years`, `10,000+ patients`. EmailJS keys stay EMPTY (forms inert by design; Worker+Turnstile route pending owner approval).
- Prefill status: DONE homepage, about, contact, booking (NAP/copy). STILL FICTIONAL: services×6 bodies, dentists page, testimonials, faq, gallery items, blog. `dentists.astro`/team photos pending shoot.

## 7. Assets
- Logos: `public/images/logo.svg` (color, light surfaces) + `logo-white.svg` (mono, dark surfaces) + `public/favicon.svg`. All carry `width`+`height`+`viewBox` (intrinsic dims REQUIRED for `<img>` SVG). Header swaps white→color on scroll via existing classes — don't touch logic. 150px max-width via `--logo-width`.
- Team: `public/images/team/bhagat.webp` (740×1000, studio-blue BG). Slot aspect ~20:27. Source JPG retained (watermarked, will be removed on request).
- Theme: `public/css/colors/scheme-01.css` owns brand color; `globals.css` is LIGHT-ONLY (a dark-mode block once ghosted all body copy — never re-add).

## 8. Verification protocol (no test suite exists — this IS the suite)
1. Static asserts: `Select-String` on edited files (strings present/absent).
2. Live DOM gates: dev-fetch rendered HTML (`Invoke-WebRequest`, ASCII-safe patterns — console mangles en-dashes) for copy + `aria-*`/hooks + motion classes.
3. Visual proof: Edge headless screenshots (`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe --headless --screenshot=... --virtual-time-budget=15000 <url>`); tall pages fail — use ≤3600px windows or read the asset directly.
4. Typecheck at milestones: stop dev → `npx astro check` (expect 0 errors) → restart dev.
5. Look, don't infer: read the rendered PNG/SVG yourself before claiming visual state.

## 9. Git
`main` only unless owner approves a branch; conventional commits (`feat/fix/a11y(scope): …`); SDD worktree flow lives in `.worktrees/` (gitignored) with binding SPEC + ledger per epic. Never commit `.wrangler/` state or `node_modules`/`dist`/`.astro`.
