// Copied from news.avagolf.com's src/lib/robots.ts, unchanged.
// Change it there first, then copy it here and to docs.avagolf.com.
//
// robots.txt, generated so every AVA site allows the same crawlers. The agent
// list is avagolf.com's (public/robots.txt there); brand.avagolf.com and
// docs.avagolf.com copy this file and pass their own sitemaps and llms.txt.

/** AI assistants and answer engines, explicitly welcome to read and cite us. */
export const AI_AGENTS = [
	"GPTBot",
	"OAI-SearchBot",
	"ChatGPT-User",
	"ClaudeBot",
	"Claude-User",
	"Claude-SearchBot",
	"PerplexityBot",
	"Perplexity-User",
	"Google-Extended",
	"Applebot-Extended",
	"Amazonbot",
	"cohere-ai",
];

export function robotsTxt(opts: { llms: string; sitemaps: { url: string; note?: string }[] }): string {
	const lines = [
		"# Nothing is disallowed on purpose: a Disallow hides a page from the crawler",
		"# but does not remove it from the index. Pages that should stay out of search",
		"# carry noindex instead.",
		"User-agent: *",
		"Allow: /",
		"",
		"# AI assistants and answer engines are explicitly welcome to read and cite AVA Golf.",
		`# Structured summary for LLMs: ${opts.llms}`,
		...AI_AGENTS.map((agent) => `User-agent: ${agent}`),
		"Allow: /",
		"",
	];
	for (const map of opts.sitemaps) {
		if (map.note) lines.push(`# ${map.note}`);
		lines.push(`Sitemap: ${map.url}`);
	}
	return lines.join("\n") + "\n";
}
