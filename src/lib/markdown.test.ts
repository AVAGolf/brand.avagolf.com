import { describe, expect, it } from "vitest";
import { pageMarkdown } from "./markdown";

// A page as BrandLayout builds it, cut down to the parts the conversion treats
// specially.
const page = (header: string, main: string) => `<!doctype html><html><head>
<meta name="description" content="The site-wide default description.">
</head><body>
<nav><a href="/">Nav link</a></nav>
<header data-nav-hero><p>Eyebrow</p><h1>Colors</h1>${header}</header>
<main>${main}</main>
<footer>Footer</footer>
</body></html>`;

const URL = "https://brand.avagolf.com/colors/";

describe("pageMarkdown", () => {
  it("heads the twin with the title, the subtitle and the page's URL", async () => {
    const md = await pageMarkdown(page("<p>The palette.</p>", "<h2>Primary</h2>"), URL, "Fallback.");
    expect(md.startsWith("# Colors\n\n> The palette.\n\nSource: https://brand.avagolf.com/colors/\n\n## Primary\n")).toBe(
      true,
    );
  });

  it("uses the caller's summary when the page has no subtitle", async () => {
    const md = await pageMarkdown(page("", "<h2>Primary</h2>"), URL, "Primary and secondary palettes.");
    expect(md).toContain("> Primary and secondary palettes.");
    expect(md).not.toContain("site-wide default");
  });

  it("converts only <main>", async () => {
    const md = await pageMarkdown(page("", "<p>Copy.</p>"), URL);
    expect(md).not.toMatch(/Nav link|Footer|Eyebrow/);
  });

  it("drops scripts, comments, buttons and decoration", async () => {
    const md = await pageMarkdown(
      page(
        "",
        `<!-- PRIMARY PALETTE --><p>Kept.</p><script>alert(1)</script><button>Copy</button>
         <span aria-hidden="true">|</span><svg><text>svg</text></svg>`,
      ),
      URL,
    );
    expect(md).toContain("Kept.");
    expect(md).not.toMatch(/PRIMARY PALETTE|alert|Copy|\||svg/);
  });

  it("collapses a color swatch to one line", async () => {
    const md = await pageMarkdown(
      page("", `<div style="background-color: #349683"><p>green-500</p><p>HEX: #349683</p><p>CMYK: 77 21 56 3</p></div>`),
      URL,
    );
    expect(md).toContain("green-500 · HEX: #349683 · CMYK: 77 21 56 3");
  });

  it("makes links and images absolute, and uses the real file of an animated screenshot", async () => {
    const md = await pageMarkdown(
      page(
        "",
        `<a href="/brand/a.jpg">Download</a>
         <img src="data:image/gif;base64,R0lGOD" data-animate-src="/brand/ghost.webp" alt="Ghost Mode">
         <img src="data:image/gif;base64,R0lGOD" alt="placeholder">`,
      ),
      URL,
    );
    expect(md).toContain("[Download](https://brand.avagolf.com/brand/a.jpg)");
    expect(md).toContain("![Ghost Mode](https://brand.avagolf.com/brand/ghost.webp)");
    expect(md).not.toContain("data:");
  });

  it("keeps Shiki's language on code blocks", async () => {
    const md = await pageMarkdown(
      page("", `<pre data-language="html"><code><span>&lt;img /&gt;</span></code></pre>`),
      URL,
    );
    expect(md).toContain("```html\n<img />\n```");
  });
});
