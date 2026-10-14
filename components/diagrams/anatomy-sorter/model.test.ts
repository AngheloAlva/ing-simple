import { describe, expect, it } from "vitest"
import { capacity, destinations, duration, orders, patches, playbackAt, stateAt } from "./model"

describe("an operation that outgrew its sorter", () => {
	it("routes thirty orders: twelve cubbies, then three patches, then a pile", () => {
		expect(capacity).toBe(12)
		expect(orders).toHaveLength(30)
		expect(patches.map((patch) => patch.name)).toEqual(["Planilla", "Correo", "WhatsApp"])
		expect(destinations.map((d) => [d.id, d.count])).toEqual([
			["cubby", 12],
			["sheet", 6],
			["mail", 6],
			["chat", 3],
			["pile", 3],
		])
		expect(orders.slice(0, 12).every((order) => order.destination === "cubby")).toBe(true)
		expect(orders.map((order) => order.slot).slice(10, 15)).toEqual([10, 11, 0, 1, 2])
		const arrivals = orders.map((order) => order.arrival)
		expect(arrivals).toEqual([...arrivals].sort((a, b) => a - b))
	})

	it("starts empty, in week 1, with no patches", () => {
		const ready = stateAt(0)
		expect(ready.phase).toBe("ready")
		expect(ready.received).toBe(0)
		expect(ready.week).toBe(1)
		expect(ready.items.every((item) => item.visible === false)).toBe(true)
		expect(ready.patches.map((patch) => patch.shown)).toEqual([false, false, false])
		expect(ready.summary).toBe("Semana 1 · 0 pedidos · capacidad 12")
		expect(ready.caption).toBe("El casillero se armó para la operación de antes")
	})

	it("fills the cubbies first and only opens a patch when the previous place is full", () => {
		const full = stateAt(orders[11]!.arrival + 0.1)
		expect(full.counts.cubby).toBe(12)
		expect(full.patches.every((patch) => !patch.shown)).toBe(true)
		expect(full.caption).toBe("Cada pedido tiene su casilla")
		const sheet = stateAt(orders[12]!.arrival + 0.01)
		expect(sheet.patches.map((patch) => patch.shown)).toEqual([true, false, false])
		expect(sheet.caption).toBe("Lleno: los pedidos pasan a una planilla compartida")
		const chat = stateAt(orders[24]!.arrival + 0.01)
		expect(chat.patches.map((patch) => patch.shown)).toEqual([true, true, true])
		expect(chat.caption).toBe("Y la información, a WhatsApp")
		const dropping = stateAt(orders[0]!.arrival + 0.15)
		expect(dropping.items[0]!.visible).toBe(true)
		expect(dropping.items[0]!.drop).toBeGreaterThan(0)
		expect(dropping.items[0]!.drop).toBeLessThan(1)
	})

	it("ends with thirty orders against a capacity of twelve and three patches", () => {
		const final = stateAt(duration)
		expect(final.phase).toBe("complete")
		expect(final.received).toBe(30)
		expect(final.counts).toEqual({ cubby: 12, sheet: 6, mail: 6, chat: 3, pile: 3 })
		expect(final.items.every((item) => item.visible && item.drop === 0)).toBe(true)
		expect(final.summary).toBe("Capacidad 12 · 30 pedidos · 3 parches")
		expect(final.caption).toBe("La operación creció; las herramientas no acompañaron")
		expect(stateAt(duration + 2)).toEqual(final)
	})

	it("plays once on first view and jumps to the end when reduced", () => {
		expect(playbackAt(0, false, false)).toEqual({ time: 0, running: false, started: false })
		expect(playbackAt(0, true, false)).toEqual({ time: 0, running: true, started: true })
		expect(playbackAt(0, false, true)).toEqual({ time: duration, running: false, started: false })
	})
})
