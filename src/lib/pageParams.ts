// The measurement vocabulary for brand.avagolf.com pages, in the shape
// news.avagolf.com's src/lib/pageParams.ts uses (itself after avagolf.com's),
// with brand's own page families: the three sidebar groups in
// src/lib/sections.ts.
//
// Brand keeps its own gtag.js (G-X34R7TJNMF) and pushes nothing to the
// dataLayer, so today only `CtaPosition` is used, by src/lib/appLinks.ts.
// The rest is here so brand reports the same `site`/`page_group`/
// `content_slug` as news the day it moves to the shared GTM container.

import { sections, type SectionGroup } from "./sections";

/** Page families: the sidebar's groups, plus the pages outside them. */
export type PageGroup =
	| "home"
	| "core_identity"
	| "brand_elements"
	| "communication"
	| "tokens"
	| "not_found"
	| "other";

/** Where on the page a CTA sits. Same vocabulary as avagolf.com and news. */
export type CtaPosition = "hero" | "inline" | "footer" | "sticky" | "nav";

export interface PageParams {
	site: "brand";
	page_group: PageGroup;
	/** On a guideline page: its slug, e.g. "colors". */
	content_slug?: string;
}

const GROUPS: Record<SectionGroup, PageGroup> = {
	"Core Identity": "core_identity",
	"Brand Elements": "brand_elements",
	Communication: "communication",
};

function firstSegment(pathname: string): string {
	return pathname.replace(/^\/+|\/+$/g, "").split("/")[0] ?? "";
}

export function pageGroup(pathname: string): PageGroup {
	const slug = firstSegment(pathname);
	if (slug === "") return "home";
	if (slug === "tokens") return "tokens";
	if (slug === "404" || slug === "404.html") return "not_found";
	const section = sections.find((s) => s.slug === slug);
	return section ? GROUPS[section.group] : "other";
}

/** The parameters one page reports. Pure: pass a pathname, get the vocabulary. */
export function pageParams(pathname: string): PageParams {
	const params: PageParams = { site: "brand", page_group: pageGroup(pathname) };
	const slug = firstSegment(pathname);
	if (slug && sections.some((s) => s.slug === slug)) params.content_slug = slug;
	return params;
}
