"use client"

import { BarChart3, AppWindow, Table2, Workflow } from "lucide-react"
import { useEffect, useRef } from "react"
import { motion } from "motion/react"
import Image from "next/image"

export function TrainingFeatures() {
	const marquee1Ref = useRef<HTMLDivElement>(null)
	const marquee2Ref = useRef<HTMLDivElement>(null)

	const features = [
		{
			icon: BarChart3,
			description: "Visualización de datos y dashboards interactivos con Power BI",
		},
		{
			icon: AppWindow,
			description: "Desarrollo de aplicaciones empresariales con Power Apps",
		},
		{
			icon: Table2,
			description: "Excel avanzado: fórmulas, tablas dinámicas y automatización",
		},
		{
			icon: Workflow,
			description: "Automatización de procesos repetitivos con Power Automate",
		},
	]

	const images = [
		{
			name: "Capacitación Power BI",
			url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop",
		},
		{
			name: "Workshop grupal",
			url: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
		},
		{
			name: "Sesión práctica",
			url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop",
		},
		{
			name: "Formación técnica",
			url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop",
		},
		{
			name: "Capacitación corporativa",
			url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop",
		},
		{
			name: "Taller de datos",
			url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2070&auto=format&fit=crop",
		},
	]

	useEffect(() => {
		const marquee1 = marquee1Ref.current
		const marquee2 = marquee2Ref.current

		if (!marquee1 || !marquee2) return

		let animation1: number
		let progress1 = 0
		let progress2 = 50

		const animate = () => {
			progress1 += 0.03
			if (progress1 >= 50) {
				progress1 = 0
			}
			marquee1.style.transform = `translateY(-${progress1}%)`

			progress2 -= 0.03
			if (progress2 <= 0) {
				progress2 = 50
			}
			marquee2.style.transform = `translateY(-${progress2}%)`

			animation1 = requestAnimationFrame(animate)
		}

		animation1 = requestAnimationFrame(animate)

		return () => {
			cancelAnimationFrame(animation1)
		}
	}, [])

	return (
		<section className="bg-background w-full px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-8 lg:py-24">
			<div className="mx-auto max-w-6xl">
				<div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-3 lg:gap-12">
					{/* Left Column - 2/3 width */}
					<div className="flex flex-col lg:col-span-2">
						{/* Header */}
						<div className="mb-8 md:mb-12">
							<motion.p
								initial={{ opacity: 0, y: 10 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.4 }}
								className="text-muted-foreground mb-4 text-sm sm:text-base"
							>
								Nuestras Capacitaciones
							</motion.p>

							<motion.h2
								initial={{ opacity: 0, y: 10 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.4, delay: 0.1 }}
								className="text-foreground mb-6 text-3xl font-normal sm:text-4xl md:text-5xl lg:text-6xl"
							>
								Formación práctica en herramientas clave
							</motion.h2>

							<motion.p
								initial={{ opacity: 0, y: 10 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.4, delay: 0.2 }}
								className="text-muted-foreground max-w-2xl text-base sm:text-lg"
							>
								Capacitamos a tu equipo en las herramientas del ecosistema Microsoft que realmente
								mueven la aguja: análisis de datos, automatización y desarrollo de aplicaciones.
							</motion.p>
						</div>

						{/* Features Grid - 2x2 */}
						<div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-8">
							{features.map((feature, index) => {
								const Icon = feature.icon
								return (
									<motion.div
										key={index}
										initial={{ opacity: 0, y: 20 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true }}
										transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
										className="flex items-start gap-3 sm:gap-4"
									>
										{/* Icon */}
										<div className="bg-background shadow-foreground/10 border-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border shadow-lg sm:h-12 sm:w-12">
											<Icon className="h-5 w-5 text-orange-500 sm:h-6 sm:w-6" />
										</div>

										{/* Description */}
										<p className="text-muted-foreground text-sm leading-relaxed sm:max-w-[20ch] sm:text-base sm:tracking-tighter">
											{feature.description}
										</p>
									</motion.div>
								)
							})}
						</div>
					</div>

					{/* Right Column - 1/3 width - Marquees */}
					<div className="relative h-50 lg:col-span-1 lg:h-175">
						<div className="relative grid h-full grid-cols-2 gap-4 overflow-hidden">
							{/* Gradient Overlays */}
							<div className="pointer-events-none absolute inset-0 z-10">
								<div className="from-background absolute top-0 right-0 left-0 h-24 bg-linear-to-b to-transparent" />
								<div className="from-background absolute right-0 bottom-0 left-0 h-24 bg-linear-to-t to-transparent" />
							</div>

							{/* Marquee 1 - Scrolling Down */}
							<div className="relative overflow-hidden">
								<motion.div
									initial={{ opacity: 0 }}
									whileInView={{ opacity: 1 }}
									viewport={{ once: true }}
									transition={{ duration: 0.6 }}
									ref={marquee1Ref}
									className="flex flex-col gap-4"
								>
									{[...images, ...images].map((image, index) => (
										<div
											key={`marquee1-${index}`}
											className="border-muted-foreground bg-muted flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl border"
										>
											<Image
												width={166}
												height={166}
												src={image.url}
												alt={image.name}
												className="h-full w-full object-cover opacity-80 grayscale transition-opacity duration-300 hover:opacity-100"
											/>
										</div>
									))}
								</motion.div>
							</div>

							{/* Marquee 2 - Scrolling Up */}
							<div className="relative overflow-hidden">
								<motion.div
									initial={{ opacity: 0 }}
									whileInView={{ opacity: 1 }}
									viewport={{ once: true }}
									transition={{ duration: 0.6, delay: 0.1 }}
									ref={marquee2Ref}
									className="flex flex-col gap-4"
								>
									{[...images, ...images].map((image, index) => (
										<div
											key={`marquee2-${index}`}
											className="border-muted-foreground bg-muted flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl border"
										>
											<Image
												width={166}
												height={166}
												src={image.url}
												alt={image.name}
												className="h-full w-full object-cover opacity-80 grayscale transition-opacity duration-300 hover:opacity-100"
											/>
										</div>
									))}
								</motion.div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
