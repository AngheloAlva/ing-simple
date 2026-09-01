"use client"

import { getCaseStudyVisuals } from "@/components/case-study/visuals/registry"
import { CornerPlus } from "@/components/corner-plus"
import { CutButton } from "@/components/cut-button"
import { CATEGORY_LABELS, type CaseStudy, type ProjectData } from "@/lib/portfolio-data"
import { useStaggerEntrance } from "@/lib/motion"
import { motion, type Variants } from "motion/react"
import Link from "next/link"
import type { ReactNode } from "react"

interface DetailHeroProps {
	project: ProjectData
	caseStudy: CaseStudy
}

const container: Variants = {
	hidden: {},
	visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

export function DetailHero({ project, caseStudy }: DetailHeroProps): ReactNode {
	const { item, itemTransition } = useStaggerEntrance()

	const HeroMockup = getCaseStudyVisuals(project.id)?.HeroMockup ?? null

	const meta: { label: string; value: string }[] = [
		{ label: "Cliente", value: caseStudy.clientName },
		{ label: "Industria", value: caseStudy.clientIndustry },
		...(caseStudy.team ? [{ label: "Equipo", value: caseStudy.team }] : []),
		{ label: "Duración", value: caseStudy.duration },
		{ label: "Estado", value: caseStudy.inProductionSince },
		...(caseStudy.userBreakdown ? [{ label: "Usuarios", value: caseStudy.userBreakdown }] : []),
	]

	const metaGridCols =
		meta.length === 6 ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6" : "grid-cols-2 sm:grid-cols-4"

	return (
		<section className="relative overflow-hidden">
			{/* Restrained top glow in the primary colour */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-x-0 top-0 -z-[1] h-[45vh] opacity-[0.18]"
				style={{
					background: "radial-gradient(55% 55% at 50% 0%, var(--primary) 0%, transparent 70%)",
				}}
			/>

			<div className="mx-auto max-w-[1440px] px-5 pt-28 pb-16 sm:px-8 sm:pt-36 lg:px-10 lg:pb-24">
				<motion.div variants={container} initial="hidden" animate="visible">
					<motion.div variants={item} transition={itemTransition}>
						<Link
							href="/casos"
							className="focus-ring text-muted-foreground hover:text-foreground inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] uppercase transition-colors"
						>
							<span aria-hidden="true">←</span> Volver a casos
						</Link>
					</motion.div>

					<div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-10">
						{/* Left — copy + CTAs */}
						<div>
							<motion.p
								variants={item}
								transition={itemTransition}
								className="text-muted-foreground font-mono text-[11px] tracking-[0.14em] uppercase"
							>
								Caso de estudio · {CATEGORY_LABELS[project.category]}
							</motion.p>

							<motion.h1
								variants={item}
								transition={itemTransition}
								className="mt-5 font-serif text-4xl leading-[1.1] font-normal tracking-[-0.01em] text-balance sm:text-5xl lg:text-[3.5rem]"
							>
								{project.title}
							</motion.h1>

							<motion.p
								variants={item}
								transition={itemTransition}
								className="text-muted-foreground mt-5 max-w-xl text-[15px] leading-relaxed text-pretty sm:text-base"
							>
								{caseStudy.pitch}
							</motion.p>

							<motion.div
								variants={item}
								transition={itemTransition}
								className="mt-8 flex flex-wrap items-center gap-3"
							>
								{project.liveUrl ? (
									<CutButton
										variant="solid"
										icon="arrow"
										href={project.liveUrl}
										target="_blank"
										rel="noopener noreferrer"
									>
										Ver sitio en vivo
									</CutButton>
								) : null}
								<CutButton variant="outline" href="/contacto">
									Cotizar algo similar
								</CutButton>
							</motion.div>
						</div>

						{/* Right — hero mockup (guarded) */}
						<motion.div variants={item} transition={itemTransition}>
							{HeroMockup ? (
								<div className="border-border bg-muted/40 relative rounded-sm border [&>*]:!rounded-none">
									<CornerPlus className="top-0 left-0 -translate-x-1/2 -translate-y-1/2" />
									<CornerPlus className="top-0 right-0 translate-x-1/2 -translate-y-1/2" />
									<CornerPlus className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
									<CornerPlus className="right-0 bottom-0 translate-x-1/2 translate-y-1/2" />
									<HeroMockup label={`Vista de ${project.title}`} />
								</div>
							) : (
								<div className="border-border bg-muted/40 relative aspect-video w-full rounded-sm border">
									<CornerPlus className="top-0 left-0 -translate-x-1/2 -translate-y-1/2" />
									<CornerPlus className="top-0 right-0 translate-x-1/2 -translate-y-1/2" />
									<CornerPlus className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
									<CornerPlus className="right-0 bottom-0 translate-x-1/2 translate-y-1/2" />
								</div>
							)}
						</motion.div>
					</div>

					{/* Meta strip */}
					<motion.dl
						variants={item}
						transition={itemTransition}
						className={`border-border mt-14 grid gap-x-6 gap-y-6 border-t pt-8 ${metaGridCols}`}
					>
						{meta.map((entry) => (
							<div key={entry.label}>
								<dt className="text-muted-foreground font-mono text-[10px] tracking-[0.16em] uppercase">
									{entry.label}
								</dt>
								<dd className="text-foreground mt-1.5 text-sm font-medium">{entry.value}</dd>
							</div>
						))}
					</motion.dl>
				</motion.div>
			</div>
		</section>
	)
}
