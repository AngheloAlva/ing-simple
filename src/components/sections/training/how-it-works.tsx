"use client"

import { ClipboardList, GraduationCap, Rocket } from "lucide-react"
import { motion, useInView } from "motion/react"
import { useRef } from "react"

import type { ReactNode } from "react"

const easeOut = [0.16, 1, 0.3, 1] as const

const steps = [
	{
		icon: ClipboardList,
		title: "Diagnóstico",
		description:
			"Evaluamos el nivel actual de tu equipo y las herramientas que utilizan para diseñar un plan de capacitación a medida.",
	},
	{
		icon: GraduationCap,
		title: "Capacitación",
		description:
			"Sesiones prácticas con ejercicios reales, enfocadas en resolver los desafíos concretos de tu operación diaria.",
	},
	{
		icon: Rocket,
		title: "Seguimiento",
		description:
			"Acompañamiento post-capacitación para asegurar la adopción de las herramientas y medir el impacto real.",
	},
]

function StepCard({ step, index }: { step: (typeof steps)[0]; index: number }): ReactNode {
	const ref = useRef<HTMLDivElement>(null)
	const isInView = useInView(ref, { once: true, amount: 0.5 })
	const Icon = step.icon

	return (
		<motion.div
			ref={ref}
			className="bg-muted flex min-h-70 flex-col rounded-2xl p-6 md:p-8"
			initial={{ opacity: 0, y: 30 }}
			animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
			transition={{ duration: 0.6, delay: index * 0.1, ease: easeOut }}
		>
			<div className="mb-6">
				<Icon className="text-foreground h-14 w-14" strokeWidth={1} />
			</div>
			<h3 className="mt-auto mb-2 text-xl font-medium tracking-tight md:text-2xl">{step.title}</h3>
			<p className="text-muted-foreground text-base leading-relaxed">{step.description}</p>
		</motion.div>
	)
}

export function TrainingHowItWorks(): ReactNode {
	const headerRef = useRef<HTMLDivElement>(null)
	const isHeaderInView = useInView(headerRef, { once: true, amount: 0.5 })

	return (
		<section className="bg-background px-6 py-16 md:py-32">
			<div className="mx-auto max-w-6xl">
				<motion.div
					ref={headerRef}
					className="mb-8 text-center md:mb-16"
					initial={{ opacity: 0, y: 20 }}
					animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
					transition={{ duration: 0.6, ease: easeOut }}
				>
					<h2 className="text-3xl font-medium tracking-tight md:text-4xl lg:text-5xl">
						¿Cómo Funciona?
					</h2>
				</motion.div>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
					{steps.map((step, index) => (
						<StepCard key={step.title} step={step} index={index} />
					))}
				</div>
			</div>
		</section>
	)
}
