import { describe, expect, it } from "vitest"

import { canAnimateRipple, canHandleRipplePointer, resolveCanvasColor } from "./ascii-ripple"

describe("resolveCanvasColor", () => {
	it("resolves the inherited primary token before Canvas receives it", () => {
		const properties = new Map([
			["--primary", "oklch(0.3745 0.1497 305)"],
		])

		expect(resolveCanvasColor("var(--primary)", (name) => properties.get(name) ?? "")).toBe(
			"oklch(0.3745 0.1497 305)",
		)
	})

	it("uses the active theme or service scope each time it resolves", () => {
		const light = resolveCanvasColor("var(--primary)", () => "oklch(0.3745 0.1497 259.6115)")
		const serviceDark = resolveCanvasColor("var(--primary)", () => "oklch(0.66 0.11 205)")

		expect(light).toBe("oklch(0.3745 0.1497 259.6115)")
		expect(serviceDark).toBe("oklch(0.66 0.11 205)")
	})

	it("resolves neutral idle text independently from the primary ripple colors", () => {
		const properties = new Map([
			["--muted-foreground", "oklch(0.56 0.02 260)"],
			["--primary", "oklch(0.66 0.11 205)"],
		])
		const getPropertyValue = (name: string) => properties.get(name) ?? ""

		expect(resolveCanvasColor("var(--muted-foreground)", getPropertyValue)).toBe(
			"oklch(0.56 0.02 260)",
		)
		expect(resolveCanvasColor("var(--primary)", getPropertyValue)).toBe("oklch(0.66 0.11 205)")
	})

	it("runs only while visible and when motion is allowed", () => {
		expect(canAnimateRipple({ inViewport: true, documentVisible: true, reducedMotion: false })).toBe(true)
		expect(canAnimateRipple({ inViewport: false, documentVisible: true, reducedMotion: false })).toBe(false)
		expect(canAnimateRipple({ inViewport: true, documentVisible: false, reducedMotion: false })).toBe(false)
		expect(canAnimateRipple({ inViewport: true, documentVisible: true, reducedMotion: true })).toBe(false)
	})

	it("allows pointer ripples unless reduced motion disables them", () => {
		expect(canHandleRipplePointer(true, false)).toBe(true)
		expect(canHandleRipplePointer(false, false)).toBe(false)
		expect(canHandleRipplePointer(true, true)).toBe(false)
	})
})
