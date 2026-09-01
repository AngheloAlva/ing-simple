"use client"

import GradientText from "@/components/gradient-text"
import { brandGradientGreen } from "@/lib/gradient"
import { CornerPlus, Kicker } from "@/components/corner-plus"
import { CutButton } from "@/components/cut-button"
import { getCaseStudyVisuals } from "@/components/case-study/visuals/registry"
import { CATEGORY_LABELS, portfolioProjects } from "@/lib/portfolio-data"
import { ArrowUpRight, Lock } from "lucide-react"
import { AnimatePresence, motion, type Variants } from "motion/react"
import { useState, type ReactNode } from "react"

// Derived from the migrated portfolio data — only projects with a full case
// study, capped for the home showcase. The full set lives on /casos.
const STUDIES = portfolioProjects
	.filter((project) => project.caseStudy)
	.slice(0, 6)
	.map((project, index) => {
		const caseStudy = project.caseStudy!
		const metric = caseStudy.metrics[0]
		return {
			index: String(index + 1).padStart(2, "0"),
			id: project.id,
			title: project.title,
			client: caseStudy.clientName,
			sector: CATEGORY_LABELS[project.category],
			year: caseStudy.inProductionSince.match(/\d{4}/)?.[0] ?? "",
			metric: metric ? `${metric.value} · ${metric.label}` : "",
			summary: project.shortDescription,
			imageUrl: project.imageUrl,
			confidential: caseStudy.visualPrivacy === "confidential-ui",
		}
	})

const TOTAL = String(STUDIES.length).padStart(2, "0")

const listVariants: Variants = {
	hidden: {},
	visible: { transition: { staggerChildren: 0.08 } },
}

const rowVariants: Variants = {
	hidden: { opacity: 0, y: 24 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
	},
}

/**
 * The preview of one case: its hand-built mockup when the registry has one,
 * otherwise the project image. Reframed edge to edge like the /casos grid.
 * Only the active case is mounted, so six mockups never run at once.
 */
function CasePreview({ study }: { study: (typeof STUDIES)[number] }): ReactNode {
	const HeroMockup = getCaseStudyVisuals(study.id)?.HeroMockup ?? null

	if (HeroMockup) {
		return (
			<div className="pointer-events-none absolute inset-0 [&>*]:h-full [&>*]:w-full [&>*]:!rounded-none">
				<HeroMockup label={`Vista de ${study.title}`} />
			</div>
		)
	}

	return (
		<img
			src={study.imageUrl}
			alt={study.title}
			draggable={false}
			className="h-full w-full object-cover"
		/>
	)
}

export function CaseStudy(): ReactNode {
	const [active, setActive] = useState(0)
	const current = STUDIES[active]

	return (
		<section className="mx-auto max-w-360 px-5 pb-32 sm:px-8 sm:pb-44 lg:px-10">
			<div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
				{/* Left column — sticky title + mockup */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-80px" }}
					transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
					className="lg:sticky lg:top-24"
				>
					<div className="flex items-center gap-2">
						<Kicker>Casos de éxito</Kicker>
					</div>
					<h2 className="mt-5 font-serif text-3xl leading-[1.12] font-normal tracking-[-0.01em] text-balance sm:text-4xl lg:text-[2.75rem]">
						Casos medidos en{" "}
						<GradientText
							inline
							className="font-sans font-semibold tracking-tight"
							colors={brandGradientGreen}
							animationSpeed={6}
						>
							resultados
						</GradientText>
						, no en pantallas
					</h2>
					<p className="text-muted-foreground mt-4 max-w-md text-sm leading-relaxed sm:text-base">
						Proyectos reales, en producción, cada uno acompañado hasta que el equipo del cliente lo
						hace suyo.
					</p>
					<div className="border-border bg-background relative mt-10 rounded-sm border sm:mt-12">
						{/* Preview keeps the mockups' native ratio; the caption sits below it
						    so nothing ever covers the visual. */}
						<div className="bg-muted/40 relative aspect-[16/10] overflow-hidden">
							<AnimatePresence initial={false}>
								{current ? (
									<motion.div
										key={current.id}
										initial={{ opacity: 0, scale: 1.04 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0 }}
										transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
										className="absolute inset-0"
									>
										<CasePreview study={current} />
									</motion.div>
								) : null}
							</AnimatePresence>
						</div>

						<div className="border-border flex items-end justify-between gap-4 border-t px-5 py-4 sm:px-6">
							<div className="min-w-0">
								<p className="truncate text-sm font-semibold tracking-tight">{current?.client}</p>
								{current?.metric ? (
									<p className="text-brand-green-text mt-0.5 text-xs font-medium">
										{current.metric}
									</p>
								) : null}
							</div>
							<div className="flex shrink-0 flex-col items-end gap-1.5">
								<span className="text-foreground font-mono text-[11px] tracking-[0.12em]">
									{current?.index} / {TOTAL}
								</span>
								{current?.confidential ? (
									<span className="text-muted-foreground inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.1em] uppercase">
										<Lock className="h-3 w-3" aria-hidden="true" />
										Vista confidencial
									</span>
								) : null}
							</div>
						</div>

						<CornerPlus className="top-0 left-0 -translate-x-1/2 -translate-y-1/2" />
						<CornerPlus className="top-0 right-0 translate-x-1/2 -translate-y-1/2" />
						<CornerPlus className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
						<CornerPlus className="right-0 bottom-0 translate-x-1/2 translate-y-1/2" />
					</div>
				</motion.div>

				{/* Right column — case list */}
				<motion.div
					variants={listVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-80px" }}
					className="border-border -mx-4 border-t px-4"
				>
					{STUDIES.map((study, index) => (
						<motion.a
							key={study.id}
							href={`/casos/${study.id}`}
							variants={rowVariants}
							whileHover="hover"
							onMouseEnter={() => setActive(index)}
							onFocus={() => setActive(index)}
							className={`group border-border focus-visible:outline-brand-blue -mx-4 grid grid-cols-[auto_1fr_auto] items-start gap-5 border-b border-l-2 px-4 py-7 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 sm:gap-8 sm:py-9 ${
								active === index
									? "border-l-brand-blue bg-foreground/[0.035]"
									: "border-l-transparent"
							}`}
						>
							<span
								className={`pt-1.5 font-mono text-xs tracking-[0.12em] transition-colors duration-200 ${
									active === index ? "text-brand-blue" : "text-muted-foreground"
								}`}
							>
								{study.index}
							</span>
							<div className="min-w-0">
								<h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">{study.title}</h3>
								<p className="text-muted-foreground mt-2 text-sm">
									{study.client} · {study.sector} · {study.year}
								</p>
								<p className="text-muted-foreground mt-3 max-w-lg text-sm leading-relaxed text-pretty sm:text-base">
									{study.summary}
								</p>
							</div>
							<span
								className={`mt-1 grid h-11 w-11 shrink-0 place-items-center rounded-sm border transition-colors duration-200 ${
									active === index
										? "border-brand-blue bg-brand-blue text-brand-blue-foreground"
										: "border-border text-foreground"
								}`}
							>
								<motion.span
									variants={{ hover: { x: 2, y: -2 } }}
									transition={{ duration: 0.2, ease: "easeOut" }}
									className="grid place-items-center"
								>
									<ArrowUpRight className="h-4 w-4" aria-hidden="true" />
								</motion.span>
							</span>
						</motion.a>
					))}

					<div className="pt-8">
						<CutButton href="/casos" icon="arrow">
							Ver todos los casos
						</CutButton>
					</div>
				</motion.div>
			</div>
		</section>
	)
}
