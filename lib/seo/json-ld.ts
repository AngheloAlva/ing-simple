import { siteConfig } from "@/lib/metadata"
import type { ProjectData } from "@/lib/portfolio-data"
import type { Service } from "@/lib/services"
import { parseSpanishMonthYear } from "@/lib/seo/dates"

const ORGANIZATION_ID = `${siteConfig.url}/#organization`

/**
 * The `ProfessionalService` node every other JSON-LD graph on the site
 * references by `@id` instead of repeating. Keep this the single source of
 * truth for the business's legal name, contact and social profiles.
 */
export function organizationJsonLd(): Record<string, unknown> {
	return {
		"@context": "https://schema.org",
		"@type": "ProfessionalService",
		"@id": ORGANIZATION_ID,
		name: "Ingeniería Simple SpA",
		alternateName: ["Ingeniería Simple", "IngSimple"],
		url: siteConfig.url,
		logo: `${siteConfig.url}/logo.svg`,
		image: `${siteConfig.url}/opengraph-image`,
		email: "contacto@ingsimple.cl",
		description: siteConfig.description,
		areaServed: { "@type": "Country", name: "Chile" },
		address: {
			"@type": "PostalAddress",
			addressLocality: "Santiago",
			addressCountry: "CL",
		},
		sameAs: ["https://www.linkedin.com/company/ingenieria-simple/"],
	}
}

export function webSiteJsonLd(): Record<string, unknown> {
	return {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: siteConfig.name,
		url: siteConfig.url,
		inLanguage: "es-CL",
		publisher: { "@id": ORGANIZATION_ID },
	}
}

export interface BreadcrumbItem {
	name: string
	path: string
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]): Record<string, unknown> {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			item: `${siteConfig.url}${item.path}`,
		})),
	}
}

export interface FaqEntry {
	question: string
	answer: string
}

export function faqJsonLd(items: FaqEntry[]): Record<string, unknown> {
	return {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: items.map((item) => ({
			"@type": "Question",
			name: item.question,
			acceptedAnswer: { "@type": "Answer", text: item.answer },
		})),
	}
}

/**
 * `Service` + `FAQPage` graph for a `/servicios/[slug]` page. Moved out of
 * the page component so it stays pure and testable; the output shape is
 * unchanged from the original inline builder.
 */
export function serviceJsonLd(service: Service): object[] {
	return [
		{
			"@context": "https://schema.org",
			"@type": "Service",
			serviceType: service.title,
			provider: {
				"@type": "Organization",
				name: "Ingeniería Simple SpA",
				url: siteConfig.url,
			},
			areaServed: { "@type": "Country", name: "Chile" },
			description: service.page.seoDescription,
			url: `${siteConfig.url}${service.href}`,
		},
		{
			"@context": "https://schema.org",
			"@type": "FAQPage",
			mainEntity: service.page.faq.map((item) => ({
				"@type": "Question",
				name: item.q,
				acceptedAnswer: { "@type": "Answer", text: item.a },
			})),
		},
	]
}

/**
 * Latest milestone date that can be parsed unambiguously, or `undefined`
 * when every milestone is a range or a relative label ("Hoy"). Never
 * fabricates a date from partial or ambiguous case-study copy.
 */
function latestParsableMilestoneDate(project: ProjectData): string | undefined {
	const timeline = project.caseStudy?.timeline ?? []
	const parsed = timeline
		.map((milestone) => parseSpanishMonthYear(milestone.date))
		.filter((date): date is string => date !== undefined)

	if (parsed.length === 0) return undefined
	return parsed.sort().at(-1)
}

/**
 * `Article` node for a case-study detail page. `datePublished` is included
 * only when a real ISO date can be derived from the case's own milestones.
 */
export function articleJsonLd(project: ProjectData): Record<string, unknown> {
	const description = project.caseStudy?.pitch ?? project.shortDescription
	const datePublished = latestParsableMilestoneDate(project)

	return {
		"@context": "https://schema.org",
		"@type": "Article",
		headline: project.title,
		description,
		url: `${siteConfig.url}/casos/${project.id}`,
		inLanguage: "es-CL",
		author: { "@id": ORGANIZATION_ID },
		publisher: { "@id": ORGANIZATION_ID },
		...(datePublished !== undefined && { datePublished }),
	}
}
