"use client"

import { motion } from "motion/react"

import type { CaseStudy } from "@/lib/portfolio-data"

interface CaseStudyBeforeAfterProps {
	caseStudy: CaseStudy
	accent?: string
}

export function CaseStudyBeforeAfter({
	caseStudy,
	accent = "#6366f1",
}: CaseStudyBeforeAfterProps) {
	if (!caseStudy.beforeAfter || caseStudy.beforeAfter.length === 0) return null

	return (
		<section className="bg-background w-full px-4 py-16 sm:px-6 sm:py-20 md:py-24 lg:px-8 lg:py-28">
			<div className="mx-auto w-full max-w-6xl">
				<div className="mb-10">
					<motion.span
						initial={{ opacity: 0, y: 12 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.5 }}
						transition={{ duration: 0.4 }}
						className="text-muted-foreground text-xs font-medium tracking-[0.18em] uppercase"
					>
						08 — El antes y el después
					</motion.span>
					<motion.h2
						initial={{ opacity: 0, y: 18 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.5 }}
						transition={{ duration: 0.5, delay: 0.05 }}
						className="text-foreground mt-3 text-3xl font-medium tracking-tight sm:text-4xl"
					>
						El antes y el después
					</motion.h2>
					<motion.p
						initial={{ opacity: 0, y: 18 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.5 }}
						transition={{ duration: 0.5, delay: 0.1 }}
						className="text-muted-foreground mt-3 text-base"
					>
						Lo que cambia cuando una operación deja de vivir en chats.
					</motion.p>
				</div>

				{/* Column headers */}
				<motion.div
					initial={{ opacity: 0, y: 12 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.4 }}
					transition={{ duration: 0.4, delay: 0.15 }}
					className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-2"
				>
					<div className="rounded-lg px-4 py-2 text-sm font-semibold text-red-400/80 bg-red-500/5 border border-red-500/10">
						Antes
					</div>
					<div
						className="rounded-lg px-4 py-2 text-sm font-semibold border"
						style={{ color: accent, background: `${accent}0d`, borderColor: `${accent}1a` }}
					>
						Con ObraLink
					</div>
				</motion.div>

				{/* Rows */}
				<div className="flex flex-col gap-3">
					{caseStudy.beforeAfter.map((row, i) => (
						<motion.div
							key={i}
							initial={{ opacity: 0, y: 18 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.3 }}
							transition={{ duration: 0.5, delay: i * 0.05 }}
							className="grid grid-cols-1 gap-3 md:grid-cols-2"
						>
							{/* Before cell */}
							<div className="flex items-start gap-3 rounded-xl border border-border bg-card/40 p-4">
								<span className="mt-0.5 shrink-0 text-sm font-bold text-red-400/60">✕</span>
								<span className="text-muted-foreground text-sm leading-relaxed">{row.before}</span>
							</div>
							{/* After cell */}
							<div className="flex items-start gap-3 rounded-xl border border-border bg-card/40 p-4">
								<span
									className="mt-0.5 shrink-0 text-sm font-bold"
									style={{ color: accent }}
								>
									✓
								</span>
								<span className="text-foreground font-medium text-sm leading-relaxed">{row.after}</span>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	)
}
