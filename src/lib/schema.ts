// Copied from news.avagolf.com's src/lib/schema.ts. Changed: SITE, the
// WebSite name, the logo (a file this site serves), and the node builders:
// news's article and collection nodes are gone, and brandGuide() describes the
// guidelines themselves, with the brand pack as their download.
//
// JSON-LD for brand.avagolf.com, as one @graph per page.
//
// Every AVA site describes the same company, so every page carries the same
// Organization node under one stable @id. Search engines and answer engines
// merge nodes that share an @id, which turns four sites' worth of pages into
// one entity with one set of profiles, rather than four near-duplicates they
// have to reconcile. Pages refer to it by @id (publisher, isPartOf) instead of
// repeating it.
//
// `sameAs` comes from avagolf.com's shared-components/data/socials.ts, the list
// the shared footer renders, so a new profile shows up here too.

import { SOCIALS } from "@shared/data/socials";
import { PACK_PATH, formatBytes, type BrandPack } from "./brandPack";

export const SITE = "https://brand.avagolf.com";
export const ORG_ID = "https://avagolf.com/#organization";
export const WEBSITE_ID = `${SITE}/#website`;
export const GUIDE_ID = `${SITE}/#brand-guidelines`;

export type Node = Record<string, unknown>;

export const absolute = (url: string): string =>
	/^https?:\/\//i.test(url) ? url : `${SITE}${url.startsWith("/") ? "" : "/"}${url}`;

export function organization(): Node {
	return {
		"@type": "Organization",
		"@id": ORG_ID,
		name: "AVA Golf, Inc.",
		alternateName: "AVA Golf",
		url: "https://avagolf.com/",
		logo: {
			"@type": "ImageObject",
			url: `${SITE}/avagolf-sxs-color.svg`,
		},
		slogan: "Get Better. Faster.",
		description:
			"AVA Golf is the first golf intelligence system: it aggregates and analyzes performance data from every platform a golfer uses, applies machine learning to identify exactly what to work on, and delivers a personalized video playlist from Top 100 teaching professionals.",
		email: "support@avagolf.com",
		sameAs: SOCIALS.map((social) => social.url),
		parentOrganization: {
			"@type": "Organization",
			name: "ParOne, Inc.",
			url: "https://parone.com",
		},
	};
}

export function website(pack: BrandPack): Node {
	return {
		"@type": "WebSite",
		"@id": WEBSITE_ID,
		name: "AVA Golf Brand Guidelines",
		url: `${SITE}/`,
		description:
			"Official brand guidelines for AVA Golf — covering logo marks, color palette, typography, brand elements, and communication principles.",
		inLanguage: "en-US",
		version: pack.version,
		publisher: { "@id": ORG_ID },
		mainEntity: { "@id": GUIDE_ID },
	};
}

/** The guidelines as a work, with the brand pack as its download. */
export function brandGuide(pack: BrandPack): Node {
	const node: Node = {
		"@type": "CreativeWork",
		"@id": GUIDE_ID,
		name: "AVA Golf Brand Identity System",
		description:
			"Complete visual and communication identity for AVA Golf including logo marks, color palette, typography, brand elements, and voice guidelines.",
		url: `${SITE}/`,
		version: pack.version,
		creator: { "@id": ORG_ID },
		publisher: { "@id": ORG_ID },
		isPartOf: { "@id": WEBSITE_ID },
	};
	if (pack.published) node.dateModified = pack.published;
	const media: Node = {
		"@type": "MediaObject",
		name: "AVA Golf Brand Pack",
		contentUrl: absolute(PACK_PATH),
		encodingFormat: "application/zip",
		version: pack.version,
	};
	if (pack.bytes) media.contentSize = formatBytes(pack.bytes);
	if (pack.published) media.uploadDate = pack.published;
	if (pack.sha256) media.sha256 = pack.sha256;
	node.associatedMedia = media;
	return node;
}

export interface BreadcrumbItem {
	name: string;
	href?: string;
}

export function breadcrumbs(items: BreadcrumbItem[]): Node {
	return {
		"@type": "BreadcrumbList",
		itemListElement: items.map((crumb, index) => {
			const item: Node = { "@type": "ListItem", position: index + 1, name: crumb.name };
			if (crumb.href) item.item = absolute(crumb.href);
			return item;
		}),
	};
}

/** The one <script type="application/ld+json"> body for a page. */
export function graph(pack: BrandPack, nodes: (Node | undefined)[] = []): string {
	return JSON.stringify({
		"@context": "https://schema.org",
		"@graph": [organization(), website(pack), brandGuide(pack), ...nodes.filter(Boolean)],
	});
}
