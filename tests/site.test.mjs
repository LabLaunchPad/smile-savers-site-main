// TDD gate for the components maintainability work.
// Run: node --test tests/site.test.mjs  (Node 22 type-strips the .ts import)
// What it proves: brand copy lives in exactly one module and every consumer imports it.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { practice, fullAddress, mailtoWith, hoursSentence } from '../src/data/practice.ts';

const src = (p) => readFileSync(p, 'utf8');

test('brand canon values (GBP wins)', () => {
  assert.equal(practice.name, 'Smile Savers Dental');
  assert.equal(practice.phone.display, '(718) 956-8400');
  assert.equal(practice.phone.href, 'tel:+17189568400');
  assert.equal(practice.email.address, 'dentalsmilesavers@gmail.com');
  assert.equal(practice.stats.rating, '4.5');
  assert.equal(practice.stats.reviews, '153');
  assert.equal(fullAddress(), '32-02 53rd Pl, Woodside, NY 11377');
  assert.ok(hoursSentence().includes('Sunday Closed'));
  assert.ok(mailtoWith('x', 'y').startsWith('mailto:dentalsmilesavers@gmail.com'));
});

test('socials keep labels, no invented URLs', () => {
  assert.equal(practice.socials.length, 5);
  for (const s of practice.socials) {
    assert.ok(s.label.length > 0);
    assert.equal(s.href, '#'); // TODO_OWNER: real profile URLs
  }
});

test('roster matches canon (Bhagat leads, not founds)', () => {
  assert.equal(practice.roster[0].name, 'Dr. Deepak Bhagat');
  assert.equal(practice.roster[0].role, 'Lead Dentist');
  assert.equal(practice.roster.length, 4);
});

test('layout + footer + pages consume practice (no hardcode drift)', () => {
  const consumers = [
    'src/layouts/Layout.astro',
    'src/components/Footer.astro',
    'src/pages/index.astro',
    'src/pages/contact.astro',
    'src/pages/booking.astro',
  ];
  for (const f of consumers) {
    assert.ok(src(f).includes('data/practice'), `${f} must import practice`);
  }
  for (const f of consumers) {
    assert.ok(!src(f).includes('(718) 956-8400'), `${f} must not hardcode phone`);
  }
});

test('trust-bar eyebrow reads Credentials That Speak for Themselves', () => {
  const home = src('src/pages/index.astro');
  assert.ok(home.includes('Credentials That Speak for Themselves'));
  assert.ok(!home.includes('Connected by 100+ Companies'));
  for (const logo of ['aaid', 'agd', 'ao', 'ada', 'icoi', 'nyu']) {
    assert.ok(home.includes(`'${logo}'`), `trust bar must render ${logo}`);
    assert.ok(existsSync(`public/images/logo/${logo}.png`), `${logo}.png must exist`);
  }
  assert.ok(!home.includes('/images/logo/1.png'), 'no logoipsum slots may remain');
});

test('forms consume practice for mailto + fallback phone', () => {
  for (const f of ['src/components/BookingForm.tsx', 'src/components/ContactForm.tsx']) {
    const t = src(f);
    assert.ok(t.includes('data/practice'), `${f} must import practice`);
    assert.ok(
      !t.includes('mailto:dentalsmilesavers@gmail.com?'),
      `${f} must build mailto via mailtoWith`
    );
  }
});

test('forms share FormStatus UI (no duplicated status markup)', () => {
  const shared = src('src/components/FormStatus.tsx');
  assert.ok(shared.includes('export function FormSubmit'), 'FormSubmit missing');
  assert.ok(shared.includes('export function FormSuccess'), 'FormSuccess missing');
  assert.ok(shared.includes('export function FormError'), 'FormError missing');
  assert.ok(shared.includes('export type FormStatusKind'), 'FormStatusKind missing');
  for (const f of ['src/components/BookingForm.tsx', 'src/components/ContactForm.tsx']) {
    const t = src(f);
    assert.ok(t.includes("from './FormStatus'"), `${f} must import FormStatus`);
    assert.ok(t.includes('<FormSubmit'), `${f} must render FormSubmit`);
    assert.ok(t.includes('<FormError'), `${f} must render FormError`);
  }
});

test('component a11y: controls, links, names (motion untouched)', () => {
  const actions = src('src/components/site/HeaderActions.astro').replace(/\s+/g, ' ');
  assert.ok(
    actions.includes('<button type="button" id="menu-btn"'),
    'menu-btn must be a native button'
  );
  assert.ok(actions.includes('aria-controls="mainmenu"'), 'menu-btn needs aria-controls');
  const footer = src('src/components/Footer.astro');
  assert.ok(
    footer.includes('href="tel:+17189568400"') || footer.includes('{practice.phone.href}'),
    'footer phone must be a tel: link'
  );
  assert.ok(
    footer.includes('mailto:dentalsmilesavers@gmail.com') ||
      footer.includes('{practice.email.href}'),
    'footer email must be a mailto: link'
  );
  const contact = src('src/pages/contact.astro');
  assert.ok(
    contact.includes('practice.phone.href'),
    'contact phone must link via practice.phone.href'
  );
  assert.ok(
    contact.includes('practice.email.href'),
    'contact email must link via practice.email.href'
  );
  const gallery = src('src/components/GalleryGrid.tsx');
  assert.ok(gallery.includes('aria-pressed'), 'gallery filters need aria-pressed');
  assert.ok(!gallery.includes('alt=""'), 'gallery images need real alts');
  for (const f of ['src/components/BookingForm.tsx', 'src/components/ContactForm.tsx']) {
    assert.ok(src(f).includes('type="tel"'), `${f} phone input must be type=tel`);
  }
  const layout = src('src/layouts/Layout.astro');
  assert.ok(layout.includes('skip-link'), 'skip link missing');
  assert.ok(layout.includes('<main'), 'main landmark missing');
  assert.ok(layout.includes('href="#top"'), 'back-to-top must target #top');
  assert.ok(layout.includes('role="dialog"'), 'side panel needs dialog role');
});

test('legacy handshakes carry ownership comments', () => {
  const init = src('src/scripts/site-init.ts');
  assert.ok(init.includes('OWNERSHIP: submenu arrows'), 'submenu ownership comment missing');
  assert.ok(init.includes('OWNERSHIP: #filters clicks'), 'filters ownership comment missing');
  const island = src('src/components/GalleryGrid.tsx');
  assert.ok(island.includes('React-owned'), 'gallery React-ownership note missing');
  const preloader = src('src/components/Preloader.astro');
  assert.ok(preloader.includes('OWNERSHIP: #de-loader'), 'preloader ownership comment missing');
});

test('Pages-ready: no Workers adapter, static output, cached headers', () => {
  const config = src('astro.config.mjs');
  assert.ok(
    !config.includes('@astrojs/cloudflare'),
    'astro.config must not use the Workers adapter'
  );
  assert.ok(!config.includes('platformProxy'), 'platformProxy must go with the adapter');
  assert.ok(config.includes("output: 'static'"), 'output must stay static');
  const pkg = JSON.parse(src('package.json'));
  const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
  assert.ok(!('@astrojs/cloudflare' in allDeps), 'adapter dep must be uninstalled');
  assert.ok(
    !('deploy' in pkg.scripts || 'cf-typegen' in pkg.scripts),
    'worker-only scripts must go'
  );
  assert.ok('build:ci' in pkg.scripts, 'build:ci (Pages CI contract) missing');
  assert.ok('check' in pkg.scripts, 'check (Pages quality gate) missing');
  const headers = src('public/_headers');
  assert.ok(headers.includes('/_astro/*'), '_headers must keep the immutable _astro rule');
  assert.ok(headers.includes('immutable'), '_headers must keep immutable caching');
});

test('Workers deploy: wrangler.jsonc points at flat dist/', () => {
  const w = JSON.parse(src('wrangler.jsonc'));
  assert.equal(w.name, 'smile-savers-site-main');
  assert.equal(w.assets.directory, './dist');
  assert.ok(!('main' in w), 'pure static assets deploy must not declare a worker entry-point');
  assert.ok(!('binding' in w.assets), 'assets-only Worker must not declare an asset binding');
});

test('merge plumbing: redirects, functions, offline route', () => {
  const redirects = src('public/_redirects');
  assert.ok(redirects.includes('/appointments'), '_redirects must cover /appointments');
  assert.ok(redirects.includes('/booking 301'), 'appointments must point at local /booking');
  for (const f of [
    'functions/_middleware.js',
    'functions/api/contact.js',
    'functions/api/chat.js',
  ]) {
    const t = src(f);
    assert.ok(t.includes('onRequest'), `${f} must be a Pages Function`);
  }
  assert.ok(
    src('functions/api/contact.js').includes('RESEND_API_KEY'),
    'contact function must use server env key'
  );
  const contactFn = src('functions/api/contact.js');
  assert.ok(contactFn.includes('Fri: 9 AM – 5 PM'), 'auto-reply must carry canon Fri hours');
  assert.ok(!contactFn.includes('Fri: 9 AM - 1 PM'), 'auto-reply must not carry wrong Fri hours');
  assert.ok(contactFn.includes('32-02 53rd Pl'), 'auto-reply must carry canon address');
});

test('brand assets: every /images/* + /favicon referenced in src/ exists in public/', () => {
  const refs = new Set();
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = `${dir}/${e.name}`;
      if (e.isDirectory()) walk(p);
      else if (/\.(astro|tsx|ts)$/.test(e.name)) {
        for (const m of src(p).matchAll(/[`"'](\/images\/[^`"'?#]*|\/favicon\.svg)/g)) {
          refs.add(m[1]);
        }
      }
    }
  };
  walk('src');
  assert.ok(refs.size > 20, `expected many asset refs, found ${refs.size}`);
  const missing = [...refs].filter((u) => {
    if (u.includes('${')) return !existsSync(`public${u.slice(0, u.indexOf('${'))}`);
    return !existsSync(`public${u}`);
  });
  assert.deepEqual(missing, [], `src/ refs missing public files: ${missing.join(', ')}`);
});

test('forms POST to /api/contact with mailto fallback, no EmailJS', () => {
  for (const f of ['src/components/BookingForm.tsx', 'src/components/ContactForm.tsx']) {
    const t = src(f);
    assert.ok(t.includes("fetch('/api/contact'"), `${f} must POST to /api/contact`);
    assert.ok(t.includes("method: 'POST'"), `${f} must use POST`);
    assert.ok(t.includes('new FormData('), `${f} must send FormData (multipart contract)`);
    assert.ok(t.includes('mailtoWith('), `${f} must keep the mailto fallback`);
    assert.ok(!t.includes('emailjs'), `${f} must not ship EmailJS anymore`);
    assert.ok(!t.includes('headers:'), `${f} must not set headers (boundary auto-set)`);
  }
  const pkg = JSON.parse(src('package.json'));
  const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
  assert.ok(!('@emailjs/browser' in allDeps), '@emailjs/browser must be uninstalled');
});

test('cleanup: no dead public weight, no PWA corpse', () => {
  const dead = [
    'public/admin/.gitignore',
    'public/manifest.json',
    'public/sw.js',
    'public/icons/icon-192.png',
    'src/pages/offline.astro',
    'public/aff1.png',
    'public/aff5-300x68.png',
    'public/aff6.png',
    'public/images/clinic-interior.jpg',
    'public/images/hero-dental-office.jpg',
    'public/images/doctors/dr-bhagat.jpg',
    'public/logo.svg',
    'public/logoold.svg',
    'public/logosq.svg',
    'public/images/team/Dr. Deepak Bhagat.png',
    'src/assets/team/dr.jpg',
    'src/entrypoint.js',
    'public/images/blog-thumbnail/6.webp',
    'public/images/misc/c1-ori.webp',
    'public/images/misc/c2.webp',
    'public/images/misc/c3.webp',
    'public/images/icon.webp',
    'public/images/icons/tooth-5.png',
    'public/images/icons/tooth-6.png',
    'public/images/icons/tooth-7.png',
    'public/images/testimonial/6.webp',
    'public/images/testimonial/7.webp',
    'public/images/testimonial/8.webp',
    'public/images/testimonial/user.webp',
    'public/css/bootstrap.rtl.min.css',
    'public/css/datepicker.css',
    'public/images/logo/1.png',
  ];
  for (const p of dead) {
    assert.ok(!existsSync(p), `${p} is dead weight and must be deleted`);
  }
});

test('branding: no Dentia/template strings in shipped code', () => {
  const files = [];
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = `${dir}/${e.name}`;
      if (e.isDirectory()) walk(p);
      else if (/\.(astro|tsx|ts|css)$/.test(e.name)) files.push(p);
    }
  };
  walk('src');
  files.push('public/css/style.css', 'public/js/lablaunchpad.js');
  const srcFiles = files.filter((f) => f.startsWith('src/'));
  // Owner decision 2026-10-02: zero on3step anywhere — Lab LaunchPad instead.
  assert.ok(!existsSync('public/js/on3step.js'), 'public/js/on3step.js must be renamed');
  assert.ok(existsSync('public/js/lablaunchpad.js'), 'public/js/lablaunchpad.js must exist');
  assert.ok(
    src('src/layouts/Layout.astro').includes('/js/lablaunchpad.js'),
    'Layout must load /js/lablaunchpad.js'
  );
  for (const f of files) {
    const t = src(f);
    // \b: "Credentials" (trust-bar heading) must not trip the Dentia ban.
    assert.ok(!/\bdentia\b/i.test(t), `${f} must not contain Dentia branding`);
    assert.ok(!/on3step/i.test(t), `${f} must not contain on3step (Lab LaunchPad instead)`);
  }
  // Owner decision 2026-10-02: the homepage logo marquee (index.astro) is an
  // intentional prefill slot for verified partner logos — exempt from the ban.
  const MARQUEE_PREFILL = new Set(['src/pages/index.astro']);
  for (const f of srcFiles) {
    const t = src(f);
    if (MARQUEE_PREFILL.has(f)) continue;
    assert.ok(!t.includes('100+ Companies'), `${f} must not contain 100+ Companies`);
    assert.ok(!/logoipsum/i.test(t), `${f} must not contain logoipsum`);
  }
});

test('config hygiene: own name, no dead env, no Tina residue', () => {
  const pkg = JSON.parse(src('package.json'));
  assert.equal(pkg.name, 'smile-savers-site', 'package.json name must be smile-savers-site');
  const env = src('src/env.d.ts');
  assert.ok(!env.includes('defineEnv'), 'src/env.d.ts must not contain defineEnv');
  assert.ok(!env.includes('PUBLIC_PRACTICE'), 'src/env.d.ts must not contain PUBLIC_PRACTICE');
  const deploy = src('.github/workflows/deploy.yml');
  assert.ok(!deploy.includes('TINA_'), '.github/workflows/deploy.yml must not contain TINA_');
});

test('brand assets: every file under public/images is referenced', () => {
  const refs = [];
  const walkSrc = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = `${dir}/${e.name}`;
      if (e.isDirectory()) walkSrc(p);
      else if (/\.(astro|tsx|ts)$/.test(e.name)) {
        for (const m of src(p).matchAll(/\/images\/[^\s`"'()\]{?#]*/g)) refs.push(m[0]);
      }
    }
  };
  walkSrc('src');
  for (const dir of ['public/css', 'public/js']) {
    if (!existsSync(dir)) continue;
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory()) continue;
      if (!/\.(css|js)$/.test(e.name)) continue;
      const p = `${dir}/${e.name}`;
      for (const m of src(p).matchAll(/\/images\/[^\s`"'()\]{?#]*/g)) refs.push(m[0]);
    }
  }
  const files = [];
  const walkImg = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = `${dir}/${e.name}`;
      if (e.isDirectory()) walkImg(p);
      else files.push(p);
    }
  };
  walkImg('public/images');
  const basename = (s) => s.slice(s.lastIndexOf('/') + 1);
  // Owner decision 2026-10-02: public/images/logo/ is the intentional prefill
  // slot for verified partner logos (homepage marquee) — exempt from the ban.
  const PREFILL_DIRS = ['public/images/logo/'];
  const unreferenced = files.filter((f) => {
    if (PREFILL_DIRS.some((d) => f.startsWith(d))) return false;
    const rel = `/images/${f.slice('public/images/'.length)}`;
    const base = basename(rel);
    return !refs.some((r) => {
      if (r.includes('${')) {
        const prefix = r.slice(0, r.indexOf('${'));
        return rel.startsWith(prefix);
      }
      if (r === rel) return true;
      return r.startsWith('/images/') && basename(r) === base;
    });
  });
  assert.deepEqual(unreferenced, [], `public/images files unreferenced in src/css/js: ${unreferenced.join(', ')}`);
});

test('hygiene: no dead docs or editor dirs', () => {
  const dead = [
    ' .vscode',
    '.vscode',
    '.cursor',
    'ATLAS_TOKENS.md',
    'FINAL_ENHANCEMENT_REPORT.md',
    'TASK-TRACKER.md',
    'check_results.txt',
    'frontend_design_audit.md',
  ];
  for (const p of dead) {
    assert.ok(!existsSync(p), `${p} is dead and must stay deleted`);
  }
});

test('seo: canonical domain everywhere user-facing', () => {
  for (const f of ['public/sitemap.xml', 'public/robots.txt', 'astro.config.mjs']) {
    const t = src(f);
    assert.ok(t.includes('https://dentalsmilesavers.com'), `${f} must use the canonical domain`);
    assert.ok(!t.includes('smilesavers.dental'), `${f} must not reference the stale domain`);
  }
  const headers = src('public/_headers');
  assert.ok(
    headers.includes('https://dentalsmilesavers.com'),
    'public/_headers must use the canonical domain'
  );
  assert.ok(
    !headers.includes('smilesavers.dental'),
    'public/_headers must not reference the stale domain'
  );
});

test('redirects: destinations resolve to routes', () => {
  const lines = src('public/_redirects')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'));
  assert.ok(lines.length > 0, '_redirects must define at least one redirect');
  for (const line of lines) {
    const tokens = line.split(/\s+/);
    const dest = tokens[1];
    assert.ok(dest, `redirect line missing destination: ${line}`);
    if (/^https?:\/\//.test(dest)) continue;
    assert.ok(dest.startsWith('/'), `destination must be a local path: ${line}`);
    const route = dest === '/' ? 'src/pages/index.astro' : `src/pages/${dest.slice(1)}.astro`;
    const alt = dest === '/' ? null : `src/pages/${dest.slice(1)}/index.astro`;
    assert.ok(
      existsSync(route) || (alt && existsSync(alt)),
      `${dest} must resolve to a src/pages route`
    );
  }
});

test('discipline: dev-server rules documented', () => {
  const agents = src('AGENTS.md');
  assert.ok(
    agents.includes('ONE') && agents.includes('npm run dev'),
    'AGENTS.md must document the one-instance rule'
  );
  assert.ok(agents.includes('STOP dev'), 'AGENTS.md must document the stop-before-build rule');
  const catalog = src('ERROR-CATALOG.md');
  assert.ok(
    catalog.includes('Pre-merge build gate'),
    'ERROR-CATALOG.md must document the pre-merge build gate'
  );
});

test('hygiene: no secrets in tracked source', () => {
  const secretRe = /sk-live|sk-test|ghp_|xoxb-|BEGIN PRIVATE KEY/;
  const files = [];
  const walkAll = (dir) => {
    if (!existsSync(dir)) return;
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = `${dir}/${e.name}`;
      if (e.isDirectory()) walkAll(p);
      else files.push(p);
    }
  };
  walkAll('src');
  walkAll('functions');
  if (existsSync('.github')) {
    const walkGh = (dir) => {
      for (const e of readdirSync(dir, { withFileTypes: true })) {
        const p = `${dir}/${e.name}`;
        if (e.isDirectory()) walkGh(p);
        else if (/\.(yml|yaml|md)$/.test(e.name)) files.push(p);
      }
    };
    walkGh('.github');
  }
  for (const e of readdirSync('.', { withFileTypes: true })) {
    if (e.isFile() && /\.(json|jsonc|mjs|ts)$/.test(e.name)) files.push(e.name);
  }
  assert.ok(files.length > 0, 'expected source files to scan');
  for (const f of files) {
    assert.ok(!secretRe.test(src(f)), `${f} must not contain secrets`);
  }
});

test('nav: structural hooks frozen (legacy contracts)', () => {
  const header = src('src/components/Header.astro');
  for (const s of ['data-base-class', 'id="logo"', '<MainNav', '<HeaderActions']) {
    assert.ok(header.includes(s), `Header.astro must keep ${s}`);
  }
  const nav = src('src/components/site/MainNav.astro');
  for (const s of ['id="mainmenu"', 'href="/booking"']) {
    assert.ok(nav.includes(s) || src('src/components/site/HeaderActions.astro').includes(s), `nav boundary must keep ${s}`);
  }
  const actions = src('src/components/site/HeaderActions.astro');
  for (const s of ['id="menu-btn"', 'aria-controls="mainmenu"', 'id="btn-extra"']) {
    assert.ok(actions.includes(s), `HeaderActions.astro must keep ${s}`);
  }
  assert.ok(actions.includes('<button') && actions.includes('type="button"'), '#menu-btn must stay a native button');
  const layout = src('src/layouts/Layout.astro');
  for (const s of ['id="extra-wrap"', 'role="dialog"', 'id="btn-close"', 'id="extra-content"']) {
    assert.ok(layout.includes(s), `Layout.astro must keep ${s}`);
  }
  // load-bearing script order: plugins -> lablaunchpad -> swiper -> custom-marquee -> site-init
  const order = ['/js/plugins.js', '/js/lablaunchpad.js', '/js/swiper.js', '/js/custom-marquee.js', 'site-init'];
  const idx = order.map((s) => layout.indexOf(s));
  assert.ok(idx.every((i) => i >= 0), 'all legacy scripts + site-init must load in Layout');
  assert.deepEqual([...idx].sort((a, b) => a - b), idx, 'legacy script load order must not change');
});

test('nav: item order Home Services Dentists Blog Contact More (dropdown last)', () => {
  const nav = src('src/components/site/MainNav.astro');
  const labels = ['Home', 'Services', 'Dentists', 'Blog', 'Contact', 'More'];
  const idx = labels.map((l) => nav.indexOf(l));
  assert.ok(idx.every((i) => i >= 0), `all top-level labels must exist, missing: ${labels.filter((_, i) => idx[i] < 0)}`);
  assert.deepEqual([...idx].sort((a, b) => a - b), idx, 'top-level nav order must be Home Services Dentists Blog Contact More');
  assert.ok(!nav.includes('Pages'), 'Pages label must be renamed to More');
});

test('gallery: lightbox survives React filter remounts', () => {
  const grid = src('src/components/GalleryGrid.tsx');
  assert.ok(grid.includes('rebindGalleryPopup'), 'GalleryGrid must rebind the lightbox after filter remounts');
  const init = src('src/scripts/site-init.ts');
  assert.ok(init.includes('rebindGalleryPopup'), 'site-init must expose the lightbox rebind');
});

test('content: hero carries a static Google badge linked to the GBP', () => {
  const home = src('src/pages/index.astro');
  assert.ok(home.includes('share.google/tZftkQc4AVNwEkHfn'), 'hero badge must link the GBP share URL');
  assert.ok(home.includes('google-badge'), 'hero badge must carry the google-badge hook');
  assert.ok(home.includes('target="_blank"'), 'GBP link must open in a new tab');
  assert.ok(!home.includes('Google Rating'), 'old rating-row label must be gone');
  assert.ok(home.includes('star-half'), '5th star must render half-filled (rating is 4.5, not 5.0)');
  const css = src('src/styles/globals.css');
  assert.ok(/#section-intro\s+\.google-badge\s*\{[^}]*width:\s*fit-content/.test(css), 'badge pill must hug content on mobile (no full-width white slab)');
});

test('content: hero eyebrow is the affordable positioning line', () => {
  const home = src('src/pages/index.astro');
  assert.ok(home.includes('Affordable Family Dentistry in Woodside, NYC'), 'hero eyebrow must read Affordable Family Dentistry in Woodside, NYC');
  assert.ok(!home.includes('Pain-Free Family Dentistry'), 'old pain-free eyebrow must be gone from the hero');
});

test('content: homepage language line is blanket, verified-safe (no enumeration)', () => {
  const home = src('src/pages/index.astro');
  assert.ok(home.includes('we speak all our Queens community languages'), 'homepage hero must carry the blanket language line');
  const trustLine = home.split('\n').find((l) => l.includes('hero-trust'));
  assert.ok(trustLine && !/op-\d/.test(trustLine), 'hero trust line must be full-opacity .text-light white (no op-* wash over the photo)');
  const css = src('src/styles/globals.css');
  assert.ok(/#section-intro\s+\.hero-trust\s*\{[^}]*color:\s*#fff/.test(css), 'hero trust line must override the theme 60%-white paragraph tone with full white');
  for (const s of ['Bangla', 'Bengali', 'Punjabi', 'Urdu', 'Mandarin', 'Marathi']) {
    assert.ok(!home.includes(s), `homepage must not enumerate languages (${s})`);
  }
});

test('content: homepage booking CTAs target /booking, rating stays 4.5/153', () => {
  const home = src('src/pages/index.astro');
  assert.ok(!home.includes('href="/contact"'), 'no homepage CTA may point at /contact');
  assert.ok(home.includes('/booking'), 'homepage booking CTAs must target /booking');
  const data = src('src/data/practice.ts');
  assert.ok(data.includes("rating: '4.5'") && data.includes("reviews: '153'"), 'canon rating must stay 4.5/153');
  for (const f of ['src/pages/index.astro', 'src/data/practice.ts']) {
    assert.ok(!src(f).includes('5.0'), `${f} must never claim 5.0`);
  }
});

test('content: homepage testimonials are real Google reviews (no fiction)', () => {
  const home = src('src/pages/index.astro');
  for (const n of ['Mohammed Rab', 'Joe Velotta', 'Walter Oca', 'Aida Troya']) {
    assert.ok(home.includes(n), `homepage must quote real reviewer ${n}`);
  }
  for (const n of ['Sofia R.', 'James K.', 'Robert M.', 'Aisha T.', 'Brunilda', 'lorem', 'shades']) {
    assert.ok(!home.includes(n), `homepage must not contain fictional content (${n})`);
  }
});

test('css: small-viewport type scale (no 390px clipping)', () => {
  const css = src('src/styles/globals.css');
  assert.ok(css.includes('576px'), 'globals.css must scale display type under 576px');
});

test('nav: twin runtime ownership hooks present (no silent single-owner drift)', () => {
  for (const f of ['public/js/lablaunchpad.js', 'src/scripts/site-init.ts']) {
    const t = src(f);
    for (const s of ['has-child', 'menu-item-has-children', 'menu-open', 'autoshow', 'header-mobile']) {
      assert.ok(t.includes(s), `${f} must keep owning ${s}`);
    }
  }
  const init = src('src/scripts/site-init.ts');
  for (const s of ['mobileSmileMenuBtn', 'mobileSmileMenuArrow', 'accordionSmile', '.off(']) {
    assert.ok(init.includes(s), `site-init.ts must keep duplicate-binding guard ${s}`);
  }
});

test('nav a11y: submenu arrows are keyboard-operable disclosures', () => {
  const init = src('src/scripts/site-init.ts');
  assert.ok(init.includes('keydown.mobileSmileMenuArrow'), 'arrow keys need a namespaced keydown owner');
  assert.ok(init.includes('Toggle submenu'), 'injected arrows need an accessible name');
  assert.ok(init.includes("role', 'button'") || init.includes('role="button"') || init.includes("role', \"button\""), 'injected arrows must expose button semantics');
});

test('nav a11y: current page, keyboard-open dropdowns, escape + focus return', () => {
  const nav = src('src/components/site/MainNav.astro');
  assert.ok(nav.includes('aria-current'), 'MainNav must mark the current page');
  assert.ok(nav.includes('Astro.url.pathname'), 'current page must derive from the URL');
  const css = src('src/styles/globals.css');
  assert.ok(css.includes(':focus-within'), 'dropdowns must open on keyboard focus, not hover alone');
  const init = src('src/scripts/site-init.ts');
  assert.ok(init.includes('focus?.()'), 'Escape/panel close must return focus to its invoker');
});

test('sections: PageHeader + BookingCTA own the repeated blocks', () => {
  assert.ok(existsSync('src/components/sections/shared/PageHeader.astro'), 'PageHeader must exist');
  assert.ok(existsSync('src/components/sections/shared/BookingCTA.astro'), 'BookingCTA must exist');
  const pages = [];
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = `${dir}/${e.name}`;
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.astro')) pages.push(p);
    }
  };
  walk('src/pages');
  const withHeader = pages.filter((p) => src(p).includes('<PageHeader'));
  assert.ok(withHeader.length >= 16, `16+ pages must compose PageHeader, found ${withHeader.length}`);
  const inlineSub = pages.filter((p) => src(p).includes('<section id="subheader"'));
  assert.deepEqual(inlineSub, ['src/pages/blog/single.astro'], 'only blog/single keeps a bespoke subheader');
  const servicePages = pages.filter((p) => p.includes('services/') && !p.includes('services.astro'));
  assert.equal(servicePages.length, 6);
  for (const p of servicePages) {
    assert.ok(src(p).includes('<BookingCTA'), `${p} must compose BookingCTA`);
    assert.ok(!src(p).includes('Ready to Book Your Appointment?'), `${p} must not inline the CTA`);
  }
});

test('nav: every header href resolves to a real route', () => {
  const header = src('src/components/site/MainNav.astro') + src('src/components/site/HeaderActions.astro');
  const hrefs = [...header.matchAll(/href="(\/[^"]*)"/g)].map((m) => m[1]);
  assert.ok(hrefs.length >= 15, `expected 15+ nav hrefs, found ${hrefs.length}`);
  for (const h of new Set(hrefs)) {
    const route = h === '/' ? 'src/pages/index.astro' : `src/pages${h}.astro`;
    const alt = h === '/' ? null : `src/pages${h}/index.astro`;
    assert.ok(existsSync(route) || (alt && existsSync(alt)), `nav href ${h} must resolve to a route`);
  }
});
