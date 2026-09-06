import { describe, expect, it } from "vitest"
import type { CaseStudy, ProjectData } from "@/lib/portfolio-data"
import { caseStudyTitle } from "@/lib/seo/titles"

function baseProject(overrides: Partial<ProjectData> = {}): ProjectData {
	return {
		id: "otc",
		imageUrl: "/img/portfolio/placeholder.jpg",
		title: "OTC 360",
		shortDescription: "Sistema de gestión de órdenes de trabajo y seguridad laboral",
		fullDescription: "Sistema de gestión completo",
		category: "desarrollo-web",
		technologies: [],
		isFlagship: true,
		...overrides,
	} as ProjectData
}

describe("caseStudyTitle", () => {
	it("prefers the seoLabel over shortDescription when both are set", () => {
		const project = baseProject({
			caseStudy: {
				seoLabel: "control operacional para oleoducto",
			} as unknown as CaseStudy,
		})

		expect(caseStudyTitle(project)).toBe("OTC 360: control operacional para oleoducto")
	})

	it("falls back to shortDescription when there is no seoLabel and the combined title fits", () => {
		const project = baseProject({
			title: "Casos",
			shortDescription: "Dashboard interno",
		})

		expect(caseStudyTitle(project)).toBe("Casos: Dashboard interno")
	})

	it("falls back to the generic template when the combined title exceeds 60 characters", () => {
		const project = baseProject({
			title: "Dashboard TurismoChileTours",
			shortDescription: "Sistema de gestión de órdenes de trabajo y seguridad laboral",
		})

		expect(caseStudyTitle(project)).toBe("Dashboard TurismoChileTours | Caso de estudio")
	})

	it("keeps a combined title of exactly 60 characters", () => {
		// "Título largo: " (14) + 46-char label = 60 chars exactly.
		const project = baseProject({
			title: "Título largo",
			shortDescription: "a".repeat(46),
		})

		const result = caseStudyTitle(project)
		expect(result.length).toBe(60)
		expect(result).toBe(`Título largo: ${"a".repeat(46)}`)
	})
})
