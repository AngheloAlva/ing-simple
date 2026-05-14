"use client"

import { type ReactNode } from "react"
import { motion } from "motion/react"
import { FileText, type LucideIcon } from "lucide-react"

import type { CaseStudy, CaseStudyFeature, ProjectData } from "@/lib/portfolio-data"

import { getCaseStudyVisuals } from "./visuals/registry"

interface CaseStudyFeaturesProps {
	project: ProjectData
	caseStudy: CaseStudy
}

interface FeatureWithVisual {
	key: string
	title: string
	description: string
	icon: LucideIcon
	visual: ReactNode
	span: "wide" | "narrow"
}

function buildFeatures(
	features: CaseStudyFeature[],
	registry: Record<string, { visual: ReactNode; span: "wide" | "narrow"; icon?: LucideIcon }>,
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

const narrowGridByCount: Record<number, string> = {
	1: "lg:grid-cols-1",
	2: "lg:grid-cols-2",
	3: "lg:grid-cols-3",
	4: "lg:grid-cols-4",
	5: "lg:grid-cols-5",
	6: "lg:grid-cols-6",
}

export function CaseStudyFeatures({ project, caseStudy }: CaseStudyFeaturesProps) {
	const visuals = getCaseStudyVisuals(project.id)
	const features = buildFeatures(caseStudy.features, visuals?.features ?? {})
	const wide = features.filter((f) => f.span === "wide")
	const narrow = features.filter((f) => f.span === "narrow")
	const narrowCols = narrowGridByCount[narrow.length] ?? "lg:grid-cols-4"

	return (
		<section className="bg-background w-full px-4 py-16 sm:px-6 sm:py-20 md:py-24 lg:px-8 lg:py-28">
			<div className="mx-auto w-full max-w-6xl">
				<div className="mb-12 max-w-2xl">
					<motion.span
						initial={{ opacity: 0, y: 12 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.5 }}
						transition={{ duration: 0.4 }}
						className="text-muted-foreground text-xs font-medium tracking-[0.18em] uppercase"
					>
						05 — Funcionalidades clave
					</motion.span>
					<motion.h2
						initial={{ opacity: 0, y: 18 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.5 }}
						transition={{ duration: 0.5, delay: 0.05 }}
						className="text-foreground mt-3 text-3xl font-medium tracking-tight sm:text-4xl"
					>
						Los módulos que sostienen la operación
					</motion.h2>
				</div>

				{wide.length > 0 && (
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
						{wide.map((f, i) => (
							<BentoCard key={f.key} feature={f} index={i} large />
						))}
					</div>
				)}

				{narrow.length > 0 && (
					<div
						className={`mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-5 md:gap-5 ${narrowCols}`}
					>
						{narrow.map((f, i) => (
							<BentoCard key={f.key} feature={f} index={i} />
						))}
					</div>
				)}
			</div>
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
}) {
	const Icon = feature.icon
	return (
		<motion.article
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.15 }}
			transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
			className={`border-border bg-muted/30 group relative flex flex-col overflow-hidden rounded-2xl border ${
				large ? "min-h-105 p-6 sm:p-8" : "min-h-65 p-5"
			}`}
		>
			<div className="flex items-center gap-2.5">
				<span className="bg-background border-border flex h-8 w-8 items-center justify-center rounded-md border">
					<Icon className="text-accent h-4 w-4" />
				</span>
				<h3 className={`text-foreground font-semibold ${large ? "text-xl" : "text-base"}`}>
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
			{feature.visual && (
				<div className={`mt-auto pt-6 ${large ? "sm:pt-8" : "pt-4"}`}>{feature.visual}</div>
			)}
		</motion.article>
	)
}
