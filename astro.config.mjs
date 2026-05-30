// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from "@tailwindcss/vite";

export const siteUrl = 'https://brand.avagolf.com';

const brandPackUrl = 'https://assets.parone.io/avagolf/AVA_Golf_Brand_Pack.zip';

export default defineConfig({
  site: siteUrl,
  server: { port: 3000 },
  trailingSlash: 'always',
  redirects: {
    '/download': {
      status: 302,
      destination: brandPackUrl,
    },
  },
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
  },
});
