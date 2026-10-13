import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/components/diagrams/challenge/scattered-data", () => ({
	DiagramScatteredData: () => <div data-original="scattered-data" />,
}))
vi.mock("@/components/diagrams/challenge/manual-steps", () => ({
	DiagramManualSteps: () => <div data-original="manual-steps" />,
}))
vi.mock("@/components/diagrams/challenge/single-point", () => ({
	DiagramSinglePoint: () => <div data-original="single-point" />,
}))

import { Challenge } from "./challenge"

describe("challenge Anatomy pilot", () => {
	it("shows separate sources without inventing a shared view and keeps the scattered-data copy", () => {
		const html = renderToStaticMarkup(<Challenge />)
		expect(html.match(/data-scattered-cabinet=""/g)).toHaveLength(1)
		expect(html.match(/data-scattered-drawer="/g)).toHaveLength(3)
		expect(html.match(/data-shared-field="/g)).toHaveLength(3)
		expect(html).toContain('data-shared-fields="0"')
		expect(html).not.toContain('data-original="scattered-data"')
		for (const text of [
			"Planilla",
			"Sistema",
			"Correo",
			"Sin vista conjunta",
			"Tres fuentes guardan partes del mismo pedido, pero no hay una vista conjunta para decidir.",
			"La información vive repartida en planillas y sistemas que no se hablan entre sí. Sin una vista clara, las decisiones se toman a ciegas.",
		])
			expect(html).toContain(text)
	})

	it("shows a fixed mold and three distinct pieces only in the generic-tool card", () => {
		const html = renderToStaticMarkup(<Challenge />)
		expect(html.match(/data-fit-bench=""/g)).toHaveLength(1)
		expect(html).toContain(
			"El sistema genérico admite aprobaciones; precios por cliente y turnos quedan fuera y requieren trabajo manual."
		)
		expect(html).toContain('data-piece="fitting-square"')
		expect(html).toContain('data-piece="outside-cross"')
		expect(html).toContain('data-piece="outside-bar"')
		for (const label of ["Sistema genérico", "Aprobaciones", "Precios por cliente", "Turnos"]) {
			expect(html).toContain(label)
		}
		expect(html).toContain('data-accepted="0"')
		expect(html).toContain('data-process="square"')
		expect(html).toContain('data-process="cross"')
		expect(html).toContain('data-process="bar"')
	})

	it("shows manual copying, review and sending while preserving the manual card copy", () => {
		const html = renderToStaticMarkup(<Challenge />)
		expect(html.match(/data-manual-desk=""/g)).toHaveLength(1)
		for (const text of [
			"Cargar",
			"Revisar",
			"Enviar",
			"Una copia errónea obliga a corregir y revisar antes de enviar. Otro pedido espera repetir el trabajo.",
			"Tareas repetitivas que consumen horas del equipo y deberían estar automatizadas, escalando errores en lugar de resultados.",
		])
			expect(html.includes(text)).toBe(true)
		expect(html.includes('data-original="manual-steps"')).toBe(false)
		expect(html.includes('data-manual-worker=""')).toBe(true)
	})

	it("shows the knowledge desk only in the knowledge card and preserves its copy", () => {
		const html = renderToStaticMarkup(<Challenge />)
		expect(html.match(/data-knowledge-desk=""/g)).toHaveLength(1)
		for (const text of [
			"Quien sabe hacerlo",
			"Ventas",
			"Depósito",
			"Administración",
			"Sin esa persona, tres solicitudes quedan pendientes y nadie puede retomarlas.",
			"Todo depende de quien sabe cómo se hace. Si esa persona no está, el proceso se frena y nadie puede retomarlo.",
		])
			expect(html.includes(text)).toBe(true)
		expect(html.includes('data-original="single-point"')).toBe(false)
		expect(html.includes('data-knowledge-person=""')).toBe(true)
		expect(html.match(/data-knowledge-paper="/g)).toHaveLength(4)
	})

	it("paints the concave cross with opaque ordered side faces and a final top", () => {
		const html = renderToStaticMarkup(<Challenge />)
		expect(html.match(/data-cross-face="/g)).toHaveLength(6)
		expect(html.lastIndexOf('data-cross-face="')).toBeLessThan(html.indexOf('data-cross-top=""'))
	})

	it("preserves the other Anatomy visuals, all four card titles and the generic-tool copy", () => {
		const html = renderToStaticMarkup(<Challenge />)
		for (const name of ["fit-bench", "manual-desk", "knowledge-desk"]) {
			expect(html.match(new RegExp(`data-${name}=""`, "g"))).toHaveLength(1)
		}
		for (const title of [
			"Datos dispersos",
			"Procesos manuales",
			"Herramientas que no encajan",
			"Conocimiento que no circula",
		]) {
			expect(html).toContain(title)
		}
		expect(html).toContain(
			"Pagas por un sistema genérico que cubre una parte y te obliga a adaptar el proceso a la herramienta, en lugar de al revés."
		)
		expect(html).toContain("El sistema no cambia de forma. El proceso que se adapta es el tuyo.")
		expect(html.match(/tabindex="0"/g)).toHaveLength(4)
	})
})
