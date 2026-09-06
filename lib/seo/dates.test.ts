import { describe, expect, it } from "vitest"
import { parseSpanishMonthYear } from "@/lib/seo/dates"

describe("parseSpanishMonthYear", () => {
	it("parses a plain Spanish month and year", () => {
		expect(parseSpanishMonthYear("Enero 2025")).toBe("2025-01-01")
	})

	it("is case-insensitive", () => {
		expect(parseSpanishMonthYear("marzo 2025")).toBe("2025-03-01")
	})

	it("parses every month name", () => {
		expect(parseSpanishMonthYear("Diciembre 2026")).toBe("2026-12-01")
		expect(parseSpanishMonthYear("Julio 2024")).toBe("2024-07-01")
	})

	it("returns undefined for a month range", () => {
		expect(parseSpanishMonthYear("Feb – Mar 2025")).toBeUndefined()
	})

	it("returns undefined for a relative label", () => {
		expect(parseSpanishMonthYear("Hoy")).toBeUndefined()
	})

	it("returns undefined for a sentence containing extra words", () => {
		expect(
			parseSpanishMonthYear("En producción desde Mayo 2026"),
		).toBeUndefined()
	})

	it("returns undefined for an empty string", () => {
		expect(parseSpanishMonthYear("")).toBeUndefined()
	})
})
