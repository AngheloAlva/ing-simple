"use client"

import { motion } from "motion/react"

import { TechIcon } from "./tech-icon"

import type { CaseStudy } from "@/lib/portfolio-data"

interface CaseStudyTechStackProps {
	caseStudy: CaseStudy
}

export function CaseStudyTechStack({ caseStudy }: CaseStudyTechStackProps) {
	return (
		<section className="bg-muted/40 w-full px-4 py-16 sm:px-6 sm:py-20 md:py-24 lg:px-8 lg:py-28">
			<div className="mx-auto w-full max-w-6xl">
				<div className="mb-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
					<div className="lg:col-span-7">
						<motion.span
							initial={{ opacity: 0, y: 12 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.5 }}
							transition={{ duration: 0.4 }}
							className="text-muted-foreground text-xs font-medium tracking-[0.18em] uppercase"
						>
							04 — Decisiones técnicas
						</motion.span>
						<motion.h2
							initial={{ opacity: 0, y: 18 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.5 }}
							transition={{ duration: 0.5, delay: 0.05 }}
							className="text-foreground mt-3 text-3xl font-medium tracking-tight sm:text-4xl"
						>
							No es solo qué usamos, es por qué
						</motion.h2>
					</div>
					<div className="lg:col-span-5">
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.3 }}
							transition={{ duration: 0.5, delay: 0.15 }}
							className="text-muted-foreground text-base leading-relaxed lg:mt-10"
						>
							Cada pieza del stack responde a una restricción concreta del proyecto. Esto es lo que
							pensamos al elegir.
						</motion.p>
					</div>
				</div>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					{caseStudy.techStackDetailed.map((item, i) => (
						<motion.div
							key={item.name}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.2 }}
							transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
							className="border-border bg-background flex flex-col gap-3 rounded-2xl border p-6"
						>
							<div className="flex items-center gap-3">
								<TechIcon name={item.name} />
								<h3 className="text-foreground text-lg font-semibold">{item.name}</h3>
							</div>
							<p className="text-muted-foreground text-sm leading-relaxed">{item.reason}</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	)
}
