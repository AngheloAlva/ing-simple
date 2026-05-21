"use client"

import { motion } from "motion/react"

const easeOut = [0.16, 1, 0.3, 1] as const

export function PortfolioHero() {
	return (
		<section className="relative h-full overflow-hidden pt-28 sm:pt-36 lg:pt-44">
			<div className="z-10 mx-auto flex max-w-6xl flex-col items-start justify-center px-4 sm:px-6">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, ease: easeOut }}
				>
					<h1 className="text-4xl font-medium tracking-tight sm:text-5xl md:text-6xl">
						Maquetas y exploraciones
					</h1>
					<p className="text-muted-foreground mt-4 max-w-2xl text-xl">
						Conceptos, prototipos y demos que muestran nuestras capacidades técnicas. ¿Buscás
						proyectos en producción? Mirá la sección de casos.
					</p>
				</motion.div>
			</div>
		</section>
	)
}
