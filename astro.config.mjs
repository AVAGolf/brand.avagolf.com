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
    // Every page's CSS in its own <head>: no render-blocking stylesheet
    // request. The pages are small, so inlining costs less than a round trip.
    inlineStylesheets: 'always',
  },
  // Pages are emitted as `/<slug>/index.html` and served by the S3 website
  // endpoint, which 302s `/<slug>` -> `/<slug>/`. Internal links must include
  // the trailing slash or Google indexes them as "Page with redirect".
  trailingSlash: 'always',
  // Hover prefetch works without a client-side router: each page is a full
  // load (the shared Nav binds its menu once per load), fetched ahead.
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
