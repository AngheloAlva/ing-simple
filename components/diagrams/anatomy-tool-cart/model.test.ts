import { describe, expect, it } from "vitest"
import { drawers, duration, loopPause, loopTime, playbackAt, stateAt } from "./model"

describe("paid tools used at a fraction", () => {
	it("starts with three closed drawers, one per paid tool", () => {
		expect(drawers.map(({ name, tools, used }) => [name, tools, used.length])).toEqual([
			["Power Apps", 6, 0],
			["Power BI", 6, 1],
			["Excel", 6, 1],
		])
		const ready = stateAt(0)
		expect(ready.phase).toBe("ready")
		expect(ready.drawers.map((drawer) => drawer.open)).toEqual([0, 0, 0])
		expect(ready.drawers.map((drawer) => drawer.status)).toEqual([
			"Por revisar",
			"Por revisar",
			"Por revisar",
		])
		expect(ready.checked).toBe(0)
		expect(ready.summary).toBe("0 de 3 cajones revisados")
		expect(ready.caption).toBe("Tres herramientas pagadas, listas en el carro")
	})

	it("opens one drawer at a time and reports how much of it is used", () => {
		for (const [time, index, checked, status] of [
			[1.5, 0, 1, "0 de 6 en uso"],
			[4.0, 1, 2, "1 de 6 en uso"],
			[6.3, 2, 3, "1 de 6 en uso"],
		] as const) {
			const state = stateAt(time)
			expect(state.drawers[index]!.open).toBe(1)
			expect(state.drawers.filter((drawer) => drawer.open > 0)).toHaveLength(1)
			expect(state.checked).toBe(checked)
			expect(state.drawers[index]!.status).toBe(status)
			if (time < 6.6) expect(state.caption).toBe(drawers[index]!.caption)
		}
		expect(stateAt(0.7).drawers[0]!.open).toBeGreaterThan(0)
		expect(stateAt(0.7).drawers[0]!.open).toBeLessThan(1)
		// A checked drawer keeps its count after closing.
		expect(stateAt(2.7).drawers[0]!.open).toBe(0)
		expect(stateAt(2.7).drawers[0]!.status).toBe("0 de 6 en uso")
	})

	it("ends with the Excel drawer open and the fraction in use", () => {
		const final = stateAt(duration)
		expect(final.phase).toBe("complete")
		expect(final.drawers.map((drawer) => drawer.open)).toEqual([0, 0, 1])
		expect(final.used).toBe(2)
		expect(final.total).toBe(18)
		expect(final.summary).toBe("3 licencias pagadas · 2 de 18 herramientas en uso")
		expect(final.caption).toBe("Se paga el carro completo y se usa una fracción")
		expect(stateAt(duration + 3)).toEqual(final)
	})

	it("starts on first view, holds the final pose for 3 s, then starts over", () => {
		expect(loopPause).toBe(3)
		expect(loopTime(0)).toBe(0)
		expect(loopTime(2)).toBe(2)
		expect(loopTime(duration + 1)).toBe(duration)
		expect(loopTime(duration + 2.9)).toBe(duration)
		expect(loopTime(duration + 3)).toBe(0)
		expect(loopTime(duration + 3 + 2)).toBeCloseTo(2)
		expect(loopTime(2 * (duration + 3) + 1)).toBeCloseTo(1)
		expect(stateAt(loopTime(duration + 3)).phase).toBe("ready")
		expect(playbackAt(0, false, false)).toEqual({ time: 0, running: false, started: false })
		expect(playbackAt(0, true, false)).toEqual({ time: 0, running: true, started: true })
		// Keeps running past the end so the loop can restart.
		expect(playbackAt(duration + 1, false, false, true)).toEqual({
			time: duration + 1,
			running: true,
			started: true,
		})
	})

	it("stays on the final pose without looping when motion is reduced", () => {
		expect(playbackAt(0, false, true)).toEqual({ time: duration, running: false, started: false })
		expect(playbackAt(0, true, true)).toEqual({ time: duration, running: false, started: true })
	})
})
