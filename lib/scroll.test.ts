import { describe, expect, it } from "vitest"

import { shouldResetScroll } from "@/lib/scroll"

describe("shouldResetScroll", () => {
	const base = { pathnameChanged: true, isTraversal: false, hash: "" }

	it("resets a plain push to a new pathname", () => {
		expect(shouldResetScroll(base)).toBe(true)
	})

	it("leaves a reload or an unchanged pathname alone", () => {
		expect(shouldResetScroll({ ...base, pathnameChanged: false })).toBe(false)
	})

	it("leaves a hash destination to the anchor", () => {
		expect(shouldResetScroll({ ...base, hash: "#incluye" })).toBe(false)
	})

	it("leaves back and forward to the browser", () => {
		expect(shouldResetScroll({ ...base, isTraversal: true })).toBe(false)
	})

	it("does not turn a traversal into a reset just because a hash changed", () => {
		expect(shouldResetScroll({ ...base, isTraversal: true, hash: "#top" })).toBe(false)
	})
})
