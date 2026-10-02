import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// Static: every route prerenders at build time; plain `astro build` emits
// flat dist/ for Cloudflare Pages (no adapter — Pages serves dist/ directly,
// Pages Functions in functions/ are untouched by this config).
export default defineConfig({
  site: 'https://dentalsmilesavers.com',
  output: 'static',
  integrations: [react()],
});
