// The brand pack's version, date and size, read at build time from the
// manifest AVAGolf/AVA-Golf-Brand-Assets publishes next to the zip.
//
// That repo's workflow builds the pack on every content change, bumps a
// brand-pack-vX.Y.Z tag, overwrites the one zip at /files/AVA_Golf_Brand_Pack.zip
// and then writes /files/brand-pack.json:
//
//   { version, tag, published (ISO 8601), bytes, sha256, commit, url, filename }
//
// and starts this repo's deploy.yml, so the site shows the new number within
// minutes. The homepage, the JSON-LD and llms.txt all read it through
// brandPack(), which fetches it once per build.
//
// Until that workflow has run once the manifest 404s. The build then falls back
// to the number the site showed before versioning (1.0.0) and prints a warning,
// so CI and deploys keep working. A manifest that exists but is malformed fails
// the build instead: publishing a wrong version is worse than not publishing.

export const MANIFEST_URL = "https://brand.avagolf.com/files/brand-pack.json";
/** Where the zip is served. Fixed: each version overwrites the same key. */
export const PACK_PATH = "/files/AVA_Golf_Brand_Pack.zip";

export interface BrandPack {
	version: string;
	/** Name the download is saved under, e.g. AVA_Golf_Brand_Pack_v1.0.3.zip. */
	filename: string;
	/** Present when the manifest was read; absent on the bootstrap fallback. */
	tag?: string;
	published?: string;
	bytes?: number;
	sha256?: string;
	commit?: string;
	url?: string;
	source: "manifest" | "fallback";
}

/** What the site showed before the pack was versioned. */
export const FALLBACK: BrandPack = {
	version: "1.0.0",
	filename: "AVA_Golf_Brand_Pack.zip",
	source: "fallback",
};

const SEMVER = /^\d+\.\d+\.\d+$/;

/** Validate a parsed manifest. Throws, naming every bad field, if it isn't one. */
export function parseManifest(data: unknown): BrandPack {
	if (!data || typeof data !== "object" || Array.isArray(data)) {
		throw new Error("brand-pack.json is not a JSON object");
	}
	const m = data as Record<string, unknown>;
	const problems: string[] = [];
	const str = (key: string) => (typeof m[key] === "string" && m[key] !== "" ? (m[key] as string) : undefined);

	const version = str("version");
	if (!version || !SEMVER.test(version)) problems.push(`version must be X.Y.Z (got ${JSON.stringify(m.version)})`);
	const tag = str("tag");
	if (!tag || (version && tag !== `brand-pack-v${version}`)) {
		problems.push(`tag must be brand-pack-v<version> (got ${JSON.stringify(m.tag)})`);
	}
	const published = str("published");
	if (!published || Number.isNaN(Date.parse(published))) {
		problems.push(`published must be an ISO 8601 date (got ${JSON.stringify(m.published)})`);
	}
	const bytes = m.bytes;
	if (typeof bytes !== "number" || !Number.isInteger(bytes) || bytes <= 0) {
		problems.push(`bytes must be a positive integer (got ${JSON.stringify(bytes)})`);
	}
	const sha256 = str("sha256");
	if (!sha256 || !/^[0-9a-f]{64}$/i.test(sha256)) problems.push("sha256 must be 64 hex characters");
	const commit = str("commit");
	if (!commit || !/^[0-9a-f]{7,40}$/i.test(commit)) problems.push("commit must be a git SHA");
	const url = str("url");
	if (!url || !/^https:\/\//.test(url)) problems.push(`url must be an https URL (got ${JSON.stringify(m.url)})`);
	const filename = str("filename");
	if (!filename || !/^[\w.-]+\.zip$/.test(filename)) {
		problems.push(`filename must be a plain .zip file name (got ${JSON.stringify(m.filename)})`);
	}

	if (problems.length) throw new Error(`brand-pack.json is malformed: ${problems.join("; ")}`);
	return {
		version: version!,
		tag,
		published,
		bytes: bytes as number,
		sha256,
		commit,
		url,
		filename: filename!,
		source: "manifest",
	};
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-09-27T14:03:11Z" -> "27 Sep 2026", in UTC so the build machine's
 *  time zone never moves the date. */
export function formatDate(iso: string): string {
	const d = new Date(iso);
	return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** Decimal units, as the download dialog and the Brand-Assets run summary
 *  show them: 376970681 -> "377 MB", 5400000 -> "5.4 MB". */
export function formatBytes(bytes: number): string {
	const units = ["B", "KB", "MB", "GB", "TB"];
	let value = bytes;
	let unit = 0;
	while (value >= 1000 && unit < units.length - 1) {
		value /= 1000;
		unit++;
	}
	const rounded = unit === 0 || value >= 10 ? Math.round(value) : Math.round(value * 10) / 10;
	// 999.6 KB rounds up to 1000; say 1 MB instead.
	if (rounded >= 1000 && unit < units.length - 1) return `1 ${units[unit + 1]}`;
	return `${rounded} ${units[unit]}`;
}

/** The line under the download button: "V1.0.3 · Updated 27 Sep 2026 · 377 MB". */
export function packSummary(pack: BrandPack): string {
	const parts = [`V${pack.version}`];
	if (pack.published) parts.push(`Updated ${formatDate(pack.published)}`);
	if (pack.bytes) parts.push(formatBytes(pack.bytes));
	return parts.join(" · ");
}

export interface LoadOptions {
	fetch?: typeof fetch;
	warn?: (message: string) => void;
	/** Dev server: an unreachable manifest falls back instead of failing. */
	dev?: boolean;
}

function annotate(message: string): string {
	// On a line of its own: Astro's route log leaves its current line open, and
	// Actions only reads a ::warning:: at the start of a line (it then shows on
	// the run's summary page as well as in the log).
	return process.env.GITHUB_ACTIONS
		? `\n::warning title=Brand pack manifest::${message}`
		: `\n[brand-pack] ${message}`;
}

/** Read the manifest. 404 -> the fallback with a warning; malformed -> throws. */
export async function loadBrandPack(options: LoadOptions = {}): Promise<BrandPack> {
	const doFetch = options.fetch ?? fetch;
	const warn = options.warn ?? ((message: string) => console.warn(annotate(message)));

	let res: Response;
	try {
		res = await doFetch(MANIFEST_URL, {
			headers: { accept: "application/json" },
			signal: AbortSignal.timeout(15_000),
		});
	} catch (error) {
		if (options.dev) {
			warn(`${MANIFEST_URL} is unreachable (${String(error)}); showing ${FALLBACK.version}.`);
			return FALLBACK;
		}
		throw new Error(`Could not fetch ${MANIFEST_URL}: ${String(error)}`, { cause: error });
	}

	if (res.status === 404) {
		warn(
			`${MANIFEST_URL} is not published yet (404), so the site shows ${FALLBACK.version}. ` +
				"AVAGolf/AVA-Golf-Brand-Assets writes it on its first versioned run.",
		);
		return FALLBACK;
	}
	if (!res.ok) throw new Error(`${MANIFEST_URL} answered ${res.status}; not guessing a version.`);

	let data: unknown;
	try {
		data = await res.json();
	} catch (error) {
		throw new Error(`brand-pack.json is malformed: not valid JSON (${String(error)})`, { cause: error });
	}
	return parseManifest(data);
}

let cached: Promise<BrandPack> | undefined;

/** The pack, fetched once per build and shared by every page that asks. */
export function brandPack(): Promise<BrandPack> {
	cached ??= loadBrandPack({ dev: import.meta.env.DEV });
	return cached;
}
