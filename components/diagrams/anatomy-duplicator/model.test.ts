import { describe, expect, it } from "vitest"
import { copies, duration, errors, playbackAt, stateAt } from "./model"

describe("a hand-cranked duplicator making the same document", () => {
	it("starts still, with a full paper feed and nothing made", () => {
		expect(copies).toBe(10)
		expect(errors).toEqual([3, 7])
		const ready = stateAt(0)
		expect(ready.phase).toBe("ready")
		expect(ready.angle).toBe(0)
		expect(ready.made).toBe(0)
		expect(ready.feed).toBe(10)
		expect(ready.sheet.visible).toBe(false)
		expect(ready.summary).toBe("0 copias · 0 h de manivela")
		expect(ready.caption).toBe("El mismo documento, a mano, una y otra vez")
	})

	it("turns the crank once every 0.75 s, making one copy and adding fifteen minutes", () => {
		const second = stateAt(0.4 + 0.75 * 1.5)
		expect(second.angle).toBeCloseTo(Math.PI * 3)
		expect(second.made).toBe(1)
		expect(second.feed).toBe(8)
		expect(second.hours).toBe(0.25)
		expect(second.sheet.visible).toBe(true)
		expect(second.sheet.error).toBe(false)
		expect(second.caption).toBe("Cada vuelta, una copia y quince minutos")
		// The sheet leaves the drum during the turn, not before it.
		expect(stateAt(0.4 + 0.75 * 1.1).sheet.visible).toBe(false)
		const afterEight = stateAt(0.4 + 0.75 * 8.05)
		expect(afterEight.made).toBe(8)
		expect(afterEight.summary).toBe("8 copias · 2 h de manivela")
	})

	it("sends the copies with errors to the reject bin instead of the output tray", () => {
		const bad = stateAt(0.4 + 0.75 * 3.7)
		expect(bad.sheet.visible).toBe(true)
		expect(bad.sheet.error).toBe(true)
		expect(bad.caption).toBe("Una copia sale mal: hay que rehacerla")
		const after = stateAt(0.4 + 0.75 * 8.05)
		expect(after.made).toBe(8)
		expect(after.rejected).toBe(2)
		expect(after.good).toBe(6)
	})

	it("ends with ten copies, two and a half hours of cranking and two errors", () => {
		const final = stateAt(duration)
		expect(final.phase).toBe("complete")
		expect(final.made).toBe(10)
		expect(final.good).toBe(8)
		expect(final.rejected).toBe(2)
		expect(final.feed).toBe(0)
		expect(final.hours).toBe(2.5)
		expect(final.sheet.visible).toBe(false)
		expect(final.angle).toBeCloseTo(Math.PI * 20)
		expect(final.summary).toBe("10 copias · 2,5 h de manivela · 2 con error")
		expect(final.caption).toBe("Una máquina que todavía depende de una mano")
		expect(stateAt(duration + 1)).toEqual(final)
	})

	it("plays once on first view and jumps to the end when reduced", () => {
		expect(playbackAt(0, false, false)).toEqual({ time: 0, running: false, started: false })
		expect(playbackAt(0, true, false)).toEqual({ time: 0, running: true, started: true })
		expect(playbackAt(0, false, true)).toEqual({ time: duration, running: false, started: false })
	})
})
