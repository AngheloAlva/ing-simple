"use client"

import { DetailH2, resolveHeadline } from "@/components/case-study/detail-headline"
import { TechGlyph } from "@/components/case-study/tech-icon"
import { CornerPlus, Kicker } from "@/components/corner-plus"
import type { CaseStudy } from "@/lib/portfolio-data"
import { useStaggerEntrance } from "@/lib/motion"
import { ArrowRight } from "lucide-react"
import { motion } from "motion/react"
import type { ReactNode } from "react"

interface DetailTechStackProps {
	caseStudy: CaseStudy
}

const DEFAULT_INTRO =
	"Cada pieza del stack responde a una restricción concreta del proyecto. Esto es lo que pensamos al elegir."

export function DetailTechStack({ caseStudy }: DetailTechStackProps): ReactNode {
	const { item, itemTransition, viewport } = useStaggerEntrance()
	const headline = resolveHeadline(caseStudy, "techStack")
	const introText = headline.standfirst ?? caseStudy.techStackIntro ?? DEFAULT_INTRO
	const items = caseStudy.techStackDetailed
	const count = items.length

	return (
		<section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 sm:pb-32 lg:px-10">
			<motion.div
				initial="hidden"
				whileInView="visible"
				viewport={viewport}
				variants={item}
				transition={itemTransition}
				className="border-border mb-10 max-w-2xl border-b pb-8"
			>
				<Kicker>Decisiones técnicas</Kicker>
				<DetailH2 lead={headline.lead} emphasis={headline.emphasis} />
				<p className="text-muted-foreground mt-4 max-w-md text-sm leading-relaxed sm:text-base">
					{introText}
				</p>
			</motion.div>

			<motion.div
				initial="hidden"
				whileInView="visible"
				viewport={viewport}
				variants={item}
				transition={itemTransition}
				className="border-border relative grid grid-cols-1 rounded-sm border sm:grid-cols-2"
			>
				<CornerPlus className="top-0 left-0 -translate-x-1/2 -translate-y-1/2" />
				<CornerPlus className="top-0 right-0 translate-x-1/2 -translate-y-1/2" />
				<CornerPlus className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
				<CornerPlus className="right-0 bottom-0 translate-x-1/2 translate-y-1/2" />

				{items.map((entry, i) => {
					const isLast = i === count - 1
					const isLastOdd = isLast && count % 2 === 1
					// On two columns the last row has no bottom divider: the last two
					// cells when the count is even, only the spanning cell when odd.
					const isPenultimateOfEvenCount = count % 2 === 0 && i === count - 2
					const isSecondColumn = i % 2 === 1
					return (
						<div
							key={entry.name}
							className={[
								"border-border relative overflow-hidden border-b p-6 sm:p-8",
								isLast ? "border-b-0" : "",
								isPenultimateOfEvenCount ? "sm:border-b-0" : "",
								isSecondColumn ? "sm:border-l" : "",
								isLastOdd ? "sm:col-span-2" : "",
							]
								.filter(Boolean)
								.join(" ")}
						>
							{/* Brand logo as an oversized corner watermark. currentColor-based
                  glyphs adapt to the theme via text-foreground; multicolor logos
                  keep their internal detail as gray shades via grayscale. */}
							<span
								className="text-foreground pointer-events-none absolute -top-5 -right-5 opacity-[0.12] [filter:grayscale(1)] dark:opacity-[0.16]"
								aria-hidden="true"
							>
								<TechGlyph name={entry.name} className="h-28 w-28 sm:h-36 sm:w-36" />
							</span>

							<div className="relative flex flex-col gap-3">
								<div className="flex items-start justify-between gap-3">
									<h3 className="text-foreground text-lg font-semibold tracking-tight">
										{entry.name}
									</h3>
									{entry.tag ? (
										<span className="border-primary/30 bg-primary/10 text-primary shrink-0 self-start rounded-sm border px-2 py-0.5 font-mono text-[10px] tracking-wide uppercase">
											{entry.tag}
										</span>
									) : null}
								</div>

								{entry.detail ? (
									<>
										<p className="text-muted-foreground text-sm leading-relaxed italic">
											{entry.detail.constraint}
										</p>
										<p className="text-foreground/80 text-sm leading-relaxed">
											{entry.detail.decision}
										</p>
										<p className="text-primary flex items-start gap-1.5 text-sm leading-relaxed">
											<ArrowRight className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
											<span>
												<strong className="font-semibold">Resultado:</strong> {entry.detail.outcome}
											</span>
										</p>
									</>
								) : (
									<p className="text-muted-foreground text-sm leading-relaxed">{entry.reason}</p>
								)}
							</div>
						</div>
					)
				})}
			</motion.div>
		</section>
	)
}
