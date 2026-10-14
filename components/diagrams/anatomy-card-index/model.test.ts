import { describe, expect, it } from "vitest"
import { cards, duration, playbackAt, stateAt } from "./model"

describe("a card index where every processing activity needs a legal basis", () => {
	it("holds five activities whose bases match the guide's inventory table", () => {
		expect(cards.map((card) => [card.purpose, card.basis])).toEqual([
			["Responder cotizaciones", "Interés legítimo"],
			["Facturar y despachar", "Contrato"],
			["Contactos en el WhatsApp", null],
			["Pagar sueldos", "Obligación legal"],
			["Enviar el newsletter", "Consentimiento"],
		])
		const ready = stateAt(0)
		expect(ready.phase).toBe("ready")
		expect(ready.cards.every((card) => card.lift === 0 && !card.tabbed && card.moved === 0)).toBe(true)
		expect(ready.summary).toBe("0 de 5 tratamientos revisados")
		expect(ready.caption).toBe("Cada tratamiento necesita una razón para existir")
	})

	it("lifts one card at a time, clips its basis tab and puts it back", () => {
		const lifted = stateAt(0.4 + 0.6)
		expect(lifted.cards[0]!.lift).toBe(1)
		expect(lifted.cards[0]!.tabbed).toBe(true)
		expect(lifted.cards.filter((card) => card.lift > 0)).toHaveLength(1)
		expect(lifted.caption).toBe("Responder cotizaciones: Interés legítimo")
		const back = stateAt(1.75)
		expect(back.cards[0]!.lift).toBe(0)
		expect(back.cards[0]!.tabbed).toBe(true)
		expect(back.cards[0]!.status).toBe("Interés legítimo")
		expect(back.checked).toBe(1)
	})

	it("sends the card without a basis to the tray instead of back to the drawer", () => {
		const asking = stateAt(3.2 + 0.7)
		expect(asking.cards[2]!.lift).toBe(1)
		expect(asking.cards[2]!.tabbed).toBe(false)
		expect(asking.caption).toBe("Contactos en el WhatsApp: ¿con qué base? Ninguna")
		const moving = stateAt(4.4)
		expect(moving.cards[2]!.moved).toBeGreaterThan(0)
		expect(moving.cards[2]!.moved).toBeLessThan(1)
		expect(moving.cards[2]!.front).toBe(true)
		const parked = stateAt(5.1)
		expect(parked.cards[2]!.moved).toBe(1)
		expect(parked.cards[2]!.status).toBe("Justificar o eliminar")
		expect(parked.caption).toBe("Sin base: hay que justificarlo o eliminarlo")
	})

	it("ends with four cards tabbed in the drawer and one in the tray", () => {
		const final = stateAt(duration)
		expect(final.phase).toBe("complete")
		expect(final.cards.map((card) => card.tabbed)).toEqual([true, true, false, true, true])
		expect(final.cards.map((card) => card.moved)).toEqual([0, 0, 1, 0, 0])
		expect(final.cards.every((card) => card.lift === 0 || card.moved === 1)).toBe(true)
		expect(final.summary).toBe("5 tratamientos · 4 con base · 1 por justificar")
		expect(final.caption).toBe("Una ficha sin base de licitud no puede quedarse en el fichero")
		expect(stateAt(duration + 1)).toEqual(final)
	})

	it("plays once on first view and jumps to the end when reduced", () => {
		expect(playbackAt(0, false, false)).toEqual({ time: 0, running: false, started: false })
		expect(playbackAt(0, true, false)).toEqual({ time: 0, running: true, started: true })
		expect(playbackAt(0, false, true)).toEqual({ time: duration, running: false, started: false })
	})
})
