// Copied from news.avagolf.com's src/lib/consentRegion.ts, unchanged.
// Change it there first, then copy it here and to docs.avagolf.com.
//
// Client-side region guess for the two places that cannot ask Google.
//
// Consent Mode's `region:` parameter is resolved SERVER-SIDE from the visitor's
// IP, which is what actually governs whether a GTM tag fires (see the defaults
// in src/components/CookieConsent.astro). Nothing here overrides that. This
// module exists for the two things that run in the page and have no geo signal
// of its own: the consent banner's category toggles, which should start in the
// state the visitor is actually in rather than contradicting it. (The OpenAI
// pixel needed this too until it moved into the container, where `ad_storage`
// covers it.)
//
// The proxy is the browser's IANA time zone: no network call, no IP handling,
// no new data collected. It is allowed to be wrong — a European on a US clock
// sees pre-checked toggles while Google still denies their tags, and a US
// traveller in Paris sees unchecked ones while their tags fire. Neither state
// leaks data, because the authority is elsewhere. An unreadable time zone is
// treated as Europe: the guess fails toward the stricter regime.

const EUROPE_TZ =
	/^(Europe\/|Atlantic\/(Canary|Azores|Madeira|Faroe|Reykjavik)|Asia\/(Nicosia|Famagusta))/;

/** True where the opt-in regime should be assumed (EEA, UK, Switzerland). */
export function isEuropeLike(): boolean {
	try {
		return EUROPE_TZ.test(
			Intl.DateTimeFormat().resolvedOptions().timeZone || "",
		);
	} catch {
		return true;
	}
}

/** Global Privacy Control, the browser-level opt-out from advertising. */
export function gpcOptOut(): boolean {
	if (typeof navigator === "undefined") return false;
	return (
		(navigator as Navigator & { globalPrivacyControl?: boolean })
			.globalPrivacyControl === true
	);
}

/** Where Analytics sits before the visitor has chosen. Mirrors the defaults. */
export function analyticsDefaultsOn(): boolean {
	return !isEuropeLike();
}

/** Where Marketing sits before the visitor has chosen. GPC always wins. */
export function marketingDefaultsOn(): boolean {
	return !isEuropeLike() && !gpcOptOut();
}
