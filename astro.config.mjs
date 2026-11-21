import { defineConfig } from 'astro/config';

// Sitio 100 % prerenderizado: se publica como assets estáticos en Cloudflare Workers.
export default defineConfig({
  site: 'https://cetostudio.com',
  build: { inlineStylesheets: 'auto' },
});
