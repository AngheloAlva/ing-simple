"use client"

import { motion } from "motion/react"
import { useState } from "react"

const cards = [
	{
		number: 1,
		title: "Descubrimiento",
		link: "Conoce el proceso",
		items: ["Reunión de diagnóstico", "Definición de objetivos", "Propuesta a medida"],
		image:
			"https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop",
	},
	{
		number: 2,
		title: "Diseño y Desarrollo",
		link: "Ver tecnologías",
		items: [
			"Wireframes y prototipos",
			"Desarrollo frontend",
			"Integraciones y CMS",
			"Testing en dispositivos",
		],
		image:
			"https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop",
	},
	{
		number: 3,
		title: "Lanzamiento",
		link: "Soporte incluido",
		items: ["Despliegue en producción", "Capacitación de uso"],
		image:
			"https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
	},
]

export function WebHowItWorks() {
	const [hoveredCard, setHoveredCard] = useState<number | null>(null)

	return (
		<section className="bg-background w-full px-4 py-12 sm:px-6 lg:px-8" aria-label="How it works">
			<div className="mx-auto w-full max-w-6xl">
				<motion.h2
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="text-foreground mb-10 text-center text-2xl font-medium tracking-tight sm:mb-12 sm:text-3xl md:text-4xl lg:mb-16 lg:text-5xl"
				>
					¿Cómo Trabajamos?
				</motion.h2>

				<div className="mb-10 grid grid-cols-1 gap-4 sm:mb-12 md:grid-cols-3 lg:mb-16 lg:gap-6">
					{cards.map((card, idx) => (
						<motion.article
							key={card.number}
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: idx * 0.1 }}
							className="bg-muted relative flex min-h-100 cursor-crosshair flex-col overflow-hidden rounded-2xl sm:min-h-112.5 lg:min-h-125"
							onMouseEnter={() => setHoveredCard(card.number)}
							onMouseLeave={() => setHoveredCard(null)}
							aria-label={`Step ${card.number}: ${card.title}`}
						>
							<motion.div
								className="absolute inset-0 bg-cover bg-center"
								style={{ backgroundImage: `url(${card.image})` }}
								initial={{ opacity: 0, scale: 1.1 }}
								animate={{
									opacity: hoveredCard === card.number ? 1 : 0,
									scale: hoveredCard === card.number ? 1 : 1.1,
								}}
								transition={{ duration: 0.5, ease: "easeOut" }}
							/>
							<motion.div
								className="absolute inset-0 bg-black/60"
								initial={{ opacity: 0 }}
								animate={{ opacity: hoveredCard === card.number ? 1 : 0 }}
								transition={{ duration: 0.4, ease: "easeOut" }}
							/>

							<div className="relative z-10 flex h-full flex-col px-6 pt-6 sm:px-8 sm:pt-8">
								<div className="flex-1">
									<div
										className={`mb-4 flex h-8 w-8 items-center justify-center rounded-xl text-sm font-bold transition-colors duration-300 ${
											hoveredCard === card.number
												? "bg-white text-neutral-900"
												: "bg-foreground text-background"
										}`}
									>
										{card.number}
									</div>

									<h3
										className={`mb-2 text-xl leading-tight font-medium tracking-tight transition-colors duration-300 sm:text-2xl lg:text-3xl ${
											hoveredCard === card.number ? "text-white" : "text-foreground"
										}`}
									>
										{card.title}
									</h3>

									{/*<a
										href="#"
										className={`group inline-flex items-center gap-2 text-sm font-medium transition-colors duration-300 ${
											hoveredCard === card.number
												? "text-white/90 hover:text-white"
												: "text-muted-foreground hover:text-foreground"
										}`}
									>
										{card.link}
										<ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
									</a>*/}
								</div>

								<div className="-mx-6 mt-auto sm:-mx-8">
									{card.items.map((item, itemIdx) => (
										<div
											key={itemIdx}
											className={`border-t px-6 py-3 transition-colors duration-300 ${
												hoveredCard === card.number
													? "border-white/20 text-white/90"
													: "border-border text-muted-foreground"
											}`}
										>
											<span className="text-sm">{item}</span>
										</div>
									))}
								</div>
							</div>
						</motion.article>
					))}
				</div>
			</div>
		</section>
	)
}
