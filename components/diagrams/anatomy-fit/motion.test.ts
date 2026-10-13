import { describe, expect, it } from "vitest"
import { sequenceAt, motionDuration } from "./motion"

describe("generic system incompatibility demonstration", () => {
	it("starts with an empty opening and three named processes outside", () => {
		const state = sequenceAt(0)
		expect(state.positions.square).toEqual({ x: 0, y: -60, z: 4 })
		expect(state.positions.cross).toEqual({ x: -90, y: 0, z: 4 })
		expect(state.positions.bar).toEqual({ x: 90, y: 0, z: 4 })
		expect(state.accepted).toBe(0)
		expect(state.manual).toBe(0)
	})

	it.each([
		["cross", 1.3, "Precios por cliente: no encaja"],
		["bar", 4.5, "Turnos: no encaja"],
	] as const)(
		"stops %s on the fixed rim while the opening is still empty",
		(piece, time, caption) => {
			const state = sequenceAt(time)
			expect(state.positions[piece]).toEqual({ x: 0, y: 0, z: 28 })
			expect(state.positions.square).toEqual({ x: 0, y: -60, z: 4 })
			expect(state.outcomes[piece]).toBe("Manual")
			expect(state.caption).toBe(caption)
			expect(state.accepted).toBe(0)
			for (let t = 0; t <= motionDuration; t += 0.01) {
				const pose = sequenceAt(t).positions[piece]
				if (Math.abs(pose.x) < 25) expect(pose.z).toBeGreaterThanOrEqual(28)
			}
		}
	)

	it("leaves incompatible processes outside for manual work and inserts approvals last", () => {
		const state = sequenceAt(motionDuration)
		expect(state.positions.square).toEqual({ x: 0, y: 0, z: 8 })
		expect(state.positions.cross).toEqual({ x: -90, y: 0, z: 4 })
		expect(state.positions.bar).toEqual({ x: 90, y: 0, z: 4 })
		expect(state.outcomes).toEqual({ square: "Dentro", cross: "Manual", bar: "Manual" })
		expect(state.accepted).toBe(1)
		expect(state.manual).toBe(2)
		expect(state.caption).toBe("1 proceso dentro · 2 manuales")
		expect(sequenceAt(motionDuration + 20)).toEqual(state)
	})
})
