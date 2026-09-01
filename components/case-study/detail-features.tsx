"use client"

import { DetailH2, resolveHeadline } from "@/components/case-study/detail-headline"
import { getCaseStudyVisuals } from "@/components/case-study/visuals/registry"
import { Kicker } from "@/components/corner-plus"
import type { CaseStudy, CaseStudyFeature, ProjectData } from "@/lib/portfolio-data"
import { useReducedMotion, useStaggerEntrance } from "@/lib/motion"
import { FileText, type LucideIcon } from "lucide-react"
import { motion } from "motion/react"
import type { ReactNode } from "react"

interface DetailFeaturesProps {
	project: ProjectData
	caseStudy: CaseStudy
}

interface FeatureWithVisual {
	key: string
	title: string
	description: string
	icon: LucideIcon
	visual: ReactNode
	span: "full" | "wide" | "narrow"
}

function buildFeatures(
	features: CaseStudyFeature[],
	registry: Record<
		string,
		{ visual: ReactNode; span: "full" | "wide" | "narrow"; icon?: LucideIcon }
	>
): FeatureWithVisual[] {
	return features.map((f) => {
		const entry = registry[f.title]
		return {
			key: f.title,
			title: f.title,
			description: f.description,
			icon: entry?.icon ?? FileText,
			visual: entry?.visual ?? null,
			span: entry?.span ?? "narrow",
		}
	})
}

// Capped at four columns; larger counts wrap instead of squeezing cards.
const narrowGridByCount: Record<number, string> = {
	1: "lg:grid-cols-1",
	2: "lg:grid-cols-2",
	3: "lg:grid-cols-3",
}

export function DetailFeatures({ project, caseStudy }: DetailFeaturesProps): ReactNode {
	const { item, itemTransition, viewport } = useStaggerEntrance()
	const headline = resolveHeadline(caseStudy, "features")
	const registry = getCaseStudyVisuals(project.id)?.features ?? {}
	const features = buildFeatures(caseStudy.features, registry)
	const full = features.filter((f) => f.span === "full")
	const wide = features.filter((f) => f.span === "wide")
	const narrow = features.filter((f) => f.span === "narrow")
	const narrowCols = narrowGridByCount[narrow.length] ?? "lg:grid-cols-4"

	return (
		<section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 sm:pb-32 lg:px-10">
			<motion.div
				initial="hidden"
				whileInView="visible"
				viewport={viewport}
				variants={item}
				transition={itemTransition}
				className="mb-10 max-w-2xl"
			>
				<Kicker>Funcionalidades clave</Kicker>
				<DetailH2 lead={headline.lead} emphasis={headline.emphasis} />
				{headline.standfirst ? (
					<p className="text-muted-foreground mt-4 max-w-md text-sm leading-relaxed sm:text-base">
						{headline.standfirst}
					</p>
				) : null}
			</motion.div>

			{full.length > 0 ? (
				<div className="grid grid-cols-1 gap-4 md:gap-5">
					{full.map((f, i) => (
						<BentoCard key={f.key} feature={f} index={i} large />
					))}
				</div>
			) : null}

			{wide.length > 0 ? (
				<div
					className={`grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 ${
						full.length > 0 ? "mt-4 md:mt-5" : ""
					}`}
				>
					{wide.map((f, i) => (
						<BentoCard key={f.key} feature={f} index={i} large />
					))}
				</div>
			) : null}

			{narrow.length > 0 ? (
				<div
					className={`mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-5 md:gap-5 ${narrowCols}`}
				>
					{narrow.map((f, i) => (
						<BentoCard key={f.key} feature={f} index={i} />
					))}
				</div>
			) : null}
		</section>
	)
}

function BentoCard({
	feature,
	index,
	large = false,
}: {
	feature: FeatureWithVisual
	index: number
	large?: boolean
}): ReactNode {
	const reduce = useReducedMotion()
	const { item, itemTransition, viewport } = useStaggerEntrance()
	const Icon = feature.icon
	return (
		<motion.article
			initial="hidden"
			whileInView="visible"
			viewport={viewport}
			variants={item}
			transition={{ ...itemTransition, delay: reduce ? 0 : index * 0.06 }}
			className={`group border-border bg-background relative flex flex-col overflow-hidden rounded-sm border ${
				large ? "min-h-[26rem] p-6 sm:p-8" : "min-h-[16rem] p-5"
			}`}
		>
			<div className="flex items-center gap-2.5">
				<span className="border-border bg-background text-primary flex h-8 w-8 items-center justify-center rounded-sm border">
					<Icon className="h-4 w-4" aria-hidden="true" />
				</span>
				<h3
					className={`text-foreground font-semibold tracking-tight ${
						large ? "text-xl" : "text-base"
					}`}
				>
					{feature.title}
				</h3>
			</div>
			<p
				className={`text-muted-foreground mt-3 leading-relaxed ${
					large ? "max-w-md text-sm sm:text-[15px]" : "text-xs sm:text-sm"
				}`}
			>
				{feature.description}
			</p>
			{feature.visual ? (
				<div className={`[&>*]:!rounded-none ${large ? "pt-6 sm:pt-8" : "pt-4"}`}>
					{feature.visual}
				</div>
			) : null}
		</motion.article>
	)
}
