import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://wilyum-rivyr-tsao.github.io',
  integrations: [sitemap()],
});
