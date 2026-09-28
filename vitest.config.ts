/// <reference types="vitest/config" />
// Tests run through Astro's own Vite config, so the `@/` and `@shared/`
// aliases resolve exactly as they do in `astro build`. scripts/ci/ is taken
// from avagolf.com and carries its workflows.test.ts, which parses every file
// in .github/workflows/ here too. shared-components/ keeps its own tests,
// which run in avagolf.com.
import { getViteConfig } from "astro/config";

export default getViteConfig({
	test: {
		include: ["src/**/*.test.ts", "scripts/**/*.test.ts"],
	},
});
