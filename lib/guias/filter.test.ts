import { describe, expect, it } from "vitest"

import { filterGuias } from "@/lib/guias/filter"
import type { GuiaMeta } from "@/lib/guias/schema"

function meta(overrides: Partial<GuiaMeta>): GuiaMeta {
	return {
		title: "IA en procesos, por dónde empezar",
		description: "Una guía práctica para pymes que quieren usar IA en sus procesos.",
		publishedAt: "2026-09-06",
		tema: "ia",
		tags: ["ia", "pymes"],
		draft: false,
		slug: "ia-en-procesos",
		readingTimeMinutes: 4,
		portada: "/img/guias/ia-en-procesos.png",
		portadaAlt: "Descripción de la portada",
		...overrides,
	}
}

const AUTOMATIZACION = meta({
	slug: "checklist-automatizar",
	title: "Checklist antes de automatizar",
	description: "Cinco preguntas para elegir tu primera automatización.",
	tema: "automatizacion",
	servicio: "automatizaciones",
	tags: ["automatizacion"],
})

const REPORTABILIDAD = meta({
	slug: "reportes-gerenciales",
	title: "Reportes gerenciales sin planillas",
	description: "Cómo dejar de armar el reporte a mano cada mes.",
	tema: "reportabilidad",
	servicio: "reportabilidad",
	tags: ["reportabilidad"],
})

const GUIAS = [AUTOMATIZACION, REPORTABILIDAD]

describe("filterGuias", () => {
	it("matches everything when query is empty and servicio is undefined", () => {
		expect(filterGuias(GUIAS, { query: "" })).toEqual(GUIAS)
	})

	it('matches everything when servicio is "todos"', () => {
		expect(filterGuias(GUIAS, { servicio: "todos", query: "" })).toEqual(GUIAS)
	})

	it("filters by an exact servicio slug", () => {
		const result = filterGuias(GUIAS, { servicio: "reportabilidad", query: "" })
		expect(result).toEqual([REPORTABILIDAD])
	})

	it("matches the query against the title", () => {
		const result = filterGuias(GUIAS, { query: "checklist" })
		expect(result).toEqual([AUTOMATIZACION])
	})

	it("matches the query against the description", () => {
		const result = filterGuias(GUIAS, { query: "planillas" })
		expect(result).toEqual([REPORTABILIDAD])
	})

	it("matches the query against tags", () => {
		const result = filterGuias(GUIAS, { query: "automatizacion" })
		expect(result).toEqual([AUTOMATIZACION])
	})

	it("is case-insensitive", () => {
		expect(filterGuias(GUIAS, { query: "CHECKLIST" })).toEqual([AUTOMATIZACION])
	})

	it("is accent-insensitive", () => {
		expect(filterGuias(GUIAS, { query: "automatizacion" })).toEqual([AUTOMATIZACION])
		expect(filterGuias(GUIAS, { query: "automatización" })).toEqual([AUTOMATIZACION])
	})

	it("trims surrounding whitespace", () => {
		expect(filterGuias(GUIAS, { query: "  checklist  " })).toEqual([AUTOMATIZACION])
	})

	it("combines servicio and query filters", () => {
		const result = filterGuias(GUIAS, { servicio: "reportabilidad", query: "checklist" })
		expect(result).toEqual([])
	})

	it("returns an empty array when nothing matches", () => {
		expect(filterGuias(GUIAS, { query: "algo-que-no-existe" })).toEqual([])
	})
})
