import { describe, expect, it } from "vitest"

import { isStillVisible } from "./cover-relief-state"

describe("isStillVisible", () => {
	it("shows the still while the sculpture is not ready", () => {
		expect(isStillVisible({ sculptReady: false, reducedMotion: false })).toBe(true)
	})

	it("hides the still once the sculpture is ready", () => {
		expect(isStillVisible({ sculptReady: true, reducedMotion: false })).toBe(false)
	})

	it("shows the still under reduced motion even if the sculpture was ready", () => {
		expect(isStillVisible({ sculptReady: true, reducedMotion: true })).toBe(true)
	})

	it("shows the still under reduced motion before the sculpture was ready", () => {
		expect(isStillVisible({ sculptReady: false, reducedMotion: true })).toBe(true)
	})
})
