"use client"

import { motion } from "motion/react"

import type { CaseStudy } from "@/lib/portfolio-data"

interface CaseStudySolutionProps {
	caseStudy: CaseStudy
	accent?: string
}

export function CaseStudySolution({ caseStudy, accent = "#6366f1" }: CaseStudySolutionProps) {
	return (
		<section className="bg-muted/40 relative w-full overflow-hidden px-4 py-16 sm:px-6 sm:py-20 md:py-24 lg:px-8 lg:py-28">
			<div
				className="pointer-events-none absolute -top-40 right-1/2 h-80 w-[140%] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
				style={{ background: accent }}
				aria-hidden
			/>

			<div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 lg:grid-cols-12">
				<div className="lg:col-span-4">
					<motion.span
						initial={{ opacity: 0, y: 12 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.5 }}
						transition={{ duration: 0.4 }}
						className="text-muted-foreground text-xs font-medium tracking-[0.18em] uppercase"
					>
						02 — Solución
					</motion.span>
					<motion.h2
						initial={{ opacity: 0, y: 18 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.5 }}
						transition={{ duration: 0.5, delay: 0.05 }}
						className="text-foreground mt-3 text-3xl font-medium tracking-tight sm:text-4xl"
					>
						Una sola plataforma para toda la operación
					</motion.h2>
				</div>

				<div className="lg:col-span-8">
					<div className="flex flex-col gap-6">
						{caseStudy.solution.map((item, i) => (
							<motion.p
								key={i}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, amount: 0.3 }}
								transition={{ duration: 0.5, delay: i * 0.08 }}
								className="text-foreground text-base leading-relaxed sm:text-lg"
							>
								{typeof item === "string" ? (
									item
								) : (
									<>
										<strong className="text-foreground font-semibold">{item.headline}</strong>{" "}
										<span className="text-muted-foreground">{item.body}</span>
									</>
								)}
							</motion.p>
						))}
					</div>
				</div>
			</div>
		</section>
	)
}
