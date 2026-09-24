"use client"

import { CutButton } from "@/components/cut-button"
import { HeroWaves } from "@/components/hero-waves"
import { fadeInUp, reducedMotionVariants, softEase, useReducedMotion } from "@/lib/motion"
import { motion, type Variants } from "motion/react"
import type { ReactNode } from "react"

const container: Variants = {
	hidden: {},
	visible: {
		transition: { staggerChildren: 0.12, delayChildren: 0.35 },
	},
}

export function CasosHero(): ReactNode {
	const prefersReducedMotion = useReducedMotion()
	const item = prefersReducedMotion ? reducedMotionVariants : fadeInUp
	const itemTransition = prefersReducedMotion
		? { duration: 0.01 }
		: { duration: 0.7, ease: softEase }

	return (
		<section className="relative overflow-hidden">
			<HeroWaves />

			<div
				aria-hidden="true"
				className="pointer-events-none absolute top-1/2 left-1/2 -z-[1] h-[130%] w-[78%] -translate-x-1/2 -translate-y-1/2"
				style={{
					background:
						"radial-gradient(ellipse at center, var(--background) 0%, color-mix(in srgb, var(--background) 70%, transparent) 50%, transparent 80%)",
				}}
			/>

			<div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-10">
				<motion.div
					variants={container}
					initial="hidden"
					animate="visible"
					className="relative mx-auto flex max-w-2xl flex-col items-center pt-32 pb-16 text-center sm:pt-40"
				>
					<motion.p
						variants={item}
						transition={itemTransition}
						className="text-muted-foreground text-sm font-medium"
					>
						Casos de estudio
					</motion.p>

					<motion.h1
						variants={item}
						transition={itemTransition}
						className="mt-5 font-serif text-4xl leading-[1.1] font-normal tracking-[-0.01em] text-balance sm:text-5xl lg:text-[3.5rem]"
					>
						Software que ya corre en{" "}
						<span className="font-sans font-semibold tracking-tight">empresas reales</span>
					</motion.h1>

					<motion.p
						variants={item}
						transition={itemTransition}
						className="text-muted-foreground mt-5 max-w-xl text-[15px] leading-relaxed text-balance sm:text-base"
					>
						Conoce plataformas a medida en producción, sus desafíos y las decisiones detrás de cada
						solución publicada.
					</motion.p>

					<motion.div
						variants={item}
						transition={itemTransition}
						className="mt-8 flex items-center justify-center gap-3"
					>
						<CutButton variant="solid" icon="arrow" href="#casos-grid">
							Ver los casos
						</CutButton>
						<CutButton variant="outline" href="/contacto">
							Conversemos
						</CutButton>
					</motion.div>
				</motion.div>
			</div>
		</section>
	)
}
