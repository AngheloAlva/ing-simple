import { describe, expect, it } from "vitest"

import { guiaFrontmatterSchema } from "@/lib/guias/schema"

function validInput(overrides: Record<string, unknown> = {}): Record<string, unknown> {
	return {
		title: "Cómo empezar con IA en tus procesos",
		description: "Una guía práctica para pymes que quieren dar el primer paso con IA.",
		publishedAt: "2026-09-06",
		tema: "ia",
		portada: "/img/guias/ia-en-procesos.png",
		portadaAlt: "Persona revisando un panel con procesos automatizados",
		...overrides,
	}
}

describe("guiaFrontmatterSchema", () => {
	it("accepts a minimal valid frontmatter and fills in defaults", () => {
		const result = guiaFrontmatterSchema.parse(validInput())

		expect(result.title).toBe("Cómo empezar con IA en tus procesos")
		expect(result.tags).toEqual([])
		expect(result.draft).toBe(false)
		expect(result.updatedAt).toBeUndefined()
		expect(result.servicio).toBeUndefined()
		expect(result.portadaCredito).toBeUndefined()
	})

	it("accepts an optional servicio matching a real service slug", () => {
		const result = guiaFrontmatterSchema.parse(validInput({ servicio: "automatizaciones" }))
		expect(result.servicio).toBe("automatizaciones")
	})

	it("rejects a servicio slug that does not exist", () => {
		expect(() => guiaFrontmatterSchema.parse(validInput({ servicio: "no-existe" }))).toThrow()
	})

	it("rejects a tema outside the configured taxonomy", () => {
		expect(() => guiaFrontmatterSchema.parse(validInput({ tema: "no-existe" }))).toThrow()
	})

	it("rejects a title that is empty", () => {
		expect(() => guiaFrontmatterSchema.parse(validInput({ title: "" }))).toThrow()
	})

	it("rejects a title longer than 90 characters", () => {
		expect(() => guiaFrontmatterSchema.parse(validInput({ title: "a".repeat(91) }))).toThrow()
	})

	it("rejects a description longer than 200 characters", () => {
		expect(() =>
			guiaFrontmatterSchema.parse(validInput({ description: "a".repeat(201) }))
		).toThrow()
	})

	it("rejects a publishedAt that is not YYYY-MM-DD", () => {
		expect(() => guiaFrontmatterSchema.parse(validInput({ publishedAt: "06-09-2026" }))).toThrow()
		expect(() => guiaFrontmatterSchema.parse(validInput({ publishedAt: "2026/09/06" }))).toThrow()
	})

	it("coerces a Date publishedAt (as gray-matter would parse an unquoted YAML date) into an ISO date string", () => {
		const result = guiaFrontmatterSchema.parse(
			validInput({ publishedAt: new Date("2026-09-06T00:00:00.000Z") })
		)
		expect(result.publishedAt).toBe("2026-09-06")
	})

	it("coerces a Date updatedAt the same way", () => {
		const result = guiaFrontmatterSchema.parse(
			validInput({ updatedAt: new Date("2026-09-10T00:00:00.000Z") })
		)
		expect(result.updatedAt).toBe("2026-09-10")
	})

	it("accepts custom tags", () => {
		const result = guiaFrontmatterSchema.parse(validInput({ tags: ["ia", "pymes"] }))
		expect(result.tags).toEqual(["ia", "pymes"])
	})

	it("accepts draft: true", () => {
		const result = guiaFrontmatterSchema.parse(validInput({ draft: true }))
		expect(result.draft).toBe(true)
	})

	it("rejects a portada that does not start with /img/guias/", () => {
		expect(() =>
			guiaFrontmatterSchema.parse(validInput({ portada: "/img/about/web.png" }))
		).toThrow()
	})

	it("rejects a missing portadaAlt", () => {
		const { portadaAlt: _portadaAlt, ...withoutAlt } = validInput()
		expect(() => guiaFrontmatterSchema.parse(withoutAlt)).toThrow()
	})

	it("rejects a portadaAlt longer than 160 characters", () => {
		expect(() => guiaFrontmatterSchema.parse(validInput({ portadaAlt: "a".repeat(161) }))).toThrow()
	})

	it("accepts an optional portadaCredito", () => {
		const result = guiaFrontmatterSchema.parse(
			validInput({ portadaCredito: "Foto: Banco de imágenes" })
		)
		expect(result.portadaCredito).toBe("Foto: Banco de imágenes")
	})

	it("accepts an optional portadaRelieve under /img/guias/", () => {
		const result = guiaFrontmatterSchema.parse(
			validInput({ portadaRelieve: "/img/guias/ia-en-procesos-relieve.png" })
		)
		expect(result.portadaRelieve).toBe("/img/guias/ia-en-procesos-relieve.png")
	})

	it("leaves portadaRelieve undefined when absent", () => {
		const result = guiaFrontmatterSchema.parse(validInput())
		expect(result.portadaRelieve).toBeUndefined()
	})

	it("rejects a portadaRelieve that does not start with /img/guias/", () => {
		expect(() =>
			guiaFrontmatterSchema.parse(validInput({ portadaRelieve: "/img/lab/portada-hoja.png" }))
		).toThrow()
	})

	it("defaults portadaRelieveRecorte to true when absent", () => {
		const result = guiaFrontmatterSchema.parse(validInput())
		expect(result.portadaRelieveRecorte).toBe(true)
	})

	it("accepts portadaRelieveRecorte: false", () => {
		const result = guiaFrontmatterSchema.parse(validInput({ portadaRelieveRecorte: false }))
		expect(result.portadaRelieveRecorte).toBe(false)
	})

	it("rejects a non-boolean portadaRelieveRecorte", () => {
		expect(() => guiaFrontmatterSchema.parse(validInput({ portadaRelieveRecorte: "no" }))).toThrow()
	})
})
