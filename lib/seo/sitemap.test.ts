import { describe, expect, it } from "vitest"
import { buildSitemap, CONTENT_UPDATED_AT } from "@/lib/seo/sitemap"
import type { ProjectData } from "@/lib/portfolio-data"
import type { Service } from "@/lib/services"

const BASE = "https://example.cl"

function service(slug: string, href: string): Service {
	return { slug, href } as unknown as Service
}

function project(overrides: Partial<ProjectData> = {}): ProjectData {
	return {
		id: "otc",
		imageUrl: "",
		title: "OTC 360",
		shortDescription: "",
		fullDescription: "",
		category: "desarrollo-web",
		technologies: [],
		isFlagship: true,
		caseStudy: {
			pitch: "",
			duration: "",
			inProductionSince: "",
			clientName: "",
			clientIndustry: "",
			visualPrivacy: "public",
			problem: [],
			solution: [],
			architectureDescription: "",
			techStackDetailed: [],
			features: [],
			metrics: [],
			timeline: [
				{ date: "Enero 2025", title: "", description: "", icon: "kickoff" },
				{ date: "Abril 2025", title: "", description: "", icon: "launch" },
			],
		},
		...overrides,
	} as ProjectData
}

describe("buildSitemap", () => {
	it("includes every static page and no duplicates", () => {
		const entries = buildSitemap(BASE, [], [], CONTENT_UPDATED_AT)
		const urls = entries.map((entry) => entry.url)

		expect(new Set(urls).size).toBe(urls.length)
		expect(urls).toEqual(
			expect.arrayContaining([
				BASE,
				`${BASE}/casos`,
				`${BASE}/sobre-nosotros`,
				`${BASE}/contacto`,
				`${BASE}/privacidad`,
			]),
		)
	})

	it("includes service pages from the given SERVICES list", () => {
		const services = [service("reportabilidad", "/servicios/reportabilidad")]
		const entries = buildSitemap(BASE, services, [], CONTENT_UPDATED_AT)

		expect(entries.map((e) => e.url)).toContain(`${BASE}/servicios/reportabilidad`)
	})

	it("never includes the redirected soluciones-web slug", () => {
		const services = [service("desarrollo-web", "/servicios/desarrollo-web")]
		const entries = buildSitemap(BASE, services, [], CONTENT_UPDATED_AT)

		expect(entries.map((e) => e.url)).not.toContain(`${BASE}/servicios/soluciones-web`)
	})

	it("only includes flagship projects that have a caseStudy", () => {
		const flagshipNoCase = project({ id: "flagship-no-case" })
		delete (flagshipNoCase as { caseStudy?: unknown }).caseStudy

		const projects = [
			project({ id: "flagship-with-case" }),
			flagshipNoCase,
			project({ id: "non-flagship", isFlagship: false }),
		]
		const entries = buildSitemap(BASE, [], projects, CONTENT_UPDATED_AT)
		const urls = entries.map((e) => e.url)

		expect(urls).toContain(`${BASE}/casos/flagship-with-case`)
		expect(urls).not.toContain(`${BASE}/casos/flagship-no-case`)
		expect(urls).not.toContain(`${BASE}/casos/non-flagship`)
	})

	it("static pages and services use CONTENT_UPDATED_AT", () => {
		const services = [service("reportabilidad", "/servicios/reportabilidad")]
		const entries = buildSitemap(BASE, services, [], CONTENT_UPDATED_AT)
		const home = entries.find((e) => e.url === BASE)
		const svc = entries.find((e) => e.url === `${BASE}/servicios/reportabilidad`)

		expect(home?.lastModified).toBe(CONTENT_UPDATED_AT)
		expect(svc?.lastModified).toBe(CONTENT_UPDATED_AT)
	})

	it("case pages use the latest parsable milestone date", () => {
		const projects = [project({ id: "otc" })]
		const entries = buildSitemap(BASE, [], projects, CONTENT_UPDATED_AT)
		const entry = entries.find((e) => e.url === `${BASE}/casos/otc`)

		expect(entry?.lastModified).toBe("2025-04-01")
	})

	it("case pages fall back to CONTENT_UPDATED_AT when no milestone is parsable", () => {
		const projects = [
			project({
				id: "no-dates",
				caseStudy: {
					...project().caseStudy!,
					timeline: [{ date: "Hoy", title: "", description: "", icon: "current" }],
				},
			}),
		]
		const entries = buildSitemap(BASE, [], projects, CONTENT_UPDATED_AT)
		const entry = entries.find((e) => e.url === `${BASE}/casos/no-dates`)

		expect(entry?.lastModified).toBe(CONTENT_UPDATED_AT)
	})
})
