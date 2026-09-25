import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

import {
	CASE_VISUAL_PREFIX,
	DIRECTIONAL_CLASSES,
	GUIA_COVER_PREFIX,
	NAV_BACK,
	NAV_FORWARD,
	navLinkProps,
	navLinkTransitionTypes,
	SERVICE_VISUAL_PREFIX,
	SITE_NAV_TRANSITION_NAME,
	viewTransitionName,
} from "@/lib/view-transitions"

const css = readFileSync(fileURLToPath(new URL("../app/globals.css", import.meta.url)), "utf8")

describe("view-transition contracts", () => {
	it.each([
		["/", "/servicios/desarrollo-web", [NAV_FORWARD]],
		["/casos/otc-360", "/casos", [NAV_BACK]],
		["/guias", "/guias/example", [NAV_FORWARD]],
		["/servicios/desarrollo-web", "/servicios/reportabilidad", []],
		["/casos/otc-360", "/casos/busanc", []],
		["/", "/casos", []],
		["/casos", "/guias", []],
		["/casos", "/casos", [NAV_BACK]],
	] as const)("types a nav link from %s to %s", (pathname, href, expected) => {
		expect(navLinkTransitionTypes(href, pathname)).toEqual(expected)
	})

	it("omits transitionTypes for lateral links", () => {
		expect(navLinkProps("/servicios/desarrollo-web", "/")).toEqual({
			transitionTypes: [NAV_FORWARD],
		})
		const props = navLinkProps("/casos", "/")
		expect("transitionTypes" in props).toBe(false)
	})

	it("starts the incoming fade together with the outgoing one", () => {
		// The root is live, so the page group is the only content on screen for the
		// whole transition. A fade delayed until the outgoing one finishes leaves the
		// viewport blank at the handover — measured as a fully white frame around
		// 150ms, which on a whole page reads as a flash. Each enter rule therefore
		// fades from t=0 and only outlasts the exit instead of waiting for it.
		for (const direction of [NAV_FORWARD, NAV_BACK]) {
			const start = css.indexOf(`::view-transition-new(.${direction})`)
			const end = css.indexOf("}", start)
			expect(start, `missing ::view-transition-new(.${direction})`).toBeGreaterThan(-1)
			expect(css.slice(start, end)).not.toContain("var(--vt-duration-exit)")
		}
	})

	it("keeps the CSS recipes for the named elements and directions", () => {
		for (const selector of [
			"::view-transition-group(site-nav)",
			"::view-transition-old(site-nav)",
			"::view-transition-new(site-nav)",
			"::view-transition-old(.nav-forward)",
			"::view-transition-new(.nav-forward)",
			"::view-transition-old(.nav-back)",
			"::view-transition-new(.nav-back)",
			"::view-transition-group(.morph)",
			"::view-transition-image-pair(.morph)",
		]) {
			expect(css).toContain(selector)
		}
	})

	it("uses the same persistent nav name in TypeScript and CSS", () => {
		const name = css.match(/::view-transition-group\((site-nav)\)/)?.[1]
		expect(name).toBeDefined()
		expect(SITE_NAV_TRANSITION_NAME).toBe(name)
	})

	it("opts unrelated transitions out and distinguishes navigation directions", () => {
		expect(DIRECTIONAL_CLASSES).toHaveProperty("default", "none")
		expect(NAV_FORWARD).not.toBe(NAV_BACK)
	})

	it("builds distinct names for each flow", () => {
		expect(viewTransitionName("guia-cover", "x")).toBe("guia-cover-x")
		expect(new Set([SERVICE_VISUAL_PREFIX, GUIA_COVER_PREFIX, CASE_VISUAL_PREFIX]).size).toBe(3)
	})
})
