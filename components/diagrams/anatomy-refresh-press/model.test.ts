import { describe, expect, it } from "vitest"
import { areas, definition, duration, loopPause, loopTime, playbackAt, stateAt } from "./model"

describe("one definition stamped on every area at the scheduled refresh", () => {
	it("waits at 05:00 with three blank sheets and the definition on the die", () => {
		expect(definition).toBe("Ventas netas = facturado − notas de crédito")
		expect(areas.map((area) => area.name)).toEqual(["Ventas", "Finanzas", "Operaciones"])
		const ready = stateAt(0)
		expect(ready.phase).toBe("ready")
		expect(ready.clock).toBe("05:00")
		expect(ready.ram).toBe(0)
		expect(ready.light).toBe(false)
		expect(ready.areas.map((area) => area.value)).toEqual([null, null, null])
		expect(ready.summary).toBe("05:00 · esperando el refresco")
		expect(ready.caption).toBe("Una sola definición, guardada en el modelo")
	})

	it("runs the clock to 06:00, then lights the trigger and lowers the press", () => {
		const waiting = stateAt(1.7)
		expect(waiting.clock).toBe("05:30")
		expect(waiting.caption).toBe("El refresco está programado para las 06:00")
		const trigger = stateAt(3.1)
		expect(trigger.clock).toBe("06:00")
		expect(trigger.light).toBe(true)
		expect(trigger.ram).toBe(0)
		expect(trigger.summary).toBe("06:00 · refrescando")
		expect(trigger.caption).toBe("06:00: el modelo se actualiza solo")
		const pressing = stateAt(3.55)
		expect(pressing.ram).toBeGreaterThan(0)
		expect(pressing.ram).toBeLessThan(1)
		expect(pressing.areas.every((area) => area.value === null)).toBe(true)
	})

	it("stamps the same number on all three sheets in one stroke", () => {
		const stamped = stateAt(3.9)
		expect(stamped.ram).toBe(1)
		expect(stamped.areas.map((area) => area.value)).toEqual(["118", "118", "118"])
		expect(stamped.caption).toBe("Ventas, Finanzas y Operaciones ven 118")
		expect(stateAt(4.8).ram).toBe(0)
	})

	it("ends with the press up and one number everywhere", () => {
		const final = stateAt(duration)
		expect(final.phase).toBe("complete")
		expect(final.ram).toBe(0)
		expect(new Set(final.areas.map((area) => area.value))).toEqual(new Set(["118"]))
		expect(final.summary).toBe("06:00 · 1 definición · 3 áreas, mismo número")
		expect(final.caption).toBe("La misma fórmula, el mismo número para todos")
		expect(stateAt(duration + 1)).toEqual(final)
	})

	it("starts on first view, holds the final pose for 3 s, then starts over", () => {
		expect(loopPause).toBe(3)
		expect(loopTime(duration + 1)).toBe(duration)
		expect(loopTime(duration + 3)).toBe(0)
		expect(playbackAt(0, true, false)).toEqual({ time: 0, running: true, started: true })
		expect(playbackAt(duration + 1, false, false, true).running).toBe(true)
		expect(playbackAt(0, true, true)).toEqual({ time: duration, running: false, started: true })
	})
})
