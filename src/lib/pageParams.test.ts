import { describe, expect, it } from "vitest";
import { pageGroup, pageParams } from "./pageParams";
import { sections } from "./sections";

describe("pageParams", () => {
	it("names every route family", () => {
		expect(pageGroup("/")).toBe("home");
		expect(pageGroup("/logo-marks/")).toBe("core_identity");
		expect(pageGroup("/application/")).toBe("brand_elements");
		expect(pageGroup("/voice/")).toBe("communication");
		expect(pageGroup("/tokens/")).toBe("tokens");
		expect(pageGroup("/404.html")).toBe("not_found");
		expect(pageGroup("/files/AVA_Golf_Brand_Pack.zip")).toBe("other");
	});

	it("gives every guideline page a group from its sidebar section", () => {
		for (const s of sections.filter((s) => s.slug)) {
			expect(pageGroup(`/${s.slug}/`)).not.toBe("other");
		}
	});

	it("always says which site, and the slug on a guideline page", () => {
		expect(pageParams("/")).toEqual({ site: "brand", page_group: "home" });
		expect(pageParams("/colors/")).toEqual({ site: "brand", page_group: "core_identity", content_slug: "colors" });
		expect(pageParams("/tokens/").content_slug).toBeUndefined();
	});
});
