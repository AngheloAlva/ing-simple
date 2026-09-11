import { describe, expect, it, vi } from "vitest"

import { ReliefBoundary } from "./relief-boundary"

describe("ReliefBoundary", () => {
	it("marks itself as failed when a child throws", () => {
		expect(ReliefBoundary.getDerivedStateFromError()).toEqual({ failed: true })
	})

	it("renders its children while nothing has failed", () => {
		const boundary = new ReliefBoundary({ children: "sculpture" })

		expect(boundary.render()).toBe("sculpture")
	})

	it("renders nothing once failed, so the still underneath keeps showing", () => {
		const boundary = new ReliefBoundary({ children: "sculpture" })
		boundary.state = { failed: true }

		expect(boundary.render()).toBeNull()
	})

	it("reports the failure to its caller", () => {
		const onError = vi.fn()
		const boundary = new ReliefBoundary({ children: "sculpture", onError })

		boundary.componentDidCatch()

		expect(onError).toHaveBeenCalledOnce()
	})
})
