import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

vi.mock("next/navigation", () => ({
	usePathname: () => "/",
}))

import { FinalCta, finalCtaRippleColors, rippleTextForPathname } from "@/components/final-cta"

describe("FinalCta", () => {
	it("renders its default contact call to action", () => {
		const html = renderToStaticMarkup(<FinalCta />)

		expect(html).toContain("¿Qué proceso te quita más tiempo hoy?")
		expect(html).toContain("Pide tu diagnóstico gratis")
		expect(html).toContain('href="/contacto"')
	})

	it("uses supplied content and contact destination", () => {
		const html = renderToStaticMarkup(
			<FinalCta title="Custom title" body="Custom body" href="/contacto?servicio=ia" />,
		)

		expect(html).toContain("Custom title")
		expect(html).toContain("Custom body")
		expect(html).toContain('href="/contacto?servicio=ia"')
	})

	it("routes empty CTA space to the ripple while keeping the button clickable", () => {
		const html = renderToStaticMarkup(<FinalCta />)

		expect(html).toContain("pointer-events-none relative z-10")
		expect(html).toContain("pointer-events-auto mt-8")
	})

	it("keeps idle text neutral while ripples stay accented", () => {
		expect(finalCtaRippleColors).toEqual({
		text: "var(--muted-foreground)",
		ripple: "var(--primary)",
		trough: "var(--primary)",
	})
	})

	it("keeps the decorative surface aligned with shared content and separates the CTA from the footer", () => {
		const html = renderToStaticMarkup(<FinalCta />)

		expect(html).toContain("relative isolate mb-32 overflow-hidden sm:mb-44")
		expect(html).toContain(
			"absolute inset-y-0 left-1/2 z-0 w-full max-w-360 -translate-x-1/2 px-5 sm:px-8 lg:px-10",
		)
		expect(html).toContain("pointer-events-none absolute inset-0 z-1 dark:hidden")
		expect(html).toContain(
			"radial-gradient(ellipse 52% 58% at center, var(--background) 0%, var(--background) 28%, color-mix(in srgb, var(--background) 92%, transparent) 42%",
		)
		expect(html).toContain(
			"pointer-events-none absolute top-1/2 left-1/2 z-[-1] hidden h-[150%] w-[160%] -translate-x-1/2 -translate-y-1/2 dark:block",
		)
		expect(html).toContain("radial-gradient(ellipse at center, var(--background) 0%")
	})

	it("selects meaningful decorative text for each service and generic page category", () => {
		expect(rippleTextForPathname("/servicios/reportabilidad")).toContain("datos")
		expect(rippleTextForPathname("/servicios/capacitaciones")).toContain("equipos")
		expect(rippleTextForPathname("/servicios/desarrollo-web")).toContain("software")
		expect(rippleTextForPathname("/servicios/automatizaciones")).toContain("manuales")
		expect(rippleTextForPathname("/guias")).toContain("ideas")
		expect(rippleTextForPathname("/casos/otc-360")).toContain("resultados")
		expect(rippleTextForPathname("/")).toContain("procesos")
	})
})
