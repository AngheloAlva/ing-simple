"use client"

import DitherCursor from "@/components/shared/dither-cursor"
import { useState, useEffect } from "react"
import { ChevronRight } from "lucide-react"
import { motion } from "motion/react"

const easeOut = [0.16, 1, 0.3, 1] as const

export function PowerPlatformCTA() {
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

	return (
		<section className="bg-background w-full px-4 py-24 sm:px-6 md:py-36 lg:px-8">
			<motion.div
				className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-red-600 px-6 py-12 text-center text-white md:rounded-4xl md:px-12 md:py-24"
				initial={{ opacity: 0, y: 40 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, amount: 0.3 }}
				transition={{ duration: 0.8, ease: easeOut }}
			>
				{!isMobile && <DitherCursor color="#737373" radius={0.1} opacity={1} position="absolute" />}

				<div className="relative z-10">
					<motion.h2
						className="mx-auto mb-6 max-w-2xl text-3xl font-medium tracking-tight md:text-4xl lg:text-5xl"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.1, ease: easeOut }}
					>
						¿Tu empresa sigue dependiendo de planillas y procesos manuales?
					</motion.h2>

					<motion.p
						className="mx-auto mb-10 max-w-md text-lg text-white/90"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.2, ease: easeOut }}
					>
						Transformá tu operación con soluciones Power Platform. Agenda una reunión y te mostramos
						cómo automatizar tu empresa.
					</motion.p>

					<motion.a
						href="/contacto"
						viewport={{ once: true }}
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.3, ease: easeOut }}
						className="group inline-flex w-full items-center justify-center gap-3 rounded-md bg-white py-3 pr-3 pl-5 font-medium text-red-600 transition-all duration-500 ease-out hover:rounded-[50px] hover:shadow-lg sm:w-auto"
					>
						<span>Agenda tu Consulta</span>
						<span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white transition-all duration-300 group-hover:scale-110">
							<ChevronRight className="relative left-px h-4 w-4" />
						</span>
					</motion.a>
				</div>
			</motion.div>
		</section>
	)
}
