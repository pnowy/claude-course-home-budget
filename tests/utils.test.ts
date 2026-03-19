import { describe, expect, it } from "vitest";

import { cn } from "#/lib/utils";

describe("cn", () => {
	it("merges and deduplicates Tailwind classes", () => {
		expect(cn("px-2 py-1", "px-4", "font-semibold")).toBe(
			"py-1 px-4 font-semibold",
		);
	});
});
