import { describe, expect, it } from "vitest"
import { duration, loopPause, loopTime, playbackAt, stateAt, trays } from "./model"

describe("a monthly report assembled by hand after the decision", () => {
	it("starts on day 1 with three different versions of the same total", () => {
		expect(trays.map(({ name, value }) => ({ name, value }))).toEqual([
			{ name: "Ventas", value: "124" },
			{ name: "Finanzas", value: "118" },
			{ name: "Operaciones", value: "131" },
		])
		expect(new Set(trays.map((tray) => tray.value)).size).toBe(3)
		const ready = stateAt(0)
		expect(ready.phase).toBe("ready")
		expect(ready.day).toBe(1)
		expect(ready.gathered).toBe(0)
		expect(ready.decided).toBe(false)
		expect(ready.sheets.map((sheet) => sheet.status)).toEqual(["Pendiente", "Pendiente", "Pendiente"])
		expect(ready.sheets.every((sheet) => sheet.offset.every((v) => v === 0))).toBe(true)
		expect(ready.summary).toBe("Día 1 · 0 de 3 áreas en el informe")
		expect(ready.caption).toBe("Cada área entrega su propia versión del total")
	})

	it("copies one area at a time into the binder while the days advance", () => {
		const copying = stateAt(1.0)
		expect(copying.sheets[0]!.status).toBe("Copiando")
		expect(copying.sheets[0]!.offset[2]).toBeGreaterThan(0)
		expect(copying.caption).toBe("Copiando Ventas: 124")
		for (const [time, count, day] of [
			[1.7, 1, 2],
			[4.1, 2, 4],
			[6.1, 3, 6],
		] as const) {
			const state = stateAt(time)
			expect(state.gathered).toBe(count)
			expect(state.day).toBe(day)
			expect(state.sheets.map((sheet) => sheet.status === "En el informe")).toEqual(
				trays.map((_, i) => i < count)
			)
		}
		// Landed sheets stack in the binder in landing order.
		const final = stateAt(duration).sheets
		final.forEach((sheet, i) => expect(sheet.offset[2] + trays[i]!.z).toBeCloseTo(1.2 + i * 0.65))
		final.forEach((sheet) => expect(sheet.offset.slice(0, 2)).toEqual([90, 59]))
		expect(stateAt(0).sheets.map((sheet) => sheet.front)).toEqual([false, false, false])
		expect(stateAt(0.6).sheets[0]!.front).toBe(false)
		expect(final.map((sheet) => sheet.front)).toEqual([true, true, true])
	})

	it("stamps the decision on day 2, before the report is complete", () => {
		expect(stateAt(1.9).decided).toBe(false)
		expect(stateAt(1.9).stamp).toBeGreaterThan(0)
		const decided = stateAt(2.05)
		expect(decided.decided).toBe(true)
		expect(decided.day).toBe(2)
		expect(decided.stamp).toBe(0)
		expect(decided.gathered).toBeLessThan(3)
		expect(decided.caption).toBe("Día 2: se decide sin el informe")
		expect(stateAt(3.2).stamp).toBe(16)
		expect(stateAt(3.2).decided).toBe(true)
	})

	it("ends with the late report and the earlier decision side by side", () => {
		const final = stateAt(duration)
		expect(final.phase).toBe("complete")
		expect(final.day).toBe(6)
		expect(final.gathered).toBe(3)
		expect(final.decided).toBe(true)
		expect(final.summary).toBe("Día 6 · 3 versiones · decisión del día 2")
		expect(final.caption).toBe("El informe llegó el día 6; la decisión se tomó el día 2")
		expect(stateAt(duration + 5)).toEqual(final)
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
