import { describe, expect, it } from "vitest"
import { duration, playbackAt, sources, stateAt } from "./model"

describe("scattered information without a shared view", () => {
	it("keeps three different parts of the same example in separate sources", () => {
		expect(sources.map(({ name, fact }) => ({ name, fact }))).toEqual([
			{ name: "Planilla", fact: "12 pedidas" },
			{ name: "Sistema", fact: "8 en stock" },
			{ name: "Correo", fact: "Pago confirmado" },
		])
		const ready = stateAt(0)
		expect(ready.phase).toBe("ready")
		expect(ready.drawers.map((drawer) => drawer.open)).toEqual([0, 0, 0])
		expect(ready.drawers.map((drawer) => drawer.status)).toEqual([
			"Por consultar",
			"Por consultar",
			"Por consultar",
		])
		expect(ready.consulted).toBe(0)
		expect(ready.sharedFields).toBe(0)
		expect(ready.caption).toBe("Un mismo pedido, información en tres lugares")
	})

	it("opens each drawer in turn and reveals only the source it has reached", () => {
		for (const [time, count, position] of [
			[1.5, 1, 0],
			[3.3, 2, 1],
			[5.1, 3, 2],
		] as const) {
			const state = stateAt(time)
			expect(state.consulted).toBe(count)
			expect(state.drawers[position]!.open).toBe(1)
			expect(state.drawers[position]!.status).toBe(sources[position]!.fact)
			expect(state.drawers.map((drawer) => drawer.revealed)).toEqual(
				sources.map((_, i) => i < count)
			)
			expect(state.caption).toBe(sources[position]!.caption)
		}
		expect(stateAt(0.8).drawers[0]!.open).toBeGreaterThan(0)
		expect(stateAt(0.8).drawers[0]!.open).toBeLessThan(1)
		expect(stateAt(0.8).drawers[0]!.status).toBe("Consultando")
		expect(stateAt(0.8).consulted).toBe(0)
	})

	it("never transfers the separated facts into the shared report or invents a decision", () => {
		for (let t = 0; t <= duration; t += 0.05) {
			const state = stateAt(t)
			expect(state.sharedFields).toBe(0)
			expect(state.report).toBe("Sin vista conjunta")
			expect(state.drawers.every((drawer) => drawer.open >= 0 && drawer.open <= 1)).toBe(true)
		}
		const final = stateAt(duration)
		expect(final.phase).toBe("complete")
		expect(final.consulted).toBe(3)
		expect(final.drawers.map((drawer) => drawer.status)).toEqual(
			sources.map((source) => source.fact)
		)
		expect(final.summary).toBe("3 fuentes separadas · sin vista conjunta")
		expect(final.caption).toBe("Para decidir, hay que cruzarlas a mano")
		expect(stateAt(duration + 20)).toEqual(final)
	})

	it("starts once on interaction, keeps playing after leaving and reduces to the final pose", () => {
		expect(playbackAt(0, false, false)).toEqual({ time: 0, running: false, started: false })
		expect(playbackAt(0, true, false)).toEqual({ time: 0, running: true, started: true })
		expect(playbackAt(2, false, false, true)).toEqual({ time: 2, running: true, started: true })
		expect(playbackAt(duration, true, false, true)).toEqual({
			time: duration,
			running: false,
			started: true,
		})
		expect(playbackAt(0, false, true)).toEqual({ time: duration, running: false, started: false })
	})
})
