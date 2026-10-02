# TEST-REPORT — cleanup RED state (tests-only)

Worktree: C:\dentia-astro\.worktrees\cleanup (branch cleanup/dead-weight-dentia)
Command: node --test tests/site.test.mjs
Date: 2026-10-02

## New tests (4, all FAIL as intended)
1. cleanup: no dead public weight, no PWA corpse
2. branding: no Dentia/template strings in shipped code
3. config hygiene: own name, no dead env, no Tina residue
4. brand assets: every file under public/images is referenced

## Full-suite counts
- tests 17
- pass 13
- fail 4
- cancelled 0 / skipped 0 / todo 0

Existing 13 tests PASS (including adjusted 'merge plumbing: redirects, functions, offline route' with offline.astro assertions removed).

## First assertion message per failing test
1. `cleanup: no dead public weight, no PWA corpse` — `public/admin/.gitignore is dead weight and must be deleted`
2. `branding: no Dentia/template strings in shipped code` — `src/scripts/site-init.ts must not contain Dentia branding`
3. `config hygiene: own name, no dead env, no Tina residue` — `package.json name must be smile-savers-site` (+ actual 'dentia-astro' / - expected 'smile-savers-site')
4. `brand assets: every file under public/images is referenced` — `public/images files unreferenced in src/css/js: public/images/blog-thumbnail/6.webp, public/images/clinic-interior.jpg, public/images/doctors/dr-bhagat.jpg, public/images/doctors/dr-islam.jpg, public/images/doctors/dr-li.jpg, public/images/hero-dental-office.jpg, public/images/icon.webp, public/images/icons/tooth-5.png, public/images/icons/tooth-6.png, public/images/icons/tooth-7.png, public/images/logo/1.png, public/images/logo/10.png, public/images/logo/2.png, public/images/logo/3.png, public/images/logo/4.png, public/images/logo/5.png, public/images/logo/6.png, public/images/logo/7.png, public/images/logo/8.png, public/images/logo/9.png, public/images/misc/c1-ori.webp, public/images/misc/c1.webp, public/images/misc/c2.webp, public/images/misc/c3.webp, public/images/team/Dr. Deepak Bhagat.png, public/images/testimonial/6.webp, public/images/testimonial/7.webp, public/images/testimonial/8.webp, public/images/testimonial/user.webp`
