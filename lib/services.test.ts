import { describe, expect, it } from "vitest"

import { SERVICES } from "@/lib/services"

describe("SERVICES page copy", () => {
	it("gives every service its own problem headline with an accent", () => {
		const headlines = SERVICES.map((service) => service.page.problemTitle)

		for (const service of SERVICES) {
			expect(service.page.problemTitle.trim()).not.toBe("")
			expect(service.page.problemTitleAccent.trim()).not.toBe("")
		}
		expect(new Set(headlines).size).toBe(SERVICES.length)
	})
})
