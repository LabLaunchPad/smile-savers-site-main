# Error Catalog — Smile Savers Dental site

Every real incident hit during redesign → production, with root cause, proven fix,
and the guard that stops it recurring. Sources: PR #1–#5 bodies, `tests/site.test.mjs`
(each test is a fossilized bug), `AGENTS.md` hazard notes, post-build audits.

Rule: a fix without a guard is a postponement. Code guards live in
`tests/site.test.mjs` (`node --test tests/site.test.mjs`); process guards live here
and in `AGENTS.md` §1.

## Closed incidents (fixed + guarded)

| # | Symptom | Root cause | Proven fix | Never-again guard |
|---|---|---|---|---|
| 1 | Dev server poisoned: error overlay, stale builds | Two `npm run dev` instances corrupt `node_modules/.vite` | `taskkill node` → delete `.vite` → ONE instance → 75s wait | Process: `AGENTS.md` §1. Test: `discipline: dev-server rules documented` |
| 2 | `deps_ssr` corruption after build | `npm run build` while dev watched the tree | STOP dev before build/check, restart after | Same as #1 |
| 3 | ALL brand images 404 on production, fine locally (PR #4) | Merge replaced `src/` but kept old `public/images/`; local files masked it | Restored 87 referenced files; regression test | Tests: `brand assets … referenced exists` + `… is referenced` |
| 4 | Stats showed 8333/3/5/29 | NOT a bug — mid-animation frame (~83% through count-up) | No code change; verify SSR `data-to` before assuming data bug | Process: check rendered `data-to` first (this table) |
| 5 | `Cannot use assets with a binding in assets-only Worker` | `assets.binding` declared on a static-only Worker | Removed binding | Test: `Workers deploy …` asserts no binding/`main` |
| 6 | Deployed worker name mismatch warning | `wrangler.jsonc` name differed from dashboard project | Renamed to `smile-savers-site-main` | Test asserts exact name + `assets.directory` |
| 7 | PR showed entire repo as new files ("no history in common") | Branch cut from unrelated local history | Rebuild merge branch ON `origin/main`, selective checkout | Process: always branch from the upstream base |
| 8 | Headless screenshot showed counters stuck at `0+` | Scroll-gated animation never fires under virtual time | Verify counters in a real browser scroll, not headless | Process (this table) |
| 9 | Deleted-file survivor (`aff5-300x68.png`) shipped in `dist/` | Delete list used assumed names, not disk truth | Enumerate from disk; post-build `dist/` residue check | Test (reverse-direction) + build-gate checklist below |
| 10 | Repo topics empty after `gh repo edit` | Comma-joined `--add-topic a,b,c` taken as one topic | Separate `--add-topic` per topic; read back via API | Process: always read back metadata writes |
| 11 | ~40 dead files in every deploy (PR #5) | Old photos, unregistered PWA corpse, dead CSS/JS, Tina lines | Deleted; 4 guard tests red→green | Test: `cleanup: no dead public weight` |
| 12 | Foreign template names/URLs shipped (PR #5) | Vendor headers, namespaces, demo redirect came with the theme | Renamed to Lab LaunchPad; redirect neutralized | Test: `branding: no Dentia/template strings` |
| 13 | Dead docs/dirs accumulated (` .vscode`, `.cursor`, reports) | Scratch + old-repo docs never pruned | Deleted; absence test | Test: `hygiene: no dead docs or editor dirs` |
| 14 | `public/_headers` allowed CORS for `smilesavers.dental` | Stale domain in headers config | Pointed at `https://dentalsmilesavers.com` | Test: `seo: canonical domain everywhere user-facing` |
| 15 | README listed scripts that don't exist (`deploy`, `cf-typegen`) | Docs drifted from `package.json` | Rewrote README from `package.json` truth | Process: derive docs from config, never memory |

## Open / known-deferred (NOT fixed — do not "fix" without owner say-so)

| # | Issue | Status |
|---|---|---|
| O1 | ~20px horizontal bleed at 390px (pre-existing, masked by `overflow-x:hidden`) | Open; suspects: 1240px `.container`, row gutters <576px |
| O2 | Gallery lightbox lost after React filter remount until reload | Open latent gap (`AGENTS.md` §3) |
| O3 | `functions/api/chat.js` needs `AI` binding; CORS + `SITE_URL` reference `smilesavers.dental` | Deferred follow-up (flagged in PR #3–#5) |
| O4 | `deploy.yml` production URLs reference `smilesavers.dental` | Deferred; deploy behavior untouched deliberately |
| O5 | Fictional copy bodies (testimonials/blog/gallery/dentists/services/faq) | Copywriting task, not a bug |
| O6 | PR #2 (design-intel harness) open/unmerged | Not ours; leave alone |

## Pre-merge build gate (run every time — this list caught #9)

1. `node --test tests/site.test.mjs` → all green.
2. Stop dev → `npx astro check` → 0 errors → `npm run build:ci`.
3. `dist/` residue check: no `on3step.js`, `sw.js`, `manifest.json`, `aff*`, old images, `offline/`.
4. `dist/` must-haves: `index.html`, `js/lablaunchpad.js`, `images/logo.svg`.
5. Restart dev → `http://localhost:4321/` returns 200.
