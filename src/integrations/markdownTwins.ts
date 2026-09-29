import { readFile, writeFile } from "node:fs/promises";
import type { AstroIntegration } from "astro";
import { pageMarkdown } from "../lib/markdown";
import { markdownHref, sectionHref, sections } from "../lib/sections";

// Writes a Markdown twin of every guideline page into dist/ once the HTML is
// built (/voice/index.html -> /voice.md), and /llms-full.txt, every twin in
// sidebar order in one file. /llms.txt links the twins; each page links its
// own from <head> (rel="alternate" type="text/markdown").
//
// They're made from the built HTML rather than from the .astro sources, so
// they carry exactly what the page shows. The conversion is in
// src/lib/markdown.ts. /tokens/ has no twin: it's swatches and type
// specimens, and its values are on /colors/ and /typography/. `astro dev`
// doesn't run this hook: build, then `npm run preview`, to see them.
//
// The deploy uploads *.md and *.txt with an explicit UTF-8 content type (see
// .github/workflows/deploy.yml); S3 would otherwise guess one without a
// charset, and the copy's — and ’ would arrive garbled.

const sentence = (s: string) => `${s.charAt(0).toUpperCase()}${s.slice(1)}.`;

const FULL_INTRO = `# AVA Golf Brand Guidelines — full text

> Every page of the AVA Golf brand guidelines (https://brand.avagolf.com/) as Markdown, in one file. The index, with a summary of the facts most often needed, is https://brand.avagolf.com/llms.txt; each page is also served on its own, at the URL given under its title.`;

export default function markdownTwins(): AstroIntegration {
  // The config's `site`, not src/lib/schema.ts's SITE: this file is loaded with
  // astro.config.mjs, before the `@shared/` alias schema.ts imports through exists.
  let site = "";
  return {
    name: "markdown-twins",
    hooks: {
      "astro:config:done": ({ config }) => {
        if (!config.site) throw new Error("markdown-twins needs `site` in astro.config.mjs");
        site = config.site.replace(/\/$/, "");
      },
      "astro:build:done": async ({ dir, logger }) => {
        const pages: string[] = [];
        for (const page of sections) {
          const htmlPath = new URL(page.slug ? `${page.slug}/index.html` : "index.html", dir);
          const md = await pageMarkdown(
            await readFile(htmlPath, "utf8"),
            `${site}${sectionHref(page)}`,
            sentence(page.description),
          );
          await writeFile(new URL(markdownHref(page).slice(1), dir), md);
          pages.push(md.trim());
        }
        await writeFile(new URL("llms-full.txt", dir), `${[FULL_INTRO, ...pages].join("\n\n---\n\n")}\n`);
        logger.info(`${pages.length} Markdown twins and llms-full.txt written`);
      },
    },
  };
}
