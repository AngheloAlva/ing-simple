import { notFound } from "next/navigation"

import { portfolioProjects } from "@/lib/portfolio-data"
import { createMetadata } from "@/lib/metadata"

import { CaseStudyArchitecture } from "@/components/sections/case-study/architecture"
import { CaseStudyRelatedCta } from "@/components/sections/case-study/related-cta"
import { CaseStudyTechStack } from "@/components/sections/case-study/tech-stack"
import { CaseStudySolution } from "@/components/sections/case-study/solution"
import { CaseStudyFeatures } from "@/components/sections/case-study/features"
import { CaseStudyTimeline } from "@/components/sections/case-study/timeline"
import { CaseStudyMetrics } from "@/components/sections/case-study/metrics"
import { CaseStudyContext } from "@/components/sections/case-study/context"
import { CaseStudyHero } from "@/components/sections/case-study/hero"

import type { ReactNode } from "react"
import type { Metadata } from "next"

interface PageProps {
	params: Promise<{ slug: string }>
}

export function generateStaticParams() {
	return portfolioProjects.filter((p) => p.isFlagship && p.caseStudy).map((p) => ({ slug: p.id }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { slug } = await params
	const project = portfolioProjects.find((p) => p.id === slug)

	if (!project || !project.caseStudy) {
		return createMetadata({
			title: "Caso no encontrado",
			path: `/portafolio/${slug}`,
			noIndex: true,
		})
	}

	return createMetadata({
		title: `${project.title} — Caso de estudio`,
		description: project.caseStudy.pitch,
		path: `/portafolio/${slug}`,
	})
}

export default async function CaseStudyPage({ params }: PageProps): Promise<ReactNode> {
	const { slug } = await params
	const project = portfolioProjects.find((p) => p.id === slug)

	if (!project || !project.caseStudy || !project.isFlagship) {
		notFound()
	}

	const caseStudy = project.caseStudy
	const accent = project.gradientColor ?? "#0f766e"

	return (
		<main id="main-content" className="flex-1">
			<CaseStudyHero project={project} caseStudy={caseStudy} />
			<CaseStudyContext project={project} caseStudy={caseStudy} />
			<CaseStudySolution caseStudy={caseStudy} accent={accent} />
			<CaseStudyArchitecture project={project} caseStudy={caseStudy} accent={accent} />
			<CaseStudyTechStack caseStudy={caseStudy} />
			<CaseStudyFeatures project={project} caseStudy={caseStudy} />
			<CaseStudyTimeline caseStudy={caseStudy} />
			<CaseStudyMetrics caseStudy={caseStudy} />
			<CaseStudyRelatedCta currentId={project.id} />
		</main>
	)
}
