"use client"

import Link from "next/link"
import { ArrowUpRight, Sparkles } from "lucide-react"
import { motion } from "motion/react"

const easeOut = [0.16, 1, 0.3, 1] as const

export function PortfolioCasosBanner() {
	return (
		<section className="px-4 py-16 sm:px-6 sm:py-20">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, margin: "-80px" }}
				transition={{ duration: 0.6, ease: easeOut }}
				className="border-border bg-background relative mx-auto flex max-w-5xl flex-col gap-6 overflow-hidden rounded-2xl border p-8 sm:flex-row sm:items-center sm:justify-between sm:gap-10 sm:p-10"
			>
				<div className="flex flex-col gap-3">
					<span className="text-accent inline-flex items-center gap-2 text-xs font-medium tracking-[0.2em] uppercase">
						<Sparkles className="h-3.5 w-3.5" aria-hidden />
						¿Buscás proyectos reales?
					</span>
					<h3 className="text-foreground text-2xl font-medium tracking-tight sm:text-3xl">
						Mirá nuestros casos en producción
					</h3>
					<p className="text-muted-foreground max-w-xl text-sm sm:text-base">
						Lo que ves acá son maquetas, prototipos y exploraciones. Si querés ver proyectos que
						hoy están corriendo en empresas reales, andá a la página de casos.
					</p>
				</div>

				<Link
					href="/casos"
					className="group bg-foreground text-background hover:opacity-90 inline-flex shrink-0 items-center gap-3 self-start rounded-full px-5 py-3 text-sm font-medium transition-opacity sm:self-center sm:text-base"
				>
					Ver casos
					<ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
				</Link>
			</motion.div>
		</section>
	)
}
