"use client"

import { motion } from "motion/react"
import Link from "next/link"

import { ArrowLeft, ArrowUpRight, ChevronRightIcon } from "lucide-react"

import {
	CATEGORY_LABELS,
	type CaseStudy,
	type ProjectData,
	type ProjectCategory,
} from "@/lib/portfolio-data"

import { getCaseStudyVisuals } from "./visuals/registry"
import { VisualMockup } from "./visual-mockup"

interface CaseStudyHeroProps {
	project: ProjectData
	caseStudy: CaseStudy
}

export function CaseStudyHero({ project, caseStudy }: CaseStudyHeroProps) {
	const accent = project.gradientColor ?? "#6366f1"
	const visuals = getCaseStudyVisuals(project.id)
	const HeroMockup = visuals?.HeroMockup ?? VisualMockup

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
		<section className="bg-background relative w-full overflow-hidden px-4 pt-28 pb-16 sm:px-6 sm:pt-32 sm:pb-24 lg:px-8 lg:pt-36 lg:pb-32">
			<div
				className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[60vh] opacity-25"
				style={{
					background: `radial-gradient(60% 60% at 50% 0%, ${accent} 0%, transparent 70%)`,
				}}
				aria-hidden
			/>

			<div className="relative mx-auto w-full max-w-6xl">
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4 }}
				>
					<Link
						href="/portafolio"
						className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
					>
						<ArrowLeft className="h-3.5 w-3.5" />
						Volver al portafolio
					</Link>
				</motion.div>

				<div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-10">
					{/* Left: copy + meta + CTAs */}
					<div>
						<motion.span
							initial={{ opacity: 0, y: 8 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4, delay: 0.05 }}
							className="bg-muted text-muted-foreground inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-[0.15em] uppercase"
						>
							Caso de estudio · {CATEGORY_LABELS[project.category as ProjectCategory]}
						</motion.span>

						<motion.h1
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.1 }}
							className="text-foreground mt-4 text-4xl font-medium tracking-tight sm:text-5xl md:text-6xl"
						>
							{project.title}
						</motion.h1>

						<motion.p
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.2 }}
							className="text-muted-foreground mt-5 max-w-2xl text-base sm:text-lg"
						>
							{caseStudy.pitch}
						</motion.p>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.3 }}
							className="mt-8 flex flex-wrap items-center gap-3"
						>
							{project.liveUrl && (
								<a
									target="_blank"
									rel="noopener noreferrer"
									href={project.liveUrl}
									className="group bg-accent inline-flex h-14 w-fit items-center justify-center gap-3 rounded-md py-2 pr-2 pl-5 font-medium text-white shadow-md transition-all duration-500 ease-out hover:rounded-[50px]"
								>
									<span>Ver sitio en vivo</span>
									<span className="text-accent flex h-9 w-9 items-center justify-center rounded-full bg-white transition-all duration-300 group-hover:scale-110">
										<ArrowUpRight className="h-4 w-4" />
									</span>
								</a>
							)}
							<Link
								href="/contacto"
								className="group bg-ring inline-flex h-14 w-fit items-center justify-center gap-3 rounded-md py-2 pr-2 pl-5 font-medium text-white shadow-md transition-all duration-500 ease-out hover:rounded-[50px]"
							>
								<span>Cotizar algo similar</span>
								<span className="text-ring flex h-9 w-9 items-center justify-center rounded-full bg-white transition-all duration-300 group-hover:scale-110">
									<ChevronRightIcon className="relative left-px h-4 w-4" />
								</span>
							</Link>
						</motion.div>
					</div>

					{/* Right: visual mockup */}
					<div>
						<HeroMockup label={`Vista de ${project.title}`} />
					</div>
				</div>

				{/* Meta strip */}
				<motion.dl
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.4 }}
					className={`border-border mt-14 grid gap-x-6 gap-y-6 border-t pt-8 ${metaGridCols}`}
				>
					{meta.map((item) => (
						<div key={item.label}>
							<dt className="text-muted-foreground text-[10px] font-medium tracking-[0.18em] uppercase">
								{item.label}
							</dt>
							<dd className="text-foreground mt-1.5 text-sm font-medium">{item.value}</dd>
						</div>
					))}
				</motion.dl>
			</div>
		</section>
	)
}
