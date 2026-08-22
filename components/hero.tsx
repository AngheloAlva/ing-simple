"use client"

import { CutButton } from "@/components/cut-button"
import GradientText from "@/components/gradient-text"
import { brandGradient } from "@/lib/gradient"
import { fadeInUp, reducedMotionVariants, softEase, useReducedMotion } from "@/lib/motion"
import { motion, type Variants } from "motion/react"
import type { ReactNode } from "react"

const container: Variants = {
	hidden: {},
	visible: {
		transition: { staggerChildren: 0.12, delayChildren: 0.35 },
	},
}

export function Hero(): ReactNode {
	const prefersReducedMotion = useReducedMotion()
	const item = prefersReducedMotion ? reducedMotionVariants : fadeInUp
	const itemTransition = prefersReducedMotion
		? { duration: 0.01 }
		: { duration: 0.7, ease: softEase }

	return (
		<section className="relative overflow-hidden">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 -z-10"
				style={{
					background:
						"radial-gradient(60% 50% at 50% -5%, color-mix(in srgb, var(--foreground) 5%, transparent), transparent 70%)",
				}}
			/>

			<div className="mx-auto max-w-360 px-5 sm:px-8 lg:px-10">
				<motion.div
					variants={container}
					initial="hidden"
					animate="visible"
					className="relative mx-auto flex max-w-2xl flex-col items-center pt-32 pb-12 text-center sm:pt-40"
				>
					<div
						aria-hidden="true"
						className="pointer-events-none absolute top-1/2 left-1/2 z-[-1] h-[150%] w-[160%] -translate-x-1/2 -translate-y-1/2"
						style={{
							background:
								"radial-gradient(ellipse at center, var(--background) 0%, color-mix(in srgb, var(--background) 78%, transparent) 55%, transparent 72%)",
						}}
					/>

					<motion.h1
						variants={item}
						transition={itemTransition}
						className="font-sans text-4xl leading-[1.1] font-normal tracking-tight text-balance sm:text-5xl lg:text-[3.5rem]"
					>
						<GradientText inline className="font-medium" colors={brandGradient} animationSpeed={6}>
							Soluciones Simples
						</GradientText>{" "}
						para un Mundo Digital Complejo
					</motion.h1>

					<motion.p
						variants={item}
						transition={itemTransition}
						className="text-muted-foreground mt-4 max-w-xl text-[15px] leading-relaxed text-balance sm:text-base"
					>
						Acompañamos a tu organización con tecnología, análisis y capacitación para optimizar
						procesos y tomar mejores decisiones.
					</motion.p>

					<motion.div
						variants={item}
						transition={itemTransition}
						className="mt-8 flex flex-wrap items-center justify-center gap-3"
					>
						<CutButton variant="solid" icon="arrow" href="#servicios">
							Explorar servicios
						</CutButton>
						<CutButton variant="outline" href="/contacto" className="dark:text-white">
							Contáctanos
						</CutButton>
					</motion.div>
				</motion.div>
			</div>
		</section>
	)
}
