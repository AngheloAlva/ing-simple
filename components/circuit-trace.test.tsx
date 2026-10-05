import { renderToStaticMarkup } from "react-dom/server"
import { beforeEach, describe, expect, it, vi } from "vitest"

const preference = vi.hoisted(() => ({ project: false, motion: true }))

// Control the provider's snapshot without requiring browser APIs in SSR tests.
vi.mock("react", async (importOriginal) => {
	const actual = await importOriginal<typeof import("react")>()
	return { ...actual, useSyncExternalStore: () => preference.project }
})

vi.mock("motion/react", async (importOriginal) => {
	const actual = await importOriginal<typeof import("motion/react")>()
	return { ...actual, useReducedMotion: () => preference.motion }
})

import { CircuitTrace } from "@/components/circuit-trace"
import { ReducedMotionProvider } from "@/lib/motion"

function renderTrace() {
	return renderToStaticMarkup(
		<ReducedMotionProvider>
			<CircuitTrace />
		</ReducedMotionProvider>
	)
}

describe("CircuitTrace reduced-motion preference", () => {
	beforeEach(() => {
		preference.project = false
		preference.motion = true
	})

	it("retains pulses and animated cores when project motion is enabled despite Motion's preference", () => {
		const html = renderTrace()
		const paths = html.match(/<path\b[^>]*>/g) ?? []
		const cores = html.match(/<circle\b[^>]*r="1\.9"[^>]*>/g) ?? []

		expect(paths).toHaveLength(10)
		expect(paths.filter((path) => path.includes('stroke-dasharray="0.14 0.86"'))).toHaveLength(5)
		expect(cores).toHaveLength(5)
		for (const core of cores) {
			expect(core).toContain(' opacity="0.25"')
			expect(core).not.toContain("fill-opacity")
		}
	})

	it("renders static cores without pulses when the project reduces motion despite Motion's preference", () => {
		preference.project = true
		preference.motion = false
		const html = renderTrace()
		const paths = html.match(/<path\b[^>]*>/g) ?? []
		const cores = html.match(/<circle\b[^>]*r="1\.9"[^>]*>/g) ?? []

		expect(paths).toHaveLength(5)
		expect(html).not.toContain("stroke-dasharray")
		expect(cores).toHaveLength(5)
		for (const core of cores) {
			expect(core).toContain('fill-opacity="0.35"')
			expect(core).not.toContain(' opacity="0.25"')
		}
	})
})
