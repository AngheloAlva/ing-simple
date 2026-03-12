"use client"

import { Sparkles, Shield, Zap, GraduationCap } from "lucide-react"
import { motion } from "motion/react"
import {
	fadeInUp,
	useReducedMotion,
	staggerContainer,
	defaultTransition,
	reducedMotionVariants,
} from "@/lib/motion"

import type { ReactNode } from "react"

const values = [
	{
		icon: Sparkles,
		title: "Simplicidad",
		description:
			"Creemos que la mejor solución es la más simple. Eliminamos la complejidad innecesaria para que la tecnología trabaje para vos, no al revés.",
	},
	{
		icon: Shield,
		title: "Transparencia",
		description:
			"Sin letra chica, sin sorpresas. Comunicamos con claridad cada paso del proceso, los plazos y los costos desde el día uno.",
	},
	{
		icon: Zap,
		title: "Impacto Real",
		description:
			"No hacemos tecnología por hacer tecnología. Cada proyecto tiene un objetivo claro y un resultado medible para tu organización.",
	},
	{
		icon: GraduationCap,
		title: "Aprendizaje Continuo",
		description:
			"Capacitamos a tu equipo para que sea autónomo. No creamos dependencia: transferimos conocimiento y construimos capacidades internas.",
	},
]

export function Values(): ReactNode {
	const prefersReducedMotion = useReducedMotion()

	const variants = prefersReducedMotion ? reducedMotionVariants : fadeInUp
	const stagger = prefersReducedMotion ? reducedMotionVariants : staggerContainer
	const transition = prefersReducedMotion ? { duration: 0.01 } : defaultTransition

	return (
		<section className="py-16 md:py-24">
			<div className="mx-auto max-w-6xl px-4 sm:px-6">
				<motion.div
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-100px" }}
					variants={stagger}
					transition={transition}
					className="mb-12 md:mb-16"
				>
					<motion.span
						variants={variants}
						transition={transition}
						className="text-accent mb-4 block text-sm font-medium tracking-wider uppercase"
					>
						Nuestros Valores
					</motion.span>
					<motion.h2
						variants={variants}
						transition={transition}
						className="text-foreground text-3xl font-bold md:text-4xl"
					>
						Lo que nos define
					</motion.h2>
				</motion.div>

				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{values.map((value, i) => (
						<motion.div
							key={value.title}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, margin: "-50px" }}
							variants={variants}
							transition={
								prefersReducedMotion ? { duration: 0.01 } : { ...defaultTransition, delay: i * 0.1 }
							}
							className="group border-border bg-background hover:bg-foreground rounded-2xl border p-6 transition-colors duration-300"
						>
							<value.icon
								strokeWidth={1}
								className="text-foreground group-hover:text-background mb-8 h-12 w-12"
							/>

							<h3 className="text-foreground group-hover:text-background mb-2 text-lg font-semibold">
								{value.title}
							</h3>
							<p className="text-muted-foreground group-hover:text-muted text-sm leading-relaxed">
								{value.description}
							</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	)
}
