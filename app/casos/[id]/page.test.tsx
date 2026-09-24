import { describe, expect, it, vi } from "vitest"
import { casesUnderReview } from "@/lib/case-studies-under-review"
import { portfolioProjects } from "@/lib/portfolio-data"
import { isPublicCaseStudy } from "@/lib/public-case-studies"

vi.mock("next/navigation", () => ({
	notFound: () => {
		throw new Error("NEXT_NOT_FOUND")
	},
}))

import CaseStudyDetailPage, { generateMetadata, generateStaticParams } from "./page"

const draft = casesUnderReview[0]!
const published = portfolioProjects.find(isPublicCaseStudy)!
const props = (id: string) => ({ params: Promise.resolve({ id }) })

describe("public case detail route function harness", () => {
	it("prerenders only public case studies", () => {
		const ids = generateStaticParams().map(({ id }) => id)
		expect(ids).toContain(published.id)
		expect(portfolioProjects.map(({ id }) => id)).not.toContain(draft.id)
		expect(ids).not.toContain(draft.id)
		expect(ids).toEqual(portfolioProjects.filter(isPublicCaseStudy).map(({ id }) => id))
	})

	it("does not disclose draft metadata, even for a directly requested ID", async () => {
		const metadata = await generateMetadata(props(draft.id))
		expect(metadata.title).toBe("Caso no encontrado")
		expect(metadata.robots).toMatchObject({ index: false })
		expect(JSON.stringify(metadata)).not.toContain(draft.title)
		expect(JSON.stringify(metadata)).not.toContain(draft.caseStudy!.pitch)
		await expect(CaseStudyDetailPage(props(draft.id))).rejects.toThrow("NEXT_NOT_FOUND")
	})

	it("keeps a published page and metadata available", async () => {
		const metadata = await generateMetadata(props(published.id))
		expect(metadata.description).toBe(published.caseStudy!.pitch)
		const page = await CaseStudyDetailPage(props(published.id))
		expect(page).toBeTruthy()
	})

	it("returns not found for unknown IDs", async () => {
		const metadata = await generateMetadata(props("unknown-case-id"))
		expect(metadata.title).toBe("Caso no encontrado")
		await expect(CaseStudyDetailPage(props("unknown-case-id"))).rejects.toThrow("NEXT_NOT_FOUND")
	})
})
