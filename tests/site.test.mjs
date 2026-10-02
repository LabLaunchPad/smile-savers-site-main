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
  const header = src('src/components/Header.astro').replace(/\s+/g, ' ');
  assert.ok(
    header.includes('<button type="button" id="menu-btn"'),
    'menu-btn must be a native button'
  );
  assert.ok(header.includes('aria-controls="mainmenu"'), 'menu-btn needs aria-controls');
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
    'public/images/background/1.webp',
    'public/images/blog-thumbnail/5.webp',
    'public/images/misc/c1.webp',
    'public/images/icon.webp',
    'public/images/icons/tooth-5.png',
    'public/images/testimonial/6.webp',
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
  files.push('public/css/style.css', 'public/js/on3step.js');
  const srcFiles = files.filter((f) => f.startsWith('src/'));
  for (const f of files) {
    const t = src(f);
    assert.ok(!/dentia/i.test(t), `${f} must not contain Dentia branding`);
    assert.ok(!t.includes('on3step.com'), `${f} must not contain on3step.com`);
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
