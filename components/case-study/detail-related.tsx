"use client"

import { Kicker } from "@/components/corner-plus"
import { portfolioProjects } from "@/lib/portfolio-data"
import { useReducedMotion, useStaggerEntrance } from "@/lib/motion"
import { ArrowUpRight } from "lucide-react"
import { motion } from "motion/react"
import Link from "next/link"
import type { ReactNode } from "react"

interface DetailRelatedProps {
	currentId: string
}

const MotionLink = motion.create(Link)

export function DetailRelated({ currentId }: DetailRelatedProps): ReactNode {
	const reduce = useReducedMotion()
	const { item, itemTransition, viewport } = useStaggerEntrance()
	// Same gating as generateStaticParams: only cases that have a page.
	const related = portfolioProjects
		.filter((p) => p.isFlagship && p.caseStudy && p.id !== currentId)
		.slice(0, 3)

	if (related.length === 0) return null

	return (
		<section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 sm:pb-32 lg:px-10">
			<motion.div
				initial="hidden"
				whileInView="visible"
				viewport={viewport}
				variants={item}
				transition={itemTransition}
				className="border-border mb-10 flex flex-wrap items-end justify-between gap-4 border-b pb-8"
			>
				<div>
					<Kicker>Otros proyectos</Kicker>
					<h2 className="mt-4 font-serif text-3xl leading-[1.1] font-normal tracking-[-0.01em] text-balance sm:text-4xl lg:text-[2.75rem]">
						Otros casos en{" "}
						<span className="font-sans font-semibold tracking-tight">producción</span>
					</h2>
				</div>

				<Link
					href="/casos"
					className="focus-ring text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm font-medium transition-colors"
				>
					Ver todos los casos
					<ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
				</Link>
			</motion.div>

			<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
				{related.map((project, i) => (
					<MotionLink
						key={project.id}
						href={`/casos/${project.id}`}
						initial="hidden"
						whileInView="visible"
						viewport={viewport}
						variants={item}
						transition={{ ...itemTransition, delay: reduce ? 0 : i * 0.06 }}
						className="group border-border bg-background hover:border-primary/40 focus-ring flex flex-col gap-3 rounded-sm border p-6 transition-colors duration-200"
					>
						<h3 className="text-foreground text-lg font-semibold tracking-tight">
							{project.title}
						</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							{project.shortDescription}
						</p>
						<span className="text-foreground mt-2 inline-flex w-fit items-center gap-1.5 text-sm font-medium">
							Ver caso
							<ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
						</span>
					</MotionLink>
				))}
			</div>
		</section>
	)
}
