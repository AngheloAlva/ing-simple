import type { ProjectData } from "@/lib/portfolio-data"
import { parseSpanishMonthYear } from "@/lib/seo/dates"
import type { Service } from "@/lib/services"
import type { MetadataRoute } from "next"

/**
 * Last time static/service copy changed. Bump this whenever the home,
 * casos index, sobre-nosotros, contacto, privacidad or a service page's
 * content is edited — it is not derived automatically.
 */
export const CONTENT_UPDATED_AT = "2026-09-06"

/** Latest milestone date that can be parsed unambiguously, or `undefined`. */
function latestParsableMilestoneDate(project: ProjectData): string | undefined {
	const timeline = project.caseStudy?.timeline ?? []
	const parsed = timeline
		.map((milestone) => parseSpanishMonthYear(milestone.date))
		.filter((date): date is string => date !== undefined)

	if (parsed.length === 0) return undefined
	return parsed.sort().at(-1)
}

/**
 * Pure sitemap builder, unit-testable independent of Next's `sitemap.ts`
 * file convention. Static pages and service pages are stamped with `now`
 * (the caller passes `CONTENT_UPDATED_AT`); case pages use the latest
 * milestone date their own case-study data can supply, falling back to
 * `now` when nothing parses.
 */
export function buildSitemap(
	base: string,
	services: Service[],
	projects: ProjectData[],
	now: string,
): MetadataRoute.Sitemap {
	const staticRoutes: MetadataRoute.Sitemap = [
		{ url: base, priority: 1, changeFrequency: "weekly", lastModified: now },
		{ url: `${base}/casos`, priority: 0.9, changeFrequency: "weekly", lastModified: now },
		{
			url: `${base}/sobre-nosotros`,
			priority: 0.6,
			changeFrequency: "monthly",
			lastModified: now,
		},
		{ url: `${base}/contacto`, priority: 0.7, changeFrequency: "yearly", lastModified: now },
		{ url: `${base}/privacidad`, priority: 0.2, changeFrequency: "yearly", lastModified: now },
	]

	const servicePages: MetadataRoute.Sitemap = services.map((service) => ({
		url: `${base}${service.href}`,
		priority: 0.8,
		changeFrequency: "monthly",
		lastModified: now,
	}))

	const casePages: MetadataRoute.Sitemap = projects
		.filter((project) => project.isFlagship === true && project.caseStudy !== undefined)
		.map((project) => ({
			url: `${base}/casos/${project.id}`,
			priority: 0.7,
			changeFrequency: "monthly",
			lastModified: latestParsableMilestoneDate(project) ?? now,
		}))

	return [...staticRoutes, ...servicePages, ...casePages]
}
