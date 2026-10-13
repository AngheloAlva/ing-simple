import { describe, expect, it } from "vitest"
import { duration, playbackAt, stateAt } from "./model"

describe("manual processing and rework", () => {
	it("copies the illustrative 12 units incorrectly as 21, without changing the source", () => {
		expect(stateAt(0).copiedQuantity).toBeNull()
		const copied = stateAt(1.3)
		expect(copied.sourceQuantity).toBe(12)
		expect(copied.copiedQuantity).toBe(21)
		expect(copied.sent).toBe(0)
		expect(copied.corrections).toBe(0)
		expect(copied.caption).toBe("Pedido: 12 uds. · Copia: 21 uds.")
	})

	it("detects the mismatch in review and never sends the incorrect copy", () => {
		const error = stateAt(2.9)
		expect(error.stage).toBe("error")
		expect(error.error).toBe(true)
		expect(error.paperPosition).toEqual({ x: 0, y: 20, z: 5 })
		expect(error.steps[1]!.status).toBe("21 ≠ 12")
		for (let t = 0; t <= duration; t += 0.05) {
			const state = stateAt(t)
			if (state.copiedQuantity !== state.sourceQuantity) expect(state.sent).toBe(0)
		}
	})

	it("returns to loading, corrects the value and reviews it again before sending", () => {
		const returned = stateAt(4.3)
		expect(returned.paperPosition).toEqual({ x: -78, y: 20, z: 5 })
		expect(returned.copiedQuantity).toBe(21)
		const corrected = stateAt(4.9)
		expect(corrected.copiedQuantity).toBe(12)
		expect(corrected.corrections).toBe(1)
		expect(corrected.error).toBe(false)
		expect(corrected.steps[1]!.status).toBe("Por revisar")
		expect(corrected.sent).toBe(0)
		const reviewed = stateAt(6.2)
		expect(reviewed.stage).toBe("rechecking")
		expect(reviewed.paperPosition).toEqual({ x: 0, y: 20, z: 5 })
		expect(reviewed.sent).toBe(0)
		expect(reviewed.steps[1]!.status).toBe("Revisando")
	})

	it("finishes one corrected order and leaves the next one to repeat the manual work", () => {
		const final = stateAt(duration)
		expect(final.paperPosition).toEqual({ x: 80, y: 20, z: 6 })
		expect(final.copiedQuantity).toBe(12)
		expect(final.sent).toBe(1)
		expect(final.corrections).toBe(1)
		expect(final.pending).toBe(1)
		expect(final.nextOpacity).toBe(1)
		expect(final.caption).toBe("Otro pedido: repetir carga, revisión y envío")
		expect(final.summary).toBe("1 enviado · 1 corrección · 1 pendiente")
		expect(stateAt(duration + 20)).toEqual(final)
	})

	it("starts on interaction and continues after leaving, with a static reduced-motion result", () => {
		expect(playbackAt(0, false, false)).toEqual({ time: 0, running: false, started: false })
		expect(playbackAt(0, true, false)).toEqual({ time: 0, running: true, started: true })
		expect(playbackAt(2, false, false, true)).toEqual({ time: 2, running: true, started: true })
		expect(playbackAt(duration, false, false, true)).toEqual({
			time: duration,
			running: false,
			started: true,
		})
		expect(playbackAt(0, false, true)).toEqual({ time: duration, running: false, started: false })
	})
})
