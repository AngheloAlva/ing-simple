import { describe, expect, it } from "vitest"
import { siteConfig } from "@/lib/metadata"
import type { GuiaMeta } from "@/lib/guias/schema"
import type { ProjectData } from "@/lib/portfolio-data"
import type { Service } from "@/lib/services"
import {
	articleJsonLd,
	breadcrumbJsonLd,
	faqJsonLd,
	guiaJsonLd,
	organizationJsonLd,
	serviceJsonLd,
	webSiteJsonLd,
} from "@/lib/seo/json-ld"

describe("organizationJsonLd", () => {
	it("builds a ProfessionalService node with a stable @id", () => {
		const org = organizationJsonLd()

		expect(org).toMatchObject({
			"@context": "https://schema.org",
			"@type": "ProfessionalService",
			"@id": `${siteConfig.url}/#organization`,
			"name": "Ingeniería Simple SpA",
			"alternateName": ["Ingeniería Simple", "IngSimple"],
			"url": siteConfig.url,
			"logo": `${siteConfig.url}/logo.svg`,
			"image": `${siteConfig.url}/opengraph-image`,
			"email": "contacto@ingsimple.cl",
			"description": siteConfig.description,
			"areaServed": { "@type": "Country", "name": "Chile" },
			"address": {
				"@type": "PostalAddress",
				"addressLocality": "Santiago",
				"addressCountry": "CL",
			},
			"sameAs": ["https://www.linkedin.com/company/ingenieria-simple/"],
		})
	})
})

describe("webSiteJsonLd", () => {
	it("references the organization by @id and declares es-CL", () => {
		const site = webSiteJsonLd()
		const org = organizationJsonLd()

		expect(site).toMatchObject({
			"@context": "https://schema.org",
			"@type": "WebSite",
			"name": siteConfig.name,
			"url": siteConfig.url,
			"inLanguage": "es-CL",
			"publisher": { "@id": org["@id"] },
		})
	})
})

describe("breadcrumbJsonLd", () => {
	it("builds a 1-based, absolute-URL BreadcrumbList", () => {
		const list = breadcrumbJsonLd([
			{ name: "Inicio", path: "/" },
			{ name: "Casos", path: "/casos" },
		])

		expect(list).toEqual({
			"@context": "https://schema.org",
			"@type": "BreadcrumbList",
			"itemListElement": [
				{
					"@type": "ListItem",
					"position": 1,
					"name": "Inicio",
					"item": `${siteConfig.url}/`,
				},
				{
					"@type": "ListItem",
					"position": 2,
					"name": "Casos",
					"item": `${siteConfig.url}/casos`,
				},
			],
		})
	})
})

describe("faqJsonLd", () => {
	it("builds a FAQPage from question/answer pairs", () => {
		const faq = faqJsonLd([{ question: "¿Q?", answer: "A." }])

		expect(faq).toEqual({
			"@context": "https://schema.org",
			"@type": "FAQPage",
			"mainEntity": [
				{
					"@type": "Question",
					"name": "¿Q?",
					"acceptedAnswer": { "@type": "Answer", "text": "A." },
				},
			],
		})
	})
})

describe("serviceJsonLd", () => {
	it("keeps the same Service + FAQPage shape as the original inline builder", () => {
		const service: Service = {
			slug: "reportabilidad",
			href: "/servicios/reportabilidad",
			title: "Reportabilidad y dashboards",
			shortName: "Reportabilidad",
			icon: (() => null) as unknown as Service["icon"],
			shape: "square" as unknown as Service["shape"],
			description: "desc",
			page: {
				seoTitle: "Reportabilidad",
				seoDescription: "Descripción del servicio.",
				pageTitle: "Reportabilidad",
				pageTitleAccent: "y dashboards",
				pageSubtitle: "sub",
				problem: "problema",
				audience: ["a"],
				includes: [],
				process: [],
				ctaTitle: "cta",
				ctaBody: "cta body",
				caseCategory: "reportabilidad",
				faq: [{ q: "¿Qué?", a: "Respuesta." }],
			},
		} as unknown as Service

		const result = serviceJsonLd(service)

		expect(result).toEqual([
			{
				"@context": "https://schema.org",
				"@type": "Service",
				"serviceType": service.title,
				"provider": {
					"@type": "Organization",
					"name": "Ingeniería Simple SpA",
					"url": siteConfig.url,
				},
				"areaServed": { "@type": "Country", "name": "Chile" },
				"description": service.page.seoDescription,
				"url": `${siteConfig.url}${service.href}`,
			},
			{
				"@context": "https://schema.org",
				"@type": "FAQPage",
				"mainEntity": [
					{
						"@type": "Question",
						"name": "¿Qué?",
						"acceptedAnswer": { "@type": "Answer", "text": "Respuesta." },
					},
				],
			},
		])
	})
})

describe("articleJsonLd", () => {
	function baseProject(overrides: Partial<ProjectData> = {}): ProjectData {
		return {
			id: "otc",
			imageUrl: "/img/portfolio/placeholder.jpg",
			title: "OTC 360",
			shortDescription: "Sistema de gestión",
			fullDescription: "Sistema de gestión completo",
			category: "desarrollo-web",
			technologies: [],
			isFlagship: true,
			caseStudy: {
				pitch: "Plataforma de gestión de órdenes de trabajo.",
				duration: "12 meses",
				inProductionSince: "Abril 2025",
				clientName: "OTC",
				clientIndustry: "Industria",
				visualPrivacy: "public",
				problem: [],
				solution: [],
				architectureDescription: "",
				techStackDetailed: [],
				features: [],
				metrics: [],
				timeline: [
					{ date: "Enero 2025", title: "Kickoff", description: "", icon: "kickoff" },
					{ date: "Abril 2025", title: "Lanzamiento", description: "", icon: "launch" },
					{ date: "Hoy", title: "Hoy", description: "", icon: "current", isCurrent: true },
				],
			},
			...overrides,
		} as ProjectData
	}

	it("builds an Article referencing the org for author and publisher", () => {
		const project = baseProject()
		const article = articleJsonLd(project)
		const org = organizationJsonLd()

		expect(article).toMatchObject({
			"@context": "https://schema.org",
			"@type": "Article",
			"headline": "OTC 360",
			"description": "Plataforma de gestión de órdenes de trabajo.",
			"url": `${siteConfig.url}/casos/otc`,
			"inLanguage": "es-CL",
			"author": { "@id": org["@id"] },
			"publisher": { "@id": org["@id"] },
			"datePublished": "2025-04-01",
		})
	})

	it("falls back to shortDescription when there is no pitch", () => {
		const project = baseProject()
		// @ts-expect-error -- exercising the fallback path deliberately
		project.caseStudy.pitch = undefined
		const article = articleJsonLd(project)

		expect(article.description).toBe(project.shortDescription)
	})

	it("omits datePublished when no milestone date can be parsed", () => {
		const project = baseProject({
			caseStudy: {
				...baseProject().caseStudy!,
				timeline: [{ date: "Hoy", title: "Hoy", description: "", icon: "current" }],
			},
		})

		const article = articleJsonLd(project)

		expect(article.datePublished).toBeUndefined()
	})
})

describe("guiaJsonLd", () => {
	function baseGuia(overrides: Partial<GuiaMeta> = {}): GuiaMeta {
		return {
			slug: "ia-en-procesos-por-donde-empezar",
			title: "Cómo empezar con IA en tus procesos",
			description: "Una guía práctica para pymes que quieren dar el primer paso con IA.",
			publishedAt: "2026-09-06",
			tema: "ia",
			servicio: "automatizaciones",
			tags: ["ia", "pymes"],
			draft: false,
			readingTimeMinutes: 4,
			portada: "/img/guias/ia-en-procesos-por-donde-empezar.png",
			portadaAlt: "Persona revisando un panel con procesos automatizados",
			...overrides,
		}
	}

	it("builds an Article referencing the org, with keywords from tags", () => {
		const guia = baseGuia()
		const article = guiaJsonLd(guia)
		const org = organizationJsonLd()

		expect(article).toMatchObject({
			"@context": "https://schema.org",
			"@type": "Article",
			"headline": guia.title,
			"description": guia.description,
			"url": `${siteConfig.url}/guias/${guia.slug}`,
			"inLanguage": "es-CL",
			"author": { "@id": org["@id"] },
			"publisher": { "@id": org["@id"] },
			"datePublished": "2026-09-06",
			"dateModified": "2026-09-06",
			"image": [`${siteConfig.url}${guia.portada}`],
			"keywords": "ia, pymes",
		})
	})

	it("uses updatedAt for dateModified when present", () => {
		const guia = baseGuia({ updatedAt: "2026-09-10" })
		const article = guiaJsonLd(guia)

		expect(article.dateModified).toBe("2026-09-10")
	})

	it("omits keywords when there are no tags", () => {
		const guia = baseGuia({ tags: [] })
		const article = guiaJsonLd(guia)

		expect(article.keywords).toBeUndefined()
	})
})
