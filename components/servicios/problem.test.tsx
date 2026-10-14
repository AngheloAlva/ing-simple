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

	it("replaces the capacitaciones illustration with the tool cart and keeps the copy", () => {
		const html = render("capacitaciones")
		const { page } = getServiceBySlug("capacitaciones")!
		expect(html.match(/data-tool-cart=""/g)).toHaveLength(1)
		expect(html.match(/data-cart-drawer="/g)).toHaveLength(3)
		expect(html).not.toContain("data-report-desk")
		expect(html).not.toContain(encodeURIComponent(page.problemImage))
		for (const text of [
			page.problemTitle,
			page.problemTitleAccent,
			page.problem,
			...page.audience,
			"La empresa paga por tres herramientas y el equipo usa una fracción de cada una.",
			"Power Apps",
			"Power BI",
			"Excel",
		])
			expect(html).toContain(text)
	})

	it("replaces the desarrollo-web illustration with the sorter and keeps the copy", () => {
		const html = render("desarrollo-web")
		const { page } = getServiceBySlug("desarrollo-web")!
		expect(html.match(/data-sorter=""/g)).toHaveLength(1)
		expect(html.match(/data-order="/g)).toHaveLength(30)
		expect(html.match(/data-patch="/g)).toHaveLength(4)
		expect(html).not.toContain(encodeURIComponent(page.problemImage))
		for (const text of [
			page.problemTitle,
			page.problemTitleAccent,
			page.problem,
			...page.audience,
			"La operación creció y el casillero pensado para ella quedó chico.",
			"Planilla",
			"Correo",
			"WhatsApp",
		])
			expect(html).toContain(text)
	})

	it("replaces the automatizaciones illustration with the duplicator and keeps the copy", () => {
		const html = render("automatizaciones")
		const { page } = getServiceBySlug("automatizaciones")!
		expect(html.match(/data-duplicator=""/g)).toHaveLength(1)
		expect(html.match(/data-blank="/g)).toHaveLength(10)
		expect(html.match(/data-copy="/g)).toHaveLength(8)
		expect(html.match(/data-reject="/g)).toHaveLength(2)
		expect(html).not.toContain(encodeURIComponent(page.problemImage))
		for (const text of [
			page.problemTitle,
			page.problemTitleAccent,
			page.problem,
			...page.audience,
			"Una copiadora que funciona a manivela: cada copia del mismo documento cuesta tiempo de una persona.",
			"Copias",
			"Manivela",
			"Con error",
		])
			expect(html).toContain(text)
	})

	it("falls back to the raster illustration for a service without a scene", () => {
		const { page } = getServiceBySlug("reportabilidad")!
		const html = renderToStaticMarkup(
			<ServicioProblem
				slug="servicio-sin-escena"
				title={page.problemTitle}
				titleAccent={page.problemTitleAccent}
				problem={page.problem}
				image={page.problemImage}
				audience={page.audience}
			/>
		)
		expect(html).not.toMatch(/data-(report-desk|tool-cart|sorter|duplicator)=/)
		expect(html).toContain(encodeURIComponent(page.problemImage))
	})
})
