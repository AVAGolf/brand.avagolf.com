// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from "@tailwindcss/vite";
import { unified } from '@astrojs/markdown-remark';

export const siteUrl = 'https://brand.avagolf.com';

// https://astro.build/config
export default defineConfig({
  site: siteUrl,
  server: { port: 3000 },
  build: {
    format: 'directory',
  },
  // Pages are emitted as `/<slug>/index.html` and served by the S3 website
  // endpoint, which 302s `/<slug>` -> `/<slug>/`. Internal links must include
  // the trailing slash or Google indexes them as "Page with redirect".
  trailingSlash: 'always',
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  markdown: {
    // Astro 7.3 made its new Sätteri processor the default. The two content
    // collections are Markdown files, so they stay on the remark/rehype
    // pipeline they were written for.
    processor: unified(),
  },
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
