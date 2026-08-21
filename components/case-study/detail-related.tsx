"use client"

import { portfolioProjects } from "@/lib/portfolio-data"
import { softEase } from "@/lib/motion"
import { ArrowUpRight } from "lucide-react"
import { motion } from "motion/react"
import type { ReactNode } from "react"

interface DetailRelatedProps {
	currentId: string
}

export function DetailRelated({ currentId }: DetailRelatedProps): ReactNode {
	const related = portfolioProjects
		.filter((p) => p.isProduction && p.caseStudy && p.id !== currentId)
		.slice(0, 3)

	if (related.length === 0) return null

	return (
		<section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 sm:pb-32 lg:px-10">
			<div className="border-border mb-10 flex flex-wrap items-end justify-between gap-4 border-b pb-8">
				<div>
					<p className="text-muted-foreground font-mono text-[11px] tracking-[0.14em] uppercase">
						Otros proyectos
					</p>
					<h2 className="mt-4 font-serif text-2xl leading-[1.12] font-normal tracking-[-0.01em] text-balance sm:text-3xl">
						Otros casos en{" "}
						<span className="font-sans font-semibold tracking-tight">producción</span>
					</h2>
				</div>

				<a
					href="/casos"
					className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm font-medium transition-colors"
				>
					Ver todos los casos
					<ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
				</a>
			</div>

			<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
				{related.map((project, i) => (
					<motion.a
						key={project.id}
						href={`/casos/${project.id}`}
						initial={{ opacity: 0, y: 18 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-60px" }}
						transition={{ duration: 0.5, delay: i * 0.06, ease: softEase }}
						className="group border-border bg-muted/30 hover:border-primary focus-visible:outline-primary flex flex-col gap-3 border p-6 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2"
					>
						<span
							aria-hidden="true"
							className="h-1 w-12"
							style={{ backgroundColor: project.gradientColor ?? "var(--brand-blue)" }}
						/>
						<h3 className="text-foreground text-lg font-semibold tracking-tight">
							{project.title}
						</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							{project.shortDescription}
						</p>
						{project.liveUrl ? (
							<span className="text-foreground mt-2 inline-flex w-fit items-center gap-1.5 text-sm font-medium">
								Ver sitio
								<ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
							</span>
						) : null}
					</motion.a>
				))}
			</div>
		</section>
	)
}
