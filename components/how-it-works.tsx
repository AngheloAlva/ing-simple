"use client"

import { CircuitTrace } from "@/components/circuit-trace"
import { DiagramActiveProvider } from "@/components/diagrams/hover-context"
import { DiagramAuditScan } from "@/components/diagrams/process/audit-scan"
import { DiagramProposalConvert } from "@/components/diagrams/process/proposal-convert"
import { DiagramRolloutGantt } from "@/components/diagrams/process/rollout-gantt"
import { motion, useInView, useReducedMotion, type Variants } from "motion/react"
import { useRef, type ReactNode } from "react"

/**
 * "¿Cómo trabajamos?" — the three steps rendered as a connected timeline,
 * each with a small visual previewing what happens at that stage.
 */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

/**
 * Frames one step's visual and publishes hover state to it. The frame stays
 * `aria-hidden` — the diagram illustrates the copy below rather than adding
 * information — so it is deliberately not focusable.
 */
function StepVisual({ visual: Visual }: { visual: () => ReactNode }): ReactNode {
	const ref = useRef<HTMLDivElement>(null)
	// 60% on screen, so a card clipped by the fold never plays unseen.
	const inView = useInView(ref, { amount: 0.6 })

	return (
		<div
			ref={ref}
			aria-hidden="true"
			className="border-border bg-background rounded-sm border p-4 lg:h-56"
		>
			<DiagramActiveProvider active={inView}>
				<Visual />
			</DiagramActiveProvider>
		</div>
	)
}

const STEPS = [
	{
		title: "Diagnóstico",
		copy: "Revisamos tus fuentes de datos y tus procesos actuales para identificar dónde se pierde tiempo y qué conviene resolver primero.",
		visual: DiagramAuditScan,
	},
	{
		title: "Propuesta",
		copy: "Diseñamos la solución a medida de tu operación, con alcance, etapas y cronograma claros antes de escribir una línea de código.",
		visual: DiagramProposalConvert,
	},
	{
		title: "Implementación",
		copy: "Construimos por etapas con entregas frecuentes, capacitamos a tu equipo y acompañamos la puesta en marcha hasta ver resultados.",
		visual: DiagramRolloutGantt,
	},
]

export function HowItWorks(): ReactNode {
	const reduce = useReducedMotion()

	const container: Variants = {
		hidden: {},
		show: { transition: { staggerChildren: 0.1 } },
	}

	const item: Variants = {
		hidden: { opacity: 0, y: reduce ? 0 : 24 },
		show: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.65, ease: EASE },
		},
	}

	return (
		<section
			aria-labelledby="how-it-works-heading"
			className="border-border bg-muted/40 dark:bg-card/50 relative isolate mb-32 overflow-hidden border-y sm:mb-44"
		>
			{/* Ambient trace, echoing the logo's own runs. */}
			<CircuitTrace className="-top-5 -right-16 h-64 w-[min(38rem,62%)] opacity-70" />

			<div className="relative mx-auto max-w-360 px-5 py-24 sm:px-8 sm:py-32 lg:px-10">
				<motion.div
					initial={{ opacity: 0, y: reduce ? 0 : 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-80px" }}
					transition={{ duration: 0.6, ease: EASE }}
					className="max-w-2xl"
				>
					<h2
						id="how-it-works-heading"
						className="text-3xl leading-[1.12] font-semibold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem]"
					>
						¿Cómo trabajamos?
					</h2>
					<p className="text-muted-foreground mt-2 max-w-xl text-sm leading-relaxed sm:text-base">
						Un proceso simple y transparente, de principio a fin.
					</p>
				</motion.div>

				<motion.ol
					variants={container}
					initial="hidden"
					whileInView="show"
					viewport={{ once: true, margin: "-80px" }}
					className="mt-8 grid list-none grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-x-12"
				>
					{STEPS.map((step, index) => {
						// The connector line bleeds past the column on both sides, except at
						// the first and last step where it stops at the grid edge.
						const segment =
							index === 0
								? "left-0 -right-6"
								: index === STEPS.length - 1
									? "-left-6 right-0"
									: "-left-6 -right-6"

						return (
							<motion.li
								key={step.title}
								variants={item}
								className="border-border border-t pt-10 first:border-t-0 first:pt-0 lg:border-t-0 lg:pt-0"
							>
								<StepVisual visual={step.visual} />

								<div className="relative mt-8 flex h-10 items-center">
									<div
										aria-hidden="true"
										className={`bg-border absolute top-1/2 hidden h-px -translate-y-1/2 lg:block ${segment}`}
									/>
									<motion.div
										aria-hidden="true"
										initial={reduce ? false : { scaleX: 0 }}
										whileInView={{ scaleX: 1 }}
										viewport={{ once: true, margin: "-80px" }}
										transition={{
											duration: 0.35,
											delay: 0.3 + index * 0.35,
											ease: "linear",
										}}
										className={`bg-primary absolute top-1/2 hidden h-px origin-left -translate-y-1/2 lg:block ${segment}`}
									/>
									<span className="bg-primary text-primary-foreground relative z-10 flex h-10 w-10 items-center justify-center rounded-sm font-mono text-sm font-medium">
										{String(index + 1).padStart(2, "0")}
									</span>
								</div>

								<h3 className="mt-6 text-lg font-semibold tracking-tight text-balance sm:text-xl">
									{step.title}
								</h3>
								<p className="text-muted-foreground mt-3 max-w-sm text-sm leading-relaxed">
									{step.copy}
								</p>
							</motion.li>
						)
					})}
				</motion.ol>
			</div>
		</section>
	)
}

export default HowItWorks
