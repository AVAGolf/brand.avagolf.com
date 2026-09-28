import { SOCIALS } from "@shared/data/socials";
import { brandPack, formatBytes, formatDate, MANIFEST_URL, PACK_PATH, type BrandPack } from "@/lib/brandPack";
import { SITE } from "@/lib/schema";
import { groupOrder, sectionHref, sectionsByGroup } from "@/lib/sections";

// /llms.txt, generated at build time rather than kept as a static file in
// public/, the way news.avagolf.com generates its own.
//
// The guideline links come from src/lib/sections.ts, the list the sidebar and
// the mobile menu render, so a new page can't be left out of this file. The
// brand pack line comes from the pack's manifest (src/lib/brandPack.ts), so it
// names the version the download button offers.
//
// The shape follows the llms.txt v2 spec (https://llmstxt.org/): an H1, a
// blockquote summary, prose with no headings, then H2 sections that hold
// nothing but `- [name](url): notes` lines. Parsers drop anything else under an
// H2, so prose added below a heading is invisible to them; put it in DETAILS.
//
// The prose below is hand-written. Edit it here.

const INTRO = `# AVA Golf Brand Guidelines

> The official brand guidelines for AVA Golf, the first golf intelligence system: it aggregates and analyzes performance data from every platform a golfer uses, applies machine learning to identify exactly what to work on, and delivers a personalized video playlist from Top 100 teaching professionals. This site covers logo marks, colors, typography, brand elements, and communication principles, for partners, agencies, designers, and AI systems that need accurate brand context.`;

const DETAILS = `The guideline pages linked below are HTML. The facts most often needed are summarized here, so most brand questions can be answered from this file alone. For the product itself (pricing, integrations, coaches), use the main site's file at https://avagolf.com/llms.txt.

**Identity.** Brand name: AVA Golf. Parent company: ParOne, Inc. Category: AI golf performance; AVA Golf describes itself as a golf intelligence system.

**Name use.** Use "AVA Golf" when introducing the brand, and in all external communications where it appears for the first time. Once context is established, "AVA" is the more human, conversational name: an intelligent companion guiding golfers through their improvement. In logo lockups, never use "AVA" on its own.

**Messaging:**

- Tagline: "Get Better. Faster." Used for marketing at first contact with the brand, to create curiosity.
- Short description: AVA Golf is a golf intelligence system that unifies your performance data (from simulators, launch monitors, and on-course tracking) and turns it into personalized, video-led coaching from Top 100 instructors.
- Values: Precision, Discipline, Calibration
- Pillars: Data with Direction, Personalized Progression, Mastery without Guesswork
- Voice: Intelligent (clarity and expertise, accessible but performance-focused); Confident (assured, never exaggerated, grounded in real outcomes); Grounded (no hype, no gimmicks; precision and trust above all)
- Audience: committed, data-aware golfers invested in improving: the Competitive Improver, the Tech-Enabled Golfer, and the Self-Guided Athlete. Not an entry-level platform, and never elitist.

**Logo:**

- Primary: Side by Side combination mark (icon plus wordmark, horizontal). Use it whenever possible.
- Secondary: Icon (standalone, for audiences who already know the brand or as a graphic element) and Stacked Logo (for limited horizontal space)
- Tertiary: Wordmark, Stacked Wordmark, Small Stacked Logo
- Color variants: Dark + Imagery (light logos for dark backgrounds, imagery, and video), Mid, Light + Bright (dark logos, never over imagery), and Mono
- Clearspace: at least 50% of the icon size around the icon and combination marks; at least 100% of the Y axis around wordmarks; the TM symbol is excluded from the boundary
- Never distort, stretch, rotate, recolor, outline, or add effects to a logo, rearrange a lockup, or use a low-resolution file

**Colors.** Primary palette: green-500 #349683, green-900 #16382E, yellow-500 #FFE708, yellow-300 #FFFF4A, white #FFFFFF. Secondary: bright-green-500 #17DEB7 and the dark greens, with dark-green-900 #070E0C as the page background. Full scale: green-300 #95CBC1, green-700 #225142, dark-green-300 #132A23, dark-green-500 #10211C, dark-green-700 #0B1C16, grey-300 #F4F4F2. Gradients: green-fade (#349683 to #16382E), dark-green-fade (#16382E to #070E0C), yellow-fade (#FFFF4A to #FFE708).

**Typography:**

- Display and headings: Google Sans Flex Black (1000), always uppercase
- Titles and body copy: Google Sans Flex (full weight range)
- Stats and secondary display: Construct Mono
- Technical text: DM Mono`;

/** The pack paragraph: version, date and size when the manifest has them. */
function packDetails(pack: BrandPack): string {
  const url = `${SITE}${PACK_PATH}`;
  const what =
    "logo files, ready-to-use marks, color swatches (Adobe .ase), the typefaces, and the brand element assets";
  if (pack.source === "fallback") {
    return `**Brand pack.** Version ${pack.version}: ${what}, in one zip at ${url}.`;
  }
  const date = pack.published ? `, updated ${formatDate(pack.published)}` : "";
  const size = pack.bytes ? ` ${formatBytes(pack.bytes)}` : "";
  return (
    `**Brand pack.** Version ${pack.version}${date}: ${what}, in one${size} zip at ${url}. ` +
    `Its version, date, size and SHA-256 are in ${MANIFEST_URL}, and what changed in each version is listed at https://github.com/AVAGolf/AVA-Golf-Brand-Assets/releases.`
  );
}

/** "Core Identity" -> "Core identity", as the file's headings have always read. */
const sentenceCase = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();

export async function GET() {
  const pack = await brandPack();
  const groups = sectionsByGroup();

  const sections = groupOrder.map((group) =>
    [
      `## ${sentenceCase(group)}`,
      "",
      ...groups[group].map((s) => `- [${sentenceCase(s.title)}](${SITE}${sectionHref(s)}): ${s.description}`),
    ].join("\n"),
  );

  const optional = [
    "## Optional",
    "",
    `- [Design tokens](${SITE}/tokens/): every color, gradient, and type style on one page`,
    "- [AVA Golf main site](https://avagolf.com/llms.txt): the product, pricing, integrations, and coaches",
    ...SOCIALS.map((social) => `- [${social.name}](${social.url})`),
  ].join("\n");

  const body = [INTRO, DETAILS, packDetails(pack), ...sections, optional].join("\n\n");
  return new Response(`${body}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
