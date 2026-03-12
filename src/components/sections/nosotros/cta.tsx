"use client"

import { ChevronRight } from "lucide-react"
import { motion } from "motion/react"
import Link from "next/link"

import type { ReactNode } from "react"

const images = [
	{
		id: 1,
		url: "/svg/placeholder.svg",
		alt: "Dashboards y reportes",
	},
	{
		id: 2,
		url: "/svg/placeholder.svg",
		alt: "Automatización de procesos",
	},
	{
		id: 3,
		url: "/svg/placeholder.svg",
		alt: "Equipo colaborando",
	},
	{
		id: 4,
		url: "/svg/placeholder.svg",
		alt: "Capacitación de equipos",
	},
	{
		id: 5,
		url: "/svg/placeholder.svg",
		alt: "Desarrollo web moderno",
	},
	{
		id: 6,
		url: "/svg/placeholder.svg",
		alt: "Análisis de datos",
	},
	{
		id: 7,
		url: "/svg/placeholder.svg",
		alt: "Power Platform",
	},
	{
		id: 8,
		url: "/svg/placeholder.svg",
		alt: "Transformación digital",
	},
]

const duplicatedImages = [...images, ...images]

export function NosotrosCta(): ReactNode {
	return (
		<section className="bg-background flex min-h-screen w-full flex-col items-center overflow-hidden">
			{/* Content */}
			<div className="mx-auto flex w-full max-w-6xl items-center justify-center px-4 py-16 sm:px-6 md:py-24 lg:px-8">
				<div className="space-y-6 text-center">
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="text-foreground text-3xl leading-tight font-normal text-pretty sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
					>
						transformemos lo <span className="font-light italic">complejo</span> en simple
					</motion.h2>

					<motion.p
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.1 }}
						className="text-muted-foreground mx-auto max-w-xl text-base leading-relaxed md:text-lg"
					>
						Contanos sobre tu proyecto y encontremos juntos la solución más efectiva para tu
						organización.
					</motion.p>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className="flex justify-center"
					>
						<Link
							href="/contacto"
							className="bg-accent shadow-accent/25 hover:shadow-accent/40 group inline-flex items-center gap-3 rounded-md py-3 pr-3 pl-5 font-medium text-white shadow-lg transition-all duration-500 ease-out hover:rounded-[50px] hover:shadow-xl"
						>
							<span>Conversemos</span>
							<span className="bg-background text-foreground flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110">
								<ChevronRight className="relative left-px h-4 w-4" />
							</span>
						</Link>
					</motion.div>
				</div>
			</div>

			{/* Marquee */}
			<div className="w-full overflow-x-clip pb-16 md:pb-24">
				<div className="relative">
					<motion.div
						className="flex gap-4 sm:gap-6 md:gap-8"
						animate={{ x: ["0%", "-50%"] }}
						transition={{
							x: {
								duration: 40,
								ease: "linear",
								repeat: Infinity,
								repeatType: "loop",
							},
						}}
						style={{ willChange: "transform" }}
					>
						{duplicatedImages.map((image, index) => (
							<div
								key={`${image.id}-${index}`}
								className={`bg-muted h-44 w-32 shrink-0 overflow-hidden rounded-lg sm:h-48 sm:w-36 md:h-56 md:w-44 lg:h-64 lg:w-48 ${
									index % 2 === 1 ? "-mt-8 sm:-mt-10 md:-mt-12 lg:-mt-16" : ""
								}`}
							>
								<img src={image.url} alt={image.alt} className="h-full w-full object-cover" />
							</div>
						))}
					</motion.div>
				</div>
			</div>
		</section>
	)
}
