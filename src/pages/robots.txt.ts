import { robotsTxt } from "@/lib/robots";
import { SITE } from "@/lib/schema";

// robots.txt, generated so brand allows the same crawlers as every AVA site
// (src/lib/robots.ts, originally news.avagolf.com's). The sitemap is
// @astrojs/sitemap's index.
export function GET() {
  const body = robotsTxt({
    llms: `${SITE}/llms.txt`,
    sitemaps: [{ url: `${SITE}/sitemap-index.xml` }],
  });
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
