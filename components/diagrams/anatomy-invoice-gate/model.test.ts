import { describe, expect, it } from "vitest"
import { duration, invoices, loopPause, loopTime, playbackAt, stateAt, threshold } from "./model"

const at = (index: number, local: number) => 0.4 + index * 1.3 + local

describe("an invoice gate where confidence below the threshold goes to a person", () => {
	it("routes every invoice by comparing its confidence with the threshold", () => {
		expect(threshold).toBe(0.85)
		expect(invoices[0]).toMatchObject({ supplier: "Suministros del Sur SpA", confidence: 0.93 })
		expect(invoices.map((invoice) => invoice.lane)).toEqual([
			"system",
			"system",
			"system",
			"review",
			"system",
			"system",
		])
		const ready = stateAt(0)
		expect(ready.phase).toBe("ready")
		expect(ready.needle).toBe(0)
		expect(ready.hopper).toBe(6)
		expect(ready.system).toBe(0)
		expect(ready.review).toBe(0)
		expect(ready.sheet.visible).toBe(false)
		expect(ready.summary).toBe("0 de 6 facturas · 0 al sistema · 0 a revisión")
		expect(ready.caption).toBe("Cada factura pasa por el lector y sale con su confianza")
	})

	it("feeds, reads, then sends a confident invoice to the system tray", () => {
		const feeding = stateAt(at(0, 0.2))
		expect(feeding.sheet.visible).toBe(true)
		expect(feeding.sheet.stage).toBe("feed")
		expect(feeding.hopper).toBe(5)
		const read = stateAt(at(0, 0.8))
		expect(read.needle).toBeCloseTo(0.93)
		expect(read.caption).toBe("Factura 1: confianza 0,93")
		const routed = stateAt(at(0, 1.1))
		expect(routed.sheet.stage).toBe("exit")
		expect(routed.sheet.lane).toBe("system")
		expect(routed.diverter).toBe(1)
		expect(routed.caption).toBe("0,93 sobre el umbral: directo al sistema")
		const landed = stateAt(at(1, 0.05))
		expect(landed.system).toBe(1)
	})

	it("flips the diverter and sends the low-confidence invoice to review", () => {
		const read = stateAt(at(3, 0.8))
		expect(read.needle).toBeCloseTo(0.62)
		const routed = stateAt(at(3, 1.1))
		expect(routed.sheet.lane).toBe("review")
		expect(routed.diverter).toBe(-1)
		expect(routed.caption).toBe("0,62 bajo el umbral: la revisa una persona")
		const after = stateAt(at(4, 0.05))
		expect(after.review).toBe(1)
		expect(after.system).toBe(3)
	})

	it("ends with five invoices in the system and one for review", () => {
		const final = stateAt(duration)
		expect(final.phase).toBe("complete")
		expect(final.hopper).toBe(0)
		expect(final.system).toBe(5)
		expect(final.review).toBe(1)
		expect(final.sheet.visible).toBe(false)
		expect(final.summary).toBe("6 facturas · 5 al sistema · 1 a revisión")
		expect(final.caption).toBe("El umbral decide qué sigue solo y qué revisa alguien")
		expect(stateAt(duration + 1)).toEqual(final)
	})

	it("starts on first view, holds the final pose for 3 s, then starts over", () => {
		expect(loopPause).toBe(3)
		expect(loopTime(duration + 1)).toBe(duration)
		expect(loopTime(duration + 3)).toBe(0)
		expect(loopTime(duration + 3 + 2)).toBeCloseTo(2)
		expect(playbackAt(0, false, false)).toEqual({ time: 0, running: false, started: false })
		expect(playbackAt(0, true, false)).toEqual({ time: 0, running: true, started: true })
		expect(playbackAt(duration + 1, false, false, true).running).toBe(true)
	})

	it("stays on the final pose without looping when motion is reduced", () => {
		expect(playbackAt(0, true, true)).toEqual({ time: duration, running: false, started: true })
	})
})
