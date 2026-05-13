"use client"

import { ArrowUpRight, ChevronRightIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { motion } from "motion/react"
import Link from "next/link"

import { portfolioProjects } from "@/lib/portfolio-data"

import DitherCursor from "@/components/shared/dither-cursor"

const easeOut = [0.16, 1, 0.3, 1] as const

interface CaseStudyRelatedCtaProps {
	currentId: string
}

export function CaseStudyRelatedCta({ currentId }: CaseStudyRelatedCtaProps) {
	const [isMobile, setIsMobile] = useState(false)

	useEffect(() => {
		const checkMobile = () => setIsMobile(window.innerWidth < 768)
		checkMobile()
		window.addEventListener("resize", checkMobile)
		return () => window.removeEventListener("resize", checkMobile)
	}, [])

	const related = portfolioProjects
		.filter((p) => p.category === "desarrollo-web" && p.id !== currentId)
		.slice(0, 3)

	return (
		<section className="bg-background w-full px-4 py-16 sm:px-6 sm:py-20 md:py-24 lg:px-8 lg:py-28">
			<div className="mx-auto w-full max-w-6xl">
				<div className="mb-10 flex flex-wrap items-end justify-between gap-4">
					<div>
						<motion.span
							initial={{ opacity: 0, y: 12 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.5 }}
							transition={{ duration: 0.4 }}
							className="text-muted-foreground text-xs font-medium tracking-[0.18em] uppercase"
						>
							Otros proyectos
						</motion.span>
						<motion.h2
							initial={{ opacity: 0, y: 18 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.5 }}
							transition={{ duration: 0.5, delay: 0.05 }}
							className="text-foreground mt-2 text-2xl font-medium tracking-tight sm:text-3xl"
						>
							Más trabajo en desarrollo web
						</motion.h2>
					</div>

					<Link
						href="/portafolio"
						className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
					>
						Ver portafolio completo
						<ArrowUpRight className="h-3.5 w-3.5" />
					</Link>
				</div>

				<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
					{related.map((project, i) => (
						<motion.div
							key={project.id}
							initial={{ opacity: 0, y: 18 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.2 }}
							transition={{ duration: 0.4, delay: i * 0.06 }}
							className="border-border bg-muted/40 group flex flex-col gap-3 rounded-2xl border p-6"
						>
							<div
								className="h-1 w-12 rounded-full"
								style={{ backgroundColor: project.gradientColor ?? "#6366f1" }}
							/>
							<h3 className="text-foreground text-lg font-semibold">{project.title}</h3>
							<p className="text-muted-foreground text-sm leading-relaxed">
								{project.shortDescription}
							</p>
							{project.liveUrl && (
								<a
									target="_blank"
									rel="noopener noreferrer"
									href={project.liveUrl}
									className="text-foreground mt-2 inline-flex w-fit items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
								>
									Ver sitio
									<ArrowUpRight className="h-3.5 w-3.5" />
								</a>
							)}
						</motion.div>
					))}
				</div>

				<motion.div
					className="bg-accent relative mt-16 overflow-hidden rounded-3xl px-6 py-12 text-center text-black md:rounded-4xl md:px-12 md:py-24"
					initial={{ opacity: 0, y: 40 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.3 }}
					transition={{ duration: 0.8, ease: easeOut }}
				>
					{!isMobile && (
						<DitherCursor color="#003a8f" radius={0.1} opacity={0.5} position="absolute" />
					)}

					<div className="relative z-10">
						<motion.h2
							className="mx-auto mb-6 max-w-2xl text-3xl font-medium tracking-tight md:text-4xl lg:text-5xl"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.1, ease: easeOut }}
						>
							¿Tu operación se parece a esto?
						</motion.h2>

						<motion.p
							className="mx-auto mb-10 max-w-md text-lg text-black/70"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.2, ease: easeOut }}
						>
							Si tu equipo todavía vive entre planillas, correos y papel, podemos diseñar una
							plataforma a medida que centralice el trabajo.
						</motion.p>

						<motion.a
							href="/contacto"
							className="group inline-flex w-full items-center justify-center gap-3 rounded-md bg-white py-3 pr-3 pl-5 font-medium text-black transition-all duration-500 ease-out hover:rounded-[50px] hover:shadow-lg sm:w-auto"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.3, ease: easeOut }}
						>
							<span>Cotiza tu proyecto</span>
							<span className="bg-accent flex h-10 w-10 items-center justify-center rounded-full text-black transition-all duration-300 group-hover:scale-110">
								<ChevronRightIcon className="relative left-px h-4 w-4" />
							</span>
						</motion.a>
					</div>
				</motion.div>
			</div>
		</section>
	)
}
