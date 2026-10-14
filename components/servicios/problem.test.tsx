import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { getServiceBySlug } from "@/lib/services"
import { ServicioProblem } from "./problem"

function render(slug: string) {
	const { page } = getServiceBySlug(slug)!
	return renderToStaticMarkup(
		<ServicioProblem
			slug={slug}
			title={page.problemTitle}
			titleAccent={page.problemTitleAccent}
			problem={page.problem}
			image={page.problemImage}
			audience={page.audience}
		/>
	)
}

describe("service problem visuals", () => {
	it("replaces the reportabilidad illustration with the report desk and keeps the copy", () => {
		const html = render("reportabilidad")
		const { page } = getServiceBySlug("reportabilidad")!
		expect(html.match(/data-report-desk=""/g)).toHaveLength(1)
		expect(html.match(/data-slot="tier"/g)).toHaveLength(3)
		expect(html.match(/data-slot="front"/g)).toHaveLength(3)
		expect(html).not.toContain(encodeURIComponent(page.problemImage))
		for (const text of [
			"El problema",
			page.problemTitle,
			page.problemTitleAccent,
			page.problem,
			...page.audience,
			"El informe del mes se arma a mano y llega después de la decisión.",
			"Ventas",
			"Finanzas",
			"Operaciones",
			"DECIDIDO",
		])
			expect(html).toContain(text)
	})

	it("keeps the raster illustration for services without an approved scene", () => {
		for (const slug of ["capacitaciones", "desarrollo-web", "automatizaciones"]) {
			const html = render(slug)
			expect(html).not.toContain("data-report-desk")
			expect(html).toContain(encodeURIComponent(getServiceBySlug(slug)!.page.problemImage))
		}
	})
})
