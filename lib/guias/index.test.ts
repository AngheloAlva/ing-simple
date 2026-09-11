import { describe, expect, it } from "vitest"

import { getRelatedGuias, isGuiaFile, listGuias, parseGuia } from "@/lib/guias"
import type { GuiaMeta } from "@/lib/guias/schema"

const VALID_RAW = `---
title: Cómo empezar con IA en tus procesos
description: Una guía práctica para pymes que quieren dar el primer paso con IA.
publishedAt: "2026-09-06"
tema: ia
servicio: automatizaciones
portada: /img/guias/ia-en-procesos.png
portadaAlt: Persona revisando un panel con procesos automatizados
---

Contenido de prueba con algunas palabras para calcular el tiempo de lectura.
`

const INVALID_RAW = `---
description: Falta el título.
publishedAt: "2026-09-06"
tema: ia
portada: /img/guias/ia-en-procesos.png
portadaAlt: Persona revisando un panel con procesos automatizados
---

Contenido.
`

describe("isGuiaFile", () => {
	it("accepts .mdx files", () => {
		expect(isGuiaFile("mi-guia.mdx")).toBe(true)
	})

	it("rejects files that do not end in .mdx", () => {
		expect(isGuiaFile("README.md")).toBe(false)
		expect(isGuiaFile("mi-guia.txt")).toBe(false)
	})

	it("rejects files starting with an underscore", () => {
		expect(isGuiaFile("_template.mdx")).toBe(false)
	})
})

describe("parseGuia", () => {
	it("parses valid frontmatter and body, attaching slug and reading time", () => {
		const { meta, body } = parseGuia("ia-en-procesos", VALID_RAW)

		expect(meta.slug).toBe("ia-en-procesos")
		expect(meta.title).toBe("Cómo empezar con IA en tus procesos")
		expect(meta.tema).toBe("ia")
		expect(meta.servicio).toBe("automatizaciones")
		expect(meta.readingTimeMinutes).toBeGreaterThanOrEqual(1)
		expect(body).toContain("Contenido de prueba")
	})

	it("coerces a YAML Date into an ISO date string end to end", () => {
		const raw = `---
title: Prueba con fecha sin comillas
description: Descripción de prueba.
publishedAt: 2026-09-06
tema: ia
portada: /img/guias/ia-en-procesos.png
portadaAlt: Persona revisando un panel con procesos automatizados
---

Cuerpo.
`
		const { meta } = parseGuia("prueba-fecha", raw)
		expect(meta.publishedAt).toBe("2026-09-06")
	})

	it("throws an error naming the slug and the validation issues for invalid frontmatter", () => {
		expect(() => parseGuia("guia-invalida", INVALID_RAW)).toThrowError(/guia-invalida/)
	})
})

describe("listGuias", () => {
	const files = [
		{ slug: "a", raw: VALID_RAW.replace("2026-09-06", "2026-09-01") },
		{ slug: "b", raw: VALID_RAW.replace("2026-09-06", "2026-09-10") },
		{
			slug: "c-draft",
			raw: VALID_RAW.replace("2026-09-06", "2026-09-15").replace(
				"servicio: automatizaciones",
				"servicio: automatizaciones\ndraft: true"
			),
		},
	]

	it("excludes drafts by default", () => {
		const result = listGuias(files, { includeDrafts: false })
		expect(result.map((g) => g.slug)).toEqual(["b", "a"])
	})

	it("includes drafts when requested", () => {
		const result = listGuias(files, { includeDrafts: true })
		expect(result.map((g) => g.slug)).toEqual(["c-draft", "b", "a"])
	})

	it("sorts by publishedAt descending, tie-broken by slug", () => {
		const tied = [
			{ slug: "z", raw: VALID_RAW },
			{ slug: "a", raw: VALID_RAW },
		]
		const result = listGuias(tied, { includeDrafts: true })
		expect(result.map((g) => g.slug)).toEqual(["a", "z"])
	})
})

describe("getRelatedGuias", () => {
	function meta(overrides: Partial<GuiaMeta>): GuiaMeta {
		return {
			title: "t",
			description: "d",
			publishedAt: "2026-09-06",
			tema: "ia",
			tags: [],
			draft: false,
			slug: "slug",
			readingTimeMinutes: 1,
			portada: "/img/guias/placeholder.png",
			portadaAlt: "Descripción de la portada",
			portadaRelieveRecorte: true,
			...overrides,
		}
	}

	it("prefers guides with the same tema first, then the same servicio", () => {
		const current = meta({ slug: "current", tema: "ia", servicio: "automatizaciones" })
		const sameTema = meta({ slug: "same-tema", tema: "ia" })
		const sameServicio = meta({
			slug: "same-servicio",
			tema: "cumplimiento",
			servicio: "automatizaciones",
		})
		const unrelated = meta({ slug: "unrelated", tema: "capacitaciones" })

		const related = getRelatedGuias(current, [current, sameTema, sameServicio, unrelated])

		expect(related.map((g) => g.slug)).toEqual(["same-tema", "same-servicio"])
	})

	it("excludes the guide itself", () => {
		const current = meta({ slug: "current" })
		const related = getRelatedGuias(current, [current])
		expect(related).toEqual([])
	})

	it("respects the limit", () => {
		const current = meta({ slug: "current" })
		const others = Array.from({ length: 5 }, (_, i) => meta({ slug: `g${i}`, tema: "ia" }))
		const related = getRelatedGuias(current, [current, ...others], 2)
		expect(related).toHaveLength(2)
	})
})
