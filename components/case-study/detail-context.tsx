"use client"

import MagicTransform from "@/components/case-study/magic-transformation"
import { getCaseStudyVisuals } from "@/components/case-study/visuals/registry"
import { CornerPlus, Kicker } from "@/components/corner-plus"
import type { CaseStudy, ProjectData } from "@/lib/portfolio-data"
import { useStaggerEntrance } from "@/lib/motion"
import { motion } from "motion/react"
import type { ReactNode } from "react"

interface DetailContextProps {
	project: ProjectData
	caseStudy: CaseStudy
}

function getShortName(title: string): string {
	const dash = title.indexOf(" — ")
	return dash > 0 ? title.slice(0, dash) : title
}

export function DetailContext({ project, caseStudy }: DetailContextProps): ReactNode {
	const { container, item, itemTransition, viewport } = useStaggerEntrance()
	const config = getCaseStudyVisuals(project.id)?.context
	const shortName = getShortName(project.title)

	// The transformer's centre tile always shows the client, never our own logo.
	const centerContent = project.clientLogo ? (
		// eslint-disable-next-line @next/next/no-img-element -- decorative tile inside a canvas-like visual
		<img
			src={project.clientLogo}
			alt={caseStudy.clientName}
			className="max-h-7 w-auto max-w-full object-contain"
		/>
	) : (
		<span className="text-xs font-semibold tracking-tight">{caseStudy.clientName}</span>
	)

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
					<Kicker>Punto de partida</Kicker>
					<h2 className="mt-4 font-serif text-3xl leading-[1.1] font-normal tracking-[-0.01em] text-balance sm:text-4xl lg:text-[2.75rem]">
						El problema antes de{" "}
						<span className="font-sans font-semibold tracking-tight">{shortName}</span>
					</h2>
				</motion.div>

				<motion.div
					initial="hidden"
					whileInView="visible"
					viewport={viewport}
					variants={container}
					className="flex flex-col gap-6"
				>
					{caseStudy.problem.map((paragraph, i) => (
						<motion.p
							key={i}
							variants={item}
							transition={itemTransition}
							className="text-muted-foreground text-[15px] leading-relaxed sm:text-base"
						>
							{typeof paragraph === "string" ? (
								paragraph
							) : (
								<>
									<strong className="text-foreground font-semibold">{paragraph.headline}</strong>{" "}
									{paragraph.body}
								</>
							)}
						</motion.p>
					))}
				</motion.div>
			</div>

			{config ? (
				<motion.div
					initial="hidden"
					whileInView="visible"
					viewport={viewport}
					variants={item}
					transition={itemTransition}
					className="border-border bg-muted/40 relative mt-14 rounded-sm border"
				>
					<CornerPlus className="top-0 left-0 -translate-x-1/2 -translate-y-1/2" />
					<CornerPlus className="top-0 right-0 translate-x-1/2 -translate-y-1/2" />
					<CornerPlus className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
					<CornerPlus className="right-0 bottom-0 translate-x-1/2 translate-y-1/2" />

					<div className="border-border bg-background/60 flex items-center justify-between border-b px-5 py-3">
						<span className="text-muted-foreground font-mono text-[10px] tracking-[0.16em] uppercase">
							{config.bannerLeft}
						</span>
						<span className="text-muted-foreground font-mono text-[10px] tracking-[0.16em] uppercase">
							{config.bannerRight}
						</span>
					</div>

					<div className="px-2 py-4 sm:px-4 sm:py-6">
						<MagicTransform
							height={520}
							centerSize={92}
							documentDuration={5}
							documentWidth={200}
							documentHeight={280}
							particleCount={22}
							results={config.modules}
							centerContent={centerContent}
						/>
					</div>

					<div className="border-border border-t px-5 py-3">
						<p className="text-muted-foreground text-center text-xs sm:text-sm">
							{config.footerText}
						</p>
					</div>
				</motion.div>
			) : null}
		</section>
	)
}
