"use client"

import { DetailH2, resolveHeadline } from "@/components/case-study/detail-headline"
import { Kicker } from "@/components/corner-plus"
import type { CaseStudy } from "@/lib/portfolio-data"
import { useStaggerEntrance } from "@/lib/motion"
import { motion } from "motion/react"
import type { ReactNode } from "react"

interface DetailSolutionProps {
	caseStudy: CaseStudy
}

export function DetailSolution({ caseStudy }: DetailSolutionProps): ReactNode {
	const { container, item, itemTransition, viewport } = useStaggerEntrance()
	const headline = resolveHeadline(caseStudy, "solution")

	return (
		<section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 sm:pb-32 lg:px-10">
			<div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
				<motion.div
					initial="hidden"
					whileInView="visible"
					viewport={viewport}
					variants={item}
					transition={itemTransition}
					className="lg:pt-2"
				>
					<Kicker>Solución</Kicker>
					<DetailH2 lead={headline.lead} emphasis={headline.emphasis} />
					{headline.standfirst ? (
						<p className="text-muted-foreground mt-4 max-w-md text-sm leading-relaxed sm:text-base">
							{headline.standfirst}
						</p>
					) : null}
				</motion.div>

				<motion.div
					initial="hidden"
					whileInView="visible"
					viewport={viewport}
					variants={container}
					className="flex flex-col gap-6"
				>
					{caseStudy.solution.map((paragraph, i) => (
						<motion.p
							key={i}
							variants={item}
							transition={itemTransition}
							className="text-foreground text-[15px] leading-relaxed sm:text-base"
						>
							{typeof paragraph === "string" ? (
								paragraph
							) : (
								<>
									<strong className="text-foreground font-semibold">{paragraph.headline}</strong>{" "}
									<span className="text-muted-foreground">{paragraph.body}</span>
								</>
							)}
						</motion.p>
					))}
				</motion.div>
			</div>
		</section>
	)
}
