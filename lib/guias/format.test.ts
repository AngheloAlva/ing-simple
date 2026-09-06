import { describe, expect, it } from "vitest"

import { formatGuiaDate } from "@/lib/guias/format"

describe("formatGuiaDate", () => {
	it("formats an ISO date as a long Spanish date", () => {
		expect(formatGuiaDate("2026-09-06")).toBe("6 de septiembre de 2026")
	})

	it("does not shift the day across timezones", () => {
		expect(formatGuiaDate("2026-01-01")).toBe("1 de enero de 2026")
		expect(formatGuiaDate("2026-12-31")).toBe("31 de diciembre de 2026")
	})
})
