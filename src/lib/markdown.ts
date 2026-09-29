import type { Element, ElementContent, Root } from "hast";
import { select, selectAll } from "hast-util-select";
import rehypeParse from "rehype-parse";
import rehypeRemark from "rehype-remark";
import remarkGfm from "remark-gfm";
import remarkStringify from "remark-stringify";
import { unified } from "unified";

// The Markdown twin of a built guideline page: /voice/ -> /voice.md.
//
// Coding agents read the brand far better from Markdown than from the HTML,
// which is mostly Tailwind classes, swatch <div>s and copy-button scripts. The
// twin is made from the built HTML (see src/integrations/markdownTwins.ts)
// rather than written by hand, so it can't drift from the page: edit the
// .astro file and both change on the next build.
//
// Only <main> is converted, the part of the page that is this page's own; the
// nav, sidebar, pagination and footer are the same on every page. The title
// and summary come from BrandHeader's <h1> and subtitle, outside <main>; a page
// with no subtitle takes the caller's summary (its line in src/lib/sections.ts).

/** A parsed page, cleaned up for conversion. Exported for the tests. */
export function prepare(tree: Root, site: string): { title: string; subtitle: string; main: Element } {
  const title = textOf(select("h1", tree)).trim();
  const subtitle = textOf(select("h1 + p", tree)).trim();
  const main = select("main", tree);
  if (!main) throw new Error("no <main> in page");

  strip(main);
  for (const el of selectAll("*", main)) {
    const props = el.properties;

    // AnimatedScreenshot ships a 1px GIF and swaps in the real file on scroll.
    if (el.tagName === "img" && typeof props.dataAnimateSrc === "string") props.src = props.dataAnimateSrc;
    for (const key of ["href", "src"] as const) {
      const value = props[key];
      if (typeof value === "string" && !value.startsWith("data:")) props[key] = new URL(value, site).href;
    }

    // Shiki's <pre data-language="html"> -> ```html.
    if (el.tagName === "pre" && typeof props.dataLanguage === "string") {
      const code = select("code", el);
      if (code) code.properties.className = [`language-${props.dataLanguage}`];
    }
  }
  for (const img of selectAll('img[src^="data:"]', main)) {
    remove(main, img);
  }
  collapseSwatches(main);

  return { title, subtitle, main };
}

/** Markdown for one built page, headed by its title, summary and URL. */
export async function pageMarkdown(html: string, url: string, summary = ""): Promise<string> {
  const tree = unified().use(rehypeParse).parse(html);
  const { title, subtitle, main } = prepare(tree, new URL(url).origin);

  const root: Root = { type: "root", children: [main] };
  const processor = unified()
    .use(rehypeRemark)
    .use(remarkGfm)
    .use(remarkStringify, { bullet: "-", emphasis: "_", rule: "-" });
  const body = processor.stringify(await processor.run(root)).trim();

  const head = [`# ${title}`, (subtitle || summary) && `> ${subtitle || summary}`, `Source: ${url}`].filter(Boolean);
  return `${head.join("\n\n")}\n\n${body}\n`;
}

/** Scripts, styles, decoration and controls: nothing an agent can read. */
const DROP = "script, style, noscript, template, svg, button, [aria-hidden='true']";

function strip(main: Element) {
  for (const el of selectAll(DROP, main)) remove(main, el);
  // HTML comments (<!-- PRIMARY PALETTE -->) are layout notes, not copy.
  const walk = (node: Element) => {
    node.children = node.children.filter((c) => c.type !== "comment");
    for (const c of node.children) if (c.type === "element") walk(c);
  };
  walk(main);
}

/**
 * ColorSwatch renders a colored <div> of short <p>s (name, HEX, CMYK), which
 * would become three one-word paragraphs. One line per swatch reads better:
 * "green-500 · HEX: #349683 · CMYK: 77 21 56 3".
 */
function collapseSwatches(main: Element) {
  for (const el of selectAll('div[style*="background-color"]', main)) {
    const parts = el.children.filter((c): c is Element => c.type === "element");
    if (parts.length === 0 || parts.some((p) => p.tagName !== "p")) continue;
    const text = parts.map((p) => textOf(p).trim()).filter(Boolean).join(" · ");
    el.tagName = "p";
    el.children = [{ type: "text", value: text }];
  }
}

function textOf(node: Element | ElementContent | undefined): string {
  if (!node) return "";
  if (node.type === "text") return node.value;
  if (node.type === "element") return node.children.map(textOf).join("");
  return "";
}

function remove(root: Element, target: Element) {
  const walk = (node: Element): boolean => {
    const i = node.children.indexOf(target);
    if (i >= 0) {
      node.children.splice(i, 1);
      return true;
    }
    return node.children.some((c) => c.type === "element" && walk(c));
  };
  walk(root);
}
