"use client"

import { DetailH2, resolveHeadline } from "@/components/case-study/detail-headline"
import { Kicker } from "@/components/corner-plus"
import type { CaseStudy } from "@/lib/portfolio-data"
import { useReducedMotion, useStaggerEntrance } from "@/lib/motion"
import { motion } from "motion/react"
import type { ReactNode } from "react"

interface DetailBeforeAfterProps {
	caseStudy: CaseStudy
}

export function DetailBeforeAfter({ caseStudy }: DetailBeforeAfterProps): ReactNode {
	const reduce = useReducedMotion()
	const { item, itemTransition, viewport } = useStaggerEntrance()
	const headline = resolveHeadline(caseStudy, "beforeAfter")

	if (!caseStudy.beforeAfter || caseStudy.beforeAfter.length === 0) return null

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
				<Kicker>Comparación</Kicker>
				<DetailH2 lead={headline.lead} emphasis={headline.emphasis} />
				{headline.standfirst ? (
					<p className="text-muted-foreground mt-4 max-w-md text-sm leading-relaxed sm:text-base">
						{headline.standfirst}
					</p>
				) : null}
			</motion.div>

			{/* Column headers */}
			<div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-2">
				<div className="border-destructive/20 bg-destructive/5 text-destructive/80 rounded-sm border px-4 py-2 text-sm font-semibold">
					Antes
				</div>
				<div className="border-primary/30 bg-primary/10 text-primary rounded-sm border px-4 py-2 text-sm font-semibold">
					Después
				</div>
			</div>

			{/* Rows */}
			<div className="flex flex-col gap-3">
				{caseStudy.beforeAfter.map((row, i) => (
					<motion.div
						key={i}
						initial="hidden"
						whileInView="visible"
						viewport={viewport}
						variants={item}
						transition={{ ...itemTransition, delay: reduce ? 0 : i * 0.05 }}
						className="grid grid-cols-1 gap-3 md:grid-cols-2"
					>
						<div className="border-border bg-muted/30 flex items-start gap-3 rounded-sm border p-4">
							<span
								className="text-destructive/60 mt-0.5 shrink-0 text-sm font-bold"
								aria-hidden="true"
							>
								✕
							</span>
							<span className="text-muted-foreground text-sm leading-relaxed">{row.before}</span>
						</div>
						<div className="border-border bg-muted/30 flex items-start gap-3 rounded-sm border p-4">
							<span className="text-primary mt-0.5 shrink-0 text-sm font-bold" aria-hidden="true">
								✓
							</span>
							<span className="text-foreground text-sm leading-relaxed font-medium">
								{row.after}
							</span>
						</div>
					</motion.div>
				))}
			</div>
		</section>
	)
}
