import { readFileSync } from "node:fs"
import { renderToStaticMarkup } from "react-dom/server"
import { beforeEach, describe, expect, it, vi } from "vitest"

const preference = vi.hoisted(() => ({ project: false, motion: true }))

// Drive the project provider's snapshot independently of Motion's preference.
vi.mock("react", async (importOriginal) => {
	const actual = await importOriginal<typeof import("react")>()
	return { ...actual, useSyncExternalStore: () => preference.project }
})

vi.mock("motion/react", async (importOriginal) => {
	const actual = await importOriginal<typeof import("motion/react")>()
	return { ...actual, useReducedMotion: () => preference.motion }
})

// Isolate timeline attributes from the decorative diagrams' own markup.
vi.mock("@/components/diagrams/process/audit-scan", () => ({ DiagramAuditScan: () => null }))
vi.mock("@/components/diagrams/process/proposal-convert", () => ({ DiagramProposalConvert: () => null }))
vi.mock("@/components/diagrams/process/rollout-gantt", () => ({ DiagramRolloutGantt: () => null }))
vi.mock("@/components/diagrams/process/support-feed", () => ({ DiagramSupportFeed: () => null }))

import { HowItWorks } from "@/components/how-it-works"
import { ReducedMotionProvider } from "@/lib/motion"

function initialAttributes() {
	const html = renderToStaticMarkup(
		<ReducedMotionProvider>
			<HowItWorks />
		</ReducedMotionProvider>
	)
	const heading = html.match(/<div\b[^>]*>(?:(?!<div\b)[\s\S])*?<h2 id="how-it-works-heading"/)?.[0]
	const steps = html.match(/<li\b[\s\S]*?<\/li>/g) ?? []
	const connectors = steps.map((step) => {
		// The first hidden div is the visual frame, then the bed and active connector.
		return step.match(/<div\b[^>]*aria-hidden="true"[^>]*>/g) ?? []
	})
	return { html, heading, steps, connectors }
}

describe("HowItWorks reduced-motion initial attributes", () => {
	beforeEach(() => {
		preference.project = false
		preference.motion = true
	})

	it("scopes the reduced-motion entrance class to the heading wrapper and four steps only", () => {
		const { html, heading, steps } = initialAttributes()

		expect(heading).toMatch(/class="[^"]*\bhow-it-works-entrance\b[^"]*"/)
		expect(steps).toHaveLength(4)
		for (const step of steps) {
			expect(step.match(/^<li\b[^>]*>/)?.[0]).toMatch(
				/class="[^"]*\bhow-it-works-entrance\b[^"]*"/
			)
		}
		expect(html.match(/\bhow-it-works-entrance\b/g)).toHaveLength(5)
	})

	it("overrides only entrance transforms inside the reduced-motion media query", () => {
		// This checks CSS structure, not browser-computed styles or hydration.
		const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8")
		const reducedRules = css.match(/@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*?\n\}/g) ?? []
		const entranceRule = /\.how-it-works-entrance\s*\{\s*transform:\s*none\s*!important;\s*\}/

		expect(reducedRules.some((rule) => entranceRule.test(rule))).toBe(true)
		expect(css.match(/\.how-it-works-entrance\b/g)).toHaveLength(1)
	})

	it("retains entrance offsets and hidden connectors when project motion is enabled despite Motion's preference", () => {
		const { heading, steps, connectors } = initialAttributes()

		expect(heading).toContain('style="opacity:0;transform:translateY(20px)"')
		expect(steps).toHaveLength(4)
		for (const [index, step] of steps.entries()) {
			expect(step.match(/^<li\b[^>]*>/)?.[0]).toContain('style="opacity:0;transform:translateY(24px)"')
			expect(connectors[index]).toHaveLength(index === 3 ? 4 : 3)
			expect(connectors[index]?.[2]).toContain('style="transform:scaleX(0)"')
		}
		expect(connectors[3]?.[3]).toContain('style="opacity:0"')
	})

	it("removes entrance offsets and renders visible connectors when the project reduces motion despite Motion's preference", () => {
		preference.project = true
		preference.motion = false
		const { heading, steps, connectors } = initialAttributes()

		expect(heading).toContain('style="opacity:0;transform:none"')
		expect(steps).toHaveLength(4)
		for (const [index, step] of steps.entries()) {
			expect(step.match(/^<li\b[^>]*>/)?.[0]).toContain('style="opacity:0;transform:none"')
			expect(connectors[index]).toHaveLength(index === 3 ? 4 : 3)
			expect(connectors[index]?.[2]).not.toContain("style=")
		}
		expect(connectors[3]?.[3]).not.toContain("style=")
	})
})
