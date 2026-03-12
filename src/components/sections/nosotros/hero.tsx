"use client"

import { useState, useEffect } from "react"
import { motion } from "motion/react"
import {
	fadeInUp,
	staggerContainer,
	useReducedMotion,
	defaultTransition,
	reducedMotionVariants,
} from "@/lib/motion"

import type { ReactNode } from "react"
import Prism from "@/components/shared/prism"

export function NosotrosHero(): ReactNode {
	const [isMobile, setIsMobile] = useState(false)

	// Check for mobile on mount
	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768)
		}
		checkMobile()
		window.addEventListener("resize", checkMobile)
		return () => window.removeEventListener("resize", checkMobile)
	}, [])

	const prefersReducedMotion = useReducedMotion()

	const variants = prefersReducedMotion ? reducedMotionVariants : fadeInUp
	const stagger = prefersReducedMotion ? reducedMotionVariants : staggerContainer
	const transition = prefersReducedMotion ? { duration: 0.01 } : defaultTransition

	return (
		<section className="relative flex min-h-screen items-center overflow-hidden py-20 md:py-32">
			{/* Text — left side */}
			<div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
				<motion.div
					initial="hidden"
					variants={stagger}
					whileInView="visible"
					className="max-w-xl"
					transition={transition}
					viewport={{ once: true, margin: "-100px" }}
				>
					<motion.span
						variants={variants}
						transition={transition}
						className="text-accent mb-4 block text-sm font-medium tracking-wider uppercase"
					>
						Sobre Nosotros
					</motion.span>
					<motion.h1
						variants={variants}
						transition={transition}
						className="text-foreground mb-6 text-4xl font-bold md:text-6xl"
					>
						Hacemos lo complejo, <span className="text-accent">simple</span>
					</motion.h1>
					<motion.p
						variants={variants}
						transition={transition}
						className="text-muted-foreground max-w-md text-lg md:text-xl"
					>
						Somos un equipo de ingenieros y consultores apasionados por la tecnología. Acompañamos a
						organizaciones en su transformación digital con soluciones que realmente funcionan.
					</motion.p>
				</motion.div>
			</div>

			{!isMobile && (
				<div
					className="pointer-events-none absolute inset-y-0 right-0 w-1/2 md:w-3/5"
					style={{
						maskImage: "radial-gradient(ellipse 80% 70% at 70% 50%, black 30%, transparent 70%)",
						WebkitMaskImage:
							"radial-gradient(ellipse 80% 70% at 70% 50%, black 30%, transparent 70%)",
					}}
				>
					<div className="flex h-full w-full items-center justify-center">
						<Prism
							height={25}
							baseWidth={40}
							animationType="hover"
							glow={1}
							noise={0}
							transparent
							scale={0.2}
							hueShift={0}
							colorFrequency={0.05}
							hoverStrength={2}
							inertia={0.1}
							bloom={0.7}
							timeScale={0}
							suspendWhenOffscreen={true}
						/>
					</div>
				</div>
			)}
		</section>
	)
}
