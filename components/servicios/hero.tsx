"use client"

import { CutButton } from "@/components/cut-button"
import GradientText from "@/components/gradient-text"
import { SERVICE_VISUALS } from "@/components/service-diagrams"
import { brandGradient } from "@/lib/gradient"
import { fadeInUp, reducedMotionVariants, softEase, useReducedMotion } from "@/lib/motion"
import type { ServicePage } from "@/lib/services"
import { motion, type Variants } from "motion/react"
import type { ReactNode } from "react"

const container: Variants = {
	hidden: {},
	visible: {
		transition: { staggerChildren: 0.12, delayChildren: 0.2 },
	},
}

/**
 * Serializable subset of `Service` — this is a client component, so it can't
 * receive the full object (its `icon` field is a component function).
 */
type ServicioHeroProps = {
	title: string
	href: string
	page: ServicePage
}

export function ServicioHero(service: ServicioHeroProps): ReactNode {
	const prefersReducedMotion = useReducedMotion()
	const item = prefersReducedMotion ? reducedMotionVariants : fadeInUp
	const itemTransition = prefersReducedMotion
		? { duration: 0.01 }
		: { duration: 0.7, ease: softEase }

	const Diagram = SERVICE_VISUALS[service.href]

	return (
		<section className="relative overflow-hidden">
			<div className="mx-auto max-w-360 px-5 sm:px-8 lg:px-10">
				<div className="grid items-center gap-12 pt-28 pb-16 sm:pt-36 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:pb-24">
					<motion.div
						variants={container}
						initial="hidden"
						animate="visible"
						className="flex flex-col items-start"
					>
						<motion.p
							variants={item}
							transition={itemTransition}
							className="text-muted-foreground text-sm font-medium"
						>
							{service.title}
						</motion.p>

						<motion.h1
							variants={item}
							transition={itemTransition}
							className="mt-5 max-w-xl font-serif text-4xl leading-[1.1] font-normal tracking-[-0.01em] text-balance sm:text-5xl lg:text-[3.5rem]"
						>
							{service.page.pageTitle}{" "}
							<GradientText
								inline
								className="font-sans font-semibold tracking-tight"
								colors={brandGradient}
								animationSpeed={6}
							>
								{service.page.pageTitleAccent}
							</GradientText>
						</motion.h1>

						<motion.p
							variants={item}
							transition={itemTransition}
							className="text-muted-foreground mt-5 max-w-xl text-[15px] leading-relaxed text-balance sm:text-base"
						>
							{service.page.pageSubtitle}
						</motion.p>

						<motion.div
							variants={item}
							transition={itemTransition}
							className="mt-8 flex flex-wrap items-center gap-3"
						>
							<CutButton variant="solid" icon="send" href="/contacto">
								Conversemos
							</CutButton>
							<CutButton variant="outline" href="#incluye">
								Qué incluye
							</CutButton>
						</motion.div>
					</motion.div>

					{Diagram ? (
						<motion.div
							initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
							animate={{ opacity: 1, y: 0 }}
							transition={
								prefersReducedMotion
									? { duration: 0.01 }
									: { duration: 0.8, delay: 0.35, ease: softEase }
							}
							className="w-full"
						>
							<Diagram />
						</motion.div>
					) : null}
				</div>
			</div>
		</section>
	)
}
