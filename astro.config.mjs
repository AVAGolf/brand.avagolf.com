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
        // Astro statically imports this optional Rust compiler even though
        // it's gated behind the (unused) experimental.rustCompiler flag —
        // Rollup can't resolve it since it's never installed. Safe to
        // externalize since that code path is never executed.
        external: ["@astrojs/compiler-rs"],
      },
    },
  },
});
