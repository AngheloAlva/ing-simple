import { describe, expect, it } from "vitest"
import { duration, playbackAt, stateAt } from "./model"

describe("knowledge concentrated in one person", () => {
	it("starts only on interaction, then finishes even after hover or focus ends", () => {
		expect(playbackAt(0, false, false)).toEqual({ time: 0, running: false, started: false })
		expect(playbackAt(0, true, false)).toEqual({ time: 0, running: true, started: true })
		expect(playbackAt(2, false, false, true)).toEqual({ time: 2, running: true, started: true })
		expect(playbackAt(duration, false, false, true)).toEqual({
			time: duration,
			running: false,
			started: true,
		})
		expect(playbackAt(duration, true, false, true)).toEqual({
			time: duration,
			running: false,
			started: true,
		})
	})

	it("keeps reduced motion on the static explanatory result, regardless of hover", () => {
		for (const active of [false, true]) {
			expect(playbackAt(0, active, true)).toEqual({
				time: duration,
				running: false,
				started: active,
			})
		}
	})

	it("resolves the first request while the knowledgeable person is available", () => {
		const initial = stateAt(0)
		expect(initial.available).toBe(true)
		expect(initial.resolved).toBe(0)
		expect(initial.waiting).toBe(0)
		const handled = stateAt(2.7)
		expect(handled.available).toBe(true)
		expect(handled.personOpacity).toBe(1)
		expect(handled.resolved).toBe(1)
		expect(handled.waiting).toBe(0)
		expect(handled.papers[0]!.position).toEqual({ x: 85, y: 8, z: 6 })
	})

	it("accumulates one request per area only after the person leaves, without resolving more", () => {
		expect(stateAt(3.4).available).toBe(false)
		expect(stateAt(3.4).personOpacity).toBe(0)
		for (const [time, count] of [
			[4.5, 1],
			[5.5, 2],
			[6.5, 3],
		]) {
			const state = stateAt(time!)
			expect(state.available).toBe(false)
			expect(state.resolved).toBe(1)
			expect(state.waiting).toBe(count)
			expect(state.papers.filter((p) => p.status === "waiting")).toHaveLength(count!)
			expect(state.areas.filter((a) => a.status === "En espera")).toHaveLength(count!)
		}
	})

	it("leaves a stable, explicit blocked result without looping or inventing a replacement", () => {
		const final = stateAt(duration)
		expect(final.personOpacity).toBe(0)
		expect(final.caption).toBe("Trabajo pendiente · Sin alguien que pueda retomarlo")
		expect(final.summary).toBe("1 resuelta · 3 en espera")
		expect(final.areas.map((a) => a.name)).toEqual(["Ventas", "Depósito", "Administración"])
		expect(final.areas.every((a) => a.status === "En espera")).toBe(true)
		expect(final.papers.slice(1).map((p) => p.position)).toEqual([
			{ x: -12, y: 8, z: 5 },
			{ x: 0, y: 15, z: 7.5 },
			{ x: 12, y: 22, z: 10 },
		])
		expect(stateAt(duration + 100)).toEqual(final)
	})
})
