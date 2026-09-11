import { describe, expect, it } from "vitest"

import { brandGradient, brandGradientGreen } from "@/lib/gradient"

describe("brandGradient", () => {
	it("starts on the tint token and ends on the text-safe primary token", () => {
		expect(brandGradient[0]).toBe("var(--brand-tint)")
		expect(brandGradient[1]).toBe("var(--primary)")
	})
})

describe("brandGradientGreen", () => {
	it("stays unchanged", () => {
		expect(brandGradientGreen).toEqual(["var(--brand-green)", "var(--color-green-600)"])
	})
})
