"use client"

import { fadeInUp, reducedMotionVariants, defaultTransition, useReducedMotion } from "@/lib/motion"
import { Target, Eye } from "lucide-react"
import { motion } from "motion/react"

import type { ReactNode } from "react"

export function MissionVision(): ReactNode {
	const prefersReducedMotion = useReducedMotion()

	const variants = prefersReducedMotion ? reducedMotionVariants : fadeInUp
	const transition = prefersReducedMotion ? { duration: 0.01 } : defaultTransition

	return (
		<section className="py-12">
			<div className="mx-auto max-w-6xl px-4 sm:px-6">
				<div className="grid gap-5 lg:grid-cols-2">
					{/* Misión */}
					<motion.div
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, margin: "-100px" }}
						variants={variants}
						transition={transition}
						className="bg-muted flex flex-col rounded-2xl p-8 md:p-10"
					>
						<div className="mb-10 flex items-center gap-3">
							<Target className="h-14 w-14" strokeWidth={1} />
						</div>

						<h2 className="text-foreground mb-2 text-2xl font-bold">Misión</h2>
						<p className="text-muted-foreground text-sm leading-relaxed lg:text-base">
							Entregar soluciones tecnológicas simples y efectivas que permitan a las organizaciones
							optimizar sus procesos, tomar mejores decisiones y enfocarse en lo que realmente
							importa: su negocio.
						</p>
					</motion.div>

					{/* Visión */}
					<motion.div
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, margin: "-100px" }}
						variants={variants}
						transition={
							prefersReducedMotion ? { duration: 0.01 } : { ...defaultTransition, delay: 0.1 }
						}
						className="bg-muted flex flex-col rounded-2xl p-8 md:p-10"
					>
						<div className="mb-10 flex items-center gap-3">
							<Eye className="h-14 w-14" strokeWidth={1} />
						</div>

						<h2 className="text-foreground mb-2 text-2xl font-bold">Visión</h2>
						<p className="text-muted-foreground text-sm leading-relaxed lg:text-base">
							Ser el referente en transformación digital para organizaciones que buscan simplicidad
							sin sacrificar potencia. Que cada empresa pueda acceder a tecnología de primer nivel,
							sin complejidad innecesaria.
						</p>
					</motion.div>
				</div>
			</div>
		</section>
	)
}
