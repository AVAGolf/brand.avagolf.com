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
        // Astro's prerender build bundles the whole `astro` package
        // (including build-time-only internals) into each page chunk,
        // which drags in these packages transitively. Rollup then
        // inlines their filesystem-relative `require`s in a way that
        // breaks once relocated into the chunk output (Linux-only,
        // see https://github.com/withastro/astro/issues/16679).
        // Externalizing them requires they also be resolvable via
        // node_modules at runtime, hence the matching devDependencies.
        external: [
          'fsevents',
          '@astrojs/compiler-rs',
          'svgo',
          'csso',
          'css-tree',
          /^vite($|\/)/,
          /^esbuild($|\/)/,
        ],
      },
    },
  },
});
