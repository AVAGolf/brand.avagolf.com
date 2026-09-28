import eslintPluginAstro from "eslint-plugin-astro";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    // shared-components/ and scripts/ci/ are copies of avagolf.com, linted there.
    ignores: ["dist/**", ".astro/**", "node_modules/**", "shared-components/**", "scripts/ci/**"],
  },
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    // The two `is:inline` scripts that run as written, before anything loads
    // (eslint-plugin-astro lints every <script> as a virtual <file>/N_N.ts):
    // the Consent Mode bootstrap in components/site/CookieConsent.astro and
    // the gtag.js snippet in layouts/Layout.astro. Two rules are wrong there:
    //   prefer-rest-params: gtag() MUST push `arguments`. gtag.js only treats a
    //     dataLayer entry as a command when it is an arguments object; a rest
    //     array is read as a data message and silently dropped, and the
    //     property records nothing. This broke once already.
    //   no-var: they are plain ES5 by design, so they run before any tooling.
    files: ["src/components/site/CookieConsent.astro/*.ts", "src/layouts/Layout.astro/*.ts"],
    rules: {
      "prefer-rest-params": "off",
      "no-var": "off",
    },
  },
  {
    files: ["**/*.d.ts"],
    rules: {
      "@typescript-eslint/triple-slash-reference": "off",
    },
  },
);
