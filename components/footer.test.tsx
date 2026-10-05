import type { ComponentPropsWithoutRef } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

vi.mock("next/navigation", () => ({ usePathname: () => "/" }))
vi.mock("next/link", () => ({
	default: ({ children, transitionTypes, ...props }: ComponentPropsWithoutRef<"a"> & { transitionTypes?: string[] }) => {
		void transitionTypes
		return <a {...props}>{children}</a>
	},
}))
vi.mock("@/components/logo", () => ({ Logo: () => null }))
vi.mock("@/components/icons/animated/animated-arrow-right", () => ({
	ArrowRightIcon: () => null,
}))
vi.mock("@/components/icons/animated/animated-send", () => ({
	SendIcon: () => null,
}))

import { Footer } from "@/components/footer"

function columnClasses(html: string): string[][] {
	return Array.from(
		html.matchAll(/<div class="(relative (?:md|lg):px-8[^"]*)">/g),
		(match) => (match[1] ?? "").split(/\s+/).filter(Boolean),
	)
}

describe("Footer", () => {
	it("keeps two tracks and full-span contact through tablet, resetting at lg", () => {
		const html = renderToStaticMarkup(<Footer />)
		const columns = columnClasses(html)

		expect(columns).toHaveLength(4)
		expect(columns[3]).toEqual(expect.arrayContaining(["col-span-2", "lg:col-span-1", "lg:pr-0"]))
		expect(html).toContain("grid-cols-2 gap-x-8 gap-y-10 md:mt-14 lg:grid-cols-4 lg:gap-x-0")
		expect(html).not.toMatch(/md:(?:grid-cols-4|gap-x-0|col-span-1)/)
	})

	it("synchronizes desktop padding, separators and plus marks at lg", () => {
		const html = renderToStaticMarkup(<Footer />)
		const columns = columnClasses(html)

		expect(columns.slice(0, 3)).toEqual([
			["relative", "lg:px-8", "lg:pl-0"],
			["relative", "lg:px-8", "lg:border-border", "lg:border-l"],
			["relative", "lg:px-8", "lg:border-border", "lg:border-l"],
		])
		expect(columns[3]).toEqual(expect.arrayContaining(["lg:border-border", "lg:border-l"]))
		const plusClasses = Array.from(html.matchAll(/<svg[^>]*class="([^"]*)"/g), (match) => match[1] ?? "")
			.filter((classes) => classes.split(/\s+/).includes("pointer-events-none"))
		expect(plusClasses).toHaveLength(6)
		for (const classes of plusClasses) {
			expect(classes.split(/\s+/)).toEqual(expect.arrayContaining(["hidden", "lg:block"]))
		}
		expect(html).not.toMatch(/md:(?:px-8|pl-0|pr-0|border-border|border-l|block)/)
	})

	it("retains Spanish contact details and the styled contact CTA", () => {
		const html = renderToStaticMarkup(<Footer />)

		for (const copy of ["Servicios", "Empresa", "Legal", "Contacto", "Santiago, Chile", "Lun-Vie 9:00 – 18:00 (CLT)", "Conversemos"]) {
			expect(html).toContain(copy)
		}
		expect(html).toContain('href="mailto:contacto@ingsimple.cl"')
		expect(html).toContain("contacto@ingsimple.cl</a>")
		expect(html).toMatch(/<a href="\/contacto" class="[^"]*border-brand-blue bg-brand-blue text-brand-blue-foreground[^"]*">/)
	})
})
