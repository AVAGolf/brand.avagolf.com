import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

// Each collection is a single .md file whose frontmatter carries every item, in
// render order. Prose lives in `body` as one string per paragraph — written as
// finished copy, so type the real characters (— and ’) rather than markdown
// shorthand; the strings are rendered verbatim.

// src/content/screenshots.md -> /application/
const screenshots = defineCollection({
  loader: glob({ pattern: "screenshots.md", base: "./src/content" }),
  schema: z.object({
    items: z.array(
      z.object({
        title: z.string(),
        alt: z.string(),
        // <image>.webp is shown on the page, <image>.jpg is the download.
        image: z.string(),
        body: z.array(z.string()),
      }),
    ),
  }),
});

// src/content/assets.md -> /assets/
const assets = defineCollection({
  loader: glob({ pattern: "assets.md", base: "./src/content" }),
  schema: z.object({
    items: z.array(
      z.object({
        title: z.string(),
        alt: z.string(),
        image: z.string(),
        caption: z.string().optional(),
        // <image>.<preview> is shown; every <image>.<ext> in formats is offered
        // as a download, so each referenced file must exist.
        preview: z.string().default("png"),
        formats: z.array(z.string()).default(["jpg", "png"]),
        body: z.array(z.string()),
      }),
    ),
  }),
});

// src/content/guides/<slug>.md -> /<slug>/ (src/pages/[slug].astro); the
// product-design sections of the guide, one Markdown file per page.
const guides = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/guides" }),
  schema: z.object({
    title: z.string(),
    eyebrow: z.string(),
    subtitle: z.string(),
    // ADR filenames under docs/decisions/ in the app repo that this page rests on.
    adrs: z.array(z.string()).default([]),
  }),
});

export const collections = { screenshots, assets, guides };
