/// <reference path="../.astro/types.d.ts" />

// Globals the page scripts share. The Consent Mode bootstrap in
// components/site/CookieConsent.astro creates dataLayer and window.gtag
// before anything else runs; the banner publishes showCookiePreferences for
// the shared footer's cookie buttons.

interface Window {
  dataLayer: unknown[];
  gtag: (...args: unknown[]) => void;
  /** Published by CookieConsent once the banner loads. */
  showCookiePreferences?: () => void;
}

interface Navigator {
  readonly globalPrivacyControl?: boolean;
}
