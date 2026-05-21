"use client"

import { motion } from "motion/react"

export function GridHeader() {
	return (
		<motion.div
			initial={{ opacity: 0, y: 14 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.5 }}
			className="mb-10 flex flex-col gap-6 sm:mb-14"
		>
			<span className="text-muted-foreground text-xs font-medium tracking-[0.2em] uppercase">
				Maquetas y exploraciones · 2023–2025
			</span>
			<h2 className="text-foreground max-w-3xl text-3xl leading-[1.05] font-semibold tracking-tight sm:text-5xl md:text-6xl">
				Conceptos, prototipos y demos de lo que podemos construir.
			</h2>
		</motion.div>
	)
}
