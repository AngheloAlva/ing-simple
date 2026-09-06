import type { ProjectData } from "@/lib/portfolio-data"

const MAX_LENGTH = 60

/**
 * Builds the `<title>` for a `/casos/[id]` case-study detail page.
 *
 * Prefers `${title}: ${label}` — using the case's short `seoLabel` when set,
 * falling back to `shortDescription` otherwise — as long as the combined
 * string fits within a 60-character budget. When it doesn't fit (long
 * project titles or descriptions), falls back to `${title} | Caso de
 * estudio` so the title tag is never truncated by a search engine.
 */
export function caseStudyTitle(project: ProjectData): string {
	const label = project.caseStudy?.seoLabel ?? project.shortDescription
	const combined = `${project.title}: ${label}`

	if (combined.length <= MAX_LENGTH) return combined
	return `${project.title} | Caso de estudio`
}
