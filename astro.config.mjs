// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from "@tailwindcss/vite";

export const siteUrl = 'https://brand.avagolf.com';

// https://astro.build/config
export default defineConfig({
  site: siteUrl,
  server: { port: 3000 },
  build: {
    format: 'directory',
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        external: ['fsevents'],
      },
    },
  },
});
