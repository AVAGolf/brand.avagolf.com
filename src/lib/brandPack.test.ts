import { describe, expect, it, vi } from "vitest";
import { FALLBACK, formatBytes, formatDate, loadBrandPack, packSummary, parseManifest } from "./brandPack";

// The shape AVAGolf/AVA-Golf-Brand-Assets' workflow writes (its jq call).
const manifest = {
	version: "1.0.3",
	tag: "brand-pack-v1.0.3",
	published: "2026-09-27T14:03:11Z",
	bytes: 376970681,
	sha256: "a".repeat(64),
	commit: "0123456789abcdef0123456789abcdef01234567",
	url: "https://brand.avagolf.com/files/AVA_Golf_Brand_Pack.zip",
	filename: "AVA_Golf_Brand_Pack_v1.0.3.zip",
};

const respond = (status: number, body: string) => async () => new Response(body, { status });

describe("brand pack manifest", () => {
	it("reads the manifest the brand-pack workflow publishes", () => {
		const pack = parseManifest(manifest);
		expect(pack).toMatchObject({ version: "1.0.3", filename: "AVA_Golf_Brand_Pack_v1.0.3.zip", source: "manifest" });
		expect(packSummary(pack)).toBe("V1.0.3 · Updated 27 Sep 2026 · 377 MB");
	});

	it("refuses a malformed manifest, naming what is wrong", () => {
		expect(() => parseManifest([])).toThrow(/not a JSON object/);
		expect(() => parseManifest({ ...manifest, version: "v1.0" })).toThrow(/version must be X\.Y\.Z/);
		expect(() => parseManifest({ ...manifest, tag: "brand-pack-v1.0.2" })).toThrow(/tag must be/);
		expect(() => parseManifest({ ...manifest, bytes: "377 MB" })).toThrow(/bytes must be a positive integer/);
		expect(() => parseManifest({ ...manifest, published: "yesterday" })).toThrow(/published/);
		expect(() => parseManifest({ ...manifest, filename: "../x.zip" })).toThrow(/filename/);
	});

	it("formats sizes in decimal units and dates in UTC", () => {
		expect(formatBytes(376970681)).toBe("377 MB");
		expect(formatBytes(5_400_000)).toBe("5.4 MB");
		expect(formatBytes(999_600)).toBe("1 MB");
		expect(formatBytes(1_250_000_000)).toBe("1.3 GB");
		expect(formatBytes(512)).toBe("512 B");
		expect(formatDate("2026-09-27T23:59:59Z")).toBe("27 Sep 2026");
		expect(formatDate("2026-01-01T00:00:00Z")).toBe("1 Jan 2026");
	});

	it("falls back to 1.0.0 with a warning until the manifest is published", async () => {
		const warn = vi.fn();
		const pack = await loadBrandPack({ fetch: respond(404, "Not Found"), warn });
		expect(pack).toBe(FALLBACK);
		expect(packSummary(pack)).toBe("V1.0.0");
		expect(warn).toHaveBeenCalledOnce();
	});

	it("fails the build on anything but a 404 or a good manifest", async () => {
		await expect(loadBrandPack({ fetch: respond(503, "") })).rejects.toThrow(/answered 503/);
		await expect(loadBrandPack({ fetch: respond(200, "<html>") })).rejects.toThrow(/not valid JSON/);
		await expect(loadBrandPack({ fetch: respond(200, JSON.stringify({ version: "1" })) })).rejects.toThrow(
			/malformed/,
		);
		const offline = async () => {
			throw new TypeError("fetch failed");
		};
		await expect(loadBrandPack({ fetch: offline })).rejects.toThrow(/Could not fetch/);
		expect(await loadBrandPack({ fetch: offline, dev: true, warn: () => {} })).toBe(FALLBACK);
	});

	it("uses a good manifest as it is", async () => {
		const pack = await loadBrandPack({ fetch: respond(200, JSON.stringify(manifest)) });
		expect(pack.version).toBe("1.0.3");
		expect(pack.bytes).toBe(376970681);
	});
});
