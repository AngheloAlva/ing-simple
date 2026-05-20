"use client"

import { motion } from "motion/react"
import { ArrowRight } from "lucide-react"

import { TechIcon } from "./tech-icon"

import type { CaseStudy } from "@/lib/portfolio-data"

interface CaseStudyTechStackProps {
	caseStudy: CaseStudy
	accent?: string
}

export function CaseStudyTechStack({ caseStudy }: CaseStudyTechStackProps) {
	const introText =
		caseStudy.techStackIntro ??
		"Cada pieza del stack responde a una restricción concreta del proyecto. Esto es lo que pensamos al elegir."

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
							{introText}
						</motion.p>
					</div>
				</div>

				<div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2">
					{caseStudy.techStackDetailed.map((item, i) => (
						<motion.div
							key={item.name}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.2 }}
							transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
							className="border-border bg-background flex flex-col gap-3 rounded-2xl border p-6"
						>
							{item.detail ? (
								<>
									{/* Card header: icon + name + tag chip */}
									<div className="flex items-start justify-between gap-3">
										<div className="flex items-center gap-3">
											<TechIcon name={item.name} />
											<h3 className="text-foreground text-lg font-semibold">{item.name}</h3>
										</div>
										{item.tag && (
											<span className="bg-accent/10 text-accent shrink-0 self-start rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase">
												{item.tag}
											</span>
										)}
									</div>

									{/* Constraint — muted italic lead-in */}
									<p className="text-muted-foreground text-sm italic leading-relaxed">
										{item.detail.constraint}
									</p>

									{/* Decision — main body */}
									<p className="text-foreground/80 text-sm leading-relaxed">{item.detail.decision}</p>

									{/* Outcome — accented with label */}
									<p className="text-accent flex items-start gap-1.5 text-sm leading-relaxed">
										<ArrowRight className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
										<span>
											<strong className="font-semibold">Resultado:</strong>{" "}
											{item.detail.outcome}
										</span>
									</p>
								</>
							) : (
								<>
									{/* Fallback: original layout — name + reason */}
									<div className="flex items-center gap-3">
										<TechIcon name={item.name} />
										<h3 className="text-foreground text-lg font-semibold">{item.name}</h3>
									</div>
									<p className="text-muted-foreground text-sm leading-relaxed">{item.reason}</p>
								</>
							)}
						</motion.div>
					))}
				</div>
			</div>
		</section>
	)
}
