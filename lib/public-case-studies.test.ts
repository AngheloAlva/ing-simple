import { describe, expect, it } from "vitest"
import { casesUnderReview } from "@/lib/case-studies-under-review"
import { portfolioProjects, type ProjectData } from "@/lib/portfolio-data"
import { isPublicCaseStudy } from "@/lib/public-case-studies"

const published = portfolioProjects.find((project) => isPublicCaseStudy(project))!

describe("isPublicCaseStudy", () => {
	it("includes a published flagship with a case study", () => {
		expect(isPublicCaseStudy(published)).toBe(true)
	})

	it("excludes a draft even if it is flagship and has a case study", () => {
		expect(isPublicCaseStudy(casesUnderReview[0]!)).toBe(false)
	})

	it("excludes non-flagship projects", () => {
		expect(isPublicCaseStudy({ ...published, isFlagship: false })).toBe(false)
	})

	it("excludes projects without a case study", () => {
		const { caseStudy: _caseStudy, ...withoutStudy } = published
		expect(isPublicCaseStudy(withoutStudy as ProjectData)).toBe(false)
	})

	it("counts only published cases for cards, categories, and stats", () => {
		const visible = portfolioProjects.filter(isPublicCaseStudy)
		expect(visible.length).toBeGreaterThan(0)
		expect(visible.every((project) => project.isProduction !== false)).toBe(true)
		expect(visible).toContainEqual(published)
		expect(visible).toHaveLength(9)
		expect(portfolioProjects).toHaveLength(18)
		expect(casesUnderReview.length).toBeGreaterThan(0)
		expect(portfolioProjects.map((project) => project.id)).not.toContain(casesUnderReview[0]!.id)
		expect(portfolioProjects.some((project) => project.isProduction === false)).toBe(false)
	})
})
