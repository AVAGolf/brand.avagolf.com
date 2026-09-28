// Copied from news.avagolf.com's src/lib/appLinks.ts, unchanged.
// Change it there first, then copy it here and to docs.avagolf.com.
//
// Attribution hand-off for links that leave news.avagolf.com for the app.
//
// Ported from avagolf.com's src/lib/appLinks.ts. The one difference: news has
// no /analyze/ tree, so the type/brand/device trio avagolf.com derives from
// its routes is never sent from here. brand.avagolf.com and docs.avagolf.com
// copy this file unchanged.
//
// Both domains are on the property's domain list, so the linker's `_gl` carries
// the session and its source across the hop by itself. These parameters are the
// things `_gl` does not carry:
//
//   • the original utm_* and ad click IDs, forwarded verbatim, so a signup lands
//     under the campaign that paid for it rather than under "direct"
//   • src_page / src_cta / src_brand: first-party context saying which page and
//     which button produced the click
//   • cta: where on the page the link sits (see src/lib/pageParams.ts). The
//     app reads it off /onboarding/welcome and carries it through to
//     `purchase`.
//
// Deliberately NOT done here:
//   • internal links are never touched, and no campaign is invented for the app
//     link either. A utm_* the visit did not arrive with starts a new GA4
//     session and overwrites the original acquisition source — see the long
//     note in `appLinkParams` for why that used to happen and what it cost.
//   • `ref` is not used as a parameter name: avagolf.com uses ?ref= for
//     referral codes.

import type { CtaPosition } from "./pageParams";

/** Hosts treated as the app. Anything else is left alone. */
const APP_HOSTS = ["app.avagolf.com"];

/** Forwarded verbatim when present on the landing URL. */
const CAMPAIGN_KEYS = [
	"utm_source",
	"utm_medium",
	"utm_campaign",
	"utm_term",
	"utm_content",
	"utm_id",
	"utm_source_platform",
];

/** Ad click identifiers. gclid is the one Google Ads conversion import needs;
 *  rdt_cid is what the app's Reddit Conversions API send attributes on. */
const CLICK_IDS = ["gclid", "gbraid", "wbraid", "fbclid", "msclkid", "ttclid", "twclid", "rdt_cid"];

/** "/news/september-2026-update/" → "news_september-2026-update"; "/" → "home". */
export function pageSlug(pathname: string): string {
	const slug = pathname.replace(/^\/+|\/+$/g, "").replace(/\//g, "_");
	return slug === "" ? "home" : slug.toLowerCase();
}

export interface DecorateOptions {
	/** The URL the visitor landed on, as a string. */
	href: string;
	/** Overrides for tests. */
	hosts?: string[];
}

/** Build the parameters one app link should carry. Pure, so it can be tested
 *  without a DOM. `linkContext` comes off the anchor's own data attributes. */
export function appLinkParams(
	landingHref: string,
	linkContext: {
		/** First-party button name, e.g. "analyze_hero". Becomes `src_cta`. */
		cta?: string;
		/** The page's trackId, e.g. "rounds_golfpad". Becomes `src_brand`. Not
		 *  the GA4 `brand` dimension, which is the route's own brand segment and
		 *  is derived below — the two must not be conflated. */
		brand?: string;
		/** Where on the page the link sits. Becomes `cta`. */
		position?: CtaPosition | string;
	} = {},
): Record<string, string> {
	const landing = new URL(landingHref);
	const inbound = landing.searchParams;
	const out: Record<string, string> = {};

	for (const key of CAMPAIGN_KEYS) {
		const v = inbound.get(key);
		if (v) out[key] = v;
	}
	for (const key of CLICK_IDS) {
		const v = inbound.get(key);
		if (v) out[key] = v;
	}

	// Deliberately NOT synthesising a campaign here any more.
	//
	// This used to stamp utm_source=avagolf.com / utm_medium=marketing_site on
	// any hand-off that arrived without an inbound utm_source, so the app would
	// not file the signup under "direct". Two things make that wrong now.
	//
	// The first is that it lies about paid traffic. A Meta click carries an
	// `fbclid` and often no utm_* at all; a ChatGPT click has no auto-tagging to
	// fall back on. Both arrive with no utm_source, so both used to be renamed
	// "avagolf.com / marketing_site" at the domain boundary — the paid source
	// destroyed at the one hop where it mattered. Google survived only because
	// `gclid` rides separately and is forwarded below. So the Meta and ChatGPT
	// halves of a flight would have reported nothing.
	//
	// The second is that the hand-off is no longer a cross-property hop at all.
	// With both domains on the property's domain list, the linker's `_gl`
	// carries the session and its original source across by itself — and a
	// campaign parameter arriving mid-session is precisely what starts a NEW
	// session and overwrites the acquisition source. The synthesised campaign
	// went from a useful fiction to the thing breaking attribution.
	//
	// Real inbound utm_* and click IDs are still forwarded verbatim above; that
	// is what preserves the paid source rather than replacing it. Where the
	// visit genuinely had no campaign, it now stays genuinely uncampaigned, and
	// `src_page` / `src_cta` below still say which page and button produced the
	// click without pretending to be an acquisition source.

	if (linkContext.position) out.cta = linkContext.position;

	out.src_page = pageSlug(landing.pathname);
	if (linkContext.cta) out.src_cta = linkContext.cta;
	if (linkContext.brand) out.src_brand = linkContext.brand;
	return out;
}

/** Rewrite every app link in the document. Runs on load rather than on click so
 *  middle-click, open-in-new-tab and copy-link all carry the same parameters,
 *  and so the destination is visible on hover. Idempotent. */
export function decorateAppLinks(
	doc: Document = document,
	landingHref: string = location.href,
	hosts: string[] = APP_HOSTS,
): number {
	let touched = 0;
	const anchors = doc.querySelectorAll<HTMLAnchorElement>("a[href]");
	for (const a of anchors) {
		if (a.dataset.appLinkTagged) continue;
		let url: URL;
		try {
			url = new URL(a.href, landingHref);
		} catch {
			continue;
		}
		if (!hosts.includes(url.hostname)) continue;

		const holder = a.closest<HTMLElement>("[data-cta-location],[data-cta-brand]");
		// `data-cta` is inherited from the nearest ancestor that sets one, so a
		// whole region declares its position once — <footer data-cta="footer">,
		// <header data-cta="nav"> — instead of every anchor inside it repeating
		// the word. `closest` matches the anchor itself first, so a link that
		// sets its own still wins.
		const position = a.closest<HTMLElement>("[data-cta]");
		const params = appLinkParams(landingHref, {
			cta: a.dataset.ctaLocation ?? holder?.dataset.ctaLocation,
			brand: a.dataset.ctaBrand ?? holder?.dataset.ctaBrand,
			position: position?.dataset.cta,
		});
		for (const [k, v] of Object.entries(params)) {
			// A parameter already on the link wins: it was set deliberately.
			if (!url.searchParams.has(k)) url.searchParams.set(k, v);
		}
		a.href = url.toString();
		a.dataset.appLinkTagged = "1";
		touched++;
	}
	return touched;
}
