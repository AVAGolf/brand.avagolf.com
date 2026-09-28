// Copied from news.avagolf.com's src/lib/robots.test.ts, unchanged.
import { describe, expect, it } from "vitest";
import { AI_AGENTS, robotsTxt } from "./robots";

describe("robots.txt", () => {
	const txt = robotsTxt({
		llms: "https://news.avagolf.com/llms.txt",
		sitemaps: [{ url: "https://news.avagolf.com/sitemap.xml" }],
	});

	it("disallows nothing and names every AI agent", () => {
		expect(txt).not.toMatch(/^Disallow:/m);
		for (const agent of AI_AGENTS) expect(txt).toContain(`User-agent: ${agent}`);
	});

	it("lists the sitemaps", () => {
		expect(txt).toContain("Sitemap: https://news.avagolf.com/sitemap.xml");
	});
});
