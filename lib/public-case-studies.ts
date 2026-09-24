import type { CaseStudy, ProjectData } from "@/lib/portfolio-data"

/** The same publication boundary applies to cards, counts, and detail routes. */
export function isPublicCaseStudy(
	project: ProjectData
): project is ProjectData & { caseStudy: CaseStudy } {
	return project.isFlagship === true && Boolean(project.caseStudy) && project.isProduction !== false
}
