import { describe, expect, it } from "vitest"
import { duration, poseAt } from "./model"

describe("automation station demonstration", () => {
	it("receives, validates and registers a complete request", () => {
		expect(poseAt(0, "complete")).toMatchObject({
			phase: "Entrada",
			x: -84,
			y: 0,
			completed: false,
		})
		expect(poseAt(2.5, "complete")).toMatchObject({
			phase: "Validando datos",
			x: -16,
			y: 0,
			completed: false,
		})
		expect(poseAt(duration, "complete")).toEqual({
			phase: "Solicitud registrada",
			x: 90,
			y: -30,
			completed: true,
		})
	})

	it("holds a request with missing data for manual review instead of registering it", () => {
		expect(poseAt(2.5, "missing")).toMatchObject({
			phase: "Validando datos",
			x: -16,
			y: 0,
			completed: false,
		})
		expect(poseAt(duration, "missing")).toEqual({
			phase: "Revisión manual",
			x: 90,
			y: 30,
			completed: false,
		})
		for (let time = 0; time <= duration; time += 0.05) {
			expect(poseAt(time, "missing").completed).toBe(false)
		}
	})

	it("keeps the card within the tray and takes a continuous path on both routes", () => {
		for (const scenario of ["complete", "missing"] as const) {
			let previous = poseAt(0, scenario)
			for (let time = 0.01; time <= duration; time += 0.01) {
				const pose = poseAt(time, scenario)
				expect(pose.x).toBeGreaterThanOrEqual(-84)
				expect(pose.x).toBeLessThanOrEqual(90)
				expect(Math.abs(pose.y)).toBeLessThanOrEqual(30)
				expect(Math.hypot(pose.x - previous.x, pose.y - previous.y)).toBeLessThan(2)
				previous = pose
			}
		}
	})
})
