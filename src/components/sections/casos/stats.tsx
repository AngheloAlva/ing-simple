"use client"

import { motion } from "motion/react"

import { portfolioProjects } from "@/lib/portfolio-data"

const easeOut = [0.16, 1, 0.3, 1] as const

function buildStats() {
	const cases = portfolioProjects.filter((p) => p.isProduction && p.caseStudy)
	const uniqueClients = new Set(cases.map((p) => p.caseStudy?.clientName).filter(Boolean))
	return [
		{ value: String(cases.length), label: "proyectos en producción" },
		{ value: String(uniqueClients.size), label: "clientes activos" },
		{ value: "2", label: "industrias cubiertas" },
		{ value: "+3", label: "años en producción" },
	]
}

export function CasosStats() {
	const stats = buildStats()

	return (
		<section className="px-4 py-16 sm:px-6 sm:py-20">
			<motion.ul
				initial={{ opacity: 0, y: 16 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, margin: "-80px" }}
				transition={{ duration: 0.6, ease: easeOut }}
				className="mx-auto grid max-w-5xl grid-cols-2 gap-y-10 sm:grid-cols-4 sm:gap-y-0"
			>
				{stats.map((stat) => (
					<li
						key={stat.label}
						className="sm:border-border/60 flex flex-col items-center gap-1 text-center sm:border-l sm:px-4 sm:first:border-l-0"
					>
						<span className="text-foreground text-4xl font-medium tracking-tight sm:text-5xl">
							{stat.value}
						</span>
						<span className="text-muted-foreground text-xs tracking-wide uppercase">
							{stat.label}
						</span>
					</li>
				))}
			</motion.ul>
		</section>
	)
}
