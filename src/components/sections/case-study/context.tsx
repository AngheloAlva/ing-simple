"use client"

import { motion } from "motion/react"

import Logo from "@/components/shared/logo"
import MagicTransform from "@/components/sections/case-study/magic-transformation"

import type { CaseStudy, ProjectData } from "@/lib/portfolio-data"

import { getCaseStudyVisuals } from "./visuals/registry"

interface CaseStudyContextProps {
	project: ProjectData
	caseStudy: CaseStudy
}

function getShortName(title: string) {
	const dash = title.indexOf(" — ")
	return dash > 0 ? title.slice(0, dash) : title
}

export function CaseStudyContext({ project, caseStudy }: CaseStudyContextProps) {
	const visuals = getCaseStudyVisuals(project.id)
	const shortName = getShortName(project.title)
	const config = visuals?.context
	const centerContent = config?.centerContent ?? (
		<Logo className="h-10 w-auto" classNameIcon="text-accent" classNameText="text-foreground" />
	)

	return (
		<section className="bg-background w-full px-4 py-16 sm:px-6 sm:py-20 md:py-24 lg:px-8 lg:py-28">
			<div className="mx-auto w-full max-w-6xl">
				<div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
					<div className="lg:col-span-4">
						<motion.span
							initial={{ opacity: 0, y: 12 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.5 }}
							transition={{ duration: 0.4 }}
							className="text-muted-foreground text-xs font-medium tracking-[0.18em] uppercase"
						>
							01 — Punto de partida
						</motion.span>
						<motion.h2
							initial={{ opacity: 0, y: 18 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.5 }}
							transition={{ duration: 0.5, delay: 0.05 }}
							className="text-foreground mt-3 text-3xl font-medium tracking-tight sm:text-4xl"
						>
							El problema antes de {shortName}
						</motion.h2>
					</div>

					<div className="lg:col-span-8">
						<div className="flex flex-col gap-6">
							{caseStudy.problem.map((paragraph, i) => (
								<motion.p
									key={i}
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true, amount: 0.3 }}
									transition={{ duration: 0.5, delay: i * 0.08 }}
									className="text-muted-foreground text-base leading-relaxed sm:text-lg"
								>
									{paragraph}
								</motion.p>
							))}
						</div>
					</div>
				</div>

				{config && (
					<motion.div
						initial={{ opacity: 0, y: 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.15 }}
						transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
						className="border-border bg-muted/40 mt-14 overflow-hidden rounded-2xl border"
					>
						<div className="border-border bg-background/60 flex items-center justify-between border-b px-5 py-3">
							<span className="text-muted-foreground text-[10px] font-medium tracking-[0.18em] uppercase">
								{config.bannerLeft}
							</span>
							<span className="text-muted-foreground text-[10px] font-medium tracking-[0.18em] uppercase">
								{config.bannerRight}
							</span>
						</div>

						<div className="px-2 py-4 sm:px-4 sm:py-6">
							<MagicTransform
								height={520}
								axisColor={config.axisColor}
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
				)}
			</div>
		</section>
	)
}
