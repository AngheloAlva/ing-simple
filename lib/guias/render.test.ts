import { describe, expect, it } from "vitest"

import { extractHeadings } from "@/lib/guias/render"

describe("extractHeadings", () => {
	it("extracts h2 and h3 headings with depth and text", () => {
		const body = `## El problema

Texto.

### Cómo se nota

Más texto.
`
		expect(extractHeadings(body)).toEqual([
			{ depth: 2, text: "El problema", id: "el-problema" },
			{ depth: 3, text: "Cómo se nota", id: "cómo-se-nota" },
		])
	})

	it("ignores h1 and h4+ headings", () => {
		const body = "# Título\n\n## Sección\n\n#### Detalle\n"
		expect(extractHeadings(body)).toEqual([{ depth: 2, text: "Sección", id: "sección" }])
	})

	it("ignores headings inside code fences", () => {
		const body = "## Real\n\n```md\n## No es un heading\n```\n\n### También real\n"
		expect(extractHeadings(body)).toEqual([
			{ depth: 2, text: "Real", id: "real" },
			{ depth: 3, text: "También real", id: "también-real" },
		])
	})

	it("de-duplicates identical heading text the same way rehype-slug does", () => {
		const body = "## Errores comunes\n\n## Errores comunes\n"
		expect(extractHeadings(body)).toEqual([
			{ depth: 2, text: "Errores comunes", id: "errores-comunes" },
			{ depth: 2, text: "Errores comunes", id: "errores-comunes-1" },
		])
	})

	it("strips basic inline markdown before slugifying", () => {
		const body = "## Usa `IA` con **cuidado**\n"
		expect(extractHeadings(body)).toEqual([
			{ depth: 2, text: "Usa IA con cuidado", id: "usa-ia-con-cuidado" },
		])
	})
})
