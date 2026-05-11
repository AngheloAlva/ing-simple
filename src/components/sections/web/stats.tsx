"use client"

import { useEffect, useState } from "react"
import { ArrowUpRight } from "lucide-react"
import { motion } from "motion/react"

const cards = [
	{
		title: "Puntuación PageSpeed",
		label: "Promedio en producción",
		value: "100",
		source: "Lighthouse",
		bg: "#c7e8d4",
		tint: "#4a8f6b",
	},
	{
		title: "Tiempo de carga",
		label: "Time to Interactive",
		value: "<2s",
		source: "Core Web Vitals",
		bg: "#dcd0f5",
		tint: "#6b5aa3",
	},
	{
		title: "Disponibilidad",
		label: "Uptime garantizado",
		value: "99.9%",
		source: "Status histórico",
		bg: "#ffd4b8",
		tint: "#b86535",
	},
]

const SHORT = 380
const TALL = 470
const CYCLE_MS = 2200

export default function WebStats() {
	const [active, setActive] = useState(0)
	const [isDesktop, setIsDesktop] = useState(false)

	useEffect(() => {
		const mq = window.matchMedia("(min-width: 768px)")
		const update = () => setIsDesktop(mq.matches)
		update()
		mq.addEventListener("change", update)
		return () => mq.removeEventListener("change", update)
	}, [])

	useEffect(() => {
		if (!isDesktop) return
		const id = setInterval(() => {
			setActive((a) => (a + 1) % cards.length)
		}, CYCLE_MS)
		return () => clearInterval(id)
	}, [isDesktop])

	return (
		<section className="bg-background flex w-full items-start px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
			<div className="mx-auto w-full max-w-6xl">
				<motion.div
					initial={{ opacity: 0, y: 12 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
					className="text-center"
				>
					<h2 className="text-foreground text-4xl font-medium tracking-tight sm:text-5xl md:text-6xl">
						Rendimiento comprobado
					</h2>
					<p className="text-muted-foreground mt-3 text-base sm:text-lg">
						Cada sitio que entregamos cumple los estándares más altos de rendimiento, accesibilidad
						y optimización para buscadores.
					</p>
				</motion.div>

				<div className="mt-10 grid grid-cols-1 gap-5 sm:mt-14 sm:gap-6 md:grid-cols-3">
					{cards.map((c, i) => (
						<div key={i} className="flex items-end md:h-117.5">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								animate={
									isDesktop
										? {
												height: active === i ? TALL : SHORT,
												color: active === i ? "#171717" : c.tint,
											}
										: { height: "auto", color: "#171717" }
								}
								transition={{
									opacity: { duration: 0.5, delay: 0.1 * i },
									y: { duration: 0.5, delay: 0.1 * i },
									height: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
									color: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
								}}
								style={{ backgroundColor: c.bg }}
								className="flex w-full flex-col justify-between gap-10 overflow-hidden rounded-2xl p-6 sm:p-8"
							>
								<span className="text-xl font-medium sm:text-2xl">{c.title}</span>
								<div className="flex flex-col gap-2">
									{c.label && <span className="text-2xl font-medium sm:text-3xl">{c.label}</span>}
									<span className="text-3xl font-medium tracking-tight sm:text-4xl md:text-5xl">
										{c.value}
									</span>
									<a
										href="#"
										className="mt-4 inline-flex items-center gap-1 text-xs font-bold hover:underline sm:text-sm"
									>
										<ArrowUpRight className="h-3.5 w-3.5" />
										{c.source}
									</a>
								</div>
							</motion.div>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}
