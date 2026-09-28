// Copied from news.avagolf.com's src/pages/build.json.ts, unchanged.
import { existsSync, readFileSync } from "node:fs";

// /build.json: what this deploy was built from. `shared` is the avagolf.com
// commit whose shared-components/ the build took (scripts/
// take-shared-components.sh writes it), so a nav or footer difference between
// the sites can be traced to the commit each one rendered.
export function GET() {
  const source = "shared-components/SOURCE";
  const body = {
    commit: process.env.GITHUB_SHA ?? null,
    shared: existsSync(source) ? readFileSync(source, "utf8").trim() : null,
    built: new Date().toISOString(),
  };
  return new Response(JSON.stringify(body, null, 2) + "\n", {
    headers: { "Content-Type": "application/json" },
  });
}
